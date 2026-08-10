// Financial Lab 4.1.0.6 DEV
// Service worker intentionally disabled while debugging payday controls.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
      .then(()=>self.registration.unregister())
  );
});
