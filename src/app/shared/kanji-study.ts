import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { T } from '../core/i18n/t';
import type { MessageKey } from '../core/i18n/messages';
import {
  ON_KUN_MODES,
  OnKunMode,
  onKunFavoriteKey,
  onKunModeInfo,
  onKunPool,
  onKunQuestionCount,
} from '../core/kanji/onkun.model';
import type { ExampleSound, LessonKanji } from '../core/kanji/onkun.model';
import { batchCount, batchRange } from '../core/practice/batch';
import { orderQuestions } from '../core/practice/build-questions';
import { buildOnKunQuestions } from '../core/practice/onkun-questions';
import {
  AnswerMode,
  CHOICE_COUNT,
  LIMIT_CHOICES,
  PracticeScope,
  practiceConfig,
} from '../core/practice/practice.model';
import { PracticeScreen } from '../core/screens/practice-screen';
import { checkedOf } from '../core/utils/dom-events';
import { PracticeSetup } from './practice-setup';
import { StarButton } from './star-button';

/** Mặc định: mỗi phiên 20 câu, đi theo cụm đúng thứ tự chữ. */
const DEFAULT_LIMIT = 20;

const SOUND_KEY: Record<ExampleSound, MessageKey> = {
  on: 'onkun.sound.on',
  kun: 'onkun.sound.kun',
  special: 'onkun.sound.special',
};

/**
 * Phiên luyện của khối này thuộc về đâu — quyết định màn kết quả và nút quay lại đưa về
 * trang nào.
 *  - `lesson`:   một bài từ vựng (`lessonKind: 'vocabulary'`, id bài) — về trang bài.
 *  - `exercise`: một trang bài tập riêng (`lessonKind: 'exercise'`), như tab Kanji ›
 *                Âm On/Kun — về trang đó qua `EXERCISE_PAGE` ở `core/paths.ts`.
 */
export interface StudyTarget {
  id: string;
  name: string;
  kind: 'lesson' | 'exercise';
}

/**
 * Thẻ học âm On / Kun / Hán Việt của từng chữ, cộng khung luyện nhớ âm và viết chữ. Dùng ở
 * khối "Chữ Hán trong bài" của bài từ vựng N3 và ở tab Kanji › Âm On/Kun.
 *
 * Là một khối riêng chứ không chen vào khung thiết lập của bảng từ: phạm vi ở đây là CHỮ,
 * ★ là "chữ chưa nhớ âm" — chen vào thì mọi con số của khung kia phải đổi nghĩa theo một
 * công tắc. Kế thừa `PracticeScreen` như mọi khung thiết lập khác; khoá ★ là
 * `onKunFavoriteKey` của đích, không phải id bài (xem chú thích ở đó).
 */
@Component({
  selector: 'app-kanji-study',
  imports: [PracticeSetup, RouterLink, StarButton, T],
  templateUrl: './kanji-study.html',
  styleUrl: './kanji-study.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiStudy extends PracticeScreen {
  readonly target = input.required<StudyTarget>();
  readonly kanji = input.required<readonly LessonKanji[]>();
  readonly titleKey = input<MessageKey>('lesson.kanji.title');
  readonly descKey = input<MessageKey>('lesson.kanji.desc');

  readonly modes = ON_KUN_MODES;
  readonly mode = signal<OnKunMode>('onkun-all');
  readonly answerMode = signal<AnswerMode>('choice');
  /** Cụm đang chọn, chưa kiểm tra còn hợp lệ — đọc qua `batchIndex` (như ở bảng từ). */
  private readonly pickedBatch = signal<number | null>(0);

  /** Che âm đọc trên thẻ để tự kiểm tra; `revealed` là các thẻ đã bấm mở. */
  readonly masked = signal(false);
  private readonly revealed = signal<ReadonlySet<string>>(new Set());

  protected favoriteSessionId(): string {
    return onKunFavoriteKey(this.target().id);
  }

  readonly favoriteCount = computed(() => this.favoritesOf(this.kanji()).length);

  /** ?bai= chỉ có nghĩa khi đi từ một bài: trang chữ quay về bài và lật "Chữ sau" theo bài. */
  readonly linkParams = computed(() =>
    this.target().kind === 'lesson' ? { bai: this.target().id } : null,
  );

  readonly isDrawing = computed(() => this.mode() === 'onkun-draw');
  /** Dạng có hỏi âm Hán Việt — mới cần "bỏ qua dấu" khi gõ. */
  readonly asksHanViet = computed(() => this.mode() === 'onkun-all' || this.mode() === 'onkun-hanviet');

  readonly pool = computed(() =>
    this.scope() === 'favorite' ? this.favoritesOf(this.kanji()) : this.kanji(),
  );
  /** Chữ bị bỏ khỏi dạng viết vì chưa có nét mẫu. */
  readonly missingStrokeCount = computed(() =>
    this.isDrawing() ? this.pool().length - onKunPool(this.pool(), 'onkun-draw').length : 0,
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
  /** Cách trả lời thật của phiên: dạng viết luôn là viết bằng chuột. */
  readonly sessionAnswerMode = computed<AnswerMode>(() => (this.isDrawing() ? 'draw' : this.answerMode()));
  readonly planAnswerKey = computed<MessageKey>(() => {
    const mode = this.sessionAnswerMode();
    return mode === 'draw' ? 'lesson.plan.draw' : mode === 'choice' ? 'lesson.plan.choice' : 'lesson.plan.typing';
  });
  /** Câu bốn lựa chọn chỉ có ba lượt sai — dòng tóm tắt phải nói đúng con số đó. */
  readonly planMax = computed(() =>
    this.sessionAnswerMode() === 'choice'
      ? Math.min(this.maxWrongAttempts, CHOICE_COUNT - 1)
      : this.maxWrongAttempts,
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
    const target = this.target();
    const config = practiceConfig({
      lessonId: target.id,
      lessonKind: target.kind === 'lesson' ? 'vocabulary' : 'exercise',
      scope: this.scope(),
      answerMode: this.sessionAnswerMode(),
      questionLimit: this.questionLimit(),
      batchIndex: this.batchIndex(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      showHanViet: this.showHint(),
      onKunMode: this.mode(),
    });
    this.launch(
      { id: target.id, name: target.name },
      config,
      orderQuestions(buildOnKunQuestions(this.pool(), this.kanji(), config), config),
    );
  }
}
