#!/usr/bin/env node
/**
 * Sinh file JSON bài học từ thư mục `data-source/`.
 *
 *   data-source/<ten-bai>/*.txt|*.csv  ->  public/lessons/<id>.json
 *                                     ->  public/lessons/index.json
 *
 * Cách dùng:
 *   npm run generate            Sinh lại toàn bộ file JSON
 *   npm run generate -- --clean Sinh lại, đồng thời xoá các file .json thừa
 *   npm run generate -- --check Chỉ kiểm tra, không ghi file (dùng cho CI)
 *
 * Mỗi thư mục con của data-source/ là MỘT bài học. Trong thư mục có thể đặt thêm
 * `meta.json` để chỉ định id/tên hiển thị:
 *   { "id": "minano-nihongo-33", "name": "Minna no Nihongo - Bài 33" }
 * Không có meta.json thì id = tên thư mục (đã slug hoá), tên = tên thư mục viết hoa đầu từ.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  parseConversation,
  parseGrammar,
  parseVerbList,
  parseVocabulary,
  slugify,
  titleFromFolder,
} from './vocab-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SOURCE_DIR = join(ROOT, 'data-source');
const OUTPUT_DIR = join(ROOT, 'public', 'lessons');
const INDEX_FILE = join(OUTPUT_DIR, 'index.json');
const VOCAB_EXTENSIONS = new Set(['.txt', '.csv', '.tsv']);

const args = new Set(process.argv.slice(2));
const CLEAN = args.has('--clean');
const CHECK_ONLY = args.has('--check');

// Mã màu ANSI, tự tắt khi output bị pipe vào file hoặc khi đặt biến môi trường NO_COLOR.
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
  cyan: ansi(36),
};

function log(msg = '') {
  process.stdout.write(`${msg}\n`);
}

let failureCount = 0;

function fail(msg) {
  log(`${c.red}[LOI] ${msg}${c.reset}`);
  failureCount++;
  process.exitCode = 1;
}

/** Dòng tổng kết cuối cùng, luôn nói rõ có lỗi hay không. */
function summarize(headline) {
  log();
  if (failureCount === 0) {
    log(`${c.green}OK: ${headline}${c.reset}`);
  } else {
    log(`${c.red}CO ${failureCount} LOI o tren — ${headline}${c.reset}`);
    log(`${c.red}     Cac thu muc bi loi da bi bo qua, hay sua roi chay lai.${c.reset}`);
  }
}

