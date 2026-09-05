import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { T } from '../../core/i18n/t';
import { LessonBrowser } from '../../core/screens/lesson-browser';
import { TOPIC_CATALOG } from '../../core/topics/topic-catalog';
import { normalizeSearch } from '../../core/utils/lesson-search';
import { SearchBox } from '../../shared/search-box';

/** Một thẻ chủ đề, đã trộn sẵn phần khai tay với phần dữ liệu sinh. */
interface TopicRow {
  /** Id chủ đề — cũng là đoạn cuối `/topic/<id>` và khoá lưu ★. */
  id: string;
  icon: string;
  japanese: string;
  vietnamese: string;
  description: string;
  wordCount: number;
  /** Chủ đề này gom từ của bao nhiêu bài khác nhau. */
  sourceCount: number;
  /** Chuỗi đã chuẩn hoá để tìm kiếm, tính sẵn một lần. */
  haystack: string;
}

/**
 * Tab "Từ vựng theo chủ đề" — lưới 20 chủ đề.
 *
 * KHÔNG có trạng thái tải và KHÔNG có khung lỗi, khác hẳn trang chủ: nội dung
 * chủ đề nằm thẳng trong mã nguồn (`core/topics/`) nên nó có mặt ngay lúc trang
 * vẽ ra, không đi qua mạng, không hỏng được. Vẽ khung chờ ở đây thì đó là một
 * khung chờ vĩnh viễn không bao giờ chờ gì cả.
 *
 * Cũng KHÔNG có bộ lọc cấp độ: mỗi chủ đề gom từ của cả N5, N4 lẫn N3 nên không
 * chủ đề nào thuộc về một cấp — xem ghi chú trong `buildTopicLessons`.
 *
 * Ô tìm và cách đếm ★ trên thẻ đến từ `LessonBrowser`.
 */
@Component({
  selector: 'app-topic-list',
  imports: [RouterLink, SearchBox, T],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopicList extends LessonBrowser {
  /**
   * Toàn bộ chủ đề, dựng một lần từ DANH MỤC NHẸ.
   *
   * Trang này cố tình không đụng tới `topic-entries.ts`: nó chỉ vẽ 20 cái thẻ,
   * mà nhập file kia là kéo theo cả 130 KB từ vựng chưa ai cần tới. Từ vựng chỉ
   * được nạp khi bấm vào một chủ đề — xem `LessonStore.getLesson`.
   *
   * Không phải `computed`: nguồn của nó là hằng số ở tầng module nên không có gì
   * để tính lại. Chỉ phần lọc theo từ khoá bên dưới mới cần tính lại.
   */
  private readonly allTopics: readonly TopicRow[] = TOPIC_CATALOG.map((topic): TopicRow => ({
    id: topic.id,
    icon: topic.icon,
    japanese: topic.japanese,
    vietnamese: topic.vietnamese,
    description: topic.description,
    wordCount: topic.wordCount,
    sourceCount: topic.sourceCount,
    // Tìm được cả bằng tiếng Nhật lẫn tiếng Việt không dấu ("gia dinh", "家族").
    haystack: normalizeSearch(
      `${topic.japanese} ${topic.vietnamese} ${topic.description} ${topic.id}`,
    ),
  }));

  readonly topics = computed<readonly TopicRow[]>(() => {
    const needle = this.needle();
    if (!needle) return this.allTopics;
    // Khớp theo TỪNG TỪ, giống ô tìm bài ngoài trang chủ: gõ "do dung nha" vẫn ra
    // "Nhà cửa & đồ dùng trong nhà" dù hai phần đó cách nhau mấy chữ.
    const parts = needle.split(' ');
    return this.allTopics.filter((topic) => parts.every((part) => topic.haystack.includes(part)));
  });

  readonly noMatch = computed(() => this.topics().length === 0);

  readonly visibleWordCount = computed(() =>
    this.topics().reduce((sum, topic) => sum + topic.wordCount, 0),
  );

}
