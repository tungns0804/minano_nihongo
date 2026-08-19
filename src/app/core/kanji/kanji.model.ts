/**
 * Khu "Kanji" — học chữ Hán theo BỘ THỦ (部首).
 *
 * Vì sao là một tab riêng chứ không nằm trong bài học: bài học xếp theo giáo trình
 * (bài 1 → bài 50), còn ở đây một bộ thủ gom chữ của rất nhiều bài lại — bộ 氵
 * (THUỶ) có từ của bài 5 lẫn bài 47. Nhét vào lưới bài học thì chúng không thuộc
 * về bài nào cả.
 *
 * Dữ liệu đi qua hai file:
 *  - `radical-table.ts`   — bảng bộ thủ viết tay: hình dạng, âm Hán Việt, kanji thuộc bộ.
 *  - `radical-words.ts`   — do `npm run generate:kanji` sinh ra: ghép bảng trên với
 *                           kho từ có sẵn của ứng dụng để mỗi bộ có từ minh hoạ thật.
 *
 * Hai màn hình dùng dữ liệu này:
 *  - `/kanji`      danh sách bộ thủ + luyện "bộ thủ → âm Hán Việt".
 *  - `/kanji/:id`  một bộ thủ + luyện "từ → nghĩa" và "từ → hiragana".
 */

import type { MessageKey } from '../i18n/messages';

/**
 * Cấp độ JLPT của một từ trong khu Kanji.
 *
 * Chỉ tới N3 vì kho từ của ứng dụng dừng ở đó (giáo trình 皆の日本語 hết bài 50 là
 * N4, bộ động từ bài tập có thêm phần N3). Từ N2 trong `core/exercises` KHÔNG được
 * đưa vào đây — xem `scripts/generate-kanji.mjs`.
 */
export type KanjiLevel = 'N5' | 'N4' | 'N3';

export const KANJI_LEVELS: readonly KanjiLevel[] = ['N5', 'N4', 'N3'];

/** Thứ tự cấp độ, dùng để lấy cấp thấp nhất (tức là chỗ người học gặp bộ này sớm nhất). */
const LEVEL_RANK: Record<KanjiLevel, number> = { N5: 0, N4: 1, N3: 2 };

/** [kanji thuộc bộ, từ, cách đọc kana, âm Hán Việt của từ, nghĩa, cấp độ] */
export type WordSeed = readonly [
  kanji: string,
  japanese: string,
  reading: string,
  hanViet: string,
  meaning: string,
  level: KanjiLevel,
];

/** [bộ thủ, các dạng biến thể, âm Hán Việt, nghĩa, số nét, các từ minh hoạ] */
export type RadicalSeed = readonly [
  glyph: string,
  variants: string,
  hanViet: string,
  meaning: string,
  strokes: number,
  words: readonly WordSeed[],
];

/** Một từ minh hoạ cho bộ thủ. */
export interface RadicalWord {
  /**
   * Duy nhất trong phạm vi MỘT bộ thủ — đủ dùng vì dấu ★ lưu theo từng bộ.
   * Gồm cả cách đọc vì có từ viết giống nhau mà đọc khác (降ります ふり/おり).
   */
  id: string;
  /** Chữ trong từ mang bộ thủ này, ví dụ 休 của từ 休みます. */
  kanji: string;
  japanese: string;
  reading: string;
  /** Âm Hán Việt của cả từ. Rỗng với từ tới từ bộ động từ bài tập (nguồn không có cột này). */
  hanViet: string;
  meaning: string;
  level: KanjiLevel;
}

/** Một chữ Hán thuộc bộ thủ, kèm các từ dùng chữ đó. */
export interface RadicalKanji {
  char: string;
  words: RadicalWord[];
}

