import type { Radical, RadicalWord } from '../kanji/kanji.model';
import { PracticeConfig, PracticeQuestion, QuestionSubject, RecapItem } from '../models/practice.model';
import { acceptedAnswersOf } from '../utils/answer-check';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi cho khu "Kanji".
 *
 * Cả ba chiều đều CHỈ gõ đáp án, không có trắc nghiệm: bày sẵn bốn âm Hán Việt để
 * chọn thì người học chỉ cần nhận mặt chữ, trong khi cái cần nhớ ở đây là đọc ra
 * được — đúng lý do khu Bài tập cũng chỉ cho gõ.
 *
 * Cả ba đều KHÔNG có gợi ý âm Hán Việt: ở chiều hỏi bộ thủ thì âm Hán Việt chính
 * là đáp án, còn ở hai chiều hỏi từ thì âm Hán Việt của từ gần như đọc thẳng ra
 * nghĩa lẫn cách đọc (KIM NGUYỆT → 今月 → こんげつ).
 */

// ── Chiều 1: bộ thủ → âm Hán Việt ──────────────────────────────────────

function radicalSubject(radical: Radical): QuestionSubject {
  const shapes = [radical.glyph, ...radical.variants].join(' ');
  return {
    id: radical.id,
    title: radical.glyph,
    titleIsJapanese: true,
    subtitle: radical.hanViet,
    detail: radical.meaning,
    detailSuffixKey: null,
    recap: [
      { labelKey: 'kanji.col.radical', value: shapes, valueKey: null, japanese: true },
      { labelKey: 'kanji.col.hanViet', value: radical.hanViet, valueKey: null, japanese: false },
      { labelKey: 'kanji.col.meaning', value: radical.meaning, valueKey: null, japanese: false },
      { labelKey: 'kanji.col.strokes', value: String(radical.strokes), valueKey: null, japanese: false },
      {
        labelKey: 'kanji.col.kanji',
        value: radical.kanjiList.map((item) => item.char).join(' '),
        valueKey: null,
        japanese: true,
      },
    ],
  };
}

export function buildRadicalQuestions(
  radicals: readonly Radical[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return radicals.map((radical) => ({
    subject: radicalSubject(radical),
    labelKey: 'kanji.label.radicalHanViet',
    labelParams: {},
    prompt: radical.glyph,
    promptIsJapanese: true,
    // Dạng biến thể (亻 của 人) không phải gợi ý mà là một phần của câu hỏi: nhận ra
    // 亻 trong chữ mới là việc khó, còn 人 đứng một mình thì ai cũng biết.
    hint: radical.variants.length > 0 ? radical.variants.join(' ') : null,
    hintIsJapanese: true,
    correctAnswer: radical.hanViet,
    correctAnswerKey: null,
    acceptedAnswers: acceptedAnswersOf(radical.hanViet),
    answerIsJapanese: false,
    answerPromptKey: 'kanji.answerPrompt.hanViet',
    answerPromptParams: {},
    choices: [],
    choiceLabelKeys: null,
    ignorePunctuation: false,
    isSentence: false,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  }));
}

// ── Chiều 2 & 3: từ → nghĩa / từ → hiragana ────────────────────────────

function wordSubject(word: RadicalWord, radical: Radical): QuestionSubject {
  const recap: RecapItem[] = [
    { labelKey: 'lesson.col.japanese', value: word.japanese, valueKey: null, japanese: true },
    { labelKey: 'lesson.col.reading', value: word.reading, valueKey: null, japanese: true },
    { labelKey: 'lesson.col.meaningShort', value: word.meaning, valueKey: null, japanese: false },
  ];
  // Từ lấy từ bộ động từ bài tập không có cột âm Hán Việt — bỏ hẳn dòng đó thay vì
  // hiện một dòng trống.
  if (word.hanViet) {
    recap.push({ labelKey: 'lesson.col.hanViet', value: word.hanViet, valueKey: null, japanese: false });
  }
  recap.push(
    {
      labelKey: 'kanji.col.radical',
      value: `${word.kanji} — ${radical.glyph} (${radical.hanViet})`,
      valueKey: null,
      japanese: true,
    },
    { labelKey: 'kanji.col.level', value: word.level, valueKey: null, japanese: false },
  );

  return {
    id: word.id,
    title: word.japanese,
    titleIsJapanese: true,
    subtitle: word.reading,
    detail: word.meaning,
    detailSuffixKey: null,
    recap,
  };
}

type WordAsk = 'meaning' | 'reading';

function wordQuestion(
  word: RadicalWord,
  radical: Radical,
  ask: WordAsk,
  config: PracticeConfig,
): PracticeQuestion {
  const askingMeaning = ask === 'meaning';
  const answer = askingMeaning ? word.meaning : word.reading;

  return {
    subject: wordSubject(word, radical),
    labelKey: askingMeaning ? 'kanji.label.wordMeaning' : 'kanji.label.wordReading',
    labelParams: {},
    prompt: word.japanese,
    promptIsJapanese: true,
    hint: null,
    hintIsJapanese: false,
    correctAnswer: answer,
    correctAnswerKey: null,
    acceptedAnswers: acceptedAnswersOf(answer),
    // Cách đọc là kana nên dùng font tiếng Nhật và bỏ hết khoảng trắng khi so khớp;
    // nghĩa là tiếng Việt nên không.
    answerIsJapanese: !askingMeaning,
    answerPromptKey: askingMeaning
      ? 'practice.answerPrompt.vietnamese'
      : 'practice.answerPrompt.reading',
    answerPromptParams: {},
    choices: [],
    choiceLabelKeys: null,
    ignorePunctuation: false,
    isSentence: false,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  };
}

/**
 * Chiều "trộn" sinh HAI câu cho mỗi từ (nghĩa và cách đọc) chứ không bốc ngẫu nhiên
 * một chiều — xem `kanjiQuestionsPerItem`.
 */
export function buildKanjiWordQuestions(
  words: readonly RadicalWord[],
  radical: Radical,
  config: PracticeConfig,
): PracticeQuestion[] {
  const asks: WordAsk[] =
    config.kanjiMode === 'word-reading'
      ? ['reading']
      : config.kanjiMode === 'word-meaning'
        ? ['meaning']
        : ['meaning', 'reading'];

  return words.flatMap((word) => asks.map((ask) => wordQuestion(word, radical, ask, config)));
}
