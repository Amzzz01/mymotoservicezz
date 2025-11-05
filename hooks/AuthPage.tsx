import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required.');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 font-sans">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
          <MotoIcon className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 tracking-wider">
            MyMotoLog
          </h1>
        </div>

        <div className="w-full max-w-sm bg-slate-800 p-6 sm:p-8 rounded-lg shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-100 mb-6">
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        autoComplete="email"
                        placeholder="you@example.com"
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        placeholder="••••••••"
                        disabled={loading}
                    />
                    {!isLogin && (
                      <p className="text-xs text-slate-400 mt-1">Must be at least 6 characters</p>
                    )}
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2 px-4 rounded-md shadow-md shadow-cyan-500/20 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Register')}
                    </button>
                </div>
            </form>
            <p className="text-center text-sm text-slate-400 mt-6">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                  className="font-medium text-cyan-400 hover:text-cyan-300 ml-1"
                  disabled={loading}
                >
                    {isLogin ? 'Register' : 'Log In'}
                </button>
            </p>
        </div>
         <footer className="text-center p-4 text-slate-500 text-sm mt-8">
            <p>Built for the ride.</p>
        </footer>
    </div>
  );
};

export default AuthPage;
