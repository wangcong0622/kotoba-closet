// Audited against the 115 selectable WORN_V18 thumbnails. These describe the
// illustration, not a brand product's fibre composition. Unconfirmed fabric is omitted.
export const ITEM_DESCRIPTIONS = {};
function assign(ids, values) {
  for (const id of ids.split(/\s+/).filter(Boolean)) Object.assign(ITEM_DESCRIPTIONS[id] ||= {}, values);
}
const colors = {
 white: 'top_lace dress_floral brand_stansmith brand_jackpurcell necklace_pendant_v15 brand_nike_af1 necklace_pearl top_linen_shirt',
 pink: 'top_stripe shoes_maryjane bottom_tweed bottom_tulle bottom_wrap_v7 shoes_ribbon_v7 hair_rose_cap_v24 brand_lacoste_pink_v26 dress_unikko_v27',
 navy: 'bottom_pleat hat_beret top_rugby bottom_shorts dress_sailor outer_blazer dress_pinafore brand_firebird_top brand_firebird_pants brand_fredperry brand_pliage brand_fredperry_knit_v10 brand_dior_booktote outer_peacoat top_breton brand_ralph_navy_v26 dress_ralph_v27',
 blue: 'bottom_denim top_polo top_denim outer_denim brand_levis501 brand_levis_type3 brand_levis_shirt_v10 bottom_denim_skirt brand_apc_denim brand_beams_oxford dress_shirt dress_wrap top_wrap_blouse',
 mint: 'outer_cardigan',
 black: 'burberry_trench adidas_samba shoes_loafers outer_biker brand_allstar brand_martens brand_chanel_v7 brand_margiela_tabi brand_celine_triomph brand_prada_reedition brand_vans_oldskool brand_toryburch_kira outer_tweed brand_fredperry_track_v22',
 brown: 'lv_neverfull hair_wave_v5 hair_pony_v5 hair_pixie_v6 hair_bun_v6 hair_braids_v6 hair_straight_v23 hair_halfup_v23 brand_arizona bottom_corduroy brand_cos_trench brand_hermes_oran shoes_maryjane_socks_v19 hair_pearl_updo_v26 hair_hoop_pony_v26',
 cream: 'top_blouse top_cable top_bow bottom_culottes shoes_ballet brand_boston brand_burberry_hat_v7 bottom_wide_v7 top_vest_v7 bottom_slacks_v15 bottom_bias_skirt brand_ralphlauren_cable outer_quilted top_silk_cami top_turtleneck hair_straw_pearl_v26',
 green: 'bottom_satin bottom_gingham dress_sundress top_hoodie brand_lacoste brand_lacoste_cardigan_v10 bottom_cargo bottom_maxi dress_slip outer_parka top_rib_cardigan dress_lacoste_v27',
 yellow: 'brand_onitsuka_mexico66', gold: 'bracelet_gold_v15',
 grey: 'top_mockneck_v15 brand_newbalance_574 bottom_pleated_trouser brand_unitedarrows_blazer',
 purple: 'top_sweater', red: 'brand_puma_speedcat dress_knit brand_adidas_red_v26'
};
for (const [color, ids] of Object.entries(colors)) assign(ids, { color });
assign('bottom_gingham dress_sundress top_hoodie top_rib_cardigan dress_lacoste_v27', { tone: 'sage' });
assign('bottom_satin bottom_maxi', { tone: 'teal' });
assign('brand_lacoste brand_lacoste_cardigan_v10', { tone: 'darkgreen' });
assign('bottom_cargo outer_parka', { tone: 'olive' });
assign('dress_knit brand_adidas_red_v26', { tone: 'burgundy' });
assign('top_mockneck_v15 bottom_pleated_trouser brand_unitedarrows_blazer', { tone: 'charcoal' });
assign('dress_wrap', { tone: 'bluegrey' });
const features = {
 stripe: 'top_stripe top_rugby top_breton', flower: 'dress_floral dress_unikko_v27',
 check: 'bottom_gingham brand_burberry_hat_v7', cable: 'top_cable top_sweater top_vest_v7 brand_ralphlauren_cable brand_ralph_navy_v26',
 pleat: 'bottom_pleat bottom_pleated_trouser bottom_maxi', rib: 'top_mockneck_v15 top_rib_cardigan top_turtleneck',
 triple: 'adidas_samba brand_firebird_top brand_firebird_pants brand_adidas_red_v26',
 monogram: 'lv_neverfull brand_dior_booktote', quilt: 'brand_chanel_v7 brand_toryburch_kira outer_quilted',
 bow: 'top_bow shoes_ballet shoes_ribbon_v7', lace: 'top_lace', laurel: 'brand_fredperry_track_v22',
 hood: 'top_hoodie outer_parka', belt: 'dress_ralph_v27', sailor: 'dress_sailor', pearl: 'necklace_pearl hair_pearl_updo_v26 hair_straw_pearl_v26', hoop: 'hair_hoop_pony_v26'
};
for (const [feature, ids] of Object.entries(features)) assign(ids, { feature });
const fabrics = {
 denim: 'bottom_denim top_denim outer_denim brand_levis501 brand_levis_type3 brand_levis_shirt_v10 bottom_denim_skirt brand_apc_denim',
 tweed: 'bottom_tweed outer_tweed', satin: 'bottom_satin dress_slip top_silk_cami',
 knit: 'top_cable outer_cardigan top_sweater top_vest_v7 brand_lacoste_cardigan_v10 brand_fredperry_knit_v10 top_mockneck_v15 brand_ralphlauren_cable dress_knit top_rib_cardigan top_turtleneck brand_ralph_navy_v26',
 linen: 'bottom_wide_v7 top_linen_shirt', corduroy: 'dress_pinafore bottom_corduroy',
 leather: 'outer_biker', nylon: 'brand_prada_reedition', canvas: 'brand_vans_oldskool', tulle: 'bottom_tulle'
};
for (const [fabric, ids] of Object.entries(fabrics)) assign(ids, { fabric });
const names = {
 dress_floral:'碎花连衣裙',
 bottom_satin:'蓝绿缎面中长裙',bottom_shorts:'海军蓝百慕大短裤',bottom_culottes:'奶油色裙裤',
 dress_sundress:'鼠尾草绿吊带连衣裙',shoes_loafers:'黑色便士乐福鞋',shoes_ballet:'奶油色蝴蝶结芭蕾鞋',
 outer_blazer:'藏蓝西装外套',top_sweater:'淡紫绞花毛衣',top_hoodie:'鼠尾草绿连帽卫衣',
 dress_pinafore:'藏蓝灯芯绒背带裙',shoes_ribbon_v7:'樱粉蝴蝶结芭蕾鞋'
};
for (const [id, name] of Object.entries(names)) assign(id, { name });
assign('top_denim brand_levis_shirt_v10', { kind: ['デニムシャツ','デニムシャツ','牛仔衬衫','着る'] });
assign('hair_straw_pearl_v26', { kind: ['麦わら帽子','むぎわらぼうし','草编帽','かぶる'] });
assign('hat_beret brand_burberry_hat_v7 hair_rose_cap_v24 hair_straw_pearl_v26', {headwear:true});
