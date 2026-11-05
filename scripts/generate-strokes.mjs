#!/usr/bin/env node
/**
 * Sinh dữ liệu nét viết cho khu "luyện viết":
 *   - `src/app/core/strokes/stroke-data.generated.ts`     — nét của từng chữ, đã nén
 *   - `src/app/core/strokes/stroke-coverage.generated.ts` — danh sách chữ có dữ liệu
 *   - `src/app/core/strokes/stroke-paths-<nhóm>.generated.ts` — đường nét GỐC (Bézier)
 *     để VẼ cho người học nhìn, chia theo cấp JLPT; `stroke-path-shards.generated.ts`
 *     cho biết chữ nào nằm ở nhóm nào (xem `stroke-path.ts` vì sao cần bản này)
 *
 * Nguồn: KanjiVG (CC BY-SA 3.0), lấy qua gói devDependency `@madcat/kanjivg`.
 * Mỗi chữ là một file SVG, mỗi nét một thẻ `<path>` xếp đúng thứ tự viết.
 *
 * Vì sao lấy qua gói npm chứ không tải từ mạng lúc chạy script: `--check` phải
 * chạy được trong CI mà không cần Internet, đúng như bốn script sinh mã kia. Gói
 * này chỉ nằm ở devDependencies nên không đi vào bản build.
 *
 * ── Hai file, vì sao tách ────────────────────────────────────────────────────
 * `stroke-data.generated.ts` nặng vài trăm kB và CHỈ được nạp bằng `import()` động lúc
 * người học mở phần luyện viết (xem `stroke-store.ts`). Nhưng màn hình danh sách
 * phải biết TRƯỚC chữ nào viết được để đếm số câu, nên danh sách chữ tách ra
 * `stroke-coverage.generated.ts` — vài kB, nạp thẳng cùng màn hình.
 *
 * Chạy: npm run generate:strokes
 *       npm run generate:strokes -- --check   (chỉ kiểm tra, không ghi đè)
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c, emitGenerated, log, quote, resolveTsImports, toFileUrl } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT_DIR = join(ROOT, 'src', 'app', 'core', 'strokes');
const DATA_FILE = join(OUT_DIR, 'stroke-data.generated.ts');
const COVERAGE_FILE = join(OUT_DIR, 'stroke-coverage.generated.ts');
const KANJIVG_DIR = join(ROOT, 'node_modules', '@madcat', 'kanjivg', 'dist', 'main');

const checkOnly = process.argv.includes('--check');

// stroke-path.ts import "./stroke.model" không kèm đuôi file — xem `resolveTsImports`.
resolveTsImports();
const { STROKE_SAMPLES, encodeStrokes, resampleStroke } = await import(
  toFileUrl(join(ROOT, 'src/app/core/strokes/stroke.model.ts'))
);
// Bộ đọc đường SVG nằm trong app chứ không ở đây: màn hình vẽ nét từ đường gốc,
// và phải hiểu đường đó đúng như script này hiểu khi rút ra dữ liệu chấm.
const { KANJIVG_BOX, compactPath, pathToPoints } = await import(
  toFileUrl(join(ROOT, 'src/app/core/strokes/stroke-path.ts'))
);
const { KANJI_BY_LEVEL } = await import(toFileUrl(join(ROOT, 'src/app/core/kanji/kanji-levels.ts')));
const { RADICAL_ROWS } = await import(toFileUrl(join(ROOT, 'src/app/core/radical/radical-list.ts')));

if (!existsSync(KANJIVG_DIR)) {
  log(`${c.red}[LOI] Khong tim thay du lieu KanjiVG: ${KANJIVG_DIR}${c.reset}`);
  log(`${c.red}      Chay "npm install" de cai @madcat/kanjivg.${c.reset}`);
  process.exit(1);
}

// ── Danh sách chữ cần lấy nét ─────────────────────────────────────────────
// Đúng những chữ ứng dụng có bày ra: chữ Hán của năm cấp JLPT, cộng 214 bộ thủ
// và các biến thể của chúng (亻, 氵…) vì khu Bộ thủ hỏi thẳng trên biến thể.

/** Giữ thứ tự gặp lần đầu để file sinh ra ổn định giữa các lần chạy. */
const wanted = [];
const seen = new Set();
const want = (char) => {
  if (char && !seen.has(char)) {
    seen.add(char);
    wanted.push(char);
  }
};

