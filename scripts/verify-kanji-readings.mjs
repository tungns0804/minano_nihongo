#!/usr/bin/env node
/**
 * Kiểm tra âm On / Kun và khối "Chữ Hán trong bài" của bài từ vựng N3
 * (src/app/core/kanji/joyo-readings.data.ts, kanji-readings.ts, onkun-study.ts).
 *
 * Màn hình không báo lỗi gì khi một từ không căn được cách đọc — từ đó chỉ lặng lẽ mất
 * nhãn On / Kun và không thành câu hỏi. Nên script soát:
 *
 *  - bảng âm: đúng 2136 chữ thường dụng, mỗi âm là katakana (On) hoặc hiragana có thể
 *    kèm một dấu - tách okurigana (Kun), ngoặc （…） chỉ bọc cả âm; bảng từ đọc đặc biệt
 *    và `EXTRA_READINGS` cùng quy cách;
 *  - mọi từ có chữ Hán của MỌI bài từ vựng N3 căn được cách đọc vào từng chữ — thêm bài
 *    mới có chữ hay âm ngoài bảng thì khai vào `EXTRA_READINGS`;
 *  - mọi chữ của khối "Chữ Hán trong bài" có âm, có ít nhất một từ ví dụ, và cách đọc
 *    chia ba khúc ghép lại đúng bằng cách đọc in ra;
 *  - vài từ mẫu căn ra đúng âm (On / Kun, biến âm, okurigana lược, cụm đọc đặc biệt) —
 *    sửa thuật toán căn mà làm lệch những ca này là dạy sai;
 *  - bảng chữ bài giảng (`kanji-boards.data.ts`): chữ có ở khu Kanji và có âm, không trùng
 *    giữa các bảng, chữ tô vàng nằm trong bảng, từ ví dụ viết tay chứa chữ của nó và căn
 *    được, và mỗi thẻ có ít nhất hai ví dụ, trong đó có từ căn ra âm On / Kun.
 *
 * Chạy: npm run verify:kanji-readings
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { c, log, resolveTsImports } from './script-utils.mjs';
import { parseVocabulary } from './vocab-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const KANJI = join(ROOT, 'src', 'app', 'core', 'kanji');
const SOURCE = join(ROOT, 'data-source');

resolveTsImports();

const { JOYO_READINGS, JOYO_SPECIAL_WORDS } = await import(pathToFileURL(join(KANJI, 'joyo-readings.data.ts')));
const { EXTRA_READINGS, alignReading, readingsOf, isKanji } = await import(
  pathToFileURL(join(KANJI, 'kanji-readings.ts'))
);
const { lessonKanjiOf, boardKanjiOf } = await import(pathToFileURL(join(KANJI, 'onkun-study.ts')));
const { KANJI_BOARDS, BOARD_EXAMPLES } = await import(pathToFileURL(join(KANJI, 'kanji-boards.data.ts')));
// Dựng lại danh sách chữ từ file sinh ra, như verify-kanji-quiz: `kanji-entries.ts` lẫn tên
// kiểu trong import giá trị nên --experimental-strip-types không nạp được.
const { KANJI_SEEDS } = await import(pathToFileURL(join(KANJI, 'kanji-words.generated.ts')));
const { buildKanjiEntries } = await import(pathToFileURL(join(KANJI, 'kanji.model.ts')));
const ENTRY_BY_CHAR = new Map(buildKanjiEntries(KANJI_SEEDS).map((entry) => [entry.char, entry]));

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

// ── Bảng âm ──────────────────────────────────────────────────────────────

const ON = /^[ァ-ヶー]+$/;
const KUN = /^[ぁ-ゖ]+(-[ぁ-ゖ]+)?$/;
const KANA = /^[ぁ-ゖァ-ヶー]+$/;

function checkReadings(where, raw) {
  if (typeof raw !== 'string' || !raw) return fail(where, 'không có âm nào');
  for (const item of raw.split('、')) {
    const bare = item.replace(/^（(.*)）$/, '$1');
    if (!ON.test(bare) && !KUN.test(bare)) fail(where, `âm sai quy cách: "${item}"`);
  }
}

const joyoCount = Object.keys(JOYO_READINGS).length;
if (joyoCount !== 2136) fail('joyo-readings.data.ts', `cần 2136 chữ thường dụng, có ${joyoCount}`);
for (const [char, raw] of Object.entries(JOYO_READINGS)) checkReadings(`JOYO_READINGS ${char}`, raw);
for (const [char, raw] of Object.entries(EXTRA_READINGS)) checkReadings(`EXTRA_READINGS ${char}`, raw);

for (const [word, reading] of JOYO_SPECIAL_WORDS) {
  if (![...word].some(isKanji)) fail(`JOYO_SPECIAL_WORDS ${word}`, 'không có chữ Hán');
  for (const each of reading.split('/')) {
    if (!KANA.test(each)) fail(`JOYO_SPECIAL_WORDS ${word}`, `cách đọc không phải kana: "${each}"`);
  }
}

// ── Từ mẫu ──────────────────────────────────────────────────────────────

/** [từ, cách đọc, chữ, phần đọc của chữ, âm mong đợi ('on' | 'kun' | 'special'), âm theo bảng] */
const SAMPLES = [
  ['冷蔵庫', 'れいぞうこ', '冷', 'れい', 'on', 'れい'],
  ['冷たい', 'つめたい', '冷', 'つめ', 'kun', 'つめ-たい'],
  ['冷やす', 'ひやす', '冷', 'ひ', 'kun', 'ひ-やす'],
  ['誕生', 'たんじょう', '生', 'じょう', 'on', 'しょう'],
  ['出身', 'しゅっしん', '出', 'しゅっ', 'on', 'しゅつ'],
  ['先輩', 'せんぱい', '輩', 'ぱい', 'on', 'はい'],
  ['引っ越し', 'ひっこし', '越', 'こ', 'kun', 'こ-す'],
  ['申し込む', 'もうしこむ', '申', 'もう', 'kun', 'もう-す'],
  ['番組', 'ばんぐみ', '組', 'ぐみ', 'kun', 'くみ'],
  ['倒す', 'たおす', '倒', 'たお', 'kun', 'たお-す'],
  ['汚れ', 'よごれ', '汚', 'よご', 'kun', 'よご-れる'],
  ['子育て', 'こそだて', '育', 'そだ', 'kun', 'そだ-てる'],
  ['真っ白', 'まっしろ', '白', 'しろ', 'kun', 'しろ'],
  ['塩を少々入れる', 'しおをしょうしょういれる', '少', 'しょう', 'on', 'しょう'],
  ['梅雨', 'つゆ', '梅', 'つゆ', 'special', ''],
  ['手伝い', 'てつだい', '伝', 'てつだ', 'special', ''],
  ['3センチ幅に切る', 'さんセンチはばにきる', '幅', 'はば', 'kun', 'はば'],
  ['（お）茶わん', 'ちゃわん', '茶', 'ちゃ', 'on', 'ちゃ'],
];