/** Đọc meta.json của một thư mục bài học, trả về {} nếu không có / hỏng. */
function readMeta(folderPath, folderName) {
  const metaPath = join(folderPath, 'meta.json');
  if (!existsSync(metaPath)) return {};
  try {
    const parsed = JSON.parse(readFileSync(metaPath, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    fail(`[${folderName}] meta.json không phải JSON hợp lệ: ${error.message}`);
    return {};
  }
}

/**
 * Loại bài học được quyết định DUY NHẤT bởi tên file dữ liệu.
 *
 * Trước đây script đoán loại (mặc định là từ vựng nếu không khớp `verbs.*`), và đó
 * là một cái bẫy im lặng: file `dongtu.txt` chứa 4 cột sẽ bị đọc bằng parser từ
 * vựng, cột nhóm dính luôn vào nghĩa ("về/ trở về,1*") mà không có một cảnh báo
 * nào — vì parser từ vựng chỉ tách ở 2 dấu phẩy đầu nên dòng nào cũng "hợp lệ".
 * Nay tên file không khớp danh sách dưới đây là báo lỗi và dừng, không đoán nữa.
 */
/**
 * Bài NGỮ PHÁP nằm trong file JSON chứ không phải .txt, vì một mẫu ngữ pháp là cả
 * một cụm lồng nhau (công thức, bảng biến đổi, các cách dùng, ví dụ của từng cách
 * dùng) chứ không phải một dòng phẳng. Xem `parseGrammar` trong vocab-core.mjs.
 *
 * Pattern phải KHÔNG khớp `meta.json` — file đó cũng là .json và nằm cùng thư mục.
 */
const GRAMMAR_PATTERN = /^(?:grammar|ngu-?phap)(?:[-_].+)?\.json$/i;
const GRAMMAR_ACCEPTED = 'grammar.json, ngu-phap.json, nguphap.json';

const FILE_KINDS = [
  {
    kind: 'vocabulary',
    pattern: /^(?:vocabulary|vocab|tu-?vung)(?:[-_].+)?$/i,
    accepted: 'vocabulary.txt, vocab.txt, tu-vung.txt, tuvung.txt',
  },
  {
    kind: 'verb',
    pattern: /^(?:verbs?|dong-?tu)(?:[-_].+)?$/i,
    accepted: 'verbs.txt, verb.txt, dong-tu.txt, dongtu.txt',
  },
  {
    kind: 'conversation',
    pattern: /^(?:conversation|dialog(?:ue)?|hoi-?thoai)(?:[-_].+)?$/i,
    accepted: 'conversation.txt, dialog.txt, hoi-thoai.txt, hoithoai.txt',
  },
];

const ACCEPTED_NAMES = [...FILE_KINDS.map((entry) => entry.accepted), GRAMMAR_ACCEPTED].join(
  '\n              ',
);

/**
 * Bảng tra parser theo loại bài. Mỗi hàm trả về { items, issues } đã chuẩn hoá,
 * để phần còn lại của script không cần biết loại bài nào dùng trường gì.
 * Thêm loại bài mới thì khai báo ở đây thay vì rải `kind === '...' ? ... : ...`.
 */
const PARSE_BY_KIND = {
  vocabulary: (text) => {
    const parsed = parseVocabulary(text);
    return { items: parsed.words, issues: parsed.issues };
  },
  verb: (text) => {
    const parsed = parseVerbList(text);
    return { items: parsed.verbs, issues: parsed.issues };
  },
  conversation: (text) => {
    const parsed = parseConversation(text);
    return { items: parsed.lines, issues: parsed.issues };
  },
  grammar: (text) => {
    const parsed = parseGrammar(text);
    return { items: parsed.points, issues: parsed.issues };
  },
};

/** Trả về loại dữ liệu của một file, hoặc null nếu tên file không nhận dạng được. */
function classifyFile(fileName) {
  const stem = fileName.slice(0, fileName.length - extname(fileName).length);
  return FILE_KINDS.find((entry) => entry.pattern.test(stem))?.kind ?? null;
}

/**
 * Đọc các file dữ liệu của một thư mục bài học và xác định loại bài.
 * Một thư mục chỉ được chứa dữ liệu của MỘT loại.
 */
function readSourceFiles(folderPath, folderName) {
  const allFiles = readdirSync(folderPath)
    .filter((name) => statSync(join(folderPath, name)).isFile())
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  const files = allFiles.filter((name) => VOCAB_EXTENSIONS.has(extname(name).toLowerCase()));
  const grammarFiles = allFiles.filter((name) => GRAMMAR_PATTERN.test(name));

  if (grammarFiles.length > 0) {
    if (files.length > 0) {
      fail(
        `[${folderName}] trộn lẫn hai loại dữ liệu trong cùng một thư mục:\n` +
          `              grammar: ${grammarFiles.join(', ')}\n` +
          `              text: ${files.join(', ')}\n` +
          `              Mỗi thư mục là một bài học và chỉ chứa một loại. Hãy tách ra hai thư mục.`,
      );
      return null;
    }
    // Nội dung ngữ pháp là JSON nên không nối nhiều file lại được như .txt.
    if (grammarFiles.length > 1) {
      fail(
        `[${folderName}] có ${grammarFiles.length} file ngữ pháp (${grammarFiles.join(', ')}).\n` +
          `              Bài ngữ pháp chỉ được có MỘT file JSON — gộp các mẫu vào cùng mảng "points".`,
      );
      return null;
    }
    return {
      files: grammarFiles,
      kind: 'grammar',
      content: readFileSync(join(folderPath, grammarFiles[0]), 'utf8'),
    };
  }

  if (files.length === 0) {
    fail(`[${folderName}] không có file .txt/.csv/.tsv nào, bỏ qua thư mục này`);
    return null;
  }

  const unknown = files.filter((name) => classifyFile(name) === null);
  if (unknown.length > 0) {
    fail(
      `[${folderName}] không biết ${unknown.join(', ')} chứa dữ liệu gì.\n` +
        `              Đặt tên file theo một trong các dạng sau:\n` +
        `              ${ACCEPTED_NAMES}`,
    );
    return null;
  }

  const kinds = [...new Set(files.map((name) => classifyFile(name)))];
  if (kinds.length > 1) {
    const byKind = kinds
      .map((kind) => `${kind}: ${files.filter((n) => classifyFile(n) === kind).join(', ')}`)
      .join('\n              ');
    fail(
      `[${folderName}] trộn lẫn hai loại dữ liệu trong cùng một thư mục:\n` +
        `              ${byKind}\n` +
        `              Mỗi thư mục là một bài học và chỉ chứa một loại. Hãy tách ra hai thư mục.`,
    );
    return null;
  }

  return {
    files,
    kind: kinds[0],
    content: files.map((name) => readFileSync(join(folderPath, name), 'utf8')).join('\n'),
  };
}

/**
 * `meta.kind` không còn quyết định loại bài nữa — chỉ dùng để đối chiếu.
 * Khai báo lệch với tên file là dấu hiệu dữ liệu sai, phải dừng lại.
 */
function checkMetaKind(meta, kind, folderName) {
  if (meta.kind === undefined) return true;
  if (meta.kind === kind) return true;

  fail(
    `[${folderName}] meta.json ghi "kind": "${meta.kind}" nhưng tên file cho thấy đây là ` +
      `bài "${kind}".\n              Loại bài do tên file quyết định — hãy xoá "kind" khỏi ` +
      `meta.json hoặc đổi tên file cho đúng.`,
  );
  return false;
}

/**
 * Chỗ xảy ra lỗi, viết theo đúng loại dữ liệu: bài .txt thì là số dòng, bài ngữ pháp
 * (JSON) thì là đường dẫn trong cây như `points[0].usages[1].examples[2]`.
 */
function issueLocation(issue) {
  return issue.line > 0 ? `dòng ${issue.line}` : issue.path || 'dữ liệu';
}

/**
 * Bài này là bài số mấy trong giáo trình, hoặc null nếu không xác định được.
 *
 * Ưu tiên "lesson" khai báo thẳng trong meta.json; không có thì lấy CỤM SỐ CUỐI CÙNG
 * trong tên thư mục, vì mọi thư mục đều đặt theo kiểu "<chủ đề>-<số bài>":
 * minano-nihongo-33, ngu-phap-minano-26, hoi-thoai-minano-26.
 *
 * Vì sao tính ở bước sinh dữ liệu chứ không để giao diện tự tách chuỗi id: quy ước
 * đặt tên thư mục là chuyện của bước này, và ở đây mới biết chắc thư mục nào là bài
 * có sẵn. Bài người dùng tự nạp không đi qua bước này nên không bao giờ bị gán nhầm
 * số bài — một bài tên "bai-5-cua-toi" mà bị đọc thành bài 5 sẽ hiện sai cấp độ.
 *
 * Thư mục không có số nào (dong-tu-dac-biet) trả về null: nó gom động từ của nhiều
 * bài khác nhau nên không thuộc riêng bài nào.
 */
function lessonNumberOf(folderName, meta) {
  if (typeof meta.lesson === 'number' && Number.isFinite(meta.lesson)) return meta.lesson;
  const matches = String(folderName).match(/[0-9]+/g);
  return matches ? Number(matches[matches.length - 1]) : null;
}

function buildLesson(folderName) {
  const folderPath = join(SOURCE_DIR, folderName);
  const meta = readMeta(folderPath, folderName);

  const id = slugify(meta.id || folderName);
  if (!id) {
    fail(`[${folderName}] không tạo được id hợp lệ từ tên thư mục`);
    return null;
  }

  const source = readSourceFiles(folderPath, folderName);
  if (!source) return null;

  const kind = source.kind;
  if (!checkMetaKind(meta, kind, folderName)) return null;

  const parsed = PARSE_BY_KIND[kind](source.content);
  const items = parsed.items;
  const issues = parsed.issues;

  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  log(`${c.bold}${folderName}${c.reset} ${c.dim}(${source.files.join(', ')})${c.reset}`);
  log(
    `  id: ${c.cyan}${id}${c.reset}   loai: ${c.cyan}${kind}${c.reset}   ` +
      `so muc: ${c.green}${items.length}${c.reset}`,
  );

  for (const issue of warnings) {
    log(`  ${c.yellow}[CANH BAO] ${issueLocation(issue)}: ${issue.message}${c.reset}`);
    if (issue.text) log(`    ${c.dim}${issue.text}${c.reset}`);
  }
  for (const issue of errors) {
    fail(`  ${issueLocation(issue)}: ${issue.message}`);
    if (issue.text) log(`    ${c.dim}${issue.text}${c.reset}`);
  }

  if (items.length === 0) {
    fail(`[${folderName}] không có mục hợp lệ nào`);
    return null;
  }

  if (!meta.name) {
    log(
      `  ${c.dim}(không có meta.json/name — tên hiển thị tự suy ra: ` +
        `"${titleFromFolder(folderName)}")${c.reset}`,
    );
  }

  return {
    folderName,
    // Thứ tự hiển thị: meta.order nếu có, còn lại xếp sau và sắp theo tên thư mục.
    order: typeof meta.order === 'number' ? meta.order : Number.MAX_SAFE_INTEGER,
    lesson: {
      id,
      lessonNumber: lessonNumberOf(folderName, meta),
      name: String(meta.name || titleFromFolder(folderName)).trim(),
      description: meta.description ? String(meta.description).trim() : '',
      kind,
      itemCount: items.length,
      // Chỉ trường ứng với loại bài mới có dữ liệu, các trường kia là mảng rỗng.
      words: kind === 'vocabulary' ? items : [],
      verbs: kind === 'verb' ? items : [],
      lines: kind === 'conversation' ? items : [],
      grammarPoints: kind === 'grammar' ? items : [],
    },
    fileName: `${id}.json`,
  };
}

function main() {
  if (!existsSync(SOURCE_DIR)) {
    fail(`Không tìm thấy thư mục nguồn: ${SOURCE_DIR}`);
    log(`${c.dim}Tạo thư mục data-source/<ten-bai>/ rồi đặt file .txt từ vựng vào đó.${c.reset}`);
    return;
  }

  const folders = readdirSync(SOURCE_DIR)
    .filter((name) => statSync(join(SOURCE_DIR, name)).isDirectory())
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  if (folders.length === 0) {
    fail('data-source/ chưa có thư mục bài học nào');
    return;
  }

  log(`${c.bold}Sinh du lieu bai hoc${c.reset} ${c.dim}(${folders.length} thu muc)${c.reset}`);
  log();

  const built = [];
  const usedIds = new Map();

  for (const folderName of folders) {
    const result = buildLesson(folderName);
    log();
    if (!result) continue;

    const previous = usedIds.get(result.lesson.id);
    if (previous) {
      fail(
        `Trùng id "${result.lesson.id}" giữa thư mục "${previous}" và "${folderName}". ` +
          `Dùng meta.json để đặt id khác.`,
      );
      continue;
    }
    usedIds.set(result.lesson.id, folderName);
    built.push(result);
  }

  if (built.length === 0) {
    fail('Không sinh được bài học nào.');
    return;
  }

  // Hai bài trùng tên hiển thị thì ở màn hình kết quả không phân biệt nổi bài nào.
  const byName = new Map();
  for (const item of built) {
    const key = item.lesson.name.toLowerCase();
    byName.set(key, [...(byName.get(key) ?? []), item.folderName]);
  }
  for (const [, folders] of byName) {
    if (folders.length > 1) {
      log(
        `${c.yellow}[CANH BAO] cac thu muc ${folders.join(', ')} dung chung mot ten hien thi. ` +
          `Dat "name" khac nhau trong meta.json de phan biet.${c.reset}`,
      );
    }
  }

  // Bài có meta.order lên trước theo thứ tự đó; còn lại xếp theo tên thư mục.
  built.sort(
    (a, b) =>
      a.order - b.order || a.folderName.localeCompare(b.folderName, 'en', { numeric: true }),
  );

  const index = {
    generatedAt: new Date().toISOString(),
    lessons: built.map(({ lesson, fileName }) => ({
      id: lesson.id,
      name: lesson.name,
      description: lesson.description,
      kind: lesson.kind,
      itemCount: lesson.itemCount,
      // Bỏ hẳn khoá khi không xác định được, để index.json không đầy "lessonNumber": null.
      ...(lesson.lessonNumber === null ? {} : { lessonNumber: lesson.lessonNumber }),
      file: fileName,
    })),
  };

  const total = index.lessons.reduce((sum, l) => sum + l.itemCount, 0);

  if (CHECK_ONLY) {
    log(`${c.dim}--check: chi kiem tra, khong ghi file.${c.reset}`);
    summarize(`${built.length} bai hoc hop le, tong ${total} muc.`);
    return;
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const { lesson, fileName } of built) {
    writeFileSync(join(OUTPUT_DIR, fileName), `${JSON.stringify(lesson, null, 2)}\n`, 'utf8');
  }
  writeFileSync(INDEX_FILE, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  const expected = new Set([...built.map((b) => b.fileName), 'index.json']);
  const orphans = readdirSync(OUTPUT_DIR).filter(
    (name) => extname(name).toLowerCase() === '.json' && !expected.has(name),
  );

  for (const orphan of orphans) {
    if (CLEAN) {
      rmSync(join(OUTPUT_DIR, orphan));
      log(`${c.yellow}- da xoa file thua: lessons/${orphan}${c.reset}`);
    } else {
      log(
        `${c.yellow}[CANH BAO] lessons/${orphan} khong con thu muc nguon tuong ung ` +
          `(chay "npm run generate -- --clean" de xoa)${c.reset}`,
      );
    }
  }

  summarize(
    `da ghi ${built.length} file bai hoc + index.json vao public/lessons/ (tong ${total} muc).`,
  );
}

main();
