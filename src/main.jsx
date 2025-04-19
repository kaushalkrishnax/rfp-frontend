import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";

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

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AppProvider>
    <App />
  </AppProvider>
  // </StrictMode>
);
