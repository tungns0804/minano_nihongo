#!/usr/bin/env node
/**
 * Kiểm tra dữ liệu bài tập "Luyện tập ngữ pháp N4" (src/app/core/exercises/n4-grammar.ts).
 *
 * Vì sao cần một script riêng: hơn ba trăm câu ví dụ chép tay từ tài liệu, mỗi câu
 * viết theo cú pháp furigana {漢字|かな}. Sai một dấu ngoặc thì giao diện vẫn vẽ ra
 * bình thường — chỉ là furigana lệch chữ, hoặc câu đúng bị chấm sai. Còn ý nghĩa của
 * mẫu là đáp án của câu trắc nghiệm: hai mẫu trùng ý nghĩa thì có câu hỏi hai đáp án
 * đúng mà không có gì báo.
 *
 * Hai bậc giữa của lộ trình cũng soát ở đây: mọi câu ví dụ đem ra luyện phải có chỗ
 * trống 《…》 trỏ về một mẫu có ý nghĩa, và các mảnh của bài "Sắp xếp câu" ghép lại
 * phải được chấm đúng — mảnh cắt lệch câu mẫu là câu không ai xếp đúng nổi.
 *
 * Việc chấm từng câu ví dụ (gõ chữ Hán, kana, gõ lẫn…) kiểm ở `verify:answer`.
 *
 * Chạy: npm run verify:n4
 */

import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { c, log, resolveTsImports } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const EXERCISES = join(ROOT, 'src', 'app', 'core', 'exercises');

// n4-grammar.ts import "../lessons/vocabulary-parser" không kèm đuôi file.
resolveTsImports();

const { N4_INTERCHANGEABLE_GROUPS, N4_SAME_FORM, N4_SECTIONS, N4_SYNONYMS } = await import(
  pathToFileURL(join(EXERCISES, 'n4-grammar.ts'))
);
const { BLANK_MARK, blankExamples, flattenN4Examples, meaningPoints, orderExamples } = await import(
  pathToFileURL(join(EXERCISES, 'n4-grammar.model.ts'))
);
const { markupProblems, parseMarkup, plainText } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'translation', 'markup.ts'))
);
const { MAX_CHUNKS, MIN_CHUNKS } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'translation', 'chunks.ts'))
);
const { isPatternCorrect } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'practice', 'answer-check.ts'))
);

/**
 * Số lựa chọn của câu trắc nghiệm — `CHOICE_COUNT` ở practice.model.ts. Không nạp thẳng
 * file đó được: nó import kiểu dữ liệu mà không ghi `import type`, chế độ
 * --experimental-strip-types của Node không bóc được.
 */
const CHOICE_COUNT = 4;

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

/** Chữ cái tiếng Việt có dấu — lọt vào câu tiếng Nhật là dấu hiệu chép lỗi (けっこうưおいしい). */
const VIETNAMESE_LETTER = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const JAPANESE_CHAR = /[぀-ヿ㐀-鿿]/;

function checkMarkup(where, source) {
  for (const problem of markupProblems(source)) fail(where, `cú pháp: ${problem} — ${source}`);
}

function checkJapanese(where, source) {
  checkMarkup(where, source);
  if (!JAPANESE_CHAR.test(source)) fail(where, `câu tiếng Nhật không có chữ Nhật nào: ${source}`);
  if (VIETNAMESE_LETTER.test(plainText(source))) fail(where, `chữ tiếng Việt lẫn vào câu tiếng Nhật: ${source}`);
  if (/[（(][ぁ-ゟ]+[）)]/.test(plainText(source))) {
    fail(where, `còn cách đọc viết trong ngoặc như tài liệu gốc — đổi sang {漢字|かな}: ${source}`);
  }
}

/**
 * Bản dịch không được có {…|…}, và dấu "/" phải nằm trong [...]: ngoài ngoặc thì nó là
 * chữ thường, người học phải gõ cả dấu "/" mới được tính đúng.
 */
function checkVietnamese(where, source) {
  checkMarkup(where, source);
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.kind === 'ruby') fail(where, `bản dịch không dùng {…|…}: ${source}`);
      else if (node.kind === 'text' && node.text.includes('/')) {
        fail(where, `dấu "/" ngoài [...] — viết thành [a/b]: ${source}`);
      } else if (node.kind === 'choice') node.options.forEach(walk);
    }
  };
  walk(parseMarkup(source));
}

// ── Mục và mẫu ───────────────────────────────────────────────────────────

const sectionIds = new Set();
const pointIds = new Set();
const quizIds = new Set();
const exampleTexts = new Map();
let exampleCount = 0;

