/**
 * Phân tích bài LUYỆN DỊCH (`translation.json`) cho script sinh dữ liệu.
 *
 * Bài luyện dịch là loại bài duy nhất PHỤ THUỘC vào bài khác: mỗi câu khai các mẫu
 * ngữ pháp nó dùng bằng (số bài, tên mẫu), và script tra từng mẫu trong bài ngữ pháp
 * tương ứng. Nhờ vậy mấy luật mà người soạn rất dễ lỡ tay làm sai được kiểm bằng máy
 * chứ không phải bằng mắt:
 *
 *  1. Mẫu phải CÓ THẬT trong bài ngữ pháp — gõ sai một chữ của tên mẫu là lỗi, kèm
 *     danh sách tên đúng để chép lại.
 *  2. Không dùng mẫu của BÀI SAU. Bài 12 mà khai mẫu bài 15 là câu đó đòi người học
 *     biết thứ họ chưa học.
 *  3. Mỗi câu phải dùng ít nhất HAI mẫu và ít nhất một mẫu của chính bài đó: câu
 *     luyện dịch là để kết hợp ngữ pháp, không phải để lặp lại câu ví dụ của bài.
 *  4. Hai câu trong cùng một bài không được TRÙNG TỔ HỢP mẫu. Đây là yêu cầu của
 *     người học: mỗi câu một cách kết hợp riêng, không câu nào chỉ là bản thay từ
 *     của câu khác.
 *  5. Cú pháp furigana / lựa chọn phải viết đúng (xem `core/translation/markup.ts`).
 *
 * Định dạng file (mọi trường không đánh dấu là bắt buộc):
 *
 *   {
 *     "sets": [{
 *       "title": "Ở quầy lễ tân",
 *       "description": "…",                         (tuỳ chọn)
 *       "lines": [{
 *         "speaker": "A",                            (tuỳ chọn — câu thuộc hội thoại)
 *         "ja": "{私|わたし}は {学生|がくせい}です。",
 *         "jaAlt": ["…"],                            (tuỳ chọn)
 *         "vi": "Tôi là [sinh viên/học sinh].",
 *         "viAlt": ["…"],                            (tuỳ chọn)
 *         "grammar": [
 *           { "lesson": 1, "point": "N1 は N2 です", "note": "giải thích trong câu này" }
 *         ]
 *       }]
 *     }]
 *   }
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveTsImports, toFileUrl } from './script-utils.mjs';
import { hashId, normalizeField } from './vocab-core.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
resolveTsImports();
const { markupProblems, plainText } = await import(
  toFileUrl(join(HERE, '..', 'src', 'app', 'core', 'translation', 'markup.ts'))
);

/** Số câu "khoảng 10" của một bài nhỏ; lệch khỏi khoảng này thì cảnh báo chứ không chặn. */
const SET_SIZE = { min: 8, max: 12 };

