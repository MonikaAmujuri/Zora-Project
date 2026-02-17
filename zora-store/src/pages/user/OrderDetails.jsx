import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams(); // ✅ only ONE param
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${id}`
        );

        if (!res.ok) {
          throw new Error("Order not found");
        }

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

  /* STATES */
  if (loading) {
    return <p className="empty-text">Loading order...</p>;
  }

  if (!order) {
    return <p className="empty-text">Order not found</p>;
  }

  return (
    <div className="order-details-page">
      <h2 className="order-title">Order Details</h2>

      <div className="order-card">
        {/* META */}
        <div className="order-meta">
          <p><strong>Order ID:</strong> #{order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p><strong>Email:</strong> {order.userEmail}</p>
        </div>

        {/* ITEMS */}
        {order.items.map((item, index) => (
          <div className="order-item" key={index}>
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
            </div>
          </div>
        ))}

        {/* TOTAL */}
        <div className="order-total">
          <h3>Total: ₹ {order.total}</h3>
        </div>

        {/* ADDRESS */}
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
  );
}

export default OrderDetails;
