import type { MessageKey } from '../i18n/messages';

/**
 * MÔ HÌNH LỘ TRÌNH N3 — kiểu dữ liệu và toán tính tiến độ.
 *
 * Dữ liệu thật nằm ở `n3-syllabus.ts`; file này chỉ khai kiểu và các hàm thuần.
 * Tách ra để phần toán (đổi ngày, dồn mốc, tính phần trăm) kiểm tra được bằng
 * script mà không phải dựng cả Angular — xem `scripts/verify-n3.mjs`.
 *
 * Văn bản phân tích đi kèm: `LO-TRINH-N3.md` ở gốc dự án.
 */

// ── Trụ nội dung ───────────────────────────────────────────────────────────

/**
 * Năm phần của đề N3, cộng thêm `foundation` cho phần ôn nền N5–N4.
 *
 * Tên trụ đặt theo tên phần trong đề thi (`moji` = 文字, `goi` = 語彙…) chứ không
 * theo tên sách: một trụ có thể lấy nội dung từ nhiều nguồn (trụ `bunpou` hiện
 * lấy từ 皆の日本語 vì chưa có sách 総まとめ N3 文法).
 *
 * `foundation` KHÔNG phải một phần của đề. Nó là cửa vào: đề N3 vẫn hỏi từ và
 * mẫu câu của N5–N4, nên bỏ qua phần này thì học N3 sẽ hổng chân. Nó được tính
 * điểm 0 trong phần trăm chuẩn bị thi, xem `N3_SECTION_POINTS`.
 */
export type N3Pillar = 'moji' | 'goi' | 'bunpou' | 'dokkai' | 'choukai' | 'foundation';

export const N3_PILLARS: readonly N3Pillar[] = [
  'foundation',
  'moji',
  'goi',
  'bunpou',
  'dokkai',
  'choukai',
];

/**
 * Ba khối điểm của đề N3, mỗi khối 0–60 điểm, tổng 180.
 *
 * Nguồn: trang 6 của cả bốn quyển 総まとめ N3 ("合否の判定" và bảng 得点区分).
 * Trang đó nói rõ MỖI khối có 基準点 riêng, và thiếu điểm chuẩn ở dù chỉ một khối
 * là trượt cho dù tổng điểm cao. Đó là lý do phần trăm ở đây tính theo điểm khối
 * chứ không tính theo "số bài đã học / tổng số bài": học hết từ vựng mà bỏ đọc
 * hiểu thì "90% số bài" vẫn là trượt chắc.
 */
export type N3ScoreBlock = 'chishiki' | 'dokkai' | 'choukai';

export const N3_SCORE_BLOCK_POINTS: Record<N3ScoreBlock, number> = {
  // 言語知識（文字・語彙・文法）
  chishiki: 60,
  dokkai: 60,
  choukai: 60,
};

/** Trụ nào góp điểm vào khối nào. `foundation` không góp vào khối nào. */
export const N3_PILLAR_BLOCK: Record<N3Pillar, N3ScoreBlock | null> = {
  foundation: null,
  moji: 'chishiki',
  goi: 'chishiki',
  bunpou: 'chishiki',
  dokkai: 'dokkai',
  choukai: 'choukai',
};

/**
 * Điểm quy cho từng trụ, tổng bằng 180.
 *
 * Khối 言語知識 60 điểm chia đều ba phần 文字/語彙/文法 (20 mỗi phần). Chia đều là
 * một GIẢ ĐỊNH có ý thức, không phải số in trong sách: trang 7 của mỗi quyển cho
 * biết số câu (文字 14 câu, 語彙 21 câu) nhưng không cho biết mỗi câu bao nhiêu
 * điểm, và quyển 文法 thì không có trong nguồn. Chia đều là cách sai ít nhất khi
 * chưa biết, và sửa lại chỉ là sửa ba con số ở đây.
 *
 * `foundation` = 0: ôn nền là điều kiện cần chứ không phải một phần của đề. Nó có
 * thanh tiến độ riêng trên giao diện, xem `N3_FOUNDATION_GATE`.
 */
