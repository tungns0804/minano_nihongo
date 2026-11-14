import { Routes } from '@angular/router';

import { loadGrammarBook } from './core/exercises/grammar-books';
import { IMPORT_LESSON_ENABLED } from './core/feature-flags';
import { canonicalSlug, isBuiltinExercise, legacyRedirect } from './core/guards/path.guards';
import { practiceGuard, resultGuard } from './core/guards/session.guards';
import { PATH } from './core/paths';

/**
 * Đường dẫn lấy từ `PATH` (core/paths.ts) — quy tắc đặt tên và lý do nằm ở đó. Ở đây
 * chỉ bỏ dấu / đầu vì route của Angular viết không có nó.
 *
 * `title` là KHOÁ thông điệp, không phải chữ hiển thị. `AppTitleStrategy` dịch khoá
 * này rồi ghép với tên ứng dụng, và đặt lại mỗi khi đổi ngôn ngữ. Ở trang bài, tên bài
 * thay cho khoá này khi dữ liệu về (`PageLabel`).
 *
 * Router lấy route khớp ĐẦU TIÊN theo thứ tự khai, nên trang cố định luôn khai trước
 * trang `:slug` cùng nhánh: /tu-vung/chu-de trước /tu-vung/:slug, /kanji/bo-thu trước
 * /kanji/:id.
 */
const r = (path: string) => path.slice(1);

