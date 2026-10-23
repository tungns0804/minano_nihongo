import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import { LessonStore } from '../../core/lessons/lesson-store';
import { Lesson } from '../../core/lessons/vocabulary.model';
import { buildQuestions } from '../../core/practice/build-questions';
import {
  DIRECTIONS,
  LIMIT_CHOICES,
  PracticeDirection,
  directionInfo,
  practiceConfig,
} from '../../core/practice/practice.model';
import { PracticeScreen } from '../../core/screens/practice-screen';
import {
  GrammarRef,
  TranslationLineRef,
  TranslationSet,
  flattenTranslationLines,
} from '../../core/translation/translation.model';
import { checkedOf } from '../../core/utils/dom-events';
import { RubyText } from '../../shared/ruby-text';
import { StarButton } from '../../shared/star-button';
import { PracticeSetup } from '../../shared/practice-setup';

/** Một mẫu ngữ pháp trong phần tổng hợp đầu trang, kèm số câu của bài có dùng nó. */
interface GrammarUse {
  id: string;
  ref: GrammarRef;
  count: number;
}

/**
 * Trang một bài luyện dịch: các bài nhỏ với từng câu (tiếng Nhật có furigana, bản dịch,
 * mẫu ngữ pháp câu đó dùng), phần tổng hợp ngữ pháp của cả bài, và khung thiết lập.
 *
 * Không dùng chung `features/lesson-detail`: bên đó là một BẢNG phẳng, còn ở đây câu
 * được nhóm theo bài nhỏ và mỗi câu mang theo danh sách mẫu ngữ pháp. Phần chạy phiên,
 * chấm và kết quả thì dùng lại toàn bộ qua `buildQuestions`.
 */
