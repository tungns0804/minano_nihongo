#!/usr/bin/env node
/**
 * Kiểm tra cách đếm lượt luyện của từng bài (src/app/core/activity/practice-history.model.ts).
 *
 * Con số "Đã luyện N lượt" là thứ người học nhìn mỗi lần mở bài để biết mình đã ôn
 * bài này kỹ tới đâu — đếm dư (một lượt rỗng, một ngày tính hai lần) hay mất hết sau
 * một lần dữ liệu hỏng là mất lòng tin ngay. Mỗi quy tắc ở đầu file model có một ca ở đây.
 *
 * Chạy: npm run verify:history
 */

import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { c, log as print } from './script-utils.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODEL = join(HERE, '..', 'src', 'app', 'core', 'activity', 'practice-history.model.ts');
const { daysSince, recordSession, sanitizeHistory } = await import(pathToFileURL(MODEL));

let checks = 0;
const problems = [];
function expect(name, actual, expected) {
  checks++;
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`${name}: mong đợi ${JSON.stringify(expected)}, nhận ${JSON.stringify(actual)}`);
  }
}

const TODAY = 20_000;
const LESSON = 'minano-nihongo-33';

// 1. Lượt đầu tiên.
let history = recordSession({}, LESSON, TODAY, 20, 15);
expect('lượt đầu', history[LESSON], { sessions: 1, questions: 20, correct: 15, days: 1, lastDay: TODAY });

// 2. Lượt thứ hai cùng ngày: thêm lượt, thêm câu, KHÔNG thêm ngày.
history = recordSession(history, LESSON, TODAY, 5, 5);
expect('cùng ngày', history[LESSON], { sessions: 2, questions: 25, correct: 20, days: 1, lastDay: TODAY });

// 3. Hôm sau luyện tiếp: thêm một ngày.
history = recordSession(history, LESSON, TODAY + 1, 10, 8);
expect('hôm sau', history[LESSON], { sessions: 3, questions: 35, correct: 28, days: 2, lastDay: TODAY + 1 });

// 4. Mỗi bài đếm riêng.
history = recordSession(history, 'n3-danh-tu-1', TODAY + 1, 50, 40);
expect('bài khác không đụng bài cũ', history[LESSON].sessions, 3);
expect('bài khác có lượt riêng', history['n3-danh-tu-1'].sessions, 1);

// 5. Phiên rỗng hay id rỗng thì không phải một lượt — trả lại đúng object cũ.
expect('phiên 0 câu', recordSession(history, LESSON, TODAY + 2, 0, 0) === history, true);
expect('id rỗng', recordSession(history, '', TODAY + 2, 10, 10) === history, true);

// 6. Số câu đúng không vượt số câu.
expect('đúng không vượt tổng', recordSession({}, LESSON, TODAY, 3, 9)[LESSON].correct, 3);

// 7. Không sửa object cũ (signal so sánh theo tham chiếu).
const before = JSON.stringify(history);
recordSession(history, LESSON, TODAY + 5, 10, 10);
expect('bất biến', JSON.stringify(history), before);

// 8. "Gần nhất" tính theo ngày, không âm khi đồng hồ máy lùi.
expect('hôm nay', daysSince(history[LESSON], TODAY + 1), 0);
expect('hôm qua', daysSince(history[LESSON], TODAY + 2), 1);
expect('đồng hồ lùi', daysSince(history[LESSON], TODAY - 3), 0);

// 9. Đọc lại từ localStorage: giữ dòng đúng, bỏ dòng hỏng, không sập vì rác.
expect('rác', sanitizeHistory('abc'), {});
expect('mảng', sanitizeHistory([1, 2]), {});
expect('null', sanitizeHistory(null), {});
expect('khứ hồi', sanitizeHistory(JSON.parse(JSON.stringify(history))), history);
expect(
  'bỏ dòng hỏng, giữ dòng đúng',
  sanitizeHistory({
    good: { sessions: 2, questions: 10, correct: 7, days: 1, lastDay: TODAY },
    zero: { sessions: 0, questions: 0, correct: 0, days: 0, lastDay: TODAY },
    text: { sessions: '2', questions: 10, correct: 7, days: 1, lastDay: TODAY },
    negative: { sessions: 2, questions: -1, correct: 0, days: 1, lastDay: TODAY },
    noDay: { sessions: 2, questions: 10, correct: 7, days: 1 },
  }),
  { good: { sessions: 2, questions: 10, correct: 7, days: 1, lastDay: TODAY } },
);
expect(
  'kẹp số ngày vào [1, số lượt], số đúng vào số câu',
  sanitizeHistory({ x: { sessions: 2, questions: 10, correct: 99, days: 9, lastDay: TODAY } }).x,
  { sessions: 2, questions: 10, correct: 10, days: 2, lastDay: TODAY },
);

if (problems.length > 0) {
  for (const problem of problems) print(`${c.red}[LOI] ${problem}${c.reset}`);
  process.exitCode = 1;
} else {
  print(`${c.green}OK: dem luot luyen dung ca ${checks} truong hop.${c.reset}`);
}
