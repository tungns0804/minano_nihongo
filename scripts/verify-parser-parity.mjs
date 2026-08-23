#!/usr/bin/env node
/**
 * Kiểm tra hai bản parser sinh ra KẾT QUẢ GIỐNG HỆT NHAU:
 *   - scripts/vocab-core.mjs                       (dùng bởi npm run generate)
 *   - src/app/core/utils/vocabulary-parser.ts      (dùng bởi màn hình "Nạp bài mới")
 *
 * Id của từ vựng được băm từ nội dung, và Favorite lưu theo id đó. Nếu hai bản lệch
 * nhau thì cùng một bài học nạp bằng hai đường sẽ có id khác nhau và Favorite mất tác dụng.
 *
 * Chạy: npm run verify:parser
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as nodeParser from './vocab-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const tsParser = await import(
  pathToFileUrl(join(ROOT, 'src', 'app', 'core', 'utils', 'vocabulary-parser.ts'))
);

function pathToFileUrl(path) {
  return new URL(`file:///${path.replace(/\\/g, '/')}`).href;
}

/** Các trường hợp dễ làm hai bản lệch nhau nhất. */
const SAMPLES = [
  'ĐÀO,逃げます,chạy trốn/ bỏ chạy',
  'XA CHÚ Ý,車に注意します,chú ý ô tô',
  '  TỊCH  ,  席  ,  chỗ ngồi/ ghế  ',
  'LỆ,例えば,ví dụ',
  'A,あ,nghĩa có, dấu phẩy, bên trong',
  'B\tい\tcách nhau bằng TAB',
  '# dòng ghi chú bị bỏ qua',
  '',
  'C,う',
  'D,,thiếu cột tiếng Nhật',
  'ĐÀO,逃げます,trùng với dòng đầu',
  // Câu ví dụ sau dấu |
  'E,え,nghĩa có ví dụ|例文です。',
  // Nghĩa CHỨA DẤU PHẨY và có cả ví dụ — đây là ca dễ hỏng nhất
  'F,お,nghĩa a, nghĩa b|これは例です。',
  // Dán từ Excel: cột thứ 4 là ví dụ
  'G	か	nghĩa bằng TAB	例文もTAB。',
  // Cách đọc trong ngoặc ở cuối cột tiếng Nhật
  'H,見ます (みます),xem',
  // Ngoặc toàn chiều do bộ gõ tiếng Nhật sinh ra
  'I,新聞社（しんぶんしゃ）,toà soạn báo',
  // Có đủ cả cách đọc, nghĩa chứa dấu phẩy, lẫn câu ví dụ
  'J,缶 (かん),lon, hộp thiếc|空き缶を捨てます。',
  // Ô chỉ gồm ngoặc: KHÔNG được coi là có cách đọc, nếu không từ sẽ thành rỗng
  'K,(く),chỉ có ngoặc',
];

const raw = SAMPLES.join('\n');
const fromNode = nodeParser.parseVocabulary(raw);
const fromTs = tsParser.parseVocabulary(raw);

const problems = [];

if (JSON.stringify(fromNode.words) !== JSON.stringify(fromTs.words)) {
  problems.push('Danh sách từ vựng khác nhau:');
  problems.push(`  node: ${JSON.stringify(fromNode.words)}`);
  problems.push(`  ts  : ${JSON.stringify(fromTs.words)}`);
}

if (JSON.stringify(fromNode.issues) !== JSON.stringify(fromTs.issues)) {
  problems.push('Danh sách cảnh báo/lỗi khác nhau:');
  problems.push(`  node: ${JSON.stringify(fromNode.issues)}`);
  problems.push(`  ts  : ${JSON.stringify(fromTs.issues)}`);
}

// ── Cột câu ví dụ ────────────────────────────────────────────────────────
const byJapanese = new Map(fromNode.words.map((w) => [w.japanese, w]));

