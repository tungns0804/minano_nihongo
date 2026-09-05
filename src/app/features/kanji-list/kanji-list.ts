import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

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
import { LIMIT_CHOICES_LONG, practiceConfig } from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildKanjiHanVietQuestions } from '../../core/practice/kanji-questions';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { normalizeSearch } from '../../core/utils/lesson-search';

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
  imports: [RouterLink, T],
  templateUrl: './kanji-list.html',
  styleUrl: './kanji-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiList extends PracticeScreen {
  readonly allLevels = KANJI_LEVELS;
  readonly hanVietMode = KANJI_HAN_VIET_MODE;

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

  readonly pool = computed<KanjiEntry[]>(() =>
    this.scope() === 'favorite'
      ? this.favoritesOf(this.levelEntries())
      : this.levelEntries(),
  );

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.pool().length : Math.min(limit, this.pool().length);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES_LONG.filter((limit) => limit < this.pool().length),
  );

  readonly modeShort = computed(() => this.lang.t(KANJI_HAN_VIET_MODE.shortKey));

  // --- Sự kiện ---

  setLevel(level: KanjiLevel): void {
    this.level.set(level);
    this.questionLimit.set(null);
    // Cấp mới có thể chưa đánh dấu ★ chữ nào.
    this.fixScope();
  }

  // --- Bắt đầu ---

  start(): void {
    if (!this.canStart()) return;

    const config = practiceConfig({
      lessonId: KANJI_SESSION_ID,
      lessonKind: 'kanji',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      // Ở khu Kanji, cờ này bật gợi ý "một từ dùng chữ đang hỏi".
      showHanViet: this.showHint(),
      kanjiMode: 'kanji-hanviet',
    });

    this.launch(
      { id: KANJI_SESSION_ID, name: this.lang.t('kanji.practiceHanViet') },
      config,
      orderQuestions(buildKanjiHanVietQuestions(this.pool(), config), config),
    );
  }
}
