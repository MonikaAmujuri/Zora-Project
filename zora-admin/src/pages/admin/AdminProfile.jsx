import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { authFetch } from "../../utils/api";
import "./AdminProfile.css";

function AdminProfile() {
  const { logout } = useAuth();

  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* 🔥 FETCH ADMIN PROFILE */
  const fetchProfile = async () => {
    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/profile"
      );
      const data = await res.json();
      setAdmin(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* 🔥 UPDATE PASSWORD */
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await authFetch(
        "http://localhost:5000/api/admin/profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            password: newPassword,
          }),
        }
      );

      if (!res.ok) {
        alert("Password update failed");
        return;
      }

      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {
      console.error("Password update error:", error);
    }
  };

  return (
    <div className="admin-profile-page">
      <h1 className="profile-title">Admin Profile</h1>

      <div className="profile-card">

        {/* PROFILE HEADER */}
        <div className="profile-header">
          <div className="avatar">
            {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <h2>{admin.name}</h2>
            <span className="role-badge">
              {admin.role === "admin" ? "Administrator" : admin.role}
            </span>
          </div>
        </div>

        {/* PROFILE INFO */}
        <div className="profile-info">
          <div className="info-row">
            <label>Email</label>
            <span>{admin.email}</span>
          </div>

          <div className="info-row">
            <label>Role</label>
            <span>
              {admin.role === "admin" ? "Full Access" : admin.role}
            </span>
          </div>
        </div>

        {/* PASSWORD SECTION */}
        <div className="password-section">
          <h3>Change Password</h3>

          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="update-btn"
            onClick={handleUpdatePassword}
            disabled={!newPassword || !confirmPassword}
          >
            Update Password
          </button>

          <small className="note">
            Password update connected to backend
          </small>
        </div>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>

      </div>
    </div>
  );
}

export default AdminProfile;