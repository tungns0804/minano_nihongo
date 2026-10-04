/**
 * Nội dung bài tập "Luyện tập ngữ pháp N4", chép từ tài liệu "TỔNG HỢP NGỮ PHÁP N4".
 *
 * Giữ đúng thứ tự, cách chia mục và lời giải thích của tài liệu. Những chỗ sửa so với
 * bản gốc chỉ là lỗi gõ hiển nhiên (chữ thừa, thiếu chữ, sai cách đọc) và vài bản dịch
 * nói ngược câu tiếng Nhật đi kèm — mỗi chỗ đều có ghi chú ngay tại dòng đó.
 *
 * Cú pháp câu ví dụ ({漢字|かな}, [a/b], [a/]) và kiểu dữ liệu: xem `n4-grammar.model.ts`.
 * `npm run verify:n4` kiểm toàn bộ file này: cú pháp, id trùng, ý nghĩa trùng…
 */

import type { GrammarTable } from '../lessons/vocabulary.model';
import { hashId } from '../lessons/vocabulary-parser';
import { plainText } from '../translation/markup';
import type {
  N4Example,
  N4Point,
  N4Quiz,
  N4Section,
  N4Usage,
} from './n4-grammar.model';

/** Cách nói tương đương được chấp nhận khi chấm, xem `N4Example.japaneseAlt`. */
interface Alt {
  ja?: readonly string[];
  vi?: readonly string[];
}

/** [câu tiếng Nhật, bản dịch, lời giải thích, cách nói tương đương] */
type RawExample = readonly [japanese: string, vietnamese: string, note?: string, alt?: Alt];

interface RawUsage {
  title?: string;
  detail?: string;
  reference?: true;
  examples: readonly RawExample[];
}

interface RawPoint {
  id: string;
  pattern: string;
  meaning?: string;
  group?: string;
  structures?: readonly string[];
  explanation?: readonly string[];
  tables?: readonly GrammarTable[];
  notes?: readonly string[];
  /** [câu sai, vì sao sai / nói thế nào mới đúng] */
  wrong?: readonly (readonly [japanese: string, note: string])[];
  /** Viết tắt cho một nhóm "Ví dụ" không tên đứng TRƯỚC `usages`. */
  examples?: readonly RawExample[];
  usages?: readonly RawUsage[];
}

/** [câu hỏi, các lựa chọn, đáp án, chú thích] */
type RawQuizItem = readonly [prompt: string, options: readonly string[], answer: string, note?: string];

interface RawSection {
  id: string;
  title: string;
  intro?: readonly string[];
  points: readonly RawPoint[];
  quiz?: { instruction: string; items: readonly RawQuizItem[] };
}

function table(caption: string, headers: string[], rows: string[][]): GrammarTable {
  return { caption, headers, rows };
}

