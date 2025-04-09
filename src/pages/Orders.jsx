import React, { useState, useContext } from "react";
import { ChevronLeft, Search, ChevronRight } from "lucide-react";
import AppContext from "../context/AppContext";

const Orders = () => {
  const { setActiveTab } = useContext(AppContext);

  const orderHistory = [
    {
      id: 1,
      deliveryStatus: "Delivered",
      mainDish: "Veg Momos",
      plates: 2,
      orderDate: "31 Oct 2023 at 4:23PM",
      totalAmount: "40.00",
      rating: 5,
      items: [
        { id: 1, name: "Garlic Bread Sticks", quantity: 1 },
        {
          id: 2,
          name: "Margherita Pizza",
          quantity: 1,
          description: "Regular (Serves 1, 17.7 CM)",
        },
      ],
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-center">
          <ChevronLeft
            size={24}
            className="text-gray-800 dark:text-gray-200"
            onClick={() => setActiveTab("Home")}
          />
          <h1 className="text-2xl font-bold ml-4 text-gray-900 dark:text-gray-100">
            Your Orders
          </h1>
        </div>
      </div>
      {/* Orders list */}
      <div className="px-4">
        {orderHistory.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4 overflow-hidden"
          >
            {/* Restaurant info */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-3">
                  <img
                    src="https://www.thespruceeats.com/thmb/UnVh_-znw7ikMUciZIx5sNqBtTU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/steamed-momos-wontons-1957616-hero-01-1c59e22bad0347daa8f0dfe12894bc3c.jpg"
                    alt="Royaol Food Plaza"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {order.mainDish}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {order.plates} Plates
                      </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {order.deliveryStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 border-dashed border-t border-gray-100 dark:border-gray-700"></div>

            {/* Order footer */}
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="text-gray-600 dark:text-gray-400">
                {order.orderDate}
              </div>
              <div className="flex items-center">
                <span className="font-bold text-gray-800 dark:text-gray-200 mr-2">
                  {order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
