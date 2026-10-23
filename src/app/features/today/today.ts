import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ActivityStore } from '../../core/activity/activity-store';
import { GOAL_CHOICES } from '../../core/activity/activity.model';
import { LanguageStore } from '../../core/i18n/language-store';
import { MESSAGES, type MessageKey } from '../../core/i18n/messages';
import { NAV_GROUPS, NavGroupId } from '../../core/navigation';
import { N3ProgressStore } from '../../core/n3/n3-progress-store';
import {
  N3_DEFAULT_OUT_OF_SCOPE,
  N3_EXAM_DATE,
  N3_LAST_NEW_MATERIAL_DATE,
  N3_SECTIONS,
} from '../../core/n3/n3-syllabus';
import {
  N3_PACE_CEILING,
  N3Pillar,
  computePace,
  computeProgress,
  dayToIso,
  todayDay,
} from '../../core/n3/n3.model';
import { N3_SCHEDULE } from '../../core/n3/n3-view';
import { ReviewStore } from '../../core/review/review-store';
import { RecentStore } from '../../core/services/recent-store';
import { Icon, type IconName } from '../../shared/icon';

/** Một việc trong "Kế hoạch hôm nay". */
interface PlanItem {
  id: string;
  icon: IconName;
  titleKey: MessageKey;
  titleParams: Record<string, number>;
  detail: string;
  percent: number;
  done: boolean;
  path: string;
  actionKey: MessageKey;
}

/** Bốn kỹ năng ở cuối trang — mọi nhóm của menu trừ chính trang Hôm nay. */
const SKILL_DESC: Record<Exclude<NavGroupId, 'today'>, MessageKey> = {
  vocab: 'today.skill.vocab.desc',
  grammar: 'today.skill.grammar.desc',
  kanji: 'today.skill.kanji.desc',
  practice: 'today.skill.practice.desc',
};

/**
 * Trang Hôm nay — trang mở đầu của ứng dụng.
 *
 * Trên cùng là CHUỖI NGÀY HỌC và KẾ HOẠCH HÔM NAY: ba việc (đủ số câu mục tiêu, ôn hết
 * mục đến hạn, tích đủ buổi lộ trình N3), mỗi việc một thanh tiến độ và một nút đi
 * làm ngay. Chuỗi là động lực quay lại mỗi ngày; kế hoạch trả lời "hôm nay làm gì".
 *
 * Trước đây mở app là thấy ngay danh sách 59 bài từ vựng, còn việc nên làm mỗi ngày
 * (ôn các mục đến hạn, học tiếp bài đang dở, giữ nhịp lộ trình N3) nằm rải ở ba
 * tab. Trang này gom đúng ba câu trả lời đó lên một màn hình, mỗi khối một nút hành
 * động; danh sách bài vẫn nguyên ở tab Từ vựng.
 *
 * Chỉ ĐỌC dữ liệu của các kho sẵn có (lịch ôn, tiến độ N3, bài mở gần đây) — không
 * tính lại gì theo cách riêng, nên con số ở đây luôn khớp với trang chi tiết.
 */
