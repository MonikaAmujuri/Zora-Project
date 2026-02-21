import { useEffect, useState, useNavigate} from "react";
import { fetchUserOrders } from "../../services/orderApi";
import { useAuth } from "../../context/AuthContext";
import { authFetch } from "../../utils/api";
import { Link } from "react-router-dom";
import UserHeader from "../../components/user/UserHeader";
import "./MyOrders.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const { user, loading } = useAuth();
    const navigate = useNavigate;
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [cancelReason, setCancelReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/");
      return;
    }

    fetchOrders();
  }, [user, loading]);

  const fetchOrders = async () => {
  try {
    console.log("Fetching logged-in user orders");

    const res = await authFetch(
      "http://localhost:5000/api/orders/my-orders"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    const data = await res.json();
    setOrders(data);
  } catch (err) {
    console.error("Failed to fetch orders", err);
  }
};

    const confirmCancel = async () => {
        const finalReason =
            cancelReason === "Other" ? customReason : cancelReason;

        if (!finalReason) {
            alert("Please select a reason");
            return;
        }

        try {
            const res = await authFetch(
                `http://localhost:5000/api/orders/cancel/${cancelOrderId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ reason: finalReason }),
                }
            );

            if (!res.ok) {
                alert("Cancel failed");
                return;
            }

            setOrders(prev =>
                prev.map(o =>
                    o._id === cancelOrderId
                        ? { ...o, status: "Cancelled" }
                        : o
                )
            );

            setCancelOrderId(null);
            setCancelReason("");
            setCustomReason("");

        } catch (err) {
            console.error("Cancel error:", err);
        }
    };
    return (
        <div className="my-orders-page">
            <UserHeader/>

    <section className="listing-section">

      {/* HEADER */}
      <div className="listing-header">
        <h2 className="page-title">My Orders</h2>
        <p className="page-subtitle">
          Track and manage your recent purchases
        </p>
        <div className="title-divider"></div>
      </div>

      {/* ORDERS */}
                {orders.length === 0 ? (
                    <p className="empty-text">You haven’t placed any orders yet</p>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div className="order-card" key={order._id}>
                                <div className="order-left">
                                    <p className="order-id">Order #{order._id}</p>
                                    <p className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="order-center">
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                    
                                </div>

                                <div className="order-right">
                                    <Link to={`/order/${order._id}`} className="view-btn">
                                        View Details →
                                    </Link>
                                    {order.status === "Pending" &&
                                        order.status !== "Cancelled" &&
                                        order.status !== "Delivered" && (
                                            <button
                                                className="cancel-btn"
                                                onClick={() => setCancelOrderId(order._id)}
                                            >
                                                Cancel Order
                                            </button>
                                        )
                                    }
                                </div>

                            </div>
                        ))}

                    </div>
                )}
            </section>
            {cancelOrderId && (
                <div className="cancel-overlay">
                    <div className="cancel-modal-box">

                        <h3>Cancel Order</h3>
                        <p className="cancel-subtext">
                            Please tell us why you're cancelling this order.
                        </p>

                        <select
                            className="cancel-select"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                        >
                            <option value="">Select reason</option>
                            <option value="Ordered by mistake">Ordered by mistake</option>
                            <option value="Found better price">Found better price</option>
                            <option value="Delivery delay">Delivery delay</option>
                            <option value="Change of mind">Change of mind</option>
                            <option value="Other">Other</option>
                        </select>

                        {cancelReason === "Other" && (
                            <textarea
                                className="cancel-textarea"
                                placeholder="Please enter your reason..."
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                            />
                        )}

                        <div className="cancel-actions">
                            <button
                                className="cancel-close-btn"
                                onClick={() => setCancelOrderId(null)}
                            >
                                Keep Order
                            </button>

                            <button
                                className="cancel-confirm-btn"
                                onClick={confirmCancel}
                            >
                                Confirm Cancellation
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrders;
