#!/usr/bin/env node
/**
 * Nạp bộ ngữ pháp N4 của vnjpclub (https://www.vnjpclub.com/ngu-phap-n4/) thành một
 * "sách ngữ pháp" của ứng dụng: src/app/core/exercises/vnjpclub-n4.generated.ts.
 *
 * Mỗi trang mẫu ngữ pháp thành MỘT mục với MỘT mẫu:
 *   - tên mẫu và ý nghĩa: lấy từ tiêu đề trong trang mục lục ("～出す – Bắt đầu đột ngột…");
 *   - bảng "Cấu trúc cơ bản" của trang;
 *   - các câu trong "Ví dụ minh họa", phần in đậm của câu thành chỗ trống 《…》 cho bài
 *     "Điền vào chỗ trống", furigana <ruby> thành {漢字|かな}.
 * Các phần giải thích dài (ý nghĩa chi tiết, sắc thái, so sánh, lỗi thường gặp) KHÔNG
 * chép — mỗi mục dẫn link về trang gốc để đọc đủ.
 *
 * Trang vnjpclub giấu nội dung bài trong thuộc tính data-ykhp: base64 có vài ký tự
 * thay thế (bảng SUB dưới đây). Đổi cách giấu thì script báo lỗi giải mã chứ không
 * sinh ra dữ liệu rác.
 *
 * Chạy:
 *   node scripts/import-vnjpclub.mjs --fetch     tải mục lục + các trang còn thiếu vào .cache/vnjpclub/
 *   node scripts/import-vnjpclub.mjs --refresh   tải lại tất cả
 *   node scripts/import-vnjpclub.mjs           chỉ dựng lại từ cache
 * Sau đó: npm run verify:n4.
 *
 * vnjpclub trả 503 rồi 403 khi bị tải dồn dập (2026-10-23, ở khoảng trang thứ 80):
 * đó là họ chặn, đừng tìm cách lách. Cache giữ lại trang đã tải, nên chỉ cần --fetch
 * cho phần còn thiếu, cách xa nhau, và chỉ khi thật cần.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c, log } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CACHE = join(ROOT, '.cache', 'vnjpclub');
const OUT = join(ROOT, 'src', 'app', 'core', 'exercises', 'vnjpclub-n4.generated.ts');
const INDEX_URL = 'https://www.vnjpclub.com/ngu-phap-n4/';
const PAGE_PREFIX = 'https://www.vnjpclub.com/ngu-phap-n4/';
/** Trang tổng hợp "dễ nhầm" không phải một mẫu ngữ pháp. */
const SKIP = new Set(['ngu-phap-n4-de-nham']);

const SUB = { '&': 'YW', '!': 'W5', '%': 'YXN', '*': 'CAgI', '@': 'CAg', $: 'dGhl' };

// ── Tải ──────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Máy chủ trả 503 khi tải dồn dập: chờ lâu dần rồi thử lại, tối đa bốn lần. */
async function download(url) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (minano-nihongo importer)' } });
    if (res.ok) return res.text();
    if (attempt >= 3 || (res.status !== 503 && res.status !== 429)) throw new Error(`${url}: HTTP ${res.status}`);
    log(`  ${res.status}, cho ${5 * 3 ** attempt}s roi thu lai…`);
    await sleep(5000 * 3 ** attempt);
  }
}

/** Tải mục lục và các trang còn thiếu trong cache; `--refresh` thì tải lại hết. */
async function fetchAll(refresh) {
  mkdirSync(CACHE, { recursive: true });
  const index = await download(INDEX_URL);
  writeFileSync(join(CACHE, 'index.html'), index);
  for (const { slug } of indexEntries(index)) {
    const file = join(CACHE, `${slug}.html`);
    if (!refresh && existsSync(file)) continue;
    const page = await download(`${PAGE_PREFIX}${slug}.html`);
    // Trang chặn trả về 200 nhưng không có bài: đừng lưu nó vào cache như trang thật.
    if (!page.includes('data-ykhp="')) throw new Error(`${slug}: trang trả về không có bài giảng — có thể đã bị chặn`);
    writeFileSync(file, page);
    log(`  tai ${slug}`);
    await sleep(1000);
  }
}

// ── Đọc HTML ─────────────────────────────────────────────────────────────

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#039': "'", nbsp: ' ', '#038': '&' };
function unescape(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (match, dec) => (ENTITIES[`#${dec}`] ?? String.fromCodePoint(Number(dec))))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name] ?? match);
}

/** Danh sách mẫu theo đúng thứ tự trang mục lục: slug, tên mẫu, ý nghĩa. */
function indexEntries(indexHtml) {
  const seen = new Set();
  const out = [];
  const link = /<a[^>]+href="https:\/\/www\.vnjpclub\.com\/ngu-phap-n4\/([a-z0-9-]+)\.html"[^>]*>([\s\S]*?)<\/a>/g;
  for (const [, slug, inner] of indexHtml.matchAll(link)) {
    if (seen.has(slug) || SKIP.has(slug)) continue;
    seen.add(slug);
    const title = unescape(inner.replace(/<[^>]+>/g, '')).trim();
    const dash = title.indexOf(' – ');
    if (dash < 0) continue;
    out.push({ slug, pattern: title.slice(0, dash).trim(), meaning: title.slice(dash + 3).trim() });
  }
  return out;
}

