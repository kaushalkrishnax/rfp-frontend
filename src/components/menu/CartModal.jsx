import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  X,
  Loader2,
  ArrowLeft,
  HandCoins,
  QrCode,
  Plus,
  Minus,
} from "lucide-react";
import Modal from "../common/Modal";
import { useMenu } from "../../context/MenuContext";

const CartModal = ({ isOpen, onClose, handleProceedOrder }) => {
  const {
    selectedItems,
    selectedVariants,
    getCartDetails,
    resetCart,
    toggleSelectItem,
    handleVariantChange,
    handleQuantityChange,
    loadingState,
  } = useMenu();

  const [isCheckoutView, setIsCheckoutView] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  const isProcessingOrder = loadingState.order;

  const cartData = useMemo(() => {
    if (!isOpen) return { items: [], amount: 0 };
    return getCartDetails();
  }, [isOpen, selectedItems, selectedVariants, getCartDetails]);

  useEffect(() => {
    if (!isOpen) {
      setIsCheckoutView(false);
    }
  }, [isOpen]);

  const handleConfirmOrder = async () => {
    try {
      await handleProceedOrder(paymentMethod, cartData.items, cartData.amount);
    } catch (error) {
      console.error("Order confirmation failed (handled by context)");
    }
  };

  const formatPrice = (price) => `₹${parseFloat(price)}`;

  const CartItemsList = () => (
    <div className="space-y-3 px-1">
      {cartData.items.map((item) => {
        const variantIndex = selectedVariants[item.id] ?? 0;
        const selectedVariant = item.variants?.[variantIndex];
        const quantity = Number(selectedItems[item.id]) || 1;

        return (
          <div
            key={item.id}
            className="bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-3 flex justify-between items-start gap-3 shadow-sm"
          >
            {/* Left section */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-sm text-black dark:text-white">
                  {item.name}
                </p>
              </div>

              {item.variants && item.variants.length > 1 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.variants.map((variant, index) => (
                    <button
                      key={`${item.id}-${variant.name}-${index}`}
                      onClick={() => handleVariantChange(item.id, index)}
                      className={`px-2 py-1 text-xs rounded-full border transition ${
                        variantIndex === index
                          ? "bg-yellow-500 border-yellow-500 text-black font-medium shadow"
                          : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {variant.name}
                      <span className="ml-1">
                        (₹{parseFloat(variant.price)})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="text-black dark:text-white">
                  {formatPrice((selectedVariant?.price ?? 0) * quantity)}
                </span>
              </p>
            </div>

            {/* Right section - Quantity controls */}
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={() =>
                  handleQuantityChange(item.id, Math.max(1, quantity - 1))
                }
                className="bg-gray-300 dark:bg-gray-600 p-1 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                <Minus size={16} className="text-black dark:text-white" />
              </button>

              <span className="text-sm font-semibold text-black dark:text-white px-2">
                {quantity}
              </span>

              <button
                onClick={() => handleQuantityChange(item.id, quantity + 1)}
                className="bg-gray-300 dark:bg-gray-600 p-1 rounded-full hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                <Plus size={16} className="text-black dark:text-white" />
              </button>
              <button
                onClick={() => toggleSelectItem(item.id)}
                className="ml-2 text-red-500 hover:text-red-400"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const CartEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ShoppingCart
        size={36}
        className="text-gray-400 dark:text-gray-500 mb-3"
      />
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">
        Your cart is empty
      </h3>
      <p className="text-gray-500 dark:text-gray-500 mt-1 text-sm">
        Add some delicious items from the menu!
      </p>
    </div>
  );

  const CheckoutOptions = () => (
    <div className="space-y-4 px-1">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-black dark:text-white font-semibold text-sm">
            Order Total
          </span>
          <span className="text-yellow-500 font-bold text-base">
            {formatPrice(cartData.amount)}
          </span>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
        <p className="text-black dark:text-white font-semibold mb-3 text-sm">
          Select Payment Method
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setPaymentMethod("razorpay")}
            className={`w-full px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              paymentMethod === "razorpay"
                ? "bg-yellow-500 text-black border-yellow-500 shadow"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
            disabled={isProcessingOrder}
          >
            <QrCode size={16} />
            Online
          </button>
          <button
            onClick={() => setPaymentMethod("cod")}
            className={`w-full px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${
              paymentMethod === "cod"
                ? "bg-yellow-500 text-black border-yellow-500 shadow"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
            disabled={isProcessingOrder}
          >
            <HandCoins size={16} />
            COD
          </button>
        </div>
      </div>
    </div>
  );

  const Footer = () => {
    const hasItems = cartData.items.length > 0;

    if (!isCheckoutView) {
      return (
        <div className="space-y-3">
          {hasItems && (
            <div className="flex justify-between px-1">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                Subtotal ({cartData.items.length} item
                {cartData.items.length !== 1 ? "s" : ""})
              </span>
              <span className="font-bold text-base text-yellow-500">
                {formatPrice(cartData.amount)}
              </span>
            </div>
          )}
          <div
            className={`grid ${hasItems ? "grid-cols-2" : "grid-cols-1"} gap-2`}
          >
            {hasItems && (
              <button
                onClick={() => {
                  resetCart();
                  setIsCheckoutView(false);
                }}
                disabled={isProcessingOrder}
                className="py-2.5 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm font-medium disabled:opacity-50"
              >
                Clear Cart
              </button>
            )}
            <button
              onClick={() => hasItems && setIsCheckoutView(true)}
              disabled={!hasItems || isProcessingOrder}
              className="py-2.5 bg-yellow-500 text-black font-medium rounded-xl hover:bg-yellow-400 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {hasItems ? "Continue" : "Cart Empty"}
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex space-x-3">
          <button
            onClick={() => !isProcessingOrder && setIsCheckoutView(false)}
            disabled={isProcessingOrder}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-sm font-medium flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleConfirmOrder}
            disabled={isProcessingOrder || !hasItems}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2.5 px-4 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-sm"
          >
            {isProcessingOrder ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              `Pay ${formatPrice(cartData.amount)}`
            )}
          </button>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isProcessingOrder && onClose()}
      title={
        isCheckoutView
          ? "Confirm Your Order"
          : `Your Cart (${cartData.items.length})`
      }
      footer={<Footer />}
      isLoading={isProcessingOrder}
    >
      {cartData.items.length === 0 && !isCheckoutView ? (
        <CartEmptyState />
      ) : isCheckoutView ? (
        <CheckoutOptions />
      ) : (
        <CartItemsList />
      )}
    </Modal>
  );
};

export default CartModal;
