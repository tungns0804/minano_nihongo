#!/usr/bin/env node
/**
 * Kiểm tra bộ chấm câu dài (`ignorePunctuation`) đúng như dòng chữ app hứa với
 * người học ở màn luyện tập: "Dấu câu và khoảng trắng không tính khi chấm."
 *
 * Vì sao cần một script riêng: sách in dấu lửng ở cuối rất nhiều câu bỏ lửng
 * (「10分だけ……。」 / "chỉ có 10 phút thôi....") và người học sẽ không gõ lại chúng.
 * Dấu lửng còn nằm giữa câu ("Ừ...m") hay giữa con số ("15.000 yên") — mỗi chỗ hỏng
 * một kiểu khác nhau nên chỉ thử một câu là không đủ.
 *
 * Phần cuối quét TOÀN BỘ câu hội thoại và ví dụ ngữ pháp đã sinh ra, nên bài mới
 * thêm vào cũng được kiểm luôn mà không phải viết thêm ca thử.
 *
 * Chạy: npm run verify:answer
 */

import { readFileSync, readdirSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

// answer-check.ts import "./vocabulary-parser" KHÔNG kèm đuôi file, đúng kiểu của
// Angular/TypeScript. Node thì đòi đuôi, nên thêm ".ts" giúp khi nó không tìm ra.
// Nhờ vậy script chạy thẳng trên file nguồn mà app đang dùng, không phải bản chép lại.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (!specifier.startsWith('.')) throw error;
      return nextResolve(`${specifier}.ts`, context);
    }
  },
});

const { isAnswerCorrect } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'utils', 'answer-check.ts'))
);

// Hai bộ tuỳ chọn y hệt practice-session-store dựng cho câu hội thoại / ngữ pháp.
const JA = { ignoreDiacritics: false, ignoreAllWhitespace: true, ignorePunctuation: true };
const VI = { ignoreDiacritics: false, ignoreAllWhitespace: false, ignorePunctuation: true };

const problems = [];
let checks = 0;

function accepts(answer, typed, options, why) {
  checks++;
  if (!isAnswerCorrect(typed, [answer], options)) {
    problems.push(`${why}\n     đáp án: ${JSON.stringify(answer)}\n     người học gõ: ${JSON.stringify(typed)}`);
  }
}

function rejects(answer, typed, options, why) {
  checks++;
  if (isAnswerCorrect(typed, [answer], options)) {
    problems.push(`${why} — lẽ ra phải chấm SAI\n     đáp án: ${JSON.stringify(answer)}\n     người học gõ: ${JSON.stringify(typed)}`);
  }
}

// ── Dấu ba chấm ───────────────────────────────────────────────────────────
// Ca của bài 33: dấu lửng cuối câu, ở cả hai thứ tiếng.
const ja33 = 'えっ。15,000円ですか。雑誌は 300円だったんですけど……。';
accepts(ja33, 'えっ。15,000円ですか。雑誌は300円だったんですけど。', JA, 'Bỏ dấu lửng cuối câu tiếng Nhật');
accepts(ja33, 'えっ、15000円ですか。雑誌は300円だったんですけど', JA, 'Bỏ luôn cả dấu chấm cuối');
accepts(ja33, 'えっ。15,000円ですか。雑誌は 300円だったんですけど……。', JA, 'Gõ y hệt đáp án');

const vi33 = 'Sao? 15.000 yên ấy à? Quyển tạp chí chỉ có 300 yên thôi mà....';
accepts(vi33, 'Sao? 15.000 yên ấy à? Quyển tạp chí chỉ có 300 yên thôi mà', VI, 'Bỏ dấu lửng cuối câu tiếng Việt');
accepts(vi33, 'Sao? 15.000 yên ấy à? Quyển tạp chí chỉ có 300 yên thôi mà...', VI, 'Gõ 3 chấm thay vì 4');
accepts(vi33, 'Sao 15000 yên ấy à Quyển tạp chí chỉ có 300 yên thôi mà…', VI, 'Bỏ dấu chấm phân cách nghìn');

// Dấu lửng GIỮA câu và GIỮA từ — chỗ xoá dấu câu thành dấu cách sẽ hỏng.
accepts('ちゅうしゃいはん……、どういう 意味ですか。', 'ちゅうしゃいはん、どういう意味ですか。', JA, 'Dấu lửng giữa câu tiếng Nhật');
accepts('Ừ...m, nếu không nhầm thì có quyển sách và cái ô.', 'Ừm, nếu không nhầm thì có quyển sách và cái ô.', VI, 'Dấu lửng chen giữa một từ');
accepts('Ừ...m, nếu không nhầm thì có quyển sách và cái ô.', 'Ừ...m, nếu không nhầm thì có quyển sách và cái ô.', VI, 'Gõ y hệt đáp án có dấu lửng giữa từ');

