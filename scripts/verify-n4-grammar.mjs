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

const { N4_SECTIONS, N4_SYNONYMS } = await import(pathToFileURL(join(EXERCISES, 'n4-grammar.ts')));
const { flattenN4Examples, meaningPoints } = await import(
  pathToFileURL(join(EXERCISES, 'n4-grammar.model.ts'))
);
const { markupProblems, parseMarkup, plainText } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'translation', 'markup.ts'))
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
    }
  }
}

// ★ của bài tập lưu chung một danh sách cho cả mẫu (luyện ý nghĩa) lẫn câu ví dụ.
for (const id of pointIds) {
  if (exampleTexts.has(id)) fail(`[${id}]`, 'id mẫu trùng id một câu ví dụ — ★ của hai thứ sẽ lẫn vào nhau');
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

// ── Tổng kết ─────────────────────────────────────────────────────────────

const practiced = flattenN4Examples(N4_SECTIONS).length;

log(`${c.bold}Luyen tap ngu phap N4${c.reset}`);
log(`  muc            : ${N4_SECTIONS.length}`);
log(`  mau            : ${pointIds.size} (${meanings.length} mau luyen y nghia, ${groups.size} nhom de nham)`);
log(`  cau vi du      : ${exampleCount} (${practiced} cau dem ra luyen)`);
log();

if (problems.length > 0) {
  for (const problem of problems) log(`${c.red}[LOI] ${problem}${c.reset}`);
  log(`${c.red}${problems.length} van de can sua.${c.reset}`);
  process.exitCode = 1;
} else {
  log(`${c.green}OK: du lieu ngu phap N4 hop le.${c.reset}`);
}
