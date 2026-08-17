import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import type { MessageKey } from '../../core/i18n/messages';
import {
  LESSON_KIND_DESC_KEY,
  LESSON_KIND_LABEL_KEY,
  LESSON_KIND_UNIT_KEY,
  LessonKind,
  LessonSummary,
} from '../../core/models/vocabulary.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { readJson, writeJson } from '../../core/services/local-storage';

/** Giá trị bộ lọc: 'all' hoặc một loại bài học cụ thể. */
type CategoryFilter = LessonKind | 'all';

const FILTER_KEY = 'jp-practice:category-filter';

interface LessonCategory {
  kind: LessonKind;
  labelKey: MessageKey;
  unitKey: MessageKey;
  descriptionKey: MessageKey;
  lessons: LessonSummary[];
}

interface FilterOption {
  value: CategoryFilter;
  labelKey: MessageKey;
  count: number;
}

/** Thứ tự hiển thị các nhóm bài học ngoài trang chủ. */
const CATEGORY_ORDER: readonly LessonKind[] = ['vocabulary', 'verb', 'conversation'];

@Component({
  selector: 'app-lesson-list',
  imports: [RouterLink, T],
  templateUrl: './lesson-list.html',
  styleUrl: './lesson-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonList {
  private readonly lessonStore = inject(LessonStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);

  readonly lessons = this.lessonStore.summaries;
  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;
  readonly favoriteCounts = this.favoriteStore.counts;

  /** Loại bài học đang chọn để xem. Nhớ lại cho lần mở sau. */
  private readonly filterRef = signal<CategoryFilter>(readFilter());

  /** Toàn bộ nhóm có bài, chưa lọc — dùng để dựng các nút chọn. */
  private readonly allCategories = computed<LessonCategory[]>(() => {
    const all = this.lessons();
    return CATEGORY_ORDER.flatMap((kind) => {
      const lessons = all.filter((lesson) => lesson.kind === kind);
      if (lessons.length === 0) return [];
      return [
        {
          kind,
          labelKey: LESSON_KIND_LABEL_KEY[kind],
          unitKey: LESSON_KIND_UNIT_KEY[kind],
          descriptionKey: LESSON_KIND_DESC_KEY[kind],
          lessons,
        },
      ];
    });
  });

  /**
   * Bộ lọc đang có hiệu lực. Nếu loại đã chọn không còn bài nào (ví dụ vừa xoá
   * bài tự nạp cuối cùng của loại đó) thì tự quay về "Tất cả" để không hiện
   * trang trống mà không rõ lý do.
   */
  readonly filter = computed<CategoryFilter>(() => {
    const current = this.filterRef();
    if (current === 'all') return 'all';
    return this.allCategories().some((c) => c.kind === current) ? current : 'all';
  });

  /** Chỉ hiện nút lọc khi có từ hai loại trở lên — một loại thì lọc vô nghĩa. */
  readonly filterOptions = computed<FilterOption[]>(() => {
    const categories = this.allCategories();
    if (categories.length < 2) return [];

    return [
      {
        value: 'all' as const,
        labelKey: 'home.filter.all' as MessageKey,
        count: categories.reduce((sum, c) => sum + c.lessons.length, 0),
      },
      ...categories.map((c) => ({
        value: c.kind,
        labelKey: c.labelKey,
        count: c.lessons.length,
      })),
    ];
  });

  /** Các nhóm thực sự được hiển thị sau khi lọc. */
  readonly categories = computed<LessonCategory[]>(() => {
    const active = this.filter();
    const categories = this.allCategories();
    return active === 'all' ? categories : categories.filter((c) => c.kind === active);
  });

  /** Số liệu ở đầu trang đếm theo đúng phần đang hiển thị. */
  readonly visibleLessonCount = computed(() =>
    this.categories().reduce((sum, c) => sum + c.lessons.length, 0),
  );

  readonly visibleItemCount = computed(() =>
    this.categories().reduce(
      (sum, c) => sum + c.lessons.reduce((n, lesson) => n + lesson.itemCount, 0),
      0,
    ),
  );

  constructor() {
    void this.lessonStore.loadIndex();
  }

  setFilter(value: CategoryFilter): void {
    this.filterRef.set(value);
    writeJson(FILTER_KEY, value);
  }

  favoriteCount(lessonId: string): number {
    return this.favoriteCounts()[lessonId] ?? 0;
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}

function readFilter(): CategoryFilter {
  const stored = readJson<unknown>(FILTER_KEY, 'all');
  // Đối chiếu với CATEGORY_ORDER để thêm loại bài mới là bộ lọc nhớ được luôn.
  return CATEGORY_ORDER.includes(stored as LessonKind) ? (stored as CategoryFilter) : 'all';
}
