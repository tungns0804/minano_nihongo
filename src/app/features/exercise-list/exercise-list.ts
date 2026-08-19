import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { EXERCISES, ExerciseId, ExerciseInfo } from '../../core/exercises/exercise.model';
import { EXERCISE_VERBS } from '../../core/exercises/exercise-verbs';
import { TRANSITIVITY_PAIRS } from '../../core/exercises/transitive-pairs';
import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import { FavoriteStore } from '../../core/services/favorite-store';

interface ExerciseCard extends ExerciseInfo {
  itemCount: number;
  /** "N5 → N3" — mã JLPT nên không dịch, chỉ ghép lại. */
  levelRange: string;
  favoriteCount: number;
}

/**
 * Tab "Bài tập" — danh sách các bài tập chuyên đề.
 *
 * Vì sao là một tab riêng chứ không phải hai thẻ ngoài trang chủ: trang chủ xếp
 * bài theo giáo trình (bài 1 → bài 50) và có bộ lọc cấp độ tính từ SỐ BÀI, còn
 * hai bài tập này gom động từ của nhiều bài lẫn nhiều cấp theo một chủ đề ngữ
 * pháp — bỏ vào lưới đó thì chúng rơi hết vào ô "Không theo bài".
 */
@Component({
  selector: 'app-exercise-list',
  imports: [RouterLink, T],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseList {
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly lang = inject(LanguageStore);

  readonly t = this.lang.t.bind(this.lang);

  readonly cards = computed<ExerciseCard[]>(() => {
    // Đọc signal counts để số ★ trên thẻ tự cập nhật sau khi luyện xong.
    const counts = this.favoriteStore.counts();
    return EXERCISES.map((info) => ({
      ...info,
      itemCount: itemCountOf(info.id),
      levelRange: `${info.levels[0]} → ${info.levels[info.levels.length - 1]}`,
      favoriteCount: counts[info.id] ?? 0,
    }));
  });
}

function itemCountOf(id: ExerciseId): number {
  return id === 'tu-tha-dong-tu' ? TRANSITIVITY_PAIRS.length : EXERCISE_VERBS.length;
}
