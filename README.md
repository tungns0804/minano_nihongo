# Ôn tập từ vựng 皆の日本語

Ứng dụng web ôn tập từ vựng theo giáo trình 皆の日本語 (Minna no Nihongo): Kanji, âm Hán Việt và
nghĩa tiếng Việt. Chỉ có frontend (Angular 20) và dữ liệu JSON tĩnh — **không cần backend**.

> Tên ứng dụng nằm ở một chỗ duy nhất: hằng số `APP_NAME` trong
> [`src/app/core/app-title.ts`](src/app/core/app-title.ts). Đổi tên thì sửa ở đó, cộng thêm thẻ
> `<title>` tĩnh trong `src/index.html` và `scripts/build-offline.mjs`.

## Chạy nhanh

```bash
npm install
npm start          # tự chạy generate rồi mở dev server ở http://localhost:4200
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

## Các loại bài học

| Loại | Nội dung | Dữ liệu | Nằm ở đâu |
| --- | --- | --- | --- |
| **Từ vựng** | Nghĩa từ vựng, Kanji, âm Hán Việt | 3 cột | Tab **Từ vựng minano** |
| **Từ vựng theo chủ đề** | 20 chủ đề hay ra trong đề N3, cắt lại từ chính kho từ trên | Danh sách từ + kho từ có sẵn | Tab **Từ vựng chủ đề** |
| **Chia động từ** | Thể Te / Ta / Ru / Nai, nhận diện nhóm | 4 cột (thêm cột nhóm) | Tab **Bài tập bổ trợ** |
| **Dịch hội thoại** | Dịch từng câu Việt ↔ Nhật | `câu Nhật \| câu Việt` | Tab **Bài tập bổ trợ** |
| **Bài tập chuyên đề** | Tự/tha động từ, chuyển thể động từ (N5→N2) | Cài sẵn trong mã nguồn | Tab **Bài tập bổ trợ** |
| **Ngữ pháp** | Mẫu ngữ pháp + giải thích + luyện viết câu | JSON | Tab **Ngữ pháp minano** |
| **Kanji** | Danh sách 2.123 chữ Hán N5→N1 + từ dùng chữ đó | Danh sách JLPT + kho từ có sẵn | Tab **Kanji** |
| **Bộ thủ** | 214 bộ thủ + các chữ Hán N5→N1 ghép từ bộ đó | Bảng bộ thủ + chiết tự + kho chữ khu Kanji | Tab **Bộ thủ** |

Ranh giới giữa hai tab đầu là **nhớ nghĩa** hay **luyện một kỹ năng**. Tab **Từ vựng minano**
chỉ có bài từ vựng: mở ra là để nhớ nghĩa của một kho từ. Tab **Bài tập bổ trợ** gom mọi thứ
còn lại — chia thể động từ, dịch câu hội thoại, và hai bài tập chuyên đề — đều là luyện một
thao tác chứ không phải học thuộc một danh sách.

Vì trang chủ chỉ còn đúng một loại nên **bộ lọc "Loại bài học" đã bỏ**; một bộ lọc có duy nhất
một lựa chọn thì không lọc được gì. Loại bài nào thuộc tab nào khai ở bảng `LESSON_KIND_TAB`
trong [`vocabulary.model.ts`](src/app/core/models/vocabulary.model.ts) — một chỗ duy nhất, cả
hai màn hình danh sách lẫn nút "quay lại" ở trang chi tiết bài đều tra vào đó.

**Đổi tab không đổi URL.** Bài chia động từ và bài dịch hội thoại vẫn mở ở `/lesson/<id>` như
trước, nên link cũ vẫn vào được và dấu ★ "chưa nhớ" (khoá theo id bài) không mất một mục nào.

Danh sách đã hơn 50 bài nên **cả ba tab** (Từ vựng minano, Bài tập bổ trợ, Ngữ pháp minano) đều
có ô tìm kiếm ở đầu trang. Gõ tên bài, số bài ("33"), hay chữ không dấu ("dong tu") đều ra — từ
khoá khớp theo từng từ nên "33 dong tu" vẫn tìm đúng bài. Ở tab Bài tập bổ trợ, ô tìm kiếm lọc
cả hai bài tập chuyên đề lẫn các bài học: tên chúng là khoá dịch nên được dịch ra rồi mới so
khớp, gõ "chuyen the" ở tiếng Việt và gõ "活用" ở tiếng Nhật đều ra đúng thẻ đó. Khác với bộ lọc
cấp độ, từ khoá KHÔNG được nhớ cho lần mở sau: mở app lên mà danh sách đã bị cắt sẵn theo thứ gõ
hôm trước thì trông y như mất bài học.

### Lọc theo cấp độ N5 / N4

Trang chủ có thêm bộ lọc **Cấp độ**: **N5 = bài 1–25**, **N4 = bài 26–50**. Mốc chia này lấy
đúng theo cuốn nguồn: hết bài 25 thì sách in tiêu đề “TỪ VỰNG MINNANO N4” rồi mới sang bài 26.

Bộ lọc này chỉ có ở trang chủ, tức chỉ áp cho bài từ vựng. Tab Bài tập bổ trợ không có nó: hai
bài tập chuyên đề trải N5→N2 theo cấp gán cho TỪNG động từ chứ không theo số bài, nên xếp chúng
vào một bộ lọc chia theo số bài thì cả hai rơi hết vào ô "Không theo bài". Ở đó tìm bằng số bài
("28") nhanh hơn lọc, vì cả tab chỉ có bảy thẻ.

Cấp độ KHÔNG lưu trong từng bài mà suy ra từ **số bài**. Số bài do
[`scripts/generate-lessons.mjs`](scripts/generate-lessons.mjs) tính lúc sinh dữ liệu (hàm
`lessonNumberOf`: lấy cụm số cuối trong tên thư mục, hoặc `meta.lesson` nếu khai báo) rồi ghi
vào `index.json` và từng file bài học dưới khoá `lessonNumber`. Quy đổi số bài → cấp nằm ở
`levelOfLesson` trong [`vocabulary.model.ts`](src/app/core/models/vocabulary.model.ts).

Vì sao tính ở bước sinh dữ liệu chứ không để giao diện tự tách chuỗi id: bài người dùng tự nạp
không đi qua bước đó nên không bao giờ bị gán nhầm cấp — một bài đặt tên “bai-5-cua-toi” mà bị
đọc thành bài 5 sẽ hiện sai cấp độ. Bài không gắn với bài số nào (`dong-tu-dac-biet`, gom động
từ của nhiều bài) rơi vào nhóm **“Không theo bài”**, không bị nhét đại vào N4 hay N5.

Phải ghi `lessonNumber` vào cả `index.json` lẫn từng file bài học, không thừa: bản offline nhúng
thẳng file bài học vào trang và dựng danh sách từ đó, không hề đọc `index.json`.

**Ngữ pháp có tab riêng.** Mỗi bài ngữ pháp là một trang lý thuyết dài, và khu này nay phủ
trọn 50 bài; gom 50 thẻ đó vào cùng lưới với từ vựng và động từ thì trang chủ chỉ còn là
một danh sách dài không đọc nổi. Tab Ngữ pháp có bộ lọc **Cấp độ** riêng, dùng chung helper
`core/models/level-filter.ts` với trang chủ (khoá lưu riêng, để cấp đang chọn ở hai tab không
đè lên nhau).

## Từ vựng theo chủ đề

Tab **Từ vựng chủ đề** (`/topic`) là **cách gom thứ hai** cho đúng kho từ mà tab Từ vựng minano
đang dùng — không phải một kho từ mới.

Lý do: giáo trình xếp từ theo thứ tự **DẠY** (bài 7 có 父 và 母, bài 11 có 兄 và 姉, bài 39 có
恋人), còn đề JLPT N3 hỏi theo **TÌNH HUỐNG** — một bài đọc về gia đình dùng cả ba nhóm đó cùng
lúc. Học theo bài thì tới lúc thi phải tự ghép lại trong đầu; khu này ghép sẵn.

### 20 chủ đề

| # | Chủ đề | # | Chủ đề |
| --- | --- | --- | --- |
| 1 | 家族・人間関係 — Gia đình & quan hệ | 11 | 仕事・会社 — Công việc & công ty |
| 2 | 体・健康・病気 — Cơ thể, sức khoẻ & bệnh tật | 12 | 学校・勉強 — Trường học & học tập |
| 3 | 自然・天気 — Thiên nhiên & thời tiết | 13 | 買い物・お金 — Mua sắm & tiền bạc |
| 4 | 動物・植物 — Động vật & cây cỏ | 14 | 町・公共施設 — Phố xá & nơi công cộng |
| 5 | 家・家具・日用品 — Nhà cửa & đồ dùng trong nhà | 15 | 時間・日付 — Thời gian & ngày tháng |
| 6 | 食べ物・料理 — Ăn uống & nấu nướng | 16 | 数・量・単位 — Số lượng & đơn vị |
| 7 | 衣類・持ち物 — Quần áo & đồ mang theo | 17 | 気持ち・性格 — Cảm xúc & tính cách |
| 8 | 方向・位置 — Phương hướng & vị trí | 18 | 自動詞・他動詞 — Tự động từ & tha động từ |
| 9 | 交通・乗り物 — Giao thông & đi lại | 19 | 副詞・表現 — Trạng từ & cách nói |
| 10 | 旅行・レジャー — Du lịch & giải trí | 20 | あいさつ・敬語 — Chào hỏi & kính ngữ |

Mười bảy chủ đề đầu bám vào **tình huống** (nhà cửa, giao thông, mua sắm…) vì phần 読解 và 聴解
của đề N3 đều là bài đọc và hội thoại theo tình huống. Ba chủ đề cuối bám vào **từ loại**, vì đó
đúng là ba nhóm mà chính đề thi tách riêng ra hỏi: cặp tự/tha động từ, trạng từ, và kính ngữ.

### Không có từ nào được soạn thêm

Đây là ràng buộc quan trọng nhất của khu này. `topic-list.ts` chỉ khai **tên chủ đề + danh sách
từ tiếng Nhật**; `npm run generate:topics` tra từng từ đó trong chính
`data-source/<bài>/vocabulary*.txt` rồi sinh ra âm Hán Việt, cách đọc, nghĩa và câu ví dụ.

Ba hệ quả, đều là lý do chọn cách này:

- **Không có bản sao thứ hai của nghĩa một từ.** Sửa nghĩa trong `data-source/` thì chủ đề đổi
  theo ngay lần chạy sau.
- **Không bịa được.** Khai một từ không có trong kho là **lỗi** — script dừng, không lặng lẽ bỏ
  từ đó đi.
- **Phát âm dùng lại được ngay.** File mp3 đặt tên theo chuỗi đem đọc, mà chuỗi đó y hệt bài gốc,
  nên không phải sinh thêm file nào.

Hiện có **1.097 lượt từ** trên 20 chủ đề (1.011 từ khác nhau, rút từ kho 1.515 từ). Một từ có mặt
ở nhiều chủ đề là **chủ ý**: gặp lại một từ trong ngữ cảnh khác chính là cách nhớ nó.

#### Ghim bài nguồn khi một từ có hai nghĩa

Mặc định script lấy nghĩa ở bài **dạy sớm nhất**. Vài từ được dạy hai lần với hai nghĩa khác
nhau, và chủ đề cần nghĩa thứ hai — lúc đó viết thêm `@id-bài`:

```ts
'先生@minano-nihongo-17'   // "Bác sĩ", trong khi bài 1 dạy "Thầy/ cô"
'私@minano-nihongo-50'     // わたくし, "tôi (cách nói lịch sự)"
```

Ghim vào một bài không có từ đó là lỗi, nên ghim rồi bỏ quên lúc dữ liệu đổi sẽ bị bắt.

### Âm Hán Việt cho phần 総まとめ N3

Sách 総まとめ **không chú âm Hán Việt**, nên cả 215 dòng N3 trong `data-source/` đều bỏ
trống ô đó. Trong số này 143 từ **có chữ Hán** — với chúng, ô trống là chỗ nguồn chưa
ghi chứ không phải một sự thật.

[`scripts/han-viet-compose.mjs`](scripts/han-viet-compose.mjs) ghép âm của cả từ từ âm
của **từng chữ** mà `npm run generate:kanji` đã suy ra từ chính kho từ 皆の日本語, theo
đúng quy ước sẵn có của kho (nối âm các chữ Hán, bỏ qua kana: `時間に遅れます` →
`THỜI GIAN TRÌ`). Thiếu âm của dù chỉ một chữ thì để trống chứ không ghép nửa vời.

Kết quả: **140/143 từ** được điền. Ba từ còn lại thiếu chữ 栄 và 穴 — hai chữ này không
nằm trong danh sách JLPT của [`kanji-levels.ts`](src/app/core/kanji/kanji-levels.ts) nên
chưa có âm nào; danh sách đó chép từ ảnh người dùng cung cấp nên không tự thêm vào.

72 từ N3 còn lại viết thuần kana/katakana (`キッチン`, `なべ`, `ほうき`, `ほえる`) thì
**không bao giờ** có âm Hán Việt — đó là sự thật về từ, không phải thiếu sót.

Hai điều đáng nhớ về cách làm này:

- **Ghép ở bước sinh dữ liệu, không ghi ngược vào `data-source/`.** Id của từ băm từ
  `japanese|hanViet`, mà id là khoá lưu dấu ★ — ghi vào nguồn là mất ★ của cả 140 từ.
  Hệ quả: với những từ này, `id` trong JSON đã sinh **không** bằng
  `hashId(japanese|hanViet)` của chính JSON đó; nó bằng `hashId(japanese|)` của dòng nguồn.
- **`generate-kanji.mjs` không bao giờ nhìn thấy âm ghép** — nó đọc thẳng `data-source/`.
  Nếu thấy, những âm này sẽ quay lại bỏ phiếu cho chính các chữ đã sinh ra chúng, và một
  âm sai sẽ tự củng cố mình mãi mãi.

### Sinh lại sau khi sửa danh sách

```bash
npm run generate:topics    # sinh lại topic-catalog.ts + topic-words.ts
npm run verify:topics      # kiểm tra file sinh có khớp nguồn không (nằm trong npm run verify:ci)
```

`verify:topics` nằm trong `npm run verify:ci`, tức workflow deploy chạy nó trước khi build: sửa
`topic-list.ts` mà quên sinh lại thì CI đỏ chứ trang thật không lệch dữ liệu.

### Năm file, và vì sao phải tách ra

| File | Vai trò |
| --- | --- |
| [`topic.model.ts`](src/app/core/topics/topic.model.ts) | Kiểu + hàm dựng. Không chứa dữ liệu. |
| [`topic-list.ts`](src/app/core/topics/topic-list.ts) | **Khai tay**: tên, mô tả, biểu tượng, danh sách từ. Chỉ script đọc file này. |
| `topic-catalog.ts` | **Sinh tự động, nhẹ (~7 KB)**: id + tên + số từ của 20 chủ đề. |
| `topic-words.ts` | **Sinh tự động, nặng (~130 KB)**: toàn bộ từ. |
| [`topic-entries.ts`](src/app/core/topics/topic-entries.ts) | Dựng `Lesson` từ hai file sinh. **Nạp động**, chỉ khi mở một chủ đề. |

Tách nhẹ/nặng là có chủ ý: `LessonStore` là service gốc, nên nhập thẳng phần nặng vào đó sẽ kéo
130 KB từ vựng chủ đề vào **mọi trang** — kể cả trang chủ, nơi không hiện chủ đề nào cả. Lưới
chủ đề chỉ tốn 6,8 KB; 179 KB kia chỉ tải khi thật sự bấm vào một chủ đề.

### Màn hình chi tiết dùng chung với bài học thường

`/topic/<id>` chạy đúng component [`lesson-detail`](src/app/features/lesson-detail/) như
`/lesson/<id>`: một chủ đề **là** một `Lesson` đầy đủ, chỉ mang `kind: 'topic'`. Nhờ vậy bảng
tra, ô tìm trong bài, dấu ★, nút phát âm, học theo cụm, cả 6 chiều luyện và màn hình kết quả
đều có sẵn, không viết lại dòng nào.

Id chủ đề **chính là** id bài học **và** đoạn cuối URL. Ba thứ đó là một chuỗi duy nhất chứ
không phải ba chuỗi phải khớp nhau, vì cả ba đều là khoá — tách chúng ra thì mở cùng một chủ đề
bằng hai đường sẽ ra hai kho ★ khác nhau. Cái giá là id chủ đề không được đụng id bài nào trong
`data-source/`; `npm run generate:topics` kiểm tra đúng điều đó.

Tab này **không có bộ lọc cấp độ**: mỗi chủ đề gom từ của cả N5, N4 lẫn N3 nên không chủ đề nào
thuộc về một cấp, gán đại một cấp là nói dối người học.

## Tiến độ N3

Tab **Tiến độ N3** (`/n3`) là bảng kiểm soát việc học để đỗ N3 vào **10/12/2026**. Nó không
chứa bài học nào — nó ĐO các khu kia, cộng thêm ba quyển 総まとめ chưa nạp vào app mà vẫn phải
học trên sách.

Bản phân tích đầy đủ (đề thi gồm gì, kiểm kê giáo trình, ba lỗ hổng, cách học từng phần, bảng
241 ô tích để in ra) nằm ở **[LO-TRINH-N3.md](LO-TRINH-N3.md)**.

### Trang này hiện gì

| Khối | Nội dung |
| --- | --- |
| Vòng phần trăm | Mức chuẩn bị, tính theo **điểm khối thi quy đổi**, kèm vạch **trần** khi thiếu nguồn học |
| Nhịp học bắt buộc | **Mấy buổi mỗi ngày** để kịp — tính lại mỗi lần mở trang, kèm số ngày còn lại và trạng thái đúng hẹn/chậm. Đếm phần **có hẹn ngày**; phần ôn tuỳ sức hiện thành một dòng riêng bên dưới |
| Ba khối điểm | 言語知識 / 読解 / 聴解, mỗi khối 0–60 điểm |
| Sáu trụ nội dung | Nền N5–N4, 文字, 語彙, 文法, 読解, 聴解 |
| Bốn giai đoạn | Mốc ngày, việc làm hằng ngày, tiến độ từng giai đoạn |
| Bảng kiểm soát | 241 buổi học, tích từng buổi, lọc theo Tất cả / Chưa học / Đến hạn / Đã học |

### Vì sao đo bằng điểm khối, không đo bằng số bài

Trang 6 của cả bốn quyển 総まとめ N3 ghi rõ: mỗi khối điểm có **điểm chuẩn riêng**, thiếu điểm
chuẩn ở dù chỉ một khối là trượt cho dù tổng điểm cao. Nên "đã học 90% số bài" là một con số vô
nghĩa nếu 90% đó nằm cả trong một khối. `N3_SECTION_POINTS` quy 20/20/20 điểm cho
文字/語彙/文法, 60 cho 読解, 60 cho 聴解 — tổng 180, đúng thang điểm thật.

### Vì sao phải tự tay tích

Trang này KHÔNG suy tiến độ ra từ việc đã luyện bài nào trong app. Phần lớn lộ trình học **trên
sách** — ba quyển 漢字 / 語彙 / 読解 chưa nạp vào app — nên đo bằng hoạt động trong app sẽ báo 0%
cho một người đã học xong nửa quyển sách. Dấu tích lưu ở `localStorage` khoá
`jp-practice:n3-progress`, kèm **ngày tích** để trang tính được "7 ngày qua học mấy buổi".

### Ba giới hạn đã biết

1. **Phần nghe 聴解 chưa xây.** Nó chiếm 60/180 điểm và có điểm chuẩn riêng, nên mặc định nằm
   NGOÀI phần trăm (để con số còn phản ánh việc học đang diễn ra) nhưng trang **luôn hiện cảnh
   báo** và có ô bật để xem con số đủ. 23 mục của quyển 聴解 vẫn tích được, chỉ không hẹn ngày.
2. **Thiếu quyển 総まとめ N3 文法** trong thư mục giáo trình → trần tiến độ bị chặn ở **89%**.
   Có sách thì nạp thành bài học được ngay, định dạng `grammar.json` đã chạy tốt với 219 mẫu
   N5 và N4.
3. **Không có file âm thanh nào** trên máy, kể cả đĩa kèm quyển 聴解.

### Ba file

| File | Việc |
| --- | --- |
| [`n3-syllabus.ts`](src/app/core/n3/n3-syllabus.ts) | Dữ liệu: 241 buổi học chép từ mục lục bốn quyển, bốn giai đoạn, mốc ngày |
| [`n3.model.ts`](src/app/core/n3/n3.model.ts) | Kiểu và toán thuần: đổi ngày, rải mục vào lịch, tính phần trăm và nhịp học |
| [`n3-progress-store.ts`](src/app/core/services/n3-progress-store.ts) | Dấu tích trong `localStorage` |

`npm run verify:n3` soát dữ liệu và lịch: id không trùng, tiêu đề không rỗng, trọng số > 0, số
mục khớp mục lục sách (42/42/42/23), mỗi tuần đúng 7 ngày với ngày cuối là bài kiểm tra, mọi
đường dẫn trỏ tới bài **có thật và đúng loại** (bài ngữ pháp phải đi qua `/grammar/`), mọi khoá
chữ hiển thị đều có trong từ điển, bốn giai đoạn phủ kín không hở không trùng, thang điểm khớp
cả tổng 180 lẫn từng khối 60/60/60, và **nhịp mỗi giai đoạn không vượt 3,5 buổi/ngày** — kiểm
tra cuối cùng là quan trọng nhất với người học, vì một lộ trình đòi 6 buổi/ngày thì đúng về số
học và không ai theo được.

Workflow deploy chạy `npm run verify:ci` trước khi build, nên dữ liệu hỏng không lên được trang
thật. `verify:ci` nay gồm **cả** `verify:audio`, tức thiếu một file mp3 nào đó là deploy đỏ. Trước
đây không làm được vậy: bài N3 còn thiếu 205 file, nên cổng sẽ đỏ ở mọi lần deploy vì một việc
không liên quan gì tới thay đổi đang deploy — mà một cổng luôn đỏ thì chẳng ai đọc nữa. Nay 205
file đó đã sinh xong, và thiếu mp3 nghĩa là nút loa chết trên trang thật, nên chặn lại là đúng.

## Dịch hội thoại

Vào tab **Bài tập bổ trợ** → nhóm **Dịch hội thoại** → chọn một bài. Trang bài liệt kê
文型 / 例文 / 会話 của bài đó, mỗi câu một dòng gồm người nói, câu tiếng Nhật và bản dịch tiếng Việt.

**Luyện cả bài** — bấm **Bắt đầu** như mọi loại bài khác, chọn chiều Nhật → Việt hoặc Việt → Nhật.

**Luyện riêng một câu** — mỗi dòng có sẵn hai nút **→ Tiếng Nhật** và **→ Tiếng Việt**. Bấm là vào
thẳng màn hình luyện với đúng câu đó, không phải đụng tới khung thiết lập ở trên. Xong câu, nút
**Làm lại** ở màn hình kết quả cho gõ lại chính câu vừa rồi — tiện khi muốn nhai đi nhai lại một
câu cho thuộc.

Nút ghi theo **đích đến** (`→ Tiếng Nhật`) chứ không theo cặp chiều (`Việt → Nhật`) như khung thiết
lập: đứng cạnh một câu cụ thể thì thứ cần biết là sắp phải viết ra thứ tiếng nào, vế còn lại đã nằm
sẵn ngay trước mắt.

- **Chỉ có gõ đáp án**, không có trắc nghiệm — cùng lý do với bài ngữ pháp.
- Chấm điểm **bỏ qua dấu câu và khoảng trắng**: thiếu một dấu `、` hay `……` không phải là dịch
  sai. Bỏ qua khoảng trắng là hệ quả bắt buộc, không phải tiện tay làm thêm — xoá dấu câu đi thì
  chỗ nó đứng có thành ranh giới từ hay không là chuyện không đoán được. Sách in `Ừ...m` mà người
  học gõ liền `Ừm`, in `15.000 yên` mà người học gõ `15000 yên`, in `Tachiiri-Kinshi` mà người học
  gõ `Tachiiri Kinshi` — cả ba đều đúng. Nếu dấu câu chỉ đổi thành dấu cách thì mỗi trường hợp lại
  bị chấm sai một kiểu. `npm run verify:answer` quét toàn bộ câu hội thoại và ví dụ ngữ pháp đã
  sinh để giữ đúng điều này.
- Phạm vi **★ Chưa nhớ**, giới hạn số câu, trộn thứ tự — giống các loại bài khác.

**Hiện có: bài 26, 28, 29, 33, 39, 40.** Riêng bài 39 mới có phần 会話 — trang 文型/例文
tiếng Nhật của bài đó chưa có ảnh nguồn, mà bài dịch cần đủ cặp Nhật/Việt mới luyện được.

## Ngữ pháp

Vào tab **Ngữ pháp** → chọn một bài. Trang bài gồm hai phần:

**1. Lý thuyết.** Mỗi mẫu ngữ pháp là một thẻ riêng, có mục lục ở đầu trang để nhảy nhanh:

- **Công thức** — `V thể ngắn ＋ んです`, `Aな [だ → な] ＋ んです`…
- **Giải thích** bằng tiếng Việt.
- **Bảng biến đổi** khi mẫu cần (bài 26 có 4 bảng: động từ, tính từ い, tính từ な, danh từ).
- **Lưu ý** — các lỗi hay gặp, hiện trong khung vàng.
- **Cách dùng**, mỗi cách dùng kèm các câu ví dụ minh hoạ đúng cách dùng đó. Bấm ★ ở câu nào
  để đánh dấu câu hay quên.

**2. Luyện viết câu theo mẫu.** Gõ tay cả câu, hai chiều:

| Chiều | Câu hỏi | Đáp án |
| --- | --- | --- |
| Việt → Nhật | Tại sao bạn lại đến muộn vậy? | どうして おくれたんですか。 |
| Nhật → Việt | どうして おくれたんですか。 | Tại sao bạn lại đến muộn vậy? |

- **Chỉ có gõ đáp án**, không có trắc nghiệm — bốn câu dài bày ra để chọn thì đọc lướt là ra
  đáp án mà chẳng phải nhớ mẫu ngữ pháp nào.
- **Chọn mẫu đem ra luyện** — luyện riêng một mẫu hoặc trộn cả bài.
- **Gợi ý mẫu ngữ pháp** hiện dưới câu hỏi (`～んです — V thể ngắn ＋ んです`). Tắt đi thì
  phải tự nhớ ra mẫu nào hợp với câu.
- Chấm điểm **bỏ qua dấu câu và khoảng trắng**: thiếu một dấu `。` không có nghĩa là dùng sai
  ngữ pháp. Chiều Nhật → Việt còn nhận **các cách dịch tương đương** ngăn bằng dấu `/`.
- Phạm vi **★ Chưa nhớ**, giới hạn số câu, trộn thứ tự — giống các loại bài khác.

Bài ngữ pháp dùng lại nguyên màn hình luyện tập và màn hình kết quả của ba loại bài kia.

**Hiện có: trọn 50 bài** — 219 mẫu ngữ pháp, 828 câu ví dụ, 118 bảng biến đổi. Bài 1–25 là N5,
bài 26–50 là N4; lọc nhanh bằng nút **Cấp độ** ngay trên lưới thẻ.

Bài 1–25 và bài 39 soạn từ thư mục giáo trình trong `Downloads/Japanese`: slide `第NN課.pptx`
của phần N5, đối chiếu với mục "IV. Giải thích ngữ pháp" trong `Sách/Bản dịch và giải thích
ngữ pháp - Tập 1.pdf` và `Tập 2.pdf`. Riêng bài 39 không có slide nên bám hẳn theo Tập 2.

## Chia động từ

**Bốn dạng câu hỏi**

| Dạng | Ví dụ |
| --- | --- |
| Thể Mậu → thể khác | 逃げます → thể Te? → 逃げて |
| Thể khác → thể Mậu | 逃げて (thể Te) → thể Mậu? → 逃げます |
| Nhận diện nhóm động từ | 帰ります thuộc nhóm mấy? → Nhóm 1 |
| Nghĩa tiếng Việt → thể yêu cầu | "chạy trốn" → thể Te? → 逃げて |

Chọn được nhiều thể cùng lúc; mỗi động từ sẽ được hỏi một câu cho từng thể đã chọn.

**Không phải khai báo các thể.** Dữ liệu chỉ ghi thể ます + nhóm, app tự chia theo luật. Sửa một
động từ là sửa một dòng, không sợ gõ sai chính tả ở 4 cột khác nhau. Bảng chia đầy đủ hiện ngay
ở màn hình chi tiết bài học để tra cứu.

**Động từ đặc biệt.** Ba loại đều được xử lý:

- *Nhóm 1 nhìn như nhóm 2* — 帰ります, 入ります, 走ります, 切ります, 知ります… Đánh dấu bằng
  dấu `*` sau số nhóm; app gắn nhãn “đặc biệt” và cho **lọc riêng ra luyện** (phạm vi
  “Động từ đặc biệt”).
- *Ngoại lệ thể Te/Ta* — 行きます → 行って (không phải 行いて), あります → ない (không phải
  あらない). Nằm trong bảng bất quy tắc dựng sẵn, gắn nhãn “bất quy tắc”.
- *Nhóm 3* — します, 来ます và mọi động từ ghép ～します (勉強します, 結婚します…).

**Đáp án nhiễu bám sát lỗi thật.** Câu trắc nghiệm không lấy đại động từ khác mà ưu tiên theo thứ tự:

1. Chính động từ đó **chia nhầm nhóm** — hỏi thể Te của 走ります thì có đáp án 走りて (lỗi chia
   như nhóm 2). Đây là lỗi phổ biến nhất của người học.
2. Chính động từ đó ở **thể khác** — 走る, 走った, 走らない. Kiểm tra xem có phân biệt được các thể không.
3. Cùng thể đó của động từ khác, khi hai nguồn trên không đủ.

## Kanji

Tab **Kanji** là danh sách chữ Hán theo cấp JLPT: **2.123 chữ** — N5 118, N4 149, N3 375, N2 362,
N1 1.119 — lấy đúng theo `src/app/core/kanji/kanji-levels.ts`, và **giữ nguyên thứ tự** của danh
sách gốc (thứ tự dạy theo lối chiết tự: 一 二 八 六 日 目 三…, chữ ít nét và chữ làm thành phần của
chữ khác đi trước). Lưới hiện 12 ô một hàng, mỗi ô là chữ vẽ to kèm âm Hán Việt.

Mở một chữ ra là thấy chữ đó vẽ to, âm Hán Việt, và bảng các từ trong kho của ứng dụng có dùng
chữ đó (từ · cách đọc · âm Hán Việt của cả từ · nghĩa · cấp độ).

### Hai phần luyện tập — đều chỉ gõ đáp án

| Ở đâu | Chiều hỏi | Ví dụ |
| --- | --- | --- |
| `/kanji` (danh sách) | Chữ Hán → âm Hán Việt | `海` → `HẢI` |
| `/kanji/:id` (một chữ) | Từ kanji → nghĩa tiếng Việt | `海` → `biển` |
| `/kanji/:id` | Từ kanji → hiragana | `海` → `うみ` |
| `/kanji/:id` | Hỏi cả hai (mỗi từ 2 câu) | `海` → `biển` / `うみ` |

Phần luyện âm Hán Việt nằm ở màn hình **danh sách** vì nó hỏi trên cả cấp đang xem — mở từng chữ
ra để luyện đúng một chữ thì mỗi phiên chỉ có một câu. Ba chiều còn lại hỏi trên **từ** nên nằm ở
màn hình một chữ.

Chữ có nhiều âm (行 HÀNH/HÀNG, 楽 LẠC/NHẠC, 長 TRƯỜNG/TRƯỞNG) thì gõ âm nào cũng được tính đúng.
Tuỳ chọn **"Bỏ qua dấu tiếng Việt khi chấm"** giúp gõ `HAI` cũng đúng cho `HẢI`.

### Ba file dữ liệu

```
src/app/core/kanji/
  kanji-levels.ts       ← DANH SÁCH JLPT: chữ nào thuộc cấp nào, và thứ tự hiển thị
  kanji-supplement.ts   ← âm Hán Việt viết tay cho chữ kho từ không suy được
  kanji-words.ts        ← DO MÁY SINH: 2.123 chữ + âm Hán Việt + các từ dùng chữ đó
