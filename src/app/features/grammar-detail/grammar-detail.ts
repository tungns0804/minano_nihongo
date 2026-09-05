import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import {
  directionInfo,
  DIRECTIONS,
  LIMIT_CHOICES,
  practiceConfig,
  PracticeDirection,
} from '../../core/models/practice.model';
import {
  GrammarExampleRef,
  GrammarPoint,
  Lesson,
  flattenGrammarExamples,
} from '../../core/models/vocabulary.model';
import { buildQuestions } from '../../core/practice/build-questions';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { LessonStore } from '../../core/services/lesson-store';
import { StarButton } from '../../shared/star-button';

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
 *
 * Khung thiết lập và khối ★ đến từ `PracticeScreen`. Không có ô tìm: cả trang là
 * lý thuyết để đọc từ trên xuống, không phải bảng để tra.
 */
@Component({
  selector: 'app-grammar-detail',
  imports: [RouterLink, StarButton, T],
  templateUrl: './grammar-detail.html',
  styleUrl: './grammar-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarDetail extends PracticeScreen {
  private readonly route = inject(ActivatedRoute);
  private readonly lessonStore = inject(LessonStore);

  /** Bài ngữ pháp chỉ dịch qua lại Nhật/Việt — không có âm Hán Việt hay cách đọc cho cả câu. */
  readonly directions = DIRECTIONS.filter((item) => item.id === 'jp-vi' || item.id === 'vi-jp');

  readonly lessonId = signal('');
  readonly lesson = signal<Lesson | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  protected favoriteSessionId(): string {
    return this.lessonId();
  }

  // --- Thiết lập riêng của bài ngữ pháp ---
  readonly direction = signal<PracticeDirection>('vi-jp');

  /** Id các mẫu ngữ pháp được đem ra hỏi. Mặc định là tất cả, đặt lại mỗi lần đổi bài. */
  readonly selectedPointIds = signal<string[]>([]);

  readonly points = computed<GrammarPoint[]>(() => this.lesson()?.grammarPoints ?? []);

  /** Toàn bộ câu ví dụ của bài, đã trải phẳng và giữ nguyên thứ tự. */
  readonly allExamples = computed<GrammarExampleRef[]>(() =>
    flattenGrammarExamples(this.points()),
  );

  readonly exampleCount = computed(() => this.allExamples().length);

  /**
   * ★ ở đây đánh trên CÂU VÍ DỤ chứ không trên mẫu ngữ pháp, nên id nằm ở
   * `item.example.id` — không dùng được `favoritesOf` của lớp cha.
   */
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
    super();
    // Bài ngữ pháp mặc định BẬT gợi ý: mẫu ngữ pháp là thứ đang học, bắt tự nhớ ra
    // mẫu nào hợp với câu là một bài khó hơn hẳn.
    this.showHint.set(true);
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

  setDirection(direction: PracticeDirection): void {
    this.direction.set(direction);
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

  // --- Favorite ---

  // --- Bắt đầu ---

  start(): void {
    const lesson = this.lesson();
    if (!lesson || !this.canStart()) return;

    const config = practiceConfig({
      lessonId: lesson.id,
      lessonKind: lesson.kind,
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: this.direction(),
      showGrammarHint: this.showHint(),
    });

    this.launch(
      { id: lesson.id, name: lesson.name },
      config,
      buildQuestions(lesson, { kind: 'grammar', examples: this.pool() }, config),
    );
  }
}
