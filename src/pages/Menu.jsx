import React, { useState, useEffect, useRef, useCallback } from "react";
import { BaggageClaim, Plus, Loader2 } from "lucide-react";
import { useMenu, MenuProvider } from "../context/MenuContext";
import MenuItemModal from "../components/menu/MenuItemModal";
import CategoryModal from "../components/menu/CategoryModal";
import MenuCategories from "../components/menu/MenuCategories";

const MODAL_TYPES = {
  NONE: null,
  ITEM: "item",
  CATEGORY: "category",
};

const MenuContent = () => {
  const {
    isAdmin,
    loadingState,
    error,
    clearError,
    tabParams,
    selectedItems,
    getCartDetails,
    resetCart,
    addCategory,
    updateCategory,
    deleteCategory,
    addItem,
    updateItem,
    deleteItem,
    toggleCategoryExpansion,
    toggleSelectItem,
    expandedCategory,
  } = useMenu();

  const [modalState, setModalState] = useState({
    type: MODAL_TYPES.NONE,
    data: null,
    categoryId: null,
    isNew: false,
  });

  const categoryRefs = useRef({});
  const initialParamsProcessed = useRef(false);
  const targetCategoryId = useRef(null);
  useEffect(() => {
    const { categoryId } = tabParams || {};

    if (!categoryId || categoryId !== targetCategoryId.current) {
      initialParamsProcessed.current = false;
      targetCategoryId.current = categoryId;
    }

    if (
      categoryId &&
      !initialParamsProcessed.current &&
      expandedCategory !== categoryId
    ) {
      toggleCategoryExpansion(categoryId);
    }
  }, [tabParams, expandedCategory, toggleCategoryExpansion]);

  useEffect(() => {
    const { categoryId, itemId } = tabParams || {};

    if (
      categoryId &&
      expandedCategory === categoryId &&
      !loadingState.items &&
      !initialParamsProcessed.current
    ) {
      const element = categoryRefs.current[expandedCategory];
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          if (itemId) {
            setTimeout(() => {
              toggleSelectItem(itemId);
            }, 100);
          }
        });
        initialParamsProcessed.current = true;
      } else {
        console.warn(`Ref for category ${expandedCategory} not found.`);
        initialParamsProcessed.current = true;
      }
    }
  }, [tabParams, expandedCategory, loadingState.items, toggleSelectItem]);

  const openModal = (type, options = {}) =>
    setModalState({
      type,
      data: options.data || null,
      categoryId: options.categoryId || null,
      isNew: options.isNew || false,
    });

  const closeModal = () =>
    setModalState({
      type: MODAL_TYPES.NONE,
      data: null,
      categoryId: null,
      isNew: false,
    });

  const handleSaveItem = async (categoryId, itemId, name, variants) => {
    try {
      const categoryForRefetch = modalState.isNew
        ? categoryId
        : modalState.data?.categoryId;
      if (modalState.isNew) {
        await addItem(categoryId, name, variants);
      } else {
        await updateItem(itemId, name, variants, categoryForRefetch);
      }
      closeModal();
    } catch (err) {
      console.error("Save Item Error:", err);
      alert(`Failed to save item: ${err?.message || "Unknown error"}`);
    }
  };

  const handleDeleteItem = async (itemId, categoryId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteItem(itemId, categoryId);
      } catch (err) {
        console.error("Delete Item Error:", err);
        alert(`Failed to delete item: ${err?.message || "Unknown error"}`);
      }
    }
  };

  const handleSaveCategory = async (categoryId, name, image) => {
    try {
      if (modalState.isNew) await addCategory(name, image);
      else await updateCategory(categoryId, name, image);
      closeModal();
    } catch (err) {
      console.error("Save Category Error:", err);
      alert(`Failed to save category: ${err?.message || "Unknown error"}`);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Delete this category and all its items?")) {
      try {
        await deleteCategory(categoryId);
      } catch (err) {
        console.error("Delete Category Error:", err);
        alert(`Failed to delete category: ${err?.message || "Unknown error"}`);
      }
    }
  };

  const handleProceedOrder = () => {
    const { items, total } = getCartDetails();
    if (items.length === 0) return alert("Please select at least one item");
    alert(`Order placed with ${items.length} items for ₹${total}`);
    resetCart();
  };

  const registerCategoryRef = useCallback((id, element) => {
    if (element) categoryRefs.current[id] = element;
    else delete categoryRefs.current[id];
  }, []);

  const isBusy = loadingState.initial || loadingState.saving;
  const selectedCount = Object.keys(selectedItems).length;

  return (
    <div className="bg-gray-950 text-white min-h-screen pb-20">
      <div className="sticky top-0 z-30 bg-gray-900 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
              RFP MENU
            </h1>
          </div>

          {!isAdmin ? (
            <button
              onClick={() => alert("Cart view not implemented yet.")}
              disabled={isBusy}
              className="bg-yellow-500 text-black px-4 py-2 rounded-full flex items-center shadow transform transition hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              <BaggageClaim size={18} />
              <span className="ml-2 font-medium">{selectedCount}</span>
            </button>
          ) : (
            <button
              onClick={() => openModal(MODAL_TYPES.CATEGORY, { isNew: true })}
              disabled={isBusy}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full flex items-center shadow transform transition hover:scale-105 disabled:opacity-50 disabled:scale-100"
            >
              <Plus size={18} />
              <span className="ml-2 font-medium">Add Category</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 relative">
        {(loadingState.initial || loadingState.saving) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
            <Loader2 size={40} className="animate-spin text-yellow-500" />
          </div>
        )}

        {error && (
          <div
            className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-4 text-center sticky top-16 z-20"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              onClick={clearError}
              className="absolute top-0 right-0 mt-2 mr-3 text-red-200 hover:text-white"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}

        <MenuCategories
          openEditCategoryModal={(category) =>
            openModal(MODAL_TYPES.CATEGORY, { data: category, isNew: false })
          }
          handleDeleteCategory={handleDeleteCategory}
          openAddItemModal={(catId) =>
            openModal(MODAL_TYPES.ITEM, { categoryId: catId, isNew: true })
          }
          openEditItemModal={(item, categoryId) =>
            openModal(MODAL_TYPES.ITEM, {
              data: { ...item, categoryId },
              isNew: false,
            })
          }
          handleDeleteItem={handleDeleteItem}
          registerCategoryRef={registerCategoryRef}
        />
      </div>

      {isAdmin && (
        <>
          <MenuItemModal
            isOpen={modalState.type === MODAL_TYPES.ITEM}
            onClose={closeModal}
            item={modalState.data}
            categoryId={modalState.categoryId}
            onSave={handleSaveItem}
            isNewItem={modalState.isNew}
            isLoading={loadingState.saving}
          />
          <CategoryModal
            isOpen={modalState.type === MODAL_TYPES.CATEGORY}
            onClose={closeModal}
            category={modalState.data}
            onSave={handleSaveCategory}
            isNewCategory={modalState.isNew}
            isLoading={loadingState.saving}
          />
        </>
      )}
    </div>
  );
};

const Menu = ({ isAdmin }) => (
  <MenuProvider isAdmin={isAdmin}>
    <MenuContent />
  </MenuProvider>
);

export default Menu;
