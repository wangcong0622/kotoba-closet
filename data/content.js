import {BATCH_ITEMS} from './batch-items.js';
import {completeCatalog} from './complete-v18.js';
import {ITEMS_V7} from './items-v7.js';
import {ITEMS_V10} from './items-v10.js';
import {ITEMS_V15} from './items-v15.js';
import {ITEMS_V17} from './items-v17.js';
import {HAIRSTYLES,HAIR_WORDS} from './hairstyles.js';
import {EXPANSION_ITEMS,EXPANSION_LEXEMES} from './wardrobe-expansion.js';
import {EVERYDAY} from './everyday.js';
export const ITEMS = [
 {id:'top_blouse',slot:'top',zh:'珍珠领白衬衫',jp:'ブラウス',reading:'ブラウス',verb:'着る',style:'classic',color:'white',lexeme:'blouse',css:'blouse',tags:['spring']},
 {id:'top_stripe',slot:'top',zh:'樱粉条纹上衣',jp:'ボーダーTシャツ',reading:'ボーダーTシャツ',verb:'着る',style:'casual',color:'pink',lexeme:'shirt',css:'stripe',tags:['walking']},
 {id:'bottom_pleat',slot:'bottom',zh:'海军蓝百褶裙',jp:'プリーツスカート',reading:'プリーツスカート',verb:'はく',style:'classic',color:'navy',lexeme:'skirt',css:'pleat',tags:['elegant','giftScene']},
 {id:'bottom_denim',slot:'bottom',zh:'直筒牛仔裤',jp:'ジーンズ',reading:'ジーンズ',verb:'はく',style:'casual',color:'blue',lexeme:'jeans',css:'denim',tags:['walking','travel']},
 {id:'dress_floral',slot:'dress',zh:'蓝花连衣裙',jp:'花柄ワンピース',reading:'はながらワンピース',verb:'着る',style:'sweet',color:'white',lexeme:'dress',css:'floral',tags:['spring','giftScene']},
 {id:'outer_cardigan',slot:'outer',zh:'薄荷针织开衫',jp:'カーディガン',reading:'カーディガン',verb:'着る',style:'sweet',color:'mint',lexeme:'cardigan',css:'cardigan',tags:['warm']},
 {id:'burberry_trench',slot:'outer',zh:'Kensington 风衣',jp:'トレンチコート',reading:'トレンチコート',verb:'着る',style:'classic',color:'black',lexeme:'trench',css:'trench',brand:'burberry',tags:['rain','travel','warm'],exactProductName:'Mid-Length Kensington Heritage Trench Coat',officialNameJa:'ミッドレングス ケンジントン ヘリテージ トレンチコート',sourceUrl:'https://jp.burberry.com/mid-length-kensington-heritage-trench-coat-p81172421',productCode:'81172421',colorway:'ブラック',referenceDate:'2026-09-06',designFeatures:['97cm midi length','double-breasted closure','epaulettes','storm shield and gun flap','leather-buckle belt and cuffs','Burberry Check lining'],fidelityStatus:'reference_verified'},
 {id:'socks_cream',slot:'socks',zh:'奶油荷叶边袜',jp:'靴下',reading:'くつした',verb:'はく',style:'sweet',color:'cream',lexeme:'socks',css:'socks',tags:['spring']},
 {id:'shoes_maryjane',slot:'shoes',zh:'粉色玛丽珍鞋',jp:'メリージェーンシューズ',reading:'メリージェーンシューズ',verb:'はく',style:'sweet',color:'pink',lexeme:'shoes',css:'maryjane',tags:['elegant']},
 {id:'adidas_samba',slot:'shoes',zh:'adidas Samba OG',jp:'サンバ OG',reading:'サンバ オージー',verb:'はく',style:'casual',color:'black',lexeme:'sneakers',css:'samba',brand:'adidas',tags:['walking','travel'],exactProductName:'Samba OG',officialNameJa:'アディダス サンバOG / Samba OG',sourceUrl:'https://www.adidas.jp/%E3%82%B5%E3%83%B3%E3%83%90og-samba-og/JI2734.html',productCode:'JI2734',colorway:'ブラック',referenceDate:'2026-09-06',designFeatures:['low-profile leather upper','suede T-toe overlay','three stripes','gum sole'],fidelityStatus:'reference_verified'},
 {id:'hat_beret',slot:'hat',zh:'深蓝贝雷帽',jp:'ベレー帽',reading:'ベレーぼう',verb:'かぶる',style:'classic',color:'navy',lexeme:'hat',css:'beret',tags:['autumn']},
 {id:'lv_neverfull',slot:'bag',zh:'Louis Vuitton Neverfull MM',jp:'ネヴァーフル MM',reading:'ネヴァーフル エムエム',verb:'持つ',style:'classic',color:'brown',lexeme:'bag',css:'neverfull',brand:'lv',tags:['travel','giftScene'],exactProductName:'Neverfull MM Monogram',officialNameJa:'ネヴァーフル MM モノグラム',sourceUrl:'https://jp.louisvuitton.com/jpn-jp/products/neverfull-mm-monogram-nvprod5350101v/M46975',productCode:'M46975',colorway:'モノグラム',referenceDate:'2026-09-06',designFeatures:['open-top tote','natural leather slim handles','side laces','Monogram canvas'],fidelityStatus:'reference_verified'}
];
export const LEXEMES = {
 blouse:{jp:'ブラウス',reading:'ブラウス',zh:'女式衬衫',verb:'着る',sentences:[['白いブラウスを着ます。','しろいブラウスをきます。','我穿白色衬衫。'],['このブラウスは軽いです。','このブラウスはかるいです。','这件衬衫很轻。']]},
 shirt:{jp:'Tシャツ',reading:'ティーシャツ',zh:'T 恤',verb:'着る',sentences:[['今日はTシャツを着ます。','きょうはティーシャツをきます。','今天穿 T 恤。'],['このTシャツが好きです。','このティーシャツがすきです。','我喜欢这件 T 恤。']]},
 skirt:{jp:'スカート',reading:'スカート',zh:'半身裙',verb:'はく',sentences:[['今日はスカートをはきます。','きょうはスカートをはきます。','今天我穿半身裙。'],['青いスカートを見ます。','あおいスカートをみます。','我看看蓝色的半身裙。']]},
 jeans:{jp:'ジーンズ',reading:'ジーンズ',zh:'牛仔裤',verb:'はく',sentences:[['ジーンズをはきます。','ジーンズをはきます。','我穿牛仔裤。'],['このジーンズは楽です。','このジーンズはらくです。','这条牛仔裤穿着舒服。']]},
 dress:{jp:'ワンピース',reading:'ワンピース',zh:'连衣裙',verb:'着る',sentences:[['このワンピースで出かけます。','このワンピースででかけます。','我穿这条连衣裙出门。'],['花柄のワンピースが好きです。','はながらのワンピースがすきです。','我喜欢花纹连衣裙。']]},
 cardigan:{jp:'カーディガン',reading:'カーディガン',zh:'开衫',verb:'着る',sentences:[['寒いので、カーディガンを着ます。','さむいので、カーディガンをきます。','因为冷，我穿开衫。'],['このカーディガンはやわらかいです。','このカーディガンはやわらかいです。','这件开衫很柔软。']]},
 trench:{jp:'トレンチコート',reading:'トレンチコート',zh:'风衣',verb:'着る',sentences:[['雨の日はコートを着ます。','あめのひはコートをきます。','雨天我穿外套。'],['バーバリーのコートを試着してもいいですか。','バーバリーのコートをしちゃくしてもいいですか。','我可以试穿巴宝莉的外套吗？']]},
 socks:{jp:'靴下',reading:'くつした',zh:'袜子',verb:'はく',sentences:[['白い靴下をはきます。','しろいくつしたをはきます。','我穿白袜子。'],['靴下を二足買います。','くつしたをにそくかいます。','我买两双袜子。']]},
 shoes:{jp:'靴',reading:'くつ',zh:'鞋',verb:'はく',sentences:[['新しい靴をはきます。','あたらしいくつをはきます。','我穿新鞋。'],['この靴は歩きやすいです。','このくつはあるきやすいです。','这双鞋走路舒服。']]},
 sneakers:{jp:'スニーカー',reading:'スニーカー',zh:'运动鞋',verb:'はく',sentences:[['アディダスのスニーカーをよくはきます。','アディダスのスニーカーをよくはきます。','我经常穿阿迪达斯运动鞋。'],['このサンバの別のサイズはありますか。','このサンバのべつのサイズはありますか。','这款 Samba 有其他尺码吗？']]},
 hat:{jp:'帽子',reading:'ぼうし',zh:'帽子',verb:'かぶる',sentences:[['外では帽子をかぶります。','そとではぼうしをかぶります。','在外面我戴帽子。'],['帽子を忘れました。','ぼうしをわすれました。','我忘带帽子了。']]},
 bag:{jp:'バッグ',reading:'バッグ',zh:'包',verb:'持つ',sentences:[['小さいバッグを持っていきます。','ちいさいバッグをもっていきます。','我带小包去。'],['ネヴァーフルにこの本は入りますか。','ネヴァーフルにこのほんははいりますか。','这本书放得进 Neverfull 吗？']]}
};
const EXTRA_LEXEME_SPECS=[
 ['jacket','ジャケット','ジャケット','夹克','着る'],['coat','コート','コート','大衣','着る'],['parka','パーカー','パーカー','连帽卫衣','着る'],['hoodie','フーディー','フーディー','连帽衫','着る'],['knit','ニット','ニット','针织衫','着る'],['vest','ベスト','ベスト','马甲','着る'],['tunic','チュニック','チュニック','束腰上衣','着る'],
 ['slacks','スラックス','スラックス','西裤','はく'],['shorts','ショートパンツ','ショートパンツ','短裤','はく'],['widepants','ワイドパンツ','ワイドパンツ','阔腿裤','はく'],['longskirt','ロングスカート','ロングスカート','长裙','はく'],['leggings','レギンス','レギンス','打底裤','はく'],['tights','タイツ','タイツ','连裤袜','はく'],
 ['sandals','サンダル','サンダル','凉鞋','はく'],['boots','ブーツ','ブーツ','靴子','はく'],['loafers','ローファー','ローファー','乐福鞋','はく'],['pumps','パンプス','パンプス','浅口高跟鞋','はく'],['balletflats','バレエシューズ','バレエシューズ','芭蕾平底鞋','はく'],['rainboots','レインブーツ','レインブーツ','雨靴','はく'],['mules','ミュール','ミュール','穆勒鞋','はく'],['slippers','スリッパ','スリッパ','拖鞋','はく'],
 ['cap','キャップ','キャップ','棒球帽','かぶる'],['knitcap','ニット帽','ニットぼう','针织帽','かぶる'],['hairband','ヘアバンド','ヘアバンド','发带','つける'],['hairclip','ヘアクリップ','ヘアクリップ','发夹','つける'],['ribbon','リボン','リボン','蝴蝶结','つける'],['headband','カチューシャ','カチューシャ','头箍','つける'],
 ['glasses','眼鏡','めがね','眼镜','かける'],['sunglasses','サングラス','サングラス','太阳镜','かける'],['earrings','イヤリング','イヤリング','耳夹','つける'],['necklace','ネックレス','ネックレス','项链','つける'],['bracelet','ブレスレット','ブレスレット','手链','つける'],['ring','指輪','ゆびわ','戒指','つける'],['watch','腕時計','うでどけい','手表','つける'],['brooch','ブローチ','ブローチ','胸针','つける'],
 ['tote','トートバッグ','トートバッグ','托特包','持つ'],['shoulderbag','ショルダーバッグ','ショルダーバッグ','单肩包','持つ'],['backpack','リュック','リュック','双肩包','持つ'],['clutch','クラッチバッグ','クラッチバッグ','手拿包','持つ'],['wallet','財布','さいふ','钱包','持つ'],['umbrella','傘','かさ','雨伞','持つ'],['suitcase','スーツケース','スーツケース','行李箱','持つ'],['ecobag','エコバッグ','エコバッグ','环保袋','持つ'],
 ['mask','マスク','マスク','口罩','つける'],['apron','エプロン','エプロン','围裙','着る'],['yukata','浴衣','ゆかた','浴衣','着る'],['robe','ローブ','ローブ','长袍','着る'],['raincoat','レインコート','レインコート','雨衣','着る'],['tracksuit','ジャージ','ジャージ','运动服','着る'],['polo','ポロシャツ','ポロシャツ','Polo衫','着る'],['tanktop','タンクトップ','タンクトップ','背心','着る'],['leatherjacket','レザージャケット','レザージャケット','皮夹克','着る'],['windbreaker','ウインドブレーカー','ウインドブレーカー','防风外套','着る'],['overalls','オーバーオール','オーバーオール','背带裤','着る'],['culottes','キュロット','キュロット','裙裤','はく'],['jumpsuit','ジャンプスーツ','ジャンプスーツ','连体裤','着る'],['blazer','ブレザー','ブレザー','西装外套','着る'],['sweatshirt','スウェット','スウェット','卫衣','着る']
];
const POLITE={着る:['着ます','きます','穿'],はく:['はきます','はきます','穿'],かぶる:['かぶります','かぶります','戴'],かける:['かけます','かけます','戴'],つける:['つけます','つけます','戴'],持つ:['持ちます','もちます','带']};
export const EXTRA_LEXEMES=Object.fromEntries(EXTRA_LEXEME_SPECS.map(([id,jp,reading,zh,verb])=>{const [polite,politeReading,action]=POLITE[verb];return [id,{jp,reading,zh,verb,sentences:[[`今日は${jp}を${polite}。`,`きょうは${reading}を${politeReading}。`,`今天我${action}${zh}。`],[`この${jp}が好きです。`,`この${reading}がすきです。`,`我喜欢这个${zh}。`]]}]}));
Object.assign(LEXEMES,EXTRA_LEXEMES);
for(const [id,sentences] of Object.entries(EVERYDAY))if(LEXEMES[id])LEXEMES[id].sentences=sentences;
LEXEMES.tunic.zh='长款上衣';LEXEMES.boots.zh='靴子';LEXEMES.pumps.zh='浅口女鞋';LEXEMES.apron.verb='つける';
export const BRANDS={burberry:{latin:'Burberry',ja:'バーバリー'},adidas:{latin:'adidas',ja:'アディダス'},lv:{latin:'Louis Vuitton',ja:'ルイ・ヴィトン'}};
export const LIFE_QUESTIONS=[
 {id:'cafe_dine_in',prompt:'你想坐在店里喝，怎么回答？',options:[['dine','店内でお願いします。'],['takeaway','持ち帰りでお願いします。'],['think','もう少し考えます。'],['umbrella','傘を持っていきましょう。']],correctOptionIds:['dine'],explanationZh:'「店内で」表示在店内。'},
 {id:'shop_size',prompt:'你想询问大一点的尺码，怎么说？',options:[['size','もう少し大きいサイズはありますか。'],['room','試着室はどこですか。'],['price','これはいくらですか。'],['rest','少し休みませんか。']],correctOptionIds:['size'],explanationZh:'「もう少し大きいサイズ」表示“再大一点的尺码”。'},
 {id:'rain_umbrella',prompt:'看起来要下雨了，建议带伞。选合适表达：',options:[['umbrella','傘を持っていきましょう。'],['birthday','お誕生日おめでとうございます。'],['dinner','二人です。'],['photo','一緒に写真を撮りましょう。']],correctOptionIds:['umbrella'],explanationZh:'「〜ましょう」可以用于温和地提议一起做某事。'},
 {id:'dinner_booking',prompt:'你预约了六点，怎么告诉店员？',options:[['booking','六時に予約しています。'],['station','駅まで歩いて何分ですか。'],['sugar','砂糖は入れません。'],['color','この色が好きです。']],correctOptionIds:['booking'],explanationZh:'「予約しています」表示已经预约。'}
];
export const SCENES=[['cafe','咖啡店约会','任选上衣＋下装或连衣裙，和一双鞋','店内でお願いします。'],['rain','雨天出门','选择带有 rain 标签的鞋或外套','傘を持っていきましょう。'],['shop','商店试穿','任选一件准备试穿的服装','もう少し大きいサイズはありますか。'],['walk','周末散步','选择带有 walking 标签的鞋','少し休みませんか。'],['birthday','朋友生日','选择带有 giftScene 标签的单品','お誕生日おめでとうございます。'],['trip','电车小旅行','选择带有 travel 标签的鞋或包','駅まで歩いて何分ですか。'],['museum','美术馆','选择经典或休闲风的单品','これはいくらですか。'],['hanami','赏花野餐','选择带有 spring 标签的单品','一緒に写真を撮りましょう。'],['summer','夏日购物','选择轻盈的上衣或连衣裙','この色が好きです。'],['book','秋天书店','选择带有 autumn 标签的单品','この本を探しています。'],['winter','冬日咖啡','选择带有 warm 标签的外套','温かい飲み物をお願いします。'],['dinner','晚餐见面','完成一套上衣＋下装或连衣裙，并穿鞋','二人です。']];

