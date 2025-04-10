import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const DEFAULT_IMAGE = "https://placehold.co/600x400";

const CategoryModal = ({
  isOpen,
  onClose,
  category,
  onDelete,
  isNewCategory,
}) => {
  const { rfpFetch } = useContext(AppContext);
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

    await rfpFetch(`/menu/categories/${isNewCategory ? "add" : "update"}`, {
      method: "POST",
      body: JSON.stringify({
        id: category?.id,
        name,
        image: imageUrl,
      }),
    });

    onClose();
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-gray-900 rounded-2xl p-1 w-full max-w-md mx-4 shadow-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isNewCategory ? "Add Category" : "Edit Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
              autoFocus
            />
          </div>

          {/* Category Image */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none transition"
            />

            <div className="mt-3 relative h-32 bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
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
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition"
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

        {/* Delete Button */}
        {!isNewCategory && (
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this category?")
              ) {
                onDelete(category.id);
                onClose();
              }
            }}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl transition flex items-center justify-center"
          >
            <Trash2 size={18} className="mr-2" />
            Delete Category
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryModal;
