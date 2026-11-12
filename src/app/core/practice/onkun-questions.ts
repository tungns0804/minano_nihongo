import type { MessageKey } from '../i18n/messages';
import type { KanjiSound } from '../kanji/kanji-readings';
import { examItems, isQuizzableExample, onKunFavoriteKey, onKunPool } from '../kanji/onkun.model';
import type { ExamItem, LessonKanji, LessonKanjiExample, LessonReading } from '../kanji/onkun.model';
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
import { acceptedAnswersOf } from './answer-check';
import { limitAttempts } from './vocabulary-questions';

/**
 * Câu hỏi của khối âm On / Kun — ở bài từ vựng N3 và ở tab Kanji › Âm On/Kun — theo năm
 * dạng của `OnKunMode`:
 *
 *  - `onkun-all`:     mỗi chữ ba câu liền nhau — âm Hán Việt, âm On, âm Kun (chữ thiếu
 *                     loại âm nào thì bớt câu đó).
 *  - `onkun-hanviet`: nhìn chữ, chọn / gõ âm Hán Việt.
 *  - `onkun-reading`: nhìn chữ, chọn / gõ âm On (một câu) và âm Kun (một câu) của nó.
 *  - `onkun-in-word`: một từ ví dụ, chữ đang học gạch chân — chữ đó đọc là gì.
 *  - `onkun-exam-reading` / `onkun-exam-writing`: đề kiểu JLPT — 問題1 漢字読み, 問題2 表記.
 *  - `onkun-draw`:    nhìn âm Hán Việt và một từ ví dụ, viết chữ bằng chuột.
 *
 * ★ của mọi câu là ★ của CHỮ (id chữ ở khu Kanji), lưu ở khoá riêng `onKunFavoriteKey`:
 * người học đánh dấu "chữ chưa nhớ âm", không phải từng câu. Câu không vào lịch ôn (xem
 * `itemTypeOf` ở `review.model.ts`) — lịch ôn của bài từ vựng là lịch của TỪ, đọc đúng một
 * chữ trong từ không có nghĩa là đã nhớ từ đó.
 */
