/**
 * Danh sách bộ thủ đã dựng xong, sẵn sàng cho màn hình dùng.
 *
 * Tách khỏi `radical-words.ts` (file do máy sinh) để phần logic dựng dữ liệu không
 * bị ghi đè mỗi lần chạy lại script sinh.
 */

import { Radical, buildRadicals } from './kanji.model';
import { RADICAL_SEEDS } from './radical-words';

export const RADICALS: readonly Radical[] = buildRadicals(RADICAL_SEEDS);

const BY_ID = new Map(RADICALS.map((radical) => [radical.id, radical]));

export function radicalById(id: string): Radical | null {
  return BY_ID.get(id) ?? null;
}
