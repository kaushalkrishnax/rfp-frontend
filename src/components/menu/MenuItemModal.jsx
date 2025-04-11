import React, { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";

const MenuItemModal = ({ isOpen, onClose, modalData, onSave, isLoading }) => {
  const { item, categoryId, isNew } = modalData || {};

  const [name, setName] = useState("");

  const defaultVariants = useMemo(
    () => [
      { name: "Half", price: "" },
      { name: "Full", price: "" },
      { name: "Custom", price: "" },
    ],
    []
  );

  const [variants, setVariants] = useState(defaultVariants);

  useEffect(() => {
    if (isOpen && modalData) {
      setName(item?.name ?? "");

      const loadedVariantMap =
        item?.variants?.reduce((acc, v) => {
          acc[v.name] = v.price ?? "";
          return acc;
        }, {}) || {};

      setVariants(
        defaultVariants.map((dv) => ({
          ...dv,
          price:
            loadedVariantMap[dv.name] !== undefined
              ? String(loadedVariantMap[dv.name])
              : "",
        }))
      );
    } else if (!isOpen) {
      setName("");
      setVariants(defaultVariants);
    }
  }, [modalData, isOpen, item, defaultVariants]);

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

        price: parseFloat(v.price),
      }))

      .filter((v) => v.name && !isNaN(v.price) && v.price >= 0);

    if (!finalName) {
      alert("Please enter an item name.");
      return;
    }
    if (cleanedVariants.length === 0) {
      alert(
        "Please add at least one valid price (e.g., Half: 50). Price must be 0 or greater."
      );
      return;
    }

    if (!categoryId) {
      console.error("Category ID is missing for save operation.");
      alert("Cannot save item: Category information is missing.");
      return;
    }

    if (isNew) {
      onSave(categoryId, finalName, cleanedVariants);
    } else {
      onSave(item.id, finalName, cleanedVariants, categoryId);
    }
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
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Item"}
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? "Add Menu Item" : "Edit Menu Item"}
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
            Prices
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
                  inputMode="number"
                  placeholder="0"
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
