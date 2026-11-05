// Pure rules for the admin panel (kept free of Firebase imports so they can be unit tested).
// Each check returns an error code the app translates, or null when the action is allowed.

export const MIN_QUERY_LENGTH = 3;
export const MAX_REASON_LENGTH = 200;

const roleOf = (record) => record.customClaims?.role;
const isStaff = (record) => roleOf(record) === 'admin' || roleOf(record) === 'superadmin';

// Judged on the live account, not the sign-in token, so a removal or disable applies at once
export const hasAccess = (record, allowedRoles) =>
  !record.disabled && record.emailVerified && allowedRoles.includes(roleOf(record));

export const checkRoleChange = (actorUid, target, makeAdmin) => {
  if (target.uid === actorUid) return 'cannot-change-self';
  if (roleOf(target) === 'superadmin') return 'cannot-change-superadmin';
  if (!makeAdmin) return roleOf(target) === 'admin' ? null : 'not-admin';
  if (roleOf(target) === 'admin') return 'already-admin';
  if (target.disabled) return 'user-disabled';
  return target.emailVerified ? null : 'email-not-verified';
};

// setCustomUserClaims replaces every claim, so anything unrelated has to be carried over
export const claimsAfterRoleChange = (claims, makeAdmin, today) => {
  const { role, roleAddedAt, ...others } = claims ?? {};
  return makeAdmin ? { ...others, role: 'admin', roleAddedAt: today } : others;
};

export const cleanReason = (reason) =>
  typeof reason === 'string' ? reason.trim().slice(0, MAX_REASON_LENGTH) : '';

export const checkDisableChange = (actorUid, target, disable, reason) => {
  if (target.uid === actorUid) return 'cannot-change-self';
  if (isStaff(target)) return 'remove-role-first';
  if (!disable) return target.disabled ? null : 'not-disabled';
  if (target.disabled) return 'already-disabled';
  return reason ? null : 'reason-required';
};

export const cleanQuery = (query) => (typeof query === 'string' ? query.trim().toLowerCase() : '');

export const matchesQuery = (record, query) => Boolean(record.email?.toLowerCase().includes(query));

const toIso = (dateText) => {
  const date = new Date(dateText);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

// Account facts only: vehicle details and service records never leave the server
export const summarizeUser = (record) => ({
  uid: record.uid,
  email: record.email ?? '',
  joinedAt: toIso(record.metadata?.creationTime),
  lastSignInAt: toIso(record.metadata?.lastSignInTime),
  providers: (record.providerData ?? []).map(provider => provider.providerId),
  emailVerified: Boolean(record.emailVerified),
  disabled: Boolean(record.disabled),
  role: isStaff(record) ? roleOf(record) : 'user',
  roleAddedAt: record.customClaims?.roleAddedAt ?? null,
});

export const logCategory = (action) => (action.startsWith('role_') ? 'roles' : 'users');
