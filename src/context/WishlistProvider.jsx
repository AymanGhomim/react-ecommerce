import { useEffect, useState } from "react";
import { WishlistContext }     from "./WishlistContext";
import toast from "react-hot-toast";

export default function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const s = localStorage.getItem("wishlist");
      return s ? JSON.parse(s) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const getId = (p) => p._id || p.id;

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => getId(i) === getId(product));
      if (exists) {
        toast("Removed from wishlist", { icon: "💔" });
        return prev.filter((i) => getId(i) !== getId(product));
      }
      toast.success("Added to wishlist! ❤️");
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => wishlist.some((i) => getId(i) === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}
