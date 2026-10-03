import assert from 'node:assert/strict';
import { markViewed, recordReview, reviewStatus } from '../src/learning.js';

const now = Date.parse('2026-09-06T09:00:00.000Z');
let learning = markViewed({}, 'skirt', now);
assert.equal(reviewStatus(learning.skirt, now), '已安排复习');
learning = recordReview(learning, 'skirt', true, now);
assert.equal(learning.skirt.streak, 1);
assert.equal(learning.skirt.nextReviewAt, '2026-09-07T09:00:00.000Z');
learning = recordReview(learning, 'skirt', true, now + 1000);
assert.equal(learning.skirt.streak, 1);
assert.equal(learning.skirt.nextReviewAt, '2026-09-07T09:00:00.000Z');
learning = recordReview(learning, 'skirt', false, now + 2000);
assert.equal(learning.skirt.streak, 0);
assert.equal(learning.skirt.nextReviewAt, '2026-09-06T09:10:02.000Z');
assert.equal(reviewStatus(learning.skirt, now + 10 * 60 * 1000 + 2001), '待复习');
console.log('learning review schedule: pass');
