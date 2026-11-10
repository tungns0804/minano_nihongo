import type { MessageKey } from '../i18n/messages';
import type { KanjiSound } from '../kanji/kanji-readings';
import { isQuizzableExample, onKunFavoriteKey } from '../kanji/onkun.model';
import type { LessonKanji, LessonKanjiExample, LessonReading } from '../kanji/onkun.model';
import { toKatakana } from '../utils/kana';
import { shuffle } from '../utils/random';
import {
  CHOICE_COUNT,
  PracticeConfig,
  PracticeQuestion,
  QuestionSubject,
  RecapItem,
  makeQuestion,
  recap,
  recapJp,
} from './practice.model';
import { limitAttempts } from './vocabulary-questions';

/**
 * Câu hỏi của khối "Chữ Hán trong bài" (bài từ vựng N3) — hai dạng của `OnKunMode`:
 *
 *  - `onkun-reading`: nhìn chữ, chọn / gõ âm On (một câu) và âm Kun (một câu) của nó.
 *  - `onkun-in-word`: một từ của bài, chữ đang học gạch chân — chữ đó đọc là gì.
 *
 * ★ của mọi câu là ★ của CHỮ (id chữ ở khu Kanji), lưu ở khoá riêng `onKunFavoriteKey`
 * của bài: người học đánh dấu "chữ chưa nhớ âm", không phải từng câu. Câu không vào lịch
 * ôn (xem `itemTypeOf` ở
 * `review.model.ts`) — lịch ôn của bài từ vựng là lịch của TỪ, đọc đúng một chữ trong từ
 * không có nghĩa là đã nhớ từ đó.
 */
export function buildOnKunQuestions(
  pool: readonly LessonKanji[],
  all: readonly LessonKanji[],
  config: PracticeConfig,
): PracticeQuestion[] {
  if (config.onKunMode === 'onkun-in-word') {
    return pool.flatMap((kanji) =>
      kanji.examples.filter(isQuizzableExample).map((example) => inWordQuestion(kanji, example, all, config)),
    );
  }
  return pool.flatMap((kanji) =>
    (['on', 'kun'] as const)
      .filter((sound) => kanji[sound].length > 0)
      .map((sound) => readingQuestion(kanji, sound, all, config)),
  );
}

const READING_LABEL: Record<KanjiSound, MessageKey> = {
  on: 'onkun.label.on',
  kun: 'onkun.label.kun',
};

/**
 * Hỏi âm On hay âm Kun của chữ.
 *
 * Lựa chọn nhiễu: MỘT âm thuộc loại kia của chính chữ đó (hỏi On mà chọn つめ của 冷 là
 * nhầm On với Kun — đúng cái người học hay nhầm nhất), còn lại là âm cùng loại của các
 * chữ khác trong bài. Âm On in bằng hiragana như âm Kun, và âm Kun lẫn vào câu hỏi On chỉ
 * in phần gốc (không ・đuôi): khác kiểu chữ thì nhìn kiểu chữ là đoán ra loại âm.
 */
function readingQuestion(
  kanji: LessonKanji,
  sound: KanjiSound,
  all: readonly LessonKanji[],
  config: PracticeConfig,
): PracticeQuestion {
  const own = kanji[sound];
  const other: KanjiSound = sound === 'on' ? 'kun' : 'on';
  const shown = (reading: LessonReading) => (sound === 'on' ? reading.stem : reading.label);
  const preferred = own.find((reading) => reading.used) ?? own.find((reading) => !reading.rare) ?? own[0];
  const correctAnswer = shown(preferred);

  const choices =
    config.answerMode === 'choice'
      ? buildChoices(
          correctAnswer,
          // Mọi âm cùng loại của chữ đều "đúng" — không được lọt vào làm lựa chọn sai.
          own.flatMap((reading) => [shown(reading), reading.stem]),
          [
            ...shuffle(kanji[other].filter((reading) => !reading.rare)).slice(0, 1).map((reading) => reading.stem),
            ...shuffle(all.filter((item) => item.char !== kanji.char)).flatMap((item) =>
              item[sound].filter((reading) => !reading.rare).map(shown),
            ),
          ],
        )
      : [];

  return makeQuestion({
    subject: subjectOf(kanji, readingsLine(kanji)),
    labelKey: READING_LABEL[sound],
    prompt: kanji.char,
    hint: config.showHanViet && kanji.hanViet ? kanji.hanViet : null,
    correctAnswer,
    acceptedAnswers: [...new Set(own.flatMap(spellings))],
    answerIsJapanese: true,
    answerPromptKey: 'practice.answerPrompt.reading',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, config.answerMode, choices.length),
    favoriteKey: onKunFavoriteKey(config.lessonId),
  });
}

/**
 * Chữ gạch chân trong một từ của bài đọc là gì.
 *
 * Đáp án là phần đọc ĐÚNG NHƯ TRONG TỪ, kể cả đã biến âm (誕生 → じょう, 出身 → しゅっ).
 * Lựa chọn nhiễu lấy trước hết từ chính các âm khác của chữ — câu này hỏi "trong từ này
 * chữ dùng âm nào", nên đặt các âm của cùng một chữ cạnh nhau mới là câu hỏi thật.
 */
