import { Injectable, signal } from '@angular/core';

import { readJson, removeKey, writeJson } from '../services/local-storage';

/**
 * Khoá mang hậu tố "-v2" là có chủ ý. Khoá cũ ('jp-practice:show-vocab-images') đang giữ
 * một lần tắt ảnh từ trước, và vì công tắc dùng chung cho cả bảng từ, người học tưởng
 * ảnh đã bị câu ví dụ thay mất. Ngày 2026-11-07 người học yêu cầu ảnh BẬT làm mặc định
 * và bật lại trên máy họ — đổi khoá là cách bật lại đúng một lần: lần tắt cũ bị bỏ qua,
 * còn từ đây tắt đi thì vẫn được nhớ như trước.
 */
const STORAGE_KEY = 'jp-practice:show-vocab-images-v2';
const OLD_STORAGE_KEY = 'jp-practice:show-vocab-images';

/**
 * Hiện hay ẩn ảnh minh họa của từ vựng — MỘT lựa chọn cho cả bảng từ, phiên luyện và
 * phiên Ôn tập, nhớ qua các lần mở app.
 *
 * Một lựa chọn chung chứ không phải mỗi chỗ một công tắc: tắt ảnh là để tự nhớ nghĩa mà
 * không dựa vào hình, và người học muốn điều đó ở mọi chỗ một lúc. Tắt ảnh không giấu
 * ảnh khỏi phần phản hồi sau khi chấm — như âm Hán Việt, nhìn lại sau khi đã trả lời là
 * lúc ảnh giúp nhớ chứ không còn là gợi ý.
 */
@Injectable({ providedIn: 'root' })
export class ImagePreference {
  private readonly showRef = signal(readJson<unknown>(STORAGE_KEY, true) !== false);
  readonly show = this.showRef.asReadonly();

  constructor() {
    removeKey(OLD_STORAGE_KEY);
  }

  set(show: boolean): void {
    if (show === this.showRef()) return;
    this.showRef.set(show);
    writeJson(STORAGE_KEY, show);
  }
}
