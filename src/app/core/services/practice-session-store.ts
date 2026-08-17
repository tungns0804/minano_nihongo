import { Injectable, computed, signal } from '@angular/core';

import {
  PracticeConfig,
  PracticeQuestion,
  QuestionResult,
  QuestionState,
  QuestionStatus,
  SessionSummary,
} from '../models/practice.model';
import { isAnswerCorrect } from '../utils/answer-check';

export type NextOutcome = 'moved' | 'finished' | 'blocked';

/** Bài học đang luyện, chỉ cần đủ để hiện tên ở màn hình kết quả. */
export interface SessionLesson {
  id: string;
  name: string;
}

/**
 * Giữ phiên luyện tập đang chạy và kết quả của phiên vừa xong.
 *
 * Chỉ lo chạy phiên và chấm điểm — việc dựng câu hỏi nằm ở `core/practice/`,
 * nhờ vậy bài từ vựng và bài động từ dùng chung được toàn bộ màn hình luyện tập
 * và màn hình kết quả.
 *
 * Toàn bộ nằm trong bộ nhớ: tải lại trang là mất phiên, đúng với yêu cầu
 * "mỗi lần luyện tập là một lần mới duy nhất, không lưu lịch sử".
 */
@Injectable({ providedIn: 'root' })
export class PracticeSessionStore {
  private readonly lessonRef = signal<SessionLesson | null>(null);
  private readonly configRef = signal<PracticeConfig | null>(null);
  private readonly questionList = signal<PracticeQuestion[]>([]);
  private readonly stateList = signal<QuestionState[]>([]);
  private readonly indexRef = signal(0);
  private readonly finishedRef = signal(false);
  private readonly summaryRef = signal<SessionSummary | null>(null);
  private startedAt = 0;

  readonly lesson = this.lessonRef.asReadonly();
  readonly config = this.configRef.asReadonly();
  readonly questions = this.questionList.asReadonly();
  readonly index = this.indexRef.asReadonly();
  readonly summary = this.summaryRef.asReadonly();

  readonly total = computed(() => this.questionList().length);
  readonly current = computed<PracticeQuestion | null>(
    () => this.questionList()[this.indexRef()] ?? null,
  );
  readonly currentState = computed<QuestionState | null>(
    () => this.stateList()[this.indexRef()] ?? null,
  );

  /** Phiên đang chạy (đã bắt đầu và chưa kết thúc) — dùng cho route guard. */
  readonly isRunning = computed(() => this.total() > 0 && !this.finishedRef());

  readonly answeredCount = computed(
    () => this.stateList().filter((state) => state.status !== 'pending').length,
  );
  readonly correctCount = computed(
    () => this.stateList().filter((state) => state.status === 'correct').length,
  );
  readonly isLastQuestion = computed(() => this.indexRef() >= this.total() - 1);

  /**
   * Bắt đầu một phiên mới.
   * @returns false nếu không dựng được câu hỏi nào.
   */
  start(
    lesson: SessionLesson,
    config: PracticeConfig,
    questions: readonly PracticeQuestion[],
  ): boolean {
    if (questions.length === 0) return false;

    this.lessonRef.set(lesson);
    this.configRef.set(config);
    this.questionList.set([...questions]);
    this.stateList.set(questions.map(() => ({ status: 'pending', wrongAttempts: 0, attempts: [] })));
    this.indexRef.set(0);
    this.finishedRef.set(false);
    this.summaryRef.set(null);
    this.startedAt = Date.now();
    return true;
  }

  /**
   * Chấm một câu trả lời (gõ tay hoặc lựa chọn trắc nghiệm).
   *  - 'correct'  đúng
   *  - 'pending'  sai nhưng còn lượt trả lời
   *  - 'revealed' sai quá số lần cho phép, đã hiện đáp án và tính là sai
   */
  submitAnswer(rawAnswer: string): QuestionStatus {
    const question = this.current();
    const state = this.currentState();
    const config = this.configRef();
    if (!question || !state || !config || state.status !== 'pending') {
      return state?.status ?? 'pending';
    }

    const answer = rawAnswer.trim();
    if (!answer) return 'pending';

    const correct =
      config.answerMode === 'choice'
        ? answer === question.correctAnswer
        : isAnswerCorrect(answer, question.acceptedAnswers, {
            ignoreDiacritics: config.ignoreDiacritics,
            // Tiếng Nhật không có dấu cách giữa các từ nên bỏ hết khoảng trắng khi so khớp.
            ignoreAllWhitespace: question.answerIsJapanese,
            ignorePunctuation: question.ignorePunctuation,
          });

    const attempts = [...state.attempts, answer];

    if (correct) {
      this.patchCurrentState({ status: 'correct', attempts });
      return 'correct';
    }

    const wrongAttempts = state.wrongAttempts + 1;
    const status: QuestionStatus =
      wrongAttempts >= question.maxWrongAttempts ? 'revealed' : 'pending';
    this.patchCurrentState({ status, attempts, wrongAttempts });
    return status;
  }

  /** Chủ động xem đáp án khi bí. Câu đó bị tính là sai. */
  giveUp(): QuestionStatus {
    const state = this.currentState();
    if (!state || state.status !== 'pending') return state?.status ?? 'pending';

    this.patchCurrentState({ status: 'revealed', wrongAttempts: Math.max(1, state.wrongAttempts) });
    return 'revealed';
  }

  /** Sang câu tiếp theo. Chỉ có tác dụng khi câu hiện tại đã được chấm xong. */
  next(): NextOutcome {
    const state = this.currentState();
    if (!state || state.status === 'pending') return 'blocked';

    if (this.indexRef() < this.total() - 1) {
      this.indexRef.update((i) => i + 1);
      return 'moved';
    }

    this.finish();
    return 'finished';
  }

  /** Bỏ dở giữa chừng: xoá sạch phiên, không tính kết quả. */
  abandon(): void {
    this.reset();
  }

  /** Xoá kết quả đang xem (gọi khi rời màn hình kết quả). */
  clearSummary(): void {
    this.summaryRef.set(null);
  }

  private finish(): void {
    const lesson = this.lessonRef();
    const config = this.configRef();
    if (!lesson || !config) return;

    const states = this.stateList();
    const results: QuestionResult[] = this.questionList().map((question, i) => {
      const state = states[i];
      return {
        question,
        isCorrect: state.status === 'correct',
        isPerfect: state.status === 'correct' && state.wrongAttempts === 0,
        wrongAttempts: state.wrongAttempts,
        attempts: state.attempts,
      };
    });

    const correctCount = results.filter((r) => r.isCorrect).length;

    this.summaryRef.set({
      lessonId: lesson.id,
      lessonName: lesson.name,
      config,
      total: results.length,
      correctCount,
      wrongCount: results.length - correctCount,
      perfectCount: results.filter((r) => r.isPerfect).length,
      durationMs: Date.now() - this.startedAt,
      results,
    });
    this.finishedRef.set(true);
  }

  private patchCurrentState(patch: Partial<QuestionState>): void {
    const index = this.indexRef();
    this.stateList.update((states) =>
      states.map((state, i) => (i === index ? { ...state, ...patch } : state)),
    );
  }

  private reset(): void {
    this.lessonRef.set(null);
    this.configRef.set(null);
    this.questionList.set([]);
    this.stateList.set([]);
    this.indexRef.set(0);
    this.finishedRef.set(false);
    this.summaryRef.set(null);
    this.startedAt = 0;
  }
}