export const N3_SECTION_POINTS: Record<N3Pillar, number> = {
  foundation: 0,
  moji: 20,
  goi: 20,
  bunpou: 20,
  dokkai: 60,
  choukai: 60,
};

/** Tổng điểm của đề, dùng để đổi phần trăm sang "điểm quy đổi". */
export const N3_TOTAL_POINTS = 180;

/**
 * Tỷ lệ ôn nền cần đạt trước khi vào giai đoạn nạp N3.
 *
 * Không phải 100%: chờ ôn xong từng chữ cuối của 50 bài 皆の日本語 mới dám mở
 * 総まとめ thì mất luôn hai tuần đầu của lộ trình. 80% là mốc "đủ chân để đứng".
 */
export const N3_FOUNDATION_GATE = 0.8;

// ── Đơn vị học ─────────────────────────────────────────────────────────────

/**
 * Trạng thái nguồn của một mục học — quyết định mục đó tích được hay chưa và
 * hiện nhãn gì.
 *
 *  - `app`        : có bài trong ứng dụng, mở ra luyện được ngay.
 *  - `book`       : có sách trong máy nhưng chưa nạp thành bài trong app. Vẫn
 *                   học được (đọc sách) nên vẫn tích được.
 *  - `no-source`  : chưa có cả sách. Không tích được — tích một mục không có gì
 *                   để học là tự khai gian tiến độ.
 *  - `deferred`   : có sách nhưng CHỦ ĐỘNG hoãn (phần 聴解, xem ghi chú ở
 *                   `n3-syllabus.ts`). Tích được, nhưng mặc định không nằm trong
 *                   phần trăm.
 */
export type N3UnitSource = 'app' | 'book' | 'no-source' | 'deferred';

/** Mục học là bài mới hay bài kiểm tra cuối tuần (実戦問題 / まとめ問題). */
export type N3UnitKind = 'lesson' | 'test';

export interface N3Unit {
  /** Id ổn định, cũng là khoá lưu dấu "đã học" trong localStorage. */
  id: string;
  /** Tiêu đề in trong sách, giữ nguyên chữ Nhật. Rỗng với mục không tới từ sách. */
  titleJa: string;
  /** Nghĩa tiếng Việt của tiêu đề. */
  titleVi: string;
  kind: N3UnitKind;
  source: N3UnitSource;
  /**
   * Đường dẫn trong app để học mục này, ví dụ `/lesson/soumatome-n3-1`.
   * Rỗng khi `source` không phải `app`.
   */
  route: string;
  /** Trang sách in, để mở đúng chỗ. 0 nghĩa là không gắn với trang nào. */
  page: number;
  /**
   * Mục này nặng bằng mấy mục thường. Gần như luôn là 1.
   *
   * Có trường này vì một chỗ duy nhất: khối ngữ pháp N3 chưa có sách. Nếu để nó
   * là MỘT mục nặng 1 giữa 25 bài ngữ pháp 皆の日本語 thì học hết 25 bài kia sẽ
   * hiện "ngữ pháp 96%", trong khi thực tế còn thiếu nguyên phần ngữ pháp riêng
   * của N3. Cho nó nặng bằng đúng số mục dự kiến (42) thì trần tiến độ của trụ
   * ngữ pháp tự tụt xuống mức thật, mà giao diện vẫn chỉ có một dòng chứ không
   * phải 42 dòng trống bịa ra tiêu đề.
   */
  weight: number;
}

/** Mục này có tích được không. Mục chưa có nguồn nào cả thì không. */
export function canTick(unit: N3Unit): boolean {
  return unit.source !== 'no-source';
}

