import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import {
  ExerciseMode,
  ExerciseModeInfo,
  TAISAKU_BUNPO_MODES,
  TAISAKU_FUROKU_MODES,
  TAISAKU_MOJI_MODES,
  exerciseModeInfo,
} from '../../core/exercises/exercise.model';
import {
  BUNPO_QUESTIONS,
  MOJI_QUESTIONS,
  STAR_BLANKS,
  TAISAKU_EXERCISE_ID,
  TAISAKU_MODE_SPEC,
  TAISAKU_PARTS,
  TAISAKU_TEST_NUMBERS,
  TAISAKU_TOPICS,
  TAISAKU_TOPIC_NUMBERS,
  TaisakuKind,
  TaisakuMode,
  TaisakuPart,
  TaisakuQuestion,
  TaisakuTopic,
  isTaisakuMode,
  isTaisakuTestMode,
  taisakuSource,
  taisakuUnits,
} from '../../core/exercises/taisaku-n4';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import { orderQuestions } from '../../core/practice/build-questions';
import { CHOICE_COUNT, LIMIT_CHOICES_LONG, practiceConfig } from '../../core/practice/practice.model';
import { buildTaisakuQuestions } from '../../core/practice/taisaku-questions';
import { readJson, writeJson } from '../../core/services/local-storage';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { plainText } from '../../core/translation/markup';
import { checkedOf } from '../../core/utils/dom-events';
import { PracticeSetup } from '../../shared/practice-setup';
import { RubyText } from '../../shared/ruby-text';
import { StarButton } from '../../shared/star-button';

const STORAGE_KEY = 'jp-practice:taisaku-n4';

const PART_MODES: Record<TaisakuPart, readonly ExerciseModeInfo[]> = {
  moji: TAISAKU_MOJI_MODES,
  bunpo: TAISAKU_BUNPO_MODES,
  furoku: TAISAKU_FUROKU_MODES,
};

const PART_LABEL_KEY: Record<TaisakuPart, MessageKey> = {
  moji: 'taisaku.part.moji',
  bunpo: 'taisaku.part.bunpo',
  furoku: 'taisaku.part.furoku',
};

const PART_DESC_KEY: Record<TaisakuPart, MessageKey> = {
  moji: 'taisaku.part.moji.desc',
  bunpo: 'taisaku.part.bunpo.desc',
  furoku: 'taisaku.part.furoku.desc',
};

const INSTRUCTION_KEY: Record<TaisakuKind, MessageKey> = {
  'kanji-reading': 'taisaku.instr.kanjiReading',
  'kanji-writing': 'taisaku.instr.kanjiWriting',
  context: 'taisaku.instr.context',
  paraphrase: 'taisaku.instr.paraphrase',
  usage: 'taisaku.instr.usage',
  grammar: 'taisaku.instr.grammar',
  star: 'taisaku.instr.star',
  passage: 'taisaku.instr.passage',
  fill: 'taisaku.instr.fill',
  pick: 'taisaku.instr.pick',
};

/** Thiết lập nhớ lại giữa hai lần mở trang — quay về từ màn kết quả vẫn đúng đề đang làm. */
interface Saved {
  part: TaisakuPart;
  modes: Record<TaisakuPart, TaisakuMode>;
  sets: Record<TaisakuPart, number[]>;
  furigana: boolean;
}

const DEFAULT_SAVED: Saved = {
  part: 'moji',
  modes: { moji: 'tk-kanji-reading', bunpo: 'tk-grammar', furoku: 'tk-word-meaning' },
  sets: { moji: [1], bunpo: [1], furoku: [1] },
  furigana: true,
};

