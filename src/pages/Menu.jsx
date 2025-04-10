import React, { useState, useContext, useEffect, useCallback } from "react";
import { BaggageClaim, Plus, Loader2 } from "lucide-react";
import MenuItemModal from "../components/menu/MenuItemModal";
import CategoryModal from "../components/menu/CategoryModal";
import CartModal from "../components/menu/CartModal";
import MenuCategories from "../components/menu/MenuCategories";
import AppContext from "../context/AppContext";
import {
  getCategoriesAPI,
  getItemsByCategoryAPI,
  addCategoryAPI,
  updateCategoryAPI,
  removeCategoryAPI,
  addItemAPI,
  updateItemAPI,
  removeItemAPI,
} from "../services/menuApi.js";

const Menu = ({ isAdmin = true }) => {
  const { rfpFetch } = useContext(AppContext);

  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isItemsLoading, setIsItemsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const fetchInitialMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCategoriesAPI(rfpFetch);
      const categories = response?.data?.data || response?.data || [];
      if (!Array.isArray(categories)) {
        throw new Error("Invalid category data format received.");
      }
      setMenuData(categories.map((cat) => ({ ...cat, items: undefined })));
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Failed to load menu categories.");
      setMenuData([]);
    } finally {
      setIsLoading(false);
    }
  }, [rfpFetch]);

  useEffect(() => {
    fetchInitialMenu();
  }, [fetchInitialMenu]);

  const fetchAndSetItems = async (categoryId) => {
    setIsItemsLoading(true);
    setError(null);
    try {
      const response = await getItemsByCategoryAPI(rfpFetch, categoryId);
      const items = response?.data?.data || response?.data || [];
      if (!Array.isArray(items)) {
        throw new Error("Invalid item data format received.");
      }

      setMenuData((prevMenuData) =>
        prevMenuData.map((category) =>
          category.id === categoryId ? { ...category, items: items } : category
        )
      );
    } catch (err) {
      console.error(`Error fetching items for category ${categoryId}:`, err);
      setError(err.message || `Failed to load items for this category.`);
      setMenuData((prevMenuData) =>
        prevMenuData.map((category) =>
          category.id === categoryId ? { ...category, items: [] } : category
        )
      );
    } finally {
      setIsItemsLoading(false);
    }
  };

  const toggleCategory = useCallback(
    (categoryId) => {
      const isCurrentlyExpanded = expandedCategory === categoryId;
      const targetCategory = menuData.find((cat) => cat.id === categoryId);

      if (isCurrentlyExpanded) {
        setExpandedCategory(null);
      } else {
        setExpandedCategory(categoryId);
        if (targetCategory && targetCategory.items === undefined) {
          fetchAndSetItems(categoryId);
        }
      }
    },
    [expandedCategory, menuData]
  );

  const calculateTotal = () => {
    let total = 0;
    Object.keys(selectedItems).forEach((itemId) => {
      const item = menuData
        .flatMap((cat) => cat.items || [])
        .find((item) => item.id === itemId);
      if (item?.price) {
        total += parseFloat(item.price) || 0;
      }
    });
    return total.toFixed(2);
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSelection = { ...prev };
      newSelection[itemId]
        ? delete newSelection[itemId]
        : (newSelection[itemId] = true);
      return newSelection;
    });
  };

  const handleProceedOrder = () => {
    const selectedCount = Object.keys(selectedItems).length;
    if (selectedCount === 0) return alert("Please select at least one item");
    alert(`Order placed with ${selectedCount} items for ₹${calculateTotal()}`);
    setSelectedItems({});
    setShowCart(false);
  };

  const openAddItemModal = (categoryId) => {
    setCurrentCategory({ id: categoryId });
    setCurrentItem(null);
    setIsNewItem(true);
    setItemModalOpen(true);
  };

  const openEditItemModal = (categoryId, itemId) => {
    const category = menuData.find((cat) => cat.id === categoryId);
    const item = category?.items?.find((i) => i.id === itemId);
    if (item) {
      setCurrentCategory({ id: categoryId });
      setCurrentItem(item);
      setIsNewItem(false);
      setItemModalOpen(true);
    } else {
      console.error("Item not found for editing", { categoryId, itemId });
      alert("Could not find the item to edit. It might not be loaded yet.");
    }
  };

  const openAddCategoryModal = () => {
    setCurrentCategory(null);
    setIsNewCategory(true);
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (categoryId) => {
    setCurrentCategory(null);
    const category = menuData.find((cat) => cat.id === categoryId);
    if (category) {
      setCurrentCategory(category);
      setIsNewCategory(false);
      setCategoryModalOpen(true);
    } else {
      console.error("Category not found for editing");
      alert("Could not find the category to edit.");
    }
  };

  const closeItemModal = () => {
    setItemModalOpen(false);
    setCurrentItem(null);
    setCurrentCategory(null);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setCurrentCategory(null);
  };

  const handleSaveItem = async (categoryId, itemId, name, variants) => {
    setIsLoading(true);
    let needsRefetch = true;
    try {
      if (isNewItem) {
        await addItemAPI(rfpFetch, categoryId, name, variants);
      } else {
        await updateItemAPI(rfpFetch, itemId, name, variants);
      }
      closeItemModal();
    } catch (error) {
      needsRefetch = false;
      console.error("Error saving item:", error);
      alert(`Failed to save item: ${error.message || "Unknown error"}`);
    } finally {
      if (needsRefetch) {
        setMenuData((prev) =>
          prev.map((cat) =>
            cat.id === categoryId ? { ...cat, items: undefined } : cat
          )
        );
        if (expandedCategory === categoryId) {
          await fetchAndSetItems(categoryId);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    setIsLoading(true);
    let needsRefetch = true;
    try {
      await removeItemAPI(rfpFetch, itemId);
    } catch (error) {
      needsRefetch = false;
      console.error("Error deleting item:", error);
      alert(`Failed to delete item: ${error.message || "Unknown error"}`);
    } finally {
      if (needsRefetch) {
        const categoryId = menuData.find((cat) => cat.items?.some((i) => i.id === itemId))?.id;
        setMenuData((prev) =>
          prev.map((cat) =>
            cat.id === categoryId ? { ...cat, items: undefined } : cat
          )
        );
        if (expandedCategory === categoryId) {
          await fetchAndSetItems(categoryId);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleSaveCategory = async (categoryId, name, image) => {
    setIsLoading(true);
    try {
      if (isNewCategory) {
        await addCategoryAPI(rfpFetch, name, image);
      } else {
        await updateCategoryAPI(rfpFetch, categoryId, name, image);
      }
      closeCategoryModal();
      await fetchInitialMenu();
    } catch (error) {
      console.error("Error saving category:", error);
      alert(`Failed to save category: ${error.message || "Unknown error"}`);
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      await removeCategoryAPI(rfpFetch, categoryId);
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
      }
      await fetchInitialMenu();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(`Failed to delete category: ${error.message || "Unknown error"}`);
      setIsLoading(false);
    }
  };

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

          {!isAdmin && (
            <button
              onClick={() => setShowCart(true)}
              className="bg-yellow-500 text-black px-4 py-2 rounded-full flex items-center shadow transform transition hover:scale-105 disabled:opacity-50 disabled:scale-100"
              disabled={isLoading}
            >
              <BaggageClaim size={18} />
              <span className="ml-2 font-medium">
                {Object.keys(selectedItems).length}
              </span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={openAddCategoryModal}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full flex items-center shadow transform transition hover:scale-105 disabled:opacity-50 disabled:scale-100"
              disabled={isLoading}
            >
              <Plus size={18} />
              <span className="ml-2 font-medium">Add Category</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 relative">
        {isLoading && (
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
              onClick={() => setError(null)}
              className="absolute top-0 right-0 mt-2 mr-3 text-red-200 hover:text-white"
            >
              ×
            </button>
          </div>
        )}

        {!isAdmin && (
          <CartModal
            isOpen={showCart}
            onClose={() => setShowCart(false)}
            menuData={menuData}
            selectedItems={selectedItems}
            calculateTotal={calculateTotal}
            handleProceedOrder={handleProceedOrder}
          />
        )}

        <MenuCategories
          menuData={menuData}
          isLoading={isLoading || isItemsLoading}
          isAdmin={isAdmin}
          expandedCategory={expandedCategory}
          selectedItems={selectedItems}
          toggleCategory={toggleCategory}
          openEditCategoryModal={openEditCategoryModal}
          handleDeleteCategory={handleDeleteCategory}
          openAddItemModal={openAddItemModal}
          openEditItemModal={openEditItemModal}
          handleDeleteItem={handleDeleteItem}
          toggleSelectItem={toggleSelectItem}
        />
      </div>

      {isAdmin && (
        <>
          <MenuItemModal
            isOpen={itemModalOpen}
            onClose={closeItemModal}
            item={currentItem}
            categoryId={currentCategory?.id}
            onSave={handleSaveItem}
            isNewItem={isNewItem}
            isLoading={isLoading}
          />
          <CategoryModal
            isOpen={categoryModalOpen}
            onClose={closeCategoryModal}
            category={currentCategory}
            onSave={handleSaveCategory}
            onDelete={handleDeleteCategory}
            isNewCategory={isNewCategory}
          />
        </>
      )}
    </div>
  );
};

export default Menu;
