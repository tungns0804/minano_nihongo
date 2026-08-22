import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import { KANJI_LEVELS, KanjiLevel } from '../../core/kanji/kanji.model';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  PracticeConfig,
  PracticeScope,
} from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildRadicalKanjiQuestions } from '../../core/practice/radical-questions';
import {
  RADICAL_KANJI_MODES,
  RadicalEntry,
  RadicalKanji,
  RadicalMode,
  radicalModeInfo,
  radicalQuestionCount,
  usableForParts,
} from '../../core/radical/radical.model';
import { radicalById } from '../../core/radical/radical-entries';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { normalizeSearch } from '../../core/utils/lesson-search';

/** Các mốc số câu cho phép chọn nhanh, giống mọi màn hình thiết lập khác. */
const LIMIT_CHOICES = [10, 20, 30, 50] as const;

/**
 * Màn hình MỘT bộ thủ: bộ vẽ to, âm Hán Việt + nghĩa + tên tiếng Nhật, và bảng các
 * chữ Hán ghép từ bộ đó kèm phần luyện "chữ → âm Hán Việt" / "chữ → chiết tự".
 *
 * Phần luyện "bộ → âm Hán Việt" KHÔNG ở đây mà ở màn hình danh sách: hỏi âm Hán
 * Việt của đúng một bộ thì cả phiên chỉ có một câu.
 *
 * Phần chạy phiên và chấm điểm dùng lại nguyên vẹn: câu hỏi dựng ở
 * `core/practice/radical-questions.ts` rồi đi qua đúng màn hình luyện tập và màn
 * hình kết quả như mọi bài học khác.
 */
