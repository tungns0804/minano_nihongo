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
 * `alt` rỗng là cố ý: ảnh chỉ minh họa cho từ đứng ngay cạnh, tả lại bằng chữ thì trình
 * đọc màn hình đọc thừa — và ở câu hỏi Việt → Nhật thì còn đọc lộ đáp án.
 */
@Component({
  selector: 'app-vocab-photo',
  template: `
    <figure class="vocab-photo" [class.is-large]="size() === 'lg'">
      <img [src]="image().src" alt="" loading="lazy" />
      <figcaption>
        <a [href]="image().page" target="_blank" rel="noopener" [title]="lang.t('lesson.photo.source')">{{ image().author }}</a>
        ·
        @if (image().licenseUrl; as url) {
          <a [href]="url" target="_blank" rel="noopener">{{ image().license }}</a>
        } @else {
          {{ image().license }}
        }
      </figcaption>
    </figure>
  `,
  styles: `
    :host {
      display: block;
    }

    .vocab-photo {
      margin: 0;
      width: 132px;
    }

    /* Khoảng cách theo chỗ đặt ảnh ở màn hình luyện tập: dưới gợi ý của câu hỏi, và
       trên dòng ôn lại của phần phản hồi. */
    :host(.prompt-photo) {
      margin-top: 14px;
    }

    :host(.feedback-photo) {
      margin-bottom: 10px;
    }

    .vocab-photo.is-large {
      width: min(280px, 100%);
      margin-inline: auto;
    }

    img {
      display: block;
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: var(--radius-sm);
      background: var(--bg-inset);
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

    .is-large figcaption {
      text-align: center;
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
  /** `sm`: ô 132px của bảng từ và phần phản hồi; `lg`: ảnh to giữa thẻ câu hỏi. */
  readonly size = input<'sm' | 'lg'>('sm');
}
