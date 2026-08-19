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
    // Trang chủ không đặt title để tab hiện đúng tên ứng dụng.
    path: '',
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
  // Khu "Bài tập" cũng có nhánh riêng, cùng lý do với ngữ pháp: nội dung của nó
  // không tới từ file bài học nào mà cài sẵn trong mã nguồn (core/exercises/), và
  // nó gom động từ của nhiều bài lẫn nhiều cấp theo một chủ đề ngữ pháp.
  {
    path: 'exercise',
    title: 'route.exercise',
    loadComponent: () =>
      import('./features/exercise-list/exercise-list').then((m) => m.ExerciseList),
  },
  {
    path: 'exercise/:id',
    title: 'route.exerciseDetail',
    loadComponent: () =>
      import('./features/exercise-detail/exercise-detail').then((m) => m.ExerciseDetail),
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
