import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { getMessaging } from "firebase/messaging";

navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data?.type === "ORDER_NOTIFICATION") {
    const { order_id } = event.data;
    window.location.href = `/orders?order_id=${order_id}&fromNotification=true`;
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered successfully", registration);
    })
    .catch((error) => {
      console.error("Service Worker registration failed", error);
    });
}

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

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const { click_action, order_id } = event.notification.data || {};

  let finalUrl = "/";

  if (click_action === "OPEN_ORDER_DETAIL" && order_id) {
    finalUrl = `/orders?order_id=${order_id}&fromNotification=true`;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.postMessage({
              type: "ORDER_NOTIFICATION",
              click_action,
              order_id,
            });
            return client.focus();
          }
        }

        return clients.openWindow(finalUrl);
      })
  );
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AppProvider>
    <App />
  </AppProvider>
  // </StrictMode>
);
