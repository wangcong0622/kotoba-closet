import {LIFE_DIALOGUES,dialogueScript} from '../data/life-dialogues.js';
function normalizeSession(raw,lesson){
 const answers=[];
 for(let index=0;index<lesson.steps.length;index++){const id=Array.isArray(raw?.roleAnswers)?raw.roleAnswers[index]:null;if(!lesson.steps[index].choices.some(x=>x.id===id&&x.correct))break;answers.push(id);}
 const listeningAnswers={};for(const question of lesson.listening){const answer=raw?.listeningAnswers?.[question.id];if(question.options.some(([id])=>id===answer))listeningAnswers[question.id]=answer;}
 let answeredPrefix=0;while(lesson.listening[answeredPrefix]&&listeningAnswers[lesson.listening[answeredPrefix].id])answeredPrefix++;
 return {mode:raw?.mode==='listening'?'listening':'role',roleAnswers:answers,roleCursor:Number.isInteger(raw?.roleCursor)?Math.max(0,Math.min(raw.roleCursor,answers.length)):answers.length,listeningAnswers,listeningIndex:Number.isInteger(raw?.listeningIndex)?Math.max(0,Math.min(raw.listeningIndex,answeredPrefix)):0,assisted:raw?.assisted===true,heard:raw?.heard===true};
}
export function normalizeDialogue(raw={}){
 const lesson=LIFE_DIALOGUES.find(x=>x.id===raw?.lesson)||LIFE_DIALOGUES[0];
 const sessions=Object.fromEntries(LIFE_DIALOGUES.map(item=>[item.id,normalizeSession(raw?.sessions?.[item.id],item)]));
 // Flat active fields remain readable by older saves and are authoritative when
 // the active lesson was edited. Inactive lesson sessions never overwrite them.
 const active=normalizeSession(Array.isArray(raw?.roleAnswers)?raw:raw?.sessions?.[lesson.id]||raw,lesson);
 sessions[lesson.id]=active;
 return {lesson:lesson.id,...active,sessions};
}
export function switchDialogue(raw,lessonId){
 const current=normalizeDialogue(raw);if(!LIFE_DIALOGUES.some(x=>x.id===lessonId)||current.lesson===lessonId)return current;
 return normalizeDialogue({lesson:lessonId,...current.sessions[lessonId],sessions:current.sessions});
}
export function dialogueTarget(target){
 const parts=String(target).split(':');if(parts.length!==3)return null;const [type,lessonId,id]=parts;if(!['talk','hear'].includes(type))return null;
 const lesson=LIFE_DIALOGUES.find(x=>x.id===lessonId);if(!lesson)return null;
 const row=(type==='talk'?lesson.steps:lesson.listening).find(x=>x.id===id);return row?{type,lesson,row}:null;
}
export function dialogueReviewQuestion(target){
 const resolved=dialogueTarget(target);if(!resolved)return null;const {type,lesson,row}=resolved;
 if(type==='hear')return {target,prompt:row.prompt,options:row.options.map(([id,text])=>({id,text})),answer:row.answer,explain:row.note,speech:dialogueScript(lesson),listening:true,transcript:dialogueScript(lesson)};
 const answer=row.choices.find(x=>x.correct);
 return {target,prompt:row.staff.jp+'\n'+row.goal,options:row.choices.map(x=>({id:x.id,text:x.jp})),answer:answer.id,answers:row.choices.filter(x=>x.correct).map(x=>x.id),explain:answer.note,speech:row.staff.jp,choiceFeedback:Object.fromEntries(row.choices.map(x=>[x.id,x.note]))};
}