if (byJapanese.get('え')?.example !== '例文です。') {
  problems.push(`Ví dụ sau dấu | phải được tách ra, nhận được "${byJapanese.get('え')?.example}"`);
}
if (byJapanese.get('え')?.vietnamese !== 'nghĩa có ví dụ') {
  problems.push(`Nghĩa phải bỏ phần ví dụ, nhận được "${byJapanese.get('え')?.vietnamese}"`);
}

// Ca quan trọng nhất: nghĩa chứa dấu phẩy KHÔNG được bị cắt nhầm thành ví dụ.
if (byJapanese.get('お')?.vietnamese !== 'nghĩa a, nghĩa b') {
  problems.push(
    `Nghĩa chứa dấu phẩy phải giữ nguyên khi có ví dụ, nhận được "${byJapanese.get('お')?.vietnamese}"`,
  );
}
if (byJapanese.get('お')?.example !== 'これは例です。') {
  problems.push(`Ví dụ sau nghĩa có dấu phẩy bị sai: "${byJapanese.get('お')?.example}"`);
}

// Dán bằng TAB: cột thứ 4 là ví dụ.
if (byJapanese.get('か')?.example !== '例文もTAB。') {
  problems.push(`Cột thứ 4 khi dán bằng TAB phải là ví dụ, nhận được "${byJapanese.get('か')?.example}"`);
}

// Dòng không có ví dụ thì example phải là chuỗi rỗng, không phải undefined.
if (byJapanese.get('逃げます')?.example !== '') {
  problems.push(
    `Từ không có ví dụ phải cho example = "" , nhận được ${JSON.stringify(byJapanese.get('逃げます')?.example)}`,
  );
}

// ── Cột cách đọc ─────────────────────────────────────────────────────────
if (byJapanese.get('見ます')?.reading !== 'みます') {
  problems.push(
    `Cách đọc trong ngoặc phải tách ra, nhận được ${JSON.stringify(byJapanese.get('見ます')?.reading)}`,
  );
}
if (byJapanese.get('新聞社')?.reading !== 'しんぶんしゃ') {
  problems.push(
    `Ngoặc toàn chiều （） cũng phải nhận, nhận được ${JSON.stringify(byJapanese.get('新聞社')?.reading)}`,
  );
}
// Ca dễ hỏng nhất: cách đọc + nghĩa chứa dấu phẩy + ví dụ trên cùng một dòng.
const kan = byJapanese.get('缶');
if (kan?.reading !== 'かん' || kan?.vietnamese !== 'lon, hộp thiếc' || kan?.example !== '空き缶を捨てます。') {
  problems.push(`Dòng có đủ cách đọc + nghĩa có dấu phẩy + ví dụ bị tách sai: ${JSON.stringify(kan)}`);
}
// Từ không khai báo cách đọc phải cho chuỗi rỗng, không phải undefined.
if (byJapanese.get('逃げます')?.reading !== '') {
  problems.push(
    `Từ không có cách đọc phải cho reading = "", nhận được ${JSON.stringify(byJapanese.get('逃げます')?.reading)}`,
  );
}
// Ô chỉ gồm ngoặc thì giữ nguyên, tránh biến cột tiếng Nhật thành rỗng.
if (byJapanese.get('(く)')?.reading !== '') {
  problems.push('Ô chỉ gồm ngoặc không được coi là cách đọc');
}
// Cách đọc KHÔNG được nằm trong khoá sinh id, nếu không thêm cách đọc là mất ★.
if (byJapanese.get('見ます')?.id !== nodeParser.hashId('見ます|H')) {
  problems.push('Id phải băm từ "tiếng Nhật|âm Hán Việt" đã bỏ phần cách đọc');
}

for (const value of ['ĐÀO|逃げます', 'a', '', '席|TỊCH', 'Minna no Nihongo']) {
  const a = nodeParser.hashId(value);
  const b = tsParser.hashId(value);
  if (a !== b) problems.push(`hashId("${value}"): node=${a} ts=${b}`);
}

