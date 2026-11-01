import type { VocabularyWord } from '../lessons/vocabulary.model';

/**
 * Hình minh họa của từ vựng — bảng gán từ → icon OpenMoji, NGUỒN SỰ THẬT DUY NHẤT.
 *
 * Icon lấy từ OpenMoji (https://openmoji.org, giấy phép CC BY-SA 4.0): bộ emoji mã
 * nguồn mở, tải thẳng từ CDN không cần tài khoản hay API key. `npm run generate:images`
 * tải file SVG của mọi icon có trong bảng về `public/images/vocab/`; `verify:images`
 * kiểm tra đủ file và mọi từ trong bảng đều có thật trong một bài học.
 *
 * Gán theo TỪ chứ không theo bài: cùng một từ xuất hiện ở bài khác (bài chủ đề chẳng
 * hạn) thì cũng hiện cùng hình. Khoá là `chữ Nhật|cách đọc` — không dùng id của từ, vì
 * id băm cả âm Hán Việt, sửa âm Hán Việt là mất hình.
 *
 * Mỗi từ một icon KHÁC NHAU, kể cả cặp tự / tha động từ (直る ✅ / 直す 🔧): hình là để
 * nhớ nghĩa, hai từ chung một hình thì nhìn hình không phân biệt được.
 */

/** Thư mục chứa hình, tính theo `<base href>` của trang. */
export const VOCAB_IMAGE_PATH = 'images/vocab/';

/** Phiên bản OpenMoji đã tải — đổi phiên bản thì phải tải lại toàn bộ hình. */
export const OPENMOJI_VERSION = '15.1.0';

/** `chữ Nhật|cách đọc` → mã icon OpenMoji (tên file SVG, mã Unicode viết hoa nối bằng "-"). */
export const VOCAB_IMAGES: Readonly<Record<string, string>> = {
  // Từ vựng N3 · 名詞 — Bài 4 (151–200)
  '断る|ことわる': '1F645', // 🙅
  '見つかる|みつかる': '1F50E', // 🔎
  '見つける|みつける': '1F50D', // 🔍
  '捕まる|つかまる': '1F694', // 🚔
  '捕まえる|つかまえる': '1FAA4', // 🪤
  '乗る|のる': '1F68C', // 🚌
  '乗せる|のせる': '1F695', // 🚕
  '降りる|おりる': '1F68F', // 🚏
  '降ろす|おろす': '2B07', // ⬇️
  '直る|なおる': '2705', // ✅
  '直す|なおす': '1F527', // 🔧
  '治る|なおる': '1F4AA', // 💪
  '治す|なおす': '1F48A', // 💊
  '亡くなる|なくなる': '1F56F', // 🕯️
  '亡くす|なくす': '1F494', // 💔
  '生まれる|うまれる': '1F476', // 👶
  '生む|うむ': '1F930', // 🤰
  '出会う|であう': '1F91D', // 🤝
  '訪ねる|たずねる': '1F6AA', // 🚪
  '付き合う|つきあう': '1F491', // 💑
  '効く|きく': '1F4AF', // 💯
  'はやる|': '1F525', // 🔥
  '経つ|たつ': '23F3', // ⏳
  '間に合う|まにあう': '23F0', // ⏰
  '間に合わせる|まにあわせる': '23F1', // ⏱️
  '通う|かよう': '1F392', // 🎒
  '込む|こむ': '1F687', // 🚇
  'すれ違う|すれちがう': '1F500', // 🔀
  '掛かる|かかる': '1F5BC', // 🖼️
  '掛ける|かける': '1FA9D', // 🪝
  '動く|うごく': '1F3C3', // 🏃
  '動かす|うごかす': '1F69A', // 🚚
  '離れる|はなれる': '2194', // ↔️
  '離す|はなす': '2702', // ✂️
  'ぶつかる|': '1F4A5', // 💥
  'ぶつける|': '1F3B3', // 🎳
  'こぼれる|': '1F4A6', // 💦
  'こぼす|': '1FAD7', // 🫗
  'ふく|': '1F9FD', // 🧽
  '片付く|かたづく': '2728', // ✨
  '片付ける|かたづける': '1F9F9', // 🧹
  '包む|つつむ': '1F381', // 🎁
  '張る|はる': '1FA79', // 🩹
  '無くなる|なくなる': '1F573', // 🕳️
  '無くす|なくす': '1F5DD', // 🗝️
  '足りる|たりる': '1F44C', // 👌
  '残る|のこる': '1F961', // 🥡
  '残す|のこす': '1F35A', // 🍚
  '腐る|くさる': '1F922', // 🤢
  'むける|': '1F34C', // 🍌
};

export function vocabImageKey(word: Pick<VocabularyWord, 'japanese' | 'reading'>): string {
  return `${word.japanese.trim()}|${word.reading.trim()}`;
}

/**
 * Bản offline (`npm run build:offline`) là MỘT file HTML mở bằng file:// — không có thư
 * mục hình đi kèm. Tắt hình ở đó thay vì vẽ ra một loạt ảnh hỏng, như phát âm.
 */
const IMAGES_AVAILABLE = typeof location === 'undefined' || location.protocol !== 'file:';

/** Đường dẫn hình của một từ (tương đối theo `<base href>`), hoặc null nếu từ chưa có hình. */
export function vocabImageOf(word: Pick<VocabularyWord, 'japanese' | 'reading'>): string | null {
  if (!IMAGES_AVAILABLE) return null;
  const code = VOCAB_IMAGES[vocabImageKey(word)];
  return code ? `${VOCAB_IMAGE_PATH}${code}.svg` : null;
}
