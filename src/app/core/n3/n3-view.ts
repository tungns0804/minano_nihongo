import type { MessageKey } from '../i18n/messages';
import {
  N3_FOUNDATION_GATE,
  N3_PILLAR_BLOCK,
  N3_SCORE_BLOCK_POINTS,
  N3_SECTION_POINTS,
  N3Block,
  N3Phase,
  N3Pillar,
  N3Progress,
  N3ScoreBlock,
  N3Section,
  N3Unit,
  buildSchedule,
  canTick,
  dayToIso,
  isoToDay,
  phaseDays,
} from './n3.model';
import { N3_PHASES, N3_SECTIONS, N3_SOURCE_LABEL_KEY } from './n3-syllabus';

/**
 * Dựng các khối mà trang "Tiến độ N3" vẽ ra: ba khối điểm, sáu thẻ trụ, bốn thẻ
 * giai đoạn và bảng kiểm soát.
 *
 * Tách khỏi component vì tất cả đều là phép TÍNH thuần trên dữ liệu lộ trình,
 * cộng với hai câu hỏi "mục này tích chưa" và "hôm nay là ngày mấy". Chúng không
 * đụng gì tới trạng thái màn hình, mà để trong component thì phần số học của lộ
 * trình nằm rải ở hai file — `n3.model.ts` một nửa, component một nửa.
 */

/**
 * Lịch dựng MỘT LẦN lúc nạp module, không phải trong computed.
 *
 * Nó chỉ phụ thuộc vào hai hằng số dữ liệu nên không bao giờ đổi giữa các lần vẽ.
 * Đặt trong computed thì mỗi lần tích một ô là dựng lại toàn bộ lịch 230 mục.
 */
export const N3_SCHEDULE = buildSchedule(N3_SECTIONS, N3_PHASES);

/**
 * Số mục tích được của từng trụ — bảng tra dựng sẵn, không phải hàm.
 *
 * Nhãn nút chọn trụ cần con số này. Gọi một phương thức trong `@for` thì Angular
 * chạy lại nó ở MỌI lượt phát hiện thay đổi, sáu lần một lượt, để tính lại một
 * con số không bao giờ đổi.
 */
export const N3_TICKABLE_OF: Partial<Record<N3Pillar, number>> = Object.fromEntries(
  N3_SECTIONS.map((section) => [
    section.pillar,
    section.blocks.flatMap((block) => block.units).filter(canTick).length,
  ]),
);

/** Bộ lọc của bảng kiểm soát. */
export type N3ListFilter = 'all' | 'todo' | 'done' | 'due';

export const N3_LIST_FILTERS: readonly { value: N3ListFilter; labelKey: MessageKey }[] = [
  { value: 'all', labelKey: 'n3.list.filter.all' },
  { value: 'todo', labelKey: 'n3.list.filter.todo' },
  { value: 'due', labelKey: 'n3.list.filter.due' },
  { value: 'done', labelKey: 'n3.list.filter.done' },
];

// ── Ba khối điểm của đề ───────────────────────────────────────────────────

export interface N3ScoreBlockCard {
  block: N3ScoreBlock;
  labelKey: MessageKey;
  points: number;
  earned: number;
  percent: number;
  ceilingPercent: number;
  /** Khối đang nằm ngoài phạm vi tính phần trăm. */
  muted: boolean;
}

export function scoreBlockCards(
  progress: N3Progress,
  inScope: (pillar: N3Pillar) => boolean,
): N3ScoreBlockCard[] {
  const byPillar = new Map(progress.pillars.map((item) => [item.pillar, item]));

  return (['chishiki', 'dokkai', 'choukai'] as const).map((block) => {
    const pillars = (Object.keys(N3_PILLAR_BLOCK) as N3Pillar[]).filter(
      (pillar) => N3_PILLAR_BLOCK[pillar] === block,
    );
    const points = N3_SCORE_BLOCK_POINTS[block];
    // Cộng giá trị ĐÃ LÀM TRÒN của từng trụ, giống cách `computeProgress` dựng
    // con số tổng. Cộng giá trị thô rồi mới làm tròn thì ba khối cộng lại lệch
    // 0,1 điểm so với dòng "điểm quy đổi" ở đầu trang — hai con số nằm cách
    // nhau một khối trên cùng màn hình, và độ lệch đó đọc thành lỗi tính toán.
    const earned = pillars.reduce((sum, pillar) => sum + (byPillar.get(pillar)?.earned ?? 0), 0);
    const ceiling = pillars.reduce(
      (sum, pillar) => sum + (byPillar.get(pillar)?.ceiling ?? 1) * N3_SECTION_POINTS[pillar],
      0,
    );

    return {
      block: block as N3ScoreBlock,
      labelKey: `n3.block.${block}` as MessageKey,
      points,
      earned: Math.round(earned * 10) / 10,
      percent: Math.round((earned / points) * 100),
      ceilingPercent: Math.round((ceiling / points) * 100),
      muted: !inScope(pillars[0]),
    };
  });
}

// ── Trụ nội dung ──────────────────────────────────────────────────────────

export interface N3PillarCard {
  section: N3Section;
  percent: number;
  ceilingPercent: number;
  capped: boolean;
  doneUnits: number;
  tickableUnits: number;
  points: number;
  earned: number;
  inScope: boolean;
}

export function pillarCards(
  progress: N3Progress,
  inScope: (pillar: N3Pillar) => boolean,
): N3PillarCard[] {
  const byPillar = new Map(progress.pillars.map((item) => [item.pillar, item]));

  return N3_SECTIONS.map((section) => {
    const stat = byPillar.get(section.pillar);
    return {
      section,
      percent: Math.round((stat?.ratio ?? 0) * 100),
      ceilingPercent: Math.round((stat?.ceiling ?? 1) * 100),
      capped: (stat?.ceiling ?? 1) < 0.999,
      doneUnits: stat?.doneUnits ?? 0,
      tickableUnits: stat?.tickableUnits ?? 0,
      points: N3_SECTION_POINTS[section.pillar],
      earned: stat?.earned ?? 0,
      inScope: inScope(section.pillar),
    };
  });
}

