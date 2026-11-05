import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';
import { getAuthErrorMessage } from '../utils/authErrors';

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

const MotoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 019 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z" />
  </svg>
);

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [notice, setNotice] = useState('');
  const { login, register, loginWithGoogle, resetPassword, redirectError, clearRedirectError } = useAuth();
  const { t } = useApp();
  const currentYear = new Date().getFullYear();

  // A Google redirect that failed comes back here as a fresh page load
  useEffect(() => {
    if (!redirectError) return;
    setError(getAuthErrorMessage(redirectError, t) || '');
    clearRedirectError();
  }, [redirectError]);

  const handleGoogle = async () => {
    setError('');
    setNotice('');
    setLoading(true);
    const code = await loginWithGoogle();
    if (code) setError(getAuthErrorMessage(code, t) || '');
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!email) {
      setError(t.enterYourEmail);
      return;
    }
    setLoading(true);
    const code = await resetPassword(email);
    // Same message for unknown emails, so this form can't reveal who has an account
    if (!code || code === 'auth/user-not-found') {
      setNotice(t.resetLinkSent);
    } else {
      setError(getAuthErrorMessage(code, t) || '');
    }
    setLoading(false);
  };

  const closeReset = () => {
    setShowReset(false);
    setError('');
    setNotice('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError(t.allFieldsRequired);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
        if (!success) {
          // Signing in with Google removes an unverified password, so point people to the way back in
          setError(t.invalidLoginHint);
        }
      } else {
        success = await register(email, password);
        if (!success) {
          setError('Email is already in use or invalid.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 font-sans">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full animate-gentle-bounce animate-ring-pulse">
            <img
              src="/icons/icon-192x192.png"
              alt="MyMotoLog"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">
            MyMotoLog
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Track every ride, every service
        </p>

        {/* Auth Form */}
        <div className="animate-card-in w-full max-w-sm bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700">
          {showReset ? (
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{t.resetPasswordTitle}</h2>
          ) : (
          <>
          {/* Login/Register segmented control */}
          <div className="relative flex bg-slate-100 dark:bg-slate-700 rounded-full p-1.5 mb-6">
            <div
              className="absolute inset-y-1 left-1 right-1/2 bg-white dark:bg-slate-800 rounded-full shadow-md transition-transform duration-[250ms] ease-out"
              style={{ transform: isLogin ? 'translateX(0%)' : 'translateX(100%)' }}
            />
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              disabled={loading}
              className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${
                isLogin ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              disabled={loading}
              className={`relative z-10 flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${
                !isLogin ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.register}
            </button>
          </div>
          </>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-4 text-sm" role="alert">
              {error}
            </div>
          )}

          {notice && (
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 px-4 py-3 rounded-md mb-4 text-sm" role="status">
              {notice}
            </div>
          )}

          {showReset ? (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">{t.resetPasswordHint}</p>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/30 transition-colors"
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : t.sendResetLink}
              </button>
              <button
                type="button"
                onClick={closeReset}
                className="w-full min-h-[44px] text-sm font-semibold text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300"
              >
                {t.backToLogin}
              </button>
            </form>
          ) : (
          <>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full min-h-[48px] flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="w-5 h-5" />
            {t.continueWithGoogle}
          </button>

          <div className="flex items-center gap-3 my-5 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            {t.orDivider}
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/30 transition-colors"
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/30 transition-colors"
                placeholder="••••••••"
                disabled={loading}
                required
              />
              {isLogin && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setShowReset(true); setError(''); setNotice(''); }}
                    className="min-h-[36px] text-sm font-semibold text-cyan-700 dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed ${
                  loading ? '' : 'animate-ring-pulse'
                }`}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Register')}
              </button>
            </div>
          </form>
          </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 py-6 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} <span className="font-semibold text-slate-700 dark:text-slate-300">MyMotoLog</span>. {t.allRightsReserved}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {t.footerTagline}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.madeWith} ❤️ {t.forRiders}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;