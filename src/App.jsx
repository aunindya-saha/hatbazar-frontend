import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import Layout from "@/components/layout/Layout";
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
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
          <Route path="/cart" element={<Layout><CartPage /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
          
          {/* Protected Routes */}
          <Route path="/payment" element={
            <ProtectedRoute>
              <Layout><PaymentGateway /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/home" element={
            <ProtectedRoute>
              <Layout><BuyerHome /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/profile" element={
            <ProtectedRoute>
              <Layout><BuyerProfile /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/cart" element={
            <ProtectedRoute>
              <Layout><BuyerCart /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/history" element={
            <ProtectedRoute>
              <Layout><BuyerHistory /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/complaints" element={
            <ProtectedRoute>
              <Layout><BuyerComplaints /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/buyer/reviews" element={
            <ProtectedRoute>
              <Layout><BuyerReviews /></Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
