// Pure rules for admin notifications (kept free of Firebase imports so they can be unit tested).
import { addDays, isValidExpiry } from './roadTax.js';

export const DEFAULT_DAILY_LIMIT = 3;
export const MAX_DAILY_LIMIT = 20;
export const MAX_TITLE_LENGTH = 60;
export const MAX_BODY_LENGTH = 200;
export const MAX_PICKED_EMAILS = 20;
export const MAX_VEHICLE_TEXT_LENGTH = 40;

const NEW_USER_DAYS = 30;
const INACTIVE_DAYS = 60;
const ROAD_TAX_SOON_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_SCHEDULE_LEAD_MS = 5 * 60 * 1000;
const MAX_SCHEDULE_LEAD_MS = 60 * DAY_MS;
const TYPES = ['tip', 'update', 'promotion'];
const OPEN_TABS = ['overview', 'analytics', 'mileage', 'reminders'];
const LANGUAGES = ['en', 'ms'];
const SIMPLE_AUDIENCES = ['everyone', 'roadTaxExpired', 'roadTaxSoon', 'newUsers', 'inactive', 'noVehicle'];
const AUDIENCES_NEEDING_VEHICLES = ['roadTaxExpired', 'roadTaxSoon', 'noVehicle', 'vehicleType'];

// Every group with a fixed member list, for the counts on the Send to screen
export const COUNTED_AUDIENCES = [
  ...SIMPLE_AUDIENCES.map(kind => ({ kind })),
  { kind: 'language', language: 'en' },
  { kind: 'language', language: 'ms' },
];

const cleanText = (value, maxLength) => {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
};

// Both languages are required, so nobody receives a blank notification
export const cleanContent = (raw) => {
  const content = {
    titleEn: cleanText(raw?.titleEn, MAX_TITLE_LENGTH),
    bodyEn: cleanText(raw?.bodyEn, MAX_BODY_LENGTH),
    titleMs: cleanText(raw?.titleMs, MAX_TITLE_LENGTH),
    bodyMs: cleanText(raw?.bodyMs, MAX_BODY_LENGTH),
  };
  return Object.values(content).every(Boolean) ? content : null;
};

export const cleanType = (type) => (TYPES.includes(type) ? type : null);

export const cleanOpenTab = (tab) => (OPEN_TABS.includes(tab) ? tab : 'overview');

export const isValidSendId = (id) => typeof id === 'string' && /^[A-Za-z0-9-]{16,64}$/.test(id);

export const cleanLimit = (limit) =>
  Number.isInteger(limit) && limit >= 1 && limit <= MAX_DAILY_LIMIT ? limit : null;

// Promotions need an opt-in; everything else is on unless the user turned it off
export const wantsNotification = (prefs, type) =>
  type === 'promotion' ? prefs?.promotion === true : prefs?.[type] !== false;

export const filterByPrefs = (userIds, prefsByUser, type) =>
  new Set([...userIds].filter(uid => wantsNotification(prefsByUser.get(uid), type)));

// Returns the time in milliseconds, or null if it's unreadable, too soon or too far ahead
export const cleanScheduleTime = (value, now) => {
  if (typeof value !== 'string') return null;
  const time = new Date(value).getTime();
  return time >= now + MIN_SCHEDULE_LEAD_MS && time <= now + MAX_SCHEDULE_LEAD_MS ? time : null;
};

// Returns a normalised audience, or null when it can't be used
export const cleanAudience = (raw) => {
  const kind = raw?.kind;
  if (SIMPLE_AUDIENCES.includes(kind)) return { kind };

  if (kind === 'language') return LANGUAGES.includes(raw.language) ? { kind, language: raw.language } : null;

  if (kind === 'vehicleType') {
    const text = cleanText(raw.text, MAX_VEHICLE_TEXT_LENGTH);
    return text ? { kind, text } : null;
  }

  if (kind === 'users' && Array.isArray(raw.emails)) {
    const emails = [...new Set(
      raw.emails
        .filter(email => typeof email === 'string')
        .map(email => email.trim().toLowerCase())
        .filter(email => /^[^\s@]+@[^\s@]+$/.test(email))
    )];
    return emails.length > 0 && emails.length <= MAX_PICKED_EMAILS ? { kind, emails } : null;
  }

  return null;
};

// Picking named people doesn't use up the daily limit; only sends to a whole group do
export const isBulkAudience = (audience) => audience.kind !== 'users';

export const needsVehicles = (audience) => AUDIENCES_NEEDING_VEHICLES.includes(audience.kind);

const vehicleMatchesText = (vehicle, text) =>
  `${vehicle.type ?? ''} ${vehicle.model ?? ''}`.toLowerCase().includes(text.toLowerCase());

// Decides who is in an audience. Disabled accounts are never included.
export const selectUserIds = (audience, { users, vehicles = [], tokens = [], pickedUids = [], now, today }) => {
  const active = users.filter(user => !user.disabled);
  const owning = (test) => {
    const owners = new Set(vehicles.filter(test).map(vehicle => vehicle.userId));
    return active.filter(user => owners.has(user.uid));
  };
  const expiryOf = (vehicle) => (isValidExpiry(vehicle.roadTaxExpiry) ? vehicle.roadTaxExpiry.slice(0, 10) : null);

  let selected;
  switch (audience.kind) {
    case 'everyone':
      selected = active;
      break;
    case 'users':
      selected = active.filter(user => pickedUids.includes(user.uid));
      break;
    case 'roadTaxExpired':
      selected = owning(vehicle => expiryOf(vehicle) && expiryOf(vehicle) < today);
      break;
    case 'roadTaxSoon':
      selected = owning(vehicle =>
        expiryOf(vehicle) && expiryOf(vehicle) >= today && expiryOf(vehicle) <= addDays(today, ROAD_TAX_SOON_DAYS)
      );
      break;
    case 'newUsers':
      selected = active.filter(user => user.createdAt >= now - NEW_USER_DAYS * DAY_MS);
      break;
    case 'inactive':
      selected = active.filter(user => !user.lastActiveAt || user.lastActiveAt < now - INACTIVE_DAYS * DAY_MS);
      break;
    case 'noVehicle': {
      const owners = new Set(vehicles.map(vehicle => vehicle.userId));
      selected = active.filter(user => !owners.has(user.uid));
      break;
    }
    case 'vehicleType':
      selected = owning(vehicle => vehicleMatchesText(vehicle, audience.text));
      break;
    case 'language': {
      const speakers = new Set(tokens.filter(token => languageOf(token) === audience.language).map(token => token.userId));
      selected = active.filter(user => speakers.has(user.uid));
      break;
    }
    default:
      selected = [];
  }
  return new Set(selected.map(user => user.uid));
};

export const languageOf = (token) => (token.language === 'ms' ? 'ms' : 'en');

export const countLanguages = (tokens) => ({
  en: tokens.filter(token => languageOf(token) === 'en').length,
  ms: tokens.filter(token => languageOf(token) === 'ms').length,
});

// All FCM data values must be strings; the service worker turns this into the notification.
export const buildCustomPushData = (content, language, sendId, openTab) => ({
  type: 'custom',
  sendId,
  openTab,
  title: language === 'ms' ? content.titleMs : content.titleEn,
  body: language === 'ms' ? content.bodyMs : content.bodyEn,
});
