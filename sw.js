self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // ตอบกลับแบบพื้นฐาน เพื่อให้เบราว์เซอร์มองว่ามีระบบ Offline จัดการอยู่
  event.respondWith(
    fetch(event.request).catch(() => new Response('กรุณาเชื่อมต่ออินเทอร์เน็ต'))
  );
});

// จัดการเรื่องแจ้งเตือน
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      if (windowClients.length > 0) return windowClients[0].focus();
      return clients.openWindow('/');
    })
  );
});
