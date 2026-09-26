import type { MessageKey } from '../i18n/messages';
import {
  JLPT_BOOK,
  JLPT_BOOK_NAME,
  JLPT_LEVELS,
  JLPT_RANGE,
  JlptLevel,
  LessonSummary,
  levelOf,
} from './vocabulary.model';

/**
 * Bộ lọc cấp độ dùng chung cho trang chủ (`/`) và tab Ngữ pháp (`/grammar`).
 *
 * Vì sao tách ra khỏi component: từ khi có N3 thì hai tab đều cần đúng bộ lọc này,
 * và nó không còn là mấy dòng viết cứng "N5, N4" nữa mà phải biết cấp nào bám theo
 * số bài 皆の日本語, cấp nào theo 総まとめ. Chép sang tab thứ hai đồng nghĩa với việc
 * thêm cấp thứ tư sau này phải nhớ sửa hai chỗ.
 */

/** 'all', một cấp JLPT, hoặc 'none' cho bài không gắn với bài số nào. */
export type LevelFilter = JlptLevel | 'all' | 'none';

export type LevelCounts = Record<LevelFilter, number>;

export interface LevelOption {
  value: LevelFilter;
  labelKey: MessageKey;
  /** Tham số chèn vào nhãn ("N5 · bài 1–25"); rỗng với mục không cần. */
  params: Record<string, string | number>;
  titleKey?: MessageKey;
  count: number;
}

/**
 * Đếm số bài theo từng cấp.
 *
 * Người gọi truyền vào ĐÚNG phần bài của tab mình, chưa lọc theo từ khoá: con số
 * phải đứng yên khi đang gõ tìm, nếu không người dùng sẽ tưởng bài học vừa biến mất.
 */
export function countByLevel(lessons: readonly LessonSummary[]): LevelCounts {
  const counts = { all: 0, none: 0 } as LevelCounts;
  for (const level of JLPT_LEVELS) counts[level] = 0;

  for (const lesson of lessons) {
    counts.all++;
    counts[levelOf(lesson) ?? 'none']++;
  }
  return counts;
}

/**
 * Các nút chọn cấp độ, theo đúng thứ tự hiển thị.
 *
 * Cấp không có bài nào thì KHÔNG hiện nút — khác với trước, khi N5 và N4 luôn hiện
 * dù có bài hay không. Lý do: tab Ngữ pháp không có bài N5 nào, và trước lúc nạp
 * dữ liệu 総まとめ thì N3 cũng vậy. Một nút xám vĩnh viễn ghi "0" chỉ làm người
 * dùng tưởng có thứ gì đó hỏng.
 */
export function levelFilterOptions(counts: LevelCounts): LevelOption[] {
  const options: LevelOption[] = [
    { value: 'all', labelKey: 'home.level.all', params: {}, count: counts.all },
  ];

  for (const level of JLPT_LEVELS) {
    if (counts[level] === 0) continue;
    const range = JLPT_RANGE[level];
    options.push({
      value: level,
      // Cấp bám theo số bài thì kèm luôn khoảng bài để khỏi phải nhớ N5 gồm những
      // bài nào; cấp theo 総まとめ thì khoảng bài vô nghĩa, ghi tên sách thay vào.
      ...(range
        ? {
            labelKey: 'home.level.range' as MessageKey,
            params: { level, from: range.from, to: range.to },
          }
        : {
            labelKey: 'home.level.book' as MessageKey,
            params: { level, book: JLPT_BOOK_NAME[JLPT_BOOK[level]] },
          }),
      count: counts[level],
    });
  }

  if (counts.none > 0) {
    options.push({
      value: 'none',
      labelKey: 'home.level.none',
      params: {},
      titleKey: 'home.level.noneTitle',
      count: counts.none,
    });
  }

  return options;
}
