/**
 * Bài "Đề luyện N4 · 直前対策": toàn bộ bài tập của sách 「日本語能力試験 直前対策 N4
 * 文字・語彙・文法」, chia theo PHẦN (文字・語彙 / 文法 / 付録), theo DẠNG (もんだい1–5…)
 * và theo ĐỀ (第1回–第10回) hoặc CHỦ ĐỀ (付録 1–16).
 *
 * Dữ liệu thô nằm ở `taisaku-n4.data.ts` (chép tay từ sách). File này chỉ trải nó ra
 * thành từng mục luyện có id ổn định — id là khoá ★ và khoá lịch ôn, nên KHÔNG đổi cách
 * đặt id: đổi là mất ★ và lịch ôn của mục đó.
 *
 *   m<đề>-<câu>          câu của đề 文字・語彙, đánh số 1–34 như sách
 *   b<đề>-<câu>          câu của đề 文法, đánh số 1–25 như sách
 *   f<chủ đề>-w<n>       từ thứ n trong bảng từ của 付録
 *   f16-k<n>s / k<n>k    dòng kính ngữ thứ n, hỏi tôn kính ngữ / khiêm nhường ngữ
 *   f<chủ đề>-f<khung>-<n>   câu điền từ trong khung của 付録
 *   f<chủ đề>-c<n>       câu chọn [a・b] của 付録
 */

import type { ExerciseMode } from './exercise.model';
import { BUNPO_TESTS, FUROKU_CHOICES, FUROKU_FILLS, FUROKU_TOPICS, MOJI_TESTS } from './taisaku-n4.data';
// `import type` riêng: `npm run verify:taisaku` nạp file này bằng --experimental-strip-types,
// chế độ đó không bóc được tên kiểu lẫn trong một import giá trị.
import type { RawBunpoTest, RawChoice, RawMojiTest } from './taisaku-n4.data';

export const TAISAKU_EXERCISE_ID = 'taisaku-n4';

export type TaisakuPart = 'moji' | 'bunpo' | 'furoku';

export const TAISAKU_PARTS: readonly TaisakuPart[] = ['moji', 'bunpo', 'furoku'];

/** Dạng câu cố định của sách — mỗi dạng một cách hỏi. */
export type TaisakuKind =
  | 'kanji-reading'
  | 'kanji-writing'
  | 'context'
  | 'paraphrase'
  | 'usage'
  | 'grammar'
  | 'star'
  | 'passage'
  | 'fill'
  | 'pick';

/** Một câu soạn sẵn của sách: đề, lựa chọn và đáp án giữ đúng sách. */
export interface TaisakuQuestion {
  id: string;
  part: TaisakuPart;
  kind: TaisakuKind;
  /** Số đề (第n回) ở phần 文字・語彙 và 文法; số chủ đề ở phần 付録. */
  set: number;
  /** Số câu như sách đánh (1–34 / 1–25); thứ tự trong chủ đề ở phần 付録. */
  number: number;
  /** Số もんだい trong đề; 0 với phần 付録. */
  mondai: number;
  prompt: string;
  options: readonly string[];
  answer: string;
  /** Câu sau khi điền đáp án (đáp án gạch chân); null với câu không có chỗ trống. */
  complete: string | null;
  /** Câu ★: bốn mảnh theo đúng thứ tự; rỗng với câu khác. */
  ordered: readonly string[];
  /** Câu điền đoạn văn: cả đoạn, chỗ trống đang hỏi gạch chân; null với câu khác. */
  passage: string | null;
}

export interface TaisakuWord {
  id: string;
  topic: number;
  word: string;
  meaning: string;
  example: string;
}

export type KeigoForm = 'sonkei' | 'kenjou';

export interface TaisakuKeigo {
  id: string;
  topic: number;
  plain: string;
  sonkei: string;
  kenjou: string;
  meaning: string;
}

/** Một mục đem ra luyện: câu soạn sẵn, một từ, hay một vế kính ngữ của một động từ. */
export type TaisakuUnit =
  | { readonly id: string; readonly type: 'question'; readonly question: TaisakuQuestion }
  | { readonly id: string; readonly type: 'word'; readonly word: TaisakuWord }
  | { readonly id: string; readonly type: 'keigo'; readonly keigo: TaisakuKeigo; readonly form: KeigoForm };

