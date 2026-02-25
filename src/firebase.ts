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

console.log("Firebase Key:", firebaseConfig.apiKey);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };

// Getter functions for backward compatibility
export const getFirebaseDB = () => db;
export const getFirebaseAuth = () => auth;
