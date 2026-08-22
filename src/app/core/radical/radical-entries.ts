/**
 * Danh sách bộ thủ đã dựng xong, sẵn sàng cho màn hình dùng.
 *
 * Tách khỏi `radical-kanji.ts` (file do máy sinh) để phần logic dựng dữ liệu
 * không bị ghi đè mỗi lần chạy lại script sinh.
 */

import { RadicalEntry, buildRadicalEntries } from './radical.model';
import { RADICAL_SEEDS } from './radical-kanji';

export const RADICAL_ENTRIES: readonly RadicalEntry[] = buildRadicalEntries(RADICAL_SEEDS);

const BY_ID = new Map(RADICAL_ENTRIES.map((entry) => [entry.id, entry]));

export function radicalById(id: string): RadicalEntry | null {
  return BY_ID.get(id) ?? null;
}
