import { Signal, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageStore } from '../i18n/language-store';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  PracticeConfig,
  PracticeScope,
} from '../models/practice.model';
import { PracticePlan } from '../practice/build-questions';
import { FavoriteStore } from '../services/favorite-store';
import { PracticeSessionStore } from '../services/practice-session-store';
import { checkedOf, valueOf } from '../utils/dom-events';

/**
 * Phần chung của bảy màn hình có khung "thiết lập luyện tập".
 *
 * Bảy màn hình đó — bài học, ngữ pháp, bài tập, danh sách Kanji, một chữ Hán,
 * danh sách bộ thủ, một bộ thủ — được dựng bằng cách chép màn hình có trước rồi
 * đổi tên biến, nên đến giờ chúng giống nhau gần như từng ký tự ở bốn phần:
 * các lựa chọn của khung thiết lập, ô tìm + lọc ★ của bảng, khối Favorite, và
 * ba dòng cuối của `start()`.
 *
 * Dùng LỚP CHA chứ không phải một hàm trả về object: template gọi thẳng
 * `scope()`, `toggleShuffle($event)`, `isFavorite(id)`… trên component. Gom vào
 * một object thì mọi template phải đổi thành `setup.scope()` — nhiều chỗ sửa mà
 * chẳng được gì, trong khi kế thừa giữ nguyên đúng cái API mà template đang gọi.
 *
 * Màn hình nào không dùng hết cũng không sao: tab Ngữ pháp không có ô tìm, và
 * `search` ở đó chỉ đơn giản là không bao giờ được đọc tới.
 */
export abstract class PracticeScreen {
  protected readonly favoriteStore = inject(FavoriteStore);
  protected readonly session = inject(PracticeSessionStore);
  protected readonly router = inject(Router);
  protected readonly lang = inject(LanguageStore);

  /** Template gọi `t('key')` để dịch — xem `core/i18n/language-store`. */
  readonly t = this.lang.t.bind(this.lang);
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;

  // ── Thiết lập luyện tập ─────────────────────────────────────────────────

  readonly scope = signal<PracticeScope>('all');
  readonly questionLimit = signal<number | null>(null);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);
  /**
   * Bật gợi ý dưới câu hỏi. Mỗi khu hiểu "gợi ý" một kiểu — âm Hán Việt, một từ
   * dùng chữ đang hỏi, chính mẫu ngữ pháp — nên chỗ dựng `PracticeConfig` mới là
   * nơi quyết định nó đi vào trường nào.
   */
  readonly showHint = signal(false);

  // ── Bộ lọc bảng ─────────────────────────────────────────────────────────

  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  // ── Favorite ────────────────────────────────────────────────────────────

  /**
   * Khoá lưu ★ của màn hình này: hằng ở khu tra cứu (`KANJI_SESSION_ID`), id của
   * bài đang mở ở màn hình chi tiết. Là hàm chứ không phải trường vì ở màn hình
   * chi tiết nó đổi theo đường dẫn.
   */
  protected abstract favoriteSessionId(): string;

  /**
   * Số mục đã đánh dấu ★ trong phạm vi đang xem.
   *
   * Lớp con phải tự khai vì "phạm vi đang xem" mỗi nơi một khác: cấp JLPT đang
   * mở, nhóm nét đang mở, hay toàn bộ bài.
   */
  abstract readonly favoriteCount: Signal<number>;

  /**
   * Đọc `counts()` trước để Angular ghi nhận phụ thuộc vào signal của
   * `FavoriteStore` — `idsOf` là hàm thường nên tự nó không đánh thức gì cả.
   */
  readonly favoriteIds = computed<ReadonlySet<string>>(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(this.favoriteSessionId()));
  });

  isFavorite(id: string): boolean {
    return this.favoriteIds().has(id);
  }

  toggleFavorite(id: string): void {
    this.favoriteStore.toggle(this.favoriteSessionId(), id);
  }

  clearFavorites(): void {
    const count = this.favoriteCount();
    if (count === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count }))) {
      this.favoriteStore.clearLesson(this.favoriteSessionId());
    }
  }

  /** Lọc một danh sách xuống còn các mục đã đánh dấu ★. */
  protected favoritesOf<T extends { id: string }>(items: readonly T[]): T[] {
    const ids = this.favoriteIds();
    return items.filter((item) => ids.has(item.id));
  }

  // ── Sự kiện ─────────────────────────────────────────────────────────────

  /** Đổi phạm vi là đổi số mục đem ra hỏi, nên con số câu cũ không còn nghĩa. */
  setScope(scope: PracticeScope): void {
    this.scope.set(scope);
    this.questionLimit.set(null);
  }

  setQuestionLimit(limit: number | null): void {
    this.questionLimit.set(limit);
  }

  toggleShuffle(event: Event): void {
    this.shuffleQuestions.set(checkedOf(event));
  }

  toggleIgnoreDiacritics(event: Event): void {
    this.ignoreDiacritics.set(checkedOf(event));
  }

  toggleShowHint(event: Event): void {
    this.showHint.set(checkedOf(event));
  }

  onSearch(event: Event): void {
    this.search.set(valueOf(event));
  }

  clearSearch(): void {
    this.search.set('');
  }

  toggleOnlyFavorites(event: Event): void {
    this.onlyFavorites.set(checkedOf(event));
  }

  /**
   * Phạm vi ★ có thể rỗng đi sau khi đổi cấp / nhóm / bài — quay về "Toàn bộ".
   *
   * Không tự chạy theo `favoriteCount` bằng `effect`: bỏ dấu ★ của mục cuối cùng
   * ngay trong lúc đang chọn phạm vi ★ thì nút tự nhảy đi là một thay đổi người
   * dùng không yêu cầu. Chỉ gọi ở chỗ chính người dùng vừa đổi phạm vi xem.
   */
  protected fixScope(): void {
    if (this.scope() === 'favorite' && this.favoriteCount() === 0) this.scope.set('all');
  }

  // ── Bắt đầu phiên ───────────────────────────────────────────────────────

  /**
   * Ba dòng cuối của mọi `start()`: giao phiên cho store, rồi chuyển màn hình.
   *
   * `start` trả về false khi phiên rỗng (không dựng nổi câu nào) — lúc đó ở lại
   * màn hình hiện tại thay vì mở một màn luyện tập trống.
   */
  protected launch(
    lesson: { id: string; name: string },
    config: PracticeConfig,
    plan: PracticePlan,
  ): void {
    if (this.session.start(lesson, config, plan)) {
      void this.router.navigate(['/practice']);
    }
  }
}
