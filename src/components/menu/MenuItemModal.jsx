import { useState, useEffect } from "react";
import { X } from "lucide-react";

const MenuItemModal = ({
  isOpen,
  onClose,
  item,
  categoryId,
  onSave,
  isNewItem,
}) => {
  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || "");

  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setPrice(item.price || "");
    } else {
      setName("");
      setPrice("");
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      alert("Name and price cannot be empty");
      return;
    }
    onSave(categoryId, item?.id || `new-${Date.now()}`, name, price);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isNewItem ? "Add Menu Item" : "Edit Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              placeholder="Enter item name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Price (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                ₹
              </span>
              <input
                type="text"
                value={price}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setPrice(value);
                }}
                className="w-full bg-gray-800 text-white pl-8 pr-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
                placeholder="Enter price"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-3 px-4 rounded-xl transition transform hover:scale-105"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
