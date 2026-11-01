#!/usr/bin/env node
/**
 * Tải ảnh minh họa (ảnh thật trên Wikimedia Commons) cho từ vựng.
 *
 *   src/app/core/images/vocab-images.ts (VOCAB_IMAGES)  ->  public/images/vocab/<băm>.jpg|png
 *
 * Cách dùng:
 *   npm run generate:images             Tải những ảnh còn thiếu, xoá ảnh không còn dùng
 *   npm run verify:images               Chỉ kiểm tra, không tải gì (dùng cho CI)
 *
 * Bảng gán nằm trong mã nguồn của app (`vocab-images.ts`) và script nạp thẳng file đó,
 * nên tên file tải về và tên file app đi tìm không thể lệch nhau. Ảnh lưu sẵn trong repo
 * chứ không lấy từ Commons lúc chạy: trang không phụ thuộc dịch vụ bên ngoài, và CI không
 * cần mạng để kiểm.
 *
 * `verify:images` còn kiểm:
 *  - mọi từ trong bảng có thật trong một bài học — gõ sai một chữ ở khoá thì ảnh lặng lẽ
 *    không bao giờ hiện. Vì vậy phải chạy sau `npm run generate` (đọc public/lessons/);
 *  - giấy phép là giấy phép tự do và có tên tác giả — app ghi hai thứ đó dưới mỗi ảnh;
 *  - không hai từ dùng chung một ảnh.
 *
 * Tải bằng API công khai của Commons, không cần key. Theo quy định của Wikimedia: gửi kèm
 * User-Agent có địa chỉ liên hệ, và gửi tuần tự, nghỉ giữa các lần.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { c, log, resolveTsImports } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const LESSONS_DIR = join(ROOT, 'public', 'lessons');
const IMAGE_DIR = join(ROOT, 'public', 'images', 'vocab');
const USER_AGENT = 'minano_nihongo-images/1.0 (https://github.com/tungns0804/minano_nihongo)';

// vocab-images.ts import "../audio/vocab-audio" không kèm đuôi file.
resolveTsImports();

const { VOCAB_IMAGES, VOCAB_IMAGE_WIDTH, vocabImageFileName, vocabImageKey } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'images', 'vocab-images.ts')).href
);

const CHECK_ONLY = process.argv.includes('--check');
const problems = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Giấy phép tự do: dùng được miễn ghi tác giả (và chia sẻ cùng giấy phép với BY-SA). */
const FREE_LICENSE = /^(CC0|Public domain|PD|CC BY(-SA)? \d\.\d)\b/i;

// ── Mọi từ trong bảng phải có thật ──────────────────────────────────────────
if (!existsSync(LESSONS_DIR)) {
  log(`${c.red}[LOI] Chua co public/lessons/ — chay "npm run generate" truoc.${c.reset}`);
  process.exit(1);
}
const lessonKeys = new Set();
for (const file of readdirSync(LESSONS_DIR).filter((name) => name.endsWith('.json') && name !== 'index.json')) {
  const lesson = JSON.parse(readFileSync(join(LESSONS_DIR, file), 'utf8'));
  for (const word of lesson.words ?? []) lessonKeys.add(vocabImageKey(word));
}

const owners = new Map();
for (const [key, source] of Object.entries(VOCAB_IMAGES)) {
  if (!lessonKeys.has(key)) problems.push(`"${key}" khong khop tu nao trong bai hoc (sai chu hoac sai cach doc?)`);
  if (!/\.(jpe?g|png)$/i.test(source.file)) problems.push(`"${key}": chi nhan anh .jpg / .png, khong nhan ${source.file}`);
  if (!FREE_LICENSE.test(source.license)) problems.push(`"${key}": giay phep "${source.license}" khong phai giay phep tu do`);
  if (!source.author.trim()) problems.push(`"${key}": thieu ten tac gia`);
  if (owners.has(source.file)) problems.push(`"${key}" va "${owners.get(source.file)}" dung chung anh ${source.file}`);
  owners.set(source.file, key);
}

// ── File ảnh ────────────────────────────────────────────────────────────────
const wanted = new Map(Object.values(VOCAB_IMAGES).map((source) => [vocabImageFileName(source.file), source.file]));
const present = existsSync(IMAGE_DIR) ? new Set(readdirSync(IMAGE_DIR)) : new Set();
const missing = [...wanted.keys()].filter((name) => !present.has(name));
const orphans = [...present].filter((name) => !wanted.has(name));

if (CHECK_ONLY) {
  for (const name of missing) problems.push(`thieu public/images/vocab/${name} (${wanted.get(name)}) — chay "npm run generate:images"`);
  for (const name of orphans) problems.push(`file thua public/images/vocab/${name} — chay "npm run generate:images"`);
} else {
  mkdirSync(IMAGE_DIR, { recursive: true });
  for (const name of missing) {
    const title = wanted.get(name);
    const api = new URL('https://commons.wikimedia.org/w/api.php');
    Object.entries({
      action: 'query',
      format: 'json',
      titles: `File:${title}`,
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: String(VOCAB_IMAGE_WIDTH),
    }).forEach(([k, v]) => api.searchParams.set(k, v));
    const info = await (await fetch(api, { headers: { 'User-Agent': USER_AGENT } })).json();
    const thumb = Object.values(info.query?.pages ?? {})[0]?.imageinfo?.[0]?.thumburl;
    if (!thumb) {
      problems.push(`khong tim thay ${title} tren Commons`);
      continue;
    }
    await sleep(300);
    const response = await fetch(thumb, { headers: { 'User-Agent': USER_AGENT } });
    if (!response.ok) {
      problems.push(`khong tai duoc ${thumb} (HTTP ${response.status})`);
      continue;
    }
    writeFileSync(join(IMAGE_DIR, name), Buffer.from(await response.arrayBuffer()));
    log(`  tai ${name}  <- ${title}`);
    await sleep(300);
  }
  for (const name of orphans) {
    rmSync(join(IMAGE_DIR, name));
    log(`  xoa ${name}`);
  }
}

log(`${c.bold}Anh minh hoa tu vung (Wikimedia Commons)${c.reset}`);
log(`  so tu co anh  : ${Object.keys(VOCAB_IMAGES).length}`);
log(`  so file       : ${wanted.size}`);
log();
if (problems.length === 0) {
  log(`${c.green}OK: du anh cho moi tu trong bang, giay phep hop le, khong co file thua.${c.reset}`);
} else {
  for (const problem of problems) log(`${c.red}[LOI] ${problem}${c.reset}`);
  process.exitCode = 1;
}
