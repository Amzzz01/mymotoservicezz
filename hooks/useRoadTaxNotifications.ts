import { useEffect, useState } from 'react';
import { Language, Translations } from '../translations';
import { RoadTaxAlert, fillTemplate, formatRoadTaxDate, toDateInputValue } from '../utils/roadTax';
import { registerPushToken } from '../utils/pushTokens';

const PROMPT_DISMISSED_KEY = 'mymotolog_roadTaxNotifyPromptDismissed';
const notifiedKey = (alert: RoadTaxAlert) =>
  `mymotolog_roadTaxNotified_${alert.vehicle.id}_${alert.vehicle.roadTaxExpiry}`;

const isSupported = () =>
  typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;

const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private mode) - worst case the user is notified again next open
  }
};

interface RoadTaxNotificationOptions {
  userId?: string;
  language: Language;
  // False while the user's settings are loading, so someone who turned these off is never shown one
  roadTaxEnabled: boolean;
}

/**
 * Two delivery paths for the same notification (same tag, so they replace each other):
 * - Push: registers this device's token; the daily Cloud Function reaches it even when the app is closed.
 * - On open: shows it locally, at most once per vehicle per day, unless today's push already went out.
 */
export const useRoadTaxNotifications = (
  alerts: RoadTaxAlert[],
  t: Translations,
  { userId, language, roadTaxEnabled }: RoadTaxNotificationOptions
) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    () => (isSupported() ? Notification.permission : 'unsupported')
  );
  const [promptDismissed, setPromptDismissed] = useState(() => readStorage(PROMPT_DISMISSED_KEY) === '1');

  useEffect(() => {
    if (permission !== 'granted' || !userId) return;
    registerPushToken(userId, language).catch(err => console.error('Failed to register for push:', err));
  }, [permission, userId, language]);

  useEffect(() => {
    if (permission !== 'granted' || alerts.length === 0 || !roadTaxEnabled) return;

    const today = toDateInputValue(new Date());
    const pending = alerts.filter(alert =>
      readStorage(notifiedKey(alert)) !== today && alert.vehicle.roadTaxPushedOn !== today
    );
    if (pending.length === 0) return;

    navigator.serviceWorker.ready
      .then(registration => {
        pending.forEach(alert => {
          const { vehicle, status } = alert;
          const values = {
            name: vehicle.name,
            vehicle: vehicle.registrationNumber || vehicle.name,
            date: formatRoadTaxDate(vehicle.roadTaxExpiry!),
          };
          const expired = status === 'expired';
          // `actions` is supported by Chromium/Android but missing from TS's NotificationOptions
          const options: NotificationOptions & { actions?: { action: string; title: string }[] } = {
            body: fillTemplate(expired ? t.roadTaxNotifyExpiredBody : t.roadTaxNotifySoonBody, values),
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-96x96.png',
            tag: `roadtax-${vehicle.id}`,
            data: { vehicleId: vehicle.id },
            actions: [
              { action: 'renew', title: t.renew },
              { action: 'later', title: t.remindTomorrow },
            ],
          };
          registration
            .showNotification(fillTemplate(expired ? t.roadTaxNotifyExpiredTitle : t.roadTaxNotifySoonTitle, values), options)
            .then(() => writeStorage(notifiedKey(alert), today))
            .catch(err => console.error('Failed to show road tax notification:', err));
        });
      })
      .catch(err => console.error('Service worker not ready for notifications:', err));
  }, [permission, alerts, t, roadTaxEnabled]);

  const dismissPrompt = () => {
    writeStorage(PROMPT_DISMISSED_KEY, '1');
    setPromptDismissed(true);
  };

  const requestPermission = async () => {
    if (!isSupported()) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== 'granted') dismissPrompt();
  };

  return {
    permission,
    showPermissionPrompt: permission === 'default' && !promptDismissed,
    requestPermission,
    dismissPrompt,
  };
};