/** Bài giảng của một trang: giải mã data-ykhp, rồi cắt đúng thẻ <section> của bài. */
function articleOf(pageHtml, slug) {
  const start = pageHtml.indexOf('data-ykhp="');
  if (start < 0) throw new Error(`${slug}: không thấy data-ykhp`);
  const blob = unescape(pageHtml.slice(start + 11, pageHtml.indexOf('"', start + 11)));
  const base64 = [...blob].map((ch) => SUB[ch] ?? ch).join('');
  const html = Buffer.from(base64, 'base64').toString('utf8');
  if (html.includes('�')) throw new Error(`${slug}: giải mã ra chữ hỏng — vnjpclub đã đổi cách giấu nội dung?`);
  const from = html.indexOf('<section class="ai-explain-body">');
  if (from < 0) throw new Error(`${slug}: không thấy phần bài giảng`);
  return html.slice(from, html.indexOf('</section>', from));
}

/** Các phần "<h3>N. Tên</h3> nội dung" của bài, theo số thứ tự. */
function partsOf(article) {
  const parts = new Map();
  const pieces = article.split(/<h3>/).slice(1);
  for (const piece of pieces) {
    const end = piece.indexOf('</h3>');
    const number = Number(/^\s*(\d+)\./.exec(piece.slice(0, end))?.[1]);
    if (number) parts.set(number, piece.slice(end + 5));
  }
  return parts;
}

/**
 * Chuyển một đoạn HTML sang cú pháp câu của ứng dụng: <ruby> → {漢字|かな}, <b> → 《…》
 * (chỉ khi `blanks`), bỏ mọi thẻ khác. Ngoặc vuông / nhọn trong chữ là ký hiệu của cú
 * pháp ([a/b], {…|…}) nên đổi sang dạng toàn khổ.
 */
function markup(fragment, { blanks = false } = {}) {
  let text = fragment
    .replace(/<rp>[\s\S]*?<\/rp>/g, '')
    // Lỗi của trang gốc: thẻ in đậm rỗng đứng ngay SAU chữ có furigana (会議中<b></b>です)
    // — phần in đậm thật là chính chữ đó.
    .replace(/(<ruby>(?:(?!<ruby>)[\s\S])*?<\/ruby>)<b><\/b>/g, '<b>$1</b>')
    .replace(/[[\]{}|《》@]/g, (ch) => ({ '[': '［', ']': '］', '{': '｛', '}': '｝', '|': '｜', '《': '〈', '》': '〉', '@': '＠' })[ch])
    .replace(/<ruby>([\s\S]*?)<rt>([\s\S]*?)<\/rt><\/ruby>/g, (_, base, reading) => `{${base}|${reading}}`);
  // Furigana của cả cụm đặt trên chữ đầu, chữ sau để trống ({一|いちど}{度|}): gộp lại.
  let merged;
  while ((merged = text.replace(/\{([^|{}]+)\|([^{}]+)\}\{([^|{}]+)\|\}/g, '{$1$3|$2}')) !== text) text = merged;
  text = text.replace(/\{([^|{}]+)\|\}/g, '$1');
  text = blanks ? text.replace(/<b>/g, '《').replace(/<\/b>/g, '》') : text.replace(/<\/?b>/g, '');
  return unescape(text.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, ''))
    // Phần có thể bỏ, trang gốc viết trong ngoặc: しないと（いけない） → [いけない/].
    .replace(/（([ぁ-ゟ]+)）/g, '[$1/]')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Chữ cái tiếng Việt có dấu — câu ví dụ lẫn chúng là dòng so sánh viết kèm chú thích. */
const VIETNAMESE_LETTER = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

/** Bản dịch: dấu "/" là chữ thường trong cú pháp câu — đổi thành dấu phẩy. */
function vietnamese(fragment) {
  return markup(fragment).replace(/\s*\/\s*/g, ', ');
}

