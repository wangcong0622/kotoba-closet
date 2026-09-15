// v17 modules are authored at the frozen 1024 x 1536 master coordinates.
// Do not add scale, offset, horizontal-fit or body-cutout patches here: a
// module is accepted only when its own opaque outline meets the master rig.
export const V17_MASTER_SRC = 'plans/rebuild-v17/master-body.png';
import {V17_REGISTRY,v17Contact,v17Parts} from '../data/v17-registry.js';

// Every cut shares the frozen head crown; values are measured per hairstyle,
// not applied to clothing or the body. Both front/back pieces receive the
// same transform so a hat or collar cannot expose a split seam.
const V17_HAIR_FIT={
  hair_bob_v5:[1,1], hair_wave_v5:[.88,.93], hair_pony_v5:[.90,.94],
  hair_pixie_v6:[.94,1], hair_bun_v6:[.94,1], hair_braids_v6:[.90,.98]
};
function fitHair(parts,id){
  const scaleXY=V17_HAIR_FIT[id]||[1,1];
  return parts.map(part=>({...part,scaleXY,anchor:[512,150]}));
}

// A measured V17 module wins when one exists.  The rest of the wardrobe uses
// its authored RGBA cutout on the same 1024×1536 pose; this is deliberately a
// part fallback, never a full worn-reference replacement.
function itemParts(id,getItem){
  const measured=v17Parts(id);
  if(measured.length)return measured.map(part=>({...part,itemId:id,sourceKind:'v17-module'}));
  const item=typeof getItem==='function'?getItem(id):null;
  return Array.isArray(item?.renderParts)
    ?item.renderParts.map(part=>({...part,itemId:item.id,layerKey:part.layerKey||item.slot,sourceKind:'legacy-support'}))
    :[];
}

export function canUseV17(look,getItem) {
  const required=look?.dress?['hair','dress']:['hair','top','bottom'];
  if(!required.every(slot=>look?.[slot]))return false;
  return required.every(slot=>v17Parts(look[slot]).length>0)
    && Object.entries(look||{}).every(([,id])=>itemParts(id,getItem).length>0);
}

export function buildV17RenderPlan({ look, getItem, backgroundSrc }) {
  const parts=slot=>itemParts(look?.[slot],getItem);
  const hair=fitHair(parts('hair'),look?.hair), socks=parts('socks'), shoes=parts('shoes');
  const top=parts('top'), bottom=parts('bottom'), dress=parts('dress'), outer=parts('outer');
  const jewelry=['necklace','earrings','bracelet'].flatMap(parts);
  const hats=parts('hat'), bags=parts('bag');
  const garmentParts=[...top,...bottom,...dress,...outer];
  const v17GarmentIds=[...new Set(garmentParts.filter(part=>part.sourceKind==='v17-module').map(part=>part.itemId))];
  // A V17 body never consumes GARMENT_FIT's legacy silhouette masks.  Each
  // registered cloth layer owns only the pixels in its real alpha-derived
  // replace mask; neckline openings therefore preserve the master skin.
  const bodyCutouts=[...new Set(v17GarmentIds.map(id=>v17Contact(id).replaceMask).filter(Boolean))];
  const bodyAlphaSources=[...new Set(garmentParts.filter(part=>part.sourceKind==='v17-module').map(part=>part.src))];
  const contactSkin=v17GarmentIds.map(id=>v17Contact(id).contactSkin).filter(Boolean).map(src=>({src,layerKey:'contactSkin',sourceKind:'reference-contact-skin'}));
  return {
    layers: [
      { src: backgroundSrc, layerKey: 'background' },
      ...hair.filter(part => part.layerKey === 'hairBack'),
      ...bags.filter(part => part.layerKey === 'bagBack'),
      { src: V17_MASTER_SRC, layerKey: 'body', cutouts:bodyCutouts, cutoutSources:bodyAlphaSources, skinOwner:'v17-body-buffer' },
      ...contactSkin,
      ...socks, ...shoes,
      // A tucked or short top sits behind the waistband; dresses own their
      // torso-to-hem silhouette. Outerwear then owns sleeve/front overlap.
      ...top, ...bottom, ...dress, ...outer,
      ...hair.filter(part => part.layerKey !== 'hairBack'),
      ...jewelry, ...hats,
      ...bags.filter(part => part.layerKey !== 'bagBack')
    ],
    prototypeItems: [],
    renderSource:{engine:'v17',body:'masked-v17-master',v17Modules:[...new Set([...hair,...garmentParts].filter(part=>part.sourceKind==='v17-module').map(part=>part.itemId))],legacySupport:[...new Set([...socks,...shoes,...top,...bottom,...dress,...outer,...hair,...jewelry,...hats,...bags].filter(part=>part.sourceKind==='legacy-support').map(part=>part.itemId))],bodyCutouts,bodyAlphaSources,contactSkin:contactSkin.map(part=>part.src)}
  };
}
