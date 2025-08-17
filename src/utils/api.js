const API_URL = "http://localhost:5000/api"; // Change to deployed URL later

// =======================
// Auth
// =======================
const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Registration failed");
    return data;
  } catch (err) {
    return { error: err.message };
  }
};

const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.msg || "Login failed");
    return data;
  } catch (err) {
    return { error: err.message };
  }
};

// =======================
// Disease Prediction
// =======================
const predictDisease = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${API_URL}/disease/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Prediction failed");

    return data; // { result: "Tomato___Late_blight" }
  } catch (err) {
    return { error: err.message };
  }
};

// =======================
// Plant Shop
// =======================
const getPlants = async () => {
  try {
    const res = await fetch(`${API_URL}/plants`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch plants");
    return data; // expected: [ { _id, name, price, imageUrl }, ... ]
  } catch (err) {
    return { error: err.message };
  }
};

const buyPlant = async (plantId) => {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantId }),
      credentials: "include", // if using cookies
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Order failed");
    return data; // expected: { msg: "Order placed successfully" }
  } catch (err) {
    return { error: err.message };
  }
};

// =======================
// Default Export (to match old style)
// =======================
const API = {
  registerUser,
  loginUser,
  predictDisease,
  getPlants,
  buyPlant,
};

export default API;
