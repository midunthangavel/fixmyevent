import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { logFirebaseInit, logFirebaseError } from "./logger";

// Firebase configuration from environment variables ONLY
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && {
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  })
};

// Validate that all required environment variables are present
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID', 
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(`Warning: Missing Firebase environment variables: ${missingEnvVars.join(', ')}. Using default values for development.`);
  // Provide fallback values for development
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'demo-project';
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) {
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'demo-app';
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'demo-key';
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'demo-project.firebaseapp.com';
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) {
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'demo-project.appspot.com';
  }
  if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) {
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = '123456789';
  }
}

let app: any;
let auth: any;
let db: any;
let storage: any;
let functions: any;

try {
  // Initialize Firebase if no apps exist
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Initialize Auth
  auth = getAuth(app);

  // Initialize Firestore with memory cache for better performance
  db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
  });

  // Initialize Storage
  storage = getStorage(app);

  // Initialize Functions
  functions = getFunctions(app);

  // Connect to emulators in development mode
  if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATORS === 'true') {
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      connectFunctionsEmulator(functions, 'localhost', 5001);
      console.log('Connected to Firebase emulators');
    } catch (emulatorError) {
      console.log('Emulators already connected or not available');
      logFirebaseError(emulatorError, { context: 'emulator_connection' });
    }
  }

  logFirebaseInit(firebaseConfig.projectId);

} catch (error) {
  logFirebaseError(error, { config: firebaseConfig });
  throw error; // Re-throw to prevent silent failures
}

export { app, auth, db, storage, functions };