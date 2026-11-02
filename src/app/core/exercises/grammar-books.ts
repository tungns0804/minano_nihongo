import type { MessageKey } from '../i18n/messages';
import { GRAMMAR_BOOK_IDS, type GrammarBookId } from './exercise.model';
import type { N4Section } from './n4-grammar.model';

/**
 * "Sách ngữ pháp": một bộ mục lý thuyết + câu ví dụ, luyện bằng cùng một màn hình
 * (`features/n4-grammar`) và cùng lộ trình năm bậc.
 *
 * Thêm một nguồn ngữ pháp mới là thêm một file `grammar-book-<tên>.ts` và một dòng vào
 * `LOADERS` — không thêm màn hình. Tab con của nó khai ở `core/navigation.ts`.
 */
export interface GrammarBook {
  /** Id bài tập: khoá ★, `lessonId` của phiên luyện, và đoạn cuối đường dẫn. */
  readonly id: GrammarBookId;
  readonly path: string;
  readonly nameKey: MessageKey;
  readonly subtitleKey: MessageKey;
  readonly sections: readonly N4Section[];
  /** Mẫu CÙNG nghĩa — không bao giờ làm đáp án nhiễu cho nhau. */
  readonly synonyms: readonly (readonly string[])[];
  /** Nhóm mẫu thay được cho nhau trong câu — bài điền chỗ trống không lấy làm nhiễu. */
  readonly interchangeableGroups: readonly string[];
  /** Mẫu khác nhóm nhưng có thể trùng hình thức trong câu. */
  readonly sameForm: readonly (readonly string[])[];
}

/**
 * Mỗi sách một gói tải riêng.
 *
 * Trước đây file này nhập thẳng cả hai sách, nên mở một sách là tải luôn sách kia
 * (gộp lại 661 kB), và trang Ôn tập — nhập file này để dựng lại câu ôn — tải đủ
 * 661 kB đó ngay cả khi không có câu ngữ pháp nào đến hạn.
 */
const LOADERS: Record<GrammarBookId, () => Promise<GrammarBook>> = {
  'ngu-phap-n4': () => import('./grammar-book-n4').then((m) => m.N4_BOOK),
  'ngu-phap-vnjpclub': () => import('./grammar-book-vnjpclub').then((m) => m.VNJPCLUB_BOOK),
};

const loaded = new Map<GrammarBookId, GrammarBook>();

export async function loadGrammarBook(id: GrammarBookId): Promise<GrammarBook> {
  const cached = loaded.get(id);
  if (cached) return cached;
  const book = await LOADERS[id]();
  loaded.set(id, book);
  return book;
}

/** Mọi sách, theo thứ tự của `GRAMMAR_BOOK_IDS` — phiên ôn không biết câu thuộc sách nào. */
export function loadGrammarBooks(): Promise<GrammarBook[]> {
  return Promise.all(GRAMMAR_BOOK_IDS.map(loadGrammarBook));
}

/**
 * Sách đã nạp, đọc đồng bộ — cho bộ dựng câu hỏi, vốn chạy sau khi màn hình đã nạp
 * sách (route resolver của `N4Grammar`, hoặc `loadGrammarBooks` của phiên ôn).
 */
export function loadedGrammarBook(id: GrammarBookId): GrammarBook {
  const book = loaded.get(id);
  if (!book) throw new Error(`Sach ngu phap "${id}" chua duoc nap`);
  return book;
}
