// Service Worker แบบ Minimal เพื่อให้ผ่านเกณฑ์ PWA
self.addEventListener('install', (event) => {
  console.log('Service Worker: กำลังติดตั้ง...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: พร้อมใช้งานแล้ว!');
  self.clients.claim();
});

// ต้องมีคำสั่ง fetch เพื่อให้เบราว์เซอร์มองว่าเป็น PWA ที่สมบูรณ์
self.addEventListener('fetch', (event) => {
  // ปล่อยผ่านทุกการเชื่อมต่อ ไม่ต้องแคชไฟล์ (ป้องกันปัญหาพาธผิด)
  return; 
});

// จัดการเรื่องแจ้งเตือน (Push Notification)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
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
