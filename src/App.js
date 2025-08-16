// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Identify from "./pages/Identify";
import DiseaseDetect from "./pages/DiseaseDetect";
import ChatBot from "./pages/ChatBot";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Forum from "./pages/Forum";
import Profile from "./pages/Profile";
import ClimateAdvice from "./pages/ClimateAdvice";

// E-commerce Pages
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Context
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/identify" element={<Identify />} />
            <Route path="/disease-detect" element={<DiseaseDetect />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/climate-advice" element={<ClimateAdvice />} />
          </Route>
        </Routes>

        {/* Global Toast Notifications */}
        <ToastContainer position="top-center" autoClose={3000} />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
