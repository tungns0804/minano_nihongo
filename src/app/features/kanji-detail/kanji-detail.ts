import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import {
  KANJI_LEVELS,
  KANJI_WORD_MODES,
  KanjiEntry,
  KanjiLevel,
  KanjiMode,
  KanjiWord,
  emptyLevelCounts,
  kanjiModeInfo,
  kanjiQuestionsPerItem,
} from '../../core/kanji/kanji.model';
import { kanjiById } from '../../core/kanji/kanji-entries';
import { LIMIT_CHOICES, practiceConfig } from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildKanjiWordQuestions } from '../../core/practice/kanji-questions';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { normalizeSearch } from '../../core/utils/lesson-search';

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
 *
 * Khung thiết lập, ô tìm và khối ★ đến từ `PracticeScreen`.
 */
@Component({
  selector: 'app-kanji-detail',
  imports: [RouterLink, T],
  templateUrl: './kanji-detail.html',
  styleUrl: './kanji-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiDetail extends PracticeScreen {
  private readonly route = inject(ActivatedRoute);

  readonly modes = KANJI_WORD_MODES;

  readonly kanjiId = signal('');
  readonly entry = signal<KanjiEntry | null>(null);

  /** ★ lưu theo từng chữ: từ của 会 và từ của 社 là hai danh sách khác nhau. */
  protected favoriteSessionId(): string {
    return this.kanjiId();
  }

  // --- Thiết lập riêng của khu Kanji ---
  readonly levels = signal<KanjiLevel[]>([...KANJI_LEVELS]);
  readonly mode = signal<KanjiMode>('word-meaning');

  readonly notFound = computed(() => this.entry() === null);
  /**
   * Chữ có trong danh sách JLPT nhưng kho từ chưa có từ nào dùng nó. Vẫn hiện
   * chữ và âm Hán Việt (luyện âm ở màn danh sách vẫn hỏi tới nó), chỉ là chưa
   * luyện từ được.
   */
  readonly hasNoWords = computed(() => (this.entry()?.words.length ?? 0) === 0);
  readonly currentMode = computed(() => kanjiModeInfo(this.mode()));
  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));

  /** Tất cả cách đọc của chữ, gộp thành một chuỗi để hiện ở đầu trang. */
  readonly readings = computed(() => {
    const entry = this.entry();
    if (!entry) return '';
    return [entry.hanViet, ...entry.altHanViet].filter(Boolean).join(' / ');
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
    const counts = emptyLevelCounts();
    for (const word of this.entry()?.words ?? []) counts[word.level]++;
    return counts;
  });

  /** Cấp nào chữ này thực sự có từ — cấp rỗng thì không bày nút ra để bấm vào chỗ trống. */
  readonly availableLevels = computed<KanjiLevel[]>(() =>
    KANJI_LEVELS.filter((level) => this.levelCounts()[level] > 0),
  );

  readonly favoriteCount = computed(() => this.favoritesOf(this.levelWords()).length);

  // --- Tập từ sẽ đem ra hỏi ---

  readonly pool = computed<KanjiWord[]>(() =>
    this.scope() === 'favorite' ? this.favoritesOf(this.levelWords()) : this.levelWords(),
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
    const base = this.onlyFavorites() ? this.favoritesOf(this.levelWords()) : this.levelWords();

    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;

    return base.filter((word) =>
      normalizeSearch(
        `${word.japanese} ${word.reading} ${word.hanViet} ${word.meaning}`,
      ).includes(keyword),
    );
  });

  constructor() {
    super();
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

  // --- Bắt đầu ---

  start(): void {
    const entry = this.entry();
    if (!entry || !this.canStart()) return;

    const config = practiceConfig({
      lessonId: entry.id,
      lessonKind: 'kanji',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      // Chỉ có tác dụng ở chiều hỏi nghĩa (đáp án tiếng Việt); chiều hỏi hiragana
      // thì đáp án là kana nên tuỳ chọn này không đụng tới nó.
      ignoreDiacritics: this.ignoreDiacritics(),
      // Ở khu Kanji, cờ này bật gợi ý âm Hán Việt của cả từ.
      showHanViet: this.showHint(),
      kanjiMode: this.mode(),
    });

    this.launch(
      { id: entry.id, name: `${entry.char} ${entry.hanViet}` },
      config,
      orderQuestions(buildKanjiWordQuestions(this.pool(), entry, config), config),
    );
  }
}
