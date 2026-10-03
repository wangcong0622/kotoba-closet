import {LIFE_DIALOGUES,dialogueScript} from '../data/life-dialogues.js';
import {normalizeDialogue,switchDialogue} from './dialogue-state.js';
export function createDialogueUI({root,getState,save,review,speak,play,canPlay,stopPlayback,shadow}){
 let cancelAudio=null,playing=false,roleFeedback=null,audioStatus='';
 const node=(tag,text,cls)=>{const element=document.createElement(tag);if(text!==undefined)element.textContent=text;if(cls)element.className=cls;return element;};
 const button=(text,action,cls)=>{const element=node('button',text,cls);element.type='button';element.onclick=action;return element;};
 const session=()=>getState().study.dialogue;
 function stop(){cancelAudio?.();stopPlayback?.();cancelAudio=null;playing=false;audioStatus='';root.querySelectorAll('.dialogue-playing').forEach(x=>x.classList.remove('dialogue-playing'));}
 function lineCard(line,index=null){const card=node('div',undefined,'dialogue-line');if(index!==null)card.dataset.lineIndex=index;card.append(node('small',line.speaker),node('p',line.jp,'dialogue-jp'));if(getState().settings.kana)card.append(node('p',line.reading,'reading'));card.append(node('p',line.zh,'translation'));const audio=button('▶ 听这一句',()=>{stop();speak(line.jp);},'text-btn');audio.disabled=!canPlay([line]);card.append(audio,button('跟读这句',()=>{stop();shadow(line);},'text-btn'));return card;}
 function scriptView(lines){const transcript=node('div',undefined,'dialogue-transcript');lines.forEach((line,index)=>transcript.append(lineCard(line,index)));return transcript;}
 function listen(lines){stop();playing=true;render();cancelAudio=play(lines,{onLine:(index,line)=>{audioStatus=`正在播放 ${index+1}/${lines.length} · ${line.speaker}`;const status=root.querySelector('.dialogue-audio-status');if(status)status.textContent=audioStatus;root.querySelectorAll('[data-line-index]').forEach(card=>card.classList.toggle('dialogue-playing',Number(card.dataset.lineIndex)===index));},onEnd:()=>{playing=false;cancelAudio=null;if(session().mode==='listening'){session().heard=true;save();}audioStatus='播放完毕，可以重听。';render();},onError:()=>{playing=false;cancelAudio=null;audioStatus='音频暂时不可用，请重试或选择阅读辅助。';render();}});}
 function audioControls(lines){const group=node('div',undefined,'dialogue-audio-controls');const start=button(playing?'停止播放':'▶ 听完整对话',()=>playing?(stop(),render()):listen(lines));start.disabled=!playing&&!canPlay(lines);const slow=node('label',undefined,'dialogue-slow'),checkbox=node('input');checkbox.type='checkbox';checkbox.checked=getState().settings.slow;checkbox.onchange=()=>{stop();getState().settings.slow=checkbox.checked;save();render();};slow.append(checkbox,document.createTextNode(' 慢一点听'));group.append(start,slow,node('p',audioStatus||'先听对话，再根据细节作答。','dialogue-audio-status'));return group;}
 function switchMode(mode){stop();session().mode=mode;roleFeedback=null;save();render();}
 function reset(){stop();const current=session();getState().study.dialogue=normalizeDialogue({...current,...(current.mode==='role'?{roleAnswers:[],roleCursor:0}:{listeningAnswers:{},listeningIndex:0,assisted:false,heard:false})});roleFeedback=null;save();render();}
 function render(){
  const state=getState(),current=session(),lesson=LIFE_DIALOGUES.find(x=>x.id===current.lesson)||LIFE_DIALOGUES[0];root.replaceChildren();
  const label=node('label','选择生活会话','dialogue-picker'),picker=node('select');picker.id='dialogueLesson';for(const item of LIFE_DIALOGUES){const progress=item.id===current.lesson?current:current.sessions[item.id],option=node('option',`${item.title} · ${progress.roleCursor}/${item.steps.length} 轮`);option.value=item.id;picker.append(option);}picker.value=lesson.id;picker.onchange=()=>{stop();getState().study.dialogue=switchDialogue(current,picker.value);roleFeedback=null;save();render();root.querySelector('#dialogueLesson').focus();};label.append(picker);root.append(label);
  const heading=node('div',undefined,'dialogue-heading');heading.append(node('p','N2 生活口语 · 连续会话','eyebrow'),node('h3',lesson.title),node('p',lesson.goal,'dialogue-goal'));root.append(heading);
  const modes=node('div',undefined,'dialogue-modes');modes.setAttribute('role','group');modes.setAttribute('aria-label','会话练习方式');for(const [mode,label] of [['role','接话练习'],['listening','对话听力']]){const control=button(label,()=>switchMode(mode));control.dataset.dialogueMode=mode;control.setAttribute('aria-pressed',String(current.mode===mode));modes.append(control);}root.append(modes);
  if(current.mode==='role')renderRole(current,lesson);else renderListening(current,lesson);
  root.append(button('重新练习',reset,'text-btn dialogue-restart'));
 }
 function renderRole(current,lesson){
  const index=current.roleCursor;
  if(index>=lesson.steps.length){root.append(node('h4','对话完成'),node('p',lesson.id==='fitting'?(current.roleAnswers.at(-1)==='think'?'你说明了顾虑，并礼貌表示今天先不买。':'你说明了需求，试穿其他款式后作出了选择。'):'你接住了对方提供的信息，说明了自己的条件，并商量好下一步。','dialogue-feedback'),audioControls(dialogueScript(lesson,current.roleAnswers)),scriptView(dialogueScript(lesson,current.roleAnswers)));root.append(button('进入对话听力',()=>switchMode('listening')));return;}
  const step=lesson.steps[index],selected=step.choices.find(x=>x.id===current.roleAnswers[index]);
  if(index){const history=node('details',undefined,'dialogue-history');history.append(node('summary','回顾已完成的对话'),scriptView(dialogueScript({...lesson,steps:lesson.steps.slice(0,index)},current.roleAnswers)));root.append(history);}
  root.append(node('p',`第 ${index+1}/${lesson.steps.length} 轮 · ${step.title}`,'dialogue-progress'),lineCard(step.staff),node('p',step.goal,'dialogue-task'));
  const options=node('div',undefined,'dialogue-options');for(const choice of step.choices){const control=button(choice.jp,()=>{stop();if(choice.correct){current.roleAnswers[index]=choice.id;review(`talk:${lesson.id}:${step.id}`,true);}else review(`talk:${lesson.id}:${step.id}`,false);roleFeedback={index,id:choice.id};save();render();});control.dataset.dialogueChoice=choice.id;control.disabled=Boolean(selected);if(choice.id===selected?.id)control.classList.add('correct-answer');options.append(control);}root.append(options);
  const choice=selected||(roleFeedback?.index===index?step.choices.find(x=>x.id===roleFeedback.id):null);
  if(choice){const feedback=node('div',undefined,'dialogue-feedback');feedback.append(node('strong',choice.correct?'这句话接住了对方的意思。':'这句话表达了不同的意思。'),node('p',choice.zh),node('p',choice.note));root.append(feedback);}
  if(selected){root.append(lineCard(selected),...selected.followup.map(line=>lineCard(line)));const next=button(index===lesson.steps.length-1?'查看完整对话':'继续对话',()=>{stop();current.roleCursor++;roleFeedback=null;save();render();});next.id='dialogueNext';root.append(next);}
 }
 function renderListening(current,lesson){
  const lines=dialogueScript(lesson),index=current.listeningIndex,question=lesson.listening[index];root.append(node('p','听力使用固定对话版本；接话练习中的其他合理结局不会改变这段原音。','dialogue-version-note'),audioControls(lines));
  if(!question){const correct=lesson.listening.filter(q=>current.listeningAnswers[q.id]===q.answer).length;root.append(node('h4',`完成 · ${correct}/${lesson.listening.length} 题答对`),node('p',current.assisted?'本次使用了阅读辅助，听力熟练度不会因此提升。':'可以对照原文，重听之前漏掉的条件与转折。','dialogue-feedback'),scriptView(lines));return;}
  root.append(node('p',`第 ${index+1}/${lesson.listening.length} 题${!current.heard&&!current.assisted?' · 听完对话后可作答':''}`,'dialogue-progress'),node('h4',question.prompt));
  const answer=current.listeningAnswers[question.id],options=node('div',undefined,'dialogue-options');for(const [id,text] of question.options){const control=button(text,()=>{stop();current.listeningAnswers[question.id]=id;review(`hear:${lesson.id}:${question.id}`,id===question.answer,{assisted:current.assisted});save();render();});control.dataset.dialogueAnswer=id;control.disabled=Boolean(answer)||(!current.heard&&!current.assisted);if(answer&&id===question.answer)control.classList.add('correct-answer');options.append(control);}root.append(options);
  if(answer){root.append(node('p',(answer===question.answer?'答对了。':'正确答案：'+question.options.find(([id])=>id===question.answer)[1]+'。')+question.note,'dialogue-feedback'));const next=button(index===lesson.listening.length-1?'查看原文与结果':'下一题',()=>{current.listeningIndex++;save();render();});next.id='dialogueListeningNext';root.append(next);}
  if(current.assisted){root.append(node('p','阅读辅助已开启；本次保留练习记录，听力熟练度不提升。','dialogue-assisted'),scriptView(lines));}else root.append(button('需要原文辅助',()=>{stop();current.assisted=true;save();render();},'text-btn'));
 }
 return {render,stop};
}
