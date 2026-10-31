import type { ExerciseMode } from '../exercises/exercise.model';
import type { MessageKey } from '../i18n/messages';
import {
  KeigoForm,
  ORDER_BLANKS,
  STAR_BLANKS,
  TaisakuKeigo,
  TaisakuKind,
  TaisakuQuestion,
  TaisakuUnit,
  TaisakuWord,
  taisakuSource,
  taisakuTopic,
  taisakuUnitById,
} from '../exercises/taisaku-n4';
import { plainText } from '../translation/markup';
import { shuffle } from '../utils/random';
import {
  CHOICE_COUNT,
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
 * Dựng câu hỏi cho bài "Đề luyện N4 · 直前対策".
 *
 * Câu soạn sẵn của sách giữ NGUYÊN đề, lựa chọn và thứ tự lựa chọn như sách: đây là đề
 * luyện thi, đổi thứ tự thì "đáp án 3" người học dò lại trong sách không còn là đáp án 3.
 * Dạng "Xếp cả câu" của câu ★ dùng lại khu bấm mảnh của bài ngữ pháp N4, chấm như câu gõ.
 *
 * Bảng từ của phần 付録 không có câu hỏi soạn sẵn: Nhật → Việt chọn nghĩa, Việt → Nhật
 * chọn từ, đáp án nhiễu lấy trong CÙNG chủ đề — hỏi 首 thì nhiễu là のど, 腕 chứ không
 * phải サッカー, nên phải nhớ đúng từ chứ không đoán theo chủ đề được.
 */

const LABEL: Record<TaisakuKind, MessageKey> = {
  'kanji-reading': 'taisaku.label.kanjiReading',
  'kanji-writing': 'taisaku.label.kanjiWriting',
  context: 'taisaku.label.context',
  paraphrase: 'taisaku.label.paraphrase',
  usage: 'taisaku.label.usage',
  grammar: 'taisaku.label.grammar',
  star: 'taisaku.label.star',
  passage: 'taisaku.label.passage',
  fill: 'taisaku.label.fill',
  pick: 'taisaku.label.pick',
};

/** Tên câu ở màn hình kết quả: một dòng, cắt bớt câu dài. */
const TITLE_LENGTH = 40;

function shorten(text: string): string {
  return text.length > TITLE_LENGTH ? `${text.slice(0, TITLE_LENGTH)}…` : text;
}

/** Tối đa `count` phần tử khác nhau và khác `correct`, theo thứ tự ngẫu nhiên. */
function distractors(candidates: readonly string[], correct: string, count: number): string[] {
  const seen = new Set([correct, '']);
  const result: string[] = [];
  for (const candidate of candidates) {
    if (result.length >= count) break;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    result.push(candidate);
  }
  return result;
}

// ── Câu soạn sẵn ─────────────────────────────────────────────────────────

function questionSubject(question: TaisakuQuestion): QuestionSubject {
  const source = taisakuSource(question);
  return {
    id: question.id,
    title: shorten(examText(question.prompt.replace('【★】', STAR_BLANKS))),
    titleIsJapanese: true,
    subtitle: examText(question.answer),
    detail: source,
    detailSuffixKey: null,
    recap: [recapJp('taisaku.col.source', source)],
  };
}

function choiceQuestion(question: TaisakuQuestion, config: PracticeConfig): PracticeQuestion {
  const prompt = question.prompt.replace('【★】', STAR_BLANKS);
  return makeQuestion({
    subject: questionSubject(question),
    labelKey: LABEL[question.kind],
    prompt: examText(prompt),
    correctAnswer: question.answer,
    acceptedAnswers: [question.answer],
    answerIsJapanese: true,
    answerPromptKey: 'taisaku.answerPrompt',
    choices: [...question.options],
    // Dạng "cách dùng" hỏi trên một từ trơ — giữ cỡ chữ to như câu từ vựng.
    isSentence: question.kind !== 'usage',
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', question.options.length),
    exam: { prompt, markupChoices: true, passage: question.passage, complete: question.complete },
  });
}

/** Câu ★ ở dạng "Xếp cả câu": bấm bốn mảnh theo đúng thứ tự. */
function orderQuestion(question: TaisakuQuestion, config: PracticeConfig): PracticeQuestion {
  const prompt = question.prompt.replace('【★】', ORDER_BLANKS);
  return makeQuestion({
    subject: questionSubject(question),
    labelKey: 'taisaku.label.order',
    prompt: examText(prompt),
    correctAnswer: question.ordered.join(' '),
    acceptedAnswers: [plainText(question.ordered.join(''))],
    answerIsJapanese: true,
    answerPromptKey: 'exercise.answerPrompt.order',
    isSentence: true,
    chunks: [...question.ordered],
    maxWrongAttempts: Math.max(1, config.maxWrongAttempts),
    exam: { prompt, markupChoices: true, passage: null, complete: question.complete },
  });
}

// ── Bảng từ của 付録 ─────────────────────────────────────────────────────

function wordQuestion(word: TaisakuWord, config: PracticeConfig): PracticeQuestion {
  const peers = (taisakuTopic(word.topic)?.words ?? []).filter((item) => item.id !== word.id);
  const subject: QuestionSubject = {
    id: word.id,
    title: plainText(word.word),
    titleIsJapanese: true,
    subtitle: word.meaning,
    detail: `付録 ${word.topic}`,
    detailSuffixKey: null,
    recap: [
      recapJp('taisaku.col.word', plainText(word.word)),
      recap('lesson.col.meaningShort', word.meaning),
      ...(word.example ? [recapJp('taisaku.col.example', examText(word.example))] : []),
    ],
  };

  if (config.exerciseMode === 'tk-meaning-word') {
    const choices = shuffle([
      word.word,
      ...distractors(shuffle(peers.map((item) => item.word)), word.word, CHOICE_COUNT - 1),
    ]);
    return makeQuestion({
      subject,
      labelKey: 'taisaku.label.meaningWord',
      prompt: word.meaning,
      promptIsJapanese: false,
      correctAnswer: word.word,
      answerIsJapanese: true,
      answerPromptKey: 'taisaku.answerPrompt',
      choices,
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
      exam: { prompt: word.meaning, markupChoices: true, passage: null, complete: null },
    });
  }

  const choices = shuffle([
    word.meaning,
    ...distractors(shuffle(peers.map((item) => item.meaning)), word.meaning, CHOICE_COUNT - 1),
  ]);
  return makeQuestion({
    subject,
    labelKey: 'taisaku.label.wordMeaning',
    prompt: plainText(word.word),
    // Câu ví dụ của sách làm gợi ý: từ trơ như いっぱい, たいてい khó đoán nghĩa nếu
    // không thấy nó nằm trong câu.
    hint: config.showHanViet && word.example ? examText(word.example) : null,
    hintIsJapanese: true,
    correctAnswer: word.meaning,
    answerPromptKey: 'taisaku.answerPrompt',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
    exam: { prompt: word.word, markupChoices: false, passage: null, complete: null },
  });
}

/**
 * Một vế kính ngữ của một động từ. Nhiễu đầu tiên luôn là vế CÒN LẠI của chính động từ
 * đó (いらっしゃる ↔ まいる) — nhầm tôn kính với khiêm nhường mới là lỗi hay gặp, chứ
 * nhầm sang động từ khác thì ít.
 */
function keigoQuestion(keigo: TaisakuKeigo, form: KeigoForm, id: string, config: PracticeConfig): PracticeQuestion {
  const rows = taisakuTopic(keigo.topic)?.keigo ?? [];
  const correct = keigo[form];
  const other = form === 'sonkei' ? keigo.kenjou : keigo.sonkei;
  const pool = [other, ...shuffle(rows.flatMap((row) => [row.sonkei, row.kenjou]))];
  const choices = shuffle([correct, ...distractors(pool, correct, CHOICE_COUNT - 1)]);

  return makeQuestion({
    subject: {
      id,
      title: plainText(keigo.plain),
      titleIsJapanese: true,
      subtitle: plainText(correct),
      detail: `付録 ${keigo.topic}`,
      detailSuffixKey: null,
      recap: [
        recapJp('taisaku.col.sonkei', plainText(keigo.sonkei) || '—'),
        recapJp('taisaku.col.kenjou', plainText(keigo.kenjou) || '—'),
        recap('lesson.col.meaningShort', keigo.meaning),
      ],
    },
    labelKey: form === 'sonkei' ? 'taisaku.label.sonkei' : 'taisaku.label.kenjou',
    prompt: plainText(keigo.plain),
    hint: keigo.meaning,
    correctAnswer: correct,
    answerIsJapanese: true,
    answerPromptKey: 'taisaku.answerPrompt',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
    exam: { prompt: keigo.plain, markupChoices: true, passage: null, complete: null },
  });
}

function unitQuestion(unit: TaisakuUnit, config: PracticeConfig): PracticeQuestion {
  switch (unit.type) {
    case 'word':
      return wordQuestion(unit.word, config);
    case 'keigo':
      return keigoQuestion(unit.keigo, unit.form, unit.id, config);
    case 'question':
      return unit.question.kind === 'star' && config.exerciseMode === 'tk-order'
        ? orderQuestion(unit.question, config)
        : choiceQuestion(unit.question, config);
  }
}

export function buildTaisakuQuestions(
  units: readonly TaisakuUnit[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return units.map((unit) => unitQuestion(unit, config));
}

/**
 * Câu của phiên Ôn tập cho một mục trong lịch ôn. Từ của bảng từ hỏi theo chiều người học
 * chọn ở trang Ôn tập; câu soạn sẵn thì hỏi y như sách (câu ★ hỏi ô ★, không bắt xếp).
 */
export function buildTaisakuReviewQuestion(
  id: string,
  toJapanese: boolean,
  configOf: (exerciseMode: ExerciseMode) => PracticeConfig,
): PracticeQuestion | null {
  const unit = taisakuUnitById(id);
  if (!unit) return null;
  const mode: ExerciseMode =
    unit.type === 'word' ? (toJapanese ? 'tk-meaning-word' : 'tk-word-meaning') : 'tk-book';
  return unitQuestion(unit, configOf(mode));
}
