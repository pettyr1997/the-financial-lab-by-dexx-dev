const CACHE='financial-lab-v4.1.0.4-payday-build-recovery';
const ASSETS=['./','./index.html','./styles.css?v=4.1.0.4','./app.js?v=4.1.0.4','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./financial-lab-logo.jpg','./dexx-character-clean.jpg'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

async function networkFirst(request,fallback){
  try{
    const response=await fetch(request,{cache:'no-store'});
    const cache=await caches.open(CACHE);
    cache.put(request,response.clone());
    return response;
  }catch{
    return (await caches.match(request)) || (fallback ? await caches.match(fallback) : Response.error());
  }
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);

  if(event.request.mode==='navigate'){
    event.respondWith(networkFirst(event.request,'./index.html'));
    return;
  }

  if(url.pathname.endsWith('/app.js') || url.pathname.endsWith('/styles.css')){
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>cached || networkFirst(event.request))
  );
});
