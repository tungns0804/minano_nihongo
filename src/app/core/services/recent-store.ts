import { Injectable, signal } from '@angular/core';

import type { MessageKey } from '../i18n/messages';
import { readJson, writeJson } from './local-storage';

/** Một bài vừa mở, đủ để vẽ một dòng "Học tiếp" trên trang Hôm nay. */
export interface RecentEntry {
  /** Đường dẫn mở lại bài, ví dụ "/lesson/minano-nihongo-33". */
  path: string;
  /**
   * Tên bài như lúc mở. Bài từ dữ liệu có tên là chữ sẵn; bài tập cài trong mã
   * nguồn thì tên là khoá thông điệp (`titleKey`) để còn đổi theo ngôn ngữ.
   */
  title: string;
  titleKey?: MessageKey;
  /** Loại bài (Từ vựng, Ngữ pháp, Luyện dịch…), hiện nhỏ cạnh tên. */
  kindKey: MessageKey;
}

const STORAGE_KEY = 'jp-practice:recent';
const MAX_ENTRIES = 3;

function sanitize(raw: unknown): RecentEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is RecentEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.path === 'string' &&
        item.path.startsWith('/') &&
        typeof item.title === 'string' &&
        typeof item.kindKey === 'string',
    )
    .slice(0, MAX_ENTRIES);
}

/**
 * Vài bài mở gần nhất, mới nhất trước — nguồn của khối "Học tiếp" trên trang Hôm nay.
 *
 * Ghi lúc MỞ trang bài chứ không lúc luyện xong: người học thường đọc bảng từ hay lý
 * thuyết ngữ pháp rồi mới luyện, và "đang dở" là đang đọc dở cũng tính. Khoá thông
 * điệp không còn trong từ điển (sau khi đổi tên khoá) thì trang Hôm nay tự dùng
 * `title` đã lưu.
 */
@Injectable({ providedIn: 'root' })
export class RecentStore {
  private readonly entriesRef = signal<RecentEntry[]>(
    sanitize(readJson<unknown>(STORAGE_KEY, [])),
  );
  readonly entries = this.entriesRef.asReadonly();

  record(entry: RecentEntry): void {
    const next = [entry, ...this.entriesRef().filter((item) => item.path !== entry.path)].slice(
      0,
      MAX_ENTRIES,
    );
    this.entriesRef.set(next);
    writeJson(STORAGE_KEY, next);
  }
}
