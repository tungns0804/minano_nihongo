#!/usr/bin/env node
/**
 * Kiểm tra lộ trình N3 (src/app/core/n3/).
 *
 * Vì sao cần một script riêng: lộ trình là hơn hai trăm dòng dữ liệu chép tay từ
 * mục lục bốn quyển sách, và mỗi dòng có thể sai LẶNG LẼ theo bốn cách khác nhau
 * mà giao diện vẫn vẽ ra bình thường — trùng id (hai mục dùng chung một dấu tích),
 * trỏ tới một bài học không tồn tại (bấm vào ra trang trắng), lệch số mục so với
 * sách (phần trăm tính trên mẫu số sai), hoặc bốn giai đoạn hở một ngày (ngày đó
 * không mục nào được hẹn).
 *
 * Chạy: npm run verify:n3
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const N3_DIR = join(ROOT, 'src', 'app', 'core', 'n3');

const toFileUrl = (path) => new URL(`file:///${path.replace(/\\/g, '/')}`).href;

const {
  N3_SECTIONS,
  N3_PHASES,
  N3_EXAM_DATE,
  N3_PLAN_START,
  N3_LAST_NEW_MATERIAL_DATE,
  N3_UNSCHEDULED_BLOCKS,
  N3_DEFAULT_OUT_OF_SCOPE,
  BUNPOU_GAP_WEIGHT,
} = await import(toFileUrl(join(N3_DIR, 'n3-syllabus.ts')));

const {
  N3_PILLARS,
  N3_PILLAR_BLOCK,
  N3_SCORE_BLOCK_POINTS,
  N3_SECTION_POINTS,
  N3_TOTAL_POINTS,
  buildSchedule,
  canTick,
  isoToDay,
  unitsOf,
} = await import(toFileUrl(join(N3_DIR, 'n3.model.ts')));

const { MESSAGES } = await import(
  toFileUrl(join(ROOT, 'src', 'app', 'core', 'i18n', 'messages.ts'))
);

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
};
const log = (msg = '') => process.stdout.write(`${msg}\n`);

let problems = 0;
function fail(msg) {
  log(`${c.red}[LOI] ${msg}${c.reset}`);
  problems++;
}

let warnings = 0;
function warn(msg) {
  log(`${c.yellow}[CANH BAO] ${msg}${c.reset}`);
  warnings++;
}

// ── Nguồn để đối chiếu ────────────────────────────────────────────────────

/**
 * Bài học có thật: id → loại, đọc từ public/lessons/index.json.
 *
 * Cần cả LOẠI chứ không chỉ id: bài ngữ pháp đi qua `/grammar/:id` còn ba loại
 * kia qua `/lesson/:id`. Gộp hết vào một tập id thì một bài từ vựng bị trỏ nhầm
 * sang nhánh `/grammar/` vẫn qua được kiểm tra, rồi ra trang trắng lúc chạy.
 */
const lessonKinds = new Map();
try {
  const index = JSON.parse(readFileSync(join(ROOT, 'public', 'lessons', 'index.json'), 'utf8'));
  for (const entry of index.lessons ?? []) lessonKinds.set(entry.id, entry.kind);
} catch {
  // LỖI chứ không phải cảnh báo: bỏ qua thì phần kiểm tra đường dẫn — một trong
  // hai lý do chính để có script này — im lặng không chạy, mà dòng tổng kết cuối
  // vẫn tuyên bố "moi duong dan hop le".
  fail('Khong doc duoc public/lessons/index.json. Chay "npm run generate" truoc.');
}

/** Id bài tập bổ trợ — nhập thẳng, không bóc bằng biểu thức chính quy.
 *
 * Bản trước quét `id: '...'` trong exercise.model.ts, và biểu thức đó bắt luôn
 * sáu id của `ExerciseMode` ('to-transitive', 'masu-to-form'…) — những thứ không
 * phải đường dẫn. Hệ quả: `/exercise/masu-to-form` qua được kiểm tra rồi ra trang
 * trắng. Script này đã nạp ba module .ts khác qua --experimental-strip-types nên
 * nhập thêm một module nữa không tốn gì, và nó không thể lệch với sự thật.
 */
const { EXERCISES } = await import(
  toFileUrl(join(ROOT, 'src', 'app', 'core', 'exercises', 'exercise.model.ts'))
);
const exerciseIds = new Set(EXERCISES.map((item) => item.id));

