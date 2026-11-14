/**
 * Nội dung bài tập "Luyện tập ngữ pháp N3", chép từ tài liệu "TỔNG HỢP NGỮ PHÁP N3"
 * (110 mẫu – Tuần 1, 2, 4, 5, 6; bản tóm tắt quyển 日本語総まとめ N3 文法).
 *
 * Giữ đúng cách chia của tài liệu: mục 1–12 là 12 NHÓM theo chức năng, mỗi mẫu trong nhóm
 * là một `N4Point` (mỗi mẫu: ý nghĩa, cách chia, câu ví dụ, vị trí trong bài gốc). Mục 13 là
 * phần "Phân biệt các mẫu dễ nhầm" của tài liệu.
 *
 * Những chỗ khác bản gốc, đều để phục vụ việc luyện chứ không đổi nội dung:
 *  - Ý nghĩa (`meaning`) rút gọn thành một dòng để làm đáp án trắc nghiệm; phần còn lại
 *    của mục "Ý nghĩa" trong tài liệu chuyển xuống `explanation`. Vài ý nghĩa thêm chữ
 *    trong ngoặc để hai mẫu gần nghĩa không trùng nhau (xem `N3_SYNONYMS`).
 *  - Câu ví dụ thêm furigana {漢字|かな} (tài liệu không ghi cách đọc) và dấu 《chỗ trống》.
 *  - Phần "Bài luyện tập" của mục 13 do ỨNG DỤNG SOẠN THÊM theo đúng các quy tắc phân
 *    biệt của tài liệu — tài liệu ghi rõ đã bỏ bài luyện tập và đề thực chiến (Ngày 7).
 *    Mỗi câu kèm lời giải thích, chỉ hiện sau khi trả lời.
 *
 * Cú pháp câu ví dụ ({漢字|かな}, [a/b], [a/], 《chỗ trống》) và kiểu dữ liệu: xem
 * `n4-grammar.model.ts`. `npm run verify:n4` kiểm cả file này.
 *
 * Id mẫu đều mang đầu "n3-": khoá lịch ôn (`nm:<id mẫu>`) không ghi tên sách, nên id phải
 * duy nhất trên mọi sách ngữ pháp.
 */

import { buildSections, table, type RawSection } from './grammar-book.build';
import type { N4Section } from './n4-grammar.model';

/** Vị trí của mẫu trong quyển gốc, như tài liệu ghi ("T4-N2" = Tuần 4, Ngày 2). */
function goc(week: number, day: number): string {
  return `Bài gốc: Tuần ${week}, Ngày ${day}.`;
}

