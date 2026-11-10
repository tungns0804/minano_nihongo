/**
 * Âm On / Kun của một chữ Hán, và cách chia cách đọc của một TỪ cho từng chữ trong từ.
 *
 * Dữ liệu âm lấy từ bảng thường dụng (`joyo-readings.data.ts`); file này chỉ đọc bảng đó
 * và căn chữ. Không đụng tới Angular: `npm run verify:kanji-readings` nạp thẳng bằng Node
 * để soát cả kho từ N3.
 *
 * Vì sao phải CĂN chứ không chỉ tra: người học muốn biết trong 冷蔵庫 (れいぞうこ) chữ 冷
 * đọc れい — âm On, còn trong 冷たい chữ đó đọc つめ — âm Kun. Bảng chỉ cho biết 冷 có
 * những âm nào; phải ghép cách đọc cả từ với từng chữ mới biết từ này dùng âm nào.
 * Ghép được nhờ ba biến âm quen thuộc của tiếng Nhật, đều đã có trong `surfacesOf`:
 *  - 連濁 — âm đầu chữ sau đục đi: 誕生 たん + しょう → じょう, 人々 ひと + びと;
 *  - 促音 — âm cuối chữ trước thành っ: 出身 しゅつ → しゅっ, 引越 ひく → ひっ;
 *  - okurigana bị lược khi viết: 申込 もう(す) → もうし, 受付 う(ける) → うけ.
 */

import { toHiragana } from '../utils/kana';
import { JOYO_READINGS, JOYO_SPECIAL_WORDS } from './joyo-readings.data';

export type KanjiSound = 'on' | 'kun';

export interface KanjiReading {
  sound: KanjiSound;
  /** Phần chữ Hán đọc, viết hiragana: れい, つめ. */
  stem: string;
  /** Okurigana của âm Kun (たい trong つめ-たい); rỗng với âm On và âm Kun không có đuôi. */
  okurigana: string;
  /** Âm "đặc biệt hoặc dùng rất hẹp" mà bảng gốc in thụt vào — hiện mờ hơn. */
  rare: boolean;
}

export interface KanjiReadings {
  on: KanjiReading[];
  kun: KanjiReading[];
  /** Chữ thuộc bảng thường dụng; false với chữ khai thêm ở `EXTRA_READINGS`. */
  joyo: boolean;
}

/**
 * Âm khai tay, viết y kiểu bảng gốc, cho hai trường hợp bảng thường dụng không phủ:
 *  - chữ NGOÀI bảng mà bài học có dùng — đây là toàn bộ âm của chữ;
 *  - âm ngoài bảng của chữ TRONG bảng mà sách N3 vẫn dạy (経つ たつ) — nối thêm vào sau
 *    các âm của bảng.
 * Chỉ ghi âm thông dụng (KANJIDIC còn vài âm cổ không ai dùng).
 *
 * Thêm bài mới có chữ hay âm bảng không có thì `verify:kanji-readings` báo từ không căn
 * được — khai vào đây.
 */
export const EXTRA_READINGS: Readonly<Record<string, string>> = {
  // 叩く (たたく) — bài N3 名詞 4.
  叩: 'コウ、たた-く',
  // 我儘 (わがまま) — bài N3 名詞 5. 我が (わが) là âm ngoài bảng của 我.
  儘: 'ジン、まま',
  我: 'わ-が',
  // 経つ (時間が経つ) — bài N3 名詞 4; bảng chỉ có へ-る.
  経: 'た-つ',
};

const cache = new Map<string, KanjiReadings | null>();

/** Các âm của một chữ, hoặc null khi bảng không có chữ đó. */
export function readingsOf(char: string): KanjiReadings | null {
  if (cache.has(char)) return cache.get(char)!;
  const joyo = JOYO_READINGS[char];
  const raw = [joyo, EXTRA_READINGS[char]].filter(Boolean).join('、');
  const result = raw ? { ...parseReadings(raw), joyo: joyo !== undefined } : null;
  cache.set(char, result);
  return result;
}

