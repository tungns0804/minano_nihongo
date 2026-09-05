import type { Lesson } from '../models/vocabulary.model';
import { TOPIC_CATALOG } from './topic-catalog';
import { TOPIC_SEEDS } from './topic-words';
import { buildTopicLessons } from './topic.model';

/**
 * PHẦN NẶNG của khu chủ đề — nạp ĐỘNG, đừng `import` thẳng file này.
 *
 * Nó kéo theo `topic-words.ts` (~130 KB), tức toàn bộ từ vựng của 20 chủ đề. Chỉ
 * đúng một màn hình cần chỗ đó: `/topic/:id` khi người dùng thật sự mở một chủ
 * đề. `LessonStore` vì vậy gọi `await import('../topics/topic-entries')` ngay
 * trong `getLesson` thay vì nhập ở đầu file — nhập thẳng vào một service gốc thì
 * mọi trang, kể cả trang chủ, đều phải tải 130 KB đó.
 *
 * Muốn biết CÓ những chủ đề nào (tên, số từ) thì dùng `topic-catalog.ts` — nhẹ,
 * nhập thẳng được.
 */
export const TOPIC_LESSONS: readonly Lesson[] = buildTopicLessons(TOPIC_CATALOG, TOPIC_SEEDS);

/** Tra nhanh theo id ("gia-dinh"). */
const BY_ID = new Map(TOPIC_LESSONS.map((lesson) => [lesson.id, lesson]));

/** Bài học của một chủ đề, hoặc null nếu id không phải của chủ đề nào. */
export function topicLesson(id: string): Lesson | null {
  return BY_ID.get(id) ?? null;
}
