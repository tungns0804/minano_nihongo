import type { VerbGroup } from '../japanese/conjugation';
import type { ConversationLine, VerbEntry, VocabularyWord } from '../models/vocabulary.model';

/**
 * Bản TypeScript của `scripts/vocab-core.mjs`.
 *
 * QUAN TRỌNG: hai file phải dùng CÙNG thuật toán, đặc biệt là `hashId` và
 * `normalizeField`, vì id từ vựng được sinh từ nội dung. Lệch nhau thì cùng một
 * bài học nạp qua giao diện sẽ có id khác với bản sinh bằng script, dẫn tới danh
 * sách Favorite không khớp. Sửa một bên thì phải sửa bên kia.
 */

/** Ký tự phân tách các cách nói/nghĩa thay thế nhau bên trong một ô. */
export const ALTERNATIVE_SEPARATOR = '/';

const BOM_CODE = 0xfeff;
const COMBINING_MARK_START = 0x0300;
const COMBINING_MARK_END = 0x036f;

export type IssueLevel = 'error' | 'warning';

/** Mã lỗi ổn định, để giao diện dịch được sang ngôn ngữ đang chọn. */
export type ParseIssueCode =
  | 'missing-columns-vocabulary'
  | 'missing-columns-verb'
  | 'empty-columns'
  | 'not-masu'
  | 'bad-group'
  | 'duplicate-word'
  | 'duplicate-verb'
  | 'bad-columns-conversation'
  | 'duplicate-sentence';

export interface ParseIssue {
  line: number;
  text: string;
  /**
   * Thông điệp tiếng Việt sẵn — script `npm run generate` in thẳng ra console.
   * Giao diện thì dùng `code` + `params` để hiện đúng ngôn ngữ đang chọn.
   */
  message: string;
  code: ParseIssueCode;
  params: Record<string, string>;
  level: IssueLevel;
}

export interface ParseResult {
  words: VocabularyWord[];
  issues: ParseIssue[];
}

/** Băm FNV-1a 32-bit -> chuỗi base36. Kết quả giống hệt bản Node. */
export function hashId(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0');
}

/** Chuẩn hoá một ô dữ liệu: NFC + gộp khoảng trắng + cắt hai đầu. */
export function normalizeField(value: string): string {
  return String(value).normalize('NFC').replace(/\s+/g, ' ').trim();
}

/** Bỏ dấu thanh/dấu phụ tiếng Việt (U+0300..U+036F sau khi tách NFD). */
export function stripDiacritics(value: string): string {
  const decomposed = String(value).normalize('NFD');
  let out = '';
  for (const ch of decomposed) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= COMBINING_MARK_START && code <= COMBINING_MARK_END) continue;
    out += ch;
  }
  return out.replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function stripBom(text: string): string {
  return text.length > 0 && text.charCodeAt(0) === BOM_CODE ? text.slice(1) : text;
}

/**
 * Tách một dòng thành tối đa 4 cột.
 * - Có TAB thì tách bằng TAB (tiện khi dán từ Excel/Google Sheet); cột 4 là câu ví dụ.
 * - Ngược lại dùng dấu phẩy nhưng CHỈ tách ở 2 dấu phẩy đầu tiên, phần còn lại thuộc
 *   về cột nghĩa — nhờ vậy nghĩa vẫn chứa được dấu phẩy. Câu ví dụ khi đó viết sau
 *   dấu | ngay trong cột nghĩa.
 */
export function splitRow(line: string): string[] {
  // Dán từ bảng tính: mỗi TAB là một cột, cột thứ 4 là câu ví dụ.
  if (line.includes('\t')) return line.split('\t').slice(0, 4);

  const first = line.indexOf(',');
  if (first < 0) return [line];
  const second = line.indexOf(',', first + 1);
  if (second < 0) return [line.slice(0, first), line.slice(first + 1)];
  return [line.slice(0, first), line.slice(first + 1, second), line.slice(second + 1)];
}

