// Stable display order: garments are browsed in the same order as a person
// dresses, while each category goes from core silhouettes to layered pieces.
export const SLOT_ORDER=['top','bottom','dress','outer','necklace','earrings','bracelet','socks','shoes','hat','bag','hair'];
export const ITEM_ORDER=[
 'top_blouse','top_bow','top_lace','top_polo','top_rugby','top_stripe','top_cable','top_vest_v7','top_sweater','top_hoodie','top_mockneck_v15','brand_lacoste','brand_fredperry','brand_lacoste_cardigan_v10','brand_fredperry_knit_v10','top_denim','brand_levis_shirt_v10',
 'bottom_pleat','bottom_wrap_v7','bottom_gingham','bottom_tweed','bottom_tulle','bottom_satin','bottom_shorts','bottom_culottes','bottom_wide_v7','bottom_denim','bottom_slacks_v15','brand_levis501','brand_firebird_pants',
 'dress_floral','dress_sundress','dress_sailor','dress_pinafore',
 'outer_cardigan','outer_blazer','outer_denim','brand_levis_type3','outer_biker','outer_bolero','brand_firebird_top','burberry_trench',
 'necklace_pendant_v15','earrings_pearl_v15','bracelet_gold_v15',
 'socks_cream','shoes_maryjane','shoes_ribbon_v7','shoes_ballet','shoes_loafers','shoes_whitecourt_v17','adidas_samba','brand_stansmith','brand_allstar','brand_jackpurcell','brand_arizona','brand_boston','brand_martens',
 'hat_beret','brand_burberry_hat_v7','lv_neverfull','brand_chanel_v7','brand_pliage',
 'hair_bob_v5','hair_wave_v5','hair_pony_v5','hair_pixie_v6','hair_bun_v6','hair_braids_v6'
];
const rank=new Map(ITEM_ORDER.map((id,index)=>[id,index]));
const slotRank=new Map(SLOT_ORDER.map((slot,index)=>[slot,index]));
export function sortWardrobeItems(items){
 return [...items].sort((a,b)=>(slotRank.get(a.slot)??99)-(slotRank.get(b.slot)??99)||
   (rank.get(a.id)??9999)-(rank.get(b.id)??9999)||a.zh.localeCompare(b.zh,'zh-Hans-CN'));
}
