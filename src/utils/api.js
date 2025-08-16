import axios from "axios";

// Base API URL (supports environment variable or fallback to localhost)
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create a reusable Axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================== Auth ==================
export const registerUser = (userData) => api.post("/auth/register", userData);
export const loginUser = (credentials) => api.post("/auth/login", credentials);

// ================== Disease Prediction ==================
export const predictDisease = (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  return api.post("/disease/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ================== Products / Shop ==================
export const getProducts = () => api.get("/products");         // List all products
export const getProductById = (id) => api.get(`/products/${id}`); // Get single product by ID

// ================== Orders / Checkout ==================
export const placeOrder = (orderData, token) =>
  api.post("/orders", orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserOrders = (token) =>
  api.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ================== Optional: Admin ==================
// Example: Add new product (admin only)
export const addProduct = (productData, token) =>
  api.post("/admin/products", productData, {
    headers: { Authorization: `Bearer ${token}` },
  });
