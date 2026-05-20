import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
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
  const [searchQ, setSearchQ]    = useState("");
  const searchRef                = useRef(null);

  useEffect(() => { fetchCart(); }, [fetchCart]);
  useEffect(() => { setMobile(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const close = () => setMobile(false);
  const handleLogout = () => { logout(); close(); navigate("/auth"); };
  const handleTheme  = () => { toggleTheme(); close(); };
  const isActive     = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQ.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQ.trim())}`);
    setSearchQ("");
    close();
  };

  return (
    <nav className="nav">
      {/* Logo */}
      <Link to="/" className="logo" onClick={close}>Store</Link>

      {/* Desktop links */}
      <div className="nav-links">
        <Link to="/"         className={isActive("/")}>Home</Link>
        <Link to="/products" className={isActive("/products")}>Products</Link>
        <Link to="/brands"   className={isActive("/brands")}>Brands</Link>
      </div>

      {/* Desktop search */}
      <form className="nav-search-form" onSubmit={handleSearch}>
        <div className="nav-search-wrap">
          <span className="nav-search-icon">🔍</span>
          <input
            ref={searchRef}
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search products…"
            className="nav-search-input"
          />
        </div>
      </form>

      {/* Desktop right */}
      <div className="nav-right nav-right-desktop">
        <button type="button" onClick={toggleTheme} className={`theme-btn ${theme}`}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <Link to="/wishlist" className="nav-icon-link" aria-label="Wishlist">
          ❤️ {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </Link>
        <Link to="/cart" className="nav-icon-link" aria-label="Cart">
          🛒 {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
        <div className="user-info-desktop" style={{cursor:"pointer"}} onClick={()=>navigate("/profile")}>
          <span className="user-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</span>
          <span className="user-name">{user?.name?.split(" ")[0]}</span>
        </div>
        <button type="button" className="desktop-logout" onClick={handleLogout} title="Sign Out">🚪</button>
      </div>

      {/* Hamburger */}
      <button
        type="button"
        className={`hamburger ${mobileOpen ? "is-open" : ""}`}
        onClick={() => setMobile((p) => !p)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        <span className="ham-line" /><span className="ham-line" /><span className="ham-line" />
      </button>

      {/* Overlay */}
      {mobileOpen && <div className="drawer-overlay" onClick={close} aria-hidden="true" />}

      {/* Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? "drawer-open" : ""}`} aria-hidden={!mobileOpen}>
        {/* User */}
        <div className="drawer-user">
          <span className="drawer-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</span>
          <div className="drawer-user-info">
            <p className="drawer-name">{user?.name}</p>
            <p className="drawer-email">{user?.email}</p>
          </div>
        </div>

        {/* Mobile search */}
        <form className="drawer-search-form" onSubmit={handleSearch}>
          <div className="drawer-search-wrap">
            <span>🔍</span>
            <input
              type="text"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
              placeholder="Search products…"
            />
          </div>
        </form>

        <div className="drawer-divider" />

        <Link to="/"         className={`drawer-link ${location.pathname === "/"         ? "drawer-link-active" : ""}`} onClick={close}>🏠 Home</Link>
        <Link to="/products" className={`drawer-link ${location.pathname === "/products" ? "drawer-link-active" : ""}`} onClick={close}>📦 Products</Link>
        <Link to="/brands"   className={`drawer-link ${location.pathname === "/brands"   ? "drawer-link-active" : ""}`} onClick={close}>🏷️ Brands</Link>

        <div className="drawer-divider" />

        <Link to="/wishlist" className={`drawer-link ${location.pathname === "/wishlist" ? "drawer-link-active" : ""}`} onClick={close}>
          ❤️ Wishlist {wishlist.length > 0 && <span className="drawer-badge">{wishlist.length}</span>}
        </Link>
        <Link to="/cart" className={`drawer-link ${location.pathname === "/cart" ? "drawer-link-active" : ""}`} onClick={close}>
          🛒 Cart {cartCount > 0 && <span className="drawer-badge">{cartCount}</span>}
        </Link>
        <Link to="/orders"   className={`drawer-link ${location.pathname === "/orders"   ? "drawer-link-active" : ""}`} onClick={close}>📋 My Orders</Link>
        <Link to="/profile" className={`drawer-link ${location.pathname === "/profile"  ? "drawer-link-active" : ""}`} onClick={close}>👤 Profile</Link>

        <div className="drawer-divider" />

        <button type="button" className="drawer-link drawer-theme" onClick={handleTheme}>
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button type="button" className="drawer-link drawer-logout" onClick={handleLogout}>
          🚪 Sign Out
        </button>
      </div>
    </nav>
  );
}
