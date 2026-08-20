/**
 * Âm Hán Việt VIẾT TAY — phần duy nhất của khu Kanji không rút được từ kho từ.
 *
 * Đường đi bình thường: `scripts/generate-kanji.mjs` suy âm của từng chữ từ chính
 * nguồn từ vựng, bằng cách căn âm tiết của âm Hán Việt cả từ với các chữ Hán trong
 * từ ("会社員 → HỘI XÃ VIÊN" ⇒ 会=HỘI, 社=XÃ, 員=VIÊN). Cách đó lo được phần lớn.
 *
 * File này lo hai chỗ đường đó không tới được:
 *
 *  1. `HAN_VIET_SUPPLEMENT` — chữ nằm trong danh sách JLPT (`kanji-levels.ts`)
 *     nhưng kho từ của ứng dụng KHÔNG có từ nào chứa nó, hoặc chỉ có trong câu ví
 *     dụ / trong bộ động từ khu Bài tập (nguồn đó không có cột âm Hán Việt).
 *
 *  2. `HAN_VIET_FIX` — chữ mà nguồn nói HAI kiểu khác nhau và cái sai lại nhiều
 *     phiếu hơn.
 *
 * Cả hai đều là chữ tôi viết ra, KHÔNG lấy từ file nguồn người dùng chỉ định. Để
 * riêng một file, gom theo cấp, dễ soát bằng mắt. Thêm từ chứa các chữ này vào
 * `data-source/` rồi chạy lại script thì script sẽ báo dòng ở đây đã thừa.
 *
 * Chạy `npm run generate:kanji` để xem còn chữ nào thiếu.
 */

