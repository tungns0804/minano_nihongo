#!/usr/bin/env node
/**
 * Kiểm tra engine chia động từ (src/app/core/japanese/conjugation.ts).
 *
 * Gồm hai phần:
 *  1. Bộ ca kiểm thử cố định — đối chiếu với cách chia chuẩn của giáo trình.
 *  2. Quét toàn bộ bài động từ đã sinh trong public/lessons, báo động từ nào
 *     engine không chia được (thường là do khai báo sai nhóm).
 *
 * Chạy: npm run verify:conjugation
 * Cần Node 22+ (dùng --experimental-strip-types để nạp thẳng file .ts).
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const LESSONS_DIR = join(ROOT, 'public', 'lessons');

const toFileUrl = (path) => new URL(`file:///${path.replace(/\\/g, '/')}`).href;
const { conjugate } = await import(
  toFileUrl(join(ROOT, 'src', 'app', 'core', 'japanese', 'conjugation.ts'))
);

const USE_COLOR = process.stdout.isTTY === true && !process.env['NO_COLOR'];
const ESC = String.fromCharCode(27);
const ansi = (code) => (USE_COLOR ? `${ESC}[${code}m` : '');
const c = { reset: ansi(0), bold: ansi(1), dim: ansi(2), red: ansi(31), green: ansi(32) };
const log = (msg = '') => process.stdout.write(`${msg}\n`);

let failures = 0;

/** [thể ます, nhóm, từ điển, te, ta, nai] */
const CASES = [
  // ── Nhóm 2 (一段) ─────────────────────────────────────────────────────
  ['逃げます', 2, '逃げる', '逃げて', '逃げた', '逃げない'],
  ['投げます', 2, '投げる', '投げて', '投げた', '投げない'],
  ['伝えます', 2, '伝える', '伝えて', '伝えた', '伝えない'],
  ['上げます', 2, '上げる', '上げて', '上げた', '上げない'],
  ['食べます', 2, '食べる', '食べて', '食べた', '食べない'],
  ['見ます', 2, '見る', '見て', '見た', '見ない'],
  ['起きます', 2, '起きる', '起きて', '起きた', '起きない'],
  ['寝ます', 2, '寝る', '寝て', '寝た', '寝ない'],

  // ── Nhóm 1 (五段), đủ 9 âm cuối ───────────────────────────────────────
  ['書きます', 1, '書く', '書いて', '書いた', '書かない'], // き -> いて
  ['泳ぎます', 1, '泳ぐ', '泳いで', '泳いだ', '泳がない'], // ぎ -> いで
  ['話します', 1, '話す', '話して', '話した', '話さない'], // し -> して
  ['待ちます', 1, '待つ', '待って', '待った', '待たない'], // ち -> って
  ['死にます', 1, '死ぬ', '死んで', '死んだ', '死なない'], // に -> んで
  ['遊びます', 1, '遊ぶ', '遊んで', '遊んだ', '遊ばない'], // び -> んで
  ['飲みます', 1, '飲む', '飲んで', '飲んだ', '飲まない'], // み -> んで
  ['守ります', 1, '守る', '守って', '守った', '守らない'], // り -> って
  ['買います', 1, '買う', '買って', '買った', '買わない'], // い -> わない (KHÔNG phải 買あない)
  ['騒ぎます', 1, '騒ぐ', '騒いで', '騒いだ', '騒がない'],
  ['打ちます', 1, '打つ', '打って', '打った', '打たない'],

  // ── Nhóm 1 nhìn giống nhóm 2 (động từ đặc biệt) ───────────────────────
  ['帰ります', 1, '帰る', '帰って', '帰った', '帰らない'],
  ['入ります', 1, '入る', '入って', '入った', '入らない'],
  ['走ります', 1, '走る', '走って', '走った', '走らない'],
  ['切ります', 1, '切る', '切って', '切った', '切らない'],
  ['知ります', 1, '知る', '知って', '知った', '知らない'],
  ['要ります', 1, '要る', '要って', '要った', '要らない'],

  // ── Bất quy tắc ───────────────────────────────────────────────────────
  ['行きます', 1, '行く', '行って', '行った', '行かない'], // KHÔNG phải 行いて
  ['いきます', 1, 'いく', 'いって', 'いった', 'いかない'],
  ['あります', 1, 'ある', 'あって', 'あった', 'ない'], // KHÔNG phải あらない

  // ── Nhóm 3 ────────────────────────────────────────────────────────────
  ['します', 3, 'する', 'して', 'した', 'しない'],
  ['勉強します', 3, '勉強する', '勉強して', '勉強した', '勉強しない'],
  ['結婚します', 3, '結婚する', '結婚して', '結婚した', '結婚しない'],
  ['利用します', 3, '利用する', '利用して', '利用した', '利用しない'],
  ['来ます', 3, '来る', '来て', '来た', '来ない'],
  ['きます', 3, 'くる', 'きて', 'きた', 'こない'],
  ['持って来ます', 3, '持って来る', '持って来て', '持って来た', '持って来ない'],
];

