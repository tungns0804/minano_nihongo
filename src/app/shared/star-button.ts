import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';

/**
 * Nút ★ đánh dấu "chưa nhớ".
 *
 * Mười một chỗ trong ứng dụng có nút này, và cả mười một chép cùng mười bốn dòng
 * markup: đổi class theo trạng thái, `aria-pressed`, nhãn "Bỏ đánh dấu…" / "Đánh
 * dấu…", rồi vẽ ★ hay ☆.
 *
 * Selector là `button[app-star]` chứ không phải một thẻ riêng: nút này nằm trong
 * ô bảng, nằm cạnh link trong lưới chữ (được định vị tuyệt đối), nằm trong dòng
 * ví dụ ngữ pháp — bọc thêm một thẻ ngoài sẽ phá bố cục của cả ba chỗ đó.
 *
 * Sự kiện bấm để nguyên cho nơi gọi: `(click)` trên chính thẻ này chạy đúng như
 * với một `<button>` thường, nên không cần thêm một output chỉ để chuyển tiếp.
 */
@Component({
  selector: 'button[app-star]',
  host: {
    type: 'button',
    class: 'star-btn',
    '[class.is-on]': 'on()',
    '[attr.aria-pressed]': 'on()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.title]': 'title() || null',
  },
  template: `{{ on() ? '★' : '☆' }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarButton {
  private readonly lang = inject(LanguageStore);

  readonly on = input.required<boolean>();
  /** Tên của mục, ghép vào nhãn "Đánh dấu {name}". */
  readonly name = input('');
  /** Nhãn cố định, dùng ở nơi nút không gắn với một mục có tên (màn hình luyện tập). */
  readonly label = input('');
  readonly title = input('');

  readonly ariaLabel = computed(
    () =>
      this.label() ||
      this.lang.t(this.on() ? 'favorite.remove' : 'favorite.add', { name: this.name() }),
  );
}
