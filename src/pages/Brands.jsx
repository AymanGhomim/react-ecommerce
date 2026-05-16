import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Brands() {
  const [brands, setBrands]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    axios.get("https://ecommerce.routemisr.com/api/v1/brands")
      .then((res) => { setBrands(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="brands-page">
      <div className="brands-hero">
        <h1>Our Brands</h1>
        <p>Discover the world's best brands, all in one place</p>
      </div>

      <div className="brands-controls">
        <input
          className="brands-search"
          placeholder="🔍  Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-center"><div className="spinner"></div></div>
      ) : (
        <div className="brands-grid">
          {filtered.map((brand) => (
            <div key={brand._id} className="brand-card">
              <div className="brand-logo-img">
                <img src={brand.image} alt={brand.name} />
              </div>
              <h3>{brand.name}</h3>
              <Link to={`/?brand=${brand.name}`} className="brand-shop-btn">
                Shop →
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="empty-page">
          <div className="empty-icon">🏷️</div>
          <h2>No brands found</h2>
        </div>
      )}
    </div>
  );
}
