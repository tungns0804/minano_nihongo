/**
 * Bảng chữ của bài giảng Kanji (thầy Công Minh Nguyễn, tài liệu "Minnnchann") — người dùng
 * chụp gửi ngày 2026-11-10, tám ảnh. Mở ở tab Kanji › Âm On/Kun (`features/kanji-onkun`).
 *
 * Mỗi bảng chép NGUYÊN thứ tự trên ảnh, hàng nối hàng (mười chữ một hàng). Hàng chỉ còn mép
 * dưới ở đầu ảnh (vài ảnh chụp cắt ngang hàng trên cùng) thì bỏ — không đoán chữ nào nằm ở
 * đó; người dùng nói cả bộ là 320 chữ, ở đây đọc được 300. `marked` là các chữ thầy
 * tô vàng trên bảng lúc chụp (ảnh chụp ở các buổi khác nhau, nên "tô vàng" là "đã giảng tới
 * lúc đó" chứ không phải một danh sách học xong cố định).
 *
 * Âm On / Kun và âm Hán Việt KHÔNG khai ở đây: âm lấy từ bảng thường dụng
 * (`joyo-readings.data.ts`), Hán Việt từ khu Kanji. File này chỉ giữ thứ bảng gốc không có:
 * chữ nào trên bảng nào, và từ ví dụ.
 *
 * `npm run verify:kanji-readings` soát: chữ có ở khu Kanji, không trùng giữa các bảng,
 * `marked` nằm trong bảng, mỗi từ ví dụ chứa chữ của nó và căn được âm.
 */

/**
 * Id "bài tập" của trang này: id phiên luyện (kết quả quay về `/kanji/am-on-kun` nhờ
 * `EXERCISE_PAGE` ở `core/paths.ts`) và gốc của khoá ★ "chữ chưa nhớ âm". KHÔNG đổi.
 */
export const KANJI_BOARD_ID = 'am-on-kun';

export interface RawKanjiBoard {
  /** Số bảng — tên "Bảng 1" và khoá nhớ bảng đang chọn. Bảng thêm sau lấy số kế tiếp. */
  board: number;
  /** Chữ theo đúng thứ tự trên bảng. */
  chars: string;
  /** Chữ thầy tô vàng. */
  marked: string;
}

export const KANJI_BOARDS: readonly RawKanjiBoard[] = [
  {
    board: 1,
    chars: '駐無満向禁関係断横押式信号確認飛非常階段箱危険捨線面普各次快速過鉄指定席由番窓側路停整券現両替優座降',
    marked: '駐無満向禁関係断横押式信号確認飛非常階段',
  },
  {
    board: 2,
    chars: '未末若晩島皿血助準備営閉案内予約煙当全客様解協願観園港遊美術神寺役郵局交差点橋公受付科鼻婦形骨折困消',
    marked: '未末若晩島皿血助準備営閉案内予約煙当',
  },
  {
    board: 3,
    chars: '防救警察故伝黄絵組束授渡昔要冷蔵凍庫保存',
    marked: '防救警察故伝黄絵組束授渡昔',
  },
  {
    board: 4,
    chars: '召必費期限製造賞法温販機増減量氷返湯材卵乳粉袋混焼表裏留守濃薄部数件再接続示戻完',
    marked: '召必費期限製造賞法温販機増減量氷返湯材卵乳粉袋混焼表裏留守',
  },
  {
    board: 5,
    chars: '了登録育種類師妻馬石砂塩油緑紅冊個枚告利割倍値商支払米級残型税込価格申記例齢歳性',
    marked: '了登録育種類師妻馬石',
  },
  {
    board: 6,
    chars: '念涙笑調査移難簡単感',
    marked: '念',
  },
  {
    board: 7,
    chars: '想練最適選違直復辞宿昨君結婚祝曲奥寝痛熱虫歯治汚並他身酒吸欲眠疲息呼報晴雲吹暖雪',
    marked: '想練',
  },
  {
    board: 8,
    chars: '震波求募職容技般務課球決勝対流負投果戦経済成貿易輸相化比原因際議活変政府改否的実欠専亡忙忘祭労加情反',
    marked: '震波求募職容技般務課球',
  },
];

