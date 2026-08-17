import { Injectable, computed, signal } from '@angular/core';

import { readJson, writeJson } from './local-storage';

const STORAGE_KEY = 'jp-practice:favorites';

/** { [lessonId]: danh sách id từ vựng } */
type FavoriteMap = Record<string, string[]>;

/**
 * Danh sách "từ chưa nhớ" của từng bài học.
 *
 * Đây là thứ DUY NHẤT được lưu lại giữa các phiên — kết quả luyện tập thì không
 * lưu, đúng như yêu cầu "mỗi lần luyện tập là một lần mới".
 */
@Injectable({ providedIn: 'root' })
export class FavoriteStore {
  private readonly map = signal<FavoriteMap>(sanitize(readJson<FavoriteMap>(STORAGE_KEY, {})));

  /** Tra cứu nhanh theo cặp lessonId/wordId. */
  private readonly lookup = computed(() => {
    const result = new Map<string, Set<string>>();
    for (const [lessonId, wordIds] of Object.entries(this.map())) {
      result.set(lessonId, new Set(wordIds));
    }
    return result;
  });

  /** Đếm số từ Favorite của một bài, dùng cho thẻ bài học ở trang chủ. */
  readonly counts = computed(() => {
    const result: Record<string, number> = {};
    for (const [lessonId, wordIds] of Object.entries(this.map())) {
      result[lessonId] = wordIds.length;
    }
    return result;
  });

  isFavorite(lessonId: string, wordId: string): boolean {
    return this.lookup().get(lessonId)?.has(wordId) ?? false;
  }

  idsOf(lessonId: string): string[] {
    return this.map()[lessonId] ?? [];
  }

  countOf(lessonId: string): number {
    return this.idsOf(lessonId).length;
  }

  toggle(lessonId: string, wordId: string): void {
    this.isFavorite(lessonId, wordId) ? this.remove(lessonId, [wordId]) : this.add(lessonId, [wordId]);
  }

  add(lessonId: string, wordIds: readonly string[]): void {
    if (wordIds.length === 0) return;
    this.update((current) => {
      const merged = new Set([...(current[lessonId] ?? []), ...wordIds]);
      return { ...current, [lessonId]: [...merged] };
    });
  }

  remove(lessonId: string, wordIds: readonly string[]): void {
    if (wordIds.length === 0) return;
    this.update((current) => {
      const removing = new Set(wordIds);
      const remaining = (current[lessonId] ?? []).filter((id) => !removing.has(id));
      const next = { ...current };
      if (remaining.length > 0) {
        next[lessonId] = remaining;
      } else {
        delete next[lessonId];
      }
      return next;
    });
  }

  clearLesson(lessonId: string): void {
    this.update((current) => {
      const next = { ...current };
      delete next[lessonId];
      return next;
    });
  }

  private update(mutate: (current: FavoriteMap) => FavoriteMap): void {
    const next = mutate(this.map());
    this.map.set(next);
    writeJson(STORAGE_KEY, next);
  }
}

/** Bảo vệ trước dữ liệu localStorage hỏng hoặc do phiên bản cũ ghi ra. */
function sanitize(raw: unknown): FavoriteMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: FavoriteMap = {};
  for (const [lessonId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(value)) continue;
    const ids = value.filter((item): item is string => typeof item === 'string' && item.length > 0);
    if (ids.length > 0) result[lessonId] = [...new Set(ids)];
  }
  return result;
}
