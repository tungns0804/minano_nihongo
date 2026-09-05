import type { MessageKey } from '../i18n/messages';
// `import type` chứ không phải import thường: sáu tên này đều là KIỂU, và
// `scripts/verify-n3.mjs` nạp thẳng file này bằng --experimental-strip-types.
// Node chỉ xoá cú pháp kiểu chứ không tra xem tên nào là kiểu, nên một import
// thường sẽ thành lệnh nhập thật lúc chạy rồi ném "does not provide an export".
import type { N3Block, N3Phase, N3Pillar, N3Section, N3Unit, N3UnitSource } from './n3.model';

/**
 * LỘ TRÌNH N3 — NGUỒN SỰ THẬT DUY NHẤT của tab "Tiến độ N3".
 *
 * Mỗi mục học ở đây là MỘT buổi học có thể tích xong. Đơn vị đó không tự nghĩ ra:
 * ba quyển 総まとめ N3 有 trong máy (漢字, 語彙, 読解) đều chia đúng 6 tuần × 7
 * ngày, ngày thứ bảy của mỗi tuần là 実戦問題; quyển 聴解 chia 5 chương. Lấy đúng
 * cách chia của sách làm đơn vị tích thì "đã học xong mục này" là một câu nói có
 * nghĩa xác định, không phải cảm giác.
 *
 * NGUỒN DỮ LIỆU — chỉ bốn file PDF trong `C:\Users\Admin\Downloads\Japanese\N3`:
 *   Nihongo_Soumatome_N3-Kanji.pdf    mục lục ở trang in 4–5
 *   Nihongo_Soumatome_N3-Goi.pdf      mục lục ở trang in 4–5
 *   Nihongo_Soumatome_N3-Dokkai.pdf   mục lục ở trang in 4–5
 *   Nihongo_Soumatome_N3-Choukai.pdf  mục lục ở trang in 4–5
 * Bốn file là ảnh chụp, không có lớp chữ; tiêu đề dưới đây chép tay từ ảnh đã
 * kết xuất. Số trang ghi kèm là SỐ TRANG IN trên sách.
 *
 * HAI LỖ HỔNG NGUỒN, đều cố ý để lộ ra chứ không lấp bằng cách đoán:
 *
 *  1. KHÔNG có quyển 総まとめ N3 文法 trong máy. Trụ ngữ pháp vì thế chỉ có phần
 *     nền N4 lấy từ 皆の日本語 (25 bài đã nạp sẵn trong app), cộng một mục đánh
 *     dấu "chưa có sách" nặng bằng 42 mục — xem `BUNPOU_GAP_WEIGHT`.
 *  2. Phần 聴解 CHỦ ĐỘNG hoãn: chủ dự án đã quyết định lần này không xây phần
 *     luyện nghe. Mục của nó vẫn có mặt đầy đủ để con số không nói dối, nhưng
 *     mặc định nằm ngoài phạm vi tính phần trăm — xem `N3_DEFAULT_OUT_OF_SCOPE`.
 *
 * Văn bản phân tích đi kèm: `LO-TRINH-N3.md` ở gốc dự án.
 */

// ── Mốc thời gian ──────────────────────────────────────────────────────────

/** Ngày thi, theo mốc chủ dự án đặt ra. */
export const N3_EXAM_DATE = '2026-12-10';

/** Ngày bắt đầu lộ trình. */
export const N3_PLAN_START = '2026-09-05';

/**
 * Ngày cuối còn được nạp bài MỚI.
 *
 * Sau ngày này chỉ luyện đề và ôn lại. Nhịp học hằng ngày chia theo mốc này chứ
 * không chia tới hôm thi: dồn bài mới vào ba tuần cuối thì mất luôn phần luyện
 * đề, mà 実戦問題 làm lần đầu bao giờ cũng lộ ra chỗ chưa chắc.
 */
export const N3_LAST_NEW_MATERIAL_DATE = '2026-11-17';

/** Trụ nằm ngoài phạm vi tính phần trăm theo mặc định. */
export const N3_DEFAULT_OUT_OF_SCOPE: readonly N3Pillar[] = ['choukai'];