for (const section of N4_SECTIONS) {
  const at = `[${section.number}. ${section.id}]`;
  if (sectionIds.has(section.id)) fail(at, 'trùng id mục');
  sectionIds.add(section.id);
  if (section.points.length === 0) fail(at, 'mục không có mẫu nào');

  for (const point of section.points) {
    const where = `${at} ${point.id}`;
    if (pointIds.has(point.id)) fail(where, 'trùng id mẫu');
    pointIds.add(point.id);
    if (!point.pattern.trim()) fail(where, 'thiếu tên mẫu');

    for (const table of point.tables) {
      table.rows.forEach((row, index) => {
        if (table.headers.length > 0 && row.length !== table.headers.length) {
          fail(where, `bảng "${table.caption}" dòng ${index + 1} có ${row.length} ô, tiêu đề có ${table.headers.length}`);
        }
        row.forEach((cell) => checkMarkup(`${where} bảng "${table.caption}"`, cell));
      });
    }

    for (const wrong of point.wrong) checkJapanese(`${where} câu sai`, wrong.japanese);

    for (const usage of point.usages) {
      if (usage.examples.length === 0) fail(where, `nhóm "${usage.title}" không có câu nào`);
      for (const example of usage.examples) {
        exampleCount++;
        const ex = `${where} "${plainText(example.japanese)}"`;
        checkJapanese(ex, example.japanese);
        checkVietnamese(ex, example.vietnamese);
        example.japaneseAlt.forEach((alt) => checkJapanese(`${ex} cách nói khác`, alt));
        example.vietnameseAlt.forEach((alt) => checkVietnamese(`${ex} cách dịch khác`, alt));

        // Cùng id thì phải đúng là cùng một câu (phần so sánh của tài liệu nhắc lại
        // câu cũ) — khác câu mà trùng id là va chạm mã băm, ★ của câu này sẽ sáng
        // theo câu kia.
        const text = plainText(example.japanese);
        const seen = exampleTexts.get(example.id);
        if (seen !== undefined && seen !== text) fail(ex, `trùng id với câu khác: ${seen}`);
        exampleTexts.set(example.id, text);
      }
    }
  }

  if (section.quiz) {
    for (const item of section.quiz.items) {
      checkJapanese(`${at} bài luyện tập`, item.prompt);
      item.options.forEach((option) => checkMarkup(`${at} bài luyện tập`, option));
      if (item.options.length < 2) fail(at, `câu luyện tập có dưới 2 lựa chọn: ${item.prompt}`);
      // Câu này được đem ra luyện như trắc nghiệm: đáp án phải là một trong các lựa chọn.
      const answers = item.answer.split('/').map((answer) => answer.trim());
      if (!item.options.some((option) => answers.includes(plainText(option)))) {
        fail(at, `đáp án "${item.answer}" không khớp lựa chọn nào: ${item.prompt}`);
      }
      if (quizIds.has(item.id)) fail(at, `trùng id câu luyện tập: ${item.prompt}`);
      quizIds.add(item.id);
    }
  }
}

// ★ của bài tập lưu chung một danh sách cho mẫu, câu ví dụ và câu luyện tập.
for (const id of pointIds) {
  if (exampleTexts.has(id)) fail(`[${id}]`, 'id mẫu trùng id một câu ví dụ — ★ của hai thứ sẽ lẫn vào nhau');
  if (quizIds.has(id)) fail(`[${id}]`, 'id mẫu trùng id một câu luyện tập');
}
for (const id of quizIds) {
  if (exampleTexts.has(id)) fail(`[${id}]`, 'id câu luyện tập trùng id một câu ví dụ');
}

// ── Phần luyện ý nghĩa ───────────────────────────────────────────────────

const meanings = meaningPoints(N4_SECTIONS);
const byMeaning = new Map();
const byPattern = new Map();
for (const { point } of meanings) {
  const meaningKey = point.meaning.trim().toLowerCase();
  if (byMeaning.has(meaningKey)) fail(`[${point.id}]`, `trùng ý nghĩa với ${byMeaning.get(meaningKey)}`);
  byMeaning.set(meaningKey, point.id);
  if (byPattern.has(point.pattern)) fail(`[${point.id}]`, `trùng tên mẫu với ${byPattern.get(point.pattern)}`);
  byPattern.set(point.pattern, point.id);
}

const meaningIds = new Set(meanings.map(({ point }) => point.id));
for (const group of N4_SYNONYMS) {
  for (const id of group) {
    if (!meaningIds.has(id)) fail('[N4_SYNONYMS]', `"${id}" không phải một mẫu có ý nghĩa để luyện`);
  }
}

const groups = new Map();
for (const { point } of meanings) {
  if (point.group) groups.set(point.group, (groups.get(point.group) ?? 0) + 1);
}
for (const [group, count] of groups) {
  if (count < 2) fail(`[nhóm ${group}]`, 'chỉ có một mẫu — nhóm dễ nhầm phải có ít nhất hai');
}
if (meanings.length < CHOICE_COUNT) fail('[ý nghĩa]', `chỉ có ${meanings.length} mẫu, không đủ ${CHOICE_COUNT} lựa chọn`);

