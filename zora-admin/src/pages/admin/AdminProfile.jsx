import { useEffect, useState } from "react";
import { authFetch } from "../../utils/api";
import "./AdminProfile.css";
import { useAdmin } from "../../context/AdminContext";

function AdminProfile() {
  const { logout, login } = useAdmin();

  const [admin, setAdmin] = useState({
    name: "",
    phone: "",
    role: "",
  });

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  /* 🔥 FETCH ADMIN PROFILE */
  const fetchProfile = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/profile"
      );
      const data = await res.json();
      setAdmin(data);
      setName(data.name);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* 🔥 UPDATE NAME */
  const handleUpdateProfile = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage("Update failed");
        return;
      }
      console.log("Update response:", data);

      // Update token + context
      localStorage.setItem("token", data.token);
      login(data);

      setAdmin(data);
      setMessage("Profile updated successfully");

    } catch (error) {
      console.error("Update error:", error);
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="admin-profile-page">
      <h1 className="profile-title">Admin Profile</h1>

      <div className="profile-card">

        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="avatar">
            {name ? name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <h2>{name}</h2>
            <span className="role-badge">
              Administrator
            </span>
          </div>
        </div>

        {message && <p className="success">{message}</p>}

        {/* PROFILE INFO */}
        <div className="profile-info">

          <div className="info-row">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="profile-input"
            />
          </div>

          <div className="info-row">
            <label>Phone</label>
            <div className="profile-value">{admin.phone}</div>
          </div>

          <div className="info-row">
            <label>Role</label>
            <div className="profile-value">Full Access</div>
          </div>

        </div>

        <button
          className="update-btn"
          onClick={handleUpdateProfile}
        >
          Save Changes
        </button>
        

        {/* LOGOUT */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default AdminProfile;