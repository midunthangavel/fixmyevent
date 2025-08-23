import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { logFirebaseInit, logFirebaseError } from "./logger";

// Firebase configuration with fallback to demo values for development
const getFirebaseConfig = () => {
  // Check if we're in development mode and use fallback values
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.warn('⚠️  Using development fallback Firebase configuration');
    return {
      projectId: 'fixmyevent-dev',
      appId: '1:123456789012:web:abcdef1234567890',
      storageBucket: 'fixmyevent-dev.firebasestorage.app',
      apiKey: 'AIzaSyC-example-key-for-development',
      authDomain: 'fixmyevent-dev.firebaseapp.com',
      messagingSenderId: '123456789012',
      measurementId: 'G-EXAMPLE123'
    };
  }
  
  return {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID && {
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    })
  };
};

const firebaseConfig = getFirebaseConfig();

// Validate Firebase configuration only in production
const requiredFields = ['projectId', 'appId', 'apiKey', 'authDomain', 'storageBucket', 'messagingSenderId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('Missing required Firebase configuration fields:', missingFields);
  throw new Error(`Firebase configuration incomplete. Missing: ${missingFields.join(', ')}`);
}

// Log configuration status
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.warn('Warning: Firebase configuration incomplete. Set all required environment variables for production use.');
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
      console.log('✅ Connected to Firebase emulators');
    } catch (emulatorError) {
      console.log('ℹ️  Firebase emulators not available - using fallback configuration');
      logFirebaseError(emulatorError, { context: 'emulator_connection' });
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log('ℹ️  Running in development mode with fallback Firebase configuration');
  }

  if (firebaseConfig.projectId) {
    logFirebaseInit(firebaseConfig.projectId);
  }

} catch (error) {
  logFirebaseError(error, { config: firebaseConfig });
  throw error; // Re-throw to prevent silent failures
}

export { app, auth, db, storage, functions };