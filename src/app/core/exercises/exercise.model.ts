/**
 * Khu "Bài tập" — các bài luyện chuyên đề nằm ngoài giáo trình 皆の日本語.
 *
 * Vì sao tách khỏi bài học: bài học bám theo từng bài trong sách (bài 1, bài 33…),
 * còn hai bài tập động từ ở đây gom động từ của NHIỀU cấp (N5→N3, N5→N2) theo một chủ
 * đề ngữ pháp, và bài ngữ pháp N4 đi theo một tài liệu tổng hợp riêng. Nhét chúng vào
 * lưới bài học ngoài trang chủ thì chúng không thuộc về bài nào cả, mà bộ lọc cấp độ
 * ngoài đó lại chia theo số bài.
 *
 * Dữ liệu nằm thẳng trong mã nguồn (`transitive-pairs.ts`, `exercise-verbs.ts`,
 * `n4-grammar.ts`) chứ không đi qua `data-source/` + `npm run generate`: các bài tập
 * này là chức năng cố định của ứng dụng, không phải nội dung người dùng tự nạp thêm.
 *
 * Bài ngữ pháp N4 có màn hình riêng (`features/n4-grammar`, đường dẫn đăng ký TRƯỚC
 * `/exercise/:id`): nội dung của nó là trang lý thuyết cộng câu ví dụ, không phải bảng
 * động từ như hai bài kia.
 */

import type { MessageKey } from '../i18n/messages';
import type { VerbGroup } from '../japanese/conjugation';

/**
 * Id của bài tập. Dùng làm luôn:
 *  - đoạn cuối đường dẫn `/exercise/<id>`
 *  - khoá lưu danh sách ★ "chưa nhớ" (giống id bài học)
 * nên KHÔNG đổi tuỳ tiện: đổi là mất hết ★ của bài tập đó.
 */
export type ExerciseId = 'tu-tha-dong-tu' | 'chuyen-the-dong-tu' | GrammarBookId;

/**
 * Id các "sách ngữ pháp" (`grammar-books.ts`) — khai ở đây chứ không ở file đó để những
 * chỗ chỉ cần hỏi "đây có phải bài ngữ pháp không" (lịch ôn, nạp lúc khởi động) không
 * phải kéo theo toàn bộ dữ liệu ngữ pháp vào bundle.
 */
export const GRAMMAR_BOOK_IDS = ['ngu-phap-n4'] as const;
export type GrammarBookId = (typeof GRAMMAR_BOOK_IDS)[number];

export function isGrammarBookId(id: string | null | undefined): id is GrammarBookId {
  return (GRAMMAR_BOOK_IDS as readonly (string | null | undefined)[]).includes(id);
}

/**
 * Cấp độ JLPT của một mục trong bài tập.
 *
 * Khác `JlptLevel` của bài học (chỉ N5/N4, suy ra từ SỐ BÀI trong giáo trình):
 * ở đây cấp độ được gán thẳng cho từng động từ và trải tới N2.
 */
export type ExerciseLevel = 'N5' | 'N4' | 'N3' | 'N2';

export const EXERCISE_LEVELS: readonly ExerciseLevel[] = ['N5', 'N4', 'N3', 'N2'];

/** Các chiều hỏi của mọi bài tập, gom vào một kiểu để `PracticeConfig` chỉ cần một trường. */
export type ExerciseMode =
  // Bài 1 — tự động từ ↔ tha động từ
  | 'to-transitive'
  | 'to-intransitive'
  | 'transitivity-mixed'
  // Bài 2 — thể lịch sự ↔ các thể ngắn
  | 'masu-to-form'
  | 'form-to-masu'
  | 'form-mixed'
  // Bài 3 — ngữ pháp N4: lộ trình năm bậc, từng bậc riêng, và hai dạng thêm
  | 'grammar-path'
  | 'pattern-to-meaning'
  | 'meaning-to-pattern'
  | 'example-blank'
  | 'example-order'
  | 'example-vi-jp'
  | 'example-jp-vi'
  | 'meaning-mixed';

