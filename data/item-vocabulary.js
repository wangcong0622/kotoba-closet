import {ITEM_DESCRIPTIONS} from './item-descriptions.js';
const words=(jp,reading,zh)=>({jp,reading,zh});
export const COLOR_LABELS={white:'白色',pink:'粉色',navy:'海军蓝',blue:'蓝色',mint:'薄荷绿',black:'黑色',brown:'棕色',cream:'奶油／米色',green:'绿色',yellow:'黄色',gold:'金色',grey:'灰色',purple:'紫色',red:'红色'};
const COLORS={white:words('白','しろ','白色'),pink:words('ピンク','ピンク','粉色'),navy:words('紺色','こんいろ','海军蓝'),blue:words('青','あお','蓝色'),mint:words('ミントグリーン','ミントグリーン','薄荷绿'),black:words('黒','くろ','黑色'),brown:words('茶色','ちゃいろ','棕色'),cream:words('クリーム色','クリームいろ','奶油色'),green:words('緑','みどり','绿色'),yellow:words('黄色','きいろ','黄色'),gold:words('金色','きんいろ','金色'),grey:words('グレー','グレー','灰色'),purple:words('薄紫','うすむらさき','淡紫色'),red:words('赤','あか','红色'),sage:words('セージグリーン','セージグリーン','鼠尾草绿'),teal:words('青緑','あおみどり','蓝绿色'),darkgreen:words('深緑','ふかみどり','深绿色'),olive:words('オリーブ色','オリーブいろ','橄榄绿'),burgundy:words('ワインレッド','ワインレッド','酒红色'),charcoal:words('チャコールグレー','チャコールグレー','炭灰色'),bluegrey:words('ブルーグレー','ブルーグレー','蓝灰色')};
const FEATURES={stripe:words('ボーダー柄','ボーダーがら','条纹'),flower:words('花柄','はながら','花纹'),check:words('チェック柄','チェックがら','格纹'),cable:words('ケーブル編み','ケーブルあみ','绞花纹'),pleat:words('プリーツ','プリーツ','褶皱'),rib:words('リブ編み','リブあみ','罗纹'),triple:words('三本線','さんぼんせん','三道杠'),monogram:words('モノグラム柄','モノグラムがら','字母组合纹'),quilt:words('キルティング','キルティング','绗缝'),bow:words('リボン','リボン','蝴蝶结'),lace:words('レース','レース','蕾丝'),laurel:words('ローレルリース柄','ローレルリースがら','月桂叶纹'),hood:words('フード','フード','兜帽'),belt:words('ベルト','ベルト','腰带'),sailor:words('セーラーカラー','セーラーカラー','水手领'),pearl:words('パール','パール','珍珠装饰'),hoop:words('フープイヤリング','フープイヤリング','圈形耳环')};
const FABRICS={denim:words('デニム','デニム','牛仔布'),tweed:words('ツイード','ツイード','粗花呢'),satin:words('サテン','サテン','缎面'),knit:words('ニット','ニット','针织面料'),linen:words('リネン','リネン','亚麻'),corduroy:words('コーデュロイ','コーデュロイ','灯芯绒'),leather:words('レザー','レザー','皮革'),nylon:words('ナイロン','ナイロン','尼龙'),canvas:words('キャンバス','キャンバス','帆布'),tulle:words('チュール','チュール','薄纱')};
export function itemLexeme(item,lexeme){
 const kind=ITEM_DESCRIPTIONS[item?.id]?.kind;
 if(!kind)return lexeme;
 const [jp,reading,zh,verb]=kind;
 // Keep the original learning target ID while correcting the displayed noun.
 return {...lexeme,jp,reading,zh,verb,sentences:[[`この${jp}が好きです。`,`この${reading}がすきです。`,`我喜欢这款${zh}。`]]};
}
export function itemVocabulary(item,lexeme){
 const desc=ITEM_DESCRIPTIONS[item?.id]||{},lex=itemLexeme(item,lexeme);
 const rows=[{label:'种类',word:words(lex?.jp||item?.jp||'アイテム',lex?.reading||item?.reading||'アイテム',lex?.zh||item?.zh||'单品')}];
 const color=COLORS[desc.tone||desc.color||item?.color];if(color)rows.push({label:item?.slot==='hair'&&!item?.headwear&&!/帽|cap/.test(item?.id||'')?'发色':'颜色',word:color});
 if(FEATURES[desc.feature])rows.push({label:'细节',word:FEATURES[desc.feature]});
 if(FABRICS[desc.fabric])rows.push({label:'面料',word:FABRICS[desc.fabric]});
 return rows;
}
export function itemExampleSentences(item,lexeme){
 const lex=itemLexeme(item,lexeme),vocab=itemVocabulary(item,lex),color=vocab.find(x=>['颜色','发色'].includes(x.label))?.word;
 if(item?.slot==='hair'&&!item?.headwear&&!/帽|cap/.test(item?.id||''))return [[`この${lex.jp}にしてみたいです。`,`この${lex.reading}にしてみたいです。`,`我想试试这个${lex.zh}。`]];
 const rows=[[`この${lex.jp}を選びました。`,`この${lex.reading}をえらびました。`,`我选了这款${lex.zh}。`]];
 if(color)rows.unshift([`この${lex.jp}の色は${color.jp}です。`,`この${lex.reading}のいろは${color.reading}です。`,`这款${lex.zh}是${color.zh}。`]);
 const detail=vocab.find(x=>x.label==='细节')?.word;if(detail)rows.push([`この${lex.jp}は、${detail.jp}が特徴です。`,`この${lex.reading}は、${detail.reading}がとくちょうです。`,`这款${lex.zh}的特点是${detail.zh}。`]);
 return rows;
}

