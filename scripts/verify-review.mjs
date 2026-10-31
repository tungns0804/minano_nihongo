#!/usr/bin/env node
/**
 * Kiểm tra lịch ôn tập ngắt quãng (`src/app/core/review/review.model.ts`).
 *
 * Vì sao cần một script riêng: lịch ôn sai thì không có gì hiện ra là "lỗi" cả —
 * mục chỉ âm thầm bị hỏi quá dày hoặc biến mất vài tháng. Mỗi quy tắc dưới đây ứng
 * với đúng một đoạn ghi chú trong `schedule`, nên sửa quy tắc mà quên sửa ghi chú
 * (hoặc ngược lại) thì script này là chỗ đầu tiên báo.
 *
 * Chạy: npm run verify:review
 */

import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolveTsImports } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

// review.model.ts import "../kanji/kanji.model" không kèm đuôi file — xem `resolveTsImports`.
resolveTsImports();

const {
  INTERVAL_DAYS,
  MAX_STAGE,
  areaOfKey,
  dismissMistake,
  gradeOf,
  inMistakeBook,
  packCards,
  parseReviewKey,
  reviewRefOf,
  sanitizeReviewSettings,
  schedule,
  unpackCards,
} = await import(pathToFileURL(join(ROOT, 'src', 'app', 'core', 'review', 'review.model.ts')));

const problems = [];
let checks = 0;

