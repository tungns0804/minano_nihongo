/**
 * Lịch ôn tập ngắt quãng (SRS) — phần tính toán thuần.
 *
 * Không đụng tới Angular hay localStorage: `ReviewStore` lo phần lưu, còn file này
 * chỉ trả lời "mục này ôn lại vào ngày nào". Nhờ vậy `npm run verify:review` chạy
 * thẳng bằng Node và kiểm được từng quy tắc bên dưới.
 *
 * Mọi mục người học đã luyện ở bốn khu (từ vựng, kanji, ngữ pháp, động từ) đều tự
 * vào lịch — không có nút "thêm vào ôn tập". Bài hội thoại, bộ thủ và phiên viết
 * chữ bằng chuột không vào lịch: người dùng chỉ chọn bốn khu kia.
 */

import type { PracticeConfig, QuestionStatus } from '../models/practice.model';
import type { DayNumber } from '../n3/n3.model';
import { KANJI_SESSION_ID } from '../kanji/kanji.model';

// ── Khu và loại mục ──────────────────────────────────────────────────────

export type ReviewArea = 'vocab' | 'kanji' | 'grammar' | 'verb';

export const REVIEW_AREAS: readonly ReviewArea[] = ['vocab', 'kanji', 'grammar', 'verb'];

/**
 * Loại mục — tiền tố của khoá. Mỗi loại ứng với đúng một cách dựng lại câu hỏi
 * (xem `core/practice/review-questions.ts`), và "nguồn" đi kèm cho biết phải lấy
 * nội dung ở đâu:
 *
 *  w   từ vựng (bài từ vựng hoặc chủ đề)   nguồn: id bài / chủ đề
 *  kc  chữ Hán, hỏi âm Hán Việt             nguồn: KANJI_SESSION_ID
 *  kw  từ dùng một chữ Hán                  nguồn: id chữ
 *  g   câu ví dụ ngữ pháp                   nguồn: id bài ngữ pháp
 *  v   động từ của bài động từ              nguồn: id bài
 *  ev  động từ của bài "Chuyển thể"         nguồn: id bài tập
 *  tp  cặp tự / tha động từ                 nguồn: id bài tập
 *
 * Nguồn cũng chính là khoá ★ của mục đó, nên phiên ôn gom câu từ nhiều bài vẫn
 * đánh dấu ★ đúng về bài chứa mục.
 */
export type ReviewItemType = 'w' | 'kc' | 'kw' | 'g' | 'v' | 'ev' | 'tp';

const AREA_OF_TYPE: Record<ReviewItemType, ReviewArea> = {
  w: 'vocab',
  kc: 'kanji',
  kw: 'kanji',
  g: 'grammar',
  v: 'verb',
  ev: 'verb',
  tp: 'verb',
};

/** Một mục trong lịch ôn: khoá để tra lịch, nguồn để dựng lại câu hỏi. */
export interface ReviewRef {
  key: string;
  source: string;
}

/** Id "bài học" của phiên ôn tập — phiên này gom câu từ nhiều bài nên không thuộc bài nào. */
export const REVIEW_SESSION_ID = 'on-tap';

export function reviewKey(type: ReviewItemType, id: string): string {
  return `${type}:${id}`;
}

/**
 * "kw:会社|かいしゃ" → { type: 'kw', id: '会社|かいしゃ' }.
 *
 * Tách ở dấu `:` ĐẦU TIÊN: tiền tố không bao giờ chứa `:`, còn id thì có thể chứa
 * (id từ của khu Kanji ghép cả cách đọc).
 */
export function parseReviewKey(key: string): { type: ReviewItemType; id: string } | null {
  const at = key.indexOf(':');
  if (at <= 0) return null;
  const type = key.slice(0, at);
  const id = key.slice(at + 1);
  return id && type in AREA_OF_TYPE ? { type: type as ReviewItemType, id } : null;
}

export function areaOfKey(key: string): ReviewArea | null {
  const parsed = parseReviewKey(key);
  return parsed ? AREA_OF_TYPE[parsed.type] : null;
}

/**
 * Khoá lịch ôn của một câu trong phiên luyện thường, suy từ thiết lập của phiên.
 *
 * Trả null cho những gì không vào lịch: phiên viết chữ bằng chuột (đó là kỹ năng
 * khác, và phiên ôn không trộn được câu vẽ với câu gõ), bài hội thoại, bộ thủ.
 */
export function reviewRefOf(
  config: Pick<PracticeConfig, 'lessonKind' | 'lessonId' | 'answerMode' | 'exercise'>,
  subjectId: string,
): ReviewRef | null {
  if (config.answerMode === 'draw') return null;
  const type = itemTypeOf(config);
  return type ? { key: reviewKey(type, subjectId), source: config.lessonId } : null;
}

