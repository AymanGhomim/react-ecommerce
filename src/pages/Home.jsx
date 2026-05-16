import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Skeleton from "../components/Skeleton";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

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

  if (error) {
    return (
      <div className="empty-page">
        <div className="empty-icon">⚠️</div>
        <h2>Failed to load products</h2>
        <p>Please check your connection and try again.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="grid">
      {loading
        ? Array(12).fill(null).map((_, i) => <Skeleton key={i} />)
        : products.map((p) => <ProductCard key={p._id} product={p} />)
      }
    </div>
  );
}
