import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'book'
  | 'repeat'
  | 'layers'
  | 'target'
  | 'pencil'
  | 'blocks'
  | 'cap'
  | 'languages'
  | 'clipboard'
  | 'house'
  | 'upload'
  | 'globe'
  | 'contrast'
  | 'sun'
  | 'moon'
  | 'candle'
  | 'volume'
  | 'volume-off';

/**
 * Biểu tượng nét mảnh, vẽ bằng SVG nội tuyến.
 *
 * Vì sao không dùng ký tự (◐ ☀ 🕯) như trước: thanh bên thu gọn chỉ còn biểu
 * tượng, nên biểu tượng phải trông giống nhau trên mọi máy. Ký tự thì mỗi font vẽ
 * một kiểu — 🕯 là ô vuông rỗng trên nhiều máy Windows — và đổi `<html lang>` là
 * trình duyệt chọn font khác, nút nhảy kích thước.
 *
 * Màu lấy `currentColor`, cỡ lấy theo `font-size` của chỗ đặt (1.25em), nên nơi
 * gọi chỉnh bằng CSS như chỉnh chữ.
 */
@Component({
  selector: 'app-icon',
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      @switch (name()) {
        @case ('book') {
          <path d="M2.5 5.5H9a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5h-7z" />
          <path d="M21.5 5.5H15a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5h7z" />
        }
        @case ('repeat') {
          <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" />
          <path d="M20 3.5v5h-5" />
          <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" />
          <path d="M4 20.5v-5h5" />
        }
        @case ('layers') {
          <path d="M12 2.5 2.5 7.5l9.5 5 9.5-5z" />
          <path d="m2.5 12 9.5 5 9.5-5" />
          <path d="m2.5 16.5 9.5 5 9.5-5" />
        }
        @case ('target') {
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        }
        @case ('pencil') {
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
          <path d="m14.5 5.5 3 3" />
        }
        @case ('blocks') {
          <rect x="3" y="3" width="8" height="8" rx="1.5" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" />
          <path d="m17 2.5 4.5 4.5-4.5 4.5L12.5 7z" />
        }
        @case ('cap') {
          <path d="M22 9 12 4 2 9l10 5z" />
          <path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
          <path d="M22 9v6" />
        }
        @case ('languages') {
          <!-- Chữ 文 bên trái, chữ A bên phải: dịch qua lại giữa hai thứ tiếng. -->
          <path d="M3 5.5h9" />
          <path d="M7.5 3.5v2" />
          <path d="M10.5 5.5c-1 3.8-3.6 6.6-7 8" />
          <path d="M5 8.5c1.4 2 3.4 3.5 5.6 4.5" />
          <path d="m12.5 20.5 4.2-9.5 4.3 9.5" />
          <path d="M14 17.3h5.4" />
        }
        @case ('clipboard') {
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
          <path d="m9 13 2 2 4-4" />
        }
        @case ('house') {
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9v11.5h14V9" />
          <path d="M10 20.5v-6h4v6" />
        }
        @case ('upload') {
          <path d="M12 15V3" />
          <path d="m7 8 5-5 5 5" />
          <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        }
        @case ('globe') {
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
        }
        @case ('contrast') {
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
        }
        @case ('sun') {
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
          />
        }
        @case ('moon') {
          <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
        }
        @case ('candle') {
          <path d="M12 2.5c2 2.4 3 4.1 3 5.6a3 3 0 0 1-6 0c0-1.5 1-3.2 3-5.6z" />
          <rect x="8.5" y="13" width="7" height="8.5" rx="1" />
        }
        @case ('volume') {
          <path d="M3.5 9.5h3.2L11.5 5.5v13L6.7 14.5H3.5z" />
          <path d="M15 9.4a4 4 0 0 1 0 5.2" />
          <path d="M17.8 7a7.5 7.5 0 0 1 0 10" />
        }
        @case ('volume-off') {
          <path d="M3.5 9.5h3.2L11.5 5.5v13L6.7 14.5H3.5z" />
          <path d="m15.5 10 5 4" />
          <path d="m20.5 10-5 4" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      width: 1.25em;
      height: 1.25em;
      flex-shrink: 0;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<IconName>();
}
