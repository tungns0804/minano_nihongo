#!/usr/bin/env node
/**
 * Sinh `src/app/core/radical/radical-kanji.ts` cho khu "Bộ thủ".
 *
 * Ghép hai nguồn viết tay của khu này với dữ liệu SẴN CÓ của khu Kanji:
 *   - `radical-list.ts`  — 214 bộ thủ (chữ, biến thể, âm Hán Việt, nghĩa, tên Nhật)
 *   - `radical-parts.ts` — chiết tự từng chữ Hán thành các bộ thủ
 *   - `kanji-words.ts`   — âm Hán Việt, cấp độ và từ ví dụ của từng chữ (do
 *                          `npm run generate:kanji` sinh ra từ kho từ)
 *
 * Không chép tay lại bất cứ âm Hán Việt hay nghĩa nào của CHỮ: tất cả lấy từ khu
 * Kanji, nên hai khu không bao giờ nói khác nhau về cùng một chữ.
 *
 * ── Khai triển thành phần ──────────────────────────────────────────────────
 * Thành phần nào lại có dòng chiết tự của riêng nó thì khai triển tiếp: `時:日+寺`
 * cộng `寺:土+寸` cho ra 時 = 日 + 土 + 寸. Nhờ vậy bộ 寸 gom được cả 時, 持, 待 chứ
 * không chỉ những chữ viết thẳng 寸 ở tầng ngoài cùng. Khai triển tối đa
 * `MAX_DEPTH` tầng để một dòng viết sai (chữ tự chứa chính nó) không thành vòng lặp.
 *
 * Chạy: npm run generate:radicals
 *       npm run generate:radicals -- --check   (chỉ kiểm tra, không ghi đè)
 */

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT_FILE = join(ROOT, 'src', 'app', 'core', 'radical', 'radical-kanji.ts');

/** Số tầng khai triển tối đa của một thành phần. */
const MAX_DEPTH = 4;
/**
 * Số từ ví dụ giữ lại cho mỗi chữ.
 *
 * Đúng MỘT từ: bảng và phần phản hồi sau khi chấm đều chỉ hiện từ đầu tiên, mà mỗi
 * chữ ở đây được chép lại một lần cho MỖI bộ nó chứa (chữ 語 có mặt ở bốn bộ), nên
 * từ thứ hai chỉ làm phình file dữ liệu chứ không ai đọc tới.
 */
const WORDS_PER_KANJI = 1;

const checkOnly = process.argv.includes('--check');
const log = (msg = '') => process.stdout.write(`${msg}\n`);
const toFileUrl = (path) => new URL(`file:///${path.split(String.fromCharCode(92)).join('/')}`).href;

const { RADICAL_ROWS } = await import(toFileUrl(join(ROOT, 'src/app/core/radical/radical-list.ts')));
const { KANJI_PARTS, PART_HAN_VIET } = await import(
  toFileUrl(join(ROOT, 'src/app/core/radical/radical-parts.ts'))
);
const { KANJI_SEEDS } = await import(toFileUrl(join(ROOT, 'src/app/core/kanji/kanji-words.ts')));
const { KANJI_BY_LEVEL } = await import(toFileUrl(join(ROOT, 'src/app/core/kanji/kanji-levels.ts')));

// ── Bảng bộ thủ ───────────────────────────────────────────────────────────

const radicals = [];
/** Biến thể (và chính chữ) -> chữ chính của bộ. */
const radicalOf = new Map();

/**
 * 阝 là MỘT hình nhưng HAI bộ: đứng bên trái là 阜 (こざとへん, gò đất), đứng bên
 * phải là 邑 (おおざと, làng xóm). Bảng chiết tự viết phẳng nên không tự phân biệt
 * được — chỗ này lấy đúng luật ấy: 阝 mở đầu dòng chiết tự thì thuộc 阜, nằm sau
 * thì thuộc 邑. `radicalOf` do đó chỉ dùng cho các hình còn lại.
 */
const AMBIGUOUS = '阝';

for (const [strokes, rows] of Object.entries(RADICAL_ROWS)) {
  for (const row of rows) {
    const [chars, hanViet, meaning, japanese] = row.split('|');
    const [char, ...variants] = chars.split('/');
    radicals.push({ char, variants, hanViet, meaning, japanese, strokes: Number(strokes) });
    for (const form of [char, ...variants]) {
      if (form === AMBIGUOUS) continue;
      if (radicalOf.has(form)) log(`[CANH BAO] "${form}" thuoc ca bo ${radicalOf.get(form)} lan ${char}`);
      radicalOf.set(form, char);
    }
  }
}

/** Bộ của một thành phần, có tính tới vị trí của nó trong chữ (chỉ 阝 cần tới). */
function radicalOfPart(part, index) {
  if (part === AMBIGUOUS) return index === 0 ? '阜' : '邑';
  return radicalOf.get(part);
}

// ── Dữ liệu chữ Hán mượn từ khu Kanji ─────────────────────────────────────

