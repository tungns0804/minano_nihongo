import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  EXERCISES,
  EXERCISE_LEVELS,
  ExerciseId,
  ExerciseInfo,
  ExerciseLevel,
  isGrammarBookId,
} from '../../core/exercises/exercise.model';
import { EXERCISE_VERBS } from '../../core/exercises/exercise-verbs';
import { TRANSITIVITY_PAIRS } from '../../core/exercises/transitive-pairs';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import {
  LESSON_KIND_DESC_KEY,
  LESSON_KIND_LABEL_KEY,
  LESSON_KIND_UNIT_KEY,
  LessonKind,
  LessonSummary,
  lessonKindsOfTab,
  levelOf,
} from '../../core/lessons/vocabulary.model';
import { LessonBrowser } from '../../core/screens/lesson-browser';
import { LessonStore } from '../../core/lessons/lesson-store';
import { lessonMatches, normalizeSearch } from '../../core/lessons/lesson-search';
import { LevelPreference } from '../../core/services/level-preference';
import { SearchBox } from '../../shared/search-box';

interface ExerciseCard extends ExerciseInfo {
  itemCount: number;
  /** "N5 → N3", hoặc chỉ "N4" khi bài tập gói trong một cấp — mã JLPT nên không dịch. */
  levelRange: string;
  favoriteCount: number;
}

/** 'all', một cấp, hoặc 'none' — bài không gắn cấp nào (nút "Tùy chọn"). */
type ExerciseFilter = ExerciseLevel | 'all' | 'none';

interface ExerciseFilterOption {
  value: ExerciseFilter;
  count: number;
}

/** Một nhóm bài học của tab này (chia động từ, dịch hội thoại). */
interface LessonGroup {
  kind: LessonKind;
  labelKey: MessageKey;
  descKey: MessageKey;
  unitKey: MessageKey;
  lessons: LessonSummary[];
}

/**
 * Tab "Bài tập bổ trợ" — mọi cách luyện KHÔNG phải là học nghĩa từ vựng.
 *
 * Gồm ba nhóm:
 *  1. Bài tập chuyên đề cài sẵn trong mã nguồn (`core/exercises/`): hai bài gom động
 *     từ của nhiều bài lẫn nhiều cấp theo một chủ đề ngữ pháp, và bài ngữ pháp N4
 *     theo tài liệu tổng hợp.
 *  2. Bài chia động từ — tới từ `data-source/`, mở ở `/lesson/:id`.
 *  3. Bài dịch hội thoại — cũng tới từ `data-source/`, cũng mở ở `/lesson/:id`.
 *
 * Hai nhóm sau trước đây nằm ngoài trang chủ. Chúng chuyển về đây vì cùng một
 * việc: luyện một kỹ năng (chia thể, dịch câu) chứ không phải nhớ nghĩa của một
 * kho từ. Đường dẫn chi tiết `/lesson/:id` GIỮ NGUYÊN — đổi tab không có nghĩa là
 * đổi URL, và ★ "chưa nhớ" khoá theo id bài nên cũng không mất.
 *
 * Nhóm nào lấy loại bài nào là tra `lessonKindsOfTab('exercise')` chứ không viết
 * cứng, để việc phân chia tab chỉ nằm ở một chỗ (xem `LESSON_KIND_TAB`).
 *
 * Ô tìm và cách đếm ★ trên thẻ đến từ `LessonBrowser`. Không kế thừa
 * `LeveledLessonBrowser`: ở đó mỗi bài thuộc đúng một cấp, còn ở đây một bài tập
 * chuyên đề trải suốt N5→N3. Bộ lọc cấp của tab này vì vậy cho một thẻ thuộc MỌI cấp
 * nó phủ — người học N4 vẫn thấy bài chia động từ N5→N2 — và gom bài không gắn cấp
 * nào (động từ đặc biệt, bài tự nạp) vào nút "Tùy chọn".
 */