```

`kanji-levels.ts` là **nguồn duy nhất** quyết định chữ nào có mặt và thuộc cấp nào. Chữ có trong
kho từ nhưng không nằm trong ba danh sách thì không hiện ở khu Kanji.

### N2 và N1 khai khác ba cấp trên

Ba cấp N5→N3 nằm trong kho từ của ứng dụng nên âm Hán Việt **suy ra được từ chính nguồn**, và
chiết tự khai riêng ở `core/radical/radical-parts.ts`. Kho từ dừng ở 皆の日本語 bài 1-50, không
với tới N2 và N1 — hai cấp đó khai tay cả ba thứ trên **một dòng** ở `kanji-levels.ts`:

```
'病||疒+丙',        ← chữ | âm Hán Việt | chiết tự
'憲|HIẾN|宀+丰+罒+心'
```

Ô âm để trống nghĩa là "kho từ tự suy được" — script vẫn ưu tiên âm suy từ nguồn, dòng ở đây chỉ
là bản dự phòng. Gom ba thứ vào một dòng để chúng không bao giờ lệch nhau: thêm một chữ mà quên
âm hay quên chiết tự là điều không thể.

Hai cấp này chia theo nguyên tắc:

- **N2 (362 chữ)** — chữ mà **kho từ của ứng dụng có dùng** nhưng ba danh sách gốc chép thiếu
  (病 院 週 店 乗 近…). Vì kho từ có chúng nên chúng có sẵn từ minh hoạ và luyện được cả ba chiều
  như N5→N3. Vài chữ trong đó thật ra là trình độ N4/N3 — thà đứng hơi cao một cấp còn hơn vắng
  mặt khỏi ứng dụng.
- **N1 (1.119 chữ)** — phần còn lại của bảng jōyō, xếp theo **bộ thủ** của chữ. Kho từ không có
  chữ nào trong số này nên chúng chỉ luyện được "chữ → âm Hán Việt" ở khu Kanji; đổi lại chúng
  làm khu Bộ thủ dày lên hẳn (195/214 bộ có chữ ghép, so với 150 khi chỉ có N5→N3).

Tổng 2.123 chữ, thiếu 13 chữ so với bảng jōyō: bốn chữ 国字 không có âm Hán Việt (匂 峠 枠 匁) và
vài chữ hiếm. Thêm thì thêm dòng vào `KANJI_N1_ROWS` — script tự báo nếu thiếu âm hay chiết tự.

Muốn chữ N1 nào cũng luyện được nghĩa và cách đọc thì thêm từ chứa nó vào `data-source/` rồi chạy
lại `npm run generate:kanji` — script tự nhặt lên, và tự báo dòng âm Hán Việt ở đây đã thành thừa.

### Âm Hán Việt của từng chữ lấy ở đâu ra

Nguồn từ vựng ghi âm Hán Việt cho **cả từ** (`会社員 → HỘI XÃ VIÊN`), không ghi cho từng chữ. Mà
âm của một từ chính là âm các chữ ghép lại, nên khi số âm tiết khớp đúng số chữ Hán thì gán được
1:1: `会=HỘI`, `社=XÃ`, `員=VIÊN`. Một chữ được nhiều từ bỏ phiếu, âm nào nhiều phiếu nhất thì
thắng; các âm còn lại vẫn được nhận khi chấm. Từ nào lệch số âm tiết thì bỏ qua chứ không đoán.

`kanji-supplement.ts` lo phần còn lại, và là **dữ liệu duy nhất trong khu Kanji không tới từ
nguồn gốc**:

- **146 âm bổ sung** — phần lớn là chữ nằm trong danh sách JLPT mà kho từ chưa có từ nào chứa
  nó (chữ số kanji 三 六 八, và các chữ N3 như 匹 厚 肯 翌…), cộng vài chữ chỉ có trong bộ động từ
  khu Bài tập vốn không có cột âm Hán Việt.
- **0 chỗ sửa tay** — và đó là trạng thái đúng. Sáu chữ từng phải sửa (`試 泳 屋 洗 自 変`) đều
  là do một dòng nguồn gõ lệch dấu so với các dòng khác cùng chữ: `BỘ ÓC,部屋` cạnh `BỔN ỐC,本屋`,
  `THỦ TẢY,お手洗い` cạnh `TẨY,洗います`. Bản vá chữa cái BẢNG chứ không chữa cái NGUỒN, nên hai
  nơi nói khác nhau mãi. Nay 11 dòng nguồn đó đã sửa, kho từ tự nói đúng, và bảng chữ sinh ra
  **không đổi một chữ nào** sau khi bỏ hết bản vá — đúng bằng chứng rằng vá và sửa nguồn cho
  cùng một kết quả. Chỗ khai `HAN_VIET_FIX` vẫn giữ (rỗng) vì cơ chế còn cần cho lần sau.

```bash
npm run generate:kanji     # sinh lại kanji-words.ts
npm run verify:kanji       # kiểm tra file sinh có khớp nguồn không (nằm trong npm run verify)
```

### Script tự soát những gì

- Chữ trong danh sách JLPT mà **chưa có âm Hán Việt** → phải thêm vào `kanji-supplement.ts`.
- Dòng bổ sung / dòng sửa tay đã **thừa** (kho từ tự lo được, hoặc chữ không còn trong danh sách).
- Chữ trong danh sách mà **chưa có từ nào** trong kho — vẫn hiện ở lưới và vẫn luyện âm Hán Việt
  được, chỉ chưa luyện từ được. Hiện có 139 chữ như vậy.
- **Danh sách JLPT có dấu hiệu chép thiếu**: chữ xuất hiện trong từ vựng bài 1-25 mà lại nằm
  ngoài cả ba danh sách. Giáo trình có dùng vài chữ khó thật, nhưng nếu trong danh sách cảnh báo
  có chữ cơ bản (病 院 週 切 所) thì gần như chắc chắn `kanji-levels.ts` đang thiếu hàng.

Mục từ vựng là cả một câu (`お帰りなさい。`, `国へ帰るの？`) bị loại khỏi khu Kanji — ở đây hỏi
nghĩa và cách đọc của MỘT TỪ. Chỉ lọc theo dấu câu chứ không lọc theo trợ từ: cụm cố định kiểu
`電車に乗ります` chính là thứ giáo trình dạy nguyên khối. Chúng vẫn nằm nguyên trong bài học.


## Bộ thủ

Tab **Bộ thủ** đi ngược chiều với tab Kanji: tab Kanji đi từ **chữ ra từ** (chữ 海 → 海外, 海岸),
tab này đi từ **mảnh ra chữ** (bộ 氵 → 海, 泳, 湯). Danh sách là **toàn bộ 214 bộ thủ Khang Hy**,
xếp theo số nét và chia thành 7 nhóm tab: 1-2, 3, 4, 5, 6, 7-8, 9+ nét.

Mỗi ô trong lưới là bộ vẽ to, **dạng viết khác** của nó khi nằm trong chữ (亻 của 人, 氵 của 水,
艹 của 艸) và âm Hán Việt. Mở một bộ ra là thấy âm Hán Việt, nghĩa tiếng Việt, **tên gọi tiếng
Nhật** (にんべん, さんずい…), số nét, và bảng các chữ Hán ghép từ bộ đó:

| Chữ | Âm Hán Việt | Chiết tự | Từ ví dụ | Cấp |
| --- | --- | --- | --- | --- |
| 休 | HƯU | 亻 + 木 — NHÂN MỘC | 休みます（やすみます）— nghỉ | N5 |
| 時 | THỜI | 日 + 寺 — NHẬT TỰ<br>寺=土+寸 | 時計（とけい）— đồng hồ | N5 |

Dòng `寺=土+寸` chỉ hiện khi bộ đang xem **nằm sâu bên trong** một thành phần: nhìn 時 = 日 + 寺
thì không ai đoán được vì sao chữ này lại nằm trong bộ 寸, nên bảng chỉ luôn ra chỗ đó.

### Hai phần luyện tập — đều chỉ gõ đáp án

| Ở đâu | Chiều hỏi | Ví dụ |
| --- | --- | --- |
| `/radical` (danh sách) | Bộ thủ → âm Hán Việt | `氵` → `THỦY` |
| `/radical/:id` (một bộ) | Chữ ghép → âm Hán Việt | `休` → `HƯU` |
| `/radical/:id` | Chữ ghép → các bộ tạo thành | `休` → `NHÂN MỘC` |
| `/radical/:id` | Hỏi cả hai (mỗi chữ 2 câu) | `休` → `HƯU` / `NHÂN MỘC` |

Chiều **chiết tự** là phần riêng của khu này: gõ âm Hán Việt của từng bộ theo đúng thứ tự viết.
Gõ `NHÂN MỘC`, `NHÂN + MỘC` hay `NHÂN, MỘC` đều được tính đúng — dấu câu và khoảng trắng không
tính khi chấm. Đáp án là chữ Latin nên không cần bộ gõ tiếng Nhật.

Cũng như khu Kanji, phần luyện âm Hán Việt của **bộ** nằm ở màn hình danh sách (nó hỏi trên cả
nhóm nét đang xem), còn hai chiều hỏi trên **chữ ghép** nằm ở màn hình một bộ.

### Ba file dữ liệu

```
src/app/core/radical/
  radical-list.ts       ← 214 BỘ THỦ: chữ, biến thể, âm Hán Việt, nghĩa, tên tiếng Nhật
  radical-parts.ts      ← CHIẾT TỰ N5→N3: mỗi chữ Hán gồm những bộ nào (642 dòng)
  radical-kanji.ts      ← DO MÁY SINH: 214 bộ + 2.123 chữ + 5.604 lượt chữ ghép
