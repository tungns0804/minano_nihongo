import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  COUNTER_EXERCISE_ID,
  COUNTER_GROUPS,
  COUNTER_ITEMS,
  COUNTER_RULES,
  CounterGroup,
  CounterItem,
} from '../../core/exercises/counters';
import { COUNTER_MODES, DEFAULT_MODE, ExerciseMode, exerciseModeInfo } from '../../core/exercises/exercise.model';
import { T } from '../../core/i18n/t';
import { normalizeSearch } from '../../core/lessons/lesson-search';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildCounterQuestions } from '../../core/practice/counter-questions';
import { LIMIT_CHOICES, practiceConfig } from '../../core/practice/practice.model';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { checkedOf } from '../../core/utils/dom-events';
import { PracticeSetup } from '../../shared/practice-setup';
import { SearchBox } from '../../shared/search-box';
import { StarButton } from '../../shared/star-button';

/** Các cột của bảng biến âm: đúng những số có thể biến âm. */
const MATRIX_KEYS = ['1', '3', '4', '6', '8', '10', '何'] as const;

interface MatrixCell {
  key: string;
  reading: string;
  special: boolean;
}

interface MatrixRow {
  group: CounterGroup;
  cells: MatrixCell[];
}

interface GroupSection {
  group: CounterGroup;
  items: CounterItem[];
}

/**
 * Màn hình bài "Số đếm & trợ số từ": quy tắc ghi nhớ + bảng biến âm, thiết lập luyện,
 * rồi bảng tra chia theo từng trợ số từ.
 *
 * Màn hình riêng chứ không thêm nhánh vào `ExerciseDetail`: bài này chọn NHÓM trợ số từ
 * thay vì cấp độ, có phần lý thuyết ở đầu trang, và bảng tra là nhiều bảng nhỏ — rẽ
 * nhánh ở cả ba chỗ thì `ExerciseDetail` thành ba màn hình nhét chung một file.
 */
