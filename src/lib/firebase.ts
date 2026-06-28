import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import firebaseConfigData from "../../firebase-applet-config.json";
import { useAppStore } from "../store";

const app = initializeApp(firebaseConfigData);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = async () => {
  return signOut(auth);
};

// sinkronkan Firebase user → Zustand store
onAuthStateChanged(auth, (user) => {
  useAppStore.getState().setUser(user);
});
