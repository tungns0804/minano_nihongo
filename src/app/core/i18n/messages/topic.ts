/** Tab từ vựng theo chủ đề. Quy ước chung: xem `../messages.ts`. */

import type { Entry } from './entry';

export const TOPIC_MESSAGES = {
  // Danh sách chữ Hán từ N5 tới N3, mỗi chữ kèm các từ dùng chữ đó (xem core/kanji/).
  'topic.title': { vi: 'Từ vựng theo chủ đề', ja: 'テーマ別 単語' },
  'topic.subtitle': {
    vi: '20 chủ đề hay ra trong đề JLPT N3. Cùng kho từ với các bài minano — chỉ gom lại theo tình huống, nên một từ gặp ở đây là gặp lần thứ hai trong ngữ cảnh khác.',
    ja: 'JLPT N3でよく出る20のテーマ。皆の日本語の単語と同じものを場面別にまとめ直したので、ここで出会う単語は別の文脈での二度目の出会いになります。',
  },
  'topic.search': { vi: 'Tìm chủ đề…', ja: 'テーマを検索…' },
  'topic.count': { vi: '{count} chủ đề', ja: '{count}テーマ' },
  'topic.wordCount': { vi: '{count} từ', ja: '{count}語' },
  'topic.fromLessons': { vi: 'gom từ {count} bài', ja: '{count}課から' },
  'topic.fromLessons.title': {
    vi: 'Số bài học mà chủ đề này rút từ ra — mở chủ đề là đỡ được bấy nhiêu lần lật bài.',
    ja: 'このテーマが単語を集めた課の数。テーマを開けば、その回数だけ課をめくらずに済みます。',
  },
  'topic.back': { vi: '← Danh sách chủ đề', ja: '← テーマ一覧' },
  'topic.noMatch.text': {
    vi: 'Thử từ khoá ngắn hơn — ví dụ “gia dinh”, “an uong” hoặc 家族.',
    ja: 'もっと短い語で試してください。例：「家族」「食べ物」。',
  },
  'topic.sourceNote': {
    vi: 'Mọi từ ở đây đều lấy từ chính kho từ của ứng dụng, không có từ nào soạn thêm — nghĩa và cách đọc luôn khớp với bài học gốc.',
    ja: 'ここの単語はすべてアプリ内の既存の単語から取っており、新たに書き足したものはありません。意味と読み方は元のレッスンと常に一致します。',
  },
} as const satisfies Record<string, Entry>;