/**
 * Tách cột tiếng Nhật thành từ + cách đọc, với cách đọc nằm trong ngoặc ở CUỐI ô:
 *   "見ます (みます)"   -> ["見ます", "みます"]
 *   "新聞社（しんぶんしゃ）" -> ["新聞社", "しんぶんしゃ"]
 *   "席"                -> ["席", ""]
 *
 * Vì sao nhét vào chính cột tiếng Nhật thay vì thêm một cột nữa: cột nghĩa được
 * phép chứa dấu phẩy nên chỉ tách được ở 2 dấu phẩy đầu tiên (xem splitRow) —
 * thêm cột thứ tư ngăn bằng dấu phẩy là phá vỡ luật đó. Ngoặc ở cuối cột 2 thì
 * không đụng gì tới cách tách hiện có, và dòng không có ngoặc vẫn chạy như cũ.
 *
 * Nhận cả ngoặc nửa chiều () lẫn ngoặc toàn chiều （）vì bộ gõ tiếng Nhật cho ra
 * loại thứ hai. Yêu cầu có ít nhất một ký tự trước dấu ngoặc, để một ô chỉ gồm
 * ngoặc không bị hiểu thành từ rỗng.
 */
const READING_PATTERN = /^(.+?)\s*[(（]\s*([^()（）]+?)\s*[)）]$/;

export function splitJapaneseAndReading(text: string): [string, string] {
  const match = READING_PATTERN.exec(text);
  return match ? [match[1], match[2]] : [text, ''];
}

/**
 * Tách cột nghĩa thành nghĩa + câu ví dụ ở dấu | ĐẦU TIÊN.
 *
 * Dùng | chứ không thêm một dấu phẩy nữa là có chủ ý: cột nghĩa được phép chứa
 * dấu phẩy (đã ghi trong tài liệu và có test bảo vệ), nên nếu tách bằng dấu phẩy
 * thì mọi dòng có nghĩa kiểu "nghĩa a, nghĩa b" sẽ âm thầm bị cắt mất một nửa
 * và nửa đó biến thành câu ví dụ.
 */
export function splitMeaningAndExample(text: string): [string, string] {
  const pipe = text.indexOf('|');
  return pipe < 0 ? [text, ''] : [text.slice(0, pipe), text.slice(pipe + 1)];
}

/** Phân tích nội dung thô (dán tay hoặc đọc từ file) thành danh sách từ vựng. */
export function parseVocabulary(raw: string): ParseResult {
  const text = stripBom(String(raw ?? ''));
  const lines = text.split(/\r?\n/);

  const words: VocabularyWord[] = [];
  const issues: ParseIssue[] = [];
  const seenContent = new Set<string>();
  const usedIds = new Set<string>();

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) return;

    const columns = splitRow(line);
    if (columns.length < 3) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'missing-columns-vocabulary',
        params: {},
        message: 'Thiếu cột. Cần đủ 3 cột: ÂM HÁN VIỆT,TIẾNG NHẬT,NGHĨA TIẾNG VIỆT',
      });
      return;
    }

    const hanViet = normalizeField(columns[0]);
    // Cách đọc (nếu có) nằm trong ngoặc ở cuối cột tiếng Nhật.
    const [rawJapanese, rawReading] = splitJapaneseAndReading(normalizeField(columns[1]));
    const japanese = normalizeField(rawJapanese);
    const reading = normalizeField(rawReading);
    // Cột 4 (dán bằng TAB) được ưu tiên; không có thì lấy phần sau dấu | của cột nghĩa.
    const [rawMeaning, meaningExample] = splitMeaningAndExample(columns[2] ?? '');
    const vietnamese = normalizeField(rawMeaning);
    const example = normalizeField(columns[3] ?? meaningExample);

    const empty: string[] = [];
    const emptyCodes: string[] = [];
    if (!hanViet) { empty.push('âm Hán Việt'); emptyCodes.push('hanViet'); }
    if (!japanese) { empty.push('tiếng Nhật'); emptyCodes.push('japanese'); }
    if (!vietnamese) { empty.push('nghĩa tiếng Việt'); emptyCodes.push('vietnamese'); }
    if (empty.length > 0) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'empty-columns',
        params: { columns: emptyCodes.join(',') },
        message: `Cột rỗng: ${empty.join(', ')}`,
      });
      return;
    }

    const contentKey = `${japanese}|${hanViet}`;
    if (seenContent.has(contentKey)) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'warning',
        code: 'duplicate-word',
        params: {},
        message: 'Trùng với một từ đã có ở phía trên, dòng này bị bỏ qua',
      });
      return;
    }
    seenContent.add(contentKey);

    let id = hashId(contentKey);
    if (usedIds.has(id)) {
      let suffix = 2;
      while (usedIds.has(`${id}-${suffix}`)) suffix++;
      id = `${id}-${suffix}`;
    }
    usedIds.add(id);

    words.push({ id, hanViet, japanese, reading, vietnamese, example });
  });

  return { words, issues };
}

