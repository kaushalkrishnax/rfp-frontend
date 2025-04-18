// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD1xfHJ-rtaBIhiZOTEPEpjOexMxTzLYSs",
  authDomain: "rfp-app-3cd65.firebaseapp.com",
  projectId: "rfp-app-3cd65",
  storageBucket: "rfp-app-3cd65.firebasestorage.app",
  messagingSenderId: "79090394208",
  appId: "1:79090394208:web:fcf63bfa980cd8a88c4f05",
  measurementId: "G-Q3B3K1W69C",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/apple-touch-icon.png",
    image: payload.notification.image,
    data: payload.data,
  };

  if (Notification.permission === "granted") {
    new Notification(notificationTitle, notificationOptions);
  }
});

export default app;
