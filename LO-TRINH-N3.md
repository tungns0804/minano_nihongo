# Lộ trình thi đỗ JLPT N3 — 05/09/2026 → 10/12/2026

> **Tài liệu này là bản phân tích.** Bảng kiểm soát *sống* nằm trong ứng dụng, tab
> **Tiến độ N3** (`/n3`): tích một buổi học ở đó thì phần trăm và nhịp học mỗi ngày
> tự tính lại. Dữ liệu lộ trình là `src/app/core/n3/n3-syllabus.ts`; toán tính tiến
> độ là `src/app/core/n3/n3.model.ts`; `npm run verify:n3` soát tính toàn vẹn.
>
> Mọi số liệu về đề thi trong tài liệu này chép từ **trang 6–7 của bốn quyển
> 日本語総まとめ N3** trong `C:\Users\Admin\Downloads\Japanese\N3`. Chỗ nào không có
> trong nguồn đó thì ghi rõ là **chưa xác nhận** — không lấp bằng cách đoán.

- **Ngày thi:** 10/12/2026
- **Ngày bắt đầu:** 05/09/2026
- **Tổng thời gian:** 96 ngày (13 tuần 5 ngày)
- **Ngày cuối được nạp bài mới:** 17/11/2026 — sau đó chỉ luyện đề
- **Giáo trình:** 皆の日本語 初級 I・II (N5+N4) và 日本語総まとめ N3
- **Nhịp học thiết kế:** 2,4–2,9 buổi/ngày, khoảng 60–100 phút/ngày

---

## 1. Đỗ N3 nghĩa là gì

Đề N3 thi trong ba phiên, và **điểm được chia thành ba khối riêng biệt**:

| Phiên thi | Thời gian | Khối điểm | Thang điểm |
| --- | --- | --- | --- |
| 言語知識（文字・語彙） | 30 phút | 言語知識（文字・語彙・文法） | 0–60 |
| 言語知識（文法）・読解 | 70 phút | 読解 | 0–60 |
| 聴解 | 40 phút | 聴解 | 0–60 |
| | | **Tổng** | **0–180** |

Điều quan trọng nhất của cả tài liệu này nằm ở mục 合否の判定 trang 6:

> Mỗi khối điểm có **điểm chuẩn riêng**. Thiếu điểm chuẩn ở dù chỉ **một** khối là
> **trượt**, cho dù tổng điểm cao.

Hệ quả trực tiếp, và là lý do lộ trình được thiết kế như ở mục 5:

- Học thuộc cả nghìn từ mà bỏ đọc hiểu thì **trượt**. 読解 là một khối 60 điểm
  đứng riêng, không có ai gánh hộ.
- Không luyện nghe thì **trượt**, bất kể ba phần kia đầy điểm. Đây là giới hạn lớn
  nhất của lần này — xem mục 8.
- Vì vậy tiến độ ở tab `/n3` **không đo bằng "số bài đã học / tổng số bài"** mà đo
  bằng **điểm khối quy đổi**. "Xong 90% số bài" mà 90% đó nằm cả trong một khối thì
  vẫn là trượt chắc, và một con số nói ngược lại là một con số nói dối.

### Các dạng câu hỏi (trang 7 mỗi quyển)

| Khối | Dạng câu (大問) | Số câu | Đề hỏi gì |
| --- | --- | --- | --- |
| 文字 | 漢字読み | 8 | Cách đọc của từ viết bằng chữ Hán |
| 文字 | 表記 | 6 | Từ viết bằng hiragana thì viết bằng chữ Hán thế nào |
| 語彙 | 文脈規定 | 11 | Chọn từ đúng theo ngữ cảnh |
| 語彙 | 言い換え類義 | 5 | Từ/cách nói gần nghĩa nhất |
| 語彙 | 用法 | 5 | Từ đó được dùng thế nào trong câu |
| 読解 | 内容理解（短文） | 4 | Đoạn 150–200 chữ |
| 読解 | 内容理解（中文） | 6 | Đoạn ~350 chữ, từ khoá và quan hệ nhân quả |
| 読解 | 内容理解（長文） | 4 | Đoạn ~550 chữ, ý chính và mạch lập luận |
| 読解 | 情報検索 | 2 | Tìm thông tin trong quảng cáo/tờ rơi ~600 chữ — **dạng mới** |
| 聴解 | 課題理解 | 6 | Nghe rồi biết phải làm gì tiếp |
| 聴解 | ポイント理解 | 6 | Nghe có định hướng trước |
| 聴解 | 概要理解 | 3 | Ý định, chủ trương của người nói |
| 聴解 | 発話表現 | 4 | Xem tranh, chọn câu nói phù hợp — **dạng mới** |
| 聴解 | 即時応答 | 9 | Đáp lại một câu ngắn — **dạng mới** |

**文法 không có trong bảng này.** Ba dạng câu của phần ngữ pháp nằm ở trang 7 của
quyển 総まとめ N3 文法, mà quyển đó **không có trong máy**. Đây là lỗ hổng số 1, xem
mục 4.

---

## 2. Giáo trình đang có trong tay

Kiểm kê `C:\Users\Admin\Downloads\Japanese` — 31 PDF (hơn 2.700 trang), 55 pptx,
6 docx.

### Cốt lõi — bốn quyển 総まとめ N3

| Quyển | Trang | Cấu trúc | Dùng cho |
| --- | --- | --- | --- |
| `Nihongo_Soumatome_N3-Kanji.pdf` | 120 | 6 tuần × 7 ngày = **42 buổi** | 文字 (漢字読み, 表記) |
| `Nihongo_Soumatome_N3-Goi.pdf` | 124 | 6 tuần × 7 ngày = **42 buổi**, ~1.200 từ | 語彙 |
| `Nihongo_Soumatome_N3-Dokkai.pdf` | 113 | 6 tuần × 7 ngày = **42 buổi** | 読解, kể cả 情報検索 |
| `Nihongo_Soumatome_N3-Choukai.pdf` | 116 | 5 chương = **23 mục** | 聴解 — **thiếu đĩa** |

Ngày thứ bảy của mỗi tuần trong ba quyển đầu là **実戦問題** (18 bài kiểm tra cả
thảy). Quyển 聴解 chia chương, mỗi chương kết bằng **まとめ問題**, chương 5 là một đề
mô phỏng trọn phần nghe.

Mục lục bốn quyển đã được chép tay và **đối chiếu độc lập hai lượt** trước khi đưa
vào `n3-syllabus.ts`; `npm run verify:n3` khoá lại con số 42/42/42/23 để một dòng
bị xoá hay chép lặp là báo lỗi ngay.

### Nền N4 — dùng cho giai đoạn 1

| File | Trang | Giá trị với N3 |
| --- | --- | --- |
| `Sách giáo khoa - Minna no Nihongo - Tập 2.pdf` | 330 | Bài 26–50: 受身, 使役, 尊敬語/謙譲語, 条件形 — 総まとめ N3 **giả định đã biết**, không dạy lại |
| `Bản dịch và giải thích ngữ pháp - Tập 2.pdf` | 181 | **Quyển tiếng Việt duy nhất** giải thích ngữ pháp. Có lớp chữ, tra được |
| `Sách Kanji bài học - Tập 2.pdf` | 256 | Bài 24–50; hai tập cộng lại ~536 chữ, N3 cần khoảng 650 |
| `Luyện tập mẫu câu - Tập 2.pdf` | 185 | Bảng まとめ tách 可能/受身/尊敬 và 尊敬/謙譲 — đúng chỗ 文法 hay bẫy |
| `Sách Bài Tập Ngữ Pháp - Tập 2.pdf` | 72 | Ôn nhanh ngữ pháp N4, vài trang một lần |
| `25 Bài đọc hiểu sơ cấp - Tập 2.pdf` | 112 | Đọc hiểu mức N4 — bậc thang nếu 読解 tuần 1 thấy dốc |
| `N4/第26課…第50課.pptx` (24 file) | — | Slide tiếng Việt, giảng rõ nhất trong cả bộ. **Thiếu 第39課** |
| `N4/*.docx` (MCQ của giáo viên) | — | **Bài tập 4 đáp án duy nhất** trong cả thư mục, đúng hình dạng 文法 問題1. Chỉ phủ bài 26–30 |

