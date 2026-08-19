/**
 * Danh sách chữ Hán đã dựng xong, sẵn sàng cho màn hình dùng.
 *
 * Tách khỏi `kanji-words.ts` (file do máy sinh) để phần logic dựng dữ liệu không
 * bị ghi đè mỗi lần chạy lại script sinh.
 */

import { KanjiEntry, buildKanjiEntries } from './kanji.model';
import { KANJI_SEEDS } from './kanji-words';

export const KANJI_ENTRIES: readonly KanjiEntry[] = buildKanjiEntries(KANJI_SEEDS);

const BY_ID = new Map(KANJI_ENTRIES.map((entry) => [entry.id, entry]));

export function kanjiById(id: string): KanjiEntry | null {
  return BY_ID.get(id) ?? null;
}
