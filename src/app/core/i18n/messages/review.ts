/** Ôn tập theo lịch. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const REVIEW_MESSAGES = {
  'review.title': { vi: 'Ôn tập', ja: '復習' },
  'review.subtitle': {
    vi: 'Mọi từ, chữ Hán, câu ngữ pháp và động từ bạn đã luyện đều tự vào lịch ôn: trả lời đúng thì lần ôn sau giãn xa ra, sai thì được nhắc lại sớm.',
    ja: '練習した単語・漢字・文法の例文・動詞は自動で復習スケジュールに入ります。正解すると次の復習までの間隔が延び、間違えると早めに出題されます。',
  },
  'review.short': { vi: 'Ôn tập', ja: '復習' },
  'review.sessionName': { vi: 'Ôn tập hôm nay', ja: '今日の復習' },
  'review.persistFailed.title': { vi: 'Không lưu được lịch ôn', ja: '復習データを保存できません' },
  'review.persistFailed.text': {
    vi: 'Trình duyệt đang chặn bộ lưu trữ cục bộ (chế độ ẩn danh, hết dung lượng, hoặc cookie bị tắt). Kết quả vẫn được tính trong phiên này nhưng sẽ mất khi tải lại trang.',
    ja: 'ブラウザがローカルストレージを拒否しています（プライベートモード、容量不足、Cookie 無効など）。結果はこのセッション中だけ反映され、再読み込みで失われます。',
  },
  'review.stat.due': { vi: 'Đến hạn hôm nay', ja: '今日の復習' },
  'review.stat.tracked': { vi: 'Mục đang theo dõi', ja: '記録中の項目' },
  'review.stat.mastered': { vi: 'Đã nhớ lâu', ja: '定着済み' },
  'review.stat.masteredTitle': {
    vi: 'Mục có khoảng ôn từ 14 ngày trở lên',
    ja: '復習間隔が14日以上の項目',
  },
  'review.stat.mistakes': { vi: 'Trong sổ lỗi sai', ja: '間違いノート' },
  'review.area.vocab': { vi: 'Từ vựng', ja: '単語' },
  'review.area.kanji': { vi: 'Kanji', ja: '漢字' },
  'review.area.grammar': { vi: 'Ngữ pháp', ja: '文法' },
  'review.area.verb': { vi: 'Động từ', ja: '動詞' },
  'review.setup': { vi: 'Ôn hôm nay', ja: '今日の復習' },
  'review.areas': { vi: 'Khu', ja: '分野' },
  'review.limit': { vi: 'Số mục', ja: '項目数' },
  'review.limit.n': { vi: '{count} mục', ja: '{count}件' },
  'review.answerNote': {
    vi: 'Kanji, câu ngữ pháp và bài chuyển thể luôn gõ đáp án; ý nghĩa mẫu ngữ pháp N4 luôn trắc nghiệm.',
    ja: '漢字・文法の例文・活用練習は常に入力、N4文型の意味は常に4択で解答します。',
  },
  'review.plan': {
    vi: 'Sẽ ôn {count} mục · mục quá hạn lâu nhất được ưu tiên.',
    ja: '{count}件を復習します · 期限切れが古い項目を優先します。',
  },
  'review.nothingDue': {
    vi: 'Không còn mục nào đến hạn ở các khu đang chọn.',
    ja: '選択した分野に期限の来た項目はありません。',
  },
  'review.start': { vi: 'Bắt đầu ôn', ja: '復習を始める' },
  'review.buildFailed': {
    vi: 'Không dựng được câu hỏi nào — có thể bài học chưa tải được. Kiểm tra mạng rồi thử lại.',
    ja: '問題を作成できませんでした。レッスンを読み込めていない可能性があります。接続を確認して再試行してください。',
  },
  'review.empty.title': { vi: 'Chưa có gì để ôn', ja: 'まだ復習する項目がありません' },
  'review.empty.text': {
    vi: 'Luyện một bài bất kỳ (từ vựng, kanji, ngữ pháp hay động từ) — các mục bạn trả lời sẽ tự vào lịch ôn.',
    ja: '単語・漢字・文法・動詞のどれかを練習すると、解答した項目が自動で復習スケジュールに入ります。',
  },
  'review.empty.go': { vi: 'Tới danh sách bài học', ja: 'レッスン一覧へ' },
  'review.mistakes.title': { vi: 'Sổ lỗi sai', ja: '間違いノート' },
  'review.mistakes.hint': {
    vi: 'Mục từng bị lộ đáp án. Trả lời đúng ngay 2 lần liên tiếp ở hai ngày khác nhau thì mục tự ra khỏi sổ.',
    ja: '答えを表示したことがある項目です。別々の日に2回続けて一発で正解すると自動で外れます。',
  },
  'review.mistakes.filter': { vi: 'Lọc theo khu', ja: '分野で絞り込み' },
  'review.mistakes.practice': { vi: 'Luyện {count} mục này', ja: 'この{count}件を練習' },
  'review.mistakes.lapses': { vi: 'Sai {count} lần', ja: '{count}回ミス' },
  'review.mistakes.dismiss': { vi: 'Bỏ khỏi sổ', ja: 'ノートから外す' },
  'review.mistakes.dismissTitle': {
    vi: 'Đánh dấu là đã nhớ. Nếu sau này sai lại, mục sẽ tự vào sổ.',
    ja: '覚えたことにします。再び間違えると自動でノートに戻ります。',
  },
  'review.mistakes.loading': { vi: 'Đang tải sổ lỗi sai…', ja: '間違いノートを読み込み中…' },
  'review.mistakes.empty': { vi: 'Không có mục nào trong sổ.', ja: 'ノートに項目はありません。' },
  'review.mistakes.unavailable': {
    vi: '{count} mục chưa hiện được nội dung (bài học chưa tải được hoặc đã bị xoá).',
    ja: '{count}件の内容を表示できません（レッスンを読み込めないか、削除されています）。',
  },
  'review.mistakes.sessionName': { vi: 'Sổ lỗi sai', ja: '間違いノート' },
} as const satisfies Record<string, Entry>;
