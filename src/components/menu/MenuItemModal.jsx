import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const MenuItemModal = ({
  isOpen,
  onClose,
  item,
  categoryId,
  onSave,
  isNewItem,
  isLoading,
}) => {
  const [name, setName] = useState("");
  const [variants, setVariants] = useState([{ name: "", price: "" }]);

  useEffect(() => {
    if (isOpen) {
      setName(item?.name || "");
      setVariants(item?.variants || [{ name: "", price: "" }]);
    } else {
      setName("");
      setVariants([{ name: "", price: "" }]);
    }
  }, [item, isOpen]);

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]: field === "price" ? value.replace(/[^\d.]/g, "") : value,
            }
          : v
      )
    );
  };

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", price: "" }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const handleSaveClick = () => {
    const cleanedVariants = variants
      .map((v) => ({
        name: v.name.trim(),
        price: parseFloat(v.price),
      }))
      .filter((v) => v.name && !isNaN(v.price) && v.price >= 0);

    if (!name.trim() || cleanedVariants.length === 0) {
      alert("Please enter item name and at least one valid variant.");
      return;
    }

    onSave(categoryId, isNewItem ? null : item.id, name, cleanedVariants);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {isNewItem ? "Add Menu Item" : "Edit Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              placeholder="Enter item name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Variants & Prices
            </label>
            {variants.map((variant, index) => (
              <div key={index} className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="Variant (e.g. Half)"
                  value={variant.name}
                  onChange={(e) =>
                    handleVariantChange(index, "name", e.target.value)
                  }
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  placeholder="Price"
                  value={variant.price}
                  inputMode="decimal"
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                  className="w-24 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700"
                />
                <button
                  onClick={() => handleRemoveVariant(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddVariant}
              className="flex items-center text-sm mt-2 text-yellow-500 hover:underline"
            >
              <Plus size={16} className="mr-1" />
              Add Variant
            </button>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white py-3 px-4 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isLoading}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-3 px-4 rounded-xl transition transform hover:scale-105"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
