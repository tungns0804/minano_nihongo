/**
 * Đường nét GỐC của KanjiVG (Bézier bậc ba trong khung 109×109) — dùng để VẼ nét
 * cho người học nhìn: hình thứ tự nét, nét mẫu mờ trong khung viết.
 *
 * Vì sao có file này khi đã có `stroke.model.ts`: dữ liệu ở đó là bản rút gọn để
 * CHẤM — mỗi nét 10 điểm, toạ độ làm tròn về lưới 64 mức. Đủ để so hai nét, nhưng
 * vẽ lại từ đó thì nét ngang thành gợn sóng (mỗi nấc lưới là 5px trên khung 320px)
 * và góc gập của 口, 月 bị bo tròn. Người học đang tập viết cho NGAY NGẮN mà nét mẫu
 * lại xiêu vẹo thì hỏng đúng thứ đang dạy.
 *
 * Bộ đọc `pathToPoints` ở đây là bộ đọc DUY NHẤT: `scripts/generate-strokes.mjs`
 * cũng gọi nó để rút ra dữ liệu chấm, nên nét vẽ và nét chấm đi ra từ cùng một
 * phép tính trên cùng một đường gốc.
 */

import type { Stroke, StrokePoint } from './stroke.model';
import { STROKE_SAMPLES, resampleStroke } from './stroke.model';

/** Khung của KanjiVG: mọi file đều là viewBox "0 0 109 109". */
export const KANJIVG_BOX = 109;

/** Số điểm rời rạc hoá mỗi đoạn Bézier trước khi lấy mẫu lại theo chiều dài. */
const CURVE_STEPS = 12;

/**
 * Rời rạc hoá một đường trong thuộc tính `d` thành chuỗi điểm (toạ độ 0..109).
 *
 * KanjiVG chỉ dùng bốn lệnh: `M`/`m` dời bút và `C`/`c`/`S`/`s` vẽ Bézier bậc ba.
 * Gặp lệnh khác thì DỪNG HẲN chứ không bỏ qua: bỏ qua một lệnh vẽ là nét sinh ra
 * thiếu mất một khúc, mà dữ liệu sai kiểu đó không có gì báo — nó chỉ làm người
 * học bị chấm sai về sau.
 *
 * Chuẩn SVG cho phép bỏ chữ cái khi lặp lại cùng một lệnh (`c … … …`), nên bộ
 * đọc này giữ lại lệnh trước. Riêng sau `M`/`m` thì xoá đi: lặp lại `M` theo
 * chuẩn là `L`, mà `L` chưa xử lý ở đây nên phải để nó báo lỗi thay vì dời bút
 * nhầm thành một nét mới.
 */
export function pathToPoints(d: string): StrokePoint[] {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  const points: StrokePoint[] = [];
  let index = 0;
  let command = '';
  let x = 0;
  let y = 0;
  // Điểm điều khiển thứ hai của đoạn Bézier trước — `S`/`s` soi gương qua nó.
  let lastControlX = 0;
  let lastControlY = 0;
  let previousWasCurve = false;

  const number = () => Number(tokens[index++]);

  const curveTo = (c1x: number, c1y: number, c2x: number, c2y: number, endX: number, endY: number) => {
    for (let step = 1; step <= CURVE_STEPS; step++) {
      const t = step / CURVE_STEPS;
      const u = 1 - t;
      points.push({
        x: u * u * u * x + 3 * u * u * t * c1x + 3 * u * t * t * c2x + t * t * t * endX,
        y: u * u * u * y + 3 * u * u * t * c1y + 3 * u * t * t * c2y + t * t * t * endY,
      });
    }
    lastControlX = c2x;
    lastControlY = c2y;
    x = endX;
    y = endY;
    previousWasCurve = true;
  };

  while (index < tokens.length) {
    if (/^[A-Za-z]$/.test(tokens[index])) command = tokens[index++];

    switch (command) {
      case 'M':
      case 'm': {
        const dx = number();
        const dy = number();
        x = command === 'M' ? dx : x + dx;
        y = command === 'M' ? dy : y + dy;
        points.push({ x, y });
        previousWasCurve = false;
        command = '';
        break;
      }
      case 'C':
      case 'c': {
        const base = command === 'C' ? { x: 0, y: 0 } : { x, y };
        curveTo(
          base.x + number(),
          base.y + number(),
          base.x + number(),
          base.y + number(),
          base.x + number(),
          base.y + number(),
        );
        break;
      }
      case 'S':
      case 's': {
        const base = command === 'S' ? { x: 0, y: 0 } : { x, y };
        const c1x = previousWasCurve ? 2 * x - lastControlX : x;
        const c1y = previousWasCurve ? 2 * y - lastControlY : y;
        curveTo(c1x, c1y, base.x + number(), base.y + number(), base.x + number(), base.y + number());
        break;
      }
      default:
        throw new Error(`lệnh SVG chưa xử lý "${command}" trong d="${d}"`);
    }
  }

  return points;
}