/** Một tuần (第N週) hoặc một chương (第N章) của sách. */
export interface N3Block {
  id: string;
  /** Nhãn in trong sách: "第1週", "第1章". */
  labelJa: string;
  /** Nhãn tiếng Việt: "Tuần 1", "Chương 1". */
  labelVi: string;
  titleJa: string;
  titleVi: string;
  /** Trang bắt đầu của tuần/chương trong sách in. 0 nếu không có. */
  startPage: number;
  units: N3Unit[];
}

/** Một trụ nội dung kèm toàn bộ mục học của nó. */
export interface N3Section {
  pillar: N3Pillar;
  /** Khoá thông điệp cho tên trụ, ví dụ 'n3.pillar.moji'. */
  labelKey: MessageKey;
  /** Khoá thông điệp cho câu mô tả một dòng. */
  descKey: MessageKey;
  /** Tên sách nguồn, giữ nguyên chữ Nhật. Rỗng khi chưa có nguồn. */
  book: string;
  /** Ký hiệu ngắn hiện trên thẻ, ví dụ '漢'. */
  glyph: string;
  blocks: N3Block[];
}

/** Trải phẳng mọi mục học của một trụ, giữ nguyên thứ tự trong sách. */
export function unitsOf(section: N3Section): N3Unit[] {
  return section.blocks.flatMap((block) => block.units);
}

/** Tổng trọng số của một danh sách mục. */
export function totalWeight(units: readonly N3Unit[]): number {
  return units.reduce((sum, unit) => sum + unit.weight, 0);
}

// ── Lịch: đổi ngày qua lại ────────────────────────────────────────────────

/**
 * Ngày làm việc dưới dạng SỐ NGUYÊN "số ngày kể từ 1970-01-01", tính theo UTC.
 *
 * Vì sao không dùng `Date` trực tiếp: mọi phép so sánh ở đây là so sánh NGÀY, mà
 * `new Date('2026-12-10')` là nửa đêm UTC — ở múi giờ Việt Nam (UTC+7) nó vẫn là
 * 07:00 ngày 10, nhưng ở múi giờ âm nó lùi về ngày 9. Chuyển sang số nguyên ngay
 * tại cửa vào thì phần còn lại của file không còn cơ hội sai vì múi giờ nữa.
 */
export type DayNumber = number;

const MS_PER_DAY = 86_400_000;

/** '2026-12-10' → số ngày. Chuỗi sai định dạng trả về NaN. */
export function isoToDay(iso: string): DayNumber {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return Number.NaN;
  const [, year, month, date] = match;
  return Math.floor(Date.UTC(Number(year), Number(month) - 1, Number(date)) / MS_PER_DAY);
}

/**
 * Số ngày → '2026-12-10'. Trả chuỗi rỗng nếu không phải một ngày hợp lệ.
 *
 * Không để `new Date()` ném RangeError: `isoToDay` trả NaN cho chuỗi sai định
 * dạng, và NaN đó chảy qua các phép cộng rồi tới đây. Một hằng số ngày viết sai
 * trong `n3-syllabus.ts` khi đó làm trắng cả trang thay vì hiện một ô trống —
 * `npm run verify:n3` bắt lỗi đó, nhưng giao diện vẫn không được sập vì nó.
 */
export function dayToIso(day: DayNumber): string {
  if (!Number.isFinite(day)) return '';
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

/**
 * Hôm nay theo LỊCH ĐỊA PHƯƠNG của người dùng.
 *
 * Lấy từ `getFullYear/getMonth/getDate` chứ không phải `toISOString`: người học ở
 * UTC+7, lúc 06:00 sáng ngày 10 thì `toISOString()` vẫn còn ghi ngày 9. Lệch một
 * ngày ở đây làm cả bảng "đúng hẹn / chậm" sai theo.
 */
export function todayDay(now: Date = new Date()): DayNumber {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / MS_PER_DAY);
}

/** Số ngày từ `from` tới `to`, âm nếu `to` đã qua. */
export function daysBetween(from: DayNumber, to: DayNumber): number {
  return to - from;
}

// ── Lịch: giai đoạn ────────────────────────────────────────────────────────

