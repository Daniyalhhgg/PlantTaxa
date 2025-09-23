import { useEffect, useState } from "react";
import API from "../utils/api";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState({}); // track clicked order IDs

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await API.getMyOrders();
        if (!data || data.error) {
          setError(data?.error || "Could not load your orders.");
          setOrders([]);
        } else {
          setOrders(data);
        }
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getTrackingMessage = (status) => {
    if (status === "Pending") return "⏳ Your order is being processed.";
    if (status === "Shipped") return "🚚 Your order is on the way!";
    if (status === "Delivered") return "🎉 Your order has been delivered!";
    return "⚠️ Unknown status.";
  };

  if (loading)
    return (
      <div style={styles.center}>
        <div style={styles.spinner}></div>
        <p>Loading your orders…</p>
      </div>
    );

  if (error)
    return (
      <p style={{ ...styles.center, color: "red" }}>
        ❌ {error}
      </p>
    );

  if (!orders.length)
    return (
      <div style={styles.center}>
        <p style={{ fontSize: 18, color: "#555" }}>You have no orders yet.</p>
      </div>
    );

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📦 My Orders</h2>
      <div style={styles.grid}>
        {orders.map((o) => (
          <div key={o._id} style={styles.card}>
            <h3 style={styles.plantName}>
              {o.plantId?.name || "Unknown Plant"}
            </h3>

            <div style={styles.row}>
              <span style={styles.label}>Quantity:</span>
              <span>{o.quantity}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Price:</span>
              <span>Rs. {o.plantId?.price || 0}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Total:</span>
              <span style={{ fontWeight: "600", color: "#27ae60" }}>
                Rs. {(o.plantId?.price || 0) * o.quantity}
              </span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>City:</span>
              <span>{o.city}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Address:</span>
              <span>{o.address}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Payment:</span>
              <span>{o.paymentMethod}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Status:</span>
              <span style={statusBadge(o.status)}>{o.status}</span>
            </div>

            <div style={styles.row}>
              <span style={styles.label}>Placed On:</span>
              <span>{new Date(o.createdAt).toLocaleDateString()}</span>
            </div>

            {o.status === "Delivered" ? (
              <p style={styles.thankYou}>🎉 Thank you for your order!</p>
            ) : tracking[o._id] ? (
              <p style={styles.trackMsg}>{getTrackingMessage(o.status)}</p>
            ) : (
              <button
                style={styles.trackBtn}
                onClick={() =>
                  setTracking((prev) => ({ ...prev, [o._id]: true }))
                }
              >
                Track Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function statusBadge(status) {
  let bg = "#999",
    color = "white";
  if (status === "Pending") bg = "#777";
  if (status === "Shipped") bg = "orange";
  if (status === "Delivered") bg = "green";
  return {
    background: bg,
    color,
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
  };
}

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    background: "#f8f9fa",
    minHeight: "100vh",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "26px",
    color: "#2c3e50",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "14px",
    padding: "18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s",
  },
  plantName: {
    margin: "0 0 12px 0",
    color: "#27ae60",
    fontSize: "18px",
    textAlign: "center",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#333",
    flexWrap: "wrap",
  },
  label: { fontWeight: "600" },
  center: {
    textAlign: "center",
    padding: "40px 20px",
    fontFamily: "Poppins, sans-serif",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #eee",
    borderTop: "4px solid #27ae60",
    borderRadius: "50%",
    margin: "0 auto 10px",
    animation: "spin 1s linear infinite",
  },
  trackBtn: {
    marginTop: "10px",
    background: "#27ae60",
    color: "white",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    width: "100%",
    fontSize: "14px",
  },
  trackMsg: {
    marginTop: "12px",
    background: "#f1f9ff",
    color: "#2c3e50",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "500",
    textAlign: "center",
    fontSize: "14px",
  },
  thankYou: {
    marginTop: "12px",
    background: "#eafaf1",
    color: "#27ae60",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "600",
    textAlign: "center",
    fontSize: "14px",
  },
};

// Spinner animation
const styleEl = document.createElement("style");
styleEl.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  h2 {
    font-size: 22px !important;
  }
  .card {
    padding: 14px !important;
  }
  button {
    font-size: 13px !important;
    padding: 7px 10px !important;
  }
}
`;
document.head.appendChild(styleEl);
