import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { MessageKey } from '../i18n/messages';
import {
  ConversationLine,
  GrammarExample,
  GrammarPoint,
  GrammarTable,
  GrammarUsage,
  Lesson,
  LessonIndexEntry,
  LessonKind,
  LessonSummary,
  VerbEntry,
  VocabularyWord,
} from '../models/vocabulary.model';
import { readJson, writeJson } from './local-storage';

const CUSTOM_LESSONS_KEY = 'jp-practice:custom-lessons';
const LESSONS_BASE_PATH = 'lessons/';

/**
 * Id của thẻ <script type="application/json"> chứa sẵn toàn bộ bài học.
 * Chỉ bản build offline (npm run build:offline) mới nhúng thẻ này, để mở được bằng
 * file:// — nơi mà fetch() bị trình duyệt chặn vì lý do bảo mật.
 */
const EMBEDDED_LESSONS_ID = 'jp-embedded-lessons';

export type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Ghép đường dẫn tài nguyên theo <base href> để chạy đúng cả khi deploy vào thư mục con. */
function assetUrl(path: string): string {
  const base = typeof document !== 'undefined' && document.baseURI ? document.baseURI : '/';
  return new URL(path, base).href;
}

/**
 * Nguồn bài học của ứng dụng, gộp hai chỗ:
 *  - `public/lessons/*.json` do `npm run generate` sinh ra (origin = 'builtin')
 *  - bài do người dùng nạp qua giao diện, lưu ở localStorage (origin = 'custom')
 */
@Injectable({ providedIn: 'root' })
export class LessonStore {
  private readonly http = inject(HttpClient);

  private readonly builtinIndex = signal<LessonIndexEntry[]>([]);
  private readonly customLessons = signal<Lesson[]>(
    sanitizeLessons(readJson<unknown[]>(CUSTOM_LESSONS_KEY, [])),
  );

  /** Nội dung bài học đã tải, tránh gọi mạng lại khi quay lại cùng một bài. */
  private readonly loaded = new Map<string, Lesson>();
  private indexRequest: Promise<void> | null = null;

  readonly status = signal<LoadStatus>('idle');
  /** Khoá thông điệp lỗi, để hiển thị theo ngôn ngữ đang chọn. */
  readonly errorKey = signal<MessageKey | null>(null);

  /** Danh sách tóm tắt để hiển thị ngoài trang chủ: bài có sẵn trước, bài tự nạp sau. */
  readonly summaries = computed<LessonSummary[]>(() => [
    ...this.builtinIndex().map((entry) => ({
      id: entry.id,
      name: entry.name,
      description: entry.description ?? '',
      kind: entry.kind,
      itemCount: entry.itemCount,
      lessonNumber: entry.lessonNumber,
      origin: 'builtin' as const,
    })),
    ...this.customLessons().map((lesson) => ({
      id: lesson.id,
      name: lesson.name,
      description: lesson.description,
      kind: lesson.kind,
      itemCount: lesson.itemCount,
      origin: 'custom' as const,
    })),
  ]);

  readonly hasCustomLessons = computed(() => this.customLessons().length > 0);

  /** Tải `lessons/index.json`. Gọi nhiều lần chỉ thực sự chạy một lần. */
  loadIndex(force = false): Promise<void> {
    if (force) {
      this.indexRequest = null;
      this.loaded.clear();
    }
    this.indexRequest ??= this.fetchIndex();
    return this.indexRequest;
  }

  private async fetchIndex(): Promise<void> {
    this.status.set('loading');
    this.errorKey.set(null);

    // Bản offline đã có sẵn dữ liệu trong trang, không cần gọi mạng.
    const embedded = readEmbeddedLessons();
    if (embedded) {
      this.builtinIndex.set(
        embedded.map((lesson) => ({
          id: lesson.id,
          name: lesson.name,
          description: lesson.description,
          kind: lesson.kind,
          itemCount: lesson.itemCount,
          lessonNumber: lesson.lessonNumber,
          file: '',
        })),
      );
      for (const lesson of embedded) this.loaded.set(lesson.id, lesson);
      this.status.set('ready');
      return;
    }

    try {
      const file = await firstValueFrom(
        this.http.get<unknown>(assetUrl(`${LESSONS_BASE_PATH}index.json`)),
      );
      this.builtinIndex.set(sanitizeIndex(file));
      this.status.set('ready');
    } catch {
      this.builtinIndex.set([]);
      this.status.set('error');
      this.errorKey.set('error.lessonIndex');
      // Bài tự nạp vẫn dùng được nên không ném lỗi ra ngoài.
    }
  }

