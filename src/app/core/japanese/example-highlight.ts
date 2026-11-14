/**
 * Tìm từ đang học trong câu ví dụ của chính nó, để bảng từ vựng tô đúng chỗ đó.
 *
 * Tìm nguyên văn là không đủ: một phần ba số câu ví dụ dùng từ ở dạng đã chia —
 * 渇く nằm trong câu dưới dạng 渇いた, 殴る thành 殴られました, 得意な thành
 * 得意です, cụm 「（お）湯を沸かす」 thành お湯を沸かして. Ở đây không cần một bộ
 * tách từ: câu ví dụ do chính bài học viết ra để minh hoạ đúng từ đó, nên chỉ cần
 * đoán được "gốc" của từ (phần không đổi khi chia) rồi đi tiếp qua đuôi chia.
 *
 * Không tìm được thì trả `null` và bảng hiện câu như cũ — tô nhầm chỗ còn tệ hơn
 * không tô, nên mọi luật dưới đây đều thà bỏ sót còn hơn đoán bừa.
 */

/** Câu ví dụ cắt làm ba: phần trước từ, chính từ đó (đã chia nếu có), phần sau. */
export type ExampleParts = readonly [before: string, word: string, after: string];

/** Các hàng kana của động từ nhóm 1, theo thứ tự あ い う え お. */
const GODAN_ROWS = [
  'わいうえお',
  'かきくけこ',
  'がぎぐげご',
  'さしすせそ',
  'たちつてと',
  'なにぬねの',
  'ばびぶべぼ',
  'まみむめも',
  'らりるれろ',
];

/** Âm biến (音便) của dạng て/た. 行く là chữ duy nhất đổi く → っ, gộp luôn vào hàng く. */
const ONBIN: Record<string, string> = {
  う: 'っ',
  く: 'いっ',
  ぐ: 'い',
  つ: 'っ',
  る: 'っ',
  ぬ: 'ん',
  ぶ: 'ん',
  む: 'ん',
};

/**
 * Đuôi trợ động từ nối sau gốc đã chia, dài trước ngắn sau để luôn ăn đuôi dài nhất.
 *
 * Chỉ những đuôi còn nối tiếp được (bị động, sai khiến, すぎ) mới cho đi tiếp; còn
 * lại là đuôi kết thúc. Nếu cho ăn tràn thì 渇いたので sẽ tô cả ので, còn
 * 預かってくれました tô luôn くれました — người học thấy cả cụm sáng lên mà không
 * biết đâu là từ mình đang học.
 */
const AUXILIARIES: readonly string[] = [
  'ませんでした', 'ましょう', 'ません', 'ました', 'ます',
  'なかった', 'なければ', 'なくて', 'ないで', 'なさい', 'ながら', 'ない', 'なく',
  'たかった', 'たくて', 'たい', 'たく',
  'たら', 'だら', 'たり', 'だり', 'て', 'で', 'た', 'だ',
  'やすい', 'やすく', 'にくい', 'にくく', 'そう', 'すぎ',
  'られ', 'させ', 'れ', 'せ', 'よう', 'る', 'ば', 'ず',
];
const CHAINING = new Set(['られ', 'させ', 'れ', 'せ', 'すぎ']);

/** Đuôi của tính từ い, sau gốc (濃い → 濃). Chỉ すぎ nối tiếp được: 濃すぎます. */
const ADJECTIVE_ENDINGS = ['くなかった', 'くない', 'かった', 'くて', 'ければ', 'く', 'さ', 'い', 'そう', 'すぎ'];

/** Đuôi của する: 運動します → 運動 + し/する/され/でき… */
const SURU_ENDINGS = ['する', 'しよう', 'し', 'さ', 'せ', 'でき'];

/** Trợ từ ngăn giữa các phần của một cụm như 「材料を刻む」. */
const PARTICLES = 'をがにではのとへも';

