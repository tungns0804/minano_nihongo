import { Injectable, computed, signal } from '@angular/core';

import { todayDay } from '../n3/n3.model';
import { readJson, writeJson } from '../services/local-storage';
import {
  ActivityLog,
  DayActivity,
  applyGoal,
  lastWeek,
  recordAnswer,
  sanitizeGoal,
  sanitizeLog,
  streakOf,
} from './activity.model';

const LOG_KEY = 'jp-practice:activity';
const GOAL_KEY = 'jp-practice:daily-goal';

const EMPTY_DAY: DayActivity = { answered: 0, correct: 0, met: false };

/**
 * Số câu đã làm mỗi ngày, mục tiêu hằng ngày và chuỗi ngày học — nguồn của khối "Kế
 * hoạch hôm nay" (trang Hôm nay), chip 🔥 trên thanh trên cùng và lời chúc ở màn kết
 * quả. Toán nằm ở `activity.model.ts`; ở đây chỉ giữ dữ liệu và lưu xuống localStorage.
 *
 * Được ghi từ `PracticeSessionStore` mỗi khi một câu chấm XONG (đúng, hoặc hết lượt /
 * bấm xem đáp án) — câu còn đang thử lại thì chưa tính.
 */
@Injectable({ providedIn: 'root' })
export class ActivityStore {
  private readonly logRef = signal<ActivityLog>(sanitizeLog(readJson<unknown>(LOG_KEY, {})));
  private readonly goalRef = signal<number>(sanitizeGoal(readJson<unknown>(GOAL_KEY, null)));
  /** Hôm nay — signal để tab mở qua đêm sáng ra vẫn tính đúng ngày (xem `refreshDay`). */
  private readonly todayRef = signal(todayDay());

  readonly goal = this.goalRef.asReadonly();
  readonly today = computed<DayActivity>(() => this.logRef()[this.todayRef()] ?? EMPTY_DAY);
  readonly streak = computed(() => streakOf(this.logRef(), this.todayRef()));
  readonly week = computed(() => lastWeek(this.logRef(), this.todayRef()));
  /** Còn bao nhiêu câu nữa thì đạt mục tiêu hôm nay; 0 khi đã đạt. */
  readonly remaining = computed(() =>
    this.today().met ? 0 : Math.max(0, this.goalRef() - this.today().answered),
  );

  /**
   * Bật lên đúng lúc câu trả lời làm hôm nay vừa đạt mục tiêu — màn kết quả dùng nó để
   * chúc mừng một lần, không lặp lại ở mọi phiên sau trong ngày.
   */
  private readonly justMetRef = signal(false);
  readonly justMet = this.justMetRef.asReadonly();

  refreshDay(): void {
    const today = todayDay();
    if (today !== this.todayRef()) this.todayRef.set(today);
  }

  recordAnswer(correct: boolean): void {
    this.refreshDay();
    const before = this.today().met;
    this.save(recordAnswer(this.logRef(), this.todayRef(), correct, this.goalRef()));
    if (!before && this.today().met) this.justMetRef.set(true);
  }

  /** Màn kết quả đã chúc mừng xong. */
  acknowledgeGoal(): void {
    this.justMetRef.set(false);
  }

  setGoal(goal: number): void {
    const next = sanitizeGoal(goal);
    this.goalRef.set(next);
    writeJson(GOAL_KEY, next);
    this.refreshDay();
    this.save(applyGoal(this.logRef(), this.todayRef(), next));
  }

  private save(log: ActivityLog): void {
    this.logRef.set(log);
    writeJson(LOG_KEY, log);
  }
}
