import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { getMessaging, onMessage } from "firebase/messaging";
import app from "./firebase.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(() => {
      console.log("Service Worker registered successfully");
    })
    .catch((error) => {
      console.error("Service Worker registration failed", error);
    });
}

const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/apple-touch-icon.png",
    image: payload.data.image,
    data: payload.data,
  };

  if (Notification.permission === "granted") {
    new Notification(notificationTitle, notificationOptions);
  }
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AppProvider>
    <App />
  </AppProvider>
  // </StrictMode>
);
