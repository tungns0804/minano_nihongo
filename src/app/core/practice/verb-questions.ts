import type { MessageKey } from '../i18n/messages';
import { MESSAGES } from '../i18n/messages';
import {
  VERB_FORM_LABEL_KEY,
  VERB_GROUP_LABEL_KEY,
  VerbForm,
  VerbForms,
  VerbGroup,
  conjugate,
  conjugateAsGroup,
} from '../japanese/conjugation';
import {
  CHOICE_COUNT,
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  VerbPracticeMode,
} from '../models/practice.model';
import { VerbEntry } from '../models/vocabulary.model';
import { shuffle } from '../utils/random';
import { limitAttempts } from './vocabulary-questions';

/** Các thể được phép chọn cho từng dạng câu hỏi. */
export const FORMS_BY_MODE: Record<VerbPracticeMode, readonly VerbForm[]> = {
  // Hỏi từ thể ます thì không hỏi lại chính thể ます.
  'masu-to-form': ['dictionary', 'te', 'ta', 'nai'],
  'form-to-masu': ['dictionary', 'te', 'ta', 'nai'],
  'meaning-to-form': ['masu', 'dictionary', 'te', 'ta', 'nai'],
  'identify-group': [],
};

const ALL_GROUPS: readonly VerbGroup[] = [1, 2, 3];

/** Một động từ đã chia sẵn, kèm entry gốc. */
interface ConjugatedVerb {
  entry: VerbEntry;
  forms: VerbForms;
}

/** Chia trước toàn bộ động từ, bỏ qua những từ khai báo sai nhóm. */
export function conjugateAll(verbs: readonly VerbEntry[]): ConjugatedVerb[] {
  return verbs.flatMap((entry) => {
    const result = conjugate(entry.masu, entry.group);
    return result.ok ? [{ entry, forms: result.forms }] : [];
  });
}

/** Những động từ engine không chia được — dùng để cảnh báo dữ liệu sai. */
export function findBrokenVerbs(
  verbs: readonly VerbEntry[],
): { entry: VerbEntry; reason: string }[] {
  return verbs.flatMap((entry) => {
    const result = conjugate(entry.masu, entry.group);
    return result.ok ? [] : [{ entry, reason: result.reason }];
  });
}

function subjectOf(verb: ConjugatedVerb): QuestionSubject {
  const { entry, forms } = verb;
  return {
    id: entry.id,
    title: entry.masu,
    titleIsJapanese: true,
    subtitle: entry.hanViet,
    detail: entry.vietnamese,
    detailSuffixKey: VERB_GROUP_LABEL_KEY[entry.group],
    recap: [
      { labelKey: 'lesson.col.meaningShort', value: entry.vietnamese, valueKey: null, japanese: false },
      // Tên nhóm phải dịch nên đi qua valueKey thay vì chữ sẵn.
      { labelKey: 'lesson.col.group', value: '', valueKey: VERB_GROUP_LABEL_KEY[entry.group], japanese: false },
      { labelKey: 'verbForm.masu.short', value: forms.masu, valueKey: null, japanese: true },
      { labelKey: 'verbForm.dictionary.short', value: forms.dictionary, valueKey: null, japanese: true },
      { labelKey: 'verbForm.te.short', value: forms.te, valueKey: null, japanese: true },
      { labelKey: 'verbForm.ta.short', value: forms.ta, valueKey: null, japanese: true },
      { labelKey: 'verbForm.nai.short', value: forms.nai, valueKey: null, japanese: true },
    ],
  };
}

/**
 * Dựng câu hỏi cho bài động từ.
 *
 * Với các dạng có chọn thể, mỗi cặp (động từ × thể) là một câu hỏi riêng, nên
 * chọn 4 thể cho 12 động từ sẽ ra 48 câu. Dùng tuỳ chọn "Số câu" để cắt bớt.
 */
export function buildVerbQuestions(
  pool: readonly VerbEntry[],
  allVerbs: readonly VerbEntry[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const poolVerbs = conjugateAll(pool);
  // Nguồn đáp án nhiễu lấy từ toàn bài để luyện riêng nhóm Favorite vẫn đủ lựa chọn.
  const allConjugated = conjugateAll(allVerbs);

  if (config.verbMode === 'identify-group') {
    return poolVerbs.map((verb) => buildGroupQuestion(verb, config));
  }

  const forms = config.verbForms.filter((form) => FORMS_BY_MODE[config.verbMode].includes(form));
  const usableForms = forms.length > 0 ? forms : FORMS_BY_MODE[config.verbMode];

  const questions: PracticeQuestion[] = [];
  for (const verb of poolVerbs) {
    for (const form of usableForms) {
      questions.push(buildFormQuestion(verb, form, allConjugated, config));
    }
  }
  return questions;
}

/**
 * "帰ります thuộc nhóm mấy?" — lựa chọn luôn là cả ba nhóm.
 *
 * Giá trị lựa chọn là "1"/"2"/"3" chứ không phải chữ, để đổi ngôn ngữ giữa chừng
 * không làm hỏng việc chấm. Chữ hiển thị lấy từ `choiceLabelKeys`.
 */
function buildGroupQuestion(verb: ConjugatedVerb, config: PracticeConfig): PracticeQuestion {
  const correctAnswer = String(verb.entry.group);
  const choices = config.answerMode === 'choice' ? shuffle(ALL_GROUPS.map(String)) : [];
  const choiceLabelKeys = Object.fromEntries(
    ALL_GROUPS.map((group) => [String(group), VERB_GROUP_LABEL_KEY[group]]),
  );

  return {
    subject: subjectOf(verb),
    labelKey: 'practice.label.identifyGroup',
    labelParams: {},
    prompt: verb.entry.masu,
    promptIsJapanese: true,
    hint: config.showHanViet ? verb.entry.vietnamese : null,
    correctAnswer,
    correctAnswerKey: VERB_GROUP_LABEL_KEY[verb.entry.group],
    // Gõ "1" hay tên nhóm ở BẤT KỲ ngôn ngữ nào cũng được tính đúng.
    acceptedAnswers: [correctAnswer, ...allLanguageTexts(VERB_GROUP_LABEL_KEY[verb.entry.group])],
    answerIsJapanese: false,
    answerPromptKey: 'practice.answerPrompt.group',
    answerPromptParams: {},
    choices,
    choiceLabelKeys,
    ignorePunctuation: false,
    isSentence: false,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, config.answerMode, choices.length),
  };
}

