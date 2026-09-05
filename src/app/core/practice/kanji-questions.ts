import type { KanjiEntry, KanjiWord } from '../kanji/kanji.model';
import {
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  RecapItem,
  makeQuestion,
  recap,
  recapJp,
} from '../models/practice.model';
import { acceptedAnswersOf } from '../utils/answer-check';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi cho khu "Kanji".
 *
 * Cả ba chiều đều CHỈ gõ đáp án, không có trắc nghiệm: bày sẵn bốn âm Hán Việt để
 * chọn thì người học chỉ cần nhận mặt chữ, trong khi cái cần nhớ ở đây là đọc ra
 * được — đúng lý do khu Bài tập cũng chỉ cho gõ.
 */

// ── Chiều 1: chữ Hán → âm Hán Việt ─────────────────────────────────────

export function kanjiSubject(entry: KanjiEntry): QuestionSubject {
  const readings = [entry.hanViet, ...entry.altHanViet].filter(Boolean).join(' / ');
  const examples = entry.words
    .slice(0, 4)
    .map((word) => `${word.japanese}（${word.reading}）`)
    .join('  ');

  const lines: RecapItem[] = [
    recapJp('kanji.col.kanji', entry.char),
    recap('kanji.col.hanViet', readings),
    recap('kanji.col.level', entry.level),
  ];
  if (examples) lines.push(recapJp('kanji.col.examples', examples));

  return {
    id: entry.id,
    title: entry.char,
    titleIsJapanese: true,
    subtitle: readings,
    // Kho từ không có nghĩa riêng cho từng CHỮ (nguồn ghi nghĩa theo từ), nên chỗ
    // này lấy từ đầu tiên làm mốc nhớ thay vì bỏ trống.
    detail: entry.words[0]?.meaning ?? '',
    detailSuffixKey: null,
    recap: lines,
  };
}

export function buildKanjiHanVietQuestions(
  entries: readonly KanjiEntry[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return entries.map((entry) =>
    makeQuestion({
      subject: kanjiSubject(entry),
      labelKey: 'kanji.label.kanjiHanViet',
      prompt: entry.char,
      // Gợi ý là MỘT từ dùng chữ này. Chữ Hán đứng một mình gần như không có manh
      // mối nào, mà nhìn 会社 thì nhớ ra "HỘI" dễ hơn hẳn nhìn trơ chữ 会.
      hint: config.showHanViet ? (entry.words[0]?.japanese ?? null) : null,
      hintIsJapanese: true,
      correctAnswer: entry.hanViet,
      // Chữ có nhiều âm thì gõ âm nào cũng đúng: 行 đọc HÀNH hay HÀNG đều là nó.
      acceptedAnswers: [entry.hanViet, ...entry.altHanViet].flatMap((reading) =>
        acceptedAnswersOf(reading),
      ),
      answerPromptKey: 'kanji.answerPrompt.hanViet',
      maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
    }),
  );
}

// ── Chiều 2 & 3: từ → nghĩa / từ → hiragana ────────────────────────────

function wordSubject(word: KanjiWord, entry: KanjiEntry): QuestionSubject {
  const lines: RecapItem[] = [
    recapJp('lesson.col.japanese', word.japanese),
    recapJp('lesson.col.reading', word.reading),
    recap('lesson.col.meaningShort', word.meaning),
  ];
  // Từ lấy từ khu Bài tập không có cột âm Hán Việt — bỏ hẳn dòng đó thay vì hiện
  // một dòng trống.
  if (word.hanViet) lines.push(recap('lesson.col.hanViet', word.hanViet));
  lines.push(
    recapJp('kanji.col.kanji', `${entry.char} — ${entry.hanViet}`),
    recap('kanji.col.level', word.level),
  );

  return {
    id: word.id,
    title: word.japanese,
    titleIsJapanese: true,
    subtitle: word.reading,
    detail: word.meaning,
    detailSuffixKey: null,
    recap: lines,
  };
}

type WordAsk = 'meaning' | 'reading';

function wordQuestion(
  word: KanjiWord,
  entry: KanjiEntry,
  ask: WordAsk,
  config: PracticeConfig,
): PracticeQuestion {
  const askingMeaning = ask === 'meaning';
  const answer = askingMeaning ? word.meaning : word.reading;

  return makeQuestion({
    subject: wordSubject(word, entry),
    labelKey: askingMeaning ? 'kanji.label.wordMeaning' : 'kanji.label.wordReading',
    prompt: word.japanese,
    // Âm Hán Việt của cả từ làm gợi ý: nó dẫn tới nghĩa mà không đọc thẳng ra đáp
    // án, và ở chiều hỏi hiragana thì càng không lộ gì.
    hint: config.showHanViet && word.hanViet ? word.hanViet : null,
    correctAnswer: answer,
    acceptedAnswers: acceptedAnswersOf(answer),
    // Cách đọc là kana nên dùng font tiếng Nhật và bỏ hết khoảng trắng khi so khớp;
    // nghĩa là tiếng Việt nên không.
    answerIsJapanese: !askingMeaning,
    answerPromptKey: askingMeaning
      ? 'practice.answerPrompt.vietnamese'
      : 'practice.answerPrompt.reading',
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
  });
}

/**
 * Chiều "trộn" sinh HAI câu cho mỗi từ (nghĩa và cách đọc) chứ không bốc ngẫu nhiên
 * một chiều — xem `kanjiQuestionsPerItem`.
 */
export function buildKanjiWordQuestions(
  words: readonly KanjiWord[],
  entry: KanjiEntry,
  config: PracticeConfig,
): PracticeQuestion[] {
  const asks: WordAsk[] =
    config.kanjiMode === 'word-reading'
      ? ['reading']
      : config.kanjiMode === 'word-meaning'
        ? ['meaning']
        : ['meaning', 'reading'];

  return words.flatMap((word) => asks.map((ask) => wordQuestion(word, entry, ask, config)));
}
