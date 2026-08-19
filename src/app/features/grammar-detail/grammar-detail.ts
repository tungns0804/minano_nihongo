import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  DIRECTIONS,
  PracticeConfig,
  PracticeDirection,
  PracticeScope,
  directionInfo,
} from '../../core/models/practice.model';
import {
  GrammarExampleRef,
  GrammarPoint,
  Lesson,
  flattenGrammarExamples,
} from '../../core/models/vocabulary.model';
import { buildQuestions } from '../../core/practice/build-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';

/** Các mốc số câu cho phép chọn nhanh, giống màn hình chi tiết bài học. */
const LIMIT_CHOICES = [10, 20, 30, 50] as const;

/**
 * Trang một bài ngữ pháp: phần lý thuyết (công thức, giải thích, bảng biến đổi,
 * các cách dùng kèm ví dụ) và phần thiết lập luyện tập.
 *
 * Không dùng chung `features/lesson-detail` vì hai màn hình khác nhau về bản chất:
 * bên kia là một BẢNG dữ liệu phẳng cộng vài nút thiết lập, còn đây là trang lý
 * thuyết có phân cấp. Nhét cả hai vào một component thì template sẽ là hai nhánh
 * @if lớn chẳng dùng chung được gì ngoài cái khung.
 *
 * Phần chạy phiên và chấm điểm thì DÙNG LẠI toàn bộ: câu hỏi được dựng qua
 * `buildQuestions`, nên bài ngữ pháp đi qua đúng màn hình luyện tập và màn hình
 * kết quả như ba loại bài kia.
 */
