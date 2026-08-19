import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  VERB_FORM_LABEL_KEY,
  VERB_GROUP_LABEL_KEY,
  VerbForm,
  VerbForms,
  VerbGroup,
  conjugate,
  isIrregularVerb,
} from '../../core/japanese/conjugation';
import { LanguageStore } from '../../core/i18n/language-store';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import {
  AnswerMode,
  DEFAULT_MAX_WRONG_ATTEMPTS,
  DIRECTIONS,
  directionNeedsReading,
  PracticeConfig,
  PracticeDirection,
  PracticeScope,
  VERB_MODES,
  VerbPracticeMode,
  directionInfo,
  verbModeInfo,
} from '../../core/models/practice.model';
import {
  ConversationLine,
  Lesson,
  LessonKind,
  VerbEntry,
  VocabularyWord,
} from '../../core/models/vocabulary.model';
import { buildQuestions, PracticePool } from '../../core/practice/build-questions';
import { FORMS_BY_MODE } from '../../core/practice/verb-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { normalizeSearch } from '../../core/utils/lesson-search';

/** Các mốc số câu cho phép chọn nhanh. */
const LIMIT_CHOICES = [10, 20, 30, 50] as const;

/** Một động từ kèm kết quả chia, hoặc lý do không chia được. */
interface VerbRow {
  entry: VerbEntry;
  forms: VerbForms | null;
  error: string | null;
  irregular: boolean;
}

