#!/usr/bin/env node
/**
 * Tải hình minh họa (icon OpenMoji) cho từ vựng.
 *
 *   src/app/core/images/vocab-images.ts (VOCAB_IMAGES)  ->  public/images/vocab/<mã>.svg
 *
 * Cách dùng:
 *   npm run generate:images             Tải những hình còn thiếu, xoá hình không còn dùng
 *   npm run verify:images               Chỉ kiểm tra, không tải gì (dùng cho CI)
 *
 * Bảng gán nằm trong mã nguồn của app (`vocab-images.ts`) và script nạp thẳng file đó,
 * nên không có bản chép lại nào để lệch nhau. Hình lưu sẵn trong repo chứ không gọi CDN
 * lúc chạy: trang không phụ thuộc một dịch vụ bên ngoài, và CI không cần mạng để kiểm.
 *
 * `verify:images` còn kiểm mọi từ trong bảng đều có thật trong một bài học — gõ sai một
 * chữ ở khoá thì hình lặng lẽ không bao giờ hiện, không có gì báo cả. Vì vậy phải chạy
 * sau `npm run generate` (đọc public/lessons/).
 *
 * Icon: OpenMoji (https://openmoji.org) — CC BY-SA 4.0.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { c, log } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const LESSONS_DIR = join(ROOT, 'public', 'lessons');
const IMAGE_DIR = join(ROOT, 'public', 'images', 'vocab');

const { OPENMOJI_VERSION, VOCAB_IMAGES, vocabImageKey } = await import(
  pathToFileURL(join(ROOT, 'src', 'app', 'core', 'images', 'vocab-images.ts')).href
);

const CHECK_ONLY = process.argv.includes('--check');
const problems = [];

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
for (const key of Object.keys(VOCAB_IMAGES)) {
  if (!lessonKeys.has(key)) problems.push(`"${key}" khong khop tu nao trong bai hoc (sai chu hoac sai cach doc?)`);
}

// ── Mỗi từ một icon riêng ───────────────────────────────────────────────────
const owners = new Map();
for (const [key, code] of Object.entries(VOCAB_IMAGES)) {
  if (owners.has(code)) problems.push(`"${key}" va "${owners.get(code)}" dung chung icon ${code}`);
  owners.set(code, key);
  if (!/^[0-9A-F]+(-[0-9A-F]+)*$/.test(code)) problems.push(`"${key}": ma icon "${code}" sai dang`);
}

// ── File hình ───────────────────────────────────────────────────────────────
const wanted = new Set(Object.values(VOCAB_IMAGES).map((code) => `${code}.svg`));
const present = existsSync(IMAGE_DIR) ? new Set(readdirSync(IMAGE_DIR).filter((name) => name.endsWith('.svg'))) : new Set();
const missing = [...wanted].filter((name) => !present.has(name));
const orphans = [...present].filter((name) => !wanted.has(name));

if (CHECK_ONLY) {
  for (const name of missing) problems.push(`thieu file public/images/vocab/${name} — chay "npm run generate:images"`);
  for (const name of orphans) problems.push(`file thua public/images/vocab/${name} — chay "npm run generate:images"`);
} else {
  mkdirSync(IMAGE_DIR, { recursive: true });
  for (const name of missing) {
    const url = `https://cdn.jsdelivr.net/npm/openmoji@${OPENMOJI_VERSION}/color/svg/${name}`;
    const response = await fetch(url);
    const body = response.ok ? await response.text() : '';
    if (!body.includes('<svg')) {
      problems.push(`khong tai duoc ${url} (HTTP ${response.status})`);
      continue;
    }
    writeFileSync(join(IMAGE_DIR, name), body);
    log(`  tai ${name}`);
  }
  for (const name of orphans) {
    rmSync(join(IMAGE_DIR, name));
    log(`  xoa ${name}`);
  }
}

log(`${c.bold}Hinh minh hoa tu vung (OpenMoji ${OPENMOJI_VERSION})${c.reset}`);
log(`  so tu co hinh : ${Object.keys(VOCAB_IMAGES).length}`);
log(`  so file       : ${wanted.size}`);
log();
if (problems.length === 0) {
  log(`${c.green}OK: du hinh cho moi tu trong bang, khong co file thua.${c.reset}`);
} else {
  for (const problem of problems) log(`${c.red}[LOI] ${problem}${c.reset}`);
  process.exitCode = 1;
}
