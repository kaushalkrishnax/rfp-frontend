import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Package,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import AppContext from "../context/AppContext";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order_id = "" } = location.state || {};
  const { isAdmin, rfpFetch } = useContext(AppContext);

  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("all");
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = async (loadMore = false) => {
    setLoading(true);
    const currentOffset = loadMore ? offset : 0;

    const endpoint = isAdmin
      ? `/admin/orders?status=${status}&offset=${currentOffset}`
      : `/orders?status=${status}&offset=${currentOffset}`;

    try {
      const response = await rfpFetch(endpoint);
      const parsed = response.data.map((order) => ({
        ...order,
        items: JSON.parse(order.items),
      }));

      setHasMore(parsed.length === 10);

      if (loadMore) {
        setOrders((prev) => [...prev, ...parsed]);
      } else {
        setOrders(parsed);

        if (order_id) {
          const newExpanded = {};
          parsed.forEach((order) => {
            if (order.id === order_id) newExpanded[order.id] = true;
          });
          setExpanded(newExpanded);
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    setOffset(0);
    fetchOrders(false);
  }, [status]);

  const loadMore = () => {
    setOffset((prev) => prev + 10);
    fetchOrders(true);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "processing":
        return {
          icon: <Clock size={16} />,
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        };
      case "delivered":
        return {
          icon: <CheckCircle size={16} />,
          color:
            "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        };
      case "cancelled":
        return {
          icon: <XCircle size={16} />,
          color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
        };
      default:
        return {
          icon: <Clock size={16} />,
          color:
            "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        };
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const ProcessMessage = {
      processing: "Are you sure you want to process this order?",
      cancelled: "Are you sure you want to cancel this order?",
      delivered: "Are you sure this order has been delivered?",
    }[newStatus];
  
    if (!window.confirm(ProcessMessage)) return;
  
    setActionLoading((prev) => ({ ...prev, [orderId]: newStatus }));
  
    try {
      await rfpFetch(`/admin/orders/update/${orderId}`, {
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
    }
  
    setActionLoading((prev) => ({ ...prev, [orderId]: false }));
  };  

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
      <div className="max-w-lg mx-auto px-3">
        <div className="py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="p-1">
            <ChevronLeft
              size={20}
              className="text-gray-800 dark:text-gray-200"
            />
          </button>
          <h1 className="text-xl font-semibold ml-2 text-gray-900 dark:text-gray-100">
            {isAdmin ? "Manage Orders" : "Orders"}
          </h1>
        </div>

        <div className="mb-4 overflow-x-auto -mx-3 px-3">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
            {["all", "pending", "processing", "delivered", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1 rounded-md text-xs font-medium ${
                  status === s
                    ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <Package size={32} className="text-gray-400 mb-2" />
            <p className="text-gray-500 dark:text-gray-400">
              No {status} orders found
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-3 cursor-pointer" onClick={() => toggleExpand(order.id)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800 dark:text-gray-200">
                          #{order.id.slice(0, 8)}
                        </h3>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          ({order.items.length} item
                          {order.items.length !== 1 && "s"})
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2 py-1 rounded-md text-xs ${
                          getStatusInfo(order.status).color
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusInfo(order.status).icon}
                          <span>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-1 rounded-full"
                      >
                        {expanded[order.id] ? (
                          <ChevronUp size={16} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {expanded[order.id] && (
                  <div className="px-3 pb-3">
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                              <Package size={14} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {item.name}
                              </p>
                              <div className="flex text-xs text-gray-500 dark:text-gray-400">
                                {item.variant && <span>• {item.variant}</span>}
                                <span className="ml-1">
                                  • ₹{item.variants[0].price} × {item.quantity}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              ₹{item.variants[0].price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Total
                        </span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">
                          ₹{order.amount}
                        </span>
                      </div>

                      {isAdmin && order.status === "pending" && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                              disabled={actionLoading[order.id]}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50"
                            >
                              {actionLoading[order.id] === "cancel" ? (
                                <span>Cancelling...</span>
                              ) : (
                                <>
                                  <X size={14} />
                                  <span>Cancel</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, "processing")}
                              disabled={actionLoading[order.id]}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50"
                            >
                              {actionLoading[order.id] === "processing" ? (
                                <span>Processing...</span>
                              ) : (
                                <>
                                  <Check size={14} />
                                  <span>Process</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!expanded[order.id] && (
                  <div className="px-3 py-2 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        ₹{order.amount}
                      </div>
                    </div>
                  </div>
                )}

                {isAdmin &&
                  order.status === "pending" &&
                  !expanded[order.id] && (
                    <div className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/20 flex items-center justify-center gap-1">
                      <AlertTriangle
                        size={12}
                        className="text-yellow-500 dark:text-yellow-400"
                      />
                      <span className="text-xs text-yellow-600 dark:text-yellow-400">
                        Expand to see more details and manage this order
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {orders.length > 0 && hasMore && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm disabled:bg-blue-300"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
