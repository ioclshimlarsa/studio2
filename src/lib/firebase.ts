// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  projectId: "campconnect-punjab",
  appId: "1:278174860045:web:47b30a9ff54267892ba644",
  storageBucket: "campconnect-punjab.firebasestorage.app",
  apiKey: "AIzaSyA-iibFePjLWKBeZlWiK6Lqgjc3TPvBPRc",
  authDomain: "campconnect-punjab.firebaseapp.com",
  messagingSenderId: "278174860045",
};

// Add server-side specific credentials if they exist (for Vercel, etc.)
if (typeof window === "undefined" && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        firebaseConfig.serviceAccountId = serviceAccount.client_email;
    } catch (e) {
        console.warn("Could not parse GOOGLE_APPLICATION_CREDENTIALS. Server-side authentication may fail.");
    }
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
