import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { RubySegment, rubySegments, writtenSegments } from '../core/translation/markup';

interface Piece extends RubySegment {
  /** Nằm trong 〈…〉 — phần gạch chân của câu đề thi. */
  underline: boolean;
}

/**
 * Tách 〈…〉 ra khỏi các đoạn chữ thường và đánh dấu mọi đoạn nằm giữa hai dấu đó.
 *
 * Làm ở đây chứ không thêm vào cú pháp của `markup.ts`: dấu gạch chân chỉ có ở câu đề
 * thi, mà cú pháp kia còn là thứ bộ chấm dùng để so câu trả lời — thêm một ký hiệu vào
 * đó là phải sửa cả bộ chấm lẫn mọi script kiểm dữ liệu.
 */
function underlined(segments: readonly RubySegment[]): Piece[] {
  let inside = false;
  const pieces: Piece[] = [];
  for (const segment of segments) {
    if (segment.reading !== null) {
      pieces.push({ ...segment, underline: inside });
      continue;
    }
    for (const part of segment.base.split(/([〈〉])/)) {
      if (part === '〈' || part === '〉') inside = part === '〈';
      else if (part) pieces.push({ base: part, reading: null, underline: inside });
    }
  }
  return pieces;
}

/**
 * Vẽ một câu viết theo cú pháp của khu Luyện dịch (`{漢字|かな}`, `[a/b]`) thành chữ có
 * furigana. Tắt `furigana` thì chỉ còn chữ Hán, như khi đọc sách không chú âm.
 *
 * Mặc định [a/b] chỉ hiện lựa chọn đầu: ở khu Luyện dịch các lựa chọn khác là cách nói
 * được chấp nhận ngầm. Bật `written` thì hiện đủ như văn bản gốc viết (いつ/何時に,
 * 場合（は）) — xem `writtenSegments`. Bật `underline` thì 〈…〉 thành chữ gạch chân,
 * như phần được hỏi trong câu đề thi.
 *
 * Template viết liền một dòng là có chủ ý: xuống dòng giữa các khối @if sẽ chèn khoảng
 * trắng vào giữa câu tiếng Nhật.
 */
@Component({
  selector: 'app-ruby',
  template: `@for (segment of segments(); track $index) {@if (segment.underline) {<u>@if (segment.reading && furigana()) {<ruby>{{ segment.base }}<rt>{{ segment.reading }}</rt></ruby>} @else {{{ segment.base }}}</u>} @else if (segment.reading && furigana()) {<ruby>{{ segment.base }}<rt>{{ segment.reading }}</rt></ruby>} @else {{{ segment.base }}}}`,
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

    u {
      text-decoration-thickness: 2px;
      text-underline-offset: 0.22em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RubyText {
  readonly text = input.required<string>();
  readonly furigana = input(true);
  readonly written = input(false);
  readonly underline = input(false);

  readonly segments = computed<Piece[]>(() => {
    const segments = this.written() ? writtenSegments(this.text()) : rubySegments(this.text());
    return this.underline()
      ? underlined(segments)
      : segments.map((segment) => ({ ...segment, underline: false }));
  });
}