export const HAN_VIET_SUPPLEMENT: Readonly<Record<string, string>> = {
  // ── N5: 13 chữ ────────────────────────────────────────────────────────
  // Chữ số viết bằng kanji và vài chữ cơ bản — giáo trình dùng chữ số nửa/toàn
  // chiều (１日, ２人) nên chúng không có mặt trong kho từ.
  八: 'BÁT',
  六: 'LỤC',
  三: 'TAM',
  九: 'CỬU',
  七: 'THẤT',
  五: 'NGŨ',
  円: 'VIÊN',
  竹: 'TRÚC',
  岩: 'NHAM',
  林: 'LÂM',
  森: 'SÂM',
  貝: 'BỐI',
  // 畑 là chữ người Nhật tự đặt (kokuji), không có gốc Hán nên không có âm Hán
  // Việt thật; các bảng tra tiếng Việt quen đọc là ĐIỀN theo chữ 田.
  畑: 'ĐIỀN',

  // ── N4: 11 chữ ────────────────────────────────────────────────────────
  毛: 'MAO',
  刀: 'ĐAO',
  王: 'VƯƠNG',
  虫: 'TRÙNG',
  雲: 'VÂN',
  飯: 'PHẠN',
  才: 'TÀI',
  府: 'PHỦ',
  同: 'ĐỒNG',
  区: 'KHU',
  衣: 'Y',

  // ── N3: 115 chữ không có trong kho từ ─────────────────────────────────
  匹: 'THẤT',
  面: 'DIỆN',
  厚: 'HẬU',
  在: 'TẠI',
  肯: 'KHẲNG',
  念: 'NIỆM',
  伸: 'THÂN',
  氷: 'BĂNG',
  永: 'VĨNH',
  位: 'VỊ',
  昨: 'TẠC',
  級: 'CẤP',
  容: 'DUNG',
  側: 'TRẮC',
  等: 'ĐẲNG',
  副: 'PHÓ',
  福: 'PHÚC',
  富: 'PHÚ',
  想: 'TƯỞNG',
  血: 'HUYẾT',
  判: 'PHÁN',
  検: 'KIỂM',
  皮: 'BÌ',
  仕: 'SĨ',
  幼: 'ẤU',
  粉: 'PHẤN',
  貧: 'BẦN',
  良: 'LƯƠNG',
  根: 'CĂN',
  効: 'HIỆU',
  算: 'TOÁN',
  仏: 'PHẬT',
  争: 'TRANH',
  軍: 'QUÂN',
  求: 'CẦU',
  種: 'CHỦNG',
  柱: 'TRỤ',
  坂: 'BẢN',
  板: 'BẢN',
  痛: 'THỐNG',
  告: 'CÁO',
  律: 'LUẬT',
  税: 'THUẾ',
  童: 'ĐỒNG',
  個: 'CÁ',
  河: 'HÀ',
  翌: 'DỰC',
  兵: 'BINH',
  央: 'ƯƠNG',
  帯: 'ĐỚI',
  婦: 'PHỤ',
  液: 'DỊCH',
  未: 'VỊ',
  罪: 'TỘI',
  鼻: 'TỴ',
  各: 'CÁC',
  路: 'LỘ',
  努: 'NỖ',
  干: 'CAN',
  職: 'CHỨC',
  列: 'LIỆT',
  観: 'QUAN',
  戦: 'CHIẾN',
  任: 'NHIỆM',
  浅: 'THIỂN',
  兆: 'TRIỆU',
  包: 'BAO',
  補: 'BỔ',
  他: 'THA',
  構: 'CẤU',
  底: 'ĐỂ',
  希: 'HY',
  示: 'THỊ',
  倍: 'BỘI',
  演: 'DIỄN',
  率: 'SUẤT',
  老: 'LÃO',
  冊: 'SÁCH',
  編: 'BIÊN',
  望: 'VỌNG',
  農: 'NÔNG',
  豊: 'PHONG',
  期: 'KỲ',
  欠: 'KHIẾM',
  査: 'TRA',
  商: 'THƯƠNG',
  欧: 'ÂU',
  労: 'LAO',
  豆: 'ĐẬU',
  突: 'ĐỘT',
  深: 'THÂM',
  疑: 'NGHI',
  州: 'CHÂU',
  流: 'LƯU',
  器: 'KHÍ',
  第: 'ĐỆ',
  費: 'PHÍ',
  戸: 'HỘ',
  能: 'NĂNG',
  舟: 'CHU',
  程: 'TRÌNH',
  綿: 'MIÊN',
  型: 'HÌNH',
  否: 'PHỦ',
  満: 'MÃN',
  逆: 'NGHỊCH',
  追: 'TRUY',
  旧: 'CỰU',
  児: 'NHI',
  度: 'ĐỘ',
  担: 'ĐẢM',
  巨: 'CỰ',
  臣: 'THẦN',
  候: 'HẬU',
  解: 'GIẢI',

  // ── Chữ CÓ trong kho từ nhưng nguồn không nói âm ──────────────────────
  // Chỉ xuất hiện trong bộ động từ khu Bài tập (nguồn không có cột âm Hán Việt),
  // hoặc chỉ nằm trong câu ví dụ chứ không phải một mục từ vựng. Các chữ cùng
  // cảnh ngộ mà KHÔNG nằm trong danh sách N5→N3 thì không khai ở đây: khu Kanji
  // không hiện chúng, script sẽ báo dòng thừa.
  喜: 'HỶ',
  怒: 'NỘ',
  移: 'DI',
  光: 'QUANG',
  断: 'ĐOẠN',
  的: 'ĐÍCH',
  進: 'TIẾN',
};

/**
 * SỬA những chỗ nguồn tự mâu thuẫn — bản này thắng cả phiếu đa số.
 *
 * Khác `HAN_VIET_SUPPLEMENT` (nguồn KHÔNG nói gì), đây là các chữ mà nguồn nói HAI
 * kiểu khác nhau, và cái sai lại nhiều phiếu hơn. Mỗi dòng ghi rõ dòng nguồn đang
 * lệch để sau này soát lại.
 *
 * Sửa thẳng ở `data-source/` mới là cách dứt điểm; sửa xong chạy lại script thì nó
 * sẽ báo dòng ở đây đã thừa. Không tự sửa file nguồn vì nguồn là bản chép từ PDF
 * người dùng chỉ định — đổi nội dung nguồn là việc của người dùng.
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
