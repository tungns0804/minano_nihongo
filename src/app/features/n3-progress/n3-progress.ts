import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import type { MessageKey } from '../../core/i18n/messages';
import {
  N3_DEFAULT_OUT_OF_SCOPE,
  N3_EXAM_DATE,
  N3_LAST_NEW_MATERIAL_DATE,
  N3_PHASES,
  N3_SECTIONS,
  N3_SOURCE_LABEL_KEY,
} from '../../core/n3/n3-syllabus';
import {
  N3_FOUNDATION_GATE,
  N3_PACE_CEILING,
  N3_PILLAR_BLOCK,
  N3_SCORE_BLOCK_POINTS,
  N3_SECTION_POINTS,
  N3Block,
  N3Pace,
  N3Pillar,
  N3ScoreBlock,
  N3Section,
  N3Unit,
  buildSchedule,
  canTick,
  computePace,
  computeProgress,
  dayToIso,
  isoToDay,
  phaseDays,
  todayDay,
  unitsOf,
} from '../../core/n3/n3.model';
import { N3ProgressStore } from '../../core/services/n3-progress-store';

/**
 * Lịch dựng MỘT LẦN lúc nạp module, không phải trong computed.
 *
 * Nó chỉ phụ thuộc vào hai hằng số dữ liệu nên không bao giờ đổi giữa các lần vẽ.
 * Đặt trong computed thì mỗi lần tích một ô là dựng lại toàn bộ lịch 230 mục.
 */
const SCHEDULE = buildSchedule(N3_SECTIONS, N3_PHASES);

/** Bộ lọc của bảng kiểm soát. */
type ListFilter = 'all' | 'todo' | 'done' | 'due';

const FILTERS: readonly { value: ListFilter; labelKey: MessageKey }[] = [
  { value: 'all', labelKey: 'n3.list.filter.all' },
  { value: 'todo', labelKey: 'n3.list.filter.todo' },
  { value: 'due', labelKey: 'n3.list.filter.due' },
  { value: 'done', labelKey: 'n3.list.filter.done' },
];

/** Một dòng trong bảng kiểm soát, đã gộp sẵn mọi thứ template cần. */
interface UnitRow {
  unit: N3Unit;
  done: boolean;
  doneOn: string;
  /** Ngày hẹn học xong, dạng ISO. Rỗng với mục không xếp lịch được. */
  dueIso: string;
  /** Đã qua hẹn mà chưa tích. */
  overdue: boolean;
  sourceKey: MessageKey;
}

interface BlockRow {
  block: N3Block;
  rows: UnitRow[];
  done: number;
  tickable: number;
  /** Cả nhóm đã tích hết chưa — quyết định nút "tích cả nhóm" đổi thành "bỏ tích". */
  allDone: boolean;
}

interface SectionRow {
  section: N3Section;
  blocks: BlockRow[];
  /** Số dòng còn lại sau khi lọc, để ẩn cả trụ khi lọc không ra gì. */
  visible: number;
}

/**
 * Tab "Tiến độ N3" — bảng kiểm soát việc học để đỗ N3 vào 10/12.
 *
 * Vì sao là một tab riêng chứ không phải một khối trên trang chủ: trang chủ trả
 * lời câu "hôm nay luyện bài nào", còn trang này trả lời câu "còn cách kỳ thi bao
 * xa và hôm nay phải học mấy buổi". Hai câu hỏi khác nhau, và câu thứ hai cần cả
 * một trang: sáu trụ nội dung, bốn giai đoạn, hơn hai trăm buổi học.
 *
 * Trang này KHÔNG tự suy ra tiến độ từ việc người học đã luyện bài nào trong app.
 * Đó là chủ ý: phần lớn lộ trình N3 học trên SÁCH (ba quyển 総まとめ chưa nạp vào
 * app), nên đo bằng hoạt động trong app sẽ báo 0% cho một người đã học xong nửa
 * quyển sách. Tự tay tích là cách duy nhất trung thực ở đây.
 */
