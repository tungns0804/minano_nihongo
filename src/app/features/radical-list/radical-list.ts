import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  PracticeConfig,
  PracticeScope,
} from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildRadicalHanVietQuestions } from '../../core/practice/radical-questions';
import {
  RADICAL_HAN_VIET_MODE,
  RADICAL_SESSION_ID,
  RadicalEntry,
  STROKE_GROUPS,
  StrokeGroup,
  strokeGroupOf,
} from '../../core/radical/radical.model';
import { RADICAL_ENTRIES } from '../../core/radical/radical-entries';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { normalizeSearch } from '../../core/utils/lesson-search';

/** Các mốc số câu cho phép chọn nhanh, giống mọi màn hình thiết lập khác. */
const LIMIT_CHOICES = [10, 20, 30, 50, 100] as const;

/**
 * Tab "Bộ thủ" — lưới 214 bộ thủ theo số nét, kèm phần luyện "bộ thủ → âm Hán Việt".
 *
 * Dựng theo đúng lối của tab Kanji (`features/kanji-list`): lưới tra ở trên, khối
 * thiết lập luyện tập ở dưới, phiên luyện đi qua đúng màn hình luyện tập và màn
 * hình kết quả chung. Khác đúng hai chỗ: tab chia theo SỐ NÉT thay vì cấp JLPT, và
 * mở một ô ra thì thấy các CHỮ ghép từ bộ đó thay vì các TỪ dùng chữ đó.
 */
@Component({
  selector: 'app-radical-list',
  imports: [RouterLink, T],
  templateUrl: './radical-list.html',
  styleUrl: './radical-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadicalList {
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);
  private readonly router = inject(Router);

  readonly t = this.lang.t.bind(this.lang);
  readonly allGroups = STROKE_GROUPS;
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;
  readonly hanVietMode = RADICAL_HAN_VIET_MODE;
  readonly totalCount = RADICAL_ENTRIES.length;

  /**
   * Nhóm nét đang xem. Một nhóm mỗi lần, cùng lý do với tab Kanji: đây là bảng tra
   * 214 bộ, trộn hết vào một lưới thì không còn biết mình đang học phần nào.
   */
  readonly group = signal<StrokeGroup>('1-2');
  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  // --- Thiết lập luyện tập ---
  readonly scope = signal<PracticeScope>('all');
  readonly questionLimit = signal<number | null>(null);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);
  readonly showHint = signal(false);

  /** Đọc qua signal của FavoriteStore để lưới tự cập nhật khi bấm sao. */
  private readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(RADICAL_SESSION_ID));
  });

  /** Số bộ của từng nhóm nét — con số trên nút, tính trên toàn bộ dữ liệu. */
  readonly groupCounts = computed<Record<StrokeGroup, number>>(() => {
    const counts = Object.fromEntries(STROKE_GROUPS.map((item) => [item, 0])) as Record<
      StrokeGroup,
      number
    >;
    for (const entry of RADICAL_ENTRIES) counts[strokeGroupOf(entry.strokes)]++;
    return counts;
  });

  /** Bộ của nhóm đang xem — cũng là tập đem ra hỏi khi phạm vi là "Toàn bộ". */
  readonly groupEntries = computed<RadicalEntry[]>(() =>
    RADICAL_ENTRIES.filter((entry) => strokeGroupOf(entry.strokes) === this.group()),
  );

  readonly favoriteCount = computed(
    () => this.groupEntries().filter((entry) => this.favoriteIds().has(entry.id)).length,
  );

  readonly groupKanjiCount = computed(() =>
    this.groupEntries().reduce((total, entry) => total + entry.kanji.length, 0),
  );

  /** Lưới đang hiện: lọc theo ★ và theo từ khoá tìm. */
  readonly visibleEntries = computed<RadicalEntry[]>(() => {
    const base = this.onlyFavorites()
      ? this.groupEntries().filter((entry) => this.favoriteIds().has(entry.id))
      : this.groupEntries();

    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;

    // Tìm cả trong các chữ ghép từ bộ: gõ "hưu" hay 休 phải ra được bộ 人 và 木.
    return base.filter((entry) =>
      normalizeSearch(
        `${entry.char} ${entry.variants.join(' ')} ${entry.hanViet} ${entry.meaning} ` +
          `${entry.japanese} ${entry.kanji.map((k) => `${k.char} ${k.hanViet}`).join(' ')}`,
      ).includes(keyword),
    );
  });

  // --- Tập bộ sẽ đem ra hỏi ---

  readonly pool = computed<RadicalEntry[]>(() =>
    this.scope() === 'favorite'
      ? this.groupEntries().filter((entry) => this.favoriteIds().has(entry.id))
      : this.groupEntries(),
  );

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.pool().length : Math.min(limit, this.pool().length);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter((limit) => limit < this.pool().length),
  );

  readonly modeShort = computed(() => this.lang.t(RADICAL_HAN_VIET_MODE.shortKey));

  // --- Sự kiện ---

  setGroup(group: StrokeGroup): void {
    this.group.set(group);
    this.questionLimit.set(null);
    this.fixScope();
  }

  setScope(scope: PracticeScope): void {
    this.scope.set(scope);
    this.questionLimit.set(null);
  }

  setQuestionLimit(limit: number | null): void {
    this.questionLimit.set(limit);
  }

  toggleShuffle(event: Event): void {
    this.shuffleQuestions.set((event.target as HTMLInputElement).checked);
  }

  toggleIgnoreDiacritics(event: Event): void {
    this.ignoreDiacritics.set((event.target as HTMLInputElement).checked);
  }

  toggleShowHint(event: Event): void {
    this.showHint.set((event.target as HTMLInputElement).checked);
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  toggleOnlyFavorites(event: Event): void {
    this.onlyFavorites.set((event.target as HTMLInputElement).checked);
  }

  /** Phạm vi ★ có thể rỗng đi sau khi đổi nhóm nét — quay về "Toàn bộ". */
  private fixScope(): void {
    if (this.scope() === 'favorite' && this.favoriteCount() === 0) this.scope.set('all');
  }

  // --- Favorite ---

  isFavorite(radicalId: string): boolean {
    return this.favoriteIds().has(radicalId);
  }

  toggleFavorite(radicalId: string): void {
    this.favoriteStore.toggle(RADICAL_SESSION_ID, radicalId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(RADICAL_SESSION_ID);
    }
  }

  // --- Bắt đầu ---

  start(): void {
    if (!this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: RADICAL_SESSION_ID,
      lessonKind: 'radical',
      scope: this.scope(),
      // Khu Bộ thủ không có trắc nghiệm, xem `radical.typingOnly`.
      answerMode: 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: 'jp-vi',
      // Ở khu Bộ thủ, cờ này bật gợi ý "một chữ ghép từ bộ đang hỏi".
      showHanViet: this.showHint(),
      // Các trường dưới đây thuộc về loại bài khác — xem ghi chú ở `PracticeConfig`.
      showGrammarHint: false,
      verbMode: 'masu-to-form',
      verbForms: ['te'],
      exercise: null,
      exerciseMode: 'to-transitive',
      kanjiMode: 'kanji-hanviet',
      radicalMode: 'radical-hanviet',
    };

    const questions = orderQuestions(buildRadicalHanVietQuestions(this.pool(), config), config);
    const lesson = { id: RADICAL_SESSION_ID, name: this.lang.t('radical.practiceHanViet') };
    if (this.session.start(lesson, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}
