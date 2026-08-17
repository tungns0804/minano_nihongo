import type { MessageKey } from '../i18n/messages';
import { PracticeConfig, PracticeQuestion, RecapItem } from '../models/practice.model';
import { GrammarExampleRef } from '../models/vocabulary.model';
import { acceptedAnswersOf } from '../utils/answer-check';

/**
 * Dựng câu hỏi cho bài NGỮ PHÁP: hiện một câu ở thứ tiếng này, người học viết lại
 * câu đó ở thứ tiếng kia — nhưng phải viết đúng mẫu ngữ pháp đang học chứ không
 * phải dịch tự do.
 *
 * Kế thừa hai quyết định của bài hội thoại, vì cùng là dịch cả câu:
 *
 * 1. KHÔNG có chế độ trắc nghiệm. Bốn câu dài bày ra để chọn thì đọc lướt là ra đáp
 *    án mà chẳng phải nhớ mẫu ngữ pháp nào.
 * 2. So khớp BỎ QUA dấu câu. Thiếu một dấu 。 không có nghĩa là dùng sai ngữ pháp.
 *
 * Khác bài hội thoại một điểm: chiều Nhật → Việt CÓ tách các cách dịch tương đương
 * ở dấu `/`. Bài hội thoại cố tình không tách vì `/` có thể nằm trong chính lời
 * thoại, còn ví dụ ngữ pháp là câu ngắn do mình soạn, và một câu như
 * どうしたんですか。 dịch được thành "Bạn bị sao vậy?" lẫn "Có chuyện gì vậy?" —
 * bắt gõ trọn cả hai mới tính đúng thì là bắt bẻ chứ không phải kiểm tra ngữ pháp.
 * Đổi lại, bản dịch tiếng Việt trong `grammar.json` không được chứa dấu `/` với
 * nghĩa khác (xem data-source/README.md).
 */
export function buildGrammarQuestions(
  pool: readonly GrammarExampleRef[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const toJapanese = config.direction === 'vi-jp';

  return pool.map(({ example, point, usage }) => {
    const prompt = toJapanese ? example.vietnamese : example.japanese;
    const correctAnswer = toJapanese ? example.japanese : example.vietnamese;

    const recap: RecapItem[] = [
      { labelKey: 'grammar.recap.pattern', value: point.title, valueKey: null, japanese: true },
      { labelKey: 'grammar.recap.usage', value: usage.title, valueKey: null, japanese: false },
      { labelKey: 'lesson.col.japanese', value: example.japanese, valueKey: null, japanese: true },
      {
        labelKey: 'lesson.col.meaningShort',
        value: example.vietnamese,
        valueKey: null,
        japanese: false,
      },
    ];

    // Ghi chú của câu (ví dụ "Trả lời cho どうしたんですか。") chỉ hiện khi có, để
    // phần phản hồi của những câu không có ghi chú không thừa ra một dòng trống.
    if (example.note) {
      recap.push({ labelKey: 'grammar.recap.note', value: example.note, valueKey: null, japanese: false });
    }

    return {
      subject: {
        id: example.id,
        title: example.japanese,
        titleIsJapanese: true,
        subtitle: point.title,
        detail: example.vietnamese,
        detailSuffixKey: null,
        recap,
      },
      labelKey: (toJapanese ? 'direction.vi-jp' : 'direction.jp-vi') as MessageKey,
      labelParams: {},
      prompt,
      promptIsJapanese: !toJapanese,
      // Gợi ý là chính mẫu ngữ pháp phải dùng. Tắt đi thì người học phải tự nhớ ra
      // mẫu nào hợp với câu — khó hơn hẳn, nên để thành tuỳ chọn.
      hint: config.showGrammarHint ? grammarHint(point.title, point.structures) : null,
      hintIsJapanese: true,
      correctAnswer,
      correctAnswerKey: null,
      acceptedAnswers: toJapanese ? [correctAnswer] : acceptedAnswersOf(correctAnswer),
      answerIsJapanese: toJapanese,
      answerPromptKey: (toJapanese
        ? 'practice.answerPrompt.sentenceJapanese'
        : 'practice.answerPrompt.sentenceVietnamese') as MessageKey,
      answerPromptParams: {},
      choices: [],
      choiceLabelKeys: null,
      ignorePunctuation: true,
      isSentence: true,
      maxWrongAttempts: Math.max(1, config.maxWrongAttempts),
    };
  });
}

/** Gợi ý gọn một dòng: tên mẫu, kèm công thức đầu tiên nếu có. */
function grammarHint(title: string, structures: readonly string[]): string {
  return structures.length > 0 ? `${title} — ${structures[0]}` : title;
}
