// Single source of truth for approved v17 render parts.  References and
// rejected extraction attempts deliberately do not appear here.
export const V17_REGISTRY={
 hair_bob_v5:{slot:'hair',parts:[['assets/v17/modules/hair_bob_v5/back.png','hairBack'],['assets/v17/modules/hair_bob_v5/front.png','hairFront']]},
 top_blouse:{slot:'top',parts:[['assets/v17/modules/top_blouse/cloth.png','top']],contactSkin:'assets/v17/contact-skin/top_blouse.png',replaceMask:'assets/v17/contact-skin/top_blouse-replace-mask.png'},
 bottom_pleat:{slot:'bottom',parts:[['assets/v17/modules/bottom_pleat/cloth.png','bottom']],contactSkin:'assets/v17/contact-skin/bottom_pleat.png',replaceMask:'assets/v17/contact-skin/bottom_pleat-replace-mask.png'},
 bottom_denim:{slot:'bottom',parts:[['assets/v17/modules/bottom_denim/cloth.png','bottom']],contactSkin:'assets/v17/contact-skin/bottom_denim.png',replaceMask:'assets/v17/contact-skin/bottom_denim-replace-mask.png',provenance:'upgraded-rgba-with-reference-contact-skin'},
 bottom_wide_v7:{slot:'bottom',parts:[['assets/v17/modules/bottom_wide_v7/cloth.png','bottom']],contactSkin:'assets/v17/contact-skin/bottom_wide_v7.png',replaceMask:'assets/v17/contact-skin/bottom_wide_v7-replace-mask.png'},
 bottom_pleated_trouser:{slot:'bottom',parts:[['assets/v17/modules/bottom_pleated_trouser/cloth.png','bottom']],contactSkin:'assets/v17/contact-skin/bottom_pleated_trouser.png',replaceMask:'assets/v17/contact-skin/bottom_pleated_trouser-replace-mask.png'},
 brand_lacoste:{slot:'top',parts:[['assets/v17/modules/brand_lacoste/cloth.png','top']],contactSkin:'assets/v17/contact-skin/brand_lacoste.png',replaceMask:'assets/v17/contact-skin/brand_lacoste-replace-mask.png'},
 brand_fredperry:{slot:'top',parts:[['assets/v17/modules/brand_fredperry/cloth.png','top']],contactSkin:'assets/v17/contact-skin/brand_fredperry.png',replaceMask:'assets/v17/contact-skin/brand_fredperry-replace-mask.png'},
 top_lace:{slot:'top',parts:[['assets/v17/modules/top_lace/cloth.png','top']],contactSkin:'assets/v17/contact-skin/top_lace.png',replaceMask:'assets/v17/contact-skin/top_lace-replace-mask.png'},
 top_rugby:{slot:'top',parts:[['assets/v17/modules/top_rugby/cloth.png','top']],contactSkin:'assets/v17/contact-skin/top_rugby.png',replaceMask:'assets/v17/contact-skin/top_rugby-replace-mask.png'},
 top_bow:{slot:'top',parts:[['assets/v17/modules/top_bow/cloth.png','top']],replaceMask:'assets/v17/contact-skin/top_bow-replace-mask.png'},
 top_vest_v7:{slot:'top',parts:[['assets/v17/modules/top_vest_v7/cloth.png','top']],contactSkin:'assets/v17/contact-skin/top_vest_v7.png',replaceMask:'assets/v17/contact-skin/top_vest_v7-replace-mask.png'},
 top_stripe:{slot:'top',parts:[['assets/v17/modules/top_stripe/cloth.png','top']],contactSkin:'assets/v17/contact-skin/top_stripe.png',replaceMask:'assets/v17/contact-skin/top_stripe-replace-mask.png'},
 top_polo:{slot:'top',parts:[['assets/v17/modules/top_polo/cloth.png','top']],contactSkin:'assets/v17/contact-skin/top_polo.png',replaceMask:'assets/v17/contact-skin/top_polo-replace-mask.png'},
 outer_cardigan:{slot:'outer',parts:[['assets/v17/modules/outer_cardigan/cloth.png','outer']],replaceMask:'assets/v17/contact-skin/outer_cardigan-replace-mask.png'}
};
export const v17Parts=id=>(V17_REGISTRY[id]?.parts||[]).map(([src,layerKey])=>({src,layerKey}));
export const v17Contact=id=>({contactSkin:V17_REGISTRY[id]?.contactSkin,replaceMask:V17_REGISTRY[id]?.replaceMask});
