import { useContext, useState } from "react";
import { Link }                 from "react-router-dom";
import { CartContext }          from "../context/CartContext";
import { WishlistContext }      from "../context/WishlistContext";
import StarRating               from "./StarRating";
import QuickViewModal           from "./QuickViewModal";

export default function ProductCard({ product }) {
  const { addToCart }                    = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const wishlisted = isWishlisted(product._id);
  const [showQV, setShowQV] = useState(false);

  return (
    <>
      <div className="card">
        {/* Wishlist */}
        <button
          type="button"
          className={`wish-btn ${wishlisted ? "active" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>

        {/* Image with Quick View overlay */}
        <div className="card-img-wrap">
          <Link to={`/product/${product._id}`} className="card-img-link">
            <img src={product.imageCover} alt={product.title} loading="lazy" />
          </Link>
          <button
            type="button"
            className="quick-view-btn"
            onClick={() => setShowQV(true)}
          >
            Quick View
          </button>
        </div>

        {/* Content */}
        <div className="card-content">
          {product.category?.name && (
            <span className="product-category">{product.category.name}</span>
          )}
          <h4>{product.title.split(" ").slice(0, 5).join(" ")}…</h4>
          <StarRating rating={product.ratingsAverage} count={product.ratingsQuantity} />
          <p className="price">{product.price} EGP</p>

          <div className="actions">
            <button type="button" onClick={() => addToCart(product._id)}>
              🛒 Add to Cart
            </button>
            <Link to={`/product/${product._id}`} className="details-link">
              Details
            </Link>
          </div>
        </div>
      </div>

      {showQV && <QuickViewModal product={product} onClose={() => setShowQV(false)} />}
    </>
  );
}
