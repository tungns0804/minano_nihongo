#!/usr/bin/env node
/**
 * Gộp bản build của Angular thành MỘT file HTML duy nhất, mở được bằng cách
 * double-click (giao thức file://).
 *
 *   npm run build:offline   ->   dist/offline/index.html
 *
 * Vì sao phải gộp: khi mở bằng file://, trình duyệt coi trang là "origin null" và
 * chặn ba thứ mà bản build thường cần:
 *   1. <script type="module"> nạp từ file:// bị CORS chặn  -> gói lại thành IIFE và nhúng thẳng.
 *   2. fetch('lessons/index.json') bị chặn                 -> nhúng dữ liệu vào thẻ <script type="application/json">.
 *   3. History pushState không dùng được                   -> app tự chuyển sang định tuyến bằng # (xem app.config.ts).
 *
 * Lưu ý: trang này CỐ Ý không có thẻ <base>. Nếu đặt <base href="./">, router sẽ
 * phân giải "#/" thành URL của thư mục chứa file chứ không phải chính index.html,
 * và history.replaceState sang một URL khác trong origin "null" bị Chrome chặn
 * (SecurityError). Không có <base> thì "#/" phân giải đúng vào chính trang hiện tại.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  existsSync,
  rmSync,
  statSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const DIST_BROWSER = join(ROOT, 'dist', 'japanese-practice', 'browser');
const LESSONS_DIR = join(ROOT, 'public', 'lessons');
const OUT_DIR = join(ROOT, 'dist', 'offline');
const OUT_FILE = join(OUT_DIR, 'index.html');

const USE_COLOR = process.stdout.isTTY === true && !process.env['NO_COLOR'];
const ESC = String.fromCharCode(27);
const ansi = (code) => (USE_COLOR ? `${ESC}[${code}m` : '');
const c = { reset: ansi(0), bold: ansi(1), dim: ansi(2), red: ansi(31), green: ansi(32) };

const log = (msg = '') => process.stdout.write(`${msg}\n`);

function abort(message) {
  log(`${c.red}[LOI] ${message}${c.reset}`);
  process.exit(1);
}

/** Tìm đúng một file khớp mẫu trong thư mục build. */
function findAsset(pattern, { required = true } = {}) {
  if (!existsSync(DIST_BROWSER)) {
    abort(`Chưa có thư mục build: ${DIST_BROWSER}. Hãy chạy "npm run build" trước.`);
  }
  const matches = readdirSync(DIST_BROWSER).filter((name) => pattern.test(name));
  if (matches.length === 0) {
    if (required) abort(`Không tìm thấy file khớp ${pattern} trong ${DIST_BROWSER}`);
    return null;
  }
  return matches[0];
}

/** Thời điểm sửa gần nhất của mọi file trong một thư mục (đệ quy). */
function newestMtime(dir) {
  let newest = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const time = entry.isDirectory() ? newestMtime(full) : statSync(full).mtimeMs;
    if (time > newest) newest = time;
  }
  return newest;
}

/**
 * Script này chỉ gói lại kết quả của `ng build` chứ không tự build.
 * Chạy thẳng `node scripts/build-offline.mjs` sau khi sửa code sẽ đóng gói bản cũ,
 * nên phải cảnh báo rõ thay vì im lặng cho ra file sai.
 */
function warnIfStale(entryFile) {
  const builtAt = statSync(join(DIST_BROWSER, entryFile)).mtimeMs;
  const sourceDir = join(ROOT, 'src');
  if (!existsSync(sourceDir) || newestMtime(sourceDir) <= builtAt) return;

  log();
  log(`${c.red}[CANH BAO] Thu muc src/ moi hon ban build trong dist/.${c.reset}`);
  log(`${c.red}           File tao ra se KHONG co thay doi vua sua.${c.reset}`);
  log(`${c.red}           Chay "npm run build:offline" de build lai truoc khi dong goi.${c.reset}`);
  log();
}

