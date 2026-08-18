import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IMPORT_LESSON_ENABLED } from '../../core/feature-flags';
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
import { lessonMatches, normalizeSearch } from '../../core/utils/lesson-search';

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

  /** Khối "chưa có bài học nào" có mời người dùng sang màn hình nạp bài không. */
  readonly importEnabled = IMPORT_LESSON_ENABLED;

  readonly lessons = this.lessonStore.summaries;
  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;
  readonly favoriteCounts = this.favoriteStore.counts;

  /** Số thẻ xám vẽ trong lúc chờ tải. Đủ kín một màn hình, không cần đúng số thật. */
  readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  /** Loại bài học đang chọn để xem. Nhớ lại cho lần mở sau. */
  private readonly filterRef = signal<CategoryFilter>(readFilter());

  /**
   * Từ khoá tìm bài. KHÔNG nhớ sang lần mở sau, khác với bộ lọc loại: mở app lên
   * mà danh sách đã bị cắt sẵn theo thứ gõ hôm trước thì trông y như mất bài học.
   */
  private readonly searchRef = signal('');

  readonly search = this.searchRef.asReadonly();

  /** Dạng đã chuẩn hoá của từ khoá, tính một lần cho cả danh sách. */
  private readonly needle = computed(() => normalizeSearch(this.searchRef()));

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

  /** Các nhóm thực sự được hiển thị, sau cả lọc theo loại lẫn tìm theo từ khoá. */
  readonly categories = computed<LessonCategory[]>(() => {
    const active = this.filter();
    const needle = this.needle();

    const byKind =
      active === 'all'
        ? this.allCategories()
        : this.allCategories().filter((c) => c.kind === active);

    if (!needle) return byKind;

    // Nhóm không còn bài nào khớp thì bỏ luôn cả tiêu đề nhóm, không để lại một
    // tiêu đề trống lửng lơ.
    return byKind.flatMap((category) => {
      const lessons = category.lessons.filter((lesson) => lessonMatches(lesson, needle));
      return lessons.length === 0 ? [] : [{ ...category, lessons }];
    });
  });

  /** Đang tìm mà không ra bài nào — để hiện khung rỗng thay vì trang trắng. */
  readonly noMatch = computed(() => this.lessons().length > 0 && this.categories().length === 0);

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

  onSearch(event: Event): void {
    this.searchRef.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchRef.set('');
  }

  /** Xoá cả từ khoá lẫn bộ lọc loại — nút thoát hiểm của khung "không tìm thấy". */
  resetFilters(): void {
    this.searchRef.set('');
    this.setFilter('all');
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