  /** Lấy bài học đầy đủ kèm từ vựng. Trả về null nếu không tìm thấy. */
  async getLesson(id: string): Promise<Lesson | null> {
    const findCustom = () => this.customLessons().find((lesson) => lesson.id === id) ?? null;

    const custom = findCustom();
    if (custom) return custom;

    const cached = this.loaded.get(id);
    if (cached) return cached;

    await this.loadIndex();

    // Bản offline nạp sẵn toàn bộ nội dung ngay khi dựng index.
    const afterLoad = this.loaded.get(id);
    if (afterLoad) return afterLoad;

    const entry = this.builtinIndex().find((item) => item.id === id);
    // Bài tự nạp có thể vừa được thêm sau khi index đã tải.
    if (!entry?.file) return findCustom();

    try {
      const raw = await firstValueFrom(
        this.http.get<unknown>(assetUrl(`${LESSONS_BASE_PATH}${entry.file}`)),
      );
      const lesson = sanitizeLesson(raw, 'builtin');
      if (!lesson) return null;
      this.loaded.set(id, lesson);
      return lesson;
    } catch {
      return null;
    }
  }

  /** Thêm mới hoặc ghi đè một bài học do người dùng nạp. */
  saveCustomLesson(lesson: Lesson): void {
    const normalized: Lesson = {
      ...lesson,
      origin: 'custom',
      itemCount: countItems(lesson),
    };
    const others = this.customLessons().filter((item) => item.id !== normalized.id);
    const next = [...others, normalized].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    this.customLessons.set(next);
    writeJson(CUSTOM_LESSONS_KEY, next);
  }

  deleteCustomLesson(id: string): void {
    const next = this.customLessons().filter((lesson) => lesson.id !== id);
    this.customLessons.set(next);
    writeJson(CUSTOM_LESSONS_KEY, next);
  }

  /** Id đã bị chiếm (kể cả bài có sẵn), dùng để cảnh báo khi nạp bài mới. */
  isIdTaken(id: string): boolean {
    return this.summaries().some((lesson) => lesson.id === id);
  }
}

const KNOWN_KINDS: readonly LessonKind[] = ['vocabulary', 'verb', 'conversation', 'grammar'];

function sanitizeKind(raw: unknown): LessonKind {
  return KNOWN_KINDS.includes(raw as LessonKind) ? (raw as LessonKind) : 'vocabulary';
}

/** Số mục của một bài, tuỳ loại mà đếm mảng nào. */
function countItems(
  lesson: Pick<Lesson, 'kind' | 'words' | 'verbs' | 'lines' | 'grammarPoints'>,
): number {
  if (lesson.kind === 'verb') return lesson.verbs.length;
  if (lesson.kind === 'conversation') return lesson.lines.length;
  // Bài ngữ pháp đếm theo số MẪU chứ không theo số câu ví dụ: "3 mẫu ngữ pháp" là
  // thứ người học nhìn vào để biết bài nặng hay nhẹ, còn số ví dụ chỉ là hệ quả.
  if (lesson.kind === 'grammar') return lesson.grammarPoints.length;
  return lesson.words.length;
}

function sanitizeIndex(raw: unknown): LessonIndexEntry[] {
  const lessons: unknown = (raw as { lessons?: unknown } | null)?.lessons;
  if (!Array.isArray(lessons)) return [];

  return lessons.flatMap((entry): LessonIndexEntry[] => {
    if (!entry || typeof entry !== 'object') return [];
    const { id, name, file, itemCount, description, kind, lessonNumber } = entry as Record<
      string,
      unknown
    >;
    if (typeof id !== 'string' || !id) return [];
    if (typeof file !== 'string' || !file) return [];
    return [
      {
        id,
        file,
        name: typeof name === 'string' && name ? name : id,
        description: typeof description === 'string' ? description : '',
        kind: sanitizeKind(kind),
        itemCount: typeof itemCount === 'number' ? itemCount : 0,
        // Bài cũ sinh trước khi có trường này thì đơn giản là không có cấp độ.
        ...(typeof lessonNumber === 'number' ? { lessonNumber } : {}),
      },
    ];
  });
}

