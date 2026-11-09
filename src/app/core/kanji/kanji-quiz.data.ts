/**
 * Đề trắc nghiệm Kanji theo bài — chép tay từ đề người dùng đưa vào, mỗi bài một mục.
 *
 * Cú pháp chữ giống đề luyện N4 (`exercises/taisaku-n4.data.ts`):
 *
 *   〈…〉        phần gạch chân — chữ đang hỏi
 *   {漢字|かな}  furigana, chỉ ghi cho chữ ngoài phạm vi bài mà câu bắt buộc phải có
 *
 * Đáp án ghi bằng SỐ THỨ TỰ 1–4 như đề, không chép lại chữ: sửa lựa chọn mà quên sửa
 * đáp án thì `npm run verify:kanji-quiz` bắt được.
 *
 * Thêm một bài: chép thêm một mục vào `KANJI_QUIZ_DATA`. Id câu (`n5-17-1-6`) là khoá ★
 * và khoá lịch ôn, nên KHÔNG đánh số lại câu của bài đã có.
 */

import type { KanjiLevel } from './kanji.model';

/** [đề có 〈phần gạch chân〉, bốn lựa chọn, đáp án đúng 1–4, nghĩa của chữ đang hỏi, mẹo nhớ] */
export type RawQuizItem = readonly [
  prompt: string,
  options: readonly string[],
  answer: number,
  meaning: string,
  tip: string,
];

export interface RawKanjiQuiz {
  level: KanjiLevel;
  lesson: number;
  /** 問題1: chữ Hán gạch chân → chọn cách đọc. */
  reading: readonly RawQuizItem[];
  /** 問題2: từ viết kana gạch chân → chọn cách viết kanji. */
  writing: readonly RawQuizItem[];
}

