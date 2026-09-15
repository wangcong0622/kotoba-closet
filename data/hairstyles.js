export const HAIRSTYLES=[
 {id:'hair_bob_v5',slot:'hair',zh:'空气刘海波波头',jp:'ボブヘア',reading:'ボブヘア',verb:'する',style:'sweet',color:'brown',lexeme:'hair_bob',tags:[]},
 {id:'hair_wave_v5',slot:'hair',zh:'中分长卷发',jp:'ウェーブヘア',reading:'ウェーブヘア',verb:'する',style:'classic',color:'brown',lexeme:'hair_wave',tags:[]},
 {id:'hair_pony_v5',slot:'hair',zh:'轻盈高马尾',jp:'ポニーテール',reading:'ポニーテール',verb:'する',style:'casual',color:'black',lexeme:'hair_pony',tags:[]}
];
export const HAIR_WORDS={
 hair_bob:{jp:'ボブヘア',reading:'ボブヘア',zh:'波波头',verb:'する',sentences:[['あごの長さのボブにしてください。','あごのながさのボブにしてください。','请剪成下巴长度的波波头。'],['前髪は少し短くしてください。','まえがみはすこしみじかくしてください。','请把刘海剪短一点。']]},
 hair_wave:{jp:'ウェーブヘア',reading:'ウェーブヘア',zh:'卷发造型',verb:'する',sentences:[['今日は髪を巻いて出かけます。','きょうはかみをまいてでかけます。','今天把头发卷好再出门。'],['毛先だけ巻いてください。','けさきだけまいてください。','请只卷发梢。']]},
 hair_pony:{jp:'ポニーテール',reading:'ポニーテール',zh:'马尾辫',verb:'する',sentences:[['暑いので、髪を結びます。','あついので、かみをむすびます。','天气很热，所以把头发扎起来。'],['ヘアゴムを貸してもらえますか。','ヘアゴムをかしてもらえますか。','可以借我一根发圈吗？']]}
};

HAIRSTYLES.push(
 {id:'hair_pixie_v6',slot:'hair',zh:'轻盈短精灵头',jp:'ショートヘア',reading:'ショートヘア',verb:'する',style:'casual',color:'brown',lexeme:'hair_short',tags:[]},
 {id:'hair_bun_v6',slot:'hair',zh:'温柔低盘发',jp:'お団子ヘア',reading:'おだんごヘア',verb:'する',style:'classic',color:'brown',lexeme:'hair_bun',tags:[]},
 {id:'hair_braids_v6',slot:'hair',zh:'空气刘海双麻花辫',jp:'三つ編み',reading:'みつあみ',verb:'する',style:'sweet',color:'brown',lexeme:'hair_braids',tags:[]}
);
Object.assign(HAIR_WORDS,{
 hair_short:{jp:'ショートヘア',reading:'ショートヘア',zh:'短发',verb:'する',sentences:[['髪を短くしたいです。','かみをみじかくしたいです。','我想把头发剪短。'],['耳が少し見える長さにしてください。','みみがすこしみえるながさにしてください。','请剪成稍微露出耳朵的长度。']]},
 hair_bun:{jp:'お団子ヘア',reading:'おだんごヘア',zh:'丸子盘发',verb:'する',sentences:[['今日は髪をまとめます。','きょうはかみをまとめます。','今天把头发盘起来。'],['低い位置で結んでください。','ひくいいちでむすんでください。','请在低一点的位置扎起来。']]},
 hair_braids:{jp:'三つ編み',reading:'みつあみ',zh:'麻花辫',verb:'する',sentences:[['髪を三つ編みにします。','かみをみつあみにします。','我把头发编成麻花辫。'],['きつく結ばないでください。','きつくむすばないでください。','请不要扎得太紧。']]}
});
HAIRSTYLES.splice(HAIRSTYLES.findIndex(x=>x.id==='hair_bob_v5'),1);
HAIRSTYLES.push({id:'hair_straight_v23',slot:'hair',zh:'中分柔顺长直发',jp:'ストレートヘア',reading:'ストレートヘア',verb:'する',style:'classic',color:'brown',lexeme:'hair_straight',tags:[]},{id:'hair_halfup_v23',slot:'hair',zh:'半扎微卷长发',jp:'ハーフアップ',reading:'ハーフアップ',verb:'する',style:'sweet',color:'brown',lexeme:'hair_halfup',tags:[]});
Object.assign(HAIR_WORDS,{hair_straight:{jp:'ストレートヘア',reading:'ストレートヘア',zh:'直发',verb:'する',sentences:[['髪をまっすぐにしてください。','かみをまっすぐにしてください。','请把头发弄直。']]},hair_halfup:{jp:'ハーフアップ',reading:'ハーフアップ',zh:'半扎发',verb:'する',sentences:[['今日はハーフアップにします。','きょうはハーフアップにします。','今天把头发半扎起来。']]}});
