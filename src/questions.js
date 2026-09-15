import { LEXEMES, BRANDS } from '../data/content.js';
import { SCENE_CONTENT } from '../data/scenes.js';
export function shuffle(values, random=Math.random) { const a=[...values]; for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
export function dueTargets(learning, now=Date.now()) {return Object.entries(learning).filter(([,r])=>r.nextReviewAt&&Date.parse(r.nextReviewAt)<=now).sort((a,b)=>Date.parse(a[1].nextReviewAt)-Date.parse(b[1].nextReviewAt)).map(([id])=>id);}
export function createQuestion({target,scene='cafe',listening=false,verb=false}) {
  if(target.startsWith('brand:')) {
    const id=target.slice(6),brand=BRANDS[id];if(!brand)return null;
    return {target,prompt:`${brand.latin} 的日语名是？`,options:shuffle([{id,text:brand.ja},...shuffle(Object.entries(BRANDS).filter(([key])=>key!==id)).slice(0,3).map(([key,b])=>({id:key,text:b.ja}))]),answer:id,explain:`${brand.latin} → ${brand.ja}`,speech:brand.ja};
  }
  if(target.startsWith('life:')) {
    const row=SCENE_CONTENT.find(r=>r.id===target.slice(5));if(!row)return null;
    return {target,prompt:row.prompt,options:shuffle([{id:'yes',text:row.jp},{id:'no',text:row.wrong}]),answer:'yes',explain:`${row.jp}（${row.zh}）`,speech:row.jp};
  }
  const lex=LEXEMES[target];if(!lex)return null;
  if(verb){const verbs={着る:'着ます',はく:'はきます',かぶる:'かぶります',かける:'かけます',つける:'つけます',持つ:'持ちます'}; const correct=verbs[lex.verb];if(correct)return {target,prompt:`${lex.jp}を（　）。`,options:shuffle([{id:'yes',text:correct},...shuffle(Object.values(verbs).filter(v=>v!==correct)).slice(0,3).map((text,i)=>({id:`no${i}`,text}))]),answer:'yes',explain:`${lex.zh}通常用「${lex.verb}」。`};}
  const others=shuffle(Object.entries(LEXEMES).filter(([,l])=>l.jp!==lex.jp&&l.zh!==lex.zh)).slice(0,3);
  return {target,prompt:listening?'听一听，选择听到的服饰含义。':`「${lex.zh}」的日语是？`,options:shuffle([{id:target,text:listening?lex.zh:lex.jp},...others.map(([id,l])=>({id,text:listening?l.zh:l.jp}))]),answer:target,explain:`${lex.jp}：${lex.zh}`,speech:listening?lex.jp:null,listening};
}