### Không dùng cho N3

Toàn bộ phần N5: `Minna Tập 1`, `標準問題集 Tập 1`, hai bộ luyện viết Kanji N5,
`TỪ VỰNG N5.pdf` (63 MB, **có hai bản trùng nhau**), 47 slide N5 (khoảng 20 file là
bản `(1)` trùng), và cả 6 đề N5. Đề N5 chỉ còn giá trị làm **mẫu định dạng** đề JLPT
thật (bố cục phiếu trả lời, cách chia thời gian).

Dọn dẹp nên làm (5 phút, không phải việc học): xoá một bản `TỪ VỰNG N5.pdf`; hai file
`Đề N5 đề số 3.pdf` cùng tên tồn tại song song **chỉ vì một tên là Unicode NFC và một
là NFD** — sẽ làm mọi script quét thư mục sai; 11 file khoá `~$` bỏ quên;
`Luyện tập mẫu câu - Tập 2.pdf` nặng 286 MB cho 185 trang và `Dokkai` nặng 151 MB
(quét ở ~6.600 px) — nên nén lại cho đỡ nặng máy; `Student_Management.zip` là một
project React xếp lẫn vào thư mục giáo trình.

---

## 3. Nội dung đã có trong ứng dụng

| Trụ | Đã có | Còn thiếu |
| --- | --- | --- |
| 文字 | **375/375 chữ Kanji N3** (`kanji-levels.ts`), 345 chữ có chiết tự bộ thủ | 103 chữ chưa có từ ví dụ; app dạy **âm Hán Việt**, mà đề JLPT hỏi **音読み/訓読み** — hai việc khác nhau |
| 語彙 | **6/42 bài** 総まとめ N3, 215 từ | 36 bài. Trong 215 từ: **0 từ có câu ví dụ**, 0 từ có âm Hán Việt, chỉ ~120 từ có cách đọc |
| 文法 | 24 bài ngữ pháp 皆の日本語 26–50 (93 mẫu) | **0 mẫu N3.** Định dạng `grammar.json` và màn hình đã có sẵn — chỉ thiếu nội dung |
| 読解 | — | **0.** Và chưa có cả đường ống: `LessonKind` chưa có `reading`, chưa có bộ đọc dữ liệu, chưa có màn hình |
| 聴解 | Chỉ có nút đọc **từng từ** trong bảng từ vựng | **0** dạng bài nghe. Chưa có chiều luyện "nghe rồi trả lời" |
| Bổ trợ | 29 cặp tự/tha động từ N3, 63 động từ N3 để chia thể, 214 bộ thủ | — |

Ba lỗi lặng lẽ phát hiện khi kiểm kê, nên sửa nhưng **không thuộc phạm vi lần này**:

1. `npm run verify:audio` **đang fail**: 205 trong 215 từ N3 chưa có file mp3
   (`public/audio` sinh lần cuối 22/08, trước khi có bài N3). Sửa bằng một lệnh:
   `npm run generate:audio`.
2. `scripts/generate-kanji.mjs` chỉ quét thư mục khớp `minano-nihongo-<số>`, nên
   **từ vựng N3 không bao giờ chảy vào tab Kanji**. 63 từ gắn nhãn N3 trong
   `kanji-words.ts` đều đến từ danh sách động từ của khu Bài tập, không phải từ
   総まとめ.
3. Bài ngữ pháp 皆の日本語 **第39課 thiếu** trong `data-source` — đúng bài mà slide
   `第39課.pptx` cũng thiếu.

---

## 4. Ba lỗ hổng quyết định kỳ thi

### Lỗ hổng 1 — Không có sách ngữ pháp N3 (nghiêm trọng nhất)

`日本語総まとめ N3 文法` là quyển thứ năm của bộ, và là **quyển duy nhất không có
trong máy**. Mọi tài liệu ngữ pháp trong thư mục giáo trình đều **dừng ở bài 50 của
皆の日本語**, tức là hết N4. Trong hơn 2.700 trang không có một mẫu ngữ pháp riêng
của N3 nào.

**Hệ quả đo được:** trần tiến độ của trụ ngữ pháp bị chặn ở **36%**, và trần của cả
lộ trình (không tính 聴解) bị chặn ở **89%**. Tab `/n3` vẽ phần đó bằng vạch gạch
chéo trên thanh tiến độ, đúng nghĩa "chỗ này không phải chưa học, mà là chưa có gì
để học".

**Cần làm:** bổ sung quyển đó vào `C:\Users\Admin\Downloads\Japanese\N3`. Có sách
thì phần ngữ pháp N3 nạp thành bài học trong app được ngay — định dạng
`grammar.json` và hai màn hình `/grammar` đã chạy tốt với 93 mẫu N4.

Trong lúc chờ, phần ngữ pháp làm được như mục 6.3.

### Lỗ hổng 2 — Không có một file âm thanh nào trên máy

Đã quét toàn bộ `C:\Users\Admin\Downloads` tìm `mp3/m4a/wav/aac/flac/ogg`: **không
có file nào**. `総まとめ N3 聴解` là sách kèm 2 CD — đang có 116 trang bài tập, phần
script và đáp án, nhưng **không có tiếng**. Hai tập `聴解タスク25` và đĩa kèm
`Minna I/II` cũng vậy.

聴解 là một khối 60 điểm **có điểm chuẩn riêng**. Nói thẳng: với tài liệu hiện tại,
không thể luyện một phần đủ sức tự nó đánh trượt cả bài thi.

### Lỗ hổng 3 — Không có một đề N3 nào

Không có đề thật, không có đề mô phỏng. Đang có 6 đề **N5** (ba đề thật 2015/2017,
hai đề của trung tâm, một phần đề 7/2024).

18 bài `実戦問題` của ba quyển 総まとめ là bài luyện **theo tuần, theo phần** — chúng
không thay được một lượt thi đủ ba phiên 30 + 70 + 40 phút. Còn 13 tuần, và hiện
chưa có cách nào biết mình đứng đâu so với điểm chuẩn từng khối.

---

## 5. Phương pháp — bốn giai đoạn, một nhịp

Đây là **một phương án duy nhất**, không phải một danh sách lựa chọn. Bốn giai đoạn
phủ kín 96 ngày, không ngày nào bỏ trống.

| | Giai đoạn | Khoảng ngày | Ngày | Buổi | /ngày |
| --- | --- | --- | --- | --- | --- |
| 1 | **Vá nền** | 05/09 → 25/09 | 21 | 61 | 2,9 |
| 2 | **Nạp N3** | 26/09 → 17/11 | 53 | 129 | 2,4 |
| 3 | **Luyện đề** | 18/11 → 06/12 | 19 | 0 bài mới | — |
| 4 | **Nước rút** | 07/12 → 09/12 | 3 | 0 bài mới | — |

### Ba quyết định thiết kế, và lý do

**a. Vá nền TRƯỚC, không học song song.** 総まとめ N3 không dạy lại 受身, 使役,
敬語, 条件形 — nó **giả định đã biết**. Mở sách N3 khi nền còn hổng thì mỗi trang lại
phải dừng để tra một thứ đã học rồi, và tốc độ tụt xuống một nửa. Ba tuần trả trước
rẻ hơn nhiều so với bảy tuần bị kéo chân.