function expect(condition, why) {
  checks++;
  if (!condition) problems.push(why);
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const show = (card) => JSON.stringify(card);

const D = 20_000;

// ── Lên nấc ────────────────────────────────────────────────────────────────

let card = schedule(null, 'good', D, 'bai-1');
expect(
  card.stage === 1 && card.due === D + 1 && card.streak === 1 && card.lapses === 0,
  `muc moi dung ngay phai len nac 1, on lai sau 1 ngay: ${show(card)}`,
);

expect(
  same(schedule(card, 'good', D, 'bai-1'), card),
  'dung lan hai trong cung mot ngay khong duoc len nac nua',
);

{
  let day = D;
  let current = null;
  for (let step = 1; step <= MAX_STAGE + 1; step++) {
    current = schedule(current, 'good', day, 'bai-1');
    const stage = Math.min(step, MAX_STAGE);
    expect(
      current.stage === stage && current.due === day + INTERVAL_DAYS[stage - 1],
      `on dung han lan ${step} phai o nac ${stage}: ${show(current)}`,
    );
    day = current.due;
  }
}

// ── Ôn sớm ────────────────────────────────────────────────────────────────

card = schedule(schedule(null, 'good', D, 's'), 'good', D + 1, 's'); // nac 2, han D+4
{
  const early = schedule(card, 'good', D + 2, 's');
  expect(
    early.stage === card.stage && early.due === card.due && early.streak === card.streak + 1,
    `on som ma dung thi giu nac va han, chi cong chuoi dung: ${show(early)}`,
  );

  const earlyHard = schedule(card, 'hard', D + 2, 's');
  expect(
    earlyHard.stage === card.stage && earlyHard.due <= card.due && earlyHard.streak === 0,
    `on som ma phai thu lai thi khong duoc day han xa hon: ${show(earlyHard)}`,
  );
}

// ── Quên ──────────────────────────────────────────────────────────────────

const lapsed = schedule(card, 'again', D + 5, 's');
expect(
  lapsed.stage === 0 && lapsed.due === D + 6 && lapsed.lapses === 1 && lapsed.streak === 0,
  `lo dap an phai ve nac 0, on lai ngay mai, cong mot lan quen: ${show(lapsed)}`,
);
expect(
  schedule(lapsed, 'again', D + 5, 's').lapses === 1,
  'quen them lan nua trong cung ngay (dong tu hoi o nhieu the) khong duoc cong them',
);
expect(
  schedule(null, 'again', D, 's').lapses === 1,
  'muc moi ma sai ngay lan dau van phai tinh mot lan quen',
);

// ── Đúng sau khi thử lại ──────────────────────────────────────────────────

{
  const hard = schedule(card, 'hard', card.due, 's'); // nac 2 = 3 ngay -> nua quang 2 ngay
  expect(
    hard.stage === 2 && hard.due === card.due + 2 && hard.streak === 0,
    `dung sau khi thu lai thi giu nac, hen nua quang: ${show(hard)}`,
  );
  const hardNew = schedule(null, 'hard', D, 's');
  expect(
    hardNew.stage === 1 && hardNew.due === D + 1,
    `muc moi dung sau khi thu lai phai o it nhat nac 1: ${show(hardNew)}`,
  );
}

// ── Sổ lỗi sai ────────────────────────────────────────────────────────────

expect(inMistakeBook(lapsed), 'muc vua quen phai vao so loi sai');
{
  let fixing = schedule(lapsed, 'good', D + 6, 's');
  expect(inMistakeBook(fixing), 'moi dung ngay mot lan thi chua ra khoi so');
  fixing = schedule(fixing, 'good', fixing.due, 's');
  expect(!inMistakeBook(fixing), 'dung ngay hai lan lien tiep thi phai ra khoi so');
}
expect(!inMistakeBook(dismissMistake(lapsed)), 'bo khoi so bang tay thi phai ra khoi so');
expect(
  same({ ...dismissMistake(lapsed), streak: lapsed.streak }, lapsed),
  'bo khoi so bang tay khong duoc dung toi nac va han on',
);
expect(
  inMistakeBook(schedule(dismissMistake(lapsed), 'again', D + 9, 's')),
  'quen lai sau khi da bo khoi so thi phai vao lai so',
);

// ── Chấm điểm ─────────────────────────────────────────────────────────────

expect(gradeOf('pending', 0) === null, 'cau con dang mo thi chua cham');
expect(gradeOf('correct', 0) === 'good', 'dung ngay lan dau la good');
expect(gradeOf('correct', 2) === 'hard', 'dung sau khi sai la hard');
expect(gradeOf('revealed', 1) === 'again', 'lo dap an la again');

// ── Khoá lịch ôn ──────────────────────────────────────────────────────────

const ref = (config, id) => reviewRefOf({ exercise: null, answerMode: 'typing', ...config }, id);
expect(ref({ lessonKind: 'vocabulary', lessonId: 'minano-nihongo-44' }, 'x')?.key === 'w:x', 'bai tu vung -> w');
expect(ref({ lessonKind: 'topic', lessonId: 'gia-dinh' }, 'x')?.key === 'w:x', 'chu de dung chung khoa voi bai tu vung');
expect(ref({ lessonKind: 'grammar', lessonId: 'ngu-phap-minano-26' }, 'x')?.key === 'g:x', 'ngu phap -> g');
expect(ref({ lessonKind: 'verb', lessonId: 'dong-tu-minano-33' }, 'x')?.key === 'v:x', 'bai dong tu -> v');
expect(ref({ lessonKind: 'kanji', lessonId: 'am-han-viet' }, 'x')?.key === 'kc:x', 'luyen am Han Viet cua chu -> kc');
expect(ref({ lessonKind: 'kanji', lessonId: 'nhu-6fe1' }, 'x')?.key === 'kw:x', 'luyen tu cua mot chu -> kw');
expect(
  ref({ lessonKind: 'exercise', lessonId: 'tu-tha-dong-tu', exercise: 'tu-tha-dong-tu' }, 'x')?.key === 'tp:x',
  'cap tu/tha -> tp',
);
expect(
  ref({ lessonKind: 'exercise', lessonId: 'chuyen-the-dong-tu', exercise: 'chuyen-the-dong-tu' }, 'x')?.key === 'ev:x',
  'bai chuyen the -> ev',
);
{
  const n4 = (exerciseMode) =>
    ref({ lessonKind: 'exercise', lessonId: 'ngu-phap-n4', exercise: 'ngu-phap-n4', exerciseMode }, 'x');
  expect(
    n4('example-vi-jp')?.key === 'ne:x' && n4('example-jp-vi')?.key === 'ne:x',
    'cau vi du ngu phap N4 -> ne',
  );
  expect(
    n4('pattern-to-meaning')?.key === 'nm:x' &&
      n4('meaning-to-pattern')?.key === 'nm:x' &&
      n4('meaning-mixed')?.key === 'nm:x',
    'y nghia mau ngu phap N4 -> nm',
  );
  expect(n4('example-vi-jp')?.source === 'ngu-phap-n4', 'nguon cua muc N4 la id bai tap (cung la khoa ★)');
  expect(parseReviewKey('ne:abc')?.type === 'ne' && parseReviewKey('nm:nagara')?.type === 'nm', 'nhan ra khoa ne / nm');
}
{
  const tk = (exerciseMode) =>
    ref({ lessonKind: 'exercise', lessonId: 'taisaku-n4', exercise: 'taisaku-n4', exerciseMode, answerMode: 'choice' }, 'm1-3');
  expect(
    ['tk-kanji-reading', 'tk-usage', 'tk-moji-test', 'tk-word-meaning', 'tk-book'].every((mode) => tk(mode)?.key === 'tv:m1-3'),
    'de luyen N4: phan tu vung va 付録 -> tv',
  );
  expect(
    ['tk-grammar', 'tk-star', 'tk-order', 'tk-passage', 'tk-bunpo-test'].every((mode) => tk(mode)?.key === 'tg:m1-3'),
    'de luyen N4: phan ngu phap -> tg',
  );
  expect(areaOfKey('tv:f1-w1') === 'vocab' && areaOfKey('tg:b1-16') === 'grammar', 'tv on chung tu vung, tg on chung ngu phap');
}
expect(ref({ lessonKind: 'kanji', lessonId: 'nhu-6fe1', answerMode: 'draw' }, 'x') === null, 'phien viet chu khong vao lich');
expect(
  ref({ lessonKind: 'radical', lessonId: 'bo-thu', radicalMode: 'radical-hanviet' }, 'x')?.key === 'rc:x',
  'am Han Viet cua bo thu -> rc',
);
expect(
  ref({ lessonKind: 'radical', lessonId: 'bo-thuy', radicalMode: 'kanji-hanviet' }, 'x')?.key === 'kc:x' &&
    ref({ lessonKind: 'radical', lessonId: 'bo-thuy', radicalMode: 'kanji-parts' }, 'y')?.key === 'kc:y',
  'chu ghep tu mot bo -> the chu Han kc',
);
expect(
  ref({ lessonKind: 'radical', lessonId: 'bo-thuy', radicalMode: 'kanji-hanviet' }, 'x')?.source === 'bo-thuy',
  'nguon cua chu ghep la bo dang mo',
);
expect(
  ref({ lessonKind: 'radical', lessonId: 'bo-thu', radicalMode: 'radical-draw', answerMode: 'draw' }, 'x') === null,
  'viet bo thu khong vao lich',
);
expect(parseReviewKey('rc:nhan-4eba')?.type === 'rc', 'nhan ra khoa rc');
expect(ref({ lessonKind: 'conversation', lessonId: 'hoi-thoai-minano-26' }, 'x') === null, 'hoi thoai khong vao lich');
expect(
  ref({ lessonKind: 'vocabulary', lessonId: 'minano-nihongo-44' }, 'x')?.source === 'minano-nihongo-44',
  'nguon phai la id bai (cung la khoa ★)',
);
expect(parseReviewKey('kw:会社|かいしゃ')?.id === '会社|かいしゃ', 'tach khoa o dau hai cham dau tien');
expect(parseReviewKey('zz:x') === null && parseReviewKey('w:') === null, 'khoa la hoac rong phai bi tu choi');

// ── Lưu trữ ───────────────────────────────────────────────────────────────

{
  const cards = { 'w:abc': card, 'kw:会社|かいしゃ': lapsed };
  const back = unpackCards(JSON.parse(JSON.stringify(packCards(cards))));
  expect(same(back, cards), `luu roi doc lai phai giu nguyen: ${JSON.stringify(back)}`);

  const junk = unpackCards({
    'w:short': [1, 2],
    'zz:type': [1, 1, 0, 0, 1, 'a'],
    'w:': [1, 1, 0, 0, 1, 'a'],
    'g:stage': [99, 1, 0, 0, 1, 'b'],
    'v:negative': [1, 1, -1, 0, 1, 'c'],
    'kc:float': [1, 1.5, 0, 0, 1, 'd'],
    'ev:ok': [2, 5, 1, 1, 4, 'chuyen-the-dong-tu'],
  });
  expect(Object.keys(junk).join() === 'ev:ok', `du lieu hong phai bi bo qua, con lai: ${Object.keys(junk).join()}`);
  expect(same(unpackCards(null), {}) && same(unpackCards([1, 2]), {}), 'kho khong phai object thi coi nhu rong');

  // Khu BTVN N3 co ban da go: tu con o bai khac thi chuyen nguon, con lai bo the.
  const retired = unpackCards({
    'w:1ndkdxg': [3, 9, 1, 2, 5, 'btvn-n3-co-ban-1'],
    'w:0z81o89': [1, 9, 0, 1, 5, 'btvn-n3-co-ban-3'],
    'w:chi-btvn': [1, 9, 0, 1, 5, 'btvn-n3-co-ban-2'],
    'w:giu-nguyen': [1, 9, 0, 1, 5, 'minano-nihongo-47'],
    'w:constructor': [1, 9, 0, 1, 5, 'constructor'],
  });
  expect(
    retired['w:1ndkdxg']?.source === 'minano-nihongo-47' && retired['w:1ndkdxg'].stage === 3,
    `the cua tu BTVN co o bai 47 phai chuyen nguon va giu lich: ${JSON.stringify(retired['w:1ndkdxg'])}`,
  );
  expect(retired['w:0z81o89']?.source === 'minano-nihongo-28', 'tu BTVN co o bai 28 phai chuyen nguon');
  expect(!('w:chi-btvn' in retired), 'the cua tu chi co o BTVN phai bi bo');
  expect(
    retired['w:giu-nguyen']?.source === 'minano-nihongo-47' && retired['w:constructor']?.source === 'constructor',
    'the cua bai con ton tai khong duoc dong toi',
  );
}

// ── Thiết lập ─────────────────────────────────────────────────────────────

{
  const fromJunk = sanitizeReviewSettings({ areas: ['kanji', 'xx'], limit: 7, answerMode: 'draw', direction: 'jp-kana' });
  expect(
    same(fromJunk, { areas: ['kanji'], limit: 50, answerMode: 'choice', direction: 'jp-vi' }),
    `thiet lap hong phai ve mac dinh tung truong: ${JSON.stringify(fromJunk)}`,
  );
  expect(sanitizeReviewSettings({ areas: [] }).areas.length === 4, 'bo het khu thi quay ve du bon khu');
  expect(sanitizeReviewSettings({ limit: null }).limit === null, 'limit null (on het) phai duoc giu');
  expect(sanitizeReviewSettings(null).limit === 50, 'chua co thiet lap thi dung mac dinh');
}

if (problems.length > 0) {
  process.stdout.write(`Lich on tap co ${problems.length} cho sai:\n`);
  for (const line of problems) process.stdout.write(`  - ${line}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`OK: lich on tap dung ca ${checks} quy tac.\n`);
}
