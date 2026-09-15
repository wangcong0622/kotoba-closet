export function rankVoices(voices){return voices.filter(v=>/^ja(?:-|_)/i.test(v.lang)).sort((a,b)=>score(b)-score(a));}
function score(v){return (/Natural|Neural/i.test(v.name)?100:0)+(/Nanami|Aoi/i.test(v.name)?20:0)+(/Google/i.test(v.name)?10:0)+(v.default?1:0);}
export function chooseVoice(voices,preferred){return voices.find(v=>v.voiceURI===preferred)||rankVoices(voices)[0];}
