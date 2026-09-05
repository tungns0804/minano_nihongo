#!/usr/bin/env node
/**
 * Sinh `src/app/core/topics/topic-words.ts` cho khu "Từ vựng theo chủ đề".
 *
 * Mỗi chủ đề trong `src/app/core/topics/topic-list.ts` chỉ khai một DANH SÁCH TỪ
 * TIẾNG NHẬT. Script này tra từng từ đó trong kho từ có sẵn của ứng dụng —
 * `data-source/<bài>/vocabulary*.txt`, đọc bằng đúng parser mà app dùng — rồi
 * ghi ra âm Hán Việt, cách đọc, nghĩa và câu ví dụ.
 *
 * ── Vì sao tra lại thay vì chép sẵn vào topic-list.ts ─────────────────────
 * Để KHÔNG có bản sao thứ hai của nghĩa một từ. Sửa nghĩa trong data-source thì
 * chủ đề đổi theo ngay lần chạy sau; chép tay thì hai nơi lệch nhau lúc nào
 * không biết. Và quan trọng hơn: khai một từ không có trong kho là LỖI, nên
 * không có cách nào lọt vào ứng dụng một từ do người viết chủ đề tự nghĩ ra.
 *
 * ── Từ trùng ──────────────────────────────────────────────────────────────
 * Một chuỗi tiếng Nhật có thể xuất hiện ở nhiều bài (月 ở bài 30 và 32, 例えば ở
 * ba bài). Mặc định lấy lần xuất hiện ở bài có `order` NHỎ NHẤT — tức là chỗ giáo
 * trình dạy từ đó lần đầu — và ghi kèm id bài đó vào dữ liệu sinh ra, để màn hình
 * chủ đề chỉ được về đúng bài gốc.
 *
 * Mặc định đó SAI khi hai lần xuất hiện mang hai nghĩa khác nhau và chủ đề cần
 * nghĩa thứ hai: 先生 là "Thầy/ cô" ở bài 1 nhưng là "Bác sĩ" ở bài 17, còn 私 là
 * "Tôi" ở bài 1 nhưng là わたくし "tôi (cách nói lịch sự)" ở bài 50. Cho những chỗ
 * đó, `topic-list.ts` GHIM bài nguồn bằng cú pháp `từ@id-bài`:
 *
 *     '先生@minano-nihongo-17'   → lấy đúng nghĩa "Bác sĩ"
 *
 * Ghim vào một bài không có từ đó là LỖI — ghim rồi bỏ quên lúc dữ liệu đổi thì
 * script bắt được, chứ không lặng lẽ rơi về nghĩa mặc định.
 *
 * ── Hai file sinh ra ──────────────────────────────────────────────────────
 *  - `topic-catalog.ts` nhẹ: id + tên + số từ. `LessonStore` và lưới chủ đề chỉ
 *    cần bấy nhiêu, nên phần này được nhập thẳng.
 *  - `topic-words.ts`   nặng: toàn bộ từ. Chỉ được nạp động khi người dùng mở
 *    một chủ đề — xem ghi chú "Năm file" trong `topic.model.ts`.
 *
 * Chạy: npm run generate:topics
 *       npm run generate:topics -- --check   (chỉ kiểm tra, không ghi đè)
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseVocabulary } from './vocab-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SOURCE_DIR = join(ROOT, 'data-source');
const WORDS_FILE = join(ROOT, 'src', 'app', 'core', 'topics', 'topic-words.ts');
const CATALOG_FILE = join(ROOT, 'src', 'app', 'core', 'topics', 'topic-catalog.ts');

/** Tên file được coi là dữ liệu từ vựng — giữ khớp với `generate-lessons.mjs`. */
const VOCAB_STEMS = new Set(['vocabulary', 'vocab', 'tu-vung', 'tuvung']);
const VOCAB_EXTENSIONS = new Set(['.txt', '.csv', '.tsv']);

const checkOnly = process.argv.includes('--check');
const log = (msg = '') => process.stdout.write(`${msg}\n`);

const USE_COLOR = process.stdout.isTTY === true && !process.env['NO_COLOR'];
const ESC = String.fromCharCode(27);
const ansi = (code) => (USE_COLOR ? `${ESC}[${code}m` : '');
const c = { reset: ansi(0), bold: ansi(1), red: ansi(31), green: ansi(32), yellow: ansi(33) };

let failures = 0;
function fail(msg) {
  log(`${c.red}[LOI] ${msg}${c.reset}`);
  failures++;
}

const toFileUrl = (path) => new URL(`file:///${path.split(String.fromCharCode(92)).join('/')}`).href;
const { TOPIC_DEFS } = await import(toFileUrl(join(ROOT, 'src/app/core/topics/topic-list.ts')));

// ── Kho từ ────────────────────────────────────────────────────────────────

/**
 * Toàn bộ từ vựng của ứng dụng, khoá theo chuỗi tiếng Nhật.
 *
 * `order` lấy từ meta.json giống `generate-lessons.mjs`; bài không khai thì xếp
 * sau cùng để một bài chuyên đề không giành mất chỗ "bài dạy đầu tiên" của một
 * bài trong giáo trình.
 */
