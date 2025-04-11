import React from "react";
import { Edit2, Trash2, ChevronRight, Plus, X, Loader2 } from "lucide-react";
import { useMenu } from "../../context/MenuContext";

const DEFAULT_IMAGE = "https://placehold.co/600x400/333/555?text=No+Image";

// MenuItem Component
const MenuItem = React.memo(
  ({
    item,
    categoryId,
    isAdmin,
    isSelected,
    isHighlighted,
    isBusy,
    toggleSelectItem,
    openEditItemModal,
    handleDeleteItem,
  }) => {
    return (
      <div
        className={`flex justify-between items-center p-3 rounded-xl ${
          isAdmin
            ? "hover:bg-gray-800/60"
            : isSelected
            ? "bg-gray-800 ring-1 ring-yellow-600 cursor-pointer"
            : isHighlighted
            ? "bg-gray-800 ring-1 ring-yellow-400 cursor-pointer"
            : "hover:bg-gray-800/60 cursor-pointer"
        }`}
        onClick={!isAdmin ? () => toggleSelectItem(item.id) : undefined}
        role={!isAdmin ? "button" : undefined}
        tabIndex={!isAdmin ? 0 : undefined}
        aria-pressed={!isAdmin ? isSelected : undefined}
      >
        <div className="flex items-center flex-1 mr-3 overflow-hidden">
          {!isAdmin && (
            <div
              className={`w-5 h-5 rounded-full border border-yellow-500 mr-3 flex-shrink-0 flex items-center justify-center ${
                isSelected ? "bg-yellow-500" : "bg-gray-900"
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
        <div className="flex items-center flex-shrink-0 space-x-2">
          <span className="font-semibold text-yellow-500 text-sm md:text-base">
            {item.variants?.length > 0 ? (
              item.variants.map((v, i) => (
                <React.Fragment key={`${item.id}-${v.name}-${i}`}>
                  ₹{parseFloat(v.price || 0).toFixed(2)}
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
                onClick={(e) => {
                  e.stopPropagation();
                  openEditItemModal(item, categoryId);
                }}
                className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-700 rounded-full transition disabled:opacity-50"
                disabled={isBusy}
                aria-label={`Edit item ${item.name}`}
              >
                <Edit2 size={14} />
              </button>
              <button
                title="Delete Item"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id, categoryId);
                }}
                className="text-red-500 hover:text-red-400 p-1.5 hover:bg-gray-700 rounded-full transition disabled:opacity-50"
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
  }
);

// MenuCategory Component
const MenuCategory = React.memo(
  ({
    category,
    registerCategoryRef,
    openEditCategoryModal,
    handleDeleteCategory,
    openAddItemModal,
    openEditItemModal,
    handleDeleteItem,
  }) => {
    const {
      isAdmin,
      expandedCategory,
      selectedItems,
      toggleCategoryExpansion,
      toggleSelectItem,
      loadingState,
      tabParams,
    } = useMenu();

    const isExpanded = expandedCategory === category.id;
    const isLoadingItems =
      loadingState.items && expandedCategory === category.id;
    const isBusy = loadingState.initial || loadingState.saving;

    const handleImageError = (e) => {
      if (e.target.src !== DEFAULT_IMAGE) {
        e.target.onerror = null;
        e.target.src = DEFAULT_IMAGE;
      }
    };

    return (
      <div
        ref={(el) => registerCategoryRef(category.id, el)}
        className="bg-gray-900 rounded-2xl overflow-hidden shadow-md transition-all duration-300 ease-in-out"
      >
        {/* Category Header */}
        <div
          className="relative cursor-pointer group"
          onClick={() => toggleCategoryExpansion(category.id)}
          role="button"
          aria-expanded={isExpanded}
          aria-controls={`category-content-${category.id}`}
        >
          <div className="h-32 relative">
            <img
              src={category.image || DEFAULT_IMAGE}
              alt={category.name || "Category"}
              className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
              onError={handleImageError}
              loading="lazy"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditCategoryModal(category);
                    }}
                    className="bg-gray-800/80 p-2 rounded-full hover:bg-yellow-500 hover:text-black text-white transition disabled:opacity-50 backdrop-blur-sm"
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
                    className="bg-red-700/80 p-2 rounded-full hover:bg-red-500 text-white transition disabled:opacity-50 backdrop-blur-sm"
                    disabled={isBusy}
                    aria-label={`Delete category ${category.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}

              <div
                title={isExpanded ? "Collapse" : "Expand"}
                className={`bg-gray-800/80 p-2 rounded-full text-white backdrop-blur-sm transition-all duration-300 ${
                  isExpanded && !isLoadingItems ? "rotate-90" : ""
                }`}
              >
                {isLoadingItems ? (
                  <Loader2 size={16} className="animate-spin text-yellow-400" />
                ) : (
                  <ChevronRight size={16} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Items */}
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
                    className="h-14 rounded-xl bg-gray-800 animate-pulse w-full"
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
                  isAdmin={isAdmin}
                  isSelected={!!selectedItems[item.id]}
                  isHighlighted={
                    tabParams?.itemId === item.id && !selectedItems[item.id]
                  }
                  isBusy={isBusy}
                  toggleSelectItem={toggleSelectItem}
                  openEditItemModal={openEditItemModal}
                  handleDeleteItem={handleDeleteItem}
                />
              ))}

            {isExpanded &&
              !isLoadingItems &&
              (!category.items || category.items.length === 0) && (
                <p className="text-center text-gray-500 py-3 text-sm italic">
                  No items in this category.
                </p>
              )}

            {isExpanded && isAdmin && !isLoadingItems && (
              <button
                onClick={() => openAddItemModal(category.id)}
                className="flex items-center justify-center w-full p-2.5 text-yellow-500 hover:text-yellow-400 bg-gray-800/60 hover:bg-gray-700/80 rounded-xl mt-3 transition disabled:opacity-50 text-sm font-medium"
                disabled={isBusy}
              >
                <Plus size={16} className="mr-1.5" /> Add New Item
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// MenuCategories Component
const MenuCategories = ({
  openEditCategoryModal,
  handleDeleteCategory,
  openAddItemModal,
  openEditItemModal,
  handleDeleteItem,
  registerCategoryRef,
}) => {
  const { menuData, loadingState, isAdmin } = useMenu();

  if (loadingState.initial) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl h-48 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (menuData.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-lg">
        No menu categories found.
        <br />
        {isAdmin && "Click 'Add Category' to get started."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {menuData.map((category) => (
        <MenuCategory
          key={category.id}
          category={category}
          registerCategoryRef={registerCategoryRef}
          openEditCategoryModal={openEditCategoryModal}
          handleDeleteCategory={handleDeleteCategory}
          openAddItemModal={openAddItemModal}
          openEditItemModal={openEditItemModal}
          handleDeleteItem={handleDeleteItem}
        />
      ))}
    </div>
  );
};

export default MenuCategories;
