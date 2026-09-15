const media=matchMedia('(max-width:899px)');
const tabs=document.querySelector('.mobile-tabs');
function select(view){
 if(view==='study'&&document.querySelector('#learnPanel').hidden)document.querySelector('[data-mode="light"]').click();
 document.body.classList.toggle('mobile-study',view==='study');
 for(const button of tabs.querySelectorAll('button'))button.setAttribute('aria-selected',String(button.dataset.view===view));
}
tabs.addEventListener('click',event=>{const button=event.target.closest('[data-view]');if(button)select(button.dataset.view)});
document.querySelector('#learningToggle').addEventListener('click',()=>{if(media.matches)select(document.querySelector('#learnPanel').hidden?'wardrobe':'study')});
media.addEventListener('change',()=>{if(!media.matches)document.body.classList.remove('mobile-study');else select('wardrobe')});
export function showMobileExport(blob){
 const dialog=document.createElement('dialog');dialog.id='mobileExport';dialog.innerHTML='<button class="dialog-close" aria-label="关闭">×</button><h2>保存这套穿搭</h2><p>长按图片，选择存储到照片。</p><img alt="导出的完整穿搭" style="display:block;width:100%;height:auto;border-radius:12px">';document.body.append(dialog);const url=URL.createObjectURL(blob);dialog.querySelector('img').src=url;dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{URL.revokeObjectURL(url);dialog.remove()},{once:true});dialog.showModal();
}
// Keep the preview identical to the current stage; zoom never changes the look.
const stage=document.querySelector('#stage');
function openCharacterZoom(){
 if(!media.matches)return;
 const dialog=document.createElement('dialog');dialog.id='characterZoom';dialog.innerHTML='<div class="zoom-bar"><span>穿搭预览</span><button type="button" aria-label="关闭放大预览">完成</button></div><div class="zoom-scroll"><img alt="放大的当前穿搭，点按图片切换两倍大小"></div><p>点按图片放大，再点恢复 · 放大后可滑动查看</p>';
 const image=dialog.querySelector('img');image.src=document.querySelector('#outfitCanvas').toDataURL('image/png');image.onclick=()=>dialog.classList.toggle('detail-zoom');dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove(),{once:true});document.body.append(dialog);dialog.showModal();
}
stage.addEventListener('click',openCharacterZoom);
stage.addEventListener('keydown',e=>{if(media.matches&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openCharacterZoom()}});
function stageAccessibility(){stage.tabIndex=media.matches?0:-1;stage.setAttribute('role',media.matches?'button':'img');stage.title=media.matches?'点按放大当前穿搭':'';}
stageAccessibility();media.addEventListener('change',stageAccessibility);
