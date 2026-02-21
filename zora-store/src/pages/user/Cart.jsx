import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/UserHeader";
import CheckoutSteps from "../../components/user/CheckoutSteps";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { user, loading } = useAuth();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  if (!user?._id) return;

  fetch(`http://localhost:5000/api/cart/${user._id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      setCart(data.items || []);
    });
}, [user, location.pathname]); // 🔥 IMPORTANT

  if (loading) return null;
  if (!user) return null; // or redirect to login

const totalOriginal = cart.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

const totalFinal = cart.reduce(
  (sum, item) => sum + item.finalPrice * item.qty,
  0
);

const totalSaved = totalOriginal - totalFinal;


  const total = cart.reduce(
  (sum, item) => sum + item.finalPrice * item.qty,
  0
);


  const updateQty = async (productId, qty) => {
  await fetch("http://localhost:5000/api/cart/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      userId: user._id,
      productId,
      quantity: qty,
    }),
  });

  setCart(prev =>
    prev.map(item =>
      item.id === productId ? { ...item, qty } : item
    )
  );
};
  const removeItem = async (productId) => {
  await fetch("http://localhost:5000/api/cart/remove", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      userId: user._id,
      productId,
    }),
  });

  setCart(prev => prev.filter(item => item.id !== productId));
};



  return (
    <div>
      <UserHeader/>
    <section className="listing-section">
  <div className="listing-header">
    <h2 className="page-title">My Cart</h2>
    <p className="page-subtitle">
      Review your selections before checkout
    </p>
    <div className="title-divider"></div>
  </div>
        <>
          <div className="cart-list">
            <CheckoutSteps step={1} /> 
            {cart.map(item => (
              <div className="cart-card" key={item.id}>
                <img
                  src={item.image || "/placeholder.png"}
                  alt={item.name}
                />

                <div className="cart-price">
                  <span className="final-price">₹ {item.finalPrice}</span>

                  {item.discount > 0 && (
                    <span className="original-price">₹ {item.price}</span>
                  )}


                  {item.discount > 0 && (
                    <p className="saved-text">
                      You saved ₹ {(item.price - item.finalPrice) * item.qty}
                    </p>
                  )}

    
                  <div className="qty-row">
                    <button
                      onClick={() =>
                        updateQty(item.id, Math.max(1, item.qty - 1))
                      }
                    >
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(item.id, item.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
            {totalSaved > 0 && (
              <p className="you-saved">
                You saved <strong>₹ {totalSaved}</strong> 🎉
              </p>
            )}
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
            <button
              onClick={() => navigate("/address")}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      </section>
      </div>
  );
}

export default Cart;
