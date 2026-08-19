import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  KANJI_LEVELS,
  KANJI_WORD_MODES,
  KanjiLevel,
  KanjiMode,
  Radical,
  RadicalKanji,
  RadicalWord,
  kanjiModeInfo,
  kanjiQuestionsPerItem,
} from '../../core/kanji/kanji.model';
import { radicalById } from '../../core/kanji/radicals';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  PracticeConfig,
  PracticeScope,
} from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildKanjiWordQuestions } from '../../core/practice/kanji-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { normalizeSearch } from '../../core/utils/lesson-search';

/** Các mốc số câu cho phép chọn nhanh, giống mọi màn hình thiết lập khác. */
const LIMIT_CHOICES = [10, 20, 30, 50] as const;

/**
 * Màn hình MỘT bộ thủ: bộ thủ vẽ to, các chữ thuộc bộ kèm từ minh hoạ, và phần
 * luyện "từ → nghĩa" / "từ → hiragana".
 *
 * Phần luyện "bộ thủ → âm Hán Việt" KHÔNG ở đây mà ở màn hình danh sách: hỏi âm
 * Hán Việt của đúng một bộ thì cả phiên chỉ có một câu.
 *
 * Phần chạy phiên và chấm điểm dùng lại nguyên vẹn: câu hỏi dựng ở
 * `core/practice/kanji-questions.ts` rồi đi qua đúng màn hình luyện tập và màn
 * hình kết quả như mọi bài học khác.
 */
@Component({
  selector: 'app-kanji-radical',
  imports: [RouterLink, T],
  templateUrl: './kanji-radical.html',
  styleUrl: './kanji-radical.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiRadical {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);
  readonly modes = KANJI_WORD_MODES;
  readonly allLevels = KANJI_LEVELS;
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;

  readonly radicalId = signal('');
  readonly radical = signal<Radical | null>(null);

  // --- Thiết lập luyện tập ---
  readonly levels = signal<KanjiLevel[]>([...KANJI_LEVELS]);
  readonly mode = signal<KanjiMode>('word-meaning');
  readonly scope = signal<PracticeScope>('all');
  readonly questionLimit = signal<number | null>(null);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);

  // --- Bộ lọc bảng ---
  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  readonly notFound = computed(() => this.radical() === null);
  readonly currentMode = computed(() => kanjiModeInfo(this.mode()));
  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));

  /** Đọc qua signal của FavoriteStore để bảng tự cập nhật khi bấm sao. */
  private readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(this.radicalId()));
  });

  private readonly levelSet = computed(() => new Set(this.levels()));

  /** Từ của các cấp đang chọn. */
  readonly levelWords = computed<RadicalWord[]>(() =>
    (this.radical()?.words ?? []).filter((word) => this.levelSet().has(word.level)),
  );

  /**
   * Số từ của từng cấp, tính trên TOÀN BỘ từ của bộ chứ không trừ đi cấp đang
   * chọn: con số trên nút phải đứng yên khi bật tắt các cấp.
   */
  readonly levelCounts = computed<Record<KanjiLevel, number>>(() => {
    const counts = { N5: 0, N4: 0, N3: 0 } as Record<KanjiLevel, number>;
    for (const word of this.radical()?.words ?? []) counts[word.level]++;
    return counts;
  });

  /** Cấp nào bộ này thực sự có từ — cấp rỗng thì không bày nút ra để bấm vào chỗ trống. */
  readonly availableLevels = computed<KanjiLevel[]>(() =>
    KANJI_LEVELS.filter((level) => this.levelCounts()[level] > 0),
  );

  readonly favoriteCount = computed(
    () => this.levelWords().filter((word) => this.favoriteIds().has(word.id)).length,
  );

  // --- Tập từ sẽ đem ra hỏi ---

  readonly pool = computed<RadicalWord[]>(() =>
    this.scope() === 'favorite'
      ? this.levelWords().filter((word) => this.favoriteIds().has(word.id))
      : this.levelWords(),
  );

  readonly plannedQuestionCount = computed(() => {
    const total = this.pool().length * kanjiQuestionsPerItem(this.mode());
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter(
      (limit) => limit < this.pool().length * kanjiQuestionsPerItem(this.mode()),
    ),
  );

  // --- Bảng tra cứu: nhóm theo chữ, đã lọc ---

  readonly visibleGroups = computed<RadicalKanji[]>(() => {
    const radical = this.radical();
    if (!radical) return [];

    const keyword = normalizeSearch(this.search());
    const favorites = this.favoriteIds();

    return radical.kanjiList
      .map((group) => ({
        char: group.char,
        words: group.words.filter((word) => {
          if (!this.levelSet().has(word.level)) return false;
          if (this.onlyFavorites() && !favorites.has(word.id)) return false;
          if (!keyword) return true;
          return normalizeSearch(
            `${group.char} ${word.japanese} ${word.reading} ${word.hanViet} ${word.meaning}`,
          ).includes(keyword);
        }),
      }))
      .filter((group) => group.words.length > 0);
  });

  readonly shownCount = computed(() =>
    this.visibleGroups().reduce((total, group) => total + group.words.length, 0),
  );

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id') ?? '';
      this.radicalId.set(id);
      this.load(id);
    });
  }

  private load(id: string): void {
    const radical = radicalById(id);
    this.radical.set(radical);
    if (!radical) return;

    // Mở bộ khác là đặt lại toàn bộ thiết lập: cấp độ và ★ của bộ cũ không nói gì
    // về bộ mới, mà bộ mới có thể không có cấp mà bộ cũ đang chọn.
    this.levels.set([...KANJI_LEVELS]);
    this.mode.set('word-meaning');
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
    // Luôn phải còn ít nhất một cấp có từ: bỏ hết thì bảng trống trơn mà không rõ vì sao.
    if (current.includes(level) && current.length === 1) return;

    const next = current.includes(level)
      ? current.filter((item) => item !== level)
      : [...current, level];
    this.levels.set(KANJI_LEVELS.filter((item) => next.includes(item)));
    this.questionLimit.set(null);
    this.fixScope();
  }

  setMode(mode: KanjiMode): void {
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

  isFavorite(wordId: string): boolean {
    return this.favoriteIds().has(wordId);
  }

  toggleFavorite(wordId: string): void {
    this.favoriteStore.toggle(this.radicalId(), wordId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(this.radicalId());
    }
  }

  // --- Bắt đầu ---

  start(): void {
    const radical = this.radical();
    if (!radical || !this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: radical.id,
      lessonKind: 'kanji',
      scope: this.scope(),
      // Khu Kanji không có trắc nghiệm, xem `kanji.typingOnly`.
      answerMode: 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      // Chỉ có tác dụng ở chiều hỏi nghĩa (đáp án tiếng Việt); chiều hỏi hiragana
      // thì đáp án là kana nên tuỳ chọn này không đụng tới nó.
      ignoreDiacritics: this.ignoreDiacritics(),
      // Các trường dưới đây thuộc về loại bài khác — xem ghi chú ở `PracticeConfig`.
      direction: 'jp-vi',
      showHanViet: false,
      showGrammarHint: false,
      verbMode: 'masu-to-form',
      verbForms: ['te'],
      exercise: null,
      exerciseMode: 'to-transitive',
      kanjiMode: this.mode(),
    };

    const questions = orderQuestions(
      buildKanjiWordQuestions(this.pool(), radical, config),
      config,
    );

    const name = `${radical.glyph} ${radical.hanViet}`;
    if (this.session.start({ id: radical.id, name }, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}
