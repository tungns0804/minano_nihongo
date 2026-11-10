/**
 * Khối "Chữ Hán trong bài" của bài từ vựng N3: âm On / Kun của từng chữ, ví dụ lấy ngay
 * từ bảng từ của bài, và hai dạng luyện nhớ âm.
 *
 * File này chỉ có kiểu và hằng — nhẹ, nằm được trong gói chính (`practice.model.ts` cần
 * tên dạng luyện để gọi tên phiên). Phần dựng dữ liệu kéo theo bảng âm 73 kB nên nằm ở
 * `onkun-study.ts`, chỉ nạp khi mở bài N3.
 */

import type { MessageKey } from '../i18n/messages';
import type { KanjiSound } from './kanji-readings';

/** Âm của chữ trong một từ: On, Kun, hay cả cụm đọc đặc biệt (梅雨 つゆ, 部屋 へや). */
export type ExampleSound = KanjiSound | 'special';

/** Một âm của chữ, kèm việc bài có dùng tới nó không. */
export interface LessonReading {
  sound: KanjiSound;
  /** "れい", "つめ・たい" — okurigana tách bằng ・ như khối học của tab Trắc nghiệm. */
  label: string;
  /** Phần chữ Hán đọc, hiragana (れい, つめ) — đáp án của câu hỏi âm. */
  stem: string;
  /** Âm đặc biệt / dùng hẹp của bảng thường dụng — hiện mờ. */
  rare: boolean;
  /** Có từ nào trong bài đọc chữ theo âm này — tô đậm, để thấy ngay bài dạy âm nào. */
  used: boolean;
}

/** Một từ của bài có dùng chữ đang học. */
export interface LessonKanjiExample {
  wordId: string;
  japanese: string;
  reading: string;
  meaning: string;
  /**
   * Cách đọc cả từ chia ba khúc [trước, phần của chữ, sau] để tô phần của chữ: れい|ぞうこ.
   * null khi không căn được cách đọc vào từng chữ.
   */
  parts: readonly [string, string, string] | null;
  /** Chữ đọc theo âm nào trong từ này; null khi không căn được. */
  sound: ExampleSound | null;
  /** Âm (theo bảng) mà từ này dùng, "" với cụm đọc đặc biệt hay khi không căn được. */
  readingLabel: string;
  /**
   * Phần đọc của chữ đúng như trong từ, hiragana — có thể đã biến âm: 誕生 → じょう,
   * 出身 → しゅっ. Đáp án của câu "đọc chữ gạch chân".
   */
  said: string;
}

export interface LessonKanji {
  /** Id chữ ở khu Kanji — link sang trang chữ, và khoá ★ "chữ chưa nhớ âm" của bài. */
  id: string;
  char: string;
  hanViet: string;
  on: readonly LessonReading[];
  kun: readonly LessonReading[];
  examples: readonly LessonKanjiExample[];
}

// ── Dạng luyện ───────────────────────────────────────────────────────────

/**
 *  - `onkun-reading`  nhìn chữ, nhớ âm On (một câu) và âm Kun (một câu) của nó.
 *  - `onkun-in-word`  chữ gạch chân trong một từ của bài đọc là gì — mỗi cặp chữ × từ
 *                     một câu; lựa chọn nhiễu là chính các âm khác của chữ đó.
 */
export type OnKunMode = 'onkun-reading' | 'onkun-in-word';

export interface OnKunModeInfo {
  id: OnKunMode;
  labelKey: MessageKey;
  shortKey: MessageKey;
  exampleKey: MessageKey;
}

export const ON_KUN_MODES: readonly OnKunModeInfo[] = [
  {
    id: 'onkun-reading',
    labelKey: 'onkun.mode.reading',
    shortKey: 'onkun.mode.reading.short',
    exampleKey: 'onkun.mode.reading.example',
  },
  {
    id: 'onkun-in-word',
    labelKey: 'onkun.mode.inWord',
    shortKey: 'onkun.mode.inWord.short',
    exampleKey: 'onkun.mode.inWord.example',
  },
];

export function onKunModeInfo(id: OnKunMode): OnKunModeInfo {
  return ON_KUN_MODES.find((mode) => mode.id === id) ?? ON_KUN_MODES[0];
}

/**
 * Khoá ★ "chữ chưa nhớ âm" của một bài. Riêng khỏi khoá ★ của bài (id bài, giữ id TỪ):
 * chung khoá thì số ★ trên thẻ bài cộng lẫn chữ với từ, và nút "Xoá ★" của bảng từ xoá
 * luôn ★ của chữ.
 */
export function onKunFavoriteKey(lessonId: string): string {
  return `${lessonId}#am-on-kun`;
}

/** Từ có căn được âm On / Kun cho chữ — chỉ những từ đó mới thành câu "đọc chữ trong từ". */
export function isQuizzableExample(example: LessonKanjiExample): boolean {
  return (example.sound === 'on' || example.sound === 'kun') && example.said.length > 0;
}

/** Số câu một dạng luyện sinh ra từ các chữ — dòng "sẽ luyện N câu" phải nói đúng trước. */
export function onKunQuestionCount(kanji: readonly LessonKanji[], mode: OnKunMode): number {
  let count = 0;
  for (const item of kanji) {
    count +=
      mode === 'onkun-reading'
        ? Number(item.on.length > 0) + Number(item.kun.length > 0)
        : item.examples.filter(isQuizzableExample).length;
  }
  return count;
}