```

Khu này **không chép tay lại bất cứ âm Hán Việt hay nghĩa nào của CHỮ**: âm Hán Việt, cấp độ và
từ ví dụ của từng chữ ghép đều lấy thẳng từ `kanji-words.ts` của khu Kanji, nên hai khu không
bao giờ nói khác nhau về cùng một chữ. Chạy `npm run generate:kanji` xong thì chạy tiếp
`npm run generate:radicals`.

```bash
npm run generate:radicals   # sinh lại radical-kanji.ts
npm run verify:radicals     # kiểm tra file sinh có khớp nguồn không (nằm trong npm run verify)
```

### Quy ước chiết tự

- Tách theo **hình chữ nhìn thấy trên mặt giấy**, không theo từ nguyên: 服, 育, 勝 ghi là 月 (dù
  gốc là 肉月 ⺼), vì đó là thứ người học nhìn và gõ.
- Tách theo **biến thể đang thực sự viết** (亻 chứ không phải 人); bảng bộ thủ đã khai biến thể
  nên gom vẫn về đúng bộ gốc.
- Thành phần nào lại tách được nữa thì script **tự khai triển tiếp** (`時:日+寺` + `寺:土+寸` cho
  ra 時 gom được về cả bộ 寸), nhưng vẫn **giữ thành phần ở giữa**: 岩 = 山 + 石 mà khai triển hết
  thì bộ 石 mất sạch chữ của nó.
- 阝 là một hình nhưng **hai bộ**: đứng trước là 阜 (こざとへん — 降, 陽, 階), đứng sau là 邑
  (おおざと — 部). Script xét vị trí trong dòng chiết tự để chia đúng bộ.
- Chữ **độc thể** (bản thân nó là bộ thủ) ghi thành phần là chính nó (`日:日`) và không vào bảng
  của bộ nào cả.

### Script tự soát những gì

- Chữ trong danh sách JLPT mà **chưa có dòng chiết tự** → báo lỗi, phải thêm vào `radical-parts.ts`.
- Thành phần **chưa tra được âm Hán Việt** → cảnh báo; chữ đó vẫn hiện ở bảng nhưng bị loại khỏi
  chiều hỏi chiết tự (màn thiết lập nói rõ có bao nhiêu chữ bị loại).
- Dòng âm bù trong `PART_HAN_VIET` đã **thừa** (không ai dùng, hoặc tra được ở chỗ khác).
- Một hình được **hai bộ cùng nhận** — dấu hiệu bảng bộ thủ khai trùng biến thể.

Hiện có **195 / 214 bộ** có chữ ghép trong kho N5→N1; 19 bộ còn lại (龠, 鬯, 黹, 鼎…) vẫn hiện ở
lưới và vẫn luyện âm Hán Việt được, chỉ chưa luyện chữ được — bảng jōyō không có chữ thông dụng
nào ghép từ chúng.


## Bài tập bổ trợ

Tab **Bài tập bổ trợ** gom mọi cách luyện không phải là nhớ nghĩa từ vựng, chia ba nhóm:

| Nhóm | Nội dung | Mở ở |
| --- | --- | --- |
| **Bài tập** | Hai bài chuyên đề cài sẵn trong mã nguồn | `/exercise/<id>` |
| **Chia động từ** | Bài động từ theo giáo trình, từ `data-source/` | `/lesson/<id>` |
| **Dịch hội thoại** | Bài hội thoại theo giáo trình, từ `data-source/` | `/lesson/<id>` |

Đầu trang có **ô tìm kiếm** lọc cả ba nhóm cùng lúc; nhóm không còn thẻ nào khớp thì mất luôn
cả tiêu đề nhóm chứ không để lại một tiêu đề trống. Số liệu ở góc phải đếm theo đúng phần đang
hiện.

Hai bài chuyên đề nằm ngoài giáo trình: chúng gom động từ của nhiều bài lẫn nhiều cấp theo một
chủ đề ngữ pháp, thay vì bám theo thứ tự bài trong sách. Cả hai **chỉ có gõ đáp án** — mục tiêu
là tự viết ra được dạng đúng, mà bày sẵn bốn đáp án thì chỉ còn là nhận mặt chữ. Ghi chú đó đặt
ngay trong nhóm của chúng chứ không ở cuối trang: bài **Chia động từ** bên dưới VẪN có trắc
nghiệm, treo câu "chỉ gõ đáp án" ở cuối trang là nói sai về nó.

### 1. Tự động từ & Tha động từ (N5 → N3)

Cho một vế, viết ra vế còn lại của cặp. **58 cặp**, mỗi vế có nghĩa tiếng Việt riêng vì cả
cặp cùng nói về một sự việc nhưng khác hẳn ở chỗ ai làm.

| Chiều | Câu hỏi | Đáp án |
| --- | --- | --- |
| Tự → Tha | 開きます | 開けます |
| Tha → Tự | 消します | 消えます |
| Trộn cả hai chiều | mỗi cặp được hỏi cả xuôi lẫn ngược | |

### 2. Chuyển thể động từ (N5 → N2)

Chuyển thể lịch sự ます sang thể Te / Ta / Ru / Nai và ngược lại. **293 động từ**, đủ ba nhóm
kể cả các trường hợp đặc biệt:

- *Nhóm 1 nhìn như nhóm 2* — 帰ります, 入ります, 走ります, 切ります, 知ります, 滑ります, 握ります,
  蹴ります, 喋ります, 参ります… Gắn nhãn “đặc biệt” và **lọc riêng ra luyện được**.
- *Ngoại lệ* — 行きます → 行って, あります → ない.
- *Kính ngữ chia bất quy tắc* — いらっしゃいます, くださいます, なさいます, おっしゃいます.
- *Nhóm 3* — します, 来ます, 持って来ます và các động từ ghép ～します.

| Chiều | Câu hỏi | Đáp án |
| --- | --- | --- |
| ます → thể ngắn | 帰ります → thể Te? | 帰って |
| thể ngắn → ます | 帰って (thể Te) → thể Mậu? | 帰ります |
| Trộn cả hai chiều | mỗi cặp được hỏi cả xuôi lẫn ngược | |

Chọn được nhiều thể cùng lúc; mỗi động từ được hỏi một câu cho từng thể đã chọn.

### Điểm chung của hai bài tập

- **Lọc theo cấp độ** — bật tắt N5 / N4 / N3 / N2, bảng tra cứu và số câu đổi theo ngay.
- **Gõ bằng kana cũng đúng** — `かえって` được tính đúng như `帰って`. Cách đọc được chia bằng
  đúng engine chia thể (luật chia bám vào kana ở đuôi), nên không phải khai tay thể nào cả.
- **Phạm vi ★ Chưa nhớ**, giới hạn số câu, trộn thứ tự, hiện/ẩn nghĩa tiếng Việt — giống các
  loại bài khác. Dấu ★ lưu riêng cho từng bài tập.
- **Bảng tra cứu** ngay dưới phần thiết lập: bảng cặp tự/tha động từ, hoặc bảng chia đủ 4 thể.
- Dùng lại nguyên màn hình luyện tập và màn hình kết quả của các loại bài kia.

Dữ liệu hai bài tập nằm thẳng trong mã nguồn (`src/app/core/exercises/`) chứ không đi qua
`data-source/` + `npm run generate`: đây là chức năng cố định của ứng dụng, không phải nội dung
người dùng tự nạp thêm. `npm run verify:conjugation` kiểm tra luôn phần dữ liệu này — mọi động
từ phải chia được theo nhóm đã khai, cách đọc phải là kana thuần kết thúc bằng ます và cũng
phải chia được, không có id nào trùng.

## Tính năng chung

**Bốn chiều luyện tập (bài từ vựng)**

| Chiều | Câu hỏi | Đáp án |
| --- | --- | --- |
| Nhật → Việt | 逃げます | chạy trốn/ bỏ chạy |
| Việt → Nhật | chạy trốn/ bỏ chạy | 逃げます |
| Nhật → Hán Việt | 逃げます | ĐÀO |
| Hán Việt → Nhật | ĐÀO | 逃げます |

**Hai cách trả lời**

- **Trắc nghiệm 4 đáp án** — bấm chuột hoặc nhấn phím `1`–`4`.
- **Gõ đáp án** — gõ rồi nhấn `Enter`.

**Quy tắc chấm**

- Trả lời đúng → hiện phản hồi, nhấn `Space` để sang câu tiếp theo.
- Trả lời sai → được thử lại. Sai **4 lần** thì hiện đáp án và **tính sai** câu đó; xem xong
  nhấn `Space` để đi tiếp.
- Riêng trắc nghiệm, số lượt sai tối đa bằng số đáp án nhiễu (3 với câu 4 lựa chọn) — chọn hết
  đáp án sai là đã lộ đáp án đúng nên tính sai luôn.
- Nút **“Chịu, xem đáp án”** cho phép bỏ qua sớm, câu đó tính là sai.

**Tuỳ chọn độ khó**

- Hiện/ẩn âm Hán Việt kèm câu hỏi (chỉ ở hai chiều Nhật ↔ Việt; tắt đi để khó hơn).
- Trộn thứ tự câu hỏi.
- Giới hạn số câu (10 / 20 / 30 / 50 / tất cả).
- Bỏ qua dấu tiếng Việt khi chấm (chỉ áp dụng cho chế độ gõ).

**Học theo cụm — 10 / 20 / 30 từ mới mỗi lượt**

Chọn số câu xong sẽ hiện thêm hàng **“Học theo cụm”**: bài 34 từ chọn 10 câu thì chia thành
**Cụm 1 · 1–10**, **Cụm 2 · 11–20**, **Cụm 3 · 21–30**, **Cụm 4 · 31–34**.

- Mỗi cụm là một khúc liền nhau theo **đúng thứ tự trong bài**, nên xong cụm này là chắc chắn
  sang từ chưa gặp. Thứ tự chỉ trộn *bên trong* cụm, không lôi từ của cụm khác vào.
- Học xong một cụm, màn hình kết quả mời **“→ Học tiếp cụm 2 (11–20)”** ngay ở nút đầu tiên,
  giữ nguyên mọi thiết lập vừa dùng. Bấm tiếp cho tới cụm cuối thì đổi thành lời chúc mừng
  đã đi hết bài.
- Luyện lại câu sai giữa chừng không làm mất mạch: xong lượt luyện lại, lời mời học tiếp cụm
  sau vẫn còn đó.
- Thanh tiến độ lúc làm bài và huy hiệu ở màn hình kết quả đều hiện **“Cụm 2/4”** để biết mình
  đang ở đâu trong bài.
- Vẫn giữ nguyên lựa chọn cũ: **“Ngẫu nhiên cả bài”** là cách chọn mặc định, bốc N câu bất kỳ
  trong toàn bài như trước giờ.

Cụm nằm trong một lần mở app, không lưu lại giữa các phiên (giống mọi thứ khác ngoài ★ Chưa nhớ).
Mở lại bài thì chọn thẳng cụm muốn học tiếp ở hàng “Học theo cụm”.

**Phát âm chuẩn (bài từ vựng)**

Mỗi từ trong bảng từ vựng có một nút loa 🔊 ngay cạnh từ. Bấm là nghe đọc, bấm lại là dừng; bấm
sang từ khác thì từ đang đọc dừng ngay, không bao giờ có hai tiếng chồng lên nhau.

Tiếng là **file mp3 thu sẵn** (1282 file, ~14 MB, giọng `ja-JP-NanamiNeural` của edge-tts), không
phải `speechSynthesis` của trình duyệt. Lý do: giọng tiếng Nhật của Web Speech API phụ thuộc hoàn
toàn vào máy người học — Windows không cài gói tiếng Nhật thì im lặng, Android mỗi hãng một kiểu,
và cùng một từ nghe mỗi máy một khác. Từ vựng là thứ học thuộc bằng tai nên âm phải giống hệt nhau
ở mọi máy.

Sinh lại khi thêm/sửa từ vựng (cần `pip install edge-tts`):

```bash
npm run generate:audio             # chỉ sinh những file còn thiếu
npm run generate:audio -- --clean  # sinh file thiếu, xoá file không từ nào dùng tới
npm run verify:audio               # kiểm tra đủ file chưa, không ghi gì
```

Bản offline một file (`npm run build:offline`) **không có** phần này — mở bằng `file://` thì không
tải được tài nguyên ngoài, nên nút loa tự ẩn đi thay vì bày ra rồi bấm không kêu.