/** Đường dẫn không gắn với một bài cụ thể thì luôn hợp lệ. */
const STATIC_ROUTES = new Set(['/kanji', '/radical', '/exercise', '/grammar', '/']);

/**
 * Số mục mà mỗi quyển sách PHẢI có.
 *
 * Ba con số 42 là 6 tuần × 7 ngày, đọc từ mục lục ba quyển 漢字 / 語彙 / 読解.
 * 23 của quyển 聴解 là 5 + 6 + 6 + 5 + 1, vì quyển đó chia chương chứ không chia
 * tuần. Viết cứng ở đây để một dòng bị xoá hay chép lặp là báo lỗi ngay.
 */
const EXPECTED_BOOK_UNITS = { moji: 42, goi: 42, dokkai: 42, choukai: 23 };

// ── 1. Id duy nhất trên toàn lộ trình ────────────────────────────────────

const seenIds = new Map();
for (const section of N3_SECTIONS) {
  for (const unit of unitsOf(section)) {
    if (seenIds.has(unit.id)) {
      fail(`Trung id "${unit.id}": ${seenIds.get(unit.id)} va ${section.pillar}`);
    }
    seenIds.set(unit.id, section.pillar);
  }
}

// ── 2. Mọi đường dẫn đều dẫn tới một chỗ có thật ─────────────────────────

for (const section of N3_SECTIONS) {
  for (const unit of unitsOf(section)) {
    if (unit.source === 'app' && !unit.route) {
      fail(`Muc "${unit.id}" khai source "app" nhung khong co duong dan`);
      continue;
    }
    if (unit.source !== 'app' && unit.route) {
      fail(`Muc "${unit.id}" co duong dan nhung source la "${unit.source}"`);
    }
    if (!Number.isFinite(unit.weight) || unit.weight <= 0) {
      fail(`Muc "${unit.id}" co trong so khong hop le: ${unit.weight}`);
    }
    // Tiêu đề rỗng vẽ ra một dòng trắng có ô tích — trông như lỗi hiển thị chứ
    // không như dữ liệu thiếu, nên không ai đi tìm nguyên nhân.
    if (!unit.titleJa.trim() || !unit.titleVi.trim()) {
      fail(`Muc "${unit.id}" thieu tieu de (ja="${unit.titleJa}" vi="${unit.titleVi}")`);
    }
    if (!unit.route || STATIC_ROUTES.has(unit.route)) continue;

    const lesson = /^\/lesson\/(.+)$/.exec(unit.route);
    const grammar = /^\/grammar\/(.+)$/.exec(unit.route);
    const exercise = /^\/exercise\/(.+)$/.exec(unit.route);

    if (lesson || grammar) {
      const id = (lesson ?? grammar)[1];
      const kind = lessonKinds.get(id);
      if (lessonKinds.size > 0 && kind === undefined) {
        fail(`Muc "${unit.id}" tro toi bai hoc "${id}" khong co trong index.json`);
      } else if (grammar && kind !== undefined && kind !== 'grammar') {
        fail(`Muc "${unit.id}" dung /grammar/ cho bai "${id}" loai "${kind}"`);
      } else if (lesson && kind === 'grammar') {
        fail(`Muc "${unit.id}" dung /lesson/ cho bai ngu phap "${id}" — phai la /grammar/`);
      }
    } else if (exercise) {
      if (!exerciseIds.has(exercise[1])) {
        fail(`Muc "${unit.id}" tro toi bai tap "${exercise[1]}" khong co trong EXERCISES`);
      }
    } else {
      fail(`Muc "${unit.id}" co duong dan la khong nhan ra: "${unit.route}"`);
    }
  }
}

// ── 3. Số mục khớp với mục lục sách ──────────────────────────────────────

for (const [pillar, expected] of Object.entries(EXPECTED_BOOK_UNITS)) {
  const section = N3_SECTIONS.find((item) => item.pillar === pillar);
  if (!section) {
    fail(`Khong tim thay tru "${pillar}"`);
    continue;
  }
  // Chỉ đếm mục tới TỪ SÁCH: các khối "Bổ trợ" là phần luyện thêm trong app,
  // không có trong mục lục nên không được tính vào con số đối chiếu.
  const fromBook = section.blocks
    .filter((block) => block.startPage > 0)
    .reduce((sum, block) => sum + block.units.length, 0);
  if (fromBook !== expected) {
    fail(`Tru "${pillar}": muc lay tu sach la ${fromBook}, phai la ${expected}`);
  }
}

