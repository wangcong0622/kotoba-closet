const words=(jp,reading,zh)=>({jp,reading,zh});
const COLORS={white:words('白','しろ','白色'),pink:words('桜色','さくらいろ','樱粉色'),navy:words('紺色','こんいろ','海军蓝'),blue:words('青','あお','蓝色'),mint:words('ミントグリーン','ミントグリーン','薄荷绿'),black:words('チャコールグレー','チャコールグレー','炭灰色'),brown:words('茶色','ちゃいろ','棕色'),cream:words('クリーム色','クリームいろ','奶油色'),green:words('深緑','ふかみどり','深绿色'),yellow:words('金色','きんいろ','金色')};
const PLAIN=words('無地','むじ','纯色');

export function itemVocabulary(item,lexeme){
 const id=item?.id||'';
 const pattern=/fredperry_track/.test(id)?words('ローレルリース柄','ローレルリースがら','月桂叶纹'): /stripe|rugby/.test(id)?words('ボーダー柄','ボーダーがら','条纹'): /floral/.test(id)?words('花柄','はながら','花纹'): /gingham/.test(id)?words('ギンガムチェック','ギンガムチェック','格纹'): /cable|vest/.test(id)?words('ケーブル編み','ケーブルあみ','绞花纹'): /pleat/.test(id)?words('プリーツ','プリーツ','褶皱'): /tweed/.test(id)?words('ツイード織り','ツイードおり','粗花呢织纹'): /firebird/.test(id)?words('三本線','さんぼんせん','三道杠'): PLAIN;
 const material=/fredperry_track/.test(id)?words('トリコット','トリコット','经编面料'): /denim|jeans|levis/.test(id)?words('デニム','デニム','牛仔布'): /tweed/.test(id)?words('ツイード','ツイード','粗花呢'): /satin/.test(id)?words('サテン','サテン','缎面'): /leather|martens|biker/.test(id)?words('レザー','レザー','皮革'): /knit|cable|cardigan|sweater|hoodie|vest/.test(id)?words('ニット','ニット','针织'): /bag|neverfull|chanel|longchamp/.test(id)?words('キャンバス','キャンバス','帆布'): /shoes|samba|loafers|ballet|boots|pumps/.test(id)?words('レザー','レザー','皮革'): words('コットン','コットン','棉');
 return [{label:'种类',word:words(lexeme?.jp||item?.jp||'アイテム',lexeme?.reading||item?.reading||'アイテム',lexeme?.zh||item?.zh||'单品')},{label:'颜色',word:COLORS[item?.color]||words('ナチュラルカラー','ナチュラルカラー','自然色')},{label:'花纹',word:pattern},{label:'材质',word:material}];
}

export function itemExampleSentences(item,lexeme){
 const [,color,pattern,material]=itemVocabulary(item,lexeme),noun=lexeme.jp,reading=lexeme.reading;
 return [[`この${color.word.jp}の${pattern.word.jp}${noun}は、${material.word.jp}の質感が特徴です。`,`この${color.word.reading}の${pattern.word.reading}${reading}は、${material.word.reading}のしっかんがとくちょうです。`,`这件${color.word.zh}${pattern.word.zh}${lexeme.zh}的特色是${material.word.zh}质感。`],[`試着室で、${noun}のサイズと生地の厚さを確認してから選びます。`,`しちゃくしつで、${reading}のサイズときじのあつさをかくにんしてからえらびます。`,`我会在试衣间确认${lexeme.zh}的尺码和面料厚度后再选择。`]];
}

