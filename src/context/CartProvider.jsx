import { useState, useContext, useCallback } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function CartProvider({ children }) {
  const { token }                  = useContext(AuthContext);
  const [cart, setCart]            = useState(null);
  const [cartCount, setCount]      = useState(0);
  const [cartLoading, setCartLoad] = useState(false);

  const updateCartState = useCallback((data, num) => {
    setCart(data);
    setCount(num ?? data?.products?.length ?? 0);
  }, []);

  // ── GET — always fetches fresh from API ───────────────
  const fetchCart = useCallback(async () => {
    if (!token) return;
    setCartLoad(true);
    try {
      const res = await api.get("/cart");
      if (res.data.status === "success") {
        updateCartState(res.data.data, res.data.numOfCartItems);
      }
    } catch {
      // empty cart returns error from this API — safe to ignore
    } finally {
      setCartLoad(false);
    }
  }, [token, updateCartState]);

  // ── ADD ───────────────────────────────────────────────
  const addToCart = useCallback(async (productId) => {
    if (!token) return;
    try {
      const res = await api.post("/cart", { productId });
      if (res.data.status === "success") {
        toast.success("Added to cart! 🛒");
        updateCartState(res.data.data, res.data.numOfCartItems);
      }
    } catch {
      toast.error("Failed to add to cart");
    }
  }, [token, updateCartState]);

  // ── UPDATE QTY ────────────────────────────────────────
  const updateQty = useCallback(async (productId, count) => {
    if (!token) return;
    if (count < 1) {
      try {
        const res = await api.delete(`/cart/${productId}`);
        if (res.data.status === "success") {
          toast("Removed from cart", { icon: "🗑️" });
          updateCartState(res.data.data, res.data.numOfCartItems);
        }
      } catch {}
      return;
    }
    try {
      const res = await api.put(`/cart/${productId}`, { count });
      if (res.data.status === "success") {
        updateCartState(res.data.data, res.data.numOfCartItems);
      }
    } catch {}
  }, [token, updateCartState]);

  // ── REMOVE ────────────────────────────────────────────
  const removeFromCart = useCallback(async (productId) => {
    if (!token) return;
    try {
      const res = await api.delete(`/cart/${productId}`);
      if (res.data.status === "success") {
        toast("Removed from cart", { icon: "🗑️" });
        updateCartState(res.data.data, res.data.numOfCartItems);
      }
    } catch {}
  }, [token, updateCartState]);

  // ── CLEAR ─────────────────────────────────────────────
  const clearCart = useCallback(() => {
    setCart(null);
    setCount(0);
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartLoading, fetchCart, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
