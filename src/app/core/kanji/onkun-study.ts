/**
 * Dựng thẻ chữ của khối âm On / Kun (xem `onkun.model.ts`) cho hai nơi:
 *  - khối "Chữ Hán trong bài" của bài từ vựng N3 — ví dụ là từ của chính bài (`lessonKanjiOf`);
 *  - tab Kanji › Âm On/Kun — chữ của bảng bài giảng, ví dụ là từ viết tay của bảng cộng
 *    từ N5–N3 trong kho của khu Kanji (`boardKanjiOf`).
 *
 * File này kéo theo bảng âm thường dụng (73 kB), nên màn hình nạp nó bằng `import()`.
 * `npm run verify:kanji-readings` cũng nạp thẳng file này bằng Node, nên import kiểu phải
 * tách riêng (`import type`) và không được đụng tới Angular.
 */

import type { VocabularyWord } from '../lessons/vocabulary.model';
import { STROKE_CHARS } from '../strokes/stroke-coverage.generated';
import { toHiragana } from '../utils/kana';
import type { KanjiEntry, KanjiLevel } from './kanji.model';
import { alignReading, readingLabel, readingsOf } from './kanji-readings';
import type { KanjiReading, ReadingPiece } from './kanji-readings';
import type { LessonKanji, LessonKanjiExample, LessonReading } from './onkun.model';

/** Một từ đem làm ví dụ, đã tách khỏi nguồn (từ của bài, từ viết tay, từ trong kho). */
interface ExampleSource {
  id: string;
  japanese: string;
  reading: string;
  meaning: string;
}

type CardEntry = Pick<KanjiEntry, 'id' | 'char' | 'hanViet' | 'altHanViet'>;

const DRAWABLE = new Set(STROKE_CHARS);

const alignCache = new Map<string, readonly ReadingPiece[] | null>();

function align(source: ExampleSource): readonly ReadingPiece[] | null {
  const key = `${source.japanese}|${source.reading}`;
  if (!alignCache.has(key)) alignCache.set(key, alignReading(source.japanese, source.reading));
  return alignCache.get(key)!;
}

/** Khúc của chữ trong từ — lần gặp ĐẦU: 少々 có hai khúc しょう, tô khúc đầu là đủ. */
function pieceOf(pieces: readonly ReadingPiece[] | null, char: string): number {
  return (
    pieces?.findIndex(
      (piece) =>
        (piece.kind === 'kanji' && piece.text === char) ||
        (piece.kind === 'special' && piece.text.includes(char)),
    ) ?? -1
  );
}

/**
 * Các chữ Hán của một bài từ vựng, mỗi chữ kèm âm On / Kun và các từ của bài dùng chữ đó.
 *
 * @param entries Chữ của bài ở khu Kanji, theo thứ tự gặp trong bảng từ (`kanjiInTexts`).
 *   Chỉ lấy chữ có ở khu Kanji như lưới chữ trước đây: thẻ chữ link sang trang chữ, mà chữ
 *   ngoài danh sách JLPT (叩, 儘) không có trang nào để link tới.
 */
export function lessonKanjiOf(
  words: readonly VocabularyWord[],
  entries: readonly CardEntry[],
): LessonKanji[] {
  const sources = words.map((word) => ({
    id: word.id,
    japanese: word.japanese,
    reading: word.reading,
    meaning: word.vietnamese,
  }));
  return entries.map((entry) =>
    cardOf(
      entry,
      sources.filter((source) => source.japanese.includes(entry.char)),
      false,
    ),
  );
}

/** Một chữ trên bảng bài giảng. */
export interface BoardCell {
  entry: KanjiEntry;
  /** Từ viết tay, "từ|cách đọc|nghĩa" (`BOARD_EXAMPLES`). */
  examples: readonly string[];
  marked: boolean;
}

/** Thẻ chữ của bảng bài giảng, giữ thứ tự trên bảng. */
export function boardKanjiOf(cells: readonly BoardCell[]): LessonKanji[] {
  return cells.map((cell) => cardOf(cell.entry, boardSources(cell.entry, cell.examples), cell.marked));
}

/** Thẻ học N5–N3: từ cấp cao hơn trong kho (N2 của bộ động từ) không đem làm ví dụ. */
const LEVEL_RANK: Partial<Record<KanjiLevel, number>> = { N5: 0, N4: 1, N3: 2 };

/**
 * Cụm của sách chứ không phải một từ: có を, hoặc trợ từ đứng ngay trước một chữ Hán
 * (値段が上がります, 会議に出席します, 男性と比べます). Không bắt が của okurigana:
 * 召し上がります, 曲がります vẫn là một từ.
 */
const PHRASE = /を|[がにへでと]\p{Script=Han}|[～〜]/u;
const MAX_EXAMPLES = 4;

/**
 * Ví dụ của một chữ trên bảng: từ viết tay trước (từ thầy ghi, từ bù), rồi từ trong kho
 * của khu Kanji cho tới đủ bốn từ — ưu tiên từ dùng một âm CHƯA có ví dụ, rồi từ cấp thấp,
 * từ ngắn.
 *
 * Từ trong kho chép từ sách nên có cả cụm 公園を散歩します và dạng ます của cùng một từ
 * (押します cạnh 押す viết tay): bỏ cụm (`PHRASE`), và coi hai từ cùng bộ chữ Hán cùng
 * âm là một.
 */
