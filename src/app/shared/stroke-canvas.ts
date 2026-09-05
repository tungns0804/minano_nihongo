import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import { Stroke, StrokePoint } from '../core/strokes/stroke.model';

/** Cạnh khung vẽ tính bằng điểm ảnh thật. CSS co giãn khung, toạ độ vẫn tính theo 0..1. */
const SIZE = 600;

/**
 * Khung viết chữ bằng chuột.
 *
 * Bên dưới là các nét mẫu vẽ mờ để đồ theo, bên trên là nét người học vừa vẽ. Nét
 * mẫu và nét đem đi chấm lấy từ CÙNG một nguồn (KanjiVG, xem `core/strokes/`) nên
 * đồ đúng hình mẫu là chấm đúng — không có chuyện hình nền một đằng thước đo một nẻo.
 *
 * Vì sao vẽ nét mẫu chứ không hiện chữ bằng font: font nào cũng đặt chữ trong khung
 * của riêng nó, lệch với khung 109×109 của KanjiVG vài phần trăm. Người học đồ khít
 * chữ của font vẫn có thể bị chấm lệch, mà không cách nào nhìn ra vì sao.
 *
 * Toạ độ phát ra ngoài đã chuẩn hoá về 0..1 nên nơi nhận không cần biết khung to nhỏ.
 */
