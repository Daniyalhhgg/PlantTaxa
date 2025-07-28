// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Identify from "./pages/Identify";
import DiseaseDetect from "./pages/DiseaseDetect";
import ChatBot from "./pages/ChatBot";
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Forum from "./pages/Forum";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ClimateAdvice from "./pages/ClimateAdvice";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/identify" element={<Identify />} />
          <Route path="/disease-detect" element={<DiseaseDetect />} />
          <Route path="/ChatBot" element={<ChatBot />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/ClimateAdvice" element={<ClimateAdvice />} />

        </Route>
      </Routes>

      {/* Toasts will be available on all pages */}
      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
