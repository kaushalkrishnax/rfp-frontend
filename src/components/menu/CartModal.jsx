import { useState } from "react";
import { X, ShoppingCart, ChevronRight, ArrowRight } from "lucide-react";

const CartModal = ({
  isOpen,
  onClose,
  menuData,
  selectedItems,
  calculateTotal,
  handleProceedOrder,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 px-4">
      <div className="bg-gray-900 rounded-2xl overflow-hidden max-w-md w-full shadow-2xl border border-gray-800">
        <div className="p-4 bg-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Your Order</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {Object.keys(selectedItems).length > 0 ? (
            <>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {Object.keys(selectedItems).map((itemId) => {
                  let foundItem = null;
                  let foundCategory = null;

                  for (const category of menuData) {
                    const item = category.items.find(
                      (item) => item.id === itemId
                    );
                    if (item) {
                      foundItem = item;
                      foundCategory = category;
                      break;
                    }
                  }

                  if (foundItem && foundCategory) {
                    return (
                      <div
                        key={itemId}
                        className="flex justify-between py-2 border-b border-gray-800"
                      >
                        <div>
                          <span className="text-yellow-500 text-sm block">
                            {foundCategory.category}
                          </span>
                          <span className="text-base">{foundItem.name}</span>
                        </div>
                        <div className="font-bold text-lg">
                          ₹{foundItem.price}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-3 mt-3">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-xl font-bold text-yellow-500">
                  ₹{calculateTotal()}
                </span>
              </div>
              <button
                onClick={handleProceedOrder}
                className="flex items-center justify-center w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-medium shadow transform transition hover:scale-105"
              >
                Buy
                <ArrowRight size={20} className="ml-2" />
              </button>
            </>
          ) : (
            <div className="py-8 text-center text-gray-400">
              <ShoppingCart size={40} className="mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
              <button
                onClick={onClose}
                className="mt-4 text-yellow-500 font-medium"
              >
                Browse Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;