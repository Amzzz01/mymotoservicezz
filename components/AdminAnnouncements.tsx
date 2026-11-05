import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AnnouncementFields,
  AnnouncementPriority,
  AnnouncementType,
  ManagedAnnouncement,
  deleteAnnouncement,
  formatAdminDate,
  getAdminErrorMessage,
  listAnnouncements,
  saveAnnouncement,
} from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import AdminHeader from './AdminHeader';
import Spinner from './Spinner';

const MAX_TITLE_LENGTH = 100; // Matches the server's limits
const MAX_MESSAGE_LENGTH = 2000;
const MAX_VERSION_LENGTH = 20;
const NEW_ANNOUNCEMENT: AnnouncementFields = {
  title: '',
  message: '',
  version: '',
  type: 'info',
  priority: 'medium',
  isActive: true,
};

const toFields = ({ title, message, version, type, priority, isActive }: ManagedAnnouncement): AnnouncementFields =>
  ({ title, message, version, type, priority, isActive });

const AdminAnnouncements: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useApp();
  const [announcements, setAnnouncements] = useState<ManagedAnnouncement[] | null>(null);
  // null = showing the list; otherwise the form is open, for a new one when editingId is undefined
  const [draft, setDraft] = useState<AnnouncementFields | null>(null);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setAnnouncements(await listAnnouncements());
    } catch (err) {
      console.error('Failed to load announcements:', err);
      setError(getAdminErrorMessage(err, t));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await action();
      await load();
    } catch (err) {
      console.error('Announcement action failed:', err);
      setError(getAdminErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  const openForm = (fields: AnnouncementFields, id?: string) => {
    setError('');
    setDraft(fields);
    setEditingId(id);
  };

  const closeForm = () => {
    setError('');
    setDraft(null);
    setEditingId(undefined);
  };

  const handleSave = () => {
    if (!draft) return;
    run(async () => {
      await saveAnnouncement(draft, editingId);
      setDraft(null);
      setEditingId(undefined);
    });
  };

  const handleDelete = (announcement: ManagedAnnouncement) => {
    if (!window.confirm(fillTemplate(t.annConfirmDelete, { title: announcement.title }))) return;
    run(() => deleteAnnouncement(announcement.id).then(() => undefined));
  };

  const handleToggle = (announcement: ManagedAnnouncement) => {
    run(() => saveAnnouncement({ ...toFields(announcement), isActive: !announcement.isActive }, announcement.id).then(() => undefined));
  };

  const typeLabels: Record<AnnouncementType, string> = {
    feature: t.annTypeFeature,
    update: t.annTypeUpdate,
    maintenance: t.annTypeMaintenance,
    info: t.annTypeInfo,
  };
  const priorityLabels: Record<AnnouncementPriority, string> = {
    low: t.annPriorityLow,
    medium: t.annPriorityMedium,
    high: t.annPriorityHigh,
  };

  const inputClass = 'w-full px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100';
  const labelClass = 'text-sm font-semibold text-slate-700 dark:text-slate-300';
  const errorText = error && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{error}</p>;

  if (draft) {
    const update = (changes: Partial<AnnouncementFields>) => setDraft({ ...draft, ...changes });
    return (
      <>
        <AdminHeader title={editingId ? t.annEdit : t.annNew} onBack={closeForm} />
        <div className="max-w-xl mx-auto p-4 flex flex-col gap-3">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col gap-2">
            <label htmlFor="ann-title" className={labelClass}>{t.annTitle}</label>
            <input
              id="ann-title"
              type="text"
              maxLength={MAX_TITLE_LENGTH}
              value={draft.title}
              onChange={event => update({ title: event.target.value })}
              className={`${inputClass} min-h-[44px]`}
            />
            <label htmlFor="ann-message" className={labelClass}>{t.annMessage}</label>
            <textarea
              id="ann-message"
              rows={5}
              maxLength={MAX_MESSAGE_LENGTH}
              value={draft.message}
              onChange={event => update({ message: event.target.value })}
              className={`${inputClass} py-2.5 resize-y`}
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5 min-w-0">
                <label htmlFor="ann-type" className={labelClass}>{t.annType}</label>
                <select
                  id="ann-type"
                  value={draft.type}
                  onChange={event => update({ type: event.target.value as AnnouncementType })}
                  className={`${inputClass} min-h-[44px]`}
                >
                  {(Object.keys(typeLabels) as AnnouncementType[]).map(type => (
                    <option key={type} value={type}>{typeLabels[type]}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 min-w-0">
                <label htmlFor="ann-priority" className={labelClass}>{t.annPriority}</label>
                <select
                  id="ann-priority"
                  value={draft.priority}
                  onChange={event => update({ priority: event.target.value as AnnouncementPriority })}
                  className={`${inputClass} min-h-[44px]`}
                >
                  {(Object.keys(priorityLabels) as AnnouncementPriority[]).map(priority => (
                    <option key={priority} value={priority}>{priorityLabels[priority]}</option>
                  ))}
                </select>
              </div>
            </div>
            <label htmlFor="ann-version" className={labelClass}>{t.annVersion}</label>
            <input
              id="ann-version"
              type="text"
              maxLength={MAX_VERSION_LENGTH}
              value={draft.version}
              onChange={event => update({ version: event.target.value })}
              className={`${inputClass} min-h-[44px]`}
            />
            <label className="min-h-[44px] flex items-center gap-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={event => update({ isActive: event.target.checked })}
                className="w-5 h-5 accent-cyan-600"
              />
              {t.annShowToUsers}
            </label>
          </div>

          {errorText}

          <div className="flex gap-2">
            <button
              onClick={closeForm}
              disabled={busy}
              className="flex-1 min-h-[48px] rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-bold disabled:opacity-60"
            >
              {t.adminCancel}
            </button>
            <button
              onClick={handleSave}
              disabled={busy || !draft.title.trim() || !draft.message.trim()}
              className="flex-[2] min-h-[48px] rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold disabled:opacity-50"
            >
              {t.annSave}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={t.adminAnnouncements} onBack={onBack} />
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-2.5">
        <button
          onClick={() => openForm(NEW_ANNOUNCEMENT)}
          className="min-h-[48px] rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold"
        >
          {t.annNew}
        </button>

        {errorText}
        {error && !announcements && (
          <button onClick={load} className="min-h-[44px] rounded-lg text-sm font-bold border border-red-700 dark:border-red-500 text-red-700 dark:text-red-400">
            {t.adminRetry}
          </button>
        )}
        {!announcements && !error && <div className="flex justify-center py-6"><Spinner /></div>}
        {announcements?.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t.annEmpty}</p>}

        {announcements?.map(announcement => (
          <div key={announcement.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 break-words min-w-0">{announcement.title}</span>
              <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${announcement.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {announcement.isActive ? t.annStatusShowing : t.annStatusHidden}
              </span>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {formatAdminDate(announcement.date, language)} · {typeLabels[announcement.type]} · {priorityLabels[announcement.priority]}
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line break-words line-clamp-3">{announcement.message}</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => openForm(toFields(announcement), announcement.id)}
                disabled={busy}
                className="min-h-[44px] rounded-lg border border-cyan-600 text-cyan-800 dark:text-cyan-300 text-sm font-bold disabled:opacity-60"
              >
                {t.annEditAction}
              </button>
              <button
                onClick={() => handleToggle(announcement)}
                disabled={busy}
                className="min-h-[44px] rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-bold disabled:opacity-60"
              >
                {announcement.isActive ? t.annHide : t.annShow}
              </button>
              <button
                onClick={() => handleDelete(announcement)}
                disabled={busy}
                className="min-h-[44px] rounded-lg border border-red-700 dark:border-red-500 text-red-700 dark:text-red-400 text-sm font-bold disabled:opacity-60"
              >
                {t.annDelete}
              </button>
            </div>
          </div>
        ))}

        <p className="text-sm text-slate-600 dark:text-slate-400">{t.annNote}</p>
      </div>
    </>
  );
};

export default AdminAnnouncements;
