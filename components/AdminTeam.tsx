import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import {
  AdminUserDetails,
  AdminUserSummary,
  formatAdminDate,
  formatProviders,
  getAdminErrorMessage,
  listAdmins,
  searchUsers,
  setAdminRole,
} from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import AdminHeader from './AdminHeader';
import Spinner from './Spinner';

const AdminTeam: React.FC = () => {
  const { t, language } = useApp();
  const { currentUser } = useAuth();
  const [team, setTeam] = useState<AdminUserSummary[] | null>(null);
  const [email, setEmail] = useState('');
  const [found, setFound] = useState<AdminUserDetails | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadTeam = useCallback(async () => {
    try {
      setTeam(await listAdmins());
    } catch (err) {
      console.error('Failed to load admins:', err);
      setError(getAdminErrorMessage(err, t));
    }
  }, [t]);

  useEffect(() => {
    loadTeam();
  }, [loadTeam]);

  // Runs a server action with the shared busy, error and reset handling
  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await action();
    } catch (err) {
      console.error('Admin action failed:', err);
      setError(getAdminErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  const handleFind = (event: React.FormEvent) => {
    event.preventDefault();
    const wanted = email.trim().toLowerCase();
    if (!wanted) return;
    setFound(null);
    setNotFound(false);
    run(async () => {
      // Making someone an admin needs their full email, so a partial match isn't enough here
      const { users } = await searchUsers(wanted);
      const match = users.find(user => user.email.toLowerCase() === wanted) ?? null;
      setFound(match);
      setNotFound(!match);
    });
  };

  const handleMakeAdmin = (user: AdminUserDetails) => {
    if (!window.confirm(fillTemplate(t.adminConfirmMake, { email: user.email }))) return;
    run(async () => {
      await setAdminRole(user.uid, true);
      setFound(null);
      setEmail('');
      setSuccess(fillTemplate(t.adminMadeSuccess, { email: user.email }));
      await loadTeam();
    });
  };

  const handleRemove = (user: AdminUserSummary) => {
    if (!window.confirm(fillTemplate(t.adminConfirmRemove, { email: user.email }))) return;
    run(async () => {
      await setAdminRole(user.uid, false);
      setSuccess(fillTemplate(t.adminRemovedSuccess, { email: user.email }));
      await loadTeam();
    });
  };

  return (
    <>
      <AdminHeader title={t.adminManageTeam} />
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-3">
        <form onSubmit={handleFind} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col gap-2">
          <label htmlFor="admin-email" className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.adminAddTitle}</label>
          <div className="flex gap-2">
            <input
              id="admin-email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="flex-grow min-w-0 min-h-[46px] px-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100"
            />
            <button type="submit" disabled={busy || !email.trim()} className="min-h-[46px] px-3.5 rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-sm font-bold disabled:opacity-60">
              {t.adminFind}
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.adminAddHint}</p>
          {notFound && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{t.adminErrUserNotFound}</p>}
        </form>

        {found && (
          <div className="bg-violet-50 dark:bg-slate-800 border border-violet-300 dark:border-violet-700 rounded-xl p-3.5 flex flex-col gap-2.5" role="status">
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold text-slate-800 dark:text-slate-100 break-all">{found.email}</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {fillTemplate(t.adminJoinedVia, { date: formatAdminDate(found.joinedAt, language), methods: formatProviders(found.providers, t) })}
              </span>
              <span className={`text-sm font-semibold ${found.emailVerified ? 'text-green-800 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {found.emailVerified ? t.adminEmailVerified : t.adminErrNotVerified}
              </span>
            </div>
            {found.role !== 'user' ? (
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.adminErrAlreadyAdmin}</p>
            ) : (
              <button
                onClick={() => handleMakeAdmin(found)}
                disabled={busy || !found.emailVerified || found.disabled}
                className="min-h-[46px] rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-sm font-bold disabled:opacity-60"
              >
                {t.adminMake}
              </button>
            )}
          </div>
        )}

        {error && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{error}</p>}
        {success && <p className="text-sm font-semibold text-green-800 dark:text-green-400" role="status">{success}</p>}

        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.adminCurrentTeam}</h2>
        {team === null && !error && <div className="flex justify-center py-6"><Spinner /></div>}
        {team && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            {team.map(user => (
              <div key={user.uid} className="px-3.5 py-3 flex items-center gap-2.5 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
                <div className="flex-grow min-w-0 flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 break-all">{user.email}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {user.uid === currentUser?.uid
                      ? t.adminYou
                      : user.roleAddedAt
                        ? fillTemplate(t.adminAddedOn, { date: formatAdminDate(user.roleAddedAt, language) })
                        : ''}
                  </span>
                </div>
                {user.role === 'superadmin' ? (
                  <span className="flex-shrink-0 text-xs font-bold text-white bg-violet-700 px-2.5 py-1 rounded-full">{t.roleSuperadmin}</span>
                ) : (
                  <button
                    onClick={() => handleRemove(user)}
                    disabled={busy}
                    className="flex-shrink-0 min-h-[44px] px-3 rounded-lg border border-red-700 dark:border-red-500 text-red-700 dark:text-red-400 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-60"
                  >
                    {t.adminRemove}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.adminTeamNote}</p>
      </div>
    </>
  );
};

export default AdminTeam;
