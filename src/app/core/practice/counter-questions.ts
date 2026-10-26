import {
  CounterItem,
  counterDistractors,
  counterGroupOf,
} from '../exercises/counters';
import {
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  RecapItem,
  makeQuestion,
  recap,
  recapJp,
} from './practice.model';
import { shuffle } from '../utils/random';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi cho bài "Số đếm & trợ số từ".
 *
 *  counter-choice   3本 → chọn さんぼん giữa さんほん / さんぽん / みほん
 *  counter-reading  3本 → gõ さんぼん
 *  counter-vi-jp    "3 cây/chai (vật dài)" → gõ さんぼん hoặc 3本
 *
 * Đáp án nhiễu của trắc nghiệm là các cách biến âm SAI của chính mục đó (xem
 * `counterDistractors`), không phải cách đọc của mục khác: hỏi 3本 mà bày ra
 * ろっぽん thì chỉ cần nhận số 3 là chọn được, chẳng luyện gì tới luật biến âm.
 */

const CHOICE_COUNT = 4;

/**
 * Ngày trong tháng luôn kèm câu tiếng Việt: 1日 đọc ついたち (mùng 1) hay いちにち
 * (một ngày) tuỳ nghĩa — tắt gợi ý thì câu hỏi không có đáp án duy nhất.
 */
function needsMeaning(item: CounterItem): boolean {
  return item.group === 'nichi';
}

function counterSubject(item: CounterItem): QuestionSubject {
  const group = counterGroupOf(item);
  const lines: RecapItem[] = [
    recapJp('lesson.col.reading', item.readings.join(' / ')),
    recap('lesson.col.meaningShort', item.meaning),
  ];
  if (group.counter) {
    lines.push(recapJp('exercise.counter.col.counter', `${group.counter}（${group.reading}）`));
  }
  if (group.notes.length > 0) lines.push(recap('exercise.counter.col.rule', group.notes[0]));

  return {
    id: item.id,
    title: item.written,
    titleIsJapanese: true,
    subtitle: item.readings[0],
    detail: item.meaning,
    detailSuffixKey: null,
    recap: lines,
  };
}

function counterQuestion(item: CounterItem, config: PracticeConfig): PracticeQuestion {
  const subject = counterSubject(item);

  if (config.exerciseMode === 'counter-vi-jp') {
    const group = counterGroupOf(item);
    return makeQuestion({
      subject,
      labelKey: 'exercise.label.counterViJp',
      prompt: item.meaning,
      promptIsJapanese: false,
      // Gợi ý là trợ số từ cần dùng — biết dùng 本 rồi thì phần còn lại là luật biến âm.
      hint: config.showHanViet && group.counter ? `～${group.counter}` : null,
      hintIsJapanese: true,
      correctAnswer: item.readings[0],
      acceptedAnswers: [...new Set([...item.readings, item.written, ...item.writtenForms])],
      answerIsJapanese: true,
      answerPromptKey: 'exercise.answerPrompt.counterViJp',
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
    });
  }

  const hint = config.showHanViet || needsMeaning(item) ? item.meaning : null;

  if (config.exerciseMode === 'counter-choice') {
    const choices = shuffle([
      item.readings[0],
      ...counterDistractors(item, CHOICE_COUNT - 1, shuffle),
    ]);
    return makeQuestion({
      subject,
      labelKey: 'exercise.label.counterRead',
      prompt: item.written,
      hint,
      correctAnswer: item.readings[0],
      acceptedAnswers: [...item.readings],
      answerIsJapanese: true,
      answerPromptKey: 'exercise.answerPrompt.counterReading',
      choices,
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
    });
  }

  return makeQuestion({
    subject,
    labelKey: 'exercise.label.counterRead',
    prompt: item.written,
    hint,
    correctAnswer: item.readings[0],
    acceptedAnswers: [...item.readings],
    answerIsJapanese: true,
    answerPromptKey: 'exercise.answerPrompt.counterReading',
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  });
}

export function buildCounterQuestions(
  items: readonly CounterItem[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return items.map((item) => counterQuestion(item, config));
}
