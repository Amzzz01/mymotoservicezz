// Imported into the generated Workbox service worker (see vite.config.ts → workbox.importScripts).
// Shows pushes sent by Cloud Functions, even when the app is closed: the daily road tax alert
// and notifications written by admins.
self.addEventListener('push', (event) => {
  let data;
  try {
    data = event.data.json().data;
  } catch {
    return;
  }
  if (!data) return;

  if (data.type === 'custom') {
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        tag: 'custom-' + (data.sendId || 'test'),
        data: { sendId: data.sendId, openTab: data.openTab },
      })
    );
    return;
  }

  if (data.type !== 'roadTax') return;

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

// Handles taps on admin notifications: opens the chosen tab, and the app counts the tap.
self.addEventListener('notificationclick', (event) => {
  const tag = event.notification.tag || '';
  if (!tag.startsWith('custom-')) return;

  event.notification.close();
  const { sendId = '', openTab = '' } = event.notification.data || {};
  const url = '/?notificationTab=' + encodeURIComponent(openTab) + '&notificationSend=' + encodeURIComponent(sendId);

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ('focus' in client) {
          client.postMessage({ type: 'customNotification', sendId, openTab });
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
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
