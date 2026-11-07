import { Injectable, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { LanguageStore } from './i18n/language-store';
import type { MessageKey } from './i18n/messages';
import { pathOf } from './paths';
import { PageLabel } from './services/page-label';

/**
 * Ghép tiêu đề của từng trang với tên ứng dụng, theo ngôn ngữ đang chọn.
 *
 * Không có cái này thì `title` khai báo ở route sẽ ghi đè hẳn tiêu đề trong
 * index.html, khiến tab mất tên ứng dụng ngay khi điều hướng sang trang khác.
 *
 * Route khai báo `title` là một MessageKey (xem app.routes.ts) chứ không phải chữ
 * sẵn, nên đổi ngôn ngữ là tiêu đề tab đổi theo.
 *
 * Trang bài thì tên BÀI đứng trước ("Bài 12 · Ngữ pháp · …") thay cho tên chung của
 * màn hình ("Bài ngữ pháp · …"), lấy từ `PageLabel` khi dữ liệu bài đã về: năm mươi
 * tab cùng một tiêu đề thì lịch sử trình duyệt và dấu trang không phân biệt nổi.
 */
@Injectable({ providedIn: 'root' })
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly lang = inject(LanguageStore);
  private readonly pageLabel = inject(PageLabel);

  // KHÔNG được inject Router ở đây: Router cần TitleStrategy, inject ngược lại
  // sẽ tạo vòng phụ thuộc và Angular ném NG0200 ngay lúc khởi động.
  private readonly current = signal<{ key: MessageKey | null; path: string }>({
    key: null,
    path: '/',
  });

  constructor() {
    super();
    // Đổi ngôn ngữ, hay trang bài vừa có tên, thì đặt lại tiêu đề của đúng trang đang mở.
    effect(() => {
      this.lang.language();
      const { key, path } = this.current();
      const label = this.pageLabel.labelOf(path);
      const appName = this.lang.t('app.title');
      const page = label ? (label.key ? this.lang.t(label.key) : label.text) : key ? this.lang.t(key) : '';
      this.title.setTitle(page ? `${page} · ${appName}` : appName);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const raw = this.buildTitle(snapshot);
    this.current.set({ key: (raw as MessageKey | undefined) ?? null, path: pathOf(snapshot.url) });
  }
}
