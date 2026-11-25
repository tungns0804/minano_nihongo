/** Trộn mảng theo thuật toán Fisher-Yates. Không sửa mảng gốc. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Lấy ngẫu nhiên tối đa `count` phần tử khác nhau. */
export function pickRandom<T>(items: readonly T[], count: number): T[] {
  if (count <= 0) return [];
  return shuffle(items).slice(0, count);
}

/**
 * Bộ sinh số giả ngẫu nhiên mulberry32: cùng `seed` thì luôn ra cùng một dãy số
 * trong [0, 1). Không dùng cho bảo mật — chỉ để một cách trộn LẶP LẠI được.
 */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Trộn Fisher-Yates theo một hạt giống cố định: cùng danh sách + cùng `seed` thì
 * luôn ra cùng một thứ tự, đổi `seed` là ra thứ tự khác.
 *
 * Học theo cụm cần đúng tính chất này: cụm 1 và cụm 2 học ở hai phiên khác nhau
 * mà vẫn phải cắt từ CÙNG một thứ tự trộn, thì các cụm mới chia hết bài không trùng.
 */
export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const random = mulberry32(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Một hạt giống mới cho `seededShuffle` (số nguyên 32 bit không dấu). */
export function newSeed(): number {
  return Math.floor(Math.random() * 4294967296) >>> 0;
}