@Component({
  selector: 'app-exercise-list',
  imports: [RouterLink, SearchBox, T],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseList extends LessonBrowser {
  private readonly lessonStore = inject(LessonStore);

  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;

  /** Số thẻ xám vẽ trong lúc chờ tải danh sách bài. */
  readonly skeletonCards = [0, 1, 2, 3];

  /**
   * Các loại bài học thuộc tab này, trừ 'exercise'.
   *
   * Loại 'exercise' cũng xếp vào tab này nhưng nó KHÔNG tới từ `LessonStore` —
   * các bài tập chuyên đề nằm thẳng trong mã nguồn, đã dựng thẻ riêng ở trên.
   *
   * Kiểu ghi rõ `LessonKind[]` chứ không để suy ra: TypeScript tự rút hẹp kiểu
   * theo điều kiện của `filter`, và mảng rút hẹp đó thì `.includes(lesson.kind)`
   * không gọi được nữa vì `lesson.kind` rộng hơn.
   */
  private readonly lessonKinds: LessonKind[] = lessonKindsOfTab('exercise').filter(
    (kind) => kind !== 'exercise',
  );

  /** Cấp chọn chung cho cả ứng dụng, chưa kiểm tra còn bài hay không — đọc qua `level`. */
  private readonly levelPreference = inject(LevelPreference);

  /** Các bài tập chuyên đề, chưa lọc. */
  private readonly allExercises = computed<ExerciseCard[]>(() => {
    // Đọc signal counts để số ★ trên thẻ tự cập nhật sau khi luyện xong.
    const counts = this.favoriteStore.counts();
    // Các "sách ngữ pháp" (Tổng hợp N4, vnjpclub) là nội dung ngữ pháp: chúng nằm ở
    // nhóm Ngữ pháp (core/navigation.ts), không lặp lại ở đây.
    return EXERCISES.filter((info) => !isGrammarBookId(info.id)).map((info) => ({
      ...info,
      itemCount: itemCountOf(info.id),
      levelRange:
        info.levels.length > 1
          ? `${info.levels[0]} → ${info.levels[info.levels.length - 1]}`
          : info.levels[0],
      favoriteCount: counts[info.id] ?? 0,
    }));
  });

  /**
   * Bài tập chuyên đề khớp từ khoá.
   *
   * Tên và mô tả của chúng là KHOÁ thông điệp chứ không phải chữ sẵn, nên phải dịch
   * ra rồi mới so khớp. `t()` đọc signal ngôn ngữ nên computed này tự chạy lại khi
   * người dùng đổi ngôn ngữ — gõ "chuyển thể" ở tiếng Việt và gõ "活用" ở tiếng Nhật
   * đều tìm ra đúng thẻ đó.
   */
  readonly exercises = computed<ExerciseCard[]>(() => {
    const needle = this.needle();
    const level = this.level();
    const byLevel = this.allExercises().filter((card) => matchesLevel(card.levels, level));
    if (!needle) return byLevel;

    return byLevel.filter((card) => {
      const haystack = normalizeSearch(
        `${this.lang.t(card.nameKey)} ${this.lang.t(card.descKey)} ${card.id}`,
      );
      return needle.split(' ').every((word) => haystack.includes(word));
    });
  });

  /** Mọi bài học thuộc tab này, chưa lọc — dùng để phân biệt "chưa tải" với "không khớp". */
  readonly allLessons = computed<LessonSummary[]>(() =>
    this.lessonStore.summaries().filter((lesson) => this.lessonKinds.includes(lesson.kind)),
  );

  /**
   * Các nhóm bài học sau khi lọc. Nhóm không còn bài nào khớp thì bỏ luôn cả tiêu
   * đề nhóm, không để lại một tiêu đề trống lửng lơ.
   */
  readonly lessonGroups = computed<LessonGroup[]>(() => {
    const needle = this.needle();
    const all = this.allLessons();

    return this.lessonKinds.flatMap((kind) => {
      const level = this.level();
      const ofKind = all.filter(
        (lesson) => lesson.kind === kind && matchesLevel(lessonLevels(lesson), level),
      );
      const lessons = needle ? ofKind.filter((lesson) => lessonMatches(lesson, needle)) : ofKind;
      if (lessons.length === 0) return [];
      return [
        {
          kind,
          labelKey: LESSON_KIND_LABEL_KEY[kind],
          descKey: LESSON_KIND_DESC_KEY[kind],
          unitKey: LESSON_KIND_UNIT_KEY[kind],
          lessons,
        },
      ];
    });
  });

  /**
   * Số thẻ theo từng nút lọc. Cố tình KHÔNG trừ từ khoá đang gõ, như bộ lọc cấp ở các
   * tab khác: con số phải đứng yên khi gõ tìm. Thẻ trải nhiều cấp được đếm ở mỗi cấp.
   */
  private readonly levelCounts = computed(() => {
    const levelSets = [
      ...this.allExercises().map((card) => card.levels),
      ...this.allLessons().map(lessonLevels),
    ];
    const counts = new Map<ExerciseFilter, number>([['all', levelSets.length]]);
    for (const value of [...EXERCISE_LEVELS, 'none'] as const) {
      counts.set(value, levelSets.filter((levels) => matchesLevel(levels, value)).length);
    }
    return counts;
  });

  /** Các nút lọc; cấp không có bài nào thì không hiện nút. */
  readonly levelOptions = computed<ExerciseFilterOption[]>(() => {
    const counts = this.levelCounts();
    return (['all', ...EXERCISE_LEVELS, 'none'] as const)
      .map((value) => ({ value, count: counts.get(value) ?? 0 }))
      .filter((option) => option.value === 'all' || option.count > 0);
  });

  /** Cấp đang có hiệu lực. Cấp đã chọn mà hết bài thì tự quay về "Tất cả". */
  readonly level = computed<ExerciseFilter>(() => {
    const current = this.levelPreference.value();
    return (this.levelCounts().get(current) ?? 0) > 0 ? current : 'all';
  });

  /** Số thẻ đang hiện, tính cả bài tập chuyên đề lẫn bài học. */
  readonly visibleCount = computed(
    () =>
      this.exercises().length +
      this.lessonGroups().reduce((sum, group) => sum + group.lessons.length, 0),
  );

  /** Tổng số mục của phần đang hiện (cặp động từ, động từ, câu hội thoại…). */
  readonly visibleItemCount = computed(
    () =>
      this.exercises().reduce((sum, card) => sum + card.itemCount, 0) +
      this.lessonGroups().reduce(
        (sum, group) => sum + group.lessons.reduce((n, lesson) => n + lesson.itemCount, 0),
        0,
      ),
  );

  /**
   * Đang tìm mà không ra gì.
   *
   * Chỉ xét khi thật sự có từ khoá: các bài tập chuyên đề luôn có mặt nên `visibleCount`
   * không bao giờ bằng 0 lúc chưa gõ gì, nhưng có gõ thì nó về 0 được.
   */
  readonly noMatch = computed(() => this.needle().length > 0 && this.visibleCount() === 0);

  /** Còn đang tải danh sách bài và chưa có gì để vẽ cho phần bài học. */
  readonly loadingLessons = computed(
    () => this.status() === 'loading' && this.allLessons().length === 0,
  );

  constructor() {
    super();
    void this.lessonStore.loadIndex();
  }

  setLevel(value: ExerciseFilter): void {
    this.levelPreference.set(value);
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}

function itemCountOf(id: ExerciseId): number {
  switch (id) {
    case 'tu-tha-dong-tu':
      return TRANSITIVITY_PAIRS.length;
    case 'chuyen-the-dong-tu':
      return EXERCISE_VERBS.length;
    // Sách ngữ pháp không có thẻ ở trang này (xem `allExercises`).
    case 'ngu-phap-n4':
    case 'ngu-phap-vnjpclub':
      return 0;
  }
}

/** Cấp của một bài chia động từ / dịch hội thoại: một cấp, hoặc rỗng nếu không gắn cấp. */
function lessonLevels(lesson: LessonSummary): readonly ExerciseLevel[] {
  const level = levelOf(lesson);
  return level ? [level] : [];
}

function matchesLevel(levels: readonly ExerciseLevel[], filter: ExerciseFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'none') return levels.length === 0;
  return levels.includes(filter);
}
