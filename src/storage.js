import { ITEMS, LEXEMES, BRANDS, SCENES } from '../data/content.js';
import { normalizeLearning } from './learning.js';
import { SCENE_CONTENT } from '../data/scenes.js';
const byId = new Map(ITEMS.map(item => [item.id, item]));
export const INITIAL_LOOK = {hair:'hair_straight_v23',top:'top_blouse',bottom:'bottom_pleat',shoes:'shoes_maryjane_socks_v19'};
export function cleanLook(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const look = {};
  for (const [slot,savedId] of Object.entries(value)) {
    if(slot==='socks'||slot==='earrings')continue;
    const id=savedId==='hair_bob_v5'?'hair_straight_v23':savedId==='outer_bolero'?'brand_fredperry_track_v22':savedId==='shoes_whitecourt_v17'?'brand_nike_af1':savedId;
    if (typeof id === 'string' && byId.get(id)?.slot === slot) look[slot] = id;
  }
  if(['hat_beret','brand_burberry_hat_v7'].includes(value.hat))look.hair=value.hat;
  if(value.socks==='socks_cream'&&(!look.shoes||look.shoes==='shoes_maryjane'))look.shoes='shoes_maryjane_socks_v19';
  if (look.dress) { delete look.top; delete look.bottom; }
  return look;
}
export const validScene = id => SCENES.some(scene => scene[0] === id) ? id : 'cafe';
export function cleanProgress(raw) {
  const normalized = normalizeLearning(raw);
  return Object.fromEntries(Object.entries(normalized).filter(([id]) => Object.hasOwn(LEXEMES,id) || (id.startsWith('brand:') && Object.hasOwn(BRANDS,id.slice(6))) || SCENE_CONTENT.some(row=>`life:${row.id}`===id)));
}
export function normalizeSave(raw) {
  if (!raw || ![1,2,3].includes(raw.schemaVersion) || !raw.look || typeof raw.look !== 'object' || Array.isArray(raw.look) || !Array.isArray(raw.favorites)) throw new Error('备份格式或版本不受支持');
  if (raw.projectId && raw.projectId !== 'kotoba-closet') throw new Error('这不是言叶衣橱的备份');
  const settings = {kana:true,reduced:false,mode:'light',slow:false};
  for (const key of ['kana','reduced','slow']) if (typeof raw.settings?.[key] === 'boolean') settings[key] = raw.settings[key];
  if(typeof raw.settings?.voiceURI==='string')settings.voiceURI=raw.settings.voiceURI;
  if (['free','light','scene'].includes(raw.settings?.mode)) settings.mode = raw.settings.mode;
  const albums = (Array.isArray(raw.albums)?raw.albums:[]).filter(a => a && a.look && typeof a.look==='object' && !Array.isArray(a.look)).slice(-30).map((a,i)=>({id:String(a.id??`import-${i}`),name:typeof a.name==='string'?a.name.slice(0,60):`穿搭 ${i+1}`,look:cleanLook(a.look),scene:validScene(a.scene)}));
  return {schemaVersion:3,projectId:'kotoba-closet',look:cleanLook(raw.look),focus:byId.has(raw.focus)?raw.focus:'top_blouse',studyLexeme:Object.hasOwn(LEXEMES,raw.studyLexeme)?raw.studyLexeme:null,favorites:[...new Set(raw.favorites.filter(id=>byId.has(id)))],albums,learning:cleanProgress(raw.learning),settings,scene:validScene(raw.scene)};
}


