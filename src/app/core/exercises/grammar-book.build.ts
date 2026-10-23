/**
 * Dựng dữ liệu của một "sách ngữ pháp" từ dạng viết tay / sinh tự động sang kiểu dùng
 * lúc chạy (`n4-grammar.model.ts`): bóc dấu 《chỗ trống》, băm id câu, cắt mảnh câu.
 *
 * Dùng chung cho mọi sách (`grammar-books.ts`): tài liệu "TỔNG HỢP NGỮ PHÁP N4" viết
 * tay ở `n4-grammar.ts`, và bộ vnjpclub sinh bằng `scripts/import-vnjpclub.mjs`.
 */

import type { GrammarTable } from '../lessons/vocabulary.model';
import { hashId } from '../lessons/vocabulary-parser';
import { chunksOf } from '../translation/chunks';
import { plainText } from '../translation/markup';
import { BLANK_MARK } from './n4-grammar.model';
import type {
  N4Blank,
  N4Example,
  N4Point,
  N4Quiz,
  N4Section,
  N4Usage,
} from './n4-grammar.model';

/** Cách nói tương đương được chấp nhận khi chấm, xem `N4Example.japaneseAlt`. */
export interface Alt {
  ja?: readonly string[];
  vi?: readonly string[];
}

/** [câu tiếng Nhật, bản dịch, lời giải thích, cách nói tương đương] */
export type RawExample = readonly [japanese: string, vietnamese: string, note?: string, alt?: Alt];

export interface RawUsage {
  title?: string;
  detail?: string;
  reference?: true;
  examples: readonly RawExample[];
}

export interface RawPoint {
  id: string;
  pattern: string;
  meaning?: string;
  group?: string;
  structures?: readonly string[];
  explanation?: readonly string[];
  tables?: readonly GrammarTable[];
  notes?: readonly string[];
  /** [câu sai, vì sao sai / nói thế nào mới đúng] */
  wrong?: readonly (readonly [japanese: string, note: string])[];
  /** Viết tắt cho một nhóm "Ví dụ" không tên đứng TRƯỚC `usages`. */
  examples?: readonly RawExample[];
  usages?: readonly RawUsage[];
}

/** [câu hỏi, các lựa chọn, đáp án, chú thích] */
export type RawQuizItem = readonly [prompt: string, options: readonly string[], answer: string, note?: string];

export interface RawSection {
  id: string;
  title: string;
  intro?: readonly string[];
  points: readonly RawPoint[];
  quiz?: { instruction: string; items: readonly RawQuizItem[] };
  /** Trang gốc của mục, nếu nội dung chỉ là phần tóm lược của một trang web. */
  source?: string;
}

export function table(caption: string, headers: string[], rows: string[][]): GrammarTable {
  return { caption, headers, rows };
}


/** 《phần ngữ pháp》 hoặc 《phần ngữ pháp@id-mẫu》 — xem đầu `n4-grammar.model.ts`. */
const BLANK = /《([^《》@]*)(?:@([a-z0-9-]+))?》/g;

/**
 * Bóc dấu 《…》 khỏi câu, giữ lại chỗ trống. `pointId` là mẫu chứa câu, dùng khi chỗ
 * trống không ghi @id-mẫu. `npm run verify:n4` kiểm mẫu đích có tồn tại và có ý nghĩa.
 */
function blankOf(source: string, pointId: string): N4Blank | null {
  const marks = [...source.matchAll(BLANK)];
  if (marks.length === 0) return null;
  return {
    pointId: marks.find((mark) => mark[2])?.[2] ?? pointId,
    prompt: source.replace(BLANK, BLANK_MARK),
    filled: marks.map((mark) => plainText(mark[1])).join(' … '),
  };
}

function toExample([source, vietnamese, note, alt]: RawExample, pointId: string): N4Example {
  const japanese = source.replace(BLANK, '$1');
  return {
    id: hashId(plainText(japanese)),
    japanese,
    vietnamese,
    note: note ?? '',
    japaneseAlt: [...(alt?.ja ?? [])],
    vietnameseAlt: [...(alt?.vi ?? [])],
    blank: blankOf(source, pointId),
    chunks: chunksOf(japanese),
  };
}

function toUsage(raw: RawUsage, pointId: string): N4Usage {
  return {
    title: raw.title ?? '',
    detail: raw.detail ?? '',
    reference: raw.reference === true,
    examples: raw.examples.map((example) => toExample(example, pointId)),
  };
}

function toPoint(raw: RawPoint): N4Point {
  const usages = [
    ...(raw.examples ? [toUsage({ examples: raw.examples }, raw.id)] : []),
    ...(raw.usages ?? []).map((usage) => toUsage(usage, raw.id)),
  ];
  return {
    id: raw.id,
    pattern: raw.pattern,
    meaning: raw.meaning ?? '',
    group: raw.group ?? '',
    structures: [...(raw.structures ?? [])],
    explanation: [...(raw.explanation ?? [])],
    tables: [...(raw.tables ?? [])],
    notes: [...(raw.notes ?? [])],
    wrong: (raw.wrong ?? []).map(([japanese, note]) => ({ japanese, note })),
    usages,
  };
}

function toQuiz(raw: RawSection['quiz']): N4Quiz | null {
  if (!raw) return null;
  return {
    instruction: raw.instruction,
    items: raw.items.map(([prompt, options, answer, note]) => ({
      id: hashId(plainText(prompt)),
      prompt,
      options: [...options],
      answer,
      note: note ?? '',
    })),
  };
}

export function buildSections(raw: readonly RawSection[]): N4Section[] {
  return raw.map((section, index) => ({
    id: section.id,
    number: index + 1,
    title: section.title,
    intro: [...(section.intro ?? [])],
    points: section.points.map(toPoint),
    quiz: toQuiz(section.quiz),
    source: section.source ?? '',
  }));
}
