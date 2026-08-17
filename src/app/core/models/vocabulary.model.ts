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

/** Bài học nằm sẵn trong `public/lessons` hay do người dùng tự nạp. */
export type LessonOrigin = 'builtin' | 'custom';

/** Loại bài học: học nghĩa từ vựng, luyện chia động từ, hay dịch câu hội thoại. */
export type LessonKind = 'vocabulary' | 'verb' | 'conversation';

export const LESSON_KIND_LABEL_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary',
  verb: 'kind.verb',
  conversation: 'kind.conversation',
};

export const LESSON_KIND_DESC_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary.desc',
  verb: 'kind.verb.desc',
  conversation: 'kind.conversation.desc',
};

/** Khoá đếm số mục, ví dụ "38 từ" / "38語". */
export const LESSON_KIND_UNIT_KEY: Record<LessonKind, MessageKey> = {
  vocabulary: 'kind.vocabulary.unit',
  verb: 'kind.verb.unit',
  conversation: 'kind.conversation.unit',
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

/** Bài học đầy đủ. Tuỳ `kind` mà dùng `words`, `verbs` hoặc `lines`. */
export interface Lesson {
  id: string;
  name: string;
  description: string;
  kind: LessonKind;
  /** Số mục trong bài: số từ vựng, số động từ, hoặc số câu hội thoại. */
  itemCount: number;
  words: VocabularyWord[];
  verbs: VerbEntry[];
  lines: ConversationLine[];
  origin: LessonOrigin;
}

/** Thông tin tóm tắt để hiển thị ở màn hình danh sách (chưa cần tải nội dung). */
export interface LessonSummary {
  id: string;
  name: string;
  description: string;
  kind: LessonKind;
  itemCount: number;
  origin: LessonOrigin;
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