/** chữ -> { hanViet, level, words } */
const kanjiInfo = new Map();
for (const [char, hanViet, , level, words] of KANJI_SEEDS) {
  kanjiInfo.set(char, {
    hanViet,
    level,
    words: words.slice(0, WORDS_PER_KANJI).map(([japanese, reading, , meaning]) => ({
      japanese,
      reading,
      meaning,
    })),
  });
}

/** Thứ tự chữ trong lưới = đúng thứ tự dạy của `kanji-levels.ts`. */
const kanjiOrder = new Map();
for (const level of ['N5', 'N4', 'N3']) {
  for (const char of KANJI_BY_LEVEL[level]) if (!kanjiOrder.has(char)) kanjiOrder.set(char, kanjiOrder.size);
}

// ── Chiết tự ──────────────────────────────────────────────────────────────

/** chữ -> thành phần tầng ngoài cùng. */
const partsOf = new Map();
for (const row of KANJI_PARTS) {
  const [char, parts] = row.split(':');
  partsOf.set(char, parts.split('+').filter(Boolean));
}

/**
 * Mọi bộ thủ CÓ MẶT trong một chữ, kể cả bộ nằm sâu bên trong một thành phần.
 *
 * Đi hết cây chiết tự chứ không chỉ tầng ngoài cùng: 時 viết là 日+寺, mà 寺 lại là
 * 土+寸, nên 時 phải gom được về cả bộ 寸. Ngược lại vẫn GIỮ luôn thành phần ở
 * giữa: 岩 viết là 山+石, khai triển tiếp thì 石 tan thành 厂+口 và bộ 石 mất sạch
 * chữ của nó — mà 岩 chứa bộ 石 là điều đầu tiên người học cần thấy.
 */
function radicalsIn(char, depth = 0) {
  const parts = partsOf.get(char);
  const found = new Set();
  if (!parts || depth >= MAX_DEPTH) return found;

  parts.forEach((part, index) => {
    const radical = radicalOfPart(part, index);
    if (radical) found.add(radical);
    // Chữ độc thể (`日:日`) dừng ở đây, nếu không thì nó tự lặp lại mãi mãi.
    if (part === char) return;
    for (const deeper of radicalsIn(part, depth + 1)) found.add(deeper);
  });
  return found;
}

/**
 * Bộ `radical` nằm trong thành phần nào của chữ, khi nó không lộ ra ở tầng ngoài.
 *
 * Trả về chuỗi kiểu "寺=土+寸" để bảng ở màn hình một bộ chỉ đúng chỗ: người học
 * nhìn 時 = 日+寺 sẽ không tự hiểu vì sao chữ này lại nằm trong bộ 寸.
 */
function viaPart(char, radical) {
  const parts = partsOf.get(char) ?? [];
  if (parts.some((part, index) => radicalOfPart(part, index) === radical)) return '';

  for (const part of parts) {
    if (part === char) continue;
    if (radicalsIn(part).has(radical)) return `${part}=${(partsOf.get(part) ?? []).join('+')}`;
  }
  return '';
}

/** Âm Hán Việt của một thành phần: tra bảng bộ thủ, rồi khu Kanji, rồi bảng bù. */
const hanVietOfRadical = new Map(radicals.map((r) => [r.char, r.hanViet]));
function partHanViet(part, index) {
  const radical = radicalOfPart(part, index);
  if (radical) return hanVietOfRadical.get(radical) ?? '';
  return kanjiInfo.get(part)?.hanViet || PART_HAN_VIET[part] || '';
}

// ── Gom chữ về từng bộ ────────────────────────────────────────────────────

const inLevels = new Set(kanjiOrder.keys());
const missing = [...inLevels].filter((char) => !partsOf.has(char));
const extra = [...partsOf.keys()].filter((char) => !inLevels.has(char));

/** chữ chính của bộ -> các chữ Hán có chứa bộ đó. */
const kanjiOfRadical = new Map(radicals.map((r) => [r.char, []]));
/** Thành phần không tra được âm Hán Việt — chỉ để cảnh báo. */
const unknownParts = new Map();
let pairCount = 0;

for (const char of inLevels) {
  const info = kanjiInfo.get(char);
  if (!info) continue;

  const parts = partsOf.get(char) ?? [char];
  // Chữ độc thể không "ghép từ bộ nào" nên không vào bảng của bộ nào cả — phần
  // đầu trang của bộ đã lo việc đó (chữ 日 chính là bộ 日).
  if (parts.length === 1 && parts[0] === char) continue;

  // Chiết tự hiển thị là ĐÚNG tầng ngoài cùng đã viết tay: 時 = 日 + 寺, chứ không
  // phải 日 + 土 + 寸. Tầng ngoài mới là cách người ta thật sự nhớ mặt chữ.
  const readings = parts.map((part, index) => partHanViet(part, index));
  readings.forEach((reading, index) => {
    if (!reading) unknownParts.set(parts[index], (unknownParts.get(parts[index]) ?? 0) + 1);
  });

  const partsText = parts.join('+');
  // Chỉ ghi âm Hán Việt của chiết tự khi tra đủ MỌI thành phần: thiếu một mảnh
  // thì chuỗi đáp án hụt một chỗ, mà chiều luyện lại chấm đúng theo chuỗi đó.
  const partsHanViet = readings.every(Boolean) ? readings.join(' ') : '';

  for (const radical of radicalsIn(char)) {
    const row = [char, info.hanViet, partsText, partsHanViet, viaPart(char, radical), info.level, info.words];
    kanjiOfRadical.get(radical).push(row);
    pairCount++;
  }
}

