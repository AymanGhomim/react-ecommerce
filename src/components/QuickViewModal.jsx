import { useContext, useEffect } from "react";
import { Link }                  from "react-router-dom";
import { CartContext }     from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import StarRating from "./StarRating";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart }                    = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);
  const wishlisted = isWishlisted(product._id);

  // Close on Escape
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="qv-overlay" onClick={onClose}>
      <div className="qv-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="qv-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="qv-content">
          <div className="qv-img">
            <img src={product.imageCover} alt={product.title} />
          </div>

          <div className="qv-info">
            <span className="category-badge">{product.category?.name}</span>
            <h2 className="qv-title">{product.title}</h2>
            <StarRating rating={product.ratingsAverage} count={product.ratingsQuantity} />

            <p className="qv-desc">
              {product.description?.slice(0, 160)}…
            </p>

            <div className="qv-price-row">
              <span className="qv-price">{product.price} EGP</span>
              {product.quantity > 0
                ? <span className="in-stock">✅ In Stock</span>
                : <span className="out-stock">❌ Out of Stock</span>
              }
            </div>

            <div className="qv-actions">
              <button
                type="button"
                className="add-cart-btn"
                onClick={() => { addToCart(product._id); onClose(); }}
                disabled={product.quantity === 0}
              >
                🛒 Add to Cart
              </button>
              <button
                type="button"
                className={`wish-btn-lg ${wishlisted ? "active" : ""}`}
                onClick={() => toggleWishlist(product)}
              >
                {wishlisted ? "❤️" : "🤍"}
              </button>
            </div>

            <Link to={`/product/${product._id}`} className="qv-full-link" onClick={onClose}>
              View Full Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
