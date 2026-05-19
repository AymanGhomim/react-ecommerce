import { useEffect, useState, useRef, useCallback } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCats]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setMore]  = useState(false);
  const [error, setError]       = useState(false);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(true);
  const [selCat, setSelCat]     = useState("");
  const [sort, setSort]         = useState("");
  const observer                = useRef(null);
  const sentinel                = useRef(null);

  const LIMIT = 20;

  // Load categories
  useEffect(() => {
    api.get("/categories").then((r) => setCats(r.data.data || [])).catch(() => {});
  }, []);

  // Load products when page / category changes
  const loadProducts = useCallback(async (pg, cat, reset = false) => {
    if (pg === 1) { setLoading(true); setError(false); }
    else setMore(true);

    try {
      const catParam = cat ? `&category=${cat}` : "";
      const res = await api.get(`/products?page=${pg}&limit=${LIMIT}${catParam}`);
      const data = res.data.data || [];
      if (reset || pg === 1) setProducts(data);
      else setProducts((prev) => [...prev, ...data]);
      setHasMore(data.length === LIMIT);
    } catch {
      if (pg === 1) setError(true);
    } finally {
      setLoading(false);
      setMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    loadProducts(1, selCat, true);
  }, [selCat, loadProducts]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore && !loadingMore) {
        setPage((p) => {
          const next = p + 1;
          loadProducts(next, selCat);
          return next;
        });
      }
    }, { threshold: 0.1 });
    if (sentinel.current) observer.current.observe(sentinel.current);
    return () => observer.current?.disconnect();
  }, [hasMore, loading, loadingMore, selCat, loadProducts]);

  // Sort locally
  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc")  return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating")     return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
    return 0;
  });

  if (error) {
    return (
      <div className="empty-page">
        <div className="empty-icon">⚠️</div>
        <h2>Failed to load products</h2>
        <p>Please check your connection and try again.</p>
        <button type="button" className="btn-primary" onClick={() => loadProducts(1, selCat, true)}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Filters toolbar */}
      <div className="products-toolbar">
        <div className="toolbar-left">
          {!loading && (
            <span className="products-count">{sorted.length} products</span>
          )}
        </div>
        <div className="toolbar-right">
          <select
            value={selCat}
            onChange={(e) => { setSelCat(e.target.value); }}
            className="toolbar-select"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="toolbar-select"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="cat-pills-scroll">
          <button
            type="button"
            className={`cat-pill ${selCat === "" ? "active" : ""}`}
            onClick={() => setSelCat("")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              type="button"
              className={`cat-pill ${selCat === c._id ? "active" : ""}`}
              onClick={() => setSelCat(c._id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Products grid */}
      <div className="grid">
        {loading
          ? Array(12).fill(null).map((_, i) => <Skeleton key={i} />)
          : sorted.map((p) => <ProductCard key={p._id} product={p} />)
        }
      </div>

      {/* Infinite scroll sentinel */}
      {!loading && hasMore && (
        <div ref={sentinel} className="scroll-sentinel">
          {loadingMore && (
            <div className="loading-more">
              <div className="spinner" />
              <span>Loading more…</span>
            </div>
          )}
        </div>
      )}

      {!loading && !hasMore && sorted.length > 0 && (
        <p className="all-loaded">✓ All products loaded</p>
      )}
    </div>
  );
}
