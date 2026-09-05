import type { KanjiEntry } from '../kanji/kanji.model';
import { PracticeConfig, PracticeQuestion, makeQuestion } from '../models/practice.model';
import type { RadicalEntry } from '../radical/radical.model';
import { canDraw } from '../strokes/stroke-store';
import { kanjiSubject } from './kanji-questions';
import { radicalSubject } from './radical-questions';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi VIẾT TAY cho cả khu Kanji lẫn khu Bộ thủ.
 *
 * Một file cho hai khu chứ không mỗi khu một chỗ: câu hỏi của cả hai giống hệt
 * nhau — hỏi bằng âm Hán Việt, trả lời bằng cách viết ra hình chữ — chỉ khác cái
 * bảng lấy dữ liệu. Phần khác nhau thật sự (mục hiện lại sau khi chấm) thì mượn
 * đúng hàm dựng của khu đó, nên hai khu không bao giờ nói khác nhau về cùng một chữ.
 *
 * Câu hỏi chỉ mang theo CHỮ; các nét mẫu do `StrokeStore` tra lúc vẽ.
 */

/**
 * Lọc ra những mục viết được.
 *
 * KanjiVG thiếu nét của vài chữ hiếm và vài biến thể bộ thủ. Đem chúng vào phiên
 * thì tới câu đó khung vẽ trống trơn không có gì để đồ, cũng không có gì để chấm.
 */
export function drawableKanji(entries: readonly KanjiEntry[]): KanjiEntry[] {
  return entries.filter((entry) => canDraw(entry.char));
}

export function drawableRadicals(entries: readonly RadicalEntry[]): RadicalEntry[] {
  return entries.filter((entry) => canDraw(entry.char));
}

export function buildKanjiDrawQuestions(
  entries: readonly KanjiEntry[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return drawableKanji(entries).map((entry) =>
    makeQuestion({
      subject: kanjiSubject(entry),
      labelKey: 'kanji.label.draw',
      prompt: entry.hanViet,
      promptIsJapanese: false,
      correctAnswer: entry.char,
      answerIsJapanese: true,
      answerPromptKey: 'practice.answerPrompt.draw',
      drawChar: entry.char,
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'draw', 0),
    }),
  );
}

export function buildRadicalDrawQuestions(
  entries: readonly RadicalEntry[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return drawableRadicals(entries).map((entry) =>
    makeQuestion({
      subject: radicalSubject(entry),
      labelKey: 'radical.label.draw',
      prompt: entry.hanViet,
      promptIsJapanese: false,
      correctAnswer: entry.char,
      answerIsJapanese: true,
      answerPromptKey: 'practice.answerPrompt.draw',
      drawChar: entry.char,
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'draw', 0),
    }),
  );
}
