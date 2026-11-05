import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

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
    <!-- Khung vẽ và lớp loé màu đi chung một khối: khung rung khi sai thì viền loé
         cũng rung theo, không lệch ra khỏi khung. -->
    <div class="pad-board" #board>
      <app-stroke-canvas
        [reference]="reference()"
        [resetKey]="drawKey()"
        [showGuide]="showGuide() || verdict() !== null"
        [disabled]="verdict() !== null"
        [wrongStrokes]="wrongStrokes()"
        (checked)="onChecked($event)"
      />
      <!-- Dựng mới theo mỗi lần chấm (nằm trong @if của kết quả) nên hiệu ứng loé
           chạy lại đúng một lần cho mỗi lần bấm Kiểm tra. -->
      @if (verdict(); as result) {
        <span class="pad-flash" [class.is-correct]="result.correct" aria-hidden="true"></span>
      }
    </div>

    <!-- Vùng nhận xét giữ chỗ sẵn và báo cho trình đọc màn hình: chấm xong là nghe
         được kết quả mà không phải dò tìm. -->
    <div class="pad-feedback" aria-live="polite">
      @if (verdict(); as result) {
        <div class="pad-result">
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
        </div>
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

    .pad-board {
      position: relative;
    }

    /* Viền loé ngay trên khung vẽ khi vừa chấm: xanh là đúng, đỏ là sai. Mắt đang
       nhìn vào khung lúc bấm Kiểm tra, nên câu trả lời phải hiện ngay ở đó chứ không
       chỉ ở dòng chữ bên dưới. Lớp này chỉ là viền (bên trong trong suốt, không nhận
       chuột), đứng đúng chỗ khung vẽ: cùng cạnh min(320px, 78vw), sát mép trên. */
    .pad-flash {
      position: absolute;
      top: 0;
      left: 50%;
      width: min(320px, 78vw);
      aspect-ratio: 1;
      border-radius: var(--radius-lg);
      transform: translateX(-50%);
      pointer-events: none;
      opacity: 0;
      box-shadow:
        0 0 0 2px var(--danger),
        0 0 18px 2px color-mix(in srgb, var(--danger) 45%, transparent);
      animation: pad-flash 0.45s ease-out;
    }

    .pad-flash.is-correct {
      box-shadow:
        0 0 0 2px var(--success),
        0 0 22px 4px color-mix(in srgb, var(--success) 50%, transparent);
    }

    /* Chỉ khai from: hết hiệu ứng là trở về opacity 0 của bảng kiểu, đúng quy ước
       của src/styles/motion.css. */
    @keyframes pad-flash {
      from {
        opacity: 1;
      }
    }

    /* Nhận xét trượt lên một đoạn ngắn: cùng nhịp với khối phản hồi của màn luyện. */
    .pad-result {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sp-2);
      animation: pad-result-in 0.22s var(--ease) backwards;
    }

    @keyframes pad-result-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
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

  private readonly board = viewChild<ElementRef<HTMLElement>>('board');

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
    const verdict = checkDrawing(strokes, this.reference());
    this.verdict.set(verdict);
    if (!verdict.correct) this.shakeBoard();
  }

  /**
   * Khung lắc nhẹ khi viết sai — đúng cái lắc của ô trả lời ở màn luyện tập, để cùng
   * một ý "sai rồi" thì ở đâu cũng trông như nhau.
   *
   * Chạy bằng Web Animations chứ không bằng lớp CSS: lắc hai lần liền nhau thì lớp CSS
   * phải gỡ ra rồi gắn lại mới chạy lại được. Vì thế cũng phải tự hỏi
   * prefers-reduced-motion — quy tắc chung của utilities.css chỉ chặn được CSS.
   */
  private shakeBoard(): void {
    const element = this.board()?.nativeElement;
    if (!element?.animate) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    element.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-7px)' },
        { transform: 'translateX(7px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 280, easing: 'ease-in-out' },
    );
  }

  protected retry(): void {
    this.verdict.set(null);
    this.tries.update((count) => count + 1);
  }
}
