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
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    image: payload.data.image,
    icon: "/apple-touch-icon.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const data = event.notification.data || {};
  const clickAction = data.click_action || "/";
  const order_id = data.order_id;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(() => {
      let finalUrl = "/";
      if (clickAction === "OPEN_ORDER_DETAIL" && order_id) {
        finalUrl = `/orders&order_id=${order_id}`;
      }
      clients.openWindow(finalUrl);
    })
  );
});