/**
 * Một giai đoạn của lộ trình.
 *
 * `blocks` là id các KHỐI (tuần/chương/nhóm) được hẹn ngày trong giai đoạn này.
 *
 * Vì sao theo khối mà không theo trụ: trong cùng một trụ có khối phải làm ngay và
 * khối để ôn tuỳ sức. Trụ nền chứa cả 25 bài từ vựng N4 (phải xong trước khi mở
 * sách N3) lẫn 25 bài từ vựng N5 (đã học từ lâu, ôn lại khi có thời gian). Hẹn
 * ngày cho cả trụ thì hai tuần đầu phải cõng 6 buổi mỗi ngày — một con số đúng về
 * số học và vô nghĩa về thực hành.
 *
 * Khối không có tên ở giai đoạn nào thì KHÔNG có ngày hẹn: nó vẫn tích được, vẫn
 * tính vào phần trăm, chỉ là không bị đếm vào nhịp học hằng ngày. Xem
 * `N3_UNSCHEDULED_BLOCKS` — danh sách đó phải khai đủ, `scripts/verify-n3.mjs`
 * không cho một khối lặng lẽ rơi ra ngoài lịch.
 */
export interface N3Phase {
  id: string;
  labelKey: MessageKey;
  goalKey: MessageKey;
  /** Ngày đầu và ngày cuối, bao gồm cả hai đầu. */
  from: string;
  to: string;
  /** Id các khối được hẹn ngày trong giai đoạn này. */
  blocks: readonly string[];
  /** Việc làm hằng ngày, viết thành khoá thông điệp. */
  routineKey: MessageKey;
}

/** Số ngày của một giai đoạn, tính cả ngày đầu và ngày cuối. */
export function phaseDays(phase: N3Phase): number {
  return isoToDay(phase.to) - isoToDay(phase.from) + 1;
}

// ── Lịch: dồn mục học vào từng ngày ───────────────────────────────────────

export interface N3ScheduledUnit {
  unit: N3Unit;
  pillar: N3Pillar;
  /** Id giai đoạn chứa mục này. */
  phaseId: string;
  /** Ngày phải học xong, dạng số. */
  targetDay: DayNumber;
  /** Thứ tự của mục trong toàn bộ lộ trình, đếm từ 1. */
  order: number;
}

export interface N3Schedule {
  units: N3ScheduledUnit[];
  byUnitId: Map<string, N3ScheduledUnit>;
  /** Số mục đến hạn tính tới hết ngày `day`. */
  dueBy(day: DayNumber): number;
}

/**
 * Gán ngày phải-học-xong cho từng mục học.
 *
 * Cách dồn: với mỗi giai đoạn, lấy toàn bộ mục của các trụ mà giai đoạn đó phụ
 * trách, XOAY VÒNG qua các trụ để trộn chúng lại (một mục 漢字, một mục 語彙, một
 * mục 読解, rồi quay lại 漢字…), sau đó rải đều cả dãy lên số ngày của giai đoạn.
 *
 * Vì sao xoay vòng thay vì học lần lượt hết quyển này mới sang quyển khác: mỗi
 * khối điểm của đề có 基準点 riêng. Học hết 漢字 rồi mới mở 読解 vào tháng cuối
 * nghĩa là nếu lộ trình trượt tiến độ, phần bị bỏ dở luôn là 読解 — đúng cái khối
 * đủ sức đánh trượt cả bài thi. Trộn đều thì trượt tiến độ làm mỏng đều cả ba
 * khối, không xoá sổ khối nào.
 *
 * Vì sao rải đều bằng `floor(i * days / total)` mà không phải "mỗi ngày đúng N
 * mục": số mục hiếm khi chia hết cho số ngày. Công thức này tự phân bổ phần dư,
 * và điều quan trọng hơn là nó KHÔNG phụ thuộc vào việc người học đã tích những
 * mục nào — mốc hẹn phải đứng yên, nếu không thì "chậm 3 mục" hôm nay có thể
 * thành "đúng hẹn" ngày mai mà chẳng học gì thêm.
 */