**b. Ba quyển TRỘN ĐỀU, không học tuần tự.** Mỗi ngày chạm cả 漢字, 語彙 và 読解;
không phải học hết quyển này mới sang quyển khác. Lý do không phải "cho đỡ nhàm" mà
là **điểm chuẩn từng khối**: nếu lộ trình bị trượt tiến độ — mà lộ trình 96 ngày nào
cũng có lúc trượt — thì phần bỏ dở phải là *mỏng đều cả ba khối*. Học tuần tự thì
phần bỏ dở luôn là quyển cuối, và quyển cuối là một khối 60 điểm mất trắng.

**c. Nhịp học là điều kiện, không phải hệ quả.** Bản chia đầu tiên của lộ trình này
là 14 ngày vá nền + 60 ngày nạp N3, và nó cho ra **6,1 buổi/ngày** ở giai đoạn 1 —
đúng về số học và không ai học được như thế. Mốc 21/53 ngày được chọn để **cả hai
giai đoạn nạp bài đều nằm trong khoảng 2,4–2,9 buổi/ngày**. `npm run verify:n3` giữ
ngưỡng đó: sửa mốc mà nhịp vượt 3,5 buổi/ngày là báo lỗi.

Vì cùng lý do đó, **25 bài từ vựng N5 không có ngày hẹn**. Đó là phần đã học từ lâu
và đã có bài luyện trong app; bắt nó chiếm chỗ trong nhịp hằng ngày là cách nhanh
nhất đẩy giai đoạn 1 lên mức không theo được. Tích khi nào ôn xong.

### Việc mỗi ngày

**Giai đoạn 1 (05/09 → 25/09) — khoảng 3 buổi/ngày, 60–75 phút**

1. Xong **trước** phần luyện Kanji N5/N4, bộ thủ và chia động từ trong app — đó là
   phần đỡ nhiều nhất cho việc đọc sách N3.
2. Mỗi ngày 1–2 bài từ vựng 皆の日本語 **26–50**: luyện thẳng trong app, **không đọc
   lại sách**. Từ nào sai thì bấm ★.
3. Mỗi ngày 1 bài ngữ pháp 26–50 ở tab Ngữ pháp. Chỗ nào mờ thì tra
   `Bản dịch và giải thích ngữ pháp - Tập 2.pdf`.
4. Cửa vào: xong **80% phần nền có hẹn ngày** thì mới mở 総まとめ. Tab `/n3` hiện
   trạng thái cửa vào ngay trên thẻ "Nền N5–N4".

**Giai đoạn 2 (26/09 → 17/11) — 2–3 buổi/ngày, 80–105 phút**

Mỗi buổi: **đọc sách 25 phút → luyện lại trong app 10 phút**. Xoay vòng
漢字 → 語彙 → 読解 để ngày nào cũng chạm cả ba quyển. Gặp buổi 実戦問題 thì **bấm giờ
và làm một lượt không tra sách** — nó chỉ nói thật khi làm như thi.

**Giai đoạn 3 (18/11 → 06/12) — không bài mới**

Mỗi ngày: 1 bài `実戦問題` làm lại có bấm giờ, rồi ôn hết ★ của phần vừa sai. Mỗi
Chủ nhật: một lượt đủ ba phiên, đúng giờ thi thật (30 + 70 + 40 phút). Đây là chỗ
**lỗ hổng 3 cắn**: 18 bài 実戦問題 là tất cả những gì đang có, và chúng không phải
đề đủ ba phiên.

**Giai đoạn 4 (07/12 → 09/12) — chỉ ôn ★**

Mỗi ngày ôn ★ của ba khối, mỗi khối 30 phút. Không mở bài mới, không thức khuya.
Nạp chữ mới sát ngày thi làm loãng đúng phần vừa mới nhớ được.

---

## 6. Học từng phần thế nào

### 6.1 文字 — chữ Hán (20 điểm quy đổi)

Đề hỏi đúng hai việc: **đọc** chữ Hán (8 câu) và **chọn cách viết** bằng chữ Hán
(6 câu). Không câu nào bắt viết tay. Vì vậy:

- **Không luyện viết.** Bộ luyện viết duy nhất đang có là mức N5, và
  総まとめ N3 漢字 tự nó đánh dấu những chữ *chỉ cần đọc được*. Ba tuần cuối không
  đủ chỗ cho việc thi không hỏi.
- **Học theo TỪ, không theo chữ rời.** Một chữ Hán có nhiều cách đọc và đề luôn hỏi
  trong một từ cụ thể. 総まとめ N3 漢字 vốn xếp theo tình huống (bãi đỗ xe, thực đơn,
  phiếu khám bệnh) chứ không theo chữ — đi đúng theo mạch đó của sách.
- **Âm Hán Việt để ĐOÁN, không để trả lời.** Tab Kanji của app dạy âm Hán Việt, mà
  đề JLPT không hỏi âm Hán Việt. Giá trị thật của nó: gặp 経済, 政治, 安全 chưa từng
  học, âm Hán Việt cho ngay nghĩa. Đó là lợi thế riêng của người Việt — dùng nó để
  hiểu đoạn đọc, không dùng để chọn đáp án 漢字読み.
- **Bộ thủ để phân biệt chữ trông giống nhau**, đúng chỗ 表記 hay bẫy. Tab Bộ thủ có
  chiết tự cho 345 chữ N3.
- Trong app, phần luyện của trụ này gồm 3 mục ở tab Kanji và Bộ thủ, nằm cuối
  danh sách 文字 của tab `/n3`.

### 6.2 語彙 — từ vựng (20 điểm quy đổi)

Ba dạng câu, và chúng đòi ba kiểu nhớ khác nhau:

| Dạng | Số câu | Nhớ kiểu gì |
| --- | --- | --- |
| 文脈規定 | 11 | Từ nào đi với ngữ cảnh nào |
| 言い換え類義 | 5 | Cụm từ gần nghĩa |
| 用法 | 5 | **Từ đó dùng trong câu thế nào** |

Dạng `用法` là dạng khó nhất và cũng là dạng mà **danh sách từ không cứu được** —
biết nghĩa của 今ごろ không giúp chọn được câu dùng nó đúng. Nó chỉ có thể học từ
**câu ví dụ**. Mà 215 từ N3 đang có trong app **không có câu ví dụ nào**. Nên:

- Câu ví dụ **đọc trong sách**, không đọc trong app. Đây là phần mà app hiện chưa
  giúp được, và cũng là việc đáng bổ sung sớm nhất khi nạp 36 bài còn lại.
- Trong app: luyện bốn chiều Nhật→Việt, Việt→Nhật, Nhật→kana, kana→Nhật cho phần từ
  đã nạp. Từ nào sai thì ★, cuối tuần luyện lại riêng danh sách ★.
- 総まとめ 語彙 cho khoảng **1.200 từ** — đúng phần lợi nhất, không phải toàn bộ.
  Phần còn lại của N3 là từ N4/N5 mà sách coi như đã biết, và đó là lý do giai đoạn
  1 tồn tại.
- Tuần 6 của quyển 語彙 (`まとめて覚えましょう`) là nhóm trạng từ và động từ nhiều
  nghĩa — đúng loại từ mà `文脈規定` hay hỏi. Không bỏ tuần đó dù nó nằm cuối.

### 6.3 文法 — ngữ pháp (20 điểm quy đổi, đang bị chặn ở 36%)

Chưa có sách N3. Việc làm được ngay, theo đúng thứ tự:

1. **24 bài ngữ pháp 皆の日本語 26–50 trong app** (93 mẫu) — 受身, 使役, 使役受身,
   尊敬語/謙譲語, 条件形, 〜ようだ/らしい/そうだ. Đây là nền mà 総まとめ N3 giả định
   đã biết, và bản thân nó vẫn được hỏi trong đề N3.
2. **Bảng まとめ của `Luyện tập mẫu câu - Tập 2.pdf`** tách 可能/受身/尊敬 và
   尊敬/謙譲. Đúng chỗ `文法形式の判断` hay bẫy nhất.