/**
 * Nét dùng để CHẤM, rút từ đường gốc: chuẩn hoá về 0..1 rồi lấy mẫu đều theo chiều
 * dài — đúng phép tính `generate-strokes.mjs` dùng để sinh `stroke-data.generated.ts`,
 * chỉ thiếu bước làm tròn về lưới 64 mức (`verify:drawing` kiểm hai bên khớp nhau).
 */
export function strokesFromPaths(paths: readonly string[]): Stroke[] {
  return paths.map((d) =>
    resampleStroke(
      pathToPoints(d).map((point) => ({ x: point.x / KANJIVG_BOX, y: point.y / KANJIVG_BOX })),
      STROKE_SAMPLES,
    ),
  );
}

/** Số thứ tự đặt cách đầu nét chừng này (đơn vị khung 109). */
const LABEL_GAP = 6.5;
/** Hai số thứ tự gần nhau hơn chừng này là đè lên nhau, khó đọc. */
const LABEL_SPACING = 7.5;
/** Chừa lề để số không bị cắt ở mép khung. */
const LABEL_MARGIN = 5;

/**
 * Chỗ đặt số thứ tự của từng nét (đơn vị khung 109).
 *
 * Mặc định lùi về trước đầu nét, ngược hướng nét đi: nhìn số là biết nét bắt đầu từ
 * đâu, đi về đâu. Nhưng những chữ dày nét (骨, 働) có cả chục đầu nét chụm vào một
 * góc, đặt cứng một chỗ thì các số chồng lên nhau thành một đống. Nên thử lần lượt
 * vài chỗ quanh đầu nét — phía trước, hai bên, xa hơn một chút — và lấy chỗ ĐẦU TIÊN
 * còn thoáng; chỗ nào cũng chật thì lấy chỗ xa các số đã đặt nhất.
 */
export function strokeLabels(paths: readonly string[]): StrokePoint[] {
  const placed: StrokePoint[] = [];
  const clamp = (value: number) => Math.min(KANJIVG_BOX - LABEL_MARGIN, Math.max(LABEL_MARGIN, value));

  for (const d of paths) {
    const points = pathToPoints(d);
    const start = points[0];
    // Hướng lấy qua một đoạn đủ dài chứ không qua điểm kế: đầu nét hay có móc nhỏ.
    const ahead =
      points.find((point) => Math.hypot(point.x - start.x, point.y - start.y) >= 5) ??
      points[points.length - 1];
    const length = Math.hypot(ahead.x - start.x, ahead.y - start.y) || 1;
    const dx = (ahead.x - start.x) / length;
    const dy = (ahead.y - start.y) / length;

    const candidates: [number, number][] = [
      [-dx, -dy],
      [-dy, dx],
      [dy, -dx],
      [-dx * 1.8, -dy * 1.8],
      [-dy * 1.8, dx * 1.8],
      [dy * 1.8, -dx * 1.8],
    ];

    let best: StrokePoint | null = null;
    let bestRoom = -1;
    for (const [ox, oy] of candidates) {
      const point = { x: clamp(start.x + ox * LABEL_GAP), y: clamp(start.y + oy * LABEL_GAP) };
      const room = Math.min(
        Number.POSITIVE_INFINITY,
        ...placed.map((other) => Math.hypot(other.x - point.x, other.y - point.y)),
      );
      if (room >= LABEL_SPACING) {
        best = point;
        break;
      }
      if (room > bestRoom) {
        bestRoom = room;
        best = point;
      }
    }

    const chosen = best ?? start;
    placed.push({ x: Math.round(chosen.x * 10) / 10, y: Math.round(chosen.y * 10) / 10 });
  }

  return placed;
}

/**
 * Viết lại `d` cho gọn: làm tròn một chữ số thập phân, bỏ dấu phẩy, bỏ số 0 đầu.
 *
 * Một chữ số thập phân trên khung 109 là 0,3px trên khung 320px — mắt không thấy,
 * mà dữ liệu nhẹ đi gần một nửa. Script sinh dữ liệu gọi hàm này; để ở đây cạnh bộ
 * đọc vì hai bên phải cùng hiểu một cú pháp.
 */
export function compactPath(d: string): string {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [];
  let out = '';
  let previousWasNumber = false;
  for (const token of tokens) {
    if (/^[A-Za-z]$/.test(token)) {
      out += token;
      previousWasNumber = false;
      continue;
    }
    let value = Math.round(Number(token) * 10) / 10;
    if (Object.is(value, -0)) value = 0;
    const text = String(value).replace(/^(-?)0\./, '$1.');
    // Số âm tự ngăn cách bằng dấu trừ; số dương thì cần một dấu cách.
    if (previousWasNumber && !text.startsWith('-')) out += ' ';
    out += text;
    previousWasNumber = true;
  }
  return out;
}