// Gạch nối trong phiên âm: gõ liền, gõ rời hay gõ đúng gạch đều phải nhận.
const romaji = '"Tachiiri-Kinshi" nghĩa là cấm vào.';
accepts(romaji, 'Tachiiri-Kinshi nghĩa là cấm vào', VI, 'Bỏ ngoặc kép quanh phiên âm');
accepts(romaji, 'Tachiiri Kinshi nghĩa là cấm vào.', VI, 'Gạch nối gõ thành dấu cách');
accepts(romaji, 'TachiiriKinshi nghĩa là cấm vào.', VI, 'Gạch nối gõ liền');

// ── Không được nới tay quá ────────────────────────────────────────────────
// Bỏ dấu câu KHÔNG có nghĩa là bỏ qua chữ sai hay thiếu chữ.
rejects(vi33, 'Sao? 15.000 yên ấy à?', VI, 'Dịch thiếu nửa câu');
rejects(ja33, 'えっ。15,000円ですか。', JA, 'Dịch thiếu nửa câu tiếng Nhật');
rejects('Nhanh lên!', 'Chậm lại!', VI, 'Dịch sai hẳn nghĩa');
rejects('Cửa sổ đóng.', 'Cửa sổ đong.', VI, 'Sai dấu thanh (khi không bật bỏ dấu)');
// Dấu / KHÔNG bị bỏ qua: bài từ vựng dùng nó để ngăn các nghĩa tương đương.
rejects('anh/chị', 'anh chị', VI, 'Dấu / không nằm trong nhóm dấu câu được bỏ qua');

// ── Quét toàn bộ câu đã sinh ra ───────────────────────────────────────────
/**
 * Các kiểu gõ lại một câu mà người học hay dùng — tất cả đều phải được nhận.
 *
 * Bản tiếng Nhật có thêm kiểu "gõ liền": sách in câu có dấu cách để dễ đọc, còn bộ
 * gõ tiếng Nhật thì cho ra câu không dấu cách. Bản tiếng Việt KHÔNG thử kiểu đó —
 * nó không phải cách ai gõ thật, thử vào chỉ khoá cứng thêm hành vi không cần thiết.
 */
function typings(sentence, options) {
  const forms = [
    sentence,
    sentence.replace(/[…‥⋯]+/g, '').replace(/\.{2,}/g, ''), // bỏ hẳn dấu lửng
    sentence.replace(/[…‥⋯]+/g, '...').replace(/\.{3,}/g, '...'), // gõ 3 chấm thường
    sentence.replace(/\s+/g, ' ').trim(), // gộp khoảng trắng thừa
  ];
  if (options === JA) forms.push(sentence.replace(/\s+/g, ''));
  return forms;
}

const lessonsDir = join(ROOT, 'public', 'lessons');
let sentences = 0;

for (const file of readdirSync(lessonsDir).filter((name) => name.endsWith('.json'))) {
  if (file === 'index.json') continue;
  const lesson = JSON.parse(readFileSync(join(lessonsDir, file), 'utf8'));
  const pairs = [];

  for (const line of lesson.lines ?? []) {
    pairs.push([line.japanese, JA], [line.vietnamese, VI]);
  }
  for (const point of lesson.points ?? []) {
    for (const usage of point.usages ?? []) {
      for (const example of usage.examples ?? []) {
        pairs.push([example.japanese, JA], [example.vietnamese, VI]);
      }
    }
  }

  for (const [sentence, options] of pairs) {
    if (!sentence) continue;
    sentences++;
    for (const typed of typings(sentence, options)) {
      // Câu chỉ gồm dấu câu thì gõ kiểu nào cũng thành rỗng — không có gì để chấm.
      if (!typed.trim()) continue;
      accepts(sentence, typed, options, `[${file}] gõ lại câu theo kiểu tự nhiên bị chấm sai`);
    }
  }
}

if (problems.length > 0) {
  process.stdout.write(`Bo cham cau dai co ${problems.length} cho sai:\n`);
  for (const line of problems) process.stdout.write(`  - ${line}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(
    `OK: dau cau va khoang trang khong lam sai ket qua cham ` +
      `(${checks} luot thu tren ${sentences} cau hoi thoai + ngu phap).\n`,
  );
}
