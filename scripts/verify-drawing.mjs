#!/usr/bin/env node
/**
 * Kiểm tra dữ liệu nét viết và cách chấm của khu "luyện viết".
 *
 * Bốn thứ script này canh:
 *
 *  1. Dữ liệu giải mã được: độ dài chuỗi phải chia hết cho một nét, và danh sách
 *     chữ ở `stroke-coverage.ts` phải khớp đúng khoá của `stroke-data.ts`.
 *  2. Chữ tự khớp chính nó — nếu không thì cách mã hoá đang làm hỏng dữ liệu.
 *  3. Chữ vẫn khớp khi thêm nhiễu cỡ bàn tay run: vẽ bằng chuột không bao giờ
 *     trúng từng điểm, ngưỡng chấm mà quá chặt thì viết đúng vẫn bị báo sai.
 *  4. Viết ngược đầu một nét phải bị nhận ra là 'reversed' chứ không lọt thành đúng.
 *
 * Ngoài ra in ra số cặp chữ dễ lẫn (khác chữ mà vẫn chấm là đúng) để biết ngưỡng
 * `STROKE_TOLERANCE` đang nới tới đâu — con số này là cảnh báo, không phải lỗi:
 * vài cặp như 未/末 khác nhau đúng một nét dài ngắn thì chuột vẽ cũng khó tách.
 *
 * Chạy: npm run verify:drawing
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c, log, resolveTsImports, toFileUrl } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const STROKES = join(ROOT, 'src/app/core/strokes');

// stroke-score.ts import "./stroke.model" không kèm đuôi file — xem `resolveTsImports`.
resolveTsImports();

/** Biên độ nhiễu thêm vào nét mẫu, tính theo cạnh khung vẽ (~9px trên khung 300px). */
const JITTER = 0.03;
/** Số chữ khác đem ra so cho mỗi chữ khi đếm cặp dễ lẫn. */
const RIVALS_PER_CHAR = 20;

const { STROKE_CODE_LENGTH, decodeStrokes } = await import(
  toFileUrl(join(STROKES, 'stroke.model.ts'))
);
const { STROKE_TOLERANCE, checkDrawing } = await import(toFileUrl(join(STROKES, 'stroke-score.ts')));
const { STROKE_DATA } = await import(toFileUrl(join(STROKES, 'stroke-data.ts')));
const { STROKE_CHARS } = await import(toFileUrl(join(STROKES, 'stroke-coverage.ts')));

let problems = 0;
function fail(message) {
  log(`${c.red}[LOI] ${message}${c.reset}`);
  problems++;
}

// ── 1. Dữ liệu giải mã được ───────────────────────────────────────────────

const chars = Object.keys(STROKE_DATA);
const decoded = new Map();

for (const char of chars) {
  const code = STROKE_DATA[char];
  if (code.length === 0 || code.length % STROKE_CODE_LENGTH !== 0) {
    fail(`Chữ ${char}: chuỗi dài ${code.length}, không chia hết cho một nét (${STROKE_CODE_LENGTH})`);
    continue;
  }
  decoded.set(char, decodeStrokes(code));
}

const listed = [...STROKE_CHARS];
if (listed.length !== chars.length || listed.some((char, i) => char !== chars[i])) {
  fail(
    `stroke-coverage.ts (${listed.length} chữ) không khớp stroke-data.ts (${chars.length} chữ). ` +
      'Chạy: npm run generate:strokes',
  );
}

// ── 2 & 3 & 4. Cách chấm ──────────────────────────────────────────────────

/** Số ngẫu nhiên lặp lại được, để lần chạy nào cũng cho đúng kết quả ấy. */
let seed = 20260906;
function random() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}

const shaky = (strokes) =>
  strokes.map((stroke) =>
    stroke.map((point) => ({
      x: point.x + (random() - 0.5) * 2 * JITTER,
      y: point.y + (random() - 0.5) * 2 * JITTER,
    })),
  );

let selfFailed = 0;
let jitterFailed = 0;
let reversedMissed = 0;
let orderMissed = 0;
let missingMissed = 0;
let extraMissed = 0;
let multiStroke = 0;

const hasIssue = (verdict, issue) => verdict.problems.some((problem) => problem.issue === issue);

