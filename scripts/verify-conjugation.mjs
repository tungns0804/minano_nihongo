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
import { c, log } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const LESSONS_DIR = join(ROOT, 'public', 'lessons');

const toFileUrl = (path) => new URL(`file:///${path.replace(/\\/g, '/')}`).href;
const { conjugate } = await import(
  toFileUrl(join(ROOT, 'src', 'app', 'core', 'japanese', 'conjugation.ts'))
);

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

/**
 * Tám thể mở rộng: [thể ます, nhóm, ば, ý chí, mệnh lệnh, cấm chỉ, khả năng, bị động,
 * sai khiến, bị động sai khiến]. Đối chiếu với bảng chia của sách N4/N3.
 */
const EXTENDED_CASES = [
  // ── Nhóm 1, đủ 9 âm cuối ─────────────────────────────────────────────
  ['書きます', 1, '書けば', '書こう', '書け', '書くな', '書ける', '書かれる', '書かせる', '書かせられる'],
  ['泳ぎます', 1, '泳げば', '泳ごう', '泳げ', '泳ぐな', '泳げる', '泳がれる', '泳がせる', '泳がせられる'],
  ['話します', 1, '話せば', '話そう', '話せ', '話すな', '話せる', '話される', '話させる', '話させられる'],
  ['待ちます', 1, '待てば', '待とう', '待て', '待つな', '待てる', '待たれる', '待たせる', '待たせられる'],
  ['死にます', 1, '死ねば', '死のう', '死ね', '死ぬな', '死ねる', '死なれる', '死なせる', '死なせられる'],
  ['遊びます', 1, '遊べば', '遊ぼう', '遊べ', '遊ぶな', '遊べる', '遊ばれる', '遊ばせる', '遊ばせられる'],
  ['飲みます', 1, '飲めば', '飲もう', '飲め', '飲むな', '飲める', '飲まれる', '飲ませる', '飲ませられる'],
  ['帰ります', 1, '帰れば', '帰ろう', '帰れ', '帰るな', '帰れる', '帰られる', '帰らせる', '帰らせられる'],
  // い -> わ ở bị động/sai khiến (買われる), い -> え ở ば/khả năng (買える).
  ['買います', 1, '買えば', '買おう', '買え', '買うな', '買える', '買われる', '買わせる', '買わせられる'],
  ['行きます', 1, '行けば', '行こう', '行け', '行くな', '行ける', '行かれる', '行かせる', '行かせられる'],
  // Kính ngữ: mệnh lệnh là ～い, không phải ～れ.
  ['いらっしゃいます', 1, 'いらっしゃれば', 'いらっしゃろう', 'いらっしゃい', 'いらっしゃるな', 'いらっしゃれる', 'いらっしゃられる', 'いらっしゃらせる', 'いらっしゃらせられる'],
  ['くださいます', 1, 'くだされば', 'くださろう', 'ください', 'くださるな', 'くだされる', 'くださられる', 'くださらせる', 'くださらせられる'],

  // ── Nhóm 2: khả năng = bị động = ～られる ────────────────────────────
  ['食べます', 2, '食べれば', '食べよう', '食べろ', '食べるな', '食べられる', '食べられる', '食べさせる', '食べさせられる'],
  ['見ます', 2, '見れば', '見よう', '見ろ', '見るな', '見られる', '見られる', '見させる', '見させられる'],

  // ── Nhóm 3 ────────────────────────────────────────────────────────────
  ['します', 3, 'すれば', 'しよう', 'しろ', 'するな', 'できる', 'される', 'させる', 'させられる'],
  ['勉強します', 3, '勉強すれば', '勉強しよう', '勉強しろ', '勉強するな', '勉強できる', '勉強される', '勉強させる', '勉強させられる'],
  ['来ます', 3, '来れば', '来よう', '来い', '来るな', '来られる', '来られる', '来させる', '来させられる'],
  ['きます', 3, 'くれば', 'こよう', 'こい', 'くるな', 'こられる', 'こられる', 'こさせる', 'こさせられる'],
  ['持って来ます', 3, '持って来れば', '持って来よう', '持って来い', '持って来るな', '持って来られる', '持って来られる', '持って来させる', '持って来させられる'],
];

/** Cách viết khác phải được chấp nhận: [thể ます, nhóm, thể, các cách viết khác]. */
const ALTERNATE_CASES = [
  ['書きます', 1, 'causativePassive', ['書かされる']],
  ['待ちます', 1, 'causativePassive', ['待たされる']],
  ['買います', 1, 'causativePassive', ['買わされる']],
  // Đuôi す không có dạng rút gọn: 話さされる là sai.
  ['話します', 1, 'causativePassive', []],
  ['食べます', 2, 'causativePassive', []],
  ['勉強します', 3, 'imperative', ['勉強せよ']],
];

