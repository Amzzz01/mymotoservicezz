import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import {
  MIN_QUERY_LENGTH,
  checkDisableChange,
  checkRoleChange,
  claimsAfterRoleChange,
  cleanQuery,
  cleanReason,
  hasAccess,
  logCategory,
  matchesQuery,
  summarizeUser,
} from './adminLogic.js';
import { todayInMalaysia } from './roadTax.js';

export const CALLABLE_OPTIONS = { region: 'asia-southeast1', maxInstances: 5 };
export const STAFF = ['admin', 'superadmin'];
export const SUPERADMIN = ['superadmin'];
const MAX_SEARCH_RESULTS = 10;
const LOG_PAGE_SIZE = 100;
const EARLIEST_EXPIRY = '2000-01-01'; // Keeps blank road tax dates out of the expired count

// Runs on every call, so nothing here relies on what the sign-in token claims
export const requireRole = async (request, allowedRoles) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'no-access');
  const actor = await getAuth().getUser(request.auth.uid);
  if (!hasAccess(actor, allowedRoles)) throw new HttpsError('permission-denied', 'no-access');
  return actor;
};

const getTarget = async (uid) => {
  if (typeof uid !== 'string' || !uid) throw new HttpsError('invalid-argument', 'user-not-found');
  try {
    return await getAuth().getUser(uid);
  } catch (error) {
    if (error.code === 'auth/user-not-found') throw new HttpsError('not-found', 'user-not-found');
    throw error;
  }
};

export const rejectIf = (code) => {
  if (code) throw new HttpsError('failed-precondition', code);
};

// The action already happened by now, so a logging failure is reported rather than undoing it
export const writeLog = async (actor, target, action, reason = '', details = null) => {
  try {
    await getFirestore().collection('adminLogs').add({
      action,
      category: logCategory(action),
      actorUid: actor.uid,
      actorEmail: actor.email ?? '',
      targetUid: target.uid,
      targetEmail: target.email ?? '',
      reason,
      details,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    logger.error('Failed to write admin log', { action, targetUid: target.uid, error: error.message });
  }
};

export const forEachUser = async (visit) => {
  let pageToken;
  do {
    const page = await getAuth().listUsers(1000, pageToken);
    page.users.forEach(visit);
    pageToken = page.pageToken;
  } while (pageToken);
};

const countOf = async (query) => (await query.count().get()).data().count;

export const getAdminStats = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, STAFF);
  const db = getFirestore();

  let users = 0;
  let admins = 0;
  await forEachUser(record => {
    users += 1;
    if (record.customClaims?.role === 'admin') admins += 1;
  });

  const [vehicles, devices, roadTaxExpired] = await Promise.all([
    countOf(db.collection('vehicles')),
    countOf(db.collectionGroup('pushTokens')),
    countOf(db.collection('vehicles')
      .where('roadTaxExpiry', '>=', EARLIEST_EXPIRY)
      .where('roadTaxExpiry', '<', todayInMalaysia())),
  ]);

  const isSuperadmin = hasAccess(actor, SUPERADMIN);
  return { users, vehicles, devices, roadTaxExpired, admins: isSuperadmin ? admins : null };
});

export const listAdmins = onCall(CALLABLE_OPTIONS, async (request) => {
  await requireRole(request, SUPERADMIN);
  const team = [];
  await forEachUser(record => {
    if (STAFF.includes(record.customClaims?.role)) team.push(summarizeUser(record));
  });
  return { team };
});

export const searchUsers = onCall(CALLABLE_OPTIONS, async (request) => {
  await requireRole(request, SUPERADMIN);
  const query = cleanQuery(request.data?.query);
  if (query.length < MIN_QUERY_LENGTH) throw new HttpsError('invalid-argument', 'query-too-short');

  const matches = [];
  await forEachUser(record => {
    if (matchesQuery(record, query)) matches.push(record);
  });

  // An exact email stays in the cut-off, since Manage admins depends on finding it
  matches.sort((a, b) => Number(b.email?.toLowerCase() === query) - Number(a.email?.toLowerCase() === query));

  const db = getFirestore();
  const users = await Promise.all(matches.slice(0, MAX_SEARCH_RESULTS).map(async record => ({
    ...summarizeUser(record),
    vehicles: await countOf(db.collection('vehicles').where('userId', '==', record.uid)),
    devices: await countOf(db.collection(`users/${record.uid}/pushTokens`)),
  })));
  return { users, total: matches.length };
});

export const setAdminRole = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, SUPERADMIN);
  const makeAdmin = request.data?.makeAdmin === true;
  const target = await getTarget(request.data?.uid);
  rejectIf(checkRoleChange(actor.uid, target, makeAdmin));

  await getAuth().setCustomUserClaims(
    target.uid,
    claimsAfterRoleChange(target.customClaims, makeAdmin, todayInMalaysia())
  );
  if (!makeAdmin) await getAuth().revokeRefreshTokens(target.uid);

  await writeLog(actor, target, makeAdmin ? 'role_added' : 'role_removed');
  return { ok: true };
});

export const setUserDisabled = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, SUPERADMIN);
  const disable = request.data?.disabled === true;
  const reason = disable ? cleanReason(request.data?.reason) : '';
  const target = await getTarget(request.data?.uid);
  rejectIf(checkDisableChange(actor.uid, target, disable, reason));

  await getAuth().updateUser(target.uid, { disabled: disable });
  if (disable) {
    await getAuth().revokeRefreshTokens(target.uid);
    const db = getFirestore();
    await db.recursiveDelete(db.collection(`users/${target.uid}/pushTokens`));
  }

  await writeLog(actor, target, disable ? 'user_disabled' : 'user_enabled', reason);
  return { ok: true };
});

export const getActivityLog = onCall(CALLABLE_OPTIONS, async (request) => {
  await requireRole(request, SUPERADMIN);
  const snapshot = await getFirestore().collection('adminLogs')
    .orderBy('createdAt', 'desc')
    .limit(LOG_PAGE_SIZE)
    .get();

  return {
    entries: snapshot.docs.map(doc => {
      const entry = doc.data();
      return {
        id: doc.id,
        action: entry.action,
        category: entry.category,
        actorEmail: entry.actorEmail,
        targetEmail: entry.targetEmail,
        reason: entry.reason,
        details: entry.details ?? null,
        createdAt: entry.createdAt?.toDate().toISOString() ?? null,
      };
    }),
  };
});
