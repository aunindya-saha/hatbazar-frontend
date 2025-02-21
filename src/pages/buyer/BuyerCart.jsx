import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import axios from "axios";

const API_URL = 'http://localhost:5001/api';

const BuyerCart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");

  const handleQuantityChange = (productId, value) => {
    const quantity = parseInt(value);
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter a shipping address");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const orderData = {
        buyer_id: user._id,
        ordered_products: cart.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        total_price: getCartTotal(),
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        status: "PENDING"
      };

      await axios.post(`${API_URL}/orders`, orderData);
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/buyer/history");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <ShoppingBag className="h-24 w-24 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">
          Browse our products and add some items to your cart.
        </p>
        <Button
          onClick={() => navigate("/buyer/home")}
          className="bg-green-600 hover:bg-green-700"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.productId} className="p-6">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-green-600">
                        ৳{item.price}/{item.unit}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, e.target.value)
                        }
                        className="w-20"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">
                        ৳{item.total.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">৳{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">Free</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-gray-900">Total</span>
                <span className="text-lg font-medium text-gray-900">
                  ৳{getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address
              </label>
              <Input
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your shipping address"
                className="mb-4"
              />
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </Button>

            <Button
              variant="outline"
              className="w-full border-green-600 text-green-600"
              onClick={() => navigate("/buyer/home")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerCart; 