for (const level of Object.keys(KANJI_BY_LEVEL)) {
  for (const char of KANJI_BY_LEVEL[level]) want(char);
}
for (const rows of Object.values(RADICAL_ROWS)) {
  for (const row of rows) {
    for (const form of row.split('|')[0].split('/')) want(form);
  }
}

// ── Đọc nét từ SVG ────────────────────────────────────────────────────────

/** Tên file KanjiVG: mã Unicode viết hệ 16, năm chữ số, chữ thường. */
function svgPathOf(char) {
  const code = char.codePointAt(0).toString(16).padStart(5, '0');
  return join(KANJIVG_DIR, `${code}.svg`);
}

/** Các đường `d` của một chữ, đúng thứ tự viết; null nếu KanjiVG không có chữ đó. */
function pathsOf(char) {
  const file = svgPathOf(char);
  if (!existsSync(file)) return null;

  const svg = readFileSync(file, 'utf8');
  const paths = [...svg.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]);
  return paths.length > 0 ? paths : null;
}

/** Rời rạc hoá một đường, gắn tên chữ vào lỗi để biết file nào hỏng. */
function pointsOf(d, char) {
  try {
    return pathToPoints(d);
  } catch (error) {
    throw new Error(`Chữ ${char}: ${error.message}`);
  }
}

/** Các nét của một chữ, đã chuẩn hoá về 0..1 và lấy mẫu đều theo chiều dài. */
function strokesOf(paths, char) {
  return paths.map((d) =>
    resampleStroke(
      pointsOf(d, char).map((point) => ({ x: point.x / KANJIVG_BOX, y: point.y / KANJIVG_BOX })),
      STROKE_SAMPLES,
    ),
  );
}

// ── Dựng dữ liệu ──────────────────────────────────────────────────────────

const rows = [];
const missing = [];
let strokeCount = 0;

/** chữ -> đường gốc đã viết gọn, để sinh các file vẽ nét bên dưới. */
const compactPaths = new Map();

for (const char of wanted) {
  const paths = pathsOf(char);
  if (!paths) {
    missing.push(char);
    continue;
  }
  const strokes = strokesOf(paths, char);
  strokeCount += strokes.length;
  rows.push(`  ${quote(char)}: ${quote(encodeStrokes(strokes))},`);
  compactPaths.set(char, paths.map(compactPath));
}

const covered = wanted.filter((char) => !missing.includes(char));

const dataText = `/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy \`npm run generate:strokes\` để sinh lại.
 *
 * Nét viết của từng chữ, rút từ KanjiVG (CC BY-SA 3.0, https://kanjivg.tagaini.net).
 * Mỗi chữ là một chuỗi: mỗi nét ${STROKE_SAMPLES} điểm, mỗi điểm hai ký tự (x rồi y).
 * Giải mã bằng \`decodeStrokes\` ở \`stroke.model.ts\`.
 *
 * File nặng nên CHỈ được nạp bằng \`import()\` động — xem \`stroke-store.ts\`.
 *
 * Thống kê lần sinh gần nhất: ${covered.length} chữ, ${strokeCount} nét.
 */

export const STROKE_DATA: Readonly<Record<string, string>> = {
${rows.join('\n')}
};
`;

const coverageText = `/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy \`npm run generate:strokes\` để sinh lại.
 *
 * Danh sách chữ có dữ liệu nét trong \`stroke-data.generated.ts\`, gộp thành MỘT chuỗi.
 *
 * Tách khỏi file dữ liệu vì màn hình danh sách phải biết trước chữ nào viết được
 * để đếm số câu, mà nạp cả file dữ liệu chỉ để đếm thì phí — xem
 * \`scripts/generate-strokes.mjs\`.
 */

export const STROKE_CHARS = ${quote(covered.join(''))};
`;

