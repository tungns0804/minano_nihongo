#!/usr/bin/env node
/**
 * Sinh dữ liệu nét viết cho khu "luyện viết":
 *   - `src/app/core/strokes/stroke-data.ts`     — nét của từng chữ, đã nén
 *   - `src/app/core/strokes/stroke-coverage.ts` — danh sách chữ có dữ liệu
 *
 * Nguồn: KanjiVG (CC BY-SA 3.0), lấy qua gói devDependency `@madcat/kanjivg`.
 * Mỗi chữ là một file SVG, mỗi nét một thẻ `<path>` xếp đúng thứ tự viết.
 *
 * Vì sao lấy qua gói npm chứ không tải từ mạng lúc chạy script: `--check` phải
 * chạy được trong CI mà không cần Internet, đúng như bốn script sinh mã kia. Gói
 * này chỉ nằm ở devDependencies nên không đi vào bản build.
 *
 * ── Hai file, vì sao tách ────────────────────────────────────────────────────
 * `stroke-data.ts` nặng vài trăm kB và CHỈ được nạp bằng `import()` động lúc
 * người học mở phần luyện viết (xem `stroke-store.ts`). Nhưng màn hình danh sách
 * phải biết TRƯỚC chữ nào viết được để đếm số câu, nên danh sách chữ tách ra
 * `stroke-coverage.ts` — vài kB, nạp thẳng cùng màn hình.
 *
 * Chạy: npm run generate:strokes
 *       npm run generate:strokes -- --check   (chỉ kiểm tra, không ghi đè)
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c, emitGenerated, log, quote, toFileUrl } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT_DIR = join(ROOT, 'src', 'app', 'core', 'strokes');
const DATA_FILE = join(OUT_DIR, 'stroke-data.ts');
const COVERAGE_FILE = join(OUT_DIR, 'stroke-coverage.ts');
const KANJIVG_DIR = join(ROOT, 'node_modules', '@madcat', 'kanjivg', 'dist', 'main');

/** Khung của KanjiVG: mọi file đều là viewBox "0 0 109 109". */
const VIEW_BOX = 109;
/** Số điểm rời rạc hoá mỗi đoạn Bézier trước khi lấy mẫu lại theo chiều dài. */
const CURVE_STEPS = 12;

const checkOnly = process.argv.includes('--check');

const { STROKE_SAMPLES, encodeStrokes, resampleStroke } = await import(
  toFileUrl(join(ROOT, 'src/app/core/strokes/stroke.model.ts'))
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

/**
 * Rời rạc hoá một đường trong thuộc tính `d` thành chuỗi điểm.
 *
 * KanjiVG chỉ dùng bốn lệnh: `M`/`m` dời bút và `C`/`c`/`S`/`s` vẽ Bézier bậc ba.
 * Gặp lệnh khác thì DỪNG HẲN chứ không bỏ qua: bỏ qua một lệnh vẽ là nét sinh ra
 * thiếu mất một khúc, mà dữ liệu sai kiểu đó không có gì báo — nó chỉ làm người
 * học bị chấm sai về sau.
 *
 * Chuẩn SVG cho phép bỏ chữ cái khi lặp lại cùng một lệnh (`c … … …`), nên bộ
 * đọc này giữ lại lệnh trước. Riêng sau `M`/`m` thì xoá đi: lặp lại `M` theo
 * chuẩn là `L`, mà `L` chưa xử lý ở đây nên phải để nó báo lỗi thay vì dời bút
 * nhầm thành một nét mới.
 */
function pathToPoints(d, char) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const points = [];
  let index = 0;
  let command = '';
  let x = 0;
  let y = 0;
  // Điểm điều khiển thứ hai của đoạn Bézier trước — `S`/`s` soi gương qua nó.
  let lastControlX = 0;
  let lastControlY = 0;
  let previousWasCurve = false;

  const number = () => Number(tokens[index++]);

  const curveTo = (c1x, c1y, c2x, c2y, endX, endY) => {
    for (let step = 1; step <= CURVE_STEPS; step++) {
      const t = step / CURVE_STEPS;
      const u = 1 - t;
      points.push({
        x: u * u * u * x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * endX,
        y: u * u * u * y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * endY,
      });
    }
    lastControlX = c2x;
    lastControlY = c2y;
    x = endX;
    y = endY;
    previousWasCurve = true;
  };

  while (index < tokens.length) {
    if (/^[A-Za-z]$/.test(tokens[index])) command = tokens[index++];

    switch (command) {
      case 'M':
      case 'm': {
        const dx = number();
        const dy = number();
        x = command === 'M' ? dx : x + dx;
        y = command === 'M' ? dy : y + dy;
        points.push({ x, y });
        previousWasCurve = false;
        command = '';
        break;
      }
      case 'C':
      case 'c': {
        const base = command === 'C' ? { x: 0, y: 0 } : { x, y };
        curveTo(
          base.x + number(),
          base.y + number(),
          base.x + number(),
          base.y + number(),
          base.x + number(),
          base.y + number(),
        );
        break;
      }
      case 'S':
      case 's': {
        const base = command === 'S' ? { x: 0, y: 0 } : { x, y };
        const c1x = previousWasCurve ? 2 * x - lastControlX : x;
        const c1y = previousWasCurve ? 2 * y - lastControlY : y;
        curveTo(
          c1x,
          c1y,
          base.x + number(),
          base.y + number(),
          base.x + number(),
          base.y + number(),
        );
        break;
      }
      default:
        throw new Error(`Chữ ${char}: lệnh SVG chưa xử lý "${command}" trong d="${d}"`);
    }
  }

  return points;
}

/** Các nét của một chữ, đã chuẩn hoá về 0..1 và lấy mẫu đều theo chiều dài. */
function strokesOf(char) {
  const file = svgPathOf(char);
  if (!existsSync(file)) return null;

  const svg = readFileSync(file, 'utf8');
  const paths = [...svg.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]);
  if (paths.length === 0) return null;

  return paths.map((d) =>
    resampleStroke(
      pathToPoints(d, char).map((point) => ({ x: point.x / VIEW_BOX, y: point.y / VIEW_BOX })),
      STROKE_SAMPLES,
    ),
  );
}

// ── Dựng dữ liệu ──────────────────────────────────────────────────────────

const rows = [];
const missing = [];
let strokeCount = 0;

for (const char of wanted) {
  const strokes = strokesOf(char);
  if (!strokes) {
    missing.push(char);
    continue;
  }
  strokeCount += strokes.length;
  rows.push(`  ${quote(char)}: ${quote(encodeStrokes(strokes))},`);
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
 * Danh sách chữ có dữ liệu nét trong \`stroke-data.ts\`, gộp thành MỘT chuỗi.
 *
 * Tách khỏi file dữ liệu vì màn hình danh sách phải biết trước chữ nào viết được
 * để đếm số câu, mà nạp cả file dữ liệu chỉ để đếm thì phí — xem
 * \`scripts/generate-strokes.mjs\`.
 */

export const STROKE_CHARS = ${quote(covered.join(''))};
`;

log(`${c.bold}Du lieu net viet${c.reset}`);
log(`  chu can lay   : ${wanted.length}`);
log(`  co du lieu    : ${covered.length}`);
log(`  tong so net   : ${strokeCount}`);
log(`  kich thuoc    : ${(Buffer.byteLength(dataText, 'utf8') / 1024).toFixed(0)} kB`);

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
  ],
  { checkOnly, root: ROOT, rerun: 'npm run generate:strokes' },
);
