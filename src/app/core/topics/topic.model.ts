/**
 * Khu "Từ vựng theo chủ đề" — kho từ của ứng dụng cắt lại theo CHỦ ĐỀ.
 *
 * Vì sao cần một cách gom thứ hai: giáo trình xếp từ theo thứ tự DẠY (bài 7 có
 * 父 và 母, bài 11 có 兄 và 姉, bài 39 có 恋人), còn đề JLPT N3 hỏi theo TÌNH
 * HUỐNG — một bài đọc về gia đình dùng cả ba nhóm từ đó cùng lúc. Học theo bài
 * thì tới lúc thi phải tự ghép lại trong đầu; khu này ghép sẵn.
 *
 * ── Từ ở đâu ra ───────────────────────────────────────────────────────────
 * KHÔNG có từ nào chép tay ở đây. Mỗi chủ đề chỉ khai một DANH SÁCH TỪ TIẾNG
 * NHẬT (xem `topic-list.ts`); `npm run generate:topics` tra từng từ đó trong
 * chính kho từ của ứng dụng (`data-source/<bài>/vocabulary.txt`) rồi sinh ra
 * `topic-words.ts` với đủ âm Hán Việt, cách đọc, nghĩa và câu ví dụ.
 *
 * Ba hệ quả của cách làm đó, đều là lý do chọn nó:
 *  - Không đẻ ra dữ liệu mới: nghĩa của một từ ở chủ đề và ở bài học luôn khớp
 *    nhau vì chỉ có MỘT bản gốc. Sửa nghĩa trong data-source là cả hai nơi đổi.
 *  - Không bịa: khai một từ không có trong kho thì script BÁO LỖI và dừng, chứ
 *    không lặng lẽ bỏ qua để rồi chủ đề thiếu từ mà không ai biết.
 *  - Phát âm dùng lại được ngay: file mp3 đặt tên theo chuỗi đem đọc (xem
 *    `core/audio/vocab-audio.ts`), mà chuỗi đó y hệt bài gốc.
 *
 * ── Ba màn hình dùng dữ liệu này ──────────────────────────────────────────
 *  - `/topic`      lưới chủ đề.
 *  - `/topic/:id`  bảng từ + khung luyện tập, dùng CHUNG component với bài học
 *                  thường (`features/lesson-detail`) — chủ đề là một `Lesson`
 *                  đầy đủ, chỉ khác `kind`.
 *  - `/practice`   phiên luyện đi qua đúng `PracticeConfig` như bài từ vựng.
 *
 * ── Năm file, và vì sao phải tách ra ──────────────────────────────────────
 *  - `topic.model.ts`   kiểu + hàm dựng. Không chứa dữ liệu.
 *  - `topic-list.ts`    KHAI TAY: tên, mô tả, biểu tượng, danh sách từ. Chỉ
 *                       script đọc file này, mã ứng dụng KHÔNG nhập nó.
 *  - `topic-catalog.ts` SINH TỰ ĐỘNG, nhẹ (~2 KB): id + tên + số từ của 20 chủ
 *                       đề. Lưới chủ đề và `LessonStore` chỉ cần bấy nhiêu.
 *  - `topic-words.ts`   SINH TỰ ĐỘNG, nặng (~130 KB): toàn bộ từ.
 *  - `topic-entries.ts` dựng `Lesson` từ hai file sinh; NẠP ĐỘNG, chỉ khi người
 *                       dùng thật sự mở một chủ đề.
 *
 * Tách nhẹ/nặng là có chủ ý: `LessonStore` là service gốc, nên nhập thẳng phần
 * nặng vào đó sẽ kéo 130 KB từ vựng chủ đề vào mọi trang — kể cả trang chủ, nơi
 * không hiện chủ đề nào cả.
 */

import type { Lesson, LessonSummary, VocabularyWord } from '../models/vocabulary.model';

/**
 * Một chủ đề, phần khai bằng tay.
 *
 * `words` chỉ là các chuỗi TIẾNG NHẬT đúng như chúng nằm trong kho từ — script
 * sinh dữ liệu tra phần còn lại. Xem ghi chú đầu file về lý do.
 */
export interface TopicDef {
  /**
   * Id chủ đề — CŨNG LÀ id bài học, và cũng là đoạn cuối `/topic/<id>`.
   *
   * Ba thứ đó là một chuỗi duy nhất chứ không phải ba chuỗi phải khớp nhau, vì
   * cả ba đều là khoá: `LessonStore` tra bài theo id, ★ lưu theo id, và địa chỉ
   * trang cũng mang id. Tách chúng ra (ví dụ thêm tiền tố cho id bài học) thì mở
   * cùng một chủ đề bằng hai đường sẽ ra hai kho ★ khác nhau — hỏng lặng lẽ.
   *
   * Cái giá là id chủ đề không được đụng id bài nào trong `data-source/`;
   * `npm run generate:topics` kiểm tra đúng điều đó và dừng nếu đụng.
   *
   * KHÔNG đổi tuỳ tiện: đổi là mất hết ★ của chủ đề đó.
   */
  id: string;
  /** Tên chủ đề bằng tiếng Nhật, ví dụ "家族・人間関係". */
  japanese: string;
  /** Tên chủ đề bằng tiếng Việt, ví dụ "Gia đình & người thân". */
  vietnamese: string;
  /** Một dòng nói rõ chủ đề gồm những gì, hiện dưới tên thẻ. */
  description: string;
  /** Biểu tượng của thẻ chủ đề. Thuần trang trí nên luôn `aria-hidden`. */
  icon: string;
  /** Các từ thuộc chủ đề, viết đúng như trong kho từ. */
  words: readonly string[];
}

