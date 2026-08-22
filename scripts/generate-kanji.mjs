#!/usr/bin/env node
/**
 * Sinh `src/app/core/kanji/kanji-words.ts` cho khu "Kanji".
 *
 * Rút DANH SÁCH CHỮ HÁN + âm Hán Việt của từng chữ + các từ dùng chữ đó, tất cả
 * từ kho từ có sẵn của ứng dụng:
 *   - `data-source/minano-nihongo-<n> / vocabulary.txt` (N5: bài 1-25, N4: bài 26-50)
 *   - `src/app/core/exercises/exercise-verbs.ts` và `transitive-pairs.ts` (thêm phần N3)
 *
 * ── Âm Hán Việt của TỪNG CHỮ suy ra thế nào ────────────────────────────────
 * Nguồn từ vựng ghi âm Hán Việt cho CẢ TỪ ("会社員 → HỘI XÃ VIÊN"). Mà âm Hán
 * Việt của một từ chính là các âm của từng chữ ghép lại, nên khi số âm tiết
 * khớp đúng số chữ Hán thì gán được 1:1: 会=HỘI, 社=XÃ, 員=VIÊN.
 *
 * Một chữ được nhiều từ "bỏ phiếu"; âm nào nhiều phiếu nhất thì thắng, các âm
 * còn lại vẫn được giữ làm đáp án chấp nhận khi luyện (行 HÀNH và HÀNG đều đúng).
 * Từ nào lệch số âm tiết thì bỏ qua chứ không đoán — gán lệch một chữ là sai
 * lây sang mọi từ khác có chữ đó.
 *
 * Nhờ cách này KHÔNG có âm Hán Việt nào bị chép tay: tất cả đến từ đúng nguồn
 * người dùng chỉ định. Ngoại lệ duy nhất là `kanji-supplement.ts` — vài chữ chỉ
 * xuất hiện trong bộ động từ khu Bài tập, mà nguồn đó không có cột Hán Việt.
 *
 * Chạy: npm run generate:kanji
 *       npm run generate:kanji -- --check   (chỉ kiểm tra, không ghi đè)
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT_FILE = join(ROOT, 'src', 'app', 'core', 'kanji', 'kanji-words.ts');

/** Cấp độ trong phạm vi khu Kanji — nay đủ N5 → N1. */
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const LEVEL_RANK = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 };

const KANJI = /[一-鿿]/;
const KANJI_ALL = /[一-鿿]/g;

/** Dấu câu — có mặt là mục đó là cả một câu chứ không phải một từ. */
const SENTENCE = /[？！。、?!]/;

const checkOnly = process.argv.includes('--check');
const log = (msg = '') => process.stdout.write(`${msg}\n`);

const toFileUrl = (path) => new URL(`file:///${path.split(String.fromCharCode(92)).join('/')}`).href;
const { HAN_VIET_SUPPLEMENT, HAN_VIET_FIX } = await import(
  toFileUrl(join(ROOT, 'src/app/core/kanji/kanji-supplement.ts'))
);
const { KANJI_BY_LEVEL, ADVANCED_HAN_VIET } = await import(
  toFileUrl(join(ROOT, 'src/app/core/kanji/kanji-levels.ts'))
);

/** Chữ nào thuộc cấp nào — danh sách JLPT là nguồn DUY NHẤT quyết định việc này. */
const levelOfKanji = new Map();
/** Chữ bị khai ở hai cấp — cấp sau lặng lẽ đè cấp trước nếu không bắt ở đây. */
const duplicateLevels = [];
for (const level of LEVELS) {
  for (const char of KANJI_BY_LEVEL[level]) {
    if (levelOfKanji.has(char)) duplicateLevels.push(`${char}(${levelOfKanji.get(char)}+${level})`);
    levelOfKanji.set(char, level);
  }
}

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

      if (!KANJI.test(japanese)) continue;
      // Mục là cả một câu chào ("お帰りなさい。", "国へ帰るの？") vẫn là từ vựng hợp
      // lệ của bài học, nhưng ở đây thì không: khu Kanji hỏi nghĩa và cách đọc của
      // MỘT TỪ. Chỉ lọc theo dấu câu, không lọc theo trợ từ — cụm cố định kiểu
      // 電車に乗ります hay 歯を磨きます chính là thứ giáo trình dạy nguyên khối.
      if (SENTENCE.test(japanese)) continue;

      // `usable` = dùng được làm câu hỏi. Mục thiếu cách đọc thì chiều "từ →
      // hiragana" không có đáp án, nhưng âm Hán Việt của nó vẫn dùng để suy âm
      // của từng chữ được — bỏ luôn cả dòng là mất âm DỤC của chữ 浴.
      const usable = Boolean(reading && meaning);
      words.push({ japanese, reading, hanViet, meaning, level, order: lesson, usable });
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
    words.push({ japanese: masu, reading, hanViet: '', meaning, level, order: 99, usable: true });
  };

  for (const verb of EXERCISE_VERBS) push(verb.masu, verb.reading, verb.meaning, verb.level);
  for (const pair of TRANSITIVITY_PAIRS) {
    push(pair.intransitive.masu, pair.intransitive.reading, pair.intransitive.meaning, pair.level);
    push(pair.transitive.masu, pair.transitive.reading, pair.transitive.meaning, pair.level);
  }
  return words;
}

