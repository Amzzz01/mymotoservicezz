import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';
import { fillTemplate } from '../utils/roadTax';

const DISMISSED_KEY = 'mymotolog_verifyEmailDismissed';

const readDismissed = (): boolean => {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    return false;
  }
};

// A reminder only: the app stays fully usable without a verified email.
const EmailVerifyBanner: React.FC = () => {
  const { currentUser, emailVerified, sendVerification, refreshUser } = useAuth();
  const { t } = useApp();
  const [dismissed, setDismissed] = useState(readDismissed);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  if (!currentUser || emailVerified || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Ignore - it just comes back if the page reloads
    }
  };

  const handleSend = async () => {
    setBusy(true);
    const code = await sendVerification();
    setMessage(!code ? t.verifyLinkSent : code === 'auth/too-many-requests' ? t.tooManyAttempts : t.verifyEmailFailed);
    setBusy(false);
  };

  const handleCheck = async () => {
    setBusy(true);
    const verified = await refreshUser();
    // Once verified this banner unmounts by itself, so only the failure needs a message
    if (!verified) setMessage(t.notVerifiedYet);
    setBusy(false);
  };

  return (
    <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-300 dark:border-cyan-700 rounded-lg p-4 mb-4 animate-fade-in" role="status">
      <div className="flex items-start justify-between gap-2">
        <span className="font-bold text-cyan-900 dark:text-cyan-200">{t.verifyEmailTitle}</span>
        <button
          onClick={dismiss}
          className="-mt-1 -mr-1 p-1 rounded-full text-cyan-800 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/50"
          aria-label={t.dismiss}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 break-words">
        {fillTemplate(t.verifyEmailBody, { email: currentUser.email || '' })}
      </p>
      {message && <p className="text-sm font-medium text-cyan-900 dark:text-cyan-200 mt-2">{message}</p>}
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={handleSend}
          disabled={busy}
          className="min-h-[40px] px-4 rounded-md text-sm font-bold text-white bg-cyan-700 hover:bg-cyan-600 disabled:opacity-60"
        >
          {t.sendVerifyLink}
        </button>
        <button
          onClick={handleCheck}
          disabled={busy}
          className="min-h-[40px] px-4 rounded-md text-sm font-bold border border-cyan-700 dark:border-cyan-400 text-cyan-800 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 disabled:opacity-60"
        >
          {t.iveVerified}
        </button>
      </div>
    </div>
  );
};

export default EmailVerifyBanner;