**Favorite — luyện từ chưa nhớ**

Bấm ngôi sao ở bảng từ vựng, trong lúc luyện, hoặc ở màn hình kết quả để đánh dấu từ hay quên.
Khi bắt đầu luyện, chọn phạm vi **“★ Chưa nhớ”** để chỉ luyện nhóm này thay vì toàn bài.
Đây là dữ liệu duy nhất được lưu lại giữa các phiên (trong `localStorage`).

**Giao diện hai ngôn ngữ: Tiếng Việt / 日本語**

Nút 🌐 ở header đổi ngôn ngữ ngay lập tức, kể cả đang làm dở một câu. Lựa chọn được nhớ cho lần
mở sau, và `<html lang>` cũng đổi theo.

**Đổi ngôn ngữ không làm layout xê dịch** — chữ đổi còn mọi khung, cột, nút đứng nguyên tại chỗ.

Phần **dịch** là giao diện: nút, nhãn, thông báo lỗi, tiêu đề tab, tên các thể động từ, tên nhóm.
Phần **không dịch** là nội dung bài học — nghĩa tiếng Việt của từ vựng, tên và mô tả bài học lấy
từ `meta.json`. Đó là dữ liệu học chứ không phải giao diện; muốn tên bài hiện bằng tiếng Nhật thì
sửa `name` trong `data-source/<bài>/meta.json`.

