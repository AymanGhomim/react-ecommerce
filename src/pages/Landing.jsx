import { Link } from "react-router-dom";
import { useContext as useCtx } from "react";
import { RecentlyViewedContext } from "../context/RecentlyViewedContext";
import ProductCard from "../components/ProductCard";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

// ── Animated counter ──────────────────────────────────────
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [to]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

const FEATURES = [
  { icon: "🚀", title: "Fast Delivery",      desc: "Get your orders delivered in 24–48 hours to your doorstep."        },
  { icon: "🔒", title: "Secure Payments",    desc: "256-bit SSL encryption keeps every transaction safe."               },
  { icon: "↩️",  title: "Easy Returns",       desc: "Not happy? Return within 30 days — no questions asked."            },
  { icon: "🎧", title: "24/7 Support",       desc: "Our team is always here to help you around the clock."              },
  { icon: "✅", title: "Quality Guaranteed", desc: "Every product is verified and quality-checked before shipping."     },
  { icon: "🏷️", title: "Best Prices",        desc: "We guarantee the lowest prices or we'll match any competitor."      },
];

const CATEGORIES = [
  { name: "Electronics",        emoji: "💻", color: "#3b82f6", path: "/products" },
  { name: "Men's Fashion",      emoji: "👔", color: "#8b5cf6", path: "/products" },
  { name: "Women's Fashion",    emoji: "👗", color: "#ec4899", path: "/products" },
  { name: "Sports & Outdoors",  emoji: "⚽", color: "#10b981", path: "/products" },
  { name: "Beauty",             emoji: "💄", color: "#f59e0b", path: "/products" },
  { name: "Jewelery",           emoji: "💎", color: "#06b6d4", path: "/products" },
];

export default function Landing() {
  const { user } = useContext(AuthContext);
  const { viewed } = useCtx(RecentlyViewedContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8")
      .then((res) => setFeaturedProducts(res.data.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="landing">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-orb orb3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">🛍️ Welcome back, {user?.name?.split(" ")[0]}!</div>
          <h1 className="hero-title">
            Discover <span className="hero-highlight">Amazing</span><br />
            Products & Deals
          </h1>
          <p className="hero-sub">
            Shop thousands of premium products from the world's best brands —
            delivered fast, priced right.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="hero-btn-primary">
              Shop Now →
            </Link>
            <Link to="/brands" className="hero-btn-secondary">
              Browse Brands
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat">
              <strong><Counter to={50000} suffix="+" /></strong>
              <span>Happy Customers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong><Counter to={10000} suffix="+" /></strong>
              <span>Products</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong><Counter to={200} suffix="+" /></strong>
              <span>Brands</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <strong><Counter to={99} suffix="%" /></strong>
              <span>Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <Link to={cat.path} key={cat.name} className="cat-card"
              style={{ "--cat-color": cat.color }}>
              <div className="cat-icon">{cat.emoji}</div>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="section-link">View All →</Link>
          </div>
          <div className="featured-grid">
            {featuredProducts.map((p) => (
              <Link to={`/product/${p._id}`} key={p._id} className="featured-card">
                <div className="featured-img">
                  <img src={p.imageCover} alt={p.title} loading="lazy" />
                </div>
                <div className="featured-info">
                  <span className="featured-category">{p.category?.name}</span>
                  <h4>{p.title.split(" ").slice(0, 4).join(" ")}…</h4>
                  <p className="featured-price">{p.price} EGP</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="section features-section">
        <div className="section-header">
          <h2>Why Shop With Us?</h2>
          <p>Everything you need for a great shopping experience</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RECENTLY VIEWED ─────────────────────────────── */}
      {viewed.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Recently Viewed</h2>
            <p>Pick up where you left off</p>
          </div>
          <div className="grid">
            {viewed.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-orb" />
        <h2>Ready to start shopping?</h2>
        <p>Explore thousands of products and find your perfect match today.</p>
        <Link to="/products" className="hero-btn-primary">
          Explore Products →
        </Link>
      </section>

    </div>
  );
}
