import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import { ReviewStore } from '../core/review/review-store';
import { RecentStore } from '../core/services/recent-store';

/**
 * Dòng tiến độ trên thẻ bài ở các trang danh sách (Từ vựng, Ngữ pháp, Luyện tập).
 *
 * Trước đây thẻ chỉ ghi "38 từ" — nhìn lưới 59 bài không biết bài nào đã học, bài nào
 * có mục tới hạn ôn, mình đang học dở bài nào. Dòng này trả lời đủ ba câu đó:
 *
 *  - "Đang học": bài mở gần nhất (`RecentStore`), để quay lại đúng chỗ;
 *  - thanh + "Đã học x/y": số mục của bài đã vào lịch ôn (`ReviewStore.progressBySource`),
 *    chỉ khi đơn vị đếm khớp tổng của thẻ (`total`); không khớp thì ghi "Đã luyện x";
 *  - "z đến hạn": mục của bài này đang chờ ôn.
 *
 * Bài chưa đụng tới thì không vẽ gì — lưới bài mới vẫn gọn như cũ.
 */
@Component({
  selector: 'app-lesson-progress',
  template: `
    @if (isCurrent() || stats()) {
      <div class="lp">
        @if (isCurrent()) {
          <span class="lp-current">{{ t('progress.current') }}</span>
        }
        @if (stats(); as s) {
          @if (total(); as all) {
            <span class="lp-bar" aria-hidden="true"><span [style.width.%]="percent()"></span></span>
            <span class="lp-text">{{ t('progress.learned', { count: learned(), total: all }) }}</span>
          } @else {
            <span class="lp-text">{{ t('progress.practiced', { count: s.tracked }) }}</span>
          }
          @if (s.due > 0) {
            <span class="lp-due">{{ t('progress.due', { count: s.due }) }}</span>
          }
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .lp {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px 10px;
      font-size: var(--fs-xs);
      color: var(--text-muted);
    }

    .lp-current {
      padding: 1px 8px;
      border-radius: var(--radius-pill);
      background: var(--brand-soft);
      color: var(--brand);
      font-weight: 700;
    }

    .lp-bar {
      flex: 1 1 60px;
      max-width: 120px;
      height: 5px;
      border-radius: var(--radius-pill);
      background: var(--bg-subtle);
      overflow: hidden;
    }

    .lp-bar span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--accent);
    }

    .lp-text {
      font-variant-numeric: tabular-nums;
    }

    .lp-due {
      color: var(--warning);
      font-weight: 700;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonProgress {
  private readonly reviews = inject(ReviewStore);
  private readonly recent = inject(RecentStore);
  private readonly lang = inject(LanguageStore);
  protected readonly t = this.lang.t.bind(this.lang);

  /** Id bài như lịch ôn ghi (`ReviewCard.source`) — chính là id bài / bài tập / chủ đề. */
  readonly source = input.required<string>();
  /** Đường dẫn mở bài, để biết đây có phải bài đang học dở không. */
  readonly path = input.required<string>();
  /** Tổng số mục cùng đơn vị với thẻ ôn; null khi không đếm cùng đơn vị (bài ngữ pháp). */
  readonly total = input<number | null>(null);

  protected readonly stats = computed(() => this.reviews.progressBySource().get(this.source()) ?? null);
  protected readonly isCurrent = computed(() => this.recent.entries()[0]?.path === this.path());
  /** Không vượt tổng: một mục có thể vào lịch từ một bài khác cùng chứa nó. */
  protected readonly learned = computed(() => Math.min(this.stats()?.tracked ?? 0, this.total() ?? 0));
  protected readonly percent = computed(() => {
    const total = this.total();
    return total ? Math.round((this.learned() / total) * 100) : 0;
  });
}
