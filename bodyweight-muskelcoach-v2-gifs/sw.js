const CACHE='muskelcoach-v2-gifs';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const isGif=e.request.url.includes('raw.githubusercontent.com/hasaneyldrm/exercises-dataset/') && e.request.url.endsWith('.gif');
  if(isGif){
    e.respondWith(caches.open(CACHE).then(async c=>{
      const cached=await c.match(e.request);
      if(cached) return cached;
      const fresh=await fetch(e.request);
      if(fresh.ok || fresh.type==='opaque') c.put(e.request,fresh.clone());
      return fresh;
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