/** Đọc toàn bộ bài học đã sinh để nhúng thẳng vào trang. */
function readLessons() {
  if (!existsSync(LESSONS_DIR)) {
    abort(`Chưa có dữ liệu bài học: ${LESSONS_DIR}. Hãy chạy "npm run generate" trước.`);
  }

  const indexPath = join(LESSONS_DIR, 'index.json');
  if (!existsSync(indexPath)) abort(`Thiếu ${indexPath}. Hãy chạy "npm run generate".`);

  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  const lessons = [];

  for (const entry of index.lessons ?? []) {
    const file = join(LESSONS_DIR, entry.file);
    if (!existsSync(file)) {
      abort(`index.json trỏ tới ${entry.file} nhưng file này không tồn tại.`);
    }
    lessons.push(JSON.parse(readFileSync(file, 'utf8')));
  }

  if (lessons.length === 0) abort('Không có bài học nào để nhúng.');
  return lessons;
}

/**
 * Chặn chuỗi "</script" bên trong nội dung nhúng, nếu không trình duyệt sẽ hiểu
 * nhầm là kết thúc thẻ script và trang vỡ.
 */
function escapeForScriptTag(text) {
  return text.split('</').join('<\\/');
}

async function main() {
  log(`${c.bold}Gộp bản build thành một file HTML${c.reset}`);
  log();

  const mainFile = findAsset(/^main.*\.js$/);
  const polyfillsFile = findAsset(/^polyfills.*\.js$/, { required: false });
  const stylesFile = findAsset(/^styles.*\.css$/, { required: false });

  log(`  entry      : ${mainFile}`);
  log(`  polyfills  : ${polyfillsFile ?? '(không có)'}`);
  log(`  stylesheet : ${stylesFile ?? '(không có)'}`);

  warnIfStale(mainFile);

  // Một entry ảo nạp polyfills trước rồi mới tới app, để esbuild giữ đúng thứ tự.
  const entryContents = [
    polyfillsFile ? `import './${polyfillsFile}';` : '',
    `import './${mainFile}';`,
  ]
    .filter(Boolean)
    .join('\n');

  // Gói lại thành IIFE: không còn import/export nào, nhúng thẳng vào <script> được.
  // Đây là mấu chốt — <script type="module"> nạp qua file:// luôn bị CORS chặn.
  const bundled = await build({
    stdin: { contents: entryContents, resolveDir: DIST_BROWSER, sourcefile: 'offline-entry.js' },
    bundle: true,
    format: 'iife',
    platform: 'browser',
    target: 'es2022',
    minify: true,
    legalComments: 'none',
    write: false,
    logLevel: 'silent',
  });

  const script = bundled.outputFiles[0].text;
  const styles = stylesFile ? readFileSync(join(DIST_BROWSER, stylesFile), 'utf8') : '';

  const lessons = readLessons();
  // Mỗi loại bài dùng một mảng khác nhau: từ vựng `words`, động từ `verbs`,
  // hội thoại `lines` — cộng cả ba, thiếu một cái là số tổng in ra bị hụt.
  const totalItems = lessons.reduce(
    (sum, lesson) =>
      sum +
      (lesson.words?.length ?? 0) +
      (lesson.verbs?.length ?? 0) +
      (lesson.lines?.length ?? 0),
    0,
  );
  const payload = JSON.stringify({ lessons });

  const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Ôn tập từ vựng 皆の日本語</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Ôn tập từ vựng 皆の日本語: luyện Kanji, âm Hán Việt và nghĩa tiếng Việt. Bản chạy ngoại tuyến, mở trực tiếp không cần cài đặt.">
<meta name="theme-color" content="#4f46e5">
<script>
try {
  var saved = JSON.parse(localStorage.getItem('jp-practice:theme') || '""');
  if (saved === 'light' || saved === 'dark') document.documentElement.setAttribute('data-theme', saved);
  var lang = JSON.parse(localStorage.getItem('jp-practice:language') || '""');
  if (lang === 'vi' || lang === 'ja') document.documentElement.lang = lang;
} catch (e) {}
</script>
<style>${styles}</style>
</head>
<body>
<app-root></app-root>
<script id="jp-embedded-lessons" type="application/json">${escapeForScriptTag(payload)}</script>
<script>${script}</script>
</body>
</html>
`;

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, html, 'utf8');

  const sizeKb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0);

  log();
  log(`${c.green}OK: da tao ${OUT_FILE}${c.reset}`);
  log(
    `${c.dim}   ${sizeKb} kB · ${lessons.length} bai hoc · ${totalItems} muc · ` +
      `khong phu thuoc file nao khac${c.reset}`,
  );
  log();
  log('Mo bang cach double-click file index.html o tren.');
}

main().catch((error) => abort(error?.message ?? String(error)));
