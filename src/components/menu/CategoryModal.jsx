import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";

const DEFAULT_IMAGE =
  "https://placehold.co/600x300/e18a3a/ffffff?text=Category+Image";

const CategoryModal = ({ isOpen, onClose, modalData, onSave, isLoading }) => {
  const { category, isNew } = modalData || {};

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    if (isOpen && modalData) {
      setName(category?.name || "");
      setImageUrl(category?.image || DEFAULT_IMAGE);
    } else if (!isOpen) {
      setName("");
      setImageUrl("");
    }
  }, [modalData, isOpen, category]);

  const handleSaveClick = async () => {
    const trimmedName = name.trim();
    const trimmedImage = imageUrl.trim();

    if (!trimmedName) {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const finalImageUrl = trimmedImage || DEFAULT_IMAGE;
      if (isNew) {
        await onSave(trimmedName, finalImageUrl);
      } else {
        await onSave(category.id, trimmedName, finalImageUrl);
      }
    } catch (error) {
      console.error("Category save failed (handled by context)");
    }
  };

  const previewImage = imageUrl.trim() || DEFAULT_IMAGE;

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
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL (optional)"
            className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 focus:outline-none transition text-sm"
            disabled={isLoading}
          />
          <div className="mt-3 relative aspect-[2/1] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
            <img
              key={previewImage}
              src={previewImage}
              alt="Category Preview"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CategoryModal;
