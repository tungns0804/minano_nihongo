#!/usr/bin/env node
/**
 * Sinh `src/app/core/kanji/radical-words.ts` cho khu "Kanji".
 *
 * Ghép hai thứ có sẵn trong kho:
 *  1. `src/app/core/kanji/radical-table.ts` — bảng bộ thủ viết tay (bộ nào gồm chữ nào).
 *  2. Kho từ của ứng dụng:
 *       - `data-source/minano-nihongo-<n> / vocabulary.txt` (N5: bài 1-25, N4: bài 26-50)
 *       - `src/app/core/exercises/exercise-verbs.ts` và `transitive-pairs.ts` (thêm phần N3)
 *
 * Không tự nghĩ ra từ mới: mọi từ ở đây đều đã có sẵn trong ứng dụng, kèm đúng
 * cách đọc, nghĩa và âm Hán Việt của nguồn gốc. Sửa một từ ở `data-source/` rồi
 * chạy lại script là khu Kanji đổi theo.
 *
 * Chạy: npm run generate:kanji
 *       npm run generate:kanji -- --check   (chỉ kiểm tra, không ghi đè)
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT_FILE = join(ROOT, 'src', 'app', 'core', 'kanji', 'radical-words.ts');

/** Cấp độ được đưa vào khu Kanji. Từ N2 của bộ bài tập bị bỏ: ngoài phạm vi N5→N3. */
const LEVELS = ['N5', 'N4', 'N3'];
const LEVEL_RANK = { N5: 0, N4: 1, N3: 2 };

/**
 * Số từ tối đa giữ lại cho MỖI CHỮ trong bộ.
 *
 * Không lấy hết: chữ 日 một mình đã có hơn ba chục từ, để nguyên thì bảng của bộ
 * 日 dài tới mức không tra được, mà mấy từ sau cũng chỉ lặp lại đúng một chữ ấy.
 */
const WORDS_PER_KANJI = 4;

const KANJI = /[一-鿿]/;
const KANJI_ALL = /[一-鿿]/g;

/** Dấu câu — có mặt là mục đó là cả một câu chứ không phải một từ. */
const SENTENCE = /[？！。、?!]/;

const checkOnly = process.argv.includes('--check');
const log = (msg = '') => process.stdout.write(`${msg}\n`);

// ── Nạp bảng bộ thủ ───────────────────────────────────────────────────────
const toFileUrl = (path) => new URL(`file:///${path.split(String.fromCharCode(92)).join('/')}`).href;
const { RADICAL_TABLE } = await import(toFileUrl(join(ROOT, 'src/app/core/kanji/radical-table.ts')));

// ── Kho từ ────────────────────────────────────────────────────────────────

/** Từ vựng giáo trình: `ÂM HÁN VIỆT,TIẾNG NHẬT (CÁCH ĐỌC),NGHĨA|ví dụ`. */
function readVocabulary() {
  const words = [];
  for (const dir of readdirSync(join(ROOT, 'data-source'))) {
    const match = /^minano-nihongo-(\d+)$/.exec(dir);
    if (!match) continue;

    const lesson = Number(match[1]);
    // Mốc chia N5/N4 lấy đúng theo `JLPT_RANGE` của ứng dụng: hết bài 25 là hết N5.
    const level = lesson <= 25 ? 'N5' : 'N4';
    const file = join(ROOT, 'data-source', dir, 'vocabulary.txt');
    if (!existsSync(file)) continue;

    for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;

      const first = line.indexOf(',');
      const second = line.indexOf(',', first + 1);
      if (first < 0 || second < 0) continue;

      const hanViet = line.slice(0, first).trim();
      const meaning = line.slice(second + 1).split('|')[0].trim();
      let japanese = line.slice(first + 1, second).trim();
      let reading = '';

      const paren = /^(.*?)[（(]([^)）]*)[)）]\s*$/.exec(japanese);
      if (paren) {
        japanese = paren[1].trim();
        reading = paren[2].trim();
      }

      // Không có kanji thì không minh hoạ được bộ thủ nào; không có cách đọc thì
      // chiều "từ → hiragana" không có đáp án.
      if (!KANJI.test(japanese) || !reading || !meaning) continue;
      // Câu chào nguyên câu ("お帰りなさい。", "国へ帰るの？") vẫn là mục từ vựng hợp
      // lệ của bài học, nhưng ở đây thì không: khu Kanji hỏi nghĩa và cách đọc của
      // MỘT TỪ. Chỉ lọc theo dấu câu, không lọc theo trợ từ — cụm cố định kiểu
      // 電車に乗ります hay 歯を磨きます chính là thứ giáo trình dạy nguyên khối.
      if (SENTENCE.test(japanese)) continue;
      words.push({ japanese, reading, hanViet, meaning, level, order: lesson });
    }
  }
  return words;
}