export interface TaisakuTopic {
  no: number;
  title: string;
  words: readonly TaisakuWord[];
  keigo: readonly TaisakuKeigo[];
  /** Bài tập chữ của sách (điền từ, chọn [a・b]); chủ đề chỉ có bài nhìn tranh thì rỗng. */
  exercises: readonly TaisakuQuestion[];
}

// ── Trải dữ liệu ─────────────────────────────────────────────────────────

/** Ô ★ của câu sắp xếp: ô thứ ba trong bốn ô, như mọi đề N4. */
const STAR_SLOT = 2;

/** Bốn ô trống của câu ★ khi hỏi mảnh ở ô ★, và khi bắt xếp cả bốn mảnh. */
export const STAR_BLANKS = '＿＿＿ ＿＿＿ ＿★＿ ＿＿＿';
export const ORDER_BLANKS = '＿＿＿ ＿＿＿ ＿＿＿ ＿＿＿';
const BLANK = '（　）';

function choiceQuestion(
  base: Pick<TaisakuQuestion, 'id' | 'part' | 'kind' | 'set' | 'number' | 'mondai'>,
  [prompt, options, answer]: RawChoice,
): TaisakuQuestion {
  const correct = options[answer - 1];
  return {
    ...base,
    prompt,
    options,
    answer: correct,
    complete: prompt.includes(BLANK) ? prompt.replace(BLANK, `〈${correct}〉`) : null,
    ordered: [],
    passage: null,
  };
}

const MOJI_PARTS: readonly (readonly [key: keyof Omit<RawMojiTest, 'no'>, kind: TaisakuKind])[] = [
  ['m1', 'kanji-reading'],
  ['m2', 'kanji-writing'],
  ['m3', 'context'],
  ['m4', 'paraphrase'],
  ['m5', 'usage'],
];

function mojiQuestions(test: RawMojiTest): TaisakuQuestion[] {
  let number = 0;
  return MOJI_PARTS.flatMap(([key, kind], index) =>
    test[key].map((raw) =>
      choiceQuestion(
        { id: `m${test.no}-${++number}`, part: 'moji', kind, set: test.no, number, mondai: index + 1 },
        raw,
      ),
    ),
  );
}

/**
 * Câu chứa chỗ trống 【n】 trong một đoạn: từ sau dấu 。 trước nó tới dấu 。 sau nó. Câu
 * trích dẫn 「…。」と言った thì kéo tới hết câu dẫn — cắt ở 。 trong ngoặc là mất vế sau.
 */
function sentenceAround(paragraph: string, mark: string): string {
  const at = paragraph.indexOf(mark);
  const start = paragraph.lastIndexOf('。', at) + 1;
  let end = paragraph.indexOf('。', at);
  while (end >= 0 && paragraph[end + 1] === '」') end = paragraph.indexOf('。', end + 1);
  return paragraph.slice(start, end < 0 ? paragraph.length : end + 1).trim();
}

function bunpoQuestions(test: RawBunpoTest): TaisakuQuestion[] {
  const base = (number: number, mondai: number, kind: TaisakuKind) => ({
    id: `b${test.no}-${number}`,
    part: 'bunpo' as const,
    kind,
    set: test.no,
    number,
    mondai,
  });

  const grammar = test.m1.map((raw, index) => choiceQuestion(base(index + 1, 1, 'grammar'), raw));

  const star = test.m2.map(([prompt, fragments, order], index): TaisakuQuestion => {
    const ordered = order.map((n) => fragments[n - 1]);
    const filled = ordered.map((part, slot) => (slot === STAR_SLOT ? `〈${part}〉` : part)).join(' ');
    return {
      ...base(16 + index, 2, 'star'),
      prompt,
      options: fragments,
      answer: ordered[STAR_SLOT],
      complete: prompt.replace('【★】', filled),
      ordered,
      passage: null,
    };
  });

  const { title, author, text, items } = test.m3;
  const passage = items.map(([options, answer], index): TaisakuQuestion => {
    const number = 21 + index;
    const mark = `【${number}】`;
    const paragraph = text.find((line) => line.includes(mark)) ?? '';
    const sentence = sentenceAround(paragraph, mark);
    const correct = options[answer - 1];
    return {
      ...base(number, 3, 'passage'),
      prompt: sentence.replace(mark, BLANK),
      options,
      answer: correct,
      complete: sentence.replace(mark, `〈${correct}〉`),
      ordered: [],
      passage: [`${title}　${author}`, ...text].join('\n').replace(mark, `〈${mark}〉`),
    };
  });

  return [...grammar, ...star, ...passage];
}

