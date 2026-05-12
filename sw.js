/* push-notify service worker */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', function (event) {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch (_) { data = { body: event.data.text() }; }

  const title   = data.title || '';
  // NOTE: iOS Web Push ignores `icon` (always uses manifest icon) and
  // silently drops `subtitle` (not in the W3C Notifications API spec).
  // The manifest `name` field ("Shopify") appears as the notification source.
  const options = {
    body:  data.body || '',
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
