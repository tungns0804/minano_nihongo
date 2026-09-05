/**
 * Ghép âm Hán Việt của CẢ TỪ từ âm của TỪNG CHỮ.
 *
 * Vì sao cần: sách 日本語総まとめ N3 không chú âm Hán Việt, nên 215 dòng trong
 * `data-source/soumatome-n3-*` để trống cột đó. Trong đó 143 từ CÓ chữ Hán —
 * cột trống ở những dòng đó là một khoảng thiếu, không phải một sự thật.
 *
 * ── Âm của từng chữ lấy ở đâu ─────────────────────────────────────────────
 * Từ `src/app/core/kanji/kanji-words.ts`, tức bảng mà `npm run generate:kanji`
 * đã suy ra TỪ CHÍNH kho từ 皆の日本語 (mỗi từ có đủ số âm tiết bằng số chữ Hán
 * thì bỏ một phiếu cho từng chữ). Không tra ở đâu khác, không chép tay chữ nào.
 *
 * ── Ghép theo đúng quy ước sẵn có của kho từ ──────────────────────────────
 * Kho từ ghi âm Hán Việt cho phần CHỮ HÁN và bỏ qua kana: "時間に遅れます" ghi
 * "THỜI GIAN TRÌ", "会社を休みます" ghi "HỘI XÃ". Hàm dưới đây làm đúng vậy —
 * nối âm của các chữ Hán theo thứ tự, cách nhau một dấu cách.
 *
 * Thiếu âm của DÙ CHỈ MỘT chữ thì trả về chuỗi rỗng chứ không ghép nửa vời:
 * một âm Hán Việt cụt ("THIÊN" cho 天井) sai hơn là để trống.
 *
 * ── Vì sao ghép lúc SINH DỮ LIỆU, không ghi vào data-source ───────────────
 * Id của từ băm từ `japanese|hanViet` (xem `vocab-core.mjs`), mà id là khoá lưu
 * dấu ★ "chưa nhớ". Ghi âm ghép vào data-source sẽ đổi id của cả 140 từ và xoá
 * sạch ★ của chúng. Ghép ở đây thì id vẫn băm từ nội dung GỐC của file nguồn,
 * nên ★ không mất một mục nào.
 *
 * Hệ quả phải nhớ: với những từ này, `id` KHÔNG bằng `hashId(japanese|hanViet)`
 * của dữ liệu đã sinh — nó bằng `hashId(japanese|)` của dòng nguồn. Đó là chủ ý:
 * id là mã băm của thứ FILE NGUỒN nói, còn âm ghép chỉ là phần bồi thêm lúc hiển
 * thị. `verify-parser-parity.mjs` vì vậy chỉ đối chiếu id trên bài 皆の日本語,
 * nơi cột âm Hán Việt được gõ tay đầy đủ.
 *
 * Cũng vì ghép ở đây mà `generate-kanji.mjs` — vốn đọc thẳng data-source — không
 * bao giờ nhìn thấy âm ghép. Nếu nó thấy, những âm này sẽ quay lại bỏ phiếu cho
 * chính các chữ đã sinh ra chúng, và một âm sai sẽ tự củng cố mình mãi mãi.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Khoảng chữ Hán. Kana và ký tự Latin đều nằm ngoài. */
const KANJI = /[一-鿿]/;

const toFileUrl = (path) =>
  new URL(`file:///${path.split(String.fromCharCode(92)).join('/')}`).href;

/**
 * Bảng `chữ -> âm Hán Việt` do `npm run generate:kanji` sinh ra.
 *
 * Chưa có file thì trả Map rỗng — dự án mới clone mà chưa chạy generate:kanji
 * thì đơn giản là chưa ghép được gì, không phải lỗi.
 *
 * Nhưng CÓ file mà nạp hỏng thì NÉM LỖI chứ không lặng lẽ trả Map rỗng. Hỏng ở
 * đây gần như luôn là do quên cờ `--experimental-strip-types` (file là .ts), và
 * hậu quả của việc nuốt lỗi đúng bằng thứ khó thấy nhất: dữ liệu vẫn sinh ra
 * bình thường, chỉ là thiếu sạch âm Hán Việt ghép được, mà chẳng có dòng nào báo.
 */
export async function loadCharHanViet(root) {
  const file = join(root, 'src/app/core/kanji/kanji-words.ts');
  if (!existsSync(file)) return new Map();

  let seeds;
  try {
    ({ KANJI_SEEDS: seeds } = await import(toFileUrl(file)));
  } catch (error) {
    throw new Error(
      `Khong nap duoc kanji-words.ts de ghep am Han Viet: ${error.message}
` +
        'Script nap thang file .ts nen phai chay bang: ' +
        'node --experimental-strip-types --no-warnings <script>',
    );
  }

  const table = new Map();
  for (const [char, hanViet] of seeds) {
    if (hanViet) table.set(char, hanViet);
  }
  return table;
}

/**
 * Âm Hán Việt ghép được của một từ, hoặc chuỗi rỗng.
 *
 * Rỗng ở hai trường hợp khác hẳn nhau, và nơi gọi cần phân biệt để báo cho đúng:
 *  - từ không có chữ Hán nào (キッチン, ほうき): không bao giờ có âm, không phải thiếu sót
 *  - từ có chữ Hán nhưng bảng thiếu âm của ít nhất một chữ: đây mới là chỗ hổng
 */
export function composeHanViet(japanese, table) {
  const chars = [...String(japanese ?? '')].filter((char) => KANJI.test(char));
  if (chars.length === 0) return '';

  const parts = chars.map((char) => table.get(char));
  if (parts.some((part) => !part)) return '';

  return parts.join(' ').toUpperCase();
}

/** Từ này có chữ Hán không — tức có quyền mang âm Hán Việt hay không. */
export function hasKanji(japanese) {
  return KANJI.test(String(japanese ?? ''));
}

/**
 * Điền âm Hán Việt cho những từ đang để trống. Sửa tại chỗ.
 *
 * KHÔNG bao giờ đè lên âm đã có: cột gõ tay của 皆の日本語 luôn thắng, kể cả khi
 * nó khác với âm ghép được — người gõ nhìn thấy cả từ, còn hàm này chỉ nhìn từng
 * chữ rời.
 *
 * @returns {{ filled: number, missing: string[] }} `missing` là các từ CÓ chữ Hán
 *   mà vẫn không ghép được — danh sách đáng in ra để biết bảng âm còn thiếu chữ nào.
 */
export function fillMissingHanViet(words, table) {
  let filled = 0;
  const missing = [];

  for (const word of words) {
    if (word.hanViet) continue;
    if (!hasKanji(word.japanese)) continue;

    const composed = composeHanViet(word.japanese, table);
    if (composed) {
      word.hanViet = composed;
      filled++;
    } else {
      missing.push(word.japanese);
    }
  }

  return { filled, missing };
}
