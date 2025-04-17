import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { getMessaging, getToken } from "firebase/messaging";

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
              await storeFcmToken(data.data);
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

    const storeFcmToken = async (userData) => {
      console.log("[1] storeFcmToken called");

      try {
        const messaging = getMessaging();
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        const fcmToken = await getToken(messaging, { vapidKey });

        const response = await fetch(`${RFP_API_URL}/auth/fcm`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.access_token}`,
          },
          body: JSON.stringify({ fcm_token: fcmToken }),
        });

        const data = await response.json();

        if (data?.data) {
          console.log("[8] Saving user info with FCM token");
          saveUserInfo({ ...userData, fcm_token: fcmToken });
        }
      } catch (err) {
        console.warn("❌ storeFcmToken error:", err);
      }
    };

    return () => unsubscribe();
  }, []);

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
