import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCcMt6_-_HC9J3rLO1I8NK0UDkAX0flbzY",
  authDomain: "arduino-9674f.firebaseapp.com",
  databaseURL: "https://arduino-9674f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arduino-9674f",
  storageBucket: "arduino-9674f.firebasestorage.app",
  messagingSenderId: "736315669021",
  appId: "1:736315669021:web:e339231fcfe16b72bc24f4",
  measurementId: "G-JSX5LRM5QT",
};

let app: FirebaseApp | null = null;
let db: Database | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  return app;
}

export function getRealtimeDatabase(): Database {
  if (db) return db;
  const firebaseApp = getFirebaseApp();
  db = getDatabase(firebaseApp);
  return db;
}
