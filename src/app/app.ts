import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { IMPORT_LESSON_ENABLED } from './core/feature-flags';
import { LanguageStore } from './core/i18n/language-store';
import { T } from './core/i18n/t';
import { NavigationProgress } from './core/services/navigation-progress';
import { ThemeStore } from './core/services/theme-store';

/** Cuộn quá ngưỡng này thì nút "lên đầu trang" hiện ra (đơn vị: px). */
const BACK_TO_TOP_AT = 700;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, T],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly theme = inject(ThemeStore);
  protected readonly lang = inject(LanguageStore);

  /**
   * Đang chuyển trang hay không. Mọi màn hình đều nạp động, nên bấm menu là phải
   * chờ tải tệp — không báo gì thì người dùng tưởng cú bấm bị trượt.
   */
  protected readonly navigating = inject(NavigationProgress).active;

  protected readonly t = this.lang.t.bind(this.lang);

  /** Có hiện mục "Nạp bài mới" trên thanh điều hướng không. */
  protected readonly importEnabled = IMPORT_LESSON_ENABLED;

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
   * Vì sao phải ĐO thay vì viết sẵn một con số cho mỗi breakpoint: header cao bao
   * nhiêu còn tuỳ menu có mấy mục, nhãn dài ngắn ra sao và đang ở tiếng Việt hay
   * tiếng Nhật — không có công thức nào từ riêng bề rộng màn hình mà ra. Cách viết
   * sẵn đã sai hai lần: con số 92px cho khổ điện thoại được đo hồi menu có 3 mục,
   * tới khi menu lên 7 mục thì header cao 155px, và vệt báo chuyển trang nằm lọt
   * hẳn sau header — bấm menu xong không thấy gì phản hồi.
   *
   * ResizeObserver chứ không phải sự kiện `resize` của cửa sổ: header còn cao thấp
   * theo cả những thứ không liên quan tới cửa sổ — đổi ngôn ngữ làm nhãn menu dài
   * ra và xuống thêm hàng, bật cờ "Nạp bài mới" thì thêm một mục.
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