@Component({
  selector: 'app-today',
  imports: [RouterLink, Icon],
  templateUrl: './today.html',
  styleUrl: './today.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Today {
  private readonly lang = inject(LanguageStore);
  private readonly review = inject(ReviewStore);
  private readonly n3 = inject(N3ProgressStore);
  private readonly recentStore = inject(RecentStore);
  protected readonly activity = inject(ActivityStore);
  protected readonly goalChoices = GOAL_CHOICES;

  protected readonly t = this.lang.t.bind(this.lang);

  protected readonly dueTotal = this.review.dueTotal;

  /** Tên hiện của một bài gần đây: theo ngôn ngữ đang chọn nếu là bài có khoá tên. */
  protected readonly recent = computed(() =>
    this.recentStore.entries().map((entry) => ({
      ...entry,
      label: entry.titleKey && entry.titleKey in MESSAGES ? this.t(entry.titleKey) : entry.title,
    })),
  );

  protected readonly skills = NAV_GROUPS.filter((group) => group.id !== 'today').map((group) => ({
    ...group,
    descKey: SKILL_DESC[group.id as Exclude<NavGroupId, 'today'>],
  }));

  // ── Lộ trình N3: cùng công thức với trang /n3 ───────────────────────────

  /** Làm mới lúc trang mở; trang này không để mở qua đêm như trang /n3. */
  private readonly today = signal(todayDay());

  private readonly n3Pace = computed(() => {
    void this.n3.doneCount();
    const include = this.n3.includeChoukai();
    const inScope = (pillar: N3Pillar) => include || !N3_DEFAULT_OUT_OF_SCOPE.includes(pillar);
    const isDone = (unitId: string) => this.n3.isDone(unitId);
    const progress = computeProgress(N3_SECTIONS, isDone, inScope);
    const pace = computePace(
      N3_SCHEDULE,
      N3_SECTIONS,
      isDone,
      inScope,
      N3_EXAM_DATE,
      N3_LAST_NEW_MATERIAL_DATE,
      this.today(),
    );
    return { percent: Math.round(progress.ratio * 100), pace };
  });

  protected readonly n3Percent = computed(() => this.n3Pace().percent);
  protected readonly n3DaysLeft = computed(() => this.n3Pace().pace.daysLeft);
  protected readonly n3PerDay = computed(() => this.n3Pace().pace.perDay);
  /** Còn phải học tiếp mới hiện nhịp mỗi ngày; xong hết hoặc đã qua ngày thi thì thôi. */
  protected readonly n3Active = computed(() =>
    ['ahead', 'onTrack', 'behind', 'unreachable'].includes(this.n3Pace().pace.state),
  );
  protected readonly n3StateKey = computed<MessageKey>(() => {
    const map: Record<string, MessageKey> = {
      ahead: 'n3.pace.state.ahead',
      onTrack: 'n3.pace.state.onTrack',
      behind: 'n3.pace.state.behind',
      unreachable: 'n3.pace.state.unreachable',
      finished: 'n3.pace.state.finished',
      examToday: 'n3.pace.state.examToday',
      overdue: 'n3.pace.state.overdue',
    };
    return map[this.n3Pace().pace.state];
  });
  protected readonly n3StateParams = computed(() => ({
    count: Math.abs(this.n3Pace().pace.drift),
    ceiling: N3_PACE_CEILING,
  }));
  protected readonly n3Behind = computed(() =>
    ['behind', 'unreachable', 'overdue'].includes(this.n3Pace().pace.state),
  );

  // ── Chuỗi ngày & kế hoạch ───────────────────────────────────────────────

  protected readonly streak = this.activity.streak;
  protected readonly goal = this.activity.goal;
  protected readonly answered = computed(() => this.activity.today().answered);
  protected readonly goalPercent = computed(() =>
    Math.min(100, Math.round((this.answered() / this.goal()) * 100)),
  );

  /** Bảy ngày gần nhất kèm tên thứ — vẽ thành dải chấm tròn. */
  protected readonly week = computed(() =>
    this.activity.week().map((day) => ({
      ...day,
      // DayNumber là số ngày từ 1970-01-01 (thứ Năm): +4 ra thứ trong tuần, 0 = Chủ nhật.
      label: `streak.dow.${(day.day + 4) % 7}` as MessageKey,
    })),
  );

  /** Số buổi lộ trình N3 đã tích HÔM NAY. */
  protected readonly n3DoneToday = computed(() => {
    const iso = dayToIso(this.today());
    return this.n3.doneDates().filter((date) => date === iso).length;
  });
  /** Số buổi cần tích hôm nay để giữ nhịp — làm tròn lên, nhịp 1.4 thì là 2 buổi. */
  protected readonly n3Target = computed(() => Math.max(1, Math.ceil(this.n3PerDay())));

  /** Ba việc của hôm nay. Việc N3 chỉ có khi lộ trình còn đang chạy. */
  protected readonly plan = computed(() => {
    const due = this.dueTotal();
    const items: PlanItem[] = [
      {
        id: 'goal',
        icon: 'target',
        titleKey: 'plan.goal' as MessageKey,
        titleParams: { goal: this.goal() },
        detail: this.t('plan.goal.detail', { answered: this.answered() }),
        percent: this.goalPercent(),
        done: this.activity.today().met,
        path: this.recentStore.entries()[0]?.path ?? '/vocab',
        actionKey: 'plan.go.learn' as MessageKey,
      },
      {
        id: 'review',
        icon: 'repeat',
        titleKey: (due > 0 ? 'plan.review' : 'plan.review.done') as MessageKey,
        titleParams: { count: due },
        detail: '',
        percent: due > 0 ? 0 : 100,
        done: due === 0,
        path: '/review',
        actionKey: 'plan.go.review' as MessageKey,
      },
    ];
    if (this.n3Active()) {
      items.push({
        id: 'n3',
        icon: 'calendar',
        titleKey: 'plan.n3' as MessageKey,
        titleParams: { count: this.n3Target() },
        detail: this.t('plan.n3.detail', { done: this.n3DoneToday() }),
        percent: Math.min(100, Math.round((this.n3DoneToday() / this.n3Target()) * 100)),
        done: this.n3DoneToday() >= this.n3Target(),
        path: '/n3',
        actionKey: 'plan.go.n3' as MessageKey,
      });
    }
    return items;
  });

  protected readonly planDone = computed(() => this.plan().every((item) => item.done));

  /** Dòng nhắc dưới con số chuỗi, theo trạng thái hôm nay. */
  protected readonly streakHint = computed(() => {
    const remaining = this.activity.remaining();
    switch (this.streak().state) {
      case 'done':
        return this.t('streak.state.done');
      case 'at-risk':
        return this.t('streak.state.atRisk', { count: remaining });
      default:
        return this.t('streak.state.none', { count: remaining });
    }
  });

  setGoal(goal: number): void {
    this.activity.setGoal(goal);
  }

  constructor() {
    this.review.refreshDay();
    this.activity.refreshDay();
  }
}
