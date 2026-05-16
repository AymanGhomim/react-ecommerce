import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userMenu, setUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    navigate("/");
  };

  return (
    <nav className="nav">
      <h2>
        <Link to="/" className="logo">Store</Link>
      </h2>

      <div className="nav-links">
        <Link to="/brands" className="nav-link">Brands</Link>
      </div>

      <div className="nav-right">
        <button onClick={toggleTheme} className={`theme-btn ${theme}`}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <Link to="/wishlist" className="nav-icon-link">
          ❤️
          {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
        </Link>

        <Link to="/cart" className="nav-icon-link">
          🛒
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>

        {/* User menu */}
        <div className="user-menu-wrap" ref={menuRef}>
          <button className="user-btn" onClick={() => setUserMenu((p) => !p)}>
            <span className="user-avatar">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </span>
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
              <Link to="/wishlist" className="dropdown-item" onClick={() => setUserMenu(false)}>
                ❤️ My Wishlist
              </Link>
              <Link to="/cart" className="dropdown-item" onClick={() => setUserMenu(false)}>
                🛒 My Cart
              </Link>
              <div className="dropdown-divider" />
              <button className="dropdown-item logout" onClick={handleLogout}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
