import React, { useState, useEffect, useContext, useRef } from "react";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { Capacitor } from "@capacitor/core";
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase.js";
import rfpLogo from "../assets/rfp.png";
import AppContext from "../context/AppContext";

const RFP_API_URL = import.meta.env.VITE_RFP_API_URL;

const FinalizeAuth = () => {
  const { saveUserInfo } = useContext(AppContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const inputRefs = useRef([]);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    const img = new Image();
    img.src = rfpLogo;

    if (!isNative) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: window.innerWidth < 320 ? "compact" : "normal",
        "expired-callback": () => {
          console.warn("reCAPTCHA expired, reloading...");
          window.location.reload();
        },
        "error-callback": (err) => {
          console.error("reCAPTCHA error:", err);
        },
      });
      setRecaptchaVerifier(verifier);
    }

    if (isNative) {
      const phoneCodeSentListener = FirebaseAuthentication.addListener(
        "phoneCodeSent",
        (event) => {
          setVerificationId(event.verificationId);
          setShowOtpScreen(true);
          setOtp(["", "", "", "", "", ""]);
          setTimeout(() => inputRefs.current[0]?.focus(), 100);
          setIsLoading(false);
        }
      );

      const phoneVerificationFailedListener =
        FirebaseAuthentication.addListener(
          "phoneVerificationFailed",
          (error) => {
            console.error("Phone verification failed:", error);
            setError(
              `Verification failed: ${error.message || "Unknown error"}`
            );
            setIsLoading(false);
          }
        );

      return () => {
        phoneCodeSentListener.remove();
        phoneVerificationFailedListener.remove();
      };
    }
  }, [isNative]);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError("");
    }
  };

  const handleOtpChange = (index, value) => {
    setError("");
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    setError("");
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    const fullPhoneNumber = `+91${phoneNumber}`;

    try {
      if (isNative) {
        await FirebaseAuthentication.signInWithPhoneNumber({
          phoneNumber: fullPhoneNumber,
        });
      } else {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          recaptchaVerifier
        );
        setVerificationId(confirmationResult.verificationId);
        setShowOtpScreen(true);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError(`Failed to send OTP: ${error.message || "Unknown error"}`);
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    if (!verificationId) {
      setError(
        "OTP verification session not found. Please try sending OTP again."
      );
      setShowOtpScreen(false);
      setOtp(["", "", "", "", "", ""]);
      setPhoneNumber("");
      return;
    }

    setIsLoading(true);

    try {
      let idToken;

      if (isNative) {
        await FirebaseAuthentication.confirmVerificationCode({
          verificationId,
          verificationCode: otpValue,
        });

        const idTokenResult = await FirebaseAuthentication.getIdToken();
        idToken = idTokenResult.token;
      } else {
        const credential = PhoneAuthProvider.credential(
          verificationId,
          otpValue
        );
        const userCredential = await signInWithCredential(auth, credential);
        idToken = await userCredential.user.getIdToken();
      }

      if (!idToken) {
        throw new Error("Failed to get authentication token");
      }

      const res = await fetch(`${RFP_API_URL}/auth/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
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
      console.error("Error verifying OTP or finalizing auth:", error);
      if (error.message?.includes("invalid-verification-code")) {
        setError("Invalid OTP code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else if (error.message?.includes("code-expired")) {
        setError("OTP code expired. Please request a new one.");
        setShowOtpScreen(false);
      } else if (
        error instanceof TypeError &&
        error.message?.includes("fetch")
      ) {
        setError("Network error. Could not reach the server.");
      } else {
        setError(`Verification error: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setVerificationId(null);
    setShowOtpScreen(false);
  };

  const handleResendOtp = async () => {
    setError("");
    if (phoneNumber.length !== 10) {
      setError("Invalid phone number associated with this attempt.");
      return;
    }

    setIsLoading(true);
    const fullPhoneNumber = `+91${phoneNumber}`;

    try {
      if (isNative) {
        await FirebaseAuthentication.signInWithPhoneNumber({
          phoneNumber: fullPhoneNumber,
        });
      } else {
        if (
          recaptchaVerifier &&
          typeof recaptchaVerifier.clear === "function"
        ) {
          recaptchaVerifier.clear();
        }

        const newVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: window.innerWidth < 320 ? "compact" : "normal",
        });
        setRecaptchaVerifier(newVerifier);

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          fullPhoneNumber,
          newVerifier
        );
        setVerificationId(confirmationResult.verificationId);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError(`Failed to resend OTP: ${error.message || "Unknown error"}`);
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

        {!showOtpScreen ? (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-fade">
            <h2 className="text-xl font-semibold text-center">Sign In</h2>

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
              {!isNative && (
                <div
                  id="recaptcha-container"
                  className="mt-4 flex justify-center"
                ></div>
              )}
            </div>

            <button
              className="w-full bg-red-600 dark:bg-red-500 text-white h-12 rounded-lg flex items-center justify-center hover:bg-red-700 dark:hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading || phoneNumber.length !== 10}
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
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade">
            <h2 className="text-xl font-semibold text-center">
              Verify Your Number
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              We've sent a 6-digit code to +91 {phoneNumber}
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Enter 6-digit OTP
              </label>
              <div className="flex gap-2 justify-center sm:justify-between">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d{1}"
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength={1}
                    required
                    aria-required="true"
                    aria-label={`OTP digit ${index + 1}`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <button
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition"
                onClick={handleChangeNumber}
                type="button"
                disabled={isLoading}
              >
                Change Number
              </button>
              <button
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition disabled:opacity-50"
                onClick={handleResendOtp}
                type="button"
                disabled={isLoading}
              >
                Resend OTP
              </button>
            </div>

            <button
              className="w-full bg-red-600 dark:bg-red-500 text-white h-12 rounded-lg flex items-center justify-center hover:bg-red-700 dark:hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
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
          </form>
        )}

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
