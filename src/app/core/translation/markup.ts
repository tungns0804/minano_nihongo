/**
 * Cú pháp viết câu của khu Luyện dịch — bản cài đặt DUY NHẤT.
 *
 * Câu luyện dịch không phải một chuỗi đáp án cố định. Cùng một câu tiếng Nhật, người
 * học có thể gõ 「学生」 hay 「がくせい」, có thể có hay bỏ 「わたしは」; cùng một câu
 * tiếng Việt thì "anh" hay "chị" đều đúng. Liệt kê đủ mọi tổ hợp thành danh sách đáp
 * án thì một câu tám chữ Hán đã ra 256 chuỗi. Nên câu được viết bằng một cú pháp
 * nhỏ, và bộ chấm dựng một biểu thức chính quy từ chính câu đó:
 *
 *   {漢字|かんじ}   chữ Hán kèm cách đọc — hiện thành furigana, gõ cách nào cũng đúng
 *   [a/b/c]       các cách nói tương đương — hiện cách đầu, gõ cách nào cũng đúng
 *   [a/]          phần có thể bỏ (lựa chọn rỗng)
 *
 * Bên trong [...] được dùng {…|…}, nhưng không lồng [...] vào nhau.
 *
 * `scripts/` nạp thẳng file này (qua `--experimental-strip-types`) để kiểm dữ liệu và
 * băm id, nên app và script luôn hiểu cú pháp giống hệt nhau.
 */

export type MarkupNode =
  | { kind: 'text'; text: string }
  | { kind: 'ruby'; base: string; reading: string }
  | { kind: 'choice'; options: MarkupNode[][] };

/** Một đoạn để vẽ: chữ thường, hoặc chữ Hán kèm furigana. */
export interface RubySegment {
  base: string;
  /** Cách đọc; null với đoạn không có furigana. */
  reading: string | null;
}

const SPECIAL = new Set(['{', '}', '[', ']', '|', '/']);

/** Kana (hiragana, katakana, dấu kéo dài) — thứ duy nhất được phép làm cách đọc. */
const KANA_ONLY = /^[ぁ-ゟ゠-ヿ]+$/;

/**
 * Không dùng thuộc tính khai thẳng trong constructor (`constructor(readonly source…)`):
 * script nạp file này bằng `--experimental-strip-types`, chế độ chỉ bóc kiểu đi chứ
 * không dịch cú pháp riêng của TypeScript.
 */
class Reader {
  index = 0;
  readonly problems: string[] = [];
  readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  peek(): string | undefined {
    return this.source[this.index];
  }

  /** Đọc chữ thường tới ký tự đặc biệt kế tiếp. `/` chỉ đặc biệt khi ở trong [...]. */
  text(insideChoice: boolean): string {
    let out = '';
    while (this.index < this.source.length) {
      const ch = this.source[this.index];
      if (SPECIAL.has(ch) && (ch !== '/' || insideChoice)) break;
      out += ch;
      this.index++;
    }
    return out;
  }

  ruby(): MarkupNode {
    const start = this.index;
    this.index++; // {
    const base = this.text(false);
    if (this.peek() !== '|') {
      this.problems.push(`thiếu dấu | trong {…} ở vị trí ${start}`);
      return { kind: 'text', text: base };
    }
    this.index++;
    const reading = this.text(false);
    if (this.peek() !== '}') {
      this.problems.push(`thiếu dấu } đóng {…} ở vị trí ${start}`);
      return { kind: 'text', text: base };
    }
    this.index++;
    if (!base || !reading) this.problems.push(`{…} rỗng ở vị trí ${start}`);
    else if (!KANA_ONLY.test(reading)) this.problems.push(`cách đọc "${reading}" phải là kana`);
    return { kind: 'ruby', base, reading };
  }

