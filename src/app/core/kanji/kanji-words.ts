/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy `npm run generate:kanji` để sinh lại.
 *
 * Nguồn: kho từ có sẵn của ứng dụng (`data-source/minano-nihongo-*` và
 * `core/exercises/`). Âm Hán Việt của từng chữ suy ra bằng cách căn âm tiết của
 * âm Hán Việt cả từ với các chữ Hán trong từ — xem `scripts/generate-kanji.mjs`.
 *
 * Thống kê lần sinh gần nhất: 836 chữ (N5=495 N4=325 N3=16), 2339 lượt từ.
 */

import type { KanjiSeed } from './kanji.model';

export const KANJI_SEEDS: readonly KanjiSeed[] = [
  ['日', 'NHẬT', '', 'N5', [
    ['日', 'ひ', 'NHẬT', 'Ngày', 'N5'],
    ['日本', 'にほん', 'NHẬT BẢN', 'Nhật Bản', 'N5'],
    ['毎日', 'まいにち', 'MỖI NHẬT', 'Hàng ngày, mỗi ngày', 'N5'],
    ['１日', 'ついたち', 'NHẬT', 'ngày mồng 1', 'N5'],
    ['２日', 'ふつか', 'NHẬT', 'ngày mồng 2, 2 ngày', 'N5'],
    ['３日', 'みっか', 'NHẬT', 'ngày mồng 3, 3 ngày', 'N5'],
    ['４日', 'よっか', 'NHẬT', 'ngày mồng 4, 4 ngày', 'N5'],
    ['５日', 'いつか', 'NHẬT', 'ngày mồng 5, 5 ngày', 'N5'],
    ['６日', 'むいか', 'NHẬT', 'ngày mồng 6, 6 ngày', 'N5'],
    ['７日', 'なのか', 'NHẬT', 'ngày mồng 7, 7 ngày', 'N5'],
    ['８日', 'ようか', 'NHẬT', 'ngày mồng 8, 8 ngày', 'N5'],
    ['９日', 'ここのか', 'NHẬT', 'ngày mồng 9, 9 ngày', 'N5'],
    ['何日', 'なんにち', 'HÀ NHẬT', 'nhiêu, mấy ngày, bao nhiêu ngày', 'N5'],
    ['日記', 'にっき', 'NHẬT KÝ', 'Nhật ký', 'N5'],
    ['日本語', 'にほんご', 'NHẬT BẢN NGỮ', 'Tiếng Nhật', 'N5'],
    ['何曜日', 'なんようび', 'HÀ DIỆU NHẬT', 'Thứ mấy', 'N5'],
    ['土曜日', 'どようび', 'THỔ DIỆU NHẬT', 'Thứ bảy', 'N5'],
    ['日曜日', 'にちようび', 'NHẬT DIỆU NHẬT', 'Chủ Nhật', 'N5'],
    ['月曜日', 'げつようび', 'NGUYỆT DIỆU NHẬT', 'Thứ hai', 'N5'],
    ['木曜日', 'もくようび', 'MỘC DIỆU NHẬT', 'Thứ năm', 'N5'],
    ['水曜日', 'すいようび', 'THỦY DIỆU NHẬT', 'Thứ tư', 'N5'],
    ['火曜日', 'かようび', 'HỎA DIỆU NHẬT', 'Thứ ba', 'N5'],
    ['金曜日', 'きんようび', 'KIM DIỆU NHẬT', 'Thứ sáu', 'N5'],
    ['１０日', 'とおか', 'NHẬT', 'ngày mồng 10, 10 ngày', 'N5'],
    ['１４日', 'じゅうよっか', 'NHẬT', 'ngày 14, 14 ngày', 'N5'],
    ['２０日', 'はつか', 'NHẬT', 'ngày 20, 20 ngày', 'N5'],
    ['２４日', 'にじゅうよっか', 'NHẬT', 'ngày 24, 24 ngày', 'N5'],
    ['誕生日', 'たんじょうび', 'ĐẢN SINH NHẬT', 'sinh nhật', 'N5'],
    ['母の日', 'ははのひ', 'MẪU NHẬT', 'Ngày của Mẹ', 'N5'],
    ['日本にいます', 'にほんにいます', 'NHẬT BẢN', 'ở Nhật', 'N5'],
    ['明日', 'あした', 'MINH NHẬT', 'ngày mai', 'N4'],
    ['先日', 'せんじつ', 'TIÊN NHẬT', 'hôm trước/ mấy hôm trước', 'N4'],
    ['日にち', 'ひにち', 'NHẬT', 'ngày', 'N4'],
    ['本日休業', 'ほんじつきゅうぎょう', 'BẢN NHẬT HƯU NGHIỆP', 'hôm nay nghỉ/ hôm nay đóng cửa', 'N4'],
  ]],
  ['人', 'NHÂN', '', 'N5', [
    ['人', 'ひと', 'NHÂN', 'người', 'N5'],
    ['主人', 'しゅじん', 'CHỦ NHÂN', 'chồng', 'N5'],
    ['～人', '～にん', 'NHÂN', '～ người', 'N5'],
    ['１人', 'ひとり', 'NHÂN', 'một người', 'N5'],
    ['２人', 'ふたり', 'NHÂN', 'hai người', 'N5'],
    ['あの人', 'あのひと', 'NHÂN', 'Người kia, người đó', 'N5'],
    ['～人で', 'ひとりで', 'NHẤT NHÂN', 'một mình', 'N5'],
    ['女の人', 'おんなのひと', 'NỮ NHÂN', 'người đàn bà', 'N5'],
    ['男の人', 'おとこのひと', 'NAM NHÂN', 'người đàn ông', 'N5'],
    ['人が多い', 'ひとがおおい', 'NHÂN ĐA', 'Nhiều người', 'N5'],
    ['人が少ない', 'ひとがすくない', 'NHÂN THIỂU', 'Ít người', 'N5'],
    ['人を送ります', 'ひとをおくります', 'NHÂN TỐNG', 'Đưa đi, đưa đến, tiễn một ai đó', 'N5'],
    ['人気', 'にんき', 'NHÂN KHÍ', 'sự hâm mộ/ sự nổi tiếng', 'N4'],
    ['人形', 'にんぎょう', 'NHÂN HÌNH', 'con búp bê/ con rối', 'N4'],
    ['恋人', 'こいびと', 'LUYẾN NHÂN', 'người yêu', 'N4'],
    ['大人', 'おとな', 'ĐẠI NHÂN', 'người lớn', 'N4'],
    ['犯人', 'はんにん', 'PHẠM NHÂN', 'thủ phạm', 'N4'],
    ['人口', 'じんこう', 'NHÂN KHẨU', 'dân số', 'N4'],
    ['主人公', 'しゅじんこう', 'CHỦ NHÂN CÔNG', 'nhân vật chính', 'N4'],
    ['管理人', 'かんりにん', 'QUẢN LÝ NHÂN', 'người quản lý', 'N4'],
    ['成人式', 'せいじんしき', 'THÀNH NHÂN THỨC', 'Lễ thành nhân', 'N4'],
    ['人が別れます', 'ひとがわかれます', 'NHÂN BIỆT', 'người chia tay/ chia ra', 'N4'],
    ['人が集まります', 'ひとがあつまります', 'NHÂN TẬP', 'người tụ tập/ mọi người tập trung', 'N4'],
  ]],
  ['会', 'HỘI', '', 'N5', [
    ['会社', 'かいしゃ', 'HỘI XÃ', 'công ty', 'N5'],
    ['会う', 'あう', 'HỘI', 'gặp', 'N5'],
    ['会議', 'かいぎ', 'HỘI NGHỊ', 'họp, cuộc họp', 'N5'],
    ['会社員', 'かいしゃいん', 'HỘI XÃ VIÊN', 'Nhân viên công ty', 'N5'],
    ['会議室', 'かいぎしつ', 'HỘI NGHỊ THẤT', 'phòng họp', 'N5'],
    ['会います', 'あいます', '', 'gặp', 'N5'],
    ['会社を休みます', 'かいしゃをやすみます', 'HỘI XÃ', 'nghỉ làm việc', 'N5'],
    ['会社をやめます', 'かいしゃをやめます', 'HỘI XÃ', 'Bỏ, thôi việc công ty', 'N5'],
    ['会話', 'かいわ', 'HỘI THOẠI', 'hội thoại', 'N4'],
    ['教会', 'きょうかい', 'GIÁO HỘI', 'nhà thờ', 'N4'],
    ['機会', 'きかい', 'CƠ HỘI', 'cơ hội', 'N4'],
    ['大会', 'たいかい', 'ĐẠI HỘI', 'đại hội/ cuộc thi', 'N4'],
    ['会員', 'かいいん', 'HỘI VIÊN', 'hội viên/ thành viên', 'N4'],
    ['会場', 'かいじょう', 'HỘI TRƯỜNG', 'hội trường', 'N4'],
    ['～会社', '～かいしゃ', 'HỘI XÃ', 'công ty ~', 'N4'],
    ['運動会', 'うんどうかい', 'VẬN ĐỘNG HỘI', 'hội thao/ đại hội thể thao', 'N4'],
    ['展覧会', 'てんらんかい', 'TRIỂN LÃM HỘI', 'triển lãm', 'N4'],
    ['二次会', 'にじかい', 'NHỊ THỨ HỘI', 'tiệc tăng hai/ bữa tiệc thứ hai', 'N4'],
    ['忘年会', 'ぼうねんかい', 'VONG NIÊN HỘI', 'tiệc tất niên', 'N4'],
    ['新年会', 'しんねんかい', 'TÂN NIÊN HỘI', 'tiệc tân niên', 'N4'],
    ['会社に勤めます', 'かいしゃにつとめます', 'HỘI XÃ CẦN', 'làm việc ở công ty', 'N4'],
    ['会議に出席します', 'かいぎにしゅっせきします', 'HỘI NGHỊ XUẤT TỊCH', 'tham dự cuộc họp/ tham gia cuộc họp', 'N4'],
  ]],
  ['出', 'XUẤT', '', 'N5', [
    ['出ます', 'でます', '', 'ra/ đi ra', 'N5'],
    ['出します', 'だします', 'XUẤT', 'Lấy ra, rút (tiền)', 'N5'],
    ['出かけます', 'でかけます', 'XUẤT', 'Ra ngoài', 'N5'],
    ['出張します', 'しゅっちょうします', 'XUẤT TRƯƠNG', 'Đi công tác', 'N5'],
    ['思い出します', 'おもいだします', 'TƯ XUẤT', 'Nhớ lại, hồi tưởng', 'N5'],
    ['大学を出ます', 'だいがくをでます', 'ĐẠI HỌC XUẤT', 'Ra, tốt nghiệp đại học', 'N5'],
    ['喫茶店を出ます', 'きっさてんをでます', 'KHIẾT TRÀ ĐIẾM XUẤT', 'ra khỏi quán giải khát', 'N5'],
    ['手紙を出します', 'てがみをだします', 'THỦ CHỈ XUẤT', 'gửi thư', 'N5'],
    ['お釣りが出ます', 'おつりがでます', 'ĐIẾU XUẤT', 'Ra, đi ra tiền thừa', 'N5'],
    ['お引き出しですか', 'おひきだしですか', 'DẪN XUẤT', 'Anh/ chị rút tiền ạ?', 'N5'],
    ['レポートを出します', 'レポートをだします', 'XUẤT', 'Nộp bản báo cáo', 'N5'],
    ['出口', 'でぐち', 'XUẤT KHẨU', 'lối ra/ cửa ra', 'N4'],
    ['引き出し', 'ひきだし', 'DẪN XUẤT', 'ngăn kéo', 'N4'],
    ['輸出します', 'ゆしゅつします', 'THÂU XUẤT', 'xuất khẩu', 'N4'],
    ['出発します', 'しゅっぱつします', 'XUẤT PHÁT', 'xuất phát/ khởi hành', 'N4'],
    ['本が出ます', 'ほんがでます', 'BẢN XUẤT', 'sách được xuất bản', 'N4'],
    ['試合に出ます', 'しあいにでます', 'THỨC HỢP XUẤT', 'tham gia trận đấu/ ra sân thi đấu', 'N4'],
    ['バスが出ます', 'バスがでます', 'XUẤT', 'xe buýt xuất phát/ xe chạy', 'N4'],
    ['熱を出します', 'ねつをだします', 'NHIỆT XUẤT', 'bị sốt', 'N4'],
    ['輸出が増えます', 'ゆしゅつがふえます', 'THÂU XUẤT TĂNG', 'xuất khẩu tăng lên', 'N4'],
    ['輸出が減ります', 'ゆしゅつがへります', 'THÂU XUẤT GIẢM', 'xuất khẩu giảm xuống', 'N4'],
    ['会議に出席します', 'かいぎにしゅっせきします', 'HỘI NGHỊ XUẤT TỊCH', 'tham dự cuộc họp/ tham gia cuộc họp', 'N4'],
  ]],
  ['電', 'ĐIỆN', '', 'N5', [
    ['電気', 'でんき', 'ĐIỆN KHÍ', 'Điện, Đèn điện', 'N5'],
    ['電話', 'でんわ', 'ĐIỆN THOẠI', 'máy điện thoại, điện thoại', 'N5'],
    ['電車', 'でんしゃ', 'ĐIỆN XA', 'tàu điện', 'N5'],
    ['電池', 'でんち', 'ĐIỆN TRÌ', 'Pin', 'N5'],
    ['電気屋', 'でんきや', 'ĐIỆN KHÍ ỐC', 'Cửa hàng đồ điện', 'N5'],
    ['電話します', 'でんわします', 'ĐIỆN THOẠI', 'Gọi điện thoại', 'N5'],
    ['電車に乗ります', 'でんしゃにのります', 'ĐIỆN XA THỪA', 'Đi, lên tàu', 'N5'],
    ['電車を降ります', 'でんしゃをおります', 'ĐIỆN XA GIÁNG/HÀNG', 'Xuống tàu', 'N5'],
    ['電報', 'でんぽう', 'ĐIỆN BÁO', 'bức điện/ điện báo/ điện tín', 'N4'],
    ['電源', 'でんげん', 'ĐIỆN NGUYÊN', 'nguồn điện/ công tắc điện', 'N4'],
    ['電報代', 'でんぽうだい', 'ĐIỆN BÁO ĐẠI', 'tiền điện báo/ cước điện báo', 'N4'],
    ['電話代', 'でんわだい', 'ĐIỆN THOẠI ĐẠI', 'tiền điện thoại', 'N4'],
    ['今の電車', 'いまのでんしゃ', 'KIM ĐIỆN XA', 'đoàn tàu vừa rồi', 'N4'],
    ['電子メール', 'でんしメール', 'ĐIỆN TỬ', 'thư điện tử/ email', 'N4'],
    ['まちがい電話', 'まちがいでんわ', 'ĐIỆN THOẠI', 'điện thoại gọi nhầm', 'N4'],
    ['電気がつきます', 'でんきがつきます', 'ĐIỆN KHÍ', 'điện bật sáng', 'N4'],
    ['電気が消えます', 'でんきがきえます', 'ĐIỆN KHÍ TIÊU', 'điện tắt', 'N4'],
    ['電報を打ちます', 'でんぽうをうちます', 'ĐIỆN BÁO ĐẢ', 'đánh điện/ gửi điện báo', 'N4'],
    ['電源を入れます', 'でんげんをいれます', 'ĐIỆN NGUYÊN NHẬP', 'bật công tắc điện', 'N4'],
    ['電源を切ります', 'でんげんをきります', 'ĐIỆN NGUYÊN THIẾT', 'tắt công tắc điện', 'N4'],
    ['電話が掛かります', 'でんわがかかります', 'ĐIỆN THOẠI QUẢI', 'có điện thoại gọi đến', 'N4'],
  ]],
  ['気', 'KHÍ', '', 'N5', [
    ['電気', 'でんき', 'ĐIỆN KHÍ', 'Điện, Đèn điện', 'N5'],
    ['元気', 'げんき', 'NGUYÊN KHÍ', 'khỏe', 'N5'],
    ['天気', 'てんき', 'THIÊN KHÍ', 'Thời tiết', 'N5'],
    ['病気', 'びょうき', 'BỆNH KHÍ', 'ốm, bệnh', 'N5'],
    ['電気屋', 'でんきや', 'ĐIỆN KHÍ ỐC', 'Cửa hàng đồ điện', 'N5'],
    ['車に気をつけます', 'くるまにきをつけます', 'XA KHÍ', 'Chú ý, cẩn thận với ôtô', 'N5'],
    ['人気', 'にんき', 'NHÂN KHÍ', 'sự hâm mộ/ sự nổi tiếng', 'N4'],
    ['空気', 'くうき', 'KHÔNG KHÍ', 'không khí', 'N4'],
    ['気持ち', 'きもち', 'KHÍ TRÌ', 'cảm giác/ tâm trạng', 'N4'],
    ['重い病気', 'おもいびょうき', 'TRỌNG BỆNH KHÍ', 'bệnh nặng', 'N4'],
    ['天気予報', 'てんきよほう', 'THIÊN KHÍ DỰ BÁO', 'dự báo thời tiết', 'N4'],
    ['気分がいい', 'きぶんがいい', 'KHÍ PHÂN', 'thấy khỏe/ thấy dễ chịu/ tâm trạng tốt', 'N4'],
    ['気分が悪い', 'きぶんがわるい', 'KHÍ PHÂN ÁC', 'thấy khó chịu/ thấy mệt/ tâm trạng tệ', 'N4'],
    ['気持ちがいい', 'きもちがいい', 'KHÍ TRÌ', 'dễ chịu/ thoải mái', 'N4'],
    ['気持ちが悪い', 'きもちがわるい', 'KHÍ TRÌ ÁC', 'khó chịu', 'N4'],
    ['電気がつきます', 'でんきがつきます', 'ĐIỆN KHÍ', 'điện bật sáng', 'N4'],
    ['電気が消えます', 'でんきがきえます', 'ĐIỆN KHÍ TIÊU', 'điện tắt', 'N4'],
    ['病気が治ります', 'びょうきがなおります', 'BỆNH KHÍ TRỊ', 'khỏi bệnh/ bệnh khỏi', 'N4'],
    ['忘れ物に気がつきます', 'わすれものにきがつきます', 'VONG VẬT KHÍ', 'phát hiện ra đồ bỏ quên', 'N4'],
    ['お元気でいらっしゃいますか', 'おげんきでいらっしゃいますか', 'NGUYÊN KHÍ', 'Anh/chị có khỏe không ạ?', 'N4'],
  ]],
  ['物', 'VẬT', '', 'N5', [
    ['物', 'もの', 'VẬT', 'vật, đồ vật', 'N5'],
    ['果物', 'くだもの', 'QUẢ VẬT', 'hoa quả, trái cây', 'N5'],
    ['荷物', 'にもつ', 'HÀ VẬT', 'đồ đạc, hành lý', 'N5'],
    ['動物', 'どうぶつ', 'ĐỘNG VẬT', 'Động vật', 'N5'],
    ['物価', 'ぶっか', 'VẬT GIÁ', 'Giá cả, mức giá, vật giá', 'N5'],
    ['着物', 'きもの', 'TRƯỚC VẬT', 'Kimono', 'N5'],
    ['建物', 'たてもの', 'KIẾN VẬT', 'Tòa nhà', 'N5'],
    ['食べ物', 'たべもの', 'THỰC VẬT', 'đồ ăn', 'N5'],
    ['飲み物', 'のみもの', 'ẨM VẬT', 'đồ uống', 'N5'],
    ['買い物します', 'かいものします', 'MÃI VẬT', 'mua hàng', 'N5'],
    ['品物', 'しなもの', 'PHẨM VẬT', 'hàng hóa/ mặt hàng', 'N4'],
    ['忘れ物', 'わすれもの', 'VONG VẬT', 'vật để quên', 'N4'],
    ['動物園', 'どうぶつえん', 'ĐỘNG VẬT VIÊN', 'vườn thú/ vườn bách thú', 'N4'],
    ['乗り物', 'のりもの', 'THỪA VẬT', 'phương tiện đi lại', 'N4'],
    ['洗濯物', 'せんたくもの', 'TẨY TRẠC VẬT', 'quần áo giặt', 'N4'],
    ['贈り物', 'おくりもの', 'TẶNG VẬT', 'quà tặng', 'N4'],
    ['荷物が届きます', 'にもつがとどきます', 'HÀ VẬT GIỚI', 'hành lý được gửi đến', 'N4'],
    ['荷物が落ちます', 'にもつがおちます', 'HÀ VẬT LẠC', 'hành lý bị rơi', 'N4'],
    ['荷物が片付きます', 'にもつがかたづきます', 'HÀ VẬT PHIẾN PHÓ', 'đồ đạc được dọn gọn/ đồ đạc được sắp xếp ngăn nắp', 'N4'],
    ['忘れ物に気がつきます', 'わすれものにきがつきます', 'VONG VẬT KHÍ', 'phát hiện ra đồ bỏ quên', 'N4'],
  ]],
  ['大', 'ĐẠI', '', 'N5', [
    ['大学', 'だいがく', 'ĐẠI HỌC', 'Đại học, Trường đại học', 'N5'],
    ['大変', 'たいへん', 'ĐẠI BIẾN', 'vất vả, khó khăn, khổ', 'N5'],
    ['大切', 'たいせつ', 'ĐẠI THIẾT', 'Quan trọng, quý giá', 'N5'],
    ['大きい', 'おおきい', 'ĐẠI', 'lớn, to', 'N5'],
    ['大丈夫', 'だいじょうぶ', 'ĐẠI TRƯỢNG PHU', 'Không sao, không có vấn đề gì', 'N5'],
    ['大統領', 'だいとうりょう', 'ĐẠI THỐNG LÃNH', 'Tổng thống', 'N5'],
    ['大使館', 'たいしかん', 'ĐẠI SỨ QUÁN', 'đại sứ quán', 'N5'],
    ['大学を出ます', 'だいがくをでます', 'ĐẠI HỌC XUẤT', 'Ra, tốt nghiệp đại học', 'N5'],
    ['大学に入ります', 'だいがくにはいります', 'ĐẠI HỌC NHẬP', 'Vào, nhập học đại học', 'N5'],
    ['大人', 'おとな', 'ĐẠI NHÂN', 'người lớn', 'N4'],
    ['大勢', 'おおぜい', 'ĐẠI THẾ', 'nhiều người', 'N4'],
    ['大会', 'たいかい', 'ĐẠI HỘI', 'đại hội/ cuộc thi', 'N4'],
    ['大好き', 'だいすき', 'ĐẠI HẢO', 'rất thích/ thích lắm', 'N4'],
    ['大学院', 'だいがくいん', 'ĐẠI HỌC VIỆN', 'cao học/ sau đại học', 'N4'],
    ['大きさ', 'おおきさ', 'ĐẠI', 'cỡ/ kích thước', 'N4'],
    ['大学生', 'だいがくせい', 'ĐẠI HỌC SINH', 'sinh viên đại học', 'N4'],
    ['大学に通います', 'だいがくにかよいます', 'ĐẠI HỌC THÔNG', 'đi đi về về trường đại học', 'N4'],
    ['大学に入学します', 'だいがくににゅうがくします', 'ĐẠI HỌC NHẬP HỌC', 'nhập học/ vào đại học', 'N4'],
    ['大学を卒業します', 'だいがくをそつぎょうします', 'ĐẠI HỌC TỐT NGHIỆP', 'tốt nghiệp đại học', 'N4'],
  ]],
  ['子', 'TỬ', 'TÝ', 'N5', [
    ['調子', 'ちょうし', 'ĐIỀU TỬ', 'Tình trạng, trạng thái', 'N5'],
    ['帽子', 'ぼうし', 'MẠO TỬ', 'Mũ', 'N5'],
    ['子ども', 'こども', 'TỬ', 'con cái', 'N5'],
    ['女の子', 'おんなのこ', 'NỮ TỬ', 'cô con gái', 'N5'],
    ['男の子', 'おとこのこ', 'NAM TỬ', 'cậu con trai', 'N5'],
    ['お菓子', 'おかし', 'QUẢ TỬ', 'Bánh kẹo', 'N5'],
    ['調子がいい', 'ちょうしがいい', 'ĐIỀU TỬ', 'Trong tình trạng tốt', 'N5'],
    ['子供がいます', 'こどもがいます', 'TỬ CUNG', 'có con', 'N5'],
    ['調子がわるい', 'ちょうしがわるい', 'ĐIỀU TỬ', 'Trong tình trạng xấu', 'N5'],
    ['帽子をかぶります', 'ぼうしをかぶります', 'MẠO TỬ', 'Đội mũ', 'N5'],
    ['息子', 'むすこ', 'TỨC TỬ', 'con trai', 'N4'],
    ['双子', 'ふたご', 'SONG TỬ', 'cặp sinh đôi', 'N4'],
    ['様子', 'ようす', 'DẠNG TỬ', 'vẻ/ tình hình', 'N4'],
    ['息子さん', 'むすこさん', 'TỨC TỬ', 'con trai (của người khác)', 'N4'],
    ['お子さん', 'おこさん', 'TỬ', 'con (của người khác)', 'N4'],
    ['子供たち', 'こどもたち', 'TỬ CUNG', 'trẻ em/ bọn trẻ', 'N4'],
    ['電子メール', 'でんしメール', 'ĐIỆN TỬ', 'thư điện tử/ email', 'N4'],
    ['子どもたち', 'こどもたち', 'TỬ/TÝ', 'trẻ em/ trẻ con/ con cái', 'N4'],
    ['親子どんぶり', 'おやこどんぶり', 'THÂN TỬ', 'món oyakodon (cơm gà trứng)', 'N4'],
  ]],
  ['学', 'HỌC', '', 'N5', [
    ['大学', 'だいがく', 'ĐẠI HỌC', 'Đại học, Trường đại học', 'N5'],
    ['学生', 'がくせい', 'HỌC SINH', 'Học sinh, sinh viên', 'N5'],
    ['学校', 'がっこう', 'HỌC HIỆU', 'trường học', 'N5'],
    ['留学生', 'りゅうがくせい', 'LƯU HỌC SINH', 'du học sinh', 'N5'],
    ['見学します', 'けんがくします', 'KIẾN HỌC', 'Thăm quan với mục đích học tập', 'N5'],
    ['留学します', 'りゅうがくします', 'LƯU HỌC', 'du học', 'N5'],
    ['大学を出ます', 'だいがくをでます', 'ĐẠI HỌC XUẤT', 'Ra, tốt nghiệp đại học', 'N5'],
    ['大学に入ります', 'だいがくにはいります', 'ĐẠI HỌC NHẬP', 'Vào, nhập học đại học', 'N5'],
    ['医学', 'いがく', 'Y HỌC', 'y học', 'N4'],
    ['文学', 'ぶんがく', 'VĂN HỌC', 'văn học', 'N4'],
    ['科学', 'かがく', 'KHOA HỌC', 'khoa học', 'N4'],
    ['大学院', 'だいがくいん', 'ĐẠI HỌC VIỆN', 'cao học/ sau đại học', 'N4'],
    ['科学者', 'かがくしゃ', 'KHOA HỌC GIẢ', 'nhà khoa học', 'N4'],
    ['中学校', 'ちゅうがっこう', 'TRUNG HỌC HIỆU', 'trường trung học cơ sở', 'N4'],
    ['小学校', 'しょうがっこう', 'TIỂU HỌC HIỆU', 'trường tiểu học', 'N4'],
    ['大学生', 'だいがくせい', 'ĐẠI HỌC SINH', 'sinh viên đại học', 'N4'],
    ['大学に通います', 'だいがくにかよいます', 'ĐẠI HỌC THÔNG', 'đi đi về về trường đại học', 'N4'],
    ['大学に入学します', 'だいがくににゅうがくします', 'ĐẠI HỌC NHẬP HỌC', 'nhập học/ vào đại học', 'N4'],
    ['大学を卒業します', 'だいがくをそつぎょうします', 'ĐẠI HỌC TỐT NGHIỆP', 'tốt nghiệp đại học', 'N4'],
  ]],
  ['入', 'NHẬP', '', 'N5', [
    ['押入れ', 'おしいれ', 'ÁP NHẬP', 'Chỗ để chăn gối', 'N5'],
    ['入れます', 'いれます', 'NHẬP', 'Cho vào, bỏ vào', 'N5'],
    ['入ります', 'はいります', '', 'vào', 'N5'],
    ['大学に入ります', 'だいがくにはいります', 'ĐẠI HỌC NHẬP', 'Vào, nhập học đại học', 'N5'],
    ['喫茶店に入ります', 'きっさてんにはいります', 'NHẬP', 'vào quán giải khát', 'N5'],
    ['おふろに入ります', 'おふろにはいります', 'NHẬP', 'Tắm bồn, vào bồn tắm', 'N5'],
    ['入口', 'いりぐち', 'NHẬP KHẨU', 'lối vào/ cửa vào', 'N4'],
    ['収入', 'しゅうにゅう', 'THÂU NHẬP', 'thu nhập', 'N4'],
    ['入管', 'にゅうかん', 'NHẬP QUẢN', 'Cục quản lý nhập cảnh', 'N4'],
    ['立入禁止', 'たちいりきんし', 'LẬP NHẬP CẤM CHỈ', 'cấm vào/ cấm vào khu vực này', 'N4'],
    ['輸入します', 'ゆにゅうします', 'THÂU NHẬP', 'nhập khẩu', 'N4'],
    ['入院します', 'にゅういんします', 'NHẬP VIỆN', 'nhập viện', 'N4'],
    ['入力します', 'にゅうりょくします', 'NHẬP LỰC', 'nhập (dữ liệu)', 'N4'],
    ['再入国ビザ', 'さいにゅうこくビザ', 'TÁI NHẬP QUỐC', 'thị thực tái nhập cảnh', 'N4'],
    ['手に入れます', 'てにいれます', 'THỦ NHẬP', 'có được/ lấy được', 'N4'],
    ['電源を入れます', 'でんげんをいれます', 'ĐIỆN NGUYÊN NHẬP', 'bật công tắc điện', 'N4'],
    ['大学に入学します', 'だいがくににゅうがくします', 'ĐẠI HỌC NHẬP HỌC', 'nhập học/ vào đại học', 'N4'],
    ['情報が手に入ります', 'じょうほうがてにはいります', 'TÌNH BÁO THỦ NHẬP', 'lấy được thông tin', 'N4'],
  ]],
  ['手', 'THỦ', '', 'N5', [
    ['手', 'て', 'THỦ', 'tay', 'N5'],
    ['手帳', 'てちょう', 'THỦ TRƯƠNG', 'Sổ tay', 'N5'],
    ['手紙', 'てがみ', 'THỦ CHỈ', 'thư', 'N5'],
    ['上手', 'じょうず', 'THƯỢNG THỦ', 'giỏi, khéo', 'N5'],
    ['下手', 'へた', 'HẠ THỦ', 'kém', 'N5'],
    ['切手', 'きって', 'THIẾT THỦ', 'tem', 'N5'],
    ['お手洗い', 'おてあらい', 'THỦ TẢY', 'nhà vệ sinh, phòng vệ sinh, toa-lét', 'N5'],
    ['手伝います', 'てつだいます', 'THỦ TRUYỀN', 'Giúp', 'N5'],
    ['手紙を出します', 'てがみをだします', 'THỦ CHỈ XUẤT', 'gửi thư', 'N5'],
    ['歌手', 'かしゅ', 'CA THỦ', 'ca sĩ', 'N4'],
    ['手袋', 'てぶくろ', 'THỦ ĐẠI', 'cái găng tay', 'N4'],
    ['相手', 'あいて', 'TƯỚNG THỦ', 'đối tác/ đối phương', 'N4'],
    ['上手に', 'じょうずに', 'THƯỢNG THỦ', 'giỏi/ khéo', 'N4'],
    ['運転手', 'うんてんしゅ', 'VẬN CHUYỂN THỦ', 'tài xế', 'N4'],
    ['手に入れます', 'てにいれます', 'THỦ NHẬP', 'có được/ lấy được', 'N4'],
    ['情報が手に入ります', 'じょうほうがてにはいります', 'TÌNH BÁO THỦ NHẬP', 'lấy được thông tin', 'N4'],
  ]],
  ['見', 'KIẾN', '', 'N5', [
    ['見る', 'みる', 'KIẾN', 'xem, nhìn, trông', 'N5'],
    ['意見', 'いけん', 'Ý KIẾN', 'Ý kiến', 'N5'],
    ['お花見', 'おはなみ', 'HOA KIẾN', 'việc ngắm hoa anh đào', 'N5'],
    ['見ます', 'みます', 'KIẾN', 'xem/ nhìn', 'N5'],
    ['見せます', 'みせます', 'KIẾN', 'Cho xem, trình', 'N5'],
    ['見学します', 'けんがくします', 'KIẾN HỌC', 'Thăm quan với mục đích học tập', 'N5'],
    ['お見合い', 'おみあい', 'KIẾN HỢP', 'xem mặt/ làm mối', 'N4'],
    ['お見舞い', 'おみまい', 'KIẾN VŨ', 'việc thăm người ốm', 'N4'],
    ['見えます', 'みえます', '', 'nhìn thấy được', 'N4'],
    ['見つけます', 'みつけます', 'KIẾN', 'tìm/ tìm thấy', 'N4'],
    ['発見します', 'はっけんします', 'PHÁT KIẾN', 'phát hiện/ tìm ra', 'N4'],
    ['拝見します', 'はいけんします', 'BÁI KIẾN', 'xem/ nhìn (khiêm nhường ngữ)', 'N4'],
    ['山が見えます', 'やまがみえます', 'SƠN/SAN KIẾN', 'có thể nhìn thấy núi', 'N4'],
    ['見つかります', 'みつかります', '', 'được tìm thấy', 'N4'],
    ['かぎが見つかります', 'かぎがみつかります', 'KIẾN', 'tìm thấy chìa khóa', 'N4'],
  ]],
  ['生', 'SINH', '', 'N5', [
    ['先生', 'せんせい', 'TIÊN SINH', 'Thầy/ cô', 'N5'],
    ['学生', 'がくせい', 'HỌC SINH', 'Học sinh, sinh viên', 'N5'],
    ['生活', 'せいかつ', 'SINH HOẠT', 'cuộc sống, sinh hoạt', 'N5'],
    ['誕生日', 'たんじょうび', 'ĐẢN SINH NHẬT', 'sinh nhật', 'N5'],
    ['生け花', 'いけばな', 'SINH HOA', 'Nghệ thuật cắm hoa', 'N5'],
    ['留学生', 'りゅうがくせい', 'LƯU HỌC SINH', 'du học sinh', 'N5'],
    ['生まれます', 'うまれます', 'SINH', 'Sinh ra', 'N5'],
    ['先生に聞きます', 'せんせいにききます', 'TIÊN SINH VĂN', 'Hỏi giáo viên', 'N5'],
    ['生徒', 'せいと', 'SINH ĐỒ', 'học sinh/ học trò', 'N4'],
    ['大学生', 'だいがくせい', 'ĐẠI HỌC SINH', 'sinh viên đại học', 'N4'],
    ['一生懸命', 'いっしょうけんめい', 'NHẤT SINH HUYỀN MỆNH', 'chăm chỉ/ miệt mài', 'N4'],
    ['生かします', 'いかします', 'SINH', 'tận dụng/ phát huy', 'N4'],
    ['長生きします', 'ながいきします', 'TRƯỜNG SINH', 'sống lâu', 'N4'],
    ['生みます', 'うみます', '', 'sinh ra/ đẻ ra', 'N3'],
  ]],
  ['何', 'HÀ', '', 'N5', [
    ['何', 'なん', 'HÀ', 'Cái gì, gì', 'N5'],
    ['何', 'なに', 'HÀ', 'cái gì, gì', 'N5'],
    ['何歳', 'なんさい', 'HÀ TUẾ', 'Mấy tuổi, bao nhiêu tuổi', 'N5'],
    ['何階', 'なんがい', 'HÀ GIAI', 'tầng mấy', 'N5'],
    ['何分', 'なんぷん', 'HÀ PHÂN', 'Mấy phút', 'N5'],
    ['何時', 'なんじ', 'HÀ THỜI', 'Mấy giờ', 'N5'],
    ['何番', 'なんばん', 'HÀ PHIÊN', 'Số bao nhiêu, số mấy', 'N5'],
    ['何日', 'なんにち', 'HÀ NHẬT', 'nhiêu, mấy ngày, bao nhiêu ngày', 'N5'],
    ['何月', 'なんがつ', 'HÀ NGUYỆT', 'tháng mấy', 'N5'],
    ['何か', 'なにか', 'HÀ', 'cái gì đó', 'N5'],
    ['何曜日', 'なんようび', 'HÀ DIỆU NHẬT', 'Thứ mấy', 'N5'],
    ['何回も', 'なんかいも', 'HÀ HỒI', 'Nhiều lần', 'N5'],
    ['何でも', 'なんでも', 'HÀ', 'cái gì cũng/ bất cứ thứ gì', 'N4'],
  ]],
  ['行', 'HÀNH', 'HÀNG', 'N5', [
    ['銀行', 'ぎんこう', 'NGÂN HÀNH', 'Ngân hàng', 'N5'],
    ['急行', 'きゅうこう', 'CẤP HÀNH', 'tàu tốc hành', 'N5'],
    ['旅行', 'りょこう', 'LỮ HÀNH', 'Du lịch, chuyến du lịch', 'N5'],
    ['銀行員', 'ぎんこういん', 'NGÂN HÀNH VIÊN', 'Nhân viên ngân hàng', 'N5'],
    ['飛行機', 'ひこうき', 'PHI HÀNH CƠ', 'máy bay', 'N5'],
    ['行きます', 'いきます', 'HÀNH', 'đi', 'N5'],
    ['旅行します', 'りょこうします', '', 'du lịch', 'N5'],
    ['持って行きます', 'もっていきます', 'TRÌ HÀNH', 'Mang đi, mang theo', 'N5'],
    ['連れて行きます', 'つれていきます', 'LIÊN HÀNH', 'Dẫn đi', 'N5'],
    ['旅行社', 'りょこうしゃ', 'LỮ HÀNH XÃ', 'công ty du lịch', 'N4'],
    ['夜行バス', 'やこうバス', 'DẠ HÀNH', 'xe buýt chạy đêm', 'N4'],
    ['行います', 'おこないます', 'HÀNH', 'thực hiện/ tiến hành', 'N4'],
    ['銀行に寄ります', 'ぎんこうによります', 'NGÂN HÀNG KÝ', 'ghé qua ngân hàng', 'N4'],
  ]],
  ['車', 'XA', '', 'N5', [
    ['車', 'くるま', 'XA', 'xe ô tô', 'N5'],
    ['電車', 'でんしゃ', 'ĐIỆN XA', 'tàu điện', 'N5'],
    ['自動車', 'じどうしゃ', 'TỰ ĐỘNG XA', 'ô tô, xe hơi', 'N5'],
    ['自転車', 'じてんしゃ', 'TỰ CHUYỂN XA', 'xe đạp', 'N5'],
    ['駐車場', 'ちゅうしゃじょう', 'TRÚ XA TRƯỜNG', 'Bãi đỗ xe', 'N5'],
    ['電車に乗ります', 'でんしゃにのります', 'ĐIỆN XA THỪA', 'Đi, lên tàu', 'N5'],
    ['電車を降ります', 'でんしゃをおります', 'ĐIỆN XA GIÁNG/HÀNG', 'Xuống tàu', 'N5'],
    ['車に気をつけます', 'くるまにきをつけます', 'XA KHÍ', 'Chú ý, cẩn thận với ôtô', 'N5'],
    ['汽車', 'きしゃ', 'KHÍ XA', 'tàu hỏa chạy bằng hơi nước', 'N4'],
    ['救急車', 'きゅうきゅうしゃ', 'CỨU CẤP XA', 'xe cấp cứu', 'N4'],
    ['今の電車', 'いまのでんしゃ', 'KIM ĐIỆN XA', 'đoàn tàu vừa rồi', 'N4'],
    ['駐車違反', 'ちゅうしゃいはん', 'TRÚ XA VI PHẢN', 'đỗ xe sai quy định/ đỗ xe trái phép', 'N4'],
    ['車に注意します', 'くるまにちゅういします', 'XA CHÚ Ý', 'chú ý xe cộ/ coi chừng xe', 'N4'],
  ]],
  ['今', 'KIM', '', 'N5', [
    ['今', 'いま', 'KIM', 'Bây giờ', 'N5'],
    ['今晩', 'こんばん', 'KIM VÃN', 'Tối nay', 'N5'],
    ['今月', 'こんげつ', 'KIM NGUYỆT', 'tháng này', 'N5'],
    ['今週', 'こんしゅう', 'KIM CHU', 'tuần này', 'N5'],
    ['今夜', 'こんや', 'KIM DẠ', 'tối nay/ đêm nay', 'N4'],
    ['今では', 'いまでは', 'KIM', 'bây giờ thì', 'N4'],
    ['今でも', 'いまでも', 'KIM', 'ngay cả bây giờ', 'N4'],
    ['今にも', 'いまにも', 'KIM', 'sắp/ chỉ chực', 'N4'],
    ['ただ今', 'ただいま', 'KIM', 'bây giờ/ vừa mới', 'N4'],
    ['今の電車', 'いまのでんしゃ', 'KIM ĐIỆN XA', 'đoàn tàu vừa rồi', 'N4'],
    ['たった今', 'たったいま', 'KIM', 'vừa mới rồi', 'N4'],
    ['今いいでしょうか', 'いまいいでしょうか', 'KIM', 'Bây giờ có được không ạ?', 'N4'],
  ]],
  ['合', 'HỢP', '', 'N5', [
    ['試合', 'しあい', 'THỨC HỢP', 'Trận đấu', 'N5'],
    ['具合', 'ぐあい', 'CỤ HỢP', 'trạng thái/ tình hình', 'N4'],
    ['お見合い', 'おみあい', 'KIẾN HỢP', 'xem mặt/ làm mối', 'N4'],
    ['合います', 'あいます', 'HỢP', 'vừa/ hợp', 'N4'],
    ['都合がいい', 'つごうがいい', 'ĐÔ HỢP', 'tiện/ thuận tiện/ có thời gian', 'N4'],
    ['都合が悪い', 'つごうがわるい', 'ĐÔ HỢP ÁC', 'không tiện/ bận/ vướng việc', 'N4'],
    ['試合に出ます', 'しあいにでます', 'THỨC HỢP XUẤT', 'tham gia trận đấu/ ra sân thi đấu', 'N4'],
    ['知り合います', 'しりあいます', 'TRI HỢP', 'làm quen/ gặp gỡ làm quen', 'N4'],
    ['間に合います', 'まにあいます', '', 'kịp giờ', 'N4'],
    ['試験に合格します', 'しけんにごうかくします', 'THỨC NGHIỆM HỢP CÁCH', 'đỗ thi/ đậu kỳ thi', 'N4'],
    ['サイズが合います', 'サイズがあいます', 'HỢP', 'vừa kích thước/ hợp cỡ', 'N4'],
    ['合格します', 'ごうかくします', '', 'thi đỗ', 'N3'],
  ]],
  ['社', 'XÃ', '', 'N5', [
    ['社員', 'しゃいん', 'XÃ VIÊN', 'Nhân viên công ty ~', 'N5'],
    ['会社', 'かいしゃ', 'HỘI XÃ', 'công ty', 'N5'],
    ['神社', 'じんじゃ', 'THẦN XÃ', 'Đền thờ đạo thần', 'N5'],
    ['社長', 'しゃちょう', 'XÃ TRƯỞNG', 'Giám đốc', 'N5'],
    ['会社員', 'かいしゃいん', 'HỘI XÃ VIÊN', 'Nhân viên công ty', 'N5'],
    ['会社を休みます', 'かいしゃをやすみます', 'HỘI XÃ', 'nghỉ làm việc', 'N5'],
    ['会社をやめます', 'かいしゃをやめます', 'HỘI XÃ', 'Bỏ, thôi việc công ty', 'N5'],
    ['本社', 'ほんしゃ', 'BẢN XÃ', 'trụ sở chính', 'N4'],
    ['～会社', '～かいしゃ', 'HỘI XÃ', 'công ty ~', 'N4'],
    ['新聞社', 'しんぶんしゃ', 'TÂN VĂN XÃ', 'toà soạn báo/ công ty báo chí', 'N4'],
    ['旅行社', 'りょこうしゃ', 'LỮ HÀNH XÃ', 'công ty du lịch', 'N4'],
    ['会社に勤めます', 'かいしゃにつとめます', 'HỘI XÃ CẦN', 'làm việc ở công ty', 'N4'],
  ]],
  ['年', 'NIÊN', '', 'N5', [
    ['去年', 'きょねん', 'KHU NIÊN', 'năm ngoái', 'N5'],
    ['来年', 'らいねん', 'LAI NIÊN', 'năm sau', 'N5'],
    ['～年', '～ねん', 'NIÊN', '～ năm', 'N5'],
    ['年を取ります', 'としをとります', 'NIÊN THỦ', 'thêm tuổi', 'N5'],
    ['毎年', 'まいとし', 'MỖI NIÊN', 'hàng năm', 'N4'],
    ['年齢', 'ねんれい', 'NIÊN LINH', 'tuổi', 'N4'],
    ['半年', 'はんとし', 'BÁN NIÊN', 'nửa năm', 'N4'],
    ['忘年会', 'ぼうねんかい', 'VONG NIÊN HỘI', 'tiệc tất niên', 'N4'],
    ['新年会', 'しんねんかい', 'TÂN NIÊN HỘI', 'tiệc tân niên', 'N4'],
    ['お年玉', 'おとしだま', 'NIÊN NGỌC', 'tiền mừng tuổi', 'N4'],
    ['再来年', 'さらいねん', 'TÁI LAI NIÊN', 'năm sau nữa', 'N4'],
  ]],
  ['月', 'NGUYỆT', '', 'N5', [
    ['今月', 'こんげつ', 'KIM NGUYỆT', 'tháng này', 'N5'],
    ['何月', 'なんがつ', 'HÀ NGUYỆT', 'tháng mấy', 'N5'],
    ['先月', 'せんげつ', 'TIÊN NGUYỆT', 'tháng trước', 'N5'],
    ['来月', 'らいげつ', 'LAI NGUYỆT', 'tháng sau', 'N5'],
    ['月曜日', 'げつようび', 'NGUYỆT DIỆU NHẬT', 'Thứ hai', 'N5'],
    ['～か月', '～かげつ', 'NGUYỆT', '～ tháng', 'N5'],
    ['お正月', 'おしょうがつ', 'CHÍNH NGUYỆT', 'Tết (Dương lịch)', 'N5'],
    ['月', 'つき', 'NGUYỆT', 'mặt trăng/ trăng', 'N4'],
    ['毎月', 'まいつき', 'MỖI NGUYỆT', 'hàng tháng', 'N4'],
    ['再来月', 'さらいげつ', 'TÁI LAI NGUYỆT', 'tháng sau nữa', 'N4'],
    ['月・水・金', 'げつ・すい・きん', 'NGUYỆT THỦY KIM', 'thứ hai, thứ tư, thứ sáu', 'N4'],
  ]],
  ['来', 'LAI', '', 'N5', [
    ['来年', 'らいねん', 'LAI NIÊN', 'năm sau', 'N5'],
    ['来月', 'らいげつ', 'LAI NGUYỆT', 'tháng sau', 'N5'],
    ['来週', 'らいしゅう', 'LAI CHU', 'tuần sau', 'N5'],
    ['来ます', 'きます', 'LAI', 'đến', 'N5'],
    ['持って来ます', 'もってきます', 'TRÌ LAI', 'Mang đến', 'N5'],
    ['連れて来ます', 'つれてきます', 'LIÊN LAI', 'Dẫn đến', 'N5'],
    ['将来', 'しょうらい', 'TƯƠNG LAI', 'tương lai', 'N4'],
    ['再来年', 'さらいねん', 'TÁI LAI NIÊN', 'năm sau nữa', 'N4'],
    ['再来月', 'さらいげつ', 'TÁI LAI NGUYỆT', 'tháng sau nữa', 'N4'],
    ['再来週', 'さらいしゅう', 'TÁI LAI CHU', 'tuần sau nữa', 'N4'],
    ['帰って来ます', 'かえってきます', 'QUY LAI', 'về/ trở về', 'N4'],
  ]],
  ['道', 'ĐẠO', '', 'N5', [
    ['道', 'みち', 'ĐẠO', 'Đường', 'N5'],
    ['道を歩きます', 'みちをあるきます', 'ĐẠO BỘ', 'Đi bộ trên đường', 'N5'],
    ['柔道', 'じゅうどう', 'NHU ĐẠO', 'judo/ nhu đạo', 'N4'],
    ['道具', 'どうぐ', 'ĐẠO CỤ', 'dụng cụ/ công cụ', 'N4'],
    ['水道', 'すいどう', 'THỦY ĐẠO', 'nước máy', 'N4'],
    ['茶道', 'ちゃどう', 'TRÀ ĐẠO', 'trà đạo', 'N4'],
    ['剣道', 'けんどう', 'KIẾM ĐẠO', 'kiếm đạo', 'N4'],
    ['道を走ります', 'みちをはしります', 'ĐẠO TẨU', 'chạy trên đường', 'N4'],
    ['道がすきます', 'みちがすきます', 'ĐẠO', 'đường vắng/ đường thoáng', 'N4'],
    ['道が込みます', 'みちがこみます', 'ĐẠO VÀO', 'đường đông/ tắc đường', 'N4'],
    ['道を通ります', 'みちをとおります', 'ĐẠO THÔNG', 'đi qua đường', 'N4'],
  ]],
  ['上', 'THƯỢNG', '', 'N5', [
    ['上', 'うえ', 'THƯỢNG', 'Trên', 'N5'],
    ['上手', 'じょうず', 'THƯỢNG THỦ', 'giỏi, khéo', 'N5'],
    ['上着', 'うわぎ', 'THƯỢNG TRƯỚC', 'Áo khoác', 'N5'],
    ['屋上', 'おくじょう', 'ỐC THƯỢNG', 'sân thượng/ nóc nhà', 'N4'],
    ['上手に', 'じょうずに', 'THƯỢNG THỦ', 'giỏi/ khéo', 'N4'],
    ['上げます', 'あげます', 'THƯỢNG', 'nâng lên/ giơ lên/ tăng lên', 'N4'],
    ['以上です', 'いじょうです', 'DĨ THƯỢNG', 'Trên đây là hết./ Tôi xin hết.', 'N4'],
    ['上がります', 'あがります', '', 'tăng lên/ lên cao', 'N4'],
    ['召し上がります', 'めしあがります', 'TRIỆU THƯỢNG', 'ăn/ uống (kính ngữ)', 'N4'],
    ['値段が上がります', 'ねだんがあがります', 'TRỊ ĐOẠN THƯỢNG', 'giá tăng lên', 'N4'],
  ]],
  ['下', 'HẠ', '', 'N5', [
    ['下', 'した', 'HẠ', 'dưới', 'N5'],
    ['下手', 'へた', 'HẠ THỦ', 'kém', 'N5'],
    ['下着', 'したぎ', 'HẠ TRƯỚC', 'Quần áo lót', 'N5'],
    ['地下鉄', 'ちかてつ', 'ĐỊA HẠ THIẾT', 'tàu điện ngầm', 'N5'],
    ['廊下', 'ろうか', 'LANG HẠ', 'hành lang', 'N4'],
    ['靴下', 'くつした', 'NGOA HẠ', 'cái tất', 'N4'],
    ['下げます', 'さげます', 'HẠ', 'hạ xuống/ giảm xuống/ hạ', 'N4'],
    ['下ろします', 'おろします', 'HẠ', 'hạ xuống/ rút (tiền)', 'N4'],
    ['下がります', 'さがります', '', 'giảm xuống/ hạ xuống', 'N4'],
    ['値段が下がります', 'ねだんがさがります', 'TRỊ ĐOẠN HẠ', 'giá giảm xuống', 'N4'],
  ]],
  ['中', 'TRUNG', '', 'N5', [
    ['中', 'なか', 'TRUNG', 'trong, giữa', 'N5'],
    ['中国', 'ちゅうごく', 'TRUNG QUỐC', 'Trung Quốc', 'N5'],
    ['中身', 'なかみ', 'TRUNG THÂN', 'nội dung/ phần bên trong', 'N4'],
    ['中止', 'ちゅうし', 'TRUNG CHỈ', 'dừng/ đình chỉ', 'N4'],
    ['真ん中', 'まんなか', 'CHÂN TRUNG', 'giữa/ trung tâm', 'N4'],
    ['使用中', 'しようちゅう', 'SỬ DỤNG TRUNG', 'đang sử dụng/ đang có người dùng', 'N4'],
    ['営業中', 'えいぎょうちゅう', 'DOANH NGHIỆP TRUNG', 'đang mở cửa/ đang kinh doanh', 'N4'],
    ['世界中', 'せかいじゅう', 'THẾ GIỚI TRUNG', 'khắp thế giới/ toàn thế giới', 'N4'],
    ['中学校', 'ちゅうがっこう', 'TRUNG HỌC HIỆU', 'trường trung học cơ sở', 'N4'],
    ['途中で', 'とちゅうで', 'ĐỒ TRUNG', 'giữa đường/ dọc đường', 'N4'],
  ]],
  ['切', 'THIẾT', '', 'N5', [
    ['切る', 'きる', 'THIẾT', 'cắt', 'N5'],
    ['切符', 'きっぷ', 'THIẾT PHÙ', 'vé', 'N5'],
    ['親切', 'しんせつ', 'THÂN THIẾT', 'tốt bụng, thân thiện', 'N5'],
    ['切手', 'きって', 'THIẾT THỦ', 'tem', 'N5'],
    ['大切', 'たいせつ', 'ĐẠI THIẾT', 'Quan trọng, quý giá', 'N5'],
    ['切ります', 'きります', '', 'cắt', 'N5'],
    ['切れます', 'きれます', '', 'đứt/ hết (hàng)', 'N4'],
    ['親切にします', 'しんせつにします', 'THÂN THIẾT', 'đối xử thân thiện/ tốt với', 'N4'],
    ['電源を切ります', 'でんげんをきります', 'ĐIỆN NGUYÊN THIẾT', 'tắt công tắc điện', 'N4'],
    ['ひもが切れます', 'ひもがきれます', 'THIẾT', 'sợi dây bị đứt', 'N4'],
  ]],
  ['動', 'ĐỘNG', '', 'N5', [
    ['動物', 'どうぶつ', 'ĐỘNG VẬT', 'Động vật', 'N5'],
    ['自動車', 'じどうしゃ', 'TỰ ĐỘNG XA', 'ô tô, xe hơi', 'N5'],
    ['時計が動きます', 'とけいがうごきます', 'THỜI KẾ ĐỘNG', 'Chuyển động, chạy đồng hồ', 'N5'],
    ['活動', 'かつどう', 'HOẠT ĐỘNG', 'hoạt động', 'N4'],
    ['運動会', 'うんどうかい', 'VẬN ĐỘNG HỘI', 'hội thao/ đại hội thể thao', 'N4'],
    ['動物園', 'どうぶつえん', 'ĐỘNG VẬT VIÊN', 'vườn thú/ vườn bách thú', 'N4'],
    ['動きます', 'うごきます', '', 'chuyển động/ hoạt động', 'N4'],
    ['自動販売機', 'じどうはんばいき', 'TỰ ĐỘNG PHIÊN MẠI CƠ', 'máy bán hàng tự động', 'N4'],
    ['運動します', 'うんどうします', 'VẬN ĐỘNG', 'vận động/ tập thể thao', 'N4'],
    ['動かします', 'うごかします', 'ĐỘNG', 'làm dịch chuyển/ khởi động', 'N4'],
  ]],
  ['時', 'THỜI', 'THÌ', 'N5', [
    ['時計', 'とけい', 'THỜI KẾ', 'Đồng hồ', 'N5'],
    ['何時', 'なんじ', 'HÀ THỜI', 'Mấy giờ', 'N5'],
    ['時々', 'ときどき', 'THÌ KÉP', 'thỉnh thoảng', 'N5'],
    ['時間', 'じかん', 'THÌ/THỜI GIAN', 'thời gian', 'N5'],
    ['～時間', '～じかん', 'THỜI GIAN', '～ tiếng', 'N5'],
    ['時計が動きます', 'とけいがうごきます', 'THỜI KẾ ĐỘNG', 'Chuyển động, chạy đồng hồ', 'N5'],
    ['目覚まし時計', 'めざましどけい', 'MỤC GIÁC THỜI KẾ', 'đồng hồ báo thức', 'N4'],
    ['時間に遅れます', 'じかんにおくれます', 'THỜI GIAN TRÌ', 'muộn giờ/ trễ giờ/ đến muộn', 'N4'],
    ['7時を過ぎます', '7じをすぎます', 'THÌ QUÁ', 'quá 7 giờ/ qua 7 giờ', 'N4'],
    ['時間がたちます', 'じかんがたちます', 'THỜI GIAN', 'thời gian trôi đi', 'N4'],
  ]],
  ['書', 'THƯ', '', 'N5', [
    ['辞書', 'じしょ', 'TỪ THƯ', 'Từ điển', 'N5'],
    ['書く', 'かく', 'THƯ', 'viết, vẽ', 'N5'],
    ['書留', 'かきとめ', 'THƯ LƯU', 'gửi bảo đảm', 'N5'],
    ['図書館', 'としょかん', 'ĐỒ THƯ QUÁN', 'Thư viện', 'N5'],
    ['書きます', 'かきます', '', 'viết/ vẽ', 'N5'],
    ['書類', 'しょるい', 'THƯ LOẠI', 'giấy tờ/ tài liệu', 'N4'],
    ['案内書', 'あんないしょ', 'ÁN NỘI THƯ', 'sách hướng dẫn/ tài liệu hướng dẫn', 'N4'],
    ['説明書', 'せつめいしょ', 'THUYẾT MINH THƯ', 'quyển hướng dẫn/ bản hướng dẫn', 'N4'],
    ['保証書', 'ほしょうしょ', 'BẢO CHỨNG THƯ', 'giấy bảo hành', 'N4'],
    ['領収書', 'りょうしゅうしょ', 'LÃNH THÂU THƯ', 'hóa đơn/ biên lai', 'N4'],
  ]],
  ['話', 'THOẠI', '', 'N5', [
    ['電話', 'でんわ', 'ĐIỆN THOẠI', 'máy điện thoại, điện thoại', 'N5'],
    ['お話', 'おはなし', 'THOẠI', 'Câu chuyện, bài nói chuyện', 'N5'],
    ['話します', 'はなします', 'THOẠI', 'Nói, nói chuyện', 'N5'],
    ['電話します', 'でんわします', 'ĐIỆN THOẠI', 'Gọi điện thoại', 'N5'],
    ['会話', 'かいわ', 'HỘI THOẠI', 'hội thoại', 'N4'],
    ['昔話', 'むかしばなし', 'TÍCH THOẠI', 'chuyện cổ tích', 'N4'],
    ['電話代', 'でんわだい', 'ĐIỆN THOẠI ĐẠI', 'tiền điện thoại', 'N4'],
    ['世話をします', 'せわをします', 'THẾ THOẠI', 'chăm sóc/ giúp đỡ', 'N4'],
    ['まちがい電話', 'まちがいでんわ', 'ĐIỆN THOẠI', 'điện thoại gọi nhầm', 'N4'],
    ['電話が掛かります', 'でんわがかかります', 'ĐIỆN THOẠI QUẢI', 'có điện thoại gọi đến', 'N4'],
  ]],
  ['金', 'KIM', '', 'N5', [
    ['お金', 'おかね', 'KIM', 'tiền', 'N5'],
    ['金額', 'きんがく', 'KIM NGẠCH', 'Số tiền, khoản tiền', 'N5'],
    ['現金', 'げんきん', 'HIỆN KIM', 'Tiền mặt', 'N5'],
    ['金曜日', 'きんようび', 'KIM DIỆU NHẬT', 'Thứ sáu', 'N5'],
    ['細かいお金', 'こまかいおかね', 'TẾ KIM', 'tiền lẻ', 'N5'],
    ['罰金', 'ばっきん', 'PHẠT KIM', 'tiền phạt', 'N4'],
    ['賞金', 'しょうきん', 'THƯỞNG KIM', 'tiền thưởng', 'N4'],
    ['お金持ち', 'おかねもち', 'KIM TRÌ', 'người giàu có', 'N4'],
    ['月・水・金', 'げつ・すい・きん', 'NGUYỆT THỦY KIM', 'thứ hai, thứ tư, thứ sáu', 'N4'],
    ['貯金します', 'ちょきんします', 'TRỮ KIM', 'tiết kiệm tiền/ để dành tiền', 'N4'],
  ]],
  ['間', 'GIAN', '', 'N5', [
    ['間', 'あいだ', 'GIAN', 'giữa', 'N5'],
    ['時間', 'じかん', 'THÌ/THỜI GIAN', 'thời gian', 'N5'],
    ['～時間', '～じかん', 'THỜI GIAN', '～ tiếng', 'N5'],
    ['～週間', '～しゅうかん', 'CHU GIAN', '～ tuần', 'N5'],
    ['この間', 'このあいだ', 'GIAN', 'Vừa rồi, hôm nọ', 'N5'],
    ['昼間', 'ひるま', 'TRÚ GIAN', 'ban ngày/ thời gian ban ngày', 'N4'],
    ['仲間', 'なかま', 'TRỌNG GIAN', 'bạn bè/ đồng nghiệp', 'N4'],
    ['間に合います', 'まにあいます', '', 'kịp giờ', 'N4'],
    ['時間に遅れます', 'じかんにおくれます', 'THỜI GIAN TRÌ', 'muộn giờ/ trễ giờ/ đến muộn', 'N4'],
    ['時間がたちます', 'じかんがたちます', 'THỜI GIAN', 'thời gian trôi đi', 'N4'],
  ]],
  ['事', 'SỰ', '', 'N5', [
    ['用事', 'ようじ', 'DỤNG SỰ', 'việc bận, công chuyện', 'N5'],
    ['事務所', 'じむしょ', 'SỰ VỤ SỞ', 'văn phòng', 'N5'],
    ['食事します', 'しょくじします', 'THỰC SỰ', 'ăn cơm', 'N5'],
    ['事故', 'じこ', 'SỰ CỐ', 'tai nạn/ sự cố', 'N4'],
    ['火事', 'かじ', 'HỎA SỰ', 'hỏa hoạn/ cháy', 'N4'],
    ['事件', 'じけん', 'SỰ KIỆN', 'vụ án/ vụ việc', 'N4'],
    ['返事', 'へんじ', 'PHẢN SỰ', 'hồi âm/ trả lời', 'N4'],
    ['事故が起きます', 'じこがおきます', 'SỰ CỐ KHỞI', 'xảy ra tai nạn', 'N4'],
    ['事故に遭います', 'じこにあいます', 'SỰ CỐ TAO', 'gặp tai nạn', 'N4'],
  ]],
  ['場', 'TRƯỜNG', '', 'N5', [
    ['牧場', 'ぼくじょう', 'MỤC TRƯỜNG', 'Trang trại chăn nuôi', 'N5'],
    ['売り場', 'うりば', 'MẠI TRƯỜNG', 'quầy bán (trong một cửa hàng bách hóa)', 'N5'],
    ['乗り場', 'のりば', 'THỪA TRƯỜNG', 'bến xe, điểm lên xuống xe', 'N5'],
    ['駐車場', 'ちゅうしゃじょう', 'TRÚ XA TRƯỜNG', 'Bãi đỗ xe', 'N5'],
    ['場所', 'ばしょ', 'TRƯỜNG SỞ', 'địa điểm/ nơi/ chỗ', 'N4'],
    ['工場', 'こうじょう', 'CÔNG TRƯỜNG', 'nhà máy/ phân xưởng', 'N4'],
    ['会場', 'かいじょう', 'HỘI TRƯỜNG', 'hội trường', 'N4'],
    ['置き場', 'おきば', 'TRÍ TRƯỜNG', 'nơi để/ chỗ để/ bãi để', 'N4'],
    ['スキー場', 'スキーじょう', 'TRƯỜNG', 'bãi trượt tuyết', 'N4'],
  ]],
  ['家', 'GIA', '', 'N5', [
    ['家族', 'かぞく', 'GIA TỘC', 'gia đình', 'N5'],
    ['家内', 'かない', 'GIA NỘI', 'vợ', 'N5'],
    ['家賃', 'やちん', 'GIA NHẦM', 'Tiền thuê nhà', 'N5'],
    ['ご家族', 'ごかぞく', 'GIA TỘC', 'Gia đình', 'N5'],
    ['家', 'いえ', 'GIA', 'nhà', 'N4'],
    ['家具', 'かぐ', 'GIA CỤ', 'gia cụ/ đồ dùng nội thất', 'N4'],
    ['作家', 'さっか', 'TÁC GIA', 'nhà văn', 'N4'],
    ['小説家', 'しょうせつか', 'TIỂU THUYẾT GIA', 'tiểu thuyết gia/ nhà văn', 'N4'],
    ['建築家', 'けんちくか', 'KIẾN TRÚC GIA', 'kiến trúc sư', 'N4'],
  ]],
  ['所', 'SỞ', '', 'N5', [
    ['所', 'ところ', 'SỞ', 'nơi, chỗ', 'N5'],
    ['住所', 'じゅうしょ', 'TRÚ SỞ', 'Địa chỉ', 'N5'],
    ['事務所', 'じむしょ', 'SỰ VỤ SỞ', 'văn phòng', 'N5'],
    ['市役所', 'しやくしょ', 'THỊ DỊCH SỞ', 'văn phòng hành chính quận, thành phố', 'N5'],
    ['住所を教えます', 'じゅうしょをおしえます', 'TRÚ SỞ GIÁO', 'Nói, cho biết địa chỉ', 'N5'],
    ['場所', 'ばしょ', 'TRƯỜNG SỞ', 'địa điểm/ nơi/ chỗ', 'N4'],
    ['台所', 'だいどころ', 'ĐÀI SỞ', 'bếp/ nhà bếp', 'N4'],
    ['近所', 'きんじょ', 'CẬN SỞ', 'khu lân cận/ gần nhà', 'N4'],
    ['元の所', 'もとのところ', 'NGUYÊN SỞ', 'địa điểm ban đầu/ địa điểm gốc', 'N4'],
  ]],
  ['本', 'BẢN', 'BỔN', 'N5', [
    ['本', 'ほん', 'BẢN/BỔN', 'Sách', 'N5'],
    ['日本', 'にほん', 'NHẬT BẢN', 'Nhật Bản', 'N5'],
    ['本屋', 'ほんや', 'BỔN ỐC', 'hiệu sách', 'N5'],
    ['日本語', 'にほんご', 'NHẬT BẢN NGỮ', 'Tiếng Nhật', 'N5'],
    ['日本にいます', 'にほんにいます', 'NHẬT BẢN', 'ở Nhật', 'N5'],
    ['本棚', 'ほんだな', 'BỔN BẰNG', 'giá sách/ kệ sách', 'N4'],
    ['本社', 'ほんしゃ', 'BẢN XÃ', 'trụ sở chính', 'N4'],
    ['本日休業', 'ほんじつきゅうぎょう', 'BẢN NHẬT HƯU NGHIỆP', 'hôm nay nghỉ/ hôm nay đóng cửa', 'N4'],
    ['本が出ます', 'ほんがでます', 'BẢN XUẤT', 'sách được xuất bản', 'N4'],
  ]],
  ['休', 'HƯU', '', 'N5', [
    ['休み', 'やすみ', 'HƯU', 'Nghỉ, nghỉ phép, ngày nghỉ', 'N5'],
    ['昼休み', 'ひるやすみ', 'TRÚ HƯU', 'Nghỉ trưa', 'N5'],
    ['休みます', 'やすみます', 'HƯU', 'Nghỉ, nghỉ ngơi', 'N5'],
    ['会社を休みます', 'かいしゃをやすみます', 'HỘI XÃ', 'nghỉ làm việc', 'N5'],
    ['連休', 'れんきゅう', 'LIÊN HƯU', 'ngày nghỉ liền nhau/ kỳ nghỉ dài', 'N4'],
    ['本日休業', 'ほんじつきゅうぎょう', 'BẢN NHẬT HƯU NGHIỆP', 'hôm nay nghỉ/ hôm nay đóng cửa', 'N4'],
    ['休憩します', 'きゅうけいします', 'HƯU KHÊ', 'nghỉ/ giải lao', 'N4'],
    ['休みを取ります', 'やすみをとります', 'HƯU THỦ', 'xin nghỉ/ nghỉ phép', 'N4'],
  ]],
  ['先', 'TIÊN', '', 'N5', [
    ['先生', 'せんせい', 'TIÊN SINH', 'Thầy/ cô', 'N5'],
    ['先月', 'せんげつ', 'TIÊN NGUYỆT', 'tháng trước', 'N5'],
    ['先週', 'せんしゅう', 'TIÊN CHU', 'tuần trước', 'N5'],
    ['先生に聞きます', 'せんせいにききます', 'TIÊN SINH VĂN', 'Hỏi giáo viên', 'N5'],
    ['先に', 'さきに', 'TIÊN', 'trước', 'N4'],
    ['先日', 'せんじつ', 'TIÊN NHẬT', 'hôm trước/ mấy hôm trước', 'N4'],
    ['お先にどうぞ', 'おさきにどうぞ', 'TIÊN', 'Xin mời anh/chị đi trước.', 'N4'],
    ['お先に失礼します', 'おさきにしつれいします', 'TIÊN THẤT LỄ', 'Tôi xin phép về trước.', 'N4'],
  ]],
  ['分', 'PHÂN', '', 'N5', [
    ['何分', 'なんぷん', 'HÀ PHÂN', 'Mấy phút', 'N5'],
    ['自分で', 'じぶんで', 'BỘ PHÂN', 'Tự mình', 'N5'],
    ['分かります', 'わかります', '', 'hiểu', 'N5'],
    ['自分', 'じぶん', 'TỰ PHÂN', 'bản thân/ mình/ tự mình', 'N4'],
    ['十分', 'じゅうぶん', 'THẬP PHÂN', 'đủ/ đầy đủ', 'N4'],
    ['半分', 'はんぶん', 'BÁN PHÂN', 'một nửa', 'N4'],
    ['気分がいい', 'きぶんがいい', 'KHÍ PHÂN', 'thấy khỏe/ thấy dễ chịu/ tâm trạng tốt', 'N4'],
    ['気分が悪い', 'きぶんがわるい', 'KHÍ PHÂN ÁC', 'thấy khó chịu/ thấy mệt/ tâm trạng tệ', 'N4'],
  ]],
  ['持', 'TRÌ', '', 'N5', [
    ['持ちます', 'もちます', 'TRÌ', 'Mang, cầm', 'N5'],
    ['持って来ます', 'もってきます', 'TRÌ LAI', 'Mang đến', 'N5'],
    ['持って行きます', 'もっていきます', 'TRÌ HÀNH', 'Mang đi, mang theo', 'N5'],
    ['気持ち', 'きもち', 'KHÍ TRÌ', 'cảm giác/ tâm trạng', 'N4'],
    ['お金持ち', 'おかねもち', 'KIM TRÌ', 'người giàu có', 'N4'],
    ['お持ちです', 'おもちです', 'TRÌ', 'có (kính ngữ)', 'N4'],
    ['気持ちがいい', 'きもちがいい', 'KHÍ TRÌ', 'dễ chịu/ thoải mái', 'N4'],
    ['気持ちが悪い', 'きもちがわるい', 'KHÍ TRÌ ÁC', 'khó chịu', 'N4'],
  ]],
  ['曜', 'DIỆU', '', 'N5', [
    ['何曜日', 'なんようび', 'HÀ DIỆU NHẬT', 'Thứ mấy', 'N5'],
    ['土曜日', 'どようび', 'THỔ DIỆU NHẬT', 'Thứ bảy', 'N5'],
    ['日曜日', 'にちようび', 'NHẬT DIỆU NHẬT', 'Chủ Nhật', 'N5'],
    ['月曜日', 'げつようび', 'NGUYỆT DIỆU NHẬT', 'Thứ hai', 'N5'],
    ['木曜日', 'もくようび', 'MỘC DIỆU NHẬT', 'Thứ năm', 'N5'],
    ['水曜日', 'すいようび', 'THỦY DIỆU NHẬT', 'Thứ tư', 'N5'],
    ['火曜日', 'かようび', 'HỎA DIỆU NHẬT', 'Thứ ba', 'N5'],
    ['金曜日', 'きんようび', 'KIM DIỆU NHẬT', 'Thứ sáu', 'N5'],
  ]],
  ['着', 'TRƯỚC', '', 'N5', [
    ['上着', 'うわぎ', 'THƯỢNG TRƯỚC', 'Áo khoác', 'N5'],
    ['下着', 'したぎ', 'HẠ TRƯỚC', 'Quần áo lót', 'N5'],
    ['着物', 'きもの', 'TRƯỚC VẬT', 'Kimono', 'N5'],
    ['着ます', 'きます', '', 'mặc', 'N5'],
    ['着きます', 'つきます', '', 'tới nơi', 'N5'],
    ['駅に着きます', 'えきにつきます', 'DỊCH TRƯỚC', 'đến ga', 'N5'],
    ['シャツを着ます', 'シャツをきます', 'TRƯỚC', 'Mặc áo sơ mi', 'N5'],
    ['到着します', 'とうちゃくします', 'ĐÁO TRƯỚC', 'đến/ đến nơi', 'N4'],
  ]],
  ['茶', 'TRÀ', '', 'N5', [
    ['紅茶', 'こうちゃ', 'HỒNG TRÀ', 'trà đen', 'N5'],
    ['お茶', 'おちゃ', 'TRÀ', 'Trà đạo', 'N5'],
    ['喫茶店', 'きっさてん', 'KHIẾT TRÀ ĐIẾM', 'quán giải khát, quán cà phê', 'N5'],
    ['喫茶店を出ます', 'きっさてんをでます', 'KHIẾT TRÀ ĐIẾM XUẤT', 'ra khỏi quán giải khát', 'N5'],
    ['喫茶店に入ります', 'きっさてんにはいります', 'NHẬP', 'vào quán giải khát', 'N5'],
    ['茶色', 'ちゃいろ', 'TRÀ SẮC', 'màu nâu', 'N4'],
    ['茶道', 'ちゃどう', 'TRÀ ĐẠO', 'trà đạo', 'N4'],
    ['お茶をたてます', 'おちゃをたてます', 'TRÀ', 'pha trà/ khuấy trà', 'N4'],
  ]],
  ['食', 'THỰC', '', 'N5', [
    ['食堂', 'しょくどう', 'THỰC ĐƯỜNG', 'nhà ăn', 'N5'],
    ['食べる', 'たべる', 'THỰC', 'ăn', 'N5'],
    ['食べ物', 'たべもの', 'THỰC VẬT', 'đồ ăn', 'N5'],
    ['食べます', 'たべます', '', 'ăn', 'N5'],
    ['食事します', 'しょくじします', 'THỰC SỰ', 'ăn cơm', 'N5'],
    ['和食', 'わしょく', 'HÒA THỰC', 'món ăn Nhật', 'N4'],
    ['洋食', 'ようしょく', 'DƯƠNG THỰC', 'món ăn Âu Mỹ', 'N4'],
    ['食欲', 'しょくよく', 'THỰC DỤC', 'sự thèm ăn/ cảm giác muốn ăn', 'N4'],
  ]],
  ['便', 'TIỆN', '', 'N5', [
    ['便利', 'べんり', 'TIỆN LỢI', 'tiện lợi', 'N5'],
    ['船便', 'ふなびん', 'THUYỀN TIỆN', 'gửi bằng đường biển', 'N5'],
    ['不便', 'ふべん', 'BẤT TIỆN', 'Bất tiện', 'N5'],
    ['郵便局', 'ゆうびんきょく', 'BƯU TIỆN CỤC', 'Bưu điện', 'N5'],
    ['航空便', 'こうくうびん', 'HÀNG KHÔNG TIỆN', 'gửi bằng đường hàng không', 'N5'],
    ['便', 'びん', 'TIỆN', 'chuyến bay', 'N4'],
    ['宅配便', 'たくはいびん', 'TRẠCH PHỐI TIỆN', 'dịch vụ chuyển đồ đến nhà', 'N4'],
  ]],
  ['冷', 'LÃNH', '', 'N5', [
    ['冷たい', 'つめたい', 'LÃNH', 'lạnh, buốt', 'N5'],
    ['冷蔵庫', 'れいぞうこ', 'LÃNH TÀNG KHỐ', 'tủ lạnh', 'N5'],
    ['冷房', 'れいぼう', 'LÃNH PHÒNG', 'máy lạnh/ thiết bị làm mát', 'N4'],
    ['冷やします', 'ひやします', 'LÃNH', 'làm lạnh/ ướp lạnh', 'N4'],
    ['冷えます', 'ひえます', '', 'lạnh đi', 'N3'],
    ['冷めます', 'さめます', '', 'nguội đi', 'N3'],
    ['冷まします', 'さまします', '', 'làm nguội', 'N3'],
  ]],
  ['教', 'GIÁO', '', 'N5', [
    ['教師', 'きょうし', 'GIÁO SƯ', 'Giáo viên', 'N5'],
    ['教室', 'きょうしつ', 'GIÁO THẤT', 'lớp học, phòng học', 'N5'],
    ['教える', 'おしえる', 'GIÁO', 'dạy', 'N5'],
    ['教えます', 'おしえます', '', 'dạy/ chỉ cho', 'N5'],
    ['住所を教えます', 'じゅうしょをおしえます', 'TRÚ SỞ GIÁO', 'Nói, cho biết địa chỉ', 'N5'],
    ['教会', 'きょうかい', 'GIÁO HỘI', 'nhà thờ', 'N4'],
    ['教室を開きます', 'きょうしつをひらきます', 'GIÁO THẤT KHAI', 'mở lớp học', 'N4'],
  ]],
  ['料', 'LIỆU', '', 'N5', [
    ['料理', 'りょうり', 'LIỆU LÝ', 'món ăn, việc nấu ăn', 'N5'],
    ['資料', 'しりょう', 'TƯ LIỆU', 'Tài liệu, tư liệu', 'N5'],
    ['無料', 'むりょう', 'VÔ LIỆU', 'miễn phí', 'N4'],
    ['給料', 'きゅうりょう', 'CẤP LIỆU', 'lương', 'N4'],
    ['材料', 'ざいりょう', 'TÀI LIỆU', 'nguyên liệu', 'N4'],
    ['原料', 'げんりょう', 'NGUYÊN LIỆU', 'nguyên liệu', 'N4'],
    ['調味料', 'ちょうみりょう', 'ĐIỀU VỊ LIỆU', 'gia vị', 'N4'],
  ]],
  ['方', 'PHƯƠNG', '', 'N5', [
    ['～方', '～かた', 'PHƯƠNG', 'Cách ~', 'N5'],
    ['あの方', 'あのかた', 'PHƯƠNG', 'Vị kia', 'N5'],
    ['読み方', 'よみかた', 'ĐỘC PHƯƠNG', 'Cách đọc', 'N5'],
    ['方', 'ほう', 'PHƯƠNG', 'hướng/ phương hướng', 'N4'],
    ['方', 'かた', 'PHƯƠNG', 'vị/ người', 'N4'],
    ['夕方', 'ゆうがた', 'TỊCH PHƯƠNG', 'chiều tối', 'N4'],
    ['方法', 'ほうほう', 'PHƯƠNG PHÁP', 'phương pháp/ cách làm', 'N4'],
  ]],
  ['業', 'NGHIỆP', '', 'N5', [
    ['残業します', 'ざんぎょうします', 'TÀN NGHIỆP', 'Làm thêm, làm quá giờ', 'N5'],
    ['授業', 'じゅぎょう', 'THỤ NGHIỆP', 'giờ học', 'N4'],
    ['営業', 'えいぎょう', 'DOANH NGHIỆP', 'kinh doanh/ bán hàng', 'N4'],
    ['営業中', 'えいぎょうちゅう', 'DOANH NGHIỆP TRUNG', 'đang mở cửa/ đang kinh doanh', 'N4'],
    ['本日休業', 'ほんじつきゅうぎょう', 'BẢN NHẬT HƯU NGHIỆP', 'hôm nay nghỉ/ hôm nay đóng cửa', 'N4'],
    ['大学を卒業します', 'だいがくをそつぎょうします', 'ĐẠI HỌC TỐT NGHIỆP', 'tốt nghiệp đại học', 'N4'],
    ['卒業します', 'そつぎょうします', '', 'tốt nghiệp', 'N3'],
  ]],
  ['楽', 'LẠC', 'NHẠC', 'N5', [
    ['音楽', 'おんがく', 'ÂM NHẠC/LẠC', 'âm nhạc', 'N5'],
    ['楽しい', 'たのしい', 'LẠC/ NHẠC', 'vui', 'N5'],
    ['楽', 'らく', 'LẠC', 'thoải mái/ nhàn hạ', 'N4'],
    ['楽しみ', 'たのしみ', 'NHẠC', 'niềm vui/ điều mong đợi', 'N4'],
    ['楽しく', 'たのしく', 'LẠC', 'vui/ vui vẻ', 'N4'],
    ['楽しみます', 'たのしみます', 'LẠC', 'vui/ tận hưởng', 'N4'],
    ['楽しみにしています', 'たのしみにしています', 'LẠC', 'đang mong đợi/ lấy làm vui', 'N4'],
  ]],
  ['習', 'TẬP', '', 'N5', [
    ['習う', 'ならう', 'TẬP', 'học, tập', 'N5'],
    ['習います', 'ならいます', '', 'học (ai đó dạy)', 'N5'],
    ['練習します', 'れんしゅうします', 'LUYỆN TẬP', 'Luyện tập, thực hành', 'N5'],
    ['習慣', 'しゅうかん', 'TẬP QUÁN', 'tập quán/ thói quen', 'N4'],
    ['予習します', 'よしゅうします', 'DỰ TẬP', 'chuẩn bị bài mới', 'N4'],
    ['復習します', 'ふくしゅうします', 'PHỤC TẬP', 'ôn bài cũ', 'N4'],
    ['習慣に慣れます', 'しゅうかんになれます', 'TẬP QUÁN', 'làm quen với tập quán', 'N4'],
  ]],
  ['聞', 'VĂN', '', 'N5', [
    ['新聞', 'しんぶん', 'TÂN VĂN', 'Báo', 'N5'],
    ['聞く', 'きく', 'VĂN', 'nghe', 'N5'],
    ['聞きます', 'ききます', '', 'nghe/ hỏi', 'N5'],
    ['先生に聞きます', 'せんせいにききます', 'TIÊN SINH VĂN', 'Hỏi giáo viên', 'N5'],
    ['新聞社', 'しんぶんしゃ', 'TÂN VĂN XÃ', 'toà soạn báo/ công ty báo chí', 'N4'],
    ['聞こえます', 'きこえます', '', 'nghe thấy được', 'N4'],
    ['音が聞こえます', 'おとがきこえます', 'ÂM VĂN', 'có thể nghe thấy âm thanh', 'N4'],
  ]],
  ['自', 'TỰ', '', 'N5', [
    ['自動車', 'じどうしゃ', 'TỰ ĐỘNG XA', 'ô tô, xe hơi', 'N5'],
    ['自転車', 'じてんしゃ', 'TỰ CHUYỂN XA', 'xe đạp', 'N5'],
    ['自分で', 'じぶんで', 'BỘ PHÂN', 'Tự mình', 'N5'],
    ['自分', 'じぶん', 'TỰ PHÂN', 'bản thân/ mình/ tự mình', 'N4'],
    ['自然', 'しぜん', 'TỰ NHIÊN', 'tự nhiên/ thiên nhiên', 'N4'],
    ['自由に', 'じゆうに', 'TỰ DO', 'tự do/ tuỳ thích/ thoải mái', 'N4'],
    ['自動販売機', 'じどうはんばいき', 'TỰ ĐỘNG PHIÊN MẠI CƠ', 'máy bán hàng tự động', 'N4'],
  ]],
  ['調', 'ĐIỀU', '', 'N5', [
    ['調子', 'ちょうし', 'ĐIỀU TỬ', 'Tình trạng, trạng thái', 'N5'],
    ['調べます', 'しらべます', 'ĐIỀU', 'Tìm hiểu, điều tra, xem', 'N5'],
    ['調子がいい', 'ちょうしがいい', 'ĐIỀU TỬ', 'Trong tình trạng tốt', 'N5'],
    ['調子がわるい', 'ちょうしがわるい', 'ĐIỀU TỬ', 'Trong tình trạng xấu', 'N5'],
    ['調べ', 'しらべ', 'ĐIỀU', 'điều tra/ khảo sát', 'N4'],
    ['調味料', 'ちょうみりょう', 'ĐIỀU VỊ LIỆU', 'gia vị', 'N4'],
    ['調節します', 'ちょうせつします', 'ĐIỀU TIẾT', 'điều tiết/ điều chỉnh', 'N4'],
  ]],
  ['通', 'THÔNG', '', 'N5', [
    ['普通', 'ふつう', 'PHỔ THÔNG', 'tàu thường (dừng cả ở các ga lẻ)', 'N5'],
    ['交通', 'こうつう', 'GIAO THÔNG', 'Giao thông, đi lại', 'N5'],
    ['通信販売', 'つうしんはんばい', 'THÔNG TÍN PHIÊN MẠI', 'bán hàng qua bưu điện/ thương mại viễn thông', 'N4'],
    ['通います', 'かよいます', '', 'đi lại thường xuyên (học, làm)', 'N4'],
    ['道を通ります', 'みちをとおります', 'ĐẠO THÔNG', 'đi qua đường', 'N4'],
    ['大学に通います', 'だいがくにかよいます', 'ĐẠI HỌC THÔNG', 'đi đi về về trường đại học', 'N4'],
    ['通ります', 'とおります', '', 'đi qua', 'N3'],
  ]],
  ['週', 'CHU', '', 'N5', [
    ['今週', 'こんしゅう', 'KIM CHU', 'tuần này', 'N5'],
    ['先週', 'せんしゅう', 'TIÊN CHU', 'tuần trước', 'N5'],
    ['来週', 'らいしゅう', 'LAI CHU', 'tuần sau', 'N5'],
    ['週末', 'しゅうまつ', 'CHU MẠT', 'cuối tuần', 'N5'],
    ['～週間', '～しゅうかん', 'CHU GIAN', '～ tuần', 'N5'],
    ['毎週', 'まいしゅう', 'MỖI CHU', 'hàng tuần', 'N4'],
    ['再来週', 'さらいしゅう', 'TÁI LAI CHU', 'tuần sau nữa', 'N4'],
  ]],
  ['長', 'TRƯỜNG', 'TRƯỞNG', 'N5', [
    ['長い', 'ながい', 'TRƯỜNG', 'Dài', 'N5'],
    ['社長', 'しゃちょう', 'XÃ TRƯỞNG', 'Giám đốc', 'N5'],
    ['課長', 'かちょう', 'KHOA TRƯỜNG', 'Tổ trưởng', 'N5'],
    ['部長', 'ぶちょう', 'BỘ TRƯỞNG', 'Trưởng phòng', 'N5'],
    ['長さ', 'ながさ', 'TRƯỜNG', 'chiều dài', 'N4'],
    ['長男', 'ちょうなん', 'TRƯỜNG NAM', 'trưởng nam/ con trai cả', 'N4'],
    ['長生きします', 'ながいきします', 'TRƯỜNG SINH', 'sống lâu', 'N4'],
  ]],
  ['験', 'NGHIỆM', '', 'N5', [
    ['試験', 'しけん', 'THÍ NGHIỆM', 'Kỳ thi, bài thi', 'N5'],
    ['経験', 'けいけん', 'KINH NGHIỆM', 'kinh nghiệm', 'N4'],
    ['実験', 'じっけん', 'THỰC NGHIỆM', 'thí nghiệm/ thực nghiệm', 'N4'],
    ['試験を受けます', 'しけんをうけます', 'THỨC NGHIỆM THỤ', 'thi/ dự kỳ thi', 'N4'],
    ['試験に合格します', 'しけんにごうかくします', 'THỨC NGHIỆM HỢP CÁCH', 'đỗ thi/ đậu kỳ thi', 'N4'],
    ['試験に失敗します', 'しけんにしっぱいします', 'THỨC NGHIỆM THẤT BẠI', 'thất bại/ trượt thi', 'N4'],
    ['経験します', 'けいけんします', '', 'trải nghiệm', 'N3'],
  ]],
  ['作', 'TÁC', '', 'N5', [
    ['作ります', 'つくります', 'TÁC', 'Làm, chế tạo, sản xuất', 'N5'],
    ['作文', 'さくぶん', 'TÁC VĂN', 'bài văn/ bài tập làm văn', 'N4'],
    ['操作', 'そうさ', 'THAO TÁC', 'thao tác', 'N4'],
    ['作品', 'さくひん', 'TÁC PHẨM', 'tác phẩm', 'N4'],
    ['作家', 'さっか', 'TÁC GIA', 'nhà văn', 'N4'],
    ['作曲', 'さっきょく', 'TÁC KHÚC', 'sáng tác nhạc', 'N4'],
  ]],
  ['味', 'VỊ', '', 'N5', [
    ['趣味', 'しゅみ', 'THÚ VỊ', 'Sở thích, thú vui', 'N5'],
    ['意味', 'いみ', 'Ý VỊ', 'Ý nghĩa', 'N5'],
    ['味', 'あじ', 'VỊ', 'vị/ mùi vị', 'N4'],
    ['興味', 'きょうみ', 'HƯNG VỊ', 'sự quan tâm/ hứng thú', 'N4'],
    ['調味料', 'ちょうみりょう', 'ĐIỀU VỊ LIỆU', 'gia vị', 'N4'],
    ['味がします', 'あじがします', 'VỊ', 'có vị', 'N4'],
  ]],
  ['員', 'VIÊN', '', 'N5', [
    ['社員', 'しゃいん', 'XÃ VIÊN', 'Nhân viên công ty ~', 'N5'],
    ['会社員', 'かいしゃいん', 'HỘI XÃ VIÊN', 'Nhân viên công ty', 'N5'],
    ['銀行員', 'ぎんこういん', 'NGÂN HÀNH VIÊN', 'Nhân viên ngân hàng', 'N5'],
    ['駅員', 'えきいん', 'DỊCH VIÊN', 'nhân viên nhà ga', 'N4'],
    ['会員', 'かいいん', 'HỘI VIÊN', 'hội viên/ thành viên', 'N4'],
    ['係員', 'かかりいん', 'HỆ VIÊN', 'nhân viên phụ trách', 'N4'],
  ]],
  ['回', 'HỒI', '', 'N5', [
    ['～回', '～かい', 'HỒI', '～ lần', 'N5'],
    ['何回も', 'なんかいも', 'HÀ HỒI', 'Nhiều lần', 'N5'],
    ['回します', 'まわします', 'HỒI', 'Vặn, xoay', 'N5'],
    ['回覧', 'かいらん', 'HỒI LÃM', 'tập thông báo (luân chuyển)', 'N4'],
    ['回答', 'かいとう', 'HỒI ĐÁP', 'câu trả lời/ lời giải', 'N4'],
    ['回ります', 'まわります', '', 'quay/ xoay tròn', 'N3'],
  ]],
  ['外', 'NGOẠI', '', 'N5', [
    ['外', 'そと', 'NGOẠI', 'Ngoài', 'N5'],
    ['外国', 'がいこく', 'NGOẠI QUỐC', 'nước ngoài', 'N5'],
    ['海外', 'かいがい', 'HẢI NGOẠI', 'nước ngoài/ hải ngoại', 'N4'],
    ['郊外', 'こうがい', 'GIAO NGOẠI', 'ngoại ô', 'N4'],
    ['席を外します', 'せきをはずします', 'TỊCH NGOẠI', 'rời khỏi chỗ ngồi/ đi vắng/ không có ở chỗ', 'N4'],
    ['ボタンが外れます', 'ボタンがはずれます', 'NGOẠI', 'cúc bị tuột', 'N4'],
  ]],
  ['心', 'TÂM', '', 'N5', [
    ['心配します', 'しんぱいします', 'TÂM PHỐI', 'Lo lắng', 'N5'],
    ['心', 'こころ', 'TÂM', 'trái tim/ tấm lòng', 'N4'],
    ['熱心', 'ねっしん', 'NHIỆT TÂM', 'nhiệt tâm/ nhiệt tình/ hết lòng', 'N4'],
    ['心配', 'しんぱい', 'TÂM PHỐI', 'lo lắng', 'N4'],
    ['心から', 'こころから', 'TÂM', 'từ đáy lòng/ chân thành', 'N4'],
    ['安心します', 'あんしんします', 'AN TÂM', 'yên tâm', 'N4'],
  ]],
  ['急', 'CẤP', '', 'N5', [
    ['急行', 'きゅうこう', 'CẤP HÀNH', 'tàu tốc hành', 'N5'],
    ['特急', 'とっきゅう', 'ĐẶC CẤP', 'tàu tốc hành đặc biệt', 'N5'],
    ['急ぎます', 'いそぎます', 'CẤP', 'Vội, gấp', 'N5'],
    ['急用', 'きゅうよう', 'CẤP DỤNG', 'việc gấp/ việc khẩn', 'N4'],
    ['急に', 'きゅうに', 'CẤP', 'đột nhiên/ gấp', 'N4'],
    ['救急車', 'きゅうきゅうしゃ', 'CỨU CẤP XA', 'xe cấp cứu', 'N4'],
  ]],
  ['止', 'CHỈ', '', 'N5', [
    ['止めます', 'とめます', 'CHỈ', 'Dừng, đỗ', 'N5'],
    ['中止', 'ちゅうし', 'TRUNG CHỈ', 'dừng/ đình chỉ', 'N4'],
    ['使用禁止', 'しようきんし', 'SỬ DỤNG CẤM CHỈ', 'cấm sử dụng', 'N4'],
    ['立入禁止', 'たちいりきんし', 'LẬP NHẬP CẤM CHỈ', 'cấm vào/ cấm vào khu vực này', 'N4'],
    ['止まります', 'とまります', '', 'dừng lại', 'N4'],
    ['エレベーターが止まります', 'エレベーターがとまります', 'CHỈ', 'thang máy dừng lại', 'N4'],
  ]],
  ['毎', 'MỖI', '', 'N5', [
    ['毎日', 'まいにち', 'MỖI NHẬT', 'Hàng ngày, mỗi ngày', 'N5'],
    ['毎晩', 'まいばん', 'MỖI VÃN', 'Hàng tối, mỗi tối', 'N5'],
    ['毎朝', 'まいあさ', 'MỖI TRIỀU', 'Hàng sáng, mỗi sáng', 'N5'],
    ['毎年', 'まいとし', 'MỖI NIÊN', 'hàng năm', 'N4'],
    ['毎月', 'まいつき', 'MỖI NGUYỆT', 'hàng tháng', 'N4'],
    ['毎週', 'まいしゅう', 'MỖI CHU', 'hàng tuần', 'N4'],
  ]],
  ['理', 'LÝ', '', 'N5', [
    ['料理', 'りょうり', 'LIỆU LÝ', 'món ăn, việc nấu ăn', 'N5'],
    ['無理', 'むり', 'VÔ LÝ', 'Không thể, quá sức', 'N5'],
    ['修理します', 'しゅうりします', 'TU LÝ', 'Sửa chữa, tu sửa', 'N5'],
    ['理由', 'りゆう', 'LÝ DO', 'lý do', 'N4'],
    ['管理人', 'かんりにん', 'QUẢN LÝ NHÂN', 'người quản lý', 'N4'],
    ['無理をします', 'むりをします', 'VÔ LÝ', 'làm quá sức/ làm điều quá khả năng', 'N4'],
  ]],
  ['用', 'DỤNG', '', 'N5', [
    ['用事', 'ようじ', 'DỤNG SỰ', 'việc bận, công chuyện', 'N5'],
    ['急用', 'きゅうよう', 'CẤP DỤNG', 'việc gấp/ việc khẩn', 'N4'],
    ['使用中', 'しようちゅう', 'SỬ DỤNG TRUNG', 'đang sử dụng/ đang có người dùng', 'N4'],
    ['使用禁止', 'しようきんし', 'SỬ DỤNG CẤM CHỈ', 'cấm sử dụng', 'N4'],
    ['利用します', 'りようします', 'LỢI DỤNG', 'sử dụng/ dùng/ tận dụng', 'N4'],
    ['用意します', 'よういします', 'DỤNG Ý', 'chuẩn bị', 'N4'],
  ]],
  ['男', 'NAM', '', 'N5', [
    ['男の人', 'おとこのひと', 'NAM NHÂN', 'người đàn ông', 'N5'],
    ['男の子', 'おとこのこ', 'NAM TỬ', 'cậu con trai', 'N5'],
    ['男', 'おとこ', 'NAM', 'người đàn ông/ nam giới', 'N4'],
    ['男性', 'だんせい', 'NAM TÍNH', 'nam giới', 'N4'],
    ['長男', 'ちょうなん', 'TRƯỜNG NAM', 'trưởng nam/ con trai cả', 'N4'],
    ['男性と比べます', 'だんせいとくらべます', 'NAM TÍNH TỶ', 'so sánh với nam giới', 'N4'],
  ]],
  ['番', 'PHIÊN', '', 'N5', [
    ['何番', 'なんばん', 'HÀ PHIÊN', 'Số bao nhiêu, số mấy', 'N5'],
    ['番号', 'ばんごう', 'PHIÊN HIỆU', 'Số (số điện thoại, số phòng)', 'N5'],
    ['暗証番号', 'あんしょうばんごう', 'ÁM CHỨNG PHIÊN HIỆU', 'Mật khẩu', 'N5'],
    ['番組', 'ばんぐみ', 'PHIÊN TỔ', 'chương trình phát thanh/ chương trình truyền hình', 'N4'],
    ['交番', 'こうばん', 'GIAO PHIÊN', 'đồn cảnh sát', 'N4'],
    ['留守番', 'るすばん', 'LƯU THỦ PHIÊN', 'trông nhà/ giữ nhà', 'N4'],
  ]],
  ['知', 'TRI', '', 'N5', [
    ['知ります', 'しります', 'TRI', 'Biết', 'N5'],
    ['知っています', 'しっています', 'TRI', 'Biết', 'N5'],
    ['知識', 'ちしき', 'TRI THỨC', 'tri thức/ kiến thức', 'N4'],
    ['お知らせ', 'おしらせ', 'TRI', 'thông báo', 'N4'],
    ['知らせます', 'しらせます', 'TRI', 'thông báo/ báo', 'N4'],
    ['知り合います', 'しりあいます', 'TRI HỢP', 'làm quen/ gặp gỡ làm quen', 'N4'],
  ]],
  ['立', 'LẬP', '', 'N5', [
    ['立ちます', 'たちます', 'LẬP', 'Đứng', 'N5'],
    ['役に立ちます', 'やくにたちます', 'DỊCH LẬP', 'Giúp ích', 'N5'],
    ['立入禁止', 'たちいりきんし', 'LẬP NHẬP CẤM CHỈ', 'cấm vào/ cấm vào khu vực này', 'N4'],
    ['立てます', 'たてます', '', 'dựng lên/ đặt đứng', 'N4'],
    ['組み立てます', 'くみたてます', 'TỔ LẬP', 'lắp/ lắp ráp/ lắp đặt', 'N4'],
    ['埋め立てます', 'うめたてます', 'MAI LẬP', 'lấp (biển)', 'N4'],
  ]],
  ['花', 'HOA', '', 'N5', [
    ['花', 'はな', 'HOA', 'hoa', 'N5'],
    ['お花見', 'おはなみ', 'HOA KIẾN', 'việc ngắm hoa anh đào', 'N5'],
    ['生け花', 'いけばな', 'SINH HOA', 'Nghệ thuật cắm hoa', 'N5'],
    ['花火', 'はなび', 'HOA HỎA', 'pháo hoa', 'N4'],
    ['花瓶', 'かびん', 'HOA BÌNH', 'lọ hoa', 'N4'],
    ['花が咲きます', 'はながさきます', 'HOA TIẾU', 'hoa nở', 'N4'],
  ]],
  ['試', 'THÍ', '', 'N5', [
    ['試験', 'しけん', 'THÍ NGHIỆM', 'Kỳ thi, bài thi', 'N5'],
    ['試合', 'しあい', 'THỨC HỢP', 'Trận đấu', 'N5'],
    ['試合に出ます', 'しあいにでます', 'THỨC HỢP XUẤT', 'tham gia trận đấu/ ra sân thi đấu', 'N4'],
    ['試験を受けます', 'しけんをうけます', 'THỨC NGHIỆM THỤ', 'thi/ dự kỳ thi', 'N4'],
    ['試験に合格します', 'しけんにごうかくします', 'THỨC NGHIỆM HỢP CÁCH', 'đỗ thi/ đậu kỳ thi', 'N4'],
    ['試験に失敗します', 'しけんにしっぱいします', 'THỨC NGHIỆM THẤT BẠI', 'thất bại/ trượt thi', 'N4'],
  ]],
  ['音', 'ÂM', '', 'N5', [
    ['音', 'おと', 'ÂM', 'Âm thanh', 'N5'],
    ['音楽', 'おんがく', 'ÂM NHẠC/LẠC', 'âm nhạc', 'N5'],
    ['騒音', 'そうおん', 'TAO ÂM', 'tiếng ồn', 'N4'],
    ['発音', 'はつおん', 'PHÁT ÂM', 'phát âm', 'N4'],
    ['音がします', 'おとがします', 'ÂM', 'có tiếng/ nghe thấy tiếng động', 'N4'],
    ['音が聞こえます', 'おとがきこえます', 'ÂM VĂN', 'có thể nghe thấy âm thanh', 'N4'],
  ]],
  ['世', 'THẾ', '', 'N5', [
    ['世界', 'せかい', 'THẾ GIỚI', 'Thế giới', 'N5'],
    ['世紀', 'せいき', 'THẾ KỶ', 'thế kỷ', 'N4'],
    ['世界中', 'せかいじゅう', 'THẾ GIỚI TRUNG', 'khắp thế giới/ toàn thế giới', 'N4'],
    ['世界的に', 'せかいてきに', 'THẾ GIỚI', 'tầm cỡ thế giới', 'N4'],
    ['世話をします', 'せわをします', 'THẾ THOẠI', 'chăm sóc/ giúp đỡ', 'N4'],
  ]],
  ['予', 'DỰ', '', 'N5', [
    ['予約します', 'よやくします', 'DỰ ƯỚC', 'Đặt chỗ, đặt trước', 'N5'],
    ['予定', 'よてい', 'DỰ ĐỊNH', 'kế hoạch/ dự định', 'N4'],
    ['予定表', 'よていひょう', 'DỰ ĐỊNH BIỂU', 'lịch/ thời khóa biểu', 'N4'],
    ['天気予報', 'てんきよほう', 'THIÊN KHÍ DỰ BÁO', 'dự báo thời tiết', 'N4'],
    ['予習します', 'よしゅうします', 'DỰ TẬP', 'chuẩn bị bài mới', 'N4'],
  ]],
  ['付', 'PHÓ', '', 'N5', [
    ['受付', 'うけつけ', 'THỤ PHÓ', 'bộ phận tiếp tân, phòng thường trực', 'N5'],
    ['付けます', 'つけます', 'PHÓ', 'lắp/ gắn/ ghép thêm/ đặt tên', 'N4'],
    ['丸を付けます', 'まるをつけます', 'HOÀN PHÓ', 'khoanh tròn/ đánh dấu tròn', 'N4'],
    ['荷物が片付きます', 'にもつがかたづきます', 'HÀ VẬT PHIẾN PHÓ', 'đồ đạc được dọn gọn/ đồ đạc được sắp xếp ngăn nắp', 'N4'],
    ['ポケットが付きます', 'ポケットがつきます', 'PHÓ', 'có gắn túi/ có kèm theo túi', 'N4'],
  ]],
  ['別', 'BIỆT', '', 'N5', [
    ['別々に', 'べつべつに', 'BIỆT', 'riêng ra/ để riêng', 'N5'],
    ['別の', 'べつの', 'BIỆT', 'khác/ một cái khác', 'N4'],
    ['特別', 'とくべつ', 'ĐẶC BIỆT', 'đặc biệt', 'N4'],
    ['別れます', 'わかれます', 'BIỆT', 'chia tay/ từ biệt', 'N4'],
    ['人が別れます', 'ひとがわかれます', 'NHÂN BIỆT', 'người chia tay/ chia ra', 'N4'],
  ]],
  ['口', 'KHẨU', '', 'N5', [
    ['口', 'くち', 'KHẨU', 'Miệng', 'N5'],
    ['入口', 'いりぐち', 'NHẬP KHẨU', 'lối vào/ cửa vào', 'N4'],
    ['出口', 'でぐち', 'XUẤT KHẨU', 'lối ra/ cửa ra', 'N4'],
    ['人口', 'じんこう', 'NHÂN KHẨU', 'dân số', 'N4'],
    ['非常口', 'ひじょうぐち', 'PHI THƯỜNG KHẨU', 'lối thoát hiểm/ cửa thoát hiểm', 'N4'],
  ]],
  ['国', 'QUỐC', '', 'N5', [
    ['中国', 'ちゅうごく', 'TRUNG QUỐC', 'Trung Quốc', 'N5'],
    ['お国', 'おくに', 'QUỐC', 'đất nước', 'N5'],
    ['外国', 'がいこく', 'NGOẠI QUỐC', 'nước ngoài', 'N5'],
    ['国際～', 'こくさい～', 'QUỐC TẾ', '~ Quốc tế', 'N5'],
    ['再入国ビザ', 'さいにゅうこくビザ', 'TÁI NHẬP QUỐC', 'thị thực tái nhập cảnh', 'N4'],
  ]],
  ['地', 'ĐỊA', '', 'N5', [
    ['地図', 'ちず', 'ĐỊA ĐỒ', 'Bản đồ', 'N5'],
    ['地下鉄', 'ちかてつ', 'ĐỊA HẠ THIẾT', 'tàu điện ngầm', 'N5'],
    ['地震', 'じしん', 'ĐỊA CHẤN', 'động đất', 'N4'],
    ['地球', 'ちきゅう', 'ĐỊA CẦU', 'trái đất', 'N4'],
    ['土地', 'とち', 'THỔ ĐỊA', 'đất/ diện tích đất', 'N4'],
  ]],
  ['売', 'MẠI', '', 'N5', [
    ['売り場', 'うりば', 'MẠI TRƯỜNG', 'quầy bán (trong một cửa hàng bách hóa)', 'N5'],
    ['売ります', 'うります', 'MẠI', 'Bán', 'N5'],
    ['通信販売', 'つうしんはんばい', 'THÔNG TÍN PHIÊN MẠI', 'bán hàng qua bưu điện/ thương mại viễn thông', 'N4'],
    ['売れます', 'うれます', 'MẠI', 'bán chạy/ được bán', 'N4'],
    ['自動販売機', 'じどうはんばいき', 'TỰ ĐỘNG PHIÊN MẠI CƠ', 'máy bán hàng tự động', 'N4'],
  ]],
  ['変', 'BIẾN', '', 'N5', [
    ['大変', 'たいへん', 'ĐẠI BIẾN', 'vất vả, khó khăn, khổ', 'N5'],
    ['変えます', 'かえます', 'BIẾN', 'Đổi', 'N5'],
    ['変', 'へん', 'BIẾN', 'lạ/ kỳ quặc', 'N4'],
    ['変わります', 'かわります', '', 'thay đổi', 'N4'],
    ['色が変わります', 'いろがかわります', 'SẮC PHẢN', 'đổi màu/ thay đổi màu', 'N4'],
  ]],
  ['室', 'THẤT', '', 'N5', [
    ['教室', 'きょうしつ', 'GIÁO THẤT', 'lớp học, phòng học', 'N5'],
    ['和室', 'わしつ', 'HÒA THẤT', 'Phòng kiểu Nhật', 'N5'],
    ['会議室', 'かいぎしつ', 'HỘI NGHỊ THẤT', 'phòng họp', 'N5'],
    ['研究室', 'けんきゅうしつ', 'NGHIÊN CỨU THẤT', 'phòng nghiên cứu', 'N4'],
    ['教室を開きます', 'きょうしつをひらきます', 'GIÁO THẤT KHAI', 'mở lớp học', 'N4'],
  ]],
  ['屋', 'ỐC', '', 'N5', [
    ['部屋', 'へや', 'BỘ ÓC', 'căn phòng', 'N5'],
    ['本屋', 'ほんや', 'BỔN ỐC', 'hiệu sách', 'N5'],
    ['床屋', 'とこや', 'SÀNG ỐC', 'Hiệu cắt tóc', 'N5'],
    ['電気屋', 'でんきや', 'ĐIỆN KHÍ ỐC', 'Cửa hàng đồ điện', 'N5'],
    ['屋上', 'おくじょう', 'ỐC THƯỢNG', 'sân thượng/ nóc nhà', 'N4'],
  ]],
  ['店', 'ĐIẾM', '', 'N5', [
    ['店', 'みせ', 'ĐIẾM', 'cửa hàng, tiệm', 'N5'],
    ['喫茶店', 'きっさてん', 'KHIẾT TRÀ ĐIẾM', 'quán giải khát, quán cà phê', 'N5'],
    ['喫茶店を出ます', 'きっさてんをでます', 'KHIẾT TRÀ ĐIẾM XUẤT', 'ra khỏi quán giải khát', 'N5'],
    ['喫茶店に入ります', 'きっさてんにはいります', 'NHẬP', 'vào quán giải khát', 'N5'],
    ['支店', 'してん', 'CHI ĐIẾM', 'chi nhánh', 'N4'],
  ]],
  ['引', 'DẪN', '', 'N5', [
    ['引きます', 'ひきます', 'DẪN', 'Kéo', 'N5'],
    ['引っ越しします', 'ひっこしします', 'DẪN VIỆT', 'Chuyển nhà', 'N5'],
    ['お引き出しですか', 'おひきだしですか', 'DẪN XUẤT', 'Anh/ chị rút tiền ạ?', 'N5'],
    ['引き出し', 'ひきだし', 'DẪN XUẤT', 'ngăn kéo', 'N4'],
    ['引っ越します', 'ひっこします', '', 'chuyển nhà', 'N4'],
  ]],
  ['悪', 'ÁC', '', 'N5', [
    ['悪い', 'わるい', 'ÁC', 'xấu', 'N5'],
    ['気分が悪い', 'きぶんがわるい', 'KHÍ PHÂN ÁC', 'thấy khó chịu/ thấy mệt/ tâm trạng tệ', 'N4'],
    ['都合が悪い', 'つごうがわるい', 'ĐÔ HỢP ÁC', 'không tiện/ bận/ vướng việc', 'N4'],
    ['縁起が悪い', 'えんぎがわるい', 'DUYÊN KHỞI ÁC', 'không may/ không lành', 'N4'],
    ['気持ちが悪い', 'きもちがわるい', 'KHÍ TRÌ ÁC', 'khó chịu', 'N4'],
  ]],
  ['意', 'Ý', '', 'N5', [
    ['意見', 'いけん', 'Ý KIẾN', 'Ý kiến', 'N5'],
    ['意味', 'いみ', 'Ý VỊ', 'Ý nghĩa', 'N5'],
    ['注意します', 'ちゅういします', 'CHÚ Ý', 'chú ý/ nhắc nhở', 'N4'],
    ['用意します', 'よういします', 'DỤNG Ý', 'chuẩn bị', 'N4'],
    ['車に注意します', 'くるまにちゅういします', 'XA CHÚ Ý', 'chú ý xe cộ/ coi chừng xe', 'N4'],
  ]],
  ['故', 'CỐ', '', 'N5', [
    ['故障', 'こしょう', 'CỐ CHƯỚNG', 'Hỏng', 'N5'],
    ['事故', 'じこ', 'SỰ CỐ', 'tai nạn/ sự cố', 'N4'],
    ['故障が直ります', 'こしょうがなおります', 'CỐ CHƯỚNG TRỰC', 'chỗ hỏng được sửa/ hết hỏng', 'N4'],
    ['事故が起きます', 'じこがおきます', 'SỰ CỐ KHỞI', 'xảy ra tai nạn', 'N4'],
    ['事故に遭います', 'じこにあいます', 'SỰ CỐ TAO', 'gặp tai nạn', 'N4'],
  ]],
  ['新', 'TÂN', '', 'N5', [
    ['新聞', 'しんぶん', 'TÂN VĂN', 'Báo', 'N5'],
    ['新幹線', 'しんかんせん', 'TÂN CAN TUYẾN', 'tàu Shinkansen', 'N5'],
    ['新しい', 'あたらしい', 'TÂN', 'mới', 'N5'],
    ['新聞社', 'しんぶんしゃ', 'TÂN VĂN XÃ', 'toà soạn báo/ công ty báo chí', 'N4'],
    ['新年会', 'しんねんかい', 'TÂN NIÊN HỘI', 'tiệc tân niên', 'N4'],
  ]],
  ['明', 'MINH', '', 'N5', [
    ['明るい', 'あかるい', 'MINH', 'Sáng', 'N5'],
    ['説明します', 'せつめいします', 'THUYẾT MINH', 'Giải thích, trình bày', 'N5'],
    ['明日', 'あした', 'MINH NHẬT', 'ngày mai', 'N4'],
    ['説明書', 'せつめいしょ', 'THUYẾT MINH THƯ', 'quyển hướng dẫn/ bản hướng dẫn', 'N4'],
    ['発明します', 'はつめいします', 'PHÁT MINH', 'phát minh', 'N4'],
  ]],
  ['曲', 'KHÚC', '', 'N5', [
    ['曲がります', 'まがります', '', 'rẽ/ quẹo', 'N5'],
    ['右へ曲がります', 'みぎへまがります', 'HỮU KHÚC', 'Rẽ, quẹo phải', 'N5'],
    ['曲', 'きょく', 'KHÚC', 'bài hát/ bản nhạc', 'N4'],
    ['作曲', 'さっきょく', 'TÁC KHÚC', 'sáng tác nhạc', 'N4'],
    ['曲げます', 'まげます', '', 'bẻ cong/ uốn', 'N4'],
  ]],
  ['機', 'CƠ', '', 'N5', [
    ['機械', 'きかい', 'CƠ GIỚI', 'Máy, máy móc', 'N5'],
    ['飛行機', 'ひこうき', 'PHI HÀNH CƠ', 'máy bay', 'N5'],
    ['機会', 'きかい', 'CƠ HỘI', 'cơ hội', 'N4'],
    ['洗濯機', 'せんたくき', 'TẨY TRẠC CƠ', 'máy giặt', 'N4'],
    ['自動販売機', 'じどうはんばいき', 'TỰ ĐỘNG PHIÊN MẠI CƠ', 'máy bán hàng tự động', 'N4'],
  ]],
  ['歩', 'BỘ', '', 'N5', [
    ['歩いて', 'あるいて', 'BỘ', 'đi bộ', 'N5'],
    ['歩きます', 'あるきます', '', 'đi bộ', 'N5'],
    ['散歩します', 'さんぽします', '', 'đi dạo', 'N5'],
    ['道を歩きます', 'みちをあるきます', 'ĐẠO BỘ', 'Đi bộ trên đường', 'N5'],
    ['公園を散歩します', 'こうえんをさんぽします', 'CÔNG VIÊN TÁN BỘ', 'đi dạo ở công viên', 'N5'],
  ]],
  ['水', 'THỦY', '', 'N5', [
    ['水', 'みず', 'THỦY', 'nước', 'N5'],
    ['水曜日', 'すいようび', 'THỦY DIỆU NHẬT', 'Thứ tư', 'N5'],
    ['水道', 'すいどう', 'THỦY ĐẠO', 'nước máy', 'N4'],
    ['水泳', 'すいえい', 'THỦY VỊNH', 'bơi/ môn bơi', 'N4'],
    ['月・水・金', 'げつ・すい・きん', 'NGUYỆT THỦY KIM', 'thứ hai, thứ tư, thứ sáu', 'N4'],
  ]],
  ['洗', 'TẨY', '', 'N5', [
    ['お手洗い', 'おてあらい', 'THỦ TẢY', 'nhà vệ sinh, phòng vệ sinh, toa-lét', 'N5'],
    ['洗います', 'あらいます', 'TẨY', 'Rửa', 'N5'],
    ['洗濯します', 'せんたくします', 'TẨY TRẠC', 'Giặt', 'N5'],
    ['洗濯機', 'せんたくき', 'TẨY TRẠC CƠ', 'máy giặt', 'N4'],
    ['洗濯物', 'せんたくもの', 'TẨY TRẠC VẬT', 'quần áo giặt', 'N4'],
  ]],
  ['火', 'HỎA', '', 'N5', [
    ['火曜日', 'かようび', 'HỎA DIỆU NHẬT', 'Thứ ba', 'N5'],
    ['火', 'ひ', 'HỎA', 'lửa', 'N4'],
    ['花火', 'はなび', 'HOA HỎA', 'pháo hoa', 'N4'],
    ['火事', 'かじ', 'HỎA SỰ', 'hỏa hoạn/ cháy', 'N4'],
    ['火にかけます', 'ひにかけます', 'HỎA', 'cho qua lửa/ đun', 'N4'],
  ]],
  ['熱', 'NHIỆT', '', 'N5', [
    ['熱', 'ねつ', 'NHIỆT', 'Sốt', 'N5'],
    ['熱い', 'あつい', 'NHIỆT', 'nóng', 'N5'],
    ['熱心', 'ねっしん', 'NHIỆT TÂM', 'nhiệt tâm/ nhiệt tình/ hết lòng', 'N4'],
    ['熱が続きます', 'ねつがつづきます', 'NHIỆT TỤC', 'sốt kéo dài/ vẫn còn sốt', 'N4'],
    ['熱を出します', 'ねつをだします', 'NHIỆT XUẤT', 'bị sốt', 'N4'],
  ]],
  ['留', 'LƯU', '', 'N5', [
    ['書留', 'かきとめ', 'THƯ LƯU', 'gửi bảo đảm', 'N5'],
    ['留学生', 'りゅうがくせい', 'LƯU HỌC SINH', 'du học sinh', 'N5'],
    ['留学します', 'りゅうがくします', 'LƯU HỌC', 'du học', 'N5'],
    ['留守', 'るす', 'LƯU THỦ', 'vắng nhà/ không có nhà', 'N4'],
    ['留守番', 'るすばん', 'LƯU THỦ PHIÊN', 'trông nhà/ giữ nhà', 'N4'],
  ]],
  ['空', 'KHÔNG', '', 'N5', [
    ['空港', 'くうこう', 'KHÔNG CẢNG', 'Sân bay', 'N5'],
    ['航空便', 'こうくうびん', 'HÀNG KHÔNG TIỆN', 'gửi bằng đường hàng không', 'N5'],
    ['空', 'そら', 'KHÔNG', 'bầu trời/ trời', 'N4'],
    ['空気', 'くうき', 'KHÔNG KHÍ', 'không khí', 'N4'],
    ['空港ができます', 'くうこうができます', 'KHÔNG CẢNG', 'sân bay được hoàn thành', 'N4'],
  ]],
  ['者', 'GIẢ', '', 'N5', [
    ['医者', 'いしゃ', 'Y GIẢ', 'Bác sĩ', 'N5'],
    ['研究者', 'けんきゅうしゃ', 'NGHIÊN CỨU GIẢ', 'Nhà nghiên cứu', 'N5'],
    ['歯医者', 'はいしゃ', 'XỈ Y GIẢ', 'Nha sĩ', 'N5'],
    ['者', 'もの', 'GIẢ', 'người', 'N4'],
    ['科学者', 'かがくしゃ', 'KHOA HỌC GIẢ', 'nhà khoa học', 'N4'],
  ]],
  ['転', 'CHUYỂN', '', 'N5', [
    ['転勤', 'てんきん', 'CHUYỂN CẦN', 'việc chuyển địa điểm làm việc', 'N5'],
    ['自転車', 'じてんしゃ', 'TỰ CHUYỂN XA', 'xe đạp', 'N5'],
    ['運転します', 'うんてんします', 'VẬN CHUYỂN', 'Lái', 'N5'],
    ['運転手', 'うんてんしゅ', 'VẬN CHUYỂN THỦ', 'tài xế', 'N4'],
    ['転びます', 'ころびます', '', 'ngã', 'N3'],
  ]],
  ['遅', 'TRÌ', '', 'N5', [
    ['遅い', 'おそい', 'TRÌ', 'Chậm, muộn', 'N5'],
    ['遅く', 'おそく', 'TRÌ', 'muộn/ khuya', 'N4'],
    ['遅れます', 'おくれます', '', 'muộn/ trễ', 'N4'],
    ['遅刻します', 'ちこくします', 'TRÌ KHẮC', 'đến chậm/ đến muộn', 'N4'],
    ['時間に遅れます', 'じかんにおくれます', 'THỜI GIAN TRÌ', 'muộn giờ/ trễ giờ/ đến muộn', 'N4'],
  ]],
  ['運', 'VẬN', '', 'N5', [
    ['運転します', 'うんてんします', 'VẬN CHUYỂN', 'Lái', 'N5'],
    ['運動会', 'うんどうかい', 'VẬN ĐỘNG HỘI', 'hội thao/ đại hội thể thao', 'N4'],
    ['運転手', 'うんてんしゅ', 'VẬN CHUYỂN THỦ', 'tài xế', 'N4'],
    ['運びます', 'はこびます', 'VẬN', 'mang/ chở/ vận chuyển', 'N4'],
    ['運動します', 'うんどうします', 'VẬN ĐỘNG', 'vận động/ tập thể thao', 'N4'],
  ]],
  ['重', 'TRỌNG', '', 'N5', [
    ['重い', 'おもい', 'TRỌNG', 'Nặng', 'N5'],
    ['重さ', 'おもさ', 'TRỌNG', 'cân nặng/ trọng lượng', 'N4'],
    ['重い病気', 'おもいびょうき', 'TRỌNG BỆNH KHÍ', 'bệnh nặng', 'N4'],
    ['重ねます', 'かさねます', '', 'xếp chồng lên', 'N3'],
    ['重なります', 'かさなります', '', 'chồng lên nhau/ trùng nhau', 'N3'],
  ]],
  ['降', 'GIÁNG', 'HÀNG', 'N5', [
    ['降ります', 'ふります', '', '(mưa, tuyết) rơi', 'N5'],
    ['降ります', 'おります', '', 'xuống (xe)', 'N5'],
    ['雨が降ります', 'あめがふります', 'VŨ GIÁNG/HÀNG', 'Rơi mưa, tuyết', 'N5'],
    ['電車を降ります', 'でんしゃをおります', 'ĐIỆN XA GIÁNG/HÀNG', 'Xuống tàu', 'N5'],
    ['降ろします', 'おろします', 'GIÁNG', 'cho xuống/ thả xuống', 'N4'],
  ]],
  ['館', 'QUÁN', '', 'N5', [
    ['図書館', 'としょかん', 'ĐỒ THƯ QUÁN', 'Thư viện', 'N5'],
    ['美術館', 'びじゅつかん', 'MỸ THUẬT QUÁN', 'Bảo tàng mỹ thuật', 'N5'],
    ['大使館', 'たいしかん', 'ĐẠI SỨ QUÁN', 'đại sứ quán', 'N5'],
    ['旅館', 'りょかん', 'LỮ QUÁN', 'khách sạn kiểu Nhật', 'N4'],
    ['体育館', 'たいいくかん', 'THỂ DỤC QUÁN', 'nhà tập/ nhà thi đấu thể thao', 'N4'],
  ]],
  ['乗', 'THỪA', '', 'N5', [
    ['乗り場', 'のりば', 'THỪA TRƯỜNG', 'bến xe, điểm lên xuống xe', 'N5'],
    ['乗り換えます', 'のりかえます', 'THỪA HOÁN', 'Chuyển, đổi (tàu)', 'N5'],
    ['電車に乗ります', 'でんしゃにのります', 'ĐIỆN XA THỪA', 'Đi, lên tàu', 'N5'],
    ['乗り物', 'のりもの', 'THỪA VẬT', 'phương tiện đi lại', 'N4'],
  ]],
  ['交', 'GIAO', '', 'N5', [
    ['交通', 'こうつう', 'GIAO THÔNG', 'Giao thông, đi lại', 'N5'],
    ['交差点', 'こうさてん', 'GIAO SAI ĐIỂM', 'Ngã tư', 'N5'],
    ['交番', 'こうばん', 'GIAO PHIÊN', 'đồn cảnh sát', 'N4'],
    ['交わります', 'まじわります', 'GIAO', 'giao lưu với/ quan hệ với', 'N4'],
  ]],
  ['使', 'SỬ', 'SỨ', 'N5', [
    ['大使館', 'たいしかん', 'ĐẠI SỨ QUÁN', 'đại sứ quán', 'N5'],
    ['使います', 'つかいます', 'SỬ/ SỨ', 'Dùng, sử dụng', 'N5'],
    ['使用中', 'しようちゅう', 'SỬ DỤNG TRUNG', 'đang sử dụng/ đang có người dùng', 'N4'],
    ['使用禁止', 'しようきんし', 'SỬ DỤNG CẤM CHỈ', 'cấm sử dụng', 'N4'],
  ]],
  ['兄', 'HUYNH', '', 'N5', [
    ['兄', 'あに', 'HUYNH', 'anh trai', 'N5'],
    ['兄弟', 'きょうだい', 'HUYNH ĐỆ', 'anh chị em', 'N5'],
    ['お兄さん', 'おにいさん', 'HUYNH', 'anh trai người khác', 'N5'],
    ['ライト兄弟', 'ライトきょうだい', 'HUYNH ĐỆ', 'anh em nhà Wright', 'N4'],
  ]],
  ['全', 'TOÀN', '', 'N5', [
    ['全然', 'ぜんぜん', 'TOÀN NHIÊN', 'hoàn toàn ~ không', 'N5'],
    ['全部', 'ぜんぶ', 'TOÀN BỘ', 'Toàn bộ, tất cả', 'N5'],
    ['全部で', 'ぜんぶで', 'TOÀN BỘ', 'tổng cộng', 'N5'],
    ['安全', 'あんぜん', 'AN TOÀN', 'an toàn', 'N4'],
  ]],
  ['前', 'TIỀN', '', 'N5', [
    ['前', 'まえ', 'TIỀN', 'trước', 'N5'],
    ['午前', 'ごぜん', 'NGỌ TIỀN', 'Sáng, trước 12 giờ trưa', 'N5'],
    ['名前', 'なまえ', 'DANH TIỀN', 'Tên', 'N5'],
    ['駅前', 'えきまえ', 'DỊCH TIỀN', 'khu vực trước nhà ga', 'N4'],
  ]],
  ['取', 'THỦ', '', 'N5', [
    ['取ります', 'とります', 'THỦ', 'Lấy', 'N5'],
    ['年を取ります', 'としをとります', 'NIÊN THỦ', 'thêm tuổi', 'N5'],
    ['取り替えます', 'とりかえます', 'THỦ THẾ', 'đổi/ thay', 'N4'],
    ['休みを取ります', 'やすみをとります', 'HƯU THỦ', 'xin nghỉ/ nghỉ phép', 'N4'],
  ]],
  ['品', 'PHẨM', '', 'N5', [
    ['製品', 'せいひん', 'CHẾ PHẨM', 'Sản phẩm', 'N5'],
    ['品物', 'しなもの', 'PHẨM VẬT', 'hàng hóa/ mặt hàng', 'N4'],
    ['作品', 'さくひん', 'TÁC PHẨM', 'tác phẩm', 'N4'],
    ['化粧品', 'けしょうひん', 'HÓA TRANG PHẨM', 'mỹ phẩm', 'N4'],
  ]],
  ['土', 'THỔ', '', 'N5', [
    ['土曜日', 'どようび', 'THỔ DIỆU NHẬT', 'Thứ bảy', 'N5'],
    ['お土産', 'おみやげ', 'THỔ SẢN', 'quà', 'N5'],
    ['土', 'ど', 'THỔ', 'thứ bảy', 'N4'],
    ['土地', 'とち', 'THỔ ĐỊA', 'đất/ diện tích đất', 'N4'],
  ]],
  ['女', 'NỮ', '', 'N5', [
    ['彼女', 'かのじょ', 'BỈ NỮ', 'chị ấy, bạn gái', 'N5'],
    ['女の人', 'おんなのひと', 'NỮ NHÂN', 'người đàn bà', 'N5'],
    ['女の子', 'おんなのこ', 'NỮ TỬ', 'cô con gái', 'N5'],
    ['女性', 'じょせい', 'NỮ TÍNH', 'nữ giới', 'N4'],
  ]],
  ['始', 'THỦY', '', 'N5', [
    ['始め', 'はじめ', 'THỦY', 'Ban đầu, đầu tiên', 'N5'],
    ['始めます', 'はじめます', 'THỦY', 'Bắt đầu', 'N5'],
    ['始まります', 'はじまります', '', 'bắt đầu', 'N5'],
    ['式が始まります', 'しきがはじまります', 'THỨC THỦY', 'bắt đầu buổi lễ', 'N4'],
  ]],
  ['婚', 'HÔN', '', 'N5', [
    ['結婚します', 'けっこんします', 'KẾT HÔN', 'kết hôn, lập gia đình, cưới', 'N5'],
    ['結婚式', 'けっこんしき', 'KẾT HÔN THỨC', 'lễ cưới/ đám cưới', 'N4'],
    ['離婚します', 'りこんします', 'LY HÔN', 'ly dị/ ly hôn', 'N4'],
    ['婚約します', 'こんやくします', 'HÔN ƯỚC', 'đính hôn', 'N4'],
  ]],
  ['小', 'TIỂU', '', 'N5', [
    ['小さい', 'ちいさい', 'TIỂU', 'bé, nhỏ', 'N5'],
    ['小説', 'しょうせつ', 'TIỂU THUYẾT', 'tiểu thuyết', 'N4'],
    ['小説家', 'しょうせつか', 'TIỂU THUYẾT GIA', 'tiểu thuyết gia/ nhà văn', 'N4'],
    ['小学校', 'しょうがっこう', 'TIỂU HỌC HIỆU', 'trường tiểu học', 'N4'],
  ]],
  ['山', 'SƠN', 'SAN', 'N5', [
    ['山', 'やま', 'SƠN/ SAN', 'núi', 'N5'],
    ['山に登ります', 'やまにのぼります', 'SƠN ĐĂNG', 'Leo núi', 'N5'],
    ['山登り', 'やまのぼり', 'SƠN ĐĂNG', 'leo núi', 'N4'],
    ['山が見えます', 'やまがみえます', 'SƠN/SAN KIẾN', 'có thể nhìn thấy núi', 'N4'],
  ]],
  ['建', 'KIẾN', '', 'N5', [
    ['建物', 'たてもの', 'KIẾN VẬT', 'Tòa nhà', 'N5'],
    ['建築家', 'けんちくか', 'KIẾN TRÚC GIA', 'kiến trúc sư', 'N4'],
    ['建てます', 'たてます', 'KIẾN', 'xây/ xây dựng', 'N4'],
    ['建ちます', 'たちます', '', '(nhà) được xây lên', 'N4'],
  ]],
  ['弟', 'ĐỆ', '', 'N5', [
    ['弟', 'おとうと', 'ĐỆ', 'em trai', 'N5'],
    ['兄弟', 'きょうだい', 'HUYNH ĐỆ', 'anh chị em', 'N5'],
    ['弟さん', 'おとうとさん', 'ĐỆ', 'em trai', 'N5'],
    ['ライト兄弟', 'ライトきょうだい', 'HUYNH ĐỆ', 'anh em nhà Wright', 'N4'],
  ]],
  ['忘', 'VONG', '', 'N5', [
    ['忘れます', 'わすれます', 'VONG', 'Quên', 'N5'],
    ['忘れ物', 'わすれもの', 'VONG VẬT', 'vật để quên', 'N4'],
    ['忘年会', 'ぼうねんかい', 'VONG NIÊN HỘI', 'tiệc tất niên', 'N4'],
    ['忘れ物に気がつきます', 'わすれものにきがつきます', 'VONG VẬT KHÍ', 'phát hiện ra đồ bỏ quên', 'N4'],
  ]],
  ['旅', 'LỮ', '', 'N5', [
    ['旅行', 'りょこう', 'LỮ HÀNH', 'Du lịch, chuyến du lịch', 'N5'],
    ['旅行します', 'りょこうします', '', 'du lịch', 'N5'],
    ['旅館', 'りょかん', 'LỮ QUÁN', 'khách sạn kiểu Nhật', 'N4'],
    ['旅行社', 'りょこうしゃ', 'LỮ HÀNH XÃ', 'công ty du lịch', 'N4'],
  ]],
  ['昼', 'TRÚ', '', 'N5', [
    ['昼', 'ひる', 'TRÚ', 'Buổi trưa, trưa', 'N5'],
    ['昼休み', 'ひるやすみ', 'TRÚ HƯU', 'Nghỉ trưa', 'N5'],
    ['昼ごはん', 'ひるごはん', 'TRÚ', 'cơm trưa', 'N5'],
    ['昼間', 'ひるま', 'TRÚ GIAN', 'ban ngày/ thời gian ban ngày', 'N4'],
  ]],
  ['晩', 'VÃN', '', 'N5', [
    ['晩', 'ばん', 'VÃN', 'Buổi tối, tối', 'N5'],
    ['今晩', 'こんばん', 'KIM VÃN', 'Tối nay', 'N5'],
    ['毎晩', 'まいばん', 'MỖI VÃN', 'Hàng tối, mỗi tối', 'N5'],
    ['晩ごはん', 'ばんごはん', 'VÃN', 'cơm tối', 'N5'],
  ]],
  ['校', 'HIỆU', '', 'N5', [
    ['学校', 'がっこう', 'HỌC HIỆU', 'trường học', 'N5'],
    ['高校', 'こうこう', 'CAO HIỆU', 'Trường trung học phổ thông', 'N5'],
    ['中学校', 'ちゅうがっこう', 'TRUNG HỌC HIỆU', 'trường trung học cơ sở', 'N4'],
    ['小学校', 'しょうがっこう', 'TIỂU HỌC HIỆU', 'trường tiểu học', 'N4'],
  ]],
  ['歌', 'CA', '', 'N5', [
    ['歌', 'うた', 'CA', 'bài hát', 'N5'],
    ['歌舞伎', 'かぶき', 'CA VŨ KỸ', 'Kabuki', 'N5'],
    ['歌います', 'うたいます', 'CA', 'Hát', 'N5'],
    ['歌手', 'かしゅ', 'CA THỦ', 'ca sĩ', 'N4'],
  ]],
  ['段', 'ĐOẠN', '', 'N5', [
    ['階段', 'かいだん', 'GIAI ĐOẠN', 'Cầu thang', 'N5'],
    ['値段', 'ねだん', 'TRỊ ĐOẠN', 'giá/ giá cả', 'N4'],
    ['値段が上がります', 'ねだんがあがります', 'TRỊ ĐOẠN THƯỢNG', 'giá tăng lên', 'N4'],
    ['値段が下がります', 'ねだんがさがります', 'TRỊ ĐOẠN HẠ', 'giá giảm xuống', 'N4'],
  ]],
  ['母', 'MẪU', '', 'N5', [
    ['母', 'はは', 'MẪU', 'mẹ', 'N5'],
    ['母の日', 'ははのひ', 'MẪU NHẬT', 'Ngày của Mẹ', 'N5'],
    ['お母さん', 'おかあさん', 'MẪU', 'Mẹ', 'N5'],
    ['祖母', 'そぼ', 'TỔ MẪU', 'bà (của mình)', 'N4'],
  ]],
  ['治', 'TRỊ', '', 'N5', [
    ['政治', 'せいじ', 'CHÍNH TRỊ', 'Chính trị', 'N5'],
    ['病気が治ります', 'びょうきがなおります', 'BỆNH KHÍ TRỊ', 'khỏi bệnh/ bệnh khỏi', 'N4'],
    ['治します', 'なおします', '', 'chữa khỏi', 'N3'],
    ['治ります', 'なおります', '', '(bệnh) khỏi', 'N3'],
  ]],
  ['港', 'CẢNG', '', 'N5', [
    ['空港', 'くうこう', 'KHÔNG CẢNG', 'Sân bay', 'N5'],
    ['香港', 'ホンコン', 'HƯƠNG CẢNG', 'Hồng kông', 'N5'],
    ['港', 'みなと', 'CẢNG', 'cảng/ bến cảng', 'N4'],
    ['空港ができます', 'くうこうができます', 'KHÔNG CẢNG', 'sân bay được hoàn thành', 'N4'],
  ]],
  ['焼', 'THIÊU', '', 'N5', [
    ['すき焼き', 'すきやき', 'THIÊU', 'Món sukiyaki', 'N5'],
    ['焼けます', 'やけます', 'THIÊU', 'cháy/ chín (nướng)', 'N4'],
    ['焼きます', 'やきます', 'THIÊU', 'nướng/ rán', 'N4'],
    ['肉が焼けます', 'にくがやけます', 'NHỤC THIÊU', 'thịt được nướng chín', 'N4'],
  ]],
  ['病', 'BỆNH', '', 'N5', [
    ['病院', 'びょういん', 'BỆNH VIỆN', 'Bệnh viện', 'N5'],
    ['病気', 'びょうき', 'BỆNH KHÍ', 'ốm, bệnh', 'N5'],
    ['重い病気', 'おもいびょうき', 'TRỌNG BỆNH KHÍ', 'bệnh nặng', 'N4'],
    ['病気が治ります', 'びょうきがなおります', 'BỆNH KHÍ TRỊ', 'khỏi bệnh/ bệnh khỏi', 'N4'],
  ]],
  ['登', 'ĐĂNG', '', 'N5', [
    ['登録', 'とうろく', 'ĐĂNG LỤC', 'việc đăng ký', 'N5'],
    ['登ります', 'のぼります', '', 'leo/ trèo', 'N5'],
    ['山に登ります', 'やまにのぼります', 'SƠN ĐĂNG', 'Leo núi', 'N5'],
    ['山登り', 'やまのぼり', 'SƠN ĐĂNG', 'leo núi', 'N4'],
  ]],
  ['目', 'MỤC', '', 'N5', [
    ['目', 'め', 'MỤC', 'Mắt', 'N5'],
    ['目が覚めます', 'めがさめます', 'MỤC GIÁC', 'tỉnh giấc/ mở mắt', 'N4'],
    ['目覚まし時計', 'めざましどけい', 'MỤC GIÁC THỜI KẾ', 'đồng hồ báo thức', 'N4'],
    ['お目にかかります', 'おめにかかります', 'MỤC', 'gặp (khiêm nhường ngữ)', 'N4'],
  ]],
  ['直', 'TRỰC', '', 'N5', [
    ['直します', 'なおします', 'TRỰC', 'Sửa, chữa', 'N5'],
    ['直接', 'ちょくせつ', 'TRỰC TIẾP', 'trực tiếp', 'N4'],
    ['直ります', 'なおります', '', 'được sửa xong', 'N4'],
    ['故障が直ります', 'こしょうがなおります', 'CỐ CHƯỚNG TRỰC', 'chỗ hỏng được sửa/ hết hỏng', 'N4'],
  ]],
  ['相', 'TƯƠNG', 'TƯỚNG', 'N5', [
    ['相撲', 'すもう', 'TƯƠNG PHÁC', 'Vật Sumo', 'N5'],
    ['首相', 'しゅしょう', 'THỦ TƯỚNG', 'Thủ tướng', 'N5'],
    ['相手', 'あいて', 'TƯỚNG THỦ', 'đối tác/ đối phương', 'N4'],
    ['相談します', 'そうだんします', 'TƯƠNG ĐÀM', 'trao đổi/ bàn bạc/ tư vấn', 'N4'],
  ]],
  ['確', 'XÁC', '', 'N5', [
    ['確認', 'かくにん', 'XÁC NHẬN', 'Sự xác nhận, sự kiểm tra', 'N5'],
    ['確か', 'たしか', 'XÁC', 'nếu không lầm thì', 'N4'],
    ['確かめます', 'たしかめます', 'XÁC', 'xác nhận/ kiểm tra lại', 'N4'],
    ['確認します', 'かくにんします', '', 'xác nhận', 'N3'],
  ]],
  ['答', 'ĐÁP', '', 'N5', [
    ['答え', 'こたえ', 'ĐÁP', 'Câu trả lời', 'N5'],
    ['回答', 'かいとう', 'HỒI ĐÁP', 'câu trả lời/ lời giải', 'N4'],
    ['答えます', 'こたえます', '', 'trả lời', 'N4'],
    ['質問に答えます', 'しつもんにこたえます', 'CHẤT VẤN ĐÁP', 'trả lời câu hỏi', 'N4'],
  ]],
  ['約', 'ƯỚC', '', 'N5', [
    ['約束', 'やくそく', 'ƯỚC THÚC', 'cuộc hẹn, lời hứa', 'N5'],
    ['予約します', 'よやくします', 'DỰ ƯỚC', 'Đặt chỗ, đặt trước', 'N5'],
    ['婚約します', 'こんやくします', 'HÔN ƯỚC', 'đính hôn', 'N4'],
    ['約束します', 'やくそくします', '', 'hứa hẹn', 'N4'],
  ]],
  ['紙', 'CHỈ', '', 'N5', [
    ['紙', 'かみ', 'CHỈ', 'giấy', 'N5'],
    ['手紙', 'てがみ', 'THỦ CHỈ', 'thư', 'N5'],
    ['手紙を出します', 'てがみをだします', 'THỦ CHỈ XUẤT', 'gửi thư', 'N5'],
    ['紙が破れます', 'かみがやぶれます', 'CHỈ PHÁ', 'giấy bị rách', 'N4'],
  ]],
  ['船', 'THUYỀN', '', 'N5', [
    ['船', 'ふね', 'THUYỀN', 'thuyền, tàu thủy', 'N5'],
    ['船便', 'ふなびん', 'THUYỀN TIỆN', 'gửi bằng đường biển', 'N5'],
    ['汽船', 'きせん', 'KHÍ THUYỀN', 'thuyền chạy bằng hơi nước', 'N4'],
    ['宇宙船', 'うちゅうせん', 'VŨ TRỤ THUYỀN', 'tàu vũ trụ', 'N4'],
  ]],
  ['荷', 'HÀ', '', 'N5', [
    ['荷物', 'にもつ', 'HÀ VẬT', 'đồ đạc, hành lý', 'N5'],
    ['荷物が届きます', 'にもつがとどきます', 'HÀ VẬT GIỚI', 'hành lý được gửi đến', 'N4'],
    ['荷物が落ちます', 'にもつがおちます', 'HÀ VẬT LẠC', 'hành lý bị rơi', 'N4'],
    ['荷物が片付きます', 'にもつがかたづきます', 'HÀ VẬT PHIẾN PHÓ', 'đồ đạc được dọn gọn/ đồ đạc được sắp xếp ngăn nắp', 'N4'],
  ]],
  ['覚', 'GIÁC', '', 'N5', [
    ['覚えます', 'おぼえます', 'GIÁC', 'Nhớ', 'N5'],
    ['目が覚めます', 'めがさめます', 'MỤC GIÁC', 'tỉnh giấc/ mở mắt', 'N4'],
    ['目覚まし時計', 'めざましどけい', 'MỤC GIÁC THỜI KẾ', 'đồng hồ báo thức', 'N4'],
    ['覚えていません', 'おぼえていません', 'GIÁC', 'Tôi không nhớ.', 'N4'],
  ]],
  ['親', 'THÂN', '', 'N5', [
    ['親切', 'しんせつ', 'THÂN THIẾT', 'tốt bụng, thân thiện', 'N5'],
    ['両親', 'りょうしん', 'LƯỠNG THÂN', 'bố mẹ', 'N5'],
    ['親子どんぶり', 'おやこどんぶり', 'THÂN TỬ', 'món oyakodon (cơm gà trứng)', 'N4'],
    ['親切にします', 'しんせつにします', 'THÂN THIẾT', 'đối xử thân thiện/ tốt với', 'N4'],
  ]],
  ['計', 'KẾ', '', 'N5', [
    ['時計', 'とけい', 'THỜI KẾ', 'Đồng hồ', 'N5'],
    ['時計が動きます', 'とけいがうごきます', 'THỜI KẾ ĐỘNG', 'Chuyển động, chạy đồng hồ', 'N5'],
    ['設計します', 'せっけいします', 'THIẾT KẾ', 'thiết kế', 'N4'],
    ['目覚まし時計', 'めざましどけい', 'MỤC GIÁC THỜI KẾ', 'đồng hồ báo thức', 'N4'],
  ]],
  ['説', 'THUYẾT', '', 'N5', [
    ['説明します', 'せつめいします', 'THUYẾT MINH', 'Giải thích, trình bày', 'N5'],
    ['小説', 'しょうせつ', 'TIỂU THUYẾT', 'tiểu thuyết', 'N4'],
    ['小説家', 'しょうせつか', 'TIỂU THUYẾT GIA', 'tiểu thuyết gia/ nhà văn', 'N4'],
    ['説明書', 'せつめいしょ', 'THUYẾT MINH THƯ', 'quyển hướng dẫn/ bản hướng dẫn', 'N4'],
  ]],
  ['議', 'NGHỊ', '', 'N5', [
    ['会議', 'かいぎ', 'HỘI NGHỊ', 'họp, cuộc họp', 'N5'],
    ['会議室', 'かいぎしつ', 'HỘI NGHỊ THẤT', 'phòng họp', 'N5'],
    ['不思議', 'ふしぎ', 'BẤT TƯ NGHỊ', 'kỳ lạ/ khó tin/ bí ẩn', 'N4'],
    ['会議に出席します', 'かいぎにしゅっせきします', 'HỘI NGHỊ XUẤT TỊCH', 'tham dự cuộc họp/ tham gia cuộc họp', 'N4'],
  ]],
  ['起', 'KHỞI', '', 'N5', [
    ['起きます', 'おきます', 'KHỞI', 'Dậy, thức dậy', 'N5'],
    ['起こします', 'おこします', 'KHỞI', 'đánh thức', 'N4'],
    ['縁起が悪い', 'えんぎがわるい', 'DUYÊN KHỞI ÁC', 'không may/ không lành', 'N4'],
    ['事故が起きます', 'じこがおきます', 'SỰ CỐ KHỞI', 'xảy ra tai nạn', 'N4'],
  ]],
  ['近', 'CẬN', '', 'N5', [
    ['近く', 'ちかく', 'CẬN', 'gần', 'N5'],
    ['近い', 'ちかい', 'CẬN', 'Gần', 'N5'],
    ['最近', 'さいきん', 'TỐI CẬN', 'Gần đây', 'N5'],
    ['近所', 'きんじょ', 'CẬN SỞ', 'khu lân cận/ gần nhà', 'N4'],
  ]],
  ['送', 'TỐNG', '', 'N5', [
    ['送る', 'おくる', 'TỐNG', 'gửi', 'N5'],
    ['送ります', 'おくります', '', 'gửi/ tiễn', 'N5'],
    ['人を送ります', 'ひとをおくります', 'NHÂN TỐNG', 'Đưa đi, đưa đến, tiễn một ai đó', 'N5'],
    ['放送します', 'ほうそうします', 'PHÓNG TỐNG', 'phát thanh/ phát sóng', 'N4'],
  ]],
  ['連', 'LIÊN', '', 'N5', [
    ['連れて来ます', 'つれてきます', 'LIÊN LAI', 'Dẫn đến', 'N5'],
    ['連れて行きます', 'つれていきます', 'LIÊN HÀNH', 'Dẫn đi', 'N5'],
    ['連休', 'れんきゅう', 'LIÊN HƯU', 'ngày nghỉ liền nhau/ kỳ nghỉ dài', 'N4'],
    ['連絡します', 'れんらくします', 'LIÊN LẠC', 'liên lạc/ liên hệ', 'N4'],
  ]],
  ['遠', 'VIỄN', '', 'N5', [
    ['遠い', 'とおい', 'VIỄN', 'Xa', 'N5'],
    ['遠く', 'とおく', 'VIỄN', 'xa/ ở xa', 'N4'],
    ['遠慮なく', 'えんりょなく', 'VIỄN LỰ', 'đừng khách sáo/ không làm khách', 'N4'],
    ['遠慮します', 'えんりょします', '', 'ngại/ khách sáo', 'N3'],
  ]],
  ['部', 'BỘ', '', 'N5', [
    ['部屋', 'へや', 'BỘ ÓC', 'căn phòng', 'N5'],
    ['部長', 'ぶちょう', 'BỘ TRƯỞNG', 'Trưởng phòng', 'N5'],
    ['全部', 'ぜんぶ', 'TOÀN BỘ', 'Toàn bộ, tất cả', 'N5'],
    ['全部で', 'ぜんぶで', 'TOÀN BỘ', 'tổng cộng', 'N5'],
  ]],
  ['開', 'KHAI', '', 'N5', [
    ['開けます', 'あけます', 'KHAI', 'Mở', 'N5'],
    ['開きます', 'あきます', '', '(cửa, cửa sổ) mở ra', 'N5'],
    ['教室を開きます', 'きょうしつをひらきます', 'GIÁO THẤT KHAI', 'mở lớp học', 'N4'],
    ['ドアが開きます', 'ドアがあきます', 'KHAI', 'cửa mở ra', 'N4'],
  ]],
  ['院', 'VIỆN', '', 'N5', [
    ['病院', 'びょういん', 'BỆNH VIỆN', 'Bệnh viện', 'N5'],
    ['大学院', 'だいがくいん', 'ĐẠI HỌC VIỆN', 'cao học/ sau đại học', 'N4'],
    ['入院します', 'にゅういんします', 'NHẬP VIỆN', 'nhập viện', 'N4'],
    ['退院します', 'たいいんします', 'THOÁI VIỆN', 'xuất viện', 'N4'],
  ]],
  ['飲', 'ẨM', '', 'N5', [
    ['飲む', 'のむ', 'ẨM', 'uống', 'N5'],
    ['飲み物', 'のみもの', 'ẨM VẬT', 'đồ uống', 'N5'],
    ['飲みます', 'のみます', '', 'uống', 'N5'],
    ['薬を飲みます', 'くすりをのみます', 'DƯỢC ẨM', 'Uống thuốc', 'N5'],
  ]],
  ['駅', 'DỊCH', '', 'N5', [
    ['駅', 'えき', 'DỊCH', 'ga, nhà ga', 'N5'],
    ['駅に着きます', 'えきにつきます', 'DỊCH TRƯỚC', 'đến ga', 'N5'],
    ['駅前', 'えきまえ', 'DỊCH TIỀN', 'khu vực trước nhà ga', 'N4'],
    ['駅員', 'えきいん', 'DỊCH VIÊN', 'nhân viên nhà ga', 'N4'],
  ]],
  ['高', 'CAO', '', 'N5', [
    ['高い', 'たかい', 'CAO', 'đắt, cao', 'N5'],
    ['高校', 'こうこう', 'CAO HIỆU', 'Trường trung học phổ thông', 'N5'],
    ['背が高い', 'せがたかい', 'BỐI CAO', 'Cao', 'N5'],
    ['高さ', 'たかさ', 'CAO', 'chiều cao', 'N4'],
  ]],
  ['乾', 'CAN', '', 'N5', [
    ['乾杯', 'かんぱい', 'CAN BỘI', 'Nâng cốc!/cạn chén', 'N5'],
    ['乾きます', 'かわきます', 'CAN', 'khô', 'N4'],
    ['乾かします', 'かわかします', '', 'làm khô/ hong khô', 'N3'],
  ]],
  ['伝', 'TRUYỀN', '', 'N5', [
    ['手伝います', 'てつだいます', 'THỦ TRUYỀN', 'Giúp', 'N5'],
    ['伝えます', 'つたえます', 'TRUYỀN', 'truyền đạt/ nhắn lại/ báo lại', 'N4'],
    ['よろしくお伝えください', 'よろしくおつたえください', 'TRUYỀN', 'Cho tôi gửi lời hỏi thăm.', 'N4'],
  ]],
  ['住', 'TRÚ', '', 'N5', [
    ['住所', 'じゅうしょ', 'TRÚ SỞ', 'Địa chỉ', 'N5'],
    ['住みます', 'すみます', 'TRÚ/ TRỤ', 'Sống, ở', 'N5'],
    ['住所を教えます', 'じゅうしょをおしえます', 'TRÚ SỞ GIÁO', 'Nói, cho biết địa chỉ', 'N5'],
  ]],
  ['体', 'THỂ', '', 'N5', [
    ['体', 'からだ', 'THỂ', 'Người, cơ thể', 'N5'],
    ['体にいい', 'からだにいい', 'THỂ', 'Tốt cho sức khỏe', 'N5'],
    ['体育館', 'たいいくかん', 'THỂ DỤC QUÁN', 'nhà tập/ nhà thi đấu thể thao', 'N4'],
  ]],
  ['信', 'TÍN', '', 'N5', [
    ['信号', 'しんごう', 'TÍN HIỆU', 'Đèn tín hiệu', 'N5'],
    ['通信販売', 'つうしんはんばい', 'THÔNG TÍN PHIÊN MẠI', 'bán hàng qua bưu điện/ thương mại viễn thông', 'N4'],
    ['信じます', 'しんじます', 'TÍN', 'tin/ tin tưởng', 'N4'],
  ]],
  ['備', 'BỊ', '', 'N5', [
    ['準備', 'じゅんび', 'CHUẨN BỊ', 'Chuẩn bị', 'N5'],
    ['設備', 'せつび', 'THIẾT BỊ', 'thiết bị', 'N4'],
    ['準備します', 'じゅんびします', '', 'chuẩn bị', 'N4'],
  ]],
  ['元', 'NGUYÊN', '', 'N5', [
    ['元気', 'げんき', 'NGUYÊN KHÍ', 'khỏe', 'N5'],
    ['元の所', 'もとのところ', 'NGUYÊN SỞ', 'địa điểm ban đầu/ địa điểm gốc', 'N4'],
    ['お元気でいらっしゃいますか', 'おげんきでいらっしゃいますか', 'NGUYÊN KHÍ', 'Anh/chị có khỏe không ạ?', 'N4'],
  ]],
  ['公', 'CÔNG', '', 'N5', [
    ['公園', 'こうえん', 'CÔNG VIÊN', 'công viên', 'N5'],
    ['公園を散歩します', 'こうえんをさんぽします', 'CÔNG VIÊN TÁN BỘ', 'đi dạo ở công viên', 'N5'],
    ['主人公', 'しゅじんこう', 'CHỦ NHÂN CÔNG', 'nhân vật chính', 'N4'],
  ]],
  ['内', 'NỘI', '', 'N5', [
    ['家内', 'かない', 'GIA NỘI', 'vợ', 'N5'],
    ['案内します', 'あんないします', 'ÁN NỘI', 'Hướng dẫn, giới thiệu', 'N5'],
    ['案内書', 'あんないしょ', 'ÁN NỘI THƯ', 'sách hướng dẫn/ tài liệu hướng dẫn', 'N4'],
  ]],
  ['最', 'TỐI', '', 'N5', [
    ['最近', 'さいきん', 'TỐI CẬN', 'Gần đây', 'N5'],
    ['最初に', 'さいしょに', 'TỐI SƠ', 'đầu tiên/ trước hết', 'N4'],
    ['最後に', 'さいごに', 'TỐI HẬU', 'cuối cùng', 'N4'],
  ]],
  ['初', 'SƠ', '', 'N5', [
    ['初めて', 'はじめて', 'SƠ', 'Lần đầu tiên', 'N5'],
    ['初めに', 'はじめに', 'SƠ', 'đầu tiên/ trước hết', 'N4'],
    ['最初に', 'さいしょに', 'TỐI SƠ', 'đầu tiên/ trước hết', 'N4'],
  ]],
  ['医', 'Y', '', 'N5', [
    ['医者', 'いしゃ', 'Y GIẢ', 'Bác sĩ', 'N5'],
    ['歯医者', 'はいしゃ', 'XỈ Y GIẢ', 'Nha sĩ', 'N5'],
    ['医学', 'いがく', 'Y HỌC', 'y học', 'N4'],
  ]],
  ['半', 'BÁN', '', 'N5', [
    ['半', 'はん', 'BÁN', 'Rưỡi, nửa', 'N5'],
    ['半分', 'はんぶん', 'BÁN PHÂN', 'một nửa', 'N4'],
    ['半年', 'はんとし', 'BÁN NIÊN', 'nửa năm', 'N4'],
  ]],
  ['受', 'THỤ', '', 'N5', [
    ['受付', 'うけつけ', 'THỤ PHÓ', 'bộ phận tiếp tân, phòng thường trực', 'N5'],
    ['受賞します', 'じゅしょうします', 'THỤ THƯỞNG', 'nhận giải thưởng', 'N4'],
    ['試験を受けます', 'しけんをうけます', 'THỨC NGHIỆM THỤ', 'thi/ dự kỳ thi', 'N4'],
  ]],
  ['台', 'ĐÀI', '', 'N5', [
    ['～台', '～だい', 'ĐÀI', '～ cái', 'N5'],
    ['台所', 'だいどころ', 'ĐÀI SỞ', 'bếp/ nhà bếp', 'N4'],
    ['台風', 'たいふう', 'ĐÀI PHONG', 'bão', 'N4'],
  ]],
  ['号', 'HIỆU', '', 'N5', [
    ['番号', 'ばんごう', 'PHIÊN HIỆU', 'Số (số điện thoại, số phòng)', 'N5'],
    ['信号', 'しんごう', 'TÍN HIỆU', 'Đèn tín hiệu', 'N5'],
    ['暗証番号', 'あんしょうばんごう', 'ÁM CHỨNG PHIÊN HIỆU', 'Mật khẩu', 'N5'],
  ]],
  ['名', 'DANH', '', 'N5', [
    ['名刺', 'めいし', 'DANH THÍCH', 'Danh thiếp', 'N5'],
    ['有名', 'ゆうめい', 'HỮU DANH', 'nổi tiếng', 'N5'],
    ['名前', 'なまえ', 'DANH TIỀN', 'Tên', 'N5'],
  ]],
  ['問', 'VẤN', '', 'N5', [
    ['問題', 'もんだい', 'VẤN ĐỀ', 'Vấn đề', 'N5'],
    ['質問します', 'しつもんします', 'CHẤT VẤN', 'đặt câu hỏi', 'N5'],
    ['質問に答えます', 'しつもんにこたえます', 'CHẤT VẤN ĐÁP', 'trả lời câu hỏi', 'N4'],
  ]],
  ['喫', 'KHIẾT', '', 'N5', [
    ['喫茶店', 'きっさてん', 'KHIẾT TRÀ ĐIẾM', 'quán giải khát, quán cà phê', 'N5'],
    ['喫茶店を出ます', 'きっさてんをでます', 'KHIẾT TRÀ ĐIẾM XUẤT', 'ra khỏi quán giải khát', 'N5'],
    ['喫茶店に入ります', 'きっさてんにはいります', 'NHẬP', 'vào quán giải khát', 'N5'],
  ]],
  ['図', 'ĐỒ', '', 'N5', [
    ['地図', 'ちず', 'ĐỊA ĐỒ', 'Bản đồ', 'N5'],
    ['図書館', 'としょかん', 'ĐỒ THƯ QUÁN', 'Thư viện', 'N5'],
    ['図', 'ず', 'ĐỒ', 'sơ đồ/ hình vẽ', 'N4'],
  ]],
  ['園', 'VIÊN', '', 'N5', [
    ['公園', 'こうえん', 'CÔNG VIÊN', 'công viên', 'N5'],
    ['公園を散歩します', 'こうえんをさんぽします', 'CÔNG VIÊN TÁN BỘ', 'đi dạo ở công viên', 'N5'],
    ['動物園', 'どうぶつえん', 'ĐỘNG VẬT VIÊN', 'vườn thú/ vườn bách thú', 'N4'],
  ]],
  ['夜', 'DẠ', '', 'N5', [
    ['夜', 'よる', 'DẠ', 'Buổi tối, khuya', 'N5'],
    ['今夜', 'こんや', 'KIM DẠ', 'tối nay/ đêm nay', 'N4'],
    ['夜行バス', 'やこうバス', 'DẠ HÀNH', 'xe buýt chạy đêm', 'N4'],
  ]],
  ['夫', 'PHU', '', 'N5', [
    ['夫', 'おっと', 'PHU', 'chồng', 'N5'],
    ['大丈夫', 'だいじょうぶ', 'ĐẠI TRƯỢNG PHU', 'Không sao, không có vấn đề gì', 'N5'],
    ['丈夫', 'じょうぶ', 'TRƯỢNG PHU', 'chắc/ bền', 'N4'],
  ]],
  ['妹', 'MUỘI', '', 'N5', [
    ['妹', 'いもうと', 'MUỘI', 'em gái', 'N5'],
    ['妹さん', 'いもうとさん', 'MUỘI', 'em gái', 'N5'],
    ['姉妹', 'しまい', 'TỶ MUỘI', 'chị em (gái)', 'N4'],
  ]],
  ['姉', 'TỶ', '', 'N5', [
    ['姉', 'あね', 'TỶ', 'chị gái', 'N5'],
    ['お姉さん', 'おねえさん', 'TỶ', 'chị gái', 'N5'],
    ['姉妹', 'しまい', 'TỶ MUỘI', 'chị em (gái)', 'N4'],
  ]],
  ['安', 'AN', '', 'N5', [
    ['安い', 'やすい', 'AN', 'rẻ', 'N5'],
    ['安全', 'あんぜん', 'AN TOÀN', 'an toàn', 'N4'],
    ['安心します', 'あんしんします', 'AN TÂM', 'yên tâm', 'N4'],
  ]],
  ['少', 'THIẾU', 'THIỂU', 'N5', [
    ['少し', 'すこし', 'THIẾU/ THIỂU', 'ít, một ít', 'N5'],
    ['もう少し', 'もうすこし', 'THIẾU', 'Thêm một chút nữa thôi', 'N5'],
    ['人が少ない', 'ひとがすくない', 'NHÂN THIỂU', 'Ít người', 'N5'],
  ]],
  ['帰', 'QUY', '', 'N5', [
    ['帰ります', 'かえります', 'QUY', 'về', 'N5'],
    ['帰りに', 'かえりに', 'QUY', 'trên đường về', 'N4'],
    ['帰って来ます', 'かえってきます', 'QUY LAI', 'về/ trở về', 'N4'],
  ]],
  ['張', 'TRƯƠNG', '', 'N5', [
    ['出張します', 'しゅっちょうします', 'XUẤT TRƯƠNG', 'Đi công tác', 'N5'],
    ['頑張ります', 'がんばります', 'NGOAN TRƯƠNG', 'cố, cố gắng', 'N5'],
    ['緊張します', 'きんちょうします', 'KHẨN TRƯƠNG', 'căng thẳng/ hồi hộp', 'N4'],
  ]],
  ['強', 'CƯỜNG', '', 'N5', [
    ['勉強', 'べんきょう', 'MIỄN CƯỜNG', 'học', 'N5'],
    ['強い', 'つよい', 'CƯỜNG', 'Mạnh', 'N5'],
    ['勉強します', 'べんきょうします', 'MIỄN CƯỜNG', 'Học', 'N5'],
  ]],
  ['待', 'ĐÃI', '', 'N5', [
    ['待ちます', 'まちます', 'ĐÃI', 'Đợi, chờ', 'N5'],
    ['招待します', 'しょうたいします', 'CHIÊU ĐÃI', 'mời', 'N4'],
    ['お待たせしました', 'おまたせしました', 'ĐÃI', 'Xin lỗi vì để anh/chị phải đợi.', 'N4'],
  ]],
  ['思', 'TƯ', '', 'N5', [
    ['思います', 'おもいます', 'TƯ', 'Nghĩ', 'N5'],
    ['思い出します', 'おもいだします', 'TƯ XUẤT', 'Nhớ lại, hồi tưởng', 'N5'],
    ['不思議', 'ふしぎ', 'BẤT TƯ NGHỊ', 'kỳ lạ/ khó tin/ bí ẩn', 'N4'],
  ]],
  ['押', 'ÁP', '', 'N5', [
    ['押入れ', 'おしいれ', 'ÁP NHẬP', 'Chỗ để chăn gối', 'N5'],
    ['押します', 'おします', 'ÁP', 'Bấm, ấn (nút)', 'N5'],
    ['はんこを押します', 'はんこをおします', 'ÁP', 'đóng dấu', 'N4'],
  ]],
  ['撮', 'TOÁT', '', 'N5', [
    ['撮りる', 'とりる', 'TOÁT', 'chụp', 'N5'],
    ['撮ります', 'とります', '', 'chụp (ảnh)', 'N5'],
    ['ビデオに撮ります', 'ビデオにとります', 'TOÁT', 'thu video/ ghi hình', 'N4'],
  ]],
  ['早', 'TẢO', '', 'N5', [
    ['早く', 'はやく', 'TẢO', 'sớm, nhanh', 'N5'],
    ['早い', 'はやい', 'TẢO', 'sớm', 'N5'],
    ['早退します', 'そうたいします', 'TẢO THOÁI', 'về sớm/ ra sớm', 'N4'],
  ]],
  ['服', 'PHỤC', '', 'N5', [
    ['服', 'ふく', 'PHỤC', 'Quần áo', 'N5'],
    ['洋服', 'ようふく', 'DƯƠNG PHỤC', 'quần áo kiểu Tây Âu', 'N4'],
    ['服が汚れます', 'ふくがよごれます', 'PHỤC Ô', 'quần áo bị bẩn', 'N4'],
  ]],
  ['朝', 'TRIỀU', '', 'N5', [
    ['朝', 'あさ', 'TRIỀU', 'Buổi sáng, sáng', 'N5'],
    ['毎朝', 'まいあさ', 'MỖI TRIỀU', 'Hàng sáng, mỗi sáng', 'N5'],
    ['朝ごはん', 'あさごはん', 'TRIỀU', 'cơm sáng', 'N5'],
  ]],
  ['木', 'MỘC', '', 'N5', [
    ['木', 'き', 'MỘC', 'cây, gỗ', 'N5'],
    ['木曜日', 'もくようび', 'MỘC DIỆU NHẬT', 'Thứ năm', 'N5'],
    ['木が折れます', 'きがおれます', 'MỘC TRIẾT', 'cây bị gãy', 'N4'],
  ]],
  ['棚', 'BẰNG', '', 'N5', [
    ['棚', 'たな', 'BẰNG', 'giá sách', 'N5'],
    ['本棚', 'ほんだな', 'BỔN BẰNG', 'giá sách/ kệ sách', 'N4'],
    ['網棚', 'あみだな', 'VÕNG BẰNG', 'giá lưới/ giá để hành lý (trên tàu)', 'N4'],
  ]],
  ['次', 'THỨ', '', 'N5', [
    ['次の', 'つぎの', 'THỨ', 'tiếp theo', 'N5'],
    ['次に', 'つぎに', 'THỨ', 'Tiếp theo', 'N5'],
    ['二次会', 'にじかい', 'NHỊ THỨ HỘI', 'tiệc tăng hai/ bữa tiệc thứ hai', 'N4'],
  ]],
  ['歯', 'XỈ', '', 'N5', [
    ['歯', 'は', 'XỈ', 'Răng', 'N5'],
    ['歯医者', 'はいしゃ', 'XỈ Y GIẢ', 'Nha sĩ', 'N5'],
    ['歯を磨きます', 'はをみがきます', 'XỈ MA', 'đánh răng', 'N4'],
  ]],
  ['残', 'TÀN', '', 'N5', [
    ['残業します', 'ざんぎょうします', 'TÀN NGHIỆP', 'Làm thêm, làm quá giờ', 'N5'],
    ['残します', 'のこします', '', 'để lại', 'N3'],
    ['残ります', 'のこります', '', 'còn lại', 'N3'],
  ]],
  ['海', 'HẢI', '', 'N5', [
    ['海', 'うみ', 'HẢI', 'Biển, đại dương', 'N5'],
    ['海外', 'かいがい', 'HẢI NGOẠI', 'nước ngoài/ hải ngoại', 'N4'],
    ['海岸', 'かいがん', 'HẢI NGẠN', 'bờ biển', 'N4'],
  ]],
  ['消', 'TIÊU', '', 'N5', [
    ['消します', 'けします', 'TIÊU', 'Tắt', 'N5'],
    ['消えます', 'きえます', '', '(đèn, lửa) tắt/ biến mất', 'N5'],
    ['電気が消えます', 'でんきがきえます', 'ĐIỆN KHÍ TIÊU', 'điện tắt', 'N4'],
  ]],
  ['渡', 'ĐỘ', '', 'N5', [
    ['渡します', 'わたします', 'ĐỘ', 'trao/ giao', 'N5'],
    ['渡ります', 'わたります', '', 'băng qua', 'N5'],
    ['橋を渡ります', 'はしをわたります', 'KIỀU ĐỘ', 'Qua, đi qua cầu', 'N5'],
  ]],
  ['温', 'ÔN', '', 'N5', [
    ['温かい', 'あたたかい', 'ÔN', 'ấm áp', 'N5'],
    ['温めます', 'あたためます', '', 'hâm nóng/ làm ấm', 'N3'],
    ['温まります', 'あたたまります', '', 'ấm lên', 'N3'],
  ]],
  ['濯', 'TRẠC', '', 'N5', [
    ['洗濯します', 'せんたくします', 'TẨY TRẠC', 'Giặt', 'N5'],
    ['洗濯機', 'せんたくき', 'TẨY TRẠC CƠ', 'máy giặt', 'N4'],
    ['洗濯物', 'せんたくもの', 'TẨY TRẠC VẬT', 'quần áo giặt', 'N4'],
  ]],
  ['無', 'VÔ', '', 'N5', [
    ['無理', 'むり', 'VÔ LÝ', 'Không thể, quá sức', 'N5'],
    ['無料', 'むりょう', 'VÔ LIỆU', 'miễn phí', 'N4'],
    ['無理をします', 'むりをします', 'VÔ LÝ', 'làm quá sức/ làm điều quá khả năng', 'N4'],
  ]],
  ['父', 'PHỤ', '', 'N5', [
    ['父', 'ちち', 'PHỤ', 'bố', 'N5'],
    ['お父さん', 'おとうさん', 'PHỤ', 'bố', 'N5'],
    ['祖父', 'そふ', 'TỔ PHỤ', 'ông (của mình)', 'N4'],
  ]],
  ['牛', 'NGƯU', '', 'N5', [
    ['牛乳', 'ぎゅうにゅう', 'NGƯU NHŨ', 'sữa bò', 'N5'],
    ['牛どん', 'ぎゅうどん', 'NGƯU', 'món cơm thịt bò', 'N5'],
    ['牡牛座', 'おうしざ', 'MẪU NGƯU TỌA', 'chòm sao Kim Ngưu', 'N4'],
  ]],
  ['特', 'ĐẶC', '', 'N5', [
    ['特急', 'とっきゅう', 'ĐẶC CẤP', 'tàu tốc hành đặc biệt', 'N5'],
    ['特に', 'とくに', 'ĐẶC', 'Đặc biệt', 'N5'],
    ['特別', 'とくべつ', 'ĐẶC BIỆT', 'đặc biệt', 'N4'],
  ]],
  ['界', 'GIỚI', '', 'N5', [
    ['世界', 'せかい', 'THẾ GIỚI', 'Thế giới', 'N5'],
    ['世界中', 'せかいじゅう', 'THẾ GIỚI TRUNG', 'khắp thế giới/ toàn thế giới', 'N4'],
    ['世界的に', 'せかいてきに', 'THẾ GIỚI', 'tầm cỡ thế giới', 'N4'],
  ]],
  ['疲', 'BÌ', '', 'N5', [
    ['疲れる', 'つかれる', 'BÌ', 'Mệt mỏi', 'N5'],
    ['疲れます', 'つかれます', 'BÌ', 'mệt', 'N5'],
    ['お疲れ様でした', 'おつかれさまでした', 'BÌ DẠNG', 'Anh/chị đã vất vả rồi.', 'N4'],
  ]],
  ['白', 'BẠCH', '', 'N5', [
    ['白い', 'しろい', 'BẠCH', 'trắng', 'N5'],
    ['白', 'しろ', 'BẠCH', 'màu trắng', 'N4'],
    ['真っ白', 'まっしろ', 'CHÂN BẠCH', 'trắng toát/ trắng ngần', 'N4'],
  ]],
  ['真', 'CHÂN', '', 'N5', [
    ['写真', 'しゃしん', 'TẢ CHÂN', 'ảnh', 'N5'],
    ['真ん中', 'まんなか', 'CHÂN TRUNG', 'giữa/ trung tâm', 'N4'],
    ['真っ白', 'まっしろ', 'CHÂN BẠCH', 'trắng toát/ trắng ngần', 'N4'],
  ]],
  ['研', 'NGHIÊN', '', 'N5', [
    ['研究者', 'けんきゅうしゃ', 'NGHIÊN CỨU GIẢ', 'Nhà nghiên cứu', 'N5'],
    ['研究します', 'けんきゅうします', 'NGHIÊN CỨU', 'Nghiên cứu', 'N5'],
    ['研究室', 'けんきゅうしつ', 'NGHIÊN CỨU THẤT', 'phòng nghiên cứu', 'N4'],
  ]],
  ['祭', 'TẾ', '', 'N5', [
    ['お祭り', 'おまつり', 'TẾ', 'Lễ hội', 'N5'],
    ['お祭りがあります', 'おまつりがあります', 'TẾ', 'Được tổ chức, diễn ra, có lễ hội', 'N5'],
    ['雪祭り', 'ゆきまつり', 'TUYẾT TẾ', 'Lễ hội tuyết', 'N4'],
  ]],
  ['禁', 'CẤM', '', 'N5', [
    ['禁煙', 'きんえん', 'CẤM YÊN', 'Cấm hút thuốc', 'N5'],
    ['使用禁止', 'しようきんし', 'SỬ DỤNG CẤM CHỈ', 'cấm sử dụng', 'N4'],
    ['立入禁止', 'たちいりきんし', 'LẬP NHẬP CẤM CHỈ', 'cấm vào/ cấm vào khu vực này', 'N4'],
  ]],
  ['私', 'TƯ', '', 'N5', [
    ['私', 'わたし', 'TƯ', 'Tôi', 'N5'],
    ['私達', 'わたしたち', 'TƯ ĐẠT', 'Chúng tôi, chúng ta', 'N5'],
    ['私', 'わたくし', 'TƯ', 'tôi (cách nói lịch sự)', 'N4'],
  ]],
  ['究', 'CỨU', '', 'N5', [
    ['研究者', 'けんきゅうしゃ', 'NGHIÊN CỨU GIẢ', 'Nhà nghiên cứu', 'N5'],
    ['研究します', 'けんきゅうします', 'NGHIÊN CỨU', 'Nghiên cứu', 'N5'],
    ['研究室', 'けんきゅうしつ', 'NGHIÊN CỨU THẤT', 'phòng nghiên cứu', 'N4'],
  ]],
  ['細', 'TẾ', '', 'N5', [
    ['細かいお金', 'こまかいおかね', 'TẾ KIM', 'tiền lẻ', 'N5'],
    ['細い', 'ほそい', 'TẾ', 'gầy/ hẹp/ thon', 'N4'],
    ['細かい', 'こまかい', 'TẾ', 'nhỏ/ chi tiết/ tỉ mỉ', 'N4'],
  ]],
  ['終', 'CHUNG', '', 'N5', [
    ['終わり', 'おわり', 'CHUNG', 'Kết thúc', 'N5'],
    ['終えます', 'おえます', '', 'làm xong/ kết thúc (việc gì)', 'N5'],
    ['終わります', 'おわります', 'CHUNG', 'Hết, kết thúc, xong', 'N5'],
  ]],
  ['経', 'KINH', '', 'N5', [
    ['経済', 'けいざい', 'KINH TẾ', 'kinh tế', 'N5'],
    ['経験', 'けいけん', 'KINH NGHIỆM', 'kinh nghiệm', 'N4'],
    ['経験します', 'けいけんします', '', 'trải nghiệm', 'N3'],
  ]],
  ['美', 'MỸ', '', 'N5', [
    ['美術', 'びじゅつ', 'MỸ THUẬT', 'mỹ thuật', 'N5'],
    ['美術館', 'びじゅつかん', 'MỸ THUẬT QUÁN', 'Bảo tàng mỹ thuật', 'N5'],
    ['美しい', 'うつくしい', 'MỸ', 'đẹp', 'N4'],
  ]],
  ['肉', 'NHỤC', '', 'N5', [
    ['肉', 'にく', 'NHỤC', 'thịt', 'N5'],
    ['鳥肉', 'とりにく', 'ĐIỂU', 'thịt gà', 'N4'],
    ['肉が焼けます', 'にくがやけます', 'NHỤC THIÊU', 'thịt được nướng chín', 'N4'],
  ]],
  ['術', 'THUẬT', '', 'N5', [
    ['美術', 'びじゅつ', 'MỸ THUẬT', 'mỹ thuật', 'N5'],
    ['美術館', 'びじゅつかん', 'MỸ THUẬT QUÁN', 'Bảo tàng mỹ thuật', 'N5'],
    ['技術', 'ぎじゅつ', 'KỸ THUẬT', 'kỹ thuật', 'N4'],
  ]],
  ['要', 'YẾU', '', 'N5', [
    ['要ります', 'いります', '', 'cần', 'N5'],
    ['ビザが要ります', 'ビザがいります', 'YẾU', 'Cần thị thực (visa)', 'N5'],
    ['必要', 'ひつよう', 'TẤT YẾU', 'cần thiết', 'N4'],
  ]],
  ['証', 'CHỨNG', '', 'N5', [
    ['暗証番号', 'あんしょうばんごう', 'ÁM CHỨNG PHIÊN HIỆU', 'Mật khẩu', 'N5'],
    ['健康保険証', 'けんこうほけんしょう', 'KIỆN KHANG BẢO HIỂM CHỨNG', 'Thẻ bảo hiểm y tế', 'N5'],
    ['保証書', 'ほしょうしょ', 'BẢO CHỨNG THƯ', 'giấy bảo hành', 'N4'],
  ]],
  ['読', 'ĐỘC', '', 'N5', [
    ['読む', 'よむ', 'ĐỘC', 'đọc', 'N5'],
    ['読み方', 'よみかた', 'ĐỘC PHƯƠNG', 'Cách đọc', 'N5'],
    ['読みます', 'よみます', '', 'đọc', 'N5'],
  ]],
  ['買', 'MÃI', '', 'N5', [
    ['買う', 'かう', 'MÃI', 'mua', 'N5'],
    ['買います', 'かいます', '', 'mua', 'N5'],
    ['買い物します', 'かいものします', 'MÃI VẬT', 'mua hàng', 'N5'],
  ]],
  ['赤', 'XÍCH', '', 'N5', [
    ['赤い', 'あかい', 'XÍCH', 'đỏ', 'N5'],
    ['赤', 'あか', 'XÍCH', 'màu đỏ', 'N4'],
    ['赤ちゃん', 'あかちゃん', 'XÍCH', 'em bé', 'N4'],
  ]],
  ['走', 'TẨU', '', 'N5', [
    ['走ります', 'はしります', '', 'chạy', 'N5'],
    ['競走します', 'きょうそうします', 'CẠNH TẨU', 'chạy đua/ thi chạy', 'N4'],
    ['道を走ります', 'みちをはしります', 'ĐẠO TẨU', 'chạy trên đường', 'N4'],
  ]],
  ['身', 'THÂN', '', 'N5', [
    ['刺身', 'さしみ', 'THÍCH THÂN', 'Món sashimi', 'N5'],
    ['独身', 'どくしん', 'ĐỘC THÂN', 'Độc thân', 'N5'],
    ['中身', 'なかみ', 'TRUNG THÂN', 'nội dung/ phần bên trong', 'N4'],
  ]],
  ['速', 'TỐC', '', 'N5', [
    ['速く', 'はやく', 'TỐC', 'sớm, nhanh', 'N5'],
    ['速達', 'そくたつ', 'TỐC ĐẠT', 'gửi nhanh', 'N5'],
    ['速い', 'はやい', 'TỐC', 'Nhanh', 'N5'],
  ]],
  ['達', 'ĐẠT', '', 'N5', [
    ['私達', 'わたしたち', 'TƯ ĐẠT', 'Chúng tôi, chúng ta', 'N5'],
    ['友達', 'ともだち', 'HỮU ĐẠT', 'bạn, bạn bè', 'N5'],
    ['速達', 'そくたつ', 'TỐC ĐẠT', 'gửi nhanh', 'N5'],
  ]],
  ['配', 'PHỐI', '', 'N5', [
    ['心配します', 'しんぱいします', 'TÂM PHỐI', 'Lo lắng', 'N5'],
    ['心配', 'しんぱい', 'TÂM PHỐI', 'lo lắng', 'N4'],
    ['宅配便', 'たくはいびん', 'TRẠCH PHỐI TIỆN', 'dịch vụ chuyển đồ đến nhà', 'N4'],
  ]],
  ['釣', 'ĐIẾU', '', 'N5', [
    ['釣り', 'つり', 'ĐIẾU', 'việc câu cá', 'N5'],
    ['お釣り', 'おつり', 'ĐIẾU', 'Tiền lẻ', 'N5'],
    ['お釣りが出ます', 'おつりがでます', 'ĐIẾU XUẤT', 'Ra, đi ra tiền thừa', 'N5'],
  ]],
  ['銀', 'NGÂN', '', 'N5', [
    ['銀行', 'ぎんこう', 'NGÂN HÀNH', 'Ngân hàng', 'N5'],
    ['銀行員', 'ぎんこういん', 'NGÂN HÀNH VIÊN', 'Nhân viên ngân hàng', 'N5'],
    ['銀行に寄ります', 'ぎんこうによります', 'NGÂN HÀNG KÝ', 'ghé qua ngân hàng', 'N4'],
  ]],
  ['鏡', 'KÍNH', '', 'N5', [
    ['眼鏡', 'めがね', 'NHÃN KÍNH', 'Kính', 'N5'],
    ['眼鏡をかけます', 'めがねをかけます', 'NHÃN KÍNH', 'Đeo kính', 'N5'],
    ['鏡', 'かがみ', 'KÍNH', 'cái gương', 'N4'],
  ]],
  ['閉', 'BẾ', '', 'N5', [
    ['閉めます', 'しめます', 'BẾ', 'Đóng', 'N5'],
    ['閉まります', 'しまります', '', '(cửa) đóng lại', 'N5'],
    ['ドアが閉まります', 'ドアがしまります', 'BẾ', 'cửa đóng lại', 'N4'],
  ]],
  ['障', 'CHƯỚNG', '', 'N5', [
    ['故障', 'こしょう', 'CỐ CHƯỚNG', 'Hỏng', 'N5'],
    ['障害', 'しょうがい', 'CHƯỚNG HẠI', 'khuyết tật', 'N4'],
    ['故障が直ります', 'こしょうがなおります', 'CỐ CHƯỚNG TRỰC', 'chỗ hỏng được sửa/ hết hỏng', 'N4'],
  ]],
  ['集', 'TẬP', '', 'N5', [
    ['集めます', 'あつめます', 'TẬP', 'Sưu tầm, thu thập', 'N5'],
    ['集まります', 'あつまります', '', 'tụ tập', 'N4'],
    ['人が集まります', 'ひとがあつまります', 'NHÂN TẬP', 'người tụ tập/ mọi người tập trung', 'N4'],
  ]],
  ['雨', 'VŨ', '', 'N5', [
    ['雨', 'あめ', 'VŨ', 'Mưa', 'N5'],
    ['雨が降ります', 'あめがふります', 'VŨ GIÁNG/HÀNG', 'Rơi mưa, tuyết', 'N5'],
    ['雨がやみます', 'あめがやみます', 'VŨ', 'tạnh mưa/ ngừng mưa', 'N4'],
  ]],
  ['靴', 'NGOA', '', 'N5', [
    ['靴', 'くつ', 'NGOA', 'giầy', 'N5'],
    ['靴をはきます', 'くつをはきます', 'NGOA', 'mang giầy', 'N5'],
    ['靴下', 'くつした', 'NGOA HẠ', 'cái tất', 'N4'],
  ]],
  ['丈', 'TRƯỢNG', '', 'N5', [
    ['大丈夫', 'だいじょうぶ', 'ĐẠI TRƯỢNG PHU', 'Không sao, không có vấn đề gì', 'N5'],
    ['丈夫', 'じょうぶ', 'TRƯỢNG PHU', 'chắc/ bền', 'N4'],
  ]],
  ['不', 'BẤT', '', 'N5', [
    ['不便', 'ふべん', 'BẤT TIỆN', 'Bất tiện', 'N5'],
    ['不思議', 'ふしぎ', 'BẤT TƯ NGHỊ', 'kỳ lạ/ khó tin/ bí ẩn', 'N4'],
  ]],
  ['並', 'TỊNH', '', 'N5', [
    ['並びます', 'ならびます', 'TỊNH', 'xếp hàng', 'N5'],
    ['並べます', 'ならべます', 'TỊNH', 'xếp/ bày ra', 'N5'],
  ]],
  ['主', 'CHỦ', '', 'N5', [
    ['主人', 'しゅじん', 'CHỦ NHÂN', 'chồng', 'N5'],
    ['主人公', 'しゅじんこう', 'CHỦ NHÂN CÔNG', 'nhân vật chính', 'N4'],
  ]],
  ['供', 'CUNG', '', 'N5', [
    ['子供がいます', 'こどもがいます', 'TỬ CUNG', 'có con', 'N5'],
    ['子供たち', 'こどもたち', 'TỬ CUNG', 'trẻ em/ bọn trẻ', 'N4'],
  ]],
  ['保', 'BẢO', '', 'N5', [
    ['健康保険証', 'けんこうほけんしょう', 'KIỆN KHANG BẢO HIỂM CHỨNG', 'Thẻ bảo hiểm y tế', 'N5'],
    ['保証書', 'ほしょうしょ', 'BẢO CHỨNG THƯ', 'giấy bảo hành', 'N4'],
  ]],
  ['借', 'TÁ', '', 'N5', [
    ['借りる', 'かりる', 'TÁ', 'mượn, vay', 'N5'],
    ['借ります', 'かります', '', 'mượn', 'N5'],
  ]],
  ['健', 'KIỆN', '', 'N5', [
    ['健康保険証', 'けんこうほけんしょう', 'KIỆN KHANG BẢO HIỂM CHỨNG', 'Thẻ bảo hiểm y tế', 'N5'],
    ['健康', 'けんこう', 'KIỆN KHANG', 'sức khỏe/ khỏe mạnh', 'N4'],
  ]],
  ['傘', 'TẢN', '', 'N5', [
    ['傘', 'かさ', 'TẢN', 'ô, dù', 'N5'],
    ['傘をさします', 'かさをさします', 'TẢN', 'che ô', 'N4'],
  ]],
  ['働', 'ĐỘNG', '', 'N5', [
    ['働きます', 'はたらきます', 'ĐỘNG', 'Làm việc', 'N5'],
    ['働きすぎ', 'はたらきすぎ', 'ĐỘNG', 'làm việc quá sức', 'N4'],
  ]],
  ['利', 'LỢI', '', 'N5', [
    ['便利', 'べんり', 'TIỆN LỢI', 'tiện lợi', 'N5'],
    ['利用します', 'りようします', 'LỢI DỤNG', 'sử dụng/ dùng/ tận dụng', 'N4'],
  ]],
  ['刺', 'THÍCH', '', 'N5', [
    ['名刺', 'めいし', 'DANH THÍCH', 'Danh thiếp', 'N5'],
    ['刺身', 'さしみ', 'THÍCH THÂN', 'Món sashimi', 'N5'],
  ]],
  ['勉', 'MIỄN', '', 'N5', [
    ['勉強', 'べんきょう', 'MIỄN CƯỜNG', 'học', 'N5'],
    ['勉強します', 'べんきょうします', 'MIỄN CƯỜNG', 'Học', 'N5'],
  ]],
  ['勝', 'THẮNG', '', 'N5', [
    ['勝ちます', 'かちます', 'THẮNG', 'Thắng', 'N5'],
    ['優勝します', 'ゆうしょうします', 'ƯU THẮNG', 'vô địch/ đoạt giải nhất', 'N4'],
  ]],
  ['勤', 'CẦN', '', 'N5', [
    ['転勤', 'てんきん', 'CHUYỂN CẦN', 'việc chuyển địa điểm làm việc', 'N5'],
    ['会社に勤めます', 'かいしゃにつとめます', 'HỘI XÃ CẦN', 'làm việc ở công ty', 'N4'],
  ]],
  ['午', 'NGỌ', '', 'N5', [
    ['午前', 'ごぜん', 'NGỌ TIỀN', 'Sáng, trước 12 giờ trưa', 'N5'],
    ['午後', 'ごご', 'NGỌ HẬU', 'Chiều, sau 12 giờ trưa', 'N5'],
  ]],
  ['危', 'NGUY', '', 'N5', [
    ['危ない', 'あぶない', 'NGUY', 'Nguy hiểm', 'N5'],
    ['危険', 'きけん', 'NGUY HIỂM', 'nguy hiểm', 'N4'],
  ]],
  ['右', 'HỮU', '', 'N5', [
    ['右', 'みぎ', 'HỮU', 'phải', 'N5'],
    ['右へ曲がります', 'みぎへまがります', 'HỮU KHÚC', 'Rẽ, quẹo phải', 'N5'],
  ]],
  ['吸', 'HẤP', '', 'N5', [
    ['吸う', 'すう', 'HẤP', 'hút', 'N5'],
    ['吸います', 'すいます', '', 'hút (thuốc)', 'N5'],
  ]],
  ['和', 'HÒA', '', 'N5', [
    ['和室', 'わしつ', 'HÒA THẤT', 'Phòng kiểu Nhật', 'N5'],
    ['和食', 'わしょく', 'HÒA THỰC', 'món ăn Nhật', 'N4'],
  ]],
  ['困', 'KHỐN', '', 'N5', [
    ['困ります', 'こまります', 'KHỐN', 'gặp khó khăn', 'N5'],
    ['困ったなあ', 'こまったなあ', 'KHỐN', 'Khổ quá!/ Làm thế nào đây!/ Biết làm sao bây giờ!', 'N4'],
  ]],
  ['天', 'THIÊN', '', 'N5', [
    ['天気', 'てんき', 'THIÊN KHÍ', 'Thời tiết', 'N5'],
    ['天気予報', 'てんきよほう', 'THIÊN KHÍ DỰ BÁO', 'dự báo thời tiết', 'N4'],
  ]],
  ['奥', 'ÁO', '', 'N5', [
    ['奥', 'おく', 'ÁO', 'bên trong cùng, phía sâu bên trong', 'N5'],
    ['奥さん', 'おくさん', 'ÁO', 'vợ', 'N5'],
  ]],
  ['字', 'TỰ', '', 'N5', [
    ['字', 'じ', 'TỰ', 'chữ', 'N5'],
    ['漢字', 'かんじ', 'HÁN TỰ', 'chữ hán', 'N5'],
  ]],
  ['実', 'THỰC', '', 'N5', [
    ['実は', 'じつは', 'THỰC', 'Thật ra là/ sự tình là', 'N5'],
    ['実験', 'じっけん', 'THỰC NGHIỆM', 'thí nghiệm/ thực nghiệm', 'N4'],
  ]],
  ['布', 'BỐ', '', 'N5', [
    ['布団', 'ふとん', 'BỐ ĐOÀN', 'Chăn, đệm', 'N5'],
    ['財布', 'さいふ', 'TÀI BỐ', 'cái ví', 'N4'],
  ]],
  ['師', 'SƯ', '', 'N5', [
    ['教師', 'きょうし', 'GIÁO SƯ', 'Giáo viên', 'N5'],
    ['講師', 'こうし', 'GIẢNG SƯ', 'giảng viên/ giáo viên', 'N4'],
  ]],
  ['帽', 'MẠO', '', 'N5', [
    ['帽子', 'ぼうし', 'MẠO TỬ', 'Mũ', 'N5'],
    ['帽子をかぶります', 'ぼうしをかぶります', 'MẠO TỬ', 'Đội mũ', 'N5'],
  ]],
  ['座', 'TỌA', '', 'N5', [
    ['座ります', 'すわります', 'TỌA', 'Ngồi', 'N5'],
    ['牡牛座', 'おうしざ', 'MẪU NGƯU TỌA', 'chòm sao Kim Ngưu', 'N4'],
  ]],
  ['庫', 'KHỐ', '', 'N5', [
    ['冷蔵庫', 'れいぞうこ', 'LÃNH TÀNG KHỐ', 'tủ lạnh', 'N5'],
    ['宝庫', 'ほうこ', 'BẢO KHỐ', 'kho báu', 'N4'],
  ]],
  ['康', 'KHANG', '', 'N5', [
    ['健康保険証', 'けんこうほけんしょう', 'KIỆN KHANG BẢO HIỂM CHỨNG', 'Thẻ bảo hiểm y tế', 'N5'],
    ['健康', 'けんこう', 'KIỆN KHANG', 'sức khỏe/ khỏe mạnh', 'N4'],
  ]],
  ['弾', 'ĐẠN', '', 'N5', [
    ['弾きます', 'ひきます', 'ĐÀN/ ĐẠN', 'Chơi (nhạc cụ)', 'N5'],
    ['爆弾', 'ばくだん', 'BỘC ĐẠN', 'bom', 'N4'],
  ]],
  ['当', 'ĐƯƠNG', '', 'N5', [
    ['お弁当', 'おべんとう', 'BIỆN ĐƯƠNG', 'Cơm hộp', 'N5'],
    ['適当', 'てきとう', 'THÍCH ĐƯƠNG', 'thích hợp/ vừa phải', 'N4'],
  ]],
  ['役', 'DỊCH', '', 'N5', [
    ['市役所', 'しやくしょ', 'THỊ DỊCH SỞ', 'văn phòng hành chính quận, thành phố', 'N5'],
    ['役に立ちます', 'やくにたちます', 'DỊCH LẬP', 'Giúp ích', 'N5'],
  ]],
  ['彼', 'BỈ', '', 'N5', [
    ['彼', 'かれ', 'BỈ', 'anh ấy, bạn trai', 'N5'],
    ['彼女', 'かのじょ', 'BỈ NỮ', 'chị ấy, bạn gái', 'N5'],
  ]],
  ['後', 'HẬU', '', 'N5', [
    ['午後', 'ごご', 'NGỌ HẬU', 'Chiều, sau 12 giờ trưa', 'N5'],
    ['最後に', 'さいごに', 'TỐI HẬU', 'cuối cùng', 'N4'],
  ]],
  ['忙', 'MANG', '', 'N5', [
    ['忙しい', 'いそがしい', 'MANG', 'bận', 'N5'],
    ['お忙しいですか', 'おいそがしいですか', 'MANG', 'Anh/chị có bận không?', 'N4'],
  ]],
  ['換', 'HOÁN', '', 'N5', [
    ['換えます', 'かえます', 'HOÁN', 'Đổi', 'N5'],
    ['乗り換えます', 'のりかえます', 'THỪA HOÁN', 'Chuyển, đổi (tàu)', 'N5'],
  ]],
  ['散', 'TÁN', '', 'N5', [
    ['散歩します', 'さんぽします', '', 'đi dạo', 'N5'],
    ['公園を散歩します', 'こうえんをさんぽします', 'CÔNG VIÊN TÁN BỘ', 'đi dạo ở công viên', 'N5'],
  ]],
  ['族', 'TỘC', '', 'N5', [
    ['家族', 'かぞく', 'GIA TỘC', 'gia đình', 'N5'],
    ['ご家族', 'ごかぞく', 'GIA TỘC', 'Gia đình', 'N5'],
  ]],
  ['易', 'DỊ', 'DỊCH', 'N5', [
    ['易しい', 'やさしい', 'DỊ', 'dễ', 'N5'],
    ['貿易', 'ぼうえき', 'MẬU DỊCH', 'mậu dịch/ thương mại quốc tế', 'N4'],
  ]],
  ['暖', 'NOÃN', '', 'N5', [
    ['暖かい', 'あたたかい', 'NOÃN', 'ấm áp', 'N5'],
    ['暖房', 'だんぼう', 'NOÃN PHÒNG', 'lò sưởi/ thiết bị làm ấm', 'N4'],
  ]],
  ['暗', 'ÁM', '', 'N5', [
    ['暗い', 'くらい', 'ÁM', 'Tối', 'N5'],
    ['暗証番号', 'あんしょうばんごう', 'ÁM CHỨNG PHIÊN HIỆU', 'Mật khẩu', 'N5'],
  ]],
  ['曇', 'ĐÀM', '', 'N5', [
    ['曇り', 'くもり', 'ĐÀM', 'Có mây', 'N5'],
    ['曇ります', 'くもります', 'ĐÀM', 'có mây/ trời râm', 'N4'],
  ]],
  ['束', 'THÚC', '', 'N5', [
    ['約束', 'やくそく', 'ƯỚC THÚC', 'cuộc hẹn, lời hứa', 'N5'],
    ['約束します', 'やくそくします', '', 'hứa hẹn', 'N4'],
  ]],
  ['案', 'ÁN', '', 'N5', [
    ['案内します', 'あんないします', 'ÁN NỘI', 'Hướng dẫn, giới thiệu', 'N5'],
    ['案内書', 'あんないしょ', 'ÁN NỘI THƯ', 'sách hướng dẫn/ tài liệu hướng dẫn', 'N4'],
  ]],
  ['橋', 'KIỀU', '', 'N5', [
    ['橋', 'はし', 'KIỀU', 'Cầu', 'N5'],
    ['橋を渡ります', 'はしをわたります', 'KIỀU ĐỘ', 'Qua, đi qua cầu', 'N5'],
  ]],
  ['欲', 'DỤC', '', 'N5', [
    ['欲しい', 'ほしい', 'DỤC', 'muốn có', 'N5'],
    ['食欲', 'しょくよく', 'THỰC DỤC', 'sự thèm ăn/ cảm giác muốn ăn', 'N4'],
  ]],
  ['正', 'CHÍNH', '', 'N5', [
    ['お正月', 'おしょうがつ', 'CHÍNH NGUYỆT', 'Tết (Dương lịch)', 'N5'],
    ['正しい', 'ただしい', 'CHÍNH', 'đúng/ chính xác', 'N4'],
  ]],
  ['池', 'TRÌ', '', 'N5', [
    ['電池', 'でんち', 'ĐIỆN TRÌ', 'Pin', 'N5'],
    ['池', 'いけ', 'TRÌ', 'cái ao', 'N4'],
  ]],
  ['泊', 'BẠC', '', 'N5', [
    ['ホテルに泊まります', 'ホテルにとまります', 'BẠC', 'Trọ ở khách sạn', 'N5'],
    ['泊まります', 'とまります', '', 'trọ lại/ nghỉ đêm', 'N4'],
  ]],
  ['泳', 'VỊNH', '', 'N5', [
    ['泳ぎます', 'およぎます', 'VĨNH', 'bơi', 'N5'],
    ['水泳', 'すいえい', 'THỦY VỊNH', 'bơi/ môn bơi', 'N4'],
  ]],
  ['活', 'HOẠT', '', 'N5', [
    ['生活', 'せいかつ', 'SINH HOẠT', 'cuộc sống, sinh hoạt', 'N5'],
    ['活動', 'かつどう', 'HOẠT ĐỘNG', 'hoạt động', 'N4'],
  ]],
  ['済', 'TẾ', '', 'N5', [
    ['経済', 'けいざい', 'KINH TẾ', 'kinh tế', 'N5'],
    ['済みます', 'すみます', '', 'xong/ kết thúc', 'N4'],
  ]],
  ['準', 'CHUẨN', '', 'N5', [
    ['準備', 'じゅんび', 'CHUẨN BỊ', 'Chuẩn bị', 'N5'],
    ['準備します', 'じゅんびします', '', 'chuẩn bị', 'N4'],
  ]],
  ['然', 'NHIÊN', '', 'N5', [
    ['全然', 'ぜんぜん', 'TOÀN NHIÊN', 'hoàn toàn ~ không', 'N5'],
    ['自然', 'しぜん', 'TỰ NHIÊN', 'tự nhiên/ thiên nhiên', 'N4'],
  ]],
  ['煙', 'YÊN', '', 'N5', [
    ['禁煙', 'きんえん', 'CẤM YÊN', 'Cấm hút thuốc', 'N5'],
    ['煙', 'けむり', 'YÊN', 'khói', 'N4'],
  ]],
  ['現', 'HIỆN', '', 'N5', [
    ['現金', 'げんきん', 'HIỆN KIM', 'Tiền mặt', 'N5'],
    ['表現', 'ひょうげん', 'BIỂU HIỆN', 'cách nói/ cách diễn đạt', 'N4'],
  ]],
  ['球', 'CẦU', '', 'N5', [
    ['野球', 'やきゅう', 'DÃ CẦU', 'bóng chày', 'N5'],
    ['地球', 'ちきゅう', 'ĐỊA CẦU', 'trái đất', 'N4'],
  ]],
  ['画', 'HỌA', '', 'N5', [
    ['映画', 'えいが', 'ẢNH HỌA', 'phim, điện ảnh', 'N5'],
    ['漫画', 'まんが', 'MẠN HỌA', 'truyện tranh/ manga', 'N4'],
  ]],
  ['眠', 'MIÊN', '', 'N5', [
    ['眠い', 'ねむい', 'MIÊN', 'Buồn ngủ', 'N5'],
    ['眠ります', 'ねむります', 'MIÊN', 'ngủ', 'N4'],
  ]],
  ['眼', 'NHÃN', '', 'N5', [
    ['眼鏡', 'めがね', 'NHÃN KÍNH', 'Kính', 'N5'],
    ['眼鏡をかけます', 'めがねをかけます', 'NHÃN KÍNH', 'Đeo kính', 'N5'],
  ]],
  ['短', 'ĐOẢN', '', 'N5', [
    ['短い', 'みじかい', 'ĐOẢN', 'Ngắn', 'N5'],
    ['短く', 'みじかく', 'ĐOẢN', 'ngắn/ ngắn gọn', 'N4'],
  ]],
  ['節', 'TIẾT', '', 'N5', [
    ['季節', 'きせつ', 'QUÝ TIẾT', 'Mùa', 'N5'],
    ['調節します', 'ちょうせつします', 'ĐIỀU TIẾT', 'điều tiết/ điều chỉnh', 'N4'],
  ]],
  ['箱', 'TƯƠNG', '', 'N5', [
    ['箱', 'はこ', 'TƯƠNG', 'hộp', 'N5'],
    ['ごみ箱', 'ごみばこ', 'TƯƠNG', 'thùng rác', 'N4'],
  ]],
  ['紅', 'HỒNG', '', 'N5', [
    ['紅茶', 'こうちゃ', 'HỒNG TRÀ', 'trà đen', 'N5'],
    ['紅葉', 'もみじ', 'HỒNG DIỆP', 'Lá đỏ', 'N5'],
  ]],
  ['結', 'KẾT', '', 'N5', [
    ['結婚します', 'けっこんします', 'KẾT HÔN', 'kết hôn, lập gia đình, cưới', 'N5'],
    ['結婚式', 'けっこんしき', 'KẾT HÔN THỨC', 'lễ cưới/ đám cưới', 'N4'],
  ]],
  ['絵', 'HỘI', '', 'N5', [
    ['絵', 'え', 'HỘI', 'Tranh, hội họa', 'N5'],
    ['絵はがき', 'えはがき', 'HỘI', 'bưu ảnh', 'N4'],
  ]],
  ['線', 'TUYẾN', '', 'N5', [
    ['新幹線', 'しんかんせん', 'TÂN CAN TUYẾN', 'tàu Shinkansen', 'N5'],
    ['線', 'せん', 'TUYẾN', 'đường/ đường kẻ', 'N4'],
  ]],
  ['置', 'TRÍ', '', 'N5', [
    ['置きます', 'おきます', 'TRÍ', 'Đặt, để', 'N5'],
    ['置き場', 'おきば', 'TRÍ TRƯỜNG', 'nơi để/ chỗ để/ bãi để', 'N4'],
  ]],
  ['舞', 'VŨ', '', 'N5', [
    ['歌舞伎', 'かぶき', 'CA VŨ KỸ', 'Kabuki', 'N5'],
    ['お見舞い', 'おみまい', 'KIẾN VŨ', 'việc thăm người ốm', 'N4'],
  ]],
  ['葉', 'DIỆP', '', 'N5', [
    ['紅葉', 'もみじ', 'HỒNG DIỆP', 'Lá đỏ', 'N5'],
    ['葉', 'は', 'DIỆP', 'cái lá', 'N4'],
  ]],
  ['薬', 'DƯỢC', '', 'N5', [
    ['薬', 'くすり', 'DƯỢC', 'Thuốc', 'N5'],
    ['薬を飲みます', 'くすりをのみます', 'DƯỢC ẨM', 'Uống thuốc', 'N5'],
  ]],
  ['認', 'NHẬN', '', 'N5', [
    ['確認', 'かくにん', 'XÁC NHẬN', 'Sự xác nhận, sự kiểm tra', 'N5'],
    ['確認します', 'かくにんします', '', 'xác nhận', 'N3'],
  ]],
  ['語', 'NGỮ', '', 'N5', [
    ['英語', 'えいご', 'ANH NGỮ', 'Tiếng Anh', 'N5'],
    ['日本語', 'にほんご', 'NHẬT BẢN NGỮ', 'Tiếng Nhật', 'N5'],
  ]],
  ['貸', 'THẢI', '', 'N5', [
    ['貸す', 'かす', 'THẢI', 'cho mượn, cho vay', 'N5'],
    ['貸します', 'かします', '', 'cho mượn', 'N5'],
  ]],
  ['質', 'CHẤT', '', 'N5', [
    ['質問します', 'しつもんします', 'CHẤT VẤN', 'đặt câu hỏi', 'N5'],
    ['質問に答えます', 'しつもんにこたえます', 'CHẤT VẤN ĐÁP', 'trả lời câu hỏi', 'N4'],
  ]],
  ['越', 'VIỆT', '', 'N5', [
    ['引っ越しします', 'ひっこしします', 'DẪN VIỆT', 'Chuyển nhà', 'N5'],
    ['引っ越します', 'ひっこします', '', 'chuyển nhà', 'N4'],
  ]],
  ['足', 'TÚC', '', 'N5', [
    ['足', 'あし', 'TÚC', 'Chân', 'N5'],
    ['足ります', 'たります', 'TÚC', 'Đủ', 'N5'],
  ]],
  ['返', 'PHẢN', '', 'N5', [
    ['返します', 'かえします', 'PHẢN', 'Trả lại', 'N5'],
    ['返事', 'へんじ', 'PHẢN SỰ', 'hồi âm/ trả lời', 'N4'],
  ]],
  ['違', 'VI', '', 'N5', [
    ['違います', 'ちがいます', 'VI', 'Không phải./ không đúng./ sai rồi', 'N5'],
    ['駐車違反', 'ちゅうしゃいはん', 'TRÚ XA VI PHẢN', 'đỗ xe sai quy định/ đỗ xe trái phép', 'N4'],
  ]],
  ['野', 'DÃ', '', 'N5', [
    ['野菜', 'やさい', 'DÃ THÁI', 'rau', 'N5'],
    ['野球', 'やきゅう', 'DÃ CẦU', 'bóng chày', 'N5'],
  ]],
  ['険', 'HIỂM', '', 'N5', [
    ['健康保険証', 'けんこうほけんしょう', 'KIỆN KHANG BẢO HIỂM CHỨNG', 'Thẻ bảo hiểm y tế', 'N5'],
    ['危険', 'きけん', 'NGUY HIỂM', 'nguy hiểm', 'N4'],
  ]],
  ['階', 'GIAI', '', 'N5', [
    ['何階', 'なんがい', 'HÀ GIAI', 'tầng mấy', 'N5'],
    ['階段', 'かいだん', 'GIAI ĐOẠN', 'Cầu thang', 'N5'],
  ]],
  ['雑', 'TẠP', '', 'N5', [
    ['雑誌', 'ざっし', 'TẠP CHÍ', 'Tạp chí', 'N5'],
    ['複雑', 'ふくざつ', 'PHỨC TẠP', 'phức tạp', 'N4'],
  ]],
  ['雪', 'TUYẾT', '', 'N5', [
    ['雪', 'ゆき', 'TUYẾT', 'Tuyết', 'N5'],
    ['雪祭り', 'ゆきまつり', 'TUYẾT TẾ', 'Lễ hội tuyết', 'N4'],
  ]],
  ['青', 'THANH', '', 'N5', [
    ['青い', 'あおい', 'THANH', 'xanh da trời', 'N5'],
    ['青', 'あお', 'THANH', 'màu xanh da trời', 'N4'],
  ]],
  ['領', 'LÃNH', '', 'N5', [
    ['大統領', 'だいとうりょう', 'ĐẠI THỐNG LÃNH', 'Tổng thống', 'N5'],
    ['領収書', 'りょうしゅうしょ', 'LÃNH THÂU THƯ', 'hóa đơn/ biên lai', 'N4'],
  ]],
  ['頭', 'ĐẦU', '', 'N5', [
    ['頭', 'あたま', 'ĐẦU', 'Đầu', 'N5'],
    ['頭がいい', 'あたまがいい', 'ĐẦU', 'Thông minh', 'N5'],
  ]],
  ['題', 'ĐỀ', '', 'N5', [
    ['宿題', 'しゅくだい', 'TÚC ĐỀ', 'bài tập về nhà', 'N5'],
    ['問題', 'もんだい', 'VẤN ĐỀ', 'Vấn đề', 'N5'],
  ]],
  ['飛', 'PHI', '', 'N5', [
    ['飛行機', 'ひこうき', 'PHI HÀNH CƠ', 'máy bay', 'N5'],
    ['飛びます', 'とびます', 'PHI', 'bay', 'N5'],
  ]],
  ['駐', 'TRÚ', '', 'N5', [
    ['駐車場', 'ちゅうしゃじょう', 'TRÚ XA TRƯỜNG', 'Bãi đỗ xe', 'N5'],
    ['駐車違反', 'ちゅうしゃいはん', 'TRÚ XA VI PHẢN', 'đỗ xe sai quy định/ đỗ xe trái phép', 'N4'],
  ]],
  ['黒', 'HẮC', '', 'N5', [
    ['黒い', 'くろい', 'HẮC', 'Đen', 'N5'],
    ['黒', 'くろ', 'HẮC', 'màu đen', 'N4'],
  ]],
  ['万', 'VẠN', '', 'N5', [
    ['万', 'まん', 'VẠN', 'mười nghìn, vạn', 'N5'],
  ]],
  ['両', 'LƯỠNG', '', 'N5', [
    ['両親', 'りょうしん', 'LƯỠNG THÂN', 'bố mẹ', 'N5'],
  ]],
  ['乳', 'NHŨ', '', 'N5', [
    ['牛乳', 'ぎゅうにゅう', 'NGƯU NHŨ', 'sữa bò', 'N5'],
  ]],
  ['介', 'GIỚI', '', 'N5', [
    ['紹介します', 'しょうかいします', 'THIỆU GIỚI', 'Giới thiệu', 'N5'],
  ]],
  ['伎', 'KỸ', '', 'N5', [
    ['歌舞伎', 'かぶき', 'CA VŨ KỸ', 'Kabuki', 'N5'],
  ]],
  ['低', 'ĐÊ', '', 'N5', [
    ['低い', 'ひくい', 'ĐÊ', 'thấp', 'N5'],
  ]],
  ['価', 'GIÁ', '', 'N5', [
    ['物価', 'ぶっか', 'VẬT GIÁ', 'Giá cả, mức giá, vật giá', 'N5'],
  ]],
  ['修', 'TU', '', 'N5', [
    ['修理します', 'しゅうりします', 'TU LÝ', 'Sửa chữa, tu sửa', 'N5'],
  ]],
  ['僕', 'BỘC', '', 'N5', [
    ['僕', 'ぼく', 'BỘC', 'Tớ', 'N5'],
  ]],
  ['億', 'ỨC', '', 'N5', [
    ['億', 'おく', 'ỨC', 'một trăm triệu', 'N5'],
  ]],
  ['写', 'TẢ', '', 'N5', [
    ['写真', 'しゃしん', 'TẢ CHÂN', 'ảnh', 'N5'],
  ]],
  ['冬', 'ĐÔNG', '', 'N5', [
    ['冬', 'ふゆ', 'ĐÔNG', 'Mùa đông', 'N5'],
  ]],
  ['務', 'VỤ', '', 'N5', [
    ['事務所', 'じむしょ', 'SỰ VỤ SỞ', 'văn phòng', 'N5'],
  ]],
  ['千', 'THIÊN', '', 'N5', [
    ['千', 'せん', 'THIÊN', 'nghìn', 'N5'],
  ]],
  ['単', 'ĐƠN', '', 'N5', [
    ['簡単', 'かんたん', 'GIẢN ĐƠN', 'Đơn giản, dễ', 'N5'],
  ]],
  ['卵', 'NOÃN', '', 'N5', [
    ['卵', 'たまご', 'NOÃN', 'trứng', 'N5'],
  ]],
  ['去', 'KHU', '', 'N5', [
    ['去年', 'きょねん', 'KHU NIÊN', 'năm ngoái', 'N5'],
  ]],
  ['友', 'HỮU', '', 'N5', [
    ['友達', 'ともだち', 'HỮU ĐẠT', 'bạn, bạn bè', 'N5'],
  ]],
  ['古', 'CỔ', '', 'N5', [
    ['古い', 'ふるい', 'CỔ', 'cũ', 'N5'],
  ]],
  ['君', 'QUÂN', '', 'N5', [
    ['君', 'きみ', 'QUÂN', 'Cậu, bạn', 'N5'],
  ]],
  ['呼', 'HÔ', '', 'N5', [
    ['呼びます', 'よびます', 'HÔ', 'Gọi', 'N5'],
  ]],
  ['団', 'ĐOÀN', '', 'N5', [
    ['布団', 'ふとん', 'BỐ ĐOÀN', 'Chăn, đệm', 'N5'],
  ]],
  ['堂', 'ĐƯỜNG', '', 'N5', [
    ['食堂', 'しょくどう', 'THỰC ĐƯỜNG', 'nhà ăn', 'N5'],
  ]],
  ['塩', 'DIÊM', '', 'N5', [
    ['塩', 'しお', 'DIÊM', 'Muối', 'N5'],
  ]],
  ['夏', 'HẠ', '', 'N5', [
    ['夏', 'なつ', 'HẠ', 'Mùa hè', 'N5'],
  ]],
  ['多', 'ĐA', '', 'N5', [
    ['人が多い', 'ひとがおおい', 'NHÂN ĐA', 'Nhiều người', 'N5'],
  ]],
  ['妻', 'THÊ', '', 'N5', [
    ['妻', 'つま', 'THÊ', 'vợ', 'N5'],
  ]],
  ['季', 'QUÝ', '', 'N5', [
    ['季節', 'きせつ', 'QUÝ TIẾT', 'Mùa', 'N5'],
  ]],
  ['宿', 'TÚC', '', 'N5', [
    ['宿題', 'しゅくだい', 'TÚC ĐỀ', 'bài tập về nhà', 'N5'],
  ]],
  ['寂', 'TỊCH', '', 'N5', [
    ['寂しい', 'さびしい', 'TỊCH', 'buồn, cô đơn', 'N5'],
  ]],
  ['寒', 'HÀN', '', 'N5', [
    ['寒い', 'さむい', 'HÀN', 'lạnh, rét', 'N5'],
  ]],
  ['寝', 'TẨM', '', 'N5', [
    ['寝ます', 'ねます', 'TẨM', 'Ngủ, đi ngủ', 'N5'],
  ]],
  ['寮', 'LIÊU', '', 'N5', [
    ['寮', 'りょう', 'LIÊU', 'kí túc xá', 'N5'],
  ]],
  ['寺', 'TỰ', '', 'N5', [
    ['お寺', 'おてら', 'TỰ', 'Chùa', 'N5'],
  ]],
  ['封', 'PHONG', '', 'N5', [
    ['封筒', 'ふうとう', 'PHONG ĐỒNG', 'phong bì', 'N5'],
  ]],
  ['専', 'CHUYÊN', '', 'N5', [
    ['専門', 'せんもん', 'CHUYÊN MÔN', 'Chuyên môn', 'N5'],
  ]],
  ['局', 'CỤC', '', 'N5', [
    ['郵便局', 'ゆうびんきょく', 'BƯU TIỆN CỤC', 'Bưu điện', 'N5'],
  ]],
  ['川', 'XUYÊN', '', 'N5', [
    ['川', 'かわ', 'XUYÊN', 'sông', 'N5'],
  ]],
  ['左', 'TẢ', '', 'N5', [
    ['左', 'ひだり', 'TẢ', 'Trái', 'N5'],
  ]],
  ['差', 'SAI', '', 'N5', [
    ['交差点', 'こうさてん', 'GIAO SAI ĐIỂM', 'Ngã tư', 'N5'],
  ]],
  ['市', 'THỊ', '', 'N5', [
    ['市役所', 'しやくしょ', 'THỊ DỊCH SỞ', 'văn phòng hành chính quận, thành phố', 'N5'],
  ]],
  ['帳', 'TRƯƠNG', '', 'N5', [
    ['手帳', 'てちょう', 'THỦ TRƯƠNG', 'Sổ tay', 'N5'],
  ]],
  ['幹', 'CAN', '', 'N5', [
    ['新幹線', 'しんかんせん', 'TÂN CAN TUYẾN', 'tàu Shinkansen', 'N5'],
  ]],
  ['広', 'QUẢNG', '', 'N5', [
    ['広い', 'ひろい', 'QUẢNG', 'rộng', 'N5'],
  ]],
  ['床', 'SÀNG', '', 'N5', [
    ['床屋', 'とこや', 'SÀNG ỐC', 'Hiệu cắt tóc', 'N5'],
  ]],
  ['庭', 'ĐÌNH', '', 'N5', [
    ['庭', 'にわ', 'ĐÌNH', 'vườn', 'N5'],
  ]],
  ['弁', 'BIỆN', '', 'N5', [
    ['お弁当', 'おべんとう', 'BIỆN ĐƯƠNG', 'Cơm hộp', 'N5'],
  ]],
  ['弱', 'NHƯỢC', '', 'N5', [
    ['弱い', 'よわい', 'NHƯỢC', 'Yếu', 'N5'],
  ]],
  ['払', 'PHẤT', '', 'N5', [
    ['払います', 'はらいます', 'PHẤT', 'Trả tiền', 'N5'],
  ]],
  ['捨', 'SẢ', '', 'N5', [
    ['捨てます', 'すてます', 'SẢ', 'Vứt, bỏ đi', 'N5'],
  ]],
  ['掃', 'TẢO', '', 'N5', [
    ['掃除します', 'そうじします', 'TẢO TRÚ', 'Dọn vệ sinh', 'N5'],
  ]],
  ['探', 'THÁM', '', 'N5', [
    ['探します', 'さがします', 'THÁM', 'tìm kiếm', 'N5'],
  ]],
  ['撲', 'PHÁC', '', 'N5', [
    ['相撲', 'すもう', 'TƯƠNG PHÁC', 'Vật Sumo', 'N5'],
  ]],
  ['政', 'CHÍNH', '', 'N5', [
    ['政治', 'せいじ', 'CHÍNH TRỊ', 'Chính trị', 'N5'],
  ]],
  ['映', 'ẢNH', '', 'N5', [
    ['映画', 'えいが', 'ẢNH HỌA', 'phim, điện ảnh', 'N5'],
  ]],
  ['春', 'XUÂN', '', 'N5', [
    ['春', 'はる', 'XUÂN', 'Mùa xuân', 'N5'],
  ]],
  ['普', 'PHỔ', '', 'N5', [
    ['普通', 'ふつう', 'PHỔ THÔNG', 'tàu thường (dừng cả ở các ga lẻ)', 'N5'],
  ]],
  ['暑', 'THỬ', '', 'N5', [
    ['暑い', 'あつい', 'THỬ', 'nóng', 'N5'],
  ]],
  ['暇', 'HẠ', '', 'N5', [
    ['暇', 'ひま', 'HẠ', 'rảnh rỗi', 'N5'],
  ]],
  ['有', 'HỮU', '', 'N5', [
    ['有名', 'ゆうめい', 'HỮU DANH', 'nổi tiếng', 'N5'],
  ]],
  ['末', 'MẠT', '', 'N5', [
    ['週末', 'しゅうまつ', 'CHU MẠT', 'cuối tuần', 'N5'],
  ]],
  ['机', 'KỶ', '', 'N5', [
    ['机', 'つくえ', 'KỶ', 'Bàn', 'N5'],
  ]],
  ['杯', 'BỘI', '', 'N5', [
    ['乾杯', 'かんぱい', 'CAN BỘI', 'Nâng cốc!/cạn chén', 'N5'],
  ]],
  ['枚', 'MAI', '', 'N5', [
    ['～枚', '～まい', 'MAI', '～ tờ, tấm', 'N5'],
  ]],
  ['果', 'QUẢ', '', 'N5', [
    ['果物', 'くだもの', 'QUẢ VẬT', 'hoa quả, trái cây', 'N5'],
  ]],
  ['桜', 'ANH', '', 'N5', [
    ['桜', 'さくら', 'ANH', 'anh đào', 'N5'],
  ]],
  ['械', 'GIỚI', '', 'N5', [
    ['機械', 'きかい', 'CƠ GIỚI', 'Máy, máy móc', 'N5'],
  ]],
  ['歳', 'TUẾ', '', 'N5', [
    ['何歳', 'なんさい', 'HÀ TUẾ', 'Mấy tuổi, bao nhiêu tuổi', 'N5'],
  ]],
  ['死', 'TỬ', '', 'N5', [
    ['死にます', 'しにます', 'TỬ', 'chết', 'N5'],
  ]],
  ['泣', 'KHÁP', '', 'N5', [
    ['泣きます', 'なきます', 'KHÁP', 'khóc', 'N5'],
  ]],
  ['浴', 'DỤC', '', 'N5', [
    ['浴びます', 'あびます', '', 'tắm (vòi sen)', 'N5'],
  ]],
  ['涼', 'LƯƠNG', '', 'N5', [
    ['涼しい', 'すずしい', 'LƯƠNG', 'Mát mẻ', 'N5'],
  ]],
  ['漢', 'HÁN', '', 'N5', [
    ['漢字', 'かんじ', 'HÁN TỰ', 'chữ hán', 'N5'],
  ]],
  ['点', 'ĐIỂM', '', 'N5', [
    ['交差点', 'こうさてん', 'GIAO SAI ĐIỂM', 'Ngã tư', 'N5'],
  ]],
  ['牧', 'MỤC', '', 'N5', [
    ['牧場', 'ぼくじょう', 'MỤC TRƯỜNG', 'Trang trại chăn nuôi', 'N5'],
  ]],
  ['犬', 'KHUYỂN', '', 'N5', [
    ['犬', 'いぬ', 'KHUYỂN', 'chó', 'N5'],
  ]],
  ['独', 'ĐỘC', '', 'N5', [
    ['独身', 'どくしん', 'ĐỘC THÂN', 'Độc thân', 'N5'],
  ]],
  ['狭', 'HIỆP', '', 'N5', [
    ['狭い', 'せまい', 'HIỆP', 'chật, hẹp', 'N5'],
  ]],
  ['猫', 'MIÊU', '', 'N5', [
    ['猫', 'ねこ', 'MIÊU', 'Mèo', 'N5'],
  ]],
  ['甘', 'CAM', '', 'N5', [
    ['甘い', 'あまい', 'CAM', 'Ngọt', 'N5'],
  ]],
  ['産', 'SẢN', '', 'N5', [
    ['お土産', 'おみやげ', 'THỔ SẢN', 'quà', 'N5'],
  ]],
  ['田', 'ĐIỀN', '', 'N5', [
    ['田舎', 'いなか', 'ĐIỀN XÁ', 'quê, nông thôn', 'N5'],
  ]],
  ['町', 'ĐINH', '', 'N5', [
    ['町', 'まち', 'ĐINH', 'thị trấn, thị xã, thành phố', 'N5'],
  ]],
  ['百', 'BÁCH', '', 'N5', [
    ['百', 'ひゃく', 'BÁCH', 'Trăm', 'N5'],
  ]],
  ['皆', 'GIAI', '', 'N5', [
    ['皆さん', 'みなさん', 'GIAI', 'Các anh chị, các ông bà, các bạn, quý vị', 'N5'],
  ]],
  ['県', 'HUYỆN', '', 'N5', [
    ['県', 'けん', 'HUYỆN', 'tỉnh', 'N5'],
  ]],
  ['砂', 'SA', '', 'N5', [
    ['砂糖', 'さとう', 'SA ĐƯỜNG', 'Đường', 'N5'],
  ]],
  ['祈', 'KỲ', '', 'N5', [
    ['お祈り', 'おいのり', 'KỲ', 'Việc cầu nguyện', 'N5'],
  ]],
  ['神', 'THẦN', '', 'N5', [
    ['神社', 'じんじゃ', 'THẦN XÃ', 'Đền thờ đạo thần', 'N5'],
  ]],
  ['秋', 'THU', '', 'N5', [
    ['秋', 'あき', 'THU', 'Mùa thu', 'N5'],
  ]],
  ['窓', 'SONG', '', 'N5', [
    ['窓', 'まど', 'SONG', 'cửa sổ', 'N5'],
  ]],
  ['符', 'PHÙ', '', 'N5', [
    ['切符', 'きっぷ', 'THIẾT PHÙ', 'vé', 'N5'],
  ]],
  ['筆', 'BÚT', '', 'N5', [
    ['鉛筆', 'えんぴつ', 'DUYÊN BÚT', 'Bút chì', 'N5'],
  ]],
  ['筒', 'ĐỒNG', '', 'N5', [
    ['封筒', 'ふうとう', 'PHONG ĐỒNG', 'phong bì', 'N5'],
  ]],
  ['簡', 'GIẢN', '', 'N5', [
    ['簡単', 'かんたん', 'GIẢN ĐƠN', 'Đơn giản, dễ', 'N5'],
  ]],
  ['糖', 'ĐƯỜNG', '', 'N5', [
    ['砂糖', 'さとう', 'SA ĐƯỜNG', 'Đường', 'N5'],
  ]],
  ['紹', 'THIỆU', '', 'N5', [
    ['紹介します', 'しょうかいします', 'THIỆU GIỚI', 'Giới thiệu', 'N5'],
  ]],
  ['統', 'THỐNG', '', 'N5', [
    ['大統領', 'だいとうりょう', 'ĐẠI THỐNG LÃNH', 'Tổng thống', 'N5'],
  ]],
  ['緑', 'LỤC', '', 'N5', [
    ['緑', 'みどり', 'LỤC', 'Màu xanh lá cây', 'N5'],
  ]],
  ['練', 'LUYỆN', '', 'N5', [
    ['練習します', 'れんしゅうします', 'LUYỆN TẬP', 'Luyện tập, thực hành', 'N5'],
  ]],
  ['考', 'KHẢO', '', 'N5', [
    ['考えます', 'かんがえます', 'KHẢO', 'nghĩ, suy nghĩ', 'N5'],
  ]],
  ['耳', 'NHĨ', '', 'N5', [
    ['耳', 'みみ', 'NHĨ', 'Tai', 'N5'],
  ]],
  ['背', 'BỐI', '', 'N5', [
    ['背が高い', 'せがたかい', 'BỐI CAO', 'Cao', 'N5'],
  ]],
  ['脱', 'THOÁT', '', 'N5', [
    ['脱ぎます', 'ぬぎます', 'THOÁT', 'Cởi', 'N5'],
  ]],
  ['舎', 'XÁ', '', 'N5', [
    ['田舎', 'いなか', 'ĐIỀN XÁ', 'quê, nông thôn', 'N5'],
  ]],
  ['航', 'HÀNG', '', 'N5', [
    ['航空便', 'こうくうびん', 'HÀNG KHÔNG TIỆN', 'gửi bằng đường hàng không', 'N5'],
  ]],
  ['若', 'NHƯỢC', '', 'N5', [
    ['若い', 'わかい', 'NHƯỢC', 'Trẻ', 'N5'],
  ]],
  ['英', 'ANH', '', 'N5', [
    ['英語', 'えいご', 'ANH NGỮ', 'Tiếng Anh', 'N5'],
  ]],
  ['菓', 'QUẢ', '', 'N5', [
    ['お菓子', 'おかし', 'QUẢ TỬ', 'Bánh kẹo', 'N5'],
  ]],
  ['菜', 'THÁI', '', 'N5', [
    ['野菜', 'やさい', 'DÃ THÁI', 'rau', 'N5'],
  ]],
  ['蔵', 'TÀNG', '', 'N5', [
    ['冷蔵庫', 'れいぞうこ', 'LÃNH TÀNG KHỐ', 'tủ lạnh', 'N5'],
  ]],
  ['製', 'CHẾ', '', 'N5', [
    ['製品', 'せいひん', 'CHẾ PHẨM', 'Sản phẩm', 'N5'],
  ]],
  ['角', 'GIÁC', '', 'N5', [
    ['角', 'かど', 'GIÁC', 'Góc', 'N5'],
  ]],
  ['触', 'XÚC', '', 'N5', [
    ['ドアに触ります', 'ドアにさわります', 'XÚC', 'Sờ, chạm vào cửa', 'N5'],
  ]],
  ['言', 'NGÔN', '', 'N5', [
    ['言います', 'いいます', 'NGÔN', 'Nói', 'N5'],
  ]],
  ['記', 'KÝ', '', 'N5', [
    ['日記', 'にっき', 'NHẬT KÝ', 'Nhật ký', 'N5'],
  ]],
  ['誌', 'CHÍ', '', 'N5', [
    ['雑誌', 'ざっし', 'TẠP CHÍ', 'Tạp chí', 'N5'],
  ]],
  ['誕', 'ĐẢN', '', 'N5', [
    ['誕生日', 'たんじょうび', 'ĐẢN SINH NHẬT', 'sinh nhật', 'N5'],
  ]],
  ['課', 'KHOA', '', 'N5', [
    ['課長', 'かちょう', 'KHOA TRƯỜNG', 'Tổ trưởng', 'N5'],
  ]],
  ['負', 'PHỤ', '', 'N5', [
    ['負けます', 'まけます', 'PHỤ', 'Thua', 'N5'],
  ]],
  ['賃', 'NHẦM', '', 'N5', [
    ['家賃', 'やちん', 'GIA NHẦM', 'Tiền thuê nhà', 'N5'],
  ]],
  ['資', 'TƯ', '', 'N5', [
    ['資料', 'しりょう', 'TƯ LIỆU', 'Tài liệu, tư liệu', 'N5'],
  ]],
  ['趣', 'THÚ', '', 'N5', [
    ['趣味', 'しゅみ', 'THÚ VỊ', 'Sở thích, thú vui', 'N5'],
  ]],
  ['軽', 'KHINH', '', 'N5', [
    ['軽い', 'かるい', 'KHINH', 'Nhẹ', 'N5'],
  ]],
  ['辛', 'TÂN', '', 'N5', [
    ['辛い', 'からい', 'TÂN', 'Cay', 'N5'],
  ]],
  ['辞', 'TỪ', '', 'N5', [
    ['辞書', 'じしょ', 'TỪ THƯ', 'Từ điển', 'N5'],
  ]],
  ['迎', 'NGHINH', '', 'N5', [
    ['迎えます', 'むかえます', 'NGHINH', 'đón', 'N5'],
  ]],
  ['造', 'TẠO', '', 'N5', [
    ['造ります', 'つくります', 'TẠO', 'Chế tạo, sản xuất', 'N5'],
  ]],
  ['遊', 'DU', '', 'N5', [
    ['遊びます', 'あそびます', 'DU', 'chơi', 'N5'],
  ]],
  ['選', 'TUYỂN', '', 'N5', [
    ['選びます', 'えらびます', 'TUYỂN', 'chọn', 'N5'],
  ]],
  ['郵', 'BƯU', '', 'N5', [
    ['郵便局', 'ゆうびんきょく', 'BƯU TIỆN CỤC', 'Bưu điện', 'N5'],
  ]],
  ['酒', 'TỬU', '', 'N5', [
    ['お酒', 'おさけ', 'TỬU', 'rượu, rượu sake', 'N5'],
  ]],
  ['鉄', 'THIẾT', '', 'N5', [
    ['地下鉄', 'ちかてつ', 'ĐỊA HẠ THIẾT', 'tàu điện ngầm', 'N5'],
  ]],
  ['鉛', 'DUYÊN', '', 'N5', [
    ['鉛筆', 'えんぴつ', 'DUYÊN BÚT', 'Bút chì', 'N5'],
  ]],
  ['録', 'LỤC', '', 'N5', [
    ['登録', 'とうろく', 'ĐĂNG LỤC', 'việc đăng ký', 'N5'],
  ]],
  ['門', 'MÔN', '', 'N5', [
    ['専門', 'せんもん', 'CHUYÊN MÔN', 'Chuyên môn', 'N5'],
  ]],
  ['除', 'TRÚ', '', 'N5', [
    ['掃除します', 'そうじします', 'TẢO TRÚ', 'Dọn vệ sinh', 'N5'],
  ]],
  ['際', 'TẾ', '', 'N5', [
    ['国際～', 'こくさい～', 'QUỐC TẾ', '~ Quốc tế', 'N5'],
  ]],
  ['隣', 'LÂN', '', 'N5', [
    ['隣', 'となり', 'LÂN', 'bên cạnh', 'N5'],
  ]],
  ['難', 'NAN', '', 'N5', [
    ['難しい', 'むずかしい', 'NAN', 'khó', 'N5'],
  ]],
  ['静', 'TĨNH', '', 'N5', [
    ['静か', 'しずか', 'TĨNH', 'yên tĩnh', 'N5'],
  ]],
  ['頑', 'NGOAN', '', 'N5', [
    ['頑張ります', 'がんばります', 'NGOAN TRƯƠNG', 'cố, cố gắng', 'N5'],
  ]],
  ['頼', 'LẠI', '', 'N5', [
    ['頼みます', 'たのみます', 'LẠI', 'nhờ/ gọi (món)', 'N5'],
  ]],
  ['額', 'NGẠCH', '', 'N5', [
    ['金額', 'きんがく', 'KIM NGẠCH', 'Số tiền, khoản tiền', 'N5'],
  ]],
  ['顔', 'NHAN', '', 'N5', [
    ['顔', 'かお', 'NHAN', 'Mặt', 'N5'],
  ]],
  ['首', 'THỦ', '', 'N5', [
    ['首相', 'しゅしょう', 'THỦ TƯỚNG', 'Thủ tướng', 'N5'],
  ]],
  ['香', 'HƯƠNG', '', 'N5', [
    ['香港', 'ホンコン', 'HƯƠNG CẢNG', 'Hồng kông', 'N5'],
  ]],
  ['馬', 'MÃ', '', 'N5', [
    ['馬', 'うま', 'MÃ', 'Ngựa', 'N5'],
  ]],
  ['髪', 'PHÁT', '', 'N5', [
    ['髪', 'かみ', 'PHÁT', 'Tóc', 'N5'],
  ]],
  ['魚', 'NGƯ', '', 'N5', [
    ['魚', 'さかな', 'NGƯ', 'cá', 'N5'],
  ]],
  ['報', 'BÁO', '', 'N4', [
    ['電報', 'でんぽう', 'ĐIỆN BÁO', 'bức điện/ điện báo/ điện tín', 'N4'],
    ['情報', 'じょうほう', 'TÌNH BÁO', 'thông tin', 'N4'],
    ['電報代', 'でんぽうだい', 'ĐIỆN BÁO ĐẠI', 'tiền điện báo/ cước điện báo', 'N4'],
    ['天気予報', 'てんきよほう', 'THIÊN KHÍ DỰ BÁO', 'dự báo thời tiết', 'N4'],
    ['電報を打ちます', 'でんぽうをうちます', 'ĐIỆN BÁO ĐẢ', 'đánh điện/ gửi điện báo', 'N4'],
    ['情報が手に入ります', 'じょうほうがてにはいります', 'TÌNH BÁO THỦ NHẬP', 'lấy được thông tin', 'N4'],
  ]],
  ['掛', 'QUẢI', '', 'N4', [
    ['掛けます', 'かけます', 'QUẢI', 'treo', 'N4'],
    ['掛かります', 'かかります', '', 'được treo/ tốn (thời gian, tiền)', 'N4'],
    ['鍵が掛かります', 'かぎがかかります', 'QUẢI', 'cửa được khoá', 'N4'],
    ['かぎを掛けます', 'かぎをかけます', 'QUẢI', 'khóa/ khóa bằng chìa', 'N4'],
    ['いすに掛けます', 'いすにかけます', 'QUẢI', 'ngồi ghế', 'N4'],
    ['電話が掛かります', 'でんわがかかります', 'ĐIỆN THOẠI QUẢI', 'có điện thoại gọi đến', 'N4'],
  ]],
  ['発', 'PHÁT', '', 'N4', [
    ['発音', 'はつおん', 'PHÁT ÂM', 'phát âm', 'N4'],
    ['発表', 'はっぴょう', 'PHÁT BIỂU', 'phát biểu/ báo cáo', 'N4'],
    ['発明します', 'はつめいします', 'PHÁT MINH', 'phát minh', 'N4'],
    ['発見します', 'はっけんします', 'PHÁT KIẾN', 'phát hiện/ tìm ra', 'N4'],
    ['出発します', 'しゅっぱつします', 'XUẤT PHÁT', 'xuất phát/ khởi hành', 'N4'],
    ['発表します', 'はっぴょうします', '', 'phát biểu/ công bố', 'N3'],
  ]],
  ['式', 'THỨC', '', 'N4', [
    ['式', 'しき', 'THỨC', 'lễ/ buổi lễ', 'N4'],
    ['お葬式', 'おそうしき', 'TÁNG THỨC', 'lễ tang/ đám tang', 'N4'],
    ['結婚式', 'けっこんしき', 'KẾT HÔN THỨC', 'lễ cưới/ đám cưới', 'N4'],
    ['成人式', 'せいじんしき', 'THÀNH NHÂN THỨC', 'Lễ thành nhân', 'N4'],
    ['式が始まります', 'しきがはじまります', 'THỨC THỦY', 'bắt đầu buổi lễ', 'N4'],
  ]],
  ['様', 'DẠNG', '', 'N4', [
    ['様子', 'ようす', 'DẠNG TỬ', 'vẻ/ tình hình', 'N4'],
    ['お客様', 'おきゃくさま', 'KHÁCH DẠNG', 'quý khách/ khách hàng', 'N4'],
    ['お姫様', 'おひめさま', 'CƠ DẠNG', 'công chúa', 'N4'],
    ['お疲れ様でした', 'おつかれさまでした', 'BÌ DẠNG', 'Anh/chị đã vất vả rồi.', 'N4'],
    ['どちら様でしょうか', 'どちらさまでしょうか', 'DẠNG', 'Ai đấy ạ?', 'N4'],
  ]],
  ['色', 'SẮC', '', 'N4', [
    ['色', 'いろ', 'SẮC', 'màu/ màu sắc', 'N4'],
    ['景色', 'けしき', 'CẢNH SẮC', 'phong cảnh/ cảnh sắc', 'N4'],
    ['茶色', 'ちゃいろ', 'TRÀ SẮC', 'màu nâu', 'N4'],
    ['黄色', 'きいろ', 'HOÀNG SẮC', 'màu vàng', 'N4'],
    ['色が変わります', 'いろがかわります', 'SẮC PHẢN', 'đổi màu/ thay đổi màu', 'N4'],
  ]],
  ['表', 'BIỂU', '', 'N4', [
    ['表', 'おもて', 'BIỂU', 'mặt trước/ phía trước', 'N4'],
    ['表現', 'ひょうげん', 'BIỂU HIỆN', 'cách nói/ cách diễn đạt', 'N4'],
    ['発表', 'はっぴょう', 'PHÁT BIỂU', 'phát biểu/ báo cáo', 'N4'],
    ['予定表', 'よていひょう', 'DỰ ĐỊNH BIỂU', 'lịch/ thời khóa biểu', 'N4'],
    ['発表します', 'はっぴょうします', '', 'phát biểu/ công bố', 'N3'],
  ]],
  ['具', 'CỤ', '', 'N4', [
    ['道具', 'どうぐ', 'ĐẠO CỤ', 'dụng cụ/ công cụ', 'N4'],
    ['家具', 'かぐ', 'GIA CỤ', 'gia cụ/ đồ dùng nội thất', 'N4'],
    ['具合', 'ぐあい', 'CỤ HỢP', 'trạng thái/ tình hình', 'N4'],
    ['敬具', 'けいぐ', 'KÍNH CỤ', 'Kính thư (kết thúc thư)', 'N4'],
  ]],
  ['再', 'TÁI', '', 'N4', [
    ['再来年', 'さらいねん', 'TÁI LAI NIÊN', 'năm sau nữa', 'N4'],
    ['再来月', 'さらいげつ', 'TÁI LAI NGUYỆT', 'tháng sau nữa', 'N4'],
    ['再来週', 'さらいしゅう', 'TÁI LAI CHU', 'tuần sau nữa', 'N4'],
    ['再入国ビザ', 'さいにゅうこくビザ', 'TÁI NHẬP QUỐC', 'thị thực tái nhập cảnh', 'N4'],
  ]],
  ['失', 'THẤT', '', 'N4', [
    ['失礼いたします', 'しつれいいたします', 'THẤT LỄ', 'Tôi xin phép.', 'N4'],
    ['試験に失敗します', 'しけんにしっぱいします', 'THỨC NGHIỆM THẤT BẠI', 'thất bại/ trượt thi', 'N4'],
    ['お先に失礼します', 'おさきにしつれいします', 'TIÊN THẤT LỄ', 'Tôi xin phép về trước.', 'N4'],
    ['失敗します', 'しっぱいします', '', 'thất bại', 'N3'],
  ]],
  ['性', 'TÍNH', '', 'N4', [
    ['性格', 'せいかく', 'TÍNH CÁCH', 'tính cách/ tính tình', 'N4'],
    ['女性', 'じょせい', 'NỮ TÍNH', 'nữ giới', 'N4'],
    ['男性', 'だんせい', 'NAM TÍNH', 'nam giới', 'N4'],
    ['男性と比べます', 'だんせいとくらべます', 'NAM TÍNH TỶ', 'so sánh với nam giới', 'N4'],
  ]],
  ['成', 'THÀNH', '', 'N4', [
    ['成績', 'せいせき', 'THÀNH TÍCH', 'kết quả/ thành tích', 'N4'],
    ['賛成', 'さんせい', 'TÁN THÀNH', 'tán thành/ đồng ý', 'N4'],
    ['成人式', 'せいじんしき', 'THÀNH NHÂN THỨC', 'Lễ thành nhân', 'N4'],
    ['成功します', 'せいこうします', 'THÀNH CÔNG', 'thành công', 'N4'],
  ]],
  ['汚', 'Ô', '', 'N4', [
    ['汚い', 'きたない', 'Ô', 'bẩn', 'N4'],
    ['汚します', 'よごします', 'Ô', 'làm bẩn', 'N4'],
    ['汚れます', 'よごれます', '', 'bẩn đi', 'N4'],
    ['服が汚れます', 'ふくがよごれます', 'PHỤC Ô', 'quần áo bị bẩn', 'N4'],
  ]],
  ['申', 'THÂN', '', 'N4', [
    ['申し込み', 'もうしこみ', 'THÂN VÀO', 'đăng ký', 'N4'],
    ['申します', 'もうします', 'THÂN', 'nói/ tên là (khiêm nhường ngữ)', 'N4'],
    ['申し込みます', 'もうしこみます', 'THÂN VÀO', 'đăng ký/ nộp đơn', 'N4'],
    ['申し訳ありません', 'もうしわけありません', 'THÂN DỊCH', 'Xin lỗi/ Thành thật xin lỗi.', 'N4'],
  ]],
  ['輸', 'THÂU', '', 'N4', [
    ['輸入します', 'ゆにゅうします', 'THÂU NHẬP', 'nhập khẩu', 'N4'],
    ['輸出します', 'ゆしゅつします', 'THÂU XUẤT', 'xuất khẩu', 'N4'],
    ['輸出が増えます', 'ゆしゅつがふえます', 'THÂU XUẤT TĂNG', 'xuất khẩu tăng lên', 'N4'],
    ['輸出が減ります', 'ゆしゅつがへります', 'THÂU XUẤT GIẢM', 'xuất khẩu giảm xuống', 'N4'],
  ]],
  ['丸', 'HOÀN', '', 'N4', [
    ['丸', 'まる', 'HOÀN', 'vòng tròn/ hình tròn', 'N4'],
    ['丸い', 'まるい', 'HOÀN', 'tròn', 'N4'],
    ['丸を付けます', 'まるをつけます', 'HOÀN PHÓ', 'khoanh tròn/ đánh dấu tròn', 'N4'],
  ]],
  ['代', 'ĐẠI', '', 'N4', [
    ['電報代', 'でんぽうだい', 'ĐIỆN BÁO ĐẠI', 'tiền điện báo/ cước điện báo', 'N4'],
    ['電話代', 'でんわだい', 'ĐIỆN THOẠI ĐẠI', 'tiền điện thoại', 'N4'],
    ['代わりをします', 'かわりをします', 'ĐẠI', 'thay thế/ làm thay', 'N4'],
  ]],
  ['倒', 'ĐẢO', '', 'N4', [
    ['倒れます', 'たおれます', 'ĐẢO', 'đổ/ ngã', 'N4'],
    ['ビルが倒れます', 'ビルがたおれます', 'ĐẢO', 'nhà cao tầng bị đổ', 'N4'],
    ['倒します', 'たおします', '', 'làm đổ/ đánh đổ', 'N3'],
  ]],
  ['値', 'TRỊ', '', 'N4', [
    ['値段', 'ねだん', 'TRỊ ĐOẠN', 'giá/ giá cả', 'N4'],
    ['値段が上がります', 'ねだんがあがります', 'TRỊ ĐOẠN THƯỢNG', 'giá tăng lên', 'N4'],
    ['値段が下がります', 'ねだんがさがります', 'TRỊ ĐOẠN HẠ', 'giá giảm xuống', 'N4'],
  ]],
  ['割', 'CÁT', '', 'N4', [
    ['割ります', 'わります', '', 'đập vỡ/ chia ra', 'N4'],
    ['割れます', 'われます', '', 'vỡ/ nứt', 'N4'],
    ['コップが割れます', 'コップがわれます', 'CÁT', 'cốc bị vỡ', 'N4'],
  ]],
  ['力', 'LỰC', '', 'N4', [
    ['力', 'ちから', 'LỰC', 'sức lực/ năng lực', 'N4'],
    ['入力します', 'にゅうりょくします', 'NHẬP LỰC', 'nhập (dữ liệu)', 'N4'],
    ['協力します', 'きょうりょくします', 'HIỆP LỰC', 'hợp tác/ chung sức', 'N4'],
  ]],
  ['化', 'HÓA', '', 'N4', [
    ['化粧', 'けしょう', 'HÓA TRANG', 'sự trang điểm', 'N4'],
    ['化粧品', 'けしょうひん', 'HÓA TRANG PHẨM', 'mỹ phẩm', 'N4'],
    ['西洋化します', 'せいようかします', 'TÂY DƯƠNG HÓA', 'Tây Âu hóa', 'N4'],
  ]],
  ['増', 'TĂNG', '', 'N4', [
    ['輸出が増えます', 'ゆしゅつがふえます', 'THÂU XUẤT TĂNG', 'xuất khẩu tăng lên', 'N4'],
    ['増えます', 'ふえます', '', 'tăng lên', 'N3'],
    ['増やします', 'ふやします', '', 'làm tăng', 'N3'],
  ]],
  ['壊', 'HOẠI', '', 'N4', [
    ['壊します', 'こわします', 'HOẠI', 'phá/ làm hỏng', 'N4'],
    ['壊れます', 'こわれます', '', 'hỏng/ vỡ', 'N4'],
    ['いすが壊れます', 'いすがこわれます', 'HOẠI', 'ghế bị hỏng', 'N4'],
  ]],
  ['太', 'THÁI', '', 'N4', [
    ['太陽', 'たいよう', 'THÁI DƯƠNG', 'mặt trời', 'N4'],
    ['太い', 'ふとい', 'THÁI', 'béo/ to', 'N4'],
    ['太ります', 'ふとります', 'THÁI', 'béo lên/ tăng cân', 'N4'],
  ]],
  ['守', 'THỦ', '', 'N4', [
    ['留守', 'るす', 'LƯU THỦ', 'vắng nhà/ không có nhà', 'N4'],
    ['留守番', 'るすばん', 'LƯU THỦ PHIÊN', 'trông nhà/ giữ nhà', 'N4'],
    ['守ります', 'まもります', 'THỦ', 'bảo vệ/ tuân thủ/ giữ', 'N4'],
  ]],
  ['届', 'GIỚI', '', 'N4', [
    ['届けます', 'とどけます', 'GIỚI', 'gửi đến/ chuyển đến', 'N4'],
    ['荷物が届きます', 'にもつがとどきます', 'HÀ VẬT GIỚI', 'hành lý được gửi đến', 'N4'],
    ['届きます', 'とどきます', '', 'tới nơi/ được gửi tới', 'N3'],
  ]],
  ['席', 'TỊCH', '', 'N4', [
    ['席', 'せき', 'TỊCH', 'chỗ ngồi/ ghế', 'N4'],
    ['席を外します', 'せきをはずします', 'TỊCH NGOẠI', 'rời khỏi chỗ ngồi/ đi vắng/ không có ở chỗ', 'N4'],
    ['会議に出席します', 'かいぎにしゅっせきします', 'HỘI NGHỊ XUẤT TỊCH', 'tham dự cuộc họp/ tham gia cuộc họp', 'N4'],
  ]],
  ['慣', 'QUÁN', '', 'N4', [
    ['習慣', 'しゅうかん', 'TẬP QUÁN', 'tập quán/ thói quen', 'N4'],
    ['習慣に慣れます', 'しゅうかんになれます', 'TẬP QUÁN', 'làm quen với tập quán', 'N4'],
    ['慣れます', 'なれます', '', 'quen với', 'N3'],
  ]],
  ['打', 'ĐẢ', '', 'N4', [
    ['電報を打ちます', 'でんぽうをうちます', 'ĐIỆN BÁO ĐẢ', 'đánh điện/ gửi điện báo', 'N4'],
    ['ワープロを打ちます', 'ワープロをうちます', 'ĐẢ', 'đánh máy chữ/ gõ máy chữ', 'N4'],
    ['打ちます', 'うちます', '', 'đánh/ đập', 'N3'],
  ]],
  ['折', 'TRIẾT', '', 'N4', [
    ['折ります', 'おります', 'TRIẾT', 'gấp/ gập/ bẻ', 'N4'],
    ['折れます', 'おれます', '', 'gãy', 'N4'],
    ['木が折れます', 'きがおれます', 'MỘC TRIẾT', 'cây bị gãy', 'N4'],
  ]],
  ['文', 'VĂN', '', 'N4', [
    ['作文', 'さくぶん', 'TÁC VĂN', 'bài văn/ bài tập làm văn', 'N4'],
    ['文法', 'ぶんぽう', 'VĂN PHÁP', 'ngữ pháp', 'N4'],
    ['文学', 'ぶんがく', 'VĂN HỌC', 'văn học', 'N4'],
  ]],
  ['格', 'CÁCH', '', 'N4', [
    ['性格', 'せいかく', 'TÍNH CÁCH', 'tính cách/ tính tình', 'N4'],
    ['試験に合格します', 'しけんにごうかくします', 'THỨC NGHIỆM HỢP CÁCH', 'đỗ thi/ đậu kỳ thi', 'N4'],
    ['合格します', 'ごうかくします', '', 'thi đỗ', 'N3'],
  ]],
  ['注', 'CHÚ', '', 'N4', [
    ['注射', 'ちゅうしゃ', 'CHÚ XẠ', 'tiêm', 'N4'],
    ['注意します', 'ちゅういします', 'CHÚ Ý', 'chú ý/ nhắc nhở', 'N4'],
    ['車に注意します', 'くるまにちゅういします', 'XA CHÚ Ý', 'chú ý xe cộ/ coi chừng xe', 'N4'],
  ]],
  ['洋', 'DƯƠNG', '', 'N4', [
    ['洋服', 'ようふく', 'DƯƠNG PHỤC', 'quần áo kiểu Tây Âu', 'N4'],
    ['洋食', 'ようしょく', 'DƯƠNG THỰC', 'món ăn Âu Mỹ', 'N4'],
    ['西洋化します', 'せいようかします', 'TÂY DƯƠNG HÓA', 'Tây Âu hóa', 'N4'],
  ]],
  ['減', 'GIẢM', '', 'N4', [
    ['減ります', 'へります', '', 'giảm/ ít đi', 'N4'],
    ['輸出が減ります', 'ゆしゅつがへります', 'THÂU XUẤT GIẢM', 'xuất khẩu giảm xuống', 'N4'],
    ['減らします', 'へらします', '', 'làm giảm', 'N3'],
  ]],
  ['源', 'NGUYÊN', '', 'N4', [
    ['電源', 'でんげん', 'ĐIỆN NGUYÊN', 'nguồn điện/ công tắc điện', 'N4'],
    ['電源を入れます', 'でんげんをいれます', 'ĐIỆN NGUYÊN NHẬP', 'bật công tắc điện', 'N4'],
    ['電源を切ります', 'でんげんをきります', 'ĐIỆN NGUYÊN THIẾT', 'tắt công tắc điện', 'N4'],
  ]],
  ['破', 'PHÁ', '', 'N4', [
    ['紙が破れます', 'かみがやぶれます', 'CHỈ PHÁ', 'giấy bị rách', 'N4'],
    ['破ります', 'やぶります', '', 'xé rách/ phá (lời hứa)', 'N3'],
    ['破れます', 'やぶれます', '', 'rách', 'N3'],
  ]],
  ['礼', 'LỄ', '', 'N4', [
    ['お礼', 'おれい', 'LỄ', 'lời cảm ơn/ sự cảm ơn', 'N4'],
    ['失礼いたします', 'しつれいいたします', 'THẤT LỄ', 'Tôi xin phép.', 'N4'],
    ['お先に失礼します', 'おさきにしつれいします', 'TIÊN THẤT LỄ', 'Tôi xin phép về trước.', 'N4'],
  ]],
  ['続', 'TỤC', '', 'N4', [
    ['続けます', 'つづけます', 'TỤC', 'tiếp tục', 'N4'],
    ['続きます', 'つづきます', '', 'tiếp diễn/ kéo dài', 'N4'],
    ['熱が続きます', 'ねつがつづきます', 'NHIỆT TỤC', 'sốt kéo dài/ vẫn còn sốt', 'N4'],
  ]],
  ['育', 'DỤC', '', 'N4', [
    ['体育館', 'たいいくかん', 'THỂ DỤC QUÁN', 'nhà tập/ nhà thi đấu thể thao', 'N4'],
    ['育てます', 'そだてます', 'DỤC', 'nuôi/ trồng', 'N4'],
    ['育ちます', 'そだちます', '', 'lớn lên', 'N3'],
  ]],
  ['落', 'LẠC', '', 'N4', [
    ['落ちます', 'おちます', '', 'rơi/ rớt', 'N4'],
    ['落とします', 'おとします', 'LẠC', 'đánh rơi/ làm rơi', 'N4'],
    ['荷物が落ちます', 'にもつがおちます', 'HÀ VẬT LẠC', 'hành lý bị rơi', 'N4'],
  ]],
  ['覧', 'LÃM', '', 'N4', [
    ['回覧', 'かいらん', 'HỒI LÃM', 'tập thông báo (luân chuyển)', 'N4'],
    ['展覧会', 'てんらんかい', 'TRIỂN LÃM HỘI', 'triển lãm', 'N4'],
    ['ご覧になります', 'ごらんになります', 'LÃM', 'xem/ nhìn (kính ngữ)', 'N4'],
  ]],
  ['込', 'VÀO', '', 'N4', [
    ['申し込み', 'もうしこみ', 'THÂN VÀO', 'đăng ký', 'N4'],
    ['申し込みます', 'もうしこみます', 'THÂN VÀO', 'đăng ký/ nộp đơn', 'N4'],
    ['道が込みます', 'みちがこみます', 'ĐẠO VÀO', 'đường đông/ tắc đường', 'N4'],
  ]],
  ['過', 'QUÁ', '', 'N4', [
    ['過ぎます', 'すぎます', '', 'quá/ trôi qua', 'N4'],
    ['過ごします', 'すごします', 'QUÁ', 'trải qua/ trải nghiệm', 'N4'],
    ['7時を過ぎます', '7じをすぎます', 'THÌ QUÁ', 'quá 7 giờ/ qua 7 giờ', 'N4'],
  ]],
  ['風', 'PHONG', '', 'N4', [
    ['風', 'かぜ', 'PHONG', 'gió', 'N4'],
    ['台風', 'たいふう', 'ĐÀI PHONG', 'bão', 'N4'],
    ['風が吹きます', 'かぜがふきます', 'PHONG XÚY', 'gió thổi', 'N4'],
  ]],
  ['仲', 'TRỌNG', '', 'N4', [
    ['仲間', 'なかま', 'TRỌNG GIAN', 'bạn bè/ đồng nghiệp', 'N4'],
    ['仲よくします', 'なかよくします', 'TRỌNG', 'chơi thân với/ quan hệ tốt với', 'N4'],
  ]],
  ['優', 'ƯU', '', 'N4', [
    ['優しい', 'やさしい', 'ƯU', 'tình cảm/ hiền lành', 'N4'],
    ['優勝します', 'ゆうしょうします', 'ƯU THẮNG', 'vô địch/ đoạt giải nhất', 'N4'],
  ]],
  ['刻', 'KHẮC', '', 'N4', [
    ['彫刻', 'ちょうこく', 'ĐIÊU KHẮC', 'điêu khắc', 'N4'],
    ['遅刻します', 'ちこくします', 'TRÌ KHẮC', 'đến chậm/ đến muộn', 'N4'],
  ]],
  ['助', 'TRỢ', '', 'N4', [
    ['助けます', 'たすけます', 'TRỢ', 'giúp/ giúp đỡ', 'N4'],
    ['助かります', 'たすかります', 'TRỢ', 'được giúp/ đỡ được', 'N4'],
  ]],
  ['卒', 'TỐT', '', 'N4', [
    ['大学を卒業します', 'だいがくをそつぎょうします', 'ĐẠI HỌC TỐT NGHIỆP', 'tốt nghiệp đại học', 'N4'],
    ['卒業します', 'そつぎょうします', '', 'tốt nghiệp', 'N3'],
  ]],
  ['原', 'NGUYÊN', '', 'N4', [
    ['原料', 'げんりょう', 'NGUYÊN LIỆU', 'nguyên liệu', 'N4'],
    ['原因', 'げんいん', 'NGUYÊN NHÂN', 'nguyên nhân', 'N4'],
  ]],
  ['参', 'THAM', '', 'N4', [
    ['参ります', 'まいります', 'THAM', 'đi/ đến (khiêm nhường ngữ)', 'N4'],
    ['参加します', 'さんかします', 'THAM GIA', 'tham gia/ tham dự', 'N4'],
  ]],
  ['反', 'PHẢN', '', 'N4', [
    ['反対', 'はんたい', 'PHẢN ĐỐI', 'phản đối', 'N4'],
    ['駐車違反', 'ちゅうしゃいはん', 'TRÚ XA VI PHẢN', 'đỗ xe sai quy định/ đỗ xe trái phép', 'N4'],
  ]],
  ['収', 'THÂU', '', 'N4', [
    ['収入', 'しゅうにゅう', 'THÂU NHẬP', 'thu nhập', 'N4'],
    ['領収書', 'りょうしゅうしょ', 'LÃNH THÂU THƯ', 'hóa đơn/ biên lai', 'N4'],
  ]],
  ['向', 'HƯỚNG', '', 'N4', [
    ['向こう', 'むこう', 'HƯỚNG', 'bên kia/ phía đằng kia', 'N4'],
    ['向かいます', 'むかいます', 'HƯỚNG', 'đi hướng đến/ trên đường đến', 'N4'],
  ]],
  ['吹', 'XÚY', '', 'N4', [
    ['風が吹きます', 'かぜがふきます', 'PHONG XÚY', 'gió thổi', 'N4'],
    ['吹きます', 'ふきます', '', '(gió) thổi', 'N3'],
  ]],
  ['命', 'MỆNH', '', 'N4', [
    ['一生懸命', 'いっしょうけんめい', 'NHẤT SINH HUYỀN MỆNH', 'chăm chỉ/ miệt mài', 'N4'],
    ['平均寿命', 'へいきんじゅみょう', 'BÌNH QUÂN THỌ MỆNH', 'tuổi thọ trung bình', 'N4'],
  ]],
  ['咲', 'TIẾU', '', 'N4', [
    ['咲きます', 'さきます', '', '(hoa) nở', 'N4'],
    ['花が咲きます', 'はながさきます', 'HOA TIẾU', 'hoa nở', 'N4'],
  ]],
  ['営', 'DOANH', '', 'N4', [
    ['営業', 'えいぎょう', 'DOANH NGHIỆP', 'kinh doanh/ bán hàng', 'N4'],
    ['営業中', 'えいぎょうちゅう', 'DOANH NGHIỆP TRUNG', 'đang mở cửa/ đang kinh doanh', 'N4'],
  ]],
  ['声', 'THANH', '', 'N4', [
    ['声', 'こえ', 'THANH', 'tiếng nói/ giọng nói', 'N4'],
    ['声がします', 'こえがします', 'THANH', 'có tiếng người/ nghe thấy giọng', 'N4'],
  ]],
  ['夢', 'MỘNG', '', 'N4', [
    ['夢', 'ゆめ', 'MỘNG', 'giấc mơ/ ước mơ', 'N4'],
    ['夢がかないます', 'ゆめがかないます', 'MỘNG', 'ước mơ thành hiện thực', 'N4'],
  ]],
  ['娘', 'NƯƠNG', '', 'N4', [
    ['娘', 'むすめ', 'NƯƠNG', 'con gái', 'N4'],
    ['娘さん', 'むすめさん', 'NƯƠNG', 'con gái (của người khác)', 'N4'],
  ]],
  ['嫌', 'HIỀM', '', 'N4', [
    ['嫌', 'いや', 'HIỀM', 'chán/ ghét', 'N4'],
    ['嫌がります', 'いやがります', 'HIỀM', 'không thích/ tỏ ra ghét', 'N4'],
  ]],
  ['存', 'TỒN', '', 'N4', [
    ['存じます', 'ぞんじます', 'TỒN', 'biết (khiêm nhường ngữ)', 'N4'],
    ['ご存じです', 'ごぞんじです', 'TỒN', 'biết (kính ngữ)', 'N4'],
  ]],
  ['宅', 'TRẠCH', '', 'N4', [
    ['お宅', 'おたく', 'TRẠCH', 'nhà (của người khác)', 'N4'],
    ['宅配便', 'たくはいびん', 'TRẠCH PHỐI TIỆN', 'dịch vụ chuyển đồ đến nhà', 'N4'],
  ]],
  ['宇', 'VŨ', '', 'N4', [
    ['宇宙', 'うちゅう', 'VŨ TRỤ', 'vũ trụ', 'N4'],
    ['宇宙船', 'うちゅうせん', 'VŨ TRỤ THUYỀN', 'tàu vũ trụ', 'N4'],
  ]],
  ['宙', 'TRỤ', '', 'N4', [
    ['宇宙', 'うちゅう', 'VŨ TRỤ', 'vũ trụ', 'N4'],
    ['宇宙船', 'うちゅうせん', 'VŨ TRỤ THUYỀN', 'tàu vũ trụ', 'N4'],
  ]],
  ['定', 'ĐỊNH', '', 'N4', [
    ['予定', 'よてい', 'DỰ ĐỊNH', 'kế hoạch/ dự định', 'N4'],
    ['予定表', 'よていひょう', 'DỰ ĐỊNH BIỂU', 'lịch/ thời khóa biểu', 'N4'],
  ]],
  ['宝', 'BẢO', '', 'N4', [
    ['宝庫', 'ほうこ', 'BẢO KHỐ', 'kho báu', 'N4'],
    ['宝くじ', 'たからくじ', 'BẢO', 'xổ số', 'N4'],
  ]],
  ['対', 'ĐỐI', '', 'N4', [
    ['反対', 'はんたい', 'PHẢN ĐỐI', 'phản đối', 'N4'],
    ['絶対に', 'ぜったいに', 'TUYỆT ĐỐI', 'tuyệt đối/ nhất định', 'N4'],
  ]],
  ['形', 'HÌNH', '', 'N4', [
    ['形', 'かたち', 'HÌNH', 'hình/ dạng/ hình dạng', 'N4'],
    ['人形', 'にんぎょう', 'NHÂN HÌNH', 'con búp bê/ con rối', 'N4'],
  ]],
  ['彫', 'ĐIÊU', '', 'N4', [
    ['彫刻', 'ちょうこく', 'ĐIÊU KHẮC', 'điêu khắc', 'N4'],
    ['彫ります', 'ほります', 'ĐIÊU', 'khắc', 'N4'],
  ]],
  ['必', 'TẤT', '', 'N4', [
    ['必要', 'ひつよう', 'TẤT YẾU', 'cần thiết', 'N4'],
    ['必ず', 'かならず', 'TẤT', 'nhất định/ chắc chắn', 'N4'],
  ]],
  ['恋', 'LUYẾN', '', 'N4', [
    ['恋人', 'こいびと', 'LUYẾN NHÂN', 'người yêu', 'N4'],
    ['恋愛', 'れんあい', 'LUYẾN ÁI', 'tình yêu', 'N4'],
  ]],
  ['息', 'TỨC', '', 'N4', [
    ['息子', 'むすこ', 'TỨC TỬ', 'con trai', 'N4'],
    ['息子さん', 'むすこさん', 'TỨC TỬ', 'con trai (của người khác)', 'N4'],
  ]],
  ['悩', 'NÃO', '', 'N4', [
    ['悩み', 'なやみ', 'NÃO', 'điều trăn trở/ nỗi phiền muộn', 'N4'],
    ['悩みます', 'なやみます', '', 'phiền muộn/ trăn trở', 'N3'],
  ]],
  ['悲', 'BI', '', 'N4', [
    ['悲しみ', 'かなしみ', 'BI', 'nỗi buồn/ niềm đau', 'N4'],
    ['悲しい', 'かなしい', 'BI', 'buồn/ đau thương', 'N4'],
  ]],
  ['情', 'TÌNH', '', 'N4', [
    ['情報', 'じょうほう', 'TÌNH BÁO', 'thông tin', 'N4'],
    ['情報が手に入ります', 'じょうほうがてにはいります', 'TÌNH BÁO THỦ NHẬP', 'lấy được thông tin', 'N4'],
  ]],
  ['感', 'CẢM', '', 'N4', [
    ['感謝します', 'かんしゃします', 'CẢM TẠ', 'cảm ơn/ biết ơn', 'N4'],
    ['感じます', 'かんじます', '', 'cảm thấy', 'N3'],
  ]],
  ['慮', 'LỰ', '', 'N4', [
    ['遠慮なく', 'えんりょなく', 'VIỄN LỰ', 'đừng khách sáo/ không làm khách', 'N4'],
    ['遠慮します', 'えんりょします', '', 'ngại/ khách sáo', 'N3'],
  ]],
  ['戻', 'LỆ', '', 'N4', [
    ['戻します', 'もどします', 'LỆ', 'trả về/ để lại vị trí ban đầu', 'N4'],
    ['戻ります', 'もどります', 'LỆ', 'quay lại/ trở lại', 'N4'],
  ]],
  ['房', 'PHÒNG', '', 'N4', [
    ['冷房', 'れいぼう', 'LÃNH PHÒNG', 'máy lạnh/ thiết bị làm mát', 'N4'],
    ['暖房', 'だんぼう', 'NOÃN PHÒNG', 'lò sưởi/ thiết bị làm ấm', 'N4'],
  ]],
  ['拝', 'BÁI', '', 'N4', [
    ['拝啓', 'はいけい', 'BÁI KHẢI', 'Kính gửi (mở đầu thư)', 'N4'],
    ['拝見します', 'はいけんします', 'BÁI KIẾN', 'xem/ nhìn (khiêm nhường ngữ)', 'N4'],
  ]],
  ['指', 'CHỈ', '', 'N4', [
    ['指輪', 'ゆびわ', 'CHỈ LUÂN', 'cái nhẫn', 'N4'],
    ['指します', 'さします', 'CHỈ', 'chỉ/ trỏ', 'N4'],
  ]],
  ['敗', 'BẠI', '', 'N4', [
    ['試験に失敗します', 'しけんにしっぱいします', 'THỨC NGHIỆM THẤT BẠI', 'thất bại/ trượt thi', 'N4'],
    ['失敗します', 'しっぱいします', '', 'thất bại', 'N3'],
  ]],
  ['昔', 'TÍCH', '', 'N4', [
    ['昔', 'むかし', 'TÍCH', 'ngày xưa/ trước đây', 'N4'],
    ['昔話', 'むかしばなし', 'TÍCH THOẠI', 'chuyện cổ tích', 'N4'],
  ]],
  ['星', 'TINH', '', 'N4', [
    ['星', 'ほし', 'TINH', 'sao/ ngôi sao', 'N4'],
    ['星占い', 'ほしうらない', 'TINH CHIẾM', 'bói sao/ chiêm tinh', 'N4'],
  ]],
  ['比', 'TỶ', '', 'N4', [
    ['男性と比べます', 'だんせいとくらべます', 'NAM TÍNH TỶ', 'so sánh với nam giới', 'N4'],
    ['比べます', 'くらべます', '', 'so sánh', 'N3'],
  ]],
  ['決', 'QUYẾT', '', 'N4', [
    ['決めます', 'きめます', 'QUYẾT', 'quyết định', 'N4'],
    ['決まります', 'きまります', '', 'được quyết định', 'N4'],
  ]],
  ['汽', 'KHÍ', '', 'N4', [
    ['汽船', 'きせん', 'KHÍ THUYỀN', 'thuyền chạy bằng hơi nước', 'N4'],
    ['汽車', 'きしゃ', 'KHÍ XA', 'tàu hỏa chạy bằng hơi nước', 'N4'],
  ]],
  ['法', 'PHÁP', '', 'N4', [
    ['方法', 'ほうほう', 'PHƯƠNG PHÁP', 'phương pháp/ cách làm', 'N4'],
    ['文法', 'ぶんぽう', 'VĂN PHÁP', 'ngữ pháp', 'N4'],
  ]],
  ['濡', 'NHU', '', 'N4', [
    ['濡れます', 'ぬれます', 'NHU', 'ướt', 'N4'],
    ['濡らします', 'ぬらします', '', 'làm ướt', 'N3'],
  ]],
  ['煮', 'CHỬ', '', 'N4', [
    ['煮ます', 'にます', 'CHỬ', 'nấu/ hầm', 'N4'],
    ['煮えます', 'にえます', 'CHỬ', 'chín/ được nấu chín', 'N4'],
  ]],
  ['燃', 'NHIÊN', '', 'N4', [
    ['燃えます', 'もえます', 'NHIÊN', 'cháy/ rác cháy được', 'N4'],
    ['燃やします', 'もやします', '', 'đốt', 'N3'],
  ]],
  ['片', 'PHIẾN', '', 'N4', [
    ['片づけます', 'かたづけます', 'PHIẾN', 'dọn dẹp/ sắp xếp', 'N4'],
    ['荷物が片付きます', 'にもつがかたづきます', 'HÀ VẬT PHIẾN PHÓ', 'đồ đạc được dọn gọn/ đồ đạc được sắp xếp ngăn nắp', 'N4'],
  ]],
  ['瓶', 'BÌNH', '', 'N4', [
    ['瓶', 'びん', 'BÌNH', 'chai/ cái chai/ lọ', 'N4'],
    ['花瓶', 'かびん', 'HOA BÌNH', 'lọ hoa', 'N4'],
  ]],
  ['由', 'DO', '', 'N4', [
    ['理由', 'りゆう', 'LÝ DO', 'lý do', 'N4'],
    ['自由に', 'じゆうに', 'TỰ DO', 'tự do/ tuỳ thích/ thoải mái', 'N4'],
  ]],
  ['皿', 'MÃNH', '', 'N4', [
    ['お皿', 'おさら', 'MÃNH', 'cái đĩa', 'N4'],
    ['灰皿', 'はいざら', 'HỘI MÃNH', 'cái gạt tàn', 'N4'],
  ]],
  ['磨', 'MA', '', 'N4', [
    ['磨きます', 'みがきます', '', 'đánh (răng)/ mài', 'N4'],
    ['歯を磨きます', 'はをみがきます', 'XỈ MA', 'đánh răng', 'N4'],
  ]],
  ['祖', 'TỔ', '', 'N4', [
    ['祖母', 'そぼ', 'TỔ MẪU', 'bà (của mình)', 'N4'],
    ['祖父', 'そふ', 'TỔ PHỤ', 'ông (của mình)', 'N4'],
  ]],
  ['科', 'KHOA', '', 'N4', [
    ['科学', 'かがく', 'KHOA HỌC', 'khoa học', 'N4'],
    ['科学者', 'かがくしゃ', 'KHOA HỌC GIẢ', 'nhà khoa học', 'N4'],
  ]],
  ['管', 'QUẢN', '', 'N4', [
    ['入管', 'にゅうかん', 'NHẬP QUẢN', 'Cục quản lý nhập cảnh', 'N4'],
    ['管理人', 'かんりにん', 'QUẢN LÝ NHÂN', 'người quản lý', 'N4'],
  ]],
  ['粧', 'TRANG', '', 'N4', [
    ['化粧', 'けしょう', 'HÓA TRANG', 'sự trang điểm', 'N4'],
    ['化粧品', 'けしょうひん', 'HÓA TRANG PHẨM', 'mỹ phẩm', 'N4'],
  ]],
  ['組', 'TỔ', '', 'N4', [
    ['番組', 'ばんぐみ', 'PHIÊN TỔ', 'chương trình phát thanh/ chương trình truyền hình', 'N4'],
    ['組み立てます', 'くみたてます', 'TỔ LẬP', 'lắp/ lắp ráp/ lắp đặt', 'N4'],
  ]],
  ['袋', 'ĐẠI', '', 'N4', [
    ['袋', 'ふくろ', 'ĐẠI', 'cái túi', 'N4'],
    ['手袋', 'てぶくろ', 'THỦ ĐẠI', 'cái găng tay', 'N4'],
  ]],
  ['西', 'TÂY', '', 'N4', [
    ['西', 'にし', 'TÂY', 'tây/ phía tây', 'N4'],
    ['西洋化します', 'せいようかします', 'TÂY DƯƠNG HÓA', 'Tây Âu hóa', 'N4'],
  ]],
  ['設', 'THIẾT', '', 'N4', [
    ['設備', 'せつび', 'THIẾT BỊ', 'thiết bị', 'N4'],
    ['設計します', 'せっけいします', 'THIẾT KẾ', 'thiết kế', 'N4'],
  ]],
  ['訳', 'DỊCH', '', 'N4', [
    ['翻訳します', 'ほんやくします', 'PHIÊN DỊCH', 'dịch (sách, tài liệu)', 'N4'],
    ['申し訳ありません', 'もうしわけありません', 'THÂN DỊCH', 'Xin lỗi/ Thành thật xin lỗi.', 'N4'],
  ]],
  ['講', 'GIẢNG', '', 'N4', [
    ['講義', 'こうぎ', 'GIẢNG NGHĨA', 'bài giảng', 'N4'],
    ['講師', 'こうし', 'GIẢNG SƯ', 'giảng viên/ giáo viên', 'N4'],
  ]],
  ['謝', 'TẠ', '', 'N4', [
    ['謝ります', 'あやまります', 'TẠ', 'xin lỗi/ tạ lỗi', 'N4'],
    ['感謝します', 'かんしゃします', 'CẢM TẠ', 'cảm ơn/ biết ơn', 'N4'],
  ]],
  ['警', 'CẢNH', '', 'N4', [
    ['警察', 'けいさつ', 'CẢNH SÁT', 'cảnh sát', 'N4'],
    ['警官', 'けいかん', 'CẢNH QUAN', 'cảnh sát', 'N4'],
  ]],
  ['販', 'PHIÊN', '', 'N4', [
    ['通信販売', 'つうしんはんばい', 'THÔNG TÍN PHIÊN MẠI', 'bán hàng qua bưu điện/ thương mại viễn thông', 'N4'],
    ['自動販売機', 'じどうはんばいき', 'TỰ ĐỘNG PHIÊN MẠI CƠ', 'máy bán hàng tự động', 'N4'],
  ]],
  ['賞', 'THƯỞNG', '', 'N4', [
    ['賞金', 'しょうきん', 'THƯỞNG KIM', 'tiền thưởng', 'N4'],
    ['受賞します', 'じゅしょうします', 'THỤ THƯỞNG', 'nhận giải thưởng', 'N4'],
  ]],
  ['踊', 'DŨNG', '', 'N4', [
    ['盆踊り', 'ぼんおどり', 'BỒN DŨNG', 'múa trong hội Bon', 'N4'],
    ['踊ります', 'おどります', 'DŨNG', 'nhảy/ khiêu vũ', 'N4'],
  ]],
  ['迷', 'MÊ', '', 'N4', [
    ['迷惑をかけます', 'めいわくをかけます', 'MÊ HOẶC', 'làm phiền', 'N4'],
    ['迷います', 'まよいます', '', 'lạc đường/ phân vân', 'N3'],
  ]],
  ['退', 'THOÁI', '', 'N4', [
    ['退院します', 'たいいんします', 'THOÁI VIỆN', 'xuất viện', 'N4'],
    ['早退します', 'そうたいします', 'TẢO THOÁI', 'về sớm/ ra sớm', 'N4'],
  ]],
  ['逃', 'ĐÀO', '', 'N4', [
    ['逃げます', 'にげます', 'ĐÀO', 'chạy trốn/ bỏ chạy/ trốn thoát', 'N4'],
    ['逃がします', 'にがします', '', 'thả ra/ để sổng', 'N3'],
  ]],
  ['都', 'ĐÔ', '', 'N4', [
    ['都合がいい', 'つごうがいい', 'ĐÔ HỢP', 'tiện/ thuận tiện/ có thời gian', 'N4'],
    ['都合が悪い', 'つごうがわるい', 'ĐÔ HỢP ÁC', 'không tiện/ bận/ vướng việc', 'N4'],
  ]],
  ['量', 'LƯỢNG', '', 'N4', [
    ['量', 'りょう', 'LƯỢNG', 'lượng', 'N4'],
    ['量ります', 'はかります', 'LƯỢNG', 'cân', 'N4'],
  ]],
  ['離', 'LY', '', 'N4', [
    ['離れた', 'はなれた', 'LY', 'xa/ cách xa', 'N4'],
    ['離婚します', 'りこんします', 'LY HÔN', 'ly dị/ ly hôn', 'N4'],
  ]],
  ['願', 'NGUYỆN', '', 'N4', [
    ['ちょっとお願いがあるんですが', 'ちょっとおねがいがあるんですが', 'NGUYỆN', 'Tôi có chút việc muốn nhờ anh chị.', 'N4'],
    ['願います', 'ねがいます', '', 'mong/ nhờ', 'N3'],
  ]],
  ['騒', 'TAO', '', 'N4', [
    ['騒音', 'そうおん', 'TAO ÂM', 'tiếng ồn', 'N4'],
    ['騒ぎます', 'さわぎます', 'TAO', 'làm ồn/ ồn ào/ làm huyên náo', 'N4'],
  ]],
  ['鳥', 'ĐIỂU', '', 'N4', [
    ['鳥', 'とり', 'ĐIỂU', 'chim', 'N4'],
    ['鳥肉', 'とりにく', 'ĐIỂU', 'thịt gà', 'N4'],
  ]],
  ['一', 'NHẤT', '', 'N4', [
    ['一生懸命', 'いっしょうけんめい', 'NHẤT SINH HUYỀN MỆNH', 'chăm chỉ/ miệt mài', 'N4'],
  ]],
  ['丁', 'ĐINH', '', 'N4', [
    ['丁寧', 'ていねい', 'ĐINH NINH', 'lịch sự/ cẩn thận', 'N4'],
  ]],
  ['久', 'CỬU', '', 'N4', [
    ['久しぶり', 'ひさしぶり', 'CỬU', 'lâu rồi (mới gặp lại)', 'N4'],
  ]],
  ['二', 'NHỊ', '', 'N4', [
    ['二次会', 'にじかい', 'NHỊ THỨ HỘI', 'tiệc tăng hai/ bữa tiệc thứ hai', 'N4'],
  ]],
  ['亡', 'VONG', '', 'N4', [
    ['亡くなります', 'なくなります', 'VONG', 'mất/ qua đời', 'N4'],
  ]],
  ['以', 'DĨ', '', 'N4', [
    ['以上です', 'いじょうです', 'DĨ THƯỢNG', 'Trên đây là hết./ Tôi xin hết.', 'N4'],
  ]],
  ['件', 'KIỆN', '', 'N4', [
    ['事件', 'じけん', 'SỰ KIỆN', 'vụ án/ vụ việc', 'N4'],
  ]],
  ['伺', 'TỨ', '', 'N4', [
    ['伺います', 'うかがいます', 'TỨ', 'xin đến thăm/ đến thăm', 'N4'],
  ]],
  ['似', 'TỰ', '', 'N4', [
    ['似ています', 'にています', 'TỰ', 'giống', 'N4'],
  ]],
  ['例', 'LỆ', '', 'N4', [
    ['例えば', 'たとえば', 'LỆ', 'ví dụ như/ chẳng hạn/ ví dụ', 'N4'],
  ]],
  ['係', 'HỆ', '', 'N4', [
    ['係員', 'かかりいん', 'HỆ VIÊN', 'nhân viên phụ trách', 'N4'],
  ]],
  ['偉', 'VĨ', '', 'N4', [
    ['偉い', 'えらい', 'VĨ', 'vĩ đại/ đáng kính/ đáng khâm phục', 'N4'],
  ]],
  ['停', 'ĐÌNH', '', 'N4', [
    ['バス停', 'バスてい', 'ĐÌNH', 'điểm dừng xe buýt', 'N4'],
  ]],
  ['傷', 'THƯƠNG', '', 'N4', [
    ['傷', 'きず', 'THƯƠNG', 'vết thương', 'N4'],
  ]],
  ['像', 'TƯỢNG', '', 'N4', [
    ['像', 'ぞう', 'TƯỢNG', 'tượng/ pho tượng', 'N4'],
  ]],
  ['到', 'ĐÁO', '', 'N4', [
    ['到着します', 'とうちゃくします', 'ĐÁO TRƯỚC', 'đến/ đến nơi', 'N4'],
  ]],
  ['則', 'TẮC', '', 'N4', [
    ['規則', 'きそく', 'QUY TẮC', 'quy định/ nội quy/ quy tắc', 'N4'],
  ]],
  ['剣', 'KIẾM', '', 'N4', [
    ['剣道', 'けんどう', 'KIẾM ĐẠO', 'kiếm đạo', 'N4'],
  ]],
  ['功', 'CÔNG', '', 'N4', [
    ['成功します', 'せいこうします', 'THÀNH CÔNG', 'thành công', 'N4'],
  ]],
  ['加', 'GIA', '', 'N4', [
    ['参加します', 'さんかします', 'THAM GIA', 'tham gia/ tham dự', 'N4'],
  ]],
  ['勢', 'THẾ', '', 'N4', [
    ['大勢', 'おおぜい', 'ĐẠI THẾ', 'nhiều người', 'N4'],
  ]],
  ['北', 'BẮC', '', 'N4', [
    ['北', 'きた', 'BẮC', 'bắc/ phía bắc', 'N4'],
  ]],
  ['十', 'THẬP', '', 'N4', [
    ['十分', 'じゅうぶん', 'THẬP PHÂN', 'đủ/ đầy đủ', 'N4'],
  ]],
  ['協', 'HIỆP', '', 'N4', [
    ['協力します', 'きょうりょくします', 'HIỆP LỰC', 'hợp tác/ chung sức', 'N4'],
  ]],
  ['南', 'NAM', '', 'N4', [
    ['南', 'みなみ', 'NAM', 'nam/ phía nam', 'N4'],
  ]],
  ['博', 'BÁC', '', 'N4', [
    ['博士', 'はかせ', 'BÁC SĨ', 'tiến sĩ', 'N4'],
  ]],
  ['占', 'CHIẾM', '', 'N4', [
    ['星占い', 'ほしうらない', 'TINH CHIẾM', 'bói sao/ chiêm tinh', 'N4'],
  ]],
  ['印', 'ẤN', '', 'N4', [
    ['矢印', 'やじるし', 'THỈ ẤN', 'dấu mũi tên', 'N4'],
  ]],
  ['厳', 'NGHIÊM', '', 'N4', [
    ['厳しい', 'きびしい', 'NGHIÊM', 'nghiêm/ nghiêm khắc', 'N4'],
  ]],
  ['双', 'SONG', '', 'N4', [
    ['双子', 'ふたご', 'SONG TỬ', 'cặp sinh đôi', 'N4'],
  ]],
  ['召', 'TRIỆU', '', 'N4', [
    ['召し上がります', 'めしあがります', 'TRIỆU THƯỢNG', 'ăn/ uống (kính ngữ)', 'N4'],
  ]],
  ['可', 'KHẢ', '', 'N4', [
    ['許可', 'きょか', 'HỨA KHẢ', 'phép/ giấy phép', 'N4'],
  ]],
  ['史', 'SỬ', '', 'N4', [
    ['歴史', 'れきし', 'LỊCH SỬ', 'lịch sử', 'N4'],
  ]],
  ['周', 'CHU', '', 'N4', [
    ['周り', 'まわり', 'CHU', 'xung quanh', 'N4'],
  ]],
  ['啓', 'KHẢI', '', 'N4', [
    ['拝啓', 'はいけい', 'BÁI KHẢI', 'Kính gửi (mở đầu thư)', 'N4'],
  ]],
  ['喜', 'HỶ', '', 'N4', [
    ['喜びます', 'よろこびます', '', 'vui mừng', 'N4'],
  ]],
  ['四', 'TỨ', '', 'N4', [
    ['四ツ谷', 'よつや', 'TỨ CỐC', 'tên một nhà ga ở Tokyo', 'N4'],
  ]],
  ['因', 'NHÂN', '', 'N4', [
    ['原因', 'げんいん', 'NGUYÊN NHÂN', 'nguyên nhân', 'N4'],
  ]],
  ['均', 'QUÂN', '', 'N4', [
    ['平均寿命', 'へいきんじゅみょう', 'BÌNH QUÂN THỌ MỆNH', 'tuổi thọ trung bình', 'N4'],
  ]],
  ['城', 'THÀNH', '', 'N4', [
    ['お城', 'おしろ', 'THÀNH', 'lâu đài/ thành', 'N4'],
  ]],
  ['埋', 'MAI', '', 'N4', [
    ['埋め立てます', 'うめたてます', 'MAI LẬP', 'lấp (biển)', 'N4'],
  ]],
  ['塾', 'THỤC', '', 'N4', [
    ['塾', 'じゅく', 'THỤC', 'cơ sở học thêm', 'N4'],
  ]],
  ['壁', 'BÍCH', '', 'N4', [
    ['壁', 'かべ', 'BÍCH', 'bức tường', 'N4'],
  ]],
  ['士', 'SĨ', '', 'N4', [
    ['博士', 'はかせ', 'BÁC SĨ', 'tiến sĩ', 'N4'],
  ]],
  ['夕', 'TỊCH', '', 'N4', [
    ['夕方', 'ゆうがた', 'TỊCH PHƯƠNG', 'chiều tối', 'N4'],
  ]],
  ['好', 'HẢO', '', 'N4', [
    ['大好き', 'だいすき', 'ĐẠI HẢO', 'rất thích/ thích lắm', 'N4'],
  ]],
  ['姫', 'CƠ', '', 'N4', [
    ['お姫様', 'おひめさま', 'CƠ DẠNG', 'công chúa', 'N4'],
  ]],
  ['姿', 'TƯ', '', 'N4', [
    ['姿', 'すがた', 'TƯ', 'dáng điệu/ hình dáng', 'N4'],
  ]],
  ['孫', 'TÔN', '', 'N4', [
    ['孫', 'まご', 'TÔN', 'cháu', 'N4'],
  ]],
  ['官', 'QUAN', '', 'N4', [
    ['警官', 'けいかん', 'CẢNH QUAN', 'cảnh sát', 'N4'],
  ]],
  ['客', 'KHÁCH', '', 'N4', [
    ['お客様', 'おきゃくさま', 'KHÁCH DẠNG', 'quý khách/ khách hàng', 'N4'],
  ]],
  ['害', 'HẠI', '', 'N4', [
    ['障害', 'しょうがい', 'CHƯỚNG HẠI', 'khuyết tật', 'N4'],
  ]],
  ['寄', 'KÝ', '', 'N4', [
    ['銀行に寄ります', 'ぎんこうによります', 'NGÂN HÀNG KÝ', 'ghé qua ngân hàng', 'N4'],
  ]],
  ['察', 'SÁT', '', 'N4', [
    ['警察', 'けいさつ', 'CẢNH SÁT', 'cảnh sát', 'N4'],
  ]],
  ['寧', 'NINH', '', 'N4', [
    ['丁寧', 'ていねい', 'ĐINH NINH', 'lịch sự/ cẩn thận', 'N4'],
  ]],
  ['寿', 'THỌ', '', 'N4', [
    ['平均寿命', 'へいきんじゅみょう', 'BÌNH QUÂN THỌ MỆNH', 'tuổi thọ trung bình', 'N4'],
  ]],
  ['将', 'TƯƠNG', '', 'N4', [
    ['将来', 'しょうらい', 'TƯƠNG LAI', 'tương lai', 'N4'],
  ]],
  ['射', 'XẠ', '', 'N4', [
    ['注射', 'ちゅうしゃ', 'CHÚ XẠ', 'tiêm', 'N4'],
  ]],
  ['展', 'TRIỂN', '', 'N4', [
    ['展覧会', 'てんらんかい', 'TRIỂN LÃM HỘI', 'triển lãm', 'N4'],
  ]],
  ['岸', 'NGẠN', '', 'N4', [
    ['海岸', 'かいがん', 'HẢI NGẠN', 'bờ biển', 'N4'],
  ]],
  ['島', 'ĐẢO', '', 'N4', [
    ['島', 'しま', 'ĐẢO', 'đảo/ hòn đảo', 'N4'],
  ]],
  ['工', 'CÔNG', '', 'N4', [
    ['工場', 'こうじょう', 'CÔNG TRƯỜNG', 'nhà máy/ phân xưởng', 'N4'],
  ]],
  ['常', 'THƯỜNG', '', 'N4', [
    ['非常口', 'ひじょうぐち', 'PHI THƯỜNG KHẨU', 'lối thoát hiểm/ cửa thoát hiểm', 'N4'],
  ]],
  ['平', 'BÌNH', '', 'N4', [
    ['平均寿命', 'へいきんじゅみょう', 'BÌNH QUÂN THỌ MỆNH', 'tuổi thọ trung bình', 'N4'],
  ]],
  ['幸', 'HẠNH', '', 'N4', [
    ['幸せ', 'しあわせ', 'HẠNH', 'hạnh phúc', 'N4'],
  ]],
  ['序', 'TỰ', '', 'N4', [
    ['順序', 'じゅんじょ', 'THUẬN TỰ', 'thứ tự', 'N4'],
  ]],
  ['廊', 'LANG', '', 'N4', [
    ['廊下', 'ろうか', 'LANG HẠ', 'hành lang', 'N4'],
  ]],
  ['徒', 'ĐỒ', '', 'N4', [
    ['生徒', 'せいと', 'SINH ĐỒ', 'học sinh/ học trò', 'N4'],
  ]],
  ['復', 'PHỤC', '', 'N4', [
    ['復習します', 'ふくしゅうします', 'PHỤC TẬP', 'ôn bài cũ', 'N4'],
  ]],
  ['怒', 'NỘ', '', 'N4', [
    ['怒ります', 'おこります', '', 'tức giận', 'N4'],
  ]],
  ['怖', 'BỐ', '', 'N4', [
    ['怖い', 'こわい', 'BỐ', 'sợ/ đáng sợ', 'N4'],
  ]],
  ['恥', 'SỈ', '', 'N4', [
    ['恥ずかしい', 'はずかしい', 'SỈ', 'xấu hổ/ thẹn', 'N4'],
  ]],
  ['惑', 'HOẶC', '', 'N4', [
    ['迷惑をかけます', 'めいわくをかけます', 'MÊ HOẶC', 'làm phiền', 'N4'],
  ]],
  ['愛', 'ÁI', '', 'N4', [
    ['恋愛', 'れんあい', 'LUYẾN ÁI', 'tình yêu', 'N4'],
  ]],
  ['憩', 'KHÊ', '', 'N4', [
    ['休憩します', 'きゅうけいします', 'HƯU KHÊ', 'nghỉ/ giải lao', 'N4'],
  ]],
  ['懸', 'HUYỀN', '', 'N4', [
    ['一生懸命', 'いっしょうけんめい', 'NHẤT SINH HUYỀN MỆNH', 'chăm chỉ/ miệt mài', 'N4'],
  ]],
  ['技', 'KỸ', '', 'N4', [
    ['技術', 'ぎじゅつ', 'KỸ THUẬT', 'kỹ thuật', 'N4'],
  ]],
  ['投', 'ĐẦU', '', 'N4', [
    ['投げます', 'なげます', 'ĐẦU', 'ném/ quăng', 'N4'],
  ]],
  ['招', 'CHIÊU', '', 'N4', [
    ['招待します', 'しょうたいします', 'CHIÊU ĐÃI', 'mời', 'N4'],
  ]],
  ['拾', 'THẬP', '', 'N4', [
    ['拾います', 'ひろいます', 'THẬP', 'nhặt/ nhặt lên', 'N4'],
  ]],
  ['捜', 'SƯU', '', 'N4', [
    ['捜します', 'さがします', 'SƯU', 'tìm/ tìm kiếm/ tìm cái bị mất', 'N4'],
  ]],
  ['授', 'THỤ', '', 'N4', [
    ['授業', 'じゅぎょう', 'THỤ NGHIỆP', 'giờ học', 'N4'],
  ]],
  ['接', 'TIẾP', '', 'N4', [
    ['直接', 'ちょくせつ', 'TRỰC TIẾP', 'trực tiếp', 'N4'],
  ]],
  ['操', 'THAO', '', 'N4', [
    ['操作', 'そうさ', 'THAO TÁC', 'thao tác', 'N4'],
  ]],
  ['支', 'CHI', '', 'N4', [
    ['支店', 'してん', 'CHI ĐIẾM', 'chi nhánh', 'N4'],
  ]],
  ['放', 'PHÓNG', '', 'N4', [
    ['放送します', 'ほうそうします', 'PHÓNG TỐNG', 'phát thanh/ phát sóng', 'N4'],
  ]],
  ['救', 'CỨU', '', 'N4', [
    ['救急車', 'きゅうきゅうしゃ', 'CỨU CẤP XA', 'xe cấp cứu', 'N4'],
  ]],
  ['敬', 'KÍNH', '', 'N4', [
    ['敬具', 'けいぐ', 'KÍNH CỤ', 'Kính thư (kết thúc thư)', 'N4'],
  ]],
  ['数', 'SỐ', '', 'N4', [
    ['数えます', 'かぞえます', 'SỐ', 'đếm', 'N4'],
  ]],
  ['景', 'CẢNH', '', 'N4', [
    ['景色', 'けしき', 'CẢNH SẮC', 'phong cảnh/ cảnh sắc', 'N4'],
  ]],
  ['晴', 'TÌNH', '', 'N4', [
    ['晴れます', 'はれます', 'TÌNH', 'nắng/ quang đãng/ trời hửng', 'N4'],
  ]],
  ['暮', 'MỘ', '', 'N4', [
    ['暮らします', 'くらします', 'MỘ', 'sống/ sinh hoạt', 'N4'],
  ]],
  ['替', 'THẾ', '', 'N4', [
    ['取り替えます', 'とりかえます', 'THỦ THẾ', 'đổi/ thay', 'N4'],
  ]],
  ['朱', 'CHÂU', '', 'N4', [
    ['朱', 'しゅ', 'CHÂU', 'đỏ/ màu đỏ son', 'N4'],
  ]],
  ['材', 'TÀI', '', 'N4', [
    ['材料', 'ざいりょう', 'TÀI LIỆU', 'nguyên liệu', 'N4'],
  ]],
  ['村', 'THÔN', '', 'N4', [
    ['村', 'むら', 'THÔN', 'làng', 'N4'],
  ]],
  ['東', 'ĐÔNG', '', 'N4', [
    ['東', 'ひがし', 'ĐÔNG', 'đông/ phía đông', 'N4'],
  ]],
  ['枝', 'CHI', '', 'N4', [
    ['枝', 'えだ', 'CHI', 'cành cây', 'N4'],
  ]],
  ['柔', 'NHU', '', 'N4', [
    ['柔道', 'じゅうどう', 'NHU ĐẠO', 'judo/ nhu đạo', 'N4'],
  ]],
  ['棒', 'BỔNG', '', 'N4', [
    ['泥棒', 'どろぼう', 'NÊ BỔNG', 'kẻ trộm', 'N4'],
  ]],
  ['植', 'THỰC', '', 'N4', [
    ['植えます', 'うえます', 'THỰC', 'trồng cây', 'N4'],
  ]],
  ['横', 'HOÀNH', '', 'N4', [
    ['横', 'よこ', 'HOÀNH', 'bên cạnh/ cạnh', 'N4'],
  ]],
  ['歴', 'LỊCH', '', 'N4', [
    ['歴史', 'れきし', 'LỊCH SỬ', 'lịch sử', 'N4'],
  ]],
  ['汗', 'HÃN', '', 'N4', [
    ['汗', 'あせ', 'HÃN', 'mồ hôi', 'N4'],
  ]],
  ['油', 'DU', '', 'N4', [
    ['石油', 'せきゆ', 'THẠCH DU', 'dầu mỏ', 'N4'],
  ]],
  ['波', 'BA', '', 'N4', [
    ['波', 'なみ', 'BA', 'sóng', 'N4'],
  ]],
  ['泥', 'NÊ', '', 'N4', [
    ['泥棒', 'どろぼう', 'NÊ BỔNG', 'kẻ trộm', 'N4'],
  ]],
  ['涙', 'LỆ', '', 'N4', [
    ['涙', 'なみだ', 'LỆ', 'nước mắt', 'N4'],
  ]],
  ['測', 'TRẮC', '', 'N4', [
    ['測ります', 'はかります', 'TRẮC', 'đo', 'N4'],
  ]],
  ['湯', 'THANG', '', 'N4', [
    ['お湯', 'おゆ', 'THANG', 'nước nóng/ nước sôi', 'N4'],
  ]],
  ['滑', 'HOẠT', '', 'N4', [
    ['滑ります', 'すべります', 'HOẠT', 'trượt', 'N4'],
  ]],
  ['漫', 'MẠN', '', 'N4', [
    ['漫画', 'まんが', 'MẠN HỌA', 'truyện tranh/ manga', 'N4'],
  ]],
  ['濃', 'NỒNG', '', 'N4', [
    ['濃い', 'こい', 'NỒNG', 'đậm/ nồng', 'N4'],
  ]],
  ['灰', 'HỘI', '', 'N4', [
    ['灰皿', 'はいざら', 'HỘI MÃNH', 'cái gạt tàn', 'N4'],
  ]],
  ['爆', 'BỘC', '', 'N4', [
    ['爆弾', 'ばくだん', 'BỘC ĐẠN', 'bom', 'N4'],
  ]],
  ['牡', 'MẪU', '', 'N4', [
    ['牡牛座', 'おうしざ', 'MẪU NGƯU TỌA', 'chòm sao Kim Ngưu', 'N4'],
  ]],
  ['犯', 'PHẠM', '', 'N4', [
    ['犯人', 'はんにん', 'PHẠM NHÂN', 'thủ phạm', 'N4'],
  ]],
  ['猿', 'VIÊN', '', 'N4', [
    ['猿', 'さる', 'VIÊN', 'con khỉ', 'N4'],
  ]],
  ['玄', 'HUYỀN', '', 'N4', [
    ['玄関', 'げんかん', 'HUYỀN QUAN', 'cửa vào', 'N4'],
  ]],
  ['玉', 'NGỌC', '', 'N4', [
    ['お年玉', 'おとしだま', 'NIÊN NGỌC', 'tiền mừng tuổi', 'N4'],
  ]],
  ['珍', 'TRÂN', '', 'N4', [
    ['珍しい', 'めずらしい', 'TRÂN', 'hiếm/ hiếm có', 'N4'],
  ]],
  ['的', 'ĐÍCH', '', 'N4', [
    ['世界的に', 'せかいてきに', 'THẾ GIỚI', 'tầm cỡ thế giới', 'N4'],
  ]],
  ['盆', 'BỒN', '', 'N4', [
    ['盆踊り', 'ぼんおどり', 'BỒN DŨNG', 'múa trong hội Bon', 'N4'],
  ]],
  ['矢', 'THỈ', '', 'N4', [
    ['矢印', 'やじるし', 'THỈ ẤN', 'dấu mũi tên', 'N4'],
  ]],
  ['石', 'THẠCH', '', 'N4', [
    ['石油', 'せきゆ', 'THẠCH DU', 'dầu mỏ', 'N4'],
  ]],
  ['硬', 'NGẠNH', '', 'N4', [
    ['硬い', 'かたい', 'NGẠNH', 'cứng', 'N4'],
  ]],
  ['祝', 'CHÚC', '', 'N4', [
    ['お祝い', 'おいわい', 'CHÚC', 'quà mừng/ lời chúc mừng/ lễ mừng', 'N4'],
  ]],
  ['秒', 'MIỂU', '', 'N4', [
    ['秒', 'びょう', 'MIỂU', 'giây', 'N4'],
  ]],
  ['積', 'TÍCH', '', 'N4', [
    ['積みます', 'つみます', 'TÍCH', 'xếp lên/ chất hàng lên', 'N4'],
  ]],
  ['競', 'CẠNH', '', 'N4', [
    ['競走します', 'きょうそうします', 'CẠNH TẨU', 'chạy đua/ thi chạy', 'N4'],
  ]],
  ['笑', 'TIẾU', '', 'N4', [
    ['笑います', 'わらいます', 'TIẾU', 'cười', 'N4'],
  ]],
  ['築', 'TRÚC', '', 'N4', [
    ['建築家', 'けんちくか', 'KIẾN TRÚC GIA', 'kiến trúc sư', 'N4'],
  ]],
  ['米', 'MỄ', '', 'N4', [
    ['米', 'こめ', 'MỄ', 'gạo', 'N4'],
  ]],
  ['紀', 'KỶ', '', 'N4', [
    ['世紀', 'せいき', 'THẾ KỶ', 'thế kỷ', 'N4'],
  ]],
  ['紺', 'CÁM', '', 'N4', [
    ['紺', 'こん', 'CÁM', 'màu xanh lam đậm/ xanh navy', 'N4'],
  ]],
  ['絡', 'LẠC', '', 'N4', [
    ['連絡します', 'れんらくします', 'LIÊN LẠC', 'liên lạc/ liên hệ', 'N4'],
  ]],
  ['給', 'CẤP', '', 'N4', [
    ['給料', 'きゅうりょう', 'CẤP LIỆU', 'lương', 'N4'],
  ]],
  ['絶', 'TUYỆT', '', 'N4', [
    ['絶対に', 'ぜったいに', 'TUYỆT ĐỐI', 'tuyệt đối/ nhất định', 'N4'],
  ]],
  ['網', 'VÕNG', '', 'N4', [
    ['網棚', 'あみだな', 'VÕNG BẰNG', 'giá lưới/ giá để hành lý (trên tàu)', 'N4'],
  ]],
  ['緊', 'KHẨN', '', 'N4', [
    ['緊張します', 'きんちょうします', 'KHẨN TRƯƠNG', 'căng thẳng/ hồi hộp', 'N4'],
  ]],
  ['縁', 'DUYÊN', '', 'N4', [
    ['縁起が悪い', 'えんぎがわるい', 'DUYÊN KHỞI ÁC', 'không may/ không lành', 'N4'],
  ]],
  ['績', 'TÍCH', '', 'N4', [
    ['成績', 'せいせき', 'THÀNH TÍCH', 'kết quả/ thành tích', 'N4'],
  ]],
  ['缶', 'PHỮU', '', 'N4', [
    ['缶', 'かん', 'PHỮU', 'lon/ cái lon/ hộp thiếc', 'N4'],
  ]],
  ['罰', 'PHẠT', '', 'N4', [
    ['罰金', 'ばっきん', 'PHẠT KIM', 'tiền phạt', 'N4'],
  ]],
  ['義', 'NGHĨA', '', 'N4', [
    ['講義', 'こうぎ', 'GIẢNG NGHĨA', 'bài giảng', 'N4'],
  ]],
  ['翻', 'PHIÊN', '', 'N4', [
    ['翻訳します', 'ほんやくします', 'PHIÊN DỊCH', 'dịch (sách, tài liệu)', 'N4'],
  ]],
  ['胃', 'VỊ', '', 'N4', [
    ['胃', 'い', 'VỊ', 'dạ dày', 'N4'],
  ]],
  ['脳', 'NÃO', '', 'N4', [
    ['脳', 'のう', 'NÃO', 'não', 'N4'],
  ]],
  ['興', 'HƯNG', '', 'N4', [
    ['興味', 'きょうみ', 'HƯNG VỊ', 'sự quan tâm/ hứng thú', 'N4'],
  ]],
  ['芸', 'NGHỆ', '', 'N4', [
    ['芸', 'げい', 'NGHỆ', 'trò diễn/ tiết mục', 'N4'],
  ]],
  ['苦', 'KHỔ', '', 'N4', [
    ['苦い', 'にがい', 'KHỔ', 'đắng', 'N4'],
  ]],
  ['華', 'HOA', '', 'N4', [
    ['豪華', 'ごうか', 'HÀO HOA', 'hào hoa/ sang trọng', 'N4'],
  ]],
  ['葬', 'TÁNG', '', 'N4', [
    ['お葬式', 'おそうしき', 'TÁNG THỨC', 'lễ tang/ đám tang', 'N4'],
  ]],
  ['薄', 'BẠC', '', 'N4', [
    ['薄い', 'うすい', 'BẠC', 'nhạt/ mỏng', 'N4'],
  ]],
  ['裏', 'LÝ', '', 'N4', [
    ['裏', 'うら', 'LÝ', 'mặt sau/ phía sau', 'N4'],
  ]],
  ['複', 'PHỨC', '', 'N4', [
    ['複雑', 'ふくざつ', 'PHỨC TẠP', 'phức tạp', 'N4'],
  ]],
  ['褒', 'BAO', '', 'N4', [
    ['褒めます', 'ほめます', 'BAO', 'khen', 'N4'],
  ]],
  ['規', 'QUY', '', 'N4', [
    ['規則', 'きそく', 'QUY TẮC', 'quy định/ nội quy/ quy tắc', 'N4'],
  ]],
  ['許', 'HỨA', '', 'N4', [
    ['許可', 'きょか', 'HỨA KHẢ', 'phép/ giấy phép', 'N4'],
  ]],
  ['診', 'CHÂN', '', 'N4', [
    ['診ます', 'みます', 'CHÂN', 'khám/ khám bệnh', 'N4'],
  ]],
  ['詳', 'TƯỜNG', '', 'N4', [
    ['詳しい', 'くわしい', 'TƯỜNG', 'cụ thể/ chi tiết', 'N4'],
  ]],
  ['誘', 'DỤ', '', 'N4', [
    ['誘います', 'さそいます', 'DỤ', 'mời/ rủ', 'N4'],
  ]],
  ['談', 'ĐÀM', '', 'N4', [
    ['相談します', 'そうだんします', 'TƯƠNG ĐÀM', 'trao đổi/ bàn bạc/ tư vấn', 'N4'],
  ]],
  ['識', 'THỨC', '', 'N4', [
    ['知識', 'ちしき', 'TRI THỨC', 'tri thức/ kiến thức', 'N4'],
  ]],
  ['谷', 'CỐC', '', 'N4', [
    ['四ツ谷', 'よつや', 'TỨ CỐC', 'tên một nhà ga ở Tokyo', 'N4'],
  ]],
  ['豪', 'HÀO', '', 'N4', [
    ['豪華', 'ごうか', 'HÀO HOA', 'hào hoa/ sang trọng', 'N4'],
  ]],
  ['財', 'TÀI', '', 'N4', [
    ['財布', 'さいふ', 'TÀI BỐ', 'cái ví', 'N4'],
  ]],
  ['貯', 'TRỮ', '', 'N4', [
    ['貯金します', 'ちょきんします', 'TRỮ KIM', 'tiết kiệm tiền/ để dành tiền', 'N4'],
  ]],
  ['貼', 'THIẾP', '', 'N4', [
    ['貼ります', 'はります', '', 'dán', 'N4'],
  ]],
  ['貿', 'MẬU', '', 'N4', [
    ['貿易', 'ぼうえき', 'MẬU DỊCH', 'mậu dịch/ thương mại quốc tế', 'N4'],
  ]],
  ['賛', 'TÁN', '', 'N4', [
    ['賛成', 'さんせい', 'TÁN THÀNH', 'tán thành/ đồng ý', 'N4'],
  ]],
  ['贈', 'TẶNG', '', 'N4', [
    ['贈り物', 'おくりもの', 'TẶNG VẬT', 'quà tặng', 'N4'],
  ]],
  ['踏', 'ĐẠP', '', 'N4', [
    ['踏みます', 'ふみます', 'ĐẠP', 'giẫm/ giẫm lên', 'N4'],
  ]],
  ['軟', 'NHUYỄN', '', 'N4', [
    ['軟らかい', 'やわらかい', 'NHUYỄN', 'mềm', 'N4'],
  ]],
  ['載', 'TẢI', '', 'N4', [
    ['載せます', 'のせます', 'TẢI', 'để lên/ đặt lên', 'N4'],
  ]],
  ['輪', 'LUÂN', '', 'N4', [
    ['指輪', 'ゆびわ', 'CHỈ LUÂN', 'cái nhẫn', 'N4'],
  ]],
  ['辺', 'BIÊN', '', 'N4', [
    ['この辺', 'このへん', 'BIÊN', 'xung quanh đây/ gần đây', 'N4'],
  ]],
  ['途', 'ĐỒ', '', 'N4', [
    ['途中で', 'とちゅうで', 'ĐỒ TRUNG', 'giữa đường/ dọc đường', 'N4'],
  ]],
  ['適', 'THÍCH', '', 'N4', [
    ['適当', 'てきとう', 'THÍCH ĐƯƠNG', 'thích hợp/ vừa phải', 'N4'],
  ]],
  ['遭', 'TAO', '', 'N4', [
    ['事故に遭います', 'じこにあいます', 'SỰ CỐ TAO', 'gặp tai nạn', 'N4'],
  ]],
  ['邪', 'TÀ', '', 'N4', [
    ['邪魔', 'じゃま', 'TÀ MA', 'cản trở/ choán chỗ', 'N4'],
  ]],
  ['郊', 'GIAO', '', 'N4', [
    ['郊外', 'こうがい', 'GIAO NGOẠI', 'ngoại ô', 'N4'],
  ]],
  ['酔', 'TÚY', '', 'N4', [
    ['酔います', 'よいます', 'TÚY', 'say', 'N4'],
  ]],
  ['針', 'CHÂM', '', 'N4', [
    ['針', 'はり', 'CHÂM', 'kim đồng hồ', 'N4'],
  ]],
  ['鍵', 'KIỆN', '', 'N4', [
    ['鍵が掛かります', 'かぎがかかります', 'QUẢI', 'cửa được khoá', 'N4'],
  ]],
  ['関', 'QUAN', '', 'N4', [
    ['玄関', 'げんかん', 'HUYỀN QUAN', 'cửa vào', 'N4'],
  ]],
  ['陸', 'LỤC', '', 'N4', [
    ['陸', 'りく', 'LỤC', 'đất liền/ lục địa', 'N4'],
  ]],
  ['陽', 'DƯƠNG', '', 'N4', [
    ['太陽', 'たいよう', 'THÁI DƯƠNG', 'mặt trời', 'N4'],
  ]],
  ['隅', 'NGUNG', '', 'N4', [
    ['隅', 'すみ', 'NGUNG', 'góc', 'N4'],
  ]],
  ['震', 'CHẤN', '', 'N4', [
    ['地震', 'じしん', 'ĐỊA CHẤN', 'động đất', 'N4'],
  ]],
  ['非', 'PHI', '', 'N4', [
    ['非常口', 'ひじょうぐち', 'PHI THƯỜNG KHẨU', 'lối thoát hiểm/ cửa thoát hiểm', 'N4'],
  ]],
  ['順', 'THUẬN', '', 'N4', [
    ['順序', 'じゅんじょ', 'THUẬN TỰ', 'thứ tự', 'N4'],
  ]],
  ['預', 'DỰ', '', 'N4', [
    ['預かります', 'あずかります', 'DỰ', 'giữ hộ/ nhận giữ', 'N4'],
  ]],
  ['類', 'LOẠI', '', 'N4', [
    ['書類', 'しょるい', 'THƯ LOẠI', 'giấy tờ/ tài liệu', 'N4'],
  ]],
  ['飼', 'TỰ', '', 'N4', [
    ['飼います', 'かいます', 'TỰ', 'nuôi', 'N4'],
  ]],
  ['飾', 'SỨC', '', 'N4', [
    ['飾ります', 'かざります', 'SỨC', 'trang trí', 'N4'],
  ]],
  ['魔', 'MA', '', 'N4', [
    ['邪魔', 'じゃま', 'TÀ MA', 'cản trở/ choán chỗ', 'N4'],
  ]],
  ['鳴', 'MINH', '', 'N4', [
    ['鳴ります', 'なります', 'MINH', 'reo/ kêu', 'N4'],
  ]],
  ['麦', 'MẠCH', '', 'N4', [
    ['麦', 'むぎ', 'MẠCH', 'lúa mạch', 'N4'],
  ]],
  ['黄', 'HOÀNG', '', 'N4', [
    ['黄色', 'きいろ', 'HOÀNG SẮC', 'màu vàng', 'N4'],
  ]],
  ['齢', 'LINH', '', 'N4', [
    ['年齢', 'ねんれい', 'NIÊN LINH', 'tuổi', 'N4'],
  ]],
  ['抜', 'BẠT', '', 'N3', [
    ['抜きます', 'ぬきます', '', 'rút ra/ nhổ', 'N3'],
    ['抜けます', 'ぬけます', '', 'tuột ra/ rụng', 'N3'],
  ]],
  ['沸', 'PHẤT', '', 'N3', [
    ['沸きます', 'わきます', '', '(nước) sôi', 'N3'],
    ['沸かします', 'わかします', '', 'đun sôi', 'N3'],
  ]],
  ['混', 'HỖN', '', 'N3', [
    ['混ぜます', 'まぜます', '', 'trộn/ khuấy', 'N3'],
    ['混ざります', 'まざります', '', 'bị trộn lẫn', 'N3'],
  ]],
  ['溶', 'DUNG', '', 'N3', [
    ['溶けます', 'とけます', '', 'tan ra', 'N3'],
    ['溶かします', 'とかします', '', 'hoà tan/ làm tan', 'N3'],
  ]],
  ['移', 'DI', '', 'N3', [
    ['移します', 'うつします', '', 'chuyển/ dời (cái gì)', 'N3'],
    ['移ります', 'うつります', '', 'chuyển sang/ dời đi', 'N3'],
  ]],
  ['進', 'TIẾN', '', 'N3', [
    ['進みます', 'すすみます', '', 'tiến lên/ tiến triển', 'N3'],
    ['進めます', 'すすめます', '', 'đẩy tới/ xúc tiến', 'N3'],
  ]],
  ['光', 'QUANG', '', 'N3', [
    ['光ります', 'ひかります', '', 'phát sáng', 'N3'],
  ]],
  ['喋', 'ĐIỆP', '', 'N3', [
    ['喋ります', 'しゃべります', '', 'nói chuyện phiếm', 'N3'],
  ]],
  ['噛', 'GIẢO', '', 'N3', [
    ['噛みます', 'かみます', '', 'cắn/ nhai', 'N3'],
  ]],
  ['慢', 'MẠN', '', 'N3', [
    ['我慢します', 'がまんします', '', 'chịu đựng/ nhịn', 'N3'],
  ]],
  ['我', 'NGÃ', '', 'N3', [
    ['我慢します', 'がまんします', '', 'chịu đựng/ nhịn', 'N3'],
  ]],
  ['断', 'ĐOẠN', '', 'N3', [
    ['断ります', 'ことわります', '', 'từ chối', 'N3'],
  ]],
  ['致', 'TRÍ', '', 'N3', [
    ['致します', 'いたします', '', 'làm (khiêm nhường)', 'N3'],
  ]],
  ['訪', 'PHỎNG', '', 'N3', [
    ['訪ねます', 'たずねます', '', 'ghé thăm', 'N3'],
  ]],
  ['諦', 'ĐẾ', '', 'N3', [
    ['諦めます', 'あきらめます', '', 'từ bỏ', 'N3'],
  ]],
  ['驚', 'KINH', '', 'N3', [
    ['驚きます', 'おどろきます', '', 'ngạc nhiên', 'N3'],
  ]],
];
