import { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTabState] = useState("Home");
  const [tabParams, setTabParams] = useState(null);

  const setActiveTab = (pageName, params = null) => {
    setActiveTabState(pageName);
    setTabParams(params); 
  };

  return (
    <AppContext.Provider value={{ activeTab, tabParams, setActiveTab }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