function itemTypeOf(
  config: Pick<PracticeConfig, 'lessonKind' | 'lessonId' | 'exercise'>,
): ReviewItemType | null {
  // switch đủ mọi loại bài: thêm loại mới mà quên quyết định nó có vào lịch ôn hay
  // không thì TypeScript báo lỗi ngay ở đây.
  switch (config.lessonKind) {
    case 'vocabulary':
    case 'topic':
    case 'homework':
      return 'w';
    case 'grammar':
      return 'g';
    case 'verb':
      return 'v';
    case 'exercise':
      return config.exercise === 'tu-tha-dong-tu' ? 'tp' : 'ev';
    case 'kanji':
      // Phiên luyện âm Hán Việt hỏi trên CHỮ (mở từ danh sách), phiên còn lại hỏi
      // trên TỪ của một chữ.
      return config.lessonId === KANJI_SESSION_ID ? 'kc' : 'kw';
    case 'conversation':
    case 'radical':
      return null;
  }
}

// ── Chấm và lên lịch ─────────────────────────────────────────────────────

/**
 *  good   đúng ngay lần đầu
 *  hard   đúng, nhưng sau khi đã trả lời sai ít nhất một lần
 *  again  hết lượt hoặc chủ động xem đáp án
 */
export type ReviewGrade = 'good' | 'hard' | 'again';

export function gradeOf(status: QuestionStatus, wrongAttempts: number): ReviewGrade | null {
  if (status === 'pending') return null;
  if (status === 'revealed') return 'again';
  return wrongAttempts === 0 ? 'good' : 'hard';
}

export interface ReviewCard {
  /** Nấc hiện tại, 0 → MAX_STAGE. Nấc 0 là mục mới hoặc vừa quên. */
  stage: number;
  /** Ngày đến hạn ôn. */
  due: DayNumber;
  /** Tổng số lần quên (lộ đáp án), mỗi ngày tính nhiều nhất một lần. */
  lapses: number;
  /** Số lần đúng ngay liên tiếp gần nhất — quyết định mục có còn trong sổ lỗi sai. */
  streak: number;
  /** Ngày chấm gần nhất; -1 với mục chưa từng chấm. */
  last: DayNumber;
  /** Xem `ReviewRef.source`. */
  source: string;
}

/**
 * Khoảng cách (ngày) tới lần ôn sau, theo nấc 1 → 7.
 *
 * Nhân xấp xỉ gấp đôi mỗi nấc — đủ thưa để 50 bài từ vựng không đổ dồn về cùng
 * một ngày, đủ dày để một từ mới học hôm nay được nhắc lại vào ngày mai.
 */
export const INTERVAL_DAYS: readonly number[] = [1, 3, 7, 14, 30, 60, 120];

export const MAX_STAGE = INTERVAL_DAYS.length;

/** Từ nấc này (khoảng ôn 14 ngày) trở lên thì coi là đã nhớ lâu. */
export const MASTERED_STAGE = 4;

/** Đúng ngay liên tiếp bấy nhiêu lần thì mục tự ra khỏi sổ lỗi sai. */
export const MISTAKE_CLEAR_STREAK = 2;

/**
 * Lịch mới của một mục sau một lần chấm.
 *
 * Bốn quy tắc, theo đúng thứ tự xét:
 *
 * 1. `again` luôn đưa mục về nấc 0 và hẹn ôn lại NGÀY MAI — không phải hôm nay, vì
 *    hẹn hôm nay thì phiên ôn vừa kết thúc lại đòi ôn tiếp đúng mục đó, không dứt.
 *    Sai nhiều lần trong cùng một ngày chỉ tính một lần quên: một động từ bị hỏi ở
 *    bốn thể mà sai cả bốn là MỘT lần quên động từ đó, không phải bốn.
 *
 * 2. Mục đã được chấm hôm nay rồi thì `good`/`hard` không đổi gì nữa. Lý do như
 *    trên: không có quy tắc này thì một phiên chia bốn thể đẩy động từ lên liền
 *    bốn nấc, và "luyện lại câu sai" ngay sau phiên cũng được tính là ôn đúng hạn.
 *
 * 3. Ôn SỚM (chưa tới hạn) mà đúng thì giữ nguyên nấc và hạn — chỉ cộng chuỗi đúng
 *    để mục có thể ra khỏi sổ lỗi sai. Luyện lại một bài vừa học hôm qua không phải
 *    bằng chứng đã nhớ được 14 ngày. `hard` lúc ôn sớm thì kéo hạn về gần hơn nếu
 *    hạn mới sớm hơn hạn cũ.
 *
 * 4. Đúng hạn: `good` lên một nấc, `hard` giữ nấc (ít nhất nấc 1) và hẹn nửa quãng.
 */
