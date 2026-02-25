import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDB } from '../firebase';
import { UserProfile, UserRole } from '../types';

export const loginWithFirebase = async (email: string, pass: string) => {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth not initialized');
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  
  // Fetch profile
  const profile = await getUserProfile(userCredential.user.uid);
  return { user: userCredential.user, profile };
};

export const registerWithFirebase = async (email: string, pass: string, role: UserRole = 'user', displayName?: string) => {
  const auth = getFirebaseAuth();
  const db = getFirebaseDB();
  if (!auth || !db) throw new Error('Firebase not initialized');
  
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  // Auto-assign admin for specific emails
  let finalRole = role;
  if (email.toLowerCase().includes('vale') || email.toLowerCase().includes('selvia')) {
    finalRole = 'admin';
  }

  // Create profile in Firestore
  const profile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    role: finalRole,
    displayName: displayName || email.split('@')[0]
  };

  await setDoc(doc(db, 'users', user.uid), profile);
  return { user, profile };
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const db = getFirebaseDB();
  if (!db) return null;
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const logoutFromFirebase = async () => {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null, profile: UserProfile | null) => void) => {
  const auth = getFirebaseAuth();
  if (!auth) return () => {};
  
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      callback(user, profile);
    } else {
      callback(null, null);
    }
  });
};