function restore(): Saved {
  const raw = readJson<Partial<Saved> | null>(STORAGE_KEY, null);
  if (!raw || typeof raw !== 'object') return DEFAULT_SAVED;
  const part = TAISAKU_PARTS.includes(raw.part as TaisakuPart) ? (raw.part as TaisakuPart) : 'moji';
  const modes = { ...DEFAULT_SAVED.modes };
  const sets = { ...DEFAULT_SAVED.sets };
  for (const key of TAISAKU_PARTS) {
    const mode = raw.modes?.[key];
    if (mode && PART_MODES[key].some((info) => info.id === mode)) modes[key] = mode;
    const valid = setNumbersOf(key);
    const saved = (raw.sets?.[key] ?? []).filter((no) => valid.includes(no));
    if (saved.length > 0) sets[key] = saved;
  }
  return { part, modes, sets, furigana: raw.furigana !== false };
}

function setNumbersOf(part: TaisakuPart): readonly number[] {
  return part === 'furoku' ? TAISAKU_TOPIC_NUMBERS : TAISAKU_TEST_NUMBERS;
}

/** Câu của một đề chia theo もんだい, để phần "Xem đề" in tiêu đề từng dạng như sách. */
interface ViewGroup {
  key: string;
  set: number;
  kind: TaisakuKind;
  instructionKey: MessageKey;
  /** Bài đọc của もんだい3 phần 文法 — in một lần ở đầu nhóm. */
  passage: string | null;
  /** Khung từ của bài điền từ 付録 — in một lần ở đầu nhóm. */
  bank: readonly string[];
  questions: TaisakuQuestion[];
}

/**
 * Màn hình bài "Đề luyện N4 · 直前対策": chọn PHẦN → DẠNG → ĐỀ / CHỦ ĐỀ, luyện trên màn
 * hình luyện tập chung, và xem lại đề kèm đáp án ngay dưới khung thiết lập.
 *
 * Màn hình riêng chứ không thêm nhánh vào `ExerciseDetail`: bài này chọn đề và dạng câu
 * của một quyển sách, phần xem đề là câu kèm lựa chọn chứ không phải bảng động từ.
 */
