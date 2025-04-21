import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppContext from "./context/AppContext";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

import Home from "./pages/Home";
import AdminHome from "./pages/AdminHome";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import LoadingScreen from "./components/LoadingScreen";
import FinalizeAuth from "./pages/FinalizeAuth";
import BottomNav from "./layout/BottomNav";
import NotificationHandler from "./components/NotificationHandler";

function App() {
  const { isUserAuthenticated, isAppLoading, isAdmin } = useContext(AppContext);

  if (Capacitor.isNativePlatform()) {
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setOverlaysWebView({ overlay: false });
  }

  SplashScreen.hide();

  if (isAppLoading) return <LoadingScreen />;

  return (
    <Router>
      {!isUserAuthenticated ? (
        <FinalizeAuth />
      ) : (
        <>
          <Routes>
            <Route path="/" element={isAdmin ? <AdminHome /> : <Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
          <NotificationHandler />
        </>
      )}
    </Router>
  );
}

export default App;
