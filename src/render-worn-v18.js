import {WORN_V18} from '../data/worn-v18.js';
const BASE='assets/rig/base-face-v19.png';
export function buildWornPlan({look,getItem,backgroundSrc}){
 const entries=Object.entries(look||{}).map(([slot,id])=>({slot,id,asset:WORN_V18[id]})).filter(x=>x.asset);
 const find=slot=>entries.find(x=>x.slot===slot),outer=find('outer'),shoe=find('shoes');
 const closed=outer?.asset.kind==='closed';
 const paired=shoe?.id==='shoes_maryjane_socks_v19',bottom=find('bottom');
 const head=find('hair')?.asset.parts.find(p=>p.layerKey==='head');
 const owners=entries.map(x=>x.asset.owner).filter(Boolean);
 const layers=[{src:backgroundSrc,layerKey:'background'}];
 const add=(slot,back=false)=>{const entry=find(slot);if(!entry)return;
  for(const p of entry.asset.parts){if(p.layerKey==='head')continue;if(slot==='hair'&&(p.layerKey==='hairBack')!==back)continue;
   const layer={...p,itemId:entry.id,sourceKind:'worn-reference-v18'};
   if(['bottom','dress'].includes(slot)){layer.cutouts=[paired&&slot==='bottom'?entry.asset.sockCutout:shoe?.asset.owner,closed?outer.asset.owner:null].filter(Boolean);}
   if(slot==='dress'&&entry.id==='dress_unikko_v27'&&outer&&outer.id!=='outer_bolero'){
    // The coat owns the upper arms; keep the dress opening and full skirt.
    layer.clipPolygon=[[455,264],[569,264],[569,325],[604,350],[604,510],[1024,510],[1024,1536],[0,1536],[0,510],[420,510],[420,350],[455,325]];
   }
   if(slot==='bottom'&&shoe&&entry.asset.sockCover)layer.restoreSources=[entry.asset.sockCover];
   if(slot==='shoes'&&bottom?.asset.sockCover)layer.cutouts=[bottom.asset.sockCover];
   if(slot==='top'&&outer){
    layer.cutouts=[outer.asset.owner].filter(Boolean);
    // Long-sleeved outerwear owns the arms, including wider inner sleeves.
    // Preserve the centre opening without changing the garment silhouette.
    if(outer.id!=='outer_bolero')layer.clipRect=[420,264,184,594];
   }
   layers.push(layer);
  }
 };
 add('hair',true);
 layers.push({src:BASE,layerKey:'body',cutouts:[...owners,...(head?['assets/rig/head-replace-v25.png']:[])]});

 if(head)layers.push({...head});
 add('bottom');add('dress');add('shoes');
 if(!closed)add('top');add('outer');

 add('hair');
 add('necklace');add('bracelet');add('bag');
 return {layers,prototypeItems:[],renderSource:{engine:'worn-v18',referenceModules:entries.map(x=>x.id),legacySupport:[],missing:Object.values(look||{}).filter(id=>!WORN_V18[id])}};
}


