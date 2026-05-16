import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, fetchCart, updateQty, removeFromCart, clearCart, cartCount } = useContext(CartContext);

  useEffect(() => { fetchCart(); }, []);

  const products = cart?.products || [];
  const total    = cart?.totalCartPrice || 0;

  if (!cart || products.length === 0) {
    return (
      <div className="empty-page">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <Link to="/" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Your Cart ({cartCount} items)</h2>
        <button className="clear-btn" onClick={clearCart}>Clear All</button>
      </div>

      {products.map((item) => (
        <div key={item.product._id} className="cart-item">
          <img src={item.product.imageCover} alt={item.product.title} className="cart-item-img" />

          <div className="cart-item-info">
            <h4>{item.product.title.split(" ").slice(0, 6).join(" ")}…</h4>
            <p className="cart-item-price">{(item.price * item.count).toFixed(0)} EGP</p>
          </div>

          <div className="qty-controls">
            <button onClick={() => updateQty(item.product._id, item.count - 1)}>−</button>
            <span>{item.count}</span>
            <button onClick={() => updateQty(item.product._id, item.count + 1)}>+</button>
          </div>

          <button className="remove-btn" onClick={() => removeFromCart(item.product._id)}>
            🗑️
          </button>
        </div>
      ))}

      <div className="cart-footer">
        <h3>Total: <span className="total-amount">{total} EGP</span></h3>
        <Link to="/checkout" className="btn-primary checkout-btn">
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
