import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, Timestamp, getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { CALLABLE_OPTIONS, STAFF, SUPERADMIN, forEachUser, rejectIf, requireRole, writeLog } from './admin.js';
import { hasAccess } from './adminLogic.js';
import {
  COUNTED_AUDIENCES,
  DEFAULT_DAILY_LIMIT,
  buildCustomPushData,
  cleanAudience,
  cleanContent,
  cleanLimit,
  cleanOpenTab,
  cleanScheduleTime,
  cleanType,
  countLanguages,
  filterByPrefs,
  isBulkAudience,
  isValidSendId,
  languageOf,
  needsVehicles,
  selectUserIds,
} from './notificationLogic.js';
import { TIME_ZONE, newestTokenOwners, todayInMalaysia } from './roadTax.js';

const SEND_OPTIONS = { ...CALLABLE_OPTIONS, timeoutSeconds: 300, memory: '512MiB' };
const FCM_BATCH_SIZE = 500;
const PUSH_TTL_SECONDS = 3 * 24 * 60 * 60;
const HISTORY_SIZE = 50;
const NOBODY = { uid: '', email: '' };
const DEAD_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

const configRef = () => getFirestore().doc('adminConfig/notifications');
const quotaRef = (date) => getFirestore().doc(`notificationQuota/${date}`);

const loadUsers = async () => {
  const users = [];
  await forEachUser(record => {
    users.push({
      uid: record.uid,
      disabled: record.disabled,
      createdAt: new Date(record.metadata.creationTime).getTime(),
      lastActiveAt: new Date(record.metadata.lastRefreshTime ?? record.metadata.lastSignInTime ?? 0).getTime(),
    });
  });
  return users;
};

const loadVehicles = async () => {
  const snapshot = await getFirestore().collection('vehicles').select('userId', 'type', 'model', 'roadTaxExpiry').get();
  return snapshot.docs.map(doc => doc.data());
};

const loadTokens = async () => {
  const snapshot = await getFirestore().collectionGroup('pushTokens').get();
  return newestTokenOwners(
    snapshot.docs.map(doc => ({ ...doc.data(), userId: doc.ref.parent.parent.id, ref: doc.ref }))
  );
};

export const loadPrefsByUser = async () => {
  const snapshot = await getFirestore().collection('users').select('notificationPrefs').get();
  return new Map(snapshot.docs.map(doc => [doc.id, doc.data().notificationPrefs]));
};

const lookUpEmails = async (emails) => {
  const { users, notFound } = await getAuth().getUsers(emails.map(email => ({ email })));
  return { pickedUids: users.map(user => user.uid), unknownEmails: notFound.map(item => item.email) };
};

// Worked out fresh on the server for every preview and send, so the app can't widen an audience
const resolveAudience = async (audience, type) => {
  const [users, vehicles, tokens, picked, prefsByUser] = await Promise.all([
    loadUsers(),
    needsVehicles(audience) ? loadVehicles() : [],
    loadTokens(),
    audience.kind === 'users' ? lookUpEmails(audience.emails) : { pickedUids: [], unknownEmails: [] },
    loadPrefsByUser(),
  ]);
  const selected = selectUserIds(audience, {
    users,
    vehicles,
    tokens,
    pickedUids: picked.pickedUids,
    now: Date.now(),
    today: todayInMalaysia(),
  });
  const userIds = filterByPrefs(selected, prefsByUser, type);
  return {
    userIds,
    tokens: tokens.filter(token => userIds.has(token.userId)),
    unknownEmails: picked.unknownEmails,
  };
};

const readAudience = (raw) => {
  const audience = cleanAudience(raw);
  if (!audience) throw new HttpsError('invalid-argument', 'invalid-audience');
  return audience;
};

const readContent = (raw) => {
  const content = cleanContent(raw);
  if (!content) throw new HttpsError('invalid-argument', 'invalid-content');
  return content;
};

const readType = (raw) => {
  const type = cleanType(raw);
  if (!type) throw new HttpsError('invalid-argument', 'invalid-content');
  return type;
};

