import { useContext, useState, useEffect, useRef } from "react";
import { saveOrder } from "./Orders";
import { useNavigate }  from "react-router-dom";
import { CartContext }  from "../context/CartContext";
import { AuthContext }  from "../context/AuthContext";

// ── Helpers ───────────────────────────────────────────────
function luhn(num) {
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

const formatCard   = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v) => {
  const c = v.replace(/\D/g, "").slice(0, 4);
  return c.length >= 3 ? `${c.slice(0, 2)}/${c.slice(2)}` : c;
};
const getCardType  = (num) => {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n))       return { type: "Visa",       icon: "💳 VISA" };
  if (/^5[1-5]/.test(n))  return { type: "Mastercard", icon: "💳 MC"   };
  if (/^3[47]/.test(n))   return { type: "Amex",       icon: "💳 AMEX" };
  return { type: "", icon: "💳" };
};

// ── Success Modal ─────────────────────────────────────────
function SuccessModal({ total, cardLast4, onClose }) {
  // Stable order number — generated once on mount
  const orderNum = useRef("#" + Math.random().toString(36).slice(2, 8).toUpperCase()).current;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-circle">
          <svg viewBox="0 0 52 52" className="checkmark-svg">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path   className="checkmark-tick"   fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>

        <h2 className="modal-title">Payment Successful!</h2>
        <p className="modal-subtitle">Your order has been placed and is being processed.</p>

        <div className="modal-details">
          <div className="modal-row"><span>Order Number</span><strong>{orderNum}</strong></div>
          <div className="modal-row">
            <span>Amount Paid</span>
            <strong className="modal-amount">{total} EGP</strong>
          </div>
          {cardLast4 && (
            <div className="modal-row"><span>Card</span><strong>•••• {cardLast4}</strong></div>
          )}
          <div className="modal-row">
            <span>Status</span>
            <span className="modal-status">✅ Confirmed</span>
          </div>
        </div>

        <p className="modal-email-note">
          📧 A confirmation receipt has been sent to your email.
        </p>
        <button className="modal-btn" onClick={onClose}>Continue Shopping →</button>
      </div>
    </div>
  );
}

