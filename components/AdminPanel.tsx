import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import {
  AdminStats,
  NotificationAudience,
  NotificationSendRecord,
  describeAudience,
  formatAdminDate,
  formatAdminDateTime,
  getAdminErrorMessage,
  getAdminStats,
  getSendHistory,
} from '../utils/adminApi';
import { fillTemplate } from '../utils/roadTax';
import AdminActivity from './AdminActivity';
import AdminAnnouncements from './AdminAnnouncements';
import AdminCompose from './AdminCompose';
import AdminHistory, { getSendStatusBadge } from './AdminHistory';
import AdminTeam from './AdminTeam';
import AdminUsers from './AdminUsers';
import Spinner from './Spinner';

type AdminTab = 'home' | 'history' | 'announce' | 'team';
type AdminScreen = AdminTab | 'compose' | 'users' | 'activity';

const RECENT_SENDS = 3;
const EVERYONE: NotificationAudience = { kind: 'everyone' };

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  className: 'w-6 h-6',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const TAB_ICONS: Record<AdminTab, React.ReactNode> = {
  home: <svg {...iconProps}><path d="M3 11l9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5" /></svg>,
  history: <svg {...iconProps}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  announce: <svg {...iconProps}><path d="M3 10v4l4 1 9 5V4L7 9l-4 1zM19 9a4 4 0 010 6" /></svg>,
  team: <svg {...iconProps}><circle cx="9" cy="8" r="4" /><path d="M2 21c0-4 3-7 7-7s7 3 7 7M16 4a4 4 0 010 8M18 15c2.5 1 4 3.2 4 6" /></svg>,
};