const readQuota = async (date = todayInMalaysia()) => {
  const [config, quota] = await Promise.all([configRef().get(), quotaRef(date).get()]);
  return { dailyLimit: config.data()?.dailyLimit ?? DEFAULT_DAILY_LIMIT, usedToday: quota.data()?.count ?? 0 };
};

const pushToTokens = async (tokens, buildData) => {
  const deadTokenRefs = new Map();
  let delivered = 0;

  for (let i = 0; i < tokens.length; i += FCM_BATCH_SIZE) {
    const batch = tokens.slice(i, i + FCM_BATCH_SIZE);
    const { responses } = await getMessaging().sendEach(batch.map(token => ({
      token: token.token,
      data: buildData(token),
      webpush: { headers: { Urgency: 'normal', TTL: String(PUSH_TTL_SECONDS) } },
    })));

    responses.forEach((response, index) => {
      if (response.success) {
        delivered += 1;
      } else if (DEAD_TOKEN_CODES.has(response.error?.code)) {
        deadTokenRefs.set(batch[index].ref.path, batch[index].ref);
      } else {
        logger.warn('Custom push failed', { code: response.error?.code });
      }
    });
  }

  if (deadTokenRefs.size > 0) {
    const writer = getFirestore().bulkWriter();
    deadTokenRefs.forEach(ref => writer.delete(ref));
    await writer.close();
  }
  return delivered;
};

// Fills the bell, pushes to phones and records the result. Used by sending now and by the schedule.
const deliver = async (sendRef, send, actor, { userIds, tokens }) => {
  const db = getFirestore();
  const { titleEn, bodyEn, titleMs, bodyMs, type, openTab, audience } = send;
  const content = { titleEn, bodyEn, titleMs, bodyMs };

  try {
    // The bell comes first, so the entry already exists when someone taps the notification
    const sentAt = new Date().toISOString();
    const writer = db.bulkWriter();
    userIds.forEach(uid => writer.create(db.doc(`users/${uid}/inbox/${sendRef.id}`), { ...content, type, sentAt }));
    await writer.close();

    const delivered = await pushToTokens(tokens, token => buildCustomPushData(content, languageOf(token), sendRef.id, openTab));
    await sendRef.update({ status: 'sent', people: userIds.size, attempted: tokens.length, delivered });

    await writeLog(actor, NOBODY, 'notification_sent', '', { title: titleEn, audience, devices: tokens.length });
    return delivered;
  } catch (error) {
    logger.error('Notification send failed', { sendId: sendRef.id, error: error.message });
    await sendRef.update({ status: 'failed' }).catch(() => undefined);
    throw error;
  }
};

export const getAudienceCounts = onCall(CALLABLE_OPTIONS, async (request) => {
  await requireRole(request, STAFF);
  const [users, vehicles, tokens] = await Promise.all([loadUsers(), loadVehicles(), loadTokens()]);
  const context = { users, vehicles, tokens, now: Date.now(), today: todayInMalaysia() };

  const counts = {};
  for (const audience of COUNTED_AUDIENCES) {
    const userIds = selectUserIds(audience, context);
    const key = audience.language ? `language_${audience.language}` : audience.kind;
    counts[key] = tokens.filter(token => userIds.has(token.userId)).length;
  }
  return { counts };
});

export const previewNotification = onCall(CALLABLE_OPTIONS, async (request) => {
  await requireRole(request, STAFF);
  const audience = readAudience(request.data?.audience);
  const type = readType(request.data?.type);
  const scheduleTime = cleanScheduleTime(request.data?.scheduleAt, Date.now());
  const quotaDate = todayInMalaysia(scheduleTime ? new Date(scheduleTime) : new Date());
  const [{ userIds, tokens, unknownEmails }, quota] = await Promise.all([
    resolveAudience(audience, type),
    readQuota(quotaDate),
  ]);

  return {
    people: userIds.size,
    devices: tokens.length,
    languages: countLanguages(tokens),
    unknownEmails,
    isBulk: isBulkAudience(audience),
    ...quota,
  };
});

export const sendTestNotification = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, STAFF);
  const content = readContent(request.data?.content);
  const openTab = cleanOpenTab(request.data?.openTab);

  const tokens = (await loadTokens()).filter(token => token.userId === actor.uid);
  rejectIf(tokens.length === 0 ? 'no-devices' : null);

  const delivered = await pushToTokens(tokens, token => buildCustomPushData(content, languageOf(token), '', openTab));
  return { devices: tokens.length, delivered };
});

