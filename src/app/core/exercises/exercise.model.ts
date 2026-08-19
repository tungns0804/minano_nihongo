/**
 * Khu "Bài tập" — hai bài luyện chuyên đề nằm ngoài giáo trình 皆の日本語.
 *
 * Vì sao tách khỏi bài học: bài học bám theo từng bài trong sách (bài 1, bài 33…),
 * còn hai bài tập ở đây gom động từ của NHIỀU cấp (N5→N3, N5→N2) theo một chủ đề
 * ngữ pháp. Nhét chúng vào lưới bài học ngoài trang chủ thì chúng không thuộc về
 * cấp độ nào cả, mà bộ lọc cấp độ ngoài đó lại chia theo số bài.
 *
 * Dữ liệu nằm thẳng trong mã nguồn (`transitive-pairs.ts`, `exercise-verbs.ts`)
 * chứ không đi qua `data-source/` + `npm run generate`: hai bài tập này là chức
 * năng cố định của ứng dụng, không phải nội dung người dùng tự nạp thêm.
 */

import type { MessageKey } from '../i18n/messages';
import type { VerbGroup } from '../japanese/conjugation';

/**
 * Id của bài tập. Dùng làm luôn:
 *  - đoạn cuối đường dẫn `/exercise/<id>`
 *  - khoá lưu danh sách ★ "chưa nhớ" (giống id bài học)
 * nên KHÔNG đổi tuỳ tiện: đổi là mất hết ★ của bài tập đó.
 */
export type ExerciseId = 'tu-tha-dong-tu' | 'chuyen-the-dong-tu';

/**
 * Cấp độ JLPT của một mục trong bài tập.
 *
 * Khác `JlptLevel` của bài học (chỉ N5/N4, suy ra từ SỐ BÀI trong giáo trình):
 * ở đây cấp độ được gán thẳng cho từng động từ và trải tới N2.
 */
export type ExerciseLevel = 'N5' | 'N4' | 'N3' | 'N2';

export const EXERCISE_LEVELS: readonly ExerciseLevel[] = ['N5', 'N4', 'N3', 'N2'];

/** Các chiều hỏi của cả hai bài tập, gom vào một kiểu để `PracticeConfig` chỉ cần một trường. */
export type ExerciseMode =
  // Bài 1 — tự động từ ↔ tha động từ
  | 'to-transitive'
  | 'to-intransitive'
  | 'transitivity-mixed'
  // Bài 2 — thể lịch sự ↔ các thể ngắn
  | 'masu-to-form'
  | 'form-to-masu'
  | 'form-mixed';

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

const ALL_MODES: readonly ExerciseModeInfo[] = [...TRANSITIVITY_MODES, ...FORM_MODES];

export function exerciseModeInfo(id: ExerciseMode): ExerciseModeInfo {
  return ALL_MODES.find((mode) => mode.id === id) ?? ALL_MODES[0];
}

/** Chiều hỏi mặc định của từng bài tập, cũng là chiều hợp lệ đầu tiên. */
export const DEFAULT_MODE: Record<ExerciseId, ExerciseMode> = {
  'tu-tha-dong-tu': 'to-transitive',
  'chuyen-the-dong-tu': 'masu-to-form',
};

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
  return mode === 'transitivity-mixed' || mode === 'form-mixed' ? 2 : 1;
}

/** Mô tả một bài tập, dùng để dựng thẻ ở trang danh sách. */
export interface ExerciseInfo {
  id: ExerciseId;
  nameKey: MessageKey;
  descKey: MessageKey;
  /** Khoá đếm số mục ("{count} cặp động từ" / "{count} động từ"). */
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
