import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {
  return (
    <div className="success-page">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Your order has been placed and is being processed.</p>

      <Link to="/" className="success-btn">
        Continue Shopping
      </Link>
    </div>
  );
}

export default OrderSuccess;
