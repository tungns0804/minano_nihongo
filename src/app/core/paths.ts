// Chỉ `import type` từ ngoài vào: file này nằm trong gói tải ĐẦU (menu, breadcrumb,
// route đều cần nó), và một import giá trị từ vocabulary.model kéo cả file đó vào gói
// đầu theo. Nó cũng được `scripts/verify-paths.mjs` và `verify-n3.mjs` nạp thẳng bằng
// --experimental-strip-types, nên không được đụng tới Angular.
import type { LessonKind } from './lessons/vocabulary.model';

/**
 * MỌI đường dẫn của ứng dụng, ở một chỗ. Không viết tay '/ngu-phap' ở nơi nào khác —
 * dùng `PATH`, `lessonPath`, `exercisePath`, `itemPath`.
 *
 * Đường dẫn đọc y như menu, theo đúng thứ bậc nhóm → tab → bài:
 *
 *   /tu-vung/bai-12                       Từ vựng › Minano › Bài 12
 *   /tu-vung/chu-de/gia-dinh              Từ vựng › Chủ đề › Gia đình
 *   /ngu-phap/bai-12                      Ngữ pháp › Minano › Bài 12
 *   /ngu-phap/vnjpclub                    Ngữ pháp › vnjpclub
 *   /kanji/nhat-65e5                      Kanji › 日
 *   /kanji/bo-thu/nhan-4eba               Kanji › Bộ thủ › 人
 *   /luyen-tap/dich/bai-12                Luyện tập › Dịch › Bài 12
 *   /luyen-tap/bai-tap/hoi-thoai-bai-26   Luyện tập › Bài tập › Hội thoại bài 26
 *   /luyen-tap/de-n4                      Luyện tập › Đề N4
 *
 * Vì sao như vậy:
 *  - Một bài luôn nằm NGAY DƯỚI danh sách đang liệt kê nó. Chỉ nhìn URL là biết menu
 *    nào sáng, tab nào, nút quay lại về đâu — `navigation.ts` không cần bảng tra riêng.
 *    Trước đây bài hội thoại liệt kê ở tab Bài tập nhưng mở ở /lesson/… nên menu nhảy
 *    sang Từ vựng, còn sách vnjpclub thuộc Ngữ pháp mà nằm ở /exercise/….
 *  - Tiếng Việt không dấu, cùng thứ tiếng với id bài (ngu-phap-n4, so-dem, gia-dinh).
 *    Trước đây URL trộn hai thứ tiếng và nói một ý hai lần: /grammar/ngu-phap-minano-12.
 *  - Bỏ phần id lặp lại tên khu (xem `SLUG_RULES`). Id bài GIỮ NGUYÊN — nó là khoá ★
 *    và khoá lịch ôn trong localStorage; chỉ đoạn hiện trên URL là ngắn lại.
 *
 * Đường dẫn cũ (/lesson/…, /grammar/…, /exercise/…) vẫn mở được: `legacyPathTarget`
 * chuyển chúng sang chỗ mới, nên link đã lưu, lịch sử trình duyệt và khối "Học tiếp"
 * không gãy.
 */
export const PATH = {
  today: '/',
  review: '/on-tap',
  n3: '/tien-do-n3',

  vocab: '/tu-vung',
  topics: '/tu-vung/chu-de',
  importLesson: '/tu-vung/nap-bai',

  grammar: '/ngu-phap',
  vnjpclub: '/ngu-phap/vnjpclub',

  kanji: '/kanji',
  radicals: '/kanji/bo-thu',
  kanjiQuiz: '/kanji/trac-nghiem',
  kanjiOnKun: '/kanji/am-on-kun',

  /** Gốc của nhóm Luyện tập — tự chuyển sang tab đầu (`translate`), không có trang riêng. */
  practiceGroup: '/luyen-tap',
  translate: '/luyen-tap/dich',
  exercises: '/luyen-tap/bai-tap',
  counters: '/luyen-tap/bai-tap/so-dem',
  n4grammar: '/luyen-tap/ngu-phap-n4',
  taisaku: '/luyen-tap/de-n4',

  /** Đang làm một phiên luyện — không thuộc nhóm menu nào. */
  session: '/lam-bai',
  result: '/ket-qua',
} as const;



/** Các tab của ứng dụng chứa danh sách bài để chọn. */
export type LessonTab =
  | 'home'
  | 'topic'
  | 'exercise'
  | 'grammar'
  | 'translate'
  | 'kanji'
  | 'radical';

