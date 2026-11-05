import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_BODY_LENGTH,
  MAX_PICKED_EMAILS,
  MAX_TITLE_LENGTH,
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
  selectUserIds,
  wantsNotification,
} from './notificationLogic.js';

const CONTENT = { titleEn: 'Title', bodyEn: 'Body', titleMs: 'Tajuk', bodyMs: 'Mesej' };
const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 10, 5);
const TODAY = '2026-11-05';

const user = (uid, overrides = {}) => ({ uid, disabled: false, createdAt: NOW - 400 * DAY, lastActiveAt: NOW - DAY, ...overrides });
const pick = (audience, data) => [...selectUserIds(audience, { now: NOW, today: TODAY, ...data })].sort();

test('cleanContent needs both languages and respects the length limits', () => {
  assert.deepEqual(cleanContent({ ...CONTENT, titleEn: '  Title  ' }), CONTENT);
  assert.equal(cleanContent({ ...CONTENT, bodyMs: '   ' }), null);
  assert.equal(cleanContent({ ...CONTENT, titleMs: undefined }), null);
  assert.equal(cleanContent({ ...CONTENT, titleEn: 'x'.repeat(MAX_TITLE_LENGTH + 1) }), null);
  assert.equal(cleanContent({ ...CONTENT, bodyEn: 'x'.repeat(MAX_BODY_LENGTH + 1) }), null);
  assert.equal(cleanContent(undefined), null);
});

test('type, tab, send id and limit reject anything unexpected', () => {
  assert.equal(cleanType('tip'), 'tip');
  assert.equal(cleanType('promotion'), 'promotion');
  assert.equal(cleanType('spam'), null);
  assert.equal(cleanOpenTab('mileage'), 'mileage');
  assert.equal(cleanOpenTab('javascript:alert(1)'), 'overview');
  assert.equal(isValidSendId('123e4567-e89b-12d3-a456-426614174000'), true);
  assert.equal(isValidSendId('../../users/x'), false);
  assert.equal(isValidSendId('short'), false);
  assert.equal(cleanLimit(3), 3);
  assert.equal(cleanLimit(0), null);
  assert.equal(cleanLimit(21), null);
  assert.equal(cleanLimit(2.5), null);
  assert.equal(cleanLimit('3'), null);
});

test('cleanAudience accepts known groups and rejects the rest', () => {
  assert.deepEqual(cleanAudience({ kind: 'everyone', extra: 1 }), { kind: 'everyone' });
  assert.deepEqual(cleanAudience({ kind: 'language', language: 'ms' }), { kind: 'language', language: 'ms' });
  assert.equal(cleanAudience({ kind: 'language', language: 'fr' }), null);
  assert.deepEqual(cleanAudience({ kind: 'vehicleType', text: ' Honda ' }), { kind: 'vehicleType', text: 'Honda' });
  assert.equal(cleanAudience({ kind: 'vehicleType', text: '  ' }), null);
  assert.equal(cleanAudience({ kind: 'admins' }), null);
  assert.equal(cleanAudience(null), null);
});

test('cleanAudience tidies picked emails and caps how many', () => {
  assert.deepEqual(
    cleanAudience({ kind: 'users', emails: [' A@b.com', 'a@b.com', 'not-an-email', 5, 'c@d.com'] }),
    { kind: 'users', emails: ['a@b.com', 'c@d.com'] }
  );
  assert.equal(cleanAudience({ kind: 'users', emails: [] }), null);
  assert.equal(cleanAudience({ kind: 'users', emails: 'a@b.com' }), null);
  const tooMany = Array.from({ length: MAX_PICKED_EMAILS + 1 }, (_, i) => `u${i}@b.com`);
  assert.equal(cleanAudience({ kind: 'users', emails: tooMany }), null);
});

test('only whole groups count against the daily limit', () => {
  assert.equal(isBulkAudience({ kind: 'everyone' }), true);
  assert.equal(isBulkAudience({ kind: 'language', language: 'en' }), true);
  assert.equal(isBulkAudience({ kind: 'users', emails: ['a@b.com'] }), false);
});

test('disabled accounts are left out of every audience', () => {
  const users = [user('on'), user('off', { disabled: true })];
  assert.deepEqual(pick({ kind: 'everyone' }, { users }), ['on']);
  assert.deepEqual(pick({ kind: 'users', emails: [] }, { users, pickedUids: ['on', 'off'] }), ['on']);
  assert.deepEqual(pick({ kind: 'noVehicle' }, { users }), ['on']);
});

