#!/usr/bin/env node
/**
 * Kiểm tra việc tô từ đang học trong câu ví dụ (src/app/core/japanese/example-highlight.ts).
 *
 * Vì sao cần script riêng: hàm đó đoán gốc của từ rồi đi qua đuôi chia, và nó
 * hỏng LẶNG LẼ theo hai cách mà nhìn bảng không ai để ý — tô hụt (câu hiện trơn,
 * trông như chưa từng có tính năng này) hoặc tô tràn (渇いたので sáng cả ので).
 * Phần đầu chốt từng ca khó đã gặp; phần sau đòi mọi câu ví dụ của bài N3 và của
 * bảng từ 直前対策 N4 đều tô được, để dữ liệu mới thêm vào mà có câu không tô được
 * thì biết ngay. Cùng một hàm tô ở bảng từ, ở phần ôn lại sau mỗi câu luyện từ vựng
 * và ở trang nạp bài, nên soát hàm là soát cả ba chỗ.
 *
 * Chạy: npm run verify:example-highlight
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c, log, toFileUrl } from './script-utils.mjs';
import { parseVocabulary } from './vocab-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const DATA_DIR = join(ROOT, 'data-source');

const CORE = join(ROOT, 'src', 'app', 'core');
const { exampleParts } = await import(toFileUrl(join(CORE, 'japanese', 'example-highlight.ts')));
const { plainText, kanaText } = await import(toFileUrl(join(CORE, 'translation', 'markup.ts')));
const { FUROKU_TOPICS } = await import(toFileUrl(join(CORE, 'exercises', 'taisaku-n4.data.ts')));

let failures = 0;
const fail = (msg) => {
  failures++;
  log(`  ${c.red}✗${c.reset} ${msg}`);
};

/** [câu, từ, cách đọc, phần phải được tô (null = không được tô gì)]. */
const CASES = [
  // Nguyên văn, và ưu tiên chỗ không dính vào chữ Hán khác.
  ['ここに判を押してください。', '判', 'はん', '判'],
  ['順番に並んで、次は私の番です。', '番', 'ばん', '番'],
  // Động từ nhóm 1 qua âm biến, bị động, điều kiện — và dừng đúng trước ので/みて/います.
  ['のどが渇いたので、水を飲みました。', '渇く', 'かわく', '渇いた'],
  ['花のにおいを嗅いでみてください。', '嗅ぐ', 'かぐ', '嗅いで'],
  ['誰かがドアを叩いています。', '叩く', 'たたく', '叩いて'],
  ['けんかをして、友達に殴られました。', '殴る', 'なぐる', '殴られました'],
  ['名前を呼ばれたら、中に入ってください。', '呼ぶ', 'よぶ', '呼ばれたら'],
  ['旅行の間、隣の人が犬を預かってくれました。', '預かる', 'あずかる', '預かって'],
  ['午後から曇るかもしれません。', '曇ります', 'くもります', '曇る'],
  // Nhóm 2, và đuôi る không được nhầm sang nhóm 1.
  ['台風で木が倒れました。', '倒れる', 'たおれる', '倒れました'],
  ['母に似ていると言われます。', '似ています', 'にています', '似ている'],
  // 冷ます là dạng từ điển đuôi す, không phải dạng ます của "冷".
  ['熱いスープを少し冷ましてから飲みます。', '冷ます', 'さます', '冷まして'],
  // Gốc một chữ kana: phải có đuôi chia, và không được khớp vào ふきん.
  ['子どもたちがボールをけって遊んでいます。', 'ける', '', 'けって'],
  ['洗った食器をふきんでふいて、棚に戻します。', 'ふきんで食器をふく', 'ふきんでしょっきをふく', 'ふいて'],
  // Tính từ い / な.
  ['コーヒーが濃すぎます。', '濃い', 'こい', '濃すぎます'],
  ['この猫は人なつっこくて、誰にでも近寄ってきます。', '人なつっこい', 'ひとなつっこい', '人なつっこくて'],
  ['私は料理が得意です。', '得意な', 'とくいな', '得意'],
  ['この仕事は楽ですが、給料が安いです。', '楽な', 'らくな', '楽'],
  // する, kể cả bị động và khả năng.
  ['新しい星が発見されました。', '発見します', 'はっけんします', '発見されました'],
  ['この図書館は誰でも利用できます。', '利用します', 'りようします', '利用できます'],
  // Cụm từ: phần trong ngoặc, và lùi về động từ khi câu chen chữ vào giữa cụm.
  ['カップラーメンを作るので、お湯を沸かしてください。', '（お）湯を沸かす', 'ゆをわかす', 'お湯を沸かして'],
  ['野菜などの材料を細かく刻みます。', '材料を刻む', 'ざいりょうをきざむ', '刻みます'],
  ['トヨタ会社で働いています。', '～会社', '～かいしゃ', '会社'],
  // Không tìm ra thì để nguyên câu.
  ['どうぞ、椅子にお掛けください。', '椅子に掛けます', 'いすにかけます', null],
  ['今日はいい天気ですね。', '雨', 'あめ', null],
];

