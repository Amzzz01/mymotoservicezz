import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// The live site serves Firebase's sign-in helper from its own domain (see the /__/auth rewrite in
// vercel.json). Redirect sign-in needs this on phones, because browsers block the third-party storage
// it would otherwise use. Everywhere else (localhost, previews) falls back to the default auth domain.
const AUTH_PROXY_HOST = 'mymotoservicezz.vercel.app';
export const usesAuthProxy = window.location.hostname === AUTH_PROXY_HOST;

// Your web app's Firebase configuration
// These values come from environment variables (set in Vercel and .env.local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: usesAuthProxy ? AUTH_PROXY_HOST : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
