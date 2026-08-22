import { ALTERNATIVE_SEPARATOR, stripDiacritics } from './vocabulary-parser';

/** Khoảng trắng full-width hay gặp khi copy văn bản tiếng Nhật. */
const FULLWIDTH_SPACE = String.fromCharCode(0x3000);

/**
 * Chữ số toàn chiều (０-９) đổi về nửa chiều (0-9) trước khi so.
 *
 * Vì sao cần: dữ liệu bài 5 và bài 11 chép từ sách có các từ như "１日", "２人" viết
 * bằng chữ số TOÀN CHIỀU. Người học gõ "1日" bằng bàn phím thường sẽ bị chấm sai, dù
 * đó mới là cách gõ tự nhiên. Ngược lại, bộ gõ tiếng Nhật lại hay cho ra chữ số toàn
 * chiều, nên sửa cứng dữ liệu về một bên thì bên còn lại vẫn sai. Quy về cùng một
 * dạng lúc SO SÁNH mới xử lý được cả hai chiều.
 *
 * Chỉ đụng tới chữ số. Không dùng NFKC cho cả chuỗi vì phép đó còn biến đổi cả dấu
 * ～ (đang dùng làm ký hiệu mẫu: "～人", "～台") và katakana nửa chiều.
 */
const FULLWIDTH_DIGITS = /[０-９]/g;

function foldFullwidthDigits(value: string): string {
  return value.replace(FULLWIDTH_DIGITS, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xff10 + 0x30),
  );
}

/**
 * Dấu câu được bỏ qua khi chấm câu dài: dấu của cả tiếng Nhật (、。！？「」…) lẫn
 * tiếng Việt (,.!?"'…). KHÔNG gồm dấu / vì trong bài từ vựng nó ngăn các nghĩa
 * tương đương, mà bài hội thoại thì / có thể là một phần của câu.
 *
 * Có đủ các biến thể của dấu ba chấm: … (U+2026), ‥, ⋯ và cả ba dấu chấm gõ tay
 * "...". Sách in dấu lửng ở cuối rất nhiều câu bỏ lửng (「10分だけ……。」) — đó là
 * ngữ điệu, không phải nội dung phải dịch.
 */
const PUNCTUATION = /[、。，．！？!?,.;:；：'"“”‘’「」『』（）()…‥⋯・~〜\-–—]/g;

export interface CompareOptions {
  /** Bỏ qua dấu thanh tiếng Việt khi so khớp. */
  ignoreDiacritics: boolean;
  /** Bỏ hết khoảng trắng — dùng cho tiếng Nhật vì tiếng Nhật không có dấu cách giữa từ. */
  ignoreAllWhitespace: boolean;
  /**
   * Bỏ qua dấu câu. Chỉ bật cho bài hội thoại và bài ngữ pháp — câu dài mà sai chỉ
   * vì thiếu dấu 。 thì không phản ánh việc dịch đúng hay sai.
   *
   * Kéo theo cả khoảng trắng: xoá dấu câu đi thì chỗ nó đứng thành ranh giới từ hay
   * không là chuyện không đoán được. "Ừ...m" bỏ dấu lửng ra người học gõ liền "Ừm",
   * "15.000 yên" gõ thành "15000 yên", "Tachiiri-Kinshi" gõ thành "Tachiiri Kinshi" —
   * cả ba đều đúng. Nếu dấu câu chỉ đổi thành dấu cách thì mỗi trường hợp lại bị
   * chấm sai một kiểu. Đây cũng đúng như dòng chữ app đang hứa với người học ở màn
   * luyện tập: "Dấu câu và khoảng trắng không tính khi chấm."
   */
  ignorePunctuation?: boolean;
}

/**
 * Tách một ô đáp án thành các cách trả lời được chấp nhận.
 * "chạy trốn/ bỏ chạy" -> ["chạy trốn/ bỏ chạy", "chạy trốn", "bỏ chạy"]
 *
 * Bản thân chuỗi gốc luôn nằm đầu danh sách để người gõ đầy đủ vẫn được tính đúng.
 */
export function acceptedAnswersOf(answer: string): string[] {
  const full = answer.trim();
  const parts = full
    .split(ALTERNATIVE_SEPARATOR)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  const accepted = [full, ...parts];
  return [...new Set(accepted)].filter((item) => item.length > 0);
}

/** Đưa chuỗi về dạng chuẩn để so sánh: NFC, thường hoá, gọn khoảng trắng. */
export function normalizeForCompare(value: string, options: CompareOptions): string {
  let out = foldFullwidthDigits(
    String(value ?? '')
      .normalize('NFC')
      .split(FULLWIDTH_SPACE)
      .join(' '),
  );

  if (options.ignorePunctuation) out = out.replace(PUNCTUATION, '');

  const dropWhitespace = options.ignoreAllWhitespace || options.ignorePunctuation;
  out = dropWhitespace ? out.replace(/\s+/g, '') : out.replace(/\s+/g, ' ').trim();
  out = out.toLowerCase();

  if (options.ignoreDiacritics) {
    out = stripDiacritics(out).toLowerCase();
  }
  return out;
}

/** Câu trả lời gõ tay có khớp một trong các đáp án được chấp nhận không. */
export function isAnswerCorrect(
  input: string,
  acceptedAnswers: readonly string[],
  options: CompareOptions,
): boolean {
  const normalizedInput = normalizeForCompare(input, options);
  if (!normalizedInput) return false;
  return acceptedAnswers.some((answer) => normalizeForCompare(answer, options) === normalizedInput);
}