test('road tax groups use the expiry day as still valid and ignore bad dates', () => {
  const users = ['expired', 'today', 'edge', 'later', 'blank', 'none'].map(uid => user(uid));
  const vehicles = [
    { userId: 'expired', roadTaxExpiry: '2026-11-04' },
    { userId: 'today', roadTaxExpiry: '2026-11-05' },
    { userId: 'edge', roadTaxExpiry: '2026-12-05' },
    { userId: 'later', roadTaxExpiry: '2026-12-06' },
    { userId: 'blank', roadTaxExpiry: '' },
    { userId: 'none' },
  ];
  assert.deepEqual(pick({ kind: 'roadTaxExpired' }, { users, vehicles }), ['expired']);
  assert.deepEqual(pick({ kind: 'roadTaxSoon' }, { users, vehicles }), ['edge', 'today']);
});

test('activity groups follow account age and last activity', () => {
  const users = [
    user('fresh', { createdAt: NOW - 30 * DAY }),
    user('old', { createdAt: NOW - 31 * DAY }),
    user('quiet', { lastActiveAt: NOW - 61 * DAY }),
    user('never', { lastActiveAt: null }),
  ];
  assert.deepEqual(pick({ kind: 'newUsers' }, { users }), ['fresh']);
  assert.deepEqual(pick({ kind: 'inactive' }, { users }), ['never', 'quiet']);
});

test('vehicle groups match type and model, ignoring case', () => {
  const users = [user('a'), user('b'), user('c'), user('d')];
  const vehicles = [
    { userId: 'a', type: 'Honda RS150' },
    { userId: 'b', type: 'Motorcycle', model: 'HONDA Wave' },
    { userId: 'c', type: 'Yamaha Y15', name: 'My Honda' },
  ];
  assert.deepEqual(pick({ kind: 'vehicleType', text: 'honda' }, { users, vehicles }), ['a', 'b']);
  assert.deepEqual(pick({ kind: 'noVehicle' }, { users, vehicles }), ['d']);
});

test('language groups come from the device language, defaulting to English', () => {
  const users = [user('en'), user('ms'), user('unset'), user('offline')];
  const tokens = [
    { userId: 'en', language: 'en' },
    { userId: 'ms', language: 'ms' },
    { userId: 'unset' },
  ];
  assert.deepEqual(pick({ kind: 'language', language: 'ms' }, { users, tokens }), ['ms']);
  assert.deepEqual(pick({ kind: 'language', language: 'en' }, { users, tokens }), ['en', 'unset']);
  assert.deepEqual(countLanguages(tokens), { en: 2, ms: 1 });
});

test('promotions need an opt-in, other types are on unless turned off', () => {
  assert.equal(wantsNotification(undefined, 'promotion'), false);
  assert.equal(wantsNotification({}, 'promotion'), false);
  assert.equal(wantsNotification({ promotion: true }, 'promotion'), true);
  assert.equal(wantsNotification(undefined, 'tip'), true);
  assert.equal(wantsNotification({ update: false }, 'tip'), true);
  assert.equal(wantsNotification({ tip: false }, 'tip'), false);
  assert.equal(wantsNotification({ roadTax: false }, 'roadTax'), false);
});

test('filterByPrefs keeps only people who want this type', () => {
  const prefs = new Map([['off', { tip: false }], ['in', { promotion: true }]]);
  assert.deepEqual([...filterByPrefs(new Set(['off', 'in', 'none']), prefs, 'tip')], ['in', 'none']);
  assert.deepEqual([...filterByPrefs(new Set(['off', 'in', 'none']), prefs, 'promotion')], ['in']);
});

test('cleanScheduleTime allows 5 minutes to 60 days ahead', () => {
  const at = (ms) => new Date(NOW + ms).toISOString();
  assert.equal(cleanScheduleTime(at(5 * 60 * 1000), NOW), NOW + 5 * 60 * 1000);
  assert.equal(cleanScheduleTime(at(60 * DAY), NOW), NOW + 60 * DAY);
  assert.equal(cleanScheduleTime(at(4 * 60 * 1000), NOW), null);
  assert.equal(cleanScheduleTime(at(-DAY), NOW), null);
  assert.equal(cleanScheduleTime(at(61 * DAY), NOW), null);
  assert.equal(cleanScheduleTime('tomorrow', NOW), null);
  assert.equal(cleanScheduleTime(undefined, NOW), null);
});

test('buildCustomPushData picks the device language and sends only strings', () => {
  assert.deepEqual(buildCustomPushData(CONTENT, 'ms', 'id', 'mileage'), {
    type: 'custom', sendId: 'id', openTab: 'mileage', title: 'Tajuk', body: 'Mesej',
  });
  const data = buildCustomPushData(CONTENT, 'en', '', 'overview');
  assert.equal(data.title, 'Title');
  assert.ok(Object.values(data).every(value => typeof value === 'string'));
});
