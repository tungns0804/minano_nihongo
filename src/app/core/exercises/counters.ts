/**
 * Bài tập "Số đếm & trợ số từ" — số đếm, trợ số từ (助数詞), ngày tháng và các cách
 * đọc biến âm.
 *
 * Dữ liệu viết TAY từng cách đọc chứ không suy ra bằng luật: luật biến âm của tiếng
 * Nhật có quá nhiều ngoại lệ (3分 là さんぷん chứ không phải さんぶん như 3本 → さんぼん,
 * 6冊 giữ nguyên ろくさつ, 4時 là よじ…) — một bộ sinh tự động sai một chỗ là dạy sai
 * cho người học mà không ai thấy. Luật chỉ dùng cho hai việc vô hại: phần GHI NHỚ để
 * đọc, và sinh đáp án nhiễu cho trắc nghiệm (`counterDistractors`).
 *
 * Quy ước một dòng `[khoá, cách đọc, bẫy?]`:
 *  - khoá: số, hoặc '何' cho câu hỏi "mấy…".
 *  - cách đọc: các cách đọc ĐÚNG ngăn bằng `|`, cách đầu là cách chuẩn theo sách.
 *    Có dấu `!` ở đâu đó là mục có cách đọc đặc biệt (biến âm / đọc kiểu Nhật / ngoại lệ).
 *  - bẫy: cách đọc SAI hay gặp, ngăn bằng `|` — được ưu tiên làm đáp án nhiễu.
 */

/** Id của bài tập, cũng là khoá ★ và nguồn của thẻ ôn `ct`. */
export const COUNTER_EXERCISE_ID = 'so-dem';

export interface CounterGroup {
  id: string;
  /** Trợ số từ, ví dụ "本". Rỗng với nhóm số đếm thuần. */
  counter: string;
  /** Cách đọc gốc của trợ số từ, ví dụ "ほん". */
  reading: string;
  title: string;
  /** Dùng để đếm cái gì. */
  usage: string;
  /** Các ý cần nhớ của riêng nhóm này. */
  notes: readonly string[];
  /** Có mặt trong bảng biến âm 1·3·4·6·8·10·何 ở đầu trang. */
  inMatrix: boolean;
}

export interface CounterItem {
  /** `<nhóm>:<khoá>`, ví dụ "hon:3", "hon:何" — khoá ★ và khoá lịch ôn, đừng đổi. */
  id: string;
  group: string;
  /** Số đang đếm; null với câu hỏi "mấy". */
  n: number | null;
  /** Cách viết hiển thị, ví dụ "3本". */
  written: string;
  /** Các cách đọc đúng, cách đầu là cách chuẩn. */
  readings: readonly string[];
  /** Câu tiếng Việt tương ứng — dùng cho chiều Việt → Nhật. */
  meaning: string;
  special: boolean;
  traps: readonly string[];
  /** Các cách viết khác cũng chấp nhận khi gõ (三本, 何本…). */
  writtenForms: readonly string[];
}

/** `written` chỉ khai khi cách viết không phải "số + trợ số từ" (10 cái là 十, không phải 10つ). */
type Row = readonly [key: number | '何', readings: string, traps?: string, written?: string];

interface GroupSpec extends CounterGroup {
  /** Câu tiếng Việt, `{n}` là số. */
  vi: string;
  /** Câu tiếng Việt của dòng '何'. */
  viAsk: string;
  /** Biến thể âm của trợ số từ, để sinh đáp án nhiễu. */
  variants: readonly string[];
  /** Cách viết trợ số từ khác cũng chấp nhận khi gõ (ヶ月, カ月…). */
  altCounters?: readonly string[];
  rows: readonly Row[];
}

