import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  todayDay,
} from '../../core/n3/n3.model';
import { N3_SCHEDULE } from '../../core/n3/n3-view';
import { ReviewStore } from '../../core/review/review-store';
import { RecentStore } from '../../core/services/recent-store';
import { Icon } from '../../shared/icon';

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

  protected readonly t = this.lang.t.bind(this.lang);

  protected readonly dueTotal = this.review.dueTotal;
  protected readonly mistakeTotal = computed(() =>
    Object.values(this.review.summary()).reduce((sum, area) => sum + area.mistakes, 0),
  );

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

  constructor() {
    this.review.refreshDay();
  }
}
