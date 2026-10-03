// Account for decoded RGBA pixels rather than compressed file size.
export function createImageCache({maxEntries = 24, maxBytes = 96 * 1024 * 1024, createImage = () => new Image()} = {}) {
  const entries = new Map();
  let bytes = 0;
  function trim() {
    for (const [src, entry] of entries) {
      if (entries.size <= maxEntries && bytes <= maxBytes) break;
      if (!entry.loaded) continue;
      entries.delete(src);
      bytes -= entry.bytes;
    }
  }
  function load(src) {
    if (entries.has(src)) {
      const entry = entries.get(src);
      entries.delete(src);
      entries.set(src, entry);
      return entry.promise;
    }
    const entry = {loaded: false, bytes: 0};
    entries.set(src, entry);
    entry.promise = new Promise((resolve, reject) => {
      const image = createImage();
      image.onload = () => {
        entry.loaded = true;
        entry.bytes = (image.naturalWidth || image.width || 0) * (image.naturalHeight || image.height || 0) * 4;
        bytes += entry.bytes;
        trim();
        resolve(image);
      };
      image.onerror = () => {
        if (entries.get(src) === entry) entries.delete(src);
        reject(new Error(`图片未能加载：${src}`));
      };
      image.src = src;
    });
    return entry.promise;
  }
  return {load, stats: () => ({entries: entries.size, bytes, maxEntries, maxBytes})};
}
