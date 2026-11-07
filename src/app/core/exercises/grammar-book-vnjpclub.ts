import { PATH } from '../paths';
import type { GrammarBook } from './grammar-books';
import { buildSections } from './grammar-book.build';
import {
  VNJPCLUB_INTERCHANGEABLE_GROUPS,
  VNJPCLUB_RAW_SECTIONS,
  VNJPCLUB_SYNONYMS,
} from './vnjpclub-n4.generated';

/**
 * Sách vnjpclub N4, sinh bằng `scripts/import-vnjpclub.mjs`: công thức, ý nghĩa và câu
 * ví dụ của từng trang; phần giải thích dài không chép, mỗi mục dẫn link về trang gốc.
 * Nạp động — xem `grammar-books.ts`.
 */
export const VNJPCLUB_BOOK: GrammarBook = {
  id: 'ngu-phap-vnjpclub',
  path: PATH.vnjpclub,
  nameKey: 'exercise.vnjpclub.name',
  subtitleKey: 'exercise.vnjpclub.subtitle',
  sections: buildSections(VNJPCLUB_RAW_SECTIONS),
  synonyms: VNJPCLUB_SYNONYMS,
  interchangeableGroups: VNJPCLUB_INTERCHANGEABLE_GROUPS,
  sameForm: [],
};
