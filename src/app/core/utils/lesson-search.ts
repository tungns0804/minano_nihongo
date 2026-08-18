import type { LessonSummary } from '../models/vocabulary.model';
import { stripDiacritics } from './vocabulary-parser';

/**
 * Tìm bài học theo từ khoá — dùng chung cho trang chủ và tab Ngữ pháp.
 *
 * Danh sách đã hơn 50 bài, mà mỗi bài chỉ khác nhau đúng con số ("Bài 26", "Bài 27",
 * "Bài 28"…). Cuộn mắt qua một lưới thẻ như vậy để tìm bài 43 là việc mà máy nên làm
 * thay người.
 */

/** Đưa chuỗi về dạng so khớp: bỏ dấu tiếng Việt, thường hoá, gộp khoảng trắng. */
export function normalizeSearch(value: string): string {
  return stripDiacritics(String(value ?? ''))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Bài học có khớp từ khoá không.
 *
 * Khớp theo TỪNG TỪ chứ không theo cả cụm: gõ "33 dong tu" vẫn ra "皆の日本語 — Bài 33
 * · Động từ" dù trong tên thật hai phần đó cách nhau mấy chữ. Tìm cả trong id vì id
 * chứa dạng không dấu của tên ("dong-tu-minano-33"), nên người ngại bật bộ gõ vẫn
 * tìm được.
 */
export function lessonMatches(lesson: LessonSummary, needle: string): boolean {
  if (!needle) return true;

  const haystack = normalizeSearch(`${lesson.name} ${lesson.description} ${lesson.id}`);
  return needle.split(' ').every((word) => haystack.includes(word));
}
