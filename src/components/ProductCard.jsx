import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <span className="product-category">
          {product.category}
        </span>

        <p className="product-brand">
          {product.brand}
        </p>

        <h3 className="product-title">
          {product.title}
        </h3>

        <div className="product-rating">
          ⭐ {product.rating}
          <span>({product.reviews} reviews)</span>
        </div>

        <div className="product-bottom">
          <span className="product-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
          >
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;