// ── Main Checkout ─────────────────────────────────────────
export default function Checkout() {
  const { cart, cartLoading, fetchCart, clearCart } = useContext(CartContext);
  const { user }    = useContext(AuthContext);
  const navigate    = useNavigate();

  const [form, setForm] = useState({
    name:       user?.name  || "",
    email:      user?.email || "",
    address:    "",
    city:       "",
    payment:    "visa",
    cardNumber: "",
    cardName:   "",
    expiry:     "",
    cvv:        "",
  });
  const [errors, setErrors]         = useState({});
  const [flip, setFlip]             = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setSuccess]   = useState(false);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const products = cart?.products || [];
  const total    = cart?.totalCartPrice || 0;

  const setField = (k, v) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const cardInfo  = getCardType(form.cardNumber);
  const cardLast4 = form.cardNumber.replace(/\s/g, "").slice(-4);

  const validate = () => {
    const e = {};
    if (!form.name.trim())          e.name    = "Name is required";
    if (!form.email.includes("@"))  e.email   = "Valid email required";
    if (!form.address.trim())       e.address = "Address is required";
    if (!form.city.trim())          e.city    = "City is required";

    if (form.payment === "visa") {
      const raw = form.cardNumber.replace(/\s/g, "");
      if (raw.length < 16 || !luhn(raw)) e.cardNumber = "Invalid card number";
      if (!form.cardName.trim())         e.cardName   = "Cardholder name required";
      const [mm, yy] = (form.expiry || "").split("/");
      if (!mm || !yy || new Date(`20${yy}`, Number(mm) - 1) < new Date()) {
        e.expiry = "Invalid or expired date";
      }
      if (!/^\d{3,4}$/.test(form.cvv)) e.cvv = "Invalid CVV";
    }
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800)); // simulate payment processing
    setSubmitting(false);
    saveOrder(products, total, form.payment);
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    clearCart();
    navigate("/");
  };

  // Loading state — don't redirect yet
  if (cartLoading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  // After loading, if cart is empty (and not showing success), redirect
  if (!cartLoading && !showSuccess && products.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      {showSuccess && (
        <SuccessModal
          total={total}
          cardLast4={form.payment === "visa" ? cardLast4 : null}
          onClose={handleClose}
        />
      )}

      <div className="checkout-page">
        <h2 className="page-title">Checkout</h2>

        <div className="checkout-layout">

          {/* ── Shipping + Payment Form ── */}
          <div className="checkout-form">
            <h3>Shipping Information</h3>

            {[
              { key: "name",    label: "Full Name", type: "text",  placeholder: "John Doe"           },
              { key: "email",   label: "Email",     type: "email", placeholder: "john@example.com"   },
              { key: "address", label: "Address",   type: "text",  placeholder: "123 Main St"        },
              { key: "city",    label: "City",      type: "text",  placeholder: "Cairo"              },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key} className="form-group">
                <label>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  className={errors[key] ? "input-error" : ""}
                />
                {errors[key] && <span className="error-msg">{errors[key]}</span>}
              </div>
            ))}

            <h3>Payment Method</h3>
            <div className="payment-options">
              {[
                { value: "visa", label: "💳 Visa / Card"       },
                { value: "cod",  label: "💵 Cash on Delivery"  },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`payment-option ${form.payment === opt.value ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={form.payment === opt.value}
                    onChange={(e) => setField("payment", e.target.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            {form.payment === "visa" && (
              <div className="visa-section">
                {/* 3D flip card */}
                <div
                  className={`credit-card ${flip ? "flipped" : ""}`}
                  onClick={() => setFlip(false)}
                >
                  <div className="card-front">
                    <div className="card-chip">
                      <div className="chip-line" />
                      <div className="chip-line" />
                      <div className="chip-line" />
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
                    <div className="card-stripe" />
                    <div className="cvv-row">
                      <div className="cvv-label">CVV</div>
                      <div className="cvv-box">
                        {form.cvv ? "•".repeat(form.cvv.length) : "•••"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card inputs */}
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNumber}
                    onChange={(e) => setField("cardNumber", formatCard(e.target.value))}
                    className={errors.cardNumber ? "input-error" : ""}
                    onFocus={() => setFlip(false)}
                  />
                  {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
                  {cardInfo.type && <span className="card-type-badge">{cardInfo.type}</span>}
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="JOHN DOE"
                    value={form.cardName}
                    onChange={(e) => setField("cardName", e.target.value.toUpperCase())}
                    className={errors.cardName ? "input-error" : ""}
                    onFocus={() => setFlip(false)}
                  />
                  {errors.cardName && <span className="error-msg">{errors.cardName}</span>}
                </div>

                <div className="card-row-two">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={(e) => setField("expiry", formatExpiry(e.target.value))}
                      className={errors.expiry ? "input-error" : ""}
                      onFocus={() => setFlip(false)}
                    />
                    {errors.expiry && <span className="error-msg">{errors.expiry}</span>}
                  </div>

                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="•••"
                      maxLength={4}
                      value={form.cvv}
                      onChange={(e) => setField("cvv", e.target.value.replace(/\D/g, ""))}
                      className={errors.cvv ? "input-error" : ""}
                      onFocus={() => setFlip(true)}
                      onBlur={() => setFlip(false)}
                    />
                    {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="secure-badge">
                  🔒 Your payment is secured with 256-bit SSL encryption
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            {products.map((item) => (
              <div key={item.product._id} className="summary-item">
                <img src={item.product.imageCover} alt={item.product.title} />
                <div>
                  <p>{item.product.title.split(" ").slice(0, 4).join(" ")}…</p>
                  <span>x{item.count} — {(item.price * item.count).toFixed(0)} EGP</span>
                </div>
              </div>
            ))}

            <div className="summary-total">
              <span>Total</span>
              <strong>{total} EGP</strong>
            </div>

            <button
              className="btn-primary place-order-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <span className="processing-row">
                  <span className="btn-spinner" /> Processing…
                </span>
              ) : form.payment === "visa" ? "💳 Pay Now →" : "📦 Place Order →"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
