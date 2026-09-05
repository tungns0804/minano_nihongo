import {
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  RecapItem,
  makeQuestion,
  recap,
  recapJp,
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

  const lines: RecapItem[] = [
    recapJp('radical.col.radical', forms),
    recap('kanji.col.hanViet', entry.hanViet),
    recap('radical.col.meaning', entry.meaning),
    recapJp('radical.col.japanese', entry.japanese),
    recap('radical.col.strokes', String(entry.strokes)),
  ];
  if (examples) lines.push(recapJp('radical.col.kanjiExamples', examples));

  return {
    id: entry.id,
    title: entry.char,
    titleIsJapanese: true,
    subtitle: entry.hanViet,
    detail: entry.meaning,
    detailSuffixKey: null,
    recap: lines,
  };
}

export function buildRadicalHanVietQuestions(
  entries: readonly RadicalEntry[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return entries.map((entry) =>
    makeQuestion({
      subject: radicalSubject(entry),
      labelKey: 'radical.label.radicalHanViet',
      // Hỏi bằng chữ chính, không kèm biến thể: 亻 đứng cạnh 人 là đã nói gần hết
      // đáp án rồi. Biến thể hiện lại ở phần phản hồi sau khi chấm.
      prompt: entry.char,
      // Gợi ý là MỘT chữ Hán ghép từ bộ này. Bộ thủ đứng trơ gần như không có manh
      // mối, mà nhìn 休 thì nhớ ra NHÂN dễ hơn hẳn nhìn trơ 亻.
      hint: config.showHanViet ? (entry.kanji[0]?.char ?? null) : null,
      hintIsJapanese: true,
      correctAnswer: entry.hanViet,
      acceptedAnswers: acceptedAnswersOf(entry.hanViet),
      answerPromptKey: 'radical.answerPrompt.hanViet',
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
    }),
  );
}

// ── Chiều 2 & 3: chữ ghép → âm Hán Việt / chiết tự ─────────────────────

function kanjiSubject(kanji: RadicalKanji, entry: RadicalEntry): QuestionSubject {
  const lines: RecapItem[] = [
    recapJp('kanji.col.kanji', kanji.char),
    recap('kanji.col.hanViet', kanji.hanViet),
    recapJp('radical.col.parts', kanji.parts.join(' + ')),
  ];
  if (kanji.partsHanViet) lines.push(recap('radical.col.partsHanViet', kanji.partsHanViet));
  lines.push(recapJp('radical.col.radical', `${entry.char} — ${entry.hanViet}`));
  // Từ ví dụ để chữ vừa học có chỗ bám vào; chữ nào kho từ chưa có thì bỏ hẳn
  // dòng này thay vì hiện một dòng trống.
  const word = kanji.words[0];
  if (word) {
    lines.push(recapJp('radical.col.word', `${word.japanese}（${word.reading}）— ${word.meaning}`));
  }
  lines.push(recap('kanji.col.level', kanji.level));

  return {
    id: kanji.id,
    title: kanji.char,
    titleIsJapanese: true,
    subtitle: kanji.hanViet,
    detail: kanji.parts.join(' + '),
    detailSuffixKey: null,
    recap: lines,
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

  return makeQuestion({
    subject: kanjiSubject(kanji, entry),
    labelKey: askingParts ? 'radical.label.kanjiParts' : 'radical.label.kanjiHanViet',
    prompt: kanji.char,
    // Gợi ý đổi theo chiều hỏi để không bao giờ lộ đáp án: hỏi âm Hán Việt của
    // chữ thì gợi ý bằng chiết tự, hỏi chiết tự thì gợi ý bằng một từ dùng chữ đó.
    hint: config.showHanViet
      ? askingParts
        ? (kanji.words[0]?.japanese ?? null)
        : kanji.parts.join(' + ')
      : null,
    hintIsJapanese: true,
    correctAnswer: answer,
    // Chiết tự gõ cách nào cũng được: "NHÂN MỘC", "NHÂN + MỘC", "NHÂN, MỘC".
    acceptedAnswers: askingParts
      ? [answer, answer.split(' ').join(' + '), answer.split(' ').join(', ')]
      : acceptedAnswersOf(answer),
    answerPromptKey: askingParts ? 'radical.answerPrompt.parts' : 'kanji.answerPrompt.hanViet',
    // Chiều chiết tự bỏ qua dấu câu và khoảng trắng khi chấm: đáp án là một CHUỖI
    // nhiều âm, bắt gõ đúng từng dấu cách thì sai vì lý do không liên quan.
    ignorePunctuation: askingParts,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  });
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
