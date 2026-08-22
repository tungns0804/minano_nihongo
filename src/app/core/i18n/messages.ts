/**
 * Toàn bộ chữ hiển thị của ứng dụng, hai ngôn ngữ đặt cạnh nhau để dễ soát.
 *
 * Quy ước:
 *  - Khoá đặt theo màn hình: `home.*`, `lesson.*`, `practice.*`, `result.*`, `import.*`.
 *  - Chỗ cần chèn giá trị dùng `{ten}`, ví dụ `Câu {current}/{total}`.
 *  - Vài khoá có vi và ja giống hệt nhau (ます, る, て…) là cố ý: đó là thuật ngữ
 *    tiếng Nhật, giữ nguyên ở cả hai ngôn ngữ.
 *
 * KHÔNG dịch nội dung bài học (nghĩa tiếng Việt của từ vựng) — đó là dữ liệu học,
 * không phải giao diện.
 */

export const LANGUAGES = ['vi', 'ja'] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_NAME: Record<Language, string> = {
  vi: 'Tiếng Việt',
  ja: '日本語',
};

/** Nhãn ngắn hiện trên nút chuyển ngôn ngữ. */
export const LANGUAGE_SHORT: Record<Language, string> = {
  vi: 'VI',
  ja: '日本',
};

type Entry = { vi: string; ja: string };