// Mỗi tuần của ba quyển 6×7 phải có đúng 7 ngày, ngày cuối là bài kiểm tra.
for (const pillar of ['moji', 'goi', 'dokkai']) {
  const section = N3_SECTIONS.find((item) => item.pillar === pillar);
  // Vòng lặp trên đã báo trụ thiếu; ở đây chỉ cần đừng biến một lỗi đã được báo
  // rõ ràng thành một vết ngăn xếp không ai đọc.
  if (!section) continue;
  for (const block of section.blocks.filter((item) => item.startPage > 0)) {
    if (block.units.length !== 7) {
      fail(`${pillar}/${block.id}: co ${block.units.length} ngay, phai la 7`);
    }
    const last = block.units[block.units.length - 1];
    if (last.kind !== 'test') {
      fail(`${pillar}/${block.id}: ngay cuoi phai la bai kiem tra, dang la "${last.titleJa}"`);
    }
  }
}

// ── 4. Mọi khoá thông điệp đều có trong từ điển ──────────────────────────

const keys = [
  ...N3_SECTIONS.flatMap((section) => [section.labelKey, section.descKey]),
  ...N3_PHASES.flatMap((phase) => [phase.labelKey, phase.goalKey, phase.routineKey]),
];
for (const key of keys) {
  if (!(key in MESSAGES)) fail(`Khoa thong diep "${key}" khong co trong tu dien`);
}

// ── 5. Bốn giai đoạn phủ kín từ ngày đầu tới sát ngày thi ────────────────

const planStart = isoToDay(N3_PLAN_START);
const examDay = isoToDay(N3_EXAM_DATE);

if (isoToDay(N3_PHASES[0].from) !== planStart) {
  fail(`Giai doan dau bat dau ${N3_PHASES[0].from}, phai la ${N3_PLAN_START}`);
}

const seenPhaseIds = new Set();
for (const phase of N3_PHASES) {
  if (seenPhaseIds.has(phase.id)) fail(`Trung id giai doan "${phase.id}"`);
  seenPhaseIds.add(phase.id);
  if (isoToDay(phase.to) < isoToDay(phase.from)) {
    fail(`Giai doan "${phase.id}" ket thuc (${phase.to}) truoc khi bat dau (${phase.from})`);
  }
}

for (let i = 1; i < N3_PHASES.length; i++) {
  const gap = isoToDay(N3_PHASES[i].from) - isoToDay(N3_PHASES[i - 1].to);
  if (gap !== 1) {
    fail(
      `Giua giai doan "${N3_PHASES[i - 1].id}" va "${N3_PHASES[i].id}" ${
        gap > 1 ? `ho ${gap - 1} ngay` : `trung ${1 - gap} ngay`
      }`,
    );
  }
}

const lastPhase = N3_PHASES[N3_PHASES.length - 1];
if (isoToDay(lastPhase.to) !== examDay - 1) {
  fail(`Giai doan cuoi ket thuc ${lastPhase.to}, phai la ngay truoc hom thi (${N3_EXAM_DATE})`);
}

// Ngày cuối được nạp bài mới phải đúng là ngày kết thúc giai đoạn nạp N3.
const inputPhase = N3_PHASES.filter((phase) => phase.blocks.length > 0).at(-1);
if (inputPhase.to !== N3_LAST_NEW_MATERIAL_DATE) {
  fail(
    `N3_LAST_NEW_MATERIAL_DATE la ${N3_LAST_NEW_MATERIAL_DATE} nhung giai doan nap bai cuoi ket thuc ${inputPhase.to}`,
  );
}

// ── 6. Mọi mục tích được đều có mặt trong lịch, đúng một lần ─────────────

const schedule = buildSchedule(N3_SECTIONS, N3_PHASES);
const tickable = N3_SECTIONS.flatMap((section) => unitsOf(section).filter(canTick));

// Mục của khối cố ý bỏ ngoài lịch (xem N3_UNSCHEDULED_BLOCKS) thì không đòi hẹn
// ngày; phần dưới sẽ kiểm tra riêng rằng chúng cũng không lọt vào lịch.
const allBlocks = N3_SECTIONS.flatMap((section) => section.blocks);
const scheduledExpected = allBlocks
  .filter((block) => !N3_UNSCHEDULED_BLOCKS.includes(block.id))
  .flatMap((block) => block.units.filter(canTick));

