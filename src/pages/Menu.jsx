import React, { useState, useEffect, useRef, useCallback } from "react";
import { BaggageClaim, Plus, Loader2, AlertCircle, X } from "lucide-react";
import { useMenu, MenuProvider } from "../context/MenuContext";
import MenuItemModal from "../components/menu/MenuItemModal";
import CategoryModal from "../components/menu/CategoryModal";
import MenuCategories from "../components/menu/MenuCategories";
import CartContentModal from "../components/menu/CartView";

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
  const [isCartContentModalOpen, setIsCartContentModalOpen] = useState(false);
  const [cartDataVersion, setCartDataVersion] = useState(0);
  const categoryRefs = useRef({});
  const initialParamsProcessed = useRef(false);
  const targetCategoryId = useRef(null);

  useEffect(() => {
    const { categoryId } = tabParams || {};
    if (categoryId !== targetCategoryId.current) {
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
            inline: "nearest",
          });
          if (itemId) {
            setTimeout(() => toggleSelectItem(itemId), 300);
          }
          initialParamsProcessed.current = true;
        });
      } else {
        initialParamsProcessed.current = true;
      }
    }
  }, [tabParams, expandedCategory, loadingState.items, toggleSelectItem]);

  const refreshCartData = useCallback(() => {
    setCartDataVersion((v) => v + 1);
  }, []);

  const handleToggleSelectItem = useCallback(
    (itemId) => {
      toggleSelectItem(itemId);
      refreshCartData();
    },
    [toggleSelectItem, refreshCartData]
  );

  const handleResetCart = useCallback(() => {
    resetCart();
    setIsCartContentModalOpen(false);
    refreshCartData();
  }, [resetCart, refreshCartData]);

  const toggleCartContentModal = useCallback(() => {
    const newState = !isCartContentModalOpen;
    setIsCartContentModalOpen(newState);
    if (newState) {
      refreshCartData();
    }
  }, [isCartContentModalOpen, refreshCartData]);

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
      if (!categoryForRefetch)
        throw new Error("Missing category context for item save.");

      if (modalState.isNew) {
        await addItem(categoryForRefetch, name, variants);
      } else {
        await updateItem(itemId, name, variants, categoryForRefetch);
      }
      closeModal();
      refreshCartData();
    } catch (err) {
      console.error("Save Item Operation Failed:", err);
      alert(`Failed to save item: ${err?.message || "Please try again."}`);
    }
  };

  const handleDeleteItem = async (itemId, categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this item? This cannot be undone."
      )
    ) {
      try {
        await deleteItem(itemId, categoryId);
        refreshCartData();
      } catch (err) {
        console.error("Delete Item Operation Failed:", err);
        alert(`Failed to delete item: ${err?.message || "Please try again."}`);
      }
    }
  };

  const handleSaveCategory = async (categoryId, name, image) => {
    try {
      if (modalState.isNew) {
        await addCategory(name, image);
      } else {
        await updateCategory(categoryId, name, image);
      }
      closeModal();
      refreshCartData();
    } catch (err) {
      console.error("Save Category Operation Failed:", err);
      alert(`Failed to save category: ${err?.message || "Please try again."}`);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        "Delete this category and ALL its items? This cannot be undone."
      )
    ) {
      try {
        await deleteCategory(categoryId);
        refreshCartData();
      } catch (err) {
        console.error("Delete Category Operation Failed:", err);
        alert(
          `Failed to delete category: ${err?.message || "Please try again."}`
        );
      }
    }
  };

  const handleProceedOrder = useCallback(async () => {
    const { items, total } = getCartDetails();
    if (items.length === 0) {
      alert("Your cart is empty. Please add items before proceeding.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    alert(`Order placed successfully! Total: ₹${total}`);

    handleResetCart();
  }, [getCartDetails, handleResetCart]);

  const registerCategoryRef = useCallback((id, element) => {
    if (element) categoryRefs.current[id] = element;
    else delete categoryRefs.current[id];
  }, []);

  const getUpdatedCartDetails = useCallback(() => {
    return getCartDetails();
  }, [getCartDetails, cartDataVersion]);

  const isBusy = loadingState.initial || loadingState.saving;
  const selectedCount = Object.keys(selectedItems).length;

  const openCategoryModal = (category = null) =>
    openModal(MODAL_TYPES.CATEGORY, { data: category, isNew: !category });
  const openItemModal = (item = null, categoryId = null) =>
    openModal(
      MODAL_TYPES.ITEM,
      item
        ? { data: { ...item, categoryId }, isNew: false }
        : { categoryId, isNew: true }
    );

  const handleCloseCartContentModal = useCallback(() => {
    setIsCartContentModalOpen(false);
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen pb-20 relative">
      <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
            <h1 className="text-base sm:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 tracking-tight">
              MENU
            </h1>
          </div>

          {!isAdmin ? (
            <button
              onClick={toggleCartContentModal}
              disabled={isBusy && selectedCount === 0} // Disable only if busy AND cart empty
              className="bg-yellow-500 text-black px-3 py-1 rounded-full flex items-center shadow-md transition hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
              aria-label={`View cart (${selectedCount} items)`}
            >
              <BaggageClaim size={16} />
              <span className="ml-1.5">{selectedCount}</span>
            </button>
          ) : (
            <button
              onClick={() => openCategoryModal()}
              disabled={isBusy}
              className="bg-yellow-500 text-black px-3 py-1 rounded-full flex items-center shadow-md transition hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Plus size={16} />
              <span className="ml-1.5">Add Category</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 relative">
        {isBusy && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40 backdrop-blur-sm">
            <Loader2 size={32} className="animate-spin text-yellow-500" />
          </div>
        )}

        {error && (
          <div className="bg-red-900/90 border border-red-700 text-red-100 px-4 py-2.5 rounded-lg mb-4 text-sm sticky top-[57px] z-20 flex items-center justify-between shadow-lg">
            <div className="flex items-center">
              <AlertCircle size={18} className="mr-2 text-red-300" />
              <span>Error: {error}</span>
            </div>
            <button
              onClick={clearError}
              className="ml-3 text-red-200 hover:text-white flex-shrink-0"
              aria-label="Close error message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        <MenuCategories
          openEditCategoryModal={openCategoryModal}
          handleDeleteCategory={handleDeleteCategory}
          openAddItemModal={openItemModal}
          openEditItemModal={openItemModal}
          handleDeleteItem={handleDeleteItem}
          registerCategoryRef={registerCategoryRef}
        />

        {!isAdmin && (
          <CartContentModal
            handleProceedOrder={handleProceedOrder}
            selectedItems={selectedItems}
            getCartDetails={getUpdatedCartDetails}
            resetCart={handleResetCart}
            toggleSelectItem={handleToggleSelectItem}
            isOpen={isCartContentModalOpen}
            setIsOpen={handleCloseCartContentModal}
          />
        )}
      </main>

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
