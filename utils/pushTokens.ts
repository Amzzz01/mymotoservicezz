import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { deleteToken, getMessaging, getToken, isSupported } from 'firebase/messaging';
import { app, db } from '../firebase';
import { Language } from '../translations';

// Remembers which account/language this browser's token is saved under, to avoid a write on every open.
const REGISTERED_KEY = 'mymotolog_pushTokenRegistered';

const tokenRef = (userId: string, token: string) => doc(db, 'users', userId, 'pushTokens', token);

const readRegistered = (): string | null => {
  try {
    return localStorage.getItem(REGISTERED_KEY);
  } catch {
    return null;
  }
};

const writeRegistered = (value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(REGISTERED_KEY);
    else localStorage.setItem(REGISTERED_KEY, value);
  } catch {
    // Storage blocked - the token just gets re-saved on the next open
  }
};

const getDeviceToken = async (): Promise<string | null> => {
  if (!(await isSupported())) return null;
  const serviceWorkerRegistration = await navigator.serviceWorker.ready;
  return getToken(getMessaging(app), {
    serviceWorkerRegistration,
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined,
  });
};

/** Saves this device's push token for the user. Needs notification permission to be granted already. */
export const registerPushToken = async (userId: string, language: Language): Promise<void> => {
  const token = await getDeviceToken();
  if (!token) return;

  const signature = `${userId}|${language}|${token}`;
  if (readRegistered() === signature) return;

  await setDoc(tokenRef(userId, token), { token, language, updatedAt: new Date().toISOString() });
  writeRegistered(signature);
};

/** Stops pushes to this device for the user. Must run before sign-out, while Firestore still allows the delete. */
export const unregisterPushToken = async (userId: string): Promise<void> => {
  const registered = readRegistered();
  if (!registered?.startsWith(`${userId}|`)) return;

  const token = registered.split('|')[2];
  writeRegistered(null);
  await deleteDoc(tokenRef(userId, token));
  if (await isSupported()) await deleteToken(getMessaging(app));
};
