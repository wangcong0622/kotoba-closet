import assert from 'node:assert/strict';
import {LIFE_DIALOGUES,dialogueScript} from '../data/life-dialogues.js';
import {PRAGMATICS} from '../data/pragmatics.js';
import {LIFE_AUDIO} from '../data/life-audio.js';
import {normalizeDialogue,switchDialogue} from '../src/dialogue-state.js';
import {normalizeSave} from '../src/storage.js';
import {recordReview,markViewed,normalizeLearning,practiceDay} from '../src/learning.js';
import {createQuestion,weakTargets,learningSummary} from '../src/questions.js';
const now=Date.parse('2026-10-03T00:00:00Z');
assert.equal(LIFE_DIALOGUES.length,3);
assert.equal(new Set(LIFE_DIALOGUES.map(x=>x.id)).size,LIFE_DIALOGUES.length);
for(const lesson of LIFE_DIALOGUES){
 assert.equal(new Set(lesson.steps.map(x=>x.id)).size,lesson.steps.length);
 assert.equal(new Set(lesson.listening.map(x=>x.id)).size,lesson.listening.length);
 const answers=lesson.steps.map(step=>step.choices.find(x=>x.correct).id);
 for(const [index,step] of lesson.steps.entries()){
  assert.equal(new Set(step.choices.map(x=>x.id)).size,step.choices.length);
  assert.equal(new Set(step.choices.map(x=>x.jp)).size,step.choices.length);
  for(const row of [step.staff,...step.choices,...step.choices.flatMap(x=>x.followup)])assert(row.jp&&row.reading&&row.zh&&/[ぁ-ゖァ-ヺ]/.test(row.jp),`${lesson.id}:${step.id}`);
  const question=createQuestion({target:`talk:${lesson.id}:${step.id}`});assert.deepEqual(question.answers,step.choices.filter(x=>x.correct).map(x=>x.id));
  for(const choice of step.choices.filter(x=>x.correct)){const branch=[...answers];branch[index]=choice.id;for(const line of dialogueScript(lesson,branch))assert(LIFE_AUDIO[line.jp],line.jp);}
 }
 for(const row of lesson.listening){assert(row.options.some(([id])=>id===row.answer));assert.equal(new Set(row.options.map(([id])=>id)).size,row.options.length);assert(row.evidence.length&&row.evidence.every(id=>lesson.steps.some(x=>x.id===id)));assert(createQuestion({target:`hear:${lesson.id}:${row.id}`}).listening);}
}
let state=normalizeDialogue({roleAnswers:['request'],roleCursor:1,listeningAnswers:{conditions:'loose-wash'},listeningIndex:1,mode:'listening',heard:true});
state=switchDialogue(state,'cafe-order');assert.equal(state.roleCursor,0);state.roleAnswers.push('less-syrup');state.roleCursor=1;
state=switchDialogue(state,'friend-plan');assert.equal(state.roleCursor,0);state.roleAnswers.push('sunday');state.assisted=true;
state=switchDialogue(JSON.parse(JSON.stringify(state)),'fitting');assert.equal(state.roleCursor,1);assert.equal(state.mode,'listening');assert.equal(state.listeningIndex,1);assert(state.heard);assert(!state.assisted);
state=switchDialogue(state,'cafe-order');assert.deepEqual(state.roleAnswers,['less-syrup']);assert.equal(state.roleCursor,1);
state=switchDialogue(state,'friend-plan');assert.deepEqual(state.roleAnswers,['sunday']);assert(state.assisted);
assert.equal(switchDialogue(state,'unknown').lesson,'friend-plan');
for(const row of PRAGMATICS){const question=createQuestion({target:`intent:${row.id}`});assert(question);assert(question.options.some(x=>x.id===question.answer));assert.equal(new Set(question.options.map(x=>x.text)).size,question.options.length);assert(question.choiceFeedback[question.answer]);assert(LIFE_AUDIO[row.jp]);}
const target='intent:bag-refusal';let learning=markViewed({},target,now);assert.equal(learningSummary(learning,now).today,0);
learning=recordReview(learning,target,false,now);assert.deepEqual(weakTargets(learning),[target]);assert.equal(learningSummary(learning,now).today,1);
learning=recordReview(learning,target,true,now+1000);assert(learning[target].needsWork);assert.equal(learning[target].streak,0);assert.equal(learningSummary(learning,now).today,1);
learning=recordReview(learning,target,true,now+600000,{assisted:true});assert(learning[target].needsWork);
learning=recordReview(learning,target,true,now+1200000);assert(!learning[target].needsWork);assert.deepEqual(weakTargets(learning),[]);
assert.equal(learning[target].practiceDay,practiceDay(now));
assert.equal(learningSummary(recordReview({},target,true,now,{assisted:true}),now).today,0);
const legacy=normalizeLearning({[target]:{lastResult:'incorrect',lastReviewedAt:new Date(now).toISOString()}});assert(legacy[target].needsWork);assert.equal(legacy[target].lastWrongAt,new Date(now).toISOString());
const restored=normalizeSave({schemaVersion:3,look:{top:'top_blouse'},favorites:[],learning,study:{practiceMode:'intent',dialogue:state}});assert.equal(restored.study.practiceMode,'intent');assert.equal(restored.study.dialogue.sessions.fitting.roleCursor,1);assert(restored.learning[target]);
console.log('Life upgrade: three original dialogues, all branches and audio, independent progress migration, contextual intent, persistent weak items and distinct daily practice PASS');
