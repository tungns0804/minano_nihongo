import { Injectable, signal } from '@angular/core';

import { readJson, writeJson } from '../services/local-storage';
import { newSeed } from '../utils/random';

const SEEDS_KEY = 'jp-practice:batch-mix-seeds';
const MIXED_KEY = 'jp-practice:batch-mix-on';

/** { [lessonId]: hạt giống trộn đang dùng } */
type SeedMap = Record<string, number>;

/**
 * Cách xếp từ vào các cụm khi "Học theo cụm".
 *
 * Theo thứ tự trong bài thì cụm 1 lần nào cũng là đúng 10 từ đầu, theo đúng một
 * thứ tự — học mãi một kiểu, nhớ từ theo vị trí chứ không theo mặt chữ. Bật trộn thì
 * cả bài được xếp lại theo `seededShuffle(…, hạt giống của bài)` rồi mới cắt cụm.
 *
 * Hạt giống GIỮ NGUYÊN giữa các phiên (lưu theo từng bài), vì cụm 1 hôm nay và cụm 2
 * ngày mai phải cắt từ cùng một thứ tự thì mới chia hết bài, không trùng từ. Nó chỉ
 * đổi khi:
 *  - người học đi hết cụm cuối của vòng (xem `PracticeSessionStore.finish`) — vòng
 *    sau tự trộn kiểu khác;
 *  - người học bấm "Trộn kiểu khác".
 */
@Injectable({ providedIn: 'root' })
export class BatchMixStore {
  private readonly seeds = signal<SeedMap>(sanitize(readJson<SeedMap>(SEEDS_KEY, {})));

  /** Trộn từ vào cụm (mặc định) hay giữ thứ tự trong bài. Một lựa chọn chung cho mọi bài. */
  readonly mixed = signal<boolean>(readJson<boolean>(MIXED_KEY, true) !== false);

  setMixed(mixed: boolean): void {
    this.mixed.set(mixed);
    writeJson(MIXED_KEY, mixed);
  }

  /** Hạt giống của bài; bài chưa có thì tạo mới và lưu lại. */
  seedOf(lessonId: string): number {
    const existing = this.seeds()[lessonId];
    return typeof existing === 'number' ? existing : this.reshuffle(lessonId);
  }

  /** Đổi sang một cách trộn mới cho bài. Trả về hạt giống mới. */
  reshuffle(lessonId: string): number {
    let seed = newSeed();
    // Hiếm nhưng có thể: bốc trúng hạt giống cũ thì "trộn kiểu khác" lại y như cũ.
    if (seed === this.seeds()[lessonId]) seed = (seed + 1) >>> 0;
    const next = { ...this.seeds(), [lessonId]: seed };
    this.seeds.set(next);
    writeJson(SEEDS_KEY, next);
    return seed;
  }
}

/** Bỏ các mục hỏng (sửa tay localStorage, bản cũ…) để `seedOf` không trả về NaN. */
function sanitize(value: unknown): SeedMap {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const result: SeedMap = {};
  for (const [lessonId, seed] of Object.entries(value as Record<string, unknown>)) {
    if (typeof seed === 'number' && Number.isInteger(seed) && seed >= 0) result[lessonId] = seed >>> 0;
  }
  return result;
}
