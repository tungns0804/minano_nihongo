import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';

import { ActivityStore } from './core/activity/activity-store';
import { LanguageStore } from './core/i18n/language-store';
import type { MessageKey } from './core/i18n/messages';
import { T } from './core/i18n/t';
import { NAV_GROUPS, locate } from './core/navigation';
import { PATH, pathOf } from './core/paths';
import { FeedbackSound } from './core/services/feedback-sound';
import { NavigationProgress } from './core/services/navigation-progress';
import { PageLabel } from './core/services/page-label';
import { ThemeStore } from './core/services/theme-store';
import { Icon } from './shared/icon';

/** Cuộn quá ngưỡng này thì nút "lên đầu trang" hiện ra (đơn vị: px). */
const BACK_TO_TOP_AT = 700;

/** Trang không thuộc nhóm menu nào vẫn cần một tên trên breadcrumb. */
const CRUMB_OUTSIDE_NAV: Partial<Record<string, MessageKey>> = {
  [PATH.session]: 'route.practice',
  [PATH.result]: 'route.result',
};

/** Một mắt xích của breadcrumb. `path` null là trang đang mở — không phải link. */
interface Crumb {
  readonly key?: MessageKey;
  readonly text?: string;
  readonly path: string | null;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgTemplateOutlet, T, Icon],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly theme = inject(ThemeStore);
  protected readonly sound = inject(FeedbackSound);
  protected readonly lang = inject(LanguageStore);
  private readonly router = inject(Router);

  /**
   * Đang chuyển trang hay không. Mọi màn hình đều nạp động, nên bấm menu là phải
   * chờ tải tệp — không báo gì thì người dùng tưởng cú bấm bị trượt.
   */
  protected readonly navigating = inject(NavigationProgress).active;

  protected readonly t = this.lang.t.bind(this.lang);

  protected readonly navGroups = NAV_GROUPS;
  protected readonly activity = inject(ActivityStore);

  /** Chú thích của chip 🔥: chuỗi mấy ngày, hôm nay đã làm bao nhiêu câu. */
  protected readonly streakChipLabel = computed(() =>
    this.t('streak.chip', {
      count: this.activity.streak().current,
      answered: this.activity.today().answered,
      goal: this.activity.goal(),
    }),
  );

  /** URL hiện tại, cập nhật sau mỗi lần chuyển trang xong. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Đường dẫn trần của trang đang mở. */
  private readonly path = computed(() => pathOf(this.url()));

  /** Nhóm + trang con của URL hiện tại — xem `locate`. */
  private readonly spot = computed(() => locate(this.path()));

  /**
   * Nhóm menu đang mở, tính cả các trang bài nằm dưới nó.
   * null ở màn hình luyện tập và kết quả: ở đó menu đáy trên điện thoại ẩn đi.
   */
  protected readonly group = computed(() => this.spot()?.group ?? null);

  /** Hàng tab con ở đầu trang — chỉ hiện ở trang danh sách của nhóm có từ hai trang. */
  protected readonly subNav = computed(() => {
    const spot = this.spot();
    return spot?.isPage && spot.group.pages.length > 1 ? spot : null;
  });

  private readonly pageLabel = inject(PageLabel);

  /**
   * Breadcrumb sau "皆の日本語": nhóm › tab › bài, ví dụ "Ngữ pháp › Minano › Bài 12".
   *
   * Trước đây trang bài chỉ hiện tên nhóm — vào một bài ngữ pháp thì thanh trên cùng
   * nói "Ngữ pháp" y như ở danh sách, không biết đang ở tab nào, bài nào. Giờ mắt xích
   * nào không phải trang đang mở đều bấm được để đi lên một bậc.
   *
   * Tab trùng tên nhóm (Kanji › Kanji, Hôm nay › Hôm nay) thì bỏ, khỏi lặp chữ. Tên
   * bài tới từ `PageLabel`, nên lúc bài còn đang nạp thì breadcrumb dừng ở tab.
   */
  protected readonly crumbs = computed<Crumb[]>(() => {
    const path = this.path();
    const spot = this.spot();
    if (!spot) {
      const key = CRUMB_OUTSIDE_NAV[path];
      return key ? [{ key, path: null }] : [];
    }

    const linkUnlessHere = (target: string) => (target === path ? null : target);
    const { group, page } = spot;
    const crumbs: Crumb[] = [{ key: group.labelKey, path: linkUnlessHere(group.path) }];
    if (group.pages.length > 1 && page.labelKey !== group.labelKey) {
      crumbs.push({ key: page.labelKey, path: linkUnlessHere(page.path) });
    }
    const label = spot.isPage ? null : this.pageLabel.labelOf(path);
    if (label) crumbs.push({ key: label.key, text: label.text, path: null });
    return crumbs;
  });

  /**
   * Đã cuộn đủ xa để cần nút quay lên đầu chưa.
   *
   * Vì sao cần nút này: bài ngữ pháp là một trang lý thuyết dài (bài 26 hơn chục
   * màn hình), và bảng từ vựng 50 từ cũng vậy. Phần thiết lập luyện tập lại nằm
   * ở gần đầu trang, nên đọc xong muốn bắt tay vào luyện là phải vuốt ngược rất lâu.
   */
  protected readonly scrolledDown = signal(false);

  /** Chính thẻ <header>, để đo chiều cao thật của nó. Xem `trackHeaderHeight`. */
  private readonly headerRef = viewChild.required<ElementRef<HTMLElement>>('appHeader');

  constructor() {
    // Chạy sau lần vẽ đầu tiên vì lúc này <header> chưa tồn tại. Trên máy chủ thì
    // không chạy, nên không cần tự kiểm tra `window`.
    afterNextRender(() => this.trackHeaderHeight());

    if (typeof window === 'undefined') return;

    const update = () => this.scrolledDown.set(window.scrollY > BACK_TO_TOP_AT);
    update();
    // passive: trình duyệt khỏi phải chờ xem hàm này có gọi preventDefault không,
    // nên cuộn không bị khựng. Không cần gỡ bỏ: component gốc sống hết vòng đời trang.
    window.addEventListener('scroll', update, { passive: true });
  }

  /**
   * Đo chiều cao thật của header rồi ghi vào biến CSS `--header-h`.
   *
   * Bốn chỗ cần đúng con số này để không bị header dính che mất: scroll-padding
   * của cả trang, mục lục dính trong bài ngữ pháp, thanh tiến độ lúc luyện tập,
   * và vệt báo đang chuyển trang.
   *
   * Vì sao phải ĐO thay vì viết sẵn một con số cho mỗi breakpoint: chiều cao header
   * đổi theo khổ màn hình và theo tai thỏ, chữ trong đó lại dài ngắn theo ngôn ngữ.
   * Con số viết sẵn đã sai hai lần mỗi khi menu thêm mục.
   *
   * ResizeObserver chứ không phải sự kiện `resize` của cửa sổ: header còn cao thấp
   * theo cả những thứ không liên quan tới cửa sổ, như đổi ngôn ngữ.
   *
   * Không cần ngắt theo dõi: component gốc sống hết vòng đời trang.
   */
  private trackHeaderHeight(): void {
    const header = this.headerRef().nativeElement;

    const apply = () => {
      const height = Math.round(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--header-h', `${height}px`);
    };

    apply();
    new ResizeObserver(apply).observe(header);
  }

  /**
   * Không truyền `behavior: 'smooth'`: để mặc định thì trình duyệt dùng
   * `scroll-behavior` khai báo trong styles.css, mà chỗ đó đã bọc trong
   * `prefers-reduced-motion: no-preference` — người tắt hiệu ứng chuyển động sẽ
   * được nhảy thẳng lên đầu thay vì bị kéo trôi qua cả trang.
   */
  protected scrollToTop(): void {
    window.scrollTo({ top: 0 });
  }

  /**
   * Đưa focus vào vùng nội dung chính. `tabindex="-1"` trên <main> là điều kiện
   * bắt buộc: một phần tử không tự nhận focus được thì gọi focus() cũng không có
   * tác dụng, và người dùng bàn phím sẽ Tab tiếp từ đúng chỗ cũ trên header.
   */
  protected focusMain(): void {
    document.getElementById('main-content')?.focus();
  }
}
