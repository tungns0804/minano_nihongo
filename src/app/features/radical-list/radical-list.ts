import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import { LIMIT_CHOICES_LONG, practiceConfig } from '../../core/models/practice.model';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildRadicalHanVietQuestions } from '../../core/practice/radical-questions';
import {
  RADICAL_HAN_VIET_MODE,
  RADICAL_SESSION_ID,
  RadicalEntry,
  STROKE_GROUPS,
  StrokeGroup,
  strokeGroupOf,
} from '../../core/radical/radical.model';
import { RADICAL_ENTRIES } from '../../core/radical/radical-entries';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { normalizeSearch } from '../../core/utils/lesson-search';

/**
 * Tab "Bộ thủ" — lưới 214 bộ thủ theo số nét, kèm phần luyện "bộ thủ → âm Hán Việt".
 *
 * Dựng theo đúng lối của tab Kanji (`features/kanji-list`): lưới tra ở trên, khối
 * thiết lập luyện tập ở dưới, phiên luyện đi qua đúng màn hình luyện tập và màn
 * hình kết quả chung. Khác đúng hai chỗ: tab chia theo SỐ NÉT thay vì cấp JLPT, và
 * mở một ô ra thì thấy các CHỮ ghép từ bộ đó thay vì các TỪ dùng chữ đó.
 */
@Component({
  selector: 'app-radical-list',
  imports: [RouterLink, T],
  templateUrl: './radical-list.html',
  styleUrl: './radical-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadicalList extends PracticeScreen {
  readonly allGroups = STROKE_GROUPS;
  readonly strokeGroupOf = strokeGroupOf;
  readonly hanVietMode = RADICAL_HAN_VIET_MODE;
  readonly totalCount = RADICAL_ENTRIES.length;

  /**
   * Nhóm nét đang xem. Một nhóm mỗi lần, cùng lý do với tab Kanji: đây là bảng tra
   * 214 bộ, trộn hết vào một lưới thì không còn biết mình đang học phần nào.
   */
  readonly group = signal<StrokeGroup>('1-2');

  protected favoriteSessionId(): string {
    return RADICAL_SESSION_ID;
  }

  /** Số bộ của từng nhóm nét — con số trên nút, tính trên toàn bộ dữ liệu. */
  readonly groupCounts = computed<Record<StrokeGroup, number>>(() => {
    const counts = Object.fromEntries(STROKE_GROUPS.map((item) => [item, 0])) as Record<
      StrokeGroup,
      number
    >;
    for (const entry of RADICAL_ENTRIES) counts[strokeGroupOf(entry.strokes)]++;
    return counts;
  });

  /** Bộ của nhóm đang xem — cũng là tập đem ra hỏi khi phạm vi là "Toàn bộ". */
  readonly groupEntries = computed<RadicalEntry[]>(() =>
    RADICAL_ENTRIES.filter((entry) => strokeGroupOf(entry.strokes) === this.group()),
  );

  readonly favoriteCount = computed(() => this.favoritesOf(this.groupEntries()).length);

  readonly groupKanjiCount = computed(() =>
    this.groupEntries().reduce((total, entry) => total + entry.kanji.length, 0),
  );

  /** Đang gõ từ khoá — lúc này lưới bỏ qua ranh giới nhóm nét. */
  readonly isSearching = computed(() => normalizeSearch(this.search()).length > 0);

  /**
   * Lưới đang hiện: lọc theo ★ và theo từ khoá tìm.
   *
   * Có từ khoá thì tra trên CẢ 214 bộ chứ không riêng nhóm nét đang mở. Người đi
   * tra một bộ hiếm khi biết trước nó mấy nét — gõ 辶 rồi phải tự đoán xem mở tab
   * nào mới thấy thì ô tìm coi như không dùng được. Nhóm nét vẫn là cách xem mặc
   * định, chỉ tạm lui khi có từ khoá.
   */
  readonly visibleEntries = computed<readonly RadicalEntry[]>(() => {
    const keyword = normalizeSearch(this.search());
    const scope = keyword ? RADICAL_ENTRIES : this.groupEntries();
    const base = this.onlyFavorites() ? this.favoritesOf(scope) : scope;

    if (!keyword) return base;

    // Tìm cả trong các chữ ghép từ bộ: gõ "hưu" hay 休 phải ra được bộ 人 và 木.
    return base.filter((entry) =>
      normalizeSearch(
        `${entry.char} ${entry.variants.join(' ')} ${entry.hanViet} ${entry.meaning} ` +
          `${entry.japanese} ${entry.kanji.map((k) => `${k.char} ${k.hanViet}`).join(' ')}`,
      ).includes(keyword),
    );
  });

  /** Mẫu số của dòng "hiện x/y" — đi theo đúng phạm vi mà lưới đang tra. */
  readonly searchTotal = computed(() =>
    this.isSearching() ? RADICAL_ENTRIES.length : this.groupEntries().length,
  );

  // --- Tập bộ sẽ đem ra hỏi ---

  readonly pool = computed<RadicalEntry[]>(() =>
    this.scope() === 'favorite'
      ? this.favoritesOf(this.groupEntries())
      : this.groupEntries(),
  );

  readonly plannedQuestionCount = computed(() => {
    const limit = this.questionLimit();
    return limit === null ? this.pool().length : Math.min(limit, this.pool().length);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES_LONG.filter((limit) => limit < this.pool().length),
  );

  readonly modeShort = computed(() => this.lang.t(RADICAL_HAN_VIET_MODE.shortKey));

  // --- Sự kiện ---

  setGroup(group: StrokeGroup): void {
    this.group.set(group);
    this.questionLimit.set(null);
    // Nhóm nét mới có thể chưa đánh dấu ★ bộ nào.
    this.fixScope();
  }

  /**
   * Bấm vào số nét trên một ô kết quả: nhảy về nhóm nét của bộ đó và xoá từ khoá.
   *
   * Kết quả tìm nằm rải khắp bảy nhóm, nên sau khi thấy bộ mình cần thì người học
   * thường muốn xem luôn những bộ cùng số nét với nó — đây là đường về lưới thường.
   */
  goToGroupOf(entry: RadicalEntry): void {
    this.search.set('');
    this.setGroup(strokeGroupOf(entry.strokes));
  }

  // --- Bắt đầu ---

  start(): void {
    if (!this.canStart()) return;

    const config = practiceConfig({
      lessonId: RADICAL_SESSION_ID,
      lessonKind: 'radical',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      // Ở khu Bộ thủ, cờ này bật gợi ý "một chữ ghép từ bộ đang hỏi".
      showHanViet: this.showHint(),
      radicalMode: 'radical-hanviet',
    });

    this.launch(
      { id: RADICAL_SESSION_ID, name: this.lang.t('radical.practiceHanViet') },
      config,
      orderQuestions(buildRadicalHanVietQuestions(this.pool(), config), config),
    );
  }
}
