import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

const LINKS = {
  Shop: [
    { label: "All Products", to: "/products" },
    { label: "Brands",       to: "/brands"   },
    { label: "Wishlist",     to: "/wishlist" },
    { label: "My Cart",      to: "/cart"     },
  ],
  Account: [
    { label: "My Orders",  to: "/orders"  },
    { label: "Profile",    to: "/profile" },
    { label: "Checkout",   to: "/checkout"},
  ],
  Support: [
    { label: "FAQ",            to: "#" },
    { label: "Shipping Policy",to: "#" },
    { label: "Return Policy",  to: "#" },
    { label: "Contact Us",     to: "#" },
  ],
};

const SOCIALS = [
  { label: "Facebook",  icon: "f",  href: "#", color: "#1877f2" },
  { label: "Instagram", icon: "in", href: "#", color: "#e1306c" },
  { label: "Twitter",   icon: "x",  href: "#", color: "#1da1f2" },
  { label: "WhatsApp",  icon: "w",  href: "#", color: "#25d366" },
];

const PAYMENTS = ["VISA", "MC", "AMEX", "PayPal", "Cash"];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    toast.success("Subscribed! 🎉 You'll get the best deals first.");
    setEmail("");
  };

  return (
    <footer className="footer">
      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="newsletter-inner">
          <div className="newsletter-text">
            <h3>Get exclusive deals in your inbox</h3>
            <p>Subscribe to our newsletter and be the first to know about new products, sales, and more.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <div className="newsletter-input-wrap">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
              <button type="submit">Subscribe →</button>
            </div>
            <p className="newsletter-note">No spam, ever. Unsubscribe at any time.</p>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main">
        <div className="footer-brand-col">
          <Link to="/" className="footer-logo">Store</Link>
          <p className="footer-tagline">
            Your one-stop destination for premium products across all categories. Quality guaranteed, prices unmatched.
          </p>

          {/* Socials */}
          <div className="footer-socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="social-btn"
                style={{ "--s-color": s.color }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, items]) => (
          <div key={title} className="footer-col">
            <h4 className="footer-col-title">{title}</h4>
            <ul className="footer-col-list">
              {items.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="footer-link">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact col */}
        <div className="footer-col">
          <h4 className="footer-col-title">Contact</h4>
          <ul className="footer-col-list contact-list">
            <li><span>📍</span> Cairo, Egypt</li>
            <li><span>📞</span> +20 100 000 0000</li>
            <li><span>✉️</span> support@store.com</li>
            <li><span>🕒</span> Mon–Fri, 9am–6pm</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p className="footer-copy">
          © {new Date().getFullYear()} <strong>Store</strong>. All rights reserved.
        </p>

        {/* Payment badges */}
        <div className="footer-payments">
          {PAYMENTS.map((p) => (
            <span key={p} className="payment-badge">{p}</span>
          ))}
        </div>

        <p className="footer-made">
          Made with ❤️ in Egypt
        </p>
      </div>
    </footer>
  );
}
