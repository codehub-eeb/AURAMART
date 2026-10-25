
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import "./Products.css";

function Products() {
  const [productsData, setProductsData] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  // Fetch products from MongoDB through the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");
        const products = response.data.products || [];

        // Map MongoDB fields to the existing ProductCard format
        const formattedProducts = products.map((product) => ({
          ...product,
          id: product._id,
          title: product.name,
          brand: product.brand || "AURAMART",
          category: (product.category || "general").toLowerCase(),
          price: Number(product.price),
          image: product.image || "/products/placeholder.png",
          rating: product.rating ?? 0,
          reviews: product.reviews ?? 0,
        }));

        setProductsData(formattedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(
          "Unable to load products. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Search and category filtering
  const filteredProducts = productsData.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      (product.title || "").toLowerCase().includes(searchText) ||
      (product.brand || "").toLowerCase().includes(searchText);

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  // Add product to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="products-page">
      <section className="products-header">
        <div>
          <p className="products-small">AURAMART COLLECTION</p>
          <h1>Explore Our Products</h1>
          <p>
            Discover the latest smartphones and premium laptops.
          </p>
        </div>
      </section>

      <section className="products-controls">
        <div className="search-box">
          <span>🔎</span>
          <input
            type="text"
            placeholder="Search iPhone, Samsung, MacBook..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptops</option>
        </select>
      </section>

      <div className="product-count">
        Showing <strong>{filteredProducts.length}</strong> products
      </div>

      <section className="products-section">
        {loading ? (
          <div className="no-products">
            <h2>Loading products...</h2>
          </div>
        ) : error ? (
          <div className="no-products">
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="no-products">
            <h2>No products found 😕</h2>
            <p>
              {productsData.length === 0
                ? "No products have been added yet."
                : "Try searching for another product."}
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;