/** Những trường hợp engine PHẢI từ chối, thường do khai báo sai nhóm. */
const SHOULD_FAIL = [
  ['逃げる', 2, 'không ở thể ます'],
  ['逃げます', 1, 'gốc "逃げ" không phải âm hàng い nên không thể là nhóm 1'],
  ['食べます', 1, 'gốc "食べ" không phải âm hàng い nên không thể là nhóm 1'],
  ['ます', 2, 'thiếu phần gốc'],
  ['守ります', 3, 'nhóm 3 không nhận dạng này'],
];

log(`${c.bold}Kiem tra engine chia dong tu${c.reset}`);
log();

for (const [masu, group, dictionary, te, ta, nai] of CASES) {
  const result = conjugate(masu, group);
  if (!result.ok) {
    log(`${c.red}[LOI] ${masu} (nhom ${group}): engine tu choi - ${result.reason}${c.reset}`);
    failures++;
    continue;
  }

  const expected = { dictionary, te, ta, nai };
  const wrong = Object.entries(expected).filter(([key, value]) => result.forms[key] !== value);

  if (wrong.length > 0) {
    log(`${c.red}[LOI] ${masu} (nhom ${group}):${c.reset}`);
    for (const [key, value] of wrong) {
      log(`${c.red}      ${key}: nhan "${result.forms[key]}", can "${value}"${c.reset}`);
    }
    failures++;
  }

  if (result.forms.masu !== masu) {
    log(`${c.red}[LOI] ${masu}: the masu bi doi thanh "${result.forms.masu}"${c.reset}`);
    failures++;
  }
}

for (const [masu, group, why] of SHOULD_FAIL) {
  const result = conjugate(masu, group);
  if (result.ok) {
    log(`${c.red}[LOI] "${masu}" nhom ${group} le ra phai bi tu choi (${why}), nhung engine chia ra:${c.reset}`);
    log(`${c.red}      ${JSON.stringify(result.forms)}${c.reset}`);
    failures++;
  }
}

log(
  failures === 0
    ? `${c.green}OK: ${CASES.length} ca chia dung, ${SHOULD_FAIL.length} ca sai bi tu choi dung.${c.reset}`
    : `${c.red}${failures} ca that bai.${c.reset}`,
);

// ── Quét dữ liệu thật ────────────────────────────────────────────────────
log();
log(`${c.bold}Kiem tra du lieu bai dong tu da sinh${c.reset}`);

if (!existsSync(LESSONS_DIR)) {
  log(`${c.dim}Chua co public/lessons, bo qua.${c.reset}`);
} else {
  const files = readdirSync(LESSONS_DIR).filter((n) => n.endsWith('.json') && n !== 'index.json');
  let checked = 0;
  let dataProblems = 0;

  for (const file of files) {
    const lesson = JSON.parse(readFileSync(join(LESSONS_DIR, file), 'utf8'));
    if (lesson.kind !== 'verb' || !Array.isArray(lesson.verbs)) continue;

    for (const verb of lesson.verbs) {
      checked++;
      const result = conjugate(verb.masu, verb.group);
      if (!result.ok) {
        log(`${c.red}[LOI] ${file} - ${verb.masu} (nhom ${verb.group}): ${result.reason}${c.reset}`);
        dataProblems++;
      }
    }
  }

  if (checked === 0) {
    log(`${c.dim}Chua co bai dong tu nao.${c.reset}`);
  } else if (dataProblems === 0) {
    log(`${c.green}OK: ${checked} dong tu trong du lieu deu chia duoc.${c.reset}`);
  } else {
    failures += dataProblems;
  }
}

process.exitCode = failures === 0 ? 0 : 1;
