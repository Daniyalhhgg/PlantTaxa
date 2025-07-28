const API_URL = "http://localhost:5000/api"; // Change to deployed URL later

export const registerUser = async (userData) => {
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

export const loginUser = async (credentials) => {
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

// ✅ NEW: Upload plant image and get disease prediction
export const predictDisease = async (imageFile) => {
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
