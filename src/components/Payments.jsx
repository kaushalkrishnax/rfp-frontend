import { Plus } from "lucide-react";
import React, { useState } from "react";

const Payments = () => {
  const [method, setMethod] = useState("card");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: "",
    upiId: "",
    bank: "",
  });
  const [errors, setErrors] = useState({});

  // Basic form validation
  const validateForm = () => {
    const newErrors = {};
    if (method === "card") {
      if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber))
        newErrors.cardNumber = "Enter a valid 16-digit card number";
      if (!formData.expiry || !/^\d{2}\/\d{2}$/.test(formData.expiry))
        newErrors.expiry = "Enter valid MM/YY";
      if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv))
        newErrors.cvv = "Enter valid CVV";
      if (!formData.cardHolder || formData.cardHolder.length < 2)
        newErrors.cardHolder = "Enter cardholder name";
    } else if (method === "upi") {
      if (!formData.upiId || !/.+@.+/.test(formData.upiId))
        newErrors.upiId = "Enter a valid UPI ID";
    } else if (method === "netbanking") {
      if (!formData.bank || formData.bank === "Select Your Bank")
        newErrors.bank = "Select a bank";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Payment Mode Added:", { method, formData });
    }
  };

  const renderForm = () => {
    switch (method) {
      case "card":
        return (
          <form className="space-y-4 animate-slideIn" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
              Card Details
            </h2>
            <div>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="input-style"
                aria-label="Card Number"
                maxLength="16"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
              )}
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  className="input-style"
                  aria-label="Expiry Date"
                  maxLength="5"
                />
                {errors.expiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                )}
              </div>
              <div className="w-1/2">
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="input-style"
                  aria-label="CVV"
                  maxLength="4"
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
            <div>
              <input
                type="text"
                name="cardHolder"
                placeholder="Card Holder Name"
                value={formData.cardHolder}
                onChange={handleInputChange}
                className="input-style"
                aria-label="Card Holder Name"
              />
              {errors.cardHolder && (
                <p className="text-red-500 text-sm mt-1">{errors.cardHolder}</p>
              )}
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl  flex items-center gap-2"
              aria-label="Add"
            >
              <span className="" >Add</span>
              <Plus className="h-5 w-5" />
            </button>
          </form>
        );
      case "upi":
        return (
          <form className="space-y-4 animate-slideIn" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
              UPI Payment
            </h2>
            <div>
              <input
                type="text"
                name="upiId"
                placeholder="Enter UPI ID (e.g. yourname@upi)"
                value={formData.upiId}
                onChange={handleInputChange}
                className="input-style"
                aria-label="UPI ID"
              />
              {errors.upiId && (
                <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
              )}
            </div>
            <button type="submit" className="btn-primary" aria-label="Pay with UPI">
              Pay via UPI
            </button>
          </form>
        );
      case "netbanking":
        return (
          <form className="space-y-4 animate-slideIn" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
              Net Banking
            </h2>
            <div>
              <select
                name="bank"
                value={formData.bank}
                onChange={handleInputChange}
                className="input-style"
                aria-label="Select Bank"
              >
                <option value="Select Your Bank">Select Your Bank</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="SBI">SBI</option>
                <option value="Axis Bank">Axis Bank</option>
              </select>
              {errors.bank && (
                <p className="text-red-500 text-sm mt-1">{errors.bank}</p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary"
              aria-label="Proceed to Bank"
            >
              Proceed to Bank
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-12 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-zinc-900 dark:text-white overflow-hidden pb-24">
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-gray-700/10 animate-pulse" />

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500 dark:from-red-400 dark:to-orange-400">
          Secure Payments
        </h1>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["card", "upi", "netbanking"].map((item) => (
            <div
              key={item}
              onClick={() => setMethod(item)}
              onKeyDown={(e) => e.key === "Enter" && setMethod(item)}
              className={`p-4 rounded-xl border cursor-pointer text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                method === item
                  ? "bg-gradient-to-r from-red-600 to-orange-500 text-white border-transparent shadow-md"
                  : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Select ${item.replace("netbanking", "Net Banking")} payment method`}
            >
              <span className="text-lg font-medium capitalize">
                {item.replace("netbanking", "Net Banking")}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl space-y-6 border border-zinc-200 dark:border-zinc-700">
          {renderForm()}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .input-style {
          @apply w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200;
        }
        .btn-primary {
          @apply w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500;
        }
      `}</style>
    </div>
  );
};

export default Payments;