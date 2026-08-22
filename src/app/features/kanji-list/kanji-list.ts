import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  KANJI_HAN_VIET_MODE,
  KANJI_LEVELS,
  KANJI_SESSION_ID,
  KanjiEntry,
  KanjiLevel,
  emptyLevelCounts,
} from '../../core/kanji/kanji.model';
import { KANJI_ENTRIES } from '../../core/kanji/kanji-entries';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  PracticeConfig,
  PracticeScope,
} from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildKanjiHanVietQuestions } from '../../core/practice/kanji-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { normalizeSearch } from '../../core/utils/lesson-search';

/** Các mốc số câu cho phép chọn nhanh, giống mọi màn hình thiết lập khác. */
const LIMIT_CHOICES = [10, 20, 30, 50, 100] as const;

/**
 * Tab "Kanji" — lưới chữ Hán theo cấp độ, kèm phần luyện "chữ Hán → âm Hán Việt".
 *
 * Vì sao phần luyện âm Hán Việt nằm ở ĐÂY chứ không ở màn hình một chữ: nó hỏi
 * trên cả danh sách. Mở từng chữ ra để luyện đúng một chữ thì mỗi phiên một câu.
 *
 * Phần luyện các TỪ của một chữ thì ngược lại, nằm ở `/kanji/:id` vì nó chỉ có
 * nghĩa trong phạm vi một chữ.
 */
@Component({
  selector: 'app-kanji-list',
  imports: [RouterLink, T],
  templateUrl: './kanji-list.html',
  styleUrl: './kanji-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiList {
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly session = inject(PracticeSessionStore);
  private readonly lang = inject(LanguageStore);
  private readonly router = inject(Router);

  readonly t = this.lang.t.bind(this.lang);
  readonly allLevels = KANJI_LEVELS;
  readonly maxWrongAttempts = DEFAULT_MAX_WRONG_ATTEMPTS;
  readonly hanVietMode = KANJI_HAN_VIET_MODE;

  /**
   * Cấp đang xem. Một cấp mỗi lần chứ không phải nhiều lựa chọn như khu Bài tập:
   * đây là bảng tra gần hai nghìn chữ, xem lẫn lộn hai cấp thì không còn biết mình
   * đang học phần nào.
   */
  readonly level = signal<KanjiLevel>('N5');
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
    return new Set(this.favoriteStore.idsOf(KANJI_SESSION_ID));
  });

  /** Số chữ của từng cấp — con số trên nút, tính trên toàn bộ dữ liệu. */
  readonly levelCounts = computed<Record<KanjiLevel, number>>(() => {
    const counts = emptyLevelCounts();
    for (const entry of KANJI_ENTRIES) counts[entry.level]++;
    return counts;
  });

  /** Chữ của cấp đang xem — cũng là tập đem ra hỏi khi phạm vi là "Toàn bộ". */
  readonly levelEntries = computed<KanjiEntry[]>(() =>
    KANJI_ENTRIES.filter((entry) => entry.level === this.level()),
  );

  readonly favoriteCount = computed(
    () => this.levelEntries().filter((entry) => this.favoriteIds().has(entry.id)).length,
  );

  readonly levelWordCount = computed(() =>
    this.levelEntries().reduce((total, entry) => total + entry.words.length, 0),
  );

  /** Lưới đang hiện: lọc theo ★ và theo từ khoá tìm. */
  readonly visibleEntries = computed<KanjiEntry[]>(() => {
    const base = this.onlyFavorites()
      ? this.levelEntries().filter((entry) => this.favoriteIds().has(entry.id))
      : this.levelEntries();

    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;

    // Tìm cả trong các từ của chữ: gõ "bệnh viện" phải ra được chữ 病 và 院.
    return base.filter((entry) =>
      normalizeSearch(
        `${entry.char} ${entry.hanViet} ${entry.altHanViet.join(' ')} ` +
          entry.words.map((word) => `${word.japanese} ${word.reading} ${word.meaning}`).join(' '),
      ).includes(keyword),
    );
  });

  // --- Tập chữ sẽ đem ra hỏi ---

  readonly pool = computed<KanjiEntry[]>(() =>
    this.scope() === 'favorite'
      ? this.levelEntries().filter((entry) => this.favoriteIds().has(entry.id))
      : this.levelEntries(),
  );

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.pool().length : Math.min(limit, this.pool().length);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter((limit) => limit < this.pool().length),
  );

  readonly modeShort = computed(() => this.lang.t(KANJI_HAN_VIET_MODE.shortKey));

  // --- Sự kiện ---

  setLevel(level: KanjiLevel): void {
    this.level.set(level);
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

  /** Phạm vi ★ có thể rỗng đi sau khi đổi cấp — quay về "Toàn bộ". */
  private fixScope(): void {
    if (this.scope() === 'favorite' && this.favoriteCount() === 0) this.scope.set('all');
  }

  // --- Favorite ---

  isFavorite(kanjiId: string): boolean {
    return this.favoriteIds().has(kanjiId);
  }

  toggleFavorite(kanjiId: string): void {
    this.favoriteStore.toggle(KANJI_SESSION_ID, kanjiId);
  }

  clearFavorites(): void {
    if (this.favoriteCount() === 0) return;
    if (confirm(this.lang.t('lesson.confirm.clearFavorites', { count: this.favoriteCount() }))) {
      this.favoriteStore.clearLesson(KANJI_SESSION_ID);
    }
  }

  // --- Bắt đầu ---

  start(): void {
    if (!this.canStart()) return;

    const config: PracticeConfig = {
      lessonId: KANJI_SESSION_ID,
      lessonKind: 'kanji',
      scope: this.scope(),
      // Khu Kanji không có trắc nghiệm, xem `kanji.typingOnly`.
      answerMode: 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: 'jp-vi',
      // Ở khu Kanji, cờ này bật gợi ý "một từ dùng chữ đang hỏi".
      showHanViet: this.showHint(),
      // Các trường dưới đây thuộc về loại bài khác. PracticeConfig là một khối
      // thiết lập đầy đủ chứ không phải union theo loại bài, nên trường nào cũng
      // phải có giá trị.
      showGrammarHint: false,
      verbMode: 'masu-to-form',
      verbForms: ['te'],
      exercise: null,
      exerciseMode: 'to-transitive',
      kanjiMode: 'kanji-hanviet',
      radicalMode: 'radical-hanviet',
    };

    const questions = orderQuestions(buildKanjiHanVietQuestions(this.pool(), config), config);
    const lesson = { id: KANJI_SESSION_ID, name: this.lang.t('kanji.practiceHanViet') };
    if (this.session.start(lesson, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}