**Giao diện sáng / tối / đèn đêm**

Nút ở góc phải header xoay vòng **Tự động → Sáng → Tối → Đèn đêm**. “Tự động” đi theo cài đặt
sáng/tối của hệ điều hành và đổi ngay khi bạn đổi cài đặt đó; ba lựa chọn còn lại ép cứng bất kể
hệ thống đang để gì. Lựa chọn được nhớ lại cho lần mở sau.

**Đèn đêm** làm đúng việc mà Night light của Windows làm, nhưng chỉ trong trang này: giữ độ sáng
vừa phải của giao diện sáng và cắt bớt ánh sáng xanh, nên nền ngả màu giấy ngà, chữ là nâu đậm,
màu nhấn đổi từ chàm sang cam đất. Hợp với lúc học buổi tối — nền trắng thì chói, mà nền tối lại
quá tương phản với đèn phòng. Ba bậc chữ và bốn màu trạng thái vẫn đạt WCAG AA như hai tông kia.

**Kết quả**

Mỗi lần luyện là một lần mới, không lưu lịch sử. Kết thúc phiên sẽ hiện tỉ lệ đúng, số câu đúng
ngay lần đầu / đúng sau khi thử lại / sai, thời gian làm, danh sách chi tiết từng câu, kèm nút
“Luyện lại các câu sai” và “Đánh dấu ★ tất cả câu sai”.

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
- File phải đặt tên là `verbs.txt` / `dong-tu.txt` (xem [`data-source/README.md`](data-source/README.md)).

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

