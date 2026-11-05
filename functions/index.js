import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import {
  TIME_ZONE,
  alertCutoff,
  buildPushData,
  isValidExpiry,
  newestTokenOwners,
  todayInMalaysia,
} from './roadTax.js';

initializeApp();

const FCM_BATCH_SIZE = 500;
const DEAD_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

// Every morning: push a notification for each vehicle whose road tax is expired or due
// within 7 days, to every device of its owner that allowed notifications.
export const sendRoadTaxReminders = onSchedule(
  { schedule: '0 8 * * *', timeZone: TIME_ZONE, region: 'asia-southeast1' },
  async () => {
    const db = getFirestore();
    const today = todayInMalaysia();

    const vehiclesSnap = await db.collection('vehicles')
      .where('roadTaxExpiry', '<=', alertCutoff(today))
      .get();
    const vehicles = vehiclesSnap.docs.filter(doc => isValidExpiry(doc.data().roadTaxExpiry));
    if (vehicles.length === 0) {
      logger.info('No road tax alerts today');
      return;
    }

    const tokensSnap = await db.collectionGroup('pushTokens').get();
    const tokenDocs = newestTokenOwners(
      tokensSnap.docs.map(doc => ({ ...doc.data(), userId: doc.ref.parent.parent.id, ref: doc.ref }))
    );
    const tokensByUser = new Map();
    for (const tokenDoc of tokenDocs) {
      tokensByUser.set(tokenDoc.userId, [...(tokensByUser.get(tokenDoc.userId) ?? []), tokenDoc]);
    }

    const sends = vehicles.flatMap(vehicle =>
      (tokensByUser.get(vehicle.data().userId) ?? []).map(tokenDoc => ({ vehicle, tokenDoc }))
    );

    const deadTokenRefs = new Map();
    const notifiedVehicles = new Map();
    let failed = 0;

    for (let i = 0; i < sends.length; i += FCM_BATCH_SIZE) {
      const batch = sends.slice(i, i + FCM_BATCH_SIZE);
      const { responses } = await getMessaging().sendEach(batch.map(({ vehicle, tokenDoc }) => ({
        token: tokenDoc.token,
        // Data-only: public/sw-roadtax.js builds the notification so it matches the on-open one
        data: buildPushData(vehicle.id, vehicle.data(), tokenDoc.language, today),
        webpush: { headers: { Urgency: 'high', TTL: String(24 * 60 * 60) } },
      })));

      responses.forEach((response, index) => {
        const { vehicle, tokenDoc } = batch[index];
        if (response.success) {
          notifiedVehicles.set(vehicle.id, vehicle.ref);
        } else {
          failed += 1;
          if (DEAD_TOKEN_CODES.has(response.error?.code)) {
            deadTokenRefs.set(tokenDoc.ref.path, tokenDoc.ref);
          } else {
            logger.warn('Road tax push failed', { code: response.error?.code });
          }
        }
      });
    }

    // Lets the app skip its on-open notification when the morning push already went out
    const writer = db.bulkWriter();
    notifiedVehicles.forEach(ref => writer.update(ref, { roadTaxPushedOn: today }));
    deadTokenRefs.forEach(ref => writer.delete(ref));
    await writer.close();

    logger.info('Road tax reminders done', {
      alertVehicles: vehicles.length,
      attempted: sends.length,
      failed,
      deadTokensRemoved: deadTokenRefs.size,
    });
  }
);
