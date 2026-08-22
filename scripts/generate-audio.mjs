#!/usr/bin/env node
/**
 * Sinh file phát âm tiếng Nhật cho toàn bộ từ vựng bằng edge-tts.
 *
 *   public/lessons/*.json (kind = vocabulary)  ->  public/audio/vocab/<băm>.mp3
 *                                              ->  public/audio/vocab/index.json
 *
 * Cách dùng:
 *   npm run generate:audio             Sinh những file còn thiếu
 *   npm run generate:audio -- --clean  Sinh file thiếu, đồng thời xoá file mồ côi
 *   npm run generate:audio -- --force  Sinh lại tất cả, kể cả file đã có
 *   npm run verify:audio               Chỉ kiểm tra, không ghi gì (dùng cho CI)
 *
 * Tên file KHÔNG do script này tự nghĩ ra: nó gọi đúng `audioFileOfWord` trong
 * `src/app/core/audio/vocab-audio.ts` — chính hàm mà ứng dụng dùng lúc chạy để tìm
 * file cần phát. Script chạy thẳng trên file .ts đó (nhờ --experimental-strip-types)
 * nên không có bản chép lại nào để lệch nhau, và cũng không thể có chuyện script ghi
 * file theo một quy tắc còn app lại đi tìm theo quy tắc khác.
 *
 * Cần cài sẵn edge-tts của Python:  pip install edge-tts
 */

import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const LESSONS_DIR = join(ROOT, 'public', 'lessons');
const AUDIO_DIR = join(ROOT, 'public', 'audio', 'vocab');
const MANIFEST_FILE = join(AUDIO_DIR, 'index.json');
const PYTHON_SCRIPT = join(HERE, 'edge-tts-batch.py');

const { audioFileOfWord, speechTextOf, VOCAB_AUDIO_VOICE } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'audio', 'vocab-audio.ts')).href
);

const args = new Set(process.argv.slice(2));
const CHECK_ONLY = args.has('--check');
const CLEAN = args.has('--clean');
const FORCE = args.has('--force');

const USE_COLOR = process.stdout.isTTY === true && !process.env['NO_COLOR'];
const ESC = String.fromCharCode(27);
const ansi = (code) => (USE_COLOR ? `${ESC}[${code}m` : '');
const c = {
  reset: ansi(0),
  bold: ansi(1),
  dim: ansi(2),
  red: ansi(31),
  green: ansi(32),
  yellow: ansi(33),
};

const log = (msg = '') => process.stdout.write(`${msg}\n`);

function abort(message) {
  log(`${c.red}[LOI] ${message}${c.reset}`);
  process.exit(1);
}

/** Mọi từ vựng của mọi bài, gom theo đúng tên file phát âm mà app sẽ đi tìm. */
function collectWords() {
  const indexFile = join(LESSONS_DIR, 'index.json');
  if (!existsSync(indexFile)) {
    abort(`Chưa có ${indexFile}. Hãy chạy "npm run generate" trước.`);
  }
  const index = JSON.parse(readFileSync(indexFile, 'utf8'));

  /** @type {Map<string, { text: string, file: string, words: string[] }>} */
  const wanted = new Map();
  let wordCount = 0;
  let silentCount = 0;

  for (const entry of index.lessons) {
    if (entry.kind !== 'vocabulary') continue;
    const lesson = JSON.parse(readFileSync(join(LESSONS_DIR, entry.file), 'utf8'));

    for (const word of lesson.words) {
      wordCount += 1;
      const file = audioFileOfWord(word);
      if (file === null) {
        silentCount += 1;
        log(`${c.yellow}[BO QUA] ${entry.id}: từ không có gì để đọc: ${word.japanese}${c.reset}`);
        continue;
      }

      const text = speechTextOf(word);
      const found = wanted.get(file);
      if (!found) {
        wanted.set(file, { text, file, words: [word.japanese] });
        continue;
      }

      // Cùng tên file mà khác chuỗi đọc nghĩa là hai từ sẽ giẫm lên file của nhau —
      // đúng cái lỗi "phát ra âm của từ khác" cần tránh nhất. Dừng hẳn, đừng ghi đè.
      if (found.text !== text) {
        abort(
          `Đụng độ mã băm ở ${file}: ${JSON.stringify(found.text)} và ${JSON.stringify(text)}. ` +
            'Hãy đổi thuật toán băm trong src/app/core/audio/vocab-audio.ts.',
        );
      }
      found.words.push(word.japanese);
    }
  }

  return { wanted, wordCount, silentCount };
}

/** File mp3 đang có trong thư mục. File .part của lượt chạy dở không tính. */
function existingFiles() {
  if (!existsSync(AUDIO_DIR)) return new Set();
  return new Set(readdirSync(AUDIO_DIR).filter((name) => name.endsWith('.mp3')));
}

