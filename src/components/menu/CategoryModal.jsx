import { useState, useEffect } from "react";
import { X } from "lucide-react";

const DEFAULT_IMAGE = "https://placehold.co/600x400";

const CategoryModal = ({
  isOpen,
  onClose,
  category,
  onSave,
  isNewCategory,
}) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);

  useEffect(() => {
    setName(category?.name || "");
    setImageUrl(category?.image || DEFAULT_IMAGE);
  }, [category]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    setName("");
    setImageUrl(DEFAULT_IMAGE);
    onClose();
    onSave(category?.id, name, imageUrl);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-80 overflow-y-auto mb-16 no-scrollbar">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black dark:text-white">
            {isNewCategory ? "Add Category" : "Edit Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              autoFocus
            />
          </div>

          {/* Category Image */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="w-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-yellow-500 focus:outline-none transition"
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

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white py-3 px-4 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-3 px-4 rounded-xl transition transform hover:scale-105"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
