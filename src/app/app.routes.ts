import { Routes } from '@angular/router';

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
  {
    path: 'import',
    title: 'route.import',
    loadComponent: () => import('./features/import-lesson/import-lesson').then((m) => m.ImportLesson),
  },
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