Hướng dẫn đầy đủ nằm ngay cạnh dữ liệu: [`data-source/README.md`](data-source/README.md).
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

Các lệnh khác của script:

```bash
npm run generate:check    # chỉ kiểm tra dữ liệu, không ghi file
npm run generate:clean    # sinh lại và xoá luôn file .json không còn thư mục nguồn
```

Script báo rõ từng dòng lỗi (thiếu cột, cột rỗng) và từng dòng trùng, kèm số dòng.

### Cách 2 — Nạp trực tiếp trên giao diện — **ĐANG TẮT**

> Màn hình này đã bị tắt. Cờ `IMPORT_LESSON_ENABLED` trong
> [`src/app/core/feature-flags.ts`](src/app/core/feature-flags.ts) đang để `false`, nên mục
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
- **Tải file JSON** — tải file `<id>.json` về để đặt vào `public/lessons/` nếu muốn bài học đi
  kèm mã nguồn (nhớ thêm bài đó vào `index.json`, hoặc tốt hơn là dùng Cách 1).

Bài tự nạp có nhãn **“Tự nạp”** và xoá được bất cứ lúc nào.

## Cấu trúc dự án

```
LO-TRINH-N3.md                   Bản phân tích lộ trình thi N3 (đề thi, kiểm kê, 241 ô tích)
data-source/                     Nguồn dữ liệu dạng text, mỗi thư mục là một bài
  minano-nihongo-33/
    meta.json                    Tên hiển thị + loại bài (tuỳ chọn)
    vocabulary.txt               Danh sách từ vựng
  dong-tu-dac-biet/
    meta.json
    verbs.txt                    Danh sách động từ
scripts/
  vocab-core.mjs                 Lõi phân tích từ vựng + động từ (Node)
  generate-lessons.mjs           Sinh public/lessons/*.json + index.json
  build-offline.mjs              Gộp bản build thành dist/offline/index.html một file
  verify-parser-parity.mjs       Kiểm tra hai bản parser cho kết quả giống nhau
  verify-answer-check.mjs        Kiểm tra bộ chấm câu dài bỏ qua dấu câu / khoảng trắng
  verify-conjugation.mjs         Kiểm tra engine chia động từ + dữ liệu thật
  generate-kanji.mjs             Sinh core/kanji/kanji-words.ts từ chính kho từ
  generate-topics.mjs            Sinh core/topics/topic-{catalog,words}.ts từ chính kho từ
  han-viet-compose.mjs           Ghép âm Hán Việt của cả từ từ âm của từng chữ
  generate-radicals.mjs          Sinh core/radical/radical-kanji.ts từ bảng bộ thủ + chiết tự
  generate-audio.mjs             Sinh public/audio/vocab/*.mp3 bằng edge-tts
  edge-tts-batch.py              Bộ đọc chạy nền của generate-audio.mjs (Python)
  verify-n3.mjs                  Kiểm lộ trình N3: khớp mục lục sách, lịch phủ kín, nhịp học
public/lessons/                  Dữ liệu JSON do script sinh ra (không sửa tay)
  index.json
  minano-nihongo-33.json
public/audio/vocab/              File phát âm do script sinh ra (không sửa tay)
  index.json                     Bảng tra tên file <-> chuỗi đem đọc
  <băm>.mp3
src/app/
  core/
    audio/
      vocab-audio.ts             Quy tắc đặt tên file phát âm — DÙNG CHUNG với script
    japanese/
      conjugation.ts             Luật chia động từ — bản cài đặt DUY NHẤT
    exercises/
      exercise.model.ts          Kiểu dữ liệu + danh sách hai bài tập
      transitive-pairs.ts        58 cặp tự động từ / tha động từ (N5→N3)
      exercise-verbs.ts          293 động từ cho bài chuyển thể (N5→N2)
    kanji/
      kanji.model.ts             Kiểu dữ liệu + chiều hỏi của khu Kanji
      kanji-levels.ts            Danh sách JLPT N5→N1 — quyết định chữ nào, cấp nào
      kanji-supplement.ts        Âm Hán Việt viết tay cho chữ kho từ không suy được
      kanji-words.ts             2.123 chữ + 2.406 lượt từ — DO MÁY SINH
      kanji-entries.ts           Dựng danh sách chữ + tra theo id
    topics/
      topic.model.ts             Kiểu dữ liệu + hàm dựng bài học của khu Chủ đề
      topic-list.ts              20 chủ đề: tên + danh sách từ — KHAI TAY, chỉ script đọc
      topic-catalog.ts           Danh mục nhẹ (id, tên, số từ) — DO MÁY SINH
      topic-words.ts             1.097 lượt từ đã tra từ kho — DO MÁY SINH
      topic-entries.ts           Dựng bài học từ hai file trên — NẠP ĐỘNG
    radical/
      radical.model.ts           Kiểu dữ liệu + chiều hỏi của khu Bộ thủ
      radical-list.ts            214 bộ thủ Khang Hy — chữ, biến thể, âm, nghĩa, tên Nhật
      radical-parts.ts           Chiết tự 642 chữ N5→N3 thành các bộ (N2/N1 khai ở kanji-levels)
      radical-kanji.ts           214 bộ + 5.604 lượt chữ ghép — DO MÁY SINH
      radical-entries.ts         Dựng danh sách bộ + tra theo id
    models/                      Kiểu dữ liệu bài học và phiên luyện tập
    n3/
      n3.model.ts                Kiểu + toán thuần: rải mục vào lịch, tính phần trăm và nhịp
      n3-syllabus.ts             241 buổi học chép từ mục lục bốn quyển 総まとめ + bốn giai đoạn
    practice/
      batch.ts                   Chia phạm vi thành từng cụm liền nhau (học theo cụm)
      build-questions.ts         Điều phối: dựng câu hỏi, trộn, cắt theo số câu
      vocabulary-questions.ts    Câu hỏi cho bài từ vựng
      verb-questions.ts          Câu hỏi cho bài động từ + đáp án nhiễu
      conversation-questions.ts  Câu hỏi cho bài hội thoại
      grammar-questions.ts       Câu hỏi cho bài ngữ pháp
      exercise-questions.ts      Câu hỏi cho hai bài tập
      kanji-questions.ts         Câu hỏi cho khu Kanji
      radical-questions.ts       Câu hỏi cho khu Bộ thủ
    services/
      lesson-store.ts            Nạp bài học từ JSON + localStorage
      favorite-store.ts          Danh sách mục chưa nhớ
      practice-session-store.ts  Chạy phiên và chấm điểm
      theme-store.ts             Lựa chọn giao diện sáng/tối/đèn đêm
      vocab-audio-player.ts      Phát file mp3 phát âm, mỗi lúc chỉ một từ
      n3-progress-store.ts       Dấu "đã học xong" của từng buổi trong lộ trình N3
    utils/
      vocabulary-parser.ts       Bản TypeScript của vocab-core.mjs
      answer-check.ts            So khớp đáp án gõ tay
    guards/                      Chặn vào /practice và /result khi không có phiên
  features/
    lesson-list/                 Trang chủ — chỉ bài từ vựng
    lesson-detail/               Bảng từ vựng + thiết lập luyện tập (dùng cho cả /topic/:id)
    topic-list/                  Tab Từ vựng chủ đề — lưới 20 chủ đề
    grammar-list/                Tab Ngữ pháp — danh sách bài
    grammar-detail/              Lý thuyết một bài ngữ pháp + thiết lập luyện tập
    exercise-list/               Tab Bài tập bổ trợ — bài tập chuyên đề + bài động từ + bài hội thoại
    exercise-detail/             Một bài tập: thiết lập luyện + bảng tra cứu
    n3-progress/                 Tab Tiến độ N3 — phần trăm, nhịp học mỗi ngày, bảng kiểm soát
    kanji-list/                  Tab Kanji — lưới chữ Hán + luyện âm Hán Việt
    kanji-detail/                Một chữ: các từ dùng chữ đó + luyện từ
    radical-list/                Tab Bộ thủ — lưới 214 bộ + luyện âm Hán Việt
    radical-detail/              Một bộ: các chữ ghép từ bộ đó + luyện chữ
    practice/                    Màn hình làm bài
    result/                      Màn hình kết quả
    import-lesson/               Nạp bài mới (đang tắt, xem core/feature-flags.ts)
```

