import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  VERB_FORM_LABEL_KEY,
  VERB_GROUP_LABEL_KEY,
  VerbForm,
  VerbGroup,
} from '../../core/japanese/conjugation';
import type { MessageKey } from '../../core/i18n/messages';
import { T } from '../../core/i18n/t';
import {
  AnswerMode,
  directionInfo,
  directionIsUsable,
  DIRECTIONS,
  directionUsesField,
  LIMIT_CHOICES,
  practiceConfig,
  PracticeConfig,
  PracticeDirection,
  VERB_MODES,
  verbModeInfo,
  VerbPracticeMode,
} from '../../core/practice/practice.model';
import {
  ConversationLine,
  LESSON_KIND_SEARCH_KEY,
  LESSON_KIND_TABLE_KEY,
  LESSON_KIND_UNIT_KEY,
  LESSON_KIND_LABEL_KEY,
  Lesson,
  OPTIONAL_WORD_FIELDS,
  VerbEntry,
  VocabularyWord,
  WordField,
  fieldValue,
  hasWordField,
  shortLessonName,
  showsLessonKanji,
} from '../../core/lessons/vocabulary.model';
import { LESSON_KIND_TAB, PATH, idOfSlug, lessonPath, listPathOf, pathOf } from '../../core/paths';
import { batchCount, batchRange } from '../../core/practice/batch';
import { buildQuestions, PracticePool } from '../../core/practice/build-questions';
import { FORMS_BY_MODE } from '../../core/practice/verb-questions';
import { PracticeScreen } from '../../core/screens/practice-screen';
import { LessonStore } from '../../core/lessons/lesson-store';
import { VocabAudioPlayer } from '../../core/audio/vocab-audio-player';
import { ImagePreference } from '../../core/images/image-preference';
import { vocabImageOf } from '../../core/images/vocab-images';
import { normalizeSearch } from '../../core/lessons/lesson-search';
import { checkedOf } from '../../core/utils/dom-events';
import { SearchBox } from '../../shared/search-box';
import { StarButton } from '../../shared/star-button';
import { VerbRow, buildVerbRows, formsText } from './verb-rows';
import { PracticeSetup } from '../../shared/practice-setup';
import { VocabPhoto } from '../../shared/vocab-photo';
import { PhotoViewer } from '../../shared/photo-viewer';
import { LessonPager } from '../../shared/lesson-pager';
import type { LessonKanji } from '../../core/kanji/onkun.model';
import { KanjiStudy, StudyTarget } from '../../shared/kanji-study';

/**
 * Thiết lập mà bài TỪ VỰNG có sẵn khi mở ra — đúng bộ người học chụp gửi ngày
 * 2026-11-07 và yêu cầu làm mặc định: nhìn chữ Hán gõ ra cách đọc, mỗi phiên 10 từ
 * theo đúng thứ tự trong bài (bắt đầu từ cụm 1), có âm Hán Việt làm mốc nhớ.
 *
 * Chỉ áp cho bài từ vựng (kể cả bài chủ đề). Bài động từ và hội thoại giữ mặc định
 * cũ — chúng không có chiều "cách đọc", và bài hội thoại còn khoá luôn cách trả lời.
 */
const VOCABULARY_DEFAULTS = {
  direction: 'jp-kana',
  /** Bài không có cách đọc thì không có chiều jp-kana — lùi về chiều này. */
  fallbackDirection: 'jp-vi',
  answerMode: 'typing',
  questionLimit: 10,
  /** Cụm 1 (đếm từ 0). */
  batch: 0,
  shuffle: false,
  showHanViet: true,
} as const satisfies {
  direction: PracticeDirection;
  fallbackDirection: PracticeDirection;
  answerMode: AnswerMode;
  questionLimit: number;
  batch: number;
  shuffle: boolean;
  showHanViet: boolean;
};

/** Hai tab của bài có khối chữ Hán. */
type LessonTab = 'words' | 'kanji';

