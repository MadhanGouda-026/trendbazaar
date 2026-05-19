import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tb_user")); } catch { return null; }
  });
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tb_cart")) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem("tb_cart", JSON.stringify(cart)); }, [cart]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("tb_user", JSON.stringify(userData));
    setWishlist(userData.wishlist || []);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tb_user");
    setWishlist([]);
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(i => i._id === product._id);
      if (ex) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    showToast("Added to cart! 🛒");
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);
  const cartTotal = cart.reduce((a, i) => a + i.price * i.qty, 0);

  const headers = user ? { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` }
    : { "Content-Type": "application/json" };

  return (
    <AuthContext.Provider value={{
      user, login, logout, cart, addToCart, removeFromCart,
      updateQty, clearCart, cartCount, cartTotal, wishlist,
      setWishlist, headers, showToast
    }}>
      {children}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
