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
import { NAV_GROUPS, groupOf, pathOf, subPageOf } from './core/navigation';
import { FeedbackSound } from './core/services/feedback-sound';
import { NavigationProgress } from './core/services/navigation-progress';
import { ThemeStore } from './core/services/theme-store';
import { Icon } from './shared/icon';

/** Cuộn quá ngưỡng này thì nút "lên đầu trang" hiện ra (đơn vị: px). */
const BACK_TO_TOP_AT = 700;

/** Trang không thuộc nhóm menu nào vẫn cần một tên trên breadcrumb. */
const CRUMB_OUTSIDE_NAV: Partial<Record<string, MessageKey>> = {
  practice: 'route.practice',
  result: 'route.result',
};

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

  /**
   * Nhóm menu đang mở, tính cả các trang chi tiết nằm dưới nó (xem `groupOf`).
   * null ở màn hình luyện tập và kết quả: ở đó menu đáy trên điện thoại ẩn đi.
   */
  protected readonly group = computed(() => groupOf(this.url()));

  /** Hàng tab con ở đầu trang — chỉ hiện ở trang danh sách của nhóm có từ hai trang. */
  protected readonly subNav = computed(() => {
    const group = this.group();
    const page = subPageOf(this.url());
    return group && page && group.pages.length > 1 && group.pages.includes(page)
      ? { group, page }
      : null;
  });

  /** Tên hiện sau "皆の日本語 /" trên thanh trên cùng. */
  protected readonly crumbKey = computed<MessageKey | null>(() => {
    const group = this.group();
    if (group) return group.labelKey;
    const segment = pathOf(this.url()).split('/').find(Boolean) ?? '';
    return CRUMB_OUTSIDE_NAV[segment] ?? null;
  });

  /** Tên trang con sau tên nhóm, khi trang con không trùng tên với nhóm. */
  protected readonly crumbSubKey = computed<MessageKey | null>(() => {
    const sub = this.subNav();
    return sub && sub.page.labelKey !== sub.group.labelKey ? sub.page.labelKey : null;
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
