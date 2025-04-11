import React, { useState, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [variants, setVariants] = useState([
    { name: "Half", price: "" },
    { name: "Full", price: "" },
    { name: "Custom", price: "" },
  ]);

  useEffect(() => {
    if (isOpen) {
      setName(item?.name ?? "");

      const defaultVariants = [
        { name: "Half", price: "" },
        { name: "Full", price: "" },
        { name: "Custom", price: "" },
      ];

      const loadedVariants =
        item?.variants?.reduce((acc, v) => {
          acc[v.name] = v.price ?? "";
          return acc;
        }, {}) || {};

      setVariants(
        defaultVariants.map((dv) => ({
          ...dv,
          price:
            loadedVariants[dv.name] !== undefined
              ? String(loadedVariants[dv.name])
              : "",
        }))
      );
    }
  }, [item, isOpen]);

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]:
                field === "price" ? value.replace(/[^0-9.]/g, "") : value,
            }
          : v
      )
    );
  };

  const handleSaveClick = () => {
    const finalName = name.trim();
    const cleanedVariants = variants
      .map((v) => ({
        name: v.name.trim(),
        price: parseFloat(v.price) || 0,
      }))
      .filter((v) => v.name && !isNaN(v.price) && v.price >= 0);

    if (!finalName || cleanedVariants.length === 0) {
      alert(
        "Please enter an item name and at least one valid price (e.g., Half: 50). Price must be 0 or greater."
      );
      return;
    }

    const currentCategoryId = isNewItem ? categoryId : item?.categoryId;
    if (!currentCategoryId) {
      console.error("Category ID is missing for save operation.");
      alert("Cannot save item: Category information is missing.");
      return;
    }

    onSave(
      currentCategoryId,
      isNewItem ? null : item.id,
      finalName,
      cleanedVariants
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {isNewItem ? "Add Menu Item" : "Edit Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="itemName"
              className="block text-sm text-gray-700 dark:text-gray-300 mb-2"
            >
              Item Name
            </label>
            <input
              id="itemName"
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
              Prices (Enter numbers only)
            </label>
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div className="flex items-center space-x-2" key={variant.name}>
                  <label
                    htmlFor={`variant-price-${index}`}
                    className="w-16 text-sm text-right text-gray-600 dark:text-gray-300"
                  >
                    {variant.name}:
                  </label>
                  <span className="text-gray-500 dark:text-gray-400">₹</span>
                  <input
                    id={`variant-price-${index}`}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={variant.price}
                    onChange={(e) =>
                      handleVariantChange(index, "price", e.target.value)
                    }
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:outline-none transition text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white py-3 px-4 rounded-xl transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveClick}
            disabled={isLoading}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-3 px-4 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