const GROUPS: readonly GroupSpec[] = [
  // ── Đồ vật & người ────────────────────────────────────────────────────
  {
    id: 'tsu',
    counter: 'つ',
    reading: 'つ',
    title: 'Đồ vật nói chung (đếm kiểu Nhật)',
    usage: 'Đồ vật không rõ hình dạng, tuổi trẻ nhỏ, món ăn khi gọi món. Chỉ đếm tới 10.',
    notes: [
      'Dùng cách đọc thuần Nhật (訓読み), không dùng いち・に・さん.',
      'Từ 2 đến 9, cứ lấy âm đầu rồi thêm っつ hoặc つ: ふ→ふたつ, み→みっつ, よ→よっつ, む→むっつ, や→やっつ.',
      'Số 10 là とお — KHÔNG có つ. Từ 11 trở lên quay về cách đếm thường: じゅういち…',
      'Hỏi "mấy cái" dùng いくつ.',
    ],
    inMatrix: false,
    vi: '{n} cái (đồ vật nói chung)',
    viAsk: 'mấy cái? (đồ vật nói chung)',
    variants: ['つ'],
    rows: [
      [1, 'ひとつ!', 'いちつ|ひとっつ'],
      [2, 'ふたつ!', 'につ|ふたっつ'],
      [3, 'みっつ!', 'みつ|さんつ'],
      [4, 'よっつ!', 'よつ|よんつ'],
      [5, 'いつつ!', 'いつ|ごつ'],
      [6, 'むっつ!', 'むつ|ろっつ'],
      [7, 'ななつ!', 'なつ|しちつ'],
      [8, 'やっつ!', 'やつ|はっつ'],
      [9, 'ここのつ!', 'ここつ|きゅうつ'],
      [10, 'とお!', 'とおつ|じゅっつ', '十'],
    ],
  },
  {
    id: 'nin',
    counter: '人',
    reading: 'にん',
    title: 'Người',
    usage: 'Đếm người.',
    notes: [
      '1 người ひとり, 2 người ふたり — đọc kiểu Nhật, chỉ hai số này.',
      'Từ 3 trở đi là số + にん: さんにん, ごにん…',
      '4 người là よにん — KHÔNG phải よんにん hay しにん.',
      '7 người: しちにん hoặc ななにん đều dùng.',
    ],
    inMatrix: false,
    vi: '{n} người',
    viAsk: 'mấy người?',
    variants: ['にん', 'り'],
    rows: [
      [1, 'ひとり!', 'いちにん|ひとにん'],
      [2, 'ふたり!', 'ににん|ふたにん'],
      [3, 'さんにん'],
      [4, 'よにん!', 'よんにん|しにん'],
      [5, 'ごにん'],
      [6, 'ろくにん'],
      [7, 'しちにん|ななにん'],
      [8, 'はちにん'],
      [9, 'きゅうにん'],
      [10, 'じゅうにん'],
      ['何', 'なんにん'],
    ],
  },
  {
    id: 'ko',
    counter: '個',
    reading: 'こ',
    title: 'Vật nhỏ, tròn',
    usage: 'Táo, trứng, kẹo, cục tẩy, hộp nhỏ…',
    notes: [
      'Hàng か: số 1, 6, 8, 10 thêm っ — いっこ, ろっこ, はっこ, じゅっこ.',
      'Âm こ không bao giờ đục: さんこ, なんこ (không có さんご).',
    ],
    inMatrix: true,
    vi: '{n} cái (vật nhỏ, tròn)',
    viAsk: 'mấy cái? (vật nhỏ, tròn)',
    variants: ['こ', 'ご'],
    rows: [
      [1, 'いっこ!', 'いちこ'],
      [2, 'にこ'],
      [3, 'さんこ', 'さんご'],
      [4, 'よんこ'],
      [5, 'ごこ'],
      [6, 'ろっこ!', 'ろくこ'],
      [7, 'ななこ'],
      [8, 'はっこ!|はちこ'],
      [9, 'きゅうこ'],
      [10, 'じゅっこ!|じっこ', 'じゅうこ'],
      ['何', 'なんこ', 'なんご'],
    ],
  },
  {
    id: 'hon',
    counter: '本',
    reading: 'ほん',
    title: 'Vật dài',
    usage: 'Bút, chai, ô, cây, cà vạt, con đường, bộ phim…',
    notes: [
      '1, 6, 8, 10 → ぽん (âm bật): いっぽん, ろっぽん, はっぽん, じゅっぽん.',
      '3 và 何 → ぼん (âm đục): さんぼん, なんぼん.',
      'Còn lại giữ ほん: にほん, よんほん, ごほん, ななほん, きゅうほん.',
    ],
    inMatrix: true,
    vi: '{n} cây/chai (vật dài)',
    viAsk: 'mấy cây/chai? (vật dài)',
    variants: ['ほん', 'ぼん', 'ぽん'],
    rows: [
      [1, 'いっぽん!'],
      [2, 'にほん'],
      [3, 'さんぼん!'],
      [4, 'よんほん'],
      [5, 'ごほん'],
      [6, 'ろっぽん!'],
      [7, 'ななほん'],
      [8, 'はっぽん!|はちほん'],
      [9, 'きゅうほん'],
      [10, 'じゅっぽん!|じっぽん'],
      ['何', 'なんぼん!'],
    ],
  },
  {
    id: 'mai',
    counter: '枚',
    reading: 'まい',
    title: 'Vật mỏng, phẳng',
    usage: 'Giấy, vé, tem, áo sơ mi, đĩa, ảnh…',
    notes: [
      'Hàng ま không biến âm: chỉ cần ghép số + まい.',
      'Chọn đúng cách đọc của số: 4 よんまい, 7 ななまい, 9 きゅうまい.',
    ],
    inMatrix: true,
    vi: '{n} tờ/tấm (vật mỏng)',
    viAsk: 'mấy tờ/tấm? (vật mỏng)',
    variants: ['まい'],
    rows: [
      [1, 'いちまい', 'いっまい'],
      [2, 'にまい'],
      [3, 'さんまい'],
      [4, 'よんまい', 'しまい|よまい'],
      [5, 'ごまい'],
      [6, 'ろくまい'],
      [7, 'ななまい', 'しちまい'],
      [8, 'はちまい'],
      [9, 'きゅうまい', 'くまい'],
      [10, 'じゅうまい'],
      ['何', 'なんまい'],
    ],
  },
  {
    id: 'dai',
    counter: '台',
    reading: 'だい',
    title: 'Máy móc, xe cộ',
    usage: 'Ô tô, xe đạp, máy tính, tivi, máy giặt…',
    notes: ['Hàng だ không biến âm: số + だい.'],
    inMatrix: true,
    vi: '{n} chiếc (máy móc, xe)',
    viAsk: 'mấy chiếc? (máy móc, xe)',
    variants: ['だい'],
    rows: [
      [1, 'いちだい', 'いっだい'],
      [2, 'にだい'],
      [3, 'さんだい'],
      [4, 'よんだい', 'しだい|よだい'],
      [5, 'ごだい'],
      [6, 'ろくだい'],
      [7, 'ななだい'],
      [8, 'はちだい'],
      [9, 'きゅうだい'],
      [10, 'じゅうだい'],
      ['何', 'なんだい'],
    ],
  },
  {
    id: 'satsu',
    counter: '冊',
    reading: 'さつ',
    title: 'Sách, vở',
    usage: 'Sách, vở, tạp chí, từ điển…',
    notes: [
      'Hàng さ: 1, 8, 10 thêm っ — いっさつ, はっさつ, じゅっさつ.',
      'Số 6 KHÔNG đổi: ろくさつ (khác hàng か / は).',
      'Âm さつ không đục: さんさつ, なんさつ.',
    ],
    inMatrix: true,
    vi: '{n} quyển (sách, vở)',
    viAsk: 'mấy quyển?',
    variants: ['さつ', 'ざつ'],
    rows: [
      [1, 'いっさつ!', 'いちさつ'],
      [2, 'にさつ'],
      [3, 'さんさつ', 'さんざつ'],
      [4, 'よんさつ'],
      [5, 'ごさつ'],
      [6, 'ろくさつ', 'ろっさつ'],
      [7, 'ななさつ'],
      [8, 'はっさつ!', 'はちさつ'],
      [9, 'きゅうさつ'],
      [10, 'じゅっさつ!|じっさつ'],
      ['何', 'なんさつ', 'なんざつ'],
    ],
  },
  {
    id: 'hai',
    counter: '杯',
    reading: 'はい',
    title: 'Cốc, chén, bát',
    usage: 'Cốc nước, chén cơm, tách cà phê, bát mì…',
    notes: ['Giống 本: 1, 6, 8, 10 → ぱい; 3 và 何 → ばい; còn lại はい.'],
    inMatrix: true,
    vi: '{n} cốc/chén',
    viAsk: 'mấy cốc/chén?',
    variants: ['はい', 'ばい', 'ぱい'],
    rows: [
      [1, 'いっぱい!'],
      [2, 'にはい'],
      [3, 'さんばい!'],
      [4, 'よんはい'],
      [5, 'ごはい'],
      [6, 'ろっぱい!'],
      [7, 'ななはい'],
      [8, 'はっぱい!|はちはい'],
      [9, 'きゅうはい'],
      [10, 'じゅっぱい!|じっぱい'],
      ['何', 'なんばい!'],
    ],
  },
  {
    id: 'hiki',
    counter: '匹',
    reading: 'ひき',
    title: 'Con vật nhỏ',
    usage: 'Chó, mèo, cá, côn trùng…',
    notes: ['Giống 本: 1, 6, 8, 10 → ぴき; 3 và 何 → びき; còn lại ひき.'],
    inMatrix: true,
    vi: '{n} con (vật nhỏ)',
    viAsk: 'mấy con? (vật nhỏ)',
    variants: ['ひき', 'びき', 'ぴき'],
    rows: [
      [1, 'いっぴき!'],
      [2, 'にひき'],
      [3, 'さんびき!'],
      [4, 'よんひき'],
      [5, 'ごひき'],
      [6, 'ろっぴき!'],
      [7, 'ななひき'],
      [8, 'はっぴき!|はちひき'],
      [9, 'きゅうひき'],
      [10, 'じゅっぴき!|じっぴき'],
      ['何', 'なんびき!'],
    ],
  },
  {
    id: 'soku',
    counter: '足',
    reading: 'そく',
    title: 'Đôi giày, tất',
    usage: 'Giày, dép, tất…',
    notes: [
      'Hàng さ: 1, 8, 10 thêm っ (6 giữ ろく) — giống 冊.',
      'Nhưng 3 và 何 đục thành ぞく: さんぞく, なんぞく.',
    ],
    inMatrix: true,
    vi: '{n} đôi (giày, tất)',
    viAsk: 'mấy đôi?',
    variants: ['そく', 'ぞく'],
    rows: [
      [1, 'いっそく!'],
      [2, 'にそく'],
      [3, 'さんぞく!'],
      [4, 'よんそく'],
      [5, 'ごそく'],
      [6, 'ろくそく', 'ろっそく'],
      [7, 'ななそく'],
      [8, 'はっそく!'],
      [9, 'きゅうそく'],
      [10, 'じゅっそく!|じっそく'],
      ['何', 'なんぞく!'],
    ],
  },
  {
    id: 'ken',
    counter: '軒',
    reading: 'けん',
    title: 'Ngôi nhà, cửa hàng',
    usage: 'Nhà, cửa hàng, quán…',
    notes: ['Hàng か: 1, 6, 8, 10 thêm っ; 3 và 何 đục thành げん — giống 階.'],
    inMatrix: true,
    vi: '{n} căn (nhà, cửa hàng)',
    viAsk: 'mấy căn?',
    variants: ['けん', 'げん'],
    rows: [
      [1, 'いっけん!'],
      [2, 'にけん'],
      [3, 'さんげん!'],
      [4, 'よんけん'],
      [5, 'ごけん'],
      [6, 'ろっけん!'],
      [7, 'ななけん'],
      [8, 'はっけん!|はちけん'],
      [9, 'きゅうけん'],
      [10, 'じゅっけん!|じっけん'],
      ['何', 'なんげん!'],
    ],
  },
  // ── Lần, tầng, tuổi ───────────────────────────────────────────────────
  {
    id: 'kai',
    counter: '回',
    reading: 'かい',
    title: 'Số lần',
    usage: '1 lần, 2 lần… (回)',
    notes: [
      'Hàng か: 1, 6, 8, 10 thêm っ — いっかい, ろっかい, はっかい, じゅっかい.',
      '3 lần là さんかい (không đục) — khác với tầng 3 さんがい.',
    ],
    inMatrix: true,
    vi: '{n} lần',
    viAsk: 'mấy lần?',
    variants: ['かい', 'がい'],
    rows: [
      [1, 'いっかい!'],
      [2, 'にかい'],
      [3, 'さんかい', 'さんがい'],
      [4, 'よんかい'],
      [5, 'ごかい'],
      [6, 'ろっかい!'],
      [7, 'ななかい'],
      [8, 'はっかい!|はちかい'],
      [9, 'きゅうかい'],
      [10, 'じゅっかい!|じっかい'],
      ['何', 'なんかい', 'なんがい'],
    ],
  },
  {
    id: 'gai',
    counter: '階',
    reading: 'かい',
    title: 'Tầng lầu',
    usage: 'Tầng 1, tầng 2… của toà nhà (階)',
    notes: [
      'Giống 回 nhưng 3 và 何 đục: さんがい, なんがい.',
      'Mẹo: lên tầng 3 phải "gắng" (が) — さんがい; còn 3 lần thì cứ さんかい.',
      'Tầng hầm 1 là ちか いっかい (地下1階).',
    ],
    inMatrix: true,
    vi: 'tầng {n}',
    viAsk: 'tầng mấy?',
    variants: ['かい', 'がい'],
    rows: [
      [1, 'いっかい!'],
      [2, 'にかい'],
      [3, 'さんがい!|さんかい'],
      [4, 'よんかい'],
      [5, 'ごかい'],
      [6, 'ろっかい!'],
      [7, 'ななかい'],
      [8, 'はっかい!|はちかい'],
      [9, 'きゅうかい'],
      [10, 'じゅっかい!|じっかい'],
      ['何', 'なんがい!|なんかい'],
    ],
  },
  {
    id: 'sai',
    counter: '歳',
    reading: 'さい',
    title: 'Tuổi',
    usage: 'Tuổi của người (歳, cũng viết 才)',
    notes: [
      'Hàng さ: 1, 8, 10 thêm っ — いっさい, はっさい, じゅっさい; 6 vẫn ろくさい.',
      '20 tuổi là はたち — cách đọc riêng, tuổi trưởng thành.',
      'Hỏi tuổi: なんさい, lịch sự hơn: おいくつ.',
    ],
    inMatrix: true,
    vi: '{n} tuổi',
    viAsk: 'mấy tuổi?',
    variants: ['さい', 'ざい'],
    altCounters: ['才'],
    rows: [
      [1, 'いっさい!', 'いちさい'],
      [2, 'にさい'],
      [3, 'さんさい', 'さんざい'],
      [4, 'よんさい'],
      [5, 'ごさい'],
      [6, 'ろくさい', 'ろっさい'],
      [7, 'ななさい'],
      [8, 'はっさい!', 'はちさい'],
      [9, 'きゅうさい'],
      [10, 'じゅっさい!|じっさい'],
      [20, 'はたち!|にじゅっさい|にじっさい', 'はつか|にじゅうさい'],
      ['何', 'なんさい|おいくつ'],
    ],
  },
  // ── Thời gian ─────────────────────────────────────────────────────────
  {
    id: 'ji',
    counter: '時',
    reading: 'じ',
    title: 'Giờ',
    usage: 'Giờ trên đồng hồ: 1 giờ, 2 giờ… (時)',
    notes: [
      'Ba giờ phải nhớ: 4時 よじ, 7時 しちじ, 9時 くじ.',
      'Mẹo: "4 giờ, 7 giờ, 9 giờ" — よ・しち・く, ngược hẳn với thói quen よん・なな・きゅう.',
      'Khoảng thời gian (mấy tiếng) dùng 時間: よじかん, しちじかん, くじかん — cũng ba số này.',
    ],
    inMatrix: false,
    vi: '{n} giờ (trên đồng hồ)',
    viAsk: 'mấy giờ?',
    variants: ['じ'],
    rows: [
      [1, 'いちじ', 'いっじ'],
      [2, 'にじ'],
      [3, 'さんじ'],
      [4, 'よじ!', 'よんじ|しじ'],
      [5, 'ごじ'],
      [6, 'ろくじ'],
      [7, 'しちじ!|ななじ', 'なのじ'],
      [8, 'はちじ'],
      [9, 'くじ!', 'きゅうじ'],
      [10, 'じゅうじ'],
      [11, 'じゅういちじ'],
      [12, 'じゅうにじ'],
      ['何', 'なんじ'],
    ],
  },
  {
    id: 'fun',
    counter: '分',
    reading: 'ふん',
    title: 'Phút',
    usage: 'Phút (分)',
    notes: [
      'Ngoại lệ của hàng は: 1, 3, 4, 6, 8, 10, 何 đều thành ぷん.',
      'Chỉ 2, 5, 7, 9 giữ ふん: にふん, ごふん, ななふん, きゅうふん.',
      'Mẹo: "2-5-7-9 thổi ふん, còn lại nổ ぷん". 3分 là さんぷん, không phải さんぶん.',
      '30 phút: さんじゅっぷん hoặc はん (半).',
    ],
    inMatrix: true,
    vi: '{n} phút',
    viAsk: 'mấy phút?',
    variants: ['ふん', 'ぶん', 'ぷん'],
    rows: [
      [1, 'いっぷん!'],
      [2, 'にふん'],
      [3, 'さんぷん!', 'さんぶん'],
      [4, 'よんぷん!', 'よんふん'],
      [5, 'ごふん'],
      [6, 'ろっぷん!'],
      [7, 'ななふん'],
      [8, 'はっぷん!|はちふん'],
      [9, 'きゅうふん'],
      [10, 'じゅっぷん!|じっぷん'],
      [30, 'さんじゅっぷん!|さんじっぷん|はん', 'さんじゅうふん'],
      ['何', 'なんぷん!', 'なんぶん|なんふん'],
    ],
  },
  {
    id: 'nichi',
    counter: '日',
    reading: 'にち',
    title: 'Ngày trong tháng',
    usage: 'Mùng 1, ngày 2… (日)',
    notes: [
      'Mùng 1 là ついたち — riêng biệt (1日 đọc いちにち thì nghĩa là "một ngày").',
      'Ngày 2 → 10 đọc kiểu Nhật, giống cách đếm ～つ bỏ つ thêm か: ふつか, みっか, よっか, いつか, むいか, なのか, ようか, ここのか, とおか.',
      'Lạ nhất: 6 むいか, 8 ようか (đừng nhầm với よっか = ngày 4).',
      'Ngày 14 じゅうよっか, 24 にじゅうよっか (mượn よっか); ngày 20 はつか.',
      'Các ngày còn lại là số + にち: 11 じゅういちにち, 17 じゅうしちにち, 19 じゅうくにち.',
      'Đếm SỐ NGÀY (2 ngày, 3 ngày…) cũng dùng đúng các cách đọc này: ふつか = mùng 2 hoặc 2 ngày.',
    ],
    inMatrix: false,
    vi: 'ngày {n} (trong tháng)',
    viAsk: 'ngày mấy?',
    variants: ['にち', 'か'],
    rows: [
      [1, 'ついたち!', 'いちにち|いっか'],
      [2, 'ふつか!', 'ににち|ふたか'],
      [3, 'みっか!', 'さんにち|みか'],
      [4, 'よっか!', 'よんにち|ようか'],
      [5, 'いつか!', 'ごにち|いっか'],
      [6, 'むいか!', 'ろくにち|むっか'],
      [7, 'なのか!', 'しちにち|ななか'],
      [8, 'ようか!', 'はちにち|よっか'],
      [9, 'ここのか!', 'くにち|ここか'],
      [10, 'とおか!', 'じゅうにち|とっか'],
      [11, 'じゅういちにち'],
      [14, 'じゅうよっか!', 'じゅうよんにち|じゅうよにち'],
      [17, 'じゅうしちにち|じゅうななにち', 'じゅうなのか'],
      [19, 'じゅうくにち|じゅうきゅうにち', 'じゅうここのか'],
      [20, 'はつか!', 'にじゅうにち|はたち'],
      [24, 'にじゅうよっか!', 'にじゅうよんにち|にじゅうよにち'],
      ['何', 'なんにち', 'なんか|いくか'],
    ],
  },
  {
    id: 'gatsu',
    counter: '月',
    reading: 'がつ',
    title: 'Tháng',
    usage: 'Tháng 1 → tháng 12 (月)',
    notes: [
      'Ba tháng phải nhớ: 4月 しがつ, 7月 しちがつ, 9月 くがつ.',
      'Tháng 7 trong văn nói đôi khi nghe なながつ, nhưng sách dạy しちがつ.',
      'Mẹo: tháng "し・しち・く" — đúng ba số mà giờ cũng đổi (4時 よじ, 7時 しちじ, 9時 くじ), riêng tháng 4 là し chứ không phải よ.',
    ],
    inMatrix: false,
    vi: 'tháng {n}',
    viAsk: 'tháng mấy?',
    variants: ['がつ'],
    rows: [
      [1, 'いちがつ', 'いっがつ'],
      [2, 'にがつ'],
      [3, 'さんがつ'],
      [4, 'しがつ!', 'よんがつ|よがつ'],
      [5, 'ごがつ'],
      [6, 'ろくがつ'],
      [7, 'しちがつ!|なながつ', 'しちげつ|ななげつ'],
      [8, 'はちがつ'],
      [9, 'くがつ!', 'きゅうがつ'],
      [10, 'じゅうがつ'],
      [11, 'じゅういちがつ'],
      [12, 'じゅうにがつ'],
      ['何', 'なんがつ'],
    ],
  },
  {
    id: 'kagetsu',
    counter: 'か月',
    reading: 'かげつ',
    title: 'Số tháng (khoảng thời gian)',
    usage: '1 tháng, 2 tháng… — khoảng thời gian (か月, cũng viết ヶ月)',
    notes: [
      'Khác 月 (tháng mấy): đây là "bao nhiêu tháng".',
      'Hàng か: 1, 6, 8, 10 thêm っ — いっかげつ, ろっかげつ, はっかげつ, じゅっかげつ.',
    ],
    inMatrix: true,
    vi: '{n} tháng (khoảng thời gian)',
    viAsk: 'mấy tháng? (khoảng thời gian)',
    variants: ['かげつ'],
    altCounters: ['ヶ月', 'カ月', 'ヵ月', 'ケ月'],
    rows: [
      [1, 'いっかげつ!', 'いちかげつ|いちがつ'],
      [2, 'にかげつ'],
      [3, 'さんかげつ'],
      [4, 'よんかげつ'],
      [5, 'ごかげつ'],
      [6, 'ろっかげつ!', 'ろくかげつ'],
      [7, 'ななかげつ'],
      [8, 'はっかげつ!|はちかげつ'],
      [9, 'きゅうかげつ'],
      [10, 'じゅっかげつ!|じっかげつ'],
      ['何', 'なんかげつ'],
    ],
  },
  {
    id: 'nen',
    counter: '年',
    reading: 'ねん',
    title: 'Năm',
    usage: 'Số năm, năm học (年)',
    notes: [
      '4年 là よねん (giống よにん, よじ).',
      '7年 ななねん / しちねん, 9年 きゅうねん (くねん ít dùng).',
    ],
    inMatrix: false,
    vi: '{n} năm',
    viAsk: 'mấy năm?',
    variants: ['ねん'],
    rows: [
      [1, 'いちねん'],
      [2, 'にねん'],
      [3, 'さんねん'],
      [4, 'よねん!', 'よんねん|しねん'],
      [5, 'ごねん'],
      [6, 'ろくねん'],
      [7, 'ななねん|しちねん'],
      [8, 'はちねん'],
      [9, 'きゅうねん|くねん'],
      [10, 'じゅうねん'],
      ['何', 'なんねん'],
    ],
  },
  // ── Số & tiền ─────────────────────────────────────────────────────────
  {
    id: 'so',
    counter: '',
    reading: '',
    title: 'Số đếm: trăm, nghìn, vạn',
    usage: 'Số lớn: 百 (trăm), 千 (nghìn), 万 (vạn = 10.000)',
    notes: [
      '4, 7, 9 có hai cách đọc: よん/し, なな/しち, きゅう/く. Khi đếm số thường dùng よん, なな, きゅう.',
      'Trăm: 300 さんびゃく, 600 ろっぴゃく, 800 はっぴゃく, 何百 なんびゃく — giống luật 本 (3 đục, 6 và 8 bật).',
      'Nghìn: 3000 さんぜん, 8000 はっせん, 何千 なんぜん.',
      '100 là ひゃく, 1000 là せん (không nói いち), nhưng 10.000 phải là いちまん.',
      'Người Nhật đếm theo vạn (4 chữ số): 10.000 = 1万, 100.000 = 10万, 1.000.000 = 100万.',
    ],
    inMatrix: false,
    vi: '{n}',
    viAsk: 'bao nhiêu?',
    variants: [],
    rows: [],
  },
  {
    id: 'en',
    counter: '円',
    reading: 'えん',
    title: 'Tiền Yên',
    usage: 'Giá tiền (円)',
    notes: [
      '4円 là よえん (không phải よんえん).',
      'Hàng trăm, nghìn biến âm như số đếm thường: さんびゃくえん, ろっぴゃくえん, さんぜんえん, いちまんえん.',
      'Hỏi giá: いくら (bao nhiêu tiền).',
    ],
    inMatrix: false,
    vi: '{n} yên',
    viAsk: 'bao nhiêu yên?',
    variants: ['えん'],
    rows: [
      [1, 'いちえん'],
      [4, 'よえん!', 'よんえん|しえん'],
      [5, 'ごえん'],
      [10, 'じゅうえん'],
      [100, 'ひゃくえん', 'いちひゃくえん|いっぴゃくえん'],
      [300, 'さんびゃくえん!', 'さんひゃくえん|さんぴゃくえん'],
      [600, 'ろっぴゃくえん!', 'ろくひゃくえん|ろっひゃくえん'],
      [800, 'はっぴゃくえん!', 'はちひゃくえん|はっひゃくえん'],
      [1000, 'せんえん', 'いっせんえん|いちせんえん'],
      [3000, 'さんぜんえん!', 'さんせんえん'],
      [8000, 'はっせんえん!', 'はちせんえん|はっぜんえん'],
      [10000, 'いちまんえん!', 'まんえん'],
    ],
  },
];

