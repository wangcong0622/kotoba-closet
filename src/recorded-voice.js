import {NANAMI_AUDIO} from '../data/audio-nanami.js';
import {LIFE_AUDIO} from '../data/life-audio.js';
const recordings={...NANAMI_AUDIO,...LIFE_AUDIO},player=new Audio();player.preload='none';let ticket=0,sequence=0;
export const hasRecording=text=>Boolean(recordings[text]);
export const hasRecordings=()=>Object.keys(recordings).length>0;
export function stopRecording(){sequence++;ticket++;player.pause();player.onended=null;player.onerror=null;window.speechSynthesis?.cancel();}
function playSingle(text,slow,fallback,onEnd=()=>{}){
 const current=++ticket;player.pause();window.speechSynthesis?.cancel();let failed=false;
 const retry=()=>{if(current!==ticket||failed)return;failed=true;player.pause();player.onended=null;player.onerror=null;fallback();};
 const src=recordings[text];if(!src){retry();return;}
 player.onended=()=>{if(current===ticket&&!failed)onEnd();};player.onerror=retry;
 player.src=src;player.playbackRate=slow?.82:1;player.preservesPitch=true;
 player.play().catch(retry);
}
export function playRecording(text,slow,fallback){stopRecording();playSingle(text,slow,fallback);}
export function playSequence(lines,slow,fallback,{onLine=()=>{},onEnd=()=>{},onError=()=>{}}={}){
 stopRecording();const current=sequence;let index=0;
 function next(){if(sequence!==current)return;if(index>=lines.length){onEnd();return;}const line=lines[index];onLine(index++,line);playSingle(typeof line==='string'?line:line.jp,slow,()=>fallback(typeof line==='string'?line:line.jp,()=>{if(sequence===current)next();},error=>{if(sequence===current){stopRecording();onError(error);}}),next);}
 next();return ()=>{if(sequence===current)stopRecording();};
}
