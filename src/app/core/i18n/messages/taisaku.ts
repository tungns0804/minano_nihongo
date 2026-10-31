/** Bài "Đề luyện N4 · 直前対策" (core/exercises/taisaku-n4.ts). Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const TAISAKU_MESSAGES = {
  'taisaku.name': { vi: 'Đề luyện N4 · 直前対策', ja: 'N4 直前対策' },
  'taisaku.desc': {
    vi: 'Toàn bộ bài tập của sách 「日本語能力試験 直前対策 N4 文字・語彙・文法」: 10 đề từ vựng, 10 đề ngữ pháp và 16 chủ đề từ vựng trọng tâm. Luyện riêng từng dạng câu, từng đề — hoặc làm cả đề theo đúng thứ tự như thi thật.',
    ja: '「日本語能力試験 直前対策 N4 文字・語彙・文法」の練習問題すべて：文字・語彙の模擬テスト10回、文法の模擬テスト10回、重要語彙16テーマ。問題の種類ごと・回ごとに練習でき、本番と同じ順番で1回分を通して解くこともできます。',
  },
  'taisaku.questionCount': { vi: '{count} câu đề thi', ja: '模擬問題{count}問' },
  'taisaku.wordCount': { vi: '{count} từ trọng tâm', ja: '重要語彙{count}語' },

  // ── Phần, đề, dạng ──────────────────────────────────────────────────────
  'taisaku.part': { vi: 'Phần', ja: '分野' },
  'taisaku.part.moji': { vi: 'Từ vựng · 文字・語彙', ja: '文字・語彙' },
  'taisaku.part.bunpo': { vi: 'Ngữ pháp · 文法', ja: '文法' },
  'taisaku.part.furoku': { vi: 'Từ vựng trọng tâm · 付録', ja: '付録・重要語彙' },
  'taisaku.part.moji.desc': {
    vi: '10 đề, mỗi đề 34 câu chia 5 dạng: đọc chữ Hán, viết chữ Hán, điền từ, câu đồng nghĩa và cách dùng từ.',
    ja: '全10回・各34問。漢字の読み・表記・文脈規定・言い換え類義・用法の5種類。',
  },
  'taisaku.part.bunpo.desc': {
    vi: '10 đề, mỗi đề 25 câu: chọn ngữ pháp điền chỗ trống, sắp xếp câu (★) và điền vào đoạn văn.',
    ja: '全10回・各25問。文の文法1（選択）・文の文法2（並べ替え★）・文章の文法。',
  },
  'taisaku.part.furoku.desc': {
    vi: '16 chủ đề từ vựng N4 kèm bài tập của sách. Bài nhìn tranh (chủ đề 1–7) không đưa vào; từ của các chủ đề đó luyện ở hai chiều Nhật ↔ Việt.',
    ja: 'N4重要語彙16テーマと本の練習問題。絵を見る問題（テーマ1〜7）は収録していません。その語彙は日↔越の2方向で練習できます。',
  },
  'taisaku.sets.tests': { vi: 'Đề (chọn nhiều được)', ja: '回（複数選択可）' },
  'taisaku.sets.topics': { vi: 'Chủ đề (chọn nhiều được)', ja: 'テーマ（複数選択可）' },
  'taisaku.sets.all': { vi: 'Chọn tất cả', ja: 'すべて選択' },
  'taisaku.sets.hint': {
    vi: 'Luyện riêng một đề hoặc gộp nhiều đề. Số bên cạnh là số câu của dạng đang chọn.',
    ja: '1回分だけでも、複数回まとめてでも練習できます。数字は選んだ種類の問題数です。',
  },
  'taisaku.sets.emptyTopic': {
    vi: 'Chủ đề này chỉ có bài nhìn tranh, không có bài tập chữ',
    ja: 'このテーマは絵を見る問題だけです',
  },
  'taisaku.set.test': { vi: 'Đề {no}', ja: '第{no}回' },
  'taisaku.mode': { vi: 'Dạng bài', ja: '問題の種類' },

  'taisaku.mode.kanjiReading': { vi: 'もんだい1 · Đọc chữ Hán', ja: 'もんだい1・漢字読み' },
  'taisaku.mode.kanjiReading.short': { vi: 'Đọc chữ Hán', ja: '漢字読み' },
  'taisaku.mode.kanjiReading.example': { vi: '〈森〉→ もり', ja: '〈森〉→ もり' },
  'taisaku.mode.kanjiWriting': { vi: 'もんだい2 · Viết chữ Hán', ja: 'もんだい2・表記' },
  'taisaku.mode.kanjiWriting.short': { vi: 'Viết chữ Hán', ja: '表記' },
  'taisaku.mode.kanjiWriting.example': { vi: '〈かるい〉→ 軽い', ja: '〈かるい〉→ 軽い' },
  'taisaku.mode.context': { vi: 'もんだい3 · Điền từ hợp ngữ cảnh', ja: 'もんだい3・文脈規定' },
  'taisaku.mode.context.short': { vi: 'Điền từ', ja: '文脈規定' },
  'taisaku.mode.context.example': { vi: 'ベルが（　）います → なって', ja: 'ベルが（　）います → なって' },
  'taisaku.mode.paraphrase': { vi: 'もんだい4 · Câu đồng nghĩa', ja: 'もんだい4・言い換え類義' },
  'taisaku.mode.paraphrase.short': { vi: 'Câu đồng nghĩa', ja: '言い換え' },
  'taisaku.mode.paraphrase.example': { vi: 'よごれて います ≈ きたなく なりました', ja: 'よごれて います ≈ きたなく なりました' },
  'taisaku.mode.usage': { vi: 'もんだい5 · Cách dùng từ', ja: 'もんだい5・用法' },
  'taisaku.mode.usage.short': { vi: 'Cách dùng từ', ja: '用法' },
  'taisaku.mode.usage.example': { vi: 'しんぱい → câu nào dùng đúng?', ja: 'しんぱい → 正しい使い方は？' },
  'taisaku.mode.mojiTest': { vi: 'Cả đề (thi thử 34 câu)', ja: '1回分を通して（34問）' },
  'taisaku.mode.mojiTest.short': { vi: 'Cả đề từ vựng', ja: '文字・語彙1回分' },
  'taisaku.mode.mojiTest.example': { vi: 'もんだい1 → 5, đúng thứ tự sách', ja: 'もんだい1→5、本の順番どおり' },
  'taisaku.mode.grammar': { vi: 'もんだい1 · Chọn ngữ pháp', ja: 'もんだい1・文の文法1' },
  'taisaku.mode.grammar.short': { vi: 'Chọn ngữ pháp', ja: '文の文法1' },
  'taisaku.mode.grammar.example': { vi: '電車（　）学校へ来る → で', ja: '電車（　）学校へ来る → で' },
  'taisaku.mode.star': { vi: 'もんだい2 · Mảnh ở chỗ ★', ja: 'もんだい2・並べ替え★' },
  'taisaku.mode.star.short': { vi: 'Chỗ ★', ja: '並べ替え★' },
  'taisaku.mode.star.example': { vi: '＿ ＿ ★ ＿ → chọn mảnh ở ô ★', ja: '＿ ＿ ★ ＿ → ★に入るもの' },
  'taisaku.mode.order': { vi: 'もんだい2 · Xếp cả câu', ja: 'もんだい2・全部並べ替え' },
  'taisaku.mode.order.short': { vi: 'Xếp cả câu', ja: '全部並べ替え' },
  'taisaku.mode.order.example': { vi: 'Bấm bốn mảnh theo đúng thứ tự', ja: '4つを正しい順に押す' },
  'taisaku.mode.passage': { vi: 'もんだい3 · Điền vào đoạn văn', ja: 'もんだい3・文章の文法' },
  'taisaku.mode.passage.short': { vi: 'Đoạn văn', ja: '文章の文法' },
  'taisaku.mode.passage.example': { vi: 'Bài văn 5 chỗ trống 21 → 25', ja: '作文の空欄21〜25' },
  'taisaku.mode.bunpoTest': { vi: 'Cả đề (thi thử 25 câu)', ja: '1回分を通して（25問）' },
  'taisaku.mode.bunpoTest.short': { vi: 'Cả đề ngữ pháp', ja: '文法1回分' },
  'taisaku.mode.bunpoTest.example': { vi: 'もんだい1 → 3, đúng thứ tự sách', ja: 'もんだい1→3、本の順番どおり' },
  'taisaku.mode.wordMeaning': { vi: 'Nhật → Việt', ja: '日本語 → 意味' },
  'taisaku.mode.wordMeaning.short': { vi: 'Từ → Nghĩa', ja: '語 → 意味' },
  'taisaku.mode.wordMeaning.example': { vi: '首 → cổ', ja: '首 → cổ' },
  'taisaku.mode.meaningWord': { vi: 'Việt → Nhật', ja: '意味 → 日本語' },
  'taisaku.mode.meaningWord.short': { vi: 'Nghĩa → Từ', ja: '意味 → 語' },
  'taisaku.mode.meaningWord.example': { vi: 'cổ → 首', ja: 'cổ → 首' },
  'taisaku.mode.book': { vi: 'Bài tập trong sách', ja: '本の練習問題' },
  'taisaku.mode.book.short': { vi: 'Bài tập sách', ja: '本の練習' },
  'taisaku.mode.book.example': { vi: 'Điền từ trong khung, chọn [a・b]', ja: '枠から選ぶ・[a・b]から選ぶ' },

  // ── Tuỳ chọn ────────────────────────────────────────────────────────────
  'taisaku.option.furigana': { vi: 'Hiện furigana', ja: 'ふりがなを表示' },
  'taisaku.option.furiganaHint': {
    vi: 'Như sách in. Tắt đi để tự đọc chữ Hán trong câu.',
    ja: '本と同じ表示。消すと文中の漢字を自分で読む練習になります。',
  },
  'taisaku.option.example': { vi: 'Hiện câu ví dụ làm gợi ý', ja: '例文をヒントに表示' },
  'taisaku.option.exampleHint': {
    vi: 'Chỉ ở dạng Nhật → Việt, với từ có câu ví dụ (phó từ, liên từ).',
    ja: '日本語→意味の形式で、例文のある語（副詞・接続詞）のみ。',
  },
  'taisaku.answerNote': {
    vi: 'Mọi câu là trắc nghiệm như đề thi, lựa chọn giữ đúng thứ tự trong sách.',
    ja: 'すべて本番と同じ選択式で、選択肢の順番も本のとおりです。',
  },
  'taisaku.orderNote': {
    vi: 'Bấm bốn mảnh theo đúng thứ tự để ghép thành câu.',
    ja: '4つのかけらを正しい順に押して文を作ります。',
  },
  'taisaku.testNote': {
    vi: 'Dạng "cả đề" đi đúng thứ tự sách và không trộn câu, như ngồi làm một đề thi.',
    ja: '「1回分を通して」は本の順番どおりで、問題を混ぜません。',
  },

  // ── Xem đề ──────────────────────────────────────────────────────────────
  'taisaku.view': { vi: 'Xem đề', ja: '問題を見る' },
  'taisaku.view.words': { vi: 'Bảng từ', ja: '語彙リスト' },
  'taisaku.view.book': { vi: 'Bài tập trong sách', ja: '本の練習問題' },
  'taisaku.view.showAnswers': { vi: 'Hiện đáp án', ja: '答えを表示' },
  'taisaku.view.empty': { vi: 'Chưa chọn đề / chủ đề nào có câu thuộc dạng này.', ja: 'この種類の問題がある回・テーマが選ばれていません。' },
  'taisaku.view.answer': { vi: 'Đáp án', ja: '答え' },
  'taisaku.topic': { vi: 'Chủ đề {no}', ja: 'テーマ{no}' },
  'taisaku.instr.kanjiReading': {
    vi: 'もんだい1 — Từ gạch chân đọc thế nào?',
    ja: 'もんだい1　＿＿の ことばは ひらがなで どう かきますか。',
  },
  'taisaku.instr.kanjiWriting': {
    vi: 'もんだい2 — Từ gạch chân viết bằng chữ Hán thế nào?',
    ja: 'もんだい2　＿＿の ことばは どう かきますか。',
  },
  'taisaku.instr.context': {
    vi: 'もんだい3 — Từ nào điền vào （　）?',
    ja: 'もんだい3　（　）に なにを いれますか。',
  },
  'taisaku.instr.paraphrase': {
    vi: 'もんだい4 — Câu nào gần nghĩa nhất với câu gạch chân?',
    ja: 'もんだい4　＿＿の ぶんと だいたい おなじ いみの ぶんが あります。',
  },
  'taisaku.instr.usage': {
    vi: 'もんだい5 — Câu nào dùng từ này đúng nhất?',
    ja: 'もんだい5　つぎの ことばの つかいかたで いちばん いい ものを えらんで ください。',
  },
  'taisaku.instr.grammar': {
    vi: 'もんだい1 — Chọn đáp án điền vào （　）.',
    ja: 'もんだい1　（　）に 何を 入れますか。',
  },
  'taisaku.instr.star': {
    vi: 'もんだい2 — Mảnh nào nằm ở chỗ ★?',
    ja: 'もんだい2　★ に 入る ものは どれですか。',
  },
  'taisaku.instr.passage': {
    vi: 'もんだい3 — Đọc đoạn văn, chọn đáp án cho chỗ 21 → 25.',
    ja: 'もんだい3　21 から 25 に 何を 入れますか。',
  },
  'taisaku.instr.fill': {
    vi: 'Chọn từ trong khung điền vào （　）. Mỗi từ dùng một lần.',
    ja: '（　）に 入る いちばん いい ことばを えらんで ください。',
  },
  'taisaku.instr.pick': {
    vi: 'Chọn từ đúng trong [　] cho câu.',
    ja: '[　]の 中から 正しい ほうを えらんで ください。',
  },

  // ── Câu hỏi ─────────────────────────────────────────────────────────────
  'taisaku.label.kanjiReading': { vi: 'Từ gạch chân đọc thế nào?', ja: '下線の言葉の読み方は？' },
  'taisaku.label.kanjiWriting': { vi: 'Từ gạch chân viết thế nào?', ja: '下線の言葉の書き方は？' },
  'taisaku.label.context': { vi: 'Từ nào điền vào （　）?', ja: '（　）に入る言葉は？' },
  'taisaku.label.paraphrase': { vi: 'Câu nào gần nghĩa nhất?', ja: 'だいたい同じ意味の文は？' },
  'taisaku.label.usage': { vi: 'Câu nào dùng từ này đúng nhất?', ja: 'いちばん正しい使い方は？' },
  'taisaku.label.grammar': { vi: 'Chọn đáp án điền vào （　）', ja: '（　）に入るものは？' },
  'taisaku.label.star': { vi: 'Mảnh nào nằm ở chỗ ★?', ja: '★に入るものは？' },
  'taisaku.label.order': { vi: 'Xếp bốn mảnh thành câu đúng', ja: '4つを正しい順に並べる' },
  'taisaku.label.passage': { vi: 'Điền vào chỗ trống của đoạn văn', ja: '文章の空欄に入るものは？' },
  'taisaku.label.fill': { vi: 'Từ nào trong khung điền vào （　）?', ja: '枠の中から（　）に入る言葉は？' },
  'taisaku.label.pick': { vi: 'Chọn từ đúng cho câu', ja: '正しいほうを選ぶ' },
  'taisaku.label.wordMeaning': { vi: 'Từ này nghĩa là gì?', ja: 'この言葉の意味は？' },
  'taisaku.label.meaningWord': { vi: 'Tiếng Nhật nói thế nào?', ja: '日本語で言うと？' },
  'taisaku.label.sonkei': { vi: 'Tôn kính ngữ (尊敬語) của động từ này?', ja: 'この動詞の尊敬語は？' },
  'taisaku.label.kenjou': { vi: 'Khiêm nhường ngữ (謙譲語) của động từ này?', ja: 'この動詞の謙譲語は？' },
  'taisaku.answerPrompt': { vi: 'Chọn đáp án đúng', ja: '正しいものを選ぶ' },
  'taisaku.col.source': { vi: 'Trong sách', ja: '出典' },
  'taisaku.col.word': { vi: 'Từ', ja: '語' },
  'taisaku.col.example': { vi: 'Ví dụ', ja: '例文' },
  'taisaku.col.plain': { vi: 'Động từ', ja: '動詞' },
  'taisaku.col.sonkei': { vi: 'Tôn kính ngữ', ja: '尊敬語' },
  'taisaku.col.kenjou': { vi: 'Khiêm nhường ngữ', ja: '謙譲語' },
} as const satisfies Record<string, Entry>;
