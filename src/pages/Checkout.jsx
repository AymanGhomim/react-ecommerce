import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "", payment: "card",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    toast.promise(
      new Promise((res) => setTimeout(res, 2000)),
      {
        loading: "Processing your order...",
        success: "Order placed successfully! 🎉",
        error: "Something went wrong",
      }
    ).then(() => {
      clearCart();
      navigate("/");
    });
  };

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page">
      <h2 className="page-title">Checkout</h2>

      <div className="checkout-layout">
        {/* Form */}
        <div className="checkout-form">
          <h3>Shipping Information</h3>

          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
            { key: "email", label: "Email", type: "email", placeholder: "john@example.com" },
            { key: "address", label: "Address", type: "text", placeholder: "123 Main St" },
            { key: "city", label: "City", type: "text", placeholder: "Cairo" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="form-group">
              <label>{label}</label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className={errors[key] ? "input-error" : ""}
              />
              {errors[key] && <span className="error-msg">{errors[key]}</span>}
            </div>
          ))}

          <h3>Payment Method</h3>
          <div className="payment-options">
            {[
              { value: "card", label: "💳 Credit Card" },
              { value: "paypal", label: "🅿️ PayPal" },
              { value: "cod", label: "💵 Cash on Delivery" },
            ].map((opt) => (
              <label key={opt.value} className={`payment-option ${form.payment === opt.value ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={form.payment === opt.value}
                  onChange={(e) => setForm({ ...form, payment: e.target.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="summary-item">
              <img src={item.image} alt={item.title} />
              <div>
                <p>{item.title.slice(0, 35)}…</p>
                <span>x{item.qty} — ${(item.price * item.qty).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          <button className="btn-primary place-order-btn" onClick={handleSubmit}>
            Place Order 🎉
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
