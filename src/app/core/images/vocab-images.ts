import { audioIdOf } from '../audio/vocab-audio';
import type { VocabularyWord } from '../lessons/vocabulary.model';

/**
 * Ảnh minh họa của từ vựng — bảng gán từ → ảnh Wikimedia Commons, NGUỒN SỰ THẬT DUY NHẤT.
 *
 * Ảnh là ảnh thật trên Wikimedia Commons (https://commons.wikimedia.org): chỉ nhận ảnh có
 * giấy phép tự do (CC0, phạm vi công cộng, "No restrictions" của Flickr Commons, CC BY, CC BY-SA), lấy qua API công khai của
 * Commons — không cần tài khoản hay API key. `npm run generate:images` tải bản thu nhỏ
 * của mọi ảnh trong bảng về `public/images/vocab/`; `verify:images` kiểm tra đủ file,
 * giấy phép hợp lệ và mọi từ trong bảng đều có thật trong một bài học.
 *
 * Mỗi ảnh có giấy phép riêng, nên tác giả và giấy phép đi kèm TỪNG ảnh và luôn hiện ngay
 * dưới ảnh (cột "Hình ảnh" của bảng từ, phần phản hồi khi luyện) — CC BY và CC BY-SA bắt
 * buộc ghi tên tác giả và giấy phép ở chỗ dùng ảnh.
 *
 * Gán theo TỪ chứ không theo bài: cùng một từ ở bài khác cũng hiện cùng ảnh. Khoá là
 * `chữ Nhật|cách đọc` — không dùng id của từ, vì id băm cả âm Hán Việt, sửa âm Hán Việt
 * là mất ảnh. Mỗi từ một ảnh khác nhau.
 */

export interface VocabImageSource {
  /** Tên file trên Commons, không có tiền tố "File:". */
  file: string;
  /** Tác giả, đúng như trang ảnh trên Commons ghi. */
  author: string;
  /** Tên ngắn của giấy phép, ví dụ "CC BY-SA 4.0", "CC0", "Public domain". */
  license: string;
  /** Trang của giấy phép; không có với ảnh thuộc phạm vi công cộng. */
  licenseUrl?: string;
}

/** Ảnh của một từ, đã sẵn để vẽ. */
export interface VocabImage {
  /** Đường dẫn bản thu nhỏ, tương đối theo `<base href>`. */
  src: string;
  author: string;
  license: string;
  licenseUrl: string | null;
  /** Trang của ảnh trên Commons — ghi nguồn trỏ về đây. */
  page: string;
}

/** Thư mục chứa ảnh, tính theo `<base href>`. */
export const VOCAB_IMAGE_PATH = 'images/vocab/';

/**
 * Bề rộng bản thu nhỏ tải về. Phải là một nấc chuẩn của Commons (120, 250, 330, 500…):
 * Commons chặn yêu cầu thu nhỏ ở bề rộng tuỳ ý. 330px đủ nét cho khung ảnh lớn nhất
 * của app (câu hỏi luyện tập) mà mỗi ảnh chỉ vài chục KB.
 */
export const VOCAB_IMAGE_WIDTH = 330;

