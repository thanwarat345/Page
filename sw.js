const CACHE_NAME = 'geely-pwa-cache-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// ติดตั้ง Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// เปิดใช้งาน Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// จัดการการดึงข้อมูล (Fetch) ให้รองรับ Offline แบบพื้นฐาน
self.addEventListener('fetch', event => {
  // ยกเว้น request ที่ไป GAS หรือ Firebase เพื่อให้ข้อมูลเรียลไทม์เสมอ
  if (event.request.url.includes('script.google.com') || event.request.url.includes('firebasedatabase.app')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// เมื่อผู้ใช้กดที่กล่องการแจ้งเตือน (Notification Click)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  // เปิดแอปขึ้นมาเมื่อกดแจ้งเตือน
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then( windowClients => {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