log(`${c.bold}Tô từ trong câu ví dụ${c.reset}`);
for (const [sentence, word, reading, expected] of CASES) {
  const parts = exampleParts(sentence, word, reading);
  const got = parts ? parts[1] : null;
  if (got !== expected) {
    fail(`${word}: mong ${expected ?? '(không tô)'}, ra ${got ?? '(không tô)'} — ${sentence}`);
  } else if (parts && parts.join('') !== sentence) {
    fail(`${word}: ba phần ghép lại không ra câu gốc — ${sentence}`);
  }
}
log(`  ${CASES.length} ca mẫu`);

let n3Total = 0;
let otherTotal = 0;
let otherMissed = 0;
for (const dir of readdirSync(DATA_DIR).sort()) {
  const vocabPath = join(DATA_DIR, dir, 'vocabulary.txt');
  const metaPath = join(DATA_DIR, dir, 'meta.json');
  if (!existsSync(vocabPath) || !existsSync(metaPath)) continue;
  const level = JSON.parse(readFileSync(metaPath, 'utf8')).level;
  for (const word of parseVocabulary(readFileSync(vocabPath, 'utf8')).words) {
    if (!word.example) continue;
    const parts = exampleParts(word.example, word.japanese, word.reading);
    if (level === 'N3') {
      n3Total++;
      if (!parts) fail(`${dir}: không tô được ${word.japanese} trong「${word.example}」`);
    } else {
      otherTotal++;
      if (!parts) otherMissed++;
    }
  }
}
log(`  N3: ${n3Total} câu ví dụ, đòi tô được hết`);

// Bảng từ 付録 của 直前対策 N4: từ và câu viết theo cú pháp furigana ({首|くび}), câu có
// khoảng trắng giữa các cụm như sách. app-ruby tìm trên chữ hiển thị — đúng như dưới đây.
let taisakuTotal = 0;
for (const topic of FUROKU_TOPICS) {
  for (const [word, , example] of topic.words ?? []) {
    if (!example) continue;
    taisakuTotal++;
    const sentence = plainText(example).replace(/[〈〉]/g, '');
    if (!exampleParts(sentence, plainText(word), kanaText(word))) {
      fail(`直前対策 付録 ${topic.no}: không tô được ${plainText(word)} trong「${sentence}」`);
    }
  }
}
log(`  直前対策 N4: ${taisakuTotal} câu ví dụ, đòi tô được hết`);
log(`  ${c.dim}N4/N5: ${otherTotal - otherMissed}/${otherTotal} câu tô được (không bắt buộc)${c.reset}`);

if (failures > 0) {
  log(`${c.red}${failures} lỗi${c.reset}`);
  process.exit(1);
}
log(`${c.green}OK${c.reset}`);
