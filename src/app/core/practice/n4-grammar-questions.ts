import type { MessageKey } from '../i18n/messages';
import { GRAMMAR_BOOKS, GrammarBook, grammarBookOf } from '../exercises/grammar-books';
import {
  N4ExampleRef,
  N4Point,
  N4PointRef,
  N4QuizRef,
  meaningPoints,
} from '../exercises/n4-grammar.model';
import { reviewKey } from '../review/review.model';
import { plainText, variantTexts, writtenText } from '../translation/markup';
import { shuffle } from '../utils/random';
import {
  CHOICE_COUNT,
  PracticeConfig,
  PracticeQuestion,
  RecapItem,
  makeQuestion,
  recap,
  recapJp,
} from './practice.model';
import { limitAttempts } from './vocabulary-questions';

/**
 * Dựng câu hỏi cho bài tập "Luyện tập ngữ pháp N4" (`core/exercises/n4-grammar.ts`),
 * theo năm bậc của lộ trình (xem `N4_STEP_MODES`):
 *
 * 1–2. Ý NGHĨA ↔ NGỮ PHÁP — trắc nghiệm bốn lựa chọn trên từng MẪU. Đáp án nhiễu ưu tiên
 *    lấy trong nhóm mẫu dễ nhầm với nhau (ば / たら / と / なら…), vì phân biệt chúng mới
 *    là chỗ khó; không bao giờ lấy mẫu CÙNG nghĩa (`GrammarBook.synonyms`). Mọi thứ
 *    đọc theo sách của phiên luyện (`config.exercise`, xem `grammar-books.ts`).
 *
 * 3. ĐIỀN VÀO CHỖ TRỐNG — câu ví dụ bị đục phần ngữ pháp (《…》 trong dữ liệu), kèm
 *    nghĩa tiếng Việt; chọn MẪU hợp với chỗ trống. Lựa chọn là tên mẫu chứ không phải
 *    chữ điền vào: chữ điền vào mỗi câu một dạng chia (あれば, 飲んだら…), lấy chữ của câu
 *    khác làm đáp án nhiễu thì nhìn động từ là loại được, không cần hiểu ngữ pháp. Cùng
 *    bậc này có "Bài luyện tập" của tài liệu — câu đó đã soạn sẵn lựa chọn.
 *
 * 4. SẮP XẾP CÂU — nghĩa tiếng Việt, bấm các mảnh câu (`chunksOf`) theo đúng thứ tự.
 *    Câu ghép xong chấm như câu gõ tay, nên cách nói khác tài liệu ghi (`japaneseAlt`,
 *    thường chính là một thứ tự khác) cũng đúng.
 *
 * 5. DỊCH CÂU VÍ DỤ — giống bài ngữ pháp 皆の日本語: gõ cả câu, chấm bỏ qua dấu câu,
 *    gợi ý là chính mẫu ngữ pháp. Khác ở chỗ chấm theo CÂU MẪU (`acceptedPatterns`) như
 *    khu Luyện dịch: câu ví dụ ghi furigana {漢字|かな}, nên gõ chữ Hán, gõ kana hay gõ
 *    lẫn đều đúng, và chỗ tài liệu ghi hai cách nói [a/b] thì cách nào cũng được.
 *    Không cho tự chấm như khu Luyện dịch: câu ví dụ có đúng một bản dịch của tài liệu,
 *    và câu đã chấm thì vào lịch ôn — lịch ôn chỉ tin vào kết quả chấm máy.
 *
 * Lộ trình (`buildN4PathQuestions`) đi cả năm bậc cho từng mục, mục này xong mới sang
 * mục sau.
 */

// ── Dịch câu ví dụ ─────────────────────────────────────────────────────────

