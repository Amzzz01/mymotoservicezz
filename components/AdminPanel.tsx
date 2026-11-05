import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { AdminStats, getAdminErrorMessage, getAdminStats } from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import AdminActivity from './AdminActivity';
import AdminHeader from './AdminHeader';
import AdminTeam from './AdminTeam';
import AdminUsers from './AdminUsers';
import Spinner from './Spinner';

type AdminScreen = 'home' | 'team' | 'users' | 'activity';

const StatCard: React.FC<{ label: string; value: number; alert?: boolean }> = ({ label, value, alert }) => (
  <div className={`bg-white dark:bg-slate-800 border rounded-xl px-3.5 py-3 ${alert && value > 0 ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'}`}>
    <div className={`text-xs ${alert && value > 0 ? 'text-red-800 dark:text-red-300' : 'text-slate-600 dark:text-slate-400'}`}>{label}</div>
    <div className={`text-2xl font-extrabold mt-0.5 ${alert && value > 0 ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>{value}</div>
  </div>
);

const MenuRow: React.FC<{ label: string; hint: string; onClick: () => void }> = ({ label, hint, onClick }) => (
  <button
    onClick={onClick}
    className="w-full min-h-[52px] px-4 flex items-center justify-between gap-3 text-left text-[15px] font-semibold text-slate-800 dark:text-slate-100 border-b last:border-b-0 border-violet-100 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-700/50"
  >
    {label}
    <span className="text-sm font-normal text-slate-600 dark:text-slate-400">{hint}</span>
  </button>
);

const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useApp();
  const { role } = useAuth();
  const [screen, setScreen] = useState<AdminScreen>('home');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');

  const isSuperadmin = role === 'superadmin';
  const goHome = () => setScreen('home');

  const loadStats = useCallback(async () => {
    setError('');
    try {
      setStats(await getAdminStats());
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError(getAdminErrorMessage(err, t));
    }
  }, [t]);

  // Also reloads on coming back from a sub-screen, where the admin count may have changed
  useEffect(() => {
    if (screen === 'home') loadStats();
  }, [screen, loadStats]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 dark:bg-slate-900 font-sans">
      {screen === 'team' && isSuperadmin && <AdminTeam onBack={goHome} />}
      {screen === 'users' && isSuperadmin && <AdminUsers onBack={goHome} />}
      {screen === 'activity' && isSuperadmin && <AdminActivity onBack={goHome} />}

      {screen === 'home' && (
        <>
          <AdminHeader
            title={t.adminPanel}
            onBack={onClose}
            badge={isSuperadmin ? t.roleSuperadmin : t.roleAdmin}
          />
          <div className="max-w-xl mx-auto p-4 flex flex-col gap-3.5">
            {error && (
              <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl p-3.5" role="alert">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                <button onClick={loadStats} className="mt-2 min-h-[44px] px-4 rounded-lg text-sm font-bold border border-red-700 text-red-800 dark:text-red-300">
                  {t.adminRetry}
                </button>
              </div>
            )}

            {!stats && !error && (
              <div className="flex justify-center py-8"><Spinner size="lg" /></div>
            )}

            {stats && (
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard label={t.adminStatUsers} value={stats.users} />
                <StatCard label={t.adminStatVehicles} value={stats.vehicles} />
                <StatCard label={t.adminStatDevices} value={stats.devices} />
                <StatCard label={t.adminStatRoadTaxExpired} value={stats.roadTaxExpired} alert />
              </div>
            )}

            {isSuperadmin && (
              <>
                <h2 className="text-xs font-bold uppercase tracking-wider text-violet-800 dark:text-violet-300 mt-0.5">
                  {t.adminSuperadminOnly}
                </h2>
                <div className="bg-white dark:bg-slate-800 border border-violet-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <MenuRow
                    label={t.adminManageTeam}
                    hint={stats?.admins != null ? fillTemplate(t.adminCountHint, { count: String(stats.admins) }) : ''}
                    onClick={() => setScreen('team')}
                  />
                  <MenuRow label={t.adminUsers} hint={t.adminUsersHint} onClick={() => setScreen('users')} />
                  <MenuRow label={t.adminActivity} hint={t.adminActivityHint} onClick={() => setScreen('activity')} />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
