import { VERB_FORM_LABEL_KEY, VerbForm } from '../japanese/conjugation';
import type { MessageKey } from '../i18n/messages';
import { LessonKind, WordField } from './vocabulary.model';

/**
 * Các chiều luyện tập của bài TỪ VỰNG.
 *
 * Hai chiều `*-kana` chỉ dùng được với bài có khai báo cách đọc — màn hình chi
 * tiết bài tự ẩn chúng đi khi bài không có, xem `directionNeedsReading`.
 */
export type PracticeDirection = 'jp-vi' | 'vi-jp' | 'jp-han' | 'han-jp' | 'jp-kana' | 'kana-jp';

/** Bốn dạng câu hỏi của bài ĐỘNG TỪ. */
export type VerbPracticeMode = 'masu-to-form' | 'form-to-masu' | 'identify-group' | 'meaning-to-form';

/** Cách người dùng trả lời. */
export type AnswerMode = 'choice' | 'typing';

/**
 * Phạm vi luyện tập.
 *  - all      : toàn bộ bài
 *  - favorite : chỉ các mục đã đánh dấu ★
 *  - special  : chỉ động từ đặc biệt (nhóm 1 dễ nhầm thành nhóm 2), chỉ có ở bài động từ
 */
export type PracticeScope = 'all' | 'favorite' | 'special';

export const SCOPE_LABEL_KEY: Record<PracticeScope, MessageKey> = {
  all: 'scope.all',
  favorite: 'scope.favorite',
  special: 'scope.special',
};

export interface DirectionInfo {
  id: PracticeDirection;
  prompt: WordField;
  answer: WordField;
  labelKey: MessageKey;
  shortKey: MessageKey;
  /** Chiều này có cho bật/tắt gợi ý âm Hán Việt không. */
  supportsHanVietHint: boolean;
}

/**
 * Chỉ những chiều mà âm Hán Việt KHÔNG phải câu hỏi cũng không phải đáp án mới
 * cho phép bật gợi ý âm Hán Việt (bật ở hai chiều còn lại sẽ lộ đáp án).
 */
export const DIRECTIONS: readonly DirectionInfo[] = [
  {
    id: 'jp-vi',
    prompt: 'japanese',
    answer: 'vietnamese',
    labelKey: 'direction.jp-vi',
    shortKey: 'direction.jp-vi.short',
    supportsHanVietHint: true,
  },
  {
    id: 'vi-jp',
    prompt: 'vietnamese',
    answer: 'japanese',
    labelKey: 'direction.vi-jp',
    shortKey: 'direction.vi-jp.short',
    supportsHanVietHint: true,
  },
  {
    id: 'jp-han',
    prompt: 'japanese',
    answer: 'hanViet',
    labelKey: 'direction.jp-han',
    shortKey: 'direction.jp-han.short',
    supportsHanVietHint: false,
  },
  {
    id: 'han-jp',
    prompt: 'hanViet',
    answer: 'japanese',
    labelKey: 'direction.han-jp',
    shortKey: 'direction.han-jp.short',
    supportsHanVietHint: false,
  },
  {
    id: 'jp-kana',
    prompt: 'japanese',
    answer: 'reading',
    labelKey: 'direction.jp-kana',
    shortKey: 'direction.jp-kana.short',
    supportsHanVietHint: true,
  },
  {
    id: 'kana-jp',
    prompt: 'reading',
    answer: 'japanese',
    labelKey: 'direction.kana-jp',
    shortKey: 'direction.kana-jp.short',
    supportsHanVietHint: true,
  },
];

export function directionInfo(id: PracticeDirection): DirectionInfo {
  return DIRECTIONS.find((d) => d.id === id) ?? DIRECTIONS[0];
}

/**
 * Chiều này có đụng tới cột cách đọc không.
 *
 * Cách đọc là trường duy nhất được phép rỗng, nên bài không khai báo mà vẫn cho
 * chọn hai chiều này thì mọi câu hỏi sẽ có đáp án rỗng — hỏng lặng lẽ giữa buổi
 * luyện chứ không báo lỗi ở đâu cả.
 */
export function directionNeedsReading(id: PracticeDirection): boolean {
  const info = directionInfo(id);
  return info.prompt === 'reading' || info.answer === 'reading';
}

