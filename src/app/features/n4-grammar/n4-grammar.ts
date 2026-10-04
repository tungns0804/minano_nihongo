import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DEFAULT_MODE,
  ExerciseId,
  ExerciseMode,
  N4_GRAMMAR_MODES,
  exerciseModeInfo,
  isMeaningMode,
  modeQuestionsPerItem,
} from '../../core/exercises/exercise.model';
import { N4_SECTIONS } from '../../core/exercises/n4-grammar';
import {
  N4ExampleRef,
  N4PointRef,
  N4Section,
  flattenN4Examples,
  meaningPoints,
} from '../../core/exercises/n4-grammar.model';
import { T } from '../../core/i18n/t';
import { normalizeSearch } from '../../core/lessons/lesson-search';
import { orderQuestions } from '../../core/practice/build-questions';
import {
  buildN4ExampleQuestions,
  buildN4MeaningQuestions,
} from '../../core/practice/n4-grammar-questions';
import { CHOICE_COUNT, LIMIT_CHOICES, practiceConfig } from '../../core/practice/practice.model';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { kanaText, writtenText } from '../../core/translation/markup';
import { checkedOf } from '../../core/utils/dom-events';
import { RubyText } from '../../shared/ruby-text';
import { SearchBox } from '../../shared/search-box';
import { StarButton } from '../../shared/star-button';

const EXERCISE_ID: ExerciseId = 'ngu-phap-n4';

/** Toàn bộ câu ví dụ đem ra luyện và toàn bộ mẫu có ý nghĩa — dữ liệu tĩnh, tính một lần. */
const ALL_EXAMPLES: readonly N4ExampleRef[] = flattenN4Examples(N4_SECTIONS);
const ALL_POINTS: readonly N4PointRef[] = meaningPoints(N4_SECTIONS);
const ALL_SECTION_IDS: readonly string[] = N4_SECTIONS.map((section) => section.id);

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
 * ★ lưu chung một danh sách (`EXERCISE_ID`) cho cả câu ví dụ lẫn mẫu: dạng dịch câu đếm
 * ★ trên câu, dạng luyện ý nghĩa đếm ★ trên mẫu. Id của hai loại không bao giờ trùng
 * nhau — `npm run verify:n4` kiểm điều đó.
 */
