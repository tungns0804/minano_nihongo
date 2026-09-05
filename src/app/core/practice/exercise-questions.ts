import type { ExerciseVerb, TransitivityPair } from '../exercises/exercise.model';
import type { MessageKey } from '../i18n/messages';
import {
  VERB_FORM_LABEL_KEY,
  VERB_GROUP_LABEL_KEY,
  VerbForm,
  VerbForms,
  conjugate,
} from '../japanese/conjugation';
import {
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  makeQuestion,
  recap,
  recapJp,
  recapKey,
} from '../models/practice.model';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi cho khu "Bài tập".
 *
 * Hai bài tập đều CHỈ gõ đáp án, không có trắc nghiệm: bày sẵn bốn động từ để
 * chọn thì người học chỉ cần nhận mặt chữ, trong khi cả hai bài này đều nhằm bắt
 * nhớ ra và viết được đúng dạng.
 *
 * Đáp án chấp nhận cả chữ kanji lẫn chữ kana (帰って / かえって): engine chia
 * thuần theo kana ở đuôi nên chia luôn được cột cách đọc, và người chưa quen bộ
 * gõ kanji vẫn luyện được đúng phần ngữ pháp mà bài tập đang dạy.
 */

/** Các thể được đem ra hỏi ở bài chuyển thể (không hỏi lại chính thể ます). */
export const EXERCISE_FORMS: readonly VerbForm[] = ['dictionary', 'te', 'ta', 'nai'];

/** Chiều hỏi của một câu cụ thể, đã tách khỏi chế độ "trộn". */
type PairDirection = 'to-transitive' | 'to-intransitive';
type FormDirection = 'masu-to-form' | 'form-to-masu';

function uniqueAnswers(...answers: string[]): string[] {
  return [...new Set(answers.filter((answer) => answer.length > 0))];
}

// ── Bài 1: tự động từ ↔ tha động từ ────────────────────────────────────

function pairSubject(pair: TransitivityPair): QuestionSubject {
  const { intransitive, transitive } = pair;
  return {
    id: pair.id,
    title: `${intransitive.masu} ↔ ${transitive.masu}`,
    titleIsJapanese: true,
    subtitle: pair.level,
    detail: `${intransitive.meaning} ↔ ${transitive.meaning}`,
    detailSuffixKey: null,
    recap: [
      recapJp('exercise.col.intransitive', `${intransitive.masu}（${intransitive.reading}）`),
      recapJp('exercise.col.transitive', `${transitive.masu}（${transitive.reading}）`),
      recap('lesson.col.meaningShort', `${intransitive.meaning} ↔ ${transitive.meaning}`),
      recap('exercise.col.level', pair.level),
    ],
  };
}

function pairQuestion(
  pair: TransitivityPair,
  direction: PairDirection,
  config: PracticeConfig,
): PracticeQuestion {
  const askingTransitive = direction === 'to-transitive';
  const prompt = askingTransitive ? pair.intransitive : pair.transitive;
  const answer = askingTransitive ? pair.transitive : pair.intransitive;

  return makeQuestion({
    subject: pairSubject(pair),
    labelKey: askingTransitive ? 'exercise.label.toTransitive' : 'exercise.label.toIntransitive',
    prompt: prompt.masu,
    // Nghĩa của chính vế đang hỏi, không phải vế phải trả lời: nghĩa của vế kia
    // gần như đọc thẳng ra đáp án ("mở cửa" → 開けます).
    hint: config.showHanViet ? prompt.meaning : null,
    correctAnswer: answer.masu,
    acceptedAnswers: uniqueAnswers(answer.masu, answer.reading),
    answerIsJapanese: true,
    answerPromptKey: askingTransitive
      ? 'exercise.answerPrompt.transitive'
      : 'exercise.answerPrompt.intransitive',
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  });
}

