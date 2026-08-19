import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  DEFAULT_MODE,
  EXERCISE_LEVELS,
  ExerciseInfo,
  ExerciseLevel,
  ExerciseMode,
  ExerciseVerb,
  FORM_MODES,
  TRANSITIVITY_MODES,
  TransitivityPair,
  exerciseInfo,
  exerciseModeInfo,
  modeNeedsForms,
  modeQuestionsPerItem,
} from '../../core/exercises/exercise.model';
import { EXERCISE_VERBS } from '../../core/exercises/exercise-verbs';
import { TRANSITIVITY_PAIRS } from '../../core/exercises/transitive-pairs';
import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  VERB_FORM_LABEL_KEY,
  VERB_GROUP_LABEL_KEY,
  VerbForm,
  VerbForms,
  conjugate,
  isIrregularVerb,
} from '../../core/japanese/conjugation';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  PracticeConfig,
  PracticeScope,
} from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import {
  EXERCISE_FORMS,
  buildTransitivityQuestions,
  buildVerbFormQuestions,
} from '../../core/practice/exercise-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { normalizeSearch } from '../../core/utils/lesson-search';

/** Các mốc số câu cho phép chọn nhanh, giống màn hình chi tiết bài học. */
const LIMIT_CHOICES = [10, 20, 30, 50] as const;

/** Một động từ của bài chuyển thể, đã chia sẵn để hiện bảng tra cứu. */
interface VerbRow {
  verb: ExerciseVerb;
  forms: VerbForms | null;
  irregular: boolean;
}

/**
 * Màn hình một bài tập: thiết lập luyện + bảng tra cứu toàn bộ nội dung.
 *
 * Một component lo cả hai bài tập (rẽ nhánh theo `isTransitivity`) chứ không tách
 * đôi: chúng khác nhau đúng ở phần bảng và danh sách chiều hỏi, còn phạm vi, cấp
 * độ, số câu, ★, nút bắt đầu thì giống hệt — tách ra là chép lại toàn bộ phần đó.
 * Đây cũng là cách `features/lesson-detail` lo ba loại bài học.
 *
 * Phần chạy phiên và chấm điểm dùng lại nguyên vẹn: câu hỏi dựng ở
 * `core/practice/exercise-questions.ts` rồi đi qua đúng màn hình luyện tập và màn
 * hình kết quả như mọi bài học khác.
 */
