/**
 * Bảng chữ của bài giảng Kanji (thầy Công Minh Nguyễn, tài liệu "Minnnchann") — người dùng
 * chụp gửi ngày 2026-11-10, tám ảnh. Mở ở tab Kanji › Âm On/Kun (`features/kanji-onkun`).
 *
 * Mỗi bảng chép NGUYÊN thứ tự trên ảnh, hàng nối hàng (mười chữ một hàng). Hàng chỉ còn mép
 * dưới ở đầu ảnh (vài ảnh chụp cắt ngang hàng trên cùng) thì bỏ — không đoán chữ nào nằm ở
 * đó; người dùng nói cả bộ là 320 chữ, ở đây đọc được 300. `marked` là các chữ thầy
 * tô vàng trên bảng lúc chụp (ảnh chụp ở các buổi khác nhau, nên "tô vàng" là "đã giảng tới
 * lúc đó" chứ không phải một danh sách học xong cố định).
 *
 * Âm On / Kun và âm Hán Việt KHÔNG khai ở đây: âm lấy từ bảng thường dụng
 * (`joyo-readings.data.ts`), Hán Việt từ khu Kanji. File này chỉ giữ thứ bảng gốc không có:
 * chữ nào trên bảng nào, và từ ví dụ.
 *
 * Từ ví dụ viết tay nằm riêng ở `kanji-board-examples.data.ts`: trang Luyện tập › Bài tập chỉ
 * cần số chữ để ghi lên thẻ, không cần kéo theo cả bảng ví dụ.
 *
 * `npm run verify:kanji-readings` soát: chữ có ở khu Kanji, không trùng giữa các bảng,
 * `marked` nằm trong bảng, mỗi từ ví dụ chứa chữ của nó và căn được âm.
 */

/**
 * Id "bài tập" của trang này: id phiên luyện (kết quả quay về `/kanji/am-on-kun` nhờ
 * `EXERCISE_PAGE` ở `core/paths.ts`) và gốc của khoá ★ "chữ chưa nhớ âm". KHÔNG đổi.
 */
export const KANJI_BOARD_ID = 'am-on-kun';

export interface RawKanjiBoard {
  /** Số bảng — tên "Bảng 1" và khoá nhớ bảng đang chọn. Bảng thêm sau lấy số kế tiếp. */
  board: number;
  /** Chữ theo đúng thứ tự trên bảng. */
  chars: string;
  /** Chữ thầy tô vàng. */
  marked: string;
}

export const KANJI_BOARDS: readonly RawKanjiBoard[] = [
  {
    board: 1,
    chars: '駐無満向禁関係断横押式信号確認飛非常階段箱危険捨線面普各次快速過鉄指定席由番窓側路停整券現両替優座降',
    marked: '駐無満向禁関係断横押式信号確認飛非常階段',
  },
  {
    board: 2,
    chars: '未末若晩島皿血助準備営閉案内予約煙当全客様解協願観園港遊美術神寺役郵局交差点橋公受付科鼻婦形骨折困消',
    marked: '未末若晩島皿血助準備営閉案内予約煙当',
  },
  {
    board: 3,
    chars: '防救警察故伝黄絵組束授渡昔要冷蔵凍庫保存',
    marked: '防救警察故伝黄絵組束授渡昔',
  },
  {
    board: 4,
    chars: '召必費期限製造賞法温販機増減量氷返湯材卵乳粉袋混焼表裏留守濃薄部数件再接続示戻完',
    marked: '召必費期限製造賞法温販機増減量氷返湯材卵乳粉袋混焼表裏留守',
  },
  {
    board: 5,
    chars: '了登録育種類師妻馬石砂塩油緑紅冊個枚告利割倍値商支払米級残型税込価格申記例齢歳性',
    marked: '了登録育種類師妻馬石',
  },
  {
    board: 6,
    chars: '念涙笑調査移難簡単感',
    marked: '念',
  },
  {
    board: 7,
    chars: '想練最適選違直復辞宿昨君結婚祝曲奥寝痛熱虫歯治汚並他身酒吸欲眠疲息呼報晴雲吹暖雪',
    marked: '想練',
  },
  {
    board: 8,
    chars: '震波求募職容技般務課球決勝対流負投果戦経済成貿易輸相化比原因際議活変政府改否的実欠専亡忙忘祭労加情反',
    marked: '震波求募職容技般務課球',
  },
];

/** Số chữ trên mọi bảng — số ghi trên thẻ bài tập. */
export const KANJI_BOARD_CHAR_COUNT = KANJI_BOARDS.reduce((sum, board) => sum + [...board.chars].length, 0);
