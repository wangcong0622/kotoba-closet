import {normalizeDialogue} from './dialogue-state.js';
const choices = (value, allowed, fallback) => allowed.includes(value) ? value : fallback;
const positions = value => Object.fromEntries(Object.entries(value && typeof value === 'object' && !Array.isArray(value) ? value : {})
  .filter(([key, index]) => key.length <= 200 && Number.isInteger(index) && index >= 0 && index <= 1000).slice(-256));

export function normalizeStudy(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) value = {};
  const sentences = value.sentences && typeof value.sentences === 'object' && !Array.isArray(value.sentences) ? value.sentences : {};
  return {
    level: choices(value.level, ['basic', 'advanced'], 'basic'),
    tab: choices(value.tab, ['word', 'scene', 'dialogue', 'practice'], 'word'),
    practiceMode: choices(value.practiceMode, ['word', 'scene', 'listening'], 'word'),
    mobileView: choices(value.mobileView, ['wardrobe', 'study'], 'wardrobe'),
    wordPositions: positions(value.wordPositions),
    scenePositions: positions(value.scenePositions),
    dialogue:normalizeDialogue(value.dialogue),
    sentences: Object.fromEntries(Object.entries(sentences).filter(([key, record]) => key.length <= 220 && record && typeof record === 'object' && !Array.isArray(record)).slice(-256)
      .map(([key, record]) => [key, {blanked: record.blanked === true, translationHidden: record.translationHidden === true}]))
  };
}
