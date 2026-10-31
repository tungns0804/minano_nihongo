#!/usr/bin/env node
/**
 * Kiểm tra dữ liệu bài "Đề luyện N4 · 直前対策" (src/app/core/exercises/taisaku-n4.data.ts).
 *
 * Vì sao cần một script riêng: gần tám trăm câu chép tay từ bản scan. Sai một con số
 * đáp án thì giao diện vẫn chạy bình thường — chỉ là chấm đúng thành sai. Sai một dấu
 * ngoặc furigana thì chữ lệch furigana, cũng không có gì báo. Script soát:
 *
 *  - đủ số câu từng dạng như sách (34 câu từ vựng, 25 câu ngữ pháp mỗi đề);
 *  - lựa chọn khác nhau, đáp án nằm trong lựa chọn, ★ là một hoán vị của 1–4;
 *  - dấu của đề thi đúng chỗ: 〈gạch chân〉, （　）, 【★】, 【21】…【25】;
 *  - cú pháp furigana của mọi chuỗi;
 *  - id không trùng (id là khoá ★ và khoá lịch ôn).
 *
 * Chạy: npm run verify:taisaku
 */

import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { c, log, resolveTsImports } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const EXERCISES = join(ROOT, 'src', 'app', 'core', 'exercises');

// taisaku-n4.ts import "./taisaku-n4.data" không kèm đuôi file.
resolveTsImports();

const data = await import(pathToFileURL(join(EXERCISES, 'taisaku-n4.data.ts')));
const model = await import(pathToFileURL(join(EXERCISES, 'taisaku-n4.ts')));
const { markupProblems } = await import(pathToFileURL(join(ROOT, 'src', 'app', 'core', 'translation', 'markup.ts')));

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

function checkMarkup(where, source) {
  for (const problem of markupProblems(source)) fail(where, `cú pháp: ${problem} — ${source}`);
  const opened = (source.match(/〈/g) ?? []).length;
  const closed = (source.match(/〉/g) ?? []).length;
  if (opened !== closed) fail(where, `〈 và 〉 lệch nhau — ${source}`);
}

function checkChoice(where, [prompt, options, answer], { count = 4 } = {}) {
  checkMarkup(where, prompt);
  options.forEach((option) => checkMarkup(where, option));
  if (options.length !== count) fail(where, `cần ${count} lựa chọn, có ${options.length}`);
  if (new Set(options).size !== options.length) fail(where, `lựa chọn trùng nhau: ${options.join(' / ')}`);
  if (!Number.isInteger(answer) || answer < 1 || answer > options.length) fail(where, `đáp án ${answer} ngoài 1–${options.length}`);
}

// ── 文字・語彙 ─────────────────────────────────────────────────────────────

const MOJI_SIZES = { m1: 9, m2: 6, m3: 9, m4: 5, m5: 5 };
const MOJI_MARK = {
  m1: (p) => p.includes('〈'),
  m2: (p) => p.includes('〈'),
  m3: (p) => p.includes('（　）'),
  m4: (p) => p.includes('〈'),
  m5: (p) => !p.includes('〈') && !p.includes('（　）'),
};

if (data.MOJI_TESTS.length !== 10) fail('文字・語彙', `cần 10 đề, có ${data.MOJI_TESTS.length}`);
data.MOJI_TESTS.forEach((test, index) => {
  if (test.no !== index + 1) fail(`文字・語彙 đề ${test.no}`, `số đề phải là ${index + 1}`);
  for (const [key, size] of Object.entries(MOJI_SIZES)) {
    const items = test[key];
    if (items.length !== size) fail(`文字・語彙 đề ${test.no} ${key}`, `cần ${size} câu, có ${items.length}`);
    items.forEach((item, at) => {
      const where = `文字・語彙 đề ${test.no} ${key}#${at + 1}`;
      checkChoice(where, item);
      if (!MOJI_MARK[key](item[0])) fail(where, `đề thiếu dấu của dạng ${key}: ${item[0]}`);
      // Câu "cách dùng": cả bốn câu lựa chọn đều gạch chân chính từ đang hỏi.
      if (key === 'm5' && !item[1].every((option) => option.includes(`〈`))) fail(where, 'lựa chọn thiếu gạch chân');
    });
  }
});