export function buildSchedule(
  sections: readonly N3Section[],
  phases: readonly N3Phase[],
): N3Schedule {
  // Mục chưa có nguồn thì không xếp lịch được: hẹn ngày cho một mục không có gì
  // để học chỉ làm cột "đến hạn hôm nay" phình lên bằng việc không làm được.
  const blockIndex = new Map<string, { pillar: N3Pillar; units: N3Unit[] }>();
  for (const section of sections) {
    for (const block of section.blocks) {
      blockIndex.set(block.id, {
        pillar: section.pillar,
        units: block.units.filter(canTick),
      });
    }
  }

  const scheduled: N3ScheduledUnit[] = [];

  for (const phase of phases) {
    // Gom các khối của giai đoạn theo trụ, giữ nguyên thứ tự khai báo. Xoay vòng
    // diễn ra giữa các TRỤ chứ không giữa các khối: mục đích là mỗi ngày chạm vào
    // cả ba quyển sách, không phải chạm vào cả sáu tuần của một quyển.
    const order: N3Pillar[] = [];
    const grouped = new Map<N3Pillar, N3Unit[]>();
    for (const blockId of phase.blocks) {
      const entry = blockIndex.get(blockId);
      if (!entry) continue;
      if (!grouped.has(entry.pillar)) {
        grouped.set(entry.pillar, []);
        order.push(entry.pillar);
      }
      grouped.get(entry.pillar)!.push(...entry.units);
    }

    const queues = order
      .map((pillar) => ({ pillar, units: grouped.get(pillar) ?? [] }))
      .filter((queue) => queue.units.length > 0);
    if (queues.length === 0) continue;

    // Xoay vòng: lấy lần lượt mục đầu tiên còn lại của từng trụ.
    const interleaved: { unit: N3Unit; pillar: N3Pillar }[] = [];
    const cursors = queues.map(() => 0);
    let remaining = queues.reduce((total, queue) => total + queue.units.length, 0);
    while (remaining > 0) {
      queues.forEach((queue, index) => {
        const cursor = cursors[index];
        if (cursor >= queue.units.length) return;
        interleaved.push({ unit: queue.units[cursor], pillar: queue.pillar });
        cursors[index] = cursor + 1;
        remaining--;
      });
    }

    const start = isoToDay(phase.from);
    const days = phaseDays(phase);
    const total = interleaved.length;

    interleaved.forEach((item, index) => {
      scheduled.push({
        unit: item.unit,
        pillar: item.pillar,
        phaseId: phase.id,
        targetDay: start + Math.min(days - 1, Math.floor((index * days) / total)),
        order: scheduled.length + 1,
      });
    });
  }

  const byUnitId = new Map(scheduled.map((item) => [item.unit.id, item]));

  return {
    units: scheduled,
    byUnitId,
    dueBy: (day) => scheduled.filter((item) => item.targetDay <= day).length,
  };
}

// ── Tính tiến độ ───────────────────────────────────────────────────────────

export interface N3PillarProgress {
  pillar: N3Pillar;
  /** Trọng số đã tích. */
  done: number;
  /** Tổng trọng số của trụ, KỂ CẢ phần chưa có nguồn. */
  total: number;
  /** Trọng số không tích được vì chưa có nguồn nào cả. */
  blocked: number;
  /** Số mục đã tích / số mục tích được — con số để hiện "12/42 mục". */
  doneUnits: number;
  tickableUnits: number;
  ratio: number;
  /**
   * Tỷ lệ cao nhất trụ này còn có thể đạt, tức 1 khi không thiếu nguồn gì.
   *
   * Đây là con số quan trọng nhất của phần thiếu nguồn: nó nói "dù học hết những
   * gì đang có trong tay, trụ này cũng chỉ tới được đây".
   */
  ceiling: number;
  points: number;
  /** Điểm đã kiếm được của trụ này, làm tròn tới 0.1. */
  earned: number;
}

