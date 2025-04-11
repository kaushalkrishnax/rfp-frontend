import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";

const DEFAULT_IMAGE =
  "https://placehold.co/600x300/e18a3a/ffffff?text=Category+Image";

const CategoryModal = ({ isOpen, onClose, modalData, onSave, isLoading }) => {
  const { category, isNew } = modalData || {};

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && modalData) {
      setName(category?.name || "");
      setImageUrl(category?.image || DEFAULT_IMAGE);
      setImageError(false);
    } else if (!isOpen) {
      setName("");
      setImageUrl(DEFAULT_IMAGE);
      setImageError(false);
    }
  }, [modalData, isOpen, category]);

  const handleSaveClick = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert("Category name cannot be empty");
      return;
    }

    const finalImageUrl = imageUrl?.trim() ? imageUrl.trim() : DEFAULT_IMAGE;

    try {
      if (isNew) {
        await onSave(trimmedName, finalImageUrl);
      } else {
        await onSave(category.id, trimmedName, finalImageUrl);
      }
    } catch (error) {
      console.error("Category save failed (handled by context)");
    }
  };

  const handleImageError = () => {
    if (imageUrl !== DEFAULT_IMAGE) {
      setImageUrl(DEFAULT_IMAGE);
    }
    setImageError(true);
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
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          "Save Category"
        )}
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? "Add Category" : "Edit Category"}
      footer={footerContent}
      isLoading={isLoading}
    >
      <div className="space-y-5">
        {/* Category Name Input */}
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

        {/* Image URL Input */}
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
            value={imageUrl === DEFAULT_IMAGE ? "" : imageUrl}
            onChange={(e) => setImageUrl(e.target.value || DEFAULT_IMAGE)}
            placeholder="Enter image URL (optional)"
            className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition text-sm"
            disabled={isLoading}
          />
          {/* Image Preview */}
          <div className="mt-3 relative aspect-[2/1] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
            <img
              key={imageUrl}
              src={imageError ? DEFAULT_IMAGE : imageUrl}
              alt="Category Preview"
              onError={handleImageError}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {imageError && imageUrl !== DEFAULT_IMAGE && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <p className="text-white text-xs text-center p-2">
                  Image failed to load.
                  <br />
                  Using default.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
