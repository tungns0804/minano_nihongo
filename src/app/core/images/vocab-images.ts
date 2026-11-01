import { audioIdOf } from '../audio/vocab-audio';
import type { VocabularyWord } from '../lessons/vocabulary.model';

/**
 * Ảnh minh họa của từ vựng — bảng gán từ → ảnh Wikimedia Commons, NGUỒN SỰ THẬT DUY NHẤT.
 *
 * Ảnh là ảnh thật trên Wikimedia Commons (https://commons.wikimedia.org): chỉ nhận ảnh có
 * giấy phép tự do (CC0, phạm vi công cộng, CC BY, CC BY-SA), lấy qua API công khai của
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
