import { createContext, useState, useEffect } from "react";

const AppContext = createContext();

const RFP_API_URL = import.meta.env.VITE_RFP_API_URL;

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTabState] = useState("Home");
  const [userInfo, setUserInfo] = useState(null);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [tabParams, setTabParams] = useState(null);

  const setActiveTab = (pageName, params = null) => {
    setActiveTabState(pageName);
    setTabParams(params);
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUserInfo(JSON.parse(userInfo));
      setIsUserAuthenticated(true);
    }
  }, []);

  const saveUserInfo = (userInfo) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUserInfo(userInfo);
    setIsUserAuthenticated(true);
  };

  const deleteUserInfo = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("access_token");
    setUserInfo(null);
    setIsUserAuthenticated(false);
  };

  const rfpFetch = async (endpoint, options = {}) => {
    const accessToken = userInfo?.access_token;
    const refreshToken = userInfo?.refresh_token;

    const headers = {
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
        const resBody = await response.json();

        if (resBody?.message === "invalid_token" && refreshToken) {
          try {
            const refreshRes = await fetch(`${RFP_API_URL}/auth/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refresh_token: refreshToken }),
            });

            const refreshData = await refreshRes
              .json()
              .then((data) => data.data || {});

            if (refreshRes.ok && refreshData?.access_token) {
              const newUserInfo = {
                ...userInfo,
                access_token: refreshData.access_token,
              };
              saveUserInfo(newUserInfo);

              const retryHeaders = {
                ...headers,
                Authorization: `Bearer ${refreshData.access_token}`,
              };

              return await fetch(`${RFP_API_URL}${endpoint}`, {
                ...options,
                headers: retryHeaders,
              });
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }

        deleteUserInfo();
        window.location.reload();
        return null;
      }

      return response.json();
    } catch (error) {
      console.error("rfpFetch error:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        tabParams,
        setActiveTab,
        isUserAuthenticated,
        setIsUserAuthenticated,
        userInfo,
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