const KANJI = /[㐀-鿿々〆]/;

/**
 * Một cách đoán gốc của từ: `stem` là phần không đổi, `endings` là các đuôi có thể
 * nối ngay sau nó (chuỗi rỗng = nối thẳng trợ động từ, như gốc động từ nhóm 2).
 * Đuôi nằm trong `final` là dạng hoàn chỉnh rồi, không nhận thêm trợ động từ.
 */
interface StemGuess {
  stem: string;
  endings: readonly string[];
  final: ReadonlySet<string>;
}

interface Match {
  start: number;
  end: number;
  /** Đã là một dạng trọn vẹn (khớp nguyên văn, dạng từ điển, có đuôi chia) chứ không chỉ là gốc. */
  complete: boolean;
}

export function exampleParts(sentence: string, japanese: string, reading = ''): ExampleParts | null {
  if (!sentence) return null;
  const variants = headwordVariants(japanese, reading);
  // Lượt đầu chỉ nhận dạng trọn vẹn. Gốc trơn (決まり、) chỉ dùng khi không còn
  // cách nào khác — gốc một chữ kana như ふ của ふく thì "ふきん" cũng khớp.
  for (const complete of [true, false]) {
    for (const variant of variants) {
      const match = findIn(sentence, variant, complete);
      if (match) {
        return [sentence.slice(0, match.start), sentence.slice(match.start, match.end), sentence.slice(match.end)];
      }
    }
  }
  return null;
}

/**
 * Các cách viết của từ, theo thứ tự ưu tiên: chữ Nhật trước cách đọc, cả cụm
 * trước phần đuôi của cụm.
 *
 * 「（お）湯を沸かす」 cho ra お湯を沸かす rồi 湯を沸かす; 「材料を刻む」 lùi dần
 * về 刻む khi câu chen chữ vào giữa (野菜などの材料を細かく刻みます).
 */
function headwordVariants(japanese: string, reading: string): string[] {
  const out: string[] = [];
  const add = (text: string) => {
    const clean = text.replace(/[～〜~\s]/g, '');
    if (clean && !out.includes(clean)) out.push(clean);
  };
  const sources = [japanese, reading].flatMap((text) => text.split(/[/／]/));
  for (const source of sources) {
    // Phần trong ngoặc là phần có cũng được không cũng được: （お）茶わん, [お]祭り.
    add(source.replace(/[（(［[]([^）)］\]]*)[）)］\]]/g, '$1'));
    add(source.replace(/[（(［[][^）)］\]]*[）)］\]]/g, ''));
  }
  for (const phrase of [...out]) {
    for (let i = 1; i < phrase.length - 1; i++) {
      if (!PARTICLES.includes(phrase[i])) continue;
      const tail = phrase.slice(i + 1);
      if (tail.length >= 2 && !out.includes(tail)) out.push(tail);
    }
  }
  return out;
}

function findIn(sentence: string, word: string, complete: boolean): Match | null {
  const exact = findExact(sentence, word);
  if (exact) return exact;
  // Tính từ な: sách ghi 得意な, câu viết 得意です / 正直に.
  if (word.endsWith('な') && word.length > 1) {
    const base = findExact(sentence, word.slice(0, -1));
    if (base) return base;
  }
  let best: Match | null = null;
  for (const guess of stemGuesses(word)) {
    for (const match of matchGuess(sentence, guess)) {
      if (complete !== match.complete) continue;
      if (!best || match.end - match.start > best.end - best.start) best = match;
    }
  }
  return best;
}

/**
 * Khớp nguyên văn. Có nhiều chỗ thì ưu tiên chỗ không dính vào chữ Hán khác — 番
 * trong 順番に並ぶ chưa chắc là chữ 番 "lượt" đang học.
 */