export interface VerbParseResult {
  verbs: VerbEntry[];
  issues: ParseIssue[];
}

/**
 * Tách dòng động từ thành 4 cột: ÂM HÁN VIỆT, THỂ MẬU, NGHĨA, NHÓM.
 *
 * Cột nghĩa nằm ở giữa nên gom tất cả phần giữa cột 2 và cột cuối — nhờ vậy nghĩa
 * vẫn chứa được dấu phẩy mà không phá vỡ cột nhóm ở cuối.
 */
export function splitVerbRow(line: string): string[] {
  const separator = line.includes('\t') ? '\t' : ',';
  const parts = line.split(separator);
  if (parts.length < 4) return parts;

  return [
    parts[0],
    parts[1],
    parts.slice(2, -1).join(separator),
    parts[parts.length - 1],
  ];
}

/** Phân tích nội dung thô thành danh sách động từ cho bài luyện chia. */
export function parseVerbList(raw: string): VerbParseResult {
  const text = stripBom(String(raw ?? ''));
  const lines = text.split(/\r?\n/);

  const verbs: VerbEntry[] = [];
  const issues: ParseIssue[] = [];
  const seenContent = new Set<string>();
  const usedIds = new Set<string>();

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) return;

    const columns = splitVerbRow(line);
    if (columns.length < 4) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'missing-columns-verb',
        params: {},
        message: 'Thiếu cột. Cần đủ 4 cột: ÂM HÁN VIỆT,THỂ MẬU,NGHĨA TIẾNG VIỆT,NHÓM',
      });
      return;
    }

    const hanViet = normalizeField(columns[0]);
    const masu = normalizeField(columns[1]);
    const vietnamese = normalizeField(columns[2]);
    const rawGroup = normalizeField(columns[3]);

    const empty: string[] = [];
    const emptyCodes: string[] = [];
    if (!hanViet) { empty.push('âm Hán Việt'); emptyCodes.push('hanViet'); }
    if (!masu) { empty.push('thể Mậu'); emptyCodes.push('masu'); }
    if (!vietnamese) { empty.push('nghĩa tiếng Việt'); emptyCodes.push('vietnamese'); }
    if (!rawGroup) { empty.push('nhóm'); emptyCodes.push('group'); }
    if (empty.length > 0) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'empty-columns',
        params: { columns: emptyCodes.join(',') },
        message: `Cột rỗng: ${empty.join(', ')}`,
      });
      return;
    }

    if (!masu.endsWith('ます')) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'not-masu',
        params: { value: masu },
        message: `Động từ phải ở thể ます, nhận được "${masu}"`,
      });
      return;
    }

    // Dấu * ở cuối đánh dấu động từ nhóm 1 dễ nhầm thành nhóm 2 (帰ります, 入ります...).
    const deceptive = rawGroup.endsWith('*');
    const groupText = deceptive ? rawGroup.slice(0, -1).trim() : rawGroup;

    if (groupText !== '1' && groupText !== '2' && groupText !== '3') {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'bad-group',
        params: { value: rawGroup },
        message: `Nhóm phải là 1, 2 hoặc 3 (thêm * để đánh dấu đặc biệt), nhận được "${rawGroup}"`,
      });
      return;
    }
    const group = Number(groupText) as VerbGroup;

    const contentKey = `${masu}|${hanViet}`;
    if (seenContent.has(contentKey)) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'warning',
        code: 'duplicate-verb',
        params: {},
        message: 'Trùng với một động từ đã có ở phía trên, dòng này bị bỏ qua',
      });
      return;
    }
    seenContent.add(contentKey);

    let id = hashId(contentKey);
    if (usedIds.has(id)) {
      let suffix = 2;
      while (usedIds.has(`${id}-${suffix}`)) suffix++;
      id = `${id}-${suffix}`;
    }
    usedIds.add(id);

    verbs.push({ id, hanViet, masu, vietnamese, group, deceptive });
  });

  return { verbs, issues };
}

