import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LessonStore } from '../core/lessons/lesson-store';
import type { LessonKind } from '../core/lessons/vocabulary.model';
import { lessonPath } from '../core/paths';
import { TOPIC_CATALOG } from '../core/topics/topic-catalog.generated';
import { topicLessonName } from '../core/topics/topic.model';
import { PagerItem, SiblingPager } from './sibling-pager';

/** Loại bài có trang chi tiết dựng từ dữ liệu — loại khác không có bài kề để lật. */
const PAGED_KINDS: ReadonlySet<LessonKind> = new Set([
  'vocabulary',
  'verb',
  'conversation',
  'grammar',
  'translation',
  'topic',
]);

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
  /** Tham số giữ nguyên khi lật bài — ví dụ `?tab=kanji` để sang bài sau vẫn ở tab Chữ Hán. */
  readonly query = input<Readonly<Record<string, string>> | undefined>(undefined);

  protected readonly items = computed<PagerItem[]>(() => {
    const query = this.query();
    return this.paths().map((item) => (query ? { ...item, query } : item));
  });

  private readonly paths = computed<PagerItem[]>(() => {
    const kind = this.kind();
    if (!PAGED_KINDS.has(kind)) return [];
    if (kind === 'topic') {
      return TOPIC_CATALOG.map((topic) => ({
        key: topic.id,
        name: topicLessonName(topic),
        path: lessonPath('topic', topic.id),
      }));
    }
    return this.lessons
      .summaries()
      .filter((lesson) => lesson.kind === kind)
      .map((lesson) => ({ key: lesson.id, name: lesson.name, path: lessonPath(kind, lesson.id) }));
  });
}
