import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import { RubyText } from './ruby-text';

/**
 * Khu trả lời của bài "Sắp xếp câu": một dòng câu trả lời, một kho mảnh câu, hai nút.
 *
 * Chỉ vẽ và báo lại thao tác — giữ mảnh nào đã xếp, chấm điểm, phím tắt đều nằm ở màn
 * luyện tập, như `StrokeCanvas` chỉ vẽ còn việc chấm nét nằm ngoài nó. Tách ra thành
 * component riêng để phần CSS của nó không dồn vào `practice.css`, vốn đã sát ngân sách
 * dung lượng của một component.
 *
 * Mảnh đã dùng vẫn giữ chỗ trong kho (mờ đi) để các mảnh còn lại không nhảy vị trí —
 * phím số 1..n luôn trỏ đúng một mảnh, đúng như số in trên mảnh.
 */
@Component({
  selector: 'app-chunk-order',
  imports: [RubyText],
  template: `
    <span class="label">{{ label() }}</span>
    <div class="order-line" [class.is-empty]="picked().length === 0">
      @for (index of picked(); track index; let position = $index) {
        <button
          type="button"
          class="chunk is-placed jp"
          [disabled]="disabled()"
          [attr.aria-label]="t('practice.order.remove')"
          (click)="remove.emit(position)"
        >
          <app-ruby [text]="chunks()[index]" [furigana]="furigana()" />
        </button>
      } @empty {
        <span class="order-placeholder small muted">{{ t('practice.order.placeholder') }}</span>
      }
    </div>

    <div class="chunk-bank">
      @for (index of bank(); track index; let key = $index) {
        <button
          type="button"
          class="chunk jp"
          [class.is-used]="isPicked(index)"
          [disabled]="disabled() || isPicked(index)"
          (click)="add.emit(index)"
        >
          <span class="chunk-key" aria-hidden="true">{{ key + 1 }}</span>
          <app-ruby [text]="chunks()[index]" [furigana]="furigana()" />
        </button>
      }
    </div>

    <div class="order-actions">
      <button
        type="button"
        class="btn btn-sm btn-ghost"
        [disabled]="disabled() || picked().length === 0"
        (click)="reset.emit()"
      >
        {{ t('practice.order.clear') }}
      </button>
      <button type="button" class="btn btn-primary" [disabled]="disabled() || !complete()" (click)="check.emit()">
        {{ t('practice.check') }}
      </button>
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--sp-3);
    }

    /* Dòng câu trả lời: khung nét đứt khi còn trống để thấy đây là chỗ xếp mảnh vào. */
    .order-line {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--sp-2);
      min-height: 64px;
      padding: 10px 12px;
      border: 1.5px solid var(--border-strong);
      border-radius: var(--radius);
      background: var(--bg-subtle);
    }

    .order-line.is-empty {
      border-style: dashed;
    }

    .order-placeholder {
      padding: 0 var(--sp-1);
    }

    .chunk-bank {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-2);
    }

    .chunk {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: 100%;
      padding: 8px 12px;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--bg-elevated);
      font-size: 1.15rem;
      /* Chừa chỗ cho furigana phía trên chữ Hán. */
      line-height: 2;
      text-align: left;
      word-break: break-word;
      box-shadow: var(--shadow-sm);
      transition: border-color var(--dur) var(--ease), background-color var(--dur) var(--ease),
        opacity var(--dur) var(--ease), transform 0.06s var(--ease);
    }

    .chunk:hover:not(:disabled) {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .chunk:active:not(:disabled) {
      transform: translateY(1px);
    }

    .chunk:disabled {
      cursor: default;
    }

    .chunk.is-placed {
      border-color: var(--accent);
    }

    .chunk.is-used {
      opacity: 0.3;
      box-shadow: none;
    }

    .chunk-key {
      display: grid;
      place-items: center;
      width: 22px;
      height: 22px;
      flex-shrink: 0;
      border-radius: 6px;
      background: var(--bg-inset);
      font-family: var(--font-ui);
      font-size: var(--fs-2xs);
      font-weight: 700;
      line-height: 1;
      color: var(--text-muted);
    }

    .order-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChunkOrder {
  private readonly lang = inject(LanguageStore);
  readonly t = this.lang.t.bind(this.lang);

  /** Các mảnh theo đúng thứ tự câu (cú pháp câu mẫu, có furigana). */
  readonly chunks = input.required<readonly string[]>();
  /** Thứ tự hiện các mảnh trong kho — chỉ số vào `chunks`. */
  readonly bank = input.required<readonly number[]>();
  /** Các mảnh đã xếp, theo thứ tự xếp — chỉ số vào `chunks`. */
  readonly picked = input.required<readonly number[]>();
  readonly label = input('');
  readonly disabled = input(false);
  readonly furigana = input(true);

  /** Bấm một mảnh trong kho: chỉ số của mảnh đó trong `chunks`. */
  readonly add = output<number>();
  /** Bấm một mảnh đã xếp: VỊ TRÍ của nó trên dòng câu trả lời. */
  readonly remove = output<number>();
  readonly reset = output<void>();
  readonly check = output<void>();

  readonly complete = computed(() => this.picked().length === this.chunks().length);

  isPicked(index: number): boolean {
    return this.picked().includes(index);
  }
}
