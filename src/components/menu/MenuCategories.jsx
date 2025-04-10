import { useState } from "react";
import { Edit2, Trash2, ChevronRight, Plus, X } from "lucide-react";

const DEFAULT_IMAGE = "/api/placeholder/600/400";

const MenuCategories = ({
  menuData,
  isLoading,
  isAdmin,
  expandedCategory,
  selectedItems,
  toggleCategory,
  openEditCategoryModal,
  handleDeleteCategory,
  openAddItemModal,
  openEditItemModal,
  handleDeleteItem,
  toggleSelectItem,
}) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_IMAGE;
  };

  return (
    <div className="flex flex-col gap-4">
      {menuData.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No menu categories found.
        </p>
      )}
      {menuData.map((category) => (
        <div
          key={category.id}
          className="bg-gray-900 rounded-2xl overflow-hidden shadow transition"
        >
          <div
            className="relative cursor-pointer group"
            onClick={() => toggleCategory(category.id)}
          >
            <div className="h-32 relative">
              <img
                src={category.image || DEFAULT_IMAGE}
                alt={category.category || category.name || "Category"}
                className="w-full h-full object-cover brightness-80"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-4">
              {/* Left Info */}
              <div className="bg-black bg-opacity-70 px-4 py-2 rounded-xl backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white">
                  {category.category || category.name}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <>
                    <button
                      title="Edit Category"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditCategoryModal(category.id);
                      }}
                      className="bg-gray-800 bg-opacity-80 p-2 rounded-full hover:bg-yellow-500 hover:text-black text-white transition"
                      disabled={isLoading}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      title="Delete Category"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="bg-red-700 bg-opacity-80 p-2 rounded-full hover:bg-red-500 text-white transition"
                      disabled={isLoading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
                <div
                  title={
                    expandedCategory === category.id ? "Collapse" : "Expand"
                  }
                  className={`bg-gray-800 bg-opacity-80 p-2 rounded-full transition transform text-white ${
                    expandedCategory === category.id ? "rotate-90" : ""
                  }`}
                >
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>

          {expandedCategory === category.id && (
            <div className="p-4 space-y-2">
              {category.items?.map((item) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center p-3 rounded-xl transition ${
                    isAdmin
                      ? "hover:bg-gray-800"
                      : selectedItems[item.id]
                      ? "bg-gray-800 ring-1 ring-yellow-600"
                      : "hover:bg-gray-800 cursor-pointer"
                  }`}
                  onClick={
                    !isAdmin ? () => toggleSelectItem(item.id) : undefined
                  }
                >
                  <div className="flex items-center flex-1 mr-3 overflow-hidden">
                    {!isAdmin && (
                      <div
                        className={`w-5 h-5 rounded-full border border-yellow-500 mr-3 flex-shrink-0 flex items-center justify-center transition ${
                          selectedItems[item.id] ? "bg-yellow-500" : ""
                        }`}
                      >
                        {selectedItems[item.id] && (
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                        )}
                      </div>
                    )}
                    <span
                      className="text-base font-medium text-white truncate"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center flex-shrink-0">
                    <span className="font-bold text-yellow-500 mr-3">
                      {item.variants.map((v, i) => (
                        <span key={i}>
                          ₹{v.price}
                          {i !== item.variants.length - 1 && (
                            <span className="mx-1">/</span>
                          )}
                        </span>
                      ))}
                    </span>
                    {isAdmin && (
                      <div className="flex items-center space-x-1">
                        <button
                          title="Edit Item"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditItemModal(category.id, item.id);
                          }}
                          className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded-full transition"
                          disabled={isLoading}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          title="Delete Item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(category.id, item.id);
                          }}
                          className="text-red-500 hover:text-red-400 p-1 hover:bg-gray-700 rounded-full transition"
                          disabled={isLoading}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAdmin && (
                <button
                  onClick={() => openAddItemModal(category.id)}
                  className="flex items-center justify-center w-full p-3 text-yellow-500 hover:bg-gray-800 rounded-xl mt-3 transition"
                  disabled={isLoading}
                >
                  <Plus size={18} className="mr-2" /> Add New Item
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuCategories;