export interface VerbModeInfo {
  id: VerbPracticeMode;
  labelKey: MessageKey;
  shortKey: MessageKey;
  exampleKey: MessageKey;
  /** Dạng này có cần chọn thể để hỏi không. */
  needsForms: boolean;
}

export const VERB_MODES: readonly VerbModeInfo[] = [
  {
    id: 'masu-to-form',
    labelKey: 'verbMode.masu-to-form',
    shortKey: 'verbMode.masu-to-form.short',
    exampleKey: 'verbMode.masu-to-form.example',
    needsForms: true,
  },
  {
    id: 'form-to-masu',
    labelKey: 'verbMode.form-to-masu',
    shortKey: 'verbMode.form-to-masu.short',
    exampleKey: 'verbMode.form-to-masu.example',
    needsForms: true,
  },
  {
    id: 'identify-group',
    labelKey: 'verbMode.identify-group',
    shortKey: 'verbMode.identify-group.short',
    exampleKey: 'verbMode.identify-group.example',
    needsForms: false,
  },
  {
    id: 'meaning-to-form',
    labelKey: 'verbMode.meaning-to-form',
    shortKey: 'verbMode.meaning-to-form.short',
    exampleKey: 'verbMode.meaning-to-form.example',
    needsForms: true,
  },
];

export function verbModeInfo(id: VerbPracticeMode): VerbModeInfo {
  return VERB_MODES.find((m) => m.id === id) ?? VERB_MODES[0];
}

/** Số lần trả lời sai tối đa trước khi hiện đáp án và tính sai câu đó. */
export const DEFAULT_MAX_WRONG_ATTEMPTS = 4;

/** Số lựa chọn của một câu trắc nghiệm (1 đúng + 3 nhiễu). */
export const CHOICE_COUNT = 4;

export interface PracticeConfig {
  lessonId: string;
  lessonKind: LessonKind;
  scope: PracticeScope;
  answerMode: AnswerMode;
  /** null = luyện toàn bộ mục trong phạm vi đã chọn. */
  questionLimit: number | null;
  shuffle: boolean;
  maxWrongAttempts: number;
  /** Bỏ qua dấu tiếng Việt khi so khớp (chỉ áp dụng cho chế độ gõ đáp án). */
  ignoreDiacritics: boolean;

  // --- Riêng bài từ vựng ---
  direction: PracticeDirection;
  showHanViet: boolean;

  // --- Riêng bài ngữ pháp ---
  /** Hiện tên mẫu ngữ pháp + công thức làm gợi ý dưới câu hỏi. */
  showGrammarHint: boolean;

  // --- Riêng bài động từ ---
  verbMode: VerbPracticeMode;
  /** Các thể được đem ra hỏi; nhiều thể thì trộn lẫn trong một phiên. */
  verbForms: VerbForm[];
}

/** Một dòng thông tin hiện lại ở phần phản hồi sau khi chấm xong. */
export interface RecapItem {
  labelKey: MessageKey;
  /** Giá trị hiển thị thẳng (từ dữ liệu bài học). Để rỗng khi dùng `valueKey`. */
  value: string;
  /** Khi có, giá trị lấy từ khoá này — dùng cho giá trị cần dịch như tên nhóm động từ. */
  valueKey: MessageKey | null;
  japanese: boolean;
}

/**
 * Mục đang được hỏi, đã tách khỏi kiểu dữ liệu gốc (từ vựng hay động từ) để màn
 * hình luyện tập và màn hình kết quả dùng chung được cho cả hai loại bài.
 */
export interface QuestionSubject {
  /** Id của từ vựng / động từ — dùng làm khoá Favorite. */
  id: string;
  title: string;
  titleIsJapanese: boolean;
  subtitle: string;
  detail: string;
  /** Khoá phụ ghép vào cuối `detail`, ví dụ nhóm của động từ. */
  detailSuffixKey: MessageKey | null;
  recap: RecapItem[];
}

