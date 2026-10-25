import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="auramart-footer">

      {/* Trust Section */}
      <section className="footer-trust">

        <div className="trust-box">
          <div className="trust-icon">✓</div>
          <div>
            <h3>Secure Payments</h3>
            <p>Your payments are protected</p>
          </div>
        </div>

        <div className="trust-box">
          <div className="trust-icon">↗</div>
          <div>
            <h3>Fast Delivery</h3>
            <p>Quick & reliable delivery</p>
          </div>
        </div>

        <div className="trust-box">
          <div className="trust-icon">↩</div>
          <div>
            <h3>Easy Returns</h3>
            <p>Simple return process</p>
          </div>
        </div>

        <div className="trust-box">
          <div className="trust-icon">?</div>
          <div>
            <h3>24/7 Support</h3>
            <p>We're here to help</p>
          </div>
        </div>

      </section>


      {/* Main Footer */}
      <section className="footer-content">

        {/* Brand */}
        <div className="footer-brand">

          <Link to="/" className="footer-brand-link">

            <img
              src="/auramart-logo.png"
              alt="AURAMART Logo"
              className="footer-logo"
            />

            <div className="footer-brand-name">
              <span>AURA</span>
              <strong>MART</strong>
            </div>

          </Link>

          <p>
            Your trusted destination for quality products,
            great prices and a seamless shopping experience.
          </p>

          <div className="social-links">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Twitter">X</a>
            <a href="#" aria-label="Instagram">◎</a>
          </div>

        </div>


        {/* Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Shopping Cart</Link>
          <Link to="/orders">My Orders</Link>
        </div>


        {/* Account */}
        <div className="footer-column">
          <h4>Account</h4>

          <Link to="/login">Login</Link>
          <Link to="/signup">Create Account</Link>
          <Link to="/orders">Order History</Link>
        </div>


        {/* Support */}
        <div className="footer-column">
          <h4>Support</h4>

          <a href="#">Help Center</a>
          <a href="#">Shipping Information</a>
          <a href="#">Returns & Refunds</a>
          <a href="#">Contact Us</a>
        </div>

      </section>


      {/* Bottom Footer */}
      <section className="footer-bottom">

        <p>
          © 2026 AURAMART. All rights reserved.
        </p>

        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>

      </section>

    </footer>
  );
}

export default Footer;