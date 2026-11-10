#!/usr/bin/env node
/**
 * Kiểm tra dữ liệu tab "Trắc nghiệm" của khu Kanji (src/app/core/kanji/kanji-quiz.data.ts).
 *
 * Đề chép tay theo từng bài, và sẽ còn chép thêm. Sai một con số đáp án thì giao diện
 * vẫn chạy bình thường — chỉ là chấm đúng thành sai, nên script soát:
 *
 *  - mỗi câu đúng bốn lựa chọn khác nhau, đáp án nằm trong 1–4;
 *  - đề có ĐÚNG MỘT phần 〈gạch chân〉, cú pháp furigana đúng;
 *  - 問題1 gạch chân chữ có kanji và lựa chọn toàn kana; 問題2 ngược lại;
 *  - có nghĩa tiếng Việt cho từng câu;
 *  - không hai bài trùng cấp + số bài, id câu không trùng và tra lại được theo id
 *    (id là khoá ★ và khoá lịch ôn);
 *  - đáp án của một 問題 không dồn hết vào cùng một vị trí (đề tự soạn dễ mắc: chép
 *    đáp án đúng lên đầu rồi quên xáo);
 *  - danh sách "chữ & từ cần học": chữ có ở khu Kanji với đúng id (link không gãy),
 *    âm On / Kun là kana, mỗi từ có chứa chữ đó và cách đọc là kana.
 *
 * Chạy: npm run verify:kanji-quiz
 */

import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { c, log, resolveTsImports } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const KANJI = join(ROOT, 'src', 'app', 'core', 'kanji');

// kanji-quiz.ts import "./kanji-quiz.data" không kèm đuôi file.
resolveTsImports();

const { KANJI_QUIZ_DATA } = await import(pathToFileURL(join(KANJI, 'kanji-quiz.data.ts')));
const { KANJI_QUIZ_SETS, kanjiQuizQuestionById } = await import(pathToFileURL(join(KANJI, 'kanji-quiz.ts')));
// Dựng lại danh sách chữ từ file sinh ra: `kanji-entries.ts` lẫn tên kiểu trong import giá
// trị nên --experimental-strip-types không nạp được.
const { KANJI_SEEDS } = await import(pathToFileURL(join(KANJI, 'kanji-words.generated.ts')));
const { buildKanjiEntries } = await import(pathToFileURL(join(KANJI, 'kanji.model.ts')));
const ENTRY_BY_CHAR = new Map(buildKanjiEntries(KANJI_SEEDS).map((entry) => [entry.char, entry]));
const kanjiByChar = (char) => ENTRY_BY_CHAR.get(char) ?? null;
const { markupProblems, plainText } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'translation', 'markup.ts'))
);

const problems = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);

const KANA_ONLY = /^[぀-ゟ゠-ヿー]+$/;
/** Âm Kun ghi kèm dấu ・ tách okurigana (ひろ・い). */
const KANA_WITH_DOT = /^[぀-ゟ゠-ヿー・]+$/;
const HAS_KANJI = /[一-鿿々]/;

function checkItem(where, [prompt, options, answer, meaning], kind) {
  for (const problem of markupProblems(prompt)) fail(where, `cú pháp: ${problem} — ${prompt}`);

  const marks = prompt.match(/〈[^〉]*〉/g) ?? [];
  if (marks.length !== 1) fail(where, `cần đúng một phần 〈gạch chân〉, có ${marks.length} — ${prompt}`);
  const target = plainText(marks[0]?.slice(1, -1) ?? '');

  if (options.length !== 4) fail(where, `cần 4 lựa chọn, có ${options.length}`);
  if (new Set(options).size !== options.length) fail(where, `lựa chọn trùng nhau: ${options.join(' / ')}`);
  if (!Number.isInteger(answer) || answer < 1 || answer > options.length) {
    fail(where, `đáp án ${answer} ngoài 1–${options.length}`);
  }
  if (!meaning?.trim()) fail(where, 'thiếu nghĩa tiếng Việt');

  // 問題1 hỏi cách đọc: gạch chân chữ Hán, lựa chọn là kana. 問題2 ngược lại. Lẫn hai
  // phần thì nhãn câu hỏi ("đọc thế nào?" / "viết thế nào?") nói sai.
  if (kind === 'reading') {
    if (!HAS_KANJI.test(target)) fail(where, `問題1 phải gạch chân chữ Hán, đang là "${target}"`);
    for (const option of options) {
      if (!KANA_ONLY.test(option)) fail(where, `問題1: lựa chọn "${option}" phải toàn kana`);
    }
  } else {
    if (!KANA_ONLY.test(target)) fail(where, `問題2 phải gạch chân chữ kana, đang là "${target}"`);
    for (const option of options) {
      if (!HAS_KANJI.test(option)) fail(where, `問題2: lựa chọn "${option}" phải có chữ Hán`);
    }
  }
}

