import React, { useContext, useState } from "react";
import { ChevronLeft, Heart, Star, Minus, Plus, Share2 } from "lucide-react";
import AppContext from "../context/AppContext"; // Ensure correct path

const mockFoodData = {
  momos: {
    name: "Veg Momos",
    rating: "4.9",
    reviewCount: 320,
    price: 30,
    image:
      "https://www.thespruceeats.com/thmb/UnVh_-znw7ikMUciZIx5sNqBtTU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/steamed-momos-wontons-1957616-hero-01-1c59e22bad0347daa8f0dfe12894bc3c.jpg",
    description: "Steamed or fried dumplings with spicy chutney.",
    variants: [
      { id: "steamed", name: "Steamed", price: 30 },
      { id: "fried", name: "Fried", price: 40 },
    ],
  },

  paneertikka: {
    name: "Paneer Tikka",
    rating: "4.7",
    reviewCount: 285,
    price: 100,
    image:
      "https://derafarms.com/cdn/shop/files/deraproducts-2024-06-26T165127.117.png?v=1719400896",
    description: "Spicy grilled paneer skewers marinated in tangy masala.",
    variants: [
      { id: "classic", name: "Classic", price: 100 },
      { id: "cheesy", name: "Cheesy", price: 120 },
    ],
  },

  manchuriangravy: {
    name: "Veg Manchurian Gravy",
    rating: "4.6",
    reviewCount: 198,
    price: 90,
    image:
      "https://t4.ftcdn.net/jpg/08/24/72/15/360_F_824721538_Cxhdoj1bTpOwN1BOgqVJxucWmwWZgPCm.jpg",
    description: "Indo-Chinese veggie balls tossed in spicy gravy sauce.",
    variants: [{ id: "gravy", name: "With Gravy", price: 60 }],
  },

  cholebhature: {
    name: "Chole Bhature",
    rating: "4.8",
    reviewCount: 412,
    price: 80,
    image:
      "https://static.toiimg.com/thumb/53314156.cms?imgsize=1762111&width=800&height=800",
    description: "Spiced chickpeas served with fluffy fried bread.",
    variants: [
      { id: "classic", name: "Classic", price: 80 },
      { id: "extraChole", name: "Extra Chole", price: 95 },
    ],
  },

  tandooriroti: {
    name: "Tandoori Roti",
    rating: "4.4",
    reviewCount: 155,
    price: 15,
    image:
      "https://img.freepik.com/free-photo/delicious-assortment-traditional-roti_23-2149033987.jpg?semt=ais_hybrid&w=740",
    description: "Clay oven-baked Indian bread, served with butter or plain.",
    variants: [
      { id: "plain", name: "Plain", price: 15 },
      { id: "butter", name: "Butter", price: 20 },
    ],
  },

  thali: {
    name: "Indian Thali",
    rating: "4.9",
    reviewCount: 510,
    price: 180,
    image:
      "https://images.picxy.com/cache/2020/7/11/7e70b15d248d64be34323e17ee05bc1c.jpg",
    description: "Complete meal platter with rice, roti, sabzi, dal & sweet.",
    variants: [
      { id: "veg", name: "Veg", price: 180 },
      { id: "special", name: "Special", price: 220 },
    ],
  },

  lassi: {
    name: "Lassi",
    rating: "4.5",
    reviewCount: 234,
    price: 40,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZVOz2BkNNLe-ac2FRFJ-6g4sTdXk7y2JZBA&s",
    description: "Refreshing yogurt-based drink, available in sweet or salty.",
    variants: [
      { id: "sweet", name: "Sweet", price: 40 },
      { id: "salted", name: "Salted", price: 40 },
      { id: "mango", name: "Mango", price: 50 },
    ],
  },

  friedmomos: {
    name: "Fried Momos",
    rating: "4.6",
    reviewCount: 290,
    price: 35,
    image:
      "https://img-global.cpcdn.com/recipes/f208d073a1e7058b/400x400cq70/photo.jpg",
    description: "Crispy golden momos filled with spiced veggies or chicken.",
    variants: [
      { id: "veg", name: "Veg", price: 35 },
      { id: "chicken", name: "Chicken", price: 50 },
    ],
  },
};

const FoodDetails = () => {
  const { tabParams, setActiveTab } = useContext(AppContext);
  const food = mockFoodData[tabParams.id];

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(food.variants[0].id);
  const [isFavorite, setIsFavorite] = useState(false);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const calculateTotalPrice = () => {
    const baseVariant = food.variants.find((v) => v.id === selectedVariant);
    return baseVariant.price * quantity;
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-36">
      {/* Image header */}
      <div className="relative h-64">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <button
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
            onClick={() => setActiveTab("Home")}
          >
            <ChevronLeft
              size={20}
              className="text-gray-800 dark:text-gray-200"
            />
          </button>
          <div className="flex space-x-2">
            <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md">
              <Share2 size={20} className="text-gray-800 dark:text-gray-200" />
            </button>
            <button
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                size={20}
                className={
                  isFavorite
                    ? "text-red-500 fill-red-500"
                    : "text-gray-800 dark:text-gray-200"
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* Food info */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {food.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {food.restaurant}
        </p>

        <div className="flex items-center mt-2">
          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-0.5 rounded flex items-center mr-3">
            <Star size={14} className="mr-1" fill="currentColor" />
            <span className="text-sm font-medium">{food.rating}</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {food.reviewCount} reviews
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-2 px-4 py-3 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          About
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {food.description}
        </p>
      </div>

      {/* Variants */}
      <div className="mt-2 px-4 py-3 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Choose Variant
        </h2>
        <div className="flex flex-col space-y-2">
          {food.variants.map((variant) => (
            <button
              key={variant.id}
              className={`px-4 py-3 rounded-lg border flex justify-between items-center ${
                selectedVariant === variant.id
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => setSelectedVariant(variant.id)}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selectedVariant === variant.id
                      ? "border-red-500"
                      : "border-gray-400 dark:border-gray-500"
                  }`}
                >
                  {selectedVariant === variant.id && (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <span className="ml-3 text-gray-800 dark:text-gray-200">
                  {variant.name}
                </span>
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                ₹{variant.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quantity selector */}
      <div className="mt-2 px-4 py-3 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Plates
        </h2>
        <div className="flex items-center">
          <button
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            onClick={decrementQuantity}
          >
            <Minus size={18} className="text-gray-800 dark:text-gray-200" />
          </button>
          <span className="w-12 text-center font-medium text-gray-900 dark:text-gray-100">
            {quantity}
          </span>
          <button
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
            onClick={incrementQuantity}
          >
            <Plus size={18} className="text-gray-800 dark:text-gray-200" />
          </button>
        </div>

        {/* Add to cart button */}
        <div className="fixed bottom-14 left-0 right-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Price
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                ₹{calculateTotalPrice()}
              </p>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium">
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