3. **File MCQ của giáo viên trong `Downloads/Japanese/N4/*.docx`** — bài tập bốn đáp
   án **duy nhất** trong cả thư mục, cùng hình dạng với câu đề thật. Chỉ phủ bài
   26–30, dùng hết cũng nhanh.
4. **`bài tập 28.docx`** có phần sắp xếp lại câu — đó chính là dạng
   `文の組み立て`, và không tài liệu nào khác đang có luyện dạng này.
5. Tra nghĩa và giải thích bằng `Bản dịch và giải thích ngữ pháp - Tập 2.pdf` —
   quyển tiếng Việt duy nhất.

Còn thiếu, và **không lấp được bằng những gì đang có**: toàn bộ mẫu ngữ pháp riêng
của N3. Cần quyển `総まとめ N3 文法`.

### 6.4 読解 — đọc hiểu (60 điểm quy đổi, một khối riêng)

Đây là khối **nặng điểm nhất** trong phạm vi lần này, và cũng là khối app chưa có
gì. Toàn bộ 42 buổi học **trên sách**.

- Sách đi từ dễ lên khó theo đúng thứ tự cần: thông báo và tờ chỉ dẫn (tuần 1) →
  giấy tờ quanh mình (tuần 2) → thư từ (tuần 3) → báo (tuần 4) → nhật ký, truyện
  (tuần 5) → bài nêu ý kiến và bài giải thích (tuần 6). **Đi đúng thứ tự đó.**
- Dạng `情報検索` là dạng **mới** so với đề cũ, và nó rơi đúng vào tuần 2 (catalogue,
  hướng dẫn sử dụng, phiếu bảo hành) và tuần 4 (đồ thị, quảng cáo). Đây không phải
  đọc hiểu mà là **tìm thông tin**: đọc câu hỏi trước, rồi mới quét bảng.
- 70 phút cho cả 文法 và 読解 nghĩa là **tốc độ cũng bị thi**. Từ tuần 3 trở đi,
  bấm giờ mỗi buổi: đoạn ngắn 3 phút, đoạn vừa 6 phút, đoạn dài 9 phút.
- Nếu tuần 1 thấy dốc: `25 Bài đọc hiểu sơ cấp - Tập 2.pdf` (mức N4) là bậc thang.
  Không dùng Tập 1 — mức N5 và phần chú giải lại bằng tiếng Indonesia.
- Hết quyển 読解 là **hết tài liệu đọc ở mức N3** trong máy. Nếu cần thêm tốc độ thì
  phải bổ sung nguồn.

### 6.5 聴解 — nghe hiểu

**Không nằm trong phạm vi lần này.** Xem mục 8.

---

## 7. Mô phỏng: mỗi ngày phải học bao nhiêu

Bảng dưới là lịch đến hạn thật, sinh trực tiếp từ `n3-syllabus.ts` (14 tuần, mỗi
tuần 7 ngày kể từ 05/09):

| # | Khoảng ngày | Giai đoạn | Buổi | /ngày | Nội dung đến hạn |
| --- | --- | --- | --- | --- | --- |
| 1 | 2026-09-05 → 2026-09-11 | P1 | 21 | 3.0 | Nền N5–N4 ×11, 文法 Ngữ pháp ×10 |
| 2 | 2026-09-12 → 2026-09-18 | P1 | 20 | 2.9 | 文法 Ngữ pháp ×10, Nền N5–N4 ×10 |
| 3 | 2026-09-19 → 2026-09-25 | P1 | 20 | 2.9 | 文法 Ngữ pháp ×4, Nền N5–N4 ×16 |
| 4 | 2026-09-26 → 2026-10-02 | P2 | 18 | 2.6 | 文字 Chữ Hán ×6, 語彙 Từ vựng ×6, 読解 Đọc hiểu ×6 |
| 5 | 2026-10-03 → 2026-10-09 | P2 | 17 | 2.4 | 文字 Chữ Hán ×6, 語彙 Từ vựng ×6, 読解 Đọc hiểu ×5 |
| 6 | 2026-10-10 → 2026-10-16 | P2 | 17 | 2.4 | 読解 Đọc hiểu ×6, 文字 Chữ Hán ×6, 語彙 Từ vựng ×5 |
| 7 | 2026-10-17 → 2026-10-23 | P2 | 17 | 2.4 | 語彙 Từ vựng ×6, 読解 Đọc hiểu ×6, 文字 Chữ Hán ×5 |
| 8 | 2026-10-24 → 2026-10-30 | P2 | 17 | 2.4 | 文字 Chữ Hán ×6, 語彙 Từ vựng ×6, 読解 Đọc hiểu ×5 |
| 9 | 2026-10-31 → 2026-11-06 | P2 | 17 | 2.4 | 読解 Đọc hiểu ×6, 文字 Chữ Hán ×6, 語彙 Từ vựng ×5 |
| 10 | 2026-11-07 → 2026-11-13 | P2 | 17 | 2.4 | 語彙 Từ vựng ×6, 読解 Đọc hiểu ×6, 文字 Chữ Hán ×5 |
| 11 | 2026-11-14 → 2026-11-20 | P2 / P3 | 9 | 1.3 | 文字 Chữ Hán ×5, 語彙 Từ vựng ×2, 読解 Đọc hiểu ×2 |
| 12 | 2026-11-21 → 2026-11-27 | P3 | 0 | 0.0 | — |
| 13 | 2026-11-28 → 2026-12-04 | P3 | 0 | 0.0 | — |
| 14 | 2026-12-05 → 2026-12-09 | P3 / P4 | 0 | 0.0 | — |

Cách tính, và tại sao nó tự cập nhật:

- Mục học được rải đều bằng `floor(i × số_ngày / tổng_mục)` — công thức này **không
  phụ thuộc vào việc đã tích những mục nào**. Mốc hẹn phải đứng yên, nếu không thì
  "chậm 3 buổi" hôm nay có thể tự thành "đúng hẹn" ngày mai mà chẳng học gì thêm.
- Con số **"buổi/ngày"** to nhất trên tab `/n3` được tính lại **mỗi lần mở trang**:
  `số mục còn lại ÷ số ngày còn được nạp bài mới`. Nghỉ ba ngày thì nó tự dâng lên,
  chứ không tiếp tục hiện 2,4 như hôm đầu.
- Chia cho **số ngày còn được nạp bài mới (tới 17/11)**, không chia tới hôm thi. Dồn
  bài mới vào ba tuần cuối là mất luôn phần luyện đề. Qua 17/11 mà vẫn còn nợ thì nó
  chuyển sang chia cho số ngày thật còn lại tới hôm thi.
- "Đúng hẹn / chậm" so với **mốc trước hôm nay**, không tính phần hẹn đúng hôm nay —
  cả ngày hôm nay vẫn còn để làm nó.

**Hai loại "còn lại", đừng lẫn.** Ô nhịp học ghi *"buổi có hẹn còn lại"* — chỉ đếm
phần lịch giao cho một ngày cụ thể (190 mục). Vòng phần trăm ghi *"buổi đã học"* trên
tổng **mọi** mục tính điểm (215 mục, hoặc 238 nếu bật 聴解). Chênh lệch chính là phần
ôn tuỳ sức không hẹn ngày, và tab hiện nó thành một dòng riêng ngay dưới: *"Ngoài ra
còn N buổi trong phạm vi tính điểm nhưng không hẹn ngày"*. Gộp hai loại lại thì nhịp
hằng ngày phình lên vì việc không hẹn; bỏ hẳn loại thứ hai thì hai con số trên cùng
màn hình lệch nhau mà không giải thích được.

Ngưỡng bỏ cuộc: nếu nhịp bắt buộc vượt **6 buổi/ngày**, tab hiện "không kịp bằng
cách học thêm nữa". Lúc đó việc phải làm không phải học nhiều hơn mà là **cắt phạm
vi** — bỏ tuần 5–6 của quyển 語彙 (phần ít lợi nhất) để giữ trọn 読解.

