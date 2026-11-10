import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import type { MessageKey } from '../../core/i18n/messages';
import {
  ON_KUN_MODES,
  OnKunMode,
  onKunFavoriteKey,
  onKunModeInfo,
  onKunQuestionCount,
} from '../../core/kanji/onkun.model';
import type { ExampleSound, LessonKanji } from '../../core/kanji/onkun.model';
import type { Lesson } from '../../core/lessons/vocabulary.model';
import { batchCount, batchRange } from '../../core/practice/batch';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildOnKunQuestions } from '../../core/practice/onkun-questions';
import {
  AnswerMode,
  CHOICE_COUNT,
  LIMIT_CHOICES,
  PracticeScope,
  practiceConfig,
} from '../../core/practice/practice.model';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { checkedOf } from '../../core/utils/dom-events';
import { PracticeSetup } from '../../shared/practice-setup';
import { StarButton } from '../../shared/star-button';

/** Mặc định khi mở bài: mỗi phiên 20 câu, đi theo cụm đúng thứ tự chữ trong bài. */
const DEFAULT_LIMIT = 20;

const SOUND_KEY: Record<ExampleSound, MessageKey> = {
  on: 'onkun.sound.on',
  kun: 'onkun.sound.kun',
  special: 'onkun.sound.special',
};

/**
 * Khối "Chữ Hán trong bài" của bài từ vựng N3: thẻ học từng chữ (âm On, âm Kun, các từ
 * của bài dùng chữ đó) và khung luyện nhớ âm.
 *
 * Tách khỏi `LessonDetail` vì nó có khung thiết lập RIÊNG — phạm vi là các CHỮ, ★ là
 * "chữ chưa nhớ âm" — chen vào khung của bảng từ thì mọi con số của khung đó phải đổi
 * nghĩa theo một công tắc. Kế thừa `PracticeScreen` như mọi khung thiết lập khác; khoá
 * ★ là `onKunFavoriteKey` của bài, không phải id bài (xem chú thích ở đó).
 *
 * Phiên luyện mang `lessonKind: 'vocabulary'` và id bài, nên màn kết quả, "học cụm sau"
 * và nút quay lại đều về đúng trang bài này.
 */
@Component({
  selector: 'app-lesson-kanji',
  imports: [PracticeSetup, RouterLink, StarButton, T],
  templateUrl: './lesson-kanji.html',
  styleUrl: './lesson-kanji.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonKanjiStudy extends PracticeScreen {
  readonly lesson = input.required<Lesson>();
  readonly kanji = input.required<readonly LessonKanji[]>();

  readonly modes = ON_KUN_MODES;
  readonly mode = signal<OnKunMode>('onkun-reading');
  readonly answerMode = signal<AnswerMode>('choice');
  /** Cụm đang chọn, chưa kiểm tra còn hợp lệ — đọc qua `batchIndex` (như ở bảng từ). */
  private readonly pickedBatch = signal<number | null>(0);

  /** Che âm đọc trên thẻ để tự kiểm tra; `revealed` là các thẻ đã bấm mở. */
  readonly masked = signal(false);
  private readonly revealed = signal<ReadonlySet<string>>(new Set());

  protected favoriteSessionId(): string {
    return onKunFavoriteKey(this.lesson().id);
  }

  readonly favoriteCount = computed(() => this.favoritesOf(this.kanji()).length);

  readonly pool = computed(() =>
    this.scope() === 'favorite' ? this.favoritesOf(this.kanji()) : this.kanji(),
  );

  readonly totalQuestionCount = computed(() => onKunQuestionCount(this.pool(), this.mode()));

  readonly batchTotal = computed(() => batchCount(this.totalQuestionCount(), this.questionLimit()));

  readonly batchIndex = computed<number | null>(() => {
    const picked = this.pickedBatch();
    return picked !== null && picked < this.batchTotal() ? picked : null;
  });

  readonly batchOptions = computed(() => {
    const limit = this.questionLimit();
    const total = this.totalQuestionCount();
    if (limit === null) return [];
    return Array.from({ length: this.batchTotal() }, (_, index) => ({
      index,
      ...batchRange(total, limit, index),
    }));
  });

  readonly plannedQuestionCount = computed(() => {
    const total = this.totalQuestionCount();
    const limit = this.questionLimit();
    if (limit === null) return total;
    const batch = this.batchIndex();
    return batch === null ? Math.min(limit, total) : Math.min(limit, total - batch * limit);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);
  readonly limitChoices = computed(() => LIMIT_CHOICES.filter((limit) => limit < this.totalQuestionCount()));
  readonly modeShort = computed(() => this.lang.t(onKunModeInfo(this.mode()).shortKey));
  /** Câu bốn lựa chọn chỉ có ba lượt sai — dòng tóm tắt phải nói đúng con số đó. */
  readonly planMax = computed(() =>
    this.answerMode() === 'choice' ? Math.min(this.maxWrongAttempts, CHOICE_COUNT - 1) : this.maxWrongAttempts,
  );

  constructor() {
    super();
    // Âm Hán Việt là mốc nhớ chính của người học tiếng Việt — bật sẵn như ở bảng từ.
    this.showHint.set(true);
    this.questionLimit.set(DEFAULT_LIMIT);
  }

  // ── Thẻ chữ ─────────────────────────────────────────────────────────────

  soundKey(sound: ExampleSound): MessageKey {
    return SOUND_KEY[sound];
  }

  /** Từ chia ba khúc quanh lần gặp đầu của chữ, để tô chữ đang xem trong từ. */
  wordParts(word: string, char: string): readonly [string, string, string] {
    const at = word.indexOf(char);
    return at < 0 ? [word, '', ''] : [word.slice(0, at), char, word.slice(at + char.length)];
  }

  isHidden(item: LessonKanji): boolean {
    return this.masked() && !this.revealed().has(item.id);
  }

  toggleMask(event: Event): void {
    this.masked.set(checkedOf(event));
    this.revealed.set(new Set());
  }

  reveal(item: LessonKanji): void {
    if (!this.masked()) return;
    const next = new Set(this.revealed());
    if (next.has(item.id)) next.delete(item.id);
    else next.add(item.id);
    this.revealed.set(next);
  }

  // ── Khung thiết lập ─────────────────────────────────────────────────────

  setMode(mode: OnKunMode): void {
    this.mode.set(mode);
    this.pickedBatch.set(this.questionLimit() === null ? null : 0);
  }

  setAnswerMode(mode: AnswerMode): void {
    this.answerMode.set(mode);
  }

  /** Đổi số câu là chia lại bài: cụm 3 của "10 câu" không phải cụm 3 của "20 câu". */
  override setQuestionLimit(limit: number | null): void {
    super.setQuestionLimit(limit);
    this.pickedBatch.set(limit === null ? null : 0);
  }

  override setScope(scope: PracticeScope): void {
    super.setScope(scope);
    this.pickedBatch.set(null);
  }

  setBatchIndex(index: number | null): void {
    this.pickedBatch.set(index);
  }

  start(): void {
    if (!this.canStart()) return;
    const lesson = this.lesson();
    const config = practiceConfig({
      lessonId: lesson.id,
      lessonKind: 'vocabulary',
      scope: this.scope(),
      answerMode: this.answerMode(),
      questionLimit: this.questionLimit(),
      batchIndex: this.batchIndex(),
      shuffle: this.shuffleQuestions(),
      showHanViet: this.showHint(),
      onKunMode: this.mode(),
    });
    this.launch(
      { id: lesson.id, name: lesson.name },
      config,
      orderQuestions(buildOnKunQuestions(this.pool(), this.kanji(), config), config),
    );
  }
}