for (const group of N4_INTERCHANGEABLE_GROUPS) {
  if (!groups.has(group)) fail('[N4_INTERCHANGEABLE_GROUPS]', `"${group}" không phải nhóm dễ nhầm nào`);
}
for (const group of N4_SAME_FORM) {
  for (const id of group) {
    if (!meaningIds.has(id)) fail('[N4_SAME_FORM]', `"${id}" không phải một mẫu có ý nghĩa để luyện`);
  }
}

// ── Bậc 3: điền vào chỗ trống ────────────────────────────────────────────

const blanks = blankExamples(N4_SECTIONS);
const blankTargets = new Set();
for (const { example, point } of flattenN4Examples(N4_SECTIONS)) {
  const ex = `[${point.id}] "${plainText(example.japanese)}"`;
  const blank = example.blank;
  if (!blank) {
    fail(ex, 'câu ví dụ chưa đánh dấu phần ngữ pháp bằng 《…》 — bài "Điền vào chỗ trống" sẽ thiếu câu này');
    continue;
  }
  if (!meaningIds.has(blank.pointId)) {
    fail(ex, `chỗ trống trỏ về "${blank.pointId}" — không phải mẫu có ý nghĩa (câu ở mục so sánh thì ghi 《…@id-mẫu》)`);
  }
  blankTargets.add(blank.pointId);
  if (!blank.filled.trim()) fail(ex, 'chỗ trống 《》 rỗng');
  if (!blank.prompt.includes(BLANK_MARK)) fail(ex, 'câu đục lỗ không có ô trống');
  checkMarkup(`${ex} câu đục lỗ`, blank.prompt);
  if (/[《》@]/.test(blank.prompt) || /[《》@]/.test(example.japanese)) {
    fail(ex, 'dấu 《》 / @ lọt vào câu — viết sai cú pháp chỗ trống');
  }
}

// Câu nhắc lại ở phần so sánh có cùng id với câu gốc: chỗ trống của hai bản phải giống
// nhau, không thì câu được luyện tuỳ vào bản nào đứng trước trong tài liệu.
const blankById = new Map();
for (const section of N4_SECTIONS) {
  for (const point of section.points) {
    for (const usage of point.usages) {
      if (usage.reference) continue;
      for (const example of usage.examples) {
        const key = example.blank ? `${example.blank.pointId}|${example.blank.prompt}` : '';
        const seen = blankById.get(example.id);
        if (seen !== undefined && seen !== key) {
          fail(`[${point.id}] "${plainText(example.japanese)}"`, 'hai bản của cùng một câu đánh dấu chỗ trống khác nhau');
        }
        blankById.set(example.id, key);
      }
    }
  }
}

// ── Bậc 4: sắp xếp câu ───────────────────────────────────────────────────

const orders = orderExamples(N4_SECTIONS);
// Đúng các tuỳ chọn màn luyện tập dùng khi chấm câu tiếng Nhật bỏ qua dấu câu.
const compare = { ignoreDiacritics: false, ignoreAllWhitespace: true, ignorePunctuation: true };
for (const { example, point } of orders) {
  const ex = `[${point.id}] "${plainText(example.japanese)}"`;
  const { chunks } = example;
  if (chunks.length < MIN_CHUNKS || chunks.length > MAX_CHUNKS) {
    fail(ex, `${chunks.length} mảnh, ngoài khoảng ${MIN_CHUNKS}–${MAX_CHUNKS}`);
  }
  chunks.forEach((chunk) => checkMarkup(`${ex} mảnh "${chunk}"`, chunk));
  const joined = chunks.map(plainText).join('');
  if (!isPatternCorrect(joined, [example.japanese, ...example.japaneseAlt], compare)) {
    fail(ex, `các mảnh ghép lại không được chấm đúng: ${chunks.map(plainText).join(' | ')}`);
  }
}

// ── Tổng kết ─────────────────────────────────────────────────────────────

const practiced = flattenN4Examples(N4_SECTIONS).length;

log(`${c.bold}Luyen tap ngu phap N4${c.reset}`);
log(`  muc            : ${N4_SECTIONS.length}`);
log(`  mau            : ${pointIds.size} (${meanings.length} mau luyen y nghia, ${groups.size} nhom de nham)`);
log(`  cau vi du      : ${exampleCount} (${practiced} cau dem ra luyen)`);
log(`  dien cho trong : ${blanks.length} cau, tro ve ${blankTargets.size} mau`);
log(`  sap xep cau    : ${orders.length} cau du dai de sap xep`);
log(`  bai luyen tap  : ${quizIds.size} cau cua tai lieu`);
log();

if (problems.length > 0) {
  for (const problem of problems) log(`${c.red}[LOI] ${problem}${c.reset}`);
  log(`${c.red}${problems.length} van de can sua.${c.reset}`);
  process.exitCode = 1;
} else {
  log(`${c.green}OK: du lieu ngu phap N4 hop le.${c.reset}`);
}