export interface N3Progress {
  pillars: N3PillarProgress[];
  /** Phần trăm chuẩn bị thi, tính trên các trụ đang trong phạm vi. */
  ratio: number;
  /** Trần phần trăm còn đạt được với nguồn hiện có. */
  ceiling: number;
  /** Tổng điểm quy đổi của các trụ trong phạm vi. */
  points: number;
  earned: number;
  /** Số mục đã tích / số mục tích được, trên các trụ trong phạm vi. */
  doneUnits: number;
  tickableUnits: number;
}

/**
 * Tính tiến độ theo ĐIỂM khối thi, không theo số bài.
 *
 * `inScope` quyết định trụ nào được đưa vào phần trăm. Mặc định giao diện bỏ trụ
 * `choukai` ra ngoài (phần luyện nghe hoãn sang lần sau) — nhưng con số khi ấy
 * PHẢI được gắn nhãn rõ là "chưa tính 聴解", nếu không 100% ở đây sẽ được đọc
 * thành "chắc đỗ", trong khi khối 聴解 có 基準点 riêng và đang bằng 0.
 */
export function computeProgress(
  sections: readonly N3Section[],
  isDone: (unitId: string) => boolean,
  inScope: (pillar: N3Pillar) => boolean,
): N3Progress {
  const pillars: N3PillarProgress[] = sections.map((section) => {
    const units = unitsOf(section);
    const tickable = units.filter(canTick);
    const doneList = tickable.filter((unit) => isDone(unit.id));

    const total = totalWeight(units);
    const done = totalWeight(doneList);
    const tickableTotal = totalWeight(tickable);
    const points = N3_SECTION_POINTS[section.pillar];
    const ratio = total === 0 ? 0 : done / total;

    return {
      pillar: section.pillar,
      done,
      total,
      blocked: total - tickableTotal,
      doneUnits: doneList.length,
      tickableUnits: tickable.length,
      ratio,
      ceiling: total === 0 ? 1 : tickableTotal / total,
      points,
      earned: Math.round(ratio * points * 10) / 10,
    };
  });

  const scoped = pillars.filter((item) => inScope(item.pillar) && item.points > 0);
  const points = scoped.reduce((sum, item) => sum + item.points, 0);
  // Cộng các giá trị ĐÃ LÀM TRÒN của từng trụ, không cộng giá trị thô rồi mới
  // làm tròn: hai cách lệch nhau 0,1–0,2 điểm, và giao diện hiện cả tổng lẫn
  // từng phần cạnh nhau nên độ lệch đó đọc thành một lỗi tính toán.
  const earned = scoped.reduce((sum, item) => sum + item.earned, 0);
  const reachable = scoped.reduce((sum, item) => sum + item.ceiling * item.points, 0);

  // Số mục thì đếm cả trụ 0 điểm đang trong phạm vi: dòng "x/y mục" ở đầu trang
  // nói về công sức bỏ ra, mà ôn nền cũng là công sức thật.
  const counting = pillars.filter((item) => inScope(item.pillar));

  return {
    pillars,
    ratio: points === 0 ? 0 : earned / points,
    ceiling: points === 0 ? 1 : reachable / points,
    points,
    earned: Math.round(earned * 10) / 10,
    doneUnits: counting.reduce((sum, item) => sum + item.doneUnits, 0),
    tickableUnits: counting.reduce((sum, item) => sum + item.tickableUnits, 0),
  };
}

// ── Mô phỏng nhịp học ─────────────────────────────────────────────────────

export type N3PaceState =
  | 'ahead'
  | 'onTrack'
  | 'behind'
  | 'unreachable'
  | 'finished'
  | 'examToday'
  | 'overdue';

