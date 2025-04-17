/* eslint-disable no-undef */

importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyD1xfHJ-rtaBIhiZOTEPEpjOexMxTzLYSs",
  authDomain: "rfp-app-3cd65.firebaseapp.com",
  projectId: "rfp-app-3cd65",
  storageBucket: "rfp-app-3cd65.firebasestorage.app",
  messagingSenderId: "79090394208",
  appId: "1:79090394208:web:fcf63bfa980cd8a88c4f05",
  measurementId: "G-Q3B3K1W69C",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload?.notification?.body,
    icon: payload?.notification?.image || "/apple-touch-icon.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
