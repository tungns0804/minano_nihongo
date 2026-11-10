import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ExerciseMode, KANJI_QUIZ_MODES, exerciseModeInfo } from '../../core/exercises/exercise.model';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import {
  KANJI_QUIZ_ID,
  KANJI_QUIZ_SETS,
  KanjiQuizKind,
  KanjiQuizQuestion,
  KanjiQuizSet,
  isKanjiQuizMode,
  kanjiQuizQuestions,
  kanjiQuizSource,
} from '../../core/kanji/kanji-quiz';
import { orderQuestions } from '../../core/practice/build-questions';
import { buildKanjiQuizQuestions } from '../../core/practice/kanji-quiz-questions';
import { CHOICE_COUNT, LIMIT_CHOICES, practiceConfig } from '../../core/practice/practice.model';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { readJson, writeJson } from '../../core/services/local-storage';
import { checkedOf } from '../../core/utils/dom-events';
import { PracticeSetup } from '../../shared/practice-setup';
import { RubyText } from '../../shared/ruby-text';
import { StarButton } from '../../shared/star-button';

const STORAGE_KEY = 'jp-practice:kanji-quiz';

const INSTRUCTION_KEY: Record<KanjiQuizKind, MessageKey> = {
  reading: 'kanjiQuiz.instr.reading',
  writing: 'kanjiQuiz.instr.writing',
};

/** Thiết lập nhớ lại giữa hai lần mở trang — quay về từ màn kết quả vẫn đúng bài đang làm. */
interface Saved {
  mode: ExerciseMode;
  sets: string[];
  furigana: boolean;
}

function restore(): Saved {
  const raw = readJson<Partial<Saved> | null>(STORAGE_KEY, null);
  const valid = new Set(KANJI_QUIZ_SETS.map((set) => set.id));
  const sets = (Array.isArray(raw?.sets) ? raw.sets : []).filter((id) => valid.has(id));
  return {
    mode: raw?.mode && isKanjiQuizMode(raw.mode) ? raw.mode : 'kq-all',
    // Mặc định mở bài mới nhất được thêm vào — thường là bài người học vừa tới.
    sets: sets.length > 0 ? sets : [KANJI_QUIZ_SETS[KANJI_QUIZ_SETS.length - 1].id],
    furigana: raw?.furigana !== false,
  };
}

/** Câu của một bài chia theo 問題, để phần "Xem đề" in tiêu đề từng phần như đề gốc. */
interface ViewGroup {
  key: string;
  set: KanjiQuizSet;
  instructionKey: MessageKey;
  questions: KanjiQuizQuestion[];
}

/**
 * Tab "Trắc nghiệm" của khu Kanji: chọn bài và phần (問題1 / 問題2), luyện trên màn hình
 * luyện tập chung, xem lại đề kèm đáp án ngay dưới khung thiết lập.
 *
 * Màn hình riêng chứ không dùng chung với đề luyện N4: đề này chỉ có hai dạng câu và
 * chọn theo BÀI, không có phần / đề / chủ đề của một quyển sách. Phần chung (dựng câu
 * đề thi có gạch chân, khối "Xem đề") đã nằm ở chỗ dùng chung.
 */
