import React, { useContext, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BaggageClaim, Plus, Loader2 } from "lucide-react";
import { useMenu, MenuProvider } from "../context/MenuContext";
import AppContext from "../context/AppContext";
import MenuItemModal from "../components/menu/MenuItemModal";
import CategoryModal from "../components/menu/CategoryModal";
import CartModal from "../components/menu/CartModal";
import MenuCategories from "../components/menu/MenuCategories";
import rfpLogo from "../assets/rfp.png";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

const MODAL_TYPES = {
  ITEM: "item",
  CATEGORY: "category",
  CART: "cart",
  NONE: null,
};

const MenuContent = () => {
  const navigate = useNavigate();

  const {
    isAdmin,
    loadingState,
    selectedItems,
    resetCart,
    modalState,
    openCategoryModal,
    openCartModal,
    closeModal,
    addCategory,
    updateCategory,
    addItem,
    updateItem,
    createRazorpayOrder,
    verifyRazorpayOrder,
    createCodOrder,
    registerCategoryRef,
    setActiveTab,
    userInfo,
  } = useMenu();

  const selectedCount = Object.keys(selectedItems).length;
  const isBusy = loadingState.initial || loadingState.saving;

  const checkoutHandler = useCallback(
    async (items, amount) => {
      if (!RAZORPAY_KEY_ID) {
        alert(
          "Razorpay configuration missing. Cannot proceed with online payment."
        );
        throw new Error("Razorpay Key ID not configured.");
      }
      if (!userInfo) {
        alert("User information not available. Cannot proceed.");
        throw new Error("User info missing for checkout.");
      }

      try {
        const { data: order } = await createRazorpayOrder(amount);
        if (!order || !order.id || !order.amount) {
          throw new Error(
            "Failed to create Razorpay order. Invalid response received."
          );
        }

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Royal Food Plaza",
          description: "RFP Order Payment",
          image: rfpLogo,
          order_id: order.id,
          handler: async function (response) {
            if (
              response.razorpay_payment_id &&
              response.razorpay_order_id &&
              response.razorpay_signature
            ) {
              try {
                const verificationResult = await verifyRazorpayOrder(
                  order.id,
                  response.razorpay_payment_id,
                  response.razorpay_signature,
                  items,
                  amount
                );

                if (verificationResult?.success) {
                  alert(
                    `Order placed successfully! Total: ₹${amount.toFixed(2)}`
                  );
                  resetCart();
                  closeModal();
                  navigate(`/orders?order_id=${verificationResult?.data?.id}`);
                } else {
                  alert(
                    `Order verification failed: ${
                      verificationResult?.message || "Please contact support."
                    }`
                  );
                }
              } catch (verifyError) {
                console.error("Error verifying payment:", verifyError);
                alert(
                  `Payment verification failed: ${
                    verifyError.message ||
                    "An unexpected error occurred. Please contact support."
                  }`
                );
              }
            } else {
              console.error(
                "Payment success response missing required fields:",
                response
              );
              alert(
                "Payment successful, but verification failed due to missing information. Please contact support."
              );
            }
          },
          prefill: {
            name: userInfo.full_name || "",
            contact: userInfo.phone || "",
          },
          notes: {
            address: userInfo.address || "Not provided",
            user_id: userInfo.id,
          },
          theme: {
            color: "#F59E0B",
          },
          modal: {
            ondismiss: function () {
              console.log("Razorpay payment modal dismissed.");
            },
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();

        razor.on("payment.failed", function (response) {
          console.error("Razorpay Payment Failed:", response.error);
          let message = "Payment failed.";
          if (response.error.description)
            message += ` ${response.error.description}`;
          if (response.error.reason)
            message += ` Reason: ${response.error.reason}.`;
          alert(message + " Please try again or use COD.");
        });
      } catch (error) {
        console.error("Error initiating Razorpay checkout:", error);
        alert(
          `Failed to start online payment: ${
            error.message || "Please try again later or use COD."
          }`
        );

        throw error;
      }
    },
    [
      createRazorpayOrder,
      verifyRazorpayOrder,
      userInfo,
      resetCart,
      setActiveTab,
      closeModal,
    ]
  );

  const handleProceedOrder = useCallback(
    async (paymentMethod, items, total) => {
      if (items.length === 0) {
        alert("Your cart is empty.");
        throw new Error("Cart is empty");
      }

      try {
        if (paymentMethod === "cod") {
          const response = await createCodOrder(items, total);
          if (response?.success) {
            alert(`COD Order placed successfully! Total: ₹${total}`);
            resetCart();
            closeModal();
            navigate(`/orders?order_id=${response?.data?.id}`);
          } else {
            throw new Error(response?.message || "Failed to place COD order.");
          }
        } else if (paymentMethod === "razorpay") {
          await checkoutHandler(items, total);
        }
      } catch (error) {
        console.error("Order Processing Failed:", error);

        throw error;
      }
    },
    [createCodOrder, checkoutHandler, resetCart, setActiveTab, closeModal]
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20 relative">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img
              src={rfpLogo}
              alt="RFP Logo"
              className="w-6 h-6 rounded-full object-cover bg-white dark:bg-gray-900 p-0.5"
            />
            <h1 className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 tracking-tight">
              MENU
            </h1>
          </div>

          {isAdmin && (
            <button
              onClick={() => openCategoryModal()}
              disabled={isBusy}
              className="bg-yellow-500 px-3 py-1 rounded-full flex items-center shadow-md transition hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Plus size={16} />
              <span className="ml-1.5">Add Category</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 relative">
        {loadingState.initial && (
          <div className="fixed inset-0 bg-white/60 dark:bg-gray-900/60 flex justify-center items-center z-40 backdrop-blur-sm">
            <Loader2 size={32} className="animate-spin text-yellow-500" />
            <span className="ml-3 text-gray-900 dark:text-gray-100">
              Loading Menu...
            </span>
          </div>
        )}

        <MenuCategories registerCategoryRef={registerCategoryRef} />
        {!isAdmin && (
          <button
            className="fixed bottom-20 right-5 z-30 bg-yellow-500 px-3 py-2 w-20 rounded-full flex items-center shadow-md transition hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
            onClick={openCartModal}
            aria-label={`View cart (${selectedCount} items)`}
            disabled={isBusy && selectedCount === 0}
          >
            <BaggageClaim size={16} />
            {selectedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {selectedCount}
              </span>
            )}
            <span className="ml-1.5 sm:inline">Buy</span>
          </button>
        )}
      </main>

      <MenuItemModal
        isOpen={modalState.type === MODAL_TYPES.ITEM}
        onClose={closeModal}
        modalData={modalState.data}
        onSave={modalState.data?.isNew ? addItem : updateItem}
        isLoading={loadingState.saving}
      />

      <CategoryModal
        isOpen={modalState.type === MODAL_TYPES.CATEGORY}
        onClose={closeModal}
        modalData={modalState.data}
        onSave={modalState.data?.isNew ? addCategory : updateCategory}
        isLoading={loadingState.saving}
      />

      {!isAdmin && (
        <CartModal
          isOpen={modalState.type === MODAL_TYPES.CART}
          onClose={closeModal}
          handleProceedOrder={handleProceedOrder}
        />
      )}
    </div>
  );
};

const Menu = () => {
  const { rfpFetch, isAdmin } = useContext(AppContext);

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get("categoryId") || "";
  const itemId = searchParams.get("itemId") || "";

  if (!rfpFetch) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-gray-100">
        Initializing...
      </div>
    );
  }

  return (
    <MenuProvider isAdmin={isAdmin} routeParams={{ categoryId, itemId }}>
      <MenuContent />
    </MenuProvider>
  );
};

export default Menu;
