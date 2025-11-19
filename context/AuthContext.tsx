import React, { createContext, ReactNode, useState, useEffect, useRef } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

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

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        resetTimer();
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
    <AuthContext.Provider value={{ currentUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};