  choice(): MarkupNode {
    const start = this.index;
    this.index++; // [
    const options: MarkupNode[][] = [[]];
    while (this.index < this.source.length) {
      const ch = this.peek();
      if (ch === ']') {
        this.index++;
        if (options.length < 2) this.problems.push(`[…] ở vị trí ${start} chỉ có một lựa chọn`);
        return { kind: 'choice', options };
      }
      if (ch === '/') {
        this.index++;
        options.push([]);
      } else if (ch === '{') {
        options[options.length - 1].push(this.ruby());
      } else if (ch === '[') {
        this.problems.push(`không lồng […] vào nhau (vị trí ${this.index})`);
        this.index++;
      } else if (ch === '|' || ch === '}') {
        this.problems.push(`dấu ${ch} lạc chỗ ở vị trí ${this.index}`);
        this.index++;
      } else {
        options[options.length - 1].push({ kind: 'text', text: this.text(true) });
      }
    }
    this.problems.push(`thiếu dấu ] đóng […] ở vị trí ${start}`);
    return { kind: 'choice', options };
  }

  all(): MarkupNode[] {
    const nodes: MarkupNode[] = [];
    while (this.index < this.source.length) {
      const ch = this.peek();
      if (ch === '{') nodes.push(this.ruby());
      else if (ch === '[') nodes.push(this.choice());
      else if (ch === '|' || ch === '}' || ch === ']') {
        this.problems.push(`dấu ${ch} lạc chỗ ở vị trí ${this.index}`);
        this.index++;
      } else {
        nodes.push({ kind: 'text', text: this.text(false) });
      }
    }
    return nodes;
  }
}

/** Phân tích một câu. Không bao giờ ném lỗi: chỗ viết sai được đọc như chữ thường. */
export function parseMarkup(source: string): MarkupNode[] {
  return new Reader(source).all();
}

/** Các lỗi cú pháp của một câu; mảng rỗng là câu viết đúng. Script sinh dữ liệu dùng hàm này. */
export function markupProblems(source: string): string[] {
  const reader = new Reader(source);
  reader.all();
  return reader.problems;
}

function firstOption(node: MarkupNode & { kind: 'choice' }): MarkupNode[] {
  return node.options[0] ?? [];
}

function render(nodes: readonly MarkupNode[], pick: (node: MarkupNode & { kind: 'ruby' }) => string): string {
  return nodes
    .map((node) => {
      if (node.kind === 'text') return node.text;
      if (node.kind === 'ruby') return pick(node);
      return render(firstOption(node), pick);
    })
    .join('');
}

/** Câu để hiển thị thường: chữ Hán, lựa chọn đầu tiên. 「{学生|がくせい}です」 → 「学生です」. */
export function plainText(source: string): string {
  return render(parseMarkup(source), (node) => node.base);
}

/** Câu viết toàn kana: 「{学生|がくせい}です」 → 「がくせいです」. */
export function kanaText(source: string): string {
  return render(parseMarkup(source), (node) => node.reading);
}

/** Các đoạn để vẽ furigana, theo lựa chọn đầu tiên của mỗi [...]. */
export function rubySegments(source: string): RubySegment[] {
  const out: RubySegment[] = [];
  const walk = (nodes: readonly MarkupNode[]) => {
    for (const node of nodes) {
      if (node.kind === 'text') {
        const last = out[out.length - 1];
        if (last && last.reading === null) last.base += node.text;
        else if (node.text) out.push({ base: node.text, reading: null });
      } else if (node.kind === 'ruby') {
        out.push({ base: node.base, reading: node.reading });
      } else {
        walk(firstOption(node));
      }
    }
  };
  walk(parseMarkup(source));
  return out;
}

/** Có chữ Nhật thì đóng ngoặc toàn chiều cho cùng nét với câu, không thì ngoặc thường. */
const JAPANESE_CHAR = /[぀-ヿ㐀-鿿々〆]/;

