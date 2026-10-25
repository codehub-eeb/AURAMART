import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

const products = [
  {
    id: 1,
    title: "iPhone 18 Pro",
    brand: "Apple",
    price: 164900,
    category: "smartphones",
    rating: 4.9,
    reviews: 245,
    image: "/products/iphone%2018%20pro.jpg",
    description:
      "Experience premium performance, advanced photography and a powerful next-generation smartphone experience.",
  },
  {
    id: 2,
    title: "MacBook Pro",
    brand: "Apple",
    price: 210000,
    category: "laptops",
    rating: 4.8,
    reviews: 184,
    image: "/products/MacBook%20Pro.jpg",
    description:
      "A powerful professional laptop designed for demanding creative and development workflows.",
  },
  {
    id: 3,
    title: "Dell Laptop",
    brand: "Dell",
    price: 64900,
    category: "laptops",
    rating: 4.7,
    reviews: 126,
    image: "/products/Dell%20laptop.jpg",
    description:
      "Reliable performance, modern design and everyday productivity in one complete laptop.",
  },
  {
    id: 4,
    title: "HP Laptop",
    brand: "HP",
    price: 72000,
    category: "laptops",
    rating: 4.6,
    reviews: 103,
    image: "/products/Hp%20laptop.jpg",
    description:
      "A versatile laptop offering smooth performance for work, study and entertainment.",
  },
  {
    id: 5,
    title: "iPhone 17",
    brand: "Apple",
    price: 80000,
    category: "smartphones",
    rating: 4.8,
    reviews: 318,
    image: "/products/iPhone%2017.jpg",
    description:
      "A premium smartphone combining performance, design and an excellent camera experience.",
  },
  {
    id: 6,
    title: "Samsung Galaxy S26 Ultra",
    brand: "Samsung",
    price: 124900,
    category: "smartphones",
    rating: 4.9,
    reviews: 412,
    image: "/products/Samsung%20S26%20ultra.jpg",
    description:
      "Flagship Samsung smartphone with premium performance and advanced camera capabilities.",
  },
  {
    id: 7,
    title: "ROG Gaming Laptop",
    brand: "ASUS ROG",
    price: 94900,
    category: "laptops",
    rating: 4.8,
    reviews: 157,
    image: "/products/rog%20laptop.jpg",
    description:
      "High-performance gaming laptop built for immersive gaming and demanding applications.",
  },
  {
    id: 8,
    title: "Samsung Galaxy S25 FE",
    brand: "Samsung",
    price: 54900,
    category: "smartphones",
    rating: 4.6,
    reviews: 198,
    image: "/products/Samsung%20S25%20FE.jpg",
    description:
      "Premium smartphone experience with powerful performance and modern design.",
  },
  {
    id: 9,
    title: "Samsung Galaxy S26",
    brand: "Samsung",
    price: 84900,
    category: "smartphones",
    rating: 4.7,
    reviews: 276,
    image: "/products/Samsung%20S26.jpg",
    description:
      "Modern Samsung smartphone with smooth performance and an immersive display.",
  },
];

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.id === Number(productId)
  );

  if (!product) {
    return (
      <div style={{ padding: "80px", textAlign: "center" }}>
        <h1>Product Not Found</h1>
      </div>
    );
  }

  const addProduct = () => {
    addToCart(product);

    alert(
      `${product.title} added to cart!`
    );

    navigate("/cart");
  };

  return (
    <div className="product-details-page">

      <button
        className="back-btn"
        onClick={() => navigate("/products")}
      >
        ← Back to Products
      </button>

      <div className="product-details">

        <div className="details-image">
          <img
            src={product.image}
            alt={product.title}
          />
        </div>

        <div className="details-content">

          <span className="details-category">
            {product.category}
          </span>

          <p className="details-brand">
            {product.brand}
          </p>

          <h1>{product.title}</h1>

          <div className="details-rating">
            ⭐ {product.rating}
            <span>
              ({product.reviews} reviews)
            </span>
          </div>

          <h2 className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </h2>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-features">
            <span>✓ Premium Quality</span>
            <span>✓ Fast Delivery</span>
            <span>✓ Secure Payment</span>
            <span>✓ Easy Returns</span>
          </div>

          <button
            className="details-cart-btn"
            onClick={addProduct}
          >
            🛒 Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;