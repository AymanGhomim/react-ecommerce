import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import Skeleton from "../components/Skeleton";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = products
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        (category ? p.category === category : true)
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating-desc") return b.rating.rate - a.rating.rate;
      return 0;
    });

  return (
    <>
      <FilterBar setSearch={setSearch} setCategory={setCategory} setSort={setSort} />

      {!loading && (
        <p className="results-count">
          Showing <strong>{filtered.length}</strong> products
        </p>
      )}

      <div className="grid">
        {loading
          ? Array(8).fill().map((_, i) => <Skeleton key={i} />)
          : filtered.length > 0
          ? filtered.map((p) => <ProductCard key={p.id} product={p} />)
          : <p className="no-results">No products found.</p>}
      </div>
    </>
  );
}

export default Home;
