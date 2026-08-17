/**
 * Chia động từ tiếng Nhật từ thể ます sang các thể còn lại.
 *
 * Đầu vào là thể ます + nhóm động từ do người soạn dữ liệu khai báo. Nhóm KHÔNG
 * suy ra được từ hình dạng: 帰ります (nhóm 1) và 食べます (nhóm 2) cùng kết thúc
 * bằng ～えます, 切ります (nhóm 1) và 見ます (nhóm 2) cùng có gốc kết thúc âm hàng い.
 * Đó chính là nhóm "động từ đặc biệt" hay bị nhầm.
 *
 * Đây là bản cài đặt DUY NHẤT của luật chia; dữ liệu JSON chỉ lưu thể ます + nhóm,
 * các thể khác tính lúc chạy. Không có bản sao nào ở script nên không sợ lệch nhau.
 * Script `npm run verify:conjugation` nạp thẳng file này để kiểm tra dữ liệu.
 */

import type { MessageKey } from '../i18n/messages';

export type VerbGroup = 1 | 2 | 3;

/** Các thể được hỗ trợ. */
export type VerbForm = 'masu' | 'dictionary' | 'te' | 'ta' | 'nai';

export const VERB_FORMS: readonly VerbForm[] = ['masu', 'dictionary', 'te', 'ta', 'nai'];

/**
 * Nhãn là KHOÁ thông điệp chứ không phải chữ sẵn, vì giao diện có hai ngôn ngữ.
 * Chữ thật nằm ở `core/i18n/messages.ts`.
 */
export const VERB_FORM_LABEL_KEY: Record<VerbForm, MessageKey> = {
  masu: 'verbForm.masu',
  dictionary: 'verbForm.dictionary',
  te: 'verbForm.te',
  ta: 'verbForm.ta',
  nai: 'verbForm.nai',
};

/** Nhãn ngắn (ます, る, て…) dùng làm tiêu đề cột trong bảng chia. */
export const VERB_FORM_SHORT_KEY: Record<VerbForm, MessageKey> = {
  masu: 'verbForm.masu.short',
  dictionary: 'verbForm.dictionary.short',
  te: 'verbForm.te.short',
  ta: 'verbForm.ta.short',
  nai: 'verbForm.nai.short',
};

export const VERB_GROUP_LABEL_KEY: Record<VerbGroup, MessageKey> = {
  1: 'group.1',
  2: 'group.2',
  3: 'group.3',
};

export type VerbForms = Record<VerbForm, string>;

export type ConjugationResult =
  | { ok: true; forms: VerbForms }
  | { ok: false; reason: string };

const MASU = 'ます';

/** Âm hàng い -> âm hàng う, dùng cho thể từ điển của nhóm 1. */
const I_TO_U: Record<string, string> = {
  き: 'く',
  ぎ: 'ぐ',
  し: 'す',
  ち: 'つ',
  に: 'ぬ',
  び: 'ぶ',
  み: 'む',
  り: 'る',
  い: 'う',
};

/**
 * Âm hàng い -> âm hàng あ, dùng cho thể ない của nhóm 1.
 * Chú ý い -> わ chứ không phải あ: 買います -> 買わない.
 */
const I_TO_A: Record<string, string> = {
  き: 'か',
  ぎ: 'が',
  し: 'さ',
  ち: 'た',
  に: 'な',
  び: 'ば',
  み: 'ま',
  り: 'ら',
  い: 'わ',
};

/** Âm tiện (音便) cho thể て/た của nhóm 1, theo âm cuối của gốc ます. */
const I_TO_TE_TA: Record<string, readonly [string, string]> = {
  い: ['って', 'った'],
  ち: ['って', 'った'],
  り: ['って', 'った'],
  に: ['んで', 'んだ'],
  び: ['んで', 'んだ'],
  み: ['んで', 'んだ'],
  き: ['いて', 'いた'],
  ぎ: ['いで', 'いだ'],
  し: ['して', 'した'],
};

/**
 * Các động từ chia bất quy tắc, ghi đè lên kết quả tính theo luật.
 * Chỉ cần khai báo những thể thực sự khác luật.
 */
const IRREGULAR: Record<string, Partial<VerbForms>> = {
  // Nhóm 1 nhưng thể て/た không theo luật âm tiện của hàng き.
  行きます: { te: '行って', ta: '行った' },
  いきます: { te: 'いって', ta: 'いった' },

  // Thể phủ định của あります là ない, không phải あらない.
  あります: { nai: 'ない' },

  // Nhóm kính ngữ ～います nhưng thể từ điển là ～る.
  いらっしゃいます: {
    dictionary: 'いらっしゃる',
    te: 'いらっしゃって',
    ta: 'いらっしゃった',
    nai: 'いらっしゃらない',
  },
  くださいます: {
    dictionary: 'くださる',
    te: 'くださって',
    ta: 'くださった',
    nai: 'くださらない',
  },
  なさいます: { dictionary: 'なさる', te: 'なさって', ta: 'なさった', nai: 'なさらない' },
  おっしゃいます: {
    dictionary: 'おっしゃる',
    te: 'おっしゃって',
    ta: 'おっしゃった',
    nai: 'おっしゃらない',
  },
};

