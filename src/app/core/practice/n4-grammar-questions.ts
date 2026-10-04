import type { MessageKey } from '../i18n/messages';
import { N4_SECTIONS, N4_SYNONYMS } from '../exercises/n4-grammar';
import {
  N4ExampleRef,
  N4Point,
  N4PointRef,
  meaningPoints,
} from '../exercises/n4-grammar.model';
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
 * Dựng câu hỏi cho bài tập "Luyện tập ngữ pháp N4" (`core/exercises/n4-grammar.ts`).
 *
 * Hai kiểu câu:
 *
 * 1. DỊCH CÂU VÍ DỤ — giống bài ngữ pháp 皆の日本語: gõ cả câu, chấm bỏ qua dấu câu,
 *    gợi ý là chính mẫu ngữ pháp. Khác ở chỗ chấm theo CÂU MẪU (`acceptedPatterns`) như
 *    khu Luyện dịch: câu ví dụ ghi furigana {漢字|かな}, nên gõ chữ Hán, gõ kana hay gõ
 *    lẫn đều đúng, và chỗ tài liệu ghi hai cách nói [a/b] thì cách nào cũng được.
 *    Không cho tự chấm như khu Luyện dịch: câu ví dụ có đúng một bản dịch của tài liệu,
 *    và câu đã chấm thì vào lịch ôn — lịch ôn chỉ tin vào kết quả chấm máy.
 *
 * 2. Ý NGHĨA ↔ NGỮ PHÁP — trắc nghiệm bốn lựa chọn trên từng MẪU. Đáp án nhiễu ưu tiên
 *    lấy trong nhóm mẫu dễ nhầm với nhau (ば / たら / と / なら…), vì phân biệt chúng mới
 *    là chỗ khó; không bao giờ lấy mẫu CÙNG nghĩa (`N4_SYNONYMS`).
 */

// ── Dịch câu ví dụ ─────────────────────────────────────────────────────────

export function buildN4ExampleQuestions(
  pool: readonly N4ExampleRef[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const toJapanese = config.exerciseMode !== 'example-jp-vi';

  return pool.map(({ example, usage, point }) => {
    const lines: RecapItem[] = [recapJp('grammar.recap.pattern', point.pattern)];
    if (point.meaning) lines.push(recap('exercise.n4.meaning', point.meaning));
    if (usage.title) lines.push(recap('grammar.recap.usage', usage.title));
    if (example.note) lines.push(recap('grammar.recap.note', example.note));

    const answer = toJapanese ? example.japanese : example.vietnamese;
    const answerAlt = toJapanese ? example.japaneseAlt : example.vietnameseAlt;

    return makeQuestion({
      subject: {
        id: example.id,
        title: writtenText(example.japanese),
        titleIsJapanese: true,
        subtitle: point.pattern,
        detail: writtenText(example.vietnamese),
        detailSuffixKey: null,
        recap: lines,
      },
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
      },
    });
  });
}

/** Gợi ý gọn một dòng: tên mẫu, kèm công thức đầu tiên nếu có — như bài ngữ pháp 皆の日本語. */
function hintOf(point: N4Point): string {
  return point.structures.length > 0 ? `${point.pattern} — ${point.structures[0]}` : point.pattern;
}

// ── Ý nghĩa ↔ ngữ pháp ─────────────────────────────────────────────────────

type MeaningDirection = 'pattern-to-meaning' | 'meaning-to-pattern';

/** Mọi mẫu có ý nghĩa của tài liệu — nguồn đáp án nhiễu, kể cả khi chỉ luyện vài mục. */
const ALL_MEANING_POINTS: readonly N4PointRef[] = meaningPoints(N4_SECTIONS);

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
  const choices = shuffle([correctAnswer, ...distractorsOf(point, valueOf)]);

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
 */
function distractorsOf(point: N4Point, valueOf: (item: N4Point) => string): string[] {
  const banned = new Set([point.id, ...synonymsOf(point.id)]);
  const candidates = ALL_MEANING_POINTS.map((ref) => ref.point).filter((item) => !banned.has(item.id));
  const sameGroup = point.group
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

function synonymsOf(id: string): string[] {
  return N4_SYNONYMS.filter((group) => group.includes(id)).flat();
}