export interface N3Pace {
  /** Số ngày còn lại tính từ hôm nay tới ngày thi, 0 nếu đã tới hoặc đã qua. */
  daysLeft: number;
  /** Số ngày còn lại tới hết giai đoạn nạp bài (không tính giai đoạn luyện đề). */
  studyDaysLeft: number;
  /** Số mục CÓ HẸN NGÀY còn phải học. */
  remaining: number;
  /**
   * Số mục trong phạm vi tính điểm nhưng KHÔNG có hẹn ngày và chưa học.
   *
   * Phải có mặt riêng chứ không gộp vào `remaining`: hai nhóm này khác nhau về
   * bản chất nghĩa vụ. `remaining` là việc kế hoạch đòi làm xong trước một ngày
   * cụ thể; nhóm này là việc tự nguyện (25 bài từ vựng N5, và cả phần 聴解 nếu
   * người học bật nó vào phần trăm). Gộp lại thì nhịp học hằng ngày phình lên vì
   * việc không hẹn; bỏ hẳn thì trang tự nói ngược nhau — vòng phần trăm ghi
   * "0/215 buổi" mà ô nhịp học ghi "190 buổi còn lại", lệch 25 mục không giải
   * thích được. Tách ra thì cả hai con số đều đúng và đều có nhãn riêng.
   */
  openRemaining: number;
  /** Số mục phải học mỗi ngày kể từ hôm nay để kịp — con số quan trọng nhất. */
  perDay: number;
  /** Nhịp mà kế hoạch gốc dự tính cho hôm nay. */
  plannedPerDay: number;
  /**
   * Số mục đáng ra phải xong TRƯỚC hôm nay.
   *
   * Không tính phần hẹn đúng hôm nay: cả ngày hôm nay vẫn còn để làm nó. Tính vào
   * thì sáng ngày đầu tiên của lộ trình, khi chưa ai kịp học gì, trang đã báo
   * "chậm 3 buổi" — một lời buộc tội sai và là ấn tượng đầu tiên tệ nhất có thể.
   */
  dueToday: number;
  /** Đã xong bao nhiêu mục có mặt trong lịch. */
  doneScheduled: number;
  /** Dương là đang vượt kế hoạch, âm là đang chậm. */
  drift: number;
  state: N3PaceState;
  /** Ngày dự kiến học xong nếu giữ đúng nhịp kế hoạch, dạng ISO. Rỗng nếu không tính được. */
  finishIso: string;
}

/** Ngưỡng mục/ngày mà quá đó thì coi như không kịp bằng cách học thêm. */
export const N3_PACE_CEILING = 6;

/**
 * Mô phỏng nhịp học: còn bao nhiêu ngày, mỗi ngày phải học mấy mục.
 *
 * `perDay` là con số người học cần thấy nhất, và nó được tính lại mỗi lần mở
 * trang chứ không phải một con số in cứng trong kế hoạch: bỏ ba ngày không học
 * thì nhịp bắt buộc phải tự dâng lên, chứ không thể vẫn hiện "2 mục/ngày" như
 * hôm đầu.
 *
 * `state` so tiến độ thật với mốc hẹn của lịch (`dueToday`) chứ không so với
 * đường thẳng đều: kế hoạch có ba tuần ôn nền nạp dày rồi mới sang N3, đường
 * thẳng đều sẽ báo "chậm" suốt ba tuần đầu dù đang học đúng kế hoạch.
 *
 * `sections` phải truyền vào, không suy được từ `schedule`: lịch chỉ chứa mục có
 * hẹn ngày, còn phần trăm tính trên MỌI mục tích được trong phạm vi. Không biết
 * phần chênh đó thì hàm này sẽ báo "đã xong toàn bộ" trong khi phần trăm mới
 * 59,6% — đúng lỗi từng có ở đây.
 */
