import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authFetch } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/UserHeader";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [ratings, setRatings] = useState({});
  const [reviewText, setReviewText] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await authFetch(
          `http://localhost:5000/api/orders/${id}`
        );

        if (!res.ok) throw new Error("Order not found");

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const submitReview = async (productId) => {
    const rating = ratings[productId];
    const comment = reviewText[productId];

    if (!rating) {
      alert("Please select rating");
      return;
    }

    try {
      await authFetch("http://localhost:5000/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      alert("Review submitted successfully!");

      // Optional: Clear review after submit
      setRatings((prev) => ({ ...prev, [productId]: 0 }));
      setReviewText((prev) => ({ ...prev, [productId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  if (loading) return <p className="empty-text">Loading order...</p>;
  if (!order) return <p className="empty-text">Order not found</p>;

  return (
    <>
    <UserHeader />
    <div className="order-details-page">
      <h2 className="order-title">Order Details</h2>

      <div className="order-card">

        {/* ================= ORDER META ================= */}
        <div className="order-meta">
          <p><strong>Order ID:</strong> #{order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p><strong>Phone:</strong> {order.address?.phone}</p>
        </div>

        {/* ================= TIMELINE ================= */}
        <div className="order-timeline">
          <div className={`timeline-step completed`}>
            <div className="circle"></div>
            <div className="label">Ordered</div>
          </div>

          <div
            className={`timeline-step ${order.status === "Shipped" ||
                order.status === "Delivered"
                ? "completed"
                : ""
              }`}
          >
            <div className="circle"></div>
            <div className="label">Shipped</div>
          </div>

          <div
            className={`timeline-step ${order.status === "Delivered"
                ? "completed"
                : order.status === "Cancelled"
                  ? "cancelled"
                  : ""
              }`}
          >
            <div className="circle"></div>
            <div className="label">
              {order.status === "Cancelled"
                ? "Cancelled"
                : "Delivered"}
            </div>
          </div>
        </div>

        {/* ================= ITEMS ================= */}
          {order.items.map((item, index) => (
          <div className="order-item" key={index}
              onClick={() => navigate(`/product/${item.productId}`)}>
            <div className="order-info">
              <h4>{item.name}</h4>

              <div className="order-price">
                <span className="final-price">
                  ₹ {item.finalPrice} × {item.qty}
                </span>

                {item.discount > 0 && (
                  <span className="original-price">
                    ₹ {item.price}
                  </span>
                )}
              </div>

              {item.discount > 0 && (
                <p className="saved-text">
                  You saved ₹{" "}
                  {(item.price - item.finalPrice) * item.qty}
                </p>
              )}

              {/* ================= RATING SECTION ================= */}
              {order.status === "Delivered" && (
                <button
                  className="rate-product-btn"
                  onClick={() =>
                    navigate(`/product/${item.productId}?review=true`)
                  }
                >
                  ⭐ Rate Product
                </button>
              )}
            </div>
          </div>
        ))}
            
          

        {/* ================= TOTAL ================= */}
      
        <div className="order-total">
          <h3>Total: ₹ {order.total}</h3>
        </div>

        {/* ================= ADDRESS ================= */}
        <div className="order-address">
          <h3>Delivery Address</h3>
          <p><strong>{order.address.name}</strong></p>
          <p>{order.address.street}</p>
          <p>
            {order.address.city} - {order.address.pincode}
          </p>
          <p>{order.address.phone}</p>
        </div>

      </div>
    </div>
    </>
  );
}

export default OrderDetails;