function tableOf(html, caption) {
  const head = /<thead>([\s\S]*?)<\/thead>/.exec(html)?.[1] ?? '';
  const body = /<tbody>([\s\S]*?)<\/tbody>/.exec(html)?.[1] ?? '';
  const cells = (row, tag) => [...row.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g'))].map((m) => markup(m[1]));
  const headers = cells(head, 'th');
  const rows = [...body.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map((m) => cells(m[1], 'td'))
    .filter((row) => row.length === headers.length);
  return headers.length > 0 && rows.length > 0 ? { caption, headers, rows } : null;
}

function examplesOf(html) {
  const items = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  const out = [];
  for (const item of items) {
    const br = item.search(/<br\s*\/?>/);
    if (br < 0) continue;
    const japanese = markup(item.slice(0, br), { blanks: true });
    const translation = vietnamese(item.slice(br).replace(/^<br\s*\/?>/, ''));
    // Câu không có phần in đậm thì không đục lỗ được — bỏ, mọi câu đem ra luyện đều đi
    // qua bậc "Điền vào chỗ trống".
    if (!japanese.includes('《') || !translation) continue;
    if (VIETNAMESE_LETTER.test(japanese)) continue;
    out.push([japanese, translation]);
  }
  return out;
}

// ── Dựng sách ────────────────────────────────────────────────────────────

/** Ý nghĩa bỏ phần trong ngoặc — mẫu cùng "gốc" nghĩa là nhóm dễ nhầm. */
const stem = (meaning) => meaning.replace(/\s*\([^)]*\)\s*/g, '').replace(/[…\s]+$/u, '').toLowerCase();

function build() {
  const index = indexEntries(readFileSync(join(CACHE, 'index.html'), 'utf8'));
  const sections = [];
  const skipped = [];
  const missing = [];
  for (const entry of index) {
    const file = join(CACHE, `${entry.slug}.html`);
    if (!existsSync(file)) {
      missing.push(entry.slug);
      continue;
    }
    const parts = partsOf(articleOf(readFileSync(file, 'utf8'), entry.slug));
    const examples = examplesOf(parts.get(3) ?? '');
    if (examples.length === 0) {
      skipped.push(entry.slug);
      continue;
    }
    const structure = tableOf(parts.get(1) ?? '', 'Cấu trúc cơ bản');
    sections.push({
      id: `vj-${entry.slug}`,
      // Tên mục chỉ là tên mẫu: ý nghĩa đã hiện ngay dòng dưới.
      title: entry.pattern,
      source: `${PAGE_PREFIX}${entry.slug}.html`,
      points: [
        {
          id: `vj-${entry.slug}`,
          pattern: entry.pattern,
          meaning: entry.meaning,
          ...(structure ? { tables: [structure] } : {}),
          examples,
        },
      ],
    });
  }

  // Nhóm dễ nhầm: các mẫu cùng gốc nghĩa ("Phải…", "Phải… (lịch sự)"…). Trong câu chúng
  // thường thay được cho nhau, nên cũng là nhóm bài điền chỗ trống không lấy làm nhiễu.
  // Mẫu TRÙNG HẲN ý nghĩa ("Khi…" của たときに và るときに) là đồng nghĩa.
  const byStem = new Map();
  const byMeaning = new Map();
  for (const section of sections) {
    const point = section.points[0];
    byStem.set(stem(point.meaning), [...(byStem.get(stem(point.meaning)) ?? []), point]);
    byMeaning.set(point.meaning, [...(byMeaning.get(point.meaning) ?? []), point.id]);
  }
  const groups = [];
  for (const [key, points] of byStem) {
    if (points.length < 2) continue;
    const group = `vj-${groups.length + 1}`;
    groups.push(group);
    for (const point of points) point.group = group;
    log(`  nhom ${group}: ${key} (${points.map((p) => p.pattern).join(', ')})`);
  }
  const synonyms = [...byMeaning.values()].filter((ids) => ids.length > 1);
  return { sections, groups, synonyms, skipped, missing };
}

function write({ sections, groups, synonyms }) {
  const json = (value) => JSON.stringify(value, null, 2);
  writeFileSync(
    OUT,
    `// SINH TỰ ĐỘNG bởi scripts/import-vnjpclub.mjs — đừng sửa tay, sửa script rồi chạy lại.
// Nguồn: ${INDEX_URL} (mỗi mục dẫn link về trang gốc của nó).

import type { RawSection } from './grammar-book.build';

export const VNJPCLUB_RAW_SECTIONS: readonly RawSection[] = ${json(sections)};

export const VNJPCLUB_INTERCHANGEABLE_GROUPS: readonly string[] = ${json(groups)};

export const VNJPCLUB_SYNONYMS: readonly (readonly string[])[] = ${json(synonyms)};
`,
  );
}

if (process.argv.includes('--fetch') || process.argv.includes('--refresh')) {
  await fetchAll(process.argv.includes('--refresh'));
}
const result = build();
write(result);
const exampleCount = result.sections.reduce((sum, s) => sum + s.points[0].examples.length, 0);
log(`${c.green}OK: ${result.sections.length} muc, ${exampleCount} cau vi du -> ${OUT}${c.reset}`);
if (result.missing.length > 0) log(`${c.yellow}  chua tai duoc (chay --fetch khi can): ${result.missing.join(', ')}${c.reset}`);
if (result.skipped.length > 0) log(`${c.yellow}  bo qua (khong co cau vi du in dam): ${result.skipped.join(', ')}${c.reset}`);
