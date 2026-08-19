/**
 * Âm Hán Việt BỔ SUNG — viết tay, chỉ cho những chữ mà kho từ không suy ra được.
 *
 * Gần như toàn bộ âm Hán Việt của khu Kanji được `scripts/generate-kanji.mjs` rút
 * thẳng từ nguồn từ vựng: nguồn ghi âm cho cả từ ("会社員 → HỘI XÃ VIÊN") nên căn
 * âm tiết với chữ Hán là ra âm của từng chữ. 815/836 chữ có âm theo đường đó.
 *
 * Còn lại 21 chữ dưới đây thì không, vì chúng chỉ xuất hiện trong bộ động từ của
 * khu Bài tập (`core/exercises/`) — nguồn đó không có cột âm Hán Việt — hoặc chỉ
 * nằm trong câu ví dụ chứ không phải một mục từ vựng.
 *
 * ĐÂY LÀ DỮ LIỆU DUY NHẤT TRONG KHU KANJI KHÔNG TỚI TỪ NGUỒN GỐC. Để riêng một
 * file, ngắn, dễ soát và dễ sửa. Nếu có nguồn chính thức cho các chữ này thì thêm
 * từ chứa chúng vào `data-source/` rồi chạy lại script: script sẽ tự suy ra âm và
 * cảnh báo rằng dòng ở đây đã thừa.
 *
 * Chạy `npm run generate:kanji` để xem còn chữ nào thiếu.
 */

export const HAN_VIET_SUPPLEMENT: Readonly<Record<string, string>> = {
  // Chỉ có trong bộ động từ khu Bài tập
  喜: 'HỶ',
  怒: 'NỘ',
  抜: 'BẠT',
  溶: 'DUNG',
  移: 'DI',
  光: 'QUANG',
  喋: 'ĐIỆP',
  噛: 'GIẢO',
  慢: 'MẠN',
  我: 'NGÃ',
  断: 'ĐOẠN',
  致: 'TRÍ',
  訪: 'PHỎNG',
  諦: 'ĐẾ',
  驚: 'KINH',

  // Có trong giáo trình nhưng chỉ nằm trong câu ví dụ, hoặc ở mục mà số âm tiết
  // của cột Hán Việt không khớp số chữ Hán (世界的に → "THẾ GIỚI", thiếu âm của 的)
  的: 'ĐÍCH',
  貼: 'THIẾP',
  鍵: 'KIỆN',
  沸: 'PHẤT',
  混: 'HỖN',
  進: 'TIẾN',
};

/**
 * SỬA những chỗ nguồn tự mâu thuẫn — bản này thắng cả phiếu đa số.
 *
 * Khác `HAN_VIET_SUPPLEMENT` ở trên (chữ nguồn KHÔNG nói gì), đây là các chữ mà
 * nguồn nói HAI kiểu khác nhau, và cái sai lại nhiều phiếu hơn. Mỗi dòng ghi rõ
 * dòng nguồn đang lệch để sau này soát lại.
 *
 * Sửa thẳng ở `data-source/` mới là cách dứt điểm; sửa xong chạy lại script thì
 * nó sẽ báo dòng ở đây đã thừa. Không tự sửa file nguồn ở đây vì nguồn là bản
 * chép từ PDF người dùng chỉ định — đổi nội dung nguồn là việc của người dùng.
 *
 * Nhiều âm thì ngăn bằng '/', âm đầu là âm chính.
 */
export const HAN_VIET_FIX: Readonly<Record<string, string>> = {
  // bài 12 ghi "THÍ NGHIỆM,試験" (đúng), nhưng bài 21/31/32/36 ghi "THỨC HỢP,試合"
  // và "THỨC NGHIỆM..." — 5 phiếu THỨC thắng 1 phiếu THÍ, mà THÍ mới đúng.
  試: 'THÍ',
  // bài 13 ghi "VĨNH,泳ぎます", bài 36 ghi "THỦY VỊNH,水泳" — hoà 1-1, VỊNH đúng.
  泳: 'VỊNH',
  // bài 22 ghi "BỘ ÓC,部屋" — lệch dấu so với "BỔN ỐC,本屋" và hai chỗ khác.
  屋: 'ỐC',
  // bài 34 ghi "TẢY..." một lần, bốn chỗ khác đều "TẨY".
  洗: 'TẨY',
  // bài 6 ghi "BỘ PHÂN,自分で", trong khi hai chỗ khác ghi "TỰ PHÂN,自分".
  自: 'TỰ',
  // một chỗ ghi "PHẢN" cho 変, bốn chỗ khác đều "BIẾN".
  変: 'BIẾN',
};