for (const [char, strokes] of decoded) {
  if (!checkDrawing(strokes, strokes).correct) {
    if (selfFailed === 0) fail(`Chữ ${char} không khớp chính nó`);
    selfFailed++;
  }

  if (!checkDrawing(shaky(strokes), strokes).correct) {
    if (jitterFailed === 0) {
      fail(`Chữ ${char} bị chấm sai khi thêm nhiễu ${JITTER} — ngưỡng chấm quá chặt`);
    }
    jitterFailed++;
  }

  const backwards = strokes.map((stroke, i) => (i === 0 ? [...stroke].reverse() : stroke));
  if (checkDrawing(backwards, strokes).correct) reversedMissed++;

  // Ba lỗi còn lại chỉ dựng được trên chữ từ ba nét trở lên: đổi chỗ hai nét của
  // chữ hai nét thì nhiều khi ra đúng một chữ khác hợp lệ.
  if (strokes.length < 3) continue;
  multiStroke++;

  // Đổi chỗ nét 1 và nét 2: hình vẫn đúng, chỉ sai thứ tự viết.
  const swapped = [strokes[1], strokes[0], ...strokes.slice(2)];
  if (!hasIssue(checkDrawing(swapped, strokes), 'order')) orderMissed++;

  if (!hasIssue(checkDrawing(strokes.slice(0, -1), strokes), 'missing')) missingMissed++;
  if (!hasIssue(checkDrawing([...strokes, strokes[0]], strokes), 'extra')) extraMissed++;
}

if (missingMissed > 0) fail(`${missingMissed} chữ thiếu nét mà không bị báo 'missing'`);
if (extraMissed > 0) fail(`${extraMissed} chữ thừa nét mà không bị báo 'extra'`);

// Đổi chỗ hai nét GIỐNG HỆT nhau (hai nét chấm của 冫) thì không có gì sai để báo,
// nên không đòi bắt được hết. Chỉ báo lỗi khi phần nhận diện sai thứ tự gần như
// không chạy.
if (orderMissed / multiStroke > 0.35) {
  fail(`${orderMissed}/${multiStroke} chữ đổi chỗ nét mà không bị báo 'order'`);
}

if (selfFailed > 1) fail(`Tổng cộng ${selfFailed} chữ không khớp chính nó`);
if (jitterFailed > 1) fail(`Tổng cộng ${jitterFailed} chữ bị chấm sai khi thêm nhiễu`);

// Nét chấm quá ngắn thì `sameDirection` cố tình không xét chiều, nên chúng vẫn lọt
// — khoảng một phần mười số chữ. Chỉ báo lỗi khi con số vượt xa mức đó, tức là phần
// so chiều nét đã hỏng.
const reversedRatio = reversedMissed / decoded.size;
if (reversedRatio > 0.15) {
  fail(
    `${reversedMissed}/${decoded.size} chữ vẽ ngược nét đầu vẫn được chấm đúng — ` +
      'phần so chiều nét đang không có tác dụng',
  );
}

// ── Cặp chữ dễ lẫn ────────────────────────────────────────────────────────

const byStrokeCount = new Map();
for (const [char, strokes] of decoded) {
  const list = byStrokeCount.get(strokes.length) ?? [];
  list.push(char);
  byStrokeCount.set(strokes.length, list);
}

let confusable = 0;
const examples = [];

for (const [char, strokes] of decoded) {
  const rivals = byStrokeCount.get(strokes.length) ?? [];
  for (let i = 0; i < RIVALS_PER_CHAR && i < rivals.length; i++) {
    const other = rivals[Math.floor(random() * rivals.length)];
    if (other === char) continue;
    if (checkDrawing(decoded.get(other), strokes).correct) {
      confusable++;
      if (examples.length < 8) examples.push(`${other}≈${char}`);
    }
  }
}

// ── Tổng kết ──────────────────────────────────────────────────────────────

log(`${c.bold}Kiem tra du lieu net viet${c.reset}`);
log(`  so chu            : ${decoded.size}`);
log(`  nguong cham       : ${STROKE_TOLERANCE}`);
log(`  ve nguoc van dung : ${reversedMissed} chu (net cham, khong xet chieu)`);
log(`  doi cho net khong bao sai thu tu: ${orderMissed}/${multiStroke} chu`);
log(`  cap de lan        : ${confusable}${examples.length > 0 ? ` (${examples.join(' ')})` : ''}`);
log();

if (problems === 0) {
  log(`${c.green}OK: du lieu net giai ma duoc va cach cham chay dung.${c.reset}`);
} else {
  log(`${c.red}${problems} van de can sua.${c.reset}`);
  process.exitCode = 1;
}
