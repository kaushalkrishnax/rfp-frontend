import { useContext } from "react";
import { ArrowRight, Settings, MessageSquare } from "lucide-react";
import AppContext from "../context/AppContext";

export default function Profile() {
  const { setActiveTab, userInfo } = useContext(AppContext);

  function MenuItem({ icon, color, title }) {
    return (
      <div
        className="flex items-center justify-between"
      >
        <div className="flex items-center">
          <div
            className={`h-10 w-10 ${color} rounded-full flex items-center justify-center mr-4`}
          >
            {icon}
          </div>
          <span className="font-medium dark:text-gray-100">{title}</span>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 h-screen w-full max-w-md mx-auto relative font-sans text-gray-900 dark:text-gray-100">
      {/* Header with Back Button */}
      <div className="p-4 flex justify-between items-center">
        <div
          className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center"
        >
          <ArrowRight className="h-5 w-5 rotate-180" onClick={() => setActiveTab("Home")} />
        </div>
      </div> 

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
          <img
            src="https://i.pinimg.com/736x/b8/f7/07/b8f707b74374a8f4f78e99edab91fa05.jpg"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold dark:text-white">{userInfo?.full_name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{userInfo?.phone}</p>
      </div>

      {/* Menu Items */}
      <div className="px-6 space-y-4">
        <MenuItem
          icon={<Settings className="h-5 w-5 text-white" />}
          color="bg-teal-500"
          title="Profile Settings"
        />

        <MenuItem
          icon={<MessageSquare className="h-5 w-5 text-white" />}
          color="bg-green-700"
          title="Order History"
        />
      </div>

      {/* Sign Out Button */}
      <div className="absolute bottom-8 w-full flex justify-center">
        <button className="px-6 py-2 text-gray-700 dark:text-gray-300 font-medium">
          Sign Out
        </button>
      </div>
    </div>
  );
}
