import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LessonStore } from '../core/lessons/lesson-store';
import type { LessonKind } from '../core/lessons/vocabulary.model';
import { TOPIC_CATALOG } from '../core/topics/topic-catalog.generated';
import { topicLessonName } from '../core/topics/topic.model';
import { PagerItem, SiblingPager } from './sibling-pager';

/** Nhánh đường dẫn của từng loại bài có trang chi tiết riêng. */
const BASE: Partial<Record<LessonKind, string>> = {
  vocabulary: '/lesson',
  verb: '/lesson',
  conversation: '/lesson',
  grammar: '/grammar',
  translation: '/translate',
  topic: '/topic',
};

/**
 * "← Bài trước · Bài sau →" ở cuối trang chi tiết bài.
 *
 * Học xong bài 26 thì việc tiếp theo gần như luôn là bài 27 — trước đây phải quay về
 * danh sách, cuộn tìm, rồi bấm. Bài kề lấy trong CÙNG loại bài, theo đúng thứ tự của
 * danh sách (`LessonStore.summaries`), nên bài từ vựng không nhảy sang bài ngữ pháp.
 * Bài chủ đề không nằm trong danh sách đó mà trong danh mục chủ đề.
 */
@Component({
  selector: 'app-lesson-pager',
  imports: [SiblingPager],
  template: `
    <app-sibling-pager
      [items]="items()"
      [currentKey]="lessonId()"
      [prevKey]="kind() === 'topic' ? 'pager.prevTopic' : 'pager.prev'"
      [nextKey]="kind() === 'topic' ? 'pager.nextTopic' : 'pager.next'"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPager {
  private readonly lessons = inject(LessonStore);

  readonly lessonId = input.required<string>();
  readonly kind = input.required<LessonKind>();

  protected readonly items = computed<PagerItem[]>(() => {
    const base = BASE[this.kind()];
    if (!base) return [];
    if (this.kind() === 'topic') {
      return TOPIC_CATALOG.map((topic) => ({ key: topic.id, name: topicLessonName(topic), path: `${base}/${topic.id}` }));
    }
    return this.lessons
      .summaries()
      .filter((lesson) => lesson.kind === this.kind())
      .map((lesson) => ({ key: lesson.id, name: lesson.name, path: `${base}/${lesson.id}` }));
  });
}
