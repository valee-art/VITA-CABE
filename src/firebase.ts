import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB09836dSnWnE5gMlZcn-82n6cZjl_5Zc8',
  authDomain: 'vitacabe-5f0a6.firebaseapp.com',
  projectId: 'vitacabe-5f0a6',
  storageBucket: 'vitacabe-5f0a6.appspot.com',
  messagingSenderId: '103263922213',
  appId: '1:103263922213:web:f9ebfd2cc934a18e2077cc',
  measurementId: 'G-QFJ6EN2QST'
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
  if (!db) {
    db = getFirestore(getOrInitApp());
  }
  return db;
};

export const getFirebaseAuth = () => {
  if (!auth) {
    auth = getAuth(getOrInitApp());
  }
  return auth;
};
