import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { CartContext }     from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ThemeContext }    from "../context/ThemeContext";
import { AuthContext }     from "../context/AuthContext";

export default function Navbar() {
  const { cartCount, fetchCart }   = useContext(CartContext);
  const { wishlist }               = useContext(WishlistContext);
  const { theme, toggleTheme }     = useContext(ThemeContext);
  const { user, logout }           = useContext(AuthContext);
  const navigate                   = useNavigate();
  const location                   = useLocation();
  const [userMenu, setUserMenu]    = useState(false);
  const [mobileOpen, setMobile]    = useState(false);
  const menuRef                    = useRef(null);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobile(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate("/auth");
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  const NAV_LINKS = [
    { to: "/",         label: "Home"     },
    { to: "/products", label: "Products" },
    { to: "/brands",   label: "Brands"   },
  ];

  return (
    <nav className="nav">
      {/* Logo */}
      <Link to="/" className="logo">Store</Link>

      {/* Desktop links */}
      <div className="nav-links">
        {NAV_LINKS.map(({ to, label }) => (
          <Link key={to} to={to} className={isActive(to)}>{label}</Link>
        ))}
      </div>

      {/* Right side */}
      <div className="nav-right">
        <button type="button" onClick={toggleTheme} className={`theme-btn ${theme}`}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <Link to="/wishlist" className="nav-icon-link" aria-label="Wishlist">
          ❤️
          {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </Link>

        <Link to="/cart" className="nav-icon-link" aria-label="Cart">
          🛒
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>

        {/* User dropdown */}
        <div className="user-menu-wrap" ref={menuRef}>
          <button type="button" className="user-btn" onClick={() => setUserMenu((p) => !p)}>
            <span className="user-avatar">{user?.name?.[0]?.toUpperCase() || "?"}</span>
            <span className="user-name">{user?.name?.split(" ")[0]}</span>
            <span className={`chevron ${userMenu ? "open" : ""}`}>▾</span>
          </button>

          {userMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-name">{user?.name}</span>
                <span className="dropdown-email">{user?.email}</span>
              </div>
              <div className="dropdown-divider" />
              <Link to="/wishlist" className="dropdown-item" onClick={() => setUserMenu(false)}>❤️ My Wishlist</Link>
              <Link to="/cart"     className="dropdown-item" onClick={() => setUserMenu(false)}>🛒 My Cart</Link>
              <div className="dropdown-divider" />
              <button type="button" className="dropdown-item logout" onClick={handleLogout}>🚪 Sign Out</button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="hamburger"
          onClick={() => setMobile((p) => !p)}
          aria-label="Toggle menu"
        >
          <span className={`ham-line ${mobileOpen ? "open" : ""}`} />
          <span className={`ham-line ${mobileOpen ? "open" : ""}`} />
          <span className={`ham-line ${mobileOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className="mobile-link">{label}</Link>
          ))}
          <Link to="/wishlist" className="mobile-link">❤️ Wishlist ({wishlist.length})</Link>
          <Link to="/cart"     className="mobile-link">🛒 Cart ({cartCount})</Link>
          <div className="mobile-divider" />
          <button type="button" className="mobile-link logout-mobile" onClick={handleLogout}>
            🚪 Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
