import type { MessageKey } from '../i18n/messages';
import type { GrammarBookId } from './exercise.model';
import {
  N4_INTERCHANGEABLE_GROUPS,
  N4_SAME_FORM,
  N4_SECTIONS,
  N4_SYNONYMS,
} from './n4-grammar';
import type { N4Section } from './n4-grammar.model';


/**
 * "Sách ngữ pháp": một bộ mục lý thuyết + câu ví dụ, luyện bằng cùng một màn hình
 * (`features/n4-grammar`) và cùng lộ trình năm bậc.
 *
 * Thêm một nguồn ngữ pháp mới là thêm một phần tử vào `GRAMMAR_BOOKS` — không thêm
 * màn hình, không thêm tab: nó hiện thành một tab con trong nhóm Ngữ pháp
 * (`core/navigation.ts`).
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

export const GRAMMAR_BOOKS: readonly GrammarBook[] = [
  {
    id: 'ngu-phap-n4',
    path: '/exercise/ngu-phap-n4',
    nameKey: 'exercise.n4grammar.name',
    subtitleKey: 'exercise.n4.subtitle',
    sections: N4_SECTIONS,
    synonyms: N4_SYNONYMS,
    interchangeableGroups: N4_INTERCHANGEABLE_GROUPS,
    sameForm: N4_SAME_FORM,
  },
];

export function grammarBookOf(id: string | null | undefined): GrammarBook | null {
  return GRAMMAR_BOOKS.find((book) => book.id === id) ?? null;
}
