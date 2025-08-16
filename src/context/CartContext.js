// src/context/CartContext.js
import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    // If product already exists, increase qty
    const exists = cart.find((p) => p._id === product._id);
    if (exists) {
      setCart(cart.map(p => p._id === product._id ? { ...p, qty: p.qty + 1 } : p));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const updateQty = (id, qty) => {
    setCart(prev =>
      prev.map(p => p._id === id ? { ...p, qty: qty } : p)
    );
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};
