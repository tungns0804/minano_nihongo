/**
 * Chia một câu tiếng Nhật thành các MẢNH để người học sắp xếp lại (bài "Sắp xếp câu").
 *
 * Không có bộ tách từ: kéo cả một từ điển hình thái vào gói chỉ để cắt ba trăm câu ví
 * dụ là quá tay. Câu được cắt bằng vài quy tắc đủ cho câu ví dụ trình độ N4:
 *
 *  - khoảng trắng là ranh giới — tài liệu viết câu toàn kana thường cách theo cụm;
 *  - 、 và 」 đóng mảnh đang dở, 「 mở mảnh mới;
 *  - trợ từ đứng sau một chữ Hán / katakana / chữ Latin thì đóng mảnh (日本語が / 東京へ);
 *    を thì luôn đóng mảnh, vì nó không bao giờ là một phần của từ;
 *  - の danh từ hoá đi cùng trợ từ (のは / のが / のを / のに / ので) cũng đóng mảnh.
 *
 * Mảnh viết theo cú pháp câu mẫu (`{漢字|かな}`), nên vẽ được furigana; chỗ [a/b] lấy
 * lựa chọn đầu. Câu ghép lại từ các mảnh vì thế luôn khớp câu mẫu gốc — `npm run
 * verify:n4` kiểm điều đó cho từng câu.
 */

import { parseMarkup } from './markup';
import type { MarkupNode } from './markup';

/** Ít hơn bấy nhiêu mảnh thì sắp xếp chỉ còn là đoán. */
export const MIN_CHUNKS = 3;

/**
 * Nhiều hơn bấy nhiêu mảnh thì gộp bớt: câu dài cắt ra mười mảnh là bài đố kiên nhẫn,
 * không còn là bài ngữ pháp.
 */
export const MAX_CHUNKS = 7;

type UnitKind = 'content' | 'kana' | 'space' | 'break' | 'open' | 'end';

interface Unit {
  /** Đoạn markup của đơn vị — chữ Hán giữ nguyên `{漢字|かな}`. */
  markup: string;
  /** Chữ hiển thị, để đo độ dài và nhận ra trợ từ. */
  text: string;
  kind: UnitKind;
}

const HIRAGANA = /^[ぁ-ゟ]$/;

/**
 * Trợ từ đóng mảnh. Dài trước, ngắn sau: 「には」 phải thắng 「に」.
 *
 * Đứng sau kana thì trợ từ chỉ đóng mảnh khi ngay sau nó là chữ Hán / katakana
 * (かぞくと｜映画を, すぐに｜返事が). Thiếu điều kiện đó thì đuôi của từ viết bằng kana
 * cũng bị cắt — 「いつも」 thành 「いつ｜も」.
 */
const PARTICLES = [
  'までに', 'からは', 'からも', 'までは', 'には', 'では', 'とは', 'へは', 'にも', 'でも', 'とも',
  'から', 'まで', 'より', 'は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も',
];

/**
 * Danh từ hoá + trợ từ: đóng mảnh dù đứng sau kana và trước kana (おぼえるのは |
 * たいへんです, 話すことが | できます).
 */
const NOMINALIZERS = ['のは', 'のが', 'のを', 'のに', 'ので', 'ことが', 'ことは', 'ことを', 'ことに', 'ことも'];

/**
 * Kana đứng ngay sau cho thấy "trợ từ" thật ra là đuôi của từ: 下がります (が + り),
 * 頑張れば (が + ん), 勉強できます (で + き), 教師ですから (で + す), 落として (と + し),
 * 彼にはじめて (に + はじめて — không phải には).
 */
const NOT_A_PARTICLE: Readonly<Record<string, RegExp>> = {
  が: /^[りるられっろん]/,
  で: /^[きけすし]/,
  と: /^[しすせさ]/,
  には: /^じめ/,
};

function kindOfChar(ch: string): UnitKind {
  if (/\s/.test(ch) || ch === '　') return 'space';
  if (ch === '、' || ch === '，' || ch === '」' || ch === '』') return 'break';
  if (ch === '「' || ch === '『') return 'open';
  if (ch === '。' || ch === '！' || ch === '？' || ch === '!' || ch === '?') return 'end';
  return HIRAGANA.test(ch) ? 'kana' : 'content';
}

