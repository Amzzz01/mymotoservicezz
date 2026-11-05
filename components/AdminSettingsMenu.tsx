import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { ViewMode } from '../hooks/useViewMode';
import { getAuthErrorMessage } from '../utils/authErrors';

const ShieldIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
  </svg>
);

const MotorcycleIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <circle cx="5" cy="17" r="3" strokeWidth={2} />
    <circle cx="19" cy="17" r="3" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17l4-6h6l4 6M9 17h6l-2-6M14 6h3l2 5M6 8h4" />
  </svg>
);

interface AdminSettingsMenuProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenNotifications: () => void;
  onClose: () => void;
}

const AdminSettingsMenu: React.FC<AdminSettingsMenuProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenNotifications,
  onClose,
}) => {
  const { language, setLanguage, theme, toggleTheme, t } = useApp();
  const { currentUser, role, hasGoogle, connectGoogle } = useAuth();
  const [connecting, setConnecting] = React.useState(false);
  const [connectError, setConnectError] = React.useState('');

  // Password accounts have no name, so the email stands in for it
  const email = currentUser?.email ?? '';
  const name = currentUser?.displayName || email;
  const initial = name.charAt(0).toUpperCase();

  const handleConnectGoogle = async () => {
    setConnectError('');
    setConnecting(true);
    const code = await connectGoogle();
    if (code) setConnectError(getAuthErrorMessage(code, t) || '');
    setConnecting(false);
  };

  const modes: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'admin', label: t.viewAsAdmin, icon: <ShieldIcon /> },
    { id: 'rider', label: t.viewAsRider, icon: <MotorcycleIcon /> },
  ];

  const rowClass = 'px-4 min-h-[52px] flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-100';

  return (
    <>
      <div className="p-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-700 text-white font-bold flex items-center justify-center" aria-hidden="true">
          {initial}
        </div>
        <div className="min-w-0 flex-grow">
          <div className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{name}</div>
          {email !== name && <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{email}</div>}
        </div>
        <span className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-violet-700 text-white">
          {role === 'superadmin' ? t.roleSuperadmin : t.roleAdmin}
        </span>
      </div>

      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.viewAs}</h2>
        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-900">
          {modes.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={viewMode === id}
              onClick={() => { onChangeViewMode(id); onClose(); }}
              className={`min-h-[44px] rounded-lg flex items-center justify-center gap-2 text-sm font-bold ${viewMode === id
                ? 'bg-cyan-700 text-white'
                : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400">{t.viewAsHint}</p>
      </div>

      <button
        type="button"
        onClick={() => { onClose(); onOpenNotifications(); }}
        className={`${rowClass} w-full text-left hover:bg-slate-50 dark:hover:bg-slate-700/50`}
      >
        {t.prefsTitle}
        <span aria-hidden="true" className="text-slate-500 dark:text-slate-400">›</span>
      </button>

      <div className={rowClass}>
        {t.language}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900">
          {(['en', 'ms'] as const).map(option => (
            <button
              key={option}
              type="button"
              aria-pressed={language === option}
              onClick={() => setLanguage(option)}
              className={`min-w-[44px] min-h-[36px] rounded-md text-xs font-bold ${language === option
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {option === 'en' ? 'EN' : 'BM'}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={theme === 'dark'}
        onClick={toggleTheme}
        className={`${rowClass} w-full text-left hover:bg-slate-50 dark:hover:bg-slate-700/50`}
      >
        {t.darkMode}
        <span aria-hidden="true" className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-cyan-700' : 'bg-slate-500'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
        </span>
      </button>

      <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.googleAccount}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              {hasGoogle ? t.googleConnected : t.googleNotConnected}
            </div>
          </div>
          {!hasGoogle && (
            <button
              type="button"
              onClick={handleConnectGoogle}
              disabled={connecting}
              className="flex-shrink-0 min-h-[40px] px-3 rounded-lg text-sm font-bold border border-cyan-600 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 disabled:opacity-60"
            >
              {t.connect}
            </button>
          )}
        </div>
        {connectError && <p className="text-xs text-red-600 dark:text-red-400 mt-2" role="alert">{connectError}</p>}
      </div>
    </>
  );
};

export default AdminSettingsMenu;
