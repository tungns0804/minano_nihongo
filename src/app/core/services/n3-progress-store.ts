import { Injectable, computed, signal } from '@angular/core';

import { N3_SECTIONS } from '../n3/n3-syllabus';
import { canTick, dayToIso, todayDay, unitsOf } from '../n3/n3.model';
import { readJson, writeJson } from './local-storage';

const STORAGE_KEY = 'jp-practice:n3-progress';
const SCOPE_KEY = 'jp-practice:n3-scope-choukai';

/** { [unitId]: ngày tích, dạng 'YYYY-MM-DD' } */
type DoneMap = Record<string, string>;

/**
 * Dấu "đã học xong" của từng mục trong lộ trình N3.
 *
 * Lưu NGÀY tích chứ không lưu `true`. Cùng một dung lượng, nhưng nhờ có ngày mà
 * trang tiến độ nói được "bảy ngày qua học 12 mục" và "học liền 5 ngày" — hai
 * con số nói lên nhịp học, còn một cờ true/false thì chỉ nói được tổng số.
 *
 * Cùng họ với `FavoriteStore`: một khoá localStorage, một signal, ghi lại sau mỗi
 * lần đổi. Không gộp vào FavoriteStore vì hai thứ khác nhau về bản chất — ★ là
 * "từ này chưa nhớ" trong phạm vi một bài, còn đây là "buổi học này đã xong".
 */
@Injectable({ providedIn: 'root' })
export class N3ProgressStore {
  /** Id của mọi mục tích được, dùng để loại dữ liệu cũ đã đổi id. */
  private static readonly VALID_IDS: ReadonlySet<string> = new Set(
    N3_SECTIONS.flatMap((section) => unitsOf(section).filter(canTick)).map((unit) => unit.id),
  );

  private readonly map = signal<DoneMap>(sanitize(readJson<unknown>(STORAGE_KEY, {})));

  /**
   * Có tính phần 聴解 vào phần trăm hay không.
   *
   * Mặc định KHÔNG: lần này chưa xây phần luyện nghe, nên để nó trong mẫu số thì
   * con số đứng mãi ở mức thấp và không còn phản ánh việc học đang diễn ra. Bù
   * lại, trang luôn hiện một cảnh báo cạnh con số — xem `n3-progress.html`.
   */
  readonly includeChoukai = signal<boolean>(readJson<boolean>(SCOPE_KEY, false) === true);

  /** Bảng tra nhanh, dùng trong template. */
  private readonly ids = computed(() => new Set(Object.keys(this.map())));

  readonly doneCount = computed(() => this.ids().size);

  /** Ngày tích của từng mục, để phần thống kê nhịp học đọc. */
  readonly doneDates = computed(() => Object.values(this.map()));

  isDone(unitId: string): boolean {
    return this.ids().has(unitId);
  }

  /** Ngày đã tích mục này, hoặc chuỗi rỗng nếu chưa tích. */
  dateOf(unitId: string): string {
    return this.map()[unitId] ?? '';
  }

  toggle(unitId: string): void {
    this.isDone(unitId) ? this.unset([unitId]) : this.set([unitId]);
  }

  /** Tích một loạt mục — dùng cho nút "tích cả tuần". */
  set(unitIds: readonly string[]): void {
    const today = dayToIso(todayDay());
    this.update((current) => {
      const next = { ...current };
      for (const id of unitIds) {
        if (!N3ProgressStore.VALID_IDS.has(id)) continue;
        // Giữ nguyên ngày tích cũ nếu đã có: tích lại một mục đã xong không được
        // làm nó trẻ ra, nếu không thì cột "học trong 7 ngày qua" thổi phồng lên.
        next[id] ??= today;
      }
      return next;
    });
  }

  unset(unitIds: readonly string[]): void {
    this.update((current) => {
      const next = { ...current };
      for (const id of unitIds) delete next[id];
      return next;
    });
  }

  /** Bỏ tích toàn bộ. Người gọi tự lo phần hỏi lại. */
  clearAll(): void {
    this.update(() => ({}));
  }

  setIncludeChoukai(include: boolean): void {
    this.includeChoukai.set(include);
    writeJson(SCOPE_KEY, include);
  }

  private update(mutate: (current: DoneMap) => DoneMap): void {
    const next = mutate(this.map());
    this.map.set(next);
    writeJson(STORAGE_KEY, next);
  }
}

/**
 * Bảo vệ trước dữ liệu localStorage hỏng, và trước id đã bị đổi.
 *
 * Loại id lạ là có chủ ý: nếu một mục bị đổi id lúc sửa lộ trình thì dấu tích cũ
 * trở thành rác không bao giờ hiện ra ở đâu, nhưng vẫn được đếm vào `doneCount`
 * và làm phần trăm cao hơn thực tế.
 */
function sanitize(raw: unknown): DoneMap {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const valid = new Set(
    N3_SECTIONS.flatMap((section) => unitsOf(section).filter(canTick)).map((unit) => unit.id),
  );

  const result: DoneMap = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!valid.has(id)) continue;
    // Bản trước có thể đã ghi `true` thay vì ngày — vẫn coi là đã học, chỉ là
    // không biết học hôm nào.
    if (value === true) {
      result[id] = '';
    } else if (typeof value === 'string' && /^(\d{4}-\d{2}-\d{2})?$/.test(value)) {
      result[id] = value;
    }
  }
  return result;
}
