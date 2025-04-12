import React from "react";
import { Edit2, Trash2, ChevronRight, Plus, Loader2, X } from "lucide-react";
import { useMenu } from "../../context/MenuContext";

const MenuItem = React.memo(({ item, categoryId, isHighlighted }) => {
  const {
    isAdmin,
    loadingState,
    selectedItems,
    toggleSelectItem,
    openItemModal,
    deleteItem,
  } = useMenu();

  const isSelected = !!selectedItems[item.id];
  const isBusy =
    loadingState.saving || loadingState.initial || loadingState.items;

  const handleEditClick = (e) => {
    e.stopPropagation();
    openItemModal(item, categoryId);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteItem(item.id, categoryId);
  };

  const handleItemClick = () => {
    if (!isAdmin) {
      toggleSelectItem(item.id);
    }
  };

  const formatPrice = (price) => `₹${parseFloat(price)}`;

  return (
    <div
      className={`flex justify-between items-center p-3 rounded-xl transition-colors duration-150 ${
        isAdmin
          ? "hover:bg-gray-100 dark:hover:bg-gray-800"
          : isSelected
          ? "bg-yellow-100 dark:bg-yellow-900 ring-1 ring-yellow-600 cursor-pointer"
          : isHighlighted
          ? "bg-yellow-50 dark:bg-yellow-800 ring-1 ring-yellow-400 cursor-pointer"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
      }`}
      onClick={handleItemClick}
      role={!isAdmin ? "button" : undefined}
      tabIndex={!isAdmin ? 0 : undefined}
      aria-pressed={!isAdmin ? isSelected : undefined}
    >
      <div className="flex items-center flex-1 mr-3 overflow-hidden">
        {!isAdmin && (
          <div
            className={`w-5 h-5 rounded-full border border-yellow-500 mr-3 flex-shrink-0 flex items-center justify-center ${
              isSelected ? "bg-yellow-500" : "bg-gray-200 dark:bg-gray-700"
            }`}
            aria-hidden="true"
          >
            {isSelected && (
              <div className="w-2 h-2 bg-white dark:bg-black rounded-full"></div>
            )}
          </div>
        )}
        <span
          className="text-base font-medium text-gray-900 dark:text-white truncate"
          title={item.name}
        >
          {item.name}
        </span>
      </div>

      <div className="flex items-center flex-shrink-0 space-x-2">
        <span className="font-semibold text-yellow-600 dark:text-yellow-400 text-sm md:text-base">
          {item.variants?.length > 0 ? (
            item.variants.map((v, i) => (
              <React.Fragment key={`${item.id}-${v.name}-${i}`}>
                {formatPrice(v.price)}
                {item.variants.length > 1 && i < item.variants.length - 1 && (
                  <span className="mx-1 text-gray-500 text-xs">/</span>
                )}
              </React.Fragment>
            ))
          ) : (
            <span className="text-gray-500 italic text-sm">No price</span>
          )}
        </span>

        {isAdmin && (
          <div className="flex items-center space-x-1">
            <button
              title="Edit Item"
              onClick={handleEditClick}
              className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition disabled:opacity-50"
              disabled={isBusy}
              aria-label={`Edit item ${item.name}`}
            >
              <Edit2 size={14} />
            </button>
            <button
              title="Delete Item"
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-400 p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition disabled:opacity-50"
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
});

const MenuCategory = React.memo(({ category, registerCategoryRef }) => {
  const {
    isAdmin,
    expandedCategory,
    loadingState,
    tabParams,
    toggleCategoryExpansion,
    openCategoryModal,
    deleteCategory,
    openItemModal,
  } = useMenu();

  const isExpanded = expandedCategory === category.id;
  const isLoadingItems = loadingState.items && isExpanded;
  const isBusy = loadingState.initial || loadingState.saving;

  const handleHeaderClick = () => {
    toggleCategoryExpansion(category.id);
  };

  const handleEditCategoryClick = (e) => {
    e.stopPropagation();
    openCategoryModal(category);
  };

  const handleDeleteCategoryClick = (e) => {
    e.stopPropagation();
    deleteCategory(category.id);
  };

  const handleAddItemClick = () => {
    openItemModal(null, category.id);
  };

  return (
    <div
      ref={(el) => registerCategoryRef(category.id, el)}
      className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md transition-all duration-300 ease-in-out"
    >
      <div
        className="relative cursor-pointer group"
        onClick={handleHeaderClick}
        role="button"
        aria-expanded={isExpanded}
        aria-controls={`category-content-${category.id}`}
      >
        <div className="h-32 relative">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x300/orange/white?text=Image+Error";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-end justify-between p-3 md:p-4">
          <div className="bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-bold text-white">
              {category.name}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {isAdmin && (
              <>
                <button
                  title="Edit Category"
                  onClick={handleEditCategoryClick}
                  className="bg-gray-200 dark:bg-gray-800 p-2 rounded-full hover:bg-yellow-500 text-black dark:text-white transition disabled:opacity-50 backdrop-blur-sm"
                  disabled={isBusy}
                  aria-label={`Edit category ${category.name}`}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  title="Delete Category"
                  onClick={handleDeleteCategoryClick}
                  className="bg-red-200 dark:bg-red-800 p-2 rounded-full hover:bg-red-500 text-black dark:text-white transition disabled:opacity-50 backdrop-blur-sm"
                  disabled={isBusy}
                  aria-label={`Delete category ${category.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <div
              title={isExpanded ? "Collapse" : "Expand"}
              className={`bg-gray-200 dark:bg-gray-700 p-2 rounded-full text-black dark:text-white backdrop-blur-sm transition-all duration-300 ${
                isExpanded && !isLoadingItems ? "rotate-90" : ""
              }`}
            >
              {isLoadingItems ? (
                <Loader2 size={16} className="animate-spin text-yellow-500" />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        id={`category-content-${category.id}`}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-3 md:p-4 space-y-2">
          {isExpanded && isLoadingItems && (
            <div className="space-y-2 mt-3">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="h-14 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse w-full"
                ></div>
              ))}
            </div>
          )}

          {isExpanded &&
            !isLoadingItems &&
            category.items?.map((item) => (
              <MenuItem
                key={item.id}
                item={item}
                categoryId={category.id}
                isHighlighted={tabParams?.itemId === item.id}
              />
            ))}

          {isExpanded &&
            !isLoadingItems &&
            (!category.items || category.items.length === 0) && (
              <p className="text-center text-gray-500 py-3 text-sm italic">
                No items in this category yet.
              </p>
            )}

          {isExpanded && isAdmin && !isLoadingItems && (
            <button
              onClick={handleAddItemClick}
              className="flex items-center justify-center w-full p-2.5 text-yellow-600 dark:text-yellow-400 hover:text-yellow-500 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl mt-3 transition disabled:opacity-50 text-sm font-medium"
              disabled={isBusy}
            >
              <Plus size={16} className="mr-1.5" /> Add New Item
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

const MenuCategories = ({ registerCategoryRef }) => {
  const { menuData, loadingState, isAdmin } = useMenu();

  if (loadingState.initial) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-48 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (!menuData || menuData.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-12 px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-3 text-gray-600 dark:text-gray-400"
        >
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="M7 11h10v2H7zm0-4h10v2H7zm5 8h0" />
        </svg>
        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
          No Menu Categories Found
        </h3>
        {isAdmin && (
          <p className="text-sm mt-1">
            Click 'Add Category' in the header to get started.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {menuData.map((category) => (
        <MenuCategory
          key={category.id}
          category={category}
          registerCategoryRef={registerCategoryRef}
        />
      ))}
    </div>
  );
};

export default MenuCategories;