export function schedule(
  card: ReviewCard | null,
  grade: ReviewGrade,
  today: DayNumber,
  source: string,
): ReviewCard {
  const current: ReviewCard = card ?? { stage: 0, due: today, lapses: 0, streak: 0, last: -1, source };
  const sameDay = current.last === today;

  if (grade === 'again') {
    const lapsedToday = sameDay && current.stage === 0 && current.streak === 0 && current.lapses > 0;
    return {
      stage: 0,
      due: today + 1,
      lapses: current.lapses + (lapsedToday ? 0 : 1),
      streak: 0,
      last: today,
      source,
    };
  }

  if (sameDay) return { ...current, source };

  const early = today < current.due;

  if (grade === 'good') {
    if (early) return { ...current, streak: current.streak + 1, last: today, source };
    const stage = Math.min(current.stage + 1, MAX_STAGE);
    return {
      stage,
      due: today + INTERVAL_DAYS[stage - 1],
      lapses: current.lapses,
      streak: current.streak + 1,
      last: today,
      source,
    };
  }

  const stage = Math.max(1, current.stage);
  const due = today + Math.max(1, Math.round(INTERVAL_DAYS[stage - 1] / 2));
  return {
    stage,
    due: early ? Math.min(current.due, due) : due,
    lapses: current.lapses,
    streak: 0,
    last: today,
    source,
  };
}

export function isDue(card: ReviewCard, today: DayNumber): boolean {
  return card.due <= today;
}

export function isMastered(card: ReviewCard): boolean {
  return card.stage >= MASTERED_STAGE;
}

/** Mục từng bị quên và chưa đúng ngay đủ số lần liên tiếp để coi là đã sửa được. */
export function inMistakeBook(card: ReviewCard): boolean {
  return card.lapses > 0 && card.streak < MISTAKE_CLEAR_STREAK;
}

/**
 * Người học tự bỏ một mục khỏi sổ lỗi sai.
 *
 * Chỉ nâng chuỗi đúng lên mức "đã sửa", không đụng nấc và hạn ôn: bỏ khỏi sổ là
 * "tôi đã nhớ từ này", không phải "đừng hỏi lại nữa". Sai lại lần sau thì chuỗi về
 * 0 và mục tự vào sổ.
 */
export function dismissMistake(card: ReviewCard): ReviewCard {
  return { ...card, streak: Math.max(card.streak, MISTAKE_CLEAR_STREAK) };
}

// ── Tổng hợp ─────────────────────────────────────────────────────────────

export interface AreaSummary {
  tracked: number;
  due: number;
  mastered: number;
  mistakes: number;
}

export function summarize(
  cards: Readonly<Record<string, ReviewCard>>,
  today: DayNumber,
): Record<ReviewArea, AreaSummary> {
  const result = Object.fromEntries(
    REVIEW_AREAS.map((area) => [area, { tracked: 0, due: 0, mastered: 0, mistakes: 0 }]),
  ) as Record<ReviewArea, AreaSummary>;

  for (const [key, card] of Object.entries(cards)) {
    const area = areaOfKey(key);
    if (!area) continue;
    const bucket = result[area];
    bucket.tracked++;
    if (isDue(card, today)) bucket.due++;
    if (isMastered(card)) bucket.mastered++;
    if (inMistakeBook(card)) bucket.mistakes++;
  }
  return result;
}

/**
 * Khoá các mục đến hạn trong những khu đang chọn.
 *
 * Quá hạn lâu nhất đứng đầu, rồi tới mục hay quên, rồi mục ở nấc thấp: khi có giới
 * hạn số mục mỗi ngày thì phần bị cắt đi là những mục ít rủi ro quên nhất.
 */
export function dueKeysOf(
  cards: Readonly<Record<string, ReviewCard>>,
  areas: readonly ReviewArea[],
  today: DayNumber,
): string[] {
  const wanted = new Set(areas);
  return Object.entries(cards)
    .filter(([key, card]) => {
      const area = areaOfKey(key);
      return area !== null && wanted.has(area) && isDue(card, today);
    })
    .sort(
      ([keyA, a], [keyB, b]) =>
        a.due - b.due || b.lapses - a.lapses || a.stage - b.stage || keyA.localeCompare(keyB),
    )
    .map(([key]) => key);
}

