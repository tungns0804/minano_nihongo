/** Trang Hôm nay — trang mở đầu của ứng dụng. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const TODAY_MESSAGES = {
  'today.title': { vi: 'Hôm nay học gì?', ja: '今日は何を学ぶ？' },
  'today.subtitle': {
    vi: 'Ôn những mục đến hạn trước, rồi học tiếp bài đang dở.',
    ja: '期限の来た項目を先に復習し、それから続きを学びましょう。',
  },
  'today.review.title': { vi: 'Ôn tập', ja: '復習' },
  'today.review.due': { vi: '{count} mục đến hạn hôm nay', ja: '今日期限の項目 {count}件' },
  'today.review.none': { vi: 'Không có mục nào đến hạn.', ja: '期限の来た項目はありません。' },
  'today.review.noneHint': {
    vi: 'Mỗi câu bạn trả lời khi luyện đều vào lịch ôn — học bài mới là có cái để ôn.',
    ja: '練習で答えた問題はすべて復習の予定に入ります。新しいレッスンを学べば復習する項目ができます。',
  },
  'today.review.mistakes': { vi: '{count} lỗi sai đang chờ xem lại', ja: '見直し待ちの間違い {count}件' },
  'today.review.start': { vi: 'Ôn ngay', ja: '今すぐ復習' },
  'today.review.open': { vi: 'Mở trang ôn tập', ja: '復習ページを開く' },
  'today.continue.title': { vi: 'Học tiếp', ja: '続きから' },
  'today.continue.empty': {
    vi: 'Chưa mở bài nào gần đây. Chọn một bài để bắt đầu.',
    ja: '最近開いたレッスンはありません。レッスンを選んで始めましょう。',
  },
  'today.continue.pick': { vi: 'Chọn bài từ vựng', ja: '単語のレッスンを選ぶ' },
  'today.n3.percent': { vi: 'đã chuẩn bị cho kỳ thi', ja: '試験準備の進み具合' },
  'today.n3.daysLeft': { vi: 'Còn {days} ngày tới kỳ thi', ja: '試験まであと{days}日' },
  'today.n3.perDay': { vi: 'Cần {count} buổi mỗi ngày để kịp', ja: '間に合うには1日{count}単位' },
  'today.n3.open': { vi: 'Xem lộ trình', ja: 'ロードマップを見る' },
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
} as const satisfies Record<string, Entry>;
