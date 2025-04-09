import React, { useState, useEffect, useContext } from "react";
import rfpLogo from "../assets/rfp.png";
import AppContext from "../context/AppContext";

const FinalizeAuth = () => {
  const { saveUserInfo } = useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [fullName, setFullName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = rfpLogo;
  }, []);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://rfp-backend-73t3.onrender.com/api/v1/auth/otp?phone=${phoneNumber}`
      );

      const { method } = await response.json().then((data) => data.data);

      setIsSignup(method === "ToSignup");
      setShowOtpScreen(true);
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      alert("Please enter a valid 4-digit OTP");
      return;
    }

    if (isSignup && !fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://rfp-backend-73t3.onrender.com/api/v1/auth/finalize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            full_name: isSignup ? fullName : null,
            phone: phoneNumber,
            otp: otpValue,
          }),
        }
      );

      const { id, full_name, phone, refresh_token, access_token } =
        await response.json().then((data) => data.data);

      saveUserInfo({
        id,
        full_name,
        phone,
        refresh_token,
        access_token,
      });

      setIsLoading(false);
    } catch (error) {
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden transition-colors duration-500 relative">
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src={rfpLogo}
            alt="Royal Food Plaza Logo"
            className="rounded-full shadow-lg border-4 border-white dark:border-gray-800 w-24 h-24"
            style={{
              objectFit: "cover",
            }}
            aria-label="Royal Food Plaza Logo"
          />
          <p className="text-center text-xl mt-4">
            <span className="font-bold text-red-600 dark:text-red-400">
              Royal Food Plaza
            </span>
          </p>
        </div>

        {/* Auth Content */}
        {!showOtpScreen ? (
          /* Phone number screen */
          <div className="space-y-6 animate-fade">
            <h2 className="text-xl font-semibold text-center">Sign In</h2>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Phone Number (India)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  type="tel"
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                />
              </div>
            </div>

            <button
              className="w-full bg-red-600 dark:bg-red-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-red-700 dark:hover:bg-red-600 transition"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce1" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce2" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce3" />
                </div>
              ) : (
                "Send OTP"
              )}
            </button>
          </div>
        ) : (
          /* OTP verification screen */
          <div className="space-y-6 animate-fade">
            <h2 className="text-xl font-semibold text-center">
              Verify Your Number
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              We've sent a 4-digit code to +91 {phoneNumber}
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Enter 4-digit OTP
              </label>
              <div className="flex gap-3 justify-between">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    className="w-14 h-14 text-center text-xl border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength={1}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <button
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                onClick={() => setShowOtpScreen(false)}
              >
                Change Number
              </button>
              <button
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </div>

            {isSignup && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <button
              className="w-full bg-red-600 dark:bg-red-500 text-white py-3 rounded-lg flex items-center justify-center hover:bg-red-700 dark:hover:bg-red-600 transition"
              onClick={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce1" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce2" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce3" />
                </div>
              ) : (
                "Verify & Continue"
              )}
            </button>
          </div>
        )}

        {/* Developer Credits */}
        <div className="mt-12 flex flex-col items-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Developed by <span className="font-semibold">Kaushal</span> &{" "}
            <span className="font-semibold">Ayush</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FinalizeAuth);
