import type { MessageKey } from '../i18n/messages';
import { PracticeConfig, PracticeQuestion, SentenceGrammar, makeQuestion } from './practice.model';
import { plainText } from '../translation/markup';
import {
  GrammarRef,
  TranslationLineRef,
  contextOf,
} from '../translation/translation.model';

/**
 * Dựng câu hỏi cho bài LUYỆN DỊCH: hiện một câu ở thứ tiếng này, người học dịch sang
 * thứ tiếng kia, rồi xem giải thích từng mẫu ngữ pháp có trong câu.
 *
 * Giống bài hội thoại và bài ngữ pháp ở chỗ chỉ có gõ đáp án và chấm bỏ qua dấu câu.
 * Khác ở ba điểm, đều vì đây là dịch tự do:
 *
 * 1. Chấm theo CÂU MẪU (`acceptedPatterns`) chứ không theo chuỗi cố định: chữ Hán hay
 *    kana đều được, các chỗ nói được nhiều cách đều được — xem `core/translation/markup.ts`.
 * 2. Chỉ MỘT lượt trả lời. Sai thì hiện ngay câu mẫu cùng phần giải thích ngữ pháp:
 *    người học cần thấy mình lệch ở đâu, đoán mò thêm ba lượt không dạy được gì.
 * 3. Cho TỰ CHẤM: câu của người học có thể đúng nghĩa mà vẫn lệch câu mẫu ở cách chọn
 *    từ, và chỉ người học — đã thấy câu mẫu — mới đánh giá được điều đó.
 */
export function buildTranslationQuestions(
  pool: readonly TranslationLineRef[],
  refs: Readonly<Record<string, GrammarRef>>,
  lessonNumber: number | undefined,
  config: PracticeConfig,
): PracticeQuestion[] {
  const toJapanese = config.direction === 'vi-jp';

  return pool.map((ref) => {
    const { line, set } = ref;
    const japanese = plainText(line.ja);
    const vietnamese = plainText(line.vi);

    const grammar = line.grammar.flatMap((item): SentenceGrammar[] => {
      const point = refs[item.point];
      if (!point) return [];
      return [
        {
          lesson: point.lesson,
          title: point.title,
          structure: point.structure,
          note: item.note,
          current: point.lesson === lessonNumber,
        },
      ];
    });

    const context = contextOf(ref);
    const answerAlternatives = toJapanese ? line.jaAlt : line.viAlt;

    return makeQuestion({
      subject: {
        id: line.id,
        title: japanese,
        titleIsJapanese: true,
        // Tên bài nhỏ làm phụ đề, để ở màn hình kết quả biết câu thuộc tình huống nào.
        subtitle: set.title,
        detail: vietnamese,
        detailSuffixKey: null,
        recap: [],
      },
      labelKey: (toJapanese ? 'direction.vi-jp' : 'direction.jp-vi') as MessageKey,
      prompt: toJapanese ? vietnamese : japanese,
      promptIsJapanese: !toJapanese,
      // Gợi ý là tên các mẫu phải dùng. Tắt đi thì người học tự nghĩ ra cách nói.
      hint: config.showGrammarHint ? grammar.map((item) => item.title).join(' ・ ') : null,
      hintIsJapanese: true,
      correctAnswer: toJapanese ? japanese : vietnamese,
      // Không chấm theo chuỗi cố định nào — mọi cách viết đúng nằm trong câu mẫu.
      acceptedAnswers: [],
      acceptedPatterns: toJapanese ? [line.ja, ...line.jaAlt] : [line.vi, ...line.viAlt],
      answerIsJapanese: toJapanese,
      answerPromptKey: (toJapanese
        ? 'practice.answerPrompt.sentenceJapanese'
        : 'practice.answerPrompt.sentenceVietnamese') as MessageKey,
      ignorePunctuation: true,
      isSentence: true,
      maxWrongAttempts: 1,
      selfGradable: true,
      sentence: {
        japanese: line.ja,
        speaker: line.speaker,
        context: context
          ? { speaker: context.speaker, japanese: context.ja, vietnamese: plainText(context.vi) }
          : null,
        grammar,
        alternatives: answerAlternatives.map(plainText),
      },
    });
  });
}