/** Động từ của khu Bài tập — nguồn duy nhất có phần N3. Nguồn này không có cột âm Hán Việt. */
async function readExerciseVerbs() {
  const { EXERCISE_VERBS } = await import(
    toFileUrl(join(ROOT, 'src/app/core/exercises/exercise-verbs.ts'))
  );
  const { TRANSITIVITY_PAIRS } = await import(
    toFileUrl(join(ROOT, 'src/app/core/exercises/transitive-pairs.ts'))
  );

  const words = [];
  const push = (masu, reading, meaning, level) => {
    if (!KANJI.test(masu) || !LEVELS.includes(level)) return;
    // order 99: xếp sau từ của giáo trình khi hai bên cùng cấp, vì từ trong sách
    // là thứ người học gặp trước.
    words.push({ japanese: masu, reading, hanViet: '', meaning, level, order: 99 });
  };

  for (const verb of EXERCISE_VERBS) push(verb.masu, verb.reading, verb.meaning, verb.level);
  for (const pair of TRANSITIVITY_PAIRS) {
    push(pair.intransitive.masu, pair.intransitive.reading, pair.intransitive.meaning, pair.level);
    push(pair.transitive.masu, pair.transitive.reading, pair.transitive.meaning, pair.level);
  }
  return words;
}

// ── Ghép bộ thủ với từ ────────────────────────────────────────────────────

const vocabulary = readVocabulary();
const exercise = await readExerciseVerbs();

/** Gộp hai kho, một từ chỉ giữ một lần và giữ ở cấp THẤP nhất mà nó xuất hiện. */
const pool = new Map();
for (const word of [...vocabulary, ...exercise]) {
  const key = `${word.japanese}|${word.reading}`;
  const prev = pool.get(key);
  if (!prev || LEVEL_RANK[word.level] < LEVEL_RANK[prev.level]) pool.set(key, word);
}
const allWords = [...pool.values()];

/** Chữ nào thuộc bộ nào. Một chữ chỉ được thuộc đúng một bộ (bảng đã kiểm tra bên dưới). */
const radicalOfKanji = new Map();
for (const [glyph, , , , , kanji] of RADICAL_TABLE) {
  for (const char of kanji) {
    const owner = radicalOfKanji.get(char);
    if (owner) {
      log(`[LOI] chữ ${char} bị khai ở cả bộ ${owner} lẫn bộ ${glyph}`);
      process.exitCode = 1;
    }
    radicalOfKanji.set(char, glyph);
  }
}

/**
 * Một từ chỉ minh hoạ cho MỘT chữ trong mỗi bộ — chữ đầu tiên của bộ đó gặp trong
 * từ. Nếu không, 明日 (cả 明 lẫn 日 đều thuộc bộ 日) sẽ nằm hai lần trong cùng một
 * bộ và bị hỏi hai lần trong một phiên luyện.
 */
const wordsByRadical = new Map();
for (const word of allWords) {
  const seen = new Set();
  for (const char of word.japanese.match(KANJI_ALL) ?? []) {
    const glyph = radicalOfKanji.get(char);
    if (!glyph || seen.has(glyph)) continue;
    seen.add(glyph);

    const bucket = wordsByRadical.get(glyph) ?? new Map();
    const byKanji = bucket.get(char) ?? [];
    byKanji.push(word);
    bucket.set(char, byKanji);
    wordsByRadical.set(glyph, bucket);
  }
}

