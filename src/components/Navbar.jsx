import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext }     from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ThemeContext }    from "../context/ThemeContext";
import { AuthContext }     from "../context/AuthContext";

export default function Navbar() {
  const { cartCount, fetchCart } = useContext(CartContext);
  const { wishlist }             = useContext(WishlistContext);
  const { theme, toggleTheme }   = useContext(ThemeContext);
  const { user, logout }         = useContext(AuthContext);
  const navigate                 = useNavigate();
  const location                 = useLocation();
  const [mobileOpen, setMobile]  = useState(false);

  useEffect(() => { fetchCart(); }, [fetchCart]);
  useEffect(() => { setMobile(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMobile(false);
    navigate("/auth");
  };

  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  const NAV_LINKS = [
    { to: "/",         label: "🏠 Home"     },
    { to: "/products", label: "📦 Products" },
    { to: "/brands",   label: "🏷️ Brands"   },
    { to: "/wishlist", label: `❤️ Wishlist (${wishlist.length})` },
    { to: "/cart",     label: `🛒 Cart (${cartCount})` },
  ];

  return (
    <nav className="nav">

      {/* Logo — always visible */}
      <Link to="/" className="logo">Store</Link>

      {/* ── Desktop links (hidden on mobile) ── */}
      <div className="nav-links">
        <Link to="/"         className={isActive("/")}>Home</Link>
        <Link to="/products" className={isActive("/products")}>Products</Link>
        <Link to="/brands"   className={isActive("/brands")}>Brands</Link>
      </div>

      {/* ── Desktop right side (hidden on mobile) ── */}
      <div className="nav-right nav-right-desktop">
        <button type="button" onClick={toggleTheme} className={`theme-btn ${theme}`}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <Link to="/wishlist" className="nav-icon-link" aria-label="Wishlist">
          ❤️
          {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </Link>

        <Link to="/cart" className="nav-icon-link" aria-label="Cart">
          🛒
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>

        <div className="user-info-desktop">
          <span className="user-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</span>
          <span className="user-name">{user?.name?.split(" ")[0]}</span>
        </div>

        <button type="button" className="desktop-logout" onClick={handleLogout}
          title="Sign Out">🚪</button>
      </div>

      {/* ── Mobile: hamburger only ── */}
      <button
        type="button"
        className={`hamburger ${mobileOpen ? "is-open" : ""}`}
        onClick={() => setMobile((p) => !p)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        <span className="ham-line" />
        <span className="ham-line" />
        <span className="ham-line" />
      </button>

      {/* ── Mobile drawer ── */}
      <div className={`mobile-drawer ${mobileOpen ? "drawer-open" : ""}`}>
        {/* User header */}
        <div className="drawer-user">
          <span className="drawer-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</span>
          <div>
            <p className="drawer-name">{user?.name}</p>
            <p className="drawer-email">{user?.email}</p>
          </div>
        </div>

        <div className="drawer-divider" />

        {/* Nav links */}
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`drawer-link ${location.pathname === to ? "drawer-link-active" : ""}`}
            onClick={() => setMobile(false)}
          >
            {label}
          </Link>
        ))}

        <div className="drawer-divider" />

        {/* Theme toggle */}
        <button
          type="button"
          className="drawer-link drawer-theme"
          onClick={() => { toggleTheme(); }}
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Sign out */}
        <button
          type="button"
          className="drawer-link drawer-logout"
          onClick={handleLogout}
        >
          🚪 Sign Out
        </button>
      </div>

      {/* Overlay behind drawer */}
      {mobileOpen && (
        <div className="drawer-overlay" onClick={() => setMobile(false)} />
      )}
    </nav>
  );
}