/** Chữ của một khoá ở mọi ngôn ngữ — để chấm không phụ thuộc ngôn ngữ đang chọn. */
function allLanguageTexts(key: MessageKey): string[] {
  return Object.values(MESSAGES[key]);
}

function buildFormQuestion(
  verb: ConjugatedVerb,
  form: VerbForm,
  allConjugated: readonly ConjugatedVerb[],
  config: PracticeConfig,
): PracticeQuestion {
  const askingForMasu = config.verbMode === 'form-to-masu';
  const correctAnswer = askingForMasu ? verb.forms.masu : verb.forms[form];

  const prompt = promptOf(verb, form, config.verbMode);
  const label = labelOf(form, config.verbMode);

  const choices =
    config.answerMode === 'choice'
      ? buildFormChoices(verb, form, correctAnswer, prompt, allConjugated, askingForMasu)
      : [];

  return {
    subject: subjectOf(verb),
    labelKey: label.key,
    labelParams: label.params,
    prompt,
    promptIsJapanese: config.verbMode !== 'meaning-to-form',
    // Ở dạng "nghĩa → thể" thì nghĩa chính là câu hỏi nên không hiện lại làm gợi ý.
    hint:
      config.showHanViet && config.verbMode !== 'meaning-to-form' ? verb.entry.vietnamese : null,
    correctAnswer,
    correctAnswerKey: null,
    acceptedAnswers: [correctAnswer],
    answerIsJapanese: true,
    answerPromptKey: askingForMasu ? 'practice.answerPrompt.masu' : 'practice.answerPrompt.form',
    answerPromptParams: askingForMasu ? {} : { form: VERB_FORM_LABEL_KEY[form] },
    choices,
    choiceLabelKeys: null,
    ignorePunctuation: false,
    isSentence: false,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, config.answerMode, choices.length),
  };
}

function promptOf(verb: ConjugatedVerb, form: VerbForm, mode: VerbPracticeMode): string {
  switch (mode) {
    case 'form-to-masu':
      return verb.forms[form];
    case 'meaning-to-form':
      return verb.entry.vietnamese;
    default:
      return verb.forms.masu;
  }
}

function labelOf(
  form: VerbForm,
  mode: VerbPracticeMode,
): { key: MessageKey; params: Record<string, MessageKey> } {
  switch (mode) {
    case 'form-to-masu':
      return {
        key: 'practice.label.toForm',
        params: { from: VERB_FORM_LABEL_KEY[form], to: VERB_FORM_LABEL_KEY.masu },
      };
    case 'meaning-to-form':
      return { key: 'practice.label.meaningToForm', params: { to: VERB_FORM_LABEL_KEY[form] } };
    default:
      return {
        key: 'practice.label.toForm',
        params: { from: VERB_FORM_LABEL_KEY.masu, to: VERB_FORM_LABEL_KEY[form] },
      };
  }
}

/**
 * Đáp án nhiễu cho câu chia thể, ưu tiên những cái sát với lỗi thật của người học:
 *
 *  1. Chính động từ đó chia theo NHÓM SAI — 守ります chia nhầm nhóm 2 ra 守りて.
 *     Đây là lỗi phổ biến nhất nên là đáp án nhiễu tốt nhất.
 *  2. Chính động từ đó nhưng ở THỂ KHÁC — hỏi thể て mà đưa 逃げた, 逃げない.
 *     Kiểm tra xem người học có phân biệt được các thể không.
 *  3. Cùng thể đó của động từ khác — khi hai nguồn trên không đủ.
 */
function buildFormChoices(
  verb: ConjugatedVerb,
  form: VerbForm,
  correctAnswer: string,
  prompt: string,
  allConjugated: readonly ConjugatedVerb[],
  askingForMasu: boolean,
): string[] {
  const used = new Set([correctAnswer, prompt]);
  const distractors: string[] = [];

  const add = (text: string | undefined | null) => {
    if (!text || used.has(text) || distractors.length >= CHOICE_COUNT - 1) return;
    used.add(text);
    distractors.push(text);
  };

  const answerForm: VerbForm = askingForMasu ? 'masu' : form;

  // 1. Chia sai nhóm.
  for (const group of ALL_GROUPS) {
    if (group === verb.entry.group) continue;
    add(conjugateAsGroup(verb.entry.masu, group)?.[answerForm]);
  }

  // 2. Thể khác của chính động từ đó.
  if (!askingForMasu) {
    for (const other of shuffle(Object.keys(verb.forms) as VerbForm[])) {
      add(verb.forms[other]);
    }
  }

  // 3. Cùng thể của động từ khác.
  for (const other of shuffle(allConjugated)) {
    if (other.entry.id === verb.entry.id) continue;
    add(other.forms[answerForm]);
  }

  return shuffle([correctAnswer, ...distractors]);
}
