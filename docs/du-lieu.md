# Định dạng dữ liệu và thêm bài học

Cách viết file bài học trong `data-source/` và cách thêm bài mới. Tổng quan ở [README](../README.md).

## Định dạng dữ liệu

### Bài động từ — 4 cột

```
ÂM HÁN VIỆT,THỂ MẬU,NGHĨA TIẾNG VIỆT,NHÓM
```

```
ĐÀO,逃げます,chạy trốn,2
THỦ,守ります,bảo vệ/ giữ,1
QUY,帰ります,về/ trở về,1*
VI,します,làm,3
```

- Cột nhóm: `1`, `2` hoặc `3`. Thêm `*` để đánh dấu động từ đặc biệt (nhóm 1 dễ nhầm thành nhóm 2).
- Động từ phải ở thể ます; script báo lỗi nếu không.
- Nghĩa vẫn chứa được dấu phẩy — chỉ cột đầu, cột hai và cột cuối là cố định.
- File phải đặt tên là `verbs.txt` / `dong-tu.txt` (xem [`data-source/README.md`](../data-source/README.md)).

Nếu khai báo sai nhóm (ví dụ ghi 食べます là nhóm 1), app báo lỗi ngay ở màn hình chi tiết bài
học và bỏ qua động từ đó khi luyện — chạy `npm run verify:conjugation` để phát hiện sớm hơn.

### Bài từ vựng — 3 cột

Mỗi dòng một từ, ba cột:

```
ÂM HÁN VIỆT,TIẾNG NHẬT,NGHĨA TIẾNG VIỆT
```

Ví dụ:

```
ĐÀO,逃げます,chạy trốn/ bỏ chạy
XA CHÚ Ý,車に注意します,chú ý ô tô
TỊCH,席,chỗ ngồi/ ghế
```

Quy tắc:

- Chỉ tách ở **hai dấu phẩy đầu tiên** — nghĩa tiếng Việt có chứa dấu phẩy vẫn đúng.
- **Câu ví dụ (tuỳ chọn)** viết sau dấu `|` ở cuối cột nghĩa:
  `ĐÀO,逃げます,chạy trốn/ bỏ chạy|犯人は窓から逃げました。` — hoặc đặt ở cột thứ 4 khi dán bằng TAB.
  Dùng `|` chứ không thêm dấu phẩy để nghĩa vẫn chứa được dấu phẩy. Cột ví dụ chỉ hiện khi bài
  có ít nhất một câu.
- Dòng có ký tự TAB thì tách bằng TAB (tiện khi copy từ Excel / Google Sheet).
- Dòng trống và dòng bắt đầu bằng `#` bị bỏ qua.
- Dấu `/` tách các nghĩa tương đương. Khi gõ đáp án, gõ đúng **một trong các nghĩa** đó là được
  tính đúng (`chạy trốn` khớp với `chạy trốn/ bỏ chạy`).
- Dòng trùng nhau (cùng tiếng Nhật + cùng âm Hán Việt) tự động bị loại, có báo cảnh báo.

## Thêm bài học mới

### Cách 1 — Bằng script (bài học nằm trong mã nguồn)

Hướng dẫn đầy đủ nằm ngay cạnh dữ liệu: [`data-source/README.md`](../data-source/README.md).
Tóm tắt:

1. Tạo thư mục con trong `data-source/`. **Tên thư mục chính là id bài học**, và id là khoá
   lưu danh sách ★ — đổi tên thư mục sau này sẽ mất ★ của bài đó.

   ```
   data-source/minna-34-tu-vung/
   ```

2. Đặt file dữ liệu vào. **Tên file quyết định loại bài học**, không phải tên thư mục:

   | Loại bài | Đặt tên file là |
   | --- | --- |
   | Từ vựng | `vocabulary.txt`, `vocab.txt`, `tu-vung.txt`, `tuvung.txt` |
   | Chia động từ | `verbs.txt`, `verb.txt`, `dong-tu.txt`, `dongtu.txt` |
   | Dịch hội thoại | `conversation.txt`, `dialog.txt`, `hoi-thoai.txt`, `hoithoai.txt` |
   | Ngữ pháp | `grammar.json`, `ngu-phap.json`, `nguphap.json` |

   Tên khác thì script báo lỗi và dừng chứ không đoán. Một thư mục chỉ được chứa một loại;
   bài 34 có cả từ vựng lẫn động từ thì tách thành hai thư mục.

3. *(Tuỳ chọn)* Thêm `meta.json`:

   ```json
   {
     "name": "皆の日本語 — Bài 34",
     "description": "Từ vựng bài 34",
     "order": 3401
   }
   ```

   `order` quyết định thứ tự hiển thị (bài không có `order` xếp sau cùng). Quy ước đang dùng:
   `<số bài><thứ tự trong bài>` — bài 34 từ vựng là `3401`, động từ là `3402`, chuyên đề từ
   `9001` trở lên.

4. Chạy script:

   ```bash
   npm run generate
   ```

   Script sinh `public/lessons/<id>.json` cho từng thư mục và cập nhật
   `public/lessons/index.json`. Ứng dụng đọc `index.json` để biết có những bài nào.
   Thư mục `public/lessons/` không commit: `npm start`, `npm run build`, `npm run verify` và
   workflow deploy đều tự chạy bước này trước, nên nguồn duy nhất là `data-source/`.

Các lệnh khác của script:

```bash
npm run generate:check    # chỉ kiểm tra dữ liệu, không ghi file
npm run generate:clean    # sinh lại và xoá luôn file .json không còn thư mục nguồn
```

Script báo rõ từng dòng lỗi (thiếu cột, cột rỗng) và từng dòng trùng, kèm số dòng.

### Cách 2 — Nạp trực tiếp trên giao diện — **ĐANG TẮT**

> Màn hình này đã bị tắt. Cờ `IMPORT_LESSON_ENABLED` trong
> [`src/app/core/feature-flags.ts`](../src/app/core/feature-flags.ts) đang để `false`, nên mục
> “Nạp bài mới” không hiện trên thanh điều hướng và đường dẫn `/import` cũng không được đăng
> ký — gõ tay vào sẽ bị đưa về trang chủ. Đổi cờ đó thành `true` là có lại toàn bộ, mã màn
> hình vẫn nằm nguyên trong `src/app/features/import-lesson/`.
>
> Các bài đã nạp từ trước KHÔNG bị đụng tới: vẫn nằm trong `localStorage`, vẫn hiện ở trang
> chủ với nhãn “Tự nạp”, vẫn luyện và vẫn xoá được ở trang chi tiết bài.
>
> Phần dưới đây mô tả màn hình đó lúc đang bật.

Vào menu **“Nạp bài mới”**, dán danh sách từ vựng hoặc chọn file `.txt`. Màn hình hiện ngay số
từ hợp lệ, các dòng lỗi và bảng xem trước. Sau đó chọn:

- **Lưu và mở bài học** — lưu vào `localStorage` của trình duyệt, dùng được ngay.
- **Tải file JSON** — tải file `<id>.json` về máy. Muốn bài học đi kèm mã nguồn thì dùng Cách 1:
  `public/lessons/` không commit và được sinh lại hoàn toàn từ `data-source/`.

Bài tự nạp có nhãn **“Tự nạp”** và xoá được bất cứ lúc nào.
