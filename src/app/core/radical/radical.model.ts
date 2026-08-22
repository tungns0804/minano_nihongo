/**
 * Khu "Bộ thủ" — 214 bộ thủ Khang Hy, mỗi bộ kèm các chữ Hán ghép từ bộ đó.
 *
 * Vì sao là một tab riêng chứ không nằm trong khu Kanji: khu Kanji đi từ CHỮ ra
 * TỪ (chữ 海 → 海外, 海岸), còn khu này đi từ MẢNH ra CHỮ (bộ 氵 → 海, 泳, 湯).
 * Cùng một kho chữ nhưng hai chiều học ngược nhau, mà chiều nào cũng cần một
 * lưới tra riêng.
 *
 * Dữ liệu đi qua ba file:
 *  - `radical-list.ts`  — 214 bộ thủ viết tay (chữ, biến thể, âm Hán Việt, nghĩa,
 *                         tên tiếng Nhật), xếp theo số nét.
 *  - `radical-parts.ts` — chiết tự viết tay: mỗi chữ Hán gồm những bộ nào.
 *  - `radical-kanji.ts` — do `npm run generate:radicals` sinh ra: ghép hai file
 *                         trên với âm Hán Việt / cấp độ / từ ví dụ của khu Kanji.
 *
 * Hai màn hình dùng dữ liệu này:
 *  - `/radical`      lưới bộ thủ theo số nét + luyện "bộ thủ → âm Hán Việt".
 *  - `/radical/:id`  một bộ + các chữ ghép từ bộ đó, luyện trên các chữ ấy.
 */

import type { MessageKey } from '../i18n/messages';
import type { KanjiLevel } from '../kanji/kanji.model';

/** [từ tiếng Nhật, cách đọc kana, nghĩa] */
export type RadicalWordSeed = readonly [japanese: string, reading: string, meaning: string];

/** [chữ, âm Hán Việt, chiết tự, âm Hán Việt của chiết tự, bộ nằm trong, cấp độ, từ ví dụ] */
export type RadicalKanjiSeed = readonly [
  char: string,
  hanViet: string,
  parts: string,
  partsHanViet: string,
  via: string,
  level: KanjiLevel,
  words: readonly RadicalWordSeed[],
];

/** [bộ thủ, biến thể, âm Hán Việt, nghĩa, tên tiếng Nhật, số nét, các chữ ghép] */
export type RadicalSeed = readonly [
  char: string,
  variants: string,
  hanViet: string,
  meaning: string,
  japanese: string,
  strokes: number,
  kanji: readonly RadicalKanjiSeed[],
];

/** Một chữ Hán ghép từ bộ thủ đang xem. */
export interface RadicalKanji {
  /** Duy nhất trong phạm vi MỘT bộ — đủ dùng vì dấu ★ lưu theo từng bộ. */
  id: string;
  char: string;
  hanViet: string;
  /** Các bộ tạo thành chữ, ví dụ ['亻', '木'] của chữ 休. */
  parts: string[];
  /** Âm Hán Việt của từng bộ ghép lại ("NHÂN MỘC"). Rỗng khi thiếu âm của một bộ. */
  partsHanViet: string;
  /**
   * Bộ đang xem nằm trong thành phần nào, dạng "寺=土+寸". Rỗng khi bộ lộ ra ngay
   * ở tầng ngoài cùng — khi đó bảng không cần giải thích gì thêm.
   */
  via: string;
  level: KanjiLevel;
  words: { japanese: string; reading: string; meaning: string }[];
}

export interface RadicalEntry {
  /**
   * Đoạn cuối đường dẫn `/radical/<id>`, cũng là khoá lưu danh sách ★ của bộ này.
   * Ghép âm Hán Việt bỏ dấu với mã Unicode của bộ — hai bộ trùng âm (人 và 儿 đều
   * NHÂN) vẫn tách nhau được. KHÔNG đổi tuỳ tiện: đổi là mất ★.
   */
  id: string;
  char: string;
  /** Dạng viết khác của chính bộ đó khi nằm trong chữ: 亻 của 人, 氵 của 水. */
  variants: string[];
  hanViet: string;
  meaning: string;
  /** Tên gọi tiếng Nhật của bộ, ví dụ にんべん. */
  japanese: string;
  strokes: number;
  kanji: RadicalKanji[];
}

/**
 * Nhóm số nét — tab của lưới bộ thủ.
 *
 * Gom lại thành 7 nhóm chứ không để 17 mức nét: từ 10 nét trở lên mỗi mức chỉ có
 * vài bộ, tách ra thì được cả một hàng tab gần như trống.
 */
export type StrokeGroup = '1-2' | '3' | '4' | '5' | '6' | '7-8' | '9+';

export const STROKE_GROUPS: readonly StrokeGroup[] = ['1-2', '3', '4', '5', '6', '7-8', '9+'];

export function strokeGroupOf(strokes: number): StrokeGroup {
  if (strokes <= 2) return '1-2';
  if (strokes <= 6) return String(strokes) as StrokeGroup;
  if (strokes <= 8) return '7-8';
  return '9+';
}

