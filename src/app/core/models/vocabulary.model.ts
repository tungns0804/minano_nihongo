import type { VerbGroup } from '../japanese/conjugation';
import type { MessageKey } from '../i18n/messages';

/** Một từ vựng. Trùng cấu trúc với phần tử trong `public/lessons/<id>.json`. */
export interface VocabularyWord {
  /** Id ổn định, sinh từ nội dung (xem `vocabulary-parser.ts`). Dùng làm khoá Favorite. */
  id: string;
  /**
   * Âm Hán Việt, ví dụ "ĐÀO". Chuỗi rỗng nghĩa là từ này không có âm Hán Việt —
   * từ katakana (アイデア) và trạng từ thuần kana (うっかり) của 総まとめ N3 thì
   * không có. Cột này chỉ hiện khi bài có ít nhất một từ khai báo âm Hán Việt,
   * xem `OPTIONAL_WORD_FIELDS`.
   */
  hanViet: string;
  /** Từ tiếng Nhật, ví dụ "逃げます". */
  japanese: string;
  /**
   * Cách đọc bằng hiragana/katakana, ví dụ "にげます". Chuỗi rỗng nghĩa là chưa có —
   * cột này chỉ hiện khi bài có ít nhất một từ khai báo cách đọc.
   *
   * KHÔNG nằm trong khoá sinh id (id băm từ `japanese|hanViet`), nên thêm hay sửa
   * cách đọc của một từ đã có không làm mất ★ của từ đó.
   */
  reading: string;
  /** Nghĩa tiếng Việt, ví dụ "chạy trốn/ bỏ chạy". */
  vietnamese: string;
  /** Câu ví dụ có dùng từ này. Chuỗi rỗng nghĩa là chưa có. */
  example: string;
}

/**
 * Cấp độ JLPT của một bài.
 *
 * Xếp theo thứ tự HỌC (N5 → N4 → N3), không phải thứ tự số giảm dần cho vui: đây
 * cũng là thứ tự các nút hiện trong bộ lọc cấp độ.
 */
export type JlptLevel = 'N5' | 'N4' | 'N3';

export const JLPT_LEVELS: readonly JlptLevel[] = ['N5', 'N4', 'N3'];

export function isJlptLevel(value: unknown): value is JlptLevel {
  return JLPT_LEVELS.includes(value as JlptLevel);
}

/** Giáo trình mà một cấp độ lấy nội dung ra. */
export type JlptBook = 'minna' | 'soumatome';

/**
 * Cấp nào học theo sách nào.
 *
 * N5/N4 đi theo 皆の日本語 (50 bài đánh số liền mạch), N3 đi theo 日本語総まとめ
 * (6 tuần × 7 ngày, đánh số lại từ đầu ở mỗi quyển). Hai cách đánh số đó KHÔNG
 * so sánh được với nhau — đó chính là lý do `JLPT_RANGE` bên dưới không còn phủ
 * hết mọi cấp.
 */
export const JLPT_BOOK: Record<JlptLevel, JlptBook> = {
  N5: 'minna',
  N4: 'minna',
  N3: 'soumatome',
};

/** Tên sách hiện trong nhãn bộ lọc, ví dụ "N3 · 総まとめ". */
export const JLPT_BOOK_NAME: Record<JlptBook, string> = {
  minna: '皆の日本語',
  soumatome: '総まとめ',
};

/**
 * Bài đầu và bài cuối của mỗi cấp, dùng cả để lọc lẫn để hiện chú thích "bài 1-25".
 *
 * Mốc chia N5/N4 lấy đúng theo cuốn "TỪ VỰNG N5.pdf" dùng làm nguồn dữ liệu: hết
 * bài 25 là hết phần N5, và ngay sau đó sách in tiêu đề "TỪ VỰNG MINNANO N4" rồi
 * mới sang bài 26.
 *
 * `Partial` chứ không phải `Record` đủ mọi cấp: N3 không có khoảng bài nào ở đây
 * cả. Số của một bài 総まとめ là "ngày thứ mấy trong quyển" (1–42), trùng số với
 * bài 皆の日本語 mà chẳng liên quan gì tới nhau — suy cấp độ từ con số đó sẽ xếp
 * nhầm cả loạt bài N3 sang N5. Cấp của bài N3 phải khai thẳng, xem `levelOf`.
 */
