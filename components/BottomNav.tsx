import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';

export type MainTab = 'overview' | 'analytics' | 'mileage' | 'reminders';
export type QuickAction = 'addRecord' | 'scanReceipt' | 'addMileage' | 'addReminder';

interface BottomNavProps {
  activeTab: MainTab | 'history';
  onTabChange: (tab: MainTab) => void;
  reminderCount: number;
  onQuickAction: (action: QuickAction) => void;
}

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const GaugeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a8 8 0 1116 0" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16l3.5-4.5" />
    <circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const OutlineBellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const NAV_ITEMS: { tab: MainTab; Icon: React.FC<{ className?: string }> }[] = [
  { tab: 'overview', Icon: HomeIcon },
  { tab: 'analytics', Icon: ChartIcon },
  { tab: 'mileage', Icon: GaugeIcon },
  { tab: 'reminders', Icon: OutlineBellIcon },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, reminderCount, onQuickAction }) => {
  const { t } = useApp();
  const [showSheet, setShowSheet] = useState(false);

  const tabLabel: Record<MainTab, string> = {
    overview: t.overview,
    analytics: t.analytics || 'Analytics',
    mileage: t.mileage || 'Mileage',
    reminders: t.reminders,
  };

  const handleQuickAction = (action: QuickAction) => {
    setShowSheet(false);
    onQuickAction(action);
  };

  const renderNavItem = ({ tab, Icon }: (typeof NAV_ITEMS)[number]) => {
    const isActive = activeTab === tab;
    return (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`relative flex flex-col items-center justify-center gap-0.5 min-h-[44px] py-1.5 text-xs font-medium transition-colors ${
          isActive
            ? 'text-cyan-600 dark:text-cyan-400'
            : 'text-slate-500 dark:text-slate-400'
        }`}
        aria-label={tabLabel[tab]}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="w-5 h-5" />
        <span className="truncate max-w-full">{tabLabel[tab]}</span>
        {tab === 'reminders' && reminderCount > 0 && (
          <span className="absolute top-0 right-1/4 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full font-bold">
            {reminderCount}
          </span>
        )}
      </button>
    );
  };

  return createPortal(
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="relative grid grid-cols-[1fr_1fr_44px_1fr_1fr] max-w-3xl mx-auto px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.slice(0, 2).map(renderNavItem)}
        {/* Dedicated empty spacer column, sized to match the FAB, so Analytics/Mileage don't crowd it */}
        <div aria-hidden="true" />
        {NAV_ITEMS.slice(2).map(renderNavItem)}

        {/* Center FAB, overlapping the top of the bar, centered above the spacer column */}
        <button
          onClick={() => setShowSheet(true)}
          style={{ top: '-16px' }}
          className="absolute left-1/2 -translate-x-1/2 w-14 h-14 min-h-[44px] min-w-[44px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/30 ring-4 ring-white dark:ring-slate-800 flex items-center justify-center transition-transform active:scale-95"
          aria-label="Quick actions"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      </div>

      {/* Quick action sheet */}
      {showSheet && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 animate-fade-in"
            onClick={() => setShowSheet(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center p-0 sm:p-4 sm:items-end sm:justify-center">
            <div className="bg-white dark:bg-slate-800 w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up overflow-hidden pb-[env(safe-area-inset-bottom)]">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Quick actions</h3>
                <button
                  onClick={() => setShowSheet(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label={t.cancel}
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <button
                  onClick={() => handleQuickAction('addRecord')}
                  className="w-full flex items-center gap-4 bg-cyan-50 dark:bg-cyan-900/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 text-slate-800 dark:text-slate-100 font-semibold p-4 rounded-xl transition-colors min-h-[44px]"
                >
                  <span className="bg-cyan-500 text-white p-2.5 rounded-lg"><PlusIcon className="w-5 h-5" /></span>
                  {t.addRecord}
                </button>
                <button
                  onClick={() => handleQuickAction('scanReceipt')}
                  className="w-full flex items-center gap-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-slate-800 dark:text-slate-100 font-semibold p-4 rounded-xl transition-colors min-h-[44px]"
                >
                  <span className="bg-blue-500 text-white p-2.5 rounded-lg"><CameraIcon className="w-5 h-5" /></span>
                  {t.scanReceipt}
                </button>
                <button
                  onClick={() => handleQuickAction('addMileage')}
                  className="w-full flex items-center gap-4 bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-slate-800 dark:text-slate-100 font-semibold p-4 rounded-xl transition-colors min-h-[44px]"
                >
                  <span className="bg-amber-500 text-white p-2.5 rounded-lg"><GaugeIcon className="w-5 h-5" /></span>
                  {t.addMileageLog}
                </button>
                <button
                  onClick={() => handleQuickAction('addReminder')}
                  className="w-full flex items-center gap-4 bg-violet-50 dark:bg-violet-900/30 hover:bg-violet-100 dark:hover:bg-violet-900/50 text-slate-800 dark:text-slate-100 font-semibold p-4 rounded-xl transition-colors min-h-[44px]"
                >
                  <span className="bg-violet-500 text-white p-2.5 rounded-lg"><BellIcon className="w-5 h-5" /></span>
                  {t.addReminder}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>,
    document.body
  );
};

export default BottomNav;
