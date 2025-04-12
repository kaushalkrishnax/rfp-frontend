import { useContext } from "react";
import { ArrowRight, Settings, MessageSquare, LogOut } from "lucide-react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);

  function MenuItem({ icon, color, title }) {
    return (
      <div className="flex items-center justify-between cursor-pointer">
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
    <div className="bg-white dark:bg-gray-900 h-screen w-full relative font-sans text-black dark:text-white pb-20">
      <div className="p-4 flex justify-between items-center">
        <div className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center">
          <ArrowRight
            className="h-5 w-5 rotate-180"
            onClick={() => navigate("/")}
          />
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
          <img
            src="https://i.pinimg.com/736x/b8/f7/07/b8f707b74374a8f4f78e99edab91fa05.jpg"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold dark:text-white">
          {userInfo?.full_name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{userInfo?.phone}</p>
      </div>

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
        <MenuItem
          icon={<LogOut className="h-5 w-5 text-white" />}
          color="bg-red-500"
          title="Logout"
        />
      </div>
    </div>
  );
}