const RAW_SECTIONS: readonly RawSection[] = [
  // ══ Nhóm 1 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-1',
    title: 'Bị động, sai khiến, ý hướng và câu gián tiếp',
    points: [
      {
        id: 'n3-ukemi',
        pattern: 'V 受身形 (thể bị động)',
        meaning: 'Bị…; được…; được cho là… (thể bị động)',
        group: 'bi-dong',
        structures: ['Động từ chia thể bị động (受身形)'],
        explanation: ['Dùng khi nêu một sự thật mà không nêu chủ thể.', goc(1, 1)],
        examples: [
          ['{入学式|にゅうがくしき}はこのホールで{行|おこな}《われます》。', 'Lễ nhập học sẽ được tổ chức tại hội trường này.'],
          [
            'これは{世界|せかい}で{一番|いちばん}{大|おお}きいダイヤモンドだと{言|い}《われています》。',
            'Cái này được cho là viên kim cương lớn nhất thế giới.',
          ],
        ],
      },
      {
        id: 'n3-meiwaku-ukemi',
        pattern: '(N に) V 受身形 (bị động gây phiền)',
        meaning: 'Bị ai / cái gì làm cho gặp khó khăn, phiền toái',
        group: 'bi-dong',
        structures: ['N に + V thể bị động'],
        explanation: [goc(1, 1)],
        examples: [
          ['{雨|あめ}に{降|ふ}《られて》、{服|ふく}がぬれてしまった。', 'Bị mưa nên quần áo ướt hết.'],
          [
            '{父|ちち}に{死|し}《なれて》、{大学|だいがく}を{続|つづ}けられなくなりました。',
            'Bố mất nên tôi không thể tiếp tục học đại học.',
          ],
        ],
      },
      {
        id: 'n3-sasete-kudasai',
        pattern: 'V(さ)せてください / もらえますか',
        meaning: 'Xin phép (cho tôi) được làm một việc',
        structures: [
          'V thể sai khiến + てください / てもらえますか / てもらえませんか',
          'Nhóm 1: đổi đuôi sang hàng あ + せて (帰る → 帰らせて)',
          'Nhóm 2: bỏ る + させて (考える → 考えさせて)',
          'Nhóm 3: する → させて; 来る → 来(こ)させて',
        ],
        explanation: [goc(1, 1)],
        examples: [
          ['ちょっと{気分|きぶん}が{悪|わる}いので、{早|はや}く{帰|かえ}《らせてください》。', 'Tôi hơi mệt, cho tôi về sớm.'],
          ['{手|て}を{洗|あら}《わせてください》。', 'Cho tôi rửa tay nhé.'],
        ],
      },
      {
        id: 'n3-you-to-omou',
        pattern: 'V(ý hướng) と思う',
        meaning: 'Định làm…; nghĩ là sẽ làm…',
        group: 'y-huong',
        structures: [
          'Thể ý hướng + と思う / と思っている',
          'Nhóm 1: đổi đuôi hàng う sang hàng お + う (言う → 言おう; 待つ → 待とう)',
          'Nhóm 2: bỏ る + よう (食べる → 食べよう)',
          'Nhóm 3: する → しよう; 来る → 来よう',
        ],
        explanation: [goc(1, 6)],
        examples: [
          ['{来年|らいねん}、{国|くに}に{帰|かえ}《ろうと{思|おも}っています》。', 'Năm sau tôi định về nước.'],
          ['{会社|かいしゃ}をやめ《ようと{思|おも}っている》。', 'Tôi đang nghĩ đến chuyện nghỉ việc.'],
        ],
      },
      {
        id: 'n3-you-to-suru',
        pattern: 'V(ý hướng) とする',
        meaning: 'Vừa định làm… thì (có việc khác xảy ra)',
        group: 'y-huong',
        structures: ['Thể ý hướng + とする / とした'],
        explanation: [goc(1, 6)],
        examples: [
          [
            '{電車|でんしゃ}に{乗|の}《ろうとした》とき、ドアが{閉|し}まって{乗|の}れなかった。',
            'Vừa định lên tàu thì cửa đóng nên không lên được.',
          ],
          ['ポチは、{僕|ぼく}が{出|で}かけ《ようとする》と、ほえる。', 'Hễ tôi sắp ra ngoài là Pochi sủa.'],
        ],
      },
      {
        id: 'n3-you-to-shinai',
        pattern: 'V(ý hướng) としない',
        meaning: 'Không chịu làm… (theo phán đoán của người nói)',
        group: 'y-huong',
        structures: ['Thể ý hướng + としない'],
        explanation: ['Có vẻ không định / không chịu làm.', goc(1, 6)],
        examples: [
          ['ポチがご{飯|はん}を{食|た}べ《ようとしない》んだよ。', 'Pochi không chịu ăn cơm.'],
          ['{彼|かれ}は{自分|じぶん}のことは{何|なに}も{言|い}《おうとしない》。', 'Anh ấy chẳng chịu nói gì về bản thân.'],
        ],
      },
      {
        id: 'n3-te-goran',
        pattern: 'V てごらん',
        meaning: 'Thử làm… xem (nói với người dưới)',
        structures: ['V て + ごらん / ごらんなさい'],
        explanation: ['Tương đương V てみる, dùng khi nói với người dưới.', goc(2, 6)],
        examples: [
          ['わからなかったら、{先生|せんせい}に{聞|き}いて《ごらん》。', 'Nếu không hiểu thì thử hỏi thầy xem.'],
          ['もう{一度|いちど}やって《ごらんなさい》。', 'Làm thử lần nữa xem.'],
        ],
      },
      {
        id: 'n3-you-ni-iu',
        pattern: 'V る / V ない ように言う・頼む',
        meaning: 'Bảo / nhờ ai làm (hoặc đừng làm) việc gì (mệnh lệnh gián tiếp)',
        group: 'truyen-dat',
        structures: ['V thể từ điển / V ない + ように + 言う / 頼む'],
        explanation: [goc(2, 6)],
        examples: [
          [
            '{田中|たなか}さんに、{私|わたし}の{部屋|へや}に{来|く}る《ように{言|い}って》ください。',
            'Hãy bảo anh Tanaka đến phòng tôi.',
          ],
          [
            '{妻|つま}に、{家|いえ}でタバコを{吸|す}わない《ように{言|い}われて》います。',
            'Vợ bảo tôi đừng hút thuốc trong nhà.',
          ],
        ],
      },
      {
        id: 'n3-meirei-to-iwareru',
        pattern: 'V(mệnh lệnh) と言われる',
        meaning: 'Bị nói là…; bị nhắc nhở; bị mắng (trích lại lời mệnh lệnh)',
        group: 'truyen-dat',
        structures: [
          'V thể mệnh lệnh + と + 言われる / 注意される / しかられる / 怒られる',
          'V る + な (cấm đoán) + と + 言われる / 注意される',
        ],
        explanation: [goc(2, 6)],
        examples: [
          ['{医者|いしゃ}にお{酒|さけ}を{飲|の}む《なと{言|い}われた》。', 'Bị bác sĩ dặn đừng uống rượu.'],
          ['{父|ちち}に、もっと{早|はや}く{帰|かえ}《れと{注意|ちゅうい}された》。', 'Bị bố nhắc phải về sớm hơn.'],
        ],
      },
      {
        id: 'n3-tekure-to-tanomareru',
        pattern: 'V てくれと頼まれる',
        meaning: 'Được nhờ / bị bảo hãy làm (hoặc đừng làm) việc gì giúp người khác',
        group: 'truyen-dat',
        structures: ['V てくれ / V ないでくれ + と + 頼まれる / 言われる'],
        explanation: [goc(2, 6)],
        examples: [
          [
            '{友達|ともだち}に{田中|たなか}さんの{電話番号|でんわばんごう}を{教|おし}えて《くれと{頼|たの}まれた》。',
            'Bạn nhờ tôi cho số điện thoại của anh Tanaka.',
          ],
          [
            '{大家|おおや}に、{玄関|げんかん}の{前|まえ}に{自転車|じてんしゃ}を{置|お}かないで《くれと{言|い}われた》。',
            'Chủ nhà bảo tôi đừng để xe đạp trước cửa.',
          ],
        ],
      },
    ],
  },

  // ══ Nhóm 2 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-2',
    title: 'Dạng nói tắt trong văn nói',
    intro: [
      'Các mẫu này dùng trong hội thoại. Khi viết trang trọng, dùng dạng đầy đủ ghi trong phần cách chia.',
    ],
    points: [
      {
        id: 'n3-naito',
        pattern: 'V ないと / V なくちゃ',
        meaning: 'Phải làm… (dạng nói của なければならない)',
        structures: ['V ない bỏ い + と / なくちゃ', 'Dạng đầy đủ: なければならない / ないといけない'],
        explanation: ['なくちゃ thường do phụ nữ dùng.', goc(1, 2)],
        examples: [
          ['{試験|しけん}まであと1か{月|げつ}だ。がんばって{勉強|べんきょう}し《ないと》。', 'Còn 1 tháng nữa là thi, phải cố học thôi.'],
          ['{田中|たなか}さんにメールの{返信|へんしん}をし《なくちゃ》。', 'Phải trả lời thư anh Tanaka.'],
        ],
      },
      {
        id: 'n3-chau',
        pattern: 'V ちゃう / V じゃう',
        meaning: 'Làm mất rồi, làm hết rồi; lỡ làm… (dạng nói của てしまう)',
        structures: ['てしまう → ちゃう', 'でしまう → じゃう (死んでしまう → 死んじゃう)'],
        explanation: ['1. Làm xong, làm hết.', '2. Lỡ làm…, tiếc nuối.', goc(1, 2)],
        examples: [
          ['あ、{食|た}べ《ちゃった》。いけなかった？', 'A, tôi lỡ ăn mất rồi, không được à?'],
          ['{車|くるま}が{混|こ}ん《じゃって》、{少|すこ}し{遅|おく}れます。', 'Tắc đường nên tôi sẽ đến muộn một chút.'],
        ],
      },
      {
        id: 'n3-toku',
        pattern: 'V とく / V どく',
        meaning: 'Làm sẵn, làm trước; để nguyên như vậy (dạng nói của ておく)',
        structures: ['ておく → とく (見ておいた → 見といた)', 'でおく → どく (読んでおきます → 読んどきます)'],
        explanation: [goc(1, 2)],
        examples: [
          ['テストで{間違|まちが}ったところを、ノートに{書|か}い《とこう》。', 'Ghi trước các lỗi sai vào vở.'],
          [
            'トイレットペーパーがもうすぐなくなるから、{買|か}っ《とか》ないと。',
            'Giấy vệ sinh sắp hết, phải mua trước thôi.',
          ],
        ],
      },
      {
        id: 'n3-kke',
        pattern: '～っけ',
        meaning: 'Hình như là… nhỉ? (nhớ lại và muốn xác nhận)',
        structures: [
          'N / Ana + だっけ / だったっけ',
          'Ai + かったっけ',
          'V + たっけ',
          'Lịch sự: でしたっけ / ましたっけ',
        ],
        explanation: [goc(4, 5)],
        examples: [
          ['{国|くに}へ{帰|かえ}るのは、{来週|らいしゅう}《だ[った/]っけ》？', 'Ngày về nước là tuần sau nhỉ?'],
          ['{明日|あした}のパーティーのこと、{話|はな}し《[まし/]たっけ》。', 'Tôi đã nói về bữa tiệc ngày mai chưa nhỉ?'],
        ],
      },
      {
        id: 'n3-n-datte',
        pattern: '～んだって',
        meaning: 'Nghe nói là… đấy (truyền lại tin, không kèm nhận định)',
        structures: ['Thể ngắn + んだって', 'Cũng gặp: までだって, からだって, だけだって'],
        explanation: [goc(4, 5)],
        examples: [['{田中|たなか}さん、{結婚|けっこん}してる《んだって》。', 'Nghe nói anh Tanaka đã kết hôn đấy.']],
      },
      {
        id: 'n3-mon',
        pattern: '～もん / ～んだもん',
        meaning: 'Bởi vì… mà (nêu lý do chủ quan)',
        structures: ['Thể thông thường + もん', 'Thể thông thường + んだもん (Ana, N hiện tại: đổi だ thành な)'],
        explanation: ['Phụ nữ và trẻ em hay dùng.', goc(4, 5)],
        examples: [['だってまずい《んだもん》。', 'Vì nó dở mà.']],
      },
    ],
  },

  // ══ Nhóm 3 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-3',
    title: 'Các mẫu ように',
    intro: [
      'Để phân biệt nghĩa của ように, hãy nhìn từ đứng trước (thể từ điển, ない, thể khả năng, ます) và từ đứng sau (する, なる, 言う hay kết câu).',
    ],
    points: [
      {
        id: 'n3-you-ni-suru',
        pattern: 'V る / V ない ようにする',
        meaning: 'Cố gắng làm / cố gắng không làm (thành thói quen)',
        group: 'you-ni',
        structures: ['V thể từ điển / V ない + ようにする'],
        explanation: ['Hành động lặp lại để thành thói quen.', goc(1, 4)],
        examples: [
          ['{忘|わす}れ{物|もの}をしない《ようにしましょう》。', 'Cố gắng đừng quên đồ nhé.'],
          ['{毎食後|まいしょくご}、{歯|は}を{磨|みが}く《ようにしています》。', 'Sau mỗi bữa ăn tôi luôn đánh răng.'],
        ],
      },
      {
        id: 'n3-you-ni-muc-dich',
        pattern: '～ように + mệnh đề 2 (mục đích)',
        meaning: 'Để mà… (mệnh đề 1 là mục tiêu, mệnh đề 2 là hành động có chủ ý)',
        group: 'you-ni',
        structures: [
          'V thể từ điển / V ない / V thể khả năng + ように',
          'Mệnh đề 1 hay dùng động từ không chủ ý: できる, わかる, 聞こえる, なる',
        ],
        explanation: [goc(1, 4)],
        examples: [
          [
            'みんなに{聞|き}こえる《ように》、もっと{大|おお}きい{声|こえ}で{話|はな}してください。',
            'Hãy nói to hơn để mọi người nghe được.',
          ],
          ['{忘|わす}れない《ように》、{手帳|てちょう}に{書|か}いておこう。', 'Ghi sẵn vào sổ để khỏi quên.'],
        ],
      },
      {
        id: 'n3-you-ni-naru',
        pattern: 'V(khả năng) ようになる',
        meaning: 'Trở nên có thể… (từ không thể sang có thể)',
        group: 'you-ni',
        structures: ['V thể khả năng + ようになる'],
        explanation: [goc(1, 4)],
        examples: [
          ['{直|なお}してもらったから、{使|つか}える《ようになった》よ。', 'Đã sửa rồi nên giờ dùng được rồi.'],
          [
            'ここの{電気|でんき}は{人|ひと}が{通|とお}るとつく《ようになっています》。',
            'Đèn ở đây cứ có người đi qua là sáng.',
            'ようになっている: (máy móc, hệ thống) được làm sẵn để hoạt động như vậy.',
          ],
        ],
      },
      {
        id: 'n3-you-ni-theo-nhu',
        pattern: 'V 普通形 / N の ように、～ (theo như)',
        meaning: 'Như…; theo như… (căn cứ điều đã biết, đã nghe, đã thấy)',
        group: 'you-ni',
        structures: ['V thể thông thường + ように', 'N + の + ように (図のように)'],
        explanation: [goc(1, 5)],
        examples: [
          [
            '{皆様|みなさま}ご{存|ぞん}じの《ように》、{試験|しけん}の{内容|ないよう}が{変|か}わります。',
            'Như mọi người đã biết, nội dung kỳ thi sẽ thay đổi.',
          ],
          [
            '{前|まえ}にお{話|はな}しした《ように》、{来年|らいねん}から{授業料|じゅぎょうりょう}が{上|あ}がります。',
            'Như đã nói, từ năm sau học phí tăng.',
          ],
        ],
      },
      {
        id: 'n3-you-ni-loi-dan',
        pattern: 'V る / V ない ように (lời dặn nhẹ)',
        meaning: 'Hãy… / xin đừng… (lời dặn, khuyên nhẹ nhàng ở cuối câu)',
        group: 'you-ni',
        structures: ['V thể từ điển / V ない + ように (kết câu)'],
        explanation: [goc(1, 5)],
        examples: [
          ['{明日|あした}はもっと{早|はや}く{来|く}る《ように》。', 'Ngày mai hãy đến sớm hơn.'],
          ['ここでタバコを{吸|す}わない《ように》。', 'Xin đừng hút thuốc ở đây.'],
        ],
      },
      {
        id: 'n3-masu-you-ni',
        pattern: 'V ますように',
        meaning: 'Ước gì…; mong là… (lời cầu mong của người nói)',
        group: 'you-ni',
        structures: [
          'V ます + ように (勝ちますように)',
          'V ません + ように (負けませんように)',
          'V thể khả năng ます + ように (勝てますように)',
        ],
        explanation: [goc(1, 5)],
        examples: [
          ['{合格|ごうかく}し《ますように》。', 'Mong là sẽ đỗ.'],
          ['{母|はは}の{病気|びょうき}が{治|なお}り《ますように》。', 'Mong bệnh của mẹ khỏi.'],
        ],
      },
    ],
  },

  // ══ Nhóm 4 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-4',
    title: 'Mong muốn, khuyên bảo, bắt buộc',
    points: [
      {
        id: 'n3-to-ii-naa',
        pattern: '～といいなあ',
        meaning: 'Hy vọng là…; ước gì… (mong muốn cho tương lai)',
        group: 'tiec-nuoi',
        structures: ['Thể ngắn + といい(のに)なあ', 'Thể giả định (たら / ば) + いいなあ'],
        explanation: [goc(5, 3)],
        examples: [
          ['うまく{話|はな}せる《といいなあ》。', 'Ước gì nói được trôi chảy.'],
          ['{明日|あした}、{雨|あめ}が{降|ふ}らなかっ《たらいいなあ》。', 'Mai mà trời không mưa thì tốt.'],
        ],
      },
      {
        id: 'n3-ba-yokatta',
        pattern: '～ばよかった',
        meaning: 'Giá mà đã… (tiếc nuối việc mình đã không làm)',
        group: 'tiec-nuoi',
        structures: ['V ば / V たら + よかった', 'Phủ định: V なければ / V なかったら + よかった'],
        explanation: [goc(5, 3)],
        examples: [
          ['もっと{早|はや}く{家|いえ}を{出|で}《ればよかった》。', 'Giá mà ra khỏi nhà sớm hơn.'],
          [
            '{田中|たなか}さんにあんなことを{言|い}わな《ければよかった》。',
            'Giá mà đừng nói những điều như vậy với anh Tanaka.',
          ],
        ],
      },
      {
        id: 'n3-ba-yokatta-noni',
        pattern: '～ばよかったのに',
        meaning: 'Lẽ ra… thì đã tốt (tiếc nuối, trách nhẹ người khác)',
        group: 'tiec-nuoi',
        structures: ['V ば / V たら + よかったのに'],
        explanation: ['Thực tế thì không làm. Thể hiện tiếc nuối, thất vọng, trách nhẹ người khác.', goc(5, 3)],
        examples: [
          ['あなたも{行|い}《けばよかったのに》。', 'Giá mà bạn cũng đi thì tốt biết mấy.'],
          ['{安|やす}かった《ら》{買|か}った《のに》。', 'Nếu rẻ thì đã mua rồi.', 'Thực tế không rẻ nên chưa mua.'],
        ],
      },
      {
        id: 'n3-kana',
        pattern: 'V る / V ない + かな(あ)',
        meaning: 'Tự hỏi… nhỉ (thể hiện mong muốn, cảm xúc)',
        structures: ['V thể từ điển / V ない + かな(あ)'],
        explanation: [goc(5, 3)],
        examples: [
          ['バス、{早|はや}く{来|こ}ない《かなあ》。', 'Sao xe buýt không đến sớm nhỉ.'],
          ['{今日|きょう}は{富士山|ふじさん}が{見|み}える《かな》。', 'Hôm nay liệu có thấy núi Phú Sĩ không nhỉ.'],
        ],
      },
      {
        id: 'n3-koto-da',
        pattern: 'V る / V ない ことだ',
        meaning: 'Nên… / không nên… (lời khuyên)',
        group: 'khuyen',
        structures: ['V thể từ điển / V ない + ことだ'],
        explanation: [goc(4, 4)],
        examples: [
          ['{暖|あたた}かくして、ゆっくり{休|やす}む《ことだ》。', 'Nên giữ ấm và nghỉ ngơi.'],
          ['{無理|むり}をしない《ことだ》。', 'Đừng gắng sức quá.'],
        ],
      },
      {
        id: 'n3-shika-nai',
        pattern: 'V るしかない',
        meaning: 'Chỉ còn cách là…; đành phải làm',
        group: 'khuyen',
        structures: ['V thể từ điển + しかない'],
        explanation: [goc(4, 5)],
        examples: [
          ['できるまで、やる《しかない》。', 'Chỉ có cách làm cho đến khi được.'],
          ['{直|なお}せないから、{新|あたら}しいものを{買|か}う《しかなかった》。', 'Không sửa được nên đành mua cái mới.'],
        ],
      },
      {
        id: 'n3-koto-wa-nai',
        pattern: 'V ることはない',
        meaning: 'Không cần phải… (= なくていい)',
        group: 'khuyen',
        structures: ['V thể từ điển + ことはない'],
        explanation: [goc(4, 4)],
        examples: [
          ['{君|きみ}が{謝|あやま}る《ことはない》よ。', 'Bạn không cần xin lỗi đâu.'],
          ['{来|く}る《ことはありません》。{郵送|ゆうそう}でいいです。', 'Không cần đến, gửi qua bưu điện là được.'],
        ],
      },
      {
        id: 'n3-donnani-koto-ka',
        pattern: 'どんなに～ことか',
        meaning: 'Thật là… biết bao (cảm thán mạnh)',
        structures: [
          'どんなに / どれだけ / どれほど / 何度 + …',
          'Ai + ことか',
          'Ana + な + ことか',
          'V た + ことか',
        ],
        explanation: [goc(4, 4)],
        examples: [
          ['{合格|ごうかく}できたら、《どんなに》うれしい《ことか》。', 'Nếu đỗ thì vui biết bao.'],
          ['《{何度|なんど}》{注意|ちゅうい}した《ことか》。', 'Tôi đã nhắc bao nhiêu lần rồi.'],
        ],
      },
    ],
  },

  // ══ Nhóm 5 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-5',
    title: 'Giống như, suy đoán, đánh giá',
    points: [
      {
        id: 'n3-mitai',
        pattern: '～みたいだ / みたいに / みたいなN',
        meaning: 'Giống như… (nhưng không phải); trông có vẻ… (phán đoán qua quan sát)',
        group: 'giong',
        structures: ['V / Ai / Ana / N thể thông thường + みたいだ', 'Ana và N bỏ だ rồi gắn trực tiếp'],
        explanation: [goc(1, 3)],
        examples: [
          ['{彼|かれ}の{話|はな}し{方|かた}は{女|おんな}《みたいだ》。', 'Cách nói chuyện của anh ấy giống con gái.'],
          ['このアパートはだれも{住|す}んでいない《みたいだ》。', 'Căn hộ này có vẻ không ai ở.'],
          ['リーさん《みたいに》{日本語|にほんご}がうまくなりたい。', 'Tôi muốn giỏi tiếng Nhật như anh Lee.'],
        ],
      },
      {
        id: 'n3-rashii',
        pattern: 'N らしい',
        meaning: 'Đúng kiểu, đúng chất của N',
        group: 'giong',
        structures: ['N + らしい (子どもらしい, 男らしい, 女らしい, 私らしい)'],
        explanation: [goc(1, 3)],
        examples: [
          ['{今日|きょう}は{春|はる}《らしい》{暖|あたた}かい{日|ひ}でした。', 'Hôm nay ấm áp đúng kiểu mùa xuân.'],
          ['{私|わたし}は{女性|じょせい}《らしい》{洋服|ようふく}はあまり{着|き}ない。', 'Tôi ít mặc đồ nữ tính.'],
        ],
      },
      {
        id: 'n3-ppoi',
        pattern: 'N / V っぽい',
        meaning: 'Hơi hướng…, trông như… (thường ý chê); hay… (xu hướng)',
        group: 'giong',
        structures: ['N + っぽい (子供っぽい, 油っぽい, 黒っぽい)', 'V bỏ ます + っぽい (忘れっぽい)'],
        explanation: ['1. Có vẻ, hơi giống…', '2. Dễ…, hay… (xu hướng).', goc(1, 3)],
        examples: [
          ['あの{小学生|しょうがくせい}は、{大人|おとな}《っぽい》。', 'Đứa bé tiểu học đó trông như người lớn.'],
          ['{年|とし}を{取|と}ると、{忘|わす}れ《っぽく》なる。', 'Có tuổi thì hay quên.'],
        ],
      },
      {
        id: 'n3-marude',
        pattern: 'まるで～ようだ / みたいだ',
        meaning: 'Cứ như là… (so sánh ví von)',
        group: 'giong',
        structures: [
          'まるで + V thể thông thường / N の + ようだ',
          'まるで + thể thông thường + みたいだ (Ana, N bỏ だ)',
        ],
        explanation: [goc(5, 5)],
        examples: [['{合格|ごうかく}した。《まるで》{夢|ゆめ}の《ようだ》。', 'Đỗ rồi, cứ như trong mơ.']],
        usages: [
          {
            title: 'まるで～ない: hoàn toàn không',
            examples: [['あなたの{言|い}うことは《まるで》{理解|りかい}でき《ない》。', 'Tôi hoàn toàn không hiểu bạn nói gì.']],
          },
        ],
      },
      {
        id: 'n3-kamoshirenai',
        pattern: '(もしかすると) ～かもしれない',
        meaning: 'Có lẽ…; không chừng… (khả năng khoảng 50%)',
        structures: ['Thể thông thường + かもしれない (Ana, N hiện tại bỏ だ)'],
        explanation: ['Khả năng thấp hơn でしょう.', goc(5, 5)],
        examples: [
          ['《もしかすると》{彼|かれ}の{話|はなし}はうそ《かもしれない》。', 'Không chừng chuyện anh ấy kể là bịa.'],
          ['《もしかしたら》、{明日|あした}{行|い}けない《かもしれません》。', 'Có khi mai tôi không đi được.'],
        ],
      },
      {
        id: 'n3-towa-kagiranai',
        pattern: '必ずしも～とは限らない',
        meaning: 'Chưa chắc đã…; không nhất định là…',
        structures: ['必ずしも + thể thông thường + とは限らない'],
        explanation: [goc(5, 5)],
        examples: [
          [
            '{金持|かねも}ちが《{必|かなら}ずしも》{幸福|こうふく}だ《とは{限|かぎ}らない》。',
            'Người giàu chưa hẳn đã hạnh phúc.',
          ],
        ],
      },
      {
        id: 'n3-to-iu-yori',
        pattern: '～というより',
        meaning: 'Nói là… thì đúng hơn; …hơn là… (đánh giá lại sự việc)',
        group: 'to-iu-danh-gia',
        structures: ['N / Ana + というより', 'V / Ai thể thông thường + というより', 'Dạng khác: というか'],
        explanation: [goc(2, 5)],
        examples: [
          [
            '{前|まえ}の{車|くるま}は{遅|おそ}すぎて、{走|はし}る《というより》、はっているようだ。',
            'Xe phía trước chậm đến mức giống bò hơn là chạy.',
          ],
          [
            'あの{学生|がくせい}はできない《というより》、やる{気|き}がないのでしょう。',
            'Cậu ấy không phải không làm được mà là không muốn làm.',
          ],
        ],
      },
      {
        id: 'n3-to-ittemo',
        pattern: '～といっても',
        meaning: 'Nói là… nhưng thực ra… (thực tế khác điều người nghe nghĩ)',
        group: 'to-iu-danh-gia',
        structures: ['N / Ana + といっても', 'V / Ai thể thông thường + といっても'],
        explanation: [goc(2, 5)],
        examples: [
          [
            '{旅行|りょこう}《といっても》、{近|ちか}くの{温泉|おんせん}に{行|い}っただけです。',
            'Nói là du lịch nhưng chỉ đi suối nước nóng gần nhà.',
          ],
          [
            '{今週|こんしゅう}は{忙|いそが}しい《といっても》、{先週|せんしゅう}ほどじゃない。',
            'Tuần này bận nhưng không bằng tuần trước.',
          ],
        ],
      },
      {
        id: 'n3-to-iu-to',
        pattern: '～というと / といえば / といったら',
        meaning: 'Nhắc đến… thì (nghĩ ngay đến điều liên tưởng)',
        group: 'to-iu-danh-gia',
        structures: [
          'N / Ana + というと / といえば / といったら',
          'V / Ai thể thông thường + というと / といえば / といったら',
        ],
        explanation: [goc(2, 5)],
        examples: [
          ['{京都|きょうと}《というと》、お{寺|てら}をイメージします。', 'Nói đến Kyoto là nghĩ đến chùa.'],
          ['{夏|なつ}の{果物|くだもの}《といったら》、やっぱりスイカだね。', 'Trái cây mùa hè thì vẫn là dưa hấu.'],
        ],
      },
    ],
  },

  // ══ Nhóm 6 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-6',
    title: 'So sánh, mức độ và lập trường',
    points: [
      {
        id: 'n3-kurai-hodo',
        pattern: '～くらい / ぐらい / ほど (mức độ)',
        meaning: 'Khoảng cỡ…; đến mức…',
        group: 'hodo',
        structures: ['N / Ai / Ana な / V + くらい (ぐらい) / ほど'],
        explanation: [goc(4, 3)],
        examples: [
          ['{米粒|こめつぶ}《くらい》の{大|おお}きさ。', 'To cỡ hạt gạo.'],
          ['{泣|な}きたい《ほど》{痛|いた}い。', 'Đau đến mức muốn khóc.'],
        ],
      },
      {
        id: 'n3-hodo-cang',
        pattern: 'N / Ai / Ana な + ほど (càng… càng)',
        meaning: 'Càng… thì càng… (một bên thay đổi, bên kia thay đổi theo)',
        group: 'hodo',
        structures: ['N / Ai / Ana な + ほど'],
        explanation: [goc(4, 3)],
        examples: [
          ['{若|わか}い{人|ひと}《ほど》{寝坊|ねぼう}しやすい。', 'Càng trẻ càng dễ ngủ dậy muộn.'],
          ['{伝統的|でんとうてき}なもの《ほど》{価値|かち}がある。', 'Càng truyền thống càng có giá trị.'],
        ],
      },
      {
        id: 'n3-ba-hodo',
        pattern: 'V ば V るほど',
        meaning: 'Càng… càng… (lặp lại cùng một từ)',
        group: 'hodo',
        structures: ['V ば + V る + ほど', 'Ai ければ + Ai + ほど', 'Ana なら + Ana な + ほど'],
        explanation: [goc(4, 3)],
        examples: [
          ['{知|し}れ《ば》{知|し}る《ほど》おもしろい。', 'Càng biết càng thấy hay.'],
          ['{荷物|にもつ}は{軽|かる}《ければ》{軽|かる}い《ほど》いい。', 'Hành lý càng nhẹ càng tốt.'],
        ],
      },
      {
        id: 'n3-kurai-wa-nai',
        pattern: 'N くらい / ほど ～はない',
        meaning: 'Không có gì… bằng N (N là nhất)',
        group: 'hodo',
        structures: ['N + くらい / ほど + ～は + ない / いない'],
        explanation: [goc(4, 3)],
        examples: [['{彼女|かのじょ}《くらい》{親切|しんせつ}な{人|ひと}は《いない》。', 'Không ai tử tế bằng cô ấy.']],
      },
      {
        id: 'n3-ni-kurabete',
        pattern: 'N に比べて',
        meaning: 'So với N thì… (N là mốc so sánh)',
        structures: ['N / mệnh đề + の + に比べて / に比べ'],
        explanation: [goc(5, 1)],
        examples: [
          [
            '{今年|ことし}の{桜|さくら}は、{昨年|さくねん}《に{比|くら}べて》1{週間|しゅうかん}{早|はや}く{咲|さ}いた。',
            'Hoa anh đào năm nay nở sớm hơn năm ngoái 1 tuần.',
          ],
          [
            '{店|みせ}で{買|か}うの《に{比|くら}べ》、{通信販売|つうしんはんばい}は{便利|べんり}だが、{欠点|けってん}もある。',
            'So với mua ở cửa hàng, mua qua mạng tiện nhưng có nhược điểm.',
          ],
        ],
      },
      {
        id: 'n3-ni-taishite',
        pattern: 'N に対して',
        meaning: 'Đối với… (hành động, thái độ hướng tới N); trái với…',
        group: 'doi-voi',
        structures: ['N + に対して / に対し / に対しては / に対しても / に対するN'],
        explanation: [goc(5, 1)],
        usages: [
          {
            title: 'Đối với… (hướng tới đối tượng)',
            examples: [['{田中|たなか}{先生|せんせい}は{生徒|せいと}《に{対|たい}して》{厳|きび}しい。', 'Thầy Tanaka nghiêm khắc với học sinh.']],
          },
          {
            title: 'Trái với… (đối lập hai vế)',
            examples: [
              [
                'まじめな{長男|ちょうなん}《に{対|たい}して》、{次男|じなん}は{遊|あそ}んでばかりだ。',
                'Trái với con cả chăm chỉ, con thứ chỉ ham chơi.',
              ],
            ],
          },
        ],
      },
      {
        id: 'n3-ni-totte',
        pattern: 'N にとって',
        meaning: 'Đối với… (đứng ở lập trường của N để đánh giá)',
        group: 'doi-voi',
        structures: ['N + にとって / にとっては / にとっても / にとってのN'],
        explanation: [goc(4, 1)],
        examples: [
          ['あなた《にとって》、{一番|いちばん}{大切|たいせつ}な{物|もの}は{何|なん}ですか。', 'Với bạn, điều quan trọng nhất là gì?'],
          [
            'このあたりの{人々|ひとびと}《にとっては》{車|くるま}は{必需品|ひつじゅひん}です。',
            'Với người vùng này, ô tô là vật thiết yếu.',
          ],
        ],
      },
      {
        id: 'n3-wari-ni',
        pattern: '～わりに(は)',
        meaning: 'So với… thì lại… (kết quả ngoài dự đoán, không tương xứng)',
        group: 'trai-nguoc',
        structures: ['Thể thông thường + わりに(は)', 'Ana giữ な; N thêm の'],
        explanation: [goc(4, 1)],
        examples: [
          ['{年|とし}の《わりには》{若|わか}く{見|み}える。', 'So với tuổi thì trông trẻ.'],
          ['お{金|かね}がない《わりに》、よく{買|か}い{物|もの}をするね。', 'Kêu không có tiền mà mua sắm nhiều nhỉ.'],
        ],
      },
      {
        id: 'n3-kuse-ni',
        pattern: '～くせに',
        meaning: 'Mặc dù… mà (chê trách, khinh miệt)',
        group: 'trai-nguoc',
        structures: ['Thể thông thường + くせに', 'Ana đổi だ thành な; N thêm の'],
        explanation: ['Chủ ngữ hai vế phải là một.', goc(4, 1)],
        examples: [
          ['{知|し}っている《くせに》{教|おし}えてくれない。', 'Biết mà không chịu chỉ cho.'],
          ['{元気|げんき}な《くせに》{病気|びょうき}のふりをしている。', 'Khỏe mà giả vờ ốm.'],
        ],
      },
    ],
  },

  // ══ Nhóm 7 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-7',
    title: 'Nhấn mạnh và giới hạn',
    points: [
      {
        id: 'n3-bakari',
        pattern: 'N ばかり / V てばかりいる',
        meaning: 'Chỉ toàn là…; suốt ngày chỉ làm… (mang ý chê)',
        group: 'chi',
        structures: ['N + ばかり(だ)', 'V て + ばかりいる / ばかりで / ばかりのN'],
        explanation: [goc(2, 1)],
        examples: [
          ['この{店|みせ}のお{客|きゃく}さんは、{女性|じょせい}《ばかり》ですね。', 'Khách quán này toàn là nữ.'],
          ['{息子|むすこ}は{仕事|しごと}もしないで{遊|あそ}んで《ばかりいる》。', 'Con trai tôi không làm gì, suốt ngày chỉ chơi.'],
        ],
      },
      {
        id: 'n3-dake-shika',
        pattern: 'N だけしか～ない',
        meaning: 'Chỉ có… (hình thức phủ định, ý nghĩa khẳng định)',
        group: 'chi',
        structures: ['N + だけしか + V ない'],
        explanation: [goc(2, 1)],
        examples: [
          ['このコンサートは、{会員|かいいん}《だけしか》{入|はい}れません。', 'Buổi hòa nhạc này chỉ hội viên vào được.'],
          ['{今日|きょう}はお{客様|きゃくさま}が{一人|ひとり}《だけしか》{来|き}ませんでした。', 'Hôm nay chỉ có một khách.'],
        ],
      },
      {
        id: 'n3-sae',
        pattern: 'N(で / に)さえ',
        meaning: 'Thậm chí…; ngay cả… (nêu ví dụ cực đoan)',
        structures: ['N + さえ; N + でさえ / にさえ'],
        explanation: [goc(2, 1)],
        examples: [
          [
            'ひらがな《さえ》{書|か}けないんですから、{漢字|かんじ}なんて{書|か}けません。',
            'Hiragana còn không viết được thì nói gì kanji.',
          ],
          ['そんなこと、{子供|こども}《でさえ》{知|し}っている。', 'Chuyện đó ngay cả trẻ con cũng biết.'],
        ],
      },
      {
        id: 'n3-koso',
        pattern: 'N こそ / ～からこそ',
        meaning: 'Chính là…; chính vì… (nhấn mạnh)',
        structures: ['N + こそ', 'Mệnh đề + からこそ'],
        explanation: ['N こそ: chính là… (nhấn mạnh).', '～からこそ: chính vì… (nhấn mạnh lý do).', goc(2, 1)],
        examples: [
          ['{明日|あした}《こそ》{勉強|べんきょう}するぞ！', 'Ngày mai nhất định phải học!'],
          ['{愛情|あいじょう}がある《からこそ》、しかるんです。', 'Chính vì thương nên mới mắng.'],
        ],
      },
      {
        id: 'n3-wa-mochiron',
        pattern: 'N1 はもちろん N2 も',
        meaning: 'N1 thì đương nhiên rồi, cả N2 cũng…',
        structures: ['N1 / mệnh đề + の + はもちろん (はもとより)', 'Vế sau thường có も'],
        explanation: [goc(5, 1)],
        examples: [
          ['{彼|かれ}は{勉強|べんきょう}《はもちろん》スポーツもよくできる。', 'Anh ấy học giỏi đã đành, thể thao cũng giỏi.'],
          [
            'キャベツは{炒|いた}めて{食|た}べるの《はもちろん》、{生|なま}で{食|た}べても{美味|おい}しい。',
            'Bắp cải xào ăn ngon đã đành, ăn sống cũng ngon.',
          ],
        ],
      },
      {
        id: 'n3-bakarika',
        pattern: '～ばかりか ～も',
        meaning: 'Không chỉ… mà còn…',
        structures: ['Thể thông thường + ばかりか / ばかりでなく', 'N và Ana không có だ (Ana có thể giữ な)'],
        explanation: [goc(5, 1)],
        examples: [
          [
            'あの{店|みせ}は{味|あじ}が{悪|わる}い《ばかりか》、{店員|てんいん}の{態度|たいど}もひどい。',
            'Quán đó không chỉ dở mà thái độ nhân viên cũng tệ.',
          ],
          [
            '{私|わたし}は、{漢字|かんじ}《ばかりか》、まだひらがなも{書|か}けません。',
            'Tôi không chỉ kanji mà hiragana cũng chưa viết được.',
          ],
        ],
      },
      {
        id: 'n3-nanka',
        pattern: 'N なんか / なんて / など',
        meaning: 'Chẳng hạn như…; (coi nhẹ, phủ định) cái thứ như…',
        structures: ['N / V て / Ai く / Ana + など / なんか / なんて'],
        explanation: ['など dùng trong văn viết; なんか / なんて dùng trong văn nói.', goc(4, 1)],
        examples: [
          ['{納豆|なっとう}《なんて》きらいだ。', 'Natto thì tôi ghét.'],
          ['「{泣|な}いてるの？」「{泣|な}いて《なんか》ないよ」', '“Khóc à?” – “Có khóc gì đâu”.'],
        ],
      },
      {
        id: 'n3-n-made',
        pattern: 'N まで (ngay cả)',
        meaning: 'Ngay cả N cũng…; đến cả N',
        structures: ['N + まで'],
        explanation: [goc(5, 4)],
        examples: [
          ['この{魚|さかな}は{骨|ほね}《まで》{食|た}べられますよ。', 'Cá này ăn được cả xương.'],
          ['あなた《まで》{私|わたし}を{疑|うたが}うのですか。', 'Ngay cả em cũng nghi ngờ anh sao?'],
        ],
      },
    ],
  },

  // ══ Nhóm 8 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-8',
    title: 'Danh từ hóa, đề tài, căn cứ, định nghĩa',
    points: [
      {
        id: 'n3-sa',
        pattern: 'A さ',
        meaning: 'Danh từ hóa tính từ — chỉ mức độ, tính chất',
        group: 'sa-mi',
        structures: ['Ai bỏ い + さ (いい → よさ)', 'Ana + さ'],
        explanation: ['Ví dụ: うれしさ, 暑さ, まじめさ.', goc(2, 3)],
        examples: [
          [
            '{大|おお}き《さ》は{違|ちが}うが、{君|きみ}と{同|おな}じかばんを{持|も}っているよ。',
            'Kích thước khác nhưng tôi có cái cặp giống cậu.',
          ],
          ['{子|こ}どもに{命|いのち}の{大切|たいせつ}《さ》を{教|おし}えなければならない。', 'Phải dạy trẻ sự quý giá của sinh mạng.'],
        ],
      },
      {
        id: 'n3-mi',
        pattern: 'A み',
        meaning: 'Danh từ hóa tính từ — chỉ trạng thái, cảm giác (chỉ với một số từ)',
        group: 'sa-mi',
        structures: ['Ai bỏ い + み; Ana + み'],
        explanation: ['Chỉ dùng với một số từ: 悲しみ, 弱み, 痛み, 強み, 真剣み.', 'Không nói: 大きみ, うれしみ.', goc(2, 3)],
        examples: [
          [
            '{戦争|せんそう}が{終|お}わった{今|いま}でも、この{国|くに}の{苦|くる}し《み》はまだ{続|つづ}いている。',
            'Chiến tranh kết thúc rồi mà nỗi khổ của đất nước này vẫn còn.',
          ],
          [
            '{田中|たなか}さんの{強|つよ}《み》は2か{国語|こくご}が{話|はな}せることです。',
            'Điểm mạnh của Tanaka là nói được 2 thứ tiếng.',
          ],
        ],
      },
      {
        id: 'n3-koto',
        pattern: '～こと',
        meaning: 'Việc…; về việc… (danh từ hóa mệnh đề)',
        structures: ['Thể thông thường + こと', 'Ana đổi だ thành な; N thêm の hoặc である'],
        explanation: [goc(2, 3)],
        examples: [
          ['{来週|らいしゅう}のテストの《こと》で、{質問|しつもん}があります。', 'Tôi có câu hỏi về bài kiểm tra tuần sau.'],
          ['{田中|たなか}さんが{入院|にゅういん}した《こと》を{知|し}っていますか。', 'Bạn có biết việc anh Tanaka nhập viện không?'],
        ],
      },
      {
        id: 'n3-no',
        pattern: '～の (danh từ hóa)',
        meaning: 'Biến cả mệnh đề thành danh từ (dùng thay cho こと)',
        structures: ['Thể thông thường + の', 'Ana, N đổi だ thành な'],
        explanation: [goc(2, 3)],
        examples: [
          [
            '{田中|たなか}さんに{電話|でんわ}する《の》をすっかり{忘|わす}れていました。',
            'Tôi quên béng việc gọi cho anh Tanaka.',
          ],
          ['{元気|げんき}な《の》が{一番|いちばん}だ。', 'Khỏe là nhất.'],
        ],
      },
      {
        id: 'n3-ni-kanshite',
        pattern: 'N に関して',
        meaning: 'Liên quan tới…; về… (cứng hơn について)',
        structures: ['N / mệnh đề + の + に関して / に関しては / に関しても / に関するN'],
        explanation: ['Dùng trong hội thảo, phát biểu, văn viết.', goc(2, 2)],
        examples: [['{農業|のうぎょう}《に{関|かん}する》{論文|ろんぶん}を{読|よ}む。', 'Đọc luận văn về nông nghiệp.']],
      },
      {
        id: 'n3-ni-tsuite',
        pattern: 'N について',
        meaning: 'Về… (nội dung đang nói, nghĩ, tìm hiểu)',
        structures: ['N + について / については / についても / についてのN'],
        explanation: ['Hay đi với 話す, 聞く, 考える, 書く, 調べる.', goc(2, 2)],
        examples: [
          ['{日本|にほん}{文化|ぶんか}《について》{勉強|べんきょう}する。', 'Học về văn hóa Nhật.'],
          ['「{受験|じゅけん}《についての》{注意|ちゅうい}」を{読|よ}む。', 'Đọc “Lưu ý về kỳ thi”.'],
        ],
      },
      {
        id: 'n3-ni-yoreba',
        pattern: 'N によれば / N によると',
        meaning: 'Theo… thì (nguồn tin gián tiếp)',
        group: 'ni-yoru',
        structures: ['N + によれば / によると'],
        explanation: ['Cuối câu thường có そうだ / らしい.', goc(2, 2)],
        examples: [
          ['{天気予報|てんきよほう}《によれば》、{明日|あした}は{晴|は}れるらしい。', 'Theo dự báo, mai trời nắng.'],
          [
            'さっきの{地震|じしん}は{速報|そくほう}《によると》{震度|しんど}3だそうだ。',
            'Theo tin nhanh, trận động đất vừa rồi độ 3.',
          ],
        ],
      },
      {
        id: 'n3-ni-yotte',
        pattern: 'N によって',
        meaning: 'Tùy theo…; bởi…, do… (phương tiện, nguyên nhân, chủ thể)',
        group: 'ni-yoru',
        structures: ['N + によって / によっては / により / によるN'],
        explanation: [goc(2, 2)],
        usages: [
          {
            title: 'Tùy theo…',
            examples: [['{人|ひと}《によって》{考|かんが}え{方|かた}が{違|ちが}います。', 'Tùy người mà cách nghĩ khác nhau.']],
          },
          {
            title: 'Bởi…, do… (phương tiện, nguyên nhân, chủ thể)',
            examples: [
              [
                'その{地震|じしん}《による》{被害|ひがい}は、{過去|かこ}{最大|さいだい}だった。',
                'Thiệt hại do trận động đất đó lớn nhất từ trước đến nay.',
              ],
            ],
          },
        ],
      },
      {
        id: 'n3-ni-oite',
        pattern: 'N において',
        meaning: 'Ở, tại, trong… (địa điểm, thời gian, lĩnh vực — trang trọng của で)',
        structures: ['N + において / においては / においても / におけるN'],
        explanation: [goc(5, 4)],
        examples: [
          ['{大阪|おおさか}《において》、{国際|こくさい}{会議|かいぎ}が{行|おこな}われた。', 'Hội nghị quốc tế đã diễn ra tại Osaka.'],
          ['{結果|けっか}はホームページ《において》{発表|はっぴょう}されます。', 'Kết quả sẽ được công bố trên trang web.'],
        ],
      },
      {
        id: 'n3-to-iu-n',
        pattern: 'N1 というN2',
        meaning: 'N2 tên là N1; cái gọi là…',
        group: 'to-iu',
        structures: ['N1 + という + N2 / もの / こと'],
        explanation: [goc(2, 4)],
        examples: [
          [
            'さっき{木村|きむら}さん《という》{人|ひと}から{電話|でんわ}がありましたよ。',
            'Lúc nãy có điện thoại từ người tên Kimura.',
          ],
          [
            'これは{日本|にほん}の{楽器|がっき}で「{尺八|しゃくはち}」《という》ものです。',
            'Đây là nhạc cụ Nhật gọi là shakuhachi.',
          ],
        ],
      },
      {
        id: 'n3-to-iu-no-wa',
        pattern: 'N というのは / っていうのは',
        meaning: '… có nghĩa là… (định nghĩa, giải thích một từ)',
        group: 'to-iu',
        structures: ['N + というのは + N1 のことだ', 'N + というのは + N1 という意味だ'],
        explanation: ['っていうのは là dạng nói.', goc(2, 4)],
        examples: [
          [
            'デジカメ《というのは》、デジタルカメラを{短|みじか}くした{言|い}い{方|かた}です。',
            'Dejikame là cách nói tắt của máy ảnh kỹ thuật số.',
          ],
        ],
      },
      {
        id: 'n3-to-iu-koto',
        pattern: '～ということ / ～というの',
        meaning: 'Việc (rằng)… (danh từ hóa cả cụm câu để giải thích)',
        group: 'to-iu',
        structures: ['Mệnh đề thể ngắn + ということ / というの (dạng nói: っていうこと / っていうの)'],
        explanation: [goc(2, 4)],
        examples: [
          [
            'リンさんが{帰国|きこく}する《ということ》を{聞|き}いて{驚|おどろ}きました。',
            'Tôi ngạc nhiên khi nghe tin Linh về nước.',
          ],
          ['{田中|たなか}さんが{医者|いしゃ}だ《というの》を{知|し}らなかった。', 'Tôi không biết việc anh Tanaka là bác sĩ.'],
        ],
      },
      {
        id: 'n3-to-iu-koto-da',
        pattern: '～ということだ',
        meaning: 'Tức là…; có nghĩa là…; nghe nói là… (truyền đạt, kết luận)',
        group: 'to-iu',
        structures: ['Thể thông thường (cả thể mệnh lệnh, ý hướng) + ということだ'],
        explanation: ['Với nghĩa “nghe nói”, trong thư dùng とのこと.', goc(4, 4)],
        usages: [
          {
            title: 'Nghe nói là… (truyền đạt lại)',
            examples: [
              [
                '{田中|たなか}さんから{電話|でんわ}があって、{少|すこ}し{遅|おく}れる《ということです》。',
                'Anh Tanaka gọi báo sẽ đến muộn một chút.',
              ],
            ],
          },
          {
            title: 'Tức là… (kết luận)',
            examples: [['{試験|しけん}の{結果|けっか}は70%、つまり{合格|ごうかく}《ということだ》。', 'Kết quả 70%, tức là đỗ.']],
          },
        ],
      },
    ],
  },

  // ══ Nhóm 9 ═════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-9',
    title: 'Nguyên nhân, kết quả và liên từ',
    intro: [
      'Bốn mẫu đầu (おかげで, せいで, かわりに, にかわって) nối trong một câu. Các mẫu còn lại là liên từ đứng đầu câu thứ hai (a。LIÊN TỪ b).',
    ],
    points: [
      {
        id: 'n3-okage-de',
        pattern: '～おかげで',
        meaning: 'Nhờ có… (kết quả tốt, biết ơn)',
        group: 'nguyen-nhan',
        structures: ['V / Ai thể thông thường; Ana + な; N + の + おかげで / おかげだ'],
        explanation: ['Dùng với kết quả xấu thì mang ý mỉa mai.', goc(4, 2)],
        examples: [['{先生|せんせい}の《おかげで》{合格|ごうかく}しました。', 'Nhờ thầy mà em đã đỗ.']],
      },
      {
        id: 'n3-sei-de',
        pattern: '～せいで',
        meaning: 'Tại vì… nên (nguyên nhân của kết quả xấu)',
        group: 'nguyen-nhan',
        structures: ['V / Ai thể thông thường; Ana + な; N + の + せいで / せいか / せいだ'],
        explanation: ['せいか: có lẽ vì…', goc(4, 2)],
        examples: [
          [
            'バスが{遅|おく}れた《せいで》、{約束|やくそく}の{時間|じかん}に{間|ま}に{合|あ}わなかった。',
            'Vì xe buýt trễ nên không kịp giờ hẹn.',
          ],
        ],
      },
      {
        id: 'n3-kawari-ni',
        pattern: '～かわりに',
        meaning: 'Thay vì…; bù lại, đổi lại (dùng được cả cho việc cá nhân)',
        group: 'thay',
        structures: ['V / Ai thể thông thường; Ana + な; N + の + かわりに', 'Đứng đầu câu: そのかわり(に)'],
        explanation: [
          '1. Thay vì… (không làm việc thường lệ mà làm việc khác).',
          '2. Bù lại, đổi lại.',
          goc(4, 2),
        ],
        examples: [
          ['ビールの《かわりに》ジュースを{飲|の}む。', 'Uống nước ép thay cho bia.'],
          ['{部長|ぶちょう}の《かわりに》、{私|わたし}が{行|い}きます。', 'Tôi sẽ đi thay trưởng phòng.'],
        ],
      },
      {
        id: 'n3-ni-kawatte',
        pattern: 'N にかわって / にかわり',
        meaning: 'Thay mặt N; đảm nhận vai trò của N',
        group: 'thay',
        structures: ['N + にかわって / にかわり'],
        explanation: ['Người / vật A đảm nhận vai trò của B. Không dùng cho yêu cầu cá nhân.', goc(4, 2)],
        wrong: [['ビールにかわってジュースをください。', 'Gọi đồ uống là yêu cầu cá nhân → ビールのかわりにジュースをください。']],
        examples: [
          [
            '{部長|ぶちょう}《にかわって》、{私|わたし}がご{挨拶|あいさつ}いたします。',
            'Tôi xin thay mặt trưởng phòng chào mọi người.',
          ],
        ],
      },
      {
        id: 'n3-tsumari',
        pattern: 'a。つまり b',
        meaning: 'Tóm lại; tức là (nói lại bằng cách khác)',
        structures: ['a。つまり a’ (a’ là a nói theo cách khác)'],
        explanation: [goc(4, 6)],
        examples: [
          [
            '{父|ちち}の{兄|あに}、《つまり》{私|わたし}の{伯父|おじ}は、{医者|いしゃ}をしている。',
            'Anh của bố, tức bác tôi, làm bác sĩ.',
          ],
          [
            '{田中|たなか}さんは{携帯|けいたい}もパソコンも{持|も}っていない。《つまり》、メールで{連絡|れんらく}できないのだ。',
            'Anh Tanaka không có điện thoại lẫn máy tính, tức là không liên lạc qua mail được.',
          ],
        ],
      },
      {
        id: 'n3-sono-tame',
        pattern: 'a。そのため(に) b',
        meaning: 'Vì vậy (a là lý do); để làm việc đó (a là mục đích)',
        group: 'ket-qua',
        structures: ['a。そのため(に) b'],
        explanation: [goc(4, 6)],
        usages: [
          {
            title: 'Vì vậy (a là lý do → b là kết quả)',
            examples: [
              [
                '{隣|となり}の{駅|えき}で{事故|じこ}があったらしい。《そのため》{電車|でんしゃ}が{遅|おく}れている。',
                'Hình như có tai nạn ở ga bên cạnh, vì vậy tàu trễ.',
              ],
            ],
          },
          {
            title: 'Để làm việc đó (a là mục đích)',
            examples: [
              [
                '{留学|りゅうがく}するつもりだ。《そのために》バイトしてお{金|かね}をためている。',
                'Tôi định du học nên đang làm thêm tiết kiệm tiền.',
              ],
            ],
          },
        ],
      },
      {
        id: 'n3-sono-kekka',
        pattern: 'a。その結果 b',
        meaning: 'Kết quả là… (a là việc đã làm trước đó)',
        group: 'ket-qua',
        structures: ['a。その結果 b'],
        explanation: ['a là việc đã làm trong quá khứ; kết quả tốt hay xấu tùy a.', goc(4, 6)],
        examples: [['{努力|どりょく}した。《その{結果|けっか}》{成功|せいこう}した。', 'Đã nỗ lực, kết quả là thành công.']],
      },
      {
        id: 'n3-nazenara',
        pattern: 'b。なぜなら(ば) a からです',
        meaning: 'Bởi vì… (nêu kết luận trước, lý do sau)',
        group: 'ket-qua',
        structures: [
          'Kết luận。なぜなら(ば) + lý do + からだ / からです',
          'Dạng khác: なぜかというと / どうしてかというと',
        ],
        explanation: [goc(4, 6)],
        examples: [
          [
            '{来週|らいしゅう}、{国|くに}に{帰|かえ}る{予定|よてい}です。《なぜならば》、{親友|しんゆう}の{結婚式|けっこんしき}に{出席|しゅっせき}する《からです》。',
            'Tuần sau tôi về nước, vì sẽ dự đám cưới bạn thân.',
          ],
        ],
      },
      {
        id: 'n3-dakedo',
        pattern: 'a。だけど b',
        meaning: 'Nhưng; tuy nhiên (a và b đối lập; văn nói)',
        group: 'nguoc-lai',
        structures: ['a。だけど b'],
        explanation: [goc(5, 6)],
        examples: [['{旅行|りょこう}に{行|い}きたい。《だけど》、ひまがない。', 'Muốn đi du lịch nhưng không có thời gian.']],
      },
      {
        id: 'n3-desukara',
        pattern: 'a。ですから b',
        meaning: 'Vì thế; do đó (b là kết quả đương nhiên hoặc phán đoán của người nói)',
        group: 'ket-qua',
        structures: ['a。ですから b (thân mật: だから)'],
        explanation: ['a là lý do.', goc(5, 6)],
        examples: [
          [
            '{明日|あした}から{旅行|りょこう}に{行|い}きます。《ですから》、{来週|らいしゅう}のパーティーには{出席|しゅっせき}できません。',
            'Từ mai tôi đi du lịch, vì thế không dự tiệc tuần sau được.',
          ],
        ],
      },
      {
        id: 'n3-tokoroga',
        pattern: 'a。ところが b',
        meaning: 'Thế nhưng; vậy mà (thực tế ngoài dự định, dự đoán)',
        group: 'nguoc-lai',
        structures: ['a。ところが b'],
        explanation: ['a là dự định, dự đoán; b là thực tế ngoài dự kiến.', goc(5, 6)],
        examples: [['{行|い}く{予定|よてい}だった。《ところが》、{行|い}けなくなった。', 'Định đi, vậy mà lại không đi được.']],
      },
      {
        id: 'n3-tokorode',
        pattern: 'a。ところで b',
        meaning: 'À mà…; nhân tiện… (chuyển chủ đề)',
        group: 'nguoc-lai',
        structures: ['a。ところで b'],
        explanation: [goc(5, 6)],
        examples: [
          [
            '{明日|あした}は{試験|しけん}でしょ。{頑張|がんば}ってね。《ところで》、{来週|らいしゅう}の{月曜日|げつようび}は{空|あ}いてる？',
            'Mai thi đúng không, cố lên nhé. À mà thứ hai tuần sau rảnh không?',
          ],
        ],
      },
      {
        id: 'n3-soreto',
        pattern: 'a。それと / あと b',
        meaning: 'Và…; còn nữa (thêm b vào a)',
        group: 'them',
        structures: ['a。それと b / a。あと b'],
        explanation: [goc(6, 6)],
        examples: [
          [
            'トマトを3{個|こ}{下|くだ}さい。《それと》、ピーマンも{一袋|ひとふくろ}{下|くだ}さい。',
            'Cho tôi 3 quả cà chua, thêm một túi ớt chuông.',
          ],
          ['{言|い}われたことはしました。《あと》、{何|なに}をすればいいですか。', 'Đã làm xong việc được giao, giờ làm gì nữa?'],
        ],
      },
      {
        id: 'n3-soretomo',
        pattern: 'a？それとも b？',
        meaning: 'Hay là… (hỏi lựa chọn giữa a và b)',
        group: 'them',
        structures: ['a？それとも b？'],
        explanation: [goc(6, 6)],
        examples: [
          ['コーヒーにしますか。《それとも》{紅茶|こうちゃ}にしますか。', 'Uống cà phê hay trà?'],
          ['{来週|らいしゅう}にしましょうか。《それとも》{再来週|さらいしゅう}がいいですか。', 'Để tuần sau hay tuần sau nữa?'],
        ],
      },
      {
        id: 'n3-sono-ue',
        pattern: 'a。その上 b',
        meaning: 'Hơn nữa; lại còn (a và b cùng chiều: tốt cùng tốt, xấu cùng xấu)',
        group: 'them',
        structures: ['a。その上 b'],
        explanation: [goc(6, 6)],
        examples: [
          ['おいしい。《その{上|うえ}》{安|やす}い。', 'Ngon, hơn nữa lại rẻ.'],
          ['{彼|かれ}は{欲張|よくば}りで、《その{上|うえ}》けちだった。', 'Hắn tham lam, lại còn bủn xỉn.'],
        ],
      },
    ],
  },

  // ══ Nhóm 10 ════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-10',
    title: 'Thời gian, giai đoạn, phạm vi',
    intro: [
      'Bốn mẫu cuối (上げる, 切る, かけ, たて) đều gắn vào V bỏ ます và cho biết hành động đang ở giai đoạn nào.',
    ],
    points: [
      {
        id: 'n3-ru-made',
        pattern: 'V るまで',
        meaning: 'Cho đến khi…',
        group: 'luc-nao',
        structures: ['V thể từ điển + まで'],
        explanation: [goc(5, 4)],
        examples: [
          ['{映画|えいが}が{始|はじ}まる《まで》30{分|ぷん}あります。', 'Còn 30 phút nữa phim mới bắt đầu.'],
          ['{連絡|れんらく}がある《まで》{待|ま}っています。', 'Chờ đến khi có liên lạc.'],
        ],
      },
      {
        id: 'n3-kara-ni-kakete',
        pattern: 'N1 から N2 にかけて',
        meaning: 'Từ khoảng N1 đến N2 (phạm vi thời gian, địa điểm nói chung)',
        structures: ['N1 + から + N2 + にかけて'],
        explanation: [goc(5, 4)],
        examples: [
          ['{明日|あした}は{昼|ひる}《から》{夕方|ゆうがた}《にかけて》{雨|あめ}でしょう。', 'Mai từ trưa đến chiều có lẽ mưa.'],
          ['{九州|きゅうしゅう}《から》{本州|ほんしゅう}《にかけて》{梅雨|つゆ}に{入|はい}りました。', 'Từ Kyushu đến Honshu đã vào mùa mưa.'],
        ],
      },
      {
        id: 'n3-ta-tokoro',
        pattern: 'V たところ',
        meaning: 'Sau khi làm… thì (kết quả là, phát hiện ra)',
        structures: ['V た + ところ'],
        explanation: [goc(6, 3)],
        examples: [
          [
            '{先生|せんせい}にテストの{範囲|はんい}を{聞|き}いた《ところ》、10{課|か}までだと{言|い}われた。',
            'Hỏi thầy phạm vi bài kiểm tra thì được bảo là đến bài 10.',
          ],
          [
            '{歯医者|はいしゃ}さんに{行|い}った《ところ》、ひどい{虫歯|むしば}になっていると{言|い}われた。',
            'Đi nha sĩ thì bị bảo sâu răng nặng.',
          ],
        ],
      },
      {
        id: 'n3-tokoro-datta',
        pattern: '(もう少しで) V るところだった',
        meaning: 'Suýt nữa thì… (thực tế đã không xảy ra)',
        group: 'luc-nao',
        structures: ['V thể từ điển + ところだった'],
        explanation: ['Hay đi với もう少しで, もうちょっとで, 危なく, あと少しで.', goc(6, 3)],
        examples: [
          ['もう{少|すこ}しで{遅刻|ちこく}する《ところだった》。', 'Suýt nữa thì đến muộn.'],
          ['もう{少|すこ}しで{乗|の}り{遅|おく}れる《ところだった》。', 'Suýt nữa thì lỡ tàu.'],
        ],
      },
      {
        id: 'n3-te-hajimete',
        pattern: 'V1 てはじめて V2',
        meaning: 'Phải đến khi… thì mới… (mới nhận ra, mới bắt đầu)',
        structures: ['V1 て + はじめて + V2'],
        explanation: [goc(6, 3)],
        examples: [
          [
            '{先生|せんせい}に{注意|ちゅうい}されて《はじめて》、{漢字|かんじ}の{間違|まちが}いに{気|き}がついた。',
            'Thầy nhắc rồi tôi mới để ý lỗi kanji.',
          ],
          [
            '{歌舞伎|かぶき}を{見|み}て《はじめて》、{日本|にほん}{文化|ぶんか}に{興味|きょうみ}を{持|も}った。',
            'Xem kabuki rồi tôi mới quan tâm đến văn hóa Nhật.',
          ],
        ],
      },
      {
        id: 'n3-uchi-ni',
        pattern: '～うちに',
        meaning: 'Trong lúc còn… (làm trước khi thay đổi); trong khi… thì (lúc nào không hay)',
        group: 'luc-nao',
        structures: ['V る / V ない / V ている / Ai / Ana な / N の + うちに'],
        explanation: [goc(6, 3)],
        usages: [
          {
            title: 'Trong lúc còn… (làm trước khi trạng thái thay đổi)',
            examples: [
              ['{明|あか}るい《うちに》{帰|かえ}りなさい。', 'Về khi trời còn sáng nhé.'],
              ['{忘|わす}れない《うちに》メモしておこう。', 'Ghi lại khi còn chưa quên.'],
            ],
          },
          {
            title: 'Trong khi… thì (thay đổi xảy ra lúc nào không hay)',
            examples: [
              [
                '{何度|なんど}も{聞|き}いている《うちに》、{歌詞|かし}を{覚|おぼ}えた。',
                'Nghe đi nghe lại rồi thuộc lời lúc nào không hay.',
              ],
            ],
          },
        ],
      },
      {
        id: 'n3-ageru',
        pattern: 'V 上げる / V 上がる',
        meaning: 'Làm xong; hoàn thành',
        structures: ['V bỏ ます + 上げる (tha động từ)', 'V bỏ ます + 上がる (tự động từ)'],
        explanation: [goc(5, 2)],
        examples: [
          ['レポートを{書|か}き《{上|あ}げた》。', 'Viết xong bài báo cáo.'],
          ['{料理|りょうり}ができ《{上|あ}がった》。', 'Món ăn đã làm xong.'],
        ],
      },
      {
        id: 'n3-kiru',
        pattern: 'V 切る / 切れる / 切れない',
        meaning: 'Làm hết; làm đến cùng (切れない: không thể làm hết)',
        structures: ['V bỏ ます + 切る / 切れる / 切れない (飲み切る, 読み切る, 売り切れる)'],
        explanation: [goc(5, 2)],
        examples: [['こんなにたくさんは{食|た}べ《{切|き}れない》。', 'Nhiều thế này không ăn hết được.']],
      },
      {
        id: 'n3-kake',
        pattern: 'V かけだ / かけのN / かける',
        meaning: 'Đang làm dở; mới làm giữa chừng',
        group: 'do-dang',
        structures: ['V bỏ ます + かけだ / かけのN / かける'],
        explanation: [goc(5, 2)],
        examples: [
          ['{読|よ}み《かけ》の{本|ほん}。', 'Quyển sách đang đọc dở.'],
          ['{食|た}べ《かけた》とき、{電話|でんわ}が{鳴|な}った。', 'Đang ăn dở thì điện thoại reo.'],
        ],
      },
      {
        id: 'n3-tate',
        pattern: 'V たてのN / たてだ',
        meaning: 'Vừa mới làm xong (còn mới, còn tươi)',
        group: 'do-dang',
        structures: ['V bỏ ます + たてのN / たてだ'],
        explanation: ['Giống V たばかり.', 'Không nói: 読みたて, 食べたて, 寝たて.', goc(5, 2)],
        examples: [
          ['{焼|や}き《たて》のパン。', 'Bánh mì vừa nướng.'],
          ['{炊|た}き《たて》のご{飯|はん}。', 'Cơm vừa nấu.'],
        ],
      },
    ],
  },

  // ══ Nhóm 11 ════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-11',
    title: 'Giả định và quyết định',
    points: [
      {
        id: 'n3-tatoe-temo',
        pattern: 'たとえ～ても',
        meaning: 'Dù cho… thì vẫn…',
        group: 'gia-dinh',
        structures: ['たとえ + V ても / Ai くても / Ana でも / N でも'],
        explanation: [goc(5, 5)],
        examples: [
          ['《たとえ》{反対|はんたい}され《ても》、{留学|りゅうがく}します。', 'Dù bị phản đối tôi vẫn đi du học.'],
          [
            '《たとえ》{元気|げんき}じゃなく《ても》、{家族|かぞく}への{手紙|てがみ}には{元気|げんき}だと{書|か}きます。',
            'Dù không khỏe, trong thư gửi nhà tôi vẫn viết là khỏe.',
          ],
        ],
      },
      {
        id: 'n3-moshi-ta-nara',
        pattern: 'もし～たなら',
        meaning: 'Nếu (đã)… thì… (giả định trái với sự thật)',
        group: 'gia-dinh',
        structures: ['もし + V た / V なかった / N だった / N でなかった + なら'],
        explanation: [goc(6, 1)],
        examples: [
          [
            '《もし》{試験|しけん}を{受|う}けていた《なら》、{合格|ごうかく}していたと{思|おも}う。',
            'Nếu đã dự thi thì tôi nghĩ đã đỗ.',
          ],
          [
            '《もし》{彼|かれ}が{社長|しゃちょう}でなかった《なら》、{会社|かいしゃ}はつぶれていたと{思|おも}う。',
            'Nếu anh ấy không làm giám đốc thì công ty đã phá sản.',
          ],
        ],
      },
      {
        id: 'n3-moshi-toshitemo',
        pattern: 'もし～たとしても',
        meaning: 'Cho dù giả sử… thì cũng… (khả năng xảy ra rất thấp)',
        group: 'gia-dinh',
        structures: ['もし + thể thông thường + としても'],
        explanation: [goc(6, 1)],
        examples: [
          ['《もし》{休|やす}みが{取|と}れた《としても》、{旅行|りょこう}に{行|い}かない。', 'Dù có xin nghỉ được thì cũng không đi du lịch.'],
          ['《もし》お{金|かね}がたくさんあった《としても》、そんなものは{買|か}わない。', 'Dù có nhiều tiền cũng không mua thứ đó.'],
        ],
      },
      {
        id: 'n3-moshimo',
        pattern: 'もしも～なら / ても',
        meaning: 'Nếu như…; giả sử… (nhấn mạnh hơn もし)',
        group: 'gia-dinh',
        structures: ['もしも + điều kiện (なら / たら / ても)'],
        explanation: [goc(6, 1)],
        examples: [
          ['《もしも》{生|う}まれ{変|か}われる《なら》、{男|おとこ}になりたい。', 'Nếu được đầu thai lại, tôi muốn làm con trai.'],
          [
            '《もしも》{地震|じしん}が{起|お}き《ても》、この{家|いえ}は{丈夫|じょうぶ}だから{倒|たお}れない。',
            'Giả sử có động đất, nhà này chắc nên không đổ.',
          ],
        ],
      },
      {
        id: 'n3-koto-ni-natte-iru',
        pattern: 'V る / V ない ことになっている',
        meaning: 'Được quy định là…; đã được quyết định là… (do tổ chức, người khác quyết)',
        group: 'koto-ni',
        structures: ['V thể từ điển / V ない + ことになっている'],
        explanation: ['Tính khách quan.', goc(6, 2)],
        examples: [
          [
            '{入学式|にゅうがくしき}はこのホールで{行|おこな}われる《ことになっている》。',
            'Lễ nhập học được quy định tổ chức tại hội trường này.',
          ],
        ],
      },
      {
        id: 'n3-koto-ni-shite-iru',
        pattern: 'V る / V ない ことにしている',
        meaning: 'Tự mình quyết định và duy trì làm… thành thói quen',
        group: 'koto-ni',
        structures: ['V thể từ điển / V ない + ことにしている'],
        explanation: [goc(6, 2)],
        examples: [['{毎朝|まいあさ}ジョギングする《ことにしている》。', 'Tôi duy trì chạy bộ mỗi sáng.']],
      },
      {
        id: 'n3-koto-wa-ga',
        pattern: 'V ることは V るが',
        meaning: 'Làm thì cũng làm được, nhưng… (công nhận một phần, kèm hạn chế)',
        structures: ['V + ことは + V (lặp lại) + が / けど'],
        explanation: [goc(6, 2)],
        examples: [
          ['{話|はな}せる《ことは》{話|はな}せます《が》、{上手|じょうず}じゃありません。', 'Nói thì nói được, nhưng không giỏi.'],
          ['ピアノは{弾|ひ}ける《ことは》{弾|ひ}ける《が》、{下手|へた}だ。', 'Piano thì chơi được nhưng dở.'],
        ],
      },
      {
        id: 'n3-nai-koto-wa-nai',
        pattern: 'V ないことはない',
        meaning: 'Không phải là không… (cũng có thể, nhưng không tích cực)',
        structures: ['V ない / Ai くない + ことはない'],
        explanation: [goc(6, 2)],
        examples: [['{食|た}べない《ことはない》けど、あまり{好|す}きじゃない。', 'Không phải là không ăn, nhưng không thích lắm.']],
      },
    ],
  },

  // ══ Nhóm 12 ════════════════════════════════════════════════════════════
  {
    id: 'n3-nhom-12',
    title: 'わけ và phủ định mạnh',
    intro: ['Bốn trạng từ cuối (決して, まったく, めったに, 少しも / ちっとも) luôn đi với thể phủ định.'],
    points: [
      {
        id: 'n3-wake-da',
        pattern: '～わけだ',
        meaning: 'Thảo nào…; hèn chi… (biết lý do nên thấy hợp lý)',
        group: 'wake',
        structures: ['Thể thông thường + わけだ', 'Ana + な; N + な / である'],
        explanation: ['Cũng dùng với nghĩa “tức là…” (suy ra từ điều vừa nói).', goc(6, 4)],
        usages: [
          {
            title: 'Thảo nào…; đương nhiên là…',
            examples: [
              ['{暑|あつ}い《わけだ》。{気温|きおん}が36{度|ど}もある。', 'Nóng là phải, nhiệt độ tận 36 độ.'],
              ['なるほど、それで{元気|げんき}がない《わけだ》。', 'Thì ra vậy, thảo nào trông ủ rũ.'],
            ],
          },
          {
            title: 'Tức là…',
            examples: [
              [
                '5パーセント{引|び}きというと、1{万|まん}{円|えん}の{物|もの}は9500{円|えん}になる《わけ》ですね。',
                'Giảm 5% tức là món 10.000 yên còn 9.500 yên nhỉ.',
              ],
            ],
          },
        ],
      },
      {
        id: 'n3-wake-dewa-nai',
        pattern: '～わけではない',
        meaning: 'Không hẳn là…; không phải là… (phủ định một phần, làm mềm câu)',
        group: 'wake',
        structures: ['Thể thông thường + わけではない', 'Ana + な; N + な / だという'],
        explanation: [goc(6, 4)],
        examples: [
          ['きらいな《わけではない》が、{肉|にく}はあまり{食|た}べない。', 'Không phải là ghét nhưng tôi ít ăn thịt.'],
          [
            'テレビは{見|み}ない《わけではない》が、{音楽|おんがく}を{聞|き}いているほうが{多|おお}い。',
            'Không phải không xem TV, nhưng nghe nhạc nhiều hơn.',
          ],
        ],
      },
      {
        id: 'n3-wake-ga-nai',
        pattern: '～わけがない',
        meaning: 'Không đời nào…; chắc chắn không thể… (phủ định hoàn toàn)',
        group: 'wake',
        structures: ['Thể thông thường + わけがない', 'Ana + な; N + の'],
        explanation: [goc(6, 4)],
        examples: [
          ['あの{強|つよ}い{相手|あいて}に{勝|か}てる《わけがない》。', 'Không đời nào thắng nổi đối thủ mạnh đó.'],
          ['{昨日|きのう}{買|か}ったんだから、{古|ふる}い《わけがない》よ。', 'Mới mua hôm qua, làm gì có chuyện cũ.'],
        ],
      },
      {
        id: 'n3-wake-ni-wa-ikanai',
        pattern: 'V る / V ない わけにはいかない',
        meaning: 'Không thể làm… (vì hoàn cảnh, đạo lý); dạng ない: buộc phải làm',
        group: 'wake',
        structures: ['V thể từ điển / V ない + わけにはいかない'],
        explanation: [
          'V るわけにはいかない: không thể làm (vì lý do, hoàn cảnh, đạo lý).',
          'V ないわけにはいかない: không thể không làm; buộc phải làm.',
          goc(6, 4),
        ],
        examples: [
          ['{大事|だいじ}な{会議|かいぎ}があるので、{休|やす}む《わけにはいかない》。', 'Có cuộc họp quan trọng nên không thể nghỉ.'],
          ['{社長|しゃちょう}の{命令|めいれい}だから、{従|したが}わない《わけにはいかない》。', 'Lệnh giám đốc nên không thể không theo.'],
        ],
      },
      {
        id: 'n3-kesshite',
        pattern: '決して～ない',
        meaning: 'Tuyệt đối không; không bao giờ (kèm ý quyết tâm)',
        group: 'phu-dinh',
        structures: ['決して + thể phủ định'],
        explanation: [goc(6, 5)],
        examples: [
          ['{私|わたし}は《{決|けっ}して》{夢|ゆめ}をあきらめません。', 'Tôi sẽ không bao giờ từ bỏ ước mơ.'],
          ['{日本語|にほんご}は《{決|けっ}して》{難|むずか}しくない。', 'Tiếng Nhật chẳng khó chút nào.'],
        ],
      },
      {
        id: 'n3-mattaku',
        pattern: 'まったく～ない',
        meaning: 'Hoàn toàn không',
        group: 'phu-dinh',
        structures: ['まったく + thể phủ định'],
        explanation: [goc(6, 5)],
        examples: [
          ['{私|わたし}は《まったく》{泳|およ}げない。', 'Tôi hoàn toàn không biết bơi.'],
          [
            '{彼|かれ}が{怒|おこ}っている{理由|りゆう}は、{私|わたし}には《まったく》わからない。',
            'Tôi hoàn toàn không hiểu vì sao anh ấy giận.',
          ],
        ],
      },
      {
        id: 'n3-mettani',
        pattern: 'めったに～ない',
        meaning: 'Hiếm khi; ít khi',
        group: 'phu-dinh',
        structures: ['めったに + thể phủ định'],
        explanation: [goc(6, 5)],
        examples: [['{彼|かれ}は《めったに》{病気|びょうき}をしない。', 'Anh ấy hiếm khi ốm.']],
      },
      {
        id: 'n3-sukoshimo',
        pattern: '少しも / ちっとも ～ない',
        meaning: 'Một chút cũng không (ちっとも là dạng nói)',
        group: 'phu-dinh',
        structures: ['少しも / ちっとも + thể phủ định'],
        explanation: [goc(6, 5)],
        examples: [
          [
            'あの{人|ひと}が{話|はな}す{英語|えいご}は《{少|すこ}しも》わからない。',
            'Tiếng Anh người đó nói tôi chẳng hiểu chút nào.',
          ],
        ],
      },
    ],
  },

  // ══ 13 · Phân biệt các mẫu dễ nhầm ═════════════════════════════════════
  {
    id: 'n3-phan-biet',
    title: 'Phân biệt các mẫu dễ nhầm',
    intro: [
      'Ôn lại các mẫu hay bị nhầm với nhau. Bài luyện tập cuối mục do ứng dụng soạn thêm theo đúng các quy tắc dưới đây (tài liệu gốc không đưa bài luyện tập vào).',
    ],
    points: [
      {
        id: 'n3-pb-mitai-rashii-ppoi',
        pattern: 'みたい – らしい – っぽい',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['みたい', 'Giống như (nhưng không phải)', '{春|はる}みたい: mùa đông mà ấm như mùa xuân'],
            ['N らしい', 'Đúng chất của N (đúng là N)', '{春|はる}らしい: đang mùa xuân và đúng chất mùa xuân'],
            ['っぽい', 'Hơi hướng về N, thường mang ý chê', '{子供|こども}っぽい: trẻ con (người lớn mà như trẻ con)'],
          ]),
        ],
      },
      {
        id: 'n3-pb-okage-sei',
        pattern: 'おかげで – せいで',
        explanation: ['Cả hai đều chỉ nguyên nhân.'],
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['おかげで', 'Kết quả tốt (cảm ơn)', '{先生|せんせい}のおかげで{合格|ごうかく}しました'],
            ['せいで', 'Kết quả xấu (đổ lỗi)', 'バスが{遅|おく}れたせいで{間|ま}に{合|あ}わなかった'],
          ]),
        ],
      },
      {
        id: 'n3-pb-tsuite-kanshite',
        pattern: 'について – に関して',
        explanation: ['Cùng nghĩa “về”.'],
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['について', 'Nói chuyện hằng ngày', '{日本|にほん}{文化|ぶんか}について{勉強|べんきょう}する'],
            ['に関して', 'Trang trọng: văn viết, hội thảo', '{農業|のうぎょう}に{関|かん}する{論文|ろんぶん}'],
          ]),
        ],
      },
      {
        id: 'n3-pb-totte-taishite',
        pattern: 'にとって – に対して',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['にとって', 'Đứng ở vị trí của N để đánh giá', '{私|わたし}にとって{大切|たいせつ} = với tôi thì quan trọng'],
            ['に対して', 'Hành động, thái độ hướng tới N', '{私|わたし}に{対|たい}して{厳|きび}しい = nghiêm khắc với tôi'],
          ]),
        ],
      },
      {
        id: 'n3-pb-kawari',
        pattern: 'かわりに – にかわって',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['かわりに', 'Thay vì, đổi lại (dùng được cả cho việc cá nhân)', 'ビールのかわりにジュースをください'],
            ['にかわって', 'Người / vật này đảm nhận vai trò của người / vật kia', '{部長|ぶちょう}にかわってご{挨拶|あいさつ}いたします'],
          ]),
        ],
        notes: ['Mẹo: gọi đồ uống chỉ dùng のかわりに.'],
      },
      {
        id: 'n3-pb-koto-ni',
        pattern: 'ことになっている – ことにしている',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['ことになっている', 'Người khác, tổ chức quyết (quy định)', 'ホールで{行|おこな}われることになっている'],
            ['ことにしている', 'Bản thân quyết (thói quen)', '{毎朝|まいあさ}ジョギングすることにしている'],
          ]),
        ],
        notes: ['Mẹo: なる = tự nhiên thành; する = mình làm.'],
      },
      {
        id: 'n3-pb-you-ni-suru-naru',
        pattern: 'ようにする – ようになる',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['ようにする', 'Cố gắng tạo thói quen', '{毎日|まいにち}{歩|ある}くようにする'],
            ['ようになる', 'Khả năng, trạng thái tự thay đổi', '{泳|およ}げるようになった'],
          ]),
        ],
      },
      {
        id: 'n3-pb-you-ni-tame-ni',
        pattern: 'ように (mục đích) – ために',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['ように', 'Đi với động từ không chủ ý, thể khả năng, phủ định', '{合格|ごうかく}できるように'],
            ['ために', 'Đi với động từ có chủ ý', '{合格|ごうかく}するために'],
          ]),
        ],
      },
      {
        id: 'n3-pb-uchi-made-tokoro',
        pattern: 'うちに – まで – ところだった',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['うちに', 'Tranh thủ trước khi thay đổi', '{明|あか}るいうちに'],
            ['まで', 'Mốc kết thúc', '{暗|くら}くなるまで'],
            ['ところだった', 'Suýt xảy ra', 'もう{少|すこ}しで{遅刻|ちこく}するところだった'],
          ]),
        ],
      },
      {
        id: 'n3-pb-wake',
        pattern: 'わけだ – わけではない – わけがない – わけにはいかない',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['わけだ', 'Thảo nào / tức là', '{暑|あつ}いわけだ'],
            ['わけではない', 'Không hẳn là (phủ định một phần)', 'きらいなわけではない'],
            ['わけがない', 'Không đời nào (phủ định hoàn toàn)', '{勝|か}てるわけがない'],
            ['わけにはいかない', 'Không thể (vì hoàn cảnh)', '{休|やす}むわけにはいかない'],
          ]),
        ],
      },
      {
        id: 'n3-pb-yokatta',
        pattern: 'ばよかった – ばよかったのに – といいなあ',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['ばよかった', 'Tiếc về việc của mình (quá khứ)', 'もっと{早|はや}く{出|で}ればよかった'],
            ['ばよかったのに', 'Tiếc, trách nhẹ người khác (quá khứ)', 'あなたも{行|い}けばよかったのに'],
            ['といいなあ', 'Mong cho tương lai', 'うまく{話|はな}せるといいなあ'],
          ]),
        ],
      },
      {
        id: 'n3-pb-dakedo-tokoro',
        pattern: 'だけど – ところが – ところで',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['だけど', 'Đối lập thông thường', '{行|い}きたい。だけど、ひまがない'],
            ['ところが', 'Thực tế bất ngờ so với dự định', '{行|い}く{予定|よてい}だった。ところが、{行|い}けなくなった'],
            ['ところで', 'Chuyển chủ đề', 'ところで、{来週|らいしゅう}は{空|あ}いてる？'],
          ]),
        ],
        notes: ['ところが: vế sau không dùng ý chí, mệnh lệnh của người nói.'],
      },
      {
        id: 'n3-pb-soreto',
        pattern: 'それと – それとも – その上',
        tables: [
          table('', ['Mẫu', 'Khi dùng', 'Ví dụ'], [
            ['それと', 'Thêm vào (danh sách)', 'トマトを3{個|こ}ください。それと、ピーマンも'],
            ['それとも', 'Hoặc (chỉ dùng trong câu hỏi lựa chọn)', 'コーヒーにしますか。それとも{紅茶|こうちゃ}にしますか'],
            ['その上', 'Hơn nữa (đánh giá cùng chiều)', 'おいしい。その{上|うえ}{安|やす}い'],
          ]),
        ],
      },
    ],
    quiz: {
      instruction:
        'Chọn từ thích hợp điền vào （　　）. Câu hỏi do ứng dụng soạn theo các quy tắc phân biệt ở trên; lời giải thích hiện sau khi trả lời.',
      items: [
        // ── みたい – らしい – っぽい
        [
          '{冬|ふゆ}なのに、{今日|きょう}は{春|はる}（　　）{暖|あたた}かい。',
          ['みたいに', 'らしく', 'っぽく'],
          'みたいに',
          '',
          'Đang mùa đông mà ấm như mùa xuân — giống nhưng không phải → みたいに.',
        ],
        [
          '4{月|がつ}になって、やっと{春|はる}（　　）{天気|てんき}になった。',
          ['らしい', 'みたいな', 'っぽい'],
          'らしい',
          '',
          'Đang là mùa xuân và thời tiết đúng chất mùa xuân → らしい.',
        ],
        [
          '{彼|かれ}はもう30{歳|さい}なのに、{考|かんが}え{方|かた}が{子供|こども}（　　）。',
          ['っぽい', 'らしい'],
          'っぽい',
          '',
          'Người lớn mà suy nghĩ hơi hướng trẻ con, ý chê → っぽい. 子供らしい là khen một đứa trẻ đúng chất trẻ con.',
        ],
        [
          '{最近|さいきん}、{年|とし}のせいか{忘|わす}れ（　　）なった。',
          ['っぽく', 'らしく', 'みたいに'],
          'っぽく',
          '',
          'V bỏ ます + っぽい: hay…, dễ… (忘れっぽい = hay quên). らしい và みたい không gắn vào V bỏ ます.',
        ],
        // ── おかげで – せいで
        [
          '{友達|ともだち}が{手伝|てつだ}ってくれた（　　）、{仕事|しごと}が{早|はや}く{終|お}わった。',
          ['おかげで', 'せいで'],
          'おかげで',
          '',
          'Kết quả tốt, có ý biết ơn → おかげで.',
        ],
        [
          '{寝坊|ねぼう}した（　　）、{電車|でんしゃ}に{乗|の}り{遅|おく}れた。',
          ['せいで', 'おかげで'],
          'せいで',
          '',
          'Kết quả xấu, đổ lỗi cho nguyên nhân → せいで.',
        ],
        [
          '{薬|くすり}を{飲|の}んだ（　　）、{熱|ねつ}が{下|さ}がった。',
          ['おかげで', 'せいで'],
          'おかげで',
          '',
          'Hạ sốt là kết quả tốt → おかげで.',
        ],
        // ── にとって – に対して
        [
          'この{写真|しゃしん}は{私|わたし}（　　）{一番|いちばん}{大切|たいせつ}な{宝物|たからもの}です。',
          ['にとって', 'に対して'],
          'にとって',
          '',
          'Đứng ở vị trí của “tôi” để đánh giá (quan trọng) → にとって.',
        ],
        [
          'お{客様|きゃくさま}（　　）、そんな{失礼|しつれい}な{言|い}い{方|かた}をしてはいけません。',
          ['に対して', 'にとって'],
          'に対して',
          '',
          'Thái độ, cách nói hướng tới khách → に対して.',
        ],
        [
          '{外国人|がいこくじん}（　　）、{日本語|にほんご}の{敬語|けいご}はとても{難|むずか}しい。',
          ['にとって', 'に対して'],
          'にとって',
          '',
          'Đánh giá “khó” từ lập trường của người nước ngoài → にとって.',
        ],
        // ── かわりに – にかわって
        [
          'すみません、ビール（　　）ジュースをください。',
          ['のかわりに', 'にかわって'],
          'のかわりに',
          '',
          'Gọi đồ uống là yêu cầu cá nhân — chỉ dùng のかわりに.',
        ],
        [
          '{料理|りょうり}を{作|つく}ってもらう（　　）、{私|わたし}がお{皿|さら}を{洗|あら}います。',
          ['かわりに', 'にかわって'],
          'かわりに',
          '',
          'Nghĩa “đổi lại, bù lại”, đứng sau động từ → かわりに. にかわって chỉ đi sau danh từ.',
        ],
        // ── ことになっている – ことにしている
        [
          'この{寮|りょう}では、{夜|よる}10{時|じ}{以降|いこう}は{外出|がいしゅつ}しない（　　）。',
          ['ことになっている', 'ことにしている'],
          'ことになっている',
          '',
          'Quy định của ký túc xá, do người khác quyết → ことになっている.',
        ],
        [
          '{健康|けんこう}のために、{毎晩|まいばん}11{時|じ}までに{寝|ね}る（　　）。',
          ['ことにしている', 'ことになっている'],
          'ことにしている',
          '',
          'Bản thân tự quyết để giữ sức khỏe, thành thói quen → ことにしている.',
        ],
        // ── ようにする – ようになる
        [
          '{毎日|まいにち}{練習|れんしゅう}したので、{泳|およ}げる（　　）。',
          ['ようになった', 'ようにした'],
          'ようになった',
          '',
          'Thể khả năng, từ không thể thành có thể → ようになる.',
        ],
        [
          '{健康|けんこう}のために、エレベーターを{使|つか}わないで{階段|かいだん}を{使|つか}う（　　）。',
          ['ようにしている', 'ようになっている'],
          'ようにしている',
          '',
          'Cố gắng tạo thói quen → ようにする.',
        ],
        // ── ように – ために
        [
          '{後|うし}ろの{席|せき}の{人|ひと}にも{聞|き}こえる（　　）、マイクを{使|つか}います。',
          ['ように', 'ために'],
          'ように',
          '',
          '聞こえる là động từ không chủ ý → ように.',
        ],
        [
          '{留学|りゅうがく}する（　　）、お{金|かね}をためています。',
          ['ために', 'ように'],
          'ために',
          '',
          '留学する là động từ có chủ ý → ために.',
        ],
        // ── うちに – まで – ところだった
        [
          '{雨|あめ}が{降|ふ}らない（　　）、{洗濯物|せんたくもの}を{取|と}り{込|こ}もう。',
          ['うちに', 'まで', 'ところだった'],
          'うちに',
          '',
          'Tranh thủ làm trước khi trời mưa → うちに.',
        ],
        [
          '{母|はは}が{帰|かえ}ってくる（　　）、{家|いえ}で{待|ま}っていた。',
          ['まで', 'うちに', 'ところだった'],
          'まで',
          '',
          'Mốc kết thúc của việc chờ → まで.',
        ],
        [
          '{道|みち}を{渡|わた}るとき、{危|あぶ}なく{車|くるま}にひかれる（　　）。',
          ['ところだった', 'うちに', 'まで'],
          'ところだった',
          '',
          'Suýt bị xe đâm nhưng thực tế không xảy ra; 危なく hay đi với ところだった.',
        ],
        // ── わけだ – わけではない – わけがない – わけにはいかない
        [
          '{毎日|まいにち}3{時間|じかん}も{練習|れんしゅう}しているのか。どうりで{上手|じょうず}な（　　）。',
          ['わけだ', 'わけがない', 'わけではない', 'わけにはいかない'],
          'わけだ',
          '',
          'Biết lý do (luyện 3 tiếng mỗi ngày) nên thấy hợp lý: thảo nào giỏi → わけだ.',
        ],
        [
          'あまり{練習|れんしゅう}していない{人|ひと}が{優勝|ゆうしょう}できる（　　）。',
          ['わけがない', 'わけだ', 'わけではない', 'わけにはいかない'],
          'わけがない',
          '',
          'Phủ định hoàn toàn: không đời nào vô địch được → わけがない.',
        ],
        [
          '{本当|ほんとう}はやりたくないが、{上司|じょうし}に{頼|たの}まれた{仕事|しごと}だから、{断|ことわ}る（　　）。',
          ['わけにはいかない', 'わけがない', 'わけではない', 'わけだ'],
          'わけにはいかない',
          '',
          'Không muốn làm nhưng vì hoàn cảnh (cấp trên nhờ) nên không thể từ chối → わけにはいかない.',
        ],
        [
          '{肉|にく}が{嫌|きら}いな（　　）が、{魚|さかな}のほうが{好|す}きだ。',
          ['わけではない', 'わけがない', 'わけだ', 'わけにはいかない'],
          'わけではない',
          '',
          'Phủ định một phần: không hẳn là ghét thịt → わけではない.',
        ],
        // ── ばよかった – ばよかったのに – といいなあ
        [
          '{今朝|けさ}{寝坊|ねぼう}して{会議|かいぎ}に{遅|おく}れた。{目覚|めざ}まし{時計|どけい}を（　　）。',
          ['かけておけばよかった', 'かけておくといいなあ', 'かけておいたらいいなあ'],
          'かけておけばよかった',
          '',
          'Tiếc về việc của chính mình trong quá khứ (đã đến muộn) → ばよかった. といいなあ / たらいいなあ là mong cho tương lai.',
        ],
        [
          '（{試験|しけん}に{落|お}ちた{友達|ともだち}に）だから、もっと{早|はや}く{勉強|べんきょう}を{始|はじ}め（　　）。',
          ['ればよかったのに', 'ればよかった', 'るといいなあ'],
          'ればよかったのに',
          '',
          'Nói với bạn: tiếc và trách nhẹ người khác → ばよかったのに.',
        ],
        [
          '{明日|あした}の{遠足|えんそく}、{晴|は}れる（　　）。',
          ['といいなあ', 'ばよかった', 'ばよかったのに'],
          'といいなあ',
          '',
          'Mong cho tương lai (ngày mai) → といいなあ. Hai mẫu kia tiếc về quá khứ.',
        ],
        // ── だけど – ところが – ところで
        [
          '{天気予報|てんきよほう}では{晴|は}れると{言|い}っていた。（　　）、{午後|ごご}から{大雨|おおあめ}になった。',
          ['ところが', 'ところで', 'それとも'],
          'ところが',
          '',
          'Thực tế (mưa to) trái với điều đã dự đoán (trời nắng) → ところが.',
        ],
        [
          '{会議|かいぎ}の{話|はなし}は{以上|いじょう}です。（　　）、{田中|たなか}さんのお{子|こ}さんはお{元気|げんき}ですか。',
          ['ところで', 'ところが', 'その上'],
          'ところで',
          '',
          'Chuyển sang chủ đề khác → ところで.',
        ],
        [
          'このかばんはデザインがいい。（　　）、{少|すこ}し{重|おも}い。',
          ['だけど', 'ところで', 'その上'],
          'だけど',
          '',
          'Đối lập thông thường (đẹp nhưng nặng) → だけど. その上 chỉ nối hai ý cùng chiều.',
        ],
        [
          '{一緒|いっしょ}に{行|い}きたい。（　　）、{今日|きょう}は{時間|じかん}がないから、{明日|あした}にしよう。',
          ['だけど', 'ところが'],
          'だけど',
          '',
          'Vế sau là ý chí của người nói (明日にしよう) — ところが không dùng được → だけど.',
        ],
        // ── それと – それとも – その上
        [
          'お{茶|ちゃ}にしますか。（　　）、コーヒーにしますか。',
          ['それとも', 'それと', 'その上'],
          'それとも',
          '',
          'Câu hỏi lựa chọn giữa hai thứ → それとも.',
        ],
        [
          'この{部屋|へや}は{広|ひろ}くて{明|あか}るい。（　　）、{家賃|やちん}も{安|やす}い。',
          ['その上', 'それとも', 'それと'],
          'その上',
          '',
          'Hai ý đánh giá cùng chiều (tốt thêm tốt) → その上.',
        ],
        [
          'パンを{二|ふた}つください。（　　）、{牛乳|ぎゅうにゅう}も{一本|いっぽん}お{願|ねが}いします。',
          ['それと', 'それとも', 'その上'],
          'それと',
          '',
          'Thêm một món vào danh sách yêu cầu → それと.',
        ],
      ],
    },
  },
];

