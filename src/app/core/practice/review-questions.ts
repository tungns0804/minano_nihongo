import type { ExerciseMode } from '../exercises/exercise.model';
import { counterById } from '../exercises/counters';
import { EXERCISE_VERBS } from '../exercises/exercise-verbs';
import { GRAMMAR_BOOKS } from '../exercises/grammar-books';
import { flattenN4Examples, meaningPoints } from '../exercises/n4-grammar.model';
import { TRANSITIVITY_PAIRS } from '../exercises/transitive-pairs';
import { KANJI_SESSION_ID } from '../kanji/kanji.model';
import { kanjiById } from '../kanji/kanji-entries';
import { RADICAL_SESSION_ID } from '../radical/radical.model';
import { radicalById } from '../radical/radical-entries';
import {
  PracticeConfig,
  PracticeQuestion,
  VerbPracticeMode,
  practiceConfig,
} from './practice.model';
import { Lesson, flattenGrammarExamples } from '../lessons/vocabulary.model';
import {
  ReviewAnswerMode,
  ReviewDirection,
  ReviewRef,
  parseReviewKey,
} from '../review/review.model';
import { pickRandom } from '../utils/random';
import {
  EXERCISE_FORMS,
  buildTransitivityQuestions,
  buildVerbFormQuestions,
} from './exercise-questions';
import { buildCounterQuestions } from './counter-questions';
import { buildGrammarQuestions } from './grammar-questions';
import { buildKanjiHanVietQuestions, buildKanjiWordQuestions } from './kanji-questions';
import { buildN4ExampleQuestions, buildN4MeaningQuestions } from './n4-grammar-questions';
import { buildRadicalHanVietQuestions } from './radical-questions';
import { FORMS_BY_MODE, buildVerbQuestions } from './verb-questions';
import { buildVocabularyQuestions } from './vocabulary-questions';

export type LessonLoader = (id: string) => Promise<Lesson | null>;

export interface ReviewQuestionOptions {
  answerMode: ReviewAnswerMode;
  direction: ReviewDirection;
}

/** Loại mục nằm trong file bài học — phải tải bài về mới dựng lại được câu hỏi. */
const LESSON_TYPES: ReadonlySet<string> = new Set(['w', 'g', 'v']);

/** Loại mục của bài "Đề luyện N4" — dữ liệu sách nặng nên chỉ tải khi phiên ôn có mục đó. */
const TAISAKU_TYPES: ReadonlySet<string> = new Set(['tv', 'tg']);

type TaisakuBuilder = typeof import('./taisaku-questions');

/**
 * Dựng lại câu hỏi cho các mục trong lịch ôn, giữ nguyên thứ tự `refs`.
 *
 * Không có bộ dựng câu hỏi riêng cho phiên ôn: mỗi mục đi qua ĐÚNG bộ dựng của khu
 * nó thuộc về, với một thiết lập dựng tạm cho riêng mục đó. Nhờ vậy câu ôn hỏi,
 * chấm và hiện phần ôn lại y như lúc luyện ở khu gốc.
 *
 * Mục không dựng lại được thì bỏ qua chứ không báo lỗi: bài tự nạp đã bị xoá, dữ
 * liệu đổi id sau khi sửa nguồn, hay bài chưa tải được vì mất mạng. Lịch của mục đó
 * vẫn giữ nguyên — mất mạng một lúc không được làm mất lịch ôn.
 */
export async function buildReviewQuestions(
  refs: readonly ReviewRef[],
  loadLesson: LessonLoader,
  options: ReviewQuestionOptions,
): Promise<PracticeQuestion[]> {
  const sources = new Set(
    refs
      .filter((ref) => LESSON_TYPES.has(parseReviewKey(ref.key)?.type ?? ''))
      .map((ref) => ref.source),
  );

  const lessons = new Map<string, Lesson | null>();
  await Promise.all(
    [...sources].map(async (id) => {
      lessons.set(id, await loadLesson(id));
    }),
  );

  const taisaku = refs.some((ref) => TAISAKU_TYPES.has(parseReviewKey(ref.key)?.type ?? ''))
    ? await import('./taisaku-questions')
    : null;

  return refs.flatMap((ref) => {
    const question = buildOne(ref, lessons, taisaku, options);
    return question ? [{ ...question, review: ref }] : [];
  });
}

