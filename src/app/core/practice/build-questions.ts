import { PracticeConfig, PracticeQuestion } from '../models/practice.model';
import {
  ConversationLine,
  GrammarExampleRef,
  Lesson,
  VerbEntry,
  VocabularyWord,
} from '../models/vocabulary.model';
import { shuffle } from '../utils/random';
import { sliceBatch } from './batch';
import { buildConversationQuestions } from './conversation-questions';
import { buildGrammarQuestions } from './grammar-questions';
import { buildVerbQuestions } from './verb-questions';
import { buildVocabularyQuestions } from './vocabulary-questions';

/**
 * Tập mục được đem ra hỏi, tuỳ loại bài mà là từ vựng, động từ, câu hội thoại hay
 * câu ví dụ ngữ pháp.
 */
export type PracticePool =
  | { kind: 'vocabulary'; words: readonly VocabularyWord[] }
  | { kind: 'verb'; verbs: readonly VerbEntry[] }
  | { kind: 'conversation'; lines: readonly ConversationLine[] }
  | { kind: 'grammar'; examples: readonly GrammarExampleRef[] };

/**
 * Một phiên đã dựng xong.
 *
 * Phiên chỉ chạy `questions` (đã trộn, đã cắt), nhưng vẫn phải giữ `all` —
 * TOÀN BỘ câu hỏi của phạm vi đang chọn, nguyên thứ tự trong bài — thì mới cắt
 * được cụm kế tiếp lúc người học xong cụm này. Dựng lại từ đầu ở màn hình kết
 * quả thì không được: màn hình đó không còn giữ bài học lẫn tập mục nào cả.
 */
export interface PracticePlan {
  questions: PracticeQuestion[];
  all: readonly PracticeQuestion[];
}

/**
 * Dựng danh sách câu hỏi cho một phiên luyện tập, rồi trộn và cắt theo thiết lập.
 *
 * Trộn và cắt làm ở đây (sau khi đã sinh) chứ không làm trên danh sách mục, vì
 * bài động từ sinh nhiều câu cho mỗi động từ (mỗi thể một câu) — cắt sớm sẽ làm
 * lệch tỉ lệ giữa các thể.
 */
export function buildQuestions(
  lesson: Lesson,
  pool: PracticePool,
  config: PracticeConfig,
): PracticePlan {
  // switch trên `pool.kind` chứ không phải chuỗi ternary: thêm loại bài mới mà quên
  // xử lý thì TypeScript báo lỗi ngay ở đây thay vì âm thầm rơi vào nhánh từ vựng.
  let questions: PracticeQuestion[];
  switch (pool.kind) {
    case 'verb':
      questions = buildVerbQuestions(pool.verbs, lesson.verbs, config);
      break;
    case 'conversation':
      questions = buildConversationQuestions(pool.lines, config);
      break;
    case 'grammar':
      questions = buildGrammarQuestions(pool.examples, config);
      break;
    case 'vocabulary':
      questions = buildVocabularyQuestions(pool.words, lesson.words, config);
      break;
  }

  return orderQuestions(questions, config);
}

/**
 * Trộn và cắt danh sách câu hỏi theo thiết lập.
 *
 * Tách riêng vì khu "Bài tập" không đi qua `buildQuestions` (nó không có `Lesson`
 * để truyền vào) nhưng vẫn phải tôn trọng đúng hai tuỳ chọn "Trộn thứ tự" và
 * "Số câu" như mọi phiên luyện khác.
 */
export function orderQuestions(
  questions: readonly PracticeQuestion[],
  config: PracticeConfig,
): PracticePlan {
  const all = [...questions];
  const limit = config.questionLimit;
  const hasLimit = limit !== null && limit > 0;

  // Học theo cụm: cắt theo thứ tự gốc TRƯỚC rồi mới trộn bên trong cụm. Làm
  // ngược lại (trộn cả bài rồi cắt, như phiên thường ngay bên dưới) thì cụm 2
  // lại gặp đúng những từ của cụm 1 — hỏng hẳn ý "học tiếp 10 từ mới".
  if (hasLimit && config.batchIndex !== null) {
    const batch = sliceBatch(all, limit, config.batchIndex);
    return { questions: config.shuffle ? shuffle(batch) : batch, all };
  }

  const ordered = config.shuffle ? shuffle(all) : [...all];
  return { questions: hasLimit ? ordered.slice(0, limit) : ordered, all };
}

/**
 * Trộn lại thứ tự đáp án của một câu đã làm.
 * Dùng khi luyện lại câu sai để người học không nhớ vị trí đáp án của lần trước.
 */
export function reshuffleChoices(question: PracticeQuestion): PracticeQuestion {
  return question.choices.length > 0
    ? { ...question, choices: shuffle(question.choices) }
    : question;
}
