import { useContext } from "react";
import { Link }       from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext }     from "../context/CartContext";
import StarRating from "../components/StarRating";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart }                = useContext(CartContext);

  if (wishlist.length === 0) {
    return (
      <div className="empty-page">
        <div className="empty-icon">❤️</div>
        <h2>Your wishlist is empty</h2>
        <p>Save products you love to find them easily later</p>
        <Link to="/" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2 className="page-title">My Wishlist ({wishlist.length})</h2>
      <div className="grid">
        {wishlist.map((product) => {
          const pid = product._id || product.id;
          const img = product.imageCover || product.image;
          return (
            <div key={pid} className="card">
              <button
                type="button"
                className="wish-btn active"
                onClick={() => toggleWishlist(product)}
                title="Remove from wishlist"
              >
                ❤️
              </button>

              <Link to={`/product/${pid}`}>
                <img src={img} alt={product.title} />
              </Link>

              {product.category?.name && (
                <span className="product-category">{product.category.name}</span>
              )}

              <h4>{product.title.split(" ").slice(0, 5).join(" ")}…</h4>

              <StarRating
                rating={product.ratingsAverage ?? product.rating?.rate}
                count={product.ratingsQuantity ?? product.rating?.count}
              />

              <p className="price">{product.price} EGP</p>

              <div className="actions">
                <button type="button" onClick={() => addToCart(pid)}>
                  Add to Cart
                </button>
                <Link to={`/product/${pid}`} className="details-link">Details</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
