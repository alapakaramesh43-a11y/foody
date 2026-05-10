import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // null = not logged in
  const [cart, setCart] = useState([]);   // [{ ...food, quantity }]

  // Auth
  const login = (phoneOrEmail) => {
    setUser({ phone: phoneOrEmail, name: "Foodie" });
  };
  const logout = () => {
    setUser(null);
    setCart([]);
  };

  // Cart
  const addToCart = (food, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === food.id);
      if (existing) {
        return prev.map((i) =>
          i.id === food.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { ...food, quantity: qty }];
    });
  };

  const removeFromCart = (foodId) => {
    setCart((prev) => prev.filter((i) => i.id !== foodId));
  };

  const updateQty = (foodId, qty) => {
    if (qty < 1) { removeFromCart(foodId); return; }
    setCart((prev) =>
      prev.map((i) => (i.id === foodId ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AppContext.Provider
      value={{ user, login, logout, cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
