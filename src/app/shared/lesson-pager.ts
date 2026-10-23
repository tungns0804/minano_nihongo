import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../core/i18n/language-store';
import { LessonStore } from '../core/lessons/lesson-store';
import type { LessonKind } from '../core/lessons/vocabulary.model';

/** Nhánh đường dẫn của từng loại bài có trang chi tiết riêng. */
const BASE: Partial<Record<LessonKind, string>> = {
  vocabulary: '/lesson',
  verb: '/lesson',
  conversation: '/lesson',
  grammar: '/grammar',
  translation: '/translate',
};

/**
 * "← Bài trước · Bài sau →" ở cuối trang chi tiết bài.
 *
 * Học xong bài 26 thì việc tiếp theo gần như luôn là bài 27 — trước đây phải quay về
 * danh sách, cuộn tìm, rồi bấm. Bài kề lấy trong CÙNG loại bài, theo đúng thứ tự của
 * danh sách (`LessonStore.summaries`), nên bài từ vựng không nhảy sang bài ngữ pháp.
 */
@Component({
  selector: 'app-lesson-pager',
  imports: [RouterLink],
  template: `
    @if (prev() || next()) {
      <nav class="pager" [attr.aria-label]="t('pager.aria')">
        @if (prev(); as item) {
          <a class="card pager-link" [routerLink]="[base(), item.id]">
            <span class="pager-dir">← {{ t('pager.prev') }}</span>
            <span class="pager-name">{{ item.name }}</span>
          </a>
        } @else {
          <span></span>
        }
        @if (next(); as item) {
          <a class="card pager-link pager-next" [routerLink]="[base(), item.id]">
            <span class="pager-dir">{{ t('pager.next') }} →</span>
            <span class="pager-name">{{ item.name }}</span>
          </a>
        }
      </nav>
    }
  `,
  styles: `
    .pager {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--sp-3);
    }

    .pager-link {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 14px 18px;
      color: var(--text);
      transition: border-color var(--dur) var(--ease);
    }

    .pager-link:hover {
      border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
      text-decoration: none;
    }

    .pager-next {
      grid-column: 2;
      text-align: right;
    }

    .pager-dir {
      color: var(--accent);
      font-size: var(--fs-xs);
      font-weight: 700;
    }

    .pager-name {
      font-family: var(--font-jp);
      font-weight: 600;
      overflow-wrap: anywhere;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPager {
  private readonly lessons = inject(LessonStore);
  private readonly lang = inject(LanguageStore);
  protected readonly t = this.lang.t.bind(this.lang);

  readonly lessonId = input.required<string>();
  readonly kind = input.required<LessonKind>();

  protected readonly base = computed(() => BASE[this.kind()] ?? '');

  private readonly siblings = computed(() => {
    if (!this.base()) return [];
    return this.lessons.summaries().filter((lesson) => lesson.kind === this.kind());
  });

  private readonly index = computed(() => this.siblings().findIndex((lesson) => lesson.id === this.lessonId()));

  protected readonly prev = computed(() => (this.index() > 0 ? this.siblings()[this.index() - 1] : null));
  protected readonly next = computed(() => {
    const index = this.index();
    return index >= 0 && index < this.siblings().length - 1 ? this.siblings()[index + 1] : null;
  });
}