function parseReadings(raw: string): Omit<KanjiReadings, 'joyo'> {
  const on: KanjiReading[] = [];
  const kun: KanjiReading[] = [];
  for (const item of raw.split('、')) {
    const rare = /^（.*）$/.test(item);
    const text = item.replace(/[（）]/g, '');
    if (!text) continue;
    // Bảng gốc viết âm On bằng katakana; okurigana chỉ có ở âm Kun.
    if (/^[ァ-ヶー]+$/.test(text)) {
      on.push({ sound: 'on', stem: toHiragana(text), okurigana: '', rare });
    } else {
      const [stem, okurigana = ''] = text.split('-');
      kun.push({ sound: 'kun', stem, okurigana, rare });
    }
  }
  return { on, kun };
}

/** "つめ・たい", "れい" — cách viết một âm trên màn hình, okurigana tách bằng ・. */
export function readingLabel(reading: KanjiReading): string {
  return reading.okurigana ? `${reading.stem}・${reading.okurigana}` : reading.stem;
}

// ── Căn cách đọc vào từng chữ ────────────────────────────────────────────

export type PieceKind = 'kanji' | 'kana' | 'special';

/** Một khúc của từ: một chữ Hán, một cụm kana, hoặc cả một cụm đọc đặc biệt (付表). */
export interface ReadingPiece {
  text: string;
  /** Cách đọc của khúc này, cắt từ đúng chuỗi cách đọc đã truyền vào (giữ katakana). */
  reading: string;
  kind: PieceKind;
  /** Âm đã khớp của chữ Hán; null ở kana và cụm đọc đặc biệt. */
  match: KanjiReading | null;
}

/** Âm đục của hàng か さ た は, và âm bán đục của hàng は (先輩 せんぱい, 一杯 いっぱい). */
const VOICED: Readonly<Record<string, string>> = {
  か: 'が', き: 'ぎ', く: 'ぐ', け: 'げ', こ: 'ご',
  さ: 'ざ', し: 'じ', す: 'ず', せ: 'ぜ', そ: 'ぞ',
  た: 'だ', ち: 'ぢじ', つ: 'づず', て: 'で', と: 'ど',
  は: 'ばぱ', ひ: 'びぴ', ふ: 'ぶぷ', へ: 'べぺ', ほ: 'ぼぽ',
};

/** Đuôi động từ → dạng liên dụng (ます形 bỏ ます): 申(す) → 申し, 込(む) → 込み. */
const I_ROW: Readonly<Record<string, string>> = {
  う: 'い', く: 'き', ぐ: 'ぎ', す: 'し', つ: 'ち', ぬ: 'に', ぶ: 'び', む: 'み', る: 'り',
};

/** Âm cuối có thể thành っ khi chữ sau bắt đầu bằng phụ âm vô thanh. */
const GEMINATING = new Set(['つ', 'ち', 'く', 'き', 'る']);

/** Hàng kana của một chữ — để biết し là đuôi す đã chia (汚し ← 汚す). */
const KANA_ROWS = [
  'あいうえお', 'かきくけこ', 'がぎぐげご', 'さしすせそ', 'ざじずぜぞ', 'たちつてと',
  'だぢづでど', 'なにぬねの', 'はひふへほ', 'ばびぶべぼ', 'ぱぴぷぺぽ', 'まみむめも',
  'やゆよ', 'らりるれろ', 'わを',
];

function sameRow(a: string, b: string): boolean {
  return KANA_ROWS.some((row) => row.includes(a) && row.includes(b));
}

/**
 * Âm Kun nào khớp với phần kana viết NGAY SAU chữ. Mấy âm Kun hay chung một gốc —
 * 倒: たお-れる / たお-す, 汚: よご-す / よご-れる — và gốc thì từ nào cũng khớp; chỉ đuôi
 * viết sau chữ mới cho biết từ đang dùng âm nào:
 *  - viết đủ đuôi (倒す ← たお-す) — chắc chắn nhất, đuôi càng dài càng chắc;
 *  - viết đuôi đã chia (汚れ ← よご-れる, 決まり ← き-まる) — khớp được bao nhiêu chữ đầu
 *    của đuôi thì tin bấy nhiêu, cộng thêm khi chữ cuối đúng hàng (す → し) hoặc là
 *    động từ nhóm 2 bỏ る.
 */
