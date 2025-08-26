// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAuth as getAdminAuth, initializeApp as initializeAdminApp, getApps as getAdminApps, getApp as getAdminApp, ServiceAccount } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  projectId: "campconnect-punjab",
  appId: "1:278174860045:web:47b30a9ff54267892ba644",
  storageBucket: "campconnect-punjab.firebasestorage.app",
  apiKey: "AIzaSyA-iibFePjLWKBeZlWiK6Lqgjc3TPvBPRc",
  authDomain: "campconnect-punjab.firebaseapp.com",
  messagingSenderId: "278174860045",
};

// Initialize Firebase for the client side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


// Server-side admin initialization
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
} as ServiceAccount;

const adminApp = !getAdminApps().length ? initializeAdminApp({
    credential: {
        projectId: serviceAccount.projectId,
        privateKey: serviceAccount.privateKey,
        clientEmail: serviceAccount.clientEmail,
    },
}) : getAdminApp();

const adminDb = getAdminFirestore(adminApp);
const adminAuth = getAdminAuth(adminApp);


export { app, db, auth, adminDb, adminAuth };
