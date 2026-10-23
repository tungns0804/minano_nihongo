// SINH TỰ ĐỘNG bởi scripts/import-vnjpclub.mjs — đừng sửa tay, sửa script rồi chạy lại.
// Nguồn: https://www.vnjpclub.com/ngu-phap-n4/ (mỗi mục dẫn link về trang gốc của nó).

import type { RawSection } from './grammar-book.build';

export const VNJPCLUB_RAW_SECTIONS: readonly RawSection[] = [
  {
    "id": "vj-joshi-de-n4",
    "title": "Trợ từ で",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/joshi-de-n4.html",
    "points": [
      {
        "id": "vj-joshi-de-n4",
        "pattern": "Trợ từ で",
        "meaning": "Bằng…, tại…, vì…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Công dụng",
              "Cấu tạo với ～で",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Nơi xảy ra hành động",
                "N（{場所|ばしょ}） + で",
                "{図書館|としょかん}で{勉強|べんきょう}する",
                "Khác với に (tồn tại/đến)."
              ],
              [
                "Phương tiện/công cụ",
                "N（{手段|しゅだん}） + で",
                "{電車|でんしゃ}で{行|い}く／{箸|はし}で{食|た}べる",
                "“bằng/đi bằng/dùng”."
              ],
              [
                "Lý do/Nguyên nhân",
                "N（{原因|げんいん}） + で",
                "{雨|あめ}で{試合|しあい}が{中止|ちゅうし}だ",
                "Thường với sự cố/thiên tai/tắc nghẽn."
              ],
              [
                "Phạm vi/số lượng",
                "N + で",
                "{三人|さんにん}で{旅行|りょこう}する",
                "“với/bao gồm”."
              ],
              [
                "Giá/chi phí",
                "Số tiền + で",
                "{千|せん}{円|えん}で{買|か}える",
                "“với giá …”."
              ],
              [
                "Thời điểm kết thúc/giới hạn",
                "N（{時|とき}） + で",
                "{今日|きょう}で{終|お}わりだ",
                "“tính đến/đến … là hết”."
              ],
              [
                "Trạng thái/điều kiện",
                "N／Aな + で",
                "{元気|げんき}で{働|はたら}く",
                "Biểu thị trạng thái khi thực hiện."
              ],
              [
                "Dạng て của だ",
                "N／Aな + で、～",
                "{学生|がくせい}で、{独身|どくしん}で…",
                "Nối mệnh đề với danh/な-tính từ."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{公園|こうえん}《で》{子|こ}どもたちが{遊|あそ}んでいる。",
            "Bọn trẻ đang chơi ở công viên."
          ],
          [
            "バス《で》{空港|くうこう}へ{行|い}きます。",
            "Đi bằng xe buýt đến sân bay."
          ],
          [
            "{事故|じこ}《で》{電車|でんしゃ}が{遅|おく}れた。",
            "Vì tai nạn nên tàu bị trễ."
          ],
          [
            "{四人|よにん}《で》{食事|しょくじ}に{行|い}こう。",
            "Đi ăn với 4 người nhé."
          ],
          [
            "これ、{千|せん}{五|ご}{百|ひゃく}{円|えん}《で》{買|か}いました。",
            "Cái này tôi mua với giá 1.500 yên."
          ],
          [
            "{今回|こんかい}《で》{３回|さんかい}{目|め}だ。",
            "Tính lần này là lần thứ ba."
          ],
          [
            "{安全|あんぜん}《で》{静|しず}かな{町|まち}です。",
            "Là một thị trấn an toàn và yên tĩnh."
          ],
          [
            "{彼|かれ}は{医者|いしゃ}《で》、{研究|けんきゅう}{者|しゃ}《でも》ある。",
            "Anh ấy là bác sĩ và cũng là nhà nghiên cứu."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-joshi-ni-n4",
    "title": "Trợ từ に",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/joshi-ni-n4.html",
    "points": [
      {
        "id": "vj-joshi-ni-n4",
        "pattern": "Trợ từ に",
        "meaning": "Ở…, đến…, cho…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Công dụng",
              "Cấu trúc với ～に",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Thời điểm xác định",
                "Thời điểm + に",
                "{３時|さんじ}に{会|あ}う／{月曜日|げつようび}に{始|はじ}まる",
                "Không dùng に với từ chỉ thời gian mơ hồ: {今日|きょう}・{明日|あした}・{来週|らいしゅう}（thường bỏ に）."
              ],
              [
                "Đích/hướng",
                "Nơi chốn + に + {行|い}く/{来|く}る/{戻|もど}る",
                "{学校|がっこう}に{行|い}く",
                "に (đích) vs へ (hướng, mơ hồ)."
              ],
              [
                "Vị trí tồn tại",
                "Nơi chốn + に + Nがある/いる",
                "{机|つくえ}に{本|ほん}がある／{庭|にわ}に{猫|ねこ}がいる",
                "ある（vật vô tri）, いる（sinh vật)."
              ],
              [
                "Mục đích",
                "Vます + に + {行|い}く/{来|く}る/{帰|かえ}る",
                "{本|ほん}を{買|か}いに{行|い}く",
                "Dùng ます-bỏ ます; không dùng Vる hay Vて."
              ],
              [
                "Tân ngữ gián tiếp (người nhận)",
                "N（người） + に + あげる/くれる/もらう/{教|おし}える/{聞|き}く",
                "{彼|かれ}に{教|おし}える／{先生|せんせい}に{聞|き}く",
                "Hướng tác động “cho/nhận/hỏi” tới ai."
              ],
              [
                "Tác nhân trong bị động",
                "N（tác nhân） + に + V（{受身|うけみ}）",
                "{犬|いぬ}に{噛|か}まれた",
                "Người/tác nhân chủ động dùng に; bởi công cụ dùng によって/で."
              ],
              [
                "Kết quả thay đổi/mục tiêu",
                "N/na + に + なる／する",
                "{医者|いしゃ}になる／{部屋|へや}をきれいにする",
                "Aい dùng “く（なる/する）”: {高|たか}くなる."
              ],
              [
                "Tần suất/đơn vị",
                "Đơn vị + に + số lần/lượng",
                "{一日|いちにち}に{三回|さんかい}",
                "“mỗi/cho mỗi”."
              ],
              [
                "Điểm tiếp xúc/đính kèm",
                "N + に + V ({付|つ}ける/{置|お}く/{掛|か}ける)",
                "{壁|かべ}に{絵|え}を{掛|か}ける",
                "Cho thấy điểm gắn/đặt lên đâu."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{午後|ごご}{３時|さんじ}《に》{会議|かいぎ}が{始|はじ}まります。",
            "Cuộc họp bắt đầu lúc 3 giờ chiều."
          ],
          [
            "{駅|えき}《に》{着|つ}いたら{電話|でんわ}して。",
            "Đến ga thì gọi nhé."
          ],
          [
            "{机|つくえ}《に》パソコンがあります。",
            "Có máy tính trên bàn."
          ],
          [
            "{日本語|にほんご}を{勉強|べんきょう}し《に》{日本|にほん}へ{行|い}く。",
            "Tôi đi Nhật để học tiếng Nhật."
          ],
          [
            "{先生|せんせい}《に》{質問|しつもん}する。",
            "Hỏi giáo viên."
          ],
          [
            "{友達|ともだち}《に》{写真|しゃしん}を{送|おく}ってもらった。",
            "Được bạn gửi ảnh cho."
          ],
          [
            "{彼|かれ}は{医者|いしゃ}《に》なった。",
            "Anh ấy đã trở thành bác sĩ."
          ],
          [
            "{壁|かべ}《に》{地図|ちず}を{貼|は}る。",
            "Dán bản đồ lên tường."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-joshi-mo-n4",
    "title": "Trợ từ も",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/joshi-mo-n4.html",
    "points": [
      {
        "id": "vj-joshi-mo-n4",
        "pattern": "Trợ từ も",
        "meaning": "Cũng…, tận…, cả …",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu trúc",
              "Ý nghĩa ngắn",
              "Ví dụ ngắn",
              "Ghi chú"
            ],
            "rows": [
              [
                "N + も",
                "{名詞|めいし} + も",
                "cũng / ngay cả",
                "{私|わたし}も{行|い}きます。",
                "Thay thế các trợ từ khác (は/が/を) trong ngữ cảnh nhấn mạnh “cũng”."
              ],
              [
                "AもBも",
                "N1 + も N2 + も + V/A",
                "cả A lẫn B",
                "{英語|えいご}も{日本語|にほんご}も{話|はな}せる。",
                "Phủ định: AもBも～ない = A cũng không, B cũng không."
              ],
              [
                "{疑問|ぎもん}{語|ご} + も + {否定|ひてい}",
                "{何|なに}も / {誰|だれ}も / どこも + ～ない",
                "không … nào",
                "{誰|だれ}も{来|こ}なかった。",
                "Với khẳng định sẽ mang nghĩa “ai cũng/mọi…”, nhưng hạn chế ({例|れい}: {誰|だれ}もが)."
              ],
              [
                "{数量|すうりょう} + も",
                "{数|かず}・{量|りょう} + も",
                "tận…, những…",
                "{三時間|さんじかん}も{待|ま}った。",
                "Nhấn mạnh mức độ nhiều/ít ngoài dự đoán."
              ],
              [
                "{回数|かいすう} + も",
                "{何|なん}{回|かい}/{何|なん}{度|ど} + も",
                "nhiều lần",
                "{何|なん}{度|ど}も{練習|れんしゅう}した。",
                "Thói quen/nhấn mạnh tần suất."
              ],
              [
                "どこも/いつも{等|など}",
                "{場所|ばしょ}/{時間|じかん}の{疑問|ぎもん}{語|ご} + も",
                "khắp/luôn (khẳng định)",
                "どこもきれいだ。",
                "“luôn/khắp” khi đi với khẳng định (phổ quát)."
              ],
              [
                "{助詞|じょし} + も",
                "に/へ/から/で + も",
                "đến cả… cũng",
                "{彼|かれ}にも{知|し}らせた。",
                "Gắn sau các trợ từ khác để thêm nghĩa “cũng”."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}《も》{行|い}きます。",
            "Tôi cũng đi."
          ],
          [
            "{彼|かれ}は{英語|えいご}《も》{日本語|にほんご}《も》{話|はな}せる。",
            "Anh ấy nói được cả tiếng Anh lẫn tiếng Nhật."
          ],
          [
            "{誰|だれ}《も》{来|こ}なかった。",
            "Không ai đến cả."
          ],
          [
            "{一度|いちど}《も》ミスをしていない。",
            "Chưa mắc lỗi lần nào."
          ],
          [
            "{三時間|さんじかん}《も》{待|ま}たされた。",
            "Bị bắt đợi tận 3 tiếng."
          ],
          [
            "この{町|まち}はどこ《も》{静|しず}かだ。",
            "Thành phố này chỗ nào cũng yên tĩnh."
          ],
          [
            "{彼|かれ}《にも》メールを{送|おく}っておきました。",
            "Ngay cả cho anh ấy tôi cũng đã gửi mail."
          ],
          [
            "{水|みず}《も》{食料|しょくりょう}《も》{足|た}りない。",
            "Nước lẫn lương thực đều thiếu."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ta-koto-ga-aru",
    "title": "～たことがある",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ta-koto-ga-aru.html",
    "points": [
      {
        "id": "vj-ta-koto-ga-aru",
        "pattern": "～たことがある",
        "meaning": "Đã từng…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu tạo",
              "Ý nghĩa",
              "Ví dụ cấu trúc"
            ],
            "rows": [
              [
                "Vたことがある",
                "Động từ quá khứ (た{形|かたち}) + ことがある",
                "Đã từng (kinh nghiệm)",
                "{日本|にほん}へ{行|い}ったことがある"
              ],
              [
                "Vたことがない",
                "Vた + ことがない",
                "Chưa từng",
                "{刺身|さしみ}を{食|た}べたことがない"
              ],
              [
                "{何|なん}{回|かい}かVたことがある",
                "Phó từ số lượng + Vたことがある",
                "Đã từng vài lần",
                "{何|なん}{回|かい}か{見|み}たことがある"
              ],
              [
                "{一度|いちど}もVたことがない",
                "{一度|いちど}も + Vたことがない",
                "Chưa một lần nào",
                "{一度|いちど}も{会|あ}ったことがない"
              ],
              [
                "Vることがある",
                "Vる + ことがある",
                "Thỉnh thoảng/có lúc (khác nghĩa)",
                "{雨|あめ}で{遅|おく}れることがある"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{富士山|ふじさん}に{登|のぼ}っ《たことがある》？",
            "Bạn đã từng leo núi Phú Sĩ chưa?"
          ],
          [
            "{北海道|ほっかいどう}へは{行|い}っ《たことがありません》。",
            "Tôi chưa từng đi Hokkaido."
          ],
          [
            "{彼|かれ}と{会|あ}っ《たことがある》{気|き}がする。",
            "Tôi cảm giác là đã từng gặp anh ấy."
          ],
          [
            "この{映画|えいが}は{何|なん}{回|かい}か{見|み}《たことがある》。",
            "Bộ phim này tôi đã từng xem vài lần."
          ],
          [
            "{一度|いちど}も{海外|かいがい}に{行|い}っ《たことがない》。",
            "Tôi chưa từng đi nước ngoài lần nào."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ta-toki-ni",
    "title": "～たときに",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ta-toki-ni.html",
    "points": [
      {
        "id": "vj-ta-toki-ni",
        "pattern": "～たときに",
        "meaning": "Khi…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu trúc với ～たとき(に)",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-た + とき(に)",
                "{家|いえ}に{帰|かえ}ったときに、{電話|でんわ}した。",
                "Diễn tả “lúc đã làm xong V thì …” (thời điểm sau khi hoàn tất hành động V)"
              ],
              [
                "So sánh",
                "V-る + とき(に)",
                "{家|いえ}に{帰|かえ}るときに、{電話|でんわ}した。",
                "“Lúc đang/trước khi về nhà thì …” (thời điểm chưa hoàn tất V)"
              ],
              [
                "Dạng có/không に",
                "V-た + とき / ときに",
                "{到着|とうちゃく}したとき(に){連絡|れんらく}してください。",
                "に có/không đều được; có に nhấn mạnh thời điểm"
              ],
              [
                "Khác",
                "N のとき(に) / Aい とき(に) / Aな なとき(に)",
                "{子|こ}どものときに / {忙|いそが}しいときに",
                "Mở rộng chung với とき; mục này tập trung vào V-た + とき(に)"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{日本|にほん}に《{来|き}たときに》、たくさんの{友|とも}だちができた。",
            "Khi đã đến Nhật, tôi đã có nhiều bạn."
          ],
          [
            "{家|いえ}に《{帰|かえ}ったときに》、{鍵|かぎ}がないことに{気|き}づいた。",
            "Khi về đến nhà rồi, tôi mới nhận ra là không có chìa khóa."
          ],
          [
            "{会議|かいぎ}が《{終|お}わったときに》、{部長|ぶちょう}に{呼|よ}ばれた。",
            "Khi cuộc họp kết thúc, tôi bị trưởng phòng gọi."
          ],
          [
            "{小|ちい}さい《ときに》、よくこの{公園|こうえん}で{遊|あそ}んだ。",
            "Khi còn nhỏ, tôi hay chơi ở công viên này."
          ],
          [
            "{出張|しゅっちょう}で{大阪|おおさか}に《{行|い}ったときに》、{本場|ほんば}のお{好|この}み{焼|や}きを{食|た}べた。",
            "Khi đi công tác đến Osaka, tôi đã ăn okonomiyaki chính gốc."
          ],
          [
            "{問題|もんだい}が《{起|お}きたときに》、すぐに{連絡|れんらく}してください。",
            "Khi có vấn đề phát sinh rồi, hãy liên lạc ngay."
          ]
        ],
        "group": "vj-1"
      }
    ]
  },
  {
    "id": "vj-ta-tokoro",
    "title": "～たところ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ta-tokoro.html",
    "points": [
      {
        "id": "vj-ta-tokoro",
        "pattern": "～たところ",
        "meaning": "Vừa mới…, ngay sau khi…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Sử dụng"
            ],
            "rows": [
              [
                "Kết quả/phát hiện",
                "V-た + ところ、…",
                "{問|と}い{合|あ}わせてみたところ、{在庫|ざいこ}はなかった。",
                "Sau khi làm V thì biết/kết quả là …"
              ],
              [
                "Ngay sau khi",
                "V-た + ところ、…",
                "ドアを{開|あ}けたところ、{風|かぜ}が{入|はい}ってきた。",
                "Ngay khi vừa làm V, sự việc A xảy ra"
              ],
              [
                "Cụm liên quan",
                "V-た + ところに/へ/を",
                "{出|で}かけようとしたところに、{電話|でんわ}が{鳴|な}った。",
                "Mô tả bối cảnh thời điểm; khác nghĩa tùy trợ từ"
              ],
              [
                "Mẫu khác biệt",
                "V-た + ところで、…",
                "{今|いま}さら{謝|あやま}ったところで、{遅|おそ}い。",
                "Nghĩa “dẫu có … cũng (vô ích)”; KHÔNG phải mẫu đang học"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{店|みせ}に《{問|と}い{合|あ}わせてみたところ》、すでに{売|う}り{切|き}れていた。",
            "Khi tôi thử liên hệ với cửa hàng, thì đã bán hết mất rồi."
          ],
          [
            "{申|もう}し{込|こ}ん《だところ》、{締|し}め{切|き}られていた。",
            "Sau khi nộp đăng ký thì biết là đã hết hạn."
          ],
          [
            "{医者|いしゃ}に{診|み}てもらっ《たところ》、インフルエンザだと{言|い}われた。",
            "Khám bác sĩ xong thì được nói là bị cúm."
          ],
          [
            "{窓|まど}を{開|あ}け《たところ》、{冷|つめ}たい{風|かぜ}が{吹|ふ}き{込|こ}んできた。",
            "Vừa mở cửa sổ thì gió lạnh thổi ùa vào."
          ],
          [
            "{上司|じょうし}に{相談|そうだん}し《たところ》、{計画|けいかく}を{見直|みなお}すように{言|い}われた。",
            "Sau khi bàn với sếp, tôi được bảo xem xét lại kế hoạch."
          ],
          [
            "{帰|かえ}ろうとし《たところに》、{彼|かれ}から{電話|でんわ}が{来|き}た。",
            "Đúng lúc tôi định về thì nhận được điện thoại từ anh ấy."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ru-toki-ni",
    "title": "～るときに",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ru-toki-ni.html",
    "points": [
      {
        "id": "vj-ru-toki-ni",
        "pattern": "～るときに",
        "meaning": "Khi…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mục",
              "Cấu trúc",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-る + とき(に)",
                "{出|で}かけるとき(に)",
                "Diễn tả thời điểm trước/đúng lúc làm V (thường là tương lai/thói quen)"
              ],
              [
                "Động từ (quá khứ)",
                "V-た + とき(に)",
                "{出|で}かけたとき(に)",
                "Thời điểm sau khi đã làm V"
              ],
              [
                "Tính từ -い",
                "Aい + とき(に)",
                "{忙|いそが}しいとき(に)",
                "“Khi A…”"
              ],
              [
                "Tính từ -な",
                "Aな + とき(に)",
                "{暇|ひま}なとき(に)",
                "Nối trực tiếp với な"
              ],
              [
                "Danh từ",
                "N + の + とき(に)",
                "{子|こ}どものとき(に)",
                "Danh từ + の"
              ],
              [
                "Trợ từ に",
                "とき + に",
                "{出|で}かけるときに",
                "“に” nhấn mạnh điểm thời gian; có thể lược"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{日本|にほん}へ《{行|い}くときに》、カメラを{買|か}った。",
            "Mua máy ảnh trước khi đi Nhật."
          ],
          [
            "{日本|にほん}へ《{行|い}ったときに》、カメラを{買|か}った。",
            "Mua máy ảnh khi đã đến Nhật."
          ],
          [
            "《{出|で}かけるとき》は、{電気|でんき}を{消|け}してください。",
            "Khi ra ngoài, hãy tắt điện."
          ],
          [
            "《{子|こ}どものときに》、よく{川|かわ}で{遊|あそ}んだ。",
            "Khi còn nhỏ, tôi hay chơi ở sông."
          ],
          [
            "《{忙|いそが}しいとき》ほど、{休憩|きゅうけい}が{大事|だいじ}だ。",
            "Càng bận thì càng quan trọng việc nghỉ ngơi."
          ],
          [
            "《{困|こま}ったときには》、{遠慮|えんりょ}なく{相談|そうだん}してください。",
            "Khi gặp khó khăn, hãy cứ trao đổi."
          ]
        ],
        "group": "vj-1"
      }
    ]
  },
  {
    "id": "vj-ru-tokoro",
    "title": "～るところ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ru-tokoro.html",
    "points": [
      {
        "id": "vj-ru-tokoro",
        "pattern": "～るところ",
        "meaning": "Đang chuẩn bị làm…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mục",
              "Cấu trúc",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Sắp làm",
                "V-る + ところ (だ/です)",
                "{出|で}かけるところだ",
                "Ngay trước khi bắt đầu"
              ],
              [
                "Đúng lúc … thì …",
                "V-る + ところに",
                "{出|で}かけるところに{電話|でんわ}が{来|き}た",
                "Biến cố “đến với mình” đúng lúc"
              ],
              [
                "Bị/được (giữa lúc)",
                "V-る + ところを",
                "{出|で}かけるところを{呼|よ}び{止|と}められた",
                "Nhấn bị tác động, bị gián đoạn"
              ],
              [
                "Bối cảnh",
                "V-る + ところで",
                "{今|いま}、{出発|しゅっぱつ}するところで…",
                "Nêu tình huống tại thời điểm đó"
              ],
              [
                "Đối chiếu",
                "V-ている/V-た + ところ",
                "{読|よ}んでいるところ／{読|よ}んだところ",
                "Đang làm / vừa mới xong"
              ]
            ]
          }
        ],
        "examples": [
          [
            "これから《{食|た}べるところだ》。",
            "Tôi sắp ăn đây."
          ],
          [
            "《{出発|しゅっぱつ}するところに》、{上司|じょうし}から{電話|でんわ}が{入|はい}った。",
            "Đúng lúc sắp xuất phát thì nhận điện thoại của sếp."
          ],
          [
            "《{寝|ね}るところを》、{子|こ}どもに{起|お}こされた。",
            "Đang chuẩn bị ngủ thì bị con đánh thức."
          ],
          [
            "{今|いま}、{会議|かいぎ}{室|しつ}へ《{入|はい}るところです》。あとで{掛|か}け{直|なお}します。",
            "Giờ tôi sắp vào phòng họp. Tôi sẽ gọi lại sau."
          ],
          [
            "《{帰|かえ}るところだった》が、{急用|きゅうよう}ができた。",
            "Tôi đã định về ngay lúc này thì có việc gấp."
          ],
          [
            "《{話|はな}し{始|はじ}めるところで》、マイクが{故障|こしょう}した。",
            "Đúng lúc chuẩn bị bắt đầu nói thì micro hỏng."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-iru",
    "title": "～ている",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-iru.html",
    "points": [
      {
        "id": "vj-te-iru",
        "pattern": "～ている",
        "meaning": "Đang…, lặp lại, trạng thái",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～ている",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Hiện tại tiếp diễn",
                "Vて + いる",
                "{今|いま}、{昼|ひる}ごはんを{食|た}べている。",
                "Đang diễn ra lúc nói."
              ],
              [
                "Phủ định/Quá khứ",
                "Vて + いない／いた",
                "まだ{決|き}めていない／{昔|むかし}ピアノを{習|なら}っていた。",
                "Phủ định/Quá khứ của trạng thái/tiếp diễn."
              ],
              [
                "Hội thoại",
                "Vて + る（{省略|しょうりゃく}）",
                "{今|いま}、{食|た}べてる。",
                "Dạng rút gọn khẩu ngữ; lịch sự: 〜てます."
              ],
              [
                "Danh từ hóa",
                "Vて + いる + N",
                "{働|はたら}いている{人|ひと}",
                "Bổ nghĩa danh từ."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{今|いま}、{会議|かいぎ}をし《ています》。",
            "Tôi đang họp bây giờ."
          ],
          [
            "{電気|でんき}がつい《ている》から、{誰|だれ}かが{中|なか}にい《る》はずだ。",
            "Đèn đang sáng nên chắc có ai trong đó."
          ],
          [
            "{彼|かれ}はIT{企業|きぎょう}で{働|はたら}い《ている》。",
            "Anh ấy làm việc ở công ty IT."
          ],
          [
            "このボタンは{壊|こわ}れ《ている》ので、{押|お}さないでください。",
            "Nút này đang hỏng, xin đừng bấm."
          ],
          [
            "{週末|しゅうまつ}はよく{山|やま}に{登|のぼ}っ《ている》。",
            "Cuối tuần tôi thường leo núi."
          ],
          [
            "{田中|たなか}さんのことを{知|し}っ《ている》？",
            "Bạn có biết anh Tanaka không?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-iru-tokoro",
    "title": "～ているところ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-iru-tokoro.html",
    "points": [
      {
        "id": "vj-te-iru-tokoro",
        "pattern": "～ているところ",
        "meaning": "Đang lúc…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～ているところ",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Mệnh đề chính",
                "Vている + ところ（だ／です）",
                "{今|いま}、{出|で}かけているところです。",
                "“Đúng lúc đang...”. Thêm {今|いま}／ちょうど để nhấn mạnh."
              ],
              [
                "Kết hợp trợ từ",
                "Vている + ところに／へ／を／で",
                "{食|た}べているところに{電話|でんわ}が{来|き}た。",
                "Diễn tả sự kiện chen vào đúng lúc đang làm."
              ],
              [
                "So với ところ khác",
                "Vるところ／Vたところ",
                "{今|いま}から{行|い}くところ／たった{今|いま}{着|つ}いたところ",
                "Trước khi bắt đầu / vừa xong."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{今|いま}、{会議|かいぎ}をし《ているところです》。{後|あと}でかけ{直|なお}します。",
            "Bây giờ tôi đang họp. Tôi sẽ gọi lại sau."
          ],
          [
            "ちょうど{出|で}かけ《ているところに》、{部長|ぶちょう}が{来|き}た。",
            "Đúng lúc tôi đang ra ngoài thì trưởng phòng đến."
          ],
          [
            "{説明|せつめい}し《ているところを》、{邪魔|じゃま}しないでください。",
            "Đang giải thích, xin đừng làm phiền."
          ],
          [
            "{面接|めんせつ}を{受|う}け《ているところで》、{携帯|けいたい}の{電源|でんげん}は{切|き}ってください。",
            "Trong lúc đang phỏng vấn, vui lòng tắt điện thoại."
          ],
          [
            "{今|いま}、{料理|りょうり}を{作|つく}っ《ているところ》だから、{手|て}を{洗|あら}って{待|ま}ってね。",
            "Tôi đang nấu ăn, nên rửa tay rồi đợi nhé."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-no-aida-ni",
    "title": "～の間に",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/no-aida-ni.html",
    "points": [
      {
        "id": "vj-no-aida-ni",
        "pattern": "～の間に",
        "meaning": "Trong lúc…, trong khi…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Kiểu",
              "Cấu tạo với ～の{間|あいだ}に ｜",
              "Ví dụ cấu trúc",
              "Ý nghĩa/chú thích"
            ],
            "rows": [
              [
                "Danh từ (N)",
                "N + の{間|あいだ}に + V",
                "{夏休|なつやす}みの{間|あいだ}に{旅行|りょこう}した。",
                "Trong khoảng thời gian N, xảy ra sự kiện 1 lần/ít lần"
              ],
              [
                "Mệnh đề (liên quan)",
                "Vている + {間|あいだ}に + V ｜",
                "{子供|こども}が{寝|ね}ている{間|あいだ}に{片付|かたづ}けた。",
                "Sự kiện xen vào trong thời gian “đang ~”"
              ],
              [
                "Danh từ hoá",
                "N + の{間|あいだ} + は／、",
                "{会議|かいぎ}の{間|あいだ}は{席|せき}を{立|た}たないでください。",
                "So sánh: {間|あいだ} (xuyên suốt) vs {間|あいだ}に (tại một lúc trong khoảng)"
              ],
              [
                "Đại từ chỉ khoảng",
                "その{間|あいだ}に／この{間|あいだ}に ｜",
                "その{間|あいだ}に{連絡|れんらく}があった。",
                "Cụm cố định “khi đó/trong lúc đó”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{夏休|なつやす}み《の{間|あいだ}に》、{祖父母|そふぼ}の{家|いえ}へ{行|い}った。",
            "Trong kỳ nghỉ hè, tôi đã đến nhà ông bà."
          ],
          [
            "{子供|こども}が{寝|ね}ている《{間|あいだ}に》、{洗濯|せんたく}を{済|す}ませた。",
            "Trong lúc con đang ngủ, tôi giặt đồ xong."
          ],
          [
            "{留守|るす}《の{間|あいだ}に》、{泥棒|どろぼう}が{入|はい}った。",
            "Khi vắng nhà, trộm đã đột nhập."
          ],
          [
            "{会議|かいぎ}《の{間|あいだ}に》、{一度|いちど}だけ{電話|でんわ}が{鳴|な}った。",
            "Trong lúc họp, điện thoại reo một lần."
          ],
          [
            "{在学|ざいがく}《の{間|あいだ}に》、{交換|こうかん}{留学|りゅうがく}を{経験|けいけん}した。",
            "Trong thời gian còn đi học, tôi trải nghiệm trao đổi du học."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-iru-aida-ni",
    "title": "～ている間に",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-iru-aida-ni.html",
    "points": [
      {
        "id": "vj-te-iru-aida-ni",
        "pattern": "～ている間に",
        "meaning": "Trong lúc… thì…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu tạo với ～ている{間|あいだ}に ｜",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vている + {間|あいだ}に ｜",
                "{昼寝|ひるね}している{間|あいだ}に{電話|でんわ}があった。",
                "Trong khoảng thời gian đang làm A, B xảy ra (thường là sự kiện chớp nhoáng)."
              ],
              [
                "Danh từ",
                "Nの + {間|あいだ}に ｜",
                "{会議|かいぎ}の{間|あいだ}にメモを{取|と}った。",
                "Trong lúc (khoảng N) thì B xảy ra."
              ],
              [
                "Phân biệt",
                "〜{間|あいだ}と 〜{間|あいだ}に",
                "{勉強|べんきょう}している{間|あいだ}は{静|しず}かにして。／{勉強|べんきょう}している{間|あいだ}に{雨|あめ}が{降|ふ}った。",
                "｜ {間|あいだ}: B kéo dài suốt A; {間|あいだ}に: B xảy ra tại một điểm trong A."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}が{寝|ね}《ている{間|あいだ}に》、{雪|ゆき}が{降|ふ}った。",
            "Trong lúc tôi đang ngủ thì trời đã đổ tuyết."
          ],
          [
            "{父|ちち}が{留守|るす}にし《ている{間|あいだ}に》、{泥棒|どろぼう}が{入|はい}った。",
            "Trong lúc bố vắng nhà thì trộm đã vào."
          ],
          [
            "{映画|えいが}を{見|み}《ている{間|あいだ}に》、スマホが{鳴|な}った。",
            "Trong lúc đang xem phim, điện thoại reo."
          ],
          [
            "{子|こ}どもが{遊|あそ}ん《でいる{間|あいだ}に》、{夕飯|ゆうはん}を{作|つく}ってしまった。",
            "Trong lúc bọn trẻ chơi, tôi đã nấu xong bữa tối."
          ],
          [
            "{会議|かいぎ}《の{間|あいだ}に》、{重要|じゅうよう}なメールが{届|とど}いた。",
            "Trong cuộc họp, một email quan trọng đã đến."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-chuu",
    "title": "～中",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/chuu.html",
    "points": [
      {
        "id": "vj-chuu",
        "pattern": "～中",
        "meaning": "Đang… / trong lúc…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Danh từ + 中",
                "N + 中（ちゅう／じゅう） ｜",
                "Trong suốt…, trong khi đang…, khắp…, toàn bộ…",
                "{授業|じゅぎょう}{中|ちゅう}[じゅぎょうちゅう/]"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{今|いま}、{会議|かいぎ}《{中|ちゅう}》です。",
            "Hiện đang trong cuộc họp."
          ],
          [
            "{授業|じゅぎょう}《{中|ちゅう}》にスマホを{使|つか}ってはいけません。",
            "Không được dùng điện thoại trong giờ học."
          ],
          [
            "{日本|にほん}では、{桜|さくら}は{3月|さんがつ}から{4月|しがつ}《{中|ちゅう}》に{咲|さ}きます。",
            "Ở Nhật, hoa anh đào nở suốt từ tháng 3 đến tháng 4."
          ],
          [
            "{一日|いちにち}《{中|じゅう}》{雨|あめ}が{降|ふ}っていた。",
            "Mưa suốt cả ngày."
          ],
          [
            "{世界|せかい}《{中|じゅう}》の{人々|ひとびと}が{注目|ちゅうもく}している。",
            "Mọi người trên khắp thế giới đang chú ý."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ta-bakari",
    "title": "～たばかり",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ta-bakari.html",
    "points": [
      {
        "id": "vj-ta-bakari",
        "pattern": "～たばかり",
        "meaning": "Vừa mới…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Động từ thể た",
                "Vた + ばかり",
                "Vừa mới… / Mới chỉ…",
                "{日本|にほん}に{来|き}たばかりです。 Tôi vừa mới đến Nhật."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{彼|かれ}は{会社|かいしゃ}に{入|はい}っ《たばかり》なので、まだ{仕事|しごと}に{慣|な}れていない。",
            "Vì anh ấy mới vào công ty nên vẫn chưa quen việc."
          ],
          [
            "{昼|ひる}ご{飯|はん}を{食|た}べ《たばかり》だから、まだお{腹|なか}が{空|す}いていない。",
            "Tôi vừa ăn trưa nên chưa đói."
          ],
          [
            "{日本|にほん}に{来|き} 《たばかり》のころ、{何|なに}も{分|わ}からなかった。",
            "Khi mới đến Nhật, tôi chẳng hiểu gì cả."
          ],
          [
            "{今|いま}、{帰|かえ}っ《たばかり》です。",
            "Tôi vừa mới về."
          ],
          [
            "この{本|ほん}は{買|か}っ《たばかり》なのに、もうなくした。",
            "Cuốn sách này mới mua mà đã mất rồi."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-made",
    "title": "～まで",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/made.html",
    "points": [
      {
        "id": "vj-made",
        "pattern": "～まで",
        "meaning": "Đến…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Giới hạn",
                "N + まで",
                "Đến / cho đến (điểm cuối của thời gian/địa điểm)",
                "{駅|えき}まで{歩|ある}きます。 Tôi đi bộ đến ga."
              ],
              [
                "Giới hạn thời gian",
                "V[る/] + まで",
                "Cho đến khi làm V",
                "{雨|あめ}がやむまで{待|ま}ちます。 Tôi đợi cho đến khi mưa tạnh."
              ],
              [
                "Mức độ nhấn mạnh (N4)",
                "N + まで",
                "Đến mức / đến cả / thậm chí",
                "{子|こ}どもまでが{知|し}っています。 Đến cả trẻ con cũng biết."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{父|ちち}が{帰|かえ}る《まで》{待|ま}ちます。",
            "Tôi đợi cho đến khi bố về."
          ],
          [
            "{銀行|ぎんこう}《まで》{歩|ある}いて{行|い}きます。",
            "Tôi đi bộ đến ngân hàng."
          ],
          [
            "{雨|あめ}が{止|や}む《まで》ここにいます。",
            "Tôi ở đây cho đến khi mưa tạnh."
          ],
          [
            "{赤|あか}ちゃん《まで》{泣|な}いています。",
            "Đến cả em bé cũng đang khóc."
          ],
          [
            "お{金|かね}がなくて、{水|みず}《まで》{買|か}えませんでした。",
            "Tôi không có tiền, đến cả nước cũng không mua được."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-made-ni",
    "title": "～までに",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/made-ni.html",
    "points": [
      {
        "id": "vj-made-ni",
        "pattern": "～までに",
        "meaning": "Trước…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Kiểu",
              "Cấu tạo với ～までに",
              "Ý nghĩa",
              "Ví dụ cấu trúc"
            ],
            "rows": [
              [
                "Mốc thời gian",
                "{時間|じかん}・{日付|ひづけ}＋までに",
                "“trước/không muộn hơn …”",
                "{金曜|きんよう}までに{提出|ていしゅつ}"
              ],
              [
                "Thời điểm sự kiện",
                "V（{辞書|じしょ}{形|けい}）＋までに",
                "“trước khi đến lúc …”",
                "{会議|かいぎ}が{始|はじ}まるまでに"
              ],
              [
                "Danh từ sự kiện",
                "N＋までに",
                "“trước (sự kiện) …”",
                "{出発|しゅっぱつ}までに{準備|じゅんび}する"
              ],
              [
                "Nhấn ý chí",
                "～までには",
                "Nhấn “ít nhất thì…”",
                "{来週|らいしゅう}までには{終|お}える。"
              ]
            ]
          }
        ],
        "examples": [
          [
            "レポートは{明日|あした}《までに》{提出|ていしゅつ}してください。",
            "Vui lòng nộp báo cáo trước ngày mai."
          ],
          [
            "{5時|ごじ}《までに》{駅|えき}に{来|き}てください。",
            "Hãy đến nhà ga trước 5 giờ."
          ],
          [
            "{会議|かいぎ}が{始|はじ}まる《までに》、{資料|しりょう}を{配|くば}っておいてください。",
            "Trước khi cuộc họp bắt đầu, hãy phát tài liệu sẵn."
          ],
          [
            "{30歳|さんじゅっさい}になる《までに》、{海外|かいがい}で{働|はたら}きたい。",
            "Tôi muốn làm việc ở nước ngoài trước khi 30 tuổi."
          ],
          [
            "{雨|あめ}が{降|ふ}り{出|だ}す《までに》、{帰|かえ}りたい。",
            "Tôi muốn về trước khi trời đổ mưa."
          ],
          [
            "{出発|しゅっぱつ}《までには》、{準備|じゅんび}を{全部|ぜんぶ}{終|お}わらせます。",
            "Ít nhất là trước khi xuất phát, tôi sẽ hoàn tất mọi chuẩn bị."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-mama",
    "title": "～まま",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/mama.html",
    "points": [
      {
        "id": "vj-mama",
        "pattern": "～まま",
        "meaning": "Giữ nguyên…, cứ thế…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Thành phần",
              "Cấu trúc với ～まま",
              "Nghĩa",
              "Ví dụ cấu trúc"
            ],
            "rows": [
              [
                "Danh từ",
                "N の まま",
                "Giữ nguyên như N",
                "{靴|くつ}のまま / {子|こ}どものまま"
              ],
              [
                "Tính từ -na",
                "Aな まま",
                "Giữ nguyên trạng thái A",
                "{元気|げんき}なまま / {自由|じゆう}なまま"
              ],
              [
                "Động từ (đã/không làm)",
                "Vた まま / Vない まま",
                "Để nguyên sau khi đã V / để nguyên khi chưa V",
                "{開|あ}けたまま / {何|なに}も{言|い}わないまま"
              ],
              [
                "Cụm cố định",
                "そのまま / このまま / あのまま",
                "Giữ nguyên như vậy",
                "そのままにしておく"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{窓|まど}を《{開|あ}けたまま》{寝|ね}てしまった。",
            "Tôi đã lỡ ngủ trong khi để cửa sổ mở."
          ],
          [
            "{靴|くつ}の《まま》{部屋|へや}に{入|はい}らないでください。",
            "Xin đừng vào phòng mà vẫn mang giày."
          ],
          [
            "{日本語|にほんご}が{分|わ}からない《まま》{帰国|きこく}した。",
            "Tôi về nước khi vẫn chưa hiểu tiếng Nhật."
          ],
          [
            "この{問題|もんだい}は《このまま》にしておきましょう。",
            "Hãy để vấn đề này nguyên như vậy."
          ],
          [
            "{彼|かれ}は{子|こ}どもの《まま》だ。",
            "Anh ấy vẫn như một đứa trẻ (chưa trưởng thành)."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-aru",
    "title": "～てある",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-aru.html",
    "points": [
      {
        "id": "vj-te-aru",
        "pattern": "～てある",
        "meaning": "Có… sẵn (trạng thái kết quả)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～てある",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Kết quả chủ ý",
                "N(đồ vật) が/は + {他動詞|たどうし} V-て + ある",
                "{窓|まど}は{閉|し}めてある",
                "Dùng với tha động từ (động từ tha động)"
              ],
              [
                "Vị trí",
                "{場所|ばしょ}に N が + V-て + ある",
                "{壁|かべ}に{写真|しゃしん}が{貼|は}ってある",
                "Mô tả trạng thái đã được làm và còn đó"
              ],
              [
                "Chuẩn bị sẵn",
                "もう/すでに + V-て + ある",
                "チケットはもう{取|と}ってある",
                "Nhấn mạnh trạng thái sau khi làm để chuẩn bị"
              ],
              [
                "Phủ định",
                "V-ては + ない",
                "まだ{用意|ようい}してはない",
                "Phổ biến trong khẩu ngữ"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{机|つくえ}の{上|うえ}にメモが《{置|お}いてある》。",
            "Trên bàn có tờ ghi chú đã được đặt sẵn."
          ],
          [
            "{会場|かいじょう}はすでに《{準備|じゅんび}してある》。",
            "Hội trường đã được chuẩn bị sẵn."
          ],
          [
            "{明日|あした}の{会議|かいぎ}の{資料|しりょう}は《{印刷|いんさつ}してあります》。",
            "Tài liệu họp ngày mai đã in sẵn."
          ],
          [
            "{壁|かべ}に{写真|しゃしん}が《{飾|かざ}ってある》。",
            "Trên tường có trang trí ảnh (ai đó đã treo và ảnh đang ở đó)."
          ],
          [
            "このドアは{夜|よる}《{鍵|かぎ}をかけてある》。",
            "Cánh cửa này ban đêm khóa sẵn."
          ],
          [
            "チケットはまだ《{取|と}ってはない》。",
            "Vé thì vẫn chưa đặt."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ru-koto-ga-aru",
    "title": "～ることがある",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ru-koto-ga-aru.html",
    "points": [
      {
        "id": "vj-ru-koto-ga-aru",
        "pattern": "～ることがある",
        "meaning": "Thỉnh thoảng…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Tần suất/Thỉnh thoảng",
                "V-る + ことがある",
                "{忙|いそが}しいときは{昼|ひる}ご{飯|はん}を{抜|ぬ}くことがある",
                "Diễn tả “cũng có lúc/có khi…”. Thường đi với たまに/{時々|ときどき}/ときどき."
              ],
              [
                "Phủ định",
                "V-ない + ことがある",
                "{時間|じかん}がなくて{寝|ね}られないことがある",
                "“Cũng có khi không…”. Nhẹ nhàng, không tuyệt đối."
              ],
              [
                "Khái quát tình huống",
                "Nは/では/で + V-る + ことがある",
                "{山|やま}では{天気|てんき}が{急|きゅう}に{変|か}わることがある",
                "Phát biểu tính chất chung/có khả năng xảy ra."
              ],
              [
                "(Liên quan) Kinh nghiệm",
                "V-た + ことがある",
                "{日本|にほん}へ{行|い}ったことがある",
                "KHÁC nghĩa: “đã từng…”. Không nhầm với V-る ことがある."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{仕事|しごと}が{忙|いそが}しいと、{昼|ひる}ご{飯|はん}を{食|た}べない《ことがある》。",
            "Khi bận công việc, cũng có lúc không ăn trưa."
          ],
          [
            "この{道|みち}は{冬|ふゆ}になると{凍結|とうけつ}する《ことがある》。",
            "Con đường này vào mùa đông có khi bị đóng băng."
          ],
          [
            "{外国|がいこく}{人|じん}にはこの{漢字|かんじ}が{読|よ}めない《ことがある》。",
            "Với người nước ngoài, cũng có trường hợp không đọc được chữ Hán này."
          ],
          [
            "{人|ひと}によっては{生魚|なまざかな}が{苦手|にがて}な《ことがある》。",
            "Tùy người, cũng có khi không ăn được cá sống."
          ],
          [
            "たまに{電車|でんしゃ}が{遅|おく}れる《ことがある》。",
            "Thỉnh thoảng tàu cũng bị trễ."
          ],
          [
            "{疲|つか}れすぎて、{眠|ねむ}れない《ことがある》。",
            "Mệt quá nên cũng có khi không ngủ được."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-iku",
    "title": "～ていく",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-iku.html",
    "points": [
      {
        "id": "vj-te-iku",
        "pattern": "～ていく",
        "meaning": "Làm rồi đi / tiếp tục về phía trước",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～ていく",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Tiếp diễn hướng tương lai",
                "V-て + いく",
                "{勉強|べんきょう}を{続|つづ}けていく",
                "Hành động/biến đổi sẽ tiếp diễn từ bây giờ về sau"
              ],
              [
                "Rời xa điểm gốc",
                "V(hoạt động) + て + いく",
                "{走|はし}っていく",
                "Vừa làm vừa “đi xa” khỏi chỗ nói/điểm mốc"
              ],
              [
                "Đem theo",
                "Nを + {持|も}っていく／{連|つ}れていく",
                "お{弁当|べんとう}を{持|も}っていく",
                "“mang/đưa đi” khỏi điểm mốc"
              ],
              [
                "Biến đổi dần",
                "Aく/に + なっていく、V-ていく",
                "{寒|さむ}くなっていく／{増|ふ}えていく",
                "Thay đổi dần theo thời gian về sau"
              ],
              [
                "Khẩu ngữ",
                "～ていく → ～てく",
                "やってく (khẩu ngữ)",
                "Lược âm trong hội thoại"
              ]
            ]
          }
        ],
        "examples": [
          [
            "これから{日本語|にほんご}の{勉強|べんきょう}を《{続|つづ}けていく》つもりです。",
            "Từ giờ tôi dự định tiếp tục học tiếng Nhật."
          ],
          [
            "{気温|きおん}は{夜|よる}になると《{下|さ}がっていきます》。",
            "Nhiệt độ sẽ giảm dần về đêm."
          ],
          [
            "{荷物|にもつ}は{私|わたし}が《{持|も}っていきます》。",
            "Đồ đạc để tôi mang đi."
          ],
          [
            "{彼|かれ}はそう{言|い}って、{振|ふ}り{向|む}かずに《{走|はし}っていった》。",
            "Anh ta nói vậy rồi chạy đi không ngoảnh lại."
          ],
          [
            "{記録|きろく}を{続|つづ}けていけば、{上達|じょうたつ}が《{見|み}えていく》はずだ。",
            "Nếu cứ ghi chép đều, ắt sẽ dần thấy tiến bộ."
          ],
          [
            "この{傾向|けいこう}は{今後|こんご}も《{強|つよ}まっていく》だろう。",
            "Xu hướng này có lẽ sẽ còn mạnh lên."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-kuru",
    "title": "～てくる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-kuru.html",
    "points": [
      {
        "id": "vj-te-kuru",
        "pattern": "～てくる",
        "meaning": "Làm và quay lại / trở nên dần…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Nghĩa",
              "Cấu trúc",
              "Ví dụ",
              "Ghi chú hướng/độ"
            ],
            "rows": [
              [
                "Đi làm rồi quay về / mang về",
                "V-て + くる",
                "{買|か}ってくる／{持|も}ってくる",
                "Hành động xảy ra rồi “quay về phía tôi/đây”"
              ],
              [
                "Trạng thái thay đổi dần dần tới hiện tại",
                "V-て + くる (khía cạnh)",
                "{寒|さむ}くなってきた／{分|わ}かってきた",
                "Diễn tiến theo thời gian hướng “đến hiện tại”"
              ],
              [
                "Hiện tượng bắt đầu xuất hiện",
                "V-て + くる",
                "{雨|あめ}が{降|ふ}ってきた",
                "Điểm khởi phát vừa “đến”"
              ],
              [
                "Vật/người tiến lại gần",
                "V-て + くる",
                "{近|ちか}づいてくる",
                "Hướng chuyển động về phía người nói"
              ]
            ]
          }
        ],
        "examples": [
          [
            "ちょっとコンビニで{飲|の}み{物|もの}を{買|か}って《くる》ね。",
            "Tớ đi mua đồ uống ở konbini rồi về nhé."
          ],
          [
            "{資料|しりょう}をプリントして《きます》から、{少々|しょうしょう}お{待|ま}ちください。",
            "Tôi in tài liệu rồi mang về ngay, xin chờ một lát."
          ],
          [
            "{雨|あめ}が{急|きゅう}に{降|ふ}って《きた》。",
            "Trời đột nhiên đổ mưa."
          ],
          [
            "このところ、{物価|ぶっか}が{上|あ}がって《きた》。",
            "Dạo này vật giá đã tăng lên."
          ],
          [
            "{彼|かれ}の{気持|きも}ちが{少|すこ}しずつ{分|わ}かって《きた》。",
            "Dần dần tôi đã hiểu cảm xúc của anh ấy."
          ],
          [
            "{雲|くも}がこちらへ{近|ちか}づいて《きた》。",
            "Mây đang kéo đến phía này."
          ],
          [
            "また{後|あと}で{連絡|れんらく}して《くる》って{言|い}ってたよ。",
            "(Anh ấy) bảo sẽ liên lạc lại (gọi tới) sau."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-dasu",
    "title": "～出す",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/dasu.html",
    "points": [
      {
        "id": "vj-dasu",
        "pattern": "～出す",
        "meaning": "Bắt đầu đột ngột…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ",
              "Sắc thái"
            ],
            "rows": [
              [
                "Phụ trợ bắt đầu",
                "V-ます bỏ ます + {出|だ}す",
                "{泣|な}き{出|だ}す／{降|ふ}り{出|だ}す／{笑|わら}い{出|だ}す",
                "Bắt đầu đột ngột, bất chợt"
              ],
              [
                "Chia thì/độ lịch sự",
                "～{出|だ}した／～{出|だ}します",
                "{雨|あめ}が{降|ふ}り{出|だ}しました。",
                "Linh hoạt theo động từ chính"
              ],
              [
                "Phân biệt từ ghép",
                "N + {出|だ}す (từ ghép)",
                "{持|も}ち{出|だ}す／{取|と}り{出|だ}す",
                "“Lấy ra/đem ra”, không phải nghĩa “bắt đầu”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{空|そら}が{暗|くら}くなったと{思|おも}ったら、{雨|あめ}が《{降|ふ}り{出|だ}した》。",
            "Tưởng trời mới tối, thì mưa bỗng đổ xuống."
          ],
          [
            "{子|こ}どもは{理由|りゆう}もなく《{泣|な}き{出|だ}す》ことがある。",
            "Trẻ con đôi khi bỗng khóc òa không lý do."
          ],
          [
            "{彼|かれ}は{突然|とつぜん}《{歌|うた}い{出|だ}して》、みんなを{驚|おどろ}かせた。",
            "Anh ấy bỗng hát lên, làm mọi người ngạc nhiên."
          ],
          [
            "{彼女|かのじょ}は{昔|むかし}の{話|はなし}を《{語|かた}り{出|だ}した》。",
            "Cô ấy bỗng bắt đầu kể chuyện ngày xưa."
          ],
          [
            "{店|みせ}を{出|で}た{途端|とたん}、{風|かぜ}が{強|つよ}く《{吹|ふ}き{出|だ}した》。",
            "Vừa ra khỏi cửa hàng, gió bỗng thổi mạnh."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-owaru",
    "title": "～終わる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/owaru.html",
    "points": [
      {
        "id": "vj-owaru",
        "pattern": "～終わる",
        "meaning": "Làm xong…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Hoàn tất hành động",
                "V-ます bỏ ます + {終|お}わる",
                "{読|よ}み{終|お}わる／{食|た}べ{終|お}わる／やり{終|お}わる",
                "“Làm xong/đọc xong…”"
              ],
              [
                "Thì/Thể",
                "～{終|お}わった／～{終|お}わっていない",
                "{書|か}き{終|お}わったところ",
                "Diễn đạt đã/ chưa hoàn tất"
              ],
              [
                "Biến thể trang trọng",
                "V-ます + {終|お}える",
                "{読|よ}み{終|お}える",
                "Trang trọng/hài văn, sắc thái “kết thúc được”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{宿題|しゅくだい}を《やり{終|お}わった》ら、ゲームしてもいい。",
            "Làm xong bài tập thì có thể chơi."
          ],
          [
            "この{本|ほん}は{一日|いちにち}で《{読|よ}み{終|お}わった》。",
            "Tôi đọc xong cuốn sách này trong một ngày."
          ],
          [
            "{食事|しょくじ}を《{食|た}べ{終|お}わった》ら、{皿|さら}を{下|さ}げてください。",
            "Anh, chị ăn xong thì vui lòng dọn đĩa."
          ],
          [
            "{会議|かいぎ}はまだ《{終|お}わっていない》ので、{少々|しょうしょう}お{待|ま}ちください。",
            "Cuộc họp vẫn chưa kết thúc, xin chờ một chút."
          ],
          [
            "メールを{書|か}き《{終|お}わったところ》で、{停電|ていでん}になった。",
            "Đúng lúc vừa viết xong email thì mất điện."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-tsuzukeru",
    "title": "～続ける",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tsuzukeru.html",
    "points": [
      {
        "id": "vj-tsuzukeru",
        "pattern": "～続ける",
        "meaning": "Tiếp tục…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～{続|つづ}ける",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vます + {続|つづ}ける",
                "{読|よ}み{続|つづ}ける、{使|つか}い{続|つづ}ける",
                "Diễn tả “tiếp tục làm V” (kéo dài/lặp lại)"
              ],
              [
                "Thể lịch sự",
                "Vます + {続|つづ}けます",
                "{勉強|べんきょう}し{続|つづ}けます",
                "Lịch sự"
              ],
              [
                "Tiếp diễn",
                "Vます + {続|つづ}けている",
                "{働|はたら}き{続|つづ}けている",
                "Hiện trạng vẫn đang tiếp tục"
              ],
              [
                "Phủ định",
                "Vます + {続|つづ}けない",
                "{通|かよ}い{続|つづ}けない",
                "Không tiếp tục"
              ],
              [
                "Quá khứ",
                "Vます + {続|つづ}けた",
                "{書|か}き{続|つづ}けた",
                "Đã tiếp tục (trong quá khứ)"
              ],
              [
                "Khả năng",
                "Vます + {続|つづ}けられる",
                "{走|はし}り{続|つづ}けられる",
                "Có thể tiếp tục làm"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{彼|かれ}は{10年間|じゅうねんかん}、{同|おな}じ{会社|かいしゃ}で{働|はたら}き《{続|つづ}けている》。",
            "Anh ấy tiếp tục làm việc ở cùng một công ty suốt 10 năm."
          ],
          [
            "{雨|あめ}が{降|ふ}り《{続|つづ}けて》、{川|かわ}があふれた。",
            "Mưa rơi liên tục khiến sông tràn bờ."
          ],
          [
            "{諦|あきら}めずに{挑戦|ちょうせん}し《{続|つづ}ける》ことが{大事|だいじ}だ。",
            "Điều quan trọng là tiếp tục thử thách mà không bỏ cuộc."
          ],
          [
            "{祖母|そぼ}は{毎日|まいにち}、{日記|にっき}を{書|か}き《{続|つづ}けている》。",
            "Bà tôi hằng ngày vẫn tiếp tục viết nhật ký."
          ],
          [
            "このアプリは{更新|こうしん}し《{続|つづ}けて》いく{予定|よてい}です。",
            "Ứng dụng này dự kiến sẽ tiếp tục được cập nhật."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-miru",
    "title": "～てみる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-miru.html",
    "points": [
      {
        "id": "vj-te-miru",
        "pattern": "～てみる",
        "meaning": "Thử làm…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～てみる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Cơ bản",
                "V-て + みる",
                "{質問|しつもん}してみる。",
                "Thử làm để xem kết quả"
              ],
              [
                "Lịch sự",
                "V-て + みます／みました",
                "{使|つか}ってみました。",
                "Dạng lịch sự"
              ],
              [
                "Mời gọi",
                "V-て + みませんか",
                "{試|ため}してみませんか。",
                "Đề xuất nhẹ"
              ],
              [
                "Kết quả",
                "V-て + みたら／みると",
                "{食|た}べてみたら、おいしかった。",
                "Nêu kết quả sau khi thử"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{一度|いちど}{再|さい}{起動|きどう}して《みて》ください。",
            "Hãy thử khởi động lại một lần."
          ],
          [
            "この{色|いろ}、{私|わたし}に{合|あ}うか{着|き}て《みる》。",
            "Tôi sẽ thử mặc xem màu này có hợp không."
          ],
          [
            "{説明|せつめい}が{難|むずか}しいので、{図|ず}にして《みました》。",
            "Vì khó giải thích nên tôi thử vẽ thành sơ đồ."
          ],
          [
            "{予約|よやく}が{取|と}れるか{電話|でんわ}して《みたら》、{空|あ}いていた。",
            "Thử gọi xem có đặt chỗ được không thì hoá ra còn chỗ."
          ],
          [
            "{味|あじ}を{変|か}えたいなら、レモンを{足|た}して《みて》。",
            "Nếu muốn đổi vị, thử thêm chanh xem."
          ],
          [
            "できるかどうか、やって《みよう》。",
            "Có làm được không, cứ thử làm đã."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-oku",
    "title": "～ておく",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-oku.html",
    "points": [
      {
        "id": "vj-te-oku",
        "pattern": "～ておく",
        "meaning": "Làm sẵn / chuẩn bị trước",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～ておく",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Làm sẵn (chuẩn bị)",
                "Vて + おく",
                "チケットを{予約|よやく}しておく。",
                "Thực hiện trước vì lợi ích tương lai."
              ],
              [
                "Để nguyên trạng",
                "そのままに + しておく",
                "ドアは{開|あ}けたままにしておく。",
                "Giữ nguyên như hiện tại."
              ],
              [
                "Phủ định",
                "Vないで + おく",
                "{今日|きょう}は{言|い}わないでおく。",
                "Cố ý không làm (để dành, để sau)."
              ],
              [
                "Khẩu ngữ",
                "Vとく／Vどく[でおく/]／Vといて[ておいて/]",
                "{読|よ}んどく／やっといて",
                "Dạng rút gọn thường dùng nói chuyện."
              ],
              [
                "Lịch sự",
                "Vて + おきます／おいてください",
                "{準備|じゅんび}しておきます。/ {置|お}いておいてください。",
                "Dùng trong công việc, nhờ vả."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{旅行|りょこう}の{前|まえ}に、ホテルを《{予約|よやく}しておく》と{安心|あんしん}だ。",
            "Trước chuyến đi, đặt phòng sẵn thì yên tâm."
          ],
          [
            "{会議|かいぎ}{室|しつ}はこのままに《しておいてください》。",
            "Phòng họp xin để nguyên như thế."
          ],
          [
            "{締切|しめきり}に{備|そな}えて、{早|はや}めに{提出|ていしゅつ}して《おきます》。",
            "Để phòng hạn chót, tôi sẽ nộp sớm."
          ],
          [
            "{重要|じゅうよう}なところに{線|せん}を{引|ひ}い《ておいた》。",
            "Tôi đã gạch sẵn chỗ quan trọng."
          ],
          [
            "{今日|きょう}は{言|い}わないで《おく》よ。",
            "Hôm nay tôi sẽ tạm không nói."
          ],
          [
            "{水|みず}、{買|か}っ《とく》？{台風|たいふう}に{備|そな}えてさ。",
            "Có mua sẵn nước không? Để phòng bão ấy."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-shimau",
    "title": "～てしまう",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-shimau.html",
    "points": [
      {
        "id": "vj-te-shimau",
        "pattern": "～てしまう",
        "meaning": "Lỡ…, làm xong hết…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～てしまう",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Cơ bản",
                "V-て + しまう",
                "{全部|ぜんぶ}{食|た}べてしまう。",
                "Hoàn tất hoặc lỡ/tiếc"
              ],
              [
                "Lịch sự",
                "V-て + しまいます／しまいました",
                "{忘|わす}れてしまいました。",
                "Văn nói lịch sự"
              ],
              [
                "Khẩu ngữ",
                "V-て + ちゃう／じゃう",
                "{飲|の}んじゃう／{落|お}としちゃった",
                "Rút gọn thân mật"
              ],
              [
                "Cảm thán",
                "しまった！",
                "しまった、{遅刻|ちこく}だ！",
                "“Chết rồi!”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "レポートを{昨夜|さくや}のうちに{書|か}き{終|お}えて《しまいました》。",
            "Tôi đã viết xong báo cáo từ tối qua."
          ],
          [
            "{財布|さいふ}を{落|お}として《しまって》、{警察|けいさつ}に{届|とど}けた。",
            "Tôi lỡ làm rơi ví nên đã trình báo cảnh sát."
          ],
          [
            "またゲームに{夢中|むちゅう}になって{時間|じかん}を{忘|わす}れ《ちゃった》。",
            "Lại mải chơi game nên quên mất thời gian."
          ],
          [
            "この{本|ほん}、{面白|おもしろ}くて{一気|いっき}に{読|よ}んで《しまった》。",
            "Cuốn này hay quá nên tôi đọc một lèo xong luôn."
          ],
          [
            "つい{余計|よけい}なことを{言|い}って《しまう》。",
            "Tôi hay lỡ nói những điều thừa."
          ],
          [
            "{電車|でんしゃ}が{遅|おく}れて、{約束|やくそく}の{時間|じかん}に{遅|おく}れ《ちゃいました》。",
            "Tàu trễ nên tôi đã lỡ đến muộn giờ hẹn."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-chatta",
    "title": "～ちゃった",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/chatta.html",
    "points": [
      {
        "id": "vj-chatta",
        "pattern": "～ちゃった",
        "meaning": "Lỡ…, mất rồi (dạng thân mật của ～てしまった)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng gốc",
              "Dạng rút gọn",
              "Cấu tạo",
              "Ý nghĩa"
            ],
            "rows": [
              [
                "Vてしまった",
                "Vちゃった",
                "～てしまう → ～ちゃう／～てしまった → ～ちゃった",
                "Hoàn tất; lỡ/tiếc nuối (khẩu ngữ)"
              ],
              [
                "Vでしまった",
                "Vじゃった",
                "～でしまう → ～じゃう／～でしまった → ～じゃった",
                "Dùng khi động từ có で (như {読|よ}んで → {読|よ}んじゃった)"
              ],
              [
                "Tiếp diễn",
                "Vちゃって",
                "～てしまって → ～ちゃって",
                "Nối câu, giải thích lý do"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{宿題|しゅくだい}、もう{終|お}わっ《ちゃった》。",
            "Bài tập tớ làm xong mất rồi."
          ],
          [
            "ごめん、{君|きみ}のプリン{食|た}べ《ちゃった》。",
            "Xin lỗi, tớ lỡ ăn mất cái pudding của cậu rồi."
          ],
          [
            "{寝坊|ねぼう}し《ちゃって》、{電車|でんしゃ}に{乗|の}り{遅|おく}れた。",
            "Lỡ ngủ quên nên lỡ chuyến tàu."
          ],
          [
            "{財布|さいふ}を{落|お}とし《ちゃった》みたい。",
            "Có vẻ tớ làm rơi ví mất rồi."
          ],
          [
            "その{話|はなし}、つい{言|い}っ《ちゃった》。",
            "Chuyện đó, tớ lỡ nói ra mất."
          ],
          [
            "{本|ほん}、{電車|でんしゃ}で{読|よ}ん《じゃった》から、もう{返|かえ}せるよ。",
            "Sách tớ đã đọc xong trên tàu rồi, có thể trả được."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-adj-ku-suru-ni-suru",
    "title": "い-Adjくする・な-Adjにする",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/adj-ku-suru-ni-suru.html",
    "points": [
      {
        "id": "vj-adj-ku-suru-ni-suru",
        "pattern": "い-Adjくする・な-Adjにする",
        "meaning": "Làm cho trở nên…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Tính từ -な (Na-adj)",
                "Aな + にする",
                "Làm cho trở nên…, biến thành…",
                "{部屋|へや}をきれいにする。 Làm cho căn phòng sạch."
              ],
              [
                "Tính từ -い (I-adj)",
                "Aい (bỏ い) + くする",
                "Làm cho trở nên…, thay đổi thành…",
                "{音|おと}を{小|ちい}さくする。 Giảm âm lượng nhỏ xuống."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{部屋|へや}をきれい《にした》。",
            "Tôi đã làm cho phòng sạch."
          ],
          [
            "{音|おと}を{大|おお}き《くしてください》。",
            "Vui lòng tăng âm lượng lên."
          ],
          [
            "このスープをもっと{熱|あつ}《くして》ください。",
            "Làm ơn hâm nóng súp hơn nữa."
          ],
          [
            "{髪|かみ}を{短|みじか}《くした》。",
            "Tôi đã cắt tóc ngắn đi."
          ],
          [
            "{部屋|へや}を{静|しず}か《にして》ください。",
            "Xin hãy giữ im lặng trong phòng."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-adj-ku-naru-ni-naru",
    "title": "い-Adjくなる・な-Adjになる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/adj-ku-naru-ni-naru.html",
    "points": [
      {
        "id": "vj-adj-ku-naru-ni-naru",
        "pattern": "い-Adjくなる・な-Adjになる",
        "meaning": "Trở nên…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Tính từ -い (I-adj)",
                "Aい → Aくなる",
                "mô tả sự thay đổi từ phía trạng thái/kết quả, không nêu tác nhân trực tiếp",
                "{寒|さむ}くなる（Trời trở nên lạnh đi）"
              ],
              [
                "Tính từ -な (Na-adj)",
                "Aな → Aに + なる",
                "Trở nên…, trở thành…",
                "{静|しず}かに なる（Trở nên yên lặng）"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{涼|すず}し《くなって》きた。",
            "Trời bắt đầu trở nên mát mẻ."
          ],
          [
            "{日本語|にほんご}が{上手|じょうず} 《になりました》。",
            "Tiếng Nhật của tôi đã trở nên giỏi hơn."
          ],
          [
            "{最近|さいきん}{忙|いそが}し《くなった》。",
            "Dạo này tôi trở nên bận rộn."
          ],
          [
            "{子|こ}どもが{静|しず}か《になった》。",
            "Lũ trẻ đã trở nên yên lặng."
          ],
          [
            "{夜|よる}になると{寒|さむ}《くなる》。",
            "Trời trở nên lạnh khi đêm xuống."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ni-suru",
    "title": "～にする",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ni-suru.html",
    "points": [
      {
        "id": "vj-ni-suru",
        "pattern": "～にする",
        "meaning": "Chọn…, quyết định…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Lựa chọn / quyết định",
                "N + にする",
                "Quyết định chọn…, lấy…",
                "{飲|の}み{物|もの}は{水|みず} にします。 Tôi chọn nước."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{昼|ひる}ご{飯|はん}はカレー《にする》。",
            "Bữa trưa tôi chọn cà ri."
          ],
          [
            "デザートはアイスクリーム《にします》。",
            "Món tráng miệng tôi chọn kem."
          ],
          [
            "この{赤|あか}い{服|ふく} 《にします》。",
            "Tôi chọn bộ quần áo màu đỏ này."
          ],
          [
            "{旅行|りょこう}は{北海道|ほっかいどう} 《にしよう》か。",
            "Kỳ nghỉ này chọn Hokkaido nhé?"
          ],
          [
            "{飲|の}み{物|もの}は{何|なに} 《にします》か。",
            "Anh, chị dùng thức uống gì ạ?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ni-naru",
    "title": "～になる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ni-naru.html",
    "points": [
      {
        "id": "vj-ni-naru",
        "pattern": "～になる",
        "meaning": "Trở thành…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại/kiểu",
              "Cấu tạo với ～になる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Danh từ (N)",
                "N + になる",
                "{医者|いしゃ}になる。",
                "Trở thành N (thay đổi trạng thái/thuộc tính)"
              ],
              [
                "Tính từ な",
                "Aな + になる",
                "{部屋|へや}がきれいになる。",
                "Trở nên A"
              ],
              [
                "Tính từ い (liên quan)",
                "Aい → Aく + なる",
                "{涼|すず}しくなる。",
                "Hình thái song hành với ～になる"
              ],
              [
                "Thời gian/số lượng",
                "Thời gian/giá + になる",
                "もう{5時|ごじ}になった。 {合計|ごうけい}は1000{円|えん}になります。",
                "Biểu thị đến thời điểm/giá tiền (ngôn ngữ lịch sự thương mại)"
              ],
              [
                "Năng lực/biến đổi khả năng",
                "V{辞書|じしょ} + ようになる",
                "{泳|およ}げるようになる。",
                "“Đã có thể…” (mẫu liên quan)"
              ],
              [
                "Quyết định (khách quan)",
                "V{辞書|じしょ}/ない + ことになる",
                "{来月|らいげつ}{転勤|てんきん}することになった。",
                "Được quyết định (không do chủ thể tự định)"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{春|はる}《になる》と、{暖|あたた}か《くなる》。",
            "Hễ đến mùa xuân thì trở nên ấm áp."
          ],
          [
            "この{道|みち}をまっすぐ{行|い}くと{海|うみ}《になります》。",
            "Đi thẳng đường này sẽ đến biển."
          ],
          [
            "{合計|ごうけい}で1000{円|えん}《になります》。",
            "Tổng cộng là 1000 yên ạ."
          ],
          [
            "{日本語|にほんご}が{話|はな}せるように《なった》。",
            "Tôi đã có thể nói tiếng Nhật."
          ],
          [
            "{田中|たなか}さんは{来月|らいげつ}から{部長|ぶちょう}《になる》そうだ。",
            "Nghe nói anh Tanaka sẽ trở thành trưởng phòng từ tháng sau."
          ],
          [
            "もう{暗|くら}《くなって》きたね。",
            "Trời bắt đầu tối rồi nhỉ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-you-ni-suru",
    "title": "～ようにする",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/you-ni-suru.html",
    "points": [
      {
        "id": "vj-you-ni-suru",
        "pattern": "～ようにする",
        "meaning": "Cố gắng…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc với ～ようにする",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Khẳng định",
                "Vる + ようにする",
                "{毎日|まいにち}{運動|うんどう}するようにする。",
                "Cố gắng/đặt mục tiêu làm thường xuyên."
              ],
              [
                "Phủ định",
                "Vない + ようにする",
                "{無駄遣|むだづか}いをしないようにする。",
                "Cố gắng tránh."
              ],
              [
                "Hiện tại tiếp diễn (thói quen)",
                "Vる + ようにしている",
                "{早寝|はやね}するようにしている。",
                "Đã và đang duy trì thói quen."
              ],
              [
                "Yêu cầu/lịch sự",
                "Vる／Vない + ようにしてください",
                "{静|しず}かにするようにしてください。",
                "Nhắc ai đó cố gắng làm/không làm."
              ],
              [
                "Quá khứ (bắt đầu cố)",
                "Vる + ようにした",
                "{水|みず}を{多|おお}く{飲|の}むようにした。",
                "Bước khởi đầu tạo thói quen."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{寝|ね}る{前|まえ}にスマホを{見|み}《ないようにしている》。",
            "Tôi cố không nhìn điện thoại trước khi ngủ."
          ],
          [
            "{挨拶|あいさつ}は{自分|じぶん}から《するようにする》と、{人間|にんげん}{関係|かんけい}が{良|よ}くなる。",
            "Nếu cố chủ động chào hỏi thì quan hệ sẽ tốt lên."
          ],
          [
            "{締|し}め{切|き}りを{守|まも}る《ようにしてください》。",
            "Vui lòng cố gắng tuân thủ hạn chót."
          ],
          [
            "{健康|けんこう}のために、{毎日|まいにち}{歩|ある}く《ようにした》。",
            "Vì sức khỏe, tôi đã bắt đầu cố gắng đi bộ mỗi ngày."
          ],
          [
            "{間違|まちが}いはすぐに《{直|なお}すようにする》べきだ。",
            "Nên cố gắng sửa lỗi ngay."
          ],
          [
            "{忘|わす}れ{物|もの}を《しないようにする》ため、チェックリストを{作|つく}った。",
            "Để không quên đồ, tôi lập danh sách kiểm tra."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-you-ni-naru",
    "title": "～ようになる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/you-ni-naru.html",
    "points": [
      {
        "id": "vj-you-ni-naru",
        "pattern": "～ようになる",
        "meaning": "Trở nên…, bắt đầu có thể…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc với ～ようになる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Khẳng định (bắt đầu/đạt khả năng)",
                "Vる／V{可能|かのう}{形|けい} + ようになる",
                "{日本語|にほんご}が{話|はな}せるようになる。",
                "Chỉ sự thay đổi trạng thái/khả năng theo thời gian."
              ],
              [
                "Phủ định (không còn… nữa)",
                "Vなく + なる／Vない + ようになる",
                "{甘|あま}い{物|もの}を{食|た}べなくなる。",
                "Thường dùng なくなる ngắn gọn."
              ],
              [
                "Thói quen mới hình thành",
                "Vる + ようになる",
                "{早起|はやお}きするようになった。",
                "Chuyển biến so với trước đây."
              ],
              [
                "Quá khứ",
                "～ようになった",
                "{一人|ひとり}で{留守番|るすばん}できるようになった。",
                "Kết quả đã đạt."
              ],
              [
                "Tiếp diễn",
                "～ようになっている",
                "{自動|じどう}で{止|と}まるようになっている。",
                "Thiết kế/chức năng được cài đặt sẵn."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{日本|にほん}の{生活|せいかつ}に{慣|な}れて、{電車|でんしゃ}で{寝|ね}られる《ようになった》。",
            "Quen với cuộc sống Nhật nên tôi đã có thể ngủ trên tàu."
          ],
          [
            "{毎日|まいにち}{練習|れんしゅう}したら、ピアノが{弾|ひ}ける《ようになる》よ。",
            "Nếu luyện tập mỗi ngày thì sẽ chơi piano được đấy."
          ],
          [
            "{子|こ}どもが{野菜|やさい}を{食|た}べる《ようになった》。",
            "Đứa trẻ đã bắt đầu ăn rau."
          ],
          [
            "{忙|いそが}しくて、{最近|さいきん}{本|ほん}を{読|よ}ま《なくなった》。",
            "Bận quá nên dạo này tôi không còn đọc sách nữa."
          ],
          [
            "{説明|せつめい}を{聞|き}いて、やっと{仕組|しく}みが{分|わ}かる《ようになった》。",
            "Nghe giải thích xong cuối cùng tôi đã hiểu cơ chế."
          ],
          [
            "この{機械|きかい}は、{一定|いってい}{温度|おんど}で{自動的|じどうてき}に{止|と}まる《ようになっている》。",
            "Máy này được thiết kế để tự dừng ở nhiệt độ nhất định."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-nagara",
    "title": "Vながら",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nagara.html",
    "points": [
      {
        "id": "vj-nagara",
        "pattern": "Vながら",
        "meaning": "Vừa… vừa…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Động từ (thể ます bỏ ます)",
                "Vます (bỏ ます) + ながら",
                "Vừa… vừa…, thực hiện đồng thời hai hành động",
                "{音楽|おんがく}を{聞|き}き ながら{勉強|べんきょう}する。 Vừa nghe nhạc vừa học."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{歩|ある}き 《ながら》スマホを{見|み}てはいけません。",
            "Không được vừa đi vừa nhìn điện thoại."
          ],
          [
            "テレビを{見|み} 《ながら》ご{飯|はん}を{食|た}べる。",
            "Vừa xem TV vừa ăn cơm."
          ],
          [
            "{音楽|おんがく}を{聞|き}き 《ながら》{宿題|しゅくだい}をするのが{好|す}きです。",
            "Tôi thích vừa nghe nhạc vừa làm bài tập."
          ],
          [
            "{彼|かれ}は{歌|うた}い 《ながら》{料理|りょうり}をしている。",
            "Anh ấy vừa nấu ăn vừa hát."
          ],
          [
            "{運転|うんてん}し 《ながら》{電話|でんわ}をするのは{危|あぶ}ない。",
            "Vừa lái xe vừa gọi điện rất nguy hiểm."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-nikui",
    "title": "～にくい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nikui.html",
    "points": [
      {
        "id": "vj-nikui",
        "pattern": "～にくい",
        "meaning": "Khó…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～にくい",
              "Ví dụ cấu trúc",
              "Tính chất"
            ],
            "rows": [
              [
                "Động từ",
                "V-ます bỏ ます + にくい",
                "{読|よ}みにくい{字|じ}だ。",
                "Tạo tính từ đuôi い, chia được: にくくない／にくかった…"
              ],
              [
                "Danh hóa mức độ",
                "V-ます bỏ ます + にくさ",
                "{読|よ}みにくさを{改善|かいぜん}する。",
                "Danh từ hóa “độ khó làm”"
              ],
              [
                "Kết hợp danh từ",
                "V-ます + にくい + N",
                "{汚|よご}れが{落|お}としにくい{素材|そざい}",
                "Bổ nghĩa danh từ"
              ],
              [
                "Mẫu tương phản",
                "V-ます + やすい（dễ）",
                "{壊|こわ}れやすい／{壊|こわ}れにくい",
                "Cặp đối lập thường dùng"
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{字|じ}は{小|ちい}さすぎて{読|よ}み《にくい》。",
            "Chữ này quá nhỏ nên khó đọc."
          ],
          [
            "その{靴|くつ}は{滑|すべ}り《にくい》から{山登|やまのぼ}りに{向|む}いている。",
            "Đôi giày đó ít trơn trượt nên hợp leo núi."
          ],
          [
            "{彼|かれ}には{頼|たの}み《にくい》{雰囲気|ふんいき}がある。",
            "Anh ta có không khí khiến người khác khó nhờ vả."
          ],
          [
            "{油|あぶら}{汚|よご}れは{水|みず}だけでは{落|お}とし《にくい》。",
            "Vết bẩn dầu mỡ khó tẩy chỉ với nước."
          ],
          [
            "このアプリは{操作|そうさ}が{分|わ}かり《にくい》。",
            "Ứng dụng này khó hiểu cách thao tác."
          ],
          [
            "{人前|ひとまえ}では{本音|ほんね}が{言|い}い《にくい》。",
            "Trước đám đông khó nói thật lòng."
          ],
          [
            "{壊|こわ}れ《にくい》{素材|そざい}を{選|えら}びましょう。",
            "Hãy chọn chất liệu khó vỡ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-yasui",
    "title": "～やすい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/yasui.html",
    "points": [
      {
        "id": "vj-yasui",
        "pattern": "～やすい",
        "meaning": "Dễ…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～やすい",
              "Ví dụ cấu trúc",
              "Tính chất"
            ],
            "rows": [
              [
                "Động từ",
                "V-ます bỏ ます + やすい",
                "{読|よ}みやすい{文章|ぶんしょう}だ。",
                "Hình thành い-tính từ; chia: やすくない／やすかった…"
              ],
              [
                "Danh hóa mức độ",
                "V-ます + やすさ",
                "{使|つか}いやすさを{重視|じゅうし}する。",
                "Danh từ “độ dễ”"
              ],
              [
                "Kết hợp danh từ",
                "V-ます + やすい + N",
                "{壊|こわ}れやすいガラス",
                "Mô tả tính chất của N"
              ],
              [
                "Đối nghĩa",
                "V-ます + にくい（khó）",
                "{見|み}やすい↔{見|み}にくい",
                "Cặp trái nghĩa thường dùng"
              ]
            ]
          }
        ],
        "examples": [
          [
            "このフォントは{読|よ}《みやすい》。",
            "Phông chữ này dễ đọc."
          ],
          [
            "{新|あたら}しいUIは{直感|ちょっかん}{的|てき}で{使|つか}《いやすい》。",
            "Giao diện mới trực quan, dễ dùng."
          ],
          [
            "ガラスは{割|わ}れ《やすい》ので{注意|ちゅうい}してください。",
            "Kính dễ vỡ nên xin chú ý."
          ],
          [
            "このシャツは{乾|かわ}き《やすい》{素材|そざい}でできている。",
            "Áo này làm từ chất liệu dễ khô."
          ],
          [
            "{人|ひと}は{疲|つか}れるとミスし《やすい》。",
            "Khi mệt người ta dễ mắc lỗi."
          ],
          [
            "メモしておけば{覚|おぼ}え《やすい》。",
            "Nếu ghi chú thì dễ nhớ."
          ],
          [
            "ここは{風|かぜ}が{通|とお}って{涼|すず}しくなり《やすい》。",
            "Nơi này có gió lùa nên dễ mát."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-kata",
    "title": "～方",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/kata.html",
    "points": [
      {
        "id": "vj-kata",
        "pattern": "～方",
        "meaning": "Cách…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mục",
              "Cấu trúc",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Tạo danh từ “cách/kiểu”",
                "V-ます bỏ ます + {方|かた}[かた/]",
                "{使|つか}い{方|かた}／{書|か}き{方|かた}／{読|よ}み{方|かた}",
                "Danh từ hóa: “cách V”"
              ],
              [
                "Tân ngữ của V",
                "N + の + V-{方|かた}",
                "{漢字|かんじ}の{書|か}き{方|かた}",
                "“を” chuyển thành “の” trước ～{方|かた}"
              ],
              [
                "Đích/đến",
                "N + へ/に + の + {行|い}き{方|かた}",
                "{空港|くうこう}への{行|い}き{方|かた}",
                "Trợ từ hướng giữ nguyên"
              ],
              [
                "する／{来|く}る",
                "し{方|かた}／しかた／{来|き}{方|かた}",
                "{勉強|べんきょう}の{仕方|しかた}／{来|き}{方|かた}",
                "“しかた/{仕方|しかた}” thường gặp; {来|き}{方|かた} ít dùng"
              ],
              [
                "Chọn trợ từ sau {方|かた}",
                "V-{方|かた} + を/が/は",
                "{使|つか}い{方|かた}を{教|おし}える",
                "Coi như một danh từ bình thường"
              ]
            ]
          }
        ],
        "examples": [
          [
            "《{漢字|かんじ}の{書|か}き{方|かた}》を{教|おし}えてください。",
            "Xin chỉ cho tôi cách viết kanji."
          ],
          [
            "このアプリの《{使|つか}い{方|かた}》が{分|わ}かりますか。",
            "Bạn hiểu cách dùng ứng dụng này không?"
          ],
          [
            "{空港|くうこう}《への{行|い}き{方|かた}》を{教|おし}えていただけますか。",
            "Cho tôi hỏi đường đi đến sân bay."
          ],
          [
            "{箸|はし}《の{使|つか}い{方|かた}》に{慣|な}れてきた。",
            "Tôi dần quen với cách dùng đũa."
          ],
          [
            "{仕事|しごと}《のやり{方|かた}》を{見直|みなお}そう。",
            "Hãy xem lại cách làm việc."
          ],
          [
            "{連絡|れんらく}《の{仕方|しかた}》が{悪|わる}かった。",
            "Cách liên lạc không ổn."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-bakari-n4",
    "title": "Nばかり",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/bakari-n4.html",
    "points": [
      {
        "id": "vj-bakari-n4",
        "pattern": "Nばかり",
        "meaning": "Toàn…, cứ…, đầy…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa chính",
              "Ví dụ"
            ],
            "rows": [
              [
                "Danh từ",
                "N + ばかり",
                "Toàn…, chỉ toàn…, lúc nào cũng…",
                "{甘|あま}いものばかり{食|た}べている。 Lúc nào cũng ăn toàn đồ ngọt."
              ],
              [
                "Danh từ số lượng",
                "Số lượng + ばかり",
                "Khoảng…, tầm… (ước lượng)",
                "{3時間|さんじかん} ばかり{待|ま}った。 Đợi khoảng 3 tiếng."
              ]
            ]
          }
        ],
        "examples": [
          [
            "あの{人|ひと}は{文句|もんく} 《ばかり》{言|い}っている。",
            "Người đó lúc nào cũng chỉ toàn than phiền."
          ],
          [
            "{子|こ}どもはゲーム《ばかり》して、{勉強|べんきょう}しない。",
            "Bọn trẻ chỉ toàn chơi game, không chịu học."
          ],
          [
            "{今日|きょう}は{雨|あめ} 《ばかり》{降|ふ}っている。",
            "Hôm nay chỉ toàn mưa."
          ],
          [
            "{千|せん}{円|えん} 《ばかり》あれば{足|た}りるでしょう。",
            "Có khoảng 1.000 yên là đủ nhỉ."
          ],
          [
            "{30分|さんじゅっぷん} 《ばかり》{待|ま}ってください。",
            "Vui lòng đợi khoảng 30 phút."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-zutsu",
    "title": "～ずつ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/zutsu.html",
    "points": [
      {
        "id": "vj-zutsu",
        "pattern": "～ずつ",
        "meaning": "Mỗi…, từng…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu tạo với ～ずつ",
              "Ví dụ",
              "Ý nghĩa/Ghi chú"
            ],
            "rows": [
              [
                "Số + Lượng từ",
                "{数|かず}＋{助数詞|じょすうし}＋ずつ",
                "{一人|ひとり}ずつ／{二|に}{枚|まい}ずつ／{五分|ごふん}ずつ",
                "Mỗi…, chia đều theo đơn vị"
              ],
              [
                "Danh từ chỉ lượng",
                "N（{量|りょう}）＋ずつ",
                "{少|すこ}しずつ／{半分|はんぶん}ずつ／{一部|いちぶ}ずつ",
                "Từng chút/mỗi phần"
              ],
              [
                "Số thuần",
                "{数|かず}＋ずつ",
                "{三|さん}ずつ（ngữ cảnh hiểu là 3 cái/3 lần…）",
                "Cần ngữ cảnh rõ hoặc kèm lượng từ"
              ],
              [
                "Dạng câu",
                "{主語|しゅご}＋V（{配分|はいぶん}/{順次|じゅんじ}）＋{数量|すうりょう}＋ずつ",
                "{順番|じゅんばん}に{一人|ひとり}ずつ{入|はい}ってください。 {毎日|まいにち}{単語|たんご}を{五個|ごこ}ずつ{覚|おぼ}える。",
                "Biểu thị phân phối/tiến triển từng phần"
              ],
              [
                "Kết hợp tiến triển",
                "…＋ずつ＋Vていく／Vてくる",
                "{少|すこ}しずつ{慣|な}れてきた。",
                "Biểu thị thay đổi dần dần"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{子|こ}どもたちにキャンディーを{二|ふた}つ《ずつ》{配|くば}った。",
            "Phát cho bọn trẻ mỗi đứa hai viên kẹo."
          ],
          [
            "{順番|じゅんばん}に{一人|ひとり}《ずつ》{面接|めんせつ}{室|しつ}に{入|はい}ってください。",
            "Xin mời vào phòng phỏng vấn mỗi lần một người theo thứ tự."
          ],
          [
            "{毎日|まいにち}、{漢字|かんじ}を{十個|じゅっこ}《ずつ》{覚|おぼ}えている。",
            "Mỗi ngày tôi học thuộc mười chữ Hán."
          ],
          [
            "{少|すこ}し《ずつ》{良|よ}くなってきました。",
            "Đang dần dần tốt lên."
          ],
          [
            "この{問題|もんだい}は{三|さん}グループに{分|わ}けて、{各|かく}グループに{五|ご}{枚|まい}《ずつ》{配|くば}ります。",
            "Chia thành ba nhóm và phát cho mỗi nhóm năm tờ."
          ],
          [
            "お{金|かね}は{月|つき}に{三|さん}{万|まん}{円|えん}《ずつ》{貯金|ちょきん}している。",
            "Tôi tiết kiệm mỗi tháng ba vạn yên."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-wa-hodo-arimasen",
    "title": "～は～ほど～ありません",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/wa-hodo-arimasen.html",
    "points": [
      {
        "id": "vj-wa-hodo-arimasen",
        "pattern": "～は～ほど～ありません",
        "meaning": "Không… bằng…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu so sánh",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Tính từ -い",
                "AはBほど Aいくありません／Aいくない",
                "{東京|とうきょう}は{大阪|おおさか}ほど{暑|あつ}くありません",
                "Dạng lịch sự/ thường"
              ],
              [
                "Tính từ -な",
                "AはBほど Aなではありません／Aなではない",
                "{彼|かれ}は{兄|あに}ほど{親切|しんせつ}ではありません",
                "Dùng ではない cho -な/N"
              ],
              [
                "Động từ",
                "AはBほど Vません／Vない",
                "{私|わたし}は{兄|あに}ほど{食|た}べません",
                "So sánh mức độ hành động"
              ],
              [
                "Mẫu tổng quát",
                "～は ～ほど ～ありません/～ない",
                "XはYほど～ありません",
                "Phủ định mức độ “không bằng”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}は{兄|あに}《ほど》{背|せ}が{高|たか}《くありません》。",
            "Tôi không cao bằng anh trai."
          ],
          [
            "{日本語|にほんご}《は》{英語|えいご}《ほど》{発音|はつおん}が{難|むずか}し《くない》。",
            "Tiếng Nhật phát âm không khó bằng tiếng Anh."
          ],
          [
            "{今年|ことし}《は》{去年|きょねん}《ほど》{雪|ゆき}が{降|ふ}り《ません》。",
            "Năm nay tuyết rơi không nhiều bằng năm ngoái."
          ],
          [
            "この{問題|もんだい}《は》{思|おも}った《ほど》{複雑|ふくざつ}《ではありません》。",
            "Bài này không phức tạp như đã nghĩ."
          ],
          [
            "{彼|かれ}《は》{私|わたし}《ほど》コーヒーを{飲|の}ま《ない》。",
            "Anh ấy không uống cà phê nhiều bằng tôi."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-sugiru",
    "title": "～すぎる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/sugiru.html",
    "points": [
      {
        "id": "vj-sugiru",
        "pattern": "～すぎる",
        "meaning": "Quá…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu tạo với ～すぎる",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-ます bỏ ます ＋ すぎる",
                "{食|た}べすぎる／{残業|ざんぎょう}しすぎる",
                "Nhóm II, chia được: すぎます／すぎた／すぎない"
              ],
              [
                "Tính từ い",
                "Aい bỏ い ＋ すぎる",
                "{忙|いそが}しすぎる／{新|あたら}しすぎる",
                "Không giữ い"
              ],
              [
                "Tính từ な",
                "Aな (gốc) ＋ すぎる",
                "{簡単|かんたん}すぎる／{安全|あんぜん}すぎる",
                "Không thêm だ"
              ],
              [
                "Nối nguyên nhân",
                "～すぎて、…",
                "{眩|まぶ}しすぎて、{目|め}が{開|あ}けられない。",
                "Lý do do “quá”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{部屋|へや}は{暑|あつ}《すぎる》。",
            "Phòng này nóng quá."
          ],
          [
            "{寝|ね}《すぎて》、{頭|あたま}が{痛|いた}い。",
            "Ngủ quá nên đau đầu."
          ],
          [
            "その{説明|せつめい}は{専門|せんもん}{的|てき}《すぎて》、{理解|りかい}しにくい。",
            "Giải thích đó chuyên môn quá nên khó hiểu."
          ],
          [
            "{彼女|かのじょ}は{真面目|まじめ}《すぎる》ところがある。",
            "Cô ấy có phần quá nghiêm túc."
          ],
          [
            "{使|つか}い《すぎ》に{注意|ちゅうい}してください。",
            "Xin chú ý việc dùng quá mức."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-shika-nai-1",
    "title": "～しかない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/shika-nai-1.html",
    "points": [
      {
        "id": "vj-shika-nai-1",
        "pattern": "～しかない",
        "meaning": "Không còn cách nào ngoài…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ ngắn"
            ],
            "rows": [
              [
                "N + しかない",
                "Danh từ + しか + ない",
                "Chỉ có … (không còn gì khác)",
                "{千|せん}{円|えん}しかない。"
              ],
              [
                "Số lượng + しかない",
                "{一|ひと}つ/{少|すこ}し/{三人|さんにん} + しか + ない",
                "“Chỉ …” với sắc thái thiếu",
                "{一人|ひとり}しかいない。"
              ],
              [
                "Vる + しかない",
                "Động từ từ điển + しか + ない",
                "Không còn cách nào ngoài … / đành phải …",
                "{待|ま}つしかない。"
              ],
              [
                "Lịch sự",
                "しかありません／しかないです",
                "Dạng lịch sự",
                "{行|い}くしかありません。"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{現金|げんきん}は{千|せん}{円|えん}《しかない》。",
            "Tiền mặt thì chỉ có 1.000 yên."
          ],
          [
            "{会場|かいじょう}には{学生|がくせい}《しかいない》。",
            "Ở hội trường chỉ có sinh viên."
          ],
          [
            "{電車|でんしゃ}が{止|と}まっているから、{歩|ある}く《しかない》。",
            "Tàu dừng nên đành phải đi bộ."
          ],
          [
            "この{問題|もんだい}は{待|ま}つ《しかない》と{思|おも}う。",
            "Tôi nghĩ vấn đề này chỉ còn cách chờ."
          ],
          [
            "{時間|じかん}がないので、{簡単|かんたん}に{説明|せつめい}する《しかない》。",
            "Vì không có thời gian nên chỉ còn cách giải thích ngắn gọn."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-dake-shika-nai",
    "title": "～だけしか～ない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/dake-shika-nai.html",
    "points": [
      {
        "id": "vj-dake-shika-nai",
        "pattern": "～だけしか～ない",
        "meaning": "Chỉ… mà thôi / ngoài ra không…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Điều kiện"
            ],
            "rows": [
              [
                "Danh từ",
                "N + だけしか + Vない",
                "お{金|かね}だけしか{持|も}っていない。",
                "Bắt buộc đi với phủ định (ない/ません)."
              ],
              [
                "Số lượng/counters",
                "{数|かず}・{量|りょう} + だけしか + Vない",
                "{千|せん}{円|えん}だけしか{持|も}っていない。",
                "Nhấn mạnh cảm giác “ít/không đủ”."
              ],
              [
                "Đại từ/chỉ thị",
                "これ／それ／あれ + だけしか + Vない",
                "これだけしかできません。",
                "Thường dùng trong khiêm nhường/lịch sự."
              ],
              [
                "Mốc thời gian",
                "{時間|じかん}{語|ご} + だけしか + Vない",
                "{今日|きょう}は{一時間|いちじかん}だけしか{勉強|べんきょう}しなかった。",
                "Chấp nhận với khoảng thời gian cụ thể."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}は{日本語|にほんご}《だけしか》{話|はな}せ《ない》。",
            "Tôi chỉ nói được tiếng Nhật (ngoài ra không nói được ngôn ngữ khác)."
          ],
          [
            "ここには{水|みず}《だけしか》《ありません》。",
            "Ở đây chỉ có nước."
          ],
          [
            "この{町|まち}にはバス《だけしか》《{走|はし}っていない》。",
            "Ở thị trấn này chỉ có xe buýt chạy."
          ],
          [
            "{時間|じかん}が{一時間|いちじかん}《だけしか》《ない》から、{急|いそ}ごう。",
            "Vì chỉ có đúng một tiếng, mau lên thôi."
          ],
          [
            "これ《だけしか》{手伝|てつだ}え《なくて》すみません。",
            "Xin lỗi tôi chỉ giúp được ngần này."
          ],
          [
            "{小学生|しょうがくせい}《だけしか》《{入|い}れない》イベントです。",
            "Đây là sự kiện chỉ học sinh tiểu học mới được vào."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-shika-nai-2",
    "title": "～しか～ない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/shika-nai-2.html",
    "points": [
      {
        "id": "vj-shika-nai-2",
        "pattern": "～しか～ない",
        "meaning": "Chỉ… / Không có ngoài…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu tạo với ～しか～ない",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "N + しか + V-ない",
                "Danh từ + しか + động từ phủ định",
                "{水|みず}しか{飲|の}まない",
                "を thường lược trước しか"
              ],
              [
                "{数量|すうりょう} + しか + V-ない",
                "Số lượng/đơn vị + しか + V-ない",
                "100{円|えん}しか{持|も}っていない",
                "Nhấn mạnh “chỉ có …”"
              ],
              [
                "{場所|ばしょ}/{時間|じかん} + で/に + しか + V-ない",
                "Trợ từ cách + しか + V-ない",
                "ここでしか{買|か}えない／{今日|きょう}しか{行|い}けない",
                "Giữ で/に rồi mới しか"
              ],
              [
                "V-{辞書|じしょ}{形|けい} + しか + ない",
                "“Chỉ còn cách …”",
                "{待|ま}つしかない",
                "Cố định nghĩa “không còn lựa chọn nào khác”"
              ],
              [
                "Nhịp điệu lịch sự",
                "～しか ありません／いません／できません",
                "この{方法|ほうほう}しかありません",
                "Phủ định lịch sự"
              ]
            ]
          }
        ],
        "examples": [
          [
            "お{金|かね}が《100{円|えん}しか》{残|のこ}って《いない》。",
            "Chỉ còn 100 yên."
          ],
          [
            "ここ《でしか》{買|か}え《ない》{限定|げんてい}{商品|しょうひん}だ。",
            "Là sản phẩm giới hạn chỉ mua được ở đây."
          ],
          [
            "{今日|きょう}は{時間|じかん}がないから、コンビニ《でしか》{食|た}べられ《ない》。",
            "Hôm nay không có thời gian nên chỉ có thể ăn ở cửa hàng tiện lợi."
          ],
          [
            "{彼|かれ}《しか》{知|し}ら《ない》{秘密|ひみつ}だ。",
            "Bí mật chỉ có anh ấy biết."
          ],
          [
            "もう{待|ま}つ《しかない》。",
            "Giờ chỉ còn cách chờ thôi."
          ],
          [
            "この{方法|ほうほう}《しか》ありません。",
            "Chỉ có cách này thôi."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-nai-to-ikenai",
    "title": "～ないといけない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nai-to-ikenai.html",
    "points": [
      {
        "id": "vj-nai-to-ikenai",
        "pattern": "～ないといけない",
        "meaning": "Phải…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～ないといけない",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Bắt buộc",
                "Vない + と + いけない",
                "{早|はや}く{寝|ね}ないといけない",
                "“Nếu không … thì không được” → phải"
              ],
              [
                "Tương đương",
                "Vなくては + いけない",
                "{提出|ていしゅつ}しなくてはいけない",
                "Trang trọng hơn chút"
              ],
              [
                "Biến thể",
                "Vない + と + だめだ",
                "{勉強|べんきょう}しないとだめだ",
                "Khẩu ngữ; “nếu không thì hỏng”"
              ],
              [
                "Quá khứ",
                "Vない + と + いけなかった",
                "{行|い}かないといけなかった",
                "“Đã phải …”"
              ],
              [
                "Hỏi/đề nghị",
                "Vない + と + いけませんか",
                "{予約|よやく}しないといけませんか",
                "Lịch sự, xác nhận quy định"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}までに{報告|ほうこく}{書|しょ}を{出|だ}さ《ないといけない》。",
            "Tôi phải nộp báo cáo trước ngày mai."
          ],
          [
            "{健康|けんこう}のために{運動|うんどう}し《ないといけません》。",
            "Vì sức khỏe nên phải tập thể dục."
          ],
          [
            "{電車|でんしゃ}がないから、{早|はや}く{帰|かえ}《らないといけない》。",
            "Vì hết tàu nên phải về sớm."
          ],
          [
            "{日本|にほん}ではゴミを{分別|ぶんべつ}し《ないといけない》。",
            "Ở Nhật phải phân loại rác."
          ],
          [
            "{会議|かいぎ}に{出|で}《ないといけなかった》ので、{遅|おく}れました。",
            "Vì đã phải dự họp nên tôi đến muộn."
          ],
          [
            "{登録|とうろく}し《ないといけませんか》。",
            "Có bắt buộc phải đăng ký không?"
          ],
          [
            "{部屋|へや}を{片付|かたづ}け《ないとだめだ》。",
            "Phải dọn phòng, không thì hỏng."
          ]
        ],
        "group": "vj-2"
      }
    ]
  },
  {
    "id": "vj-nakya-ikenai",
    "title": "～なきゃいけない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nakya-ikenai.html",
    "points": [
      {
        "id": "vj-nakya-ikenai",
        "pattern": "～なきゃいけない",
        "meaning": "Phải… (nói tự nhiên)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～なきゃいけない",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Bắt buộc (khẩu ngữ)",
                "Vなきゃ + いけない",
                "{急|いそ}がなきゃいけない",
                "Rút gọn của ～なければいけない"
              ],
              [
                "Biến thể",
                "Vなきゃ + ならない",
                "{帰|かえ}んなきゃならない",
                "Khẩu ngữ của ～なければならない"
              ],
              [
                "Siêu rút gọn",
                "Vなきゃ（…）",
                "もう{行|い}かなきゃ",
                "Lược いけない/ならない, người nghe tự hiểu"
              ],
              [
                "Thân mật khác",
                "Vなくちゃ（いけない／ならない）",
                "{勉強|べんきょう}しなくちゃいけない",
                "＝ なくては → なくちゃ"
              ],
              [
                "Quá khứ",
                "Vなきゃいけなかった",
                "{行|い}かなきゃいけなかった",
                "“Đã phải …” (khẩu ngữ)"
              ],
              [
                "Hỏi xác nhận",
                "Vなきゃいけない？",
                "{予約|よやく}しなきゃいけない？",
                "Thân mật; lịch sự dùng ～ないといけませんか"
              ]
            ]
          }
        ],
        "examples": [
          [
            "そろそろ{寝|ね}《なきゃいけない》。",
            "Đến giờ phải ngủ rồi."
          ],
          [
            "{締|し}め{切|き}りだから{急|いそ}が《なきゃ》。",
            "Sắp đến hạn nên phải nhanh thôi. (lược đuôi)"
          ],
          [
            "{明日|あした}、{早|はや}く{起|お}き《なきゃいけない》んだ。",
            "Ngày mai mình phải dậy sớm."
          ],
          [
            "そんなに{食|た}べ《なくちゃいけない》？",
            "Có phải ăn nhiều thế không?"
          ],
          [
            "{子|こ}どもを{迎|むか}えに{行|い}か《なきゃならない》。",
            "Tôi phải đi đón con."
          ],
          [
            "{雨|あめ}が{降|ふ}りそう。{洗濯|せんたく}{物|もの}を{入|い}れ《なきゃ》。",
            "Có vẻ mưa. Phải lấy đồ giặt vào."
          ],
          [
            "{会議|かいぎ}に{出|で}《なきゃいけなかった》から、{連絡|れんらく}{遅|おく}れた。",
            "Vì đã phải dự họp nên tôi liên lạc muộn."
          ],
          [
            "マスク、つけ《なきゃいけない》？",
            "Có bắt buộc đeo khẩu trang không?"
          ]
        ],
        "group": "vj-2"
      }
    ]
  },
  {
    "id": "vj-nakucha-ikenai",
    "title": "～なくちゃいけない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nakucha-ikenai.html",
    "points": [
      {
        "id": "vj-nakucha-ikenai",
        "pattern": "～なくちゃいけない",
        "meaning": "Phải… (thân mật)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～なくちゃいけない",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vない + なくちゃいけない",
                "{行|い}かない → {行|い}かなくちゃいけない",
                "Khẩu ngữ, thân mật; có thể lược いけない: {行|い}かなくちゃ。"
              ],
              [
                "Tính từい",
                "Aく + なくちゃいけない",
                "{安|やす}くなくちゃいけない",
                "Diễn tả “phải (có tính chất) ...”."
              ],
              [
                "Tính từな / Danh từ",
                "N・Aな + で + なくちゃいけない",
                "{静|しず}かでなくちゃいけない／{会員|かいいん}でなくちゃいけない",
                "Nhớ “で” trước なくちゃいけない."
              ],
              [
                "Biến thể khẩu ngữ",
                "～なくちゃ／～なきゃ／～ないと(いけない/だめ)",
                "{早|はや}く{起|お}きなきゃ。／{連絡|れんらく}しないと。",
                "Ngắn gọn, rất đời thường; ないと có thể lược phần sau."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}{早|はや}く{起|お}き《なくちゃいけない》。",
            "Tôi phải dậy sớm vào ngày mai."
          ],
          [
            "{締|し}め{切|き}りまでに{提出|ていしゅつ}《しなくちゃいけない》。",
            "Phải nộp trước hạn."
          ],
          [
            "ここは{静|しず}か《でなくちゃいけない》から、{電話|でんわ}は{外|そと}でして。",
            "Ở đây phải yên tĩnh nên gọi điện ra ngoài nhé."
          ],
          [
            "もう{行|い}か《なくちゃ》！",
            "Tôi phải đi thôi!"
          ],
          [
            "{連絡|れんらく}し《ないと》[いけない/]。",
            "Phải liên lạc (mới được)."
          ]
        ],
        "group": "vj-2"
      }
    ]
  },
  {
    "id": "vj-nakute-wa-ikenai",
    "title": "～なくてはいけない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nakute-wa-ikenai.html",
    "points": [
      {
        "id": "vj-nakute-wa-ikenai",
        "pattern": "～なくてはいけない",
        "meaning": "Phải… (lịch sự)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～なくてはいけない",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vない + なくてはいけない",
                "{申請|しんせい}しなくてはいけない",
                "Trung tính–lịch sự, dùng nhiều trong công việc."
              ],
              [
                "Tính từい",
                "Aく + なくてはいけない",
                "{正|ただ}しくなくてはいけない",
                "Yêu cầu tính chất phải đúng/đủ."
              ],
              [
                "Tính từな / Danh từ",
                "N・Aな + で + なくてはいけない",
                "{会員|かいいん}でなくてはいけない／{安全|あんぜん}でなくてはいけない",
                "Nhớ thêm “で”."
              ],
              [
                "Biến thể",
                "～なくちゃいけない（khẩu ngữ）／～なければいけない",
                "{行|い}かなくちゃいけない／{行|い}かなければいけない",
                "Chênh sắc thái: なくちゃ (mềm) ＜ なくては (chuẩn) ≲ なければ (hơi cứng)."
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{書類|しょるい}は{今週|こんしゅう}{中|ちゅう}に{提出|ていしゅつ}し《なくてはいけない》。",
            "Tài liệu này phải nộp trong tuần này."
          ],
          [
            "{入場|にゅうじょう}するには{会員|かいいん}《でなくてはいけません》。",
            "Muốn vào thì phải là hội viên."
          ],
          [
            "{製品|せいひん}は{安全|あんぜん}《でなくてはいけない》。",
            "Sản phẩm phải an toàn."
          ],
          [
            "{健康|けんこう}のために、{定期|ていき}{的|てき}に{運動|うんどう}し《なくてはいけない》。",
            "Vì sức khỏe, phải vận động đều đặn."
          ]
        ],
        "group": "vj-2"
      }
    ]
  },
  {
    "id": "vj-nakereba-naranai",
    "title": "～なければならない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nakereba-naranai.html",
    "points": [
      {
        "id": "vj-nakereba-naranai",
        "pattern": "～なければならない",
        "meaning": "Phải… (bắt buộc mạnh)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～なければならない",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vない + なければならない",
                "{報告|ほうこく}しなければならない",
                "Mạnh, chuẩn mực/quy định."
              ],
              [
                "Tính từい",
                "Aく + なければならない",
                "{正|ただ}しくなければならない",
                "Yêu cầu tính chất bắt buộc phải đúng."
              ],
              [
                "Tính từな / Danh từ",
                "N・Aな + で + なければならない",
                "{合法|ごうほう}でなければならない／{会員|かいいん}でなければならない",
                "“で” bắt buộc."
              ],
              [
                "Biến thể gần nghĩa",
                "～なければいけない／～なくてはならない／～ねばならない",
                "{守|まも}らねばならない。",
                "ねばならない rất văn viết/cổ; なくてはならない trang trọng."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{労働|ろうどう}{法|ほう}を{遵守|じゅんしゅ}し《なければならない》。",
            "Phải tuân thủ luật lao động."
          ],
          [
            "{応募|おうぼ}{書類|しょるい}は{日本語|にほんご}《でなければならない》。",
            "Hồ sơ ứng tuyển phải bằng tiếng Nhật."
          ],
          [
            "{安全|あんぜん}{基準|きじゅん}は{常|つね}に{満|み}たされ《なければならない》。",
            "Tiêu chuẩn an toàn phải luôn được đáp ứng."
          ],
          [
            "{明日|あした}までに{報告|ほうこく}{書|しょ}を{提出|ていしゅつ}し《なければなりません》。",
            "Phải nộp báo cáo trước ngày mai."
          ]
        ],
        "group": "vj-2"
      }
    ]
  },
  {
    "id": "vj-nai-hou-ga-ii",
    "title": "～ないほうがいい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nai-hou-ga-ii.html",
    "points": [
      {
        "id": "vj-nai-hou-ga-ii",
        "pattern": "～ないほうがいい",
        "meaning": "Không nên…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～ないほうがいい",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-ない{形|かたち} + ほうがいい",
                "{夜|よ}{更|ふ}かししないほうがいい。",
                "Khuyên “không nên làm V”. Lịch sự: ～ないほうがいいです"
              ],
              [
                "Động từ (quá khứ giả định)",
                "V-ない{形|かたち} + ほうがよかった",
                "そんなことは{言|い}わないほうがよかった。",
                "“Đáng lẽ đã không nên…” (hối tiếc)"
              ],
              [
                "Khẳng định (tham khảo)",
                "V-た{形|かたち}/{辞書|じしょ}{形|けい} + ほうがいい",
                "{早|はや}く{寝|ね}たほうがいい / {早|はや}く{寝|ね}るほうがいい。",
                "Mẫu đối ứng “nên làm”. Chủ điểm ở đây là dạng phủ định"
              ],
              [
                "Biểu thị mức độ",
                "V-ない{形|かたち} + ほうが{無難|ぶなん}だ / {身|み}のためだ",
                "{夜道|よみち}は{歩|ある}かないほうが{無難|ぶなん}だ。",
                "Ý khuyên mạnh hơn, mang tính cảnh báo"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{今日|きょう}は{無理|むり}をし《ないほうがいい》よ。",
            "Hôm nay cậu không nên gắng quá."
          ],
          [
            "その{話|はなし}は{部長|ぶちょう}には{言|い}わ《ないほうがいい》。",
            "Chuyện đó không nên nói với trưởng phòng."
          ],
          [
            "{夜|よる}は{一人|ひとり}で{出歩|である}か《ないほうがいい》です。",
            "Ban đêm không nên đi lang thang một mình."
          ],
          [
            "{空腹|くうふく}でその{薬|くすり}を{飲|の}ま《ないほうがいい》。",
            "Không nên uống thuốc đó khi đang đói."
          ],
          [
            "{初対面|しょたいめん}ではあまり{踏|ふ}み{込|こ}んだ{質問|しつもん}はし《ないほうがいい》。",
            "Lần đầu gặp không nên hỏi quá sâu."
          ],
          [
            "{雨|あめ}が{強|つよ}いから、{今日|きょう}は{行|い}か《ないほうがいい》と{思|おも}います。",
            "Mưa to nên tôi nghĩ hôm nay không nên đi."
          ],
          [
            "あのサイトは{信用|しんよう}できない、{登録|とうろく}し《ないほうがいい》よ。",
            "Trang đó không đáng tin, đừng nên đăng ký."
          ],
          [
            "そんな{言|い}い{方|かた}はし《ないほうがよかった》ね。",
            "Đáng lẽ không nên nói theo cách đó."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-nakutemo-ii",
    "title": "～なくてもいい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nakutemo-ii.html",
    "points": [
      {
        "id": "vj-nakutemo-ii",
        "pattern": "～なくてもいい",
        "meaning": "Không cần…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～なくてもいい",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vない + なくてもいい",
                "{行|い}かない → {行|い}かなくてもいい",
                "Cho phép/không bắt buộc."
              ],
              [
                "Tính từい",
                "Aく + なくてもいい",
                "{高|たか}くなくてもいい",
                "“Không cần (phải) cao/đắt ...”."
              ],
              [
                "Tính từな / Danh từ",
                "N・Aな + で + なくてもいい",
                "{静|しず}かでなくてもいい／{会員|かいいん}でなくてもいい",
                "Nhớ “で”."
              ],
              [
                "Biến thể tương đương",
                "～なくてもかまわない／～なくても{大丈夫|だいじょうぶ}／～る{必要|ひつよう}はない",
                "{今日|きょう}は{来|こ}なくてもかまいません。",
                "Độ trang trọng khác nhau; {必要|ひつよう}はない hơi sách vở."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{心配|しんぱい}し《なくてもいい》よ。",
            "Không cần lo đâu."
          ],
          [
            "{今日|きょう}は{無理|むり}に{来|こ}《なくてもいい》です。",
            "Hôm nay không cần phải cố đến đâu ạ."
          ],
          [
            "このイベントは{会員|かいいん}《でなくてもいい》。",
            "Sự kiện này không cần là hội viên cũng được."
          ],
          [
            "{新品|しんぴん}《でなくてもいい》から、{動|うご}けばいい。",
            "Không cần là đồ mới, miễn là chạy được."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-wa-ikenai",
    "title": "～てはいけない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-wa-ikenai.html",
    "points": [
      {
        "id": "vj-te-wa-ikenai",
        "pattern": "～てはいけない",
        "meaning": "Không được…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～てはいけない",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Cấm đoán (trang trọng)",
                "Vて＋は＋いけない／いけません",
                "ここでタバコを{吸|す}ってはいけません。",
                "Biển báo/quy định, lịch sự: ～いけません."
              ],
              [
                "Cấm đoán (trung hòa)",
                "Vて＋は＋いけない",
                "そんなことをしてはいけない。",
                "Dùng nói chung."
              ],
              [
                "Khẩu ngữ",
                "Vちゃ[では/]＋いけない／だめ",
                "{遅|おく}れちゃいけない。 {入|はい}っちゃだめ。",
                "Thân mật; ～だめ mềm hơn."
              ],
              [
                "Trang trọng hơn",
                "Vて＋は＋ならない",
                "{約束|やくそく}を{破|やぶ}ってはならない。",
                "Văn viết/quy định pháp luật."
              ]
            ]
          }
        ],
        "examples": [
          [
            "ここで{写真|しゃしん}を{撮|と}っ《てはいけません》。",
            "Không được chụp ảnh ở đây."
          ],
          [
            "{人|ひと}をからかっ《てはいけない》。",
            "Không được trêu chọc người khác."
          ],
          [
            "{約束|やくそく}は{破|やぶ}っ《てはならない》。",
            "Không được phá vỡ lời hứa."
          ],
          [
            "{危|あぶ}ないから、{線|せん}の{内側|うちがわ}に{入|はい}っ《ちゃだめ》。",
            "Nguy hiểm lắm, đừng bước vào trong vạch."
          ],
          [
            "{部外|ぶがい}{者|しゃ}を{入|い}れ《てはいけません》。",
            "Không được cho người ngoài vào."
          ],
          [
            "{授業|じゅぎょう}{中|ちゅう}に{携帯|けいたい}を{使|つか}っ《てはいけない》。",
            "Trong giờ học không được dùng điện thoại."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ta-hou-ga-ii",
    "title": "～たほうがいい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ta-hou-ga-ii.html",
    "points": [
      {
        "id": "vj-ta-hou-ga-ii",
        "pattern": "～たほうがいい",
        "meaning": "Nên…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ ngắn"
            ],
            "rows": [
              [
                "Khuyên nên làm",
                "V-た + ほうがいい",
                "Nên làm V",
                "{早|はや}く{寝|ね}たほうがいい。"
              ],
              [
                "Khuyên không nên",
                "V-ない + ほうがいい",
                "Không nên làm V",
                "{無理|むり}をしないほうがいい。"
              ],
              [
                "So sánh lựa chọn",
                "V-る + ほうがいい",
                "Làm V thì tốt hơn (so với phương án khác)",
                "{電車|でんしゃ}で{行|い}くほうがいい。"
              ],
              [
                "Lịch sự",
                "～ほうがよい/よろしいです",
                "Trang trọng hơn",
                "{控|ひか}えめに{言|い}うほうがよい。"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{頭|あたま}が{痛|いた}いなら、{今日|きょう}は{早|はや}く《{寝|ね}たほうがいい》よ。",
            "Nếu đau đầu thì hôm nay nên ngủ sớm."
          ],
          [
            "その{件|けん}は、{上司|じょうし}に《{相談|そうだん}したほうがいい》と{思|おも}う。",
            "Việc đó tôi nghĩ là nên bàn với sếp."
          ],
          [
            "{無理|むり}して{働|はたら}か《ないほうがいい》です。",
            "Không nên gắng sức làm việc."
          ],
          [
            "{英語|えいご}と{日本語|にほんご}なら、{日本語|にほんご}で{書|か}く《ほうがいい》。",
            "Nếu giữa tiếng Anh và Nhật, viết bằng tiếng Nhật thì tốt hơn."
          ],
          [
            "この{薬|くすり}は{食後|しょくご}に《{飲|の}んだほうがいい》ですよ。",
            "Thuốc này nên uống sau bữa ăn đấy."
          ],
          [
            "タバコは《{吸|す}わないほうがいい》。",
            "Thuốc lá thì không nên hút."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-tame-ni",
    "title": "～ために",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tame-ni.html",
    "points": [
      {
        "id": "vj-tame-ni",
        "pattern": "～ために",
        "meaning": "Vì…, để…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu trúc với ～ために",
              "Ý nghĩa",
              "Ví dụ ngắn"
            ],
            "rows": [
              [
                "Mục đích",
                "V-る + ために",
                "Để làm V (chủ ngữ có chủ ý)",
                "{合格|ごうかく}するために、{毎日|まいにち}{勉強|べんきょう}する。"
              ],
              [
                "Mục đích (danh từ)",
                "N + の + ために",
                "Vì/để N (mục đích)",
                "{健康|けんこう}のために、{歩|ある}く。"
              ],
              [
                "Nguyên nhân",
                "Mệnh đề + ため(に)",
                "Bởi vì/do (thường kết quả không mong muốn)",
                "{大雨|おおあめ}のため、{中止|ちゅうし}になった。"
              ],
              [
                "Bổ nghĩa danh từ",
                "… + ための + N",
                "N dùng để/cho …",
                "{研究|けんきゅう}のためのデータ。"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{日本|にほん}に{留学|りゅうがく}する《ために》、{日本語|にほんご}を{勉強|べんきょう}している。",
            "Tôi đang học tiếng Nhật để du học Nhật."
          ],
          [
            "{健康|けんこう}《のために》、{毎朝|まいあさ}{30分|さんじゅっぷん}{歩|ある}いています。",
            "Vì sức khỏe, mỗi sáng tôi đi bộ 30 phút."
          ],
          [
            "{事故|じこ}《のため》、{電車|でんしゃ}が{遅|おく}れています。",
            "Do tai nạn, tàu đang bị trễ."
          ],
          [
            "{子|こ}どもが{小|ちい}さい《ため》、{今|いま}は{残業|ざんぎょう}できない。",
            "Vì con còn nhỏ nên hiện tại tôi không thể làm thêm giờ."
          ],
          [
            "{研究|けんきゅう}《のための》{資金|しきん}を{集|あつ}めている。",
            "Đang gây quỹ dùng cho nghiên cứu."
          ],
          [
            "{環境|かんきょう}を{守|まも}る《ために》、プラスチックの{使用|しよう}を{減|へ}らす。",
            "Để bảo vệ môi trường, giảm sử dụng nhựa."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-you-ni",
    "title": "Vように",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/you-ni.html",
    "points": [
      {
        "id": "vj-you-ni",
        "pattern": "Vように",
        "meaning": "Để…, nhằm…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Mệnh lệnh gián tiếp / nhắc nhở",
                "Vる / Vない + ようにしてください",
                "Hãy… / Xin hãy…",
                "{忘|わす}れない ようにしてください。 Làm ơn đừng quên nhé."
              ],
              [
                "Mục đích / để…",
                "Vる / Vない + ように",
                "Để mà… / sao cho…",
                "{遅|おく}れない ように{早|はや}く{出|で}かける。 Ra sớm để không bị trễ."
              ],
              [
                "Cầu mong / hy vọng",
                "Vる / Vない + ように（{祈|いの}る・{願|ねが}う）",
                "Mong rằng…",
                "{合格|ごうかく}でき るように{祈|いの}っています。 Tôi cầu mong là sẽ đỗ."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{彼|かれ}に{会|あ}え 《るように》、{祈|いの}っています。",
            "Tôi cầu mong là có thể gặp được anh ấy."
          ],
          [
            "{忘|わす}れ 《ないように》メモしてください。",
            "Ghi chú lại để khỏi quên nhé."
          ],
          [
            "{遅|おく}れ 《ないように》{気|き}をつけてください。",
            "Hãy chú ý để không bị trễ."
          ],
          [
            "{毎日|まいにち}{勉強|べんきょう}する 《ように》しています。",
            "Tôi đang cố gắng học mỗi ngày."
          ],
          [
            "{風邪|かぜ}をひか 《ないように》マスクをしている。",
            "Mang khẩu trang để không bị cảm."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-node",
    "title": "～ので",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/node.html",
    "points": [
      {
        "id": "vj-node",
        "pattern": "～ので",
        "meaning": "Vì… nên…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại/kết hợp",
              "Cấu tạo với ～ので",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）＋ので",
                "{雨|あめ}が{降|ふ}るので／{雨|あめ}が{降|ふ}ったので",
                "Dạng thường, cả khẳng định & quá khứ"
              ],
              [
                "Tính từ い",
                "Aい（{普通|ふつう}{形|けい}）＋ので",
                "{寒|さむ}いので／{忙|いそが}しかったので",
                "Giữ nguyên đuôi い"
              ],
              [
                "Tính từ な",
                "Aな＋ので",
                "{静|しず}かなので／{有名|ゆうめい}だったので",
                "Bắt buộc thêm な"
              ],
              [
                "Danh từ",
                "N＋なので",
                "{子|こ}どもなので／{雨|あめ}だったので",
                "Bắt buộc thêm な (dạng なので)"
              ],
              [
                "Lịch sự",
                "～ですので",
                "{雨|あめ}ですので、{足元|あしもと}にご{注意|ちゅうい}ください。",
                "Lịch sự, trang trọng"
              ],
              [
                "Tối giản",
                "～ので、…",
                "…ので、{失礼|しつれい}します。",
                "Đặt mệnh đề lý do trước"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{雨|あめ}が{降|ふ}っている《ので》、{出|で}かけません。",
            "Vì trời đang mưa nên tôi không ra ngoài."
          ],
          [
            "ここは{静|しず}か《なので》、{勉強|べんきょう}しやすいです。",
            "Vì ở đây yên tĩnh nên dễ học."
          ],
          [
            "{子|こ}ども《なので》、わがままを{言|い}うこともあります。",
            "Vì là trẻ con nên đôi khi cũng ích kỷ."
          ],
          [
            "{忙|いそが}しい《ので》、{後|あと}で{電話|でんわ}します。",
            "Vì bận nên tôi sẽ gọi lại sau."
          ],
          [
            "{渋滞|じゅうたい}だっ《たので》、{遅|おく}れました。",
            "Vì tắc đường nên tôi đã đến muộn."
          ],
          [
            "{明日|あした}は{雨|あめ}《ですので》、{傘|かさ}をお{持|も}ちください。",
            "Vì mai mưa nên xin vui lòng mang ô."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-no-desu",
    "title": "～のです",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/no-desu.html",
    "points": [
      {
        "id": "vj-no-desu",
        "pattern": "～のです",
        "meaning": "Là vì…, đấy là…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Kết hợp",
              "Công thức với ～のです",
              "Ví dụ cấu trúc",
              "Ghi chú/biến thể"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）＋のです",
                "{行|い}くのです／{行|い}ったのです",
                "Khẩu ngữ: んです"
              ],
              [
                "Tính từ い",
                "Aい（{普通|ふつう}{形|けい}）＋のです",
                "{寒|さむ}いのです／{難|むずか}しかったのです",
                "Khẩu ngữ: んです"
              ],
              [
                "Tính từ な",
                "Aな＋のです",
                "{静|しず}かなのです/ {静|しず}かだったのです",
                "Phải có な → なのです"
              ],
              [
                "Danh từ",
                "N＋なのです",
                "{医者|いしゃ}なのです／{雨|あめ}だったのです",
                "N + なのです"
              ],
              [
                "Hỏi",
                "～のですか／～んですか",
                "どうしたんですか。",
                "Hỏi để làm rõ lý do/bối cảnh"
              ],
              [
                "Nhẹ hóa",
                "～んですが、…",
                "お{願|ねが}いがあるんですが…",
                "Mở đầu yêu cầu/lời nhờ"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{道|みち}が{混|こ}んでいた《のです》。",
            "Đường bị tắc đấy (lý do là vậy)."
          ],
          [
            "どうして{来|こ}なかった《んですか》。",
            "Tại sao bạn đã không đến vậy?"
          ],
          [
            "{実|じつ}は、{明日|あした}{国|くに}へ{帰|かえ}る《んです》。",
            "Thực ra, mai tôi về nước."
          ],
          [
            "{彼|かれ}は{医者|いしゃ}《なんです》。",
            "Anh ấy là bác sĩ đấy (giải thích, nhấn mạnh)."
          ],
          [
            "{寒|さむ}い《んですが》、{窓|まど}を{閉|し}めてもいいですか。",
            "Trời lạnh nên tôi đóng cửa sổ được chứ?"
          ],
          [
            "{会社|かいしゃ}を{辞|や}めたのは、{病気|びょうき}が{理由|りゆう}《なのです》。",
            "Lý do tôi nghỉ việc là do bệnh."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-n-desu",
    "title": "～んです",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/n-desu.html",
    "points": [
      {
        "id": "vj-n-desu",
        "pattern": "～んです",
        "meaning": "Là…, đấy là… (giải thích)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu trúc với ～んです",
              "Ví dụ ngắn",
              "Ý nghĩa/ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）+ んです",
                "{遅|おく}れたんです。",
                "Đưa lý do/giải thích."
              ],
              [
                "Tính từ -い",
                "Aい + んです",
                "{暑|あつ}いんです。",
                "Trình bày bối cảnh/cảm nhận."
              ],
              [
                "Tính từ -な",
                "Aな + んです / Aなんです",
                "{静|しず}かなんです。",
                "Thường dùng なんです sau N/Adj-na."
              ],
              [
                "Danh từ",
                "N + なんです",
                "{明日|あした}、{試験|しけん}なんです。",
                "Không dùng “Nんです”."
              ],
              [
                "Nghi vấn",
                "～んですか / ～のですか",
                "どうしたんですか。",
                "Hỏi mang sắc thái tìm hiểu/nguyên do."
              ],
              [
                "Lịch sự",
                "～んです／～んですが",
                "お{願|ねが}いがあるんですが。",
                "Dẫn nhập lời nhờ vả/yêu cầu."
              ]
            ]
          }
        ],
        "examples": [
          [
            "どうした《んですか》。",
            "Có chuyện gì vậy (vì sao)?"
          ],
          [
            "{遅|おく}れた《んです》。{電車|でんしゃ}が{止|と}まっていた《んです》。",
            "Tôi đến muộn. Vì tàu dừng chạy."
          ],
          [
            "{実|じつ}は、{明日|あした}{引|ひ}っ{越|こ}す《んです》。",
            "Thật ra ngày mai tôi chuyển nhà."
          ],
          [
            "ちょっと{相談|そうだん}したい《んですが》、{今|いま}お{時間|じかん}ありますか。",
            "Tôi muốn trao đổi chút, bây giờ anh, chị có thời gian không?"
          ],
          [
            "この{店|みせ}は{量|りょう}が{多|おお}い《んです》よ。",
            "Quán này phần ăn nhiều đấy."
          ],
          [
            "{頭|あたま}が{痛|いた}い《んです》。{今日|きょう}は{帰|かえ}ってもいいですか。",
            "Đầu tôi đau. Hôm nay tôi về được không ạ?"
          ],
          [
            "{静|しず}か《なんです》。ここで{勉強|べんきょう}しましょう。",
            "Chỗ này yên tĩnh. Ta học ở đây nhé."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-sorede",
    "title": "文～。それで文～。",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/sorede.html",
    "points": [
      {
        "id": "vj-sorede",
        "pattern": "文～。それで文～。",
        "meaning": "Và vì thế…, do đó…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ ngắn",
              "Ghi chú"
            ],
            "rows": [
              [
                "{文|ぶん}。それで、{文|ぶん}。",
                "vì thế/do đó",
                "{雨|あめ}だった。それで、{中止|ちゅうし}した。",
                "S2 là kết quả, quyết định, hành động phát sinh."
              ],
              [
                "それで？",
                "rồi sao?/thế nên?",
                "それで？ どうなったの？",
                "Câu hỏi thúc giục kể tiếp (khẩu ngữ)."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{雨|あめ}が{降|ふ}っていた。《それで》、{試合|しあい}は{中止|ちゅうし}になった。",
            "Trời mưa. Vì thế, trận đấu bị hủy."
          ],
          [
            "{頭|あたま}が{痛|いた}かった。《それで》、{早退|そうたい}した。",
            "Đầu tôi đau. Vì vậy tôi xin về sớm."
          ],
          [
            "プリンターが{壊|こわ}れた。《それで》、{新|あたら}しいのを{買|か}った。",
            "Máy in hỏng. Thế là tôi mua cái mới."
          ],
          [
            "{会議|かいぎ}が{長引|ながび}いた。《それで》、{連絡|れんらく}が{遅|おく}れました。",
            "Họp kéo dài. Do vậy tôi liên lạc muộn."
          ],
          [
            "《それで？》 {彼|かれ}は{何|なん}て{言|い}ったの。",
            "Rồi sao? Anh ấy nói gì?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-tsumori",
    "title": "～つもり",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tsumori.html",
    "points": [
      {
        "id": "vj-tsumori",
        "pattern": "～つもり",
        "meaning": "Dự định…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc với ～つもり",
              "Ý nghĩa",
              "Ví dụ ngắn"
            ],
            "rows": [
              [
                "Ý định làm",
                "V-る + つもりだ",
                "Dự định/sẽ làm V",
                "{来年|らいねん}{留学|りゅうがく}するつもりだ。"
              ],
              [
                "Ý định không làm",
                "V-ない + つもりだ",
                "Dự định không làm V",
                "{今日|きょう}は{飲|の}まないつもりだ。"
              ],
              [
                "Đã nghĩ là đã làm",
                "V-た + つもりだ",
                "Tưởng là đã V",
                "もう{送|おく}ったつもりだ。"
              ],
              [
                "Danh từ",
                "N + の + つもりだ",
                "Coi như là N / với ý là N",
                "{冗談|じょうだん}のつもりだ。"
              ],
              [
                "Phủ định mạnh",
                "V-る + つもりはない",
                "Không hề có ý định",
                "やめるつもりはない。"
              ],
              [
                "Quá khứ",
                "～つもりだった（が/のに）",
                "Đã định … nhưng",
                "{行|い}くつもりだったが、{行|い}けなかった。"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{週末|しゅうまつ}は{家|いえ}でゆっくり{過|す}ごす《つもりだ》。",
            "Cuối tuần tôi định ở nhà thư giãn."
          ],
          [
            "{今年|ことし}は{無駄遣|むだづか}いをし《ないつもりです》。",
            "Năm nay tôi dự định không tiêu xài lãng phí."
          ],
          [
            "{片付|かたづ}け《たつもりだ》ったが、まだ{散|ち}らかっている。",
            "Tưởng là đã dọn rồi mà vẫn bừa bộn."
          ],
          [
            "{冗談|じょうだん}《のつもりで》{言|い}ったが、{彼|かれ}は{怒|おこ}ってしまった。",
            "Tôi nói với ý là đùa, nhưng anh ấy lại giận."
          ],
          [
            "{彼|かれ}は{来週|らいしゅう}から{本気|ほんき}で{勉強|べんきょう}する《つもりだと》{言|い}っている。",
            "Anh ấy nói là định học nghiêm túc từ tuần sau."
          ],
          [
            "{人|ひと}を{傷|きず}つける《つもりはない》。",
            "Tôi không có ý làm tổn thương ai."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-you-to-omou",
    "title": "～ようと思う",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/you-to-omou.html",
    "points": [
      {
        "id": "vj-you-to-omou",
        "pattern": "～ようと思う",
        "meaning": "Định…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Ý hướng ({意向|いこう}{形|けい}) + と{思|おも}う",
                "Vよう + と{思|おも}う",
                "{帰|かえ}ろうと{思|おも}う。",
                "Quyết định/ý định tại thời điểm nói, sắc thái tự nhủ."
              ],
              [
                "Ý hướng + と{思|おも}っています",
                "Vよう + と{思|おも}っている",
                "{留学|りゅうがく}しようと{思|おも}っています。",
                "Ý định đã hình thành từ trước, kéo dài hiện tại."
              ],
              [
                "Phủ định (trang trọng/văn viết)",
                "Vるまい + と{思|おも}う",
                "{二度|にど}と{喫煙|きつえん}するまいと{思|おも}う。",
                "Thay cho 「Vるつもりはない」, văn phong cứng."
              ],
              [
                "Ý hướng động từ bất quy tắc",
                "する→しよう ／ くる→こよう",
                "{運動|うんどう}しようと{思|おも}う。/ {明日|あした}こようと{思|おも}う。",
                "Ngũ đoạn: ～う, Nhất đoạn: ～よう."
              ],
              [
                "Thì quá khứ",
                "Vよう + と{思|おも}った",
                "やめようと{思|おも}ったが、{続|つづ}けた。",
                "Ý định tại một thời điểm quá khứ."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{今日|きょう}は{早|はや}く《{帰|かえ}ろうと{思|おも}う》。",
            "Tôi nghĩ là hôm nay sẽ về sớm."
          ],
          [
            "{来年|らいねん}、{日本|にほん}へ《{留学|りゅうがく}しようと{思|おも}っています》。",
            "Tôi định sang Nhật du học năm tới (ý định đã có từ trước)."
          ],
          [
            "{喧嘩|けんか}はやめて、{話|はな}し{合|あ}う《ことにしようと{思|おも}う》。",
            "Tôi nghĩ là thôi cãi nhau, quyết định nói chuyện với nhau."
          ],
          [
            "{甘|あま}い{物|もの}はもう《{食|た}べるまいと{思|おも}う》。",
            "Tôi nghĩ sẽ không ăn đồ ngọt nữa."
          ],
          [
            "やっぱりこの{仕事|しごと}、{続|つづ}け《ようと{思|おも}う》。",
            "Nghĩ lại thì tôi sẽ tiếp tục công việc này."
          ],
          [
            "{雨|あめ}が{強|つよ}いから、タクシーで{行|い}《こうと{思|おも}った》が、やめた。",
            "Vì mưa to nên đã định đi taxi, nhưng thôi."
          ],
          [
            "{彼|かれ}は{会社|かいしゃ}を{辞|や}め《ようと{思|おも}っている》ようだ。",
            "Có vẻ anh ấy đang định nghỉ việc."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-to-omou",
    "title": "～と思う",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/to-omou.html",
    "points": [
      {
        "id": "vj-to-omou",
        "pattern": "～と思う",
        "meaning": "Nghĩ là…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Thành phần",
              "Cấu tạo với ～と{思|おも}う",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Mệnh đề",
                "{普通|ふつう}{形|けい} + と + {思|おも}う",
                "{明日|あした}は{雨|あめ}だと{思|おも}う",
                "Biểu thị suy nghĩ/ý kiến"
              ],
              [
                "i/na-adj",
                "い{形容詞|けいようし} + と + {思|おも}う／な{形容詞|けいようし} + だ + と + {思|おも}う",
                "{難|むずか}しいと{思|おも}う／{便利|べんり}だと{思|おも}う",
                "Na-adj cần だ trong văn viết"
              ],
              [
                "Danh từ",
                "N + だ + と + {思|おも}う",
                "{彼|かれ}は{医者|いしゃ}だと{思|おも}う",
                "Có thể lược だ trong khẩu ngữ"
              ],
              [
                "Hồi ức",
                "～だった／～ではなかった + と + {思|おも}う",
                "{学生|がくせい}だったと{思|おも}う",
                "“Tôi nhớ là/ hình như đã …”"
              ],
              [
                "Tiêu cực",
                "～ない + と + {思|おも}う／～と + {思|おも}わない",
                "{行|い}かないと{思|おも}う／{行|い}くとは{思|おも}わない",
                "Khác biệt sắc thái (phạm vi phủ định)"
              ],
              [
                "Trạng thái",
                "～と{思|おも}っています",
                "{結婚|けっこん}しようと{思|おも}っています",
                "Ý định/suy nghĩ đã hình thành và kéo dài"
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{案|あん}が{一番|いちばん}{現実|げんじつ}{的|てき}だ《と{思|おも}います》。",
            "Tôi nghĩ phương án này thực tế nhất."
          ],
          [
            "{明日|あした}は{雨|あめ}《だと{思|おも}う》。{傘|かさ}を{持|も}っていこう。",
            "Tôi nghĩ mai trời mưa. Mang ô thôi."
          ],
          [
            "{彼|かれ}は{真面目|まじめ}《だと{思|おも}わない》。",
            "Tôi không cho rằng anh ấy nghiêm túc."
          ],
          [
            "{彼|かれ}が{来|く}る《とは{思|おも}わなかった》。",
            "Tôi đã không nghĩ là anh ấy sẽ đến."
          ],
          [
            "{来年|らいねん}{留学|りゅうがく}し《ようと{思|おも}っています》。",
            "Tôi đang định năm sau đi du học."
          ],
          [
            "{多分|たぶん}、{間|ま}に{合|あ}わ《ないと{思|おも}う》。",
            "Có lẽ tôi nghĩ là không kịp."
          ],
          [
            "これは{誤解|ごかい}《だと{思|おも}うんですが》、もう{一|いち}{度|ど}{確認|かくにん}してもいいですか。",
            "Tôi nghĩ đây là hiểu lầm, tôi kiểm tra lại được không?"
          ],
          [
            "{昔|むかし}はもっと{静|しず}か《だったと{思|おも}う》。",
            "Tôi nhớ là hồi xưa yên tĩnh hơn."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-masu-you-ni",
    "title": "～ますように",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/masu-you-ni.html",
    "points": [
      {
        "id": "vj-masu-you-ni",
        "pattern": "～ますように",
        "meaning": "Mong rằng…, cầu mong…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc với ～ますように",
              "Ví dụ",
              "Ý nghĩa/ghi chú"
            ],
            "rows": [
              [
                "Khẳng định",
                "V-ます + ように",
                "{合格|ごうかく}しますように",
                "Tôi hy vọng/cầu mong…"
              ],
              [
                "Phủ định",
                "V-ません + ように",
                "{失敗|しっぱい}しませんように",
                "Mong là không…"
              ],
              [
                "N/Na",
                "N/Na + であります + ように",
                "ご{健康|けんこう}でありますように",
                "Trang trọng (văn viết/thiệp chúc)"
              ],
              [
                "Cụm cầu chúc",
                "～ますように + {祈|いの}る／{願|ねが}う",
                "{成功|せいこう}しますようにお{祈|いの}りします",
                "Tăng trang trọng/lịch sự"
              ],
              [
                "Cụm yêu cầu (business)",
                "V-ます + ように + お{願|ねが}いします",
                "ご{確認|かくにん}くださいますようにお{願|ねが}いいたします",
                "Diễn đạt yêu cầu lịch sự, không phải “ước”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}、いい{結果|けっか}が{出|で}《ますように》。",
            "Mong ngày mai sẽ có kết quả tốt."
          ],
          [
            "どうか{手術|しゅじゅつ}が{無事|ぶじ}に{終|お}わり《ますように》。",
            "Xin mong ca phẫu thuật kết thúc suôn sẻ."
          ],
          [
            "{雨|あめ}が{降|ふ}り《ませんように》。",
            "Mong là trời không mưa."
          ],
          [
            "{皆|みな}さまのご{健康|けんこう}《でありますように》。",
            "Kính chúc quý vị luôn mạnh khỏe."
          ],
          [
            "{良|よ}い{一年|いちねん}に《なりますように》。",
            "Chúc một năm mới tốt lành."
          ],
          [
            "{無事|ぶじ}に{帰|かえ}って{来|こ}られ《ますように》。",
            "Mong sẽ về nhà bình an."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-tara-ii",
    "title": "～たらいい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tara-ii.html",
    "points": [
      {
        "id": "vj-tara-ii",
        "pattern": "～たらいい",
        "meaning": "Nếu… thì tốt",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cách nối",
              "Cấu trúc",
              "Ý nghĩa",
              "Ghi chú"
            ],
            "rows": [
              [
                "Đề nghị nhẹ/khuyên",
                "Vた",
                "Vた + らいい[です/]",
                "Nên/… thì tốt",
                "Lịch sự vừa phải"
              ],
              [
                "Ước muốn",
                "Vた",
                "Vた + らいいな[あ/]",
                "Mong là…",
                "Cảm thán cá nhân"
              ],
              [
                "Hỏi ý kiến",
                "Vた",
                "Vた + らいいですか",
                "Tôi nên…?",
                "Xin lời khuyên"
              ],
              [
                "Với Aい/N/Aな",
                "Quá khứ-điều kiện",
                "Aかったら/ Nだったら/ Aなら + いい",
                "Giá mà… thì tốt",
                "Ước muốn giả định"
              ],
              [
                "Biến thể",
                "Vば／Vと",
                "Vばいい／Vといい",
                "Tương tự",
                "Khác sắc thái (x. mục 5)"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{疲|つか}れているなら、{少|すこ}し{休|やす}ん《だらいい》ですよ。",
            "Nếu mệt thì nghỉ một chút là tốt đấy."
          ],
          [
            "{日本|にほん}で{働|はたら}け《たらいいな》。",
            "Ước gì có thể làm việc ở Nhật."
          ],
          [
            "この{問題|もんだい}はどうし《たらいいですか》。",
            "Vấn đề này tôi nên làm thế nào?"
          ],
          [
            "{雨|あめ}がやん《だらいいのに》。",
            "Giá mà tạnh mưa thì tốt."
          ],
          [
            "{時間|じかん}があっ《たらいい》ですね。",
            "Có thời gian thì tốt nhỉ."
          ],
          [
            "もっと{早|はや}く{相談|そうだん}し《たらよかった》ね。",
            "Giá mà đã hỏi sớm hơn thì tốt. (hối tiếc liên quan)"
          ],
          [
            "{参加|さんか}でき《たらいい》ですが、{未定|みてい}です。",
            "Nếu tham gia được thì tốt, nhưng chưa quyết."
          ],
          [
            "{道|みち}に{迷|まよ}ったら、{駅員|えきいん}さんに{聞|き}い《たらいい》。",
            "Nếu lạc đường thì hỏi nhân viên nhà ga là được."
          ]
        ],
        "group": "vj-3"
      }
    ]
  },
  {
    "id": "vj-to-ii",
    "title": "～といい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/to-ii.html",
    "points": [
      {
        "id": "vj-to-ii",
        "pattern": "～といい",
        "meaning": "Nếu… thì tốt",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Công dụng",
              "Cấu tạo với ～といい",
              "Ví dụ cấu trúc",
              "Sắc thái"
            ],
            "rows": [
              [
                "Mong ước/hi vọng",
                "Clause（{普通|ふつう}{形|けい}）＋といい（ですね／んですが）",
                "{雨|あめ}が{降|ふ}らないといいですね。 {早|はや}く{終|お}わるといいんですが。",
                "Hy vọng việc không kiểm soát được."
              ],
              [
                "Gợi ý/lời khuyên",
                "Vる／Vない＋といい[ですよ/]",
                "{早|はや}く{寝|ね}るといいですよ。 {無理|むり}をしないといいですよ。",
                "Đề xuất nhẹ nhàng “làm … thì tốt”."
              ],
              [
                "Với i/na/N",
                "Aい／Aな／N＋だ＋といい",
                "{明日|あした}、{晴|は}れだといいね。 {結果|けっか}が{安全|あんぜん}だといい。",
                "Miêu tả trạng thái mong muốn."
              ],
              [
                "Tương đương",
                "～たらいい／～ばいい",
                "{早|はや}く{寝|ね}たらいいよ。",
                "Mẫu tương tự cho gợi ý/ước muốn."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{試験|しけん}、うまくいく《といいですね》。",
            "Hy vọng kỳ thi suôn sẻ nhỉ."
          ],
          [
            "{忘|わす}れ{物|もの}が{見|み}つかる《といいんですが》。",
            "Mong là sẽ tìm thấy đồ thất lạc."
          ],
          [
            "{時間|じかん}がある《といい》ね、{映画|えいが}に{行|い}こう。",
            "Mong là có thời gian, đi xem phim nào."
          ],
          [
            "{風邪|かぜ}なら、{今日|きょう}は{早|はや}く{休|やす}む《といいですよ》。",
            "Nếu cảm thì hôm nay nghỉ sớm sẽ tốt đấy."
          ],
          [
            "{英語|えいご}は{毎日|まいにち}{少|すこ}しずつ{続|つづ}ける《といい》よ。",
            "Tiếng Anh mỗi ngày duy trì chút sẽ tốt đấy."
          ],
          [
            "{明日|あした}は{晴|は}れ《だといい》なあ。",
            "Ước gì mai trời nắng."
          ]
        ],
        "group": "vj-3"
      }
    ]
  },
  {
    "id": "vj-ba-ii",
    "title": "～ばいい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ba-ii.html",
    "points": [
      {
        "id": "vj-ba-ii",
        "pattern": "～ばいい",
        "meaning": "Nếu… thì tốt / nên…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～ばいい",
              "Ý nghĩa ngắn",
              "Ví dụ cấu trúc"
            ],
            "rows": [
              [
                "Động từ (khẳng định)",
                "V（ば{形|けい}）＋いい",
                "“nên/… là được” (điều kiện đủ)",
                "{行|い}けばいい／{読|よ}めばいい"
              ],
              [
                "Động từ (phủ định)",
                "V[なければ/]＋いい",
                "“không… thì tốt/được”",
                "{無理|むり}しなければいい"
              ],
              [
                "Hỏi cách làm",
                "どう＋V[ば/]＋いい[ですか/]",
                "“tôi nên làm thế nào?”",
                "どうすればいいですか。"
              ],
              [
                "Lịch sự/Trang trọng",
                "～ばよい",
                "Trang trọng của ～ばいい",
                "どうすればよいでしょうか。"
              ],
              [
                "Cảm thán tiếc",
                "～ばいいのに",
                "“giá mà/đáng lẽ nên”",
                "もっと{早|はや}く{言|い}えばいいのに。"
              ],
              [
                "Nhấn tối thiểu",
                "～ばいいだけ[だ/]",
                "“chỉ cần ~ là đủ”",
                "{連絡|れんらく}すればいいだけだ。"
              ]
            ]
          }
        ],
        "examples": [
          [
            "どうすれ《ばいいですか》。",
            "Tôi nên làm thế nào?"
          ],
          [
            "{迷|まよ}ったら、{先生|せんせい}に{聞|き}け《ばいい》。",
            "Nếu bối rối thì hỏi thầy là được."
          ],
          [
            "そんなに{心配|しんぱい}しなけれ《ばいい》。",
            "Không cần lo lắng đến thế đâu."
          ],
          [
            "もっと{勉強|べんきょう}すれ《ばいいのに》。",
            "Giá mà cậu học nhiều hơn (đáng lẽ nên học)."
          ],
          [
            "{雨|あめ}なら、{無理|むり}に{行|い}かなけれ《ばいい》。",
            "Nếu mưa thì không đi cũng được."
          ],
          [
            "{今回|こんかい}は{謝|あやま}れ《ばいいだけだ》。",
            "Lần này chỉ cần xin lỗi là xong."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-hoshii",
    "title": "～てほしい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-hoshii.html",
    "points": [
      {
        "id": "vj-te-hoshii",
        "pattern": "～てほしい",
        "meaning": "Muốn (ai đó) làm…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Thành phần",
              "Cấu tạo với ～てほしい",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Người thực hiện",
                "N（{人|ひと}）に + V-て + ほしい",
                "{君|きみ}に{連絡|れんらく}してほしい。",
                "“に” bắt buộc với người"
              ],
              [
                "Phủ định",
                "N（{人|ひと}）に + V-ないで + ほしい",
                "{遅|おく}れないでほしい。",
                "“đừng làm”"
              ],
              [
                "Mềm hóa",
                "V-て + ほしいんですが",
                "{説明|せつめい}してほしいんですが。",
                "Lịch sự hơn"
              ],
              [
                "Hiện tượng",
                "N（{事象|じしょう}）が + V-て + ほしい",
                "{雨|あめ}が{止|や}んでほしい。",
                "Dùng “が”, không dùng “に”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{静|しず}かにして《ほしい》。",
            "Tôi muốn mọi người giữ yên lặng."
          ],
          [
            "この{提案|ていあん}について{意見|いけん}を{聞|き}かせて《ほしい》。",
            "Tôi muốn nghe ý kiến về đề xuất này."
          ],
          [
            "そんな{言|い}い{方|かた}はしないで《ほしい》。",
            "Mong bạn đừng nói theo cách đó."
          ],
          [
            "{可能|かのう}なら、{今日|きょう}{中|ちゅう}に{連絡|れんらく}して《ほしいんですが》。",
            "Nếu có thể, tôi muốn bạn liên lạc trong hôm nay."
          ],
          [
            "{早|はや}く{春|はる}が{来|き}て《ほしい》。",
            "Tôi mong mùa xuân đến sớm."
          ],
          [
            "{子|こ}どもたちには{夢|ゆめ}をあきらめないで《ほしい》。",
            "Tôi muốn bọn trẻ đừng bỏ cuộc với ước mơ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ru-koto-ni-suru",
    "title": "～ることにする",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ru-koto-ni-suru.html",
    "points": [
      {
        "id": "vj-ru-koto-ni-suru",
        "pattern": "～ることにする",
        "meaning": "Quyết định…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Quyết định",
                "V-る + ことにする",
                "{毎朝|まいあさ}{走|はし}ることにする",
                "Người nói tự quyết định (chủ ý)."
              ],
              [
                "Quá khứ",
                "V-る + ことにした",
                "{留学|りゅうがく}することにした",
                "Đã quyết định (kết quả của cân nhắc)."
              ],
              [
                "Thói quen",
                "V-る/ない + ことにしている",
                "{夜|よ}{更|ふ}かししないことにしている",
                "Quy tắc bản thân, thói quen do tự đặt ra."
              ],
              [
                "Phủ định",
                "V-ない + ことにする",
                "{甘|あま}い{物|もの}を{食|た}べないことにする",
                "Quyết định không làm."
              ],
              [
                "(Biến thể nghĩa khác)",
                "～ということにする",
                "{今日|きょう}は{休|やす}んだということにする",
                "“Xem như/cho là…” (giả định/đánh lạc hướng)."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{今年|ことし}から{毎日|まいにち}{英語|えいご}を{勉強|べんきょう}する《ことにする》。",
            "Từ năm nay tôi quyết định học tiếng Anh mỗi ngày."
          ],
          [
            "{健康|けんこう}のため、{酒|さけ}を{飲|の}ま《ないことにした》。",
            "Vì sức khỏe, tôi đã quyết định không uống rượu."
          ],
          [
            "{節約|せつやく}のため、{外食|がいしょく}は{週|しゅう}{一回|いっかい}にする《ことにしている》。",
            "Để tiết kiệm, tôi tự đặt quy tắc ăn ngoài mỗi tuần một lần."
          ],
          [
            "{雨|あめ}が{強|つよ}いので、{今日|きょう}は{車|くるま}で{行|い}く《ことにする》。",
            "Vì mưa to, hôm nay tôi quyết định đi bằng ô tô."
          ],
          [
            "この{件|けん}は、なかった《ということにしよう》。",
            "Chuyện này coi như chưa từng xảy ra nhé."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ru-koto-ni-naru",
    "title": "～ることになる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ru-koto-ni-naru.html",
    "points": [
      {
        "id": "vj-ru-koto-ni-naru",
        "pattern": "～ることになる",
        "meaning": "Thành ra sẽ…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Kết quả/quyết định (khách quan)",
                "V-る + ことになる",
                "{来月|らいげつ}から{大阪|おおさか}に{転勤|てんきん}することになった",
                "Do hoàn cảnh/quy trình/ý muốn bên ngoài."
              ],
              [
                "Quy định/luật lệ",
                "V-る + ことになっている",
                "{社内|しゃない}では{禁煙|きんえん}ということになっている",
                "Quy tắc hiện hành, thói quen tập thể."
              ],
              [
                "Phủ định",
                "V-ない + ことになる / ～ないことになっている",
                "{明日|あした}は{授業|じゅぎょう}をしないことになる / {持|も}ち{込|こ}みは{禁止|きんし}ということになっている",
                "Không làm theo quyết định/quy định."
              ],
              [
                "Trang trọng",
                "～こととなる",
                "{本|ほん}{公演|こうえん}は{中止|ちゅうし}することとなりました",
                "Văn viết/thông báo trang trọng."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{諸|しょ}{事情|じじょう}により、イベントは{延期|えんき}する《ことになりました》。",
            "Do nhiều lý do, sự kiện đã được quyết định hoãn."
          ],
          [
            "{私|わたし}は{来月|らいげつ}から{大阪|おおさか}に{転勤|てんきん}する《ことになった》。",
            "Tôi sẽ thuyên chuyển về Osaka từ tháng sau (do công ty quyết)."
          ],
          [
            "この{学校|がっこう}では、{教室|きょうしつ}での{飲食|いんしょく}は{禁止|きんし}《ということになっている》。",
            "Ở trường này, việc ăn uống trong lớp bị cấm theo quy định."
          ],
          [
            "{試験|しけん}に{合格|ごうかく}すれば、{入学|にゅうがく}できる《ことになる》。",
            "Nếu đỗ kỳ thi, tức là sẽ được nhập học."
          ],
          [
            "{急遽|きゅうきょ}、{会議|かいぎ}はオンラインで{行|おこな}う《ことになりました》。",
            "Gấp rút quyết định họp trực tuyến."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-nai-koto-ni-suru",
    "title": "～ないことにする",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nai-koto-ni-suru.html",
    "points": [
      {
        "id": "vj-nai-koto-ni-suru",
        "pattern": "～ないことにする",
        "meaning": "Quyết định không…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～ないことにする",
              "Ví dụ cấu trúc",
              "Ý nghĩa"
            ],
            "rows": [
              [
                "Quyết định hiện tại",
                "V-ない + ことにする",
                "{甘|あま}い{物|もの}は{食|た}べないことにする",
                "Quyết định từ nay sẽ không…"
              ],
              [
                "Quyết định đã đưa ra",
                "V-ない + ことにした",
                "タバコは{吸|す}わないことにした",
                "Đã quyết định không…"
              ],
              [
                "Quy tắc duy trì",
                "V-ない + ことにしている",
                "{夜|よ}{更|ふ}かしはしないことにしている",
                "Đặt quy tắc cá nhân, đang duy trì"
              ],
              [
                "Trang trọng",
                "V-ない + こととする",
                "{当日|とうじつ}は{入場|にゅうじょう}を{許可|きょか}しないこととする",
                "Văn bản/quy định"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{健康|けんこう}のために、{夜|よる}{9時|きゅうじ}{以降|いこう}は{食|た}べ《ないことにする》。",
            "Vì sức khỏe, tôi quyết định sau 9 giờ tối sẽ không ăn."
          ],
          [
            "お{金|かね}を{貯|た}めたいので、{外食|がいしょく}はし《ないことにした》。",
            "Tôi đã quyết định không ăn ngoài để tiết kiệm."
          ],
          [
            "{今月|こんげつ}は{無駄遣|むだづか}いをし《ないことにしている》。",
            "Tháng này tôi đang tự đặt quy tắc không tiêu xài hoang phí."
          ],
          [
            "{忙|いそが}しいので、{週末|しゅうまつ}の{旅行|りょこう}には{行|い}か《ないことにする》。",
            "Vì bận nên tôi quyết định không đi du lịch cuối tuần."
          ],
          [
            "{今日|きょう}は{甘|あま}い{飲|の}み{物|もの}は{買|か}わ《ないことにした》。",
            "Hôm nay tôi đã quyết định không mua đồ uống ngọt."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-nai-koto-ni-naru",
    "title": "～ないことになる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nai-koto-ni-naru.html",
    "points": [
      {
        "id": "vj-nai-koto-ni-naru",
        "pattern": "～ないことになる",
        "meaning": "Thành ra không…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～ないことになる",
              "Ví dụ cấu trúc",
              "Ý nghĩa/Ngữ cảnh"
            ],
            "rows": [
              [
                "Hiện tại/kết luận",
                "V-ない + ことになる",
                "{来週|らいしゅう}は{出張|しゅっちょう}に{行|い}かないことになる",
                "Kết cục/được quyết là sẽ không…"
              ],
              [
                "Quá khứ",
                "V-ない + ことになった",
                "{試合|しあい}は{中止|ちゅうし}で、{行|い}かないことになった",
                "Đã được quyết định/đã hóa ra là không…"
              ],
              [
                "Lịch sự",
                "V-ない + ことになりました",
                "{参加|さんか}しないことになりました",
                "Báo lại quyết định một cách lịch sự"
              ],
              [
                "Hệ quả logic",
                "Điều kiện + と／なら + V-ない + ことになる",
                "{落|お}ちると、{卒業|そつぎょう}できないことになる",
                "Suy ra hệ quả không thể…"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{天候|てんこう}{不良|ふりょう}のため、{遠足|えんそく}には{行|い}か《ないことになりました》。",
            "Do thời tiết xấu, đã quyết định không đi dã ngoại."
          ],
          [
            "{人事|じんじ}{異動|いどう}で、{来月|らいげつ}は{大阪|おおさか}へは{行|い}か《ないことになった》。",
            "Vì điều chuyển nhân sự, tháng sau tôi hóa ra sẽ không đi Osaka."
          ],
          [
            "{予算|よさん}が{削減|さくげん}されたので、{海外|かいがい}{出張|しゅっちょう}はし《ないことになった》。",
            "Do cắt giảm ngân sách, đã được quyết là không đi công tác nước ngoài."
          ],
          [
            "この{案|あん}が{否決|ひけつ}されると、{計画|けいかく}は{実施|じっし}でき《ないことになる》。",
            "Nếu đề án bị bác, suy ra kế hoạch sẽ không thể thực hiện."
          ],
          [
            "{規則|きそく}{上|じょう}、{遅刻|ちこく}{三回|さんかい}で{受験|じゅけん}でき《ないことになる》。",
            "Theo quy định, đi trễ 3 lần sẽ thành ra không được dự thi."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-koto",
    "title": "～こと",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/koto.html",
    "points": [
      {
        "id": "vj-koto",
        "pattern": "～こと",
        "meaning": "Việc… / chuyện… (danh từ hóa)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại/kiểu",
              "Cấu tạo với ～こと",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Danh từ hóa (mệnh đề → danh từ)",
                "V（{普通|ふつう}{形|けい}）+ こと",
                "{日本語|にほんご}を{学|まな}ぶこと／{雨|あめ}が{降|ふ}ったこと",
                "Trang trọng hơn ～の; thường dùng trong văn viết/chính thức"
              ],
              [
                "Quy định/Chỉ thị",
                "Vる + こと／Vない + こと",
                "{提出|ていしゅつ}{期限|きげん}を{守|まも}ること。／{教室|きょうしつ}で{騒|さわ}がないこと。",
                "Dạng mệnh lệnh trung tính, thấy trong nội quy/hướng dẫn"
              ],
              [
                "“Điều/việc …” (danh từ khái quát)",
                "（Tính từ/ cụm) + こと",
                "{大切|たいせつ}なこと／{不思議|ふしぎ}なこと",
                "“こと” mang nghĩa “sự việc/điều” trừu tượng"
              ],
              [
                "Cảm thán (văn phong trang trọng)",
                "～こと！（hiếm, văn viết)",
                "なんと{美|うつく}しいこと！",
                "Ngày nay thường dùng “なんて～んだ/ことだ” hơn"
              ],
              [
                "Cụm hóa giải thích",
                "～ということ",
                "{合格|ごうかく}したということ",
                "“rằng/việc là …”; dùng để trích dẫn nội dung"
              ]
            ]
          }
        ],
        "examples": [
          [
            "《{早寝|はやね}{早起|はやお}きすること》は{健康|けんこう}にいい。",
            "Đi ngủ sớm dậy sớm là tốt cho sức khỏe."
          ],
          [
            "ここでは《タバコを{吸|す}わないこと》。",
            "Ở đây không được hút thuốc."
          ],
          [
            "{大切|たいせつ}な《こと》は、{続|つづ}ける《こと》だ。",
            "Điều quan trọng là tiếp tục."
          ],
          [
            "{彼|かれ}が{留学|りゅうがく}する《ということ》を{昨日|きのう}{知|し}った。",
            "Tôi biết “việc anh ấy đi du học” vào hôm qua."
          ],
          [
            "なんて{美|うつく}しい《こと》！",
            "Thật là đẹp biết bao!"
          ],
          [
            "{約束|やくそく}を{守|まも}る《こと》は{信頼|しんらい}の{基本|きほん}だ。",
            "Giữ lời hứa là nền tảng của sự tin cậy."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-kudasaimasenka",
    "title": "～てくださいませんか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-kudasaimasenka.html",
    "points": [
      {
        "id": "vj-te-kudasaimasenka",
        "pattern": "～てくださいませんか",
        "meaning": "Xin vui lòng…?",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú sắc thái"
            ],
            "rows": [
              [
                "Xin làm (lịch sự cao)",
                "V-て + くださいませんか",
                "{見|み}てくださいませんか",
                "Câu hỏi phủ định lịch sự, đề nghị nhẹ nhàng"
              ],
              [
                "Rất lịch sự (quá khứ)",
                "V-て + くださいませんでしたか",
                "{教|おし}えてくださいませんでしたか",
                "Hỏi lại chẳng phải đã làm… sao, không phải lời nhờ"
              ],
              [
                "Kết hợp danh từ (kính ngữ)",
                "ご/お + N/{連用形|れんようけい} + くださいませんか",
                "ご{確認|かくにん}くださいませんか",
                "Mẫu doanh nghiệp, trang trọng văn bản"
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{書類|しょるい}を{確認|かくにん}して《くださいませんか》。",
            "Ngài có thể vui lòng kiểm tra tài liệu này được không ạ?"
          ],
          [
            "もう{一度|いちど}ご{説明|せつめい}《くださいませんか》。",
            "Xin vui lòng giải thích lại một lần nữa ạ."
          ],
          [
            "{恐|おそ}れ{入|い}りますが、{明日|あした}までにご{返信|へんしん}《くださいませんか》。",
            "Thật xin lỗi, nhưng xin vui lòng phản hồi trước ngày mai ạ."
          ],
          [
            "{席|せき}を{少|すこ}し{詰|つ}めて《くださいませんか》。",
            "Anh, chị có thể vui lòng ngồi dồn lại một chút được không ạ?"
          ],
          [
            "お{手|て}すきの{際|さい}にご{連絡|れんらく}《くださいませんか》。",
            "Khi rảnh, xin vui lòng liên lạc giúp tôi ạ."
          ],
          [
            "{失礼|しつれい}ですが、お{名前|なまえ}を{伺|うかが}わせて《くださいませんか》。",
            "Xin thất lễ, tôi có thể biết tên quý vị được không ạ?"
          ],
          [
            "{先|さき}ほどの{点|てん}について、もう{少|すこ}し{具体|ぐたい}{例|れい}を{挙|あ}げて《くださいませんか》。",
            "Về điểm vừa rồi, xin vui lòng nêu thêm ví dụ cụ thể ạ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-itadakemasenka",
    "title": "～ていただけませんか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-itadakemasenka.html",
    "points": [
      {
        "id": "vj-te-itadakemasenka",
        "pattern": "～ていただけませんか",
        "meaning": "Có thể vui lòng…? (lịch sự)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～ていただけませんか",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vて + いただけませんか",
                "ゆっくり{話|はな}していただけませんか。",
                "Yêu cầu rất lịch sự, khiêm nhường ({謙譲|けんじょう}{語|ご}) xin người nghe làm gì cho mình/nhóm mình."
              ],
              [
                "Danh động từ (サ{変|へん})",
                "ご/お + N + いただけませんか hoặc Nを + Vて + いただけませんか",
                "ご{説明|せつめい}いただけませんか。/ {説明|せつめい}していただけませんか。",
                "Dạng danh hóa kính ngữ: ご{説明|せつめい}・ご{連絡|れんらく}・ご{確認|かくにん}・ご{対応|たいおう}…"
              ],
              [
                "Biến thể lịch sự",
                "Vて + いただけますか／いただけませんでしょうか／いただけないでしょうか",
                "ご{連絡|れんらく}していただけないでしょうか。",
                "Dạng phủ định làm mềm yêu cầu; 〜ませんでしょうか trang trọng hơn."
              ],
              [
                "Xin phép để mình làm",
                "Vさせて + いただけませんか",
                "{写真|しゃしん}を{撮|と}らせていただけませんか。",
                "Khác nghĩa: xin cho phép “tôi được làm…”."
              ]
            ]
          }
        ],
        "examples": [
          [
            "もう{一度|いちど}ゆっくり《{話|はな}していただけませんか》。",
            "Anh, chị có thể nói chậm lại một lần nữa được không ạ?"
          ],
          [
            "こちらにお{名前|なまえ}を《ご{記入|きにゅう}いただけませんか》。",
            "Xin vui lòng điền tên vào đây ạ."
          ],
          [
            "お{手数|てすう}ですが、{資料|しりょう}をメールで《{送|おく}っていただけませんか》。",
            "Phiền anh, chị gửi tài liệu qua email giúp tôi được không ạ."
          ],
          [
            "{明日|あした}の{会議|かいぎ}の{時間|じかん}を《{教|おし}えていただけませんでしょうか》。",
            "Anh, chị có thể cho tôi biết giờ họp ngày mai được không ạ."
          ],
          [
            "{道|みち}に{迷|まよ}ってしまって、{駅|えき}まで《{案内|あんない}していただけないでしょうか》。",
            "Tôi bị lạc, anh, chị có thể đưa tôi đến ga được không ạ."
          ],
          [
            "もし{可能|かのう}でしたら、{見積|みつもり}{書|しょ}を{本日|ほんじつ}{中|ちゅう}に《ご{提出|ていしゅつ}いただけますか》。",
            "Nếu có thể, anh, chị nộp báo giá trong hôm nay giúp được không ạ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-moraemasenka",
    "title": "～てもらえませんか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-moraemasenka.html",
    "points": [
      {
        "id": "vj-te-moraemasenka",
        "pattern": "～てもらえませんか",
        "meaning": "Nhờ giúp được không?",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mức lịch sự",
              "Cấu tạo với ～てもらえませんか",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Lịch sự tiêu chuẩn",
                "V-て + もらえませんか",
                "ここを{説明|せつめい}してもらえませんか",
                "Yêu cầu lịch sự, phủ định để làm mềm"
              ],
              [
                "Lịch sự vừa",
                "V-て + もらえますか",
                "{見|み}てもらえますか",
                "Ít mềm hơn 〜もらえませんか"
              ],
              [
                "Rất lịch sự",
                "V-て + いただけませんか",
                "ご{説明|せつめい}していただけませんか",
                "Khiêm nhường, dùng với khách/tiền bối"
              ],
              [
                "Thân mật",
                "V-て + もらえない？",
                "{手伝|てつだ}ってもらえない？",
                "Dùng với bạn bè/người thân"
              ],
              [
                "Chỉ định tác nhân",
                "N に V-て + もらえませんか",
                "{田中|たなか}さんに{説明|せつめい}してもらえませんか",
                "Nhờ một người cụ thể thực hiện"
              ]
            ]
          }
        ],
        "examples": [
          [
            "すみませんが、この{書類|しょるい}を{確認|かくにん}して《もらえませんか》。",
            "Xin lỗi, anh, chị có thể kiểm tra giúp tài liệu này không?"
          ],
          [
            "{恐|おそ}れ{入|い}りますが、{明日|あした}までにご{連絡|れんらく}して《もらえませんか》。",
            "Phiền anh, chị liên lạc giúp trước ngày mai được không ạ?"
          ],
          [
            "{田中|たなか}さんに{会議|かいぎ}で{説明|せつめい}して《もらえませんか》。",
            "Có thể nhờ anh Tanaka trình bày ở cuộc họp không?"
          ],
          [
            "もう{少|すこ}しゆっくり{話|はな}して《もらえませんか》。",
            "Anh, chị nói chậm hơn chút được không?"
          ],
          [
            "この{写真|しゃしん}、メールで{送|おく}って《もらえませんか》。",
            "Anh, chị gửi giúp bức ảnh này qua email được không?"
          ],
          [
            "{駅|えき}まで{案内|あんない}して《もらえませんか》。",
            "Anh, chị chỉ đường giúp tôi đến ga được không?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-kuremasenka",
    "title": "～てくれませんか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-kuremasenka.html",
    "points": [
      {
        "id": "vj-te-kuremasenka",
        "pattern": "～てくれませんか",
        "meaning": "Có thể… cho tôi không?",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng yêu cầu",
              "Cấu trúc",
              "Ví dụ",
              "Mức lịch sự"
            ],
            "rows": [
              [
                "Xin ai đó làm cho mình",
                "V-て + くれませんか",
                "{手伝|てつだ}ってくれませんか",
                "Lịch sự vừa (polite-casual)"
              ],
              [
                "Lịch sự hơn",
                "V-て + くださいませんか",
                "{見|み}せてくださいませんか",
                "Cao hơn, tôn kính"
              ],
              [
                "Trung tính",
                "V-て + くれますか",
                "{説明|せつめい}してくれますか",
                "Hỏi lịch sự thường"
              ],
              [
                "Thân mật",
                "V-て + くれない？",
                "ちょっと{待|ま}ってくれない？",
                "Thân mật/mềm"
              ]
            ]
          }
        ],
        "examples": [
          [
            "すみません、この{席|せき}を{譲|ゆず}って《くれませんか》。",
            "Xin lỗi, anh, chị nhường chỗ này cho tôi được không?"
          ],
          [
            "{窓|まど}を{開|あ}けて《くれませんか》。ちょっと{暑|あつ}いので。",
            "Anh, chị mở cửa sổ giúp được không? Hơi nóng quá."
          ],
          [
            "もう{一度|いちど}ゆっくり{説明|せつめい}して《くれませんか》。",
            "Anh, chị giải thích lại chậm một chút được không?"
          ],
          [
            "その{資料|しりょう}、メールで{送|おく}って《くれませんか》。",
            "Anh, chị gửi tài liệu đó qua mail giúp được không?"
          ],
          [
            "{写真|しゃしん}を{撮|と}って《くれませんか》。",
            "Chụp giúp tôi tấm ảnh được không?"
          ],
          [
            "{道|みち}に{迷|まよ}ってしまって、{駅|えき}まで{案内|あんない}して《くれませんか》。",
            "Tôi bị lạc, anh, chị dẫn tôi tới ga được không?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-nasai",
    "title": "～なさい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/nasai.html",
    "points": [
      {
        "id": "vj-nasai",
        "pattern": "～なさい",
        "meaning": "Hãy… (mệnh lệnh nhẹ nhàng)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～なさい",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Mệnh lệnh lịch sự (trên→dưới)",
                "V-ます bỏ ます + なさい",
                "{早|はや}く{寝|ね}なさい。",
                "Cha mẹ, thầy cô, biển nhắc nhở, nội quy nhẹ"
              ],
              [
                "Bất quy tắc",
                "する→しなさい；{来|く}る→{来|き}なさい[きなさい/]",
                "{宿題|しゅくだい}をしなさい。{早|はや}く{来|き}なさい。",
                "{来|き}なさい đọc きなさい"
              ],
              [
                "Trích dẫn",
                "「Vます + なさい」と{言|い}う",
                "{先生|せんせい}は{座|すわ}りなさいと{言|い}った。",
                "Tường thuật mệnh lệnh"
              ],
              [
                "Cấm đoán (tham khảo)",
                "Vる + な",
                "ここでタバコを{吸|す}うな。",
                "Không phải ～なさい; thô hơn, cấm tuyệt đối"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{静|しず}かにし《なさい》。",
            "Hãy trật tự."
          ],
          [
            "ここに{名前|なまえ}を{書|か}き《なさい》。",
            "Hãy viết tên vào đây."
          ],
          [
            "{危|あぶ}ないから{手|て}をつないで{歩|ある}き《なさい》。",
            "Nguy hiểm nên hãy nắm tay mà đi."
          ],
          [
            "{早|はや}くお{風呂|ふろ}に{入|はい}り《なさい》。",
            "Mau vào tắm đi."
          ],
          [
            "{宿題|しゅくだい}を{今日|きょう}のうちに{終|お}わらせ《なさい》。",
            "Hãy hoàn thành bài tập trong hôm nay."
          ],
          [
            "{早|はや}く{来|き}《なさい》、{授業|じゅぎょう}が{始|はじ}まるよ。",
            "Mau đến đi, sắp bắt đầu học rồi."
          ],
          [
            "{先生|せんせい}は「{席|せき}に{戻|もど}り《なさい》」と{言|い}った。",
            "Cô giáo nói: “Hãy về chỗ ngồi”."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-tara-dou-desu-ka",
    "title": "～たらどうですか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tara-dou-desu-ka.html",
    "points": [
      {
        "id": "vj-tara-dou-desu-ka",
        "pattern": "～たらどうですか",
        "meaning": "Nếu… thì sao? (gợi ý)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～たらどうですか",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vた + ら + どうですか／どう？",
                "{病院|びょういん}に{行|い}ったらどうですか。",
                "Đề nghị/khuyên nhẹ nhàng, sắc thái tùy ngữ cảnh."
              ],
              [
                "Trang trọng",
                "Vた + ら + いかがですか",
                "{一度|いちど}{担当|たんとう}{者|しゃ}に{確認|かくにん}したらいかがですか。",
                "Lịch sự hơn どうですか."
              ],
              [
                "Thân mật",
                "Vた + ら？",
                "{少|すこ}し{休|やす}んだら？",
                "Rất đời thường; có thể nghe hơi “xóc” nếu bối cảnh không thân."
              ],
              [
                "Gợi ý “không làm”",
                "V-るのをやめる + たらどう？／Vないでおく + たらどう？",
                "{無理|むり}するのをやめたらどう？",
                "Không dùng “Vなかったらどう” để khuyên “đừng làm”."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{頭|あたま}が{痛|いた}いなら、{今日|きょう}は{早|はや}く{寝|ね}《たらどうですか》。",
            "Nếu đau đầu thì hôm nay sao không ngủ sớm đi."
          ],
          [
            "わからないところは{先生|せんせい}に{聞|き}い《たらどう？》",
            "Phần không hiểu thì hỏi thầy cô xem sao?"
          ],
          [
            "その{靴|くつ}、もう{捨|す}て《たらどう》。{穴|あな}が{開|あ}いてるよ。",
            "Đôi giày đó vứt đi cho rồi. Thủng rồi kìa."
          ],
          [
            "まず{小|ちい}さい{目標|もくひょう}から{始|はじ}め《たらいかがですか》。",
            "Trước hết bắt đầu từ mục tiêu nhỏ thì thế nào ạ."
          ],
          [
            "{無理|むり}して{働|はたら}くのを《やめたらどう》？{体|からだ}が{大事|だいじ}だよ。",
            "Hay là ngừng cố làm quá đi? Sức khỏe mới quan trọng."
          ]
        ],
        "group": "vj-4"
      }
    ]
  },
  {
    "id": "vj-tara-ikaga-desu-ka",
    "title": "～たらいかがですか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tara-ikaga-desu-ka.html",
    "points": [
      {
        "id": "vj-tara-ikaga-desu-ka",
        "pattern": "～たらいかがですか",
        "meaning": "Nếu… thì sao? (lịch sự)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cách nối",
              "Cấu trúc",
              "Ý nghĩa",
              "Mức độ lịch sự"
            ],
            "rows": [
              [
                "Đề nghị lịch sự",
                "Vた",
                "Vた + らいかがですか",
                "Hay là… thì sao?",
                "Lịch sự hơn 〜たらどうですか"
              ],
              [
                "Biến thể trang trọng",
                "Vて",
                "Vて + はいかがですか",
                "Xin mời/đề xuất",
                "Trang trọng, dịch vụ"
              ],
              [
                "Khung ngữ cảnh",
                "Rào đón",
                "よろしければ、Vたらいかがですか",
                "Mềm hóa đề nghị",
                "Rất lịch sự"
              ]
            ]
          }
        ],
        "examples": [
          [
            "お{体|からだ}の{調子|ちょうし}が{悪|わる}いなら、{病院|びょういん}で{診|み}てもらっ《たらいかがですか》。",
            "Nếu sức khỏe không tốt, anh, chị thử đi khám xem?"
          ],
          [
            "{道|みち}に{迷|まよ}ったなら、{交番|こうばん}で{聞|き}い《たらいかがですか》。",
            "Nếu lạc đường, thử hỏi ở đồn cảnh sát xem?"
          ],
          [
            "このプランで{進|すす}め《たらいかがでしょうか》。",
            "Chúng ta thử triển khai theo kế hoạch này chứ?"
          ],
          [
            "よろしければ、こちらの{席|せき}にお{掛|か}けに《なったらいかがですか》。",
            "Nếu được, xin mời ngồi chỗ này ạ."
          ],
          [
            "{一度|いちど}{専門|せんもん}{家|か}に{相談|そうだん}し《たらいかがですか》。",
            "Anh, chị thử trao đổi với chuyên gia một lần xem?"
          ],
          [
            "もっと{早|はや}めに{出発|しゅっぱつ}し《たらいかが》。",
            "Hay là xuất phát sớm hơn chút đi?"
          ],
          [
            "{資料|しりょう}を{共有|きょうゆう}し《てはいかがですか》。",
            "Hay là chia sẻ tài liệu?"
          ]
        ],
        "group": "vj-4"
      }
    ]
  },
  {
    "id": "vj-te-mo-ii",
    "title": "～てもいい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-mo-ii.html",
    "points": [
      {
        "id": "vj-te-mo-ii",
        "pattern": "～てもいい",
        "meaning": "Được phép…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～てもいい",
              "Ví dụ cấu trúc",
              "Chức năng"
            ],
            "rows": [
              [
                "Xin/cho phép",
                "Vて＋もいい（です／ですか）",
                "ここに{座|すわ}ってもいいですか。",
                "“Tôi/ai đó có thể … chứ?”"
              ],
              [
                "Chấp nhận",
                "N／Aな＋でもいい",
                "{日本語|にほんご}でもいいですか。",
                "“… cũng được”."
              ],
              [
                "Chấp nhận",
                "Aい→Aく＋てもいい",
                "{安|やす}くてもいい。 {時間|じかん}が{短|みじか}くてもいい。",
                "“Dù … cũng được”."
              ],
              [
                "Không cần/phủ định",
                "Vなく＋てもいい",
                "{来|き}なくてもいいです。 {急|いそ}がなくてもいい。",
                "“Không cần … / không làm cũng được”."
              ],
              [
                "Lịch sự/cứng",
                "～てもよい／～てもかまわない",
                "{離席|りせき}してもよろしいですか。",
                "よい／よろしい (rất lịch sự); かまわない (trung lập, hơi lạnh)."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{窓|まど}を{開|あ}け《てもいいですか》。",
            "Tôi mở cửa sổ được chứ?"
          ],
          [
            "ここに{荷物|にもつ}を{置|お}い《てもいい》ですよ。",
            "Để hành lý ở đây cũng được."
          ],
          [
            "{返事|へんじ}は{明日|あした}《でもいい》です。",
            "Trả lời để ngày mai cũng được."
          ],
          [
            "{会議|かいぎ}は{短|みじか}く《てもいい》から、{要点|ようてん}だけ{話|はな}そう。",
            "Họp ngắn cũng được nên chỉ nói điểm chính."
          ],
          [
            "{今日|きょう}は{来|き}《なくてもいい》よ。",
            "Hôm nay không cần đến đâu."
          ],
          [
            "この{席|せき}、{替|か}わっ《てもかまいません》か。",
            "Tôi đổi chỗ có được không ạ?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-you-ni-iu",
    "title": "～ように言う",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/you-ni-iu.html",
    "points": [
      {
        "id": "vj-you-ni-iu",
        "pattern": "～ように言う",
        "meaning": "Nói để (ai) làm…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu trúc với ～ように{言|い}う",
              "Ví dụ cấu trúc",
              "Ý nghĩa/ghi chú"
            ],
            "rows": [
              [
                "Dặn làm",
                "Người + に + Vる + ように{言|い}う",
                "{子|こ}どもに{早|はや}く{寝|ね}るように{言|い}う。",
                "Bảo/nhắc “hãy …”."
              ],
              [
                "Dặn không làm",
                "Người + に + Vない + ように{言|い}う",
                "{学生|がくせい}に{遅刻|ちこく}しないように{言|い}う。",
                "Nhắc “đừng …”."
              ],
              [
                "Nhờ làm (hàm ơn)",
                "Người + に + Vてくれる + ように{言|い}う",
                "{彼|かれ}に{連絡|れんらく}してくれるように{言|い}う。",
                "Yêu cầu ai đó làm cho mình."
              ],
              [
                "Bị dặn/bị bảo",
                "～ように{言|い}われる",
                "{医者|いしゃ}に{運動|うんどう}するように{言|い}われた。",
                "Thể bị động để nêu chỉ thị nhận được."
              ],
              [
                "Biến thể đồng nghĩa",
                "～ように{頼|たの}む／{注意|ちゅうい}する／{指示|しじ}する",
                "{静|しず}かにするように{注意|ちゅうい}した。",
                "“Nhờ/nhắc/ra chỉ thị (làm sao cho…)”."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{先生|せんせい}は{学生|がくせい}《に》、{毎日|まいにち}{復習|ふくしゅう}する《ように{言|い}った》。",
            "Thầy bảo học sinh ôn bài mỗi ngày."
          ],
          [
            "{部長|ぶちょう}《に》、{資料|しりょう}を{明日|あした}までに{提出|ていしゅつ}する《ように{言|い}われました》。",
            "Tôi được trưởng phòng dặn nộp tài liệu trước ngày mai."
          ],
          [
            "{子|こ}ども《に》、{危|あぶ}ないから{川|かわ}に{近|ちか}づか《ないように{言|い}う》。",
            "Tôi dặn con không được lại gần sông vì nguy hiểm."
          ],
          [
            "{受付|うけつけ}《に》、{着|つ}いたら{電話|でんわ}してくれる《ように{言|い}っておきます》。",
            "Tôi sẽ dặn lễ tân gọi cho tôi khi đến."
          ],
          [
            "{会議|かいぎ}では、{携帯|けいたい}はマナーモードにする《ように{言|い}われて》います。",
            "Trong cuộc họp, mọi người được yêu cầu để điện thoại chế độ im lặng."
          ],
          [
            "{医者|いしゃ}は{彼|かれ}《に》、{酒|さけ}を{控|ひか}える《ように{言|い}った》。",
            "Bác sĩ bảo anh ấy hạn chế rượu."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ageru",
    "title": "～をあげる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ageru.html",
    "points": [
      {
        "id": "vj-ageru",
        "pattern": "～をあげる",
        "meaning": "Cho (ai)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～をあげる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Danh từ (vật/ưu đãi)",
                "A が B に N を あげる",
                "{私|わたし}は{友|とも}だちにプレゼントをあげる",
                "“cho/tặng” từ phía người cho (trung tính)"
              ],
              [
                "Đại từ người nhận",
                "A が{彼|かれ}/{彼女|かのじょ}/{子|こ}ども に N を あげる",
                "{父|ちち}が{子|こ}どもにお{菓子|かし}をあげた",
                "Với đối tượng thấp hơn có thể dùng やる (thân mật)"
              ],
              [
                "Kính ngữ",
                "(×) A が{目上|めうえ}に N を あげる",
                "{私|わたし}は{部長|ぶちょう}に{資料|しりょう}をあげる ×",
                "Nên dùng ～をさしあげる khi người nhận là bề trên/khách"
              ],
              [
                "So với người nói",
                "(×) A が{私|わたし}に N を あげる",
                "{彼|かれ}が{私|わたし}に{本|ほん}をあげた ×",
                "Khi người nhận là “tôi/nhóm tôi” phải dùng ～をくれる/～をくださる"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}は{友|とも}だちに{花|はな}を《あげた》。",
            "Tôi tặng hoa cho bạn."
          ],
          [
            "{父|ちち}が{近所|きんじょ}の{子|こ}に{本|ほん}を《あげる》ことにした。",
            "Bố tôi quyết định tặng sách cho bọn trẻ hàng xóm."
          ],
          [
            "{彼女|かのじょ}は{後輩|こうはい}にアドバイスを《あげた》。",
            "Cô ấy cho lời khuyên cho đàn em."
          ],
          [
            "{姉|あね}が{子|こ}どもにおもちゃを《やった》。",
            "Chị tôi cho bọn trẻ đồ chơi. (thân mật, dùng やる)"
          ],
          [
            "{私|わたし}は{先生|せんせい}にプレゼントを《さしあげた》。",
            "Tôi đã kính tặng quà cho thầy. (dùng khi người nhận là bề trên)"
          ],
          [
            "（×）{彼|かれ}が{私|わたし}にチケットを《あげた》 → {彼|かれ}が{私|わたし}にチケットを《くれた》。",
            "(Sửa) Anh ấy đã tặng vé cho tôi → dùng くれる."
          ]
        ],
        "group": "vj-5"
      }
    ]
  },
  {
    "id": "vj-te-ageru",
    "title": "～てあげる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-ageru.html",
    "points": [
      {
        "id": "vj-te-ageru",
        "pattern": "～てあげる",
        "meaning": "Làm cho (ai đó)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～てあげる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-て + あげる/あげます",
                "{私|わたし}は{友|とも}だちにV-てあげる",
                "Chủ thể (người cho) thường là tôi/chúng tôi hoặc người cùng phe"
              ],
              [
                "Đối tượng",
                "N(người) + に + V-てあげる",
                "{彼女|かのじょ}に{手伝|てつだ}ってあげる",
                "Người nhận lợi ích dùng に"
              ],
              [
                "Đề nghị",
                "V-て + あげましょうか",
                "{手伝|てつだ}ってあげましょうか",
                "Đề nghị giúp; dễ mang sắc thái bề trên nếu không khéo"
              ],
              [
                "Kính nhường",
                "V-て + さしあげる",
                "{先生|せんせい}に{説明|せつめい}してさしあげます",
                "Dùng với người trên thay cho ～てあげる"
              ],
              [
                "Thân mật/thô",
                "V-て + やる",
                "{子|こ}どもに{見|み}せてやる",
                "Với động vật/trẻ nhỏ/thân mật; thô nếu dùng sai đối tượng"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}が{彼|かれ}に{日本語|にほんご}を{教|おし}えて《あげます》。",
            "Tôi sẽ dạy tiếng Nhật cho anh ấy."
          ],
          [
            "{子|こ}どもに{本|ほん}を{読|よ}んで《あげた》。",
            "Tôi đã đọc sách cho con."
          ],
          [
            "{駅|えき}まで《{送|おく}ってあげようか》。",
            "Tôi chở ra ga nhé?"
          ],
          [
            "{友|とも}だちの{引|ひ}っ{越|こ}しを{手伝|てつだ}って《あげた》。",
            "Tôi đã giúp bạn chuyển nhà."
          ],
          [
            "そんなことまで{言|い}って《あげる》{必要|ひつよう}はないよ。",
            "Không cần nói giúp đến mức đó đâu."
          ],
          [
            "{先生|せんせい}には{後日|ごじつ}ご{説明|せつめい}して《さしあげます》。",
            "Với thầy cô, tôi sẽ trình bày sau ạ. (dùng kính nhường)"
          ]
        ],
        "group": "vj-6"
      }
    ]
  },
  {
    "id": "vj-sashiageru",
    "title": "～をさしあげる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/sashiageru.html",
    "points": [
      {
        "id": "vj-sashiageru",
        "pattern": "～をさしあげる",
        "meaning": "Biếu, dâng (khiêm nhường cho người trên)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～をさしあげる（{差|さ}し{上|あ}げる）",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Khiêm nhường ngữ",
                "{私|わたし}/{内|うち}が{目上|めうえ}/お{客様|きゃくさま}に N を さしあげる",
                "{私|わたし}どもがお{客様|きゃくさま}に{試供|しきょう}{品|ひん}を{差|さ}し{上|あ}げます",
                "Khiêm nhường của あげる (kính tặng)"
              ],
              [
                "Hình thái lịch sự",
                "{差|さ}し{上|あ}げます／{差|さ}し{上|あ}げました",
                "{名刺|めいし}を{差|さ}し{上|あ}げます",
                "Dùng nhiều trong tiếp khách, kinh doanh"
              ],
              [
                "Danh từ với tiền tố",
                "お／ご + N + を + {差|さ}し{上|あ}げる",
                "お{礼|れい}を{差|さ}し{上|あ}げる／ご{案内|あんない}を{差|さ}し{上|あ}げる",
                "Tăng lịch sự, tự nhiên trong văn doanh nghiệp"
              ],
              [
                "So với あげる",
                "（×）{先生|せんせい}にNをあげる → {先生|せんせい}にNを{差|さ}し{上|あ}げる",
                "{先生|せんせい}にプレゼントを{差|さ}し{上|あ}げた",
                "Đối tượng nhận là bề trên: dùng {差|さ}し{上|あ}げる"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}が{先生|せんせい}に{花束|はなたば}を《{差|さ}し{上|あ}げました》。",
            "Tôi đã kính tặng bó hoa cho thầy."
          ],
          [
            "{後|のち}ほど{改|あらた}めてご{連絡|れんらく}を《{差|さ}し{上|あ}げます》。",
            "Chúng tôi sẽ liên hệ lại sau."
          ],
          [
            "お{客様|きゃくさま}に{粗品|そしな}を《{差|さ}し{上|あ}げて》おります。",
            "Chúng tôi đang tặng quà nhỏ cho khách."
          ],
          [
            "{感謝|かんしゃ}の{気持|きも}ちとしてお{礼|れい}を《{差|さ}し{上|あ}げます》。",
            "Xin gửi lời cảm ơn."
          ],
          [
            "{私|わたし}どもからスケジュール{表|ひょう}を《{差|さ}し{上|あ}げました》。",
            "Chúng tôi đã gửi bảng lịch trình."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-sashiageru",
    "title": "～てさしあげる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-sashiageru.html",
    "points": [
      {
        "id": "vj-te-sashiageru",
        "pattern": "～てさしあげる",
        "meaning": "Làm cho (kính trọng)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～てさしあげる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-て + さしあげる／さしあげます",
                "{私|わたし}が{手伝|てつだ}ってさしあげます。",
                "Khiêm nhường “làm cho (bề trên)”"
              ],
              [
                "Đối tượng",
                "N（{人|ひと}）に + V-て + さしあげる",
                "お{客様|きゃくさま}に{説明|せつめい}してさしあげました。",
                "“に” đánh dấu người nhận"
              ],
              [
                "Đề nghị",
                "V-て + さしあげましょうか",
                "ご{案内|あんない}してさしあげましょうか。",
                "Đề xuất giúp đỡ lịch sự"
              ],
              [
                "Phủ định",
                "V-て + さしあげられない",
                "{対応|たいおう}してさしあげられません。",
                "Từ chối khéo"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{荷物|にもつ}をこちらでお{預|あず}かりして《さしあげます》。",
            "Chúng tôi sẽ nhận giữ hành lý cho quý khách."
          ],
          [
            "{出口|でぐち}まで《ご{案内|あんない}してさしあげます》。",
            "Tôi sẽ dẫn quý khách ra lối ra."
          ],
          [
            "よろしければ、{資料|しりょう}をコピーして《さしあげましょうか》。",
            "Nếu được, tôi photo tài liệu cho nhé?"
          ],
          [
            "{会議|かいぎ}の{日程|にってい}は{私|わたし}からご{連絡|れんらく}して《さしあげます》。",
            "Lịch họp tôi sẽ liên lạc lại cho quý vị."
          ],
          [
            "{申|もう}し{訳|わけ}ありませんが、その{件|けん}は{対応|たいおう}して《さしあげられません》。",
            "Xin lỗi, việc đó chúng tôi không thể hỗ trợ."
          ],
          [
            "{道|みち}に{迷|まよ}われたなら、{駅|えき}まで{送|おく}って《さしあげます》。",
            "Nếu bị lạc, tôi sẽ đưa đến ga."
          ]
        ],
        "group": "vj-6"
      }
    ]
  },
  {
    "id": "vj-kureru",
    "title": "～をくれる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/kureru.html",
    "points": [
      {
        "id": "vj-kureru",
        "pattern": "～をくれる",
        "meaning": "Cho (mình)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～をくれる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Danh từ (vật tặng)",
                "X が{私|わたし}/{内|うち}に N を くれる",
                "{友|とも}だちが{私|わたし}に{本|ほん}をくれた",
                "“tặng cho tôi/nhóm tôi” (thông thường)"
              ],
              [
                "Người nhận thuộc “phe tôi”",
                "X が{家族|かぞく}/{同僚|どうりょう}/{子|こ}に N を くれる",
                "{先生|せんせい}が{娘|むすめ}に{絵本|えほん}をくれた",
                "Dùng được nếu người nhận thuộc phía người nói"
              ],
              [
                "Kính ngữ",
                "X が… に N を くださる",
                "{部長|ぶちょう}が{私|わたし}に{資料|しりょう}をくださった",
                "Với người cho là bề trên, dùng くださる lịch sự hơn"
              ],
              [
                "Biến thể động từ",
                "Vて くれる",
                "{手伝|てつだ}ってくれる",
                "Mẫu động từ khác; ở đây tập trung “N をくれる”"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{友|とも}だちが{私|わたし}に{手作|てづく}りのクッキーを《くれた》。",
            "Bạn đã tặng tôi bánh quy tự làm."
          ],
          [
            "{父|ちち}が{弟|おとうと}に{新|あたら}しい{自転車|じてんしゃ}を《くれた》。",
            "Bố đã mua tặng em trai tôi một chiếc xe đạp mới."
          ],
          [
            "{先生|せんせい}が{娘|むすめ}に{絵本|えほん}を《くれた》。",
            "Thầy đã tặng sách tranh cho con gái tôi. (người nhận thuộc phe tôi)"
          ],
          [
            "{彼|かれ}が{私|わたし}に{誕生|たんじょう}{日|び}プレゼントを《くれた》。",
            "Anh ấy tặng quà sinh nhật cho tôi."
          ],
          [
            "（{対比|たいひ}）{彼|かれ}が{私|わたし}に{本|ほん}を《くださった》。",
            "Cùng nội dung nhưng kính trọng người cho (くださる)."
          ],
          [
            "（×）{彼|かれ}が{田中|たなか}さんに{本|ほん}を《くれた》 → {彼|かれ}が{田中|たなか}さんに{本|ほん}を《あげた》。",
            "(Sửa) Người nhận không thuộc phía tôi → dùng あげる."
          ]
        ],
        "group": "vj-5"
      }
    ]
  },
  {
    "id": "vj-te-kureru",
    "title": "～てくれる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-kureru.html",
    "points": [
      {
        "id": "vj-te-kureru",
        "pattern": "～てくれる",
        "meaning": "(Ai) làm cho mình",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Nghĩa",
              "Cấu trúc",
              "Ví dụ",
              "Biến hình"
            ],
            "rows": [
              [
                "Ai đó làm cho tôi (ân huệ)",
                "V-て + くれる",
                "{手伝|てつだ}ってくれる",
                "Quá khứ: くれた; Phủ định: くれない"
              ],
              [
                "Lịch sự",
                "V-て + くれます",
                "{説明|せつめい}してくれます",
                "Quá khứ lịch sự: くれました"
              ],
              [
                "Kính ngữ",
                "V-て + くださる",
                "{案内|あんない}してくださる",
                "Dùng khi tôn kính người làm"
              ],
              [
                "Mệnh lệnh/thân mật",
                "V-て + くれる？／くれ",
                "ちょっと{来|き}てくれる？",
                "くれ là thô, nam tính"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{友|とも}だちが{宿題|しゅくだい}を{手伝|てつだ}って《くれた》。",
            "Bạn đã giúp tôi làm bài tập."
          ],
          [
            "{先生|せんせい}が{発音|はつおん}を{直|なお}して《くれました》。",
            "Thầy đã sửa phát âm cho tôi."
          ],
          [
            "この{本|ほん}を{貸|か}して《くれて》、{本当|ほんとう}に{助|たす}かった。",
            "Nhờ bạn cho mượn cuốn sách này, tôi được giúp nhiều lắm."
          ],
          [
            "ちょっと{待|ま}って《くれる？》",
            "Đợi mình một chút được không?"
          ],
          [
            "いつも{応援|おうえん}して《くれて》ありがとう。",
            "Cảm ơn vì lúc nào cũng ủng hộ tôi."
          ],
          [
            "{雨|あめ}の{中|なか}、{駅|えき}まで{送|おく}って《くれた》。",
            "Giữa trời mưa, anh ấy đã tiễn tôi đến ga."
          ],
          [
            "{誰|だれ}がこんな{素敵|すてき}な{絵|え}を{描|えが}いて《くれた》んだろう。",
            "Không biết ai đã vẽ cho mình bức tranh tuyệt thế này nhỉ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-kudasaru",
    "title": "～をくださる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/kudasaru.html",
    "points": [
      {
        "id": "vj-kudasaru",
        "pattern": "～をくださる",
        "meaning": "Cho (người trên cho mình)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～をくださる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Kính ngữ (tôn người cho)",
                "X が{私|わたし}/{内|うち}に N を くださる",
                "{部長|ぶちょう}が{私|わたし}に{資料|しりょう}をくださった",
                "Kính ngữ của くれる"
              ],
              [
                "Hình thái lịch sự",
                "くださいます／くださいました／くださって",
                "お{客様|きゃくさま}がご{意見|いけん}をくださいました",
                "Bất quy tắc: くださる→くださいます、て{形|かたち}→くださって"
              ],
              [
                "Đối tượng nhận",
                "“tôi/chúng tôi/nhóm tôi” hoặc người thuộc phe tôi",
                "{祖母|そぼ}が{娘|むすめ}に{手紙|てがみ}をくださった",
                "Người nhận phải gắn với phía người nói"
              ],
              [
                "Khác “ください”",
                "（Xin）N を ください",
                "{水|みず}をください",
                "“ください” là câu yêu cầu, khác với “くださる” (miêu tả)"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{部長|ぶちょう}が{私|わたし}に{最新|さいしん}の{資料|しりょう}を《くださいました》。",
            "Trưởng phòng đã tặng cho tôi tài liệu mới nhất."
          ],
          [
            "お{客様|きゃくさま}が{温|あたた}かいお{言葉|ことば}を《くださった》。",
            "Khách hàng đã dành cho (chúng tôi) những lời ấm áp."
          ],
          [
            "{祖父|そふ}が{娘|むすめ}に{絵本|えほん}を《くださった》。",
            "Ông đã tặng sách tranh cho con gái (của tôi)."
          ],
          [
            "{先生|せんせい}がご{推薦|すいせん}{状|じょう}を《くださいました》。",
            "Thầy đã cho tôi thư giới thiệu."
          ],
          [
            "{田中|たなか}{様|さま}がご{連絡|れんらく}を《くださいました》。",
            "Anh, chị Tanaka đã liên lạc cho (chúng tôi)."
          ]
        ],
        "group": "vj-5"
      }
    ]
  },
  {
    "id": "vj-itadaku",
    "title": "～をいただく",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/itadaku.html",
    "points": [
      {
        "id": "vj-itadaku",
        "pattern": "～をいただく",
        "meaning": "Nhận (khiêm nhường)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～をいただく",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Danh từ (vật/ân huệ)",
                "{私|わたし}/{内|うち}が X に/から N を いただく",
                "{私|わたし}は{先生|せんせい}から{本|ほん}をいただいた",
                "Khiêm nhường ngữ của もらう (nhận)"
              ],
              [
                "Doanh nghiệp/tập thể",
                "{当社|とうしゃ}/{弊社|へいしゃ}が お{客様|きゃくさま}から N を いただく",
                "{多|おお}くのご{支援|しえん}をいただきました",
                "Rất thường dùng trong business, với tiền tố kính ngữ お／ご"
              ],
              [
                "Biến thể động từ",
                "Vて いただく",
                "ご{協力|きょうりょく}していただく × → ご{協力|きょうりょく}いただく",
                "Mẫu động từ khác; ở đây ta tập trung “N をいただく”"
              ],
              [
                "Trợ từ nguồn",
                "X から／より",
                "{皆|みな}さまより{温|あたた}かいお{言葉|ことば}をいただく",
                "に dùng tự nhiên với người thực hiện/trao; から nhấn nguồn, nhất là tổ chức hoặc điểm xuất phát; より mang sắc thái trang trọng."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{先生|せんせい}から{参考|さんこう}{書|しょ}を《いただきました》。",
            "Tôi đã nhận được sách tham khảo từ thầy."
          ],
          [
            "{皆|みな}さまから{温|あたた}かいご{支援|しえん}を《いただき》、{心|こころ}より{感謝|かんしゃ}{申|もう}し{上|あ}げます。",
            "Xin chân thành cảm ơn vì đã nhận được sự hỗ trợ nồng ấm từ quý vị."
          ],
          [
            "{先輩|せんぱい}に{貴重|きちょう}なご{意見|いけん}を《いただいた》。",
            "Tôi nhận được ý kiến quý báu từ đàn anh."
          ],
          [
            "お{忙|いそが}しい{中|ちゅう}、お{時間|じかん}を《いただき》ありがとうございます。",
            "Cảm ơn vì đã dành thời gian cho chúng tôi."
          ],
          [
            "{取引|とりひき}{先|さき}から{新|あたら}しいカタログを《いただきました》。",
            "Chúng tôi nhận được catalog mới từ đối tác."
          ]
        ],
        "group": "vj-7"
      }
    ]
  },
  {
    "id": "vj-te-itadaku",
    "title": "～ていただく",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-itadaku.html",
    "points": [
      {
        "id": "vj-te-itadaku",
        "pattern": "～ていただく",
        "meaning": "Được (ai) làm cho (khiêm nhường)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～ていただく",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Nhận ân huệ (khiêm)",
                "{人|ひと} に/から + V-て + いただく",
                "{先生|せんせい}に{教|おし}えていただく",
                "Khiêm nhường của ～てもらう"
              ],
              [
                "Kính ngữ danh từ",
                "ごN + いただく／おVます + いただく",
                "ご{説明|せつめい}いただく／お{越|こ}しいただく",
                "ご + サ{変|へん}{名詞|めいし}, お + {和語|わご}{動詞|どうし}"
              ],
              [
                "Hỏi yêu cầu",
                "V-て + いただけますか／いただけないでしょうか",
                "この{書類|しょるい}にご{記入|きにゅう}いただけますか",
                "Cách yêu cầu lịch sự"
              ],
              [
                "Quá khứ",
                "V-て + いただいた／いただきました",
                "{手伝|てつだ}っていただきました",
                "Lịch sự, thường dùng để cảm ơn"
              ],
              [
                "Cảm ơn",
                "V-て + いただき、ありがとうございます",
                "ご{参加|さんか}いただき、ありがとうございます",
                "Mở đầu/khép lại lời cảm ơn"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{先生|せんせい}に{推薦|すいせん}{状|じょう}を《{書|か}いていただいた》。",
            "Tôi đã được thầy viết thư giới thiệu."
          ],
          [
            "{本日|ほんじつ}はご《{出席|しゅっせき}いただき》、{誠|まこと}にありがとうございます。",
            "Trân trọng cảm ơn quý vị đã tham dự hôm nay."
          ],
          [
            "この{件|けん}、{明日|あした}までにご《{連絡|れんらく}いただけますか》。",
            "Việc này, xin vui lòng liên lạc trước ngày mai được không ạ?"
          ],
          [
            "{部長|ぶちょう}にご《{説明|せつめい}いただきました》ので、{理解|りかい}できました。",
            "Vì đã được trưởng phòng giải thích nên tôi đã hiểu."
          ],
          [
            "お{忙|いそが}しいところ、お《{時間|じかん}をいただき》ありがとうございます。",
            "Cảm ơn anh, chị đã dành thời gian dù đang bận."
          ],
          [
            "{先方|せんぽう}に{日程|にってい}を{調整|ちょうせい}して《いただく》{予定|よてい}です。",
            "Dự định sẽ nhờ phía đối tác điều chỉnh lịch."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-itadakitai",
    "title": "～ていただきたい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-itadakitai.html",
    "points": [
      {
        "id": "vj-te-itadakitai",
        "pattern": "～ていただきたい",
        "meaning": "Muốn được (ai) làm cho",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～ていただきたい",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Yêu cầu lịch sự",
                "{人|ひと} に + V-て + いただきたい",
                "{田中|たなか}さんに{確認|かくにん}していただきたい",
                "“Tôi mong/ muốn anh làm ơn …” (khiêm nhường)"
              ],
              [
                "Danh từ hóa kính ngữ",
                "ごN-いただきたい／おV-いただきたい",
                "ご{協力|きょうりょく}いただきたい／お{越|こ}しいただきたい",
                "ご + サ{変|へん}{名詞|めいし}, お + {和語|わご}{動詞|どうし}"
              ],
              [
                "Trang trọng hơn",
                "V-て + いただきたく{存|ぞん}じます",
                "ご{返信|へんしん}いただきたく{存|ぞん}じます",
                "Văn thư, email business rất lịch sự"
              ],
              [
                "Hỏi ý mềm",
                "V-て + いただけますか／いただけないでしょうか",
                "ご{説明|せつめい}いただけますか",
                "Mềm hơn, thường dùng trực tiếp"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{至急|しきゅう}、{内容|ないよう}をご《{確認|かくにん}いただきたい》です。",
            "Khẩn trương, mong anh, chị vui lòng kiểm tra nội dung."
          ],
          [
            "{明日|あした}までにご《{返信|へんしん}いただきたい》と{存|ぞん}じます。",
            "Tôi xin phép mong nhận được phản hồi trước ngày mai."
          ],
          [
            "{会議|かいぎ}には{必|かなら}ずお《{越|こ}しいただきたい》。",
            "Mong anh, chị nhất định đến dự họp."
          ],
          [
            "{田中|たなか}さんにこの{資料|しりょう}をチェックして《いただきたい》。",
            "Tôi muốn anh Tanaka vui lòng kiểm tra tài liệu này."
          ],
          [
            "{以下|いか}の{点|てん}についてご{理解|りかい}《いただきたい》{事項|じこう}があります。",
            "Có những điều sau mong được anh, chị thông cảm."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-morau",
    "title": "Nをもらう",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/morau.html",
    "points": [
      {
        "id": "vj-morau",
        "pattern": "Nをもらう",
        "meaning": "Nhận",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ"
            ],
            "rows": [
              [
                "Danh từ",
                "N を もらう",
                "Nhận…, được nhận… (từ ai đó)",
                "{友|とも}だちにプレゼントをもらった。 Tôi đã nhận quà từ bạn."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{先生|せんせい}に{本|ほん} 《をもらいました》。",
            "Tôi đã nhận sách từ thầy giáo."
          ],
          [
            "{母|はは}から{手紙|てがみ} 《をもらった》。",
            "Tôi nhận được thư từ mẹ."
          ],
          [
            "{誕生|たんじょう}{日|び}に{友|とも}だちにケーキ《をもらった》。",
            "Sinh nhật tôi được bạn tặng bánh kem."
          ],
          [
            "{会社|かいしゃ}からボーナス《をもらいました》。",
            "Tôi đã nhận thưởng từ công ty."
          ],
          [
            "{兄|あに}は{外国|がいこく}{人|じん}の{友達|ともだち}に{日本|にほん}のお{土産|みやげ} 《をもらった》。",
            "Anh tôi được bạn nước ngoài tặng quà Nhật."
          ]
        ],
        "group": "vj-7"
      }
    ]
  },
  {
    "id": "vj-te-morau",
    "title": "～てもらう",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-morau.html",
    "points": [
      {
        "id": "vj-te-morau",
        "pattern": "～てもらう",
        "meaning": "Nhờ (ai) làm cho",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～てもらう",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "N（người/nhóm）に V-て + もらう",
                "{私|わたし}は{先生|せんせい}に{直|なお}してもらう",
                "Chủ ngữ là người nhận lợi ích (thường là tôi/chúng tôi)"
              ],
              [
                "Biến thể kính ngữ",
                "N に V-て + いただく",
                "{部長|ぶちょう}に{確認|かくにん}していただく",
                "Khiêm nhường ngữ (lịch sự hơn もらう)"
              ],
              [
                "Thay に bằng から",
                "N から V-て + もらう",
                "{友|とも}だちから{手伝|てつだ}ってもらう",
                "から dùng được, sắc thái thân mật hơn に"
              ],
              [
                "Dạng quá khứ",
                "V-て + もらった",
                "{手伝|てつだ}ってもらった",
                "Nhấn kết quả “được (ai) làm cho”"
              ],
              [
                "Dạng khả năng (yêu cầu)",
                "V-て + もらえる[か/]",
                "{見|み}てもらえますか",
                "Chuyển thành lời yêu cầu lịch sự"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{友|とも}だちに{宿題|しゅくだい}を{手伝|てつだ}って《もらった》。",
            "Được bạn giúp làm bài tập."
          ],
          [
            "{日本人|にほんじん}の{同僚|どうりょう}に{発音|はつおん}をチェックして《もらう》つもりだ。",
            "Tôi định nhờ đồng nghiệp người Nhật kiểm tra phát âm."
          ],
          [
            "{田中|たなか}さんに{駅|えき}まで{送|おく}って《もらいました》。",
            "Tôi đã được anh Tanaka đưa đến ga."
          ],
          [
            "{必要|ひつよう}なら{専門|せんもん}{家|か}に{見|み}て《もらいましょう》。",
            "Nếu cần thì để chuyên gia xem giúp đi."
          ],
          [
            "{会社|かいしゃ}にビザを{申請|しんせい}して《もらった》。",
            "Tôi đã được công ty nộp đơn xin visa giúp."
          ],
          [
            "{先生|せんせい}に{作文|さくぶん}を{直|なお}して《いただきました》。",
            "Tôi đã được thầy sửa bài luận (lịch sự)."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-te-moraitai",
    "title": "～てもらいたい",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/te-moraitai.html",
    "points": [
      {
        "id": "vj-te-moraitai",
        "pattern": "～てもらいたい",
        "meaning": "Muốn (ai) làm cho",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Thành phần",
              "Cấu tạo với ～てもらいたい",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Người thực hiện",
                "N（{人|ひと}）に + V-て + もらいたい",
                "{上司|じょうし}に{確認|かくにん}してもらいたい。",
                "Nhờ vả gián tiếp, mềm"
              ],
              [
                "Phủ định",
                "N（{人|ひと}）に + V-ないで + もらいたい",
                "{部屋|へや}では{騒|さわ}がないでもらいたい。",
                "Yêu cầu tránh làm"
              ],
              [
                "Mềm hóa",
                "V-て + もらいたいんですが／のですが",
                "{手伝|てつだ}ってもらいたいんですが。",
                "Mở đầu lịch sự"
              ],
              [
                "Trịnh trọng",
                "V-て + いただきたい",
                "ご{対応|たいおう}いただきたい。",
                "Trang trọng hơn (khuyến nghị)"
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{件|けん}、{至急|しきゅう}{確認|かくにん}して《もらいたい》んですが。",
            "Vụ này, tôi muốn nhờ xác nhận gấp."
          ],
          [
            "{専門|せんもん}{家|か}に{意見|いけん}を{聞|き}いて《もらいたい》。",
            "Tôi muốn nhờ chuyên gia cho ý kiến."
          ],
          [
            "もう{少|すこ}し{具体|ぐたい}{的|てき}に{説明|せつめい}して《もらいたい》です。",
            "Tôi muốn được giải thích cụ thể hơn một chút."
          ],
          [
            "{会場|かいじょう}では{飲食|いんしょく}をしないで《もらいたい》。",
            "Tại hội trường, xin đừng ăn uống."
          ],
          [
            "{明日|あした}のプレゼン、{練習|れんしゅう}に{付|つ}き{合|あ}って《もらいたい》。",
            "Tôi muốn bạn luyện tập cùng cho bài thuyết trình ngày mai."
          ],
          [
            "{手|て}が{離|はな}せないので、{代|か}わりに{送|おく}って《もらいたい》んですが。",
            "Tôi đang bận tay, muốn nhờ gửi giúp thay được không?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-rareru",
    "title": "～られる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/rareru.html",
    "points": [
      {
        "id": "vj-rareru",
        "pattern": "～られる",
        "meaning": "Bị / được / có thể… (bị động, khả năng)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng/Mục đích",
              "Cấu tạo với ～られる",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Thể bị động ({受身|うけみ})",
                "{五|ご}{段|だん}{動詞|どうし}: V-う → V-あ + れる {一段|いちだん}{動詞|どうし}: V-る → V-られる {不規則|ふきそく}: する→される / {来|く}る→{来|こ}られる[こられる/]",
                "{読|よ}む→{読|よ}まれる {書|か}く→{書|か}かれる {食|た}べる→{食|た}べられる",
                "Chủ thể gây tác động dùng に / によって. Bị động “gây phiền” ({迷惑|めいわく}の{受身|うけみ}) rất thường gặp."
              ],
              [
                "Khả năng ({可能|かのう}・ポテンシャル)",
                "{一段|いちだん}{動詞|どうし}: V-る → V-られる {五|ご}{段|だん}{動詞|どうし}: V-う → V-え + る（không dùng られる）",
                "{食|た}べる→{食|た}べられる {見|み}る→{見|み}られる {読|よ}む→{読|よ}める",
                "Với động từ {一段|いちだん}, hình thức trùng với bị động. Khẩu ngữ rút gọn: {食|た}べれる, {見|み}れる (không trang trọng)."
              ],
              [
                "Tự phát/khó cưỡng ({自発|じはつ})",
                "V-られる (một số động từ cảm xúc/tri giác)",
                "{思|おも}い{出|だ}される, {感|かん}じられる, {考|かんが}えられる",
                "Diễn tả “tự nhiên mà…/cảm thấy…”, không có chủ ý rõ ràng."
              ],
              [
                "Tôn kính ngữ ({尊敬|そんけい})",
                "{五|ご}{段|だん}: V-れる / {一段|いちだん}: V-られる / {来|く}る: {来|こ}られる / する: される",
                "{行|い}かれる, {読|よ}まれる, {来|こ}られる, {召|め}し{上|あ}がられる",
                "Trang trọng. Thường thay bằng お/ご～になる để tự nhiên hơn trong kinh doanh."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}は{先生|せんせい}に{褒|ほ}め《られた》。",
            "Tôi được thầy khen."
          ],
          [
            "{大雨|おおあめ}に{降|ふ}《られて》、{試合|しあい}が{中止|ちゅうし}になった。",
            "Bị mưa lớn nên trận đấu bị hủy."
          ],
          [
            "この{辛|から}さは{食|た}べ《られない》。",
            "Độ cay này tôi không thể ăn được."
          ],
          [
            "ふるさとが{自然|しぜん}と{思|おも}い{出|だ}さ《れる》。",
            "Quê hương tự nhiên lại được nhớ đến."
          ],
          [
            "{部長|ぶちょう}は{何|なん}{時|じ}ごろ{来|こ}《られます》か。",
            "Trưởng phòng khoảng mấy giờ sẽ đến ạ?"
          ],
          [
            "{日本語|にほんご}では{目的|もくてき}{語|ご}が{主語|しゅご}にな《る》ことがある。",
            "Trong tiếng Nhật, đôi khi tân ngữ trở thành chủ ngữ ở thể bị động."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-saseru",
    "title": "～させる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/saseru.html",
    "points": [
      {
        "id": "vj-saseru",
        "pattern": "～させる",
        "meaning": "Làm cho / bắt… làm…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo",
              "Mẫu câu",
              "Ví dụ"
            ],
            "rows": [
              [
                "Sai khiến chuẩn",
                "V({辞書|じしょ}{形|けい}) → 〜させる",
                "Nは/が Nに Vさせる",
                "{母|はは}は{私|わたし}に{部屋|へや}を{片|かた}づけさせる"
              ],
              [
                "Nhóm 1 ({五|ご}{段|だん})",
                "{書|か}く→{書|か}かせる／{行|い}く→{行|い}かせる",
                "—",
                "{部下|ぶか}を{先|さき}に{行|い}かせる"
              ],
              [
                "Nhóm 2 ({一|いち}{段|だん})",
                "{食|た}べる→{食|た}べさせる／{見|み}る→{見|み}させる",
                "—",
                "{子|こ}どもに{野菜|やさい}を{食|た}べさせる"
              ],
              [
                "する・{来|く}る",
                "する→させる／{来|く}る→こさせる",
                "—",
                "{彼|かれ}を{会場|かいじょう}にこさせる"
              ],
              [
                "Xin phép",
                "Vさせて + ください／もらう／いただく",
                "—",
                "{発言|はつげん}させてください"
              ],
              [
                "Gây cảm xúc",
                "{笑|わら}う→{笑|わら}わせる／{泣|な}く→{泣|な}かせる",
                "—",
                "{観客|かんきゃく}を{笑|わら}わせる"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{先生|せんせい}は{学生|がくせい}にスピーチをさ《せた》。",
            "Thầy bắt, cho học sinh thuyết trình."
          ],
          [
            "{部長|ぶちょう}は{私|わたし}を{先|さき}に{帰|かえ}ら《せて》くれた。",
            "Trưởng phòng cho tôi về trước."
          ],
          [
            "{親|おや}は{子|こ}どもに{自分|じぶん}で{決|き}め《させる》べきだ。",
            "Cha mẹ nên để con tự quyết định."
          ],
          [
            "その{映画|えいが}は{多|おお}くの{人|ひと}を{泣|な}か《せた》。",
            "Bộ phim đó đã làm nhiều người phải khóc."
          ],
          [
            "{少|すこ}し{考|かんが}え《させて》ください。",
            "Xin cho tôi nghĩ một chút."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-saserareru",
    "title": "～させられる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/saserareru.html",
    "points": [
      {
        "id": "vj-saserareru",
        "pattern": "～させられる",
        "meaning": "Bị bắt phải… (bị động sai khiến)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại động từ",
              "Gốc",
              "Thể sai khiến",
              "Thể sai khiến bị động",
              "Ví dụ"
            ],
            "rows": [
              [
                "Nhóm 1 ({五|ご}{段|だん})",
                "{読|よ}む",
                "{読|よ}ませる",
                "{読|よ}ませられる／{読|よ}まされる",
                "{上司|じょうし}に{本|ほん}を{読|よ}まされる"
              ],
              [
                "Nhóm 2 ({一|いち}{段|だん})",
                "{食|た}べる",
                "{食|た}べさせる",
                "{食|た}べさせられる",
                "{無理|むり}やり{食|た}べさせられる"
              ],
              [
                "する",
                "する",
                "させる",
                "させられる",
                "{悔|くや}しい{思|おも}いをさせられる"
              ],
              [
                "{来|く}る",
                "{来|く}る",
                "こさせる",
                "こさせられる",
                "{会場|かいじょう}にこさせられる"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{子|こ}どものころ、{嫌|きら}いな{野菜|やさい}を{無理|むり}やり{食|た}べ《させられた》。",
            "Hồi nhỏ tôi bị ép ăn rau không thích."
          ],
          [
            "{上司|じょうし}に{休日|きゅうじつ}{出勤|しゅっきん}を{頼|たの}まれて、{結局|けっきょく}{働|はたら}か《される》ことになった。",
            "Bị sếp nhờ nên rốt cuộc bị bắt đi làm ngày nghỉ."
          ],
          [
            "この{映画|えいが}は{社会|しゃかい}{問題|もんだい}について{考|かんが}え《させられる》。",
            "Bộ phim này khiến ta phải suy nghĩ về các vấn đề xã hội."
          ],
          [
            "{事故|じこ}の{影響|えいきょう}で{遠回|とおまわ}りさ《せられて》、{到着|とうちゃく}が{遅|おく}れた。",
            "Vì tai nạn nên bị buộc phải đi đường vòng, đến muộn."
          ],
          [
            "{彼|かれ}の{失敗談|しっぱいだん}にはつい{笑|わら}わ《される》。",
            "Những chuyện thất bại của anh ấy khiến người ta phải bật cười."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ru-koto-ga-dekiru",
    "title": "～ることができる",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ru-koto-ga-dekiru.html",
    "points": [
      {
        "id": "vj-ru-koto-ga-dekiru",
        "pattern": "～ることができる",
        "meaning": "Có thể…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Khả năng chung",
                "V-る + ことができる",
                "{日本語|にほんご}を{話|はな}すことができる",
                "Trang trọng/khách quan, hay dùng trong văn viết, thông báo."
              ],
              [
                "Phủ định",
                "V-る + ことができない",
                "{運転|うんてん}することができない",
                "Có thể nhấn mạnh bằng {全|まった}く/どうしても…できない."
              ],
              [
                "Lịch sự",
                "～ことができます",
                "こちらで{両替|りょうがえ}することができます",
                "Thông báo dịch vụ/khả dụng."
              ],
              [
                "Với サ{変|へん}",
                "N(する) → N + することができる",
                "{予約|よやく}することができる",
                "Cũng có rút gọn: {予約|よやく}できる."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{私|わたし}は{日本語|にほんご}を{話|はな}す《ことができます》。",
            "Tôi có thể nói tiếng Nhật."
          ],
          [
            "ここではWi‑Fiを{無料|むりょう}で{利用|りよう}する《ことができます》。",
            "Ở đây có thể sử dụng Wi‑Fi miễn phí."
          ],
          [
            "{事故|じこ}のため、{今日|きょう}は{運転|うんてん}する《ことができません》。",
            "Vì tai nạn nên hôm nay không thể lái xe."
          ],
          [
            "このアプリで{予約|よやく}《することができる》。",
            "Có thể đặt chỗ bằng ứng dụng này."
          ],
          [
            "{手術|しゅじゅつ}のおかげで、また{走|はし}る《ことができる》ようになった。",
            "Nhờ ca phẫu thuật, tôi đã có thể chạy lại."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-sasete-kudasai",
    "title": "～させてください",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/sasete-kudasai.html",
    "points": [
      {
        "id": "vj-sasete-kudasai",
        "pattern": "～させてください",
        "meaning": "Hãy để tôi…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Nhóm động từ",
              "Causative",
              "+ ください",
              "Ví dụ"
            ],
            "rows": [
              [
                "Nhóm 1 ({五|ご}{段|だん})",
                "V-ない{形|かたち}の{語幹|ごかん} + せる",
                "～させてください",
                "{書|か}く→{書|か}かせてください／{待|ま}つ→{待|ま}たせてください"
              ],
              [
                "Nhóm 2 ({一|いち}{段|だん})",
                "Vます{形|けい}の{語幹|ごかん} + させる",
                "～させてください",
                "{食|た}べる→{食|た}べさせてください／{見|み}る→{見|み}させてください"
              ],
              [
                "Bất quy tắc",
                "する→させる／{来|く}る→こさせる",
                "～させてください",
                "{説明|せつめい}させてください／{来|こ}させてください（hiếm, tránh nếu có thể）"
              ]
            ]
          }
        ],
        "examples": [
          [
            "もう{一度|いちど}{説明|せつめい}《させてください》。",
            "Xin cho tôi giải thích thêm một lần nữa."
          ],
          [
            "{少|すこ}し{休|やす}ま《せてください》。",
            "Xin cho tôi nghỉ một chút."
          ],
          [
            "{先|さき}に{帰|かえ}ら《せてください》。",
            "Xin cho tôi về trước."
          ],
          [
            "{写真|しゃしん}を{撮|と}ら《せてください》。",
            "Xin cho tôi chụp ảnh."
          ],
          [
            "{今日|きょう}は{欠席|けっせき}《させてください》。",
            "Hôm nay xin cho tôi vắng mặt."
          ],
          [
            "この{件|けん}について{発言|はつげん}《させていただけますか》。",
            "Về việc này, cho phép tôi được phát biểu ạ. (rất lịch sự)"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-toka-toka",
    "title": "～とか～とか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/toka-toka.html",
    "points": [
      {
        "id": "vj-toka-toka",
        "pattern": "～とか～とか",
        "meaning": "Như… hay…, chẳng hạn như…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Kết hợp",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Sắc thái"
            ],
            "rows": [
              [
                "Danh từ",
                "N1とかN2とか",
                "{京都|きょうと}とか{大阪|おおさか}とか",
                "Liệt kê ví dụ, không đầy đủ"
              ],
              [
                "Động/tính từ ngắn",
                "MĐ-ngắnとかMĐ-ngắnとか",
                "{読|よ}むとか{映画|えいが}を{見|み}るとか",
                "Khẩu ngữ, linh hoạt"
              ],
              [
                "+ する",
                "…とか…とかする",
                "{掃除|そうじ}するとか{買|か}い{物|もの}するとかする",
                "Mẫu khép câu tự nhiên"
              ],
              [
                "Cuối câu (nghe nói)",
                "MĐ + とか",
                "{明日|あした}{休|やす}みだとか",
                "Hàm “nghe nói”, khẩu ngữ"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{週末|しゅうまつ}は{映画|えいが}を{見|み}る《とか》カフェに{行|い}く《とか》して{過|す}ごします。",
            "Cuối tuần tôi dành thời gian xem phim, đi cà phê, v.v."
          ],
          [
            "{旅行|りょこう}は{京都|きょうと}《とか》{大阪|おおさか}《とか》に{行|い}きたい。",
            "Du lịch thì tôi muốn đi Kyoto, Osaka chẳng hạn."
          ],
          [
            "{嫌|きら}いな{食|た}べ{物|もの}はピーマン《とか》レバー《とか》です。",
            "Món tôi ghét là ớt xanh, gan, v.v."
          ],
          [
            "{雨|あめ}で{中止|ちゅうし}だ《とか》{聞|き}いたけど、{本当|ほんとう}？",
            "Tôi nghe nói là hủy vì mưa, thật không?"
          ],
          [
            "{暇|ひま}なときは{読書|どくしょ}《とか》{勉強|べんきょう}《とか》します。",
            "Lúc rảnh tôi đọc sách, học hành, v.v."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-tari-tari",
    "title": "～たり～たり",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tari-tari.html",
    "points": [
      {
        "id": "vj-tari-tari",
        "pattern": "～たり～たり",
        "meaning": "Lúc thì… lúc thì…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Thành phần",
              "Cấu tạo với ～たり～たり",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "Vた + り、Vた + り + する",
                "{読|よ}んだり、{見|み}たり する",
                "Liệt kê hành động tiêu biểu; “làm cái này cái kia”."
              ],
              [
                "Thì/khía cạnh",
                "…たり…たり + します／しました／している",
                "{出|で}かけたり{寝|ね}たりしています",
                "Thì do động từ する quyết định."
              ],
              [
                "い-tính từ",
                "Aい → Aかったり ～",
                "{暑|あつ}かったり{寒|さむ}かったりする",
                "Biểu thị lúc thế này lúc thế khác."
              ],
              [
                "な-tính từ/N",
                "Aな/N → A/N だったり ～",
                "{便利|べんり}だったり{不便|ふべん}だったりする",
                "Dùng だったり cho な/N."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{休|やす}みの{日|ひ}は{本|ほん}を{読|よ}ん《だり》{映画|えいが}を{見|み}《たり》し《ます》。",
            "Ngày nghỉ tôi đọc sách, xem phim các kiểu."
          ],
          [
            "{雨|あめ}が{降|ふ}っ《たり》やん《だり》し《ている》。",
            "Mưa lúc rơi lúc tạnh."
          ],
          [
            "{彼|かれ}は{嬉|うれ}し《かったり》{悲|かな}し《かったり》する{人|ひと}だ。",
            "Anh ấy lúc vui lúc buồn."
          ],
          [
            "{出張|しゅっちょう}では{大阪|おおさか}に{行|い}っ《たり》、{名古屋|なごや}に{行|い}っ《たり》し《ました》。",
            "Đi công tác tôi lúc thì đến Osaka, lúc thì Nagoya."
          ],
          [
            "この{店|みせ}は{値段|ねだん}が{高|たか}《かったり》{安|やす}《かったり》する。",
            "Cửa hàng này giá lúc cao lúc thấp."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-shi-shi",
    "title": "～し、～し",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/shi-shi.html",
    "points": [
      {
        "id": "vj-shi-shi",
        "pattern": "～し、～し",
        "meaning": "Vừa… vừa…, lại còn…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu tạo với ～し、～し、～",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V{普通|ふつう}{形|けい}＋し",
                "{頑張|がんば}るし、{続|つづ}けるし",
                "Liệt kê lý do/đặc điểm"
              ],
              [
                "Aい",
                "Aい＋し",
                "{安|やす}いし、{新|あたら}しいし",
                "Giữ い"
              ],
              [
                "Aな／N",
                "Aな/N＋だし",
                "{便利|べんり}だし、{学生|がくせい}だし",
                "Lịch sự: ですし"
              ],
              [
                "Chuỗi",
                "…し、…し、[だから/]…",
                "{安|やす}いし、{近|ちか}いし、{買|か}おう。 {忙|いそが}しいし…（{終止|しゅうし}）",
                "Kết thúc mở được phép"
              ]
            ]
          }
        ],
        "examples": [
          [
            "このアプリは{無料|むりょう}《だし》、{使|つか}いやすい《し》、おすすめです。",
            "Ứng dụng này miễn phí, dễ dùng, tôi khuyên dùng."
          ],
          [
            "{駅|えき}に{近|ちか}い《し》、{静|しず}か《だし》、ここに{住|す}みたい。",
            "Vừa gần ga vừa yên tĩnh, tôi muốn sống ở đây."
          ],
          [
            "{今日|きょう}は{雨|あめ}《だし》、{寒|さむ}い《し》、{家|いえ}にいよう。",
            "Hôm nay mưa, lại lạnh, ở nhà thôi."
          ],
          [
            "{時間|じかん}もない《し》…また{今度|こんど}。",
            "Cũng không có thời gian… để lần sau nhé."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-toiu",
    "title": "～という～",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/toiu.html",
    "points": [
      {
        "id": "vj-toiu",
        "pattern": "～という～",
        "meaning": "… gọi là …",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại/khung",
              "Cấu tạo với ～という～",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "N → N",
                "N + という + N",
                "{東京|とうきょう}という{都市|とし}",
                "“N có tên là/được gọi là N”"
              ],
              [
                "Mệnh đề → N",
                "{普通|ふつう}{形|けい}(だ) + という + N",
                "{彼|かれ}が{来|こ}ないという{噂|うわさ}",
                "Trích dẫn nội dung để bổ nghĩa danh từ"
              ],
              [
                "Danh hóa",
                "{普通|ふつう}{形|けい}(だ) + ということ／というの",
                "{彼|かれ}は{学生|がくせい}だということ",
                "Biến mệnh đề thành một danh từ"
              ],
              [
                "Giải thích",
                "N + というのは + {説明|せつめい}",
                "SDGsというのは…",
                "“Cái gọi là… nghĩa là …”"
              ],
              [
                "Trần thuật",
                "{普通|ふつう}{形|けい} + という",
                "{雨|あめ}が{降|ふ}るという",
                "Văn viết; “nghe nói/được bảo là” (＝～そうだ/～とのことだ)"
              ],
              [
                "Khẩu ngữ",
                "っていう",
                "{東京|とうきょう}っていう{街|まち}",
                "Dạng thân mật của という"
              ],
              [
                "Định danh",
                "{何|なに}という + N",
                "{何|なに}という{本|ほん}？",
                "Hỏi “tên là gì” (mẫu liên quan)"
              ]
            ]
          }
        ],
        "examples": [
          [
            "これは《{抹茶|まっちゃ}という》{日本|にほん}のお{茶|ちゃ}です。",
            "Đây là loại trà Nhật gọi là matcha."
          ],
          [
            "{山田|やまだ}さんが{結婚|けっこん}した《という》ニュースを{聞|き}いた。",
            "Tôi nghe tin là anh Yamada đã kết hôn."
          ],
          [
            "{彼|かれ}が{来|こ}ない《という》{噂|うわさ}は{本当|ほんとう}かな。",
            "Không biết tin đồn “anh ấy không đến” có thật không."
          ],
          [
            "《SDGsというのは》{持続|じぞく}{可能|かのう}な{開発|かいはつ}{目標|もくひょう}のことだ。",
            "SDGs tức là các Mục tiêu Phát triển Bền vững."
          ],
          [
            "この{作品|さくひん}は「{風神|ふうじん}{雷神|らいじん}{図|ず}」《という》{名前|なまえ}で{知|し}られている。",
            "Tác phẩm này được biết đến với tên “Phong Thần Lôi Thần Đồ”."
          ],
          [
            "{東京|とうきょう}《っていう》{大都市|だいとし}に{住|す}みたい。",
            "Tôi muốn sống ở đại đô thị gọi là Tokyo. (khẩu ngữ)"
          ],
          [
            "{彼|かれ}は{来|こ}られない《ということ》を{先生|せんせい}に{伝|つた}えてください。",
            "Hãy báo với thầy “việc là anh ấy không đến được”."
          ],
          [
            "これはどういう{意味|いみ}か《という》と、{料金|りょうきん}が{含|ふく}まれていないということだ。",
            "Nếu hỏi “điều này nghĩa là gì” thì là phí chưa được bao gồm."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-tteiu",
    "title": "～っていう",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/tteiu.html",
    "points": [
      {
        "id": "vj-tteiu",
        "pattern": "～っていう",
        "meaning": "Gọi là…, nói là…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Cấu tạo với ～っていう",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Trích dẫn trực tiếp/gián tiếp",
                "「Câu」+ って（{言|い}う／{聞|き}いた）／Mệnh đề + って",
                "「{行|い}かない」って{言|い}った",
                "Văn nói của と{言|い}う／という."
              ],
              [
                "Định nghĩa/chủ đề",
                "N/Mệnh đề + っていう + のは／の",
                "DIY っていうのは{何|なに}？",
                "“Cái gọi là … là gì”."
              ],
              [
                "Đặt tên/gọi tên",
                "N + っていう + N",
                "{田中|たなか}っていう{人|ひと}",
                "“Người tên là Tanaka”."
              ],
              [
                "Rút gọn",
                "Mệnh đề + って",
                "{明日|あした}{休|やす}みだって。",
                "Hàm ý “nghe nói là/ người ta bảo là”."
              ],
              [
                "Trang trọng",
                "～という／～といいます",
                "{田中|たなか}という{者|もの}です。",
                "Dùng trong văn viết/lịch sự."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{彼|かれ}は「{今日|きょう}は{無理|むり}」《って》{言|い}ってた。",
            "Anh ấy bảo “hôm nay không được”."
          ],
          [
            "このアプリ、{使|つか}いやすい《っていう》{評判|ひょうばん}だよ。",
            "Ứng dụng này có tiếng là dễ dùng đấy."
          ],
          [
            "{田中|たなか}《っていう》{医者|いしゃ}を{知|し}ってる？",
            "Có biết vị bác sĩ tên Tanaka không?"
          ],
          [
            "SDGs《っていう》のは{何|なに}の{略|りゃく}ですか。",
            "SDGs là viết tắt của cái gì?"
          ],
          [
            "{明日|あした}は{休|やす}み《だって》。どこ{行|い}く？",
            "Nghe nói mai nghỉ. Đi đâu không?"
          ],
          [
            "それ《っていう》の、どういう{意味|いみ}？",
            "Cái “được gọi là” đó nghĩa là gì?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-sonoue",
    "title": "文～。そのうえ～。",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/sonoue.html",
    "points": [
      {
        "id": "vj-sonoue",
        "pattern": "文～。そのうえ～。",
        "meaning": "Hơn nữa…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Cấu trúc",
              "Ý nghĩa",
              "Ví dụ ngắn",
              "Ghi chú"
            ],
            "rows": [
              [
                "{文|ぶん}。そのうえ、{文|ぶん}。",
                "thêm thông tin cùng chiều",
                "{安|やす}い。そのうえ、おいしい。",
                "Thường cùng cực (đều tốt hoặc đều xấu)."
              ],
              [
                "{文|ぶん}。そのうえ、{文|ぶん}（{評価|ひょうか}/{結論|けつろん}）。",
                "tăng cường lý lẽ",
                "{便利|べんり}だ。そのうえ、{安全|あんぜん}だ。",
                "Trang trọng hơn それに."
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{店|みせ}は{安|やす}い。《そのうえ》、{品質|ひんしつ}もいい。",
            "Quán này rẻ. Hơn nữa, chất lượng cũng tốt."
          ],
          [
            "{彼|かれ}は{親切|しんせつ}だ。《そのうえ》、{仕事|しごと}も{早|はや}い。",
            "Anh ấy tốt bụng. Thêm vào đó, làm việc cũng nhanh."
          ],
          [
            "{昨日|きのう}は{寒|さむ}かった。《そのうえ》、{風|かぜ}も{強|つよ}かった。",
            "Hôm qua lạnh. Hơn nữa, gió cũng mạnh."
          ],
          [
            "{彼女|かのじょ}は{遅刻|ちこく}した。《そのうえ》、{宿題|しゅくだい}も{出|だ}していない。",
            "Cô ấy đi muộn. Thêm nữa, còn không nộp bài tập."
          ],
          [
            "この{薬|くすり}はよく{効|き}く。《そのうえ》、{副作用|ふくさよう}が{少|すく}ない。",
            "Thuốc này hiệu quả. Hơn nữa, ít tác dụng phụ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-soreni",
    "title": "文～。それに～。",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/soreni.html",
    "points": [
      {
        "id": "vj-soreni",
        "pattern": "文～。それに～。",
        "meaning": "Thêm nữa…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Liên từ bổ sung (thêm thông tin)",
                "S1。それに、S2。",
                "{今日|きょう}は{寒|さむ}い。それに、{雨|あめ}も{降|ふ}っている。",
                "Đặt đầu câu S2; thường có dấu phẩy sau それに. Mang nghĩa “thêm nữa, hơn nữa”."
              ],
              [
                "Trong liệt kê",
                "① ～し、～し、それに～。 ② Aは～。Bは～。それにCは～。",
                "{安|やす}いし、{近|ちか}いし、それに{静|しず}かだ。",
                "Tăng dần/nhấn mạnh độ thêm thắt. Không nêu quan hệ nguyên nhân-kết quả trực tiếp."
              ],
              [
                "Độ lịch sự",
                "… 。それに、… （trung tính)",
                "{資料|しりょう}は{十分|じゅうぶん}です。それに、{時間|じかん}もあります。",
                "Dùng được cả nói và viết; trung tính, tự nhiên trong hội thoại."
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{店|みせ}は{安|やす}い。《それに》、{品質|ひんしつ}もいい。",
            "Cửa hàng này rẻ. Thêm nữa, chất lượng cũng tốt."
          ],
          [
            "{今日|きょう}は{忙|いそが}しい。《それに》、{会議|かいぎ}も{三|みっ}つある。",
            "Hôm nay bận. Ngoài ra còn có ba cuộc họp."
          ],
          [
            "この{本|ほん}は{読|よ}みやすい。《それに》、{図|ず}が{多|おお}くて{理解|りかい}しやすい。",
            "Cuốn sách này dễ đọc. Hơn nữa, có nhiều hình nên dễ hiểu."
          ],
          [
            "{彼|かれ}は{経験|けいけん}が{豊富|ほうふ}だ。《それに》、{人柄|ひとがら}もいい。",
            "Anh ấy kinh nghiệm dồi dào. Thêm nữa, tính cách cũng tốt."
          ],
          [
            "{交通|こうつう}{費|ひ}は{会社|かいしゃ}が{出|だ}す。《それに》、{昼食|ちゅうしょく}も{支給|しきゅう}される。",
            "Chi phí đi lại do công ty chi. Ngoài ra còn trợ cấp bữa trưa."
          ],
          [
            "このパソコンは{軽|かる}い。《それに》、バッテリーが{長持|ながも}ちする。",
            "Máy tính này nhẹ. Thêm nữa, pin dùng lâu."
          ],
          [
            "{雨|あめ}が{降|ふ}っている。《それに》、{風|かぜ}まで{強|つよ}くなってきた。",
            "Trời đang mưa. Thêm vào đó, gió còn mạnh lên nữa."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-kamoshirenai",
    "title": "～かもしれない",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/kamoshirenai.html",
    "points": [
      {
        "id": "vj-kamoshirenai",
        "pattern": "～かもしれない",
        "meaning": "Có thể…, không chừng…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～かもしれない",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）+ かもしれない",
                "{遅|おく}れるかもしれない",
                "khả năng không chắc chắn; không gắn với một tỷ lệ phần trăm cố định"
              ],
              [
                "い{形容詞|けいようし}",
                "Adjい + かもしれない",
                "{寒|さむ}いかもしれない",
                ""
              ],
              [
                "な{形容詞|けいようし}",
                "Adjな + かもしれない",
                "{静|しず}かかもしれない",
                "Không dùng だ trước かもしれない"
              ],
              [
                "{名詞|めいし}",
                "N + かもしれない",
                "{日本人|にほんじん}かもしれない",
                "Quá khứ: Nだったかもしれない"
              ],
              [
                "Lịch sự",
                "～かもしれません",
                "{雨|あめ}かもしれません",
                "Lịch sự/chuẩn mực"
              ],
              [
                "Rút gọn",
                "～かも[ね/]",
                "{高|たか}いかもね",
                "Văn nói"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}は{雪|ゆき}に《なるかもしれない》。",
            "Ngày mai có khi trời sẽ tuyết."
          ],
          [
            "{彼|かれ}はもう{家|いえ}に《{帰|かえ}ったかもしれない》。",
            "Anh ấy có thể đã về nhà rồi."
          ],
          [
            "この{問題|もんだい}は{思|おも}ったより《{難|むずか}しいかもしれない》。",
            "Bài này có lẽ khó hơn đã nghĩ."
          ],
          [
            "もしかしたら、{彼女|かのじょ}は{来|こ}ない《かもしれない》。",
            "Biết đâu cô ấy sẽ không đến."
          ],
          [
            "それ、{偽物|にせもの}《かも》ね。",
            "Cái đó có khi là đồ giả đấy."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-darou",
    "title": "～だろう",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/darou.html",
    "points": [
      {
        "id": "vj-darou",
        "pattern": "～だろう",
        "meaning": "Có lẽ…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại vị ngữ",
              "Cấu tạo với ～だろう",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-る／V-た／V-ない + だろう",
                "{行|い}くだろう／{来|こ}ないだろう",
                "Phỏng đoán “có lẽ”."
              ],
              [
                "い-tính từ",
                "Aい + だろう",
                "{難|むずか}しいだろう",
                "Giữ nguyên Aい rồi + だろう."
              ],
              [
                "な-tính từ",
                "Aな → Aだろう",
                "{静|しず}かだろう",
                "Không dùng だ trước だろう: × {静|しず}かだだろう."
              ],
              [
                "Danh từ",
                "N + だろう",
                "{学生|がくせい}だろう",
                "Thể thường của でしょう (lịch sự)."
              ],
              [
                "Hình thức khác",
                "～だろうか",
                "{本当|ほんとう}に{大丈夫|だいじょうぶ}だろうか。",
                "Tự hỏi, băn khoăn."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}は{雪|ゆき}が{降|ふ}る《だろう》。",
            "Ngày mai chắc sẽ có tuyết."
          ],
          [
            "{彼|かれ}はもう{家|いえ}に{着|つ}いている《だろう》。",
            "Anh ấy chắc đã về tới nhà rồi."
          ],
          [
            "そんな{計画|けいかく}はうまくいかない《だろう》。",
            "Kế hoạch đó có lẽ sẽ không suôn sẻ."
          ],
          [
            "{君|きみ}もそう{思|おも}う《だろう》？",
            "Cậu cũng nghĩ vậy, phải không?"
          ],
          [
            "この{方法|ほうほう}で{本当|ほんとう}に{解決|かいけつ}できる《だろうか》。",
            "Liệu thực sự có thể giải quyết bằng cách này không nhỉ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-deshou",
    "title": "～でしょう",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/deshou.html",
    "points": [
      {
        "id": "vj-deshou",
        "pattern": "～でしょう",
        "meaning": "Có lẽ…, đúng không?",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại/kết hợp",
              "Cấu tạo với ～でしょう",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）＋でしょう",
                "{雨|あめ}が{降|ふ}るでしょう。",
                "Suy đoán lịch sự (≈ だろう)."
              ],
              [
                "Tính từ い",
                "Aい（{普通|ふつう}{形|けい}）＋でしょう",
                "{今日|きょう}は{寒|さむ}いでしょう。",
                ""
              ],
              [
                "Tính từ な",
                "Aな[だ/]＋でしょう",
                "{彼|かれ}は{元気|げんき}でしょう。",
                "Không được thêm だ trước でしょう."
              ],
              [
                "Danh từ",
                "N[だ/]＋でしょう",
                "{明日|あした}は{休|やす}みでしょう。",
                ""
              ],
              [
                "Câu hỏi lịch sự",
                "～でしょうか",
                "{何|なん}{時|じ}に{終|お}わるでしょうか。",
                "Hỏi ý kiến/suy đoán, rất lịch sự."
              ],
              [
                "Tìm đồng tình",
                "～でしょう？（↑）",
                "きれいでしょう？",
                "Ngữ điệu lên để xác nhận/đồng tình."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{午後|ごご}から{雨|あめ}が《{降|ふ}るでしょう》。",
            "Chiều nay có lẽ sẽ mưa."
          ],
          [
            "この{問題|もんだい}は《{難|むずか}しいでしょう》から、よく{読|よ}んでください。",
            "Bài này chắc khó nên hãy đọc kỹ."
          ],
          [
            "{彼|かれ}ももう{知|し}っている《でしょう》。",
            "Anh ấy chắc cũng biết rồi."
          ],
          [
            "いつごろ{戻|もど}って{来|く}る《でしょうか》。",
            "Khoảng khi nào thì sẽ quay lại ạ?"
          ],
          [
            "この{映画|えいが}、{面白|おもしろ}い《でしょう？》",
            "Bộ phim này hay lắm, đúng không?"
          ],
          [
            "{明日|あした}はもっと{寒|さむ}くなる《でしょうね》。",
            "Ngày mai chắc sẽ lạnh hơn nhỉ."
          ],
          [
            "おそらく{間|ま}に{合|あ}う《でしょう》が、{念|ねん}のため{連絡|れんらく}します。",
            "Có lẽ sẽ kịp, nhưng tôi liên lạc cho chắc."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-ka-douka",
    "title": "～かどうか",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/ka-douka.html",
    "points": [
      {
        "id": "vj-ka-douka",
        "pattern": "～かどうか",
        "meaning": "… hay không",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với ～かどうか",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）+ かどうか",
                "{行|い}くかどうか、{合格|ごうかく}したかどうか",
                "“Liệu có … hay không”"
              ],
              [
                "い{形容詞|けいようし}",
                "Adjい + かどうか",
                "{高|たか}いかどうか",
                ""
              ],
              [
                "な{形容詞|けいようし}",
                "Adjな + かどうか",
                "{便利|べんり}かどうか",
                "Quá khứ: {便利|べんり}だったかどうか"
              ],
              [
                "{名詞|めいし}",
                "N + かどうか",
                "{学生|がくせい}かどうか",
                "Quá khứ: {学生|がくせい}だったかどうか"
              ],
              [
                "Cụm nhấn mạnh",
                "～かどうかは＋{評価|ひょうか}/{未定|みてい}",
                "{行|い}けるかどうかは{未定|みてい}だ",
                "Đưa mệnh đề lên vị trí chủ đề"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}{彼|かれ}が{来|く}る《かどうか》、まだわからない。",
            "Vẫn chưa biết liệu ngày mai anh ấy có đến hay không."
          ],
          [
            "この{方法|ほうほう}が{本当|ほんとう}に{効果|こうか}{的|てき}《かどうか》を{検証|けんしょう}する。",
            "Kiểm chứng liệu phương pháp này có hiệu quả hay không."
          ],
          [
            "それが{必要|ひつよう}《かどうか》は{状況|じょうきょう}による。",
            "Việc có cần hay không còn tùy tình huống."
          ],
          [
            "{彼女|かのじょ}が{学生|がくせい}《かどうか》{教|おし}えてください。",
            "Hãy cho tôi biết cô ấy có phải là sinh viên hay không."
          ],
          [
            "いつ{出発|しゅっぱつ}する《か》は、{明日|あした}{決|き}める。",
            "Thời điểm xuất phát sẽ quyết định vào ngày mai. (nghi vấn từ → dùng か)"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-kashira",
    "title": "～かしら",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/kashira.html",
    "points": [
      {
        "id": "vj-kashira",
        "pattern": "～かしら",
        "meaning": "Không biết có phải… (nữ dùng)",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "V（{普通|ふつう}{形|けい}）+ かしら",
                "Động từ thường + かしら",
                "{来|く}るかしら、{間|ま}に{合|あ}うかしら",
                "Tự hỏi, băn khoăn"
              ],
              [
                "い{形容詞|けいようし} + かしら",
                "{高|たか}い + かしら",
                "{高|たか}いかしら",
                ""
              ],
              [
                "な{形容詞|けいようし} + かしら / なのかしら",
                "{静|しず}か + かしら / {静|しず}かなのかしら",
                "{静|しず}かかしら",
                "なのかしら thêm sắc thái giải thích"
              ],
              [
                "{名詞|めいし} + かしら / なのかしら",
                "{学生|がくせい} + かしら / {学生|がくせい}なのかしら",
                "{本当|ほんとう}かしら",
                "Tránh “ですかしら” trong văn nói tự nhiên"
              ],
              [
                "Cụm cố định",
                "～かしらね",
                "どうかしらね",
                "Mềm hóa thêm"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}は{雨|あめ}《かしら》。",
            "Không biết mai có mưa không nhỉ."
          ],
          [
            "この{服|ふく}、{彼|かれ}に{似合|にあ}う《かしら》。",
            "Bộ này không biết có hợp với anh ấy không."
          ],
          [
            "{時間|じかん}に《{間|ま}に{合|あ}うかしら》。",
            "Không biết có kịp giờ không."
          ],
          [
            "どうしたらいい《かしら》。",
            "Không biết nên làm thế nào đây."
          ],
          [
            "{本当|ほんとう}に{大丈夫|だいじょうぶ}《なのかしら》。",
            "Không biết có thực sự ổn không."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-kanaa",
    "title": "～かなあ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/kanaa.html",
    "points": [
      {
        "id": "vj-kanaa",
        "pattern": "～かなあ",
        "meaning": "Không biết…, chắc là…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Thành phần trước かなあ",
              "Cấu trúc",
              "Ví dụ",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V-{普通|ふつう}{形|けい} + かなあ",
                "{受|う}かるかなあ",
                "Dạng thông thường (plain form)"
              ],
              [
                "Tính từ-i",
                "Aい + かなあ",
                "{高|たか}いかなあ",
                "-"
              ],
              [
                "Tính từ-na",
                "Na + かなあ",
                "{静|しず}かかなあ",
                "Không thêm だ trong văn nói thân mật"
              ],
              [
                "Danh từ",
                "N + かなあ",
                "{本当|ほんとう}かなあ",
                "Không cần だ trong khẩu ngữ"
              ],
              [
                "Mong ước nhẹ",
                "V-ない + かなあ",
                "{雨|あめ}、{降|ふ}らないかなあ",
                "“Ước gì/giá mà …”; dù dùng Vない, mẫu này thường biểu thị mong sự việc xảy ra."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{明日|あした}、{晴|は}れる《かなあ》。",
            "Không biết mai trời có nắng không nhỉ."
          ],
          [
            "{彼|かれ}、{来|き}てくれる《かなあ》。",
            "Không biết anh ấy có đến không ta."
          ],
          [
            "{日本語|にほんご}、もっと{上手|じょうず}に{話|はな}せる《かなあ》。",
            "Không biết mình có nói tiếng Nhật giỏi hơn được không."
          ],
          [
            "この{問題|もんだい}、{間|ま}に{合|あ}う《かなあ》。",
            "Không biết có kịp bài này không."
          ],
          [
            "{値段|ねだん}、もう{少|すこ}し{安|やす}くなら《ないかなあ》。",
            "Ước gì giá rẻ thêm chút."
          ],
          [
            "{大丈夫|だいじょうぶ}《かなあ》…。",
            "Không biết có ổn không nữa…"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-souda",
    "title": "～そうだ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/souda.html",
    "points": [
      {
        "id": "vj-souda",
        "pattern": "～そうだ",
        "meaning": "Có vẻ…, nghe nói…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cách nối",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "{様態|ようたい} (có vẻ/ trông)",
                "Vます bỏ ます",
                "Vます-stem + そうだ",
                "{降|ふ}りそうだ、{落|お}ちそうだ",
                "Diễn cảm nhận trực quan, dấu hiệu sắp xảy ra"
              ],
              [
                "{様態|ようたい} (tính từ -i)",
                "Aい → bỏ い",
                "Aい(bỏ い) + そうだ",
                "おいしそうだ、{難|むずか}しそうだ",
                "いい → よさそうだ"
              ],
              [
                "{様態|ようたい} (tính từ -na)",
                "Aな",
                "Aな + そうだ",
                "{静|しず}かそうだ、{元気|げんき}そうだ",
                "Aな + そうな N / Aな + そうに V"
              ],
              [
                "Phủ định ({様態|ようたい})",
                "Vない/ Aいない dạng gốc",
                "Vなさそうだ / Aいくなさそうだ / Aなではなさそうだ",
                "{降|ふ}らなさそうだ、{高|たか}くなさそうだ、{静|しず}かではなさそうだ",
                "「ない」→「なさそう」"
              ],
              [
                "{伝聞|でんぶん} (nghe nói)",
                "Mệnh đề thông thường",
                "Mệnh đề + そうだ",
                "{明日|あした}、{雪|ゆき}が{降|ふ}るそうだ。",
                "Thường kèm nguồn: ～によると/では"
              ],
              [
                "Biến dạng",
                "Trạng ngữ/Định ngữ",
                "そうに V / そうな N",
                "{嬉|うれ}しそうに{笑|わら}う / おいしそうなケーキ",
                "Tăng tính tự nhiên"
              ]
            ]
          }
        ],
        "examples": [
          [
            "そのケーキはおいし《そうだ》。",
            "Cái bánh đó trông có vẻ ngon."
          ],
          [
            "{彼|かれ}は{今日|きょう}は{元気|げんき}《そうだ》。",
            "Hôm nay trông anh ấy có vẻ khỏe."
          ],
          [
            "{今|いま}にも{雨|あめ}が{降|ふ}り《そうだ》。",
            "Mưa sắp rơi đến nơi rồi."
          ],
          [
            "あの{店|みせ}は{高|たか}《くなさそうだ》。",
            "Quán đó có vẻ không đắt."
          ],
          [
            "ニュースによると、{来月|らいげつ}{値上|ねあ}げする《そうだ》。",
            "Theo tin tức, tháng sau sẽ tăng giá."
          ],
          [
            "{田中|たなか}さんは{来|こ}ない《そうだ》。",
            "Nghe nói anh Tanaka không đến."
          ],
          [
            "{彼女|かのじょ}は{嬉|うれ}し《そうに》{微笑|ほほえ}んだ。",
            "Cô ấy mỉm cười trông rất vui."
          ],
          [
            "よ《さそうな》アイデアですね。",
            "Ý tưởng có vẻ hay đấy."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-mitai-da",
    "title": "～みたいだ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/mitai-da.html",
    "points": [
      {
        "id": "vj-mitai-da",
        "pattern": "～みたいだ",
        "meaning": "Giống như…, có vẻ…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại kết hợp",
              "Cấu trúc với ～みたいだ",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ ({普通|ふつう}{形|けい})",
                "V({普|ふ}) + みたいだ",
                "{雨|あめ}が{降|ふ}るみたいだ",
                "Khẩu ngữ, có thể dùng みたいです (lịch sự)"
              ],
              [
                "Tính từ い",
                "Aい + みたいだ",
                "{安|やす}いみたいだ",
                "Giữ nguyên dạng い"
              ],
              [
                "Tính từ な",
                "Aな + みたいだ",
                "{静|しず}かみたいだ",
                "Thực tế hay dùng dạng bổ ngữ: A(な) + みたいな + N"
              ],
              [
                "Danh từ",
                "N + みたいだ",
                "{子|こ}どもみたいだ",
                "N + みたいな + N / N + みたいに + V・A"
              ],
              [
                "Dạng bổ nghĩa",
                "N/Adj + みたいな + N",
                "{子|こ}どもみたいな{声|こえ}",
                "“みたいな” như tính từ な"
              ],
              [
                "Trạng từ",
                "～みたいに + V/Adj",
                "プロみたいに{話|はな}す",
                "Dùng để chỉ cách thức/so sánh “như ...”"
              ],
              [
                "Phủ định/quá khứ",
                "～ないみたいだ／～だったみたいだ",
                "{来|こ}ないみたいだ／{忘|わす}れたみたいだ",
                "Dạng quá khứ biểu thị suy đoán đã xảy ra"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{彼|かれ}は《{子|こ}どもみたいだ》。",
            "Anh ấy như trẻ con vậy."
          ],
          [
            "{空|そら}が{暗|くら}くなってきた。《{雨|あめ}が{降|ふ}るみたいだ》。",
            "Trời tối dần. Hình như sắp mưa."
          ],
          [
            "{彼女|かのじょ}は{今日|きょう}《{忙|いそが}しいみたいだ》。",
            "Có vẻ hôm nay cô ấy bận."
          ],
          [
            "このスープ、《カレーみたいな》{味|あじ}がする。",
            "Súp này có vị như cà ri."
          ],
          [
            "{彼|かれ}は{日本人|にほんじん}じゃ《ないみたいだ》。",
            "Có vẻ anh ấy không phải người Nhật."
          ],
          [
            "{鍵|かぎ}を《{忘|わす}れたみたいだ》。",
            "Hình như mình quên chìa khóa rồi."
          ],
          [
            "{彼|かれ}の{発音|はつおん}は《ネイティブみたいに》{自然|しぜん}だ。",
            "Phát âm của anh ấy tự nhiên như người bản ngữ."
          ],
          [
            "その{話|はなし}は《{本当|ほんとう}みたいです》。",
            "Câu chuyện đó có vẻ là thật ạ."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-youda",
    "title": "～ようだ",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/youda.html",
    "points": [
      {
        "id": "vj-youda",
        "pattern": "～ようだ",
        "meaning": "Có vẻ…, hình như…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại",
              "Cấu trúc với ～ようだ",
              "Ví dụ ngắn",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）+ ようだ",
                "{雨|あめ}が{降|ふ}っているようだ。",
                "{普通|ふつう}{形|けい}: khẳng định/phủ định, hiện tại/quá khứ đều được."
              ],
              [
                "Tính từ -い",
                "Aい + ようだ",
                "{忙|いそが}しいようだ。",
                "Giữ nguyên -い."
              ],
              [
                "Tính từ -な",
                "Aな + な + ようだ / Aであるようだ",
                "{静|しず}かなようだ。",
                "Văn viết trang trọng dùng であるようだ."
              ],
              [
                "Danh từ",
                "N + の + ようだ / Nであるようだ",
                "{学生|がくせい}のようだ。",
                "Không dùng “Nだようだ” → sai."
              ],
              [
                "Định ngữ",
                "～ような + N",
                "{夢|ゆめ}のような{話|はなし}。",
                "Bổ nghĩa danh từ phía sau."
              ],
              [
                "Trạng ngữ",
                "～ように + V",
                "{子|こ}どものように{笑|わら}う。",
                "Biểu thị cách thức/so sánh."
              ]
            ]
          }
        ],
        "examples": [
          [
            "{外|そと}は{雨|あめ}が{降|ふ}っている《ようだ》。",
            "Bên ngoài hình như đang mưa."
          ],
          [
            "{田中|たなか}さんは{忙|いそが}しい《ようだ》。",
            "Anh Tanaka có vẻ bận."
          ],
          [
            "{彼|かれ}は{日本人|にほんじん}《のようだ》。",
            "Anh ấy trông giống người Nhật."
          ],
          [
            "{彼女|かのじょ}は{子|こ}ども《のように》{笑|わら}った。",
            "Cô ấy cười như trẻ con."
          ],
          [
            "まるで{夢|ゆめ}《のような》{景色|けしき}だ。",
            "Khung cảnh như trong mơ."
          ],
          [
            "{音|おと}からして{工事|こうじ}《のようだ》。",
            "Nghe âm thanh thì có vẻ là công trình xây dựng."
          ],
          [
            "{静|しず}か《なようだ》が、{中|なか}では{作業|さぎょう}している。",
            "Có vẻ yên lặng nhưng bên trong đang làm việc."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-sonna",
    "title": "そんな～",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/sonna.html",
    "points": [
      {
        "id": "vj-sonna",
        "pattern": "そんな～",
        "meaning": "Như vậy…, kiểu đó…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Chức năng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "そんな + N",
                "Chỉ loại/đối tượng “như vậy/kiểu đó”",
                "そんな + {名詞|めいし}",
                "そんな{人|ひと}、そんな{話|はなし}、そんな{店|みせ}",
                "Tham chiếu sự việc gần người nghe/đã nhắc"
              ],
              [
                "そんな + こと／もの",
                "Khái quát hóa sự việc/đồ vật",
                "そんなこと／そんなもの",
                "そんなこと{言|い}うな",
                "Biểu cảm mạnh, thường phủ định"
              ],
              [
                "そんな + はず／わけ",
                "Phủ định suy lý",
                "そんな + はず/わけ + がない",
                "そんなはずがない",
                "Cụm cố định"
              ],
              [
                "そんな + ふう({風|ふう})に",
                "Cách thức “theo kiểu đó”",
                "そんなふうに + V",
                "そんなふうに{考|かんが}える",
                "Biến thể trạng ngữ"
              ],
              [
                "そんなの (khẩu ngữ)",
                "Thay cho “そんなもの/こと”",
                "そんなの + は/が…",
                "そんなの{嫌|いや}だ",
                "Thân mật/khẩu ngữ"
              ]
            ]
          }
        ],
        "examples": [
          [
            "《そんな{人|ひと}》は{信|しん}じられない。",
            "Người như thế thì không thể tin."
          ],
          [
            "《そんなこと》を{言|い}うべきではない。",
            "Không nên nói những điều như vậy."
          ],
          [
            "《そんなはずがない》。",
            "Làm gì có chuyện như thế."
          ],
          [
            "どうして《そんなふうに》{考|かんが}えるの？",
            "Tại sao lại nghĩ theo cách đó?"
          ],
          [
            "《そんな{店|みせ}》は{知|し}りません。",
            "Tôi không biết cửa hàng như thế."
          ],
          [
            "《そんなの》{簡単|かんたん}だよ。",
            "Cái đó thì đơn giản mà."
          ],
          [
            "さっきの{話|はなし}、《そんな》{結末|けつまつ}だったの？",
            "Câu chuyện lúc nãy, kết cục lại như thế à?"
          ],
          [
            "《そんなわけない》ってば。",
            "Đã bảo là không đời nào có chuyện đó."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-sonnani",
    "title": "そんなに～",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/sonnani.html",
    "points": [
      {
        "id": "vj-sonnani",
        "pattern": "そんなに～",
        "meaning": "Đến mức đó, như thế",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Mẫu",
              "Kết hợp",
              "Cấu trúc",
              "Ý nghĩa",
              "Ghi chú"
            ],
            "rows": [
              [
                "そんなに + Adj/Adv",
                "Tính từ/Trạng từ",
                "そんなに + {高|たか}い／{上手|じょうず}に",
                "Đến mức đó",
                "Thường đi với phủ định"
              ],
              [
                "そんなに + V",
                "Động từ",
                "そんなに{食|た}べる／{驚|おどろ}く",
                "(Làm) đến mức đó",
                "Nhấn mạnh mức độ"
              ],
              [
                "そんなに ～ ない",
                "Phủ định",
                "そんなに{難|むずか}しくない",
                "Không đến mức đó",
                "Mẫu thông dụng"
              ],
              [
                "Hỏi nghi vấn",
                "Câu hỏi",
                "そんなにおいしい？",
                "Đến mức thế ư?",
                "Biểu cảm ngạc nhiên/hoài nghi"
              ],
              [
                "So sánh lượng",
                "Danh/ lượng từ",
                "そんなに{多|おお}くはない",
                "Không nhiều đến vậy",
                "Kết hợp với {数量|すうりょう}{詞|し}"
              ]
            ]
          }
        ],
        "examples": [
          [
            "この{問題|もんだい}は《そんなに》{難|むずか}しく《ない》よ。",
            "Bài này không khó đến mức đó đâu."
          ],
          [
            "{君|きみ}は《そんなに》{彼|かれ}が{好|す}きなの？",
            "Cậu thích anh ấy đến vậy sao?"
          ],
          [
            "{今日|きょう}は《そんなに》{暑|あつ}く《ない》ですね。",
            "Hôm nay không nóng đến thế nhỉ."
          ],
          [
            "お{腹|なか}が《そんなに》{空|す}いていないから、{少|すこ}しでいい。",
            "Tôi không đói lắm nên ăn chút là được."
          ],
          [
            "{時間|じかん}が《そんなに》あるわけじゃない。",
            "Không phải là có nhiều thời gian đến thế."
          ],
          [
            "《そんなに》{言|い}うなら、やってみなよ。",
            "Nếu cậu nói đến mức đó thì thử làm đi."
          ],
          [
            "この{店|みせ}、《そんなに》{安|やす}く《ない》と{思|おも}う。",
            "Tôi nghĩ quán này không rẻ đến vậy."
          ],
          [
            "{彼|かれ}は{仕事|しごと}が《そんなに》{速|はや}い。",
            "Anh ấy làm việc nhanh đến thế. (nhấn mạnh mức độ)"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-douiu",
    "title": "どういう～",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/douiu.html",
    "points": [
      {
        "id": "vj-douiu",
        "pattern": "どういう～",
        "meaning": "… như thế nào?",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu tạo với どういう～",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Định ngữ",
                "どういう + N",
                "どういう{人|ひと}／{本|ほん}／{意味|いみ}",
                "“Loại/kiểu/ý gì”"
              ],
              [
                "Cụm nghi vấn",
                "どういうこと[ですか/]",
                "それ、どういうこと？",
                "“Ý là sao?/Thế là thế nào?”"
              ],
              [
                "Cách thức",
                "どういうふうに + V",
                "どういうふうに{使|つか}いますか",
                "Hỏi “bằng cách nào/ra sao”"
              ],
              [
                "Lý do (cố định)",
                "どういうわけで／どういうわけか",
                "どういうわけか{遅|おく}れた",
                "“Vì lý do gì/không hiểu sao”"
              ],
              [
                "Hỏi định nghĩa",
                "～とはどういうこと[ですか/]",
                "{多様|たよう}{性|せい}とはどういうことですか",
                "Kết hợp với とは để yêu cầu định nghĩa"
              ]
            ]
          }
        ],
        "examples": [
          [
            "《どういう》{映画|えいが}が{好|す}きですか。",
            "Bạn thích phim kiểu gì?"
          ],
          [
            "それは《どういう{意味|いみ}》ですか。",
            "Cái đó có nghĩa là gì?"
          ],
          [
            "{昨日|きのう}の{発言|はつげん}は《どういうつもり》ですか。",
            "Phát ngôn hôm qua của anh là với ý định gì vậy?"
          ],
          [
            "この{単語|たんご}は{英語|えいご}で《どういう》んですか。",
            "Từ này tiếng Anh là gì?"
          ],
          [
            "{突然|とつぜん}{来|こ}ないなんて、《どういうこと》？",
            "Tự nhiên bảo không đến, là sao vậy?"
          ],
          [
            "《どういうふうに》{設定|せってい}すればいいですか。",
            "Nên cài đặt như thế nào?"
          ],
          [
            "《どういうわけか》{接続|せつぞく}できない。",
            "Không hiểu sao lại không kết nối được."
          ],
          [
            "“{責任|せきにん}”とは《どういうこと》か、{例|れい}を{挙|あ}げて{説明|せつめい}してください。",
            "“Trách nhiệm” là gì, hãy nêu ví dụ và giải thích."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-soretomo",
    "title": "～？それとも～？",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/soretomo.html",
    "points": [
      {
        "id": "vj-soretomo",
        "pattern": "～？それとも～？",
        "meaning": "…? Hay là …?",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Dạng",
              "Cấu trúc",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Câu hỏi lựa chọn (2 vế)",
                "［Mệnh đề nghi vấn］？それとも［Mệnh đề nghi vấn］？",
                "コーヒーにしますか？それとも{紅茶|こうちゃ}にしますか？",
                "Trong chữ viết có thể dùng dấu hỏi sau mỗi vế hoặc chỉ ở cuối; hạt か mới là dấu hiệu ngữ pháp chính."
              ],
              [
                "Câu hỏi một câu",
                "［Mệnh đề nghi vấn］、それとも［Mệnh đề nghi vấn］？",
                "{今|いま}{出発|しゅっぱつ}しますか、それとももう{少|すこ}し{待|ま}ちますか？",
                "Dùng dấu phẩy khi gộp thành một câu."
              ],
              [
                "Câu nghi vấn lồng ghép",
                "［…のか］、それとも［…のか］ + {分|わ}からない など",
                "{彼|かれ}が{来|く}るのか、それとも{来|こ}ないのか{分|わ}からない。",
                "Dùng trong mệnh đề danh hóa bằng のか."
              ],
              [
                "Cụm rút gọn",
                "{名詞|めいし}/フレーズ + それとも + {名詞|めいし}/フレーズ？",
                "{電車|でんしゃ}？ それともバス？",
                "Có thể lược bỏ phần trùng lặp."
              ]
            ]
          }
        ],
        "examples": [
          [
            "コーヒーにしますか？《それとも》{紅茶|こうちゃ}にしますか？",
            "Chọn cà phê hay là trà?"
          ],
          [
            "{今夜|こんや}は{家|いえ}で{食|た}べますか、《それとも》{外食|がいしょく}しますか？",
            "Tối nay ăn ở nhà hay ra ngoài ăn?"
          ],
          [
            "この{案|あん}でいきますか、《それとも》{別|べつ}の{案|あん}にしますか？",
            "Ta theo phương án này hay chọn phương án khác?"
          ],
          [
            "{彼|かれ}は{来|く}るのか、《それとも》{来|こ}ないのか{分|わ}からない。",
            "Tôi không biết cậu ấy sẽ đến hay không."
          ],
          [
            "{電車|でんしゃ}？ 《それとも》バス？",
            "Đi tàu hay đi bus?"
          ],
          [
            "{英語|えいご}で{話|はな}しますか？《それとも》{日本語|にほんご}がいいですか？",
            "Nói tiếng Anh hay tiếng Nhật thì tốt?"
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-temo-demo",
    "title": "～ても/でも",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/temo-demo.html",
    "points": [
      {
        "id": "vj-temo-demo",
        "pattern": "～ても/でも",
        "meaning": "Dù… cũng…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Loại từ",
              "Cấu tạo với ～ても/でも",
              "Ví dụ cấu trúc",
              "Nghĩa khái quát"
            ],
            "rows": [
              [
                "Động từ",
                "Vて＋も",
                "{何|なん}{度|ど}{聞|き}いても{分|わ}からない。",
                "Dù V thì cũng …"
              ],
              [
                "Tính từ い",
                "Aい→Aく＋ても",
                "{安|やす}くても{買|か}わない。",
                "Dù rẻ cũng không mua."
              ],
              [
                "Tính từ な",
                "Aな→A＋でも",
                "{便利|べんり}でも{使|つか}わない。",
                "Dù tiện cũng không dùng."
              ],
              [
                "Danh từ",
                "N＋でも",
                "{雨|あめ}でも{行|い}く。",
                "Dù là mưa cũng đi."
              ],
              [
                "Phủ định",
                "Aい＋くなくても／Na・N＋じゃなくても／V＋なくても",
                "{高|たか}くなくてもいい。 {学生|がくせい}じゃなくても{参加|さんか}できる。",
                "Dù không … cũng …"
              ],
              [
                "Nhấn mạnh",
                "たとえ～＋ても",
                "たとえ{失敗|しっぱい}しても{挑戦|ちょうせん}する。",
                "Cho dù … vẫn …"
              ]
            ]
          }
        ],
        "examples": [
          [
            "{忙|いそが}し《くても》{運動|うんどう}する{時間|じかん}を{作|つく}る。",
            "Dù bận cũng dành thời gian vận động."
          ],
          [
            "{説明|せつめい}を{聞|き}い《ても》まだ{分|わ}からない。",
            "Dù đã nghe giải thích vẫn chưa hiểu."
          ],
          [
            "{雨|あめ}《でも》{試合|しあい}を{行|おこな}います。",
            "Dù trời mưa vẫn tiến hành trận đấu."
          ],
          [
            "{経験|けいけん}が《なくても》{応募|おうぼ}できます。",
            "Dù không có kinh nghiệm vẫn có thể ứng tuyển."
          ],
          [
            "たとえ{反対|はんたい}され《ても》やり{抜|ぬ}く。",
            "Cho dù bị phản đối cũng làm đến cùng."
          ],
          [
            "いくら{食|た}べ《ても》{太|ふと}らない{人|ひと}がいる。",
            "Có người dù ăn bao nhiêu cũng không mập."
          ]
        ]
      }
    ]
  },
  {
    "id": "vj-noni",
    "title": "～のに",
    "source": "https://www.vnjpclub.com/ngu-phap-n4/noni.html",
    "points": [
      {
        "id": "vj-noni",
        "pattern": "～のに",
        "meaning": "Mặc dù…, thế mà…",
        "tables": [
          {
            "caption": "Cấu trúc cơ bản",
            "headers": [
              "Kết hợp",
              "Công thức với ～のに",
              "Ví dụ cấu trúc",
              "Ghi chú"
            ],
            "rows": [
              [
                "Động từ",
                "V（{普通|ふつう}{形|けい}）＋のに",
                "{頑張|がんば}ったのに／{雨|あめ}が{降|ふ}るのに",
                "Diễn tả nghịch lý “mặc dù”"
              ],
              [
                "Tính từ い",
                "Aい（{普通|ふつう}{形|けい}）＋のに",
                "{安|やす}いのに／{寒|さむ}かったのに",
                "Giữ nguyên đuôi い"
              ],
              [
                "Tính từ な",
                "Aなのに",
                "{便利|べんり}なのに/ {便利|べんり}だったのに",
                "Phải có な → なのに"
              ],
              [
                "Danh từ",
                "Nなのに",
                "{日本人|にほんじん}なのに/ {雨|あめ}だったのに",
                "Bắt buộc なのに"
              ],
              [
                "Lưu ý nghĩa khác",
                "Vる＋のに[に/]",
                "この{箱|はこ}は{物|もの}を{入|い}れるのに{便利|べんり}だ。",
                "“để/cho việc ~” (không phải nghịch lý)"
              ]
            ]
          }
        ],
        "examples": [
          [
            "たくさん{勉強|べんきょう}した《のに》、{合格|ごうかく}できなかった。",
            "Mặc dù đã học rất nhiều nhưng tôi vẫn không đỗ."
          ],
          [
            "{雨|あめ}《なのに》、{傘|かさ}を{持|も}ってこなかった。",
            "Dù trời mưa mà tôi lại không mang ô."
          ],
          [
            "{彼|かれ}は{日本人|にほんじん}《なのに》、{漢字|かんじ}が{読|よ}めない。",
            "Anh ấy là người Nhật vậy mà không đọc được kanji."
          ],
          [
            "こんなに{安|やす}い《のに》、{品質|ひんしつ}がいい。",
            "Dù rẻ đến vậy mà chất lượng lại tốt."
          ],
          [
            "{早|はや}く{起|お}きた《のに》、{遅刻|ちこく}した。",
            "Dù dậy sớm nhưng vẫn đi muộn."
          ],
          [
            "{約束|やくそく}した《のに》、{来|こ}なかったの？",
            "Đã hẹn rồi mà không đến à?"
          ]
        ]
      }
    ]
  }
];

export const VNJPCLUB_INTERCHANGEABLE_GROUPS: readonly string[] = [
  "vj-1",
  "vj-2",
  "vj-3",
  "vj-4",
  "vj-5",
  "vj-6",
  "vj-7"
];

export const VNJPCLUB_SYNONYMS: readonly (readonly string[])[] = [
  [
    "vj-ta-toki-ni",
    "vj-ru-toki-ni"
  ],
  [
    "vj-tara-ii",
    "vj-to-ii"
  ]
];
