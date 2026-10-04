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
export type ExerciseId = 'tu-tha-dong-tu' | 'chuyen-the-dong-tu' | 'ngu-phap-n4';

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
  // Bài 3 — ngữ pháp N4: dịch câu ví dụ, và ngữ pháp ↔ ý nghĩa
  | 'example-vi-jp'
  | 'example-jp-vi'
  | 'pattern-to-meaning'
  | 'meaning-to-pattern'
  | 'meaning-mixed';

export interface ExerciseModeInfo {
  id: ExerciseMode;
  labelKey: MessageKey;
  shortKey: MessageKey;
  exampleKey: MessageKey;
}

/** Chiều hỏi của bài "Tự động từ & Tha động từ". */
export const TRANSITIVITY_MODES: readonly ExerciseModeInfo[] = [
  {
    id: 'to-transitive',
    labelKey: 'exercise.mode.toTransitive',
    shortKey: 'exercise.mode.toTransitive.short',
    exampleKey: 'exercise.mode.toTransitive.example',
  },
  {
    id: 'to-intransitive',
    labelKey: 'exercise.mode.toIntransitive',
    shortKey: 'exercise.mode.toIntransitive.short',
    exampleKey: 'exercise.mode.toIntransitive.example',
  },
  {
    id: 'transitivity-mixed',
    labelKey: 'exercise.mode.transitivityMixed',
    shortKey: 'exercise.mode.transitivityMixed.short',
    exampleKey: 'exercise.mode.transitivityMixed.example',
  },
];

/** Chiều hỏi của bài "Chuyển thể động từ". */
export const FORM_MODES: readonly ExerciseModeInfo[] = [
  {
    id: 'masu-to-form',
    labelKey: 'exercise.mode.masuToForm',
    shortKey: 'exercise.mode.masuToForm.short',
    exampleKey: 'exercise.mode.masuToForm.example',
  },
  {
    id: 'form-to-masu',
    labelKey: 'exercise.mode.formToMasu',
    shortKey: 'exercise.mode.formToMasu.short',
    exampleKey: 'exercise.mode.formToMasu.example',
  },
  {
    id: 'form-mixed',
    labelKey: 'exercise.mode.formMixed',
    shortKey: 'exercise.mode.formMixed.short',
    exampleKey: 'exercise.mode.formMixed.example',
  },
];

/**
 * Dạng luyện của bài "Luyện tập ngữ pháp N4".
 *
 * Hai dạng đầu dịch câu ví dụ, gõ đáp án như bài ngữ pháp 皆の日本語. Ba dạng sau luyện
 * ý nghĩa của từng mẫu và là TRẮC NGHIỆM: ý nghĩa là một câu mô tả dài, gõ lại cho khớp
 * từng chữ thì là đánh đố chứ không còn là nhớ ngữ pháp.
 */
export const N4_GRAMMAR_MODES: readonly ExerciseModeInfo[] = [
  {
    id: 'example-vi-jp',
    labelKey: 'exercise.mode.exampleViJp',
    shortKey: 'exercise.mode.exampleViJp.short',
    exampleKey: 'exercise.mode.exampleViJp.example',
  },
  {
    id: 'example-jp-vi',
    labelKey: 'exercise.mode.exampleJpVi',
    shortKey: 'exercise.mode.exampleJpVi.short',
    exampleKey: 'exercise.mode.exampleJpVi.example',
  },
  {
    id: 'pattern-to-meaning',
    labelKey: 'exercise.mode.patternToMeaning',
    shortKey: 'exercise.mode.patternToMeaning.short',
    exampleKey: 'exercise.mode.patternToMeaning.example',
  },
  {
    id: 'meaning-to-pattern',
    labelKey: 'exercise.mode.meaningToPattern',
    shortKey: 'exercise.mode.meaningToPattern.short',
    exampleKey: 'exercise.mode.meaningToPattern.example',
  },
  {
    id: 'meaning-mixed',
    labelKey: 'exercise.mode.meaningMixed',
    shortKey: 'exercise.mode.meaningMixed.short',
    exampleKey: 'exercise.mode.meaningMixed.example',
  },
];

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
  'ngu-phap-n4': 'example-vi-jp',
};

/** Dạng luyện ý nghĩa (trắc nghiệm) của bài ngữ pháp N4 — đơn vị hỏi là MẪU chứ không phải câu. */
export function isMeaningMode(mode: ExerciseMode): boolean {
  return mode === 'pattern-to-meaning' || mode === 'meaning-to-pattern' || mode === 'meaning-mixed';
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