/**
 * Khối CỐ Ý không có ngày hẹn trong lịch 96 ngày.
 *
 * Ba lý do khác nhau, không gộp được thành một:
 *
 *  - `nen-1` (25 bài từ vựng N5): đã học từ lâu và đã có bài luyện trong app. Ôn
 *    lại thì tốt, nhưng bắt nó chiếm chỗ trong nhịp hằng ngày sẽ đẩy hai tuần đầu
 *    lên 6 buổi mỗi ngày. Để tuỳ sức: tích khi ôn xong.
 *  - `bunpou-2`: chưa có sách, không có gì để hẹn.
 *  - `choukai-*`: chủ dự án đã quyết định lần này không xây phần luyện nghe, và
 *    trong máy không có một file âm thanh nào (quyển 聴解 là sách kèm 2 CD, chỉ
 *    có phần in). Hẹn ngày cho nó thì con số "mấy buổi mỗi ngày" — thứ duy nhất
 *    trên trang dùng để hành động — sẽ cao hơn thực tế khoảng 18%.
 *
 * Danh sách này KHÔNG phải chỗ để quên một khối: `scripts/verify-n3.mjs` đòi mỗi
 * khối có mục tích được phải hoặc nằm trong một giai đoạn, hoặc có tên ở đây.
 */
export const N3_UNSCHEDULED_BLOCKS: readonly string[] = [
  'nen-1',
  'bunpou-2',
  'choukai-1',
  'choukai-2',
  'choukai-3',
  'choukai-4',
  'choukai-5',
];

/**
 * Trọng số của mục "chưa có sách 総まとめ N3 文法".
 *
 * 42 = đúng khuôn 6 tuần × 7 ngày của ba quyển kia. Đây là con số SUY RA từ cách
 * chia của bộ sách, không phải số đọc được từ quyển 文法 (quyển đó không có trong
 * nguồn). Khi có sách thật thì thay mục này bằng 42 mục thật và xoá hằng số này.
 */
export const BUNPOU_GAP_WEIGHT = 42;

// ── Bộ dựng dữ liệu ────────────────────────────────────────────────────────

/**
 * Một dòng mục học: `tiêu đề Nhật|nghĩa tiếng Việt` hoặc thêm `|trang`.
 *
 * Viết thành chuỗi một dòng thay vì object nhiều tầng để soát bằng mắt được: 200
 * mục xếp thành 200 dòng thì đối chiếu với ảnh mục lục là chuyện của một lượt
 * đọc, còn 200 object thì phải cuộn cả nghìn dòng.
 */
type UnitRow = string;

/** Tiêu đề nào là buổi kiểm tra chứ không phải bài mới. */
const TEST_TITLES: readonly string[] = ['実戦問題', 'まとめ問題', '総まとめ問題'];

/**
 * Dựng một tuần/chương.
 *
 * `sources` tra id mục → nguồn + đường dẫn. Mục không có trong bảng đó thì mặc
 * định là `book`: có sách trong máy, chưa nạp thành bài trong app, vẫn học được.
 */
function block(
  prefix: string,
  no: number,
  labelJa: string,
  labelVi: string,
  titleJa: string,
  titleVi: string,
  startPage: number,
  rows: readonly UnitRow[],
  sources: Readonly<Record<string, { source: N3UnitSource; route: string }>> = {},
  defaultSource: N3UnitSource = 'book',
): N3Block {
  return {
    id: `${prefix}-${no}`,
    labelJa,
    labelVi,
    titleJa,
    titleVi,
    startPage,
    units: rows.map((row, index): N3Unit => {
      const [ja, vi, page] = row.split('|');
      const id = `${prefix}-${no}-${index + 1}`;
      const override = sources[id];
      return {
        id,
        titleJa: ja,
        titleVi: vi,
        // Suy ra từ tiêu đề chứ không khai thêm một cột: cột đó chỉ có thể lệch
        // với tiêu đề, không thể đúng hơn tiêu đề.
        kind: TEST_TITLES.includes(ja) ? 'test' : 'lesson',
        source: override?.source ?? defaultSource,
        route: override?.route ?? '',
        page: page ? Number(page) : 0,
        weight: 1,
      };
    }),
  };
}

