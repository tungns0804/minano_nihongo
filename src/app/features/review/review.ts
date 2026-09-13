import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import { PracticeQuestion, practiceConfig } from '../../core/models/practice.model';
import { buildReviewQuestions } from '../../core/practice/review-questions';
import {
  AreaSummary,
  REVIEW_AREAS,
  REVIEW_LIMITS,
  REVIEW_SESSION_ID,
  ReviewAnswerMode,
  ReviewArea,
  ReviewDirection,
  ReviewRef,
  areaOfKey,
} from '../../core/review/review.model';
import { LessonStore } from '../../core/services/lesson-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { ReviewStore } from '../../core/services/review-store';
import { shuffle } from '../../core/utils/random';

const AREA_LABEL_KEY: Record<ReviewArea, MessageKey> = {
  vocab: 'review.area.vocab',
  kanji: 'review.area.kanji',
  grammar: 'review.area.grammar',
  verb: 'review.area.verb',
};

const DIRECTION_OPTIONS: readonly { id: ReviewDirection; labelKey: MessageKey }[] = [
  { id: 'jp-vi', labelKey: 'direction.jp-vi.short' },
  { id: 'vi-jp', labelKey: 'direction.vi-jp.short' },
];

type MistakeFilter = ReviewArea | 'all';

/** Một mục trong sổ lỗi sai, đã dựng lại nội dung để hiện ra. */
interface MistakeItem {
  key: string;
  area: ReviewArea;
  lapses: number;
  question: PracticeQuestion;
}

/**
 * Trang "Ôn tập": lịch ôn ngắt quãng của mọi mục đã luyện, và sổ lỗi sai.
 *
 * Không có dữ liệu riêng: lịch ôn tự đầy lên từ các phiên luyện ở những khu khác
 * (xem `PracticeSessionStore.remember`). Trang này chỉ đọc lịch, dựng lại câu hỏi
 * cho các mục đến hạn rồi giao cho đúng màn hình luyện tập và kết quả chung.
 */
