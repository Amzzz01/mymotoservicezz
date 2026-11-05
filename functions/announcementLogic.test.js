import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_ANNOUNCEMENT_MESSAGE,
  MAX_ANNOUNCEMENT_TITLE,
  MAX_ANNOUNCEMENT_VERSION,
  announcementDate,
  cleanAnnouncement,
  isValidAnnouncementId,
  summarizeAnnouncement,
} from './announcementLogic.js';

const VALID = { title: 'Title', message: 'Body', version: '2.3', type: 'feature', priority: 'high', isActive: true };

test('cleanAnnouncement trims text and drops fields an admin may not set', () => {
  assert.deepEqual(
    cleanAnnouncement({ ...VALID, title: '  Title ', date: 'hacked', createdAt: 'hacked', userId: 'x' }),
    VALID
  );
  const { version, ...withoutVersion } = VALID;
  assert.equal(cleanAnnouncement(withoutVersion).version, '');
});

test('cleanAnnouncement rejects missing, oversized or unknown values', () => {
  assert.equal(cleanAnnouncement(undefined), null);
  assert.equal(cleanAnnouncement({ ...VALID, title: '   ' }), null);
  assert.equal(cleanAnnouncement({ ...VALID, message: undefined }), null);
  assert.equal(cleanAnnouncement({ ...VALID, title: 'x'.repeat(MAX_ANNOUNCEMENT_TITLE + 1) }), null);
  assert.equal(cleanAnnouncement({ ...VALID, message: 'x'.repeat(MAX_ANNOUNCEMENT_MESSAGE + 1) }), null);
  assert.equal(cleanAnnouncement({ ...VALID, version: 'x'.repeat(MAX_ANNOUNCEMENT_VERSION + 1) }), null);
  assert.equal(cleanAnnouncement({ ...VALID, type: 'promo' }), null);
  assert.equal(cleanAnnouncement({ ...VALID, priority: 'urgent' }), null);
  assert.equal(cleanAnnouncement({ ...VALID, isActive: 'true' }), null);
});

test('announcement ids cannot point outside the collection', () => {
  assert.equal(isValidAnnouncementId('abcDEF123_-'), true);
  assert.equal(isValidAnnouncementId('../users/x'), false);
  assert.equal(isValidAnnouncementId(''), false);
  assert.equal(isValidAnnouncementId(undefined), false);
});

test('announcementDate reads text and timestamps', () => {
  assert.equal(announcementDate('2026-11-05'), '2026-11-05');
  assert.equal(announcementDate({ toDate: () => new Date('2026-11-05T00:00:00Z') }), '2026-11-05T00:00:00.000Z');
  assert.equal(announcementDate(undefined), null);
});

test('summarizeAnnouncement copes with older hand-added documents', () => {
  assert.deepEqual(summarizeAnnouncement('a1', { title: 'Old' }), {
    id: 'a1', title: 'Old', message: '', version: '', type: 'info', priority: 'low', isActive: false, date: null,
  });
});
