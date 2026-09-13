import {
  afterNextRender,
  afterRenderEffect,
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

import { IMPORT_LESSON_ENABLED } from './core/feature-flags';
import { LanguageStore } from './core/i18n/language-store';
import type { MessageKey } from './core/i18n/messages';
import { T } from './core/i18n/t';
import { NavigationProgress } from './core/services/navigation-progress';
import { ThemeStore } from './core/services/theme-store';
import { Icon, type IconName } from './shared/icon';

/** Cuộn quá ngưỡng này thì nút "lên đầu trang" hiện ra (đơn vị: px). */
const BACK_TO_TOP_AT = 700;

interface NavItem {
  /** Đoạn đầu của URL mà mục này bao trọn, xem `sectionOf`. */
  readonly section: string;
  readonly path: string;
  readonly labelKey: MessageKey;
  readonly icon: IconName;
  /** Mục dẫn tới cái đích chứ không tới nội dung để học — mang một chấm nhỏ. */
  readonly goal?: true;
}

const IMPORT_ITEM: NavItem = {
  section: 'import',
  path: '/import',
  labelKey: 'app.nav.import',
  icon: 'upload',
};

const NAV_ITEMS: readonly NavItem[] = [
  { section: '', path: '/', labelKey: 'app.nav.lessons', icon: 'book' },
  { section: 'topic', path: '/topic', labelKey: 'app.nav.topic', icon: 'layers' },
  { section: 'n3', path: '/n3', labelKey: 'app.nav.n3', icon: 'target', goal: true },
  { section: 'kanji', path: '/kanji', labelKey: 'app.nav.kanji', icon: 'pencil' },
  { section: 'radical', path: '/radical', labelKey: 'app.nav.radical', icon: 'blocks' },
  { section: 'grammar', path: '/grammar', labelKey: 'app.nav.grammar', icon: 'cap' },
  { section: 'exercise', path: '/exercise', labelKey: 'app.nav.exercise', icon: 'clipboard' },
  ...(IMPORT_LESSON_ENABLED ? [IMPORT_ITEM] : []),
];

/** Trang không thuộc mục menu nào vẫn cần một tên trên breadcrumb. */
const CRUMB_OUTSIDE_NAV: Partial<Record<string, MessageKey>> = {
  practice: 'route.practice',
  result: 'route.result',
};

/**
 * Mục menu của một URL: đoạn đầu tiên của đường dẫn, bỏ query và fragment.
 * Bài từ vựng (`/lesson/:id`) mở ra từ trang chủ nên thuộc về mục trang chủ.
 */
function sectionOf(url: string): string {
  const segment = url.split(/[?#;]/)[0].split('/').find(Boolean) ?? '';
  return segment === 'lesson' ? '' : segment;
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
  protected readonly lang = inject(LanguageStore);
  private readonly router = inject(Router);

  /**
   * Đang chuyển trang hay không. Mọi màn hình đều nạp động, nên bấm menu là phải
   * chờ tải tệp — không báo gì thì người dùng tưởng cú bấm bị trượt.
   */
  protected readonly navigating = inject(NavigationProgress).active;

  protected readonly t = this.lang.t.bind(this.lang);

  protected readonly navItems = NAV_ITEMS;

  /**
   * Mục menu đang mở, tính cả các trang chi tiết nằm dưới nó.
   *
   * Vì sao không dùng `routerLinkActive`: mục trang chủ có đường dẫn `/`. Khớp
   * chính xác thì mở một bài từ vựng (`/lesson/:id`) là menu không sáng mục nào;
   * khớp tiền tố thì `/` sáng ở MỌI trang. Tự tính từ đoạn đầu của URL thì được
   * đúng cả hai, và breadcrumb dùng chung được kết quả.
   */
  protected readonly section = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => sectionOf(event.urlAfterRedirects)),
    ),
    { initialValue: sectionOf(this.router.url) },
  );

  /** Tên hiện sau "皆の日本語 /" trên thanh trên cùng. */
  protected readonly crumbKey = computed<MessageKey | null>(() => {
    const section = this.section();
    const item = NAV_ITEMS.find((entry) => entry.section === section);
    return item?.labelKey ?? CRUMB_OUTSIDE_NAV[section] ?? null;
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

  /** Dải menu cuộn ngang, chỉ hiện trên điện thoại. Xem `revealActiveTab`. */
  private readonly tabStrip = viewChild.required<ElementRef<HTMLElement>>('tabStrip');

  constructor() {
    // Chạy sau lần vẽ đầu tiên vì lúc này <header> chưa tồn tại. Trên máy chủ thì
    // không chạy, nên không cần tự kiểm tra `window`.
    afterNextRender(() => this.trackHeaderHeight());

    // Đọc section() để Angular chạy lại sau mỗi lần đổi mục — lúc đó class
    // is-active đã nằm đúng chỗ trong DOM.
    afterRenderEffect(() => {
      this.section();
      this.revealActiveTab();
    });

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
   * Vì sao phải ĐO thay vì viết sẵn một con số cho mỗi breakpoint: trên điện thoại
   * header gồm cả dải menu, còn trên máy tính thì không; chữ trong đó lại dài ngắn
   * theo ngôn ngữ. Con số viết sẵn đã sai hai lần mỗi khi menu thêm mục.
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
   * Trên điện thoại menu là một dải cuộn ngang, và mục đang mở có thể nằm khuất
   * ngoài mép — mở thẳng /exercise là mục thứ bảy. Kéo nó vào giữa dải, không thì
   * người dùng không thấy mình đang ở mục nào.
   */
  private revealActiveTab(): void {
    const strip = this.tabStrip().nativeElement;
    // Dải đang ẩn (màn hình rộng) hoặc vừa khít thì không có gì để cuộn.
    if (strip.scrollWidth <= strip.clientWidth) return;

    const active = strip.querySelector<HTMLElement>('.is-active');
    if (!active) return;

    strip.scrollLeft = active.offsetLeft - (strip.clientWidth - active.offsetWidth) / 2;
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
