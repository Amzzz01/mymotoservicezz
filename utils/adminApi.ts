import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, auth } from '../firebase';
import { Language, Translations } from '../translations';
import { fillTemplate } from './roadTax';
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

export type AdminLogAction =
  | 'role_added'
  | 'role_removed'
  | 'user_disabled'
  | 'user_enabled'
  | 'notification_sent'
  | 'limit_changed';

export type NotificationAudience =
  | { kind: 'everyone' | 'roadTaxExpired' | 'roadTaxSoon' | 'newUsers' | 'inactive' | 'noVehicle' }
  | { kind: 'users'; emails: string[] }
  | { kind: 'vehicleType'; text: string }
  | { kind: 'language'; language: Language };

export interface AdminLogEntry {
  id: string;
  action: AdminLogAction;
  category: 'roles' | 'users' | 'sends';
  actorEmail: string;
  targetEmail: string;
  reason: string;
  details: { title?: string; audience?: NotificationAudience; devices?: number; from?: number; to?: number } | null;
  createdAt: string | null;
}

export type NotificationType = 'tip' | 'update';
export type NotificationTab = 'overview' | 'analytics' | 'mileage' | 'reminders';

export interface NotificationContent {
  titleEn: string;
  bodyEn: string;
  titleMs: string;
  bodyMs: string;
}

export interface NotificationDraft {
  sendId: string;
  type: NotificationType;
  content: NotificationContent;
  audience: NotificationAudience;
  openTab: NotificationTab;
  confirm: string;
}

export interface NotificationPreview {
  people: number;
  devices: number;
  languages: { en: number; ms: number };
  unknownEmails: string[];
  isBulk: boolean;
  dailyLimit: number;
  usedToday: number;
}

export interface NotificationSendRecord {
  id: string;
  title: string;
  status: 'sending' | 'sent' | 'failed';
  audience: NotificationAudience;
  actorEmail: string;
  attempted: number;
  delivered: number;
  tapped: number;
  createdAt: string | null;
}

const functions = getFunctions(app, 'asia-southeast1');
const SEND_TIMEOUT_MS = 300 * 1000; // Matches the sendNotification function's own limit

const call = async <Result>(name: string, data?: unknown, timeout?: number): Promise<Result> => {
  try {
    const result = await httpsCallable<unknown, Result>(functions, name, { timeout })(data);
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

export const getAudienceCounts = async () =>
  (await call<{ counts: Record<string, number> }>('getAudienceCounts')).counts;

export const previewNotification = (audience: NotificationAudience) =>
  call<NotificationPreview>('previewNotification', { audience });

export const sendTestNotification = (content: NotificationContent, openTab: NotificationTab) =>
  call<{ devices: number; delivered: number }>('sendTestNotification', { content, openTab });

export const sendNotification = (draft: NotificationDraft) =>
  call<{ people: number; attempted: number; delivered: number }>('sendNotification', draft, SEND_TIMEOUT_MS);

export const getSendHistory = () =>
  call<{ sends: NotificationSendRecord[]; dailyLimit: number; usedToday: number }>('getSendHistory');

export const setDailySendLimit = (limit: number) =>
  call<{ dailyLimit: number }>('setDailySendLimit', { limit });

export const describeAudience = (audience: NotificationAudience, t: Translations): string => {
  switch (audience.kind) {
    case 'everyone': return t.audEveryone;
    case 'users': return fillTemplate(t.audPeopleCount, { count: String(audience.emails.length) });
    case 'roadTaxExpired': return t.audRoadTaxExpired;
    case 'roadTaxSoon': return t.audRoadTaxSoon;
    case 'newUsers': return t.audNew;
    case 'inactive': return t.audInactive;
    case 'noVehicle': return t.audNoVehicle;
    case 'vehicleType': return fillTemplate(t.audVehicleValue, { text: audience.text });
    case 'language': return fillTemplate(t.audLanguageValue, { language: audience.language === 'ms' ? 'BM' : 'EN' });
  }
};

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
    'invalid-audience': t.adminErrInvalidAudience,
    'invalid-content': t.adminErrInvalidContent,
    'invalid-limit': t.adminErrInvalidLimit,
    'no-recipients': t.adminErrNoRecipients,
    'no-devices': t.adminErrNoDevices,
    'already-sent': t.adminErrAlreadySent,
    'daily-limit-reached': t.adminErrLimitReached,
    'confirm-required': t.confTypeSend,
    'send-failed': t.adminErrSendFailed,
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
