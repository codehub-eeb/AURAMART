
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("⚠️ All details required");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      // Authenticate the user through the backend API.
      const user = await login({
        email: email.trim(),
        password,
      });

      alert("Login successful!");

      // Admins can open the admin dashboard directly.
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        {/* Left Section */}
        <section className="login-visual">
          <div className="login-brand">
            <img
              src="/auramart-logo.png"
              alt="AURAMART"
              className="login-logo"
            />

            <div className="login-brand-name">
              <span>AURA</span>
              <strong>MART</strong>
            </div>
          </div>

          <h1>
            Welcome back to
            <br />
            AURAMART.
          </h1>

          <p>
            Sign in to continue your shopping journey
            and manage your orders with ease.
          </p>

          <div className="login-benefits">
            <div>
              <span>✓</span>
              <p>Secure shopping experience</p>
            </div>

            <div>
              <span>✓</span>
              <p>Track your orders easily</p>
            </div>

            <div>
              <span>✓</span>
              <p>Fast and reliable checkout</p>
            </div>
          </div>
        </section>

        {/* Login Card */}
        <section className="login-card">
          <div className="login-card-header">
            <h2>Sign In</h2>
            <p>Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <Link to="/forgot">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <p className="signup-text">
            Don't have an account?
            <Link to="/signup">
              Create Account
            </Link>
          </p>

          <Link
            to="/"
            className="back-home"
          >
            ← Back to AURAMART
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Login;