/** Động từ này có nằm trong bảng bất quy tắc không (dùng để hiện nhãn trên UI). */
export function isIrregularVerb(masu: string): boolean {
  return Object.prototype.hasOwnProperty.call(IRREGULAR, masu.trim());
}

/**
 * Chia một động từ ra đủ các thể.
 *
 * @param masu Thể ます, ví dụ "逃げます".
 * @param group Nhóm động từ do người soạn dữ liệu khai báo.
 */
export function conjugate(masu: string, group: VerbGroup): ConjugationResult {
  const source = masu.trim();

  if (!source.endsWith(MASU)) {
    return { ok: false, reason: 'Động từ phải ở thể ます (kết thúc bằng "ます")' };
  }

  const stem = source.slice(0, -MASU.length);
  if (!stem) {
    return { ok: false, reason: 'Thiếu phần gốc trước "ます"' };
  }

  const base = byGroup(source, stem, group);
  if (!base.ok) return base;

  const override = IRREGULAR[source];
  return { ok: true, forms: override ? { ...base.forms, ...override } : base.forms };
}

function byGroup(source: string, stem: string, group: VerbGroup): ConjugationResult {
  switch (group) {
    case 1:
      return conjugateGodan(stem, source);
    case 2:
      return {
        ok: true,
        forms: {
          masu: source,
          dictionary: `${stem}る`,
          te: `${stem}て`,
          ta: `${stem}た`,
          nai: `${stem}ない`,
        },
      };
    case 3:
      return conjugateIrregularGroup(stem, source);
    default:
      return { ok: false, reason: `Nhóm động từ không hợp lệ: ${group}` };
  }
}

/** Nhóm 1 (五段): biến âm cuối của gốc theo hàng tương ứng. */
function conjugateGodan(stem: string, source: string): ConjugationResult {
  const last = stem.slice(-1);
  const head = stem.slice(0, -1);

  const dictionaryEnding = I_TO_U[last];
  const naiEnding = I_TO_A[last];
  const teTa = I_TO_TE_TA[last];

  if (!dictionaryEnding || !naiEnding || !teTa) {
    return {
      ok: false,
      reason:
        `Gốc "${stem}" kết thúc bằng "${last}" — không phải âm hàng い nên không chia được ` +
        `theo nhóm 1. Kiểm tra lại nhóm của động từ này.`,
    };
  }

  return {
    ok: true,
    forms: {
      masu: source,
      dictionary: head + dictionaryEnding,
      te: head + teTa[0],
      ta: head + teTa[1],
      nai: `${head}${naiEnding}ない`,
    },
  };
}

/** Nhóm 3: します / 来ます và các động từ ghép ～します. */
function conjugateIrregularGroup(stem: string, source: string): ConjugationResult {
  // ～します: 勉強します, 結婚します, 注意します...
  if (stem.endsWith('し')) {
    const head = stem.slice(0, -1);
    return {
      ok: true,
      forms: {
        masu: source,
        dictionary: `${head}する`,
        te: `${head}して`,
        ta: `${head}した`,
        nai: `${head}しない`,
      },
    };
  }

  // 来ます (kanji): giữ nguyên chữ 来, chỉ đổi đuôi.
  if (stem.endsWith('来')) {
    const head = stem.slice(0, -1);
    return {
      ok: true,
      forms: {
        masu: source,
        dictionary: `${head}来る`,
        te: `${head}来て`,
        ta: `${head}来た`,
        nai: `${head}来ない`,
      },
    };
  }

  // きます (hiragana): đổi cả nguyên âm gốc — くる / きて / きた / こない.
  if (stem.endsWith('き')) {
    const head = stem.slice(0, -1);
    return {
      ok: true,
      forms: {
        masu: source,
        dictionary: `${head}くる`,
        te: `${head}きて`,
        ta: `${head}きた`,
        nai: `${head}こない`,
      },
    };
  }

  return {
    ok: false,
    reason: `Nhóm 3 chỉ nhận động từ dạng "～します" hoặc "～来ます/～きます", không nhận "${source}"`,
  };
}

/**
 * Chia thử theo một nhóm khác để tạo đáp án nhiễu cho câu trắc nghiệm.
 * Trả về null nếu nhóm đó không chia được — ví dụ 逃げます không chia nổi theo
 * nhóm 1 vì gốc "逃げ" không kết thúc bằng âm hàng い.
 *
 * Đây chính là lỗi hay gặp nhất của người học (chia nhầm nhóm), nên dùng làm đáp
 * án nhiễu sẽ sát thực tế hơn là lấy đại một động từ khác.
 */
export function conjugateAsGroup(masu: string, group: VerbGroup): VerbForms | null {
  const source = masu.trim();
  if (!source.endsWith(MASU)) return null;

  const stem = source.slice(0, -MASU.length);
  if (!stem) return null;

  const result = byGroup(source, stem, group);
  return result.ok ? result.forms : null;
}