---

## 8. Giới hạn đã biết của lần này

### Phần nghe 聴解 chưa được xây — ghi nhận rõ ràng

Theo quyết định phạm vi: **lần này không xây phần luyện nghe trong app.** Ghi lại
đầy đủ hệ quả để lần sau không phải dò lại:

1. **聴解 chiếm 60/180 điểm và có điểm chuẩn riêng.** Không luyện thì trượt, dù ba
   phần kia đầy điểm. Đây không phải rủi ro — đây là điều chắc chắn nếu để nguyên.
2. **Phần trăm ở tab `/n3` mặc định KHÔNG tính 聴解.** Lý do: để nó trong mẫu số thì
   con số đứng mãi ở mức thấp và không còn phản ánh việc học đang diễn ra. Bù lại,
   trang **luôn hiện một cảnh báo** cạnh con số, và có ô "Tính cả phần 聴解 vào phần
   trăm" để xem con số đầy đủ bất cứ lúc nào. Bật lên: trần tụt từ 89% xuống 93% của
   167/180 điểm — tức là ngay cả khi học hết mọi thứ đang có, vẫn còn một khoảng
   trống có tên.
3. **23 mục của quyển 聴解 vẫn có mặt đủ** trong bảng kiểm soát và vẫn tích được —
   sách đang có trong máy, học bằng sách được. Chúng chỉ **không có ngày hẹn**, để
   không làm sai con số "mấy buổi mỗi ngày".
4. **Không có file âm thanh nào trên máy** (mục 4, lỗ hổng 2). Kể cả khi xây phần
   luyện nghe trong app thì vẫn cần đĩa của quyển 聴解.
5. **Nhưng đường ống âm thanh của app thì đã có**: `scripts/generate-audio.mjs` +
   `edge-tts` (giọng `ja-JP-NanamiNeural`) đang sinh 1.282 file mp3 cho từ vựng, đặt
   tên bằng hash của chuỗi đọc. Nó vốn không phụ thuộc vào việc chuỗi đó là một từ
   hay một câu, nên **hoàn toàn dựng được phần luyện nghe câu** trên nền đó. Việc
   cần làm khi tới lúc: cho bộ thu thập chạy quá `kind === 'vocabulary'`, thêm một
   chiều luyện lấy âm thanh làm câu hỏi, và chấp nhận bản build offline một file thì
   tắt âm thanh.

### Những giới hạn khác

- **Trần tiến độ 89%** vì thiếu sách ngữ pháp N3 (mục 4, lỗ hổng 1). Con số này sẽ
  tự nhảy lên khi bổ sung sách và nạp nội dung.
- **Không có đề mô phỏng N3** (mục 4, lỗ hổng 3), nên giai đoạn 3 hiện chỉ có 18 bài
  `実戦問題` — luyện theo phần, không phải một lượt thi đủ ba phiên.
- **Tiến độ do người học tự tích, app không tự suy ra.** Đây là chủ ý: phần lớn lộ
  trình học **trên sách** (ba quyển 総まとめ chưa nạp vào app), nên đo bằng hoạt động
  trong app sẽ báo 0% cho một người đã học xong nửa quyển sách.
- **Điểm chia cho 文字/語彙/文法 là 20/20/20** — chia đều khối 言語知識 60 điểm. Đây
  là một **giả định có ý thức**: trang 7 cho biết số câu (文字 14, 語彙 21) nhưng
  không cho biết mỗi câu mấy điểm, và quyển 文法 thì không có trong nguồn. Sửa lại
  chỉ là sửa ba con số trong `N3_SECTION_POINTS`.
- **Trọng số 42 của phần ngữ pháp thiếu** suy ra từ khuôn 6 tuần × 7 ngày của ba
  quyển kia, **không phải** đọc được từ quyển 文法. Có sách thì thay bằng số thật.

---

## 9. Bảng kiểm soát đầy đủ

Bảng dưới đây là bản in của cùng dữ liệu mà tab `/n3` dùng. **Bảng trong app mới là
bản sống** — nó tự tính phần trăm, tự đổi mốc "đến hạn / trễ hẹn", và lưu dấu tích
trong trình duyệt. Bản dưới đây để in ra hoặc mở khi không có app.

Ký hiệu: `` `ngày` `` là mốc hẹn học xong · _(sách)_ = học trên sách, chưa nạp vào
app · _(hoãn)_ = phần 聴解, không hẹn ngày · _(CHƯA CÓ NGUỒN)_ = không tích được.
Mục không ghi gì trong ngoặc là **có bài trong app**.

### 基 Nền N5–N4 — `皆の日本語 初級 I・II`

**第1課〜第25課 皆の日本語 初級I · 語彙** — Từ vựng N5 — toàn bộ 25 bài đầu

- [ ] 第1課 — Bài 1 · từ vựng
- [ ] 第2課 — Bài 2 · từ vựng
- [ ] 第3課 — Bài 3 · từ vựng
- [ ] 第4課 — Bài 4 · từ vựng
- [ ] 第5課 — Bài 5 · từ vựng
- [ ] 第6課 — Bài 6 · từ vựng
- [ ] 第7課 — Bài 7 · từ vựng
- [ ] 第8課 — Bài 8 · từ vựng
- [ ] 第9課 — Bài 9 · từ vựng
- [ ] 第10課 — Bài 10 · từ vựng
- [ ] 第11課 — Bài 11 · từ vựng
- [ ] 第12課 — Bài 12 · từ vựng
- [ ] 第13課 — Bài 13 · từ vựng
- [ ] 第14課 — Bài 14 · từ vựng
- [ ] 第15課 — Bài 15 · từ vựng
- [ ] 第16課 — Bài 16 · từ vựng
- [ ] 第17課 — Bài 17 · từ vựng
- [ ] 第18課 — Bài 18 · từ vựng
- [ ] 第19課 — Bài 19 · từ vựng
- [ ] 第20課 — Bài 20 · từ vựng
- [ ] 第21課 — Bài 21 · từ vựng
- [ ] 第22課 — Bài 22 · từ vựng
- [ ] 第23課 — Bài 23 · từ vựng
- [ ] 第24課 — Bài 24 · từ vựng
- [ ] 第25課 — Bài 25 · từ vựng

**第26課〜第50課 皆の日本語 初級II · 語彙** — Từ vựng N4 — toàn bộ 25 bài sau

- [ ] `2026-09-13` 第26課 — Bài 26 · từ vựng
- [ ] `2026-09-13` 第27課 — Bài 27 · từ vựng
- [ ] `2026-09-14` 第28課 — Bài 28 · từ vựng
- [ ] `2026-09-15` 第29課 — Bài 29 · từ vựng
- [ ] `2026-09-16` 第30課 — Bài 30 · từ vựng
- [ ] `2026-09-16` 第31課 — Bài 31 · từ vựng
- [ ] `2026-09-17` 第32課 — Bài 32 · từ vựng
- [ ] `2026-09-18` 第33課 — Bài 33 · từ vựng
- [ ] `2026-09-18` 第34課 — Bài 34 · từ vựng
- [ ] `2026-09-19` 第35課 — Bài 35 · từ vựng
- [ ] `2026-09-20` 第36課 — Bài 36 · từ vựng
- [ ] `2026-09-20` 第37課 — Bài 37 · từ vựng
- [ ] `2026-09-21` 第38課 — Bài 38 · từ vựng
- [ ] `2026-09-21` 第39課 — Bài 39 · từ vựng
- [ ] `2026-09-22` 第40課 — Bài 40 · từ vựng
- [ ] `2026-09-22` 第41課 — Bài 41 · từ vựng
- [ ] `2026-09-22` 第42課 — Bài 42 · từ vựng
- [ ] `2026-09-23` 第43課 — Bài 43 · từ vựng
- [ ] `2026-09-23` 第44課 — Bài 44 · từ vựng
- [ ] `2026-09-23` 第45課 — Bài 45 · từ vựng
- [ ] `2026-09-24` 第46課 — Bài 46 · từ vựng
- [ ] `2026-09-24` 第47課 — Bài 47 · từ vựng
- [ ] `2026-09-24` 第48課 — Bài 48 · từ vựng
- [ ] `2026-09-25` 第49課 — Bài 49 · từ vựng
- [ ] `2026-09-25` 第50課 — Bài 50 · từ vựng

