import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, auth } from '../firebase';
import { Language, Translations } from '../translations';
import { UserRole } from './roles';

export interface AdminStats {
  users: number;
  vehicles: number;
  devices: number;
  roadTaxExpired: number;
  admins: number | null; // Superadmin only
}

export interface AdminUserSummary {
  uid: string;
  email: string;
  joinedAt: string | null;
  lastSignInAt: string | null;
  providers: string[];
  emailVerified: boolean;
  disabled: boolean;
  role: UserRole;
  roleAddedAt: string | null;
}

export interface AdminUserDetails extends AdminUserSummary {
  vehicles: number;
  devices: number;
}

export type AdminLogAction = 'role_added' | 'role_removed' | 'user_disabled' | 'user_enabled';

export interface AdminLogEntry {
  id: string;
  action: AdminLogAction;
  category: 'roles' | 'users';
  actorEmail: string;
  targetEmail: string;
  reason: string;
  createdAt: string | null;
}

const functions = getFunctions(app, 'asia-southeast1');

const call = async <Result>(name: string, data?: unknown): Promise<Result> => {
  try {
    const result = await httpsCallable<unknown, Result>(functions, name)(data);
    return result.data;
  } catch (error: any) {
    // Refused by the server: this device's role is out of date, so pick up the current one
    if (error?.code === 'functions/permission-denied') {
      auth.currentUser?.getIdToken(true).catch(() => undefined);
    }
    throw error;
  }
};

export const getAdminStats = () => call<AdminStats>('getAdminStats');

export const listAdmins = async () => (await call<{ team: AdminUserSummary[] }>('listAdmins')).team;

export const searchUsers = (query: string) =>
  call<{ users: AdminUserDetails[]; total: number }>('searchUsers', { query });

export const setAdminRole = (uid: string, makeAdmin: boolean) =>
  call<{ ok: boolean }>('setAdminRole', { uid, makeAdmin });

export const setUserDisabled = (uid: string, disabled: boolean, reason = '') =>
  call<{ ok: boolean }>('setUserDisabled', { uid, disabled, reason });

export const getActivityLog = async () =>
  (await call<{ entries: AdminLogEntry[] }>('getActivityLog')).entries;

// The server sends its reason as the error message; anything else is a connection-type failure
export const getAdminErrorMessage = (error: any, t: Translations): string => {
  const messages: Record<string, string> = {
    'no-access': t.adminErrNoAccess,
    'user-not-found': t.adminErrUserNotFound,
    'query-too-short': t.adminErrQueryTooShort,
    'cannot-change-self': t.adminErrSelf,
    'cannot-change-superadmin': t.adminErrSuperadmin,
    'already-admin': t.adminErrAlreadyAdmin,
    'not-admin': t.adminErrNotAdmin,
    'email-not-verified': t.adminErrNotVerified,
    'user-disabled': t.adminErrUserDisabled,
    'remove-role-first': t.adminErrRemoveRoleFirst,
    'already-disabled': t.adminErrAlreadyDisabled,
    'not-disabled': t.adminErrNotDisabled,
    'reason-required': t.adminReasonRequired,
  };
  return messages[error?.message] ?? t.adminErrGeneric;
};

const locale = (language: Language) => (language === 'ms' ? 'ms-MY' : 'en-MY');

export const formatAdminDate = (iso: string | null, language: Language): string =>
  iso
    ? new Date(iso).toLocaleDateString(locale(language), { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

export const formatAdminDateTime = (iso: string | null, language: Language): string =>
  iso
    ? new Date(iso).toLocaleString(locale(language), {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '-';

export const formatProviders = (providers: string[], t: Translations): string =>
  providers
    .map(provider => {
      if (provider === 'google.com') return 'Google';
      return provider === 'password' ? t.adminProviderPassword : provider;
    })
    .join(', ') || '-';
