/**
 * Tiện ích dùng chung cho các script trong thư mục này.
 *
 * Mọi thứ ở đây trước kia được chép vào từng script: bảy script khai lại y hệt
 * bảng mã màu, bốn script khai lại `toFileUrl`, và ba script sinh mã khai lại
 * cùng một khối "so với file cũ rồi ghi hoặc báo lỗi". Chép thì không sai ngay,
 * nhưng nó đã kịp trôi: `quote` ở `generate-radicals.mjs` viết `"\'"` thay vì
 * `"\\'"`, nên nó KHÔNG hề escape dấu nháy như bản ở `generate-kanji.mjs`.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { registerHooks } from 'node:module';

/** Ghi một dòng ra stdout. */
export const log = (msg = '') => process.stdout.write(`${msg}\n`);

// Mã màu ANSI, tự tắt khi output bị pipe vào file hoặc khi đặt biến môi trường NO_COLOR.
const USE_COLOR = process.stdout.isTTY === true && !process.env['NO_COLOR'];
const ESC = String.fromCharCode(27);
const ansi = (code) => (USE_COLOR ? `${ESC}[${code}m` : '');

export const c = {
  reset: ansi(0),
  bold: ansi(1),
  dim: ansi(2),
  red: ansi(31),
  green: ansi(32),
  yellow: ansi(33),
  cyan: ansi(36),
};

/**
 * Đường dẫn Windows -> URL `file:///` để `await import()` nhận được.
 *
 * Tách dấu `\` bằng `String.fromCharCode(92)` chứ không viết thẳng ký tự đó:
 * script này chạy qua `node --experimental-strip-types`, và một dấu gạch ngược
 * trong chuỗi rất dễ bị đọc thành ký tự escape khi ai đó sửa dòng này.
 */
export const toFileUrl = (path) =>
  new URL(`file:///${path.split(String.fromCharCode(92)).join('/')}`).href;

/** Chuỗi TypeScript trong dấu nháy đơn, đã escape dấu nháy nằm trong nội dung. */
export const quote = (text) => `'${text.split("'").join("\\'")}'`;

/**
 * Cho phép nạp thẳng file `.ts` của app dù nó import lẫn nhau KHÔNG kèm đuôi file.
 *
 * Angular/TypeScript viết `import './vocabulary-parser'`, còn Node thì đòi đuôi và
 * chịu thua cả những tên có sẵn dấu chấm (`./kanji.model` bị hiểu là đã có đuôi).
 * Thêm `.ts` khi Node không tìm ra là script chạy được trên ĐÚNG file nguồn mà app
 * đang dùng, thay vì phải chép lại logic sang một bản `.mjs` rồi để hai bản trôi
 * khỏi nhau.
 *
 * Gọi TRƯỚC mọi `await import()` tới file nguồn.
 */
export function resolveTsImports() {
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
}

/**
 * Ghi một file do máy sinh, hoặc chỉ đối chiếu khi chạy với `--check`.
 *
 * Bốn nhánh của nó là bốn tình huống thật, và cả ba script sinh mã đều cần đủ
 * bốn: CI chạy `--check` phải đỏ khi file sinh lệch với nguồn; người sửa dữ liệu
 * chạy không cờ thì hoặc được ghi đè, hoặc được báo "không có gì thay đổi" để
 * biết mình vừa sửa nhầm chỗ.
 *
 * @param {{file: string, text: string}[]} outputs File cần ghi và nội dung mới.
 * @param {{checkOnly: boolean, root: string, rerun: string}} opts
 *   `rerun` là lệnh npm hiện trong thông báo lỗi của `--check`.
 * @returns {boolean} true nếu mọi file đều đã khớp với nguồn.
 */
export function emitGenerated(outputs, { checkOnly, root, rerun }) {
  const short = (file) => file.replace(root, '.');
  const stale = outputs.filter(
    ({ file, text }) => (existsSync(file) ? readFileSync(file, 'utf8') : '') !== text,
  );

  if (checkOnly) {
    if (stale.length === 0) {
      const names = outputs.map(({ file }) => short(file)).join(', ');
      log(`${c.green}OK: ${names} dang khop voi nguon.${c.reset}`);
      return true;
    }
    for (const { file } of stale) {
      log(`${c.red}[LOI] ${short(file)} khong khop voi nguon.${c.reset}`);
    }
    log(`${c.red}      Chay: ${rerun}${c.reset}`);
    process.exitCode = 1;
    return false;
  }

  if (stale.length === 0) {
    log('Khong co gi thay doi.');
    return true;
  }
  for (const { file, text } of stale) {
    writeFileSync(file, text, 'utf8');
    log(`${c.green}Da ghi ${short(file)}${c.reset}`);
  }
  return false;
}
