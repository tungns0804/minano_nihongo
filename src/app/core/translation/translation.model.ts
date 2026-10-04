/**
 * Khu Luyện dịch: mỗi bài 皆の日本語 có vài "bài nhỏ", mỗi bài nhỏ khoảng 10 câu.
 *
 * Mỗi câu kèm danh sách mẫu ngữ pháp nó dùng — mẫu của chính bài đó và mẫu ôn lại của
 * các bài trước — cùng lời giải thích cho riêng câu ấy. Script sinh dữ liệu đã bắt
 * buộc ba điều trước khi một câu vào được app (xem `scripts/translation-core.mjs`):
 * mẫu phải có thật trong bài ngữ pháp, không được là mẫu của bài sau, và hai câu
 * trong cùng một bài không được trùng tổ hợp mẫu.
 */

/** Một mẫu ngữ pháp có mặt trong câu, kèm giải thích cho riêng câu đó. */
export interface TranslationGrammarNote {
  /** Id mẫu ngữ pháp — tra trong `Lesson.grammarRefs`. */
  point: string;
  note: string;
}

export interface TranslationLine {
  /** Băm từ câu tiếng Nhật dạng thường — khoá ★. */
  id: string;
  /** Câu tiếng Nhật viết theo cú pháp ở `markup.ts` (furigana, lựa chọn). */
  ja: string;
  /** Các cách nói khác cũng được chấm đúng, cùng cú pháp. */
  jaAlt: string[];
  vi: string;
  viAlt: string[];
  /** Người nói khi câu thuộc một đoạn hội thoại; rỗng với câu đứng riêng. */
  speaker: string;
  grammar: TranslationGrammarNote[];
}

/** Một bài nhỏ khoảng 10 câu, thường xoay quanh một tình huống. */
export interface TranslationSet {
  id: string;
  title: string;
  description: string;
  lines: TranslationLine[];
}

/** Mẫu ngữ pháp được câu nào đó tham chiếu tới, chép sẵn từ bài ngữ pháp lúc sinh dữ liệu. */
export interface GrammarRef {
  /** Bài dạy mẫu này. */
  lesson: number;
  /** Id bài ngữ pháp, để dẫn sang `/grammar/<id>`. */
  lessonId: string;
  title: string;
  /** Công thức đầu tiên của mẫu; rỗng nếu mẫu không có công thức. */
  structure: string;
}

/** Một câu đã gắn kèm bài nhỏ chứa nó và câu đứng ngay trước (để làm ngữ cảnh). */
export interface TranslationLineRef {
  line: TranslationLine;
  set: TranslationSet;
  previous: TranslationLine | null;
}

/** Trải phẳng mọi câu của các bài nhỏ đã chọn, giữ nguyên thứ tự trong bài. */
export function flattenTranslationLines(sets: readonly TranslationSet[]): TranslationLineRef[] {
  return sets.flatMap((set) =>
    set.lines.map((line, index) => ({ line, set, previous: set.lines[index - 1] ?? null })),
  );
}

/**
 * Ngữ cảnh của một câu: câu ngay trước nó, nhưng CHỈ khi cả hai cùng là lời thoại.
 *
 * Bài nhỏ gồm các câu đứng riêng thì câu trước không liên quan gì tới câu sau — hiện ra
 * chỉ làm người học tưởng phải dịch theo nó.
 */
export function contextOf(ref: TranslationLineRef): TranslationLine | null {
  return ref.previous && ref.previous.speaker && ref.line.speaker ? ref.previous : null;
}

// ── Làm sạch dữ liệu nạp từ JSON ─────────────────────────────────────────

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function textList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.length > 0)
    : [];
}

function sanitizeNotes(raw: unknown): TranslationGrammarNote[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): TranslationGrammarNote[] => {
    if (!item || typeof item !== 'object') return [];
    const { point, note } = item as Record<string, unknown>;
    return typeof point === 'string' && point ? [{ point, note: text(note) }] : [];
  });
}

/**
 * `seen` dùng chung cho cả bài (không riêng từng bài nhỏ) vì id là khoá ★ — hai câu
 * trùng id ở hai bài nhỏ thì bấm sao câu này sẽ sáng luôn câu kia.
 */
function sanitizeLines(raw: unknown, seen: Set<string>): TranslationLine[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): TranslationLine[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, ja, jaAlt, vi, viAlt, speaker, grammar } = item as Record<string, unknown>;
    if (typeof id !== 'string' || !id || seen.has(id)) return [];
    if (typeof ja !== 'string' || !ja || typeof vi !== 'string' || !vi) return [];
    seen.add(id);
    return [
      {
        id,
        ja,
        jaAlt: textList(jaAlt),
        vi,
        viAlt: textList(viAlt),
        speaker: text(speaker),
        grammar: sanitizeNotes(grammar),
      },
    ];
  });
}

export function sanitizeTranslationSets(raw: unknown): TranslationSet[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  return raw.flatMap((item, index): TranslationSet[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, title, description, lines } = item as Record<string, unknown>;
    const parsedLines = sanitizeLines(lines, seen);
    if (parsedLines.length === 0) return [];
    return [
      {
        id: typeof id === 'string' && id ? id : `s${index + 1}`,
        title: text(title) || `${index + 1}`,
        description: text(description),
        lines: parsedLines,
      },
    ];
  });
}

export function sanitizeGrammarRefs(raw: unknown): Record<string, GrammarRef> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<string, GrammarRef> = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const { lesson, lessonId, title, structure } = value as Record<string, unknown>;
    if (typeof lesson !== 'number' || typeof title !== 'string' || !title) continue;
    result[id] = { lesson, lessonId: text(lessonId), title, structure: text(structure) };
  }
  return result;
}
