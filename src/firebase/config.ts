// src/lib/firebase.ts (or wherever your firebase file is)

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Your existing config
const firebaseConfig = {
  projectId: "studio-4179110431-9e019",
  appId: "1:176510176005:web:d50142692159d8dfef456c",
  apiKey: "AIzaSyDcD4FIzBDtj2MssiQ18qQztCeIh9XKlVg",
  authDomain: "studio-4179110431-9e019.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "176510176005",
};

// ✅ Initialize Firebase safely (only once)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export what your app uses
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
