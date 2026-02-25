import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';

export const loginWithFirebase = async (email: string, pass: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth not initialized');
  return await signInWithEmailAndPassword(auth, email, pass);
};

export const registerWithFirebase = async (email: string, pass: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth not initialized');
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const logoutFromFirebase = async () => {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  const auth = getFirebaseAuth();
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};