export const KANJI_QUIZ_DATA: readonly RawKanjiQuiz[] = [
  // ── N5 · Bài 17 ──────────────────────────────────────────────────────────
  // Bản người dùng dán vào mất dấu gạch chân, nên chữ gạch chân là suy ra từ bốn lựa
  // chọn. Câu 1-6 có hai chữ 花 (花びん, 花を) mà lựa chọn có cả はな lẫn か: chọn gạch
  // 花を — gạch chân hiện trên đề nên câu hỏi vẫn rõ ràng.
  //
  // Sửa so với đề gốc (đề gốc sai, giữ nguyên là dạy sai):
  //  - 1-10 「私の夢は銀行員になりたいです」: "ước mơ" không "muốn" được → になることです.
  //  - 2-5 「そのあめぎはだれですか」: 雨着 đọc あまぎ (雨 → あま như 雨戸), và hỏi "của
  //    ai" phải là だれの → 「そのあまぎはだれのですか」.
  {
    level: 'N5',
    lesson: 17,
    reading: [
      [
        '今日は　〈天気〉が　いいです。',
        ['てんき', 'でんき', 'せんき', 'げんき'],
        1,
        'thời tiết',
        'でんき là 電気 (điện), げんき là 元気 (khỏe).',
      ],
      [
        '〈若者〉は　えいがを　おそく　見ます。',
        ['わかもの', 'わかもつ', 'わかしゃ', 'わかじゃ'],
        1,
        'người trẻ',
        '者 đọc もの (âm kun) trong 若者; しゃ là âm on, dùng trong 医者, 学者.',
      ],
      [
        '{将来|しょうらい}は　〈医者〉に　なりたいです。',
        ['いじゃ', 'いしゃ', 'いじょ', 'いしゅ'],
        2,
        'bác sĩ',
        'しゃ: âm trong (không có ゛), không phải しゅ hay しょ.',
      ],
      [
        '日本は　六月に　〈雨〉が　たくさん　ふります。',
        ['あめ', 'もり', 'うみ', 'あぬ'],
        1,
        'mưa',
        'もり là 森 (rừng), うみ là 海 (biển).',
      ],
      [
        '〈雨戸〉を　あけてください。',
        ['うど', 'あめと', 'あめど', 'あまど'],
        4,
        'cửa chớp chắn mưa',
        '雨 đứng đầu từ ghép đổi thành あま (雨戸, 雨着, 雨水), còn 戸 と biến âm thành ど.',
      ],
      [
        'テーブルの　上の　花びんに　〈花〉を　入れてください。',
        ['はな', 'か', 'うみ', 'やま'],
        1,
        'hoa',
        '花 đứng một mình đọc はな; か là âm on, như trong 花びん (花瓶 かびん).',
      ],
      [
        'わたしは　Riki会社の　会社〈員〉です。',
        ['しゃ', 'にん', 'じん', 'いん'],
        4,
        'nhân viên (会社員: nhân viên công ty)',
        '員 = いん: 会社員, 銀行員, 駅員. しゃ là 社, にん / じん là 人.',
      ],
      [
        '〈天〉ぷらが　好きです。',
        ['でん', 'てん', 'せん', 'けん'],
        2,
        'tempura (天ぷら)',
        '天 = てん, như 天気. Không có ゛.',
      ],
      [
        'クリスマスの　プレゼントは　バラの　〈花束〉です。',
        ['かたば', 'たけたば', 'はなたば', 'やまたば'],
        3,
        'bó hoa',
        '束 đọc たば; 花 ở đây đọc はな (âm kun) chứ không phải か.',
      ],
      [
        '私の　{夢|ゆめ}は　〈銀行員〉に　なることです。',
        ['ぎんこういん', 'ぎんこうしゃ', 'ぎんこうしん', 'ぎんこうにん'],
        1,
        'nhân viên ngân hàng',
        '員 = いん, như 会社員, 駅員.',
      ],
    ],
    writing: [
      [
        '午前中は　〈おおあめ〉に　なりますよ。',
        ['高雨', '小雨', '多雨', '大雨'],
        4,
        'mưa to',
        '小雨 là こさめ (mưa nhỏ), 多雨 là たう (lượng mưa nhiều).',
      ],
      [
        'この　〈はなや〉は　とても　有名です。',
        ['本屋', '魚屋', '花屋', '竹屋'],
        3,
        'tiệm hoa',
        '屋 (や) = cửa hàng: 本屋 ほんや là hiệu sách, 魚屋 さかなや là tiệm cá.',
      ],
      [
        '私の　兄は　〈えきいん〉です。',
        ['駅車', '駅人', '駅員', '駅者'],
        3,
        'nhân viên nhà ga',
        'Người làm việc ở một nơi: hậu tố 員 (いん).',
      ],
      [
        'この　〈かかりいん〉は　こわいですよ。',
        ['係社', '係員', '係人', '係者'],
        2,
        'nhân viên phụ trách',
        '員 = いん, cùng kiểu 駅員, 会社員.',
      ],
      [
        'その　〈あまぎ〉は　だれのですか。',
        ['雨着', '花着', '竹着', '石着'],
        1,
        'áo mưa',
        '雨 đứng đầu từ ghép đọc あま, như 雨戸 (あまど).',
      ],
      [
        '先週の　土曜日　友達と　こうえんへ　〈はなび〉を　みに　行きました。',
        ['火山', '草花', '花火', '花竹'],
        3,
        'pháo hoa',
        '火山 là かざん (núi lửa), 草花 là くさばな (hoa cỏ).',
      ],
      [
        'アルベルト・アインシュタインは　有名な　〈かがくしゃ〉です。',
        ['火学者', '科学者', '火学若', '木学若'],
        2,
        'nhà khoa học',
        '科 (khoa) chứ không phải 火; 者 chứ không phải 若 — hai chữ trông gần giống nhau.',
      ],
      [
        'あの　〈けんきゅうしゃ〉は　{世界|せかい}で　とても　有名です。',
        ['研究生', '研究者', '研究員', '研究人'],
        2,
        'nhà nghiên cứu',
        '研究生 là けんきゅうせい (nghiên cứu sinh), 研究員 là けんきゅういん (nghiên cứu viên).',
      ],
      [
        'こんどの　日曜日に　〈おはなみ〉に　行きます。',
        ['お化見', 'お雨見', 'お竹見', 'お花見'],
        4,
        'ngắm hoa (anh đào)',
        '化 trông giống phần dưới của 花 — đừng nhầm.',
      ],
      [
        '母は　〈はな〉が　好きです。',
        ['竹', '川', '海', '花'],
        4,
        'hoa',
        '竹 たけ (tre), 川 かわ (sông), 海 うみ (biển).',
      ],
    ],
  },
];