/**
 * Loại bài nào hiện ở tab nào.
 *
 * Đây là NGUỒN SỰ THẬT DUY NHẤT cho việc phân chia đó: trang chủ lấy phần của
 * mình từ bảng này, tab Bài tập bổ trợ lấy phần của nó cũng từ đây, và nút quay
 * lại ở màn hình chi tiết bài cũng tra bảng này để biết đưa người dùng về đâu.
 * Trước kia trang chủ giữ riêng một danh sách loại bài, nên chuyển một loại sang
 * tab khác là phải nhớ sửa đúng ba chỗ mà không có gì nhắc.
 *
 * Là `Record` đủ mọi loại chứ không phải danh sách: thêm loại bài thứ bảy mà quên
 * xếp tab thì TypeScript báo lỗi ngay tại đây, thay vì loại đó lặng lẽ không hiện
 * ở tab nào cả.
 *
 * `exercise` là hai bài tập chuyên đề cài trong mã nguồn — chúng không tới từ
 * `LessonStore` nhưng vẫn nằm ở tab đó, nên vẫn phải khai.
 *
 * Nằm ở file đường dẫn chứ không ở vocabulary.model: tab liệt kê bài cũng quyết định
 * đường dẫn của bài (`lessonPath`), và file này phải nhẹ vì nằm trong gói tải đầu.
 */
export const LESSON_KIND_TAB: Record<LessonKind, LessonTab> = {
  vocabulary: 'home',
  // Bài chủ đề cắt LẠI đúng kho từ của trang chủ theo chủ đề, nên nó phải đứng ở
  // một tab khác chứ không thể nằm chung: gộp vào thì mỗi từ hiện hai lần trong
  // cùng một danh sách, và số "bài" ngoài trang chủ tự dưng phồng lên gấp rưỡi.
  topic: 'topic',
  // Hai loại này từng ở trang chủ. Chuyển sang tab Bài tập bổ trợ vì cả hai đều là
  // cách luyện (chia thể, dịch câu) chứ không phải một kho từ để nhớ nghĩa — cùng
  // họ với hai bài tập chuyên đề hơn là với bài từ vựng.
  verb: 'exercise',
  conversation: 'exercise',
  grammar: 'grammar',
  // Tab riêng chứ không nằm chung tab Bài tập bổ trợ với bài dịch hội thoại: bài luyện
  // dịch đi đủ 50 bài theo giáo trình và có bộ lọc cấp độ, gom chung thì tab kia thành
  // một lưới 57 thẻ không lọc được.
  translation: 'translate',
  exercise: 'exercise',
  kanji: 'kanji',
  radical: 'radical',
};

/** Danh sách mà mỗi tab (`LESSON_KIND_TAB`) liệt kê bài. */
export const LESSON_TAB_ROUTE: Record<LessonTab, string> = {
  home: PATH.vocab,
  topic: PATH.topics,
  exercise: PATH.exercises,
  grammar: PATH.grammar,
  translate: PATH.translate,
  kanji: PATH.kanji,
  radical: PATH.radicals,
};

/**
 * Bài tập có trang riêng thay vì nằm dưới /luyen-tap/bai-tap/. Ngoài bảng này, mọi id
 * bài tập đều mở ở `itemPath(PATH.exercises, id)`.
 */
const EXERCISE_PAGE: Readonly<Record<string, string>> = {
  // Cùng chỗ với luật chung, nhưng là một route riêng (màn hình riêng) nên khai ra đây
  // để `lessonIdOfPath` không coi nó là trang cố định.
  'so-dem': PATH.counters,
  'ngu-phap-n4': PATH.n4grammar,
  'ngu-phap-vnjpclub': PATH.vnjpclub,
  'taisaku-n4': PATH.taisaku,
  // Trắc nghiệm Kanji theo bài là một tab của khu Kanji, không phải của nhóm Luyện tập.
  'trac-nghiem-kanji': PATH.kanjiQuiz,
  // Bảng chữ bài giảng (âm On / Kun, Hán Việt) — cũng là một tab của khu Kanji.
  'am-on-kun': PATH.kanjiOnKun,
};

/**
 * Phần id lặp lại tên khu thì bỏ khỏi URL: đã ở /ngu-phap/ thì "ngu-phap-minano-" chỉ
 * còn "bai-". Mỗi luật là [đầu id, đầu đoạn URL]; id không khớp luật nào thì URL dùng
 * nguyên id (ví dụ soumatome-n3-1, gia-dinh).
 *
 * Phải đổi qua đổi lại được không mất mát — `scripts/verify-paths.mjs` thử mọi bài.
 */
const SLUG_RULES: Readonly<Record<string, readonly (readonly [idPrefix: string, slugPrefix: string])[]>> = {
  [PATH.vocab]: [['minano-nihongo-', 'bai-']],
  [PATH.grammar]: [['ngu-phap-minano-', 'bai-']],
  [PATH.translate]: [['luyen-dich-minano-', 'bai-']],
  [PATH.exercises]: [
    ['hoi-thoai-minano-', 'hoi-thoai-bai-'],
    ['dong-tu-minano-', 'dong-tu-bai-'],
  ],
};

/** Đoạn URL của một bài trong danh sách `base`. */
export function slugOf(base: string, id: string): string {
  for (const [idPrefix, slugPrefix] of SLUG_RULES[base] ?? []) {
    if (id.startsWith(idPrefix)) return slugPrefix + id.slice(idPrefix.length);
  }
  return id;
}

/** Ngược của `slugOf`: từ đoạn URL ra id bài. */
export function idOfSlug(base: string, slug: string): string {
  for (const [idPrefix, slugPrefix] of SLUG_RULES[base] ?? []) {
    if (slug.startsWith(slugPrefix)) return idPrefix + slug.slice(slugPrefix.length);
  }
  return slug;
}