export interface ExerciseModeInfo {
  id: ExerciseMode;
  labelKey: MessageKey;
  shortKey: MessageKey;
  exampleKey: MessageKey;
  /** Bậc trong lộ trình dễ → khó của bài ngữ pháp N4 (1–5); 0 với mọi dạng khác. */
  step: number;
}

/** Chiều hỏi của bài "Tự động từ & Tha động từ". */
export const TRANSITIVITY_MODES: readonly ExerciseModeInfo[] = [
  {
    id: 'to-transitive',
    labelKey: 'exercise.mode.toTransitive',
    shortKey: 'exercise.mode.toTransitive.short',
    exampleKey: 'exercise.mode.toTransitive.example',
    step: 0,
  },
  {
    id: 'to-intransitive',
    labelKey: 'exercise.mode.toIntransitive',
    shortKey: 'exercise.mode.toIntransitive.short',
    exampleKey: 'exercise.mode.toIntransitive.example',
    step: 0,
  },
  {
    id: 'transitivity-mixed',
    labelKey: 'exercise.mode.transitivityMixed',
    shortKey: 'exercise.mode.transitivityMixed.short',
    exampleKey: 'exercise.mode.transitivityMixed.example',
    step: 0,
  },
];

/** Chiều hỏi của bài "Chuyển thể động từ". */
export const FORM_MODES: readonly ExerciseModeInfo[] = [
  {
    id: 'masu-to-form',
    labelKey: 'exercise.mode.masuToForm',
    shortKey: 'exercise.mode.masuToForm.short',
    exampleKey: 'exercise.mode.masuToForm.example',
    step: 0,
  },
  {
    id: 'form-to-masu',
    labelKey: 'exercise.mode.formToMasu',
    shortKey: 'exercise.mode.formToMasu.short',
    exampleKey: 'exercise.mode.formToMasu.example',
    step: 0,
  },
  {
    id: 'form-mixed',
    labelKey: 'exercise.mode.formMixed',
    shortKey: 'exercise.mode.formMixed.short',
    exampleKey: 'exercise.mode.formMixed.example',
    step: 0,
  },
];

/**
 * Dạng luyện của bài "Luyện tập ngữ pháp N4", xếp thành một lộ trình năm bậc từ dễ đến
 * khó. Mỗi bậc đòi hỏi nhiều hơn bậc trước một chút:
 *
 *   1. Ngữ pháp → Ý nghĩa   nhận ra mẫu nghĩa là gì (trắc nghiệm)
 *   2. Ý nghĩa → Ngữ pháp   nhớ ra mẫu từ ý nghĩa (trắc nghiệm)
 *   3. Điền vào chỗ trống   chọn mẫu hợp với một câu cụ thể (trắc nghiệm)
 *   4. Sắp xếp câu          ghép mảnh thành câu dùng mẫu đó (bấm chọn mảnh)
 *   5. Dịch Việt → Nhật     tự viết cả câu (gõ)
 *
 * Trước đây chỉ có bậc 1–2 và bậc 5: nhảy thẳng từ chọn một trong bốn ý nghĩa sang gõ
 * cả câu tiếng Nhật là hụt hẳn hai nấc ở giữa, đúng chỗ người học thấy "không biết bắt
 * đầu từ đâu". `grammar-path` đi lần lượt cả năm bậc cho từng mục.
 *
 * Phần ý nghĩa là TRẮC NGHIỆM: ý nghĩa là một câu mô tả dài, gõ lại cho khớp từng chữ
 * thì là đánh đố chứ không còn là nhớ ngữ pháp.
 */
export const N4_PATH_MODE: ExerciseModeInfo = {
  id: 'grammar-path',
  labelKey: 'exercise.mode.grammarPath',
  shortKey: 'exercise.mode.grammarPath.short',
  exampleKey: 'exercise.mode.grammarPath.example',
  step: 0,
};

