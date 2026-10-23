/** Khu bộ thủ. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const RADICAL_MESSAGES = {
  // 214 bộ thủ Khang Hy, mỗi bộ kèm các chữ Hán ghép từ bộ đó (xem core/radical/).
  'radical.title': { vi: 'Học bộ thủ', ja: '部首を学ぶ' },
  'radical.subtitle': {
    vi: 'Toàn bộ 214 bộ thủ, xếp theo số nét. Mở một bộ để xem những chữ Hán N5→N1 ghép từ bộ đó với các bộ khác, kèm cách chiết tự. Chỉ gõ đáp án, không có trắc nghiệm.',
    ja: '214部首すべてを画数順に。部首を開くと、その部首と他の部首でできているN5〜N1の漢字と、その分解が見られます。解答は入力のみです。',
  },
  'radical.back': { vi: '← Danh sách bộ thủ', ja: '← 部首一覧' },
  'radical.notFound': { vi: 'Không tìm thấy bộ {id}.', ja: '部首 {id} が見つかりません。' },
  'radical.radicalCount': { vi: '{count} bộ', ja: '部首{count}個' },
  'radical.kanjiCount': { vi: '{count} chữ ghép', ja: '漢字{count}字' },
  'radical.strokes': { vi: 'Số nét', ja: '画数' },
  'radical.strokeGroup': { vi: '{group} nét', ja: '{group}画' },
  'radical.strokeCount': { vi: '{count} nét', ja: '{count}画' },
  'radical.variants': {
    vi: 'Dạng viết khác khi nằm trong chữ: {forms}',
    ja: '漢字の中での別の形：{forms}',
  },
  'radical.scope.all': { vi: 'Toàn bộ {group} ({count})', ja: '{group}全体（{count}）' },
  'radical.search': {
    vi: 'Tìm theo bộ, âm Hán Việt, nghĩa hoặc chữ ghép…',
    ja: '部首・漢越音・意味・漢字で検索…',
  },
  'radical.search.allGroups': {
    vi: 'Đang tra cả 214 bộ — kết quả có thể nằm ngoài nhóm nét đang mở.',
    ja: '214部首すべてを検索中 — 表示中の画数グループ以外の部首も出ます。',
  },
  'radical.search.goToGroup': {
    vi: 'Xem nhóm {group}',
    ja: '{group}のグループを見る',
  },
  'radical.searchKanji': {
    vi: 'Tìm theo chữ, âm Hán Việt hoặc chiết tự…',
    ja: '漢字・漢越音・分解で検索…',
  },
  'radical.typingOnly': {
    vi: 'Khu Bộ thủ chỉ có gõ đáp án: bày sẵn bốn âm để chọn thì chỉ còn là nhận mặt bộ, mà cái cần nhớ ở đây là tự đọc ra được.',
    ja: 'この画面は入力解答のみです。4択にすると見比べるだけになり、自分で読める力が身につきません。',
  },
  'radical.practiceHanViet': { vi: 'Luyện âm Hán Việt của bộ thủ', ja: '部首の漢越音を練習' },
  'radical.practiceHanViet.hint': {
    vi: 'Hỏi trên toàn bộ bộ thủ của nhóm nét đang chọn ở trên.',
    ja: '上で選んでいる画数グループの部首すべてから出題します。',
  },
  'radical.practiceKanji': { vi: 'Luyện chữ ghép từ bộ này', ja: 'この部首でできた漢字を練習' },
  'radical.mode.radicalHanViet': { vi: 'Bộ thủ → âm Hán Việt', ja: '部首 → 漢越音' },
  'radical.mode.radicalHanViet.short': { vi: 'Bộ → Hán Việt', ja: '部首 → 漢越音' },
  'radical.mode.radicalHanViet.example': { vi: '氵 → THỦY', ja: '氵 → THỦY' },
  'radical.mode.kanjiHanViet': { vi: 'Chữ ghép → âm Hán Việt', ja: '漢字 → 漢越音' },
  'radical.mode.kanjiHanViet.short': { vi: 'Chữ → Hán Việt', ja: '漢字 → 漢越音' },
  'radical.mode.kanjiHanViet.example': { vi: '休 → HƯU', ja: '休 → HƯU' },
  'radical.mode.kanjiParts': { vi: 'Chữ ghép → các bộ tạo thành', ja: '漢字 → 構成する部首' },
  'radical.mode.kanjiParts.short': { vi: 'Chữ → chiết tự', ja: '漢字 → 分解' },
  'radical.mode.kanjiParts.example': { vi: '休 → NHÂN MỘC', ja: '休 → NHÂN MỘC' },
  'radical.mode.kanjiMixed': { vi: 'Hỏi cả âm Hán Việt lẫn chiết tự', ja: '漢越音と分解の両方' },
  'radical.mode.kanjiMixed.short': { vi: 'Hán Việt + chiết tự', ja: '漢越音＋分解' },
  'radical.mode.kanjiMixed.example': { vi: '休 → HƯU / NHÂN MỘC', ja: '休 → HƯU / NHÂN MỘC' },
  'radical.mode.draw': { vi: 'Âm Hán Việt → viết bộ thủ', ja: '漢越音 → 書く' },
  'radical.mode.draw.short': { vi: 'Viết bộ', ja: '部首の書き取り' },
  'radical.mode.draw.example': { vi: 'THỦY → 氵', ja: 'THỦY → 氵' },
  'radical.practiceDraw': { vi: 'Luyện viết bộ thủ', ja: '部首の書き取り練習' },
  'radical.drawThis': { vi: 'Luyện viết bộ này', ja: 'この部首を書く練習' },
  'radical.drawThis.hint': {
    vi: 'Một câu, hỏi đúng bộ đang mở. Viết xong còn bấm viết lại được bao nhiêu lần tuỳ ý.',
    ja: 'この部首だけを1問出題します。採点後も好きなだけ書き直せます。',
  },
  'radical.drawMissing': {
    vi: '{count} bộ chưa có dữ liệu nét nên không đưa vào phiên viết.',
    ja: '{count}部首は筆順データがないため、書き取りの出題から除きます。',
  },
  'radical.label.radicalHanViet': { vi: 'Bộ này đọc âm Hán Việt là gì?', ja: 'この部首の漢越音は？' },
  'radical.label.draw': { vi: 'Viết bộ thủ có âm Hán Việt này', ja: 'この漢越音の部首を書いてください' },
  'radical.label.kanjiHanViet': { vi: 'Chữ này đọc âm Hán Việt là gì?', ja: 'この漢字の漢越音は？' },
  'radical.label.kanjiParts': {
    vi: 'Chữ này ghép từ những bộ nào? (gõ âm Hán Việt của các bộ)',
    ja: 'この漢字はどの部首でできている？（部首の漢越音を入力）',
  },
  'radical.answerPrompt.hanViet': { vi: 'Nhập âm Hán Việt của bộ', ja: '部首の漢越音を入力' },
  'radical.answerPrompt.parts': {
    vi: 'Nhập âm Hán Việt của các bộ, theo thứ tự viết',
    ja: '書き順どおりに各部首の漢越音を入力',
  },
  'radical.option.showKanjiHint': { vi: 'Gợi ý một chữ ghép từ bộ đó', ja: 'その部首を使う漢字をヒントに' },
  'radical.option.showKanjiHint.desc': {
    vi: 'Bộ đứng một mình gần như không có manh mối; nhìn 休 thì nhớ ra NHÂN dễ hơn nhìn trơ 亻.',
    ja: '部首だけでは手がかりが少なめです。休を見れば、亻だけを見るよりNHÂNを思い出しやすくなります。',
  },
  'radical.option.showHint': { vi: 'Hiện gợi ý dưới câu hỏi', ja: '問題の下にヒントを表示' },
  'radical.option.showHint.desc': {
    vi: 'Hỏi âm Hán Việt thì gợi ý bằng chiết tự, hỏi chiết tự thì gợi ý bằng một từ dùng chữ đó — không chiều nào lộ đáp án.',
    ja: '漢越音を問うときは分解を、分解を問うときはその字を使う単語をヒントにします。どちらも答えは出しません。',
  },
  'radical.col.radical': { vi: 'Bộ thủ', ja: '部首' },
  'radical.col.meaning': { vi: 'Nghĩa của bộ', ja: '部首の意味' },
  'radical.col.japanese': { vi: 'Tên tiếng Nhật', ja: '日本語の名称' },
  'radical.col.strokes': { vi: 'Số nét', ja: '画数' },
  'radical.col.parts': { vi: 'Chiết tự', ja: '分解' },
  'radical.col.partsHanViet': { vi: 'Chiết tự (Hán Việt)', ja: '分解（漢越音）' },
  'radical.col.word': { vi: 'Từ ví dụ', ja: '例語' },
  'radical.col.kanjiExamples': { vi: 'Chữ ghép từ bộ này', ja: 'この部首でできた漢字' },
  'radical.table': { vi: 'Các chữ Hán ghép từ bộ {char}', ja: '部首 {char} でできた漢字' },
  'radical.partsSkipped': {
    vi: 'Có {count} chữ chưa tra đủ âm Hán Việt của các bộ nên không đem ra hỏi ở chiều chiết tự.',
    ja: '{count}字は各部首の漢越音がそろっていないため、分解の出題からは除きます。',
  },
  'radical.noKanjiYet': {
    vi: 'Kho chữ N5→N1 của ứng dụng chưa có chữ nào ghép từ bộ này, nên chưa luyện chữ ở đây được. Bộ vẫn được hỏi ở phần luyện âm Hán Việt ngoài danh sách.',
    ja: 'アプリのN5〜N1の漢字にこの部首でできた字がまだないため、ここでは漢字練習ができません。一覧画面の漢越音練習には出てきます。',
  },
  'radical.emptyPool': {
    vi: 'Chưa có chữ nào trong phạm vi đang chọn.',
    ja: '選択中の範囲に漢字がありません。',
  },
  'radical.dataNote': {
    vi: 'Bảng bộ thủ lấy theo 214 bộ Khang Hy. Các chữ ghép, âm Hán Việt và từ ví dụ rút từ chính kho chữ N5→N1 của khu Kanji, nên hai khu luôn nói cùng một thứ về một chữ.',
    ja: '部首の一覧は康熙字典の214部首に従います。例の漢字・漢越音・例語は漢字コーナーのN5〜N1のデータをそのまま使っています。',
  },
} as const satisfies Record<string, Entry>;
