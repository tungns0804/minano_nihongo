# Ôn tập từ vựng 皆の日本語

Ứng dụng web ôn tập từ vựng theo giáo trình 皆の日本語 (Minna no Nihongo): Kanji, âm Hán Việt và
nghĩa tiếng Việt. Chỉ có frontend (Angular 20) và dữ liệu JSON tĩnh — **không cần backend**.

> Tên ứng dụng nằm ở một chỗ duy nhất: hằng số `APP_NAME` trong
> [`src/app/core/app-title.ts`](src/app/core/app-title.ts). Đổi tên thì sửa ở đó, cộng thêm thẻ
> `<title>` tĩnh trong `src/index.html` và `scripts/build-offline.mjs`.

> Sắp thêm một màn hình hay một kiểu luyện tập mới? Đọc
> [CODING.md](CODING.md) trước — nó nói lớp cha nào đã có sẵn khung thiết lập,
> khối ★ và ô tìm, để khỏi chép lại lần thứ tám.

## Giao diện

Menu chính có **năm nhóm theo kỹ năng** ([`core/navigation.ts`](src/app/core/navigation.ts)).
Các nguồn trong cùng một kỹ năng là **hàng tab con** ở đầu trang danh sách:

| Nhóm | Tab con | Đường dẫn |
| --- | --- | --- |
| **Hôm nay** | Hôm nay · Ôn tập · Tiến độ N3 | `/` · `/review` · `/n3` |
| **Từ vựng** | Minano · Theo chủ đề | `/vocab` · `/topic` |
| **Ngữ pháp** | Minano · N4 · vnjpclub | `/grammar` · `/exercise/ngu-phap-n4` · `/exercise/ngu-phap-vnjpclub` |
| **Kanji** | Kanji · Bộ thủ | `/kanji` · `/radical` |
| **Luyện tập** | Luyện dịch · Bài tập bổ trợ | `/translate` · `/exercise` |

- **Máy tính:** thanh bên trái, có nhãn nhỏ dưới biểu tượng khi màn hình hẹp hơn 1480px.
  **Điện thoại:** thanh menu năm nút ở đáy màn hình, ẩn đi lúc đang luyện và ở màn kết quả.
- **Trang Hôm nay** (`/`) trả lời "hôm nay học gì": số mục đến hạn ôn kèm nút *Ôn ngay*, ba bài
  mở gần nhất (*Học tiếp*), phần trăm và nhịp học của lộ trình N3, rồi lối tắt tới bốn kỹ năng.
  Danh sách bài từ vựng — trước đây là trang chủ — nay ở `/vocab`; mọi đường dẫn khác giữ nguyên.
- **Chuỗi ngày học (streak) và kế hoạch hôm nay** ([`core/activity/`](src/app/core/activity/)):
  mỗi câu trả lời xong (đúng hay sai, ở bất kỳ bài nào) được đếm; đủ mục tiêu trong ngày
  (10 / 20 / 30 / 50 câu, mặc định 20) là giữ chuỗi. Hôm nay chưa học thì chuỗi vẫn còn tới
  hết ngày; hạ mục tiêu không bơm được ngày cũ. Trang Hôm nay có thẻ chuỗi (dải 7 ngày, kỷ lục)
  và **Kế hoạch hôm nay** — đủ số câu, ôn hết mục đến hạn, tích đủ buổi lộ trình N3 — mỗi việc
  một nút làm ngay. Chip 🔥 trên thanh trên cùng luôn hiện chuỗi; màn kết quả báo còn bao nhiêu
  câu và chúc mừng đúng lần đạt mục tiêu. `npm run verify:streak` kiểm cách tính.
- **Cấp độ chọn một lần cho cả app** ([`LevelPreference`](src/app/core/services/level-preference.ts)):
  bấm N4 ở tab nào thì mọi tab danh sách đều lọc N4. Tab không có bài ở cấp đó thì tạm hiện
  "Tất cả" mà không xoá lựa chọn.
- **Khung thiết lập luyện tập hai tầng** ([`shared/practice-setup.ts`](src/app/shared/practice-setup.ts)):
  lựa chọn quyết định *học gì* (phạm vi, chiều hỏi, dạng bài) luôn hiện; lựa chọn chỉnh *học thế
  nào* (cách trả lời, số câu, tuỳ chọn) gập trong "Tuỳ chỉnh thêm", nhớ chung cho mọi màn hình.
  Dòng tóm tắt cạnh nút Bắt đầu luôn nói đủ thiết lập đang dùng.

## Tài liệu

- [docs/noi-dung.md](docs/noi-dung.md) — từng khu của ứng dụng: các loại bài học, từ vựng chủ đề,
  tiến độ N3, ngữ pháp, kanji, bộ thủ, luyện viết, bài tập bổ trợ, tính năng chung.
- [docs/du-lieu.md](docs/du-lieu.md) — định dạng file bài học và cách thêm bài mới.
- [docs/ky-thuat.md](docs/ky-thuat.md) — cấu trúc dự án và các lưu ý kỹ thuật.
- [CODING.md](CODING.md) — quy ước viết code.

## Chạy nhanh

```bash
npm install
npm start          # tự chạy generate rồi mở dev server ở http://localhost:4200
npm run verify     # sinh lại dữ liệu rồi chạy mọi bước soát — CI chạy đúng bước này trước khi deploy
```

## Build

### Bản một file — chỉ cần double-click

```bash
npm run build:offline
```

Kết quả: **`dist/offline/index.html`** — một file HTML duy nhất (~370 kB) chứa sẵn toàn bộ giao
diện, mã nguồn và dữ liệu từ vựng. Double-click để mở, không cần cài gì, không cần web server,
không cần mạng. Copy đi đâu cũng chạy.

Chạy lại lệnh này mỗi khi thêm bài học mới hoặc sửa từ vựng, vì dữ liệu được nhúng cứng vào file.

Ba việc script phải xử lý để chạy được bằng `file://` (trình duyệt coi trang là origin `null`):

| Vấn đề | Cách xử lý |
| --- | --- |
| `<script type="module">` bị CORS chặn | Gói lại thành IIFE bằng esbuild rồi nhúng thẳng vào HTML |
| `fetch()` file JSON bị chặn | Nhúng bài học vào thẻ `<script type="application/json">` |
| History pushState bị chặn | App tự phát hiện `file://` và chuyển sang định tuyến bằng `#` |

Đã kiểm thử thực tế trên Chrome và Microsoft Edge, mở trực tiếp từ ổ đĩa.

### Bản chạy qua web server

```bash
npm run build      # kết quả nằm ở dist/minano-nihongo/browser
```

Thư mục này là file tĩnh thuần, đưa lên bất kỳ web server nào cũng chạy, URL sạch không có `#`.
Bản này đọc dữ liệu từ `lessons/*.json` lúc chạy nên thêm bài mới chỉ cần chạy lại
`npm run generate`, không phải build lại toàn bộ.
