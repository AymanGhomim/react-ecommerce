import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="nav">
      <h2>
        <Link to="/" className="logo">Store</Link>
      </h2>

      <div className="nav-right">
        <button onClick={toggleTheme} className={`theme-btn ${theme}`}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <Link to="/wishlist" className="nav-icon-link">
          ❤️
          {wishlist.length > 0 && (
            <span className="badge">{wishlist.length}</span>
          )}
        </Link>

        <Link to="/cart" className="nav-icon-link">
          🛒
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