@Component({
  selector: 'app-kanji-quiz',
  imports: [PracticeSetup, RubyText, StarButton, T],
  templateUrl: './kanji-quiz.html',
  styleUrl: './kanji-quiz.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiQuiz extends PracticeScreen {
  readonly modes = KANJI_QUIZ_MODES;
  readonly sets = KANJI_QUIZ_SETS;
  readonly questionTotal = KANJI_QUIZ_SETS.reduce((sum, set) => sum + set.questions.length, 0);

  private readonly saved = restore();
  readonly mode = signal<ExerciseMode>(this.saved.mode);
  readonly selectedSets = signal<string[]>(this.saved.sets);
  readonly showFurigana = signal(this.saved.furigana);
  readonly showAnswers = signal(false);

  protected favoriteSessionId(): string {
    return KANJI_QUIZ_ID;
  }

  readonly modeShort = computed(() => this.lang.t(exerciseModeInfo(this.mode()).shortKey));
  /** "Cả đề" đi đúng thứ tự như làm bài thật, không trộn. */
  readonly isAllMode = computed(() => this.mode() === 'kq-all');

  readonly questions = computed(() => kanjiQuizQuestions(this.mode(), this.selectedSets()));
  readonly favoriteCount = computed(() => this.favoritesOf(this.questions()).length);
  /** Số ★ của cả tab, không chỉ của bài đang chọn — số trên tiêu đề trang. */
  readonly favoriteTotal = computed(() => this.favoriteStore.counts()[KANJI_QUIZ_ID] ?? 0);

  readonly pool = computed(() =>
    this.scope() === 'favorite' ? this.favoritesOf(this.questions()) : this.questions(),
  );

  readonly plannedQuestionCount = computed(() => {
    const total = this.pool().length;
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);
  readonly limitChoices = computed(() => LIMIT_CHOICES.filter((limit) => limit < this.pool().length));
  /** Câu bốn lựa chọn chỉ có ba lượt sai — dòng tóm tắt phải nói đúng con số đó. */
  readonly planMax = Math.min(this.maxWrongAttempts, CHOICE_COUNT - 1);

  readonly viewGroups = computed<ViewGroup[]>(() => {
    const groups: ViewGroup[] = [];
    for (const question of this.questions()) {
      const key = `${question.setId}-${question.mondai}`;
      let group = groups.at(-1);
      if (group?.key !== key) {
        const set = KANJI_QUIZ_SETS.find((item) => item.id === question.setId)!;
        group = { key, set, instructionKey: INSTRUCTION_KEY[question.kind], questions: [] };
        groups.push(group);
      }
      group.questions.push(question);
    }
    return groups;
  });

  constructor() {
    super();
    this.rememberRecent({
      title: this.t('kanjiQuiz.name'),
      titleKey: 'kanjiQuiz.name',
      kindKey: 'kind.exercise',
    });
  }

  setCount(set: KanjiQuizSet): number {
    return kanjiQuizQuestions(this.mode(), [set.id]).length;
  }

  /** Nút chọn bài: "N5 · Bài 17 (20)", "N5 · Bài 25 · phần 1 (20)". */
  setLabel(set: KanjiQuizSet): string {
    const params = { level: set.level, lesson: set.lesson, count: this.setCount(set) };
    return set.part === null
      ? this.t('kanjiQuiz.set', params)
      : this.t('kanjiQuiz.set.part', { ...params, part: set.part });
  }

  /** Tiêu đề nhóm câu ở phần "Xem đề". */
  setTitle(set: KanjiQuizSet): string {
    const params = { level: set.level, lesson: set.lesson };
    return set.part === null
      ? this.t('kanjiQuiz.set.title', params)
      : this.t('kanjiQuiz.set.partTitle', { ...params, part: set.part });
  }

  isSetSelected(set: KanjiQuizSet): boolean {
    return this.selectedSets().includes(set.id);
  }

  starName(question: KanjiQuizQuestion): string {
    return kanjiQuizSource(question);
  }

  /** Số thứ tự 1–4 của đáp án, như đề ghi ở phần đáp án. */
  answerNumber(question: KanjiQuizQuestion): number {
    return question.options.indexOf(question.answer) + 1;
  }

  // ── Sự kiện ─────────────────────────────────────────────────────────────

  setMode(mode: ExerciseMode): void {
    this.mode.set(mode);
    this.afterSelectionChange();
  }

  toggleSet(set: KanjiQuizSet): void {
    const current = this.selectedSets();
    // Luôn còn ít nhất một bài: bỏ hết thì khung trống mà không rõ vì sao.
    if (current.includes(set.id) && current.length === 1) return;
    const next = current.includes(set.id)
      ? current.filter((id) => id !== set.id)
      : [...current, set.id];
    // Giữ thứ tự bài để nút không nhảy chỗ theo thứ tự bấm.
    this.selectedSets.set(KANJI_QUIZ_SETS.filter((item) => next.includes(item.id)).map((item) => item.id));
    this.afterSelectionChange();
  }

  toggleFurigana(event: Event): void {
    this.showFurigana.set(checkedOf(event));
    this.save();
  }

  toggleShowAnswers(event: Event): void {
    this.showAnswers.set(checkedOf(event));
  }

  private afterSelectionChange(): void {
    this.questionLimit.set(null);
    this.fixScope();
    this.save();
  }

  private save(): void {
    writeJson(STORAGE_KEY, {
      mode: this.mode(),
      sets: this.selectedSets(),
      furigana: this.showFurigana(),
    } satisfies Saved);
  }

  start(): void {
    if (!this.canStart()) return;

    const config = practiceConfig({
      lessonId: KANJI_QUIZ_ID,
      lessonKind: 'exercise',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      shuffle: this.isAllMode() ? false : this.shuffleQuestions(),
      answerMode: 'choice',
      showFurigana: this.showFurigana(),
      exercise: KANJI_QUIZ_ID,
      exerciseMode: this.mode(),
    });

    this.launch(
      { id: KANJI_QUIZ_ID, name: this.lang.t('kanjiQuiz.name') },
      config,
      orderQuestions(buildKanjiQuizQuestions(this.pool(), config), config),
    );
  }
}