/**
 * Nhóm số đếm thuần viết riêng: mỗi số có cách viết và câu tiếng Việt của riêng nó,
 * không theo khuôn "{n} + trợ số từ" của các nhóm kia.
 */
const NUMBER_ROWS: readonly (readonly [written: string, n: number | null, readings: string, meaning: string, traps: string])[] = [
  ['4', 4, 'よん|し', 'số 4', 'よ|しい'],
  ['7', 7, 'なな|しち', 'số 7', 'な|しちい'],
  ['9', 9, 'きゅう|く', 'số 9', 'きゅ|くう'],
  ['14', 14, 'じゅうよん|じゅうし', 'số 14', 'じゅうよ|じゅっよん'],
  ['17', 17, 'じゅうなな|じゅうしち', 'số 17', 'じゅうなの|じゅっなな'],
  ['19', 19, 'じゅうきゅう|じゅうく', 'số 19', 'じゅうここの|じゅっきゅう'],
  ['100', 100, 'ひゃく!', 'một trăm', 'いちひゃく|いっぴゃく|ひゃっく'],
  ['300', 300, 'さんびゃく!', 'ba trăm', 'さんひゃく|さんぴゃく|みひゃく'],
  ['600', 600, 'ろっぴゃく!', 'sáu trăm', 'ろくひゃく|ろっひゃく|ろくびゃく'],
  ['800', 800, 'はっぴゃく!', 'tám trăm', 'はちひゃく|はっひゃく|はちびゃく'],
  ['何百', null, 'なんびゃく!', 'mấy trăm', 'なんひゃく|なんぴゃく|いくひゃく'],
  ['1000', 1000, 'せん!', 'một nghìn', 'いっせん|いちせん|せんい'],
  ['3000', 3000, 'さんぜん!', 'ba nghìn', 'さんせん|さんっせん|みせん'],
  ['8000', 8000, 'はっせん!', 'tám nghìn', 'はちせん|はっぜん|はちぜん'],
  ['何千', null, 'なんぜん!', 'mấy nghìn', 'なんせん|なんっせん|いくせん'],
  ['10000', 10000, 'いちまん!', 'mười nghìn (1 vạn)', 'まん|じゅうせん|いっまん'],
  ['100000', 100000, 'じゅうまん', 'một trăm nghìn (10 vạn)', 'ひゃくせん|じゅっまん|いちじゅうまん'],
  ['1000000', 1000000, 'ひゃくまん', 'một triệu (100 vạn)', 'いちひゃくまん|せんせん|ひゃっまん'],
];

