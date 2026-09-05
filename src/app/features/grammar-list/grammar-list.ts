import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import { LessonSummary, isJlptLevel, levelOf } from '../../core/models/vocabulary.model';
import { countByLevel, levelFilterOptions } from '../../core/models/level-filter';
import type { LevelFilter } from '../../core/models/level-filter';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { readJson, writeJson } from '../../core/services/local-storage';
import { valueOf } from '../../core/utils/dom-events';
import { lessonMatches, normalizeSearch } from '../../core/utils/lesson-search';

/**
 * Khoá lưu cấp độ đang chọn — RIÊNG của tab Ngữ pháp, không dùng chung khoá với
 * trang chủ. Hai tab có nội dung khác nhau nên người học rất hay ở N5 bên này mà
 * N4 bên kia; dùng chung một khoá thì mỗi lần đổi tab lại phải chọn lại.
 */
const LEVEL_KEY = 'jp-practice:grammar-level-filter';

/**
 * Tab "Ngữ pháp" — danh sách các bài ngữ pháp.
 *
 * Vì sao tách khỏi trang chủ: mỗi bài ngữ pháp là một trang lý thuyết dài, và khu
 * này nay phủ trọn 50 bài của giáo trình. Gom 50 thẻ đó vào cùng lưới với từ vựng
 * và động từ thì trang chủ chỉ còn là một danh sách dài không đọc nổi.
 */
@Component({
  selector: 'app-grammar-list',
  imports: [RouterLink, T],
  templateUrl: './grammar-list.html',
  styleUrl: './grammar-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarList {
  private readonly lessonStore = inject(LessonStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);

  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;

  /** Số thẻ xám vẽ trong lúc chờ tải. Đủ kín một màn hình, không cần đúng số thật. */
  readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  /** Từ khoá tìm bài, không nhớ sang lần mở sau — giống trang chủ. */
  private readonly searchRef = signal('');

  readonly search = this.searchRef.asReadonly();

  /** Cấp độ đang chọn. Nhớ lại cho lần mở sau, giống trang chủ. */
  private readonly levelRef = signal<LevelFilter>(readLevel());

  /** Mọi bài ngữ pháp, chưa lọc — dùng để đếm tổng và biết đã tải xong hay chưa. */
  readonly allLessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => lesson.kind === 'grammar'),
  );

  /**
   * Đếm số bài theo từng cấp. Đếm trên `allLessons` chứ không trên phần đang hiện,
   * để con số đứng yên trong lúc gõ tìm.
   */
  private readonly levelCounts = computed(() => countByLevel(this.allLessons()));

  /**
   * Cấp đang có hiệu lực. Cấp đã chọn mà không còn bài nào thì tự quay về "Tất cả" —
   * thà hiện lại tất cả còn hơn một trang trống không rõ lý do.
   */
  readonly level = computed<LevelFilter>(() => {
    const current = this.levelRef();
    if (current === 'all') return 'all';
    return this.levelCounts()[current] > 0 ? current : 'all';
  });

  readonly levelOptions = computed(() => levelFilterOptions(this.levelCounts()));

  readonly lessons = computed<LessonSummary[]>(() => {
    const level = this.level();
    const needle = normalizeSearch(this.searchRef());

    const byLevel =
      level === 'all'
        ? this.allLessons()
        : this.allLessons().filter((lesson) => (levelOf(lesson) ?? 'none') === level);

    return needle ? byLevel.filter((lesson) => lessonMatches(lesson, needle)) : byLevel;
  });

  /** Đang lọc mà không ra bài nào — hiện khung rỗng thay vì một lưới trống trơn. */
  readonly noMatch = computed(() => this.allLessons().length > 0 && this.lessons().length === 0);

  /** Đếm mẫu ngữ pháp theo đúng phần đang hiển thị, để số liệu khớp với thứ nhìn thấy. */
  readonly pointCount = computed(() =>
    this.lessons().reduce((sum, lesson) => sum + lesson.itemCount, 0),
  );

  constructor() {
    void this.lessonStore.loadIndex();
  }

  favoriteCount(lessonId: string): number {
    return this.favoriteStore.counts()[lessonId] ?? 0;
  }

  setLevel(value: LevelFilter): void {
    this.levelRef.set(value);
    writeJson(LEVEL_KEY, value);
  }

  onSearch(event: Event): void {
    this.searchRef.set(valueOf(event));
  }

  clearSearch(): void {
    this.searchRef.set('');
  }

  /** Xoá cả từ khoá lẫn bộ lọc cấp độ — nút thoát hiểm của khung "không tìm thấy". */
  resetFilters(): void {
    this.searchRef.set('');
    this.setLevel('all');
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}

function readLevel(): LevelFilter {
  const stored = readJson<unknown>(LEVEL_KEY, 'all');
  return stored === 'none' || isJlptLevel(stored) ? stored : 'all';
}
