export function applyEquip(look, target, getItem) {
  const next = { ...(look || {}) };
  const removed = [];
  if (!target?.id || !target.slot) return { look: next, removed, changed: false, unequipped: false };
  if (next[target.slot] === target.id) {
    delete next[target.slot];
    return { look: next, removed, changed: true, unequipped: true };
  }
  if (target.slot === 'dress') {
    for (const slot of ['top', 'bottom']) {
      if (next[slot]) {
        const removedItem = getItem(next[slot]);
        if (removedItem) removed.push(removedItem);
        delete next[slot];
      }
    }
  }
  if ((target.slot === 'top' || target.slot === 'bottom') && next.dress) {
    const removedItem = getItem(next.dress);
    if (removedItem) removed.push(removedItem);
    delete next.dress;
  }
  next[target.slot] = target.id;
  return { look: next, removed, changed: true, unequipped: false };
}
