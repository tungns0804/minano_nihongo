# Nguồn dữ liệu bài học

Mỗi thư mục con ở đây là **một bài học**. Chạy `npm run generate` để sinh
`public/lessons/<id>.json` và cập nhật `index.json`.

```
data-source/
  <ten-thu-muc>/          ← tên thư mục chính là id của bài học
    meta.json             ← tuỳ chọn: tên hiển thị, mô tả, thứ tự
    vocabulary.txt        ← HOẶC verbs.txt / conversation.txt / grammar.json — chỉ một loại
```

## Quy tắc bắt buộc

**1. Tên file quyết định loại bài học.** Không phải tên thư mục, cũng không phải `meta.json`.

| Loại bài | Đặt tên file là |
| --- | --- |
| Từ vựng | `vocabulary.txt`, `vocab.txt`, `tu-vung.txt`, `tuvung.txt` |
| Chia động từ | `verbs.txt`, `verb.txt`, `dong-tu.txt`, `dongtu.txt` |
| Dịch hội thoại | `conversation.txt`, `dialog.txt`, `hoi-thoai.txt`, `hoithoai.txt` |
| Ngữ pháp | `grammar.json`, `ngu-phap.json`, `nguphap.json` |

Thêm hậu tố sau dấu `-` hay `_` để tách thành nhiều file, chúng sẽ được gộp lại:
`verbs-1.txt`, `verbs-2.txt`, `tu-vung_bai33.txt`. Riêng bài ngữ pháp **chỉ được một
file** — nội dung là JSON nên không nối nhiều file lại được; gộp các mẫu vào cùng
mảng `points`.

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

### Ngữ pháp — JSON

Ngữ pháp là loại bài duy nhất dùng JSON, vì một mẫu ngữ pháp không phải một dòng phẳng
mà là cả một cụm lồng nhau: công thức, giải thích, bảng biến đổi, các cách dùng, và mỗi
cách dùng lại có nhiều câu ví dụ.

```json
{
  "points": [
    {
      "title": "～んです",
      "summary": "Hỏi hoặc giải thích lý do của điều vừa nhìn thấy, vừa nghe được.",
      "structures": ["V thể ngắn ＋ んです", "N [だ → な] ＋ んです"],
      "explanation": ["Phần đứng trước んです luôn ở thể ngắn."],
      "notes": ["Không nói んですから."],
      "tables": [
        {
          "caption": "Động từ",
          "headers": ["Thể lịch sự", "Thêm ～んです"],
          "rows": [["みます", "みるんです"], ["みました", "みたんです"]]
        }
      ],
      "usages": [
        {
          "title": "Hỏi lý do — どうして ～んですか",
          "detail": "Muốn người nghe giải thích lý do.",
          "examples": [
            {
              "japanese": "どうして おくれたんですか。",
              "vietnamese": "Tại sao bạn lại đến muộn vậy?",
              "note": "Ghi chú tuỳ chọn cho riêng câu này."
            }
          ]
        }
      ]
    }
  ]
}
```

| Trường | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `points[].title` | ✔ | Tên mẫu, ví dụ `～んです`. Hiện làm tiêu đề và làm gợi ý lúc luyện. |
| `points[].summary` | | Một câu tóm tắt ý nghĩa. |
| `points[].structures` | | Các dòng công thức. Dòng đầu được ghép vào gợi ý khi luyện. |
| `points[].explanation` | | Các đoạn giải thích, mỗi phần tử là một đoạn. |
| `points[].notes` | | Lưu ý / lỗi hay gặp, hiện trong khung vàng. |
| `points[].tables` | | Bảng biến đổi. Mỗi dòng phải đủ số ô bằng số `headers`. |
| `points[].usages[].title` | ✔ | Tên cách dùng. |
| `points[].usages[].detail` | | Giải thích thêm cho cách dùng đó. |
| `usages[].examples[].japanese` | ✔ | Câu tiếng Nhật. Cũng là khoá sinh id, xem bên dưới. |
| `usages[].examples[].vietnamese` | ✔ | Bản dịch tiếng Việt. |
| `usages[].examples[].reading` | | Cách đọc cả câu bằng kana, khi câu có kanji khó. |
| `usages[].examples[].note` | | Ghi chú ngắn cho riêng câu, ví dụ câu hỏi mà nó đang trả lời. |

Mọi trường dạng danh sách (`structures`, `explanation`, `notes`) viết được cả bằng một
chuỗi đơn lẻ khi chỉ có một dòng.

- **Id câu ví dụ băm từ RIÊNG câu tiếng Nhật**, giống bài hội thoại: sửa lại bản dịch
  tiếng Việt cho sát nghĩa hơn thì dấu ★ của câu đó không mất. Đổi câu tiếng Nhật thì mất.
- Hai câu tiếng Nhật giống hệt nhau trong cùng một bài sẽ bị loại bớt kèm cảnh báo.
- Dấu `/` trong bản dịch tiếng Việt tách các **cách dịch tương đương**: gõ đúng một
  trong số đó là được tính đúng ở chiều Nhật → Việt. Vì vậy **đừng dùng `/` với nghĩa
  khác** trong cột này (chiều Việt → Nhật thì không tách, vì `/` không xuất hiện trong
  câu tiếng Nhật).
- Script báo lỗi kèm **đường dẫn trong cây JSON** (`points[0].usages[1].examples[2]`)
  thay cho số dòng.

Bài ngữ pháp không hiện ở trang chủ mà nằm ở tab **Ngữ pháp** (`/grammar`) — mỗi bài là
một trang lý thuyết dài, gom chung vào lưới thẻ trang chủ thì phần từ vựng và động từ
không còn nhìn thấy được nữa.

### Quy tắc chung cho các loại bài dạng .txt

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
