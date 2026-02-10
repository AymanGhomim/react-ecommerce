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

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? p.category === category : true),
  );

  return (
    <>
      <FilterBar setSearch={setSearch} setCategory={setCategory} />
      <div className="grid">
        {loading
          ? Array(8)
              .fill()
              .map((_, i) => <Skeleton key={i} />)
          : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}

export default Home;
