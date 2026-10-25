import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="brand">
        <img
          src="/auramart-logo.png"
          alt="AURAMART"
          className="brand-logo"
        />

        <span className="brand-name">
          <span className="brand-aura">AURA</span>
          <span className="brand-mart">MART</span>
        </span>
      </Link>

      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/cart" className="cart-link">
          <span>🛒 Cart</span>

          {totalItems > 0 && (
            <span className="cart-count">
              {totalItems}
            </span>
          )}
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/orders">Orders</Link>

            <span className="welcome-user">
              Hi, {user?.name || "User"}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}

export default Navbar;