@Component({
  selector: 'app-lesson-detail',
  imports: [
    KanjiStudy,
    LessonPager,
    PhotoViewer,
    PracticeSetup,
    RouterLink,
    SearchBox,
    StarButton,
    T,
    VocabPhoto,
  ],
  templateUrl: './lesson-detail.html',
  styleUrl: './lesson-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonDetail extends PracticeScreen {
  private readonly route = inject(ActivatedRoute);
  private readonly lessonStore = inject(LessonStore);
  /** Public: template gọi thẳng để biết nút loa của từng từ đang ở trạng thái nào. */
  readonly audio = inject(VocabAudioPlayer);

  readonly directions = DIRECTIONS;
  readonly verbModes = VERB_MODES;
  readonly formLabelKey = VERB_FORM_LABEL_KEY;

  /**
   * Danh sách mà route này nằm dưới (`data.base` trong app.routes.ts): cùng màn hình
   * mở bài từ vựng, chủ đề, và bài động từ / hội thoại của tab Bài tập.
   */
  private readonly base: string = this.route.snapshot.data['base'] ?? PATH.vocab;

  readonly lessonId = signal('');
  readonly lesson = signal<Lesson | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  protected favoriteSessionId(): string {
    return this.lessonId();
  }

  // --- Thiết lập riêng của bài học ---
  readonly answerMode = signal<AnswerMode>('choice');
  /**
   * Cụm đang chọn, chưa kiểm tra còn hợp lệ hay không — đọc qua `batchIndex`.
   * null = không học theo cụm (trộn cả bài rồi lấy N câu, như trước giờ).
   */
  private readonly pickedBatch = signal<number | null>(null);
  // Riêng bài từ vựng
  readonly direction = signal<PracticeDirection>('jp-vi');
  // Riêng bài động từ
  readonly verbMode = signal<VerbPracticeMode>('masu-to-form');
  readonly selectedForms = signal<VerbForm[]>(['te']);

  readonly isVerbLesson = computed(() => this.lesson()?.kind === 'verb');
  readonly isConversationLesson = computed(() => this.lesson()?.kind === 'conversation');

  /**
   * Nút "quay lại" phải trỏ về đúng tab đang liệt kê bài này.
   *
   * Bài từ vựng nằm ở trang chủ, còn bài chia động từ và bài dịch hội thoại nằm ở
   * tab Bài tập bổ trợ. Trỏ cứng về "/" như trước thì mở một bài động từ rồi bấm
   * quay lại sẽ rơi vào một danh sách KHÔNG chứa bài vừa xem — đúng kiểu lạc đường
   * mà người dùng không hiểu nổi tại sao.
   */
  readonly backRoute = computed(() => {
    const kind = this.lesson()?.kind;
    return kind ? listPathOf(kind) : this.base;
  });

  /** Chữ trên nút quay lại, gọi đúng tên cái danh sách sắp quay về. */
  readonly backLabelKey = computed<MessageKey>(() => {
    const tab = LESSON_KIND_TAB[this.lesson()?.kind ?? 'vocabulary'];
    if (tab === 'exercise') return 'exercise.back';
    if (tab === 'topic') return 'topic.back';
    return 'common.back';
  });
  readonly words = computed(() => this.lesson()?.words ?? []);

  /**
   * Chữ Hán của bài, theo thứ tự gặp trong bảng từ, kèm âm On / Kun và các từ của bài —
   * chỉ ở bài mà `showsLessonKanji` cho phép (mọi bài từ vựng N3). Rỗng cho tới khi kho
   * chữ nạp xong.
   */
  readonly lessonKanji = signal<readonly LessonKanji[]>([]);
  /** Phiên luyện âm On / Kun của khối chữ là phiên của chính bài này. */
  readonly kanjiTarget = computed<StudyTarget | null>(() => {
    const lesson = this.lesson();
    return lesson ? { id: lesson.id, name: lesson.name, kind: 'lesson' } : null;
  });

  /** Tab đang mở, đọc từ `?tab=` (xem `setTab`). */
  readonly tab = signal<LessonTab>('words');
  /** Bài có khối chữ Hán (bài từ vựng N3) thì trang chia hai tab Từ vựng | Chữ Hán. */
  readonly hasKanjiTab = computed(() => {
    const lesson = this.lesson();
    return lesson !== null && showsLessonKanji(lesson);
  });
  /** Bài không có tab thì nội dung từ vựng luôn hiện, bất kể URL ghi gì. */
  readonly showWordsTab = computed(() => !this.hasKanjiTab() || this.tab() === 'words');
  /** Lật sang bài kề mà vẫn ở tab Chữ Hán; bài kề không có tab thì tham số tự bị bỏ qua. */
  readonly pagerQuery = computed(() =>
    this.hasKanjiTab() && this.tab() === 'kanji' ? { tab: 'kanji' } : undefined,
  );
  readonly verbs = computed(() => this.lesson()?.verbs ?? []);
  readonly lines = computed(() => this.lesson()?.lines ?? []);

  /** Toàn bộ mục của bài, không phân biệt loại — dùng cho Favorite và đếm. */
  readonly items = computed<{ id: string }[]>(() => {
    if (this.isVerbLesson()) return this.verbs();
    if (this.isConversationLesson()) return this.lines();
    return this.words();
  });

  readonly favoriteCount = computed(() => this.favoritesOf(this.items()).length);

  /**
   * Ba khoá nhãn của bảng tra, theo loại bài đang mở. Bảng tra cứu nằm ở
   * `core/lessons/vocabulary.model.ts` cạnh những bảng cùng loại — thêm một loại
   * bài mà quên khai thì TypeScript báo lỗi ngay tại đó.
   */
  readonly kindLabelKeys = computed(() => {
    const kind = this.lesson()?.kind ?? 'vocabulary';
    return {
      title: LESSON_KIND_TABLE_KEY[kind],
      search: LESSON_KIND_SEARCH_KEY[kind],
      unit: LESSON_KIND_UNIT_KEY[kind],
    };
  });

  /** Chỉ hiện cột ví dụ khi bài có ít nhất một câu — tránh cột trống vô ích. */
  readonly hasExamples = computed(() => this.words().some((word) => word.example.length > 0));
  /** Bài có từ nào có ảnh minh họa không — có thì mới hiện công tắc ảnh. */
  readonly hasImages = computed(() => this.words().some((word) => vocabImageOf(word) !== null));
  private readonly imagePreference = inject(ImagePreference);
  readonly showImages = this.imagePreference.show;
  /** Bảng có cột "Hình ảnh" không: bài có ảnh và người học không tắt ảnh. */
  readonly imageColumn = computed(() => this.hasImages() && this.showImages());
  readonly imageOf = vocabImageOf;
  readonly hasReadings = computed(() => hasWordField(this.words(), 'reading'));

  /**
   * Cách đọc đứng thành cột riêng hay nằm ngay dưới từ trong ô tiếng Nhật.
   *
   * Có cột ảnh thì hàng nào cũng đã cao bằng cái ảnh, nên cách đọc xuống dòng dưới từ
   * không làm hàng cao thêm mà bảng bớt được một cột — cột nghĩa rộng ra, hết cảnh mấy
   * cột chữ ngắn đứng cách nhau cả gang tay. Không có ảnh thì hàng chỉ một dòng chữ,
   * gộp vào lại làm cả bảng cao gấp rưỡi, nên vẫn giữ cột riêng như cũ.
   */
  readonly readingColumn = computed(() => this.hasReadings() && !this.imageColumn());
  readonly readingInline = computed(() => this.hasReadings() && this.imageColumn());

  /** Các từ có ảnh, theo đúng thứ tự (và bộ lọc) của bảng — dãy ← → của khung phóng to. */
  readonly photoWords = computed(() =>
    this.filteredWords().filter((word) => vocabImageOf(word) !== null),
  );
  /** Ảnh đang phóng to (vị trí trong `photoWords`); null là khung đóng. */
  readonly photoIndex = signal<number | null>(null);

  openPhoto(word: VocabularyWord): void {
    const index = this.photoWords().indexOf(word);
    if (index >= 0) this.photoIndex.set(index);
  }

  /**
   * Bài có âm Hán Việt không. Bài 総まとめ N3 gồm nhiều từ katakana và trạng từ
   * thuần kana nên có thể không có từ nào — lúc đó cột này và hai chiều luyện
   * jp-han / han-jp đều phải biến mất.
   */
  readonly hasHanViet = computed(() => hasWordField(this.words(), 'hanViet'));

  /** Bài này có trường đó không — dùng để lọc chiều luyện. */
  private readonly hasField = computed(() => {
    // Khai đủ bốn trường chứ không chỉ hai trường tuỳ chọn: thêm một trường mới vào
    // `WordField` mà quên xếp vào đây thì TypeScript báo lỗi ngay tại chỗ này.
    const present: Record<WordField, boolean> = {
      japanese: true,
      vietnamese: true,
      hanViet: this.hasHanViet(),
      reading: this.hasReadings(),
    };
    return (field: WordField): boolean => present[field];
  });

  readonly specialVerbs = computed(() => this.verbs().filter((verb) => verb.deceptive));
  readonly specialCount = computed(() => this.specialVerbs().length);

  /** Động từ đã chia sẵn để hiện bảng tra cứu. */
  readonly verbRows = computed<VerbRow[]>(() => buildVerbRows(this.verbs()));

  /** Động từ khai báo sai nhóm — cảnh báo ngay để không lòi ra lúc đang luyện. */
  readonly brokenVerbs = computed(() => this.verbRows().filter((row) => row.error !== null));

  readonly currentDirection = computed(() => directionInfo(this.direction()));

  /**
   * Có bật được gợi ý âm Hán Việt không.
   *
   * Hai điều kiện: chiều đang chọn phải cho phép (bật ở chiều jp-han / han-jp là lộ
   * đáp án), VÀ bài phải thực sự có âm Hán Việt — bài 総まとめ N3 toàn từ katakana
   * thì "gợi ý" chỉ là một ô trống.
   */
  readonly hanVietHintAvailable = computed(
    () => this.currentDirection().supportsHanVietHint && this.hasHanViet(),
  );

  /**
   * Chỉ hiện chiều luyện dùng được với bài này. Bài chưa khai báo cách đọc (hoặc
   * không có âm Hán Việt) thì các chiều liên quan biến mất thay vì hiện ra rồi cho
   * ra câu hỏi có đáp án rỗng.
   */
  readonly availableDirections = computed(() => {
    // Bài hội thoại chỉ dịch qua lại Nhật/Việt — không có âm Hán Việt hay cách đọc
    // cho cả một câu.
    if (this.isConversationLesson()) {
      return this.directions.filter((item) => item.id === 'jp-vi' || item.id === 'vi-jp');
    }
    const hasField = this.hasField();
    return this.directions.filter((item) => directionIsUsable(item.id, hasField));
  });

  /**
   * Bài hội thoại chỉ cho gõ đáp án. Bốn câu dài bày ra để chọn thì đọc lướt là
   * ra đáp án mà chẳng phải dịch — mất hẳn ý nghĩa của bài.
   */
  readonly answerModeLocked = computed(() => this.isConversationLesson());
  readonly currentVerbMode = computed(() => verbModeInfo(this.verbMode()));
  readonly availableForms = computed(() => FORMS_BY_MODE[this.verbMode()]);

  /** Tập mục sẽ đem ra hỏi theo phạm vi đang chọn. */
  readonly pool = computed<PracticePool>(() => {
    if (this.isVerbLesson()) {
      return { kind: 'verb', verbs: this.filterVerbs() };
    }
    if (this.isConversationLesson()) {
      return { kind: 'conversation', lines: this.filterLines() };
    }
    return { kind: 'vocabulary', words: this.filterWords() };
  });

  readonly poolSize = computed(() => {
    const pool = this.pool();
    // switch chứ không phải chuỗi if: màn hình này không bao giờ dựng pool ngữ pháp
    // (bài đó đã được chuyển hướng đi từ `load`), nhưng để nhánh mặc định trả về
    // `pool.words` thì thêm loại pool mới sẽ đếm nhầm mà chẳng báo gì.
    switch (pool.kind) {
      case 'verb':
        return pool.verbs.length;
      case 'conversation':
        return pool.lines.length;
      case 'vocabulary':
        return pool.words.length;
      case 'grammar':
        return pool.examples.length;
      case 'translation':
        return pool.sentences.length;
    }
  });

  /**
   * Tổng số câu của phạm vi đang chọn, trước khi cắt. Bài động từ sinh một câu
   * cho mỗi cặp (động từ × thể) nên số câu bằng số động từ nhân số thể đang chọn.
   */
  readonly totalQuestionCount = computed(() => {
    const perItem =
      this.isVerbLesson() && this.currentVerbMode().needsForms
        ? Math.max(1, this.selectedForms().length)
        : 1;
    return this.poolSize() * perItem;
  });

  /**
   * Bài này chia được thành mấy cụm theo số câu đang chọn. 0 khi chưa chọn số
   * câu — lúc đó luyện cả bài một lượt, không có cụm nào.
   */
  readonly batchTotal = computed(() =>
    batchCount(this.totalQuestionCount(), this.questionLimit()),
  );

  /**
   * Cụm đang chọn, đã kiểm tra còn tồn tại.
   *
   * Đổi phạm vi hay đổi chiều luyện làm số câu co lại, nên cụm 5 chọn lúc trước
   * có thể không còn. Lọc ở đây thay vì rải lệnh reset khắp các hàm `set*`: quên
   * một chỗ là người dùng bấm "Bắt đầu" và nhận về một phiên rỗng.
   */
  readonly batchIndex = computed<number | null>(() => {
    const picked = this.pickedBatch();
    return picked !== null && picked < this.batchTotal() ? picked : null;
  });

  /** Các cụm để bày ra chọn, kèm khoảng thứ tự hiện cho người học. */
  readonly batchOptions = computed(() => {
    const limit = this.questionLimit();
    const total = this.totalQuestionCount();
    if (limit === null) return [];
    return Array.from({ length: this.batchTotal() }, (_, index) => ({
      index,
      ...batchRange(total, limit, index),
    }));
  });

  /** Số câu sẽ luyện của phiên sắp bắt đầu. */
  readonly plannedQuestionCount = computed(() => {
    const total = this.totalQuestionCount();
    const limit = this.questionLimit();
    if (limit === null) return total;

    // Cụm cuối thường ngắn hơn các cụm trước (bài 34 từ, cụm 10 → cụm 4 có 4 câu).
    const batch = this.batchIndex();
    return batch === null ? Math.min(limit, total) : Math.min(limit, total - batch * limit);
  });

  readonly canStart = computed(() => this.plannedQuestionCount() > 0);

  readonly limitChoices = computed(() =>
    LIMIT_CHOICES.filter((limit) => limit < this.totalQuestionCount()),
  );

  readonly filteredWords = computed<VocabularyWord[]>(() => {
    const base = this.onlyFavorites()
      ? this.favoritesOf(this.words())
      : this.words();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((word) =>
      normalizeSearch(
        `${word.hanViet} ${word.japanese} ${word.reading} ${word.vietnamese} ${word.example} ` +
          word.exampleVietnamese,
      ).includes(keyword),
    );
  });

  readonly filteredLines = computed<ConversationLine[]>(() => {
    const base = this.onlyFavorites()
      ? this.favoritesOf(this.lines())
      : this.lines();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((line) =>
      normalizeSearch(
        `${line.speaker} ${line.section} ${line.japanese} ${line.vietnamese}`,
      ).includes(keyword),
    );
  });

  readonly filteredVerbRows = computed<VerbRow[]>(() => {
    const base = this.onlyFavorites()
      ? this.verbRows().filter((row) => this.isFavorite(row.entry.id))
      : this.verbRows();
    const keyword = normalizeSearch(this.search());
    if (!keyword) return base;
    return base.filter((row) =>
      normalizeSearch(
        `${row.entry.hanViet} ${row.entry.masu} ${row.entry.vietnamese} ${formsText(row.forms)}`,
      ).includes(keyword),
    );
  });

  constructor() {
    super();
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const slug = params.get('slug') ?? '';
      const id = idOfSlug(this.base, slug);
      this.lessonId.set(id);
      this.resetView();
      void this.load(id, `${this.base}/${slug}`);
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.tab.set(params.get('tab') === 'kanji' ? 'kanji' : 'words');
    });
  }

  private async load(id: string, requested: string): Promise<void> {
    this.loading.set(true);
    this.notFound.set(false);
    const lesson = await this.lessonStore.getLesson(id);

    // Bài nằm sai nhánh — đường dẫn cũ /lesson/<id> đoán nhầm loại, link chép tay, bài
    // ngữ pháp mở ở /tu-vung/… — thì đưa sang đúng chỗ thay vì vẽ ở đây: bài ngữ pháp
    // và luyện dịch có màn hình riêng (ở đây mọi bảng của chúng đều rỗng), còn bài đúng
    // loại mà sai nhánh thì menu, tab và nút quay lại đều chỉ sai chỗ.
    //
    // Chỉ chuyển khi người học VẪN đang ở trang vừa yêu cầu: trong lúc chờ tải bài họ
    // có thể đã bấm sang trang khác, và kéo họ quay lại là cướp cú bấm đó.
    const here = pathOf(this.router.url);
    if (lesson && here === requested && lessonPath(lesson.kind, lesson.id) !== here) {
      void this.router.navigateByUrl(lessonPath(lesson.kind, lesson.id), { replaceUrl: true });
      return;
    }

    this.lesson.set(lesson);
    this.notFound.set(lesson === null);
    this.loading.set(false);
    if (lesson) {
      this.rememberRecent({ title: lesson.name, kindKey: LESSON_KIND_LABEL_KEY[lesson.kind] });
      this.labelPage(shortLessonName(lesson.name));
      if (lesson.kind === 'vocabulary') this.applyVocabularyDefaults();
    }
    if (lesson && showsLessonKanji(lesson)) void this.loadLessonKanji(lesson);
  }

  /**
   * Dựng khối "Chữ Hán trong bài" (xem `shared/kanji-study.ts`).
   *
   * Nạp ĐỘNG kho chữ (~300 kB) và bảng âm On / Kun (~73 kB): trang bài học mở cho mọi
   * bài — bài nào không có khối này thì không phải tải chúng.
   */
  private async loadLessonKanji(lesson: Lesson): Promise<void> {
    const [{ kanjiInTexts }, { lessonKanjiOf }] = await Promise.all([
      import('../../core/kanji/kanji-entries'),
      import('../../core/kanji/onkun-study'),
    ]);
    // Người học đã sang bài khác trong lúc chờ.
    if (this.lesson()?.id !== lesson.id) return;
    const entries = kanjiInTexts(lesson.words.map((word) => word.japanese));
    this.lessonKanji.set(lessonKanjiOf(lesson.words, entries));
  }

  /**
   * Đổi tab bằng cách đổi `?tab=` trên URL (thay chứ không thêm vào lịch sử: nút Back của
   * trình duyệt vẫn về trang trước, không lùi qua từng lần bấm tab). Tab đọc lại từ URL ở
   * `constructor`, nên đây là đường đổi tab duy nhất.
   */
  setTab(tab: LessonTab): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab === 'kanji' ? 'kanji' : null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /**
   * Mỗi bài mở ra ở thiết lập mặc định của LOẠI bài đó. Màn hình này được dùng lại khi
   * chuyển bài (chỉ đổi tham số đường dẫn), nên không đặt lại thì chiều luyện, cách trả
   * lời và trộn câu của bài vừa xem sẽ đi theo sang bài sau — sang bài động từ mà vẫn
   * mang chiều "Nhật → Cách đọc" của bài từ vựng. Bài từ vựng đè tiếp bằng
   * `applyVocabularyDefaults` khi dữ liệu bài đã về.
   */
  private resetView(): void {
    this.lesson.set(null);
    this.lessonKanji.set([]);
    this.photoIndex.set(null);
    this.search.set('');
    this.onlyFavorites.set(false);
    this.scope.set('all');
    this.questionLimit.set(null);
    this.pickedBatch.set(null);
    this.direction.set('jp-vi');
    this.answerMode.set('choice');
    this.shuffleQuestions.set(true);
    // Mặc định HIỆN âm Hán Việt: nó là mốc nhớ chính của người học tiếng Việt, và ở
    // chiều hỏi nào lộ đáp án thì `hanVietHintAvailable` tự tắt.
    this.showHint.set(true);
    this.verbMode.set('masu-to-form');
    this.selectedForms.set(['te']);
  }

  /**
   * Đặt `VOCABULARY_DEFAULTS` cho bài vừa nạp. Phải chạy SAU khi `lesson` đã có: chiều
   * luyện dùng được hay không tuỳ bài có cách đọc không, và số câu của bài lại tuỳ
   * chiều luyện (chiều cách đọc bỏ qua từ katakana không có cách đọc riêng).
   */
  private applyVocabularyDefaults(): void {
    const defaults = VOCABULARY_DEFAULTS;
    this.direction.set(
      directionIsUsable(defaults.direction, this.hasField())
        ? defaults.direction
        : defaults.fallbackDirection,
    );
    this.answerMode.set(defaults.answerMode);
    this.shuffleQuestions.set(defaults.shuffle);
    this.showHint.set(defaults.showHanViet);
    // Bài ngắn hơn 10 câu không có nút "10 câu" (xem `limitChoices`), nên giữ "Tất cả".
    if (defaults.questionLimit < this.totalQuestionCount()) {
      this.questionLimit.set(defaults.questionLimit);
      this.pickedBatch.set(defaults.batch);
    }
  }

  private filterLines(): ConversationLine[] {
    return this.scope() === 'favorite'
      ? this.favoritesOf(this.lines())
      : this.lines();
  }

  private filterWords(): VocabularyWord[] {
    const scoped =
      this.scope() === 'favorite'
        ? this.favoritesOf(this.words())
        : this.words();

    // Bài điền dở dang một trường TUỲ CHỌN (một số từ có cách đọc, một số không;
    // một số có âm Hán Việt, một số không) thì ở chiều luyện đụng tới trường đó
    // phải bỏ hẳn những từ thiếu — nếu không, câu hỏi hoặc đáp án sẽ là chuỗi
    // rỗng: gõ gì cũng sai, mà chẳng có lỗi nào được báo.
    //
    // Duyệt CẢ `OPTIONAL_WORD_FIELDS` chứ không chỉ `reading` như trước. Trước
    // đây chưa lộ ra vì không bài nào trộn từ có và không có âm Hán Việt trong
    // cùng một bài — nhưng bài CHỦ ĐỀ thì trộn: nó gom từ 皆の日本語 (luôn có âm
    // Hán Việt) với từ 総まとめ N3 (nhiều từ katakana thì không).
    //
    // Lọc ở đây chứ không ở nơi dựng câu hỏi, để số câu hiện trên màn hình thiết
    // lập khớp với số câu thật sự luyện.
    const info = this.currentDirection();
    const needed = OPTIONAL_WORD_FIELDS.filter((field) => directionUsesField(info.id, field));
    if (needed.length === 0) return scoped;
    return scoped.filter((word) => needed.every((field) => fieldValue(word, field).length > 0));
  }

  private filterVerbs(): VerbEntry[] {
    switch (this.scope()) {
      case 'favorite':
        return this.favoritesOf(this.verbs());
      case 'special':
        return this.specialVerbs();
      default:
        return this.verbs();
    }
  }

  // --- Sự kiện thiết lập ---

  setDirection(direction: PracticeDirection): void {
    this.direction.set(direction);
  }

  setAnswerMode(mode: AnswerMode): void {
    this.answerMode.set(mode);
  }

  /**
   * Ngoài việc đặt số câu, còn phải bỏ cụm đang chọn: cụm 3 của "10 câu" không
   * phải cụm 3 của "20 câu" — đổi số câu là chia lại bài, nên quay về đầu thay vì
   * giữ một con số nay mang nghĩa khác.
   */
  override setQuestionLimit(limit: number | null): void {
    super.setQuestionLimit(limit);
    this.pickedBatch.set(null);
  }

  setBatchIndex(index: number | null): void {
    this.pickedBatch.set(index);
  }

  setVerbMode(mode: VerbPracticeMode): void {
    this.verbMode.set(mode);
    this.questionLimit.set(null);

    // Giữ lại các thể vẫn hợp lệ ở dạng mới; hết sạch thì quay về mặc định.
    const allowed = FORMS_BY_MODE[mode];
    const kept = this.selectedForms().filter((form) => allowed.includes(form));
    this.selectedForms.set(kept.length > 0 ? kept : allowed.length > 0 ? [allowed[0]] : []);
  }

  isFormSelected(form: VerbForm): boolean {
    return this.selectedForms().includes(form);
  }

  toggleForm(form: VerbForm): void {
    const current = this.selectedForms();
    // Luôn phải còn ít nhất một thể được chọn.
    if (current.includes(form) && current.length === 1) return;

    this.selectedForms.set(
      current.includes(form) ? current.filter((f) => f !== form) : [...current, form],
    );
    this.questionLimit.set(null);
  }

  // --- Phát âm ---

  /**
   * Đọc to một từ. Bấm lại đúng từ đang đọc thì dừng.
   *
   * Không đụng gì tới Favorite hay bộ lọc: đây chỉ là nghe thử một từ trong lúc dò
   * bảng, không phải một thao tác học.
   */
  toggleShowImages(event: Event): void {
    this.imagePreference.set(checkedOf(event));
  }

  speak(word: VocabularyWord): void {
    this.audio.play(word);
  }

  markSpecialAsFavorite(): void {
    this.favoriteStore.add(
      this.lessonId(),
      this.specialVerbs().map((verb) => verb.id),
    );
  }

  // --- Bắt đầu ---

  start(): void {
    const lesson = this.lesson();
    if (!lesson || !this.canStart()) return;

    this.startWith(lesson, this.buildConfig(lesson), this.pool());
  }

  /**
   * Luyện đúng MỘT câu hội thoại, theo chiều bấm ngay tại dòng đó.
   *
   * Không đọc và cũng không sửa các lựa chọn ở khung thiết lập: bấm vào một câu là
   * muốn dịch ngay câu đó theo chiều vừa bấm, chứ không phải đổi cấu hình của cả
   * bài. Vì vậy phạm vi, chiều, số câu và trộn thứ tự đều bị đè.
   */
  practiceLine(line: ConversationLine, direction: PracticeDirection): void {
    const lesson = this.lesson();
    if (!lesson) return;

    const config = this.buildConfig(lesson, {
      scope: 'single',
      direction,
      // Một câu thì không có gì để trộn, và cắt còn 10 câu lại càng vô nghĩa.
      shuffle: false,
      questionLimit: null,
      batchIndex: null,
    });

    this.startWith(lesson, config, { kind: 'conversation', lines: [line] });
  }

  /**
   * Khối thiết lập của một phiên, dựng từ các lựa chọn đang hiện trên màn hình.
   *
   * Tách riêng vì có hai đường bắt đầu phiên — nút "Bắt đầu" cho cả bài và nút
   * luyện một câu ở từng dòng hội thoại — và chúng chỉ khác nhau vài trường. Chép
   * khối này ra làm hai bản thì thêm một tuỳ chọn mới sẽ chỉ có tác dụng ở một
   * trong hai đường, mà chẳng có gì báo.
   */
  private buildConfig(lesson: Lesson, overrides: Partial<PracticeConfig> = {}): PracticeConfig {
    return practiceConfig({
      lessonId: lesson.id,
      lessonKind: lesson.kind,
      scope: this.scope(),
      // Bài hội thoại luôn là gõ đáp án, kể cả khi người dùng từng chọn trắc nghiệm
      // ở một bài khác trước đó.
      answerMode: this.answerModeLocked() ? 'typing' : this.answerMode(),
      questionLimit: this.questionLimit(),
      batchIndex: this.batchIndex(),
      shuffle: this.shuffleQuestions(),
      ignoreDiacritics: this.ignoreDiacritics(),
      direction: this.direction(),
      showHanViet: this.showHint() && this.hanVietHintAvailable(),
      showImages: this.showImages(),
      // Bài ngữ pháp mở từ đây luôn hiện gợi ý; khung thiết lập riêng của khu ngữ
      // pháp mới cho tắt.
      showGrammarHint: true,
      verbMode: this.verbMode(),
      verbForms: this.selectedForms(),
      ...overrides,
    });
  }

  /** Dựng câu hỏi từ tập mục rồi giao cho `PracticeScreen.launch`. */
  private startWith(lesson: Lesson, config: PracticeConfig, pool: PracticePool): void {
    this.launch({ id: lesson.id, name: lesson.name }, config, buildQuestions(lesson, pool, config));
  }

  deleteCustomLesson(): void {
    const lesson = this.lesson();
    if (!lesson || lesson.origin !== 'custom') return;
    if (!confirm(this.lang.t('lesson.confirm.delete', { name: lesson.name }))) return;
    this.lessonStore.deleteCustomLesson(lesson.id);
    this.favoriteStore.clearLesson(lesson.id);
    void this.router.navigateByUrl(PATH.vocab);
  }

  groupOf(group: VerbGroup): string {
    return this.lang.t(VERB_GROUP_LABEL_KEY[group]);
  }

  /** Khoá nhãn nhóm — dùng với <app-t> để bề rộng cột không đổi theo ngôn ngữ. */
  groupKeyOf(group: VerbGroup) {
    return VERB_GROUP_LABEL_KEY[group];
  }

  /** Nhãn ngắn của kiểu luyện đang chọn, dùng cho dòng tóm tắt trước khi bắt đầu. */
  readonly modeShort = computed(() =>
    this.lang.t(
      this.isVerbLesson() ? this.currentVerbMode().shortKey : this.currentDirection().shortKey,
    ),
  );
}
