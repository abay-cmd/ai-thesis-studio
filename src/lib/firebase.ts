import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// We will just dynamically load it or assume it's bundled if possible. Since we can't use top-level await, let's just initialize using a standard dynamic import or just not use the config from file if not needed.
// Oh wait, I can just use an IIFE or import it as JSON?
// Let's import it directly:
import firebaseConfigData from "../../firebase-applet-config.json";

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
