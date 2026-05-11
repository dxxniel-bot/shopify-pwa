/* push-notify service worker */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', function (event) {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch (_) { data = { body: event.data.text() }; }

  const title   = data.title || 'Shopify';
  const options = {
    body:  data.body  || '',
    icon:  'https://files.catbox.moe/ckc4at.png',
    badge: 'https://files.catbox.moe/ckc4at.png',
    data:  { url: data.url || null },
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
