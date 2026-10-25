
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const API_URL = "http://localhost:5000";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (isPlacingOrder) return;

    const { fullName, mobile, address, city, state, pin } = formData;

    if (
      !fullName.trim() ||
      !mobile.trim() ||
      !address.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pin.trim()
    ) {
      alert("⚠️ Please fill all delivery details.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      navigate("/products");
      return;
    }

    if (!/^\d{6}$/.test(pin.trim())) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const token =
      localStorage.getItem("auramart-token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auramartToken");

    if (!token) {
      alert("Please log in before placing your order.");
      navigate("/login");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.productId || item._id || item.id,
      quantity: Number(item.quantity),
    }));

    if (
      items.some(
        (item) => !item.productId || !Number.isFinite(item.quantity) || item.quantity < 1
      )
    ) {
      alert("Unable to identify a product in your cart. Please refresh your cart and try again.");
      return;
    }

    const orderData = {
      items,
      shippingAddress: {
        fullName: fullName.trim(),
        phone: mobile.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pin.trim(),
      },
      paymentMethod: paymentMethod === "cod" ? "COD" : "ONLINE",
      subtotal: Number(totalPrice),
      shippingCharge: 0,
      totalAmount: Number(totalPrice),
    };

    try {
      setIsPlacingOrder(true);

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to place order.");
      }

      // Clear cart only after the backend confirms success.
      clearCart();

      alert("🎉 Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Place order error:", error);
      alert(`Order was not placed: ${error.message}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-empty">
        <div className="checkout-empty-card">
          <div className="checkout-empty-icon">🛒</div>
          <h1>Your Cart is Empty</h1>
          <p>
            Add some products to your cart before proceeding
            to checkout.
          </p>
          <Link to="/products" className="checkout-shop-btn">
            Browse Products →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <p className="checkout-eyebrow">SECURE CHECKOUT</p>
        <h1>Complete Your Order</h1>
        <p className="checkout-subtitle">
          Enter your delivery details and choose your preferred
          payment method.
        </p>
      </section>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        <div className="checkout-left">
          <section className="checkout-card">
            <div className="checkout-card-title">
              <div className="title-icon">📍</div>
              <div>
                <h2>Delivery Address</h2>
                <p>Where should we deliver your order?</p>
              </div>
            </div>

            <div className="checkout-form-grid">
              <div className="checkout-field full-width">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="pin">PIN Code</label>
                <input
                  id="pin"
                  name="pin"
                  type="text"
                  placeholder="6-digit PIN"
                  maxLength={6}
                  value={formData.pin}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field full-width">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="House no., street, area"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Enter your state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card-title">
              <div className="title-icon">💳</div>
              <div>
                <h2>Payment Method</h2>
                <p>Choose how you want to pay.</p>
              </div>
            </div>

            <div className="payment-options">
              <label
                className={`payment-option ${
                  paymentMethod === "upi" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">📱</div>
                <div className="payment-info">
                  <strong>UPI</strong>
                  <span>Google Pay / PhonePe / Paytm</span>
                </div>
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "card" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <strong>Credit / Debit Card</strong>
                  <span>Secure card payment</span>
                </div>
              </label>

              <label
                className={`payment-option ${
                  paymentMethod === "cod" ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">💵</div>
                <div className="payment-info">
                  <strong>Cash on Delivery</strong>
                  <span>Pay when your order arrives</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <div className="summary-card">
            <div className="summary-header">
              <div>
                <p>YOUR ORDER</p>
                <h2>Order Summary</h2>
              </div>
              <span>
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="summary-products">
              {cartItems.map((item) => (
                <div
                  className="summary-product"
                  key={item.id || item._id || item.productId}
                >
                  <div className="summary-product-image">
                    <img src={item.image} alt={item.title || item.name} />
                  </div>

                  <div className="summary-product-info">
                    <h3>{item.title || item.name}</h3>
                    <p>{item.brand}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>

                  <strong>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-pricing">
              <div className="price-row">
                <span>Subtotal</span>
                <strong>
                  ₹{totalPrice.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="price-row">
                <span>Delivery</span>
                <strong className="free-text">FREE</strong>
              </div>

              <div className="price-row">
                <span>Discount</span>
                <strong className="discount-text">− ₹0</strong>
              </div>
            </div>

            <div className="summary-total">
              <span>Total Amount</span>
              <strong>
                ₹{totalPrice.toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={isPlacingOrder}
            >
              {isPlacingOrder
                ? "Placing Order..."
                : "🔒 Place Order"}
            </button>

            <p className="secure-note">
              🔒 Your order details will be submitted securely.
            </p>

            <Link to="/cart" className="back-cart">
              ← Back to Cart
            </Link>
          </div>
        </aside>
      </form>
    </main>
  );
}

export default Checkout;
