import { Injectable, signal } from '@angular/core';

import { todayDay } from '../n3/n3.model';
import { readJson, writeJson } from '../services/local-storage';
import { LessonPractice, PracticeHistory, recordSession, sanitizeHistory } from './practice-history.model';

const STORAGE_KEY = 'jp-practice:practice-history';

/**
 * Số lượt đã luyện của từng bài — nguồn của dòng "Đã luyện N lượt" dưới nút Bắt đầu,
 * "Lượt thứ N" ở màn kết quả và số lượt trên thẻ bài ngoài danh sách. Toán nằm ở
 * `practice-history.model.ts`; ở đây chỉ giữ dữ liệu và lưu xuống localStorage.
 *
 * Được ghi từ `PracticeSessionStore` đúng lúc một phiên làm tới câu cuối.
 */
@Injectable({ providedIn: 'root' })
export class PracticeHistoryStore {
  private readonly historyRef = signal<PracticeHistory>(
    sanitizeHistory(readJson<unknown>(STORAGE_KEY, {})),
  );
  /** Hôm nay — signal để "gần nhất: hôm nay/hôm qua" không đứng yên khi tab mở qua đêm. */
  private readonly todayRef = signal(todayDay());

  readonly history = this.historyRef.asReadonly();
  readonly today = this.todayRef.asReadonly();

  /** Lượt của một bài; null khi chưa làm xong lượt nào. */
  of(lessonId: string | null | undefined): LessonPractice | null {
    return lessonId ? (this.historyRef()[lessonId] ?? null) : null;
  }

  /** Gọi khi mở một màn có hiện "gần nhất: hôm qua…" — tab có thể đã mở từ hôm trước. */
  refreshDay(): void {
    const today = todayDay();
    if (today !== this.todayRef()) this.todayRef.set(today);
  }

  record(lessonId: string, questions: number, correct: number): void {
    this.refreshDay();
    const next = recordSession(this.historyRef(), lessonId, this.todayRef(), questions, correct);
    if (next === this.historyRef()) return;
    this.historyRef.set(next);
    writeJson(STORAGE_KEY, next);
  }
}
