/**
 * DANH SÁCH CHỮ HÁN THEO CẤP JLPT — N5, N4, N3.
 *
 * Chép nguyên từ ảnh người dùng cung cấp, GIỮ ĐÚNG THỨ TỰ trong ảnh (thứ tự dạy
 * theo lối chiết tự, không phải thứ tự bảng chữ hay tần suất). Mỗi hằng số dưới
 * đây chia thành từng dòng đúng như lưới 12 ô một hàng của ảnh, để soát lại bằng
 * mắt là đối chiếu được từng hàng.
 *
 * ĐÂY LÀ NGUỒN DUY NHẤT quyết định chữ nào thuộc cấp nào và chữ nào có mặt trong
 * khu Kanji. Kho từ của ứng dụng (`data-source/`, `core/exercises/`) chỉ còn lo
 * hai việc: suy âm Hán Việt của từng chữ, và cung cấp các từ dùng chữ đó.
 *
 * Chữ có trong kho từ nhưng KHÔNG có trong ba danh sách này thì không hiện ở khu
 * Kanji — nó nằm ngoài phạm vi N5→N3. `npm run generate:kanji` in ra số lượng.
 *
 * Sửa danh sách thì sửa ở đây rồi chạy `npm run generate:kanji`.
 */

/** Gộp các hàng thành một chuỗi, bỏ mọi khoảng trắng và xuống dòng. */
function rows(...lines: string[]): readonly string[] {
  return [...lines.join('').replace(/\s+/g, '')];
}

/** N5 — 118 chữ. */
export const KANJI_N5: readonly string[] = rows(
  '一二八六日目三手十千土上',
  '下万九口四西七北円五竹気',
  '左右石岩年人入大犬子字学',
  '月言牛花今米来木林森休本',
  '体音暗水泳火立話門聞間金',
  '貝買生寺時魚雨電新中半母',
  '方友分食父校百読車明出書',
  '元古何夕外多名小少帰内肉',
  '見女好安町東高山足南飲田',
  '畑物茶行川耳男先長鳥',
);

/** N4 — 149 chữ. */
export const KANJI_N4: readonly string[] = rows(
  '毛刀力丸究酒光当社降麦太',
  '天夫有午化界奥科料作問開',
  '閉王玉国谷史使台始治道質',
  '星持待特文雪合答皿親虫験',
  '毎海心場後勉晩銀洋遅様会',
  '雲交県白宿夏原私広売青晴',
  '静運重動働主住飯服通家才',
  '語部村府油画黄教考計園遠',
  '図前経軽寒同区細思春短然',
  '馬歴世室屋速赤衣駅昼楽薬',
  '号写品強弟弱去声番妻船送',
  '緑宅着研不冬終市姉館急発',
  '済試鉄育鳴',
);

/** N3 — 375 chữ. */
export const KANJI_N3: readonly string[] = rows(
  '回向匹面失和厚存在肯信許',
  '件念冷介断歯神伸保意億氷',
  '永位泣活昨級吸全欲浴容首',
  '負敗則側測員性産等記起副',
  '福富支技相箱想拾給血塩温',
  '仲判険検皮彼仕必湯陽幼粉',
  '貧菜良娘根退達芸絵転伝効',
  '算泊優線願仏身続情争庫軍',
  '連求球救種注柱辞幸反返坂',
  '板報常賞用痛備告造材筆律',
  '建結捨祝税説量童者代袋貸',
  '苦個受授点調可河局翌紹兵',
  '移夢秒央決窓供選帯婦初覚',
  '現規係折液類未末非悲罪息',
  '鼻各格落絡路接努怒干汗岸',
  '平呼職識列例死績積打貯準',
  '進曜濯確観果単戦任実業残',
  '浅消具昔借兆包補議他的約',
  '均談再構婚底愛酔季難予橋',
  '布希定迎卵徒乳礼示表倍対',
  '付守顔由演横率老悪要独困',
  '団冊編亡忘望曲農豊以期欠',
  '次組助査商欧復複取最棒祭',
  '悩勝階労豆頭登喜突涙機暖',
  '机築枚燃易探深禁賛葉倒寝',
  '疑術州順流焼束恋変訳君笑',
  '危犯器引第費法飛戸能久事',
  '関舟程直置植録押無座卒差',
  '綿形型杯否満留貿逆官管追',
  '師指感認旧児度席成械式収',
  '担洗熱陸巨臣設投役段缶候',
  '角解島',
);

export const KANJI_BY_LEVEL = {
  N5: KANJI_N5,
  N4: KANJI_N4,
  N3: KANJI_N3,
} as const;
