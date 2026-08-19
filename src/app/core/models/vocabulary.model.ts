import type { VerbGroup } from '../japanese/conjugation';
import type { MessageKey } from '../i18n/messages';

/** Một từ vựng. Trùng cấu trúc với phần tử trong `public/lessons/<id>.json`. */
export interface VocabularyWord {
  /** Id ổn định, sinh từ nội dung (xem `vocabulary-parser.ts`). Dùng làm khoá Favorite. */
  id: string;
  /** Âm Hán Việt, ví dụ "ĐÀO". */
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
 * Mốc chia lấy đúng theo cuốn "TỪ VỰNG N5.pdf" dùng làm nguồn dữ liệu: hết bài 25 là
 * hết phần N5, và ngay sau đó sách in tiêu đề "TỪ VỰNG MINNANO N4" rồi mới sang bài 26.
 */
export type JlptLevel = 'N5' | 'N4';

export const JLPT_LEVELS: readonly JlptLevel[] = ['N5', 'N4'];

/** Bài đầu và bài cuối của mỗi cấp, dùng cả để lọc lẫn để hiện chú thích "bài 1-25". */
export const JLPT_RANGE: Record<JlptLevel, { from: number; to: number }> = {
  N5: { from: 1, to: 25 },
  N4: { from: 26, to: 50 },
};

/**
 * Cấp độ của một bài, hoặc null khi không xác định được.
 *
 * Trả null chứ không đoán bừa: bài tự nạp và bài "Động từ đặc biệt" (gom động từ của
 * nhiều bài) không có số bài, gán đại cho chúng một cấp là nói dối người học.
 */
export function levelOfLesson(lessonNumber: number | undefined): JlptLevel | null {
  if (typeof lessonNumber !== 'number') return null;
  for (const level of JLPT_LEVELS) {
    const { from, to } = JLPT_RANGE[level];
    if (lessonNumber >= from && lessonNumber <= to) return level;
  }
  return null;
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
 * màn hình luyện tập / kết quả chung.
 */
export type LessonKind =
  | 'vocabulary'
  | 'verb'
  | 'conversation'
  | 'grammar'
  | 'exercise'
  | 'kanji';

export const LESSON_KIND_LABEL_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary',
  verb: 'kind.verb',
  conversation: 'kind.conversation',
  grammar: 'kind.grammar',
  exercise: 'kind.exercise',
  kanji: 'kind.kanji',
};

export const LESSON_KIND_DESC_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary.desc',
  verb: 'kind.verb.desc',
  conversation: 'kind.conversation.desc',
  grammar: 'kind.grammar.desc',
  exercise: 'kind.exercise.desc',
  kanji: 'kind.kanji.desc',
};

/** Khoá đếm số mục, ví dụ "38 từ" / "38語". */
export const LESSON_KIND_UNIT_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary.unit',
  verb: 'kind.verb.unit',
  conversation: 'kind.conversation.unit',
  grammar: 'kind.grammar.unit',
  exercise: 'kind.exercise.unit',
  kanji: 'kind.kanji.unit',
};

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
  file: string;
}

/**
 * Trường dữ liệu của một từ, dùng để mô tả "hỏi cái gì / trả lời cái gì".
 *
 * `reading` là trường DUY NHẤT có thể rỗng — bài chưa khai báo cách đọc thì các
 * chiều luyện liên quan tới nó phải bị loại ra, xem `directionNeedsReading`.
 */
export type WordField = 'japanese' | 'vietnamese' | 'hanViet' | 'reading';

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
