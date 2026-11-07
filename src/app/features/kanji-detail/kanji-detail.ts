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
import { KANJI_ENTRIES, kanjiById, kanjiInTexts } from '../../core/kanji/kanji-entries';
import {
  compositionTree,
  directParts,
  kanjiUsing,
  ownRadical,
} from '../../core/kanji/kanji-composition';
import { LessonStore } from '../../core/lessons/lesson-store';
import type { VocabularyWord } from '../../core/lessons/vocabulary.model';
import { PATH, itemPath, lessonPath } from '../../core/paths';
import { LIMIT_CHOICES, practiceConfig } from '../../core/practice/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildKanjiDrawQuestions } from '../../core/practice/draw-questions';
import { buildKanjiWordQuestions } from '../../core/practice/kanji-questions';
import { canDraw } from '../../core/strokes/stroke-store';
import { StrokePathStore } from '../../core/strokes/stroke-path-store';
import { strokesFromPaths } from '../../core/strokes/stroke-path';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { checkedOf } from '../../core/utils/dom-events';
import { normalizeSearch } from '../../core/lessons/lesson-search';
import { DrawPad } from '../../shared/draw-pad';
import { SearchBox } from '../../shared/search-box';
import { StarButton } from '../../shared/star-button';
import { StrokeOrder } from '../../shared/stroke-order';
import { PracticeSetup } from '../../shared/practice-setup';
import { PagerItem, SiblingPager } from '../../shared/sibling-pager';
import { CompositionTree } from './composition-tree';

/**
 * Bài học đang dẫn người học tới chữ này (`/kanji/:id?bai=<id bài>`).
 * Link cũ ghi `?lesson=` vẫn được đọc.
 *
 * Có nó thì nút quay lại trỏ về bài, "chữ trước / chữ sau" lật theo thứ tự chữ
 * trong bài, và đầu trang nhắc lại những từ của bài có dùng chữ đang xem.
 */
interface LessonContext {
  id: string;
  /** Trang của bài, cho nút quay lại. */
  path: string;
  name: string;
  words: readonly VocabularyWord[];
  kanji: readonly KanjiEntry[];
}

/**
 * Số chữ "có chứa chữ này" hiện sẵn. 日 hay 口 nằm trong cả trăm chữ — bày hết ra
 * thì phần cấu tạo dài hơn mọi thứ khác trên trang.
 */
