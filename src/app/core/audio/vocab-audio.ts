import type { VocabularyWord } from '../models/vocabulary.model';

/**
 * Quy tắc đặt tên file phát âm của từ vựng — NGUỒN SỰ THẬT DUY NHẤT.
 *
 * File mp3 do `npm run generate:audio` sinh ra bằng edge-tts, còn ứng dụng thì tự
 * tính lại tên file khi cần phát. Cả hai bên đều gọi đúng hàm trong file này
 * (script chạy thẳng trên file .ts nhờ `node --experimental-strip-types`), nên
 * không có bản chép lại nào để lệch nhau.
 *
 * Vì sao tên file là mã băm của CHÍNH CHUỖI ĐEM ĐỌC, chứ không phải id của từ:
 *  - Id của từ băm từ `japanese|hanViet`, KHÔNG gồm cách đọc. Sửa lại cách đọc sai
 *    của một từ thì id giữ nguyên — nếu lấy id làm tên file, app sẽ vui vẻ phát
 *    lại đúng file âm thanh đọc sai cũ.
 *  - Băm từ chuỗi đem đọc thì sửa cách đọc = đổi tên file = buộc phải sinh lại,
 *    và file cũ thành mồ côi (script `--clean` dọn đi). Không đời nào phát nhầm.
 *  - Hai từ trùng cách đọc (きます của 来ます và 着ます) dùng chung một file, đúng
 *    như mong đợi: cùng một âm thì chỉ cần một file.
 */

/** Thư mục chứa file phát âm, tính theo `<base href>` của trang. */
export const VOCAB_AUDIO_PATH = 'audio/vocab/';

export const VOCAB_AUDIO_EXT = '.mp3';

/** Giọng đọc dùng cho toàn bộ từ vựng. Đổi giọng thì phải sinh lại toàn bộ file. */
export const VOCAB_AUDIO_VOICE = 'ja-JP-NanamiNeural';

/**
 * Dấu "～" trong sách là CHỖ TRỐNG để điền số/danh từ ("～人", "国際～"), không phải
 * âm để đọc. Để nguyên thì máy đọc thành một quãng ngập ngừng vô nghĩa.
 */
const PLACEHOLDER = /[～〜]/g;

/**
 * Chuỗi chỉ gồm kana (kèm dấu trường âm và dấu câu tiếng Nhật) — tức là một cách
 * đọc đầy đủ, đọc lên không còn chỗ nào phải đoán.
 *
 * Chữ số và chữ Latin cố tình KHÔNG nằm trong tập này: cột cách đọc của bài 36 ghi
 * "7じをすぎます", mà máy đọc "7" tách khỏi ngữ cảnh sẽ ra "なな" thay vì "しち".
 * Những ô như vậy rơi xuống nhánh dùng cột tiếng Nhật ("7時を過ぎます"), nơi máy có
 * đủ kanji để chọn đúng âm.
 */
const KANA_ONLY =
  /^[ぁ-ゟ゠-ヿㇰ-ㇿｦ-ﾟー、。・？！\s]+$/;

function normalize(value: string): string {
  return String(value).normalize('NFC').replace(PLACEHOLDER, '').replace(/\s+/g, ' ').trim();
}

/**
 * Chuỗi sẽ đưa cho máy đọc.
 *
 * Ưu tiên cột cách đọc vì kana không có gì để đọc sai; chỉ khi cột đó trống hoặc
 * còn lẫn ký tự không phải kana mới quay về cột tiếng Nhật (xem `KANA_ONLY`).
 * Trả chuỗi rỗng khi cả hai cột đều không đọc được — chỗ gọi phải coi đó là "từ
 * này không có phát âm" thay vì sinh ra một file rỗng.
 */
export function speechTextOf(word: Pick<VocabularyWord, 'japanese' | 'reading'>): string {
  const reading = normalize(word.reading ?? '');
  if (reading.length > 0 && KANA_ONLY.test(reading)) return reading;
  return normalize(word.japanese ?? '');
}

const FNV_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const U64_MASK = 0xffffffffffffffffn;

/**
 * Băm FNV-1a 64-bit trên chuỗi byte UTF-8 -> 16 ký tự hex.
 *
 * Dùng 64-bit chứ không dùng lại `hashId` 32-bit của `vocabulary-parser.ts`: với
 * ~1300 chuỗi, xác suất đụng độ ở 32-bit là cỡ 1/5000 — nhỏ, nhưng hậu quả đúng
 * bằng điều phải tránh nhất ở đây (hai từ khác nhau chung một file, một từ phát ra
 * âm của từ kia). Ở 64-bit con số đó xuống dưới 1/10^13. Script sinh file vẫn kiểm
 * tra đụng độ một lần nữa và dừng hẳn nếu gặp.
 */
export function audioIdOf(text: string): string {
  let hash = FNV_OFFSET_BASIS;
  for (const byte of new TextEncoder().encode(text)) {
    hash = ((hash ^ BigInt(byte)) * FNV_PRIME) & U64_MASK;
  }
  return hash.toString(16).padStart(16, '0');
}

/** Tên file phát âm của một chuỗi, ví dụ "3f2a…c1.mp3". */
export function audioFileOfText(text: string): string {
  return `${audioIdOf(text)}${VOCAB_AUDIO_EXT}`;
}

/** Tên file phát âm của một từ, hoặc null nếu từ đó không có gì để đọc. */
export function audioFileOfWord(word: Pick<VocabularyWord, 'japanese' | 'reading'>): string | null {
  const text = speechTextOf(word);
  return text.length === 0 ? null : audioFileOfText(text);
}