export const JLPT_RANGE: Partial<Record<JlptLevel, { from: number; to: number }>> = {
  N5: { from: 1, to: 25 },
  N4: { from: 26, to: 50 },
};

/**
 * Cấp độ suy ra từ SỐ BÀI trong 皆の日本語, hoặc null khi không suy được.
 *
 * Trả null chứ không đoán bừa: bài tự nạp và bài "Động từ đặc biệt" (gom động từ của
 * nhiều bài) không có số bài, gán đại cho chúng một cấp là nói dối người học.
 *
 * Chỉ dùng làm ĐƯỜNG LÙI cho bài không khai cấp — điểm vào đúng là `levelOf`.
 */
export function levelOfLesson(lessonNumber: number | undefined): JlptLevel | null {
  if (typeof lessonNumber !== 'number') return null;
  for (const level of JLPT_LEVELS) {
    const range = JLPT_RANGE[level];
    if (range && lessonNumber >= range.from && lessonNumber <= range.to) return level;
  }
  return null;
}

/**
 * Cấp độ của một bài, hoặc null khi không xác định được.
 *
 * Cấp KHAI THẲNG luôn thắng: bài 総まとめ N3 khai `"level": "N3"` trong meta.json,
 * và phải thắng thì bài "Tuần 1 · Ngày 1" (số bài 1) mới không bị khoảng bài 1–25
 * kéo sang N5. Bài 皆の日本語 không khai gì cả, vẫn suy ra từ số bài như cũ nên
 * không phải sửa lại 50 thư mục sẵn có.
 */
export function levelOf(lesson: {
  level?: JlptLevel;
  lessonNumber?: number;
}): JlptLevel | null {
  return lesson.level ?? levelOfLesson(lesson.lessonNumber);
}

/** Bài học nằm sẵn trong `public/lessons` hay do người dùng tự nạp. */
export type LessonOrigin = 'builtin' | 'custom';

/**
 * Loại bài học: học nghĩa từ vựng, luyện chia động từ, dịch câu hội thoại, hay học
 * mẫu ngữ pháp.
 *
 * Bài ngữ pháp KHÔNG hiện ở trang chủ mà có tab riêng (`/grammar`) — xem
 * `CATEGORY_ORDER` trong `features/lesson-list/lesson-list.ts`. Lý do: mỗi bài ngữ
 * pháp là một trang lý thuyết dài, gom chung vào lưới thẻ của trang chủ thì danh
 * sách 25 bài (26–50) sẽ đè bẹp phần từ vựng và động từ.
 *
 * `exercise` cũng có tab riêng (`/exercise`) và KHÔNG bao giờ tới từ file bài học:
 * đó là hai bài tập chuyên đề cài sẵn trong mã nguồn (xem `core/exercises/`). Loại
 * này có mặt ở đây vì phiên luyện tập của chúng đi qua đúng `PracticeConfig` và
 * đúng màn hình luyện tập / kết quả như bốn loại bài kia.
 *
 * `kanji` cũng vậy: tab `/kanji`, dữ liệu nằm ở `core/kanji/`, và cũng đi qua đúng
 * màn hình luyện tập / kết quả chung. `radical` (khu Bộ thủ, tab `/radical`, dữ
 * liệu ở `core/radical/`) là bản sao cùng lối của `kanji`, chỉ khác chiều học: đi
 * từ bộ thủ ra chữ thay vì từ chữ ra từ.
 *
 * `topic` (tab `/topic`) là bài TỪ VỰNG THEO CHỦ ĐỀ: cùng kiểu dữ liệu và cùng
 * màn hình chi tiết với `vocabulary`, chỉ khác cách gom — theo chủ đề (gia đình,
 * thiên nhiên, tự/tha động từ…) thay vì theo số bài trong giáo trình. Nó phải là
 * một LOẠI riêng chứ không phải một bài từ vựng nữa: cùng một từ có mặt ở cả bài
 * 11 lẫn chủ đề "Gia đình", nên hai nhóm này không được nằm chung một danh sách.
 * Nội dung nằm ở `core/topics/`, xem `topic.model.ts`.
 */