/**
 * Các mẫu GẦN NGHĨA đến mức câu trắc nghiệm ý nghĩa bày cả hai ra thì chọn cái nào cũng
 * đúng: "Càng… càng…" (ほど / ば～ほど), "ngay cả" (さえ / まで), "về" (について / に関して),
 * "tức là" (つまり / ということだ)… Chúng không bao giờ làm đáp án nhiễu cho nhau.
 */
export const N3_SYNONYMS: readonly (readonly string[])[] = [
  ['n3-masu-you-ni', 'n3-to-ii-naa'],
  ['n3-hodo-cang', 'n3-ba-hodo'],
  ['n3-sae', 'n3-n-made'],
  ['n3-koto', 'n3-no', 'n3-to-iu-koto'],
  ['n3-ni-kanshite', 'n3-ni-tsuite'],
  ['n3-wa-mochiron', 'n3-bakarika'],
  ['n3-meirei-to-iwareru', 'n3-tekure-to-tanomareru'],
  ['n3-sono-tame', 'n3-desukara'],
  ['n3-tatoe-temo', 'n3-moshi-toshitemo'],
  ['n3-ageru', 'n3-kiru'],
  ['n3-mattaku', 'n3-sukoshimo'],
  ['n3-wake-dewa-nai', 'n3-nai-koto-wa-nai'],
  ['n3-wake-dewa-nai', 'n3-towa-kagiranai'],
  ['n3-tsumari', 'n3-to-iu-koto-da'],
  ['n3-n-datte', 'n3-to-iu-koto-da'],
];