function sanitizeWords(raw: unknown): VocabularyWord[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();

  return raw.flatMap((item): VocabularyWord[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, hanViet, japanese, reading, vietnamese, example } = item as Record<string, unknown>;
    if (
      typeof id !== 'string' ||
      typeof hanViet !== 'string' ||
      typeof japanese !== 'string' ||
      typeof vietnamese !== 'string'
    ) {
      return [];
    }
    if (!id || !hanViet || !japanese || !vietnamese || seen.has(id)) return [];
    seen.add(id);
    // Dữ liệu sinh trước khi có cột ví dụ / cách đọc thì thiếu trường tương ứng —
    // coi như rỗng thay vì loại bỏ cả từ, để bài tự nạp từ trước vẫn dùng được.
    return [
      {
        id,
        hanViet,
        japanese,
        reading: typeof reading === 'string' ? reading : '',
        vietnamese,
        example: typeof example === 'string' ? example : '',
      },
    ];
  });
}

function sanitizeVerbs(raw: unknown): VerbEntry[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();

  return raw.flatMap((item): VerbEntry[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, hanViet, masu, vietnamese, group, deceptive } = item as Record<string, unknown>;
    if (
      typeof id !== 'string' ||
      typeof hanViet !== 'string' ||
      typeof masu !== 'string' ||
      typeof vietnamese !== 'string'
    ) {
      return [];
    }
    if (group !== 1 && group !== 2 && group !== 3) return [];
    if (!id || !hanViet || !masu || !vietnamese || seen.has(id)) return [];
    seen.add(id);
    return [{ id, hanViet, masu, vietnamese, group, deceptive: deceptive === true }];
  });
}

function sanitizeLines(raw: unknown): ConversationLine[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();

  return raw.flatMap((item): ConversationLine[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, section, speaker, japanese, vietnamese } = item as Record<string, unknown>;
    if (typeof id !== 'string' || typeof japanese !== 'string' || typeof vietnamese !== 'string') {
      return [];
    }
    if (!id || !japanese || !vietnamese || seen.has(id)) return [];
    seen.add(id);
    // Tiêu đề nhóm và người nói đều tuỳ chọn — thiếu thì coi như rỗng.
    return [
      {
        id,
        section: typeof section === 'string' ? section : '',
        speaker: typeof speaker === 'string' ? speaker : '',
        japanese,
        vietnamese,
      },
    ];
  });
}

/** Danh sách chuỗi: bỏ phần tử không phải chuỗi và phần tử rỗng. */
function sanitizeTextList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function sanitizeGrammarTables(raw: unknown): GrammarTable[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item): GrammarTable[] => {
    if (!item || typeof item !== 'object') return [];
    const { caption, headers, rows } = item as Record<string, unknown>;
    if (!Array.isArray(rows)) return [];

    const parsedRows = rows
      .filter((row): row is unknown[] => Array.isArray(row))
      .map((row) => row.map((cell) => (typeof cell === 'string' ? cell : '')))
      .filter((row) => row.length > 0);
    if (parsedRows.length === 0) return [];

    // Tiêu đề cột giữ lại ô rỗng (bảng so sánh hay để trống ô góc), chỉ bỏ cả hàng
    // khi không ô nào có chữ — xem ghi chú cùng nội dung trong scripts/vocab-core.mjs.
    const parsedHeaders = Array.isArray(headers)
      ? headers.map((cell) => (typeof cell === 'string' ? cell : ''))
      : [];

    return [
      {
        caption: typeof caption === 'string' ? caption : '',
        headers: parsedHeaders.some((cell) => cell.length > 0) ? parsedHeaders : [],
        rows: parsedRows,
      },
    ];
  });
}

/**
 * Câu ví dụ của bài ngữ pháp. `seen` dùng chung cho cả bài (không phải từng cách
 * dùng) vì id là khoá của dấu ★ — hai câu trùng id thì bấm sao ở câu này sẽ sáng
 * luôn ở câu kia.
 */
