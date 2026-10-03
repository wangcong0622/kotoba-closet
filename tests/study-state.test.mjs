import assert from 'node:assert/strict';
import {normalizeStudy} from '../src/study-state.js';
import {normalizeSave} from '../src/storage.js';

const study=normalizeStudy({level:'advanced',tab:'scene',practiceMode:'listening',mobileView:'study',wordPositions:{'item:top_blouse:advanced':2,negative:-1,fraction:1.5},scenePositions:{cafe:3},sentences:{example:{blanked:true,translationHidden:true}}});
assert.equal(study.level,'advanced');assert.deepEqual(study.wordPositions,{'item:top_blouse:advanced':2});
assert.deepEqual(normalizeStudy(study),study);
const old=normalizeSave({schemaVersion:1,look:{top:'top_blouse'},favorites:[]});assert.deepEqual(old.study,normalizeStudy());
const imported=normalizeSave({...old,study});assert.deepEqual(imported.study,study);
assert.deepEqual(normalizeStudy({level:'bad',tab:[],sentences:[],wordPositions:null}),normalizeStudy());
assert.equal(Object.keys(normalizeStudy({wordPositions:Object.fromEntries(Array.from({length:300},(_,i)=>['key'+i,i]))}).wordPositions).length,256);
console.log('Study state: old-save migration, validation and lesson-position restoration PASS');
