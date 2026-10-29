// Imported into the generated Workbox service worker (see vite.config.ts → workbox.importScripts).
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