for (const value of ['Minna no Nihongo - Bài 33', 'ĐÀO', 'Bài  34 __ test']) {
  const a = nodeParser.slugify(value);
  const b = tsParser.slugify(value);
  if (a !== b) problems.push(`slugify("${value}"): node="${a}" ts="${b}"`);
}

// ── Parser động từ ────────────────────────────────────────────────────────
const VERB_SAMPLES = [
  'ĐÀO,逃げます,chạy trốn,2',
  'THỦ,守ります,bảo vệ/ giữ,1',
  'QUY,帰ります,về nhà,1*',
  'VI,します,làm,3',
  '  LAI  ,  来ます  ,  đến  ,  3  ',
  'A,あります,có, đồ vật,1',
  'B\tいます\tcó, người\t2',
  '# ghi chú bị bỏ qua',
  '',
  'C,行く,thiếu thể ます,1',
  'D,行きます,nhóm sai,9',
  'E,行きます,thiếu cột',
  'ĐÀO,逃げます,trùng dòng đầu,2',
];

const verbRaw = VERB_SAMPLES.join('\n');
const verbsFromNode = nodeParser.parseVerbList(verbRaw);
const verbsFromTs = tsParser.parseVerbList(verbRaw);

if (JSON.stringify(verbsFromNode.verbs) !== JSON.stringify(verbsFromTs.verbs)) {
  problems.push('Danh sách động từ khác nhau:');
  problems.push(`  node: ${JSON.stringify(verbsFromNode.verbs)}`);
  problems.push(`  ts  : ${JSON.stringify(verbsFromTs.verbs)}`);
}

if (JSON.stringify(verbsFromNode.issues) !== JSON.stringify(verbsFromTs.issues)) {
  problems.push('Cảnh báo/lỗi của parser động từ khác nhau:');
  problems.push(`  node: ${JSON.stringify(verbsFromNode.issues)}`);
  problems.push(`  ts  : ${JSON.stringify(verbsFromTs.issues)}`);
}

// Kiểm tra vài hành vi cụ thể của parser động từ.
const byMasu = new Map(verbsFromNode.verbs.map((v) => [v.masu, v]));
if (byMasu.get('帰ります')?.deceptive !== true) {
  problems.push('Dấu * sau số nhóm phải đánh dấu deceptive = true');
}
if (byMasu.get('逃げます')?.deceptive !== false) {
  problems.push('Không có dấu * thì deceptive phải là false');
}
if (byMasu.get('あります')?.vietnamese !== 'có, đồ vật') {
  problems.push(
    `Nghĩa chứa dấu phẩy phải giữ nguyên, nhận được "${byMasu.get('あります')?.vietnamese}"`,
  );
}
if (byMasu.get('います')?.vietnamese !== 'có, người') {
  problems.push('Dòng dùng TAB phải tách đúng cột');
}
if (verbsFromNode.issues.filter((i) => i.level === 'error').length !== 3) {
  problems.push(
    `Cần đúng 3 dòng lỗi (thiếu ます, nhóm sai, thiếu cột), nhận được ` +
      `${verbsFromNode.issues.filter((i) => i.level === 'error').length}`,
  );
}

// ── Parser hội thoại ──────────────────────────────────────────────────────
const CONV_SAMPLES = [
  '## Hội thoại',
  '管理人|ミラーさん、荷物は 片づきましたか。|Anh Miller, đồ đạc đã dọn xong chưa?',
  'あしたから 旅行なんです。|Từ ngày mai tôi sẽ đi du lịch.',
  '# ghi chú bị bỏ qua',
  '',
  // Câu chứa dấu phẩy ở CẢ HAI thứ tiếng — ca chính để chọn dấu | thay dấu phẩy
  'ミラー|はい、だいたい 片づきました。|Vâng, phần lớn là xong rồi, cảm ơn bác.',
  'thiếu vế thứ hai',
  '|câu tiếng Nhật rỗng',
  '管理人|ミラーさん、荷物は 片づきましたか。|Trùng dòng đầu',
];

