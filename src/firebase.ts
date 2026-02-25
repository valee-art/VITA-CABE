import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'vitacabe-5f0a6',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Lazy initialization to prevent crash if config is missing
let app: any;
let db: any = null;
let auth: any = null;

const getOrInitApp = () => {
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseDB = () => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn('Firebase API Key is missing. Please set VITE_FIREBASE_API_KEY in environment variables.');
    return null;
  }

  if (!db) {
    db = getFirestore(getOrInitApp());
  }
  return db;
};

export const getFirebaseAuth = () => {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    console.warn('Firebase API Key is missing. Please set VITE_FIREBASE_API_KEY in environment variables.');
    return null;
  }

  if (!auth) {
    auth = getAuth(getOrInitApp());
  }
  return auth;
};
