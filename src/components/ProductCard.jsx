import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import StarRating from "./StarRating";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="card">
      <button
        className={`wish-btn ${wishlisted ? "active" : ""}`}
        onClick={() => toggleWishlist(product)}
        title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>

      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.title} />
      </Link>

      <h4>{product.title.slice(0, 45)}…</h4>

      {product.rating && (
        <StarRating rating={product.rating.rate} count={product.rating.count} />
      )}

      <p className="price">${product.price}</p>

      <div className="actions">
        <Link to={`/product/${product.id}`} className="details-link">Details</Link>
        <button onClick={() => addToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductCard;