function okuriganaScore(okurigana: string, written: string): number {
  if (!okurigana) return 0;
  if (written.startsWith(okurigana)) return 100 + okurigana.length;
  const body = okurigana.slice(0, -1);
  const tail = okurigana.slice(-1);
  if (!written.startsWith(body)) return 0;
  const next = written[body.length];
  const conjugated = (next !== undefined && sameRow(next, tail)) || (tail === 'る' && body !== '');
  // Đuôi một chữ mà kana sau không phải dạng chia của nó thì chẳng chứng minh gì:
  // 真っ白に — に không nói 白 đang đọc しろ-い.
  if (body === '' && !conjugated) return 0;
  return 10 + body.length * 2 + (conjugated ? 1 : 0);
}

interface Surface {
  text: string;
  reading: KanjiReading;
  /** Số lần biến âm để ra dạng này — dạng ít biến âm được thử trước. */
  cost: number;
  score: number;
}

/**
 * Mọi cách một âm có thể hiện ra trong từ. Thứ tự quyết định cách căn khi một từ căn được
 * nhiều kiểu: ít biến âm trước (番組 — ぐみ là くみ đục âm, không phải く-む chia rồi đục),
 * rồi tới âm có okurigana khớp phần kana viết sau chữ (`okuriganaScore`).
 */
function surfacesOf(readings: KanjiReadings, first: boolean, last: boolean, written: string): Surface[] {
  const surfaces: Surface[] = [];

  for (const reading of [...readings.on, ...readings.kun]) {
    const { stem, okurigana } = reading;
    const score = okuriganaScore(okurigana, written);
    const forms: [string, number][] = [[stem, 0]];
    if (okurigana) {
      // Viết lược okurigana: 受付 (うけつけ), 申込 (もうしこみ), 物置 (ものおき).
      const full = stem + okurigana;
      const body = full.slice(0, -1);
      const tail = full.slice(-1);
      forms.push([full, 1], [body, 1]);
      if (I_ROW[tail]) forms.push([body + I_ROW[tail], 1]);
    }

    for (const [form, cost] of forms) {
      const variants: [string, number][] = [[form, cost]];
      if (!last && GEMINATING.has(form.slice(-1)) && form.length > 1) {
        variants.push([form.slice(0, -1) + 'っ', cost + 1]);
      }
      if (!first) {
        for (const [text, base] of [...variants]) {
          for (const voiced of VOICED[text[0]] ?? '') variants.push([voiced + text.slice(1), base + 1]);
        }
      }
      for (const [text, total] of variants) {
        if (text) surfaces.push({ text, reading, cost: total, score });
      }
    }
  }
  // sort ổn định: cùng hạng thì giữ thứ tự của bảng gốc (âm thông dụng đứng trước).
  return surfaces.sort((a, b) => a.cost - b.cost || b.score - a.score);
}

/**
 * Cụm đọc đặc biệt đem ra so, đã bỏ đuôi kana: 付表 ghi 手伝う (てつだう) nhưng bài có
 * 手伝い (てつだい) — so phần 手伝 / てつだ, còn đuôi い khớp như kana thường.
 */
const SPECIAL_WORDS: readonly (readonly [string, string])[] = JOYO_SPECIAL_WORDS.flatMap(
  ([word, readings]) =>
    readings.split('/').map((reading) => {
      const tail = /[ぁ-ゖ]+$/.exec(word)?.[0] ?? '';
      return tail && reading.endsWith(tail)
        ? ([word.slice(0, -tail.length), reading.slice(0, -tail.length)] as const)
        : ([word, reading] as const);
    }),
);

const HAN = /\p{Script=Han}/u;
const KANA = /[ぁ-ゖァ-ヺー]/;

export function isKanji(char: string): boolean {
  return HAN.test(char) && char !== '々' && char !== '〆';
}

/**
 * Chia cách đọc của một từ cho từng chữ. Trả null khi không căn được — chữ ngoài bảng,
 * âm bảng không ghi (熟字訓 ngoài 付表), hay dữ liệu bài sai cách đọc.
 *
 * Phần trong ngoặc — "（お）茶わん" — là phần tuỳ chọn mà cách đọc thường bỏ qua, nên
 * bỏ đi trước khi căn. Dấu ～ là chỗ trống của mẫu, không đọc.
 */
