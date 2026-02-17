import "./CheckoutSteps.css";

function CheckoutSteps({ step }) {
  return (
    <div className="checkout-steps">
      <div className={`step ${step >= 1 ? "active" : ""}`}>
        <span>1</span>
        <p>Cart</p>
      </div>

      <div className={`line ${step >= 2 ? "active" : ""}`} />

      <div className={`step ${step >= 2 ? "active" : ""}`}>
        <span>2</span>
        <p>Address</p>
      </div>

      <div className={`line ${step >= 3 ? "active" : ""}`} />

      <div className={`step ${step >= 3 ? "active" : ""}`}>
        <span>3</span>
        <p>Payment</p>
      </div>
    </div>
  );
}

export default CheckoutSteps;