/** Khoá các mục trong sổ lỗi sai: quên nhiều lần nhất đứng đầu, rồi mới sai gần đây. */
export function mistakeKeysOf(
  cards: Readonly<Record<string, ReviewCard>>,
  areas: readonly ReviewArea[],
): string[] {
  const wanted = new Set(areas);
  return Object.entries(cards)
    .filter(([key, card]) => {
      const area = areaOfKey(key);
      return area !== null && wanted.has(area) && inMistakeBook(card);
    })
    .sort(([keyA, a], [keyB, b]) => b.lapses - a.lapses || b.last - a.last || keyA.localeCompare(keyB))
    .map(([key]) => key);
}

// ── Lưu trữ ──────────────────────────────────────────────────────────────

/**
 * Một mục lưu dưới dạng mảng sáu phần tử chứ không phải object có tên trường.
 *
 * Kho sẽ có vài nghìn mục (mọi từ, chữ, câu đã luyện). Tên trường lặp lại ở từng
 * mục làm dữ liệu nặng gấp đôi, trong khi localStorage chỉ có khoảng 5 MB cho cả
 * ứng dụng — mà bài tự nạp cũng nằm chung chỗ đó.
 */
type StoredCard = [stage: number, due: number, lapses: number, streak: number, last: number, source: string];

export function packCards(cards: Readonly<Record<string, ReviewCard>>): Record<string, StoredCard> {
  const result: Record<string, StoredCard> = {};
  for (const [key, card] of Object.entries(cards)) {
    result[key] = [card.stage, card.due, card.lapses, card.streak, card.last, card.source];
  }
  return result;
}

/** Đọc lại kho, bỏ qua mục hỏng hoặc khoá không còn nhận ra (dữ liệu phiên bản khác ghi). */
export function unpackCards(raw: unknown): Record<string, ReviewCard> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const result: Record<string, ReviewCard> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!parseReviewKey(key) || !Array.isArray(value) || value.length !== 6) continue;
    const [stage, due, lapses, streak, last, source] = value as unknown[];
    if (
      !isCount(stage) ||
      stage > MAX_STAGE ||
      !isInteger(due) ||
      !isCount(lapses) ||
      !isCount(streak) ||
      !isInteger(last) ||
      typeof source !== 'string'
    ) {
      continue;
    }
    result[key] = { stage, due, lapses, streak, last, source };
  }
  return result;
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

function isCount(value: unknown): value is number {
  return isInteger(value) && value >= 0;
}

// ── Thiết lập phiên ôn ───────────────────────────────────────────────────

/**
 * Chiều hỏi của phiên ôn. Chỉ hai chiều chung cho mọi khu — nhận ra (Nhật → Việt)
 * hay nhớ ra (Việt → Nhật); mỗi khu tự quy ra chiều cụ thể của mình, xem
 * `review-questions.ts`.
 */
export type ReviewDirection = 'jp-vi' | 'vi-jp';

/** Trắc nghiệm chỉ áp cho câu có lựa chọn (từ vựng, bài động từ); còn lại luôn gõ. */
export type ReviewAnswerMode = 'choice' | 'typing';

export interface ReviewSettings {
  areas: ReviewArea[];
  /** Số mục tối đa mỗi phiên; null là ôn hết. */
  limit: number | null;
  answerMode: ReviewAnswerMode;
  direction: ReviewDirection;
}

export const REVIEW_LIMITS: readonly number[] = [20, 50, 100];

export const DEFAULT_REVIEW_SETTINGS: ReviewSettings = {
  areas: [...REVIEW_AREAS],
  limit: 50,
  answerMode: 'choice',
  direction: 'jp-vi',
};

export function sanitizeReviewSettings(raw: unknown): ReviewSettings {
  const value =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};

  const rawAreas = value['areas'];
  const areas = Array.isArray(rawAreas) ? REVIEW_AREAS.filter((area) => rawAreas.includes(area)) : [];
  const rawLimit = value['limit'];
  const limit =
    rawLimit === null || (typeof rawLimit === 'number' && REVIEW_LIMITS.includes(rawLimit))
      ? rawLimit
      : DEFAULT_REVIEW_SETTINGS.limit;

  return {
    // Bỏ hết khu thì không còn gì để ôn — quay về mặc định thay vì một phiên rỗng.
    areas: areas.length > 0 ? areas : [...DEFAULT_REVIEW_SETTINGS.areas],
    limit,
    answerMode: value['answerMode'] === 'typing' ? 'typing' : 'choice',
    direction: value['direction'] === 'vi-jp' ? 'vi-jp' : 'jp-vi',
  };
}