function furokuTopics(): TaisakuTopic[] {
  return FUROKU_TOPICS.map((raw) => {
    const fills = FUROKU_FILLS.find((item) => item.no === raw.no);
    const picks = FUROKU_CHOICES.find((item) => item.no === raw.no);
    const exercise = (id: string, kind: TaisakuKind, number: number) => ({
      id: `f${raw.no}-${id}`,
      part: 'furoku' as const,
      kind,
      set: raw.no,
      number,
      mondai: 0,
    });
    let number = 0;

    return {
      no: raw.no,
      title: raw.title,
      words: (raw.words ?? []).map(([word, meaning, example], index) => ({
        id: `f${raw.no}-w${index + 1}`,
        topic: raw.no,
        word,
        meaning,
        example: example ?? '',
      })),
      keigo: (raw.keigo ?? []).map(([sonkei, plain, kenjou, meaning], index) => ({
        id: `f${raw.no}-k${index + 1}`,
        topic: raw.no,
        plain,
        sonkei,
        kenjou,
        meaning,
      })),
      exercises: [
        ...(fills?.groups ?? []).flatMap((group, groupIndex) =>
          group.items.map(([prompt, answer], index) =>
            choiceQuestion(exercise(`f${groupIndex + 1}-${index + 1}`, 'fill', ++number), [
              prompt,
              group.bank,
              group.bank.indexOf(answer) + 1,
            ]),
          ),
        ),
        ...(picks?.items ?? []).map(([prompt, options, answer], index) =>
          choiceQuestion(exercise(`c${index + 1}`, 'pick', ++number), [
            prompt,
            options,
            options.indexOf(answer) + 1,
          ]),
        ),
      ],
    };
  });
}

export const MOJI_QUESTIONS: readonly TaisakuQuestion[] = MOJI_TESTS.flatMap(mojiQuestions);
export const BUNPO_QUESTIONS: readonly TaisakuQuestion[] = BUNPO_TESTS.flatMap(bunpoQuestions);
export const TAISAKU_TOPICS: readonly TaisakuTopic[] = furokuTopics();

/** Số đề của phần 文字・語彙 và 文法 (第1回 → 第10回). */
export const TAISAKU_TEST_NUMBERS: readonly number[] = MOJI_TESTS.map((test) => test.no);
export const TAISAKU_TOPIC_NUMBERS: readonly number[] = TAISAKU_TOPICS.map((topic) => topic.no);

// ── Dạng luyện ───────────────────────────────────────────────────────────

/** Dạng luyện thuộc phần nào, và lấy những câu nào. `kinds` rỗng là dạng luyện từ. */
interface TaisakuModeSpec {
  part: TaisakuPart;
  kinds: readonly TaisakuKind[];
}

export type TaisakuMode = Extract<ExerciseMode, `tk-${string}`>;

export const TAISAKU_MODE_SPEC: Record<TaisakuMode, TaisakuModeSpec> = {
  'tk-kanji-reading': { part: 'moji', kinds: ['kanji-reading'] },
  'tk-kanji-writing': { part: 'moji', kinds: ['kanji-writing'] },
  'tk-context': { part: 'moji', kinds: ['context'] },
  'tk-paraphrase': { part: 'moji', kinds: ['paraphrase'] },
  'tk-usage': { part: 'moji', kinds: ['usage'] },
  'tk-moji-test': {
    part: 'moji',
    kinds: ['kanji-reading', 'kanji-writing', 'context', 'paraphrase', 'usage'],
  },
  'tk-grammar': { part: 'bunpo', kinds: ['grammar'] },
  'tk-star': { part: 'bunpo', kinds: ['star'] },
  'tk-order': { part: 'bunpo', kinds: ['star'] },
  'tk-passage': { part: 'bunpo', kinds: ['passage'] },
  'tk-bunpo-test': { part: 'bunpo', kinds: ['grammar', 'star', 'passage'] },
  'tk-word-meaning': { part: 'furoku', kinds: [] },
  'tk-meaning-word': { part: 'furoku', kinds: [] },
  'tk-book': { part: 'furoku', kinds: ['fill', 'pick'] },
};