function boardSources(entry: KanjiEntry, hand: readonly string[]): ExampleSource[] {
  const chosen: ExampleSource[] = [];
  const seen = new Set<string>();
  const covered = new Set<string>();

  // Từ viết tay luôn giữ (người soạn đã chọn: 濃い và 濃さ đứng cạnh nhau là cố ý); chỉ từ
  // lấy từ kho mới bị bỏ khi trùng một từ đã có.
  const add = (source: ExampleSource, fromHand = false): void => {
    const pieces = align(source);
    const at = pieceOf(pieces, entry.char);
    const match = at >= 0 ? pieces![at].match : null;
    // Bỏ đuôi hiragana (okurigana, ます, な): 押す / 押します, 確認 / 確認します là một từ,
    // còn ごみ箱 với 箱 thì không.
    const stem = source.japanese.replace(/[ぁ-ゖ]+$/, '');
    const key = `${stem}|${match ? readingLabel(match) : at >= 0 ? 'special' : '?'}`;
    if (seen.has(key) && !fromHand) return;
    if (chosen.some((item) => item.japanese === source.japanese)) return;
    seen.add(key);
    chosen.push(source);
    if (match) covered.add(readingLabel(match));
  };

  for (const item of hand) {
    const [japanese, reading, meaning] = item.split('|');
    add({ id: `${japanese}|${reading}`, japanese, reading, meaning }, true);
  }

  const store = entry.words
    .filter(
      (word) =>
        LEVEL_RANK[word.level] !== undefined &&
        !PHRASE.test(word.japanese) &&
        [...word.japanese].length <= 8,
    )
    .map((word) => ({
      source: { id: word.id, japanese: word.japanese, reading: word.reading, meaning: word.meaning },
      rank: LEVEL_RANK[word.level]!,
    }))
    .filter(({ source }) => {
      const pieces = align(source);
      const at = pieceOf(pieces, entry.char);
      return at >= 0 && pieces![at].match !== null;
    })
    .sort((a, b) => a.rank - b.rank || a.source.japanese.length - b.source.japanese.length)
    .map(({ source }) => source);

  const labelOf = (source: ExampleSource) => {
    const pieces = align(source)!;
    return readingLabel(pieces[pieceOf(pieces, entry.char)].match!);
  };
  for (const source of store) {
    if (chosen.length >= MAX_EXAMPLES) break;
    if (!covered.has(labelOf(source))) add(source);
  }
  for (const source of store) {
    if (chosen.length >= MAX_EXAMPLES) break;
    add(source);
  }
  return chosen;
}

function cardOf(entry: CardEntry, sources: readonly ExampleSource[], marked: boolean): LessonKanji {
  const readings = readingsOf(entry.char);
  const used = new Set<KanjiReading>();
  const examples = sources.map((source) => {
    const example = exampleOf(source, entry.char, align(source));
    if (example.match) used.add(example.match);
    return example.value;
  });

  const toLesson = (reading: KanjiReading): LessonReading => ({
    sound: reading.sound,
    label: readingLabel(reading),
    stem: reading.stem,
    rare: reading.rare,
    used: used.has(reading),
  });

  return {
    id: entry.id,
    char: entry.char,
    hanViet: entry.hanViet,
    altHanViet: entry.altHanViet,
    on: (readings?.on ?? []).map(toLesson),
    kun: (readings?.kun ?? []).map(toLesson),
    examples,
    drawable: DRAWABLE.has(entry.char),
    marked,
  };
}

function exampleOf(
  source: ExampleSource,
  char: string,
  pieces: readonly ReadingPiece[] | null,
): { value: LessonKanjiExample; match: KanjiReading | null } {
  const base: LessonKanjiExample = {
    wordId: source.id,
    japanese: source.japanese,
    reading: source.reading,
    meaning: source.meaning,
    parts: null,
    sound: null,
    readingLabel: '',
    said: '',
  };

  const at = pieceOf(pieces, char);
  if (!pieces || at < 0) return { value: base, match: null };

  const piece = pieces[at];
  const join = (list: readonly ReadingPiece[]) => list.map((item) => item.reading).join('');
  const parts = [join(pieces.slice(0, at)), piece.reading, join(pieces.slice(at + 1))] as const;
  // Cách đọc in ra lấy từ chính các khúc đã căn để khúc tô màu khớp từng ký tự — chuỗi
  // gốc có thể còn phần tuỳ chọn trong ngoặc mà các khúc đã bỏ.
  const located = { ...base, reading: parts.join(''), parts };

  if (piece.kind === 'special') {
    return { value: { ...located, sound: 'special' }, match: null };
  }
  const match = piece.match!;
  return {
    value: {
      ...located,
      sound: match.sound,
      readingLabel: readingLabel(match),
      said: toHiragana(piece.reading),
    },
    match,
  };
}
