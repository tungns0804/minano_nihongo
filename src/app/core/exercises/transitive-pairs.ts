/**
 * Dữ liệu bài tập 1 — cặp TỰ ĐỘNG TỪ (自動詞) và THA ĐỘNG TỪ (他動詞), N5 → N3.
 *
 * Cả hai vế đều ghi ở thể ます cho khớp với phần còn lại của ứng dụng, kèm cách
 * đọc toàn kana để người học gõ đáp án bằng kana cũng được tính đúng.
 *
 * Nghĩa tiếng Việt ghi RIÊNG cho từng vế chứ không dùng chung một nghĩa: cả cặp
 * cùng nói về một sự việc nhưng khác hẳn nhau ở chỗ ai làm — "cửa mở ra" và "mở
 * cửa" — mà đó chính là thứ bài tập này dạy.
 *
 * `npm run verify:conjugation` nạp file này để kiểm tra: mọi động từ phải chia
 * được theo nhóm đã khai, và cách đọc phải là kana thuần kết thúc bằng ます.
 */

import type { VerbGroup } from '../japanese/conjugation';
import type { ExerciseLevel, PairedVerb, TransitivityPair } from './exercise.model';

/** [thể ます, cách đọc kana, nhóm, nghĩa tiếng Việt] */
type VerbTuple = [string, string, VerbGroup, string];

function verb([masu, reading, group, meaning]: VerbTuple): PairedVerb {
  return { masu, reading, group, meaning };
}

function pair(
  level: ExerciseLevel,
  intransitive: VerbTuple,
  transitive: VerbTuple,
): TransitivityPair {
  return {
    // Vế tự động từ là duy nhất trong cả bảng nên dùng luôn làm id — không cặp nào
    // trùng, mà lại đọc được khi soi danh sách ★ trong localStorage.
    id: intransitive[0],
    level,
    intransitive: verb(intransitive),
    transitive: verb(transitive),
  };
}

