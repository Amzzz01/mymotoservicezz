import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export type NotificationPrefKey = 'roadTax' | 'tip' | 'update' | 'promotion';
export type NotificationPrefs = Record<NotificationPrefKey, boolean>;

// Must match wantsNotification in functions/notificationLogic.js
const DEFAULT_PREFS: NotificationPrefs = { roadTax: true, tip: true, update: true, promotion: false };

export const useNotificationPrefs = (userId?: string) => {
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setPrefs(DEFAULT_PREFS);
    if (!userId) return;

    return onSnapshot(
      doc(db, 'users', userId),
      (snapshot) => {
        setPrefs({ ...DEFAULT_PREFS, ...snapshot.data()?.notificationPrefs });
        setLoaded(true);
      },
      (error) => console.error('Failed to load notification settings:', error)
    );
  }, [userId]);

  const setPref = async (key: NotificationPrefKey, value: boolean) => {
    if (!userId) return;
    await setDoc(doc(db, 'users', userId), { notificationPrefs: { [key]: value } }, { merge: true });
  };

  return { prefs, loaded, setPref };
};