/**
 * Từ ví dụ viết tay, "từ|cách đọc|nghĩa", trong khoảng N5–N3. Đứng TRƯỚC từ lấy tự động từ
 * kho từ của app (khu Kanji, đã lọc N5–N3) trên thẻ chữ. Có ba loại:
 *  - từ thầy ghi trên bảng (関係, 信じる, 血圧, 返事, 石けん, 津波…) — luôn đứng đầu;
 *  - từ bù cho chữ mà kho từ chưa có ví dụ nào hoặc chỉ một (各, 券, 鼻, 般…);
 *  - từ bù loại âm kho từ chưa có: chữ chỉ có ví dụ âm Kun thì thêm một từ âm On
 *    (過 — 過去), và ngược lại (全 — 全く).
 * Chữ không có mặt ở đây thì ví dụ lấy hết từ kho.
 */
export const BOARD_EXAMPLES: Readonly<Record<string, readonly string[]>> = {
  // ── Bảng 1 ──
  駐: ['駐車|ちゅうしゃ|đỗ xe'],
  満: ['満員|まんいん|chật kín người', '満車|まんしゃ|bãi xe đã đầy'],
  向: ['方向|ほうこう|phương hướng', '向く|むく|quay về phía'],
  禁: ['禁止|きんし|cấm'],
  関: ['関係|かんけい|quan hệ, liên quan', '関心|かんしん|sự quan tâm'],
  係: ['関係|かんけい|quan hệ, liên quan', '係|かかり|người phụ trách'],
  断: ['横断歩道|おうだんほどう|vạch sang đường'],
  横: ['横断歩道|おうだんほどう|vạch sang đường'],
  押: ['押す|おす|ấn, đẩy'],
  式: ['入学式|にゅうがくしき|lễ nhập học'],
  信: ['信じる|しんじる|tin tưởng', '自信|じしん|sự tự tin'],
  号: ['信号|しんごう|đèn tín hiệu giao thông'],
  確: ['確か|たしか|chắc chắn, hình như', '確認|かくにん|xác nhận'],
  認: ['確認|かくにん|xác nhận', '認める|みとめる|công nhận, thừa nhận'],
  飛: ['飛ぶ|とぶ|bay', '飛び出す|とびだす|lao ra, phóng ra'],
  非: ['非常に|ひじょうに|rất, vô cùng', '非常口|ひじょうぐち|lối thoát hiểm'],
  常: ['非常に|ひじょうに|rất, vô cùng', '日常|にちじょう|thường ngày', '常に|つねに|luôn luôn'],
  階: ['階段|かいだん|cầu thang'],
  段: ['階段|かいだん|cầu thang'],
  険: ['保険|ほけん|bảo hiểm'],
  線: ['路線|ろせん|tuyến đường'],
  面: ['面白い|おもしろい|thú vị'],
  普: ['普段|ふだん|thường ngày'],
  各: ['各駅停車|かくえきていしゃ|tàu dừng mọi ga', '各地|かくち|các nơi'],
  快: ['快速|かいそく|tàu nhanh', '快適|かいてき|dễ chịu, thoải mái'],
  次: ['次回|じかい|lần tới'],
  過: ['過去|かこ|quá khứ'],
  鉄: ['鉄道|てつどう|đường sắt'],
  指: ['指定席|していせき|ghế đặt trước'],
  定: ['定食|ていしょく|cơm suất'],
  窓: ['窓口|まどぐち|quầy giao dịch'],
  側: ['右側|みぎがわ|bên phải', '両側|りょうがわ|hai bên'],
  路: ['線路|せんろ|đường ray', '道路|どうろ|đường bộ'],
  停: ['停車|ていしゃ|dừng xe, dừng tàu', '停電|ていでん|mất điện'],
  整: ['整理券|せいりけん|phiếu số thứ tự', '整理|せいり|sắp xếp, dọn dẹp'],
  券: ['乗車券|じょうしゃけん|vé lên tàu xe', '定期券|ていきけん|vé tháng', '整理券|せいりけん|phiếu số thứ tự'],
  現: ['現在|げんざい|hiện tại', '現れる|あらわれる|xuất hiện'],
  両: ['両替|りょうがえ|đổi tiền', '両方|りょうほう|cả hai'],
  替: ['両替|りょうがえ|đổi tiền', '着替える|きがえる|thay quần áo'],
  座: ['座席|ざせき|chỗ ngồi'],
  降: ['以降|いこう|từ đó về sau'],
  捨: ['使い捨て|つかいすて|dùng một lần'],
  席: ['出席|しゅっせき|có mặt', '欠席|けっせき|vắng mặt'],

  // ── Bảng 2 ──
  未: ['未来|みらい|tương lai', '未成年|みせいねん|người chưa thành niên'],
  末: ['年末|ねんまつ|cuối năm', '月末|げつまつ|cuối tháng', '末っ子|すえっこ|con út'],
  若: ['若い|わかい|trẻ', '若者|わかもの|người trẻ'],
  晩: ['晩|ばん|buổi tối'],
  島: ['島|しま|hòn đảo', '半島|はんとう|bán đảo'],
  皿: ['皿|さら|cái đĩa'],
  血: ['血|ち|máu', '血圧|けつあつ|huyết áp', '出血|しゅっけつ|chảy máu'],
  助: ['助ける|たすける|giúp đỡ, cứu', '助手|じょしゅ|trợ lý'],
  準: ['準備|じゅんび|chuẩn bị', '基準|きじゅん|tiêu chuẩn'],
  備: ['準備|じゅんび|chuẩn bị', '備える|そなえる|chuẩn bị sẵn, phòng bị'],
  営: ['営業|えいぎょう|kinh doanh, mở cửa bán hàng'],
  閉: ['閉店|へいてん|đóng cửa hàng'],
  案: ['案内|あんない|hướng dẫn'],
  内: ['案内|あんない|hướng dẫn', '内側|うちがわ|bên trong'],
  約: ['予約|よやく|đặt trước'],
  煙: ['煙|けむり|khói', '禁煙|きんえん|cấm hút thuốc'],
  当: ['本当|ほんとう|thật', '弁当|べんとう|cơm hộp', '当たる|あたる|trúng, va phải'],
  全: ['全く|まったく|hoàn toàn'],
  客: ['客|きゃく|khách', '乗客|じょうきゃく|hành khách'],
  解: ['理解|りかい|sự hiểu', '解決|かいけつ|giải quyết', '解く|とく|giải (bài)'],
  願: ['お願い|おねがい|lời nhờ cậy'],
  観: ['観客|かんきゃく|khán giả', '観光|かんこう|du lịch, tham quan'],
  遊: ['遊園地|ゆうえんち|công viên giải trí'],
  神: ['神様|かみさま|thần, ông trời'],
  寺: ['金閣寺|きんかくじ|chùa Vàng (Kinkakuji)'],
  局: ['薬局|やっきょく|hiệu thuốc'],
  差: ['差す|さす|giương (ô)'],
  点: ['点|てん|điểm'],
  橋: ['歩道橋|ほどうきょう|cầu vượt cho người đi bộ'],
  付: ['付近|ふきん|vùng lân cận'],
  科: ['教科書|きょうかしょ|sách giáo khoa'],
  鼻: ['鼻|はな|mũi', '鼻水|はなみず|nước mũi', '耳鼻科|じびか|khoa tai mũi họng'],
  婦: ['主婦|しゅふ|nội trợ', '夫婦|ふうふ|vợ chồng'],
  骨: ['骨|ほね|xương', '骨折|こっせつ|gãy xương'],
  折: ['骨折|こっせつ|gãy xương'],
  消: ['消費|しょうひ|tiêu dùng'],
  協: ['協会|きょうかい|hiệp hội'],
  役: ['役に立つ|やくにたつ|có ích'],
  郵: ['郵便|ゆうびん|bưu điện, bưu phẩm'],
  困: ['困る|こまる|khó xử, gặp rắc rối', '困難|こんなん|khó khăn'],

  // ── Bảng 3 ──
  防: ['防ぐ|ふせぐ|ngăn ngừa', '予防|よぼう|phòng ngừa', '消防車|しょうぼうしゃ|xe cứu hoả'],
  救: ['救急車|きゅうきゅうしゃ|xe cấp cứu', '救う|すくう|cứu'],
  察: ['観察|かんさつ|quan sát'],
  故: ['故障|こしょう|hỏng hóc'],
  伝: ['伝える|つたえる|truyền đạt, nhắn', '伝言|でんごん|lời nhắn'],
  黄: ['黄色い|きいろい|màu vàng', '黄身|きみ|lòng đỏ trứng'],
  組: ['組|くみ|lớp, nhóm'],
  束: ['約束|やくそく|lời hẹn', '花束|はなたば|bó hoa'],
  授: ['授業|じゅぎょう|giờ học', '教授|きょうじゅ|giáo sư'],
  渡: ['渡る|わたる|băng qua'],
  蔵: ['蔵|くら|nhà kho'],
  庫: ['車庫|しゃこ|nhà để xe'],
  存: ['保存|ほぞん|bảo quản, lưu'],
  保: ['保険|ほけん|bảo hiểm', '保存|ほぞん|bảo quản, lưu'],
  絵: ['絵本|えほん|sách tranh'],
  凍: ['冷凍|れいとう|đông lạnh', '凍る|こおる|đóng băng'],

  // ── Bảng 4 ──
  費: ['費用|ひよう|chi phí', '交通費|こうつうひ|phí đi lại'],
  期: ['期限|きげん|thời hạn', '期間|きかん|khoảng thời gian', '定期券|ていきけん|vé tháng'],
  限: ['限る|かぎる|giới hạn', '期限|きげん|thời hạn'],
  製: ['日本製|にほんせい|hàng Nhật sản xuất', '製造|せいぞう|chế tạo, sản xuất'],
  造: ['製造|せいぞう|chế tạo, sản xuất'],
  賞: ['賞味期限|しょうみきげん|hạn dùng (ngon nhất)'],
  販: ['自動販売機|じどうはんばいき|máy bán hàng tự động'],
  機: ['機械|きかい|máy móc', '機会|きかい|cơ hội'],
  増: ['増加|ぞうか|sự gia tăng'],
  減: ['減少|げんしょう|sự giảm'],
  量: ['量|りょう|lượng'],
  氷: ['氷|こおり|đá (nước đá)', 'かき氷|かきごおり|đá bào'],
  返: ['返事|へんじ|trả lời', '返す|かえす|trả lại'],
  湯: ['銭湯|せんとう|nhà tắm công cộng'],
  材: ['材料|ざいりょう|nguyên liệu', '食材|しょくざい|nguyên liệu nấu ăn'],
  卵: ['生卵|なまたまご|trứng sống'],
  乳: ['牛乳|ぎゅうにゅう|sữa bò', '乳製品|にゅうせいひん|sản phẩm từ sữa'],
  粉: ['粉|こな|bột', '小麦粉|こむぎこ|bột mì', '花粉|かふん|phấn hoa'],
  混: ['混雑|こんざつ|đông đúc', '混む|こむ|đông'],
  焼: ['焼く|やく|nướng'],
  表: ['代表|だいひょう|đại diện'],
  裏: ['裏|うら|mặt sau'],
  留: ['留守|るす|vắng nhà'],
  守: ['守る|まもる|bảo vệ, giữ (lời)', '留守|るす|vắng nhà'],
  部: ['部分|ぶぶん|bộ phận, phần'],
  数: ['数学|すうがく|toán học', '数字|すうじ|chữ số'],
  件: ['用件|ようけん|việc cần'],
  続: ['接続|せつぞく|kết nối', '連続|れんぞく|liên tục'],
  示: ['表示|ひょうじ|hiển thị', '指示|しじ|chỉ thị', '示す|しめす|chỉ ra'],
  完: ['完成|かんせい|hoàn thành', '完全|かんぜん|hoàn toàn'],
  召: ['召し上がる|めしあがる|ăn, uống (kính ngữ)'],
  濃: ['濃い|こい|đậm, đặc', '濃さ|こさ|độ đậm'],
  薄: ['薄い|うすい|mỏng, nhạt', '薄味|うすあじ|vị nhạt'],
  接: ['面接|めんせつ|phỏng vấn'],

  // ── Bảng 5 ──
  了: ['了解|りょうかい|hiểu rồi, đã rõ', '終了|しゅうりょう|kết thúc'],
  登: ['登山|とざん|leo núi'],
  録: ['記録|きろく|ghi chép, kỷ lục'],
  育: ['教育|きょういく|giáo dục'],
  種: ['種類|しゅるい|chủng loại', '種|たね|hạt giống'],
  類: ['種類|しゅるい|chủng loại'],
  師: ['教師|きょうし|giáo viên'],
  妻: ['妻|つま|vợ (mình)', '夫妻|ふさい|vợ chồng (ông bà…)'],
  馬: ['乗馬|じょうば|cưỡi ngựa'],
  石: ['石|いし|hòn đá', '石けん|せっけん|xà phòng'],
  砂: ['砂|すな|cát'],
  塩: ['塩分|えんぶん|lượng muối'],
  緑: ['緑茶|りょくちゃ|trà xanh'],
  紅: ['紅葉|こうよう|lá đổi màu mùa thu'],
  冊: ['一冊|いっさつ|một cuốn', '何冊|なんさつ|mấy cuốn'],
  個: ['一個|いっこ|một cái', '個人|こじん|cá nhân'],
  枚: ['一枚|いちまい|một tờ, một tấm', '何枚|なんまい|mấy tờ, mấy tấm'],
  告: ['広告|こうこく|quảng cáo', '報告|ほうこく|báo cáo'],
  割: ['割引|わりびき|giảm giá'],
  倍: ['倍|ばい|gấp đôi', '二倍|にばい|gấp hai lần'],
  値: ['価値|かち|giá trị'],
  商: ['商品|しょうひん|hàng hoá', '商店|しょうてん|cửa hàng'],
  支: ['支払う|しはらう|thanh toán'],
  払: ['支払い|しはらい|việc thanh toán'],
  米: ['お米|おこめ|gạo'],
  級: ['上級|じょうきゅう|cao cấp', '初級|しょきゅう|sơ cấp', '同級生|どうきゅうせい|bạn cùng lớp'],
  型: ['大型|おおがた|cỡ lớn', '血液型|けつえきがた|nhóm máu'],
  税: ['税金|ぜいきん|tiền thuế', '消費税|しょうひぜい|thuế tiêu dùng'],
  価: ['価格|かかく|giá cả'],
  記: ['記入|きにゅう|điền vào'],
  例: ['例|れい|ví dụ'],
  込: ['込む|こむ|đông (người)'],
  齢: ['高齢|こうれい|cao tuổi'],
  歳: ['三歳|さんさい|ba tuổi'],

  // ── Bảng 6 ──
  念: ['残念|ざんねん|đáng tiếc', '記念|きねん|kỷ niệm'],
  査: ['調査|ちょうさ|điều tra', '検査|けんさ|kiểm tra'],
  移: ['移動|いどう|di chuyển'],
  単: ['単語|たんご|từ vựng'],
  感: ['感想|かんそう|cảm tưởng'],
  涙: ['涙が出る|なみだがでる|chảy nước mắt'],
  笑: ['笑う|わらう|cười', '笑顔|えがお|gương mặt tươi cười'],
  難: ['避難|ひなん|lánh nạn, sơ tán'],
  簡: ['簡単|かんたん|đơn giản'],

  // ── Bảng 7 ──
  想: ['想像|そうぞう|tưởng tượng', '予想|よそう|dự đoán'],
  最: ['最も|もっとも|nhất'],
  選: ['選手|せんしゅ|vận động viên'],
  復: ['往復|おうふく|khứ hồi'],
  辞: ['辞める|やめる|nghỉ (việc)'],
  宿: ['宿|やど|nhà trọ'],
  昨: ['昨年|さくねん|năm ngoái', '昨日|きのう|hôm qua'],
  君: ['山田君|やまだくん|cậu Yamada'],
  結: ['結ぶ|むすぶ|buộc, nối'],
  祝: ['祝日|しゅくじつ|ngày lễ'],
  寝: ['寝坊|ねぼう|ngủ quên'],
  痛: ['痛い|いたい|đau', '頭痛|ずつう|đau đầu'],
  虫: ['虫|むし|côn trùng', '虫歯|むしば|răng sâu'],
  歯: ['歯科|しか|nha khoa'],
  他: ['他|ほか|khác', '他人|たにん|người khác'],
  酒: ['日本酒|にほんしゅ|rượu Nhật'],
  吸: ['呼吸|こきゅう|hô hấp'],
  眠: ['睡眠|すいみん|giấc ngủ'],
  息: ['息|いき|hơi thở', '息子|むすこ|con trai (mình)'],
  呼: ['呼吸|こきゅう|hô hấp'],
  晴: ['晴れ|はれ|trời nắng', '素晴らしい|すばらしい|tuyệt vời'],
  雲: ['雲|くも|mây', '雨雲|あまぐも|mây mưa'],
  雪: ['大雪|おおゆき|tuyết rơi dày'],
  練: ['練習|れんしゅう|luyện tập', '訓練|くんれん|huấn luyện'],
  適: ['快適|かいてき|dễ chịu, thoải mái'],
  奥: ['奥|おく|phía trong', '奥さん|おくさん|vợ (của người khác)'],
  吹: ['吹く|ふく|thổi', '吹雪|ふぶき|bão tuyết'],

  // ── Bảng 8 ──
  震: ['地震|じしん|động đất', '震える|ふるえる|run'],
  波: ['津波|つなみ|sóng thần', '電波|でんぱ|sóng điện'],
  求: ['求める|もとめる|tìm kiếm, yêu cầu', '要求|ようきゅう|yêu cầu'],
  募: ['募集|ぼしゅう|tuyển, chiêu mộ', '応募|おうぼ|ứng tuyển'],
  職: ['就職|しゅうしょく|xin được việc', '職業|しょくぎょう|nghề nghiệp'],
  容: ['内容|ないよう|nội dung', '美容院|びよういん|tiệm làm đẹp'],
  技: ['技術|ぎじゅつ|kỹ thuật', '特技|とくぎ|sở trường'],
  般: ['一般|いっぱん|nói chung, phổ thông', '一般的|いっぱんてき|mang tính phổ biến'],
  務: ['事務|じむ|công việc văn phòng', '勤務|きんむ|làm việc (ở nơi nào)'],
  課: ['課題|かだい|bài tập, đề tài'],
  球: ['地球|ちきゅう|Trái Đất'],
  決: ['決心|けっしん|quyết tâm'],
  流: ['流れる|ながれる|chảy', '交流|こうりゅう|giao lưu'],
  負: ['勝負|しょうぶ|thắng thua'],
  投: ['投票|とうひょう|bỏ phiếu'],
  果: ['結果|けっか|kết quả', '効果|こうか|hiệu quả'],
  戦: ['戦う|たたかう|chiến đấu'],
  比: ['比較|ひかく|so sánh'],
  経: ['経つ|たつ|(thời gian) trôi qua'],
  原: ['野原|のはら|cánh đồng'],
  際: ['国際|こくさい|quốc tế', '実際|じっさい|thực tế'],
  政: ['政府|せいふ|chính phủ'],
  府: ['政府|せいふ|chính phủ', '京都府|きょうとふ|phủ Kyoto'],
  改: ['改札|かいさつ|cửa soát vé', '改める|あらためる|sửa đổi'],
  否: ['否定|ひてい|phủ định', '安否|あんぴ|tình hình an nguy'],
  実: ['事実|じじつ|sự thật', '実|み|quả'],
  欠: ['欠点|けってん|khuyết điểm', '欠ける|かける|thiếu, sứt'],
  亡: ['死亡|しぼう|tử vong'],
  祭: ['文化祭|ぶんかさい|lễ hội văn hoá (trường)'],
  労: ['苦労|くろう|vất vả', '労働|ろうどう|lao động'],
  情: ['表情|ひょうじょう|nét mặt', '事情|じじょう|hoàn cảnh, sự tình'],
  貿: ['貿易会社|ぼうえきがいしゃ|công ty thương mại'],
  因: ['原因|げんいん|nguyên nhân'],
  専: ['専門家|せんもんか|chuyên gia'],
  加: ['参加|さんか|tham gia', '加える|くわえる|thêm vào'],
};
