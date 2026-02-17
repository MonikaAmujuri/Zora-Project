import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../../components/user/CheckoutSteps";
import { useAuth } from "../../context/AuthContext";
import "./Address.css";

function Address() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    street: "",
    city: "",
    pincode: "",
    phone: "",
  });

  /* LOAD SAVED ADDRESSES */
  useEffect(() => {
  if (!user?._id) return;

  fetch(`http://localhost:5000/api/address/${user._id}`)
    .then(res => res.json())
    .then(data => setAddresses(data));
}, [user]);


  /* ADD NEW ADDRESS */
  const addAddress = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/address/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        name: form.name,
        street: form.street,
        city: form.city,
        pincode: form.pincode,
        phone: form.phone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Address save failed:", data);
      alert("Failed to save address");
      return;
    }

    // refresh address list
    const listRes = await fetch(
      `http://localhost:5000/api/address/${user._id}`
    );
    const list = await listRes.json();
    setAddresses(list);

    // reset form
    setForm({
      name: "",
      street: "",
      city: "",
      pincode: "",
      phone: "",
    });
  } catch (err) {
    console.error("Add address error:", err);
  }
};

  /* CONTINUE TO PAYMENT */
  const continueToPayment = () => {
  const selected = addresses.find(a => a._id === selectedId);

  if (!selected) {
    alert("Please select an address");
    return;
  }

  localStorage.setItem("selectedAddress", JSON.stringify(selected));
  navigate("/payment");
};

  return (
    <div className="address-page">
      <h2>Delivery Address</h2>
      <CheckoutSteps step={2} />

      {/* SAVED ADDRESSES */}
      {addresses.map(addr => (
        <label key={addr._id} className="address-card">
          <input
            type="radio"
            checked={selectedId === addr._id}
            onChange={() => setSelectedId(addr._id)}
          />
          <div>
            <strong>{addr.name}</strong>
            <p>{addr.street}</p>
            <p>{addr.city} - {addr.pincode}</p>
            <p>{addr.phone}</p>
          </div>
        </label>
      ))}
      {/* ADD NEW ADDRESS */}
      <div className="add-address">
        <h3>Add New Address</h3>

        <input placeholder="Name" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Street"
          value={form.street}
          onChange={e => setForm({ ...form, street: e.target.value })} />

        <input placeholder="City"
          value={form.city}
          onChange={e => setForm({ ...form, city: e.target.value })} />

        <input placeholder="Pincode"
          value={form.pincode}
          onChange={e => setForm({ ...form, pincode: e.target.value })} />

        <input placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })} />

        <button onClick={addAddress}>Save Address</button>
      </div>

      <button className="continue-btn" onClick={continueToPayment}>
        Continue to Payment →
      </button>
    </div>
  );
}

export default Address;
