"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../lib/api";

const AppContext = createContext(null);

const getStoredToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("sakhi_token") || "";
};

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  useEffect(() => {
    const boot = async () => {
      try {
        const [productsRes, updatesRes] = await Promise.all([api.get("/products"), api.get("/updates")]);
        setProducts(productsRes.data);
        setUpdates(updatesRes.data || []);
      } catch (error) {
        console.error(error);
      }

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const [meRes, colRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/user/collections")
        ]);
        setUser(meRes.data.user);
        setWishlist(colRes.data.wishlist || []);
        setCart(colRes.data.cart || []);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [token]);

  const saveToken = (newToken) => {
    setToken(newToken);
    setAuthToken(newToken);
    localStorage.setItem("sakhi_token", newToken);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setCart([]);
    setWishlist([]);
    setAuthToken("");
    localStorage.removeItem("sakhi_token");
  };

  const signup = async (payload) => {
    const res = await api.post("/auth/signup", payload);
    saveToken(res.data.token);
    setUser(res.data.user);
  };

  const login = async (payload) => {
    const res = await api.post("/auth/login", payload);
    saveToken(res.data.token);
    setUser(res.data.user);

    const colRes = await api.get("/user/collections");
    setWishlist(colRes.data.wishlist || []);
    setCart(colRes.data.cart || []);
  };

  const refreshUpdates = async () => {
    const res = await api.get("/updates");
    setUpdates(res.data || []);
  };

  const createUpdate = async (payload, adminToken) => {
    await api.post("/updates", payload, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    await refreshUpdates();
  };

  const removeUpdate = async (id, adminToken) => {
    await api.delete(`/updates/${id}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    await refreshUpdates();
  };

  const toggleWishlist = async (productId) => {
    const res = await api.post("/user/wishlist/toggle", { productId });
    setWishlist(res.data.wishlist || []);
  };

  const addToCart = async (productId, size, quantity = 1) => {
    const res = await api.post("/user/cart/add", { productId, size, quantity });
    setCart(res.data.cart || []);
  };

  const updateCartItem = async (productId, size, quantity) => {
    const res = await api.patch("/user/cart/update", { productId, size, quantity });
    setCart(res.data.cart || []);
  };

  const removeCartItem = async (productId, size) => {
    const res = await api.delete("/user/cart/remove", { data: { productId, size } });
    setCart(res.data.cart || []);
  };

  const clearCart = async () => {
    await api.delete("/user/cart/clear");
    setCart([]);
  };

  const contextValue = useMemo(
    () => ({
      token,
      user,
      products,
      updates,
      cart,
      wishlist,
      loading,
      signup,
      login,
      logout,
      refreshUpdates,
      createUpdate,
      removeUpdate,
      toggleWishlist,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      setUser
    }),
    [token, user, products, updates, cart, wishlist, loading]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
