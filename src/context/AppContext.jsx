import { createContext, useState, useEffect } from "react";

const AppContext = createContext();

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

  return (
    <AppContext.Provider
      value={{
        activeTab,
        tabParams,
        setActiveTab,
        isUserAuthenticated,
        setIsUserAuthenticated,
        saveUserInfo,
        userInfo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
