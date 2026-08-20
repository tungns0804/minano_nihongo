import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EXERCISES, ExerciseId, ExerciseInfo } from '../../core/exercises/exercise.model';
import { EXERCISE_VERBS } from '../../core/exercises/exercise-verbs';
import { TRANSITIVITY_PAIRS } from '../../core/exercises/transitive-pairs';
import { LanguageStore } from '../../core/i18n/language-store';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import {
  LESSON_KIND_DESC_KEY,
  LESSON_KIND_LABEL_KEY,
  LESSON_KIND_UNIT_KEY,
  LessonKind,
  LessonSummary,
  lessonKindsOfTab,
} from '../../core/models/vocabulary.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import { lessonMatches, normalizeSearch } from '../../core/utils/lesson-search';

interface ExerciseCard extends ExerciseInfo {
  itemCount: number;
  /** "N5 → N3" — mã JLPT nên không dịch, chỉ ghép lại. */
  levelRange: string;
  favoriteCount: number;
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
 *  1. Bài tập chuyên đề cài sẵn trong mã nguồn (`core/exercises/`), gom động từ
 *     của nhiều bài lẫn nhiều cấp theo một chủ đề ngữ pháp.
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
 */
@Component({
  selector: 'app-exercise-list',
  imports: [RouterLink, T],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseList {
  private readonly lessonStore = inject(LessonStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);

  readonly status = this.lessonStore.status;
  readonly errorKey = this.lessonStore.errorKey;

  /** Số thẻ xám vẽ trong lúc chờ tải danh sách bài. */
  readonly skeletonCards = [0, 1, 2, 3];

  /** Từ khoá tìm, không nhớ sang lần mở sau — giống trang chủ và tab Ngữ pháp. */
  private readonly searchRef = signal('');

  readonly search = this.searchRef.asReadonly();

  private readonly needle = computed(() => normalizeSearch(this.searchRef()));

  /**
   * Các loại bài học thuộc tab này, trừ 'exercise'.
   *
   * Loại 'exercise' cũng xếp vào tab này nhưng nó KHÔNG tới từ `LessonStore` —
   * hai bài tập chuyên đề nằm thẳng trong mã nguồn, đã dựng thẻ riêng ở trên.
   *
   * Kiểu ghi rõ `LessonKind[]` chứ không để suy ra: TypeScript tự rút hẹp kiểu
   * theo điều kiện của `filter`, và mảng rút hẹp đó thì `.includes(lesson.kind)`
   * không gọi được nữa vì `lesson.kind` rộng hơn.
   */
  private readonly lessonKinds: LessonKind[] = lessonKindsOfTab('exercise').filter(
    (kind) => kind !== 'exercise',
  );

  /** Hai bài tập chuyên đề, chưa lọc. */
  private readonly allExercises = computed<ExerciseCard[]>(() => {
    // Đọc signal counts để số ★ trên thẻ tự cập nhật sau khi luyện xong.
    const counts = this.favoriteStore.counts();
    return EXERCISES.map((info) => ({
      ...info,
      itemCount: itemCountOf(info.id),
      levelRange: `${info.levels[0]} → ${info.levels[info.levels.length - 1]}`,
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
    if (!needle) return this.allExercises();

    return this.allExercises().filter((card) => {
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
      const ofKind = all.filter((lesson) => lesson.kind === kind);
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
   * Chỉ xét khi thật sự có từ khoá: hai bài tập chuyên đề luôn có mặt nên `visibleCount`
   * không bao giờ bằng 0 lúc chưa gõ gì, nhưng có gõ thì nó về 0 được.
   */
  readonly noMatch = computed(() => this.needle().length > 0 && this.visibleCount() === 0);

  /** Còn đang tải danh sách bài và chưa có gì để vẽ cho phần bài học. */
  readonly loadingLessons = computed(
    () => this.status() === 'loading' && this.allLessons().length === 0,
  );

  constructor() {
    void this.lessonStore.loadIndex();
  }

  onSearch(event: Event): void {
    this.searchRef.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.searchRef.set('');
  }

  favoriteCount(lessonId: string): number {
    return this.favoriteStore.counts()[lessonId] ?? 0;
  }

  reload(): void {
    void this.lessonStore.loadIndex(true);
  }
}

function itemCountOf(id: ExerciseId): number {
  return id === 'tu-tha-dong-tu' ? TRANSITIVITY_PAIRS.length : EXERCISE_VERBS.length;
}
