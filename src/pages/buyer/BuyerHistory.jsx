import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:5001/api';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
    PROCESSING: { color: "bg-blue-100 text-blue-800", icon: Package },
    COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    DELIVERED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
    CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4 mr-1" />
      {status}
    </span>
  );
};

const BuyerHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${API_URL}/buyers/${user._id}/orders`);
      setOrders(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, { status: "CANCELLED" });
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h1>
        <p className="text-gray-600 mb-8">
          You haven't placed any orders yet. Start shopping to see your order history.
        </p>
        <Button
          onClick={() => navigate("/buyer/home")}
          className="bg-green-600 hover:bg-green-700"
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order ID: {order._id}
                  </p>
                  <p className="text-sm text-gray-600">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="divide-y divide-gray-200">
                {order.ordered_products.map((item) => (
                  <div key={item._id} className="py-4">
                    <div className="flex items-center">
                      <img
                        src={item.product_id.image}
                        alt={item.product_id.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product_id.name}
                        </h3>
                        <p className="text-gray-600">
                          Quantity: {item.quantity} {item.product_id.unit}
                        </p>
                        <p className="text-green-600">
                          ৳{item.product_id.price_per_unit}/{item.product_id.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">
                          ৳{item.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600">Shipping Address:</p>
                    <p className="text-gray-900">{order.shipping_address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Total Amount:</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ৳{order.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.status === "PENDING" && (
                  <Button
                    variant="outline"
                    className="mt-4 text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerHistory; 