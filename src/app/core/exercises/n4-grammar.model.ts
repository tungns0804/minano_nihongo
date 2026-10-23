/**
 * Bài tập "Luyện tập ngữ pháp N4" — kiểu dữ liệu và các hàm thuần.
 *
 * Nội dung nằm ở `n4-grammar.ts`, chép từ tài liệu "TỔNG HỢP NGỮ PHÁP N4" và giữ
 * đúng cách chia của tài liệu: mỗi MỤC (`N4Section`) là một đầu mục trong mục lục,
 * gồm một hay vài MẪU (`N4Point`). Mẫu mới là đơn vị luyện ý nghĩa; câu ví dụ của mọi
 * mẫu là đơn vị luyện dịch.
 *
 * Câu ví dụ viết theo cú pháp của khu Luyện dịch (`core/translation/markup.ts`):
 *
 *   {漢字|かな}  tài liệu ghi cách đọc trong ngoặc ngay sau chữ Hán — 春（はる）. Đổi
 *              sang cú pháp này thì vừa hiện được furigana, vừa chấm đúng khi người
 *              học gõ chữ Hán, gõ kana hay gõ lẫn.
 *   [a/b]      tài liệu ghi hai cách nói bằng dấu "/" — いつ/何時に. Hiện nguyên như
 *              tài liệu, gõ cách nào cũng đúng.
 *   [a/]       phần có thể bỏ, tài liệu ghi trong ngoặc — 場合（は）.
 *
 * Thêm một ký hiệu riêng của bài này, bóc ra ngay lúc nạp dữ liệu (`n4-grammar.ts`)
 * nên không bao giờ tới được bộ chấm hay màn hình:
 *
 *   《…》       phần ngữ pháp của câu — chỗ trống của bài "Điền vào chỗ trống". Một câu
 *              có thể có vài chỗ (～し、～し). 《…@id-mẫu》 khi câu nằm ở mục so sánh mà
 *              chỗ trống thuộc về một mẫu khác (「～たら」 và 「～ば」 → @ba).
 *
 * Không đi qua `data-source/` + `npm run generate`, cùng lý do với hai bài tập kia
 * (xem `exercise.model.ts`): đây là một bài tập cố định của ứng dụng.
 */

import type { GrammarTable } from '../lessons/vocabulary.model';

/** Một câu ví dụ, đem ra luyện dịch được. */
export interface N4Example {
  /**
   * Băm từ câu tiếng Nhật ở dạng chữ Hán (`plainText`), như id câu ví dụ của bài ngữ
   * pháp: sửa bản dịch hay sửa cách đọc thì id giữ nguyên, ★ và lịch ôn không mất.
   */
  id: string;
  /** Câu tiếng Nhật theo cú pháp ở đầu file. */
  japanese: string;
  /** Bản dịch; dùng được [a/b] và [a/] như câu tiếng Nhật. */
  vietnamese: string;
  /** Lời giải thích của tài liệu cho riêng câu này. Rỗng nếu không có. */
  note: string;
  /**
   * Cách nói khác mà tài liệu coi là tương đương (若いとき、お母さんは… / お母さんは若い
   * とき…). Không in thành câu chính, nhưng gõ ra thì vẫn đúng và được liệt kê sau khi
   * chấm — cùng một câu tiếng Việt mà chỉ nhận một cách nói thì là bắt bẻ.
   */
  japaneseAlt: string[];
  /** Như `japaneseAlt`, cho bản dịch — ví dụ câu "Nguyên văn: …" tài liệu ghi kèm. */
  vietnameseAlt: string[];
  /** Câu đục lỗ cho bài "Điền vào chỗ trống"; null nếu câu không đánh dấu 《…》. */
  blank: N4Blank | null;
  /**
   * Các mảnh cho bài "Sắp xếp câu", theo đúng thứ tự trong câu (`chunksOf`). Rỗng khi
   * câu quá ngắn — hai mảnh thì sắp xếp chỉ còn là đoán.
   */
  chunks: string[];
}

/** Câu ví dụ đã đục phần ngữ pháp. */
export interface N4Blank {
  /** Mẫu mà chỗ trống thuộc về — đáp án của câu hỏi. Luôn là một mẫu có ý nghĩa. */
  pointId: string;
  /** Câu hỏi: câu ví dụ, phần ngữ pháp thay bằng `BLANK_MARK`. Vẫn theo cú pháp câu mẫu. */
  prompt: string;
  /** Phần bị đục, dạng chữ thường; nhiều chỗ thì nối bằng " … ". */
  filled: string;
}

/** Ô trống trong câu hỏi — cùng kiểu với phần "Bài luyện tập" của tài liệu. */
export const BLANK_MARK = '（　　）';

/** Một nhóm câu ví dụ — một "cách dùng" của mẫu, hoặc đơn giản là phần "Ví dụ". */
export interface N4Usage {
  /** Tên cách dùng như trong tài liệu. Rỗng thì màn hình ghi "Ví dụ". */
  title: string;
  detail: string;
  /**
   * Nhóm câu đặt cạnh nhau chỉ để ĐỐI CHIẾU (書いてください / 書いて / 書きなさい…):
   * hiện ra để đọc nhưng không đem ra luyện. Các câu đó dịch ra tiếng Việt gần như
   * trùng nhau, và phần lớn không dùng chính mẫu đang học — gợi ý mẫu ngữ pháp dưới
   * câu hỏi sẽ dẫn người học viết sai.
   */
  reference: boolean;
  examples: N4Example[];
}

