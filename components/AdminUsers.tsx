import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import {
  AdminUserDetails,
  formatAdminDate,
  formatProviders,
  getAdminErrorMessage,
  searchUsers,
  setUserDisabled,
} from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import AdminHeader from './AdminHeader';
import Spinner from './Spinner';

const MAX_REASON_LENGTH = 200; // Matches the server's cap

const Row: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-600 dark:text-slate-400">{label}</span>
    <span className="font-semibold text-right text-slate-800 dark:text-slate-100">{value}</span>
  </div>
);

const AdminUsers: React.FC<{ onBack: () => void; onSendTo: (email: string) => void }> = ({ onBack, onSendTo }) => {
  const { t, language } = useApp();
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AdminUserDetails[] | null>(null);
  const [total, setTotal] = useState(0);
  const [lastQuery, setLastQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [disablingUid, setDisablingUid] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const load = async (text: string) => {
    const result = await searchUsers(text);
    setUsers(result.users);
    setTotal(result.total);
    setLastQuery(text);
  };

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (err) {
      console.error('Admin user action failed:', err);
      setError(getAdminErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setDisablingUid(null);
    run(() => load(query));
  };

  const handleDisable = (user: AdminUserDetails) => {
    if (!reason.trim()) {
      setError(t.adminReasonRequired);
      return;
    }
    run(async () => {
      await setUserDisabled(user.uid, true, reason);
      setDisablingUid(null);
      setReason('');
      await load(lastQuery);
    });
  };

  const handleEnable = (user: AdminUserDetails) => {
    if (!window.confirm(fillTemplate(t.adminConfirmEnable, { email: user.email }))) return;
    run(async () => {
      await setUserDisabled(user.uid, false);
      await load(lastQuery);
    });
  };

  return (
    <>
      <AdminHeader title={t.adminUsers} onBack={onBack} />
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-3">
        <form onSubmit={handleSearch} className="flex flex-col gap-1.5">
          <label htmlFor="user-search" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.adminFindByEmail}</label>
          <div className="flex gap-2">
            <input
              id="user-search"
              type="search"
              autoComplete="off"
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="flex-grow min-w-0 min-h-[46px] px-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
            />
            <button type="submit" disabled={busy || !query.trim()} className="min-h-[46px] px-3.5 rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-sm font-bold disabled:opacity-60">
              {t.adminFind}
            </button>
          </div>
        </form>

        {error && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{error}</p>}
        {busy && users === null && <div className="flex justify-center py-6"><Spinner /></div>}
        {users?.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">{t.adminNoUsers}</p>}
        {users && total > users.length && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {fillTemplate(t.adminShowingSome, { shown: String(users.length), total: String(total) })}
          </p>
        )}

        {users?.map(user => (
          <div key={user.uid} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col gap-3">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 break-all">{user.email}</span>
              {user.role !== 'user' ? (
                <span className="flex-shrink-0 text-xs font-bold text-white bg-violet-700 px-2 py-0.5 rounded-full">
                  {user.role === 'superadmin' ? t.roleSuperadmin : t.roleAdmin}
                </span>
              ) : (
                <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${user.disabled ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'}`}>
                  {user.disabled ? t.adminStatusDisabled : t.adminStatusActive}
                </span>
              )}
            </div>

            <div className="text-sm flex flex-col gap-2">
              <Row label={t.adminJoined} value={formatAdminDate(user.joinedAt, language)} />
              <Row label={t.adminLastSignIn} value={formatAdminDate(user.lastSignInAt, language)} />
              <Row label={t.adminSignInMethods} value={formatProviders(user.providers, t)} />
              <Row label={t.adminEmailVerifiedLabel} value={user.emailVerified ? t.adminYes : t.adminNo} />
              <Row label={t.adminStatVehicles} value={user.vehicles} />
              <Row label={t.adminStatDevices} value={user.devices} />
            </div>

            <p className="px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-300">{t.adminPrivateNote}</p>

            {!user.disabled && user.email && (
              <button
                onClick={() => onSendTo(user.email)}
                className="min-h-[46px] rounded-lg border border-cyan-600 text-cyan-800 dark:text-cyan-300 text-sm font-bold hover:bg-cyan-50 dark:hover:bg-cyan-900/30"
              >
                {t.adminSendNotification}
              </button>
            )}

            {user.role === 'user' && user.uid !== currentUser?.uid && (
              user.disabled ? (
                <button
                  onClick={() => handleEnable(user)}
                  disabled={busy}
                  className="min-h-[46px] rounded-lg border border-cyan-600 text-cyan-800 dark:text-cyan-300 text-sm font-bold hover:bg-cyan-50 dark:hover:bg-cyan-900/30 disabled:opacity-60"
                >
                  {t.adminEnable}
                </button>
              ) : disablingUid === user.uid ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor={`reason-${user.uid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.adminDisableReason}</label>
                  <input
                    id={`reason-${user.uid}`}
                    type="text"
                    maxLength={MAX_REASON_LENGTH}
                    value={reason}
                    onChange={event => setReason(event.target.value)}
                    className="min-h-[46px] px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setDisablingUid(null); setReason(''); }}
                      disabled={busy}
                      className="flex-1 min-h-[46px] rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-bold disabled:opacity-60"
                    >
                      {t.adminCancel}
                    </button>
                    <button
                      onClick={() => handleDisable(user)}
                      disabled={busy}
                      className="flex-1 min-h-[46px] rounded-lg bg-red-700 hover:bg-red-600 text-white text-sm font-bold disabled:opacity-60"
                    >
                      {t.adminDisable}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setDisablingUid(user.uid); setReason(''); setError(''); }}
                  disabled={busy}
                  className="min-h-[46px] rounded-lg border border-red-700 dark:border-red-500 text-red-700 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-60"
                >
                  {t.adminDisable}
                </button>
              )
            )}
          </div>
        ))}

        <p className="text-sm text-slate-600 dark:text-slate-400">{t.adminDisableNote}</p>
      </div>
    </>
  );
};

export default AdminUsers;
