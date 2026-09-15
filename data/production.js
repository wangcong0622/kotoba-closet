export const PRODUCTION={
 top_polo:{file:'top_polo.png'},
 top_cable:{file:'top_cable.png'},
 bottom_tweed:{file:'bottom_tweed.png'},
 bottom_satin:{file:'bottom_satin.png'},
 socks_cream:{file:'socks_cream.png'},
 lv_neverfull:{file:'lv_neverfull.png',renderParts:[{src:'assets/items/lv_neverfull-back.png',layerKey:'bagBack'},{src:'assets/items/lv_neverfull-front.png',layerKey:'bagFront'}]},
 adidas_samba:{file:'adidas_samba.png'},
 burberry_trench:{file:'burberry_trench.png'},
 top_stripe:{file:'top_stripe.png'},
 outer_cardigan:{file:'outer_cardigan.png'},
 hat_beret:{file:'hat_beret.png'},
 top_blouse:{file:'top_blouse.png',name:'奶油彼得潘领短袖衬衫'},
 bottom_pleat:{file:'bottom_pleat.png'},
 bottom_denim:{file:'bottom_denim.png'},
 dress_floral:{file:'dress_floral.png'},
 shoes_maryjane:{file:'shoes_maryjane.png'},
 brand_onitsuka_mexico66:{file:'brand_onitsuka_mexico66.png'},
 brand_newbalance_574:{file:'brand_newbalance_574.png'},
 brand_margiela_tabi:{file:'brand_margiela_tabi.png'},
 brand_puma_speedcat:{file:'brand_puma_speedcat.png'},
 brand_celine_triomph:{file:'brand_celine_triomph.png'},
 brand_prada_reedition:{file:'brand_prada_reedition.png'}
 ,bottom_pleated_trouser:{file:'bottom_pleated_trouser.png'}
 ,bottom_bias_skirt:{file:'bottom_bias_skirt.png',publish:false,acceptanceNote:'Hidden pending redraw: the asset has a rectangular transparent break at the centre of the hem.'}
};

for(const id of ["hair_bob_v5","hair_wave_v5","hair_pony_v5","hair_pixie_v6","hair_bun_v6","hair_braids_v6"])PRODUCTION[id]={file:`${id}.png`,renderParts:[{src:`assets/items/${id}-back.png`,layerKey:"hairBack"},{src:`assets/items/${id}-front.png`,layerKey:"hairFront"}]};