export const MESSAGES = {
  // ── Chung ──────────────────────────────────────────────────────────────
  'common.retry': { vi: 'Thử lại', ja: '再試行' },
  'common.back': { vi: '← Danh sách bài học', ja: '← レッスン一覧' },
  'common.backToList': { vi: '← Về danh sách bài học', ja: '← レッスン一覧へ' },
  'common.custom': { vi: 'Tự nạp', ja: '自作' },
  'common.customTitle': {
    vi: 'Bài học bạn tự nạp, lưu trong trình duyệt',
    ja: 'ブラウザに保存された自作レッスン',
  },
  'common.all': { vi: 'Tất cả', ja: 'すべて' },
  'common.delete': { vi: 'Xoá', ja: '削除' },

  // ── Vỏ ứng dụng ────────────────────────────────────────────────────────
  'app.namePrefix': { vi: 'Ôn tập từ vựng', ja: '単語練習' },
  'app.title': { vi: 'Ôn tập từ vựng 皆の日本語', ja: '皆の日本語 単語練習' },
  'app.tagline': {
    vi: 'Kanji · Âm Hán Việt · Nghĩa tiếng Việt',
    ja: '漢字・漢越音・ベトナム語訳',
  },
  'app.nav': { vi: 'Điều hướng chính', ja: 'メインナビゲーション' },
  // Tên ba tab nói rõ tab nào bám theo giáo trình và tab nào không: hai tab đầu là
  // nội dung của 皆の日本語, còn "bổ trợ" là bài tập chuyên đề tự soạn thêm.
  'app.nav.lessons': { vi: 'Từ vựng minano', ja: '皆の日本語 単語' },
  'app.nav.grammar': { vi: 'Ngữ pháp minano', ja: '皆の日本語 文法' },
  'app.nav.exercise': { vi: 'Bài tập bổ trợ', ja: '補助練習' },
  'app.nav.kanji': { vi: 'Kanji', ja: '漢字' },
  'app.nav.radical': { vi: 'Bộ thủ', ja: '部首' },
  'app.nav.import': { vi: 'Nạp bài mới', ja: 'レッスン追加' },
  'app.language.switch': { vi: 'Chuyển sang {name}', ja: '{name}に切り替える' },
  'app.skipToContent': { vi: 'Tới nội dung chính', ja: 'メインコンテンツへ' },
  'app.backToTop': { vi: 'Lên đầu trang', ja: 'ページの先頭へ' },

  // ── Giao diện sáng/tối ─────────────────────────────────────────────────
  'theme.system': { vi: 'Tự động', ja: '自動' },
  'theme.light': { vi: 'Sáng', ja: 'ライト' },
  'theme.dark': { vi: 'Tối', ja: 'ダーク' },
  'theme.title': {
    vi: 'Giao diện: {current} — bấm để chuyển sang {next}',
    ja: 'テーマ: {current} — クリックで{next}に切り替え',
  },

  // ── Loại bài học ───────────────────────────────────────────────────────
  'kind.vocabulary': { vi: 'Từ vựng', ja: '単語' },
  'kind.verb': { vi: 'Chia động từ', ja: '動詞の活用' },
  'kind.vocabulary.unit': { vi: '{count} từ', ja: '{count}語' },
  'kind.verb.unit': { vi: '{count} động từ', ja: '動詞{count}語' },
  'kind.vocabulary.desc': {
    vi: 'Luyện nghĩa từ vựng theo 4 chiều: Nhật → Việt, Việt → Nhật, Nhật → Hán Việt, Hán Việt → Nhật.',
    ja: '4つの方向で単語の意味を練習：日→越、越→日、日→漢越音、漢越音→日。',
  },
  'kind.verb.desc': {
    vi: 'Luyện chia động từ sang thể Te, Ta, Ru, Nai và nhận diện nhóm động từ.',
    ja: 'て形・た形・辞書形・ない形への活用と、動詞グループの判別を練習。',
  },
  'kind.conversation': { vi: 'Dịch hội thoại', ja: '会話の翻訳' },
  'kind.conversation.unit': { vi: '{count} câu', ja: '{count}文' },
  'kind.conversation.desc': {
    vi: 'Dịch từng câu qua lại giữa tiếng Việt và tiếng Nhật, gõ tay cả câu.',
    ja: 'ベトナム語と日本語の間で一文ずつ翻訳し、文全体を入力します。',
  },
  'kind.exercise': { vi: 'Bài tập', ja: '練習問題' },
  'kind.exercise.unit': { vi: '{count} mục', ja: '{count}項目' },
  'kind.exercise.desc': {
    vi: 'Bài tập chuyên đề gom động từ nhiều cấp, chỉ gõ đáp án chứ không chọn.',
    ja: '複数のレベルの動詞を集めたテーマ別練習。選択式はなく、入力して解答します。',
  },
  'kind.kanji': { vi: 'Kanji', ja: '漢字' },
  'kind.kanji.unit': { vi: '{count} chữ', ja: '漢字{count}字' },
  'kind.kanji.desc': {
    vi: 'Danh sách chữ Hán N5→N3: âm Hán Việt của chữ, và nghĩa lẫn cách đọc của các từ dùng chữ đó.',
    ja: 'N5～N3の漢字一覧：字の漢越音と、その字を使う単語の意味・読み方。',
  },
  'kind.radical': { vi: 'Bộ thủ', ja: '部首' },
  'kind.radical.unit': { vi: '{count} bộ', ja: '部首{count}個' },
  'kind.radical.desc': {
    vi: 'Bảng 214 bộ thủ: âm Hán Việt và nghĩa của từng bộ, kèm các chữ Hán ghép từ bộ đó.',
    ja: '214部首の一覧：各部首の漢越音と意味、そしてその部首でできている漢字。',
  },
  'kind.grammar': { vi: 'Ngữ pháp', ja: '文法' },
  'kind.grammar.unit': { vi: '{count} mẫu ngữ pháp', ja: '文型{count}個' },
  'kind.grammar.desc': {
    vi: 'Học mẫu ngữ pháp kèm giải thích, rồi luyện viết câu đúng mẫu theo cả hai chiều Việt ↔ Nhật.',
    ja: '文型と解説を学び、越↔日の両方向で文型どおりに文を書く練習をします。',
  },

  // ── Trang chủ ──────────────────────────────────────────────────────────
  'home.title': { vi: 'Chọn bài học để luyện tập', ja: '練習するレッスンを選ぶ' },
  'home.subtitle': {
    vi: 'Kết quả hiện ngay sau khi làm xong và không được lưu lại — mỗi lần luyện là một lần mới.',
    ja: '結果は終了後すぐに表示され、保存されません。毎回が新しい練習です。',
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

  // ── Chi tiết bài học ───────────────────────────────────────────────────
  'lesson.loading': { vi: 'Đang tải bài học…', ja: 'レッスンを読み込み中…' },
  'lesson.notFound': { vi: 'Không tìm thấy bài học {id}.', ja: 'レッスン {id} が見つかりません。' },
  'lesson.specialCount': { vi: '{count} động từ đặc biệt', ja: '特殊動詞{count}語' },
  'lesson.brokenVerbs': {
    vi: '{count} động từ khai báo sai nhóm, không chia được:',
    ja: 'グループ指定が誤っていて活用できない動詞が{count}語あります：',
  },
  'lesson.brokenVerbsNote': {
    vi: 'Những động từ này bị bỏ qua khi luyện tập.',
    ja: 'これらの動詞は練習から除外されます。',
  },

  'lesson.setup': { vi: 'Thiết lập luyện tập', ja: '練習の設定' },
  'lesson.scope': { vi: 'Phạm vi', ja: '範囲' },
  'lesson.scope.all': { vi: 'Toàn bộ bài ({count})', ja: 'レッスン全体（{count}）' },
  'lesson.scope.favorite': { vi: '★ Chưa nhớ ({count})', ja: '★ 未習得（{count}）' },
  'lesson.scope.special': { vi: 'Động từ đặc biệt ({count})', ja: '特殊動詞（{count}）' },
  'lesson.scope.specialTitle': {
    vi: 'Động từ nhóm 1 nhưng hình dạng dễ nhầm sang nhóm 2',
    ja: '1グループなのに2グループと間違えやすい形の動詞',
  },
  'lesson.scope.hint': {
    vi: 'Bấm ngôi sao ở bảng bên dưới để đánh dấu những mục bạn hay quên.',
    ja: '下の表の星印を押して、覚えにくい項目に印を付けます。',
  },

  'lesson.questionType': { vi: 'Dạng câu hỏi', ja: '出題形式' },
  'lesson.forms': { vi: 'Thể đem ra hỏi (chọn nhiều được)', ja: '出題する活用形（複数選択可）' },
  'lesson.forms.hint': {
    vi: 'Mỗi động từ sẽ được hỏi một câu cho từng thể đã chọn.',
    ja: '選んだ活用形ごとに、動詞1語につき1問出題されます。',
  },
  'lesson.direction': { vi: 'Chiều luyện tập', ja: '出題の方向' },
  'lesson.answerMode': { vi: 'Cách trả lời', ja: '解答方法' },
  'lesson.answerMode.choice': { vi: 'Trắc nghiệm 4 đáp án', ja: '4択問題' },
  'lesson.answerMode.typing': { vi: 'Gõ đáp án', ja: '入力して解答' },
  'lesson.questionCount': { vi: 'Số câu', ja: '問題数' },
  'lesson.questionCount.n': { vi: '{count} câu', ja: '{count}問' },

  'lesson.options': { vi: 'Tuỳ chọn', ja: 'オプション' },
  'lesson.option.showMeaning': {
    vi: 'Hiện nghĩa tiếng Việt kèm câu hỏi',
    ja: '問題にベトナム語訳を表示',
  },
  'lesson.option.showHanViet': {
    vi: 'Hiện âm Hán Việt kèm câu hỏi',
    ja: '問題に漢越音を表示',
  },
  'lesson.option.harder': { vi: 'Tắt đi để tăng độ khó.', ja: 'オフにすると難易度が上がります。' },
  'lesson.option.hanVietDisabled': {
    vi: 'Chiều này đã có âm Hán Việt ở câu hỏi hoặc đáp án',
    ja: 'この方向では漢越音が問題か解答に含まれています',
  },
  'lesson.option.hanVietEnabled': { vi: 'Tắt đi để luyện khó hơn', ja: 'オフにすると難しくなります' },
  'lesson.option.shuffle': { vi: 'Trộn thứ tự câu hỏi', ja: '出題順をシャッフル' },
  'lesson.option.shuffleHint': {
    vi: 'Tắt đi để hỏi đúng thứ tự trong bài.',
    ja: 'オフにするとレッスンの順番どおりに出題します。',
  },
  'lesson.option.ignoreDiacritics': {
    vi: 'Bỏ qua dấu tiếng Việt khi chấm',
    ja: 'ベトナム語の声調記号を無視して採点',
  },
  'lesson.option.ignoreDiacriticsHint': {
    vi: '“chay tron” vẫn được tính đúng cho “chạy trốn”.',
    ja: '「chay tron」でも「chạy trốn」として正解になります。',
  },
  'lesson.option.typingOnly': {
    vi: 'Chỉ áp dụng cho chế độ gõ đáp án',
    ja: '入力解答モードのみ有効',
  },

  'lesson.plan': {
    vi: 'Sẽ luyện {count} câu · {mode} · {answer}. Sai {max} lần thì hiện đáp án và tính sai câu đó.',
    ja: '{count}問・{mode}・{answer}。{max}回間違えると解答を表示し、その問題は不正解になります。',
  },
  'lesson.plan.choice': { vi: 'trắc nghiệm', ja: '4択' },
  'lesson.plan.typing': { vi: 'gõ đáp án', ja: '入力解答' },
  'lesson.start': { vi: 'Bắt đầu luyện tập', ja: '練習を始める' },
  'lesson.emptyScope': { vi: 'Chưa có mục nào trong phạm vi đã chọn.', ja: '選んだ範囲に項目がありません。' },

  'lesson.table.verb': { vi: 'Bảng chia động từ', ja: '動詞活用表' },
  'lesson.table.vocabulary': { vi: 'Từ vựng', ja: '単語' },
  'lesson.table.conversation': { vi: 'Các câu trong bài', ja: 'この課の文' },
  'lesson.search.conversation': {
    vi: 'Tìm theo câu tiếng Nhật, câu tiếng Việt hoặc người nói...',
    ja: '日本語の文・ベトナム語の文・話者で検索...',
  },
  'lesson.col.speaker': { vi: 'Người nói', ja: '話者' },
  'lesson.col.sentenceJp': { vi: 'Câu tiếng Nhật', ja: '日本語の文' },
  'lesson.col.sentenceVi': { vi: 'Câu tiếng Việt', ja: 'ベトナム語の文' },
  'lesson.answerMode.typingOnly': {
    vi: 'Bài này chỉ có gõ đáp án. Chọn trong bốn câu dài thì đọc lướt là ra, không còn là dịch nữa.',
    ja: 'この課は入力解答のみです。長文を4択にすると、訳さずに見比べるだけで当たってしまいます。',
  },
  'lesson.showingLines': {
    vi: 'Hiện {shown}/{total} câu.',
    ja: '{total}文中{shown}文を表示。',
  },
  // Nhãn hai nút luyện riêng một câu, đặt ngay trên từng dòng hội thoại. Nói theo
  // ĐÍCH ĐẾN ("→ Tiếng Nhật") chứ không theo cặp chiều như khung thiết lập
  // ("Việt → Nhật"): đứng ngay cạnh một câu cụ thể thì điều cần biết là sẽ phải
  // viết ra thứ tiếng nào, vế còn lại đã nằm sẵn trước mắt.
  'lesson.line.practiceLabel': { vi: 'Luyện viết câu này', ja: 'この文を書く練習' },
  'lesson.line.toJapanese': { vi: '→ Tiếng Nhật', ja: '→ 日本語' },
  'lesson.line.toVietnamese': { vi: '→ Tiếng Việt', ja: '→ ベトナム語' },
  'lesson.line.practiceJp': {
    vi: 'Luyện viết sang tiếng Nhật câu: {name}',
    ja: '「{name}」を日本語で書く練習',
  },
  'lesson.line.practiceVi': {
    vi: 'Luyện viết sang tiếng Việt câu: {name}',
    ja: '「{name}」をベトナム語で書く練習',
  },
  'lesson.deleteLesson': { vi: 'Xoá bài học này', ja: 'このレッスンを削除' },
  'lesson.markSpecial': { vi: '★ Đánh dấu động từ đặc biệt', ja: '★ 特殊動詞に印を付ける' },
  'lesson.clearFavorites': { vi: 'Bỏ đánh dấu tất cả', ja: 'すべての印を外す' },
  'lesson.search.verb': {
    vi: 'Tìm theo âm Hán Việt, động từ, nghĩa hoặc thể đã chia…',
    ja: '漢越音・動詞・意味・活用形で検索…',
  },
  'lesson.search.vocabulary': {
    vi: 'Tìm theo âm Hán Việt, tiếng Nhật hoặc nghĩa…',
    ja: '漢越音・日本語・意味で検索…',
  },
  'lesson.search.aria': { vi: 'Tìm trong bài học', ja: 'レッスン内を検索' },
  'lesson.onlyFavorites': { vi: 'Chỉ hiện ★', ja: '★ のみ表示' },
  'lesson.noVerbMatch': { vi: 'Không có động từ nào khớp.', ja: '一致する動詞がありません。' },
  'lesson.noWordMatch': { vi: 'Không có từ nào khớp.', ja: '一致する単語がありません。' },
  'lesson.showingVerbs': { vi: 'Hiện {shown}/{total} động từ.', ja: '{total}語中{shown}語を表示。' },
  'lesson.showingWords': { vi: 'Hiện {shown}/{total} từ.', ja: '{total}語中{shown}語を表示。' },

  'lesson.col.star': { vi: 'Đánh dấu chưa nhớ', ja: '未習得の印' },
  'lesson.col.hanViet': { vi: 'Âm Hán Việt', ja: '漢越音' },
  'lesson.col.japanese': { vi: 'Tiếng Nhật', ja: '日本語' },
  'lesson.col.reading': { vi: 'Cách đọc', ja: '読み方' },
  'lesson.col.meaning': { vi: 'Nghĩa tiếng Việt', ja: 'ベトナム語訳' },
  'lesson.col.meaningShort': { vi: 'Nghĩa', ja: '意味' },
  'lesson.col.group': { vi: 'Nhóm', ja: 'グループ' },
  'lesson.col.example': { vi: 'Ví dụ', ja: '例文' },

  'lesson.speak': { vi: 'Nghe phát âm {name}', ja: '{name} の発音を聞く' },
  'lesson.speak.missing': {
    vi: 'Chưa có file phát âm cho từ này',
    ja: 'この単語の音声ファイルがありません',
  },

  'lesson.badge.special': { vi: 'đặc biệt', ja: '特殊' },
  'lesson.badge.specialTitle': {
    vi: 'Nhóm 1 nhưng hình dạng dễ nhầm sang nhóm 2',
    ja: '1グループだが2グループと紛らわしい形',
  },
  'lesson.badge.irregular': { vi: 'bất quy tắc', ja: '不規則' },
  'lesson.badge.irregularTitle': { vi: 'Chia bất quy tắc', ja: '不規則な活用' },

  'lesson.confirm.clearFavorites': {
    vi: 'Bỏ đánh dấu toàn bộ {count} mục chưa nhớ của bài này?',
    ja: 'このレッスンの未習得{count}項目すべての印を外しますか？',
  },
  'lesson.confirm.delete': {
    vi: 'Xoá bài học tự nạp "{name}"? Thao tác này không khôi phục được.',
    ja: '自作レッスン「{name}」を削除しますか？元に戻せません。',
  },

  // ── Tab ngữ pháp ───────────────────────────────────────────────────────
  // Bài ngữ pháp có màn hình riêng chứ không dùng chung với /lesson/:id: nội dung
  // của nó là trang lý thuyết (công thức, bảng biến đổi, các cách dùng) chứ không
  // phải một bảng dữ liệu như ba loại bài kia.
  'grammar.title': { vi: 'Ngữ pháp 皆の日本語', ja: '皆の日本語の文法' },
  'grammar.subtitle': {
    vi: 'Chọn một bài để xem mẫu ngữ pháp kèm giải thích, rồi luyện viết câu theo đúng mẫu đó.',
    ja: 'レッスンを選ぶと文型と解説が表示され、その文型どおりに文を書く練習ができます。',
  },
  'grammar.roadmap': {
    vi: 'Phần ngữ pháp dự kiến phủ từ bài 26 đến bài 50. Bài chưa có trong danh sách là chưa được thêm vào.',
    ja: '文法は第26課から第50課までを順次追加します。一覧にない課はまだ未収録です。',
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

  // ── Khu Bài tập ────────────────────────────────────────────────────────
  // Hai bài tập chuyên đề nằm ngoài giáo trình: dữ liệu cài sẵn trong mã nguồn
  // (core/exercises/), gom động từ của nhiều cấp theo một chủ đề ngữ pháp.
  'exercise.title': { vi: 'Bài tập bổ trợ', ja: '補助練習' },
  'exercise.subtitle': {
    vi: 'Các cách luyện ngoài việc nhớ nghĩa từ vựng: bài tập chuyên đề gom động từ nhiều cấp, bài chia thể động từ, và bài dịch hội thoại Việt ↔ Nhật.',
    ja: '単語の意味を覚える以外の練習：複数レベルの動詞を集めたテーマ別練習、動詞の活用、そして越↔日の会話翻訳。',
  },
  'exercise.search': {
    vi: 'Tìm bài tập theo tên hoặc số bài…',
    ja: '練習の名前・課の番号で検索…',
  },
  'exercise.search.aria': { vi: 'Tìm bài tập', ja: '練習を検索' },
  'exercise.entryCount': { vi: '{count} bài tập', ja: '練習{count}件' },
  'exercise.transitivity.name': { vi: 'Tự động từ & Tha động từ', ja: '自動詞・他動詞' },
  'exercise.transitivity.desc': {
    vi: 'Cho một vế, viết ra vế còn lại của cặp: 開きます ↔ 開けます, 消えます ↔ 消します.',
    ja: '片方を見て、対になるもう片方を書きます：開きます ↔ 開けます、消えます ↔ 消します。',
  },
  'exercise.forms.name': { vi: 'Chuyển thể động từ', ja: '動詞の活用変換' },
  'exercise.forms.desc': {
    vi: 'Chuyển thể lịch sự ます sang thể Te, Ta, Ru, Nai và ngược lại, đủ ba nhóm kể cả động từ đặc biệt.',
    ja: 'ます形をて形・た形・辞書形・ない形へ、またその逆へ変換します。特殊な動詞も含め3グループすべて。',
  },
  'exercise.pairCount': { vi: '{count} cặp động từ', ja: '動詞{count}組' },
  'exercise.verbCount': { vi: '{count} động từ', ja: '動詞{count}語' },
  'exercise.levelRange': { vi: 'Cấp độ {range}', ja: 'レベル {range}' },
  'exercise.back': { vi: '← Danh sách bài tập', ja: '← 練習問題一覧' },
  'exercise.notFound': { vi: 'Không tìm thấy bài tập {id}.', ja: '練習問題 {id} が見つかりません。' },

  'exercise.levels': { vi: 'Cấp độ (chọn nhiều được)', ja: 'レベル（複数選択可）' },
  'exercise.levels.hint': {
    vi: 'Bỏ chọn bớt để luyện riêng một cấp.',
    ja: 'チェックを外すと1つのレベルだけ練習できます。',
  },
  'exercise.level.count': { vi: '{level} ({count})', ja: '{level}（{count}）' },
  'exercise.levelEmpty': { vi: 'Chưa chọn cấp độ nào.', ja: 'レベルが選ばれていません。' },
  'exercise.scope.all': { vi: 'Toàn bộ ({count})', ja: '全体（{count}）' },

  'exercise.mode': { vi: 'Chiều hỏi', ja: '出題の方向' },
  'exercise.mode.toTransitive': { vi: 'Tự động từ → Tha động từ', ja: '自動詞 → 他動詞' },
  'exercise.mode.toTransitive.short': { vi: 'Tự → Tha', ja: '自 → 他' },
  'exercise.mode.toTransitive.example': { vi: '開きます → 開けます', ja: '開きます → 開けます' },
  'exercise.mode.toIntransitive': { vi: 'Tha động từ → Tự động từ', ja: '他動詞 → 自動詞' },
  'exercise.mode.toIntransitive.short': { vi: 'Tha → Tự', ja: '他 → 自' },
  'exercise.mode.toIntransitive.example': { vi: '開けます → 開きます', ja: '開けます → 開きます' },
  'exercise.mode.transitivityMixed': { vi: 'Trộn cả hai chiều', ja: '両方向をまぜる' },
  'exercise.mode.transitivityMixed.short': { vi: 'Tự ↔ Tha', ja: '自 ↔ 他' },
  'exercise.mode.transitivityMixed.example': { vi: '開きます ↔ 開けます', ja: '開きます ↔ 開けます' },
  'exercise.mode.masuToForm': { vi: 'Thể lịch sự → thể ngắn', ja: 'ます形 → 短い形' },
  'exercise.mode.masuToForm.short': { vi: 'ます → thể ngắn', ja: 'ます → 短い形' },
  'exercise.mode.masuToForm.example': {
    vi: '帰ります → thể Te?  →  帰って',
    ja: '帰ります → て形は？  →  帰って',
  },
  'exercise.mode.formToMasu': { vi: 'Thể ngắn → thể lịch sự', ja: '短い形 → ます形' },
  'exercise.mode.formToMasu.short': { vi: 'thể ngắn → ます', ja: '短い形 → ます' },
  'exercise.mode.formToMasu.example': {
    vi: '帰って (thể Te) → thể Mậu?  →  帰ります',
    ja: '帰って（て形）→ ます形は？  →  帰ります',
  },
  'exercise.mode.formMixed': { vi: 'Trộn cả hai chiều', ja: '両方向をまぜる' },
  'exercise.mode.formMixed.short': { vi: 'ます ↔ thể ngắn', ja: 'ます ↔ 短い形' },
  'exercise.mode.formMixed.example': { vi: '帰ります ↔ 帰って', ja: '帰ります ↔ 帰って' },

  'exercise.label.toTransitive': {
    vi: 'Tha động từ tương ứng là gì?',
    ja: '対応する他動詞は？',
  },
  'exercise.label.toIntransitive': {
    vi: 'Tự động từ tương ứng là gì?',
    ja: '対応する自動詞は？',
  },
  'exercise.answerPrompt.transitive': {
    vi: 'Nhập tha động từ (thể ます)',
    ja: '他動詞（ます形）を入力',
  },
  'exercise.answerPrompt.intransitive': {
    vi: 'Nhập tự động từ (thể ます)',
    ja: '自動詞（ます形）を入力',
  },

  'exercise.col.intransitive': { vi: 'Tự động từ 自動詞', ja: '自動詞' },
  'exercise.col.transitive': { vi: 'Tha động từ 他動詞', ja: '他動詞' },
  'exercise.col.level': { vi: 'Cấp độ', ja: 'レベル' },
  'exercise.table.transitivity': { vi: 'Bảng cặp tự động từ / tha động từ', ja: '自動詞・他動詞の対応表' },
  'exercise.search.transitivity': {
    vi: 'Tìm theo động từ, cách đọc hoặc nghĩa…',
    ja: '動詞・読み方・意味で検索…',
  },
  'exercise.search.forms': {
    vi: 'Tìm theo động từ, cách đọc, nghĩa hoặc thể đã chia…',
    ja: '動詞・読み方・意味・活用形で検索…',
  },
  'exercise.showing': { vi: 'Hiện {shown}/{total} mục.', ja: '{total}項目中{shown}項目を表示。' },
  'exercise.noMatch': { vi: 'Không có mục nào khớp.', ja: '一致する項目がありません。' },
  'exercise.typingOnly': {
    vi: 'Bài tập chỉ có gõ đáp án: mục tiêu là tự viết ra được dạng đúng, mà bày sẵn bốn đáp án thì chỉ còn là nhận mặt chữ.',
    ja: 'この練習は入力解答のみです。狙いは正しい形を自分で書けることで、4択にすると見比べるだけになってしまいます。',
  },
  'exercise.kanaAccepted': {
    vi: 'Gõ bằng kana cũng được tính đúng: かえって cũng như 帰って.',
    ja: 'かなで入力しても正解です：かえって も 帰って も可。',
  },

  // ── Khu Kanji ──────────────────────────────────────────────────────────
  // Danh sách chữ Hán từ N5 tới N3, mỗi chữ kèm các từ dùng chữ đó (xem core/kanji/).
  'kanji.title': { vi: 'Danh sách Kanji', ja: '漢字一覧' },
  'kanji.subtitle': {
    vi: 'Chữ Hán từ N5 tới N3, giữ nguyên thứ tự học của danh sách gốc. Mở một chữ để xem các từ trong kho có dùng chữ đó. Chỉ gõ đáp án, không có trắc nghiệm.',
    ja: 'N5からN3までの漢字。元の一覧の学習順をそのまま保ちます。漢字を開くと、その字を使う単語が見られます。解答は入力のみです。',
  },
  'kanji.back': { vi: '← Danh sách Kanji', ja: '← 漢字一覧' },
  'kanji.notFound': { vi: 'Không tìm thấy chữ {id}.', ja: '漢字 {id} が見つかりません。' },

  'kanji.kanjiCount': { vi: '{count} chữ', ja: '漢字{count}字' },
  'kanji.wordCount': { vi: '{count} từ', ja: '{count}語' },

  'kanji.levels': { vi: 'Cấp độ', ja: 'レベル' },
  'kanji.level.count': { vi: '{level} ({count})', ja: '{level}（{count}）' },
  'kanji.scope.all': { vi: 'Toàn bộ {level} ({count})', ja: '{level}全体（{count}）' },
  'kanji.scope.allWords': { vi: 'Toàn bộ ({count})', ja: '全体（{count}）' },
  'kanji.search': {
    vi: 'Tìm theo chữ, âm Hán Việt, từ hoặc nghĩa…',
    ja: '漢字・漢越音・単語・意味で検索…',
  },
  'kanji.searchWord': {
    vi: 'Tìm theo từ, cách đọc hoặc nghĩa…',
    ja: '単語・読み方・意味で検索…',
  },
  'kanji.showing': { vi: 'Hiện {shown}/{total} mục.', ja: '{total}項目中{shown}項目を表示。' },
  'kanji.noMatch': { vi: 'Không có mục nào khớp.', ja: '一致する項目がありません。' },
  'kanji.typingOnly': {
    vi: 'Khu Kanji chỉ có gõ đáp án: bày sẵn bốn âm Hán Việt để chọn thì chỉ còn là nhận mặt chữ, mà cái cần nhớ ở đây là tự đọc ra được.',
    ja: 'この画面は入力解答のみです。4択にすると見比べるだけになり、自分で読める力が身につきません。',
  },
  'kanji.multiReading': {
    vi: 'Chữ này có nhiều âm Hán Việt — khi luyện, gõ âm nào cũng được tính đúng.',
    ja: 'この漢字には漢越音が複数あります。練習ではどれを入力しても正解です。',
  },

  'kanji.practiceHanViet': { vi: 'Luyện âm Hán Việt của chữ', ja: '漢字の漢越音を練習' },
  'kanji.practiceHanViet.hint': {
    vi: 'Hỏi trên toàn bộ chữ của cấp độ đang chọn ở trên.',
    ja: '上で選んでいるレベルの漢字すべてから出題します。',
  },
  'kanji.practiceWords': { vi: 'Luyện từ của chữ này', ja: 'この漢字の単語を練習' },

  'kanji.mode': { vi: 'Chiều hỏi', ja: '出題の方向' },
  'kanji.mode.kanjiHanViet': { vi: 'Chữ Hán → âm Hán Việt', ja: '漢字 → 漢越音' },
  'kanji.mode.kanjiHanViet.short': { vi: 'Chữ → Hán Việt', ja: '漢字 → 漢越音' },
  'kanji.mode.kanjiHanViet.example': { vi: '海 → HẢI', ja: '海 → HẢI' },
  'kanji.mode.wordMeaning': { vi: 'Từ kanji → nghĩa tiếng Việt', ja: '漢字の単語 → ベトナム語訳' },
  'kanji.mode.wordMeaning.short': { vi: 'Từ → nghĩa', ja: '単語 → 意味' },
  'kanji.mode.wordMeaning.example': { vi: '海 → biển', ja: '海 → biển' },
  'kanji.mode.wordReading': { vi: 'Từ kanji → hiragana', ja: '漢字の単語 → ひらがな' },
  'kanji.mode.wordReading.short': { vi: 'Từ → hiragana', ja: '単語 → ひらがな' },
  'kanji.mode.wordReading.example': { vi: '海 → うみ', ja: '海 → うみ' },
  'kanji.mode.wordMixed': { vi: 'Hỏi cả nghĩa lẫn hiragana', ja: '意味と読み方の両方' },
  'kanji.mode.wordMixed.short': { vi: 'Nghĩa + hiragana', ja: '意味＋読み' },
  'kanji.mode.wordMixed.example': { vi: '海 → biển / うみ', ja: '海 → biển / うみ' },

  'kanji.label.kanjiHanViet': { vi: 'Chữ này đọc âm Hán Việt là gì?', ja: 'この漢字の漢越音は？' },
  'kanji.label.wordMeaning': { vi: 'Từ này nghĩa là gì?', ja: 'この単語の意味は？' },
  'kanji.label.wordReading': { vi: 'Từ này viết hiragana thế nào?', ja: 'この単語のひらがなは？' },
  'kanji.answerPrompt.hanViet': { vi: 'Nhập âm Hán Việt của chữ', ja: '漢字の漢越音を入力' },

  'kanji.option.showWordHint': { vi: 'Gợi ý một từ dùng chữ đó', ja: 'その字を使う単語をヒントに' },
  'kanji.option.showWordHint.desc': {
    vi: 'Chữ đứng một mình gần như không có manh mối; nhìn 会社 thì nhớ ra HỘI dễ hơn nhìn trơ chữ 会.',
    ja: '漢字だけでは手がかりが少なめです。会社を見れば、会だけを見るよりHỘIを思い出しやすくなります。',
  },
  'kanji.option.showHanViet.desc': {
    vi: 'Âm Hán Việt của cả từ dẫn tới nghĩa mà không đọc thẳng ra đáp án.',
    ja: '単語全体の漢越音は、答えそのものを言わずに意味へ導いてくれます。',
  },

  'kanji.col.hanViet': { vi: 'Âm Hán Việt', ja: '漢越音' },
  'kanji.col.kanji': { vi: 'Chữ Hán', ja: '漢字' },
  'kanji.col.level': { vi: 'Cấp độ', ja: 'レベル' },
  'kanji.col.word': { vi: 'Từ', ja: '単語' },
  'kanji.col.examples': { vi: 'Từ dùng chữ này', ja: 'この字を使う単語' },
  'kanji.table': { vi: 'Các từ dùng chữ {char}', ja: '{char} を使う単語' },
  'kanji.noWordsYet': {
    vi: 'Kho từ của ứng dụng chưa có từ nào dùng chữ này, nên chưa luyện từ ở đây được. Chữ vẫn được hỏi ở phần luyện âm Hán Việt ngoài danh sách.',
    ja: 'この字を使う単語がまだデータにないため、ここでは単語練習ができません。一覧画面の漢越音練習には出てきます。',
  },
  'kanji.emptyPool': {
    vi: 'Chưa có từ nào trong phạm vi đang chọn.',
    ja: '選択中の範囲に単語がありません。',
  },
  'kanji.dataNote': {
    vi: 'Danh sách chữ và cấp độ lấy theo bảng kanji JLPT N5→N3. Các từ minh hoạ và âm Hán Việt rút từ kho của ứng dụng (từ vựng 皆の日本語 bài 1-50 và động từ khu Bài tập), nên chữ nào kho chưa có từ thì chưa luyện từ được.',
    ja: '漢字の一覧とレベルはJLPT N5〜N3の漢字表に従います。例語と漢越音はアプリ内のデータ（皆の日本語 第1-50課の単語と練習問題の動詞）から取り出しています。',
  },

  // ── Khu Bộ thủ ─────────────────────────────────────────────────────────
  // 214 bộ thủ Khang Hy, mỗi bộ kèm các chữ Hán ghép từ bộ đó (xem core/radical/).
  'radical.title': { vi: 'Học bộ thủ', ja: '部首を学ぶ' },
  'radical.subtitle': {
    vi: 'Toàn bộ 214 bộ thủ, xếp theo số nét. Mở một bộ để xem những chữ Hán ghép từ bộ đó với các bộ khác, kèm cách chiết tự. Chỉ gõ đáp án, không có trắc nghiệm.',
    ja: '214部首すべてを画数順に。部首を開くと、その部首と他の部首でできている漢字と、その分解が見られます。解答は入力のみです。',
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

  'radical.label.radicalHanViet': { vi: 'Bộ này đọc âm Hán Việt là gì?', ja: 'この部首の漢越音は？' },
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
    vi: 'Kho chữ N5→N3 của ứng dụng chưa có chữ nào ghép từ bộ này, nên chưa luyện chữ ở đây được. Bộ vẫn được hỏi ở phần luyện âm Hán Việt ngoài danh sách.',
    ja: 'アプリのN5〜N3の漢字にこの部首でできた字がまだないため、ここでは漢字練習ができません。一覧画面の漢越音練習には出てきます。',
  },
  'radical.emptyPool': {
    vi: 'Chưa có chữ nào trong phạm vi đang chọn.',
    ja: '選択中の範囲に漢字がありません。',
  },
  'radical.dataNote': {
    vi: 'Bảng bộ thủ lấy theo 214 bộ Khang Hy. Các chữ ghép, âm Hán Việt và từ ví dụ rút từ chính kho chữ N5→N3 của khu Kanji, nên hai khu luôn nói cùng một thứ về một chữ.',
    ja: '部首の一覧は康熙字典の214部首に従います。例の漢字・漢越音・例語は漢字コーナーのN5〜N3のデータをそのまま使っています。',
  },

  // ── Nhãn phạm vi (dùng ở màn kết quả) ──────────────────────────────────
  'scope.all': { vi: 'Toàn bộ bài', ja: 'レッスン全体' },
  'scope.favorite': { vi: '★ Mục chưa nhớ', ja: '★ 未習得の項目' },
  'scope.special': { vi: 'Động từ đặc biệt', ja: '特殊動詞' },
  'scope.single': { vi: 'Một câu đã chọn', ja: '選んだ1文' },

  // ── Chiều luyện tập (bài từ vựng) ──────────────────────────────────────
  'direction.jp-vi': { vi: 'Tiếng Nhật → Nghĩa tiếng Việt', ja: '日本語 → ベトナム語訳' },
  'direction.jp-vi.short': { vi: 'Nhật → Việt', ja: '日 → 越' },
  'direction.vi-jp': { vi: 'Nghĩa tiếng Việt → Tiếng Nhật', ja: 'ベトナム語訳 → 日本語' },
  'direction.vi-jp.short': { vi: 'Việt → Nhật', ja: '越 → 日' },
  'direction.jp-han': { vi: 'Tiếng Nhật → Âm Hán Việt', ja: '日本語 → 漢越音' },
  'direction.jp-han.short': { vi: 'Nhật → Hán Việt', ja: '日 → 漢越音' },
  'direction.han-jp': { vi: 'Âm Hán Việt → Tiếng Nhật', ja: '漢越音 → 日本語' },
  'direction.han-jp.short': { vi: 'Hán Việt → Nhật', ja: '漢越音 → 日' },
  'direction.jp-kana': { vi: 'Tiếng Nhật → Cách đọc', ja: '日本語 → 読み方' },
  'direction.jp-kana.short': { vi: 'Nhật → Cách đọc', ja: '日 → 読み方' },
  'direction.kana-jp': { vi: 'Cách đọc → Tiếng Nhật', ja: '読み方 → 日本語' },
  'direction.kana-jp.short': { vi: 'Cách đọc → Nhật', ja: '読み方 → 日' },

  // ── Dạng câu hỏi động từ ───────────────────────────────────────────────
  'verbMode.masu-to-form': { vi: 'Thể Mậu → thể khác', ja: 'ます形 → 他の活用形' },
  'verbMode.masu-to-form.short': { vi: 'ます → thể khác', ja: 'ます → 他の形' },
  'verbMode.masu-to-form.example': {
    vi: '逃げます → thể Te?  →  逃げて',
    ja: '逃げます → て形は？  →  逃げて',
  },
  'verbMode.form-to-masu': { vi: 'Thể khác → thể Mậu', ja: '他の活用形 → ます形' },
  'verbMode.form-to-masu.short': { vi: 'thể khác → ます', ja: '他の形 → ます' },
  'verbMode.form-to-masu.example': {
    vi: '逃げて (thể Te) → thể Mậu?  →  逃げます',
    ja: '逃げて（て形）→ ます形は？  →  逃げます',
  },
  'verbMode.identify-group': { vi: 'Nhận diện nhóm động từ', ja: '動詞グループの判別' },
  'verbMode.identify-group.short': { vi: 'Nhận diện nhóm', ja: 'グループ判別' },
  'verbMode.identify-group.example': {
    vi: '帰ります thuộc nhóm mấy?  →  Nhóm 1',
    ja: '帰ります は何グループ？  →  1グループ',
  },
  'verbMode.meaning-to-form': { vi: 'Nghĩa tiếng Việt → thể yêu cầu', ja: 'ベトナム語訳 → 指定の活用形' },
  'verbMode.meaning-to-form.short': { vi: 'Nghĩa → thể', ja: '意味 → 活用形' },
  'verbMode.meaning-to-form.example': {
    vi: '"chạy trốn" → thể Te?  →  逃げて',
    ja: '「chạy trốn」→ て形は？  →  逃げて',
  },

  // ── Thể động từ ────────────────────────────────────────────────────────
  'verbForm.masu': { vi: 'Thể Mậu (ます)', ja: 'ます形' },
  'verbForm.dictionary': { vi: 'Thể từ điển (る)', ja: '辞書形' },
  'verbForm.te': { vi: 'Thể Te (て)', ja: 'て形' },
  'verbForm.ta': { vi: 'Thể Ta (た)', ja: 'た形' },
  'verbForm.nai': { vi: 'Thể Nai (ない)', ja: 'ない形' },
  // Nhãn cột trong bảng chia — thuật ngữ tiếng Nhật, giữ nguyên ở cả hai ngôn ngữ.
  'verbForm.masu.short': { vi: 'ます', ja: 'ます' },
  'verbForm.dictionary.short': { vi: 'る', ja: 'る' },
  'verbForm.te.short': { vi: 'て', ja: 'て' },
  'verbForm.ta.short': { vi: 'た', ja: 'た' },
  'verbForm.nai.short': { vi: 'ない', ja: 'ない' },

  'group.1': { vi: 'Nhóm 1', ja: '1グループ' },
  'group.2': { vi: 'Nhóm 2', ja: '2グループ' },
  'group.3': { vi: 'Nhóm 3', ja: '3グループ' },

  // ── Màn hình luyện tập ─────────────────────────────────────────────────
  'practice.progress': { vi: 'Câu {current}/{total}', ja: '{current}/{total}問' },
  'practice.correctSoFar': { vi: 'Đúng {count}', ja: '正解{count}' },
  'practice.quit': { vi: 'Thoát', ja: '中断' },
  'practice.progressAria': {
    vi: 'Tiến độ: câu {current} trên {total}',
    ja: '進捗：{total}問中{current}問目',
  },
  'practice.star': { vi: 'Đánh dấu mục này là chưa nhớ', ja: 'この項目を未習得にする' },
  'practice.starTitle': {
    vi: 'Đánh dấu chưa nhớ để luyện riêng sau',
    ja: '後で個別に練習するため未習得にする',
  },
  'practice.check': { vi: 'Kiểm tra', ja: '確認' },
  'practice.placeholder': { vi: 'Gõ đáp án rồi nhấn Enter…', ja: '解答を入力して Enter…' },
  'practice.imeHint': {
    vi: 'Cần bật bộ gõ tiếng Nhật (IME) để nhập kanji/kana.',
    ja: '漢字・かなの入力には日本語IMEが必要です。',
  },

  'practice.answerPrompt.japanese': { vi: 'Nhập từ tiếng Nhật', ja: '日本語を入力' },
  'practice.answerPrompt.vietnamese': { vi: 'Nhập nghĩa tiếng Việt', ja: 'ベトナム語訳を入力' },
  'practice.answerPrompt.hanViet': { vi: 'Nhập âm Hán Việt', ja: '漢越音を入力' },
  'practice.answerPrompt.reading': { vi: 'Nhập cách đọc (hiragana/katakana)', ja: '読み方（ひらがな・カタカナ）を入力' },
  'practice.answerPrompt.sentenceJapanese': {
    vi: 'Dịch sang tiếng Nhật',
    ja: '日本語に訳して入力',
  },
  'practice.answerPrompt.sentenceVietnamese': {
    vi: 'Dịch sang tiếng Việt',
    ja: 'ベトナム語に訳して入力',
  },
  'practice.punctuationNote': {
    vi: 'Dấu câu và khoảng trắng không tính khi chấm.',
    ja: '句読点とスペースは採点に影響しません。',
  },
  'practice.answerPrompt.masu': { vi: 'Nhập thể ます', ja: 'ます形を入力' },
  'practice.answerPrompt.form': { vi: 'Nhập {form}', ja: '{form}を入力' },
  'practice.answerPrompt.group': { vi: 'Nhập số nhóm (1, 2 hoặc 3)', ja: 'グループ番号（1・2・3）を入力' },

  'practice.label.toForm': { vi: '{from} → {to}', ja: '{from} → {to}' },
  'practice.label.identifyGroup': { vi: 'Động từ này thuộc nhóm mấy?', ja: 'この動詞は何グループ？' },
  'practice.label.meaningToForm': { vi: 'Nghĩa tiếng Việt → {to}', ja: 'ベトナム語訳 → {to}' },

  'practice.correct': { vi: 'Chính xác!', ja: '正解！' },
  'practice.correctAfter': { vi: '(sai {count} lần trước đó)', ja: '（{count}回間違えました）' },
  'practice.wrong': { vi: 'Chưa đúng — câu này tính là sai.', ja: '不正解 — この問題は誤答になります。' },
  'practice.yourAnswer': { vi: 'Bạn trả lời:', ja: 'あなたの解答：' },
  'practice.answer': { vi: 'Đáp án:', ja: '正解：' },
  'practice.next': { vi: 'Câu tiếp theo', ja: '次の問題' },
  'practice.seeResult': { vi: 'Xem kết quả', ja: '結果を見る' },
  'practice.spaceHintNext': { vi: 'để sang câu tiếp theo', ja: 'で次の問題へ' },
  'practice.spaceHintResult': { vi: 'để xem kết quả', ja: 'で結果を表示' },
  'practice.spacePrefix': { vi: 'Nhấn', ja: '' },
  'practice.attempts': {
    vi: 'Sai {count}/{max} — còn {left} lượt',
    ja: '{max}回中{count}回誤答 — 残り{left}回',
  },
  'practice.lastAnswer': { vi: 'vừa trả lời:', ja: '直前の解答：' },
  'practice.hintChoice': { vi: 'Chọn đáp án đúng hoặc nhấn phím', ja: '正解を選ぶか、キーを押す' },
  'practice.hintTyping': { vi: 'Gõ đáp án rồi nhấn', ja: '解答を入力して押す' },
  'practice.hintMax': {
    vi: 'Sai {max} lần sẽ hiện đáp án và tính sai câu này.',
    ja: '{max}回間違えると解答を表示し、この問題は誤答になります。',
  },
  'practice.giveUp': { vi: 'Chịu, xem đáp án', ja: '降参：解答を見る' },
  'practice.confirmQuit': {
    vi: 'Thoát phiên luyện tập? Kết quả đang làm dở sẽ không được tính.',
    ja: '練習を中断しますか？途中の結果は記録されません。',
  },

  // ── Màn hình kết quả ───────────────────────────────────────────────────
  'result.title': { vi: 'Kết quả luyện tập', ja: '練習結果' },
  'result.fraction': { vi: '{correct}/{total} câu đúng', ja: '{total}問中{correct}問正解' },
  'result.perfect': { vi: 'đúng ngay lần đầu', ja: '一発正解' },
  'result.retried': { vi: 'đúng sau khi thử lại', ja: '再挑戦で正解' },
  'result.wrong': { vi: 'sai', ja: '誤答' },
  'result.duration': { vi: 'thời gian', ja: '所要時間' },
  'result.minutesSeconds': { vi: '{minutes} phút {seconds} giây', ja: '{minutes}分{seconds}秒' },
  'result.seconds': { vi: '{seconds} giây', ja: '{seconds}秒' },
  'result.retryWrong': { vi: 'Luyện lại {count} câu sai', ja: '誤答{count}問をやり直す' },
  'result.markWrong': { vi: '★ Đánh dấu mục sai là chưa nhớ', ja: '★ 誤答した項目を未習得にする' },
  'result.retryAll': { vi: 'Làm lại toàn bộ', ja: 'すべてやり直す' },
  'result.backToLesson': { vi: 'Về bài học', ja: 'レッスンへ戻る' },
  'result.home': { vi: 'Trang chủ', ja: 'ホーム' },
  'result.markedNotice': {
    vi: 'Đã đánh dấu ★ thêm {count} mục. Lần sau chọn phạm vi “Mục chưa nhớ” để luyện riêng nhóm này.',
    ja: '{count}項目に★を付けました。次回は範囲「未習得の項目」を選ぶとこれだけ練習できます。',
  },
  'result.allMarked': { vi: 'Tất cả mục sai đều đã được đánh dấu ★.', ja: '誤答した項目はすべて★が付いています。' },
  'result.flawless': {
    vi: 'Đúng hết {count} câu. Thử tắt gợi ý hoặc đổi sang chế độ gõ đáp án để luyện khó hơn.',
    ja: '{count}問すべて正解。ヒントを消すか入力解答に変えると、さらに難しくできます。',
  },
  'result.details': { vi: 'Chi tiết', ja: '詳細' },
  'result.filter.all': { vi: 'Tất cả ({count})', ja: 'すべて（{count}）' },
  'result.filter.wrong': { vi: 'Sai ({count})', ja: '誤答（{count}）' },
  'result.filter.retried': { vi: 'Thử lại ({count})', ja: '再挑戦（{count}）' },
  'result.emptyFilter': { vi: 'Không có câu nào trong nhóm này.', ja: 'この区分に該当する問題はありません。' },
  'result.correctAnswer': { vi: 'Đáp án đúng:', ja: '正解：' },
  'result.youAnswered': { vi: '· bạn trả lời: {answers}', ja: '・あなたの解答：{answers}' },
  'result.correctAfterTries': { vi: 'Đúng sau {count} lần sai', ja: '{count}回間違えてから正解' },
  'result.markCorrect': { vi: 'Đúng', ja: '正解' },
  'result.markWrongLabel': { vi: 'Sai', ja: '誤答' },

  // ── Đánh dấu ★ (dùng chung nhiều màn) ──────────────────────────────────
  'favorite.add': { vi: 'Đánh dấu chưa nhớ {name}', ja: '{name} を未習得にする' },
  'favorite.remove': { vi: 'Bỏ đánh dấu {name}', ja: '{name} の印を外す' },

  // ── Màn hình nạp bài mới ───────────────────────────────────────────────
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

  // ── Thông báo lỗi dữ liệu (từ parser) ──────────────────────────────────
  'parse.missingColumnsVocabulary': {
    vi: 'Thiếu cột. Cần đủ 3 cột: ÂM HÁN VIỆT,TIẾNG NHẬT,NGHĨA TIẾNG VIỆT',
    ja: '列が足りません。3列必要です：漢越音,日本語,ベトナム語訳',
  },
  'parse.missingColumnsVerb': {
    vi: 'Thiếu cột. Cần đủ 4 cột: ÂM HÁN VIỆT,THỂ MẬU,NGHĨA TIẾNG VIỆT,NHÓM',
    ja: '列が足りません。4列必要です：漢越音,ます形,ベトナム語訳,グループ',
  },
  'parse.emptyColumns': { vi: 'Cột rỗng: {columns}', ja: '空の列：{columns}' },
  'parse.notMasuForm': {
    vi: 'Động từ phải ở thể ます, nhận được "{value}"',
    ja: '動詞はます形である必要があります（受け取った値：「{value}」）',
  },
  'parse.badGroup': {
    vi: 'Nhóm phải là 1, 2 hoặc 3 (thêm * để đánh dấu đặc biệt), nhận được "{value}"',
    ja: 'グループは1・2・3のいずれかです（*で特殊動詞の印）。受け取った値：「{value}」',
  },
  'parse.duplicateWord': {
    vi: 'Trùng với một từ đã có ở phía trên, dòng này bị bỏ qua',
    ja: '上に同じ単語があるため、この行は無視されます',
  },
  'parse.duplicateVerb': {
    vi: 'Trùng với một động từ đã có ở phía trên, dòng này bị bỏ qua',
    ja: '上に同じ動詞があるため、この行は無視されます',
  },
  'parse.badColumnsConversation': {
    vi: 'Mỗi dòng phải là "TIẾNG NHẬT|TIẾNG VIỆT" hoặc "NGƯỜI NÓI|TIẾNG NHẬT|TIẾNG VIỆT"',
    ja: '各行は「日本語|ベトナム語」または「話者|日本語|ベトナム語」の形式にしてください',
  },
  'parse.duplicateSentence': {
    vi: 'Trùng với một câu đã có ở phía trên, dòng này bị bỏ qua',
    ja: '上に同じ文があるため、この行は無視されます',
  },
  'parse.column.hanViet': { vi: 'âm Hán Việt', ja: '漢越音' },
  'parse.column.japanese': { vi: 'tiếng Nhật', ja: '日本語' },
  'parse.column.vietnamese': { vi: 'nghĩa tiếng Việt', ja: 'ベトナム語訳' },
  'parse.column.masu': { vi: 'thể Mậu', ja: 'ます形' },
  'parse.column.group': { vi: 'nhóm', ja: 'グループ' },

  // ── Lỗi tải dữ liệu ────────────────────────────────────────────────────
  'error.lessonIndex': {
    vi: 'Không đọc được danh sách bài học (public/lessons/index.json). Hãy chạy "npm run generate" để sinh dữ liệu từ thư mục data-source/.',
    ja: 'レッスン一覧（public/lessons/index.json）を読み込めません。"npm run generate" を実行して data-source/ からデータを生成してください。',
  },

  // ── Tiêu đề tab theo trang ─────────────────────────────────────────────
  'route.import': { vi: 'Nạp bài học mới', ja: 'レッスン追加' },
  'route.lesson': { vi: 'Chi tiết bài học', ja: 'レッスン詳細' },
  // Trùng chữ với nhãn tab tương ứng: tiêu đề tab trình duyệt mà gọi tên khác thì
  // mở lại lịch sử duyệt web không biết đâu là màn hình nào.
  'route.grammar': { vi: 'Ngữ pháp minano', ja: '皆の日本語 文法' },
  'route.grammarLesson': { vi: 'Bài ngữ pháp', ja: '文法レッスン' },
  'route.exercise': { vi: 'Bài tập bổ trợ', ja: '補助練習' },
  'route.exerciseDetail': { vi: 'Nội dung bài tập', ja: '練習問題の詳細' },
  'route.kanji': { vi: 'Danh sách Kanji', ja: '漢字一覧' },
  'route.kanjiDetail': { vi: 'Chữ Kanji', ja: '漢字' },
  'route.radical': { vi: 'Danh sách bộ thủ', ja: '部首一覧' },
  'route.radicalDetail': { vi: 'Bộ thủ', ja: '部首' },
  'route.practice': { vi: 'Đang luyện tập', ja: '練習中' },
  'route.result': { vi: 'Kết quả luyện tập', ja: '練習結果' },
} as const satisfies Record<string, Entry>;

export type MessageKey = keyof typeof MESSAGES;
