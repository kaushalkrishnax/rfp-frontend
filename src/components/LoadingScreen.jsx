import React, { useEffect } from "react";
import rfpLogo from "../assets/rfp.png";

const LoadingScreen = () => {
  useEffect(() => {
    const img = new Image();
    img.src = rfpLogo;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden transition-colors duration-500 relative">
      <div className="flex flex-col items-center animate-container">
        {/* Logo Animation */}
        <img
          src={rfpLogo}
          alt="RFP Logo"
          className="rounded-full shadow-lg border-4 border-white dark:border-gray-800 animate-logo"
          style={{
            objectFit: "cover",
          }}
          aria-label="Royal Food Plaza Logo"
        />

        {/* Welcome Text */}
        <p className="text-center text-2xl sm:text-3xl mt-6 opacity-0 animate-welcome">
          Welcome to <br />
          <span className="font-bold text-red-600 dark:text-red-400">
            Royal Food Plaza
          </span>
        </p>
      </div>

      {/* Developer Credits */}
      <div className="absolute bottom-6 flex flex-col items-center opacity-0 animate-welcome">
        <p className="text-sm text-gray-700 dark:text-gray-300 animate-fade mb-6">
          Developed by <span className="font-semibold">Kaushal</span> &{" "}
          <span className="font-semibold">Ayush</span>
        </p>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-bounce1" />
          <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-bounce2" />
          <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full animate-bounce3" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(LoadingScreen);
