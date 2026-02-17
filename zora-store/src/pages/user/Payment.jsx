import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import CheckoutSteps from "../../components/user/CheckoutSteps";
import { createOrder } from "../../services/orderApi";
import { useAuth } from "../../context/AuthContext"
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState("");


  const address = JSON.parse(
    localStorage.getItem("selectedAddress")
  );
  if (!address) {
    return (
      <div className="payment-page">
        <CheckoutSteps step={3} />
        <p style={{ padding: "20px" }}>
          No address selected. Please go back and select an address.
        </p>
      </div>
    );
  }

  useEffect(() => {
  if (!user?._id) return;

  fetch(`http://localhost:5000/api/cart/${user._id}`)
    .then(res => res.json())
    .then(data => {
      const items = data.items || [];

      setCart(items);

      const calculatedTotal = items.reduce(
        (sum, item) => sum + item.finalPrice * item.qty,
        0
      );

      setTotal(calculatedTotal);
    });
}, [user]);

  const payments = {
  cod: true,
  upi: true,
  card: true,
};

  /* PLACE ORDER */

const placeOrder = async () => {
  console.log("PAYMENT PAYLOAD:", {
  userId: user._id,
  method: selectedPayment.toUpperCase(),
  amount: total,
});
  if (!address || cart.length === 0 || !selectedPayment) {
    alert("Please select address and payment method");
    return;
  }

  try {
    /* 1️⃣ CREATE PAYMENT */
    const paymentRes = await fetch(
      "http://localhost:5000/api/payment/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          method: selectedPayment.toUpperCase(),
          amount: total,
          transactionId:
            selectedPayment === "cod"
              ? null
              : Date.now().toString(),
        }),
      }
    );

    const payment = await paymentRes.json();
    if (!paymentRes.ok) throw new Error("Payment failed");

    /* 2️⃣ CREATE ORDER */
    const newOrder = {
  userEmail: user.email, // ✅ REQUIRED FIELD
  items: cart.map(item => ({
    productId: item.id,
    name: item.name,
    image: item.image,
    price: item.price,
    finalPrice: item.finalPrice,
    discount: item.discount,
    qty: item.qty,
  })),
  address: {
    name: address.name,
    phone: address.phone,
    street: address.street,
    city: address.city,
    pincode: address.pincode,
  },
  total,
  paymentMethod: selectedPayment.toUpperCase(),
};
    await createOrder(newOrder);
    console.log("CLEARING CART FOR USER:", user._id);

    /* 3️⃣ CLEAR CART (MongoDB) */
await fetch("http://localhost:5000/api/cart/clear", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: user._id }),
});

/* 4️⃣ CLEAR LOCAL STORAGE CART */
localStorage.removeItem("cart");
localStorage.removeItem("selectedAddress");

/* 5️⃣ REFRESH CART BADGE */
window.dispatchEvent(new Event("cartUpdated"));

/* 6️⃣ SUCCESS */
navigate("/order-success");
  } catch (err) {
    console.error(err);
    alert("Order failed");
  }
};

  return (
    <div className="payment-page">
      <h2>Payment</h2>
      <CheckoutSteps step={3} />

      {/* ADDRESS SUMMARY */}
      <div className="summary-card">
        <h3>Deliver To</h3>
        <p><strong>{address?.name}</strong></p>
        <p>{address?.street}</p>
        <p>{address?.city} - {address?.pincode}</p>
        <p>{address?.phone}</p>
      </div>

      {/* ORDER SUMMARY */}
      <div className="summary-card">
        <h3>Order Summary</h3>
        {cart.map(item => (
          <p key={item.id}>
            {item.name} × {item.qty} — ₹ {item.price * item.qty}
          </p>
        ))}
        <hr />
        <h3>Total: ₹ {total}</h3>
      </div>

      {/* PAYMENT METHOD */}
      <div className="summary-card">
        <h3>Select Payment Method</h3>
        <div className="payment-methods"></div>
        {payments.cod && (
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={selectedPayment === "cod"}
              onChange={() => setSelectedPayment("cod")}
            />
            Cash on Delivery
          </label>
        )}

        {payments.upi && (
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={selectedPayment === "upi"}
              onChange={() => setSelectedPayment("upi")}
            />
            UPI Payment
          </label>
        )}

        {payments.card && (
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={selectedPayment === "card"}
              onChange={() => setSelectedPayment("card")}
            />
            Credit / Debit Card
          </label>
        )}

        {selectedPayment === "upi" && (
  <div className="upi-box">
    <p className="upi-title">Scan & Pay via UPI</p>

    <img
      src="/upi-qr.png"
      alt="UPI QR Code"
      className="upi-qr"
    />

    <p className="upi-note">
      Use Google Pay / PhonePe / Paytm
    </p>
  </div>
)}


  {/* If no payment enabled */}
  {!payments.cod && !payments.upi && !payments.card && (
    <p className="no-payment">
      ⚠️ No payment methods available. Please contact support.
    </p>
  )}
      </div>

      <button
        className="place-order-btn"
        onClick={placeOrder}
        disabled={!selectedPayment}
      >
        Place Order
      </button>
    </div>
  );
}

export default Payment;