export function computePace(
  schedule: N3Schedule,
  sections: readonly N3Section[],
  isDone: (unitId: string) => boolean,
  inScope: (pillar: N3Pillar) => boolean,
  examIso: string,
  lastStudyIso: string,
  today: DayNumber = todayDay(),
): N3Pace {
  const scoped = schedule.units.filter((item) => inScope(item.pillar) && canTick(item.unit));
  const doneScheduled = scoped.filter((item) => isDone(item.unit.id)).length;
  const remaining = scoped.length - doneScheduled;

  // Mục trong phạm vi, tích được, nhưng không nằm trong lịch — xem `openRemaining`.
  const openRemaining = sections
    .filter((section) => inScope(section.pillar))
    .flatMap((section) => unitsOf(section))
    .filter(
      (unit) => canTick(unit) && !schedule.byUnitId.has(unit.id) && !isDone(unit.id),
    ).length;

  const examDay = isoToDay(examIso);
  const daysLeft = Math.max(0, examDay - today);
  const studyDaysLeft = Math.max(0, isoToDay(lastStudyIso) - today + 1);

  const dueToday = scoped.filter((item) => item.targetDay < today).length;
  const drift = doneScheduled - dueToday;

  // Chia cho số ngày còn được nạp bài mới, không phải số ngày tới hôm thi: ba
  // tuần cuối là luyện đề và ôn ★, dồn bài mới vào đó là phá luôn phần đó.
  //
  // Hết hạn nạp bài mà vẫn còn nợ thì phải chia cho số ngày THẬT còn lại, không
  // để mẫu số bằng 0 rồi lấy luôn `remaining` làm nhịp: làm thế thì ngày 18/11
  // trang hiện "190 buổi/ngày", một con số vừa vô nghĩa vừa không nói được điều
  // đúng đắn duy nhất lúc đó là "còn 22 ngày để trả 190 buổi".
  // Hết cả ngày thi thì không còn ngày nào để chia: nhịp học là 0, không phải
  // `remaining`. Đúng hôm thi mà trang hiện "190 buổi/ngày" thì con số đó không
  // mô tả bất cứ việc gì làm được nữa.
  const paceDays = studyDaysLeft > 0 ? studyDaysLeft : daysLeft;
  const perDayRaw = paceDays > 0 ? remaining / paceDays : 0;
  const perDay = Math.round(perDayRaw * 10) / 10;

  const plannedToday = scoped.filter((item) => item.targetDay === today).length;

  const state: N3PaceState = (() => {
    // "Xong" nghĩa là xong CẢ phần không hẹn ngày. Chỉ xét `remaining` thì bật
    // phần 聴解 vào phần trăm sẽ cho ra badge "đã xong toàn bộ" cạnh con số 59,6%.
    if (remaining === 0 && openRemaining === 0) return 'finished';
    if (today > examDay) return 'overdue';
    // Đúng hôm thi thì không phải "đã qua ngày thi" — hôm nay mới là ngày thi.
    if (today === examDay) return 'examToday';
    if (perDayRaw > N3_PACE_CEILING) return 'unreachable';
    if (drift > 0) return 'ahead';
    if (drift === 0) return 'onTrack';
    return 'behind';
  })();

  /**
   * Ngày học xong nếu giữ đúng nhịp ĐANG BẮT BUỘC.
   *
   * Tính bằng số nguyên, không quay vòng qua `perDayRaw`: `remaining / paceDays`
   * rồi `ceil(remaining / thương)` không phải phép nghịch đảo của nhau trong số
   * thực dấu phẩy động, và trên 8 trong 74 ngày đúng hẹn nó cho ra một ngày thò
   * qua mốc cuối — đúng cái mà phép trừ 1 được viết ra để tránh. Giữ đúng nhịp
   * bắt buộc thì theo định nghĩa ngày cuối chính là ngày cuối của khoảng đang
   * chia, nên trả thẳng ngày đó.
   */
  const finishIso =
    remaining === 0
      ? dayToIso(today)
      : paceDays > 0
        ? dayToIso(today + paceDays - 1)
        : '';

  return {
    daysLeft,
    studyDaysLeft,
    remaining,
    openRemaining,
    perDay,
    plannedPerDay: plannedToday,
    dueToday,
    doneScheduled,
    drift,
    state,
    finishIso,
  };
}
