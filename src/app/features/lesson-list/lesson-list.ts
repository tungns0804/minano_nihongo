import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IMPORT_LESSON_ENABLED } from '../../core/feature-flags';
import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import type { MessageKey } from '../../core/i18n/messages';
import {
  JLPT_LEVELS,
  JLPT_RANGE,
  JlptLevel,
  LESSON_KIND_DESC_KEY,
  LESSON_KIND_LABEL_KEY,
  LESSON_KIND_UNIT_KEY,
  LessonKind,
  LessonSummary,
  levelOfLesson,
} from '../../core/models/vocabulary.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { readJson, writeJson } from '../../core/services/local-storage';
import { lessonMatches, normalizeSearch } from '../../core/utils/lesson-search';

/** Giá trị bộ lọc: 'all' hoặc một loại bài học cụ thể. */
type CategoryFilter = LessonKind | 'all';

/**
 * Bộ lọc cấp độ: 'all', một cấp JLPT, hoặc 'none' cho những bài không gắn với bài số
 * nào (hiện chỉ có bài gom động từ đặc biệt).
 */
type LevelFilter = JlptLevel | 'all' | 'none';

const FILTER_KEY = 'jp-practice:category-filter';
const LEVEL_KEY = 'jp-practice:level-filter';

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

interface LevelOption {
  value: LevelFilter;
  labelKey: MessageKey;
  /** Tham số chèn vào nhãn ("N5 · bài 1–25"); rỗng với mục không cần. */
  params: Record<string, string | number>;
  titleKey?: MessageKey;
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

  /** Cấp độ đang chọn. Nhớ lại cho lần mở sau, giống bộ lọc loại. */
  private readonly levelRef = signal<LevelFilter>(readLevel());

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

  /**
   * Cấp độ đang có hiệu lực. Cấp đã chọn mà không còn bài nào thì tự quay về "Tất cả",
   * cùng lý do với bộ lọc loại: thà hiện lại tất cả còn hơn một trang trống khó hiểu.
   */
  readonly level = computed<LevelFilter>(() => {
    const current = this.levelRef();
    if (current === 'all') return 'all';
    return this.levelCounts()[current] > 0 ? current : 'all';
  });

  /**
   * Đếm số bài theo từng cấp.
   *
   * Đếm trên các nhóm của TRANG CHỦ chứ không trên toàn bộ this.lessons(): bài ngữ pháp
   * có tab riêng và không bao giờ hiện ở đây, tính cả chúng vào thì ô "Tất cả" của cấp
   * độ ra 78 trong khi ô "Tất cả" của loại ngay bên dưới ra 53 — hai con số đá nhau.
   *
   * Cố tình KHÔNG trừ đi bộ lọc loại đang chọn: con số phải đứng yên khi đổi qua lại
   * giữa các loại, nếu không người dùng sẽ tưởng bài học vừa biến mất.
   */
  private readonly levelCounts = computed<Record<LevelFilter, number>>(() => {
    const counts = { all: 0, none: 0, N5: 0, N4: 0 } as Record<LevelFilter, number>;
    for (const category of this.allCategories()) {
      for (const lesson of category.lessons) {
        counts.all++;
        counts[levelOfLesson(lesson.lessonNumber) ?? 'none']++;
      }
    }
    return counts;
  });

  /**
   * Các nút chọn cấp độ. Mục "Không theo bài" chỉ hiện khi thật sự có bài như vậy —
   * bình thường nó chỉ là một nút lạ chẳng để làm gì.
   */
  readonly levelOptions = computed<LevelOption[]>(() => {
    const counts = this.levelCounts();
    const options: LevelOption[] = [
      { value: 'all', labelKey: 'home.level.all' as MessageKey, params: {}, count: counts.all },
      ...JLPT_LEVELS.map((level) => ({
        value: level as LevelFilter,
        labelKey: 'home.level.range' as MessageKey,
        params: { level, from: JLPT_RANGE[level].from, to: JLPT_RANGE[level].to },
        count: counts[level],
      })),
    ];
    if (counts.none > 0) {
      options.push({
        value: 'none',
        labelKey: 'home.level.none' as MessageKey,
        params: {},
        titleKey: 'home.level.noneTitle' as MessageKey,
        count: counts.none,
      });
    }
    return options;
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
    const level = this.level();
    const needle = this.needle();

    const byKind =
      active === 'all'
        ? this.allCategories()
        : this.allCategories().filter((c) => c.kind === active);

    const byLevel =
      level === 'all'
        ? byKind
        : byKind.flatMap((category) => {
            const lessons = category.lessons.filter(
              (lesson) => (levelOfLesson(lesson.lessonNumber) ?? 'none') === level,
            );
            return lessons.length === 0 ? [] : [{ ...category, lessons }];
          });

    if (!needle) return byLevel;

    // Nhóm không còn bài nào khớp thì bỏ luôn cả tiêu đề nhóm, không để lại một
    // tiêu đề trống lửng lơ.
    return byLevel.flatMap((category) => {
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

  setLevel(value: LevelFilter): void {
    this.levelRef.set(value);
    writeJson(LEVEL_KEY, value);
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
    this.setLevel('all');
  }

  favoriteCount(lessonId: string): number {
    return this.favoriteCounts()[lessonId] ?? 0;
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}

function readLevel(): LevelFilter {
  const stored = readJson<unknown>(LEVEL_KEY, 'all');
  return stored === 'none' || JLPT_LEVELS.includes(stored as JlptLevel)
    ? (stored as LevelFilter)
    : 'all';
}

function readFilter(): CategoryFilter {
  const stored = readJson<unknown>(FILTER_KEY, 'all');
  // Đối chiếu với CATEGORY_ORDER để thêm loại bài mới là bộ lọc nhớ được luôn.
  return CATEGORY_ORDER.includes(stored as LessonKind) ? (stored as CategoryFilter) : 'all';
}
