import { useContext } from "react";
import { Link }       from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useContext(WishlistContext);

  if (wishlist.length === 0) {
    return (
      <div className="empty-page">
        <div className="empty-icon">❤️</div>
        <h2>Your wishlist is empty</h2>
        <p>Save products you love to find them easily later</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2 className="page-title">My Wishlist ({wishlist.length})</h2>
      <div className="grid">
        {wishlist.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
