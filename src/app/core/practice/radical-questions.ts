import {
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  RecapItem,
} from '../models/practice.model';
import type { RadicalEntry, RadicalKanji } from '../radical/radical.model';
import { acceptedAnswersOf } from '../utils/answer-check';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi cho khu "Bộ thủ".
 *
 * Cả ba chiều đều CHỈ gõ đáp án, không có trắc nghiệm — cùng lý do với khu Kanji:
 * bày sẵn bốn âm Hán Việt để chọn thì người học chỉ cần nhận mặt chữ, trong khi
 * cái cần nhớ ở đây là tự đọc ra được.
 */

// ── Chiều 1: bộ thủ → âm Hán Việt ──────────────────────────────────────

function radicalSubject(entry: RadicalEntry): QuestionSubject {
  const forms = [entry.char, ...entry.variants].join(' ');
  const examples = entry.kanji
    .slice(0, 6)
    .map((kanji) => kanji.char)
    .join(' ');

  const recap: RecapItem[] = [
    { labelKey: 'radical.col.radical', value: forms, valueKey: null, japanese: true },
    { labelKey: 'kanji.col.hanViet', value: entry.hanViet, valueKey: null, japanese: false },
    { labelKey: 'radical.col.meaning', value: entry.meaning, valueKey: null, japanese: false },
    { labelKey: 'radical.col.japanese', value: entry.japanese, valueKey: null, japanese: true },
    {
      labelKey: 'radical.col.strokes',
      value: String(entry.strokes),
      valueKey: null,
      japanese: false,
    },
  ];
  if (examples) {
    recap.push({
      labelKey: 'radical.col.kanjiExamples',
      value: examples,
      valueKey: null,
      japanese: true,
    });
  }

  return {
    id: entry.id,
    title: entry.char,
    titleIsJapanese: true,
    subtitle: entry.hanViet,
    detail: entry.meaning,
    detailSuffixKey: null,
    recap,
  };
}

