import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { VocabAudioPlayer } from '../core/audio/vocab-audio-player';
import { LanguageStore } from '../core/i18n/language-store';
import { vocabImageOf } from '../core/images/vocab-images';
import type { VocabularyWord } from '../core/lessons/vocabulary.model';
import { VocabPhoto } from './vocab-photo';

/** Vuốt ngang ít nhất chừng này (px) mới tính là chuyển ảnh, để chạm nhầm không lật trang. */
const SWIPE_DISTANCE = 48;

/**
 * Khung phóng to ảnh của bảng từ: ảnh lớn, từ, cách đọc, nghĩa, nút phát âm, ghi nguồn
 * đầy đủ, và ← → để xem ảnh của từ trước / sau mà không phải đóng khung.
 *
 * Dùng thẻ `<dialog>` của trình duyệt chứ không tự dựng lớp phủ: `showModal()` có sẵn
 * bẫy focus, phím Esc, lớp nền mờ và trả focus về nút vừa bấm khi đóng — tự làm thì
 * thường quên đúng mấy thứ đó.
 *
 * Nơi dùng đưa vào danh sách từ CÓ ẢNH theo đúng thứ tự đang hiện (đã lọc theo ô tìm,
 * theo ★) và vị trí đang mở; `index` là null thì khung đóng.
 */
