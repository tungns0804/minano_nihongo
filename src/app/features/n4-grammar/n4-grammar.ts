import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DEFAULT_MODE,
  ExerciseId,
  ExerciseMode,
  N4_EXTRA_MODES,
  N4_PATH_MODE,
  N4_STEP_MODES,
  exerciseModeInfo,
  isMeaningMode,
  isTranslationMode,
  modeQuestionsPerItem,
} from '../../core/exercises/exercise.model';
import { N4_SECTIONS } from '../../core/exercises/n4-grammar';
import {
  N4ExampleRef,
  N4Section,
  blankExamples,
  flattenN4Examples,
  meaningPoints,
  orderExamples,
  quizItems,
} from '../../core/exercises/n4-grammar.model';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import { normalizeSearch } from '../../core/lessons/lesson-search';
import { orderQuestions } from '../../core/practice/build-questions';
import {
  N4Pools,
  buildN4BlankQuestions,
  buildN4ExampleQuestions,
  buildN4MeaningQuestions,
  buildN4OrderQuestions,
  buildN4PathQuestions,
  pathQuestionCount,
} from '../../core/practice/n4-grammar-questions';
import {
  AnswerMode,
  CHOICE_COUNT,
  LIMIT_CHOICES,
  PracticeConfig,
  PracticeQuestion,
  practiceConfig,
} from '../../core/practice/practice.model';
import { reviewKey } from '../../core/review/review.model';
import { ReviewStore } from '../../core/review/review-store';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { kanaText, writtenText } from '../../core/translation/markup';
import { checkedOf } from '../../core/utils/dom-events';
import { RubyText } from '../../shared/ruby-text';
import { SearchBox } from '../../shared/search-box';
import { StarButton } from '../../shared/star-button';

const EXERCISE_ID: ExerciseId = 'ngu-phap-n4';

/**
 * Lộ trình dài hơn bấy nhiêu câu mà không chọn số câu thì nhắc chia chặng: một mục
 * trung bình ra khoảng hai mươi câu qua năm bậc, cả tài liệu là hơn một nghìn.
 */
const PATH_COMFORTABLE_LENGTH = 60;

/** Mọi thứ đem ra luyện được, theo từng bậc — dữ liệu tĩnh, tính một lần. */
const ALL_POOLS: N4Pools = {
  points: meaningPoints(N4_SECTIONS),
  blanks: blankExamples(N4_SECTIONS),
  quiz: quizItems(N4_SECTIONS),
  orders: orderExamples(N4_SECTIONS),
  examples: flattenN4Examples(N4_SECTIONS),
};
const ALL_SECTION_IDS: readonly string[] = N4_SECTIONS.map((section) => section.id);

/**
 * Số MỤC (câu, hay mẫu) một dạng luyện hỏi trên một bộ pool — đơn vị của dòng "Toàn
 * bộ (…)" và của số ★. Lộ trình đếm mỗi mẫu và mỗi câu một lần dù hỏi chúng ở vài bậc.
 */
function itemCount(mode: ExerciseMode, pools: N4Pools): number {
  switch (mode) {
    case 'grammar-path':
      return pools.points.length + pools.examples.length + pools.quiz.length;
    case 'example-blank':
      return pools.blanks.length + pools.quiz.length;
    case 'example-order':
      return pools.orders.length;
    case 'example-vi-jp':
    case 'example-jp-vi':
      return pools.examples.length;
    default:
      return pools.points.length;
  }
}

/** Số CÂU HỎI một dạng luyện dựng ra trên một bộ pool. */
function questionCount(mode: ExerciseMode, pools: N4Pools): number {
  return mode === 'grammar-path'
    ? pathQuestionCount(pools)
    : itemCount(mode, pools) * modeQuestionsPerItem(mode);
}

/** Cách trả lời của từng dạng — quyết định nhãn ở khung thiết lập và ở màn kết quả. */
function answerModeOf(mode: ExerciseMode): AnswerMode {
  if (mode === 'grammar-path') return 'mixed';
  if (mode === 'example-order') return 'order';
  return isTranslationMode(mode) ? 'typing' : 'choice';
}

const PLAN_ANSWER_KEY: Record<AnswerMode, MessageKey> = {
  choice: 'lesson.plan.choice',
  typing: 'lesson.plan.typing',
  draw: 'lesson.plan.draw',
  order: 'lesson.plan.order',
  mixed: 'lesson.plan.mixed',
};

