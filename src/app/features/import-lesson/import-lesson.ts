import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { VERB_GROUP_LABEL_KEY, conjugate } from '../../core/japanese/conjugation';
import { LanguageStore } from '../../core/i18n/language-store';
import { T } from '../../core/i18n/t';
import {
  LESSON_KIND_UNIT_KEY,
  Lesson,
  LessonKind,
  VerbEntry,
  VocabularyWord,
} from '../../core/models/vocabulary.model';
import { FavoriteStore } from '../../core/services/favorite-store';
import { LessonStore } from '../../core/services/lesson-store';
import type { MessageKey } from '../../core/i18n/messages';
import {
  ParseIssue,
  ParseIssueCode,
  parseVerbList,
  parseVocabulary,
  slugify,
} from '../../core/utils/vocabulary-parser';

const PREVIEW_LIMIT = 8;

/** Mã lỗi của parser -> khoá thông điệp. */
const ISSUE_KEY: Record<ParseIssueCode, MessageKey> = {
  'missing-columns-vocabulary': 'parse.missingColumnsVocabulary',
  'missing-columns-verb': 'parse.missingColumnsVerb',
  'empty-columns': 'parse.emptyColumns',
  'not-masu': 'parse.notMasuForm',
  'bad-group': 'parse.badGroup',
  'duplicate-word': 'parse.duplicateWord',
  'duplicate-verb': 'parse.duplicateVerb',
  'bad-columns-conversation': 'parse.badColumnsConversation',
  'duplicate-sentence': 'parse.duplicateSentence',
};

/** Mã cột rỗng -> khoá tên cột. */
const COLUMN_KEY: Record<string, MessageKey> = {
  hanViet: 'parse.column.hanViet',
  japanese: 'parse.column.japanese',
  vietnamese: 'parse.column.vietnamese',
  masu: 'parse.column.masu',
  group: 'parse.column.group',
};

/** Dòng xem trước, dùng chung cho cả hai loại bài. */
interface PreviewRow {
  id: string;
  hanViet: string;
  japanese: string;
  /** Cách đọc, chỉ có ở bài từ vựng. */
  reading: string;
  vietnamese: string;
  /** Cột phụ chỉ có ở bài động từ: nhóm + các thể đã chia. */
  extra: string;
  /** Câu ví dụ, chỉ có ở bài từ vựng. */
  example: string;
  error: string | null;
}

