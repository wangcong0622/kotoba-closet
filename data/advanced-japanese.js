import {LIFE_EXPRESSIONS} from './life-expressions.js';
import {ITEMS,LEXEMES} from './content.js';
export function advancedItemExamples(item,lexeme){
 const noun=lexeme?.jp||'',slot=item?.slot||ITEMS.find(candidate=>LEXEMES[candidate.lexeme]===lexeme)?.slot;
 const headwear=item?.headwear||lexeme?.verb==='かぶる'||/帽子|ハット|キャップ|ベレー/.test(noun);
 const hair=slot==='hair'||/ヘア|髪|ポニーテール|三つ編み|アップ/.test(noun);
 const category=headwear?'headwear':hair?'hair':slot==='shoes'?'shoes':slot==='bottom'?'bottom':slot==='bag'?'bag':['necklace','bracelet','earrings','glasses'].includes(slot)?'accessory':['top','dress','outer'].includes(slot)?'clothes':'shopping';
 return LIFE_EXPRESSIONS[category];
}
export function clozeExample(example){
 return {...example,jp:example.jp.replace(example.focus,'＿＿'),reading:example.reading.replace(example.focusReading||example.focus,'＿＿')};
}