/**
 * Bốn chiều hỏi của khu Bộ thủ.
 *
 * `radical-hanviet` hỏi trên BỘ nên chỉ có ở màn hình danh sách; ba chiều còn
 * lại hỏi trên CHỮ ghép nên chỉ có ở màn hình một bộ.
 */
export type RadicalMode = 'radical-hanviet' | 'kanji-hanviet' | 'kanji-parts' | 'kanji-mixed';

export interface RadicalModeInfo {
  id: RadicalMode;
  labelKey: MessageKey;
  shortKey: MessageKey;
  exampleKey: MessageKey;
}

/** Chiều hỏi của màn hình một bộ (hỏi trên chữ ghép). */
export const RADICAL_KANJI_MODES: readonly RadicalModeInfo[] = [
  {
    id: 'kanji-hanviet',
    labelKey: 'radical.mode.kanjiHanViet',
    shortKey: 'radical.mode.kanjiHanViet.short',
    exampleKey: 'radical.mode.kanjiHanViet.example',
  },
  {
    id: 'kanji-parts',
    labelKey: 'radical.mode.kanjiParts',
    shortKey: 'radical.mode.kanjiParts.short',
    exampleKey: 'radical.mode.kanjiParts.example',
  },
  {
    id: 'kanji-mixed',
    labelKey: 'radical.mode.kanjiMixed',
    shortKey: 'radical.mode.kanjiMixed.short',
    exampleKey: 'radical.mode.kanjiMixed.example',
  },
];

export const RADICAL_HAN_VIET_MODE: RadicalModeInfo = {
  id: 'radical-hanviet',
  labelKey: 'radical.mode.radicalHanViet',
  shortKey: 'radical.mode.radicalHanViet.short',
  exampleKey: 'radical.mode.radicalHanViet.example',
};

const ALL_MODES: readonly RadicalModeInfo[] = [RADICAL_HAN_VIET_MODE, ...RADICAL_KANJI_MODES];

export function radicalModeInfo(id: RadicalMode): RadicalModeInfo {
  return ALL_MODES.find((mode) => mode.id === id) ?? ALL_MODES[0];
}

/**
 * Chữ dùng được cho chiều hỏi chiết tự.
 *
 * Chữ nào còn thành phần chưa tra ra âm Hán Việt thì `partsHanViet` rỗng — đem
 * hỏi chiết tự sẽ thành câu không có đáp án, nên phải lọc nó ra trước.
 */
export function usableForParts(kanji: RadicalKanji): boolean {
  return kanji.partsHanViet !== '';
}

/**
 * Số câu một tập chữ sẽ sinh ra ở chiều hỏi đang chọn.
 *
 * Đếm thật trên từng chữ chứ không nhân số chữ với một hệ số cố định: chiều "trộn"
 * sinh hai câu cho mỗi chữ (âm Hán Việt + chiết tự) nhưng chữ nào chưa đủ âm Hán
 * Việt của các bộ thì không có câu chiết tự. Nhân bừa thì dòng "sẽ luyện N câu" ở
 * màn thiết lập hứa nhiều hơn số câu thật sự hiện ra.
 */
export function radicalQuestionCount(
  kanjiList: readonly RadicalKanji[],
  mode: RadicalMode,
): number {
  if (mode === 'kanji-hanviet') return kanjiList.length;
  const withParts = kanjiList.filter(usableForParts).length;
  return mode === 'kanji-parts' ? withParts : kanjiList.length + withParts;
}

/**
 * Id "bài học" của phiên luyện âm Hán Việt của bộ thủ.
 *
 * Phiên này không thuộc bộ nào cả (nó hỏi trên CẢ danh sách), nên cần một id
 * riêng để lưu dấu ★ và để màn hình kết quả biết đường quay về `/radical`. Đổi
 * chuỗi này là mất ★ của phần luyện âm Hán Việt.
 */
export const RADICAL_SESSION_ID = 'bo-thu';

/** Dựng danh sách bộ thủ đầy đủ từ dữ liệu nén mà script sinh ra. */
export function buildRadicalEntries(seeds: readonly RadicalSeed[]): RadicalEntry[] {
  return seeds.map(([char, variants, hanViet, meaning, japanese, strokes, kanji]) => ({
    id: radicalId(char, hanViet),
    char,
    variants: variants ? variants.split('/') : [],
    hanViet,
    meaning,
    japanese,
    strokes,
    kanji: kanji.map(([kanjiChar, kanjiHanViet, parts, partsHanViet, via, level, words]) => ({
      id: kanjiChar,
      char: kanjiChar,
      hanViet: kanjiHanViet,
      parts: parts.split('+').filter(Boolean),
      partsHanViet,
      via,
      level,
      words: words.map(([japaneseWord, reading, wordMeaning]) => ({
        japanese: japaneseWord,
        reading,
        meaning: wordMeaning,
      })),
    })),
  }));
}

/** "nhan-4eba" — âm Hán Việt bỏ dấu ghép mã Unicode, cùng lối đặt id với khu Kanji. */
function radicalId(char: string, hanViet: string): string {
  const code = char.codePointAt(0)!.toString(16);
  const name = slug(hanViet);
  return name ? `${name}-${code}` : `r-${code}`;
}

function slug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
