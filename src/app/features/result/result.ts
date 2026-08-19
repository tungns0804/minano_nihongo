import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { RADICAL_SESSION_ID } from '../../core/kanji/kanji.model';
import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import { QuestionResult, describeConfigKeys } from '../../core/models/practice.model';
import { LessonKind } from '../../core/models/vocabulary.model';
import { reshuffleChoices } from '../../core/practice/build-questions';
import { FavoriteStore } from '../../core/services/favorite-store';
import { PracticeSessionStore } from '../../core/services/practice-session-store';

type ResultFilter = 'all' | 'wrong' | 'retried';

/**
 * Nút "Về bài học" quay lại đâu, theo loại bài vừa luyện.
 *
 * Là một bảng đủ mọi loại chứ không phải chuỗi ternary: thêm loại bài mới mà quên
 * khai báo thì TypeScript báo lỗi ngay, thay vì lặng lẽ đẩy người dùng tới
 * /lesson/<id> — một đường dẫn không tồn tại và sẽ bị đưa về trang chủ.
 */
const BACK_ROUTE: Record<LessonKind, string> = {
  vocabulary: '/lesson',
  verb: '/lesson',
  conversation: '/lesson',
  grammar: '/grammar',
  exercise: '/exercise',
  kanji: '/kanji',
};

