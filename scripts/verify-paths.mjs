#!/usr/bin/env node
/**
 * Kiểm tra đường dẫn của ứng dụng (src/app/core/paths.ts + navigation.ts).
 *
 * Vì sao cần: đường dẫn gãy thì không lỗi biên dịch nào báo — bấm vào thẻ bài chỉ ra
 * trang "không tìm thấy", hoặc tệ hơn là mở được nhưng menu sáng sai nhóm, nút quay
 * lại về sai danh sách. Ba thứ phải luôn đúng với MỌI bài, không chỉ vài bài thử tay:
 *
 *   1. Đi được hai chiều: id → đường dẫn → id, không mất mát, không hai bài chung một
 *      đường dẫn, và đường dẫn sạch (chữ thường, số, gạch nối).
 *   2. Bài nằm ngay dưới đúng danh sách liệt kê nó — đó là thứ quyết định menu nào
 *      sáng, tab nào, breadcrumb nói gì (`locate`).
 *   3. Đường dẫn kiểu cũ (/lesson/…, /grammar/…, trước 07/11/2026) vẫn dẫn tới đúng bài:
 *      link đã lưu, lịch sử trình duyệt và khối "Học tiếp" không được gãy.
 *
 * Chạy: npm run verify:paths
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c, log, resolveTsImports, toFileUrl } from './script-utils.mjs';

resolveTsImports();

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CORE = join(ROOT, 'src', 'app', 'core');

const {
  PATH,
  exercisePath,
  isStaticPath,
  legacyPathTarget,
  lessonIdOfPath,
  lessonPath,
  listPathOf,
} = await import(toFileUrl(join(CORE, 'paths.ts')));
const { NAV_GROUPS, locate } = await import(toFileUrl(join(CORE, 'navigation.ts')));
const { LESSON_KIND_LABEL_KEY } = await import(toFileUrl(join(CORE, 'lessons', 'vocabulary.model.ts')));
const { EXERCISES, GRAMMAR_BOOK_IDS } = await import(toFileUrl(join(CORE, 'exercises', 'exercise.model.ts')));
const { TOPIC_CATALOG } = await import(toFileUrl(join(CORE, 'topics', 'topic-catalog.generated.ts')));

let problems = 0;
function fail(msg) {
  log(`${c.red}[LOI] ${msg}${c.reset}`);
  problems++;
}

// ── Mọi bài có trang riêng ───────────────────────────────────────────────

/** [loại, id] của mọi bài: dữ liệu (index.json), chủ đề, bài tập cài trong mã nguồn. */
const items = [];
try {
  const index = JSON.parse(readFileSync(join(ROOT, 'public', 'lessons', 'index.json'), 'utf8'));
  for (const entry of index.lessons ?? []) items.push([entry.kind, entry.id]);
} catch {
  fail('Khong doc duoc public/lessons/index.json. Chay "npm run generate" truoc.');
}
for (const topic of TOPIC_CATALOG) items.push(['topic', topic.id]);
// Sách ngữ pháp và đề luyện N4 cũng là "bài tập" (lessonKind của phiên luyện), dù
// không nằm trong danh sách thẻ `EXERCISES`.
for (const id of new Set([...EXERCISES.map((item) => item.id), ...GRAMMAR_BOOK_IDS, 'taisaku-n4'])) {
  items.push(['exercise', id]);
}

// Bài tập có trang riêng (/luyen-tap/de-n4, /ngu-phap/vnjpclub) là chính một tab, không
// nằm dưới danh sách bài tập — phần "nằm dưới danh sách" chỉ xét bài còn lại.
const ownPage = (path) => locate(path)?.isPage === true;