for (const [word, reading, char, part, sound, base] of SAMPLES) {
  const pieces = alignReading(word, reading);
  const where = `mẫu ${word}`;
  if (!pieces) {
    fail(where, 'không căn được');
    continue;
  }
  const piece = pieces.find((item) => item.text === char || (item.kind === 'special' && item.text.includes(char)));
  if (!piece) {
    fail(where, `không thấy khúc của ${char}`);
    continue;
  }
  const got = piece.kind === 'special' ? 'special' : piece.match?.sound;
  const gotBase = piece.match ? piece.match.stem + (piece.match.okurigana ? `-${piece.match.okurigana}` : '') : '';
  if (piece.reading !== part) fail(where, `${char} đọc "${piece.reading}", cần "${part}"`);
  if (got !== sound) fail(where, `${char} là âm ${got}, cần ${sound}`);
  if (gotBase !== base) fail(where, `${char} khớp âm "${gotBase}" của bảng, cần "${base}"`);
}

// ── Mọi bài từ vựng N3 ─────────────────────────────────────────────────

const n3Lessons = [];
for (const folder of readdirSync(SOURCE).sort()) {
  const dir = join(SOURCE, folder);
  const metaFile = join(dir, 'meta.json');
  if (!existsSync(metaFile)) continue;
  const meta = JSON.parse(readFileSync(metaFile, 'utf8'));
  if (meta.level !== 'N3') continue;
  const files = readdirSync(dir).filter((name) => /^(vocabulary|vocab|tu-?vung)([-_].*)?\.txt$/.test(name));
  if (files.length === 0) continue;
  const words = files.flatMap((name) => parseVocabulary(readFileSync(join(dir, name), 'utf8')).words);
  n3Lessons.push({ folder, words });
}
if (n3Lessons.length === 0) fail('data-source', 'không tìm thấy bài từ vựng N3 nào');

