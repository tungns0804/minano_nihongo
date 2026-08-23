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
  LESSON_KIND_UNIT_KEY,
  LessonKind,
  LessonSummary,
  lessonKindsOfTab,
  levelOfLesson,
} from '../../core/models/vocabulary.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { readJson, writeJson } from '../../core/services/local-storage';
import { lessonMatches, normalizeSearch } from '../../core/utils/lesson-search';

/**
 * Bộ lọc cấp độ: 'all', một cấp JLPT, hoặc 'none' cho những bài không gắn với bài số
 * nào.
 */
type LevelFilter = JlptLevel | 'all' | 'none';

const LEVEL_KEY = 'jp-practice:level-filter';

interface LevelOption {
  value: LevelFilter;
  labelKey: MessageKey;
  /** Tham số chèn vào nhãn ("N5 · bài 1–25"); rỗng với mục không cần. */
  params: Record<string, string | number>;
  titleKey?: MessageKey;
  count: number;
}

/**
 * Trang chủ — "Từ vựng minano".
 *
 * Chỉ còn bài TỪ VỰNG. Bài chia động từ và bài dịch hội thoại đã chuyển sang tab
 * "Bài tập bổ trợ": cả hai là cách luyện chứ không phải kho từ để nhớ nghĩa. Vì
 * chỉ còn một loại nên bộ lọc "Loại bài học" cũng biến mất theo — một bộ lọc chỉ
 * có đúng một lựa chọn thì không lọc được gì.
 *
 * Danh sách loại bài thuộc trang này lấy từ `lessonKindsOfTab('home')` chứ không
 * viết cứng ở đây, để việc phân chia tab chỉ nằm ở một chỗ duy nhất.
 */
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

  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;
  readonly favoriteCounts = this.favoriteStore.counts;

  /** Số thẻ xám vẽ trong lúc chờ tải. Đủ kín một màn hình, không cần đúng số thật. */
  readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  /** Cấp độ đang chọn. Nhớ lại cho lần mở sau. */
  private readonly levelRef = signal<LevelFilter>(readLevel());

  /**
   * Từ khoá tìm bài. KHÔNG nhớ sang lần mở sau, khác với bộ lọc cấp độ: mở app lên
   * mà danh sách đã bị cắt sẵn theo thứ gõ hôm trước thì trông y như mất bài học.
   */
  private readonly searchRef = signal('');

  readonly search = this.searchRef.asReadonly();

  /** Dạng đã chuẩn hoá của từ khoá, tính một lần cho cả danh sách. */
  private readonly needle = computed(() => normalizeSearch(this.searchRef()));

  private readonly homeKinds = lessonKindsOfTab('home');

  /**
   * Mọi bài thuộc trang này, chưa lọc.
   *
   * Dùng để đếm cho bộ lọc cấp độ và để biết trang đang "chưa có bài nào" hay chỉ
   * là "không khớp từ khoá" — hai tình huống cần hai khung rỗng khác nhau.
   */
  readonly allLessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => this.homeKinds.includes(lesson.kind)),
  );

  /**
   * Cấp độ đang có hiệu lực. Cấp đã chọn mà không còn bài nào thì tự quay về "Tất cả":
   * thà hiện lại tất cả còn hơn một trang trống không rõ lý do.
   */
  readonly level = computed<LevelFilter>(() => {
    const current = this.levelRef();
    if (current === 'all') return 'all';
    return this.levelCounts()[current] > 0 ? current : 'all';
  });

  /**
   * Đếm số bài theo từng cấp.
   *
   * Đếm trên `allLessons` chứ không trên toàn bộ `summaries()`: bài ngữ pháp và bài
   * ở tab Bài tập bổ trợ đều không hiện ở đây, tính cả chúng vào thì ô "Tất cả" ra
   * một con số không khớp với thứ đang nhìn thấy.
   *
   * Cố tình KHÔNG trừ đi từ khoá đang gõ: con số phải đứng yên khi gõ tìm, nếu không
   * người dùng sẽ tưởng bài học vừa biến mất.
   */
  private readonly levelCounts = computed<Record<LevelFilter, number>>(() => {
    const counts = { all: 0, none: 0, N5: 0, N4: 0 } as Record<LevelFilter, number>;
    for (const lesson of this.allLessons()) {
      counts.all++;
      counts[levelOfLesson(lesson.lessonNumber) ?? 'none']++;
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

  /** Các bài thực sự được hiển thị, sau cả lọc cấp độ lẫn tìm theo từ khoá. */
  readonly lessons = computed<LessonSummary[]>(() => {
    const level = this.level();
    const needle = this.needle();

    const byLevel =
      level === 'all'
        ? this.allLessons()
        : this.allLessons().filter(
            (lesson) => (levelOfLesson(lesson.lessonNumber) ?? 'none') === level,
          );

    return needle ? byLevel.filter((lesson) => lessonMatches(lesson, needle)) : byLevel;
  });

  /** Đang lọc mà không ra bài nào — để hiện khung rỗng thay vì một lưới trống trơn. */
  readonly noMatch = computed(() => this.allLessons().length > 0 && this.lessons().length === 0);

  /** Số liệu ở đầu trang đếm theo đúng phần đang hiển thị. */
  readonly visibleLessonCount = computed(() => this.lessons().length);

  readonly visibleItemCount = computed(() =>
    this.lessons().reduce((sum, lesson) => sum + lesson.itemCount, 0),
  );

  constructor() {
    void this.lessonStore.loadIndex();
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

  /** Xoá cả từ khoá lẫn bộ lọc cấp độ — nút thoát hiểm của khung "không tìm thấy". */
  resetFilters(): void {
    this.searchRef.set('');
    this.setLevel('all');
  }

  /** Khoá đếm số mục của một bài ("38 từ"), tra theo loại bài. */
  unitKeyOf(kind: LessonKind): MessageKey {
    return LESSON_KIND_UNIT_KEY[kind];
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