@Component({
  selector: 'app-radical-detail',
  imports: [RouterLink, T],
  templateUrl: './radical-detail.html',
  styleUrl: './radical-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadicalDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);
  readonly modes = RADICAL_KANJI_MODES;
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;

  readonly radicalId = signal('');
  readonly entry = signal<RadicalEntry | null>(null);

  // --- Thiết lập luyện tập ---
  readonly levels = signal<KanjiLevel[]>([...KANJI_LEVELS]);
  readonly mode = signal<RadicalMode>('kanji-hanviet');
  readonly scope = signal<PracticeScope>('all');
  readonly questionLimit = signal<number | null>(null);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);
  readonly showHint = signal(false);

  // --- Bộ lọc bảng ---
  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  readonly notFound = computed(() => this.entry() === null);
  /**
   * Bộ có trong bảng 214 nhưng kho chữ N5→N3 chưa có chữ nào ghép từ nó. Vẫn hiện
   * bộ và âm Hán Việt (luyện âm ở màn danh sách vẫn hỏi tới nó), chỉ là chưa luyện
   * chữ được.
   */
  readonly hasNoKanji = computed(() => (this.entry()?.kanji.length ?? 0) === 0);
  readonly currentMode = computed(() => radicalModeInfo(this.mode()));
  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));

  /** Bộ và các biến thể của nó, gộp thành một chuỗi để hiện ở đầu trang. */
  readonly forms = computed(() => {
    const entry = this.entry();
    return entry ? [entry.char, ...entry.variants].join('  ') : '';
  });

  /** Đọc qua signal của FavoriteStore để bảng tự cập nhật khi bấm sao. */
  private readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(this.radicalId()));
  });

  private readonly levelSet = computed(() => new Set(this.levels()));

  /** Chữ của các cấp đang chọn. */
  readonly levelKanji = computed<RadicalKanji[]>(() =>
    (this.entry()?.kanji ?? []).filter((kanji) => this.levelSet().has(kanji.level)),
  );

  /**
   * Số chữ của từng cấp, tính trên TOÀN BỘ chữ của bộ chứ không trừ đi cấp đang
   * chọn: con số trên nút phải đứng yên khi bật tắt các cấp.
   */
  readonly levelCounts = computed<Record<KanjiLevel, number>>(() => {
    const counts = { N5: 0, N4: 0, N3: 0 } as Record<KanjiLevel, number>;
    for (const kanji of this.entry()?.kanji ?? []) counts[kanji.level]++;
    return counts;
  });

  /** Cấp nào bộ này thực sự có chữ — cấp rỗng thì không bày nút ra để bấm vào chỗ trống. */
  readonly availableLevels = computed<KanjiLevel[]>(() =>
    KANJI_LEVELS.filter((level) => this.levelCounts()[level] > 0),
  );

  readonly favoriteCount = computed(
    () => this.levelKanji().filter((kanji) => this.favoriteIds().has(kanji.id)).length,
  );

  // --- Tập chữ sẽ đem ra hỏi ---

  readonly pool = computed<RadicalKanji[]>(() =>
    this.scope() === 'favorite'
      ? this.levelKanji().filter((kanji) => this.favoriteIds().has(kanji.id))
      : this.levelKanji(),
  );

  readonly plannedQuestionCount = computed(() => {
    const total = radicalQuestionCount(this.pool(), this.mode());
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() => {
    const total = radicalQuestionCount(this.pool(), this.mode());
    return LIMIT_CHOICES.filter((limit) => limit < total);
  });

  /**
   * Chữ chưa tra đủ âm Hán Việt của các bộ — chiều hỏi chiết tự bỏ qua chúng.
   * Hiện con số này ra để người học không tưởng phần mềm đếm sai số câu.
   */
  readonly skippedForParts = computed(
    () => this.pool().filter((kanji) => !usableForParts(kanji)).length,
  );

  readonly modeSkipsSome = computed(
    () => this.mode() !== 'kanji-hanviet' && this.skippedForParts() > 0,
  );

  // --- Bảng tra cứu ---

  readonly visibleKanji = computed<RadicalKanji[]>(() => {
    const base = this.onlyFavorites()
      ? this.levelKanji().filter((kanji) => this.favoriteIds().has(kanji.id))
      : this.levelKanji();

    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;

    return base.filter((kanji) =>
      normalizeSearch(
        `${kanji.char} ${kanji.hanViet} ${kanji.parts.join(' ')} ${kanji.partsHanViet} ` +
          kanji.words.map((word) => `${word.japanese} ${word.reading} ${word.meaning}`).join(' '),
      ).includes(keyword),
    );
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id') ?? '';
      this.radicalId.set(id);
      this.load(id);
    });
  }

  private load(id: string): void {
    const entry = radicalById(id);
    this.entry.set(entry);
    if (!entry) return;

    // Mở bộ khác là đặt lại toàn bộ thiết lập: cấp độ và ★ của bộ cũ không nói gì
    // về bộ mới, mà bộ mới có thể không có cấp mà bộ cũ đang chọn.
    this.levels.set([...KANJI_LEVELS]);
    this.mode.set('kanji-hanviet');
    this.scope.set('all');
    this.questionLimit.set(null);
    this.search.set('');
    this.onlyFavorites.set(false);
  }

  // --- Sự kiện thiết lập ---

  isLevelSelected(level: KanjiLevel): boolean {
    return this.levels().includes(level);
  }

  toggleLevel(level: KanjiLevel): void {
    const current = this.levels().filter((item) => this.levelCounts()[item] > 0);
    // Luôn phải còn ít nhất một cấp có chữ: bỏ hết thì bảng trống trơn mà không rõ vì sao.
    if (current.includes(level) && current.length === 1) return;

    const next = current.includes(level)
      ? current.filter((item) => item !== level)
      : [...current, level];
    this.levels.set(KANJI_LEVELS.filter((item) => next.includes(item)));
    this.questionLimit.set(null);
    this.fixScope();
  }

  setMode(mode: RadicalMode): void {
    this.mode.set(mode);
    this.questionLimit.set(null);
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

  /** Phạm vi ★ có thể rỗng đi sau khi đổi cấp độ — quay về "Toàn bộ". */
  private fixScope(): void {
    if (this.scope() === 'favorite' && this.favoriteCount() === 0) this.scope.set('all');
  }

  // --- Favorite ---

  isFavorite(kanjiId: string): boolean {
    return this.favoriteIds().has(kanjiId);
  }

  toggleFavorite(kanjiId: string): void {
    this.favoriteStore.toggle(this.radicalId(), kanjiId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(this.radicalId());
    }
  }

  // --- Bắt đầu ---

  start(): void {
    const entry = this.entry();
    if (!entry || !this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: entry.id,
      lessonKind: 'radical',
      scope: this.scope(),
      // Khu Bộ thủ không có trắc nghiệm, xem `radical.typingOnly`.
      answerMode: 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      // Đáp án của cả hai chiều đều là âm Hán Việt (chữ Latin) nên tuỳ chọn này
      // có tác dụng ở cả hai.
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: 'jp-vi',
      // Ở khu Bộ thủ, cờ này bật gợi ý đổi theo chiều hỏi — xem `radical-questions.ts`.
      showHanViet: this.showHint(),
      // Các trường dưới đây thuộc về loại bài khác — xem ghi chú ở `PracticeConfig`.
      showGrammarHint: false,
      verbMode: 'masu-to-form',
      verbForms: ['te'],
      exercise: null,
      exerciseMode: 'to-transitive',
      kanjiMode: 'kanji-hanviet',
      radicalMode: this.mode(),
    };

    const questions = orderQuestions(buildRadicalKanjiQuestions(this.pool(), entry, config), config);
    const name = `${entry.char} ${entry.hanViet}`;
    if (this.session.start({ id: entry.id, name }, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}
