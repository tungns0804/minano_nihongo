import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import type { VocabImage } from '../core/images/vocab-images';

/**
 * Ảnh minh họa của một từ kèm dòng ghi nguồn: tác giả (trỏ về trang ảnh trên Commons) và
 * giấy phép (trỏ về trang giấy phép).
 *
 * Ảnh và dòng ghi nguồn đi chung một component để không chỗ nào vẽ ảnh mà quên ghi nguồn:
 * ảnh CC BY / CC BY-SA bắt buộc ghi tác giả và giấy phép ở chính chỗ dùng ảnh.
 *
 * Ngoại lệ duy nhất là cỡ `thumb` (ảnh nhỏ trong bảng từ): nó không có dòng chữ dưới ảnh,
 * vì hai dòng ghi nguồn cao gần bằng chính cái ảnh và làm mỗi hàng của bảng cao gấp đôi.
 * Bù lại, nơi dùng `thumb` PHẢI bọc nó trong một nút mở cỡ `xl` — khung phóng to có đủ
 * tác giả, giấy phép và link — và ghi tác giả vào `title` của nút. Giấy phép CC cho ghi
 * nguồn "theo cách hợp lý với phương tiện"; một bấm là tới là cách hợp lý ở đây.
 *
 * `alt` rỗng là cố ý: ảnh chỉ minh họa cho từ đứng ngay cạnh, tả lại bằng chữ thì trình
 * đọc màn hình đọc thừa — và ở câu hỏi Việt → Nhật thì còn đọc lộ đáp án.
 */
@Component({
  selector: 'app-vocab-photo',
  template: `
    <figure class="vocab-photo" [attr.data-size]="size()">
      <img [src]="image().src" alt="" [attr.loading]="size() === 'xl' ? null : 'lazy'" />
      @if (size() !== 'thumb') {
        <figcaption>
          <a [href]="image().page" target="_blank" rel="noopener" [title]="lang.t('lesson.photo.source')">{{ image().author }}</a>
          ·
          @if (image().licenseUrl; as url) {
            <a [href]="url" target="_blank" rel="noopener">{{ image().license }}</a>
          } @else {
            {{ image().license }}
          }
          @if (size() === 'xl') {
            · <a [href]="image().page" target="_blank" rel="noopener">{{ lang.t('lesson.photo.source') }} ↗</a>
          }
        </figcaption>
      }
    </figure>
  `,
  styles: `
    :host {
      display: block;
    }

    .vocab-photo {
      margin: 0;
      width: 120px;
    }

    /* Khoảng cách theo chỗ đặt ảnh ở màn hình luyện tập: dưới gợi ý của câu hỏi, và
       trên dòng ôn lại của phần phản hồi. */
    :host(.prompt-photo) {
      margin-top: 14px;
    }

    :host(.feedback-photo) {
      margin-bottom: 10px;
    }

    .vocab-photo[data-size='lg'] {
      width: min(280px, 100%);
      margin-inline: auto;
    }

    /* Ảnh nhỏ trong bảng từ: đủ nhận ra hình, đủ thấp để hàng chỉ cao bằng hai dòng chữ. */
    .vocab-photo[data-size='thumb'] {
      width: 72px;
    }

    .vocab-photo[data-size='xl'] {
      width: 100%;
    }

    img {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: var(--radius-sm);
      background: var(--bg-inset);
      box-shadow: var(--shadow-sm);
    }

    /* Khung phóng to hiện CẢ ảnh, không cắt về 4:3 như ảnh nhỏ: phóng to lên mà vẫn mất
       hai mép thì người học không bao giờ được thấy phần ảnh bị cắt. Ảnh dọc thì giới hạn
       theo chiều cao để nút và chữ bên dưới vẫn nằm trong màn hình. */
    [data-size='xl'] img {
      width: auto;
      max-width: 100%;
      max-height: min(52vh, 420px);
      aspect-ratio: auto;
      object-fit: contain;
      margin-inline: auto;
    }

    /* Dòng ghi nguồn nhỏ và nhạt: bắt buộc phải có, nhưng không được giành mắt với từ. */
    figcaption {
      margin-top: 3px;
      font-size: 0.68rem;
      line-height: 1.35;
      color: var(--text-faint);
      overflow-wrap: anywhere;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    [data-size='lg'] figcaption {
      text-align: center;
    }

    /* Ở khung phóng to dòng ghi nguồn là nơi DUY NHẤT người học đọc được tác giả của ảnh
       nhỏ trong bảng, nên không cắt dòng và chữ to hơn một chút. */
    [data-size='xl'] figcaption {
      margin-top: 6px;
      font-size: var(--fs-xs);
      text-align: center;
      display: block;
      overflow: visible;
    }

    a {
      color: inherit;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabPhoto {
  readonly lang = inject(LanguageStore);
  readonly image = input.required<VocabImage>();
  /**
   * `sm`: ô 120px ở phần phản hồi khi luyện; `lg`: ảnh to giữa thẻ câu hỏi;
   * `thumb`: ảnh nhỏ 72px của bảng từ, KHÔNG có dòng ghi nguồn (xem chú thích lớp);
   * `xl`: khung phóng to, cả ảnh không cắt, ghi nguồn đầy đủ.
   */
  readonly size = input<'sm' | 'lg' | 'thumb' | 'xl'>('sm');
}