/** Trang của một mục nằm trong danh sách `base`. */
export function itemPath(base: string, id: string): string {
  return `${base}/${slugOf(base, id)}`;
}

/** Danh sách liệt kê loại bài này — cũng là chỗ nút "quay lại" đưa về. */
export function listPathOf(kind: LessonKind): string {
  return LESSON_TAB_ROUTE[LESSON_KIND_TAB[kind]];
}

/** Trang của một bài tập (bài cài trong mã nguồn, hoặc bài động từ / hội thoại). */
export function exercisePath(id: string): string {
  return EXERCISE_PAGE[id] ?? itemPath(PATH.exercises, id);
}

/** Trang của một bài bất kỳ, theo loại bài: luôn nằm ngay dưới danh sách liệt kê nó. */
export function lessonPath(kind: LessonKind, id: string): string {
  const base = listPathOf(kind);
  return base === PATH.exercises ? exercisePath(id) : itemPath(base, id);
}

/** Đường dẫn trần của một URL: bỏ query, fragment, tham số ma trận và dấu / cuối. */
export function pathOf(url: string): string {
  const path = url.split(/[?#;]/)[0];
  return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}

/** `path` là chính `base` hoặc nằm dưới nó (so theo từng đoạn, không theo ký tự). */
export function isUnder(path: string, base: string): boolean {
  return path === base || (base !== '/' && path.startsWith(`${base}/`));
}

const STATIC_PATHS: ReadonlySet<string> = new Set(Object.values(PATH));

/** Đường dẫn của một trang danh sách / trang cố định, không phải một bài. */
export function isStaticPath(path: string): boolean {
  return STATIC_PATHS.has(path);
}

/** Các danh sách có bài con, dài trước: /tu-vung/chu-de phải thắng /tu-vung. */
const ITEM_BASES: readonly string[] = [...new Set(Object.values(LESSON_TAB_ROUTE))].sort(
  (a, b) => b.length - a.length,
);

/**
 * Id bài mà một đường dẫn trỏ tới, hoặc null với trang danh sách / trang cố định.
 * Lộ trình N3 dùng nó để biết buổi học nào ứng với bài nào.
 */
export function lessonIdOfPath(path: string): string | null {
  const clean = pathOf(path);
  const page = Object.entries(EXERCISE_PAGE).find(([, target]) => target === clean);
  if (page) return page[0];
  if (isStaticPath(clean)) return null;
  for (const base of ITEM_BASES) {
    const rest = clean.startsWith(`${base}/`) ? clean.slice(base.length + 1) : '';
    if (rest && !rest.includes('/')) return idOfSlug(base, rest);
  }
  return null;
}

/**
 * Loại bài từ khoá nhãn đã lưu ("kind.verb" → 'verb') — `LESSON_KIND_LABEL_KEY` đặt tên
 * khoá theo đúng mẫu này; `verify:paths` thử đủ mọi loại nên lệch mẫu là báo ngay.
 */
function kindOfLabelKey(key: string | undefined): LessonKind | undefined {
  const kind = key?.startsWith('kind.') ? key.slice('kind.'.length) : '';
  return kind in LESSON_KIND_TAB ? (kind as LessonKind) : undefined;
}

/**
 * Chỗ mới của một đường dẫn kiểu cũ (trước 07/11/2026), hoặc null nếu không phải
 * đường dẫn cũ.
 *
 * `/lesson/:id` từng gom chung ba loại bài; biết loại (`kindKey` lưu trong khối "Học
 * tiếp") thì đi thẳng tới chỗ đúng. Không biết thì đoán theo đầu id, và màn hình bài
 * học tự chuyển tiếp nếu đoán sai (xem `LessonDetail.load`).
 */
export function legacyPathTarget(path: string, kindKey?: string): string | null {
  const [head = '', id = '', ...extra] = pathOf(path).split('/').filter(Boolean);
  if (extra.length > 0) return null;
  switch (head) {
    case 'vocab':
      return PATH.vocab;
    case 'lesson': {
      if (!id) return PATH.vocab;
      const kind = kindOfLabelKey(kindKey);
      if (kind) return lessonPath(kind, id);
      const base = Object.keys(SLUG_RULES).find((key) =>
        SLUG_RULES[key].some(([idPrefix]) => id.startsWith(idPrefix)),
      );
      return itemPath(base ?? PATH.vocab, id);
    }
    case 'topic':
      return id ? lessonPath('topic', id) : PATH.topics;
    case 'grammar':
      return id ? lessonPath('grammar', id) : PATH.grammar;
    case 'translate':
      return id ? lessonPath('translation', id) : PATH.translate;
    case 'exercise':
      return id ? exercisePath(id) : PATH.exercises;
    case 'radical':
      return id ? lessonPath('radical', id) : PATH.radicals;
    case 'review':
      return id ? null : PATH.review;
    case 'n3':
      return id ? null : PATH.n3;
    case 'import':
      return id ? null : PATH.importLesson;
    case 'practice':
      return id ? null : PATH.session;
    case 'result':
      return id ? null : PATH.result;
    default:
      return null;
  }
}
