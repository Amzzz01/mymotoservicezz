import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApp } from '../context/AppContext';

const MotoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.586 4H5.414A2.914 2.914 0 002.5 6.914v1.072A8.004 8.004 0 004 12.5v4.619a1 1 0 001.32.949l3.41-1.364A1 1 0 019 17.76V16h6v1.76a1 1 0 01-.27.648l-3.41 1.364a1 1 0 00-1.32.95V22h2a1 1 0 001-1v-1.115a8.04 8.04 0 003-3.033V15a1 1 0 00-1-1h-1v-1.5a8.004 8.004 0 001.5-4.514V6.914A2.914 2.914 0 0018.586 4zM8 12c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 0c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"/>
  </svg>
);

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { t } = useApp();
  const currentYear = new Date().getFullYear();

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
          setError('Invalid email or password.');
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
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 font-sans">
        {/* Logo and Title */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          <MotoIcon className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-500 dark:text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 tracking-wider">
            MyMotoLog
          </h1>
        </div>

        {/* Auth Form */}
        <div className="w-full max-w-sm bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">
            {isLogin ? 'Log In' : 'Register'}
          </h2>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          
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
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
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
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Register')}
              </button>
            </div>
          </form>
          
          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 ml-1"
              disabled={loading}
            >
              {isLogin ? 'Register' : 'Log In'}
            </button>
          </p>
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