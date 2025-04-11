import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";

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

  const footerContent = (
    <div className="flex space-x-3">
      <button
        onClick={onClose}
        disabled={isLoading}
        className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white py-2.5 px-4 rounded-xl transition disabled:opacity-50 text-sm font-medium"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveClick}
        disabled={isLoading}
        className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2.5 px-4 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-sm"
      >
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save"}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNewItem ? "Add Menu Item" : "Edit Menu Item"}
      footer={footerContent}
      isLoading={isLoading}
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="itemName"
            className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Item Name
          </label>
          <input
            id="itemName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition text-sm"
            placeholder="Enter item name"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
            Prices (Numbers only)
          </label>
          <div className="space-y-2.5">
            {variants.map((variant, index) => (
              <div className="flex items-center space-x-2" key={variant.name}>
                <label
                  htmlFor={`variant-price-${index}`}
                  className="w-16 text-sm text-right text-gray-600 dark:text-gray-300 flex-shrink-0"
                >
                  {variant.name}:
                </label>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  ₹
                </span>
                <input
                  id={`variant-price-${index}`}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                  className="flex-1 bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition text-sm"
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MenuItemModal;
