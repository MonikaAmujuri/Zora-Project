import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user, loading, logout, updateUser } = useAuth();
  const navigate = useNavigate();


  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  const handleSave = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/users/update-profile",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          name,
          password,
        }),
      }
    );

    const data = await res.json();

    if (res.ok) {
      setMessage("Profile updated successfully");

      // ✅ THIS IS THE KEY LINE
      updateUser(data.user);

      setPassword("");
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

        <label>Email</label>
        <input type="email" value={user.email} disabled />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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