ITEMS.push(...EXPANSION_ITEMS);
Object.assign(LEXEMES,EXPANSION_LEXEMES);

ITEMS.push(...HAIRSTYLES);Object.assign(LEXEMES,HAIR_WORDS);

Object.assign(LEXEMES,{
 wrapskirt:{jp:'ラップスカート',reading:'ラップスカート',zh:'裹身裙',verb:'はく',sentences:[['今日はピンクのスカートをはきます。','きょうはピンクのスカートをはきます。','今天穿粉色裙子。'],['このスカートを試着してもいいですか。','このスカートをしちゃくしてもいいですか。','可以试穿这条裙子吗？']]},
 vest:{jp:'ニットベスト',reading:'ニットベスト',zh:'针织背心',verb:'着る',sentences:[['少し寒いので、ベストを着ます。','すこしさむいので、ベストをきます。','有点冷，所以穿件背心。'],['この黄色が好きです。','このきいろがすきです。','我喜欢这个黄色。']]},
 buckethat:{jp:'バケットハット',reading:'バケットハット',zh:'渔夫帽',verb:'かぶる',sentences:[['散歩するとき、帽子をかぶります。','さんぽするとき、ぼうしをかぶります。','散步时会戴帽子。'],['この帽子は私に似合いますか。','このぼうしはわたしににあいますか。','这顶帽子适合我吗？']]},
 'cargo pants':{jp:'カーゴパンツ',reading:'カーゴパンツ',zh:'工装裤',verb:'はく',sentences:[['カーゴパンツはポケットが多くて便利です。','カーゴパンツはポケットがおおくてべんりです。','工装裤口袋很多，很方便。']]},
 'pleated trousers':{jp:'プリーツトラウザーズ',reading:'プリーツトラウザーズ',zh:'褶裥西装裤',verb:'はく',sentences:[['プリーツトラウザーズをきれいめに合わせます。','プリーツトラウザーズをきれいめにあわせます。','我把褶裥西装裤搭配得更正式。']]},
 'denim skirt':{jp:'デニムスカート',reading:'デニムスカート',zh:'牛仔裙',verb:'はく',sentences:[['デニムスカートに白いシャツを合わせます。','デニムスカートにしろいシャツをあわせます。','我用白衬衫搭配牛仔裙。']]}
 ,'bias skirt':{jp:'バイアススカート',reading:'バイアススカート',zh:'斜裁裙',verb:'はく',sentences:[['バイアススカートは歩くとやわらかく揺れます。','バイアススカートはあるくとやわらかくゆれます。','斜裁裙走路时会柔和地摆动。']]}
});
BRANDS.chanel={latin:'CHANEL',ja:'シャネル'};
for(const item of [...BATCH_ITEMS,...ITEMS_V7,...ITEMS_V10,...ITEMS_V15]){const l=LEXEMES[item.lexeme];Object.assign(item,{jp:l.jp,reading:l.reading,verb:l.verb});ITEMS.push(item);}
for(const item of ITEMS_V17){const l=LEXEMES[item.lexeme];Object.assign(item,{jp:l.jp,reading:l.reading,verb:l.verb});ITEMS.push(item);}
Object.assign(BRANDS,{lacoste:{latin:"Lacoste",ja:"ラコステ"},levis:{latin:"Levi’s",ja:"リーバイス"},converse:{latin:"Converse",ja:"コンバース"},fredperry:{latin:"Fred Perry",ja:"フレッドペリー"},birkenstock:{latin:"Birkenstock",ja:"ビルケンシュトック"},drmartens:{latin:"Dr. Martens",ja:"ドクターマーチン"},longchamp:{latin:"Longchamp",ja:"ロンシャン"},onitsuka:{latin:"Onitsuka Tiger",ja:"オニツカタイガー"},newbalance:{latin:"New Balance",ja:"ニューバランス"},vans:{latin:"Vans",ja:"ヴァンズ"},margiela:{latin:"Maison Margiela",ja:"メゾン マルジェラ"},puma:{latin:"PUMA",ja:"プーマ"},celine:{latin:"Celine",ja:"セリーヌ"},prada:{latin:"Prada",ja:"プラダ"}});

