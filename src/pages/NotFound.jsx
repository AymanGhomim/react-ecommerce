import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
  const navigate  = useNavigate();
  const [count, setCount] = useState(5);

  // Auto-redirect countdown
  useEffect(() => {
    if (count <= 0) { navigate("/"); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, navigate]);

  return (
    <div className="nf-page">
      {/* Background orbs */}
      <div className="nf-orb nf-orb1" />
      <div className="nf-orb nf-orb2" />

      <div className="nf-content">
        {/* Giant 404 */}
        <div className="nf-number">
          <span className="nf-4">4</span>
          <span className="nf-0">
            <span className="nf-0-inner">0</span>
          </span>
          <span className="nf-4">4</span>
        </div>

        <div className="nf-divider" />

        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-subtitle">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Countdown */}
        <p className="nf-countdown">
          Redirecting to Home in <span className="nf-count-num">{count}s</span>
        </p>

        {/* Actions */}
        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">🏠 Go Home</Link>
          <button type="button" className="nf-btn-secondary" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="nf-links">
          <span className="nf-links-label">Quick Links</span>
          <div className="nf-links-row">
            <Link to="/products" className="nf-quick-link">Products</Link>
            <Link to="/brands"   className="nf-quick-link">Brands</Link>
            <Link to="/cart"     className="nf-quick-link">Cart</Link>
            <Link to="/wishlist" className="nf-quick-link">Wishlist</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
