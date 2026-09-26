import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import { LessonSummary, lessonKindsOfTab } from '../../core/lessons/vocabulary.model';
import { LessonBrowser } from '../../core/screens/lesson-browser';
import { LessonStore } from '../../core/lessons/lesson-store';
import { lessonMatches } from '../../core/lessons/lesson-search';
import { SearchBox } from '../../shared/search-box';

/**
 * Tab "BTVN N3 cơ bản" — bài tập về nhà của khoá N3 cơ bản.
 *
 * Mỗi bài là một cụm 10 từ đánh số liền nhau (1-10, 11-20…) theo đúng thứ tự giao
 * bài. KHÔNG có bộ lọc cấp độ: cả khu là N3, một bộ lọc chỉ có một lựa chọn thì
 * không lọc được gì — nên kế thừa `LessonBrowser` như tab Bài tập bổ trợ chứ không
 * phải `LeveledLessonBrowser`.
 *
 * Khối tổng quan đứng đầu trang vì khu này khác các khu từ vựng kia ở NGUỒN: nó chép
 * lại thẻ được giao làm bài chứ không bám một giáo trình, nên người mở lần đầu cần
 * biết mỗi bài có gì và học theo trình tự nào.
 */
@Component({
  selector: 'app-homework-list',
  imports: [RouterLink, SearchBox, T],
  templateUrl: './homework-list.html',
  styleUrl: './homework-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeworkList extends LessonBrowser {
  private readonly lessonStore = inject(LessonStore);

  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;

  /** Số thẻ xám vẽ trong lúc chờ tải danh sách bài. */
  readonly skeletonCards = [0, 1, 2];

  readonly overviewSteps: readonly MessageKey[] = [
    'homework.overview.step1',
    'homework.overview.step2',
    'homework.overview.step3',
    'homework.overview.step4',
  ];

  private readonly kinds = lessonKindsOfTab('homework');

  /** Mọi bài của tab, chưa lọc — để phân biệt "chưa tải" với "không khớp từ khoá". */
  readonly allLessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => this.kinds.includes(lesson.kind)),
  );

  readonly lessons = computed<LessonSummary[]>(() => {
    const needle = this.needle();
    const all = this.allLessons();
    return needle ? all.filter((lesson) => lessonMatches(lesson, needle)) : all;
  });

  readonly noMatch = computed(() => this.allLessons().length > 0 && this.lessons().length === 0);

  readonly visibleWordCount = computed(() =>
    this.lessons().reduce((sum, lesson) => sum + lesson.itemCount, 0),
  );

  constructor() {
    super();
    void this.lessonStore.loadIndex();
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}
