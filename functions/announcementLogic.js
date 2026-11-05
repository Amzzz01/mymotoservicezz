// Pure rules for managing announcements (kept free of Firebase imports so they can be unit tested).

export const MAX_ANNOUNCEMENT_TITLE = 100;
export const MAX_ANNOUNCEMENT_MESSAGE = 2000;
export const MAX_ANNOUNCEMENT_VERSION = 20;

const TYPES = ['feature', 'update', 'maintenance', 'info'];
const PRIORITIES = ['low', 'medium', 'high'];

const cleanRequired = (value, maxLength) => {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
};

// Returns only the fields an admin may set, or null when something is missing or invalid
export const cleanAnnouncement = (raw) => {
  const title = cleanRequired(raw?.title, MAX_ANNOUNCEMENT_TITLE);
  const message = cleanRequired(raw?.message, MAX_ANNOUNCEMENT_MESSAGE);
  const version = typeof raw?.version === 'string' ? raw.version.trim() : '';
  const valid = title
    && message
    && version.length <= MAX_ANNOUNCEMENT_VERSION
    && TYPES.includes(raw.type)
    && PRIORITIES.includes(raw.priority)
    && typeof raw.isActive === 'boolean';

  return valid
    ? { title, message, version, type: raw.type, priority: raw.priority, isActive: raw.isActive }
    : null;
};

export const isValidAnnouncementId = (id) => typeof id === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(id);

// Older announcements were added by hand, so their dates may be text or Firestore timestamps
export const announcementDate = (date) => {
  if (typeof date === 'string') return date;
  return date?.toDate?.().toISOString() ?? null;
};

export const summarizeAnnouncement = (id, data) => ({
  id,
  title: data.title ?? '',
  message: data.message ?? '',
  version: data.version ?? '',
  type: TYPES.includes(data.type) ? data.type : 'info',
  priority: PRIORITIES.includes(data.priority) ? data.priority : 'low',
  isActive: data.isActive === true,
  date: announcementDate(data.date),
});
