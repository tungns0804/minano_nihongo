import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import { KANJIVG_BOX, strokeLabels } from '../core/strokes/stroke-path';

interface DrawnStroke {
  path: string;
  /** Chỗ đặt số thứ tự nét. */
  labelX: number;
  labelY: number;
}

/**
 * Thứ tự nét của một chữ: từng nét vẽ ra kèm số thứ tự ở đầu nét, và nút cho nét
 * hiện lần lượt như đang viết.
 *
 * Vẽ thẳng từ đường GỐC của KanjiVG (Bézier, xem `core/strokes/stroke-path.ts`)
 * chứ không từ bản 10 điểm dùng để chấm: bản đó vẽ ra nét ngang gợn sóng và góc
 * gập bị bo tròn, mà hình này chính là mẫu để người học bắt chước cho ngay ngắn.
 * Nét chấm điểm cũng rút từ đúng đường gốc này, nên hình xem và nét chấm vẫn là một.
 * Vẽ bằng SVG chứ không bằng canvas: chữ số, nét và hoạt hình đều là thẻ thường,
 * CSS lo hết, và hình nét căng theo khung mà không mờ.
 */
@Component({
  selector: 'app-stroke-order',
  template: `
    <div class="order-frame">
      <svg
        class="order-svg"
        [attr.viewBox]="'0 0 ' + box + ' ' + box"
        role="img"
        [attr.aria-label]="t('practice.order.aria', { char: char(), count: drawn().length })"
      >
        <!-- Lúc đang phát: hình cả chữ hiện mờ bên dưới để biết nét sắp vẽ nằm ở đâu. -->
        @if (runs() > 0) {
          <g class="order-ghost">
            @for (stroke of drawn(); track $index) {
              <path [attr.d]="stroke.path" />
            }
          </g>
        }

        <!-- Mỗi lần phát là một mảng mới, khoá mới: phần tử dựng lại nên hoạt hình CSS chạy
             lại từ đầu (xem \`frames\`). -->
        <g class="order-ink" [class.is-playing]="runs() > 0">
          @for (stroke of frames(); track stroke.key) {
            <path [attr.d]="stroke.path" pathLength="1" [style.--i]="$index" />
          }
        </g>
        <g class="order-num" [class.is-playing]="runs() > 0">
          @for (stroke of frames(); track stroke.key) {
            <text [attr.x]="stroke.labelX" [attr.y]="stroke.labelY" [style.--i]="$index">
              {{ $index + 1 }}
            </text>
          }
        </g>
      </svg>
    </div>

    <button type="button" class="btn btn-sm" (click)="play()">
      <svg viewBox="0 0 20 20" aria-hidden="true" class="play-icon">
        <path d="M6 4.5v11l9-5.5z" fill="currentColor" />
      </svg>
      {{ t(runs() > 0 ? 'practice.order.replay' : 'practice.order.play') }}
    </button>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sp-3);
    }

    .order-frame {
      width: min(320px, 78vw);
      aspect-ratio: 1;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--bg-elevated);
      /* Cùng ô chia tư với khung viết bên cạnh: nhìn hình mẫu rồi viết thì hai khung
         phải cùng một hệ toạ độ trong mắt người học. */
      background-image:
        linear-gradient(to right, var(--border) 1px, transparent 1px),
        linear-gradient(to bottom, var(--border) 1px, transparent 1px);
      background-position: center;
      background-size: 50% 50%;
    }

    .order-svg {
      display: block;
      width: 100%;
      height: 100%;
    }

    .order-svg path {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    /* Bề dày 3/109 đúng như hình mẫu của chính KanjiVG. */
    .order-ghost path {
      stroke: var(--border-strong);
      stroke-width: 3;
    }

    .order-ink path {
      stroke: var(--text);
      stroke-width: 3;
    }

    .order-num text {
      fill: var(--accent);
      font-family: var(--font-ui);
      font-size: 6.5px;
      font-weight: 700;
      text-anchor: middle;
      dominant-baseline: central;
      /* Viền nền quanh chữ số: số nằm đè lên nét khác vẫn đọc được. */
      paint-order: stroke;
      stroke: var(--bg-elevated);
      stroke-width: 2px;
    }

    /* Nhịp mỗi nét: đủ chậm để mắt theo kịp chiều nét, đủ nhanh để chữ 18 nét
       không bắt người học ngồi chờ quá mười giây. */
    /* Ẩn hẳn nét chưa tới lượt chứ không chỉ đẩy nét gạch ra ngoài: đầu tròn của
       nét vẫn vẽ một chấm ở cuối đường dù đoạn gạch dài bằng 0, và chữ 16 nét sẽ lấm
       tấm 15 chấm đen trước khi kịp viết. */
    .is-playing path {
      visibility: hidden;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: stroke-draw 0.42s ease-in-out forwards;
      animation-delay: calc(var(--i) * 0.55s + 0.15s);
    }

    .is-playing text {
      opacity: 0;
      animation: number-in 0.2s ease-out forwards;
      animation-delay: calc(var(--i) * 0.55s + 0.15s);
    }

    @keyframes stroke-draw {
      from {
        visibility: visible;
        stroke-dashoffset: 1;
      }
      to {
        visibility: visible;
        stroke-dashoffset: 0;
      }
    }

    @keyframes number-in {
      to {
        opacity: 1;
      }
    }

    /* Tắt chuyển động thì hiện ngay cả chữ — số thứ tự vẫn nói đủ trình tự. */
    @media (prefers-reduced-motion: reduce) {
      .is-playing path,
      .is-playing text {
        animation: none;
        visibility: visible;
        stroke-dashoffset: 0;
        opacity: 1;
      }
    }

    .play-icon {
      width: 14px;
      height: 14px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StrokeOrder {
  private readonly lang = inject(LanguageStore);

  protected readonly t = this.lang.t.bind(this.lang);
  protected readonly box = KANJIVG_BOX;

  /** Chữ đang vẽ — chỉ để đặt nhãn cho trình đọc màn hình. */
  readonly char = input.required<string>();
  /** Các đường `d` gốc (khung 109×109), đúng thứ tự viết. */
  readonly paths = input.required<readonly string[]>();

  /** Số lần đã bấm phát; 0 là hình đứng yên, đủ cả chữ ngay từ đầu. */
  protected readonly runs = signal(0);

  protected readonly drawn = computed<DrawnStroke[]>(() => {
    const paths = this.paths();
    const labels = strokeLabels(paths);
    return paths.map((path, index) => ({ path, labelX: labels[index].x, labelY: labels[index].y }));
  });

  /**
   * Nét đem vẽ, kèm khoá theo lần phát.
   *
   * Phải là một MẢNG MỚI mỗi lần bấm, không chỉ khoá mới: `@for` chỉ đối chiếu lại khoá
   * khi chính mảng đổi. Trước đây khoá ghép `runs()` ngay trong biểu thức `track` mà vẫn
   * lặp trên `drawn()` (mảng cũ), nên lần bấm đầu chạy được nhờ lớp `is-playing` vừa gắn
   * vào, còn từ lần thứ hai không phần tử nào dựng lại — nút "Xem lại" bấm như không.
   */
  protected readonly frames = computed(() => {
    const run = this.runs();
    return this.drawn().map((stroke, index) => ({ ...stroke, key: `${run}:${index}` }));
  });

  play(): void {
    this.runs.update((count) => count + 1);
  }
}
