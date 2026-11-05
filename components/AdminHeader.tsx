import React from 'react';
import { useApp } from '../context/AppContext';

interface AdminHeaderProps {
  title: string;
  // Leave out on a main tab, which has no screen to go back to
  onBack?: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, onBack }) => {
  const { t } = useApp();

  if (!onBack) {
    return (
      <h1 className="max-w-xl mx-auto w-full px-4 pt-4 text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
    );
  }

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
    </header>
  );
};

export default AdminHeader;