@Component({
  selector: 'app-n4-grammar',
  imports: [RouterLink, RubyText, SearchBox, StarButton, T],
  templateUrl: './n4-grammar.html',
  styleUrl: './n4-grammar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class N4Grammar extends PracticeScreen {
  readonly sections = N4_SECTIONS;
  readonly modes = N4_GRAMMAR_MODES;
  readonly exampleTotal = ALL_EXAMPLES.length;
  readonly pointTotal = ALL_POINTS.length;
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

  // ── Thiết lập luyện tập ─────────────────────────────────────────────────

  readonly mode = signal<ExerciseMode>(DEFAULT_MODE[EXERCISE_ID]);
  /** Các mục đem ra luyện. Mặc định chọn hết. */
  readonly selectedIds = signal<ReadonlySet<string>>(new Set(ALL_SECTION_IDS));

  readonly isMeaning = computed(() => isMeaningMode(this.mode()));
  readonly currentMode = computed(() => exerciseModeInfo(this.mode()));
  /** Chỉ dạng Nhật → Việt có câu hỏi tiếng Nhật và đáp án tiếng Việt. */
  readonly japanesePrompt = computed(() => this.mode() === 'example-jp-vi');

  readonly selectedCount = computed(() => this.selectedIds().size);

  private readonly selectedExamples = computed(() => {
    const selected = this.selectedIds();
    return ALL_EXAMPLES.filter((ref) => selected.has(ref.section.id));
  });

  private readonly selectedPoints = computed(() => {
    const selected = this.selectedIds();
    return ALL_POINTS.filter((ref) => selected.has(ref.section.id));
  });

  /** Số mục của phạm vi "Toàn bộ" theo đơn vị của dạng luyện: câu, hoặc mẫu. */
  readonly scopeTotal = computed(() =>
    this.isMeaning() ? this.selectedPoints().length : this.selectedExamples().length,
  );

  readonly favoriteCount = computed(() => {
    const ids = this.favoriteIds();
    return this.isMeaning()
      ? this.selectedPoints().filter((ref) => ids.has(ref.point.id)).length
      : this.selectedExamples().filter((ref) => ids.has(ref.example.id)).length;
  });

  /** ★ của cả bài tập, cả câu lẫn mẫu — con số trên đầu trang. */
  readonly favoriteTotal = computed(() => {
    const ids = this.favoriteIds();
    return (
      ALL_EXAMPLES.filter((ref) => ids.has(ref.example.id)).length +
      ALL_POINTS.filter((ref) => ids.has(ref.point.id)).length
    );
  });

  private readonly examplePool = computed(() => {
    const ids = this.favoriteIds();
    return this.scope() === 'favorite'
      ? this.selectedExamples().filter((ref) => ids.has(ref.example.id))
      : this.selectedExamples();
  });

  private readonly pointPool = computed(() => {
    const ids = this.favoriteIds();
    return this.scope() === 'favorite'
      ? this.selectedPoints().filter((ref) => ids.has(ref.point.id))
      : this.selectedPoints();
  });

  /** Tổng số câu hỏi dựng được: dạng "trộn" hỏi mỗi mẫu hai lần (xuôi và ngược). */
  private readonly questionTotal = computed(
    () =>
      (this.isMeaning() ? this.pointPool().length : this.examplePool().length) *
      modeQuestionsPerItem(this.mode()),
  );

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.questionTotal() : Math.min(limit, this.questionTotal());
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() => LIMIT_CHOICES.filter((limit) => limit < this.questionTotal()));

  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));

  /** Số lần sai tối đa ghi trên dòng tóm tắt: câu trắc nghiệm chỉ có ba đáp án sai. */
  readonly planMaxWrong = computed(() =>
    this.isMeaning() ? Math.min(this.maxWrongAttempts, CHOICE_COUNT - 1) : this.maxWrongAttempts,
  );

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
   * Nút "Luyện mục này" ở cuối mỗi mục: chọn riêng mục đó rồi cuộn xuống khung thiết lập.
   *
   * Mục chỉ có phần so sánh (không có mẫu nào để luyện ý nghĩa) mà đang ở dạng luyện ý
   * nghĩa thì chuyển sang dịch câu ví dụ — giữ nguyên dạng thì khung thiết lập hiện
   * "0 câu" mà người học không hiểu vì sao.
   */
  practiceSection(sectionId: string): void {
    this.selectSections(new Set([sectionId]));
    if (this.isMeaning() && this.selectedPoints().length === 0) this.setMode('example-vi-jp');
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
    const meaning = isMeaningMode(mode);
    const config = practiceConfig({
      lessonId: EXERCISE_ID,
      lessonKind: 'exercise',
      exercise: EXERCISE_ID,
      exerciseMode: mode,
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      answerMode: meaning ? 'choice' : 'typing',
      direction: mode === 'example-jp-vi' ? 'jp-vi' : 'vi-jp',
      // Chỉ có nghĩa khi người học gõ tiếng Việt — tức dạng Nhật → Việt.
      ignoreDiacritics: mode === 'example-jp-vi' && this.ignoreDiacritics(),
      showGrammarHint: !meaning && this.showHint(),
      showFurigana: this.showFurigana(),
    });

    const questions = meaning
      ? buildN4MeaningQuestions(this.pointPool(), config)
      : buildN4ExampleQuestions(this.examplePool(), config);

    this.launch(
      { id: EXERCISE_ID, name: this.lang.t('exercise.n4grammar.name') },
      config,
      orderQuestions(questions, config),
    );
  }
}
