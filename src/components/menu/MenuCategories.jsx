import React from "react";
import { Edit2, Trash2, ChevronRight, Plus, X, Loader2 } from "lucide-react";
import { useMenu } from "../../context/MenuContext";

const DEFAULT_IMAGE = "";

const MenuCategories = ({
  openEditCategoryModal,
  handleDeleteCategory,
  openAddItemModal,
  openEditItemModal,
  handleDeleteItem,
  registerCategoryRef,
}) => {
  const {
    menuData,
    loadingState,
    isAdmin,
    expandedCategory,
    selectedItems,
    toggleCategoryExpansion,
    toggleSelectItem,
    tabParams,
  } = useMenu();

  const handleImageError = (e) => {
    if (e.target.src !== DEFAULT_IMAGE) {
      e.target.onerror = null;
      e.target.src = DEFAULT_IMAGE;
    }
  };

  const isBusy = loadingState.initial || loadingState.saving;
  const isItemsLoadingFor = (categoryId) =>
    loadingState.items && expandedCategory === categoryId;

  return (
    <div className="flex flex-col gap-4">
      {menuData.length === 0 && !loadingState.initial && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No menu categories found.
        </p>
      )}
      {menuData.map((category) => {
        const isExpanded = expandedCategory === category.id;
        const isLoadingItems = isItemsLoadingFor(category.id);

        return (
          <div
            key={category.id}
            ref={(el) => registerCategoryRef(category.id, el)}
            className="bg-gray-900 rounded-2xl overflow-hidden shadow transition"
          >
            <div
              className="relative cursor-pointer group"
              onClick={() => toggleCategoryExpansion(category.id)}
            >
              <div className="h-32 relative">
                <img
                  src={category.image || DEFAULT_IMAGE}
                  alt={category.category || category.name || "Category"}
                  className="w-full h-full object-cover brightness-80"
                  onError={handleImageError}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-between p-4">
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
                          openEditCategoryModal(category);
                        }}
                        className="bg-gray-800 bg-opacity-80 p-2 rounded-full hover:bg-yellow-500 hover:text-black text-white transition disabled:opacity-50"
                        disabled={isBusy}
                        aria-label={`Edit category ${category.name}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        title="Delete Category"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        className="bg-red-700 bg-opacity-80 p-2 rounded-full hover:bg-red-500 text-white transition disabled:opacity-50"
                        disabled={isBusy}
                        aria-label={`Delete category ${category.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                  <div
                    title={isExpanded ? "Collapse" : "Expand"}
                    className={`bg-gray-800 bg-opacity-80 p-2 rounded-full transition transform text-white ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                    aria-expanded={isExpanded}
                  >
                    {isLoadingItems ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-2">
                {!isLoadingItems &&
                  category.items?.map((item) => {
                    const isSelected = !!selectedItems[item.id];
                    const isHighlighted =
                      tabParams?.itemId === item.id && !isSelected;

                    return (
                      <div
                        key={item.id}
                        className={`flex justify-between items-center p-3 rounded-xl transition ${
                          isAdmin
                            ? "hover:bg-gray-800"
                            : isSelected
                            ? "bg-gray-800 ring-1 ring-yellow-600 cursor-pointer"
                            : isHighlighted
                            ? "bg-gray-800 ring-1 ring-yellow-400 cursor-pointer"
                            : "hover:bg-gray-800 cursor-pointer"
                        }`}
                        onClick={
                          !isAdmin ? () => toggleSelectItem(item.id) : undefined
                        }
                        role={!isAdmin ? "button" : undefined}
                        tabIndex={!isAdmin ? 0 : undefined}
                        aria-pressed={!isAdmin ? isSelected : undefined}
                      >
                        <div className="flex items-center flex-1 mr-3 overflow-hidden">
                          {!isAdmin && (
                            <div
                              className={`w-5 h-5 rounded-full border border-yellow-500 mr-3 flex-shrink-0 flex items-center justify-center transition ${
                                isSelected ? "bg-yellow-500" : ""
                              }`}
                              aria-hidden="true"
                            >
                              {isSelected && (
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
                            {item.variants?.length > 0 ? (
                              item.variants.map((v, i) => (
                                <span key={`${item.id}-${v.name}-${i}`}>
                                  ₹{v.price}
                                  {i < item.variants.length - 1 && (
                                    <span className="mx-1 text-gray-500">
                                      /
                                    </span>
                                  )}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 italic">
                                No price
                              </span>
                            )}
                          </span>
                          {isAdmin && (
                            <div className="flex items-center space-x-1">
                              <button
                                title="Edit Item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditItemModal(item, category.id);
                                }}
                                className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded-full transition disabled:opacity-50"
                                disabled={isBusy}
                                aria-label={`Edit item ${item.name}`}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                title="Delete Item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item.id, category.id);
                                }}
                                className="text-red-500 hover:text-red-400 p-1 hover:bg-gray-700 rounded-full transition disabled:opacity-50"
                                disabled={isBusy}
                                aria-label={`Delete item ${item.name}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {!isLoadingItems && category.items?.length === 0 && (
                  <p className="text-center text-gray-500 py-2">
                    No items in this category.
                  </p>
                )}
                {isAdmin && !isLoadingItems && (
                  <button
                    onClick={() => openAddItemModal(category.id)}
                    className="flex items-center justify-center w-full p-3 text-yellow-500 hover:text-yellow-400 bg-gray-800 hover:bg-gray-700 rounded-xl mt-3 transition disabled:opacity-50"
                    disabled={isBusy}
                  >
                    <Plus size={18} className="mr-2" /> Add New Item
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MenuCategories;
