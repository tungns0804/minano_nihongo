import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import type { MessageKey } from '../../core/i18n/messages';
import { QuestionStatus, sessionShortKey } from '../../core/models/practice.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';
import { DrawingVerdict, STROKE_ISSUE_KEY, checkDrawing } from '../../core/strokes/stroke-score';
import { StrokePoint } from '../../core/strokes/stroke.model';
import { StrokeStore } from '../../core/strokes/stroke-store';
import { valueOf } from '../../core/utils/dom-events';
import { StarButton } from '../../shared/star-button';
import { StrokeCanvas } from '../../shared/stroke-canvas';

@Component({
  selector: 'app-practice',
  imports: [StarButton, StrokeCanvas, T],
  templateUrl: './practice.html',
  styleUrl: './practice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Practice {
  private readonly session = inject(PracticeSessionStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly strokeStore = inject(StrokeStore);
  private readonly lang = inject(LanguageStore);
  private readonly router = inject(Router);

  readonly t = this.lang.t.bind(this.lang);

  /** Ô nhập đáp án — <input> với từ đơn, <textarea> với câu dài. */
  private readonly answerInput =
    viewChild<ElementRef<HTMLInputElement | HTMLTextAreaElement>>('answerInput');
  private readonly answerArea = viewChild<ElementRef<HTMLElement>>('answerArea');
  private readonly feedbackPanel = viewChild<ElementRef<HTMLElement>>('feedbackPanel');

  readonly question = this.session.current;
  readonly state = this.session.currentState;
  readonly index = this.session.index;
  readonly total = this.session.total;
  readonly config = this.session.config;
  readonly lesson = this.session.lesson;
  readonly correctSoFar = this.session.correctCount;
  readonly isLastQuestion = this.session.isLastQuestion;

  /** Nội dung đang gõ ở chế độ gõ đáp án. */
  readonly typedAnswer = signal('');
  /** Câu trả lời sai gần nhất, để hiện lại cho người dùng thấy. */
  readonly lastWrongAnswer = signal<string | null>(null);

  readonly status = computed<QuestionStatus>(() => this.state()?.status ?? 'pending');
  readonly isResolved = computed(() => this.status() !== 'pending');
  readonly isCorrect = computed(() => this.status() === 'correct');
  readonly isRevealed = computed(() => this.status() === 'revealed');

  /** "Cụm 2/7" khi đang học theo cụm; rỗng với phiên thường. */
  readonly batchLabel = computed(() => {
    const config = this.config();
    if (!config || config.batchIndex === null) return '';
    return this.lang.t('practice.batch', {
      index: config.batchIndex + 1,
      total: this.session.batchTotal(),
    });
  });

  readonly isChoiceMode = computed(() => this.config()?.answerMode === 'choice');
  readonly isDrawMode = computed(() => this.config()?.answerMode === 'draw');
  readonly modeLabel = computed(() => {
    const config = this.config();
    return config ? this.lang.t(sessionShortKey(config)) : '';
  });

  /** Nhãn câu hỏi, dịch lồng vì tham số cũng là khoá (ví dụ tên các thể). */
  readonly questionLabel = computed(() => {
    const question = this.question();
    return question ? this.lang.tNested(question.labelKey, question.labelParams) : '';
  });

  readonly answerPrompt = computed(() => {
    const question = this.question();
    return question ? this.lang.tNested(question.answerPromptKey, question.answerPromptParams) : '';
  });

  /** Đáp án đúng ở dạng chữ hiển thị (câu nhận diện nhóm lưu mã "1"/"2"/"3"). */
  readonly correctAnswerText = computed(() => {
    const question = this.question();
    if (!question) return '';
    return question.correctAnswerKey
      ? this.lang.t(question.correctAnswerKey)
      : question.correctAnswer;
  });

  /** Chữ hiển thị của một lựa chọn — có thể là mã cần dịch. */
  choiceLabel(choice: string): string {
    const keys = this.question()?.choiceLabelKeys;
    const key = keys?.[choice] as MessageKey | undefined;
    return key ? this.lang.t(key) : choice;
  }

  readonly questionNumber = computed(() => this.index() + 1);
  readonly progressPercent = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.index() / this.total()) * 100),
  );

  readonly wrongAttempts = computed(() => this.state()?.wrongAttempts ?? 0);
  readonly remainingAttempts = computed(() => {
    const question = this.question();
    if (!question) return 0;
    return Math.max(0, question.maxWrongAttempts - this.wrongAttempts());
  });

  constructor() {
    // Dữ liệu nét nằm ở một gói tải riêng, nên phiên viết tay phải gọi lấy ngay từ
    // đầu — chờ tới câu đầu tiên mới tải thì khung vẽ trống mất mấy trăm mili giây.
    if (this.config()?.answerMode === 'draw') void this.strokeStore.load();
  }

  readonly isCurrentFavorite = computed(() => {
    // Đọc signal counts để computed này chạy lại mỗi khi Favorite đổi.
    void this.favoriteStore.counts();
    const subjectId = this.question()?.subject.id;
    const lessonId = this.lesson()?.id;
    return !!subjectId && !!lessonId && this.favoriteStore.isFavorite(lessonId, subjectId);
  });

  // --- Trắc nghiệm ---

  /** Lựa chọn đã bấm và bị sai. */
  isRejected(choice: string): boolean {
    const question = this.question();
    if (!question || choice === question.correctAnswer) return false;
    return this.state()?.attempts.includes(choice) ?? false;
  }

  /** Ô đáp án đúng — chỉ tô xanh sau khi câu đã được chấm xong. */
  isRevealedCorrect(choice: string): boolean {
    return this.isResolved() && choice === this.question()?.correctAnswer;
  }

  selectChoice(choice: string): void {
    if (this.isResolved() || this.isRejected(choice)) return;
    this.handleResult(this.session.submitAnswer(choice), choice);
  }

  // --- Gõ đáp án ---

  onTypedInput(event: Event): void {
    this.typedAnswer.set(valueOf(event));
  }

  submitTyped(): void {
    if (this.isResolved()) return;
    const answer = this.typedAnswer().trim();
    if (!answer) return;
    this.handleResult(this.session.submitAnswer(answer), answer);
  }

  /**
   * Enter trong ô nhập = chấm câu, và CHỈ chấm câu.
   *
   * Nếu để sự kiện nổi lên document thì chính phím Enter đó sẽ chạy tiếp handler
   * "sang câu tiếp theo" (lúc ấy câu đã chuyển sang trạng thái đã chấm), khiến
   * người dùng bị nhảy câu mà chưa kịp nhìn đáp án.
   *
   * preventDefault là để ô <textarea> của câu dài không chèn thêm một dòng mới
   * trước khi bị chấm. Muốn xuống dòng thật thì Shift+Enter — Angular chỉ khớp
   * (keydown.enter) khi không giữ phím bổ trợ nào, nên tổ hợp đó không vào đây.
   */
  onAnswerEnter(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.submitTyped();
  }

  // --- Viết tay ---

  /**
   * Nét mẫu của chữ đang hỏi; rỗng khi dữ liệu nét chưa tải xong.
   *
   * Đọc `ready()` trước để computed chạy lại ngay khi gói dữ liệu về tới — nếu
   * không thì câu đầu tiên mãi mãi không có nét mẫu.
   */
  readonly referenceStrokes = computed(() => {
    void this.strokeStore.ready();
    const char = this.question()?.drawChar;
    return char ? (this.strokeStore.strokesOf(char) ?? []) : [];
  });

  readonly strokesReady = computed(() => this.referenceStrokes().length > 0);

  /**
   * Có vẽ nét mẫu mờ để đồ theo không.
   *
   * Khi đang làm bài thì theo tuỳ chọn gợi ý của khung thiết lập — tắt đi là kiểm
   * tra trí nhớ thật. Chấm xong thì luôn hiện, vì lúc ấy nó là đáp án chứ không
   * còn là gợi ý.
   */
  readonly showGuide = computed(() => this.isResolved() || (this.config()?.showHanViet ?? false));

  private readonly verdict = signal<DrawingVerdict | null>(null);

  readonly wrongStrokes = computed(() =>
    (this.verdict()?.problems ?? []).map((problem) => problem.stroke),
  );

  readonly drawIssues = computed(() =>
    (this.verdict()?.problems ?? []).map((problem) => ({
      key: STROKE_ISSUE_KEY[problem.issue],
      params: { stroke: problem.stroke },
    })),
  );

  readonly drawScore = computed(() => {
    const verdict = this.verdict();
    return verdict
      ? this.lang.t('practice.draw.score', {
          matched: verdict.matched,
          expected: verdict.expected,
        })
      : '';
  });

  onDrawn(strokes: StrokePoint[][]): void {
    if (this.isResolved()) return;

    const verdict = checkDrawing(strokes, this.referenceStrokes());
    this.verdict.set(verdict);
    this.handleResult(this.session.submitDrawing(verdict.correct), '');
  }

  private handleResult(result: QuestionStatus, answer: string): void {
    if (result === 'correct') {
      this.lastWrongAnswer.set(null);
      this.focusFeedback();
      return;
    }

    this.lastWrongAnswer.set(answer);
    this.shakeAnswerArea();

    if (result === 'revealed') {
      this.focusFeedback();
    } else {
      // Còn lượt trả lời: xoá ô nhập để gõ lại, giữ nguyên focus tại đó.
      this.typedAnswer.set('');
      this.focusAnswerInput();
    }
  }

  // --- Điều hướng trong phiên ---

  giveUp(): void {
    if (this.isResolved()) return;
    this.session.giveUp();
    this.lastWrongAnswer.set(null);
    this.focusFeedback();
  }

  goNext(): void {
    const outcome = this.session.next();
    if (outcome === 'blocked') return;

    if (outcome === 'finished') {
      void this.router.navigate(['/result']);
      return;
    }

    this.typedAnswer.set('');
    this.lastWrongAnswer.set(null);
    this.verdict.set(null);
    this.focusAnswerInput();
  }

  toggleFavorite(): void {
    const subjectId = this.question()?.subject.id;
    const lessonId = this.lesson()?.id;
    if (!subjectId || !lessonId) return;
    this.favoriteStore.toggle(lessonId, subjectId);
  }

  quit(): void {
    if (!confirm(this.lang.t('practice.confirmQuit'))) return;
    this.session.abandon();
    void this.router.navigate(['/']);
  }

  // --- Bàn phím ---

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    // Phím gõ vào ô nhập đáp án thuộc về ô đó, không phải phím tắt điều hướng.
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

    // Câu đã chấm xong: Space (hoặc Enter) để sang câu tiếp theo.
    // preventDefault để Space không cuộn trang và không kích hoạt nút đang focus.
    if (this.isResolved()) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.goNext();
      }
      return;
    }

    // Câu chưa chấm, chế độ trắc nghiệm: phím 1..4 chọn đáp án tương ứng.
    // Chế độ gõ không bắt phím số vì người dùng cần gõ chúng vào ô nhập.
    if (this.isChoiceMode()) {
      const choices = this.question()?.choices ?? [];
      const position = Number(event.key);
      if (Number.isInteger(position) && position >= 1 && position <= choices.length) {
        event.preventDefault();
        this.selectChoice(choices[position - 1]);
      }
    }
  }

  private focusAnswerInput(): void {
    if (this.isChoiceMode()) return;
    setTimeout(() => this.answerInput()?.nativeElement.focus(), 0);
  }

  private focusFeedback(): void {
    setTimeout(() => this.feedbackPanel()?.nativeElement.focus(), 0);
  }

  /**
   * Rung nhẹ vùng trả lời khi sai. Dùng Web Animations API thay vì CSS class vì
   * animation cần chạy lại từ đầu ở mỗi lần sai liên tiếp.
   */
  private shakeAnswerArea(): void {
    const element = this.answerArea()?.nativeElement;
    if (!element?.animate) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    element.animate(
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-8px)' },
        { transform: 'translateX(8px)' },
        { transform: 'translateX(-4px)' },
        { transform: 'translateX(0)' },
      ],
      { duration: 280, easing: 'ease-in-out' },
    );
  }
}