// ── Đường nét gốc để VẼ, chia theo cấp ─────────────────────────────────────
//
// Cả bảng đường gốc nặng ~1,4 MB (~530 kB nén) — gấp ba bản chấm — vì giữ nguyên
// đường cong. Trang một chữ chỉ cần đúng một chữ, nên chia theo cấp JLPT: mở chữ
// N3 thì chỉ tải nhóm N3 (~86 kB nén). Chữ thuộc cấp nào lấy đúng cấp đầu tiên
// của nó trong `kanji-levels.ts`; bộ thủ và biến thể không thuộc cấp nào vào nhóm
// riêng. Thứ tự nhóm cố định để tên file và nội dung ổn định giữa các lần chạy.

const SHARD_OF_LEVEL = { N5: 'n5', N4: 'n4', N3: 'n3', N2: 'n2', N1: 'n1' };
const SHARDS = ['n5', 'n4', 'n3', 'n2', 'n1', 'radical'];

const shardOf = new Map();
for (const [level, chars] of Object.entries(KANJI_BY_LEVEL)) {
  for (const char of chars) if (!shardOf.has(char)) shardOf.set(char, SHARD_OF_LEVEL[level]);
}

const shardRows = new Map(SHARDS.map((shard) => [shard, []]));
for (const [char, paths] of compactPaths) {
  shardRows.get(shardOf.get(char) ?? 'radical').push([char, paths]);
}

const pathFiles = SHARDS.map((shard) => {
  const list = shardRows.get(shard);
  return {
    file: join(OUT_DIR, `stroke-paths-${shard}.generated.ts`),
    text: `/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy \`npm run generate:strokes\` để sinh lại.
 *
 * Đường nét GỐC của nhóm "${shard}", rút từ KanjiVG (CC BY-SA 3.0,
 * https://kanjivg.tagaini.net): mỗi chữ là các thuộc tính \`d\` (khung 109×109) nối
 * bằng "|", đúng thứ tự viết, làm tròn một chữ số thập phân. Dùng để VẼ nét —
 * xem \`stroke-path.ts\` và \`stroke-path-store.ts\`. Chỉ nạp bằng \`import()\` động.
 *
 * Thống kê lần sinh gần nhất: ${list.length} chữ.
 */

export const STROKE_PATHS: Readonly<Record<string, string>> = {
${list.map(([char, paths]) => `  ${quote(char)}: ${quote(paths.join('|'))},`).join('\n')}
};
`,
  };
});

const shardsText = `/* eslint-disable */
/**
 * FILE NÀY DO MÁY SINH — đừng sửa tay, chạy \`npm run generate:strokes\` để sinh lại.
 *
 * Chữ nào nằm ở nhóm đường nét nào (\`stroke-paths-<nhóm>.generated.ts\`) — để biết
 * phải tải nhóm nào trước khi vẽ một chữ, mà không phải tải thử.
 */

export const STROKE_PATH_SHARDS = {
${SHARDS.map((shard) => `  ${shard}: ${quote(shardRows.get(shard).map(([char]) => char).join(''))},`).join('\n')}
} as const;

export type StrokePathShard = keyof typeof STROKE_PATH_SHARDS;
`;

log(`${c.bold}Du lieu net viet${c.reset}`);
log(`  chu can lay   : ${wanted.length}`);
log(`  co du lieu    : ${covered.length}`);
log(`  tong so net   : ${strokeCount}`);
log(`  kich thuoc    : ${(Buffer.byteLength(dataText, 'utf8') / 1024).toFixed(0)} kB`);
for (const { file, text } of pathFiles) {
  log(`  ${file.split(/[\\/]/).pop().padEnd(34)}: ${(Buffer.byteLength(text, 'utf8') / 1024).toFixed(0)} kB`);
}

if (missing.length > 0) {
  log(
    `${c.yellow}  KanjiVG khong co : ${missing.length} chu (${missing.slice(0, 20).join('')}${missing.length > 20 ? '…' : ''})${c.reset}`,
  );
  log(`${c.yellow}                     Nhung chu nay se khong co nut luyen viet.${c.reset}`);
}

emitGenerated(
  [
    { file: DATA_FILE, text: dataText },
    { file: COVERAGE_FILE, text: coverageText },
    { file: join(OUT_DIR, 'stroke-path-shards.generated.ts'), text: shardsText },
    ...pathFiles,
  ],
  { checkOnly, root: ROOT, rerun: 'npm run generate:strokes' },
);