function stripBom(text) {
  return text.length > 0 && text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function toTextList(value) {
  const list = typeof value === 'string' ? [value] : toArray(value);
  return list.map((item) => normalizeField(item ?? '')).filter((item) => item.length > 0);
}

/**
 * @param {string} raw Nội dung translation.json
 * @param {{ lessonNumber: number|null, grammarIndex: Map<number, {lessonId: string, points: Map<string, {id: string, title: string, structure: string}>}> }} ctx
 * @returns {{ sets: Array, grammarRefs: Record<string, object>, issues: Array, stats: object }}
 */
export function parseTranslation(raw, ctx) {
  const issues = [];
  const sets = [];
  const grammarRefs = {};
  const stats = { lines: 0, mixed: 0, olderLessons: new Set() };

  const fail = (path, message) => {
    issues.push({ line: 0, path, text: '', level: 'error', code: 'translation-invalid', params: {}, message });
  };
  const warn = (path, message, code) => {
    issues.push({ line: 0, path, text: '', level: 'warning', code, params: {}, message });
  };

  const lessonNumber = ctx.lessonNumber;
  if (typeof lessonNumber !== 'number') {
    fail('(file)', 'Không biết đây là bài số mấy — đặt tên thư mục kiểu luyen-dich-minano-12 hoặc khai "lesson" trong meta.json');
    return { sets, grammarRefs, issues, stats };
  }

  let parsed;
  try {
    parsed = JSON.parse(stripBom(String(raw ?? '')));
  } catch (error) {
    fail('(file)', `Không phải JSON hợp lệ: ${error.message}`);
    return { sets, grammarRefs, issues, stats };
  }

  const rawSets = parsed && typeof parsed === 'object' ? parsed.sets : null;
  if (!Array.isArray(rawSets)) {
    fail('sets', 'Thiếu mảng "sets" ở cấp ngoài cùng');
    return { sets, grammarRefs, issues, stats };
  }

  const usedIds = new Set();
  const seenSentences = new Map();
  const seenSignatures = new Map();

  const checkMarkup = (path, value) => {
    for (const problem of markupProblems(value)) fail(path, `Cú pháp sai (${problem}): ${value}`);
  };

  rawSets.forEach((rawSet, setIndex) => {
    const setPath = `sets[${setIndex}]`;
    if (!rawSet || typeof rawSet !== 'object') {
      fail(setPath, 'Mỗi phần tử của "sets" phải là một object');
      return;
    }
    const title = normalizeField(rawSet.title ?? '');
    if (!title) fail(setPath, 'Thiếu "title" — tên bài nhỏ');

    const lines = [];
    toArray(rawSet.lines).forEach((rawLine, lineIndex) => {
      const path = `${setPath}.lines[${lineIndex}]`;
      if (!rawLine || typeof rawLine !== 'object') {
        fail(path, 'Mỗi câu phải là một object');
        return;
      }

      const ja = normalizeField(rawLine.ja ?? '');
      const vi = normalizeField(rawLine.vi ?? '');
      if (!ja || !vi) {
        fail(path, `Câu thiếu trường: ${[!ja && 'ja', !vi && 'vi'].filter(Boolean).join(', ')}`);
        return;
      }
      const jaAlt = toTextList(rawLine.jaAlt);
      const viAlt = toTextList(rawLine.viAlt);
      // Tên người nói cũng viết được furigana (佐藤 → {佐藤|さとう}).
      const speaker = normalizeField(rawLine.speaker ?? '');
      [ja, ...jaAlt, vi, ...viAlt, speaker].forEach((value) => checkMarkup(path, value));
      if (/[{}]/.test([vi, ...viAlt].join(''))) fail(path, 'Câu tiếng Việt không dùng furigana {…|…}');

      // ── Mẫu ngữ pháp ──
      const grammar = [];
      const lessonsUsed = new Set();
      toArray(rawLine.grammar).forEach((rawRef, refIndex) => {
        const refPath = `${path}.grammar[${refIndex}]`;
        const lesson = rawRef?.lesson;
        const title = normalizeField(rawRef?.point ?? '');
        const note = normalizeField(rawRef?.note ?? '');
        if (!Number.isInteger(lesson) || lesson < 1) {
          fail(refPath, '"lesson" phải là số bài (số nguyên ≥ 1)');
          return;
        }
        if (lesson > lessonNumber) {
          fail(refPath, `Câu của bài ${lessonNumber} dùng mẫu "${title}" của bài ${lesson} — người học chưa tới bài đó`);
          return;
        }
        const grammarLesson = ctx.grammarIndex.get(lesson);
        if (!grammarLesson) {
          fail(refPath, `Không có bài ngữ pháp số ${lesson} để tra mẫu "${title}"`);
          return;
        }
        const point = grammarLesson.points.get(title);
        if (!point) {
          fail(
            refPath,
            `Bài ngữ pháp ${lesson} không có mẫu "${title}". Các mẫu đang có:\n` +
              [...grammarLesson.points.keys()].map((name) => `                - ${name}`).join('\n'),
          );
          return;
        }
        if (!note) fail(refPath, `Thiếu "note" — giải thích mẫu "${title}" trong chính câu này`);
        if (grammar.some((item) => item.point === point.id)) {
          fail(refPath, `Mẫu "${title}" khai hai lần trong cùng một câu`);
          return;
        }
        grammar.push({ point: point.id, note });
        lessonsUsed.add(lesson);
        grammarRefs[point.id] = {
          lesson,
          lessonId: grammarLesson.lessonId,
          title: point.title,
          structure: point.structure,
        };
      });

      if (grammar.length < 2) fail(path, `Câu phải kết hợp ít nhất 2 mẫu ngữ pháp (đang có ${grammar.length}): ${ja}`);
      if (!lessonsUsed.has(lessonNumber)) fail(path, `Câu không dùng mẫu nào của bài ${lessonNumber}: ${ja}`);

      const signature = grammar.map((item) => item.point).sort().join('+');
      if (grammar.length >= 2) {
        const previous = seenSignatures.get(signature);
        if (previous) {
          fail(path, `Trùng tổ hợp mẫu ngữ pháp với ${previous} — mỗi câu phải một cách kết hợp riêng: ${ja}`);
        } else {
          seenSignatures.set(signature, path);
        }
      }

      // ── Id: băm từ câu tiếng Nhật dạng thường, như câu hội thoại và câu ví dụ ngữ pháp ──
      const plain = plainText(ja);
      const duplicate = seenSentences.get(plain);
      if (duplicate) {
        fail(path, `Trùng câu tiếng Nhật với ${duplicate}: ${plain}`);
        return;
      }
      seenSentences.set(plain, path);
      let id = hashId(plain);
      if (usedIds.has(id)) {
        let suffix = 2;
        while (usedIds.has(`${id}-${suffix}`)) suffix++;
        id = `${id}-${suffix}`;
      }
      usedIds.add(id);

      stats.lines++;
      const older = [...lessonsUsed].filter((n) => n < lessonNumber);
      if (older.length > 0) stats.mixed++;
      older.forEach((n) => stats.olderLessons.add(n));

      lines.push({
        id,
        ja,
        ...(jaAlt.length > 0 ? { jaAlt } : {}),
        vi,
        ...(viAlt.length > 0 ? { viAlt } : {}),
        ...(speaker ? { speaker } : {}),
        grammar,
      });
    });

    if (lines.length === 0) {
      fail(setPath, `Bài nhỏ "${title}" không có câu nào dùng được`);
      return;
    }
    if (lines.length < SET_SIZE.min || lines.length > SET_SIZE.max) {
      warn(setPath, `Bài nhỏ "${title}" có ${lines.length} câu (nên khoảng ${SET_SIZE.min}–${SET_SIZE.max})`, 'set-size');
    }

    sets.push({
      id: `s${setIndex + 1}`,
      title,
      ...(rawSet.description ? { description: normalizeField(rawSet.description) } : {}),
      lines,
    });
  });

  if (sets.length < 2) warn('sets', `Bài chỉ có ${sets.length} bài nhỏ — nên có nhiều bài nhỏ`, 'few-sets');

  return { sets, grammarRefs, issues, stats };
}
