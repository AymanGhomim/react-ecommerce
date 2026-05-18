import { useContext, useEffect } from "react";
import { Link }                  from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const {
    cart, cartLoading, fetchCart,
    updateQty, removeFromCart, clearCart, cartCount,
  } = useContext(CartContext);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const products = cart?.products || [];
  const total    = cart?.totalCartPrice || 0;

  if (cartLoading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  if (products.length === 0) {
    return (
      <div className="empty-page">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-header">
        <h2>Cart <span className="cart-count-badge">({cartCount})</span></h2>
        <button type="button" className="clear-btn" onClick={clearCart}>
          🗑️ Clear All
        </button>
      </div>

      <div className="cart-items">
        {products.map((item) => (
          <div key={item.product._id} className="cart-item">
            <Link to={`/product/${item.product._id}`} className="cart-item-img-link">
              <img src={item.product.imageCover} alt={item.product.title} className="cart-item-img" />
            </Link>

            <div className="cart-item-info">
              <h4>{item.product.title.split(" ").slice(0, 5).join(" ")}…</h4>
              <p className="cart-item-unit">{item.price} EGP × {item.count}</p>
              <p className="cart-item-price">{(item.price * item.count).toFixed(0)} EGP</p>
            </div>

            <div className="cart-item-actions">
              <div className="qty-controls">
                <button type="button" onClick={() => updateQty(item.product._id, item.count - 1)}>−</button>
                <span>{item.count}</span>
                <button type="button" onClick={() => updateQty(item.product._id, item.count + 1)}>+</button>
              </div>
              <button type="button" className="remove-btn" onClick={() => removeFromCart(item.product._id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-footer-total">
          <span>Total</span>
          <strong className="total-amount">{total} EGP</strong>
        </div>
        <Link to="/checkout" className="btn-primary checkout-btn">
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}