@Component({
  selector: 'app-counter-exercise',
  imports: [PracticeSetup, RouterLink, SearchBox, StarButton, T],
  templateUrl: './counter-exercise.html',
  styleUrl: './counter-exercise.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterExercise extends PracticeScreen {
  readonly groups = COUNTER_GROUPS;
  readonly rules = COUNTER_RULES;
  readonly modes = COUNTER_MODES;
  readonly matrixKeys = MATRIX_KEYS;
  readonly totalCount = COUNTER_ITEMS.length;

  protected favoriteSessionId(): string {
    return COUNTER_EXERCISE_ID;
  }

  readonly selectedGroups = signal<readonly string[]>(COUNTER_GROUPS.map((group) => group.id));
  readonly mode = signal<ExerciseMode>(DEFAULT_MODE['so-dem']);
  readonly onlySpecial = signal(false);

  readonly currentMode = computed(() => exerciseModeInfo(this.mode()));
  readonly isChoice = computed(() => this.mode() === 'counter-choice');
  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));

  /** Số mục của từng nhóm — trên nút chọn nhóm, không đổi khi bật tắt nhóm khác. */
  readonly groupCounts: Readonly<Record<string, number>> = Object.fromEntries(
    COUNTER_GROUPS.map((group) => [
      group.id,
      COUNTER_ITEMS.filter((item) => item.group === group.id).length,
    ]),
  );

  readonly allSelected = computed(() => this.selectedGroups().length === COUNTER_GROUPS.length);

  /** Các mục trong những nhóm đang chọn. */
  readonly groupItems = computed<CounterItem[]>(() => {
    const selected = new Set(this.selectedGroups());
    return COUNTER_ITEMS.filter((item) => selected.has(item.group));
  });

  readonly specialItems = computed(() => this.groupItems().filter((item) => item.special));
  readonly specialCount = computed(() => this.specialItems().length);
  readonly favoriteCount = computed(() => this.favoritesOf(this.groupItems()).length);

  readonly pool = computed<CounterItem[]>(() => {
    switch (this.scope()) {
      case 'favorite':
        return this.favoritesOf(this.groupItems());
      case 'special':
        return this.specialItems();
      default:
        return this.groupItems();
    }
  });

  readonly plannedQuestionCount = computed(() => {
    const total = this.pool().length;
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);
  readonly limitChoices = computed(() => LIMIT_CHOICES.filter((limit) => limit < this.pool().length));

  // ── Bảng biến âm ────────────────────────────────────────────────────────

  readonly matrix: readonly MatrixRow[] = COUNTER_GROUPS.filter((group) => group.inMatrix).map(
    (group) => ({
      group,
      cells: MATRIX_KEYS.map((key) => {
        const item = COUNTER_ITEMS.find((entry) => entry.id === `${group.id}:${key}`);
        return { key, reading: item?.readings[0] ?? '', special: item?.special ?? false };
      }),
    }),
  );

  // ── Bảng tra ────────────────────────────────────────────────────────────

  readonly sections = computed<GroupSection[]>(() => {
    const keyword = normalizeSearch(this.search());
    const favorites = this.onlyFavorites();
    const special = this.onlySpecial();
    return COUNTER_GROUPS.flatMap((group) => {
      const groupHay = `${group.counter} ${group.reading} ${group.title} ${group.usage}`;
      const items = COUNTER_ITEMS.filter(
        (item) =>
          item.group === group.id &&
          (!favorites || this.isFavorite(item.id)) &&
          (!special || item.special) &&
          (!keyword ||
            normalizeSearch(
              `${groupHay} ${item.written} ${item.readings.join(' ')} ${item.meaning}`,
            ).includes(keyword)),
      );
      return items.length > 0 ? [{ group, items }] : [];
    });
  });

  readonly shownCount = computed(() =>
    this.sections().reduce((sum, section) => sum + section.items.length, 0),
  );

  /** Đang lọc thì mở sẵn mọi nhóm còn lại; không lọc thì gập để trang khỏi dài. */
  readonly filtering = computed(
    () => this.search().trim().length > 0 || this.onlyFavorites() || this.onlySpecial(),
  );

  constructor() {
    super();
    // Hiện nghĩa mặc định: 1日 là ついたち hay いちにち còn tuỳ đang nói mùng 1 hay một ngày.
    this.showHint.set(true);
    this.rememberRecent({
      title: this.t('exercise.counters.name'),
      titleKey: 'exercise.counters.name',
      kindKey: 'kind.exercise',
    });
  }

  // ── Sự kiện ─────────────────────────────────────────────────────────────

  isGroupSelected(id: string): boolean {
    return this.selectedGroups().includes(id);
  }

  toggleGroup(id: string): void {
    const current = this.selectedGroups();
    if (current.includes(id) && current.length === 1) return;
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    // Giữ thứ tự gốc để nút không nhảy chỗ theo thứ tự bấm.
    this.selectedGroups.set(COUNTER_GROUPS.map((group) => group.id).filter((g) => next.includes(g)));
    this.questionLimit.set(null);
    this.fixScope();
  }

  selectAllGroups(): void {
    this.selectedGroups.set(COUNTER_GROUPS.map((group) => group.id));
    this.questionLimit.set(null);
  }

  setMode(mode: ExerciseMode): void {
    this.mode.set(mode);
  }

  toggleOnlySpecial(event: Event): void {
    this.onlySpecial.set(checkedOf(event));
  }

  protected override fixScope(): void {
    super.fixScope();
    if (this.scope() === 'special' && this.specialCount() === 0) this.scope.set('all');
  }

  start(): void {
    if (!this.canStart()) return;

    const config = practiceConfig({
      lessonId: COUNTER_EXERCISE_ID,
      lessonKind: 'exercise',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      answerMode: this.isChoice() ? 'choice' : 'typing',
      // Ở bài này cờ gợi ý bật câu tiếng Việt (đọc) hoặc trợ số từ (Việt → Nhật).
      showHanViet: this.showHint(),
      exercise: 'so-dem',
      exerciseMode: this.mode(),
    });

    this.launch(
      { id: COUNTER_EXERCISE_ID, name: this.lang.t('exercise.counters.name') },
      config,
      orderQuestions(buildCounterQuestions(this.pool(), config), config),
    );
  }
}
