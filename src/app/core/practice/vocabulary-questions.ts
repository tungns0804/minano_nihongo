import type { MessageKey } from '../i18n/messages';
import {
  CHOICE_COUNT,
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  directionInfo,
} from '../models/practice.model';
import { VocabularyWord, WordField, fieldIsJapanese, fieldValue } from '../models/vocabulary.model';
import { acceptedAnswersOf } from '../utils/answer-check';
import { shuffle } from '../utils/random';

const ANSWER_PROMPT_KEY: Record<WordField, MessageKey> = {
  japanese: 'practice.answerPrompt.japanese',
  vietnamese: 'practice.answerPrompt.vietnamese',
  hanViet: 'practice.answerPrompt.hanViet',
  reading: 'practice.answerPrompt.reading',
};

function subjectOf(word: VocabularyWord): QuestionSubject {
  return {
    id: word.id,
    title: word.japanese,
    titleIsJapanese: true,
    subtitle: word.hanViet,
    detail: word.vietnamese,
    detailSuffixKey: null,
    recap: [
      { labelKey: 'lesson.col.hanViet', value: word.hanViet, valueKey: null, japanese: false },
      { labelKey: 'lesson.col.japanese', value: word.japanese, valueKey: null, japanese: true },
      { labelKey: 'lesson.col.meaningShort', value: word.vietnamese, valueKey: null, japanese: false },
    ],
  };
}

/**
 * Dựng câu hỏi cho bài từ vựng.
 *
 * @param pool Các từ đem ra hỏi (toàn bộ bài hoặc chỉ nhóm Favorite).
 * @param allWords Toàn bộ từ của bài — dùng làm nguồn đáp án nhiễu, để khi chỉ
 *   luyện vài từ Favorite thì câu trắc nghiệm vẫn đủ 4 lựa chọn.
 */
export function buildVocabularyQuestions(
  pool: readonly VocabularyWord[],
  allWords: readonly VocabularyWord[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const info = directionInfo(config.direction);

  return pool.map((word) => {
    const correctAnswer = fieldValue(word, info.answer);
    const choices =
      config.answerMode === 'choice'
        ? buildChoices(word, correctAnswer, allWords, info.answer)
        : [];

    return {
      subject: subjectOf(word),
      labelKey: info.labelKey,
      labelParams: {},
      prompt: fieldValue(word, info.prompt),
      promptIsJapanese: fieldIsJapanese(info.prompt),
      hint: info.supportsHanVietHint && config.showHanViet ? word.hanViet : null,
      hintIsJapanese: false,
      correctAnswer,
      correctAnswerKey: null,
      acceptedAnswers: acceptedAnswersOf(correctAnswer),
      // Kana cũng là chữ Nhật: dùng font tiếng Nhật, bỏ hết khoảng trắng khi so
      // khớp, và hiện nhắc bật IME ở chế độ gõ.
      answerIsJapanese: fieldIsJapanese(info.answer),
      answerPromptKey: ANSWER_PROMPT_KEY[info.answer],
      answerPromptParams: {},
      choices,
      choiceLabelKeys: null,
      ignorePunctuation: false,
      isSentence: false,
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, config.answerMode, choices.length),
    };
  });
}

/**
 * Trắc nghiệm chỉ có (số lựa chọn - 1) đáp án sai, nên không thể sai nhiều hơn thế:
 * chọn hết đáp án sai là đã lộ đáp án đúng, lúc đó phải tính là sai luôn.
 */
export function limitAttempts(
  configured: number,
  answerMode: PracticeConfig['answerMode'],
  choiceCount: number,
): number {
  return answerMode === 'choice'
    ? Math.max(1, Math.min(configured, choiceCount - 1))
    : Math.max(1, configured);
}

function buildChoices(
  word: VocabularyWord,
  correctAnswer: string,
  allWords: readonly VocabularyWord[],
  answerField: WordField,
): string[] {
  const key = (text: string) => text.trim().toLowerCase();
  const used = new Set([key(correctAnswer)]);
  const distractors: string[] = [];

  for (const candidate of shuffle(allWords)) {
    if (distractors.length >= CHOICE_COUNT - 1) break;
    if (candidate.id === word.id) continue;

    const text = fieldValue(candidate, answerField);
    if (!text || used.has(key(text))) continue;

    used.add(key(text));
    distractors.push(text);
  }

  return shuffle([correctAnswer, ...distractors]);
}
