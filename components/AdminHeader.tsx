import React from 'react';
import { useApp } from '../context/AppContext';

interface AdminHeaderProps {
  title: string;
  onBack: () => void;
  badge?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, onBack, badge }) => {
  const { t } = useApp();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 px-2 py-2.5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <button
        onClick={onBack}
        aria-label={t.adminBack}
        className="w-11 h-11 flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="flex-grow text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h1>
      {badge && (
        <span className="mr-2 text-xs font-bold text-white bg-violet-700 px-2.5 py-1 rounded-full">{badge}</span>
      )}
    </header>
  );
};

export default AdminHeader;