const RAW_SECTIONS: readonly RawSection[] = [
  // ══ 1 ══════════════════════════════════════════════════════════════════
  {
    id: 'n-desu',
    title: '～んです',
    points: [
      {
        id: 'n-desu',
        pattern: '～んです',
        meaning: 'Giải thích, nêu nguyên nhân; khi hỏi thì ngụ ý quan tâm, muốn biết thêm',
        structures: ['[Thể thường (普通形)] ＋ んです', '「～だ」 → ～なんです'],
        tables: [
          table('Ví dụ', ['Thể thường', '～んです'], [
            ['いく (đi)', 'いくんです'],
            ['あった (đã gặp)', 'あったんです'],
            ['こない (không đến)', 'こないんです'],
            ['すきだ (thích)', 'すきなんです'],
            ['がくせいだ (là sinh viên)', 'がくせいなんです'],
            ['あつい (nóng)', 'あついんです'],
          ]),
          table('Cách nói ít trang trọng (カジュアル) của 「～んです」', ['ていねい', 'カジュアル — おとこ', 'カジュアル — おんな'], [
            ['～んですか。', '～の？', '～の？'],
            ['～んです。', '～んだ。', '～の。'],
            ['～んですが、～', '～んだけど、～', '～んだけど、～'],
          ]),
        ],
        notes: [
          'Mẫu câu 「～んです」 chủ yếu được dùng để giải thích hoặc đưa ra nguyên nhân cho sự việc gì đó. Khi dùng dưới dạng câu hỏi thì ngụ ý quan tâm, hoặc có nhu cầu biết thêm thông tin từ người đối diện. Vì vậy không dùng mẫu câu này để hỏi những người không liên quan hoặc không có trách nhiệm phải biết lý do hay nguyên nhân đó.',
        ],
        wrong: [
          [
            'せんせい、マイクさんは まだこないんですか。',
            'Thưa cô, bạn Mike vẫn chưa đến ạ? — Việc Mike có đến hay không, cô giáo không phải là người trực tiếp biết, nên cô giáo không có nghĩa vụ phải tìm hiểu lý do (có thể Mike đã thông báo trước cho cô giáo, nhưng khi mình chưa biết rõ điều này mà lại hỏi trực tiếp cô giáo như vậy thì không được lịch sự). Thay vì dùng 「～んです」, chỉ cần câu hỏi thông thường: せんせい、マイクさんは まだきていませんか。',
          ],
        ],
        usages: [
          {
            title: 'Thể hiện sự quan tâm đến người đối diện, muốn hỏi thêm thông tin hoặc cần lời giải thích về vấn đề gì đó',
            examples: [
              [
                'どこで かったんですか。',
                'Cậu mua ở đâu thế?',
                'Nhìn thấy bạn cầm đồ vật mới. Bạn trả lời: しんじゅくで かいました。(Tớ mua ở Shinjuku.)',
              ],
              [
                'にほんごが じょうずですね。にほんに いったことがあるんですか。',
                'Cậu giỏi tiếng Nhật thế. Cậu đến Nhật bao giờ chưa?',
                'Bạn trả lời: いいえ、いったことが ありません。(Không, tớ chưa đến Nhật bao giờ.)',
              ],
            ],
          },
          {
            title: 'Đặt câu hỏi về nguyên nhân, lý do của việc gì đó & trả lời cho câu hỏi đó',
            examples: [
              ['どうしたんですか。', 'Anh sao thế?', 'Nhìn sắc mặt bạn.'],
              ['あたまが いたいんです。', 'Anh bị đau đầu.', 'Trả lời cho どうしたんですか。'],
              ['どうして おくれるんですか。', 'Sao cậu đến muộn thế?', 'おくれる: đến muộn'],
              [
                'バスが なかなかこなかったんです。',
                'Tại xe buýt mãi không đến.',
                'Trả lời cho どうして おくれるんですか。 — なかなか～ない: mãi không …',
              ],
            ],
          },
          {
            title: 'Bổ sung, giải thích thêm cho thông tin mình đưa ra',
            examples: [
              [
                'きのう、わたしは がっこうを やすみました。ねつが あったんです。',
                'Hôm qua tớ nghỉ học. [Vì/] tớ bị sốt.',
                'ねつがある: bị sốt',
              ],
              [
                'きもちが わるいんです。はやくかえっても いいですか。',
                'Tâm trạng em không tốt lắm. Em có thể về sớm được không?',
              ],
            ],
          },
          {
            title: 'Mở đầu câu chuyện, thu hút sự chú ý của người đối diện trước khi vào chủ đề chính',
            examples: [['すみません、おねがいが あるんですが。', 'Xin lỗi, em có việc muốn nhờ ạ.']],
          },
          {
            title: 'Cách nói ít trang trọng (カジュアル) của 「～んです」',
            examples: [
              ['どうしたの？あたま、いたいの？', 'Em sao thế? Đau đầu à?', 'おとこ (nam) nói.'],
              [
                'ううん。あたまはいたくないんだけど、ちょっと{気分|きぶん}がわるいの。',
                'Không, em không đau đầu, nhưng mà tâm trạng hơi khó chịu chút.',
                'おんな (nữ) trả lời.',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 2 ══════════════════════════════════════════════════════════════════
  {
    id: 'hou-ga-ii',
    title: '～ほうがいいです',
    points: [
      {
        id: 'hou-ga-ii',
        pattern: '～ほうがいいです',
        meaning: 'Nên … / không nên … (lời khuyên, đề xuất)',
        explanation: [
          'Mẫu câu này được dùng để đưa ra lời khuyên, đề xuất: Tốt hơn là nên… / không nên …',
        ],
        structures: [
          '[Động từ thể た] ＋ ほうがいいです: Nên làm gì',
          '[Động từ thể ない] ＋ ほうがいいです: Không nên làm gì',
        ],
        examples: [
          ['かぜなら、くすりを すぐのんだほうがいいですよ。', 'Nếu bị cảm thì cậu nên uống thuốc ngay đi.'],
          ['やさいを たくさんたべたほうがいいですね。', 'Nên ăn thật nhiều rau mới tốt nhỉ.', 'やさい: rau、たくさん: nhiều'],
          ['おさけを たくさんのまないほうがいい。', 'Không nên uống nhiều rượu.'],
          [
            'そとに でかけないほうがいいです。{大雨|おおあめ}なんですよ。',
            'Đừng nên ra ngoài thì hơn. Mưa to đấy.',
            'そと: ngoài、でかける: ra ngoài、大雨（おおあめ）: mưa to',
          ],
        ],
      },
    ],
  },

  // ══ 3 ══════════════════════════════════════════════════════════════════
  {
    id: 'noni',
    title: '～のに: Mặc dù',
    points: [
      {
        id: 'noni',
        pattern: '～のに',
        meaning: 'Mặc dù … nhưng … (hai vế có ý nghĩa đối lập nhau)',
        explanation: ['Mẫu câu diễn tả sự tương phản. Hai vế câu ý nghĩa đối lập nhau: “Mặc dù … nhưng …”.'],
        structures: [
          '[Động từ thể thường (普通形)] ＋ のに',
          '[Tính từ -i] ＋ のに',
          '[Tính từ -na ＋ な] ＋ のに',
          '[Danh từ ＋ な] ＋ のに',
        ],
        examples: [
          // Bản gốc: 「けっこうưおいしい」 — chữ "ư" lạc vào giữa câu tiếng Nhật.
          ['このレストランは{安|やす}いのに、けっこうおいしいです。', 'Nhà hàng này tuy rẻ nhưng khá ngon.', 'けっこう: khá'],
          ['{春|はる}なのに、まだ{寒|さむ}いです。', 'Mặc dù đã là mùa xuân rồi nhưng vẫn lạnh.'],
          [
            '{薬|くすり}を{飲|の}んだのに、まだ ねつが {下|さ}がりません。',
            'Mặc dù đã uống thuốc rồi nhưng vẫn không hạ sốt.',
            'ねつがさがる: hạ sốt',
          ],
          ['{家|いえ}が{近|ちか}いのに、{会社|かいしゃ}に{遅|おく}れた。', 'Mặc dù nhà thì gần nhưng vẫn đến công ty muộn.'],
        ],
      },
    ],
  },

  // ══ 4 ══════════════════════════════════════════════════════════════════
  {
    id: 'nagara',
    title: '～ながら: vừa … vừa',
    points: [
      {
        id: 'nagara',
        pattern: '～ながら',
        meaning: 'Vừa … vừa … (hai hành động cùng lúc, hành động ở vế sau là chính)',
        structures: ['[Động từ thể ます (bỏ ます)] ＋ ながら'],
        tables: [
          table('Ví dụ', ['Thể từ điển', 'Thể ます', '～ながら'], [
            ['{書|か}く', '{書|か}きます', '{書|か}きながら'],
            ['{話|はな}す', '{話|はな}します', '{話|はな}しながら'],
          ]),
        ],
        explanation: [
          'Mẫu câu này diễn tả một hành động diễn ra cùng lúc với một hành động khác. Hành động được miêu tả ở vế 「～ながら」 đứng trước, hành động ở vế sau là hành động chính.',
        ],
        examples: [
          ['テレビをみながら、ごはんを{食|た}べます。', 'Tôi vừa xem ti vi vừa ăn cơm.', 'Ăn cơm là hành động chính.'],
          [
            '{音楽|おんがく}を{聞|き}きながら、お{茶|ちゃ}を{飲|の}んでいます。',
            'Tôi vừa nghe nhạc vừa đang uống trà.',
            'Uống trà là hành động chính.',
          ],
          [
            '{子供|こども}たちは{笑|わら}いながら、ゲームをしています。',
            'Lũ trẻ vừa cười vừa chơi game.',
            'Chơi game là hành động chính.',
          ],
        ],
      },
    ],
  },

  // ══ 5 ══════════════════════════════════════════════════════════════════
  {
    id: 'no-danh-tu-hoa',
    title: '～のが、～のは、～のに',
    intro: [
      'Ở phần ngữ pháp N5, chúng ta đã học danh từ hóa động từ bằng cách thêm 「こと」 vào sau thể thường (普通形) của động từ. Trong bài này chúng ta sẽ học một cách khác để danh từ hóa động từ, đó là các cách dùng với 「の」.',
    ],
    points: [
      {
        id: 'no-thay-koto',
        pattern: '～のは／～のが／～のを',
        meaning: 'Danh từ hóa động từ: việc …, cái việc … (dùng thay thế được cho こと)',
        group: 'no',
        explanation: ['Mẫu câu 1: 「の」 giống với 「こと」, dùng thay thế được cho nhau.'],
        structures: [
          '[Động từ thể từ điển (辞書形)] のは ＋ [tính từ]',
          '[Động từ thể từ điển (辞書形)] のが ＋ [tính từ]',
          '[Động từ thể thường (普通形)] のを ＋ [わすれました/ しっています]',
        ],
        examples: [
          // Bản gốc thiếu 「をお」: 「単語（たんご）ぼえるのは…」.
          ['{単語|たんご}をおぼえるのはたいへんです。', 'Việc nhớ từ thật là vất vả.'],
          ['{寝|ね}るのがすきです。', 'Tôi thích ngủ.'],
          ['{電気|でんき}を{消|け}すのをわすれました。', 'Tôi đã quên không tắt điện rồi.'],
          ['{彼女|かのじょ}が{仕事|しごと}をやめたのをしっています。', 'Tôi biết việc cô ấy đã nghỉ làm.'],
          ['{死|し}ぬのがこわいです。', 'Cái chết thật là đáng sợ.'],
        ],
      },
      {
        id: 'no-wa-danh-tu',
        pattern: '～のは＋[danh từ]です',
        meaning: 'Cái / người / nơi / lúc … là … (đưa danh từ phía sau lên làm trọng tâm; không dùng こと)',
        group: 'no',
        explanation: ['Mẫu câu 2: Chỉ dùng 「の」, không dùng 「こと」.'],
        structures: [
          '[Động từ thể thường (普通形)] のは ＋ [danh từ]',
          '[Danh từ/ Tính từ -na] なのは ＋ [danh từ]',
        ],
        notes: [
          'Danh từ ở phía sau 「のは」 hoặc 「なのは」 chỉ người, vật, địa điểm, thời gian hoặc nguyên nhân. Trong trường hợp là đồ vật thì 「の」 có thể thay bằng 「もの」.',
        ],
        examples: [
          ['{私|わたし}が{生|う}まれたのは {京都|きょうと}です。', '[Nơi tôi sinh ra là Kyoto/Kyoto là nơi tôi sinh ra].'],
          [
            '{独身|どくしん}なのは {田中|たなか}さんだけです。',
            '[Người còn độc thân chỉ có anh Tanaka/Chỉ có anh Tanaka là còn độc thân].',
          ],
          ['ちょうどいいのは このサイズです。', '[Vừa nhất là cỡ này/Cỡ này là vừa nhất].'],
          ['{結婚|けっこん}をきめたのは こどもができたからです。', 'Quyết định kết hôn là vì đã có con.'],
          ['{会議|かいぎ}が{始|はじ}まるのは 10{時|じ}です。', 'Giờ họp bắt đầu là 10 giờ.'],
          ['もっとやすい[の/もの]は これです。', 'Cái rẻ hơn là cái này.'],
        ],
      },
      {
        id: 'no-ni-muc-dich',
        pattern: '～のに＋つかいます／べんりです',
        meaning: 'Dùng để …, tiện / có ích cho việc … (nói về mục đích sử dụng)',
        group: 'no',
        explanation: ['Mẫu câu 3: Chỉ dùng 「の」, không dùng 「こと」. Mẫu câu này dùng khi nói đến mục đích sử dụng.'],
        structures: ['[Động từ thể từ điển (辞書形)] のに ＋ [つかいます/ べんりです/ やくにたちます/ いいです]'],
        examples: [
          ['{爪|つめ}{切|き}りは {爪|つめ}をきるのに {使|つか}います。', 'Cái vật cắt móng tay là dùng để cắt móng tay.'],
          ['やかんは おゆをわかすのに つかいます。', 'Ấm nước là dùng để đun sôi nước.'],
          [
            '{電子辞書|でんしじしょ}は {漢字|かんじ}の{意味|いみ}をしらべるのに[{役|やく}に{立|た}ちます/べんりです]。',
            'Từ điển điện tử rất [hữu ích/tiện lợi] cho việc tra nghĩa của kanji.',
          ],
        ],
      },
    ],
  },

  // ══ 6 ══════════════════════════════════════════════════════════════════
  {
    id: 'the-kha-nang',
    title: 'Động từ thể khả năng',
    intro: [
      'Chúng ta đã học một mẫu câu chỉ khả năng là ～ことができる. Trong bài này, chúng ta sẽ học cách chia động từ thể khả năng hay 可能形 (かのうけい).',
    ],
    points: [
      {
        id: 'kha-nang',
        pattern: '可能形（書ける・食べられる）',
        meaning: 'Có thể làm gì (chia động từ sang thể khả năng)',
        tables: [
          table('Cách chia động từ thể khả năng', ['Nhóm', 'Thể từ điển', 'Thể khả năng', 'Nghĩa'], [
            ['Nhóm 1: う → える', '{書|か}く', '{書|か}ける', 'viết'],
            ['Nhóm 1: う → える', '{話|はな}す', '{話|はな}せる', 'nói, kể chuyện'],
            ['Nhóm 1: う → える', '{会|あ}う', '{会|あ}える', 'gặp'],
            ['Nhóm 2: る → られる', '{食|た}べる', '{食|た}べられる（{食|た}べれる）', 'ăn'],
            ['Nhóm 2: る → られる', '{見|み}る', '{見|み}られる（{見|み}れる）', 'nhìn, xem'],
            ['Nhóm 2: る → られる', '{借|か}りる', '{借|か}りられる（{借|か}りれる）', 'vay, mượn'],
            ['Nhóm 3 (bất quy tắc)', 'する', 'できる', ''],
            ['Nhóm 3 (bất quy tắc)', '{来|く}る', '{来|こ}られる', ''],
          ]),
        ],
        structures: ['[Danh từ] ＋ が (thay cho を) ＋ động từ thể khả năng: Có thể làm gì đó'],
        notes: [
          'Động từ nhóm 2: đôi khi 「ら」 được lược bỏ và chỉ dùng 「れる」 (食べれる, 見れる, 借りれる).',
          'Không dùng thể khả năng với 2 động từ 分かる (わかる: hiểu) và 知る (しる: biết) vì bản thân hai động từ này đã hàm nghĩa chỉ khả năng.',
        ],
        examples: [
          ['{私|わたし}は{漢字|かんじ}が{書|か}けます。', 'Tôi có thể viết được kanji.', '漢字: kanji'],
          ['{英語|えいご}が {話|はな}せません。', 'Tôi không nói được tiếng Anh.'],
          ['あさ 1{時|じ}まで、{勉強|べんきょう}できます。', 'Tôi có thể học đến 1h sáng.'],
          ['{今日|きょう}のパーティーに {来|こ}られない。', 'Tôi không thể đến buổi tiệc hôm nay.'],
        ],
      },
    ],
  },

  // ══ 7 ══════════════════════════════════════════════════════════════════
  {
    id: 'koto-ga-dekiru',
    title: '～ことができる: có thể …',
    points: [
      {
        id: 'koto-ga-dekiru',
        pattern: '～ことができる',
        meaning: 'Có thể làm gì (diễn đạt khả năng làm việc gì đó)',
        explanation: ['Mẫu câu này diễn đạt khả năng làm việc gì đó.'],
        structures: [
          '[Động từ thể từ điển] ＋ こと ＋ が ＋ できる: Có thể làm gì',
          '[Động từ thể từ điển] ＋ こと ＋ が ＋ できない: Không thể làm gì',
        ],
        usages: [
          {
            title: 'Khẳng định',
            examples: [
              ['{英語|えいご}を{話|はな}すことができます。', 'Tôi có thể nói tiếng Anh.'],
              ['すしを{食|た}べることができる。', 'Tôi có thể ăn sushi.'],
              ['{漢字|かんじ}を{書|か}くことができます。', 'Tôi có thể viết kanji.'],
            ],
          },
          {
            title: 'Thể phủ định',
            examples: [
              ['{英語|えいご}を{話|はな}すことができません。', 'Tôi không thể nói tiếng Anh.'],
              ['すしを{食|た}べることができない。', 'Tôi không thể ăn sushi.'],
              ['{漢字|かんじ}を{書|か}くことができません。', 'Tôi không thể viết kanji.'],
            ],
          },
        ],
      },
    ],
  },

  // ══ 8 ══════════════════════════════════════════════════════════════════
  {
    id: 'kata',
    title: '～かた: Cách (làm gì)',
    points: [
      {
        id: 'kata',
        pattern: '～かた（方）',
        meaning: 'Cách (làm gì), phương pháp làm gì đó',
        explanation: ['Mẫu câu này diễn đạt cách/ phương pháp làm gì đó.'],
        structures: ['Động từ thể ます (bỏ ます) ＋ 方 (かた)'],
        tables: [
          table('Ví dụ', ['Thể ます', '～方', 'Nghĩa'], [
            ['{読|よ}みます', '{読|よ}み{方|かた}', 'cách đọc'],
            ['{話|はな}します', '{話|はな}し{方|かた}', 'cách nói chuyện'],
            ['{使|つか}います', '{使|つか}い{方|かた}', 'cách sử dụng'],
          ]),
        ],
        examples: [
          ['このりょうりの{作|つく}り{方|かた}をしっていますか。', 'Cậu biết cách làm món ăn này không?'],
          ['このゲームのあそびかたがわかりますか。', 'Cậu biết cách chơi game này không?'],
          ['このカメラの{使|つか}い{方|かた}をおしえてください。', 'Làm ơn dạy cho tôi cách sử dụng máy ảnh này.'],
        ],
      },
    ],
  },

  // ══ 9 ══════════════════════════════════════════════════════════════════
  {
    id: 'toori-ni',
    title: '～とおりに: theo như …',
    points: [
      {
        id: 'toori-ni',
        pattern: '～とおりに',
        meaning: 'Theo như, theo đúng như … (làm dựa theo lời nói, hành động hay nội dung có sẵn)',
        structures: ['[Động từ thể từ điển/ thể た] ＋ とおりに', '[Danh từ ＋ の] ＋ とおりに'],
        explanation: [
          'Mẫu câu diễn tả việc làm một điều gì đó, theo như/ dựa theo một hành động, lời nói, hay một nội dung nào đó có sẵn. Mẫu này thường dùng trong những lời chỉ dẫn.',
        ],
        examples: [
          ['{私|わたし}が{書|か}いたとおりに、{書|か}いてください。', 'Hãy viết theo đúng như tôi đã viết.'],
          ['{彼|かれ}がやるとおりに、やってください。', 'Hãy làm theo như anh ấy làm.'],
          ['{説明書|せつめいしょ}のとおりに、{組|く}み{立|た}てました。', 'Tôi đã lắp ráp theo sách hướng dẫn.'],
        ],
      },
    ],
  },

  // ══ 10 ═════════════════════════════════════════════════════════════════
  {
    id: 'the-y-chi',
    title: 'Động từ thể ý chí',
    points: [
      {
        id: 'y-chi',
        pattern: '意思形（書こう・食べよう）',
        meaning: '… thôi! / … nào! (rủ rê, đề xuất, ý muốn làm gì đó)',
        explanation: [
          'Động từ thể ý chí, trong tiếng Nhật gọi là 意思形 (いしけい). Nó diễn đạt ý chí muốn làm gì đó, muốn mời mọc, rủ rê, hay đề xuất một việc gì đó.',
        ],
        tables: [
          // Ô "dạng lịch sự" của 買う trong bản gốc bị dán đè bằng một đường link họp
          // Zoom; điền lại 買いましょう theo đúng quy tắc của hai dòng bên dưới.
          table('Cách chia động từ thể ý chí', ['Nhóm', 'Thể từ điển', 'Thể ý chí', 'Dạng lịch sự'], [
            ['Nhóm 1: う → おう', '{買|か}う', '{買|か}おう (mua thôi)', '{買|か}いましょう'],
            ['Nhóm 1: う → おう', '{待|ま}つ', '{待|ま}とう (đợi thôi)', '{待|ま}ちましょう'],
            ['Nhóm 1: う → おう', '{書|か}く', '{書|か}こう (viết thôi)', '{書|か}きましょう'],
            ['Nhóm 2: る → よう', '{食|た}べる', '{食|た}べよう (ăn thôi)', '{食|た}べましょう'],
            ['Nhóm 2: る → よう', '{見|み}る', '{見|み}よう (xem thôi)', '{見|み}ましょう'],
            ['Nhóm 3 (bất quy tắc)', 'する', 'しよう', 'しましょう'],
            ['Nhóm 3 (bất quy tắc)', '{来|く}る', '{来|こ}よう', '{来|き}ましょう'],
          ]),
        ],
        examples: [
          ['きょうから{日記|にっき}を{書|か}こう。', 'Từ hôm nay hãy viết nhật ký nào.'],
          ['あしたもう{一度|いちど}{来|こ}よう。', 'Mai lại đến lần nữa nào.', 'もう一度（もういちど）: một lần nữa'],
        ],
      },
    ],
  },

  // ══ 11 ═════════════════════════════════════════════════════════════════
  {
    id: 'you-to-omou',
    title: '～ようと思います/ ようと思っています',
    intro: [
      'Động từ thể ý chí nếu đứng một mình sẽ biểu thị lời mời, đề xuất cùng làm việc gì đó. Khi người nói muốn diễn đạt một ý định làm gì đó tới người nghe thì thể ý chí được dùng kèm với cụm 「と思います」.',
    ],
    points: [
      {
        id: 'you-to-omoimasu',
        pattern: '～ようと思います',
        meaning: 'Tôi định … (ý định tạm thời, chỉ nói về bản thân người nói)',
        group: 'du-dinh',
        structures: ['Động từ thể ý chí (V よう) ＋ と思います'],
        explanation: [
          '「と思います」 diễn đạt ý định tạm thời, mang tính chủ quan nên chỉ được dùng khi người nói diễn đạt ý định của bản thân mình. Không dùng ngôi thứ 3.',
        ],
        examples: [
          [
            'あした{早|はや}く{起|お}きようと{思|おも}います。',
            'Ngày mai tôi sẽ dậy sớm.',
            '早く（はやく）: sớm、起きる（おきる）: dậy',
          ],
        ],
      },
      {
        id: 'you-to-omotte-imasu',
        pattern: '～ようと思っています',
        meaning: 'Đang dự định … (ý định chắc chắn, đã có chuẩn bị; dùng được cho cả người khác)',
        group: 'du-dinh',
        structures: ['Động từ thể ý chí (V よう) ＋ と思っています'],
        explanation: [
          '「と思っています」 diễn đạt ý định chắc chắn, đã có chuẩn bị, có hàm nghĩa khách quan nên ngoài những ý định của bản thân người nói ra, thì mẫu câu này cũng có thể dùng để diễn tả ý định của người nghe hoặc người thứ ba.',
        ],
        // Bản gốc đánh dấu (ｘ) sau chính câu ví dụ cho quy tắc này, ngược với câu chữ
        // ngay trước nó — bỏ dấu (ｘ) đi, giữ câu ví dụ.
        notes: [
          'Tuy nhiên khi muốn xác nhận, hỏi lại về ý định của người nghe (người trực tiếp nói chuyện với mình) thì lại dùng mẫu 「と思いますか」: 木村さんは留学しようと思いますか。→ Anh Kimura có định đi du học không?',
        ],
        wrong: [
          ['{木村|きむら}さんは{留学|りゅうがく}しようと{思|おも}います。', 'Cách dùng sai: 「と思います」 không dùng để nói về ý định của người thứ ba.'],
        ],
        examples: [
          [
            '{夏休|なつやす}みに{旅行|りょこう}しようと{思|おも}っています。',
            'Nghỉ hè tôi sẽ đi du lịch.',
            '夏休み（なつやすみ）: nghỉ hè、旅行する（りょこうする）: đi du lịch',
          ],
          [
            '{木村|きむら}さんは{留学|りゅうがく}しようと{思|おも}っています。',
            'Anh Kimura dự định sẽ đi du học.',
            '留学する（りゅうがくする）: du học',
          ],
        ],
      },
    ],
  },

  // ══ 12 ═════════════════════════════════════════════════════════════════
  {
    id: 'you-ni-naru',
    title: '～ようになる/ ～なくなる',
    intro: [
      'Đây là mẫu câu diễn đạt sự chuyển biến về khả năng. 「～ようになる」 diễn đạt sự thay đổi từ tình trạng không thể sang có thể. 「～なくなる」 diễn đạt sự thay đổi từ tình trạng có thể sang không thể.',
      'Hai mẫu câu này dùng với động từ thể khả năng.',
    ],
    points: [
      {
        id: 'you-ni-naru',
        pattern: '～ようになる',
        meaning: 'Trở nên có thể … (biến chuyển từ không thể sang có thể)',
        group: 'bien-chuyen',
        structures: ['[Thể khả năng/ thể thường] ＋ ようになります'],
        explanation: ['Tình trạng không thể (できない状態) ➡ tình trạng có thể (できる状態).'],
        examples: [
          ['{話|はな}せるようになります。', 'Trở nên có thể nói được.', 'Biến chuyển.'],
          [
            'れんしゅうしたので、[{日本語|にほんご}を{話|はな}せるようになりました/{日本語|にほんご}を{話|はな}すことができるようになりました]。',
            'Vì luyện tập rất nhiều nên tôi đã có thể nói được tiếng Nhật.',
          ],
        ],
      },
      {
        id: 'naku-naru',
        pattern: '～なくなる',
        meaning: 'Trở nên không thể … nữa (biến chuyển từ có thể sang không thể)',
        group: 'bien-chuyen',
        structures: ['[Dạng phủ định của thể khả năng] ～ない → ～なくなります'],
        explanation: ['Tình trạng có thể (できる状態) ➡ tình trạng không thể (できない状態).'],
        examples: [
          ['{話|はな}せなくなります。', 'Trở nên không thể nói được.', 'Biến chuyển.'],
          [
            '{暑|あつ}くなりましたから、{夜|よる}よく{寝|ね}られなくなりました。',
            'Trời nóng hơn nên buổi tối không thể ngủ ngon được.',
            '暑い（あつい）: nóng',
          ],
        ],
      },
    ],
  },

  // ══ 13 ═════════════════════════════════════════════════════════════════
  {
    id: 'you-ni-suru',
    title: '～ようにする',
    points: [
      {
        id: 'you-ni-suru',
        pattern: '～ようにする／ようにしています',
        meaning: 'Cố gắng (làm / không làm) … (nỗ lực để thay đổi, làm đều đặn)',
        group: 'you-ni',
        structures: ['[Động từ thể từ điển/ thể ない] ＋ ようにする/ ようにしています'],
        explanation: [
          'Diễn tả ý định sẽ làm/ không làm việc gì đó, thường là nhấn mạnh sự cố gắng để đạt được sự thay đổi (thường là theo hướng tốt lên). 「ようにしています」 thể hiện là việc đó đang được thực hiện đều đặn.',
        ],
        notes: [
          'So sánh 「ようにする」 với 「ようになる」: 「ようになる」 diễn tả sự thay đổi đã có kết quả, đã hoàn thành và thường dùng với thể khả năng, còn 「ようにする」 mới chỉ diễn tả ý chí, ý định sẽ cố gắng, còn chưa rõ về mặt kết quả ra sao.',
        ],
        examples: [
          ['{野菜|やさい}を{毎日|まいにち}たくさん{食|た}べるようにしています。', 'Tôi cố gắng ăn thật nhiều rau mỗi ngày.'],
          ['{先生|せんせい}から{教|おし}えてくれたことを{忘|わす}れないようにします。', 'Tôi sẽ không quên những gì thầy cô đã dạy cho tôi.'],
          [
            '{健康|けんこう}のため、{週|しゅう}{三|さん}{回|かい}{運動|うんどう}するようにしています。',
            'Để khỏe mạnh tôi đang cố gắng vận động một tuần 3 lần.',
          ],
        ],
      },
      {
        id: 'you-ni-shite-kudasai',
        pattern: '～ようにしてください',
        meaning: 'Hãy cố gắng (làm / đừng làm) … (nhắc nhở, yêu cầu nhẹ nhàng, gián tiếp)',
        group: 'you-ni',
        structures: ['[Động từ thể từ điển/ thể ない] ＋ ようにしてください'],
        explanation: ['Diễn đạt sự nhắc nhở, yêu cầu mang tính nhẹ nhàng, gián tiếp.'],
        notes: ['Không dùng mẫu câu này để sai khiến, nhờ vả đối với hành động cần thực hiện ngay tại chỗ.'],
        // Bản gốc in câu đúng là 「すみなせんが」 — sửa thành すみませんが.
        wrong: [
          [
            'すみませんが、{塩|しお}を{取|と}るようにしてください。',
            'Hành động cần làm ngay tại chỗ thì nói: すみませんが、塩を取ってください。(Xin lỗi hãy lấy giúp tôi muối.)',
          ],
        ],
        examples: [
          ['{毎日|まいにち}{運動|うんどう}するようにしてください。', 'Hãy cố gắng vận động hàng ngày.'],
          ['{甘|あま}いものをたくさん{食|た}べないようにしてください。', 'Đừng ăn nhiều đồ ngọt.'],
        ],
      },
    ],
  },

  // ══ 14 ═════════════════════════════════════════════════════════════════
  {
    id: 'tsumori',
    title: '～つもりです: Sẽ/ định làm gì',
    points: [
      {
        id: 'tsumori',
        pattern: '～つもりです',
        meaning: 'Định làm gì (dự định đã nghĩ từ trước, chưa quyết định chính thức)',
        group: 'du-dinh',
        explanation: [
          'Dùng để diễn đạt một hành động sẽ làm hay một dự định nhưng chưa chắc chắn hoặc chưa được quyết định chính thức. Dự định này đã được suy nghĩ từ trước đó tới bây giờ chứ không phải là ý định bột phát, nảy ra ngay trong lúc nói.',
        ],
        structures: [
          '[Động từ thể từ điển] ＋ つもりです',
          'Phủ định: [Động từ thể từ điển] ＋ つもりはありません/ つもりはない: sẽ không/ không có ý định',
          'Dự định trong quá khứ: [Động từ thể từ điển] ＋ つもりでした/ つもりだった',
        ],
        notes: [
          'Thể phủ định của mẫu câu này là 「つもりはない」, không phải là 「つもりではない」. Cũng có thể dùng mẫu [Động từ thể ない] ＋ つもりです nhưng mẫu câu này không diễn đạt mạnh mẽ ý phủ định bằng việc dùng 「つもりはない」.',
          '「でした」 là cách nói lịch sự, 「だった」 là cách nói bình thường.',
          'Không chia thì quá khứ cho động từ phía trước 「つもりです」.',
        ],
        wrong: [['りゅうがくしたつもりです。', 'Không chia thì quá khứ cho động từ phía trước 「つもりです」.']],
        usages: [
          {
            examples: [
              ['かれは {日本|にほん}に りゅうがくするつもりです。', 'Anh ấy định đi Nhật du học.', 'りゅうがくする: du học'],
            ],
          },
          {
            title: 'Thể phủ định',
            detail:
              'So sánh sắc thái của hai câu いくつもりはない và いかないつもりです thì câu thứ nhất nhấn mạnh ý phủ định nhiều hơn.',
            examples: [
              ['かれは {日本|にほん}に りゅうがくするつもりは ありません。', 'Anh ấy không định đi Nhật du học.'],
              ['いくつもりはない。', 'Không có ý định đi.'],
              ['いかないつもりです。', 'Có ý định không đi.'],
            ],
          },
          {
            title: 'Dự định trong quá khứ',
            examples: [
              [
                'かれは {日本|にほん}に りゅうがくするつもりだった。',
                'Anh ta đã định đi Nhật du học.',
                'Có thể bây giờ đã thay đổi.',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 15 ═════════════════════════════════════════════════════════════════
  {
    id: 'yotei',
    title: '～予定です',
    points: [
      {
        id: 'yotei',
        pattern: '～予定です',
        meaning: 'Có kế hoạch, theo lịch là … (dự định đã được quyết định chính thức)',
        group: 'du-dinh',
        structures: ['[Động từ thể từ điển] ＋ 予定です', '[Danh từ ＋ の] ＋ 予定です'],
        explanation: [
          '「予定」 (よてい) nghĩa là “dự định/ kế hoạch”. Mẫu câu này diễn tả một việc mà người nói dự định hoặc có kế hoạch sẽ làm. Dự định này đã được quyết định chính thức rồi.',
        ],
        examples: [
          [
            '7{月|がつ}の{終|お}わりにドイツへ{出張|しゅっちょう}する{予定|よてい}です。',
            'Tôi có kế hoạch đi công tác ở Đức vào cuối tháng 7.',
          ],
          [
            '{来年|らいねん}{日本|にほん}に{留学|りゅうがく}する{予定|よてい}です。',
            'Theo kế hoạch thì năm sau tôi sẽ sang Nhật du học.',
          ],
        ],
      },
      {
        id: 'phan-biet-du-dinh',
        pattern: 'Phân biệt 「ようと思います」「つもりです」「予定です」',
        explanation: [
          '①「予定です」 khác 2 mẫu còn lại ở chỗ nó diễn tả một dự định, lịch trình hay kế hoạch đã được quyết định, không phải là ý định đơn thuần của người nói.',
          '②「つもりです」 và 「ようと思います」 đều diễn đạt ý định sẽ làm gì của người nói, nhưng với 「つもりです」 thì ý định thường đã có từ trước đó, còn 「ようと思います」 có thể diễn đạt cả ý định bột phát, vừa nảy ra trong lúc nói.',
          '③「予定です」 và 「つもりです」 không dùng với các việc xảy ra hàng ngày nhưng 「ようと思います」 thì có thể dùng.',
        ],
        wrong: [
          ['{早|はや}く{寝|ね}る[つもりです/{予定|よてい}です]。', 'Không dùng 「つもりです」/「予定です」 với các việc xảy ra hàng ngày.'],
        ],
        examples: [
          [
            '{大阪|おおさか}に{行|い}く{予定|よてい}です。',
            'Tôi có kế hoạch đi Osaka.',
            'Việc đó đã được quyết định chính thức rồi.',
          ],
          [
            '{大阪|おおさか}に{行|い}くつもりです。',
            'Tôi dự định sẽ đi Osaka.',
            'Tôi nghĩ về việc đi Osaka từ trước rồi và dự định sẽ đi nhưng có thể vẫn chưa quyết.',
          ],
          [
            '{大阪|おおさか}に{行|い}こうと{思|おも}います。',
            'Tôi sẽ đi Osaka.',
            'Có thể bao hàm ý nghĩa giống với つもり ở trên, cũng có thể dùng trong trường hợp nảy ra ý định ngay trong lúc nói — ví dụ đang nói chuyện với bạn, bạn nói đến Osaka và cảm thấy thích thú, thế là nói luôn là tôi sẽ đi Osaka một ngày nào đó.',
          ],
          [
            '{早|はや}く{寝|ね}ようと{思|おも}います。',
            'Tôi sẽ ngủ sớm.',
            'Việc xảy ra hàng ngày thì dùng được 「ようと思います」.',
          ],
        ],
      },
    ],
  },

  // ══ 16 ═════════════════════════════════════════════════════════════════
  {
    id: 'tro-tu-to',
    title: 'Các mẫu câu sử dụng trợ từ「と」',
    points: [
      {
        id: 'to-omou',
        pattern: '～と思う',
        meaning: 'Tôi nghĩ rằng / là …',
        structures: [
          '(Chủ ngữ ＋ は/ が) ＋ [Động từ thể thường] ＋ と思う (おもう)',
          '(Chủ ngữ ＋ は/ が) ＋ [Tính từ -i] ＋ と思う',
          '(Chủ ngữ ＋ は/ が) ＋ [Tính từ -na/ Danh từ ＋ だ] ＋ と思う',
        ],
        usages: [
          {
            examples: [
              ['この{映画|えいが}はおもしろいと{思|おも}います。', 'Tôi nghĩ là bộ phim này hay.'],
              ['わたしはあした{雨|あめ}がふると{思|おも}います。', 'Tôi nghĩ là mai trời sẽ mưa.'],
              ['{日本語|にほんご}は{簡単|かんたん}だと{思|おも}った。', 'Tôi đã nghĩ rằng tiếng Nhật dễ.'],
              ['{田中|たなか}さんは もうかえったと{思|おも}う。', 'Tôi nghĩ là anh Tanaka đã về rồi.'],
            ],
          },
          {
            title: 'Phủ định cách ①: chuyển phần trước 「と」 sang thể phủ định (thể ない)',
            examples: [
              ['この{映画|えいが}はおもしろくないと{思|おも}います。', 'Tôi nghĩ là bộ phim này không hay.'],
              ['わたしはあした{雨|あめ}がふらないと{思|おも}います。', 'Tôi nghĩ là mai trời sẽ không mưa.'],
              ['{日本語|にほんご}は{簡単|かんたん}じゃないと{思|おも}った。', 'Tôi đã nghĩ rằng tiếng Nhật không dễ.'],
              ['{田中|たなか}さんは まだかえらなかったと{思|おも}う。', 'Tôi nghĩ là anh Tanaka chưa về đâu.'],
            ],
          },
          {
            title: 'Phủ định cách ②: chuyển 「と思う/ と思います」 thành 「と思わない/ と思いません」, phần đằng trước giữ nguyên',
            examples: [
              ['この{映画|えいが}はおもしろいと{思|おも}いません。', 'Tôi không nghĩ là bộ phim này hay.'],
              ['わたしはあした{雨|あめ}がふると{思|おも}いません。', 'Tôi không nghĩ là mai trời sẽ mưa.'],
              ['{日本語|にほんご}は{簡単|かんたん}だと{思|おも}わなかった。', 'Tôi đã không nghĩ rằng tiếng Nhật dễ.'],
              ['{田中|たなか}さんは もうかえったと{思|おも}わない。', 'Tôi không nghĩ là anh Tanaka đã về rồi.'],
            ],
          },
        ],
      },
      {
        id: 'to-iimashita',
        pattern: '～と言いました／と言っていました',
        meaning: '(Ai đó) đã nói rằng … (trích dẫn lời nói của người khác)',
        explanation: [
          'Đây là mẫu câu dùng để trích dẫn lời nói của người khác.',
          '「と言いました」 được dùng khi trích dẫn nguyên văn không thay đổi nội dung lời nói của người khác, còn 「と言っていました」 dùng để truyền đạt lại lời nói của người khác với một người thứ ba, có thể giữ nguyên nội dung hoặc chỉ truyền đạt lại ý chính.',
        ],
        structures: ['A ＋ は/ が ＋「Câu nói trực tiếp」/ Thể thường (ふつう形) ＋ と言いました/ と言っていました'],
        examples: [
          [
            '{田中|たなか}さんは「{来週|らいしゅう}{東京|とうきょう}へ{出張|しゅっちょう}します」と{言|い}いました。',
            'Anh Tanaka nói: “Tuần tới tôi sẽ đi Tokyo công tác.”',
            'Đơn thuần là diễn đạt lại nguyên văn lời anh Tanaka nói.',
          ],
          [
            '{田中|たなか}さんは {来週|らいしゅう}{東京|とうきょう}へ{出張|しゅっちょう}する と{言|い}いました。',
            'Anh Tanaka nói là tuần tới anh ấy sẽ đi Tokyo công tác.',
            'Đơn thuần là diễn đạt lại nguyên văn lời anh Tanaka nói.',
          ],
          // Bản dịch trong bản gốc bị cụt sau chữ "đã nói".
          [
            '{田中|たなか}さんは{来週|らいしゅう}{東京|とうきょう}へ{出張|しゅっちょう}すると{言|い}っていました。',
            'Anh Tanaka đã nói là tuần tới anh ấy sẽ đi Tokyo công tác.',
            'Câu này mang tính truyền đạt lại những gì anh Tanaka nói với một người thứ ba.',
          ],
        ],
      },
    ],
  },

  // ══ 17 ═════════════════════════════════════════════════════════════════
  {
    id: 'tu-tha-dong-tu',
    title: 'Tự động từ và tha động từ',
    points: [
      {
        id: 'jidoushi',
        pattern: '自動詞（～が＋自動詞）',
        meaning: 'Tự động từ: sự việc tự diễn ra, không có tân ngữ trực tiếp',
        group: 'tu-tha',
        explanation: [
          'Tự động từ: 自動詞 (じどうし). Là động từ mà không có tân ngữ trực tiếp đi kèm. Chủ ngữ là đối tượng duy nhất của hành động hay tình trạng được nhắc đến bởi động từ.',
          'Trong tiếng Nhật có nhiều sự vật hiện tượng được coi là tự nó diễn ra mà không có tác động của một người nào khác.',
        ],
        structures: ['[Chủ ngữ (danh từ)] ＋ が ＋ 自動詞'],
        examples: [
          ['ドアが{開|あ}きます。', 'Cửa mở.'],
          ['ドアが{閉|し}まります。', 'Cửa đóng.'],
        ],
      },
      {
        id: 'tadoushi',
        pattern: '他動詞（～を＋他動詞）',
        meaning: 'Tha động từ: có người thực hiện, tác động lên một tân ngữ',
        group: 'tu-tha',
        explanation: [
          'Tha động từ: 他動詞 (たどうし). Là động từ đòi hỏi có một tân ngữ trực tiếp đi kèm. Tân ngữ ở đây là người hoặc vật, là đối tượng hướng tới của hành động.',
          'Tha động từ có chủ ngữ là người thực hiện hành động và tân ngữ là người/ vật nhận hành động đó.',
        ],
        structures: ['[Chủ ngữ (danh từ)] ＋ は ＋ [Tân ngữ (danh từ)] ＋ を ＋ 他動詞'],
        examples: [
          ['[{私|わたし}は/]ドアを{開|あ}けます。', 'Tôi mở cửa.'],
          ['[{私|わたし}は/]ドアを{閉|し}めます。', 'Tôi đóng cửa.'],
        ],
      },
      {
        id: 'phan-loai-tu-tha',
        pattern: 'Phân loại 自動詞 và 他動詞',
        explanation: [
          'Có 3 loại 自動詞 và 他動詞:',
          '① Hoàn toàn là 自動詞 (luôn sử dụng dưới dạng tự động từ). Ví dụ: 行く (đi), 働く (làm việc), 座る (すわる: ngồi), 死ぬ (しぬ: chết), 泣く (なく: khóc)…',
          '② Hoàn toàn là 他動詞 (luôn sử dụng dưới dạng tha động từ). Ví dụ: 飲む (uống), 食べる (ăn), 読む (よむ: đọc), あげる (cho, tặng), 買う (かう: mua)…',
          '③ Cặp đôi 自動詞 – 他動詞 (động từ có cả 2 dạng).',
        ],
        tables: [
          table('Bảng tổng hợp các cặp 自動詞 – 他動詞', ['', '自動詞 ～が…', 'Nghĩa', '他動詞 (私は)～を…', 'Nghĩa'], [
            ['1', 'ドアが{開|あ}きます。', 'mở', 'ドアを{開|あ}けます。', 'mở'],
            ['2', 'ドアが{閉|し}まります。', 'đóng', 'ドアを{閉|し}めます。', 'đóng'],
            ['3', '{犬|いぬ}が{出|で}ます。', 'chạy ra, đi ra, rời đi', '{犬|いぬ}を{出|だ}します。', 'cho ra, thả ra, đưa ra'],
            ['4', '{耳|みみ}が{動|うご}きます。', 'chuyển động', '{耳|みみ}を{動|うご}かします。', 'làm cho chuyển động'],
            ['5', '{車|くるま}が{止|と}まります。', 'dừng lại', '{車|くるま}を{止|と}めます。', 'dừng lại'],
            ['6', '{電気|でんき}がつきます。', 'bật (điện)', '{電気|でんき}をつけます。', 'bật (điện)'],
            ['7', '{電気|でんき}が{消|き}えます。', 'tắt (điện)', '{電気|でんき}を{消|け}します。', 'tắt (điện)'],
            ['8', '{予定|よてい}が{変|か}わります。', 'thay, đổi', '{予定|よてい}を{変|か}えます。', 'thay, đổi'],
            ['9', '{病気|びょうき}が{治|なお}ります。', 'khỏi bệnh, lành bệnh, hồi phục', '{病気|びょうき}を{治|なお}します。', 'chữa bệnh'],
            ['10', 'レッスンが{始|はじ}まります。', 'bắt đầu', 'レッスンを{始|はじ}めます。', 'bắt đầu'],
            ['11', 'ペンが{落|お}ちます。', 'rơi', 'ペンを{落|お}とします。', 'làm rơi, đánh rơi'],
            ['12', '{音楽|おんがく}が{聞|き}こえます。', 'nghe thấy', '{音楽|おんがく}を{聞|き}きます。', 'nghe'],
            ['13', '{富士山|ふじさん}が{見|み}えます。', 'nhìn thấy', '{富士山|ふじさん}を{見|み}ます。', 'nhìn, ngắm, xem'],
            ['14', '{財布|さいふ}がなくなります。', 'mất (đồ)', '{財布|さいふ}をなくします。', 'làm mất'],
            ['15', '{財布|さいふ}が{見|み}つかります。', 'được tìm thấy', '{財布|さいふ}を{見|み}つけます。', 'tìm thấy'],
            ['16', '{予定|よてい}が{決|き}まります。', 'được quyết định', '{予定|よてい}を{決|き}めます。', 'quyết định'],
            ['17', '{風|かぜ}が{入|はい}ります。', 'vào', '{風|かぜ}を{入|い}れます。', 'cho vào'],
            ['18', 'お{湯|ゆ}が{沸|わ}きます。', 'sôi', 'お{湯|ゆ}を{沸|わ}かします。', 'đun sôi'],
            ['19', 'パンが{焼|や}けます。', 'được nướng', 'パンを{焼|や}きます。', 'nướng'],
            ['20', '{肉|にく}が{煮|に}えます。', 'ninh, nấu', '{肉|にく}を{煮|に}ます。', 'ninh, nấu'],
            ['21', 'カメラが{壊|こわ}れます。', 'bị hỏng', 'カメラを{壊|こわ}します。', 'làm hỏng'],
            ['22', 'パソコンが{直|なお}ります。', 'được sửa/ chữa', 'パソコンを{直|なお}します。', 'sửa/ chữa'],
            ['23', '{荷物|にもつ}が{届|とど}きます。', 'đến', '{荷物|にもつ}を{届|とど}けます。', 'gửi đến, đưa đến'],
            ['24', '{値段|ねだん}が{上|あ}がります。', 'tăng', '{値段|ねだん}を{上|あ}げます。', 'làm tăng, nâng lên'],
            ['25', '{値段|ねだん}が{下|さ}がります。', 'giảm, hạ', '{値段|ねだん}を{下|さ}げます。', 'làm giảm, hạ bớt, cho xuống'],
            ['26', '{仕事|しごと}が{増|ふ}えます。', 'tăng', '{仕事|しごと}を{増|ふ}やします。', 'làm tăng'],
            ['27', '{体重|たいじゅう}が{減|へ}ります。', 'giảm', '{体重|たいじゅう}を{減|へ}らします。', 'làm giảm'],
            ['28', 'レッスンが{続|つづ}きます。', 'tiếp tục, tiếp diễn', 'レッスンを{続|つづ}けます。', 'tiếp tục'],
            ['29', '{子|こ}どもが{助|たす}かります。', 'được giúp, được cứu', '{子|こ}どもを{助|たす}けます。', 'giúp, cứu'],
            ['30', 'テーブルが{回|まわ}ります。', 'quay vòng', 'テーブルを{回|まわ}します。', 'quay'],
            ['31', '{腕|うで}が{曲|ま}がります。', 'bị bẻ cong', '{腕|うで}を{曲|ま}げます。', 'gập/ bẻ, làm cong'],
            ['32', '{足|あし}の{骨|ほね}が{折|お}れます。', 'gẫy', '{足|あし}の{骨|ほね}を{折|お}ります。', 'làm gẫy'],
            ['33', '{人|ひと}が{集|あつ}まります。', 'tụ tập, được tập hợp', '{人|ひと}を{集|あつ}めます。', 'tập hợp, thu thập'],
            ['34', '{人|ひと}が{並|なら}びます。', 'xếp hàng', '{人|ひと}を{並|なら}べます。', 'xếp vào hàng'],
            ['35', 'コーヒーがこぼれます。', 'đổ, trào ra', 'コーヒーをこぼします。', 'làm đổ, làm trào ra'],
            ['36', 'たまごが{割|わ}れます。', 'vỡ', 'たまごを{割|わ}ります。', 'làm vỡ'],
            ['37', 'ロープが{切|き}れます。', 'bị cắt, bị đứt', 'ロープを{切|き}ります。', 'cắt, làm đứt'],
            ['38', 'ごみが{燃|も}えます。', 'cháy', 'ごみを{燃|も}やします。', 'đốt cháy'],
            ['39', 'ボタンが{取|と}れます。', 'tuột, rơi ra', 'ボタンを{取|と}ります。', 'lấy ra, tháo ra'],
            ['40', 'ボタンが{外|はず}れます。', 'rời ra, tuột ra', 'ボタンを{外|はず}します。', 'tháo ra'],
            ['41', 'ビールが{売|う}れます。', 'được bán', 'ビールを{売|う}ります。', 'bán'],
            ['42', '{書類|しょるい}が{揃|そろ}います。', 'được sắp xếp', '{書類|しょるい}を{揃|そろ}えます。', 'sắp xếp'],
            ['43', '{仕事|しごと}が{進|すす}みます。', 'tiến triển, phát triển', '{仕事|しごと}を{進|すす}めます。', 'làm cho tiến triển'],
            ['44', '{仕事|しごと}が{済|す}みます。', 'được hoàn thành', '{仕事|しごと}を{済|す}ませます。(causative)', 'hoàn thành'],
            ['45', '{時間|じかん}が{過|す}ぎます。', 'qua/ vượt qua', '{時間|じかん}を{過|す}ごします。', 'trải qua'],
            ['46', 'ストレスが{溜|た}まります。', 'bị tích tụ lại, dồn lại', 'ストレスを{溜|た}めます。', 'tích tụ, dồn lại'],
            ['47', 'お{金|かね}が{貯|た}まります。', 'tiết kiệm (お金)', 'お{金|かね}を{貯|た}めます。', 'tiết kiệm (お金)'],
            ['48', '{水|みず}が{流|なが}れます。', 'chảy', '{水|みず}を{流|なが}します。', 'làm chảy'],
            ['49', '{木|き}が{倒|たお}れます。', 'đổ, sụp đổ', '{木|き}を{倒|たお}します。', 'đốn, làm đổ'],
            ['50', '{紙|かみ}が{破|やぶ}れます。', 'rách, bị xé', '{紙|かみ}を{破|やぶ}ります。', 'xé'],
            ['51', '{髪|かみ}が{乾|かわ}きます。', 'khô', '{髪|かみ}を{乾|かわ}かします。', 'làm khô, sấy khô'],
            ['52', '{体|からだ}が{冷|ひ}えます。', 'lạnh, bị lạnh', '{体|からだ}を{冷|ひ}やします。', 'làm lạnh'],
            ['53', '{体|からだ}が{温|あたた}まります。', 'ấm (lên)', '{体|からだ}を{温|あたた}めます。', 'làm ấm, sưởi'],
            ['54', 'スープが{冷|さ}めます。', 'mát, nguội', 'スープを{冷|さ}まします。', 'làm mát, làm nguội'],
            ['55', '{服|ふく}が{汚|よご}れます。', 'bẩn, bị bẩn', '{服|ふく}を{汚|よご}します。', 'làm bẩn'],
            ['56', '{子|こ}どもが{起|お}きます。', '(ngủ) dậy', '{子|こ}どもを{起|お}こします。', 'gọi dậy'],
            ['57', '{皮|かわ}がむけます。', 'bong ra, tróc', '{皮|かわ}をむきます。', 'bóc ra, làm tróc'],
            ['58', '{赤|あか}ちゃんが{生|う}まれます。', 'được sinh ra', '{赤|あか}ちゃんを{生|う}みます。', 'sinh (con)'],
            ['59', '{予定|よてい}が{延|の}びます。', 'được kéo dài, được trì hoãn', '{予定|よてい}を{延|の}ばします。', 'kéo dài, trì hoãn'],
            ['60', '{犯人|はんにん}が{捕|つか}まります。', 'bị bắt, bị tóm', '{犯人|はんにん}を{捕|つか}まえます。', 'bắt, tóm'],
            ['61', '{靴|くつ}が{脱|ぬ}げます。', 'tuột', '{靴|くつ}を{脱|ぬ}ぎます。', 'cởi, tháo'],
            ['62', '{子|こ}どもが{寝|ね}ます。', 'ngủ', '{子|こ}どもを{寝|ね}かせます。', 'cho đi ngủ, làm cho ngủ'],
            ['63', '{子|こ}どもが{降|お}ります。', 'xuống (xe)', '{子|こ}どもを{降|お}ろします。', 'cho xuống, bế/ đỡ xuống'],
            ['64', '{子|こ}どもが{育|そだ}ちます。', 'lớn lên, được nuôi nấng', '{子|こ}どもを{育|そだ}てます。', 'nuôi nấng'],
            ['65', '1{等|とう}が{当|あ}たります。', 'trúng, thắng', '1{等|とう}を{当|あ}てます。', 'đánh trúng, nhắm (mục tiêu)'],
            ['66', 'お{金|かね}が{儲|もう}かります。', 'sinh lời, lãi', 'お{金|かね}を{儲|もう}けます。', 'có lãi, có lợi nhuận'],
            ['67', 'メッセージが{伝|つた}わります。', 'được truyền tải', 'メッセージを{伝|つた}えます。', 'truyền đạt, kể'],
            ['68', '{髪|かみ}が{伸|の}びます。', 'dài ra', '{髪|かみ}を{伸|の}ばします。', 'kéo dài, làm dài'],
            ['69', '{子|こ}どもが{隠|かく}れます。', '(tự) trốn', '{子|こ}どもを{隠|かく}します。', 'trốn, giấu'],
            ['70', '{手|て}が{濡|ぬ}れます。', 'ướt, bị ướt', '{手|て}を{濡|ぬ}らします。', 'làm ướt'],
          ]),
        ],
      },
    ],
  },

  // ══ 18 ═════════════════════════════════════════════════════════════════
  {
    id: 'dieu-kien-ba',
    title: 'Câu điều kiện ～ば',
    points: [
      {
        id: 'ba',
        pattern: '～ば',
        meaning: 'Nếu … thì … (điều kiện mang tính nhất quán, lặp lại; vế điều kiện quan trọng hơn)',
        group: 'dieu-kien',
        explanation: [
          '[～ば] là thể điều kiện (条件形: じょうけんけい) nhằm diễn đạt việc gì/ hành động gì sẽ xảy ra trong một điều kiện nhất định.',
        ],
        structures: [
          'Động từ nhóm 1: う → え ＋ ば',
          'Động từ nhóm 2: る → れば',
          'Động từ nhóm 3: する → すれば、来る → くれば',
          'Động từ thể phủ định: ない → なければ',
          'Tính từ -i: bỏ い ＋ ければ (phủ định: bỏ い ＋ くなければ)',
          'Tính từ -na/ Danh từ/ Trợ từ: ＋ であれば/ なら(ば) (phủ định: ＋ でなければ/ じゃなければ)',
        ],
        notes: [
          'Động từ thể khả năng, khi chia ở dạng điều kiện cũng có cách chia giống động từ nhóm 2.',
          'Những động từ kết thúc với 「する」, 「くる」 cũng có cách chia tương tự như động từ nhóm 3.',
        ],
        tables: [
          // Bản gốc ghi cách đọc của 来る là 「くれ」 — sửa thành くる.
          table('Đối với động từ', ['Loại', 'Thể từ điển', 'Thể điều kiện ～ば'], [
            ['Nhóm 1: う → え ＋ ば', '{話|はな}す', '{話|はな}せば (nếu nói…)'],
            ['Nhóm 1: う → え ＋ ば', '{呼|よ}ぶ', '{呼|よ}べば (nếu gọi…)'],
            ['Nhóm 1: う → え ＋ ば', '{頑張|がんば}る', '{頑張|がんば}れば (nếu cố gắng…)'],
            ['Nhóm 2: る → れば', '{食|た}べる', '{食|た}べれば (nếu ăn…)'],
            ['Nhóm 2: る → れば', 'できる', 'できれば (nếu có thể…)'],
            ['Thể khả năng (chia như nhóm 2)', '{読|よ}める', '{読|よ}めれば (nếu có thể đọc…)'],
            ['Thể khả năng (chia như nhóm 2)', '{食|た}べられる', '{食|た}べられれば (nếu có thể ăn…)'],
            ['Nhóm 3 (bất quy tắc)', 'する', 'すれば'],
            ['Nhóm 3 (bất quy tắc)', '{来|く}る', 'くれば'],
            ['Động từ kết thúc bằng する/ くる', '{勉強|べんきょう}する', 'べんきょうすれば (nếu học…)'],
            ['Động từ kết thúc bằng する/ くる', '{電話|でんわ}する', 'でんわすれば (nếu gọi điện…)'],
            ['Động từ kết thúc bằng する/ くる', 'もってくる', 'もってくれば (nếu mang đến…)'],
          ]),
          table('Động từ thể phủ định: ない → なければ', ['Loại', 'Thể từ điển', 'Thể ない', 'Thể điều kiện'], [
            ['Nhóm 1', '{書|か}く', '{書|か}かない', '{書|か}かなければ (nếu không viết)'],
            ['Nhóm 1', '{話|はな}す', '{話|はな}さない', '{話|はな}さなければ (nếu không nói)'],
            ['Nhóm 1', 'ある', 'ない', 'なければ (nếu không có)'],
            ['Nhóm 2', '{食|た}べる', '{食|た}べない', '{食|た}べなければ (nếu không ăn)'],
            ['Nhóm 2', '{見|み}る', '{見|み}ない', '{見|み}なければ (nếu không nhìn/ xem)'],
            ['Thể khả năng', '{読|よ}める', '{読|よ}めない', '{読|よ}めなければ (nếu không thể đọc)'],
            ['Nhóm 3', 'する', 'しない', 'しなければ (nếu không làm)'],
            ['Nhóm 3', 'くる', 'こない', 'こなければ (nếu không đến)'],
          ]),
          table('Tính từ -i: khẳng định bỏ い ＋ ければ, phủ định bỏ い ＋ くなければ', ['Tính từ', 'Khẳng định', 'Phủ định'], [
            ['{安|やす}い (rẻ)', '{安|やす}ければ (nếu rẻ)', '{安|やす}くなければ (nếu không rẻ)'],
            ['{小|ちい}さい (nhỏ)', '{小|ちい}さければ (nếu nhỏ)', '{小|ちい}さくなければ (nếu không nhỏ)'],
            ['おもしろい (thú vị)', 'おもしろければ (nếu thú vị)', 'おもしろくなければ (nếu không thú vị)'],
          ]),
          table('Động từ dạng ～たいです: たいです → たければ, たくないです → たくなければ', ['～たいです', 'Khẳng định', 'Phủ định'], [
            ['{行|い}きたいです', '{行|い}きたければ (nếu muốn đi)', '{行|い}きたくなければ (nếu không muốn đi)'],
            ['{食|た}べたいです', '{食|た}べたければ (nếu muốn ăn)', '{食|た}べたくなければ (nếu không muốn ăn)'],
            ['{勉強|べんきょう}したいです', '{勉強|べんきょう}したければ (nếu muốn học)', '{勉強|べんきょう}したくなければ (nếu không muốn học)'],
          ]),
          table('Tính từ -na: bỏ な ＋ であれば/ なら(ば); phủ định bỏ な ＋ でなければ/ じゃなければ', ['Tính từ -na', 'Khẳng định', 'Phủ định'], [
            ['{暇|ひま} (rảnh)', '{暇|ひま}であれば/ {暇|ひま}ならば (nếu rảnh)', '{暇|ひま}でなければ/ {暇|ひま}じゃなければ (nếu không rảnh)'],
            ['{好|す}き (thích)', '{好|す}きであれば/ {好|す}きならば (nếu thích)', '{好|す}きでなければ/ {好|す}きじゃなければ (nếu không thích)'],
          ]),
          table('Danh từ: cách chia giống tính từ -na', ['Danh từ', 'Khẳng định', 'Phủ định'], [
            ['いい{天気|てんき} (trời đẹp)', 'いい{天気|てんき}であれば/ いい{天気|てんき}ならば (nếu trời đẹp)', 'いい{天気|てんき}でなければ/ いい{天気|てんき}じゃなければ (nếu trời không đẹp)'],
            ['{仕事|しごと} (công việc)', '{仕事|しごと}であれば/ {仕事|しごと}ならば (nếu là công việc)', '{仕事|しごと}でなければ/ {仕事|しごと}じゃなければ (nếu không phải là công việc)'],
          ]),
          table('Trợ từ: cách chia cũng giống danh từ và tính từ -na', ['', 'Khẳng định', 'Phủ định'], [
            ['7{時|じ}から', '7{時|じ}からであれば/ 7{時|じ}からならば (nếu là từ 7 giờ)', '7{時|じ}からでなければ/ 7{時|じ}からじゃなければ (nếu không phải từ 7 giờ)'],
            ['ともだちと', 'ともだちとであれば/ ともだちとならば (nếu là cùng với bạn)', 'ともだちとでなければ/ ともだちとじゃなければ (nếu không phải cùng với bạn)'],
          ]),
        ],
        examples: [
          [
            '{毎日|まいにち}がんばれば、{日本語|にほんご}がうまく{話|はな}せるようになります。',
            'Nếu ngày nào cũng nỗ lực thì sẽ có thể nói được giỏi tiếng Nhật thôi.',
            'うまい: giỏi',
          ],
          [
            '{少|すこ}し{休|やす}めば、{元気|げんき}になると{思|おも}います。',
            'Tôi nghĩ là nếu nghỉ ngơi một chút thì sẽ khỏe lên thôi.',
            '少し（すこし）: một chút、思う（おもう）: nghĩ',
          ],
          [
            '{時間|じかん}があれば、かぞくと{映画|えいが}を{見|み}に{行|い}きたいです。',
            'Nếu có thời gian thì tôi muốn đi xem phim cùng gia đình.',
            '時間: thời gian',
          ],
        ],
      },
    ],
  },

  // ══ 19 ═════════════════════════════════════════════════════════════════
  {
    id: 'dieu-kien-tara',
    title: 'Câu điều kiện ～たら',
    points: [
      {
        id: 'tara',
        pattern: '～たら',
        meaning: 'Nếu … thì … (giả định chỉ xảy ra một lần, vế kết quả quan trọng hơn); … xong thì …',
        group: 'dieu-kien',
        explanation: [
          '「～たら」 cũng giống như 「～ば」 là mẫu câu thuộc thể điều kiện (条件形: じょうけんけい). Mẫu câu này diễn đạt với một điều kiện nhất định nào đó, thì việc gì sẽ xảy ra: “Nếu A thì B”.',
        ],
        structures: [
          '[Động từ thể た] ＋ ら',
          '[Tính từ -i (bỏ い) ＋ かった] ＋ ら',
          '[Tính từ -na (bỏ な)/ Danh từ ＋ だった] ＋ ら',
        ],
        tables: [
          table('Ví dụ', ['Loại', 'Từ', '～たら'], [
            ['Động từ', '{行|い}く', 'いったら (nếu đi)'],
            ['Động từ', '{話|はな}す', 'はなしたら (nếu nói chuyện)'],
            ['Động từ', '{食|た}べる', 'たべたら (nếu ăn)'],
            ['Động từ', 'する', 'したら (nếu làm)'],
            ['Động từ', '{来|く}る', 'きたら (nếu đến)'],
            ['Tính từ -i', '{安|やす}い', '{安|やす}かったら (nếu rẻ)'],
            ['Tính từ -i', '{大|おお}きい', '{大|おお}きかったら (nếu to)'],
            ['Tính từ -na', 'きれい', 'きれいだったら (nếu sạch/ nếu đẹp)'],
            ['Tính từ -na', '{簡単|かんたん}', '{簡単|かんたん}だったら (nếu dễ)'],
            ['Danh từ', '{雨|あめ}', '{雨|あめ}だったら (nếu mưa)'],
            ['Danh từ', 'いい{天気|てんき}', 'いい{天気|てんき}だったら (nếu trời đẹp)'],
          ]),
        ],
        usages: [
          {
            examples: [
              ['{時間|じかん}があったら、あそびに{行|い}こう。', 'Nếu có thời gian thì cùng đi chơi nhé.'],
              [
                'ひまだったら、{部屋|へや}を{掃除|そうじ}して。',
                'Nếu mà rảnh rỗi thì dọn dẹp phòng đi.',
                '部屋: phòng、掃除する: dọn dẹp, quét dọn',
              ],
            ],
          },
          {
            title: '「～たら」 diễn đạt giả định/ điều kiện chỉ xảy ra một lần, vế kết quả quan trọng hơn vế điều kiện',
            examples: [
              [
                'あした{雨|あめ}だったら、でかけない。',
                'Nếu mai mưa thì tôi sẽ không ra ngoài.',
                'Điều kiện này chỉ đúng với trường hợp ngày mai, còn với ngày khác thì chưa chắc. Và kết quả của “nếu mai mưa” là “tôi sẽ không ra ngoài”, kết quả này có thể khác trong những lần sau.',
              ],
              [
                'ひまだったら、{飲|の}みに{行|い}こう。',
                'Nếu cậu rảnh thì đi nhậu đi.',
                'Điều kiện này xảy ra tại thời điểm nói, thấy bạn rảnh nên người nói rủ đi nhậu. Nếu vào ngày khác có thể sẽ là một hoạt động khác. Vế kết quả trong câu này được nhấn mạnh hơn.',
              ],
            ],
          },
          {
            title: '「～たら」 diễn tả hai sự việc liên kết nhau về mặt thời gian',
            detail:
              'Trong trường hợp này nó không mang nghĩa là điều kiện nữa mà là hai sự việc xảy ra trước sau. Vế 「～たら」 biểu thị hành động đã hoàn thành trước, vế sau biểu thị hành động sau đó.',
            examples: [
              [
                'お{酒|さけ}を{飲|の}んだら、きもちがわるくなりました。',
                'Uống rượu xong thì đã cảm thấy khó chịu.',
                'きもちがわるい: tâm trạng không tốt/ cảm thấy khó chịu',
              ],
              [
                '{洗濯|せんたく}をしたら、{白|しろ}いシャツがピンクになりました。',
                'Vừa giặt xong thì cái áo sơ mi trắng chuyển thành màu hồng.',
                '洗濯する: giặt',
              ],
              [
                '{田中|たなか}さんに{手紙|てがみ}をだしたら、すぐに{返事|へんじ}がきました。',
                'Vừa gửi thư cho anh Tanaka xong đã nhận được ngay hồi âm.',
                '返事（へんじ）: hồi âm、出す（だす）: gửi',
              ],
              ['{彼|かれ}が{来|き}たら、{会議|かいぎ}をはじめます。', 'Khi anh ta đến thì sẽ bắt đầu họp.', '会議（かいぎ）: cuộc họp'],
            ],
          },
        ],
      },
      {
        id: 'phan-biet-tara-ba',
        pattern: 'Phân biệt 「～たら」 và 「～ば」',
        explanation: [
          '「～たら」 và 「～ば」 khá giống nhau về mặt ý nghĩa. Cả hai thể này đều nhằm diễn tả điều kiện để việc gì/ hành động gì đó xảy ra: “Nếu A thì B.” Tuy nhiên có một vài điểm khác nhau.',
          '「～たら」 diễn đạt giả định/ điều kiện chỉ xảy ra một lần, vế kết quả quan trọng hơn vế điều kiện.',
          '「～ば」 diễn đạt điều kiện/ giả định mang tính nhất quán, có thể xảy ra nhiều lần hoặc liên tục. Vế điều kiện quan trọng hơn vế kết quả.',
          'Tuy nhiên 「～ば」 cũng có thể dùng với các điều kiện chỉ xảy ra một lần (tức là 「～ば」 có cách dùng giống 「～たら」 nhưng nghĩa rộng hơn, diễn tả được cả những điều kiện khác nữa như đã nói ở trên).',
          '「～ば」 hay dùng trong các câu thành ngữ, tục ngữ.',
          '「～たら」 có thể dùng để diễn tả hai sự việc liên kết nhau về mặt thời gian.',
        ],
        usages: [
          {
            title: '「～ば」 diễn đạt điều kiện/ giả định mang tính nhất quán, vế điều kiện quan trọng hơn',
            examples: [
              [
                '{安|やす}ければ、{買|か}います。',
                'Nếu rẻ thì tôi sẽ mua.',
                'Có thể không chỉ lần này mà các lần khác nếu thấy rẻ tôi cũng sẽ mua. Vế điều kiện “nếu rẻ” quan trọng vì nó quyết định có mua hay không.',
              ],
              [
                '{日本|にほん}の{新聞|しんぶん}をよく{読|よ}めば、{漢字|かんじ}がじょうずになりますよ。',
                'Nếu mà thường xuyên đọc báo tiếng Nhật thì sẽ giỏi kanji hơn đấy.',
                'Điều kiện này gần như là luôn đúng, không nhất thiết chỉ xảy ra một lần, và vế điều kiện “đọc báo tiếng Nhật” quan trọng vì nó quyết định kết quả là “giỏi kanji”.',
              ],
              [
                'ひまであれば、{飲|の}みに{行|い}こう。',
                'Nếu cậu rảnh thì đi nhậu đi.',
                '「～ば」 cũng dùng được với điều kiện chỉ xảy ra một lần: ta cũng có thể nói ひまだったら、飲みに行こう。',
                { ja: ['ひまだったら、{飲|の}みに{行|い}こう。'] },
              ],
            ],
          },
          {
            title: '「～ば」 hay dùng trong các câu thành ngữ, tục ngữ',
            examples: [
              [
                '{備|そな}えあれば{憂|うれ}いなし',
                'Nếu có chuẩn bị thì sẽ không lo lắng.',
                'Tương đương câu “Cẩn tắc vô áy náy”. 備え（そなえ）: sự chuẩn bị、憂い（うれい）: ưu phiền, lo âu',
                { vi: ['Cẩn tắc vô áy náy.'] },
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 20 ═════════════════════════════════════════════════════════════════
  {
    id: 'dieu-kien-to',
    title: 'Câu điều kiện ～と',
    points: [
      {
        id: 'to-dieu-kien',
        pattern: '～と、～',
        meaning: 'Hễ … thì …, cứ … thì lại … (kết quả tất yếu: hiện tượng tự nhiên, thói quen, máy móc)',
        group: 'dieu-kien',
        structures: [
          '[Chủ ngữ] は/ が ＋ [Động từ thể từ điển/ thể ない] ＋ と ＋ vế câu 2',
          '[Chủ ngữ] は/ が ＋ [Tính từ -i] ＋ と ＋ vế câu 2',
          '[Chủ ngữ] は/ が ＋ [Tính từ -na/ Danh từ ＋ だ] ＋ と ＋ vế câu 2',
        ],
        explanation: [
          'Cấu trúc: ”Nếu … thì…”, ”Cứ … thì lại …”.',
          'Mẫu câu này diễn đạt ý nghĩa là nếu vế 1 xảy ra thì theo lẽ thường, vế 2 nhất định sẽ xảy ra. Mối quan hệ giữa 2 vế câu ở đây thường là nói đến hiện tượng tự nhiên, các sự việc dĩ nhiên hoặc xảy ra theo tuần tự, thói quen, mang tính lặp lại, hoặc cơ chế hoạt động của máy móc.',
        ],
        notes: ['Không dùng động từ thì quá khứ trước 「～と」.'],
        examples: [
          ['このボタンを{押|お}すと、ドアが{開|あ}きます。', 'Cứ bật nút này thì cửa sẽ mở.'],
          // Bản gốc dịch 銀行 là "bưu điện".
          [
            '{最初|さいしょ}の{角|かど}を{右|みぎ}にまがると、{銀行|ぎんこう}が{見|み}えます。',
            'Rẽ phải ở góc đường đầu tiên thì sẽ nhìn thấy ngân hàng.',
            '最初（さいしょ）: đầu tiên、角: góc',
          ],
        ],
      },
    ],
  },

  // ══ 21 ═════════════════════════════════════════════════════════════════
  {
    id: 'dieu-kien-nara',
    title: 'Câu điều kiện ～なら',
    points: [
      {
        id: 'nara',
        pattern: '～なら',
        meaning: 'Nếu (là) … thì … (dựa vào giả định hay điều vừa nghe để khuyên, đánh giá, nêu ý định)',
        group: 'dieu-kien',
        structures: ['[Chủ ngữ] は/ が ＋ [Động từ thể thường (普通形)/ Tính từ -i/ Tính từ -na/ Danh từ] ＋ なら ＋ vế câu 2'],
        explanation: [
          '① Mẫu câu với 「～なら」 khác với các mẫu câu điều kiện đã học (「～ば」, 「～たら」, 「～と」) ở chỗ: người nói sẽ dựa vào giả định/ điều kiện được nêu lên ở vế câu 1 để đưa ra đánh giá, mệnh lệnh, mong muốn hay ý định của mình.',
          '② 「～なら」 được dùng khi phản hồi lại thông tin mà mình nghe được từ người đối diện. Dựa vào nội dung thông tin đó (vế câu 1), vế câu 2 sẽ được đưa ra.',
          '③ Hai vế câu 1 và 2 trong mẫu câu với 「～なら」 không cần có liên hệ về thời gian. Đối với 3 mẫu câu điều kiện đã học thì vế 1 luôn xảy ra trước vế 2 nhưng đối với mẫu câu 「～なら」 thì không cần như vậy.',
          '④ Có trường hợp người Nhật dùng 「の」 hoặc 「ん」 phía trước 「～なら」 nhưng điều này cũng không làm thay đổi nghĩa của câu.',
        ],
        usages: [
          {
            title: 'Dựa vào giả định ở vế 1 để đưa ra đánh giá, mệnh lệnh, mong muốn hay ý định',
            examples: [
              [
                '{東京|とうきょう}へ{行|い}くなら、{新幹線|しんかんせん}が{便利|べんり}です。',
                'Nếu mà đi Tokyo thì đi shinkansen là tiện.',
              ],
              ['{近|ちか}いなら、{歩|ある}きましょう。', 'Nếu mà gần thì đi bộ đi.'],
            ],
          },
          {
            title: 'Phản hồi lại thông tin nghe được từ người đối diện',
            examples: [
              [
                'パソコンがあるなら、インターネットができますね。',
                'Đã có laptop thì dùng được internet nhỉ.',
                'Đáp lại câu: 家にパソコンがあります。(Tôi có laptop ở nhà đấy.)',
                { ja: ['パソコンがあるのなら、インターネットできますね。'] },
              ],
              [
                'パソコンがあるのなら、インターネットできますね。',
                'Đã có laptop thì dùng được internet nhỉ.',
                'Thêm 「の」 trước 「なら」 cũng không làm thay đổi nghĩa của câu.',
                { ja: ['パソコンがあるなら、インターネットができますね。'] },
              ],
            ],
          },
          {
            title: 'Một câu thành ngữ Nhật dùng để nhắc nhở người lái xe',
            examples: [
              ['{飲|の}んだら{乗|の}るな、{乗|の}るなら{飲|の}むな。', 'Đã uống thì không lái mà đã lái thì không uống.'],
            ],
          },
        ],
      },
    ],
  },

  // ══ 22 ═════════════════════════════════════════════════════════════════
  {
    id: 'baai',
    title: '～場合は: Trường hợp',
    points: [
      {
        id: 'baai',
        pattern: '～場合は',
        meaning: 'Trong trường hợp … thì … (giả định chưa xảy ra nhưng có khả năng xảy ra)',
        group: 'dieu-kien',
        structures: [
          '[Động từ thể từ điển/ thể た/ thể ない] ＋ 場合 (は)、～',
          '[Tính từ -i (～い)/ Tính từ -na (～な)/ Danh từ の] ＋ 場合 (は)、～',
        ],
        explanation: [
          'Mẫu câu này diễn đạt ý nghĩa là trong trường hợp có chuyện gì đó xảy ra, thì hành động tiếp theo ra sao. Những trường hợp này thường chỉ là giả định (chưa xảy ra) nhưng có khả năng sẽ xảy ra.',
        ],
        notes: [
          '「場合」 không dùng với những giả định không thể xảy ra (đây là điểm khác với mẫu câu điều kiện ～たら). Ví dụ có thể nói 「もし私が鳥（とり）だったら」 (Nếu tôi là một con chim) nhưng không thể nói 「もし私が鳥の場合は」 vì giả định này không bao giờ xảy ra.',
          '「場合」 thường dùng để nêu ra một ví dụ tiêu biểu cho các trường hợp có thể xảy ra, thường dùng để đưa ra những giả định đặc biệt, hoặc khẩn cấp hơn là những giả định nhỏ xảy ra hàng ngày (như ví dụ số ③).',
          '「場合」 diễn đạt khả năng sẽ/ có thể xảy ra nên vế sau không dùng thể quá khứ.',
        ],
        wrong: [
          ['もし{私|わたし}が{鳥|とり}の{場合|ばあい}は', 'Giả định không bao giờ xảy ra thì không dùng 「場合」; nói もし私が鳥だったら (Nếu tôi là một con chim).'],
          ['{遅|おく}れた{場合|ばあい}は、{会社|かいしゃ}に{連絡|れんらく}しました。', 'Vế sau của 「場合」 không dùng thể quá khứ.'],
        ],
        examples: [
          [
            '{遅|おそ}くなる{場合|ばあい}[は/]、{必|かなら}ず{家|いえ}に{連絡|れんらく}してください。',
            'Nếu về muộn thì nhất định phải liên lạc với gia đình nhé.',
          ],
          [
            '{地震|じしん}が{起|お}きた{場合|ばあい}は、まず{火|ひ}を{消|け}すことが{大切|たいせつ}です。',
            'Trong trường hợp động đất xảy ra thì đầu tiên điều quan trọng là phải [dập/tắt] lửa đi.',
          ],
          [
            '{地震|じしん}など、{非常|ひじょう}の{場合|ばあい}[に/]は、エレベーターを{使|つか}わないでください。',
            'Trong những trường hợp khẩn cấp, như là có động đất thì đừng sử dụng thang máy.',
          ],
        ],
      },
    ],
  },

  // ══ 23 ═════════════════════════════════════════════════════════════════
  {
    id: 'toki',
    title: '～とき: khi, lúc',
    points: [
      {
        id: 'toki',
        pattern: '～とき',
        meaning: 'Khi, lúc … (vế 2 diễn ra vào lúc xảy ra sự việc ở vế 1)',
        structures: [
          '(Chủ ngữ ＋ は/ が) ＋ Động từ thể từ điển ＋ とき、～',
          '(Chủ ngữ ＋ は/ が) ＋ Động từ thể ている ＋ とき、～',
          '(Chủ ngữ ＋ は/ が) ＋ Động từ thể ない ＋ とき、～',
          '(Chủ ngữ ＋ は/ が) ＋ Động từ thể た ＋ とき、～',
          '(Chủ ngữ ＋ は/ が) ＋ Tính từ -i/ Tính từ -na な ＋ とき、～',
          '(Chủ ngữ ＋ は/ が) ＋ Danh từ ＋ の ＋ とき、～',
        ],
        explanation: [
          '「とき」 nghĩa là “thời điểm”, dùng để nối giữa 2 vế câu, diễn tả ý nghĩa “khi/ lúc xảy ra sự việc ở vế câu 1, thì vế câu 2 diễn ra.”',
        ],
        usages: [
          {
            examples: [
              ['{学生|がくせい}のとき、あまり{勉強|べんきょう}しませんでした。', 'Lúc còn là sinh viên tôi hầu như chẳng học hành gì.'],
              [
                '{晩|ばん}ごはんを{食|た}べているとき、{友|とも}だちがうちへ{来|き}ました。',
                'Khi tôi đang ăn cơm tối thì bạn tôi đến [nhà tôi/].',
                '',
                { ja: ['{晩|ばん}ごはんを{食|た}べているときに、{友|とも}だちがうちへ{来|き}ました。'] },
              ],
            ],
          },
          {
            title: 'Thứ tự xảy ra của hành động khi cả hai vế đều dùng động từ',
            detail:
              'Gọi động từ ở vế 1 là V1, động từ ở vế 2 là V2. V1 (thì quá khứ) ＋ とき、V2 → Sau khi V1 kết thúc thì mới thực hiện V2. V1 (ngoài thì quá khứ) ＋ とき、V2 → Trước khi V1 kết thúc thì thực hiện V2.',
            examples: [
              [
                '{日本|にほん}へ{来|き}たとき、{空港|くうこう}で{写真|しゃしん}を{撮|と}りました。',
                'Sau khi đến Nhật tôi đã chụp ảnh ở sân bay.',
                'Vì V1 là thì quá khứ.',
              ],
              [
                '{日本|にほん}へ{来|く}るとき、{空港|くうこう}で{写真|しゃしん}を{撮|と}りました。',
                'Trước khi đến Nhật tôi đã chụp ảnh ở sân bay.',
                'Vì V1 là thể từ điển, không phải quá khứ.',
              ],
              // Bản gốc dịch 部屋 là "nhà" ở hai câu này.
              [
                '{部屋|へや}を{出|で}たとき、{携帯|けいたい}が{鳴|な}りました。',
                'Sau khi tôi ra khỏi phòng thì điện thoại reo.',
                'Vì V1 là thì quá khứ.',
              ],
              [
                '{部屋|へや}を{出|で}るとき、{携帯|けいたい}が{鳴|な}りました。',
                'Trước khi tôi ra khỏi phòng thì điện thoại reo.',
                'Vì V1 không phải ở thì quá khứ.',
              ],
            ],
          },
          {
            title: 'Chủ ngữ của câu có 「とき」',
            detail:
              'Khi chủ ngữ là ngôi thứ nhất (“Tôi”) thì có thể lược bỏ. Khi chủ ngữ không phải là ngôi thứ nhất (không phải là “Tôi”) thì nó có thể đứng đầu hoặc giữa 2 vế câu có とき.',
            examples: [
              [
                'お{母|かあ}さんは{若|わか}いとき、{看護師|かんごし}でした。',
                'Khi còn trẻ mẹ tôi làm y tá.',
                '',
                { ja: ['{若|わか}いとき、お{母|かあ}さんは{看護師|かんごし}でした。'] },
              ],
            ],
          },
          {
            title: 'Có thể thêm trợ từ 「に」 sau 「とき」',
            examples: [
              [
                '{晩|ばん}ごはんを{食|た}べているときに、{友|とも}だちがうちへ{来|き}ました。',
                'Khi tôi đang ăn cơm tối thì bạn tôi đến [nhà tôi/].',
                '',
                { ja: ['{晩|ばん}ごはんを{食|た}べているとき、{友|とも}だちがうちへ{来|き}ました。'] },
              ],
            ],
          },
          {
            title: 'V1 có dạng 「いる」 hay 「ある」',
            detail:
              'Khi V2 ở thì quá khứ và V1 có dạng 「いる」 hay 「ある」 thì V1 có thể giữ nguyên thì hiện tại (「いる」 hay 「ある」) hoặc chia thì quá khứ (「いた」 hay 「あった」) đều được.',
            examples: [['{部屋|へや}に[いる/いた]とき、{電話|でんわ}しました。', 'Tôi đã gọi điện khi ở trong phòng.']],
          },
          {
            title: 'V1 là tính từ hoặc danh từ ＋ の',
            detail:
              'Khi V2 ở thì quá khứ và V1 có dạng “tính từ ＋ とき” hay “danh từ ＋ の ＋ とき” thì V1 không cần chia thì quá khứ mà vẫn không làm ảnh hưởng đến ý nghĩa của câu.',
            examples: [
              [
                '{母|はは}は{若|わか}いとき、きれいでした。',
                'Lúc trẻ mẹ tôi rất đẹp.',
                'Có thể nói 「母は若いとき」 hay 「母は若かったとき」 đều được.',
                { ja: ['{母|はは}は{若|わか}かったとき、きれいでした。'] },
              ],
              ['{鈴木|すずき}さんは{二十五|にじゅうご}{歳|さい}の とき、{結婚|けっこん}しました。', 'Anh Suzuki đã kết hôn khi 25 tuổi.'],
            ],
          },
        ],
      },
    ],
  },

  // ══ 24 ═════════════════════════════════════════════════════════════════
  {
    id: 'you-mitai',
    title: '～よう、～みたい: giống như, có vẻ như, dường như',
    points: [
      {
        id: 'you-mitai',
        pattern: '～よう／～みたい',
        meaning: 'Giống như, có vẻ như, dường như (đánh giá từ điều nhìn thấy, nghe được, cảm nhận được)',
        group: 'suy-doan',
        explanation: [
          '「～よう」, 「～みたい」 có nghĩa là “trông giống như, có vẻ như, dường như”, diễn đạt sự suy đoán, đánh giá của người nói từ những điều nhìn thấy hay từ những thông tin có được. Xét về mặt ý nghĩa, cả hai từ này tương tự như nhau.',
          '「よう」 bắt nguồn từ từ 「ようす」 (diện mạo, bề ngoài, dáng vẻ), mang sắc thái trang trọng, hay dùng trong văn viết (フォーマル。書き言葉でよく使う). 「みたい」 là khẩu ngữ, dùng trong giao tiếp hàng ngày (カジュアル。話し言葉でよく使う). Cả hai đều là tính từ -na (な形容詞).',
          'Với 「よう」, tính từ -na giữ な (ひまなようです), danh từ và trợ từ thêm の (休みのようです, 6時までのようです); còn 「みたい」 nối thẳng (ひまみたいです, 休みみたいです).',
        ],
        tables: [
          table('Cấu trúc (作り方)', ['', '～ようです', '～みたいです'], [
            ['Động từ — thể từ điển', 'ふるようです', 'ふるみたいです'],
            ['Động từ — thể ない', 'ふらないようです', 'ふらないみたいです'],
            ['Động từ — thể た', 'ふったようです', 'ふったみたいです'],
            ['Động từ — thể なかった', 'ふらなかったようです', 'ふらなかったみたいです'],
            ['Tính từ -i', 'おいしいようです', 'おいしいみたいです'],
            ['Tính từ -i', 'おいしくないようです', 'おいしくないみたいです'],
            ['Tính từ -i', 'おいしかったようです', 'おいしかったみたいです'],
            ['Tính từ -i', 'おいしくなかったようです', 'おいしくなかったみたいです'],
            ['Tính từ -na', 'ひまなようです', 'ひまみたいです'],
            ['Tính từ -na', 'ひまではない（じゃない）ようです', 'ひまではない（じゃない）みたいです'],
            ['Tính từ -na', 'ひまだったようです', 'ひまだったみたいです'],
            ['Tính từ -na', 'ひまではなかった（じゃなかった）ようです', 'ひまではなかった（じゃなかった）みたいです'],
            ['Danh từ', '{休|やす}みのようです', '{休|やす}みみたいです'],
            ['Danh từ', '{休|やす}みではない（じゃない）ようです', '{休|やす}みではない（じゃない）みたいです'],
            ['Danh từ', '{休|やす}みだったようです', '{休|やす}みだったみたいです'],
            ['Danh từ', '{休|やす}みではなかった（じゃなかった）ようです', '{休|やす}みではなかった（じゃなかった）みたいです'],
            ['Trợ từ', '6{時|じ}までのようです', '6{時|じ}までみたいです'],
            ['Trợ từ', '6{時|じ}までではない（じゃない）ようです', '6{時|じ}までではない（じゃない）みたいです'],
            ['Trợ từ', '6{時|じ}までだったようです', '6{時|じ}までだったみたいです'],
            ['Trợ từ', '6{時|じ}までではなかった（じゃなかった）ようです', '6{時|じ}までではなかった（じゃなかった）みたいです'],
          ]),
        ],
        examples: [
          ['あなたは{子供|こども}みたいです。', 'Cậu cứ như trẻ con vậy.'],
          ['あの{人|ひと}は{田中|たなか}さんのかのじょみたいだね。', 'Người kia hình như là bạn gái anh Tanaka nhỉ.'],
          [
            'N1の{試験|しけん}に{合格|ごうかく}しました。まるで{夢|ゆめ}のようです。',
            'Tôi đã đỗ kỳ thi N1 rồi. Cứ như là mơ vậy.',
            '合格する: đỗ、夢: giấc mơ、まるで: giống như, như thể là',
          ],
        ],
      },
    ],
  },

  // ══ 25 ═════════════════════════════════════════════════════════════════
  {
    id: 'sou-desu',
    title: '～そうです',
    points: [
      {
        id: 'sou-denbun',
        pattern: '～そうです（伝聞）',
        meaning: 'Nghe nói … (nói lại thông tin nghe được từ người khác, ti vi, đài…)',
        group: 'suy-doan',
        explanation: [
          '～そうです① (伝聞: でんぶん): nghe nói. Mẫu câu này dùng để nói lại thông tin nghe được từ người khác, từ ti vi, đài, hay các phương tiện truyền thông.',
        ],
        structures: [
          'Động từ thể thường (普通形)/ ない形 ＋ そうです',
          'Tính từ -i/ くない/ かった/ くなかった ＋ そうです',
          'Tính từ -na/ Danh từ ＋ だ/ じゃない/ だった/ じゃなかった ＋ そうです',
        ],
        notes: ['「そうです」 có thể dùng ở dạng 「そうだ」 nhưng không dùng ở thì quá khứ: 「そうでした」.'],
        examples: [
          ['あのレストランはおいしいそうです。', 'Nghe nói là nhà hàng kia ngon lắm đấy.'],
          ['{彼女|かのじょ}はアメリカにいったそうです。', 'Nghe nói là cô ấy đã đi Mỹ rồi.'],
        ],
      },
      {
        id: 'sou-youtai',
        pattern: '～そうです（様態）',
        meaning: 'Trông có vẻ …, dường như sắp … (phán đoán khi nhìn vào người, vật)',
        group: 'suy-doan',
        explanation: [
          '～そうです② (様態: ようたい): Trông có vẻ, dường như sắp. Mẫu câu này thể hiện sự suy đoán, đánh giá khi nhìn vào người/ vật.',
        ],
        structures: [
          'Động từ thể ます (bỏ ます) ＋ そうです: Trông có vẻ/ hình như/ dường như sắp …',
          'Tính từ -i (bỏ い)/ Tính từ -na (bỏ な) ＋ そうです: Nhìn/ trông có vẻ …',
          'Phủ định — động từ thể ない → なさそうです',
          'Phủ định — tính từ -i → くなさそうです',
          'Phủ định — tính từ -na (bỏ な) ＋ そうじゃ/ ではありません/ じゃなさそうです',
        ],
        notes: [
          'Phía trước 「そうです」② này không dùng thì quá khứ, nhưng có thể dùng dạng 「そうでした」 (khác biệt so với 「そうです」①). 「そうです」② dùng như một tính từ -na.',
        ],
        examples: [
          ['このケーキはおいしそうですね。', 'Cái bánh ngọt này trông ngon nhỉ.'],
          ['{雨|あめ}が{降|ふ}りそうです。', 'Có vẻ trời sắp mưa.'],
          ['このりんごはおいしくなさそうです。', 'Quả táo này trông có vẻ không ngon lắm.'],
        ],
      },
    ],
  },

  // ══ 26 ═════════════════════════════════════════════════════════════════
  {
    id: 'rashii',
    title: '～らしいです',
    points: [
      {
        id: 'rashii',
        pattern: '～らしいです',
        meaning: 'Hình như …, nghe đồn … (suy đoán dựa trên thông tin nghe được)',
        group: 'suy-doan',
        explanation: ['Mẫu câu này diễn đạt sự suy đoán dựa trên thông tin nghe được.'],
        structures: [
          'Động từ thể thường (普通形)/ ない形 ＋ らしいです',
          'Tính từ -i/ くない/ かった/ くなかった ＋ らしいです',
          'Tính từ -na/ Danh từ/ じゃない/ だった/ じゃなかった ＋ らしいです',
        ],
        notes: [
          '「らしい」 là một tính từ -i.',
          'Mẫu câu ～らしい này hay dùng với cụm 「よくわからないけど/ よくしらないけど」.',
        ],
        examples: [
          ['うわさでは{彼女|かのじょ}は{会社|かいしゃ}をやめるらしいです。', 'Nghe đồn là cô ấy sẽ nghỉ việc.', 'うわさ: lời đồn'],
          // Bản gốc: 「だれが来たらしいです」 — "có ai đó" là だれか.
          ['だれか{来|き}たらしいです。', 'Hình như có ai đến.', 'Nghe tiếng động ngoài cửa.'],
          [
            'よくわからないけど、{彼女|かのじょ}は{芸能人|げいのうじん}だったらしいです。',
            'Tôi cũng không rõ lắm nhưng nghe mọi người nói cô ấy đã từng là nghệ sĩ nổi tiếng đấy.',
            '芸能人（げいのうじん）: nghệ sĩ, người nổi tiếng',
          ],
        ],
      },
    ],
  },

  // ══ 27 ═════════════════════════════════════════════════════════════════
  {
    id: 'phan-biet-suy-doan',
    title: 'Phân biệt ～よう、～みたい、～そう và ～らしい',
    points: [
      {
        id: 'phan-biet-suy-doan',
        pattern: 'Phân biệt よう・みたい・そう・らしい',
        explanation: [
          'Cả ba mẫu câu này đều có thể dịch là “có vẻ, hình như, dường như”. Tuy nhiên về mặt sắc thái thì khác nhau ở chỗ:',
          '「～よう/ みたい」 diễn đạt sự đánh giá, suy đoán dựa trên cảm giác, thị giác (nhìn), thông tin nghe được từ người khác (nghe) và thậm chí cảm giác thật khi sờ vào hiện vật.',
          '「そう」 thì chỉ diễn đạt sự đánh giá, suy đoán dựa vào cảm giác và thị giác, tức là nhìn thấy như thế nào thì nghĩ và nói ngay ra.',
          '「らしい」 thì đánh giá không dựa vào cảm giác mà phải bằng thông tin thật sự được nghe thấy (là chủ yếu) hoặc nhìn thấy. Do đó 「らしい」 cũng mang tính khách quan hơn 3 mẫu câu còn lại.',
        ],
        tables: [
          table('Căn cứ để suy đoán — △: có 1 chút, ○: có, ×: không có', ['', 'よう/ みたい', 'そう', 'らしい'], [
            ['{感|かん}じる（{勘|かん}）(cảm giác)', '△', '○', '×'],
            ['{見|み}る (nhìn)', '△', '○', '△'],
            ['{聞|き}く (nghe)', '○', '×', '○'],
            ['{触|さわ}る (sờ)', '○', '×', '△'],
          ]),
        ],
        examples: [
          ['あなたは{熱|ねつ}がありそうですね。', 'Trông cậu như bị sốt vậy.', 'Nhìn mặt bạn.'],
          ['あなたは{熱|ねつ}があるようですね。', 'Hình như cậu sốt đấy.', 'Nhìn & sờ trán.'],
          ['あなたは{熱|ねつ}があるらしいですね。', 'Tớ nghe nói hình như cậu bị sốt à.', 'Nghe người khác nói.'],
        ],
      },
    ],
    // Đáp án chép nguyên phần "ĐÁP ÁN" của tài liệu, kể cả câu 3 và câu 4.
    quiz: {
      instruction: 'Chọn câu trả lời đúng (đáp án ở cuối bài).',
      items: [
        [
          '（{田中|たなか}さんの{顔|かお}を{見|み}て）{先生|せんせい}：{田中|たなか}さんは（　　）',
          ['うれしいようですね', 'うれしそうですね', 'うれしいらしいですね'],
          'うれしそうですね',
          'Nhìn mặt Tanaka.',
        ],
        [
          '{木村|きむら}：{何|なに}かいいことが（　　）',
          ['あったようですね', 'あったらしいですね', 'あったそうですね'],
          'あったようですね/ あったらしいですね',
        ],
        [
          '{最近|さいきん}{胃|い}が{痛|いた}い。{私|わたし}は（　　）',
          ['{胃|い}が{悪|わる}いようだ', '{胃|い}が{悪|わる}そうだ', '{胃|い}が{悪|わる}いらしい'],
          '胃が悪いようだ',
          '胃: dạ dày, bao tử、悪い（わるい）: tồi, xấu',
        ],
        [
          '{彼|かれ}の{奥|おく}さんの{話|はなし}では、{彼|かれ}は{最近|さいきん}（　　）',
          ['{胃|い}が{悪|わる}いようだ', '{胃|い}が{悪|わる}そうだ', '{胃|い}が{悪|わる}いらしい'],
          '胃が悪いらしい',
          '奥さん（おくさん）: vợ',
        ],
        [
          'ずいぶん{古|ふる}い{家|いえ}ですね。（　　）',
          ['ねずみがいそうですね', 'ねずみがいるようですね', 'ねずみがいるらしいですね'],
          'ねずみがいるようですね',
        ],
        [
          'あれ、{何|なに}か{音|おと}がしますね。（　　）',
          ['ねずみがいそうですね', 'ねずみがいるようですね', 'ねずみがいるらしいですね'],
          'ねずみがいるらしいですね',
        ],
        [
          '{大|おお}きい{石|いし}ですね。（　　）',
          ['{重|おも}そうですね', '{重|おも}いようですね', '{重|おも}いらしいですね'],
          '重そうですね',
        ],
        [
          '{大|おお}きい{石|いし}ですね。あの{人|ひと}は{持|も}てませんね。（　　）',
          ['{重|おも}そうですね', '{重|おも}いようですね', '{重|おも}いらしいですね'],
          '重そうですね/ 重いようですね',
        ],
        [
          'あの{銅像|どうぞう}ね、だれも{持|も}ち{上|あ}げられなかったんだそうです。ずいぶん（　　）',
          ['{重|おも}そうですね', '{重|おも}いようですね', '{重|おも}いらしいですね'],
          '重いらしいですね',
          '銅像: tượng đồng、持ち上げる（もちあげる）: nhấc lên、ずいぶん: khá',
        ],
        [
          '{課長|かちょう}：{君|きみ}が{担当|たんとう}しているあの{契約|けいやく}、どうなっているのかね。{部下|ぶか}：（　　）',
          ['うまくいきそうです', 'うまくいっているようです', 'うまくいったそうです'],
          'うまくいきそうです',
          'Hội thoại giữa trưởng phòng (課長) và cấp dưới (部下). 担当する: đảm nhiệm, phụ trách、契約: hợp đồng、うまい: tốt, suôn sẻ',
        ],
      ],
    },
  },

  // ══ 28 ═════════════════════════════════════════════════════════════════
  {
    id: 'ni-wa',
    title: '～には: đối với …',
    points: [
      {
        id: 'ni-wa',
        pattern: '～には',
        meaning: 'Đối với … (ai, cái gì)',
        structures: ['[Danh từ] ＋ には: Đối với ai, đối với cái gì'],
        examples: [
          ['{今|いま} {私|わたし}には{日本語|にほんご}の{新聞|しんぶん}はむずかしいです。', 'Đối với tôi bây giờ thì báo tiếng Nhật vẫn còn khó.'],
          [
            '{英語|えいご}で{話|はな}すことは{彼|かれ}には{問題|もんだい}ありません。',
            'Đối với anh ấy thì việc nói tiếng Anh không có vấn đề gì cả.',
            '問題（もんだい）: vấn đề',
          ],
        ],
      },
    ],
  },

  // ══ 29 ═════════════════════════════════════════════════════════════════
  {
    id: 'ni-suru',
    title: '～にする',
    points: [
      {
        id: 'ni-suru',
        pattern: 'Nにする',
        meaning: 'Quyết định chọn … (cái gì)',
        group: 'quyet-dinh',
        structures: ['Cấu trúc 1: [Danh từ] ＋ にする: Quyết định chọn cái gì'],
        examples: [
          ['コーヒーにします。', 'Tôi chọn cà phê.', 'Gọi món trong nhà hàng.'],
          [
            '{夏休|なつやす}みの{旅行|りょこう}は{日本|にほん}にします。',
            'Tôi quyết định sẽ chọn Nhật để đi du lịch vào kì nghỉ hè.',
          ],
        ],
      },
      {
        id: 'koto-ni-suru',
        pattern: '～ことにする',
        meaning: 'Quyết định làm / không làm gì',
        group: 'quyet-dinh',
        structures: ['Cấu trúc 2: [Động từ thể từ điển/ thể ない] ＋ ことにする: Quyết định làm gì/ không làm gì'],
        examples: [
          ['{日本|にほん}に{留学|りゅうがく}することにしました。', 'Tôi đã quyết định đi du học Nhật.'],
          ['{仕事|しごと}をやめることにします。', 'Tôi vừa quyết định là sẽ nghỉ việc.'],
        ],
      },
    ],
  },

  // ══ 30 ═════════════════════════════════════════════════════════════════
  {
    id: 'tinh-tu-suru',
    title: 'Tính từ ＋ する: Làm cho …',
    points: [
      {
        id: 'tinh-tu-suru',
        pattern: '～く／～に＋する',
        meaning: 'Làm cho … (trở nên …)',
        structures: ['Tính từ -i (bỏ い) ＋ く ＋ する', 'Tính từ -na (bỏ な) ＋ に ＋ する'],
        examples: [
          [
            'かみを みじかく します。',
            'Tôi sẽ cắt ngắn tóc.',
            'Nguyên văn: Tôi sẽ làm cho tóc ngắn đi.',
            { vi: ['Tôi sẽ làm cho tóc ngắn đi.'] },
          ],
          [
            '{部屋|へや}を きれいに しました。',
            'Tôi đã dọn sạch phòng.',
            'Nguyên văn: Tôi đã làm cho sạch phòng.',
            { vi: ['Tôi đã làm cho sạch phòng.'] },
          ],
          [
            'テレビの{音|おと}を {小|ちい}さく してください。',
            'Hãy vặn nhỏ tiếng ti vi đi.',
            'Nguyên văn: Hãy làm cho tiếng tivi nhỏ đi.',
            { vi: ['Hãy làm cho tiếng tivi nhỏ đi.'] },
          ],
          [
            'もう {夜|よる} {遅|おそ}いですから、{静|しず}かに して いただけませんか。',
            'Đã tối muộn rồi nên làm ơn giữ yên lặng giùm tôi.',
          ],
          ['{水|みず}の{量|りょう}を {二倍|にばい}に してください。', 'Hãy tăng lượng nước lên gấp đôi.', '二倍: gấp đôi'],
          ['{砂糖|さとう}の{量|りょう}を{半分|はんぶん}に してください。', 'Hãy giảm lượng đường xuống còn một nửa.'],
        ],
      },
    ],
  },

  // ══ 31 ═════════════════════════════════════════════════════════════════
  {
    id: 'mou-mada',
    title: '「もう」 và 「まだ」',
    intro: [
      'Sự khác nhau về sắc thái ý nghĩa giữa 「もう」 và 「まだ」: 「もう」 có sự thay đổi (「もう」は変化があります), còn 「まだ」 không có sự thay đổi (「まだ」は変化がありません).',
    ],
    points: [
      {
        id: 'mou-mashita',
        pattern: 'もう～ました',
        meaning: 'Đã … rồi',
        group: 'mou-mada',
        examples: [
          ['もう{晩|ばん}ご{飯|はん}を{食|た}べました。', 'Đã ăn tối rồi.'],
          ['{冬休|ふゆやす}みの{予定|よてい}、もう{決|き}めましたか。', 'Kế hoạch cho kì nghỉ đông, anh đã quyết chưa?'],
          ['はい、もう{決|き}めました。', 'Rồi, đã quyết rồi.', 'Trả lời cho 冬休みの予定、もう決めましたか。'],
          [
            '{昨日|きのう}この{漢字|かんじ}を{勉強|べんきょう}しましたが、{読|よ}み{方|かた}がもうわすれてしまいました。',
            'Hôm qua đã học từ kanji này rồi mà đã quên mất cách đọc rồi.',
          ],
          ['お{父|とう}さんはもうかえったみたいです。', 'Hình như bố đã về rồi.'],
        ],
      },
      {
        id: 'mada-te-imasen',
        pattern: 'まだ～ていません',
        meaning: 'Vẫn chưa …',
        group: 'mou-mada',
        examples: [
          ['まだ{晩|ばん}ご{飯|はん}を{食|た}べていません。', 'Vẫn chưa ăn tối.'],
          [
            '{石田|いしだ}さんはもう{来|き}ましたが、{田中|たなか}さんはまだ{来|き}ていません。',
            'Anh Ishida đã đến rồi nhưng anh Tanaka thì vẫn chưa đến.',
          ],
        ],
      },
      {
        id: 'mada-te-imasu',
        pattern: 'まだ～ています',
        meaning: 'Vẫn (còn) …',
        group: 'mou-mada',
        examples: [
          ['まだ{彼|かれ}を{愛|あい}しています。', 'Vẫn còn yêu anh ta.'],
          ['{日本語|にほんご}、まだべんきょうしてる？', 'Cậu vẫn đang học tiếng Nhật chứ?'],
        ],
      },
      {
        id: 'mou-te-imasen',
        pattern: 'もう～ていません',
        meaning: 'Không còn … nữa',
        group: 'mou-mada',
        examples: [
          ['もう{彼|かれ}を{愛|あい}していません。', 'Không còn yêu anh ta nữa.'],
          [
            'いいえ、もう[やめた/{勉強|べんきょう}してない]。',
            'Không, [tớ đã bỏ rồi/tớ không còn học nữa].',
            'Trả lời cho 日本語、まだべんきょうしてる？',
          ],
        ],
      },
    ],
  },

  // ══ 32 ═════════════════════════════════════════════════════════════════
  {
    id: 'tame-ni-you-ni',
    title: '～ために、～ように',
    points: [
      {
        id: 'tame-ni',
        pattern: '～ために',
        meaning: 'Để …, vì … (mục đích hướng về người nói, người nói tự kiểm soát được)',
        group: 'muc-dich',
        explanation: ['～ために: Để làm gì/ Vì cái gì … (Mục đích).'],
        structures: ['[Danh từ] ＋ の ＋ ために', '[Động từ thể từ điển] ＋ ために'],
        examples: [
          ['{試験|しけん}のために、{毎日|まいにち}べんきょうしています。', 'Ngày nào tôi cũng học để chuẩn bị cho kỳ thi.'],
          ['{結婚式|けっこんしき}に{行|い}くために、{化粧|けしょう}します。', 'Tôi trang điểm để đi dự tiệc cưới.'],
          [
            '{海外旅行|かいがいりょこう}のために、{新|あたら}しいスニーカーを{買|か}います。',
            'Tôi sẽ mua một đôi giày sneaker mới để đi du lịch nước ngoài.',
          ],
        ],
      },
      {
        id: 'you-ni-muc-dich',
        pattern: '～ように',
        meaning: 'Để có thể …, để không … (mục đích nằm ngoài sự kiểm soát trực tiếp của người nói)',
        group: 'muc-dich',
        structures: ['[Động từ thể từ điển/ thể ない/ thể khả năng] ＋ ように'],
        explanation: [
          '～ように: Để có thể mà, để mà … Cũng là mẫu câu diễn đạt mục đích, nhưng 「～ように」 khác với 「～ために」 ở chỗ: mục đích được đề cập đến không thuộc sự kiểm soát trực tiếp của người nói. 「～ように」 do đó, thường hay đi kèm với thể khả năng (để có thể…), tự động từ hoặc thể ない (để không …).',
        ],
        examples: [
          ['みんなによく{見|み}えるように、{字|じ}を{大|おお}きく{書|か}きました。', 'Tôi viết chữ to để mọi người có thể nhìn rõ.'],
          [
            '{忘|わす}れないように、メモします。',
            'Tôi memo [ghi lại/] để không quên.',
            '',
            { vi: ['Tôi ghi lại để không quên.'] },
          ],
          ['{風邪|かぜ}をひかないように、コートを{着|き}た。', 'Tôi mặc áo khoác để không bị cảm.', '着る（きる）: mặc'],
        ],
      },
      {
        id: 'phan-biet-tame-you',
        pattern: 'Phân biệt 「～ように」 và 「～ために」',
        notes: ['Thể ない thường chỉ dùng với 「ように」.'],
        usages: [
          {
            title: '① So sánh hai câu',
            examples: [
              [
                '{子|こ}どもが{勉強|べんきょう}するように、{新|あたら}しい{机|つくえ}を{買|か}ってあげました。',
                'Tôi mua tặng con cái bàn mới để con học.',
                'Mục đích là hướng về “con”, không phải “tôi”.',
              ],
              [
                '{私|わたし}は{勉強|べんきょう}するために、{新|あたら}しい{机|つくえ}を{買|か}いました。',
                'Tôi mua cái bàn mới để tôi học.',
                'Mục đích là hướng về bản thân “tôi”.',
              ],
            ],
          },
          {
            title: '② So sánh hai câu',
            examples: [
              [
                'みんなによく{見|み}えるように、{字|じ}を{大|おお}きく{書|か}きました。',
                'Tôi viết chữ to để mọi người có thể nhìn rõ.',
                'Mục đích là hướng về “mọi người”, không phải “tôi”.',
              ],
              [
                'みんなに{説明|せつめい}するために、Powerpointを{使|つか}いました。',
                'Tôi dùng powerpoint để giải thích cho mọi người.',
                'Mục đích là “giúp tôi giải thích”, hướng về “tôi”.',
              ],
            ],
          },
          {
            title: '③ Mục đích vẫn hướng về người nói, nhưng thuộc về khả năng hoặc người nói không kiểm soát hay quyết định trực tiếp được thì cũng dùng 「ように」',
            examples: [
              [
                'ハワイに{行|い}けるように、お{金|かね}を{貯|た}めています。',
                'Tôi tiết kiệm tiền để có thể đi Hawaii.',
                'Thuộc về khả năng. 貯める（ためる）: tiết kiệm',
              ],
              [
                '{風邪|かぜ}をひかないように、コートを{着|き}た。',
                'Tôi mặc áo khoác để không bị cảm.',
                'Tôi không kiểm soát được việc “bị cảm”, nên làm gì đó để phòng tránh.',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 33 ═════════════════════════════════════════════════════════════════
  {
    id: 'dong-tu-ghep',
    title: '複合動詞: Động từ ghép',
    intro: [
      'Động từ ghép (複合動詞: ふくごうどうし) là động từ cấu tạo bởi hai động từ khác ghép lại. Cấu trúc: [Động từ 1] ＋ [Động từ 2].',
      'Ví dụ: 言います (nói) ＋ 過ぎます (quá) → 言い過ぎます: nói quá nhiều; 書きます (viết) ＋ 忘れます (quên) → 書き忘れます: quên viết.',
    ],
    points: [
      {
        id: 'wasuremasu',
        pattern: '～忘れます',
        meaning: 'Quên làm gì',
        examples: [
          ['{大切|たいせつ}なことを{言|い}い{忘|わす}れました。', 'Tôi đã quên nói điều quan trọng.', '大切（たいせつ）: quan trọng'],
          ['テストに{名前|なまえ}を{書|か}き{忘|わす}れました。', 'Tôi đã quên viết tên vào bài kiểm tra.'],
        ],
      },
      {
        id: 'sugimasu',
        pattern: '～過ぎます',
        meaning: 'Làm gì quá mức, quá nhiều',
        examples: [
          ['きのう、{食|た}べ{過|す}ぎました。', 'Hôm qua tôi đã ăn quá nhiều.'],
          ['テレビを{見|み}すぎて、{目|め}が{疲|つか}れました。', 'Xem ti vi quá nhiều nên mắt bị mỏi.', '疲れる（つかれる）: mệt/ mỏi'],
          ['{彼|かれ}は{働|はたら}きすぎて、{病気|びょうき}になってしまいました。', 'Anh ấy làm việc quá sức nên bị ốm rồi.'],
        ],
      },
      {
        id: 'hajimemasu',
        pattern: '～始めます',
        meaning: 'Bắt đầu làm gì',
        group: 'bat-dau',
        examples: [
          ['{彼|かれ}、{遅|おそ}いですね。{食|た}べ{始|はじ}めましょうか。', 'Anh ấy lâu thế nhỉ. Hay là bắt đầu ăn luôn đi.'],
          [
            '{友達|ともだち}の{子|こ}どもは1{歳|さい}になったとき、{歩|ある}き{始|はじ}めました。',
            'Con của bạn tôi đã bắt đầu biết đi khi lên 1 tuổi.',
          ],
          ['まだ{書|か}き{始|はじ}めないでください。', 'Xin vui lòng chưa bắt đầu viết vội.'],
        ],
      },
      {
        id: 'dashimasu',
        pattern: '～出します',
        meaning: 'Bắt đầu làm gì (một cách bất thình lình)',
        group: 'bat-dau',
        examples: [
          [
            '{急|きゅう}に{空|そら}が{暗|くら}くなって、{雨|あめ}が{降|ふ}り{出|だ}しました。',
            'Bất chợt trời tối đi và mưa bắt đầu rơi.',
            '急に: bất ngờ, bất chợt、暗い（くらい）: tối',
          ],
          [
            '{赤|あか}ちゃんが{急|きゅう}に{泣|な}き{出|だ}しました。',
            'Em bé đột nhiên khóc òa lên.',
            '赤ちゃん（あかちゃん）: em bé、泣く（なく）: khóc',
          ],
          ['{彼|かれ}が{急|きゅう}に{笑|わら}い{出|だ}しました。', 'Đột nhiên anh ta cười ầm lên.', '笑う（わらう）: cười'],
        ],
      },
      {
        id: 'tsuzukemasu',
        pattern: '～続けます',
        meaning: 'Tiếp tục / liên tục làm gì',
        examples: [
          ['きのう、{朝|あさ}まで{飲|の}み{続|つづ}けました。', 'Hôm qua tôi đã uống liên tục đến sáng.'],
          ['もう 30{分|ぷん}も{待|ま}ち{続|つづ}けています。', 'Liên tục đợi đến 30 phút rồi.'],
          ['もう{時間|じかん}ですが、みんな{書|か}き{続|つづ}けています。', 'Hết giờ rồi mà mọi người vẫn tiếp tục viết.'],
        ],
      },
      {
        id: 'owarimasu',
        pattern: '～終わります',
        meaning: 'Kết thúc, làm xong việc gì',
        examples: [
          ['この{本|ほん}はもう{読|よ}み{終|お}わりました。', 'Tôi đọc xong cuốn sách này rồi.'],
          ['もう{食|た}べ{終|お}わりますから、ちょっと{待|ま}ってください。', 'Tôi ăn xong rồi đây, đợi tôi một chút nhé.'],
          ['{書|か}き{終|おわ}ったら、{私|わたし}に{見|み}せてください。', 'Viết xong thì đưa cho tôi xem nhé.'],
        ],
      },
      {
        id: 'naoshimasu',
        pattern: '～直します',
        meaning: 'Làm lại việc gì',
        examples: [
          ['もう{一度|いちど}{考|かんが}え{直|なお}してください。', 'Hãy nghĩ lại lần nữa đi.', '一度（いちど）: một lần'],
          [
            '{間違|まちが}いが{多|おお}いので、{書|か}き{直|なお}します。',
            'Bị sai nhiều nên tôi sẽ viết lại.',
            '間違い（まちがい）: lỗi, sự nhầm lẫn',
          ],
          ['{人生|じんせい}はやり{直|なお}すことができません。', 'Cuộc đời thì không thể làm lại được.', '人生: cuộc đời'],
        ],
      },
      {
        id: 'kaemasu',
        pattern: '～かえます',
        meaning: 'Thay, đổi (làm gì đó để thay sang cái khác)',
        examples: [
          ['{新大阪|しんおおさか}でJRに{乗|の}りかえます。', 'Tôi sẽ đổi sang tàu JR ở ga Shin Osaka.'],
          ['ここで{靴|くつ}を{履|は}きかえてください。', 'Hãy thay giày tại đây.', '履く（はく）: đi giày'],
          ['{新|あたら}しい{電池|でんち}に{取|と}りかえます。', 'Thay pin mới.', '電池: pin'],
        ],
      },
    ],
  },

  // ══ 34 ═════════════════════════════════════════════════════════════════
  {
    id: 'sugiru',
    title: '～すぎる: Quá …',
    points: [
      {
        id: 'sugiru',
        pattern: '～すぎる',
        meaning: 'Quá … (vượt quá mức độ, thể hiện sự không hài lòng)',
        explanation: [
          'Cấu trúc này biểu thị sự vượt quá mức độ nào đó, thể hiện thái độ không thích, không hài lòng của người nói.',
        ],
        structures: [
          '[Động từ thể ます (bỏ ます)] ＋ すぎる: làm gì quá nhiều, quá mức',
          '[Tính từ -i (bỏ い)]/ [Tính từ -na (bỏ な)] ＋ すぎる: quá …',
        ],
        examples: [
          ['アンちゃんは あまいものを たべすぎる。', 'Bé An ăn đồ ngọt nhiều quá.'],
          ['このもんだいは むずかしすぎる。', 'Câu hỏi này quá khó.', 'むずかしい: khó'],
          ['かれは おさけを のみすぎました。', 'Anh ta đã uống quá nhiều rượu.'],
          ['ロシアは さむすぎる。', 'Ở Nga quá lạnh.'],
        ],
      },
    ],
  },

  // ══ 35 ═════════════════════════════════════════════════════════════════
  {
    id: 'yasui-nikui',
    title: '～やすい、～にくい',
    points: [
      {
        id: 'yasui',
        pattern: '～やすい',
        meaning: 'Dễ làm gì',
        group: 'de-kho',
        structures: ['Mẫu câu 1: [Động từ thể ます (bỏ ます)] ＋ やすい(です): dễ làm gì'],
        tables: [
          table('Ví dụ', ['Thể từ điển', 'Thể ます', '～やすい'], [
            ['{使|つか}う', '{使|つか}います', '{使|つか}いやすい (dễ sử dụng)'],
            ['{分|わ}かる', 'わかります', '{分|わ}かりやすい (dễ hiểu)'],
            ['{変|か}わる', '{変|か}わります', '{変|か}わりやすい (dễ thay đổi)'],
          ]),
        ],
        examples: [
          ['このくすりは のみやすいです。', 'Thuốc này dễ uống.'],
          ['{彼|かれ}の{説明|せつめい}は わかりやすいです。', 'Phần giải thích của anh ấy dễ hiểu.'],
        ],
      },
      {
        id: 'nikui',
        pattern: '～にくい',
        meaning: 'Khó làm gì',
        group: 'de-kho',
        structures: ['Mẫu câu 2: [Động từ thể ます (bỏ ます)] ＋ にくい(です): khó làm gì'],
        tables: [
          table('Ví dụ', ['Thể từ điển', 'Thể ます', '～にくい'], [
            ['{使|つか}う', '{使|つか}います', '{使|つか}いにくい (khó sử dụng)'],
            ['{分|わ}かる', 'わかります', '{分|わ}かりにくい (khó hiểu)'],
            ['{変|か}わる', '{変|か}わります', '{変|か}わりにくい (khó thay đổi)'],
          ]),
        ],
        examples: [
          ['さしみは {食|た}べにくいです。', 'Sashimi [gỏi cá sống/] rất là khó ăn.'],
          ['このコップは われにくいです。', 'Cái cốc này khó vỡ.'],
        ],
      },
    ],
  },

  // ══ 36 ═════════════════════════════════════════════════════════════════
  {
    id: 'bi-dong',
    title: '受身形: Thể bị động',
    points: [
      {
        id: 'ukemi',
        pattern: '受身形（書かれる・食べられる）',
        meaning: 'Bị / được (ai đó) làm gì (thể bị động)',
        group: 'ukemi-shieki',
        tables: [
          table('Cách chia động từ thể bị động (受身: うけみ) từ thể từ điển', ['Nhóm', 'Thể từ điển', 'Thể bị động'], [
            ['Nhóm 1: う → あ ＋ れる', '{話|はな}す', '{話|はな}される'],
            ['Nhóm 1: う → あ ＋ れる', '{言|い}う', '{言|い}われる'],
            ['Nhóm 1: う → あ ＋ れる', '{書|か}く', '{書|か}かれる'],
            ['Nhóm 2: bỏ る → られる', '{食|た}べる', '{食|た}べられる'],
            ['Nhóm 2: bỏ る → られる', '{見|み}る', '{見|み}られる'],
            ['Nhóm 2: bỏ る → られる', '{教|おし}える', '{教|おし}えられる'],
            ['Nhóm 3 (bất quy tắc)', 'する', 'される'],
            ['Nhóm 3 (bất quy tắc)', '{来|く}る', '{来|こ}られる'],
          ]),
        ],
        notes: [
          'Dạng bị động của động từ nhóm 2 (và của 来る) giống với cách chia thể khả năng.',
          'Thể bị động trong tiếng Nhật hay được sử dụng để thể hiện tình trạng không thoải mái, hoặc cảm thấy phiền toái (nghĩa tốt có sử dụng nhưng không nhiều). Nghĩa tốt thường được dùng với mẫu câu 「てもらいます」 hay 「てくれます」 nhiều hơn.',
        ],
        usages: [
          {
            title: 'Bị động trực tiếp (chỉ có 1 tân ngữ)',
            detail:
              'Dạng chủ động: A は B を ＋ động từ chủ động → Dạng bị động: B は A に ＋ động từ bị động (B được/ bị A …)',
            examples: [
              [
                '{私|わたし}は {先生|せんせい}に ほめられました。',
                'Tôi đã được cô giáo khen.',
                'Câu chủ động: 先生は 私を ほめました。(Cô giáo đã khen tôi.)',
              ],
              [
                '{私|わたし}は {母|はは}に しかられました。',
                'Tôi đã bị mẹ mắng.',
                'Câu chủ động: 母は 私を しかりました。(Mẹ đã mắng tôi.) しかる: mắng',
              ],
            ],
          },
          {
            title: 'Bị động gián tiếp (2 tân ngữ)',
            detail: 'Dạng chủ động: A が B に C を ＋ động từ chủ động → Dạng bị động: B は A に C を ＋ động từ bị động',
            examples: [
              [
                '{私|わたし}は {知|し}らない{人|ひと}に {道|みち}を {聞|き}かれました。',
                'Tôi bị một người không quen hỏi đường.',
                'Câu chủ động: 知らない人が 私に 道を 聞きました。(Một người không quen đã hỏi đường tôi.)',
              ],
              [
                '{私|わたし}は {近所|きんじょ}の{人|ひと}に いつも{文句|もんく}を {言|い}われます。',
                'Tôi suốt ngày bị hàng xóm phàn nàn.',
                'Câu chủ động: 近所の人が 私に いつも文句を 言います。(Hàng xóm cứ suốt ngày phàn nàn về tôi.) 近所（きんじょ）: vùng lân cận, gần nhà、文句（もんく）: kêu ca, phàn nàn (文句を言う)',
              ],
            ],
          },
          {
            title: 'Bị động gián tiếp với mẫu câu: A は B の [Danh từ] を ＋ động từ chủ động',
            detail: '→ Dạng bị động: B は A に [Danh từ] を ＋ động từ bị động',
            examples: [
              [
                '{私|わたし}は {先生|せんせい}に {日本語|にほんご}を ほめられました。',
                'Tiếng Nhật của tôi được cô giáo khen.',
                'Câu chủ động: 先生は 私の日本語を ほめました。(Cô giáo khen tiếng Nhật của tôi.)',
              ],
              [
                '{私|わたし}は {友達|ともだち}に {携帯|けいたい}を {壊|こわ}されました。',
                'Di động của tôi bị bạn làm hỏng.',
                'Câu chủ động: 友達は 私の携帯を 壊しました。(Bạn tôi làm hỏng cái di động của tôi.)',
              ],
            ],
          },
          {
            title: 'Bị động khi chủ thể của hành động không quan trọng, không cần nhắc đến',
            detail:
              'Chủ thể của hành động khi chuyển sang bị động sẽ chuyển thành dạng 「だれに」 (bởi ai đó) nhưng trong trường hợp người đó không được biết đến, hoặc thông tin không quan trọng thì có thể bỏ đi.',
            examples: [
              ['この{家|いえ}は 200{年|ねん}{前|まえ}に {建|た}てられました。', 'Ngôi nhà này được xây cách đây 200 năm.'],
              // Bản gốc dịch "sẽ được tổ chức", ngược với 行われました (đã).
              [
                'オリンピックは 2020{年|ねん}に {東京|とうきょう}で {行|おこな}われました。',
                'Olympic đã được tổ chức ở Tokyo vào năm 2020.',
                '行う（おこなう）: tiến hành, tổ chức',
              ],
            ],
          },
          {
            title: 'Bị động sử dụng cụm 「によって」 (bởi …)',
            detail:
              '「によって」 thường được sử dụng thay cho 「に」 khi nhắc đến tác giả của những tác phẩm, công trình nghệ thuật, kiến trúc, phát minh có ý nghĩa lịch sử, xã hội quan trọng.',
            examples: [
              ['「ハムレット」は シェークスピアによって {書|か}かれました。', 'Hamlet được viết bởi Shakespeare.'],
              [
                '「モナリザ」は レオナルド・ダ・ウィンチによって {描|か}かれました。',
                'Bức tranh nàng Monalisa do Leonardo da Vinci vẽ.',
                '描く（かく）: vẽ',
              ],
            ],
          },
          {
            title: 'Dạng bị động của tự động từ',
            detail:
              'Đây là trường hợp đặc biệt và không có dạng câu chủ động tương đương với nó. Dạng bị động này thường được sử dụng để thể hiện sự bực tức, khó chịu, cảm giác bị làm phiền.',
            examples: [
              ['{今朝|けさ} {雨|あめ}に{降|ふ}られました。', 'Sáng nay bị dính mưa.'],
              [
                '{夜中|よなか}の 2{時|じ} {友達|ともだち}に{来|こ}られて、{困|こま}りました。',
                '2 giờ đêm thì bị bạn đến, thật là phiền phức.',
                '夜中: nửa đêm、困る（こまる）: khó chịu, phiền phức',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 37 ═════════════════════════════════════════════════════════════════
  {
    id: 'sai-khien',
    title: '使役形: Thể sai khiến',
    points: [
      {
        id: 'shieki',
        pattern: '使役形（書かせる・食べさせる）',
        meaning: 'Bắt / cho phép (ai) làm gì; làm cho (ai) … (thể sai khiến)',
        group: 'ukemi-shieki',
        tables: [
          table('Cách chia thể sai khiến 使役形 (しえきけい) từ thể từ điển', ['Nhóm', 'Thể từ điển', 'Thể sai khiến'], [
            ['Nhóm 1: う → あ ＋ せる', '{言|い}う', '{言|い}わせる'],
            ['Nhóm 1: う → あ ＋ せる', '{話|はな}す', '{話|はな}させる'],
            ['Nhóm 1: う → あ ＋ せる', '{書|か}く', '{書|か}かせる'],
            ['Nhóm 2: る → させる', '{食|た}べる', '{食|た}べさせる'],
            ['Nhóm 2: る → させる', '{見|み}る', '{見|み}させる'],
            ['Nhóm 2: る → させる', '{起|お}きる', '{起|お}きさせる'],
            ['Nhóm 3 (bất quy tắc)', 'する', 'させる'],
            ['Nhóm 3 (bất quy tắc)', '{来|く}る', '{来|こ}させる'],
          ]),
        ],
        usages: [
          {
            title: '1. A は B に ＋ [Danh từ] を ＋ 使役形: A bắt B làm việc gì (trường hợp có 2 tân ngữ)',
            examples: [
              [
                '{先生|せんせい}は いつも{私|わたし}たちに {宿題|しゅくだい}を たくさんさせます。',
                'Cô giáo lúc nào cũng bắt chúng tôi làm nhiều bài tập.',
              ],
              [
                'こどもに {時々|ときどき}{自分|じぶん}で{部屋|へや}を そうじさせたほうがいいと{思|おも}います。',
                'Thỉnh thoảng nên bắt trẻ con tự dọn phòng thì tốt hơn.',
              ],
              ['{母|はは}は {毎日|まいにち}{私|わたし}に {英語|えいご}を {勉強|べんきょう}させる。', 'Ngày nào mẹ cũng bắt tôi học tiếng Anh.'],
            ],
          },
          {
            title: '2. A は B に ＋ [Danh từ] を ＋ 使役形: A cho phép B làm gì (trường hợp có 2 tân ngữ)',
            examples: [
              ['{両親|りょうしん}は {私|わたし}に {好|す}きなことを させました。', 'Bố mẹ đã cho phép tôi làm những gì mình thích.'],
              [
                '{先生|せんせい}は {学生|がくせい}に ひらがなで {宿題|しゅくだい}を {書|か}かせました。',
                'Giáo viên cho phép học sinh viết bài tập bằng hiragana.',
              ],
              ['{父|ちち}は {私|わたし}に {携帯|けいたい}を {使|つか}わせません。', 'Bố không cho phép tôi dùng di động.'],
              ['{私|わたし}は {子|こ}どもに コカコーラを {飲|の}ませません。', 'Tôi không cho phép con uống coca.'],
            ],
          },
          {
            title: '3. A は B を ＋ 使役形: A bắt/ cho phép B làm việc gì (trường hợp có 1 tân ngữ)',
            examples: [
              ['コーチは {山田|やまだ}さんを {走|はし}らせました。', 'Huấn luyện viên bắt Yamada chạy bộ.', '走る（はしる）: chạy'],
              [
                '{部長|ぶちょう}は {私|わたし}を {出張|しゅっちょう}に {行|い}かせました。',
                'Trưởng phòng bắt tôi đi công tác.',
                '出張（しゅっちょう）: công tác',
              ],
              ['お{母|かあ}さんは {子|こ}どもを はやく{寝|ね}させます。', 'Mẹ bắt con ngủ sớm.'],
            ],
          },
          {
            title: 'A は B を ＋ 使役形 (động từ bộc lộ cảm xúc): A làm cho B … (bộc lộ cảm xúc)',
            detail:
              'Một số động từ bộc lộ cảm xúc khác: 喜ぶ（よろこぶ）: vui、がっかりする: thất vọng、泣く（なく）: khóc、悲しむ（かなしむ）: buồn、安心する（あんしんする）: an tâm、困る（こまる）: phiền phức, phiền toái',
            examples: [
              [
                '{田中|たなか}さんは いつもおもしろい{話|はなし}をして、みんなを {笑|わら}わせます。',
                'Anh Tanaka lúc nào cũng kể chuyện thú vị làm tất cả mọi người cười.',
                '笑う（わらう）: cười',
              ],
              [
                '{私|わたし}は {病気|びょうき}になって、{両親|りょうしん}を {心配|しんぱい}させました。',
                'Tôi bị bệnh, làm cho bố mẹ lo lắng.',
                '心配する（しんぱいする）: lo lắng',
              ],
              [
                '{彼|かれ}は デートに{遅|おく}れて、{彼女|かのじょ}を {怒|おこ}らせた。',
                'Anh đến buổi hẹn muộn làm cho cô ấy tức giận.',
                '怒る（おこる）: tức giận',
              ],
            ],
          },
        ],
      },
      {
        id: 'sasete-kudasai',
        pattern: '～(さ)せてください',
        meaning: 'Hãy cho phép tôi làm … (xin phép)',
        structures: ['Thể sai khiến dạng て ＋ ください: Hãy cho phép tôi làm …'],
        examples: [
          ['すみません、お{金|かね}を{払|はら}わせてください。', 'Xin hãy để tôi trả tiền.', '払う（はらう）: trả tiền, thanh toán'],
          ['すみません、トイレに{行|い}かせてください。', 'Cho phép tôi vào nhà vệ sinh.'],
          ['{今日|きょう}ははやく{帰|かえ}らせてください。', 'Hãy cho phép tôi về sớm ngày hôm nay.'],
          ['すみません、もうすこし {考|かんが}えさせてください。', 'Xin cho phép tôi nghĩ thêm chút nữa.'],
        ],
      },
      {
        id: 'shieki-ukemi',
        pattern: '使役受身形（書かされる・食べさせられる）',
        meaning: 'Bị (ai) bắt làm gì (thể sai khiến bị động)',
        group: 'ukemi-shieki',
        explanation: [
          'Thể sai khiến bị động (使役受身: しえきうけみ): dạng bị động của thể sai khiến (bị bắt phải làm gì) thể hiện thái độ không vừa lòng, khó chịu của người nói khi bị người khác ép buộc.',
          'Cách chia: từ thể sai khiến dạng chủ động, ta chuyển đuôi る → られる.',
        ],
        tables: [
          table('Cách chia', ['Nhóm', 'Thể sai khiến', 'Thể sai khiến bị động'], [
            ['Nhóm 1', '{話|はな}させる', '{話|はな}させられる'],
            ['Nhóm 1', '{言|い}わせる', '{言|い}わせられる'],
            ['Nhóm 2', '{食|た}べさせる', '{食|た}べさせられる'],
            ['Nhóm 2', '{見|み}させる', '{見|み}させられる'],
            ['Nhóm 3', 'させる', 'させられる'],
            ['Nhóm 3', '{来|こ}させる', '{来|こ}させられる'],
          ]),
        ],
        notes: [
          'Với động từ nhóm 1, ～せられる cũng có thể được rút gọn thành ～される: 行かせられる → 行かされる, 言わせられる → 言わされる, 書かせられる → 書かされる. Trừ trường hợp nếu phía trước ～せられる là 「さ」 thì vẫn giữ nguyên là ～させられる: 「話させられる」 hay 「押させられる」 thì vẫn giữ nguyên, không có dạng rút gọn.',
        ],
        examples: [
          ['{私|わたし}は {両親|りょうしん}に アメリカに {留学|りゅうがく}させられた。', 'Tôi bị bố mẹ bắt đi du học ở Mỹ.'],
          ['{母|はは}に {部屋|へや}を {掃除|そうじ}させられた。', 'Tôi bị mẹ bắt dọn phòng.', '掃除する（そうじする）: dọn dẹp'],
          [
            '{田中|たなか}さんは {部長|ぶちょう}に ビールを たくさん{飲|の}ませられた。',
            'Anh Tanaka bị trưởng phòng bắt uống nhiều bia.',
          ],
          ['{私|わたし}たちは {先生|せんせい}に {宿題|しゅくだい}を たくさんさせられました。', 'Chúng tôi bị cô giáo bắt làm nhiều bài tập.'],
        ],
      },
    ],
  },

  // ══ 38 ═════════════════════════════════════════════════════════════════
  {
    id: 'menh-lenh',
    title: 'Thể mệnh lệnh: 命令形',
    points: [
      {
        id: 'meirei',
        pattern: '命令形（書け・食べろ・しろ・来い）',
        meaning: 'Làm đi! / làm mau! (ra lệnh, sai khiến)',
        group: 'menh-lenh',
        explanation: [
          'Thể mệnh lệnh 命令形 (めいれいけい) được dùng để ra lệnh, sai khiến. Thể này thường dùng khi ra mệnh lệnh trong quân đội, ra lệnh cho tội phạm, chỉ dẫn hoặc đưa ra mệnh lệnh trong những trường hợp khẩn cấp, cấp cứu.',
          'Trong hội thoại hàng ngày thể này chỉ được dùng khi cực kỳ tức giận, nói chuyện giữa bạn bè cực kỳ thân thiết, bố mẹ nói với con cái hoặc ra lệnh cho vật nuôi. Với những người bình thường thì tránh dùng vì có thể gây xúc phạm, thất lễ, hoặc bị đánh giá không tốt.',
        ],
        tables: [
          table('Cách chia thể mệnh lệnh', ['Nhóm', 'Thể từ điển', 'Thể mệnh lệnh'], [
            ['Nhóm 1: う → え', '{言|い}う', '{言|い}え (nói mau/ nói đi)'],
            ['Nhóm 1: う → え', '{話|はな}す', '{話|はな}せ (nói mau/ nói đi)'],
            ['Nhóm 1: う → え', '{書|か}く', '{書|か}け (viết đi/ viết mau)'],
            ['Nhóm 1: う → え', '{頑張|がんば}る', '{頑張|がんば}れ (cố lên)'],
            ['Nhóm 2: る → ろ', '{食|た}べる', '{食|た}べろ (ăn đi/ ăn mau)'],
            ['Nhóm 2: る → ろ', '{見|み}る', '{見|み}ろ (nhìn đi)'],
            ['Nhóm 2: る → ろ', '{起|お}きる', '{起|お}きろ (dậy mau)'],
            ['Nhóm 3', 'する', 'しろ (làm đi, làm mau)'],
            ['Nhóm 3', '{来|く}る', '{来|こ}い (lại đây)'],
          ]),
        ],
      },
      {
        id: 'na-cam',
        pattern: '～な（Vる＋な）',
        meaning: 'Cấm / không được làm gì (mệnh lệnh phủ định)',
        group: 'menh-lenh',
        structures: ['Thể mệnh lệnh phủ định: [Động từ thể từ điển (辞書形)] ＋ な: Không được/ Cấm làm gì'],
        explanation: ['Dạng phủ định của thể mệnh lệnh hay dùng trên các biển báo, đặc biệt ở những chỗ nguy hiểm.'],
        tables: [
          table('Ví dụ', ['', 'Nghĩa'], [
            ['{食|た}べるな', 'Cấm ăn'],
            ['{言|い}うな', 'Cấm nói'],
            ['{走|はし}るな', 'Cấm chạy'],
            ['{入|はい}るな', 'Cấm vào'],
          ]),
        ],
      },
      {
        id: 'nasai',
        pattern: '～なさい',
        meaning: 'Hãy … (đề nghị kèm sắc thái ra lệnh, người trên nói với người dưới)',
        group: 'menh-lenh',
        structures: ['[Động từ thể ます (bỏ ます)] ＋ なさい'],
        explanation: [
          'Mẫu câu này thể hiện lời đề nghị, yêu cầu (có kèm sắc thái ra lệnh), thường được sử dụng khi bố mẹ nói với con cái, thầy cô nói với học sinh, người lớn nói với trẻ con (khi muốn nhắc nhở). Ngoài những trường hợp này, thì chúng ta dùng thể 「～てください」 khi muốn đưa ra yêu cầu, đề nghị lịch sự.',
        ],
        usages: [
          {
            examples: [
              ['{野菜|やさい}を{食|た}べなさい。', 'Ăn rau đi con.'],
              ['よく{聞|き}きなさい。', 'Hãy nghe chăm chú vào.', 'Bố mẹ nói với con/ thầy cô nhắc học sinh.'],
            ],
          },
          {
            title: 'So sánh sắc thái của các loại câu mệnh lệnh, yêu cầu',
            reference: true,
            examples: [
              ['{書|か}いてください。', 'Xin vui lòng viết.', 'Yêu cầu lịch sự.'],
              ['{書|か}いて。', 'Viết đi.', 'Bạn bè, người thân nói với nhau.'],
              ['{書|か}きなさい。', 'Viết đi.', 'Người trên nói với người dưới.'],
              ['{書|か}け。', '[Viết!/Viết mau].', 'Ra lệnh.'],
            ],
          },
        ],
      },
    ],
  },

  // ══ 39 ═════════════════════════════════════════════════════════════════
  {
    id: 'cho-nhan',
    title: '～てあげます、～てくれます、～てもらいます',
    intro: [
      'Nếu 「あげます」, 「くれます」 và 「もらいます」 mang ý nghĩa là “cho/ tặng”, “được cho/ được tặng” hay “nhận” cái gì đó thì khi dùng 3 động từ này kèm với thể て, nó biểu thị việc làm cho ai, làm hộ ai hoặc được ai làm hộ, làm giúp cho việc gì.',
    ],
    points: [
      {
        id: 'te-agemasu',
        pattern: '～てあげます',
        meaning: 'Làm (giúp) cho ai việc gì (từ góc độ của người làm)',
        group: 'cho-nhan',
        structures: ['[Danh từ 1 (người cho)] は [Danh từ 2 (người nhận)] に ＋ ～てあげます'],
        explanation: [
          'Trong trường hợp danh từ 1 chính là người nói thì nó thường được lược bỏ đi.',
          'Người cho/ người làm hộ không nhất thiết phải là “tôi”, mà có thể là ngôi thứ 3.',
        ],
        notes: [
          '「～てあげます」 ngụ ý là có ơn với ai đó, nên nó được dùng khi người nói muốn bày tỏ là đã “làm giúp/ làm hộ” ai đó việc gì. Nếu chỉ dùng thể ます thông thường thì không bao hàm được ý nghĩa “cho/ giúp”. Không dùng mẫu câu này đối với người lớn hơn hoặc cấp trên.',
        ],
        examples: [
          [
            'あした[{私|わたし}は/] {料理|りょうり}を{作|つく}ってあげるよ。',
            'Mai tôi sẽ nấu ăn cho nhé.',
            '料理（りょうり）: đồ ăn、作る（つくる）: làm, nấu',
          ],
          [
            '[{私|わたし}は/] {鈴木|すずき}さんに お{金|かね}を {貸|か}してあげました。',
            'Tôi đã cho Suzuki vay tiền.',
            '鈴木（すずき）、貸す（かす）: cho vay',
          ],
          ['こどもに {本|ほん}を {読|よ}んで あげた。', 'Tôi đã đọc sách cho con.'],
          ['{田中|たなか}さんは リンさんに {日本語|にほんご}を {教|おし}えてあげます。', 'Tanaka dạy tiếng Nhật cho Linh.'],
        ],
      },
      {
        id: 'te-kuremasu',
        pattern: '～てくれます',
        meaning: '(Ai đó) làm giúp mình (hoặc người nhà mình) việc gì',
        group: 'cho-nhan',
        structures: ['[Danh từ 1 (người cho)] は/ が [Danh từ 2 (tôi/ thành viên gia đình tôi)] に ＋ ～てくれます'],
        examples: [
          ['{母|はは}が お{弁当|べんとう}を {作|つく}ってくれた。', 'Mẹ đã làm cơm hộp [bento/] cho tôi.', 'お弁当（おべんとう）: bento'],
          [
            '{友達|ともだち}が {買|か}い{物|もの}を してくれました。',
            'Bạn tôi đã đi chợ giúp tôi.',
            '買い物する（かいものする）: đi chợ, đi mua sắm',
          ],
          ['{山田|やまだ}さんが {息子|むすこ}に お{菓子|かし}を {買|か}ってくれました。', 'Anh Yamada đã mua kẹo cho con trai tôi.'],
        ],
      },
      {
        id: 'te-moraimasu',
        pattern: '～てもらいます',
        meaning: 'Nhờ (ai) làm giúp việc gì; được (ai) làm cho',
        group: 'cho-nhan',
        structures: ['[Danh từ 1 (người nhận)] は/ が [Danh từ 2 (người cho)] に ＋ ～てもらいます'],
        notes: [
          'Ở đây người nhận là chủ ngữ (ngược với 2 mẫu trên). Khi người nhận là “tôi” thì có thể lược bỏ đi.',
          '「～てもらいます」 mang ý nghĩa nhờ vả (mình nhờ, sau đó người ta làm giúp), còn 「～てくれます」 có thể dùng cả khi người khác làm gì đó giúp mình mà không cần nhờ vả trước.',
        ],
        examples: [
          ['{佐藤|さとう}さんに {漢字|かんじ}を {書|か}いてもらいました。', 'Tôi đã nhờ anh Sato viết kanji hộ tôi.'],
          ['{旦那|だんな}に {洗濯|せんたく}を してもらった。', 'Tôi nhờ chồng giặt đồ hộ.', '洗濯する: giặt đồ'],
          ['{小林|こばやし}さんに {手伝|てつだ}ってもらいました。', 'Tôi đã nhờ anh Kobayashi giúp đỡ.'],
          ['マイクさんは {先生|せんせい}に {日本語|にほんご}を{教|おし}えてもらいました。', 'Mike đã nhờ cô giáo dạy tiếng Nhật giúp.'],
        ],
      },
    ],
  },

  // ══ 40 ═════════════════════════════════════════════════════════════════
  {
    id: 'te-shimau',
    title: '～てしまう',
    points: [
      {
        id: 'te-shimau',
        pattern: '～てしまう',
        meaning: 'Làm xong hết …; lỡ làm … mất rồi (tiếc nuối, hối hận)',
        structures: ['[Động từ thể て] ＋ しまう'],
        usages: [
          {
            title: '① Diễn đạt một sự việc/ hành động đã hoàn thành (hay dùng với 「もう」)',
            examples: [
              ['{田中|たなか}さんはケーキを{食|た}べてしまいました。', 'Tanaka đã ăn hết sạch cái bánh ngọt rồi.'],
              ['もう{宿題|しゅくだい}をしてしまいました。', 'Tôi đã làm xong hết bài tập rồi.'],
              [
                'もうすぐパーティーがはじまりますよ。{仕事|しごと}をしてしまいましょう。',
                'Tiệc sắp bắt đầu rồi đấy. Làm xong việc thôi nào.',
                'もうすぐ: sắp, một chút nữa thôi',
              ],
            ],
          },
          {
            title: '② Diễn đạt sự tiếc nuối, hối hận vì đã lỡ làm gì đó',
            examples: [
              ['{会社|かいしゃ}に{遅|おく}れてしまった。', 'Muộn giờ làm mất rồi!', '遅れる（おくれる）: muộn'],
              ['{宿題|しゅくだい}を{忘|わす}れてしまいました。', 'Tôi quên làm bài tập mất rồi.'],
              [
                '{今朝|けさ} {財布|さいふ}を{落|お}としてしまいました。',
                'Sáng nay tôi làm rơi mất ví rồi.',
                '財布: ví、落とす: làm rơi, đánh rơi',
              ],
            ],
          },
          {
            title: 'Hay dùng khi biện bạch, phân trần lý do làm việc gì đó (いいわけ)',
            examples: [
              [
                '{山田|やまだ}さん、すみません。{山田|やまだ}さんのコーヒーを{飲|の}んでしまったんです。',
                'Anh Yamada, xin lỗi vì tôi đã uống mất cà phê của anh rồi.',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 41 ═════════════════════════════════════════════════════════════════
  {
    id: 'te-aru',
    title: '～てある',
    points: [
      {
        id: 'te-aru',
        pattern: '～てある',
        meaning: '… sẵn rồi (hành động có mục đích đã làm, kết quả vẫn còn đến hiện tại)',
        group: 'chuan-bi',
        structures: ['[Chủ ngữ] ＋ は/ が ＋ Tha động từ thể て ＋ ある'],
        explanation: [
          'Hành động gì đó đã được làm có mục đích và kết quả của hành động vẫn còn đến hiện tại.',
          'Chủ thể của hành động (người gây ra hành động) không được đề cập đến hoặc không quan trọng.',
          'Chủ ngữ trong câu là đối tượng của hành động, có trạng thái thay đổi sau khi chủ thể tác động vào.',
        ],
        tables: [
          table('So sánh 「～てあります」 và 「～ました」', ['', '～ました', '～てあります'], [
            ['Diễn tả hành động', '○', '×'],
            ['Diễn tả kết quả', '×', '○'],
            ['Ám chỉ mục đích của hành động', '×', '○'],
          ]),
          table('So sánh 「～てあります」 và 「～ています」', ['', '～てあります', '～ています'], [
            ['Loại động từ được dùng', 'Tha động từ', 'Tự động từ'],
            ['Diễn tả kết quả hiện tại', '○', '○'],
            ['Ám chỉ mục đích của hành động', '○', '×'],
          ]),
        ],
        usages: [
          {
            examples: [
              // Bản gốc dịch 窓 là "Cửa".
              [
                '{窓|まど}が{開|あ}けてあります。',
                'Cửa sổ đã được mở.',
                'Ai đó đã mở vì mục đích gì đó và giờ nó đang ở trạng thái mở.',
              ],
              ['{電気|でんき}が{消|け}してありました。', 'Điện đã được tắt.'],
              ['{問題|もんだい}は 15ページに{書|か}いてあります。', 'Câu hỏi được viết ở trang số 15.'],
              ['ドアが{開|あ}けてあります。', 'Cửa đã được mở.', 'Vì mục đích nào đó, như để đón khách v.v.'],
            ],
          },
          {
            title: 'So sánh 「～てあります」 với 「～ました」 và 「～ています」',
            reference: true,
            examples: [
              ['ドアが{開|あ}けてあります。', 'Cửa đã được mở.', 'Hiện tại cửa đang mở và ai đó đã mở cửa vì mục đích nào đó (như để đón khách v.v).'],
              ['ドアを{開|あ}けました。', 'Tôi đã mở cửa.', 'Chỉ đơn giản miêu tả lại 1 hành động đã xảy ra: đã mở cửa.'],
              ['ドアが{開|あ}いています。', 'Cửa đang mở.', 'Chỉ là diễn tả trạng thái của cái cửa, không thể hiện mục đích gì.'],
            ],
          },
          {
            title: 'Hành động đã hoàn thành vì một mục đích, kết quả còn liên quan đến hiện tại',
            detail: 'Trong trường hợp này dùng trợ từ 「を」 thay cho trợ từ 「が」.',
            examples: [
              ['{漢字|かんじ}を{調|しら}べてあります。', 'Tôi đã tra kanji rồi.', 'Vì mục đích chuẩn bị bài đọc v.v.'],
              ['ホテルを{予約|よやく}してありますよ。', 'Tôi đã đặt khách sạn rồi đấy.', 'Vì mục đích du lịch v.v.'],
            ],
          },
        ],
      },
    ],
  },

  // ══ 42 ═════════════════════════════════════════════════════════════════
  {
    id: 'te-oku',
    title: '～ておく',
    points: [
      {
        id: 'te-oku',
        pattern: '～ておく',
        meaning: 'Làm sẵn, làm trước (để chuẩn bị cho việc khác trong tương lai)',
        group: 'chuan-bi',
        structures: ['[Chủ ngữ] は/ が ＋ [Danh từ] を ＋ [Động từ thể て] ＋ おく'],
        explanation: ['Làm gì đó trước để chuẩn bị cho việc gì khác trong tương lai: làm sẵn, làm trước.'],
        usages: [
          {
            examples: [
              [
                '{来週|らいしゅう}の{試験|しけん}のため、{漢字|かんじ}を{勉強|べんきょう}しておきました。',
                'Để chuẩn bị cho kỳ thi tuần tới, tôi đã học trước kanji rồi.',
              ],
              ['{明日|あした}のパーティーを{準備|じゅんび}しておかないといけない。', 'Phải chuẩn bị sẵn cho buổi tiệc ngày mai thôi.'],
              ['{会議|かいぎ}のために、{資料|しりょう}をコピーしておきました。', 'Tôi đã copy sẵn tài liệu để chuẩn bị cho buổi họp.'],
            ],
          },
          {
            title: 'Làm gì đó sẵn giúp cho ai đó',
            examples: [
              ['お{弁当|べんとう}を{作|つく}っておいたよ。', 'Tôi làm sẵn bento [cho anh/] rồi đấy.'],
              ['{私|わたし}に{任|まか}せておいて。', 'Cứ để đấy cho tôi.', 'Tôi sẽ làm giúp cho.'],
              [
                'ホテルを{予約|よやく}しておくから、{心配|しんぱい}しないで。',
                'Tôi sẽ đặt sẵn khách sạn [cho anh/] nên không phải lo đâu.',
              ],
            ],
          },
          {
            title: 'Trong hội thoại, 「～ておく」 được nói tắt thành 「～とく」',
            examples: [
              // Bản gốc dịch "đã đặt … rồi", lệch với しとくから (sẽ đặt sẵn).
              [
                'ホテルを{予約|よやく}しとくから、{心配|しんぱい}しないで。',
                'Tôi sẽ đặt khách sạn trước nên đừng có lo lắng.',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 43 ═════════════════════════════════════════════════════════════════
  {
    id: 'kamo-hazu',
    title: '～かもしれません、～はずです',
    points: [
      {
        id: 'kamoshiremasen',
        pattern: '～かもしれません',
        meaning: 'Có lẽ, có thể … (khả năng xảy ra không chắc chắn, khoảng 50%)',
        group: 'phong-doan',
        structures: [
          '[Động từ thể thường (普通形)] ＋ かもしれません',
          '[Tính từ -i/ Tính từ -na (bỏ な)] ＋ かもしれません',
          '[Danh từ] ＋ かもしれません',
        ],
        explanation: [
          'Diễn tả khả năng việc gì đó sẽ xảy ra nhưng không chắc chắn (khả năng thấp nhưng vẫn có thể). Người nói chỉ chắc chắn khoảng 50%.',
        ],
        notes: [
          '「かもしれない」 là thể ít lịch sự hơn của 「かもしれません」.',
          'Trong hội thoại hàng ngày, 「かもしれません」 được nói ngắn gọn là 「かも」.',
        ],
        examples: [
          ['{山田|やまだ}さんは{図書館|としょかん}にいるかもしれない。', 'Có lẽ Yamada đang ở thư viện.'],
          ['{彼|かれ}は{来|こ}ないかもしれません。', 'Có lẽ anh ta sẽ không đến.'],
          ['あした いそがしいかもしれない。', 'Có lẽ mai sẽ bận đấy.'],
          ['{彼|かれ}は{来|こ}ないかもね。', 'Có lẽ anh ấy sẽ không đến nhỉ.', 'Cách nói ngắn gọn 「かも」 trong hội thoại.'],
        ],
      },
      {
        id: 'hazu-desu',
        pattern: '～はずです',
        meaning: 'Chắc hẳn là, nhất định là … (suy luận chắc chắn, có căn cứ)',
        group: 'phong-doan',
        structures: [
          '[Động từ thể thường (普通形)] ＋ はずです/ はずだ',
          '[Tính từ -i/ Tính từ -na な] ＋ はずです/ はずだ',
          '[Danh từ ＋ の] ＋ はずです/ はずだ',
        ],
        explanation: [
          'Diễn đạt khả năng việc gì đó xảy ra và khả năng này là cao, người nói có sự chắc chắn về việc này. Điều chắc chắn này thường dựa vào một lý do nào đó để suy luận ra, giống như kiểu “Đã là thế này thì nhất định/ chắc chắn phải thế này.”',
        ],
        notes: [
          '「はずです」 thể hiện suy nghĩ, đánh giá của người nói nên không phải lúc nào cũng đúng, đôi khi có sự khác biệt đối với thực tế.',
          'Thể phủ định của 「はずです」 là 「はずがない」 hoặc 「はずはない」. Về ý nghĩa thì 「来るはずがない」 và 「来ないはずだ」 đều giống nhau ở việc cho rằng anh ấy sẽ không đến, nhưng thái độ của người nói thì khác nhau một chút: nếu muốn nhấn mạnh việc “tôi không tin” thì dùng 「はずがない」.',
        ],
        usages: [
          {
            examples: [
              [
                '{今|いま} 10{時|じ}ですから、{郵便局|ゆうびんきょく}は{開|あ}いているはずです。',
                'Bây giờ là 10 giờ nên chắc chắn là bưu điện đang mở cửa.',
              ],
              [
                '{山田|やまだ}さんは{英語|えいご}の{教師|きょうし}ですから、{英語|えいご}が{話|はな}せるはずだ。',
                'Anh Yamada là giáo viên tiếng Anh nên chắc hẳn là nói được tiếng Anh.',
              ],
              [
                '{山田|やまだ}さんは{英語|えいご}の{教師|きょうし}ですから、{英語|えいご}が{話|はな}せるはずだと{思|おも}いますが、{実|じつ}はあまり{話|はな}せません。',
                'Vì anh Yamada là giáo viên tiếng Anh nên tôi nghĩ là chắc chắn anh ấy phải nói được tiếng Anh nhưng sự thực là anh ấy không nói được mấy.',
                '「はずです」 là đánh giá của người nói nên đôi khi khác với thực tế.',
              ],
            ],
          },
          {
            title: 'Thể phủ định: 「はずがない」/ 「はずはない」',
            examples: [
              [
                '{彼|かれ}は{病気|びょうき}ですから、{来|く}るはずがないね。',
                'Anh ấy bị bệnh nên tôi không chắc chắn là anh ấy sẽ đến.',
                'Tôi hầu như không tin việc anh ấy đến.',
              ],
              [
                '{彼|かれ}は{病気|びょうき}ですから、{来|こ}ないはずだね。',
                'Anh ấy bị bệnh nên chắc chắn là không đến đâu.',
                'Tôi chỉ đoán là anh ấy không đến.',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 44 ═════════════════════════════════════════════════════════════════
  {
    id: 'te-miru',
    title: '～てみる: thử …',
    points: [
      {
        id: 'te-miru',
        pattern: '～てみる',
        meaning: 'Thử làm gì đó (xem sao)',
        structures: ['[Động từ thể て] ＋ みる: Thử làm gì đó'],
        explanation: ['「みる」 có thể chia ở các thể khác nhau.'],
        examples: [
          ['その{本|ほん}を{読|よ}んでみます。', 'Tôi sẽ thử đọc cuốn sách đó xem sao.'],
          ['{日曜日|にちようび}{美術館|びじゅつかん}へ{行|い}ってみませんか。', 'Chủ nhật này thử đi bảo tàng mỹ thuật không?'],
          ['すしを{食|た}べてみたけど、あまり{好|す}きじゃなかった。', 'Tôi ăn thử sushi rồi nhưng mà không thích lắm.'],
          ['{着物|きもの}を{一度|いちど}{着|き}てみたいです。', 'Tôi muốn mặc thử kimono một lần.'],
        ],
      },
    ],
  },

  // ══ 45 ═════════════════════════════════════════════════════════════════
  {
    id: 'tara-ii',
    title: '～たらいいですか/ たらどうですか',
    points: [
      {
        id: 'tara-ii-desu-ka',
        pattern: '～たらいいですか',
        meaning: 'Nên … thì được? (hỏi ý kiến người khác về việc gì đó)',
        group: 'de-xuat',
        structures: [
          'どうしたらいいですか。Tôi nên/ phải làm gì?',
          'どこに/ で/ へ ＋ [Động từ thể た ＋ ら] ＋ いいですか。Tôi nên … ở đâu?',
          'だれに ＋ [Động từ thể た ＋ ら] ＋ いいですか。Tôi nên … với ai?',
          'いつ/ 何時に (なんじ) ＋ [Động từ thể た ＋ ら] ＋ いいですか。Tôi nên … khi nào/ lúc mấy giờ?',
        ],
        notes: ['Để lịch sự hơn có thể thay 「いいですか」 bằng 「いいでしょうか」 hoặc 「いいと思いますか」.'],
        examples: [
          ['[いつ/{何時|なんじ}に]{会|あ}ったらいい？', '[Lúc nào/Mấy giờ] gặp nhau thì được?'],
          [
            'すしを{食|た}べたいんですが、どこで{食|た}べたらいいですか。',
            'Tôi muốn ăn sushi thì nên ăn ở đâu?',
          ],
          ['どこにゴミを{出|だ}したらいいでしょうか。', 'Tôi nên vứt rác ở đâu ạ?'],
          [
            'すしを{食|た}べたいんですが、どこで{食|た}べたらいいと{思|おも}いますか。',
            'Tôi muốn ăn sushi thì theo anh nên ăn ở đâu thì ngon?',
          ],
        ],
      },
      {
        id: 'tara-dou-desu-ka',
        pattern: '～たらどうですか',
        meaning: 'Sao không … thử? (đưa ra đề xuất, gợi ý)',
        group: 'de-xuat',
        structures: ['[Động từ thể た ＋ ら] ＋ どうですか: Sao không ～?'],
        examples: [
          [
            'この{本|ほん}、おもしろいから、{読|よ}んでみたら[どう/]？',
            'Quyển sách này rất thú vị, sao cậu không đọc thử xem sao?',
          ],
          [
            '{沖縄|おきなわ}にいったらどうですか。',
            'Sao cậu không đi Okinawa đi?',
            'Đáp lại câu: 旅行(りょこう)をしたいですね。(Muốn đi du lịch ghê.)',
          ],
        ],
      },
    ],
  },

  // ══ 46 ═════════════════════════════════════════════════════════════════
  {
    id: 'te-itadakemasen-ka',
    title: '～ていただけませんか',
    points: [
      {
        id: 'te-itadakemasen-ka',
        pattern: '～ていただけませんか',
        meaning: 'Làm ơn … giúp tôi được không? (đề nghị, nhờ vả lịch sự)',
        structures: ['[Động từ thể て] ＋ いただけませんか'],
        explanation: [
          'Mẫu câu này diễn tả một lời đề nghị hay yêu cầu ai đó làm gì giúp mình. Đây là cách nói lịch sự hơn của mẫu câu 「～てください」 mà chúng ta đã học ở trình độ N5.',
          'Mẫu câu 「～てくださいませんか」 cũng dùng để diễn tả yêu cầu, đề nghị lịch sự nhưng ít trang trọng hơn 「～ていただけませんか」 và trang trọng hơn 「～てください」.',
        ],
        usages: [
          {
            examples: [
              ['ひらがなで {書|か}いて いただけませんか。', 'Làm ơn viết bằng hiragana giúp tôi được không?'],
              ['もう{少|すこ}し ゆっくり {話|はな}して いただけませんか。', 'Làm ơn nói chậm hơn một chút được không?'],
            ],
          },
          {
            title: 'So sánh mức độ lịch sự, trang trọng (giảm dần ① → ② → ③)',
            reference: true,
            examples: [
              ['ひらがなで {書|か}いて いただけませんか。', 'Làm ơn viết bằng hiragana giúp tôi được không?'],
              ['ひらがなで {書|か}いて くださいませんか。', 'Làm ơn viết bằng hiragana giúp tôi được không?'],
              ['ひらがなで {書|か}いて ください。', 'Xin hãy viết bằng hiragana.'],
            ],
          },
        ],
      },
    ],
  },

  // ══ 47 ═════════════════════════════════════════════════════════════════
  {
    id: 'ka-kadouka',
    title: '～か/ ～かどうか',
    intro: [
      'Mẫu câu này dùng để trích dẫn gián tiếp một câu hỏi trong câu. Có hai loại câu hỏi: câu hỏi dùng từ để hỏi (ai/ cái gì/ vì sao/ khi nào …) và loại câu hỏi lựa chọn có – không, và tương ứng với hai loại câu hỏi này cũng có hai mẫu câu trích dẫn gián tiếp.',
    ],
    points: [
      {
        id: 'ka-gian-tiep',
        pattern: '[từ để hỏi] ～か、～',
        meaning: 'Lồng câu hỏi có từ để hỏi (ai, cái gì, khi nào…) vào trong câu',
        group: 'cau-hoi',
        structures: [
          'Mẫu câu 1: [Từ để hỏi (何/ だれ/ いつ/ どこ…)] ＋ [Động từ thể thường (普通形)] ＋ か、～',
          '[Từ để hỏi] ＋ [Tính từ -i (thể thường)] ＋ か、～',
          '[Từ để hỏi] ＋ [Tính từ -na (bỏ な)/ Danh từ] ＋ か、～',
        ],
        examples: [
          [
            '{電車|でんしゃ}が {何時|なんじ}に {大阪|おおさか}に{着|つ}くか しっていますか。',
            'Anh có biết mấy giờ tàu sẽ đến Osaka không?',
            'Câu hỏi gốc: 電車が 何時に 大阪に着きますか。しっていますか？(Mấy giờ tàu sẽ đến Osaka? Anh có biết không?)',
          ],
          [
            'プレゼントは {何|なに}がいいか {彼|かれ}に{聞|き}きましょう。',
            'Hỏi anh ấy xem quà thì mua cái gì được đi.',
            'Câu hỏi gốc: プレゼントは 何がいいですか。彼に聞きましょう。(Quà thì mua cái gì được nhỉ? Hỏi anh ấy đi.)',
          ],
          [
            '{彼|かれ}にはじめて{会|あ}ったのは いつか わすれてしまいました。',
            'Tôi đã quên mất lần đầu gặp anh ấy là khi nào rồi.',
            'Câu hỏi gốc: 彼にはじめて会ったのはいつですか。/ わすれてしまいました。(Lần đầu cậu gặp anh ấy là khi nào? / Tớ quên mất rồi.)',
          ],
        ],
      },
      {
        id: 'ka-dou-ka',
        pattern: '～かどうか',
        meaning: 'Có … hay không (lồng câu hỏi có – không vào trong câu)',
        group: 'cau-hoi',
        structures: [
          'Mẫu câu 2: [Động từ thể thường (普通形)] ＋ かどうか、～',
          '[Tính từ -i (thể thường)] ＋ かどうか、～',
          '[Tính từ -na (bỏ な)/ Danh từ] ＋ かどうか、～',
        ],
        examples: [
          [
            '{山田|やまだ}さんがパーティーに {来|く}るかどうか わかりません。',
            'Tôi không biết là liệu anh Yamada có đến dự tiệc hay không.',
            'Câu hỏi gốc: 山田さんがパーティーに来ますか。/ わかりません。(Anh Yamada có đến dự tiệc không? / Tôi không biết.)',
          ],
          [
            'このケーキは おいしいかどうか {食|た}べてみてください。',
            'Ăn thử xem liệu cái bánh này có ngon không?',
            'Câu hỏi gốc: このケーキはおいしいですか。/ 食べてみてください。(Bánh này có ngon không? / Ăn thử xem.)',
          ],
        ],
      },
    ],
  },

  // ══ 48 ═════════════════════════════════════════════════════════════════
  {
    id: 'shi',
    title: '～し～',
    points: [
      {
        id: 'shi',
        pattern: '～し、～',
        meaning: 'Không những … mà còn …; vừa … lại … (liệt kê, nêu các lý do)',
        explanation: [
          'Mẫu câu này dùng để liệt kê nhiều hành động, sự việc hay tính chất. Nó mang nghĩa là “không chỉ/ không những … mà còn …”.',
        ],
        structures: [
          '[Động từ thể thường (普通形)] ＋ し',
          '[Tính từ -i] ＋ し',
          '[Tính từ -na (bỏ な)/ Danh từ ＋ だ] ＋ し',
        ],
        notes: [
          '「～し～」 có thể dùng để liệt kê nhiều hơn hai hành động, sự việc hay tính chất. Vế cuối cùng thường đi kèm với 「も」 hoặc 「それに」 (thêm nữa, hơn nữa).',
        ],
        usages: [
          {
            examples: [
              ['{彼女|かのじょ}はきれいだし、{性格|せいかく}もいいです。', 'Cô ấy vừa xinh đẹp mà tính cũng rất hay.'],
              [
                'この{部屋|へや}は{広|ひろ}いし、{家賃|やちん}が{安|やす}いし、それに{駅|えき}からも{近|ちか}いです。',
                'Căn phòng này vừa rộng, giá thuê lại rẻ, mà lại còn gần ga nữa.',
              ],
              [
                '{彼|かれ}は{英語|えいご}が{上手|じょうず}だし、フランス{語|ご}も{話|はな}せます。',
                'Anh ấy không những giỏi tiếng Anh mà còn nói được cả tiếng Pháp.',
              ],
            ],
          },
          {
            title: 'Liệt kê các lý do, sau đó đưa ra câu kết luận hay đánh giá',
            examples: [
              [
                '{日本語|にほんご}がわからないし、{日本|にほん}に{友達|ともだち}もいないし、{生活|せいかつ}はとても{大変|たいへん}です。',
                'Tiếng Nhật cũng không biết, bạn bè ở Nhật cũng không có, nên cuộc sống rất là vất vả.',
              ],
              [
                'ちょっと{疲|つか}れたし、あした{大阪|おおさか}に{出張|しゅっちょう}ですから、{今日|きょう}は{飲|の}みに{行|い}けません。',
                'Tôi hơi mệt, hơn nữa mai lại phải đi công tác ở Osaka, nên hôm nay không thể đi nhậu được.',
              ],
              [
                'お{金|かね}がないし、{時間|じかん}もないし、{来年|らいねん}の{旅行|りょこう}をやめましょう。',
                'Tiền thì không có, thời gian cũng không, đành từ bỏ chuyến du lịch cho năm sau thôi.',
              ],
            ],
          },
        ],
      },
    ],
  },

  // ══ 49 ═════════════════════════════════════════════════════════════════
  {
    id: 'kinh-ngu',
    title: '敬語: Kính ngữ',
    intro: [
      'Kính ngữ được sử dụng phổ biến trong xã hội Nhật, nhằm biểu thị thái độ tôn trọng, lịch sự đối với người đối diện. Kính ngữ được sử dụng nhiều nhất khi giao tiếp với khách hàng, với những người lớn tuổi hoặc cấp trên, với những người không quen biết, hay trong những tình huống giao tiếp trang trọng.',
      'Kính ngữ được chia làm 3 loại chính: 尊敬語 (そんけいご: tôn kính ngữ), 謙譲語 (けんじょうご: khiêm nhường ngữ) và 丁寧語 (ていねいご: lịch sự ngữ), gọi chung là 敬語 (けいご: kính ngữ).',
    ],
    points: [
      {
        id: 'sonkeigo',
        pattern: '尊敬語（そんけいご）',
        meaning: 'Tôn kính ngữ: nâng hành động của người khác để bày tỏ sự kính trọng với người đó',
        group: 'kinh-ngu',
        explanation: [
          'Trong tôn kính ngữ, chủ ngữ (chủ thể hành động) là người khác (không phải bản thân người nói). Sử dụng tôn kính ngữ trong trường hợp này để bày tỏ sự kính trọng đối với người đó (nâng người đó lên cao hơn bản thân mình).',
        ],
        structures: [
          'Động từ có dạng kính ngữ đặc biệt: [Chủ ngữ] ＋ は/ が ＋ động từ kính ngữ',
          'Mẫu câu 1: [Chủ ngữ] ＋ は/ が ＋ お ＋ động từ thể ます (bỏ ます) ＋ に なります',
          'Mẫu câu 2: [Chủ ngữ] ＋ は/ が ＋ ～れます/ ～られます',
        ],
        notes: [
          'Mẫu câu 1 không dùng với động từ nhóm 3 và những động từ nhóm 2 chỉ có 1 âm tiết phía trước đuôi 「る」 như 「いる」, 「出る（でる）」, 「着る（きる）」.',
          'Ngoài những động từ có dạng kính ngữ đặc biệt, mẫu câu 2 có thể áp dụng với tất cả các động từ còn lại. Trong mẫu câu này, động từ được chia giống như thể bị động.',
        ],
        tables: [
          table('Bảng tóm tắt những động từ kính ngữ đặc biệt', ['', '尊敬語（そんけいご）'], [
            ['います／{来|き}ます／{行|い}きます', 'いらっしゃいます／おいでになります'],
            ['～ています／～ていきます／～てきます', '～ていらっしゃいます'],
            ['します', 'なさいます'],
            ['{言|い}います', 'おっしゃいます'],
            ['{食|た}べます／{飲|の}みます', '{召|め}し{上|あ}がります'],
            ['{見|み}ます', 'ご{覧|らん}になります'],
            ['{知|し}っています', 'ご{存|ぞん}じです／ご{存|ぞん}じでいらっしゃいます'],
            ['{死|し}にます', 'お{亡|な}くなりになります'],
            ['くれます', 'くださいます'],
            ['いいです', 'よろしいです'],
          ]),
          table('Mẫu câu 2: động từ chia giống thể bị động', ['Nhóm', 'Thể ます', '～れます/ ～られます'], [
            ['Nhóm 1', 'ききます', 'きかれます'],
            ['Nhóm 1', 'はなします', 'はなされます'],
            ['Nhóm 1', 'よみます', 'よまれます'],
            ['Nhóm 2', 'でます', 'でられます'],
            ['Nhóm 2', 'おきます', 'おきられます'],
            ['Nhóm 3', 'します', 'されます'],
            ['Nhóm 3', 'きます', 'こられます'],
          ]),
          // Bản gốc in 「いらしゃって」「おしゃって」 — thiếu っ.
          table('Mẫu câu yêu cầu, đề nghị lịch sự — các trường hợp đặc biệt', ['', 'Kính ngữ'], [
            ['{来|き}てください', 'おこしください／おこしになってください／いらっしゃってください'],
            ['{見|み}てください', 'ご{覧|らん}ください'],
            ['{言|い}ってください', 'おっしゃってください／{申|もう}し{付|つ}けてください'],
          ]),
        ],
        usages: [
          {
            title: 'Động từ có dạng kính ngữ đặc biệt',
            examples: [
              ['{山田|やまだ}さんは おそばを {召|め}し{上|あ}がりました。', 'Anh Yamada đã ăn mì soba.'],
              ['{田中|たなか}{先生|せんせい}は いらっしゃいますか。', 'Thầy Tanaka có ở đây không ạ?'],
              ['{社長|しゃちょう}は ゴルフを なさいます。', 'Giám đốc chơi golf.'],
              ['アンさんは インドへ {出張|しゅっちょう}なさいます。', 'Anh An sẽ đi công tác ở Ấn Độ.'],
            ],
          },
          {
            title: 'Mẫu câu 1: お ＋ động từ thể ます (bỏ ます) ＋ に なります',
            examples: [
              ['{先生|せんせい}は もう おかえりに なりました。', 'Thầy giáo đã về rồi.'],
              ['{部長|ぶちょう}は たばこを お{吸|す}いに なりません。', 'Trưởng phòng không hút thuốc.'],
              ['{社長|しゃちょう}は {会議|かいぎ}の{予定|よてい}を お{決|き}めに なりました。', 'Giám đốc đã quyết định lịch họp rồi.'],
            ],
          },
          {
            title: 'Mẫu câu 2: ～れます/ ～られます',
            examples: [
              ['{山田|やまだ}{先生|せんせい}は さっき でかけられました。', 'Thầy Yamada vừa ra ngoài.'],
              ['{社長|しゃちょう}は アメリカへ {出張|しゅっちょう}されました。', 'Giám đốc đã đi công tác ở Mỹ rồi.'],
              ['{佐藤|さとう}さんは 8{時|じ}ごろ こられます。', 'Anh Satou sẽ đến vào tầm 8 giờ.'],
            ],
          },
          {
            title: 'Mẫu câu yêu cầu, đề nghị lịch sự',
            detail:
              'Với những động từ có dạng kính ngữ đặc biệt thì chia thể て ＋ ください cho các động từ kính ngữ đó. Những động từ còn lại: động từ nhóm 1 & 2: お ＋ động từ thể ます (bỏ ます) ＋ ください; động từ nhóm 3 dạng “kanji ＋ します”: ご ＋ kanji ＋ ください.',
            examples: [
              ['{召|め}し{上|あ}がってください。', 'Xin mời [anh/chị] dùng [đồ ăn/].'],
              ['おっしゃってください。', 'Xin mời [anh/chị] nói.'],
              [
                'お{名前|なまえ}を ご{確認|かくにん} ください。',
                'Xin vui lòng kiểm tra lại tên.',
                '確認する（かくにんする）: kiểm tra, xác nhận',
              ],
              ['ここに お{名前|なまえ}を お{書|か}き ください。', 'Xin vui lòng viết tên vào đây.'],
              [
                'いつでも ご{連絡|れんらく} ください。',
                'Hãy liên lạc với tôi bất cứ lúc nào.',
                '連絡する（れんらくする）: liên lạc, liên hệ',
              ],
            ],
          },
        ],
      },
      {
        id: 'kenjougo',
        pattern: '謙譲語（けんじょうご）',
        meaning: 'Khiêm nhường ngữ: hạ hành động của bản thân để bày tỏ sự kính trọng với người đối diện',
        group: 'kinh-ngu',
        explanation: [
          'Trong khiêm nhường ngữ, chủ ngữ (chủ thể hành động) là bản thân người nói. Sử dụng khiêm nhường ngữ trong trường hợp này để bày tỏ sự kính trọng đối với người đối diện.',
        ],
        structures: [
          'Động từ có dạng khiêm nhường ngữ đặc biệt: (私 ＋ は/ が) ＋ động từ khiêm nhường ngữ',
          'Động từ nhóm 1 & 2: お ＋ động từ thể ます (bỏ ます) ＋ します (いたします)',
          'Động từ nhóm 3 dạng “kanji ＋ します”: ご ＋ kanji ＋ します/ いたします',
        ],
        tables: [
          table('Bảng tóm tắt những động từ khiêm nhường ngữ đặc biệt', ['', '謙譲語（けんじょうご）'], [
            ['～です', '～でございます'],
            ['あります', 'ございます'],
            ['います', 'おります'],
            ['{来|き}ます／{行|い}きます', '{参|まい}ります／{伺|うかが}います (伺います: đi về phía người đối diện)'],
            ['～ています', '～ております'],
            ['～ていきます／～てきます', '～てまいります'],
            ['します', '{致|いた}します'],
            ['{言|い}います', '{申|もう}します／{申|もう}し{上|あ}げます'],
            ['{食|た}べます／{飲|の}みます', 'いただきます'],
            ['{訪|たず}ねます', '{伺|うかが}います／おじゃまします'],
            ['{聞|き}きます', '{伺|うかが}います'],
            ['{見|み}ます', '{拝見|はいけん}します'],
            ['{知|し}っています', '{存|ぞん}じています／{存|ぞん}じております／{存|ぞん}じません'],
            ['{会|あ}います', 'お{目|め}にかかります'],
            ['{死|し}にます', '{亡|な}くなります'],
            ['あげます', '{差|さ}し{上|あ}げます'],
            ['もらいます', 'いただきます'],
            ['いいです', '{結構|けっこう}です'],
          ]),
        ],
        usages: [
          {
            title: 'Động từ có dạng khiêm nhường ngữ đặc biệt',
            examples: [
              ['{私|わたし}は ミラーと {申|もう}します。', 'Tôi tên là Miller.'],
              ['{私|わたし}は ベトナムから {参|まい}ります。', 'Tôi đến từ Việt Nam.'],
              ['3{時|じ}ごろ そちらへ {参|まい}ります。', 'Tôi sẽ đến đó tầm 3 giờ.'],
              ['アンさんに ケーキを {作|つく}って いただきました。', 'An đã làm bánh ngọt cho tôi.'],
              [
                '{山田|やまだ}さんの {結婚式|けっこんしき}の{写真|しゃしん}を {拝見|はいけん}しました。',
                'Tôi đã xem ảnh cưới của Yamada.',
              ],
            ],
          },
          {
            title: 'Động từ không có dạng khiêm nhường ngữ đặc biệt: お/ ご ＋ … ＋ します',
            examples: [
              ['{今月|こんげつ}のスケジュールを お{送|おく}りします。', 'Tôi sẽ gửi lịch trình tháng này.'],
              ['じゃ、また お{電話|でんわ}します。', 'Vậy thì, tôi sẽ gọi lại sau.', 'Lưu ý: お電話, không phải ご電話.'],
              ['{明日|あした}、また ご{連絡|れんらく}します。', 'Ngày mai tôi sẽ liên lạc lại.'],
            ],
          },
        ],
      },
      {
        id: 'sasete-itadakimasu',
        pattern: '～させていただきます',
        meaning: 'Cho phép tôi được làm … (khiêm nhường, trang trọng)',
        structures: ['(お/ ご) ＋ Động từ thể sai khiến (使役形) て ＋ いただきます: Cho phép tôi …'],
        examples: [
          ['{新|あたら}しいメンバーを{紹介|しょうかい}させていただきます。', 'Cho phép tôi được giới thiệu thành viên mới.'],
          [
            '{工場内|こうじょうない}をご{案内|あんない}させていただきます。',
            'Cho phép tôi được hướng dẫn quý vị tham quan trong nhà máy.',
          ],
        ],
      },
      {
        id: 'teineigo',
        pattern: '丁寧語（ていねいご）',
        meaning: 'Lịch sự ngữ: dùng từ, cụm từ trang trọng thay cho từ ngữ thường ngày',
        group: 'kinh-ngu',
        explanation: [
          '丁寧語 (ていねいご) là nói đến những từ, cụm từ thay thế cho các từ sử dụng hàng ngày để làm cho sắc thái ý nghĩa trở nên trang trọng hơn.',
        ],
        tables: [
          table('Một số từ thuộc 丁寧語 thường được sử dụng', ['Thường ngày', '丁寧語'], [
            ['です', 'でございます'],
            ['ではありません', 'でございません'],
            ['あります', 'ございます'],
            ['ありません', 'ございません'],
            ['ここ、そこ、あそこ', 'こちら、そちら、あちら'],
            ['{私|わたし}', '{私|わたくし}'],
            ['ごめんなさい', '{申|もう}し{訳|わけ}ありません／{申|もう}し{訳|わけ}ございません'],
            ['～さん', '～{様|さま}'],
          ]),
          table('Thêm 「お」 hoặc 「ご」 trước danh từ', ['', 'Ví dụ'], [
            ['「お」 thường thêm trước danh từ là chữ Nhật', 'お{茶|ちゃ}、お{手洗|てあら}い、お{米|こめ}、お{酒|さけ}、お{肉|にく}'],
            ['「ご」 thường thêm trước danh từ là chữ Hán', 'ご{紹介|しょうかい}、ご{説明|せつめい}、ご{意見|いけん}'],
            ['Ngoại lệ', 'お{電話|でんわ}、お{食事|しょくじ}、お{化粧|けしょう}、お{勉強|べんきょう}、お{仕事|しごと}、お{部屋|へや}、お{時間|じかん}、ご{飯|はん}'],
          ]),
          table('Thêm 「お」 hoặc 「ご」 trước tính từ', ['', 'Ví dụ'], [
            ['「お」 thường thêm trước tính từ là chữ Nhật', 'お{忙|いそが}しい、お{恥|は}ずかしい、おひま、お{早|はや}い'],
            ['「ご」 thường thêm trước tính từ là chữ Hán, nên 「ご」 không đứng trước tính từ -i', 'ご{多忙|たぼう}、ご{心配|しんぱい}、ご{不満|ふまん}、ご{満足|まんぞく}'],
            ['Ngoại lệ', 'お{元気|げんき}、お{粗末|そまつ}'],
          ]),
        ],
      },
      {
        id: 'luu-y-kinh-ngu',
        pattern: 'Lưu ý khi sử dụng kính ngữ: うち và そと',
        explanation: [
          'Trong tiếng Nhật có sự phân biệt giữa khái niệm “người nhà” (うち) và “người ngoài” (そと). Người Nhật có xu hướng sử dụng kính ngữ đối với người được coi là “người ngoài” (luôn hạ mình, khiêm nhường khi nói về mình, về “người nhà”).',
          'Ngoài các thành viên trong gia đình được coi là “người nhà”, thì đồng nghiệp, những người làm cùng công ty, hay tổ chức mà mình thuộc về cũng được coi là “người nhà”. Ví dụ, khi nói chuyện với người ngoài công ty về giám đốc của mình (社長: しゃちょう), tuy là giám đốc, là cấp trên nhưng vì nói với người ngoài công ty nên vẫn sử dụng khiêm nhường ngữ (謙譲語).',
          'Trong công ty Nhật, người ta thường không dùng 「～さん」 mà chỉ gọi mỗi tên khi nhắc đến đồng nghiệp với người ngoài công ty.',
        ],
        usages: [
          {
            title: 'Anh A là người ngoài công ty, nói chuyện với anh B là cấp dưới của 渡辺社長 (わたなべしゃちょう)',
            examples: [
              ['{渡辺|わたなべ}{社長|しゃちょう}はいらっしゃいますか。', 'Giám đốc Watanabe có ở đó không ạ?', 'A (người ngoài công ty) hỏi.'],
              [
                '{渡辺|わたなべ}はただいま{外出|がいしゅつ}しております。',
                'Hiện giờ anh Watanabe đang ra ngoài ạ.',
                'B (cấp dưới của giám đốc) trả lời: dùng khiêm nhường ngữ và chỉ gọi tên, không dùng さん.',
              ],
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Các mẫu CÙNG một nghĩa: câu trắc nghiệm ý nghĩa không bao giờ lấy mẫu này làm đáp án
 * nhiễu cho mẫu kia — bày cả hai ra thì chọn cái nào cũng đúng.
 *
 * Tài liệu có cả "thể khả năng" lẫn "～ことができる" (cùng là "có thể"), cả "～過ぎます"
 * trong mục động từ ghép lẫn mục "～すぎる" riêng, và hai cách xin phép.
 */
export const N4_SYNONYMS: readonly (readonly string[])[] = [
  ['kha-nang', 'koto-ga-dekiru'],
  ['sugimasu', 'sugiru'],
  ['sasete-kudasai', 'sasete-itadakimasu'],
];

function toExample([japanese, vietnamese, note, alt]: RawExample): N4Example {
  return {
    id: hashId(plainText(japanese)),
    japanese,
    vietnamese,
    note: note ?? '',
    japaneseAlt: [...(alt?.ja ?? [])],
    vietnameseAlt: [...(alt?.vi ?? [])],
  };
}

function toUsage(raw: RawUsage): N4Usage {
  return {
    title: raw.title ?? '',
    detail: raw.detail ?? '',
    reference: raw.reference === true,
    examples: raw.examples.map(toExample),
  };
}

function toPoint(raw: RawPoint): N4Point {
  const usages = [
    ...(raw.examples ? [toUsage({ examples: raw.examples })] : []),
    ...(raw.usages ?? []).map(toUsage),
  ];
  return {
    id: raw.id,
    pattern: raw.pattern,
    meaning: raw.meaning ?? '',
    group: raw.group ?? '',
    structures: [...(raw.structures ?? [])],
    explanation: [...(raw.explanation ?? [])],
    tables: [...(raw.tables ?? [])],
    notes: [...(raw.notes ?? [])],
    wrong: (raw.wrong ?? []).map(([japanese, note]) => ({ japanese, note })),
    usages,
  };
}

function toQuiz(raw: RawSection['quiz']): N4Quiz | null {
  if (!raw) return null;
  return {
    instruction: raw.instruction,
    items: raw.items.map(([prompt, options, answer, note]) => ({
      prompt,
      options: [...options],
      answer,
      note: note ?? '',
    })),
  };
}

export const N4_SECTIONS: readonly N4Section[] = RAW_SECTIONS.map((raw, index) => ({
  id: raw.id,
  number: index + 1,
  title: raw.title,
  intro: [...(raw.intro ?? [])],
  points: raw.points.map(toPoint),
  quiz: toQuiz(raw.quiz),
}));
