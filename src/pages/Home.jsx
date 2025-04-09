import { useState, useContext } from "react";
import { Search, MapPin } from "lucide-react";
import AppContext from "../context/AppContext";
import BottomNav from "../layout/BottomNav";

const Home = () => {
  const { setActiveTab } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");

  const openFoodDetails = (id) => {
    setActiveTab("FoodDetails", { id });
  };

  const foodCategories = [
      {
        id: "momos",
        name: "Momos",
        image:
          "https://www.thespruceeats.com/thmb/UnVh_-znw7ikMUciZIx5sNqBtTU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/steamed-momos-wontons-1957616-hero-01-1c59e22bad0347daa8f0dfe12894bc3c.jpg",
        description: "Steamed or fried dumplings",
      },
      {
        id: "paneertikka",
        name: "Paneer Tikka",
        image:
          "https://derafarms.com/cdn/shop/files/deraproducts-2024-06-26T165127.117.png?v=1719400896",
        description: "Spicy grilled paneer skewers",
      },
      {
        id: "manchuriangravy",
        name: "Manchurian Gravy",
        image:
          "https://t4.ftcdn.net/jpg/08/24/72/15/360_F_824721538_Cxhdoj1bTpOwN1BOgqVJxucWmwWZgPCm.jpg",
        description: "Indo-Chinese veggie balls in sauce",
      },
      {
        id: "cholebhature",
        name: "Chole Bhature",
        image:
          "https://static.toiimg.com/thumb/53314156.cms?imgsize=1762111&width=800&height=800",
        description: "North Indian street food",
      },
      {
        id: "tandooriroti",
        name: "Tandoori Roti",
        image:
          "https://img.freepik.com/free-photo/delicious-assortment-traditional-roti_23-2149033987.jpg?semt=ais_hybrid&w=740",
        description: "Clay oven-baked Indian bread",
      },
      {
        id: "thali",
        name: "Thali",
        image:
          "https://images.picxy.com/cache/2020/7/11/7e70b15d248d64be34323e17ee05bc1c.jpg",
        description: "Complete Indian meal platter",
      },
      {
        id: "lassi",
        name: "Lassi",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZVOz2BkNNLe-ac2FRFJ-6g4sTdXk7y2JZBA&s",
        description: "Traditional sweet/salty yogurt drink",
      },
      {
        id: "friedmomos",
        name: "Fried Momos",
        image:
          "https://img-global.cpcdn.com/recipes/f208d073a1e7058b/400x400cq70/photo.jpg",
        description: "Soft syrupy Indian dessert",
      },
  ];

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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 pb-16">
      <div className="flex flex-col bg-white dark:bg-gray-900 p-4 sticky top-0 z-10 shadow-sm gap-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center w-full gap-2">
            <span className="bg-red-500 text-white text-xs p-2 rounded-full">
              <MapPin size={18} className="text-white" />
            </span>
            <span className="font-medium truncate w-full max-w-3/4">
              Harichak - Banwaripur Road (851120)
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            onClick={() => setActiveTab("Profile")}
          >
            <img
              src="https://i.pinimg.com/736x/b8/f7/07/b8f707b74374a8f4f78e99edab91fa05.jpg"
              alt="Profile"
              className="rounded-full"
            />
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search for dishes..."
            className="w-full p-2 pl-10 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-400 dark:focus:ring-red-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3 top-2 text-gray-400 dark:text-gray-500"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3">Today's Specials</h2>
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 w-max pb-2">
              {popularItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm w-64 flex-shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-1.5 py-0.5 rounded">
                        ★ {item.rating}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.category}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold">{item.price}</span>
                      <button className="bg-red-500 dark:bg-red-600 text-white text-xs px-3 py-1 rounded-full">
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold mb-4">Our Menu Categories</h2>
          <div className="grid grid-cols-4 gap-4">
            {foodCategories.map((category, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                onClick={() => openFoodDetails(category.id)}
              >
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="text-xs mt-1 text-center font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Home;
