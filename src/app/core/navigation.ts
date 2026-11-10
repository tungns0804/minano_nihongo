import { IMPORT_LESSON_ENABLED } from './feature-flags';
import type { MessageKey } from './i18n/messages';
import { PATH, isUnder, pathOf } from './paths';
import type { IconName } from '../shared/icon';

/**
 * Menu chính: năm nhóm theo KỸ NĂNG, mỗi nhóm có vài trang con.
 *
 * Trước đây là chín mục ngang hàng (Từ vựng minano, Ôn tập, Từ vựng chủ đề, Tiến độ
 * N3, Kanji, Bộ thủ, Ngữ pháp minano, Luyện dịch, Bài tập bổ trợ): cùng một kỹ năng
 * nằm rải ở hai ba mục, trên điện thoại chín nút thành một dải phải cuộn ngang. Giờ
 * người học chỉ chọn "học cái gì" ở menu, còn "học từ nguồn nào" là hàng tab con ở
 * đầu trang (`SubNav` trong app.html).
 *
 * Đường dẫn đi theo đúng thứ bậc này (xem `core/paths.ts`): trang con nằm dưới đường
 * dẫn của nhóm, bài nằm dưới trang con liệt kê nó. Nhờ vậy nhóm, tab và breadcrumb
 * đều suy ra thẳng từ URL — không có bảng tra tay nào để quên cập nhật.
 */

export type NavGroupId = 'today' | 'vocab' | 'grammar' | 'kanji' | 'practice';

export interface NavPage {
  readonly path: string;
  readonly labelKey: MessageKey;
}

export interface NavGroup {
  readonly id: NavGroupId;
  /** Trang mở ra khi bấm nhóm trên menu — trang con đầu tiên. */
  readonly path: string;
  readonly labelKey: MessageKey;
  readonly icon: IconName;
  /** Các trang con, hiện thành hàng tab ở đầu trang. Một trang thì không hiện hàng tab. */
  readonly pages: readonly NavPage[];
}

export const NAV_GROUPS: readonly NavGroup[] = [
  {
    id: 'today',
    path: PATH.today,
    labelKey: 'app.nav.today',
    icon: 'calendar',
    pages: [
      { path: PATH.today, labelKey: 'app.nav.today' },
      { path: PATH.review, labelKey: 'app.nav.review' },
      { path: PATH.n3, labelKey: 'app.nav.n3' },
    ],
  },
  {
    id: 'vocab',
    path: PATH.vocab,
    labelKey: 'app.nav.vocab',
    icon: 'book',
    pages: [
      { path: PATH.vocab, labelKey: 'app.sub.minano' },
      { path: PATH.topics, labelKey: 'app.sub.topic' },
      ...(IMPORT_LESSON_ENABLED
        ? [{ path: PATH.importLesson, labelKey: 'app.nav.import' as MessageKey }]
        : []),
    ],
  },
  {
    id: 'grammar',
    path: PATH.grammar,
    labelKey: 'app.nav.grammarGroup',
    icon: 'cap',
    pages: [
      { path: PATH.grammar, labelKey: 'app.sub.minano' },
      { path: PATH.vnjpclub, labelKey: 'app.sub.vnjpclub' },
    ],
  },
  {
    id: 'kanji',
    path: PATH.kanji,
    labelKey: 'app.nav.kanji',
    icon: 'pencil',
    pages: [
      { path: PATH.kanji, labelKey: 'app.nav.kanji' },
      { path: PATH.radicals, labelKey: 'app.nav.radical' },
      { path: PATH.kanjiQuiz, labelKey: 'app.sub.kanjiQuiz' },
      { path: PATH.kanjiOnKun, labelKey: 'app.sub.kanjiOnKun' },
    ],
  },
  {
    id: 'practice',
    // Nhóm này không có trang chung: bấm menu là vào thẳng tab đầu (/luyen-tap tự
    // chuyển tới đó nếu ai gõ tay).
    path: PATH.translate,
    labelKey: 'app.nav.practice',
    icon: 'clipboard',
    pages: [
      { path: PATH.translate, labelKey: 'app.nav.translate' },
      { path: PATH.exercises, labelKey: 'app.nav.exercise' },
      // Bài "Luyện tập ngữ pháp N4" nằm ở nhóm Luyện tập theo ý người dùng (01/11/2026): họ
      // dùng nó để luyện theo lộ trình năm bậc, cạnh đề luyện N4, hơn là để đọc lý thuyết.
      { path: PATH.n4grammar, labelKey: 'app.sub.n4grammar' },
      { path: PATH.taisaku, labelKey: 'app.sub.taisaku' },
    ],
  },
];

/** Vị trí của một URL trong menu. */
export interface NavSpot {
  readonly group: NavGroup;
  /** Trang con chứa URL này — chính nó, hoặc danh sách liệt kê bài đang mở. */
  readonly page: NavPage;
  /** URL đúng là trang con (trang danh sách), không phải một bài bên dưới nó. */
  readonly isPage: boolean;
}

/** Mọi trang con, đường dẫn dài trước: /tu-vung/chu-de phải thắng /tu-vung. */
const PAGES_LONGEST_FIRST = NAV_GROUPS.flatMap((group) =>
  group.pages.map((page) => ({ group, page })),
).sort((a, b) => b.page.path.length - a.page.path.length);

/**
 * Nhóm và trang con của một URL, hoặc null với màn hình không thuộc nhóm nào — đang
 * luyện tập và kết quả, nơi menu ẩn đi cho người học tập trung.
 */
export function locate(url: string): NavSpot | null {
  const path = pathOf(url);
  const hit = PAGES_LONGEST_FIRST.find(({ page }) => isUnder(path, page.path));
  return hit ? { ...hit, isPage: hit.page.path === path } : null;
}
