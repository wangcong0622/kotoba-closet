import {NANAMI_AUDIO} from '../data/audio-nanami.js';
const player=new Audio();player.preload='none';let ticket=0;
export const hasRecording=text=>Boolean(NANAMI_AUDIO[text]);
export const hasRecordings=()=>Object.keys(NANAMI_AUDIO).length>0;
export function playRecording(text,slow,fallback){
 const current=++ticket;player.pause();window.speechSynthesis?.cancel();
 const src=NANAMI_AUDIO[text];if(!src){fallback();return;}
 player.src=src;player.playbackRate=slow?.82:1;player.preservesPitch=true;
 player.play().catch(()=>{if(current===ticket)fallback()});
}
