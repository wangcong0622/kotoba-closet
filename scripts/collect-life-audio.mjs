import fs from 'node:fs';
import {ITEMS,LEXEMES} from '../data/content.js';
import {WORN_V18} from '../data/worn-v18.js';
import {itemExampleSentences} from '../data/item-vocabulary.js';
import {ALL_LIFE_EXPRESSIONS} from '../data/life-expressions.js';
import {LIFE_DIALOGUES} from '../data/life-dialogues.js';
const requests=new Map();
const add=(text,voice='ja-JP-NanamiNeural')=>requests.set(text,{text,voice});
for(const item of ITEMS.filter(x=>WORN_V18[x.id]))for(const row of itemExampleSentences(item,LEXEMES[item.lexeme]))add(row[0]);
for(const id of ['denimshirt','v26_straw']){const lex=LEXEMES[id];if(lex){add(lex.jp);for(const row of lex.sentences)add(row[0]);}}
for(const row of ALL_LIFE_EXPRESSIONS)add(row.jp);
for(const lesson of LIFE_DIALOGUES)for(const step of lesson.steps){for(const option of step.choices.filter(x=>x.correct)){add(option.jp);for(const reply of option.followup)add(reply.jp,'ja-JP-KeitaNeural');}add(step.staff.jp,'ja-JP-KeitaNeural');}
fs.mkdirSync('outputs/life-learning',{recursive:true});fs.writeFileSync('outputs/life-learning/audio-requests.json',JSON.stringify([...requests.values()],null,2));console.log(`${requests.size} life audio requests`);