/**
 * Ôn nền đã đủ để mở sách N3 chưa.
 *
 * Tính trên phần nền CÓ HẸN NGÀY, không trên cả trụ: 25 bài từ vựng N5 là phần
 * ôn tuỳ sức, không có ngày hẹn (xem `N3_UNSCHEDULED_BLOCKS`). Gộp chúng vào
 * mẫu số thì cửa vào không bao giờ mở được — làm xong đúng những gì kế hoạch
 * yêu cầu vẫn chỉ ra 60%.
 */
export function foundationGateStat(isDone: (unitId: string) => boolean): {
  ready: boolean;
  remaining: number;
} {
  const scheduled = N3_SCHEDULE.units.filter((item) => item.pillar === 'foundation');
  const done = scheduled.filter((item) => isDone(item.unit.id)).length;
  const need = Math.ceil(scheduled.length * N3_FOUNDATION_GATE);
  return { ready: done >= need, remaining: Math.max(0, need - done) };
}

// ── Bốn giai đoạn ─────────────────────────────────────────────────────────

export interface N3PhaseCard {
  phase: N3Phase;
  days: number;
  units: number;
  done: number;
  percent: number;
  /** Số buổi mỗi ngày mà giai đoạn này đòi hỏi, làm tròn tới 0.1. */
  perDay: number;
  current: boolean;
  past: boolean;
}

export function phaseCards(isDone: (unitId: string) => boolean, today: number): N3PhaseCard[] {
  return N3_PHASES.map((phase) => {
    const from = isoToDay(phase.from);
    const to = isoToDay(phase.to);
    const units = N3_SCHEDULE.units.filter((item) => item.phaseId === phase.id);
    const done = units.filter((item) => isDone(item.unit.id)).length;
    const days = phaseDays(phase);

    return {
      phase,
      days,
      units: units.length,
      done,
      percent: units.length === 0 ? 0 : Math.round((done / units.length) * 100),
      perDay: Math.round((units.length / days) * 10) / 10,
      current: today >= from && today <= to,
      past: today > to,
    };
  });
}

// ── Bảng kiểm soát ────────────────────────────────────────────────────────

/** Một dòng trong bảng kiểm soát, đã gộp sẵn mọi thứ template cần. */
export interface N3UnitRow {
  unit: N3Unit;
  done: boolean;
  doneOn: string;
  /** Ngày hẹn học xong, dạng ISO. Rỗng với mục không xếp lịch được. */
  dueIso: string;
  /** Đã qua hẹn mà chưa tích. */
  overdue: boolean;
  sourceKey: MessageKey;
}

export interface N3BlockRow {
  block: N3Block;
  rows: N3UnitRow[];
  done: number;
  tickable: number;
  /** Cả nhóm đã tích hết chưa — quyết định nút "tích cả nhóm" đổi thành "bỏ tích". */
  allDone: boolean;
}

export interface N3SectionRow {
  section: N3Section;
  blocks: N3BlockRow[];
  /** Số dòng còn lại sau khi lọc, để ẩn cả trụ khi lọc không ra gì. */
  visible: number;
}

export interface N3ListQuery {
  filter: N3ListFilter;
  /** Trụ đang mở; rỗng nghĩa là xem tất cả sáu trụ. */
  openPillar: N3Pillar | '';
  today: number;
  isDone: (unitId: string) => boolean;
  /** Ngày đã tích, dạng ISO — rỗng nếu chưa tích. */
  dateOf: (unitId: string) => string;
}

export function unitSections(query: N3ListQuery): N3SectionRow[] {
  const { filter, openPillar, today, isDone, dateOf } = query;

  return N3_SECTIONS.filter((section) => openPillar === '' || section.pillar === openPillar).map(
    (section) => {
      const blocks = section.blocks.map((block): N3BlockRow => {
        const rows = block.units.map((unit): N3UnitRow => {
          const done = isDone(unit.id);
          const scheduled = N3_SCHEDULE.byUnitId.get(unit.id);
          return {
            unit,
            done,
            doneOn: dateOf(unit.id),
            dueIso: scheduled ? dayToIso(scheduled.targetDay) : '',
            overdue: !done && scheduled !== undefined && scheduled.targetDay < today,
            sourceKey: N3_SOURCE_LABEL_KEY[unit.source],
          };
        });

        const tickable = block.units.filter(canTick);
        const done = rows.filter((row) => row.done).length;

        return {
          block,
          rows: rows.filter((row) => keep(row, filter, today)),
          done,
          tickable: tickable.length,
          allDone: tickable.length > 0 && done === tickable.length,
        };
      });

      return {
        section,
        blocks: blocks.filter((item) => item.rows.length > 0),
        visible: blocks.reduce((sum, item) => sum + item.rows.length, 0),
      };
    },
  );
}

function keep(row: N3UnitRow, filter: N3ListFilter, today: number): boolean {
  if (filter === 'all') return true;
  if (filter === 'done') return row.done;
  if (filter === 'todo') return !row.done;
  // 'due': chưa học và đã tới hẹn (hoặc quá hẹn). Đây là bộ lọc trả lời đúng câu
  // "hôm nay phải học gì", nên nó gộp cả phần trễ vào chứ không chỉ đúng hôm nay.
  const scheduled = N3_SCHEDULE.byUnitId.get(row.unit.id);
  return !row.done && scheduled !== undefined && scheduled.targetDay <= today;
}
