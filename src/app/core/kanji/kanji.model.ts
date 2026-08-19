/**
 * Khu "Kanji" — danh sách chữ Hán từ N5 tới N3, mỗi chữ kèm các từ dùng chữ đó.
 *
 * Vì sao là một tab riêng chứ không nằm trong bài học: bài học xếp theo giáo trình
 * (bài 1 → bài 50), còn ở đây một CHỮ gom từ của rất nhiều bài lại — chữ 気 có từ
 * của bài 1 lẫn bài 45. Nhét vào lưới bài học thì chúng không thuộc về bài nào cả.
 *
 * Dữ liệu đi qua hai file:
 *  - `kanji-supplement.ts` — bảng âm Hán Việt viết tay, CHỈ cho vài chữ mà kho từ
 *                            không suy ra được (xem ghi chú trong chính file đó).
 *  - `kanji-words.ts`      — do `npm run generate:kanji` sinh ra: chữ + âm Hán Việt
 *                            + từ minh hoạ, rút thẳng từ kho từ của ứng dụng.
 *
 * Hai màn hình dùng dữ liệu này:
 *  - `/kanji`      lưới chữ Hán theo cấp + luyện "chữ Hán → âm Hán Việt".
 *  - `/kanji/:id`  một chữ + luyện "từ → nghĩa" và "từ → hiragana".
 */

import type { MessageKey } from '../i18n/messages';

/**
 * Cấp độ JLPT của một chữ / một từ trong khu Kanji.
 *
 * Mốc chia lấy ĐÚNG quy ước có sẵn của ứng dụng (`JLPT_RANGE` ở
 * `models/vocabulary.model.ts`): N5 = từ vựng bài 1-25, N4 = bài 26-50, còn N3 lấy
 * từ bộ động từ của khu Bài tập. Không tự dựng danh sách kanji theo cấp JLPT ở
 * đâu khác — cả ứng dụng phải nói cùng một thứ tiếng khi nhắc tới "N5".
 */
export type KanjiLevel = 'N5' | 'N4' | 'N3';

export const KANJI_LEVELS: readonly KanjiLevel[] = ['N5', 'N4', 'N3'];

const LEVEL_RANK: Record<KanjiLevel, number> = { N5: 0, N4: 1, N3: 2 };

/** [từ, cách đọc kana, âm Hán Việt của cả từ, nghĩa, cấp độ] */
export type WordSeed = readonly [
  japanese: string,
  reading: string,
  hanViet: string,
  meaning: string,
  level: KanjiLevel,
];

/**
 * [chữ Hán, âm Hán Việt, các âm khác, cấp độ, các từ dùng chữ này]
 *
 * `altHanViet` là các âm khác cũng đọc được của chính chữ đó (行 HÀNH/HÀNG,
 * 長 TRƯỜNG/TRƯỞNG), ngăn nhau bằng dấu `/`. Rỗng nếu chữ chỉ có một âm.
 */
export type KanjiSeed = readonly [
  char: string,
  hanViet: string,
  altHanViet: string,
  level: KanjiLevel,
  words: readonly WordSeed[],
];

/** Một từ dùng chữ Hán đang xem. */
export interface KanjiWord {
  /**
   * Duy nhất trong phạm vi MỘT chữ — đủ dùng vì dấu ★ lưu theo từng chữ.
   * Gồm cả cách đọc vì có từ viết giống nhau mà đọc khác (降ります ふり/おり).
   */
  id: string;
  japanese: string;
  reading: string;
  /** Âm Hán Việt của cả từ. Rỗng với từ tới từ khu Bài tập (nguồn không có cột này). */
  hanViet: string;
  meaning: string;
  level: KanjiLevel;
}

export interface KanjiEntry {
  /**
   * Đoạn cuối đường dẫn `/kanji/<id>`, cũng là khoá lưu danh sách ★ của chữ này.
   * Ghép âm Hán Việt (đọc được khi soi localStorage) với mã Unicode của chữ — hai
   * chữ trùng âm (工 và 公 đều CÔNG) vẫn tách nhau được. KHÔNG đổi tuỳ tiện: đổi
   * là mất ★.
   */
  id: string;
  char: string;
  /** Rỗng khi kho từ không suy ra được âm nào — xem `kanji-supplement.ts`. */
  hanViet: string;
  /** Các âm khác của chính chữ này; khi luyện thì gõ âm nào cũng được tính đúng. */
  altHanViet: string[];
  level: KanjiLevel;
  words: KanjiWord[];
}

/**
 * Ba chiều hỏi của khu Kanji.
 *
 * `kanji-hanviet` hỏi trên CHỮ nên chỉ có ở màn hình danh sách; hai chiều còn lại
 * (và chiều trộn của chúng) hỏi trên TỪ nên chỉ có ở màn hình một chữ.
 */
