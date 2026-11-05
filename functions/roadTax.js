// Pure helpers for the daily road tax push (kept free of Firebase imports so they can be unit tested).
// The status rules mirror utils/roadTax.ts in the app: valid through the expiry day, 'soon' within 7 days.

export const SOON_DAYS = 7;
export const TIME_ZONE = 'Asia/Kuala_Lumpur';

const COPY = {
  en: {
    expiredTitle: 'Road tax expired: {name}',
    expiredBody: '{vehicle} road tax expired on {date}. Tap to renew in the app.',
    soonTitle: 'Road tax expiring soon: {name}',
    soonBody: '{vehicle} road tax expires on {date}. Renew early to avoid a fine.',
    renew: 'Renew',
    later: 'Remind me tomorrow',
  },
  ms: {
    expiredTitle: 'Cukai jalan tamat: {name}',
    expiredBody: 'Cukai jalan {vehicle} tamat pada {date}. Ketik untuk perbaharui dalam aplikasi.',
    soonTitle: 'Cukai jalan hampir tamat: {name}',
    soonBody: 'Cukai jalan {vehicle} tamat pada {date}. Perbaharui awal untuk elak saman.',
    renew: 'Perbaharui',
    later: 'Ingatkan esok',
  },
};

const fill = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key]);

// Today's calendar date in Malaysia as 'YYYY-MM-DD' (en-CA formats dates that way).
export const todayInMalaysia = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(now);

export const addDays = (isoDate, days) => {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

// The furthest expiry date that still needs an alert today (for the Firestore range query).
export const alertCutoff = (today) => addDays(today, SOON_DAYS);

export const isValidExpiry = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value);

const formatDate = (isoDate) => {
  const [y, m, d] = isoDate.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};

// All FCM data values must be strings; the service worker turns this into the notification.
export const buildPushData = (vehicleId, vehicle, language, today) => {
  const copy = COPY[language] ?? COPY.en;
  const expiry = vehicle.roadTaxExpiry.slice(0, 10);
  const expired = expiry < today;
  const values = {
    name: vehicle.name,
    vehicle: vehicle.registrationNumber || vehicle.name,
    date: formatDate(expiry),
  };
  return {
    type: 'roadTax',
    vehicleId,
    title: fill(expired ? copy.expiredTitle : copy.soonTitle, values),
    body: fill(expired ? copy.expiredBody : copy.soonBody, values),
    renewLabel: copy.renew,
    laterLabel: copy.later,
  };
};

// One browser can hold a token under several accounts after switching users;
// only the account that registered it most recently should receive pushes.
export const newestTokenOwners = (tokenDocs) => {
  const byToken = new Map();
  for (const doc of tokenDocs) {
    const current = byToken.get(doc.token);
    if (!current || (doc.updatedAt ?? '') > (current.updatedAt ?? '')) {
      byToken.set(doc.token, doc);
    }
  }
  return [...byToken.values()];
};
