import { useEffect, useState } from "react";
import { WishlistContext } from "./WishlistContext";
import toast from "react-hot-toast";

function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        toast("Removed from wishlist", { icon: "💔" });
        return prev.filter((i) => i.id !== product.id);
      }
      toast.success("Added to wishlist! ❤️");
      return [...prev, product];
    });
  };

  const isWishlisted = (id) => wishlist.some((i) => i.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