export interface Radical {
  /**
   * Đoạn cuối đường dẫn `/kanji/<id>`, cũng là khoá lưu danh sách ★ của bộ này.
   * Ghép âm Hán Việt (đọc được khi soi localStorage) với mã Unicode của chữ (để
   * hai bộ trùng âm như 人 và 儿 không đụng nhau). KHÔNG đổi tuỳ tiện: đổi là mất ★.
   */
  id: string;
  glyph: string;
  /** Các dạng biến thể khi bộ đứng trong chữ (亻 của 人). Rỗng nếu bộ không đổi dạng. */
  variants: string[];
  hanViet: string;
  meaning: string;
  strokes: number;
  /** Cấp thấp nhất trong các từ của bộ — tức là người học gặp bộ này từ cấp nào. */
  level: KanjiLevel;
  kanjiList: RadicalKanji[];
  /** Toàn bộ từ của bộ, phẳng, giữ đúng thứ tự nhóm theo chữ. */
  words: RadicalWord[];
}

/**
 * Bốn chiều hỏi của khu Kanji.
 *
 * `radical-hanviet` hỏi trên BỘ THỦ nên chỉ có ở màn hình danh sách; ba chiều còn
 * lại hỏi trên TỪ nên chỉ có ở màn hình một bộ.
 */
export type KanjiMode = 'radical-hanviet' | 'word-meaning' | 'word-reading' | 'word-mixed';

export interface KanjiModeInfo {
  id: KanjiMode;
  labelKey: MessageKey;
  shortKey: MessageKey;
  exampleKey: MessageKey;
}

/** Chiều hỏi của màn hình một bộ thủ (hỏi trên từ). */
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

export const RADICAL_MODE: KanjiModeInfo = {
  id: 'radical-hanviet',
  labelKey: 'kanji.mode.radicalHanViet',
  shortKey: 'kanji.mode.radicalHanViet.short',
  exampleKey: 'kanji.mode.radicalHanViet.example',
};

const ALL_MODES: readonly KanjiModeInfo[] = [RADICAL_MODE, ...KANJI_WORD_MODES];

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
 * Id "bài học" của phiên luyện âm Hán Việt bộ thủ.
 *
 * Phiên này không thuộc bộ thủ nào cả (nó hỏi trên CẢ danh sách), nên cần một id
 * riêng để lưu dấu ★ và để màn hình kết quả biết đường quay về `/kanji` chứ không
 * phải `/kanji/<id>`. Đổi chuỗi này là mất ★ của phần luyện bộ thủ.
 */
export const RADICAL_SESSION_ID = 'bo-thu';

/** Dựng danh sách bộ thủ đầy đủ từ dữ liệu nén mà script sinh ra. */
export function buildRadicals(seeds: readonly RadicalSeed[]): Radical[] {
  return seeds.map(([glyph, variants, hanViet, meaning, strokes, words]) => {
    const list: RadicalWord[] = words.map(([kanji, japanese, reading, wordHanViet, wordMeaning, level]) => ({
      id: `${japanese}|${reading}`,
      kanji,
      japanese,
      reading,
      hanViet: wordHanViet,
      meaning: wordMeaning,
      level,
    }));

    // Nhóm theo chữ, giữ nguyên thứ tự chữ xuất hiện lần đầu trong danh sách từ.
    const groups = new Map<string, RadicalWord[]>();
    for (const word of list) {
      const bucket = groups.get(word.kanji);
      if (bucket) bucket.push(word);
      else groups.set(word.kanji, [word]);
    }

    return {
      id: radicalId(glyph, hanViet),
      glyph,
      variants: [...variants],
      hanViet,
      meaning,
      strokes,
      level: lowestLevel(list),
      kanjiList: [...groups].map(([char, items]) => ({ char, words: items })),
      words: list,
    };
  });
}

function lowestLevel(words: readonly RadicalWord[]): KanjiLevel {
  let level: KanjiLevel = 'N3';
  for (const word of words) {
    if (LEVEL_RANK[word.level] < LEVEL_RANK[level]) level = word.level;
  }
  return level;
}

/**
 * "nhan-4eba" — âm Hán Việt bỏ dấu, ghép mã Unicode của chữ.
 *
 * Cần cả hai nửa: chỉ âm Hán Việt thì 人 và 儿 (đều NHÂN) đụng nhau, mà chỉ mã
 * Unicode thì nhìn vào localStorage không biết đó là bộ nào.
 */
function radicalId(glyph: string, hanViet: string): string {
  return `${slug(hanViet)}-${glyph.codePointAt(0)!.toString(16)}`;
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
