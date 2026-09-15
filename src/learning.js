export const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export function normalizeLearning(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id, record]) =>
    typeof id === 'string' && record && typeof record === 'object' && !Array.isArray(record)
  ).map(([id, record]) => [id, {
    viewedAt: typeof record.viewedAt === 'string' && Number.isFinite(Date.parse(record.viewedAt)) ? record.viewedAt : null,
    streak: Number.isInteger(record.streak) && record.streak >= 0 ? Math.min(record.streak, REVIEW_INTERVALS_DAYS.length) : 0,
    nextReviewAt: typeof record.nextReviewAt === 'string' && Number.isFinite(Date.parse(record.nextReviewAt)) ? record.nextReviewAt : null,
    lastResult: record.lastResult === 'correct' || record.lastResult === 'incorrect' ? record.lastResult : null
  }]));
}

export function markViewed(learning, lexemeId, now = Date.now()) {
  const previous = normalizeLearning(learning)[lexemeId] || { streak: 0, nextReviewAt: null, lastResult: null };
  return { ...normalizeLearning(learning), [lexemeId]: { ...previous, viewedAt: previous.viewedAt || new Date(now).toISOString() } };
}

export function recordReview(learning, lexemeId, correct, now = Date.now()) {
  const normalized = normalizeLearning(learning);
  const previous = normalized[lexemeId] || { viewedAt: null, streak: 0, nextReviewAt: null, lastResult: null };
  const streak = correct ? Math.min(previous.streak + 1, REVIEW_INTERVALS_DAYS.length) : 0;
  const delay = correct ? REVIEW_INTERVALS_DAYS[streak - 1] * DAY : 10 * MINUTE;
  return {
    ...normalized,
    [lexemeId]: {
      viewedAt: previous.viewedAt || new Date(now).toISOString(),
      streak,
      nextReviewAt: new Date(now + delay).toISOString(),
      lastResult: correct ? 'correct' : 'incorrect'
    }
  };
}

export function reviewStatus(record, now = Date.now()) {
  if (!record?.viewedAt) return '新词';
  if (!record.nextReviewAt) return '已浏览';
  const due = Date.parse(record.nextReviewAt);
  if (Number.isNaN(due)) return '已浏览';
  return due <= now ? '待复习' : record.lastResult === 'incorrect' ? '稍后复习' : '已安排复习';
}