## Lưu ý kỹ thuật

**Hai bản parser phải giống nhau.** `scripts/vocab-core.mjs` (dùng bởi script) và
`src/app/core/utils/vocabulary-parser.ts` (dùng bởi màn hình nạp bài) cài cùng một thuật toán.
Id của từ vựng được băm từ nội dung (`FNV-1a`) và danh sách Favorite lưu theo id đó, nên nếu hai
bản lệch nhau thì cùng một bài học nạp bằng hai đường sẽ có id khác nhau và Favorite mất tác
dụng. **Sửa một bên thì phải sửa bên kia**, rồi chạy:

```bash
npm run verify           # chạy tất cả các lệnh kiểm tra bên dưới
npm run verify:parser    # hai bản parser cho kết quả giống nhau
npm run verify:answer    # dấu câu / khoảng trắng không làm sai kết quả chấm
npm run verify:conjugation  # engine chia động từ + dữ liệu động từ thật
npm run verify:topics    # 20 chủ đề khớp kho từ, không chủ đề nào bịa ra từ mới
npm run verify:audio     # mọi từ vựng đều có file phát âm
```

`verify:parser` so sánh kết quả của hai bản trên cùng bộ dữ liệu mẫu và đối chiếu id trong file
JSON đã sinh. Cần Node 22+ (dùng `--experimental-strip-types` để nạp thẳng file `.ts`).

