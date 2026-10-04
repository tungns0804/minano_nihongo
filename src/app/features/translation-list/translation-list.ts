import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import { LessonSummary } from '../../core/lessons/vocabulary.model';
import { LeveledLessonBrowser } from '../../core/screens/lesson-browser';
import { SearchBox } from '../../shared/search-box';

/**
 * Tab "Luyện dịch" — danh sách 50 bài luyện dịch theo giáo trình.
 *
 * Cùng khung với tab Ngữ pháp (ô tìm, lọc cấp độ, tải lại — xem `LeveledLessonBrowser`):
 * hai tab đi song song theo đúng 50 bài, bài luyện dịch N chỉ dùng ngữ pháp từ bài 1
 * tới bài N.
 */
@Component({
  selector: 'app-translation-list',
  imports: [RouterLink, SearchBox, T],
  templateUrl: './translation-list.html',
  styleUrl: './translation-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslationList extends LeveledLessonBrowser {
  protected levelStorageKey(): string {
    return 'jp-practice:translate-level-filter';
  }

  readonly allLessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => lesson.kind === 'translation'),
  );

  /** Đếm câu theo đúng phần đang hiển thị, để số liệu khớp với thứ nhìn thấy. */
  readonly sentenceCount = computed(() =>
    this.lessons().reduce((sum, lesson) => sum + lesson.itemCount, 0),
  );
}
