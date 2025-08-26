import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth as getAdminAuth, 
  initializeApp as initializeAdminApp, 
  getApps as getAdminApps, 
  getApp as getAdminApp, 
  ServiceAccount 
} from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

// This file is now intended for SERVER-SIDE USE ONLY.

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const adminApp = !getAdminApps().length ? initializeAdminApp({
    credential: {
        projectId: serviceAccount.projectId,
        privateKey: serviceAccount.privateKey!,
        clientEmail: serviceAccount.clientEmail!,
    },
}) : getAdminApp();

const adminDb = getAdminFirestore(adminApp);
const adminAuth = getAdminAuth(adminApp);

const firebaseConfig = {
  projectId: "campconnect-punjab",
  appId: "1:278174860045:web:47b30a9ff54267892ba644",
  storageBucket: "campconnect-punjab.firebasestorage.app",
  apiKey: "AIzaSyA-iibFePjLWKBeZlWiK6Lqgjc3TPvBPRc",
  authDomain: "campconnect-punjab.firebaseapp.com",
  messagingSenderId: "278174860045",
};

// Client-side initialization can be done in components that need it.
const getClientDb = () => {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return getFirestore(app);
};

export { adminDb, adminAuth, getClientDb, firebaseConfig };
