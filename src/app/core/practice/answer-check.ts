import { ALTERNATIVE_SEPARATOR, stripDiacritics } from '../lessons/vocabulary-parser';
import { matchesMarkup } from '../translation/markup';

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
  /**
   * Chấm NGHĨA của một từ: mỗi dấu câu (ngoặc, phẩy, ~, dấu lửng, gạch nối…) coi
   * như một dấu cách. "Hoàn toàn (không)" và "hoàn toàn ~ không" đều thành
   * "hoàn toàn không" — đúng thứ người học gõ ra. Khác `ignorePunctuation`: khoảng
   * trắng vẫn là ranh giới từ, vì nghĩa tiếng Việt ngắn mà bỏ hết dấu cách thì
   * "học sinh" với "họcsinh" thành một, không cần thiết.
   */
  looseMeaning?: boolean;
}

/**
 * Dấu câu coi như dấu cách khi chấm nghĩa (`looseMeaning`). Có thêm ～ toàn chiều mà
 * `PUNCTUATION` cố ý chừa ra: trong cột nghĩa nó chỉ là chỗ trống ("～ người",
 * "hoàn toàn ~ không"), người học không gõ. KHÔNG có dấu / — nó ngăn các nghĩa
 * tương đương và đã được `acceptedMeaningsOf` tách riêng.
 */
const MEANING_PUNCTUATION = /[、。，．！？!?,.;:；：'"“”‘’「」『』（）()…‥⋯・~〜～\-–—]/g;

/**
 * Phần trong ngoặc ở cột nghĩa, cả ngoặc nửa chiều lẫn toàn chiều.
 *
 * Từ vựng 日本語総まとめ N3 ghi nghĩa kèm chú giải tiếng Anh của chính sách —
 * "lò vi sóng (microwave)" — để đối chiếu được với bản in. Nhưng cột nghĩa KHÔNG
 * nằm trong diện bỏ qua dấu câu khi chấm (xem `ignorePunctuation`, chỉ bật cho bài
 * hội thoại và ngữ pháp), nên nếu không xử lý thì ở chế độ gõ, người học buộc phải
 * gõ cả phần tiếng Anh mới được tính đúng.
 */
const PARENTHETICAL = /[(（][^)）]*[)）]/g;
const PARENTHETICAL_CONTENT = /[(（]([^)）]*)[)）]/g;

/** "lò vi sóng (microwave)" -> "lò vi sóng" */
function withoutParentheticals(value: string): string {
  return value.replace(PARENTHETICAL, ' ').replace(/\s+/g, ' ').trim();
}

/** "lò vi sóng (microwave)" -> ["microwave"] */
function parentheticalsOf(value: string): string[] {
  return [...value.matchAll(PARENTHETICAL_CONTENT)]
    .map((match) => match[1].trim())
    .filter((item) => item.length > 0);
}

/**
 * Tách một ô đáp án thành các cách trả lời được chấp nhận.
 * "chạy trốn/ bỏ chạy"      -> ["chạy trốn/ bỏ chạy", "chạy trốn", "bỏ chạy"]
 * "lò vi sóng (microwave)"  -> ["lò vi sóng (microwave)", "lò vi sóng", "microwave"]
 *
 * Bản thân chuỗi gốc luôn nằm đầu danh sách để người gõ đầy đủ vẫn được tính đúng.
 * Danh sách này chỉ NỚI RỘNG chỗ chấm đúng, không bao giờ loại bớt, nên bài cũ
 * không bị chấm khác đi.
 */
export function acceptedAnswersOf(answer: string): string[] {
  const full = answer.trim();
  const parts = full
    .split(ALTERNATIVE_SEPARATOR)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  // Mỗi cách trả lời còn được chấp nhận ở hai dạng rút gọn nữa: bỏ phần trong
  // ngoặc, và chỉ riêng phần trong ngoặc.
  const accepted = [full, ...parts].flatMap((item) => [
    item,
    withoutParentheticals(item),
    ...parentheticalsOf(item),
  ]);
  return [...new Set(accepted)].filter((item) => item.length > 0);
}

/** Ranh giới giữa các nghĩa tương đương trong cột nghĩa của một từ. */
const MEANING_SEPARATORS = new Set([ALTERNATIVE_SEPARATOR, ',', '，', ';', '；']);

/** Giới hạn số cụm ngoặc đem tổ hợp có/không: 2^3 = 8 cách viết là đủ. */
const MAX_OPTIONAL_GROUPS = 3;