const EXTENDED_KEYS = [
  'ba',
  'volitional',
  'imperative',
  'prohibitive',
  'potential',
  'passive',
  'causative',
  'causativePassive',
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

for (const [masu, group, ...expectedForms] of EXTENDED_CASES) {
  const result = conjugate(masu, group);
  if (!result.ok) {
    log(`${c.red}[LOI] ${masu} (nhom ${group}): engine tu choi - ${result.reason}${c.reset}`);
    failures++;
    continue;
  }
  const wrong = EXTENDED_KEYS.filter((key, index) => result.forms[key] !== expectedForms[index]);
  if (wrong.length > 0) {
    log(`${c.red}[LOI] ${masu} (nhom ${group}):${c.reset}`);
    for (const key of wrong) {
      const value = expectedForms[EXTENDED_KEYS.indexOf(key)];
      log(`${c.red}      ${key}: nhan "${result.forms[key]}", can "${value}"${c.reset}`);
    }
    failures++;
  }
}

for (const [masu, group, form, expected] of ALTERNATE_CASES) {
  const result = conjugate(masu, group);
  const got = result.ok ? [...(result.alternates[form] ?? [])] : null;
  if (JSON.stringify(got) !== JSON.stringify(expected)) {
    log(`${c.red}[LOI] ${masu} ${form}: cach viet khac la ${JSON.stringify(got)}, can ${JSON.stringify(expected)}${c.reset}`);
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
    ? `${c.green}OK: ${CASES.length} ca the co ban, ${EXTENDED_CASES.length} ca the mo rong, ` +
        `${ALTERNATE_CASES.length} ca cach viet khac, ${SHOULD_FAIL.length} ca sai bi tu choi dung.${c.reset}`
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

// ── Quét dữ liệu hai bài tập ─────────────────────────────────────────────
// Dữ liệu này nằm thẳng trong mã nguồn (src/app/core/exercises/) chứ không đi qua
// public/lessons, nên vòng quét ở trên không đụng tới. Mà đây lại là chỗ dễ sai
// nhất: gõ nhầm một chữ kana trong cột cách đọc thì đáp án gõ bằng kana sẽ bị
// chấm sai giữa buổi luyện, không có gì báo trước.
log();
log(`${c.bold}Kiem tra du lieu bai tap (tu/tha dong tu, chuyen the)${c.reset}`);

const EXERCISES_DIR = join(ROOT, 'src', 'app', 'core', 'exercises');
const { EXERCISE_VERBS, NON_VOLITIONAL_IDS, KEIGO_IDS } = await import(
  toFileUrl(join(EXERCISES_DIR, 'exercise-verbs.ts'))
);
const { TRANSITIVITY_PAIRS } = await import(toFileUrl(join(EXERCISES_DIR, 'transitive-pairs.ts')));

/** Cách đọc phải là kana thuần (hiragana hoặc katakana), không lẫn kanji. */
const KANA_ONLY = /^[぀-ゟ゠-ヿー]+$/;

let exerciseProblems = 0;
const problem = (msg) => {
  log(`${c.red}[LOI] ${msg}${c.reset}`);
  exerciseProblems++;
};

/** Một động từ phải chia được ở CẢ dạng kanji lẫn dạng kana. */
function checkVerb(label, masu, reading, group) {
  const result = conjugate(masu, group);
  if (!result.ok) problem(`${label} ${masu} (nhom ${group}): ${result.reason}`);

  if (!KANA_ONLY.test(reading)) {
    problem(`${label} ${masu}: cach doc "${reading}" khong phai kana thuan`);
  } else if (!reading.endsWith('ます')) {
    problem(`${label} ${masu}: cach doc "${reading}" khong ket thuc bang ます`);
  } else {
    const readingResult = conjugate(reading, group);
    if (!readingResult.ok) {
      problem(`${label} ${masu}: cach doc "${reading}" khong chia duoc — ${readingResult.reason}`);
    }
  }
}

const verbIds = new Set();
for (const verb of EXERCISE_VERBS) {
  if (verbIds.has(verb.id)) problem(`Trung id dong tu: ${verb.id}`);
  verbIds.add(verb.id);
  checkVerb('Bai chuyen the:', verb.masu, verb.reading, verb.group);
}

// Danh sách động từ bị bớt thể khoá theo id (kanji|cách đọc): gõ sai một chữ là
// động từ đó lặng lẽ bị hỏi cả 分かれる, 見えられる mà không có gì báo.
for (const [name, ids] of [
  ['NON_VOLITIONAL_IDS', NON_VOLITIONAL_IDS],
  ['KEIGO_IDS', KEIGO_IDS],
]) {
  for (const id of ids) {
    if (!verbIds.has(id)) problem(`${name}: "${id}" khong khop dong tu nao trong bai chuyen the`);
  }
}
for (const id of NON_VOLITIONAL_IDS) {
  if (KEIGO_IDS.has(id)) problem(`"${id}" nam o ca NON_VOLITIONAL_IDS lan KEIGO_IDS`);
}

const pairIds = new Set();
for (const pair of TRANSITIVITY_PAIRS) {
  if (pairIds.has(pair.id)) problem(`Trung id cap dong tu: ${pair.id}`);
  pairIds.add(pair.id);

  // Hai vế trùng nhau thì câu hỏi sẽ hỏi đúng cái vừa hiện ra làm đề bài.
  if (pair.intransitive.masu === pair.transitive.masu) {
    problem(`Cap ${pair.id}: tu dong tu va tha dong tu giong het nhau`);
  }
  checkVerb('Tu dong tu:', pair.intransitive.masu, pair.intransitive.reading, pair.intransitive.group);
  checkVerb('Tha dong tu:', pair.transitive.masu, pair.transitive.reading, pair.transitive.group);
}

if (exerciseProblems === 0) {
  log(
    `${c.green}OK: ${EXERCISE_VERBS.length} dong tu va ${TRANSITIVITY_PAIRS.length} cap tu/tha deu hop le.${c.reset}`,
  );
} else {
  failures += exerciseProblems;
}

process.exitCode = failures === 0 ? 0 : 1;
