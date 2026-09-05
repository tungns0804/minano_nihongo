import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IMPORT_LESSON_ENABLED } from '../../core/feature-flags';
import { T } from '../../core/i18n/t';
import type { MessageKey } from '../../core/i18n/messages';
import {
  LESSON_KIND_UNIT_KEY,
  LessonKind,
  LessonSummary,
  lessonKindsOfTab,
} from '../../core/models/vocabulary.model';
import { LeveledLessonBrowser } from '../../core/screens/lesson-browser';

/**
 * Trang chủ — tab "Từ vựng".
 *
 * Chỉ còn bài TỪ VỰNG. Bài chia động từ và bài dịch hội thoại đã chuyển sang tab
 * "Bài tập bổ trợ": cả hai là cách luyện chứ không phải kho từ để nhớ nghĩa. Vì
 * chỉ còn một loại nên bộ lọc "Loại bài học" cũng biến mất theo — một bộ lọc chỉ
 * có đúng một lựa chọn thì không lọc được gì.
 *
 * Danh sách loại bài thuộc trang này lấy từ `lessonKindsOfTab('home')` chứ không
 * viết cứng ở đây, để việc phân chia tab chỉ nằm ở một chỗ duy nhất.
 *
 * Ô tìm, bộ lọc cấp độ và nút tải lại đến từ `LeveledLessonBrowser` — tab Ngữ
 * pháp dùng đúng những thứ đó.
 */
@Component({
  selector: 'app-lesson-list',
  imports: [RouterLink, T],
  templateUrl: './lesson-list.html',
  styleUrl: './lesson-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonList extends LeveledLessonBrowser {
  /** Khối "chưa có bài học nào" có mời người dùng sang màn hình nạp bài không. */
  readonly importEnabled = IMPORT_LESSON_ENABLED;

  readonly favoriteCounts = this.favoriteStore.counts;

  protected levelStorageKey(): string {
    return 'jp-practice:level-filter';
  }

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

  /** Số liệu ở đầu trang đếm theo đúng phần đang hiển thị. */
  readonly visibleLessonCount = computed(() => this.lessons().length);

  readonly visibleItemCount = computed(() =>
    this.lessons().reduce((sum, lesson) => sum + lesson.itemCount, 0),
  );

  /** Khoá đếm số mục của một bài ("38 từ"), tra theo loại bài. */
  unitKeyOf(kind: LessonKind): MessageKey {
    return LESSON_KIND_UNIT_KEY[kind];
  }
}