function readCorpus() {
  /** @type {Map<string, { word: object, lesson: string, order: number }>} */
  const byJapanese = new Map();
  /** Bản tra theo bài, cho những từ có ghim `từ@id-bài`. Khoá ghép id bài với từ, ngăn nhau bằng một ký tự NUL. */
  const byLesson = new Map();
  /** Id của MỌI bài trong data-source, kể cả bài động từ / hội thoại / ngữ pháp. */
  const lessonIds = new Set();

  const folders = readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  for (const folder of folders) {
    const folderPath = join(SOURCE_DIR, folder);
    lessonIds.add(folder);
    const files = readdirSync(folderPath).filter((name) => {
      const ext = extname(name).toLowerCase();
      if (!VOCAB_EXTENSIONS.has(ext)) return false;
      // "tu-vung_bai33.txt" cũng là file từ vựng — tách hậu tố ở dấu - hoặc _.
      const stem = name.slice(0, name.length - ext.length).split(/[-_]/)[0];
      return VOCAB_STEMS.has(stem) || VOCAB_STEMS.has(name.slice(0, name.length - ext.length));
    });
    // Đọc meta TRƯỚC khi bỏ qua thư mục không phải bài từ vựng: id trong meta của
    // bài động từ / hội thoại cũng chiếm chỗ trong không gian tên id bài học.
    const metaPath = join(folderPath, 'meta.json');
    let order = Number.MAX_SAFE_INTEGER;
    let id = folder;
    if (existsSync(metaPath)) {
      try {
        const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
        if (typeof meta.order === 'number') order = meta.order;
        if (typeof meta.id === 'string' && meta.id) {
          id = meta.id;
          lessonIds.add(id);
        }
      } catch {
        // meta.json hỏng là việc của generate-lessons.mjs báo; ở đây chỉ mất thứ tự.
      }
    }

    if (files.length === 0) continue;

    for (const file of files.sort()) {
      const { words } = parseVocabulary(readFileSync(join(folderPath, file), 'utf8'));
      for (const word of words) {
        byLesson.set(`${id}\u0000${word.japanese}`, { word, lesson: id, order });
        const current = byJapanese.get(word.japanese);
        if (current && current.order <= order) continue;
        byJapanese.set(word.japanese, { word, lesson: id, order });
      }
    }
  }

  return { byJapanese, byLesson, lessonIds };
}

const { byJapanese: corpus, byLesson, lessonIds } = readCorpus();

// ── Tra từng chủ đề ───────────────────────────────────────────────────────

const seeds = [];
const seenTopicIds = new Set();
let totalWords = 0;

for (const topic of TOPIC_DEFS) {
  if (seenTopicIds.has(topic.id)) {
    fail(`Chủ đề "${topic.id}" bị khai hai lần — id là khoá lưu ★, không được trùng.`);
    continue;
  }
  seenTopicIds.add(topic.id);

  // Id chủ đề CHÍNH LÀ id bài học (xem ghi chú trong `topic.model.ts`), nên nó
  // phải không đụng bài nào trong data-source. Đụng thì `LessonStore.getLesson`
  // trả về chủ đề và bài gốc biến mất — im lặng, kèm mất ★ của bài đó.
  if (lessonIds.has(topic.id)) {
    fail(
      `Chủ đề "${topic.id}" trùng id với một bài trong data-source/ — đổi tên chủ đề đi.`,
    );
  }

  const rows = [];
  const missing = [];
  const badPins = [];
  const duplicates = [];
  const seen = new Set();

  for (const entry of topic.words) {
    // `từ@id-bài` ghim bài nguồn; không có @ thì lấy bài dạy từ đó sớm nhất.
    const at = entry.indexOf('@');
    const japanese = at < 0 ? entry : entry.slice(0, at);
    const pinned = at < 0 ? '' : entry.slice(at + 1);

    const found = pinned ? byLesson.get(`${pinned}\u0000${japanese}`) : corpus.get(japanese);
    if (!found) {
      (pinned ? badPins : missing).push(entry);
      continue;
    }

    const { word, lesson } = found;
    // Loại trùng theo TỪ đã tra được, không theo dòng khai: hai dòng ghim khác bài
    // vẫn ra cùng một chuỗi tiếng Nhật, mà chuỗi đó chính là id của từ trong chủ
    // đề — hai từ cùng id thì bấm ★ ở dòng này sẽ sáng luôn ở dòng kia.
    if (seen.has(word.japanese)) {
      duplicates.push(entry);
      continue;
    }
    seen.add(word.japanese);

    rows.push([word.japanese, word.reading, word.hanViet, word.vietnamese, word.example, lesson]);
  }

  if (missing.length > 0) {
    fail(
      `[${topic.id}] ${missing.length} tu khong co trong kho tu: ${missing.join(' ')}\n` +
        '      Kiem tra lai chinh ta, hoac them tu do vao data-source/ truoc.',
    );
  }
  if (badPins.length > 0) {
    fail(
      `[${topic.id}] ${badPins.length} tu ghim vao bai khong co tu do: ${badPins.join(' ')}\n` +
        '      Sua lai id bai sau dau @, hoac bo dau @ de lay bai day tu do som nhat.',
    );
  }
  if (duplicates.length > 0) {
    log(`${c.yellow}[CANH BAO] [${topic.id}] khai trung, da bo bot: ${duplicates.join(' ')}${c.reset}`);
  }

  seeds.push([topic.id, rows]);
  totalWords += rows.length;
}