/**
 * Nhóm dễ nhầm mà ngay trong câu ví dụ của tài liệu thường THAY ĐƯỢC cho nhau, nên bài
 * "Điền vào chỗ trống" không lấy đáp án nhiễu trong cùng nhóm: 「骨まで食べられる」 nói
 * 「骨さえ」 cũng đúng, 「女みたいだ」 nói 「女っぽい」 cũng được, 「お金がないわりに」 nói
 * 「お金がないくせに」 cũng thành câu. Phân biệt các nhóm này là việc của mục 13 — câu ở
 * đó soạn riêng cho đúng một đáp án.
 */
export const N3_INTERCHANGEABLE_GROUPS: readonly string[] = [
  'bi-dong',
  'truyen-dat',
  'tiec-nuoi',
  'giong',
  'doi-voi',
  'trai-nguoc',
  'sa-mi',
  'thay',
  'ket-qua',
  'nguoc-lai',
  'gia-dinh',
  'phu-dinh',
];

/**
 * Mẫu khác nhóm mà phần điền vào có thể y hệt nhau: 「無理をしない（ことだ）」 cũng đọc
 * được là ということだ hay こと; 「食べない（ことはない）」 trùng chữ với ～ることはない;
 * 「まるで～ない」 thay bằng まったく／決して／少しも vẫn đúng.
 */
export const N3_SAME_FORM: readonly (readonly string[])[] = [
  ['n3-koto-da', 'n3-to-iu-koto-da', 'n3-koto'],
  ['n3-koto-wa-nai', 'n3-nai-koto-wa-nai'],
  ['n3-marude', 'n3-kesshite', 'n3-mattaku', 'n3-mettani', 'n3-sukoshimo'],
  ['n3-ru-made', 'n3-n-made'],
];

export const N3_SECTIONS: readonly N4Section[] = buildSections(RAW_SECTIONS);