export function alignReading(word: string, reading: string): ReadingPiece[] | null {
  const text = Array.from(stripOptional(word));
  const said = stripOptional(reading);
  const kana = toHiragana(said);
  if (!kana || text.length === 0) return null;

  const pieces = solve(text, kana, said, 0, 0, null);
  return pieces ? mergeKana(pieces) : null;
}

function stripOptional(value: string): string {
  return value.replace(/[（(][^）)]*[）)]/g, '').replace(/[～〜\s]/g, '');
}

function solve(
  text: readonly string[],
  kana: string,
  said: string,
  i: number,
  j: number,
  previous: ReadingPiece | null,
): ReadingPiece[] | null {
  if (i === text.length) return j === kana.length ? [] : null;

  const next = (piece: ReadingPiece, di: number, dj: number) => {
    const rest = solve(text, kana, said, i + di, j + dj, piece);
    return rest ? [piece, ...rest] : null;
  };

  // Cụm đọc đặc biệt thử TRƯỚC: 梅雨 phải là つゆ cả cụm, dù 梅 (うめ/ばい) và 雨 (う/あめ)
  // tự căn thì cũng không ra つゆ — nhưng 今日 (きょう) mà căn từng chữ thì có thể lạc.
  const rest = text.slice(i).join('');
  for (const [special, specialReading] of SPECIAL_WORDS) {
    if (!rest.startsWith(special) || !kana.startsWith(specialReading, j)) continue;
    const length = Array.from(special).length;
    const piece: ReadingPiece = {
      text: special,
      reading: said.slice(j, j + specialReading.length),
      kind: 'special',
      match: null,
    };
    const found = next(piece, length, specialReading.length);
    if (found) return found;
  }

  const char = text[i];

  if (KANA.test(char)) {
    if (toHiragana(char) !== kana[j]) return null;
    return next({ text: char, reading: said[j], kind: 'kana', match: null }, 1, 1);
  }

  // 々 lặp lại chữ ngay trước, thường đục âm đầu: 人々 ひとびと, 少々 しょうしょう.
  const base = char === '々' && previous?.kind === 'kanji' ? previous.text : char;
  if (!isKanji(base)) {
    // Ký tự không phải chữ Hán hay kana: chữ số đọc thành kana (3センチ — さんセンチ),
    // còn ký hiệu (・, chữ Latin) khớp nguyên văn nếu cách đọc có, không thì bỏ qua.
    if (kana[j] === char) return next({ text: char, reading: char, kind: 'kana', match: null }, 1, 1);
    const longest = /[0-9０-９]/.test(char) ? Math.min(4, kana.length - j) : 0;
    for (let length = longest; length >= 0; length--) {
      const piece: ReadingPiece = { text: char, reading: said.slice(j, j + length), kind: 'kana', match: null };
      const found = next(piece, 1, length);
      if (found) return found;
    }
    return null;
  }

  const readings = readingsOf(base);
  if (!readings) return null;

  // Phần kana viết ngay sau chữ — đuôi okurigana nếu có.
  let written = '';
  for (let k = i + 1; k < text.length && KANA.test(text[k]); k++) written += toHiragana(text[k]);

  const tried = new Set<string>();
  for (const surface of surfacesOf(readings, i === 0, i === text.length - 1, written)) {
    const key = `${surface.text}|${surface.reading.sound}`;
    if (tried.has(key) || !kana.startsWith(surface.text, j)) continue;
    tried.add(key);
    const piece: ReadingPiece = {
      text: char,
      reading: said.slice(j, j + surface.text.length),
      kind: 'kanji',
      match: surface.reading,
    };
    const found = next(piece, 1, surface.text.length);
    if (found) return found;
  }
  return null;
}

/** Gộp các ký tự kana liền nhau thành một khúc — dễ đọc khi in và khi tô màu. */
function mergeKana(pieces: ReadingPiece[]): ReadingPiece[] {
  const merged: ReadingPiece[] = [];
  for (const piece of pieces) {
    const last = merged.at(-1);
    if (piece.kind === 'kana' && last?.kind === 'kana') {
      merged[merged.length - 1] = {
        ...last,
        text: last.text + piece.text,
        reading: last.reading + piece.reading,
      };
    } else {
      merged.push(piece);
    }
  }
  return merged;
}