const convRaw = CONV_SAMPLES.join('\n');
const convNode = nodeParser.parseConversation(convRaw);
const convTs = tsParser.parseConversation(convRaw);

if (JSON.stringify(convNode.lines) !== JSON.stringify(convTs.lines)) {
  problems.push('Danh sách câu hội thoại khác nhau:');
  problems.push(`  node: ${JSON.stringify(convNode.lines)}`);
  problems.push(`  ts  : ${JSON.stringify(convTs.lines)}`);
}
if (JSON.stringify(convNode.issues) !== JSON.stringify(convTs.issues)) {
  problems.push('Cảnh báo/lỗi của parser hội thoại khác nhau:');
  problems.push(`  node: ${JSON.stringify(convNode.issues)}`);
  problems.push(`  ts  : ${JSON.stringify(convTs.issues)}`);
}

const byJp = new Map(convNode.lines.map((l) => [l.japanese, l]));
const withSpeaker = byJp.get('ミラーさん、荷物は 片づきましたか。');
if (withSpeaker?.speaker !== '管理人') {
  problems.push(`Dòng 3 vế phải tách được người nói, nhận được ${JSON.stringify(withSpeaker?.speaker)}`);
}
if (withSpeaker?.section !== 'Hội thoại') {
  problems.push(`Tiêu đề ## phải gán vào các dòng sau nó, nhận được ${JSON.stringify(withSpeaker?.section)}`);
}
// Ca quan trọng nhất: dấu phẩy trong CẢ hai câu không được cắt nhầm.
const commaLine = byJp.get('はい、だいたい 片づきました。');
if (commaLine?.vietnamese !== 'Vâng, phần lớn là xong rồi, cảm ơn bác.') {
  problems.push(`Câu chứa dấu phẩy bị cắt sai: ${JSON.stringify(commaLine?.vietnamese)}`);
}
// Dòng 2 vế thì người nói phải rỗng, không phải undefined.
if (byJp.get('あしたから 旅行なんです。')?.speaker !== '') {
  problems.push('Dòng 2 vế phải cho speaker = ""');
}
if (convNode.issues.filter((i) => i.level === 'error').length !== 2) {
  problems.push(
    `Cần đúng 2 dòng lỗi (thiếu vế, câu tiếng Nhật rỗng), nhận được ` +
      `${convNode.issues.filter((i) => i.level === 'error').length}`,
  );
}
if (convNode.issues.filter((i) => i.level === 'warning').length !== 1) {
  problems.push('Dòng trùng phải cho đúng 1 cảnh báo');
}

// Id trong file JSON đã sinh phải khớp với id mà bản TS tính lại từ chính nội dung đó.
const lessonFile = join(ROOT, 'public', 'lessons', 'minano-nihongo-33.json');
try {
  const lesson = JSON.parse(readFileSync(lessonFile, 'utf8'));
  for (const word of lesson.words) {
    const expected = tsParser.hashId(`${word.japanese}|${word.hanViet}`);
    if (word.id !== expected) {
      problems.push(`JSON đã sinh: id "${word.id}" của ${word.japanese} lẽ ra phải là "${expected}"`);
    }
  }
} catch {
  // Chưa chạy generate thì bỏ qua phần kiểm tra này.
}

if (problems.length > 0) {
  process.stdout.write('KHONG KHOP giua hai ban parser:\n');
  for (const line of problems) process.stdout.write(`  ${line}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `OK: hai ban parser cho ket qua giong het nhau ` +
      `(tu vung: ${fromNode.words.length} tu / ${fromNode.issues.length} canh bao, ` +
      `dong tu: ${verbsFromNode.verbs.length} tu / ${verbsFromNode.issues.length} canh bao).\n`,
  );
}
