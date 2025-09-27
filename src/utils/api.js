import axios from "axios";

// ----------------------
// 🔗 Base URL
// ----------------------
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// 🔑 Automatically attach JWT token
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
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ----------------------
// ✅ Plant Shop (User + Admin)
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

// ✅ Admin: Add Plant (with image upload)
export const addPlant = async (plantData) => {
  try {
    const formData = new FormData();
    for (const key in plantData) {
      formData.append(key, plantData[key]);
    }
    const { data } = await API.post("/plants", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ✅ Admin: Update Plant
export const updatePlant = async (id, plantData) => {
  try {
    const formData = new FormData();
    for (const key in plantData) {
      formData.append(key, plantData[key]);
    }
    const { data } = await API.put(`/plants/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ✅ Admin: Delete Plant
export const deletePlant = async (id) => {
  try {
    const { data } = await API.delete(`/plants/${id}`);
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ----------------------
// ✅ Orders
// ----------------------
export const buyPlant = async (plantId) => {
  try {
    const { data } = await API.post("/orders", { plantId });
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

export const placeOrder = async (orderData) => {
  try {
    const { data } = await API.post("/orders", orderData);
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

export const getMyOrders = async () => {
  try {
    const { data } = await API.get("/orders/my");
    return data;
  } catch (err) {
    return { error: err.response?.data?.error || err.message };
  }
};

// ----------------------
// 🔑 Attach helpers to default export
// ----------------------
API.registerUser = registerUser;
API.loginUser = loginUser;
API.predictDisease = predictDisease;
API.getPlants = getPlants;
API.getPlantById = getPlantById;
API.addPlant = addPlant;
API.updatePlant = updatePlant;
API.deletePlant = deletePlant;
API.buyPlant = buyPlant;
API.placeOrder = placeOrder;
API.getMyOrders = getMyOrders;

export default API;
