// src/components/menu/CategoryModal.jsx
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";

const DEFAULT_IMAGE =
  "https://placehold.co/600x400/orange/white?text=Category+Image";

const CategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
  isNewCategory,
  isLoading,
}) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    if (isOpen) {
      setName(category?.name || "");
      setImageUrl(category?.image || DEFAULT_IMAGE);
    } else {
      setName("");
      setImageUrl(DEFAULT_IMAGE);
    }
  }, [category, isOpen]);

  const handleSaveClick = async () => {
    if (!name.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    await onSave(
      category?.id,
      name.trim(),
      imageUrl
    );
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.src = DEFAULT_IMAGE;
      setImageUrl(DEFAULT_IMAGE);
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
        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save"}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNewCategory ? "Add Category" : "Edit Category"}
      footer={footerContent}
      isLoading={isLoading}
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="categoryName"
            className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Category Name
          </label>
          <input
            id="categoryName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition text-sm"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5"
          >
            Image URL
          </label>
          <input
            id="imageUrl"
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value || DEFAULT_IMAGE)}
            placeholder="Enter image URL"
            className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition text-sm"
            disabled={isLoading}
          />
          <div className="mt-3 relative h-32 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
            <img
              src={imageUrl}
              alt="Category Preview"
              onError={handleImageError}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
