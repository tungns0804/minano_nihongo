# Quy ước viết code

Tài liệu này nói **viết một tính năng mới thì đặt code ở đâu và dùng lại cái gì**.
Nó không kể lại kiến trúc — phần đó ở [README.md](README.md).

Đọc trước khi thêm một khu mới (một tab, một màn hình chi tiết, một kiểu luyện
tập). Mọi mục dưới đây đều rút ra từ một chỗ đã bị chép nhầm ít nhất một lần.

---

## Nguyên tắc chung

**Chép một màn hình cũ rồi đổi tên biến là cách sai.** Đó chính là cách khu Kanji,
khu Bộ thủ và khu Bài tập ra đời, và cái giá là bảy bản sao của cùng một khung
thiết lập, 844 dòng CSS trùng nhau, và mỗi lần thêm một tuỳ chọn là phải sửa bảy
chỗ. Muốn thêm màn hình mới thì **kế thừa** lớp cha có sẵn và chỉ viết phần riêng.

**Comment giải thích VÌ SAO, không giải thích CÁI GÌ.** `// Đọc counts() trước để
Angular ghi nhận phụ thuộc` là comment tốt; `// lấy danh sách id` thì không. Toàn
bộ comment trong repo viết bằng tiếng Việt.

**Không có gì được viết cứng bằng chữ hiển thị.** Mọi chuỗi người dùng nhìn thấy
đều là `MessageKey` trong `core/i18n/messages.ts`; `npm run verify:i18n` chặn
việc quên.

---

## Thêm một màn hình có khung "thiết lập luyện tập"

Kế thừa `core/screens/practice-screen.ts`:

```ts
export class MyScreen extends PracticeScreen {
  protected favoriteSessionId(): string {
    return MY_SESSION_ID; // hằng ở khu tra cứu, this.lessonId() ở màn chi tiết
  }

  readonly favoriteCount = computed(() => this.favoritesOf(this.myItems()).length);
}
```

Lớp cha đã có sẵn, **không khai lại**:

| Có sẵn | Dùng để |
|---|---|
| `scope` `questionLimit` `shuffleQuestions` `ignoreDiacritics` `showHint` | các lựa chọn của khung thiết lập |
| `setScope` `setQuestionLimit` `toggleShuffle` `toggleIgnoreDiacritics` `toggleShowHint` | template gọi thẳng |
| `search` `onlyFavorites` `onSearch` `clearSearch` `toggleOnlyFavorites` | ô tìm + lọc ★ của bảng |
| `favoriteIds` `isFavorite` `toggleFavorite` `clearFavorites` `favoritesOf` | khối ★ |
| `fixScope()` | gọi sau khi đổi cấp/nhóm/bài, vì phạm vi ★ có thể vừa rỗng đi |
| `launch(lesson, config, plan)` | ba dòng cuối của `start()` |
| `t` `lang` `maxWrongAttempts` | dịch và hằng số |

Cần khác một chút thì **override**, đừng khai lại từ đầu:

```ts
override setQuestionLimit(limit: number | null): void {
  super.setQuestionLimit(limit);
  this.pickedBatch.set(null); // đổi số câu là chia lại bài
}
```

Mặc định `showHint` là `false`. Khu nào cần bật sẵn thì đặt trong constructor:

```ts
constructor() {
  super();
  this.showHint.set(true);
}
```

**Vì sao là lớp cha chứ không phải hàm trả về object:** template gọi thẳng
`scope()`, `toggleShuffle($event)`, `isFavorite(id)` trên component. Gom vào một
object thì mọi template phải đổi thành `setup.scope()` — nhiều chỗ sửa mà không
được gì.

## Thêm một trang danh sách

Kế thừa `core/screens/lesson-browser.ts`:

- `LessonBrowser` — ô tìm (`search`, `needle`, `onSearch`, `clearSearch`) và
  `favoriteCount(id)`. Dùng cho trang không lọc theo cấp: tab Chủ đề, tab Bài tập.
- `LeveledLessonBrowser` — thêm bộ lọc cấp độ, `lessons`, `noMatch`,
  `resetFilters`, `reload`. Dùng cho trang chủ và tab Ngữ pháp. Lớp con khai đúng
  hai thứ:

```ts
protected levelStorageKey(): string {
  return 'jp-practice:my-level-filter'; // RIÊNG mỗi tab, đừng dùng chung khoá
}

readonly allLessons = computed(() =>
  this.lessonStore.summaries().filter((lesson) => lesson.kind === 'grammar'),
);
```

---

## Dựng một phiên luyện tập

**Đừng viết tay `PracticeConfig`.** Nó có hai mươi trường và phần lớn không liên
quan tới loại bài đang luyện. Dùng `practiceConfig()` và chỉ truyền cái của mình:

```ts
const config = practiceConfig({
  lessonId: entry.id,
  lessonKind: 'kanji',
  scope: this.scope(),
  questionLimit: this.questionLimit(),
  shuffle: this.shuffleQuestions(),
  showHanViet: this.showHint(),
  kanjiMode: this.mode(),
});

this.launch({ id: entry.id, name }, config, orderQuestions(questions, config));
```