function buildOne(
  ref: ReviewRef,
  lessons: ReadonlyMap<string, Lesson | null>,
  taisaku: TaisakuBuilder | null,
  options: ReviewQuestionOptions,
): PracticeQuestion | null {
  const parsed = parseReviewKey(ref.key);
  if (!parsed) return null;

  const { type, id } = parsed;
  const toJapanese = options.direction === 'vi-jp';
  // Mặc định gõ đáp án: chỉ hai khu có trắc nghiệm mới đè lại bằng lựa chọn của người học.
  const configOf = (
    overrides: Partial<PracticeConfig> & Pick<PracticeConfig, 'lessonKind'>,
  ): PracticeConfig =>
    practiceConfig({
      lessonId: ref.source,
      answerMode: 'typing',
      direction: options.direction,
      ...overrides,
    });

  switch (type) {
    case 'w': {
      const lesson = lessons.get(ref.source);
      const word = lesson?.words.find((item) => item.id === id);
      if (!lesson || !word) return null;
      return (
        buildVocabularyQuestions(
          [word],
          // Đáp án nhiễu lấy từ cả bài chứa từ đó, như lúc luyện ở bài gốc.
          lesson.words,
          configOf({ lessonKind: lesson.kind, answerMode: options.answerMode }),
        )[0] ?? null
      );
    }

    case 'g': {
      const lesson = lessons.get(ref.source);
      const example = lesson
        ? flattenGrammarExamples(lesson.grammarPoints).find((item) => item.example.id === id)
        : undefined;
      if (!example) return null;
      // Luôn hiện mẫu ngữ pháp làm gợi ý, như mặc định của trang ngữ pháp.
      return buildGrammarQuestions([example], configOf({ lessonKind: 'grammar', showGrammarHint: true }))[0] ?? null;
    }

    case 'v': {
      const lesson = lessons.get(ref.source);
      const verb = lesson?.verbs.find((item) => item.id === id);
      if (!lesson || !verb) return null;
      const verbMode: VerbPracticeMode = toJapanese ? 'meaning-to-form' : 'masu-to-form';
      return (
        buildVerbQuestions(
          [verb],
          lesson.verbs,
          configOf({
            lessonKind: 'verb',
            answerMode: options.answerMode,
            verbMode,
            // Mỗi lần ôn hỏi một thể bất kỳ: lịch ôn tính theo ĐỘNG TỪ, không theo thể.
            verbForms: pickRandom(FORMS_BY_MODE[verbMode], 1),
          }),
        )[0] ?? null
      );
    }

    case 'kw': {
      const entry = kanjiById(ref.source);
      const word = entry?.words.find((item) => item.id === id);
      if (!entry || !word) return null;
      return (
        buildKanjiWordQuestions(
          [word],
          entry,
          configOf({ lessonKind: 'kanji', kanjiMode: toJapanese ? 'word-reading' : 'word-meaning' }),
        )[0] ?? null
      );
    }

    case 'kc': {
      const entry = kanjiById(id);
      if (!entry?.hanViet) return null;
      return (
        buildKanjiHanVietQuestions(
          [entry],
          configOf({ lessonKind: 'kanji', lessonId: KANJI_SESSION_ID, kanjiMode: 'kanji-hanviet' }),
        )[0] ?? null
      );
    }

    case 'rc': {
      const entry = radicalById(id);
      if (!entry?.hanViet) return null;
      // Thẻ có thể sinh từ câu viết bộ; khi ôn luôn hỏi âm Hán Việt như thẻ chữ Hán `kc`.
      return (
        buildRadicalHanVietQuestions(
          [entry],
          configOf({ lessonKind: 'radical', lessonId: RADICAL_SESSION_ID, radicalMode: 'radical-hanviet' }),
        )[0] ?? null
      );
    }

    case 'ev': {
      const verb = EXERCISE_VERBS.find((item) => item.id === id);
      if (!verb) return null;
      return (
        buildVerbFormQuestions(
          [verb],
          configOf({
            lessonKind: 'exercise',
            exercise: 'chuyen-the-dong-tu',
            exerciseMode: toJapanese ? 'form-to-masu' : 'masu-to-form',
            verbForms: pickRandom(EXERCISE_FORMS, 1),
            // Hiện nghĩa như mặc định của khu Bài tập: động từ trơ không có nghĩa thì
            // nhiều từ gần giống nhau không phân biệt nổi.
            showHanViet: true,
          }),
        )[0] ?? null
      );
    }

    case 'tp': {
      const pair = TRANSITIVITY_PAIRS.find((item) => item.id === id);
      if (!pair) return null;
      const exerciseMode = pickRandom<ExerciseMode>(['to-transitive', 'to-intransitive'], 1)[0];
      return (
        buildTransitivityQuestions(
          [pair],
          configOf({ lessonKind: 'exercise', exercise: 'tu-tha-dong-tu', exerciseMode, showHanViet: true }),
        )[0] ?? null
      );
    }

    case 'ct': {
      const item = counterById(id);
      if (!item) return null;
      // Chiều Nhật → Việt là đọc 3本; trắc nghiệm hay gõ theo lựa chọn của người học.
      const exerciseMode: ExerciseMode = toJapanese
        ? 'counter-vi-jp'
        : options.answerMode === 'choice'
          ? 'counter-choice'
          : 'counter-reading';
      return (
        buildCounterQuestions(
          [item],
          configOf({
            lessonKind: 'exercise',
            exercise: 'so-dem',
            exerciseMode,
            answerMode: exerciseMode === 'counter-choice' ? 'choice' : 'typing',
            showHanViet: true,
          }),
        )[0] ?? null
      );
    }

    case 'tv':
    case 'tg':
      // Mọi câu của bài này là trắc nghiệm, kể cả khi người học chọn "gõ": đề luyện thi
      // chỉ có lựa chọn, và gõ lại cả một câu lựa chọn thì không còn là đề thi nữa.
      return (
        taisaku?.buildTaisakuReviewQuestion(id, toJapanese, (exerciseMode) =>
          configOf({
            lessonKind: 'exercise',
            exercise: 'taisaku-n4',
            exerciseMode,
            answerMode: 'choice',
            showFurigana: true,
          }),
        ) ?? null
      );

    case 'ne': {
      // Khoá thẻ không ghi sách: tìm trong mọi sách, câu thuộc sách nào thì hỏi như sách đó.
      const found = findInBooks((book) => flattenN4Examples(book.sections).find((item) => item.example.id === id));
      if (!found) return null;
      const [example, book] = found;
      // Luôn hiện mẫu ngữ pháp làm gợi ý, như mặc định của chính bài tập.
      return (
        buildN4ExampleQuestions(
          [example],
          configOf({
            lessonKind: 'exercise',
            exercise: book.id,
            exerciseMode: toJapanese ? 'example-vi-jp' : 'example-jp-vi',
            showGrammarHint: true,
          }),
        )[0] ?? null
      );
    }

    case 'nm': {
      const found = findInBooks((book) => meaningPoints(book.sections).find((item) => item.point.id === id));
      if (!found) return null;
      const [point, book] = found;
      // Luôn trắc nghiệm, kể cả khi người học chọn "gõ": ý nghĩa là một câu mô tả dài,
      // gõ lại cho khớp từng chữ thì không còn là nhớ ngữ pháp.
      return (
        buildN4MeaningQuestions(
          [point],
          configOf({
            lessonKind: 'exercise',
            exercise: book.id,
            exerciseMode: toJapanese ? 'meaning-to-pattern' : 'pattern-to-meaning',
            answerMode: 'choice',
          }),
        )[0] ?? null
      );
    }
  }
}

/** Mục đầu tiên tìm thấy qua các sách ngữ pháp, kèm sách chứa nó. */
function findInBooks<T>(
  find: (book: (typeof GRAMMAR_BOOKS)[number]) => T | undefined,
): [T, (typeof GRAMMAR_BOOKS)[number]] | null {
  for (const book of GRAMMAR_BOOKS) {
    const item = find(book);
    if (item) return [item, book];
  }
  return null;
}