if (schedule.units.length !== scheduledExpected.length) {
  fail(
    `Lich xep ${schedule.units.length} muc nhung phai xep ${scheduledExpected.length} muc`,
  );
}
for (const unit of scheduledExpected) {
  if (!schedule.byUnitId.has(unit.id)) {
    fail(`Muc "${unit.id}" tich duoc nhung khong duoc xep vao ngay nao`);
  }
}
for (const block of allBlocks.filter((item) => N3_UNSCHEDULED_BLOCKS.includes(item.id))) {
  for (const unit of block.units) {
    if (schedule.byUnitId.has(unit.id)) {
      fail(`Khoi "${block.id}" khai la ngoai lich nhung muc "${unit.id}" lai duoc hen ngay`);
    }
  }
}

// Tên khối trong N3_UNSCHEDULED_BLOCKS phải là khối có thật, nếu không nó đang
// miễn trừ cho một khối đã đổi id — và khối thật thì lặng lẽ mất hẹn.
const blockIds = new Set(allBlocks.map((block) => block.id));
for (const id of N3_UNSCHEDULED_BLOCKS) {
  if (!blockIds.has(id)) fail(`N3_UNSCHEDULED_BLOCKS co "${id}" nhung khong co khoi nao ten vay`);
}
for (const item of schedule.units) {
  if (item.targetDay < planStart || item.targetDay >= examDay) {
    fail(`Muc "${item.unit.id}" hen ngay ngoai khoang lo trinh`);
  }
}

// Mỗi khối được hẹn ngày ở đúng một giai đoạn, và mọi khối có mục tích được thì
// hoặc nằm trong một giai đoạn, hoặc khai thẳng là ngoài lịch.
const blockPhases = new Map();
for (const phase of N3_PHASES) {
  for (const id of phase.blocks) {
    if (!blockIds.has(id)) {
      fail(`Giai doan "${phase.id}" hen khoi "${id}" nhung khong co khoi nao ten vay`);
      continue;
    }
    if (blockPhases.has(id)) {
      fail(`Khoi "${id}" duoc hen o ca hai giai doan ${blockPhases.get(id)} va ${phase.id}`);
    }
    blockPhases.set(id, phase.id);
  }
}
for (const block of allBlocks) {
  const hasTickable = block.units.some(canTick);
  const inPhase = blockPhases.has(block.id);
  const declaredOut = N3_UNSCHEDULED_BLOCKS.includes(block.id);

  if (hasTickable && !inPhase && !declaredOut) {
    fail(
      `Khoi "${block.id}" co muc tich duoc nhung khong giai doan nao hen no, va cung khong khai trong N3_UNSCHEDULED_BLOCKS`,
    );
  }
  if (inPhase && declaredOut) {
    fail(`Khoi "${block.id}" vua duoc hen o giai doan "${blockPhases.get(block.id)}" vua khai la ngoai lich`);
  }
}

// ── 6b. Nhịp học của mỗi giai đoạn phải nằm trong khoang lam duoc ────────
//
// Đây là kiểm tra QUAN TRỌNG NHẤT với người học: một lộ trình đòi 6 buổi mỗi
// ngày thì đúng về số học và không ai theo được. Ngưỡng 3.5 lấy từ chính nhịp
// thiết kế (2,4–2,9) cộng một khoảng dư.
const PACE_MAX = 3.5;
for (const phase of N3_PHASES) {
  const units = schedule.units.filter((item) => item.phaseId === phase.id);
  if (units.length === 0) continue;
  const days = isoToDay(phase.to) - isoToDay(phase.from) + 1;
  const perDay = units.length / days;
  if (perDay > PACE_MAX) {
    fail(
      `Giai doan "${phase.id}" doi ${perDay.toFixed(2)} buoi/ngay (${units.length} muc / ${days} ngay), qua nguong ${PACE_MAX}`,
    );
  }
}

// ── 7. Điểm quy đổi cộng lại đúng 180 ────────────────────────────────────

const pointsSum = Object.values(N3_SECTION_POINTS).reduce((a, b) => a + b, 0);
if (pointsSum !== N3_TOTAL_POINTS) {
  fail(`Tong diem cac tru la ${pointsSum}, phai la ${N3_TOTAL_POINTS}`);
}

