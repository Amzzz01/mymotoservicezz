import React, { createContext, ReactNode, useState, useEffect, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  linkWithPopup,
  linkWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, usesAuthProxy } from '../firebase';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  // These return a Firebase error code, or null on success
  loginWithGoogle: () => Promise<string | null>;
  connectGoogle: () => Promise<string | null>;
  resetPassword: (email: string) => Promise<string | null>;
  sendVerification: () => Promise<string | null>;
  // Re-reads the account from Firebase; resolves to whether the email is verified now
  refreshUser: () => Promise<boolean>;
  emailVerified: boolean;
  hasGoogle: boolean;
  // A failure from a Google redirect, which only surfaces after the page loads again
  redirectError: string | null;
  clearRedirectError: () => void;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Popups are unreliable on phones and in the installed app, so those use a full-page redirect.
// Redirect only works with the sign-in helper on our own domain (see firebase.ts).
const shouldUseRedirect = () =>
  usesAuthProxy && (
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.matchMedia('(display-mode: standalone)').matches
  );

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Session timeout configuration (in milliseconds)
const SESSION_TIMEOUT = 15 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before timeout
const ACTIVITY_THRESHOLD = 60 * 1000; // 1 minute - minimum time between timer resets

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [hasGoogle, setHasGoogle] = useState(false);
  const [redirectError, setRedirectError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset the session timer
  const resetTimer = () => {
    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Only set timers if user is logged in
    if (currentUser) {
      // Set warning timer (5 minutes before logout)
      warningTimeoutRef.current = setTimeout(() => {
        const timeLeft = Math.ceil((SESSION_TIMEOUT - WARNING_TIME) / 1000 / 60);
        const shouldContinue = window.confirm(
          `Your session will expire in ${timeLeft} minutes due to inactivity. Click OK to stay logged in.`
        );
        
        if (shouldContinue) {
          resetTimer();
        }
      }, SESSION_TIMEOUT - WARNING_TIME);

      // Set logout timer
      timeoutRef.current = setTimeout(async () => {
        alert('Your session has expired due to inactivity. Please log in again.');
        await logout();
      }, SESSION_TIMEOUT);
    }
  };

  // Activity tracking effect
  useEffect(() => {
    if (!currentUser) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      // Only reset if more than ACTIVITY_THRESHOLD has passed since last activity
      if (timeSinceLastActivity > ACTIVITY_THRESHOLD) {
        resetTimer();
      }
    };

    // Add event listeners for user activity
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Initialize timer on mount
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [currentUser]);

  // The user object is mutated in place by Firebase, so these copies are what trigger re-renders
  const syncAccountInfo = (user: FirebaseUser | null) => {
    setEmailVerified(Boolean(user?.emailVerified));
    setHasGoogle(Boolean(user?.providerData.some(p => p.providerId === GoogleAuthProvider.PROVIDER_ID)));
  };

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      syncAccountInfo(user);
      setLoading(false);

      if (user) {
        resetTimer();
      }
    });

    // Finish a Google sign-in or connect that came back from a redirect
    getRedirectResult(auth)
      .then(result => {
        if (result) syncAccountInfo(result.user);
      })
      .catch((error: any) => {
        console.error('Google redirect error:', error);
        setRedirectError(error.code || 'auth/unknown');
      });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const refreshUser = async (): Promise<boolean> => {
    const user = auth.currentUser;
    if (!user) return false;
    try {
      await user.reload();
    } catch (error) {
      console.error('Failed to refresh account:', error);
    }
    syncAccountInfo(auth.currentUser);
    return Boolean(auth.currentUser?.emailVerified);
  };

  // Notice a verified email as soon as the user comes back from tapping the link in their mail app
  useEffect(() => {
    if (!currentUser || emailVerified) return;
    const handleVisible = () => {
      if (document.visibilityState === 'visible') refreshUser();
    };
    document.addEventListener('visibilitychange', handleVisible);
    return () => document.removeEventListener('visibilitychange', handleVisible);
  }, [currentUser, emailVerified]);

  const loginWithGoogle = async (): Promise<string | null> => {
    try {
      if (shouldUseRedirect()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      return null;
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      return error.code || 'auth/unknown';
    }
  };

  const connectGoogle = async (): Promise<string | null> => {
    const user = auth.currentUser;
    if (!user) return 'auth/unknown';
    try {
      if (shouldUseRedirect()) {
        await linkWithRedirect(user, googleProvider);
      } else {
        await linkWithPopup(user, googleProvider);
        await refreshUser();
      }
      return null;
    } catch (error: any) {
      console.error('Connect Google error:', error);
      return error.code || 'auth/unknown';
    }
  };

  const resetPassword = async (email: string): Promise<string | null> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return null;
    } catch (error: any) {
      console.error('Password reset error:', error);
      return error.code || 'auth/unknown';
    }
  };

  const sendVerification = async (): Promise<string | null> => {
    if (!auth.currentUser) return 'auth/unknown';
    try {
      await sendEmailVerification(auth.currentUser);
      return null;
    } catch (error: any) {
      console.error('Verification email error:', error);
      return error.code || 'auth/unknown';
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Best effort: the account is fine without it, and the Home reminder can send it again
      sendEmailVerification(user).catch(error => console.error('Verification email error:', error));
      resetTimer();
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      resetTimer();
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Clear all timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      register,
      logout,
      loading,
      loginWithGoogle,
      connectGoogle,
      resetPassword,
      sendVerification,
      refreshUser,
      emailVerified,
      hasGoogle,
      redirectError,
      clearRedirectError: () => setRedirectError(null),
    }}>
      {children}
    </AuthContext.Provider>
  );
};