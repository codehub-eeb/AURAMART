import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalPrice,
  } = useCart();

  // Cart empty असेल तर
  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>

        <h1>Your Cart is Empty</h1>

        <p>
          Looks like you haven't added anything to your cart yet.
        </p>

        <Link to="/products" className="continue-shopping">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* Header */}
      <section className="cart-header">
        <p>YOUR SHOPPING CART</p>

        <h1>Shopping Cart</h1>

        <span>
          {cartItems.length} product(s) in your cart
        </span>
      </section>

      {/* Main Cart */}
      <div className="cart-layout">

        {/* Cart Products */}
        <div className="cart-items">

          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>

              {/* Product Image */}
              <img
                src={item.image}
                alt={item.title}
              />

              {/* Product Details */}
              <div className="cart-item-info">

                <p className="cart-brand">
                  {item.brand}
                </p>

                <h3>
                  {item.title}
                </h3>

                <p className="cart-price">
                  ₹{Number(item.price).toLocaleString("en-IN")}
                </p>

                {/* Quantity */}
                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>

              </div>

              {/* Remove */}
              <button
                className="remove-cart"
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
                🗑️
              </button>

            </div>
          ))}

        </div>

        {/* Order Summary */}
        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">
            <span>
              Subtotal
            </span>

            <strong>
              ₹{totalPrice.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Delivery
            </span>

            <strong className="free">
              FREE
            </strong>
          </div>

          <hr />

          <div className="summary-total">
            <span>
              Total
            </span>

            <strong>
              ₹{totalPrice.toLocaleString("en-IN")}
            </strong>
          </div>

          <Link
            to="/checkout"
            className="checkout-btn"
          >
            Proceed to Checkout →
          </Link>

          <Link
            to="/products"
            className="continue-shopping-small"
          >
            ← Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;