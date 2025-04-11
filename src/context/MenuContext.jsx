import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import AppContext from "./AppContext";
import {
  getCategoriesAPI,
  getItemsByCategoryAPI,
  addCategoryAPI,
  updateCategoryAPI,
  removeCategoryAPI,
  addItemAPI,
  updateItemAPI,
  removeItemAPI,
  createRazorpayOrderAPI,
  verifyRazorpayOrderAPI,
  createCodOrderAPI,
} from "../services/menuApi.js";

const MenuContext = createContext(null);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

export const MenuProvider = ({ children, isAdmin: initialIsAdmin = false }) => {
  const { rfpFetch, tabParams } = useContext(AppContext);

  const [menuData, setMenuData] = useState([]);
  const [loadingState, setLoadingState] = useState({
    initial: true,
    items: false,
    saving: false,
  });
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isAdmin] = useState(initialIsAdmin);

  const clearError = useCallback(() => setError(null), []);

  const executeApiCall = useCallback(
    async (apiFunc, loadingKey = "saving", ...args) => {
      setLoadingState((prev) => ({ ...prev, [loadingKey]: true }));
      setError(null);
      try {
        const result = await apiFunc(rfpFetch, ...args);
        console.log(result);
        return result;
      } catch (err) {
        console.error(`Error during ${apiFunc.name}:`, err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "An unexpected error occurred.";
        setError(message);
        throw err;
      } finally {
        setLoadingState((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [rfpFetch]
  );

  const fetchCategories = useCallback(async () => {
    setLoadingState((prev) => ({ ...prev, initial: true }));
    try {
      const response = await executeApiCall(getCategoriesAPI, "initial");
      const categories = response?.data?.data || response?.data || [];
      if (!Array.isArray(categories)) {
        throw new Error("Invalid category data format received.");
      }
      setMenuData(categories.map((cat) => ({ ...cat, items: undefined })));
    } catch (err) {
      setMenuData([]);
    } finally {
      setLoadingState((prev) => ({ ...prev, initial: false }));
    }
  }, [executeApiCall]);

  const fetchItemsForCategory = useCallback(
    async (categoryId, forceRefetch = false) => {
      const categoryIndex = menuData.findIndex((cat) => cat.id === categoryId);
      if (categoryIndex === -1) return;

      const category = menuData[categoryIndex];

      if (category.items !== undefined && !forceRefetch) {
        setExpandedCategory(categoryId);
        return;
      }

      setExpandedCategory(categoryId);
      setLoadingState((prev) => ({ ...prev, items: true }));

      try {
        const response = await executeApiCall(
          getItemsByCategoryAPI,
          null,
          categoryId
        );
        const items = response?.data?.data || response?.data || [];
        if (!Array.isArray(items)) {
          throw new Error("Invalid item data format received.");
        }

        setMenuData((prevMenuData) => {
          const newData = [...prevMenuData];
          newData[categoryIndex] = { ...newData[categoryIndex], items };
          return newData;
        });
      } catch (err) {
        setMenuData((prevMenuData) => {
          const newData = [...prevMenuData];
          newData[categoryIndex] = { ...newData[categoryIndex], items: [] };
          return newData;
        });
      } finally {
        setLoadingState((prev) => ({ ...prev, items: false }));
      }
    },
    [executeApiCall, menuData]
  );

  const toggleCategoryExpansion = useCallback(
    (categoryId) => {
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
      } else {
        fetchItemsForCategory(categoryId);
      }
    },
    [expandedCategory, fetchItemsForCategory]
  );

  const toggleSelectItem = useCallback((itemId) => {
    setSelectedItems((prev) => {
      const newSelection = { ...prev };
      if (newSelection[itemId]) {
        delete newSelection[itemId];
      } else {
        newSelection[itemId] = true;
      }
      return newSelection;
    });
  }, []);

  const resetCart = useCallback(() => {
    setSelectedItems({});
  }, []);

  const getCartDetails = useCallback(() => {
    let total = 0;
    const itemsInCart = [];
    const allItemsMap = new Map();

    menuData.forEach((cat) => {
      if (Array.isArray(cat.items)) {
        cat.items.forEach((item) => allItemsMap.set(item.id, item));
      }
    });

    Object.keys(selectedItems).forEach((itemId) => {
      const item = allItemsMap.get(itemId);
      if (item) {
        itemsInCart.push(item);
        const price = parseFloat(item.variants?.[0]?.price) || 0;
        total += price;
      }
    });

    return { items: itemsInCart, total: parseFloat(total.toFixed(2)) };
  }, [menuData, selectedItems]);

  const refreshData = useCallback(
    async (categoryId = null) => {
      if (categoryId) {
        setMenuData((prev) =>
          prev.map((cat) =>
            cat.id === categoryId ? { ...cat, items: undefined } : cat
          )
        );
        if (expandedCategory === categoryId) {
          await fetchItemsForCategory(categoryId, true);
        }
      } else {
        await fetchCategories();
        setExpandedCategory(null);
      }
    },
    [fetchCategories, fetchItemsForCategory, expandedCategory]
  );

  const addCategory = useCallback(
    async (name, image) => {
      await executeApiCall(addCategoryAPI, "saving", name, image);
      await refreshData();
    },
    [executeApiCall, refreshData]
  );

  const updateCategory = useCallback(
    async (categoryId, name, image) => {
      await executeApiCall(
        updateCategoryAPI,
        "saving",
        categoryId,
        name,
        image
      );
      await refreshData();
    },
    [executeApiCall, refreshData]
  );

  const deleteCategory = useCallback(
    async (categoryId) => {
      await executeApiCall(removeCategoryAPI, "saving", categoryId);
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
      }
      setMenuData((prev) => prev.filter((cat) => cat.id !== categoryId));
      setSelectedItems((prev) => {
        const newSelection = { ...prev };
        const deletedCat = menuData.find((cat) => cat.id === categoryId);
        deletedCat?.items?.forEach((item) => delete newSelection[item.id]);
        return newSelection;
      });
    },
    [executeApiCall, expandedCategory, menuData]
  );

  const addItem = useCallback(
    async (categoryId, name, variants) => {
      await executeApiCall(addItemAPI, "saving", categoryId, name, variants);
      await refreshData(categoryId);
    },
    [executeApiCall, refreshData]
  );

  const updateItem = useCallback(
    async (itemId, name, variants, categoryId) => {
      await executeApiCall(updateItemAPI, "saving", itemId, name, variants);
      await refreshData(categoryId);
    },
    [executeApiCall, refreshData]
  );

  const deleteItem = useCallback(
    async (itemId, categoryId) => {
      await executeApiCall(removeItemAPI, "saving", itemId);
      setSelectedItems((prev) => {
        const newSelection = { ...prev };
        delete newSelection[itemId];
        return newSelection;
      });
      await refreshData(categoryId);
    },
    [executeApiCall, refreshData]
  );

  const createRazorpayOrder = useCallback(async (amount) => {
    const response = await executeApiCall(
      createRazorpayOrderAPI,
      "saving",
      amount
    );
    return response.data;
  }, [executeApiCall]);

  const verifyRazorpayOrder = useCallback(
    async (orderId, paymentId, signature, items, amount) => {
      const response = await executeApiCall(
        verifyRazorpayOrderAPI,
        "saving",
        userInfo.id,
        items,
        orderId,
        paymentId,
        signature,
        amount
      );
      return response.data;
    },
    [executeApiCall]
  );

  const createCodOrder = useCallback(async (items, amount) => {
    const response = await executeApiCall(
      createCodOrderAPI,
      "saving",
      userInfo.id,
      items,
      amount
    );
    return response.data;
  }, [executeApiCall]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const value = useMemo(
    () => ({
      menuData,
      loadingState,
      error,
      isAdmin,
      selectedItems,
      expandedCategory,
      tabParams,
      toggleCategoryExpansion,
      clearError,
      toggleSelectItem,
      resetCart,
      getCartDetails,
      addCategory,
      updateCategory,
      deleteCategory,
      addItem,
      updateItem,
      deleteItem,
      createRazorpayOrder,
      verifyRazorpayOrder,
      createCodOrder,
    }),
    [
      menuData,
      loadingState,
      error,
      isAdmin,
      selectedItems,
      expandedCategory,
      tabParams,
      toggleCategoryExpansion,
      clearError,
      toggleSelectItem,
      resetCart,
      getCartDetails,
      addCategory,
      updateCategory,
      deleteCategory,
      addItem,
      updateItem,
      deleteItem,
      createRazorpayOrder,
      verifyRazorpayOrder,
      createCodOrder,
    ]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