export function buildRadicalHanVietQuestions(
  entries: readonly RadicalEntry[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return entries.map((entry) => ({
    subject: radicalSubject(entry),
    labelKey: 'radical.label.radicalHanViet',
    labelParams: {},
    // Hỏi bằng chữ chính, không kèm biến thể: 亻 đứng cạnh 人 là đã nói gần hết
    // đáp án rồi. Biến thể hiện lại ở phần phản hồi sau khi chấm.
    prompt: entry.char,
    promptIsJapanese: true,
    // Gợi ý là MỘT chữ Hán ghép từ bộ này. Bộ thủ đứng trơ gần như không có manh
    // mối, mà nhìn 休 thì nhớ ra NHÂN dễ hơn hẳn nhìn trơ 亻.
    hint: config.showHanViet ? (entry.kanji[0]?.char ?? null) : null,
    hintIsJapanese: true,
    correctAnswer: entry.hanViet,
    correctAnswerKey: null,
    acceptedAnswers: acceptedAnswersOf(entry.hanViet),
    answerIsJapanese: false,
    answerPromptKey: 'radical.answerPrompt.hanViet',
    answerPromptParams: {},
    choices: [],
    choiceLabelKeys: null,
    ignorePunctuation: false,
    isSentence: false,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  }));
}

// ── Chiều 2 & 3: chữ ghép → âm Hán Việt / chiết tự ─────────────────────

function kanjiSubject(kanji: RadicalKanji, entry: RadicalEntry): QuestionSubject {
  const recap: RecapItem[] = [
    { labelKey: 'kanji.col.kanji', value: kanji.char, valueKey: null, japanese: true },
    { labelKey: 'kanji.col.hanViet', value: kanji.hanViet, valueKey: null, japanese: false },
    { labelKey: 'radical.col.parts', value: kanji.parts.join(' + '), valueKey: null, japanese: true },
  ];
  if (kanji.partsHanViet) {
    recap.push({
      labelKey: 'radical.col.partsHanViet',
      value: kanji.partsHanViet,
      valueKey: null,
      japanese: false,
    });
  }
  recap.push({
    labelKey: 'radical.col.radical',
    value: `${entry.char} — ${entry.hanViet}`,
    valueKey: null,
    japanese: true,
  });
  // Từ ví dụ để chữ vừa học có chỗ bám vào; chữ nào kho từ chưa có thì bỏ hẳn
  // dòng này thay vì hiện một dòng trống.
  const word = kanji.words[0];
  if (word) {
    recap.push({
      labelKey: 'radical.col.word',
      value: `${word.japanese}（${word.reading}）— ${word.meaning}`,
      valueKey: null,
      japanese: true,
    });
  }
  recap.push({ labelKey: 'kanji.col.level', value: kanji.level, valueKey: null, japanese: false });

  return {
    id: kanji.id,
    title: kanji.char,
    titleIsJapanese: true,
    subtitle: kanji.hanViet,
    detail: kanji.parts.join(' + '),
    detailSuffixKey: null,
    recap,
  };
}

type KanjiAsk = 'hanviet' | 'parts';

function kanjiQuestion(
  kanji: RadicalKanji,
  entry: RadicalEntry,
  ask: KanjiAsk,
  config: PracticeConfig,
): PracticeQuestion {
  const askingParts = ask === 'parts';
  const answer = askingParts ? kanji.partsHanViet : kanji.hanViet;

  return {
    subject: kanjiSubject(kanji, entry),
    labelKey: askingParts ? 'radical.label.kanjiParts' : 'radical.label.kanjiHanViet',
    labelParams: {},
    prompt: kanji.char,
    promptIsJapanese: true,
    // Gợi ý đổi theo chiều hỏi để không bao giờ lộ đáp án: hỏi âm Hán Việt của
    // chữ thì gợi ý bằng chiết tự, hỏi chiết tự thì gợi ý bằng một từ dùng chữ đó.
    hint: config.showHanViet
      ? askingParts
        ? (kanji.words[0]?.japanese ?? null)
        : kanji.parts.join(' + ')
      : null,
    hintIsJapanese: true,
    correctAnswer: answer,
    correctAnswerKey: null,
    // Chiết tự gõ cách nào cũng được: "NHÂN MỘC", "NHÂN + MỘC", "NHÂN, MỘC".
    acceptedAnswers: askingParts
      ? [answer, answer.split(' ').join(' + '), answer.split(' ').join(', ')]
      : acceptedAnswersOf(answer),
    answerIsJapanese: false,
    answerPromptKey: askingParts
      ? 'radical.answerPrompt.parts'
      : 'kanji.answerPrompt.hanViet',
    answerPromptParams: {},
    choices: [],
    choiceLabelKeys: null,
    // Chiều chiết tự bỏ qua dấu câu và khoảng trắng khi chấm: đáp án là một CHUỖI
    // nhiều âm, bắt gõ đúng từng dấu cách thì sai vì lý do không liên quan.
    ignorePunctuation: askingParts,
    isSentence: false,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  };
}

/**
 * Chiều "trộn" sinh HAI câu cho mỗi chữ (âm Hán Việt và chiết tự) chứ không bốc
 * ngẫu nhiên một chiều — xem `radicalQuestionsPerItem`.
 */
export function buildRadicalKanjiQuestions(
  kanjiList: readonly RadicalKanji[],
  entry: RadicalEntry,
  config: PracticeConfig,
): PracticeQuestion[] {
  const asks: KanjiAsk[] =
    config.radicalMode === 'kanji-parts'
      ? ['parts']
      : config.radicalMode === 'kanji-hanviet'
        ? ['hanviet']
        : ['hanviet', 'parts'];

  return kanjiList.flatMap((kanji) =>
    asks
      // Chữ chưa tra đủ âm Hán Việt của các bộ thì không có đáp án cho chiều chiết
      // tự — bỏ đúng câu đó chứ không bỏ cả chữ.
      .filter((ask) => ask !== 'parts' || kanji.partsHanViet !== '')
      .map((ask) => kanjiQuestion(kanji, entry, ask, config)),
  );
}
