/**
 * Các tính năng bật/tắt được của ứng dụng.
 *
 * Kiểu ghi rõ `: boolean` chứ không để TypeScript tự suy ra `false`. Nếu để suy
 * ra, kiểu của hằng số là đúng literal `false`, và mọi nhánh `if` cho trường hợp
 * bật sẽ thành mã chết dưới mắt trình biên dịch — nghĩa là nhánh đó KHÔNG còn
 * được kiểm tra kiểu nữa, và sẽ âm thầm mục nát cho tới ngày ai đó bật lại.
 */

/**
 * Màn hình "Nạp bài mới" — dán danh sách từ vựng để tự tạo bài học.
 *
 * ĐANG TẮT. Tắt cờ này thì:
 *  - mục "Nạp bài mới" biến mất khỏi thanh điều hướng,
 *  - đường dẫn /import không còn được đăng ký, gõ tay vào sẽ bị đưa về trang chủ,
 *  - trang chủ lúc chưa có bài nào chỉ hướng dẫn cách thêm bài qua data-source/.
 *
 * KHÔNG đụng tới các bài đã nạp từ trước: chúng vẫn nằm trong localStorage, vẫn
 * hiện ở trang chủ với nhãn "Tự nạp", vẫn luyện và vẫn xoá được ở trang chi tiết.
 * Tắt đường vào không có nghĩa là được phép vứt dữ liệu người dùng đã có.
 *
 * Mã của màn hình đó vẫn nằm nguyên trong `features/import-lesson/`. Vì route
 * được nạp kiểu lazy, không đăng ký route thì gói mã đó không bao giờ được tải —
 * người dùng không phải trả thêm byte nào cho một tính năng đang tắt.
 */
export const IMPORT_LESSON_ENABLED: boolean = false;