let wordCount = 0;
let kanjiCount = 0;
for (const { folder, words } of n3Lessons) {
  for (const word of words) {
    const chars = [...word.japanese].filter(isKanji);
    if (chars.length === 0) continue;
    wordCount++;
    for (const char of chars) {
      if (!readingsOf(char)) fail(`${folder} ${word.japanese}`, `chữ ${char} không có âm — khai vào EXTRA_READINGS`);
    }
    if (!word.reading) {
      fail(`${folder} ${word.japanese}`, 'từ có chữ Hán mà thiếu cách đọc');
    } else if (!alignReading(word.japanese, word.reading)) {
      fail(`${folder} ${word.japanese}`, `không căn được cách đọc "${word.reading}" vào từng chữ`);
    }
  }

  const entries = [];
  for (const char of new Set(words.flatMap((word) => [...word.japanese]))) {
    const entry = ENTRY_BY_CHAR.get(char);
    if (entry) entries.push(entry);
  }
  for (const item of lessonKanjiOf(words, entries)) {
    kanjiCount++;
    const where = `${folder} ${item.char}`;
    if (item.on.length + item.kun.length === 0) fail(where, 'chữ không có âm nào');
    if (item.examples.length === 0) fail(where, 'không có từ ví dụ nào');
    for (const example of item.examples) {
      if (example.parts && example.parts.join('') !== example.reading) {
        fail(where, `${example.japanese}: ba khúc "${example.parts.join('|')}" lệch cách đọc "${example.reading}"`);
      }
      if ((example.sound === 'on' || example.sound === 'kun') && !example.said) {
        fail(where, `${example.japanese}: căn được mà phần đọc của chữ rỗng`);
      }
    }
  }
}

// ── Bảng chữ bài giảng ─────────────────────────────────────────────────

const boardOf = new Map();
const cells = [];
for (const board of KANJI_BOARDS) {
  const where = `bang ${board.board}`;
  for (const char of board.marked) if (!board.chars.includes(char)) fail(where, `chu to vang ${char} khong co tren bang`);
  for (const char of board.chars) {
    if (boardOf.has(char)) fail(where, `${char} da co o bang ${boardOf.get(char)}`);
    boardOf.set(char, board.board);
    const entry = ENTRY_BY_CHAR.get(char);
    if (!entry) {
      fail(where, `${char} khong co o khu Kanji (khong co trang chu, khong co am Han Viet)`);
      continue;
    }
    if (!readingsOf(char)) fail(where, `${char} khong co am On / Kun`);
    cells.push({ entry, examples: BOARD_EXAMPLES[char] ?? [], marked: board.marked.includes(char) });
  }
}
for (const [char, list] of Object.entries(BOARD_EXAMPLES)) {
  if (!boardOf.has(char)) fail(`BOARD_EXAMPLES ${char}`, 'chu khong co tren bang nao');
  for (const item of list) {
    const [word, reading, meaning, extra] = item.split('|');
    const where = `BOARD_EXAMPLES ${char} ${word}`;
    if (!word || !reading || !meaning || extra !== undefined) fail(where, `can dung "tu|cach doc|nghia": "${item}"`);
    else if (!word.includes(char)) fail(where, `tu khong chua chu ${char}`);
    else if (!alignReading(word, reading)) fail(where, `khong can duoc cach doc "${reading}"`);
  }
}
/**
 * Chữ mà trong khoảng N5–N3 chỉ có đúng một từ thông dụng — từ thứ hai nào cũng là N1
 * (召 chỉ có 召し上がる, 簡 chỉ có 簡単, 因 chỉ có 原因). Thêm từ N1 cho đủ hai là làm ví dụ
 * khó hơn chính chữ cần học.
 */
const ONE_COMMON_WORD = new Set(['召', '簡', '因']);

let boardCards = 0;
for (const card of boardKanjiOf(cells)) {
  boardCards++;
  const where = `bang ${boardOf.get(card.char)} ${card.char}`;
  if (card.examples.length < 2 && !ONE_COMMON_WORD.has(card.char)) fail(where, `chi co ${card.examples.length} tu vi du — them vao BOARD_EXAMPLES`);
  if (!card.examples.some((example) => example.sound === 'on' || example.sound === 'kun')) {
    fail(where, 'khong tu vi du nao can ra am On / Kun');
  }
}

log(`${c.bold}Kiem tra am On / Kun cua bai tu vung N3 va bang chu bai giang${c.reset}`);
if (problems.length > 0) {
  for (const problem of problems) log(`${c.red}[LOI] ${problem}${c.reset}`);
  log(`${c.red}${problems.length} loi.${c.reset}`);
  process.exitCode = 1;
} else {
  log(
    `${c.green}OK: ${joyoCount} chu thuong dung, ${SAMPLES.length} tu mau; ${n3Lessons.length} bai N3 - ` +
      `${wordCount} tu co chu Han deu can duoc, ${kanjiCount} the chu du am va vi du; ` +
      `${KANJI_BOARDS.length} bang bai giang - ${boardCards} the chu.${c.reset}`,
  );
}