export type LessonKind =
  | 'vocabulary'
  | 'topic'
  | 'verb'
  | 'conversation'
  | 'grammar'
  | 'exercise'
  | 'kanji'
  | 'radical';

export const LESSON_KIND_LABEL_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary',
  topic: 'kind.topic',
  verb: 'kind.verb',
  conversation: 'kind.conversation',
  grammar: 'kind.grammar',
  exercise: 'kind.exercise',
  kanji: 'kind.kanji',
  radical: 'kind.radical',
};

export const LESSON_KIND_DESC_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary.desc',
  topic: 'kind.topic.desc',
  verb: 'kind.verb.desc',
  conversation: 'kind.conversation.desc',
  grammar: 'kind.grammar.desc',
  exercise: 'kind.exercise.desc',
  kanji: 'kind.kanji.desc',
  radical: 'kind.radical.desc',
};

/** Khoá đếm số mục, ví dụ "38 từ" / "38語". */
export const LESSON_KIND_UNIT_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary.unit',
  topic: 'kind.topic.unit',
  verb: 'kind.verb.unit',
  conversation: 'kind.conversation.unit',
  grammar: 'kind.grammar.unit',
  exercise: 'kind.exercise.unit',
  kanji: 'kind.kanji.unit',
  radical: 'kind.radical.unit',
};

/** Các tab của ứng dụng chứa danh sách bài để chọn. */
export type LessonTab = 'home' | 'topic' | 'exercise' | 'grammar' | 'kanji' | 'radical';

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
  exercise: 'exercise',
  kanji: 'kanji',
  radical: 'radical',
};

/** Đường dẫn tới màn hình danh sách của từng tab. */
export const LESSON_TAB_ROUTE: Record<LessonTab, string> = {
  home: '/',
  topic: '/topic',
  exercise: '/exercise',
  grammar: '/grammar',
  kanji: '/kanji',
  radical: '/radical',
};

/** Thứ tự hiển thị các nhóm loại bài trong một tab. */
const LESSON_KIND_ORDER: readonly LessonKind[] = [
  'vocabulary',
  'topic',
  'verb',
  'conversation',
  'grammar',
  'exercise',
  'kanji',
  'radical',
];

/** Các loại bài thuộc một tab, theo đúng thứ tự hiển thị. */
export function lessonKindsOfTab(tab: LessonTab): LessonKind[] {
  return LESSON_KIND_ORDER.filter((kind) => LESSON_KIND_TAB[kind] === tab);
}

/**
 * Một câu trong bài hội thoại — luôn có cặp Nhật/Việt để dịch qua lại.
 *
 * Id băm từ RIÊNG câu tiếng Nhật, không gồm bản dịch: sửa lại bản dịch tiếng Việt
 * cho sát nghĩa hơn thì id giữ nguyên, dấu ★ của câu đó không mất.
 */
export interface ConversationLine {
  id: string;
  /** Tiêu đề nhóm đang thuộc về, ví dụ "Hội thoại". Rỗng nếu chưa khai báo. */
  section: string;
  /** Người nói, ví dụ "管理人". Rỗng với câu mẫu không thuộc lời thoại của ai. */
  speaker: string;
  japanese: string;
  vietnamese: string;
}

/**
 * Một động từ trong bài luyện chia.
 *
 * Chỉ lưu thể ます + nhóm; các thể còn lại được tính lúc chạy bằng
 * `core/japanese/conjugation.ts`. Nhờ vậy sửa luật chia không phải sinh lại dữ liệu.
 */
