import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const { addToCart } = useContext(CartContext);

  // جلب تفاصيل المنتج
  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((res) => setProduct(res.data));
  }, [id]);

  // جلب توصيات (منتجات عشوائية من API)
  useEffect(() => {
    axios.get("https://fakestoreapi.com/products?limit=8").then((res) => {
      // نفلتر المنتج الحالي عشان لا يظهر ضمن التوصيات
      const filtered = res.data.filter((p) => p.id !== Number(id));
      setRecommendations(filtered);
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      {/* ===== Product Details ===== */}
      <div className="details">
        <img src={product.image} alt={product.title} />
        <div>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <h3>${product.price}</h3>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>

      {/* ===== Recommendations ===== */}
      <section className="recommendations">
        <h2>Recommended for You</h2>
        <div className="grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className="card">
              <img src={rec.image} alt={rec.title} />
              <h4>{rec.title}</h4>
              <p>${rec.price}</p>
              <div className="actions">
                <button onClick={() => addToCart(rec)}>Add to Cart</button>
                <Link to={`/product/${rec.id}`}>Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductDetails;