// Every clothing word used by the wardrobe now has four examples.  These are
// generated from the word's actual Japanese spelling and reading so newly
// added colour/style variants automatically share useful fitting-room language.
const CLOTHING_LEXEMES=new Set(ITEMS.filter(item=>!['hair','hat','bag'].includes(item.slot)).map(item=>item.lexeme));
for(const id of CLOTHING_LEXEMES){
 const lex=LEXEMES[id];if(!lex)continue;
 if(lex.verb==='着る')lex.sentences.push([`この${lex.jp}は着心地がいいです。`,`この${lex.reading}はきごこちがいいです。`,`这件${lex.zh}穿着很舒服。`],[`サイズが合えば、この${lex.jp}を買います。`,`サイズがあえば、この${lex.reading}をかいます。`,`如果尺码合适，我会买这件${lex.zh}。`]);
 else if(lex.verb==='はく')lex.sentences.push([`この${lex.jp}は動きやすいです。`,`この${lex.reading}はうごきやすいです。`,`这件${lex.zh}活动起来很方便。`],[`試着してから、この${lex.jp}を選びます。`,`しちゃくしてから、この${lex.reading}をえらびます。`,`试穿后我再选这件${lex.zh}。`]);
}
LEXEMES.hat.sentences.push(['この帽子は日差しよけになります。','このぼうしはひざしよけになります。','这顶帽子可以遮阳。'],['風が強い日は、帽子をしっかりかぶります。','かぜがつよいひは、ぼうしをしっかりかぶります。','风大的日子会把帽子戴牢。']);
LEXEMES.buckethat.sentences.push(['このバケットハットは軽くて便利です。','このバケットハットはかるくてべんりです。','这顶渔夫帽轻便实用。'],['旅行にはバケットハットを持っていきます。','りょこうにはバケットハットをもっていきます。','旅行时我会带上渔夫帽。']);
LEXEMES.bag.sentences.push(['このバッグにはノートと水が入ります。','このバッグにはノートとみずがはいります。','这个包能装下笔记本和水。'],['バッグを肩にかけて出かけます。','バッグをかたにかけてでかけます。','我把包挎在肩上出门。']);
LEXEMES.earrings.sentences.push(['このイヤリングは顔まわりを明るく見せます。','このイヤリングはかおまわりをあかるくみせます。','这副耳饰让脸部周围看起来更明亮。'],['食事の前にイヤリングを外します。','しょくじのまえにイヤリングをはずします。','吃饭前我会取下耳饰。']);
LEXEMES.necklace.sentences.push(['このネックレスは首元によく合います。','このネックレスはくびもとによくあいます。','这条项链很适合颈部线条。'],['細いネックレスを重ねてつけます。','ほそいネックレスをかさねてつけます。','我会叠戴细项链。']);
LEXEMES.bracelet.sentences.push(['このブレスレットは手首にぴったりです。','このブレスレットはてくびにぴったりです。','这条手链刚好贴合手腕。'],['時計とブレスレットを一緒につけます。','とけいとブレスレットをいっしょにつけます。','我会把手表和手链一起戴。']);

