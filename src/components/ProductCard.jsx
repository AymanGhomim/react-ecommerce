import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="card">
      <img src={product.image} />
      <h4>{product.title.slice(0, 40)}</h4>
      <p>${product.price}</p>

      <div className="actions">
        <Link to={`/product/${product.id}`}>Details</Link>
        <button onClick={() => addToCart(product)}>Add</button>
      </div>
    </div>
  );
}

export default ProductCard;
