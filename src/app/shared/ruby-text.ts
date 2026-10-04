import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { rubySegments } from '../core/translation/markup';

/**
 * Vẽ một câu viết theo cú pháp của khu Luyện dịch (`{漢字|かな}`, `[a/b]`) thành chữ có
 * furigana. Tắt `furigana` thì chỉ còn chữ Hán, như khi đọc sách không chú âm.
 *
 * Template viết liền một dòng là có chủ ý: xuống dòng giữa các khối @if sẽ chèn khoảng
 * trắng vào giữa câu tiếng Nhật.
 */
@Component({
  selector: 'app-ruby',
  template: `@for (segment of segments(); track $index) {@if (segment.reading && furigana()) {<ruby>{{ segment.base }}<rt>{{ segment.reading }}</rt></ruby>} @else {{{ segment.base }}}}`,
  styles: `
    :host {
      display: inline;
    }

    /* Furigana không bị chọn theo khi bôi đen câu để chép — chép ra phải là câu đọc
       được, không phải 「私わたしは学生がくせい」. */
    rt {
      font-size: 0.55em;
      color: var(--text-muted);
      user-select: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RubyText {
  readonly text = input.required<string>();
  readonly furigana = input(true);

  readonly segments = computed(() => rubySegments(this.text()));
}
