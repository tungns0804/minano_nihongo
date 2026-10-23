/** Trang chủ và bộ lọc cấp độ của các danh sách bài. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const HOME_MESSAGES = {
  'home.title': { vi: 'Chọn bài học để luyện tập', ja: '練習するレッスンを選ぶ' },
  'home.subtitle': {
    vi: 'Chọn một bài để luyện. Mỗi câu bạn trả lời đều được ghi vào lịch ôn, để trang Ôn tập nhắc lại đúng lúc sắp quên.',
    ja: 'レッスンを選んで練習しましょう。解答した問題は復習スケジュールに記録され、忘れかけた頃に「復習」ページで出題されます。',
  },
  'home.loading': { vi: 'Đang tải danh sách bài học…', ja: 'レッスン一覧を読み込み中…' },
  'home.loadError': { vi: 'Không tải được bài học có sẵn', ja: '既存レッスンを読み込めません' },
  'home.search': { vi: 'Tìm bài học theo tên hoặc số bài…', ja: 'レッスン名・課の番号で検索…' },
  'home.search.aria': { vi: 'Tìm bài học', ja: 'レッスンを検索' },
  'home.search.clear': { vi: 'Xoá từ khoá đang tìm', ja: '検索語を消す' },
  'home.noMatch.title': { vi: 'Không có bài nào khớp với "{term}"', ja: '「{term}」に一致するレッスンがありません' },
  'home.noMatch.text': {
    vi: 'Thử từ khoá ngắn hơn, hoặc gõ số bài — ví dụ 33.',
    ja: 'もっと短い語か、課の番号（例：33）で試してください。',
  },
  'home.noMatch.reset': { vi: 'Xoá bộ lọc', ja: '絞り込みを解除' },
  'home.level': { vi: 'Cấp độ', ja: 'レベル' },
  'home.level.all': { vi: 'Tất cả', ja: 'すべて' },
  // Kèm luôn khoảng bài để khỏi phải nhớ N5 gồm những bài nào.
  'home.level.range': { vi: '{level} · bài {from}–{to}', ja: '{level}・{from}〜{to}課' },
  // Cấp không bám theo số bài 皆の日本語 (N3 học theo 総まとめ) thì khoảng bài vô
  // nghĩa — ghi tên sách thay vào để biết cấp đó lấy nội dung từ đâu.
  'home.level.book': { vi: '{level} · {book}', ja: '{level}・{book}' },
  'home.level.none': { vi: 'Không theo bài', ja: '課に属さない' },
  'home.level.noneTitle': {
    vi: 'Bài không gắn với một bài số cụ thể, ví dụ bài gom động từ đặc biệt',
    ja: '特定の課に属さないレッスン（特別な動詞をまとめたものなど）',
  },
  'home.lessonCount': { vi: '{count} bài học', ja: '{count}レッスン' },
  'home.itemCount': { vi: '{count} mục', ja: '{count}項目' },
  'home.categoryCount': { vi: '{count} bài', ja: '{count}レッスン' },
  // Trang này từng có cả bài chia động từ lẫn bài dịch hội thoại. Một dòng chỉ đường
  // rẻ hơn nhiều so với việc người dùng tưởng bài học đã mất.
  'home.movedToExercise': {
    vi: 'Bài chia động từ và bài dịch hội thoại đã chuyển sang tab “Bài tập bổ trợ”.',
    ja: '動詞の活用と会話の翻訳は「補助練習」タブに移動しました。',
  },
  'home.favoriteCount': { vi: '★ {count} chưa nhớ', ja: '★ 未習得{count}' },
  'home.empty.title': { vi: 'Chưa có bài học nào', ja: 'レッスンがまだありません' },
  'home.empty.intro': { vi: 'Có hai cách để thêm bài học:', ja: 'レッスンを追加する方法は2つあります：' },
  // Dùng khi màn hình "Nạp bài mới" đang tắt: lúc đó chỉ còn đúng một cách.
  'home.empty.introOnly': { vi: 'Cách thêm bài học:', ja: 'レッスンを追加する方法：' },
  'home.empty.step1': {
    vi: 'Tạo thư mục data-source/<tên-bài>/, đặt file .txt vào rồi chạy npm run generate.',
    ja: 'data-source/<レッスン名>/ を作り、.txt ファイルを置いて npm run generate を実行。',
  },
  'home.empty.step2': {
    vi: 'Hoặc dán trực tiếp danh sách ở màn hình “Nạp bài mới”.',
    ja: 'または「レッスン追加」画面にリストを直接貼り付ける。',
  },
  // Lời nhắc ở trang chủ và nút quay về ở màn hình kết quả — hai chỗ duy nhất ngoài
  // trang Ôn tập nhắc tới lịch ôn.
  'home.review.title': { vi: 'Hôm nay có {count} mục cần ôn', ja: '今日の復習：{count}件' },
  'home.review.text': {
    vi: 'Ôn đúng hạn để nhớ lâu — mỗi ngày vài phút.',
    ja: '期限どおりに復習すると長く覚えられます。毎日数分でOK。',
  },
  // Dòng tiến độ trên thẻ bài (shared/lesson-progress.ts).
  'progress.current': { vi: 'Đang học', ja: '学習中' },
  'progress.learned': { vi: 'Đã học {count}/{total}', ja: '学習済み {count}/{total}' },
  'progress.practiced': { vi: 'Đã luyện {count} câu', ja: '{count}問 練習済み' },
  'progress.due': { vi: '{count} đến hạn ôn', ja: '復習期限 {count}' },
  // Bài trước / bài sau ở cuối trang chi tiết (shared/lesson-pager.ts).
  'pager.aria': { vi: 'Bài kề', ja: '前後のレッスン' },
  'pager.prev': { vi: 'Bài trước', ja: '前のレッスン' },
  'pager.next': { vi: 'Bài sau', ja: '次のレッスン' },
} as const satisfies Record<string, Entry>;
