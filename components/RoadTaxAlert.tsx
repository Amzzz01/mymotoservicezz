import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RoadTaxAlert as RoadTaxAlertItem, describeRoadTax, vehicleLabel } from '../utils/roadTax';

interface RoadTaxAlertProps {
  alerts: RoadTaxAlertItem[];
  onRenew: (vehicleId: string) => void;
  showNotifyPrompt: boolean;
  onAllowNotify: () => void;
  onDismissNotifyPrompt: () => void;
}

const DISMISSED_KEY = 'mymotolog_roadTaxBannerDismissed';

export const ShieldAlertIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM12 8v5m0 3h.01" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Dismissing hides a banner for this session only - it comes back on the next app open.
const readDismissed = (): string[] => {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '[]');
  } catch {
    return [];
  }
};

const RoadTaxAlert: React.FC<RoadTaxAlertProps> = ({
  alerts,
  onRenew,
  showNotifyPrompt,
  onAllowNotify,
  onDismissNotifyPrompt,
}) => {
  const { t } = useApp();
  const [dismissed, setDismissed] = useState<string[]>(readDismissed);

  const alertKey = (alert: RoadTaxAlertItem) => `${alert.vehicle.id}_${alert.vehicle.roadTaxExpiry}`;
  const visible = alerts.filter(alert => !dismissed.includes(alertKey(alert)));

  const dismiss = (alert: RoadTaxAlertItem) => {
    const next = [...dismissed, alertKey(alert)];
    setDismissed(next);
    try {
      sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    } catch {
      // Ignore - it just stays dismissed until re-render from a fresh mount
    }
  };

  if (visible.length === 0 && !showNotifyPrompt) return null;

  return (
    <div className="space-y-3 mb-4">
      {visible.map(alert => {
        const expired = alert.status === 'expired';
        return (
          <div
            key={alert.vehicle.id}
            className={`flex gap-3 rounded-lg p-4 border animate-fade-in ${
              expired
                ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                : 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
            }`}
            role="alert"
          >
            <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white ${expired ? 'bg-red-600' : 'bg-amber-600'}`}>
              {expired ? <ShieldAlertIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <span className={`font-bold ${expired ? 'text-red-800 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                  {expired ? t.roadTaxExpiredTitle : t.roadTaxSoonTitle}
                </span>
                <button
                  onClick={() => dismiss(alert)}
                  className={`-mt-1 -mr-1 p-1 rounded-full ${expired ? 'text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50' : 'text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50'}`}
                  aria-label={t.dismiss}
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{vehicleLabel(alert.vehicle)}</div>
              <div className={`text-sm ${expired ? 'text-red-700 dark:text-red-300' : 'text-amber-800 dark:text-amber-300'}`}>
                {describeRoadTax(alert.vehicle.roadTaxExpiry!, t)}
              </div>
              <button
                onClick={() => onRenew(alert.vehicle.id)}
                className={`mt-2 min-h-[40px] px-4 rounded-md text-sm font-bold transition-colors ${
                  expired
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-white dark:bg-slate-800 border border-amber-600 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-slate-700'
                }`}
              >
                {expired ? t.renewNow : t.renew}
              </button>
            </div>
          </div>
        );
      })}

      {showNotifyPrompt && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-4">
          <div className="flex gap-3 items-center">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <BellIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-800 dark:text-slate-100">{t.notifyPromptTitle}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t.notifyPromptBody}</div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={onDismissNotifyPrompt}
              className="min-h-[44px] px-4 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
            >
              {t.notNow}
            </button>
            <button
              onClick={onAllowNotify}
              className="min-h-[44px] px-5 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400"
            >
              {t.allow}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadTaxAlert;
