/** Tab ngữ pháp minano. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const GRAMMAR_MESSAGES = {
  // Bài ngữ pháp có màn hình riêng chứ không dùng chung với /lesson/:id: nội dung
  // của nó là trang lý thuyết (công thức, bảng biến đổi, các cách dùng) chứ không
  // phải một bảng dữ liệu như ba loại bài kia.
  'grammar.title': { vi: 'Ngữ pháp 皆の日本語', ja: '皆の日本語の文法' },
  'grammar.subtitle': {
    vi: 'Chọn một bài để xem mẫu ngữ pháp kèm giải thích, rồi luyện viết câu theo đúng mẫu đó.',
    ja: 'レッスンを選ぶと文型と解説が表示され、その文型どおりに文を書く練習ができます。',
  },
  'grammar.roadmap': {
    vi: 'Phần ngữ pháp đã phủ trọn 50 bài của 皆の日本語 — bài 1–25 (N5) và bài 26–50 (N4).',
    ja: '文法は『皆の日本語』全50課を収録しています（第1〜25課はN5、第26〜50課はN4）。',
  },
  'grammar.empty': { vi: 'Chưa có bài ngữ pháp nào.', ja: '文法レッスンがまだありません。' },
  'grammar.empty.hint': {
    vi: 'Tạo thư mục data-source/<tên-bài>/ với file grammar.json rồi chạy npm run generate.',
    ja: 'data-source/<レッスン名>/ に grammar.json を置き、npm run generate を実行してください。',
  },
  'grammar.back': { vi: '← Danh sách bài ngữ pháp', ja: '← 文法レッスン一覧' },
  'grammar.contents': { vi: 'Mẫu ngữ pháp trong bài', ja: 'この課の文型' },
  'grammar.exampleCount': { vi: '{count} câu ví dụ', ja: '例文{count}文' },
  'grammar.structure': { vi: 'Công thức', ja: '接続' },
  'grammar.explanation': { vi: 'Giải thích', ja: '解説' },
  'grammar.notes': { vi: 'Lưu ý', ja: '注意' },
  'grammar.usages': { vi: 'Cách dùng', ja: '使い方' },
  'grammar.practice': { vi: 'Luyện viết câu theo mẫu', ja: '文型どおりに書く練習' },
  'grammar.points': { vi: 'Mẫu đem ra luyện (chọn nhiều được)', ja: '練習する文型（複数選択可）' },
  'grammar.points.hint': {
    vi: 'Bỏ chọn bớt để luyện riêng một mẫu.',
    ja: 'チェックを外すと1つの文型だけ練習できます。',
  },
  'grammar.scope.hint': {
    vi: 'Bấm ngôi sao ở các câu ví dụ phía trên để đánh dấu câu hay quên.',
    ja: '上の例文の星印を押して、覚えにくい文に印を付けます。',
  },
  'grammar.option.showHint': { vi: 'Hiện mẫu ngữ pháp kèm câu hỏi', ja: '問題に文型を表示' },
  'grammar.option.diacriticsDisabled': {
    vi: 'Chỉ có tác dụng ở chiều Nhật → Việt, vì đáp án khi đó mới là tiếng Việt',
    ja: '解答がベトナム語になる「日→越」でのみ有効です',
  },
  'grammar.option.showHintHint': {
    vi: 'Tắt đi để tự nhớ ra mẫu phải dùng.',
    ja: 'オフにすると、使う文型を自分で思い出す必要があります。',
  },
  'grammar.typingOnly': {
    vi: 'Bài ngữ pháp chỉ có gõ đáp án. Chọn trong bốn câu dài thì đọc lướt là ra, không còn là viết theo mẫu nữa.',
    ja: '文法レッスンは入力解答のみです。長文を4択にすると、文型を使わずに見比べるだけで当たってしまいます。',
  },
  'grammar.star': { vi: 'Đánh dấu câu này là chưa nhớ', ja: 'この文を未習得にする' },
  'grammar.recap.pattern': { vi: 'Mẫu ngữ pháp', ja: '文型' },
  'grammar.recap.usage': { vi: 'Cách dùng', ja: '使い方' },
  'grammar.recap.note': { vi: 'Ghi chú', ja: 'メモ' },
} as const satisfies Record<string, Entry>;