// ── 文法 ──────────────────────────────────────────────────────────────────

if (data.BUNPO_TESTS.length !== 10) fail('文法', `cần 10 đề, có ${data.BUNPO_TESTS.length}`);
data.BUNPO_TESTS.forEach((test, index) => {
  const at = `文法 đề ${test.no}`;
  if (test.no !== index + 1) fail(at, `số đề phải là ${index + 1}`);
  if (test.m1.length !== 15) fail(`${at} m1`, `cần 15 câu, có ${test.m1.length}`);
  test.m1.forEach((item, i) => {
    checkChoice(`${at} m1#${i + 1}`, item);
    if (!item[0].includes('（　）')) fail(`${at} m1#${i + 1}`, 'đề thiếu （　）');
  });

  if (test.m2.length !== 5) fail(`${at} m2`, `cần 5 câu, có ${test.m2.length}`);
  test.m2.forEach(([prompt, fragments, order], i) => {
    const where = `${at} m2#${16 + i}`;
    checkMarkup(where, prompt);
    fragments.forEach((fragment) => checkMarkup(where, fragment));
    if ((prompt.match(/【★】/g) ?? []).length !== 1) fail(where, 'đề phải có đúng một 【★】');
    if (fragments.length !== 4 || new Set(fragments).size !== 4) fail(where, `cần 4 mảnh khác nhau: ${fragments.join(' / ')}`);
    if ([...order].sort().join('') !== '1234') fail(where, `thứ tự ${order.join('')} không phải hoán vị của 1–4`);
  });

  const { intro, title, author, text, items } = test.m3;
  [intro, title, author, ...text].forEach((line) => checkMarkup(`${at} m3`, line));
  const passage = text.join('\n');
  for (let n = 21; n <= 25; n++) {
    if ((passage.match(new RegExp(`【${n}】`, 'g')) ?? []).length !== 1) fail(`${at} m3`, `đoạn văn phải có đúng một 【${n}】`);
  }
  if (items.length !== 5) fail(`${at} m3`, `cần 5 câu, có ${items.length}`);
  items.forEach(([options, answer], i) => checkChoice(`${at} m3#${21 + i}`, ['', options, answer]));
});

// ── 付録 ──────────────────────────────────────────────────────────────────

const topicNumbers = data.FUROKU_TOPICS.map((topic) => topic.no);
if (topicNumbers.join(',') !== Array.from({ length: 16 }, (_, i) => i + 1).join(',')) {
  fail('付録', `chủ đề phải là 1–16 theo thứ tự, có ${topicNumbers.join(',')}`);
}
for (const topic of data.FUROKU_TOPICS) {
  const at = `付録 ${topic.no}`;
  checkMarkup(at, topic.title);
  for (const [word, meaning, example] of topic.words ?? []) {
    checkMarkup(at, word);
    if (example) checkMarkup(at, example);
    if (!meaning.trim()) fail(at, `từ ${word} thiếu nghĩa`);
  }
  for (const row of topic.keigo ?? []) row.slice(0, 3).forEach((cell) => checkMarkup(at, cell));
  if (!(topic.words?.length || topic.keigo?.length)) fail(at, 'chủ đề không có từ nào');
}
for (const fill of data.FUROKU_FILLS) {
  fill.groups.forEach((group, g) => {
    const at = `付録 ${fill.no} khung ${g + 1}`;
    group.bank.forEach((word) => checkMarkup(at, word));
    const answers = group.items.map(([, answer]) => answer);
    group.items.forEach(([prompt, answer], i) => {
      checkMarkup(`${at}#${i + 1}`, prompt);
      if (!prompt.includes('（　）')) fail(`${at}#${i + 1}`, 'đề thiếu （　）');
      if (!group.bank.includes(answer)) fail(`${at}#${i + 1}`, `đáp án ${answer} không có trong khung`);
    });
    // Sách: "一つの ことばは 一回しか えらべません" — mỗi từ trong khung dùng đúng một lần.
    if (new Set(answers).size !== answers.length) fail(at, 'một từ trong khung là đáp án của hai câu');
  });
}
for (const choice of data.FUROKU_CHOICES) {
  choice.items.forEach(([prompt, options, answer], i) => {
    const at = `付録 ${choice.no} #${i + 1}`;
    checkChoice(at, [prompt, options, options.indexOf(answer) + 1], { count: options.length });
    if (options.length < 2) fail(at, 'cần ít nhất hai lựa chọn');
    if (!options.includes(answer)) fail(at, `đáp án ${answer} không có trong lựa chọn`);
    if (!prompt.includes('（　）')) fail(at, 'đề thiếu （　）');
  });
}

