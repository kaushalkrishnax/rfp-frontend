import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { PushNotifications } from "@capacitor/push-notifications";

const AppContext = createContext();
const RFP_API_URL = import.meta.env.VITE_RFP_API_URL;

export const AppProvider = ({ children }) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserInfo(parsed);
      setIsUserAuthenticated(true);
      setIsAdmin(parsed?.role === "admin");
    }

    const MINIMUM_LOAD_TIME = 3000;
    const startTime = Date.now();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, MINIMUM_LOAD_TIME - elapsed);

      setTimeout(async () => {
        if (firebaseUser) {
          try {
            const idToken = await getIdToken(firebaseUser);
            const res = await fetch(`${RFP_API_URL}/auth/finalize`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idToken }),
            });

            const data = await res.json();
            if (data?.data) {
              saveUserInfo(data.data);
              await setupNotifications(data.data);
            }
          } catch (err) {
            console.error("FinalizeAuth Error:", err);
          }
        } else if (!firebaseUser && isUserAuthenticated) {
          deleteUserInfo();
        }

        setIsAppLoading(false);
      }, delay);
    });

    return () => unsubscribe();
  }, []);

  const setupNotifications = async (userData) => {
    if (Capacitor.isNativePlatform()) {
      await setupNativeNotifications(userData);
    } else {
      await setupWebNotifications(userData);
    }
  };

  const setupWebNotifications = async (userData) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        return;
      }

      const messaging = getMessaging();
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      const fcmToken = await getToken(messaging, { vapidKey });

      await storeFcmToken(userData, fcmToken);

      onMessage(messaging, (payload) => {
        const notificationTitle = payload.data.title || "New Notification";
        const notificationOptions = {
          body: payload.data.body || "You have a new message",
          icon: "/apple-touch-icon.png",
          data: payload.data,
        };

        new Notification(notificationTitle, notificationOptions);
      });
    } catch (err) {
      console.error("Web notification setup error:", err);
    }
  };

  const setupNativeNotifications = async (userData) => {
    try {
      const permResult = await PushNotifications.requestPermissions();
      if (permResult.receive !== "granted") {
        return;
      }

      await PushNotifications.register();

      PushNotifications.addListener("registration", async (token) => {
        await storeFcmToken(userData, token.value);
      });

      PushNotifications.addListener(
        "pushNotificationReceived",
        (notification) => {
          LocalNotifications.schedule({
            notifications: [
              {
                title: notification.data.title || "New Notification",
                body: notification.data.body || "You have a new message",
                id: Math.floor(Math.random() * 1000000),
                data: notification.data,
                smallIcon: "ic_notification",
                schedule: { at: new Date(Date.now() + 100) },
              },
            ],
          });
        }
      );

      PushNotifications.addListener(
        "pushNotificationActionPerformed",
        (notification) => {
          const data = notification.notification.data;
          if (data.click_action === "OPEN_ORDER_DETAIL" && data.order_id) {
            window.location.href = `/orders?order_id=${data.order_id}&fromNotification=true`;
          }
        }
      );

      const localPermResult = await LocalNotifications.requestPermissions();
      if (localPermResult.display === "granted") {
        LocalNotifications.addListener(
          "localNotificationActionPerformed",
          (event) => {
            const data = event.notification.data;
            if (data.click_action === "OPEN_ORDER_DETAIL" && data.order_id) {
              window.location.href = `/orders?order_id=${data.order_id}&fromNotification=true`;
            }
          }
        );
      }
    } catch (err) {
      console.error("Native notification setup error:", err);
    }
  };

  const storeFcmToken = async (userData, token) => {
    try {
      const response = await fetch(`${RFP_API_URL}/auth/fcm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.access_token}`,
        },
        body: JSON.stringify({ fcm_token: token }),
      });

      const data = await response.json();

      if (data?.data) {
        saveUserInfo({ ...userData, fcm_token: token });
      }
    } catch (err) {
      console.warn("❌ storeFcmToken error:", err);
    }
  };

  const saveUserInfo = (info) => {
    localStorage.setItem("userInfo", JSON.stringify(info));
    setUserInfo(info);
    setIsUserAuthenticated(true);
    setIsAdmin(info?.role === "admin");
  };

  const deleteUserInfo = async () => {
    await signOut(auth);
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setIsUserAuthenticated(false);
    setIsAdmin(false);
  };

  const rfpFetch = async (endpoint, options = {}) => {
    const accessToken = userInfo?.access_token;
    const refreshToken = userInfo?.refresh_token;

    let headers = {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${RFP_API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        const body = await response.json();
        if (body?.message === "jwt expired" && refreshToken) {
          try {
            const refreshRes = await fetch(`${RFP_API_URL}/auth/refresh`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            const refreshData = await refreshRes.json();
            const newAccessToken = refreshData?.data?.access_token;

            if (refreshRes.ok && newAccessToken) {
              const newUser = {
                ...userInfo,
                access_token: newAccessToken,
              };
              saveUserInfo(newUser);

              return await fetch(`${RFP_API_URL}${endpoint}`, {
                ...options,
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }).then((r) => r.json());
            }
          } catch (err) {
            console.error("Token refresh failed", err);
          }
        }

        deleteUserInfo();
        return null;
      }

      return response.json();
    } catch (err) {
      console.error("rfpFetch error:", err);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        isUserAuthenticated,
        isAdmin,
        userInfo,
        isAppLoading,
        saveUserInfo,
        deleteUserInfo,
        rfpFetch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
