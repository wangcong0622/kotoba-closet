export const WARDROBE_CATEGORIES=['all','top','bottom','dress','outer','accessory','shoes','bag','hair'];
export function reconcileLocks(locks,look){
 return Object.fromEntries(Object.entries(locks||{}).filter(([slot,id])=>typeof id==='string'&&look?.[slot]===id));
}
export function normalizeWardrobe(raw={},look={},getItem=()=>null){
 const recent=Array.isArray(raw?.recent)?raw.recent:[];
 const positions=Object.fromEntries(Object.entries(raw?.positions||{}).filter(([k,v])=>k.length<=250&&Number.isFinite(v)&&v>=0).slice(-40).map(([k,v])=>[k,Math.min(v,100000)]));
 return {category:WARDROBE_CATEGORIES.includes(raw?.category)?raw.category:'all',query:typeof raw?.query==='string'?raw.query.slice(0,80):'',style:['classic','sweet','casual'].includes(raw?.style)?raw.style:'',color:typeof raw?.color==='string'&&raw.color.length<20?raw.color:'',favoritesOnly:raw?.favoritesOnly===true,view:['all','recent','worn'].includes(raw?.view)?raw.view:'all',recent:[...new Set(recent.filter(id=>typeof id==='string'&&getItem(id)))].slice(0,30),locks:reconcileLocks(raw?.locks,look),positions};
}
export function equipBlock(look,target,locks){
 if(locks?.[target.slot])return '这件单品已锁定，请先解锁。';
 if(target.slot==='dress'&&(locks?.top||locks?.bottom))return '上下装已锁定，请先解锁再换连衣裙。';
 if(['top','bottom'].includes(target.slot)&&locks?.dress)return '连衣裙已锁定，请先解锁再换上下装。';
 return '';
}
export function randomLook(look,inventory,locks={},slot=null,random=Math.random){
 locks=reconcileLocks(locks,look);const next=slot?{...look}:{...locks};
 const pick=category=>{
  if(locks[category])return;
  const options=inventory.filter(x=>x.slot===category&&x.id!==look[category]);
  const pool=options.length?options:inventory.filter(x=>x.slot===category);if(!pool.length)return;
  const target=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];
  if(equipBlock(look,target,locks))return;
  if(category==='dress'){delete next.top;delete next.bottom;}
  if(['top','bottom'].includes(category))delete next.dress;
  next[category]=target.id;
 };
 if(slot){pick(slot);return next;}
 const dress=locks.dress||(!locks.top&&!locks.bottom&&random()<.4);
 for(const category of [...(dress?['dress']:['top','bottom']),'hair','shoes','bag',...Object.keys(look).filter(x=>['outer','necklace','bracelet'].includes(x))])pick(category);
 return next;
}
export function filterWardrobe(inventory,filters,look,favorites,brands={}){
 const accessory=new Set(['necklace','bracelet']),query=filters.query.trim().toLowerCase();
 const filtered=inventory.filter(x=>(filters.category==='all'||(filters.category==='accessory'?accessory.has(x.slot):x.slot===filters.category))&&(!filters.style||x.style===filters.style)&&(!filters.color||x.color===filters.color)&&(!filters.favoritesOnly||favorites.includes(x.id))&&(filters.view!=='worn'||look[x.slot]===x.id)&&(filters.view!=='recent'||filters.recent.includes(x.id))&&[x.zh,x.jp,x.reading,brands[x.brand]?.latin,brands[x.brand]?.ja].filter(Boolean).join(' ').toLowerCase().includes(query));
 return filters.view==='recent'?filtered.sort((a,b)=>filters.recent.indexOf(a.id)-filters.recent.indexOf(b.id)):filtered;
}
