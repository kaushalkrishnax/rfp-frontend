import { useContext, useEffect, useState } from "react";
import AppContext from "./context/AppContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import FoodDetails from "./components/FoodDetails";
import BottomNav from "./layout/BottomNav";
import Profile from "./pages/Profile";
import LoadingScreen from "./components/LoadingScreen";
import FinalizeAuth from "./components/FinalizeAuth";
import Payments from "./components/Payments";

function App() {
  const { activeTab, isUserAuthenticated } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const TabComponents = {
    Home,
    Menu,
    FoodDetails,
    Orders,
    Profile,
    FinalizeAuth,
    Payments,
  };

  const ActivePage = TabComponents[activeTab] || Home;

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isUserAuthenticated) {
    return <FinalizeAuth />;
  }

  return (
    <>
      <ActivePage />
      <BottomNav />
    </>
  );
}

export default App;
