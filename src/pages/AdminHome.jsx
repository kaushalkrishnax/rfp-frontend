import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee,
  Wallet,
  Check,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";
import AppContext from "../context/AppContext";
import rfpLogo from "../assets/rfp.png";

const AdminHome = () => {
  const navigate = useNavigate();
  const { rfpFetch } = useContext(AppContext);

  const [ordersStats, setOrdersStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await rfpFetch("/orders/stats");
        setOrdersStats(response.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not load orders data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [rfpFetch]);

  const calculateStats = () => {
    return {
      totalEarnings: ordersStats?.totalEarnings,
      todaysEarnings: ordersStats?.todaysEarnings,
      todaysOrders: ordersStats?.todaysOrders,
      delivered: ordersStats?.delivered,
      totalOrders: ordersStats?.totalOrders,
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const StatCard = ({ label, value, icon, bg, isLoading, subText }) => (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          {isLoading ? (
            <div className="mt-1">
              <div className="h-7 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
            </div>
          ) : (
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {value}
            </h3>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${bg} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      {isLoading ? (
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {subText}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-30 h-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={rfpLogo}
                alt="RFP Logo"
                className="w-8 h-8 rounded-full object-cover bg-white dark:bg-gray-800 p-0.5 shadow-sm"
              />
              <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400">
                DASHBOARD
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://img.freepik.com/premium-psd/contact-icon-illustration-isolated_23-2151903357.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 p-4 rounded-lg text-center mb-6">
              {error}
            </div>
          )}
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            <StatCard
              label="Today's Earnings"
              value={formatCurrency(stats.todaysEarnings)}
              icon={
                <IndianRupee
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />
              }
              bg="bg-green-100 dark:bg-green-900"
              isLoading={isLoading}
              subText={
                <span className="flex items-center text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} className="mr-1" />
                  4.75% from yesterday
                </span>
              }
            />
            <StatCard
              label="Total Earnings"
              value={formatCurrency(stats.totalEarnings)}
              icon={
                <Wallet
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
              }
              bg="bg-purple-100 dark:bg-purple-900"
              isLoading={isLoading}
              subText="Lifetime earnings"
            />
            <StatCard
              label="Total Orders"
              value={stats.totalOrders}
              icon={
                <ShoppingBag
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
              }
              bg="bg-blue-100 dark:bg-blue-900"
              isLoading={isLoading}
              subText={`${stats.todaysOrders} orders today`}
            />
            <StatCard
              label="Delivery Success"
              value={
                stats.totalOrders > 0
                  ? `${Math.round(
                      (stats.delivered / stats.totalOrders) * 100
                    )}%`
                  : "0%"
              }
              icon={
                <Check
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              }
              bg="bg-indigo-100 dark:bg-indigo-900"
              isLoading={isLoading}
              subText={`${stats.delivered} successful deliveries`}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHome;
