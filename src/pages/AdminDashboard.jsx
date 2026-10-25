
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

const emptyForm = {
  name: "",
  brand: "",
  description: "",
  price: "",
  image: "",
  category: "smartphones",
  stock: "",
  rating: "0",
  reviews: "0",
};

const ORDER_STATUSES = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function getOrderTotal(order) {
  return Number(
    order.totalAmount ?? order.total ?? order.amount ?? 0
  );
}

function getOrderStatus(order) {
  return String(order.orderStatus || order.status || "Placed");
}

function getCustomerName(order) {
  return (
    order.shippingAddress?.fullName ||
    order.shippingAddress?.name ||
    order.customerName ||
    order.user?.name ||
    "Customer"
  );
}

function getCustomerPhone(order) {
  return (
    order.shippingAddress?.phone ||
    order.user?.phone ||
    ""
  );
}

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/products");
      const data = response.data;

      const productList = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setProducts(productList);
    } catch (err) {
      console.error("Failed to fetch products:", err);

      setError(
        err.response?.data?.message ||
          "Products load zale nahit. Backend server check kar."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // FETCH ORDERS FROM DATABASE
  // =========================

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);

      // api service should already use the backend /api base URL.
      // The backend must authorize this endpoint for admin users.
      const response = await api.get("/orders");
      const data = response.data;

      const orderList = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setOrders(orderList);

      setSelectedStatuses((previous) => {
        const next = { ...previous };

        orderList.forEach((order) => {
          const id = order._id || order.id;

          if (
            id &&
            !Object.prototype.hasOwnProperty.call(next, id)
          ) {
            next[id] = getOrderStatus(order);
          }
        });

        return next;
      });
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      setError(
        err.response?.data?.message ||
          "Orders load zale nahit. Admin login ani backend permissions check kar."
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  // =========================
  // PRODUCT FORM
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      brand: product.brand || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      image: product.image || "",
      category: (product.category || "smartphones").toLowerCase(),
      stock: String(product.stock ?? 0),
      rating: String(product.rating ?? 0),
      reviews: String(product.reviews ?? 0),
    });

    setError("");
    setSuccess("");

    document
      .getElementById("admin-product-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const price = Number(form.price);
    const stock = Number(form.stock);
    const rating = Number(form.rating);
    const reviews = Number(form.reviews);

    if (!form.name.trim()) {
      setError("Product name enter kar.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Valid product price enter kar.");
      return;
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setError("Valid stock quantity enter kar.");
      return;
    }

    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      setError("Rating 0 te 5 madhye enter kar.");
      return;
    }

    if (!Number.isFinite(reviews) || reviews < 0) {
      setError("Reviews chi valid quantity enter kar.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      description: form.description.trim(),
      price,
      image: form.image.trim(),
      category: form.category,
      stock,
      rating,
      reviews,
    };

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setSuccess("Product successfully updated!");
      } else {
        await api.post("/products", payload);
        setSuccess("New product successfully added!");
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err);

      setError(
        err.response?.data?.message ||
          "Product save zala nahi. Backend API routes check kar."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!product._id) {
      setError("Product ID available nahi.");
      return;
    }

    const confirmed = window.confirm(
      `"${product.name}" delete karaycha aahe ka?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingId(product._id);

    try {
      await api.delete(`/products/${product._id}`);

      if (editingId === product._id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      setSuccess("Product successfully deleted!");
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);

      setError(
        err.response?.data?.message ||
          "Product delete zala nahi. Backend DELETE route check kar."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatuses((previous) => ({
      ...previous,
      [orderId]: newStatus,
    }));
  };

  const handleUpdateOrderStatus = async (order) => {
    const orderId = order._id || order.id;

    if (!orderId) {
      setError("Order ID available nahi.");
      return;
    }

    const newStatus = selectedStatuses[orderId];
    const currentStatus = getOrderStatus(order);

    if (!ORDER_STATUSES.includes(newStatus)) {
      setError("Please select a valid order status.");
      return;
    }

    if (newStatus === currentStatus) {
      setSuccess("Order already has this status.");
      setError("");
      return;
    }

    setError("");
    setSuccess("");
    setUpdatingOrderId(orderId);

    try {
      await api.patch(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      setOrders((previous) =>
        previous.map((item) =>
          (item._id || item.id) === orderId
            ? { ...item, orderStatus: newStatus }
            : item
        )
      );

      setSuccess(`Order status updated to ${newStatus}!`);

      // Reload the latest order records from the backend.
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);

      setError(
        err.response?.data?.message ||
          "Order status update zala nahi. Admin permissions ani backend route check kar."
      );

      // Restore the dropdown to the current saved status.
      setSelectedStatuses((previous) => ({
        ...previous,
        [orderId]: currentStatus,
      }));
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =========================
  // DASHBOARD STATISTICS
  // =========================

  const totalRevenue = orders.reduce(
    (total, order) => total + getOrderTotal(order),
    0
  );

  const deliveredOrders = orders.filter(
    (order) => getOrderStatus(order).toLowerCase() === "delivered"
  ).length;

  return (
    <main className="admin-page">
      <div className="admin-container">
        {/* HEADER */}
        <header className="admin-header">
          <div>
            <p className="admin-label">AURAMART MANAGEMENT</p>
            <h1>Admin Dashboard</h1>
            <p>
              Manage your products, inventory and customer orders.
            </p>
          </div>

          <Link to="/products" className="admin-store-link">
            <span aria-hidden="true">←</span> View Store
          </Link>
        </header>

        {/* STATISTICS */}
        <section className="admin-stats">
          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <p>Total Products</p>
              <span className="admin-stat-icon">▣</span>
            </div>
            <h2>{products.length}</h2>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <p>Total Orders</p>
              <span className="admin-stat-icon">▤</span>
            </div>
            <h2>{orders.length}</h2>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <p>Total Order Value</p>
              <span className="admin-stat-icon">₹</span>
            </div>
            <h2>{formatPrice(totalRevenue)}</h2>
          </article>

          <article className="admin-stat-card">
            <div className="admin-stat-top">
              <p>Delivered Orders</p>
              <span className="admin-stat-icon">✓</span>
            </div>
            <h2>{deliveredOrders}</h2>
          </article>
        </section>

        {/* FEEDBACK */}
        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div
            className="admin-alert admin-alert-success"
            role="status"
          >
            {success}
          </div>
        )}

        {/* ADD / EDIT PRODUCT */}
        <section
          className="admin-section admin-product-form-section"
          id="admin-product-form"
        >
          <div className="admin-section-header">
            <div>
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
              <p>
                {editingId
                  ? "Update the selected product details."
                  : "Add a product to your AURAMART collection."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                className="admin-cancel-edit"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form className="admin-product-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label htmlFor="product-name">Product Name *</label>
                <input
                  id="product-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. iPhone 18 Pro"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-brand">Brand</label>
                <input
                  id="product-brand"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Apple"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-price">Price (₹) *</label>
                <input
                  id="product-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-category">Category *</label>
                <select
                  id="product-category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="smartphones">Smartphones</option>
                  <option value="laptops">Laptops</option>
                  <option value="accessories">Accessories</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-stock">Stock Quantity *</label>
                <input
                  id="product-stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-image">Image Path or URL</label>
                <input
                  id="product-image"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/products/product.jpg"
                />
                <small className="admin-field-help">
                  Example: /products/iphone.jpg
                </small>
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-rating">Rating (0–5)</label>
                <input
                  id="product-rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-reviews">Number of Reviews</label>
                <input
                  id="product-reviews"
                  name="reviews"
                  type="number"
                  min="0"
                  step="1"
                  value={form.reviews}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product details..."
                  rows="3"
                />
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* PRODUCT INVENTORY */}
        <section className="admin-section admin-inventory-section">
          <div className="admin-section-header">
            <div>
              <h2>Product Inventory</h2>
              <p>View and manage products available in your store.</p>
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={fetchProducts}
              disabled={loading}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="admin-empty">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="admin-empty">
              <h3>No products found</h3>
              <p>Add your first product using the form above.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="admin-product-cell">
                          <img
                            className="admin-product-thumb"
                            src={
                              product.image ||
                              "/products/placeholder.png"
                            }
                            alt={product.name || "Product"}
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.visibility = "hidden";
                            }}
                          />

                          <div className="admin-product-name">
                            <span>{product.name}</span>
                            <small>{product.brand || "AURAMART"}</small>
                          </div>
                        </div>
                      </td>

                      <td className="admin-category-cell">
                        {product.category || "General"}
                      </td>

                      <td className="admin-price-cell">
                        {formatPrice(product.price)}
                      </td>

                      <td>
                        <span
                          className={`admin-stock ${
                            Number(product.stock) === 0
                              ? "admin-stock-out"
                              : Number(product.stock) <= 5
                                ? "admin-stock-low"
                                : ""
                          }`}
                        >
                          {product.stock ?? 0}
                        </span>
                      </td>

                      <td>
                        ★ {Number(product.rating ?? 0).toFixed(1)}
                      </td>

                      <td>
                        <div className="admin-action-buttons">
                          <button
                            type="button"
                            className="admin-edit-btn"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-btn"
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product._id}
                          >
                            {deletingId === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* DATABASE ORDERS */}
        <section className="admin-section admin-orders-section">
          <div className="admin-section-header">
            <div>
              <h2>Customer Orders</h2>
              <p>
                Orders fetched from your backend database.
              </p>
            </div>

            <button
              type="button"
              className="admin-refresh-btn"
              onClick={fetchOrders}
              disabled={ordersLoading}
            >
              {ordersLoading ? "Loading..." : "↻ Refresh Orders"}
            </button>
          </div>

          {ordersLoading ? (
            <div className="admin-empty">Loading customer orders...</div>
          ) : orders.length === 0 ? (
            <div className="admin-empty">
              <h3>No orders found</h3>
              <p>Placed orders will appear here after they are saved.</p>
            </div>
          ) : (
            <div className="admin-orders-grid">
              {[...orders]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || 0).getTime() -
                    new Date(a.createdAt || 0).getTime()
                )
                .map((order, index) => {
                  const orderId = order._id || order.id;
                  const status = getOrderStatus(order);
                  const statusClass = status
                    .toLowerCase()
                    .replace(/\s+/g, "-");

                  const customer = getCustomerName(order);
                  const phone = getCustomerPhone(order);
                  const shipping = order.shippingAddress || {};
                  const items = order.items || [];

                  return (
                    <article
                      className="admin-order-card"
                      key={orderId || index}
                    >
                      <div className="admin-order-card-header">
                        <div>
                          <span className="admin-order-label">
                            ORDER ID
                          </span>
                          <strong className="admin-order-id">
                            {orderId || "N/A"}
                          </strong>
                        </div>

                        <span
                          className={`admin-order-badge ${statusClass}`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="admin-order-details">
                        <div>
                          <span>Customer</span>
                          <strong>{customer}</strong>
                          {phone && <small>{phone}</small>}
                        </div>

                        <div>
                          <span>Order Date</span>
                          <strong>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString(
                                  "en-IN"
                                )
                              : "N/A"}
                          </strong>
                        </div>

                        <div>
                          <span>Payment Method</span>
                          <strong>
                            {String(
                              order.paymentMethod || "COD"
                            ).toUpperCase()}
                          </strong>
                        </div>

                        <div>
                          <span>Payment Status</span>
                          <strong>
                            {order.paymentStatus || "Pending"}
                          </strong>
                        </div>

                        {(shipping.address ||
                          shipping.city ||
                          shipping.pincode) && (
                          <div className="admin-order-address">
                            <span>Shipping Address</span>
                            <strong>
                              {[
                                shipping.address,
                                shipping.city,
                                shipping.state,
                                shipping.pincode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </strong>
                          </div>
                        )}
                      </div>

                      <div className="admin-order-items">
                        <h3>Products ({items.length})</h3>

                        {items.length === 0 ? (
                          <p className="admin-order-no-items">
                            No product details available.
                          </p>
                        ) : (
                          items.map((item, itemIndex) => (
                            <div
                              className="admin-order-item"
                              key={
                                item._id ||
                                item.productId ||
                                itemIndex
                              }
                            >
                              <div className="admin-order-item-info">
                                <strong>
                                  {item.name || item.title || "Product"}
                                </strong>
                                <span>
                                  Qty: {Number(item.quantity || 1)}
                                </span>
                              </div>

                              <strong>
                                {formatPrice(
                                  Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                )}
                              </strong>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="admin-order-total">
                        <span>Order Total</span>
                        <strong>{formatPrice(getOrderTotal(order))}</strong>
                      </div>

                      <div className="admin-order-update">
                        <label htmlFor={`status-${orderId}`}>
                          Update Order Status
                        </label>

                        <div className="admin-order-status-controls">
                          <select
                            id={`status-${orderId}`}
                            value={
                              selectedStatuses[orderId] || status
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                orderId,
                                event.target.value
                              )
                            }
                            disabled={updatingOrderId === orderId}
                          >
                            {ORDER_STATUSES.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateOrderStatus(order)
                            }
                            disabled={
                              updatingOrderId === orderId ||
                              (selectedStatuses[orderId] || status) ===
                                status
                            }
                          >
                            {updatingOrderId === orderId
                              ? "Updating..."
                              : "Update Status"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