// Từ trong kho mà KHÔNG chủ đề nào nhận — chỉ là số liệu, không phải lỗi: 20 chủ
// đề không có nhiệm vụ phủ kín 1600 từ.
const covered = new Set(seeds.flatMap(([, rows]) => rows.map((row) => row[0])));

// ── Ghi file ──────────────────────────────────────────────────────────────

/** Chuỗi TypeScript một dòng, nháy đơn — dữ liệu không có dấu nháy nào. */
function quote(value) {
  const text = String(value ?? '');
  if (text.includes("'") || text.includes('\\')) {
    return JSON.stringify(text);
  }
  return `'${text}'`;
}

const BANNER = [
  '// TỆP SINH TỰ ĐỘNG — đừng sửa bằng tay.',
  '// Nguồn: src/app/core/topics/topic-list.ts + data-source/<bài>/vocabulary*.txt',
  '// Sinh lại: npm run generate:topics',
];

function renderWords() {
  const lines = [
    ...BANNER,
    '//',
    '// PHẦN NẶNG: mỗi dòng là [tiếng Nhật, cách đọc, âm Hán Việt, nghĩa, câu ví dụ,',
    '// id bài gốc]. Chỉ được nhập ĐỘNG (xem topic-entries.ts) để trang chủ khỏi phải',
    '// tải toàn bộ từ vựng chủ đề khi nó chẳng hiện chủ đề nào.',
    '//',
    '// Toàn bộ nội dung ở đây được TRA từ kho từ của ứng dụng, không chép tay chữ nào.',
    '',
    "import type { TopicSeed } from './topic.model';",
    '',
    'export const TOPIC_SEEDS: readonly TopicSeed[] = [',
  ];

  for (const [id, rows] of seeds) {
    lines.push(`  [${quote(id)}, [`);
    for (const row of rows) {
      lines.push(`    [${row.map(quote).join(', ')}],`);
    }
    lines.push('  ]],');
  }

  lines.push('];', '');
  return lines.join('\n');
}

function renderCatalog() {
  const rowsById = new Map(seeds);
  const lines = [
    ...BANNER,
    '//',
    '// PHẦN NHẸ: đủ để vẽ thẻ chủ đề và để LessonStore biết có những chủ đề nào,',
    '// mà không phải nạp một từ vựng nào. Nhập thẳng được ở mọi nơi.',
    '',
    "import type { TopicCatalogEntry } from './topic.model';",
    '',
    'export const TOPIC_CATALOG: readonly TopicCatalogEntry[] = [',
  ];

  for (const topic of TOPIC_DEFS) {
    const rows = rowsById.get(topic.id) ?? [];
    const sources = new Set(rows.map((row) => row[5])).size;
    lines.push(
      '  {',
      `    id: ${quote(topic.id)},`,
      `    japanese: ${quote(topic.japanese)},`,
      `    vietnamese: ${quote(topic.vietnamese)},`,
      `    description: ${quote(topic.description)},`,
      `    icon: ${quote(topic.icon)},`,
      `    wordCount: ${rows.length},`,
      `    sourceCount: ${sources},`,
      '  },',
    );
  }

  lines.push('];', '');
  return lines.join('\n');
}

/** Hai file sinh cùng một lượt; file nào lệch thì ghi lại đúng file đó. */
const outputs = [
  { file: WORDS_FILE, text: renderWords() },
  { file: CATALOG_FILE, text: renderCatalog() },
];

log(`${c.bold}Tu vung theo chu de${c.reset}`);
log(`  kho tu           : ${corpus.size} tu`);
log(`  chu de           : ${seeds.length}`);
log(`  tu da xep chu de : ${totalWords} luot (${covered.size} tu khac nhau)`);
log();

if (failures > 0) {
  log(`${c.red}${failures} loi o tren — chua ghi file.${c.reset}`);
  process.exitCode = 1;
} else {
  const stale = outputs.filter(
    ({ file, text }) => (existsSync(file) ? readFileSync(file, 'utf8') : '') !== text,
  );

  if (checkOnly) {
    if (stale.length > 0) {
      for (const { file } of stale) {
        log(`${c.red}[LOI] ${file.replace(ROOT, '.')} khong khop voi nguon.${c.reset}`);
      }
      log(`${c.red}      Chay: npm run generate:topics${c.reset}`);
      process.exitCode = 1;
    } else {
      log(`${c.green}OK: topic-catalog.ts va topic-words.ts dang khop voi nguon.${c.reset}`);
    }
  } else if (stale.length === 0) {
    log('Khong co gi thay doi.');
  } else {
    for (const { file, text } of stale) {
      writeFileSync(file, text, 'utf8');
      log(`${c.green}Da ghi ${file.replace(ROOT, '.')}${c.reset}`);
    }
  }
}
