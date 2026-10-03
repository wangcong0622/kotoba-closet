// Optional local recording. No recording is uploaded or written to the save file.
export function createShadowing({speak,canSpeak,stopPlayback,kana}){
 const dialog=document.createElement('dialog');dialog.id='shadowDialog';dialog.setAttribute('aria-labelledby','shadowTitle');
 dialog.innerHTML='<button class="dialog-close" aria-label="关闭跟读">×</button><h2 id="shadowTitle">跟读这句话</h2><p class="shadow-jp"></p><p class="reading shadow-reading"></p><p class="translation shadow-translation"></p><button id="shadowOriginal">▶ 听原音</button><p class="shadow-hint">录音只在本次页面中保留，不会上传。每次最多 60 秒。</p><div class="shadow-actions"><button id="shadowRecord">开始录音</button><button id="shadowStop" disabled>停止录音</button></div><audio id="shadowReplay" controls hidden></audio><p id="shadowStatus" role="status"></p>';
 document.body.append(dialog);const $=selector=>dialog.querySelector(selector);let example=null,recorder=null,stream=null,url=null,timer=null,session=0;
 const status=text=>$('#shadowStatus').textContent=text;
 function releaseStream(){stream?.getTracks().forEach(track=>track.stop());stream=null;}
 function clearClip(){const audio=$('#shadowReplay');audio.pause();audio.removeAttribute('src');audio.hidden=true;if(url)URL.revokeObjectURL(url);url=null;}
 function clean(){session++;clearTimeout(timer);if(recorder?.state==='recording')recorder.stop();recorder=null;releaseStream();clearClip();stopPlayback();}
 function stop(){if(recorder?.state==='recording'){clearTimeout(timer);$('#shadowStop').disabled=true;recorder.stop();releaseStream();}}
 async function record(){
  stopPlayback();clearClip();const current=session;$('#shadowRecord').disabled=true;status('正在请求麦克风……');
  try{
   const incoming=await navigator.mediaDevices.getUserMedia({audio:true});if(current!==session){incoming.getTracks().forEach(track=>track.stop());return;}stream=incoming;
   const mime=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(type=>MediaRecorder.isTypeSupported(type));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});const active=recorder,chunks=[];
   active.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
   active.onstop=()=>{incoming.getTracks().forEach(track=>track.stop());if(current!==session)return;releaseStream();clearTimeout(timer);recorder=null;$('#shadowRecord').disabled=false;$('#shadowStop').disabled=true;if(!chunks.length){status('没有录到声音，请重试。');return;}url=URL.createObjectURL(new Blob(chunks,{type:active.mimeType||mime||'audio/webm'}));const audio=$('#shadowReplay');audio.src=url;audio.hidden=false;status('可以回放自己的录音，再与原音比较。');};
   active.onerror=()=>{incoming.getTracks().forEach(track=>track.stop());if(current!==session)return;releaseStream();clearTimeout(timer);recorder=null;$('#shadowRecord').disabled=false;$('#shadowStop').disabled=true;status('录音未能完成，请重试。');};
   active.start();$('#shadowStop').disabled=false;status('正在录音……');timer=setTimeout(stop,60000);
  }catch(error){if(current!==session)return;releaseStream();$('#shadowRecord').disabled=false;$('#shadowStop').disabled=true;status(error.name==='NotAllowedError'?'未获得麦克风权限，仍可播放原音跟读。':'当前设备无法录音，仍可播放原音跟读。');}
 }
 $('#shadowOriginal').onclick=()=>{if(recorder?.state==='recording'){status('请先停止录音，再听原音。');return;}$('#shadowReplay').pause();speak(example.jp);};$('#shadowRecord').onclick=record;$('#shadowStop').onclick=stop;
 $('#shadowReplay').addEventListener('play',stopPlayback);$('.dialog-close').onclick=()=>dialog.close();dialog.addEventListener('close',clean);window.addEventListener('pagehide',clean);
 return {open(row){clean();example=row;$('.shadow-jp').textContent=row.jp;$('.shadow-reading').textContent=row.reading;$('.shadow-reading').hidden=!kana();$('.shadow-translation').textContent=row.zh;$('#shadowOriginal').disabled=!canSpeak(row.jp);$('#shadowStop').disabled=true;const supported=Boolean(navigator.mediaDevices?.getUserMedia&&window.MediaRecorder);$('#shadowRecord').disabled=!supported;status(supported?'先听原音，试着按停顿跟读，再录下自己的表达。':'当前浏览器不支持录音，可继续播放原音跟读。');dialog.showModal();},close(){if(dialog.open)dialog.close();else clean();}};
}