const owners = new Map();
for (const [kind, id] of items) {
  const path = lessonPath(kind, id);
  const label = `${kind} "${id}"`;

  if (!/^(\/[a-z0-9]+(-[a-z0-9]+)*)+$/.test(path)) {
    fail(`${label}: duong dan khong sach "${path}"`);
  }
  if (owners.has(path)) fail(`${label}: trung duong dan "${path}" voi ${owners.get(path)}`);
  owners.set(path, label);

  const back = lessonIdOfPath(path);
  if (back !== id) fail(`${label}: "${path}" doc nguoc ra "${back}"`);
  // Bài tập có màn hình riêng (số đếm, sách ngữ pháp, đề N4) có route cố định của nó;
  // mọi bài khác mà trùng một trang cố định thì route của trang kia sẽ nuốt mất bài.
  if (kind !== 'exercise' && isStaticPath(path)) {
    fail(`${label}: "${path}" trung mot trang co dinh`);
  }

  const spot = locate(path);
  if (!spot) {
    fail(`${label}: "${path}" khong thuoc nhom menu nao`);
  } else if (!ownPage(path) && spot.page.path !== listPathOf(kind)) {
    fail(`${label}: "${path}" sang tab "${spot.page.path}", nhung bai liet ke o "${listPathOf(kind)}"`);
  }

  // Đường dẫn cũ của chính bài này.
  const legacy =
    kind === 'grammar'
      ? `/grammar/${id}`
      : kind === 'translation'
        ? `/translate/${id}`
        : kind === 'topic'
          ? `/topic/${id}`
          : kind === 'exercise'
            ? `/exercise/${id}`
            : `/lesson/${id}`;
  const upgraded = legacyPathTarget(legacy, LESSON_KIND_LABEL_KEY[kind]);
  if (upgraded !== path) fail(`${label}: duong dan cu "${legacy}" -> "${upgraded}", phai la "${path}"`);

  // Link cũ /lesson/<id> không kèm loại bài (dấu trang, lịch sử): phải ít nhất mở đúng
  // bài; `LessonDetail` tự chuyển sang nhánh đúng nếu đoán sai loại.
  if (legacy.startsWith('/lesson/')) {
    const guessed = legacyPathTarget(legacy);
    if (lessonIdOfPath(guessed) !== id) {
      fail(`${label}: "${legacy}" (khong ro loai) -> "${guessed}" khong mo dung bai`);
    }
  }
}

// ── Trang cố định ────────────────────────────────────────────────────────

/** Trang danh sách / trang cố định kiểu cũ → chỗ mới. */
const LEGACY_PAGES = {
  '/vocab': PATH.vocab,
  '/topic': PATH.topics,
  '/grammar': PATH.grammar,
  '/translate': PATH.translate,
  '/exercise': PATH.exercises,
  '/radical': PATH.radicals,
  '/review': PATH.review,
  '/n3': PATH.n3,
  '/practice': PATH.session,
  '/result': PATH.result,
  '/import': PATH.importLesson,
};
for (const [legacy, target] of Object.entries(LEGACY_PAGES)) {
  const upgraded = legacyPathTarget(legacy);
  if (upgraded !== target) fail(`Trang cu "${legacy}" -> "${upgraded}", phai la "${target}"`);
}
// Đường dẫn mới không bao giờ bị hiểu nhầm là đường dẫn cũ.
for (const path of [...Object.values(PATH), ...owners.keys()]) {
  if (legacyPathTarget(path) !== null) fail(`"${path}" bi coi la duong dan cu`);
}

// Mỗi tab con của menu là một trang cố định, và tự nhận ra chính nó.
for (const group of NAV_GROUPS) {
  for (const page of group.pages) {
    if (!isStaticPath(page.path)) fail(`Tab "${page.path}" cua nhom ${group.id} khong co trong PATH`);
    const spot = locate(page.path);
    if (spot?.group.id !== group.id || spot.page !== page || !spot.isPage) {
      fail(`Tab "${page.path}" cua nhom ${group.id} bi nhan nham thanh ${spot?.group.id}:${spot?.page.path}`);
    }
  }
  if (!group.pages.some((page) => page.path === group.path)) {
    fail(`Nhom ${group.id} mo "${group.path}" nhung do khong phai tab nao cua nhom`);
  }
}

// Mỗi đường dẫn trong PATH phải có route. Không nạp được app.routes.ts (cần Angular),
// nên đọc chữ: route khai bằng `PATH.<khoá>`, không viết tay chuỗi.
const routes = readFileSync(join(ROOT, 'src', 'app', 'app.routes.ts'), 'utf8');
for (const key of Object.keys(PATH)) {
  if (!new RegExp(`PATH\\.${key}\\b`).test(routes)) fail(`PATH.${key} khong co route nao trong app.routes.ts`);
}

// ── Tổng kết ─────────────────────────────────────────────────────────────

log();
log(`  ${owners.size} trang bai, ${Object.keys(PATH).length} trang co dinh, ${Object.keys(LEGACY_PAGES).length} trang cu`);
log();
if (problems > 0) {
  log(`${c.red}${problems} van de can sua.${c.reset}`);
  process.exitCode = 1;
} else {
  log(`${c.green}OK: moi duong dan di hai chieu, nam dung tab, va link cu van mo dung bai.${c.reset}`);
}
