import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate }          from "react-router-dom";
import api from "../api/axios";
import { CartContext }            from "../context/CartContext";
import { WishlistContext }        from "../context/WishlistContext";
import { RecentlyViewedContext }  from "../context/RecentlyViewedContext";
import StarRating  from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import Skeleton    from "../components/Skeleton";
import toast       from "react-hot-toast";

export default function ProductDetails() {
  const { id }                             = useParams();
  const navigate                           = useNavigate();
  const [product, setProduct]             = useState(null);
  const [related, setRelated]             = useState([]);
  const [selectedImg, setSelectedImg]     = useState(null);
  const [zoomed, setZoomed]               = useState(false);
  const [zoomPos, setZoomPos]             = useState({ x: 50, y: 50 });
  const [error, setError]                 = useState(false);
  const [activeTab, setActiveTab]         = useState("desc");
  const { addToCart }                     = useContext(CartContext);
  const { toggleWishlist, isWishlisted }  = useContext(WishlistContext);
  const { addViewed }                     = useContext(RecentlyViewedContext);

  useEffect(() => {
    let cancelled = false;
    setProduct(null);
    setRelated([]);
    setSelectedImg(null);
    setError(false);

    api.get(`/products/${id}`)
      .then((res) => {
        if (cancelled) return;
        const p = res.data.data;
        setProduct(p);
        setSelectedImg(p.imageCover);
        addViewed(p);
        // Fetch related by same category
        api.get(`/products?category=${p.category?._id}&limit=9`)
          .then((r) => {
            if (!cancelled) setRelated((r.data.data || []).filter((x) => x._id !== id));
          })
          .catch(() => {});
      })
      .catch(() => { if (!cancelled) setError(true); });

    return () => { cancelled = true; };
  }, [id]);

  // Image zoom mouse move
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard! 🔗");
    }
  };

  if (error) {
    return (
      <div className="empty-page">
        <div className="empty-icon">⚠️</div>
        <h2>Product not found</h2>
        <button type="button" className="btn-primary" onClick={() => navigate("/products")}>
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="details-skeleton-wrap">
        <div className="details-skeleton-img"><Skeleton /></div>
        <div className="details-skeleton-info">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="skeleton-line" style={{ width: `${90 - i * 15}%` }} />
          ))}
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const allImages  = [product.imageCover, ...(product.images || [])];

  return (
    <div className="details-page">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="details">
        {/* ── Image section ── */}
        <div className="details-img-col">
          {/* Main image with zoom */}
          <div
            className={`details-img-wrap ${zoomed ? "zoomed" : ""}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
          >
            <img
              src={selectedImg}
              alt={product.title}
              style={zoomed ? {
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: "scale(2.2)",
              } : {}}
            />
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="img-thumbs">
              {allImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`view-${i}`}
                  className={`thumb ${selectedImg === img ? "active-thumb" : ""}`}
                  onClick={() => setSelectedImg(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info section ── */}
        <div className="details-info">
          <div className="details-top-row">
            <span className="category-badge">{product.category?.name}</span>
            <div className="details-top-actions">
              <button type="button" className="share-btn" onClick={handleShare} title="Share product">
                🔗 Share
              </button>
            </div>
          </div>

          <h2>{product.title}</h2>

          <StarRating rating={product.ratingsAverage} count={product.ratingsQuantity} />

          {/* Price */}
          <div className="details-price-row">
            <h3 className="details-price">{product.price} EGP</h3>
            {product.priceAfterDiscount > 0 && (
              <span className="details-discount-badge">
                -{Math.round((1 - product.priceAfterDiscount / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Stock */}
          {product.quantity != null && (
            <p className={`stock-badge ${product.quantity > 0 ? "in-stock" : "out-stock"}`}>
              {product.quantity > 0 ? `✅ In Stock (${product.quantity} left)` : "❌ Out of Stock"}
            </p>
          )}

          {/* Actions */}
          <div className="details-actions">
            <button
              type="button"
              className="add-cart-btn"
              onClick={() => addToCart(product._id)}
              disabled={product.quantity === 0}
            >
              🛒 Add to Cart
            </button>
            <button
              type="button"
              className={`wish-btn-lg ${wishlisted ? "active" : ""}`}
              onClick={() => toggleWishlist(product)}
            >
              {wishlisted ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div>

          {/* Tabs: Description / Details */}
          <div className="details-tabs">
            <button
              type="button"
              className={`details-tab ${activeTab === "desc" ? "active" : ""}`}
              onClick={() => setActiveTab("desc")}
            >
              Description
            </button>
            <button
              type="button"
              className={`details-tab ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Product Info
            </button>
          </div>

          <div className="details-tab-content">
            {activeTab === "desc" && (
              <p className="desc">{product.description}</p>
            )}
            {activeTab === "info" && (
              <div className="product-info-grid">
                {product.brand?.name && (
                  <div className="info-row"><span>Brand</span><strong>{product.brand.name}</strong></div>
                )}
                {product.category?.name && (
                  <div className="info-row"><span>Category</span><strong>{product.category.name}</strong></div>
                )}
                {product.quantity != null && (
                  <div className="info-row"><span>In Stock</span><strong>{product.quantity} units</strong></div>
                )}
                {product.sold != null && (
                  <div className="info-row"><span>Units Sold</span><strong>{product.sold}</strong></div>
                )}
                <div className="info-row"><span>Rating</span><strong>{product.ratingsAverage} / 5 ({product.ratingsQuantity} reviews)</strong></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="recommendations">
          <div className="section-header">
            <h2>Related Products</h2>
            <span className="section-sub">From {product.category?.name}</span>
          </div>
          <div className="grid">
            {related.slice(0, 8).map((rec) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
