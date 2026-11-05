/**
 * Cấu tạo của một chữ Hán: nó ghép từ những thành phần nào, mỗi thành phần lại
 * ghép từ gì, và ngược lại những chữ nào ghép từ nó.
 *
 * Dữ liệu là bảng chiết tự sẵn có của khu Bộ thủ, đọc qua bản gọn
 * `kanji-parts.generated.ts` — không có cách tách nào được viết riêng ở đây, nên
 * cây ở màn hình một chữ và bảng ở màn hình một bộ không bao giờ nói khác nhau.
 */

import { KANJI_PART_ROWS, PART_INFO } from '../radical/kanji-parts.generated';
import { radicalId } from '../radical/radical.model';
import { kanjiByChar } from './kanji-entries';
import type { KanjiEntry } from './kanji.model';

/**
 * Một thành phần là gì, quyết định nó dẫn đi đâu và tô màu nào.
 *
 *  - kanji   : chữ có trang riêng trong khu Kanji (日, 寺, 然)
 *  - radical : bộ thủ hoặc dạng viết khác của bộ (氵, 亻, 辶) — dẫn sang khu Bộ thủ
 *  - other   : mảnh không thuộc bộ nào (乂, 云) — chỉ có âm, không có trang
 */
export type PartKind = 'kanji' | 'radical' | 'other';

export interface PartNode {
  char: string;
  /** Rỗng khi cả ba bảng đều không có âm của mảnh này. */
  hanViet: string;
  kind: PartKind;
  /** Lệnh dẫn đường cho `routerLink`; null khi mảnh không có trang nào. */
  link: readonly string[] | null;
  children: PartNode[];
}

/**
 * Số tầng khai triển dưới chữ gốc.
 *
 * Ba tầng là đủ đi từ chữ tới bộ thủ ở gần như mọi chữ (働 → 動 → 重 → …). Sâu hơn
 * thì cây chỉ toàn nét đơn 一 丨 丿, rộng quá khổ màn hình mà không giúp nhớ gì.
 */
const MAX_DEPTH = 3;

/** Các thành phần tầng ngoài cùng; rỗng với chữ độc thể. */
export function partsOf(char: string): string[] {
  const row = KANJI_PART_ROWS[char];
  return row ? row.split('+') : [];
}

/**
 * Bộ thủ của một hình, có tính vị trí cho 阝.
 *
 * 阝 là MỘT hình nhưng HAI bộ: đứng đầu dòng chiết tự là 阜 (こざとへん), đứng sau là
 * 邑 (おおざと) — đúng luật `radicalOfPart` của `generate-radicals.mjs`.
 */
function radicalInfo(part: string, index: number): readonly [string, string] | null {
  const form = part === '阝' ? (index === 0 ? '阜' : '邑') : part;
  const info = PART_INFO[form];
  return info && info[0] ? info : null;
}

/**
 * Mô tả một thành phần, chưa có tầng con.
 *
 * Chữ có trang trong khu Kanji thì dẫn sang trang chữ, kể cả khi nó cũng là bộ thủ
 * (日, 木): trang chữ có cả cây cấu tạo lẫn các chữ ghép từ nó, và tự dẫn tiếp sang
 * trang bộ. Âm lấy đúng thứ tự `partHanViet` của script sinh: bộ thủ trước, rồi
 * chữ, rồi âm bù — để chuỗi "NHÂN MỘC" ở đây khớp chiều luyện chiết tự.
 */
function describe(part: string, index: number): Omit<PartNode, 'children'> {
  const kanji = kanjiByChar(part);
  const radical = radicalInfo(part, index);
  const hanViet = radical?.[1] || kanji?.hanViet || PART_INFO[part]?.[1] || '';

  if (kanji) return { char: part, hanViet, kind: 'kanji', link: ['/kanji', kanji.id] };
  if (radical) {
    return { char: part, hanViet, kind: 'radical', link: ['/radical', radicalId(radical[0], radical[1])] };
  }
  return { char: part, hanViet, kind: 'other', link: null };
}

function expand(parts: readonly string[], depth: number, path: ReadonlySet<string>): PartNode[] {
  return parts.map((part, index) => {
    // `path` chặn vòng lặp khi một dòng chiết tự viết sai thành tự chứa chính nó.
    const deeper = depth < MAX_DEPTH && !path.has(part) ? partsOf(part) : [];
    return {
      ...describe(part, index),
      children: deeper.length > 0 ? expand(deeper, depth + 1, new Set([...path, part])) : [],
    };
  });
}

/** Các thành phần tầng ngoài cùng của chữ, kèm âm và đường dẫn — dòng "Cấu tạo" ở đầu trang. */
export function directParts(char: string): Omit<PartNode, 'children'>[] {
  return partsOf(char).map((part, index) => describe(part, index));
}

/** Cây cấu tạo, gốc là chính chữ đó. null với chữ độc thể. */
export function compositionTree(entry: KanjiEntry): PartNode | null {
  const parts = partsOf(entry.char);
  if (parts.length === 0) return null;
  return {
    char: entry.char,
    hanViet: entry.hanViet,
    kind: 'kanji',
    link: null,
    children: expand(parts, 1, new Set([entry.char])),
  };
}

/** Bộ thủ mà chính chữ này là — 手 là bộ 手, 日 là bộ 日. null nếu không phải bộ nào. */
export function ownRadical(char: string): { char: string; hanViet: string; link: readonly string[] } | null {
  const info = radicalInfo(char, 0);
  if (!info) return null;
  return { char: info[0], hanViet: info[1], link: ['/radical', radicalId(info[0], info[1])] };
}

/** Hình -> các chữ ghép trực tiếp từ nó. Dựng một lần, lúc lần đầu có người hỏi. */
let users: Map<string, string[]> | null = null;

/**
 * Các chữ của khu Kanji ghép TRỰC TIẾP từ chữ này, theo thứ tự dạy.
 *
 * Chỉ tầng ngoài cùng: 時 = 日 + 寺 thì 時 nằm ở danh sách của 寺, không nằm ở
 * danh sách của 寸 — muốn đi sâu thì bấm sang 寺. Đi hết cây là việc của trang bộ
 * thủ, nơi 寸 gom được cả 時 kèm dòng giải thích "寺=土+寸".
 */
export function kanjiUsing(char: string): KanjiEntry[] {
  if (!users) {
    users = new Map();
    for (const [owner, row] of Object.entries(KANJI_PART_ROWS)) {
      for (const part of new Set(row.split('+'))) {
        const list = users.get(part);
        if (list) list.push(owner);
        else users.set(part, [owner]);
      }
    }
  }
  return (users.get(char) ?? [])
    .map((owner) => kanjiByChar(owner))
    .filter((entry): entry is KanjiEntry => entry !== null);
}
