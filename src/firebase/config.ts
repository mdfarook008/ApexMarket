import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDEYaI9DwqXwn7AwVXNGIz3ybjyV7ymzwk",
  authDomain: "apexmarket-8d3da.firebaseapp.com",
  projectId: "apexmarket-8d3da",
  storageBucket: "apexmarket-8d3da.firebasestorage.app",
  messagingSenderId: "431808164090",
  appId: "1:431808164090:web:244d10430d9f55ae481943",
  measurementId: "G-CFYVZRKFV0"
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

// Firebase is optional for local demos. Do not initialize it with empty
// placeholder values, because that can crash the React bundle on startup.
const app = isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

export default app;
