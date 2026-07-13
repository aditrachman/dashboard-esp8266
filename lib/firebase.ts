import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database, connectDatabaseEmulator } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validasi config — kalau ada env yang kosong, throw error biar UI bisa handle
function validateConfig(): void {
  const required = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ] as const;

  const missing = required.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Firebase config tidak lengkap. Variable berikut belum diisi di .env.local:\n` +
        missing.map((k) => `  - ${k}`).join("\n") +
        `\n\nCek file .env.local.example untuk referensi.`
    );
  }
}

let app: FirebaseApp | null = null;
let db: Database | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;

  validateConfig();

  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return app;
}

export function getRealtimeDatabase(): Database {
  if (db) return db;

  const firebaseApp = getFirebaseApp();
  db = getDatabase(firebaseApp);
  return db;
}
