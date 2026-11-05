import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../core/i18n/language-store';
import type { MessageKey } from '../core/i18n/messages';

/** Một phần tử trong dãy để chuyển qua lại: bài học, chủ đề, chữ Hán, bộ thủ… */
export interface PagerItem {
  key: string;
  name: string;
  path: string;
  /** Tham số kèm đường dẫn — ví dụ `?lesson=` để lật chữ mà vẫn nhớ đang đi từ bài nào. */
  query?: Readonly<Record<string, string>>;
}

/**
 * "← Trước · Sau →" ở cuối trang chi tiết: hai nút dẫn sang phần tử kề trong cùng
 * một dãy. Ai gọi thì tự quyết dãy là gì (bài cùng loại, chữ cùng cấp, bộ theo số
 * thứ tự) — component này chỉ tìm vị trí hiện tại và vẽ.
 *
 * Là MỘT hàng nút gọn ở hai đầu chứ không phải hai thẻ lớn chia đôi bề ngang: hai
 * thẻ cao 70px chỉ để chứa hai dòng chữ là thêm hai khối nặng nề cuối mỗi trang, và
 * ở chữ đầu dãy (chỉ có "Chữ sau") thì nửa trái bỏ trống trông như vỡ bố cục. Ở đây
 * mỗi nút vừa đúng nội dung, nút còn lại vẫn đứng đúng phía của nó.
 */
@Component({
  selector: 'app-sibling-pager',
  imports: [RouterLink],
  template: `
    @if (prev() || next()) {
      <nav class="pager" [attr.aria-label]="t('pager.aria')">
        @if (prev(); as item) {
          <a class="pager-link" [routerLink]="item.path" [queryParams]="item.query">
            <span class="pager-arrow" aria-hidden="true">←</span>
            <span class="pager-text">
              <span class="pager-dir">{{ t(prevKey()) }}</span>
              <span class="pager-name">{{ item.name }}</span>
            </span>
          </a>
        }
        @if (next(); as item) {
          <a class="pager-link pager-next" [routerLink]="item.path" [queryParams]="item.query">
            <span class="pager-text">
              <span class="pager-dir">{{ t(nextKey()) }}</span>
              <span class="pager-name">{{ item.name }}</span>
            </span>
            <span class="pager-arrow" aria-hidden="true">→</span>
          </a>
        }
      </nav>
    }
  `,
  styles: `
    .pager {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-3);
    }

    .pager-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      /* Hai nút cùng hàng không bao giờ chen nhau: mỗi nút tối đa nửa hàng, tên dài
         thì xuống dòng (tên bài như "Từ vựng N3 · 名詞 — Bài 4"). */
      max-width: calc(50% - var(--sp-3) / 2);
      min-width: 0;
      padding: 8px 14px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg-elevated);
      color: var(--text);
      transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease);
    }

    .pager-link:hover {
      border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
      background: var(--bg-subtle);
      text-decoration: none;
    }

    /* Chỉ có "sau" thì nút vẫn nằm bên phải — đó là hướng người học đang đi tới. */
    .pager-next {
      margin-left: auto;
      text-align: right;
    }

    .pager-arrow {
      flex: none;
      color: var(--accent);
      font-weight: 700;
    }

    .pager-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .pager-dir {
      color: var(--text-faint);
      font-size: var(--fs-2xs);
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    /* Xuống dòng tối đa hai dòng chứ không cắt ở dòng đầu: tên bài khác nhau ở CUỐI
       ("… — Bài 4" / "… — Bài 6"), cắt ở dòng đầu thì trên điện thoại hai nút trông
       y hệt nhau. */
    .pager-name {
      font-family: var(--font-jp);
      font-weight: 600;
      overflow-wrap: anywhere;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiblingPager {
  private readonly lang = inject(LanguageStore);
  protected readonly t = this.lang.t.bind(this.lang);

  readonly items = input.required<readonly PagerItem[]>();
  readonly currentKey = input.required<string>();
  /** Nhãn của hai hướng — "Bài trước", "Chữ trước"… theo thứ đang lật. */
  readonly prevKey = input<MessageKey>('pager.prev');
  readonly nextKey = input<MessageKey>('pager.next');

  private readonly index = computed(() => this.items().findIndex((item) => item.key === this.currentKey()));
  protected readonly prev = computed(() => (this.index() > 0 ? this.items()[this.index() - 1] : null));
  protected readonly next = computed(() => {
    const index = this.index();
    return index >= 0 && index < this.items().length - 1 ? this.items()[index + 1] : null;
  });
}
