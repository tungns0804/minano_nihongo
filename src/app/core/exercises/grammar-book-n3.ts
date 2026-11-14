import { PATH } from '../paths';
import type { GrammarBook } from './grammar-books';
import { N3_INTERCHANGEABLE_GROUPS, N3_SAME_FORM, N3_SECTIONS, N3_SYNONYMS } from './n3-grammar';

/** Tài liệu "TỔNG HỢP NGỮ PHÁP N3", chép tay ở `n3-grammar.ts`. Nạp động — xem `grammar-books.ts`. */
export const N3_BOOK: GrammarBook = {
  id: 'ngu-phap-n3',
  path: PATH.n3grammar,
  nameKey: 'exercise.n3grammar.name',
  subtitleKey: 'exercise.n3.subtitle',
  guideReadKey: 'exercise.n3.guide.read',
  sections: N3_SECTIONS,
  synonyms: N3_SYNONYMS,
  interchangeableGroups: N3_INTERCHANGEABLE_GROUPS,
  sameForm: N3_SAME_FORM,
};
