import { Injectable, signal } from '@angular/core';

import type { MessageKey } from '../i18n/messages';

/** Tên ngắn của trang bài đang mở, gắn với đúng đường dẫn của trang đó. */
export interface PageLabelEntry {
  /** Đường dẫn trần (`pathOf`) của trang đặt tên này. */
  readonly path: string;
  /** Chữ sẵn — tên bài từ dữ liệu ("Bài 12 · Ngữ pháp", "日 · NHẬT"). */
  readonly text: string;
  /** Khoá thông điệp, cho bài cài trong mã nguồn: đổi ngôn ngữ thì tên đổi theo. */
  readonly key?: MessageKey;
}

/**
 * Tên của trang bài đang mở, cho mắt xích cuối của breadcrumb và cho tiêu đề tab.
 *
 * Vì sao cần: route chỉ biết tên CHUNG của màn hình ("Bài ngữ pháp"), nên trước đây
 * năm mươi bài ngữ pháp có chung một tiêu đề tab và lịch sử trình duyệt là một cột
 * dòng y hệt nhau. Tên thật của bài chỉ có sau khi màn hình nạp xong dữ liệu, nên
 * chính màn hình báo lên đây (`PracticeScreen.labelPage`).
 *
 * Gắn kèm đường dẫn chứ không xoá khi chuyển trang: trang mới có thể đặt tên TRƯỚC
 * khi sự kiện chuyển trang kết thúc, xoá lúc đó là xoá mất tên vừa đặt. Ai đọc thì
 * chỉ nhận tên khi đường dẫn khớp trang đang mở (`labelOf`).
 *
 * Không inject Router: `AppTitleStrategy` cần dịch vụ này, mà Router lại cần
 * TitleStrategy — inject ngược là vòng phụ thuộc NG0200 lúc khởi động.
 */
@Injectable({ providedIn: 'root' })
export class PageLabel {
  private readonly entry = signal<PageLabelEntry | null>(null);

  set(entry: PageLabelEntry): void {
    this.entry.set(entry);
  }

  /** Tên của trang `path`, hoặc null khi trang đó không (hoặc chưa) đặt tên. */
  labelOf(path: string): PageLabelEntry | null {
    const entry = this.entry();
    return entry && entry.path === path ? entry : null;
  }
}
