const CACHE='muskelcoach-v4-gifs';
const ASSETS=[
  './','./index.html','./styles.css?v=4','./app.js?v=4','./manifest.webmanifest?v=4',
  './muskelcoach-icon-180.png?v=4','./muskelcoach-icon-192.png','./muskelcoach-icon-512.png'
];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const isGif=event.request.url.includes('raw.githubusercontent.com/hasaneyldrm/exercises-dataset/') && event.request.url.endsWith('.gif');
  if(isGif){
    event.respondWith(caches.open(CACHE).then(async cache=>{
      const cached=await cache.match(event.request);
      if(cached) return cached;
      const fresh=await fetch(event.request);
      if(fresh.ok || fresh.type==='opaque') cache.put(event.request,fresh.clone());
      return fresh;
    }).catch(()=>caches.match(event.request)));
    return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