/**
 * Một từ đã tra xong, ở dạng nén do `npm run generate:topics` sinh ra.
 *
 * [tiếng Nhật, cách đọc, âm Hán Việt, nghĩa, câu ví dụ, id bài gốc]
 *
 * Mảng chứ không phải object: `topic-words.ts` là file sinh tự động dài hơn một
 * nghìn dòng, viết bằng object thì tên trường lặp lại ở mỗi dòng và file phình
 * lên gấp ba mà không nói thêm điều gì.
 */
export type TopicWordSeed = readonly [
  japanese: string,
  reading: string,
  hanViet: string,
  vietnamese: string,
  example: string,
  sourceLesson: string,
];

/** Một chủ đề đã tra xong. */
export type TopicSeed = readonly [id: string, words: readonly TopicWordSeed[]];

/**
 * Một dòng trong danh mục chủ đề — phần NHẸ, đủ để vẽ thẻ và để `LessonStore`
 * biết có những chủ đề nào mà chưa phải nạp một từ vựng nào.
 *
 * Cũng do `npm run generate:topics` sinh ra chứ không phải bản chép tay thứ hai
 * của `topic-list.ts`: sinh thì `--check` bắt được lệch, chép tay thì không.
 */
export interface TopicCatalogEntry {
  /** Id chủ đề = id bài học = đoạn cuối `/topic/<id>`. */
  id: string;
  japanese: string;
  vietnamese: string;
  description: string;
  icon: string;
  /** Số từ của chủ đề. */
  wordCount: number;
  /** Chủ đề này gom từ của bao nhiêu bài khác nhau. */
  sourceCount: number;
}

/**
 * Tên hiển thị của chủ đề: tiếng Nhật trước, tiếng Việt sau.
 *
 * Ghép sẵn thành MỘT chuỗi chứ không dịch theo ngôn ngữ giao diện, đúng như tên
 * các bài học khác ("皆の日本語 — Bài 26 · Từ vựng"): tên bài là DỮ LIỆU, nó đi
 * vào màn hình kết quả và vào lịch sử phiên luyện, nên phải đứng yên khi người
 * dùng bấm nút đổi ngôn ngữ.
 */
export function topicLessonName(topic: Pick<TopicDef, 'japanese' | 'vietnamese'>): string {
  return `${topic.japanese} · ${topic.vietnamese}`;
}

/** Dòng tóm tắt của một chủ đề, để `LessonStore` gộp vào danh sách bài. */
export function topicSummary(entry: TopicCatalogEntry): LessonSummary {
  return {
    id: entry.id,
    name: topicLessonName(entry),
    description: entry.description,
    kind: 'topic',
    itemCount: entry.wordCount,
    origin: 'builtin',
  };
}

/**
 * Dựng danh sách bài học đầy đủ từ phần khai tay và phần script sinh.
 *
 * Chủ đề nào không có dữ liệu sinh (mới thêm vào `topic-list.ts` mà chưa chạy
 * `npm run generate:topics`) thì bị BỎ QUA thay vì dựng một bài rỗng: một thẻ
 * "0 từ" ngoài lưới chủ đề chỉ làm người dùng tưởng ứng dụng hỏng.
 */
export function buildTopicLessons(
  defs: readonly TopicCatalogEntry[],
  seeds: readonly TopicSeed[],
): Lesson[] {
  const wordsById = new Map(seeds.map(([id, words]) => [id, words]));

  return defs.flatMap((topic): Lesson[] => {
    const seed = wordsById.get(topic.id);
    if (!seed || seed.length === 0) return [];

    const words = seed.map(buildTopicWord);
    return [
      {
        id: topic.id,
        name: topicLessonName(topic),
        description: topic.description,
        kind: 'topic',
        itemCount: words.length,
        // KHÔNG có `lessonNumber` và `level`: một chủ đề gom từ của cả N5, N4 lẫn
        // N3 nên gán cho nó một cấp là nói dối. Bộ lọc cấp độ vì thế cũng không
        // có mặt ở tab này — xem `features/topic-list`.
        words,
        verbs: [],
        lines: [],
        grammarPoints: [],
        origin: 'builtin',
      },
    ];
  });
}

/**
 * Id của từ trong phạm vi một chủ đề.
 *
 * Băm theo cùng công thức với `vocabulary-parser.ts` thì tiện hơn, nhưng ở đây
 * chỉ cần DUY NHẤT TRONG MỘT CHỦ ĐỀ (★ lưu theo từng bài), mà chuỗi tiếng Nhật
 * đã đủ duy nhất — script sinh dữ liệu đã loại trùng. Dùng thẳng chuỗi đó làm id
 * thì soi localStorage còn đọc được là từ nào.
 */
function buildTopicWord([japanese, reading, hanViet, vietnamese, example]: TopicWordSeed): VocabularyWord {
  return { id: japanese, japanese, reading, hanViet, vietnamese, example };
}
