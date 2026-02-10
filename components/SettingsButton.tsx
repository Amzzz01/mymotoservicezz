import React from 'react';
import { useApp } from '../context/AppContext';

const SettingsButton: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, t } = useApp();
  const [showMenu, setShowMenu] = React.useState(false);

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
        aria-label={t.settings}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-slate-700 dark:text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-sm font-medium hidden md:block text-slate-700 dark:text-slate-300">
          {t.settings}
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setShowMenu(false)}
          />

          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
            {/* Theme Toggle */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {theme === 'dark' ? t.darkMode : t.lightMode}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                {theme === 'dark' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{t.lightMode}</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span>{t.darkMode}</span>
                  </>
                )}
              </button>
            </div>

            {/* Language Toggle */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t.language}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  {language === 'en' ? 'English' : 'Bahasa Melayu'}
                </span>
              </div>
              <button
                onClick={handleLanguageToggle}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>{language === 'en' ? 'Bahasa Melayu' : 'English'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsButton;