export function buildN4ExampleQuestions(
  pool: readonly N4ExampleRef[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const toJapanese = config.exerciseMode !== 'example-jp-vi';

  return pool.map(({ example, usage, point }) => {
    const lines = exampleRecap({ example, usage, point });
    const answer = toJapanese ? example.japanese : example.vietnamese;
    const answerAlt = toJapanese ? example.japaneseAlt : example.vietnameseAlt;

    return makeQuestion({
      subject: exampleSubject(example, point, lines),
      labelKey: (toJapanese ? 'direction.vi-jp' : 'direction.jp-vi') as MessageKey,
      // Câu hỏi tiếng Việt hiện đủ các cách dịch như tài liệu ghi; câu hỏi tiếng Nhật thì
      // màn luyện tập vẽ từ `sentence.japanese` để có furigana.
      prompt: toJapanese ? writtenText(example.vietnamese) : writtenText(example.japanese),
      promptIsJapanese: !toJapanese,
      hint: config.showGrammarHint ? hintOf(point) : null,
      hintIsJapanese: true,
      correctAnswer: plainText(answer),
      // Không chấm theo chuỗi cố định nào — mọi cách viết đúng nằm trong câu mẫu.
      acceptedAnswers: [],
      acceptedPatterns: [answer, ...answerAlt],
      answerIsJapanese: toJapanese,
      answerPromptKey: (toJapanese
        ? 'practice.answerPrompt.sentenceJapanese'
        : 'practice.answerPrompt.sentenceVietnamese') as MessageKey,
      ignorePunctuation: true,
      isSentence: true,
      maxWrongAttempts: Math.max(1, config.maxWrongAttempts),
      sentence: {
        japanese: example.japanese,
        speaker: '',
        context: null,
        grammar: [],
        alternatives: [...variantTexts(answer), ...answerAlt.map(plainText)],
        complete: null,
      },
    });
  });
}

/** Gợi ý gọn một dòng: tên mẫu, kèm công thức đầu tiên nếu có — như bài ngữ pháp 皆の日本語. */
function hintOf(point: N4Point): string {
  return point.structures.length > 0 ? `${point.pattern} — ${point.structures[0]}` : point.pattern;
}

/** Phần ôn lại sau khi chấm một câu ví dụ: mẫu, ý nghĩa, cách dùng, lời giải thích. */
function exampleRecap({ example, usage, point }: Pick<N4ExampleRef, 'example' | 'usage' | 'point'>): RecapItem[] {
  const lines: RecapItem[] = [recapJp('grammar.recap.pattern', point.pattern)];
  if (point.meaning) lines.push(recap('exercise.n4.meaning', point.meaning));
  if (usage.title) lines.push(recap('grammar.recap.usage', usage.title));
  if (example.note) lines.push(recap('grammar.recap.note', example.note));
  return lines;
}

function exampleSubject(example: N4ExampleRef['example'], point: N4Point, lines: RecapItem[]) {
  return {
    id: example.id,
    title: writtenText(example.japanese),
    titleIsJapanese: true,
    subtitle: point.pattern,
    detail: writtenText(example.vietnamese),
    detailSuffixKey: null,
    recap: lines,
  };
}

// ── Sắp xếp câu ────────────────────────────────────────────────────────────

export function buildN4OrderQuestions(
  pool: readonly N4ExampleRef[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return pool.map(({ example, usage, point }) =>
    makeQuestion({
      subject: exampleSubject(example, point, exampleRecap({ example, usage, point })),
      labelKey: 'exercise.label.order',
      prompt: writtenText(example.vietnamese),
      promptIsJapanese: false,
      hint: config.showGrammarHint ? hintOf(point) : null,
      hintIsJapanese: true,
      correctAnswer: plainText(example.japanese),
      acceptedAnswers: [],
      acceptedPatterns: [example.japanese, ...example.japaneseAlt],
      answerIsJapanese: true,
      answerPromptKey: 'exercise.answerPrompt.order',
      ignorePunctuation: true,
      isSentence: true,
      // Câu có thể xếp theo một thứ tự khác mà vẫn đúng (今朝｜雨に｜降られました đổi
      // 今朝 ra sau cũng được). Bộ chấm chỉ biết thứ tự của tài liệu và các cách nói tài
      // liệu ghi kèm, nên để người học tự xác nhận như câu luyện dịch — bậc này không
      // vào lịch ôn nên tự chấm không làm lệch gì.
      selfGradable: true,
      maxWrongAttempts: Math.max(1, config.maxWrongAttempts),
      chunks: [...example.chunks],
      sentence: {
        japanese: example.japanese,
        speaker: '',
        context: null,
        grammar: [],
        alternatives: example.japaneseAlt.map(plainText),
        complete: null,
      },
    }),
  );
}

// ── Điền vào chỗ trống ─────────────────────────────────────────────────────

export function buildN4BlankQuestions(
  pool: readonly N4ExampleRef[],
  quiz: readonly N4QuizRef[],
  config: PracticeConfig,
): PracticeQuestion[] {
  return [
    ...pool.flatMap((ref) => {
      const question = blankQuestion(ref, config);
      return question ? [question] : [];
    }),
    ...quiz.map((ref) => quizQuestion(ref, config)),
  ];
}

function blankQuestion({ example, usage, point }: N4ExampleRef, config: PracticeConfig): PracticeQuestion | null {
  const blank = example.blank;
  // Chỗ trống của câu ở mục so sánh thuộc về một mẫu khác (@id-mẫu): đáp án là mẫu đó.
  const index = indexOf(config);
  const target = blank ? index.pointById.get(blank.pointId) : undefined;
  if (!blank || !target) return null;

  const correctAnswer = target.pattern;
  const choices = shuffle([correctAnswer, ...distractorsOf(target, (item) => item.pattern, 'blank', index)]);

  const lines: RecapItem[] = [
    recapJp('exercise.n4.filled', blank.filled),
    recap('exercise.n4.meaning', target.meaning),
  ];
  if (target.structures.length > 0) lines.push(recap('grammar.structure', target.structures[0]));
  if (usage.title && target === point) lines.push(recap('grammar.recap.usage', usage.title));
  if (example.note) lines.push(recap('grammar.recap.note', example.note));

  return makeQuestion({
    subject: exampleSubject(example, target, lines),
    labelKey: 'exercise.label.blank',
    prompt: writtenText(blank.prompt),
    // Nghĩa tiếng Việt là một phần của đề chứ không phải gợi ý tuỳ chọn: thiếu nó thì
    // 「テレビをみ（　）、ごはんを食べます」 điền 〜たら cũng thành câu đúng ngữ pháp.
    hint: writtenText(example.vietnamese),
    correctAnswer,
    answerIsJapanese: true,
    answerPromptKey: 'practice.answerPrompt.japanese',
    isSentence: true,
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
    sentence: {
      japanese: blank.prompt,
      speaker: '',
      context: null,
      grammar: [],
      alternatives: [],
      complete: example.japanese,
    },
  });
}

/**
 * Một câu trong "Bài luyện tập" của tài liệu. Lựa chọn và đáp án giữ đúng tài liệu.
 *
 * Vài câu tài liệu cho HAI đáp án đúng (あったようですね/ あったらしいですね). Trắc
 * nghiệm ở đây chỉ nhận một đáp án, nên giữ đáp án đầu, bỏ đáp án đúng còn lại khỏi lựa
 * chọn, và ghi đủ cả hai ở phần ôn lại — người học vẫn biết cách kia cũng đúng.
 */
function quizQuestion({ item, section }: N4QuizRef, config: PracticeConfig): PracticeQuestion {
  const answers = item.answer.split('/').map((answer) => answer.trim());
  const isRight = (option: string) => answers.includes(plainText(option));
  const right = item.options.find(isRight) ?? item.options[0];
  const options = [right, ...item.options.filter((option) => !isRight(option))];
  const choices = shuffle(options.map(writtenText));

  const lines: RecapItem[] = [recapJp('exercise.n4.quizAnswer', item.answer)];
  if (item.note) lines.push(recap('grammar.recap.note', item.note));

  return makeQuestion({
    subject: {
      id: item.id,
      title: writtenText(item.prompt),
      titleIsJapanese: true,
      subtitle: section.title,
      detail: item.answer,
      detailSuffixKey: null,
      recap: lines,
    },
    labelKey: 'exercise.label.quiz',
    prompt: writtenText(item.prompt),
    // Chú thích của tài liệu (「Nhìn mặt Tanaka.」) là ngữ cảnh để chọn, không phải đáp án.
    hint: item.note || null,
    correctAnswer: writtenText(right),
    answerIsJapanese: true,
    answerPromptKey: 'practice.answerPrompt.japanese',
    isSentence: true,
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
    sentence: {
      japanese: item.prompt,
      speaker: '',
      context: null,
      grammar: [],
      alternatives: [],
      complete: null,
    },
  });
}

// ── Ý nghĩa ↔ ngữ pháp ─────────────────────────────────────────────────────

type MeaningDirection = 'pattern-to-meaning' | 'meaning-to-pattern';

/** Một sách ngữ pháp kèm các bảng tra dựng sẵn, tính một lần cho mỗi sách. */
interface BookIndex {
  book: GrammarBook;
  /** Mọi mẫu có ý nghĩa của sách — nguồn đáp án nhiễu, kể cả khi chỉ luyện vài mục. */
  points: readonly N4PointRef[];
  pointById: ReadonlyMap<string, N4Point>;
}

const BOOK_INDEX = new Map<string, BookIndex>();

/**
 * Sách của một phiên luyện, theo `config.exercise`. Đáp án nhiễu chỉ lấy trong CÙNG
 * sách: hai nguồn đặt tên mẫu và viết ý nghĩa theo hai kiểu, trộn vào nhau thì nhìn
 * cách viết là đoán ra đáp án.
 */
function indexOf(config: PracticeConfig): BookIndex {
  const book = grammarBookOf(config.exercise) ?? GRAMMAR_BOOKS[0];
  let index = BOOK_INDEX.get(book.id);
  if (!index) {
    const points = meaningPoints(book.sections);
    index = { book, points, pointById: new Map(points.map(({ point }) => [point.id, point])) };
    BOOK_INDEX.set(book.id, index);
  }
  return index;
}

export function buildN4MeaningQuestions(
  pool: readonly N4PointRef[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const directions: MeaningDirection[] =
    config.exerciseMode === 'pattern-to-meaning'
      ? ['pattern-to-meaning']
      : config.exerciseMode === 'meaning-to-pattern'
        ? ['meaning-to-pattern']
        : ['pattern-to-meaning', 'meaning-to-pattern'];

  return pool.flatMap((ref) => directions.map((direction) => meaningQuestion(ref, direction, config)));
}

function meaningQuestion(
  { point, section }: N4PointRef,
  direction: MeaningDirection,
  config: PracticeConfig,
): PracticeQuestion {
  const asksMeaning = direction === 'pattern-to-meaning';
  const valueOf = (item: N4Point) => (asksMeaning ? item.meaning : item.pattern);
  const correctAnswer = valueOf(point);
  const choices = shuffle([correctAnswer, ...distractorsOf(point, valueOf, 'meaning', indexOf(config))]);

  const lines: RecapItem[] = [
    recapJp('grammar.recap.pattern', point.pattern),
    recap('exercise.n4.meaning', point.meaning),
  ];
  if (point.structures.length > 0) lines.push(recap('grammar.structure', point.structures[0]));
  const example = point.usages.find((usage) => !usage.reference)?.examples[0];
  if (example) {
    lines.push(recapJp('exercise.n4.example', writtenText(example.japanese)));
    lines.push(recap('lesson.col.meaningShort', writtenText(example.vietnamese)));
  }

  return makeQuestion({
    subject: {
      id: point.id,
      title: point.pattern,
      titleIsJapanese: true,
      subtitle: section.title,
      detail: point.meaning,
      detailSuffixKey: null,
      recap: lines,
    },
    labelKey: asksMeaning ? 'exercise.label.patternToMeaning' : 'exercise.label.meaningToPattern',
    prompt: asksMeaning ? point.pattern : point.meaning,
    promptIsJapanese: asksMeaning,
    correctAnswer,
    answerIsJapanese: !asksMeaning,
    answerPromptKey: asksMeaning ? 'practice.answerPrompt.vietnamese' : 'practice.answerPrompt.japanese',
    choices,
    maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'choice', choices.length),
  });
}

/**
 * Ba đáp án nhiễu: tối đa hai mẫu trong cùng nhóm dễ nhầm, còn lại bốc ngẫu nhiên.
 * Lấy hết từ cùng nhóm thì câu hỏi về もう～ました chỉ toàn đáp án dạng もう/まだ — đoán
 * được bằng cách loại trừ hình thức chứ không cần hiểu nghĩa.
 *
 * Câu điền chỗ trống (`blank`) cấm thêm hai thứ, vì ở đó mẫu được đặt vào MỘT câu cụ thể
 * và mẫu nhiễu mà cũng vừa câu đó là câu hỏi hai đáp án đúng: mẫu cùng nhóm thay được
 * cho nhau (`interchangeableGroups`), và mẫu có thể trùng hình thức (`sameForm`).
 */
function distractorsOf(
  point: N4Point,
  valueOf: (item: N4Point) => string,
  kind: 'meaning' | 'blank',
  { book, points }: BookIndex,
): string[] {
  const banned = new Set([point.id, ...relatedOf(book.synonyms, point.id)]);
  let sameGroupAllowed = true;
  if (kind === 'blank') {
    relatedOf(book.sameForm, point.id).forEach((id) => banned.add(id));
    sameGroupAllowed = !book.interchangeableGroups.includes(point.group);
  }

  const candidates = points.map((ref) => ref.point).filter(
    (item) => !banned.has(item.id) && (sameGroupAllowed || !point.group || item.group !== point.group),
  );
  const sameGroup =
    point.group && sameGroupAllowed
      ? shuffle(candidates.filter((item) => item.group === point.group)).slice(0, 2)
      : [];
  const others = shuffle(candidates.filter((item) => !sameGroup.includes(item)));

  const used = new Set([valueOf(point)]);
  const picked: string[] = [];
  for (const item of [...sameGroup, ...others]) {
    if (picked.length >= CHOICE_COUNT - 1) break;
    const value = valueOf(item);
    if (used.has(value)) continue;
    used.add(value);
    picked.push(value);
  }
  return picked;
}

/** Các id cùng nhóm với `id` trong một danh sách nhóm (`synonyms`, `sameForm`). */
function relatedOf(groups: readonly (readonly string[])[], id: string): string[] {
  return groups.filter((group) => group.includes(id)).flat();
}

// ── Lộ trình dễ → khó ──────────────────────────────────────────────────────

/** Các mục đem ra hỏi ở từng bậc, đã lọc theo mục đang chọn và phạm vi ★. */
export interface N4Pools {
  /** Bậc 1 và 2. */
  points: readonly N4PointRef[];
  /** Bậc 3. */
  blanks: readonly N4ExampleRef[];
  /** Bậc 3 — "Bài luyện tập" của tài liệu. */
  quiz: readonly N4QuizRef[];
  /** Bậc 4. */
  orders: readonly N4ExampleRef[];
  /** Bậc 5. */
  examples: readonly N4ExampleRef[];
}

/** Số câu lộ trình sẽ hỏi — đếm trước được mà không phải dựng câu hỏi. */
export function pathQuestionCount(pools: N4Pools): number {
  return (
    pools.points.length * 2 +
    pools.blanks.length +
    pools.quiz.length +
    pools.orders.length +
    pools.examples.length
  );
}

const STEP_KEY: Readonly<Record<number, MessageKey>> = {
  1: 'exercise.step.1',
  2: 'exercise.step.2',
  3: 'exercise.step.3',
  4: 'exercise.step.4',
  5: 'exercise.step.5',
};

/**
 * Lộ trình: đi lần lượt từng MỤC theo thứ tự tài liệu, mỗi mục đi đủ năm bậc rồi mới
 * sang mục sau.
 *
 * Theo mục chứ không theo bậc (bậc 1 của cả 49 mục, rồi bậc 2…): đi theo bậc thì tới
 * lúc sắp xếp câu của ～ながら, người học đã qua hơn trăm câu của các mẫu khác và quên
 * mất nghĩa vừa ôn. Đi theo mục thì phiên cắt theo số câu ("20 câu") cũng thành một
 * chặng học trọn vẹn, và "học tiếp cụm sau" ở màn kết quả là sang chặng kế.
 *
 * Trong một bậc thì trộn thứ tự — các câu cùng bậc ngang sức nhau, giữ nguyên thứ tự
 * tài liệu chỉ khiến người học nhớ vị trí. Giữa các bậc thì không bao giờ trộn.
 *
 * Câu của bậc 1–2 và bậc 5 tự mang khoá lịch ôn (`nm` / `ne`) như khi luyện riêng từng
 * bậc; hai bậc giữa không vào lịch (xem `reviewRefOf`).
 */
export function buildN4PathQuestions(pools: N4Pools, config: PracticeConfig): PracticeQuestion[] {
  const stepConfig = (exerciseMode: PracticeConfig['exerciseMode']) => ({ ...config, exerciseMode });
  const review = (type: 'nm' | 'ne') => (question: PracticeQuestion) => ({
    ...question,
    review: { key: reviewKey(type, question.subject.id), source: config.lessonId },
  });

  return indexOf(config).book.sections.flatMap((section) => {
    const inSection = <T extends { section: { id: string } }>(items: readonly T[]) =>
      items.filter((item) => item.section.id === section.id);
    const points = inSection(pools.points);

    const steps: PracticeQuestion[][] = [
      buildN4MeaningQuestions(points, stepConfig('pattern-to-meaning')).map(review('nm')),
      buildN4MeaningQuestions(points, stepConfig('meaning-to-pattern')).map(review('nm')),
      buildN4BlankQuestions(inSection(pools.blanks), inSection(pools.quiz), config),
      buildN4OrderQuestions(inSection(pools.orders), config),
      buildN4ExampleQuestions(inSection(pools.examples), stepConfig('example-vi-jp')).map(review('ne')),
    ];

    return steps.flatMap((questions, index) => shuffle(questions).map((question) => inStep(question, index + 1)));
  });
}

/** Nhãn câu hỏi có thêm bậc phía trước: "Bậc 3 · Chọn mẫu ngữ pháp điền vào chỗ trống". */
function inStep(question: PracticeQuestion, step: number): PracticeQuestion {
  return {
    ...question,
    labelKey: 'exercise.label.step',
    labelParams: { step: STEP_KEY[step], label: question.labelKey },
  };
}
