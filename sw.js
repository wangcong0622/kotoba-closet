const CACHE='kotoba-closet-v8';
const CORE=[
 './manifest.webmanifest',
 './apple-touch-icon.png',
 './assets/icons/app-icon-192.png',
 './assets/icons/app-icon-512.png',
 './',
 './index.html',
 './styles/main.css',
 './styles/overrides.css',
 './styles/takeover.css',
 './styles/room.css',
 './styles/mobile.css',
 './data/worn-v18.js',
 './data/scene-learning.js',
 './data/content.js',
 './data/scenes.js',
 './data/advanced-japanese.js',
 './src/game.js',
 './src/mobile.js'
];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==location.origin||request.headers.has('range'))return;
 if(request.mode==='navigate'){
  event.respondWith(fetch(request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));return response;}).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}
  return response;
 })));
});
