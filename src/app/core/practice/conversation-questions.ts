import type { MessageKey } from '../i18n/messages';
import { PracticeConfig, PracticeQuestion } from '../models/practice.model';
import { ConversationLine } from '../models/vocabulary.model';

/**
 * Dựng câu hỏi cho bài HỘI THOẠI: hiện câu ở một thứ tiếng, người học gõ lại câu
 * đó ở thứ tiếng kia.
 *
 * Khác hai loại bài kia ở hai điểm, đều là chủ ý:
 *
 * 1. KHÔNG có chế độ trắc nghiệm. Bốn câu dài để chọn thì đọc lướt là ra đáp án
 *    mà chẳng phải dịch gì — bài này chỉ có ý nghĩa khi tự viết ra câu.
 * 2. So khớp BỎ QUA dấu câu (xem `ignorePunctuation`). Câu dài mà bắt gõ đúng cả
 *    dấu 、。 hay dấu ba chấm thì sai vì chuyện không liên quan tới việc dịch.
 */
export function buildConversationQuestions(
  pool: readonly ConversationLine[],
  config: PracticeConfig,
): PracticeQuestion[] {
  const toJapanese = config.direction === 'vi-jp';

  return pool.map((line) => {
    const prompt = toJapanese ? line.vietnamese : line.japanese;
    const correctAnswer = toJapanese ? line.japanese : line.vietnamese;

    return {
      subject: {
        id: line.id,
        title: line.japanese,
        titleIsJapanese: true,
        // Người nói hiện làm phụ đề; câu nào không thuộc lời thoại thì để tiêu đề nhóm.
        subtitle: line.speaker || line.section,
        detail: line.vietnamese,
        detailSuffixKey: null,
        recap: [
          { labelKey: 'lesson.col.japanese', value: line.japanese, valueKey: null, japanese: true },
          {
            labelKey: 'lesson.col.meaningShort',
            value: line.vietnamese,
            valueKey: null,
            japanese: false,
          },
        ],
      },
      labelKey: (toJapanese ? 'direction.vi-jp' : 'direction.jp-vi') as MessageKey,
      labelParams: {},
      prompt,
      promptIsJapanese: !toJapanese,
      // Không dùng gợi ý âm Hán Việt: câu hội thoại không có trường đó.
      hint: null,
      correctAnswer,
      correctAnswerKey: null,
      // Cả câu là một đáp án duy nhất — không tách theo dấu / như bài từ vựng, vì
      // dấu / hoàn toàn có thể là một phần của câu.
      acceptedAnswers: [correctAnswer],
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
