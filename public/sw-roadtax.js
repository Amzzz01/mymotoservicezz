// Imported into the generated Workbox service worker (see vite.config.ts → workbox.importScripts).
// Shows the daily road tax push (sent by functions/index.js, even when the app is closed).
self.addEventListener('push', (event) => {
  let data;
  try {
    data = event.data.json().data;
  } catch {
    return;
  }
  if (!data || data.type !== 'roadTax') return;

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'roadtax-' + data.vehicleId,
      data: { vehicleId: data.vehicleId },
      actions: [
        { action: 'renew', title: data.renewLabel },
        { action: 'later', title: data.laterLabel },
      ],
    })
  );
});

// Handles taps on road tax notifications: "Renew" / body tap opens the renew form, "Remind me tomorrow" just closes.
self.addEventListener('notificationclick', (event) => {
  const tag = event.notification.tag || '';
  if (!tag.startsWith('roadtax-')) return;

  event.notification.close();
  if (event.action === 'later') return;

  const vehicleId = (event.notification.data && event.notification.data.vehicleId) || '';
  const url = '/?renewRoadTax=' + encodeURIComponent(vehicleId);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ('focus' in client) {
          client.postMessage({ type: 'renewRoadTax', vehicleId });
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
