import React, { useContext, useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Package,
  X,
  Truck,
  Calendar,
  CreditCard,
  ShoppingBag,
  Box,
} from "lucide-react";
import AppContext from "../context/AppContext";

// --- Helper Functions ---

const getStatusInfo = (status) => {
  switch (status) {
    case "pending":
      return {
        icon: <Clock size={16} className="text-amber-500" />,
        color:
          "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        progressWidth: "w-1/4",
        progressColor: "bg-amber-500",
      };
    case "processing":
      return {
        icon: <Truck size={16} className="text-blue-500" />,
        color:
          "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        progressWidth: "w-2/4",
        progressColor: "bg-blue-500",
      };
    case "delivered":
      return {
        icon: <CheckCircle size={16} className="text-green-500" />,
        color:
          "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        progressWidth: "w-full",
        progressColor: "bg-green-500",
      };
    case "cancelled":
      return {
        icon: <XCircle size={16} className="text-red-500" />,
        color: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        progressWidth: "w-0",
        progressColor: "bg-red-500",
      };
    default:
      return {
        icon: <Clock size={16} className="text-gray-500" />,
        color:
          "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
        progressWidth: "w-0",
        progressColor: "bg-gray-1000",
      };
  }
};

const formatDate = (dateString) => {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Sub-components ---

const OrdersHeader = ({ navigate, isAdmin }) => (
  <div className="py-6 flex items-center justify-between">
    <div className="flex items-center">
      <button
        onClick={() => navigate(-1)}
        className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      >
        <ChevronLeft size={20} className="text-gray-800 dark:text-gray-200" />
      </button>
      <h1 className="text-2xl font-bold ml-3 text-gray-900 dark:text-gray-100">
        {isAdmin ? "Manage Orders" : "My Orders"}
      </h1>
    </div>
  </div>
);

const StatusTabs = ({ status, setStatus }) => (
  <div className="mb-6 overflow-x-auto -mx-4 px-4">
    <div className="flex space-x-1 bg-white dark:bg-gray-900 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
      {["all", "pending", "processing", "delivered", "cancelled"].map((s) => {
        const statusInfo = getStatusInfo(s !== "all" ? s : "pending");
        return (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all flex-1 justify-center ${
              status === s
                ? "bg-gray-100 dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {s !== "all" ? (
              <span className="mr-2">{statusInfo.icon}</span>
            ) : (
              <ShoppingBag size={16} className="mr-2 text-purple-500" />
            )}
            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const OrderItemsList = ({ items }) => (
  <div className="mt-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
    {items.map((item, idx) => (
      <div key={idx} className="flex justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100 dark:border-gray-600">
            <Package size={18} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {item.name}
            </p>
            <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.variant && (
                <span className="py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                  Variant: {item.variant.name}
                </span>
              )}
              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                {item.quantity && `Qty: ${item.quantity}`}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            ₹{item.variant.price} {item.quantity && `× ${item.quantity}`}
          </p>
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
            ₹{item.variant.price * item.quantity}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const OrderSummary = ({ paymentMethod, paymentStatus, amount }) => (
  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
      Order Summary
    </h4>
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Payment Status</span>
        <span
          className={`font-medium ${
            paymentStatus === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {paymentStatus === "success" ? "Paid" : "Pending"}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          Delivery Charge
        </span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          ₹40
        </span>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-600 my-2"></div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Total Amount
        </span>
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
          ₹{amount}
        </span>
      </div>
    </div>
  </div>
);

const CustomerInfo = ({ customer }) => (
  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
      Customer Info
    </h4>
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Phone</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {customer.phone}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Location</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {customer.location}
        </span>
      </div>
    </div>
  </div>
);

const AdminOrderControls = ({
  orderId,
  status,
  handleUpdateOrderStatus,
  actionLoading,
}) => {
  if (status === "delivered" || status === "cancelled") return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        Admin Controls
      </h4>
      {status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdateOrderStatus(orderId, "cancelled")}
            disabled={actionLoading[orderId]}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-all"
          >
            {actionLoading[orderId] === "cancelled" ? (
              <span>Cancelling...</span>
            ) : (
              <>
                <X size={16} />
                <span>Cancel</span>
              </>
            )}
          </button>
          <button
            onClick={() => handleUpdateOrderStatus(orderId, "processing")}
            disabled={actionLoading[orderId]}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 transition-all"
          >
            {actionLoading[orderId] === "processing" ? (
              <span>Processing...</span>
            ) : (
              <>
                <Truck size={16} />
                <span>Process</span>
              </>
            )}
          </button>
        </div>
      )}
      {status === "processing" && (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdateOrderStatus(orderId, "delivered")}
            disabled={actionLoading[orderId]}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50 transition-all"
          >
            {actionLoading[orderId] === "delivered" ? (
              <span>Updating...</span>
            ) : (
              <>
                <CheckCircle size={16} />
                <span>Deliver</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const OrderDetails = ({
  order,
  isAdmin,
  handleUpdateOrderStatus,
  actionLoading,
}) => (
  <div className="px-4 pb-4">
    <div className="pt-2 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
      <OrderItemsList items={order.items} />
      <OrderSummary
        paymentMethod={order.payment_method}
        paymentStatus={order.payment_status}
        amount={order.amount}
      />
      {isAdmin && (
        <>
          <CustomerInfo customer={order.customer} />
          <AdminOrderControls
            orderId={order.id}
            status={order.status}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            actionLoading={actionLoading}
          />
        </>
      )}
    </div>
  </div>
);

const OrderCard = ({
  order,
  isExpanded,
  onToggleExpand,
  isAdmin,
  handleUpdateOrderStatus,
  actionLoading,
}) => {
  const statusInfo = getStatusInfo(order.status);

  const renderOrderStatusProgress = (status) => {
    if (status === "cancelled") return null;
    const info = getStatusInfo(status);
    return (
      <div className="w-full mt-2 bg-gray-100 dark:bg-gray-800 rounded-full h-1">
        <div
          className={`h-1 rounded-full ${info.progressColor} transition-all duration-500 ease-in-out ${info.progressWidth}`}
        />
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-start">
            <div
              className={`w-12 h-12 ${
                order.status === "cancelled"
                  ? "bg-red-50 dark:bg-red-900/20"
                  : "bg-blue-50 dark:bg-blue-900/20"
              } rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              {order.status === "cancelled" ? (
                <XCircle size={24} className="text-red-500" />
              ) : (
                <Package size={24} className="text-blue-500" />
              )}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  #{order.id.slice(0, 8)}
                </h3>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Box size={12} />
                  <span>
                    {order.items.length} item{order.items.length !== 1 && "s"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={12} />
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <CreditCard size={12} />
                  <span>
                    {order.payment_method === "cod" ? "COD" : "Online"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color}`}
            >
              <div className="flex items-center space-x-1.5">
                {statusInfo.icon}
                <span>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              ₹{order.amount}
            </div>
          </div>
        </div>
        {renderOrderStatusProgress(order.status)}
      </div>

      {isExpanded && (
        <OrderDetails
          order={order}
          isAdmin={isAdmin}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          actionLoading={actionLoading}
        />
      )}

      <div
        className={`px-4 py-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-700 ${
          isExpanded
            ? "bg-white dark:bg-gray-900"
            : "bg-gray-50 dark:bg-gray-800/50"
        }`}
      >
        <button
          onClick={onToggleExpand}
          className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          <span>{isExpanded ? "Hide Details" : "View Details"}</span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </div>
  );
};

const EmptyOrders = ({ status, isAdmin, navigate }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
      <Package size={32} className="text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
      No Orders Found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
      {status !== "all"
        ? `You currently have no ${status} orders.`
        : `You don't have any orders yet. Start shopping to see your orders here.`}
    </p>
    {!isAdmin && status === "all" && (
      <button
        onClick={() => navigate("/menu")}
        className="px-6 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
      >
        Browse Menu
      </button>
    )}
  </div>
);

const LoadMoreButton = ({ loading, onClick }) => (
  <div className="mt-6 flex justify-center">
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-2.5 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
    >
      {loading ? (
        <>
          <span className="animate-spin h-4 w-4 rounded-full border-2 border-white border-t-transparent"></span>
          <span>Loading...</span>
        </>
      ) : (
        <span>Load More Orders</span>
      )}
    </button>
  </div>
);

// --- Main Component ---

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, rfpFetch } = useContext(AppContext);

  const { search } = location;
  const urlParams = new URLSearchParams(search);
  const order_id = urlParams.get("order_id") || "";

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(
    async (loadMore = false, currentStatus) => {
      setLoading(true);
      const currentOffset = loadMore ? offset : 0;
      const endpoint = isAdmin
        ? `/orders/admin?status=${currentStatus}&offset=${currentOffset}`
        : `/orders/user?status=${currentStatus}&offset=${currentOffset}`;

      try {
        const response = await rfpFetch(endpoint);
        const parsed = response.data.map((order) => {
          let itemsArray = [];
          try {
            const parsedItems = JSON.parse(order.items);
            if (Array.isArray(parsedItems)) {
              itemsArray = parsedItems;
            }
          } catch (e) {
            console.warn(
              `Failed to parse items for order ${order.id}:`,
              order.items
            );
          }
          return { ...order, items: itemsArray };
        });

        setHasMore(parsed.length === 10);

        if (loadMore) {
          setOrders((prev) => [...prev, ...parsed]);
          setOffset((prev) => prev + parsed.length);
        } else {
          setOrders(parsed);
          setOffset(parsed.length);
          if (order_id) {
            const newExpanded = {};
            parsed.forEach((order) => {
              if (order.id === order_id) newExpanded[order.id] = true;
            });
            setExpanded(newExpanded);
          } else {
            setExpanded({});
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, rfpFetch, offset, order_id]
  );

  useEffect(() => {
    fetchOrders(false, status);
  }, [status, fetchOrders]);

  const loadMoreOrders = () => {
    fetchOrders(true, status);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const messages = {
      processing: "Are you sure you want to process this order?",
      cancelled: "Are you sure you want to cancel this order?",
      delivered: "Are you sure this order has been delivered?",
    };
    if (!window.confirm(messages[newStatus])) return;

    setActionLoading((prev) => ({ ...prev, [orderId]: newStatus }));
    try {
      await rfpFetch(`/orders/update/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error(`Error updating order to ${newStatus}:`, error);
      alert(`Failed to update order to ${newStatus}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <OrdersHeader navigate={navigate} isAdmin={isAdmin} />
        {/* Filter component removed */}
        <StatusTabs status={status} setStatus={setStatus} />

        {loading && orders.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders status={status} isAdmin={isAdmin} navigate={navigate} />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={!!expanded[order.id]}
                onToggleExpand={() => toggleExpand(order.id)}
                isAdmin={isAdmin}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}

        {orders.length > 0 && hasMore && (
          <LoadMoreButton
            loading={loading && orders.length > 0}
            onClick={loadMoreOrders}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
