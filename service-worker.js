// Financial Lab 4.1.2.3 DEV
// Service worker intentionally disabled during active DEV testing.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
      .then(()=>self.registration.unregister())
  );
});
