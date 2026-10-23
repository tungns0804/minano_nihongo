# Ghi chú kỹ thuật

Cấu trúc mã nguồn và các quyết định kỹ thuật. Quy ước viết code ở [CODING.md](../CODING.md); tổng quan ở [README](../README.md).

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
  generate-kanji.mjs             Sinh core/kanji/kanji-words.generated.ts từ chính kho từ
  generate-topics.mjs            Sinh core/topics/topic-{catalog,words}.generated.ts từ chính kho từ
  han-viet-compose.mjs           Ghép âm Hán Việt của cả từ từ âm của từng chữ
  generate-radicals.mjs          Sinh core/radical/radical-kanji.generated.ts từ bảng bộ thủ + chiết tự
  generate-strokes.mjs           Sinh core/strokes/stroke-{data,coverage}.generated.ts từ KanjiVG
  verify-drawing.mjs             Kiểm tra dữ liệu nét + cách chấm chữ viết tay
  generate-audio.mjs             Sinh public/audio/vocab/*.mp3 bằng edge-tts
  edge-tts-batch.py              Bộ đọc chạy nền của generate-audio.mjs (Python)
  verify-n3.mjs                  Kiểm lộ trình N3: khớp mục lục sách, lịch phủ kín, nhịp học
  verify-n4-grammar.mjs          Kiểm mọi sách ngữ pháp: cú pháp câu, chỗ trống, mảnh câu, id
  verify-i18n.mjs                Kiểm từ điển giao diện: đủ hai thứ tiếng, không trùng khoá
  import-vnjpclub.mjs            Tải + giải mã vnjpclub N4 → core/exercises/vnjpclub-n4.generated.ts (chưa bật)
public/lessons/                  Dữ liệu JSON do script sinh ra (không sửa tay, không commit)
  index.json
  minano-nihongo-33.json
public/audio/vocab/              File phát âm do script sinh ra (không sửa tay)
  index.json                     Bảng tra tên file <-> chuỗi đem đọc
  <băm>.mp3
src/styles.css                   Điểm vào style toàn cục: chỉ @import các file dưới, đúng thứ tự
src/styles/                      tokens (màu, cỡ chữ), base, components, shared, lists, motion, utilities
src/app/
  app.*                          Vỏ ứng dụng: thanh bên / menu đáy, breadcrumb, hàng tab con
  core/
    navigation.ts                Năm nhóm menu + tab con của từng nhóm + nhóm của mỗi URL
    i18n/
      messages.ts                Gộp từ điển giao diện; MessageKey
      messages/                  Mỗi khu vực một file: shell, today, home, lesson, grammar…
    audio/
      vocab-audio.ts             Quy tắc đặt tên file phát âm — DÙNG CHUNG với script
      vocab-audio-player.ts      Phát file mp3 phát âm, mỗi lúc chỉ một từ
    japanese/
      conjugation.ts             Luật chia động từ — bản cài đặt DUY NHẤT
    exercises/
      exercise.model.ts          Kiểu dữ liệu + danh sách ba bài tập + các dạng luyện
      transitive-pairs.ts        58 cặp tự động từ / tha động từ (N5→N3)
      exercise-verbs.ts          293 động từ cho bài chuyển thể (N5→N2)
      n4-grammar.model.ts        Kiểu dữ liệu bài ngữ pháp N4 (mục → mẫu → câu ví dụ)
      n4-grammar.ts              50 mục: tài liệu "TỔNG HỢP NGỮ PHÁP N4" + trợ từ で, chỗ trống 《…》
      grammar-book.build.ts      Dựng dữ liệu một sách ngữ pháp từ dạng viết tay / sinh tự động
      grammar-books.ts           Danh sách "sách ngữ pháp" — thêm nguồn mới là thêm một phần tử
    kanji/
      kanji.model.ts             Kiểu dữ liệu + chiều hỏi của khu Kanji
      kanji-levels.ts            Danh sách JLPT N5→N1 — quyết định chữ nào, cấp nào
      kanji-supplement.ts        Âm Hán Việt viết tay cho chữ kho từ không suy được
      kanji-words.generated.ts   2.123 chữ + 2.406 lượt từ — DO MÁY SINH
      kanji-entries.ts           Dựng danh sách chữ + tra theo id
    topics/
      topic.model.ts             Kiểu dữ liệu + hàm dựng bài học của khu Chủ đề
      topic-list.ts              20 chủ đề: tên + danh sách từ — KHAI TAY, chỉ script đọc
      topic-catalog.generated.ts  Danh mục nhẹ (id, tên, số từ) — DO MÁY SINH
      topic-words.generated.ts   1.097 lượt từ đã tra từ kho — DO MÁY SINH
      topic-entries.ts           Dựng bài học từ hai file trên — NẠP ĐỘNG
    radical/
      radical.model.ts           Kiểu dữ liệu + chiều hỏi của khu Bộ thủ
      radical-list.ts            214 bộ thủ Khang Hy — chữ, biến thể, âm, nghĩa, tên Nhật
      radical-parts.ts           Chiết tự 642 chữ N5→N3 thành các bộ (N2/N1 khai ở kanji-levels)
      radical-kanji.generated.ts  214 bộ + 5.604 lượt chữ ghép — DO MÁY SINH
      radical-entries.ts         Dựng danh sách bộ + tra theo id
    strokes/
      stroke.model.ts            Kiểu dữ liệu nét, mã hoá/giải mã, lấy mẫu lại nét vẽ tay
      stroke-score.ts            Chấm chữ viết tay: so nét vẽ với nét mẫu, chỉ ra nét sai
      stroke-store.ts            Nạp dữ liệu nét theo yêu cầu + tra chữ nào viết được
      stroke-data.generated.ts   Nét của 2.231 chữ từ KanjiVG — DO MÁY SINH, NẠP ĐỘNG
      stroke-coverage.generated.ts  Danh sách chữ có dữ liệu nét — DO MÁY SINH
    lessons/
      vocabulary.model.ts        Kiểu dữ liệu bài học (từ vựng, động từ, hội thoại, ngữ pháp) + cấp JLPT
      lesson-store.ts            Nạp bài học từ JSON + localStorage
      vocabulary-parser.ts       Bản TypeScript của vocab-core.mjs
      level-filter.ts            Nút lọc cấp độ dùng chung cho các tab danh sách
      lesson-search.ts           Tìm bài / mục theo từ khoá, bỏ dấu tiếng Việt
    n3/
      n3.model.ts                Kiểu + toán thuần: rải mục vào lịch, tính phần trăm và nhịp
      n3-syllabus.ts             241 buổi học chép từ mục lục bốn quyển 総まとめ + bốn giai đoạn
      n3-progress-store.ts       Dấu "đã học xong" của từng buổi trong lộ trình N3
    practice/
      practice.model.ts          Kiểu dữ liệu phiên luyện tập và câu hỏi
      practice-session-store.ts  Chạy phiên và chấm điểm
      answer-check.ts            So khớp đáp án gõ tay
      batch.ts                   Chia phạm vi thành từng cụm liền nhau (học theo cụm)
      build-questions.ts         Điều phối: dựng câu hỏi, trộn, cắt theo số câu
      vocabulary-questions.ts    Câu hỏi cho bài từ vựng
      verb-questions.ts          Câu hỏi cho bài động từ + đáp án nhiễu
      conversation-questions.ts  Câu hỏi cho bài hội thoại
      grammar-questions.ts       Câu hỏi cho bài ngữ pháp
      exercise-questions.ts      Câu hỏi cho hai bài tập động từ
      n4-grammar-questions.ts    Câu hỏi cho bài ngữ pháp N4: năm bậc + lộ trình dễ → khó
      kanji-questions.ts         Câu hỏi cho khu Kanji
      radical-questions.ts       Câu hỏi cho khu Bộ thủ
      draw-questions.ts          Câu hỏi viết tay, dùng chung cho khu Kanji và Bộ thủ
      review-questions.ts        Câu hỏi cho phiên ôn tập ngắt quãng
    review/
      review.model.ts            Lịch ôn tập ngắt quãng — toán thuần
      review-store.ts            Lịch ôn + sổ lỗi sai trong localStorage
    screens/                     Lớp cha của các màn hình có khung thiết lập luyện tập (xem CODING.md)
    services/                    Chỉ những thứ dùng chung, không thuộc mảng nào
      favorite-store.ts          Danh sách mục chưa nhớ
      level-preference.ts        Cấp độ đang chọn — một lựa chọn cho mọi tab
      recent-store.ts            Ba bài mở gần nhất (khối "Học tiếp" của trang Hôm nay)
      theme-store.ts             Lựa chọn giao diện sáng/tối/đèn đêm
      feedback-sound.ts          Tiếng chuông khi chấm câu
      local-storage.ts           Đọc/ghi localStorage an toàn
      navigation-progress.ts     Thanh tiến trình khi chuyển trang
    utils/                       Hàm thuần không biết gì về nghiệp vụ
      dom-events.ts              Đọc giá trị từ sự kiện DOM
      random.ts                  Trộn, bốc ngẫu nhiên
    guards/                      Chặn vào /practice và /result khi không có phiên
  features/
    today/                       Trang Hôm nay (/) — ôn tập đến hạn, học tiếp, tiến độ N3
    lesson-list/                 Từ vựng → Minano (/vocab) — chỉ bài từ vựng
    lesson-detail/               Bảng từ vựng + thiết lập luyện tập (dùng cho cả /topic/:id)
    topic-list/                  Tab Từ vựng chủ đề — lưới 20 chủ đề
    grammar-list/                Tab Ngữ pháp — danh sách bài
    grammar-detail/              Lý thuyết một bài ngữ pháp + thiết lập luyện tập
    exercise-list/               Tab Bài tập bổ trợ — bài tập chuyên đề + bài động từ + bài hội thoại
    exercise-detail/             Một bài tập động từ: thiết lập luyện + bảng tra cứu
    n4-grammar/                  Màn hình của mọi sách ngữ pháp: lý thuyết + lộ trình năm bậc
    n3-progress/                 Tab Tiến độ N3 — phần trăm, nhịp học mỗi ngày, bảng kiểm soát
    kanji-list/                  Tab Kanji — lưới chữ Hán + luyện âm Hán Việt
    kanji-detail/                Một chữ: các từ dùng chữ đó + luyện từ
    radical-list/                Tab Bộ thủ — lưới 214 bộ + luyện âm Hán Việt
    radical-detail/              Một bộ: các chữ ghép từ bộ đó + luyện chữ
    practice/                    Màn hình làm bài
    result/                      Màn hình kết quả
    import-lesson/               Nạp bài mới (đang tắt, xem core/feature-flags.ts)
  shared/
    practice-setup.ts            Khung thiết lập luyện tập hai tầng ("Tuỳ chỉnh thêm") dùng chung
```

## Lưu ý kỹ thuật

**Hai bản parser phải giống nhau.** `scripts/vocab-core.mjs` (dùng bởi script) và
`src/app/core/lessons/vocabulary-parser.ts` (dùng bởi màn hình nạp bài) cài cùng một thuật toán.
Id của từ vựng được băm từ nội dung (`FNV-1a`) và danh sách Favorite lưu theo id đó, nên nếu hai
bản lệch nhau thì cùng một bài học nạp bằng hai đường sẽ có id khác nhau và Favorite mất tác
dụng. **Sửa một bên thì phải sửa bên kia**, rồi chạy:

```bash
npm run verify           # sinh lại public/lessons rồi chạy tất cả các lệnh kiểm tra bên dưới
npm run verify:parser    # hai bản parser cho kết quả giống nhau
npm run verify:answer    # dấu câu / khoảng trắng không làm sai kết quả chấm
npm run verify:conjugation  # engine chia động từ + dữ liệu động từ thật
npm run verify:topics    # 20 chủ đề khớp kho từ, không chủ đề nào bịa ra từ mới
npm run verify:audio     # mọi từ vựng đều có file phát âm
```

`verify:parser` so sánh kết quả của hai bản trên cùng bộ dữ liệu mẫu và đối chiếu id trong file
JSON đã sinh. Cần Node 22+ (dùng `--experimental-strip-types` để nạp thẳng file `.ts`).

`verify:answer` nạp thẳng [`answer-check.ts`](../src/app/core/practice/answer-check.ts) rồi gõ lại **mọi**
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
[`src/app/core/audio/vocab-audio.ts`](../src/app/core/audio/vocab-audio.ts) là nơi duy nhất quyết định
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
[`src/app/core/i18n/messages/`](../src/app/core/i18n/messages/) (mỗi khu vực một file, gộp ở `messages.ts`) dưới dạng `khoá → { vi, ja }`, và
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

- [`core/i18n/t.ts`](../src/app/core/i18n/t.ts) — component `<app-t>` vẽ bản dịch của **mọi ngôn ngữ**
  chồng lên nhau trong một ô grid, chỉ ngôn ngữ đang chọn là hiện, các bản kia `visibility: hidden`.
  Chữ ẩn vẫn chiếm chỗ nên ô luôn rộng/cao bằng bản dài nhất. **Không dùng `min-width`/`min-height`
  với số đo cố định** — loại đó đúng hôm nay và sai âm thầm vào hôm ai đó sửa một câu dịch.
  Chỉ cần dùng ở chỗ kích thước ảnh hưởng tới vị trí phần khác; chữ nằm một mình thì `{{ t('key') }}`
  là đủ.
- Bảng dùng `table-layout: fixed` + bề rộng cột khai báo sẵn, nên cột không co giãn theo độ dài chữ.
- Biểu tượng trên thanh bên và hai nút header là SVG ([`shared/icon.ts`](../src/app/shared/icon.ts))
  chứ không phải ký tự `◐`/`☀`/`🕯`: ký tự thì khi `<html lang>` đổi, trình duyệt chọn font khác và
  vẽ rộng hẹp khác nhau (đo được 13px ↔ 16px), còn `🕯` là ô vuông rỗng trên nhiều máy Windows.

**Bảng màu chỉ khai báo một lần.** `src/styles/tokens.css` dùng `light-dark(giá trị sáng, giá trị tối)`
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