@Component({
  selector: 'app-n3-progress',
  imports: [RouterLink, T],
  templateUrl: './n3-progress.html',
  styleUrl: './n3-progress.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class N3Progress {
  private readonly store = inject(N3ProgressStore);
  private readonly lang = inject(LanguageStore);

  protected readonly t = this.lang.t.bind(this.lang);

  protected readonly sections = N3_SECTIONS;
  protected readonly phases = N3_PHASES;
  protected readonly filters = FILTERS;
  protected readonly examIso = N3_EXAM_DATE;
  protected readonly lastNewIso = N3_LAST_NEW_MATERIAL_DATE;
  protected readonly paceCeiling = N3_PACE_CEILING;
  protected readonly foundationGate = Math.round(N3_FOUNDATION_GATE * 100);
  protected readonly sectionPoints = N3_SECTION_POINTS;

  protected readonly filter = signal<ListFilter>('all');
  /** Trụ đang mở trong bảng kiểm soát. Rỗng nghĩa là mở tất cả. */
  protected readonly openPillar = signal<N3Pillar | ''>('');

  protected readonly includeChoukai = this.store.includeChoukai;

  /**
   * Hôm nay, chốt một lần lúc mở trang.
   *
   * Không đọc `new Date()` trong computed: computed phải là hàm thuần theo các
   * signal nó đọc, mà đồng hồ thì không phải signal — Angular sẽ không vẽ lại khi
   * ngày đổi, và giá trị bị nhớ đệm lại có thể lệch với lần tính trước.
   */
  protected readonly today = todayDay();
  protected readonly todayIso = dayToIso(this.today);

  private readonly inScope = computed(() => {
    const include = this.includeChoukai();
    return (pillar: N3Pillar) =>
      include || !N3_DEFAULT_OUT_OF_SCOPE.includes(pillar);
  });

  /** Hàm tra "đã tích chưa", đọc qua signal nên mọi computed bên dưới tự cập nhật. */
  private readonly isDone = computed(() => {
    void this.store.doneCount();
    return (unitId: string) => this.store.isDone(unitId);
  });

  protected readonly progress = computed(() =>
    computeProgress(N3_SECTIONS, this.isDone(), this.inScope()),
  );

  protected readonly pace = computed<N3Pace>(() =>
    computePace(
      SCHEDULE,
      this.isDone(),
      this.inScope(),
      N3_EXAM_DATE,
      N3_LAST_NEW_MATERIAL_DATE,
      this.today,
    ),
  );

  protected readonly percent = computed(() => Math.round(this.progress().ratio * 100));
  protected readonly ceilingPercent = computed(() => Math.round(this.progress().ceiling * 100));
  /** Trần dưới 100% nghĩa là đang thiếu nguồn học ở đâu đó. */
  protected readonly hasGap = computed(() => this.progress().ceiling < 0.999);

  /** Chu vi vòng tròn tiến độ, dùng cho stroke-dasharray. */
  protected readonly ringLength = 2 * Math.PI * 52;

  protected readonly ringOffset = computed(
    () => this.ringLength * (1 - this.progress().ratio),
  );

  /** Vạch trần trên vòng tròn: phần không thể đạt được vì thiếu nguồn. */
  protected readonly ringCeilingOffset = computed(
    () => this.ringLength * (1 - this.progress().ceiling),
  );

  protected readonly paceStateKey = computed<MessageKey>(() => {
    const map: Record<N3Pace['state'], MessageKey> = {
      ahead: 'n3.pace.state.ahead',
      onTrack: 'n3.pace.state.onTrack',
      behind: 'n3.pace.state.behind',
      unreachable: 'n3.pace.state.unreachable',
      finished: 'n3.pace.state.finished',
      overdue: 'n3.pace.state.overdue',
    };
    return map[this.pace().state];
  });

  /** Số buổi đã tích trong bảy ngày gần nhất — thước đo nhịp thật, không phải kế hoạch. */
  protected readonly recentCount = computed(() => {
    const from = this.today - 6;
    return this.store
      .doneDates()
      .filter((iso) => iso !== '' && isoToDay(iso) >= from && isoToDay(iso) <= this.today).length;
  });

  // ── Ba khối điểm của đề ─────────────────────────────────────────────────

  protected readonly scoreBlocks = computed(() => {
    const byPillar = new Map(this.progress().pillars.map((item) => [item.pillar, item]));

    return (['chishiki', 'dokkai', 'choukai'] as const).map((block) => {
      const pillars = (Object.keys(N3_PILLAR_BLOCK) as N3Pillar[]).filter(
        (pillar) => N3_PILLAR_BLOCK[pillar] === block,
      );
      const points = N3_SCORE_BLOCK_POINTS[block];
      const earned = pillars.reduce(
        (sum, pillar) => sum + (byPillar.get(pillar)?.ratio ?? 0) * N3_SECTION_POINTS[pillar],
        0,
      );
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
        /** Khối đang nằm ngoài phạm vi tính phần trăm. */
        muted: !this.inScope()(pillars[0]),
      };
    });
  });

  // ── Trụ nội dung ────────────────────────────────────────────────────────

  protected readonly pillarCards = computed(() => {
    const byPillar = new Map(this.progress().pillars.map((item) => [item.pillar, item]));

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
        inScope: this.inScope()(section.pillar),
      };
    });
  });

  /**
   * Ôn nền đã đủ để mở sách N3 chưa.
   *
   * Tính trên phần nền CÓ HẸN NGÀY, không trên cả trụ: 25 bài từ vựng N5 là phần
   * ôn tuỳ sức, không có ngày hẹn (xem `N3_UNSCHEDULED_BLOCKS`). Gộp chúng vào
   * mẫu số thì cửa vào không bao giờ mở được — làm xong đúng những gì kế hoạch
   * yêu cầu vẫn chỉ ra 60%.
   */
  protected readonly foundationGateStat = computed(() => {
    const scheduled = SCHEDULE.units.filter((item) => item.pillar === 'foundation');
    const done = scheduled.filter((item) => this.isDone()(item.unit.id)).length;
    const need = Math.ceil(scheduled.length * N3_FOUNDATION_GATE);
    return { ready: done >= need, remaining: Math.max(0, need - done) };
  });

  // ── Bốn giai đoạn ───────────────────────────────────────────────────────

  protected readonly phaseCards = computed(() =>
    this.phases.map((phase) => {
      const from = isoToDay(phase.from);
      const to = isoToDay(phase.to);
      const units = SCHEDULE.units.filter((item) => item.phaseId === phase.id);
      const done = units.filter((item) => this.isDone()(item.unit.id)).length;
      const days = phaseDays(phase);

      return {
        phase,
        days,
        units: units.length,
        done,
        percent: units.length === 0 ? 0 : Math.round((done / units.length) * 100),
        /** Số buổi mỗi ngày mà giai đoạn này đòi hỏi, làm tròn tới 0.1. */
        perDay: Math.round((units.length / days) * 10) / 10,
        current: this.today >= from && this.today <= to,
        past: this.today > to,
      };
    }),
  );

  // ── Bảng kiểm soát ──────────────────────────────────────────────────────

  protected readonly listRows = computed<SectionRow[]>(() => {
    const isDone = this.isDone();
    const filter = this.filter();
    const open = this.openPillar();

    return N3_SECTIONS.filter((section) => open === '' || section.pillar === open).map(
      (section) => {
        const blocks = section.blocks.map((block): BlockRow => {
          const rows = block.units.map((unit): UnitRow => {
            const done = isDone(unit.id);
            const scheduled = SCHEDULE.byUnitId.get(unit.id);
            const dueIso = scheduled ? dayToIso(scheduled.targetDay) : '';
            return {
              unit,
              done,
              doneOn: this.store.dateOf(unit.id),
              dueIso,
              overdue: !done && scheduled !== undefined && scheduled.targetDay < this.today,
              sourceKey: N3_SOURCE_LABEL_KEY[unit.source],
            };
          });

          const tickable = block.units.filter(canTick);
          const done = rows.filter((row) => row.done).length;

          return {
            block,
            rows: rows.filter((row) => this.keep(row, filter)),
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
  });

  /** Tổng số dòng còn lại sau khi lọc — quyết định có hiện khối "không khớp" không. */
  protected readonly visibleCount = computed(() =>
    this.listRows().reduce((sum, row) => sum + row.visible, 0),
  );

  private keep(row: UnitRow, filter: ListFilter): boolean {
    if (filter === 'all') return true;
    if (filter === 'done') return row.done;
    if (filter === 'todo') return !row.done;
    // 'due': chưa học và đã tới hẹn (hoặc quá hẹn). Đây là bộ lọc trả lời đúng câu
    // "hôm nay phải học gì", nên nó gộp cả phần trễ vào chứ không chỉ đúng hôm nay.
    const scheduled = SCHEDULE.byUnitId.get(row.unit.id);
    return !row.done && scheduled !== undefined && scheduled.targetDay <= this.today;
  }

  // ── Sự kiện ─────────────────────────────────────────────────────────────

  protected setFilter(value: ListFilter): void {
    this.filter.set(value);
  }

  protected togglePillar(pillar: N3Pillar): void {
    this.openPillar.set(this.openPillar() === pillar ? '' : pillar);
  }

  protected toggleUnit(unitId: string): void {
    this.store.toggle(unitId);
  }

  protected toggleBlock(row: BlockRow): void {
    const ids = row.block.units.filter(canTick).map((unit) => unit.id);
    row.allDone ? this.store.unset(ids) : this.store.set(ids);
  }

  protected toggleChoukaiScope(event: Event): void {
    this.store.setIncludeChoukai((event.target as HTMLInputElement).checked);
  }

  protected resetAll(): void {
    const count = this.store.doneCount();
    if (count === 0) return;
    if (confirm(this.lang.t('n3.list.resetConfirm', { count }))) this.store.clearAll();
  }

  /** Tổng số mục tích được của một trụ, dùng cho nhãn nút chọn trụ. */
  protected tickableOf(section: N3Section): number {
    return unitsOf(section).filter(canTick).length;
  }
}
