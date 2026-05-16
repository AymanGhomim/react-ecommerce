import { useState, useContext, useCallback } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

const BASE = "https://ecommerce.routemisr.com/api/v1/cart";

export default function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [cart, setCart]       = useState(null); // full API cart object
  const [cartCount, setCount] = useState(0);

  const headers = () => ({ token });

  // ── GET ────────────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(BASE, { headers: headers() });
      if (res.data.status === "success") {
        setCart(res.data.data);
        setCount(res.data.numOfCartItems || 0);
      }
    } catch {}
  }, [token]);

  // ── ADD ───────────────────────────────────────────────
  const addToCart = async (productId) => {
    try {
      const res = await axios.post(BASE, { productId }, { headers: headers() });
      if (res.data.status === "success") {
        toast.success("Added to cart! 🛒");
        setCart(res.data.data);
        setCount(res.data.numOfCartItems || 0);
      }
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  // ── UPDATE QTY ────────────────────────────────────────
  const updateQty = async (productId, count) => {
    if (count < 1) return removeFromCart(productId);
    try {
      const res = await axios.put(`${BASE}/${productId}`, { count }, { headers: headers() });
      if (res.data.status === "success") {
        setCart(res.data.data);
        setCount(res.data.numOfCartItems || 0);
      }
    } catch {}
  };

  // ── DELETE ────────────────────────────────────────────
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(`${BASE}/${productId}`, { headers: headers() });
      if (res.data.status === "success") {
        toast("Removed from cart", { icon: "🗑️" });
        setCart(res.data.data);
        setCount(res.data.numOfCartItems || 0);
      }
    } catch {}
  };

  // ── CLEAR ─────────────────────────────────────────────
  const clearCart = async () => {
    try {
      await axios.delete(BASE, { headers: headers() });
      setCart(null);
      setCount(0);
      toast("Cart cleared", { icon: "🧹" });
    } catch {}
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