// ── Mục luyện sau khi trải ra ──────────────────────────────────────────────

const { MOJI_QUESTIONS, BUNPO_QUESTIONS, TAISAKU_TOPICS, TAISAKU_MODE_SPEC, taisakuUnits, taisakuUnitById } = model;

if (MOJI_QUESTIONS.length !== 340) fail('文字・語彙', `cần 340 câu, có ${MOJI_QUESTIONS.length}`);
if (BUNPO_QUESTIONS.length !== 250) fail('文法', `cần 250 câu, có ${BUNPO_QUESTIONS.length}`);

const ids = new Map();
const allUnits = Object.keys(TAISAKU_MODE_SPEC).flatMap((mode) =>
  taisakuUnits(mode, TAISAKU_MODE_SPEC[mode].part === 'furoku' ? TAISAKU_TOPICS.map((t) => t.no) : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
);
for (const unit of allUnits) ids.set(unit.id, unit);
for (const question of [...MOJI_QUESTIONS, ...BUNPO_QUESTIONS, ...TAISAKU_TOPICS.flatMap((t) => t.exercises)]) {
  const where = question.id;
  if (!question.options.includes(question.answer)) fail(where, 'đáp án không nằm trong lựa chọn');
  if (question.prompt.includes('（　）') && !question.complete) fail(where, 'câu có chỗ trống mà không dựng được câu đầy đủ');
  if (question.kind === 'passage') {
    if (!question.prompt.includes('（　）')) fail(where, `không tách được câu chứa chỗ trống: ${question.prompt}`);
    if (!question.passage?.includes(`〈【${question.number}】〉`)) fail(where, 'đoạn văn không gạch chân chỗ đang hỏi');
  }
  if (question.kind === 'star' && question.ordered[2] !== question.answer) fail(where, 'đáp án ★ không phải mảnh thứ ba');
}
const unique = new Set(allUnits.map((unit) => unit.id));
for (const id of unique) {
  if (taisakuUnitById(id)?.id !== id) fail(id, 'không tra lại được theo id (phiên Ôn tập sẽ bỏ mất mục này)');
}
const flatIds = [
  ...MOJI_QUESTIONS,
  ...BUNPO_QUESTIONS,
  ...TAISAKU_TOPICS.flatMap((topic) => [...topic.exercises, ...topic.words, ...topic.keigo]),
].map((item) => item.id);
if (new Set(flatIds).size !== flatIds.length) fail('id', 'có id trùng nhau');

// ── Tổng kết ─────────────────────────────────────────────────────────────

const wordCount = TAISAKU_TOPICS.reduce((sum, topic) => sum + topic.words.length + topic.keigo.length, 0);
const bookCount = TAISAKU_TOPICS.reduce((sum, topic) => sum + topic.exercises.length, 0);

log(`${c.bold}Kiem tra de luyen N4 (直前対策)${c.reset}`);
log(`  文字・語彙        : ${MOJI_QUESTIONS.length} cau / ${data.MOJI_TESTS.length} de`);
log(`  文法              : ${BUNPO_QUESTIONS.length} cau / ${data.BUNPO_TESTS.length} de`);
log(`  付録              : ${wordCount} tu, ${bookCount} cau bai tap / ${TAISAKU_TOPICS.length} chu de`);
log(`  muc luyen (id)    : ${unique.size}`);
log();
if (problems.length === 0) {
  log(`${c.green}OK: du lieu de luyen N4 day du va dung cu phap.${c.reset}`);
} else {
  for (const problem of problems) log(`${c.red}[LOI] ${problem}${c.reset}`);
  log(`${c.red}${problems.length} van de can sua.${c.reset}`);
  process.exitCode = 1;
}
