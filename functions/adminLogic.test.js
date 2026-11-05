import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_REASON_LENGTH,
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

const user = (overrides = {}) => ({ uid: 'target', email: 'a@b.com', emailVerified: true, disabled: false, ...overrides });
const admin = (overrides = {}) => user({ customClaims: { role: 'admin' }, ...overrides });
const superadmin = (overrides = {}) => user({ customClaims: { role: 'superadmin' }, ...overrides });

test('hasAccess requires an allowed role on a live, verified account', () => {
  assert.equal(hasAccess(admin(), ['admin', 'superadmin']), true);
  assert.equal(hasAccess(superadmin(), ['superadmin']), true);
  assert.equal(hasAccess(admin(), ['superadmin']), false);
  assert.equal(hasAccess(user(), ['admin', 'superadmin']), false);
  assert.equal(hasAccess(admin({ disabled: true }), ['admin']), false);
  assert.equal(hasAccess(admin({ emailVerified: false }), ['admin']), false);
});

test('checkRoleChange protects the superadmin and the actor', () => {
  assert.equal(checkRoleChange('target', user(), true), 'cannot-change-self');
  assert.equal(checkRoleChange('target', admin(), false), 'cannot-change-self');
  assert.equal(checkRoleChange('me', superadmin(), true), 'cannot-change-superadmin');
  assert.equal(checkRoleChange('me', superadmin(), false), 'cannot-change-superadmin');
});

test('checkRoleChange only promotes verified, active, non-admin users', () => {
  assert.equal(checkRoleChange('me', user(), true), null);
  assert.equal(checkRoleChange('me', admin(), true), 'already-admin');
  assert.equal(checkRoleChange('me', user({ emailVerified: false }), true), 'email-not-verified');
  assert.equal(checkRoleChange('me', user({ disabled: true }), true), 'user-disabled');
});

test('checkRoleChange only removes actual admins', () => {
  assert.equal(checkRoleChange('me', admin(), false), null);
  assert.equal(checkRoleChange('me', user(), false), 'not-admin');
});

test('claimsAfterRoleChange sets and clears the role but keeps other claims', () => {
  assert.deepEqual(claimsAfterRoleChange(undefined, true, '2026-11-05'), { role: 'admin', roleAddedAt: '2026-11-05' });
  assert.deepEqual(claimsAfterRoleChange({ beta: true }, true, '2026-11-05'), { beta: true, role: 'admin', roleAddedAt: '2026-11-05' });
  assert.deepEqual(claimsAfterRoleChange({ beta: true, role: 'admin', roleAddedAt: 'x' }, false, '2026-11-05'), { beta: true });
});

test('checkDisableChange blocks the actor and anyone holding a role', () => {
  assert.equal(checkDisableChange('target', user(), true, 'spam'), 'cannot-change-self');
  assert.equal(checkDisableChange('me', admin(), true, 'spam'), 'remove-role-first');
  assert.equal(checkDisableChange('me', superadmin(), true, 'spam'), 'remove-role-first');
});

test('checkDisableChange needs a reason to disable and a disabled account to enable', () => {
  assert.equal(checkDisableChange('me', user(), true, 'spam'), null);
  assert.equal(checkDisableChange('me', user(), true, ''), 'reason-required');
  assert.equal(checkDisableChange('me', user({ disabled: true }), true, 'spam'), 'already-disabled');
  assert.equal(checkDisableChange('me', user({ disabled: true }), false, ''), null);
  assert.equal(checkDisableChange('me', user(), false, ''), 'not-disabled');
});

test('cleanReason trims, caps the length and rejects non-text', () => {
  assert.equal(cleanReason('  spam  '), 'spam');
  assert.equal(cleanReason('x'.repeat(500)).length, MAX_REASON_LENGTH);
  assert.equal(cleanReason(42), '');
  assert.equal(cleanReason(undefined), '');
});

test('query matching ignores case and survives accounts with no email', () => {
  assert.equal(cleanQuery('  SITI@ '), 'siti@');
  assert.equal(cleanQuery(null), '');
  assert.equal(matchesQuery({ email: 'Siti@Example.com' }, 'siti@'), true);
  assert.equal(matchesQuery({ email: 'ali@example.com' }, 'siti@'), false);
  assert.equal(matchesQuery({}, 'siti@'), false);
});

test('summarizeUser exposes account facts only', () => {
  const summary = summarizeUser({
    uid: 'u1',
    email: 'a@b.com',
    emailVerified: true,
    disabled: false,
    passwordHash: 'secret',
    tokensValidAfterTime: 'secret',
    metadata: { creationTime: 'Thu, 05 Nov 2026 01:00:00 GMT', lastSignInTime: 'not a date' },
    providerData: [{ providerId: 'google.com', uid: 'secret' }],
    customClaims: { role: 'admin', roleAddedAt: '2026-11-05', other: 'secret' },
  });
  assert.deepEqual(summary, {
    uid: 'u1',
    email: 'a@b.com',
    joinedAt: '2026-11-05T01:00:00.000Z',
    lastSignInAt: null,
    providers: ['google.com'],
    emailVerified: true,
    disabled: false,
    role: 'admin',
    roleAddedAt: '2026-11-05',
  });
  assert.equal(summarizeUser(user({ customClaims: { role: 'owner' } })).role, 'user');
});

test('logCategory separates role changes from user changes', () => {
  assert.equal(logCategory('role_added'), 'roles');
  assert.equal(logCategory('role_removed'), 'roles');
  assert.equal(logCategory('user_disabled'), 'users');
  assert.equal(logCategory('user_enabled'), 'users');
  assert.equal(logCategory('notification_sent'), 'sends');
  assert.equal(logCategory('limit_changed'), 'sends');
});
