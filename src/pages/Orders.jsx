
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Orders.css";

const API_URL = "http://localhost:5000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("auramart-token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("auramartToken");

        if (!token) {
          setError("Please log in to view your orders.");
          return;
        }

        const response = await fetch(
          `${API_URL}/api/orders/my-orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(
            data.message || "Unable to load your orders."
          );
        }

        const fetchedOrders = Array.isArray(data)
          ? data
          : data.orders || data.data || [];

        const formattedOrders = fetchedOrders.map(
          (order, orderIndex) => ({
            id: order._id || order.id || `order-${orderIndex}`,
            date: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN")
              : "N/A",
            status: order.orderStatus || order.status || "Placed",
            paymentMethod: order.paymentMethod || "COD",
            total: Number(
              order.totalAmount ?? order.total ?? 0
            ),
            items: (order.items || []).map((item, index) => ({
              id:
                item._id ||
                item.productId ||
                `item-${index}`,
              title: item.name || item.title || "Product",
              image: item.image || "",
              price: Number(item.price || 0),
              quantity: Number(item.quantity || 1),
            })),
          })
        );

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message || "Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-page">
        <section className="orders-header">
          <p>YOUR AURAMART ACCOUNT</p>
          <h1>My Orders</h1>
          <span>Loading your orders...</span>
        </section>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <section className="orders-header">
        <p>YOUR AURAMART ACCOUNT</p>
        <h1>My Orders</h1>
        <span>Track your recent purchases</span>
      </section>

      {error ? (
        <div className="no-orders">
          <div>⚠️</div>
          <h2>Couldn't load orders</h2>
          <p>{error}</p>

          <button onClick={() => window.location.reload()}>
            Try Again
          </button>

          <p>
            Please check your login and make sure the backend
            server is running.
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <div>📦</div>
          <h2>No orders yet</h2>
          <p>Your completed orders will appear here.</p>
          <Link to="/products">Start Shopping →</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-top">
                <div className="order-meta">
                  <span>Order ID</span>
                  <strong>{order.id}</strong>
                </div>

                <div className="order-meta">
                  <span>Date</span>
                  <strong>{order.date}</strong>
                </div>

                <div className="order-status">
                  ✓ {order.status}
                </div>
              </div>

              <div className="order-products">
                {order.items.map((item) => (
                  <div className="order-product" key={item.id}>
                    {item.image ? (
                      <div className="order-product-image">
                        <img
                          src={item.image}
                          alt={item.title}
                        />
                      </div>
                    ) : (
                      <div className="order-product-image image-placeholder">
                        📦
                      </div>
                    )}

                    <div className="order-product-info">
                      <h3>{item.title}</h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>

                    <strong className="order-product-price">
                      ₹
                      {(item.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-bottom">
                <span>
                  Payment: {order.paymentMethod.toUpperCase()}
                </span>

                <strong>
                  Total: ₹
                  {order.total.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