export function isTaisakuMode(mode: ExerciseMode): mode is TaisakuMode {
  return mode.startsWith('tk-');
}

/** Dạng "cả đề": đi đúng thứ tự sách, không trộn — như ngồi làm một đề thi thật. */
export function isTaisakuTestMode(mode: TaisakuMode): boolean {
  return mode === 'tk-moji-test' || mode === 'tk-bunpo-test';
}

function keigoUnits(keigo: TaisakuKeigo): TaisakuUnit[] {
  return (['sonkei', 'kenjou'] as const)
    .filter((form) => keigo[form] !== '')
    .map((form) => ({ id: `${keigo.id}${form === 'sonkei' ? 's' : 'k'}`, type: 'keigo', keigo, form }));
}

function questionUnit(question: TaisakuQuestion): TaisakuUnit {
  return { id: question.id, type: 'question', question };
}

/**
 * Các mục của một dạng luyện trong những đề / chủ đề đang chọn, theo thứ tự sách.
 *
 * Dạng luyện từ (Nhật ↔ Việt) hỏi trên bảng từ của chủ đề; riêng chủ đề kính ngữ không
 * có bảng từ mà có bảng ba cột, nên mỗi động từ thành hai câu: tôn kính ngữ và khiêm
 * nhường ngữ.
 */
export function taisakuUnits(mode: TaisakuMode, sets: readonly number[]): TaisakuUnit[] {
  const spec = TAISAKU_MODE_SPEC[mode];
  const wanted = new Set(sets);

  if (spec.part === 'furoku') {
    const topics = TAISAKU_TOPICS.filter((topic) => wanted.has(topic.no));
    if (spec.kinds.length > 0) return topics.flatMap((topic) => topic.exercises.map(questionUnit));
    return topics.flatMap((topic) => [
      ...topic.words.map((word): TaisakuUnit => ({ id: word.id, type: 'word', word })),
      ...topic.keigo.flatMap(keigoUnits),
    ]);
  }

  const kinds = new Set(spec.kinds);
  const source = spec.part === 'moji' ? MOJI_QUESTIONS : BUNPO_QUESTIONS;
  return source.filter((q) => wanted.has(q.set) && kinds.has(q.kind)).map(questionUnit);
}

let unitIndex: ReadonlyMap<string, TaisakuUnit> | null = null;

/** Tra một mục theo id — phiên Ôn tập dựng lại câu hỏi từ khoá lịch ôn. */
export function taisakuUnitById(id: string): TaisakuUnit | null {
  unitIndex ??= new Map(
    [
      ...MOJI_QUESTIONS.map(questionUnit),
      ...BUNPO_QUESTIONS.map(questionUnit),
      ...TAISAKU_TOPICS.flatMap((topic) => [
        ...topic.exercises.map(questionUnit),
        ...topic.words.map((word): TaisakuUnit => ({ id: word.id, type: 'word', word })),
        ...topic.keigo.flatMap(keigoUnits),
      ]),
    ].map((unit) => [unit.id, unit]),
  );
  return unitIndex.get(id) ?? null;
}

export function taisakuTopic(no: number): TaisakuTopic | null {
  return TAISAKU_TOPICS.find((topic) => topic.no === no) ?? null;
}

/** Dòng chú thích nguồn của một câu: "第3回 文字・語彙 もんだい1 · 5", "付録 8 · 3". */
export function taisakuSource(question: TaisakuQuestion): string {
  if (question.part === 'furoku') return `付録 ${question.set} · ${question.number}`;
  const part = question.part === 'moji' ? '文字・語彙' : '文法';
  return `第${question.set}回 ${part} もんだい${question.mondai} · ${question.number}`;
}
