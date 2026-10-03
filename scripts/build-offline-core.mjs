import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {INITIAL_LOOK} from '../src/storage.js';
import {WORN_V18} from '../data/worn-v18.js';
import {ITEMS, LEXEMES} from '../data/content.js';
import {NANAMI_AUDIO} from '../data/audio-nanami.js';
import {LIFE_AUDIO} from '../data/life-audio.js';
import {SCENE_BACKGROUNDS} from '../data/backgrounds.js';
import {buildWornPlan} from '../src/render-worn-v18.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const core=new Set(['./','./index.html','./manifest.webmanifest','./apple-touch-icon.png','./assets/icons/app-icon-192.png','./assets/icons/app-icon-512.png']);
for(const file of Object.values(LIFE_AUDIO))core.add('./'+file);
for(const match of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/href="([^"?#]+\.css)(?:[?#][^"]*)?"/g))core.add('./'+match[1]);
function addModule(file){
 const relative='./'+path.relative(root,file).replaceAll('\\','/');
 if(core.has(relative))return;
 core.add(relative);
 const source=fs.readFileSync(file,'utf8');
 for(const match of source.matchAll(/(?:import|export)\s+(?:[^;]*?\s+from\s+)?['"]([^'"]+)['"]/g)){
  if(match[1].startsWith('.'))addModule(path.resolve(path.dirname(file),match[1]));
 }
}
for(const file of ['src/game.js','src/mobile.js'])addModule(path.join(root,file));
const plan=buildWornPlan({look:INITIAL_LOOK,getItem:id=>ITEMS.find(item=>item.id===id),backgroundSrc:SCENE_BACKGROUNDS.cafe});
for(const layer of plan.layers){
 for(const file of [layer.src,...(layer.cutouts||[]),...(layer.cutoutSources||[]),...(layer.restoreSources||[])])core.add('./'+file);
}
for(const id of Object.values(INITIAL_LOOK)){
 core.add('./'+WORN_V18[id].thumbnail);
 const lexeme=LEXEMES[ITEMS.find(item=>item.id===id)?.lexeme];
 for(const text of [lexeme?.jp,...(lexeme?.sentences||[]).map(row=>row[0])])if(NANAMI_AUDIO[text])core.add('./'+NANAMI_AUDIO[text]);
}
for(const file of core)if(file!=='./'&&!fs.existsSync(path.join(root,file)))throw new Error(`Missing offline resource: ${file}`);
const target=path.join(root,'sw.js'),source=fs.readFileSync(target,'utf8');
const generated='const CORE='+JSON.stringify([...core].sort(),null,1)+';';
const hash=createHash('sha256');
for(const file of [...core].sort()){hash.update(file);hash.update(fs.readFileSync(path.join(root,file==='./'?'index.html':file)));}
const revision='v9-'+hash.digest('hex').slice(0,12);
fs.writeFileSync(target,source.replace(/const CORE=\[[\s\S]*?\];/,generated).replace(/const RELEASE='[^']*';/,`const RELEASE='${revision}';`));
console.log(`Offline core: ${core.size} resources (complete module graph and initial outfit).`);