/** "123" → "百二十三". Đủ dùng cho các số trong bài (dưới một trăm triệu). */
export function kanjiNumber(n: number): string {
  const digits = '〇一二三四五六七八九';
  const under10k = (value: number): string => {
    let out = '';
    for (const [unit, ch] of [[1000, '千'], [100, '百'], [10, '十']] as const) {
      const d = Math.floor(value / unit) % 10;
      if (d > 0) out += (d > 1 ? digits[d] : '') + ch;
    }
    const d = value % 10;
    return d > 0 ? out + digits[d] : out;
  };
  if (n === 0) return digits[0];
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  return (man > 0 ? `${man === 1 ? '一' : under10k(man)}万` : '') + under10k(rest);
}

function splitList(text: string | undefined): string[] {
  return (text ?? '')
    .split('|')
    .map((item) => item.replace(/!/g, '').trim())
    .filter((item) => item.length > 0);
}

function buildItems(): CounterItem[] {
  const items: CounterItem[] = [];
  for (const group of GROUPS) {
    if (group.id === 'so') {
      for (const [written, n, readings, meaning, traps] of NUMBER_ROWS) {
        const kanji = n === null ? written : kanjiNumber(n);
        items.push({
          id: `so:${written}`,
          group: 'so',
          n,
          written: n === null ? written : n.toLocaleString('en-US'),
          readings: splitList(readings),
          meaning,
          special: readings.includes('!'),
          traps: splitList(traps),
          writtenForms: [...new Set([written, kanji])],
        });
      }
      continue;
    }

    const counters = [group.counter, ...(group.altCounters ?? [])];
    for (const [key, readings, traps, written] of group.rows) {
      const n = key === '何' ? null : key;
      const numberForms = n === null ? ['何'] : [String(n), kanjiNumber(n)];
      const defaultForms = numberForms.flatMap((num) => counters.map((counter) => `${num}${counter}`));
      items.push({
        id: `${group.id}:${key}`,
        group: group.id,
        n,
        written: written ?? `${n === null ? '何' : n}${group.counter}`,
        readings: splitList(readings),
        meaning: n === null ? group.viAsk : group.vi.replace('{n}', String(n)),
        special: readings.includes('!'),
        traps: splitList(traps),
        writtenForms: written ? [written, ...numberForms] : defaultForms,
      });
    }
  }
  return items;
}

