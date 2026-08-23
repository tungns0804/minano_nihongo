import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import { LessonSummary } from '../../core/models/vocabulary.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { lessonMatches, normalizeSearch } from '../../core/utils/lesson-search';

/**
 * Tab "Ngữ pháp" — danh sách các bài ngữ pháp.
 *
 * Vì sao tách khỏi trang chủ: mỗi bài ngữ pháp là một trang lý thuyết dài, và kế
 * hoạch là phủ hết bài 26–50. Gom 25 thẻ đó vào cùng lưới với từ vựng và động từ
 * thì trang chủ chỉ còn là một danh sách dài không đọc nổi.
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

  /** Mọi bài ngữ pháp, chưa lọc — dùng để đếm tổng và biết đã tải xong hay chưa. */
  readonly allLessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => lesson.kind === 'grammar'),
  );

  readonly lessons = computed<LessonSummary[]>(() => {
    const needle = normalizeSearch(this.searchRef());
    if (!needle) return this.allLessons();
    return this.allLessons().filter((lesson) => lessonMatches(lesson, needle));
  });

  /** Đang tìm mà không ra bài nào — hiện khung rỗng thay vì một lưới trống trơn. */
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

  onSearch(event: Event): void {
    this.searchRef.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchRef.set('');
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}