export interface PracticeQuestion {
  subject: QuestionSubject;
  /** Nhãn nhỏ phía trên câu hỏi. Tham số cũng là khoá nên dịch được lồng nhau. */
  labelKey: MessageKey;
  labelParams: Record<string, MessageKey>;
  prompt: string;
  promptIsJapanese: boolean;
  /** Gợi ý hiện dưới câu hỏi, null nếu không bật. */
  hint: string | null;
  /**
   * Gợi ý viết bằng chữ Nhật — quyết định font khi hiển thị.
   *
   * Bài từ vựng và bài động từ gợi ý bằng âm Hán Việt / nghĩa tiếng Việt (chữ
   * Latin), còn bài ngữ pháp gợi ý bằng chính mẫu ngữ pháp (～んです…). Không có
   * cờ này thì mẫu ngữ pháp bị vẽ bằng font giao diện.
   */
  hintIsJapanese: boolean;
  /**
   * Đáp án đúng ở dạng giá trị ổn định, không phụ thuộc ngôn ngữ.
   * Với câu nhận diện nhóm thì đây là "1"/"2"/"3", chữ hiển thị lấy từ `correctAnswerKey`.
   */
  correctAnswer: string;
  /** Khoá dịch của đáp án đúng; null nghĩa là hiển thị thẳng `correctAnswer`. */
  correctAnswerKey: MessageKey | null;
  /** Các cách viết được chấp nhận khi gõ tay (đã gồm cả hai ngôn ngữ nếu cần). */
  acceptedAnswers: string[];
  answerIsJapanese: boolean;
  /** Nhãn ô nhập ở chế độ gõ đáp án. */
  answerPromptKey: MessageKey;
  answerPromptParams: Record<string, MessageKey>;
  /** Danh sách lựa chọn cho chế độ trắc nghiệm; rỗng ở chế độ gõ. */
  choices: string[];
  /** Khi có, `choices` là mã ổn định và nhãn hiển thị lấy từ đây. */
  choiceLabelKeys: Record<string, MessageKey> | null;
  /**
   * Bỏ qua dấu câu khi chấm. Chỉ bật cho bài hội thoại: câu dài mà bắt gõ đúng cả
   * 、。…… thì sai vì lý do không liên quan tới việc dịch. Bài từ vựng và động từ
   * để `false` nên cách chấm của chúng không đổi.
   */
  ignorePunctuation: boolean;
  /**
   * Câu hỏi là một CÂU chứ không phải một từ — màn hình luyện tập dùng cỡ chữ nhỏ
   * hơn và ô nhập nhiều dòng.
   */
  isSentence: boolean;
  /** Số lần sai tối đa của riêng câu này. */
  maxWrongAttempts: number;
}

export type QuestionStatus = 'pending' | 'correct' | 'revealed';

export interface QuestionState {
  status: QuestionStatus;
  wrongAttempts: number;
  attempts: string[];
}

export interface QuestionResult {
  question: PracticeQuestion;
  isCorrect: boolean;
  /** Đúng ngay lần thử đầu tiên. */
  isPerfect: boolean;
  wrongAttempts: number;
  attempts: string[];
}

export interface SessionSummary {
  lessonId: string;
  lessonName: string;
  config: PracticeConfig;
  total: number;
  correctCount: number;
  wrongCount: number;
  perfectCount: number;
  durationMs: number;
  results: QuestionResult[];
}

/** Khoá nhãn ngắn của kiểu luyện tập, hiện trên thanh tiến độ khi đang làm bài. */
export function sessionShortKey(config: PracticeConfig): MessageKey {
  return config.lessonKind === 'verb'
    ? verbModeInfo(config.verbMode).shortKey
    : directionInfo(config.direction).shortKey;
}

/** Các khoá mô tả thiết lập của một phiên, dùng cho badge ở màn hình kết quả. */
export function describeConfigKeys(config: PracticeConfig): MessageKey[] {
  const keys: MessageKey[] = [
    config.answerMode === 'choice' ? 'lesson.answerMode.choice' : 'lesson.answerMode.typing',
    SCOPE_LABEL_KEY[config.scope],
  ];

  if (config.lessonKind === 'verb') {
    const mode = verbModeInfo(config.verbMode);
    keys.push(mode.shortKey);
    if (mode.needsForms) {
      keys.push(...config.verbForms.map((form) => VERB_FORM_LABEL_KEY[form]));
    }
  } else if (config.lessonKind === 'grammar') {
    keys.push(directionInfo(config.direction).shortKey);
    if (config.showGrammarHint) keys.push('grammar.option.showHint');
  } else {
    keys.push(directionInfo(config.direction).shortKey);
    if (config.showHanViet && directionInfo(config.direction).supportsHanVietHint) {
      keys.push('lesson.option.showHanViet');
    }
  }

  return keys;
}
