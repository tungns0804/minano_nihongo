import { Injectable, computed, signal } from '@angular/core';

import { todayDay } from '../n3/n3.model';
import {
  AreaSummary,
  MASTERED_STAGE,
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
} from './review.model';
import { readJson, writeJson } from '../services/local-storage';

const STORAGE_KEY = 'jp-practice:review';

/** Tiến độ của một bài trong lịch ôn — xem `ReviewStore.progressBySource`. */
export interface SourceProgress {
  tracked: number;
  due: number;
  mastered: number;
}
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

  /**
   * Tiến độ theo từng bài (`ReviewCard.source`): bao nhiêu mục đã vào lịch ôn, bao nhiêu
   * đang đến hạn, bao nhiêu đã nhớ lâu — số liệu trên thẻ bài ở các trang danh sách.
   * Thẻ ghi bài của lần luyện GẦN NHẤT, nên một từ có ở hai bài chỉ tính cho một bài.
   */
  readonly progressBySource = computed(() => {
    const today = this.todayRef();
    const map = new Map<string, SourceProgress>();
    for (const card of Object.values(this.cards())) {
      const entry = map.get(card.source) ?? { tracked: 0, due: 0, mastered: 0 };
      entry.tracked++;
      if (card.due <= today) entry.due++;
      if (card.stage >= MASTERED_STAGE) entry.mastered++;
      map.set(card.source, entry);
    }
    return map;
  });

  refreshDay(): void {
    const today = todayDay();
    if (today !== this.todayRef()) this.todayRef.set(today);
  }

  cardOf(key: string): ReviewCard | null {
    return this.cards()[key] ?? null;
  }

  /** Thẻ `key` đang đến hạn ôn (hôm nay hoặc đã quá hạn) chưa. */
  isDue(key: string): boolean {
    const card = this.cards()[key];
    return card !== undefined && card.due <= this.todayRef();
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
