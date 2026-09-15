import {GARMENT_FIT} from '../data/fit.js';
import {FIT_V7} from '../data/items-v7.js';
const garmentFit={...GARMENT_FIT,...FIT_V7};
// Each cut was measured from the same crown anchor.  The close-cropped cuts
// need a little more lateral volume than the long cuts so the face does not
// look wider than its hair; front and back parts deliberately share this fit.
export const HAIR_FIT={hair_bob_v5:[.82,.88],hair_wave_v5:[.86,.93],hair_pony_v5:[.86,.94],hair_pixie_v6:[.96,1.04],hair_bun_v6:[.94,1],hair_braids_v6:[.90,.98]};
export const BASE_SRC='assets/rig/base_stylized_v5.png';
export const HAIR_SRC='assets/items/hair_bob_v5.png';
export const BACKGROUND_SRC='assets/bright-dressing-room-v1.png';
export const LAYER_ORDER = ['hair', 'socks', 'shoes', 'bottom', 'top', 'dress', 'outer', 'necklace', 'earrings', 'bracelet', 'hat', 'bag'];

export function buildRenderPlan({ look, getItem, backgroundSrc=BACKGROUND_SRC, baseSrc=BASE_SRC, hairSrc }) {
  const useBodyOcclusion=baseSrc===BASE_SRC;
  const closedCoat=look?.outer==='burberry_trench';
  const longSleeves=getItem(look?.outer)?.longSleeves||getItem(look?.top)?.longSleeves;
  const cardigan=look?.outer==='outer_cardigan'||longSleeves;
  if(useBodyOcclusion&&!closedCoat&&!cardigan&&look?.top==='top_polo')baseSrc='assets/rig/body-v5-polo.png';
  if(useBodyOcclusion&&closedCoat)baseSrc='assets/rig/body-v5-coat.png';
  if(useBodyOcclusion&&cardigan)baseSrc='assets/rig/body-v5-cardigan.png';
  const activeTop=getItem(look?.top);
  const tuckedTop=garmentFit[activeTop?.id]?.waistMode==='tucked';
  // A tucked hem is physically behind the waistband; an untucked hem stays
  // above the skirt or trouser layer.  This is per-item fit data, not a global
  // scale or a one-off visual patch.
  const layerOrder=tuckedTop?['hair','socks','shoes','top','bottom','dress','outer','necklace','earrings','bracelet','hat','bag']:LAYER_ORDER;
  const productionParts = [];
  const prototypeItems = [];
  for (const slot of layerOrder) {
    // Preserve selected bottoms; show their hem/legs below the closed coat.
    if ((closedCoat||['brand_firebird_top','brand_levis_type3'].includes(look?.outer)) && slot==='top') continue;
    const wearable = getItem(look?.[slot]);
    if (!wearable) continue;
    if (Array.isArray(wearable.renderParts) && wearable.renderParts.length) {
      productionParts.push(...wearable.renderParts.map(part => ({
        ...part,
        src: part.src,
        layerKey: part.layerKey || slot,
        itemId: wearable.id,
        ...(slot==='hair'?{scaleXY:HAIR_FIT[wearable.id]||[1,1],anchor:[512,150]}:{}),
        ...(slot==='hat'?{offsetY:8}:{}),
        ...(closedCoat&&slot==='bottom'?{clipRect:[0,1018,1024,518]}:{}),
        ...((look?.outer==='outer_cardigan'||getItem(look?.outer)?.longSleeves)&&slot==='top'?{clipRect:[400,300,224,355]}:{}),
        ...(slot==='top'&&look?.bottom&&garmentFit[wearable.id]?.waistMode==='tucked'?{clipBottomY:garmentFit[wearable.id].tuckY}:{}),
        ...(garmentFit[wearable.id]?.horizontalFit?{horizontalFit:garmentFit[wearable.id].horizontalFit,fitAnchorX:512}:{}),
        ...(closedCoat&&slot==='dress'?{clipPolygon:[[348,1016],[676,1016],[834,1157],[190,1157]]}:{})
      })));
    } else {
      prototypeItems.push(wearable);
    }
  }
  return {
    layers: [
      { src: backgroundSrc, layerKey: 'background' },
      ...productionParts.filter(p=>['bagBack','hairBack'].includes(p.layerKey)),
      { src: baseSrc, layerKey: 'body',cutouts:useBodyOcclusion?[...new Set(productionParts.map(p=>garmentFit[p.itemId]?.cutout).filter(Boolean))]:[] },
      ...productionParts.filter(p=>!['hat','bag','bagBack','bagFront','hairBack','hairFront'].includes(p.layerKey)),
      ...(hairSrc&&!look?.hair?[{src:hairSrc,layerKey:'hair',scaleXY:HAIR_FIT.hair_bob_v5,anchor:[512,150]}]:[]),
      ...productionParts.filter(p=>p.layerKey==='hairFront'),
      ...productionParts.filter(p=>['hat','bag','bagFront'].includes(p.layerKey)),
      ...(useBodyOcclusion?[{src:`assets/rig/hands-v4-${closedCoat?'coat':cardigan?'cardigan':'bare'}.png`,layerKey:'hands'}]:[])
    ],
    prototypeItems,
    renderSource:{engine:'legacy',body:'legacy-base',v17Modules:[],legacySupport:Object.values(look||{}).filter(Boolean),bodyCutouts:[],bodyAlphaSources:[]}
  };
}
const cache=new Map();
// All production clothing was authored against these rig anchors.  Keeping the
// shared foreground on the native skeleton avoids a stretched waist/hip seam
// while still applying one transform to body, garments, masks, hands and hair.
export const BODY_PROPORTION_Y=[[0,0],[310,310],[620,620],[1030,1030],[1478,1478],[1536,1536]];
export function loadImage(src){if(!cache.has(src)){const p=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{cache.delete(src);reject(new Error(`图片未能加载：${src}`))};image.src=src;});cache.set(src,p);}return cache.get(src);}
export async function drawPlan(canvas,plan){
 const images=await Promise.all(plan.layers.map(async layer=>{
  const original=await loadImage(layer.src),maskSources=[...(layer.cutouts||[]),...(layer.cutoutSources||[])];
  if(!maskSources.length)return original;
  const masks=await Promise.all(maskSources.map(loadImage)),body=document.createElement('canvas');body.width=1024;body.height=1536;
  const c=body.getContext('2d');c.drawImage(original,0,0,1024,1536);c.globalCompositeOperation='destination-out';masks.forEach(mask=>c.drawImage(mask,0,0,1024,1536));
  for(const source of layer.restoreSources||[]){
   const keep=document.createElement('canvas');keep.width=1024;keep.height=1536;const k=keep.getContext('2d');
   k.drawImage(original,0,0,1024,1536);k.globalCompositeOperation='destination-in';k.drawImage(await loadImage(source),0,0,1024,1536);
   c.globalCompositeOperation='source-over';c.drawImage(keep,0,0);
  }
  return body;
 }));
 const foreground=document.createElement('canvas');foreground.width=1024;foreground.height=1536;
 const output=canvas.getContext('2d');output.clearRect(0,0,canvas.width,canvas.height);
 images.forEach((image,i)=>{const layer=plan.layers[i];const background=layer.layerKey==='background';const c=background?output:foreground.getContext('2d');c.save();if(background)c.scale(canvas.width/1024,canvas.height/1536);if(layer.clipRect){c.beginPath();c.rect(...layer.clipRect);c.clip();}if(layer.clipBottomY){c.beginPath();c.rect(0,0,1024,layer.clipBottomY);c.clip();}if(layer.clipPolygon){c.beginPath();layer.clipPolygon.forEach(([x,y],j)=>j?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();}if(layer.scaleXY||layer.scale){const [x,y]=layer.anchor;const [sx,sy]=layer.scaleXY||[layer.scale,layer.scale];c.translate(x,y);c.scale(sx,sy);c.translate(-x,-y);}if(layer.horizontalFit){for(const [start,end,scaleX] of layer.horizontalFit){c.save();c.beginPath();c.rect(0,start,1024,end-start);c.clip();c.translate(layer.fitAnchorX||512,0);c.scale(scaleX,1);c.translate(-(layer.fitAnchorX||512),0);c.drawImage(image,0,layer.offsetY||0,1024,1536);c.restore();}}else c.drawImage(image,0,layer.offsetY||0,1024,1536);c.restore();});
 output.save();output.scale(canvas.width/1024,canvas.height/1536);
 for(let i=1;i<BODY_PROPORTION_Y.length;i++){const [sy,dy]=BODY_PROPORTION_Y[i-1];const [ey,fy]=BODY_PROPORTION_Y[i];output.drawImage(foreground,0,sy,1024,ey-sy,0,dy,1024,fy-dy);}
 output.restore();return canvas;
}