@Component({
  selector: 'app-stroke-canvas',
  template: `
    <div class="stroke-frame">
      <canvas
        #board
        class="stroke-board"
        [class.is-disabled]="disabled()"
        [width]="size"
        [height]="size"
        [attr.aria-label]="t('practice.draw.canvas')"
        role="img"
        (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)"
        (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerUp($event)"
      ></canvas>
    </div>

    <div class="stroke-bar">
      <span class="small muted">{{ t('practice.draw.strokeCount', { count: strokes().length }) }}</span>
      <span class="spacer"></span>
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        [disabled]="disabled() || strokes().length === 0"
        (click)="undo()"
      >
        {{ t('practice.draw.undo') }}
      </button>
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        [disabled]="disabled() || strokes().length === 0"
        (click)="clear()"
      >
        {{ t('practice.draw.clear') }}
      </button>
      <button
        type="button"
        class="btn btn-primary"
        [disabled]="disabled() || strokes().length === 0"
        (click)="submit()"
      >
        {{ t('practice.check') }}
      </button>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--sp-3);
      align-items: center;
    }

    .stroke-frame {
      width: min(320px, 78vw);
      aspect-ratio: 1;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--bg-elevated);
      /* Ô vuông chia tư kiểu giấy tập viết: không có nó thì không ước lượng được
         nét nằm giữa hay lệch sang bên. */
      background-image:
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px);
      background-position: center;
      background-size: 50% 50%;
      overflow: hidden;
    }

    .stroke-board {
      display: block;
      width: 100%;
      height: 100%;
      cursor: crosshair;
      touch-action: none;
    }

    .stroke-board.is-disabled {
      cursor: default;
    }

    .stroke-bar {
      display: flex;
      align-items: center;
      gap: var(--sp-2);
      width: min(320px, 78vw);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrokeCanvas {
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);
  readonly size = SIZE;

  /** Nét mẫu của chữ đang hỏi. */
  readonly reference = input.required<readonly Stroke[]>();
  /** Vẽ nét mẫu mờ để đồ theo. Tắt đi là kiểm tra trí nhớ thật. */
  readonly showGuide = input(true);
  /** Câu đã chấm xong: không nhận nét mới nữa. */
  readonly disabled = input(false);
  /** Số thứ tự các nét bị chấm sai (đếm từ 1) — tô đỏ để chỉ ra chỗ hỏng. */
  readonly wrongStrokes = input<readonly number[]>([]);
  /**
   * Khoá của lượt vẽ hiện tại: đổi khoá là xoá sạch khung.
   *
   * Là một khoá do nơi gọi đặt chứ không tự suy từ `reference`: bấm "viết lại" thì
   * vẫn chữ ấy, nét mẫu y nguyên, nên nhìn vào nét mẫu không thể biết lúc nào cần xoá.
   */
  readonly resetKey = input.required<string>();

  readonly checked = output<StrokePoint[][]>();

  private readonly board = viewChild<ElementRef<HTMLCanvasElement>>('board');

  readonly strokes = signal<StrokePoint[][]>([]);
  /** Nét đang kéo dở. Không phải signal: mỗi lần chuột nhích là vẽ thêm một đoạn,
      đi qua signal thì mỗi đoạn kéo theo một lượt kiểm tra thay đổi của cả màn hình. */
  private current: StrokePoint[] | null = null;

  constructor() {
    effect(() => {
      // Đọc hết các signal ảnh hưởng tới hình vẽ để effect chạy lại khi chúng đổi.
      const strokes = this.strokes();
      const reference = this.reference();
      const showGuide = this.showGuide();
      const wrong = new Set(this.wrongStrokes());
      const canvas = this.board()?.nativeElement;
      if (!canvas) return;

      this.repaint(canvas, strokes, reference, showGuide, wrong);
    });

    // Sang lượt vẽ khác (đổi chữ, hoặc bấm viết lại) thì xoá nét cũ đi.
    effect(() => {
      this.resetKey();
      this.strokes.set([]);
      this.current = null;
    });
  }

  // ── Nhận nét ────────────────────────────────────────────────────────────

  onPointerDown(event: PointerEvent): void {
    if (this.disabled()) return;
    const canvas = this.board()?.nativeElement;
    if (!canvas) return;

    // Giữ con trỏ lại: kéo tay ra ngoài khung rồi nhả thì nét vẫn kết thúc đàng hoàng
    // thay vì treo lại đó và dính vào nét sau.
    canvas.setPointerCapture(event.pointerId);
    this.current = [this.pointOf(event, canvas)];
  }

  onPointerMove(event: PointerEvent): void {
    const canvas = this.board()?.nativeElement;
    if (!this.current || !canvas) return;

    const point = this.pointOf(event, canvas);
    const previous = this.current[this.current.length - 1];
    this.current.push(point);

    // Vẽ thẳng đoạn vừa thêm thay vì vẽ lại cả khung: mỗi lần chuột nhích chỉ tốn
    // một đoạn thẳng, hình đã có sẵn trên khung không phải dựng lại.
    const context = canvas.getContext('2d');
    if (!context) return;
    this.strokePath(context, [previous, point], getComputedStyle(canvas).color, 9);
  }

  onPointerUp(event: PointerEvent): void {
    const stroke = this.current;
    this.current = null;
    if (!stroke) return;

    const canvas = this.board()?.nativeElement;
    canvas?.releasePointerCapture(event.pointerId);
    this.strokes.update((list) => [...list, stroke]);
  }

  undo(): void {
    this.strokes.update((list) => list.slice(0, -1));
  }

  clear(): void {
    this.strokes.set([]);
  }

  submit(): void {
    this.checked.emit(this.strokes().map((stroke) => [...stroke]));
  }

  private pointOf(event: PointerEvent, canvas: HTMLCanvasElement): StrokePoint {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
  }

  // ── Vẽ ──────────────────────────────────────────────────────────────────

  private repaint(
    canvas: HTMLCanvasElement,
    strokes: readonly StrokePoint[][],
    reference: readonly Stroke[],
    showGuide: boolean,
    wrong: ReadonlySet<number>,
  ): void {
    const context = canvas.getContext('2d');
    if (!context) return;

    const style = getComputedStyle(canvas);
    const ink = style.color;
    context.clearRect(0, 0, SIZE, SIZE);

    if (showGuide) {
      context.globalAlpha = 0.22;
      for (const [index, stroke] of reference.entries()) {
        this.strokePath(context, stroke, ink, 14);
        this.strokeNumber(context, stroke[0], index + 1, ink);
      }
      context.globalAlpha = 1;
    }

    for (const [index, stroke] of strokes.entries()) {
      // Đỏ cho nét bị chấm sai: chỉ nói "sai nét 3" thì người học còn phải tự đếm lại.
      const color = wrong.has(index + 1) ? style.getPropertyValue('--danger') : ink;
      this.strokePath(context, stroke, color, 9);
    }
  }

  /** Vẽ một chuỗi điểm thành đường liền, làm mượt bằng đường cong qua trung điểm. */
  private strokePath(
    context: CanvasRenderingContext2D,
    points: readonly StrokePoint[],
    color: string,
    width: number,
  ): void {
    if (points.length === 0) return;

    context.strokeStyle = color;
    context.lineWidth = width;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(points[0].x * SIZE, points[0].y * SIZE);

    if (points.length === 1) {
      context.lineTo(points[0].x * SIZE, points[0].y * SIZE);
    }

    for (let i = 1; i < points.length - 1; i++) {
      const middleX = ((points[i].x + points[i + 1].x) / 2) * SIZE;
      const middleY = ((points[i].y + points[i + 1].y) / 2) * SIZE;
      context.quadraticCurveTo(points[i].x * SIZE, points[i].y * SIZE, middleX, middleY);
    }

    const last = points[points.length - 1];
    context.lineTo(last.x * SIZE, last.y * SIZE);
    context.stroke();
  }

  /** Số thứ tự nét, đặt ở đầu nét — thứ tự viết mới là thứ đang luyện. */
  private strokeNumber(
    context: CanvasRenderingContext2D,
    start: StrokePoint,
    order: number,
    color: string,
  ): void {
    context.fillStyle = color;
    context.font = '600 34px system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(String(order), start.x * SIZE, start.y * SIZE);
  }
}