@Component({
  selector: 'app-lesson-detail',
  imports: [RouterLink, T],
  templateUrl: './lesson-detail.html',
  styleUrl: './lesson-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly lessonStore = inject(LessonStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);
  readonly directions = DIRECTIONS;
  readonly verbModes = VERB_MODES;
  readonly formLabelKey = VERB_FORM_LABEL_KEY;
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;

  readonly lessonId = signal('');
  readonly lesson = signal<Lesson | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  // --- Thiết lập luyện tập ---
  readonly scope = signal<PracticeScope>('all');
  readonly answerMode = signal<AnswerMode>('choice');
  readonly showHanViet = signal(true);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);
  readonly questionLimit = signal<number | null>(null);
  // Riêng bài từ vựng
  readonly direction = signal<PracticeDirection>('jp-vi');
  // Riêng bài động từ
  readonly verbMode = signal<VerbPracticeMode>('masu-to-form');
  readonly selectedForms = signal<VerbForm[]>(['te']);

  // --- Bộ lọc bảng ---
  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  readonly isVerbLesson = computed(() => this.lesson()?.kind === 'verb');
  readonly isConversationLesson = computed(() => this.lesson()?.kind === 'conversation');
  readonly words = computed(() => this.lesson()?.words ?? []);
  readonly verbs = computed(() => this.lesson()?.verbs ?? []);
  readonly lines = computed(() => this.lesson()?.lines ?? []);

  /** Toàn bộ mục của bài, không phân biệt loại — dùng cho Favorite và đếm. */
  readonly items = computed<{ id: string }[]>(() => {
    if (this.isVerbLesson()) return this.verbs();
    if (this.isConversationLesson()) return this.lines();
    return this.words();
  });

  /** Đọc qua signal của FavoriteStore để danh sách tự cập nhật khi bấm sao. */
  readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(this.lessonId()));
  });

  readonly favoriteCount = computed(
    () => this.items().filter((item) => this.favoriteIds().has(item.id)).length,
  );

  /**
   * Khoá nhãn theo loại bài. Tra bảng thay vì viết ternary trong template — thêm
   * loại bài thứ tư mà quên khai báo thì TypeScript báo lỗi ngay tại bảng.
   */
  readonly kindLabelKeys = computed(() => {
    const kind = this.lesson()?.kind ?? 'vocabulary';
    const table: Record<LessonKind, { title: MessageKey; search: MessageKey; unit: MessageKey }> = {
      vocabulary: {
        title: 'lesson.table.vocabulary',
        search: 'lesson.search.vocabulary',
        unit: 'kind.vocabulary.unit',
      },
      verb: {
        title: 'lesson.table.verb',
        search: 'lesson.search.verb',
        unit: 'kind.verb.unit',
      },
      conversation: {
        title: 'lesson.table.conversation',
        search: 'lesson.search.conversation',
        unit: 'kind.conversation.unit',
      },
      // Bài ngữ pháp không bao giờ được vẽ ở màn hình này (xem `load` — nó chuyển
      // hướng sang /grammar/:id). Vẫn phải khai báo vì bảng là Record đủ mọi loại,
      // và chính đòi hỏi đó là thứ nhắc người thêm loại bài thứ năm phải ghé qua đây.
      grammar: {
        title: 'kind.grammar',
        search: 'lesson.search.vocabulary',
        unit: 'kind.grammar.unit',
      },
      // Bài tập cũng không bao giờ được vẽ ở đây: nó không tới từ file bài học nào
      // nên `getLesson` không trả về loại này. Vẫn phải khai báo, cùng lý do trên.
      exercise: {
        title: 'kind.exercise',
        search: 'lesson.search.verb',
        unit: 'kind.exercise.unit',
      },
    };
    return table[kind];
  });

  /** Chỉ hiện cột ví dụ khi bài có ít nhất một câu — tránh cột trống vô ích. */
  readonly hasExamples = computed(() => this.words().some((word) => word.example.length > 0));
  readonly hasReadings = computed(() => this.words().some((word) => word.reading.length > 0));

  readonly specialVerbs = computed(() => this.verbs().filter((verb) => verb.deceptive));
  readonly specialCount = computed(() => this.specialVerbs().length);

  /** Động từ đã chia sẵn để hiện bảng tra cứu. */
  readonly verbRows = computed<VerbRow[]>(() =>
    this.verbs().map((entry) => {
      const result = conjugate(entry.masu, entry.group);
      return {
        entry,
        forms: result.ok ? result.forms : null,
        error: result.ok ? null : result.reason,
        irregular: isIrregularVerb(entry.masu),
      };
    }),
  );

  /** Động từ khai báo sai nhóm — cảnh báo ngay để không lòi ra lúc đang luyện. */
  readonly brokenVerbs = computed(() => this.verbRows().filter((row) => row.error !== null));

  readonly currentDirection = computed(() => directionInfo(this.direction()));

  /**
   * Chỉ hiện chiều luyện dùng được với bài này. Bài chưa khai báo cách đọc thì
   * hai chiều liên quan biến mất thay vì hiện ra rồi cho ra câu hỏi rỗng.
   */
  readonly availableDirections = computed(() => {
    // Bài hội thoại chỉ dịch qua lại Nhật/Việt — không có âm Hán Việt hay cách đọc
    // cho cả một câu.
    if (this.isConversationLesson()) {
      return this.directions.filter((item) => item.id === 'jp-vi' || item.id === 'vi-jp');
    }
    return this.directions.filter((item) => this.hasReadings() || !directionNeedsReading(item.id));
  });

  /**
   * Bài hội thoại chỉ cho gõ đáp án. Bốn câu dài bày ra để chọn thì đọc lướt là
   * ra đáp án mà chẳng phải dịch — mất hẳn ý nghĩa của bài.
   */
  readonly answerModeLocked = computed(() => this.isConversationLesson());
  readonly currentVerbMode = computed(() => verbModeInfo(this.verbMode()));
  readonly availableForms = computed(() => FORMS_BY_MODE[this.verbMode()]);

  /** Tập mục sẽ đem ra hỏi theo phạm vi đang chọn. */
  readonly pool = computed<PracticePool>(() => {
    if (this.isVerbLesson()) {
      return { kind: 'verb', verbs: this.filterVerbs() };
    }
    if (this.isConversationLesson()) {
      return { kind: 'conversation', lines: this.filterLines() };
    }
    return { kind: 'vocabulary', words: this.filterWords() };
  });

  readonly poolSize = computed(() => {
    const pool = this.pool();
    // switch chứ không phải chuỗi if: màn hình này không bao giờ dựng pool ngữ pháp
    // (bài đó đã được chuyển hướng đi từ `load`), nhưng để nhánh mặc định trả về
    // `pool.words` thì thêm loại pool mới sẽ đếm nhầm mà chẳng báo gì.
    switch (pool.kind) {
      case 'verb':
        return pool.verbs.length;
      case 'conversation':
        return pool.lines.length;
      case 'vocabulary':
        return pool.words.length;
      case 'grammar':
        return pool.examples.length;
    }
  });

  /**
   * Số câu sẽ luyện. Bài động từ sinh một câu cho mỗi cặp (động từ × thể) nên số
   * câu bằng số động từ nhân số thể đang chọn.
   */
  readonly plannedQuestionCount = computed(() => {
    const size = this.poolSize();
    const perItem =
      this.isVerbLesson() && this.currentVerbMode().needsForms
        ? Math.max(1, this.selectedForms().length)
        : 1;
    const total = size * perItem;
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() => {
    const size = this.poolSize();
    const perItem =
      this.isVerbLesson() && this.currentVerbMode().needsForms
        ? Math.max(1, this.selectedForms().length)
        : 1;
    return LIMIT_CHOICES.filter((limit) => limit < size * perItem);
  });

  readonly filteredWords = computed<VocabularyWord[]>(() => {
    const base = this.onlyFavorites()
      ? this.words().filter((w) => this.favoriteIds().has(w.id))
      : this.words();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((word) =>
      normalizeSearch(
        `${word.hanViet} ${word.japanese} ${word.reading} ${word.vietnamese} ${word.example}`,
      ).includes(keyword),
    );
  });

  readonly filteredLines = computed<ConversationLine[]>(() => {
    const base = this.onlyFavorites()
      ? this.lines().filter((line) => this.favoriteIds().has(line.id))
      : this.lines();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((line) =>
      normalizeSearch(
        `${line.speaker} ${line.section} ${line.japanese} ${line.vietnamese}`,
      ).includes(keyword),
    );
  });

  readonly filteredVerbRows = computed<VerbRow[]>(() => {
    const base = this.onlyFavorites()
      ? this.verbRows().filter((row) => this.favoriteIds().has(row.entry.id))
      : this.verbRows();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((row) =>
      normalizeSearch(
        `${row.entry.hanViet} ${row.entry.masu} ${row.entry.vietnamese} ${formsText(row.forms)}`,
      ).includes(keyword),
    );
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id') ?? '';
      this.lessonId.set(id);
      this.resetView();
      void this.load(id);
    });
  }

  private async load(id: string): Promise<void> {
    this.loading.set(true);
    this.notFound.set(false);
    const lesson = await this.lessonStore.getLesson(id);

    // Bài ngữ pháp có màn hình riêng. Đường dẫn cũ hoặc link chép tay vẫn có thể trỏ
    // vào đây, nên đưa sang đúng chỗ thay vì vẽ ra một trang trống (bài ngữ pháp
    // không có words/verbs/lines nên mọi bảng ở màn hình này đều rỗng).
    if (lesson?.kind === 'grammar') {
      void this.router.navigate(['/grammar', id], { replaceUrl: true });
      return;
    }

    this.lesson.set(lesson);
    this.notFound.set(lesson === null);
    this.loading.set(false);
  }

  private resetView(): void {
    this.lesson.set(null);
    this.search.set('');
    this.onlyFavorites.set(false);
    this.scope.set('all');
    this.questionLimit.set(null);
    this.verbMode.set('masu-to-form');
    this.selectedForms.set(['te']);
  }

  private filterLines(): ConversationLine[] {
    return this.scope() === 'favorite'
      ? this.lines().filter((line) => this.favoriteIds().has(line.id))
      : this.lines();
  }

  private filterWords(): VocabularyWord[] {
    const scoped =
      this.scope() === 'favorite'
        ? this.words().filter((word) => this.favoriteIds().has(word.id))
        : this.words();

    // Bài điền cách đọc dở dang (một số từ có, một số không) thì ở chiều liên quan
    // tới cách đọc phải bỏ hẳn những từ thiếu — nếu không, câu hỏi hoặc đáp án sẽ
    // rỗng. Lọc ở đây chứ không ở nơi dựng câu hỏi để số câu hiện trên màn hình
    // thiết lập khớp với số câu thật sự luyện.
    const info = this.currentDirection();
    if (info.prompt !== 'reading' && info.answer !== 'reading') return scoped;
    return scoped.filter((word) => word.reading.length > 0);
  }

  private filterVerbs(): VerbEntry[] {
    switch (this.scope()) {
      case 'favorite':
        return this.verbs().filter((verb) => this.favoriteIds().has(verb.id));
      case 'special':
        return this.specialVerbs();
      default:
        return this.verbs();
    }
  }

  // --- Sự kiện thiết lập ---

  setScope(scope: PracticeScope): void {
    this.scope.set(scope);
    this.questionLimit.set(null);
  }

  setDirection(direction: PracticeDirection): void {
    this.direction.set(direction);
  }

  setAnswerMode(mode: AnswerMode): void {
    this.answerMode.set(mode);
  }

  setQuestionLimit(limit: number | null): void {
    this.questionLimit.set(limit);
  }

  setVerbMode(mode: VerbPracticeMode): void {
    this.verbMode.set(mode);
    this.questionLimit.set(null);

    // Giữ lại các thể vẫn hợp lệ ở dạng mới; hết sạch thì quay về mặc định.
    const allowed = FORMS_BY_MODE[mode];
    const kept = this.selectedForms().filter((form) => allowed.includes(form));
    this.selectedForms.set(kept.length > 0 ? kept : allowed.length > 0 ? [allowed[0]] : []);
  }

  isFormSelected(form: VerbForm): boolean {
    return this.selectedForms().includes(form);
  }

  toggleForm(form: VerbForm): void {
    const current = this.selectedForms();
    // Luôn phải còn ít nhất một thể được chọn.
    if (current.includes(form) && current.length === 1) return;

    this.selectedForms.set(
      current.includes(form) ? current.filter((f) => f !== form) : [...current, form],
    );
    this.questionLimit.set(null);
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  toggleShowHanViet(event: Event): void {
    this.showHanViet.set((event.target as HTMLInputElement).checked);
  }

  toggleShuffle(event: Event): void {
    this.shuffleQuestions.set((event.target as HTMLInputElement).checked);
  }

  toggleIgnoreDiacritics(event: Event): void {
    this.ignoreDiacritics.set((event.target as HTMLInputElement).checked);
  }

  toggleOnlyFavorites(event: Event): void {
    this.onlyFavorites.set((event.target as HTMLInputElement).checked);
  }

  // --- Favorite ---

  isFavorite(itemId: string): boolean {
    return this.favoriteIds().has(itemId);
  }

  toggleFavorite(itemId: string): void {
    this.favoriteStore.toggle(this.lessonId(), itemId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(this.lessonId());
    }
  }

  markSpecialAsFavorite(): void {
    this.favoriteStore.add(
      this.lessonId(),
      this.specialVerbs().map((verb) => verb.id),
    );
  }

  // --- Bắt đầu ---

  start(): void {
    const lesson = this.lesson();
    if (!lesson || !this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: lesson.id,
      lessonKind: lesson.kind,
      scope: this.scope(),
      // Bài hội thoại luôn là gõ đáp án, kể cả khi người dùng từng chọn trắc nghiệm
      // ở một bài khác trước đó.
      answerMode: this.answerModeLocked() ? 'typing' : this.answerMode(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: this.direction(),
      showHanViet: this.showHanViet(),
      // Chỉ bài ngữ pháp dùng tới, nhưng PracticeConfig là một khối thiết lập đầy đủ
      // chứ không phải union theo loại bài, nên trường nào cũng phải có giá trị.
      showGrammarHint: true,
      verbMode: this.verbMode(),
      verbForms: this.selectedForms(),
      // Chỉ khu /exercise dùng tới, xem ghi chú ngay trên về showGrammarHint.
      exercise: null,
      exerciseMode: 'masu-to-form',
    };

    const questions = buildQuestions(lesson, this.pool(), config);
    if (this.session.start({ id: lesson.id, name: lesson.name }, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }

  deleteCustomLesson(): void {
    const lesson = this.lesson();
    if (!lesson || lesson.origin !== 'custom') return;
    if (!confirm(this.lang.t('lesson.confirm.delete', { name: lesson.name }))) return;
    this.lessonStore.deleteCustomLesson(lesson.id);
    this.favoriteStore.clearLesson(lesson.id);
    void this.router.navigate(['/']);
  }

  groupOf(group: VerbGroup): string {
    return this.lang.t(VERB_GROUP_LABEL_KEY[group]);
  }

  /** Khoá nhãn nhóm — dùng với <app-t> để bề rộng cột không đổi theo ngôn ngữ. */
  groupKeyOf(group: VerbGroup) {
    return VERB_GROUP_LABEL_KEY[group];
  }

  /** Nhãn ngắn của kiểu luyện đang chọn, dùng cho dòng tóm tắt trước khi bắt đầu. */
  readonly modeShort = computed(() =>
    this.lang.t(
      this.isVerbLesson() ? this.currentVerbMode().shortKey : this.currentDirection().shortKey,
    ),
  );
}

function formsText(forms: VerbForms | null): string {
  return forms ? `${forms.dictionary} ${forms.te} ${forms.ta} ${forms.nai}` : '';
}
