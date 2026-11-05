import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import { T } from '../core/i18n/t';
import { DrawingVerdict, checkDrawing, drawingIssues } from '../core/strokes/stroke-score';
import { Stroke, StrokePoint } from '../core/strokes/stroke.model';
import { StrokeCanvas } from './stroke-canvas';

/**
 * Ô viết thử ngay trên trang một chữ: viết, bấm Kiểm tra, xem nét nào sai, viết lại.
 *
 * Khác màn luyện tập ở chỗ KHÔNG có phiên: không đếm lượt, không vào lịch ôn, không
 * tính vào số câu hôm nay. Đây là chỗ tập cho quen tay trong lúc đang đọc về chữ —
 * muốn được chấm thật thì trang vẫn có nút mở phiên luyện như trước.
 *
 * Khung vẽ, cách chấm và câu nhận xét đều là của màn luyện tập (`StrokeCanvas`,
 * `checkDrawing`, `drawingIssues`), nên viết ở đâu cũng được chấm cùng một thước.
 */
@Component({
  selector: 'app-draw-pad',
  imports: [StrokeCanvas, T],
  template: `
    <app-stroke-canvas
      [reference]="reference()"
      [resetKey]="drawKey()"
      [showGuide]="showGuide() || verdict() !== null"
      [disabled]="verdict() !== null"
      [wrongStrokes]="wrongStrokes()"
      (checked)="onChecked($event)"
    />

    <!-- Vùng nhận xét giữ chỗ sẵn và báo cho trình đọc màn hình: chấm xong là nghe
         được kết quả mà không phải dò tìm. -->
    <div class="pad-feedback" aria-live="polite">
      @if (verdict(); as result) {
        <p class="pad-score" [class.is-correct]="result.correct">
          {{ t(result.correct ? 'practice.pad.correct' : 'practice.draw.score', {
            matched: result.matched,
            expected: result.expected
          }) }}
        </p>
        @if (issues().length > 0) {
          <ul class="pad-issues">
            @for (issue of issues(); track issue.key + issue.params.stroke) {
              <li><app-t [key]="issue.key" [params]="issue.params" /></li>
            }
          </ul>
        }
        <button type="button" class="btn btn-sm" (click)="retry()">
          {{ t('practice.draw.retry') }}
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sp-3);
    }

    .pad-feedback {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-2);
      width: min(320px, 78vw);
    }

    .pad-score {
      margin: 0;
      font-weight: 600;
      color: var(--danger);
    }

    .pad-score.is-correct {
      color: var(--success);
    }

    /* Cùng màu với nét bị tô đỏ trên khung: đọc "nét 3 viết ngược" rồi nhìn lên là
       thấy ngay nét nào. */
    .pad-issues {
      margin: 0;
      padding-left: 1.2em;
      font-size: var(--fs-sm);
      color: var(--danger);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawPad {
  private readonly lang = inject(LanguageStore);

  protected readonly t = this.lang.t.bind(this.lang);

  readonly reference = input.required<readonly Stroke[]>();
  /** Đổi khoá (mở chữ khác) là xoá khung và quên kết quả cũ. */
  readonly resetKey = input.required<string>();
  /** Hiện nét mẫu mờ để đồ theo. Chấm xong thì luôn hiện, vì lúc đó nó là đáp án. */
  readonly showGuide = input(true);

  protected readonly verdict = signal<DrawingVerdict | null>(null);
  private readonly tries = signal(0);

  protected readonly drawKey = computed(() => `${this.resetKey()}#${this.tries()}`);
  protected readonly issues = computed(() => drawingIssues(this.verdict()));
  protected readonly wrongStrokes = computed(() =>
    (this.verdict()?.problems ?? []).map((problem) => problem.stroke),
  );

  constructor() {
    // Sang chữ khác thì kết quả của chữ cũ không còn nghĩa lý gì.
    effect(() => {
      this.resetKey();
      this.verdict.set(null);
    });
  }

  protected onChecked(strokes: StrokePoint[][]): void {
    this.verdict.set(checkDrawing(strokes, this.reference()));
  }

  protected retry(): void {
    this.verdict.set(null);
    this.tries.update((count) => count + 1);
  }
}
