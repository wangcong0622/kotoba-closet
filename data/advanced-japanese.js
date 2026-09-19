const row=(jp,reading,zh,level,grammar,note,focus)=>({jp,reading,zh,level,grammar,note,focus});

function contextualExample(item,lexeme){
 const noun=lexeme.jp,reading=lexeme.reading,isHair=/ヘア|髪|ポニーテール|アップ/.test(noun),isHeadwear=/帽子|ハット|キャップ|ベレー/.test(noun),slot=item?.slot||(lexeme.verb==='はく'?'bottom':lexeme.verb==='かぶる'||isHair||isHeadwear?'hair':['持つ','つける'].includes(lexeme.verb)?'accessory':'top');
 if(['top','dress','outer'].includes(slot))return row(
  `気温が下がったときにも着られるように、この${noun}は薄手の服と重ねて着るつもりです。`,
  `きおんがさがったときにもきられるように、この${reading}はうすでのふくとかさねてきるつもりです。`,
  `为了降温时也能穿，我打算把这件${lexeme.zh}和薄款衣服叠穿。`,
  'N3','～ように','表示为了实现某个目标而采取行动。','ように'
 );
 if(['bottom','shoes'].includes(slot))return row(
  `長時間歩くことを考えると、この${noun}は見た目よりも動きやすさを重視して選びたいです。`,
  `ちょうじかんあるくことをかんがえると、この${reading}はみためよりもうごきやすさをじゅうししてえらびたいです。`,
  `考虑到要长时间走路，选这件${lexeme.zh}时我更想重视活动方便，而不是只看外观。`,
  'N3','～ことを考えると','表示把某种情况纳入考虑后得出的判断。','ことを考えると'
 );
 if(slot==='hair'&&isHeadwear)return row(
  `顔まわりが暗く見えないように、この${noun}は少し浅めにかぶっています。`,
  `かおまわりがくらくみえないように、この${reading}はすこしあさめにかぶっています。`,
  `为了不让脸部周围显得暗沉，我把这顶${lexeme.zh}戴得稍微浅一些。`,
  'N3','～ように','表示为了避免某种结果而调整做法。','ように'
 );
 if(slot==='hair')return row(
  `顔まわりがすっきり見えるように、この${noun}はボリュームを少し抑えてもらいました。`,
  `かおまわりがすっきりみえるように、この${reading}はボリュームをすこしおさえてもらいました。`,
  `为了让脸部周围显得利落，我请人把这个${lexeme.zh}的蓬松度稍微压低了一些。`,
  'N3','～てもらう','表示请别人为自己做某事。','てもらいました'
 );
 return row(
  `装いが単調に見えないように、この${noun}をアクセントとして取り入れています。`,
  `よそおいがたんちょうにみえないように、この${reading}をアクセントとしてとりいれています。`,
  `为了不让穿搭显得单调，我把这件${lexeme.zh}作为点缀加入造型。`,
  'N3','～ように','表示为了避免某种结果而进行调整。','ように'
 );
}

export function advancedItemExamples(item,lexeme){
 const noun=lexeme.jp,reading=lexeme.reading;
 return [
  row(
   `この${noun}は、見た目が上品なだけでなく、手持ちの服にも合わせやすいところが気に入っています。`,
   `この${reading}は、みためがじょうひんなだけでなく、てもとのふくにもあわせやすいところがきにいっています。`,
   `这件${lexeme.zh}不仅看起来很雅致，也很容易搭配已有的衣服，这一点我很喜欢。`,
   'N3','～だけでなく','“不但……而且……”，用于补充另一项特点。','だけでなく'
  ),
  row(
   `店では少し派手に見えたものの、実際にこの${noun}を合わせてみると、思ったより落ち着いた印象になりました。`,
   `みせではすこしはでにみえたものの、じっさいにこの${reading}をあわせてみると、おもったよりおちついたいんしょうになりました。`,
   `虽然在店里看起来稍显华丽，但实际搭配这件${lexeme.zh}后，却比想象中更显沉稳。`,
   'N2','～ものの','“虽说……但是……”，用于书面感较强的转折。','ものの'
  ),
  contextualExample(item,lexeme),
  row(
   `手持ちの服との組み合わせを考えると、この${noun}を選ぶ機会がいちばん多くなりそうです。`,
   `てもとのふくとのくみあわせをかんがえると、この${reading}をえらぶきかいがいちばんおおくなりそうです。`,
   `考虑到与现有衣服的搭配，看起来选择这件${lexeme.zh}的机会会最多。`,
   'N3','～そうだ','根据眼前信息表达推测：“看起来会……”。','そうです'
  )
 ];
}

export function clozeExample(example){
 return {...example,jp:example.jp.replace(example.focus,'＿＿'),reading:example.reading.replace(example.focus,'＿＿')};
}
