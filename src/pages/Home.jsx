import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Navigation, ChevronRight } from "lucide-react";
import AppContext from "../context/AppContext";
import Modal from "../components/common/Modal";

const Home = () => {
  const navigate = useNavigate();
  const { rfpFetch, userInfo, saveUserInfo } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [topItems, setTopItems] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPopularLoading, setIsPopularLoading] = useState(true);
  const [userLocation, setUserLocation] = useState("Select your location");
  const [error, setError] = useState(null);
  const [popularError, setPopularError] = useState(null);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSavingLocation, setIsSavingLocation] = useState(false);

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
  }, [rfpFetch]);

  useEffect(() => {
    const fetchPopularItems = async () => {
      setIsPopularLoading(true);
      setPopularError(null);
      try {
        const response = await rfpFetch("/menu/popular");
        setPopularItems(response.data || []);
      } catch (err) {
        console.error("Failed to fetch popular items:", err);
        setPopularError(
          "Could not load popular items. Please try again later."
        );
        setPopularItems([]);
      } finally {
        setIsPopularLoading(false);
      }
    };
    fetchPopularItems();
  }, [rfpFetch]);

  useEffect(() => {
    if (userInfo?.location) {
      setUserLocation(userInfo.location);
      setManualLocation(userInfo.location);
    }
  }, [userInfo]);

  const openLocationModal = () => {
    setLocationError("");
    setIsLocationModalOpen(true);
    if (userInfo?.location) {
      setManualLocation(userInfo.location);
    }
  };

  const detectCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                "User-Agent": "Royal Food Plaza App",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to get address");
          }

          const data = await response.json();
          const address = data.display_name || "Unknown location";

          setDetectedLocation(address);
          setManualLocation(address);
          setIsGettingLocation(false);
        } catch (error) {
          console.error("Error getting location:", error);
          setLocationError(
            "Could not detect your location. Please try again or enter manually."
          );
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Failed to get your location.";

        if (error.code === 1) {
          errorMessage =
            "Location access denied. Please enable location access in your browser settings.";
        } else if (error.code === 2) {
          errorMessage = "Location unavailable. Please try again later.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please try again.";
        }

        setLocationError(errorMessage);
        setIsGettingLocation(false);
      }
    );
  };

  const saveLocation = async () => {
    if (!manualLocation.trim()) {
      setLocationError("Please enter a valid location");
      return;
    }

    setIsSavingLocation(true);

    try {
      await rfpFetch("/auth/update/location", {
        method: "PUT",
        body: JSON.stringify({ location: manualLocation }),
      });

      setUserLocation(manualLocation);
      saveUserInfo({ ...userInfo, location: manualLocation });

      setIsLocationModalOpen(false);
    } catch (error) {
      console.error("Failed to update location:", error);
      setLocationError("Failed to save location. Please try again.");
    } finally {
      setIsSavingLocation(false);
    }
  };

  const openItemInMenu = (categoryId, itemId) => {
    navigate(`/menu?categoryId=${categoryId}&itemId=${itemId}`);
  };

  const getItemPrice = (variants) => {
    try {
      const parsedVariants = JSON.parse(variants);
      if (parsedVariants && parsedVariants.length > 0) {
        return `₹${parsedVariants[0].price}`;
      }
      return "Price unavailable";
    } catch (err) {
      console.error("Error parsing variants:", err);
      return "Price unavailable";
    }
  };

  const PopularItemSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md w-64 flex-shrink-0">
      <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-8 animate-pulse"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2 mb-2 animate-pulse"></div>
        <div className="flex justify-between items-center mt-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const CategoryItemSkeleton = () => (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-1"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mt-1 animate-pulse"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 pb-16">
      {/* Header Section */}
      <div className="fixed flex justify-between items-center w-full p-4 bg-gray-100 dark:bg-gray-900 z-10">
        <div
          className="flex items-center w-full gap-2 cursor-pointer"
          onClick={openLocationModal}
        >
          <span className="bg-yellow-400 text-black text-xs p-2 rounded-full">
            <MapPin size={18} />
          </span>
          <span className="mr-2 text-sm truncate text-gray-700 dark:text-gray-300 max-w-[70%]">
            {userLocation || "Select your location"}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openLocationModal();
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
            aria-label="Update location"
          >
            Change
          </button>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border-1 border-blue-500 dark:border-blue-400  cursor-pointer"
          onClick={() => navigate("/profile")}
          aria-label="Open Profile"
        >
          <img
            src="https://img.freepik.com/premium-psd/contact-icon-illustration-isolated_23-2151903357.jpg"
            alt="Profile"
            className="rounded-full w-full h-full aspect-square"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="pt-20 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Today's Specials
            </h2>
          </div>

          {isPopularLoading && (
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 w-max pb-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <PopularItemSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {popularError && (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg text-center">
              {popularError}
            </div>
          )}

          {!isPopularLoading && !popularError && popularItems.length === 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-4 rounded-lg text-center">
              No popular items found.
            </div>
          )}

          {!isPopularLoading && !popularError && popularItems.length > 0 && (
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 w-max pb-2">
                {popularItems.map((item) => {
                  const variants = item.variants;
                  const price = getItemPrice(variants);

                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md w-64 flex-shrink-0 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => openItemInMenu(item.category_id, item.id)}
                    >
                      <div className="h-32 w-full relative ">
                        <img
                          src={item.category_image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                            {item.name}
                          </h3>
                          <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs px-1.5 py-0.5 rounded flex items-center">
                            ★
                            <span className="ml-0.5">
                              {(Math.random() + 4).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {item.category_name}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-800 dark:text-gray-200">
                            {price}
                          </span>
                          <button
                            className="bg-yellow-400 dark:bg-yellow-500 text-black text-sm px-4 py-1.5 rounded-full font-medium hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors"
                            onClick={() =>
                              openItemInMenu(item.category_id, item.id)
                            }
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
            Explore Our Menu
          </h2>

          {isLoading && (
            <div className="grid grid-cols-4 gap-x-4 gap-y-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <CategoryItemSkeleton key={i} />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          {!isLoading && !error && topItems.length === 0 && (
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-4 rounded-lg text-center">
              No categories found.
            </div>
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
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-gray-800 rounded-full overflow-hidden flex items-center justify-center mb-1 border-2 border-transparent group-hover:border-yellow-500 transition duration-200 shadow-sm">
                    <img
                      src={item.category_image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition duration-200 mt-1">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location Update Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Update Your Location"
        isLoading={isSavingLocation}
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={() => setIsLocationModalOpen(false)}
              disabled={isSavingLocation}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={saveLocation}
              disabled={isSavingLocation || !manualLocation.trim()}
              className="px-4 py-2 rounded-lg bg-yellow-400 dark:bg-yellow-500 text-black font-medium hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSavingLocation ? (
                <>
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                "Save Location"
              )}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="manualLocation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Delivery Address
            </label>
            <textarea
              id="manualLocation"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="Enter your complete address..."
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 dark:focus:ring-yellow-600 text-gray-900 dark:text-gray-100 resize-none min-h-20"
              disabled={isSavingLocation}
            />
          </div>

          <div className="text-center relative">
            <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="relative bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
              or
            </span>
          </div>

          <button
            onClick={detectCurrentLocation}
            disabled={isGettingLocation}
            className="flex items-center justify-center gap-2 p-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {isGettingLocation ? (
              <>
                <span className="h-5 w-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Getting your location...</span>
              </>
            ) : (
              <>
                <Navigation size={18} className="text-yellow-500" />
                <span>Use current location</span>
              </>
            )}
          </button>

          {detectedLocation && !locationError && (
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-300">
                <span className="font-semibold">Detected address:</span>{" "}
                {detectedLocation}
              </p>
            </div>
          )}

          {locationError && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-300">
                {locationError}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Home;
