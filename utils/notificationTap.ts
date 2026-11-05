import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase';

// Loaded only after someone taps an admin notification. A lost count isn't worth bothering the user.
export const recordNotificationTap = (sendId: string): Promise<void> =>
  httpsCallable(getFunctions(app, 'asia-southeast1'), 'recordNotificationTap')({ sendId })
    .then(() => undefined)
    .catch(error => console.warn('Could not record notification tap:', error));