**補強 漢字・部首・動詞の活用** — Chữ Hán, bộ thủ và chia động từ

- [ ] `2026-09-05` 漢字 N5（118字） — Luyện 118 chữ Kanji N5 — âm Hán Việt
- [ ] `2026-09-05` 漢字 N4（149字） — Luyện 149 chữ Kanji N4 — âm Hán Việt
- [ ] `2026-09-06` 部首（214） — Luyện 214 bộ thủ — nhận mặt bộ trong chữ
- [ ] `2026-09-07` 自動詞・他動詞 — Bài tập tự động từ & tha động từ (N5→N3)
- [ ] `2026-09-07` 動詞の活用 — Bài tập chuyển thể động từ (N5→N2)
- [ ] `2026-09-08` 第33課 · 動詞 — Chia động từ bài 33
- [ ] `2026-09-09` 特別な動詞 — Động từ đặc biệt & bất quy tắc
- [ ] `2026-09-09` 第13課 · 文法 — Ngữ pháp bài 13
- [ ] `2026-09-10` 第26課 · 会話 — Dịch hội thoại bài 26
- [ ] `2026-09-11` 第28課 · 会話 — Dịch hội thoại bài 28
- [ ] `2026-09-11` 第29課 · 会話 — Dịch hội thoại bài 29
- [ ] `2026-09-12` 第33課 · 会話 — Dịch hội thoại bài 33


### 漢 文字 Chữ Hán — `日本語総まとめ N3 · 漢字`

**第1週 でかける①** — Ra ngoài ① · tr. 11

- [ ] `2026-09-26` 駐車場 — Bãi đỗ xe _(sách)_
- [ ] `2026-09-27` 横断歩道 — Vạch sang đường _(sách)_
- [ ] `2026-09-28` サイン — Biển báo, ký hiệu _(sách)_
- [ ] `2026-09-29` 駅のホーム — Sân ga _(sách)_
- [ ] `2026-09-30` 特急電車 — Tàu tốc hành đặc biệt _(sách)_
- [ ] `2026-10-02` バス — Xe buýt _(sách)_
- [ ] `2026-10-03` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第2週 でかける②** — Ra ngoài ② · tr. 27

- [ ] `2026-10-04` レストラン — Nhà hàng _(sách)_
- [ ] `2026-10-05` 禁煙 — Cấm hút thuốc _(sách)_
- [ ] `2026-10-07` 観光地図 — Bản đồ du lịch _(sách)_
- [ ] `2026-10-08` 街の地図 — Bản đồ phố phường _(sách)_
- [ ] `2026-10-09` 病院 — Bệnh viện _(sách)_
- [ ] `2026-10-10` 困ったときは — Khi gặp chuyện khó _(sách)_
- [ ] `2026-10-12` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第3週 つかう** — Dùng · tr. 43

- [ ] `2026-10-13` 要冷蔵 — Cần bảo quản lạnh _(sách)_
- [ ] `2026-10-14` 消費期限 — Hạn sử dụng _(sách)_
- [ ] `2026-10-15` 自動販売機 — Máy bán hàng tự động _(sách)_
- [ ] `2026-10-16` レシピ — Công thức nấu ăn _(sách)_
- [ ] `2026-10-18` コピー機・留守番電話 — Máy photo, máy trả lời tự động _(sách)_
- [ ] `2026-10-19` 携帯電話 — Điện thoại di động _(sách)_
- [ ] `2026-10-20` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第4週 かう** — Mua · tr. 59

- [ ] `2026-10-21` 日用品 — Đồ dùng hằng ngày _(sách)_
- [ ] `2026-10-23` 広告メール — Email quảng cáo _(sách)_
- [ ] `2026-10-24` 通信販売 — Bán hàng qua đặt hàng xa _(sách)_
- [ ] `2026-10-25` 申込書 — Đơn đăng ký _(sách)_
- [ ] `2026-10-26` 注文 — Đặt hàng _(sách)_
- [ ] `2026-10-28` 不在通知 — Giấy thông báo vắng nhà _(sách)_
- [ ] `2026-10-29` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第5週 かく** — Viết · tr. 75

- [ ] `2026-10-30` メールを送る — Gửi email _(sách)_
- [ ] `2026-10-31` アンケート — Phiếu khảo sát _(sách)_
- [ ] `2026-11-01` 日本語クラス — Lớp tiếng Nhật _(sách)_
- [ ] `2026-11-03` 作文 — Bài tập làm văn _(sách)_
- [ ] `2026-11-04` 問診票—歯科で — Phiếu khai bệnh — ở khoa răng _(sách)_
- [ ] `2026-11-05` 問診票—健康診断 — Phiếu khai bệnh — khám sức khoẻ _(sách)_
- [ ] `2026-11-06` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第6週 よむ** — Đọc · tr. 91

- [ ] `2026-11-08` 天気予報 — Dự báo thời tiết _(sách)_
- [ ] `2026-11-09` 求人広告 — Quảng cáo tuyển người _(sách)_
- [ ] `2026-11-10` スポーツ記事 — Bài báo thể thao _(sách)_
- [ ] `2026-11-11` 経済 — Kinh tế _(sách)_
- [ ] `2026-11-13` 地球温暖化 — Trái đất nóng lên _(sách)_
- [ ] `2026-11-14` 政治 — Chính trị _(sách)_
- [ ] `2026-11-15` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**補強 アプリの漢字コーナー** — Khu Kanji và Bộ thủ trong app

- [ ] `2026-11-16` 漢字 N3（375字）· 漢越音 — Luyện âm Hán Việt của 375 chữ Kanji N3
- [ ] `2026-11-17` 漢字 N3 · 語彙 — Luyện các từ dùng chữ Kanji N3
- [ ] `2026-11-17` 部首 → 漢字 — Đi từ bộ thủ ra chữ, cho chữ N3


### 語 語彙 Từ vựng — `日本語総まとめ N3 · 語彙`

**第1週 家事をしましょう** — Làm việc nhà · tr. 11

- [ ] `2026-09-26` キッチンで／リビングで (tr. 12) — Trong bếp / phòng khách
- [ ] `2026-09-27` 料理をしましょう① (tr. 14) — Nấu ăn ①
- [ ] `2026-09-28` 料理をしましょう② (tr. 16) — Nấu ăn ②
- [ ] `2026-09-30` 掃除をしましょう (tr. 18) — Dọn dẹp
- [ ] `2026-10-01` 洗濯をしましょう (tr. 20) — Giặt giũ
- [ ] `2026-10-02` 子どもやペットの世話をしましょう (tr. 22) — Chăm con và thú cưng
- [ ] `2026-10-03` 実戦問題 (tr. 24) — Bài kiểm tra thực chiến _(sách)_

**第2週 外出しましょう** — Ra ngoài · tr. 27

- [ ] `2026-10-05` 計画を立てましょう — Lập kế hoạch _(sách)_
- [ ] `2026-10-06` 電車に乗りましょう① — Đi tàu ① _(sách)_
- [ ] `2026-10-07` 電車に乗りましょう② — Đi tàu ② _(sách)_
- [ ] `2026-10-08` 車に乗りましょう① — Đi xe ① _(sách)_
- [ ] `2026-10-09` 車に乗りましょう② — Đi xe ② _(sách)_
- [ ] `2026-10-11` 用事を済ませましょう — Giải quyết việc cần làm _(sách)_
- [ ] `2026-10-12` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第3週 休日を楽しみましょう** — Tận hưởng ngày nghỉ · tr. 43