/**
 * Tách theo các dấu ngăn nghĩa, nhưng chỉ những dấu nằm NGOÀI ngoặc: chú thích
 * "Số (số điện thoại, số phòng)" là một nghĩa, không phải hai.
 */
function splitMeanings(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(' || ch === '（') depth++;
    else if ((ch === ')' || ch === '）') && depth > 0) depth--;
    if (depth === 0 && MEANING_SEPARATORS.has(ch)) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts.map((part) => part.trim()).filter((part) => part.length > 0);
}

/**
 * Mọi cách viết khi coi từng cụm trong ngoặc là KHÔNG BẮT BUỘC.
 * "(Trời) sáng"        -> ["(Trời) sáng", "sáng"]
 * "Hoàn toàn (không)"  -> ["Hoàn toàn (không)", "Hoàn toàn"]
 * Còn cách gõ có phần trong ngoặc nhưng không gõ dấu ngoặc ("hoàn toàn không") thì
 * `looseMeaning` lo: dấu ngoặc khi so chỉ còn là dấu cách.
 */
function optionalGroupVariants(value: string): string[] {
  const groups = [...value.matchAll(PARENTHETICAL)];
  if (groups.length === 0) return [value];
  if (groups.length > MAX_OPTIONAL_GROUPS) return [value, withoutParentheticals(value)];

  const variants: string[] = [];
  for (let mask = 0; mask < 1 << groups.length; mask++) {
    let out = '';
    let from = 0;
    groups.forEach((group, i) => {
      const start = group.index ?? 0;
      out += value.slice(from, start) + ((mask >> i) & 1 ? ' ' : group[0]);
      from = start + group[0].length;
    });
    variants.push((out + value.slice(from)).replace(/\s+/g, ' ').trim());
  }
  return variants;
}

/**
 * Các cách trả lời được chấp nhận cho NGHĨA của một từ (cột nghĩa tiếng Việt của
 * bài từ vựng, nghĩa của từ trong khu Kanji). Chấm cùng `looseMeaning: true`.
 *
 * Nghĩa từ khác câu dài ở hai chỗ, nên tách khỏi `acceptedAnswersOf`:
 *  - Dấu phẩy cũng ngăn các nghĩa tương đương như dấu /. Sách ghi "Học sinh, sinh
 *    viên", "Nhồi, nhét/ xếp sát" — gõ một nghĩa là đủ. Câu ví dụ ngữ pháp thì không
 *    thể tách theo dấu phẩy, nên hàm này không dùng cho câu.
 *  - Phần trong ngoặc là chú thích tuỳ chọn: "(Không) bao giờ" nhận cả "không bao
 *    giờ" lẫn "bao giờ". Riêng phần trong ngoặc đứng một mình thì KHÔNG được nhận:
 *    "không" không phải nghĩa của 全く, "kính ngữ" không phải nghĩa của 召し上がります.
 *
 * "Hoàn toàn (không)" -> ["Hoàn toàn (không)", "Hoàn toàn"]
 * "Rất/ (không) thể nào" -> [..., "Rất", "(không) thể nào", "thể nào"]
 */
export function acceptedMeaningsOf(answer: string): string[] {
  const full = answer.trim();
  const slashParts = full
    .split(ALTERNATIVE_SEPARATOR)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
  const accepted = [full, ...slashParts, ...splitMeanings(full)].flatMap(optionalGroupVariants);
  // Cách viết chỉ còn toàn dấu (vd. "～") thì không thành đáp án.
  return [...new Set(accepted)].filter((item) => item.replace(MEANING_PUNCTUATION, '').trim().length > 0);
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
  else if (options.looseMeaning) out = out.replace(MEANING_PUNCTUATION, ' ');

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

/**
 * Câu trả lời có khớp một trong các CÂU MẪU viết theo cú pháp của khu Luyện dịch
 * (furigana `{漢字|かな}`, lựa chọn `[a/b]` — xem `core/translation/markup.ts`).
 *
 * Mỗi đoạn chữ của câu mẫu được chuẩn hoá bằng đúng `normalizeForCompare` như câu trả
 * lời, nên mọi quy tắc nới lỏng ở trên (bỏ dấu câu, khoảng trắng, chữ số toàn chiều,
 * dấu tiếng Việt khi bật) áp y hệt cho câu mẫu.
 */
export function isPatternCorrect(
  input: string,
  patterns: readonly string[],
  options: CompareOptions,
): boolean {
  const normalizedInput = normalizeForCompare(input, options);
  if (!normalizedInput) return false;
  const normalize = (value: string) => normalizeForCompare(value, options);
  return patterns.some((pattern) => matchesMarkup(normalizedInput, pattern, normalize));
}
