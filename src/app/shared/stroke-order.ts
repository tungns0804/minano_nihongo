import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import { Stroke, StrokePoint } from '../core/strokes/stroke.model';

/** Cạnh khung toạ độ của hình — nét đã chuẩn hoá 0..1 nên nhân lên là xong. */
const BOX = 100;

/** Số thứ tự nét đặt lùi về trước đầu nét bằng chừng này, để khỏi đè lên chính nét. */
const LABEL_GAP = 6;

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
 * Dùng đúng dữ liệu nét của phần luyện viết (KanjiVG, xem `core/strokes/`), nên
 * hình xem ở đây và nét mẫu đem đi chấm là một — không có chuyện hình một đằng,
 * chấm một nẻo. Vẽ bằng SVG chứ không bằng canvas: chữ số, nét và hoạt hình đều là
 * thẻ thường, CSS lo hết, và hình nét căng theo khung mà không mờ.
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

        <!-- Khoá track đổi theo số lần phát: phần tử dựng lại nên hoạt hình CSS chạy lại từ đầu. -->
        <g class="order-ink" [class.is-playing]="runs() > 0">
          @for (stroke of drawn(); track runs() + ':' + $index) {
            <path [attr.d]="stroke.path" pathLength="1" [style.--i]="$index" />
          }
        </g>
        <g class="order-num" [class.is-playing]="runs() > 0">
          @for (stroke of drawn(); track runs() + ':' + $index) {
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

    .order-ghost path {
      stroke: var(--border-strong);
      stroke-width: 3.4;
    }

    .order-ink path {
      stroke: var(--text);
      stroke-width: 3.4;
    }

    .order-num text {
      fill: var(--accent);
      font-family: var(--font-ui);
      font-size: 6px;
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
  protected readonly box = BOX;

  /** Chữ đang vẽ — chỉ để đặt nhãn cho trình đọc màn hình. */
  readonly char = input.required<string>();
  readonly strokes = input.required<readonly Stroke[]>();

  /** Số lần đã bấm phát; 0 là hình đứng yên, đủ cả chữ ngay từ đầu. */
  protected readonly runs = signal(0);

  protected readonly drawn = computed<DrawnStroke[]>(() =>
    this.strokes().map((stroke) => {
      const label = labelPoint(stroke);
      return { path: pathOf(stroke), labelX: label.x, labelY: label.y };
    }),
  );

  play(): void {
    this.runs.update((count) => count + 1);
  }
}

/** Đường cong qua trung điểm các điểm mẫu — đúng cách khung viết vẽ nét mẫu. */
function pathOf(points: readonly StrokePoint[]): string {
  const at = (point: StrokePoint) => `${round(point.x * BOX)} ${round(point.y * BOX)}`;
  if (points.length === 0) return '';
  if (points.length === 1) return `M${at(points[0])}L${at(points[0])}`;

  let d = `M${at(points[0])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const middle = { x: (points[i].x + points[i + 1].x) / 2, y: (points[i].y + points[i + 1].y) / 2 };
    d += `Q${at(points[i])} ${at(middle)}`;
  }
  return `${d}L${at(points[points.length - 1])}`;
}

/**
 * Chỗ đặt số thứ tự: lùi về trước đầu nét, ngược hướng nét đi.
 *
 * Nhìn số là biết luôn nét bắt đầu từ đâu và đi về đâu. Đặt ngay trên đầu nét thì
 * số đè lên chính nét, mà nét ngang ngắn của 言 thì gần như bị số che mất.
 */
function labelPoint(points: readonly StrokePoint[]): StrokePoint {
  const start = points[0];
  // Lấy hướng qua vài điểm chứ không chỉ điểm kế: đầu nét vẽ tay hay có móc nhỏ.
  const ahead = points[Math.min(2, points.length - 1)];
  const dx = ahead.x - start.x;
  const dy = ahead.y - start.y;
  const length = Math.hypot(dx, dy) || 1;

  const clamp = (value: number) => Math.min(BOX - 5, Math.max(5, value));
  return {
    x: round(clamp(start.x * BOX - (dx / length) * LABEL_GAP)),
    y: round(clamp(start.y * BOX - (dy / length) * LABEL_GAP)),
  };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