function inSections<T extends { section: { id: string } }>(
  items: readonly T[],
  ids: ReadonlySet<string>,
): T[] {
  return items.filter((item) => ids.has(item.section.id));
}

/** Số thứ tự khoanh tròn như tài liệu (①②③…); quá 20 thì về số thường. */
function circled(index: number): string {
  return index < 20 ? String.fromCharCode(0x2460 + index) : `(${index + 1})`;
}

/**
 * Mọi chữ của một mục gom lại để tìm: tên mục, tên mẫu, ý nghĩa, công thức, câu ví dụ
 * (cả dạng chữ Hán lẫn kana — người chưa bật bộ gõ chữ Hán vẫn tìm được) và bản dịch.
 */
function haystackOf(section: N4Section): string {
  const parts: string[] = [section.title, ...section.intro];
  for (const point of section.points) {
    parts.push(point.pattern, point.meaning, ...point.structures, ...point.explanation);
    for (const usage of point.usages) {
      for (const example of usage.examples) {
        parts.push(writtenText(example.japanese), kanaText(example.japanese), writtenText(example.vietnamese));
      }
    }
  }
  return normalizeSearch(parts.join(' '));
}

/**
 * Bài tập "Luyện tập ngữ pháp N4": đọc lý thuyết theo tài liệu, rồi luyện.
 *
 * Trang gồm hai phần, theo đúng thứ tự người học dùng: danh sách 49 mục của tài liệu
 * (mỗi mục mở ra thành mô tả mẫu, bảng, lưu ý, câu ví dụ kèm giải thích), rồi khung
 * thiết lập luyện tập. Không đi qua `features/exercise-detail` như hai bài tập động
 * từ: bên đó là bảng tra một loại mục, còn đây là trang lý thuyết dài — cùng lý do bài
 * ngữ pháp 皆の日本語 có màn hình riêng.
 *
 * Mục đóng sẵn và chỉ dựng nội dung khi mở: 49 mục mở hết là hơn ba trăm câu ví dụ
 * kèm furigana, dựng ngay từ đầu thì trang mở chậm hẳn trên điện thoại. Danh sách mục
 * lúc đóng cũng chính là mục lục của tài liệu.
 *
 * ★ lưu chung một danh sách (`EXERCISE_ID`) cho câu ví dụ, mẫu và câu của "Bài luyện
 * tập": dạng luyện câu đếm ★ trên câu, dạng luyện ý nghĩa đếm ★ trên mẫu, lộ trình đếm
 * cả hai. Id của các loại không bao giờ trùng nhau — `npm run verify:n4` kiểm điều đó.
 */
