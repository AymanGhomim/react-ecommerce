import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";

function Navbar() {
  const { cart } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="nav">
      <h2>
        <Link to="/" className="logo">
          Store
        </Link>
      </h2>

      <div className="nav-right">
        <button onClick={toggleTheme} className={`theme-btn ${theme}`}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>

        <Link to="/cart" className="cart-link">
          Cart ({cart.length})
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
