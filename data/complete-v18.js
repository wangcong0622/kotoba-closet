// Existing IDs and learning history stay stable; only missing catalog entries are added.
const additions=[
 ['bottom_cargo','bottom','橄榄绿工装裤','カーゴパンツ','cargo pants'],
 ['bottom_corduroy','bottom','焦糖灯芯绒长裤','コーデュロイパンツ','widepants'],
 ['bottom_denim_skirt','bottom','开衩牛仔中长裙','デニムスカート','skirt'],
 ['bottom_maxi','bottom','蓝绿长裙','ロングスカート','longskirt'],
 ['brand_apc_denim','bottom','A.P.C. 直筒牛仔裤','ジーンズ','jeans','apc'],
 ['brand_beams_oxford','top','BEAMS 牛津衬衫','オックスフォードシャツ','shirt','beams'],
 ['brand_cos_trench','outer','COS 长款风衣','トレンチコート','trench','cos'],
 ['brand_dior_booktote','bag','Dior Book Tote 手提包','トートバッグ','tote','dior'],
 ['brand_hermes_oran','shoes','Hermès Oran 凉鞋','サンダル','sandals','hermes'],
 ['brand_nike_af1','shoes','Nike Air Force 1','スニーカー','sneakers','nike'],
 ['brand_ralphlauren_cable','top','Ralph Lauren 绞花针织衫','ケーブルニット','knit','ralphlauren'],
 ['brand_toryburch_kira','bag','Tory Burch Kira 肩包','ショルダーバッグ','bag','toryburch'],
 ['brand_unitedarrows_blazer','outer','UNITED ARROWS 西装外套','テーラードジャケット','blazer','unitedarrows'],
 ['dress_knit','dress','酒红针织连衣裙','ニットワンピース','dress'],
 ['dress_shirt','dress','浅蓝衬衫连衣裙','シャツワンピース','dress'],
 ['dress_slip','dress','祖母绿缎面吊带裙','キャミソールワンピース','dress'],
 ['dress_wrap','dress','蓝灰裹身连衣裙','ラップワンピース','dress'],
 ['earrings_hoop','earrings','金色圆环耳饰','フープイヤリング','earrings'],
 ['necklace_pearl','necklace','珍珠项链','パールネックレス','necklace'],
 ['outer_parka','outer','橄榄绿连帽外套','モッズコート','jacket'],
 ['outer_peacoat','outer','藏蓝短大衣','ピーコート','jacket'],
 ['outer_quilted','outer','奶油白绗缝外套','キルティングジャケット','jacket'],
 ['outer_tweed','outer','黑金粗花呢外套','ツイードジャケット','jacket'],
 ['top_breton','top','海军条纹长袖衫','ボーダーカットソー','shirt'],
 ['top_linen_shirt','top','白色亚麻衬衫','リネンシャツ','shirt'],
 ['top_rib_cardigan','top','鼠尾草绿罗纹开衫','リブカーディガン','cardigan'],
 ['top_silk_cami','top','奶油缎面吊带上衣','キャミソール','vest'],
 ['top_turtleneck','top','米白高领针织衫','タートルネック','knit'],
 ['top_wrap_blouse','top','浅蓝系带裹身衬衫','ラップブラウス','blouse']
];
export function completeCatalog(items,lexemes,brands){
 const brandNames={apc:['A.P.C.','アー・ペー・セー'],beams:['BEAMS','ビームス'],cos:['COS','コス'],dior:['Dior','ディオール'],hermes:['Hermès','エルメス'],nike:['Nike','ナイキ'],ralphlauren:['Ralph Lauren','ラルフ ローレン'],toryburch:['Tory Burch','トリー バーチ'],unitedarrows:['UNITED ARROWS','ユナイテッドアローズ']};
 for(const [id,[latin,ja]]of Object.entries(brandNames))brands[id]={latin,ja};
 for(const [id,slot,zh,jp,lexeme,brand] of additions){if(items.some(i=>i.id===id))continue;
  const fallback=lexemes[lexeme]||lexemes[slot==='bottom'?'skirt':slot==='shoes'?'shoes':'blouse'];
  const key=`v18_${id}`;const verb=['bottom','shoes','socks'].includes(slot)?'はく':['bag'].includes(slot)?'持つ':['earrings','necklace','bracelet'].includes(slot)?'つける':'着る';
  lexemes[key]={jp,reading:jp,zh,verb,sentences:slot==='bag'?[[`この${jp}に財布は入りますか。`,`この${jp}にさいふははいりますか。`,'这个包放得下钱包吗？'],['この色が好きです。','このいろがすきです。','我喜欢这个颜色。']]:['earrings','necklace','bracelet'].includes(slot)?[[`この${jp}をつけてもいいですか。`,`この${jp}をつけてもいいですか。`,'可以试戴这个吗？'],['軽くて使いやすいです。','かるくてつかいやすいです。','很轻，戴起来方便。']]:[[`この${jp}を試着してもいいですか。`,`この${jp}をしちゃくしてもいいですか。`,'可以试穿这件吗？'],['もう少し大きいサイズはありますか。','もうすこしおおきいサイズはありますか。','有稍大一点的尺码吗？']]};
  items.push({id,slot,zh,jp,reading:jp,lexeme:key,verb,brand,style:'classic',color:'cream',tags:['spring'],fidelityStatus:brand?'illustrative_approximation':undefined});
 }
}
