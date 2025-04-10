import React, { useState } from "react";
import { Edit2, BaggageClaim, Plus, X, ChevronRight } from "lucide-react";
import MenuItemModal from "../components/menu/MenuItemModal";
import CategoryModal from "../components/menu/CategoryModal";
import CartModal from "../components/menu/CartModal";

const Menu = ({ isAdmin = true }) => {
  const [menuData, setMenuData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const calculateTotal = () => {
    let total = 0;
    Object.keys(selectedItems).forEach((itemId) => {
      const category = menuData.find((cat) =>
        cat.items.some((item) => item.id === itemId)
      );

      if (category) {
        const item = category.items.find((item) => item.id === itemId);
        if (item) {
          total += parseInt(item.price);
        }
      }
    });
    return total;
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleAddItem = (categoryId) => {
    const category = menuData.find((cat) => cat.id === categoryId);
    setCurrentCategory(category);
    setCurrentItem(null);
    setIsNewItem(true);
    setItemModalOpen(true);
  };

  const handleEditItem = (categoryId, itemId) => {
    const category = menuData.find((cat) => cat.id === categoryId);
    const item = category.items.find((item) => item.id === itemId);
    setCurrentCategory(category);
    setCurrentItem(item);
    setIsNewItem(false);
    setItemModalOpen(true);
  };

  const handleSaveItem = (categoryId, itemId, newName, newPrice) => {
    if (isNewItem) {
      setMenuData(
        menuData.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: [
                  ...category.items,
                  { id: itemId, name: newName, price: newPrice },
                ],
              }
            : category
        )
      );
    } else {
      setMenuData(
        menuData.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: category.items.map((item) =>
                  item.id === itemId
                    ? { ...item, name: newName, price: newPrice }
                    : item
                ),
              }
            : category
        )
      );
    }
  };

  const handleDeleteItem = (categoryId, itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setMenuData(
        menuData.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: category.items.filter((item) => item.id !== itemId),
              }
            : category
        )
      );
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setIsNewCategory(true);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (categoryId) => {
    const category = menuData.find((cat) => cat.id === categoryId);
    setCurrentCategory(category);
    setIsNewCategory(false);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = (categoryId, newName) => {
    if (isNewCategory) {
      const newCategory = {
        id: `cat-${Date.now()}`,
        category: newName,
        image: "/api/placeholder/600/400",
        items: [],
      };
      setMenuData([...menuData, newCategory]);
    } else {
      setMenuData(
        menuData.map((category) =>
          category.id === categoryId
            ? { ...category, category: newName }
            : category
        )
      );
    }
  };

  const handleDeleteCategory = (categoryId) => {
    setMenuData(menuData.filter((category) => category.id !== categoryId));
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const newSelection = { ...prev };
      if (newSelection[itemId]) {
        delete newSelection[itemId];
      } else {
        newSelection[itemId] = true;
      }
      return newSelection;
    });
  };

  const handleProceedOrder = () => {
    const selectedCount = Object.keys(selectedItems).length;
    if (selectedCount === 0) {
      alert("Please select at least one item");
      return;
    }

    alert(`Order placed with ${selectedCount} items for ₹${calculateTotal()}`);
    setSelectedItems({});
    setShowCart(false);
  };

  return (
    <div className="bg-gray-950 text-white min-h-screen pb-20">
      <div className="sticky top-0 z-40 bg-gray-900 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <h1 className="text-xl font-bold">सुन्दर भोजन</h1>
          </div>

          {!isAdmin && (
            <button
              onClick={() => setShowCart(!showCart)}
              className="bg-yellow-500 text-black px-4 py-2 rounded-full flex items-center shadow transform transition hover:scale-105"
            >
              <BaggageClaim size={18} />
              <span className="ml-2 font-medium">
                {Object.keys(selectedItems).length}
              </span>
            </button>
          )}

          {isAdmin && (
            <button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 rounded-full flex items-center shadow transform transition hover:scale-105"
            >
              <Plus size={18} />
              <span className="ml-2 font-medium">Add Category</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {!isAdmin && showCart && <CartModal
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          menuData={menuData}
          selectedItems={selectedItems}
          calculateTotal={calculateTotal}
          handleProceedOrder={handleProceedOrder}
        />}

        <div className="space-y-4">
          {menuData.map((category) => (
            <div
              key={category.id}
              className="bg-gray-900 rounded-2xl overflow-hidden shadow transition"
            >
              <div
                className="relative cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="h-32 relative">
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                </div>

                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <div className="bg-black bg-opacity-70 px-4 py-2 rounded-xl">
                    <h2 className="text-xl font-bold">{category.category}</h2>
                    <p className="text-gray-400 text-sm">
                      {category.items.length} items
                    </p>
                  </div>

                  <div className="flex items-center">
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCategory(category.id);
                        }}
                        className="bg-gray-800 bg-opacity-80 p-2 rounded-full mr-2 hover:bg-yellow-500 hover:text-black transition"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <div
                      className={`bg-gray-800 bg-opacity-80 p-2 rounded-full transition transform ${
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
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex justify-between items-center p-3 rounded-xl transition ${
                        isAdmin
                          ? "hover:bg-gray-800"
                          : selectedItems[item.id]
                          ? "bg-gray-800"
                          : "hover:bg-gray-800 cursor-pointer"
                      }`}
                      onClick={() => !isAdmin && toggleSelectItem(item.id)}
                    >
                      <div className="flex items-center">
                        {!isAdmin && (
                          <div
                            className={`w-5 h-5 rounded-full border border-yellow-500 mr-3 flex items-center justify-center transition ${
                              selectedItems[item.id] ? "bg-yellow-500" : ""
                            }`}
                          >
                            {selectedItems[item.id] && (
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            )}
                          </div>
                        )}
                        <span className="text-base font-medium">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <span className="font-bold text-yellow-500 mr-3">
                          ₹{item.price}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditItem(category.id, item.id);
                            }}
                            className="text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded-full transition"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAdmin && (
                    <button
                      onClick={() => handleAddItem(category.id)}
                      className="flex items-center justify-center w-full p-3 text-yellow-500 hover:bg-gray-800 rounded-xl mt-3 transition"
                    >
                      <Plus size={18} className="mr-2" /> Add New Item
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <MenuItemModal
          isOpen={itemModalOpen}
          onClose={() => setItemModalOpen(false)}
          item={currentItem}
          categoryId={currentCategory?.id}
          onSave={handleSaveItem}
          isNewItem={isNewItem}
        />

        <CategoryModal
          isOpen={categoryModalOpen}
          onClose={() => setCategoryModalOpen(false)}
          category={currentCategory}
          onSave={handleSaveCategory}
          onDelete={handleDeleteCategory}
          isNewCategory={isNewCategory}
        />
      </div>
    </div>
  );
};

export default Menu;