@Component({
  selector: 'app-review',
  imports: [RouterLink, T],
  templateUrl: './review.html',
  styleUrl: './review.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Review {
  private readonly reviews = inject(ReviewStore);
  private readonly lessonStore = inject(LessonStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly router = inject(Router);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);

  readonly areas = REVIEW_AREAS;
  readonly limits = REVIEW_LIMITS;
  readonly directions = DIRECTION_OPTIONS;
  readonly areaLabelKey = AREA_LABEL_KEY;

  readonly summary = this.reviews.summary;
  readonly settings = this.reviews.settings;
  readonly persistFailed = this.reviews.persistFailed;
  readonly dueTotal = this.reviews.dueTotal;

  readonly trackedTotal = computed(() => this.total('tracked'));
  readonly masteredTotal = computed(() => this.total('mastered'));
  readonly mistakeTotal = computed(() => this.total('mistakes'));

  // --- Ôn hôm nay ---

  /** Mục đến hạn ở các khu đang chọn, quá hạn lâu nhất đứng đầu. */
  private readonly dueKeys = computed(() => this.reviews.dueKeys(this.settings().areas));

  readonly plannedCount = computed(() => {
    const limit = this.settings().limit;
    const count = this.dueKeys().length;
    return limit === null ? count : Math.min(limit, count);
  });

  /** Đang dựng câu hỏi (có thể phải tải bài học về) — khoá nút để không bấm hai lần. */
  readonly starting = signal(false);

  /** Lần bấm bắt đầu gần nhất không dựng được câu nào. */
  readonly buildFailed = signal(false);

  // --- Sổ lỗi sai ---

  readonly mistakeFilter = signal<MistakeFilter>('all');

  private readonly mistakeKeys = computed(() => this.reviews.mistakeKeys(REVIEW_AREAS));

  /** Nội dung đã dựng lại của các mục trong sổ; null khi chưa dựng xong lần đầu. */
  private readonly mistakeItems = signal<MistakeItem[] | null>(null);
  private loadToken = 0;

  readonly mistakesLoading = computed(() => this.mistakeItems() === null);

  /**
   * Mục đã có nội dung, lọc lại theo sổ HIỆN TẠI: bấm "Bỏ khỏi sổ" thì mục biến mất
   * ngay, không phải chờ lần dựng lại chạy xong.
   */
  private readonly loadedMistakes = computed<MistakeItem[]>(() => {
    const keys = new Set(this.mistakeKeys());
    return (this.mistakeItems() ?? []).filter((item) => keys.has(item.key));
  });

  readonly visibleMistakes = computed<MistakeItem[]>(() => {
    const filter = this.mistakeFilter();
    const items = this.loadedMistakes();
    return filter === 'all' ? items : items.filter((item) => item.area === filter);
  });

  /** Mục trong sổ mà không dựng lại được nội dung (bài chưa tải được hoặc đã xoá). */
  readonly unavailableMistakes = computed(() =>
    this.mistakeItems() === null
      ? 0
      : Math.max(0, this.mistakeKeys().length - this.loadedMistakes().length),
  );

  constructor() {
    this.reviews.refreshDay();

    // Dựng lại nội dung mỗi khi sổ đổi. `untracked` để lần dựng không tự đăng ký phụ
    // thuộc vào cả kho lịch ôn — `refsOf` đọc từng thẻ bên trong.
    effect(() => {
      const keys = this.mistakeKeys();
      untracked(() => void this.loadMistakes(keys));
    });
  }

  // --- Thiết lập ---

  isAreaSelected(area: ReviewArea): boolean {
    return this.settings().areas.includes(area);
  }

  toggleArea(area: ReviewArea): void {
    const current = this.settings().areas;
    // Luôn phải còn ít nhất một khu, không thì không còn gì để ôn.
    if (current.includes(area) && current.length === 1) return;

    const next = current.includes(area)
      ? current.filter((item) => item !== area)
      : [...current, area];
    this.reviews.updateSettings({ areas: REVIEW_AREAS.filter((item) => next.includes(item)) });
  }

  setLimit(limit: number | null): void {
    this.reviews.updateSettings({ limit });
  }

  setAnswerMode(answerMode: ReviewAnswerMode): void {
    this.reviews.updateSettings({ answerMode });
  }

  setDirection(direction: ReviewDirection): void {
    this.reviews.updateSettings({ direction });
  }

  setMistakeFilter(filter: MistakeFilter): void {
    this.mistakeFilter.set(filter);
  }

  dismiss(key: string): void {
    this.reviews.dismissMistake(key);
  }

  // --- Bắt đầu ---

  start(): void {
    const limit = this.settings().limit;
    const keys = this.dueKeys();
    // Cắt theo giới hạn TRƯỚC khi trộn (việc trộn nằm ở `launch`): phần bị cắt phải
    // là những mục ít quá hạn nhất, còn thứ tự hỏi thì không nên lộ thứ tự ưu tiên đó.
    void this.launch(limit === null ? keys : keys.slice(0, limit), 'review.sessionName');
  }

  practiceMistakes(): void {
    void this.launch(
      this.visibleMistakes().map((item) => item.key),
      'review.mistakes.sessionName',
    );
  }

  private async launch(keys: readonly string[], nameKey: MessageKey): Promise<void> {
    if (keys.length === 0 || this.starting()) return;
    this.starting.set(true);
    this.buildFailed.set(false);

    try {
      const { answerMode, direction } = this.settings();
      const questions = shuffle(
        await buildReviewQuestions(this.refsOf(keys), (id) => this.lessonStore.getLesson(id), {
          answerMode,
          direction,
        }),
      );

      const config = practiceConfig({
        lessonId: REVIEW_SESSION_ID,
        // Phiên ôn gom nhiều khu nên loại bài không nói lên gì; `review` mới là cờ mà
        // màn hình kết quả xét, còn khoá lịch ôn và khoá ★ thì đi theo từng câu.
        lessonKind: 'vocabulary',
        review: true,
        answerMode,
        direction,
      });

      const started = this.session.start(
        { id: REVIEW_SESSION_ID, name: this.t(nameKey) },
        config,
        { questions, all: questions },
      );
      if (started) {
        void this.router.navigate(['/practice']);
      } else {
        this.buildFailed.set(true);
      }
    } finally {
      this.starting.set(false);
    }
  }

  private async loadMistakes(keys: readonly string[]): Promise<void> {
    const token = ++this.loadToken;
    const questions = await buildReviewQuestions(
      this.refsOf(keys),
      (id) => this.lessonStore.getLesson(id),
      { answerMode: 'typing', direction: 'jp-vi' },
    );
    // Sổ đã đổi tiếp trong lúc đang dựng — kết quả này cũ rồi, lần dựng sau sẽ ghi.
    if (token !== this.loadToken) return;

    this.mistakeItems.set(
      questions.flatMap((question) => {
        const key = question.review?.key ?? '';
        const area = areaOfKey(key);
        return area ? [{ key, area, lapses: this.reviews.cardOf(key)?.lapses ?? 0, question }] : [];
      }),
    );
  }

  private refsOf(keys: readonly string[]): ReviewRef[] {
    return keys.flatMap((key) => {
      const card = this.reviews.cardOf(key);
      return card ? [{ key, source: card.source }] : [];
    });
  }

  private total(field: keyof AreaSummary): number {
    const summary = this.summary();
    return REVIEW_AREAS.reduce((sum, area) => sum + summary[area][field], 0);
  }
}