@Component({
  selector: 'app-import-lesson',
  imports: [RouterLink, T],
  templateUrl: './import-lesson.html',
  styleUrl: './import-lesson.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportLesson {
  private readonly lessonStore = inject(LessonStore);
  private readonly favoriteStore = inject(FavoriteStore);
  private readonly lang = inject(LanguageStore);
  private readonly router = inject(Router);

  readonly t = this.lang.t.bind(this.lang);

  readonly kind = signal<LessonKind>('vocabulary');
  readonly lessonName = signal('');
  readonly rawText = signal('');
  readonly loadedFileName = signal<string | null>(null);
  readonly hasFileError = signal(false);

  readonly isVerb = computed(() => this.kind() === 'verb');

  // Phân tích riêng cho từng loại thay vì dùng chung một kiểu union — tránh phải
  // ép kiểu và đảm bảo đổi loại bài là kết quả cũ biến mất hẳn.
  private readonly vocabularyParsed = computed(() =>
    this.isVerb() ? { words: [], issues: [] } : parseVocabulary(this.rawText()),
  );

  private readonly verbParsed = computed(() =>
    this.isVerb() ? parseVerbList(this.rawText()) : { verbs: [], issues: [] },
  );

  readonly issues = computed<ParseIssue[]>(() =>
    this.isVerb() ? this.verbParsed().issues : this.vocabularyParsed().issues,
  );
  readonly errors = computed(() => this.issues().filter((i) => i.level === 'error'));
  readonly warnings = computed(() => this.issues().filter((i) => i.level === 'warning'));

  private readonly words = computed<VocabularyWord[]>(() => this.vocabularyParsed().words);
  private readonly verbs = computed<VerbEntry[]>(() => this.verbParsed().verbs);

  /** Động từ khai báo sai nhóm — chặn lưu để không lòi ra lúc luyện. */
  readonly brokenVerbs = computed(() =>
    this.verbs().flatMap((entry) => {
      const result = conjugate(entry.masu, entry.group);
      return result.ok ? [] : [{ entry, reason: result.reason }];
    }),
  );

  readonly rows = computed<PreviewRow[]>(() => {
    if (!this.isVerb()) {
      return this.words().map((word) => ({ ...word, extra: '', error: null }));
    }

    return this.verbs().map((entry) => {
      const result = conjugate(entry.masu, entry.group);
      return {
        id: entry.id,
        hanViet: entry.hanViet,
        japanese: entry.masu,
        reading: '',
        vietnamese: entry.vietnamese,
        example: '',
        extra: result.ok
          ? `${this.lang.t(VERB_GROUP_LABEL_KEY[entry.group])} · ${result.forms.dictionary} · ` +
            `${result.forms.te} · ${result.forms.ta} · ${result.forms.nai}`
          : '',
        error: result.ok ? null : result.reason,
      };
    });
  });

  /** Có ít nhất một câu ví dụ thì mới hiện cột ví dụ ở bảng xem trước. */
  readonly hasExamples = computed(() => this.rows().some((row) => row.example.length > 0));
  /** Tương tự cho cột cách đọc — bài không khai báo thì bảng giữ nguyên như cũ. */
  readonly hasReadings = computed(() => this.rows().some((row) => row.reading.length > 0));

  readonly validCount = computed(() => this.rows().length);
  readonly previewRows = computed(() => this.rows().slice(0, PREVIEW_LIMIT));
  readonly hiddenPreviewCount = computed(() => Math.max(0, this.rows().length - PREVIEW_LIMIT));

  readonly lessonId = computed(() => slugify(this.lessonName()));

  /** Bài đang tồn tại trùng id — để cảnh báo ghi đè hoặc che mất bài có sẵn. */
  readonly conflict = computed(() => {
    const id = this.lessonId();
    if (!id) return null;
    return this.lessonStore.summaries().find((lesson) => lesson.id === id) ?? null;
  });

  readonly canSave = computed(
    () => this.validCount() > 0 && this.lessonId().length > 0 && this.brokenVerbs().length === 0,
  );

  readonly customLessons = computed(() =>
    this.lessonStore.summaries().filter((lesson) => lesson.origin === 'custom'),
  );

  constructor() {
    void this.lessonStore.loadIndex();
  }

  setKind(kind: LessonKind): void {
    this.kind.set(kind);
  }

  /** Dịch thông báo lỗi của parser theo ngôn ngữ đang chọn. */
  issueText(issue: ParseIssue): string {
    if (issue.code === 'empty-columns') {
      const columns = (issue.params['columns'] ?? '')
        .split(',')
        .filter(Boolean)
        .map((code) => this.lang.t(COLUMN_KEY[code] ?? 'parse.column.hanViet'))
        .join(', ');
      return this.lang.t('parse.emptyColumns', { columns });
    }
    return this.lang.t(ISSUE_KEY[issue.code], issue.params);
  }

  onNameInput(event: Event): void {
    this.lessonName.set((event.target as HTMLInputElement).value);
  }

  onTextInput(event: Event): void {
    this.rawText.set((event.target as HTMLTextAreaElement).value);
    this.loadedFileName.set(null);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.hasFileError.set(false);
    try {
      const text = await file.text();
      this.rawText.set(text);
      this.loadedFileName.set(file.name);
      // Tên file gợi ý luôn loại bài, tiện khi kéo file verbs.txt vào.
      if (/^verbs?\./i.test(file.name)) this.kind.set('verb');
      if (!this.lessonName().trim()) {
        this.lessonName.set(file.name.replace(/\.[^.]+$/, ''));
      }
    } catch {
      this.hasFileError.set(true);
    } finally {
      input.value = '';
    }
  }

  clearAll(): void {
    this.rawText.set('');
    this.lessonName.set('');
    this.loadedFileName.set(null);
    this.hasFileError.set(false);
  }

  /** Lưu vào trình duyệt rồi mở luôn bài học vừa nạp. */
  save(): void {
    const lesson = this.buildLesson();
    if (!lesson) return;

    if (this.conflict()?.origin === 'builtin') {
      const ok = confirm(this.lang.t('import.confirmShadow', { id: lesson.id }));
      if (!ok) return;
    }

    this.lessonStore.saveCustomLesson(lesson);
    void this.router.navigate(['/lesson', lesson.id]);
  }

  /** Tải file JSON đúng định dạng để đặt vào `public/lessons/`. */
  downloadJson(): void {
    const lesson = this.buildLesson();
    if (!lesson) return;

    const { origin, ...fileContent } = lesson;
    void origin;

    const blob = new Blob([`${JSON.stringify(fileContent, null, 2)}\n`], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lesson.id}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  deleteCustomLesson(id: string, name: string): void {
    if (!confirm(this.lang.t('lesson.confirm.delete', { name }))) return;
    this.lessonStore.deleteCustomLesson(id);
    this.favoriteStore.clearLesson(id);
  }

  /** Khoá đếm số mục theo loại bài — dùng bảng có sẵn để không sót loại nào. */
  unitKeyOf(kind: LessonKind): MessageKey {
    return LESSON_KIND_UNIT_KEY[kind];
  }

  private buildLesson(): Lesson | null {
    const id = this.lessonId();
    if (!id || !this.canSave()) return null;

    const kind = this.kind();
    const words = kind === 'vocabulary' ? this.words() : [];
    const verbs = kind === 'verb' ? this.verbs() : [];

    return {
      id,
      name: this.lessonName().trim() || id,
      description: '',
      kind,
      itemCount: kind === 'verb' ? verbs.length : words.length,
      words,
      verbs,
      // Màn hình này mới chỉ nạp được từ vựng và động từ. Bài hội thoại thêm qua
      // thư mục data-source/ rồi chạy npm run generate.
      lines: [],
      origin: 'custom',
    };
  }
}
