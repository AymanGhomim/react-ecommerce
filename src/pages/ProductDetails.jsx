import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import StarRating from "../components/StarRating";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);

  useEffect(() => {
    setProduct(null);
    axios.get(`https://fakestoreapi.com/products/${id}`).then((res) => setProduct(res.data));
    axios.get("https://fakestoreapi.com/products?limit=8").then((res) => {
      setRecommendations(res.data.filter((p) => p.id !== Number(id)));
    });
  }, [id]);

  if (!product) return (
    <div className="loading-center">
      <div className="spinner"></div>
    </div>
  );

  const wishlisted = isWishlisted(product.id);

  return (
    <div>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="details">
        <div className="details-img-wrap">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="details-info">
          <span className="category-badge">{product.category}</span>
          <h2>{product.title}</h2>

          {product.rating && (
            <StarRating rating={product.rating.rate} count={product.rating.count} />
          )}

          <p className="desc">{product.description}</p>
          <h3 className="details-price">${product.price}</h3>

          <div className="details-actions">
            <button className="add-cart-btn" onClick={() => addToCart(product)}>
              🛒 Add to Cart
            </button>
            <button
              className={`wish-btn-lg ${wishlisted ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
            >
              {wishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div>
        </div>
      </div>

      <section className="recommendations">
        <h2>You May Also Like</h2>
        <div className="grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className="card">
              <Link to={`/product/${rec.id}`}>
                <img src={rec.image} alt={rec.title} />
              </Link>
              <h4>{rec.title.slice(0, 45)}…</h4>
              {rec.rating && <StarRating rating={rec.rating.rate} />}
              <p className="price">${rec.price}</p>
              <div className="actions">
                <button onClick={() => addToCart(rec)}>Add to Cart</button>
                <Link to={`/product/${rec.id}`} className="details-link">Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