/** Gọi edge-tts (Python) sinh những file còn thiếu. */
async function synthesize(jobs) {
  const jobFile = join(tmpdir(), `minano-tts-${process.pid}.json`);
  writeFileSync(jobFile, JSON.stringify({ voice: VOCAB_AUDIO_VOICE, jobs }), 'utf8');

  const python = process.env['PYTHON'] ?? 'python';
  log(`${c.dim}edge-tts (${VOCAB_AUDIO_VOICE}) đang đọc ${jobs.length} từ...${c.reset}`);

  const code = await new Promise((resolve) => {
    const child = spawn(python, [PYTHON_SCRIPT, jobFile], { stdio: 'inherit' });
    child.on('error', (error) => {
      abort(`Không chạy được "${python}": ${error.message}. Cần Python kèm "pip install edge-tts".`);
    });
    child.on('close', resolve);
  });

  rmSync(jobFile, { force: true });
  if (code !== 0) {
    log(`${c.yellow}edge-tts kết thúc với mã ${code}: có từ chưa đọc được.${c.reset}`);
  }
}

// ── Chạy ────────────────────────────────────────────────────────────────────

const { wanted, wordCount, silentCount } = collectWords();
const have = existingFiles();
const missing = [...wanted.values()].filter((item) => FORCE || !have.has(item.file));
const orphans = [...have].filter((name) => !wanted.has(name));

log(`${c.bold}${wordCount} từ vựng${c.reset}, ${wanted.size} cách đọc khác nhau.`);
if (silentCount > 0) log(`${c.yellow}${silentCount} từ không đọc được, đã bỏ qua.${c.reset}`);

if (CHECK_ONLY) {
  if (missing.length > 0) {
    log(`${c.red}[LOI] Thiếu ${missing.length} file phát âm. Chạy "npm run generate:audio".${c.reset}`);
    for (const item of missing.slice(0, 10)) log(`  ${c.dim}${item.file}${c.reset}  ${item.text}`);
    if (missing.length > 10) log(`  ${c.dim}... và ${missing.length - 10} file nữa${c.reset}`);
    process.exit(1);
  }
  if (orphans.length > 0) {
    log(
      `${c.yellow}${orphans.length} file mồ côi (không từ nào dùng tới). ` +
        `Chạy "npm run generate:audio -- --clean".${c.reset}`,
    );
  }
  log(`${c.green}Đủ ${wanted.size} file phát âm.${c.reset}`);
  process.exit(0);
}

mkdirSync(AUDIO_DIR, { recursive: true });

if (missing.length > 0) {
  await synthesize(missing.map((item) => ({ text: item.text, out: join(AUDIO_DIR, item.file) })));
} else {
  log(`${c.dim}Không có file nào thiếu.${c.reset}`);
}

// Kiểm lại chính thư mục vừa ghi: mạng chập chờn làm rớt vài file là chuyện thường,
// và người chạy cần biết ngay còn thiếu bao nhiêu để chạy lại.
const after = existingFiles();
const stillMissing = [...wanted.values()].filter((item) => !after.has(item.file));
if (stillMissing.length > 0) {
  log(`${c.red}Còn thiếu ${stillMissing.length} file. Chạy lại lệnh để sinh tiếp.${c.reset}`);
}

if (orphans.length > 0) {
  if (CLEAN) {
    for (const name of orphans) rmSync(join(AUDIO_DIR, name), { force: true });
    log(`${c.dim}Đã xoá ${orphans.length} file mồ côi.${c.reset}`);
  } else {
    log(`${c.yellow}${orphans.length} file mồ côi còn nằm lại. Thêm "-- --clean" để xoá.${c.reset}`);
  }
}

// Bảng tra tên file <-> chuỗi đem đọc. App KHÔNG đọc file này (nó tự tính được tên
// file); nó có ở đây để người soát mở ra là biết ngay file nào đọc chữ gì.
const items = {};
let totalBytes = 0;
for (const item of [...wanted.values()].sort((a, b) => a.file.localeCompare(b.file))) {
  items[item.file] = item.text;
  const path = join(AUDIO_DIR, item.file);
  if (existsSync(path)) totalBytes += statSync(path).size;
}
const manifest = {
  generatedAt: new Date().toISOString(),
  voice: VOCAB_AUDIO_VOICE,
  count: wanted.size,
  items,
};
writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

log(
  `${c.green}${c.bold}Xong.${c.reset} ${after.size} file trong public/audio/vocab/ ` +
    `(${(totalBytes / 1024 / 1024).toFixed(1)} MB).`,
);