@Component({
  selector: 'app-n4-grammar',
  imports: [RouterLink, RubyText, SearchBox, StarButton, T],
  templateUrl: './n4-grammar.html',
  styleUrl: './n4-grammar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class N4Grammar extends PracticeScreen {
  private readonly reviews = inject(ReviewStore);

  readonly sections = N4_SECTIONS;
  readonly pathMode = N4_PATH_MODE;
  readonly stepModes = N4_STEP_MODES;
  readonly extraModes = N4_EXTRA_MODES;
  readonly exampleTotal = ALL_POOLS.examples.length;
  readonly pointTotal = ALL_POOLS.points.length;
  readonly circled = circled;

  protected favoriteSessionId(): string {
    return EXERCISE_ID;
  }

  // ── Phần lý thuyết ──────────────────────────────────────────────────────

  /** Các mục đang mở. Mặc định đóng hết — danh sách lúc đó chính là mục lục. */
  private readonly openIds = signal<ReadonlySet<string>>(new Set());
  readonly showFurigana = signal(true);

  private readonly haystacks = new Map(N4_SECTIONS.map((section) => [section.id, haystackOf(section)]));

  private readonly needle = computed(() => normalizeSearch(this.search()));

  readonly visibleSections = computed<readonly N4Section[]>(() => {
    const words = this.needle().split(' ').filter(Boolean);
    if (words.length === 0) return N4_SECTIONS;
    return N4_SECTIONS.filter((section) => {
      const haystack = this.haystacks.get(section.id) ?? '';
      return words.every((word) => haystack.includes(word));
    });
  });

  isOpen(sectionId: string): boolean {
    return this.openIds().has(sectionId);
  }

  /**
   * Đồng bộ lại khi người dùng bấm vào tiêu đề mục. `<details>` tự đổi trạng thái của nó
   * rồi mới bắn sự kiện, nên chỉ việc đọc lại `open` — gán ngược vào signal không gây
   * vòng lặp vì giá trị đã trùng.
   */
  onToggle(sectionId: string, event: Event): void {
    const open = (event.target as HTMLDetailsElement).open;
    if (open === this.isOpen(sectionId)) return;
    const next = new Set(this.openIds());
    if (open) next.add(sectionId);
    else next.delete(sectionId);
    this.openIds.set(next);
  }

  openAll(): void {
    this.openIds.set(new Set(this.visibleSections().map((section) => section.id)));
  }

  closeAll(): void {
    this.openIds.set(new Set());
  }

  /**
   * Gõ tìm thì mở sẵn các mục khớp: người tìm "ながら" là để đọc ngay mẫu đó, bắt bấm
   * thêm một lần nữa mới thấy nội dung thì ô tìm chỉ còn là bộ lọc mục lục.
   */
  onSearchChange(value: string): void {
    this.search.set(value);
    if (this.needle()) this.openIds.set(new Set(this.visibleSections().map((section) => section.id)));
  }

  toggleFurigana(event: Event): void {
    this.showFurigana.set(checkedOf(event));
  }

  /** Dòng tóm tắt dưới tên mục khi mục đang đóng: ý nghĩa các mẫu trong mục. */
  summaryOf(section: N4Section): string {
    return section.points
      .map((point) => point.meaning)
      .filter(Boolean)
      .join(' · ');
  }

  /**
   * Tiến độ của từng mục: bao nhiêu mẫu và câu đã có lịch ôn — tức đã luyện ở bậc ý
   * nghĩa (1–2) hay bậc dịch câu (5). 49 mục mà không biết mình đang ở đâu thì mỗi lần
   * mở bài ra lại phải nhớ xem hôm trước học tới mục nào.
   *
   * Hai bậc giữa không tính: chúng không vào lịch ôn (xem `reviewRefOf`), nên không có
   * dấu vết nào để đếm. Đó cũng là cách đọc đúng: xong mục là tự dịch được câu của nó.
   */
  private readonly progress = computed(() => {
    const seen = (key: string) => this.reviews.cardOf(key) !== null;
    return new Map(
      N4_SECTIONS.map((section) => {
        const points = ALL_POOLS.points.filter((ref) => ref.section === section);
        const examples = ALL_POOLS.examples.filter((ref) => ref.section === section);
        const done =
          points.filter((ref) => seen(reviewKey('nm', ref.point.id))).length +
          examples.filter((ref) => seen(reviewKey('ne', ref.example.id))).length;
        return [section.id, { done, total: points.length + examples.length }] as const;
      }),
    );
  });

  progressOf(sectionId: string): { done: number; total: number } {
    return this.progress().get(sectionId) ?? { done: 0, total: 0 };
  }

  // ── Thiết lập luyện tập ─────────────────────────────────────────────────

  readonly mode = signal<ExerciseMode>(DEFAULT_MODE[EXERCISE_ID]);
  /** Các mục đem ra luyện. Mặc định chọn hết. */
  readonly selectedIds = signal<ReadonlySet<string>>(new Set(ALL_SECTION_IDS));

  readonly isPath = computed(() => this.mode() === 'grammar-path');
  readonly currentMode = computed(() => exerciseModeInfo(this.mode()));
  readonly answerMode = computed(() => answerModeOf(this.mode()));

  /** Gợi ý mẫu ngữ pháp chỉ có nghĩa khi người học phải tự dựng câu (bậc 4, 5, lộ trình). */
  readonly offersGrammarHint = computed(
    () => this.isPath() || this.mode() === 'example-order' || isTranslationMode(this.mode()),
  );

  /** Dạng nào có chữ Nhật để đọc (câu hỏi, câu đục lỗ, mảnh câu) thì cho bật tắt furigana. */
  readonly offersFurigana = computed(
    () =>
      this.isPath() || ['example-jp-vi', 'example-blank', 'example-order'].includes(this.mode()),
  );

  /** Bỏ dấu tiếng Việt chỉ có nghĩa khi người học gõ tiếng Việt — tức dạng Nhật → Việt. */
  readonly offersIgnoreDiacritics = computed(() => this.mode() === 'example-jp-vi');

  readonly selectedCount = computed(() => this.selectedIds().size);

  private readonly selectedPools = computed<N4Pools>(() => {
    const ids = this.selectedIds();
    return {
      points: inSections(ALL_POOLS.points, ids),
      blanks: inSections(ALL_POOLS.blanks, ids),
      quiz: inSections(ALL_POOLS.quiz, ids),
      orders: inSections(ALL_POOLS.orders, ids),
      examples: inSections(ALL_POOLS.examples, ids),
    };
  });

  private readonly favoritePools = computed<N4Pools>(() => {
    const ids = this.favoriteIds();
    const pools = this.selectedPools();
    const starred = (ref: N4ExampleRef) => ids.has(ref.example.id);
    return {
      points: pools.points.filter((ref) => ids.has(ref.point.id)),
      blanks: pools.blanks.filter(starred),
      quiz: pools.quiz.filter((ref) => ids.has(ref.item.id)),
      orders: pools.orders.filter(starred),
      examples: pools.examples.filter(starred),
    };
  });

  private readonly pools = computed(() =>
    this.scope() === 'favorite' ? this.favoritePools() : this.selectedPools(),
  );

  /** Nhãn độ khó của một bậc: hai bậc trắc nghiệm ý nghĩa dễ, hai bậc giữa vừa, dịch câu khó. */
  levelKeyOf(step: number): MessageKey {
    if (step <= 2) return 'exercise.n4.level.easy';
    return step <= 4 ? 'exercise.n4.level.medium' : 'exercise.n4.level.hard';
  }

  /** Số câu hỏi của một dạng trên các mục đang chọn — hiện ngay trên nút của dạng đó. */
  modeCount(mode: ExerciseMode): number {
    return questionCount(mode, this.selectedPools());
  }

  /** Nhãn phạm vi "Toàn bộ (…)": lộ trình đếm câu hỏi, dạng ý nghĩa đếm mẫu, còn lại đếm câu. */
  readonly scopeLabel = computed(() => {
    const mode = this.mode();
    const pools = this.selectedPools();
    if (mode === 'grammar-path') {
      return this.t('exercise.n4.scope.questions', { count: pathQuestionCount(pools) });
    }
    return isMeaningMode(mode)
      ? this.t('exercise.n4.scope.points', { count: itemCount(mode, pools) })
      : this.t('exercise.n4.scope.examples', { count: itemCount(mode, pools) });
  });

  readonly favoriteCount = computed(() => itemCount(this.mode(), this.favoritePools()));

  /** ★ của cả bài tập — câu, mẫu và câu luyện tập của tài liệu — con số trên đầu trang. */
  readonly favoriteTotal = computed(() => {
    const ids = this.favoriteIds();
    return (
      ALL_POOLS.examples.filter((ref) => ids.has(ref.example.id)).length +
      ALL_POOLS.points.filter((ref) => ids.has(ref.point.id)).length +
      ALL_POOLS.quiz.filter((ref) => ids.has(ref.item.id)).length
    );
  });

  private readonly questionTotal = computed(() => questionCount(this.mode(), this.pools()));

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.questionTotal() : Math.min(limit, this.questionTotal());
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() => LIMIT_CHOICES.filter((limit) => limit < this.questionTotal()));

  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));
  readonly planAnswer = computed(() => this.lang.t(PLAN_ANSWER_KEY[this.answerMode()]));

  /** Lộ trình dài mà chưa chọn số câu: nhắc chia ra từng chặng. */
  readonly pathTooLong = computed(
    () =>
      this.isPath() &&
      this.questionLimit() === null &&
      this.questionTotal() > PATH_COMFORTABLE_LENGTH,
  );

  /** Số lần sai tối đa ghi trên dòng tóm tắt: câu trắc nghiệm chỉ có ba đáp án sai. */
  readonly planMaxWrong = computed(() =>
    this.answerMode() === 'choice'
      ? Math.min(this.maxWrongAttempts, CHOICE_COUNT - 1)
      : this.maxWrongAttempts,
  );

  /** Khoá mô tả cách trả lời của dạng đang chọn, hiện dưới nhãn "Cách trả lời". */
  readonly answerNoteKey = computed<MessageKey>(() => {
    switch (this.mode()) {
      case 'grammar-path':
        return 'exercise.n4.answer.path';
      case 'example-blank':
        return 'exercise.n4.answer.blank';
      case 'example-order':
        return 'exercise.n4.answer.order';
      case 'example-vi-jp':
      case 'example-jp-vi':
        return 'exercise.n4.answer.typing';
      default:
        return 'exercise.n4.answer.choice';
    }
  });

  constructor() {
    super();
    // Bật sẵn gợi ý mẫu ngữ pháp như bài ngữ pháp 皆の日本語: bắt tự nhớ ra mẫu nào hợp
    // với câu là một bài khó hơn hẳn, nên để thành lựa chọn người học tự tắt.
    this.showHint.set(true);
  }

  setMode(mode: ExerciseMode): void {
    this.mode.set(mode);
    this.questionLimit.set(null);
    // Đổi dạng là đổi đơn vị đếm ★ (câu ↔ mẫu), phạm vi ★ có thể vừa rỗng đi.
    this.fixScope();
  }

  isSectionSelected(sectionId: string): boolean {
    return this.selectedIds().has(sectionId);
  }

  toggleSection(sectionId: string): void {
    const next = new Set(this.selectedIds());
    if (next.has(sectionId)) next.delete(sectionId);
    else next.add(sectionId);
    this.selectSections(next);
  }

  selectAllSections(): void {
    this.selectSections(new Set(ALL_SECTION_IDS));
  }

  clearSections(): void {
    this.selectSections(new Set());
  }

  /**
   * Nút "Học mục này" ở cuối mỗi mục: chọn riêng mục đó, chuyển sang lộ trình dễ → khó
   * rồi cuộn xuống khung thiết lập.
   *
   * Luôn là lộ trình chứ không giữ dạng đang chọn: người vừa đọc xong một mục là người
   * mới học mẫu đó, và lộ trình là cách đi từ nhận biết tới tự viết câu mà không bị hụt
   * bậc. Lộ trình cũng chạy được với mục chỉ có phần so sánh (không có mẫu nào để luyện
   * ý nghĩa) — các bậc câu ví dụ vẫn còn.
   */
  practiceSection(sectionId: string): void {
    this.selectSections(new Set([sectionId]));
    this.setMode('grammar-path');
    this.scrollToPractice();
  }

  private selectSections(next: ReadonlySet<string>): void {
    this.selectedIds.set(next);
    this.questionLimit.set(null);
    this.fixScope();
  }

  start(): void {
    if (!this.canStart()) return;

    const mode = this.mode();
    const path = mode === 'grammar-path';
    const limit = this.questionLimit();
    const config = practiceConfig({
      lessonId: EXERCISE_ID,
      lessonKind: 'exercise',
      exercise: EXERCISE_ID,
      exerciseMode: mode,
      scope: this.scope(),
      questionLimit: limit,
      // Lộ trình không trộn giữa các bậc (bộ dựng tự trộn trong từng bậc), và học theo
      // chặng: chọn số câu thì phiên là chặng đầu, màn kết quả mời học tiếp chặng sau.
      shuffle: path ? false : this.shuffleQuestions(),
      batchIndex: path && limit !== null ? 0 : null,
      answerMode: this.answerMode(),
      direction: mode === 'example-jp-vi' ? 'jp-vi' : 'vi-jp',
      ignoreDiacritics: this.offersIgnoreDiacritics() && this.ignoreDiacritics(),
      showGrammarHint: this.offersGrammarHint() && this.showHint(),
      showFurigana: this.showFurigana(),
    });

    this.launch(
      { id: EXERCISE_ID, name: this.lang.t('exercise.n4grammar.name') },
      config,
      orderQuestions(this.buildQuestions(config), config),
    );
  }

  private buildQuestions(config: PracticeConfig): PracticeQuestion[] {
    const pools = this.pools();
    switch (config.exerciseMode) {
      case 'grammar-path':
        return buildN4PathQuestions(pools, config);
      case 'example-blank':
        return buildN4BlankQuestions(pools.blanks, pools.quiz, config);
      case 'example-order':
        return buildN4OrderQuestions(pools.orders, config);
      case 'example-vi-jp':
      case 'example-jp-vi':
        return buildN4ExampleQuestions(pools.examples, config);
      default:
        return buildN4MeaningQuestions(pools.points, config);
    }
  }
}
