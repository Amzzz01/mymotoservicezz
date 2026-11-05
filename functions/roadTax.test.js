import { test } from 'node:test';
import assert from 'node:assert/strict';
import { alertCutoff, buildPushData, isValidExpiry, newestTokenOwners, todayInMalaysia } from './roadTax.js';

const today = '2026-11-05';

test('uses the Malaysian calendar date, not UTC', () => {
  // 20:00 UTC on 4 Nov is already 04:00 on 5 Nov in Malaysia
  assert.equal(todayInMalaysia(new Date('2026-11-04T20:00:00Z')), '2026-11-05');
});

test('alert window ends 7 days out, across month ends', () => {
  assert.equal(alertCutoff(today), '2026-11-12');
  assert.equal(alertCutoff('2026-12-28'), '2027-01-04');
});

test('expiry day itself is "soon", the day after is "expired"', () => {
  const soon = buildPushData('v1', { name: 'RS150', roadTaxExpiry: today }, 'en', today);
  const expired = buildPushData('v1', { name: 'RS150', roadTaxExpiry: '2026-11-04' }, 'en', today);
  assert.equal(soon.title, 'Road tax expiring soon: RS150');
  assert.equal(expired.title, 'Road tax expired: RS150');
});

test('names the vehicle by plate, in the device language, with every value a string', () => {
  const vehicle = { name: 'RS150', registrationNumber: 'WXY 1234', roadTaxExpiry: '2026-10-17' };
  const data = buildPushData('v1', vehicle, 'ms', today);
  assert.equal(data.body, 'Cukai jalan WXY 1234 tamat pada 17/10/2026. Ketik untuk perbaharui dalam aplikasi.');
  assert.equal(data.renewLabel, 'Perbaharui');
  assert.ok(Object.values(data).every(value => typeof value === 'string'));
});

test('falls back to English for an unknown language', () => {
  const data = buildPushData('v1', { name: 'RS150', roadTaxExpiry: today }, undefined, today);
  assert.equal(data.renewLabel, 'Renew');
});

test('rejects blank or malformed expiry values', () => {
  assert.equal(isValidExpiry(''), false);
  assert.equal(isValidExpiry(undefined), false);
  assert.equal(isValidExpiry('2026-11-05'), true);
});

test('a token shared by two accounts goes only to the latest one', () => {
  const owners = newestTokenOwners([
    { token: 't1', userId: 'old', updatedAt: '2026-01-01T00:00:00Z' },
    { token: 't1', userId: 'new', updatedAt: '2026-06-01T00:00:00Z' },
    { token: 't2', userId: 'other', updatedAt: '2026-03-01T00:00:00Z' },
  ]);
  assert.deepEqual(owners.map(o => o.userId).sort(), ['new', 'other']);
});
