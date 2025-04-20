// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { Capacitor } from "@capacitor/core";

const firebaseConfig = {
  apiKey: Capacitor.isNativePlatform() ? "AIzaSyBRE_54DwHKy3vKDhyAf8rJ0sbmDB_PQbQ" : "AIzaSyD1xfHJ-rtaBIhiZOTEPEpjOexMxTzLYSs",
  authDomain: "rfp-app-3cd65.firebaseapp.com",
  projectId: "rfp-app-3cd65",
  storageBucket: "rfp-app-3cd65.firebasestorage.app",
  messagingSenderId: "79090394208",
  appId: "1:79090394208:web:fcf63bfa980cd8a88c4f05",
  measurementId: "G-Q3B3K1W69C",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
