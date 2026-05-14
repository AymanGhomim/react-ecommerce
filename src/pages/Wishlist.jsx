import { useContext } from "react";
import { Link } from "react-router-dom";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import StarRating from "../components/StarRating";

function Wishlist() {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

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
        {wishlist.map((product) => (
          <div key={product.id} className="card">
            <button
              className="wish-btn active"
              onClick={() => toggleWishlist(product)}
              title="Remove from wishlist"
            >❤️</button>

            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.title} />
            </Link>

            <h4>{product.title.slice(0, 45)}…</h4>
            {product.rating && <StarRating rating={product.rating.rate} count={product.rating.count} />}
            <p className="price">${product.price}</p>

            <div className="actions">
              <button onClick={() => addToCart(product)}>Add to Cart</button>
              <Link to={`/product/${product.id}`} className="details-link">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wishlist;
