import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import { CALLABLE_OPTIONS, STAFF, requireRole, writeLog } from './admin.js';
import { cleanAnnouncement, isValidAnnouncementId, summarizeAnnouncement } from './announcementLogic.js';

const NOBODY = { uid: '', email: '' };

const getExisting = async (id) => {
  if (!isValidAnnouncementId(id)) throw new HttpsError('invalid-argument', 'announcement-missing');
  const ref = getFirestore().doc(`announcements/${id}`);
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new HttpsError('not-found', 'announcement-missing');
  return { ref, snapshot };
};

// Includes hidden ones, which the app itself never loads
export const listAnnouncements = onCall(CALLABLE_OPTIONS, async (request) => {
  await requireRole(request, STAFF);
  const snapshot = await getFirestore().collection('announcements').get();
  const announcements = snapshot.docs
    .map(doc => summarizeAnnouncement(doc.id, doc.data()))
    .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
  return { announcements };
});

export const saveAnnouncement = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, STAFF);
  const fields = cleanAnnouncement(request.data?.announcement);
  if (!fields) throw new HttpsError('invalid-argument', 'invalid-announcement');

  const { id } = request.data;
  if (id) {
    // Keeps the same id, so people who already read it aren't told about it again
    const { ref } = await getExisting(id);
    await ref.update(fields);
    await writeLog(actor, NOBODY, 'announcement_edited', '', { title: fields.title });
    return { id };
  }

  const now = new Date().toISOString();
  const created = await getFirestore().collection('announcements').add({ ...fields, date: now, createdAt: now });
  await writeLog(actor, NOBODY, 'announcement_created', '', { title: fields.title });
  return { id: created.id };
});

export const deleteAnnouncement = onCall(CALLABLE_OPTIONS, async (request) => {
  const actor = await requireRole(request, STAFF);
  const { ref, snapshot } = await getExisting(request.data?.id);
  await ref.delete();
  await writeLog(actor, NOBODY, 'announcement_deleted', '', { title: snapshot.data().title ?? '' });
  return { ok: true };
});
