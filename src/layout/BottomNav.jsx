import React, { useContext } from "react";
import { Home, Info, ShoppingBag, SquareChartGanttIcon } from "lucide-react";
import AppContext from "../context/AppContext";

const BottomNav = () => {
  const { activeTab, setActiveTab } = useContext(AppContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-50 dark:bg-gray-900 dark:border-zinc-800">
      <div className="flex justify-around py-2 text-gray-700 dark:text-gray-300">
        <NavItem 
          label="Home" 
          icon={<Home size={24} />} 
          isActive={activeTab === "Home"} 
          onClick={() => setActiveTab("Home")} 
        />
        <NavItem 
          label="Menu" 
          icon={<SquareChartGanttIcon size={24} />} 
          isActive={activeTab === "Menu"} 
          onClick={() => setActiveTab("Menu")} 
        />
        <NavItem 
          label="Orders" 
          icon={<ShoppingBag size={24} />} 
          isActive={activeTab === "Orders"} 
          onClick={() => setActiveTab("Orders")} 
        />
      </div>
    </div>
  );
};

const NavItem = ({ label, icon, isActive, onClick }) => {
  return (
    <button 
      className={`flex flex-col items-center px-3 py-1 ${
        isActive 
          ? "text-red-500 dark:text-red-400" 
          : "text-gray-500 dark:text-gray-400 hover:text-red-400 dark:hover:text-red-400"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </button>
  );
};

export default BottomNav;
