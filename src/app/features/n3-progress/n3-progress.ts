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
} from '../../core/n3/n3-syllabus';
import {
  N3_FOUNDATION_GATE,
  N3_PACE_CEILING,
  N3_SECTION_POINTS,
  N3Pace,
  N3Pillar,
  canTick,
  computePace,
  computeProgress,
  isoToDay,
  todayDay,
} from '../../core/n3/n3.model';
import {
  N3_LIST_FILTERS,
  N3_SCHEDULE,
  N3_TICKABLE_OF,
  N3BlockRow,
  N3ListFilter,
  foundationGateStat,
  phaseCards as buildPhaseCards,
  pillarCards as buildPillarCards,
  scoreBlockCards,
  unitSections,
} from '../../core/n3/n3-view';
import { N3ProgressStore } from '../../core/services/n3-progress-store';
import { checkedOf } from '../../core/utils/dom-events';

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
  protected readonly filters = N3_LIST_FILTERS;
  protected readonly examIso = N3_EXAM_DATE;
  protected readonly lastNewIso = N3_LAST_NEW_MATERIAL_DATE;
  protected readonly paceCeiling = N3_PACE_CEILING;
  protected readonly foundationGate = Math.round(N3_FOUNDATION_GATE * 100);
  protected readonly sectionPoints = N3_SECTION_POINTS;

  protected readonly filter = signal<N3ListFilter>('all');
  /** Trụ đang mở trong bảng kiểm soát. Rỗng nghĩa là mở tất cả. */
  protected readonly openPillar = signal<N3Pillar | ''>('');

  protected readonly includeChoukai = this.store.includeChoukai;

  /**
   * Hôm nay, giữ trong một signal chứ không phải một hằng số.
   *
   * Không đọc `new Date()` thẳng trong computed: computed phải là hàm thuần theo
   * các signal nó đọc, mà đồng hồ thì không phải signal — Angular sẽ không vẽ lại
   * khi ngày đổi, và giá trị bị nhớ đệm có thể lệch với lần tính trước.
   *
   * Nhưng cũng không được chốt cứng một lần lúc mở trang: đây là một trang người
   * học mở rồi để đó cả ngày. Qua nửa đêm mà con số không đổi thì mọi mốc "đến
   * hạn / trễ hẹn" lệch một ngày, và một mục vừa tích xong sẽ rơi ra ngoài cửa
   * sổ "7 ngày qua" vì nó được ghi ngày hôm nay thật còn trang thì vẫn tính theo
   * ngày hôm qua. Làm mới lúc người học quay lại tab là đủ: không có nửa đêm nào
   * đổi ngày mà người dùng lại đang nhìn màn hình liên tục.
   */
  private readonly todayRef = signal(todayDay());
  protected readonly today = this.todayRef.asReadonly();

  private readonly inScope = computed(() => {
    const include = this.includeChoukai();
    return (pillar: N3Pillar) =>
      include || !N3_DEFAULT_OUT_OF_SCOPE.includes(pillar);
  });

  /**
   * Hàm tra "đã tích chưa".
   *
   * Đọc `doneCount()` để computed này phụ thuộc vào signal của store: bản thân
   * hàm trả về là một closure, mà closure thì không có gì cho Angular theo dõi.
   * Không có dòng đó thì `isDone` chỉ tính một lần và mọi computed dùng nó sẽ
   * đứng im sau lần tích đầu tiên.
   */
  private readonly isDone = computed(() => {
    void this.store.doneCount();
    return (unitId: string) => this.store.isDone(unitId);
  });

  protected readonly progress = computed(() =>
    computeProgress(N3_SECTIONS, this.isDone(), this.inScope()),
  );

  protected readonly pace = computed<N3Pace>(() =>
    computePace(
      N3_SCHEDULE,
      N3_SECTIONS,
      this.isDone(),
      this.inScope(),
      N3_EXAM_DATE,
      N3_LAST_NEW_MATERIAL_DATE,
      this.today(),
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
      examToday: 'n3.pace.state.examToday',
      overdue: 'n3.pace.state.overdue',
    };
    return map[this.pace().state];
  });

  /** Số buổi đã tích trong bảy ngày gần nhất — thước đo nhịp thật, không phải kế hoạch. */
  protected readonly recentCount = computed(() => {
    const from = this.today() - 6;
    return this.store
      .doneDates()
      .filter((iso) => iso !== '' && isoToDay(iso) >= from && isoToDay(iso) <= this.today()).length;
  });

  // ── Ba khối điểm của đề ─────────────────────────────────────────────────

  protected readonly scoreBlocks = computed(() =>
    scoreBlockCards(this.progress(), this.inScope()),
  );

  // ── Trụ nội dung ────────────────────────────────────────────────────────

  protected readonly pillarCards = computed(() =>
    buildPillarCards(this.progress(), this.inScope()),
  );

  /** Ôn nền đã đủ để mở sách N3 chưa — xem `foundationGateStat`. */
  protected readonly foundationGateStat = computed(() => foundationGateStat(this.isDone()));

  // ── Bốn giai đoạn ───────────────────────────────────────────────────────

  protected readonly phaseCards = computed(() =>
    buildPhaseCards(this.isDone(), this.today()),
  );

  // ── Bảng kiểm soát ──────────────────────────────────────────────────────

  protected readonly listRows = computed(() =>
    unitSections({
      filter: this.filter(),
      openPillar: this.openPillar(),
      today: this.today(),
      isDone: this.isDone(),
      dateOf: (unitId) => this.store.dateOf(unitId),
    }),
  );

  /**
   * Bộ lọc rỗng vì đã học hết, hay vì bộ lọc không khớp gì.
   *
   * Hai chuyện khác nhau và cần hai câu khác nhau: một dấu ✓ kèm câu "không khớp
   * bộ lọc" là lời chúc mừng cho việc không xảy ra.
   */
  protected readonly nothingLeftToStudy = computed(() => {
    const filter = this.filter();
    if (filter !== 'todo' && filter !== 'due') return false;
    return this.progress().doneUnits > 0;
  });

  /** Store không ghi được vào trình duyệt — dấu tích chỉ sống trong phiên này. */
  protected readonly persistFailed = this.store.persistFailed;

  /** Tổng số dòng còn lại sau khi lọc — quyết định có hiện khối "không khớp" không. */
  protected readonly visibleCount = computed(() =>
    this.listRows().reduce((sum, row) => sum + row.visible, 0),
  );

  // ── Sự kiện ─────────────────────────────────────────────────────────────

  constructor() {
    if (typeof document === 'undefined') return;
    // Không cần gỡ bỏ: trang này sống hết vòng đời tab, và một hàm ba dòng đọc
    // đồng hồ thì rẻ hơn cả việc dựng bộ máy để hủy đăng ký nó.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.todayRef.set(todayDay());
    });
  }

  protected setFilter(value: N3ListFilter): void {
    this.filter.set(value);
  }

  /** Về trạng thái xem tất cả, dùng cho nút ở khối "không khớp bộ lọc". */
  protected resetFilters(): void {
    this.filter.set('all');
    this.openPillar.set('');
  }

  protected togglePillar(pillar: N3Pillar): void {
    this.openPillar.set(this.openPillar() === pillar ? '' : pillar);
  }

  protected toggleUnit(unitId: string): void {
    this.store.toggle(unitId);
  }

  protected toggleBlock(row: N3BlockRow): void {
    const ids = row.block.units.filter(canTick).map((unit) => unit.id);
    row.allDone ? this.store.unset(ids) : this.store.set(ids);
  }

  protected toggleChoukaiScope(event: Event): void {
    this.store.setIncludeChoukai(checkedOf(event));
  }

  protected resetAll(): void {
    const count = this.store.doneCount();
    if (count === 0) return;
    if (confirm(this.lang.t('n3.list.resetConfirm', { count }))) this.store.clearAll();
  }

  /** Tổng số mục tích được của một trụ, dùng cho nhãn nút chọn trụ. */
  protected readonly tickableOf = N3_TICKABLE_OF;
}
