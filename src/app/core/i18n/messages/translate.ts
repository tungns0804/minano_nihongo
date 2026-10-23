/** Tab luyện dịch. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const TRANSLATE_MESSAGES = {
  // Đi song song 50 bài ngữ pháp: bài luyện dịch N chỉ dùng ngữ pháp bài 1…N, và mỗi
  // câu mang theo các mẫu nó dùng để giải thích sau khi chấm.
  'translate.title': { vi: 'Luyện dịch theo bài 皆の日本語', ja: '皆の日本語 課別の翻訳練習' },
  'translate.subtitle': {
    vi: 'Mỗi bài có vài bài nhỏ khoảng 10 câu. Bài càng về sau càng kết hợp thêm ngữ pháp của các bài trước, và mỗi câu một tổ hợp ngữ pháp riêng. Dịch xong — đúng hay sai — đều có giải thích từng mẫu ngữ pháp trong câu.',
    ja: '各課に約10文の小テストがいくつかあります。後の課ほど前の課の文法を多く組み合わせ、文ごとに異なる文法の組み合わせになっています。訳した後は正誤にかかわらず、文中の各文型の解説が表示されます。',
  },
  'translate.howItWorks': {
    vi: 'Bài luyện dịch N chỉ dùng ngữ pháp từ bài 1 tới bài N, nên học tới đâu luyện tới đó được ngay.',
    ja: '第N課の翻訳練習は第1〜N課の文法だけを使うので、学んだところまですぐに練習できます。',
  },
  'translate.empty': { vi: 'Chưa có bài luyện dịch nào.', ja: '翻訳練習がまだありません。' },
  'translate.empty.hint': {
    vi: 'Tạo thư mục data-source/<tên-bài>/ với file translation.json rồi chạy npm run generate.',
    ja: 'data-source/<レッスン名>/ に translation.json を置き、npm run generate を実行してください。',
  },
  'translate.back': { vi: '← Danh sách bài luyện dịch', ja: '← 翻訳練習一覧' },
  'translate.setCount': { vi: '{count} bài nhỏ', ja: '小テスト{count}個' },
  'translate.grammarOverview': { vi: 'Ngữ pháp dùng trong bài', ja: 'この課で使う文法' },
  'translate.grammarOverview.hint': {
    vi: 'Con số là số câu có dùng mẫu đó. Bấm vào một mẫu để mở bài ngữ pháp dạy nó.',
    ja: '数字はその文型を使う文の数です。文型を押すと、その文型を学ぶ文法の課が開きます。',
  },
  'translate.grammarOverview.current': { vi: 'Ngữ pháp của bài này', ja: 'この課の文法' },
  'translate.grammarOverview.older': { vi: 'Ôn lại ngữ pháp các bài trước', ja: '前の課の文法（復習）' },
  'translate.lessonBadge': { vi: 'Bài {lesson}', ja: '第{lesson}課' },
  'translate.sets': { vi: 'Các bài nhỏ', ja: '小テスト' },
  'translate.setTitle': { vi: 'Bài nhỏ {index} · {title}', ja: '小テスト{index}・{title}' },
  'translate.setShort': { vi: 'Bài nhỏ {index}', ja: '小テスト{index}' },
  'translate.practiceSet': { vi: 'Luyện bài nhỏ này ({count} câu)', ja: 'この小テストを練習（{count}文）' },
  'translate.star': { vi: 'Đánh dấu câu này là chưa nhớ', ja: 'この文を未習得にする' },
  'translate.practice': { vi: 'Luyện dịch', ja: '翻訳練習' },
  'translate.pickSets': { vi: 'Bài nhỏ đem ra luyện (chọn nhiều được)', ja: '練習する小テスト（複数選択可）' },
  'translate.option.furigana': { vi: 'Hiện furigana', ja: 'ふりがなを表示' },
  'translate.option.furiganaHint': {
    vi: 'Cách đọc trên chữ Hán của câu tiếng Nhật. Tắt đi để tự đọc chữ Hán.',
    ja: '日本語の文の漢字に読み方を表示します。オフにすると漢字を自分で読みます。',
  },
  'translate.option.grammarHint': { vi: 'Gợi ý mẫu ngữ pháp phải dùng', ja: '使う文型をヒントに表示' },
  'translate.option.grammarHintHint': {
    vi: 'Hiện tên các mẫu ngữ pháp có trong câu ngay dưới câu hỏi.',
    ja: '問題の下に、文に含まれる文型名を表示します。',
  },
  'translate.plan': {
    vi: 'Sẽ luyện {count} câu · {mode} · gõ đáp án. Mỗi câu trả lời một lần, rồi xem câu mẫu và giải thích ngữ pháp.',
    ja: '{count}問・{mode}・入力解答。各文1回だけ答え、模範解答と文法解説を確認します。',
  },
  'translate.context': { vi: 'Câu trước', ja: '前の発言' },
  'translate.wrong': { vi: 'Chưa khớp câu mẫu — tạm tính là sai.', ja: '模範解答と一致しません（ひとまず不正解）。' },
  'translate.selfGraded': { vi: '(bạn tự xác nhận)', ja: '（自己採点）' },
  'translate.alsoAccepted': { vi: 'Cũng được chấp nhận:', ja: '次の訳も正解：' },
  'translate.acceptOwn': { vi: 'Câu của tôi cũng đúng', ja: '自分の訳も正しい' },
  'translate.acceptOwnHint': {
    vi: 'Dịch đúng ý mà khác câu mẫu ở cách chọn từ thì tự xác nhận.',
    ja: '意味は合っていて言い回しだけが違う場合は、自分で正解にできます。',
  },
  'translate.grammarInSentence': { vi: 'Ngữ pháp trong câu', ja: 'この文の文法' },
} as const satisfies Record<string, Entry>;
