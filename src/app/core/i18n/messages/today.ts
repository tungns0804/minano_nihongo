/** Trang Hôm nay — trang mở đầu của ứng dụng. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const TODAY_MESSAGES = {
  'today.title': { vi: 'Hôm nay học gì?', ja: '今日は何を学ぶ？' },
  'today.subtitle': {
    vi: 'Giữ chuỗi ngày học, ôn những mục đến hạn, rồi học tiếp bài đang dở.',
    ja: '連続記録をキープし、期限の項目を復習してから続きを学びましょう。',
  },
  'today.continue.title': { vi: 'Học tiếp', ja: '続きから' },
  'today.n3.daysLeft': { vi: 'Còn {days} ngày tới kỳ thi', ja: '試験まであと{days}日' },
  'today.skills.title': { vi: 'Học theo kỹ năng', ja: 'スキル別に学ぶ' },
  'today.skill.vocab.desc': {
    vi: '50 bài minano, bài N3 và 20 chủ đề hay ra thi',
    ja: '皆の日本語50課、N3、試験頻出の20テーマ',
  },
  'today.skill.grammar.desc': {
    vi: 'Ngữ pháp từng bài minano và tổng hợp N4',
    ja: '各課の文法とN4総まとめ',
  },
  'today.skill.kanji.desc': { vi: 'Chữ Hán N5–N1 và 214 bộ thủ', ja: 'N5〜N1の漢字と214部首' },
  'today.skill.practice.desc': {
    vi: 'Luyện dịch, chia động từ, tự/tha động từ',
    ja: '翻訳、動詞の活用、自動詞・他動詞',
  },
  // ── Chuỗi ngày học (core/activity) ─────────────────────────────────────
  'streak.title': { vi: 'Chuỗi ngày học', ja: '連続学習' },
  'streak.unit': { vi: 'ngày liên tiếp', ja: '日連続' },
  'streak.state.done': { vi: 'Hôm nay đã giữ chuỗi — tuyệt vời! 🎉', ja: '今日の目標達成！🎉' },
  'streak.state.atRisk': {
    vi: 'Còn {count} câu nữa để giữ chuỗi hôm nay',
    ja: '今日あと{count}問で連続記録キープ',
  },
  'streak.state.none': {
    vi: 'Trả lời {count} câu hôm nay để bắt đầu chuỗi',
    ja: '今日{count}問解いて連続記録をスタート',
  },
  'streak.today': { vi: 'Hôm nay', ja: '今日' },
  'streak.todayCount': { vi: '{answered}/{goal} câu', ja: '{answered}/{goal}問' },
  'streak.best': { vi: 'Kỷ lục: {count} ngày', ja: '最長記録: {count}日' },
  'streak.weekAria': { vi: 'Bảy ngày gần nhất', ja: '直近7日間' },
  'streak.dayMet': { vi: 'đạt mục tiêu', ja: '目標達成' },
  'streak.dayMissed': { vi: 'chưa đạt', ja: '未達成' },
  'streak.dow.0': { vi: 'CN', ja: '日' },
  'streak.dow.1': { vi: 'T2', ja: '月' },
  'streak.dow.2': { vi: 'T3', ja: '火' },
  'streak.dow.3': { vi: 'T4', ja: '水' },
  'streak.dow.4': { vi: 'T5', ja: '木' },
  'streak.dow.5': { vi: 'T6', ja: '金' },
  'streak.dow.6': { vi: 'T7', ja: '土' },
  'streak.goal': { vi: 'Mục tiêu mỗi ngày (câu)', ja: '1日の目標（問）' },
  'streak.how.title': { vi: 'Chuỗi ngày tính thế nào?', ja: '連続記録のしくみ' },
  'streak.how.body': {
    vi: 'Mỗi câu bạn trả lời xong — đúng hay sai, ở bất kỳ bài nào: từ vựng, ngữ pháp, kanji, ôn tập — đều được đếm. Đủ {goal} câu trong ngày là giữ được chuỗi. Hôm nay chưa học thì chuỗi vẫn còn tới hết ngày; bỏ trọn một ngày thì chuỗi về 0, nhưng kỷ lục vẫn được giữ. Đổi mục tiêu chỉ áp dụng từ hôm nay.',
    ja: '答え終えた問題は、正解・不正解を問わず、どのレッスン（単語・文法・漢字・復習）でも数えられます。1日{goal}問に達すると連続記録が続きます。今日まだ学習していなくても、その日のうちなら記録は途切れません。丸一日休むと0に戻りますが、最長記録は残ります。目標の変更は今日から適用されます。',
  },
  'streak.chip': { vi: 'Chuỗi {count} ngày · hôm nay {answered}/{goal} câu', ja: '{count}日連続・今日 {answered}/{goal}問' },
  // ── Kế hoạch hôm nay ───────────────────────────────────────────────────
  'plan.title': { vi: 'Kế hoạch hôm nay', ja: '今日のプラン' },
  'plan.goal': { vi: 'Trả lời {goal} câu', ja: '{goal}問に答える' },
  'plan.goal.detail': { vi: 'Đã làm {answered} câu', ja: '{answered}問 解答済み' },
  'plan.review': { vi: 'Ôn {count} mục đến hạn', ja: '期限の{count}項目を復習' },
  'plan.review.done': { vi: 'Đã ôn hết mục đến hạn', ja: '期限の項目はすべて復習済み' },
  'plan.n3': { vi: 'Tích {count} buổi lộ trình N3', ja: 'N3ロードマップを{count}単位' },
  'plan.n3.detail': { vi: 'Hôm nay đã tích {done} buổi', ja: '今日 {done}単位 完了' },
  'plan.allDone': { vi: 'Xong kế hoạch hôm nay — hẹn gặp lại ngày mai! 🎉', ja: '今日のプラン完了！また明日 🎉' },
  'plan.go.learn': { vi: 'Học tiếp', ja: '続きを学ぶ' },
  'plan.go.review': { vi: 'Ôn ngay', ja: '今すぐ復習' },
  'plan.go.n3': { vi: 'Mở lộ trình', ja: 'ロードマップへ' },
} as const satisfies Record<string, Entry>;
