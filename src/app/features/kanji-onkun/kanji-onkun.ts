import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageStore } from '../../core/i18n/language-store';
import { BOARD_EXAMPLES, KANJI_BOARDS, KANJI_BOARD_ID } from '../../core/kanji/kanji-boards.data';
import type { RawKanjiBoard } from '../../core/kanji/kanji-boards.data';
import type { LessonKanji } from '../../core/kanji/onkun.model';
import { pathOf } from '../../core/paths';
import { readJson, writeJson } from '../../core/services/local-storage';
import { RecentStore } from '../../core/services/recent-store';
import { checkedOf } from '../../core/utils/dom-events';
import { KanjiStudy, StudyTarget } from '../../shared/kanji-study';

const STORAGE_KEY = 'jp-practice:kanji-onkun';

/** Lựa chọn nhớ lại giữa hai lần mở trang — quay về từ màn kết quả vẫn đúng bảng đang học. */
interface Saved {
  boards: number[];
  markedOnly: boolean;
}

function restore(): Saved {
  const raw = readJson<Partial<Saved> | null>(STORAGE_KEY, null);
  const valid = new Set(KANJI_BOARDS.map((board) => board.board));
  const boards = (Array.isArray(raw?.boards) ? raw.boards : []).filter((board) => valid.has(board));
  return {
    // Mặc định bảng đầu: bài giảng đi từ bảng 1.
    boards: boards.length > 0 ? boards : [KANJI_BOARDS[0].board],
    markedOnly: raw?.markedOnly === true,
  };
}

/**
 * Tab Kanji › Âm On/Kun: chữ trên bảng của bài giảng (`kanji-boards.data.ts`), học âm On,
 * âm Kun, âm Hán Việt và viết chữ.
 *
 * Trang này chỉ lo CHỌN chữ (bảng nào, chỉ chữ tô vàng hay cả bảng); thẻ học và khung
 * luyện là `KanjiStudy`, dùng chung với khối "Chữ Hán trong bài" của bài từ vựng N3.
 * Phiên luyện mang id bài tập `am-on-kun`, nên màn kết quả quay về đúng trang này.
 */
@Component({
  selector: 'app-kanji-onkun',
  imports: [KanjiStudy],
  templateUrl: './kanji-onkun.html',
  styleUrl: './kanji-onkun.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanjiOnKun {
  private readonly lang = inject(LanguageStore);
  readonly t = this.lang.t.bind(this.lang);

  readonly boards = KANJI_BOARDS;
  private readonly saved = restore();
  readonly selected = signal<number[]>(this.saved.boards);
  readonly markedOnly = signal(this.saved.markedOnly);

  /** Thẻ của mọi chữ trên mọi bảng, theo thứ tự bảng; rỗng cho tới khi kho chữ nạp xong. */
  private readonly cards = signal<readonly LessonKanji[]>([]);
  private readonly boardOf = new Map<string, number>(
    KANJI_BOARDS.flatMap((board) => [...board.chars].map((char) => [char, board.board] as const)),
  );
  readonly loading = computed(() => this.cards().length === 0);

  readonly target = computed<StudyTarget>(() => ({
    id: KANJI_BOARD_ID,
    name: this.lang.t('onkunBoard.name'),
    kind: 'exercise',
  }));

  /** Chữ của các bảng đang chọn, cả bảng — trước khi lọc "chỉ chữ tô vàng". */
  private readonly inBoards = computed(() => {
    const wanted = new Set(this.selected());
    return this.cards().filter((card) => wanted.has(this.boardOf.get(card.char) ?? 0));
  });
  readonly markedCount = computed(() => this.inBoards().filter((card) => card.marked).length);
  readonly visible = computed(() =>
    this.markedOnly() ? this.inBoards().filter((card) => card.marked) : this.inBoards(),
  );

  readonly totalChars = KANJI_BOARDS.reduce((sum, board) => sum + [...board.chars].length, 0);

  constructor() {
    inject(RecentStore).record({
      path: pathOf(inject(Router).url),
      title: this.lang.t('onkunBoard.name'),
      titleKey: 'onkunBoard.name',
      kindKey: 'kind.exercise',
    });
    void this.load();
  }

  /**
   * Nạp ĐỘNG kho chữ (~300 kB) và bảng âm On / Kun (~73 kB) — như khối chữ của bài N3 —
   * rồi dựng thẻ cho cả 300 chữ một lần: chọn bảng sau đó chỉ là lọc lại.
   */
  private async load(): Promise<void> {
    const [{ kanjiByChar }, { boardKanjiOf }] = await Promise.all([
      import('../../core/kanji/kanji-entries'),
      import('../../core/kanji/onkun-study'),
    ]);
    const cells = KANJI_BOARDS.flatMap((board) =>
      [...board.chars].flatMap((char) => {
        const entry = kanjiByChar(char);
        // `verify:kanji-readings` bắt chữ không có ở khu Kanji; ở đây chỉ phòng hờ.
        return entry
          ? [{ entry, examples: BOARD_EXAMPLES[char] ?? [], marked: board.marked.includes(char) }]
          : [];
      }),
    );
    this.cards.set(boardKanjiOf(cells));
  }

  boardLabel(board: RawKanjiBoard): string {
    const chars = [...board.chars];
    return this.t('onkunBoard.board', {
      board: board.board,
      preview: chars.slice(0, 3).join(''),
      count: chars.length,
    });
  }

  isSelected(board: RawKanjiBoard): boolean {
    return this.selected().includes(board.board);
  }

  allSelected(): boolean {
    return this.selected().length === KANJI_BOARDS.length;
  }

  toggleBoard(board: RawKanjiBoard): void {
    const current = this.selected();
    // Luôn còn ít nhất một bảng: bỏ hết thì trang trống mà không rõ vì sao.
    if (current.includes(board.board) && current.length === 1) return;
    const next = current.includes(board.board)
      ? current.filter((item) => item !== board.board)
      : [...current, board.board];
    // Giữ thứ tự bảng để thẻ chữ đi đúng thứ tự bài giảng, không theo thứ tự bấm.
    this.selected.set(KANJI_BOARDS.map((item) => item.board).filter((item) => next.includes(item)));
    this.save();
  }

  selectAll(): void {
    this.selected.set(KANJI_BOARDS.map((board) => board.board));
    this.save();
  }

  toggleMarkedOnly(event: Event): void {
    this.markedOnly.set(checkedOf(event));
    this.save();
  }

  private save(): void {
    writeJson(STORAGE_KEY, { boards: this.selected(), markedOnly: this.markedOnly() } satisfies Saved);
  }
}