function findExact(sentence: string, word: string): Match | null {
  let first: Match | null = null;
  for (let at = sentence.indexOf(word); at >= 0; at = sentence.indexOf(word, at + 1)) {
    const match = { start: at, end: at + word.length, complete: true };
    const gluedBefore = KANJI.test(word[0]) && KANJI.test(sentence[at - 1] ?? '');
    const gluedAfter = KANJI.test(word.at(-1)!) && KANJI.test(sentence[match.end] ?? '');
    if (!gluedBefore && !gluedAfter) return match;
    first ??= match;
  }
  return first;
}

/** Các cách đoán gốc từ dạng từ điển (渇く, 倒れる, 濃い, 運動する) hoặc dạng ます (逃げます). */
function stemGuesses(word: string): StemGuess[] {
  const guesses: StemGuess[] = [];
  const none = new Set<string>();
  const last = word.at(-1)!;

  // Không dừng ở đây: 冷ます, 覚ます là dạng từ điển đuôi す, chỉ trùng mặt chữ với ます.
  if (word.endsWith('ます') && word.length > 2) {
    const masu = word.slice(0, -2);
    const tail = masu.at(-1)!;
    // Nhóm 2 (逃げ), hoặc nhóm 1 khi gốc ます giữ nguyên (書き → 書きました).
    guesses.push({ stem: masu, endings: [''], final: none });
    const row = GODAN_ROWS.find((r) => r[1] === tail);
    if (row && masu.length > 1) guesses.push(godanGuess(masu.slice(0, -1), row));
    if (tail === 'し' && masu.length > 1) {
      guesses.push({ stem: masu.slice(0, -1), endings: SURU_ENDINGS, final: new Set(['する', 'しよう']) });
    }
  }

  if (word.endsWith('する') && word.length > 2) {
    guesses.push({ stem: word.slice(0, -2), endings: SURU_ENDINGS, final: new Set(['する', 'しよう']) });
  }
  if (last === 'い' && word.length > 1) {
    guesses.push({ stem: word.slice(0, -1), endings: ADJECTIVE_ENDINGS, final: new Set(ADJECTIVE_ENDINGS.filter((e) => e !== 'すぎ')) });
  }
  const row = GODAN_ROWS.find((r) => r[2] === last);
  if (row && word.length > 1) {
    guesses.push(godanGuess(word.slice(0, -1), row));
    // Đuôi る còn có thể là nhóm 2: 倒れる → 倒れ + ました.
    if (last === 'る') guesses.push({ stem: word.slice(0, -1), endings: [''], final: none });
  }
  return guesses;
}

function godanGuess(stem: string, row: string): StemGuess {
  const dictionary = row[2];
  const volitional = row[4] + 'う';
  return {
    stem,
    endings: [volitional, ...row, ...(ONBIN[dictionary] ?? '')],
    final: new Set([dictionary, volitional]),
  };
}

function* matchGuess(sentence: string, guess: StemGuess): Generator<Match> {
  const { stem } = guess;
  // Gốc một chữ kana (け của ける) dễ khớp nhầm vào giữa chữ khác: bắt buộc có đuôi chia.
  const weakStem = stem.length < 2 && !KANJI.test(stem);
  for (let at = sentence.indexOf(stem); at >= 0; at = sentence.indexOf(stem, at + 1)) {
    const afterStem = at + stem.length;
    for (const ending of guess.endings) {
      if (!sentence.startsWith(ending, afterStem)) continue;
      let end = afterStem + ending.length;
      let auxiliaries = 0;
      if (!guess.final.has(ending)) {
        for (let chaining = true; chaining; ) {
          const aux = AUXILIARIES.find((a) => sentence.startsWith(a, end));
          if (!aux) break;
          end += aux.length;
          auxiliaries++;
          chaining = CHAINING.has(aux);
        }
      }
      if (ending === '' && auxiliaries === 0) continue;
      if (weakStem && end - afterStem < 2) continue;
      yield { start: at, end, complete: guess.final.has(ending) || auxiliaries > 0 };
    }
  }
}
