import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort]         = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    api.get("/products?limit=40")
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data.data || []);
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

  const filtered = products
    .filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? p.category?.name === category : true)
    )
    .sort((a, b) => {
      if (sort === "price-asc")   return a.price - b.price;
      if (sort === "price-desc")  return b.price - a.price;
      if (sort === "rating-desc") return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
      return 0;
    });

  if (error) {
    return (
      <div className="empty-page">
        <div className="empty-icon">⚠️</div>
        <h2>Failed to load products</h2>
        <p>Please check your connection and try again.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <FilterBar setSearch={setSearch} setCategory={setCategory} setSort={setSort} />

      {!loading && (
        <p className="results-count">
          Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products
        </p>
      )}

      <div className="grid">
        {loading
          ? Array(12).fill(null).map((_, i) => <Skeleton key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => <ProductCard key={p._id} product={p} />)
          : (
            <div className="no-results">
              <span>🔍</span>
              <p>No products found for "<strong>{search}</strong>"</p>
            </div>
          )
        }
      </div>
    </>
  );
}