@Component({
  selector: 'app-grammar-detail',
  imports: [RouterLink, T],
  templateUrl: './grammar-detail.html',
  styleUrl: './grammar-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly lessonStore = inject(LessonStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;

  /** Bài ngữ pháp chỉ dịch qua lại Nhật/Việt — không có âm Hán Việt hay cách đọc cho cả câu. */
  readonly directions = DIRECTIONS.filter((item) => item.id === 'jp-vi' || item.id === 'vi-jp');

  readonly lessonId = signal('');
  readonly lesson = signal<Lesson | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  // --- Thiết lập luyện tập ---
  readonly scope = signal<PracticeScope>('all');
  readonly direction = signal<PracticeDirection>('vi-jp');
  readonly showGrammarHint = signal(true);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);
  readonly questionLimit = signal<number | null>(null);

  /** Id các mẫu ngữ pháp được đem ra hỏi. Mặc định là tất cả, đặt lại mỗi lần đổi bài. */
  readonly selectedPointIds = signal<string[]>([]);

  readonly points = computed<GrammarPoint[]>(() => this.lesson()?.grammarPoints ?? []);

  /** Toàn bộ câu ví dụ của bài, đã trải phẳng và giữ nguyên thứ tự. */
  readonly allExamples = computed<GrammarExampleRef[]>(() =>
    flattenGrammarExamples(this.points()),
  );

  readonly exampleCount = computed(() => this.allExamples().length);

  /** Đọc qua signal của FavoriteStore để danh sách tự cập nhật khi bấm sao. */
  readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(this.lessonId()));
  });

  readonly favoriteCount = computed(
    () => this.allExamples().filter((item) => this.favoriteIds().has(item.example.id)).length,
  );

  readonly currentDirection = computed(() => directionInfo(this.direction()));

  /** Câu ví dụ còn lại sau khi lọc theo mẫu đã chọn và theo phạm vi. */
  readonly pool = computed<readonly GrammarExampleRef[]>(() => {
    const selected = new Set(this.selectedPointIds());
    const byPoint = this.allExamples().filter((item) => selected.has(item.point.id));
    return this.scope() === 'favorite'
      ? byPoint.filter((item) => this.favoriteIds().has(item.example.id))
      : byPoint;
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

  /** Nhãn ngắn của chiều đang chọn, dùng cho dòng tóm tắt trước khi bắt đầu. */
  readonly modeShort = computed(() => this.lang.t(this.currentDirection().shortKey));

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
    // Mở /grammar/<id-bài-từ-vựng> thì coi như không tìm thấy: màn hình này chỉ biết
    // vẽ bài ngữ pháp, hiện một bài từ vựng ở đây sẽ ra trang trắng không rõ lý do.
    const grammarLesson = lesson?.kind === 'grammar' ? lesson : null;

    this.lesson.set(grammarLesson);
    this.selectedPointIds.set(grammarLesson?.grammarPoints.map((point) => point.id) ?? []);
    this.notFound.set(grammarLesson === null);
    this.loading.set(false);
  }

  private resetView(): void {
    this.lesson.set(null);
    this.selectedPointIds.set([]);
    this.scope.set('all');
    this.questionLimit.set(null);
  }

  // --- Sự kiện thiết lập ---

  setScope(scope: PracticeScope): void {
    this.scope.set(scope);
    this.questionLimit.set(null);
  }

  setDirection(direction: PracticeDirection): void {
    this.direction.set(direction);
  }

  setQuestionLimit(limit: number | null): void {
    this.questionLimit.set(limit);
  }

  isPointSelected(pointId: string): boolean {
    return this.selectedPointIds().includes(pointId);
  }

  togglePoint(pointId: string): void {
    const current = this.selectedPointIds();
    // Luôn phải còn ít nhất một mẫu được chọn, nếu không thì không còn gì để luyện.
    if (current.includes(pointId) && current.length === 1) return;

    this.selectedPointIds.set(
      current.includes(pointId)
        ? current.filter((id) => id !== pointId)
        : // Giữ đúng thứ tự trong bài thay vì thứ tự bấm, để dòng tóm tắt đọc xuôi.
          this.points().map((p) => p.id).filter((id) => current.includes(id) || id === pointId),
    );
    this.questionLimit.set(null);
  }

  /** Số câu ví dụ của một mẫu, hiện ngay trên nút chọn mẫu. */
  exampleCountOf(point: GrammarPoint): number {
    return point.usages.reduce((sum, usage) => sum + usage.examples.length, 0);
  }

  /**
   * Cuộn tới một mẫu ngữ pháp từ mục lục.
   *
   * Cuộn bằng script chứ không dùng <a href="#..."> vì bản offline định tuyến bằng
   * dấu # (xem `withHashLocation` trong app.config.ts) — một href như vậy sẽ bị
   * router hiểu thành đường dẫn chứ không phải neo trong trang.
   */
  scrollToPoint(pointId: string): void {
    document
      .getElementById(`point-${pointId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleShowHint(event: Event): void {
    this.showGrammarHint.set((event.target as HTMLInputElement).checked);
  }

  toggleShuffle(event: Event): void {
    this.shuffleQuestions.set((event.target as HTMLInputElement).checked);
  }

  toggleIgnoreDiacritics(event: Event): void {
    this.ignoreDiacritics.set((event.target as HTMLInputElement).checked);
  }

  // --- Favorite ---

  isFavorite(exampleId: string): boolean {
    return this.favoriteIds().has(exampleId);
  }

  toggleFavorite(exampleId: string): void {
    this.favoriteStore.toggle(this.lessonId(), exampleId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(this.lessonId());
    }
  }

  // --- Bắt đầu ---

  start(): void {
    const lesson = this.lesson();
    if (!lesson || !this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: lesson.id,
      lessonKind: lesson.kind,
      scope: this.scope(),
      // Bài ngữ pháp luôn là gõ đáp án: chọn trong bốn câu dài thì đọc lướt là ra.
      answerMode: 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: this.direction(),
      showHanViet: false,
      showGrammarHint: this.showGrammarHint(),
      verbMode: 'masu-to-form',
      verbForms: [],
      exercise: null,
      exerciseMode: 'masu-to-form',
      kanjiMode: 'word-meaning',
    };

    const questions = buildQuestions(lesson, { kind: 'grammar', examples: this.pool() }, config);
    if (this.session.start({ id: lesson.id, name: lesson.name }, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}
