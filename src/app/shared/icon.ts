import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'book'
  | 'layers'
  | 'target'
  | 'pencil'
  | 'blocks'
  | 'cap'
  | 'clipboard'
  | 'upload'
  | 'globe'
  | 'contrast'
  | 'sun'
  | 'moon'
  | 'candle';

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
        @case ('clipboard') {
          <rect x="5" y="4" width="14" height="17" rx="2" />
          <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
          <path d="m9 13 2 2 4-4" />
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
