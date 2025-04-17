import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppContext from "./context/AppContext";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import LoadingScreen from "./components/LoadingScreen";
import FinalizeAuth from "./pages/FinalizeAuth";
import BottomNav from "./layout/BottomNav";

function App() {
  const { isUserAuthenticated, isAppLoading } = useContext(AppContext);

  if (isAppLoading) return <LoadingScreen />;

  return (
    <Router>
      {!isUserAuthenticated ? (
        <FinalizeAuth />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <BottomNav />
        </>
      )}
    </Router>
  );
}

export default App;
