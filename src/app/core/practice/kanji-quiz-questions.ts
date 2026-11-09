import { KanjiQuizKind, KanjiQuizQuestion, kanjiQuizSource } from '../kanji/kanji-quiz';
import type { MessageKey } from '../i18n/messages';
import {
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  examText,
  makeQuestion,
  recap,
  recapJp,
} from './practice.model';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi cho tab "Trắc nghiệm" của khu Kanji.
 *
 * Giữ NGUYÊN đề và thứ tự bốn lựa chọn như đề gốc (giống đề luyện N4): người học dò lại
 * "đáp án 4" trên đề giấy thì trong app cũng phải là lựa chọn thứ tư. Câu nào cũng là
 * trắc nghiệm — đề chỉ có lựa chọn, đổi sang gõ thì không còn là đề này nữa.
 */

const LABEL: Record<KanjiQuizKind, MessageKey> = {
  reading: 'kanjiQuiz.label.reading',
  writing: 'kanjiQuiz.label.writing',
};

function subjectOf(question: KanjiQuizQuestion): QuestionSubject {
  const source = kanjiQuizSource(question);
  // Hai chiều viết theo thứ tự đọc tự nhiên: chữ Hán trước, kana sau.
  const [kanji, kana] =
    question.kind === 'reading'
      ? [question.target, question.answer]
      : [question.answer, question.target];
  return {
    id: question.id,
    title: examText(question.prompt),
    titleIsJapanese: true,
    subtitle: `${kanji}（${kana}）`,
    detail: source,
    detailSuffixKey: null,
    recap: [
      recapJp('kanjiQuiz.col.word', `${kanji}（${kana}）`),
      recap('lesson.col.meaningShort', question.meaning),
      // Mẹo viết tiếng Việt lẫn chữ Nhật: font giao diện, không phải font Nhật.
      ...(question.tip ? [recap('kanjiQuiz.col.tip', question.tip)] : []),
      recapJp('kanjiQuiz.col.source', source),
    ],
  };
}

export function buildKanjiQuizQuestions(
  questions: readonly KanjiQuizQuestion[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return questions.map((question) =>
    makeQuestion({
      subject: subjectOf(question),
      labelKey: LABEL[question.kind],
      prompt: examText(question.prompt),
      correctAnswer: question.answer,
      acceptedAnswers: [question.answer],
      answerIsJapanese: true,
      answerPromptKey: 'taisaku.answerPrompt',
      choices: [...question.options],
      isSentence: true,
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', question.options.length),
      exam: { prompt: question.prompt, markupChoices: true, passage: null, complete: null },
    }),
  );
}
