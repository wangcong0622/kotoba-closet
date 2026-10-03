import {playRecording,playSequence,stopRecording,hasRecording,hasRecordings} from './recorded-voice.js';
import {showMobileExport,restoreMobileView} from './mobile.js';
import {normalizeStudy} from './study-state.js';
import {createDialogueUI} from './dialogue-ui.js';
import {createShadowing} from './shadowing.js';
import {normalizeWardrobe,reconcileLocks,equipBlock,randomLook,filterWardrobe} from './wardrobe-state.js';
import {BRAND_INTROS} from '../data/brand-intros.js';
import {rankVoices,chooseVoice} from './voice.js';
import {SCENE_BACKGROUNDS} from '../data/backgrounds.js';
import {ITEMS,LEXEMES,BRANDS,SCENES} from '../data/content.js';
import {SCENE_CONTENT,SCENE_HINTS} from '../data/scenes.js';
import {SCENE_VOCABULARY} from '../data/scene-learning.js';
import {itemVocabulary,itemExampleSentences,itemLexeme,COLOR_LABELS} from '../data/item-vocabulary.js';
import {advancedItemExamples,clozeExample} from '../data/advanced-japanese.js';
import {PRODUCTION} from '../data/production.js';
import {applyEquip} from './wardrobe.js';
import {recordReview,markViewed,reviewStatus} from './learning.js';
import {normalizeSave,cleanLook,INITIAL_LOOK} from './storage.js';
import {createQuestion,dueTargets,shuffle} from './questions.js';
import {drawPlan} from './render-plan.js';
import {buildWornPlan} from './render-worn-v18.js';
import {WORN_V18} from '../data/worn-v18.js';
import {sortWardrobeItems} from '../data/wardrobe-order.js';
const $=s=>document.querySelector(s),key='kotoba-closet-v1';
for(const x of ITEMS)if(PRODUCTION[x.id]){x.renderParts=PRODUCTION[x.id].renderParts||[{src:`assets/items/${PRODUCTION[x.id].file}`,layerKey:x.slot}];x.thumbnail=`assets/thumbs/${PRODUCTION[x.id].file}`;if(PRODUCTION[x.id].name)x.zh=PRODUCTION[x.id].name;if(PRODUCTION[x.id].publish===false){x.publish=false;x.acceptanceNote=PRODUCTION[x.id].acceptanceNote;}}
// The reference-derived registry is the sole selectable asset set.
for(const item of ITEMS){const asset=WORN_V18[item.id];if(asset){item.renderParts=asset.parts;item.thumbnail=asset.thumbnail;item.publish=true;}}
const inventory=sortWardrobeItems(ITEMS.filter(x=>WORN_V18[x.id])),getItem=id=>inventory.find(x=>x.id===id);
const planFor=(look,scene)=>buildWornPlan({look,getItem,backgroundSrc:SCENE_BACKGROUNDS[scene]});
let state={schemaVersion:3,projectId:'kotoba-closet',look:{...INITIAL_LOOK},focus:'top_blouse',studyLexeme:null,favorites:[],albums:[],learning:{},settings:{kana:true,reduced:false,mode:'light',slow:false},scene:'cafe',study:normalizeStudy({level:'advanced'}),wardrobe:normalizeWardrobe()};
let history=[],future=[],question=null,answered=false,feedback='',voices=[],reviewMode=false,renderId=0,readyPlan=null,studyLevel='basic',learningTab='word',practiceMode='word',stageFrame=0,albumObserver=null;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
function button(text,fn,cls){const b=el('button',text,cls);b.type='button';b.onclick=fn;return b;}
function toast(text){$('#toast').textContent=text;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').textContent='',5000);}
function save(){try{localStorage.setItem(key,JSON.stringify(state));return true;}catch{toast('设备存储已满或不可用；当前搭配仍可使用，请导出备份。');return false;}}
try{const raw=localStorage.getItem(key);if(raw)state=normalizeSave(JSON.parse(raw));}catch{toast('旧存档无法读取，已恢复初始搭配。');}
state.look=Object.fromEntries(Object.entries(state.look).filter(([,id])=>getItem(id)));
if(!state.look.hair)state.look.hair='hair_straight_v23';
state.wardrobe=normalizeWardrobe(state.wardrobe,state.look,getItem);
let inventoryKey=null,scrollSaveTimer=0,randomSlot='top';
function snapshot(){return JSON.stringify({look:state.look,scene:state.scene,locks:state.wardrobe.locks});}
function mutate(fn){const before=snapshot();fn();state.wardrobe.locks=reconcileLocks(state.wardrobe.locks,state.look);if(before!==snapshot()){history.push(before);history=history.slice(-20);future=[];}question=null;answered=false;feedback='';save();render();}
function equip(id){const target=getItem(id);if(!target)return;const blocked=equipBlock(state.look,target,state.wardrobe.locks);if(blocked){if(state.look[target.slot]===id){state.focus=id;state.studyLexeme=null;save();if(state.settings.mode!=='free')renderWord();}toast(blocked);return;}mutate(()=>{const result=target.slot==='hair'?{look:{...state.look,hair:id},removed:[],unequipped:false}:applyEquip(state.look,target,getItem);state.look=result.look;if(!result.unequipped)rememberItems([id]);state.focus=id;state.studyLexeme=null;toast(result.unequipped?`已取下 ${target.zh}`:`已穿上 ${target.zh}${result.removed.length?'，并取下不兼容的内搭':''}`);});}
function undo(redo=false){const from=redo?future:history,to=redo?history:future;if(!from.length)return;to.push(snapshot());const restored=JSON.parse(from.pop());state.look=restored.look;state.scene=restored.scene;state.wardrobe.locks=reconcileLocks(restored.locks,state.look);state.studyLexeme=null;state.focus=Object.values(state.look)[0]||'top_blouse';question=null;save();render();}
function activeItem(){return getItem(state.focus)||getItem(Object.values(state.look)[0])||inventory[0];}
function activeLexeme(){return state.studyLexeme||activeItem()?.lexeme||'blouse';}
const accessorySlots=new Set(['necklace','bracelet']);
const categories=[['all','全部'],['top','上衣'],['bottom','下装'],['dress','连衣裙'],['outer','外套'],['accessory','首饰'],['shoes','鞋子'],['bag','包包'],['hair','发型 / 帽子']];
function rememberItems(ids){state.wardrobe.recent=[...new Set([...ids,...state.wardrobe.recent])].slice(0,30);}
function resetFilters(){Object.assign(state.wardrobe,{category:'all',query:'',style:'',color:'',favoritesOnly:false,view:'all'});restoreWardrobe();renderInventory();save();}
function restoreWardrobe(){
 state.look=Object.fromEntries(Object.entries(state.look).filter(([,id])=>getItem(id)));if(!state.look.hair)state.look.hair='hair_straight_v23';
 state.wardrobe=normalizeWardrobe(state.wardrobe,state.look,getItem);inventoryKey=null;
 for(const [id,value] of [['searchInput','query'],['styleFilter','style'],['colorFilter','color'],['browseFilter','view']])$('#'+id).value=state.wardrobe[value];
 if(!$('#colorFilter').value)state.wardrobe.color='';
}
function randomize(slot=null){
 const locks=state.wardrobe.locks;
 if(slot){const candidate=inventory.find(x=>x.slot===slot);const blocked=candidate&&equipBlock(state.look,candidate,locks);if(blocked){toast(blocked);return;}}
 mutate(()=>{const old=state.look;state.look=randomLook(old,inventory,locks,slot);const changed=Object.values(state.look).filter(id=>!Object.values(old).includes(id));rememberItems(changed);state.focus=changed[0]||state.focus;state.studyLexeme=null;toast(changed.length?(slot?'已更换这一类，保留其他单品。':'已随机搭配，保留锁定单品。'):'当前单品均已锁定或没有其他可选单品。');});
}
function renderMobileLookBar(){
 const worn=Object.entries(state.look).map(([slot,id])=>({slot,item:getItem(id)})).filter(x=>x.item),locked=Object.keys(state.wardrobe.locks).length;
 const manage=button('穿搭 · '+worn.length+' 件'+(locked?' · 锁定 '+locked:''),()=>{renderLookControls();$('#lookDialog').showModal();});manage.id='manageLook';manage.setAttribute('aria-haspopup','dialog');
 const select=el('select');select.id='randomSlot';select.setAttribute('aria-label','局部随机分类');
 for(const [slot,title] of [...categories.filter(([slot])=>!['all','accessory'].includes(slot)),['necklace','项链'],['bracelet','手链']]){if(!inventory.some(x=>x.slot===slot))continue;const option=el('option',title);option.value=slot;select.append(option);}select.value=randomSlot;select.onchange=()=>randomSlot=select.value;
 const random=button('换这一类',()=>randomize(randomSlot));random.id='partialRandom';
 $('#mobileLookBar').replaceChildren(manage,select,random);renderLookControls();
}
function renderLookControls(){
 const focused=document.activeElement?.dataset.lockId;
 const rows=Object.entries(state.look).map(([slot,id])=>{const item=getItem(id);if(!item)return null;const row=el('div',undefined,'look-item'),image=el('img');image.src=item.thumbnail;image.alt='';
 const locked=state.wardrobe.locks[slot]===id;
 const lock=button(locked?'已锁定':'锁定',()=>mutate(()=>{if(locked)delete state.wardrobe.locks[slot];else state.wardrobe.locks[slot]=id;}));lock.dataset.lockId=id;lock.setAttribute('aria-label',(locked?'解锁':'锁定')+item.zh);lock.setAttribute('aria-pressed',String(locked));
 const remove=button('取下',()=>equip(id));remove.disabled=locked||slot==='hair';remove.setAttribute('aria-label','取下'+item.zh);row.append(image,el('strong',item.zh),lock,remove);return row;}).filter(Boolean);
 $('#lookItems').replaceChildren(...rows);$('#unlockAll').disabled=!Object.keys(state.wardrobe.locks).length;$('#clearLook').disabled=!Object.keys(state.look).some(slot=>slot!=='hair'&&!state.wardrobe.locks[slot]);
 if(focused&&$('#lookDialog').open)Array.from($('#lookItems [data-lock-id]')).find(x=>x.dataset.lockId===focused)?.focus();
}
function renderInventory(){
 const grid=$('#itemGrid'),filters=state.wardrobe;
 if(inventoryKey)filters.positions[inventoryKey]=grid.scrollTop;
 inventoryKey=JSON.stringify([filters.category,filters.query,filters.style,filters.color,filters.favoritesOnly,filters.view]);
 filters.positions=Object.fromEntries(Object.entries(filters.positions).slice(-40));
 $('#categoryTabs').replaceChildren(...categories.filter(([slot])=>slot==='all'||(slot==='accessory'?inventory.some(x=>accessorySlots.has(x.slot)):inventory.some(x=>x.slot===slot))).map(([slot,title])=>{const b=button(title,()=>{filters.category=slot;if(!['all','accessory'].includes(slot))randomSlot=slot;renderInventory();save();},slot===filters.category?'active':'');b.setAttribute('aria-pressed',String(slot===filters.category));return b;}));
 const filtered=filterWardrobe(inventory,filters,state.look,state.favorites,BRANDS);
 grid.replaceChildren(...filtered.map(x=>{const card=el('div',undefined,'item '+(state.look[x.slot]===x.id?'worn':''));const wear=button('',()=>equip(x.id),'wear-button');wear.dataset.itemId=x.id;wear.setAttribute('aria-label',(state.wardrobe.locks[x.slot]===x.id?'查看已锁定':x.slot==='hair'?'选择':state.look[x.slot]===x.id?'取下':'穿上')+x.zh);wear.setAttribute('aria-pressed',String(state.look[x.slot]===x.id));const image=el('img');image.src=x.thumbnail;image.alt=x.zh;image.onerror=()=>{image.onerror=null;image.dataset.retrySrc=x.thumbnail;image.src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="100"><rect width="120" height="100" rx="12" fill="#eef2e8"/><text x="60" y="55" text-anchor="middle" fill="#708567" font-size="12">待加载</text></svg>');};image.loading='lazy';image.decoding='async';image.fetchPriority='low';wear.append(image,el('strong',x.zh),el('small',x.jp));const fav=button(state.favorites.includes(x.id)?'♥':'♡',()=>{state.favorites=state.favorites.includes(x.id)?state.favorites.filter(id=>id!==x.id):[...state.favorites,x.id];save();renderInventory();},'fav');fav.setAttribute('aria-label','收藏'+x.zh);fav.setAttribute('aria-pressed',String(state.favorites.includes(x.id)));card.append(wear,fav);if(x.brand)card.append(el('span',BRANDS[x.brand].latin,'brand-tag'));if(state.wardrobe.locks[x.slot]===x.id)card.append(el('span','已锁定','item-lock'));return card;}));
 if(!filtered.length){const empty=el('div',undefined,'wardrobe-empty');empty.append(el('p',filters.view==='recent'?'这里还没有匹配的单品。穿上单品后会记入最近使用。':'没有匹配的单品，试试调整筛选条件。'),button('查看全部单品',resetFilters));grid.append(empty);}
 grid.scrollTop=filters.positions[inventoryKey]||0;
 const count=Number(Boolean(filters.style))+Number(Boolean(filters.color));$('#openFilters').textContent='筛选'+(count?' · '+count:'');$('#openFilters').setAttribute('aria-pressed',String(count>0));$('#favoriteFilter').setAttribute('aria-pressed',String(filters.favoritesOnly));$('#wardrobeCount').textContent=filtered.length+' 件';$('#filterSummary').textContent='当前筛选：'+filtered.length+' 件匹配单品';
 renderMobileLookBar();$('.prototype-note').textContent=inventory.length+' 件单品 · 锁定喜欢的单品，再试试局部随机';save();
}
window.addEventListener('online',renderInventory);
async function renderStage(ticket=++renderId){const look={...state.look};const scene=state.scene;const canvas=$('#outfitCanvas');if(readyPlan&&canvas.dataset.look===JSON.stringify(look)&&canvas.dataset.scene===scene)return;const plan=planFor(look,scene);try{const buffer=document.createElement('canvas');buffer.width=1024;buffer.height=1536;await drawPlan(buffer,plan);if(ticket!==renderId)return;canvas.getContext('2d').clearRect(0,0,1024,1536);canvas.getContext('2d').drawImage(buffer,0,0);canvas.dataset.look=JSON.stringify(look);canvas.dataset.scene=scene;canvas.dataset.renderSource=JSON.stringify(plan.renderSource||{engine:'unknown'});readyPlan=plan;$('#exportBtn').disabled=false;$('#stage').setAttribute('aria-label',`当前穿搭：${Object.values(look).map(id=>getItem(id)?.zh).filter(Boolean).join('、')}`);}catch(error){if(ticket===renderId){readyPlan=null;$('#exportBtn').disabled=true;toast(error.message);}}}
function queueStageRender(){const ticket=++renderId;cancelAnimationFrame(stageFrame);stageFrame=requestAnimationFrame(()=>{stageFrame=0;renderStage(ticket);});}
function speak(text){playRecording(text,state.settings.slow,()=>speakSystem(text));}
function speakSystem(text,onEnd=()=>{},onError=()=>{}){if(!voices.length){toast('当前设备没有日语声音，可继续文字练习。');onError(new Error('没有日语声音'));return;}const synth=window.speechSynthesis;synth.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='ja-JP';utterance.voice=chooseVoice(voices,state.settings.voiceURI);utterance.rate=state.settings.slow?.82:.96;utterance.pitch=1;utterance.onend=onEnd;utterance.onerror=event=>{toast('朗读未能播放，请重试或使用文字练习。');onError(event);};synth.speak(utterance);}
function hasSpeech(speech){return Array.isArray(speech)?speech.every(line=>hasRecording(line.jp||line)):hasRecording(speech);}
function speakLines(lines,callbacks={}){return playSequence(lines,state.settings.slow,(text,next,error)=>speakSystem(text,next,error),callbacks);}
function voiceButton(text,label='▶ 朗读'){const b=button(label,()=>speak(text),'text-btn');b.disabled=!voices.length&&!hasRecording(text);return b;}
function sentence(row,sessionKey){
 const meta=Array.isArray(row)?null:row,[jp,reading,zh]=meta?[row.jp,row.reading,row.zh]:row;
 if(meta?.id){state.learning=markViewed(state.learning,'expression:'+meta.id);save();}
 const saved=sessionKey?state.study.sentences[sessionKey]||{}:{};
 let blanked=Boolean(meta&&saved.blanked),translationHidden=typeof saved.translationHidden==='boolean'?saved.translationHidden:blanked;
 const persistSentence=()=>{if(sessionKey){state.study.sentences[sessionKey]={blanked,translationHidden};save();}};
 const box=el('div',undefined,`sentence-block${meta?' advanced-sentence':''}`),sentenceText=el('p',jp,'sentence'),readingText=state.settings.kana?el('p',reading,'reading'):null,translation=el('p',zh,'translation'),actions=el('div',undefined,'sentence-actions');
 if(row.context)box.append(el('small',row.context,'example-context'));
 if(meta){const tags=el('div',undefined,'grammar-tags');tags.append(el('span',meta.level,'level-tag'),el('strong',meta.grammar));box.append(tags);}
 box.append(sentenceText);if(readingText)box.append(readingText);box.append(translation);
 actions.append(voiceButton(jp));
 if(meta){
  const tags=box.querySelector('.grammar-tags'),note=el('p',meta.note,'grammar-note');
  const reveal=button('',()=>{translationHidden=!translationHidden;update();persistSentence();},'text-btn');
  const cloze=button('',()=>{blanked=!blanked;translationHidden=blanked;update();persistSentence();},'text-btn');
  const shadow=button('跟读与录音',()=>shadowing.open(meta),'text-btn');
  function update(){
   const shown=blanked?clozeExample(meta):meta;sentenceText.textContent=shown.jp;if(readingText)readingText.textContent=shown.reading;
   translation.hidden=translationHidden;reveal.textContent=translationHidden?'显示中文':'隐藏中文';cloze.textContent=blanked?'显示答案':'填空自测';
   tags.style.display=blanked?'none':'';note.hidden=blanked;
  }
  actions.append(reveal,cloze,shadow);if(meta.id)actions.append(button('练这句表达',()=>ask('expression:'+meta.id),'text-btn expression-practice'));box.append(note);update();
 }
 box.append(actions);return box;
}
function renderWord(){const id=activeLexeme(),item=activeItem(),itemMode=!state.studyLexeme&&item&&item.lexeme===id,lex=itemMode?itemLexeme(item,LEXEMES[id]):LEXEMES[id];const basicExamples=itemMode?[...itemExampleSentences(item,lex).map(row=>Object.assign([...row],{context:'单品描述'})),...lex.sentences.map(row=>Object.assign([...row],{context:'词汇例句'}))]:lex.sentences;const examples=studyLevel==='advanced'?advancedItemExamples(itemMode?item:null,lex):basicExamples;state.learning=markViewed(state.learning,id);save();const card=$('#wordCard');card.classList.toggle('advanced',studyLevel==='advanced');const positionKey=`${itemMode?'item:'+item.id:'lexeme:'+id}:${studyLevel}`,sentenceIndex=(state.study.wordPositions[positionKey]||0)%examples.length;const next=button('',()=>{const current=(Number(card.dataset.sentenceIndex||0)+1)%examples.length;card.dataset.sentenceIndex=String(current);state.study.wordPositions[positionKey]=current;save();card.querySelector('.sentence-block').replaceWith(sentence(examples[current],`${positionKey}:${current}`));next.textContent=`${studyLevel==='advanced'?'换个句型':'换一句'}（${current+1}/${examples.length}）`;},'text-btn');next.textContent=`${studyLevel==='advanced'?'换个句型':'换一句'}（${sentenceIndex+1}/${examples.length}）`;card.dataset.sentenceIndex=String(sentenceIndex);card.replaceChildren(el('p',lex.jp,'jp'));if(state.settings.kana)card.append(el('p',lex.reading,'reading'));card.append(el('p',lex.zh,'meaning'),el('span',`搭配动词：${lex.verb}`,'verb'),el('small',reviewStatus(state.learning[id]),'review-state'));if(itemMode){const vocab=el('div',undefined,'item-vocabulary');itemVocabulary(item,lex).forEach(({label,word})=>{const chip=el('div',undefined,'vocab-chip');chip.append(el('small',label),el('strong',word.jp),...(state.settings.kana?[el('span',word.reading)]:[]),el('em',word.zh));vocab.append(chip);});card.append(vocab);}card.append(voiceButton(lex.jp,'▶ 单词发音'),sentence(examples[sentenceIndex],`${positionKey}:${sentenceIndex}`),next);if(!state.studyLexeme&&item?.brand){const brand=BRANDS[item.brand],info=el('div',undefined,'brand-info');info.append(el('strong',`${brand.latin}｜${brand.ja}`),voiceButton(brand.ja,'▶ 品牌发音'),button('练品牌名',()=>ask(`brand:${item.brand}`),'text-btn'));const source=el('a','官方款式参考 ↗');source.href=item.sourceUrl;source.target='_blank';source.rel='noopener noreferrer';if(item.sourceUrl)info.append(source);const intro=BRAND_INTROS[item.brand];if(intro){info.append(el('p',intro[0],'brand-intro-jp'),el('p',intro[1],'brand-intro-zh'),voiceButton(intro[0],'▶ 品牌介绍'));}card.append(info);}if(!voices.length&&!hasRecordings())card.append(el('p','此设备暂无日语声音，文字练习正常可用。','voice-note'));$('#lexemeSelect').value=id;renderReviewCount();}
function renderReviewCount(){const count=dueTargets(state.learning).filter(id=>createQuestion({target:id})).length;$('#reviewBtn').textContent=`复习到期内容 · ${count}`;$('#reviewBtn').disabled=count===0;}
function selectLearningTab(tab){if(learningTab!==tab){dialogueUI.stop();stopRecording();}learningTab=tab;document.body.classList.toggle('dialogue-study',tab==='dialogue');$('#slowSetting').checked=state.settings.slow;state.study.tab=tab;save();document.querySelectorAll('[data-learning-tab]').forEach(button=>button.setAttribute('aria-selected',String(button.dataset.learningTab===tab)));document.querySelectorAll('[data-learning-panel]').forEach(panel=>panel.hidden=panel.dataset.learningPanel!==tab);}
function setPracticeMode(mode){const changed=practiceMode!==mode;practiceMode=mode;state.study.practiceMode=mode;if(changed){stopRecording();question=null;answered=false;feedback='';}save();document.querySelectorAll('[data-practice-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.practiceMode===mode)));renderQuestion();}
function ask(target){stopRecording();selectLearningTab('practice');const lex=activeLexeme(),row=shuffle(SCENE_CONTENT.filter(r=>r.scene===state.scene))[0];let selected=target;if(!selected&&reviewMode)selected=dueTargets(state.learning).find(id=>createQuestion({target:id}));if(!selected&&reviewMode){reviewMode=false;toast('到期内容复习完了，今天辛苦啦。');}if(!selected)selected=practiceMode==='scene'||practiceMode==='listening'||state.settings.mode==='scene'?`life:${row.id}`:lex;question=createQuestion({target:selected,scene:state.scene,listening:practiceMode==='listening',verb:practiceMode==='word'&&Math.random()<.35});answered=false;feedback='';renderQuestion();}
function renderQuestion(){
 if(!question){$('#questionCard').replaceChildren(button('开始一题',()=>ask(),'text-btn'));return;}
 const box=$('#questionCard');box.replaceChildren(el('p',question.prompt));
 if(question.listening){if(Array.isArray(question.speech)){const status=el('p','','reading');status.id='questionAudioStatus';const play=button('▶ 播放完整对话',()=>speakLines(question.speech,{onLine:(index,line)=>status.textContent='正在播放 '+(index+1)+'/'+question.speech.length+' · '+line.speaker,onEnd:()=>status.textContent='播放完毕',onError:()=>status.textContent='音频暂时不可用，请重试。'}),'text-btn');play.disabled=!voices.length&&!hasSpeech(question.speech);box.append(play,button('停止播放',stopRecording,'text-btn'),status);}else box.append(voiceButton(question.speech,'▶ 播放题目'));}
 const options=el('div',undefined,'options');question.options.forEach(o=>{const b=button(o.text,()=>answer(o.id));b.disabled=answered;b.dataset.optionId=o.id;if(answered&&(question.answers||[question.answer]).includes(o.id))b.classList.add('correct-answer');options.append(b);});box.append(options);
 if(feedback)box.append(el('p',feedback,'feedback'));
 if(answered&&question.transcript){const details=el('details');details.append(el('summary','查看对话原文'));for(const line of question.transcript)details.append(el('small',line.speaker),sentence([line.jp,line.reading,line.zh]));box.append(details);}
 box.append(button(answered?'下一题':'跳过',()=>ask(),'text-btn'));
}
function answer(id){if(answered)return;stopRecording();answered=true;const correct=(question.answers||[question.answer]).includes(id);state.learning=recordReview(state.learning,question.target,correct);const alternatives=question.options.filter(o=>(question.answers||[question.answer]).includes(o.id)).map(o=>o.text).join(' / ');feedback=correct?'答对了！'+(question.choiceFeedback?.[id]||question.explain):'可用表达：'+alternatives+'。'+(question.choiceFeedback?.[id]||question.explain);save();renderQuestion();renderReviewCount();}
function renderScene(){
 const id=state.scene;$('#sceneSelect').value=id;const rows=SCENE_CONTENT.filter(row=>row.scene===id),brief=$('#sceneBrief'),vocabulary=$('#sceneVocabulary'),initial=(state.study.scenePositions[id]||0)%rows.length;
 const line=el('p',rows[initial].jp,'scene-line'),reading=el('p',rows[initial].reading,'reading'),translation=el('small',rows[initial].zh),speakButton=voiceButton(rows[initial].jp,'▶ 听这句话');
 const practice=()=>{const current=Number(brief.dataset.sceneIndex||0);setPracticeMode('scene');ask(`life:${rows[current].id}`);};
 const next=button(`换一句场景表达（${initial+1}/${rows.length}）`,()=>{const current=(Number(brief.dataset.sceneIndex||0)+1)%rows.length;brief.dataset.sceneIndex=String(current);state.study.scenePositions[id]=current;save();line.textContent=rows[current].jp;reading.textContent=rows[current].reading;translation.textContent=rows[current].zh;speakButton.onclick=()=>speak(rows[current].jp);speakButton.disabled=!voices.length&&!hasRecording(rows[current].jp);next.textContent=`换一句场景表达（${current+1}/${rows.length}）`;},'text-btn');
 brief.dataset.sceneIndex=String(initial);brief.replaceChildren(el('strong',SCENES.find(s=>s[0]===id)[1]),line,...(state.settings.kana?[reading]:[]),translation,speakButton,next);
 const words=SCENE_VOCABULARY[id]||[];vocabulary.replaceChildren(...words.map(([jp,kana,zh])=>{const chip=button('',()=>speak(jp),'scene-word');chip.setAttribute('aria-label',`朗读${jp}`);chip.append(el('strong',jp),...(state.settings.kana?[el('span',kana)]:[]),el('small',zh));return chip;}));
 $('#sceneSentenceCount').textContent=`${rows.length} 句 · ${words.length} 词`;$('#scenePracticeBtn').onclick=practice;
 const card=$('#challengeCard');card.replaceChildren(el('h3','这个场景怎么说？'),button('练一句场景日语',practice,'text-btn'));
}

const shadowing=createShadowing({speak,canSpeak:text=>Boolean(voices.length)||hasRecording(text),stopPlayback:stopRecording,kana:()=>state.settings.kana});
const dialogueUI=createDialogueUI({root:$('#dialogueCard'),getState:()=>state,save,review:(target,correct,options)=>{state.learning=recordReview(state.learning,target,correct,Date.now(),options);save();renderReviewCount();},speak,play:speakLines,canPlay:lines=>Boolean(voices.length)||hasSpeech(lines),stopPlayback:stopRecording,shadow:row=>shadowing.open(row)});
function challengeMet(){const worn=Object.values(state.look).map(getItem).filter(Boolean),has=(slot,tag)=>worn.some(x=>x.slot===slot&&x.tags.includes(tag));switch(state.scene){case'cafe':case'dinner':return !!(state.look.shoes&&(state.look.dress||(state.look.top&&state.look.bottom)));case'rain':return has('outer','rain');case'walk':return has('shoes','walking');case'trip':return has('shoes','travel')||has('bag','travel');case'winter':return has('outer','warm');case'museum':return worn.some(x=>['classic','casual'].includes(x.style));case'summer':return !!(state.look.top||state.look.dress);default:return worn.length>0;}}
function render(){const free=state.settings.mode==='free';document.body.classList.toggle('free-mode',free);document.body.classList.toggle('reduced',state.settings.reduced);$('#learnPanel').hidden=free;$('#challengeCard').hidden=false;$('#learningToggle').setAttribute('aria-pressed',String(!free));document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===state.settings.mode);b.setAttribute('aria-pressed',String(b.dataset.mode===state.settings.mode));});$('#kanaSetting').checked=state.settings.kana;$('#motionSetting').checked=state.settings.reduced;$('#slowSetting').checked=state.settings.slow;$('#undoBtn').disabled=!history.length;$('#redoBtn').disabled=!future.length;$('#albumCount').textContent=state.albums.length;renderInventory();queueStageRender();renderScene();dialogueUI.render();if(!free){renderWord();renderQuestion();}}
function openAlbum(){
 if(albumObserver)albumObserver.disconnect();
 const grid=$('#albumGrid');grid.replaceChildren();
 if('IntersectionObserver' in window)albumObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){albumObserver.unobserve(entry.target);entry.target.drawAlbum();}}},{root:$('#albumDialog'),rootMargin:'160px'});
 for(const album of [...state.albums].reverse()){
  const card=el('article',undefined,'album-look'),name=el('input');name.value=album.name;name.maxLength=60;name.setAttribute('aria-label','穿搭名称');name.onchange=()=>{album.name=name.value.trim()||'我的穿搭';save();};
  const canvas=el('canvas');canvas.width=256;canvas.height=384;canvas.drawAlbum=()=>drawPlan(canvas,planFor(album.look,album.scene)).catch(()=>{canvas.setAttribute('aria-label','穿搭预览加载失败');});
  card.append(canvas,name,button('恢复穿搭',()=>{mutate(()=>{state.wardrobe.locks={};state.look=cleanLook(album.look);state.scene=album.scene;state.studyLexeme=null;state.focus=Object.values(state.look)[0]||'top_blouse';});$('#albumDialog').close();}),button('删除',()=>{state.albums=state.albums.filter(a=>a.id!==album.id);save();$('#albumCount').textContent=state.albums.length;openAlbum();},'text-btn'));
  grid.append(card);if(albumObserver)albumObserver.observe(canvas);else canvas.drawAlbum();
 }
 if(!state.albums.length)grid.append(el('p','保存第一套穿搭，让今天留下来。'));
 if(!$('#albumDialog').open)$('#albumDialog').showModal();
}
$('#albumDialog').addEventListener('close',()=>{if(albumObserver)albumObserver.disconnect();});

