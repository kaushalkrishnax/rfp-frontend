import { useContext } from "react";
import { ArrowRight, Settings, MessageSquare, LogOut, User } from "lucide-react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { userInfo, deleteUserInfo } = useContext(AppContext);

  function MenuItem({ icon, color, title, onClick }) {
    return (
      <div className="flex items-center justify-between cursor-pointer p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all" onClick={onClick}>
        <div className="flex items-center">
          <div className={`h-10 w-10 ${color} rounded-full flex items-center justify-center mr-4 shadow-md`}>
            {icon}
          </div>
          <span className="font-medium dark:text-gray-100">{title}</span>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  const handleLogout = () => {
    deleteUserInfo();
    navigate("/");
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen w-full relative font-sans text-black dark:text-white pb-20">
      <div className="p-4 flex justify-between items-center">
        <div className="bg-gray-100 dark:bg-gray-800 h-10 w-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
          <ArrowRight
            className="h-5 w-5 rotate-180 dark:text-white"
            onClick={() => navigate("/")}
          />
        </div>
        <h2 className="text-xl font-semibold">My Profile</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex flex-col items-center mt-4 mb-8 relative">
        <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-blue-500 dark:border-blue-400 shadow-lg">
          {userInfo?.profile_image ? (
            <img
              src={userInfo.profile_image}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User size={48} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>

        <p className="text-2xl font-bold dark:text-white">
          {userInfo?.phone || "No phone added"}
        </p>
        <p className="text-gray-600 dark:text-gray-400">{userInfo?.email || "No email added"}</p>
      </div>

      <div className="mx-4 my-6 h-px bg-gray-200 dark:bg-gray-700"></div>

      <div className="px-6 space-y-2">
        <MenuItem
          icon={<MessageSquare className="h-5 w-5 text-white" />}
          color="bg-green-700"
          title="Order History"
          onClick={() => navigate("/orders")}
        />

        <MenuItem
          icon={<LogOut className="h-5 w-5 text-white" />}
          color="bg-red-500"
          title="Logout"
          onClick={handleLogout}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          App Version 1.0.0
        </div>
      </div>
    </div>
  );
}
