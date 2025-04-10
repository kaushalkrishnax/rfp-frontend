import React from 'react';
import { X, BaggageClaim } from 'lucide-react';

const CartModal = ({
  isOpen,
  onClose,
  menuData,
  selectedItems,
  calculateTotal,
  handleProceedOrder,
}) => {
  if (!isOpen) return null;

  const getSelectedItemDetails = () => {
    return Object.keys(selectedItems)
      .map(itemId => {
        for (const category of menuData) {
          const item = category.items?.find(i => i.id === itemId);
          if (item) {
            return item;
          }
        }
        return null;
      })
      .filter(item => item !== null);
  };

  const itemsInCart = getSelectedItemDetails();
  const total = calculateTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl border-t border-gray-200 dark:border-gray-800 sm:border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white flex items-center">
            <BaggageClaim size={20} className="mr-2 text-yellow-500" /> Your Order
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-3 pr-2 mb-4">
          {itemsInCart.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">Your cart is empty.</p>
          ) : (
            itemsInCart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-black dark:text-white">{item.name}</span>
                <span className="font-medium text-black dark:text-yellow-500">
                   ₹{parseFloat(item.price).toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>

        {itemsInCart.length > 0 && (
             <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center text-lg font-bold mb-4">
                    <span className="text-black dark:text-white">Total:</span>
                    <span className="text-yellow-500 dark:text-yellow-500">₹{total}</span>
                </div>
                 <button
                    onClick={handleProceedOrder}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-4 rounded-xl transition transform hover:scale-105"
                >
                    Proceed to Checkout
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;