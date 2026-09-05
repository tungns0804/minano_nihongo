/**
 * Nét viết của chữ Hán — phần dùng chung của khu "luyện viết".
 *
 * Dữ liệu gốc là KanjiVG (bản quyền CC BY-SA 3.0): mỗi chữ một file SVG, mỗi nét
 * một thẻ `<path>` xếp ĐÚNG thứ tự viết. `scripts/generate-strokes.mjs` rút các
 * nét đó ra, lấy mẫu đều theo chiều dài rồi nén thành chuỗi ký tự — xem
 * `stroke-data.ts`.
 *
 * Vì sao lấy mẫu chứ không giữ nguyên đường cong Bézier: phần chấm điểm chỉ cần
 * biết nét đi qua những đâu theo thứ tự nào, mà so hai chuỗi điểm thì làm được
 * bằng vài phép trừ. Giữ Bézier thì mỗi lần chấm phải dựng lại đường cong, và dữ
 * liệu kèm theo cũng nặng gấp mấy lần.
 *
 * Mọi toạ độ ở đây đều đã chuẩn hoá về 0..1 trong khung vuông của chữ, nên không
 * phụ thuộc kích thước khung vẽ trên màn hình.
 */

/**
 * Số điểm lấy mẫu trên mỗi nét.
 *
 * Mười điểm là chỗ cân bằng: đủ để phân biệt nét cong (乙, 心) với nét thẳng, mà
 * vẫn giữ dữ liệu của cả bảng chữ ở mức vài trăm kB. Đổi con số này là phải chạy
 * lại `npm run generate:strokes` — dữ liệu cũ sẽ giải mã sai độ dài.
 */
export const STROKE_SAMPLES = 10;

/**
 * Bảng ký tự mã hoá toạ độ: MỘT ký tự cho một toạ độ, nên lưới toạ độ đúng 64 mức.
 *
 * Không dùng thẳng `String.fromCharCode(48 + v)` cho gọn: dải đó đi qua dấu gạch
 * ngược, mà `quote()` của script sinh mã chỉ escape dấu nháy đơn — một ký tự `\`
 * lọt vào chuỗi TypeScript là hỏng cả file dữ liệu.
 */
const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
const MAX_LEVEL = ALPHABET.length - 1;

/** Số ký tự mã hoá một nét: mỗi điểm hai ký tự (x và y). */
export const STROKE_CODE_LENGTH = STROKE_SAMPLES * 2;

export interface StrokePoint {
  x: number;
  y: number;
}

/** Một nét, đã lấy mẫu thành đúng `STROKE_SAMPLES` điểm theo thứ tự viết. */
export type Stroke = readonly StrokePoint[];

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function encodeStrokes(strokes: readonly Stroke[]): string {
  return strokes
    .map((stroke) =>
      stroke
        .map((point) => {
          const x = Math.round(clamp01(point.x) * MAX_LEVEL);
          const y = Math.round(clamp01(point.y) * MAX_LEVEL);
          return ALPHABET[x] + ALPHABET[y];
        })
        .join(''),
    )
    .join('');
}

export function decodeStrokes(code: string): Stroke[] {
  const strokes: Stroke[] = [];

  for (let start = 0; start + STROKE_CODE_LENGTH <= code.length; start += STROKE_CODE_LENGTH) {
    const points: StrokePoint[] = [];
    for (let i = 0; i < STROKE_SAMPLES; i++) {
      const at = start + i * 2;
      points.push({
        x: ALPHABET.indexOf(code[at]) / MAX_LEVEL,
        y: ALPHABET.indexOf(code[at + 1]) / MAX_LEVEL,
      });
    }
    strokes.push(points);
  }

  return strokes;
}

export function pointDistance(a: StrokePoint, b: StrokePoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Rút một nét vẽ tay (dày đặc điểm, thưa mau tuỳ tốc độ chuột) thành đúng `count`
 * điểm cách đều nhau theo CHIỀU DÀI nét.
 *
 * Cách đều theo chiều dài chứ không theo thứ tự điểm: chuột đi chậm ở khúc cong
 * thì chỗ đó dày điểm hơn hẳn, lấy mẫu theo chỉ số sẽ dồn gần hết mẫu vào khúc
 * cong và bỏ trống đoạn thẳng dài.
 */
export function resampleStroke(
  points: readonly StrokePoint[],
  count: number = STROKE_SAMPLES,
): StrokePoint[] {
  if (points.length === 0) return [];

  const spans: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += pointDistance(points[i - 1], points[i]);
    spans.push(total);
  }

  // Một cú chấm chuột tại chỗ: không có chiều dài nào để chia, lặp lại chính điểm đó.
  if (total === 0) return Array.from({ length: count }, () => ({ ...points[0] }));

  const out: StrokePoint[] = [{ ...points[0] }];
  let segment = 0;

  for (let i = 1; i < count - 1; i++) {
    const target = (total * i) / (count - 1);
    while (segment < spans.length - 1 && spans[segment] < target) segment++;

    const before = segment === 0 ? 0 : spans[segment - 1];
    const length = spans[segment] - before;
    const ratio = length === 0 ? 0 : (target - before) / length;
    const from = points[segment];
    const to = points[segment + 1];
    out.push({ x: from.x + (to.x - from.x) * ratio, y: from.y + (to.y - from.y) * ratio });
  }

  out.push({ ...points[points.length - 1] });
  return out;
}