completeCatalog(ITEMS,LEXEMES,BRANDS);
ITEMS.push({id:'shoes_maryjane_socks_v19',slot:'shoes',zh:'巧克力玛丽珍鞋配奶油短袜',jp:'ソックス付きメリージェーン',reading:'ソックスつきメリージェーン',verb:'はく',style:'sweet',color:'brown',lexeme:'maryjane_socks',tags:['spring']});
LEXEMES.maryjane_socks={jp:'ソックス付きメリージェーン',reading:'ソックスつきメリージェーン',zh:'玛丽珍鞋配短袜',verb:'はく',sentences:[['白い靴下に茶色の靴を合わせます。','しろいくつしたにちゃいろのくつをあわせます。','我用白袜子搭配棕色鞋子。'],['この靴と靴下はよく合います。','このくつとくつしたはよくあいます。','这双鞋和袜子很搭。']]};
ITEMS.splice(ITEMS.findIndex(x=>x.id==='outer_bolero'),1);
ITEMS.push({id:'brand_fredperry_track_v22',slot:'outer',zh:'Fred Perry 月桂叶织带运动外套',jp:'トラックジャケット',reading:'トラックジャケット',verb:'着る',style:'casual',color:'black',lexeme:'fredperry_track',brand:'fredperry',longSleeves:true,tags:['warm','walking'],sourceUrl:'https://www.fredperry.jp/shop/g/gJ4620-4550392186593/',exactProductName:'Taped Track Jacket',fidelityStatus:'illustrated_reference'});
LEXEMES.fredperry_track={jp:'トラックジャケット',reading:'トラックジャケット',zh:'运动外套',verb:'着る',sentences:[['散歩に行くので、ジャケットを着ます。','さんぽにいくので、ジャケットをきます。','要去散步，所以穿上外套。'],['寒いので、ファスナーを閉めます。','さむいので、ファスナーをしめます。','因为冷，所以拉上拉链。']]};
// Hats are complete, mutually exclusive hair looks; IDs remain save-compatible.
for(const item of ITEMS.filter(x=>['hat_beret','brand_burberry_hat_v7'].includes(x.id))){item.slot='hair';item.headwear=true;item.zh=item.id==='hat_beret'?'贝雷帽配长发':'Burberry 格纹渔夫帽配长发';}
ITEMS.push({id:'hair_rose_cap_v24',slot:'hair',headwear:true,zh:'樱粉棒球帽配低马尾',jp:'キャップ',reading:'キャップ',verb:'かぶる',style:'casual',color:'pink',lexeme:'cap_v24',tags:['walking']});
LEXEMES.cap_v24={jp:'キャップ',reading:'キャップ',zh:'棒球帽',verb:'かぶる',sentences:[['散歩に行くとき、キャップをかぶります。','さんぽにいくとき、キャップをかぶります。','去散步时，我会戴棒球帽。'],['この帽子は髪型に合います。','このぼうしはかみがたにあいます。','这顶帽子和发型很搭。']]};
const batchV26=[
 ['brand_lacoste_pink_v26','top','Lacoste 樱粉珠地 Polo 衫','ポロシャツ','polo','lacoste','pink'],
 ['brand_ralph_navy_v26','top','Ralph Lauren 藏蓝绞花毛衣','ケーブルニット','knit','ralphlauren','navy'],
 ['brand_adidas_red_v26','outer','adidas 酒红运动外套','トラックジャケット','fredperry_track','adidas','red'],
 ['hair_pearl_updo_v26','hair','珍珠耳坠高盘发','パールのイヤリング付きアップヘア','v26_updo',null,'brown'],
 ['hair_hoop_pony_v26','hair','金圈耳环高马尾','フープイヤリング付きポニーテール','v26_pony',null,'brown'],
 ['hair_straw_pearl_v26','hair','珍珠耳钉草编帽','パールのイヤリング付き麦わら帽子','v26_straw',null,'cream']
];
for(const [id,slot,zh,jp,lexeme,brand,color] of batchV26){if(!LEXEMES[lexeme])LEXEMES[lexeme]={jp,reading:jp,zh,verb:slot==='hair'?'する':'着る',sentences:[[slot==='hair'?'髪をまとめると、イヤリングがよく見えます。':'この服を試着してもいいですか。',slot==='hair'?'かみをまとめると、イヤリングがよくみえます。':'このふくをしちゃくしてもいいですか。',slot==='hair'?'把头发扎起来，就能清楚地看到耳环。':'可以试穿这件衣服吗？']]};ITEMS.push({id,slot,zh,jp,reading:jp,lexeme,brand,color,style:slot==='hair'?'sweet':'casual',verb:slot==='hair'?'する':'着る',tags:[],integratedEarrings:slot==='hair',headwear:id==='hair_straw_pearl_v26'});}
BRANDS.marimekko={latin:'Marimekko',ja:'マリメッコ'};
for(const [id,zh,jp,brand,color,url] of [
 ['dress_lacoste_v27','Lacoste 鼠尾草绿 Polo 连衣裙','ポロワンピース','lacoste','green','https://www.lacoste.jp/women/clothing/skirts-dresses'],
 ['dress_ralph_v27','Ralph Lauren 藏蓝系带衬衫裙','ベルト付きシャツワンピース','ralphlauren','navy','https://www.ralphlauren.com/women-clothing-dresses/fit-and-flare-shirtdress/0039104880.html'],
 ['dress_unikko_v27','Marimekko Unikko 花朵连衣裙','花柄ワンピース','marimekko','pink','https://www.marimekko.jp/shop/marimekko/item/view/shop_product_id/28059']]){
 LEXEMES[id]={jp,reading:jp.replace('付き','つき').replace('花柄','はながら'),zh,verb:'着る',sentences:[['今日はワンピースで出かけます。','きょうはワンピースででかけます。','今天穿连衣裙出门。'],['このワンピースは動きやすいです。','このワンピースはうごきやすいです。','这条连衣裙活动起来很方便。']]};ITEMS.push({id,slot:'dress',zh,jp,reading:LEXEMES[id].reading,lexeme:id,brand,color,style:brand==='marimekko'?'sweet':'classic',verb:'着る',tags:['spring'],sourceUrl:url});}