function sanitizeGrammarExamples(raw: unknown, seen: Set<string>): GrammarExample[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item): GrammarExample[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, japanese, reading, vietnamese, note } = item as Record<string, unknown>;
    if (typeof id !== 'string' || typeof japanese !== 'string' || typeof vietnamese !== 'string') {
      return [];
    }
    if (!id || !japanese || !vietnamese || seen.has(id)) return [];
    seen.add(id);
    return [
      {
        id,
        japanese,
        reading: typeof reading === 'string' ? reading : '',
        vietnamese,
        note: typeof note === 'string' ? note : '',
      },
    ];
  });
}

function sanitizeGrammarUsages(raw: unknown, seen: Set<string>): GrammarUsage[] {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((item, index): GrammarUsage[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, title, detail, examples } = item as Record<string, unknown>;
    if (typeof title !== 'string' || !title) return [];

    const parsedExamples = sanitizeGrammarExamples(examples, seen);
    if (parsedExamples.length === 0) return [];

    return [
      {
        id: typeof id === 'string' && id ? id : `u${index + 1}`,
        title,
        detail: typeof detail === 'string' ? detail : '',
        examples: parsedExamples,
      },
    ];
  });
}

function sanitizeGrammarPoints(raw: unknown): GrammarPoint[] {
  if (!Array.isArray(raw)) return [];
  const seenPointIds = new Set<string>();
  const seenExampleIds = new Set<string>();

  return raw.flatMap((item): GrammarPoint[] => {
    if (!item || typeof item !== 'object') return [];
    const { id, title, summary, structures, explanation, notes, tables, usages } = item as Record<
      string,
      unknown
    >;
    if (typeof id !== 'string' || !id || typeof title !== 'string' || !title) return [];
    if (seenPointIds.has(id)) return [];

    const parsedUsages = sanitizeGrammarUsages(usages, seenExampleIds);
    // Mẫu không còn ví dụ nào thì không luyện được, và trang lý thuyết cũng trống —
    // bỏ hẳn còn hơn hiện ra một mục cụt.
    if (parsedUsages.length === 0) return [];
    seenPointIds.add(id);

    return [
      {
        id,
        title,
        summary: typeof summary === 'string' ? summary : '',
        structures: sanitizeTextList(structures),
        explanation: sanitizeTextList(explanation),
        notes: sanitizeTextList(notes),
        tables: sanitizeGrammarTables(tables),
        usages: parsedUsages,
      },
    ];
  });
}

function sanitizeLesson(raw: unknown, origin: Lesson['origin']): Lesson | null {
  if (!raw || typeof raw !== 'object') return null;
  const { id, name, description, words, verbs, lines, grammarPoints, kind, lessonNumber } =
    raw as Record<string, unknown>;
  if (typeof id !== 'string' || !id) return null;

  const lessonKind = sanitizeKind(kind);
  const parsedWords = lessonKind === 'vocabulary' ? sanitizeWords(words) : [];
  const parsedVerbs = lessonKind === 'verb' ? sanitizeVerbs(verbs) : [];
  const parsedLines = lessonKind === 'conversation' ? sanitizeLines(lines) : [];
  const parsedPoints = lessonKind === 'grammar' ? sanitizeGrammarPoints(grammarPoints) : [];
  const itemCount = countItems({
    kind: lessonKind,
    words: parsedWords,
    verbs: parsedVerbs,
    lines: parsedLines,
    grammarPoints: parsedPoints,
  });
  if (itemCount === 0) return null;

  return {
    id,
    name: typeof name === 'string' && name ? name : id,
    description: typeof description === 'string' ? description : '',
    kind: lessonKind,
    itemCount,
    ...(typeof lessonNumber === 'number' ? { lessonNumber } : {}),
    words: parsedWords,
    verbs: parsedVerbs,
    lines: parsedLines,
    grammarPoints: parsedPoints,
    origin,
  };
}

function sanitizeLessons(raw: unknown, origin: Lesson['origin'] = 'custom'): Lesson[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item) => {
    const lesson = sanitizeLesson(item, origin);
    return lesson ? [lesson] : [];
  });
}

/** Đọc dữ liệu bài học nhúng sẵn trong index.html của bản build offline. */
function readEmbeddedLessons(): Lesson[] | null {
  if (typeof document === 'undefined') return null;

  const element = document.getElementById(EMBEDDED_LESSONS_ID);
  const content = element?.textContent?.trim();
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as { lessons?: unknown };
    const lessons = sanitizeLessons(parsed?.lessons, 'builtin');
    return lessons.length > 0 ? lessons : null;
  } catch {
    return null;
  }
}
