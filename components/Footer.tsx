import React from 'react';
import { useApp } from '../context/AppContext';

const Footer: React.FC = () => {
  const { t } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 mt-8 transition-colors duration-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} <span className="font-semibold text-slate-700 dark:text-slate-300">MyMotoLog</span>. {t.allRightsReserved}
            </p>
          </div>

          {/* Center: Tagline */}
          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400 italic">
              {t.footerTagline}
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>{t.madeWith} ❤️ {t.forRiders}</span>
          </div>
        </div>

        {/* Bottom: Additional Info (Mobile-optimized) */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            {t.footerDisclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;