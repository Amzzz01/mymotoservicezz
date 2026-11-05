import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import {
  NotificationSendRecord,
  describeAudience,
  formatAdminDateTime,
  getAdminErrorMessage,
  getSendHistory,
  setDailySendLimit,
} from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import AdminHeader from './AdminHeader';
import Spinner from './Spinner';

interface HistoryData {
  sends: NotificationSendRecord[];
  dailyLimit: number;
  usedToday: number;
}

const Figure: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg px-1 py-2 text-center">
    <div className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{value}</div>
    <div className="text-xs text-slate-600 dark:text-slate-400">{label}</div>
  </div>
);

const AdminHistory: React.FC<{ successMessage?: string; onBack: () => void }> = ({ successMessage, onBack }) => {
  const { t, language } = useApp();
  const { role, currentUser } = useAuth();
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      setData(await getSendHistory());
    } catch (err) {
      console.error('Failed to load send history:', err);
      setError(getAdminErrorMessage(err, t));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChangeLimit = async () => {
    const answer = window.prompt(t.histLimitPrompt, String(data?.dailyLimit ?? ''));
    if (answer === null) return;
    setSaving(true);
    setError('');
    try {
      await setDailySendLimit(Number(answer));
      await load();
    } catch (err) {
      console.error('Failed to change the send limit:', err);
      setError(getAdminErrorMessage(err, t));
    } finally {
      setSaving(false);
    }
  };

  const statusBadge: Record<NotificationSendRecord['status'], { label: string; className: string }> = {
    sent: { label: t.histSent, className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
    sending: { label: t.histSending, className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' },
    failed: { label: t.histFailed, className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' },
  };

  return (
    <>
      <AdminHeader title={t.adminSendHistory} onBack={onBack} />
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-2.5">
        {successMessage && <p className="text-sm font-semibold text-green-800 dark:text-green-400" role="status">{successMessage}</p>}
        {error && (
          <div role="alert">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
            {!data && (
              <button onClick={load} className="mt-2 min-h-[44px] px-4 rounded-lg text-sm font-bold border border-red-700 dark:border-red-500 text-red-700 dark:text-red-400">
                {t.adminRetry}
              </button>
            )}
          </div>
        )}
        {!data && !error && <div className="flex justify-center py-6"><Spinner /></div>}

        {data && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-3 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {fillTemplate(t.histUsage, { used: String(data.usedToday), limit: String(data.dailyLimit) })}
            </span>
            {role === 'superadmin' && (
              <button
                onClick={handleChangeLimit}
                disabled={saving}
                className="flex-shrink-0 min-h-[44px] px-3 rounded-lg border border-violet-700 dark:border-violet-400 text-violet-800 dark:text-violet-300 text-sm font-bold disabled:opacity-60"
              >
                {t.histChangeLimit}
              </button>
            )}
          </div>
        )}

        {data?.sends.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t.histEmpty}</p>}

        {data?.sends.map(send => (
          <div key={send.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 break-words min-w-0">{send.title}</span>
              <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${statusBadge[send.status].className}`}>
                {statusBadge[send.status].label}
              </span>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 break-words">
              {formatAdminDateTime(send.createdAt, language)} · {describeAudience(send.audience, t)} · {send.actorEmail === currentUser?.email ? t.adminYou : send.actorEmail}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <Figure value={send.attempted} label={t.histAttempted} />
              <Figure value={send.delivered} label={t.histDelivered} />
              <Figure value={send.tapped} label={t.histTapped} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AdminHistory;
