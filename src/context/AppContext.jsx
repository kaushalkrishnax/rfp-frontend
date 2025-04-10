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
    const accessToken = localStorage.getItem("access_token");

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
        console.warn("Unauthorized. Logging out...");
        deleteUserInfo();
        window.location.reload();
        return null;
      }

      return response;
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
