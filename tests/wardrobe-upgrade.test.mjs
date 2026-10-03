import assert from 'node:assert/strict';
import {ITEMS,LEXEMES} from '../data/content.js';
import {WORN_V18} from '../data/worn-v18.js';
import {ITEM_DESCRIPTIONS} from '../data/item-descriptions.js';
import {itemVocabulary,itemExampleSentences,COLOR_LABELS} from '../data/item-vocabulary.js';
import {randomLook,equipBlock,filterWardrobe,normalizeWardrobe,reconcileLocks} from '../src/wardrobe-state.js';
import {normalizeSave,INITIAL_LOOK} from '../src/storage.js';
const inventory=ITEMS.filter(x=>WORN_V18[x.id]),getItem=id=>inventory.find(x=>x.id===id);
assert.equal(inventory.length,115);assert.equal(Object.keys(ITEM_DESCRIPTIONS).length,inventory.length);
for(const item of inventory){
 assert(ITEM_DESCRIPTIONS[item.id]);assert(COLOR_LABELS[item.color]);
 const vocab=itemVocabulary(item,LEXEMES[item.lexeme]);assert(vocab.every(x=>x.word.jp&&x.word.reading&&x.word.zh));
 assert(itemExampleSentences(item,LEXEMES[item.lexeme]).every(x=>x.length===3&&x.every(s=>!s.includes('undefined'))));
}
const vocab=id=>itemVocabulary(getItem(id),LEXEMES[getItem(id).lexeme]);
assert.equal(vocab('brand_martens').find(x=>x.label==='颜色').word.jp,'黒');
assert.equal(vocab('brand_onitsuka_mexico66').find(x=>x.label==='颜色').word.jp,'黄色');
assert.equal(vocab('bracelet_gold_v15').find(x=>x.label==='颜色').word.jp,'金色');
assert.equal(vocab('dress_lacoste_v27').find(x=>x.label==='颜色').word.jp,'セージグリーン');
for(const id of ['brand_chanel_v7','brand_celine_triomph','brand_martens','top_hoodie','hair_straight_v23'])assert(!vocab(id).some(x=>x.label==='面料'),id);
assert.equal(getItem('top_denim').lexeme,'denimshirt');assert.equal(LEXEMES[getItem('hair_straw_pearl_v26').lexeme].verb,'かぶる');
const lock={top:INITIAL_LOOK.top};
for(let i=0;i<100;i++){
 const next=randomLook(INITIAL_LOOK,inventory,lock);assert.equal(next.top,INITIAL_LOOK.top);assert(!next.dress);
 const dress={dress:'dress_floral',hair:'hair_straight_v23',outer:'outer_cardigan'};
 const out=randomLook(dress,inventory,{dress:dress.dress,outer:dress.outer});assert.equal(out.dress,dress.dress);assert.equal(out.outer,dress.outer);assert(!out.top&&!out.bottom);
 const shoes=randomLook(INITIAL_LOOK,inventory,lock,'shoes');assert.notEqual(shoes.shoes,INITIAL_LOOK.shoes);assert.equal(shoes.top,INITIAL_LOOK.top);assert.equal(shoes.bottom,INITIAL_LOOK.bottom);assert.equal(shoes.hair,INITIAL_LOOK.hair);
}
assert(equipBlock(INITIAL_LOOK,getItem('dress_floral'),lock));assert(equipBlock({dress:'dress_floral'},getItem('top_blouse'),{dress:'dress_floral'}));
assert.deepEqual(randomLook(INITIAL_LOOK,inventory,lock,'top'),INITIAL_LOOK);
assert.deepEqual(reconcileLocks({top:'top_denim',shoes:INITIAL_LOOK.shoes},INITIAL_LOOK),{shoes:INITIAL_LOOK.shoes});
const old=normalizeSave({schemaVersion:1,look:INITIAL_LOOK,favorites:[]});assert.deepEqual(old.wardrobe,normalizeWardrobe());
const saved=normalizeSave({...old,wardrobe:{locks:lock,recent:['top_denim','missing','top_denim'],view:'recent',category:'top',positions:{all:400,bad:-2},query:'牛仔'}});
assert.deepEqual(saved.wardrobe.locks,lock);assert.deepEqual(saved.wardrobe.recent,['top_denim']);assert.deepEqual(saved.wardrobe.positions,{all:400});
const filters={...normalizeWardrobe(),recent:['brand_martens','top_denim']};
assert.deepEqual(filterWardrobe(inventory,{...filters,view:'recent'},INITIAL_LOOK,[]).map(x=>x.id),filters.recent);
assert.equal(filterWardrobe(inventory,{...filters,view:'worn'},INITIAL_LOOK,[]).length,4);
assert.deepEqual(filterWardrobe(inventory,{...filters,view:'recent',favoritesOnly:true},INITIAL_LOOK,['top_denim']).map(x=>x.id),['top_denim']);
assert.deepEqual(filterWardrobe(inventory,{...filters,query:'デニムシャツ'},INITIAL_LOOK,[]).map(x=>x.id).sort(),['brand_levis_shirt_v10','top_denim']);
console.log('115-item vocabulary audit, lock conflicts, partial random, filters and old-save compatibility PASS');
