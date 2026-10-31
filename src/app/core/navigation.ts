import { IMPORT_LESSON_ENABLED } from './feature-flags';
import type { MessageKey } from './i18n/messages';
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
 * Đường dẫn của mọi trang GIỮ NGUYÊN, trừ danh sách bài từ vựng: trang đó nhường "/"
 * cho trang Hôm nay và chuyển sang "/vocab".
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
    path: '/',
    labelKey: 'app.nav.today',
    icon: 'calendar',
    pages: [
      { path: '/', labelKey: 'app.nav.today' },
      { path: '/review', labelKey: 'app.nav.review' },
      { path: '/n3', labelKey: 'app.nav.n3' },
    ],
  },
  {
    id: 'vocab',
    path: '/vocab',
    labelKey: 'app.nav.vocab',
    icon: 'book',
    pages: [
      { path: '/vocab', labelKey: 'app.sub.minano' },
      { path: '/topic', labelKey: 'app.sub.topic' },
      ...(IMPORT_LESSON_ENABLED ? [{ path: '/import', labelKey: 'app.nav.import' as MessageKey }] : []),
    ],
  },
  {
    id: 'grammar',
    path: '/grammar',
    labelKey: 'app.nav.grammarGroup',
    icon: 'cap',
    pages: [
      { path: '/grammar', labelKey: 'app.sub.minano' },
      { path: '/exercise/ngu-phap-n4', labelKey: 'app.sub.n4grammar' },
      { path: '/exercise/ngu-phap-vnjpclub', labelKey: 'app.sub.vnjpclub' },
    ],
  },
  {
    id: 'kanji',
    path: '/kanji',
    labelKey: 'app.nav.kanji',
    icon: 'pencil',
    pages: [
      { path: '/kanji', labelKey: 'app.nav.kanji' },
      { path: '/radical', labelKey: 'app.nav.radical' },
    ],
  },
  {
    id: 'practice',
    path: '/translate',
    labelKey: 'app.nav.practice',
    icon: 'clipboard',
    pages: [
      { path: '/translate', labelKey: 'app.nav.translate' },
      { path: '/exercise', labelKey: 'app.nav.exercise' },
      { path: '/exercise/taisaku-n4', labelKey: 'app.sub.taisaku' },
    ],
  },
];

/**
 * Nhóm sở hữu từng nhánh đường dẫn. Xét từ trên xuống, nhánh dài hơn đứng trước:
 * bài "Luyện tập ngữ pháp N4" nằm dưới /exercise nhưng là nội dung NGỮ PHÁP.
 *
 * Bài chia động từ và bài hội thoại mở ở /lesson/:id như bài từ vựng, nên URL không
 * cho biết loại bài — chúng sáng mục Từ vựng, đúng như trước khi có nhóm.
 */
const OWNERS: readonly (readonly [prefix: string, group: NavGroupId])[] = [
  ['/exercise/ngu-phap-n4', 'grammar'],
  ['/exercise/ngu-phap-vnjpclub', 'grammar'],
  ['/review', 'today'],
  ['/n3', 'today'],
  ['/vocab', 'vocab'],
  ['/lesson', 'vocab'],
  ['/topic', 'vocab'],
  ['/import', 'vocab'],
  ['/grammar', 'grammar'],
  ['/kanji', 'kanji'],
  ['/radical', 'kanji'],
  ['/translate', 'practice'],
  ['/exercise', 'practice'],
];

/** Đường dẫn trần của một URL: bỏ query, fragment và tham số ma trận. */
export function pathOf(url: string): string {
  const path = url.split(/[?#;]/)[0];
  return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}

/**
 * Nhóm của một URL, hoặc null với màn hình không thuộc nhóm nào — đang luyện tập và
 * kết quả, nơi menu ẩn đi cho người học tập trung.
 */
export function groupOf(url: string): NavGroup | null {
  const path = pathOf(url);
  if (path === '/') return NAV_GROUPS[0];
  const owner = OWNERS.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`));
  return owner ? (NAV_GROUPS.find((group) => group.id === owner[1]) ?? null) : null;
}

/**
 * Trang con đang mở, nếu URL đúng là một trang danh sách trong hàng tab. Trang chi
 * tiết (/lesson/:id, /grammar/:id…) không hiện hàng tab: ở đó đã có nút quay lại, và
 * hàng tab sẽ đẩy nội dung đang học xuống thấp.
 */
export function subPageOf(url: string): NavPage | null {
  const path = pathOf(url);
  for (const group of NAV_GROUPS) {
    const page = group.pages.find((item) => item.path === path);
    if (page) return page;
  }
  return null;
}
