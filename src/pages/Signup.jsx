
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !password
    ) {
      alert("⚠️ All details required");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      // Send every required field, including password, to the backend.
      await signup({
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        password,
      });

      alert("Signup successful!");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Signup failed. Please try again.";

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="signup-page">
      <div className="signup-container">

        {/* LEFT SECTION */}
        <section className="signup-visual">
          <div className="signup-brand">
            <img
              src="/auramart-logo.png"
              alt="AURAMART"
              className="signup-logo"
            />

            <div className="signup-brand-name">
              <span>AURA</span>
              <strong>MART</strong>
            </div>
          </div>

          <h1>
            Create your
            <br />
            AURAMART account.
          </h1>

          <p>
            Join AURAMART and enjoy a simple, secure and
            seamless shopping experience.
          </p>

          <div className="signup-benefits">
            <div>
              <span>✓</span>
              <p>Access your orders anytime</p>
            </div>

            <div>
              <span>✓</span>
              <p>Fast and secure checkout</p>
            </div>

            <div>
              <span>✓</span>
              <p>Personalized shopping experience</p>
            </div>
          </div>
        </section>

        {/* SIGNUP CARD */}
        <section className="signup-card">
          <div className="signup-card-header">
            <h2>Create Account</h2>
            <p>Enter your details to get started.</p>
          </div>

          <form onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="signup-form-group">
              <label htmlFor="fullName">
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="signup-form-group">
              <label htmlFor="signupEmail">
                Email Address
              </label>

              <input
                id="signupEmail"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={isLoading}
              />
            </div>

            {/* Mobile */}
            <div className="signup-form-group">
              <label htmlFor="mobile">
                Mobile Number
              </label>

              <input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="signup-form-group">
              <label htmlFor="signupPassword">
                Password
              </label>

              <input
                id="signupPassword"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                disabled={isLoading}
              />
            </div>

            {/* Terms */}
            <label className="signup-terms">
              <input
                type="checkbox"
                required
                disabled={isLoading}
              />

              <span>
                I agree to the Terms & Conditions
              </span>
            </label>

            {/* Create Account */}
            <button
              type="submit"
              className="signup-submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="login-existing">
            Already have an account?
            <Link to="/login">
              Sign In
            </Link>
          </p>

          {/* Back */}
          <Link
            to="/"
            className="signup-back"
          >
            ← Back to AURAMART
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Signup;
