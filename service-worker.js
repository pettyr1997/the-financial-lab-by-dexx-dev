// Financial Lab 4.1.0.7 DEV
// Service worker remains intentionally disabled during debugging.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.map(k=>caches.delete(k))))
      .then(()=>self.registration.unregister())
  );
});
