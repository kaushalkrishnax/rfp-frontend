import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
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
} from "../services/menuApi";

const MODAL_TYPES = {
  NONE: null,
  ITEM: "item",
  CATEGORY: "category",
  CART: "cart",
};

const MenuContext = createContext(null);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};

export const MenuProvider = ({ children, isAdmin, routeParams }) => {
  const { rfpFetch, userInfo } =
    useContext(AppContext);

  const [menuData, setMenuData] = useState([]);
  const [loadingState, setLoadingState] = useState({
    initial: true,
    items: false,
    saving: false,
    order: false,
  });
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [modalState, setModalState] = useState({
    type: MODAL_TYPES.NONE,
    data: null,
  });
  const categoryRefs = useRef({});

  const clearError = useCallback(() => setError(null), []);
  const closeModal = useCallback(
    () => setModalState({ type: MODAL_TYPES.NONE, data: null }),
    []
  );

  const executeApiCall = useCallback(
    async (apiFunc, loadingKey = "saving", ...args) => {
      setLoadingState((prev) => ({ ...prev, [loadingKey]: true }));
      setError(null);
      try {
        const result = await apiFunc(rfpFetch, ...args);
        return result;
      } catch (err) {
        console.error(`Error during ${apiFunc.name}:`, err);
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "An unexpected error occurred.";
        setError(message);

        alert(`Operation failed: ${message}`);
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
      setExpandedCategory(null);
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

      if (
        expandedCategory === categoryId &&
        category.items !== undefined &&
        !forceRefetch
      ) {
        return;
      }

      setExpandedCategory(categoryId);

      if (category.items === undefined || forceRefetch) {
        setLoadingState((prev) => ({ ...prev, items: true }));
        try {
          const response = await executeApiCall(
            getItemsByCategoryAPI,
            "items",
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
      }
    },
    [executeApiCall, menuData, expandedCategory]
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

  const registerCategoryRef = useCallback((id, element) => {
    if (element) categoryRefs.current[id] = element;
    else delete categoryRefs.current[id];
  }, []);

  const toggleSelectItem = useCallback((itemId) => {
    setSelectedItems((prev) => {
      const newSelection = { ...prev };
      if (newSelection[itemId]) {
        delete newSelection[itemId];

        setSelectedVariants((v) => {
          const newV = { ...v };
          delete newV[itemId];
          return newV;
        });
      } else {
        newSelection[itemId] = true;
      }
      return newSelection;
    });
  }, []);

  const handleVariantChange = useCallback((itemId, variantIndex) => {
    setSelectedVariants((prev) => ({ ...prev, [itemId]: variantIndex }));
  }, []);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) return;
  
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  }, []);

  const resetCart = useCallback(() => {
    setSelectedItems({});
    setSelectedVariants({});
    closeModal();
  }, [closeModal]);

  const getCartDetails = useCallback(() => {
    let amount = 0;
    const items = [];
    const allItemsMap = new Map();

    menuData.forEach((cat) => {
      if (Array.isArray(cat.items)) {
        cat.items.forEach((item) => allItemsMap.set(item.id, item));
      }
    });
  
    Object.keys(selectedItems).forEach((itemId) => {
      const item = allItemsMap.get(itemId);
      const quantity = selectedItems[itemId];
  
      if (item && quantity > 0) {
        items.push({ ...item, quantity });
  
        const variantIndex = selectedVariants[item.id] ?? 0;
        const price = parseFloat(item.variants?.[variantIndex]?.price || 0);
  
        amount += price * quantity;
      }
    });
  
    return { items, amount };
  }, [menuData, selectedItems, selectedVariants]);  

  const refreshData = useCallback(
    async (affectedCategoryId = null) => {
      if (affectedCategoryId) {
        setMenuData((prev) =>
          prev.map((cat) =>
            cat.id === affectedCategoryId ? { ...cat, items: undefined } : cat
          )
        );

        if (expandedCategory === affectedCategoryId) {
          await fetchItemsForCategory(affectedCategoryId, true);
        }
      } else {
        await fetchCategories();
      }
    },
    [fetchCategories, fetchItemsForCategory, expandedCategory]
  );

  const addCategory = useCallback(
    async (name, image) => {
      await executeApiCall(addCategoryAPI, "saving", name, image);
      await refreshData();
      closeModal();
    },
    [executeApiCall, refreshData, closeModal]
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
      closeModal();
    },
    [executeApiCall, refreshData, closeModal]
  );

  const deleteCategory = useCallback(
    async (categoryId) => {
      if (
        !window.confirm(
          "Delete this category and ALL its items? This cannot be undone."
        )
      )
        return;
      try {
        await executeApiCall(removeCategoryAPI, "saving", categoryId);

        const deletedCat = menuData.find((cat) => cat.id === categoryId);
        setMenuData((prev) => prev.filter((cat) => cat.id !== categoryId));

        if (deletedCat?.items) {
          setSelectedItems((prevSelected) => {
            const newSelection = { ...prevSelected };
            const newVariants = { ...selectedVariants };
            deletedCat.items.forEach((item) => {
              delete newSelection[item.id];
              delete newVariants[item.id];
            });
            setSelectedVariants(newVariants);
            return newSelection;
          });
        }

        if (expandedCategory === categoryId) {
          setExpandedCategory(null);
        }
      } catch (error) {
        console.error("Failed to delete category:", error);

        await refreshData();
      }
    },
    [executeApiCall, menuData, expandedCategory, selectedVariants]
  );

  const addItem = useCallback(
    async (categoryId, name, variants) => {
      await executeApiCall(addItemAPI, "saving", categoryId, name, variants);
      await refreshData(categoryId);
      closeModal();
    },
    [executeApiCall, refreshData, closeModal]
  );

  const updateItem = useCallback(
    async (itemId, name, variants, categoryId) => {
      await executeApiCall(updateItemAPI, "saving", itemId, name, variants);
      await refreshData(categoryId);
      closeModal();
    },
    [executeApiCall, refreshData, closeModal]
  );

  const deleteItem = useCallback(
    async (itemId, categoryId) => {
      if (
        !window.confirm(
          "Are you sure you want to delete this item? This cannot be undone."
        )
      )
        return;
      try {
        await executeApiCall(removeItemAPI, "saving", itemId);

        setSelectedItems((prev) => {
          const newSelection = { ...prev };
          delete newSelection[itemId];
          return newSelection;
        });
        setSelectedVariants((prev) => {
          const newVariants = { ...prev };
          delete newVariants[itemId];
          return newVariants;
        });

        await refreshData(categoryId);
      } catch (error) {
        console.error("Failed to delete item:", error);

        await refreshData(categoryId);
      }
    },
    [executeApiCall, refreshData]
  );

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data });
  }, []);

  const openItemModal = useCallback(
    (item = null, categoryId = null) => {
      const modalData = item
        ? { item, categoryId: item.categoryId || categoryId, isNew: false }
        : { item: null, categoryId, isNew: true };
      openModal(MODAL_TYPES.ITEM, modalData);
    },
    [openModal]
  );

  const openCategoryModal = useCallback(
    (category = null) => {
      openModal(MODAL_TYPES.CATEGORY, { category, isNew: !category });
    },
    [openModal]
  );

  const openCartModal = useCallback(() => {
    openModal(MODAL_TYPES.CART);
  }, [openModal]);

  const createRazorpayOrder = useCallback(
    async (amount) => {
      const response = await executeApiCall(
        createRazorpayOrderAPI,
        "order",
        amount
      );
      return response;
    },
    [executeApiCall]
  );

  const verifyRazorpayOrder = useCallback(
    async (orderId, paymentId, signature, items, amount) => {
      if (!userInfo?.id) {
        throw new Error("User information is missing for order verification.");
      }

      const response = await executeApiCall(
        verifyRazorpayOrderAPI,
        "order",
        userInfo.id,
        items,
        orderId,
        paymentId,
        signature,
        amount
      );
      return response;
    },
    [executeApiCall, userInfo, selectedVariants]
  );

  const createCodOrder = useCallback(
    async (items, amount) => {
      if (!userInfo?.id) {
        throw new Error("User information is missing for COD order.");
      }

      const response = await executeApiCall(
        createCodOrderAPI,
        "order",
        userInfo.id,
        items,
        amount
      );
      return response;
    },
    [executeApiCall, userInfo, selectedVariants]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  useEffect(() => {
    let { categoryId, itemId } = routeParams || {};
    if (!categoryId || loadingState.initial) return;

    const categoryExists = menuData.some((cat) => cat.id === categoryId);
    if (!categoryExists) return;

    const handleScrollAndSelect = () => {
      const element = categoryRefs.current[categoryId];
      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          if (itemId) {
            setTimeout(() => toggleSelectItem(itemId), 350);
          }
        });
      }
    };

    if (expandedCategory !== categoryId) {
      fetchItemsForCategory(categoryId).then(() => {
        setTimeout(handleScrollAndSelect, 50);
      });
    } else {
      handleScrollAndSelect();
    }
  }, [loadingState.initial]);

  const value = useMemo(
    () => ({
      menuData,
      loadingState,
      error,
      isAdmin,
      selectedItems,
      selectedVariants,
      expandedCategory,
      userInfo,
      modalState,
      clearError,
      toggleCategoryExpansion,
      registerCategoryRef,
      toggleSelectItem,
      handleVariantChange,
      handleQuantityChange,
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
      openItemModal,
      openCategoryModal,
      openCartModal,
      closeModal,
    }),
    [
      menuData,
      loadingState,
      error,
      isAdmin,
      selectedItems,
      selectedVariants,
      expandedCategory,
      userInfo,
      modalState,
      clearError,
      toggleCategoryExpansion,
      registerCategoryRef,
      toggleSelectItem,
      handleVariantChange,
      handleQuantityChange,
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
      openItemModal,
      openCategoryModal,
      openCartModal,
      closeModal,
    ]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
