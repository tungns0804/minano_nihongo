/** Màn hình nạp bài mới. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const IMPORT_MESSAGES = {
  'import.title': { vi: 'Nạp từ vựng của bài tập mới', ja: '新しいレッスンを追加' },
  'import.subtitle': {
    vi: 'Dán danh sách vào đây để dùng ngay trong trình duyệt, hoặc tải file JSON về đặt vào mã nguồn để bài học đi kèm dự án.',
    ja: 'リストを貼り付けてブラウザですぐ使うか、JSONをダウンロードしてソースに含めます。',
  },
  'import.kind': { vi: 'Loại bài học', ja: 'レッスンの種類' },
  'import.format': { vi: 'Định dạng dữ liệu', ja: 'データ形式' },
  'import.format.verb': {
    vi: 'Mỗi dòng một động từ, bốn cột. Cột cuối là nhóm động từ (1, 2 hoặc 3). Các thể còn lại app tự chia, không cần khai báo.',
    ja: '1行1動詞、4列。最後の列はグループ（1・2・3）。他の活用形はアプリが自動生成します。',
  },
  'import.format.verbNote': {
    vi: 'Thêm dấu * sau số nhóm để đánh dấu động từ đặc biệt — nhóm 1 nhưng hình dạng dễ nhầm sang nhóm 2 (帰ります, 入ります, 走ります…). Những động từ này lọc riêng ra luyện được.',
    ja: 'グループ番号の後に * を付けると特殊動詞の印になります — 1グループなのに2グループと紛らわしい形（帰ります・入ります・走ります…）。この動詞だけ絞って練習できます。',
  },
  'import.format.vocabulary': {
    vi: 'Mỗi dòng một từ, ba cột ngăn cách bằng dấu phẩy (hoặc TAB nếu copy từ Excel). Dấu phẩy thứ ba trở đi thuộc về phần nghĩa, nên nghĩa có chứa dấu phẩy vẫn đúng. Dòng bắt đầu bằng # là ghi chú.',
    ja: '1行1語、カンマ区切りの3列（Excelから貼る場合はTABも可）。3つ目以降のカンマは意味の一部なので、意味にカンマが入っても大丈夫です。# で始まる行はコメントです。',
  },
  'import.format.example': {
    vi: 'Câu ví dụ là tuỳ chọn: viết sau dấu | ở cuối cột nghĩa. Dùng | chứ không thêm dấu phẩy, để nghĩa vẫn chứa được dấu phẩy. Nếu dán từ Excel bằng TAB thì đặt câu ví dụ ở cột thứ 4.',
    ja: '例文は任意です。意味の列の末尾に | を書いてその後に続けます。意味にカンマを使えるようにするため、カンマではなく | で区切ります。ExcelからTABで貼る場合は4列目に置きます。',
  },
  'import.format.vocabularyNote': {
    vi: 'Dấu / dùng để tách các nghĩa tương đương. Khi luyện ở chế độ gõ đáp án, gõ đúng một trong các nghĩa đó là được tính đúng.',
    ja: '/ は同義の区切りです。入力解答では、そのうち1つを正しく入力すれば正解になります。',
  },
  'import.format.reading': {
    vi: 'Cách đọc là tuỳ chọn: viết trong ngoặc ở cuối cột tiếng Nhật, ví dụ 新聞社 (しんぶんしゃ). Phần trong ngoặc được tách ra thành cột riêng chứ không tính là một phần của từ, nên khi luyện gõ đáp án bạn vẫn chỉ cần gõ 新聞社.',
    ja: '読み方は任意です。日本語の列の末尾に括弧で書きます。例：新聞社 (しんぶんしゃ)。括弧の中は別の列として切り出され、単語自体には含まれません。入力解答では 新聞社 だけ入力すれば正解です。',
  },
  // Khối ví dụ định dạng: dòng tiêu đề cột được dịch, còn các dòng dữ liệu giữ
  // nguyên vì nghĩa của từ vốn là tiếng Việt — đó là nội dung học, không phải giao diện.
  'import.sample.verb': {
    vi: 'ÂM HÁN VIỆT,THỂ MẬU,NGHĨA TIẾNG VIỆT,NHÓM\nĐÀO,逃げます,chạy trốn,2\nTHỦ,守ります,bảo vệ/ giữ,1\nQUY,帰ります,về nhà,1*\nVI,します,làm,3',
    ja: '漢越音,ます形,ベトナム語訳,グループ\nĐÀO,逃げます,chạy trốn,2\nTHỦ,守ります,bảo vệ/ giữ,1\nQUY,帰ります,về nhà,1*\nVI,します,làm,3',
  },
  'import.sample.vocabulary': {
    vi: 'ÂM HÁN VIỆT,TIẾNG NHẬT (CÁCH ĐỌC),NGHĨA TIẾNG VIỆT\nĐÀO,逃げます (にげます),chạy trốn/ bỏ chạy\nTỊCH,席 (せき),chỗ ngồi/ ghế\nTÂN VĂN XÃ,新聞社,toà soạn báo',
    ja: '漢越音,日本語（読み方）,ベトナム語訳\nĐÀO,逃げます (にげます),chạy trốn/ bỏ chạy\nTỊCH,席 (せき),chỗ ngồi/ ghế\nTÂN VĂN XÃ,新聞社,toà soạn báo',
  },
  'import.sample.meta': {
    vi: '{ "name": "皆の日本語 — Bài 34", "order": 3401 }',
    ja: '{ "name": "皆の日本語 — 第34課", "order": 3401 }',
  },
  'import.textareaPlaceholder': {
    vi: 'ĐÀO,逃げます,chạy trốn/ bỏ chạy\nTAO,騒ぎます,làm ồn/ làm rùm beng',
    ja: 'ĐÀO,逃げます,chạy trốn/ bỏ chạy\nTAO,騒ぎます,làm ồn/ làm rùm beng',
  },
  'import.content': { vi: 'Nội dung bài học', ja: 'レッスンの内容' },
  'import.name': { vi: 'Tên bài học', ja: 'レッスン名' },
  'import.namePlaceholder': { vi: 'Ví dụ: 皆の日本語 — Bài 34', ja: '例：皆の日本語 — 第34課' },
  'import.lessonId': { vi: 'Mã bài học:', ja: 'レッスンID：' },
  'import.listVerb': { vi: 'Danh sách động từ', ja: '動詞リスト' },
  'import.listVocabulary': { vi: 'Danh sách từ vựng', ja: '単語リスト' },
  'import.pickFile': { vi: 'Chọn file .txt / .csv', ja: '.txt / .csv を選ぶ' },
  'import.clear': { vi: 'Xoá hết', ja: 'すべて消去' },
  'import.loadedFrom': { vi: 'Đã nạp nội dung từ {name}.', ja: '{name} から読み込みました。' },
  'import.fileError': {
    vi: 'Không đọc được nội dung file. Hãy thử dán trực tiếp vào ô bên dưới.',
    ja: 'ファイルを読み込めません。下の欄に直接貼り付けてください。',
  },
  'import.validVerb': { vi: '{count} động từ hợp lệ', ja: '有効な動詞{count}語' },
  'import.validVocabulary': { vi: '{count} từ hợp lệ', ja: '有効な単語{count}語' },
  'import.errorLines': { vi: '{count} dòng lỗi', ja: 'エラー{count}行' },
  'import.duplicateLines': { vi: '{count} dòng trùng', ja: '重複{count}行' },
  'import.skippedLines': { vi: 'Các dòng sau bị bỏ qua:', ja: '次の行は無視されました：' },
  'import.duplicateSkipped': { vi: 'Dòng trùng lặp đã được bỏ qua:', ja: '重複行は無視されました：' },
  'import.line': { vi: 'Dòng {line}', ja: '{line}行目' },
  'import.brokenVerbs': { vi: '{count} động từ khai báo sai nhóm:', ja: 'グループ指定が誤っている動詞が{count}語：' },
  'import.brokenVerbsNote': { vi: 'Sửa lại nhóm cho đúng rồi mới lưu được.', ja: 'グループを直さないと保存できません。' },
  'import.preview.masu': { vi: 'Thể Mậu', ja: 'ます形' },
  'import.preview.forms': { vi: 'Nhóm và các thể app tự chia', ja: 'グループと自動生成された活用形' },
  'import.moreVerbs': { vi: '…và {count} động từ nữa.', ja: '…他{count}語。' },
  'import.moreWords': { vi: '…và {count} từ nữa.', ja: '…他{count}語。' },
  'import.conflict.custom': {
    vi: 'Đã có bài tự nạp cùng mã {id}. Lưu tiếp sẽ ghi đè bài đó.',
    ja: '同じID {id} の自作レッスンがあります。保存すると上書きされます。',
  },
  'import.conflict.builtin': {
    vi: 'Mã {id} đang thuộc về bài có sẵn “{name}”. Bài tự nạp sẽ che mất bài đó — nên đổi tên khác.',
    ja: 'ID {id} は既存レッスン「{name}」のものです。自作レッスンが上書き表示されるため、別名を推奨します。',
  },
  'import.confirmShadow': {
    vi: 'Đã có bài học sẵn với mã "{id}". Bài tự nạp sẽ che mất bài đó. Vẫn tiếp tục?',
    ja: 'ID「{id}」の既存レッスンがあります。自作レッスンが上書き表示されます。続けますか？',
  },
  'import.needMore': {
    vi: 'Cần nhập tên bài học và ít nhất một dòng dữ liệu hợp lệ.',
    ja: 'レッスン名と、有効なデータ行が最低1行必要です。',
  },
  'import.saveHint': {
    vi: 'Lưu vào trình duyệt để dùng ngay, hoặc tải JSON về đặt vào public/lessons/.',
    ja: 'ブラウザに保存してすぐ使うか、JSONをダウンロードして public/lessons/ に置きます。',
  },
  'import.downloadJson': { vi: 'Tải file JSON', ja: 'JSONをダウンロード' },
  'import.save': { vi: 'Lưu và mở bài học', ja: '保存して開く' },
  'import.scriptTitle': { vi: 'Cách thêm bài học bằng script', ja: 'スクリプトで追加する方法' },
  'import.scriptIntro': {
    vi: 'Cách này giúp bài học nằm hẳn trong mã nguồn, ai mở dự án cũng có, không phụ thuộc trình duyệt của bạn.',
    ja: 'この方法ならレッスンがソースに入るので、プロジェクトを開いた人全員が使え、ブラウザに依存しません。',
  },
  'import.step1': {
    vi: 'Tạo thư mục data-source/<tên-bài>/, ví dụ data-source/minna-34-tu-vung/.',
    ja: 'data-source/<レッスン名>/ を作成（例：data-source/minna-34-tu-vung/）。',
  },
  'import.step2': {
    vi: 'Đặt file vocabulary.txt (hoặc verbs.txt) chứa dữ liệu theo đúng định dạng ở trên vào thư mục đó. Tên file quyết định loại bài học.',
    ja: 'そのフォルダに vocabulary.txt（または verbs.txt）を置きます。ファイル名でレッスンの種類が決まります。',
  },
  'import.step3': { vi: '(Tuỳ chọn) Thêm meta.json để đặt tên hiển thị và thứ tự:', ja: '（任意）meta.json で表示名と並び順を指定：' },
  'import.step4': {
    vi: 'Chạy npm run generate. Script sẽ sinh public/lessons/<id>.json và cập nhật index.json.',
    ja: 'npm run generate を実行。public/lessons/<id>.json が生成され、index.json が更新されます。',
  },
  'import.customLessons': {
    vi: 'Bài học tự nạp đang lưu trong trình duyệt',
    ja: 'ブラウザに保存されている自作レッスン',
  },
} as const satisfies Record<string, Entry>;