/** Trải câu thành từng đơn vị: một chữ Hán kèm cách đọc, hoặc một ký tự. */
function unitsOf(nodes: readonly MarkupNode[]): Unit[] {
  const out: Unit[] = [];
  for (const node of nodes) {
    if (node.kind === 'ruby') {
      out.push({ markup: `{${node.base}|${node.reading}}`, text: node.base, kind: 'content' });
    } else if (node.kind === 'text') {
      for (const ch of node.text) out.push({ markup: ch, text: ch, kind: kindOfChar(ch) });
    } else {
      out.push(...unitsOf(node.options[0] ?? []));
    }
  }
  return out;
}

/** Chuỗi kana bắt đầu từ vị trí `at` (dừng ở đơn vị đầu tiên không phải kana). */
function kanaFrom(units: readonly Unit[], at: number): string {
  let out = '';
  for (let i = at; i < units.length && units[i].kind === 'kana'; i++) out += units[i].text;
  return out;
}

/**
 * Trợ từ đóng mảnh bắt đầu ở `at`, trả về số đơn vị nó chiếm; 0 nếu không có.
 * `afterContent`: đơn vị ngay trước là chữ Hán / katakana / chữ Latin.
 */
function particleAt(units: readonly Unit[], at: number, afterContent: boolean): number {
  const kana = kanaFrom(units, at);
  for (const particle of [...NOMINALIZERS, ...PARTICLES]) {
    if (!kana.startsWith(particle)) continue;
    const guard = NOT_A_PARTICLE[particle];
    if (guard && guard.test(kana.slice(particle.length))) continue;
    const always = particle === 'を' || NOMINALIZERS.includes(particle);
    if (always || afterContent || units[at + particle.length]?.kind === 'content') return particle.length;
  }
  return 0;
}

function plainLength(chunk: readonly Unit[]): number {
  return chunk.reduce((sum, unit) => sum + unit.text.length, 0);
}

/**
 * Các mảnh của câu, theo đúng thứ tự trong câu; mảng rỗng nếu câu quá ngắn để sắp xếp
 * (dưới `MIN_CHUNKS` mảnh). Dấu kết câu ở cuối bị bỏ: để lại thì nó chỉ thẳng mảnh cuối.
 */
export function chunksOf(source: string): string[] {
  const units = unitsOf(parseMarkup(source));
  while (units.length > 0 && (units[units.length - 1].kind === 'end' || units[units.length - 1].kind === 'space')) {
    units.pop();
  }

  const chunks: Unit[][] = [];
  let current: Unit[] = [];
  const flush = () => {
    if (current.length > 0) chunks.push(current);
    current = [];
  };

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];
    if (unit.kind === 'space') {
      flush();
      continue;
    }
    if (unit.kind === 'open') flush();

    if (unit.kind === 'kana' && current.length > 0) {
      const previous = current[current.length - 1];
      const length = particleAt(units, i, previous.kind === 'content');
      if (length > 0) {
        current.push(...units.slice(i, i + length));
        i += length - 1;
        // Dấu phẩy hay ngoặc đóng ngay sau trợ từ thuộc về mảnh này luôn.
        while (i + 1 < units.length && units[i + 1].kind === 'break') current.push(units[++i]);
        flush();
        continue;
      }
    }

    current.push(unit);
    if (unit.kind === 'break' || unit.kind === 'end') flush();
  }
  flush();

  // Mảnh một chữ (よ, ね, 今…) gộp vào mảnh đứng trước: bày riêng nó ra chỉ thêm nhiễu.
  for (let i = chunks.length - 1; i > 0; i--) {
    if (plainLength(chunks[i]) <= 1) {
      chunks[i - 1] = [...chunks[i - 1], ...chunks[i]];
      chunks.splice(i, 1);
    }
  }
  if (chunks.length > 1 && plainLength(chunks[0]) <= 1) chunks.splice(0, 2, [...chunks[0], ...chunks[1]]);

  // Quá nhiều mảnh: gộp dần cặp liền nhau ngắn nhất.
  while (chunks.length > MAX_CHUNKS) {
    let best = 0;
    for (let i = 1; i < chunks.length - 1; i++) {
      if (plainLength(chunks[i]) + plainLength(chunks[i + 1]) < plainLength(chunks[best]) + plainLength(chunks[best + 1])) {
        best = i;
      }
    }
    chunks.splice(best, 2, [...chunks[best], ...chunks[best + 1]]);
  }

  if (chunks.length < MIN_CHUNKS) return [];
  return chunks.map((chunk) => chunk.map((unit) => unit.markup).join(''));
}