`verify:answer` nạp thẳng [`answer-check.ts`](src/app/core/utils/answer-check.ts) rồi gõ lại **mọi**
câu hội thoại và ví dụ ngữ pháp trong `public/lessons` theo các kiểu người học hay gõ — bỏ dấu lửng,
gõ `...` thay `……`, tiếng Nhật gõ liền không dấu cách — và bắt tất cả phải được chấm đúng. Nó cũng
giữ chiều ngược lại: dịch thiếu nửa câu hay sai dấu thanh vẫn phải bị chấm sai. Bài mới thêm vào
được kiểm luôn, không phải viết thêm ca thử.

**Engine chia động từ thì KHÔNG bị nhân đôi.** `src/app/core/japanese/conjugation.ts` là bản cài
đặt duy nhất; dữ liệu JSON chỉ lưu thể ます + nhóm, còn các thể khác tính lúc chạy. Sửa luật chia
là có hiệu lực ngay, không phải sinh lại dữ liệu. `npm run verify:conjugation` nạp thẳng file
`.ts` đó để chạy 35 ca kiểm thử (đủ 9 âm cuối của nhóm 1, các trường hợp bất quy tắc, và các ca
PHẢI bị từ chối), rồi quét toàn bộ động từ trong `public/lessons` xem có từ nào khai báo sai nhóm.

**Tên file phát âm băm từ CHUỖI ĐEM ĐỌC, không phải từ id của từ.**
[`src/app/core/audio/vocab-audio.ts`](src/app/core/audio/vocab-audio.ts) là nơi duy nhất quyết định
từ nào ứng với file nào; `scripts/generate-audio.mjs` nạp thẳng chính file `.ts` đó (qua
`--experimental-strip-types`) chứ không chép lại, nên script ghi file ở đâu là app đi tìm đúng ở đó.

Vì sao không lấy id của từ làm tên file: id băm từ `japanese|hanViet`, **không gồm cách đọc**. Sửa
lại một cách đọc ghi sai thì id giữ nguyên — app sẽ vui vẻ phát lại đúng file đọc sai cũ. Băm từ
chuỗi đem đọc thì sửa cách đọc = đổi tên file = buộc phải sinh lại, còn file cũ thành mồ côi và bị
`--clean` dọn đi. Hai từ trùng cách đọc (きます của 来ます và 着ます) dùng chung một file, đúng như
mong đợi.

Băm dùng FNV-1a **64-bit** chứ không dùng lại `hashId` 32-bit của parser: với ~1300 chuỗi, xác suất
đụng độ ở 32-bit là cỡ 1/5000 — nhỏ, nhưng hậu quả đúng bằng điều phải tránh nhất ở đây (một từ phát
ra âm của từ khác). `generate-audio.mjs` vẫn kiểm tra đụng độ một lần nữa và **dừng hẳn** nếu gặp,
thay vì ghi đè.

**Id ổn định.** Vì id băm từ nội dung chứ không phải từ vị trí dòng, chạy lại `npm run generate`
sau khi thêm/bớt/sắp xếp lại từ vựng sẽ không làm mất Favorite của các từ cũ. Chỉ khi sửa nội
dung tiếng Nhật hoặc âm Hán Việt của một từ thì từ đó mới đổi id.

**Đa ngôn ngữ dịch lúc chạy, không dùng i18n của Angular.** `ng build --localize` dịch lúc biên
dịch: mỗi ngôn ngữ là một bundle riêng, đổi ngôn ngữ phải tải trang khác, và **bản offline một
file sẽ không làm được** (thành 2 file, không có nút chuyển). Thay vào đó toàn bộ chữ nằm ở
[`src/app/core/i18n/messages.ts`](src/app/core/i18n/messages.ts) dưới dạng `khoá → { vi, ja }`, và
`LanguageStore` là một signal — template gọi `t('khoá')`, Angular ghi nhận phụ thuộc signal nên đổi
ngôn ngữ là vẽ lại ngay.

Hệ quả với code: nhãn trong model **không chứa chữ sẵn mà chứa khoá** (`labelKey`, `shortKey`,
`exampleKey`…). Câu hỏi cũng lưu khoá chứ không lưu chữ đã dịch, nên đổi ngôn ngữ giữa phiên là
cả nhãn câu hỏi lẫn các lựa chọn đều đổi theo. Riêng câu "nhận diện nhóm" lưu đáp án là mã
`"1"/"2"/"3"` chứ không phải chữ — nếu lưu chữ thì đổi ngôn ngữ giữa câu sẽ làm chấm điểm sai.

Chạy `npm run verify:i18n` để kiểm tra: khoá dùng trong code có trong từ điển, từ điển đủ cả hai
ngôn ngữ, tham số `{ten}` khớp nhau giữa hai bản dịch (thiếu một tham số là lỗi im lặng — chữ vẫn
hiện nhưng mất số liệu), và không còn chuỗi tiếng Việt cứng sót trong template.

**Đổi ngôn ngữ không được làm layout xê dịch.** Chữ hai ngôn ngữ dài ngắn khác nhau nên xuống dòng
khác nhau, làm mọi thứ bên dưới nhảy chỗ. Cách xử lý:

- [`core/i18n/t.ts`](src/app/core/i18n/t.ts) — component `<app-t>` vẽ bản dịch của **mọi ngôn ngữ**
  chồng lên nhau trong một ô grid, chỉ ngôn ngữ đang chọn là hiện, các bản kia `visibility: hidden`.
  Chữ ẩn vẫn chiếm chỗ nên ô luôn rộng/cao bằng bản dài nhất. **Không dùng `min-width`/`min-height`
  với số đo cố định** — loại đó đúng hôm nay và sai âm thầm vào hôm ai đó sửa một câu dịch.
  Chỉ cần dùng ở chỗ kích thước ảnh hưởng tới vị trí phần khác; chữ nằm một mình thì `{{ t('key') }}`
  là đủ.
- Bảng dùng `table-layout: fixed` + bề rộng cột khai báo sẵn, nên cột không co giãn theo độ dài chữ.
- `.icon-btn-glyph` có bề rộng cố định: cùng ký tự `◐`/`☀`/`🕯`/`🌐` nhưng khi `<html lang>` đổi thì
  trình duyệt chọn font khác và ký tự render rộng hẹp khác nhau (đo được 13px ↔ 16px).

**Bảng màu chỉ khai báo một lần.** `src/styles.css` dùng `light-dark(giá trị sáng, giá trị tối)`
cho từng biến màu, nên không có chuyện bảng màu tối bị lệch khỏi bảng màu sáng khi sửa. Đổi tông
thực chất chỉ là đổi thuộc tính `color-scheme`, do `ThemeStore` đặt qua `data-theme` trên thẻ
`<html>`. Thêm màu mới thì viết đúng một dòng `light-dark(...)`.

Tông **đèn đêm** là ngoại lệ, vì `light-dark()` chỉ biết đúng hai giá trị: nó là một bảng màu ấm
viết tay dưới `:root[data-theme='night']`, ghi đè lên đúng các biến đã khai báo ở `:root`. Cái giá
phải trả là thêm màu mới thì phải nhớ thêm cả ở đó; đổi lại, không component nào phải biết tông
này tồn tại — chúng vẫn chỉ đọc biến như cũ.

Trong `index.html` có một đoạn script nhỏ đọc lựa chọn đã lưu và đặt `data-theme` **trước khi**
Angular khởi động, để trang không chớp sai màu một nhịp lúc mới mở. Nếu đổi khoá lưu trữ trong
`ThemeStore` thì phải sửa đoạn script đó cho khớp (cả trong `src/index.html` lẫn
`scripts/build-offline.mjs`).

**Trạng thái phiên nằm trong bộ nhớ.** Tải lại trang giữa lúc đang luyện sẽ mất phiên và bị đưa
về trang chủ — đúng với yêu cầu “mỗi lần luyện tập là một lần mới, không lưu lịch sử”.

**Gõ tiếng Nhật.** Hai chiều có đáp án là tiếng Nhật (Việt → Nhật, Hán Việt → Nhật) cần bật bộ
gõ tiếng Nhật (IME) khi dùng chế độ gõ đáp án. Nếu không có IME, dùng chế độ trắc nghiệm.
Khi so khớp tiếng Nhật, mọi khoảng trắng đều được bỏ qua.
