import { Injectable, signal } from '@angular/core';

import { STROKE_PATH_SHARDS, StrokePathShard } from './stroke-path-shards.generated';

type ShardModule = { STROKE_PATHS: Readonly<Record<string, string>> };

/**
 * Mỗi nhóm một lệnh `import()` viết tường minh: trình đóng gói chỉ tách được gói
 * riêng cho đường dẫn tĩnh, ghép chuỗi tên file lúc chạy là nó gom cả sáu nhóm vào
 * một gói — đúng thứ việc chia nhóm sinh ra để tránh.
 */
const LOADERS: Record<StrokePathShard, () => Promise<ShardModule>> = {
  n5: () => import('./stroke-paths-n5.generated'),
  n4: () => import('./stroke-paths-n4.generated'),
  n3: () => import('./stroke-paths-n3.generated'),
  n2: () => import('./stroke-paths-n2.generated'),
  n1: () => import('./stroke-paths-n1.generated'),
  radical: () => import('./stroke-paths-radical.generated'),
};

/** chữ -> nhóm chứa nó. Dựng một lần từ bảng nhỏ, không cần tải nhóm nào. */
const SHARD_OF = new Map<string, StrokePathShard>();
for (const [shard, chars] of Object.entries(STROKE_PATH_SHARDS) as [StrokePathShard, string][]) {
  for (const char of chars) SHARD_OF.set(char, shard);
}

/**
 * Kho đường nét GỐC để vẽ (xem `stroke-path.ts`), nạp theo nhóm cấp JLPT.
 *
 * Khác `StrokeStore` (bản rút gọn để chấm, nạp cả bảng một lần): ở đây trang một
 * chữ chỉ cần một chữ, nên chỉ tải đúng nhóm chứa chữ đó, và mỗi nhóm tải một lần
 * dù được hỏi bao nhiêu lần.
 */
@Injectable({ providedIn: 'root' })
export class StrokePathStore {
  private readonly loaded = new Map<StrokePathShard, Readonly<Record<string, string>>>();
  private readonly requests = new Map<StrokePathShard, Promise<void>>();

  /** Tăng mỗi khi có thêm một nhóm về tới — đọc nó trong computed để vẽ lại. */
  readonly version = signal(0);

  /** Tải nhóm chứa chữ này (nếu chưa tải). Chữ không có đường nét thì thôi. */
  loadFor(char: string): Promise<void> {
    const shard = SHARD_OF.get(char);
    if (!shard) return Promise.resolve();

    const pending = this.requests.get(shard);
    if (pending) return pending;

    const request = LOADERS[shard]().then(({ STROKE_PATHS }) => {
      this.loaded.set(shard, STROKE_PATHS);
      this.version.update((count) => count + 1);
    });
    this.requests.set(shard, request);
    return request;
  }

  /** Các đường `d` của chữ, đúng thứ tự viết; null khi nhóm chưa về hoặc không có chữ đó. */
  pathsOf(char: string): string[] | null {
    const shard = SHARD_OF.get(char);
    const row = shard ? this.loaded.get(shard)?.[char] : undefined;
    return row ? row.split('|') : null;
  }
}
