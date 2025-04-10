import React, { useState } from "react";
import { X } from "lucide-react";

const MenuItemModal = ({
  isOpen,
  onClose,
  item,
  categoryId,
  onSave,
  isNewItem,
  isLoading,
}) => {
  const [name, setName] = useState(item?.name);
  const [variants, setVariants] = useState(() => {
    const variantMap = {};

    item?.variants?.forEach((v) => {
      variantMap[v.name] = v.price;
    });

    return [
      { name: "Half", price: variantMap["Half"] },
      { name: "Full", price: variantMap["Full"] },
      { name: "Custom", price: variantMap["Custom"] },
    ];
  });

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

    setName("");
    setVariants([
      { name: "Half", price: "" },
      { name: "Full", price: "" },
      { name: "Custom", price: "" },
    ]);
    onClose();
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
              Prices
            </label>
            <div className="flex space-x-4 items-start">
              <div className="flex flex-col space-x-2 mb-3 gap-2">
                {variants.slice(0, 2).map((variant, index) => (
                  <div className="flex items-center border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 w-40">
                    <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 w-ful">
                      {variant.name}:
                    </span>
                    <input
                      type="text"
                      placeholder="₹ Price"
                      value={variant.price}
                      inputMode="decimal"
                      onChange={(e) =>
                        handleVariantChange(index, "price", e.target.value)
                      }
                      className="px-3 py-2 text-sm bg-transparent text-black dark:text-white focus:outline-none w-24"
                    />
                  </div>
                ))}
              </div>
              {variants[2] && (
                <div className="flex items-center space-x-2">
                  <div className="flex flex-col items-center border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 w-full">
                      {variants[2].name}:
                    </span>
                    <input
                      type="text"
                      placeholder="₹ Price"
                      value={variants[2].price}
                      inputMode="decimal"
                      onChange={(e) =>
                        handleVariantChange(2, "price", e.target.value)
                      }
                      className="px-3 py-2 text-sm bg-transparent text-black dark:text-white focus:outline-none w-24"
                    />
                  </div>
                </div>
              )}
            </div>
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