export interface VerbEntry {
  id: string;
  hanViet: string;
  /** Thể ます, ví dụ "逃げます". */
  masu: string;
  vietnamese: string;
  group: VerbGroup;
  /**
   * Động từ nhóm 1 nhưng hình dạng dễ bị nhầm sang nhóm 2 (帰ります, 入ります,
   * 走ります...). Chỉ dùng để gắn nhãn và lọc khi luyện, không ảnh hưởng cách chia.
   */
  deceptive: boolean;
}

/**
 * Một câu ví dụ của mẫu ngữ pháp — luôn có cặp Nhật/Việt để dịch qua lại.
 *
 * Id băm từ RIÊNG câu tiếng Nhật (giống `ConversationLine`): sửa lại bản dịch tiếng
 * Việt cho sát nghĩa hơn thì id giữ nguyên, dấu ★ của câu đó không mất.
 */
export interface GrammarExample {
  id: string;
  japanese: string;
  /** Cách đọc toàn câu bằng kana. Rỗng khi câu đã viết sẵn bằng kana. */
  reading: string;
  vietnamese: string;
  /** Ghi chú ngắn cho riêng câu này, ví dụ câu hỏi mà nó đang trả lời. Rỗng nếu không có. */
  note: string;
}

/** Một cách dùng của mẫu ngữ pháp, kèm các câu ví dụ minh hoạ cho đúng cách dùng đó. */
export interface GrammarUsage {
  /** Chỉ duy nhất trong phạm vi một mẫu ngữ pháp ("u1", "u2"…). */
  id: string;
  title: string;
  /** Giải thích thêm cho cách dùng này. Rỗng nếu không có. */
  detail: string;
  examples: GrammarExample[];
}

/** Bảng biến đổi kèm theo mẫu ngữ pháp, ví dụ bảng ます → んです của bài 26. */
export interface GrammarTable {
  /** Tiêu đề bảng, ví dụ "Động từ". Rỗng nếu không có. */
  caption: string;
  /** Tiêu đề các cột. Rỗng hết nghĩa là bảng không có hàng tiêu đề. */
  headers: string[];
  /** Mỗi dòng có đúng `headers.length` ô (script sinh dữ liệu đã kiểm tra). */
  rows: string[][];
}

/** Một mẫu ngữ pháp: công thức, giải thích, bảng biến đổi và các cách dùng. */
export interface GrammarPoint {
  id: string;
  /** Tên mẫu, ví dụ "～んです". */
  title: string;
  /** Một câu tóm tắt ý nghĩa. Rỗng nếu không có. */
  summary: string;
  /** Các dòng công thức, ví dụ "V thể ngắn ＋ んです". */
  structures: string[];
  /** Các đoạn giải thích. */
  explanation: string[];
  /** Các lưu ý / lỗi hay gặp. */
  notes: string[];
  tables: GrammarTable[];
  usages: GrammarUsage[];
}

/** Bài học đầy đủ. Tuỳ `kind` mà dùng `words`, `verbs`, `lines` hoặc `grammarPoints`. */
export interface Lesson {
  id: string;
  name: string;
  description: string;
  kind: LessonKind;
  /** Số mục trong bài: số từ vựng, số động từ, số câu hội thoại, hoặc số mẫu ngữ pháp. */
  itemCount: number;
  /**
   * Bài số mấy trong giáo trình, dùng để suy ra cấp độ JLPT (xem `levelOfLesson`).
   *
   * Có mặt ở CẢ file bài học lẫn index.json, không thừa: bản offline nhúng thẳng file
   * bài học vào trang và dựng danh sách từ đó, không đọc index.json.
   */
  lessonNumber?: number;
  /**
   * Cấp độ khai thẳng trong `meta.json`. Vắng mặt thì suy ra từ `lessonNumber` —
   * xem `levelOf`. Bài 総まとめ BẮT BUỘC có trường này.
   */
  level?: JlptLevel;
  words: VocabularyWord[];
  verbs: VerbEntry[];
  lines: ConversationLine[];
  grammarPoints: GrammarPoint[];
  origin: LessonOrigin;
}