for (const list of kanjiOfRadical.values()) {
  list.sort((a, b) => kanjiOrder.get(a[0]) - kanjiOrder.get(b[0]));
}

// ── Ghi file ──────────────────────────────────────────────────────────────

const quote = (text) => `'${text.split("'").join("\'")}'`;

const body = radicals
  .map((radical) => {
    const rows = kanjiOfRadical.get(radical.char);
    const head =
      `  [${quote(radical.char)}, ${quote(radical.variants.join('/'))}, ${quote(radical.hanViet)}, ` +
      `${quote(radical.meaning)}, ${quote(radical.japanese)}, ${radical.strokes}, [`;
    const lines = rows.map(([char, hanViet, parts, partsHanViet, via, level, words]) => {
      const wordText = words.map((w) => `[${[w.japanese, w.reading, w.meaning].map(quote).join(', ')}]`);
      return (
        `    [${quote(char)}, ${quote(hanViet)}, ${quote(parts)}, ${quote(partsHanViet)}, ` +
        `${quote(via)}, ${quote(level)}, [${wordText.join(', ')}]],`
      );
    });
    return [head, ...lines, '  ]],'].join('\n');
  })
  .join('\n');

const withKanji = radicals.filter((r) => kanjiOfRadical.get(r.char).length > 0).length;

const output = `/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy \`npm run generate:radicals\` để sinh lại.
 *
 * Nguồn: \`radical-list.ts\` (214 bộ thủ) + \`radical-parts.ts\` (chiết tự) + dữ liệu
 * chữ Hán của khu Kanji (\`kanji-words.ts\`). Xem \`scripts/generate-radicals.mjs\`.
 *
 * Thống kê lần sinh gần nhất: ${radicals.length} bộ thủ (${withKanji} bộ có chữ ghép), ${pairCount} lượt chữ.
 */

import type { RadicalSeed } from './radical.model';

export const RADICAL_SEEDS: readonly RadicalSeed[] = [
${body}
];
`;

const previous = existsSync(OUT_FILE) ? readFileSync(OUT_FILE, 'utf8') : '';

log(`Bo thu   : ${radicals.length} (${withKanji} bo co chu ghep)`);
log(`Chu Han  : ${inLevels.size} chu trong danh sach JLPT, ${pairCount} luot chu`);

if (missing.length > 0) {
  log(`[LOI] ${missing.length} chu chua co dong chiet tu: ${missing.join('')}`);
  log('      Them vao src/app/core/radical/radical-parts.ts');
  process.exitCode = 1;
}
if (extra.length > 0) {
  log(`[CANH BAO] ${extra.length} dong chiet tu cho chu ngoai danh sach JLPT: ${extra.join('')}`);
}
// Âm bù cho thành phần không còn chỗ nào dùng thì thừa — dọn đi cho khỏi lệch nhau,
// đúng như khu Kanji dọn `HAN_VIET_SUPPLEMENT`.
const usedParts = new Set([...partsOf.values()].flat());
const orphanSupplement = Object.keys(PART_HAN_VIET).filter((part) => !usedParts.has(part));
if (orphanSupplement.length > 0) {
  log(`[CANH BAO] ${orphanSupplement.length} am bu khong ai dung: ${orphanSupplement.join('')}`);
  log('           Xoa khoi PART_HAN_VIET trong radical-parts.ts');
}
const redundantSupplement = Object.keys(PART_HAN_VIET).filter(
  (part) => radicalOf.has(part) || kanjiInfo.has(part),
);
if (redundantSupplement.length > 0) {
  log(`[CANH BAO] am bu thua (da tra duoc o cho khac): ${redundantSupplement.join('')}`);
}

if (unknownParts.size > 0) {
  const list = [...unknownParts].sort((a, b) => b[1] - a[1]);
  log(`[CANH BAO] ${list.length} thanh phan chua co am Han Viet: ${list.map(([p, n]) => `${p}(${n})`).join(' ')}`);
  log('           Them vao PART_HAN_VIET trong radical-parts.ts');
}

if (checkOnly) {
  if (previous !== output) {
    log('[LOI] radical-kanji.ts khong khop voi nguon. Chay: npm run generate:radicals');
    process.exitCode = 1;
  } else {
    log('OK: radical-kanji.ts dang khop voi nguon.');
  }
} else if (previous === output) {
  log('Khong co gi thay doi.');
} else {
  writeFileSync(OUT_FILE, output, 'utf8');
  log(`Da ghi ${OUT_FILE.replace(ROOT, '.')}`);
}
