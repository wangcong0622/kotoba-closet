import assert from 'node:assert/strict';
import fs from 'node:fs';
import {markViewed,recordReview,normalizeLearning} from '../src/learning.js';
import {createQuestion,dueTargets} from '../src/questions.js';
import {normalizeSave} from '../src/storage.js';
import {normalizeDialogue} from '../src/dialogue-state.js';
import {ALL_LIFE_EXPRESSIONS} from '../data/life-expressions.js';
import {advancedItemExamples,clozeExample} from '../data/advanced-japanese.js';
import {FITTING_DIALOGUE,dialogueScript} from '../data/life-dialogues.js';
import {LIFE_AUDIO} from '../data/life-audio.js';
import {LEXEMES,ITEMS} from '../data/content.js';
const now=Date.parse('2026-10-03T00:00:00Z'),day=86400000;
let progress=markViewed({},'blouse',now);assert.deepEqual(dueTargets(progress,now+day),['blouse']);
for(let index=0;index<5;index++)progress=recordReview(progress,'blouse',true,now+index*1000);
assert.equal(progress.blouse.streak,1);assert.equal(Date.parse(progress.blouse.nextReviewAt),now+day);
progress=recordReview(progress,'blouse',true,now+day);assert.equal(progress.blouse.streak,2);assert.equal(Date.parse(progress.blouse.nextReviewAt),now+4*day);
progress=recordReview(progress,'blouse',false,now+4*day);assert.equal(progress.blouse.streak,0);assert.equal(Date.parse(progress.blouse.nextReviewAt),now+4*day+600000);
progress=recordReview(progress,'blouse',true,now+4*day+1000);assert.equal(progress.blouse.streak,0);
progress=recordReview(progress,'blouse',true,now+4*day+600000);assert.equal(progress.blouse.streak,1);
const legacy=normalizeLearning({blouse:{viewedAt:new Date(now).toISOString(),streak:2,lastResult:'correct',nextReviewAt:new Date(now+3*day).toISOString()}});
assert.equal(recordReview(legacy,'blouse',true,now+1000).blouse.streak,2);
let assisted=recordReview({},'hear:fitting:conditions',true,now,{assisted:true});assert.equal(assisted['hear:fitting:conditions'].streak,0);assert.equal(recordReview(assisted,'hear:fitting:conditions',true,now+1000)['hear:fitting:conditions'].streak,0);
assert.equal(new Set(ALL_LIFE_EXPRESSIONS.map(x=>x.id)).size,32);
for(const row of ALL_LIFE_EXPRESSIONS){assert(row.jp.includes(row.focus),row.id);assert(row.reading.includes(row.focusReading),row.id);assert(LIFE_AUDIO[row.jp],row.id);const cloze=clozeExample(row);assert(!cloze.jp.includes(row.focus),row.id);assert(!cloze.reading.includes(row.focusReading),row.id);assert(createQuestion({target:'expression:'+row.id}));}
assert.equal(advancedItemExamples(null,LEXEMES.sneakers)[0].id,'shoes-fit');assert.equal(advancedItemExamples(ITEMS.find(x=>x.id==='hair_straight_v23'),LEXEMES.hair_straight)[0].id,'hair-request');
for(const [target] of Object.entries(LEXEMES))for(let i=0;i<10;i++){const question=createQuestion({target});assert.equal(question.options.length,4);assert.equal(new Set(question.options.map(x=>x.text)).size,4);assert.equal(question.options.filter(x=>x.id===question.answer).length,1);}
const lesson=FITTING_DIALOGUE;
for(const step of lesson.steps){assert(step.choices.some(x=>x.correct));assert(step.choices.some(x=>!x.correct));assert(createQuestion({target:`talk:${lesson.id}:${step.id}`}));}
for(const question of lesson.listening){assert(question.options.some(([id])=>id===question.answer));assert(createQuestion({target:`hear:${lesson.id}:${question.id}`}).listening);}
const answers=lesson.steps.map(x=>x.choices.find(y=>y.correct).id),think=[...answers.slice(0,-1),'think'];
assert(dialogueScript(lesson,think).some(x=>x.jp.includes('今日は見送ります')));assert(!dialogueScript(lesson,think).some(x=>x.jp.includes('レジ')));
for(const script of [dialogueScript(lesson),dialogueScript(lesson,think)])for(const line of script)assert(LIFE_AUDIO[line.jp]);
const dirty=normalizeDialogue({roleAnswers:['request','wrong','shoulder'],roleCursor:90,listeningIndex:99,listeningAnswers:{conditions:'wrong'},lesson:'missing'});assert.deepEqual(dirty.roleAnswers,['request']);assert.equal(dirty.roleCursor,1);assert.equal(dirty.listeningIndex,0);
const normalized=normalizeSave({schemaVersion:1,look:{top:'top_blouse'},favorites:[],learning:{'expression:clothes-fit':{viewedAt:new Date(now).toISOString()},'hear:fitting:conditions':{viewedAt:new Date(now).toISOString()},'talk:fitting:missing':{viewedAt:new Date(now).toISOString()}},study:{tab:'dialogue',dialogue:{roleAnswers:answers,roleCursor:6}}});assert.equal(normalized.study.tab,'dialogue');assert.equal(normalized.study.dialogue.roleCursor,6);assert(normalized.learning['expression:clothes-fit']);assert(normalized.learning['hear:fitting:conditions']);assert(!normalized.learning['talk:fitting:missing']);
for(const file of Object.values(LIFE_AUDIO)){assert(fs.existsSync(file));const data=fs.readFileSync(file);assert(data.length>500);assert(data.subarray(0,3).toString()==='ID3'||data[0]===255);}
console.log('Life learning: anti-cramming review, assisted listening, 32 spoken expressions, both dialogue endings, unique options, stable IDs and fixed audio PASS');
