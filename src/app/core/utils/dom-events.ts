/**
 * Đọc giá trị từ sự kiện DOM của template.
 *
 * Template Angular chỉ đưa ra được `$event`, mà `Event.target` khai báo là
 * `EventTarget | null` nên chỗ nào cũng phải ép kiểu. Ép kiểu ngay trong thân
 * hàm xử lý khiến hơn ba mươi hàm một-dòng của các màn hình đều dài gấp đôi vì
 * một chi tiết chẳng liên quan gì tới việc chúng làm.
 *
 * Không dùng `[(ngModel)]` để tránh chuyện này: cả ứng dụng chạy bằng signal và
 * `ChangeDetectionStrategy.OnPush`, kéo `FormsModule` vào chỉ để đọc một ô tích
 * thì thêm phụ thuộc mà không bớt được dòng nào.
 */

/** Trạng thái của một ô tích (`<input type="checkbox">`). */
export function checkedOf(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}

/** Chữ đang có trong một ô nhập — dùng được cho cả `<input>` lẫn `<textarea>`. */
export function valueOf(event: Event): string {
  return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
}
