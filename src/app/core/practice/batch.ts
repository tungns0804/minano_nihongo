/**
 * Phép tính cho lối học "theo cụm": chia phạm vi đang chọn thành từng cụm liền
 * nhau theo ĐÚNG THỨ TỰ TRONG BÀI, mỗi cụm bằng số câu người học đã chọn.
 *
 * Khác hẳn với "cắt N câu" của phiên thường: phiên thường trộn cả bài rồi lấy N
 * câu đầu, nên hai lần luyện liên tiếp trùng nhau lung tung. Học theo cụm thì
 * cụm 1 là 10 từ đầu bài, cụm 2 là 10 từ tiếp theo — xong cụm này là chắc chắn
 * sang từ mới, và đi hết các cụm là đi hết bài.
 */

/**
 * Số cụm của một danh sách.
 *
 * Trả 0 khi không giới hạn số câu: lúc đó cả bài là một phiên duy nhất, không có
 * cụm nào để đi tiếp. Nhờ vậy `index < batchCount(...)` cũng là phép kiểm tra
 * "cụm này có thật không".
 */
export function batchCount(total: number, limit: number | null): number {
  return limit === null || limit <= 0 ? 0 : Math.ceil(total / limit);
}

/** Cắt đúng cụm thứ `index` (đếm từ 0) theo thứ tự gốc của danh sách. */
export function sliceBatch<T>(items: readonly T[], limit: number, index: number): T[] {
  const start = index * limit;
  return items.slice(start, start + limit);
}

/** Vị trí đầu và cuối của một cụm, đếm từ 1 để hiện cho người học ("từ 11–20"). */
export function batchRange(
  total: number,
  limit: number,
  index: number,
): { from: number; to: number } {
  return {
    from: Math.min(total, index * limit + 1),
    to: Math.min(total, (index + 1) * limit),
  };
}