@Component({
  selector: 'app-translation-detail',
  imports: [PracticeSetup, RouterLink, RubyText, StarButton, T],
  templateUrl: './translation-detail.html',
  styleUrl: './translation-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationDetail extends PracticeScreen {
  private readonly route = inject(ActivatedRoute);
  private readonly lessonStore = inject(LessonStore);

  /** Dịch cả câu thì chỉ có hai chiều — câu không có âm Hán Việt hay cách đọc riêng. */
  readonly directions = DIRECTIONS.filter((item) => item.id === 'jp-vi' || item.id === 'vi-jp');

  readonly lessonId = signal('');
  readonly lesson = signal<Lesson | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  protected favoriteSessionId(): string {
    return this.lessonId();
  }

  // --- Thiết lập riêng ---
  readonly direction = signal<PracticeDirection>('jp-vi');
  /** Furigana dùng chung cho danh sách câu trong trang và câu hỏi lúc luyện. */
  readonly showFurigana = signal(true);
  /** Bài nhỏ đem ra luyện. Mặc định là tất cả, đặt lại mỗi lần đổi bài. */
  readonly selectedSetIds = signal<string[]>([]);

  readonly sets = computed<TranslationSet[]>(() => this.lesson()?.translationSets ?? []);
  readonly allLines = computed<TranslationLineRef[]>(() => flattenTranslationLines(this.sets()));
  readonly sentenceCount = computed(() => this.allLines().length);

  /** ★ đánh trên từng câu, id nằm ở `line.id` nên không dùng được `favoritesOf`. */
  readonly favoriteCount = computed(
    () => this.allLines().filter((item) => this.favoriteIds().has(item.line.id)).length,
  );

  /**
   * Mẫu ngữ pháp của cả bài, chia hai nhóm: mẫu của chính bài này và mẫu ôn lại từ các
   * bài trước. Nhóm sau là thứ cho thấy bài luyện dịch đang kéo ngữ pháp cũ vào.
   */
  readonly grammarUses = computed(() => {
    const lesson = this.lesson();
    const refs = lesson?.grammarRefs ?? {};
    const counts = new Map<string, number>();
    for (const { line } of this.allLines()) {
      for (const item of line.grammar) counts.set(item.point, (counts.get(item.point) ?? 0) + 1);
    }

    const uses = [...counts].flatMap(([id, count]): GrammarUse[] =>
      refs[id] ? [{ id, ref: refs[id], count }] : [],
    );
    const own = lesson?.lessonNumber;
    return {
      current: uses.filter((use) => use.ref.lesson === own).sort((a, b) => b.count - a.count),
      older: uses
        .filter((use) => use.ref.lesson !== own)
        .sort((a, b) => a.ref.lesson - b.ref.lesson || b.count - a.count),
    };
  });

  /** Câu sẽ đem ra hỏi: các bài nhỏ đang chọn, rồi lọc theo phạm vi. */
  readonly pool = computed<TranslationLineRef[]>(() => {
    const selected = new Set(this.selectedSetIds());
    const lines = flattenTranslationLines(this.sets().filter((set) => selected.has(set.id)));
    return this.scope() === 'favorite'
      ? lines.filter((item) => this.favoriteIds().has(item.line.id))
      : lines;
  });

  readonly poolSize = computed(() => this.pool().length);

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.poolSize() : Math.min(limit, this.poolSize());
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter((limit) => limit < this.poolSize()),
  );

  readonly currentDirection = computed(() => directionInfo(this.direction()));
  readonly modeShort = computed(() => this.lang.t(this.currentDirection().shortKey));

  constructor() {
    super();
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
    // Màn hình này chỉ biết vẽ bài luyện dịch; mở /translate/<id bài khác> thì coi như
    // không tìm thấy thay vì vẽ ra một trang trống không rõ lý do.
    const translation = lesson?.kind === 'translation' ? lesson : null;

    this.lesson.set(translation);
    this.selectedSetIds.set(translation?.translationSets.map((set) => set.id) ?? []);
    this.notFound.set(translation === null);
    this.loading.set(false);
    if (translation) this.rememberRecent({ title: translation.name, kindKey: 'kind.translation' });
  }

  private resetView(): void {
    this.lesson.set(null);
    this.selectedSetIds.set([]);
    this.scope.set('all');
    this.questionLimit.set(null);
  }

  // --- Hiển thị ---

  /** Mẫu ngữ pháp mà một câu tham chiếu tới, để vẽ nhãn nhỏ dưới câu. */
  refOf(pointId: string): GrammarRef | null {
    return this.lesson()?.grammarRefs[pointId] ?? null;
  }

  isCurrentLesson(ref: GrammarRef): boolean {
    return ref.lesson === this.lesson()?.lessonNumber;
  }

  toggleFurigana(event: Event): void {
    this.showFurigana.set(checkedOf(event));
  }

  // --- Thiết lập ---

  setDirection(direction: PracticeDirection): void {
    this.direction.set(direction);
  }

  isSetSelected(setId: string): boolean {
    return this.selectedSetIds().includes(setId);
  }

  toggleSet(setId: string): void {
    const current = this.selectedSetIds();
    // Luôn còn ít nhất một bài nhỏ, không thì không còn câu nào để luyện.
    if (current.includes(setId) && current.length === 1) return;

    this.selectedSetIds.set(
      current.includes(setId)
        ? current.filter((id) => id !== setId)
        : // Giữ thứ tự trong bài thay vì thứ tự bấm.
          this.sets().map((set) => set.id).filter((id) => current.includes(id) || id === setId),
    );
    this.questionLimit.set(null);
  }

  // --- Bắt đầu ---

  /** Luyện riêng một bài nhỏ, với đúng các tuỳ chọn đang đặt ở khung thiết lập. */
  practiceSet(setId: string): void {
    this.selectedSetIds.set([setId]);
    this.scope.set('all');
    this.questionLimit.set(null);
    this.start();
  }

  start(): void {
    const lesson = this.lesson();
    if (!lesson || !this.canStart()) return;

    const config = practiceConfig({
      lessonId: lesson.id,
      lessonKind: 'translation',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: this.direction(),
      showGrammarHint: this.showHint(),
      showFurigana: this.showFurigana(),
    });

    this.launch(
      { id: lesson.id, name: lesson.name },
      config,
      buildQuestions(lesson, { kind: 'translation', sentences: this.pool() }, config),
    );
  }
}