export type KanjiMode = 'kanji-hanviet' | 'word-meaning' | 'word-reading' | 'word-mixed';

export interface KanjiModeInfo {
  id: KanjiMode;
  labelKey: MessageKey;
  shortKey: MessageKey;
  exampleKey: MessageKey;
}

/** Chiều hỏi của màn hình một chữ (hỏi trên từ). */
export const KANJI_WORD_MODES: readonly KanjiModeInfo[] = [
  {
    id: 'word-meaning',
    labelKey: 'kanji.mode.wordMeaning',
    shortKey: 'kanji.mode.wordMeaning.short',
    exampleKey: 'kanji.mode.wordMeaning.example',
  },
  {
    id: 'word-reading',
    labelKey: 'kanji.mode.wordReading',
    shortKey: 'kanji.mode.wordReading.short',
    exampleKey: 'kanji.mode.wordReading.example',
  },
  {
    id: 'word-mixed',
    labelKey: 'kanji.mode.wordMixed',
    shortKey: 'kanji.mode.wordMixed.short',
    exampleKey: 'kanji.mode.wordMixed.example',
  },
];

export const KANJI_HAN_VIET_MODE: KanjiModeInfo = {
  id: 'kanji-hanviet',
  labelKey: 'kanji.mode.kanjiHanViet',
  shortKey: 'kanji.mode.kanjiHanViet.short',
  exampleKey: 'kanji.mode.kanjiHanViet.example',
};

const ALL_MODES: readonly KanjiModeInfo[] = [KANJI_HAN_VIET_MODE, ...KANJI_WORD_MODES];

export function kanjiModeInfo(id: KanjiMode): KanjiModeInfo {
  return ALL_MODES.find((mode) => mode.id === id) ?? ALL_MODES[0];
}

/**
 * Chiều "trộn" sinh HAI câu cho mỗi từ (một hỏi nghĩa, một hỏi cách đọc) chứ không
 * bốc ngẫu nhiên một chiều: bốc ngẫu nhiên thì số câu mỗi lần luyện một khác, mà
 * dòng "sẽ luyện N câu" ở màn thiết lập lại phải nói trước con số đó.
 */
export function kanjiQuestionsPerItem(mode: KanjiMode): number {
  return mode === 'word-mixed' ? 2 : 1;
}

/**
 * Id "bài học" của phiên luyện âm Hán Việt của chữ.
 *
 * Phiên này không thuộc chữ nào cả (nó hỏi trên CẢ danh sách), nên cần một id riêng
 * để lưu dấu ★ và để màn hình kết quả biết đường quay về `/kanji` chứ không phải
 * `/kanji/<id>`. Đổi chuỗi này là mất ★ của phần luyện âm Hán Việt.
 */
export const KANJI_SESSION_ID = 'am-han-viet';

/** Dựng danh sách chữ đầy đủ từ dữ liệu nén mà script sinh ra. */
export function buildKanjiEntries(seeds: readonly KanjiSeed[]): KanjiEntry[] {
  return seeds.map(([char, hanViet, altHanViet, level, words]) => ({
    id: kanjiId(char, hanViet),
    char,
    hanViet,
    altHanViet: altHanViet ? altHanViet.split('/') : [],
    level,
    words: words.map(([japanese, reading, wordHanViet, meaning, wordLevel]) => ({
      id: `${japanese}|${reading}`,
      japanese,
      reading,
      hanViet: wordHanViet,
      meaning,
      level: wordLevel,
    })),
  }));
}

/** Cấp thấp nhất trong một nhóm từ — dùng cho dòng thống kê ở màn hình một chữ. */
export function lowestLevel(words: readonly KanjiWord[]): KanjiLevel {
  let level: KanjiLevel = 'N3';
  for (const word of words) {
    if (LEVEL_RANK[word.level] < LEVEL_RANK[level]) level = word.level;
  }
  return level;
}

/**
 * "nhan-4eba" — âm Hán Việt bỏ dấu, ghép mã Unicode của chữ.
 *
 * Cần cả hai nửa: chỉ âm Hán Việt thì 工 và 公 (đều CÔNG) đụng nhau, mà chỉ mã
 * Unicode thì nhìn vào localStorage không biết đó là chữ nào. Chữ chưa có âm Hán
 * Việt thì chỉ còn mã Unicode ("k-9032").
 */
function kanjiId(char: string, hanViet: string): string {
  const code = char.codePointAt(0)!.toString(16);
  const name = slug(hanViet);
  return name ? `${name}-${code}` : `k-${code}`;
}

function slug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