export const sendNotification = onCall(SEND_OPTIONS, async (request) => {
  const actor = await requireRole(request, STAFF);
  const { sendId, confirm, scheduleAt } = request.data ?? {};
  if (!isValidSendId(sendId)) throw new HttpsError('invalid-argument', 'invalid-content');

  const content = readContent(request.data?.content);
  const type = readType(request.data?.type);
  const openTab = cleanOpenTab(request.data?.openTab);
  const audience = readAudience(request.data?.audience);
  rejectIf(audience.kind === 'everyone' && confirm !== 'SEND' ? 'confirm-required' : null);

  const scheduleTime = scheduleAt ? cleanScheduleTime(scheduleAt, Date.now()) : null;
  if (scheduleAt && !scheduleTime) throw new HttpsError('invalid-argument', 'invalid-schedule');

  const resolved = await resolveAudience(audience, type);
  rejectIf(resolved.userIds.size === 0 ? 'no-recipients' : null);

  const db = getFirestore();
  const sendRef = db.doc(`notificationSends/${sendId}`);
  const quotaDate = todayInMalaysia(scheduleTime ? new Date(scheduleTime) : new Date());
  const quotaDoc = quotaRef(quotaDate);
  const send = {
    ...content,
    type,
    openTab,
    audience,
    status: scheduleTime ? 'scheduled' : 'sending',
    actorUid: actor.uid,
    actorEmail: actor.email ?? '',
    people: resolved.userIds.size,
    attempted: resolved.tokens.length,
    delivered: 0,
    tapped: 0,
    quotaDate,
    createdAt: FieldValue.serverTimestamp(),
    ...(scheduleTime ? {
      // dueAt only exists while waiting, which is what the schedule looks for
      dueAt: Timestamp.fromMillis(scheduleTime),
      scheduledFor: new Date(scheduleTime).toISOString(),
    } : {}),
  };

  // One transaction, so a retry can't send twice and two admins can't both take the last send.
  // A scheduled send takes its place in the limit of the day it goes out.
  await db.runTransaction(async (transaction) => {
    if ((await transaction.get(sendRef)).exists) throw new HttpsError('failed-precondition', 'already-sent');

    if (isBulkAudience(audience)) {
      const dailyLimit = (await transaction.get(configRef())).data()?.dailyLimit ?? DEFAULT_DAILY_LIMIT;
      const used = (await transaction.get(quotaDoc)).data()?.count ?? 0;
      if (used >= dailyLimit) throw new HttpsError('failed-precondition', 'daily-limit-reached');
      transaction.set(quotaDoc, { count: used + 1 }, { merge: true });
    }

    transaction.create(sendRef, send);
  });

  if (scheduleTime) {
    await writeLog(actor, NOBODY, 'notification_scheduled', '', {
      title: content.titleEn,
      audience,
      scheduledFor: send.scheduledFor,
    });
    return { people: resolved.userIds.size, attempted: resolved.tokens.length, delivered: 0, scheduledFor: send.scheduledFor };
  }

  try {
    const delivered = await deliver(sendRef, send, actor, resolved);
    return { people: resolved.userIds.size, attempted: resolved.tokens.length, delivered, scheduledFor: null };
  } catch {
    throw new HttpsError('internal', 'send-failed');
  }
});

export const cancelScheduledSend = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, STAFF);
  const { sendId } = request.data ?? {};
  if (!isValidSendId(sendId)) throw new HttpsError('invalid-argument', 'not-scheduled');

  const db = getFirestore();
  const sendRef = db.doc(`notificationSends/${sendId}`);
  const send = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(sendRef);
    if (snapshot.data()?.status !== 'scheduled') throw new HttpsError('failed-precondition', 'not-scheduled');

    const data = snapshot.data();
    if (isBulkAudience(data.audience)) {
      const quotaDoc = quotaRef(data.quotaDate);
      const used = (await transaction.get(quotaDoc)).data()?.count ?? 0;
      transaction.set(quotaDoc, { count: Math.max(used - 1, 0) }, { merge: true });
    }
    transaction.update(sendRef, { status: 'cancelled', dueAt: FieldValue.delete() });
    return data;
  });

  await writeLog(actor, NOBODY, 'notification_cancelled', '', { title: send.titleEn, audience: send.audience });
  return { ok: true };
});