function inWordQuestion(
  kanji: LessonKanji,
  example: LessonKanjiExample,
  all: readonly LessonKanji[],
  config: PracticeConfig,
): PracticeQuestion {
  const correctAnswer = example.said;
  const ownStems = [...kanji.on, ...kanji.kun].map((reading) => reading.stem);
  const choices =
    config.answerMode === 'choice'
      ? buildChoices(correctAnswer, [correctAnswer], [
          ...shuffle(ownStems),
          ...shuffle(all.filter((item) => item.char !== kanji.char)).flatMap((item) =>
            [...item.on, ...item.kun].filter((reading) => !reading.rare).map((reading) => reading.stem),
          ),
        ])
      : [];

  const hint = config.showHanViet && kanji.hanViet ? `${kanji.hanViet} · ${example.meaning}` : example.meaning;
  const word = `${example.japanese}（${example.reading}）`;

  return makeQuestion({
    subject: {
      ...subjectOf(kanji, `${word} ${example.meaning}`),
      recap: [
        recapJp('kanji.col.word', word),
        recap('lesson.col.meaningShort', example.meaning),
        // Âm gốc trong ngoặc chỉ khi khác phần đọc trong từ: 生 → じょう（しょう）,
        // 冷 → つめ（つめ・たい）; còn 冷 → れい thì ghi một lần là đủ.
        recapJp(
          example.sound === 'on' ? 'onkun.col.inWordOn' : 'onkun.col.inWordKun',
          example.readingLabel === example.said
            ? `${kanji.char} → ${example.said}`
            : `${kanji.char} → ${example.said}（${example.readingLabel}）`,
        ),
        ...readingsRecap(kanji),
      ],
    },
    labelKey: 'onkun.label.inWord',
    prompt: example.japanese,
    hint,
    correctAnswer,
    acceptedAnswers: [correctAnswer, toKatakana(correctAnswer)],
    answerIsJapanese: true,
    answerPromptKey: 'practice.answerPrompt.reading',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, config.answerMode, choices.length),
    favoriteKey: onKunFavoriteKey(config.lessonId),
    exam: underlined(example.japanese, kanji.char),
  });
}

function subjectOf(kanji: LessonKanji, detail: string): QuestionSubject {
  return {
    id: kanji.id,
    title: kanji.char,
    titleIsJapanese: true,
    subtitle: kanji.hanViet,
    detail,
    detailSuffixKey: null,
    recap: [
      ...readingsRecap(kanji),
      ...(kanji.examples.length > 0
        ? [
            recapJp(
              'onkun.col.examples',
              kanji.examples
                .slice(0, 4)
                .map((example) => `${example.japanese}（${example.reading}）`)
                .join('、'),
            ),
          ]
        : []),
    ],
  };
}

function readingsRecap(kanji: LessonKanji): RecapItem[] {
  return [
    recapJp('kanji.col.kanji', kanji.char),
    ...(kanji.hanViet ? [recap('kanji.col.hanViet', kanji.hanViet)] : []),
    recapJp('onkun.col.on', labelsOf(kanji.on)),
    recapJp('onkun.col.kun', labelsOf(kanji.kun)),
  ];
}

/** "On: れい · Kun: つめ・たい、ひ・える" — dòng mô tả chữ ở màn kết quả. */
function readingsLine(kanji: LessonKanji): string {
  return `On: ${labelsOf(kanji.on)} · Kun: ${labelsOf(kanji.kun)}`;
}

function labelsOf(readings: readonly LessonReading[]): string {
  return readings.length > 0 ? readings.map((reading) => reading.label).join('、') : '—';
}

/** Các cách gõ được tính đúng cho một âm: つめ, つめたい, つめ・たい, cả bản katakana. */
function spellings(reading: LessonReading): string[] {
  const full = reading.label.replace('・', '');
  return [reading.stem, full, reading.label, toKatakana(reading.stem), toKatakana(full)];
}

/** Đúng + ba lựa chọn nhiễu đầu tiên của `candidates` không trùng gì đã có. */
function buildChoices(correct: string, forbidden: readonly string[], candidates: readonly string[]): string[] {
  const used = new Set([correct, ...forbidden]);
  const distractors: string[] = [];
  for (const candidate of candidates) {
    if (distractors.length >= CHOICE_COUNT - 1) break;
    if (!candidate || used.has(candidate)) continue;
    used.add(candidate);
    distractors.push(candidate);
  }
  return shuffle([correct, ...distractors]);
}

/**
 * Từ có chữ đang hỏi gạch chân — cú pháp 〈…〉 của câu đề thi (`ExamExtras`). Từ chứa ký
 * tự của cú pháp furigana ({ } [ ] | /) thì vẽ thường, không gạch.
 */
function underlined(word: string, char: string): PracticeQuestion['exam'] {
  if (/[{}[\]|/〈〉]/.test(word) || !word.includes(char)) return null;
  return {
    prompt: word.replace(char, `〈${char}〉`),
    markupChoices: false,
    passage: null,
    complete: null,
  };
}
