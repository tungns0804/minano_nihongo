import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import { KANJI_LEVELS, KanjiLevel, emptyLevelCounts } from '../../core/kanji/kanji.model';
import { LIMIT_CHOICES_LONG, practiceConfig } from '../../core/models/practice.model';
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
import { PracticeScreen } from '../../core/screens/practice-screen';
import { normalizeSearch } from '../../core/utils/lesson-search';

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
 *
 * Khung thiết lập, ô tìm và khối ★ đến từ `PracticeScreen`.
 */
@Component({
  selector: 'app-radical-detail',
  imports: [RouterLink, T],
  templateUrl: './radical-detail.html',
  styleUrl: './radical-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadicalDetail extends PracticeScreen {
  private readonly route = inject(ActivatedRoute);

  readonly modes = RADICAL_KANJI_MODES;

  readonly radicalId = signal('');
  readonly entry = signal<RadicalEntry | null>(null);

  /** ★ lưu theo từng bộ: chữ của bộ 人 và chữ của bộ 木 là hai danh sách khác nhau. */
  protected favoriteSessionId(): string {
    return this.radicalId();
  }

  // --- Thiết lập riêng của khu Bộ thủ ---
  readonly levels = signal<KanjiLevel[]>([...KANJI_LEVELS]);
  readonly mode = signal<RadicalMode>('kanji-hanviet');

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
    const counts = emptyLevelCounts();
    for (const kanji of this.entry()?.kanji ?? []) counts[kanji.level]++;
    return counts;
  });

  /** Cấp nào bộ này thực sự có chữ — cấp rỗng thì không bày nút ra để bấm vào chỗ trống. */
  readonly availableLevels = computed<KanjiLevel[]>(() =>
    KANJI_LEVELS.filter((level) => this.levelCounts()[level] > 0),
  );

  readonly favoriteCount = computed(() => this.favoritesOf(this.levelKanji()).length);

  // --- Tập chữ sẽ đem ra hỏi ---

  readonly pool = computed<RadicalKanji[]>(() =>
    this.scope() === 'favorite' ? this.favoritesOf(this.levelKanji()) : this.levelKanji(),
  );

  readonly plannedQuestionCount = computed(() => {
    const total = radicalQuestionCount(this.pool(), this.mode());
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() => {
    const total = radicalQuestionCount(this.pool(), this.mode());
    return LIMIT_CHOICES_LONG.filter((limit) => limit < total);
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
    const base = this.onlyFavorites() ? this.favoritesOf(this.levelKanji()) : this.levelKanji();

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
    super();
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

  // --- Bắt đầu ---

  start(): void {
    const entry = this.entry();
    if (!entry || !this.canStart()) return;

    const config = practiceConfig({
      lessonId: entry.id,
      lessonKind: 'radical',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      // Đáp án của cả hai chiều đều là âm Hán Việt (chữ Latin) nên tuỳ chọn này
      // có tác dụng ở cả hai.
      ignoreDiacritics: this.ignoreDiacritics(),
      // Ở khu Bộ thủ, cờ này bật gợi ý đổi theo chiều hỏi — xem `radical-questions.ts`.
      showHanViet: this.showHint(),
      radicalMode: this.mode(),
    });

    this.launch(
      { id: entry.id, name: `${entry.char} ${entry.hanViet}` },
      config,
      orderQuestions(buildRadicalKanjiQuestions(this.pool(), entry, config), config),
    );
  }
}
