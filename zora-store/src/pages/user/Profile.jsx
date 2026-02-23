import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user, loading, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  if (user?.address) {
    setStreet(user.address.street || "");
    setCity(user.address.city || "");
    setPincode(user.address.pincode || "");
  }
}, [user]);

useEffect(() => {
  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/address/${user._id}`
      );

      const data = await res.json();
      setAddresses(data);
    } catch (err) {
      console.error("Failed to fetch addresses");
    }
  };

  if (user?._id) {
    fetchAddresses();
  }
}, [user]);

  const [name, setName] = useState(user?.name || "");
  const [addresses, setAddresses] = useState([]);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [message, setMessage] = useState("");

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/users/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            address: {
              street,
              city,
              pincode,
            },
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Profile updated successfully");
        updateUser(data);
      } else {
        setMessage(data.message || "Update failed");
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>

        {message && <p className="success">{message}</p>}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Phone</label>
        <input type="text" value={user.phone} disabled />

        <h3 style={{ marginTop: "25px" }}>Saved Addresses</h3>

        {addresses.length === 0 ? (
          <p style={{ color: "#777" }}>No address added yet</p>
        ) : (
          <div className="profile-address-list">
            {addresses.map((addr) => (
              <div className="profile-address-card" key={addr._id}>
                <p><strong>{addr.name}</strong></p>
                <p>{addr.street}</p>
                <p>{addr.city} - {addr.pincode}</p>
                <p>{addr.phone}</p>

                {addr.isDefault && (
                  <span className="default-badge">Default</span>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          className="manage-address-btn"
          onClick={() => navigate("/address")}
        >
          Manage Addresses
        </button>
        
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;