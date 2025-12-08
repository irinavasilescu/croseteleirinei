import { animals } from '../animals';
import { wearables } from '../wearables';
import { homeware } from '../homeware';

export function findItemById(itemId) {
  const allItems = [...animals, ...wearables, ...homeware];
  return allItems.find(item => item.id === itemId) || null;
}

export function loadNavIcons() {
  try {
    const ctx = require.context('../nav', false, /\.(png|jpe?g|webp|gif|svg)$/i);
    const map = {};
    ctx.keys().forEach((k) => {
      const key = k
        .replace(/^\.\//, '')
        .replace(/\.(png|jpe?g|webp|gif|svg)$/i, '')
        .toLowerCase();
      map[key] = ctx(k);
    });
    return map;
  } catch (e) {
    return {};
  }
}

export function findIcon(name, navIcons) {
  const key = name.toLowerCase();
  const exact = navIcons[key];
  if (exact) return exact;
  const fuzzy = Object.keys(navIcons).find((k) => k.includes(key));
  return fuzzy ? navIcons[fuzzy] : null;
}

