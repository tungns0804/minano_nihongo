import { ChangeDetectionStrategy, Component, Injectable, inject, input, signal } from '@angular/core';

import { LanguageStore } from '../core/i18n/language-store';
import type { MessageKey } from '../core/i18n/messages';
import { readJson, writeJson } from '../core/services/local-storage';

const STORAGE_KEY = 'jp-practice:setup-more-open';

/**
 * Phần "Tuỳ chỉnh thêm" đang mở hay đóng — MỘT lựa chọn cho mọi khung thiết lập.
 * Người hay chỉnh số câu, cách trả lời thì mở một lần là mọi bài đều mở sẵn; người
 * chỉ bấm Bắt đầu thì không bao giờ phải thấy chúng.
 */
@Injectable({ providedIn: 'root' })
export class SetupMorePreference {
  private readonly openRef = signal(readJson<unknown>(STORAGE_KEY, false) === true);
  readonly open = this.openRef.asReadonly();

  set(open: boolean): void {
    if (open === this.openRef()) return;
    this.openRef.set(open);
    writeJson(STORAGE_KEY, open);
  }
}

/**
 * Khung "Thiết lập luyện tập" hai tầng, dùng chung cho mọi màn hình có nút Bắt đầu.
 *
 * Trước đây mỗi màn hình tự dựng một khung với năm sáu nhóm lựa chọn xếp dọc: muốn
 * luyện nhanh vẫn phải lướt qua phạm vi, chiều hỏi, cách trả lời, số câu, cụm câu và
 * ba công tắc. Giờ khung chia làm ba vùng chiếu nội dung:
 *
 *  - nội dung mặc định: tiêu đề và các lựa chọn QUYẾT ĐỊNH học cái gì (phạm vi, chiều
 *    hỏi, dạng bài…) — luôn hiện;
 *  - `[setupAdvanced]`: các lựa chọn chỉnh CÁCH học (cách trả lời, số câu, tuỳ chọn) —
 *    gập trong "Tuỳ chỉnh thêm", mặc định đóng, nhớ chung cho mọi khung;
 *  - `[setupActions]`: dòng tóm tắt + nút Bắt đầu và các cảnh báo — luôn hiện, nên
 *    lựa chọn đang gập vẫn đọc được trong dòng tóm tắt.
 *
 * Giữ nguyên lớp `.setup` / `.field` / `.start-bar` của style dùng chung: nội dung
 * chiếu vào là con TRỰC TIẾP của `.setup` (ng-content và ng-container không sinh thẻ),
 * nên mọi luật `.setup > .field` vẫn khớp như trước.
 *
 * Màn hình nào cần cuộn tới khung thì đặt class lên chính thẻ này
 * (`<app-practice-setup class="practice-card">`).
 */
@Component({
  selector: 'app-practice-setup',
  template: `
    <section class="card">
      <div class="card-body stack setup">
        <ng-content />

        <details class="setup-more" [open]="more.open()" (toggle)="onToggle($event)">
          <summary class="setup-more-toggle">
            <span class="setup-more-title">{{ t('lesson.setup.more') }}</span>
            <span class="setup-more-hint">{{ t(moreHintKey()) }}</span>
          </summary>
          <div class="stack setup setup-more-body">
            <ng-content select="[setupAdvanced]" />
          </div>
        </details>

        <ng-content select="[setupActions]" />
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PracticeSetup {
  protected readonly more = inject(SetupMorePreference);
  private readonly lang = inject(LanguageStore);
  protected readonly t = this.lang.t.bind(this.lang);

  /** Dòng nhỏ cạnh "Tuỳ chỉnh thêm", kể những gì đang gập bên trong. */
  readonly moreHintKey = input<MessageKey>('lesson.setup.moreHint');

  protected onToggle(event: Event): void {
    this.more.set((event.target as HTMLDetailsElement).open);
  }
}