function checkStudy(where, { char, hanViet, on, kun, words }) {
  const entry = kanjiByChar(char);
  if (!entry) fail(where, 'chữ không có ở khu Kanji — link tới trang chữ sẽ gãy');
  else if (entry.hanViet !== hanViet) fail(where, `âm Hán Việt "${hanViet}" khác khu Kanji ("${entry.hanViet}") — link sẽ gãy`);
  if (on.length + kun.length === 0) fail(where, 'thiếu cả âm On lẫn âm Kun');
  for (const reading of [...on, ...kun]) {
    if (!KANA_WITH_DOT.test(reading)) fail(where, `âm "${reading}" phải là kana`);
  }
  if (words.length === 0) fail(where, 'chưa có từ nào');
  for (const [word, reading, meaning, sound] of words) {
    if (!word.includes(char)) fail(where, `từ "${word}" không chứa chữ ${char}`);
    if (!KANA_ONLY.test(reading)) fail(where, `cách đọc "${reading}" của ${word} phải là kana`);
    if (!meaning?.trim()) fail(where, `${word} thiếu nghĩa`);
    if (sound !== 'on' && sound !== 'kun') fail(where, `${word}: âm phải là 'on' hoặc 'kun'`);
  }
}

const lessons = new Set();
let count = 0;
for (const quiz of KANJI_QUIZ_DATA) {
  const name = `${quiz.level} bài ${quiz.lesson}${quiz.part ? ` phần ${quiz.part}` : ''}`;
  if (lessons.has(name)) fail(name, 'trùng bài với một mục khác');
  lessons.add(name);
  if (quiz.reading.length + quiz.writing.length === 0) fail(name, 'bài không có câu nào');
  quiz.reading.forEach((item, at) => checkItem(`${name} 問題1-${at + 1}`, item, 'reading'));
  quiz.writing.forEach((item, at) => checkItem(`${name} 問題2-${at + 1}`, item, 'writing'));
  for (const [label, items] of [['問題1', quiz.reading], ['問題2', quiz.writing]]) {
    const positions = new Set(items.map((item) => item[2]));
    if (items.length >= 4 && positions.size === 1) {
      fail(`${name} ${label}`, `mọi đáp án đều ở vị trí ${[...positions][0]} — xáo lại lựa chọn`);
    }
  }
  for (const study of quiz.study ?? []) checkStudy(`${name} chữ ${study.char}`, study);
  count += quiz.reading.length + quiz.writing.length;
}

const ids = new Set();
for (const set of KANJI_QUIZ_SETS) {
  for (const question of set.questions) {
    if (ids.has(question.id)) fail(question.id, 'trùng id câu');
    ids.add(question.id);
    if (kanjiQuizQuestionById(question.id) !== question) {
      fail(question.id, 'không tra lại được theo id (phiên Ôn tập sẽ bỏ mất câu này)');
    }
    if (!question.answer) fail(question.id, 'không lấy được chữ của đáp án');
  }
}

log(`${c.bold}Kiem tra trac nghiem Kanji theo bai${c.reset}`);
if (problems.length > 0) {
  for (const problem of problems) log(`${c.red}[LOI] ${problem}${c.reset}`);
  log(`${c.red}${problems.length} loi.${c.reset}`);
  process.exitCode = 1;
} else {
  log(`${c.green}OK: ${KANJI_QUIZ_DATA.length} bai, ${count} cau deu hop le.${c.reset}`);
}
