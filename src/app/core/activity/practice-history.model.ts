/**
 * Số LƯỢT đã luyện của từng bài — toán thuần, không đụng tới Angular.
 *
 * Lịch ôn (`ReviewStore`) biết từng MỤC đã gặp bao nhiêu lần, nhật ký ngày
 * (`activity.model.ts`) biết mỗi NGÀY làm bao nhiêu câu, nhưng không chỗ nào trả lời
 * được câu người học hỏi mỗi lần mở bài: "bài này mình đã luyện mấy lần rồi?".
 *
 * Một lượt = một phiên làm tới câu cuối. Bỏ dở giữa chừng thì không tính — giống như
 * kết quả của phiên đó cũng không được tính. "Luyện lại câu sai", "Làm lại toàn bộ",
 * "Học tiếp cụm sau" đều là một lượt mới: người học thật sự ngồi làm thêm một vòng.
 * Số câu đi kèm (`questions`) cho biết lượt nào là vòng ngắn, lượt nào là cả bài.
 *
 * Khoá là `PracticeConfig.lessonId` — cùng khoá với `ReviewCard.source`, nên thẻ bài
 * ngoài danh sách đọc được bằng đúng id nó đã có. Phiên Ôn tập gom câu từ nhiều bài
 * nên không ghi vào đây.
 */

import type { DayNumber } from './activity.model';

export interface LessonPractice {
  /** Số lượt đã làm xong. */
  sessions: number;
  /** Tổng số câu của các lượt đó. */
  questions: number;
  correct: number;
  /** Số NGÀY khác nhau đã luyện bài này — 7 lượt dồn trong một tối khác 7 lượt rải 7 ngày. */
  days: number;
  /** Ngày luyện gần nhất. */
  lastDay: DayNumber;
}

export type PracticeHistory = Readonly<Record<string, LessonPractice>>;

/** Ghi một lượt vừa làm xong của bài `lessonId`, vào ngày `day`. */
export function recordSession(
  history: PracticeHistory,
  lessonId: string,
  day: DayNumber,
  questions: number,
  correct: number,
): PracticeHistory {
  if (!lessonId || questions <= 0) return history;
  const current = history[lessonId];
  return {
    ...history,
    [lessonId]: {
      sessions: (current?.sessions ?? 0) + 1,
      questions: (current?.questions ?? 0) + questions,
      correct: (current?.correct ?? 0) + Math.min(correct, questions),
      days: (current?.days ?? 0) + (current?.lastDay === day ? 0 : 1),
      lastDay: day,
    },
  };
}

/** Lần luyện gần nhất cách hôm nay bao nhiêu ngày (0 = hôm nay, không bao giờ âm). */
export function daysSince(entry: LessonPractice, today: DayNumber): number {
  return Math.max(0, today - entry.lastDay);
}

const isCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

/** Đọc lại từ localStorage, bỏ mọi dòng không đúng dạng. */
export function sanitizeHistory(raw: unknown): PracticeHistory {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {};
  const out: Record<string, LessonPractice> = {};
  for (const [lessonId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!lessonId || typeof value !== 'object' || value === null) continue;
    const { sessions, questions, correct, days, lastDay } = value as Partial<LessonPractice>;
    if (!isCount(sessions) || sessions === 0 || !isCount(questions) || !isCount(correct)) continue;
    if (!isCount(days) || !Number.isInteger(lastDay)) continue;
    out[lessonId] = {
      sessions,
      questions,
      correct: Math.min(correct, questions),
      days: Math.min(Math.max(days, 1), sessions),
      lastDay: lastDay as number,
    };
  }
  return out;
}