/** Câu tài liệu đưa ra làm ví dụ SAI — chỉ để đọc, không bao giờ đem ra luyện. */
export interface N4WrongExample {
  japanese: string;
  note: string;
}

export interface N4Point {
  /** Khoá ★ và khoá lịch ôn của mẫu khi luyện ý nghĩa. Không đổi tuỳ tiện. */
  id: string;
  /** Tên mẫu, ví dụ "～ながら". */
  pattern: string;
  /**
   * Ý nghĩa ngắn gọn, rút từ lời giải thích của tài liệu — vế còn lại của câu hỏi
   * "ngữ pháp ↔ ý nghĩa". Rỗng với khối chỉ để so sánh / tra cứu, khối đó không vào
   * phần luyện ý nghĩa.
   */
  meaning: string;
  /**
   * Nhóm mẫu dễ nhầm với nhau (ば / たら / と / なら…). Câu trắc nghiệm ý nghĩa ưu tiên
   * lấy đáp án nhiễu trong cùng nhóm — phân biệt chúng mới là chỗ khó. Rỗng nếu không.
   */
  group: string;
  structures: string[];
  explanation: string[];
  /** Bảng của tài liệu. Ô trong bảng cũng viết được theo cú pháp ở đầu file. */
  tables: GrammarTable[];
  notes: string[];
  wrong: N4WrongExample[];
  usages: N4Usage[];
}

/** Một câu trong phần "Bài luyện tập" của tài liệu. */
export interface N4QuizItem {
  /** Băm từ câu hỏi — khoá ★ khi câu này được đem ra luyện. */
  id: string;
  /** Câu hỏi, viết theo cú pháp ở đầu file; chỗ trống ghi là （　）. */
  prompt: string;
  options: string[];
  /** Đáp án chép nguyên văn phần "ĐÁP ÁN" của tài liệu. */
  answer: string;
  /** Chú thích từ vựng của tài liệu. Rỗng nếu không có. */
  note: string;
}

export interface N4Quiz {
  instruction: string;
  items: N4QuizItem[];
}

export interface N4Section {
  /** Đoạn cuối của khoá chọn mục — ổn định, không đổi tuỳ tiện. */
  id: string;
  /** Số thứ tự trong tài liệu, đếm từ 1. */
  number: number;
  title: string;
  /** Đoạn mở đầu chung cho cả mục, trước mẫu đầu tiên. */
  intro: string[];
  points: N4Point[];
  /** "Bài luyện tập" kèm đáp án của tài liệu; chỉ một mục có. */
  quiz: N4Quiz | null;
  /**
   * Trang gốc khi mục chỉ là phần tóm lược của một trang web (bộ vnjpclub): màn hình
   * hiện link "xem giải thích đầy đủ". Rỗng với tài liệu chép đủ.
   */
  source: string;
}

/** Một câu ví dụ kèm đường dẫn ngược lên mẫu và mục chứa nó. */
export interface N4ExampleRef {
  example: N4Example;
  usage: N4Usage;
  point: N4Point;
  section: N4Section;
}

/** Một mẫu kèm mục chứa nó. */
export interface N4PointRef {
  point: N4Point;
  section: N4Section;
}

/**
 * Trải phẳng các câu ví dụ đem ra luyện, giữ thứ tự trong tài liệu.
 *
 * Bỏ qua nhóm chỉ để đối chiếu (`N4Usage.reference`). Phần so sánh của tài liệu còn
 * nhắc lại vài câu đã có ở trên (風邪をひかないように…): cùng câu thì cùng id, nên chỉ
 * giữ lần xuất hiện ĐẦU — một phiên luyện không hỏi hai lần cùng một câu.
 */
export function flattenN4Examples(sections: readonly N4Section[]): N4ExampleRef[] {
  const seen = new Set<string>();
  const out: N4ExampleRef[] = [];
  for (const section of sections) {
    for (const point of section.points) {
      for (const usage of point.usages) {
        if (usage.reference) continue;
        for (const example of usage.examples) {
          if (seen.has(example.id)) continue;
          seen.add(example.id);
          out.push({ example, usage, point, section });
        }
      }
    }
  }
  return out;
}

/** Câu ví dụ đem ra luyện mà có chỗ trống để điền. */
export function blankExamples(sections: readonly N4Section[]): N4ExampleRef[] {
  return flattenN4Examples(sections).filter((ref) => ref.example.blank !== null);
}

/** Câu ví dụ đem ra luyện mà đủ dài để sắp xếp. */
export function orderExamples(sections: readonly N4Section[]): N4ExampleRef[] {
  return flattenN4Examples(sections).filter((ref) => ref.example.chunks.length > 0);
}

/** Một câu trong "Bài luyện tập" của tài liệu kèm mục chứa nó. */
export interface N4QuizRef {
  item: N4QuizItem;
  section: N4Section;
}

export function quizItems(sections: readonly N4Section[]): N4QuizRef[] {
  return sections.flatMap((section) => (section.quiz?.items ?? []).map((item) => ({ item, section })));
}

/** Các mẫu có ý nghĩa để luyện, theo thứ tự trong tài liệu. */
export function meaningPoints(sections: readonly N4Section[]): N4PointRef[] {
  return sections.flatMap((section) =>
    section.points.filter((point) => point.meaning).map((point) => ({ point, section })),
  );
}
