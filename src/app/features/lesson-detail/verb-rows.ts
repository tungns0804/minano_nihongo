import { VerbForms, conjugate, isIrregularVerb } from '../../core/japanese/conjugation';
import { VerbEntry } from '../../core/models/vocabulary.model';

/**
 * Bảng chia động từ của màn hình chi tiết bài.
 *
 * Tách khỏi component vì đây là phép TÍNH thuần, không đụng gì tới trạng thái
 * màn hình: đưa vào một danh sách động từ, nhận về cùng danh sách đó đã chia sẵn
 * năm thể — hoặc kèm lý do không chia được.
 */

/** Một động từ kèm kết quả chia, hoặc lý do không chia được. */
export interface VerbRow {
  entry: VerbEntry;
  forms: VerbForms | null;
  error: string | null;
  /** Động từ bất quy tắc — bảng đánh dấu để người học biết không suy ra được. */
  irregular: boolean;
}

export function buildVerbRows(verbs: readonly VerbEntry[]): VerbRow[] {
  return verbs.map((entry) => {
    const result = conjugate(entry.masu, entry.group);
    return {
      entry,
      forms: result.ok ? result.forms : null,
      error: result.ok ? null : result.reason,
      irregular: isIrregularVerb(entry.masu),
    };
  });
}

/** Bốn thể gộp thành một chuỗi để ô tìm khớp được cả dạng đã chia. */
export function formsText(forms: VerbForms | null): string {
  return forms ? `${forms.dictionary} ${forms.te} ${forms.ta} ${forms.nai}` : '';
}
