import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import { LessonSummary } from '../../core/models/vocabulary.model';
import { LeveledLessonBrowser } from '../../core/screens/lesson-browser';
import { SearchBox } from '../../shared/search-box';

/**
 * Tab "Ngữ pháp" — danh sách các bài ngữ pháp.
 *
 * Vì sao tách khỏi trang chủ: mỗi bài ngữ pháp là một trang lý thuyết dài, và khu
 * này nay phủ trọn 50 bài của giáo trình. Gom 50 thẻ đó vào cùng lưới với từ vựng
 * và động từ thì trang chủ chỉ còn là một danh sách dài không đọc nổi.
 *
 * Ô tìm, bộ lọc cấp độ và nút tải lại dùng chung với trang chủ qua
 * `LeveledLessonBrowser`; ở đây chỉ còn "lấy bài nào" và "đếm cái gì".
 */
@Component({
  selector: 'app-grammar-list',
  imports: [RouterLink, SearchBox, T],
  templateUrl: './grammar-list.html',
  styleUrl: './grammar-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarList extends LeveledLessonBrowser {
  protected levelStorageKey(): string {
    return 'jp-practice:grammar-level-filter';
  }

  /** Mọi bài ngữ pháp, chưa lọc — dùng để đếm tổng và biết đã tải xong hay chưa. */
  readonly allLessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => lesson.kind === 'grammar'),
  );

  /** Đếm mẫu ngữ pháp theo đúng phần đang hiển thị, để số liệu khớp với thứ nhìn thấy. */
  readonly pointCount = computed(() =>
    this.lessons().reduce((sum, lesson) => sum + lesson.itemCount, 0),
  );
}
