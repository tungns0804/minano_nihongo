import { Signal, computed, inject, signal } from '@angular/core';

import { LanguageStore } from '../i18n/language-store';
import type { LevelFilter } from '../models/level-filter';
import { countByLevel, levelFilterOptions } from '../models/level-filter';
import { LessonSummary, isJlptLevel, levelOf } from '../models/vocabulary.model';
import { FavoriteStore } from '../services/favorite-store';
import { LessonStore } from '../services/lesson-store';
import { readJson, writeJson } from '../services/local-storage';
import { valueOf } from '../utils/dom-events';
import { lessonMatches, normalizeSearch } from '../utils/lesson-search';

/**
 * Phần chung của bốn trang danh sách: trang chủ, tab Ngữ pháp, tab Bài tập bổ
 * trợ và tab Chủ đề.
 *
 * Cả bốn đều là "một thanh công cụ có ô tìm, rồi một lưới thẻ", nên đều cần đúng
 * một ô tìm KHÔNG nhớ sang lần mở sau, đúng một cách đếm ★ trên thẻ, và (với ba
 * trang lấy dữ liệu qua mạng) đúng một nút tải lại.
 */
export abstract class LessonBrowser {
  protected readonly favoriteStore = inject(FavoriteStore);
  protected readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);

  /**
   * Từ khoá tìm. KHÔNG nhớ sang lần mở sau, khác với bộ lọc cấp độ: mở app lên mà
   * danh sách đã bị cắt sẵn theo thứ gõ hôm trước thì trông y như mất bài học.
   */
  readonly search = signal('');

  /** Dạng đã chuẩn hoá của từ khoá, tính một lần cho cả danh sách. */
  protected readonly needle = computed(() => normalizeSearch(this.search()));

  onSearch(event: Event): void {
    this.search.set(valueOf(event));
  }

  clearSearch(): void {
    this.search.set('');
  }

  /** Số mục đã đánh dấu ★ của một bài / chủ đề — con số trên thẻ. */
  favoriteCount(id: string): number {
    return this.favoriteStore.counts()[id] ?? 0;
  }
}

/**
 * Trang danh sách có thêm bộ lọc cấp độ: trang chủ và tab Ngữ pháp.
 *
 * Hai trang này chỉ khác nhau ở chỗ lấy bài nào (`allLessons`) và lưu cấp đang
 * chọn dưới khoá nào — mọi thứ còn lại, kể cả cách tự quay về "Tất cả" khi cấp
 * đang chọn hết bài, là một.
 */
export abstract class LeveledLessonBrowser extends LessonBrowser {
  protected readonly lessonStore = inject(LessonStore);

  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;

  /** Số thẻ xám vẽ trong lúc chờ tải. Đủ kín một màn hình, không cần đúng số thật. */
  readonly skeletonCards = [0, 1, 2, 3, 4, 5];

  /**
   * Khoá lưu cấp đang chọn. RIÊNG cho từng tab: nội dung hai tab khác nhau nên
   * người học rất hay ở N5 bên này mà N4 bên kia; dùng chung một khoá thì mỗi lần
   * đổi tab lại phải chọn lại.
   */
  protected abstract levelStorageKey(): string;

  /** Mọi bài thuộc tab này, chưa lọc gì. */
  abstract readonly allLessons: Signal<LessonSummary[]>;

  /** Cấp đã chọn, chưa kiểm tra còn bài hay không — đọc qua `level`. */
  private readonly pickedLevel = signal<LevelFilter>('all');

  /**
   * Đếm số bài theo từng cấp.
   *
   * Cố tình KHÔNG trừ đi từ khoá đang gõ: con số phải đứng yên khi gõ tìm, nếu
   * không người dùng sẽ tưởng bài học vừa biến mất.
   */
  protected readonly levelCounts = computed(() => countByLevel(this.allLessons()));

  /**
   * Cấp đang có hiệu lực. Cấp đã chọn mà không còn bài nào thì tự quay về "Tất cả":
   * thà hiện lại tất cả còn hơn một trang trống không rõ lý do.
   */
  readonly level = computed<LevelFilter>(() => {
    const current = this.pickedLevel();
    if (current === 'all') return 'all';
    return this.levelCounts()[current] > 0 ? current : 'all';
  });

  /** Các nút chọn cấp độ; cấp không có bài nào thì không hiện nút. */
  readonly levelOptions = computed(() => levelFilterOptions(this.levelCounts()));

  /** Các bài thực sự được hiển thị, sau cả lọc cấp độ lẫn tìm theo từ khoá. */
  readonly lessons = computed<LessonSummary[]>(() => {
    const level = this.level();
    const needle = this.needle();

    const byLevel =
      level === 'all'
        ? this.allLessons()
        : this.allLessons().filter((lesson) => (levelOf(lesson) ?? 'none') === level);

    return needle ? byLevel.filter((lesson) => lessonMatches(lesson, needle)) : byLevel;
  });

  /** Đang lọc mà không ra bài nào — hiện khung rỗng thay vì một lưới trống trơn. */
  readonly noMatch = computed(() => this.allLessons().length > 0 && this.lessons().length === 0);

  constructor() {
    super();
    const stored = readJson<unknown>(this.levelStorageKey(), 'all');
    if (stored === 'none' || isJlptLevel(stored)) this.pickedLevel.set(stored);
    void this.lessonStore.loadIndex();
  }

  setLevel(value: LevelFilter): void {
    this.pickedLevel.set(value);
    writeJson(this.levelStorageKey(), value);
  }

  /** Xoá cả từ khoá lẫn bộ lọc cấp độ — nút thoát hiểm của khung "không tìm thấy". */
  resetFilters(): void {
    this.search.set('');
    this.setLevel('all');
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}
