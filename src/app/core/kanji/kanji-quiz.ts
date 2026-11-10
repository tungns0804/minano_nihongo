/**
 * Tab "Trắc nghiệm" của khu Kanji: đề trắc nghiệm theo BÀI (N5 · Bài 17…), mỗi bài hai
 * phần như đề gốc — 問題1 đọc chữ Hán, 問題2 chọn cách viết.
 *
 * Khu Kanji còn lại đi theo từng CHỮ; đề này đi theo bài của nguồn đề, nên nằm ở một tab
 * riêng thay vì nhét vào trang một chữ (một câu hỏi nhiều chữ một lúc).
 *
 * Về mặt phiên luyện, đây là một "bài tập" (`lessonKind: 'exercise'`, id
 * `KANJI_QUIZ_ID`) có trang riêng `/kanji/trac-nghiem` — cùng cách với đề luyện N4 và
 * sách ngữ pháp vnjpclub: màn kết quả quay về đúng trang, ★ và lịch ôn lưu theo id này.
 *
 * Id câu `n5-17-1-6` = cấp · bài · 問題 · câu. KHÔNG đổi cách đặt: đó là khoá ★ và khoá
 * lịch ôn.
 */

import type { ExerciseMode } from '../exercises/exercise.model';
import { kanjiId } from './kanji.model';
import type { KanjiLevel } from './kanji.model';
import { KANJI_QUIZ_DATA } from './kanji-quiz.data';
// `import type` riêng: `npm run verify:kanji-quiz` nạp file này bằng
// --experimental-strip-types, chế độ đó không bóc được tên kiểu lẫn trong import giá trị.
import type { RawKanjiQuiz, RawQuizItem, RawStudyKanji } from './kanji-quiz.data';

export const KANJI_QUIZ_ID = 'trac-nghiem-kanji';

/** 問題1 đọc chữ Hán, 問題2 chọn cách viết — số 問題 lấy theo thứ tự trong mảng này. */
export type KanjiQuizKind = 'reading' | 'writing';

export const KANJI_QUIZ_KINDS: readonly KanjiQuizKind[] = ['reading', 'writing'];

export interface KanjiQuizQuestion {
  id: string;
  setId: string;
  level: KanjiLevel;
  lesson: number;
  /** Phần của bài (Bài 25 phần 1…); null với bài chỉ có một đề. */
  part: number | null;
  kind: KanjiQuizKind;
  /** Số 問題 trong đề (1 hoặc 2). */
  mondai: number;
  /** Số câu trong 問題, đánh từ 1 như đề. */
  number: number;
  prompt: string;
  options: readonly string[];
  answer: string;
  /** Phần gạch chân — chữ đang hỏi, đã bỏ furigana. */
  target: string;
  meaning: string;
  tip: string;
}

/** Một từ cần học, đã biết chữ đang học đọc theo âm On hay Kun. */
export interface KanjiStudyWord {
  word: string;
  reading: string;
  meaning: string;
  sound: 'on' | 'kun';
}

/** Một chữ cần học của bài: âm On, âm Kun và các từ dùng chữ đó. */
export interface KanjiStudy {
  char: string;
  hanViet: string;
  /** Id trang chữ ở khu Kanji (`/kanji/<id>`) — cùng cách dựng với khu đó. */
  kanjiId: string;
  on: readonly string[];
  kun: readonly string[];
  words: readonly KanjiStudyWord[];
}

export interface KanjiQuizSet {
  /** "n5-17", hoặc "n5-25-p1" với bài chia phần — dùng ghép id câu và để nhớ bài đang chọn. */
  id: string;
  level: KanjiLevel;
  lesson: number;
  part: number | null;
  /** Chữ & từ cần học; rỗng với bài chép từ đề có sẵn. */
  study: readonly KanjiStudy[];
  questions: readonly KanjiQuizQuestion[];
}

const UNDERLINE = /〈([^〉]*)〉/;

function buildSet(raw: RawKanjiQuiz): KanjiQuizSet {
  const part = raw.part ?? null;
  const id = `${raw.level.toLowerCase()}-${raw.lesson}${part === null ? '' : `-p${part}`}`;
  const questions = KANJI_QUIZ_KINDS.flatMap((kind, index) =>
    raw[kind].map((item, at) => buildQuestion(raw, id, kind, index + 1, at + 1, item)),
  );
  const study = (raw.study ?? []).map(buildStudy);
  return { id, level: raw.level, lesson: raw.lesson, part, study, questions };
}

function buildStudy(raw: RawStudyKanji): KanjiStudy {
  return {
    char: raw.char,
    hanViet: raw.hanViet,
    kanjiId: kanjiId(raw.char, raw.hanViet),
    on: raw.on,
    kun: raw.kun,
    words: raw.words.map(([word, reading, meaning, sound]) => ({ word, reading, meaning, sound })),
  };
}

function buildQuestion(
  raw: RawKanjiQuiz,
  setId: string,
  kind: KanjiQuizKind,
  mondai: number,
  number: number,
  [prompt, options, answer, meaning, tip]: RawQuizItem,
): KanjiQuizQuestion {
  return {
    id: `${setId}-${mondai}-${number}`,
    setId,
    level: raw.level,
    lesson: raw.lesson,
    part: raw.part ?? null,
    kind,
    mondai,
    number,
    prompt,
    options,
    answer: options[answer - 1] ?? '',
    target: (UNDERLINE.exec(prompt)?.[1] ?? '').replace(/\{([^|}]*)\|[^}]*\}/g, '$1'),
    meaning,
    tip,
  };
}

export const KANJI_QUIZ_SETS: readonly KanjiQuizSet[] = KANJI_QUIZ_DATA.map(buildSet);

const BY_ID: ReadonlyMap<string, KanjiQuizQuestion> = new Map(
  KANJI_QUIZ_SETS.flatMap((set) => set.questions.map((question) => [question.id, question])),
);

export function kanjiQuizQuestionById(id: string): KanjiQuizQuestion | null {
  return BY_ID.get(id) ?? null;
}

/** Chiều hỏi của tab này: cả đề theo thứ tự, hoặc riêng một 問題. */
export const KANJI_QUIZ_MODE_KIND: Readonly<Record<string, KanjiQuizKind | null>> = {
  'kq-all': null,
  'kq-reading': 'reading',
  'kq-writing': 'writing',
};

export function isKanjiQuizMode(mode: ExerciseMode): boolean {
  return mode in KANJI_QUIZ_MODE_KIND;
}

/** Câu của các bài đang chọn theo chiều hỏi, giữ thứ tự đề: bài → 問題 → câu. */
export function kanjiQuizQuestions(
  mode: ExerciseMode,
  setIds: readonly string[],
): KanjiQuizQuestion[] {
  const kind = KANJI_QUIZ_MODE_KIND[mode] ?? null;
  const wanted = new Set(setIds);
  return KANJI_QUIZ_SETS.filter((set) => wanted.has(set.id)).flatMap((set) =>
    set.questions.filter((question) => kind === null || question.kind === kind),
  );
}

/** "N5 第17課 問題1-6", "N5 第25課（1）問題1-6" — viết kiểu đề tiếng Nhật nên không phải dịch. */
export function kanjiQuizSource(question: KanjiQuizQuestion): string {
  const part = question.part === null ? '' : `（${question.part}）`;
  return `${question.level} 第${question.lesson}課${part} 問題${question.mondai}-${question.number}`;
}