const runScheduledSend = async (doc) => {
  const db = getFirestore();

  // Claimed in a transaction, so a cancel at the same moment can't also let it go out
  const send = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(doc.ref);
    if (snapshot.data()?.status !== 'scheduled') return null;
    transaction.update(doc.ref, { status: 'sending', dueAt: FieldValue.delete() });
    return snapshot.data();
  });
  if (!send) return;

  // An admin removed after scheduling shouldn't still be able to send
  const actor = await getAuth().getUser(send.actorUid).catch(() => null);
  if (!actor || !hasAccess(actor, STAFF)) {
    await doc.ref.update({ status: 'cancelled' });
    await writeLog(actor ?? { uid: send.actorUid, email: send.actorEmail }, NOBODY, 'notification_cancelled', '', {
      title: send.titleEn,
      audience: send.audience,
    });
    return;
  }

  const resolved = await resolveAudience(send.audience, send.type).catch(async (error) => {
    await doc.ref.update({ status: 'failed' });
    throw error;
  });
  await deliver(doc.ref, send, actor, resolved);
};

export const sendScheduledNotifications = onSchedule(
  {
    schedule: 'every 5 minutes',
    timeZone: TIME_ZONE,
    region: 'asia-southeast1',
    timeoutSeconds: 300,
    memory: '512MiB',
  },
  async () => {
    const snapshot = await getFirestore().collection('notificationSends')
      .where('dueAt', '<=', Timestamp.now())
      .get();

    for (const doc of snapshot.docs) {
      // One failed send is marked as failed and mustn't stop the others
      await runScheduledSend(doc).catch(error => {
        logger.error('Scheduled send failed', { sendId: doc.id, error: error.message });
      });
    }
  }
);

export const getSendHistory = onCall(CALLABLE_OPTIONS, async (request) => {
  await requireRole(request, STAFF);
  const [snapshot, quota] = await Promise.all([
    getFirestore().collection('notificationSends').orderBy('createdAt', 'desc').limit(HISTORY_SIZE).get(),
    readQuota(),
  ]);

  return {
    ...quota,
    sends: snapshot.docs.map(doc => {
      const send = doc.data();
      return {
        id: doc.id,
        title: send.titleEn,
        status: send.status,
        audience: send.audience,
        actorEmail: send.actorEmail,
        attempted: send.attempted,
        delivered: send.delivered,
        tapped: send.tapped,
        scheduledFor: send.scheduledFor ?? null,
        createdAt: send.createdAt?.toDate().toISOString() ?? null,
      };
    }),
  };
});

export const setDailySendLimit = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, SUPERADMIN);
  const limit = cleanLimit(request.data?.limit);
  if (!limit) throw new HttpsError('invalid-argument', 'invalid-limit');

  const { dailyLimit } = await readQuota();
  await configRef().set({ dailyLimit: limit }, { merge: true });
  await writeLog(actor, NOBODY, 'limit_changed', '', { from: dailyLimit, to: limit });
  return { dailyLimit: limit };
});

// Any signed-in user. Only counts someone who really received this send, and only once.
export const recordNotificationTap = onCall(CALLABLE_OPTIONS, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'no-access');
  const { sendId } = request.data ?? {};
  if (!isValidSendId(sendId)) return { counted: false };

  const db = getFirestore();
  const inboxRef = db.doc(`users/${request.auth.uid}/inbox/${sendId}`);
  const counted = await db.runTransaction(async (transaction) => {
    const inbox = await transaction.get(inboxRef);
    if (!inbox.exists || inbox.data().tappedAt) return false;
    transaction.update(inboxRef, { tappedAt: new Date().toISOString() });
    transaction.update(db.doc(`notificationSends/${sendId}`), { tapped: FieldValue.increment(1) });
    return true;
  });
  return { counted };
});