/** Các nhóm theo thứ tự hiển thị (bỏ phần dữ liệu thô). */
export const COUNTER_GROUPS: readonly CounterGroup[] = GROUPS.map(
  ({ id, counter, reading, title, usage, notes, inMatrix }) => ({
    id,
    counter,
    reading,
    title,
    usage,
    notes,
    inMatrix,
  }),
);

export const COUNTER_ITEMS: readonly CounterItem[] = buildItems();

export function counterById(id: string): CounterItem | undefined {
  return COUNTER_ITEMS.find((item) => item.id === id);
}

export function counterGroupOf(item: CounterItem): CounterGroup {
  return COUNTER_GROUPS.find((group) => group.id === item.group) ?? COUNTER_GROUPS[0];
}

/**
 * Quy tắc chung, hiện ở đầu trang. Mỗi mục là một ý gọn kèm ví dụ, đủ để nhìn bảng
 * biến âm là tự suy ra được phần lớn cách đọc.
 */
export const COUNTER_RULES: readonly { title: string; body: readonly string[] }[] = [
  {
    title: 'Bốn số hay "co lại": 1 · 6 · 8 · 10',
    body: [
      'Khi trợ số từ bắt đầu bằng hàng か・さ・た・は, các số いち・ろく・はち・じゅう rút gọn thành いっ・ろっ・はっ・じゅっ (âm ngắt っ).',
      'Ví dụ: いっこ, ろっこ, はっこ, じゅっこ · いっさつ, はっさつ, じゅっさつ.',
      'Riêng hàng さ (冊, 歳, 足): số 6 KHÔNG co — ろくさつ, ろくさい.',
    ],
  },
  {
    title: 'Hàng は (本・杯・匹・分・百): "1-6-8-10 bật P, 3 và 何 đục B"',
    body: [
      'Sau âm ngắt っ, は biến thành ぱ (âm bật): いっぽん, ろっぽん, はっぽん, じゅっぽん.',
      'Sau ん của さん và なん, は biến thành ば (âm đục): さんぼん, なんぼん, さんびゃく.',
      'Ngoại lệ phải thuộc: 分 — 3 và 4 cũng bật: さんぷん, よんぷん, なんぷん.',
    ],
  },
  {
    title: 'Sau さん・なん thường bị đục',
    body: [
      'さん + ほん → さんぼん, さん + かい(階) → さんがい, さん + けん → さんげん, さん + そく → さんぞく, さん + せん → さんぜん.',
      'Nhưng không phải lúc nào cũng đục: さんかい (3 lần), さんこ, さんさつ, さんさい.',
    ],
  },
  {
    title: 'Số 4 · 7 · 9 — chọn よん/し, なな/しち, きゅう/く',
    body: [
      'Mặc định dùng よん, なな, きゅう.',
      '4 là よ trước 人・時・年・円: よにん, よじ, よねん, よえん. Riêng tháng 4 là しがつ.',
      '7 là しち ở 7時 しちじ, 7月 しちがつ. 9 là く ở 9時 くじ, 9月 くがつ.',
    ],
  },
  {
    title: 'Những cách đọc "học thuộc lòng"',
    body: [
      'Người: ひとり, ふたり. Tuổi 20: はたち. Mùng 1: ついたち. Ngày 20: はつか.',
      'Ngày 2 → 10: ふつか, みっか, よっか, いつか, むいか, なのか, ようか, ここのか, とおか — đếm theo ひとつ・ふたつ… (み→みっか, む→むいか, や→ようか).',
      'Ngày 14 và 24 mượn よっか: じゅうよっか, にじゅうよっか.',
      'Đồ vật kiểu Nhật: ひとつ … ここのつ, とお; hỏi いくつ.',
    ],
  },
  {
    title: 'Không biến âm: 枚・台・時・月・人(từ 3)・円',
    body: [
      'Trợ số từ bắt đầu bằng hàng ま・だ・じ・が・な・あ thì chỉ việc ghép số + trợ số từ: いちまい, いちだい, いちじ.',
      'Chỉ cần chọn đúng cách đọc của 4, 7, 9 cho từng nhóm.',
    ],
  },
];

