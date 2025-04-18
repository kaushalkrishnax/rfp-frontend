import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppProvider } from './context/AppContext.jsx'

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

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  // </StrictMode>
)