@Component({
  selector: 'app-photo-viewer',
  imports: [VocabPhoto],
  template: `
    <dialog
      #dialog
      class="viewer"
      [attr.aria-label]="t('lesson.photo.viewer')"
      (close)="index.set(null)"
      (click)="onDialogClick($event)"
      (keydown)="onKey($event)"
    >
      @if (current(); as item) {
        <div class="viewer-body">
          <button type="button" class="viewer-close" (click)="index.set(null)" [attr.aria-label]="t('lesson.photo.close')">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>

          <!-- Khoá theo từ: sang ảnh khác là khối này dựng lại, nên hiệu ứng trượt theo
               hướng vừa bấm chạy lại mỗi lần. Nút đóng và hàng ← → nằm NGOÀI khối để
               không trượt theo — và để focus không rơi mất khi khối dựng lại. -->
          @for (slide of [item]; track slide.word.id) {
            <div class="viewer-slide" [attr.data-dir]="direction()">
              <!-- Vuốt trên chính ảnh: trên điện thoại đó là chỗ ngón tay tự nhiên đặt vào. -->
              <div class="viewer-photo" (pointerdown)="swipeStart($event)" (pointerup)="swipeEnd($event)">
                <app-vocab-photo [image]="item.image" size="xl" />
              </div>

              <div class="viewer-word">
                @if (item.word.hanViet) {
                  <span class="viewer-han">{{ item.word.hanViet }}</span>
                }
                <span class="viewer-jp jp">
                  {{ item.word.japanese }}
                  @if (audio.canPlay(item.word)) {
                    <button
                      type="button"
                      class="viewer-speak"
                      [class.is-playing]="audio.isPlaying(item.word)"
                      [disabled]="audio.isBroken(item.word)"
                      (click)="audio.play(item.word)"
                      [attr.aria-label]="t('lesson.speak', { name: item.word.japanese })"
                    >
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path d="M4 8h2.4L9.8 4.6v10.8L6.4 12H4z" stroke-linejoin="round" />
                        <path d="M12.8 7.6a3.4 3.4 0 0 1 0 4.8" stroke-linecap="round" />
                        <path d="M15 5.4a6.5 6.5 0 0 1 0 9.2" stroke-linecap="round" />
                      </svg>
                    </button>
                  }
                </span>
                @if (item.word.reading) {
                  <span class="viewer-reading jp">{{ item.word.reading }}</span>
                }
                <span class="viewer-meaning">{{ item.word.vietnamese }}</span>
              </div>
            </div>
          }

          @if (words().length > 1) {
            <div class="viewer-nav">
              <button type="button" class="btn" [disabled]="!hasPrev()" (click)="step(-1)" [attr.aria-label]="t('lesson.photo.prev')">←</button>
              <span class="viewer-count" aria-live="polite">
                {{ t('lesson.photo.counter', { current: (index() ?? 0) + 1, total: words().length }) }}
              </span>
              <button type="button" class="btn" [disabled]="!hasNext()" (click)="step(1)" [attr.aria-label]="t('lesson.photo.next')">→</button>
            </div>
          }
        </div>
      }
    </dialog>
  `,
  styles: `
    /* margin: auto là thứ trình duyệt dùng để đặt dialog giữa màn hình — reset
       "* { margin: 0 }" của base.css xoá mất nó, nên phải khai lại ở đây. */
    .viewer {
      width: min(520px, calc(100vw - 24px));
      max-height: calc(100dvh - 24px);
      margin: auto;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--bg-elevated);
      color: var(--text);
      box-shadow: var(--shadow-lg);
      overscroll-behavior: contain;
      /* Ảnh trượt vào từ bên cạnh lấn ra ngoài khung một nhịp — cắt đi, đừng để nó
         đẻ ra thanh cuộn ngang trong 0,2 giây đó. */
      overflow-x: hidden;
      overflow-y: auto;
    }

    .viewer::backdrop {
      background: rgb(10 14 20 / 62%);
    }

    /* Mở ra: khung phóng nhẹ từ nhỏ lên và nền mờ dần — mắt hiểu ngay là "ảnh vừa
       được phóng to", không phải một trang mới bụp ra đè lên. Quy tắc nằm trên [open]
       nên mỗi lần mở là chạy lại. Đóng thì tắt ngay: đóng là muốn quay lại bảng,
       bắt đợi hiệu ứng là bắt ngồi chờ. */
    .viewer[open] {
      animation: viewer-in 0.22s var(--ease);
    }

    .viewer[open]::backdrop {
      animation: backdrop-in 0.22s ease-out;
    }

    @keyframes viewer-in {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.96);
      }
    }

    @keyframes backdrop-in {
      from {
        opacity: 0;
      }
    }

    /* Sang ảnh khác: trượt vào từ phía vừa bấm — → thì từ bên phải, ← thì từ bên trái,
       đúng như lật một xấp thẻ. Mở lần đầu thì không trượt (data-dir rỗng), vì khung đã
       có hiệu ứng mở của riêng nó. */
    .viewer-slide {
      display: flex;
      flex-direction: column;
      gap: var(--sp-4);
    }

    .viewer-slide[data-dir='next'] {
      animation: slide-from-right 0.2s var(--ease);
    }

    .viewer-slide[data-dir='prev'] {
      animation: slide-from-left 0.2s var(--ease);
    }

    @keyframes slide-from-right {
      from {
        opacity: 0;
        transform: translateX(28px);
      }
    }

    @keyframes slide-from-left {
      from {
        opacity: 0;
        transform: translateX(-28px);
      }
    }

    .viewer-body {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--sp-4);
      padding: var(--sp-6) var(--sp-5) var(--sp-5);
    }

    .viewer-close {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: var(--bg-subtle);
      color: var(--text-muted);
    }

    .viewer-close svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }

    .viewer-close:hover {
      color: var(--text);
    }

    /* pan-y: để trình duyệt vẫn cuộn dọc được khung khi ảnh cao, còn vuốt ngang thì
       trang không tự cuộn — phần đó dành cho chuyển ảnh. */
    .viewer-photo {
      touch-action: pan-y;
      user-select: none;
    }

    .viewer-word {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      text-align: center;
    }

    .viewer-han {
      font-size: var(--fs-xs);
      font-weight: 700;
      letter-spacing: 0.05em;
      color: var(--text-faint);
    }

    .viewer-jp {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 1.7rem;
      line-height: 1.3;
    }

    .viewer-reading {
      color: var(--text-muted);
    }

    .viewer-meaning {
      margin-top: 4px;
      font-size: var(--fs-lg);
    }

    .viewer-speak {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      padding: 0;
      border: 0;
      border-radius: 8px;
      background: none;
      color: var(--text-faint);
    }

    .viewer-speak svg {
      width: 20px;
      height: 20px;
    }

    .viewer-speak:hover,
    .viewer-speak.is-playing {
      color: var(--accent);
      background: var(--accent-soft);
    }

    .viewer-speak:disabled {
      opacity: 0.35;
    }

    .viewer-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sp-3);
    }

    .viewer-nav .btn {
      min-width: 64px;
      font-size: 1.1rem;
    }

    .viewer-count {
      color: var(--text-muted);
      font-size: var(--fs-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoViewer {
  private readonly lang = inject(LanguageStore);
  protected readonly audio = inject(VocabAudioPlayer);
  protected readonly t = this.lang.t.bind(this.lang);

  /** Các từ có ảnh, theo đúng thứ tự đang hiện trong bảng. */
  readonly words = input.required<readonly VocabularyWord[]>();
  /** Vị trí đang mở trong `words`; null là khung đóng. */
  readonly index = model<number | null>(null);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private swipeFrom: { x: number; y: number } | null = null;

  /** Hướng của lần chuyển ảnh gần nhất — quyết định ảnh mới trượt vào từ phía nào. */
  protected readonly direction = signal<'next' | 'prev' | null>(null);

  protected readonly current = computed(() => {
    const index = this.index();
    const word = index === null ? undefined : this.words()[index];
    const image = word ? vocabImageOf(word) : null;
    return word && image ? { word, image } : null;
  });

  protected readonly hasPrev = computed(() => (this.index() ?? 0) > 0);
  protected readonly hasNext = computed(() => (this.index() ?? 0) < this.words().length - 1);

  constructor() {
    // Mở / đóng thẻ dialog theo `index`. Đóng bằng Esc thì thẻ tự đóng trước rồi mới
    // báo sự kiện `close` — chỗ đó đặt index về null, effect này thấy đã đóng thì thôi.
    effect(() => {
      const open = this.current() !== null;
      const dialog = this.dialog().nativeElement;
      if (open && !dialog.open) {
        // Mở mới thì không trượt: hướng của lần xem trước không còn nghĩa gì.
        untracked(() => this.direction.set(null));
        dialog.showModal();
      }
      if (!open && dialog.open) dialog.close();
    });
  }

  protected step(delta: number): void {
    const index = this.index();
    if (index === null) return;
    const next = index + delta;
    if (next < 0 || next >= this.words().length) return;
    this.audio.stop();
    this.direction.set(delta > 0 ? 'next' : 'prev');
    this.index.set(next);
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.step(-1);
    else if (event.key === 'ArrowRight') this.step(1);
    else return;
    event.preventDefault();
  }

  /**
   * Bấm ra ngoài thì đóng. Thẻ dialog không có lề trong, nên bấm trúng CHÍNH thẻ dialog
   * (chứ không phải thứ gì bên trong) chỉ có thể là bấm lên lớp nền mờ.
   */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.index.set(null);
  }

  protected swipeStart(event: PointerEvent): void {
    this.swipeFrom = { x: event.clientX, y: event.clientY };
  }

  protected swipeEnd(event: PointerEvent): void {
    const from = this.swipeFrom;
    this.swipeFrom = null;
    if (!from) return;
    const dx = event.clientX - from.x;
    const dy = event.clientY - from.y;
    // Phải ngang rõ ràng: kéo chéo lúc đang cuộn dọc khung thì không tính.
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    this.step(dx < 0 ? 1 : -1);
  }
}
