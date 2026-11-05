export type UserRole = 'user' | 'admin' | 'superadmin';

// The role lives in a Firebase custom claim, which only the server can set. Anything missing or
// unexpected counts as a normal user. This only decides what the app shows: real protection has
// to come from Firestore rules and Cloud Functions, because app code can be tampered with.
export const parseRole = (claim: unknown): UserRole =>
  claim === 'admin' || claim === 'superadmin' ? claim : 'user';

export const isAdminRole = (role: UserRole): boolean => role === 'admin' || role === 'superadmin';
