import { Injectable, signal } from '@angular/core';

import { readJson, writeJson } from '../services/local-storage';

const STORAGE_KEY = 'jp-practice:show-vocab-images';

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

  set(show: boolean): void {
    if (show === this.showRef()) return;
    this.showRef.set(show);
    writeJson(STORAGE_KEY, show);
  }
}