/**
 * Một câu ví dụ đã gắn kèm mẫu ngữ pháp và cách dùng sinh ra nó.
 *
 * Câu ví dụ nằm lồng hai tầng (mẫu → cách dùng → ví dụ), nhưng lúc luyện tập thì
 * cần một danh sách phẳng để trộn và cắt. Kiểu này giữ lại đường dẫn ngược lên để
 * câu hỏi vẫn hiện được tên mẫu ngữ pháp và công thức làm gợi ý.
 */
export interface GrammarExampleRef {
  example: GrammarExample;
  point: GrammarPoint;
  usage: GrammarUsage;
}

/** Trải phẳng toàn bộ câu ví dụ của một bài ngữ pháp, giữ nguyên thứ tự trong bài. */
export function flattenGrammarExamples(points: readonly GrammarPoint[]): GrammarExampleRef[] {
  return points.flatMap((point) =>
    point.usages.flatMap((usage) =>
      usage.examples.map((example) => ({ example, point, usage })),
    ),
  );
}

/** Thông tin tóm tắt để hiển thị ở màn hình danh sách (chưa cần tải nội dung). */
export interface LessonSummary {
  id: string;
  name: string;
  description: string;
  kind: LessonKind;
  itemCount: number;
  origin: LessonOrigin;
  /** Bài số mấy trong giáo trình. Không có với bài tự nạp và bài không thuộc bài nào. */
  lessonNumber?: number;
  /** Cấp độ khai thẳng, xem `Lesson.level`. */
  level?: JlptLevel;
}

/** Cấu trúc file `public/lessons/index.json` do script sinh ra. */
export interface LessonIndexFile {
  generatedAt?: string;
  lessons: LessonIndexEntry[];
}

export interface LessonIndexEntry {
  id: string;
  name: string;
  description?: string;
  kind: LessonKind;
  itemCount: number;
  /** Do `scripts/generate-lessons.mjs` tính sẵn, xem `lessonNumberOf` bên đó. */
  lessonNumber?: number;
  /** Lấy từ `meta.level`, xem `Lesson.level`. */
  level?: JlptLevel;
  file: string;
}

/**
 * Trường dữ liệu của một từ, dùng để mô tả "hỏi cái gì / trả lời cái gì".
 *
 * Hai trong bốn trường có thể rỗng, xem `OPTIONAL_WORD_FIELDS`.
 */
export type WordField = 'japanese' | 'vietnamese' | 'hanViet' | 'reading';

/**
 * Những trường được phép rỗng, tức có bài khai báo và có bài không.
 *
 * Bài nào thiếu trường nào thì mọi chiều luyện đụng tới trường đó phải bị loại ra
 * (xem `directionIsUsable`) và cột tương ứng phải ẩn khỏi bảng từ vựng. Không loại
 * thì hỏng LẶNG LẼ giữa buổi luyện: câu hỏi hiện ra với đáp án đúng là chuỗi rỗng,
 * gõ gì cũng sai và chẳng có lỗi nào được báo.
 *
 * Trước đây chỉ có `reading`, và `hanViet` bị coi là bắt buộc. `hanViet` vào danh
 * sách này từ khi có phần N3: 総まとめ có nhiều từ không mang âm Hán Việt.
 */
export const OPTIONAL_WORD_FIELDS: readonly WordField[] = ['hanViet', 'reading'];

/** Bài này có ít nhất một từ khai báo trường đó không. */
export function hasWordField(words: readonly VocabularyWord[], field: WordField): boolean {
  return words.some((word) => fieldValue(word, field).length > 0);
}

export const WORD_FIELD_LABEL: Record<WordField, string> = {
  japanese: 'Tiếng Nhật',
  vietnamese: 'Nghĩa tiếng Việt',
  hanViet: 'Âm Hán Việt',
  reading: 'Cách đọc',
};

/** Trường này viết bằng chữ Nhật (kanji/kana) — quyết định font và cách so khớp. */
export function fieldIsJapanese(field: WordField): boolean {
  return field === 'japanese' || field === 'reading';
}

export function fieldValue(word: VocabularyWord, field: WordField): string {
  return word[field];
}
