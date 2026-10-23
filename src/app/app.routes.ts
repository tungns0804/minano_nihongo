import { Routes } from '@angular/router';

import { IMPORT_LESSON_ENABLED } from './core/feature-flags';
import { practiceGuard, resultGuard } from './core/guards/session.guards';

/**
 * `title` ở đây là KHOÁ thông điệp, không phải chữ hiển thị.
 * `AppTitleStrategy` dịch khoá này rồi ghép với tên ứng dụng, và đặt lại mỗi khi
 * đổi ngôn ngữ.
 */
export const routes: Routes = [
  {
    // Trang chủ là trang Hôm nay. Không đặt title để tab hiện đúng tên ứng dụng.
    path: '',
    loadComponent: () => import('./features/today/today').then((m) => m.Today),
  },
  {
    // Danh sách bài từ vựng từng là trang chủ; nhường "/" cho trang Hôm nay.
    path: 'vocab',
    title: 'route.vocab',
    loadComponent: () => import('./features/lesson-list/lesson-list').then((m) => m.LessonList),
  },
  // Màn hình "Nạp bài mới" đang tắt (xem core/feature-flags.ts). Không đăng ký route
  // chứ không chỉ ẩn mục menu: ẩn menu thôi thì gõ thẳng /import vào thanh địa chỉ
  // vẫn vào được màn hình mà giao diện đang cố tình không dẫn tới. Route `**` ở cuối
  // sẽ đưa đường dẫn đó về trang chủ.
  ...(IMPORT_LESSON_ENABLED
    ? [
        {
          path: 'import',
          title: 'route.import',
          loadComponent: () =>
            import('./features/import-lesson/import-lesson').then((m) => m.ImportLesson),
        },
      ]
    : []),
  {
    path: 'lesson/:id',
    title: 'route.lesson',
    loadComponent: () => import('./features/lesson-detail/lesson-detail').then((m) => m.LessonDetail),
  },
  // Khu "Từ vựng theo chủ đề": cùng NỘI DUNG với bài từ vựng ngoài trang chủ,
  // chỉ khác cách gom — theo chủ đề thay vì theo số bài. Vì thế màn hình chi tiết
  // dùng lại thẳng `LessonDetail`: chủ đề là một `Lesson` đầy đủ (xem
  // `core/topics/`), chỉ mang `kind: 'topic'`. Có đường dẫn riêng `/topic/:id`
  // chứ không mượn `/lesson/:id` để địa chỉ nói đúng thứ đang mở, và để nút quay
  // lại đưa về đúng lưới chủ đề.
  {
    path: 'topic',
    title: 'route.topic',
    loadComponent: () => import('./features/topic-list/topic-list').then((m) => m.TopicList),
  },
  {
    path: 'topic/:id',
    title: 'route.topicDetail',
    loadComponent: () =>
      import('./features/lesson-detail/lesson-detail').then((m) => m.LessonDetail),
  },
  // Tab "Tiến độ N3" đứng riêng vì nó không phải một khu nội dung mà là một khu
  // ĐO ĐẠC: nó nói về toàn bộ các khu kia, cộng thêm ba quyển 総まとめ chưa nạp vào
  // app mà vẫn phải học trên sách. Không có bài học nào tới từ route này.
  {
    path: 'n3',
    title: 'route.n3',
    loadComponent: () => import('./features/n3-progress/n3-progress').then((m) => m.N3Progress),
  },
  // Trang "Ôn tập": lịch ôn ngắt quãng và sổ lỗi sai, gom từ mọi khu đã luyện. Không
  // thuộc khu nội dung nào nên đứng riêng — xem `core/review/review.model.ts`.
  {
    path: 'review',
    title: 'route.review',
    loadComponent: () => import('./features/review/review').then((m) => m.Review),
  },
  // Bài ngữ pháp có nhánh riêng chứ không đi chung `lesson/:id`: nội dung của nó là
  // một trang lý thuyết có phân cấp, không phải bảng dữ liệu như ba loại bài kia.
  {
    path: 'grammar',
    title: 'route.grammar',
    loadComponent: () => import('./features/grammar-list/grammar-list').then((m) => m.GrammarList),
  },
  {
    path: 'grammar/:id',
    title: 'route.grammarLesson',
    loadComponent: () =>
      import('./features/grammar-detail/grammar-detail').then((m) => m.GrammarDetail),
  },
  // Khu "Luyện dịch" đi song song 50 bài ngữ pháp: mỗi bài vài bài nhỏ, mỗi câu kết
  // hợp ngữ pháp bài đó với ngữ pháp các bài trước. Nhánh riêng vì nội dung là các bài
  // nhỏ kèm ngữ pháp từng câu, không phải bảng phẳng của `lesson/:id`.
  {
    path: 'translate',
    title: 'route.translate',
    loadComponent: () =>
      import('./features/translation-list/translation-list').then((m) => m.TranslationList),
  },
  {
    path: 'translate/:id',
    title: 'route.translateLesson',
    loadComponent: () =>
      import('./features/translation-detail/translation-detail').then((m) => m.TranslationDetail),
  },
  // Khu "Bài tập" cũng có nhánh riêng, cùng lý do với ngữ pháp: nội dung của nó
  // không tới từ file bài học nào mà cài sẵn trong mã nguồn (core/exercises/), và
  // nó gom động từ của nhiều bài lẫn nhiều cấp theo một chủ đề ngữ pháp.
  {
    path: 'exercise',
    title: 'route.exercise',
    loadComponent: () =>
      import('./features/exercise-list/exercise-list').then((m) => m.ExerciseList),
  },
  // Bài "Luyện tập ngữ pháp N4" nằm cùng khu nhưng có màn hình riêng: nội dung là trang
  // lý thuyết dài kèm câu ví dụ, không phải bảng động từ như hai bài tập kia. Khai TRƯỚC
  // `exercise/:id` vì router lấy đường dẫn khớp đầu tiên theo thứ tự khai.
  {
    path: 'exercise/ngu-phap-n4',
    title: 'route.n4grammar',
    loadComponent: () => import('./features/n4-grammar/n4-grammar').then((m) => m.N4Grammar),
  },
  {
    path: 'exercise/:id',
    title: 'route.exerciseDetail',
    loadComponent: () =>
      import('./features/exercise-detail/exercise-detail').then((m) => m.ExerciseDetail),
  },
  // Khu "Kanji" cũng có nhánh riêng: một CHỮ gom từ của rất nhiều bài lại chứ
  // không thuộc bài nào, nên không xếp vào được lưới bài học ngoài trang chủ.
  {
    path: 'kanji',
    title: 'route.kanji',
    loadComponent: () => import('./features/kanji-list/kanji-list').then((m) => m.KanjiList),
  },
  {
    path: 'kanji/:id',
    title: 'route.kanjiDetail',
    loadComponent: () =>
      import('./features/kanji-detail/kanji-detail').then((m) => m.KanjiDetail),
  },
  // Khu "Bộ thủ" đi cùng lối với khu Kanji, chỉ ngược chiều học: từ bộ thủ ra chữ
  // thay vì từ chữ ra từ. Cũng không xếp vào lưới bài học ngoài trang chủ được.
  {
    path: 'radical',
    title: 'route.radical',
    loadComponent: () => import('./features/radical-list/radical-list').then((m) => m.RadicalList),
  },
  {
    path: 'radical/:id',
    title: 'route.radicalDetail',
    loadComponent: () =>
      import('./features/radical-detail/radical-detail').then((m) => m.RadicalDetail),
  },
  {
    path: 'practice',
    title: 'route.practice',
    canActivate: [practiceGuard],
    loadComponent: () => import('./features/practice/practice').then((m) => m.Practice),
  },
  {
    path: 'result',
    title: 'route.result',
    canActivate: [resultGuard],
    loadComponent: () => import('./features/result/result').then((m) => m.Result),
  },
  { path: '**', redirectTo: '' },
];
