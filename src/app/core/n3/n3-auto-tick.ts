import { Injectable, effect, inject, signal, untracked } from '@angular/core';

import { LessonStore } from '../lessons/lesson-store';
import { flattenGrammarExamples } from '../lessons/vocabulary.model';
import { ReviewStore, type SourceProgress } from '../review/review-store';
import { N3ProgressStore } from './n3-progress-store';
import { N3_SECTIONS } from './n3-syllabus';
import { type N3Unit, unitsOf } from './n3.model';

/**
 * Buổi lộ trình N3 ứng với từng bài trong app, theo id bài.
 *
 * Chỉ lấy buổi trỏ tới MỘT bài (`/lesson/<id>`, `/grammar/<id>`): buổi trỏ tới cả một
 * khu như `/kanji` không có điểm "học hết" nào để đo.
 */
const UNITS_BY_LESSON: ReadonlyMap<string, readonly N3Unit[]> = (() => {
  const map = new Map<string, N3Unit[]>();
  for (const unit of N3_SECTIONS.flatMap(unitsOf)) {
    const match = unit.source === 'app' ? /^\/(?:lesson|grammar)\/(.+)$/.exec(unit.route) : null;
    if (!match) continue;
    map.set(match[1], [...(map.get(match[1]) ?? []), unit]);
  }
  return map;
})();

function trackedOf(progress: ReadonlyMap<string, SourceProgress>): Map<string, number> {
  return new Map([...UNITS_BY_LESSON.keys()].map((id) => [id, progress.get(id)?.tracked ?? 0]));
}

/**
 * Tự tích buổi lộ trình N3 khi bài của buổi đó vừa được học HẾT trong app.
 *
 * Trước đây trang /n3 chỉ tích tay: học xong một bài trong app rồi vẫn phải sang
 * /n3 tìm đúng dòng mà tích, quên là phần trăm và nhịp học nói sai. "Học hết" ở
 * đây đúng bằng thanh "Đã học y/y" trên thẻ bài: mọi mục của bài đã vào lịch ôn.
 *
 * Chỉ tích lúc bài CHUYỂN từ chưa hết sang hết, so với lần đọc lịch ôn trước đó:
 *  - bài đã học hết từ trước không bị tích ngược với ngày hôm nay — làm vậy thì
 *    "7 ngày qua học mấy buổi" phình lên bằng những buổi học từ tháng trước;
 *  - người học bỏ tích một buổi thì nó không tự tích lại ở câu trả lời sau.
 *
 * Nạp cùng màn hình luyện tập chứ không lúc mở app (xem `Practice`): lộ trình N3
 * nặng vài chục KB, không đáng đưa vào gói tải đầu chỉ để chờ một câu trả lời.
 */
@Injectable({ providedIn: 'root' })
export class N3AutoTick {
  private readonly reviews = inject(ReviewStore);
  private readonly lessons = inject(LessonStore);
  private readonly n3 = inject(N3ProgressStore);

  /** Mốc so sánh: số mục đã vào lịch của từng bài ở lần đọc trước. */
  private previous = trackedOf(this.reviews.progressBySource());

  /** Buổi vừa được tự tích, để màn kết quả báo lại cho người học. */
  private readonly tickedRef = signal<readonly N3Unit[]>([]);
  readonly ticked = this.tickedRef.asReadonly();

  constructor() {
    effect(() => {
      const progress = this.reviews.progressBySource();
      untracked(() => void this.check(progress));
    });
  }

  clearTicked(): void {
    this.tickedRef.set([]);
  }

  private async check(progress: ReadonlyMap<string, SourceProgress>): Promise<void> {
    // Đổi mốc ngay, trước mọi `await`: câu trả lời kế tiếp có thể chạy lại hàm này
    // trong lúc lượt này còn chờ tải bài.
    const before = this.previous;
    const now = trackedOf(progress);
    this.previous = now;

    for (const [lessonId, units] of UNITS_BY_LESSON) {
      const was = before.get(lessonId) ?? 0;
      const is = now.get(lessonId) ?? 0;
      if (is <= was) continue;

      const total = await this.totalOf(lessonId);
      if (total === 0 || was >= total || is < total) continue;

      const fresh = units.filter((unit) => !this.n3.isDone(unit.id));
      if (fresh.length === 0) continue;
      this.n3.set(fresh.map((unit) => unit.id));
      this.tickedRef.update((list) => [...list, ...fresh]);
    }
  }

  /** Số mục của bài, cùng đơn vị với thẻ ôn — 0 khi bài không vào lịch ôn. */
  private async totalOf(lessonId: string): Promise<number> {
    const lesson = await this.lessons.getLesson(lessonId);
    switch (lesson?.kind) {
      case 'vocabulary':
      case 'verb':
        return lesson.itemCount;
      // Thẻ ôn ngữ pháp là từng CÂU VÍ DỤ, còn `itemCount` đếm mẫu.
      case 'grammar':
        return flattenGrammarExamples(lesson.grammarPoints).length;
      default:
        return 0;
    }
  }
}
