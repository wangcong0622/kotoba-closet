import { LEXEMES, BRANDS } from '../data/content.js';
import { SCENE_CONTENT } from '../data/scenes.js';
import {dialogueReviewQuestion} from './dialogue-state.js';
import {ALL_LIFE_EXPRESSIONS,LIFE_EXPRESSIONS} from '../data/life-expressions.js';
import {PRAGMATICS} from '../data/pragmatics.js';
import {practiceDay} from './learning.js';
export function shuffle(values, random=Math.random) { const a=[...values]; for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
export function dueTargets(learning, now=Date.now()) {return Object.entries(learning).filter(([,r])=>r.nextReviewAt&&Date.parse(r.nextReviewAt)<=now).sort((a,b)=>Date.parse(a[1].nextReviewAt)-Date.parse(b[1].nextReviewAt)).map(([id])=>id);}
export function weakTargets(learning){return Object.entries(learning).filter(([,r])=>r.needsWork||r.lastResult==='incorrect').sort((a,b)=>(Date.parse(b[1].lastWrongAt)||0)-(Date.parse(a[1].lastWrongAt)||0)).map(([id])=>id);}
export function learningSummary(learning,now=Date.now()){return {today:Object.values(learning).filter(r=>r.practiceDay===practiceDay(now)).length,due:dueTargets(learning,now).filter(target=>createQuestion({target})).length,weak:weakTargets(learning).filter(target=>createQuestion({target})).length};}
export function createQuestion({target,scene='cafe',listening=false,verb=false}) {
  if(typeof target!=='string')return null;
  if(target.startsWith('intent:')){const row=PRAGMATICS.find(x=>`intent:${x.id}`===target);if(!row)return null;return {target,prompt:row.context+'\n「'+row.jp+'」\n'+row.prompt,options:shuffle(row.options.map(({id,text})=>({id,text}))),answer:row.answer,explain:row.zh+' '+row.note,speech:row.jp,choiceFeedback:Object.fromEntries(row.options.map(x=>[x.id,x.note+' '+row.note]))};}
  const dialogue=dialogueReviewQuestion(target);if(dialogue)return {...dialogue,options:shuffle(dialogue.options)};
  if(target.startsWith('expression:')){const row=ALL_LIFE_EXPRESSIONS.find(x=>`expression:${x.id}`===target);if(!row)return null;const pool=Object.values(LIFE_EXPRESSIONS).find(rows=>rows.includes(row));return {target,prompt:`想表达「${row.zh}」，哪句话符合？`,options:shuffle(pool.map(x=>({id:x.id,text:x.jp}))),answer:row.id,explain:row.note,speech:row.jp};}
  if(target.startsWith('brand:')) {
    const id=target.slice(6),brand=BRANDS[id];if(!brand)return null;
    return {target,prompt:`${brand.latin} 的日语名是？`,options:shuffle([{id,text:brand.ja},...shuffle(Object.entries(BRANDS).filter(([key])=>key!==id)).slice(0,3).map(([key,b])=>({id:key,text:b.ja}))]),answer:id,explain:`${brand.latin} → ${brand.ja}`,speech:brand.ja};
  }
  if(target.startsWith('life:')) {
    const row=SCENE_CONTENT.find(r=>r.id===target.slice(5));if(!row)return null;
    if(listening){const others=shuffle(SCENE_CONTENT.filter(candidate=>candidate.id!==row.id&&candidate.scene===row.scene)).slice(0,3);return {target,prompt:'听一听，选择最符合的中文意思。',options:shuffle([{id:row.id,text:row.zh},...others.map(candidate=>({id:candidate.id,text:candidate.zh}))]),answer:row.id,explain:`${row.jp}（${row.zh}）`,speech:row.jp,listening:true};}
    return {target,prompt:row.prompt,options:shuffle([{id:'yes',text:row.jp},{id:'no',text:row.wrong}]),answer:'yes',explain:`${row.jp}（${row.zh}）`,speech:row.jp};
  }
  const lex=LEXEMES[target];if(!lex)return null;
  if(verb){const verbs={着る:'着ます',はく:'はきます',かぶる:'かぶります',かける:'かけます',つける:'つけます',持つ:'持ちます'}; const correct=verbs[lex.verb];if(correct)return {target,prompt:`${lex.jp}を（　）。`,options:shuffle([{id:'yes',text:correct},...shuffle(Object.values(verbs).filter(v=>v!==correct)).slice(0,3).map((text,i)=>({id:`no${i}`,text}))]),answer:'yes',explain:`${lex.zh}通常用「${lex.verb}」。`};}
  const seenJP=new Set([lex.jp]),seenZH=new Set([lex.zh]);
  const others=shuffle(Object.entries(LEXEMES)).filter(([,l])=>{if(seenJP.has(l.jp)||seenZH.has(l.zh))return false;seenJP.add(l.jp);seenZH.add(l.zh);return true;}).slice(0,3);
  return {target,prompt:listening?'听一听，选择听到的服饰含义。':`「${lex.zh}」的日语是？`,options:shuffle([{id:target,text:listening?lex.zh:lex.jp},...others.map(([id,l])=>({id,text:listening?l.zh:l.jp}))]),answer:target,explain:`${lex.jp}：${lex.zh}`,speech:listening?lex.jp:null,listening};
}
