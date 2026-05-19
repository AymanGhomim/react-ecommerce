import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Skeleton from "../components/Skeleton";

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="search-highlight">{part}</mark>
      : part
  );
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [input, setInput]       = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const [categories, setCats]   = useState([]);
  const [selCat, setSelCat]     = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort]         = useState("");

  // Fetch categories
  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data.data || [])).catch(() => {});
  }, []);

  const doSearch = useCallback((q) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    api.get(`/products?keyword=${encodeURIComponent(q)}&limit=40`)
      .then((r) => { setProducts(r.data.data || []); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  // Run search when URL query changes
  useEffect(() => {
    if (query) { setInput(query); doSearch(query); }
  }, [query, doSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSearchParams({ q: input.trim() });
  };

  // Filter locally
  const filtered = products
    .filter((p) => !selCat || p.category?._id === selCat)
    .filter((p) => !priceMin || p.price >= Number(priceMin))
    .filter((p) => !priceMax || p.price <= Number(priceMax))
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating")     return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
      return 0;
    });

  return (
    <div className="search-page">
      {/* Search bar */}
      <div className="search-hero">
        <h1>Search Products</h1>
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for products, brands, categories…"
              className="search-input"
              autoFocus
            />
            {input && (
              <button type="button" className="search-clear" onClick={() => { setInput(""); setProducts([]); setSearched(false); }}>
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {/* Filters row */}
      {searched && !loading && (
        <div className="search-filters">
          <select value={selCat} onChange={(e) => setSelCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <div className="price-range">
            <input type="number" placeholder="Min EGP" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
            <span>—</span>
            <input type="number" placeholder="Max EGP" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      )}

      {/* Results */}
      {loading && (
        <div className="grid search-grid">
          {Array(8).fill(null).map((_, i) => <Skeleton key={i} />)}
        </div>
      )}

      {!loading && searched && (
        <>
          <p className="search-count">
            {filtered.length > 0
              ? <><strong>{filtered.length}</strong> results for "<em>{query}</em>"</>
              : <>No results found for "<em>{query}</em>"</>
            }
          </p>

          {filtered.length > 0 ? (
            <div className="grid search-grid">
              {filtered.map((p) => (
                <div key={p._id} className="search-card-wrap">
                  <ProductCard product={{ ...p, title: p.title }} />
                  <div className="search-title-highlight" style={{ display: "none" }}>
                    {highlight(p.title, query)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="search-empty">
              <div className="search-empty-icon">🔍</div>
              <h2>No products found</h2>
              <p>Try different keywords or browse our categories</p>
              <div className="search-suggestions">
                <Link to="/products" className="btn-primary">Browse All Products</Link>
                <Link to="/brands" className="nf-btn-secondary">View Brands</Link>
              </div>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="search-idle">
          <div className="search-idle-icon">✨</div>
          <p>Start typing to discover amazing products</p>
        </div>
      )}
    </div>
  );
}
