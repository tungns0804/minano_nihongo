import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  KANJI_LEVELS,
  KANJI_WORD_MODES,
  KanjiEntry,
  KanjiLevel,
  KanjiMode,
  KanjiWord,
  kanjiModeInfo,
  kanjiQuestionsPerItem,
} from '../../core/kanji/kanji.model';
import { kanjiById } from '../../core/kanji/kanji-entries';
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
 * Màn hình MỘT chữ Hán: chữ vẽ to, âm Hán Việt, và bảng các từ dùng chữ đó kèm
 * phần luyện "từ → nghĩa" / "từ → hiragana".
 *
 * Phần luyện "chữ → âm Hán Việt" KHÔNG ở đây mà ở màn hình danh sách: hỏi âm Hán
 * Việt của đúng một chữ thì cả phiên chỉ có một câu.
 *
 * Phần chạy phiên và chấm điểm dùng lại nguyên vẹn: câu hỏi dựng ở
 * `core/practice/kanji-questions.ts` rồi đi qua đúng màn hình luyện tập và màn
 * hình kết quả như mọi bài học khác.
 */
@Component({
  selector: 'app-kanji-detail',
  imports: [RouterLink, T],
  templateUrl: './kanji-detail.html',
  styleUrl: './kanji-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);
  readonly modes = KANJI_WORD_MODES;
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;

  readonly kanjiId = signal('');
  readonly entry = signal<KanjiEntry | null>(null);

  // --- Thiết lập luyện tập ---
  readonly levels = signal<KanjiLevel[]>([...KANJI_LEVELS]);
  readonly mode = signal<KanjiMode>('word-meaning');
  readonly scope = signal<PracticeScope>('all');
  readonly questionLimit = signal<number | null>(null);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);
  readonly showHint = signal(false);

  // --- Bộ lọc bảng ---
  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  readonly notFound = computed(() => this.entry() === null);
  readonly currentMode = computed(() => kanjiModeInfo(this.mode()));
  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));

  /** Tất cả cách đọc của chữ, gộp thành một chuỗi để hiện ở đầu trang. */
  readonly readings = computed(() => {
    const entry = this.entry();
    if (!entry) return '';
    return [entry.hanViet, ...entry.altHanViet].filter(Boolean).join(' / ');
  });

  /** Đọc qua signal của FavoriteStore để bảng tự cập nhật khi bấm sao. */
  private readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(this.kanjiId()));
  });

  private readonly levelSet = computed(() => new Set(this.levels()));

  /** Từ của các cấp đang chọn. */
  readonly levelWords = computed<KanjiWord[]>(() =>
    (this.entry()?.words ?? []).filter((word) => this.levelSet().has(word.level)),
  );

  /**
   * Số từ của từng cấp, tính trên TOÀN BỘ từ của chữ chứ không trừ đi cấp đang
   * chọn: con số trên nút phải đứng yên khi bật tắt các cấp.
   */
  readonly levelCounts = computed<Record<KanjiLevel, number>>(() => {
    const counts = { N5: 0, N4: 0, N3: 0 } as Record<KanjiLevel, number>;
    for (const word of this.entry()?.words ?? []) counts[word.level]++;
    return counts;
  });

  /** Cấp nào chữ này thực sự có từ — cấp rỗng thì không bày nút ra để bấm vào chỗ trống. */
  readonly availableLevels = computed<KanjiLevel[]>(() =>
    KANJI_LEVELS.filter((level) => this.levelCounts()[level] > 0),
  );

  readonly favoriteCount = computed(
    () => this.levelWords().filter((word) => this.favoriteIds().has(word.id)).length,
  );

  // --- Tập từ sẽ đem ra hỏi ---

  readonly pool = computed<KanjiWord[]>(() =>
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

  // --- Bảng tra cứu ---

  readonly visibleWords = computed<KanjiWord[]>(() => {
    const base = this.onlyFavorites()
      ? this.levelWords().filter((word) => this.favoriteIds().has(word.id))
      : this.levelWords();

    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;

    return base.filter((word) =>
      normalizeSearch(
        `${word.japanese} ${word.reading} ${word.hanViet} ${word.meaning}`,
      ).includes(keyword),
    );
  });

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id') ?? '';
      this.kanjiId.set(id);
      this.load(id);
    });
  }

  private load(id: string): void {
    const entry = kanjiById(id);
    this.entry.set(entry);
    if (!entry) return;

    // Mở chữ khác là đặt lại toàn bộ thiết lập: cấp độ và ★ của chữ cũ không nói gì
    // về chữ mới, mà chữ mới có thể không có cấp mà chữ cũ đang chọn.
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

  isFavorite(wordId: string): boolean {
    return this.favoriteIds().has(wordId);
  }

  toggleFavorite(wordId: string): void {
    this.favoriteStore.toggle(this.kanjiId(), wordId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(this.kanjiId());
    }
  }

  // --- Bắt đầu ---

  start(): void {
    const entry = this.entry();
    if (!entry || !this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: entry.id,
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
      direction: 'jp-vi',
      // Ở khu Kanji, cờ này bật gợi ý âm Hán Việt của cả từ.
      showHanViet: this.showHint(),
      // Các trường dưới đây thuộc về loại bài khác — xem ghi chú ở `PracticeConfig`.
      showGrammarHint: false,
      verbMode: 'masu-to-form',
      verbForms: ['te'],
      exercise: null,
      exerciseMode: 'to-transitive',
      kanjiMode: this.mode(),
    };

    const questions = orderQuestions(buildKanjiWordQuestions(this.pool(), entry, config), config);
    const name = `${entry.char} ${entry.hanViet}`;
    if (this.session.start({ id: entry.id, name }, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}
