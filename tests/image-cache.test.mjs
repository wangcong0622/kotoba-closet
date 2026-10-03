import assert from 'node:assert/strict';
import {createImageCache} from '../src/image-cache.js';

let loads=0;
const createImage=()=>({naturalWidth:2,naturalHeight:2,set src(value){loads++;queueMicrotask(()=>value==='broken'?this.onerror():this.onload());}});
const cache=createImageCache({maxEntries:2,maxBytes:32,createImage});
const first=cache.load('a');assert.equal(cache.load('a'),first);await first;
await cache.load('b');await cache.load('a');await cache.load('c');
assert.deepEqual(cache.stats(),{entries:2,bytes:32,maxEntries:2,maxBytes:32});
assert.equal(loads,3);await cache.load('b');assert.equal(loads,4);
await assert.rejects(cache.load('broken'),/图片未能加载/);await assert.rejects(cache.load('broken'));
assert.equal(loads,6);
const small=createImageCache({maxEntries:5,maxBytes:16,createImage});
await Promise.all(['one','two','three','four'].map(small.load));
assert.equal(small.stats().entries,1);assert.equal(small.stats().bytes,16);
console.log('Image cache: concurrent reuse, recency eviction, byte limit and retry PASS');
