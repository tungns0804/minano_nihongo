import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../core/i18n/language-store';
import type { MessageKey } from '../core/i18n/messages';

/** Một phần tử trong dãy để chuyển qua lại: bài học, chủ đề, chữ Hán, bộ thủ… */
export interface PagerItem {
  key: string;
  name: string;
  path: string;
}

/**
 * "← Trước · Sau →" ở cuối trang chi tiết: hai thẻ dẫn sang phần tử kề trong cùng
 * một dãy. Ai gọi thì tự quyết dãy là gì (bài cùng loại, chữ cùng cấp, bộ theo số
 * thứ tự) — component này chỉ tìm vị trí hiện tại và vẽ.
 */
@Component({
  selector: 'app-sibling-pager',
  imports: [RouterLink],
  template: `
    @if (prev() || next()) {
      <nav class="pager" [attr.aria-label]="t('pager.aria')">
        @if (prev(); as item) {
          <a class="card pager-link" [routerLink]="item.path">
            <span class="pager-dir">← {{ t(prevKey()) }}</span>
            <span class="pager-name">{{ item.name }}</span>
          </a>
        } @else {
          <span></span>
        }
        @if (next(); as item) {
          <a class="card pager-link pager-next" [routerLink]="item.path">
            <span class="pager-dir">{{ t(nextKey()) }} →</span>
            <span class="pager-name">{{ item.name }}</span>
          </a>
        }
      </nav>
    }
  `,
  styles: `
    .pager {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--sp-3);
    }

    .pager-link {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 14px 18px;
      color: var(--text);
      transition: border-color var(--dur) var(--ease);
    }

    .pager-link:hover {
      border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
      text-decoration: none;
    }

    .pager-next {
      grid-column: 2;
      text-align: right;
    }

    .pager-dir {
      color: var(--accent);
      font-size: var(--fs-xs);
      font-weight: 700;
    }

    .pager-name {
      font-family: var(--font-jp);
      font-weight: 600;
      overflow-wrap: anywhere;
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