@Component({
  selector: 'app-result',
  imports: [T],
  templateUrl: './result.html',
  styleUrl: './result.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Result {
  private readonly session = inject(PracticeSessionStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly lang = inject(LanguageStore);
  private readonly router = inject(Router);

  readonly t = this.lang.t.bind(this.lang);

  readonly summary = this.session.summary;
  readonly filter = signal<ResultFilter>('all');
  readonly favoritesJustAdded = signal(0);

  readonly configBadgeKeys = computed(() => {
    const config = this.summary()?.config;
    return config ? describeConfigKeys(config) : [];
  });

  readonly accuracy = computed(() => {
    const summary = this.summary();
    if (!summary || summary.total === 0) return 0;
    return Math.round((summary.correctCount / summary.total) * 100);
  });

  /** Câu trả lời sai — cũng chính là các mục nên đánh dấu để luyện lại. */
  readonly wrongResults = computed<QuestionResult[]>(
    () => this.summary()?.results.filter((r) => !r.isCorrect) ?? [],
  );

  /** Câu đúng nhưng phải thử lại vài lần — vẫn là dấu hiệu chưa nhớ chắc. */
  readonly retriedResults = computed<QuestionResult[]>(
    () => this.summary()?.results.filter((r) => r.isCorrect && r.wrongAttempts > 0) ?? [],
  );

  readonly visibleResults = computed<QuestionResult[]>(() => {
    switch (this.filter()) {
      case 'wrong':
        return this.wrongResults();
      case 'retried':
        return this.retriedResults();
      default:
        return this.summary()?.results ?? [];
    }
  });

  readonly durationText = computed(() => {
    const totalSeconds = Math.max(0, Math.round((this.summary()?.durationMs ?? 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0
      ? this.lang.t('result.minutesSeconds', { minutes, seconds })
      : this.lang.t('result.seconds', { seconds });
  });

  /** Chữ hiển thị của một lựa chọn trong kết quả (câu nhận diện nhóm lưu mã số). */
  answerText(item: QuestionResult, value: string): string {
    const key = item.question.choiceLabelKeys?.[value];
    return key ? this.lang.t(key) : value;
  }

  correctAnswerText(item: QuestionResult): string {
    return item.question.correctAnswerKey
      ? this.lang.t(item.question.correctAnswerKey)
      : item.question.correctAnswer;
  }

  attemptsText(item: QuestionResult): string {
    return item.attempts.map((a) => this.answerText(item, a)).join(', ');
  }

  questionLabel(item: QuestionResult): string {
    return this.lang.tNested(item.question.labelKey, item.question.labelParams);
  }

  subjectDetail(item: QuestionResult): string {
    const subject = item.question.subject;
    return subject.detailSuffixKey
      ? `${subject.detail} · ${this.lang.t(subject.detailSuffixKey)}`
      : subject.detail;
  }

  readonly scoreTone = computed(() => {
    const value = this.accuracy();
    if (value >= 90) return 'great';
    if (value >= 70) return 'ok';
    return 'low';
  });

  /**
   * Số mục sai chưa được đánh dấu ★.
   * Đếm theo mục chứ không theo câu, vì một động từ có thể bị hỏi ở nhiều thể.
   */
  readonly unmarkedWrongIds = computed(() => {
    void this.favoriteStore.counts();
    const summary = this.summary();
    if (!summary) return [];

    const ids = new Set(this.wrongResults().map((r) => r.question.subject.id));
    return [...ids].filter((id) => !this.favoriteStore.isFavorite(summary.lessonId, id));
  });

  setFilter(value: ResultFilter): void {
    this.filter.set(value);
  }

  isFavorite(subjectId: string): boolean {
    void this.favoriteStore.counts();
    const lessonId = this.summary()?.lessonId;
    return !!lessonId && this.favoriteStore.isFavorite(lessonId, subjectId);
  }

  toggleFavorite(subjectId: string): void {
    const lessonId = this.summary()?.lessonId;
    if (!lessonId) return;
    this.favoriteStore.toggle(lessonId, subjectId);
  }

  /** Đánh dấu ★ toàn bộ mục bị sai để lần sau luyện riêng nhóm này. */
  markWrongAsFavorite(): void {
    const summary = this.summary();
    if (!summary) return;

    const added = this.unmarkedWrongIds().length;
    this.favoriteStore.add(
      summary.lessonId,
      this.wrongResults().map((r) => r.question.subject.id),
    );
    this.favoritesJustAdded.set(added);
  }

  /** Luyện lại chỉ những câu vừa sai, giữ nguyên thiết lập cũ. */
  retryWrong(): void {
    this.restart(this.wrongResults());
  }

  /** Làm lại toàn bộ phiên vừa rồi với cùng thiết lập. */
  retryAll(): void {
    this.restart(this.summary()?.results ?? []);
  }

  private restart(results: readonly QuestionResult[]): void {
    const lesson = this.session.lesson();
    const summary = this.summary();
    if (!lesson || !summary || results.length === 0) return;

    // Trộn lại thứ tự đáp án để không nhớ vị trí đáp án của lần trước.
    const questions = results.map((r) => reshuffleChoices(r.question));
    if (this.session.start(lesson, summary.config, questions)) {
      void this.router.navigate(['/practice']);
    }
  }

  /**
   * Quay lại đúng màn hình của bài vừa luyện.
   *
   * Bài ngữ pháp nằm ở nhánh /grammar/:id và bài tập ở /exercise/:id chứ không
   * phải /lesson/:id — dùng `config.lessonKind` chứ không đoán theo id, vì id chỉ
   * là một chuỗi bất kỳ.
   */
  backToLesson(): void {
    const summary = this.summary();
    this.session.clearSummary();
    if (!summary) {
      void this.router.navigate(['/']);
      return;
    }

    const base = BACK_ROUTE[summary.config.lessonKind];
    // Phiên luyện âm Hán Việt bộ thủ mở từ chính màn hình danh sách `/kanji` và hỏi
    // trên CẢ danh sách, nên `lessonId` của nó là một id giả (`RADICAL_SESSION_ID`)
    // chứ không phải một bộ thủ — ghép vào thành `/kanji/bo-thu` là một đường dẫn
    // không tồn tại.
    const isRadicalSession =
      summary.config.lessonKind === 'kanji' && summary.lessonId === RADICAL_SESSION_ID;
    void this.router.navigate(isRadicalSession ? [base] : [base, summary.lessonId]);
  }

  backHome(): void {
    this.session.clearSummary();
    void this.router.navigate(['/']);
  }
}
