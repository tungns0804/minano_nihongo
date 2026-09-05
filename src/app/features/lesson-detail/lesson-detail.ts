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
  directionInfo,
  directionIsUsable,
  DIRECTIONS,
  directionUsesField,
  LIMIT_CHOICES,
  practiceConfig,
  PracticeConfig,
  PracticeDirection,
  PracticeScope,
  VERB_MODES,
  verbModeInfo,
  VerbPracticeMode,
} from '../../core/models/practice.model';
import {
  ConversationLine,
  LESSON_KIND_TAB,
  LESSON_TAB_ROUTE,
  Lesson,
  LessonKind,
  OPTIONAL_WORD_FIELDS,
  VerbEntry,
  VocabularyWord,
  WordField,
  fieldValue,
  hasWordField,
} from '../../core/models/vocabulary.model';
import { batchCount, batchRange } from '../../core/practice/batch';
import { buildQuestions, PracticePool } from '../../core/practice/build-questions';
import { FORMS_BY_MODE } from '../../core/practice/verb-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { VocabAudioPlayer } from '../../core/services/vocab-audio-player';
import { checkedOf, valueOf } from '../../core/utils/dom-events';
import { normalizeSearch } from '../../core/utils/lesson-search';


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
  /** Public: template gọi thẳng để biết nút loa của từng từ đang ở trạng thái nào. */
  readonly audio = inject(VocabAudioPlayer);

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
  /**
   * Cụm đang chọn, chưa kiểm tra còn hợp lệ hay không — đọc qua `batchIndex`.
   * null = không học theo cụm (trộn cả bài rồi lấy N câu, như trước giờ).
   */
  private readonly pickedBatch = signal<number | null>(null);
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

  /**
   * Nút "quay lại" phải trỏ về đúng tab đang liệt kê bài này.
   *
   * Bài từ vựng nằm ở trang chủ, còn bài chia động từ và bài dịch hội thoại nằm ở
   * tab Bài tập bổ trợ. Trỏ cứng về "/" như trước thì mở một bài động từ rồi bấm
   * quay lại sẽ rơi vào một danh sách KHÔNG chứa bài vừa xem — đúng kiểu lạc đường
   * mà người dùng không hiểu nổi tại sao.
   */
  readonly backRoute = computed(() => LESSON_TAB_ROUTE[LESSON_KIND_TAB[this.lesson()?.kind ?? 'vocabulary']]);

  /** Chữ trên nút quay lại, gọi đúng tên cái danh sách sắp quay về. */
  readonly backLabelKey = computed<MessageKey>(() => {
    const tab = LESSON_KIND_TAB[this.lesson()?.kind ?? 'vocabulary'];
    if (tab === 'exercise') return 'exercise.back';
    if (tab === 'topic') return 'topic.back';
    return 'common.back';
  });
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
      // Chủ đề dùng ĐÚNG màn hình này: cùng kiểu dữ liệu (`words`), cùng khung
      // thiết lập, cùng bảng tra. Chỉ nhãn là khác, để dòng đếm ghi "38 từ trong
      // chủ đề" thay vì "38 từ trong bài".
      topic: {
        title: 'lesson.table.topic',
        search: 'lesson.search.topic',
        unit: 'kind.topic.unit',
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
      // Khu Kanji cũng vậy: nội dung nằm ở `core/kanji/`, màn hình riêng là
      // /kanji và /kanji/:id.
      kanji: {
        title: 'kind.kanji',
        search: 'kanji.search',
        unit: 'kind.kanji.unit',
      },
      // Khu Bộ thủ cũng vậy: nội dung nằm ở `core/radical/`, màn hình riêng là
      // /radical và /radical/:id.
      radical: {
        title: 'kind.radical',
        search: 'radical.search',
        unit: 'kind.radical.unit',
      },
    };
    return table[kind];
  });

  /** Chỉ hiện cột ví dụ khi bài có ít nhất một câu — tránh cột trống vô ích. */
  readonly hasExamples = computed(() => this.words().some((word) => word.example.length > 0));
  readonly hasReadings = computed(() => hasWordField(this.words(), 'reading'));

  /**
   * Bài có âm Hán Việt không. Bài 総まとめ N3 gồm nhiều từ katakana và trạng từ
   * thuần kana nên có thể không có từ nào — lúc đó cột này và hai chiều luyện
   * jp-han / han-jp đều phải biến mất.
   */
  readonly hasHanViet = computed(() => hasWordField(this.words(), 'hanViet'));

  /** Bài này có trường đó không — dùng để lọc chiều luyện. */
  private readonly hasField = computed(() => {
    // Khai đủ bốn trường chứ không chỉ hai trường tuỳ chọn: thêm một trường mới vào
    // `WordField` mà quên xếp vào đây thì TypeScript báo lỗi ngay tại chỗ này.
    const present: Record<WordField, boolean> = {
      japanese: true,
      vietnamese: true,
      hanViet: this.hasHanViet(),
      reading: this.hasReadings(),
    };
    return (field: WordField): boolean => present[field];
  });

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
   * Có bật được gợi ý âm Hán Việt không.
   *
   * Hai điều kiện: chiều đang chọn phải cho phép (bật ở chiều jp-han / han-jp là lộ
   * đáp án), VÀ bài phải thực sự có âm Hán Việt — bài 総まとめ N3 toàn từ katakana
   * thì "gợi ý" chỉ là một ô trống.
   */
  readonly hanVietHintAvailable = computed(
    () => this.currentDirection().supportsHanVietHint && this.hasHanViet(),
  );

  /**
   * Chỉ hiện chiều luyện dùng được với bài này. Bài chưa khai báo cách đọc (hoặc
   * không có âm Hán Việt) thì các chiều liên quan biến mất thay vì hiện ra rồi cho
   * ra câu hỏi có đáp án rỗng.
   */
  readonly availableDirections = computed(() => {
    // Bài hội thoại chỉ dịch qua lại Nhật/Việt — không có âm Hán Việt hay cách đọc
    // cho cả một câu.
    if (this.isConversationLesson()) {
      return this.directions.filter((item) => item.id === 'jp-vi' || item.id === 'vi-jp');
    }
    const hasField = this.hasField();
    return this.directions.filter((item) => directionIsUsable(item.id, hasField));
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
   * Tổng số câu của phạm vi đang chọn, trước khi cắt. Bài động từ sinh một câu
   * cho mỗi cặp (động từ × thể) nên số câu bằng số động từ nhân số thể đang chọn.
   */
  readonly totalQuestionCount = computed(() => {
    const perItem =
      this.isVerbLesson() && this.currentVerbMode().needsForms
        ? Math.max(1, this.selectedForms().length)
        : 1;
    return this.poolSize() * perItem;
  });

  /**
   * Bài này chia được thành mấy cụm theo số câu đang chọn. 0 khi chưa chọn số
   * câu — lúc đó luyện cả bài một lượt, không có cụm nào.
   */
  readonly batchTotal = computed(() =>
    batchCount(this.totalQuestionCount(), this.questionLimit()),
  );

  /**
   * Cụm đang chọn, đã kiểm tra còn tồn tại.
   *
   * Đổi phạm vi hay đổi chiều luyện làm số câu co lại, nên cụm 5 chọn lúc trước
   * có thể không còn. Lọc ở đây thay vì rải lệnh reset khắp các hàm `set*`: quên
   * một chỗ là người dùng bấm "Bắt đầu" và nhận về một phiên rỗng.
   */
  readonly batchIndex = computed<number | null>(() => {
    const picked = this.pickedBatch();
    return picked !== null && picked < this.batchTotal() ? picked : null;
  });

  /** Các cụm để bày ra chọn, kèm khoảng thứ tự hiện cho người học. */
  readonly batchOptions = computed(() => {
    const limit = this.questionLimit();
    const total = this.totalQuestionCount();
    if (limit === null) return [];
    return Array.from({ length: this.batchTotal() }, (_, index) => ({
      index,
      ...batchRange(total, limit, index),
    }));
  });

  /** Số câu sẽ luyện của phiên sắp bắt đầu. */
  readonly plannedQuestionCount = computed(() => {
    const total = this.totalQuestionCount();
    const limit = this.questionLimit();
    if (limit === null) return total;

    // Cụm cuối thường ngắn hơn các cụm trước (bài 34 từ, cụm 10 → cụm 4 có 4 câu).
    const batch = this.batchIndex();
    return batch === null ? Math.min(limit, total) : Math.min(limit, total - batch * limit);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter((limit) => limit < this.totalQuestionCount()),
  );

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
    this.pickedBatch.set(null);
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

    // Bài điền dở dang một trường TUỲ CHỌN (một số từ có cách đọc, một số không;
    // một số có âm Hán Việt, một số không) thì ở chiều luyện đụng tới trường đó
    // phải bỏ hẳn những từ thiếu — nếu không, câu hỏi hoặc đáp án sẽ là chuỗi
    // rỗng: gõ gì cũng sai, mà chẳng có lỗi nào được báo.
    //
    // Duyệt CẢ `OPTIONAL_WORD_FIELDS` chứ không chỉ `reading` như trước. Trước
    // đây chưa lộ ra vì không bài nào trộn từ có và không có âm Hán Việt trong
    // cùng một bài — nhưng bài CHỦ ĐỀ thì trộn: nó gom từ 皆の日本語 (luôn có âm
    // Hán Việt) với từ 総まとめ N3 (nhiều từ katakana thì không).
    //
    // Lọc ở đây chứ không ở nơi dựng câu hỏi, để số câu hiện trên màn hình thiết
    // lập khớp với số câu thật sự luyện.
    const info = this.currentDirection();
    const needed = OPTIONAL_WORD_FIELDS.filter((field) => directionUsesField(info.id, field));
    if (needed.length === 0) return scoped;
    return scoped.filter((word) => needed.every((field) => fieldValue(word, field).length > 0));
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
    // Cụm 3 của "10 câu" không phải cụm 3 của "20 câu" — đổi số câu là chia lại
    // bài, nên quay về đầu thay vì giữ một con số nay mang nghĩa khác.
    this.pickedBatch.set(null);
  }

  setBatchIndex(index: number | null): void {
    this.pickedBatch.set(index);
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
    this.search.set(valueOf(event));
  }

  clearSearch(): void {
    this.search.set('');
  }

  toggleShowHanViet(event: Event): void {
    this.showHanViet.set(checkedOf(event));
  }

  toggleShuffle(event: Event): void {
    this.shuffleQuestions.set(checkedOf(event));
  }

  toggleIgnoreDiacritics(event: Event): void {
    this.ignoreDiacritics.set(checkedOf(event));
  }

  toggleOnlyFavorites(event: Event): void {
    this.onlyFavorites.set(checkedOf(event));
  }

  // --- Phát âm ---

  /**
   * Đọc to một từ. Bấm lại đúng từ đang đọc thì dừng.
   *
   * Không đụng gì tới Favorite hay bộ lọc: đây chỉ là nghe thử một từ trong lúc dò
   * bảng, không phải một thao tác học.
   */
  speak(word: VocabularyWord): void {
    this.audio.play(word);
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

    this.launch(lesson, this.buildConfig(lesson), this.pool());
  }

  /**
   * Luyện đúng MỘT câu hội thoại, theo chiều bấm ngay tại dòng đó.
   *
   * Không đọc và cũng không sửa các lựa chọn ở khung thiết lập: bấm vào một câu là
   * muốn dịch ngay câu đó theo chiều vừa bấm, chứ không phải đổi cấu hình của cả
   * bài. Vì vậy phạm vi, chiều, số câu và trộn thứ tự đều bị đè.
   */
  practiceLine(line: ConversationLine, direction: PracticeDirection): void {
    const lesson = this.lesson();
    if (!lesson) return;

    const config = this.buildConfig(lesson, {
      scope: 'single',
      direction,
      // Một câu thì không có gì để trộn, và cắt còn 10 câu lại càng vô nghĩa.
      shuffle: false,
      questionLimit: null,
      batchIndex: null,
    });

    this.launch(lesson, config, { kind: 'conversation', lines: [line] });
  }

  /**
   * Khối thiết lập của một phiên, dựng từ các lựa chọn đang hiện trên màn hình.
   *
   * Tách riêng vì có hai đường bắt đầu phiên — nút "Bắt đầu" cho cả bài và nút
   * luyện một câu ở từng dòng hội thoại — và chúng chỉ khác nhau vài trường. Chép
   * khối này ra làm hai bản thì thêm một tuỳ chọn mới sẽ chỉ có tác dụng ở một
   * trong hai đường, mà chẳng có gì báo.
   */
  private buildConfig(lesson: Lesson, overrides: Partial<PracticeConfig> = {}): PracticeConfig {
    return practiceConfig({
      lessonId: lesson.id,
      lessonKind: lesson.kind,
      scope: this.scope(),
      // Bài hội thoại luôn là gõ đáp án, kể cả khi người dùng từng chọn trắc nghiệm
      // ở một bài khác trước đó.
      answerMode: this.answerModeLocked() ? 'typing' : this.answerMode(),
      questionLimit: this.questionLimit(),
      batchIndex: this.batchIndex(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: this.direction(),
      showHanViet: this.showHanViet() && this.hanVietHintAvailable(),
      // Bài ngữ pháp mở từ đây luôn hiện gợi ý; khung thiết lập riêng của khu ngữ
      // pháp mới cho tắt.
      showGrammarHint: true,
      verbMode: this.verbMode(),
      verbForms: this.selectedForms(),
      ...overrides,
    });
  }

  private launch(lesson: Lesson, config: PracticeConfig, pool: PracticePool): void {
    const plan = buildQuestions(lesson, pool, config);
    if (this.session.start({ id: lesson.id, name: lesson.name }, config, plan)) {
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