/** `chữ Nhật|cách đọc` → ảnh trên Commons. */
export const VOCAB_IMAGES: Readonly<Record<string, VocabImageSource>> = {
  // Từ vựng N3 · 名詞 — Bài 1–3 (1–150). Vài từ chưa có ảnh: Commons không có ảnh nào
  // đúng nghĩa (目上, 先輩, 就職, 帰宅, けが, 遠慮, 呼ぶ, 思い出す) — để trống còn hơn ảnh sai.
  '男性|だんせい': {
    file: 'Professional portrait of a confident young man in business attire, smiling warmly against a neutral background..jpg',
    author: 'Emkaija',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '女性|じょせい': {
    file: 'Half-length portrait of a young woman outdoors (AM 74708-1).jpg',
    author: 'Collins, Tudor Washington, 1898-1970, photographer',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '高齢|こうれい': {
    file: 'India - Delhi portrait of a man - 4780.jpg',
    author: 'Jorge Royan',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '年上|としうえ': {
    file: 'Helene Thiesen with her older sister, younger brother and uncle.jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '後輩|こうはい': {
    file: 'Freshmen orientation.jpg',
    author: 'Asamoah Daniel Kwame Oware',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '上司|じょうし': {
    file: 'Talk it over with your boss - NARA - 535313.jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '相手|あいて': {
    file: '(Chess-players.) (BM 1851,0901.385).jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '知り合い|しりあい': {
    file: 'Customs of Central Asians. Two Men Greeting Each Other WDL10837.png',
    author: 'Kun, Aleksandr L., 1840-1888',
    license: 'Public domain',
  },
  '友人|ゆうじん': {
    file: 'Two friends sitting together, chatting and laughing.jpg',
    author: 'Ahmed Mo Abd Elaaty',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '仲|なか': {
    file: 'Two Friends In The Woods.jpg',
    author: 'D. Sharon Pruitt from Hill Air Force Base, Utah, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '生年月日|せいねんがっぴ': {
    file: 'UK Armed Forces Birth Certificate II.jpg',
    author: 'General Register Office',
    license: 'Public domain',
  },
  '誕生|たんじょう': {
    file: 'A birthday cake in West Bengal, India.jpg',
    author: 'Billjones94',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '年|とし': {
    file: '2024-01-01 new-year-illustration.jpg',
    author: 'David Revoy',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '出身|しゅっしん': {
    file: 'GIB Airport PassportStamp.png',
    author: '牙鷹州別駕不得簽書公事',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '故郷|こきょう': {
    file: 'Sugitani Shinden02.jpg',
    author: 'Motokoka',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '成長|せいちょう': {
    file: 'Adenium seedling 2day Uthandi Aug21 D72 20609-21 ZP.jpg',
    author: 'Timothy A. Gonsalves',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '成人|せいじん': {
    file: 'Coming of Age Day.jpg',
    author: 'Dick Johnson from Tokyo, Japan',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '合格|ごうかく': {
    file: 'University of Tokyo Admittance Celebrations 2011-03-10.JPG',
    author: 'Dront',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  '進学|しんがく': {
    file: 'Meiji University entrance exam April 2007.JPG',
    author: 'Allentchang',
    license: 'CC BY 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.5',
  },
  '退学|たいがく': {
    file: 'Classroom 843785861.jpg',
    author: 'strngwrldfrwl from Japan',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '退職|たいしょく': {
    file: 'Jennifer Pinney Retirement Party, December 1988 (3982883475).jpg',
    author: 'Unknown author',
    license: 'No restrictions',
    licenseUrl: 'https://www.flickr.com/commons/usage/',
  },
  '失業|しつぎょう': {
    file: 'Unemployed men queued outside a depression soup kitchen opened in Chicago by Al Capone, 02-1931 - NARA - 541927.jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '残業|ざんぎょう': {
    file: 'Working till late night at stc\'s office. (4095053644).jpg',
    author: 'Jadi from Iran',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '生活|せいかつ': {
    file: 'Family eating together.jpg',
    author: 'Kwameghana',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '通勤|つうきん': {
    file: 'Rush hour at Yonge (40807076695).jpg',
    author: 'Enoch Leung from Canada',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '学歴|がくれき': {
    file: 'Graduation diploma, graduation cap and senior ring of Robert Paul Rowan (10009396).jpg',
    author: 'University of Texas at Arlington Photograph Collection',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '給料|きゅうりょう': {
    file: 'Metropolitan Police 1955 Payslip.jpg',
    author: 'Pontificalibus',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '面接|めんせつ': {
    file: 'Woman on a Job Interview - 38826218972.jpg',
    author: 'amtec_photos',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '休憩|きゅうけい': {
    file: 'Black Coffee and Tea in White Cup is Hot.png',
    author: 'epSos.de',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '観光|かんこう': {
    file: 'Tenryū-ji Temple, Kyoto (24009145960).jpg',
    author: 'John Gillespie from New York, USA',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '帰国|きこく': {
    file: 'Logan Airport International Arrivals Hall.jpg',
    author: 'hildgrim',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '帰省|きせい': {
    file: 'Partch family reunion, 1924 - DPLA - e6feed8f63a17754933dbb6fc10cabfb.jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '参加|さんか': {
    file: 'Participants raising their hands at the Global Youth Summit 2016.jpg',
    author: 'GCM Communications',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '出席|しゅっせき': {
    file: 'A classroom with students at the College of Medicine, FUASK.jpg',
    author: 'Kambai Akau',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '欠席|けっせき': {
    file: 'The empty chair installation in Yehud, April 2024 31.jpg',
    author: 'Chenspec',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '遅刻|ちこく': {
    file: '\'Running Late\' - geograph.org.uk - 35330.jpg',
    author: 'paddy heron',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '化粧|けしょう': {
    file: 'Woman applying makeup powder on her face.jpg',
    author: 'Shixart1985',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '計算|けいさん': {
    file: 'Citizen SLD-100NR calculator.jpg',
    author: 'LoMit',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '計画|けいかく': {
    file: 'Plan Your Future - Save With a Plan Art.IWMPST16363.jpg',
    author: 'National Savings Committee',
    license: 'Public domain',
  },
  '成功|せいこう': {
    file: 'Up the last steep piece at the summit of Storebjørn.jpg',
    author: 'Frankemann',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '失敗|しっぱい': {
    file: 'Broken Plate.jpg',
    author: 'ProjectManhattan',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '準備|じゅんび': {
    file: 'Holiday Packing List - Packing Luggage for Vacation.jpg',
    author: 'Familydestinationsguide.com Images',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '整理|せいり': {
    file: '5S Tools drawer.jpg',
    author: 'Tasma3197',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '注文|ちゅうもん': {
    file: 'Waitress taking an order.jpg',
    author: 'photo taken by flickr user alan.light',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '貯金|ちょきん': {
    file: 'Piggy-bank-968302.jpg',
    author: 'stevepb',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '徹夜|てつや': {
    file: 'Depressed middle-aged businesswoman working late at night struggles with tasks in front of laptop while holding head with hands.jpg',
    author: 'Shixart1985',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '引っ越し|ひっこし': {
    file: 'Mayflower Moving Truck Ypsilanti Michigan.JPG',
    author: 'Dwight Burdette',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  '身長|しんちょう': {
    file: 'US Army physical examination.jpg',
    author: 'Harris & Ewing',
    license: 'Public domain',
  },
  '体重|たいじゅう': {
    file: 'Pharmacist Weighing scale.jpg',
    author: 'Pink Flojd',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '会|かい': {
    file: 'Pierre-Auguste Renoir - Luncheon of the Boating Party - Google Art Project.jpg',
    author: 'Pierre-Auguste Renoir',
    license: 'Public domain',
  },
  '趣味|しゅみ': {
    file: 'Oma strickt Strümpfe.jpg',
    author: 'Sadarama',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '興味|きょうみ': {
    file: 'A curious child, smelling flower, India.jpg',
    author: '☻☺',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '思い出|おもいで': {
    file: 'Альбомъ стараго Львова. 1917. №02. Малюнок внутрішньої обкладинки.jpg',
    author: 'В. Верещагинъ',
    license: 'Public domain',
  },
  '冗談|じょうだん': {
    file: 'DSC 7185 Three friends laugh and chat at a table in a cozy restaurant as a man stands by their booth joining the conversation over wine bottles and drinks.jpg',
    author: 'PattayaPatrol',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '目的|もくてき': {
    file: 'WA archery target with arrows.jpg',
    author: 'Unknown author',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '約束|やくそく': {
    file: 'Janji jentik.jpg',
    author: 'Pinerineks',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'おしゃべり|': {
    file: 'Women Chatting (30463239711).jpg',
    author: 'Michael Coghlan from Adelaide, Australia',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '我慢|がまん': {
    file: '“Patience is waiting. Not passively waiting. That is laziness. But to keep going when the going is hard and slow - that is patience.” (8127635364).jpg',
    author: 'Trish Hamme from Reno , Nevada, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '迷惑|めいわく': {
    file: 'ध्वनि प्रदूषण मराठी माहिती (2).jpg',
    author: 'Darjamarathicha.in',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '希望|きぼう': {
    file: 'Light of hope in sunrise.jpg',
    author: 'Ridita1224',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '夢|ゆめ': {
    file: 'A child sleeping.jpg',
    author: 'Alessandro Zangrilli',
    license: 'Public domain',
  },
  '賛成|さんせい': {
    file: 'Thumb up.JPG',
    author: 'Pogrebnoj-Alexandroff',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '反対|はんたい': {
    file: 'Protest signs by ILGA Portugal (2 February 2024) 04.jpg',
    author: 'JnpoJuwan',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '想像|そうぞう': {
    file: 'Child engaged in drawing activity with adult guidance indoors during daytime at home - Flickr - nenad53.jpg',
    author: 'Nenad Stojkovic',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '努力|どりょく': {
    file: '2018-10-05 Weightlifting Training at 2018 Summer Youth Olympics (Martin Rulsch) 32.jpg',
    author: 'Martin Rulsch, Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '太陽|たいよう': {
    file: 'Solar Orbiter’s widest high-res view of the Sun ESA508430.jpg',
    author: 'European Space Agency',
    license: 'CC BY-SA 3.0 igo',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/igo/deed.en',
  },
  '地球|ちきゅう': {
    file: 'North America from low orbiting satellite Suomi NPP.jpg',
    author: 'NASA/NOAA/GSFC/Suomi NPP/VIIRS/Norman Kuring',
    license: 'Public domain',
  },
  '温度|おんど': {
    file: 'CelsiusKelvinThermometer.jpg',
    author: 'Martinvl',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '湿度|しつど': {
    file: '2023 Czujnik temperatury i wilgotności Xiaomi (2).jpg',
    author: 'Jacek Halicki',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '湿気|しっけ': {
    file: 'Window condensation 12022021.jpg',
    author: 'Doggo19292',
    license: 'Public domain',
  },
  '梅雨|つゆ': {
    file: '紫陽花 flower at start of rainy season in Tokyo.jpg',
    author: 'Syced',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  'かび|': {
    file: 'Mouldy bread.jpg',
    author: 'Matt Wharton',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '暖房|だんぼう': {
    file: 'Oil Heater 5293.jpg',
    author: 'Ashley Pomeroy',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  '皮|かわ': {
    file: 'Apple peal.jpg',
    author: 'Challiyan at Malayalam Wikipedia',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '缶|かん': {
    file: 'Konservendose-1.jpg',
    author: 'Rainer Zenz',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '画面|がめん': {
    file: 'Smartphone Use.jpg',
    author: 'Océanos y dados',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '番組|ばんぐみ': {
    file: 'A todo o nada Chile Studio (20200130 194226).jpg',
    author: 'NMdUnsl',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '記事|きじ': {
    file: 'Newspaper article - DPLA - 7afab3e792c6cb543fe1b1803118021c.jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '近所|きんじょ': {
    file: 'Residential street in Shinjuku.jpg',
    author: 'Real Estate Japan',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '警察|けいさつ': {
    file: 'Chūō Police Station Jigyō Police Box 29-15 Jigyō-3-chōme Chūō-ku Fukuoka City 20221101.jpg',
    author: 'Hirho',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '犯人|はんにん': {
    file: 'Burglar.jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '小銭|こぜに': {
    file: 'JPY coin3.png',
    author: 'Misogi, was_a_bee',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  'ごちそう|': {
    file: 'Georgian Feast (7).jpg',
    author: 'rugbyxm',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '作者|さくしゃ': {
    file: 'Senior man writer with glasses writing on an old typewriter.jpg',
    author: 'Shixart1985',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '作品|さくひん': {
    file: 'Jan Vermeer - The Art of Painting - Google Art Project.jpg',
    author: 'Johannes Vermeer',
    license: 'Public domain',
  },
  '制服|せいふく': {
    file: 'School uniforms of Izuo High School 20090308.jpg',
    author: 'fukuhen',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '洗剤|せんざい': {
    file: 'Laundry detergent pods.jpg',
    author: 'ajcespedes',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '底|そこ': {
    file: 'Bottom of a bottle plain Borjomi (2).jpg',
    author: 'Oop in Fliker www.oopsfotos.nl',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '地下|ちか': {
    file: 'Connecting passage gate to K Underground Mall on B1, Taipei Main Station 20260807.jpg',
    author: 'Bigmorr',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '寺|てら': {
    file: 'Water reflection of Kinkaku-ji Temple a sunny day, Kyoto, Japan.jpg',
    author: 'Basile Morin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '道路|どうろ': {
    file: 'D1 Hrádok highway strip 2017.jpg',
    author: 'MarkBA',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '坂|さか': {
    file: 'Steep slope (geograph 6445644).jpg',
    author: 'Anthony O\'Neil',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '煙|けむり': {
    file: 'Chimney spewing smoke, rose-colored.jpg',
    author: 'Martin Abegglen',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '灰|はい': {
    file: 'Ashtray ছাই পাত্র 2020-06-18.jpg',
    author: 'খাঁ শুভেন্দু',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '判|はん': {
    file: 'Hanko, japanese seal.jpg',
    author: 'Culture Japon',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '名刺|めいし': {
    file: 'WMW business card.png',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '免許|めんきょ': {
    file: 'DE Licence 2013 Front.jpg',
    author: 'Bundesrepublik Deutschland, Bundesministerium des Innern',
    license: 'Public domain',
  },
  '多く|おおく': {
    file: 'Huge crowd at one of the many Sam Lands 2KY picnics, c.1930 by Sam Hood. (25751960788).jpg',
    author: 'State Library of New South Wales from Australia',
    license: 'No restrictions',
    licenseUrl: 'https://www.flickr.com/commons/usage/',
  },
  '前半|ぜんはん': {
    file: 'First Half Play Chart from the 1919 Pitt versus W. & J. game.png',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '後半|こうはん': {
    file: 'Chart of second half plays from the 1919 Pitt versus W. & J. football game.png',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '最高|さいこう': {
    file: 'Gold Medal Ceremony - Men\'s individual archery.jpg',
    author: 'Andy Rogers',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '最低|さいてい': {
    file: 'MINIMUM AND MAXIMUM THERMOMETER.jpg',
    author: 'Mr Setson',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '最初|さいしょ': {
    file: 'Early toddler.jpg',
    author: 'Danilobu',
    license: 'CC BY 2.5',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.5',
  },
  '最後|さいご': {
    file: 'Last piece of the puzzle (2328170056).jpg',
    author: 'Justin Henry',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '自動|じどう': {
    file: 'Automatic Door with Bars.jpg',
    author: 'Scott Brody',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '種類|しゅるい': {
    file: 'Ambrosia jm26705.jpg',
    author: 'joergens.mi',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '性格|せいかく': {
    file: 'Facial expressions - The Cartoonist\'s Art.jpg',
    author: 'J. Campbell Cory',
    license: 'Public domain',
  },
  '性質|せいしつ': {
    file: 'Bar-magnets-attracting-iron-filings max.jpg',
    author: 'MikeRun, Vera Wurmsdobler',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '順番|じゅんばん': {
    file: 'Bregenz-Vorarlberg (ship)-queue-01ASD.jpg',
    author: 'Asurnipal',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '番|ばん': {
    file: 'Ticket-impôts-Genève-2004.jpg',
    author: 'MHM55',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '方法|ほうほう': {
    file: 'Quiche Recipe (299743519).jpg',
    author: 'Mack Male from Edmonton, AB, Canada',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '製品|せいひん': {
    file: 'Ducati 98 assembly line (ca. 1957).jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '値上がり|ねあがり': {
    file: 'Gas Prices on Easter Sunday (2026).jpg',
    author: 'Rick Obst',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '生|なま': {
    file: 'Sashimi of São Paulo.jpg',
    author: 'Wilfredor',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '渇く|かわく': {
    file: 'Macaca fascicularis drinking water from a bottle.jpg',
    author: 'Basile Morin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '嗅ぐ|かぐ': {
    file: 'Jan-Bart de Vreede smelling flowers.jpg',
    author: 'VGrigas (WMF)',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '叩く|たたく': {
    file: 'Drum for cultural dance.jpg',
    author: 'Elizfred',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '殴る|なぐる': {
    file: 'U S Army Soldier Throws a Punch in Boxing Competition (7693790).jpg',
    author: 'U.S. Army JMRC by Spc. Donovon Lynch',
    license: 'Public domain',
  },
  'ける|': {
    file: 'Football in Bloomington, Indiana, 1995.jpg',
    author: 'Rick Dikeman',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '抱く|だく': {
    file: 'Human–canine friendship - girl hugging her dog tightly at golden hour in Laos.jpg',
    author: 'Basile Morin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '倒れる|たおれる': {
    file: 'Fallen Tree in Dormer Place, Leamington Spa (1).jpg',
    author: 'Vauxford',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '倒す|たおす': {
    file: 'Dominoes falling.jpg',
    author: 'Kurt:S',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '起きる|おきる': {
    file: 'Morning (BM 1949,0411.1981).jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '起こす|おこす': {
    file: 'Classic alarm clock 20180513.jpg',
    author: 'Santeri Viinamäki',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '尋ねる|たずねる': {
    file: 'Asking directions, Omagh - geograph.org.uk - 4992994.jpg',
    author: 'Kenneth Allen',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '叫ぶ|さけぶ': {
    file: 'Drill instructor at the Officer Candidate School.jpg',
    author: 'John Kennicutt, U.S. Marine Corps',
    license: 'Public domain',
  },
  '黙る|だまる': {
    file: 'Asian woman shushing.jpg',
    author: 'Kim Boek from Seoul, South Korea',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '飼う|かう': {
    file: 'Dog owner and dog at Pet Pride Day, 2002.jpg',
    author: 'Nancy Wong',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '数える|かぞえる': {
    file: 'Finger-counting to 10 ASL.png',
    author: 'Justinkunimune',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '乾く|かわく': {
    file: 'Drought land dry mud BOUHANIFIA Algeria 02.jpg',
    author: 'Hydrosami',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '乾かす|かわかす': {
    file: 'Laundry drying during summer in Lovozero, Kola Peninsula.jpg',
    author: 'Videnslandskaber',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '畳む|たたむ': {
    file: 'HSY- Folded Towels.jpg',
    author: 'HanSangYoon',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '誘う|さそう': {
    file: 'Museovirasto invitation card kutsukortti.jpg',
    author: 'Unknown author',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  'おごる|': {
    file: 'Pay the bill.jpg',
    author: 'Benreis',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  '預かる|あずかる': {
    file: '23c3 by taw cloakroom 1.jpg',
    author: 'Taw',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '預ける|あずける': {
    file: 'Shioiri Station coin lockers 20100514.jpg',
    author: 'Uploader; Vantey',
    license: 'Public domain',
  },
  '決まる|きまる': {
    file: 'A "Vote Here" sign outside Aitkin Public Library on Primary Election Day, Aug. 11, 2026 in Aitkin.jpg',
    author: 'Lorie Shaull',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '決める|きめる': {
    file: 'Comet Interceptor contract signing ESA24643784.jpg',
    author: 'European Space Agency',
    license: 'CC BY-SA 3.0 igo',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/igo/deed.en',
  },
  '写る|うつる': {
    file: 'Reflection Lake, Lassen Volcanic National Park, in June 2022-6049.jpg',
    author: 'Frank Schulenburg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '写す|うつす': {
    file: 'Photographer with Camera and Tripod (51832409816).jpg',
    author: 'ShenandoahNPS',
    license: 'Public domain',
  },
  '教わる|おそわる': {
    file: 'Students learning in class.jpg',
    author: 'Knowledge and philosophy',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '申し込む|もうしこむ': {
    file: 'Passport application form blank Russia.jpg',
    author: 'Rakoon',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  // Từ vựng N3 · 名詞 — Bài 4 (151–200)
  '断る|ことわる': {
    file: 'Stop Coronavirus COVID-19 in Russia.jpg',
    author: 'https://www.vperemen.com',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '見つかる|みつかる': {
    file: 'TfL lost property office on Baker Street - geograph.org.uk - 1404542.jpg',
    author: 'Andy F',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '見つける|みつける': {
    file: 'Mag glass request.jpg',
    author: 'WolfenSilva',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '捕まる|つかまる': {
    file: 'SPC Brian Redford, a military policeman, handcuffs a suspect after making an arrest DA-SN-83-09213.jpg',
    author: 'Peter Strescino',
    license: 'Public domain',
  },
  '捕まえる|つかまえる': {
    file: 'Catching frogs and critters family activity mother and son catching frogs.jpg',
    author: 'U.S. Fish and Wildlife Service',
    license: 'Public domain',
  },
  '乗る|のる': {
    file: 'Passengers boarding on Bus (YS).jpg',
    author: 'YVSREDDY',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '乗せる|のせる': {
    file: 'A Father\'s Sacrifice, Carrying His Son Through Rain to the Entry Trail of Mt. Apo, Philippines\' Highest Peak.jpg',
    author: 'Ritchie Basilio',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '降りる|おりる': {
    file: 'Rahm Emanuel getting off a Shinkansen train.jpg',
    author: 'ラーム・エマニュエル駐日米国大使',
    license: 'Public domain',
  },
  '降ろす|おろす': {
    file: 'Vendor central - unloading from truck, New Orleans Mardi Gras 2011.jpg',
    author: 'Derek Bridges',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '直る|なおる': {
    file: 'Hand Pinted Kintsugi Pottery Bowl.jpg',
    author: 'Ruthann Hurwitz',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '直す|なおす': {
    file: 'The Bicycle Mechanic.jpg',
    author: 'NoahNairobi',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '治る|なおる': {
    file: 'US Navy 090527-A-4455C-005 Capt. Samantha Wigeand smiles at her patient, Yimana Garcia, before Garcia\'s surgery aboard the Military Sealift Command hospital ship USNS Comfort (T-AH 20) to remove a cyst in her ovaries.jpg',
    author: 'U.S. Army photo by Spc. Eric J. Cullen',
    license: 'Public domain',
  },
  '治す|なおす': {
    file: 'Doctor treats ICU pediatrics patient.jpg',
    author: 'Bill Branson (Photographer)',
    license: 'Public domain',
  },
  '亡くなる|なくなる': {
    file: 'Enterrement au Rwanda.jpg',
    author: 'Nibeza',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '亡くす|なくす': {
    file: 'William-Adolphe Bouguereau - Mourning Women Kneeling at Grave - Walters 371408.jpg',
    author: 'William-Adolphe Bouguereau',
    license: 'Public domain',
  },
  '生まれる|うまれる': {
    file: 'HumanNewborn.JPG',
    author: 'Ernest F',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '生む|うむ': {
    file: 'A beatiful woman holding a newborn baby.jpg',
    author: 'De-Invincible',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '出会う|であう': {
    file: 'Circa 1880 Two women bowing, "ojigi" (hand-colored albumen print, Japan).jpg',
    author: 'Unknown author',
    license: 'Public domain',
  },
  '訪ねる|たずねる': {
    file: 'Doorbell Corpus Christi Texas.jpg',
    author: 'Terry Ross',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '付き合う|つきあう': {
    file: 'Adult couple holding hands.jpg',
    author: 'Alice Donovan Rouse (@alicekat)',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '効く|きく': {
    file: 'Tablets pills medicine medical waste.jpg',
    author: 'Pöllö',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  'はやる|': {
    file: '2015-05-02 a baobing restaurant at Yongkang Street, Taipei.jpg',
    author: 'Sun Taro',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '経つ|たつ': {
    file: 'Wooden hourglass 3.jpg',
    author: 'User:S Sepp',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '間に合う|まにあう': {
    file: 'Girl catchs a train.jpg',
    author: 'bs70',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '間に合わせる|まにあわせる': {
    file: 'DMZ Trailrun 파주 - Finish line - (36897256086) DSC-3981.jpg',
    author: 'deok rae jo',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '通う|かよう': {
    file: 'Students walking through UNC campus.jpg',
    author: 'Dennis Ludlow - Sharkshock',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '込む|こむ': {
    file: 'A crowded platform - rush hour - yurakucho - July 2014.jpg',
    author: 'nesnad',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  'すれ違う|すれちがう': {
    file: 'Shibuya Crossing (53084067820).jpg',
    author: 'Dick Thomas Johnson from Tokyo, Japan',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '掛かる|かかる': {
    file: 'Biagio Rebecca (1735-1808) (possibly) - Wall Hanging of an Italianate Landscape - 81031384 - Audley End House.jpg',
    author: 'Biagio Rebecca',
    license: 'Public domain',
  },
  '掛ける|かける': {
    file: 'Coat hook C.jpg',
    author: 'Fructibus',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '動く|うごく': {
    file: 'Front view of an illuminated outdoor escalator, Shinjuku Station, Tokyo.jpg',
    author: 'Basile Morin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '動かす|うごかす': {
    file: 'Moving furniture in (3639194716).jpg',
    author: 'Bonner Springs Library',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '離れる|はなれる': {
    file: 'Children of ship officer waving goodbye during departure of USS Arlington (LPD-24) from Norfolk for deployment (151006-N-WV703-545).jpg',
    author: 'Mass Communication Specialist Seaman Amy M. Ressler',
    license: 'Public domain',
  },
  '離す|はなす': {
    file: 'Balloon Release in Bogalusa, Louisiana 2024.jpg',
    author: 'Ktkvtsh',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'ぶつかる|': {
    file: 'Japanese car accident.jpg',
    author: 'Shuets Udono',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  'ぶつける|': {
    file: 'Bumper Cars.jpg',
    author: 'Ethan2038',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'こぼれる|': {
    file: 'Badam milk spilled.jpg',
    author: 'DEEPAN RAJA .M',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'こぼす|': {
    file: 'Coffee beans spilling out of a cup.jpg',
    author: 'Christoph',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  'ふく|': {
    file: 'Students wiping windows at the end of the semester in Baozhong Junior High School 2014-06-13.jpg',
    author: '褒忠國中 雲端網',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '片付く|かたづく': {
    file: 'Extremely tidy room.jpg',
    author: 'Barbara-Ingeborg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '片付ける|かたづける': {
    file: 'Tidying by Helen W. Cooke.jpg',
    author: 'Helen W. Cooke',
    license: 'Public domain',
  },
  '包む|つつむ': {
    file: 'Gift wrapping in a jewellery shop 2.jpg',
    author: 'W.carter',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '張る|はる': {
    file: 'The Soviet Union 1960 Illustrated stamped envelope Lapkin 60-186(1286)face(Eurasian beaver) with stamp and Jacobs 799 cancelled.jpg',
    author: 'USSR Post',
    license: 'Public domain',
  },
  '無くなる|なくなる': {
    file: 'Empty plate with fork.jpg',
    author: 'SWT666',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '無くす|なくす': {
    file: 'Single lost glove in the Huntington parking deck (64567).jpg',
    author: 'Ser Amantio di Nicolao',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '足りる|たりる': {
    file: 'Glass-of-water.jpg',
    author: 'Derek Jensen (Tysto)',
    license: 'Public domain',
  },
  '残る|のこる': {
    file: 'Leftovers from Thanksgiving.jpg',
    author: 'Andrew Nash from Vienna, Austria',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '残す|のこす': {
    file: 'Milano\'s Café pork loin and veg Russell Street Stroud Gloucestershire England 04.jpg',
    author: 'Acabashi',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '腐る|くさる': {
    file: 'Rotten Apple 02.jpg',
    author: 'Shams948',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  'むける|': {
    file: 'Banane-A-05 cropped.jpg',
    author: 'Priwo',
    license: 'Public domain',
  },
  // Từ vựng N3 · 名詞 — Bài 5 (201–250). Chưa có ảnh: 片づけ, 急ぎ, 迎え — Commons không có ảnh
  // nào đúng nghĩa mà không mang bối cảnh nhạy cảm.
  'むく|': {
    file: 'Man peels an apple with a knife while sitting at a table with a typewriter and a cup of coffee in a vintage setting.jpg',
    author: 'Shixart1985',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '滑る|すべる': {
    file: 'Skier and snowboarder come down Aiguille slope, Saint-Sorlin-d\'Arves, 2023.jpg',
    author: 'DimiTalen',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '積もる|つもる': {
    file: 'Ventilation cap on roof in snow.jpg',
    author: 'W.carter',
    license: 'Public domain',
  },
  '積む|つむ': {
    file: 'EFTA00002252 - Cluttered storage room filled with stacked cardboard boxes tools and equipment.jpg',
    author: 'Federal Bureau of Investigation',
    license: 'Public domain',
  },
  '空く|あく': {
    file: 'More Good News, flat tire.jpg',
    author: 'Michael Scialdone',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '空ける|あける': {
    file: 'Hole drilled into bottom block of wood.png',
    author: 'Rphillip3418',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '下がる|さがる': {
    file: 'Two cuts of cheese marked down 50 percent.jpg',
    author: 'Retired electrician',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '下げる|さげる': {
    file: 'Canadian flag at half mast following death of pope francis Bolton Ontario.jpg',
    author: 'A Streetcar Named Keanu',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '冷える|ひえる': {
    file: 'Cans of soda in a refrigerator (14496480669).jpg',
    author: 'FutUndBeidl',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '冷やす|ひやす': {
    file: 'かまくら祭り 冷蔵庫 (16599929652).jpg',
    author: '極地狐',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '冷める|さめる': {
    file: 'A cup of cold brew coffee.jpg',
    author: 'Cartonfox',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '冷ます|さます': {
    file: 'Cookies (2).jpg',
    author: 'jeffreyw',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '燃える|もえる': {
    file: 'Fire inside an abandoned convent in Massueville, Quebec, Canada.jpg',
    author: 'Sylvain Pedneault',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '燃やす|もやす': {
    file: 'Midsummer bonfire closeup.jpg',
    author: 'Janne Karaste',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '沸く|わく': {
    file: 'Boiling water.jpg',
    author: 'GRAN',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  '沸かす|わかす': {
    file: 'Kettle boiling on gas stove (385314458).jpg',
    author: 'troykelly from Brisbane, Australia',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '鳴る|なる': {
    file: 'Old alarm clock on the bookshelf - 50233824038.jpg',
    author: 'Nenad Stojkovic',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '鳴らす|ならす': {
    file: 'Handbell Large01.jpg',
    author: 'Miya',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '役立つ|やくだつ': {
    file: 'Swiss army knife open 20050612 (cropped).jpg',
    author: 'Jonas Bergsten',
    license: 'Public domain',
  },
  '役立てる|やくだてる': {
    file: 'Upcycling Eierbecher 01.jpg',
    author: 'Geolina163',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '飾り|かざり': {
    file: 'Christmas tree decorations, Brisbane, 2020, 02.jpg',
    author: 'Chris Olszewski',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '遊び|あそび': {
    file: 'Boys playing street football in Egypt.jpg',
    author: 'Mohamed Hozyen Ahmed',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '集まり|あつまり': {
    file: 'Wikimania2021 Katsina (41).jpg',
    author: 'Wizkid49',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '教え|おしえ': {
    file: 'A college professor teaching in a university classroom full of students in Tennessee, United States 03.jpg',
    author: 'Harrison Keely',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '踊り|おどり': {
    file: 'Yokai Bon Odori 01.jpg',
    author: 'KQuhen',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '思い|おもい': {
    file: 'Going to the river to pray (Unsplash).jpg',
    author: 'Diana Simumpande iamdiana',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '考え|かんがえ': {
    file: 'I have an idea that..... just .... might.... work!.jpg',
    author: 'Marc Levin',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '手伝い|てつだい': {
    file: 'Helpen bij de afwas - Helping to do the dishes (4416872032).jpg',
    author: 'Nationaal Archief',
    license: 'No restrictions',
    licenseUrl: 'https://www.flickr.com/commons/usage/',
  },
  '働き|はたらき': {
    file: 'Garment Factory Worker Bengaldesh.jpg',
    author: 'Solidarity Center',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '決まり|きまり': {
    file: 'Sign of park rules at Rye Town Beach.jpg',
    author: 'GaoKyle',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '騒ぎ|さわぎ': {
    file: '220717 6353 spectators shouting at the bull.jpg',
    author: 'Lidia Mikhaylova',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '知らせ|しらせ': {
    file: 'Great Finborough Village Notice Board - geograph.org.uk - 4985509.jpg',
    author: 'Geographer',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '頼み|たのみ': {
    file: 'Asking for directions? (354906204).jpg',
    author: 'Sandra Cohen-Rose and Colin Rose from Montreal, Canada',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '疲れ|つかれ': {
    file: 'A tired worker.jpg',
    author: 'Khaoula1991',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '違い|ちがい': {
    file: 'Apple and Orange - they do not compare.jpg',
    author: 'Michael Johnson',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '始め|はじめ': {
    file: 'Team Yokota welcomes runners for 45th Annual Frostbite Road Race (9485756).jpg',
    author: 'U.S. Air Force photo by Senior Airman Samantha White',
    license: 'Public domain',
  },
  '続き|つづき': {
    file: 'ROC-NCL-AAC Fate-stay-night CHT tankobon 20171018.jpg',
    author: 'Solomon203',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '暮れ|くれ': {
    file: 'アメ横女学園 あまちゃん ロケ地です アメ横センタービル (15932588539).jpg',
    author: 'Dick Thomas Johnson',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '行き|いき': {
    file: '47 Airport departures board free photo - Melbourne Airport timetable - Creative Commons Attribution.jpg',
    author: 'Marek Ślusarczyk (Tupungato) Photo portfolio',
    license: 'CC BY 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
  },
  '帰り|かえり': {
    file: 'Shibuya Toyoko Line.jpg',
    author: 'Joi Ito',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '遅れ|おくれ': {
    file: 'Tokyu Information board 002.JPG',
    author: 'Tennen-Gas',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
  },
  '貸し|かし': {
    file: 'Oakland Tool Lending Library 2.jpg',
    author: 'Mx. Granger',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '借り|かり': {
    file: 'Rental bikes by Bore hostel ship, Turku, Finland.jpg',
    author: 'Kotivalo',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '勝ち|かち': {
    file: 'Germany players celebrate winning the 2014 FIFA World Cup.jpg',
    author: 'Agência Brasil',
    license: 'CC BY 3.0 br',
    licenseUrl: 'https://creativecommons.org/licenses/by/3.0/br/deed.en',
  },
  '負け|まけ': {
    file: '2026 Ball Hockey World Championship medal ceremony - Czech players dejected after the final 30.jpg',
    author: 'Tadeáš Bednarz',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '始まり|はじまり': {
    file: '2012 Olympics opening ceremony fireworks 1.jpg',
    author: 'Nick J Webb',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '終わり|おわり': {
    file: 'BOSTON MARATHON FINISH LINE (19640796408).jpg',
    author: 'Bill Morrow from Tucson, AZ, US',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  // Từ vựng N3 · 名詞 — Bài 6 (251–300). Chưa có ảnh: 苦しい, 悔しい, 満足な, 不満な, 変な, ましな.
  '戻り|もどり': {
    file: 'Starbucks sign with U-turn sign.jpg',
    author: 'Candeadly',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '別れ|わかれ': {
    file: 'At London\'s King\'s Cross station in London a serviceman kisses his wife goodbye as he heads for his unit in Scotland in 1944. D18767.jpg',
    author: 'Ministry of Information Photo Division Photographer',
    license: 'Public domain',
  },
  '喜び|よろこび': {
    file: 'PURE JOY.jpg',
    author: 'Suiem',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '楽しみ|たのしみ': {
    file: 'Two children run excitedly in a lush garden, each holding bubble wands.jpg',
    author: 'Shixart1985',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '笑い|わらい': {
    file: 'Laughing boy at golden hour.jpg',
    author: 'Basile Morin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '驚き|おどろき': {
    file: 'Baby surprised face.jpg',
    author: 'Raheelsiddiqui1991',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '怒り|いかり': {
    file: 'Angry woman.jpg',
    author: 'Lara604',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '悲しみ|かなしみ': {
    file: 'Statue of a grieving woman in the Museum of Sepulkralkultur 01.jpg',
    author: 'Kritzolina',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '幸せな|しあわせな': {
    file: 'Happy family (1).jpg',
    author: 'Catherine Scott',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '得意な|とくいな': {
    file: 'A young pianist performing a recital.png',
    author: 'PianoTiger106',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '苦手な|にがてな': {
    file: 'Laptop and girl biting pencil-pixabay.jpg',
    author: 'Jan Vašek',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '熱心な|ねっしんな': {
    file: 'African student studying at dormitory from tablet computer,.jpg',
    author: 'Tinsae Belay',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '夢中な|むちゅうな': {
    file: 'Child using an iPad 01.jpg',
    author: 'Judgefloro',
    license: 'Public domain',
  },
  '退屈な|たいくつな': {
    file: 'Boredom man.jpg',
    author: 'attribution not required',
    license: 'CC0',
    licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
  },
  '健康な|けんこうな': {
    file: 'UAE Healthy Kidney 10K 2007.jpg',
    author: 'Peter Dutton from Forest Hills, Queens, USA',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '平気な|へいきな': {
    file: 'DSC 6334 Man wearing sunglasses on his head smiles while working on a laptop at a beachside chair.jpg',
    author: 'PattayaPatrol',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'うらやましい|': {
    file: 'Jealousy by Edvard Munch - Städel - Frankfurt am Main - Germany 2017.jpg',
    author: 'Edvard Munch',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'かゆい|': {
    file: 'Itch.jpg',
    author: 'Orrling and Tomer S',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  'おとなしい|': {
    file: 'Two children engaged in creative drawing and reading at a sunlit table.jpg',
    author: 'Shixart1985',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '我慢強い|がまんづよい': {
    file: 'Volunteers queue for the Humber ferry 28 May 1961 (archive ref CD-103) (8) (26226348523).jpg',
    author: 'East Riding Archives',
    license: 'No restrictions',
    licenseUrl: 'https://www.flickr.com/commons/usage/',
  },
  '正直な|しょうじきな': {
    file: 'Springs, NY NRHP collection 34.jpg',
    author: 'CaptJayRuffins',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'けちな|': {
    file: 'Maria Fyodorovna-Miser.jpg',
    author: 'Maria Feodorova',
    license: 'Public domain',
  },
  '我儘な|わがままな': {
    file: 'Kasketaldi haurra 001.jpg',
    author: 'Chirag Rathod',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
  },
  '積極的な|せっきょくてきな': {
    file: '1964 Hammond Slides Student Raising Hand.jpg',
    author: 'Thomas Taylor Hammond (1920-1993)',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '消極的な|しょうきょくてきな': {
    file: 'Shy Boy (Imagicity 100).jpg',
    author: 'Graham Crumb',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  '不安な|ふあんな': {
    file: 'Edvard Munch - Anxiety - Google Art Project.jpg',
    author: 'Edvard Munch',
    license: 'Public domain',
  },
  '大変な|たいへんな': {
    file: 'Men Laden With Tea, Sichuan Sheng, China 1908 Ernest H. Wilson RESTORED.jpg',
    author: 'ralph repo',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '無理な|むりな': {
    file: 'Bicycle freight.jpg',
    author: 'Dotun55',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '不注意な|ふちゅういな': {
    file: '"YOU ARE AN IMPORTANT COG, WATCH WHILE WALKING" - NARA - 516199.jpg',
    author: 'Unknown authorUnknown author or not provided',
    license: 'Public domain',
  },
  '楽な|らくな': {
    file: 'Relaxing at False Cape State Park (21401642982).jpg',
    author: 'Virginia State Parks',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '面倒な|めんどうな': {
    file: 'Legal Contract & Signature - Warm Tones.jpg',
    author: 'Blogtrepreneur',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '失礼な|しつれいな': {
    file: 'Albert Einstein sticks his tongue.jpg',
    author: 'International News Service',
    license: 'Public domain',
  },
  '当然な|とうぜんな': {
    file: 'North Point Sunrise 20090201 0622.jpg',
    author: 'Dori',
    license: 'CC BY-SA 3.0 us',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/us/deed.en',
  },
  '意外な|いがいな': {
    file: 'Surprise Box.png',
    author: 'Noa Paz',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '結構な|けっこうな': {
    file: 'Senior thumbs up.jpg',
    author: 'Cameron Butler',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '派手な|はでな': {
    file: 'USMC-090530-M-0855M-034.jpg',
    author: 'Cpl. Joseph Marianelli',
    license: 'Public domain',
  },
  '地味な|じみな': {
    file: 'Mennonite Family - Campeche - Mexico - 02.jpg',
    author: 'Adam Jones, Ph.D.',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
  },
  'おしゃれな|': {
    file: 'Street fashion 2019 .jpg',
    author: 'Ines 2019',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '不思議な|ふしぎな': {
    file: 'Mysterious path into the forest.jpg',
    author: 'Antonychengpix',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  'むだな|': {
    file: 'Food waste in a blue waste container.jpg',
    author: 'Nick Saltmarsh',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
  },
  '自由な|じゆうな': {
    file: 'Freedom of Birds.jpg',
    author: 'Atlantisboii',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
  },
  '不自由な|ふじゆうな': {
    file: 'UNAwheel Mini Basic wheelchair power add-on 01.jpg',
    author: 'Nick Yudin',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  },
  '温まる|あたたまる': {
    file: 'BookOfNurseryRhymes6.jpg',
    author: 'Clara E. Atwood',
    license: 'Public domain',
  },
  '温める|あたためる': {
    file: 'Microwave oven flashon.jpg',
    author: 'Wrightmt',
    license: 'Public domain',
  },
};

export function vocabImageKey(word: Pick<VocabularyWord, 'japanese' | 'reading'>): string {
  return `${word.japanese.trim()}|${word.reading.trim()}`;
}

/**
 * Tên file bản thu nhỏ: mã băm của tên file trên Commons (như file phát âm, xem
 * `audioIdOf`) — tên trên Commons có dấu cách, ngoặc, chữ Nhật, không hợp làm tên file.
 * Ảnh .png giữ .png, mọi ảnh khác là .jpg (bản thu nhỏ của Commons cùng định dạng ảnh gốc).
 */
export function vocabImageFileName(file: string): string {
  return `${audioIdOf(file)}${/\.png$/i.test(file) ? '.png' : '.jpg'}`;
}

/**
 * Bản offline (`npm run build:offline`) là MỘT file HTML mở bằng file:// — không có thư
 * mục ảnh đi kèm. Tắt ảnh ở đó thay vì vẽ ra một loạt ảnh hỏng, như phát âm.
 */
const IMAGES_AVAILABLE = typeof location === 'undefined' || location.protocol !== 'file:';

/** Ảnh của một từ, hoặc null nếu từ chưa có ảnh. */
export function vocabImageOf(word: Pick<VocabularyWord, 'japanese' | 'reading'>): VocabImage | null {
  if (!IMAGES_AVAILABLE) return null;
  const source = VOCAB_IMAGES[vocabImageKey(word)];
  if (!source) return null;
  return {
    src: `${VOCAB_IMAGE_PATH}${vocabImageFileName(source.file)}`,
    author: source.author,
    license: source.license,
    licenseUrl: source.licenseUrl ?? null,
    page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(source.file.replace(/ /g, '_'))}`,
  };
}