@Component({
  selector: 'app-taisaku-n4',
  imports: [PracticeSetup, RubyText, StarButton, T],
  templateUrl: './taisaku-n4.html',
  styleUrl: './taisaku-n4.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaisakuN4 extends PracticeScreen {
  readonly parts = TAISAKU_PARTS;
  readonly partLabelKey = PART_LABEL_KEY;
  readonly partDescKey = PART_DESC_KEY;
  readonly questionCount = MOJI_QUESTIONS.length + BUNPO_QUESTIONS.length;
  readonly wordCount = TAISAKU_TOPICS.reduce((sum, topic) => sum + topic.words.length + topic.keigo.length, 0);

  private readonly saved = restore();
  readonly part = signal<TaisakuPart>(this.saved.part);
  private readonly modes = signal(this.saved.modes);
  private readonly sets = signal(this.saved.sets);
  readonly showFurigana = signal(this.saved.furigana);
  readonly showAnswers = signal(false);

  protected favoriteSessionId(): string {
    return TAISAKU_EXERCISE_ID;
  }

  readonly modeList = computed(() => PART_MODES[this.part()]);
  readonly mode = computed(() => this.modes()[this.part()]);
  readonly currentMode = computed(() => exerciseModeInfo(this.mode()));
  readonly modeShort = computed(() => this.lang.t(this.currentMode().shortKey));
  readonly isFuroku = computed(() => this.part() === 'furoku');
  readonly isTestMode = computed(() => isTaisakuTestMode(this.mode()));
  readonly isOrderMode = computed(() => this.mode() === 'tk-order');
  readonly isWordMode = computed(() => this.mode() === 'tk-word-meaning' || this.mode() === 'tk-meaning-word');

  readonly setNumbers = computed(() => setNumbersOf(this.part()));
  readonly selectedSets = computed(() => this.sets()[this.part()]);
  /** Đã chọn đủ mọi đề / chủ đề CÓ câu của dạng này — chủ đề nhìn tranh không tính. */
  readonly allSetsSelected = computed(() =>
    this.setNumbers().every((no) => this.setCount(no) === 0 || this.isSetSelected(no)),
  );

  /** Số mục của từng đề / chủ đề theo dạng đang chọn — số trên nút chọn đề. */
  readonly setCounts = computed<ReadonlyMap<number, number>>(() => {
    const mode = this.mode();
    return new Map(this.setNumbers().map((no) => [no, taisakuUnits(mode, [no]).length]));
  });

  /** Tên chủ đề không furigana — trên nút chọn chủ đề, chỗ hẹp. */
  private readonly topicTitles: ReadonlyMap<number, string> = new Map(
    TAISAKU_TOPICS.map((topic) => [topic.no, plainText(topic.title)]),
  );

  /** Số ★ của cả bài, không chỉ của đề đang chọn — số trên tiêu đề trang. */
  readonly favoriteTotal = computed(() => this.favoriteStore.counts()[TAISAKU_EXERCISE_ID] ?? 0);

  readonly units = computed(() => taisakuUnits(this.mode(), this.selectedSets()));
  readonly favoriteCount = computed(() => this.favoritesOf(this.units()).length);

  readonly pool = computed(() =>
    this.scope() === 'favorite' ? this.favoritesOf(this.units()) : this.units(),
  );

  readonly plannedQuestionCount = computed(() => {
    const total = this.pool().length;
    const limit = this.questionLimit();
    return limit === null ? total : Math.min(limit, total);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);
  readonly limitChoices = computed(() => LIMIT_CHOICES_LONG.filter((limit) => limit < this.pool().length));

  /** Lượt sai tối đa ghi ở dòng tóm tắt: câu trắc nghiệm bốn lựa chọn chỉ có ba lượt. */
  readonly planMax = computed(() =>
    this.isOrderMode() ? this.maxWrongAttempts : Math.min(this.maxWrongAttempts, CHOICE_COUNT - 1),
  );

  // ── Xem đề ──────────────────────────────────────────────────────────────

  /** Câu soạn sẵn của dạng đang chọn trong các đề đang chọn, chia nhóm theo đề và もんだい. */
  readonly viewGroups = computed<ViewGroup[]>(() => {
    if (this.isWordMode()) return [];
    const groups: ViewGroup[] = [];
    for (const unit of this.units()) {
      if (unit.type !== 'question') continue;
      const question = unit.question;
      // Bài điền từ 付録 có nhiều khung trong một chủ đề — mỗi khung một nhóm.
      const box = question.kind === 'fill' ? question.id.split('-')[1] : '';
      const key = `${question.set}-${question.kind}-${box}`;
      let group = groups.at(-1);
      if (group?.key !== key) {
        group = {
          key,
          set: question.set,
          kind: question.kind,
          instructionKey: INSTRUCTION_KEY[question.kind],
          passage: question.passage ? question.passage.replace(/[〈〉]/g, '') : null,
          bank: question.kind === 'fill' ? question.options : [],
          questions: [],
        };
        groups.push(group);
      }
      group.questions.push(question);
    }
    return groups;
  });

  /** Bảng từ của các chủ đề đang chọn (dạng luyện từ). */
  topicTitle(no: number): string {
    return this.topicTitles.get(no) ?? '';
  }

  plain(text: string): string {
    return plainText(text);
  }

  starName(question: TaisakuQuestion): string {
    return taisakuSource(question);
  }

  hasExamples(topic: TaisakuTopic): boolean {
    return topic.words.some((word) => word.example !== '');
  }

  /** Đề của câu ★ khi xem: bốn ô trống như sách thay cho dấu 【★】 của dữ liệu. */
  viewPrompt(question: TaisakuQuestion): string {
    return question.prompt.replace('【★】', STAR_BLANKS);
  }

  /** Số thứ tự 1–4 của đáp án trong các lựa chọn, như sách ghi ở phần đáp án. */
  answerNumber(question: TaisakuQuestion): number {
    return question.options.indexOf(question.answer) + 1;
  }

  readonly viewTopics = computed<TaisakuTopic[]>(() => {
    if (!this.isWordMode()) return [];
    const wanted = new Set(this.selectedSets());
    return TAISAKU_TOPICS.filter((topic) => wanted.has(topic.no));
  });

  constructor() {
    super();
    this.rememberRecent({
      title: this.t('taisaku.name'),
      titleKey: 'taisaku.name',
      kindKey: 'kind.exercise',
    });
  }

  // ── Sự kiện ─────────────────────────────────────────────────────────────

  setPart(part: TaisakuPart): void {
    if (part === this.part()) return;
    this.part.set(part);
    this.afterSelectionChange();
  }

  setMode(mode: ExerciseMode): void {
    if (!isTaisakuMode(mode)) return;
    this.modes.update((modes) => ({ ...modes, [TAISAKU_MODE_SPEC[mode].part]: mode }));
    this.afterSelectionChange();
  }

  isSetSelected(no: number): boolean {
    return this.selectedSets().includes(no);
  }

  setCount(no: number): number {
    return this.setCounts().get(no) ?? 0;
  }

  toggleSet(no: number): void {
    const current = this.selectedSets();
    if (current.includes(no) && current.length === 1) return;
    const next = current.includes(no) ? current.filter((item) => item !== no) : [...current, no];
    // Giữ thứ tự sách để nút không nhảy chỗ theo thứ tự bấm.
    this.writeSets(this.setNumbers().filter((item) => next.includes(item)));
    this.afterSelectionChange();
  }

  selectAllSets(): void {
    this.writeSets(this.setNumbers().filter((no) => this.setCount(no) > 0));
    this.afterSelectionChange();
  }

  toggleFurigana(event: Event): void {
    this.showFurigana.set(checkedOf(event));
    this.save();
  }

  toggleShowAnswers(event: Event): void {
    this.showAnswers.set(checkedOf(event));
  }

  /**
   * Đổi phần / dạng / đề là đổi số câu đem ra hỏi: bỏ giới hạn số câu, sửa phạm vi ★, và
   * bỏ những chủ đề không có câu nào của dạng mới (chủ đề nhìn tranh ở dạng "Bài tập
   * trong sách") — để lại thì nút Bắt đầu bị khoá mà người học không biết vì sao.
   */
  private afterSelectionChange(): void {
    const usable = this.selectedSets().filter((no) => this.setCount(no) > 0);
    if (usable.length !== this.selectedSets().length) {
      const first = this.setNumbers().find((no) => this.setCount(no) > 0);
      this.writeSets(usable.length > 0 ? usable : first !== undefined ? [first] : []);
    }
    this.questionLimit.set(null);
    this.fixScope();
    this.save();
  }

  private writeSets(sets: number[]): void {
    this.sets.update((all) => ({ ...all, [this.part()]: sets }));
  }

  private save(): void {
    writeJson(STORAGE_KEY, {
      part: this.part(),
      modes: this.modes(),
      sets: this.sets(),
      furigana: this.showFurigana(),
    } satisfies Saved);
  }

  start(): void {
    if (!this.canStart()) return;
    const mode = this.mode();

    const config = practiceConfig({
      lessonId: TAISAKU_EXERCISE_ID,
      lessonKind: 'exercise',
      scope: this.scope(),
      questionLimit: this.questionLimit(),
      // "Cả đề" đi đúng thứ tự sách như một đề thi thật.
      shuffle: this.isTestMode() ? false : this.shuffleQuestions(),
      answerMode: this.isOrderMode() ? 'order' : 'choice',
      // Ở bài này cờ gợi ý bật câu ví dụ của từ (dạng Nhật → Việt).
      showHanViet: this.showHint(),
      showFurigana: this.showFurigana(),
      exercise: 'taisaku-n4',
      exerciseMode: mode,
    });

    this.launch(
      { id: TAISAKU_EXERCISE_ID, name: this.lang.t('taisaku.name') },
      config,
      orderQuestions(buildTaisakuQuestions(this.pool(), config), config),
    );
  }
}
