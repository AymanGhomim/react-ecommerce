import { useState, useContext, useCallback, useRef } from "react";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function CartProvider({ children }) {
  const { token }                   = useContext(AuthContext);
  const [cart, setCart]             = useState(null);
  const [cartCount, setCount]       = useState(0);
  const [cartLoading, setCartLoad]  = useState(false);
  const fetchedRef                  = useRef(false); // prevent double-fetch in StrictMode

  const updateCartState = (data, numOfCartItems) => {
    setCart(data);
    setCount(numOfCartItems || data?.products?.length || 0);
  };

  // ── GET ───────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!token) return;
    if (fetchedRef.current) return; // already fetched
    fetchedRef.current = true;
    setCartLoad(true);
    try {
      const res = await api.get("/cart");
      if (res.data.status === "success") {
        updateCartState(res.data.data, res.data.numOfCartItems);
      }
    } catch {
      // cart might be empty — not an error
    } finally {
      setCartLoad(false);
    }
  }, [token]);

  // Call this to force a fresh fetch (e.g. after login)
  const refetchCart = useCallback(async () => {
    if (!token) return;
    fetchedRef.current = false;
    await fetchCart();
  }, [token, fetchCart]);

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
  }, [token]);

  // ── UPDATE QTY ────────────────────────────────────────
  const updateQty = useCallback(async (productId, count) => {
    if (!token) return;
    // If count reaches 0, delete the item
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
  }, [token]);

  // ── DELETE ────────────────────────────────────────────
  const removeFromCart = useCallback(async (productId) => {
    if (!token) return;
    try {
      const res = await api.delete(`/cart/${productId}`);
      if (res.data.status === "success") {
        toast("Removed from cart", { icon: "🗑️" });
        updateCartState(res.data.data, res.data.numOfCartItems);
      }
    } catch {}
  }, [token]);

  // ── CLEAR (local only — API doesn't support bulk delete) ──
  const clearCart = useCallback(() => {
    setCart(null);
    setCount(0);
    fetchedRef.current = false;
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, cartLoading, fetchCart, refetchCart, addToCart, updateQty, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
