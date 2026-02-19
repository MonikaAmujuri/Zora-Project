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
    const identifier = user.email || user.phone;

    console.log("Fetching orders for:", identifier);

    const res = await authFetch(
      `http://localhost:5000/api/orders/user/${identifier}`
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

    const cancelOrder = async (orderId) => {
        if (!window.confirm("Cancel this order?")) return;

        try {
            const res = await fetch(
                `http://localhost:5000/api/orders/cancel/${orderId}`,
                { method: "PUT" }
            );

            if (!res.ok) {
                const text = await res.text();
                console.error("Cancel failed:", text);
                alert("Cancel API failed");
                return;
            }

            const data = await res.json();

            setOrders(prev =>
                prev.map(o =>
                    o._id === orderId ? { ...o, status: "Cancelled" } : o
                )
            );
        } catch (err) {
            console.error("Cancel error:", err);
            alert("Something went wrong");
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
                                <span className="order-total">₹ {order.total}</span>
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
                                                onClick={() => cancelOrder(order._id)}
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
        </div>
    );
}

export default MyOrders;