/**
 * Các đoạn để vẽ câu như VĂN BẢN GỐC viết: mọi lựa chọn của [a/b] nối bằng "/", phần có
 * thể bỏ [a/] đặt trong ngoặc.
 *
 * Khác `rubySegments` (chỉ lấy lựa chọn đầu): ở khu Luyện dịch, [a/b] là các cách nói
 * được chấp nhận ngầm, còn ở bài tập ngữ pháp N4 nó là chính chữ tài liệu in ra —
 * 「いつ/何時に会ったらいい？」, 「場合（は）」 — nên phải hiện đủ.
 */
export function writtenSegments(source: string): RubySegment[] {
  const out: RubySegment[] = [];
  const pushText = (text: string) => {
    if (!text) return;
    const last = out[out.length - 1];
    if (last && last.reading === null) last.base += text;
    else out.push({ base: text, reading: null });
  };

  const walk = (nodes: readonly MarkupNode[]) => {
    for (const node of nodes) {
      if (node.kind === 'text') {
        pushText(node.text);
      } else if (node.kind === 'ruby') {
        out.push({ base: node.base, reading: node.reading });
      } else {
        const filled = node.options.filter((option) => option.length > 0);
        const optional = filled.length < node.options.length;
        const japanese = filled.some((option) =>
          JAPANESE_CHAR.test(render(option, (ruby) => ruby.base)),
        );
        if (optional) pushText(japanese ? '（' : '(');
        filled.forEach((option, index) => {
          if (index > 0) pushText('/');
          walk(option);
        });
        if (optional) pushText(japanese ? '）' : ')');
      }
    }
  };

  walk(parseMarkup(source));
  return out;
}

/** `writtenSegments` không kèm furigana — cho chỗ chỉ hiện được chữ thường. */
export function writtenText(source: string): string {
  return writtenSegments(source)
    .map((segment) => segment.base)
    .join('');
}

/**
 * Các câu khác đọc ra được từ câu mẫu (mỗi [...] chọn một lựa chọn), ở dạng chữ Hán và
 * bỏ câu đầu — chính là `plainText`. Dùng cho dòng "cũng được chấp nhận" sau khi chấm.
 *
 * Cắt ở `limit` câu: câu có ba chỗ [a/b] đã ra tám tổ hợp, liệt kê hết thì dòng đó dài
 * hơn chính đáp án.
 */
export function variantTexts(source: string, limit = 4): string[] {
  let variants = [''];
  for (const node of parseMarkup(source)) {
    const pieces =
      node.kind === 'text'
        ? [node.text]
        : node.kind === 'ruby'
          ? [node.base]
          : node.options.map((option) => render(option, (ruby) => ruby.base));
    variants = variants.flatMap((prefix) => pieces.map((piece) => prefix + piece)).slice(0, 64);
  }
  const tidy = (value: string) => value.replace(/\s+/g, ' ').trim();
  const first = tidy(plainText(source));
  return [...new Set(variants.map(tidy))].filter((item) => item && item !== first).slice(0, limit);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function patternOf(nodes: readonly MarkupNode[], normalize: (value: string) => string): string {
  return nodes
    .map((node) => {
      if (node.kind === 'text') return escapeRegex(normalize(node.text));
      if (node.kind === 'ruby') {
        const forms = [...new Set([normalize(node.base), normalize(node.reading)])];
        return `(?:${forms.map(escapeRegex).join('|')})`;
      }
      return `(?:${node.options.map((option) => patternOf(option, normalize)).join('|')})`;
    })
    .join('');
}

/**
 * Câu trả lời đã chuẩn hoá có khớp câu mẫu không.
 *
 * `normalize` là hàm chuẩn hoá của bộ chấm (bỏ dấu câu, khoảng trắng, chữ hoa…), áp lên
 * TỪNG đoạn chữ của câu mẫu. Áp từng đoạn mới đúng: lựa chọn rỗng `[あの/]` không để lại
 * khoảng trắng thừa nào, vì khoảng trắng đã bị bỏ hết ở mọi đoạn.
 */
export function matchesMarkup(
  normalizedInput: string,
  source: string,
  normalize: (value: string) => string,
): boolean {
  return new RegExp(`^${patternOf(parseMarkup(source), normalize)}$`).test(normalizedInput);
}
