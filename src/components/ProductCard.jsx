import { useContext } from "react";
import { Link }       from "react-router-dom";
import { CartContext }     from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const { addToCart }                     = useContext(CartContext);
  const { toggleWishlist, isWishlisted }  = useContext(WishlistContext);
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="card">
      <button
        type="button"
        className={`wish-btn ${wishlisted ? "active" : ""}`}
        onClick={() => toggleWishlist(product)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>

      <Link to={`/product/${product._id}`}>
        <img src={product.imageCover} alt={product.title} loading="lazy" />
      </Link>

      {product.category?.name && (
        <span className="product-category">{product.category.name}</span>
      )}

      <h4>{product.title.split(" ").slice(0, 5).join(" ")}…</h4>

      <StarRating rating={product.ratingsAverage} count={product.ratingsQuantity} />

      <p className="price">{product.price} EGP</p>

      <div className="actions">
        <Link to={`/product/${product._id}`} className="details-link">Details</Link>
        <button type="button" onClick={() => addToCart(product._id)}>Add to Cart</button>
      </div>
    </div>
  );
}