export function buildTransitivityQuestions(
  pairs: readonly TransitivityPair[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const directions: PairDirection[] =
    config.exerciseMode === 'to-intransitive'
      ? ['to-intransitive']
      : config.exerciseMode === 'to-transitive'
        ? ['to-transitive']
        : ['to-transitive', 'to-intransitive'];

  return pairs.flatMap((pair) =>
    directions.map((direction) => pairQuestion(pair, direction, config)),
  );
}

// ── Bài 2: thể lịch sự ↔ các thể ngắn ──────────────────────────────────

/** Một động từ đã chia sẵn cả dạng kanji lẫn dạng kana. */
interface ConjugatedExerciseVerb {
  verb: ExerciseVerb;
  forms: VerbForms;
  /** Các thể viết toàn kana; null khi cách đọc không chia được (dữ liệu sai). */
  readingForms: VerbForms | null;
}

/**
 * Chia trước toàn bộ động từ, bỏ qua từ nào engine không chia được.
 *
 * Không chia được nghĩa là dữ liệu khai sai nhóm — `npm run verify:conjugation`
 * chặn trường hợp đó, nên ở đây chỉ cần không làm hỏng cả phiên luyện.
 */
export function conjugateExerciseVerbs(
  verbs: readonly ExerciseVerb[],
): ConjugatedExerciseVerb[] {
  return verbs.flatMap((verb) => {
    const result = conjugate(verb.masu, verb.group);
    if (!result.ok) return [];
    const reading = conjugate(verb.reading, verb.group);
    return [{ verb, forms: result.forms, readingForms: reading.ok ? reading.forms : null }];
  });
}

function verbSubject(item: ConjugatedExerciseVerb): QuestionSubject {
  const { verb, forms } = item;
  return {
    id: verb.id,
    title: verb.masu,
    titleIsJapanese: true,
    subtitle: verb.reading,
    detail: verb.meaning,
    detailSuffixKey: VERB_GROUP_LABEL_KEY[verb.group],
    recap: [
      recap('lesson.col.meaningShort', verb.meaning),
      // Tên nhóm phải dịch nên đi qua valueKey thay vì chữ sẵn.
      recapKey('lesson.col.group', VERB_GROUP_LABEL_KEY[verb.group]),
      recapJp('lesson.col.reading', verb.reading),
      recapJp('verbForm.masu.short', forms.masu),
      recapJp('verbForm.dictionary.short', forms.dictionary),
      recapJp('verbForm.te.short', forms.te),
      recapJp('verbForm.ta.short', forms.ta),
      recapJp('verbForm.nai.short', forms.nai),
      recap('exercise.col.level', verb.level),
    ],
  };
}

function formQuestion(
  item: ConjugatedExerciseVerb,
  form: VerbForm,
  direction: FormDirection,
  config: PracticeConfig,
): PracticeQuestion {
  const askingForMasu = direction === 'form-to-masu';
  const answerForm: VerbForm = askingForMasu ? 'masu' : form;
  const promptForm: VerbForm = askingForMasu ? form : 'masu';

  const label: { key: MessageKey; params: Record<string, MessageKey> } = {
    key: 'practice.label.toForm',
    params: {
      from: VERB_FORM_LABEL_KEY[promptForm],
      to: VERB_FORM_LABEL_KEY[answerForm],
    },
  };

  return makeQuestion({
    subject: verbSubject(item),
    labelKey: label.key,
    labelParams: label.params,
    prompt: item.forms[promptForm],
    hint: config.showHanViet ? item.verb.meaning : null,
    correctAnswer: item.forms[answerForm],
    acceptedAnswers: uniqueAnswers(
      item.forms[answerForm],
      item.readingForms ? item.readingForms[answerForm] : '',
    ),
    answerIsJapanese: true,
    answerPromptKey: askingForMasu ? 'practice.answerPrompt.masu' : 'practice.answerPrompt.form',
    answerPromptParams: askingForMasu ? {} : { form: VERB_FORM_LABEL_KEY[form] },
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  });
}

/**
 * Mỗi cặp (động từ × thể) là một câu hỏi, nên chọn 4 thể cho 60 động từ sẽ ra
 * 240 câu — dùng tuỳ chọn "Số câu" để cắt bớt. Chiều "trộn" nhân đôi con số đó
 * vì mỗi cặp được hỏi cả xuôi lẫn ngược.
 */
export function buildVerbFormQuestions(
  verbs: readonly ExerciseVerb[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const forms = config.verbForms.filter((form) => EXERCISE_FORMS.includes(form));
  const usableForms = forms.length > 0 ? forms : EXERCISE_FORMS;

  const directions: FormDirection[] =
    config.exerciseMode === 'form-to-masu'
      ? ['form-to-masu']
      : config.exerciseMode === 'masu-to-form'
        ? ['masu-to-form']
        : ['masu-to-form', 'form-to-masu'];

  const questions: PracticeQuestion[] = [];
  for (const item of conjugateExerciseVerbs(verbs)) {
    for (const form of usableForms) {
      for (const direction of directions) {
        questions.push(formQuestion(item, form, direction, config));
      }
    }
  }
  return questions;
}