export const N4_STEP_MODES: readonly ExerciseModeInfo[] = [
  {
    id: 'pattern-to-meaning',
    labelKey: 'exercise.mode.patternToMeaning',
    shortKey: 'exercise.mode.patternToMeaning.short',
    exampleKey: 'exercise.mode.patternToMeaning.example',
    step: 1,
  },
  {
    id: 'meaning-to-pattern',
    labelKey: 'exercise.mode.meaningToPattern',
    shortKey: 'exercise.mode.meaningToPattern.short',
    exampleKey: 'exercise.mode.meaningToPattern.example',
    step: 2,
  },
  {
    id: 'example-blank',
    labelKey: 'exercise.mode.exampleBlank',
    shortKey: 'exercise.mode.exampleBlank.short',
    exampleKey: 'exercise.mode.exampleBlank.example',
    step: 3,
  },
  {
    id: 'example-order',
    labelKey: 'exercise.mode.exampleOrder',
    shortKey: 'exercise.mode.exampleOrder.short',
    exampleKey: 'exercise.mode.exampleOrder.example',
    step: 4,
  },
  {
    id: 'example-vi-jp',
    labelKey: 'exercise.mode.exampleViJp',
    shortKey: 'exercise.mode.exampleViJp.short',
    exampleKey: 'exercise.mode.exampleViJp.example',
    step: 5,
  },
];

/** Hai dạng nằm ngoài lộ trình: dịch ngược để hiểu câu, và ôn ý nghĩa cả hai chiều. */
export const N4_EXTRA_MODES: readonly ExerciseModeInfo[] = [
  {
    id: 'example-jp-vi',
    labelKey: 'exercise.mode.exampleJpVi',
    shortKey: 'exercise.mode.exampleJpVi.short',
    exampleKey: 'exercise.mode.exampleJpVi.example',
    step: 0,
  },
  {
    id: 'meaning-mixed',
    labelKey: 'exercise.mode.meaningMixed',
    shortKey: 'exercise.mode.meaningMixed.short',
    exampleKey: 'exercise.mode.meaningMixed.example',
    step: 0,
  },
];

export const N4_GRAMMAR_MODES: readonly ExerciseModeInfo[] = [N4_PATH_MODE, ...N4_STEP_MODES, ...N4_EXTRA_MODES];

const ALL_MODES: readonly ExerciseModeInfo[] = [
  ...TRANSITIVITY_MODES,
  ...FORM_MODES,
  ...N4_GRAMMAR_MODES,
];

export function exerciseModeInfo(id: ExerciseMode): ExerciseModeInfo {
  return ALL_MODES.find((mode) => mode.id === id) ?? ALL_MODES[0];
}

/** Chiều hỏi mặc định của từng bài tập, cũng là chiều hợp lệ đầu tiên. */
export const DEFAULT_MODE: Record<ExerciseId, ExerciseMode> = {
  'tu-tha-dong-tu': 'to-transitive',
  'chuyen-the-dong-tu': 'masu-to-form',
  // Lộ trình chứ không phải bậc khó nhất: người mới mở bài ra mà gặp ngay dạng gõ cả
  // câu tiếng Nhật thì chỉ thấy mình chưa biết gì.
  'ngu-phap-n4': 'grammar-path',
};

/** Dạng luyện ý nghĩa (trắc nghiệm) của bài ngữ pháp N4 — đơn vị hỏi là MẪU chứ không phải câu. */
export function isMeaningMode(mode: ExerciseMode): boolean {
  return mode === 'pattern-to-meaning' || mode === 'meaning-to-pattern' || mode === 'meaning-mixed';
}

/** Dạng dịch câu ví dụ (gõ cả câu) của bài ngữ pháp N4. */
export function isTranslationMode(mode: ExerciseMode): boolean {
  return mode === 'example-vi-jp' || mode === 'example-jp-vi';
}

