import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CartContext }    from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import StarRating from "../components/StarRating";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct]             = useState(null);
  const [recommendations, setRecs]        = useState([]);
  const [selectedImg, setSelectedImg]     = useState(null);
  const { addToCart }                     = useContext(CartContext);
  const { toggleWishlist, isWishlisted }  = useContext(WishlistContext);

  useEffect(() => {
    setProduct(null);
    axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
      .then((res) => {
        setProduct(res.data.data);
        setSelectedImg(res.data.data.imageCover);
      });
    axios.get("https://ecommerce.routemisr.com/api/v1/products?limit=8")
      .then((res) => setRecs(res.data.data.filter((p) => p._id !== id)));
  }, [id]);

  if (!product) return (
    <div className="loading-center"><div className="spinner"></div></div>
  );

  const wishlisted = isWishlisted(product._id);

  return (
    <div>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="details">
        <div className="details-img-wrap">
          <img src={selectedImg} alt={product.title} />
          {/* Thumbnail strip */}
          {product.images?.length > 0 && (
            <div className="img-thumbs">
              {[product.imageCover, ...product.images].map((img, i) => (
                <img
                  key={i} src={img} alt=""
                  className={`thumb ${selectedImg === img ? "active-thumb" : ""}`}
                  onClick={() => setSelectedImg(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="details-info">
          <span className="category-badge">{product.category?.name}</span>
          <h2>{product.title}</h2>
          <StarRating rating={product.ratingsAverage} count={product.ratingsQuantity} />
          <p className="desc">{product.description}</p>
          <h3 className="details-price">{product.price} EGP</h3>
          {product.priceAfterDiscount && (
            <p className="old-price">{product.priceAfterDiscount} EGP after discount</p>
          )}

          <div className="details-actions">
            <button className="add-cart-btn" onClick={() => addToCart(product._id)}>
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

      {/* Recommendations */}
      <section className="recommendations">
        <h2>You May Also Like</h2>
        <div className="grid">
          {recommendations.map((rec) => (
            <div key={rec._id} className="card">
              <Link to={`/product/${rec._id}`}>
                <img src={rec.imageCover} alt={rec.title} />
              </Link>
              <span className="product-category">{rec.category?.name}</span>
              <h4>{rec.title.split(" ").slice(0, 4).join(" ")}…</h4>
              <StarRating rating={rec.ratingsAverage} />
              <p className="price">{rec.price} EGP</p>
              <div className="actions">
                <button onClick={() => addToCart(rec._id)}>Add to Cart</button>
                <Link to={`/product/${rec._id}`} className="details-link">Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
