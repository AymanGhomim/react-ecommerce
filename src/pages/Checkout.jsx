import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";

function luhn(num) {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return sum % 10 === 0;
}

function formatCard(val) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(val) {
  const clean = val.replace(/\D/g, "").slice(0, 4);
  if (clean.length >= 3) return clean.slice(0, 2) + "/" + clean.slice(2);
  return clean;
}

function getCardType(num) {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return { type: "Visa", icon: "💳 VISA" };
  if (/^5[1-5]/.test(n)) return { type: "Mastercard", icon: "💳 MC" };
  if (/^3[47]/.test(n)) return { type: "Amex", icon: "💳 AMEX" };
  return { type: "", icon: "💳" };
}

// ── Success Modal ──────────────────────────────────────────
function SuccessModal({ total, cardLast4, onClose }) {
  const orderNum = "#" + Math.random().toString(36).slice(2, 8).toUpperCase();
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Animated checkmark */}
        <div className="success-circle">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path className="checkmark-tick" fill="none" d="M14 27l8 8 16-16"/>
          </svg>
        </div>

        <h2 className="modal-title">Payment Successful!</h2>
        <p className="modal-subtitle">Your order has been placed and is being processed.</p>

        <div className="modal-details">
          <div className="modal-row">
            <span>Order Number</span>
            <strong>{orderNum}</strong>
          </div>
          <div className="modal-row">
            <span>Amount Paid</span>
            <strong className="modal-amount">${total.toFixed(2)}</strong>
          </div>
          {cardLast4 && (
            <div className="modal-row">
              <span>Card</span>
              <strong>•••• {cardLast4}</strong>
            </div>
          )}
          <div className="modal-row">
            <span>Status</span>
            <span className="modal-status">✅ Confirmed</span>
          </div>
        </div>

        <p className="modal-email-note">
          📧 A confirmation receipt has been sent to your email.
        </p>

        <button className="modal-btn" onClick={onClose}>
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}

// ── Main Checkout ──────────────────────────────────────────
function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const [form, setForm] = useState({
    name: "", email: "", address: "", city: "",
    payment: "visa",
    cardNumber: "", cardName: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState({});
  const [flip, setFlip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const set = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const cardInfo = getCardType(form.cardNumber);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (form.payment === "visa") {
      const raw = form.cardNumber.replace(/\s/g, "");
      if (raw.length < 16 || !luhn(raw)) e.cardNumber = "Invalid card number";
      if (!form.cardName.trim()) e.cardName = "Cardholder name required";
      const [mm, yy] = (form.expiry || "").split("/");
      const exp = new Date(`20${yy}`, mm - 1);
      if (!mm || !yy || exp < new Date()) e.expiry = "Invalid or expired date";
      if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "Invalid CVV";
    }
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800)); // simulate processing
    setLoading(false);
    setShowSuccess(true);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    clearCart();
    navigate("/");
  };

  if (cart.length === 0 && !showSuccess) { navigate("/cart"); return null; }

  const cardLast4 = form.cardNumber.replace(/\s/g, "").slice(-4);

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          total={total}
          cardLast4={form.payment === "visa" ? cardLast4 : null}
          onClose={handleCloseModal}
        />
      )}

      <div className="checkout-page">
        <h2 className="page-title">Checkout</h2>

        <div className="checkout-layout">
          <div className="checkout-form">

            <h3>Shipping Information</h3>
            {[
              { key: "name",    label: "Full Name", type: "text",  placeholder: "John Doe" },
              { key: "email",   label: "Email",     type: "email", placeholder: "john@example.com" },
              { key: "address", label: "Address",   type: "text",  placeholder: "123 Main St" },
              { key: "city",    label: "City",      type: "text",  placeholder: "Cairo" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="form-group">
                <label>{label}</label>
                <input
                  type={type} placeholder={placeholder} value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className={errors[key] ? "input-error" : ""}
                />
                {errors[key] && <span className="error-msg">{errors[key]}</span>}
              </div>
            ))}

            <h3>Payment Method</h3>
            <div className="payment-options">
              {[
                { value: "visa", label: "💳 Visa / Card" },
                { value: "cod",  label: "💵 Cash on Delivery" },
              ].map((opt) => (
                <label key={opt.value} className={`payment-option ${form.payment === opt.value ? "selected" : ""}`}>
                  <input type="radio" name="payment" value={opt.value}
                    checked={form.payment === opt.value}
                    onChange={(e) => set("payment", e.target.value)} />
                  {opt.label}
                </label>
              ))}
            </div>

            {form.payment === "visa" && (
              <div className="visa-section">
                {/* 3D Card */}
                <div className={`credit-card ${flip ? "flipped" : ""}`} onClick={() => setFlip(false)}>
                  <div className="card-front">
                    <div className="card-chip">
                      <div className="chip-line"></div>
                      <div className="chip-line"></div>
                      <div className="chip-line"></div>
                    </div>
                    <div className="card-number-display">
                      {form.cardNumber || "•••• •••• •••• ••••"}
                    </div>
                    <div className="card-meta">
                      <div>
                        <div className="card-label">Card Holder</div>
                        <div className="card-value">{form.cardName || "YOUR NAME"}</div>
                      </div>
                      <div>
                        <div className="card-label">Expires</div>
                        <div className="card-value">{form.expiry || "MM/YY"}</div>
                      </div>
                      <div className="card-brand">{cardInfo.icon}</div>
                    </div>
                  </div>
                  <div className="card-back">
                    <div className="card-stripe"></div>
                    <div className="cvv-row">
                      <div className="cvv-label">CVV</div>
                      <div className="cvv-box">{form.cvv ? "•".repeat(form.cvv.length) : "•••"}</div>
                    </div>
                  </div>
                </div>

                {/* Card inputs */}
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(e) => set("cardNumber", formatCard(e.target.value))}
                    className={errors.cardNumber ? "input-error" : ""}
                    onFocus={() => setFlip(false)} />
                  {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                  {cardInfo.type && <span className="card-type-badge">{cardInfo.type}</span>}
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="JOHN DOE"
                    value={form.cardName}
                    onChange={(e) => set("cardName", e.target.value.toUpperCase())}
                    className={errors.cardName ? "input-error" : ""}
                    onFocus={() => setFlip(false)} />
                  {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                </div>

                <div className="card-row-two">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input type="text" inputMode="numeric" placeholder="MM/YY"
                      value={form.expiry}
                      onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                      className={errors.expiry ? "input-error" : ""}
                      onFocus={() => setFlip(false)} />
                    {errors.expiry && <span className="error-msg">{errors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input type="text" inputMode="numeric" placeholder="•••" maxLength={4}
                      value={form.cvv}
                      onChange={(e) => set("cvv", e.target.value.replace(/\D/g, ""))}
                      className={errors.cvv ? "input-error" : ""}
                      onFocus={() => setFlip(true)}
                      onBlur={() => setFlip(false)} />
                    {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="secure-badge">
                  🔒 Your payment is secured with 256-bit SSL encryption
                </div>
              </div>
            )}
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
            <button
              className="btn-primary place-order-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <span className="btn-spinner"></span> Processing…
                </span>
              ) : form.payment === "visa" ? "💳 Pay Now →" : "📦 Place Order →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;