/** Chiều này có cần chọn thể để hỏi không (chỉ bài chuyển thể mới cần). */
export function modeNeedsForms(mode: ExerciseMode): boolean {
  return mode === 'masu-to-form' || mode === 'form-to-masu' || mode === 'form-mixed';
}

/**
 * Chiều "trộn" sinh HAI câu cho mỗi mục (một chiều xuôi, một chiều ngược) chứ
 * không bốc ngẫu nhiên một chiều: bốc ngẫu nhiên thì số câu mỗi lần luyện một
 * khác, mà dòng "sẽ luyện N câu" ở màn thiết lập lại phải nói trước con số đó.
 */
export function modeQuestionsPerItem(mode: ExerciseMode): number {
  return mode === 'transitivity-mixed' || mode === 'form-mixed' || mode === 'meaning-mixed' ? 2 : 1;
}

/** Mô tả một bài tập, dùng để dựng thẻ ở trang danh sách. */
export interface ExerciseInfo {
  id: ExerciseId;
  nameKey: MessageKey;
  descKey: MessageKey;
  /** Khoá đếm số mục ("{count} cặp động từ" / "{count} động từ" / "{count} mẫu ngữ pháp"). */
  unitKey: MessageKey;
  /** Khoảng cấp độ bài tập phủ tới, hiện trên thẻ. */
  levels: readonly ExerciseLevel[];
}

export const EXERCISES: readonly ExerciseInfo[] = [
  {
    id: 'tu-tha-dong-tu',
    nameKey: 'exercise.transitivity.name',
    descKey: 'exercise.transitivity.desc',
    unitKey: 'exercise.pairCount',
    levels: ['N5', 'N4', 'N3'],
  },
  {
    id: 'chuyen-the-dong-tu',
    nameKey: 'exercise.forms.name',
    descKey: 'exercise.forms.desc',
    unitKey: 'exercise.verbCount',
    levels: ['N5', 'N4', 'N3', 'N2'],
  },
  {
    id: 'ngu-phap-n4',
    nameKey: 'exercise.n4grammar.name',
    descKey: 'exercise.n4grammar.desc',
    unitKey: 'exercise.patternCount',
    levels: ['N4'],
  },
];

export function exerciseInfo(id: string): ExerciseInfo | null {
  return EXERCISES.find((item) => item.id === id) ?? null;
}

/** Một vế của cặp tự/tha động từ. */
export interface PairedVerb {
  /** Thể ます, ví dụ "開けます". */
  masu: string;
  /** Thể ます viết toàn kana, ví dụ "あけます" — cũng được chấp nhận khi gõ đáp án. */
  reading: string;
  group: VerbGroup;
  /** Nghĩa tiếng Việt của RIÊNG vế này (hai vế nghĩa khác nhau). */
  meaning: string;
}

/**
 * Một cặp tự động từ (自動詞) — tha động từ (他動詞).
 *
 * `id` là chính thể ます của vế tự động từ: vừa ổn định vừa đọc được khi soi
 * localStorage, và không cặp nào trùng vế tự động từ với cặp khác.
 */
export interface TransitivityPair {
  id: string;
  level: ExerciseLevel;
  intransitive: PairedVerb;
  transitive: PairedVerb;
}

/** Một động từ trong bài "Chuyển thể động từ". */
export interface ExerciseVerb {
  /** Chính thể ます — xem ghi chú về `id` ở `TransitivityPair`. */
  id: string;
  masu: string;
  /** Thể ます viết toàn kana. Dùng để chia ra các thể kana và để tra cứu. */
  reading: string;
  meaning: string;
  group: VerbGroup;
  level: ExerciseLevel;
  /**
   * Nhóm 1 nhưng hình dạng dễ bị nhầm sang nhóm 2 (帰ります, 入ります, 走ります…).
   * Chỉ để gắn nhãn và lọc riêng ra luyện, không ảnh hưởng cách chia.
   */
  deceptive: boolean;
}
