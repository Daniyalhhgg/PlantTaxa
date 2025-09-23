import axios from "axios";

// ----------------------
// 🔗 Base URL
// ----------------------
const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://upbeat-rejoicing-production.up.railway.app/api"
      : "http://localhost:5000/api",
});

// 🔑 Automatically attach JWT token (agar login ke baad localStorage me save hai)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------
// ✅ Auth
// ----------------------
export const registerUser = async (userData) => {
  try {
    const { data } = await API.post("/auth/register", userData);
    return data;
  } catch (err) {
    return { error: err.response?.data?.msg || err.message };
  }
};

export const loginUser = async (credentials) => {
  try {
    const { data } = await API.post("/auth/login", credentials);
    return data;
  } catch (err) {
    return { error: err.response?.data?.msg || err.message };
  }
};

// ----------------------
// ✅ Disease Prediction
// ----------------------
export const predictDisease = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const { data } = await API.post("/disease/upload", formData);
    return data; // e.g. { result: "Tomato___Late_blight" }
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ----------------------
// ✅ Plant Shop
// ----------------------
export const getPlants = async () => {
  try {
    const { data } = await API.get("/plants");
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

export const getPlantById = async (id) => {
  try {
    const { data } = await API.get(`/plants/${id}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ----------------------
// ✅ Orders
// ----------------------

// Quick order – single quantity, default COD
export const buyPlant = async (plantId) => {
  try {
    const { data } = await API.post("/orders", { plantId });
    return data; // { msg: "Order placed successfully" }
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// Checkout page – full order with quantity, address, etc.
export const placeOrder = async (orderData) => {
  try {
    const { data } = await API.post("/orders", orderData);
    return data; // { msg: "Order placed successfully" }
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// 🔑 Get logged-in user's orders
export const getMyOrders = async () => {
  try {
    const { data } = await API.get("/orders/my");
    return data; // array of orders
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ----------------------
// ✅ Attach helpers to default export for API.getXYZ() usage
// ----------------------
API.registerUser = registerUser;
API.loginUser = loginUser;
API.predictDisease = predictDisease;
API.getPlants = getPlants;
API.getPlantById = getPlantById;
API.buyPlant = buyPlant;
API.placeOrder = placeOrder;
API.getMyOrders = getMyOrders;

export default API;