const StatCard: React.FC<{ label: string; value: number; alert?: boolean; children?: React.ReactNode }> = ({ label, value, alert, children }) => {
  const showAlert = alert && value > 0;
  return (
    <div className={`bg-white dark:bg-slate-800 border rounded-xl px-3.5 py-3 ${showAlert ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'}`}>
      <div className={`text-xs ${showAlert ? 'text-red-800 dark:text-red-300' : 'text-slate-600 dark:text-slate-400'}`}>{label}</div>
      <div className="flex items-end justify-between gap-2">
        <div className={`text-2xl font-extrabold mt-0.5 ${showAlert ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>{value}</div>
        {children}
      </div>
    </div>
  );
};

const MenuRow: React.FC<{ label: string; hint: string; onClick: () => void }> = ({ label, hint, onClick }) => (
  <button
    onClick={onClick}
    className="w-full min-h-[52px] px-4 flex items-center justify-between gap-3 text-left text-[15px] font-semibold text-slate-800 dark:text-slate-100 border-b last:border-b-0 border-violet-100 dark:border-slate-700 hover:bg-violet-50 dark:hover:bg-slate-700/50"
  >
    {label}
    <span className="text-sm font-normal text-right text-slate-600 dark:text-slate-400">{hint} <span aria-hidden="true">›</span></span>
  </button>
);

interface AdminPanelProps {
  // Bell, settings and logout. These live in the main app, so they're passed in.
  headerActions: React.ReactNode;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ headerActions }) => {
  const { t, language } = useApp();
  const { role } = useAuth();
  const [screen, setScreen] = useState<AdminScreen>('home');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<NotificationSendRecord[] | null>(null);
  const [error, setError] = useState('');
  const [composeAudience, setComposeAudience] = useState<NotificationAudience>(EVERYONE);
  const [sentMessage, setSentMessage] = useState('');

  const isSuperadmin = role === 'superadmin';
  const roleLabel = isSuperadmin ? t.roleSuperadmin : t.roleAdmin;
  const goHome = () => setScreen('home');

  const openCompose = (audience: NotificationAudience = EVERYONE) => {
    setComposeAudience(audience);
    setScreen('compose');
  };

  const openTab = (tab: AdminTab) => {
    setSentMessage('');
    setScreen(tab);
  };

  const loadHome = useCallback(async () => {
    setError('');
    try {
      const [nextStats, history] = await Promise.all([getAdminStats(), getSendHistory()]);
      setStats(nextStats);
      setRecent(history.sends.slice(0, RECENT_SENDS));
    } catch (err) {
      console.error('Failed to load admin home:', err);
      setError(getAdminErrorMessage(err, t));
    }
  }, [t]);

  // Also reloads on coming back from another screen, where these may have changed
  useEffect(() => {
    if (screen === 'home') loadHome();
  }, [screen, loadHome]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.adminGoodMorning : hour < 19 ? t.adminGoodAfternoon : t.adminGoodEvening;
  const today = new Date().toLocaleDateString(language === 'ms' ? 'ms-MY' : 'en-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const tabs: { id: AdminTab; label: string }[] = [
    { id: 'home', label: t.adminTabHome },
    { id: 'history', label: t.adminTabHistory },
    { id: 'announce', label: t.adminTabAnnounce },
    ...(isSuperadmin ? [{ id: 'team' as const, label: t.adminTabTeam }] : []),
  ];
  const isTab = tabs.some(tab => tab.id === screen);

  const describeSend = (send: NotificationSendRecord) => {
    const audience = describeAudience(send.audience, t);
    if (send.scheduledFor && send.status === 'scheduled') {
      return `${audience} · ${formatAdminDateTime(send.scheduledFor, language)}`;
    }
    const devices = fillTemplate(t.audDevices, { count: String(send.attempted) });
    return `${audience} · ${devices} · ${formatAdminDate(send.scheduledFor ?? send.createdAt, language)}`;
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-100 dark:bg-slate-900 font-sans">
      {isTab && (
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-3xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src="/icons/icon-192x192.png" alt="" className="flex-shrink-0 w-10 h-10 rounded-full" />
              <div className="min-w-0">
                <div className="text-lg font-bold leading-tight text-slate-800 dark:text-slate-100 truncate">{t.appName}</div>
                <div className={`text-xs font-bold uppercase tracking-wide ${isSuperadmin ? 'text-violet-700 dark:text-violet-300' : 'text-cyan-700 dark:text-cyan-400'}`}>
                  {roleLabel}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">{headerActions}</div>
          </div>

          <nav aria-label={t.adminPanel} className="hidden md:block border-t border-slate-200 dark:border-slate-700">
            <div className="max-w-3xl mx-auto px-3 py-2 flex gap-2">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => openTab(id)}
                  aria-current={screen === id ? 'page' : undefined}
                  className={`min-h-[40px] px-4 rounded-lg text-sm font-semibold ${screen === id
                    ? 'bg-cyan-700 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </header>
      )}

      <main className={isTab ? 'pb-24 md:pb-8' : ''}>
        {screen === 'history' && <AdminHistory successMessage={sentMessage} />}
        {screen === 'announce' && <AdminAnnouncements />}
        {screen === 'team' && isSuperadmin && <AdminTeam />}
        {screen === 'users' && isSuperadmin && (
          <AdminUsers onBack={goHome} onSendTo={email => openCompose({ kind: 'users', emails: [email] })} />
        )}
        {screen === 'activity' && isSuperadmin && <AdminActivity onBack={goHome} />}
        {screen === 'compose' && (
          <AdminCompose
            initialAudience={composeAudience}
            onBack={goHome}
            onSent={({ people, attempted, scheduledFor }) => {
              setSentMessage(scheduledFor
                ? fillTemplate(t.histScheduledSuccess, { date: formatAdminDateTime(scheduledFor, language) })
                : fillTemplate(t.histSentSuccess, { people: String(people), devices: String(attempted) }));
              setScreen('history');
            }}
          />
        )}

        {screen === 'home' && (
          <div className="max-w-xl mx-auto p-4 flex flex-col gap-3.5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{greeting}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{today}</p>
            </div>

            <button
              onClick={() => openCompose()}
              className="min-h-[56px] rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
              </svg>
              {t.adminNewNotification}
            </button>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl p-3.5" role="alert">
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                <button onClick={loadHome} className="mt-2 min-h-[44px] px-4 rounded-lg text-sm font-bold border border-red-700 dark:border-red-500 text-red-800 dark:text-red-300">
                  {t.adminRetry}
                </button>
              </div>
            )}

            {!stats && !error && <div className="flex justify-center py-8"><Spinner size="lg" /></div>}

            {stats && (
              <div className="grid grid-cols-2 gap-2.5">
                <StatCard label={t.adminStatUsers} value={stats.users} />
                <StatCard label={t.adminStatVehicles} value={stats.vehicles} />
                <StatCard label={t.adminStatDevices} value={stats.devices} />
                <StatCard label={t.adminStatRoadTaxExpired} value={stats.roadTaxExpired} alert>
                  {stats.roadTaxExpired > 0 && (
                    <button
                      onClick={() => openCompose({ kind: 'roadTaxExpired' })}
                      className="min-h-[44px] -mb-2 -mr-1 px-1 inline-flex items-center text-sm font-semibold text-red-700 dark:text-red-300"
                    >
                      {t.adminNotifyLink} <span aria-hidden="true" className="ml-1">›</span>
                    </button>
                  )}
                </StatCard>
              </div>
            )}

            {recent && (
              <section className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.adminRecentSends}</h2>
                  <button
                    onClick={() => openTab('history')}
                    className="min-h-[44px] -my-2 px-1 text-sm font-semibold text-cyan-700 dark:text-cyan-400"
                  >
                    {t.adminViewAll}
                  </button>
                </div>
                {recent.length === 0 ? (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{t.histEmpty}</p>
                ) : (
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    {recent.map(send => {
                      const badge = getSendStatusBadge(send.status, t);
                      return (
                        <button
                          key={send.id}
                          onClick={() => openTab('history')}
                          className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left border-b last:border-b-0 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                        >
                          <span className="min-w-0 flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 break-words">{send.title}</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400 break-words">{describeSend(send)}</span>
                          </span>
                          <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
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
                    onClick={() => openTab('team')}
                  />
                  <MenuRow label={t.adminUsers} hint={t.adminUsersHint} onClick={() => setScreen('users')} />
                  <MenuRow label={t.adminActivity} hint={t.adminActivityHint} onClick={() => setScreen('activity')} />
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {isTab && (
        <nav
          aria-label={t.adminPanel}
          className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700"
        >
          <div className={`grid ${tabs.length === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => openTab(id)}
                aria-current={screen === id ? 'page' : undefined}
                className={`min-h-[60px] flex flex-col items-center justify-center gap-0.5 text-xs font-semibold ${screen === id
                  ? 'text-cyan-700 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {TAB_ICONS[id]}
                {label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default AdminPanel;