- [ ] `2026-10-13` デートにさそいましょう — Mời đi hẹn hò _(sách)_
- [ ] `2026-10-14` したくをしましょう — Sửa soạn, chuẩn bị _(sách)_
- [ ] `2026-10-16` 買い物をしましょう — Đi mua sắm _(sách)_
- [ ] `2026-10-17` 食事に行きましょう — Đi ăn _(sách)_
- [ ] `2026-10-18` お酒を飲みましょう — Uống rượu _(sách)_
- [ ] `2026-10-19` お金を払いましょう — Trả tiền _(sách)_
- [ ] `2026-10-21` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第4週 勉強や仕事をしましょう** — Học và làm việc · tr. 59

- [ ] `2026-10-22` 学校へ行きましょう① — Đi học ① _(sách)_
- [ ] `2026-10-23` 学校へ行きましょう② — Đi học ② _(sách)_
- [ ] `2026-10-24` 学校へ行きましょう③ — Đi học ③ _(sách)_
- [ ] `2026-10-25` 仕事をしましょう — Làm việc _(sách)_
- [ ] `2026-10-27` パソコンを使いましょう — Dùng máy tính _(sách)_
- [ ] `2026-10-28` メールを書きましょう — Viết email _(sách)_
- [ ] `2026-10-29` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第5週 いろいろ表現しましょう** — Diễn đạt nhiều kiểu · tr. 75

- [ ] `2026-10-30` どういう関係ですか？ — Quan hệ với nhau thế nào? _(sách)_
- [ ] `2026-11-01` あいさつをしましょう — Chào hỏi _(sách)_
- [ ] `2026-11-02` どんな人が好き？ — Thích người thế nào? _(sách)_
- [ ] `2026-11-03` 体の調子はどうですか？ — Sức khoẻ thế nào? _(sách)_
- [ ] `2026-11-04` どんなようすですか？① — Trông ra sao? ① _(sách)_
- [ ] `2026-11-06` どんなようすですか？② — Trông ra sao? ② _(sách)_
- [ ] `2026-11-07` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第6週 まとめて覚えましょう** — Nhớ theo cụm · tr. 91

- [ ] `2026-11-08` かなりがんばっています — Trạng từ mức độ: かなり… _(sách)_
- [ ] `2026-11-09` ちゃんとがんばっています — Trạng từ cách thức: ちゃんと… _(sách)_
- [ ] `2026-11-11` ますますがんばります — Trạng từ tăng tiến: ますます… _(sách)_
- [ ] `2026-11-12` 組み合わせのことば — Từ đi thành cặp _(sách)_
- [ ] `2026-11-13` 意味がたくさんある動詞① — Động từ nhiều nghĩa ① _(sách)_
- [ ] `2026-11-14` 意味がたくさんある動詞② — Động từ nhiều nghĩa ② _(sách)_
- [ ] `2026-11-15` 実戦問題 — Bài kiểm tra thực chiến _(sách)_


### 文 文法 Ngữ pháp — `皆の日本語 初級II（総まとめ N3 文法 chưa có）`

**土台 皆の日本語 初級II · 文法** — Ngữ pháp N4 — 24 bài đã có trong app

- [ ] `2026-09-05` 第26課 — Ngữ pháp bài 26
- [ ] `2026-09-06` 第27課 — Ngữ pháp bài 27
- [ ] `2026-09-06` 第28課 — Ngữ pháp bài 28
- [ ] `2026-09-07` 第29課 — Ngữ pháp bài 29
- [ ] `2026-09-08` 第30課 — Ngữ pháp bài 30
- [ ] `2026-09-08` 第31課 — Ngữ pháp bài 31
- [ ] `2026-09-09` 第32課 — Ngữ pháp bài 32
- [ ] `2026-09-10` 第33課 — Ngữ pháp bài 33
- [ ] `2026-09-10` 第34課 — Ngữ pháp bài 34
- [ ] `2026-09-11` 第35課 — Ngữ pháp bài 35
- [ ] `2026-09-12` 第36課 — Ngữ pháp bài 36
- [ ] `2026-09-12` 第37課 — Ngữ pháp bài 37
- [ ] `2026-09-13` 第38課 — Ngữ pháp bài 38
- [ ] `2026-09-14` 第40課 — Ngữ pháp bài 40
- [ ] `2026-09-14` 第41課 — Ngữ pháp bài 41
- [ ] `2026-09-15` 第42課 — Ngữ pháp bài 42
- [ ] `2026-09-16` 第43課 — Ngữ pháp bài 43
- [ ] `2026-09-17` 第44課 — Ngữ pháp bài 44
- [ ] `2026-09-17` 第45課 — Ngữ pháp bài 45
- [ ] `2026-09-18` 第46課 — Ngữ pháp bài 46
- [ ] `2026-09-19` 第47課 — Ngữ pháp bài 47
- [ ] `2026-09-19` 第48課 — Ngữ pháp bài 48
- [ ] `2026-09-20` 第49課 — Ngữ pháp bài 49
- [ ] `2026-09-21` 第50課 — Ngữ pháp bài 50

**未入手 日本語総まとめ N3 · 文法** — Ngữ pháp riêng của N3 — chưa có sách trong máy

- [ ] 日本語総まとめ N3 文法（未入手） — Cần bổ sung sách 総まとめ N3 文法 — dự kiến 6 tuần × 7 ngày _(CHƯA CÓ NGUỒN)_


### 読 読解 Đọc hiểu — `日本語総まとめ N3 · 読解`

**第1週 お知らせや案内を読もう** — Đọc thông báo và chỉ dẫn · tr. 11

- [ ] `2026-09-26` 案内① — Bản chỉ dẫn ① _(sách)_
- [ ] `2026-09-28` 案内② — Bản chỉ dẫn ② _(sách)_
- [ ] `2026-09-29` 案内③ — Bản chỉ dẫn ③ _(sách)_
- [ ] `2026-09-30` 試験要項 — Quy chế thi _(sách)_
- [ ] `2026-10-01` 募集① — Thông báo tuyển ① _(sách)_
- [ ] `2026-10-02` 募集② — Thông báo tuyển ② _(sách)_
- [ ] `2026-10-04` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第2週 身のまわりの文書を読もう** — Đọc giấy tờ quanh mình · tr. 27

- [ ] `2026-10-05` カタログ① — Catalogue ① _(sách)_
- [ ] `2026-10-06` カタログ② — Catalogue ② _(sách)_
- [ ] `2026-10-07` お知らせ — Thông báo _(sách)_
- [ ] `2026-10-09` 説明書① — Bản hướng dẫn sử dụng ① _(sách)_
- [ ] `2026-10-10` 説明書② — Bản hướng dẫn sử dụng ② _(sách)_
- [ ] `2026-10-11` 保証書 — Phiếu bảo hành _(sách)_
- [ ] `2026-10-12` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第3週 通信文を読もう** — Đọc thư từ và tin nhắn · tr. 43

- [ ] `2026-10-14` メール① — Email ① _(sách)_
- [ ] `2026-10-15` メール② — Email ② _(sách)_
- [ ] `2026-10-16` 手紙・はがき① — Thư và bưu thiếp ① _(sách)_
- [ ] `2026-10-17` 手紙・はがき② — Thư và bưu thiếp ② _(sách)_
- [ ] `2026-10-19` 手紙・はがき③ — Thư và bưu thiếp ③ _(sách)_
- [ ] `2026-10-20` FAX（ビジネスレター） — FAX (thư thương mại) _(sách)_
- [ ] `2026-10-21` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第4週 新聞を読もう** — Đọc báo · tr. 59

