import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import {
  KANJI_LEVELS,
  KANJI_LIST_MODES,
  KANJI_SESSION_ID,
  KanjiEntry,
  KanjiLevel,
  KanjiMode,
  emptyLevelCounts,
  kanjiModeInfo,
} from '../../core/kanji/kanji.model';
import { KANJI_ENTRIES } from '../../core/kanji/kanji-entries';
import { LIMIT_CHOICES_LONG, practiceConfig } from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildKanjiDrawQuestions, drawableKanji } from '../../core/practice/draw-questions';
import { buildKanjiHanVietQuestions } from '../../core/practice/kanji-questions';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { normalizeSearch } from '../../core/utils/lesson-search';
import { SearchBox } from '../../shared/search-box';
import { StarButton } from '../../shared/star-button';

/**
 * Tab "Kanji" — lưới chữ Hán theo cấp độ, kèm phần luyện "chữ Hán → âm Hán Việt".
 *
 * Vì sao phần luyện âm Hán Việt nằm ở ĐÂY chứ không ở màn hình một chữ: nó hỏi
 * trên cả danh sách. Mở từng chữ ra để luyện đúng một chữ thì mỗi phiên một câu.
 *
 * Phần luyện các TỪ của một chữ thì ngược lại, nằm ở `/kanji/:id` vì nó chỉ có
 * nghĩa trong phạm vi một chữ.
 *
 * Khung thiết lập, ô tìm và khối ★ đến từ `PracticeScreen`.
 */
@Component({
  selector: 'app-kanji-list',
  imports: [RouterLink, SearchBox, StarButton, T],
  templateUrl: './kanji-list.html',
  styleUrl: './kanji-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiList extends PracticeScreen {
  readonly allLevels = KANJI_LEVELS;
  readonly modes = KANJI_LIST_MODES;

  /** Chiều hỏi: đọc âm Hán Việt của chữ, hay viết ra chính chữ đó. */
  readonly mode = signal<KanjiMode>('kanji-hanviet');
  readonly isDrawing = computed(() => this.mode() === 'kanji-draw');

  /**
   * Cấp đang xem. Một cấp mỗi lần chứ không phải nhiều lựa chọn như khu Bài tập:
   * đây là bảng tra gần hai nghìn chữ, xem lẫn lộn hai cấp thì không còn biết mình
   * đang học phần nào.
   */
  readonly level = signal<KanjiLevel>('N5');

  protected favoriteSessionId(): string {
    return KANJI_SESSION_ID;
  }

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

  readonly favoriteCount = computed(() => this.favoritesOf(this.levelEntries()).length);

  readonly levelWordCount = computed(() =>
    this.levelEntries().reduce((total, entry) => total + entry.words.length, 0),
  );

  /** Lưới đang hiện: lọc theo ★ và theo từ khoá tìm. */
  readonly visibleEntries = computed<KanjiEntry[]>(() => {
    const base = this.onlyFavorites()
      ? this.favoritesOf(this.levelEntries())
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

  private readonly scopeEntries = computed<KanjiEntry[]>(() =>
    this.scope() === 'favorite'
      ? this.favoritesOf(this.levelEntries())
      : this.levelEntries(),
  );

  /** KanjiVG thiếu nét của vài chữ hiếm — chiều viết chữ phải bỏ chúng ra. */
  readonly pool = computed<KanjiEntry[]>(() =>
    this.isDrawing() ? drawableKanji(this.scopeEntries()) : this.scopeEntries(),
  );

  /** Số chữ bị loại khỏi phiên viết vì chưa có dữ liệu nét. */
  readonly missingStrokeCount = computed(() =>
    this.isDrawing() ? this.scopeEntries().length - this.pool().length : 0,
  );

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.pool().length : Math.min(limit, this.pool().length);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES_LONG.filter((limit) => limit < this.pool().length),
  );

  readonly modeShort = computed(() => this.lang.t(kanjiModeInfo(this.mode()).shortKey));

  // --- Sự kiện ---

  setLevel(level: KanjiLevel): void {
    this.level.set(level);
    this.questionLimit.set(null);
    // Cấp mới có thể chưa đánh dấu ★ chữ nào.
    this.fixScope();
  }

  setMode(mode: KanjiMode): void {
    this.mode.set(mode);
    // Đổi chiều hỏi là đổi số chữ hỏi được (chiều viết bỏ chữ thiếu nét), nên con
    // số câu vừa chọn không còn nghĩa.
    this.questionLimit.set(null);
  }

  // --- Bắt đầu ---

  start(): void {
    if (!this.canStart()) return;

    const drawing = this.isDrawing();
    const config = practiceConfig({
      lessonId: KANJI_SESSION_ID,
      lessonKind: 'kanji',
      scope: this.scope(),
      answerMode: drawing ? 'draw' : 'typing',
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      // Ở khu Kanji, cờ này bật gợi ý "một từ dùng chữ đang hỏi"; ở chiều viết chữ
      // thì nó bật nét mẫu mờ để đồ theo.
      showHanViet: this.showHint(),
      kanjiMode: this.mode(),
    });

    this.launch(
      {
        id: KANJI_SESSION_ID,
        name: this.lang.t(drawing ? 'kanji.practiceDraw' : 'kanji.practiceHanViet'),
      },
      config,
      orderQuestions(
        drawing
          ? buildKanjiDrawQuestions(this.pool(), config)
          : buildKanjiHanVietQuestions(this.pool(), config),
        config,
      ),
    );
  }
}
