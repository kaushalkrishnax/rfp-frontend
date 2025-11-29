import React, { useState, useContext } from "react";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import AppContext from "../context/AppContext.jsx";
import { auth } from "../firebase.js";
import rfpLogo from "../assets/rfp.png";
import { RFP_API_URL } from "../constants.js";

const FinalizeAuth = () => {
  const { saveUserInfo } = useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneScreen, setShowPhoneScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleIdToken, setGoogleIdToken] = useState(null);
  const isNative = Capacitor.isNativePlatform();

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);

    try {
      let idToken;

      if (isNative) {
        await FirebaseAuthentication.signInWithGoogle();
        const result = await FirebaseAuthentication.getIdToken();
        idToken = result.token;
      } else {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        idToken = await result.user.getIdToken();
      }

      if (!idToken) {
        throw new Error("Failed to get Google authentication token");
      }

      setGoogleIdToken(idToken);

      const res = await fetch(`${RFP_API_URL}/auth/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const backendResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          backendResponse?.message || `Server error (${res.status})`
        );
      }

      if (backendResponse?.data?.isSignup) {
        setShowPhoneScreen(true);
      } else {
        await finalizeAuthWithToken(idToken);
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError(`Google sign-in failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const finalizeAuthWithToken = async (token, phone = null) => {
    setIsLoading(true);

    try {
      const requestBody = { idToken: token };
      if (phone) {
        requestBody.phoneNumber = phone;
      }

      const res = await fetch(`${RFP_API_URL}/auth/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const backendResponse = await res.json();

      if (res.ok && backendResponse?.data) {
        saveUserInfo(backendResponse.data);
      } else {
        console.error(
          "Backend finalization failed:",
          res.status,
          backendResponse
        );
        setError(
          backendResponse?.message ||
            `Server error (${res.status}). Please try again.`
        );
      }
    } catch (error) {
      console.error("Error finalizing authentication:", error);
      setError(`Authentication error: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleSubmitPhone = async (e) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    const formattedPhone = `+91${phoneNumber}`;
    await finalizeAuthWithToken(googleIdToken, formattedPhone);
  };

  const handleBackToSignIn = () => {
    setShowPhoneScreen(false);
    setPhoneNumber("");
    setError("");
  };

  const LoadingIndicator = () => (
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-white rounded-full animate-bounce1" />
      <div className="w-2 h-2 bg-white rounded-full animate-bounce2" />
      <div className="w-2 h-2 bg-white rounded-full animate-bounce3" />
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden transition-colors duration-500 relative">
      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="flex flex-col items-center mb-8">
          <img
            src={rfpLogo}
            alt="Royal Food Plaza Logo"
            className="rounded-full shadow-lg border-4 border-white dark:border-gray-800 w-24 h-24 object-cover"
            aria-label="Royal Food Plaza Logo"
          />
          <p className="text-center text-xl mt-4 font-bold text-red-600 dark:text-red-400">
            Royal Food Plaza
          </p>
        </div>
        {error && (
          <div
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center"
            role="alert"
          >
            {error}
          </div>
        )}

        {!showPhoneScreen ? (
          <div className="space-y-6 animate-fade">
            <h2 className="text-xl font-semibold text-center">Sign In</h2>

            <button
              className="w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-white h-12 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 dark:border-gray-600"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingIndicator />
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitPhone} className="space-y-6 animate-fade">
            <h2 className="text-xl font-semibold text-center">
              Complete Your Profile
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Please provide your phone number to continue
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <label
                htmlFor="phone-input"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Phone Number (India)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">+91</span>
                </div>
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="tel"
                  className="pl-12 pr-4 py-3 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  required
                  aria-required="true"
                  aria-label="Enter your 10-digit Indian phone number"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                className="w-full bg-red-600 dark:bg-red-500 text-white h-12 rounded-lg flex items-center justify-center hover:bg-red-700 dark:hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading || phoneNumber.length !== 10}
              >
                {isLoading ? <LoadingIndicator /> : "Continue"}
              </button>

              <button
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition text-sm"
                onClick={handleBackToSignIn}
                type="button"
                disabled={isLoading}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        <div className="mt-12 flex flex-col items-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Developed with ❤️ by <span className="font-semibold">Kaushal</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FinalizeAuth);