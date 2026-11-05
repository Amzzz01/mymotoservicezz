import { Translations } from '../translations';

// The user just closed or re-opened the Google window: not worth an error message
const IGNORED_CODES = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
]);

export const getAuthErrorMessage = (code: string, t: Translations): string | null => {
  if (IGNORED_CODES.has(code)) return null;
  switch (code) {
    case 'auth/account-exists-with-different-credential':
      return t.googleAccountExists;
    case 'auth/credential-already-in-use':
    case 'auth/email-already-in-use':
      return t.googleAlreadyLinked;
    case 'auth/invalid-email':
      return t.invalidEmail;
    case 'auth/too-many-requests':
      return t.tooManyAttempts;
    case 'auth/network-request-failed':
      return t.authNetworkError;
    default:
      return t.googleSignInFailed;
  }
};