const vocabulary = readVocabulary();
const exercise = await readExerciseVerbs();

/**
 * Gộp hai kho: một từ chỉ giữ một lần, ở cấp THẤP nhất mà nó xuất hiện.
 *
 * Âm Hán Việt thì gộp riêng chứ không đi theo bản thắng cấp độ: rất nhiều động từ
 * có mặt ở CẢ hai kho (死にます ở bài 39 lẫn trong bộ động từ bài tập), mà bản của
 * khu Bài tập không có cột âm Hán Việt. Để bản đó đè lên là mất âm của cả chữ 死.
 */
const pool = new Map();
for (const word of [...vocabulary, ...exercise]) {
  const key = `${word.japanese}|${word.reading}`;
  const prev = pool.get(key);
  if (!prev) {
    pool.set(key, { ...word });
    continue;
  }
  if (LEVEL_RANK[word.level] < LEVEL_RANK[prev.level]) {
    pool.set(key, { ...word, hanViet: word.hanViet || prev.hanViet, usable: word.usable || prev.usable });
  } else {
    if (!prev.hanViet && word.hanViet) prev.hanViet = word.hanViet;
    if (!prev.usable && word.usable) Object.assign(prev, word, { hanViet: prev.hanViet || word.hanViet });
  }
}
const allWords = [...pool.values()];

// ── Suy âm Hán Việt của từng chữ ──────────────────────────────────────────

/** char -> Map(âm -> số phiếu) */
const votes = new Map();
let alignedWords = 0;
let unalignedWords = 0;

for (const word of allWords) {
  if (!word.hanViet) continue;
  const chars = word.japanese.match(KANJI_ALL) ?? [];
  const syllables = word.hanViet.split(/\s+/).filter(Boolean);

  // Chỉ gán khi số âm tiết khớp đúng số chữ. Lệch thì bỏ qua: đoán bừa một chữ
  // là sai lây sang mọi từ khác có chữ đó.
  if (chars.length === 0 || chars.length !== syllables.length) {
    if (chars.length > 0) unalignedWords++;
    continue;
  }

  alignedWords++;
  chars.forEach((char, index) => {
    const tally = votes.get(char) ?? new Map();
    // Một ô có thể chứa hai âm ngăn bằng '/' ("TỬ/TÝ", "GIÁNG/HÀNG"). Tách ở ĐÂY
    // chứ không ở bước căn chỉnh: căn theo dấu cách, nếu tách sớm thì 降ります
    // thành 2 âm tiết cho 1 chữ và trượt mất luôn.
    for (const part of syllables[index].toUpperCase().split('/')) {
      const syllable = part.trim();
      if (syllable) tally.set(syllable, (tally.get(syllable) ?? 0) + 1);
    }
    votes.set(char, tally);
  });
}

/**
 * Âm chính là âm nhiều phiếu nhất; các âm còn lại thành `altHanViet` để gõ âm nào
 * cũng được tính đúng. Bằng phiếu thì lấy âm nào đến trước theo bảng chữ cái, để
 * hai lần chạy script luôn ra cùng một kết quả.
 */
function readingsOf(char) {
  // Bản sửa tay thắng tất cả: đó là những chỗ nguồn tự mâu thuẫn và phiếu đa số
  // rơi vào đúng cái sai — xem `kanji-supplement.ts`.
  const fixed = HAN_VIET_FIX[char];
  if (fixed) {
    const [main, ...alts] = fixed.split('/').map((part) => part.trim()).filter(Boolean);
    return { main, alts };
  }
  const tally = votes.get(char);
  if (!tally) {
    // `ADVANCED_HAN_VIET` là âm khai kèm ở dòng N2/N1 của `kanji-levels.ts`. Đứng
    // sau phiếu bầu của kho từ: chữ nào kho từ nói được thì vẫn ưu tiên nguồn.
    const extra = HAN_VIET_SUPPLEMENT[char] || ADVANCED_HAN_VIET[char];
    return extra ? { main: extra, alts: [] } : { main: '', alts: [] };
  }
  const sorted = [...tally].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return { main: sorted[0][0], alts: sorted.slice(1).map(([reading]) => reading) };
}

