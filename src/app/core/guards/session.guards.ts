import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PracticeSessionStore } from '../services/practice-session-store';

/**
 * Màn hình luyện tập chỉ vào được khi có phiên đang chạy. Tải lại trang giữa chừng
 * là mất phiên (cố ý — không lưu lịch sử), lúc đó đưa người dùng về trang chủ.
 */
export const practiceGuard: CanActivateFn = () => {
  const session = inject(PracticeSessionStore);
  const router = inject(Router);
  return session.isRunning() ? true : router.createUrlTree(['/']);
};

/** Màn hình kết quả chỉ vào được ngay sau khi vừa hoàn thành một phiên. */
export const resultGuard: CanActivateFn = () => {
  const session = inject(PracticeSessionStore);
  const router = inject(Router);
  return session.summary() !== null ? true : router.createUrlTree(['/']);
};