**Đừng viết tay `PracticeQuestion`.** Nó có mười tám trường; `makeQuestion()` lo
mười hai trường trung tính, bạn chỉ khai phần thật sự khác:

```ts
makeQuestion({
  subject,
  labelKey: 'kanji.label.kanjiHanViet',
  prompt: entry.char,
  correctAnswer: entry.hanViet,
  acceptedAnswers: acceptedAnswersOf(entry.hanViet),
  answerPromptKey: 'kanji.answerPrompt.hanViet',
  maxWrongAttempts: limitAttempts(config.maxWrongAttempts, 'typing', 0),
})
```

Mặc định của nó là dạng phổ biến nhất: hỏi bằng chữ Nhật, gõ đáp án bằng chữ
Latin, không gợi ý, chấm đúng nguyên văn, không trắc nghiệm.

Dòng phản hồi sau khi chấm dùng ba helper thay vì object bốn trường:

```ts
recap('kanji.col.hanViet', readings)      // giá trị là chữ Latin
recapJp('kanji.col.kanji', entry.char)    // giá trị là chữ Nhật (đổi font)
recapKey('lesson.col.group', groupKey)    // giá trị phải dịch
```

Mọi builder câu hỏi đặt trong `core/practice/`, một file một loại bài.

---

## Template

Ô tìm và nút ★ đã là component — **đừng chép lại markup**:

```html
<app-search-box
  class="search-input"
  [placeholder]="t('kanji.search')"
  [value]="search()"
  (changed)="search.set($event)"
/>

<button app-star [on]="isFavorite(word.id)" [name]="word.japanese"
        (click)="toggleFavorite(word.id)"></button>
```

`<app-search-box>` nhận **chữ đã dịch**, không nhận khoá — vài màn hình dựng
placeholder theo loại bài đang mở. `button[app-star]` là selector thuộc tính chứ
không phải thẻ riêng, để không thêm một lớp bọc phá bố cục của bảng và của lưới.

Đọc giá trị từ sự kiện DOM bằng `core/utils/dom-events.ts`, đừng ép kiểu tay:

```ts
toggleX(event: Event): void { this.x.set(checkedOf(event)); }
onSearch(event: Event): void { this.search.set(valueOf(event)); }
```

---

## CSS

**Trước khi viết một luật mới, tìm nó trong `src/styles.css`.** Mục *"Lớp dùng
chung của nhiều màn hình"* đã có: khung thiết lập (`.options-2`,
`.options-limit`, `.option-stacked`, `.start-bar`), hàng lọc (`.filter-row`,
`.search-input`, `.filter-check`), nút ★, bảng từ (`.word-table`, `.col-star`),
`.back-link`, thẻ bài học (`.lesson-card`, `.lesson-grid`, `.skeleton-*`), và
tab chọn nhóm (`.level-tab*`, `.mode-still`).

Màn hình cần khác một chút thì **chỉ khai phần khác** trong file của nó. Việc đó
luôn thắng: Angular gắn `[_ngcontent-…]` vào selector của component nên
`.star-btn` trong `practice.css` luôn đè `.star-btn` ở `styles.css`.

File `.css` của component chỉ nên chứa thứ **riêng** của màn hình đó. Thấy mình
đang chép một khối sang màn hình thứ hai thì đó là dấu hiệu nó thuộc về
`styles.css`.

---

## Script trong `scripts/`

Dùng `scripts/script-utils.mjs`, đừng khai lại:

```js
import { c, emitGenerated, log, quote, toFileUrl } from './script-utils.mjs';
```

- `log` / `c` — in ra màn hình, có màu, tự tắt màu khi output bị pipe.
- `toFileUrl(path)` — đường dẫn Windows → URL để `await import()` nhận được.
- `quote(text)` — chuỗi TypeScript nháy đơn, đã escape.
- `emitGenerated(outputs, { checkOnly, root, rerun })` — bốn nhánh của
  "so với file cũ rồi ghi, hoặc báo lỗi khi chạy `--check`".

Script sinh mã phải hỗ trợ `--check` và đăng ký nó vào `verify:ci` trong
`package.json`: CI chỉ chặn được file sinh bị lệch nếu có ai đó đi hỏi.

> **Lưu ý trên Windows:** `verify:kanji`, `verify:radicals` và `verify:topics`
> báo lệch trên máy Windows có `core.autocrlf=true`, vì file trong thư mục làm
> việc là CRLF còn script ghi ra LF. Đây là chuyện của môi trường, không phải nội
> dung — CI chạy trên Linux nên vẫn xanh.

---

## Kiểm tra trước khi commit

```
npm run build        # gồm cả kiểm tra template (strictTemplates)
npm run verify:ci    # parser, chấm điểm, chia động từ, i18n, file sinh, lộ trình N3
```

Đừng chạy `prettier --write` trên cả repo: repo hiện không prettier-clean, nên
lệnh đó sẽ format lại vài nghìn dòng không liên quan và chôn mất thay đổi thật.
