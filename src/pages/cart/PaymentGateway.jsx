import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { CreditCard, Calendar, Lock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const API_URL = 'http://localhost:5001/api';

const PaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, totalAmount } = location.state || {};
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "4111 1111 1111 1111", // Dummy card number
    expiryDate: "12/25",
    cvv: "123",
  });

  if (!orders || !orders.length) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Place orders and get their IDs
      const orderPromises = orders.map(orderData => 
        axios.post(`${API_URL}/orders`, orderData)
      );
      
      const orderResponses = await Promise.all(orderPromises);
      
      // Create transactions for each order
      const transactionPromises = orderResponses.map(response => {
        const transactionData = {
          order_id: response.data._id,
          amount: response.data.total_price,
          payment_type: "CARD",
          status: "SUCCESS"
        };
        return axios.post(`${API_URL}/transactions`, transactionData);
      });

      await Promise.all(transactionPromises);

      clearCart();
      toast.success("Payment successful! Orders have been placed.");
      navigate("/buyer/history");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            <div className="text-right">
              <p className="text-sm text-gray-600">Order Total</p>
              <p className="text-2xl font-bold text-green-600">
                ৳{totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative mt-1">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="pl-10"
                  required
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <div className="relative mt-1">
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <Label htmlFor="cvv">CVV</Label>
                <div className="relative mt-1">
                  <Input
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="pl-10"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Test Card Details:</strong><br />
                Card Number: 4111 1111 1111 1111<br />
                Expiry: Any future date<br />
                CVV: Any 3 digits
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Payment"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/cart")}
              disabled={loading}
            >
              Cancel
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway; 