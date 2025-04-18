import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import AppContext from "../context/AppContext";

const Home = () => {
  const navigate = useNavigate();

  const { rfpFetch } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [topItems, setTopItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const popularItems = [
    {
      name: "Classic Burger",
      id: 1,
      rating: 4.8,
      prepTime: "15 mins",
      price: "₹199",
      image:
        "https://www.shutterstock.com/image-photo/burger-tomateoes-lettuce-pickles-on-600nw-2309539129.jpg",
      category: "Main Course",
    },
    {
      name: "Margherita Pizza",
      id: 2,
      rating: 4.7,
      prepTime: "20 mins",
      price: "₹249",
      image:
        "https://cdn.shopify.com/s/files/1/0517/4609/files/closeup-shot-pizza111_480x480.jpg?v=1719494823",
      category: "Main Course",
    },
    {
      name: "Crispy Chicken Wings",
      id: 3,
      rating: 4.9,
      prepTime: "15 mins",
      price: "₹299",
      image:
        "https://media.istockphoto.com/id/583848484/photo/spicy-deep-fried-breaded-chicken-wings.jpg?s=612x612&w=0&k=20&c=N9JOYnsCFDQt8uFiWTzlEdefHn4NNhfI3JPN0vGwUas=",
      category: "Starters",
    },
    {
      name: "Caesar Salad",
      id: 4,
      rating: 4.5,
      prepTime: "10 mins",
      price: "₹169",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzojxjclj_4ioTHYYPCj66BQH1Th2zJekLxw&s",
      category: "Healthy",
    },
    {
      name: "Chocolate Brownie",
      id: 5,
      rating: 4.8,
      prepTime: "5 mins",
      price: "₹129",
      image:
        "https://media.istockphoto.com/id/1354282153/photo/coffe-cup-and-brownies.jpg?s=612x612&w=0&k=20&c=4ovR4EkhAY6YRKecCoJxb2sKr6gGgO0DIyFw4Er0e9w=",
      category: "Desserts",
    },
    {
      name: "Signature Pasta",
      id: 6,
      rating: 4.6,
      prepTime: "18 mins",
      price: "₹249",
      image:
        "https://img.freepik.com/premium-photo/classic-italian-pasta-penne-parmesan-cheese-dark-table-penne-pasta-with-sauce-top-view-generative-ai_47243-2249.jpg",
      category: "Main Course",
    },
  ];

  useEffect(() => {
    const fetchTopItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await rfpFetch("/menu/items");
        setTopItems(response.data || []);
      } catch (err) {
        console.error("Failed to fetch top items:", err);
        setError("Could not load items. Please try again later.");
        setTopItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopItems();
  }, []);

  const openItemInMenu = (categoryId, itemId) => {
    navigate(`/menu?categoryId=${categoryId}&itemId=${itemId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 pb-16">
      <div className="flex flex-col bg-white dark:bg-gray-900 p-4 sticky top-0 z-10 shadow-sm gap-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center w-full gap-2">
            <span className="bg-yellow-400 text-black text-xs p-2 rounded-full">
              <MapPin size={18} />
            </span>
            <span className="font-medium truncate w-full max-w-3/4 text-sm text-gray-700 dark:text-gray-300">
              Harichak - Banwaripur Road (851120)
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/profile")}
            aria-label="Open Profile"
          >
            <img
              src="https://i.pinimg.com/736x/b8/f7/07/b8f707b74374a8f4f78e99edab91fa05.jpg"
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search for dishes..."
            className="w-full p-2 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:focus:ring-yellow-600 text-gray-900 dark:text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search for dishes"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Today's Specials
          </h2>
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 w-max pb-2">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md w-64 flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {item.name}
                      </h3>
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-1.5 py-0.5 rounded flex items-center">
                        ★<span className="ml-0.5">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {item.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {item.price}
                      </span>
                      <button className="bg-yellow-400 dark:bg-yellow-500 text-black text-sm px-5 py-2  rounded-full font-medium">
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Explore Our Menu
          </h2>
          {isLoading && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading categories...
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
          {!isLoading && !error && topItems.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No categories found.
            </p>
          )}
          {!isLoading && !error && topItems.length > 0 && (
            <div className="grid grid-cols-4 gap-x-4 gap-y-6">
              {topItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center cursor-pointer group"
                  onClick={() => openItemInMenu(item.category_id, item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    openItemInMenu(item.category_id, item.id)
                  }
                >
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-gray-800 rounded-full overflow-hidden flex items-center justify-center mb-1 border-2 border-transparent group-hover:border-yellow-500 transition duration-200">
                    <img
                      src={item.category_image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition duration-200">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
