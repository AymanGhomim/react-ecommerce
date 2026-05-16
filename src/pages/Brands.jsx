import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Brands() {
  const [brands, setBrands]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    let cancelled = false;
    api.get("/brands")
      .then((res) => {
        if (!cancelled) {
          setBrands(res.data.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="brands-page">
      <div className="brands-hero">
        <h1>Our Brands</h1>
        <p>Discover the world&apos;s best brands, all in one place</p>
      </div>

      <div className="brands-controls">
        <input
          className="brands-search"
          placeholder="🔍  Search brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <div className="loading-center"><div className="spinner" /></div>}

      {error && (
        <div className="empty-page">
          <div className="empty-icon">⚠️</div>
          <h2>Failed to load brands</h2>
          <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="brands-grid">
          {filtered.map((brand) => (
            <div key={brand._id} className="brand-card">
              <div className="brand-logo-img">
                <img src={brand.image} alt={brand.name} />
              </div>
              <h3>{brand.name}</h3>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="empty-page" style={{ gridColumn: "1/-1" }}>
              <div className="empty-icon">🏷️</div>
              <h2>No brands found</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
