/** Trang tiến độ N3. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const N3_MESSAGES = {
  'n3.title': { vi: 'Tiến độ thi N3', ja: 'N3 合格までの進捗' },
  'n3.subtitle': {
    vi: 'Một lộ trình duy nhất từ 皆の日本語 N5–N4 sang 日本語総まとめ N3. Tích từng buổi học đã xong, phần trăm và nhịp học mỗi ngày tự tính lại.',
    ja: '皆の日本語 N5・N4 から 日本語総まとめ N3 への唯一の学習ルート。終えた学習単位にチェックを入れると、進捗率と1日のノルマが自動で計算されます。',
  },
  // Vòng phần trăm và các con số cạnh nó
  'n3.ring.label': { vi: 'Mức chuẩn bị', ja: '準備度' },
  // Bốn dòng số dưới vòng tròn. Tên cột ngắn để cả nhãn lẫn giá trị nằm gọn một
  // dòng ở thẻ hẹp nhất (280px) — dài hơn là bị cắt chữ.
  'n3.ring.statPoints': { vi: 'Điểm quy đổi', ja: '換算点' },
  'n3.ring.statUnits': { vi: 'Buổi đã học', ja: '学習単位' },
  'n3.ring.statCeiling': { vi: 'Trần vì thiếu sách', ja: '教材不足の上限' },
  'n3.ring.statRecent': { vi: '7 ngày qua', ja: '直近7日' },
  // Đếm ngược và nhịp học
  'n3.pace.title': { vi: 'Nhịp học bắt buộc', ja: '必要な学習ペース' },
  'n3.pace.daysLeft': { vi: 'ngày tới hôm thi', ja: '試験日までの日数' },
  'n3.pace.studyDaysLeft': { vi: 'ngày còn được nạp bài mới', ja: '新規学習できる日数' },
  'n3.pace.remaining': { vi: 'buổi có hẹn còn lại', ja: '期限つきの残り単位' },
  'n3.pace.openRemaining': {
    vi: 'Ngoài ra còn {count} buổi trong phạm vi tính điểm nhưng không hẹn ngày (ôn tuỳ sức)',
    ja: 'このほか、得点対象だが期限を設けていない単位が{count}件あります（任意復習）',
  },
  'n3.pace.perDay': { vi: 'buổi / ngày', ja: '単位 / 日' },
  'n3.pace.perDayNote': {
    vi: 'Chia số buổi còn lại cho số ngày còn được nạp bài mới (tới {date}), không chia tới hôm thi — ba tuần cuối để luyện đề.',
    ja: '残り単位を、新規学習ができる日数（{date} まで）で割った値です。試験日までで割らないのは、最後の3週間を実戦問題に充てるためです。',
  },
  'n3.pace.planned': { vi: 'Kế hoạch hôm nay: {count} buổi', ja: '本日の予定: {count}単位' },
  'n3.pace.finish': { vi: 'Giữ nhịp này thì xong ngày {date}', ja: 'このペースなら {date} に完了' },
  'n3.pace.dueToday': {
    vi: 'Đến hôm nay đáng ra xong {due} buổi, thực tế {done}',
    ja: '本日までの予定 {due} 単位に対し、実績 {done} 単位',
  },
  'n3.pace.state.ahead': { vi: 'Vượt kế hoạch {count} buổi', ja: '予定より {count}単位先行' },
  'n3.pace.state.onTrack': { vi: 'Đúng kế hoạch', ja: '予定どおり' },
  'n3.pace.state.behind': { vi: 'Chậm {count} buổi', ja: '予定より {count}単位遅れ' },
  'n3.pace.state.unreachable': {
    vi: 'Quá {ceiling} buổi/ngày — không kịp',
    ja: '1日{ceiling}単位超 — 間に合いません',
  },
  'n3.pace.state.finished': { vi: 'Đã xong toàn bộ phạm vi', ja: '対象範囲すべて完了' },
  'n3.pace.state.examToday': { vi: 'Hôm nay là ngày thi', ja: '本日が試験日です' },
  'n3.pace.state.overdue': { vi: 'Đã qua ngày thi', ja: '試験日を過ぎています' },
  // Cảnh báo phạm vi
  'n3.scope.choukai': { vi: 'Tính cả phần 聴解 vào phần trăm', ja: '聴解を進捗率に含める' },
  'n3.scope.warning.title': { vi: 'Con số này chưa tính phần nghe', ja: 'この数値は聴解を含みません' },
  'n3.scope.warning.text': {
    vi: 'Phần 聴解 chiếm 60/180 điểm và CÓ điểm chuẩn riêng: thiếu điểm chuẩn ở một khối là trượt, dù tổng điểm cao. Lần này chưa xây phần luyện nghe trong app — sách 総まとめ N3 聴解 đã có trong máy, phải tự học bằng sách.',
    ja: '聴解は 180 点中 60 点を占め、区分別基準点があります。1区分でも基準点に届かなければ、総合得点が高くても不合格です。今回はアプリに聴解練習を実装していません。総まとめ N3 聴解はお手元にあるので、書籍で学習してください。',
  },
  'n3.scope.gap.title': { vi: 'Thiếu sách ngữ pháp N3', ja: 'N3 文法の教材が不足' },
  'n3.scope.gap.text': {
    vi: 'Trong máy không có quyển 日本語総まとめ N3 文法. Trụ ngữ pháp hiện chỉ có phần nền N4 của 皆の日本語, nên trần tiến độ của nó bị chặn. Có sách thì gửi vào thư mục giáo trình, tôi nạp thành bài học.',
    ja: '日本語総まとめ N3 文法がお手元にありません。文法の柱は現在 皆の日本語 の N4 部分のみで、進捗の上限が抑えられています。書籍が手に入りしだい教材フォルダに入れてください。レッスン化します。',
  },
  // Trụ nội dung
  'n3.pillar.foundation': { vi: 'Nền N5–N4', ja: 'N5・N4 の土台' },
  'n3.pillar.foundation.desc': {
    vi: 'Không nằm trong đề nhưng đề vẫn hỏi: đề N3 dùng lại từ và mẫu câu của N5–N4. Đây là cửa vào — cần xong {gate}% phần nền CÓ HẸN NGÀY trước khi mở 総まとめ. Riêng 25 bài từ vựng N5 là ôn tuỳ sức, không hẹn ngày.',
    ja: '試験区分ではありませんが出題されます。N3 の問題は N5・N4 の語彙と文型を前提とします。これは入口です — 総まとめに入る前に、期日つきの土台を {gate}% 終えてください。N5 の語彙25課だけは期日なしの任意復習です。',
  },
  'n3.pillar.moji': { vi: '文字 · Chữ Hán', ja: '文字（漢字）' },
  'n3.pillar.moji.desc': {
    vi: 'Đề hỏi hai dạng: 漢字読み (8 câu, đọc chữ Hán) và 表記 (6 câu, chọn cách viết bằng chữ Hán).',
    ja: '出題は2種類: 漢字読み（8問）と表記（6問）。',
  },
  'n3.pillar.goi': { vi: '語彙 · Từ vựng', ja: '語彙' },
  'n3.pillar.goi.desc': {
    vi: 'Đề hỏi ba dạng: 文脈規定 (11 câu, chọn từ theo ngữ cảnh), 言い換え類義 (5 câu, từ đồng nghĩa), 用法 (5 câu, cách dùng).',
    ja: '出題は3種類: 文脈規定（11問）、言い換え類義（5問）、用法（5問）。',
  },
  'n3.pillar.bunpou': { vi: '文法 · Ngữ pháp', ja: '文法' },
  'n3.pillar.bunpou.desc': {
    vi: 'Chưa có sách 総まとめ N3 文法 trong máy. Đang đứng trên nền ngữ pháp N4 của 皆の日本語 (24 bài, 93 mẫu) đã có sẵn trong app.',
    ja: '総まとめ N3 文法が未入手です。現状はアプリ内の 皆の日本語 N4 文法（24課・93文型）が土台です。',
  },
  'n3.pillar.dokkai': { vi: '読解 · Đọc hiểu', ja: '読解' },
  'n3.pillar.dokkai.desc': {
    vi: 'Một khối điểm riêng, 60 điểm. Đề hỏi 内容理解 đoạn ngắn 150–200 chữ (4 câu), đoạn vừa 350 chữ (6 câu), đoạn dài 550 chữ (4 câu), và 情報検索 600 chữ (2 câu).',
    ja: '独立した得点区分で 60 点。内容理解（短文 150〜200 字・4問／中文 350 字・6問／長文 550 字・4問）と情報検索（600 字・2問）。',
  },
  'n3.pillar.choukai': { vi: '聴解 · Nghe hiểu', ja: '聴解' },
  'n3.pillar.choukai.desc': {
    vi: 'Một khối điểm riêng, 60 điểm. Đề hỏi 課題理解 (6), ポイント理解 (6), 概要理解 (3), 発話表現 (4), 即時応答 (9). Lần này chưa xây trong app.',
    ja: '独立した得点区分で 60 点。課題理解（6）、ポイント理解（6）、概要理解（3）、発話表現（4）、即時応答（9）。今回はアプリ未実装です。',
  },
  'n3.gate.open': { vi: 'Nền đã đủ để vào N3', ja: '土台クリア — N3 に進めます' },
  'n3.gate.closed': {
    vi: 'Còn {count} buổi nền phải xong trước',
    ja: '土台があと {count}単位必要',
  },
  'n3.pillar.points': { vi: '{points} điểm', ja: '{points}点' },
  'n3.pillar.book': { vi: 'Sách: {book}', ja: '教材: {book}' },
  'n3.pillar.blocked': { vi: 'trần {percent}%', ja: '上限 {percent}%' },
  // Khối điểm của đề
  'n3.block.chishiki': { vi: '言語知識（文字・語彙・文法）', ja: '言語知識（文字・語彙・文法）' },
  'n3.block.dokkai': { vi: '読解', ja: '読解' },
  'n3.block.choukai': { vi: '聴解', ja: '聴解' },
  'n3.block.title': { vi: 'Ba khối điểm của đề', ja: '3つの得点区分' },
  'n3.block.note': {
    vi: 'Mỗi khối 0–60 điểm và có điểm chuẩn RIÊNG. Thiếu điểm chuẩn ở một khối là trượt dù tổng điểm cao — nguồn: trang 6 của cả bốn quyển 総まとめ N3.',
    ja: '各区分 0〜60 点、区分別基準点あり。1区分でも基準点に届かなければ総合得点が高くても不合格 — 出典: 総まとめ N3 全4冊の 6 ページ。',
  },
  // Giai đoạn
  'n3.phase.title': { vi: 'Bốn giai đoạn tới ngày thi', ja: '試験日までの4段階' },
  'n3.phase.range': { vi: '{from} → {to} · {days} ngày', ja: '{from} → {to}・{days}日' },
  'n3.phase.current': { vi: 'Đang ở đây', ja: '現在ここ' },
  'n3.phase.done': { vi: 'Đã qua', ja: '終了' },
  'n3.phase.p1': { vi: 'Vá nền', ja: '土台固め' },
  'n3.phase.p1.goal': {
    vi: 'Ba tuần đóng lỗ hổng N5–N4 trước khi mở sách N3, để không phải vừa học N3 vừa tra lại thứ đã học. 25 bài từ vựng N5 không có ngày hẹn — ôn khi có thời gian.',
    ja: 'N3 の教材を開く前の3週間で N5・N4 の穴を埋め、N3 学習中に既習事項を調べ直さずに済む状態にします。N5 の語彙25課には期日を設けていません — 時間のあるときに復習してください。',
  },
  'n3.phase.p1.routine': {
    vi: 'Mỗi ngày khoảng 3 buổi, tổng 60–75 phút: 1–2 bài từ vựng 皆の日本語 26–50 (luyện thẳng trong app, KHÔNG đọc lại sách) + 1 bài ngữ pháp 26–50. Xong trước phần luyện Kanji N5/N4, bộ thủ và chia động từ — đó là phần đỡ nhiều nhất cho việc đọc sách N3.',
    ja: '毎日およそ3単位・合計60〜75分: 皆の日本語 26〜50課の語彙を1〜2課（教材は読み返さずアプリで直接練習）＋ 文法を1課。まず漢字 N5・N4、部首、動詞活用の練習を先に終える — N3 の教材を読むのに最も効くのはここです。',
  },
  'n3.phase.p2': { vi: 'Nạp N3', ja: 'N3 インプット' },
  'n3.phase.p2.goal': {
    vi: 'Đi hết ba quyển 漢字 · 語彙 · 読解 (126 buổi sách + 3 phần luyện trong app), trộn đều mỗi ngày một ít của cả ba. Trộn đều là để nếu có trượt tiến độ thì mỏng đều cả ba khối điểm, chứ không mất trắng khối 読解.',
    ja: '漢字・語彙・読解の3冊（教材126単位＋アプリ練習3単位）を完走します。毎日3冊を少しずつ混ぜるのは、遅れが出たときに3つの得点区分へ薄く分散させ、読解だけが丸ごと未着手になるのを防ぐためです。',
  },
  'n3.phase.p2.routine': {
    vi: 'Mỗi ngày 2–3 buổi, xoay vòng 漢字 → 語彙 → 読解 để ngày nào cũng chạm cả ba quyển. Mỗi buổi: đọc sách 25 phút rồi luyện lại trong app 10 phút. Gặp buổi 実戦問題 thì bấm giờ và làm một lượt không tra sách.',
    ja: '毎日2〜3単位、漢字 → 語彙 → 読解 と巡回し、毎日3冊すべてに触れます。1単位あたり教材25分＋アプリで復習10分。実戦問題の日は時間を計り、教材を見ずに一度で解きます。',
  },
  'n3.phase.p3': { vi: 'Luyện đề', ja: '実戦演習' },
  'n3.phase.p3.goal': {
    vi: 'Không bài mới. Làm lại toàn bộ 18 bài 実戦問題 trong điều kiện bấm giờ, và vá đúng những chỗ làm sai.',
    ja: '新規学習なし。実戦問題18回分を時間を計って解き直し、間違えた箇所だけを埋めます。',
  },
  'n3.phase.p3.routine': {
    vi: 'Mỗi ngày: 1 bài 実戦問題 bấm giờ + ôn hết ★ của phần vừa làm sai. Mỗi Chủ nhật: một đề mô phỏng đủ ba khối, đúng giờ thi thật (30 + 70 + 40 phút).',
    ja: '毎日: 実戦問題を1回、時間を計って解き、間違えた範囲の★をすべて復習。日曜: 3区分そろえた模擬試験を本番と同じ時間配分（30＋70＋40分）で。',
  },
  'n3.phase.p4': { vi: 'Nước rút', ja: '直前' },
  'n3.phase.p4.goal': {
    vi: 'Không nạp gì mới. Chỉ ôn ★ và ngủ đủ — chữ học sát ngày thi làm loãng đúng phần vừa mới nhớ được.',
    ja: '新規インプットなし。★の復習と十分な睡眠だけ。直前の新規暗記は、せっかく定着しかけた内容を薄めます。',
  },
  'n3.phase.p4.routine': {
    vi: 'Mỗi ngày: ôn ★ toàn bộ ba khối, mỗi khối 30 phút. Không mở bài mới, không thức khuya.',
    ja: '毎日: 3区分の★を各30分ずつ復習。新しい単元は開かない、夜更かししない。',
  },
  // Bảng danh sách buổi học
  'n3.pillar.sectionTitle': { vi: 'Sáu trụ nội dung', ja: '6つの学習の柱' },
  'n3.list.title': { vi: 'Bảng kiểm soát từng buổi học', ja: '学習単位チェックリスト' },
  'n3.list.filter.all': { vi: 'Tất cả', ja: 'すべて' },
  'n3.list.filter.todo': { vi: 'Chưa học', ja: '未学習' },
  'n3.list.filter.done': { vi: 'Đã học', ja: '学習済み' },
  'n3.list.filter.due': { vi: 'Đến hạn', ja: '期限到来' },
  'n3.list.due': { vi: 'Hẹn {date}', ja: '予定 {date}' },
  'n3.list.doneOn': { vi: 'Xong {date}', ja: '{date} 完了' },
  'n3.list.page': { vi: 'tr. {page}', ja: 'p.{page}' },
  'n3.list.open': { vi: 'Mở bài trong app', ja: 'アプリで開く' },
  'n3.list.blockDone': { vi: '{done}/{total}', ja: '{done}/{total}' },
  'n3.list.tickBlock': { vi: 'Tích cả nhóm', ja: 'まとめてチェック' },
  'n3.list.untickBlock': { vi: 'Bỏ tích cả nhóm', ja: 'まとめて解除' },
  // Nhãn cho trình đọc màn hình: trên trang có 36 nút "Tích cả nhóm" giống hệt
  // nhau, nghe rời khỏi ngữ cảnh thì không nút nào phân biệt được với nút nào.
  'n3.list.tickBlockOf': { vi: 'Tích cả nhóm {block}', ja: '{block}をまとめてチェック' },
  'n3.list.untickBlockOf': { vi: 'Bỏ tích cả nhóm {block}', ja: '{block}のチェックをまとめて解除' },
  'n3.list.empty': { vi: 'Không có buổi học nào khớp bộ lọc', ja: '条件に一致する学習単位はありません' },
  'n3.list.emptyAllDone': { vi: 'Không còn buổi nào phải học', ja: '未学習の単位はありません' },
  'n3.list.emptyReset': { vi: 'Xem tất cả', ja: 'すべて表示' },
  'n3.list.test': { vi: 'Kiểm tra', ja: 'テスト' },
  'n3.list.overdue': { vi: 'Trễ hẹn {date}', ja: '期限超過 {date}' },
  'n3.list.reset': { vi: 'Xoá toàn bộ dấu đã học', ja: 'チェックをすべて消す' },
  'n3.list.resetConfirm': {
    vi: 'Xoá dấu "đã học" của toàn bộ {count} buổi? Không lấy lại được.',
    ja: '{count}単位すべての学習済みチェックを消しますか。元に戻せません。',
  },
  // Nguồn của từng buổi
  'n3.persistFailed.title': { vi: 'Không lưu được dấu đã học', ja: 'チェックを保存できません' },
  'n3.persistFailed.text': {
    vi: 'Trình duyệt đang chặn bộ lưu trữ cục bộ (chế độ ẩn danh, hết dung lượng, hoặc cookie bị tắt). Dấu tích vẫn hiện trong phiên này nhưng sẽ mất khi tải lại trang.',
    ja: 'ブラウザがローカルストレージを拒否しています（プライベートモード、容量不足、Cookie 無効など）。チェックはこのセッション中だけ表示され、再読み込みで失われます。',
  },
  'n3.source.app': { vi: 'Có bài trong app', ja: 'アプリ内教材あり' },
  'n3.source.book': { vi: 'Học bằng sách', ja: '書籍で学習' },
  'n3.source.none': { vi: 'Chưa có nguồn', ja: '教材なし' },
  'n3.source.deferred': { vi: 'Hoãn lần này', ja: '今回は対象外' },
} as const satisfies Record<string, Entry>;
