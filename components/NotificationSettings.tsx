import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationPrefKey, NotificationPrefs } from '../hooks/useNotificationPrefs';
import AdminHeader from './AdminHeader';

interface NotificationSettingsProps {
  permission: NotificationPermission | 'unsupported';
  onRequestPermission: () => void;
  prefs: NotificationPrefs;
  onChangePref: (key: NotificationPrefKey, value: boolean) => Promise<void>;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  permission,
  onRequestPermission,
  prefs,
  onChangePref,
  onClose,
}) => {
  const { t } = useApp();
  const [error, setError] = useState('');

  const handleChange = async (key: NotificationPrefKey, value: boolean) => {
    setError('');
    try {
      await onChangePref(key, value);
    } catch (err) {
      console.error('Failed to save notification setting:', err);
      setError(t.prefsSaveError);
    }
  };

  const rows: { key: NotificationPrefKey; label: string; hint: string }[] = [
    { key: 'roadTax', label: t.prefsRoadTax, hint: t.prefsRoadTaxHint },
    { key: 'tip', label: t.notifTypeTip, hint: t.prefsTipHint },
    { key: 'update', label: t.notifTypeUpdate, hint: t.prefsUpdateHint },
    { key: 'promotion', label: t.notifTypePromotion, hint: t.prefsPromotionHint },
  ];

  const deviceMessage = {
    granted: t.prefsDeviceOn,
    default: t.prefsDeviceOff,
    denied: t.prefsDeviceBlocked,
    unsupported: t.prefsDeviceUnsupported,
  }[permission];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100 dark:bg-slate-900 font-sans">
      <AdminHeader title={t.prefsTitle} onBack={onClose} />
      <div className="max-w-xl mx-auto p-4 flex flex-col gap-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.prefsDeviceHeading}</h2>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 flex flex-col gap-2.5">
          <p className={`text-sm ${permission === 'granted' ? 'font-semibold text-green-800 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
            {deviceMessage}
          </p>
          {permission === 'default' && (
            <button
              onClick={onRequestPermission}
              className="min-h-[46px] rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-bold"
            >
              {t.prefsTurnOn}
            </button>
          )}
        </div>

        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mt-1">{t.prefsTypesHeading}</h2>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          {rows.map(({ key, label, hint }) => (
            <label key={key} className="min-h-[64px] px-3.5 py-2.5 flex items-center gap-3 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
              <span className="flex-grow flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-slate-800 dark:text-slate-100">{label}</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">{hint}</span>
              </span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={event => handleChange(key, event.target.checked)}
                className="flex-shrink-0 w-[22px] h-[22px] accent-cyan-600"
              />
            </label>
          ))}
        </div>

        {error && <p className="text-sm font-semibold text-red-700 dark:text-red-400" role="alert">{error}</p>}
        <p className="text-sm text-slate-600 dark:text-slate-400">{t.prefsNote}</p>
      </div>
    </div>
  );
};

export default NotificationSettings;