- [ ] `2026-10-22` 見出し — Tiêu đề báo _(sách)_
- [ ] `2026-10-23` グラフ① — Đồ thị ① _(sách)_
- [ ] `2026-10-25` グラフ② — Đồ thị ② _(sách)_
- [ ] `2026-10-26` 広告① — Quảng cáo ① _(sách)_
- [ ] `2026-10-27` 広告② — Quảng cáo ② _(sách)_
- [ ] `2026-10-28` まんが — Truyện tranh _(sách)_
- [ ] `2026-10-30` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第5週 日記や小説を読もう** — Đọc nhật ký và truyện · tr. 75

- [ ] `2026-10-31` 日記① — Nhật ký ① _(sách)_
- [ ] `2026-11-01` 日記② — Nhật ký ② _(sách)_
- [ ] `2026-11-02` 家族① — Gia đình ① _(sách)_
- [ ] `2026-11-04` 家族② — Gia đình ② _(sách)_
- [ ] `2026-11-05` 小説① — Truyện ① _(sách)_
- [ ] `2026-11-06` 小説② — Truyện ② _(sách)_
- [ ] `2026-11-07` 実戦問題 — Bài kiểm tra thực chiến _(sách)_

**第6週 意見文や説明文を読もう** — Đọc bài nêu ý kiến và bài giải thích · tr. 91

- [ ] `2026-11-08` 意見文① — Bài nêu ý kiến ① _(sách)_
- [ ] `2026-11-10` 意見文② — Bài nêu ý kiến ② _(sách)_
- [ ] `2026-11-11` 意見文③ — Bài nêu ý kiến ③ _(sách)_
- [ ] `2026-11-12` 計算に関する文章 — Bài văn về tính toán _(sách)_
- [ ] `2026-11-13` 医学に関する文章 — Bài văn về y học _(sách)_
- [ ] `2026-11-15` 社会に関する文章 — Bài văn về xã hội _(sách)_
- [ ] `2026-11-16` 実戦問題 — Bài kiểm tra thực chiến _(sách)_


### 聴 聴解 Nghe hiểu — `日本語総まとめ N3 · 聴解`

**第1章 準備をしましょう** — Chuẩn bị nền · tr. 11

- [ ] 発音について (tr. 12) — Về phát âm _(hoãn)_
- [ ] 文法について① (tr. 14) — Về ngữ pháp ① _(hoãn)_
- [ ] 文法について② (tr. 16) — Về ngữ pháp ② _(hoãn)_
- [ ] 会話表現 (tr. 18) — Cách nói trong hội thoại _(hoãn)_
- [ ] まとめ問題 (tr. 20) — Bài kiểm tra tổng hợp _(hoãn)_

**第2章 問題のパターンに慣れましょう** — Làm quen năm dạng đề nghe · tr. 23

- [ ] 何と言いますか—発話表現 (tr. 24) — Nói gì đây — 発話表現 _(hoãn)_
- [ ] どんな返事をしますか—即時応答 (tr. 26) — Đáp lại thế nào — 即時応答 _(hoãn)_
- [ ] 何をしますか—課題理解 (tr. 28) — Sẽ làm gì — 課題理解 _(hoãn)_
- [ ] どうしてですか—ポイント理解 (tr. 30) — Vì sao — ポイント理解 _(hoãn)_
- [ ] どんな内容ですか—概要理解 (tr. 32) — Nội dung gì — 概要理解 _(hoãn)_
- [ ] まとめ問題 (tr. 34) — Bài kiểm tra tổng hợp _(hoãn)_

**第3章 いろいろな場所で聞きましょう** — Nghe ở nhiều nơi khác nhau · tr. 37

- [ ] 町で (tr. 38) — Ngoài phố _(hoãn)_
- [ ] 天気予報・交通情報 (tr. 40) — Dự báo thời tiết, thông tin giao thông _(hoãn)_
- [ ] 学校で (tr. 42) — Ở trường _(hoãn)_
- [ ] 職場で (tr. 44) — Ở nơi làm việc _(hoãn)_
- [ ] 病院・いろいろな店で (tr. 46) — Ở bệnh viện và các loại cửa hàng _(hoãn)_
- [ ] まとめ問題 (tr. 48) — Bài kiểm tra tổng hợp _(hoãn)_

**第4章 いろいろな内容を聞きましょう** — Nghe nhiều loại nội dung · tr. 51

- [ ] 人や物のようす (tr. 52) — Dáng vẻ người và vật _(hoãn)_
- [ ] 場所・方向・位置 (tr. 54) — Nơi chốn, phương hướng, vị trí _(hoãn)_
- [ ] 数・数字・計算 (tr. 56) — Số lượng, số liệu, tính toán _(hoãn)_
- [ ] 順序・比較 (tr. 58) — Thứ tự và so sánh _(hoãn)_
- [ ] まとめ問題 (tr. 60) — Bài kiểm tra tổng hợp _(hoãn)_

**第5章 総まとめ問題** — Đề mô phỏng toàn phần nghe · tr. 63

- [ ] 総まとめ問題 (tr. 63) — Đề mô phỏng toàn phần nghe _(hoãn)_

---

## 10. Sửa lộ trình này thế nào

| Muốn đổi | Sửa ở đâu |
| --- | --- |
| Ngày thi, ngày bắt đầu, ngày cuối nạp bài | `N3_EXAM_DATE`, `N3_PLAN_START`, `N3_LAST_NEW_MATERIAL_DATE` |
| Mốc chia bốn giai đoạn | `N3_PHASES` — sửa xong chạy `npm run verify:n3` để soát nhịp |
| Thêm nội dung mới (ví dụ 42 buổi ngữ pháp N3) | Thêm khối vào `n3-syllabus.ts`, khai id khối vào giai đoạn tương ứng |
| Khối nào không hẹn ngày | `N3_UNSCHEDULED_BLOCKS` |
| Điểm quy cho từng trụ | `N3_SECTION_POINTS` (tổng phải bằng 180) |
| Phần nào ngoài phần trăm mặc định | `N3_DEFAULT_OUT_OF_SCOPE` |

### `npm run verify:n3` kiểm những gì

| Nhóm | Kiểm |
| --- | --- |
| Dữ liệu | id không trùng; tiêu đề Nhật/Việt không rỗng; trọng số > 0 |
| Đối chiếu sách | số mục khớp mục lục (42/42/42/23); mỗi tuần đúng 7 ngày; ngày thứ bảy là bài kiểm tra |
| Đường dẫn | mọi `/lesson/`, `/grammar/`, `/exercise/` trỏ tới thứ **có thật, đúng loại** — bài ngữ pháp phải đi qua `/grammar/`, không phải `/lesson/` |
| Chữ hiển thị | mọi khoá thông điệp đều có trong từ điển hai ngôn ngữ |
| Lịch | bốn giai đoạn phủ kín, không hở không trùng; id giai đoạn không trùng; ngày cuối không trước ngày đầu; mọi mục tích được đều có mốc hẹn; khối khai "ngoài lịch" thì thật sự không có mốc |
| **Nhịp học** | **mỗi giai đoạn không vượt 3,5 buổi/ngày** — kiểm tra quan trọng nhất với người học |
| Thang điểm | tổng 180; và tổng theo **từng khối** khớp 60/60/60; mọi trụ có mặt trong cả ba bảng |

Bốn luật đã được thử phá để chắc chắn chúng bắt lỗi thật, không chỉ xanh cho vui:
trỏ vào một id `ExerciseMode` không phải đường dẫn, đưa bài ngữ pháp qua `/lesson/`,
đặt trọng số 0, và bóp giai đoạn 1 xuống 8 ngày (7,63 buổi/ngày) — cả bốn đều báo lỗi
và trả về mã thoát khác 0.

Workflow deploy chạy `npm run verify:ci` **trước khi build**, nên một lộ trình hỏng
không lên được trang thật. `verify:ci` là bản đầy đủ trừ `verify:audio` — xem mục 3.
