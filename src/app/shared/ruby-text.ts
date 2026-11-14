import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import { exampleParts } from '../core/japanese/example-highlight';
import { RubySegment, kanaText, plainText, rubySegments, writtenSegments } from '../core/translation/markup';

interface Piece extends RubySegment {
  /** Nằm trong 〈…〉 — phần gạch chân của câu đề thi. */
  underline: boolean;
}

/** Một khúc liền nhau các mảnh cùng được tô, hoặc cùng không. */
interface Run {
  marked: boolean;
  pieces: Piece[];
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
 * Gom các mảnh thành khúc tô / không tô quanh từ `word` (viết theo cùng cú pháp với câu).
 *
 * Tìm trên chữ hiển thị của cả câu (xem `core/japanese/example-highlight.ts`), rồi cắt
 * lại theo mảnh. Chữ có furigana thì không cắt đôi được — chạm vào phần được tô là tô
 * cả chữ. Các mảnh được tô gom chung một <mark> để nền tô liền một dải, không đứt
 * khúc ở chỗ giao giữa chữ Hán và kana.
 */
function markRuns(pieces: Piece[], word: string | null): Run[] {
  const parts = word ? exampleParts(pieces.map((p) => p.base).join(''), plainText(word), kanaText(word)) : null;
  if (!parts) return [{ marked: false, pieces }];

  const start = parts[0].length;
  const end = start + parts[1].length;
  const runs: Run[] = [];
  const push = (marked: boolean, piece: Piece) => {
    const last = runs.at(-1);
    if (last && last.marked === marked) last.pieces.push(piece);
    else runs.push({ marked, pieces: [piece] });
  };

  let at = 0;
  for (const piece of pieces) {
    const from = at;
    at += piece.base.length;
    if (at <= start || from >= end) {
      push(false, piece);
    } else if (piece.reading !== null) {
      push(true, piece);
    } else {
      const cutStart = Math.max(start - from, 0);
      const cutEnd = Math.min(end - from, piece.base.length);
      if (cutStart > 0) push(false, { ...piece, base: piece.base.slice(0, cutStart) });
      push(true, { ...piece, base: piece.base.slice(cutStart, cutEnd) });
      if (cutEnd < piece.base.length) push(false, { ...piece, base: piece.base.slice(cutEnd) });
    }
  }
  return runs;
}

/**
 * Vẽ một câu viết theo cú pháp của khu Luyện dịch (`{漢字|かな}`, `[a/b]`) thành chữ có
 * furigana. Tắt `furigana` thì chỉ còn chữ Hán, như khi đọc sách không chú âm.
 *
 * Mặc định [a/b] chỉ hiện lựa chọn đầu: ở khu Luyện dịch các lựa chọn khác là cách nói
 * được chấp nhận ngầm. Bật `written` thì hiện đủ như văn bản gốc viết (いつ/何時に,
 * 場合（は）) — xem `writtenSegments`. Bật `underline` thì 〈…〉 thành chữ gạch chân,
 * như phần được hỏi trong câu đề thi. Đưa `highlight` (một từ, cùng cú pháp) thì từ đó
 * được tô trong câu, kể cả khi đã chia — như cột Ví dụ của bảng từ vựng.
 *
 * Template viết liền một dòng là có chủ ý: xuống dòng giữa các khối @if sẽ chèn khoảng
 * trắng vào giữa câu tiếng Nhật.
 */
@Component({
  selector: 'app-ruby',
  imports: [NgTemplateOutlet],
  template: `@for (run of runs(); track $index) {@if (run.marked) {<mark class="example-word">@for (segment of run.pieces; track $index) {<ng-container *ngTemplateOutlet="piece; context: { $implicit: segment }" />}</mark>} @else {@for (segment of run.pieces; track $index) {<ng-container *ngTemplateOutlet="piece; context: { $implicit: segment }" />}}}<ng-template #piece let-segment>@if (segment.underline) {<u>@if (segment.reading && furigana()) {<ruby>{{ segment.base }}<rt>{{ segment.reading }}</rt></ruby>} @else {{{ segment.base }}}</u>} @else if (segment.reading && furigana()) {<ruby>{{ segment.base }}<rt>{{ segment.reading }}</rt></ruby>} @else {{{ segment.base }}}</ng-template>`,
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
  /** Từ cần tô trong câu, viết theo cùng cú pháp (`{首|くび}`); null là không tô gì. */
  readonly highlight = input<string | null>(null);

  readonly runs = computed<Run[]>(() => {
    const segments = this.written() ? writtenSegments(this.text()) : rubySegments(this.text());
    const pieces = this.underline()
      ? underlined(segments)
      : segments.map((segment) => ({ ...segment, underline: false }));
    return markRuns(pieces, this.highlight());
  });
}