// ── Ghép chữ với từ ───────────────────────────────────────────────────────

/** char -> các từ dùng chữ đó. Chỉ gom cho chữ nằm trong danh sách JLPT. */
const wordsOfKanji = new Map();
/** Chữ có trong kho từ nhưng nằm ngoài phạm vi N5→N3. */
const outOfScope = new Set();

for (const word of allWords) {
  // Chỉ từ dùng được mới vào danh sách của chữ; mục thiếu cách đọc đã làm xong
  // việc của nó ở bước bỏ phiếu âm Hán Việt bên trên.
  if (!word.usable) continue;
  for (const char of new Set(word.japanese.match(KANJI_ALL) ?? [])) {
    if (!levelOfKanji.has(char)) {
      outOfScope.add(char);
      continue;
    }
    const bucket = wordsOfKanji.get(char) ?? [];
    bucket.push(word);
    wordsOfKanji.set(char, bucket);
  }
}

/** Thứ tự từ trong một chữ: cấp thấp trước, rồi từ ngắn trước, rồi theo số bài. */
function sortWords(a, b) {
  return (
    LEVEL_RANK[a.level] - LEVEL_RANK[b.level] ||
    a.japanese.length - b.japanese.length ||
    a.order - b.order ||
    a.japanese.localeCompare(b.japanese)
  );
}

/**
 * Thứ tự chữ trong lưới = ĐÚNG thứ tự của danh sách JLPT, không sắp lại.
 *
 * Danh sách trong ảnh xếp theo lối chiết tự (一 二 八 六 日 目 三…): chữ ít nét và
 * chữ làm thành phần của chữ khác đi trước. Sắp lại theo tần suất hay theo bảng
 * chữ là phá mất chính cái thứ tự dạy đó.
 */
const seeds = [];
let wordSlots = 0;
const noHanViet = [];
const noWords = [];

for (const level of LEVELS) {
  for (const char of KANJI_BY_LEVEL[level]) {
    const { main, alts } = readingsOf(char);
    if (!main) noHanViet.push(char);

    const words = wordsOfKanji.get(char) ?? [];
    if (words.length === 0) noWords.push(char);

    const rows = [...words]
      .sort(sortWords)
      .map((word) => [word.japanese, word.reading, word.hanViet, word.meaning, word.level]);

    wordSlots += rows.length;
    seeds.push([char, main, alts.join('/'), level, rows]);
  }
}

// ── Ghi file ──────────────────────────────────────────────────────────────

const quote = (text) => `'${text.split("'").join("\\'")}'`;

const body = seeds
  .map(([char, hanViet, alts, level, rows]) => {
    const head = `  [${quote(char)}, ${quote(hanViet)}, ${quote(alts)}, ${quote(level)}, [`;
    const lines = rows.map((row) => `    [${row.map(quote).join(', ')}],`);
    return [head, ...lines, '  ]],'].join('\n');
  })
  .join('\n');

const levelCount = LEVELS.map(
  (level) => `${level}=${seeds.filter((seed) => seed[3] === level).length}`,
).join(' ');

const output = `/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy \`npm run generate:kanji\` để sinh lại.
 *
 * Nguồn: kho từ có sẵn của ứng dụng (\`data-source/minano-nihongo-*\` và
 * \`core/exercises/\`). Âm Hán Việt của từng chữ suy ra bằng cách căn âm tiết của
 * âm Hán Việt cả từ với các chữ Hán trong từ — xem \`scripts/generate-kanji.mjs\`.
 *
 * Thống kê lần sinh gần nhất: ${seeds.length} chữ (${levelCount}), ${wordSlots} lượt từ.
 */

import type { KanjiSeed } from './kanji.model';

export const KANJI_SEEDS: readonly KanjiSeed[] = [
${body}
];
`;

const previous = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : '';

log(`Tu       : ${allWords.length} (can chinh duoc am tiet: ${alignedWords}, lech: ${unalignedWords})`);
log(`Chu Han  : ${seeds.length} (${levelCount}), ${wordSlots} luot tu`);
log(`Ngoai danh sach: ${outOfScope.size} chu trong kho tu khong thuoc cap nao`);
// `--list-outside` in ra đủ danh sách đó để chép sang `kanji-levels.ts` — cách
// nhanh nhất để biết còn chữ nào của kho từ chưa được xếp cấp.
if (process.argv.includes('--list-outside')) log([...outOfScope].join(''));

