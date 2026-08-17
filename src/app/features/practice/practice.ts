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

@Component({
  selector: 'app-practice',
  imports: [T],
  templateUrl: './practice.html',
  styleUrl: './practice.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Practice {
  private readonly session = inject(PracticeSessionStore);
  private readonly favoriteStore = inject(FavoriteStore);
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

  readonly isChoiceMode = computed(() => this.config()?.answerMode === 'choice');
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
    this.typedAnswer.set((event.target as HTMLInputElement | HTMLTextAreaElement).value);
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