const USERS_PREVIEW = 24;

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
  imports: [
    CompositionTree,
    DrawPad,
    PracticeSetup,
    RouterLink,
    SearchBox,
    SiblingPager,
    StarButton,
    StrokeOrder,
    T,
  ],
  templateUrl: './kanji-detail.html',
  styleUrl: './kanji-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiDetail extends PracticeScreen {
  private readonly route = inject(ActivatedRoute);
  private readonly lessonStore = inject(LessonStore);
  private readonly strokePaths = inject(StrokePathStore);

  readonly modes = KANJI_WORD_MODES;

  readonly kanjiId = signal('');
  readonly entry = signal<KanjiEntry | null>(null);

  /** Bài đang dẫn tới chữ này; null khi mở từ danh sách Kanji như mọi khi. */
  readonly lessonContext = signal<LessonContext | null>(null);
  private lessonRequest = '';

  /** Trang của một chữ Hán khác — chip "chữ có chứa chữ này", dãy chữ trước / sau. */
  kanjiPath(id: string): string {
    return itemPath(PATH.kanji, id);
  }

  /**
   * Dãy của "chữ trước / chữ sau".
   *
   * Đi từ một bài sang thì lật theo đúng các chữ của bài đó — học xong 滑 thì chữ
   * sau là 積 của từ kế tiếp, không phải chữ kế tiếp trong bảng N2. Bấm sang một
   * thành phần không thuộc bài (然 của 燃) thì quay về dãy cùng cấp như thường.
   */
  readonly pagerItems = computed<PagerItem[]>(() => {
    const entry = this.entry();
    const lesson = this.lessonContext();
    if (lesson && entry && lesson.kanji.some((item) => item.id === entry.id)) {
      return lesson.kanji.map((item) => ({
        key: item.id,
        name: `${item.char} ${item.hanViet}`,
        path: this.kanjiPath(item.id),
        query: { bai: lesson.id },
      }));
    }

    const level = entry?.level;
    return KANJI_ENTRIES.filter((item) => item.level === level).map((item) => ({
      key: item.id,
      name: `${item.char} ${item.hanViet}`,
      path: this.kanjiPath(item.id),
    }));
  });

  /** Từ của bài đang dẫn tới có dùng chữ này — 積 thì 積もる, 積む của bài 5. */
  readonly lessonWords = computed<readonly VocabularyWord[]>(() => {
    const char = this.entry()?.char;
    const lesson = this.lessonContext();
    if (!char || !lesson) return [];
    return lesson.words.filter((word) => word.japanese.includes(char));
  });

  // --- Cấu tạo chữ ---

  /** Cây cấu tạo; null với chữ độc thể (日, 手). */
  readonly tree = computed(() => {
    const entry = this.entry();
    return entry ? compositionTree(entry) : null;
  });

  /** Tầng ngoài cùng của cây — dòng "Cấu tạo" ngắn ở đầu trang. */
  readonly parts = computed(() => {
    const entry = this.entry();
    return entry ? directParts(entry.char) : [];
  });

  /** Chữ này chính là một bộ thủ (手, 日) — khi đó đầu trang dẫn sang trang của bộ. */
  readonly radical = computed(() => {
    const entry = this.entry();
    return entry ? ownRadical(entry.char) : null;
  });

  /** Những chữ ghép trực tiếp từ chữ này — 寺 thì 時, 持, 待… */
  readonly users = computed(() => {
    const entry = this.entry();
    return entry ? kanjiUsing(entry.char) : [];
  });

  readonly showAllUsers = signal(false);
  readonly visibleUsers = computed(() =>
    this.showAllUsers() ? this.users() : this.users().slice(0, USERS_PREVIEW),
  );
  readonly hiddenUserCount = computed(() => this.users().length - this.visibleUsers().length);

  // --- Cách viết ---

  /**
   * Đường nét gốc của chữ đang mở (xem `stroke-path.ts`); rỗng khi nhóm chưa về.
   *
   * Đọc `version()` trước để computed chạy lại ngay khi nhóm tải xong.
   */
  readonly paths = computed<readonly string[]>(() => {
    void this.strokePaths.version();
    const entry = this.entry();
    return entry ? (this.strokePaths.pathsOf(entry.char) ?? []) : [];
  });

  /**
   * Nét để CHẤM ô viết thử, rút thẳng từ đường gốc ở trên — trang này nhờ vậy không
   * phải tải cả bảng chấm ~280 kB nén của màn luyện, chỉ tải nhóm đường của đúng cấp
   * chữ đang mở. Kết quả khớp bảng chấm tới từng nấc làm tròn (`verify:drawing`).
   */
  readonly strokes = computed(() => strokesFromPaths(this.paths()));

  /** ★ lưu theo từng chữ: từ của 会 và từ của 社 là hai danh sách khác nhau. */
  protected favoriteSessionId(): string {
    return this.kanjiId();
  }

  // --- Thiết lập riêng của khu Kanji ---
  readonly levels = signal<KanjiLevel[]>([...KANJI_LEVELS]);
  readonly mode = signal<KanjiMode>('word-meaning');

  readonly notFound = computed(() => this.entry() === null);

  /** Chữ đang mở dưới dạng mảng một phần tử — để template khoá phần thân theo chữ. */
  readonly shownEntry = computed<KanjiEntry[]>(() => {
    const entry = this.entry();
    return entry ? [entry] : [];
  });
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

  /** Chữ này có dữ liệu nét để luyện viết không — KanjiVG thiếu vài chữ hiếm. */
  readonly canDrawChar = computed(() => {
    const entry = this.entry();
    return !!entry && canDraw(entry.char);
  });

  /**
   * Hiện nét mẫu mờ trong khung viết.
   *
   * Signal riêng chứ không dùng `showHint` của lớp cha: `showHint` ở màn hình này
   * đang là "gợi ý âm Hán Việt" của phần luyện TỪ, hai khối thiết lập nằm cạnh
   * nhau mà dùng chung một công tắc thì bật cái này lại đổi cái kia.
   */
  readonly drawGuide = signal(true);

  toggleDrawGuide(event: Event): void {
    this.drawGuide.set(checkedOf(event));
  }

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
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      void this.loadLesson(params.get('bai') ?? params.get('lesson') ?? '');
    });
  }

  /**
   * Nạp bài đang dẫn tới chữ này. Lật sang chữ khác trong cùng bài thì không nạp
   * lại — `LessonStore` có nhớ bài, nhưng dựng lại dãy chữ của cả bài thì không cần.
   */
  private async loadLesson(lessonId: string): Promise<void> {
    if (lessonId === this.lessonRequest) return;
    this.lessonRequest = lessonId;
    if (!lessonId) {
      this.lessonContext.set(null);
      return;
    }

    const lesson = await this.lessonStore.getLesson(lessonId);
    // Người học đã lật đi chỗ khác trong lúc chờ: kết quả này không còn là của trang nữa.
    if (this.lessonRequest !== lessonId) return;
    if (!lesson || lesson.words.length === 0) {
      this.lessonContext.set(null);
      return;
    }

    this.lessonContext.set({
      id: lesson.id,
      path: lessonPath(lesson.kind, lesson.id),
      name: lesson.name,
      words: lesson.words,
      kanji: kanjiInTexts(lesson.words.map((word) => word.japanese)),
    });
  }

  private load(id: string): void {
    const entry = kanjiById(id);
    this.entry.set(entry);
    if (!entry) return;
    this.labelPage(entry.hanViet ? `${entry.char} · ${entry.hanViet}` : entry.char);

    // Đường nét nằm ở gói tải riêng theo cấp (15–290 kB nén) — chỉ tải nhóm của chữ
    // đang mở, và mỗi nhóm một lần: lật sang chữ cùng cấp thì không tải gì thêm.
    if (canDraw(entry.char)) void this.strokePaths.loadFor(entry.char);
    this.showAllUsers.set(false);

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

  /**
   * Luyện viết đúng chữ đang mở — một câu, mở thẳng từ đầu trang.
   *
   * Không đi qua khung thiết lập như phần luyện từ: cả trang này nói về đúng một
   * chữ, mà chữ đó lại đang vẽ to ngay trên đầu trang — chỉ còn đúng một thứ để
   * chọn là có đồ theo nét mẫu hay không.
   */
  startDrawing(): void {
    const entry = this.entry();
    if (!entry || !this.canDrawChar()) return;

    const config = practiceConfig({
      lessonId: entry.id,
      lessonKind: 'kanji',
      scope: 'single',
      answerMode: 'draw',
      showHanViet: this.drawGuide(),
      kanjiMode: 'kanji-draw',
    });

    this.launch(
      { id: entry.id, name: `${entry.char} ${entry.hanViet}` },
      config,
      orderQuestions(buildKanjiDrawQuestions([entry], config), config),
    );
  }
}
