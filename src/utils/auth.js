// ==== src/utils/auth.js ====

// Save JWT token to localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Retrieve token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000); // in seconds

    if (payload.exp && payload.exp < now) {
      removeToken();
      return false;
    }

    return true;
  } catch (err) {
    console.error("Invalid token format:", err);
    removeToken();
    return false;
  }
};

// Optional: Get user info from token
export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (err) {
    console.error("Failed to decode token");
    return null;
  }
};
