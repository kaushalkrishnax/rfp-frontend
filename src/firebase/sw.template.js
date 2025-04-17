// src/firebase/sw.template.js

self.importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"
);
self.importScripts(
  "https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "__API_KEY__",
  authDomain: "__AUTH_DOMAIN__",
  projectId: "__PROJECT_ID__",
  storageBucket: "__STORAGE_BUCKET__",
  messagingSenderId: "__MESSAGING_SENDER_ID__",
  appId: "__APP_ID__",
  measurementId: "__MEASUREMENT_ID__",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload?.notification?.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
