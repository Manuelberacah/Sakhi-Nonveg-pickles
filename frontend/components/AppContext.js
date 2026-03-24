"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "../lib/api";

const AppContext = createContext(null);
const GUEST_CART_KEY = "sakhi_guest_cart";
const GUEST_WISHLIST_KEY = "sakhi_guest_wishlist";

const getStoredToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("sakhi_token") || "";
};

const loadGuestCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadGuestWishlist = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const saveGuestWishlist = (ids) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
};

const clearGuestCollections = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
  localStorage.removeItem(GUEST_WISHLIST_KEY);
};

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mergedGuest, setMergedGuest] = useState(false);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  useEffect(() => {
    const boot = async () => {
      let productsData = [];
      try {
        const [productsRes, updatesRes] = await Promise.all([api.get("/products"), api.get("/updates")]);
        productsData = productsRes.data || [];
        setProducts(productsData);
        setUpdates(updatesRes.data || []);
      } catch (error) {
        console.error(error);
      }

      if (!token) {
        const guestCart = loadGuestCart();
        const guestWishlist = loadGuestWishlist();
        const cartItems = guestCart
          .map((item) => {
            const product = productsData.find((p) => p._id === item.productId);
            if (!product) return null;
            return { product, size: item.size, quantity: item.quantity };
          })
          .filter(Boolean);
        const wishlistItems = guestWishlist
          .map((id) => productsData.find((p) => p._id === id))
          .filter(Boolean);
        setCart(cartItems);
        setWishlist(wishlistItems);
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

        if (!mergedGuest) {
          const guestCart = loadGuestCart();
          const guestWishlist = loadGuestWishlist();
          if (guestCart.length || guestWishlist.length) {
            const existingWishlistIds = new Set(
              (colRes.data.wishlist || []).map((item) => item._id?.toString())
            );
            for (const id of guestWishlist) {
              if (!existingWishlistIds.has(id)) {
                await api.post("/user/wishlist/toggle", { productId: id });
              }
            }
            for (const item of guestCart) {
              await api.post("/user/cart/add", {
                productId: item.productId,
                size: item.size,
                quantity: item.quantity
              });
            }
            const refreshed = await api.get("/user/collections");
            setWishlist(refreshed.data.wishlist || []);
            setCart(refreshed.data.cart || []);
            clearGuestCollections();
          }
          setMergedGuest(true);
        }
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
    setMergedGuest(false);
  };

  const signup = async (payload) => {
    const res = await api.post("/auth/signup", payload);
    saveToken(res.data.token);
    setUser(res.data.user);
    const colRes = await api.get("/user/collections");
    setWishlist(colRes.data.wishlist || []);
    setCart(colRes.data.cart || []);
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
    if (!token) {
      const guestIds = loadGuestWishlist();
      const exists = guestIds.includes(productId);
      const nextIds = exists ? guestIds.filter((id) => id !== productId) : [...guestIds, productId];
      saveGuestWishlist(nextIds);
      const nextWishlist = nextIds
        .map((id) => products.find((p) => p._id === id))
        .filter(Boolean);
      setWishlist(nextWishlist);
      return;
    }
    const res = await api.post("/user/wishlist/toggle", { productId });
    setWishlist(res.data.wishlist || []);
  };

  const addToCart = async (productId, size, quantity = 1) => {
    if (!token) {
      const product = products.find((p) => p._id === productId);
      if (!product) return;
      const guestCart = loadGuestCart();
      const existingIndex = guestCart.findIndex(
        (item) => item.productId === productId && item.size === size
      );
      const nextCart = [...guestCart];
      if (existingIndex >= 0) {
        nextCart[existingIndex].quantity += quantity;
      } else {
        nextCart.push({ productId, size, quantity });
      }
      saveGuestCart(nextCart);
      const displayCart = nextCart
        .map((item) => {
          const p = products.find((prod) => prod._id === item.productId);
          if (!p) return null;
          return { product: p, size: item.size, quantity: item.quantity };
        })
        .filter(Boolean);
      setCart(displayCart);
      return;
    }
    const res = await api.post("/user/cart/add", { productId, size, quantity });
    setCart(res.data.cart || []);
  };

  const updateCartItem = async (productId, size, quantity) => {
    if (!token) {
      const guestCart = loadGuestCart();
      const nextCart = guestCart
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
      saveGuestCart(nextCart);
      const displayCart = nextCart
        .map((item) => {
          const p = products.find((prod) => prod._id === item.productId);
          if (!p) return null;
          return { product: p, size: item.size, quantity: item.quantity };
        })
        .filter(Boolean);
      setCart(displayCart);
      return;
    }
    const res = await api.patch("/user/cart/update", { productId, size, quantity });
    setCart(res.data.cart || []);
  };

  const removeCartItem = async (productId, size) => {
    if (!token) {
      const guestCart = loadGuestCart();
      const nextCart = guestCart.filter(
        (item) => !(item.productId === productId && item.size === size)
      );
      saveGuestCart(nextCart);
      const displayCart = nextCart
        .map((item) => {
          const p = products.find((prod) => prod._id === item.productId);
          if (!p) return null;
          return { product: p, size: item.size, quantity: item.quantity };
        })
        .filter(Boolean);
      setCart(displayCart);
      return;
    }
    const res = await api.delete("/user/cart/remove", { data: { productId, size } });
    setCart(res.data.cart || []);
  };

  const clearCart = async () => {
    if (!token) {
      saveGuestCart([]);
      setCart([]);
      return;
    }
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
