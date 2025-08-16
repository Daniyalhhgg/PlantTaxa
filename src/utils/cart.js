// Local storage-based cart for simplicity
export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const addToCart = (product, qty = 1) => {
  let cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromCart = (productId) => {
  let cart = getCart().filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
