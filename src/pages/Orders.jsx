import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Orders are stored in localStorage after each successful checkout
export function saveOrder(cart, total, paymentMethod) {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const order = {
    id: "#" + Math.random().toString(36).slice(2, 8).toUpperCase(),
    date: new Date().toISOString(),
    items: cart,
    total,
    paymentMethod,
    status: "confirmed",
  };
  orders.unshift(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

export default function Orders() {
  const { user } = useContext(AuthContext);
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");

  if (orders.length === 0) {
    return (
      <div className="empty-page">
        <div className="empty-icon">📦</div>
        <h2>No orders yet</h2>
        <p>Place your first order and it will appear here</p>
        <Link to="/products" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Welcome back, <strong>{user?.name?.split(" ")[0]}</strong> — here's your order history</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <div className="order-meta">
                <span className="order-id">{order.id}</span>
                <span className="order-date">
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </div>
              <div className="order-right">
                <span className="order-status confirmed">✅ Confirmed</span>
                <span className="order-total">{order.total} EGP</span>
              </div>
            </div>

            <div className="order-items">
              {(order.items || []).map((item, i) => (
                <div key={i} className="order-item">
                  <img
                    src={item.product?.imageCover || item.imageCover}
                    alt={item.product?.title || item.title}
                    className="order-item-img"
                  />
                  <div className="order-item-info">
                    <p>{(item.product?.title || item.title || "").split(" ").slice(0, 5).join(" ")}…</p>
                    <span>Qty: {item.count || item.qty || 1} · {item.price} EGP</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span className="order-payment">
                {order.paymentMethod === "visa" ? "💳 Paid by Card" : "💵 Cash on Delivery"}
              </span>
              <span className="order-items-count">{order.items?.length || 0} item(s)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