// ── Đáp án nhiễu cho trắc nghiệm ────────────────────────────────────────

/** Các cách đọc (đúng hay sai) của phần số, để ghép thành đáp án nhiễu trông hợp lý. */
const NUMBER_PREFIXES: Record<string, readonly string[]> = {
  1: ['いち', 'いっ'],
  2: ['に'],
  3: ['さん'],
  4: ['よん', 'よ', 'し'],
  5: ['ご'],
  6: ['ろく', 'ろっ'],
  7: ['なな', 'しち'],
  8: ['はち', 'はっ'],
  9: ['きゅう', 'く'],
  10: ['じゅう', 'じゅっ'],
  何: ['なん'],
};

/** Âm ngắt っ chỉ đứng trước hàng か・さ・た・は・ぱ — ghép trước âm khác thì nhìn là biết sai. */
const GEMINATE_OK = /^[かきくけこさしすせそたちつてとはひふへほぱぴぷぺぽ]/;

const VARIANTS_OF: ReadonlyMap<string, readonly string[]> = new Map(
  GROUPS.map((group) => [group.id, group.variants]),
);

/**
 * Tối đa `count` cách đọc sai cho một mục: bẫy viết tay trước, rồi các tổ hợp
 * (cách đọc số × biến âm của trợ số từ), cuối cùng là cách đọc của mục khác cùng nhóm.
 */
export function counterDistractors(
  item: CounterItem,
  count: number,
  random: <T>(items: readonly T[]) => T[],
): string[] {
  const accepted = new Set(item.readings);
  const out: string[] = [];
  const push = (candidates: readonly string[]) => {
    for (const candidate of candidates) {
      if (out.length >= count) return;
      if (!accepted.has(candidate) && !out.includes(candidate)) out.push(candidate);
    }
  };

  push(random(item.traps));

  const prefixes = NUMBER_PREFIXES[item.n === null ? '何' : String(item.n)] ?? [];
  const combos = prefixes.flatMap((prefix) =>
    (VARIANTS_OF.get(item.group) ?? [])
      .filter((variant) => !prefix.endsWith('っ') || GEMINATE_OK.test(variant))
      .map((variant) => prefix + variant),
  );
  push(random(combos));

  const neighbours = COUNTER_ITEMS.filter(
    (other) => other.group === item.group && other.id !== item.id,
  ).map((other) => other.readings[0]);
  push(random(neighbours));

  return out;
}
