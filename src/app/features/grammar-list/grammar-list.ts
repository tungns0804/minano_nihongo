import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import { LessonSummary } from '../../core/models/vocabulary.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';

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

  readonly lessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => lesson.kind === 'grammar'),
  );

  readonly pointCount = computed(() =>
    this.lessons().reduce((sum, lesson) => sum + lesson.itemCount, 0),
  );

  constructor() {
    void this.lessonStore.loadIndex();
  }

  favoriteCount(lessonId: string): number {
    return this.favoriteStore.counts()[lessonId] ?? 0;
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}
