import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-small">WELCOME TO AURAMART</p>

          <h1>
            Everything You Need,
            <br />
            All in One Place.
          </h1>

          <p className="hero-text">
            Discover quality products, great prices and a smooth
            shopping experience.
          </p>

          <Link to="/products" className="shop-btn">
            Explore Products →
          </Link>
        </div>

        <div className="hero-image">
          <div className="shopping-card">
            🛍️
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <p>Explore our popular categories</p>

        <div className="category-grid">
          <div className="category-card">
            <span>💻</span>
            <h3>Electronics</h3>
          </div>

          <div className="category-card">
            <span>👕</span>
            <h3>Fashion</h3>
          </div>

          <div className="category-card">
            <span>🏠</span>
            <h3>Home & Living</h3>
          </div>

          <div className="category-card">
            <span>🎧</span>
            <h3>Accessories</h3>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div>
          <span>🚚</span>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable delivery.</p>
        </div>

        <div>
          <span>🔒</span>
          <h3>Secure Payment</h3>
          <p>Safe and secure checkout.</p>
        </div>

        <div>
          <span>⭐</span>
          <h3>Quality Products</h3>
          <p>Products you can trust.</p>
        </div>

        <div>
          <span>💬</span>
          <h3>Customer Support</h3>
          <p>We're here to help.</p>
        </div>
      </section>

    </div>
  );
}

export default Home;