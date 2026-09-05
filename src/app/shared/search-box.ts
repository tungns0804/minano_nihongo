import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import { valueOf } from '../core/utils/dom-events';

/**
 * Ô tìm kiếm với biểu tượng kính lúp và nút ✕ xoá nhanh.
 *
 * Mười màn hình có ô này, và trước đây cả mười chép nguyên hai mươi tám dòng
 * markup giống hệt nhau — kể cả cái SVG kính lúp. Khác nhau đúng hai chỗ: chữ
 * placeholder và nhãn cho trình đọc màn hình.
 *
 * Nhận CHỮ đã dịch chứ không nhận khoá thông điệp: hai màn hình có placeholder
 * đổi theo loại bài đang mở (`t(kindLabelKeys().search)`), nên khoá cố định không
 * đủ. Nút ✕ thì tự dịch lấy vì chữ của nó ở đâu cũng như nhau.
 *
 * Selector gắn class `search` vào chính thẻ host: kiểu dáng của ô nằm ở
 * `styles.css` và trông cậy vào việc khung ngoài cùng mang class đó.
 */
@Component({
  selector: 'app-search-box',
  host: { class: 'search' },
  template: `
    <span class="search-icon" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="9" cy="9" r="6" />
        <path d="M13.5 13.5 17 17" stroke-linecap="round" />
      </svg>
    </span>
    <input
      type="search"
      class="input"
      [placeholder]="placeholder()"
      [value]="value()"
      (input)="changed.emit(read($event))"
      [attr.aria-label]="ariaLabel()"
    />
    @if (value()) {
      <button
        type="button"
        class="search-clear"
        (click)="changed.emit('')"
        [title]="clearLabel()"
        [attr.aria-label]="clearLabel()"
      >
        <span aria-hidden="true">✕</span>
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBox {
  private readonly lang = inject(LanguageStore);

  readonly value = input('');
  readonly placeholder = input.required<string>();
  /** Nhãn cho trình đọc màn hình; bỏ trống thì dùng luôn placeholder. */
  readonly label = input('');

  readonly changed = output<string>();

  readonly ariaLabel = computed(() => this.label() || this.placeholder());
  readonly clearLabel = computed(() => this.lang.t('home.search.clear'));

  read(event: Event): string {
    return valueOf(event);
  }
}