export function buildOnKunQuestions(
  pool: readonly LessonKanji[],
  all: readonly LessonKanji[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const mode = config.onKunMode ?? 'onkun-all';
  // Dạng đề hỏi trên TỪ, mỗi từ một câu dù nằm dưới hai chữ — không đi theo từng chữ.
  if (mode === 'onkun-exam-reading') return examItems(pool).map((item) => examReadingQuestion(item, all, config));
  if (mode === 'onkun-exam-writing') return examItems(pool).map((item) => examWritingQuestion(item, all, config));

  const readings = (kanji: LessonKanji) =>
    (['on', 'kun'] as const)
      .filter((sound) => kanji[sound].length > 0)
      .map((sound) => readingQuestion(kanji, sound, all, config));
  const hanViet = (kanji: LessonKanji) => (kanji.hanViet ? [hanVietQuestion(kanji, all, config)] : []);

  return onKunPool(pool, mode).flatMap((kanji) => {
    switch (mode) {
      case 'onkun-all':
        return [...hanViet(kanji), ...readings(kanji)];
      case 'onkun-hanviet':
        return hanViet(kanji);
      case 'onkun-reading':
        return readings(kanji);
      case 'onkun-in-word':
        return kanji.examples.filter(isQuizzableExample).map((example) => inWordQuestion(kanji, example, all, config));
      case 'onkun-draw':
        return [drawQuestion(kanji, config)];
    }
  });
}

// ── Đề kiểu JLPT ─────────────────────────────────────────────────────────

/**
 * 問題1 漢字読み: từ viết chữ Hán (gạch chân, kèm nghĩa thay cho câu văn của đề) → chọn cách
 * đọc cả từ.
 *
 * Lựa chọn nhiễu dựng đúng kiểu bẫy của đề thật, đan xen để ba lựa chọn sai không cùng một
 * loại: chữ đang học đọc bằng âm KHÁC của nó (関係 → せきけい — nhầm On/Kun), đục / trong
 * (かんけい → がんけい, かんげい), trường âm (しょうひ ↔ しょひ), và っ (しゅっせき ↔ しゅせき).
 */
function examReadingQuestion(item: ExamItem, all: readonly LessonKanji[], config: PracticeConfig): PracticeQuestion {
  const { kanji, example } = item;
  const correctAnswer = example.reading;
  // Phòng khi từ quá ngắn để dựng đủ ba bẫy (血 ち): bù bằng cách đọc của từ khác, dài gần bằng.
  // Ưu tiên từ cùng đuôi kana (押す mượn từ đuôi す), rồi dài gần bằng — trông cùng một loại từ.
  const tail = /[ぁ-ゖ]*$/.exec(example.japanese)![0];
  const closeness = (reading: string) =>
    (tail && reading.endsWith(tail) ? 0 : 100) + Math.abs(reading.length - correctAnswer.length);
  const fallback = shuffle(
    all.flatMap((other) => other.examples.filter(isQuizzableExample).map((word) => word.reading)),
  ).sort((a, b) => closeness(a) - closeness(b));
  const choices = buildChoices(correctAnswer, [correctAnswer], [...readingTraps(kanji, example), ...fallback]);

  return makeQuestion({
    subject: examSubject(kanji, example),
    labelKey: 'onkun.label.examReading',
    prompt: example.japanese,
    hint: example.meaning,
    correctAnswer,
    acceptedAnswers: [correctAnswer, toKatakana(correctAnswer)],
    answerIsJapanese: true,
    answerPromptKey: 'practice.answerPrompt.reading',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
    favoriteKey: onKunFavoriteKey(config.lessonId),
    exam: wholeUnderlined(example.japanese),
  });
}

/**
 * 問題2 表記: cách đọc (gạch chân, kèm nghĩa) → chọn cách viết bằng chữ Hán.
 *
 * Lựa chọn sai thay chữ đang học bằng chữ khác TRONG BỘ đang luyện, ưu tiên chữ đọc y hệt
 * theo đúng loại âm từ này dùng (関係 → 観係, 感係: cùng âm On かん; 押す → 起す, 折す: cùng
 * âm Kun お), rồi chữ có âm cùng mở đầu, rồi chữ bất kỳ — đề thật cũng bẫy bằng chữ cùng âm.
 * Thay ra có khi thành một từ có thật (関心 → 感心): nghĩa in kèm câu hỏi phân định.
 */
function examWritingQuestion(item: ExamItem, all: readonly LessonKanji[], config: PracticeConfig): PracticeQuestion {
  const { kanji, example } = item;
  const correctAnswer = example.japanese;
  const sound: KanjiSound = example.sound === 'kun' ? 'kun' : 'on';
  const stem = example.readingLabel.split('・')[0];
  const others = all.filter((other) => other.char !== kanji.char && !correctAnswer.includes(other.char));
  const stems = (other: LessonKanji) => other[sound].map((reading) => reading.stem);
  const same = others.filter((other) => stems(other).includes(stem));
  const near = others.filter((other) => !same.includes(other) && stems(other).some((s) => s[0] === stem[0]));
  const rest = others.filter((other) => !same.includes(other) && !near.includes(other));
  const swap = (other: LessonKanji) => correctAnswer.replace(kanji.char, other.char);
  const choices = buildChoices(correctAnswer, [correctAnswer], [
    ...shuffle(same).map(swap),
    ...shuffle(near).map(swap),
    ...shuffle(rest).map(swap),
  ]);

  return makeQuestion({
    subject: examSubject(kanji, example),
    labelKey: 'onkun.label.examWriting',
    prompt: example.reading,
    hint: example.meaning,
    correctAnswer,
    answerIsJapanese: true,
    answerPromptKey: 'practice.answerPrompt.japanese',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
    favoriteKey: onKunFavoriteKey(config.lessonId),
    exam: wholeUnderlined(example.reading),
  });
}

function examSubject(kanji: LessonKanji, example: LessonKanjiExample): QuestionSubject {
  const word = `${example.japanese}（${example.reading}）`;
  return {
    ...subjectOf(kanji, `${word} ${example.meaning}`),
    recap: [
      recapJp('kanji.col.word', word),
      recap('lesson.col.meaningShort', example.meaning),
      recapJp(
        example.sound === 'on' ? 'onkun.col.inWordOn' : 'onkun.col.inWordKun',
        example.readingLabel === example.said
          ? `${kanji.char} → ${example.said}`
          : `${kanji.char} → ${example.said}（${example.readingLabel}）`,
      ),
      ...readingsRecap(kanji),
    ],
  };
}

/** Các nhóm đục / trong của một hàng kana: か ↔ が, は ↔ ば ↔ ぱ. */
const VOICING = [
  'かが', 'きぎ', 'くぐ', 'けげ', 'こご', 'さざ', 'しじ', 'すず', 'せぜ', 'そぞ',
  'ただ', 'ちぢ', 'つづ', 'てで', 'とど', 'はばぱ', 'ひびぴ', 'ふぶぷ', 'へべぺ', 'ほぼぽ',
];

/**
 * Bẫy đục / trong cho kana `char`, đứng sau `previous` ('' là đầu từ). Bỏ những dạng tiếng
 * Nhật không có, nhìn là loại được ngay: đầu từ không bao giờ đục (ぴやします, ぢ — chỉ cho
 * bỏ đục: げんかん → けんかん), và ぱ-hàng chỉ đứng sau ん / っ (しょうぴ thì không).
 */
function voicings(char: string | undefined, previous: string): string[] {
  if (!char) return [];
  const group = VOICING.find((item) => item.includes(char)) ?? '';
  const plain = group[0];
  return [...group].filter((other) => {
    if (other === char) return false;
    if (previous === '') return other === plain;
    // ぢ / づ chỉ gặp trong vài từ biến âm (はなぢ) — làm bẫy thì nhìn là biết sai.
    if (other === 'ぢ' || other === 'づ') return false;
    if ('ぱぴぷぺぽ'.includes(other)) return /[んっ]$/.test(previous);
    // Sau っ chỉ có phụ âm vô thanh (いっさつ, không có いっざつ).
    if (previous.endsWith('っ')) return other === plain;
    return true;
  });
}

/** Nhịp kana đứng trước う thì う kéo dài nó: こう, しゅう, ゆう. */
const LONG_BEFORE = /[おこごそぞとどのほぼぽもよろょゅうくぐすずつづぬふぶぷむゆる]/;

/** Nhịp hàng お / ゅ / ょ — kéo dài thêm う được (こ → こう, しょ → しょう). */
const LENGTHENABLE = /[おこごそぞとどのほぼぽもよろょゅ]/;

/**
 * Âm dài ngắn đi một nhịp う (しょう → しょ), và âm ngắn dài thêm (しょ → しょう, はこ →
 * はこう). Không kéo dài ngay trước っ hay trước một nguyên âm (しゅうっけつ, こうう không có).
 */
function lengthToggles(text: string): string[] {
  const out: string[] = [];
  for (let at = 1; at < text.length; at++) {
    if (text[at] === 'う' && LONG_BEFORE.test(text[at - 1])) out.push(text.slice(0, at) + text.slice(at + 1));
  }
  for (let at = 0; at < text.length; at++) {
    if (LENGTHENABLE.test(text[at]) && !/[うおっぁぃぅぇぉゃゅょー]/.test(text[at + 1] ?? '')) {
      out.push(text.slice(0, at + 1) + 'う' + text.slice(at + 1));
    }
  }
  return out;
}

const HIRAGANA = /[ぁ-ゖ]/;

/** Kana mở đầu bằng phụ âm vô thanh — chỉ trước chúng mới có っ (けっか, しゅっせき). */
const VOICELESS = /[かきくけこさしすせそたちつてとぱぴぷぺぽ]/;

/**
 * Bẫy cho câu 漢字読み, đan xen nhiều loại (xem `examReadingQuestion`). Chỉ biến đổi phần
 * hiragana; phần katakana của từ (でんしレンジ) giữ nguyên. Mỗi loại chỉ sinh dạng tiếng
 * Nhật CÓ THỂ có — bẫy trông vô lý thì người học loại ngay, chẳng luyện được gì.
 */
function readingTraps(kanji: LessonKanji, example: LessonKanjiExample): string[] {
  const [before, part, after] = example.parts!;
  const whole = before + part + after;
  // Chỉ biến đổi phần đọc của chữ Hán: kana viết sẵn ở đầu (お願い) và đuôi (消します)
  // người học nhìn thấy trên đề, bẫy ở đó (けしまっす) chẳng đánh lừa được ai.
  const lead = /^[ぁ-ゖ]*/.exec(example.japanese)![0].length;
  const tail = /[ぁ-ゖ]*$/.exec(example.japanese)![0].length;
  const inKanji = (at: number) => at >= lead && at < whole.length - tail;

  // Chữ đang học đọc bằng âm khác của nó — bẫy On / Kun, cũng là bẫy đáng giá nhất.
  const otherReading = shuffle(
    [...kanji.on, ...kanji.kun]
      .filter((reading) => !reading.rare && reading.stem !== part)
      .map((reading) => before + reading.stem + after),
  );
  // Đục / trong ở mọi nhịp hiragana của từ (かんけい → かんげい, ほうほう → ほうぼう).
  const voiced = shuffle(
    [...whole].flatMap((kana, at) =>
      HIRAGANA.test(kana) && inKanji(at)
        ? voicings(kana, whole.slice(0, at)).map((other) => whole.slice(0, at) + other + whole.slice(at + 1))
        : [],
    ),
  );
  const kanjiPart = whole.slice(lead, whole.length - tail);
  const length = shuffle(
    lengthToggles(kanjiPart).map((changed) => whole.slice(0, lead) + changed + whole.slice(whole.length - tail)),
  );
  // っ: bỏ っ có sẵn (しゅっけつ → しゅけつ), trả lại âm gốc của chữ (しゅつけつ), hoặc chen
  // っ ở RANH GIỚI giữa hai chữ, trước một phụ âm vô thanh (けか → けっか) — trong lòng một âm
  // (けっつ) thì không có. Chỉ chen sau một nhịp phụ âm + nguyên âm: sau nguyên âm trơn
  // (ちゅうっしゃ), ん / っ / ー, nhịp nhỏ hay つ (つっ) đều không có.
  const boundaries = [before.length, before.length + part.length];
  const geminate = shuffle(
    [
      ...(whole.includes('っ') ? [whole.replace('っ', '')] : []),
      ...(part.endsWith('っ') ? [before + part.slice(0, -1) + 'つ' + after] : []),
      ...boundaries.flatMap((at) =>
        at > lead &&
        inKanji(at) &&
        VOICELESS.test(whole[at] ?? '') &&
        whole[at] !== 'つ' &&
        HIRAGANA.test(whole[at - 1]) &&
        !/[あいうえおんっーぁぃぅぇぉゃゅょつ]/.test(whole[at - 1])
          ? [whole.slice(0, at) + 'っ' + whole.slice(at)]
          : [],
      ),
    ],
  );
  // Âm ghép: nhịp hàng い thêm ゃ / ゅ / ょ (きんし → きんしょ, じゆう → じゅう) — bẫy của âm
  // On; âm Kun thuần Nhật gần như không có ゅ / ょ (ひゅえます không giống chữ nào cả).
  const yoon =
    example.sound === 'on'
      ? shuffle(
          [...whole].flatMap((kana, at) =>
            inKanji(at) && /[きぎしじちにひびみり]/.test(kana) && !/[ゃゅょ]/.test(whole[at + 1] ?? '')
              ? ['ゅ', 'ょ'].map((small) => whole.slice(0, at + 1) + small + whole.slice(at + 1))
              : [],
          ),
        )
      : [];
  // Bỏ ん của chữ đang học (かんけい → かけい).
  const nasal = part.includes('ん') && part.length > 1 ? [before + part.replace('ん', '') + after] : [];

  // Đan xen: mỗi loại một lựa chọn trước, rồi mới tới lựa chọn thứ hai của cùng loại.
  const groups = shuffle([otherReading, voiced, length, geminate, yoon, nasal]);
  const out: string[] = [];
  for (let round = 0; groups.some((group) => group.length > round); round++) {
    for (const group of groups) if (group[round]) out.push(group[round]);
  }
  return out;
}

/** Cả từ gạch chân như phần được hỏi của đề; từ chứa ký tự cú pháp furigana thì vẽ thường. */
function wholeUnderlined(text: string): PracticeQuestion['exam'] {
  if (/[{}[\]|/〈〉]/.test(text)) return null;
  return { prompt: `〈${text}〉`, markupChoices: false, passage: null, complete: null };
}

/**
 * Hỏi âm Hán Việt của chữ. Gõ âm nào trong các âm của chữ cũng đúng (行 HÀNH / HÀNG), bỏ
 * dấu được nếu người học bật "Bỏ qua dấu"; lựa chọn nhiễu là âm Hán Việt của các chữ khác.
 * Không có gợi ý âm Hán Việt — chính nó là đáp án.
 */
function hanVietQuestion(kanji: LessonKanji, all: readonly LessonKanji[], config: PracticeConfig): PracticeQuestion {
  const correctAnswer = kanji.hanViet;
  const valid = [kanji.hanViet, ...kanji.altHanViet];
  const choices =
    config.answerMode === 'choice'
      ? buildChoices(
          correctAnswer,
          valid,
          shuffle(all.filter((item) => item.char !== kanji.char)).map((item) => item.hanViet),
        )
      : [];

  return makeQuestion({
    subject: subjectOf(kanji, readingsLine(kanji)),
    labelKey: 'kanji.label.kanjiHanViet',
    prompt: kanji.char,
    correctAnswer,
    acceptedAnswers: [...new Set(valid.flatMap(acceptedAnswersOf))],
    answerPromptKey: 'practice.answerPrompt.hanViet',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, config.answerMode, choices.length),
    favoriteKey: onKunFavoriteKey(config.lessonId),
  });
}

/**
 * Viết chữ từ âm Hán Việt, kèm một từ ví dụ ở dạng chỉ có cách đọc và nghĩa (れいぞうこ —
 * tủ lạnh): đủ để nhớ ra chữ mà không bày sẵn mặt chữ. Chấm bằng phần chấm nét của khu
 * Kanji (`drawChar`); phiên này là `answerMode: 'draw'`.
 */
function drawQuestion(kanji: LessonKanji, config: PracticeConfig): PracticeQuestion {
  const example = kanji.examples.find(isQuizzableExample) ?? kanji.examples[0];
  return makeQuestion({
    subject: subjectOf(kanji, readingsLine(kanji)),
    labelKey: 'kanji.label.draw',
    prompt: kanji.hanViet || readingsLine(kanji),
    promptIsJapanese: false,
    hint: example ? `${example.reading} — ${example.meaning}` : null,
    correctAnswer: kanji.char,
    answerIsJapanese: true,
    answerPromptKey: 'practice.answerPrompt.draw',
    drawChar: kanji.char,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'draw', 0),
    favoriteKey: onKunFavoriteKey(config.lessonId),
  });
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
