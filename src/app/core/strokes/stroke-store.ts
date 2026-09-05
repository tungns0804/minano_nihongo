import { Injectable, signal } from '@angular/core';

import { STROKE_CHARS } from './stroke-coverage';
import { Stroke, decodeStrokes } from './stroke.model';

/**
 * Kho nét viết của chữ Hán, nạp theo yêu cầu.
 *
 * `stroke-data.ts` nặng gần nửa MB nên KHÔNG được import thẳng: nó chỉ đi vào một
 * gói riêng, tải lúc người học thật sự mở phần luyện viết. Mọi màn hình khác của
 * ứng dụng không phải trả cân nặng đó.
 *
 * Còn câu hỏi "chữ này có viết được không" thì trả lời được ngay mà không cần tải
 * gì: danh sách chữ nằm ở `stroke-coverage.ts` — vài kB, đủ để màn hình danh sách
 * đếm số câu trước khi bắt đầu phiên.
 */
@Injectable({ providedIn: 'root' })
export class StrokeStore {
  private data: Readonly<Record<string, string>> | null = null;
  private request: Promise<void> | null = null;

  /** Đã có dữ liệu chưa — signal để template vẽ lại khi tải xong. */
  readonly ready = signal(false);

  /**
   * Tải dữ liệu nét, dùng lại lời hứa đang chạy nếu được gọi nhiều lần.
   *
   * Màn hình luyện tập gọi ở lần dựng đầu tiên, còn từng câu hỏi thì chỉ đọc
   * `ready()` — nếu không thì mở một phiên hai mươi câu là hai mươi lời gọi.
   */
  load(): Promise<void> {
    if (this.request) return this.request;

    this.request = import('./stroke-data').then(({ STROKE_DATA }) => {
      this.data = STROKE_DATA;
      this.ready.set(true);
    });

    return this.request;
  }

  /** Nét của một chữ; null khi chưa tải xong hoặc KanjiVG không có chữ đó. */
  strokesOf(char: string): Stroke[] | null {
    const code = this.data?.[char];
    return code ? decodeStrokes(code) : null;
  }
}

const COVERED = new Set(STROKE_CHARS);

/**
 * Chữ này có dữ liệu nét để luyện viết không.
 *
 * Là hàm thường chứ không phải phương thức của kho: màn hình danh sách hỏi nó cho
 * hàng nghìn chữ mỗi lần lọc, mà câu trả lời không phụ thuộc trạng thái tải.
 */
export function canDraw(char: string): boolean {
  return COVERED.has(char);
}