export const routes: Routes = [
  // ── Hôm nay ───────────────────────────────────────────────────────────────
  {
    // Trang chủ là trang Hôm nay. Không đặt title để tab hiện đúng tên ứng dụng.
    path: r(PATH.today),
    pathMatch: 'full',
    loadComponent: () => import('./features/today/today').then((m) => m.Today),
  },
  // Trang "Ôn tập": lịch ôn ngắt quãng và sổ lỗi sai, gom từ mọi khu đã luyện. Không
  // thuộc khu nội dung nào nên nằm ở nhóm Hôm nay — xem `core/review/review.model.ts`.
  {
    path: r(PATH.review),
    title: 'route.review',
    loadComponent: () => import('./features/review/review').then((m) => m.Review),
  },
  // Tab "Tiến độ N3" là khu ĐO ĐẠC chứ không phải khu nội dung: nó nói về toàn bộ các
  // khu kia, cộng thêm ba quyển 総まとめ chưa nạp vào app mà vẫn phải học trên sách.
  {
    path: r(PATH.n3),
    title: 'route.n3',
    loadComponent: () => import('./features/n3-progress/n3-progress').then((m) => m.N3Progress),
  },

  // ── Từ vựng ───────────────────────────────────────────────────────────────
  {
    path: r(PATH.vocab),
    title: 'route.vocab',
    loadComponent: () => import('./features/lesson-list/lesson-list').then((m) => m.LessonList),
  },
  // Màn hình "Nạp bài mới" đang tắt (xem core/feature-flags.ts). Không đăng ký route
  // chứ không chỉ ẩn mục menu: ẩn menu thôi thì gõ thẳng đường dẫn vẫn vào được màn
  // hình mà giao diện đang cố tình không dẫn tới.
  ...(IMPORT_LESSON_ENABLED
    ? [
        {
          path: r(PATH.importLesson),
          title: 'route.import',
          loadComponent: () =>
            import('./features/import-lesson/import-lesson').then((m) => m.ImportLesson),
        },
      ]
    : []),
  // "Từ vựng theo chủ đề": cùng NỘI DUNG với bài từ vựng, chỉ khác cách gom — theo chủ
  // đề thay vì theo số bài. Màn hình chi tiết dùng lại thẳng `LessonDetail`: chủ đề là
  // một `Lesson` đầy đủ (xem `core/topics/`), chỉ mang `kind: 'topic'`.
  {
    path: r(PATH.topics),
    title: 'route.topic',
    loadComponent: () => import('./features/topic-list/topic-list').then((m) => m.TopicList),
  },
  {
    path: `${r(PATH.topics)}/:slug`,
    title: 'route.topicDetail',
    data: { base: PATH.topics },
    loadComponent: () =>
      import('./features/lesson-detail/lesson-detail').then((m) => m.LessonDetail),
  },
  {
    path: `${r(PATH.vocab)}/:slug`,
    title: 'route.lesson',
    data: { base: PATH.vocab },
    canActivate: [canonicalSlug(PATH.vocab)],
    loadComponent: () =>
      import('./features/lesson-detail/lesson-detail').then((m) => m.LessonDetail),
  },

  // ── Ngữ pháp ──────────────────────────────────────────────────────────────
  // Bài ngữ pháp có màn hình riêng chứ không dùng `LessonDetail`: nội dung của nó là
  // một trang lý thuyết có phân cấp, không phải bảng dữ liệu.
  {
    path: r(PATH.grammar),
    title: 'route.grammar',
    loadComponent: () => import('./features/grammar-list/grammar-list').then((m) => m.GrammarList),
  },
  // Mỗi "sách ngữ pháp" (core/exercises/grammar-books.ts) dùng chung màn hình
  // `N4Grammar`; `resolve.book` nạp đúng gói dữ liệu của sách đó trước khi mở.
  {
    path: r(PATH.vnjpclub),
    title: 'route.vnjpclub',
    resolve: { book: () => loadGrammarBook('ngu-phap-vnjpclub') },
    loadComponent: () => import('./features/n4-grammar/n4-grammar').then((m) => m.N4Grammar),
  },
  {
    path: `${r(PATH.grammar)}/:slug`,
    title: 'route.grammarLesson',
    canActivate: [canonicalSlug(PATH.grammar)],
    loadComponent: () =>
      import('./features/grammar-detail/grammar-detail').then((m) => m.GrammarDetail),
  },

  // ── Kanji ─────────────────────────────────────────────────────────────────
  // Một CHỮ gom từ của rất nhiều bài lại chứ không thuộc bài nào, nên khu này không
  // xếp vào lưới bài học được. Khu Bộ thủ đi cùng lối, chỉ ngược chiều học (từ bộ thủ
  // ra chữ thay vì từ chữ ra từ) — nên nó là tab con của Kanji.
  {
    path: r(PATH.radicals),
    title: 'route.radical',
    loadComponent: () => import('./features/radical-list/radical-list').then((m) => m.RadicalList),
  },
  {
    path: `${r(PATH.radicals)}/:id`,
    title: 'route.radicalDetail',
    loadComponent: () =>
      import('./features/radical-detail/radical-detail').then((m) => m.RadicalDetail),
  },
  // Trắc nghiệm Kanji theo bài (N5 · Bài 17…) — khai trước /kanji/:id như /kanji/bo-thu.
  {
    path: r(PATH.kanjiQuiz),
    title: 'route.kanjiQuiz',
    loadComponent: () => import('./features/kanji-quiz/kanji-quiz').then((m) => m.KanjiQuiz),
  },
  // Bảng chữ bài giảng — âm On / Kun, Hán Việt, viết chữ. Cũng phải đứng trước /kanji/:id.
  {
    path: r(PATH.kanjiOnKun),
    title: 'route.kanjiOnKun',
    loadComponent: () => import('./features/kanji-onkun/kanji-onkun').then((m) => m.KanjiOnKun),
  },
  {
    path: r(PATH.kanji),
    title: 'route.kanji',
    loadComponent: () => import('./features/kanji-list/kanji-list').then((m) => m.KanjiList),
  },
  {
    path: `${r(PATH.kanji)}/:id`,
    title: 'route.kanjiDetail',
    loadComponent: () =>
      import('./features/kanji-detail/kanji-detail').then((m) => m.KanjiDetail),
  },

  // ── Luyện tập ─────────────────────────────────────────────────────────────
  { path: r(PATH.practiceGroup), pathMatch: 'full', redirectTo: PATH.translate },
  // "Luyện dịch" đi song song 50 bài ngữ pháp: mỗi bài vài bài nhỏ, mỗi câu kết hợp
  // ngữ pháp bài đó với ngữ pháp các bài trước.
  {
    path: r(PATH.translate),
    title: 'route.translate',
    loadComponent: () =>
      import('./features/translation-list/translation-list').then((m) => m.TranslationList),
  },
  {
    path: `${r(PATH.translate)}/:slug`,
    title: 'route.translateLesson',
    canActivate: [canonicalSlug(PATH.translate)],
    loadComponent: () =>
      import('./features/translation-detail/translation-detail').then((m) => m.TranslationDetail),
  },
  // "Bài tập bổ trợ": bài cài sẵn trong mã nguồn (core/exercises/) gom động từ của
  // nhiều bài lẫn nhiều cấp theo một chủ đề ngữ pháp, cộng bài động từ / hội thoại.
  {
    path: r(PATH.exercises),
    title: 'route.exercise',
    loadComponent: () =>
      import('./features/exercise-list/exercise-list').then((m) => m.ExerciseList),
  },
  // "Số đếm & trợ số từ" có màn hình riêng: trên đầu là quy tắc ghi nhớ và bảng biến
  // âm, bảng tra chia theo từng trợ số từ — không phải bảng động từ.
  {
    path: r(PATH.counters),
    title: 'route.counters',
    loadComponent: () =>
      import('./features/counter-exercise/counter-exercise').then((m) => m.CounterExercise),
  },
  {
    path: `${r(PATH.exercises)}/:slug`,
    title: 'route.exerciseDetail',
    canMatch: [isBuiltinExercise],
    canActivate: [canonicalSlug(PATH.exercises)],
    loadComponent: () =>
      import('./features/exercise-detail/exercise-detail').then((m) => m.ExerciseDetail),
  },
  // Bài chia động từ và bài dịch hội thoại tới từ dữ liệu, nên mở bằng màn hình bài học.
  {
    path: `${r(PATH.exercises)}/:slug`,
    title: 'route.lesson',
    data: { base: PATH.exercises },
    canActivate: [canonicalSlug(PATH.exercises)],
    loadComponent: () =>
      import('./features/lesson-detail/lesson-detail').then((m) => m.LessonDetail),
  },
  // Luyện tập ngữ pháp N4: trang lý thuyết dài kèm câu ví dụ, luyện theo lộ trình năm bậc.
  {
    path: r(PATH.n4grammar),
    title: 'route.n4grammar',
    resolve: { book: () => loadGrammarBook('ngu-phap-n4') },
    loadComponent: () => import('./features/n4-grammar/n4-grammar').then((m) => m.N4Grammar),
  },
  // Luyện tập ngữ pháp N3: cùng màn hình với N4, dữ liệu là tài liệu "Tổng hợp ngữ pháp N3".
  {
    path: r(PATH.n3grammar),
    title: 'route.n3grammar',
    resolve: { book: () => loadGrammarBook('ngu-phap-n3') },
    loadComponent: () => import('./features/n4-grammar/n4-grammar').then((m) => m.N4Grammar),
  },
  // Đề luyện N4 · 直前対策: chọn phần, dạng câu và đề của một quyển sách luyện thi.
  {
    path: r(PATH.taisaku),
    title: 'route.taisaku',
    loadComponent: () => import('./features/taisaku-n4/taisaku-n4').then((m) => m.TaisakuN4),
  },

  // ── Phiên luyện ───────────────────────────────────────────────────────────
  {
    path: r(PATH.session),
    title: 'route.practice',
    canActivate: [practiceGuard],
    loadComponent: () => import('./features/practice/practice').then((m) => m.Practice),
  },
  {
    path: r(PATH.result),
    title: 'route.result',
    canActivate: [resultGuard],
    loadComponent: () => import('./features/result/result').then((m) => m.Result),
  },

  // Đường dẫn kiểu cũ (/lesson/…, /grammar/…) chuyển sang chỗ mới; còn lại về trang chủ.
  { path: '**', redirectTo: legacyRedirect },
];
