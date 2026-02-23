import { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // 🔥 Load Orders
  const loadOrders = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/orders"
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🔥 Update Order Status
  const updateStatus = async (orderId, status) => {
    try {
      await authFetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      loadOrders(); // reload after update
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
    }
  };
  console.log(orders);

  return (
    <div className="orders-page">
      <h1 className="page-title">Orders</h1>

      <div className="orders-card">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Items</th>
              <th>Total</th>
              <th>Address</th>
              <th>Status</th>
              <th>Cancel Reason</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" className="empty-text">
                  No orders found
                </td>
              </tr>
            )}

            {orders.map(order => (
              <tr key={order._id}>
                <td>#{order._id.slice(-6)}</td>

                <td>{order.user?.phone || "N/A"}</td>

                <td className="items-cell">
                  {order.items.map(i => (
                    <div key={i.productId}>
                      {i.name} × {i.qty}
                    </div>
                  ))}
                </td>

                <td>₹ {order.total}</td>
                <td>
                  <button
                    className="address-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Address
                  </button>
                </td>

                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
               
                <td>
                  {order.status === "Cancelled"
                    ? order.cancelReason || "No reason"
                    : "-"}
                </td>

                <td>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>

                <td>
                  <select
                    className={`status-select ${order.status.toLowerCase()}`}
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrder && (
        <div className="address-overlay">
          <div className="address-modal">
            <h3>Delivery Address</h3>

            <p><strong>{selectedOrder.address?.name}</strong></p>
            <p>{selectedOrder.address?.street}</p>
            <p>
              {selectedOrder.address?.city} - {selectedOrder.address?.pincode}
            </p>
            <p>📞 {selectedOrder.address?.phone}</p>

            <button
              onClick={() => setSelectedOrder(null)}
              className="close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;