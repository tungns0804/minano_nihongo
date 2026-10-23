/**
 * Toàn bộ chữ hiển thị của ứng dụng, hai ngôn ngữ đặt cạnh nhau để dễ soát.
 *
 * Mỗi khu vực một file trong `messages/` (vỏ ứng dụng, trang chủ, bài học, ngữ pháp…);
 * file này chỉ gộp chúng lại. Khoá trùng giữa hai file bị `npm run verify:i18n` bắt.
 *
 * Quy ước:
 *  - Khoá đặt theo màn hình: `home.*`, `lesson.*`, `practice.*`, `result.*`, `import.*`.
 *  - Chỗ cần chèn giá trị dùng `{ten}`, ví dụ `Câu {current}/{total}`.
 *  - Vài khoá có vi và ja giống hệt nhau (ます, る, て…) là cố ý: đó là thuật ngữ
 *    tiếng Nhật, giữ nguyên ở cả hai ngôn ngữ.
 *
 * KHÔNG dịch nội dung bài học (nghĩa tiếng Việt của từ vựng) — đó là dữ liệu học,
 * không phải giao diện.
 */

import { SHELL_MESSAGES } from './messages/shell';
import { TODAY_MESSAGES } from './messages/today';
import { HOME_MESSAGES } from './messages/home';
import { LESSON_MESSAGES } from './messages/lesson';
import { GRAMMAR_MESSAGES } from './messages/grammar';
import { TRANSLATE_MESSAGES } from './messages/translate';
import { EXERCISE_MESSAGES } from './messages/exercise';
import { TOPIC_MESSAGES } from './messages/topic';
import { KANJI_MESSAGES } from './messages/kanji';
import { RADICAL_MESSAGES } from './messages/radical';
import { PRACTICE_MESSAGES } from './messages/practice';
import { IMPORT_MESSAGES } from './messages/import';
import { N3_MESSAGES } from './messages/n3';
import { REVIEW_MESSAGES } from './messages/review';

export const LANGUAGES = ['vi', 'ja'] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_NAME: Record<Language, string> = {
  vi: 'Tiếng Việt',
  ja: '日本語',
};

/** Nhãn ngắn hiện trên nút chuyển ngôn ngữ. */
export const LANGUAGE_SHORT: Record<Language, string> = {
  vi: 'VI',
  ja: '日本',
};

/** Các phần của từ điển, giữ riêng để `verify:i18n` dò khoá trùng giữa các file. */
export const MESSAGE_PARTS = [
  SHELL_MESSAGES,
  TODAY_MESSAGES,
  HOME_MESSAGES,
  LESSON_MESSAGES,
  GRAMMAR_MESSAGES,
  TRANSLATE_MESSAGES,
  EXERCISE_MESSAGES,
  TOPIC_MESSAGES,
  KANJI_MESSAGES,
  RADICAL_MESSAGES,
  PRACTICE_MESSAGES,
  IMPORT_MESSAGES,
  N3_MESSAGES,
  REVIEW_MESSAGES,
] as const;

export const MESSAGES = {
  ...SHELL_MESSAGES,
  ...TODAY_MESSAGES,
  ...HOME_MESSAGES,
  ...LESSON_MESSAGES,
  ...GRAMMAR_MESSAGES,
  ...TRANSLATE_MESSAGES,
  ...EXERCISE_MESSAGES,
  ...TOPIC_MESSAGES,
  ...KANJI_MESSAGES,
  ...RADICAL_MESSAGES,
  ...PRACTICE_MESSAGES,
  ...IMPORT_MESSAGES,
  ...N3_MESSAGES,
  ...REVIEW_MESSAGES,
};

export type MessageKey = keyof typeof MESSAGES;
