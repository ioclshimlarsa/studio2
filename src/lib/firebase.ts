// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "campconnect-punjab",
  "appId": "1:278174860045:web:47b30a9ff54267892ba644",
  "storageBucket": "campconnect-punjab.firebasestorage.app",
  "apiKey": "AIzaSyA-iibFePjLWKBeZlWiK6Lqgjc3TPvBPRc",
  "authDomain": "campconnect-punjab.firebaseapp.com",
  "messagingSenderId": "278174860045"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
