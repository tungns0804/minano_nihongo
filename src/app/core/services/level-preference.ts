import { Injectable, signal } from '@angular/core';

import { readJson, writeJson } from './local-storage';

/** Cấp độ người học đang chọn: một cấp JLPT, "Tất cả", hoặc 'none' — bài không gắn cấp. */
export type LevelPreferenceValue = 'all' | 'none' | 'N5' | 'N4' | 'N3' | 'N2';

const STORAGE_KEY = 'jp-practice:level';

/**
 * Khoá cũ, mỗi tab một khoá. Chỉ đọc một lần để người đang dùng không mất lựa chọn
 * khi chuyển sang khoá chung: lấy của trang chủ trước vì đó là tab mở nhiều nhất.
 */
const LEGACY_KEYS = [
  'jp-practice:level-filter',
  'jp-practice:grammar-level-filter',
  'jp-practice:translate-level-filter',
  'jp-practice:exercise-level-filter',
];

const VALUES: readonly LevelPreferenceValue[] = ['all', 'none', 'N5', 'N4', 'N3', 'N2'];

function isValue(value: unknown): value is LevelPreferenceValue {
  return VALUES.includes(value as LevelPreferenceValue);
}

function initialValue(): LevelPreferenceValue {
  const stored = readJson<unknown>(STORAGE_KEY, null);
  if (isValue(stored)) return stored;
  for (const key of LEGACY_KEYS) {
    const legacy = readJson<unknown>(key, null);
    if (isValue(legacy) && legacy !== 'all') return legacy;
  }
  return 'all';
}

/**
 * Cấp độ chọn MỘT lần cho cả ứng dụng ("Tôi đang học N4").
 *
 * Trước đây mỗi tab danh sách (từ vựng, ngữ pháp, luyện dịch, bài tập bổ trợ) nhớ
 * cấp riêng, nên học N4 thì phải bấm N4 ở cả bốn tab. Giờ bấm ở tab nào cũng đổi cho
 * mọi tab. Tab nào không có bài ở cấp đang chọn thì tự hiện "Tất cả" (xem
 * `LeveledLessonBrowser.level`) — nhưng KHÔNG ghi đè lựa chọn chung, sang tab khác
 * vẫn đúng cấp đã chọn.
 */
@Injectable({ providedIn: 'root' })
export class LevelPreference {
  private readonly valueRef = signal<LevelPreferenceValue>(initialValue());
  readonly value = this.valueRef.asReadonly();

  set(value: LevelPreferenceValue): void {
    this.valueRef.set(value);
    writeJson(STORAGE_KEY, value);
  }
}