export const TRANSITIVITY_PAIRS: readonly TransitivityPair[] = [
  // ── N5 ────────────────────────────────────────────────────────────────
  pair(
    'N5',
    ['開きます', 'あきます', 1, '(cửa, cửa sổ) mở ra'],
    ['開けます', 'あけます', 2, 'mở (cửa, cửa sổ)'],
  ),
  pair(
    'N5',
    ['閉まります', 'しまります', 1, '(cửa) đóng lại'],
    ['閉めます', 'しめます', 2, 'đóng (cửa)'],
  ),
  pair(
    'N5',
    ['つきます', 'つきます', 1, '(đèn, máy) bật sáng/ chạy lên'],
    ['つけます', 'つけます', 2, 'bật (đèn, máy)'],
  ),
  pair(
    'N5',
    ['消えます', 'きえます', 2, '(đèn, lửa) tắt/ biến mất'],
    ['消します', 'けします', 1, 'tắt (đèn)/ xoá đi'],
  ),
  pair(
    'N5',
    ['入ります', 'はいります', 1, 'vào/ đi vào'],
    ['入れます', 'いれます', 2, 'cho vào/ bỏ vào'],
  ),
  pair(
    'N5',
    ['出ます', 'でます', 2, 'ra/ đi ra/ xuất hiện'],
    ['出します', 'だします', 1, 'lấy ra/ gửi/ nộp'],
  ),
  pair(
    'N5',
    ['始まります', 'はじまります', 1, 'bắt đầu (tự nó)'],
    ['始めます', 'はじめます', 2, 'bắt đầu (làm việc gì)'],
  ),
  pair(
    'N5',
    ['終わります', 'おわります', 1, 'kết thúc/ xong'],
    ['終えます', 'おえます', 2, 'làm xong/ kết thúc (việc gì)'],
  ),
  pair(
    'N5',
    ['並びます', 'ならびます', 1, 'xếp hàng/ nằm thành hàng'],
    ['並べます', 'ならべます', 2, 'xếp/ bày ra'],
  ),

  // ── N4 ────────────────────────────────────────────────────────────────
  pair(
    'N4',
    ['止まります', 'とまります', 1, 'dừng lại/ ngừng chạy'],
    ['止めます', 'とめます', 2, 'dừng/ đỗ (xe)/ tắt'],
  ),
  pair(
    'N4',
    ['集まります', 'あつまります', 1, 'tụ tập/ tập trung lại'],
    ['集めます', 'あつめます', 2, 'thu thập/ tập hợp'],
  ),
  pair(
    'N4',
    ['決まります', 'きまります', 1, 'được quyết định'],
    ['決めます', 'きめます', 2, 'quyết định'],
  ),
  pair(
    'N4',
    ['見つかります', 'みつかります', 1, 'được tìm thấy'],
    ['見つけます', 'みつけます', 2, 'tìm ra/ phát hiện'],
  ),
  pair(
    'N4',
    ['落ちます', 'おちます', 2, 'rơi/ rớt'],
    ['落とします', 'おとします', 1, 'làm rơi/ đánh rơi'],
  ),
  pair(
    'N4',
    ['起きます', 'おきます', 2, 'thức dậy/ xảy ra'],
    ['起こします', 'おこします', 1, 'đánh thức/ gây ra'],
  ),
  pair(
    'N4',
    ['立ちます', 'たちます', 1, 'đứng lên'],
    ['立てます', 'たてます', 2, 'dựng lên/ đặt đứng'],
  ),
  pair(
    'N4',
    ['建ちます', 'たちます', 1, '(nhà) được xây lên'],
    ['建てます', 'たてます', 2, 'xây (nhà)'],
  ),
  pair(
    'N4',
    ['割れます', 'われます', 2, 'vỡ/ nứt'],
    ['割ります', 'わります', 1, 'đập vỡ/ chia ra'],
  ),
  pair(
    'N4',
    ['折れます', 'おれます', 2, 'gãy'],
    ['折ります', 'おります', 1, 'bẻ gãy/ gấp lại'],
  ),
  pair(
    'N4',
    ['切れます', 'きれます', 2, 'đứt/ hết (hàng)'],
    ['切ります', 'きります', 1, 'cắt'],
  ),
  pair(
    'N4',
    ['汚れます', 'よごれます', 2, 'bẩn đi'],
    ['汚します', 'よごします', 1, 'làm bẩn'],
  ),
  pair(
    'N4',
    ['直ります', 'なおります', 1, 'được sửa xong'],
    ['直します', 'なおします', 1, 'sửa/ sửa lại'],
  ),
  pair(
    'N4',
    ['上がります', 'あがります', 1, 'tăng lên/ lên cao'],
    ['上げます', 'あげます', 2, 'nâng lên/ tăng (giá)'],
  ),
  pair(
    'N4',
    ['下がります', 'さがります', 1, 'giảm xuống/ hạ xuống'],
    ['下げます', 'さげます', 2, 'hạ xuống/ giảm'],
  ),
  pair(
    'N4',
    ['変わります', 'かわります', 1, 'thay đổi/ biến đổi'],
    ['変えます', 'かえます', 2, 'thay đổi (cái gì)'],
  ),
  pair(
    'N4',
    ['続きます', 'つづきます', 1, 'tiếp tục/ kéo dài'],
    ['続けます', 'つづけます', 2, 'tiếp tục (làm gì)'],
  ),
  pair(
    'N4',
    ['壊れます', 'こわれます', 2, 'hỏng/ vỡ'],
    ['壊します', 'こわします', 1, 'làm hỏng/ phá'],
  ),
  pair(
    'N4',
    ['掛かります', 'かかります', 1, 'được treo/ tốn (thời gian, tiền)'],
    ['掛けます', 'かけます', 2, 'treo lên/ gọi (điện thoại)'],
  ),
  pair(
    'N4',
    ['曲がります', 'まがります', 1, 'cong lại/ rẽ'],
    ['曲げます', 'まげます', 2, 'bẻ cong/ uốn'],
  ),

  // ── N3 ────────────────────────────────────────────────────────────────
  pair(
    'N3',
    ['治ります', 'なおります', 1, '(bệnh) khỏi'],
    ['治します', 'なおします', 1, 'chữa khỏi'],
  ),
  pair(
    'N3',
    ['増えます', 'ふえます', 2, 'tăng lên/ nhiều lên'],
    ['増やします', 'ふやします', 1, 'làm tăng/ tăng thêm'],
  ),
  pair(
    'N3',
    ['減ります', 'へります', 1, 'giảm/ ít đi'],
    ['減らします', 'へらします', 1, 'làm giảm/ cắt bớt'],
  ),
  pair(
    'N3',
    ['届きます', 'とどきます', 1, 'tới nơi/ được gửi tới'],
    ['届けます', 'とどけます', 2, 'giao tới/ đưa tới'],
  ),
  pair(
    'N3',
    ['残ります', 'のこります', 1, 'còn lại'],
    ['残します', 'のこします', 1, 'để lại/ chừa lại'],
  ),
  pair(
    'N3',
    ['戻ります', 'もどります', 1, 'quay lại/ trở về'],
    ['戻します', 'もどします', 1, 'trả về chỗ cũ'],
  ),
  pair(
    'N3',
    ['回ります', 'まわります', 1, 'quay/ xoay tròn'],
    ['回します', 'まわします', 1, 'xoay/ vặn'],
  ),
  pair(
    'N3',
    ['動きます', 'うごきます', 1, 'chuyển động/ hoạt động'],
    ['動かします', 'うごかします', 1, 'làm chuyển động/ di chuyển'],
  ),
  pair(
    'N3',
    ['沸きます', 'わきます', 1, '(nước) sôi'],
    ['沸かします', 'わかします', 1, 'đun sôi'],
  ),
  pair(
    'N3',
    ['乾きます', 'かわきます', 1, 'khô đi'],
    ['乾かします', 'かわかします', 1, 'làm khô/ hong khô'],
  ),
  pair(
    'N3',
    ['冷えます', 'ひえます', 2, 'lạnh đi/ nguội lạnh'],
    ['冷やします', 'ひやします', 1, 'làm lạnh/ ướp lạnh'],
  ),
  pair(
    'N3',
    ['冷めます', 'さめます', 2, 'nguội đi'],
    ['冷まします', 'さまします', 1, 'làm nguội'],
  ),
  pair(
    'N3',
    ['温まります', 'あたたまります', 1, 'ấm lên'],
    ['温めます', 'あたためます', 2, 'hâm nóng/ làm ấm'],
  ),
  pair(
    'N3',
    ['溶けます', 'とけます', 2, 'tan ra'],
    ['溶かします', 'とかします', 1, 'hoà tan/ làm tan'],
  ),
  pair(
    'N3',
    ['進みます', 'すすみます', 1, 'tiến lên/ tiến triển'],
    ['進めます', 'すすめます', 2, 'đẩy tới/ xúc tiến'],
  ),
  pair(
    'N3',
    ['育ちます', 'そだちます', 1, 'lớn lên/ trưởng thành'],
    ['育てます', 'そだてます', 2, 'nuôi dạy/ nuôi trồng'],
  ),
  pair(
    'N3',
    ['助かります', 'たすかります', 1, 'được cứu/ đỡ vất vả'],
    ['助けます', 'たすけます', 2, 'cứu/ giúp đỡ'],
  ),
  pair(
    'N3',
    ['倒れます', 'たおれます', 2, 'đổ/ ngã'],
    ['倒します', 'たおします', 1, 'làm đổ/ đánh đổ'],
  ),
  pair(
    'N3',
    ['焼けます', 'やけます', 2, 'cháy/ chín (đồ nướng)'],
    ['焼きます', 'やきます', 1, 'nướng/ đốt'],
  ),
  pair(
    'N3',
    ['燃えます', 'もえます', 2, 'cháy'],
    ['燃やします', 'もやします', 1, 'đốt'],
  ),
  pair(
    'N3',
    ['抜けます', 'ぬけます', 2, 'tuột ra/ rụng'],
    ['抜きます', 'ぬきます', 1, 'rút ra/ nhổ'],
  ),
  pair(
    'N3',
    ['破れます', 'やぶれます', 2, 'rách'],
    ['破ります', 'やぶります', 1, 'xé rách/ phá (lời hứa)'],
  ),
  pair(
    'N3',
    ['濡れます', 'ぬれます', 2, 'bị ướt'],
    ['濡らします', 'ぬらします', 1, 'làm ướt'],
  ),
  pair(
    'N3',
    ['過ぎます', 'すぎます', 2, '(thời gian) trôi qua'],
    ['過ごします', 'すごします', 1, 'trải qua/ sống qua'],
  ),
  pair(
    'N3',
    ['生まれます', 'うまれます', 2, 'được sinh ra'],
    ['生みます', 'うみます', 1, 'sinh ra/ đẻ ra'],
  ),
  pair(
    'N3',
    ['移ります', 'うつります', 1, 'chuyển sang/ dời đi'],
    ['移します', 'うつします', 1, 'chuyển/ dời (cái gì)'],
  ),
  pair(
    'N3',
    ['重なります', 'かさなります', 1, 'chồng lên nhau/ trùng nhau'],
    ['重ねます', 'かさねます', 2, 'xếp chồng lên'],
  ),
  pair(
    'N3',
    ['混ざります', 'まざります', 1, 'bị trộn lẫn'],
    ['混ぜます', 'まぜます', 2, 'trộn/ khuấy'],
  ),
  pair(
    'N3',
    ['逃げます', 'にげます', 2, 'chạy trốn/ bỏ chạy'],
    ['逃がします', 'にがします', 1, 'thả ra/ để sổng'],
  ),
];
