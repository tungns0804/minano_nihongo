# Nguồn dữ liệu bài học

Mỗi thư mục con ở đây là **một bài học**. Chạy `npm run generate` để sinh
`public/lessons/<id>.json` và cập nhật `index.json`.

```
data-source/
  <ten-thu-muc>/          ← tên thư mục chính là id của bài học
    meta.json             ← tuỳ chọn: tên hiển thị, mô tả, thứ tự
    vocabulary.txt        ← HOẶC verbs.txt, không được có cả hai
```

## Quy tắc bắt buộc

**1. Tên file quyết định loại bài học.** Không phải tên thư mục, cũng không phải `meta.json`.

| Loại bài | Đặt tên file là |
| --- | --- |
| Từ vựng | `vocabulary.txt`, `vocab.txt`, `tu-vung.txt`, `tuvung.txt` |
| Chia động từ | `verbs.txt`, `verb.txt`, `dong-tu.txt`, `dongtu.txt` |

Thêm hậu tố sau dấu `-` hay `_` để tách thành nhiều file, chúng sẽ được gộp lại:
`verbs-1.txt`, `verbs-2.txt`, `tu-vung_bai33.txt`.

Tên file không khớp danh sách trên thì script **báo lỗi và dừng**, không đoán bừa.
Đây là chủ ý: dữ liệu động từ (4 cột) nếu bị đọc nhầm bằng parser từ vựng (3 cột) sẽ
không báo lỗi gì cả mà lặng lẽ nhét cột nhóm vào phần nghĩa — `về/ trở về,1*`.

**2. Một thư mục chỉ chứa một loại.** Có cả `vocabulary.txt` lẫn `verbs.txt` là lỗi.
Bài 33 có cả từ vựng và động từ thì tách thành hai thư mục.

**3. Tên thư mục chính là id bài học**, và id là khoá lưu danh sách ★ "chưa nhớ".
Đổi tên thư mục = mất ★ của bài đó. Nếu buộc phải đổi tên mà muốn giữ ★, ghim id cũ
lại trong `meta.json`:

```json
{ "id": "ten-thu-muc-cu" }
```

## meta.json

Tất cả các trường đều tuỳ chọn.

```json
{
  "name": "皆の日本語 — Bài 33",
  "description": "Từ vựng bài 33",
  "order": 3301
}
```

| Trường | Ý nghĩa |
| --- | --- |
| `name` | Tên hiển thị. Không có thì suy ra từ tên thư mục (`minna-33` → `Minna 33`). Phải **khác nhau giữa các bài** — script cảnh báo nếu trùng. |
| `description` | Mô tả ngắn hiện dưới tên bài. |
| `order` | Số nguyên quyết định thứ tự hiển thị. Bài không có `order` xếp sau cùng, theo tên thư mục. |
| `id` | Chỉ dùng khi cần giữ id cũ sau khi đổi tên thư mục (xem quy tắc 3). |

`kind` không còn tác dụng đặt loại bài nữa. Nếu vẫn khai báo mà lệch với tên file thì
script báo lỗi — coi như một lớp kiểm tra chéo.

### Quy ước đặt `name`

Một bài trong giáo trình thường tách thành hai thư mục (từ vựng và động từ). Hai thư mục đó
phải có `name` khác nhau, nếu không màn hình kết quả sẽ không cho biết vừa luyện bài nào:

```
皆の日本語 — Bài 33 · Từ vựng
皆の日本語 — Bài 33 · Động từ
```

### Quy ước đặt `order`

Dùng `<số bài><thứ tự trong bài>` để bài trong cùng một giáo trình nằm cạnh nhau:

| Bài | `order` |
| --- | --- |
| Bài 33 — từ vựng | `3301` |
| Bài 33 — động từ | `3302` |
| Bài 34 — từ vựng | `3401` |
| Chuyên đề (không thuộc bài nào) | `9001` trở lên |

## Định dạng nội dung

### Từ vựng — 3 cột

```
ÂM HÁN VIỆT,TIẾNG NHẬT,NGHĨA TIẾNG VIỆT
```

```
ĐÀO,逃げます,chạy trốn/ bỏ chạy
TỊCH,席,chỗ ngồi/ ghế
```

Chỉ tách ở **hai dấu phẩy đầu tiên**, nên nghĩa chứa dấu phẩy vẫn đúng.

#### Câu ví dụ (tuỳ chọn)

Viết sau dấu `|` ở cuối cột nghĩa:

```
ĐÀO,逃げます,chạy trốn/ bỏ chạy|犯人は窓から逃げました。
TỊCH,席,chỗ ngồi/ ghế
```

Dùng `|` chứ **không thêm một dấu phẩy nữa** là có chủ ý: cột nghĩa được phép chứa dấu phẩy, nên
nếu tách bằng dấu phẩy thì mọi dòng có nghĩa kiểu `nghĩa a, nghĩa b` sẽ âm thầm bị cắt mất một nửa
và nửa đó biến thành câu ví dụ.

Nếu dán từ Excel bằng TAB thì đặt câu ví dụ ở **cột thứ 4**, không cần dấu `|`.

Cột ví dụ chỉ hiện trong bảng từ vựng khi bài có ít nhất một câu — bài chưa có ví dụ thì bảng giữ
nguyên 4 cột như cũ.

### Động từ — 4 cột

```
ÂM HÁN VIỆT,THỂ MẬU,NGHĨA TIẾNG VIỆT,NHÓM
```

```
ĐÀO,逃げます,chạy trốn,2
THỦ,守ります,bảo vệ/ giữ,1
QUY,帰ります,về/ trở về,1*
VI,します,làm,3
```

- Động từ phải ở **thể ます**.
- Nhóm là `1`, `2` hoặc `3`. Thêm `*` để đánh dấu động từ đặc biệt — nhóm 1 nhưng
  hình dạng dễ nhầm sang nhóm 2 (帰ります, 入ります, 走ります…). App gắn nhãn và cho lọc
  riêng ra luyện.
- **Không khai báo các thể còn lại.** App tự chia ra る / て / た / ない theo luật.
- Cột nhóm là cột **cuối cùng**, nên nghĩa vẫn chứa được dấu phẩy.

### Quy tắc chung cho cả hai loại

- Dòng trống và dòng bắt đầu bằng `#` bị bỏ qua.
- Dòng có ký tự TAB được tách bằng TAB (tiện khi dán từ Excel / Google Sheet).
- Dấu `/` tách các nghĩa tương đương — khi gõ đáp án, đúng một trong số đó là được tính đúng.
- Dòng trùng nhau tự động bị loại, có cảnh báo kèm số dòng.

## Kiểm tra sau khi thêm bài

```bash
npm run generate          # sinh JSON, báo lỗi kèm số dòng
npm run generate:check    # chỉ kiểm tra, không ghi file
npm run verify            # đối chiếu parser + kiểm tra luật chia động từ
```

`npm run verify:conjugation` quét mọi động từ đã sinh và báo từ nào khai báo sai nhóm —
nên chạy mỗi lần thêm bài động từ mới.
