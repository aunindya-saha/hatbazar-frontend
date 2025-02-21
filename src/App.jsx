import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import BuyerLayout from "@/components/layout/BuyerLayout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetails from "./pages/products/ProductDetails";
import CartPage from "./pages/cart/CartPage";
import PaymentGateway from "./pages/cart/PaymentGateway";

// Buyer Pages
import BuyerHome from "./pages/buyer/BuyerHome";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import BuyerCart from "./pages/buyer/BuyerCart";
import BuyerHistory from "./pages/buyer/BuyerHistory";
import BuyerComplaints from "./pages/buyer/BuyerComplaints";
import BuyerReviews from "./pages/buyer/BuyerReviews";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <CartProvider>
      <Toaster 
        position="top-center" 
        expand={true} 
        richColors 
        closeButton
        theme="light"
        style={{
          marginTop: "4rem"
        }}
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e2e8f0',
            padding: '16px',
          },
          success: {
            style: {
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
            },
          },
        }}
      />

      <Router>
        <Routes>
          {/* Public Routes */}
          {/* <MainLayout> */}
            <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
            <Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/products/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
          {/* </MainLayout> */}

          {/* Auth Routes */}
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
          <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
          <Route path="/payment" element={
            <ProtectedRoute>
              <MainLayout><PaymentGateway /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Buyer Routes */}
          <Route path="/buyer" element={
            <ProtectedRoute>
              <BuyerLayout />
            </ProtectedRoute>
          }>
            <Route path="home" element={<BuyerHome />} />
            <Route path="profile" element={<BuyerProfile />} />
            <Route path="cart" element={<BuyerCart />} />
            <Route path="history" element={<BuyerHistory />} />
            <Route path="complaints" element={<BuyerComplaints />} />
            <Route path="reviews" element={<BuyerReviews />} />
          </Route>
        </Routes>
      </Router>
      
    </CartProvider>
  );
}

export default App;