/**
 * Cảnh báo danh sách JLPT có thể bị thiếu.
 *
 * Chữ xuất hiện trong từ vựng bài 1-25 (phần N5 của giáo trình) mà lại không nằm
 * trong ba danh sách thì đáng ngờ: giáo trình có dùng vài chữ khó thật, nhưng
 * 病 院 週 切 所 mà rơi ra ngoài thì gần như chắc chắn là danh sách chép thiếu
 * chứ không phải chữ đó ngoài phạm vi N5→N3.
 */
const earlyOutside = [...outOfScope]
  .map((char) => [char, allWords.filter((w) => w.order <= 25 && w.japanese.includes(char)).length])
  .filter(([, count]) => count > 0)
  .sort((a, b) => b[1] - a[1]);
if (earlyOutside.length > 0) {
  log(
    `[CHU Y] ${earlyOutside.length} chu co trong tu vung bai 1-25 nhung ngoai danh sach JLPT.`,
  );
  log(`        Thong dung nhat: ${earlyOutside.slice(0, 24).map(([c]) => c).join('')}`);
  log('        Neu co chu co ban trong so nay thi kanji-levels.ts dang chep thieu hang.');
}

if (duplicateLevels.length > 0) {
  log(`[LOI] ${duplicateLevels.length} chu khai o hai cap: ${duplicateLevels.join(' ')}`);
  process.exitCode = 1;
}

if (noWords.length > 0) {
  // Cắt ngắn: từ khi có N2/N1 thì phần lớn chữ chưa có từ, in đủ ra chỉ tổ lấp
  // mất những dòng cảnh báo thật sự cần đọc ở trên.
  const sample = noWords.slice(0, 40).join('');
  const more = noWords.length > 40 ? ` … (+${noWords.length - 40} chu)` : '';
  log(`[CHU Y] ${noWords.length} chu chua co tu nao trong kho: ${sample}${more}`);
}
log(`Am tu kho: ${votes.size} chu | bo sung tay: ${Object.keys(HAN_VIET_SUPPLEMENT).length} chu | sua tay: ${Object.keys(HAN_VIET_FIX).length} chu`);

if (noHanViet.length > 0) {
  log(`[CANH BAO] ${noHanViet.length} chu chua co am Han Viet: ${noHanViet.join('')}`);
  log('           Them vao src/app/core/kanji/kanji-supplement.ts');
}

// Âm bổ sung mà kho từ đã tự suy ra được thì thừa — dọn đi cho khỏi lệch nhau.
const redundant = Object.keys(HAN_VIET_SUPPLEMENT).filter((char) => votes.has(char));
if (redundant.length > 0) {
  log(`[CANH BAO] bo sung thua (kho tu da co): ${redundant.join('')}`);
}

// Bổ sung cho chữ không nằm trong danh sách JLPT thì không ai đọc tới.
const orphanSupplement = Object.keys(HAN_VIET_SUPPLEMENT).filter((char) => !levelOfKanji.has(char));
if (orphanSupplement.length > 0) {
  log(`[CANH BAO] bo sung cho chu ngoai danh sach JLPT: ${orphanSupplement.join('')}`);
}

// Bản sửa tay chỉ nên tồn tại khi nguồn thật sự đang nói khác. Nguồn sửa xong thì
// dòng ở `kanji-supplement.ts` phải được xoá đi, không để lệch hai nơi.
const uselessFix = Object.entries(HAN_VIET_FIX).filter(([char, value]) => {
  const tally = votes.get(char);
  if (!tally) return false;
  const sorted = [...tally].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return sorted[0][0] === value.split('/')[0].trim() && tally.size === value.split('/').length;
});
if (uselessFix.length > 0) {
  log(`[CANH BAO] sua tay thua (kho tu da dung): ${uselessFix.map(([c]) => c).join('')}`);
}

if (checkOnly) {
  if (previous !== output) {
    log('[LOI] kanji-words.ts khong khop voi nguon. Chay: npm run generate:kanji');
    process.exitCode = 1;
  } else {
    log('OK: kanji-words.ts dang khop voi nguon.');
  }
} else if (previous === output) {
  log('Khong co gi thay doi.');
} else {
  writeFileSync(OUT_FILE, output, 'utf8');
  log(`Da ghi ${OUT_FILE.replace(ROOT, '.')}`);
}
