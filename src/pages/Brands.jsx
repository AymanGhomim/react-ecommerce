import { Link } from "react-router-dom";

const BRANDS = [
  { name: "Apple",     logo: "🍎", category: "Electronics",      color: "#555",   products: 24, desc: "iPhone, Mac, iPad, AirPods" },
  { name: "Samsung",   logo: "🔷", category: "Electronics",      color: "#1428A0",products: 18, desc: "Galaxy, QLED TVs, Monitors" },
  { name: "Sony",      logo: "🎵", category: "Electronics",      color: "#000",   products: 15, desc: "WH Headphones, PlayStation, Cameras" },
  { name: "Dell",      logo: "💻", category: "Electronics",      color: "#007DB8",products: 10, desc: "XPS, Inspiron, Alienware" },
  { name: "Logitech",  logo: "🖱️", category: "Electronics",      color: "#00B8FC",products: 8,  desc: "MX Series, Gaming Mice, Keyboards" },
  { name: "Razer",     logo: "🐍", category: "Electronics",      color: "#00FF00",products: 6,  desc: "DeathAdder, Blade Laptops, Headsets" },
  { name: "Nike",      logo: "✔️", category: "Clothing",         color: "#F05223",products: 22, desc: "Air Max, Dri-FIT, Sportswear" },
  { name: "Adidas",    logo: "⚡", category: "Clothing",         color: "#000",   products: 19, desc: "Ultraboost, Originals, Training" },
  { name: "Levi's",    logo: "👖", category: "Clothing",         color: "#C41230",products: 14, desc: "501 Jeans, Jackets, Trucker" },
  { name: "Zara",      logo: "👗", category: "Clothing",         color: "#000",   products: 30, desc: "Women, Men, Kids Collections" },
  { name: "H&M",       logo: "🛍️", category: "Clothing",         color: "#E50010",products: 25, desc: "Basics, Trending, Sustainable" },
  { name: "Rolex",     logo: "⌚", category: "Jewelery",         color: "#8B7340",products: 5,  desc: "Submariner, Datejust, Oyster" },
  { name: "Tiffany",   logo: "💎", category: "Jewelery",         color: "#0ABAB5",products: 9,  desc: "Rings, Necklaces, Bracelets" },
  { name: "Pandora",   logo: "🌸", category: "Jewelery",         color: "#C8A96E",products: 12, desc: "Charms, Bracelets, Earrings" },
  { name: "IKEA",      logo: "🏠", category: "Home & Living",    color: "#0051A2",products: 40, desc: "Furniture, Storage, Decor" },
  { name: "Dyson",     logo: "🌀", category: "Home & Living",    color: "#C6A84B",products: 8,  desc: "Vacuum, Airwrap, Purifiers" },
  { name: "Le Creuset",logo: "🍳", category: "Home & Living",    color: "#F05223",products: 7,  desc: "Cast Iron, Stoneware, Cookware" },
  { name: "Nike",      logo: "🏃", category: "Sports & Outdoors",color: "#F05223",products: 20, desc: "Running, Training, Basketball" },
  { name: "The North Face",logo:"🏔️",category:"Sports & Outdoors",color:"#E31837",products: 11, desc: "Jackets, Backpacks, Trail Gear" },
  { name: "Hydro Flask",logo: "💧", category: "Sports & Outdoors",color: "#2B9ED6",products: 6,  desc: "Water Bottles, Coffee Flasks" },
  { name: "L'Oréal",   logo: "💄", category: "Beauty",          color: "#9B1B30",products: 28, desc: "Skincare, Makeup, Hair Care" },
  { name: "The Ordinary",logo:"🧪",category: "Beauty",          color: "#000",   products: 15, desc: "Serums, Acids, Moisturizers" },
  { name: "Fenty Beauty",logo:"✨",category: "Beauty",          color: "#C17F58",products: 20, desc: "Foundation, Gloss, Highlighter" },
];

const CATEGORIES = ["All", ...new Set(BRANDS.map((b) => b.category))];

import { useState } from "react";

function Brands() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = BRANDS.filter(
    (b) =>
      (active === "All" || b.category === active) &&
      b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="brands-page">
      <div className="brands-hero">
        <h1>Our Brands</h1>
        <p>Discover the world's best brands, all in one place</p>
      </div>

      {/* Search + filter */}
      <div className="brands-controls">
        <input
          className="brands-search"
          placeholder="🔍  Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="brands-cats">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`cat-pill ${active === c ? "active" : ""}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="brands-grid">
        {filtered.map((brand, i) => (
          <div key={i} className="brand-card">
            <div className="brand-logo" style={{ background: brand.color + "18", border: `1px solid ${brand.color}30` }}>
              <span>{brand.logo}</span>
            </div>
            <h3>{brand.name}</h3>
            <span className="brand-cat">{brand.category}</span>
            <p className="brand-desc">{brand.desc}</p>
            <div className="brand-footer">
              <span className="brand-count">{brand.products} products</span>
              <Link to={`/?brand=${brand.name}`} className="brand-shop-btn">
                Shop →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-page">
          <div className="empty-icon">🏷️</div>
          <h2>No brands found</h2>
          <p>Try a different search term</p>
        </div>
      )}
    </div>
  );
}

export default Brands;