// Tổng 180 một mình không đủ: chuyển 10 điểm từ 読解 sang 語彙 vẫn cho tổng 180
// mà đã làm sai thang điểm của hai khối. Phải khớp cả theo TỪNG khối.
for (const [blockId, blockPoints] of Object.entries(N3_SCORE_BLOCK_POINTS)) {
  const sum = N3_PILLARS.filter((pillar) => N3_PILLAR_BLOCK[pillar] === blockId).reduce(
    (total, pillar) => total + N3_SECTION_POINTS[pillar],
    0,
  );
  if (sum !== blockPoints) {
    fail(`Khoi "${blockId}": tong diem cac tru la ${sum}, phai la ${blockPoints}`);
  }
}

// Mỗi trụ phải có mặt trong cả ba bảng, và không bảng nào được có khoá lạ.
for (const pillar of N3_PILLARS) {
  if (!(pillar in N3_SECTION_POINTS)) fail(`N3_SECTION_POINTS thieu tru "${pillar}"`);
  if (!(pillar in N3_PILLAR_BLOCK)) fail(`N3_PILLAR_BLOCK thieu tru "${pillar}"`);
  if (!N3_SECTIONS.some((section) => section.pillar === pillar)) {
    fail(`Khong co N3_SECTIONS nao cho tru "${pillar}"`);
  }
}
for (const key of Object.keys(N3_SECTION_POINTS)) {
  if (!N3_PILLARS.includes(key)) fail(`N3_SECTION_POINTS co khoa la "${key}"`);
}
for (const pillar of N3_DEFAULT_OUT_OF_SCOPE) {
  if (!N3_PILLARS.includes(pillar)) {
    fail(`N3_DEFAULT_OUT_OF_SCOPE co tru khong ton tai: "${pillar}"`);
  }
}

// ── 8. Lỗ hổng nguồn phải còn nguyên nhãn cảnh báo ───────────────────────

const gapUnits = N3_SECTIONS.flatMap((section) =>
  unitsOf(section).filter((unit) => unit.source === 'no-source'),
);
const gapWeight = gapUnits.reduce((sum, unit) => sum + unit.weight, 0);
if (gapWeight !== BUNPOU_GAP_WEIGHT) {
  warn(
    `Tong trong so phan chua co nguon la ${gapWeight}, khac BUNPOU_GAP_WEIGHT (${BUNPOU_GAP_WEIGHT}) — kiem tra lai neu vua bo sung sach.`,
  );
}

// ── Tổng kết ─────────────────────────────────────────────────────────────

log(`${c.bold}Kiem tra lo trinh N3${c.reset}`);
log(`  ngay thi          : ${N3_EXAM_DATE}`);
log(`  so ngay lo trinh  : ${examDay - planStart}`);
log(`  tong so muc       : ${seenIds.size}`);
log(`  muc tich duoc     : ${tickable.length}`);
log(`  muc trong lich    : ${schedule.units.length}`);
log(`  khoi ngoai lich   : ${N3_UNSCHEDULED_BLOCKS.join(', ') || '(khong co)'}`);
for (const phase of N3_PHASES) {
  const units = schedule.units.filter((item) => item.phaseId === phase.id);
  const days = isoToDay(phase.to) - isoToDay(phase.from) + 1;
  log(
    `  ${phase.id}  ${phase.from} -> ${phase.to}  ${String(days).padStart(2)} ngay` +
      `  ${String(units.length).padStart(3)} muc  ${(units.length / days).toFixed(2)} buoi/ngay`,
  );
}
log();

for (const section of N3_SECTIONS) {
  const units = unitsOf(section);
  const ticks = units.filter(canTick).length;
  const weight = units.reduce((sum, unit) => sum + unit.weight, 0);
  log(
    `  ${section.pillar.padEnd(11)} ${String(ticks).padStart(3)} muc tich duoc` +
      `${c.dim} / trong so ${String(weight).padStart(3)} / ${String(N3_SECTION_POINTS[section.pillar]).padStart(2)} diem${c.reset}`,
  );
}

log();
if (problems > 0) {
  log(`${c.red}${problems} van de can sua.${c.reset}`);
  process.exitCode = 1;
} else if (warnings > 0) {
  // Không in dòng xanh khi còn cảnh báo: một câu "OK" ngay dưới một cảnh báo dạy
  // người đọc bỏ qua cảnh báo.
  log(`${c.yellow}${warnings} canh bao — lo trinh dung nhung co cho can xem lai.${c.reset}`);
} else {
  log(`${c.green}OK: lo trinh khop muc luc sach, moi duong dan hop le, lich phu kin.${c.reset}`);
}
