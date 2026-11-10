/**
 * Đổi qua lại hiragana ↔ katakana. Hai bảng nằm cách nhau đúng 0x60 trong Unicode, nên
 * độ dài chuỗi không đổi — vị trí ký tự trước và sau khi đổi khớp nhau từng chữ.
 */

const KATAKANA = /[ァ-ヶ]/g;
const HIRAGANA = /[ぁ-ゖ]/g;

export function toHiragana(text: string): string {
  return text.replace(KATAKANA, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export function toKatakana(text: string): string {
  return text.replace(HIRAGANA, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}