@Component({
  selector: 'app-exercise-detail',
  imports: [RouterLink, T],
  templateUrl: './exercise-detail.html',
  styleUrl: './exercise-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);
  readonly formLabelKey = VERB_FORM_LABEL_KEY;
  readonly availableForms = EXERCISE_FORMS;
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;

  readonly exerciseId = signal('');
  readonly info = signal<ExerciseInfo | null>(null);

  // --- Thiết lập luyện tập ---
  readonly levels = signal<ExerciseLevel[]>([...EXERCISE_LEVELS]);
  readonly mode = signal<ExerciseMode>('to-transitive');
  readonly selectedForms = signal<VerbForm[]>(['te']);
  readonly scope = signal<PracticeScope>('all');
  readonly questionLimit = signal<number | null>(null);
  readonly shuffleQuestions = signal(true);
  readonly showMeaning = signal(true);

  // --- Bộ lọc bảng ---
  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  readonly notFound = computed(() => this.info() === null);
  readonly isTransitivity = computed(() => this.info()?.id === 'tu-tha-dong-tu');
  readonly availableLevels = computed<readonly ExerciseLevel[]>(() => this.info()?.levels ?? []);
  readonly modes = computed(() => (this.isTransitivity() ? TRANSITIVITY_MODES : FORM_MODES));
  readonly currentMode = computed(() => exerciseModeInfo(this.mode()));
  readonly needsForms = computed(() => modeNeedsForms(this.mode()));

  /** Đọc qua signal của FavoriteStore để bảng tự cập nhật khi bấm sao. */
  private readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(this.exerciseId()));
  });

  // --- Lọc theo cấp độ ---

  private readonly levelSet = computed(() => new Set(this.levels()));

  readonly levelPairs = computed<TransitivityPair[]>(() =>
    TRANSITIVITY_PAIRS.filter((pair) => this.levelSet().has(pair.level)),
  );

  readonly levelVerbs = computed<ExerciseVerb[]>(() =>
    EXERCISE_VERBS.filter((verb) => this.levelSet().has(verb.level)),
  );

  /**
   * Số mục của từng cấp, tính trên TOÀN BỘ dữ liệu chứ không trừ đi cấp đang chọn:
   * con số trên nút phải đứng yên khi bật tắt các cấp, nếu không người dùng sẽ
   * tưởng dữ liệu vừa biến mất.
   */
  readonly levelCounts = computed<Record<ExerciseLevel, number>>(() => {
    const counts = { N5: 0, N4: 0, N3: 0, N2: 0 } as Record<ExerciseLevel, number>;
    if (this.isTransitivity()) {
      for (const pair of TRANSITIVITY_PAIRS) counts[pair.level]++;
    } else {
      for (const verb of EXERCISE_VERBS) counts[verb.level]++;
    }
    return counts;
  });

  /** Tổng số mục trong các cấp đang chọn — dùng cho nhãn phạm vi "Toàn bộ". */
  readonly levelItemCount = computed(() =>
    this.isTransitivity() ? this.levelPairs().length : this.levelVerbs().length,
  );

  readonly specialVerbs = computed(() => this.levelVerbs().filter((verb) => verb.deceptive));
  readonly specialCount = computed(() => (this.isTransitivity() ? 0 : this.specialVerbs().length));

  readonly favoriteCount = computed(() => {
    const ids = this.favoriteIds();
    return this.isTransitivity()
      ? this.levelPairs().filter((pair) => ids.has(pair.id)).length
      : this.levelVerbs().filter((verb) => ids.has(verb.id)).length;
  });

  // --- Tập mục sẽ đem ra hỏi ---

  readonly poolPairs = computed<TransitivityPair[]>(() =>
    this.scope() === 'favorite'
      ? this.levelPairs().filter((pair) => this.favoriteIds().has(pair.id))
      : this.levelPairs(),
  );

  readonly poolVerbs = computed<ExerciseVerb[]>(() => {
    switch (this.scope()) {
      case 'favorite':
        return this.levelVerbs().filter((verb) => this.favoriteIds().has(verb.id));
      case 'special':
        return this.specialVerbs();
      default:
        return this.levelVerbs();
    }
  });

  readonly poolSize = computed(() =>
    this.isTransitivity() ? this.poolPairs().length : this.poolVerbs().length,
  );

  /**
   * Số câu sẽ luyện: mỗi mục sinh (số thể đang chọn) × (1 hoặc 2 chiều) câu.
   * Bài tự/tha động từ không chọn thể nên hệ số thể luôn là 1.
   */
  private readonly questionsPerItem = computed(() => {
    const forms = this.needsForms() ? Math.max(1, this.selectedForms().length) : 1;
    return forms * modeQuestionsPerItem(this.mode());
  });

  readonly plannedQuestionCount = computed(() => {
    const total = this.poolSize() * this.questionsPerItem();
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter((limit) => limit < this.poolSize() * this.questionsPerItem()),
  );

  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));

  // --- Bảng tra cứu ---

  readonly verbRows = computed<VerbRow[]>(() =>
    this.levelVerbs().map((verb) => {
      const result = conjugate(verb.masu, verb.group);
      return {
        verb,
        forms: result.ok ? result.forms : null,
        irregular: isIrregularVerb(verb.masu),
      };
    }),
  );

  readonly filteredVerbRows = computed<VerbRow[]>(() => {
    const base = this.onlyFavorites()
      ? this.verbRows().filter((row) => this.favoriteIds().has(row.verb.id))
      : this.verbRows();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((row) =>
      normalizeSearch(
        `${row.verb.masu} ${row.verb.reading} ${row.verb.meaning} ${formsText(row.forms)}`,
      ).includes(keyword),
    );
  });

  readonly filteredPairs = computed<TransitivityPair[]>(() => {
    const base = this.onlyFavorites()
      ? this.levelPairs().filter((pair) => this.favoriteIds().has(pair.id))
      : this.levelPairs();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((pair) =>
      normalizeSearch(
        `${pair.intransitive.masu} ${pair.intransitive.reading} ${pair.intransitive.meaning} ` +
          `${pair.transitive.masu} ${pair.transitive.reading} ${pair.transitive.meaning}`,
      ).includes(keyword),
    );
  });

  readonly shownCount = computed(() =>
    this.isTransitivity() ? this.filteredPairs().length : this.filteredVerbRows().length,
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id') ?? '';
      this.exerciseId.set(id);
      this.load(id);
    });
  }

  private load(id: string): void {
    const info = exerciseInfo(id);
    this.info.set(info);
    if (!info) return;

    // Mỗi bài tập có bộ chiều hỏi riêng, nên mở bài khác là phải đặt lại toàn bộ
    // thiết lập — giữ nguyên "Tự → Tha" khi sang bài chuyển thể thì chiều đó không
    // thuộc danh sách nào cả và không nút nào sáng lên.
    this.levels.set([...info.levels]);
    this.mode.set(DEFAULT_MODE[info.id]);
    this.selectedForms.set(['te']);
    this.scope.set('all');
    this.questionLimit.set(null);
    this.search.set('');
    this.onlyFavorites.set(false);
  }

  // --- Sự kiện thiết lập ---

  isLevelSelected(level: ExerciseLevel): boolean {
    return this.levels().includes(level);
  }

  toggleLevel(level: ExerciseLevel): void {
    const current = this.levels();
    // Luôn phải còn ít nhất một cấp: bỏ hết thì bảng trống trơn mà không rõ vì sao.
    if (current.includes(level) && current.length === 1) return;

    const next = current.includes(level)
      ? current.filter((item) => item !== level)
      : [...current, level];
    // Giữ đúng thứ tự N5 → N2 để nút không nhảy chỗ theo thứ tự bấm.
    this.levels.set(EXERCISE_LEVELS.filter((item) => next.includes(item)));
    this.questionLimit.set(null);
    this.fixScope();
  }

  setMode(mode: ExerciseMode): void {
    this.mode.set(mode);
    this.questionLimit.set(null);
  }

  setScope(scope: PracticeScope): void {
    this.scope.set(scope);
    this.questionLimit.set(null);
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

  setQuestionLimit(limit: number | null): void {
    this.questionLimit.set(limit);
  }

  toggleShowMeaning(event: Event): void {
    this.showMeaning.set((event.target as HTMLInputElement).checked);
  }

  toggleShuffle(event: Event): void {
    this.shuffleQuestions.set((event.target as HTMLInputElement).checked);
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  toggleOnlyFavorites(event: Event): void {
    this.onlyFavorites.set((event.target as HTMLInputElement).checked);
  }

  /** Phạm vi đang chọn có thể rỗng đi sau khi đổi cấp độ — quay về "Toàn bộ". */
  private fixScope(): void {
    if (this.scope() === 'favorite' && this.favoriteCount() === 0) this.scope.set('all');
    if (this.scope() === 'special' && this.specialCount() === 0) this.scope.set('all');
  }

  // --- Favorite ---

  isFavorite(itemId: string): boolean {
    return this.favoriteIds().has(itemId);
  }

  toggleFavorite(itemId: string): void {
    this.favoriteStore.toggle(this.exerciseId(), itemId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(this.exerciseId());
    }
  }

  markSpecialAsFavorite(): void {
    this.favoriteStore.add(
      this.exerciseId(),
      this.specialVerbs().map((verb) => verb.id),
    );
  }

  groupKeyOf(verb: ExerciseVerb) {
    return VERB_GROUP_LABEL_KEY[verb.group];
  }

  // --- Bắt đầu ---

  start(): void {
    const info = this.info();
    if (!info || !this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: info.id,
      lessonKind: 'exercise',
      scope: this.scope(),
      // Bài tập không có trắc nghiệm, xem `exercise.typingOnly`.
      answerMode: 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      // Đáp án luôn là tiếng Nhật nên tuỳ chọn bỏ dấu tiếng Việt không có việc gì làm.
      ignoreDiacritics: false,
      // Ba trường dưới đây thuộc về bài từ vựng / ngữ pháp / động từ. PracticeConfig
      // là một khối thiết lập đầy đủ chứ không phải union theo loại bài, nên trường
      // nào cũng phải có giá trị.
      direction: 'jp-vi',
      showHanViet: this.showMeaning(),
      showGrammarHint: false,
      verbMode: 'masu-to-form',
      verbForms: this.selectedForms(),
      exercise: info.id,
      exerciseMode: this.mode(),
    };

    const questions = orderQuestions(
      this.isTransitivity()
        ? buildTransitivityQuestions(this.poolPairs(), config)
        : buildVerbFormQuestions(this.poolVerbs(), config),
      config,
    );

    if (this.session.start({ id: info.id, name: this.lang.t(info.nameKey) }, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}

function formsText(forms: VerbForms | null): string {
  return forms ? `${forms.dictionary} ${forms.te} ${forms.ta} ${forms.nai}` : '';
}