/** Mục lẻ không thuộc tuần nào của sách, ví dụ phần luyện thêm trong app. */
function appUnit(id: string, titleJa: string, titleVi: string, route: string): N3Unit {
  return { id, titleJa, titleVi, kind: 'lesson', source: 'app', route, page: 0, weight: 1 };
}

// ── Trụ 1: ôn nền 皆の日本語 N5–N4 ─────────────────────────────────────────

/** Bài từ vựng 皆の日本語, đã nạp sẵn trong app từ trước. */
function minnaVocab(from: number, to: number): UnitRow[] {
  const rows: UnitRow[] = [];
  for (let no = from; no <= to; no++) rows.push(`第${no}課|Bài ${no} · từ vựng`);
  return rows;
}

function minnaVocabSources(
  prefix: string,
  no: number,
  from: number,
  to: number,
): Record<string, { source: N3UnitSource; route: string }> {
  const map: Record<string, { source: N3UnitSource; route: string }> = {};
  for (let lesson = from; lesson <= to; lesson++) {
    map[`${prefix}-${no}-${lesson - from + 1}`] = {
      source: 'app',
      route: `/lesson/minano-nihongo-${lesson}`,
    };
  }
  return map;
}

const FOUNDATION_BLOCKS: N3Block[] = [
  block(
    'nen',
    1,
    '第1課〜第25課',
    'Bài 1–25',
    '皆の日本語 初級I · 語彙',
    'Từ vựng N5 — toàn bộ 25 bài đầu',
    0,
    minnaVocab(1, 25),
    minnaVocabSources('nen', 1, 1, 25),
  ),
  block(
    'nen',
    2,
    '第26課〜第50課',
    'Bài 26–50',
    '皆の日本語 初級II · 語彙',
    'Từ vựng N4 — toàn bộ 25 bài sau',
    0,
    minnaVocab(26, 50),
    minnaVocabSources('nen', 2, 26, 50),
  ),
  {
    id: 'nen-3',
    labelJa: '補強',
    labelVi: 'Bổ trợ',
    titleJa: '漢字・部首・動詞の活用',
    titleVi: 'Chữ Hán, bộ thủ và chia động từ',
    startPage: 0,
    units: [
      appUnit('nen-3-1', '漢字 N5（118字）', 'Luyện 118 chữ Kanji N5 — âm Hán Việt', '/kanji'),
      appUnit('nen-3-2', '漢字 N4（149字）', 'Luyện 149 chữ Kanji N4 — âm Hán Việt', '/kanji'),
      appUnit('nen-3-3', '部首（214）', 'Luyện 214 bộ thủ — nhận mặt bộ trong chữ', '/radical'),
      appUnit(
        'nen-3-4',
        '自動詞・他動詞',
        'Bài tập tự động từ & tha động từ (N5→N3)',
        '/exercise/tu-tha-dong-tu',
      ),
      appUnit(
        'nen-3-5',
        '動詞の活用',
        'Bài tập chuyển thể động từ (N5→N2)',
        '/exercise/chuyen-the-dong-tu',
      ),
      appUnit('nen-3-6', '第33課 · 動詞', 'Chia động từ bài 33', '/lesson/dong-tu-minano-33'),
      appUnit('nen-3-7', '特別な動詞', 'Động từ đặc biệt & bất quy tắc', '/lesson/dong-tu-dac-biet'),
      appUnit('nen-3-8', '第13課 · 文法', 'Ngữ pháp bài 13', '/grammar/ngu-phap-minano-13'),
      appUnit('nen-3-9', '第26課 · 会話', 'Dịch hội thoại bài 26', '/lesson/hoi-thoai-minano-26'),
      appUnit('nen-3-10', '第28課 · 会話', 'Dịch hội thoại bài 28', '/lesson/hoi-thoai-minano-28'),
      appUnit('nen-3-11', '第29課 · 会話', 'Dịch hội thoại bài 29', '/lesson/hoi-thoai-minano-29'),
      appUnit('nen-3-12', '第33課 · 会話', 'Dịch hội thoại bài 33', '/lesson/hoi-thoai-minano-33'),
    ],
  },
];

// ── Trụ 2: 文字 — 総まとめ N3 漢字 ─────────────────────────────────────────

