self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// ฟังก์ชัน fetch แบบพื้นฐาน ให้เบราว์เซอร์มองว่าเป็น PWA ที่สมบูรณ์
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => new Response('กรุณาเชื่อมต่ออินเทอร์เน็ต'))
  );
});

// จัดการเมื่อผู้ใช้กดที่การแจ้งเตือน
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // ถ้าเปิดแอปไว้อยู่แล้ว ให้เด้งแอปขึ้นมา
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // ถ้าไม่ได้เปิดแอปไว้ ให้เปิดหน้าต่างใหม่
      if (clients.openWindow) {
        return clients.openWindow('./index.html');
      }
    })
  );
});
