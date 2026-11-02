import type { GrammarBook } from './grammar-books';
import { N4_INTERCHANGEABLE_GROUPS, N4_SAME_FORM, N4_SECTIONS, N4_SYNONYMS } from './n4-grammar';

/** Tài liệu "TỔNG HỢP NGỮ PHÁP N4", chép tay ở `n4-grammar.ts`. Nạp động — xem `grammar-books.ts`. */
export const N4_BOOK: GrammarBook = {
  id: 'ngu-phap-n4',
  path: '/exercise/ngu-phap-n4',
  nameKey: 'exercise.n4grammar.name',
  subtitleKey: 'exercise.n4.subtitle',
  sections: N4_SECTIONS,
  synonyms: N4_SYNONYMS,
  interchangeableGroups: N4_INTERCHANGEABLE_GROUPS,
  sameForm: N4_SAME_FORM,
};
