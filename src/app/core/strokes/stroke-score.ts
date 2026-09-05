/**
 * Chấm một chữ viết tay bằng cách so với nét mẫu — chạy hoàn toàn trong trình
 * duyệt, không gọi dịch vụ nào.
 *
 * Cách chấm: đưa mỗi nét người học vẽ về đúng `STROKE_SAMPLES` điểm rồi so từng
 * cặp điểm với nét mẫu CÙNG THỨ TỰ. Nét thứ ba của người học phải khớp nét thứ ba
 * của chữ mẫu — đó chính là thứ đang luyện, nên so theo thứ tự chứ không đi tìm
 * nét mẫu gần nhất.
 *
 * Không dùng nhận dạng chữ viết tay (mạng nơ-ron, dịch vụ OCR): ở đây đã biết
 * trước người học ĐANG viết chữ nào, nên câu hỏi chỉ là "có giống chữ đó không",
 * và so khoảng cách giữa hai chuỗi điểm trả lời đủ cho việc luyện tập.
 */

import type { MessageKey } from '../i18n/messages';
import type { Stroke } from './stroke.model';
import { resampleStroke, pointDistance } from './stroke.model';

/**
 * Khoảng lệch trung bình tối đa còn coi là viết đúng một nét, tính theo cạnh của
 * khung vẽ (0.13 ≈ 39px trên khung 300px).
 *
 * Nới hơn nữa thì hai nét ngang cạnh nhau của 三 nhận lẫn được sang nhau; siết
 * hơn nữa thì vẽ bằng chuột gần như không bao giờ đúng.
 */
export const STROKE_TOLERANCE = 0.13;

/**
 * Nét mẫu phải dài tối thiểu bằng này thì mới xét chiều viết.
 *
 * Vì sao phải xét chiều riêng chứ không để khoảng lệch tự lo: viết ngược một nét
 * ngắn chỉ làm các điểm mẫu lệch đi đúng bằng chiều dài nét, tức là vẫn nằm trong
 * ngưỡng chấm. Đo như vậy thì một phần ba số chữ viết ngược nét đầu vẫn được tính
 * đúng — mà chiều nét lại chính là thứ người mới học hay sai (một 一 kéo từ phải
 * sang trái).
 *
 * Ngưỡng dài này để chừa lại các nét chấm (丶 của 犬, 玉): chúng ngắn tới mức
 * chính bàn tay run cũng đủ đảo chiều, nên hỏi chiều của chúng là hỏi điều không
 * ai trả lời đúng được bằng chuột.
 */
const DIRECTED_LENGTH = 0.12;

/**
 * Vì sao một nét bị tính là sai.
 *
 *  - shape    : lệch quá xa nét mẫu
 *  - reversed : đúng hình nhưng viết ngược đầu (dưới lên trên, phải sang trái)
 *  - order    : đúng hình một nét khác của chữ, tức là viết sai THỨ TỰ nét
 *  - missing  : chữ mẫu còn nét mà người học chưa vẽ
 *  - extra    : vẽ thừa nét so với chữ mẫu
 */
export type StrokeIssue = 'shape' | 'reversed' | 'order' | 'missing' | 'extra';

export const STROKE_ISSUE_KEY: Record<StrokeIssue, MessageKey> = {
  shape: 'practice.draw.issue.shape',
  reversed: 'practice.draw.issue.reversed',
  order: 'practice.draw.issue.order',
  missing: 'practice.draw.issue.missing',
  extra: 'practice.draw.issue.extra',
};

export interface StrokeProblem {
  /** Nét thứ mấy, đếm từ 1 để hiện thẳng ra cho người học. */
  stroke: number;
  issue: StrokeIssue;
}

export interface DrawingVerdict {
  correct: boolean;
  /** Số nét vẽ khớp nét mẫu. */
  matched: number;
  /** Số nét của chữ mẫu. */
  expected: number;
  problems: StrokeProblem[];
}

/** Khoảng lệch trung bình giữa hai nét đã lấy mẫu cùng số điểm. */
function meanDistance(a: Stroke, b: Stroke): number {
  const count = Math.min(a.length, b.length);
  if (count === 0) return Number.POSITIVE_INFINITY;

  let total = 0;
  for (let i = 0; i < count; i++) total += pointDistance(a[i], b[i]);
  return total / count;
}

/** Nét vẽ có đi cùng chiều nét mẫu không (nét mẫu quá ngắn thì coi như có). */
function sameDirection(drawn: Stroke, model: Stroke): boolean {
  const modelX = model[model.length - 1].x - model[0].x;
  const modelY = model[model.length - 1].y - model[0].y;
  if (Math.hypot(modelX, modelY) < DIRECTED_LENGTH) return true;

  const drawnX = drawn[drawn.length - 1].x - drawn[0].x;
  const drawnY = drawn[drawn.length - 1].y - drawn[0].y;
  return modelX * drawnX + modelY * drawnY > 0;
}

export function checkDrawing(
  drawn: readonly (readonly { x: number; y: number }[])[],
  reference: readonly Stroke[],
): DrawingVerdict {
  const samples = drawn.map((stroke) => resampleStroke(stroke));
  const problems: StrokeProblem[] = [];
  let matched = 0;

  for (let i = 0; i < reference.length; i++) {
    const model = reference[i];
    const got = samples[i];

    if (!got || got.length === 0) {
      problems.push({ stroke: i + 1, issue: 'missing' });
      continue;
    }

    if (meanDistance(got, model) <= STROKE_TOLERANCE) {
      if (sameDirection(got, model)) {
        matched++;
      } else {
        problems.push({ stroke: i + 1, issue: 'reversed' });
      }
      continue;
    }

    // Nét dài viết ngược thì lệch cả vị trí, nên chỉ khớp sau khi lật lại.
    if (meanDistance([...got].reverse(), model) <= STROKE_TOLERANCE) {
      problems.push({ stroke: i + 1, issue: 'reversed' });
      continue;
    }

    // Nét này khớp một nét KHÁC của chữ: hình vẽ đúng, chỉ viết lệch thứ tự. Nói
    // rõ được như vậy thì người học biết mình sai ở trình tự chứ không phải sai chữ.
    const belongsElsewhere = reference.some(
      (other, j) => j !== i && meanDistance(got, other) <= STROKE_TOLERANCE,
    );
    problems.push({ stroke: i + 1, issue: belongsElsewhere ? 'order' : 'shape' });
  }

  for (let i = reference.length; i < samples.length; i++) {
    problems.push({ stroke: i + 1, issue: 'extra' });
  }

  return { correct: problems.length === 0, matched, expected: reference.length, problems };
}
