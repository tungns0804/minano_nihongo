import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, RedirectFunction, Router } from '@angular/router';

import { exerciseInfo } from '../exercises/exercise.model';
import { PATH, exercisePath, idOfSlug, itemPath, legacyPathTarget } from '../paths';

/**
 * Đưa một đoạn URL "đúng bài nhưng sai cách viết" về đúng dạng chuẩn, thay vì mở bài
 * dưới hai địa chỉ khác nhau.
 *
 * Ví dụ: /ngu-phap/ngu-phap-minano-12 (gõ tay nguyên id) → /ngu-phap/bai-12. Hai địa
 * chỉ cho cùng một bài thì khối "Học tiếp" ghi thành hai dòng, và thẻ bài ngoài danh
 * sách không sáng "đang học" vì so đường dẫn không khớp.
 */
export function canonicalSlug(base: string): CanActivateFn {
  return (route) => {
    const slug = route.paramMap.get('slug') ?? '';
    const id = idOfSlug(base, slug);
    const canonical = base === PATH.exercises ? exercisePath(id) : itemPath(base, id);
    if (canonical === `${base}/${slug}`) return true;
    return inject(Router).createUrlTree([canonical], { queryParams: route.queryParams });
  };
}

/**
 * /luyen-tap/bai-tap/<id> gom hai thứ: bài tập cài trong mã nguồn (tự/tha động từ,
 * chuyển thể) mở bằng `ExerciseDetail`, và bài động từ / hội thoại tới từ dữ liệu mở
 * bằng `LessonDetail`. Route nào nhận là do id quyết định.
 */
export const isBuiltinExercise: CanMatchFn = (_route, segments) =>
  exerciseInfo(segments.at(-1)?.path ?? '') !== null;

/**
 * Đường dẫn không khớp route nào: đường dẫn kiểu cũ thì chuyển sang chỗ mới (giữ
 * nguyên query, ví dụ ?bai= của trang chữ Hán), còn lại về trang chủ.
 */
export const legacyRedirect: RedirectFunction = ({ url, queryParams }) => {
  const target = legacyPathTarget(`/${url.map((segment) => segment.path).join('/')}`);
  return inject(Router).createUrlTree([target ?? PATH.today], {
    queryParams: target ? queryParams : {},
  });
};