export interface ConversationParseResult {
  lines: ConversationLine[];
  issues: ParseIssue[];
}

/**
 * Phân tích bài HỘI THOẠI: mỗi dòng là một câu, có bản tiếng Nhật và bản tiếng Việt.
 *
 *   ## Hội thoại — ごみは どこに 出したら いいですか   <- tiêu đề nhóm
 *   管理人|ミラーさん、荷物は 片づきましたか。|Anh Miller, đồ đạc đã dọn xong chưa?
 *   あしたから 旅行なんです。|Từ ngày mai tôi sẽ đi du lịch.
 *
 * Ngăn cách bằng dấu | chứ KHÔNG dùng dấu phẩy: cả câu tiếng Việt lẫn câu tiếng
 * Nhật đều chứa đầy dấu phẩy (, và 、), nên tách bằng dấu phẩy là cắt vụn câu.
 * Dấu | không xuất hiện trong văn bản của cả hai thứ tiếng.
 *
 * Hai phần  -> tiếng Nhật | tiếng Việt          (câu không có người nói)
 * Ba phần   -> người nói | tiếng Nhật | tiếng Việt
 */
export function parseConversation(raw: string): ConversationParseResult {
  const text = stripBom(String(raw ?? ''));
  const lines = text.split(/\r?\n/);

  const result: ConversationLine[] = [];
  const issues: ParseIssue[] = [];
  const seenContent = new Set<string>();
  const usedIds = new Set<string>();
  let section = '';

  lines.forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();

    if (!line) return;

    // Kiểm tra ## TRƯỚC #, vì '## abc' cũng bắt đầu bằng '#'.
    if (line.startsWith('##')) {
      section = normalizeField(line.slice(2));
      return;
    }
    if (line.startsWith('#')) return;

    const parts = line.split('|').map((part) => normalizeField(part));
    if (parts.length < 2 || parts.length > 3) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'bad-columns-conversation',
        params: { count: String(parts.length) },
        message:
          'Mỗi dòng phải là "TIẾNG NHẬT|TIẾNG VIỆT" hoặc "NGƯỜI NÓI|TIẾNG NHẬT|TIẾNG VIỆT"',
      });
      return;
    }

    const speaker = parts.length === 3 ? parts[0] : '';
    const japanese = parts.length === 3 ? parts[1] : parts[0];
    const vietnamese = parts.length === 3 ? parts[2] : parts[1];

    const empty: string[] = [];
    const emptyCodes: string[] = [];
    if (!japanese) { empty.push('câu tiếng Nhật'); emptyCodes.push('japanese'); }
    if (!vietnamese) { empty.push('câu tiếng Việt'); emptyCodes.push('vietnamese'); }
    if (empty.length > 0) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'error',
        code: 'empty-columns',
        params: { columns: emptyCodes.join(',') },
        message: `Cột rỗng: ${empty.join(', ')}`,
      });
      return;
    }

    // Khoá nội dung chỉ gồm câu tiếng Nhật: sửa lại bản dịch tiếng Việt cho hay hơn
    // thì id không đổi, nhờ vậy dấu ★ của câu đó không mất.
    if (seenContent.has(japanese)) {
      issues.push({
        line: lineNumber,
        text: line,
        level: 'warning',
        code: 'duplicate-sentence',
        params: {},
        message: 'Trùng với một câu đã có ở phía trên, dòng này bị bỏ qua',
      });
      return;
    }
    seenContent.add(japanese);

    let id = hashId(japanese);
    if (usedIds.has(id)) {
      let suffix = 2;
      while (usedIds.has(`${id}-${suffix}`)) suffix++;
      id = `${id}-${suffix}`;
    }
    usedIds.add(id);

    result.push({ id, section, speaker, japanese, vietnamese });
  });

  return { lines: result, issues };
}

/** Biến chuỗi bất kỳ thành slug an toàn để làm id bài học và tên file. */
export function slugify(value: string): string {
  return stripDiacritics(String(value))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
