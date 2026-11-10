/**
 * Dựng khối "Chữ Hán trong bài" (xem `onkun.model.ts`) từ bảng từ của một bài.
 *
 * File này kéo theo bảng âm thường dụng (73 kB), nên màn hình bài học nạp nó bằng
 * `import()` — chỉ bài N3 mới phải tải. `npm run verify:kanji-readings` cũng nạp thẳng
 * file này bằng Node, nên import kiểu phải tách riêng (`import type`).
 */

import type { VocabularyWord } from '../lessons/vocabulary.model';
import type { KanjiEntry } from './kanji.model';
import { toHiragana } from '../utils/kana';
import { alignReading, readingLabel, readingsOf } from './kanji-readings';
import type { KanjiReading, ReadingPiece } from './kanji-readings';
import type { LessonKanji, LessonKanjiExample, LessonReading } from './onkun.model';

/**
 * Các chữ Hán của bài, mỗi chữ kèm âm On / Kun và các từ của bài dùng chữ đó.
 *
 * @param entries Chữ của bài ở khu Kanji, theo thứ tự gặp trong bảng từ (`kanjiInTexts`).
 *   Chỉ lấy chữ có ở khu Kanji như lưới chữ trước đây: thẻ chữ link sang trang chữ, mà chữ
 *   ngoài danh sách JLPT (叩, 儘) không có trang nào để link tới.
 */
export function lessonKanjiOf(
  words: readonly VocabularyWord[],
  entries: readonly Pick<KanjiEntry, 'id' | 'char' | 'hanViet'>[],
): LessonKanji[] {
  const aligned = new Map(words.map((word) => [word.id, alignReading(word.japanese, word.reading)]));

  return entries.map((entry) => {
    const readings = readingsOf(entry.char);
    const examples: LessonKanjiExample[] = [];
    const used = new Set<KanjiReading>();

    for (const word of words) {
      if (!word.japanese.includes(entry.char)) continue;
      const example = exampleOf(word, entry.char, aligned.get(word.id) ?? null);
      examples.push(example.value);
      if (example.match) used.add(example.match);
    }

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
      on: (readings?.on ?? []).map(toLesson),
      kun: (readings?.kun ?? []).map(toLesson),
      examples,
    };
  });
}

function exampleOf(
  word: VocabularyWord,
  char: string,
  pieces: readonly ReadingPiece[] | null,
): { value: LessonKanjiExample; match: KanjiReading | null } {
  const base: LessonKanjiExample = {
    wordId: word.id,
    japanese: word.japanese,
    reading: word.reading,
    meaning: word.vietnamese,
    parts: null,
    sound: null,
    readingLabel: '',
    said: '',
  };

  // Lần gặp ĐẦU của chữ: 少々 có hai khúc đọc しょう, tô khúc đầu là đủ.
  const at =
    pieces?.findIndex(
      (piece) =>
        (piece.kind === 'kanji' && piece.text === char) ||
        (piece.kind === 'special' && piece.text.includes(char)),
    ) ?? -1;
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
