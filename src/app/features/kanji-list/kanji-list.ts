import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  KANJI_LEVELS,
  KanjiLevel,
  RADICAL_MODE,
  RADICAL_SESSION_ID,
  Radical,
} from '../../core/kanji/kanji.model';
import { RADICALS } from '../../core/kanji/radicals';
import {
  DEFAULT_MAX_WRONG_ATTEMPTS,
  PracticeConfig,
  PracticeScope,
} from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildRadicalQuestions } from '../../core/practice/kanji-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { normalizeSearch } from '../../core/utils/lesson-search';

/** Các mốc số câu cho phép chọn nhanh, giống mọi màn hình thiết lập khác. */
const LIMIT_CHOICES = [10, 20, 30, 50] as const;

/**
 * Tab "Kanji" — danh sách bộ thủ, kèm phần luyện "bộ thủ → âm Hán Việt".
 *
 * Vì sao phần luyện bộ thủ nằm ở ĐÂY chứ không ở màn hình một bộ: nó hỏi trên cả
 * danh sách. Mở từng bộ ra để luyện đúng một chữ thì mỗi phiên chỉ có một câu.
 *
 * Phần luyện các TỪ của một bộ thì ngược lại, nằm ở `/kanji/:id` vì nó chỉ có
 * nghĩa trong phạm vi một bộ.
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
  readonly radicalMode = RADICAL_MODE;

  // --- Bộ lọc ---
  readonly levels = signal<KanjiLevel[]>([...KANJI_LEVELS]);
  readonly search = signal('');
  readonly onlyFavorites = signal(false);

  // --- Thiết lập luyện tập ---
  readonly scope = signal<PracticeScope>('all');
  readonly questionLimit = signal<number | null>(null);
  readonly shuffleQuestions = signal(true);
  readonly ignoreDiacritics = signal(false);

  /** Đọc qua signal của FavoriteStore để danh sách tự cập nhật khi bấm sao. */
  private readonly favoriteIds = computed(() => {
    void this.favoriteStore.counts();
    return new Set(this.favoriteStore.idsOf(RADICAL_SESSION_ID));
  });

  private readonly levelSet = computed(() => new Set(this.levels()));

  /**
   * Số bộ của từng cấp, tính trên TOÀN BỘ dữ liệu chứ không trừ đi cấp đang chọn:
   * con số trên nút phải đứng yên khi bật tắt các cấp.
   */
  readonly levelCounts = computed<Record<KanjiLevel, number>>(() => {
    const counts = { N5: 0, N4: 0, N3: 0 } as Record<KanjiLevel, number>;
    for (const radical of RADICALS) counts[radical.level]++;
    return counts;
  });

  /** Bộ thủ trong các cấp đang chọn — cũng là tập đem ra hỏi khi phạm vi là "Toàn bộ". */
  readonly levelRadicals = computed<Radical[]>(() =>
    RADICALS.filter((radical) => this.levelSet().has(radical.level)),
  );

  readonly favoriteCount = computed(
    () => this.levelRadicals().filter((radical) => this.favoriteIds().has(radical.id)).length,
  );

  /**
   * Số chữ và số từ của các cấp ĐANG CHỌN, không phải của toàn bộ dữ liệu: ba con
   * số ở đầu trang đứng cạnh nhau nên phải cùng nói về một phạm vi, nếu không lọc
   * xuống còn một bộ mà vẫn thấy "1780 từ" thì con số đó chỉ gây hiểu nhầm.
   */
  readonly levelKanjiCount = computed(() =>
    this.levelRadicals().reduce((total, radical) => total + radical.kanjiList.length, 0),
  );

  readonly levelWordCount = computed(() =>
    this.levelRadicals().reduce((total, radical) => total + radical.words.length, 0),
  );

  /** Danh sách hiện trên lưới: lọc theo cấp, theo ★ và theo từ khoá tìm. */
  readonly visibleRadicals = computed<Radical[]>(() => {
    const base = this.onlyFavorites()
      ? this.levelRadicals().filter((radical) => this.favoriteIds().has(radical.id))
      : this.levelRadicals();

    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;

    return base.filter((radical) =>
      normalizeSearch(
        `${radical.glyph} ${radical.variants.join(' ')} ${radical.hanViet} ${radical.meaning} ` +
          radical.kanjiList.map((item) => item.char).join(' '),
      ).includes(keyword),
    );
  });

  // --- Tập bộ thủ sẽ đem ra hỏi ---

  readonly pool = computed<Radical[]>(() =>
    this.scope() === 'favorite'
      ? this.levelRadicals().filter((radical) => this.favoriteIds().has(radical.id))
      : this.levelRadicals(),
  );

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.pool().length : Math.min(limit, this.pool().length);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter((limit) => limit < this.pool().length),
  );

  readonly modeShort = computed(() => this.lang.t(RADICAL_MODE.shortKey));

  // --- Sự kiện ---

  isLevelSelected(level: KanjiLevel): boolean {
    return this.levels().includes(level);
  }

  toggleLevel(level: KanjiLevel): void {
    const current = this.levels();
    // Luôn phải còn ít nhất một cấp: bỏ hết thì lưới trống trơn mà không rõ vì sao.
    if (current.includes(level) && current.length === 1) return;

    const next = current.includes(level)
      ? current.filter((item) => item !== level)
      : [...current, level];
    // Giữ đúng thứ tự N5 → N3 để nút không nhảy chỗ theo thứ tự bấm.
    this.levels.set(KANJI_LEVELS.filter((item) => next.includes(item)));
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
      lessonKind: 'kanji',
      scope: this.scope(),
      // Khu Kanji không có trắc nghiệm, xem `kanji.typingOnly`.
      answerMode: 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      maxWrongAttempts: DEFAULT_MAX_WRONG_ATTEMPTS,
      ignoreDiacritics: this.ignoreDiacritics(),
      // Các trường dưới đây thuộc về loại bài khác. PracticeConfig là một khối
      // thiết lập đầy đủ chứ không phải union theo loại bài, nên trường nào cũng
      // phải có giá trị.
      direction: 'jp-vi',
      showHanViet: false,
      showGrammarHint: false,
      verbMode: 'masu-to-form',
      verbForms: ['te'],
      exercise: null,
      exerciseMode: 'to-transitive',
      kanjiMode: 'radical-hanviet',
    };

    const questions = orderQuestions(buildRadicalQuestions(this.pool(), config), config);
    const lesson = { id: RADICAL_SESSION_ID, name: this.lang.t('kanji.practiceRadical') };
    if (this.session.start(lesson, config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }
}
