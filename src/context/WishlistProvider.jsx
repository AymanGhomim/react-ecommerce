import { useEffect, useState } from "react";
import { WishlistContext } from "./WishlistContext";
import toast from "react-hot-toast";

// Wishlist stays local (API doesn't have wishlist endpoint)
export default function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const s = localStorage.getItem("wishlist");
    return s ? JSON.parse(s) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i._id === product._id || i.id === product.id);
      if (exists) {
        toast("Removed from wishlist", { icon: "💔" });
        return prev.filter((i) => (i._id || i.id) !== (product._id || product.id));
      }
      toast.success("Added to wishlist! ❤️");
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => wishlist.some((i) => (i._id || i.id) === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}
