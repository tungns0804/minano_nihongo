import { Injectable, computed, signal } from '@angular/core';

import { todayDay } from '../n3/n3.model';
import {
  AreaSummary,
  ReviewArea,
  ReviewCard,
  ReviewGrade,
  ReviewRef,
  ReviewSettings,
  dismissMistake,
  dueKeysOf,
  mistakeKeysOf,
  packCards,
  sanitizeReviewSettings,
  schedule,
  summarize,
  unpackCards,
} from '../review/review.model';
import { readJson, writeJson } from './local-storage';

const STORAGE_KEY = 'jp-practice:review';
const SETTINGS_KEY = 'jp-practice:review-settings';

/**
 * Lịch ôn tập ngắt quãng của mọi mục người học đã luyện, cùng sổ lỗi sai.
 *
 * Được ghi từ `PracticeSessionStore` mỗi khi một câu chấm xong — màn hình luyện tập
 * không phải biết gì về lịch ôn. Phần tính lịch nằm ở `review/review.model.ts`, ở
 * đây chỉ giữ dữ liệu, lưu xuống localStorage và tổng hợp cho trang Ôn tập.
 *
 * Cùng họ với `N3ProgressStore`: một khoá localStorage, một signal, ghi lại sau mỗi
 * lần đổi, và báo khi ghi thất bại.
 */
@Injectable({ providedIn: 'root' })
export class ReviewStore {
  private readonly cards = signal<Record<string, ReviewCard>>(
    unpackCards(readJson<unknown>(STORAGE_KEY, {})),
  );

  /** Lần ghi gần nhất có thất bại không — xem ghi chú cùng tên ở `N3ProgressStore`. */
  private readonly persistFailedRef = signal(false);
  readonly persistFailed = this.persistFailedRef.asReadonly();

  /**
   * Hôm nay, dạng số ngày.
   *
   * Signal chứ không tính một lần lúc khởi động: tab để mở qua đêm thì sáng hôm sau
   * số mục đến hạn phải tăng lên. Được làm mới mỗi lần ghi và mỗi lần mở trang Ôn tập.
   */
  private readonly todayRef = signal(todayDay());

  private readonly settingsRef = signal<ReviewSettings>(
    sanitizeReviewSettings(readJson<unknown>(SETTINGS_KEY, null)),
  );
  readonly settings = this.settingsRef.asReadonly();

  readonly summary = computed<Record<ReviewArea, AreaSummary>>(() =>
    summarize(this.cards(), this.todayRef()),
  );

  readonly dueTotal = computed(() =>
    Object.values(this.summary()).reduce((sum, area) => sum + area.due, 0),
  );

  refreshDay(): void {
    const today = todayDay();
    if (today !== this.todayRef()) this.todayRef.set(today);
  }

  cardOf(key: string): ReviewCard | null {
    return this.cards()[key] ?? null;
  }

  dueKeys(areas: readonly ReviewArea[]): string[] {
    return dueKeysOf(this.cards(), areas, this.todayRef());
  }

  mistakeKeys(areas: readonly ReviewArea[]): string[] {
    return mistakeKeysOf(this.cards(), areas);
  }

  /** Ghi kết quả một câu vừa chấm xong. */
  record(ref: ReviewRef, grade: ReviewGrade): void {
    this.refreshDay();
    const today = this.todayRef();
    this.update((current) => ({
      ...current,
      [ref.key]: schedule(current[ref.key] ?? null, grade, today, ref.source),
    }));
  }

  dismissMistake(key: string): void {
    const card = this.cards()[key];
    if (!card) return;
    this.update((current) => ({ ...current, [key]: dismissMistake(card) }));
  }

  updateSettings(patch: Partial<ReviewSettings>): void {
    const next = sanitizeReviewSettings({ ...this.settingsRef(), ...patch });
    this.settingsRef.set(next);
    writeJson(SETTINGS_KEY, next);
  }

  private update(mutate: (current: Record<string, ReviewCard>) => Record<string, ReviewCard>): void {
    const next = mutate(this.cards());
    this.cards.set(next);
    this.persistFailedRef.set(!writeJson(STORAGE_KEY, packCards(next)));
  }
}
