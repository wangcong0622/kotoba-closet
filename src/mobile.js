const media=matchMedia('(max-width:899px)');
const tabs=document.querySelector('.mobile-tabs');
const stageToggle=document.querySelector('#stageToggle');
const stage=document.querySelector('#stage');
function select(view){
 if(view==='study'&&document.querySelector('#learnPanel').hidden)document.querySelector('[data-mode="light"]').click();
 document.body.classList.toggle('mobile-study',view==='study');
 for(const button of tabs.querySelectorAll('[data-view]'))button.setAttribute('aria-selected',String(button.dataset.view===view));
}
tabs.addEventListener('click',event=>{const button=event.target.closest('[data-view]');if(button)select(button.dataset.view)});
document.querySelector('#learningToggle').addEventListener('click',()=>{if(media.matches)select(document.querySelector('#learnPanel').hidden?'wardrobe':'study')});
media.addEventListener('change',()=>{if(!media.matches)document.body.classList.remove('mobile-study');else select('wardrobe')});
export function showMobileExport(blob){
 const dialog=document.createElement('dialog');dialog.id='mobileExport';dialog.innerHTML='<button class="dialog-close" aria-label="关闭">×</button><h2>保存这套穿搭</h2><p>长按图片，选择存储到照片。</p><img alt="导出的完整穿搭" style="display:block;width:100%;height:auto;border-radius:12px">';document.body.append(dialog);const url=URL.createObjectURL(blob);dialog.querySelector('img').src=url;dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{URL.revokeObjectURL(url);dialog.remove()},{once:true});dialog.showModal();
}
function savedStageState(){
 try{return sessionStorage.getItem('kotoba-stage-collapsed')==='1'}catch{return false}
}
function setStageCollapsed(collapsed){
 collapsed=Boolean(collapsed&&media.matches);
 document.body.classList.toggle('stage-collapsed',collapsed);
 stageToggle.setAttribute('aria-pressed',String(collapsed));
 stageToggle.textContent=collapsed?'展开舞台':'收起舞台';
 try{sessionStorage.setItem('kotoba-stage-collapsed',collapsed?'1':'0')}catch{}
}
stageToggle.addEventListener('click',()=>setStageCollapsed(!document.body.classList.contains('stage-collapsed')));
if(media.matches)setStageCollapsed(savedStageState());

document.addEventListener('click',event=>{
 if(!media.matches||!navigator.vibrate)return;
 if(event.target.closest('.wear-button,.fav,.mobile-tabs button,#undoBtn,#redoBtn,#randomBtn,.stage-actions button,.mobile-look-bar button'))navigator.vibrate(8);
});

let swipeStart=null;
for(const panel of document.querySelectorAll('.wardrobe,.learn')){
 panel.addEventListener('touchstart',event=>{
  if(!media.matches||event.touches.length!==1||event.target.closest('button,input,select,a,.tabs,.item-grid'))return;
  const touch=event.touches[0];swipeStart={x:touch.clientX,y:touch.clientY,view:panel.classList.contains('learn')?'study':'wardrobe'};
 },{passive:true});
 panel.addEventListener('touchend',event=>{
  if(!swipeStart||event.changedTouches.length!==1)return;
  const touch=event.changedTouches[0],dx=touch.clientX-swipeStart.x,dy=touch.clientY-swipeStart.y,start=swipeStart;swipeStart=null;
  if(Math.abs(dx)>72&&Math.abs(dx)>Math.abs(dy)*1.5){if(start.view==='wardrobe'&&dx<0)select('study');if(start.view==='study'&&dx>0)select('wardrobe');}
 },{passive:true});
}

function connectionToast(message){
 const toast=document.querySelector('#toast');if(!toast)return;
 toast.textContent=message;clearTimeout(connectionToast.timer);
 connectionToast.timer=setTimeout(()=>{if(toast.textContent===message)toast.textContent=''},3500);
}
window.addEventListener('offline',()=>connectionToast('已离线：浏览过的服饰仍可继续使用。'));
window.addEventListener('online',()=>connectionToast('网络已恢复。'));
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))window.addEventListener('load',()=>navigator.serviceWorker.register(new URL('../sw.js',import.meta.url)).catch(()=>{}),{once:true});

// Keep the preview identical to the current stage; zoom never changes the look.
function openCharacterZoom(){
 if(!media.matches)return;
 if(document.body.classList.contains('stage-collapsed')){setStageCollapsed(false);return}
 const dialog=document.createElement('dialog');dialog.id='characterZoom';dialog.innerHTML='<div class="zoom-bar"><span>穿搭预览</span><button type="button" aria-label="关闭放大预览">完成</button></div><div class="zoom-scroll"><img alt="放大的当前穿搭，点按图片切换两倍大小"></div><p>点按图片放大，再点恢复 · 放大后可滑动查看</p>';
 const image=dialog.querySelector('img');image.src=document.querySelector('#outfitCanvas').toDataURL('image/png');image.onclick=()=>dialog.classList.toggle('detail-zoom');dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove(),{once:true});document.body.append(dialog);dialog.showModal();
}
stage.addEventListener('click',openCharacterZoom);
stage.addEventListener('keydown',e=>{if(media.matches&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openCharacterZoom()}});
function stageAccessibility(){stage.tabIndex=media.matches?0:-1;stage.setAttribute('role',media.matches?'button':'img');stage.title=media.matches?'点按放大当前穿搭':'';setStageCollapsed(media.matches&&savedStageState());}
stageAccessibility();media.addEventListener('change',stageAccessibility);
