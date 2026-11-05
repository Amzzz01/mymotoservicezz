import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { AdminLogEntry, describeAudience, formatAdminDateTime, getActivityLog, getAdminErrorMessage } from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import AdminHeader from './AdminHeader';
import Spinner from './Spinner';

type LogFilter = 'all' | AdminLogEntry['category'];

const AdminActivity: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t, language } = useApp();
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<AdminLogEntry[] | null>(null);
  const [filter, setFilter] = useState<LogFilter>('all');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setEntries(await getActivityLog());
    } catch (err) {
      console.error('Failed to load activity log:', err);
      setError(getAdminErrorMessage(err, t));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const describeEntry = (entry: AdminLogEntry): { title: string; detail: string } => {
    const { details } = entry;
    switch (entry.action) {
      case 'role_added':
        return { title: t.adminLogRoleAdded, detail: entry.targetEmail };
      case 'role_removed':
        return { title: t.adminLogRoleRemoved, detail: entry.targetEmail };
      case 'user_disabled':
        return { title: t.adminLogUserDisabled, detail: `${entry.targetEmail}. ${t.adminReasonPrefix}: ${entry.reason}` };
      case 'user_enabled':
        return { title: t.adminLogUserEnabled, detail: entry.targetEmail };
      case 'notification_sent':
        return {
          title: fillTemplate(t.adminLogNotificationSent, { title: details?.title ?? '' }),
          detail: fillTemplate(t.adminLogNotificationDetail, {
            audience: details?.audience ? describeAudience(details.audience, t) : '',
            devices: String(details?.devices ?? 0),
          }),
        };
      case 'limit_changed':
        return {
          title: t.adminLogLimitChanged,
          detail: fillTemplate(t.adminLogLimitDetail, { from: String(details?.from ?? ''), to: String(details?.to ?? '') }),
        };
      default:
        return { title: entry.action, detail: entry.targetEmail };
    }
  };

  const filters: { id: LogFilter; label: string }[] = [
    { id: 'all', label: t.adminFilterAll },
    { id: 'sends', label: t.adminFilterSends },
    { id: 'roles', label: t.adminFilterRoles },
    { id: 'users', label: t.adminFilterUsers },
  ];

  const visible = entries?.filter(entry => filter === 'all' || entry.category === filter);

  return (
    <>
      <AdminHeader title={t.adminActivity} onBack={onBack} />
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-3">
        <div className="grid grid-cols-4 gap-1.5">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`min-h-[44px] rounded-lg text-sm ${filter === id
                ? 'border-2 border-violet-700 dark:border-violet-400 bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200 font-bold'
                : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <div role="alert">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
            <button onClick={load} className="mt-2 min-h-[44px] px-4 rounded-lg text-sm font-bold border border-red-700 dark:border-red-500 text-red-700 dark:text-red-400">
              {t.adminRetry}
            </button>
          </div>
        )}
        {!entries && !error && <div className="flex justify-center py-6"><Spinner /></div>}
        {visible?.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t.adminNoActivity}</p>}

        {visible && visible.length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            {visible.map(entry => {
              const { title, detail } = describeEntry(entry);
              return (
                <div key={entry.id} className="px-3.5 py-3 flex flex-col gap-1 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 break-words">{title}</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 break-words">{detail}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 break-all">
                    {entry.actorEmail === currentUser?.email ? t.adminYou : entry.actorEmail} · {formatAdminDateTime(entry.createdAt, language)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-sm text-slate-600 dark:text-slate-400">{t.adminLogNote}</p>
      </div>
    </>
  );
};

export default AdminActivity;