/**
 * Thứ tự từ trong một chữ: cấp thấp trước, rồi từ ngắn trước, rồi theo số bài.
 * Cắt bớt thì phần giữ lại là những từ cơ bản nhất của chữ đó.
 */
function sortWords(a, b) {
  return (
    LEVEL_RANK[a.level] - LEVEL_RANK[b.level] ||
    a.japanese.length - b.japanese.length ||
    a.order - b.order ||
    a.japanese.localeCompare(b.japanese)
  );
}

const seeds = [];
let wordCount = 0;
const skipped = [];

for (const [glyph, variants, hanViet, meaning, strokes, kanji] of RADICAL_TABLE) {
  const bucket = wordsByRadical.get(glyph);
  if (!bucket) {
    skipped.push(glyph);
    continue;
  }

  const rows = [];
  // Duyệt theo thứ tự chữ đã khai trong bảng, không theo thứ tự gặp từ: bảng viết
  // tay xếp chữ theo mức thông dụng, giữ đúng thứ tự đó thì bộ nào cũng mở đầu
  // bằng chữ quen nhất.
  for (const char of kanji) {
    const words = bucket.get(char);
    if (!words) continue;
    for (const word of [...words].sort(sortWords).slice(0, WORDS_PER_KANJI)) {
      rows.push([char, word.japanese, word.reading, word.hanViet, word.meaning, word.level]);
    }
  }

  if (rows.length === 0) {
    skipped.push(glyph);
    continue;
  }
  wordCount += rows.length;
  seeds.push([glyph, variants, hanViet, meaning, strokes, rows]);
}

// ── Ghi file ──────────────────────────────────────────────────────────────

const quote = (text) => `'${text.split("'").join("\\'")}'`;

const body = seeds
  .map(([glyph, variants, hanViet, meaning, strokes, rows]) => {
    const head = `  [${quote(glyph)}, ${quote(variants)}, ${quote(hanViet)}, ${quote(meaning)}, ${strokes}, [`;
    const lines = rows.map((row) => `    [${row.map(quote).join(', ')}],`);
    return [head, ...lines, '  ]],'].join('\n');
  })
  .join('\n');

const levelCount = LEVELS.map(
  (level) => `${level}=${seeds.reduce((sum, s) => sum + s[5].filter((r) => r[5] === level).length, 0)}`,
).join(' ');

const output = `/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy \`npm run generate:kanji\` để sinh lại.
 *
 * Nguồn: \`radical-table.ts\` (bảng bộ thủ viết tay) ghép với kho từ có sẵn của ứng
 * dụng — \`data-source/minano-nihongo-*\` và \`core/exercises/\`. Mỗi chữ giữ tối đa
 * ${WORDS_PER_KANJI} từ, xếp cấp thấp trước rồi từ ngắn trước.
 *
 * Thống kê lần sinh gần nhất: ${seeds.length} bộ thủ, ${wordCount} từ (${levelCount}).
 */

import type { RadicalSeed } from './kanji.model';

export const RADICAL_SEEDS: readonly RadicalSeed[] = [
${body}
];
`;

const previous = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : '';

log(`Bo thu   : ${seeds.length} (bo qua ${skipped.length} bo khong co tu: ${skipped.join(' ')})`);
log(`Tu       : ${wordCount} (${levelCount})`);
log(`Kho tu   : ${allWords.length} tu, ${radicalOfKanji.size} chu da gan bo`);

const unassigned = new Set();
for (const word of allWords) {
  for (const char of word.japanese.match(KANJI_ALL) ?? []) {
    if (!radicalOfKanji.has(char)) unassigned.add(char);
  }
}
if (unassigned.size > 0) {
  log(`Chua gan : ${unassigned.size} chu (${[...unassigned].join('')})`);
}

if (checkOnly) {
  if (previous !== output) {
    log('[LOI] radical-words.ts khong khop voi nguon. Chay: npm run generate:kanji');
    process.exitCode = 1;
  } else {
    log('OK: radical-words.ts dang khop voi nguon.');
  }
} else if (previous === output) {
  log('Khong co gi thay doi.');
} else {
  writeFileSync(OUT_FILE, output, 'utf8');
  log(`Da ghi ${OUT_FILE.replace(ROOT, '.')}`);
}