const MOJI_BLOCKS: N3Block[] = [
  block('kanji', 1, '第1週', 'Tuần 1', 'でかける①', 'Ra ngoài ①', 11, [
    '駐車場|Bãi đỗ xe',
    '横断歩道|Vạch sang đường',
    'サイン|Biển báo, ký hiệu',
    '駅のホーム|Sân ga',
    '特急電車|Tàu tốc hành đặc biệt',
    'バス|Xe buýt',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('kanji', 2, '第2週', 'Tuần 2', 'でかける②', 'Ra ngoài ②', 27, [
    'レストラン|Nhà hàng',
    '禁煙|Cấm hút thuốc',
    '観光地図|Bản đồ du lịch',
    '街の地図|Bản đồ phố phường',
    '病院|Bệnh viện',
    '困ったときは|Khi gặp chuyện khó',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('kanji', 3, '第3週', 'Tuần 3', 'つかう', 'Dùng', 43, [
    '要冷蔵|Cần bảo quản lạnh',
    '消費期限|Hạn sử dụng',
    '自動販売機|Máy bán hàng tự động',
    'レシピ|Công thức nấu ăn',
    'コピー機・留守番電話|Máy photo, máy trả lời tự động',
    '携帯電話|Điện thoại di động',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('kanji', 4, '第4週', 'Tuần 4', 'かう', 'Mua', 59, [
    '日用品|Đồ dùng hằng ngày',
    '広告メール|Email quảng cáo',
    '通信販売|Bán hàng qua đặt hàng xa',
    '申込書|Đơn đăng ký',
    '注文|Đặt hàng',
    '不在通知|Giấy thông báo vắng nhà',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('kanji', 5, '第5週', 'Tuần 5', 'かく', 'Viết', 75, [
    'メールを送る|Gửi email',
    'アンケート|Phiếu khảo sát',
    '日本語クラス|Lớp tiếng Nhật',
    '作文|Bài tập làm văn',
    '問診票—歯科で|Phiếu khai bệnh — ở khoa răng',
    '問診票—健康診断|Phiếu khai bệnh — khám sức khoẻ',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('kanji', 6, '第6週', 'Tuần 6', 'よむ', 'Đọc', 91, [
    '天気予報|Dự báo thời tiết',
    '求人広告|Quảng cáo tuyển người',
    'スポーツ記事|Bài báo thể thao',
    '経済|Kinh tế',
    '地球温暖化|Trái đất nóng lên',
    '政治|Chính trị',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  {
    id: 'kanji-7',
    labelJa: '補強',
    labelVi: 'Bổ trợ',
    titleJa: 'アプリの漢字コーナー',
    titleVi: 'Khu Kanji và Bộ thủ trong app',
    startPage: 0,
    units: [
      appUnit(
        'kanji-7-1',
        '漢字 N3（375字）· 漢越音',
        'Luyện âm Hán Việt của 375 chữ Kanji N3',
        '/kanji',
      ),
      appUnit('kanji-7-2', '漢字 N3 · 語彙', 'Luyện các từ dùng chữ Kanji N3', '/kanji'),
      appUnit('kanji-7-3', '部首 → 漢字', 'Đi từ bộ thủ ra chữ, cho chữ N3', '/radical'),
    ],
  },
];

// ── Trụ 3: 語彙 — 総まとめ N3 語彙 ─────────────────────────────────────────

/** Sáu bài từ vựng N3 đã nạp vào app, ứng với tuần 1 ngày 1–6 của quyển 語彙. */
const GOI_WEEK1_SOURCES: Record<string, { source: N3UnitSource; route: string }> = {
  'goi-1-1': { source: 'app', route: '/lesson/soumatome-n3-1' },
  'goi-1-2': { source: 'app', route: '/lesson/soumatome-n3-2' },
  'goi-1-3': { source: 'app', route: '/lesson/soumatome-n3-3' },
  'goi-1-4': { source: 'app', route: '/lesson/soumatome-n3-4' },
  'goi-1-5': { source: 'app', route: '/lesson/soumatome-n3-5' },
  'goi-1-6': { source: 'app', route: '/lesson/soumatome-n3-6' },
};

const GOI_BLOCKS: N3Block[] = [
  block(
    'goi',
    1,
    '第1週',
    'Tuần 1',
    '家事をしましょう',
    'Làm việc nhà',
    11,
    [
      'キッチンで／リビングで|Trong bếp / phòng khách|12',
      '料理をしましょう①|Nấu ăn ①|14',
      '料理をしましょう②|Nấu ăn ②|16',
      '掃除をしましょう|Dọn dẹp|18',
      '洗濯をしましょう|Giặt giũ|20',
      '子どもやペットの世話をしましょう|Chăm con và thú cưng|22',
      '実戦問題|Bài kiểm tra thực chiến|24',
    ],
    GOI_WEEK1_SOURCES,
  ),
  block('goi', 2, '第2週', 'Tuần 2', '外出しましょう', 'Ra ngoài', 27, [
    '計画を立てましょう|Lập kế hoạch',
    '電車に乗りましょう①|Đi tàu ①',
    '電車に乗りましょう②|Đi tàu ②',
    '車に乗りましょう①|Đi xe ①',
    '車に乗りましょう②|Đi xe ②',
    '用事を済ませましょう|Giải quyết việc cần làm',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('goi', 3, '第3週', 'Tuần 3', '休日を楽しみましょう', 'Tận hưởng ngày nghỉ', 43, [
    'デートにさそいましょう|Mời đi hẹn hò',
    'したくをしましょう|Sửa soạn, chuẩn bị',
    '買い物をしましょう|Đi mua sắm',
    '食事に行きましょう|Đi ăn',
    'お酒を飲みましょう|Uống rượu',
    'お金を払いましょう|Trả tiền',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('goi', 4, '第4週', 'Tuần 4', '勉強や仕事をしましょう', 'Học và làm việc', 59, [
    '学校へ行きましょう①|Đi học ①',
    '学校へ行きましょう②|Đi học ②',
    '学校へ行きましょう③|Đi học ③',
    '仕事をしましょう|Làm việc',
    'パソコンを使いましょう|Dùng máy tính',
    'メールを書きましょう|Viết email',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('goi', 5, '第5週', 'Tuần 5', 'いろいろ表現しましょう', 'Diễn đạt nhiều kiểu', 75, [
    'どういう関係ですか？|Quan hệ với nhau thế nào?',
    'あいさつをしましょう|Chào hỏi',
    'どんな人が好き？|Thích người thế nào?',
    '体の調子はどうですか？|Sức khoẻ thế nào?',
    'どんなようすですか？①|Trông ra sao? ①',
    'どんなようすですか？②|Trông ra sao? ②',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('goi', 6, '第6週', 'Tuần 6', 'まとめて覚えましょう', 'Nhớ theo cụm', 91, [
    'かなりがんばっています|Trạng từ mức độ: かなり…',
    'ちゃんとがんばっています|Trạng từ cách thức: ちゃんと…',
    'ますますがんばります|Trạng từ tăng tiến: ますます…',
    '組み合わせのことば|Từ đi thành cặp',
    '意味がたくさんある動詞①|Động từ nhiều nghĩa ①',
    '意味がたくさんある動詞②|Động từ nhiều nghĩa ②',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
];

// ── Trụ 4: 文法 — nền N4 trong app, phần N3 chưa có sách ──────────────────

/** Bài ngữ pháp 皆の日本語 đã nạp sẵn, bài 26–50 (bài 39 sách không có). */
const MINNA_GRAMMAR_LESSONS: readonly number[] = [
  26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
];

const BUNPOU_BLOCKS: N3Block[] = [
  {
    id: 'bunpou-1',
    labelJa: '土台',
    labelVi: 'Phần nền',
    titleJa: '皆の日本語 初級II · 文法',
    titleVi: 'Ngữ pháp N4 — 24 bài đã có trong app',
    startPage: 0,
    units: MINNA_GRAMMAR_LESSONS.map((lesson, index) =>
      appUnit(
        `bunpou-1-${index + 1}`,
        `第${lesson}課`,
        `Ngữ pháp bài ${lesson}`,
        `/grammar/ngu-phap-minano-${lesson}`,
      ),
    ),
  },
  {
    id: 'bunpou-2',
    labelJa: '未入手',
    labelVi: 'Chưa có nguồn',
    titleJa: '日本語総まとめ N3 · 文法',
    titleVi: 'Ngữ pháp riêng của N3 — chưa có sách trong máy',
    startPage: 0,
    units: [
      {
        id: 'bunpou-2-1',
        titleJa: '日本語総まとめ N3 文法（未入手）',
        titleVi: 'Cần bổ sung sách 総まとめ N3 文法 — dự kiến 6 tuần × 7 ngày',
        kind: 'lesson',
        source: 'no-source',
        route: '',
        page: 0,
        weight: BUNPOU_GAP_WEIGHT,
      },
    ],
  },
];

// ── Trụ 5: 読解 — 総まとめ N3 読解 ─────────────────────────────────────────

const DOKKAI_BLOCKS: N3Block[] = [
  block('dokkai', 1, '第1週', 'Tuần 1', 'お知らせや案内を読もう', 'Đọc thông báo và chỉ dẫn', 11, [
    '案内①|Bản chỉ dẫn ①',
    '案内②|Bản chỉ dẫn ②',
    '案内③|Bản chỉ dẫn ③',
    '試験要項|Quy chế thi',
    '募集①|Thông báo tuyển ①',
    '募集②|Thông báo tuyển ②',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('dokkai', 2, '第2週', 'Tuần 2', '身のまわりの文書を読もう', 'Đọc giấy tờ quanh mình', 27, [
    'カタログ①|Catalogue ①',
    'カタログ②|Catalogue ②',
    'お知らせ|Thông báo',
    '説明書①|Bản hướng dẫn sử dụng ①',
    '説明書②|Bản hướng dẫn sử dụng ②',
    '保証書|Phiếu bảo hành',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('dokkai', 3, '第3週', 'Tuần 3', '通信文を読もう', 'Đọc thư từ và tin nhắn', 43, [
    'メール①|Email ①',
    'メール②|Email ②',
    '手紙・はがき①|Thư và bưu thiếp ①',
    '手紙・はがき②|Thư và bưu thiếp ②',
    '手紙・はがき③|Thư và bưu thiếp ③',
    'FAX（ビジネスレター）|FAX (thư thương mại)',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('dokkai', 4, '第4週', 'Tuần 4', '新聞を読もう', 'Đọc báo', 59, [
    '見出し|Tiêu đề báo',
    'グラフ①|Đồ thị ①',
    'グラフ②|Đồ thị ②',
    '広告①|Quảng cáo ①',
    '広告②|Quảng cáo ②',
    'まんが|Truyện tranh',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block('dokkai', 5, '第5週', 'Tuần 5', '日記や小説を読もう', 'Đọc nhật ký và truyện', 75, [
    '日記①|Nhật ký ①',
    '日記②|Nhật ký ②',
    '家族①|Gia đình ①',
    '家族②|Gia đình ②',
    '小説①|Truyện ①',
    '小説②|Truyện ②',
    '実戦問題|Bài kiểm tra thực chiến',
  ]),
  block(
    'dokkai',
    6,
    '第6週',
    'Tuần 6',
    '意見文や説明文を読もう',
    'Đọc bài nêu ý kiến và bài giải thích',
    91,
    [
      '意見文①|Bài nêu ý kiến ①',
      '意見文②|Bài nêu ý kiến ②',
      '意見文③|Bài nêu ý kiến ③',
      '計算に関する文章|Bài văn về tính toán',
      '医学に関する文章|Bài văn về y học',
      '社会に関する文章|Bài văn về xã hội',
      '実戦問題|Bài kiểm tra thực chiến',
    ],
  ),
];

// ── Trụ 6: 聴解 — có sách, chủ động hoãn ──────────────────────────────────

const CHOUKAI_BLOCKS: N3Block[] = [
  block(
    'choukai',
    1,
    '第1章',
    'Chương 1',
    '準備をしましょう',
    'Chuẩn bị nền',
    11,
    [
      '発音について|Về phát âm|12',
      '文法について①|Về ngữ pháp ①|14',
      '文法について②|Về ngữ pháp ②|16',
      '会話表現|Cách nói trong hội thoại|18',
      'まとめ問題|Bài kiểm tra tổng hợp|20',
    ],
    {},
    'deferred',
  ),
  block(
    'choukai',
    2,
    '第2章',
    'Chương 2',
    '問題のパターンに慣れましょう',
    'Làm quen năm dạng đề nghe',
    23,
    [
      '何と言いますか—発話表現|Nói gì đây — 発話表現|24',
      'どんな返事をしますか—即時応答|Đáp lại thế nào — 即時応答|26',
      '何をしますか—課題理解|Sẽ làm gì — 課題理解|28',
      'どうしてですか—ポイント理解|Vì sao — ポイント理解|30',
      'どんな内容ですか—概要理解|Nội dung gì — 概要理解|32',
      'まとめ問題|Bài kiểm tra tổng hợp|34',
    ],
    {},
    'deferred',
  ),
  block(
    'choukai',
    3,
    '第3章',
    'Chương 3',
    'いろいろな場所で聞きましょう',
    'Nghe ở nhiều nơi khác nhau',
    37,
    [
      '町で|Ngoài phố|38',
      '天気予報・交通情報|Dự báo thời tiết, thông tin giao thông|40',
      '学校で|Ở trường|42',
      '職場で|Ở nơi làm việc|44',
      '病院・いろいろな店で|Ở bệnh viện và các loại cửa hàng|46',
      'まとめ問題|Bài kiểm tra tổng hợp|48',
    ],
    {},
    'deferred',
  ),
  block(
    'choukai',
    4,
    '第4章',
    'Chương 4',
    'いろいろな内容を聞きましょう',
    'Nghe nhiều loại nội dung',
    51,
    [
      '人や物のようす|Dáng vẻ người và vật|52',
      '場所・方向・位置|Nơi chốn, phương hướng, vị trí|54',
      '数・数字・計算|Số lượng, số liệu, tính toán|56',
      '順序・比較|Thứ tự và so sánh|58',
      'まとめ問題|Bài kiểm tra tổng hợp|60',
    ],
    {},
    'deferred',
  ),
  block(
    'choukai',
    5,
    '第5章',
    'Chương 5',
    '総まとめ問題',
    'Đề mô phỏng toàn phần nghe',
    63,
    ['総まとめ問題|Đề mô phỏng toàn phần nghe|63'],
    {},
    'deferred',
  ),
];

// ── Ghép thành lộ trình ───────────────────────────────────────────────────

export const N3_SECTIONS: readonly N3Section[] = [
  {
    pillar: 'foundation',
    labelKey: 'n3.pillar.foundation',
    descKey: 'n3.pillar.foundation.desc',
    book: '皆の日本語 初級 I・II',
    glyph: '基',
    blocks: FOUNDATION_BLOCKS,
  },
  {
    pillar: 'moji',
    labelKey: 'n3.pillar.moji',
    descKey: 'n3.pillar.moji.desc',
    book: '日本語総まとめ N3 · 漢字',
    glyph: '漢',
    blocks: MOJI_BLOCKS,
  },
  {
    pillar: 'goi',
    labelKey: 'n3.pillar.goi',
    descKey: 'n3.pillar.goi.desc',
    book: '日本語総まとめ N3 · 語彙',
    glyph: '語',
    blocks: GOI_BLOCKS,
  },
  {
    pillar: 'bunpou',
    labelKey: 'n3.pillar.bunpou',
    descKey: 'n3.pillar.bunpou.desc',
    book: '皆の日本語 初級II（総まとめ N3 文法 chưa có）',
    glyph: '文',
    blocks: BUNPOU_BLOCKS,
  },
  {
    pillar: 'dokkai',
    labelKey: 'n3.pillar.dokkai',
    descKey: 'n3.pillar.dokkai.desc',
    book: '日本語総まとめ N3 · 読解',
    glyph: '読',
    blocks: DOKKAI_BLOCKS,
  },
  {
    pillar: 'choukai',
    labelKey: 'n3.pillar.choukai',
    descKey: 'n3.pillar.choukai.desc',
    book: '日本語総まとめ N3 · 聴解',
    glyph: '聴',
    blocks: CHOUKAI_BLOCKS,
  },
];

/**
 * BỐN GIAI ĐOẠN từ 05/09 tới 10/12 — 96 ngày, không ngày nào bỏ trống.
 *
 * Vì sao chia đúng bốn giai đoạn này, không phải cách nào khác:
 *
 *  1. Ba tuần vá nền TRƯỚC, không học N3 song song. Đề N3 vẫn hỏi từ và mẫu câu
 *     N5–N4; mở 総まとめ trong khi nền còn hổng thì mỗi trang sách N3 lại phải
 *     dừng để tra lại một thứ đã học rồi, và tốc độ tụt xuống một nửa.
 *  2. Bảy tuần rưỡi nạp N3 với ba quyển TRỘN ĐỀU. Không học tuần tự hết quyển này
 *     mới sang quyển khác: mỗi khối điểm của đề có 基準点 riêng, nên nếu lộ trình
 *     bị trượt thì phần bỏ dở phải là "mỏng đều cả ba khối", chứ không được là
 *     "mất trắng khối 読解".
 *  3. Ba tuần luyện đề, KHÔNG bài mới. 実戦問題 chỉ nói thật khi làm trong điều
 *     kiện giống thi; làm nó xen giữa lúc còn đang nạp bài thì nó chỉ kiểm tra
 *     bài vừa đọc hôm qua.
 *  4. Ba ngày cuối chỉ ôn ★. Nạp chữ mới sát ngày thi làm loãng đúng phần vừa
 *     mới nhớ được.
 *
 * NHỊP HỌC LÀ ĐIỀU KIỆN THIẾT KẾ, không phải hệ quả. Mốc chia 21/53 ngày chọn để
 * cả hai giai đoạn nạp bài đều rơi vào khoảng 2,4–2,9 buổi mỗi ngày. Bản chia
 * trước (14/60) cho ra 6,1 buổi mỗi ngày ở giai đoạn 1 — đúng về số học và không
 * ai học được như thế, nên nó là một kế hoạch sai chứ không phải một kế hoạch
 * tham vọng. Sửa mốc thì chạy lại `npm run verify:n3` để soát lại nhịp.
 */
export const N3_PHASES: readonly N3Phase[] = [
  {
    id: 'p1',
    labelKey: 'n3.phase.p1',
    goalKey: 'n3.phase.p1.goal',
    from: N3_PLAN_START,
    to: '2026-09-25',
    // `nen-3` đứng trước `nen-2`: các phần luyện chữ Hán, bộ thủ và chia động từ
    // là thứ đỡ nhiều nhất cho việc đọc sách N3, nên phải xong sớm nhất.
    blocks: ['nen-3', 'nen-2', 'bunpou-1'],
    routineKey: 'n3.phase.p1.routine',
  },
  {
    id: 'p2',
    labelKey: 'n3.phase.p2',
    goalKey: 'n3.phase.p2.goal',
    from: '2026-09-26',
    to: N3_LAST_NEW_MATERIAL_DATE,
    blocks: [
      'kanji-1',
      'kanji-2',
      'kanji-3',
      'kanji-4',
      'kanji-5',
      'kanji-6',
      'kanji-7',
      'goi-1',
      'goi-2',
      'goi-3',
      'goi-4',
      'goi-5',
      'goi-6',
      'dokkai-1',
      'dokkai-2',
      'dokkai-3',
      'dokkai-4',
      'dokkai-5',
      'dokkai-6',
    ],
    routineKey: 'n3.phase.p2.routine',
  },
  {
    id: 'p3',
    labelKey: 'n3.phase.p3',
    goalKey: 'n3.phase.p3.goal',
    from: '2026-11-18',
    to: '2026-12-06',
    blocks: [],
    routineKey: 'n3.phase.p3.routine',
  },
  {
    id: 'p4',
    labelKey: 'n3.phase.p4',
    goalKey: 'n3.phase.p4.goal',
    from: '2026-12-07',
    to: '2026-12-09',
    blocks: [],
    routineKey: 'n3.phase.p4.routine',
  },
];

/** Khoá thông điệp cho tên giai đoạn, tra theo id. */
export function phaseById(id: string): N3Phase | null {
  return N3_PHASES.find((phase) => phase.id === id) ?? null;
}

/** Nhãn ngắn của một nguồn, dùng cho badge trên từng dòng. */
export const N3_SOURCE_LABEL_KEY: Record<N3UnitSource, MessageKey> = {
  app: 'n3.source.app',
  book: 'n3.source.book',
  'no-source': 'n3.source.none',
  deferred: 'n3.source.deferred',
};
