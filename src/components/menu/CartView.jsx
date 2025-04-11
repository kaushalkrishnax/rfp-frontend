import React, { useState, useEffect } from "react";
import { ShoppingCart, X, Loader2, ArrowLeft } from "lucide-react";
import Modal from "../common/Modal";

const CartView = ({
  selectedItems,
  getCartDetails,
  resetCart,
  toggleSelectItem,
  handleProceedOrder,
  isOpen,
  setIsOpen,
}) => {
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isCheckoutView, setIsCheckoutView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (isOpen) {
      const data = getCartDetails();

      const total = data.items.reduce((acc, item) => {
        const variantIndex = selectedVariants[item.id] ?? 0;
        const price = item.variants?.[variantIndex]?.price || 0;
        return acc + parseFloat(price);
      }, 0);

      setCartData({ items: data.items, total });
    }
  }, [selectedItems, getCartDetails, isOpen, isCheckoutView, selectedVariants]);

  const handleVariantChange = (itemId, variantIndex) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variantIndex }));
  };

  const formatPrice = (price) => `₹${parseFloat(price || 0).toFixed(2)}`;

  const renderPrice = (item) => {
    if (!item.variants || item.variants.length === 0) return formatPrice(0);
    const variantIndex = selectedVariants[item.id] ?? 0;
    const variant = item.variants[variantIndex];
    return formatPrice(variant?.price);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    try {
      await handleProceedOrder(paymentMethod);
      setIsOpen(false);
      setIsCheckoutView(false);
    } catch (error) {
      alert(`Order failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const CartContent = () => (
    <>
      {cartData.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <ShoppingCart
            size={36}
            className="text-gray-400 dark:text-gray-500 mb-3"
          />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Your cart is empty
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mt-1 text-sm">
            Add items to get started.
          </p>
        </div>
      ) : (
        <div className="px-2 divide-y divide-gray-300 dark:divide-gray-700">
          {cartData.items.map((item) => (
            <div
              key={item.id}
              className="py-3 flex justify-between items-start"
            >
              <div className="flex-1 mr-2">
                <p className="font-medium text-sm text-black dark:text-white">
                  {item.name}
                </p>
                {item.variants && item.variants.length > 1 && (
                  <div className="flex mt-1.5 gap-1 flex-wrap">
                    {item.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => handleVariantChange(item.id, index)}
                        className={`px-2 py-0.5 text-xs rounded-full border transition ${
                          (selectedVariants[item.id] ?? 0) === index
                            ? "bg-yellow-500 border-yellow-500 text-black font-medium"
                            : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-end flex-shrink-0">
                <span className="font-medium text-sm text-black dark:text-white mb-1">
                  {renderPrice(item)}
                </span>
                <button
                  onClick={() => toggleSelectItem(item.id)}
                  className="p-1 rounded-full text-red-500 hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const CheckoutContent = () => (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-black dark:text-white font-semibold">
            Total
          </span>
          <span className="text-yellow-500 font-bold">
            {formatPrice(cartData.total)}
          </span>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-sm">
        <p className="text-black dark:text-white font-semibold mb-3">
          Select Payment Method
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod("razorpay")}
            className={`w-full px-4 py-2 rounded-lg border text-sm font-medium transition-all
        ${
          paymentMethod === "razorpay"
            ? "bg-yellow-500 text-black border-yellow-500 shadow"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        }`}
            disabled={isProcessing}
          >
            Online Payment
          </button>

          <button
            onClick={() => setPaymentMethod("cod")}
            className={`w-full px-4 py-2 rounded-lg border text-sm font-medium transition-all
        ${
          paymentMethod === "cod"
            ? "bg-yellow-500 text-black border-yellow-500 shadow"
            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
        }`}
            disabled={isProcessing}
          >
            Cash on Delivery
          </button>
        </div>
      </div>
    </div>
  );

  const Footer = () => {
    if (!isCheckoutView) {
      return (
        <div className="space-y-3">
          {cartData.items.length > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Subtotal
              </span>
              <span className="font-bold text-base text-yellow-500">
                {formatPrice(cartData.total)}
              </span>
            </div>
          )}
          <div
            className={`grid ${
              cartData.items.length > 0 ? "grid-cols-2" : "grid-cols-1"
            } gap-2`}
          >
            {cartData.items.length > 0 && (
              <button
                onClick={resetCart}
                className="py-2.5 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium"
              >
                Clear Cart
              </button>
            )}
            <button
              onClick={() =>
                cartData.items.length > 0 && setIsCheckoutView(true)
              }
              disabled={cartData.items.length === 0}
              className="py-2.5 bg-yellow-500 text-black font-medium rounded-xl hover:bg-yellow-400 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {cartData.items.length === 0 ? "Cart Empty" : "Continue"}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex space-x-3">
          <button
            onClick={() => !isProcessing && setIsCheckoutView(false)}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing || cartData.items.length === 0}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2.5 px-4 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-sm"
          >
            {isProcessing ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Checkout"
            )}
          </button>
        </div>
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isProcessing && setIsOpen(false)}
      title={
        isCheckoutView
          ? "Confirm Your Order"
          : `Your Cart (${cartData.items.length})`
      }
      footer={<Footer />}
      isLoading={isProcessing}
    >
      <div className="max-h-[60vh] pr-1">
        {isCheckoutView ? <CheckoutContent /> : <CartContent />}
      </div>
    </Modal>
  );
};

export default CartView;
