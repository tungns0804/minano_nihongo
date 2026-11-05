/**
 * Danh sách chữ Hán đã dựng xong, sẵn sàng cho màn hình dùng.
 *
 * Tách khỏi `kanji-words.generated.ts` (file do máy sinh) để phần logic dựng dữ liệu không
 * bị ghi đè mỗi lần chạy lại script sinh.
 */

import { KanjiEntry, buildKanjiEntries } from './kanji.model';
import { KANJI_SEEDS } from './kanji-words.generated';

export const KANJI_ENTRIES: readonly KanjiEntry[] = buildKanjiEntries(KANJI_SEEDS);

const BY_ID = new Map(KANJI_ENTRIES.map((entry) => [entry.id, entry]));
const BY_CHAR = new Map(KANJI_ENTRIES.map((entry) => [entry.char, entry]));

export function kanjiById(id: string): KanjiEntry | null {
  return BY_ID.get(id) ?? null;
}

/** Chữ có trong khu Kanji không — tra theo chính mặt chữ, ví dụ khi đọc một từ. */
export function kanjiByChar(char: string): KanjiEntry | null {
  return BY_CHAR.get(char) ?? null;
}

/**
 * Các chữ của khu Kanji có mặt trong một dãy từ, theo thứ tự gặp lần đầu.
 *
 * Giữ thứ tự của bài chứ không xếp theo cấp: đi từ bài sang thì "chữ sau" phải là
 * chữ của từ kế tiếp trong bảng, đúng nhịp người học vừa đọc.
 */
export function kanjiInTexts(texts: readonly string[]): KanjiEntry[] {
  const found = new Map<string, KanjiEntry>();
  for (const text of texts) {
    for (const char of text) {
      if (found.has(char)) continue;
      const entry = BY_CHAR.get(char);
      if (entry) found.set(char, entry);
    }
  }
  return [...found.values()];
}