function download(blob,name){const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function exportLook(){const b=$('#exportBtn');b.disabled=true;try{const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=1536;const plan=planFor({...state.look},state.scene);if(plan.prototypeItems.length)throw Error('当前搭配包含尚未完成的素材');await drawPlan(canvas,plan);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('图片导出失败，请重试');if(matchMedia('(max-width:899px)').matches){showMobileExport(blob);}else{download(blob,'言叶衣橱-今日穿搭.png');}toast('已生成与舞台一致的穿搭图片。');}catch(e){toast(e.message);}finally{b.disabled=false;}}
async function importBackup(file){try{if(!file||file.size>1024*1024)throw Error('请选择1MB以内的备份文件');const next=normalizeSave(JSON.parse(await file.text()));state=next;restoreWardrobe();history=[];future=[];question=null;answered=false;feedback='';reviewMode=false;dialogueUI.stop();restoreStudy();save();render();restoreMobileView(state.study.mobileView);toast('已恢复备份。');}catch(e){toast(`导入失败：${e.message}`);}finally{$('#importInput').value='';}}
$('#sceneSelect').replaceChildren(...SCENES.map(([id,name])=>{const o=el('option',name);o.value=id;return o;}));
$('#lexemeSelect').replaceChildren(...Object.entries(LEXEMES).map(([id,l])=>{const o=el('option',`${l.jp}｜${l.zh}`);o.value=id;return o;}));
$('#undoBtn').onclick=()=>undo();$('#redoBtn').onclick=()=>undo(true);
$('#resetBtn').onclick=()=>mutate(()=>{state.wardrobe.locks={};state.look={...INITIAL_LOOK};state.studyLexeme=null;state.focus='top_blouse';});
$('#randomBtn').onclick=()=>randomize();
$('#colorFilter').replaceChildren(...[['','全部颜色'],...Object.entries(COLOR_LABELS).filter(([color])=>inventory.some(x=>x.color===color))].map(([value,label])=>{const option=el('option',label);option.value=value;return option;}));
for(const [id,field,event] of [['searchInput','query','input'],['styleFilter','style','change'],['colorFilter','color','change'],['browseFilter','view','change']])$('#'+id).addEventListener(event,e=>{state.wardrobe[field]=e.target.value;renderInventory();save();});
$('#favoriteFilter').onclick=()=>{state.wardrobe.favoritesOnly=!state.wardrobe.favoritesOnly;renderInventory();save();};
$('#itemGrid').addEventListener('scroll',()=>{if(!inventoryKey)return;state.wardrobe.positions[inventoryKey]=$('#itemGrid').scrollTop;clearTimeout(scrollSaveTimer);scrollSaveTimer=setTimeout(save,180);},{passive:true});
window.addEventListener('pagehide',save);
$('#openFilters').onclick=()=>$('#filterDialog').showModal();$('#closeFilters').onclick=$('#applyFilters').onclick=()=>$('#filterDialog').close();$('#clearFilters').onclick=resetFilters;
$('#lookDialog').addEventListener('close',()=>$('#manageLook')?.focus());$('#closeLook').onclick=()=>$('#lookDialog').close();$('#unlockAll').onclick=()=>mutate(()=>state.wardrobe.locks={});
$('#clearLook').onclick=()=>mutate(()=>{state.look=Object.fromEntries(Object.entries(state.look).filter(([slot])=>slot==='hair'||state.wardrobe.locks[slot]));state.focus=Object.values(state.look)[0]||inventory[0]?.id;state.studyLexeme=null;toast('已清空未锁服饰，保留发型和锁定单品。');});
function setMode(mode){dialogueUI.stop();state.settings.mode=mode;question=null;save();render();}
$('#learningToggle').onclick=()=>setMode(state.settings.mode==='free'?'light':'free');document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('#lexemeSelect').onchange=e=>{state.studyLexeme=e.target.value;question=null;renderWord();renderQuestion();};
document.querySelectorAll('[data-study-level]').forEach(control=>control.onclick=()=>{studyLevel=control.dataset.studyLevel;state.study.level=studyLevel;save();document.querySelectorAll('[data-study-level]').forEach(button=>button.setAttribute('aria-pressed',String(button===control)));renderWord();});
document.querySelectorAll('[data-learning-tab]').forEach(control=>control.onclick=()=>selectLearningTab(control.dataset.learningTab));
document.querySelectorAll('[data-practice-mode]').forEach(control=>control.onclick=()=>setPracticeMode(control.dataset.practiceMode));
$('#sceneSelect').onchange=e=>{reviewMode=false;mutate(()=>{state.scene=e.target.value;});toast('背景与生活例句已切换。');};
$('#challengeBtn').onclick=()=>toast(challengeMet()?'搭配条件满足！接下来可以练一句生活日语。':SCENE_HINTS[state.scene]);
$('#newQuestionBtn').onclick=()=>ask();$('#reviewBtn').onclick=()=>{reviewMode=true;ask();};$('#speakBtn').onclick=()=>{if(learningTab==='dialogue'){toast('请使用会话卡中的播放按钮。');return;}if(learningTab==='scene'){const rows=SCENE_CONTENT.filter(row=>row.scene===state.scene),index=Number($('#sceneBrief').dataset.sceneIndex||0);speak(rows[index]?.jp||LEXEMES[activeLexeme()].jp);}else speak((state.studyLexeme?LEXEMES[activeLexeme()]:itemLexeme(activeItem(),LEXEMES[activeLexeme()])).jp);};
$('#saveLookBtn').onclick=()=>{if(state.albums.length>=30){toast('相册已满30套，请先删除不需要的穿搭。');return;}state.albums.push({id:crypto.randomUUID(),name:`${SCENES.find(s=>s[0]===state.scene)[1]} · ${state.albums.length+1}`,look:{...state.look},scene:state.scene});save();$('#albumCount').textContent=state.albums.length;toast('穿搭已保存，可在相册改名。');};
$('#albumBtn').onclick=openAlbum;$('#closeAlbum').onclick=()=>$('#albumDialog').close();$('#exportBtn').onclick=exportLook;
$('#backupBtn').onclick=()=>download(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),'言叶衣橱-备份.json');$('#importInput').onchange=e=>importBackup(e.target.files[0]);
for(const [id,setting] of [['kanaSetting','kana'],['motionSetting','reduced'],['slowSetting','slow']])$('#'+id).onchange=e=>{state.settings[setting]=e.target.checked;save();render();};
function refreshVoices(){voices=rankVoices(window.speechSynthesis?.getVoices()||[]);const select=$('#voiceSelect');select.replaceChildren(...voices.map(v=>{const o=el('option',v.name.replace('Microsoft ','').replace(' - Japanese (Japan)',''));o.value=v.voiceURI;return o;}));const chosen=chooseVoice(voices,state.settings.voiceURI);select.value=chosen?.voiceURI||'';$('#voiceStatus').textContent=hasRecordings()?'优先播放固定日语音频，会话用不同音色区分角色；下方声音用于备用朗读。':voices.some(v=>/Natural|Neural/i.test(v.name))?'已提供自然日语音色，可试听选择。':voices.length?'当前设备提供系统日语音色；自然音色可用时会自动优先。':'当前浏览器未提供日语声音。';$('#voicePreview').disabled=!voices.length&&!hasRecordings();$('#speakBtn').disabled=!voices.length&&!hasRecordings();renderScene();if(state.settings.mode!=='free'){renderWord();if(question?.listening&&!voices.length&&!hasSpeech(question.speech))ask(question.target);else renderQuestion();}dialogueUI.render();}
if(window.speechSynthesis)window.speechSynthesis.addEventListener('voiceschanged',refreshVoices);
$('#voiceSelect').onchange=e=>{state.settings.voiceURI=e.target.value;save();};$('#voicePreview').onclick=()=>speak('こんにちは。今日は何を着ますか。');
function restoreStudy(){
 state.study=normalizeStudy(state.study);studyLevel=state.study.level;
 document.querySelectorAll('[data-study-level]').forEach(control=>control.setAttribute('aria-pressed',String(control.dataset.studyLevel===studyLevel)));
 selectLearningTab(state.study.tab);setPracticeMode(state.study.practiceMode);
}
document.addEventListener('kotoba:mobile-view',event=>{if(event.detail==='wardrobe')dialogueUI.stop();state.study.mobileView=event.detail;save();});
restoreWardrobe();restoreStudy();render();refreshVoices();restoreMobileView(state.study.mobileView);document.body.dataset.appReady='true';
